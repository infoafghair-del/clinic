# ✨ AestheticFlow — Cosmetic Clinic Management System

A complete, production-ready cosmetic clinic management system built as a self-contained web application. Open `index.html` in any modern browser and start using immediately — no server, no database, no installation required.

## 🎯 Features

### Core Modules
- **Authentication & RBAC** — 6 role-based access levels (Super Admin, Clinic Admin, Doctor, Nurse, Receptionist, Accountant)
- **Patient Management CRM** — Full patient profiles with medical history, allergies, medications, membership tiers, loyalty points, and referral tracking
- **Before/After Photo Gallery** — Photo comparison with treatment metadata
- **Consent Form Management** — Digital consent signing with GDPR compliance
- **Appointment Scheduling** — Interactive monthly calendar with color-coded treatments, list view, and waiting list
- **Treatment Catalog** — 12 aesthetic treatments with pricing, packages, duration, skill requirements, consumables, and aftercare instructions
- **Clinical Documentation** — Complete treatment records with products used, batch tracking, units injected, and follow-up dates
- **Inventory & Stock Management** — Batch/expiry tracking, low stock alerts, stock level indicators, supplier management
- **Billing & Invoicing** — Auto-generated invoices from completed appointments, tax calculation, payment tracking, invoice preview
- **Marketing & Lead Management** — Kanban pipeline (New → Contacted → Qualified → Consultation → Won), lead sources, estimated values
- **Reports & Analytics** — Revenue by treatment/practitioner, appointment statistics, patient acquisition, inventory valuation
- **Staff Management** — Team profiles with specializations, certifications, and working hours
- **Settings** — Clinic profile, working hours, slot duration, online booking toggle, audit trail, data export/reset
- **Patient Portal** — Patient-facing portal view with upcoming appointments
- **Online Booking** — 3-step booking flow (Treatment → Date/Time → Details) with auto-patient creation

### Demo Data Included
The system auto-generates realistic seed data on first load:
- 6 staff users with different roles
- 6 patients with full profiles
- 12 aesthetic treatments across 5 categories
- 30 appointments (past and upcoming)
- Auto-generated invoices for completed appointments
- Auto-generated clinical records
- 10 inventory items with batch/expiry tracking
- 5 leads in various pipeline stages
- 4 consent form templates
- 3 membership packages
- 5 treatment rooms
- Complete audit trail

