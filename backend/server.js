// server.js
const express = require('express');
const multer = require('multer');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // For Rasa and Telecom API calls
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const upload = multer({ dest: 'uploads/' }); // In production, use MinIO S3 SDK

// --- AUTHENTICATION ---
app.post('/api/auth/register', async (req, res) => {
    const { name, phone, email, password, role, language, village } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, phone_number, email, password_hash, role, preferred_language, village_location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
            [name, phone, email, password, role, language, village]
        );
        res.status(201).json({ userId: result.rows[0].user_id });
    } catch (err) {
        res.status(400).json({ error: "Registration failed. Phone/Email may already exist." });
    }
});

// --- FARMER MODULES ---
app.post('/api/diseases/report', upload.fields([{ name: 'image' }, { name: 'voice' }]), async (req, res) => {
    const { farmer_id, crop_name, description } = req.body;
    const imageUrl = req.files['image'] ? `/storage/${req.files['image'][0].filename}` : null;
    const voiceUrl = req.files['voice'] ? `/storage/${req.files['voice'][0].filename}` : null;

    try {
        const result = await pool.query(
            'INSERT INTO disease_reports (farmer_id, crop_name, image_url, voice_note_url, description_text) VALUES ($1, $2, $3, $4, $5) RETURNING report_id',
            [farmer_id, crop_name, imageUrl, voiceUrl, description]
        );
        res.json({ message: "Report uploaded successfully", id: result.rows[0].report_id });
    } catch (err) {
        res.status(500).json({ error: "Upload failed" });
    }
});

app.get('/api/guides/inputs', async (req, res) => {
    const { category, language } = req.query;
    const result = await pool.query(
        'SELECT * FROM fertilizer_guide WHERE category = $1 AND language = $2',
        [category, language]
    );
    res.json(result.rows);
});

// --- AI BOT INTEGRATION (Rasa) ---
app.post('/api/bot/ask', async (req, res) => {
    const { text, user_id, language } = req.body;
    try {
        const rasaResponse = await axios.post(`${process.env.RASA_URL}/webhooks/rest/webhook`, {
            sender: user_id,
            text: text
        });
        res.json({ replies: rasaResponse.data });
    } catch (err) {
        res.status(500).json({ error: "AI Bot unavailable" });
    }
});

// --- RESEARCHER & ADMIN PORTAL ---
app.post('/api/research/submit', async (req, res) => {
    const { researcher_id, ...data } = req.body;
    try {
        await pool.query(
            'INSERT INTO research_updates (researcher_id, crop_name, scientific_name, disease_name, symptoms, organic_cure, industrial_cure, prevention_steps) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [researcher_id, data.crop, data.scientific, data.disease, data.symptoms, data.organic, data.industrial, data.prevention]
        );
        res.json({ message: "Research data submitted for verification" });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// --- TELECOM BROADCAST SYSTEM (Asterisk/Kannel Bridge) ---
app.post('/api/telecom/broadcast', async (req, res) => {
    const { title, message, voice_url, alert_type, region, language } = req.body;
    
    try {
        // 1. Log alert in DB
        const alertRes = await pool.query(
            'INSERT INTO alerts_and_events (title, message_body, voice_recording_url, alert_type, target_region, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING alert_id',
            [title, message, voice_url, alert_type, region, language]
        );
        const alertId = alertRes.rows[0].alert_id;

        // 2. Get target offline farmers
        const farmers = await pool.query(
            'SELECT phone_number FROM users WHERE role = \'offline_farmer\' AND village_location = $1',
            [region]
        );

        // 3. Trigger Asterisk (Voice) and Kannel (SMS)
        const broadcastPromises = farmers.rows.map(async (farmer) => {
            // Simulate Kannel SMS API Call
            await axios.post(`${process.env.KANNEL_URL}/sms`, { to: farmer.phone_number, text: message });
            // Simulate Asterisk AMI Call for Voice
            await axios.post(`${process.env.ASTERISK_URL}/call`, { to: farmer.phone_number, audio: voice_url });
            
            return pool.query('INSERT INTO telecom_logs (farmer_id, alert_id, channel, delivery_status) VALUES ($1, $2, $3, $4)', 
                [null, alertId, 'both', 'sent']);
        });

        await Promise.all(broadcastPromises);
        res.json({ message: `Broadcast sent to ${farmers.rowCount} farmers.` });
    } catch (err) {
        res.status(500).json({ error: "Telecom gateway failure" });
    }
});

app.listen(3000, () => console.log('JKCrop24/7 Backend running on port 3000'));