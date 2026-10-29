const sample = {
  reports: [
    { id: 1, crop: 'Apple', issue: 'Leaf spots on lower branches', note: 'Small dark spots appeared after the last rain. A few leaves are curling.', location: 'Pampore, Pulwama', date: 'Today, 9:40 AM', status: 'In review', icon: '🍎' },
    { id: 2, crop: 'Paddy', issue: 'Yellowing rice seedlings', note: 'Yellow tips visible across one corner of the field.', location: 'Awantipora, Pulwama', date: 'Yesterday', status: 'Guidance sent', icon: '🌾' }
  ],
  messages: [{ who: 'bot', text: 'Salaam Tariq! I can help with crop health, weather care, and safe use of farm inputs. What is happening in your field?', time: 'Now' }],
  alerts: [
    { type: 'Crop health', level: 'high', title: 'Apple scab watch in Pulwama', text: 'Recent rain and mild temperatures can favour apple scab. Check leaves and fruit, especially in dense parts of the orchard.', region: 'Pulwama district', date: 'Today · 8:30 AM' },
    { type: 'Weather advisory', level: '', title: 'Light showers expected', text: 'Light rain is forecast across the valley this evening. Keep harvested produce covered and avoid spraying before rainfall.', region: 'Kashmir Valley', date: 'Today · 7:00 AM' },
    { type: 'Farmer event', level: '', title: 'Orchard care field session', text: 'Join the local horticulture team for a practical pruning and sanitation session.', region: 'Pampore Community Hall', date: 'Friday · 11:00 AM' },
    { type: 'Government scheme', level: '', title: 'Soil health card enrolment', text: 'Farmers can submit soil samples at the block agriculture office for this season’s soil health card.', region: 'Pulwama block office', date: 'Until 15 Nov' }
  ]
};
const stored = (() => { try { return JSON.parse(localStorage.getItem('jkcrop-demo') || '{}'); } catch { return {}; } })();
const readSession = () => { try { return JSON.parse(localStorage.getItem('jkcrop-session') || 'null'); } catch { return null; } };
const state = { page: 'overview', session: readSession(), role: stored.role || 'Digital farmer', name: stored.name || 'Tariq Ahmad', reports: stored.reports || sample.reports, messages: stored.messages || sample.messages, alerts: stored.alerts || sample.alerts, addedGuides: stored.addedGuides || [], guideFilter: 'All', authMode: 'signup' };
if (state.session && !state.session.demo) {
  state.name = state.session.name || state.name;
  state.role = roleLabel(state.session.role);
}
const content = document.getElementById('content');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const save = () => { localStorage.setItem('jkcrop-demo', JSON.stringify({ role: state.role, name: state.name, reports: state.reports, messages: state.messages, alerts: state.alerts, addedGuides: state.addedGuides })); localStorage.setItem('jkcrop-session', JSON.stringify(state.session)); };
const dateLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
const titleMap = { overview: 'Overview', reports: 'Disease reports', guides: 'Crop guides', assistant: 'Farm assistant', alerts: 'Alerts & events' };
function badge(status) { return `<span class="badge ${status === 'Guidance sent' ? 'reviewed' : 'pending'}">${esc(status)}</span>`; }
function reportRow(report) { return `<div class="report-row"><div class="crop-thumb">${esc(report.icon || '🌱')}</div><div class="report-info"><strong>${esc(report.issue)}</strong><small>${esc(report.crop)} · ${esc(report.location || 'Your farm')} · ${esc(report.date)}</small></div>${badge(report.status)}</div>`; }
function activity(icon, title, when) { return `<div class="activity-item"><span class="activity-icon">${icon}</span><div class="activity-copy"><strong>${title}</strong><small>${when}</small></div></div>`; }
function welcome(kicker, title, description, action = '') { return `<div class="welcome-row"><div><div class="eyebrow">${kicker}</div><h1 class="page-title">${title}</h1><p class="welcome-copy">${description}</p></div>${action}</div>`; }
function overview() {
  const reports = state.reports;
  const farmLocation = state.session && state.session.village ? state.session.village.split(',')[0].trim() : 'Pulwama';
  return `${welcome('Your farm, at a glance', `Good morning, ${esc(state.name.split(' ')[0])} <span style="color:#4b9660">✳</span>`, 'Here is what is happening around your farm today.', `<span class="date-label">${dateLabel}</span>`)}
  <section class="hero"><div class="hero-content"><div class="hero-tag">A little care goes a long way</div><h2>Grow a healthier season</h2><p>Spot a change in your crops? Share a photo and a few details. Your local agriculture team can help you decide what to do next.</p><button class="button" data-action="new-report">＋ &nbsp;Report a crop issue</button></div></section>
  <section class="metrics"><div class="metric"><div class="metric-head">Your reports <span class="metric-symbol">◉</span></div><div class="metric-value">${reports.length.toString().padStart(2,'0')}</div><div class="metric-foot"><em>${reports.filter(x => x.status === 'In review').length} need attention</em></div></div><div class="metric"><div class="metric-head">Crop guides <span class="metric-symbol">▤</span></div><div class="metric-value">12</div><div class="metric-foot">Advice for this season</div></div><div class="metric"><div class="metric-head">Local alerts <span class="metric-symbol">♧</span></div><div class="metric-value">${state.alerts.length.toString().padStart(2,'0')}</div><div class="metric-foot">For your area</div></div><div class="metric"><div class="metric-head">Your location <span class="metric-symbol">⌖</span></div><div class="metric-value" style="font-size:17px;margin-top:14px">${esc(farmLocation)}</div><div class="metric-foot">Kashmir Valley</div></div></section>
  <section class="dashboard-grid"><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Recent disease reports</h2><div class="panel-subtitle">Updates from your fields</div></div><button class="button ghost small" data-page="reports">View all →</button></div><div class="report-list">${reports.slice(0,3).map(reportRow).join('') || '<div class="empty-state">No crop reports yet.</div>'}</div></div><div class="panel"><div class="panel-head"><div><h2 class="panel-title">Around your farm</h2><div class="panel-subtitle">Local updates and reminders</div></div><button class="button ghost small" data-page="alerts">See all →</button></div><div class="activity">${activity('☀','Light showers expected','Weather advisory · Today')}${activity('✳','Apple scab watch in Pulwama','Crop health · Today')}${activity('▤','Orchard field session','Friday at 11:00 AM')}</div></div></section>
  <div class="section-row"><h3>Quick access</h3></div><section class="quick-grid"><button class="quick-card" data-page="reports"><span class="quick-icon">◉</span><strong>Report a disease</strong><small>Get help for your crop</small></button><button class="quick-card" data-page="guides"><span class="quick-icon">▤</span><strong>Crop guides</strong><small>Practical seasonal advice</small></button><button class="quick-card" data-page="assistant"><span class="quick-icon">✳</span><strong>Ask the assistant</strong><small>Get a quick answer</small></button><button class="quick-card" data-page="alerts"><span class="quick-icon">♧</span><strong>Local alerts</strong><small>Weather, events &amp; schemes</small></button></section>`;
}
function reportsPage() {
  const cards = state.reports.map(r => `<article class="report-card"><div class="report-card-top"><span class="report-meta">${esc(r.date)} · ${esc(r.location || 'Your farm')}</span>${badge(r.status)}</div><div class="report-photo">${esc(r.icon || '🌿')}</div><div class="report-meta">${esc(r.crop)} crop</div><h3>${esc(r.issue)}</h3><p>${esc(r.note || 'No additional notes added.')}</p><button class="button secondary small" data-action="report-detail" data-id="${r.id}">View report details</button></article>`).join('');
  return `${welcome('Crop health support','Disease reports','Share symptoms with your local agriculture team and follow progress.', '<button class="button" data-action="new-report">＋ New report</button>')}<div class="page-tools"><input class="search" id="report-search" placeholder="Search crop or symptoms…" /><select class="filter-select" id="status-filter"><option>All reports</option><option>In review</option><option>Guidance sent</option></select></div><div class="report-cards" id="report-cards">${cards || '<div class="empty-state">No reports yet. Create your first report to get help.</div>'}</div>`;
}
const guides = [
  { icon:'🍎', category:'Crop care', title:'Apple scab: what to look for', text:'Olive-green or dark spots can appear on leaves and fruit, especially after wet weather. Check the centre of the tree as well as the outer branches.', tags:['Apple','Disease watch'], detail:'Remove fallen leaves when practical. For treatment, ask your local horticulture officer to confirm the disease and recommend a locally approved product.' },
  { icon:'🌾', category:'Crop care', title:'Paddy seedling yellowing', text:'Yellowing can be linked to water, nutrients, or root stress. Look at the field pattern before deciding on a treatment.', tags:['Paddy','Troubleshooting'], detail:'Check whether standing water is too deep, compare affected and healthy patches, and seek local advice before applying fertilizer.' },
  { icon:'♻️', category:'Soil & inputs', title:'Compost for healthier soil', text:'Well-decomposed compost can improve soil structure and support beneficial soil life.', tags:['All crops','Organic'], detail:'Use mature compost without a strong smell. Apply based on your soil test and crop needs.' },
  { icon:'🧤', category:'Safe farming', title:'Safer handling of farm inputs', text:'Read product labels carefully and keep children and animals away while mixing or applying crop products.', tags:['Safety','All crops'], detail:'Use the protective equipment on the label. Never reuse an empty chemical container for food or water.' },
  { icon:'✂️', category:'Seasonal advice', title:'Orchard sanitation after harvest', text:'Removing mummified fruit and fallen leaves can help lower disease carry-over into the next season.', tags:['Apple','Seasonal'], detail:'Collect diseased plant material and dispose of it following local guidance. Clean tools between trees.' },
  { icon:'💧', category:'Soil & inputs', title:'Water wisely in the field', text:'Regularly check soil moisture and drainage. Crop water needs change with growth stage and weather.', tags:['Irrigation','All crops'], detail:'Avoid prolonged waterlogging and follow local irrigation advice for your crop and soil type.' }
];
function guidesPage() {
  const allGuides = [...state.addedGuides, ...guides];
  const filtered = allGuides.filter(g => state.guideFilter === 'All' || g.category === state.guideFilter);
  return `${welcome('Knowledge for every growing season','Crop guides','Straightforward, local-first information to help you make informed farm decisions.', state.role === 'Researcher' ? '<button class="button" data-action="new-guidance">＋ Submit guidance</button>' : '')}<div class="page-tools"><input class="search" id="guide-search" placeholder="Search crop guides…" /><select class="filter-select" id="guide-filter">${['All','Crop care','Soil & inputs','Safe farming','Seasonal advice'].map(x=>`<option ${state.guideFilter===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="guide-grid" id="guide-grid">${filtered.map(g=>`<article class="guide-card" data-search="${esc((g.title+' '+g.text+' '+g.tags.join(' ')).toLowerCase())}"><div class="guide-icon">${g.icon}</div><div class="eyebrow" style="margin-top:12px;margin-bottom:0">${g.category}</div><h3>${g.title}</h3><p>${g.text}</p><div class="tag-list">${g.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><details class="details"><summary>Read more</summary>${g.detail}</details></article>`).join('')}</div>`;
}
function assistantPage() {
  return `${welcome('Ask a question','Farm assistant','Get general crop guidance. For diagnosis or treatment, confirm with your local agriculture officer.')}<div class="assistant-layout"><section class="panel chat-panel"><div class="panel-head"><div><h2 class="panel-title">JKCrop farm assistant</h2><div class="panel-subtitle"><span style="color:#53a568">●</span> Ready to help · ${document.getElementById('language').value}</div></div><button class="button secondary small" data-action="clear-chat">Clear chat</button></div><div class="chat-messages" id="chat-messages">${state.messages.map(m=>`<div class="message ${m.who === 'user' ? 'user' : 'bot'}">${esc(m.text)}<small>${esc(m.time || 'Now')}</small></div>`).join('')}</div><form class="chat-input" id="chat-form"><button type="button" class="button secondary" id="voice-button" title="Voice input">🎙</button><input id="chat-text" placeholder="Ask about a crop, symptom, or practice…" autocomplete="off" /><button class="button">Send ↑</button></form></section><aside class="panel suggestions"><h3>Questions to try</h3><button class="suggestion" data-question="What should I check if apple leaves have spots?">What should I check if apple leaves have spots?</button><button class="suggestion" data-question="How can I use compost safely?">How can I use compost safely?</button><button class="suggestion" data-question="What should I do before spraying?">What should I do before spraying?</button><div class="details" style="margin-top:18px"><strong>About this demo</strong><br/>Answers are sample guidance for testing only. They are not a field diagnosis or a substitute for local expert advice.</div></aside></div>`;
}
function alertsPage() {
  return `${welcome('Stay informed','Alerts & events','Local crop health, weather, farmer events and scheme notices.', state.role === 'Administrator' ? '<button class="button" data-action="new-alert">＋ Create alert</button>' : '')}<div class="alert-grid">${state.alerts.map((a,i)=>`<article class="alert-card ${a.level}" data-search="${esc((a.title+' '+a.text+' '+a.type).toLowerCase())}"><div class="alert-type">${esc(a.type)}</div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><div class="event-date">⌖ &nbsp;${esc(a.region)}<br/><span style="display:inline-block;margin-top:7px">◷ &nbsp;${esc(a.date)}</span></div>${state.role === 'Administrator' ? `<button class="button ghost small" data-action="remove-alert" data-index="${i}">Remove alert</button>` : ''}</article>`).join('')}</div>`;
}
function render() {
  if (!state.session) { renderAuth(); return; }
  document.body.classList.remove('auth-mode');
  document.querySelector('.sidebar').classList.remove('hidden');
  document.querySelector('.topbar').classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === state.page));
  document.getElementById('page-crumb').textContent = titleMap[state.page];
  document.getElementById('profile-name').textContent = state.name;
  document.getElementById('profile-role').textContent = state.role;
  document.querySelector('.profile .avatar').textContent = state.name.split(/\s+/).slice(0,2).map(part=>part[0]||'').join('').toUpperCase();
  document.querySelector('.offline-card strong').textContent = state.session.demo ? 'Sample workspace' : 'Local account';
  document.querySelector('.offline-card small').textContent = 'Changes save on this device';
  document.getElementById('report-count').textContent = state.reports.length;
  if (state.session.language) document.getElementById('language').value = state.session.language;
  content.innerHTML = ({ overview, reports: reportsPage, guides: guidesPage, assistant: assistantPage, alerts: alertsPage })[state.page]();
  wirePage();
}
function roleLabel(role) { return ({ digital_farmer: 'Digital farmer', offline_farmer: 'Offline farmer', researcher: 'Researcher', admin: 'Administrator' })[role] || 'Digital farmer'; }
function authError(message) { const el = document.getElementById('auth-error'); if (el) { el.textContent = message; el.classList.remove('hidden'); } }
function renderAuth() {
  document.body.classList.add('auth-mode');
  document.querySelector('.sidebar').classList.add('hidden');
  document.querySelector('.topbar').classList.add('hidden');
  const isSignup = state.authMode === 'signup';
  content.innerHTML = `<div class="auth-shell"><section class="auth-story"><a class="brand auth-brand" href="#"><span class="brand-mark">jk<span>•</span></span><span>JKCrop <small>24/7</small></span></a><div class="auth-story-body"><div class="hero-tag">Local knowledge. Healthier harvests.</div><h1>Support for every step of your growing season.</h1><p>Keep your crop notes close, find practical guides, and stay up to date with what’s happening around your farm.</p><div class="auth-points"><div><span>✓</span> Save your crop reports</div><div><span>✓</span> Get local-first guidance</div><div><span>✓</span> Choose the language that suits you</div></div></div><div class="auth-story-footer">Made for the farming communities of Jammu &amp; Kashmir</div></section><section class="auth-form-area"><div class="auth-card"><div class="auth-eyebrow">WELCOME TO JKCROP 24/7</div><h2>${isSignup ? 'Create your account' : 'Welcome back'}</h2><p class="auth-subtitle">${isSignup ? 'Join the farmer support community.' : 'Sign in to continue to your farm workspace.'}</p><div class="auth-tabs"><button class="${isSignup?'selected':''}" data-auth-mode="signup">Create account</button><button class="${!isSignup?'selected':''}" data-auth-mode="login">Sign in</button></div><div id="auth-error" class="auth-error hidden" role="alert"></div><form id="auth-form" novalidate>${isSignup ? `<label class="auth-field"><span>Full name</span><input name="name" autocomplete="name" required placeholder="Your name" /></label>` : ''}<label class="auth-field"><span>${isSignup ? 'Phone number or email' : 'Phone number or email'}</span><input name="identity" autocomplete="username" required placeholder="name@example.com or +91 phone" /></label><label class="auth-field"><span>Password</span><input name="password" type="password" autocomplete="${isSignup?'new-password':'current-password'}" required placeholder="${isSignup?'At least 8 characters':'Your password'}" /></label>${isSignup ? `<div class="auth-two-col"><label class="auth-field"><span>I am a</span><select name="role"><option value="digital_farmer">Digital farmer</option><option value="offline_farmer">Offline farmer</option><option value="researcher">Researcher</option></select></label><label class="auth-field"><span>Preferred language</span><select name="language"><option>English</option><option>Hindi</option><option>Kashmiri</option><option>Dogri</option></select></label></div><label class="auth-field"><span>Village or district <small>Optional</small></span><input name="village" autocomplete="address-level2" placeholder="e.g. Pampore, Pulwama" /></label>` : ''}<button class="button auth-submit" type="submit">${isSignup?'Create account':'Sign in'} <span>→</span></button></form><div class="auth-local-note"><span>▣</span><span>Your account is saved on this device for testing. No information is sent to a server.</span></div><div class="auth-demo"><span>Just exploring?</span><button type="button" id="demo-access">Open sample workspace →</button></div></div></section></div>`;
  content.querySelectorAll('[data-auth-mode]').forEach(button=>button.addEventListener('click',()=>{state.authMode=button.dataset.authMode;renderAuth();}));
  document.getElementById('auth-form').addEventListener('submit',handleAuthSubmit);
  document.getElementById('demo-access').addEventListener('click',()=>{state.session={id:'sample',name:'Tariq Ahmad',role:'digital_farmer',village:'Pampore, Pulwama',demo:true};state.name=state.session.name;state.role='Digital farmer';save();render();});
}
function bytesToHex(bytes) { return Array.from(new Uint8Array(bytes), byte=>byte.toString(16).padStart(2,'0')).join(''); }
async function passwordHash(password, saltHex) {
  const salt = saltHex ? new Uint8Array(saltHex.match(/.{2}/g).map(byte=>parseInt(byte,16))) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const result = await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:180000,hash:'SHA-256'},key,256);
  return {salt:bytesToHex(salt),hash:bytesToHex(result)};
}
async function handleAuthSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const identity = String(form.get('identity') || '').trim();
  const normalized = identity.toLowerCase();
  const password = String(form.get('password') || '');
  const accounts = (()=>{try{return JSON.parse(localStorage.getItem('jkcrop-accounts')||'[]')}catch{return []}})();
  if (state.authMode === 'signup') {
    const name = String(form.get('name')||'').trim();
    const isEmail = normalized.includes('@');
    if (name.length < 2) return authError('Enter your full name to continue.');
    if (isEmail ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) : !/^\+?[\d\s()-]{7,20}$/.test(identity)) return authError('Enter a valid email address or phone number.');
    if (password.length < 8) return authError('Choose a password with at least 8 characters.');
    if (accounts.some(account=>account.identity===normalized)) return authError('An account with that phone number or email already exists. Try signing in.');
    try {
      const derived = await passwordHash(password);
      const account = {id:crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,name,identity:normalized,role:String(form.get('role')),language:String(form.get('language')),village:String(form.get('village')||'').trim(),salt:derived.salt,passwordHash:derived.hash,createdAt:new Date().toISOString()};
      accounts.push(account);
      localStorage.setItem('jkcrop-accounts',JSON.stringify(accounts));
      state.session={id:account.id,name:account.name,role:account.role,language:account.language,village:account.village};
      state.name=account.name;state.role=roleLabel(account.role);state.page='overview';save();render();toast('Your account is ready. Welcome to JKCrop 24/7.');
    } catch { authError('Account storage is unavailable in this browser. Open the app using its local address or try another browser.'); }
    return;
  }
  const account = accounts.find(item=>item.identity===normalized);
  if (!account) return authError('No account was found. Check your details or create an account.');
  try {
    const derived=await passwordHash(password,account.salt);
    if(derived.hash!==account.passwordHash)return authError('That password does not match this account.');
    state.session={id:account.id,name:account.name,role:account.role,language:account.language,village:account.village};
    state.name=account.name;state.role=roleLabel(account.role);state.page='overview';save();render();toast(`Welcome back, ${account.name.split(' ')[0]}.`);
  } catch { authError('Sign in could not be completed in this browser.'); }
}
function go(page) { state.page = page; render(); document.getElementById('sidebar').classList.remove('open'); window.scrollTo(0,0); }
function toast(message) { const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600); }
function openModal(title, body, submitLabel, onSubmit) {
  const modal=document.getElementById('modal');
  modal.innerHTML=`<form class="modal-card" id="modal-form"><div class="modal-head"><h2>${title}</h2><button class="close-button" type="button" data-close>×</button></div>${body}<div class="modal-actions"><button class="button secondary" type="button" data-close>Cancel</button><button class="button">${submitLabel}</button></div></form>`;
  modal.classList.remove('hidden'); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.classList.add('hidden'));
  modal.onclick=e=>{if(e.target===modal)modal.classList.add('hidden')};
  modal.querySelector('form').onsubmit=e=>{e.preventDefault();if(onSubmit(new FormData(e.currentTarget))!==false)modal.classList.add('hidden')};
}
function newReport() {
  openModal('Report a crop issue', `<div class="form-grid"><div class="field"><label for="crop">Crop</label><select id="crop" name="crop" required><option>Apple</option><option>Paddy</option><option>Walnut</option><option>Maize</option><option>Other</option></select></div><div class="field"><label for="location">Village / area</label><input id="location" name="location" value="Pampore, Pulwama" required /></div><div class="field full"><label for="issue">What have you noticed?</label><input id="issue" name="issue" placeholder="e.g. Spots on leaves" required /></div><div class="field full"><label for="note">Add details</label><textarea id="note" name="note" placeholder="When did it start? How much of the field is affected?"></textarea></div><div class="field full"><label for="photo">Add a crop photo (optional)</label><input id="photo" name="photo" type="file" accept="image/*" /><small style="font-size:9px;color:#879087">For this demo, the photo stays in your browser and is not uploaded.</small></div></div>`, 'Submit report', form=>{
    const photo=form.get('photo');const icon=photo&&photo.size?'📷':(form.get('crop')==='Apple'?'🍎':form.get('crop')==='Paddy'?'🌾':'🌱');
    state.reports.unshift({id:Date.now(),crop:form.get('crop'),issue:form.get('issue'),note:form.get('note')||'No extra details added.',location:form.get('location'),date:'Just now',status:'In review',icon});save();render();toast('Your crop report has been saved on this device.');
  });
}
function replyFor(text) {
  const q=text.toLowerCase();
  if(q.includes('spot')||q.includes('apple')||q.includes('scab'))return 'Check whether the spots are on both sides of the leaves and whether they are spreading. Recent wet weather can favour apple scab, but other causes are possible. Take clear photos of affected leaves and fruit, and ask your local horticulture officer to confirm before treating.';
  if(q.includes('compost'))return 'Use well-decomposed compost and avoid material that is still hot or has a strong smell. The right amount depends on your soil and crop, so follow local soil-test or extension advice.';
  if(q.includes('spray')||q.includes('chemical')||q.includes('input'))return 'Before using any crop product, confirm the pest or disease, read the label, wear the listed protective equipment, and follow the dose and waiting period. Avoid spraying when rain is expected or when pollinators are active. Ask a local expert if you are unsure.';
  if(q.includes('yellow')||q.includes('paddy')||q.includes('rice'))return 'Yellowing can have several causes, including water or nutrient stress. Compare affected patches with healthy ones, check water depth and roots, and take a photo. Please confirm the cause locally before applying fertilizer or pesticide.';
  return 'I can offer general guidance, but I need a little more detail to narrow this down. Which crop is affected, what symptoms do you see, and when did they start? For a treatment decision, please confirm with your local agriculture officer.';
}
function sendChat(text) { const value=text.trim();if(!value)return;state.messages.push({who:'user',text:value,time:'Now'});state.messages.push({who:'bot',text:replyFor(value),time:'Just now'});save();render();const box=document.getElementById('chat-messages');box.scrollTop=box.scrollHeight; }
function wirePage() {
  content.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.page)));
  content.querySelectorAll('[data-action="new-report"]').forEach(el=>el.addEventListener('click',newReport));
  content.querySelectorAll('[data-action="clear-chat"]').forEach(el=>el.addEventListener('click',()=>{state.messages=[];save();render();toast('Conversation cleared.');}));
  content.querySelectorAll('[data-action="new-guidance"]').forEach(el=>el.onclick=()=>openModal('Submit crop guidance',`<div class="field"><label>Guide title</label><input name="title" required placeholder="e.g. Walnut blight signs" /></div><div class="field"><label>Topic</label><select name="category"><option>Crop care</option><option>Soil & inputs</option><option>Safe farming</option><option>Seasonal advice</option></select></div><div class="field"><label>Summary</label><textarea name="text" required></textarea></div><div class="field"><label>Practical guidance</label><textarea name="detail" required></textarea></div>`,`Submit for review`,form=>{state.addedGuides.unshift({icon:'📘',category:form.get('category'),title:form.get('title'),text:form.get('text'),detail:form.get('detail'),tags:['New submission','Review pending']});save();render();toast('Guidance saved as a local demo submission.');}));
  content.querySelectorAll('[data-action="report-detail"]').forEach(el=>el.addEventListener('click',()=>{const r=state.reports.find(x=>x.id==el.dataset.id);if(r)openModal('Report details',`<p><strong>${esc(r.crop)} · ${esc(r.issue)}</strong></p><p>${esc(r.note)}</p><p class="report-meta">${esc(r.location)} · ${esc(r.date)}</p><p>${badge(r.status)}</p>`,'Done',()=>{});}));
  content.querySelectorAll('[data-question]').forEach(el=>el.addEventListener('click',()=>sendChat(el.dataset.question)));
  const chatForm=document.getElementById('chat-form');if(chatForm)chatForm.onsubmit=e=>{e.preventDefault();const field=document.getElementById('chat-text');sendChat(field.value);};
  const voice=document.getElementById('voice-button');if(voice)voice.onclick=()=>{const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition){toast('Voice input is not available in this browser.');return;}const recognition=new Recognition();recognition.lang={'Hindi':'hi-IN','Kashmiri':'hi-IN','Dogri':'hi-IN','English':'en-IN'}[document.getElementById('language').value]||'en-IN';recognition.onresult=e=>{document.getElementById('chat-text').value=e.results[0][0].transcript;};recognition.onerror=()=>toast('Could not capture speech. Try typing your question.');recognition.start();};
  const search=document.getElementById('report-search');if(search)search.oninput=()=>{const q=search.value.toLowerCase();document.querySelectorAll('#report-cards .report-card').forEach(card=>card.style.display=card.innerText.toLowerCase().includes(q)?'':'none');};
  const status=document.getElementById('status-filter');if(status)status.onchange=()=>{document.querySelectorAll('#report-cards .report-card').forEach(card=>card.style.display=status.value==='All reports'||card.innerText.includes(status.value)?'':'none');};
  const gs=document.getElementById('guide-search');if(gs)gs.oninput=()=>document.querySelectorAll('#guide-grid .guide-card').forEach(card=>card.style.display=card.dataset.search.includes(gs.value.toLowerCase())?'':'none');
  const gf=document.getElementById('guide-filter');if(gf)gf.onchange=()=>{state.guideFilter=gf.value;render();};
  const as=document.querySelector('.alert-grid');if(as){const searchInput=document.createElement('input');searchInput.className='search';searchInput.placeholder='Search alerts…';searchInput.style.marginBottom='14px';as.parentNode.insertBefore(searchInput,as);searchInput.oninput=()=>as.querySelectorAll('.alert-card').forEach(card=>card.style.display=card.dataset.search.includes(searchInput.value.toLowerCase())?'':'none');}
  content.querySelectorAll('[data-action="new-alert"]').forEach(el=>el.onclick=()=>openModal('Create local alert',`<div class="field"><label>Alert title</label><input name="title" required placeholder="e.g. Orchard field session" /></div><div class="field"><label>Type</label><select name="type"><option>Crop health</option><option>Weather advisory</option><option>Farmer event</option><option>Government scheme</option></select></div><div class="field"><label>Area</label><input name="region" required placeholder="Village or district" /></div><div class="field"><label>Message</label><textarea name="text" required></textarea></div>`,`Publish alert`,form=>{state.alerts.unshift({title:form.get('title'),type:form.get('type'),region:form.get('region'),text:form.get('text'),date:'Just now',level:''});save();render();toast('Alert added to the local demo.');}));
  content.querySelectorAll('[data-action="remove-alert"]').forEach(el=>el.onclick=()=>{state.alerts.splice(Number(el.dataset.index),1);save();render();toast('Alert removed.');});
}
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>go(item.dataset.page)));
document.querySelectorAll('.top-actions [data-page]').forEach(item=>item.addEventListener('click',()=>go(item.dataset.page)));
document.getElementById('mobile-menu').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
document.getElementById('language').onchange=()=>{if(state.page==='assistant')render();toast(`Language set to ${document.getElementById('language').value}.`);};
document.getElementById('profile-button').onclick=()=>{const old=document.querySelector('.role-menu');if(old){old.remove();return;}const menu=document.createElement('div');menu.className='role-menu';menu.innerHTML='<button data-role="Digital farmer">👩‍🌾 &nbsp;Farmer view</button><button data-role="Researcher">🔬 &nbsp;Researcher view</button><button data-role="Administrator">⚙ &nbsp;Administrator view</button><button data-action="reset-demo">↻ &nbsp;Reset sample data</button><button data-action="sign-out">⇥ &nbsp;Sign out</button>';document.body.appendChild(menu);menu.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{state.role=b.dataset.role;save();menu.remove();render();toast(`${state.role} view enabled.`);});menu.querySelector('[data-action="reset-demo"]').onclick=()=>{localStorage.removeItem('jkcrop-demo');state.role='Digital farmer';state.name='Tariq Ahmad';state.reports=JSON.parse(JSON.stringify(sample.reports));state.messages=JSON.parse(JSON.stringify(sample.messages));state.alerts=JSON.parse(JSON.stringify(sample.alerts));state.addedGuides=[];menu.remove();go('overview');toast('Sample data restored.');};menu.querySelector('[data-action="sign-out"]').onclick=()=>{state.session=null;state.authMode='login';state.role='Digital farmer';localStorage.removeItem('jkcrop-session');menu.remove();render();};};
document.addEventListener('click',e=>{if(!e.target.closest('#profile-button')&&!e.target.closest('.role-menu'))document.querySelector('.role-menu')?.remove();});
render();
