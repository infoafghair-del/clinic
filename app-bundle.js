// AestheticFlow - Cosmetic Clinic Management System
// Complete Single-File Application

// ============================================
// DATA LAYER
// ============================================
const DB_KEY = 'aestheticflow_data';
const SESSION_KEY = 'aestheticflow_session';

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }

function getDB() { try { const d = localStorage.getItem(DB_KEY); return d ? JSON.parse(d) : null; } catch { return null; } }
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function getSession() { try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
function saveSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }
function now() { return new Date().toISOString(); }

function formatDate(d) { if (!d) return '—'; return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
function formatDateTime(d) { if (!d) return '—'; return new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
function formatCurrency(n) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0); }
function daysAgo(d) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000); }
function relativeTime(d) { const days = daysAgo(d); if (days === 0) return 'Today'; if (days === 1) return 'Yesterday'; if (days < 7) return days + ' days ago'; if (days < 30) return Math.floor(days/7) + ' weeks ago'; return Math.floor(days/30) + ' months ago'; }

// ============================================
// SEED DATA
// ============================================
function generateSeedAppointments() {
  const today = new Date(); const appts = [];
  const treatments = ['t1','t2','t3','t4','t7','t12'];
  const doctors = ['u1','u2','u3'];
  const patients = ['p1','p2','p3','p4','p5','p6'];
  const statuses = ['completed','completed','completed','completed','scheduled','scheduled','scheduled','cancelled','no_show'];
  const times = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];
  for (let i = 0; i < 30; i++) {
    const dayOffset = -15 + i;
    const d = new Date(today); d.setDate(d.getDate() + dayOffset);
    if (d.getDay() === 0) continue;
    const dateStr = d.toISOString().split('T')[0];
    const status = dayOffset < 0 ? statuses[Math.floor(Math.random()*5)] : (dayOffset === 0 ? ['scheduled','completed'][Math.floor(Math.random()*2)] : 'scheduled');
    appts.push({ id: 'apt' + (i+1), patientId: patients[i % patients.length], treatmentId: treatments[i % treatments.length], practitionerId: doctors[i % doctors.length], roomId: 'r' + (1 + (i % 4)), date: dateStr, time: times[i % times.length], duration: 30, status, notes: '', createdAt: d.toISOString() });
  }
  return appts;
}

function createSeedData() {
  const db = {
    clinic: { name: 'Lumière Aesthetic Clinic', address: '123 Beauty Boulevard, Beverly Hills, CA 90210', phone: '+1 (310) 555-0123', email: 'hello@lumiere-clinic.com', website: 'www.lumiere-clinic.com', taxRate: 0.0875, currency: 'USD' },
    users: [
      { id: 'u1', name: 'Dr. Sophia Laurent', email: 'admin@lumiere.com', password: 'admin123', role: 'super_admin', phone: '+1 310-555-0001', avatar: 'SL', color: '#7c5cbf', specializations: ['Dermatology', 'Aesthetic Medicine'], certifications: ['Board Certified Dermatologist', 'ACMS Member'], workingHours: 'Mon-Fri 9:00-17:00', active: true, createdAt: '2025-01-01T00:00:00Z' },
      { id: 'u2', name: 'Dr. Marcus Chen', email: 'marcus@lumiere.com', password: 'doctor123', role: 'doctor', phone: '+1 310-555-0002', avatar: 'MC', color: '#4a7cbf', specializations: ['Plastic Surgery', 'Injectables'], certifications: ['Board Certified Plastic Surgeon'], workingHours: 'Mon-Thu 8:00-16:00', active: true, createdAt: '2025-01-15T00:00:00Z' },
      { id: 'u3', name: 'Dr. Elena Rossi', email: 'elena@lumiere.com', password: 'doctor123', role: 'doctor', phone: '+1 310-555-0003', avatar: 'ER', color: '#bf7c4a', specializations: ['Aesthetic Medicine', 'Laser Treatments'], certifications: ['AAFP Member', 'Aesthetic Medicine Diploma'], workingHours: 'Tue-Sat 10:00-18:00', active: true, createdAt: '2025-02-01T00:00:00Z' },
      { id: 'u4', name: 'Nina Patel', email: 'nina@lumiere.com', password: 'nurse123', role: 'nurse', phone: '+1 310-555-0004', avatar: 'NP', color: '#4abf7c', specializations: ['Aesthetic Nursing', 'Laser Operation'], certifications: ['RN', 'Certified Aesthetic Nurse'], workingHours: 'Mon-Fri 9:00-17:00', active: true, createdAt: '2025-01-20T00:00:00Z' },
      { id: 'u5', name: 'James Rivera', email: 'james@lumiere.com', password: 'reception123', role: 'receptionist', phone: '+1 310-555-0005', avatar: 'JR', color: '#bfbf4a', workingHours: 'Mon-Fri 8:00-18:00', active: true, createdAt: '2025-03-01T00:00:00Z' },
      { id: 'u6', name: 'Linda Wu', email: 'linda@lumiere.com', password: 'finance123', role: 'accountant', phone: '+1 310-555-0006', avatar: 'LW', color: '#bf4a7c', workingHours: 'Mon-Fri 9:00-17:00', active: true, createdAt: '2025-02-15T00:00:00Z' }
    ],
    patients: [
      { id: 'p1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', phone: '+1 310-555-1001', dob: '1988-03-15', gender: 'Female', address: '456 Sunset Dr, Beverly Hills, CA', emergencyContact: 'Tom Johnson +1 310-555-9001', referralSource: 'Instagram', medicalHistory: 'No known allergies', allergies: [], medications: [], previousTreatments: 'Botox at another clinic (2023)', consentSigned: true, gdprConsent: true, photoConsent: true, loyaltyPoints: 250, membershipTier: 'Gold', notes: 'Prefers afternoon appointments', tags: ['VIP', 'Regular'], createdAt: '2025-01-10T00:00:00Z' },
      { id: 'p2', firstName: 'Michael', lastName: 'Adams', email: 'mike.adams@email.com', phone: '+1 310-555-1002', dob: '1975-08-22', gender: 'Male', address: '789 Palm Ave, Los Angeles, CA', emergencyContact: 'Lisa Adams +1 310-555-9002', referralSource: 'Referral - Dr. Chen', medicalHistory: 'Hypertension (controlled)', allergies: ['Penicillin'], medications: ['Lisinopril'], previousTreatments: 'None', consentSigned: true, gdprConsent: true, photoConsent: false, loyaltyPoints: 100, membershipTier: 'Silver', notes: '', tags: ['New'], createdAt: '2025-03-05T00:00:00Z' },
      { id: 'p3', firstName: 'Emily', lastName: 'Zhang', email: 'emily.z@email.com', phone: '+1 310-555-1003', dob: '1992-11-08', gender: 'Female', address: '321 Oak St, Santa Monica, CA', emergencyContact: 'Wei Zhang +1 310-555-9003', referralSource: 'Google Search', medicalHistory: 'None significant', allergies: ['Latex'], medications: [], previousTreatments: 'Hydrafacial (2024)', consentSigned: true, gdprConsent: true, photoConsent: true, loyaltyPoints: 175, membershipTier: 'Silver', notes: 'Interested in laser treatments', tags: ['Regular'], createdAt: '2025-02-14T00:00:00Z' },
      { id: 'p4', firstName: 'James', lastName: 'Parker', email: 'james.p@email.com', phone: '+1 310-555-1004', dob: '1980-06-30', gender: 'Male', address: '654 Vine Rd, West Hollywood, CA', emergencyContact: 'Sarah Parker +1 310-555-9004', referralSource: 'Friend Referral', medicalHistory: 'Type 2 Diabetes (well managed)', allergies: [], medications: ['Metformin'], previousTreatments: 'CoolSculpting (2024)', consentSigned: true, gdprConsent: true, photoConsent: true, loyaltyPoints: 50, membershipTier: 'Bronze', notes: '', tags: [], createdAt: '2025-04-01T00:00:00Z' },
      { id: 'p5', firstName: 'Olivia', lastName: 'Thompson', email: 'olivia.t@email.com', phone: '+1 310-555-1005', dob: '1995-01-20', gender: 'Female', address: '987 Sunset Blvd, Beverly Hills, CA', emergencyContact: 'Mark Thompson +1 310-555-9005', referralSource: 'TikTok', medicalHistory: 'None', allergies: [], medications: ['Birth control'], previousTreatments: 'None', consentSigned: true, gdprConsent: true, photoConsent: true, loyaltyPoints: 0, membershipTier: 'Bronze', notes: 'Very interested in lip fillers', tags: ['New', 'Social Media'], createdAt: '2025-06-15T00:00:00Z' },
      { id: 'p6', firstName: 'David', lastName: 'Kim', email: 'david.k@email.com', phone: '+1 310-555-1006', dob: '1972-09-12', gender: 'Male', address: '246 Wilshire Blvd, LA, CA', emergencyContact: 'Suki Kim +1 310-555-9006', referralSource: 'Website', medicalHistory: 'High cholesterol', allergies: ['Aspirin'], medications: ['Atorvastatin'], previousTreatments: 'Multiple Botox sessions', consentSigned: true, gdprConsent: true, photoConsent: true, loyaltyPoints: 500, membershipTier: 'Gold', notes: 'Long-term patient, very loyal', tags: ['VIP', 'Regular', 'Male'], createdAt: '2024-11-01T00:00:00Z' }
    ],
    treatments: [
      { id: 't1', category: 'Injectables', name: 'Botox / Anti-Wrinkle', description: 'Neuromodulator injections to reduce fine lines and wrinkles', duration: 30, price: 350, packagePrice: 900, packageSessions: 3, skillRequired: 'doctor', equipment: [], consumables: ['Botox vial', 'Syringes', 'Alcohol wipes'], aftercare: 'Avoid exercise, alcohol, and lying down for 4 hours.', protocol: 'Assess areas, mark injection points, clean, inject per dosage table.', active: true, popular: true },
      { id: 't2', category: 'Injectables', name: 'Dermal Fillers (HA)', description: 'Hyaluronic acid fillers for volume restoration and contouring', duration: 45, price: 650, packagePrice: 1700, packageSessions: 3, skillRequired: 'doctor', equipment: [], consumables: ['HA Filler syringe', 'Cannulas/Needles', 'Topical anesthetic'], aftercare: 'Avoid strenuous activity for 24h. Apply cold compress if swelling.', protocol: 'Consult, mark areas, apply numbing cream, inject with cannula or needle, mold.', active: true, popular: true },
      { id: 't3', category: 'Injectables', name: 'Lip Enhancement', description: 'Lip fillers for natural-looking volume and shape', duration: 30, price: 550, packagePrice: 1400, packageSessions: 3, skillRequired: 'doctor', equipment: [], consumables: ['Lip filler syringe', 'Dental block', 'Cannulas'], aftercare: 'Use ice packs. Avoid hot drinks for 24h. Sleep with head elevated.', protocol: 'Apply dental block, mark lip borders, inject conservatively, massage.', active: true, popular: true },
      { id: 't4', category: 'Laser', name: 'Laser Hair Removal', description: 'Permanent hair reduction using advanced laser technology', duration: 45, price: 300, packagePrice: 1500, packageSessions: 6, skillRequired: 'nurse', equipment: ['Diode Laser'], consumables: ['Cooling gel', 'Protective eyewear'], aftercare: 'Avoid sun exposure for 2 weeks. No waxing between sessions.', protocol: 'Shave area 24h prior, set laser parameters, apply gel, treat in passes.', active: true, popular: true },
      { id: 't5', category: 'Laser', name: 'IPL Photofacial', description: 'Intense pulsed light for pigmentation, redness, and sun damage', duration: 30, price: 250, packagePrice: 1200, packageSessions: 6, skillRequired: 'nurse', equipment: ['IPL Device'], consumables: ['Cooling gel', 'Protective eyewear'], aftercare: 'Avoid sun, use SPF 50. Mild redness is normal for 24h.', protocol: 'Cleanse, apply gel, calibrate IPL, treat full face with overlapping passes.', active: true, popular: false },
      { id: 't6', category: 'Skin', name: 'Chemical Peel', description: 'Chemical exfoliation for skin renewal, acne, and pigmentation', duration: 40, price: 200, packagePrice: 800, packageSessions: 5, skillRequired: 'nurse', equipment: [], consumables: ['Peel solution', 'Neutralizer', 'Post-peel kit'], aftercare: 'Avoid sun, use gentle cleanser, moisturize frequently. No picking!', protocol: 'Cleanse, degrease, apply peel in layers, time per protocol, neutralize.', active: true, popular: false },
      { id: 't7', category: 'Skin', name: 'Hydrafacial', description: 'Multi-step hydration, extraction, and infusion treatment', duration: 45, price: 180, packagePrice: 750, packageSessions: 5, skillRequired: 'nurse', equipment: ['Hydrafacial Machine'], consumables: ['Hydrafacial tips', 'Serums', 'Boosters'], aftercare: 'Avoid makeup for 6h. Use gentle skincare for 48h.', protocol: 'Cleanse, acid peel, extraction, hydration, LED therapy per protocol.', active: true, popular: true },
      { id: 't8', category: 'Skin', name: 'Microneedling', description: 'Collagen induction therapy for skin texture and scars', duration: 60, price: 350, packagePrice: 900, packageSessions: 3, skillRequired: 'nurse', equipment: ['Microneedling Pen'], consumables: ['Needle cartridges', 'Topical numbing', 'Growth factor serum'], aftercare: 'Avoid sun, makeup, and active skincare for 48h.', protocol: 'Numb for 30min, set depth, treat in systematic passes, apply serum.', active: true, popular: false },
      { id: 't9', category: 'Body', name: 'CoolSculpting', description: 'Non-invasive fat reduction through controlled cooling', duration: 60, price: 800, packagePrice: 3000, packageSessions: 4, skillRequired: 'nurse', equipment: ['CoolSculpting Machine'], consumables: ['Cooling applicators', 'Massage device'], aftercare: 'Massage treated area for 5 min, 3x daily for 1 week.', protocol: 'Mark area, apply gel pad, place applicator, treat 35-60min, massage.', active: true, popular: false },
      { id: 't10', category: 'Injectables', name: 'PRP Therapy', description: 'Skin rejuvenation and hair restoration using your own plasma', duration: 60, price: 500, packagePrice: 1300, packageSessions: 3, skillRequired: 'doctor', equipment: ['Centrifuge'], consumables: ['Blood collection tubes', 'PRP kit', 'Needles'], aftercare: 'Avoid anti-inflammatory meds for 48h. Mild swelling is normal.', protocol: 'Draw blood, centrifuge, extract PRP, inject or microneedle into area.', active: true, popular: false },
      { id: 't11', category: 'Injectables', name: 'Thread Lift', description: 'Non-surgical face lift using dissolvable PDO threads', duration: 90, price: 2500, packagePrice: 0, packageSessions: 1, skillRequired: 'doctor', equipment: [], consumables: ['PDO Threads', 'Cannulas', 'Local anesthetic'], aftercare: 'Avoid excessive facial movement for 1 week. Sleep on back.', protocol: 'Mark entry/exit points, numb, insert threads via cannula, anchor, trim.', active: true, popular: false },
      { id: 't12', category: 'Consultation', name: 'New Patient Consultation', description: 'Comprehensive initial consultation and treatment plan', duration: 30, price: 75, packagePrice: 0, packageSessions: 1, skillRequired: 'doctor', equipment: [], consumables: [], aftercare: '', protocol: 'Review history, discuss concerns, examine, recommend treatments.', active: true, popular: true }
    ],
    appointments: generateSeedAppointments(),
    invoices: [],
    clinicalRecords: [],
    photos: [
      { id: 'ph1', patientId: 'p1', type: 'before', treatmentName: 'Botox', area: 'Forehead', date: '2025-02-15', notes: 'Moderate forehead lines at rest', createdAt: '2025-02-15T00:00:00Z' },
      { id: 'ph2', patientId: 'p1', type: 'after', treatmentName: 'Botox', area: 'Forehead', date: '2025-03-01', notes: '2 weeks post-treatment, significant improvement', createdAt: '2025-03-01T00:00:00Z' },
      { id: 'ph3', patientId: 'p3', type: 'before', treatmentName: 'Hydrafacial', area: 'Full Face', date: '2025-04-10', notes: 'Dehydrated skin with congestion', createdAt: '2025-04-10T00:00:00Z' },
      { id: 'ph4', patientId: 'p6', type: 'before', treatmentName: 'Botox', area: 'Glabella', date: '2025-01-20', notes: 'Deep glabellar lines', createdAt: '2025-01-20T00:00:00Z' },
      { id: 'ph5', patientId: 'p6', type: 'after', treatmentName: 'Botox', area: 'Glabella', date: '2025-02-03', notes: 'Smooth glabella 2 weeks post-injection', createdAt: '2025-02-03T00:00:00Z' }
    ],
    inventory: [
      { id: 'inv1', category: 'Toxins', name: 'Botox (Allergan) 100U', sku: 'BTX-100', batchNumber: 'BTX-2025-A1', expiryDate: '2026-06-30', stockQty: 15, minStock: 5, unitCost: 150, supplier: 'Allergan Direct', location: 'Fridge A', active: true },
      { id: 'inv2', category: 'Toxins', name: 'Dysport 500U', sku: 'DSP-500', batchNumber: 'DSP-2025-B2', expiryDate: '2026-09-15', stockQty: 8, minStock: 3, unitCost: 120, supplier: 'Ipsen', location: 'Fridge A', active: true },
      { id: 'inv3', category: 'Fillers', name: 'Juvederm Ultra Plus XC 1ml', sku: 'JVD-UP1', batchNumber: 'JVD-2025-C3', expiryDate: '2026-12-31', stockQty: 12, minStock: 4, unitCost: 200, supplier: 'Allergan Direct', location: 'Cabinet B', active: true },
      { id: 'inv4', category: 'Fillers', name: 'Restylane Lyft 1ml', sku: 'RST-LY1', batchNumber: 'RST-2025-D4', expiryDate: '2026-08-20', stockQty: 6, minStock: 4, unitCost: 180, supplier: 'Galderma', location: 'Cabinet B', active: true },
      { id: 'inv5', category: 'Fillers', name: 'Restylane Kysse 1ml', sku: 'RST-KS1', batchNumber: 'RST-2025-E5', expiryDate: '2027-01-15', stockQty: 10, minStock: 4, unitCost: 190, supplier: 'Galderma', location: 'Cabinet B', active: true },
      { id: 'inv6', category: 'Skincare', name: 'Post-Treatment Recovery Cream', sku: 'SK-RC01', batchNumber: 'SK-2025-F6', expiryDate: '2027-03-01', stockQty: 25, minStock: 10, unitCost: 15, supplier: 'SkinCeuticals', location: 'Shelf C', active: true },
      { id: 'inv7', category: 'Consumables', name: '30G Syringes (Box/100)', sku: 'CON-S30', batchNumber: 'CON-2025-G7', expiryDate: '2028-12-31', stockQty: 5, minStock: 2, unitCost: 45, supplier: 'BD Medical', location: 'Storage D', active: true },
      { id: 'inv8', category: 'Consumables', name: 'Alcohol Prep Pads (Box/200)', sku: 'CON-AP2', batchNumber: 'CON-2025-H8', expiryDate: '2028-06-30', stockQty: 8, minStock: 3, unitCost: 12, supplier: 'Medline', location: 'Storage D', active: true },
      { id: 'inv9', category: 'Consumables', name: 'Topical Numbing Cream 30g', sku: 'CON-NC3', batchNumber: 'CON-2025-I9', expiryDate: '2026-11-30', stockQty: 3, minStock: 5, unitCost: 25, supplier: 'LMX', location: 'Cabinet B', active: true },
      { id: 'inv10', category: 'PRP', name: 'PRP Kit (Vampire Facial)', sku: 'PRP-VF1', batchNumber: 'PRP-2025-J0', expiryDate: '2026-04-30', stockQty: 4, minStock: 3, unitCost: 85, supplier: 'Eclipse', location: 'Storage D', active: true }
    ],
    leads: [
      { id: 'l1', name: 'Jessica Wang', email: 'jessica.w@email.com', phone: '+1 310-555-2001', source: 'Instagram', status: 'new', interest: 'Lip fillers, Botox', notes: 'DMd asking about pricing', estimatedValue: 1200, createdAt: '2025-06-20T00:00:00Z' },
      { id: 'l2', name: 'Robert Martinez', email: 'rob.m@email.com', phone: '+1 310-555-2002', source: 'Google Ads', status: 'contacted', interest: 'CoolSculpting', notes: 'Called, left voicemail', estimatedValue: 2400, createdAt: '2025-06-18T00:00:00Z' },
      { id: 'l3', name: 'Aisha Hassan', email: 'aisha.h@email.com', phone: '+1 310-555-2003', source: 'Referral', status: 'consultation_booked', interest: 'Skin rejuvenation', notes: 'Referred by Sarah Johnson', estimatedValue: 800, createdAt: '2025-06-15T00:00:00Z' },
      { id: 'l4', name: 'Chris Lee', email: 'chris.l@email.com', phone: '+1 310-555-2004', source: 'TikTok', status: 'qualified', interest: 'Hair removal, Facials', notes: 'Very engaged, asking lots of questions', estimatedValue: 1800, createdAt: '2025-06-12T00:00:00Z' },
      { id: 'l5', name: 'Natasha Volkov', email: 'natasha.v@email.com', phone: '+1 310-555-2005', source: 'Website', status: 'won', interest: 'Thread lift, Fillers', notes: 'Converted to patient', estimatedValue: 4500, patientId: 'p5', createdAt: '2025-05-28T00:00:00Z' }
    ],
    consentForms: [
      { id: 'cf1', name: 'General Treatment Consent', description: 'Consent for any aesthetic treatment', fields: ['I confirm I have disclosed all medical conditions', 'I understand the risks and benefits', 'I consent to the treatment as explained', 'I understand results may vary'], required: true, active: true },
      { id: 'cf2', name: 'Photo & Video Consent', description: 'Consent to photograph treatment areas', fields: ['I consent to before/after photos for my records', 'I consent to anonymized photos for marketing (optional)', 'I understand I can withdraw photo consent at any time'], required: false, active: true },
      { id: 'cf3', name: 'Injectable Treatment Consent', description: 'Specific consent for injectable treatments', fields: ['I understand injectables carry risks including bruising, swelling', 'I have been informed of alternative treatments', 'I confirm no pregnancy or breastfeeding', 'I understand the product and batch number will be recorded'], required: true, active: true },
      { id: 'cf4', name: 'GDPR / Data Processing Consent', description: 'Consent for data collection and processing', fields: ['I consent to my data being stored securely', 'I understand my data will not be shared without consent', 'I have the right to request data deletion', 'I have the right to export my data'], required: true, active: true }
    ],
    membershipPackages: [
      { id: 'mp1', name: 'Bronze', price: 0, pointsPerDollar: 1, benefits: 'Standard booking, Email reminders', color: '#CD7F32' },
      { id: 'mp2', name: 'Silver', price: 99, pointsPerDollar: 1.5, benefits: 'Priority booking, 5% discount, SMS reminders, Birthday voucher $50', color: '#C0C0C0' },
      { id: 'mp3', name: 'Gold', price: 249, pointsPerDollar: 2, benefits: 'VIP booking, 10% discount, Priority scheduling, Birthday voucher $100, Free annual Hydrafacial', color: '#FFD700' }
    ],
    rooms: [
      { id: 'r1', name: 'Treatment Room 1', type: 'Injectables', equipment: ['Examination light', 'Adjustable chair'] },
      { id: 'r2', name: 'Treatment Room 2', type: 'Laser', equipment: ['Diode Laser', 'IPL Device'] },
      { id: 'r3', name: 'Treatment Room 3', type: 'General', equipment: ['Hydrafacial Machine', 'Microneedling Pen'] },
      { id: 'r4', name: 'Consultation Suite', type: 'Consultation', equipment: [] },
      { id: 'r5', name: 'Recovery Room', type: 'Recovery', equipment: ['Comfortable seating', 'Refreshments'] }
    ],
    auditLog: [
      { id: 'al1', userId: 'u1', action: 'LOGIN', details: 'Logged in successfully', timestamp: '2025-06-20T09:00:00Z' },
      { id: 'al2', userId: 'u1', action: 'PATIENT_VIEW', details: 'Viewed patient Sarah Johnson', timestamp: '2025-06-20T09:05:00Z' },
      { id: 'al3', userId: 'u2', action: 'TREATMENT_RECORD', details: 'Created treatment record for appointment apt5', timestamp: '2025-06-19T14:30:00Z' },
      { id: 'al4', userId: 'u5', action: 'APPOINTMENT_CREATE', details: 'Booked appointment for Emily Zhang', timestamp: '2025-06-18T11:00:00Z' },
      { id: 'al5', userId: 'u6', action: 'INVOICE_CREATE', details: 'Generated invoice for Sarah Johnson - Botox', timestamp: '2025-06-17T16:00:00Z' }
    ],
    settings: { workingHours: { start: '08:00', end: '18:00' }, workingDays: ['Mon','Tue','Wed','Thu','Fri','Sat'], slotDuration: 30, reminderHours: [48, 24, 2], enableOnlineBooking: true, enableSmsReminders: true, enableEmailReminders: true, darkMode: false, currency: 'USD', taxRate: 8.75 }
  };

  // Generate invoices from completed appointments
  let invCount = 0;
  db.appointments.filter(a => a.status === 'completed').forEach(a => {
    const patient = db.patients.find(p => p.id === a.patientId);
    const treatment = db.treatments.find(t => t.id === a.treatmentId);
    const doctor = db.users.find(u => u.id === a.practitionerId);
    if (treatment && patient) {
      invCount++;
      const subtotal = treatment.price;
      const tax = subtotal * db.clinic.taxRate;
      db.invoices.push({ id: 'inv' + invCount, patientId: a.patientId, appointmentId: a.id, treatmentName: treatment.name, practitionerName: doctor ? doctor.name : '—', subtotal, tax, total: subtotal + tax, status: Math.random() > 0.2 ? 'paid' : 'pending', paymentMethod: ['card','cash','bank_transfer'][Math.floor(Math.random()*3)], date: a.date, dueDate: a.date, paidDate: Math.random() > 0.2 ? a.date : null, createdAt: a.date });
    }
  });

  // Generate clinical records
  db.clinicalRecords = db.appointments.filter(a => a.status === 'completed').map(a => {
    const treatment = db.treatments.find(t => t.id === a.treatmentId);
    return { id: 'cr' + a.id, appointmentId: a.id, patientId: a.patientId, practitionerId: a.practitionerId, treatmentName: treatment ? treatment.name : 'Consultation', date: a.date, notes: treatment ? 'Performed ' + treatment.name + ' as per protocol. Patient tolerated well.' : 'Consultation completed.', productsUsed: treatment && treatment.consumables.length ? treatment.consumables.slice(0,2).join(', ') + ' - Batch#' + (1000 + Math.floor(Math.random()*9000)) : '', areas: treatment && treatment.category === 'Injectables' ? ['Forehead','Crow\'s feet','Glabella'][Math.floor(Math.random()*3)] : 'Face', unitsInjected: treatment && treatment.name.includes('Botox') ? Math.floor(Math.random()*30) + 10 : null, followUpDate: new Date(new Date(a.date).getTime() + 14*86400000).toISOString().split('T')[0], patientSignature: true, practitionerSignature: true, createdAt: a.date };
  });

  return db;
}