### Design & UX
- **Premium aesthetic clinic UI** — Soft neutrals, purple primary (#7c5cbf), warm accent (#e8a87c)
- **Dark/Light mode** — Toggle in header, persists across sessions
- **Fully responsive** — Works on desktop, tablet, and mobile
- **Smooth animations** — Fade-in pages, scale-in modals, hover effects
- **Keyboard shortcuts** — Ctrl+K for search, Escape to close modals

## 🚀 Quick Start

1. **Open the app** — Simply open `index.html` in Chrome, Firefox, Safari, or Edge
2. **Login** — Use any of the demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@aestheticflow.com | admin123 |
| Doctor (Sarah) | sarah@aestheticflow.com | doctor123 |
| Doctor (James) | james@aestheticflow.com | doctor123 |
| Nurse (Emily) | emily@aestheticflow.com | nurse123 |
| Receptionist | rachel@aestheticflow.com | reception123 |
| Accountant | alex@aestheticflow.com | accounts123 |

3. **Explore** — Each role sees different navigation items based on permissions

## 🏗️ Architecture

### Single-Page Application (SPA)
- Client-side routing with hash-based navigation
- All data persists in `localStorage` — no server needed
- Modular JavaScript bundled into a single `app-bundle.js`

### File Structure
```
aestheticflow/
├── index.html          # HTML shell + all CSS (responsive, dark mode, print styles)
├── app-bundle.js       # Complete JavaScript (data, logic, pages, modals, init)
└── README.md           # This file
```

### JavaScript Modules (in app-bundle.js)
1. **Data Layer** — localStorage persistence, seed data generation, ID generation, formatters
2. **Logic Layer** — Toast system, router, state management, RBAC permissions, audit logging, render engine
3. **Pages 1** — Dashboard, Patients list, Patient detail (7 tabs), Appointments (calendar/list/waiting)
4. **Pages 2** — Treatments, Clinical records, Billing, Inventory, Marketing Kanban, Reports, Staff, Settings, Search, Patient Portal, Online Booking
5. **Modals & Init** — Modal system (8 modal types with CRUD handlers), initialization

### Role-Based Access Control
| Permission | Super Admin | Clinic Admin | Doctor | Nurse | Receptionist | Accountant |
|-----------|:-----------:|:-----------:|:------:|:-----:|:-----------:|:---------:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Patients | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Appointments | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Treatments | ✓ | ✓ | ✓ | — | — | — |
| Clinical Records | ✓ | ✓ | ✓ | ✓ | — | — |
| Billing | ✓ | ✓ | — | — | — | ✓ |
| Inventory | ✓ | ✓ | — | — | — | ✓ |
| Marketing | ✓ | ✓ | — | — | — | — |
| Reports | ✓ | ✓ | — | — | — | ✓ |
| Staff | ✓ | — | — | — | — | — |
| Settings | ✓ | — | — | — | — | — |

## 🔧 Key Workflows

### Booking an Appointment
1. Click **📅 Book Appointment** from any relevant page
2. Select patient, treatment, date, time, practitioner, and room
3. Save — appointment appears on calendar with color-coded treatment type

### Patient Journey
1. **Lead** enters marketing pipeline (New → Contacted → Qualified → Consultation Booked → Won)
2. Lead converted → Patient record created
3. **Consultation** appointment booked
4. **Treatment** performed → Clinical record auto-created, invoice auto-generated
5. **Follow-up** scheduled from clinical record
6. **Before/After** photos uploaded for tracking progress

### Inventory Management
- Stock levels shown with color-coded indicators (green/yellow/red)
- Low stock alerts displayed prominently
- Expiry warnings for items within 90 days of expiration
- One-click reorder to restock items

### Billing Flow
- Invoices auto-generated when appointments are marked complete
- Manual invoice creation available
- Mark invoices as paid with one click
- Invoice preview with professional layout
- Tax rate configurable in settings

## 💾 Data Management

### Persistence
All data is stored in `localStorage` under the key `aestheticflow_db`. The app survives page refreshes and browser restarts.

### Export
Click **Export All Data** in Settings to download a complete JSON backup of all your data.

### Reset
Click **Reset to Seed Data** in Settings to clear all data and regenerate demo data. ⚠️ This is irreversible.

### GDPR/HIPAA Considerations
- Consent tracking built into patient profiles
- GDPR consent checkbox on patient creation
- Photo consent tracking
- Full audit trail of all actions
- Data export capability for data portability
- Data deletion available via reset

## 🌐 Deployment Options

### Local Use
Simply open `index.html` in a browser. No server needed.

### Static Hosting
Upload both files to any static hosting service:
- **Netlify Drop** — Drag the folder to [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages** — Push to a repo, enable Pages in settings
- **Vercel** — Connect your repo and deploy
- **Any web server** — Just serve the folder

### Custom Domain
For a professional setup, deploy to a static host with a custom domain like `clinic.yourdomain.com`.

## 🎨 Color-Coded Calendar
| Treatment | Color |
|-----------|-------|
| Botox | Purple 💜 |
| Fillers | Blue 💙 |
| Laser | Orange 🧡 |
| Peels | Green 💚 |
| Consultation | Yellow 💛 |

## ⌨️ Keyboard Shortcuts
- `Ctrl+K` / `Cmd+K` — Focus search
- `Escape` — Close modal

## 🔒 Security Notes
- This is a client-side demo application — data is stored in browser localStorage
- For production use, you would need:
  - Server-side authentication (JWT, OAuth)
  - Encrypted database (PostgreSQL, MongoDB)
  - HTTPS enforcement
  - HIPAA-compliant hosting
  - Regular security audits
  - Role enforcement on the server side

## 📋 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License
This application is provided as-is for demonstration and educational purposes.
