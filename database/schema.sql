-- JKCrop24/7 Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    role VARCHAR(20) CHECK (role IN ('digital_farmer', 'offline_farmer', 'researcher', 'admin')),
    preferred_language VARCHAR(50) DEFAULT 'English',
    village_location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT phone_or_email CHECK (phone_number IS NOT NULL OR email IS NOT NULL)
);

-- 2. Research Updates (The Knowledge Base - seeded from CSV)
CREATE TABLE research_updates (
    update_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    researcher_id UUID REFERENCES users(user_id),
    crop_name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    disease_name VARCHAR(255),
    symptoms TEXT,
    organic_cure TEXT,
    industrial_cure TEXT,
    prevention_steps TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Disease Reports (Farmer Uploads)
CREATE TABLE disease_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES users(user_id),
    crop_name VARCHAR(100),
    image_url TEXT,
    voice_note_url TEXT,
    description_text TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'diagnosed')) DEFAULT 'pending',
    diagnosed_by UUID REFERENCES users(user_id),
    solution_provided TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Media Lectures
CREATE TABLE media_lectures (
    media_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by UUID REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    media_type VARCHAR(10) CHECK (media_type IN ('video', 'audio')),
    file_url TEXT NOT NULL,
    topic_category VARCHAR(100),
    duration INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Fertilizer/Input Guide
CREATE TABLE fertilizer_guide (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(20) CHECK (category IN ('organic', 'industrial')),
    item_type VARCHAR(20) CHECK (item_type IN ('fertilizer', 'pesticide')),
    target_crop VARCHAR(100),
    dosage_instructions TEXT,
    safety_warnings TEXT,
    language VARCHAR(50)
);

-- 6. Alerts and Events (Telecom Broadcasts)
CREATE TABLE alerts_and_events (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message_body TEXT NOT NULL,
    voice_recording_url TEXT,
    alert_type VARCHAR(30) CHECK (alert_type IN ('disease_outbreak', 'govt_scheme', 'physical_camp')),
    target_region TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    language VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Telecom Logs (Audit Trail for Asterisk/Kannel)
CREATE TABLE telecom_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES users(user_id),
    alert_id UUID REFERENCES alerts_and_events(alert_id),
    channel VARCHAR(10) CHECK (channel IN ('sms', 'voice_call')),
    delivery_status VARCHAR(20) CHECK (delivery_status IN ('sent', 'answered', 'failed')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_disease_status ON disease_reports(status);
CREATE INDEX idx_research_crop ON research_updates(crop_name);