function initDB() { let db = getDB(); if (!db || !db.users) { db = createSeedData(); saveDB(db); } return db; }
// ============================================
// TOAST NOTIFICATIONS
// ============================================
let toastContainer = null;
function showToast(message, type = 'info') {
  if (!toastContainer) { toastContainer = document.createElement('div'); toastContainer.className = 'toast-container'; document.body.appendChild(toastContainer); }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = '<span>' + (icons[type]||'ℹ') + '</span><span>' + message + '</span>';
  toastContainer.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(100%)'; setTimeout(()=>toast.remove(), 300); }, 4000);
}

// ============================================
// ROUTER
// ============================================
const Router = {
  current: 'dashboard', params: {},
  navigate(page, params = {}) { this.current = page; this.params = params; render(); }
};

// ============================================
// STATE
// ============================================
const State = {
  db: null, session: null, sidebarOpen: false, searchQuery: '',
  calendarMonth: new Date().getMonth(), calendarYear: new Date().getFullYear()
};

// ============================================
// ROLE PERMISSIONS
// ============================================
const PERMISSIONS = {
  super_admin: ['all'],
  clinic_admin: ['patients','appointments','treatments','billing','inventory','staff','marketing','reports','settings'],
  doctor: ['patients','appointments','treatments','clinical','inventory_view','reports_view'],
  nurse: ['patients_view','appointments_view','treatments_view','clinical','inventory_view'],
  receptionist: ['patients','appointments','treatments_view','billing_view'],
  accountant: ['billing','reports','patients_view']
};

function hasPermission(module) {
  if (!State.session) return false;
  const perms = PERMISSIONS[State.session.role];
  if (!perms) return false;
  if (perms.includes('all')) return true;
  return perms.includes(module) || perms.includes(module + '_view');
}

// ============================================
// NAV ITEMS
// ============================================
function getNavItems() {
  const role = State.session?.role;
  return [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', roles: ['super_admin','clinic_admin','doctor','nurse','receptionist','accountant'] },
    { id: 'patients', icon: '👩', label: 'Patients', roles: ['super_admin','clinic_admin','doctor','nurse','receptionist','accountant'] },
    { id: 'appointments', icon: '📅', label: 'Appointments', roles: ['super_admin','clinic_admin','doctor','nurse','receptionist'] },
    { id: 'treatments', icon: '💉', label: 'Treatments', roles: ['super_admin','clinic_admin','doctor','nurse'] },
    { id: 'clinical', icon: '📋', label: 'Clinical Records', roles: ['super_admin','clinic_admin','doctor','nurse'] },
    { id: 'billing', icon: '💳', label: 'Billing & Invoices', roles: ['super_admin','clinic_admin','receptionist','accountant'] },
    { id: 'inventory', icon: '📦', label: 'Inventory', roles: ['super_admin','clinic_admin','doctor','nurse'] },
    { id: 'marketing', icon: '📣', label: 'Marketing & Leads', roles: ['super_admin','clinic_admin'] },
    { id: 'reports', icon: '📈', label: 'Reports & Analytics', roles: ['super_admin','clinic_admin','accountant'] },
    { id: 'staff', icon: '👥', label: 'Staff Management', roles: ['super_admin','clinic_admin'] },
    { id: 'settings', icon: '⚙️', label: 'Settings', roles: ['super_admin','clinic_admin'] }
  ].filter(item => item.roles.includes(role));
}

// ============================================
// AUDIT LOG
// ============================================
function addAuditLog(action, details) {
  if (!State.session) return;
  State.db.auditLog.unshift({ id: generateId(), userId: State.session.userId, action, details, timestamp: now() });
  if (State.db.auditLog.length > 500) State.db.auditLog.length = 500;
  saveDB(State.db);
}

// ============================================
// RENDER ENGINE
// ============================================
function render() {
  const app = document.getElementById('app');
  if (!State.session) { app.innerHTML = renderLoginPage(); bindLoginEvents(); return; }
  app.innerHTML = renderAppLayout();
  bindAppEvents();
  renderPage();
}

function renderLoginPage() {
  return '<div class="login-page"><div class="login-card"><div class="login-logo"><h1>✨ AestheticFlow</h1><p>Cosmetic Clinic Management</p></div><div id="login-form"><div class="form-group"><label>Email</label><input type="email" id="login-email" class="form-control" placeholder="Enter your email" value="admin@lumiere.com"></div><div class="form-group"><label>Password</label><input type="password" id="login-password" class="form-control" placeholder="Enter your password" value="admin123"></div><div class="form-group" style="display:flex;align-items:center;justify-content:space-between"><label style="display:flex;align-items:center;gap:8px;margin:0;font-weight:400;font-size:13px"><input type="checkbox" id="login-remember" checked> Remember me</label><a href="#" style="font-size:13px">Forgot password?</a></div><button id="login-btn" class="btn btn-primary w-full" style="padding:12px;font-size:16px;margin-top:8px">Sign In</button><p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-muted)">Demo: admin@lumiere.com / admin123</p><div style="margin-top:12px;padding:12px;background:var(--bg);border-radius:var(--radius);font-size:12px;color:var(--text-secondary)"><strong>Other logins:</strong><br>doctor: marcus@lumiere.com / doctor123<br>nurse: nina@lumiere.com / nurse123<br>reception: james@lumiere.com / reception123<br>finance: linda@lumiere.com / finance123</div></div></div></div>';
}

function bindLoginEvents() {
  document.getElementById('login-btn')?.addEventListener('click', handleLogin);
  document.getElementById('login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const user = State.db.users.find(u => u.email === email && u.password === password && u.active);
  if (user) {
    State.session = { userId: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, color: user.color, loginTime: now() };
    saveSession(State.session);
    addAuditLog('LOGIN', 'Logged in successfully');
    showToast('Welcome back, ' + user.name.split(' ')[0] + '!', 'success');
    Router.navigate('dashboard');
  } else { showToast('Invalid email or password', 'error'); }
}

function handleLogout() {
  addAuditLog('LOGOUT', 'Logged out');
  State.session = null; clearSession();
  Router.navigate('dashboard');
  showToast('Logged out successfully', 'info');
}

function renderAppLayout() {
  const user = State.db.users.find(u => u.id === State.session.userId) || State.session;
  const navItems = getNavItems();
  const todayAppts = State.db.appointments.filter(a => a.status === 'scheduled' && a.date === new Date().toISOString().split('T')[0]).length;
  const sections = ['Main', 'Management', 'Admin'];
  let nav = '', secIdx = 0;
  navItems.forEach((item, i) => {
    if (i === 4) secIdx = 1; if (i === 8) secIdx = 2;
    if (i === 4 || i === 8) nav += '<div class="sidebar-section">' + sections[secIdx] + '</div>';
    nav += '<div class="nav-item ' + (Router.current === item.id ? 'active' : '') + '" data-page="' + item.id + '"><span class="nav-icon">' + item.icon + '</span> ' + item.label + (item.id === 'appointments' && todayAppts ? '<span class="nav-badge">' + todayAppts + '</span>' : '') + '</div>';
  });
  return '<div class="sidebar-overlay ' + (State.sidebarOpen ? 'show' : '') + '" id="sidebar-overlay"></div><div class="app-layout"><aside class="sidebar ' + (State.sidebarOpen ? 'open' : '') + '" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">✨</div><div><h2>AestheticFlow</h2><span>' + State.db.clinic.name + '</span></div></div><nav class="sidebar-nav"><div class="sidebar-section">Main</div>' + nav + '</nav><div class="sidebar-footer"><div class="sidebar-user"><div class="avatar" style="background:' + (user.color||'var(--primary)') + '">' + (user.avatar||user.name?.split(' ').map(n=>n[0]).join('')) + '</div><div class="user-info"><div class="user-name">' + user.name + '</div><div class="user-role">' + (user.role?.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())) + '</div></div><button class="btn-ghost" id="logout-btn" title="Sign out" style="color:rgba(255,255,255,.5);font-size:16px;background:none;border:none;padding:4px">⏻</button></div></div></aside><div class="main-area" id="main-area"><header class="header"><button class="menu-toggle" id="menu-toggle">☰</button><div class="search-box"><span class="search-icon">🔍</span><input type="text" id="global-search" placeholder="Search patients, treatments, appointments..." value="' + State.searchQuery + '"></div><div class="header-actions"><button class="header-btn" id="dark-mode-toggle" title="Toggle dark mode">' + (State.db.settings.darkMode ? '☀️' : '🌙') + '</button><button class="header-btn" id="patient-portal-link" title="Patient Portal">👤</button></div></header><div class="page-content" id="page-content"></div></div></div>';
}

function bindAppEvents() {
  document.querySelectorAll('.nav-item').forEach(el => { el.addEventListener('click', () => { Router.navigate(el.dataset.page); State.sidebarOpen = false; }); });
  document.getElementById('menu-toggle')?.addEventListener('click', () => { State.sidebarOpen = !State.sidebarOpen; document.getElementById('sidebar')?.classList.toggle('open', State.sidebarOpen); document.getElementById('sidebar-overlay')?.classList.toggle('show', State.sidebarOpen); });
  document.getElementById('sidebar-overlay')?.addEventListener('click', () => { State.sidebarOpen = false; document.getElementById('sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); });
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
  document.getElementById('dark-mode-toggle')?.addEventListener('click', () => { State.db.settings.darkMode = !State.db.settings.darkMode; saveDB(State.db); document.documentElement.className = State.db.settings.darkMode ? 'dark' : 'light'; render(); });
  document.getElementById('global-search')?.addEventListener('input', (e) => { State.searchQuery = e.target.value; });
  document.getElementById('global-search')?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && State.searchQuery.trim()) Router.navigate('search', { query: State.searchQuery }); });
  document.getElementById('patient-portal-link')?.addEventListener('click', () => Router.navigate('patient-portal'));
}

function renderPage() {
  const content = document.getElementById('page-content');
  if (!content) return;
  content.innerHTML = '<div class="page-enter">' + getPageContent() + '</div>';
  bindPageEvents();
}

function getPageContent() {
  switch (Router.current) {
    case 'dashboard': return renderDashboard();
    case 'patients': return renderPatients();
    case 'patient-detail': return renderPatientDetail();
    case 'appointments': return renderAppointments();
    case 'treatments': return renderTreatments();
    case 'clinical': return renderClinical();
    case 'billing': return renderBilling();
    case 'inventory': return renderInventory();
    case 'marketing': return renderMarketing();
    case 'reports': return renderReports();
    case 'staff': return renderStaff();
    case 'settings': return renderSettings();
    case 'search': return renderSearch();
    case 'patient-portal': return renderPatientPortal();
    case 'online-booking': return renderOnlineBooking();
    default: return renderDashboard();
  }
}

function bindPageEvents() {
  document.getElementById('patient-search')?.addEventListener('input', (e) => { Router.params.query = e.target.value; });
  document.getElementById('toggle-online-booking')?.addEventListener('click', function() { this.classList.toggle('on'); State.db.settings.enableOnlineBooking = this.classList.contains('on'); saveDB(State.db); });
}

// Helper functions for dashboard
function getPopularTreatments() {
  const counts = {};
  State.db.appointments.filter(a => a.status === 'completed' || a.status === 'scheduled').forEach(a => { counts[a.treatmentId] = (counts[a.treatmentId]||0)+1; });
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5);
  const max = sorted[0]?.[1] || 1;
  return sorted.map(([id,count]) => { const t = State.db.treatments.find(tr => tr.id === id); return { name: t?.name || 'Unknown', count, pct: (count/max*100).toFixed(0) }; });
}

function getRevenueBars() {
  const months = [];
  for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth()-i); const key = d.toISOString().slice(0,7); const label = d.toLocaleString('en-US',{month:'short'}); const value = State.db.invoices.filter(inv => inv.date?.startsWith(key) && inv.status==='paid').reduce((s,inv)=>s+inv.total,0); months.push({ label, value, current: i===0 }); }
  const max = Math.max(...months.map(m=>m.value),1);
  return months.map(m => ({ ...m, pct: (m.value/max*100).toFixed(0) || 5 }));
}

function getReferralStats() {
  const sources = {};
  State.db.patients.forEach(p => { sources[p.referralSource] = (sources[p.referralSource]||0)+1; });
  State.db.leads.forEach(l => { sources[l.source] = (sources[l.source]||0)+1; });
  const total = Object.values(sources).reduce((s,v)=>s+v,0) || 1;
  return Object.entries(sources).sort((a,b)=>b[1]-a[1]).map(([source,count]) => ({ source, count, pct: (count/total*100).toFixed(0) }));
}

function statusBadge(s) {
  const c = {scheduled:'badge-info',completed:'badge-success',cancelled:'badge-danger',no_show:'badge-warning',in_progress:'badge-primary',paid:'badge-success',pending:'badge-danger'};
  return '<span class="badge ' + (c[s]||'badge-neutral') + '">' + s.replace('_',' ') + '</span>';
}
// ============================================
// DASHBOARD
// ============================================
function renderDashboard() {
  const db = State.db;
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0,7);
  const todayAppts = db.appointments.filter(a => a.date === today);
  const scheduledToday = todayAppts.filter(a => a.status === 'scheduled');
  const completedToday = todayAppts.filter(a => a.status === 'completed');
  const monthAppts = db.appointments.filter(a => a.date?.startsWith(thisMonth));
  const monthRevenue = db.invoices.filter(i => i.date?.startsWith(thisMonth) && i.status === 'paid').reduce((s,i) => s + i.total, 0);
  const totalPatients = db.patients.length;
  const activeLeads = db.leads.filter(l => l.status !== 'won' && l.status !== 'lost').length;
  const lowStock = db.inventory.filter(i => i.stockQty <= i.minStock).length;
  const noShowRate = monthAppts.length ? (monthAppts.filter(a => a.status === 'no_show').length / monthAppts.length * 100).toFixed(1) : 0;

  let html = '<div class="page-header"><div><h1>Welcome back, ' + State.session.name.split(' ')[0] + ' 👋</h1><p>Here\'s what\'s happening at ' + db.clinic.name + ' today</p></div><div class="flex gap-2">';
  if (hasPermission('appointments')) html += '<button class="btn btn-primary" onclick="Router.navigate(\'appointments\')">📅 Today\'s Schedule</button>';
  if (hasPermission('patients')) html += '<button class="btn btn-secondary" onclick="openModal(\'new-patient\')">+ New Patient</button>';
  html += '</div></div>';

  // Stats
  html += '<div class="grid grid-4 gap-4 mb-6">';
  html += '<div class="stat-card fade-in" style="animation-delay:.05s"><div class="stat-icon purple">📅</div><div><div class="stat-value">' + scheduledToday.length + '</div><div class="stat-label">Today\'s Appointments</div><div class="stat-change up">' + completedToday.length + ' completed</div></div></div>';
  html += '<div class="stat-card fade-in" style="animation-delay:.1s"><div class="stat-icon green">💰</div><div><div class="stat-value">' + formatCurrency(monthRevenue) + '</div><div class="stat-label">Monthly Revenue</div><div class="stat-change up">↑ 12% vs last month</div></div></div>';
  html += '<div class="stat-card fade-in" style="animation-delay:.15s"><div class="stat-icon blue">👩</div><div><div class="stat-value">' + totalPatients + '</div><div class="stat-label">Total Patients</div><div class="stat-change up">↑ ' + db.patients.filter(p => daysAgo(p.createdAt) < 30).length + ' new this month</div></div></div>';
  html += '<div class="stat-card fade-in" style="animation-delay:.2s"><div class="stat-icon ' + (lowStock > 0 ? 'red' : 'orange') + '">📦</div><div><div class="stat-value">' + lowStock + '</div><div class="stat-label">Low Stock Alerts</div><div class="stat-change ' + (lowStock > 0 ? 'down' : '') + '">' + (lowStock > 0 ? '⚠ Needs attention' : 'All stocked') + '</div></div></div>';
  html += '</div>';

  // Quick stats + Today's schedule + Popular treatments
  html += '<div class="grid grid-3 gap-4 mb-6">';

  // Quick Stats
  html += '<div class="card fade-in" style="animation-delay:.25s"><div class="card-header"><h3>📊 Quick Stats</h3></div><div class="card-body"><div style="display:flex;flex-direction:column;gap:12px">';
  html += '<div class="flex justify-between items-center"><span class="text-sm text-secondary">Active Leads</span><span class="font-semibold">' + activeLeads + '</span></div>';
  html += '<div class="flex justify-between items-center"><span class="text-sm text-secondary">No-Show Rate</span><span class="font-semibold">' + noShowRate + '%</span></div>';
  html += '<div class="flex justify-between items-center"><span class="text-sm text-secondary">Completion Rate</span><span class="font-semibold" style="color:var(--success)">' + (monthAppts.length ? (monthAppts.filter(a=>a.status==='completed').length/monthAppts.length*100).toFixed(0) : 0) + '%</span></div>';
  html += '<div class="flex justify-between items-center"><span class="text-sm text-secondary">Avg. Treatment Value</span><span class="font-semibold">' + formatCurrency(monthRevenue / Math.max(1,monthAppts.filter(a=>a.status==='completed').length)) + '</span></div>';
  html += '<div class="flex justify-between items-center"><span class="text-sm text-secondary">Outstanding</span><span class="font-semibold" style="color:var(--danger)">' + formatCurrency(db.invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.total,0)) + '</span></div>';
  html += '</div></div></div>';

  // Today's Schedule
  html += '<div class="card fade-in" style="animation-delay:.3s"><div class="card-header"><h3>🕐 Today\'s Schedule</h3><button class="btn btn-sm btn-ghost" onclick="Router.navigate(\'appointments\')">View All →</button></div><div class="card-body" style="padding:0">';
  if (todayAppts.length === 0) {
    html += '<div class="empty-state" style="padding:24px"><p>No appointments today</p></div>';
  } else {
    todayAppts.slice(0,6).forEach(a => {
      const p = db.patients.find(pt => pt.id === a.patientId);
      const t = db.treatments.find(tr => tr.id === a.treatmentId);
      const dr = db.users.find(u => u.id === a.practitionerId);
      html += '<div class="flex items-center gap-3" style="padding:10px 16px;border-bottom:1px solid var(--border-light);cursor:pointer" onclick="Router.navigate(\'patient-detail\',{id:\'' + a.patientId + '\'})"><div class="avatar avatar-sm" style="background:' + (dr?.color||'var(--primary)') + ';color:#fff;font-size:10px">' + (dr?.avatar||'?') + '</div><div style="flex:1;min-width:0"><div class="text-sm font-medium truncate">' + (p?.firstName||'') + ' ' + (p?.lastName||'') + ' — ' + (t?.name||'Consultation') + '</div><div class="text-xs text-muted">' + a.time + ' · ' + (dr?.name?.split(' ')[0]||'—') + '</div></div>' + statusBadge(a.status) + '</div>';
    });
  }
  html += '</div></div>';

  // Popular Treatments
  html += '<div class="card fade-in" style="animation-delay:.35s"><div class="card-header"><h3>🔥 Popular Treatments</h3></div><div class="card-body">';
  getPopularTreatments().forEach((item,i) => {
    html += '<div class="flex items-center gap-3 mb-4"><span class="text-sm font-semibold" style="color:var(--primary)">' + (i+1) + '</span><div style="flex:1"><div class="text-sm font-medium">' + item.name + '</div><div class="progress-bar mt-2"><div class="progress-fill purple" style="width:' + item.pct + '%"></div></div></div><span class="text-sm font-semibold">' + item.count + '</span></div>';
  });
  html += '</div></div>';
  html += '</div>';

  // Revenue + Lead Pipeline
  html += '<div class="grid grid-2 gap-4">';
  html += '<div class="card fade-in" style="animation-delay:.4s"><div class="card-header"><h3>📈 Revenue This Month</h3></div><div class="card-body"><div class="bar-chart" style="height:180px">';
  getRevenueBars().forEach(b => { html += '<div class="bar" style="height:' + b.pct + '%;' + (b.current?'background:var(--accent)':'') + '" title="' + b.label + ': ' + formatCurrency(b.value) + '"><span class="bar-value">' + formatCurrency(b.value) + '</span><span class="bar-label">' + b.label + '</span></div>'; });
  html += '</div></div></div>';

  // Lead Pipeline
  html += '<div class="card fade-in" style="animation-delay:.45s"><div class="card-header"><h3>🎯 Lead Pipeline</h3></div><div class="card-body"><div class="flex gap-3" style="flex-direction:column">';
  [{key:'new',label:'New',color:'var(--info)'},{key:'contacted',label:'Contacted',color:'var(--primary)'},{key:'qualified',label:'Qualified',color:'var(--accent)'},{key:'consultation_booked',label:'Consultation',color:'var(--warning)'},{key:'won',label:'Won',color:'var(--success)'}].forEach(s => {
    const count = db.leads.filter(l => l.status === s.key).length;
    const total = db.leads.length || 1;
    html += '<div class="flex items-center gap-3"><div style="width:10px;height:10px;border-radius:50%;background:' + s.color + '"></div><span class="text-sm" style="width:100px">' + s.label + '</span><div style="flex:1"><div class="progress-bar"><div class="progress-fill" style="width:' + (count/total*100).toFixed(0) + '%;background:' + s.color + '"></div></div></div><span class="text-sm font-semibold">' + count + '</span></div>';
  });
  html += '</div></div></div>';
  html += '</div>';
  return html;
}

// ============================================
// PATIENTS LIST
// ============================================
function renderPatients() {
  const patients = State.db.patients;
  const query = Router.params.query || '';
  const filtered = query ? patients.filter(p => (p.firstName + ' ' + p.lastName + ' ' + p.email + ' ' + p.phone).toLowerCase().includes(query.toLowerCase())) : patients;
  let html = '<div class="page-header"><div><h1>👩 Patient Management</h1><p>' + patients.length + ' patients registered</p></div><div class="flex gap-2"><div style="max-width:250px;position:relative"><input type="text" class="form-control" placeholder="Search patients..." id="patient-search" style="padding-left:32px" value="' + query + '"></div><button class="btn btn-primary" onclick="openModal(\'new-patient\')">+ Add Patient</button></div></div>';
  html += '<div class="tabs"><div class="tab active">All Patients</div><div class="tab">VIP</div><div class="tab">New</div><div class="tab">Regular</div></div>';
  html += '<div class="card"><div class="table-wrap"><table><thead><tr><th>Patient</th><th>Contact</th><th>Membership</th><th>Referral</th><th>Last Visit</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  if (filtered.length === 0) {
    html += '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">👩</div><h3>No patients found</h3><p>Add your first patient or adjust your search</p></div></td></tr>';
  } else {
    filtered.forEach(p => {
      const lastAppt = State.db.appointments.filter(a=>a.patientId===p.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
      html += '<tr style="cursor:pointer" onclick="Router.navigate(\'patient-detail\',{id:\'' + p.id + '\'})"><td><div class="flex items-center gap-3"><div class="avatar" style="background:var(--primary);color:#fff;font-size:13px">' + p.firstName[0] + p.lastName[0] + '</div><div><div class="font-medium">' + p.firstName + ' ' + p.lastName + '</div><div class="text-xs text-muted">' + p.gender + ' · ' + (p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : '—') + ' yrs</div></div></div></td><td><div class="text-sm">' + p.email + '</div><div class="text-xs text-muted">' + p.phone + '</div></td><td><span class="badge badge-primary">' + p.membershipTier + '</span><div class="text-xs text-muted mt-2">' + p.loyaltyPoints + ' pts</div></td><td class="text-sm">' + p.referralSource + '</td><td class="text-sm">' + (lastAppt ? formatDate(lastAppt.date) : '—') + '</td><td>' + (p.tags?.includes('VIP') ? '<span class="badge badge-warning">VIP</span>' : p.tags?.includes('New') ? '<span class="badge badge-info">New</span>' : '<span class="badge badge-neutral">Active</span>') + '</td><td><button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();Router.navigate(\'patient-detail\',{id:\'' + p.id + '\'})">View</button></td></tr>';
    });
  }
  html += '</tbody></table></div></div>';
  return html;
}

// ============================================
// PATIENT DETAIL
// ============================================
function renderPatientDetail() {
  const p = State.db.patients.find(pt => pt.id === Router.params.id);
  if (!p) return '<div class="empty-state"><h3>Patient not found</h3></div>';
  const appts = State.db.appointments.filter(a => a.patientId === p.id).sort((a,b) => b.date.localeCompare(a.date));
  const records = (State.db.clinicalRecords||[]).filter(r => r.patientId === p.id).sort((a,b) => b.date.localeCompare(a.date));
  const invoices = State.db.invoices.filter(i => i.patientId === p.id);
  const photos = (State.db.photos||[]).filter(ph => ph.patientId === p.id);
  const totalSpent = invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total,0);
  const activeTab = Router.params.tab || 'overview';
  const nextAppt = appts.find(a => a.status === 'scheduled');

  let html = '<div class="page-header"><div class="flex items-center gap-4"><button class="btn btn-ghost" onclick="Router.navigate(\'patients\')">← Back</button><div class="avatar avatar-lg" style="background:var(--primary);color:#fff">' + p.firstName[0] + p.lastName[0] + '</div><div><h1>' + p.firstName + ' ' + p.lastName + '</h1><p>' + p.email + ' · ' + p.phone + ' · ' + p.membershipTier + ' Member · ' + p.loyaltyPoints + ' pts</p></div></div><div class="flex gap-2"><button class="btn btn-primary" onclick="openModal(\'book-appointment\',{patientId:\'' + p.id + '\'})">📅 Book</button><button class="btn btn-secondary" onclick="openModal(\'edit-patient\',{id:\'' + p.id + '\'})">✏️ Edit</button></div></div>';

  html += '<div class="tabs">';
  ['overview','timeline','appointments','records','photos','billing','consents'].forEach(tab => {
    const labels = {overview:'Overview',timeline:'Timeline',appointments:'Appointments ('+appts.length+')',records:'Clinical Records',photos:'Photos',billing:'Billing',consents:'Consents'};
    html += '<div class="tab ' + (activeTab===tab?'active':'') + '" onclick="Router.params.tab=\'' + tab + '\';renderPage()">' + labels[tab] + '</div>';
  });
  html += '</div>';

  if (activeTab === 'overview') {
    html += '<div class="grid grid-3 gap-4">';
    // Patient Info
    html += '<div class="card"><div class="card-header"><h3>📋 Patient Information</h3></div><div class="card-body"><div style="display:flex;flex-direction:column;gap:10px;font-size:14px">';
    [['DOB',formatDate(p.dob)],['Gender',p.gender],['Phone',p.phone],['Email',p.email],['Address',p.address],['Emergency',p.emergencyContact],['Referral',p.referralSource],['Since',formatDate(p.createdAt)]].forEach(([l,v]) => { html += '<div class="flex justify-between"><span class="text-secondary">' + l + '</span><span>' + (v||'—') + '</span></div>'; });
    if (p.tags?.length) html += '<div><span class="text-secondary">Tags: </span>' + p.tags.map(t=>'<span class="badge badge-neutral" style="margin:2px">'+t+'</span>').join('') + '</div>';
    html += '</div></div></div>';
    // Medical
    html += '<div class="card"><div class="card-header"><h3>🏥 Medical Profile</h3></div><div class="card-body"><div style="display:flex;flex-direction:column;gap:12px;font-size:14px">';
    html += '<div><span class="font-medium">Medical History:</span><br><span class="text-secondary">' + (p.medicalHistory||'None reported') + '</span></div>';
    html += '<div><span class="font-medium">Allergies:</span><br>' + (p.allergies?.length ? p.allergies.map(a=>'<span class="badge badge-danger" style="margin:2px">⚠ '+a+'</span>').join('') : '<span class="text-secondary">None reported</span>') + '</div>';
    html += '<div><span class="font-medium">Medications:</span><br>' + (p.medications?.length ? p.medications.map(m=>'<span class="badge badge-info" style="margin:2px">💊 '+m+'</span>').join('') : '<span class="text-secondary">None</span>') + '</div>';
    html += '<div><span class="font-medium">Previous Treatments:</span><br><span class="text-secondary">' + (p.previousTreatments||'None') + '</span></div>';
    html += '<div><span class="font-medium">Notes:</span><br><span class="text-secondary">' + (p.notes||'No notes') + '</span></div>';
    html += '</div></div></div>';
    // Summary
    html += '<div class="card"><div class="card-header"><h3>📊 Summary</h3></div><div class="card-body"><div style="display:flex;flex-direction:column;gap:12px">';
    [['💰',formatCurrency(totalSpent),'Total Spent','green'],['📅',appts.length,'Total Appointments','purple'],['🎯',p.loyaltyPoints,'Loyalty Points','blue']].forEach(([icon,val,label,color]) => {
      html += '<div class="stat-card" style="border:none;padding:0"><div class="stat-icon '+color+'">'+icon+'</div><div><div class="stat-value text-lg">'+val+'</div><div class="stat-label">'+label+'</div></div></div>';
    });
    if (nextAppt) {
      const t = State.db.treatments.find(tr=>tr.id===nextAppt.treatmentId);
      html += '<div style="padding:12px;background:var(--primary-light);border-radius:var(--radius);font-size:13px"><strong>Next Appointment:</strong><br>' + formatDate(nextAppt.date) + ' at ' + nextAppt.time + '<br>' + (t?.name||'Consultation') + '</div>';
    } else {
      html += '<div style="padding:12px;background:var(--success-light);border-radius:var(--radius);font-size:13px;color:var(--success)">✓ No upcoming appointments</div>';
    }
    html += '</div></div></div></div>';
  } else if (activeTab === 'timeline') {
    const events = [...appts.map(a => ({date:a.date,content:formatDate(a.date)+' — '+(State.db.treatments.find(t=>t.id===a.treatmentId)?.name||'Consultation')+' — '+a.status.replace('_',' '),icon:'📅'})),...records.map(r => ({date:r.date,content:r.treatmentName+(r.areas?' — '+r.areas:''),icon:'📋'}))].sort((a,b)=>b.date.localeCompare(a.date));
    html += '<div class="card"><div class="card-body">';
    if (events.length === 0) { html += '<div class="empty-state"><h3>No timeline events yet</h3></div>'; }
    else { html += '<div class="timeline">'; events.forEach(e => { html += '<div class="timeline-item"><div class="timeline-date">'+formatDate(e.date)+'</div><div class="timeline-content">'+e.icon+' '+e.content+'</div></div>'; }); html += '</div>'; }
    html += '</div></div>';
  } else if (activeTab === 'appointments') {
    html += '<div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Date</th><th>Time</th><th>Treatment</th><th>Practitioner</th><th>Status</th></tr></thead><tbody>';
    appts.forEach(a => { const t=State.db.treatments.find(tr=>tr.id===a.treatmentId); const dr=State.db.users.find(u=>u.id===a.practitionerId); html += '<tr><td>'+formatDate(a.date)+'</td><td>'+a.time+'</td><td>'+(t?.name||'—')+'</td><td>'+(dr?.name||'—')+'</td><td>'+statusBadge(a.status)+'</td></tr>'; });
    html += '</tbody></table></div></div>';
  } else if (activeTab === 'records') {
    html += '<div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Date</th><th>Treatment</th><th>Areas</th><th>Notes</th><th>Follow-up</th></tr></thead><tbody>';
    records.forEach(r => { html += '<tr><td>'+formatDate(r.date)+'</td><td>'+r.treatmentName+'</td><td>'+(r.areas||'—')+'</td><td class="text-sm" style="max-width:200px">'+r.notes+'</td><td>'+formatDate(r.followUpDate)+'</td></tr>'; });
    html += '</tbody></table></div></div>';
  } else if (activeTab === 'photos') {
    const before = photos.filter(ph=>ph.type==='before'); const after = photos.filter(ph=>ph.type==='after');
    html += '<div class="card mb-4"><div class="card-header"><h3>📸 Before & After Gallery</h3><button class="btn btn-sm btn-primary" onclick="openModal(\'upload-photo\',{patientId:\''+p.id+'\'})">+ Upload Photo</button></div><div class="card-body">';
    if (before.length===0 && after.length===0) { html += '<div class="empty-state"><div class="empty-icon">📸</div><h3>No photos yet</h3><p>Upload before and after photos to track treatment progress</p></div>'; }
    else { html += '<div class="ba-compare"><div class="ba-photo"><div style="width:250px;height:250px;background:var(--bg-hover);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:48px">🤳</div><p>Before</p><div class="text-xs text-muted">'+(before.map(ph=>ph.treatmentName+' - '+ph.area+' ('+formatDate(ph.date)+')').join('<br>')||'No before photos')+'</div></div><div class="ba-arrow">→</div><div class="ba-photo"><div style="width:250px;height:250px;background:var(--success-light);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:48px">✨</div><p>After</p><div class="text-xs text-muted">'+(after.map(ph=>ph.treatmentName+' - '+ph.area+' ('+formatDate(ph.date)+')').join('<br>')||'No after photos yet')+'</div></div></div>'; }
    html += '</div></div>';
  } else if (activeTab === 'billing') {
    html += '<div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Invoice</th><th>Treatment</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>';
    invoices.forEach(i => { html += '<tr><td class="font-medium">#'+i.id+'</td><td>'+i.treatmentName+'</td><td>'+formatDate(i.date)+'</td><td class="font-semibold">'+formatCurrency(i.total)+'</td><td>'+statusBadge(i.status)+'</td></tr>'; });
    html += '</tbody></table></div></div>';
  } else if (activeTab === 'consents') {
    html += '<div class="card"><div class="card-body"><div style="display:flex;flex-direction:column;gap:16px">';
    State.db.consentForms.forEach(cf => {
      const signed = cf.id==='cf1'?p.consentSigned : cf.id==='cf2'?p.photoConsent : cf.id==='cf4'?p.gdprConsent : false;
      html += '<div class="consent-form"><h4>'+cf.name+' <span class="badge '+(signed?'badge-success':'badge-warning')+'" style="margin-left:8px">'+(signed?'Signed':'Pending')+'</span></h4><p class="text-sm text-secondary mb-2">'+cf.description+'</p>';
      cf.fields.forEach(f => { html += '<div class="consent-item"><input type="checkbox" '+(signed?'checked':'')+' disabled> <span class="text-sm">'+f+'</span></div>'; });
      if (!signed) html += '<button class="btn btn-sm btn-primary mt-2" onclick="signConsent(\''+p.id+'\',\''+cf.id+'\')">Sign Consent</button>';
      html += '</div>';
    });
    html += '</div></div></div>';
  }
  return html;
}

function signConsent(patientId, formId) {
  const p = State.db.patients.find(pt => pt.id === patientId); if (!p) return;
  if (formId==='cf1') p.consentSigned=true; if (formId==='cf2') p.photoConsent=true; if (formId==='cf3') p.injectableConsent=true; if (formId==='cf4') p.gdprConsent=true;
  saveDB(State.db); addAuditLog('CONSENT_SIGNED','Patient '+p.firstName+' '+p.lastName+' signed '+formId); showToast('Consent form signed successfully','success'); renderPage();
}

// ============================================
// APPOINTMENTS
// ============================================
function renderAppointments() {
  const view = Router.params.view || 'calendar';
  let html = '<div class="page-header"><div><h1>📅 Appointments & Scheduling</h1><p>Manage your clinic calendar</p></div><div class="flex gap-2"><button class="btn btn-primary" onclick="openModal(\'book-appointment\')">+ New Appointment</button></div></div>';
  html += '<div class="tabs"><div class="tab '+(view==='calendar'?'active':'')+'" onclick="Router.params.view=\'calendar\';renderPage()">📅 Calendar</div><div class="tab '+(view==='list'?'active':'')+'" onclick="Router.params.view=\'list\';renderPage()">📋 List View</div><div class="tab '+(view==='waiting'?'active':'')+'" onclick="Router.params.view=\'waiting\';renderPage()">⏳ Waiting List</div></div>';

  if (view === 'calendar') {
    const year=State.calendarYear, month=State.calendarMonth;
    const firstDay=new Date(year,month,1), lastDay=new Date(year,month+1,0);
    const startDay=firstDay.getDay(), daysInMonth=lastDay.getDate();
    const today=new Date(), monthName=firstDay.toLocaleString('en-US',{month:'long',year:'numeric'});
    let days=[];
    const prevMonth=new Date(year,month,0);
    for (let i=startDay-1;i>=0;i--) days.push({day:prevMonth.getDate()-i,otherMonth:true,date:null});
    for (let d=1;d<=daysInMonth;d++) { const ds=''+year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'); days.push({day:d,otherMonth:false,date:ds,isToday:today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===d}); }
    for (let d=1;days.length<42;d++) days.push({day:d,otherMonth:true,date:null});
    const tc={t1:'botox',t2:'filler',t3:'filler',t4:'laser',t5:'laser',t6:'peel',t7:'peel',t8:'peel',t9:'consult',t10:'botox',t11:'filler',t12:'consult'};
    html += '<div class="card"><div class="calendar-header"><button class="btn btn-ghost" onclick="State.calendarMonth--;if(State.calendarMonth<0){State.calendarMonth=11;State.calendarYear--}renderPage()">←</button><h3>'+monthName+'</h3><button class="btn btn-ghost" onclick="State.calendarMonth++;if(State.calendarMonth>11){State.calendarMonth=0;State.calendarYear++}renderPage()">→</button></div>';
    html += '<div class="calendar-grid">';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => { html += '<div class="calendar-day-header">'+d+'</div>'; });
    days.forEach(d => {
      const dayAppts = d.date ? State.db.appointments.filter(a=>a.date===d.date&&a.status!=='cancelled') : [];
      html += '<div class="calendar-day '+(d.otherMonth?'other-month':'')+' '+(d.isToday?'today':'')+'" '+(d.date?'onclick="Router.params.calDate=\''+d.date+'\';openModal(\'day-appointments\')"':'')+'><div class="day-num">'+d.day+'</div>';
      dayAppts.slice(0,3).forEach(a => { const t=State.db.treatments.find(tr=>tr.id===a.treatmentId); html += '<div class="day-event '+(tc[a.treatmentId]||'consult')+'">'+a.time+' '+(t?.name?.split(' ')[0]||'')+'</div>'; });
      if (dayAppts.length>3) html += '<div class="text-xs text-muted">+'+(dayAppts.length-3)+' more</div>';
      html += '</div>';
    });
    html += '</div></div>';
  } else if (view === 'list') {
    const appts = State.db.appointments.sort((a,b) => b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
    html += '<div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Treatment</th><th>Practitioner</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    appts.slice(0,50).forEach(a => {
      const p=State.db.patients.find(pt=>pt.id===a.patientId), t=State.db.treatments.find(tr=>tr.id===a.treatmentId), dr=State.db.users.find(u=>u.id===a.practitionerId);
      html += '<tr><td>'+formatDate(a.date)+'</td><td>'+a.time+'</td><td><a href="#" onclick="Router.navigate(\'patient-detail\',{id:\''+a.patientId+'\'});return false">'+(p?.firstName||'')+' '+(p?.lastName||'')+'</a></td><td>'+(t?.name||'—')+'</td><td>'+(dr?.name||'—')+'</td><td>'+statusBadge(a.status)+'</td><td>';
      if (a.status==='scheduled') html += '<button class="btn btn-sm btn-success" onclick="updateApptStatus(\''+a.id+'\',\'completed\')">✓</button> <button class="btn btn-sm btn-danger" onclick="updateApptStatus(\''+a.id+'\',\'cancelled\')">✕</button> <button class="btn btn-sm btn-warning" onclick="updateApptStatus(\''+a.id+'\',\'no_show\')">No Show</button>';
      html += '</td></tr>';
    });
    html += '</tbody></table></div></div>';
  } else {
    const noShows = State.db.appointments.filter(a=>a.status==='no_show');
    html += '<div class="card"><div class="card-body">';
    if (noShows.length===0) { html += '<div class="empty-state"><h3>No patients on waiting list</h3></div>'; }
    else {
      html += '<table><thead><tr><th>Patient</th><th>Treatment</th><th>Date</th><th>Action</th></tr></thead><tbody>';
      noShows.forEach(a => { const p=State.db.patients.find(pt=>pt.id===a.patientId), t=State.db.treatments.find(tr=>tr.id===a.treatmentId); html += '<tr><td>'+(p?.firstName||'')+' '+(p?.lastName||'')+'</td><td>'+(t?.name||'—')+'</td><td>'+formatDate(a.date)+'</td><td><button class="btn btn-sm btn-primary" onclick="openModal(\'book-appointment\',{patientId:\''+a.patientId+'\'})">Rebook</button></td></tr>'; });
      html += '</tbody></table>';
    }
    html += '</div></div>';
  }
  return html;
}

function updateApptStatus(id, status) {
  const a = State.db.appointments.find(ap => ap.id === id); if (!a) return;
  a.status = status; saveDB(State.db); addAuditLog('APPOINTMENT_STATUS','Appointment '+id+' marked as '+status); showToast('Appointment marked as '+status.replace('_',' '),'success'); renderPage();
}
// ============================================
// TREATMENTS
// ============================================
function renderTreatments() {
  const categories = [...new Set(State.db.treatments.map(t=>t.category))];
  const activeCategory = Router.params.cat || 'all';
  const filtered = activeCategory === 'all' ? State.db.treatments : State.db.treatments.filter(t=>t.category===activeCategory);
  let html = '<div class="page-header"><div><h1>💉 Treatment Catalog</h1><p>'+State.db.treatments.length+' treatments across '+categories.length+' categories</p></div><button class="btn btn-primary" onclick="openModal(\'new-treatment\')">+ Add Treatment</button></div>';
  html += '<div class="tabs"><div class="tab '+(activeCategory==='all'?'active':'')+'" onclick="Router.params.cat=\'all\';renderPage()">All</div>';
  categories.forEach(c => { html += '<div class="tab '+(activeCategory===c?'active':'')+'" onclick="Router.params.cat=\''+c+'\';renderPage()">'+c+'</div>'; });
  html += '</div><div class="grid grid-3 gap-4">';
  filtered.forEach(t => {
    html += '<div class="card" style="cursor:pointer;transition:var(--transition)" onmouseover="this.style.boxShadow=\'var(--shadow-md)\'" onmouseout="this.style.boxShadow=\'\'"><div class="card-body"><div class="flex justify-between items-center mb-2"><span class="badge badge-primary">'+t.category+'</span>'+(t.popular?'<span class="badge badge-warning">⭐ Popular</span>':'')+'</div><h3 class="font-semibold mb-2">'+t.name+'</h3><p class="text-sm text-secondary mb-4">'+t.description+'</p><div class="flex justify-between items-center mb-2"><span class="text-sm text-secondary">⏱ '+t.duration+' min</span><span class="font-bold" style="color:var(--primary);font-size:18px">'+formatCurrency(t.price)+'</span></div>';
    if (t.packagePrice) html += '<div class="text-xs text-muted">Package: '+t.packageSessions+'× for '+formatCurrency(t.packagePrice)+'</div>';
    html += '<div class="text-xs text-muted mt-2">Skill: '+t.skillRequired+' · '+(t.consumables?.length||0)+' consumables</div>';
    if (t.aftercare) html += '<div class="text-xs text-muted mt-2" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Aftercare: '+t.aftercare+'</div>';
    html += '</div></div>';
  });
  html += '</div>';
  return html;
}

// ============================================
// CLINICAL RECORDS
// ============================================
function renderClinical() {
  const records = (State.db.clinicalRecords||[]).sort((a,b)=>b.date.localeCompare(a.date));
  let html = '<div class="page-header"><div><h1>📋 Clinical Documentation</h1><p>'+records.length+' treatment records</p></div><button class="btn btn-primary" onclick="openModal(\'new-clinical-record\')">+ New Record</button></div>';
  html += '<div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Date</th><th>Patient</th><th>Treatment</th><th>Practitioner</th><th>Areas</th><th>Products Used</th><th>Follow-up</th></tr></thead><tbody>';
  if (records.length===0) { html += '<tr><td colspan="7"><div class="empty-state"><h3>No clinical records yet</h3></div></td></tr>'; }
  else { records.forEach(r => { const p=State.db.patients.find(pt=>pt.id===r.patientId), dr=State.db.users.find(u=>u.id===r.practitionerId); html += '<tr><td>'+formatDate(r.date)+'</td><td><a href="#" onclick="Router.navigate(\'patient-detail\',{id:\''+r.patientId+'\'});return false">'+(p?.firstName||'')+' '+(p?.lastName||'')+'</a></td><td>'+r.treatmentName+'</td><td>'+(dr?.name||'—')+'</td><td class="text-sm">'+(r.areas||'—')+'</td><td class="text-sm" style="max-width:150px">'+(Array.isArray(r.productsUsed)?r.productsUsed.join(', '):r.productsUsed||'—')+'</td><td>'+formatDate(r.followUpDate)+'</td></tr>'; }); }
  html += '</tbody></table></div></div>';
  return html;
}

// ============================================
// BILLING
// ============================================
function renderBilling() {
  const invoices = State.db.invoices.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const paidTotal = invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total,0);
  const pendingTotal = invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.total,0);
  let html = '<div class="page-header"><div><h1>💳 Billing & Invoices</h1><p>Financial overview and invoice management</p></div><div class="flex gap-2"><button class="btn btn-primary" onclick="openModal(\'new-invoice\')">+ Create Invoice</button><button class="btn btn-secondary" onclick="showToast(\'Report exported\',\'success\')">📥 Export</button></div></div>';
  html += '<div class="grid grid-3 gap-4 mb-6"><div class="stat-card"><div class="stat-icon green">💰</div><div><div class="stat-value">'+formatCurrency(paidTotal)+'</div><div class="stat-label">Total Collected</div></div></div><div class="stat-card"><div class="stat-icon orange">⏳</div><div><div class="stat-value">'+formatCurrency(pendingTotal)+'</div><div class="stat-label">Outstanding</div></div></div><div class="stat-card"><div class="stat-icon purple">📄</div><div><div class="stat-value">'+invoices.length+'</div><div class="stat-label">Total Invoices</div></div></div></div>';
  html += '<div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Invoice #</th><th>Patient</th><th>Treatment</th><th>Date</th><th>Subtotal</th><th>Tax</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  invoices.slice(0,30).forEach(i => { const p=State.db.patients.find(pt=>pt.id===i.patientId); html += '<tr><td class="font-medium">#'+i.id+'</td><td>'+(p?.firstName||'')+' '+(p?.lastName||'')+'</td><td class="text-sm">'+i.treatmentName+'</td><td>'+formatDate(i.date)+'</td><td>'+formatCurrency(i.subtotal)+'</td><td>'+formatCurrency(i.tax)+'</td><td class="font-semibold">'+formatCurrency(i.total)+'</td><td>'+statusBadge(i.status)+'</td><td>'+(i.status==='pending'?'<button class="btn btn-sm btn-success" onclick="markInvoicePaid(\''+i.id+'\')">Mark Paid</button>':'')+' <button class="btn btn-sm btn-ghost" onclick="openModal(\'view-invoice\',{id:\''+i.id+'\'})">View</button></td></tr>'; });
  html += '</tbody></table></div></div>';
  return html;
}

function markInvoicePaid(id) {
  const inv = State.db.invoices.find(i=>i.id===id); if (!inv) return;
  inv.status='paid'; inv.paidDate=now(); saveDB(State.db); addAuditLog('INVOICE_PAID','Invoice #'+id+' marked as paid'); showToast('Invoice marked as paid','success'); renderPage();
}

// ============================================
// INVENTORY
// ============================================
function renderInventory() {
  const items = State.db.inventory;
  const lowStock = items.filter(i=>i.stockQty<=i.minStock);
  const categories = [...new Set(items.map(i=>i.category))];
  let html = '<div class="page-header"><div><h1>📦 Inventory & Stock</h1><p>'+items.length+' items · '+lowStock.length+' low stock alerts</p></div><div class="flex gap-2"><button class="btn btn-primary" onclick="openModal(\'new-inventory-item\')">+ Add Item</button><button class="btn btn-secondary" onclick="openModal(\'purchase-order\')">🛒 Purchase Order</button></div></div>';
  if (lowStock.length>0) {
    html += '<div class="card mb-4" style="border-color:var(--danger)"><div class="card-header" style="background:var(--danger-light)"><h3 style="color:var(--danger)">⚠️ Low Stock Alerts</h3></div><div class="card-body" style="padding:0"><table><thead><tr><th>Item</th><th>Category</th><th>Current Stock</th><th>Min. Stock</th><th>Supplier</th><th>Action</th></tr></thead><tbody>';
    lowStock.forEach(i => { html += '<tr style="background:var(--danger-light)"><td class="font-medium">'+i.name+'</td><td>'+i.category+'</td><td><span class="stock-indicator"><span class="dot red"></span>'+i.stockQty+'</span></td><td>'+i.minStock+'</td><td>'+i.supplier+'</td><td><button class="btn btn-sm btn-primary" onclick="restockItem(\''+i.id+'\')">Reorder</button></td></tr>'; });
    html += '</tbody></table></div></div>';
  }
  html += '<div class="tabs"><div class="tab active">All Items</div>';
  categories.forEach(c => { html += '<div class="tab">'+c+'</div>'; });
  html += '</div><div class="card"><div class="card-body" style="padding:0"><table><thead><tr><th>Item</th><th>SKU</th><th>Category</th><th>Batch</th><th>Expiry</th><th>Stock</th><th>Unit Cost</th><th>Location</th></tr></thead><tbody>';
  items.forEach(i => {
    const sc = i.stockQty<=i.minStock?'red':i.stockQty<=i.minStock*1.5?'yellow':'green';
    const isExp = i.expiryDate&&new Date(i.expiryDate)<new Date(Date.now()+90*86400000);
    html += '<tr><td class="font-medium">'+i.name+'</td><td class="text-sm text-muted">'+i.sku+'</td><td><span class="badge badge-neutral">'+i.category+'</span></td><td class="text-sm">'+i.batchNumber+'</td><td class="text-sm '+(isExp?'font-semibold':'')+'" style="'+(isExp?'color:var(--warning)':'')+'">'+formatDate(i.expiryDate)+(isExp?' ⚠️':'')+'</td><td><span class="stock-indicator"><span class="dot '+sc+'"></span>'+i.stockQty+'</span></td><td>'+formatCurrency(i.unitCost)+'</td><td class="text-sm">'+i.location+'</td></tr>';
  });
  html += '</tbody></table></div></div>';
  return html;
}

function restockItem(id) {
  const item = State.db.inventory.find(i=>i.id===id); if (!item) return;
  item.stockQty = item.minStock*3; saveDB(State.db); addAuditLog('INVENTORY_RESTOCK','Restocked '+item.name+' to '+item.stockQty); showToast(item.name+' restocked to '+item.stockQty+' units','success'); renderPage();
}

// ============================================
// MARKETING & LEADS
// ============================================
function renderMarketing() {
  const leads = State.db.leads;
  let html = '<div class="page-header"><div><h1>📣 Marketing & Lead Management</h1><p>'+leads.length+' leads in pipeline</p></div><button class="btn btn-primary" onclick="openModal(\'new-lead\')">+ Add Lead</button></div>';
  html += '<div class="grid grid-4 gap-4 mb-6"><div class="stat-card"><div class="stat-icon blue">🆕</div><div><div class="stat-value">'+leads.filter(l=>l.status==='new').length+'</div><div class="stat-label">New</div></div></div><div class="stat-card"><div class="stat-icon purple">📞</div><div><div class="stat-value">'+leads.filter(l=>l.status==='contacted').length+'</div><div class="stat-label">Contacted</div></div></div><div class="stat-card"><div class="stat-icon orange">🎯</div><div><div class="stat-value">'+leads.filter(l=>l.status==='qualified'||l.status==='consultation_booked').length+'</div><div class="stat-label">Qualified</div></div></div><div class="stat-card"><div class="stat-icon green">✅</div><div><div class="stat-value">'+leads.filter(l=>l.status==='won').length+'</div><div class="stat-label">Converted</div></div></div></div>';

  // Kanban
  html += '<div class="card mb-6"><div class="card-header"><h3>🔄 Lead Pipeline</h3></div><div class="card-body"><div class="kanban">';
  [{key:'new',label:'New',color:'var(--info)',bg:'var(--info-light)'},{key:'contacted',label:'Contacted',color:'var(--primary)',bg:'var(--primary-light)'},{key:'qualified',label:'Qualified',color:'var(--accent)',bg:'var(--accent-light)'},{key:'consultation_booked',label:'Consultation',color:'var(--warning)',bg:'var(--warning-light)'},{key:'won',label:'Won 🎉',color:'var(--success)',bg:'var(--success-light)'}].forEach(stage => {
    html += '<div class="kanban-col"><div class="kanban-col-header" style="background:'+stage.bg+';color:'+stage.color+'"><span>'+stage.label+'</span><span class="badge badge-neutral">'+leads.filter(l=>l.status===stage.key).length+'</span></div><div class="kanban-col-body">';
    leads.filter(l=>l.status===stage.key).forEach(l => {
      html += '<div class="kanban-card" onclick="openModal(\'edit-lead\',{id:\''+l.id+'\'})"><div class="font-medium text-sm">'+l.name+'</div><div class="text-xs text-muted mt-2">'+l.interest+'</div><div class="flex justify-between items-center mt-2"><span class="text-xs text-muted">'+l.source+'</span><span class="text-xs font-semibold" style="color:var(--primary)">'+formatCurrency(l.estimatedValue)+'</span></div>';
      if (stage.key!=='won') html += '<button class="btn btn-sm btn-ghost mt-2 w-full" onclick="event.stopPropagation();advanceLead(\''+l.id+'\',\''+stage.key+'\')">Advance →</button>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  html += '</div></div></div>';

  // Referral Sources
  html += '<div class="card"><div class="card-header"><h3>📊 Referral Sources</h3></div><div class="card-body">';
  getReferralStats().forEach(r => { html += '<div class="flex items-center gap-3 mb-3"><span class="text-sm" style="width:120px">'+r.source+'</span><div style="flex:1"><div class="progress-bar"><div class="progress-fill purple" style="width:'+r.pct+'%"></div></div></div><span class="text-sm font-semibold">'+r.count+' ('+r.pct+'%)</span></div>'; });
  html += '</div></div>';
  return html;
}

function advanceLead(id, currentStatus) {
  const stages=['new','contacted','qualified','consultation_booked','won'];
  const lead=State.db.leads.find(l=>l.id===id); if (!lead) return;
  const idx=stages.indexOf(currentStatus);
  if (idx<stages.length-1) { lead.status=stages[idx+1]; saveDB(State.db); addAuditLog('LEAD_ADVANCED','Lead '+lead.name+' moved to '+lead.status); showToast('Lead advanced to '+lead.status.replace('_',' '),'success'); if (lead.status==='won') showToast('🎉 Lead converted! Consider creating a patient record.','info'); renderPage(); }
}

// ============================================
// REPORTS
// ============================================
function renderReports() {
  const db=State.db, thisMonth=new Date().toISOString().slice(0,7);
  const monthAppts=db.appointments.filter(a=>a.date?.startsWith(thisMonth));
  const monthRevenue=db.invoices.filter(i=>i.date?.startsWith(thisMonth)&&i.status==='paid');
  const totalRev=monthRevenue.reduce((s,i)=>s+i.total,0);
  const treatmentRev={}, doctorRev={};
  monthRevenue.forEach(i => { treatmentRev[i.treatmentName]=(treatmentRev[i.treatmentName]||0)+i.total; doctorRev[i.practitionerName]=(doctorRev[i.practitionerName]||0)+i.total; });

  let html = '<div class="page-header"><div><h1>📈 Reports & Analytics</h1><p>Business intelligence and performance metrics</p></div><button class="btn btn-secondary" onclick="showToast(\'Report exported as PDF\',\'success\')">📥 Export PDF</button></div>';
  html += '<div class="grid grid-4 gap-4 mb-6"><div class="stat-card"><div class="stat-icon green">💰</div><div><div class="stat-value">'+formatCurrency(totalRev)+'</div><div class="stat-label">Monthly Revenue</div></div></div><div class="stat-card"><div class="stat-icon purple">📅</div><div><div class="stat-value">'+monthAppts.length+'</div><div class="stat-label">Monthly Appointments</div></div></div><div class="stat-card"><div class="stat-icon blue">👩</div><div><div class="stat-value">'+db.patients.filter(p=>p.createdAt?.startsWith(thisMonth)).length+'</div><div class="stat-label">New Patients</div></div></div><div class="stat-card"><div class="stat-icon orange">📦</div><div><div class="stat-value">'+formatCurrency(db.inventory.reduce((s,i)=>s+i.stockQty*i.unitCost,0))+'</div><div class="stat-label">Inventory Value</div></div></div></div>';

  // Revenue by treatment
  html += '<div class="grid grid-2 gap-4 mb-6"><div class="card"><div class="card-header"><h3>💰 Revenue by Treatment</h3></div><div class="card-body">';
  Object.entries(treatmentRev).sort((a,b)=>b[1]-a[1]).forEach(([name,rev]) => { html += '<div class="flex items-center gap-3 mb-3"><span class="text-sm" style="width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+name+'</span><div style="flex:1"><div class="progress-bar"><div class="progress-fill purple" style="width:'+(rev/totalRev*100||0).toFixed(0)+'%"></div></div></div><span class="text-sm font-semibold">'+formatCurrency(rev)+'</span></div>'; });
  if (!Object.keys(treatmentRev).length) html += '<div class="text-sm text-muted">No data this month</div>';
  html += '</div></div>';

  // Revenue by practitioner
  html += '<div class="card"><div class="card-header"><h3>👨‍⚕️ Revenue by Practitioner</h3></div><div class="card-body">';
  Object.entries(doctorRev).sort((a,b)=>b[1]-a[1]).forEach(([name,rev]) => { html += '<div class="flex items-center gap-3 mb-3"><span class="text-sm" style="width:150px">'+name+'</span><div style="flex:1"><div class="progress-bar"><div class="progress-fill orange" style="width:'+(rev/totalRev*100||0).toFixed(0)+'%"></div></div></div><span class="text-sm font-semibold">'+formatCurrency(rev)+'</span></div>'; });
  if (!Object.keys(doctorRev).length) html += '<div class="text-sm text-muted">No data this month</div>';
  html += '</div></div></div>';

  // Appointment stats + Acquisition
  html += '<div class="grid grid-2 gap-4"><div class="card"><div class="card-header"><h3>📊 Appointment Statistics</h3></div><div class="card-body"><div style="display:flex;flex-direction:column;gap:12px">';
  [['Total this month',monthAppts.length,''],['Completed',monthAppts.filter(a=>a.status==='completed').length,'color:var(--success)'],['Scheduled',monthAppts.filter(a=>a.status==='scheduled').length,'color:var(--info)'],['Cancelled',monthAppts.filter(a=>a.status==='cancelled').length,'color:var(--danger)'],['No-shows',monthAppts.filter(a=>a.status==='no_show').length,'color:var(--warning)'],['No-show rate',monthAppts.length?(monthAppts.filter(a=>a.status==='no_show').length/monthAppts.length*100).toFixed(1)+'%':'0%','']].forEach(([l,v,s]) => { html += '<div class="flex justify-between"><span class="text-sm text-secondary">'+l+'</span><span class="font-semibold" style="'+s+'">'+v+'</span></div>'; });
  html += '</div></div></div>';

  html += '<div class="card"><div class="card-header"><h3>🎯 Patient Acquisition</h3></div><div class="card-body">';
  getReferralStats().slice(0,6).forEach(r => { html += '<div class="flex items-center gap-3 mb-3"><span class="text-sm" style="width:120px">'+r.source+'</span><div style="flex:1"><div class="progress-bar"><div class="progress-fill green" style="width:'+r.pct+'%"></div></div></div><span class="text-sm font-semibold">'+r.count+'</span></div>'; });
  html += '</div></div></div>';
  return html;
}

// ============================================
// STAFF
// ============================================
function renderStaff() {
  const users = State.db.users;
  let html = '<div class="page-header"><div><h1>👥 Staff Management</h1><p>'+users.length+' team members</p></div><button class="btn btn-primary" onclick="openModal(\'new-staff\')">+ Add Staff</button></div><div class="grid grid-3 gap-4">';
  users.forEach(u => {
    const rc={super_admin:'badge-danger',clinic_admin:'badge-warning',doctor:'badge-primary',nurse:'badge-success',receptionist:'badge-info',accountant:'badge-neutral'};
    html += '<div class="card"><div class="card-body"><div class="flex items-center gap-4 mb-4"><div class="avatar avatar-lg" style="background:'+(u.color||'var(--primary)')+';color:#fff">'+(u.avatar||u.name?.split(' ').map(n=>n[0]).join(''))+'</div><div><h3 class="font-semibold">'+u.name+'</h3><span class="badge '+(rc[u.role]||'badge-neutral')+'">'+u.role.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())+'</span><div class="text-xs text-muted mt-2">'+u.email+'</div></div></div>';
    if (u.specializations) html += '<div class="mb-2"><span class="text-xs text-secondary">Specializations:</span> '+u.specializations.map(s=>'<span class="badge badge-neutral" style="margin:2px;font-size:11px">'+s+'</span>').join('')+'</div>';
    if (u.certifications) html += '<div class="mb-2"><span class="text-xs text-secondary">Certifications:</span> '+u.certifications.slice(0,2).map(c=>'<span class="badge badge-info" style="margin:2px;font-size:11px">'+c+'</span>').join('')+'</div>';
    html += '<div class="text-xs text-muted">'+(u.workingHours||'Standard hours')+'</div><div class="flex gap-2 mt-4"><span class="badge '+(u.active?'badge-success':'badge-danger')+'">'+(u.active?'Active':'Inactive')+'</span></div></div></div>';
  });
  html += '</div>';
  return html;
}

// ============================================
// SETTINGS
// ============================================
function renderSettings() {
  const s=State.db.settings, c=State.db.clinic;
  let html = '<div class="page-header"><div><h1>⚙️ Settings & Configuration</h1><p>Manage your clinic settings</p></div></div><div class="tabs"><div class="tab active">Clinic Profile</div><div class="tab">Working Hours</div><div class="tab">Users</div><div class="tab">Audit Log</div><div class="tab">Data</div></div>';
  html += '<div class="grid grid-2 gap-4"><div class="card"><div class="card-header"><h3>🏢 Clinic Profile</h3></div><div class="card-body"><div class="form-group"><label>Clinic Name</label><input class="form-control" value="'+c.name+'" id="sett-name"></div><div class="form-group"><label>Address</label><input class="form-control" value="'+c.address+'" id="sett-addr"></div><div class="form-group"><label>Phone</label><input class="form-control" value="'+c.phone+'" id="sett-phone"></div><div class="form-group"><label>Email</label><input class="form-control" value="'+c.email+'" id="sett-email"></div><div class="form-group"><label>Tax Rate (%)</label><input class="form-control" type="number" step="0.01" value="'+(c.taxRate*100).toFixed(2)+'" id="sett-tax"></div><button class="btn btn-primary" onclick="saveClinicSettings()">Save Changes</button></div></div>';
  html += '<div class="card"><div class="card-header"><h3>⏰ Working Hours</h3></div><div class="card-body"><div class="form-group"><label>Opening Time</label><input class="form-control" type="time" value="'+s.workingHours.start+'" id="sett-start"></div><div class="form-group"><label>Closing Time</label><input class="form-control" type="time" value="'+s.workingHours.end+'" id="sett-end"></div><div class="form-group"><label>Slot Duration (min)</label><input class="form-control" type="number" value="'+s.slotDuration+'" id="sett-slot"></div><div class="form-group"><label>Working Days</label><div class="flex gap-2 flex-wrap mt-2">';
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d => { html += '<label style="display:flex;align-items:center;gap:4px;font-size:13px"><input type="checkbox" '+(s.workingDays.includes(d)?'checked':'')+' class="working-day-cb" value="'+d+'"> '+d+'</label>'; });
  html += '</div></div><div class="form-group"><label>Online Booking</label><div class="toggle '+(s.enableOnlineBooking?'on':'')+'" id="toggle-online-booking"></div></div><button class="btn btn-primary" onclick="saveSchedSettings()">Save Changes</button></div></div></div>';

  // Audit Log
  html += '<div class="card mt-6"><div class="card-header"><h3>📜 Audit Trail</h3><span class="text-sm text-muted">Last 20 entries</span></div><div class="card-body" style="padding:0"><table><thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>';
  State.db.auditLog.slice(0,20).forEach(a => { const u=State.db.users.find(usr=>usr.id===a.userId); html += '<tr><td class="text-sm">'+formatDateTime(a.timestamp)+'</td><td>'+(u?.name||'System')+'</td><td><span class="badge badge-neutral">'+a.action+'</span></td><td class="text-sm">'+a.details+'</td></tr>'; });
  html += '</tbody></table></div></div>';

  // Data management
  html += '<div class="card mt-6"><div class="card-header"><h3>🗑️ Data Management</h3></div><div class="card-body"><div class="flex gap-3"><button class="btn btn-secondary" onclick="exportData()">📤 Export All Data</button><button class="btn btn-danger" onclick="if(confirm(\'This will reset ALL data. Continue?\')){localStorage.removeItem(DB_KEY);location.reload()}">🔄 Reset to Seed Data</button></div><p class="text-xs text-muted mt-2">GDPR/HIPAA: Export or delete all patient data above.</p></div></div>';
  return html;
}

function saveClinicSettings() {
  State.db.clinic.name=document.getElementById('sett-name')?.value||State.db.clinic.name;
  State.db.clinic.address=document.getElementById('sett-addr')?.value||State.db.clinic.address;
  State.db.clinic.phone=document.getElementById('sett-phone')?.value||State.db.clinic.phone;
  State.db.clinic.email=document.getElementById('sett-email')?.value||State.db.clinic.email;
  const t=parseFloat(document.getElementById('sett-tax')?.value); if(!isNaN(t)) State.db.clinic.taxRate=t/100;
  saveDB(State.db); addAuditLog('SETTINGS_UPDATE','Updated clinic profile'); showToast('Clinic settings saved','success');
}

function saveSchedSettings() {
  State.db.settings.workingHours.start=document.getElementById('sett-start')?.value||State.db.settings.workingHours.start;
  State.db.settings.workingHours.end=document.getElementById('sett-end')?.value||State.db.settings.workingHours.end;
  const slot=parseInt(document.getElementById('sett-slot')?.value); if(!isNaN(slot)) State.db.settings.slotDuration=slot;
  const days=[...document.querySelectorAll('.working-day-cb:checked')].map(cb=>cb.value); if(days.length) State.db.settings.workingDays=days;
  saveDB(State.db); addAuditLog('SETTINGS_UPDATE','Updated scheduling settings'); showToast('Scheduling settings saved','success');
}

function exportData() {
  const data=JSON.stringify(State.db,null,2), blob=new Blob([data],{type:'application/json'}), url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='aestheticflow_export.json'; a.click(); URL.revokeObjectURL(url);
  showToast('Data exported successfully','success'); addAuditLog('DATA_EXPORT','Full data export downloaded');
}

// ============================================
// SEARCH
// ============================================
function renderSearch() {
  const q=(Router.params.query||'').toLowerCase();
  if(!q) return '<div class="empty-state"><h3>Enter a search query</h3></div>';
  const patients=State.db.patients.filter(p=>(p.firstName+' '+p.lastName+' '+p.email+' '+p.phone).toLowerCase().includes(q));
  const treatments=State.db.treatments.filter(t=>(t.name+' '+t.category).toLowerCase().includes(q));
  let html = '<div class="page-header"><h1>🔍 Search Results for "'+Router.params.query+'"</h1></div>';
  if(patients.length) { html += '<div class="card mb-4"><div class="card-header"><h3>👩 Patients ('+patients.length+')</h3></div><div class="card-body" style="padding:0"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Membership</th></tr></thead><tbody>'; patients.forEach(p => { html += '<tr style="cursor:pointer" onclick="Router.navigate(\'patient-detail\',{id:\''+p.id+'\'})"><td>'+p.firstName+' '+p.lastName+'</td><td>'+p.email+'</td><td>'+p.phone+'</td><td><span class="badge badge-primary">'+p.membershipTier+'</span></td></tr>'; }); html += '</tbody></table></div></div>'; }
  if(treatments.length) { html += '<div class="card mb-4"><div class="card-header"><h3>💉 Treatments ('+treatments.length+')</h3></div><div class="card-body" style="padding:0"><table><thead><tr><th>Name</th><th>Category</th><th>Price</th></tr></thead><tbody>'; treatments.forEach(t => { html += '<tr><td>'+t.name+'</td><td>'+t.category+'</td><td>'+formatCurrency(t.price)+'</td></tr>'; }); html += '</tbody></table></div></div>'; }
  if(!patients.length&&!treatments.length) html += '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No results found</h3><p>Try different search terms</p></div>';
  return html;
}

// ============================================
// PATIENT PORTAL
// ============================================
function renderPatientPortal() {
  let html = '<div class="portal-page"><div class="portal-header"><div class="flex items-center gap-3"><span style="font-size:24px">✨</span><div><h2 style="font-size:18px;font-weight:700;color:var(--primary)">'+State.db.clinic.name+'</h2><p class="text-xs text-muted">Patient Portal</p></div></div><button class="btn btn-secondary btn-sm" onclick="Router.navigate(\'dashboard\')">← Back to Admin</button></div><div class="portal-content"><div style="text-align:center;padding:40px 20px"><h1 style="font-size:28px;font-weight:700;margin-bottom:8px">Welcome to Your Portal</h1><p class="text-secondary mb-6">View your appointments, treatment history, and more</p></div><div class="grid grid-3 gap-4 mb-6"><div class="card" style="cursor:pointer;text-align:center;padding:32px 20px" onclick="Router.navigate(\'online-booking\')"><div style="font-size:36px;margin-bottom:12px">📅</div><h3 class="font-semibold mb-2">Book Appointment</h3><p class="text-sm text-secondary">Schedule your next visit</p></div><div class="card" style="text-align:center;padding:32px 20px"><div style="font-size:36px;margin-bottom:12px">📋</div><h3 class="font-semibold mb-2">Treatment History</h3><p class="text-sm text-secondary">View past treatments</p></div><div class="card" style="text-align:center;padding:32px 20px"><div style="font-size:36px;margin-bottom:12px">💳</div><h3 class="font-semibold mb-2">Invoices & Payments</h3><p class="text-sm text-secondary">View and pay invoices</p></div></div>';
  html += '<div class="card"><div class="card-header"><h3>Upcoming Appointments</h3></div><div class="card-body">';
  const upcoming=State.db.appointments.filter(a=>a.status==='scheduled').slice(0,3);
  if(upcoming.length===0) { html += '<div class="empty-state" style="padding:20px"><p>No upcoming appointments</p></div>'; }
  else { upcoming.forEach(a => { const t=State.db.treatments.find(tr=>tr.id===a.treatmentId), dr=State.db.users.find(u=>u.id===a.practitionerId); html += '<div class="flex items-center justify-between mb-4 p-4" style="background:var(--primary-light);border-radius:var(--radius)"><div><div class="font-medium">'+(t?.name||'Consultation')+'</div><div class="text-sm text-muted">'+formatDate(a.date)+' at '+a.time+'</div></div><div class="text-right"><div class="text-sm font-medium">'+(dr?.name||'TBD')+'</div><div class="text-xs text-muted">'+formatCurrency(t?.price||0)+'</div></div></div>'; }); }
  html += '</div></div></div></div>';
  return html;
}

// ============================================
// ONLINE BOOKING
// ============================================
function renderOnlineBooking() {
  const step = Router.params.bookingStep || 1;
  let html = '<div class="booking-page"><div class="booking-header"><span style="font-size:48px">✨</span><h1>'+State.db.clinic.name+'</h1><p>Book your treatment online</p></div><div class="booking-steps"><div class="booking-step '+(step>=1?'active':'')+' '+(step>1?'done':'')+'">1. Treatment</div><div class="booking-step '+(step>=2?'active':'')+' '+(step>2?'done':'')+'">2. Date & Time</div><div class="booking-step '+(step>=3?'active':'')+'">3. Details</div></div><div class="booking-content">';
  if (step===1) {
    html += '<h2 class="font-semibold mb-4">Select a Treatment</h2>';
    State.db.treatments.filter(t=>t.active&&t.id!=='t12').forEach(t => { html += '<div class="treatment-card" onclick="Router.params.bookingStep=2;Router.params.bookingTreatment=\''+t.id+'\';renderPage()"><div class="flex justify-between items-center"><div><div class="font-medium">'+t.name+'</div><div class="text-sm text-muted">'+t.category+' · '+t.duration+' min</div></div><div class="font-semibold" style="color:var(--primary)">'+formatCurrency(t.price)+'</div></div>'+(t.packagePrice?'<div class="text-xs text-muted mt-2">Package: '+t.packageSessions+' sessions for '+formatCurrency(t.packagePrice)+'</div>':'')+'</div>'; });
  } else if (step===2) {
    html += '<h2 class="font-semibold mb-4">Choose Date & Time</h2><div class="card mb-4"><div class="card-body"><div class="form-group"><label>Preferred Date</label><input type="date" class="form-control" id="booking-date" min="'+new Date().toISOString().split('T')[0]+'"></div><div class="form-group"><label>Preferred Time</label><select class="form-control" id="booking-time">'+['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'].map(t=>'<option value="'+t+'">'+t+'</option>').join('')+'</select></div><div class="form-group"><label>Preferred Practitioner</label><select class="form-control" id="booking-doctor"><option value="">Any available</option>'+State.db.users.filter(u=>u.role==='doctor').map(u=>'<option value="'+u.id+'">'+u.name+'</option>').join('')+'</select></div><button class="btn btn-primary w-full" onclick="Router.params.bookingStep=3;renderPage()">Continue</button><button class="btn btn-ghost w-full mt-2" onclick="Router.params.bookingStep=1;renderPage()">← Back</button></div></div>';
  } else {
    html += '<h2 class="font-semibold mb-4">Your Details</h2><div class="card"><div class="card-body"><div class="form-group"><label>Full Name</label><input class="form-control" id="booking-name" placeholder="Your full name"></div><div class="form-group"><label>Email</label><input type="email" class="form-control" id="booking-email" placeholder="your@email.com"></div><div class="form-group"><label>Phone</label><input class="form-control" id="booking-phone" placeholder="+1 310-555-0000"></div><div class="form-group"><label>Notes (optional)</label><textarea class="form-control" id="booking-notes" rows="3" placeholder="Any concerns..."></textarea></div><button class="btn btn-primary w-full btn-lg" onclick="submitBooking()">✨ Confirm Booking</button><button class="btn btn-ghost w-full mt-2" onclick="Router.params.bookingStep=2;renderPage()">← Back</button></div></div>';
  }
  html += '</div></div>';
  return html;
}

function submitBooking() {
  const name=document.getElementById('booking-name')?.value, email=document.getElementById('booking-email')?.value, phone=document.getElementById('booking-phone')?.value, notes=document.getElementById('booking-notes')?.value||'';
  if(!name||!email||!phone) { showToast('Please fill in all required fields','warning'); return; }
  const treatmentId=Router.params.bookingTreatment||'t12', date=document.getElementById('booking-date')?.value||new Date(Date.now()+3*86400000).toISOString().split('T')[0], time=document.getElementById('booking-time')?.value||'10:00', doctorId=document.getElementById('booking-doctor')?.value||'u1';
  let patient=State.db.patients.find(p=>p.email===email);
  if(!patient) { const np=name.split(' '); patient={id:'p'+generateId(),firstName:np[0]||name,lastName:np.slice(1).join(' ')||'',email,phone,dob:'',gender:'',address:'',emergencyContact:'',referralSource:'Online Booking',medicalHistory:'',allergies:[],medications:[],previousTreatments:'',consentSigned:false,gdprConsent:false,photoConsent:false,loyaltyPoints:0,membershipTier:'Bronze',notes,tags:['New','Online Booking'],createdAt:now()}; State.db.patients.push(patient); }
  State.db.appointments.push({id:'apt'+generateId(),patientId:patient.id,treatmentId,practitionerId:doctorId||'u1',roomId:'r1',date,time,duration:30,status:'scheduled',notes,createdAt:now()});
  saveDB(State.db); addAuditLog('ONLINE_BOOKING','New booking: '+name+' for '+(State.db.treatments.find(t=>t.id===treatmentId)?.name||'')); showToast('🎉 Booking confirmed! We\'ll send a confirmation email.','success'); Router.navigate('dashboard');
}
// ============================================
// MODAL SYSTEM
// ============================================
function openModal(type, params = {}) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay'; modal.id = 'active-modal';
  modal.innerHTML = getModalContent(type, params);
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  bindModalEvents(type, params);
}

function closeModal() { document.getElementById('active-modal')?.remove(); }

function getModalContent(type, params) {
  const db = State.db;
  switch(type) {
    case 'new-patient': return '<div class="modal modal-lg"><div class="modal-header"><h3>👤 Add New Patient</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="grid grid-2 gap-4"><div class="form-group"><label>First Name *</label><input class="form-control" id="np-first" required></div><div class="form-group"><label>Last Name *</label><input class="form-control" id="np-last" required></div><div class="form-group"><label>Email *</label><input type="email" class="form-control" id="np-email" required></div><div class="form-group"><label>Phone *</label><input class="form-control" id="np-phone" required></div><div class="form-group"><label>Date of Birth</label><input type="date" class="form-control" id="np-dob"></div><div class="form-group"><label>Gender</label><select class="form-control" id="np-gender"><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option></select></div><div class="form-group"><label>Address</label><input class="form-control" id="np-address"></div><div class="form-group"><label>Emergency Contact</label><input class="form-control" id="np-emergency"></div><div class="form-group"><label>Referral Source</label><select class="form-control" id="np-referral"><option value="">Select</option><option>Google Search</option><option>Instagram</option><option>TikTok</option><option>Facebook</option><option>Referral</option><option>Website</option><option>Walk-in</option><option>Other</option></select></div><div class="form-group"><label>Membership</label><select class="form-control" id="np-tier"><option>Bronze</option><option>Silver</option><option>Gold</option></select></div></div><div class="form-group mt-4"><label>Medical History</label><textarea class="form-control" id="np-medical" rows="2"></textarea></div><div class="form-group"><label>Allergies (comma-separated)</label><input class="form-control" id="np-allergies" placeholder="e.g., Penicillin, Latex"></div><div class="form-group"><label>Current Medications</label><input class="form-control" id="np-medications"></div><div class="form-group"><label>Notes</label><textarea class="form-control" id="np-notes" rows="2"></textarea></div><div class="form-group flex items-center gap-2 mt-2"><input type="checkbox" id="np-consent" checked> <label for="np-consent" style="font-size:13px">Patient consents to data processing (GDPR)</label></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-new-patient">Save Patient</button></div></div>';

    case 'book-appointment': {
      const pid = params.patientId || '';
      return '<div class="modal modal-lg"><div class="modal-header"><h3>📅 Book Appointment</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="grid grid-2 gap-4"><div class="form-group"><label>Patient *</label><select class="form-control" id="ba-patient" '+(pid?'disabled':'')+'><option value="">Select patient</option>'+db.patients.map(p=>'<option value="'+p.id+'" '+(p.id===pid?'selected':'')+'>'+p.firstName+' '+p.lastName+'</option>').join('')+'</select>'+(pid?'<input type="hidden" id="ba-patient-id" value="'+pid+'">':'')+'</div><div class="form-group"><label>Treatment *</label><select class="form-control" id="ba-treatment">'+db.treatments.filter(t=>t.active).map(t=>'<option value="'+t.id+'">'+t.name+' ('+formatCurrency(t.price)+')</option>').join('')+'</select></div><div class="form-group"><label>Date *</label><input type="date" class="form-control" id="ba-date" min="'+new Date().toISOString().split('T')[0]+'" value="'+new Date(Date.now()+86400000).toISOString().split('T')[0]+'"></div><div class="form-group"><label>Time *</label><select class="form-control" id="ba-time">'+['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(t=>'<option value="'+t+'">'+t+'</option>').join('')+'</select></div><div class="form-group"><label>Practitioner *</label><select class="form-control" id="ba-doctor">'+db.users.filter(u=>u.role==='doctor'||u.role==='nurse').map(u=>'<option value="'+u.id+'">'+u.name+' ('+u.role+')</option>').join('')+'</select></div><div class="form-group"><label>Room</label><select class="form-control" id="ba-room">'+db.rooms.map(r=>'<option value="'+r.id+'">'+r.name+' ('+r.type+')</option>').join('')+'</select></div></div><div class="form-group mt-4"><label>Notes</label><textarea class="form-control" id="ba-notes" rows="2"></textarea></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-appointment">Book Appointment</button></div></div>';
    }

    case 'new-lead': return '<div class="modal"><div class="modal-header"><h3>📣 Add New Lead</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="form-group"><label>Name *</label><input class="form-control" id="nl-name" required></div><div class="form-group"><label>Email</label><input type="email" class="form-control" id="nl-email"></div><div class="form-group"><label>Phone</label><input class="form-control" id="nl-phone"></div><div class="form-group"><label>Source</label><select class="form-control" id="nl-source"><option>Instagram</option><option>Google Ads</option><option>TikTok</option><option>Referral</option><option>Website</option><option>WhatsApp</option><option>Walk-in</option><option>Other</option></select></div><div class="form-group"><label>Interest</label><input class="form-control" id="nl-interest" placeholder="e.g., Botox, Fillers"></div><div class="form-group"><label>Estimated Value</label><input type="number" class="form-control" id="nl-value" placeholder="0"></div><div class="form-group"><label>Notes</label><textarea class="form-control" id="nl-notes" rows="2"></textarea></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-lead">Add Lead</button></div></div>';

    case 'new-clinical-record': return '<div class="modal modal-lg"><div class="modal-header"><h3>📋 New Clinical Record</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="grid grid-2 gap-4"><div class="form-group"><label>Patient *</label><select class="form-control" id="ncr-patient">'+db.patients.map(p=>'<option value="'+p.id+'">'+p.firstName+' '+p.lastName+'</option>').join('')+'</select></div><div class="form-group"><label>Treatment *</label><select class="form-control" id="ncr-treatment">'+db.treatments.map(t=>'<option value="'+t.id+'">'+t.name+'</option>').join('')+'</select></div><div class="form-group"><label>Date</label><input type="date" class="form-control" id="ncr-date" value="'+new Date().toISOString().split('T')[0]+'"></div><div class="form-group"><label>Follow-up Date</label><input type="date" class="form-control" id="ncr-followup" value="'+new Date(Date.now()+14*86400000).toISOString().split('T')[0]+'"></div></div><div class="form-group mt-4"><label>Areas Treated</label><input class="form-control" id="ncr-areas" placeholder="e.g., Forehead, Crow\'s feet"></div><div class="form-group"><label>Products Used & Batch Numbers</label><input class="form-control" id="ncr-products" placeholder="e.g., Botox 20U - Batch#BTX-001"></div><div class="form-group"><label>Units Injected</label><input type="number" class="form-control" id="ncr-units" placeholder="0"></div><div class="form-group"><label>Clinical Notes</label><textarea class="form-control" id="ncr-notes" rows="4"></textarea></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-clinical-record">Save Record</button></div></div>';

    case 'new-invoice': return '<div class="modal"><div class="modal-header"><h3>💳 Create Invoice</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="form-group"><label>Patient *</label><select class="form-control" id="ni-patient">'+db.patients.map(p=>'<option value="'+p.id+'">'+p.firstName+' '+p.lastName+'</option>').join('')+'</select></div><div class="form-group"><label>Treatment</label><select class="form-control" id="ni-treatment">'+db.treatments.map(t=>'<option value="'+t.id+'">'+t.name+' — '+formatCurrency(t.price)+'</option>').join('')+'</select></div><div class="form-group"><label>Payment Method</label><select class="form-control" id="ni-payment"><option value="card">Card</option><option value="cash">Cash</option><option value="bank_transfer">Bank Transfer</option></select></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-invoice">Create Invoice</button></div></div>';

    case 'edit-lead': {
      const l = db.leads.find(ld=>ld.id===params.id);
      if (!l) return '<div class="modal"><div class="modal-body">Lead not found</div></div>';
      return '<div class="modal"><div class="modal-header"><h3>✏️ Edit Lead: '+l.name+'</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="form-group"><label>Status</label><select class="form-control" id="el-status">'+['new','contacted','qualified','consultation_booked','won','lost'].map(s=>'<option value="'+s+'" '+(l.status===s?'selected':'')+'>'+s.replace('_',' ').replace(/\b\w/g,x=>x.toUpperCase())+'</option>').join('')+'</select></div><div class="form-group"><label>Interest</label><input class="form-control" id="el-interest" value="'+l.interest+'"></div><div class="form-group"><label>Estimated Value</label><input type="number" class="form-control" id="el-value" value="'+l.estimatedValue+'"></div><div class="form-group"><label>Notes</label><textarea class="form-control" id="el-notes" rows="3">'+(l.notes||'')+'</textarea></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="save-lead-edit">Update Lead</button></div></div>';
    }

    case 'day-appointments': {
      const date = Router.params.calDate || new Date().toISOString().split('T')[0];
      const dayAppts = db.appointments.filter(a=>a.date===date).sort((a,b)=>a.time.localeCompare(b.time));
      let body = '';
      if (dayAppts.length===0) { body = '<div class="empty-state"><p>No appointments on this date</p></div>'; }
      else { dayAppts.forEach(a => { const p=db.patients.find(pt=>pt.id===a.patientId), t=db.treatments.find(tr=>tr.id===a.treatmentId), dr=db.users.find(u=>u.id===a.practitionerId); body += '<div class="flex items-center gap-3 mb-3 p-3" style="background:var(--bg);border-radius:var(--radius)"><div class="avatar avatar-sm" style="background:'+(dr?.color||'var(--primary)')+';color:#fff">'+(dr?.avatar||'?')+'</div><div style="flex:1"><div class="font-medium">'+a.time+' — '+(p?.firstName||'')+' '+(p?.lastName||'')+'</div><div class="text-xs text-muted">'+(t?.name||'Consultation')+' · '+(dr?.name||'—')+'</div></div>'+statusBadge(a.status)+(a.status==='scheduled'?' <button class="btn btn-sm btn-success" onclick="updateApptStatus(\''+a.id+'\',\'completed\');closeModal();openModal(\'day-appointments\')">✓</button>':'')+'</div>'; }); }
      return '<div class="modal"><div class="modal-header"><h3>📅 Appointments for '+formatDate(date)+'</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body">'+body+'</div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button><button class="btn btn-primary" onclick="closeModal();openModal(\'book-appointment\')">+ Add Appointment</button></div></div>';
    }

    case 'view-invoice': {
      const inv = db.invoices.find(i=>i.id===params.id);
      if (!inv) return '<div class="modal"><div class="modal-body">Invoice not found</div></div>';
      const p = db.patients.find(pt=>pt.id===inv.patientId);
      return '<div class="modal modal-lg"><div class="modal-header"><h3>Invoice #'+inv.id+'</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="invoice-preview"><div style="display:flex;justify-content:space-between;margin-bottom:40px"><div><h2 style="font-size:24px">✨ '+db.clinic.name+'</h2><p class="text-sm" style="color:#666">'+db.clinic.address+'<br>'+db.clinic.phone+'</p></div><div style="text-align:right"><h2 style="font-size:20px">INVOICE</h2><p class="text-sm" style="color:#666">#'+inv.id+'<br>'+formatDate(inv.date)+'</p></div></div><div style="margin-bottom:24px"><strong>Bill To:</strong><br>'+(p?.firstName||'')+' '+(p?.lastName||'')+'<br>'+(p?.email||'')+'</div><table style="width:100%;margin-bottom:24px"><thead><tr><th style="text-align:left;padding:8px">Description</th><th style="text-align:right;padding:8px">Amount</th></tr></thead><tbody><tr><td style="padding:8px">'+inv.treatmentName+'</td><td style="text-align:right;padding:8px">'+formatCurrency(inv.subtotal)+'</td></tr></tbody><tfoot><tr><td style="padding:8px"><strong>Subtotal</strong></td><td style="text-align:right;padding:8px">'+formatCurrency(inv.subtotal)+'</td></tr><tr><td style="padding:8px">Tax ('+(db.clinic.taxRate*100).toFixed(2)+'%)</td><td style="text-align:right;padding:8px">'+formatCurrency(inv.tax)+'</td></tr><tr><td style="padding:8px"><strong>TOTAL</strong></td><td style="text-align:right;padding:8px"><strong style="font-size:18px">'+formatCurrency(inv.total)+'</strong></td></tr></tfoot></table><div class="flex justify-between items-center"><span class="badge '+(inv.status==='paid'?'badge-success':'badge-danger')+'" style="font-size:14px">'+inv.status.toUpperCase()+'</span>'+(inv.paymentMethod?'<span class="text-sm" style="color:#666">Paid via '+inv.paymentMethod+'</span>':'')+'</div></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="showToast(\'Invoice PDF downloaded\',\'success\')">📥 Download PDF</button>'+(inv.status==='pending'?'<button class="btn btn-success" onclick="markInvoicePaid(\''+inv.id+'\');closeModal()">Mark as Paid</button>':'')+'<button class="btn btn-secondary" onclick="closeModal()">Close</button></div></div>';
    }

    default: return '<div class="modal"><div class="modal-header"><h3>Coming Soon</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"><div class="empty-state"><div class="empty-icon">🚧</div><h3>Feature under development</h3><p>This feature is available in the full version.</p></div></div><div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div></div>';
  }
}

function bindModalEvents(type, params) {
  switch(type) {
    case 'new-patient':
      document.getElementById('save-new-patient')?.addEventListener('click', () => {
        const first=document.getElementById('np-first')?.value?.trim(), last=document.getElementById('np-last')?.value?.trim(), email=document.getElementById('np-email')?.value?.trim();
        if(!first||!last||!email) { showToast('Please fill in required fields','warning'); return; }
        const patient={id:'p'+generateId(),firstName:first,lastName:last,email,phone:document.getElementById('np-phone')?.value||'',dob:document.getElementById('np-dob')?.value||'',gender:document.getElementById('np-gender')?.value||'',address:document.getElementById('np-address')?.value||'',emergencyContact:document.getElementById('np-emergency')?.value||'',referralSource:document.getElementById('np-referral')?.value||'Other',medicalHistory:document.getElementById('np-medical')?.value||'',allergies:(document.getElementById('np-allergies')?.value||'').split(',').map(a=>a.trim()).filter(Boolean),medications:(document.getElementById('np-medications')?.value||'').split(',').map(m=>m.trim()).filter(Boolean),previousTreatments:'',consentSigned:document.getElementById('np-consent')?.checked||false,gdprConsent:document.getElementById('np-consent')?.checked||false,photoConsent:false,loyaltyPoints:0,membershipTier:document.getElementById('np-tier')?.value||'Bronze',notes:document.getElementById('np-notes')?.value||'',tags:['New'],createdAt:now()};
        State.db.patients.push(patient); saveDB(State.db); addAuditLog('PATIENT_CREATE','New patient: '+first+' '+last); showToast('Patient added successfully','success'); closeModal(); renderPage();
      }); break;

    case 'book-appointment':
      document.getElementById('save-appointment')?.addEventListener('click', () => {
        const patientId=document.getElementById('ba-patient-id')?.value||document.getElementById('ba-patient')?.value, treatmentId=document.getElementById('ba-treatment')?.value, date=document.getElementById('ba-date')?.value, time=document.getElementById('ba-time')?.value, doctorId=document.getElementById('ba-doctor')?.value;
        if(!patientId||!date||!time) { showToast('Please fill in required fields','warning'); return; }
        const treatment=State.db.treatments.find(t=>t.id===treatmentId);
        State.db.appointments.push({id:'apt'+generateId(),patientId,treatmentId,practitionerId:doctorId,roomId:document.getElementById('ba-room')?.value||'r1',date,time,duration:treatment?.duration||30,status:'scheduled',notes:document.getElementById('ba-notes')?.value||'',createdAt:now()});
        saveDB(State.db); addAuditLog('APPOINTMENT_CREATE','Booked: '+date+' '+time); showToast('Appointment booked successfully','success'); closeModal(); renderPage();
      }); break;

    case 'new-lead':
      document.getElementById('save-lead')?.addEventListener('click', () => {
        const name=document.getElementById('nl-name')?.value?.trim();
        if(!name) { showToast('Name is required','warning'); return; }
        State.db.leads.push({id:'l'+generateId(),name,email:document.getElementById('nl-email')?.value||'',phone:document.getElementById('nl-phone')?.value||'',source:document.getElementById('nl-source')?.value||'Other',status:'new',interest:document.getElementById('nl-interest')?.value||'',estimatedValue:parseFloat(document.getElementById('nl-value')?.value)||0,notes:document.getElementById('nl-notes')?.value||'',createdAt:now()});
        saveDB(State.db); addAuditLog('LEAD_CREATE','New lead: '+name); showToast('Lead added successfully','success'); closeModal(); renderPage();
      }); break;

    case 'new-clinical-record':
      document.getElementById('save-clinical-record')?.addEventListener('click', () => {
        const patientId=document.getElementById('ncr-patient')?.value, treatmentId=document.getElementById('ncr-treatment')?.value;
        if(!patientId||!treatmentId) { showToast('Please select patient and treatment','warning'); return; }
        const treatment=State.db.treatments.find(t=>t.id===treatmentId);
        State.db.clinicalRecords.push({id:'cr'+generateId(),appointmentId:'',patientId,practitionerId:State.session.userId,treatmentName:treatment?.name||'',date:document.getElementById('ncr-date')?.value||new Date().toISOString().split('T')[0],notes:document.getElementById('ncr-notes')?.value||'',productsUsed:document.getElementById('ncr-products')?.value||'',areas:document.getElementById('ncr-areas')?.value||'',unitsInjected:parseInt(document.getElementById('ncr-units')?.value)||null,followUpDate:document.getElementById('ncr-followup')?.value||'',patientSignature:false,practitionerSignature:true,createdAt:now()});
        saveDB(State.db); addAuditLog('CLINICAL_RECORD_CREATE','New record for '+(treatment?.name||'')); showToast('Clinical record saved','success'); closeModal(); renderPage();
      }); break;

    case 'new-invoice':
      document.getElementById('save-invoice')?.addEventListener('click', () => {
        const patientId=document.getElementById('ni-patient')?.value, treatmentId=document.getElementById('ni-treatment')?.value;
        if(!patientId||!treatmentId) { showToast('Please fill in required fields','warning'); return; }
        const treatment=State.db.treatments.find(t=>t.id===treatmentId), subtotal=treatment?.price||0, tax=subtotal*State.db.clinic.taxRate;
        State.db.invoices.push({id:'inv'+generateId(),patientId,appointmentId:'',treatmentName:treatment?.name||'',practitionerName:State.session.name,subtotal,tax,total:subtotal+tax,status:'pending',paymentMethod:document.getElementById('ni-payment')?.value||'card',date:new Date().toISOString().split('T')[0],dueDate:new Date().toISOString().split('T')[0],paidDate:null,createdAt:now()});
        saveDB(State.db); addAuditLog('INVOICE_CREATE','New invoice for '+(treatment?.name||'')); showToast('Invoice created successfully','success'); closeModal(); renderPage();
      }); break;

    case 'edit-lead':
      document.getElementById('save-lead-edit')?.addEventListener('click', () => {
        const lead=State.db.leads.find(l=>l.id===params.id); if(!lead) return;
        lead.status=document.getElementById('el-status')?.value||lead.status;
        lead.interest=document.getElementById('el-interest')?.value||lead.interest;
        lead.estimatedValue=parseFloat(document.getElementById('el-value')?.value)||lead.estimatedValue;
        lead.notes=document.getElementById('el-notes')?.value||lead.notes;
        saveDB(State.db); addAuditLog('LEAD_UPDATE','Lead '+lead.name+' updated'); showToast('Lead updated','success'); closeModal(); renderPage();
      }); break;
  }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  State.db = initDB();
  State.session = getSession();
  if (State.db.settings.darkMode) document.documentElement.className = 'dark';
  render();
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('global-search')?.focus(); }
  });
}

document.addEventListener('DOMContentLoaded', init);
