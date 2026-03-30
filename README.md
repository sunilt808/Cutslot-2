# CUTSLOT - Luxury Elite Salon Ecosystem

Welcome to the **Lumière Atelier**, a sophisticated digital orchestrator for high-end grooming and beauty rituals.

## 🏛️ System Architecture

### 👤 Guest Experience (Client)
- **Elite Dashboard**: Real-time spending logs, loyalty points tracking (₹100 = 1 Point), and ritual history.
- **Advance Scheduling**: Secure future slots for standard Atelier Rituals, bespoke Custom services, or Doorstep Luxury (Home).
- **Membership Directorate**: Four tiers of estate clearance (Silver, Gold, Elite, Royal) with automated billing and expiration tracking.
- **Digital Receipts**: Token-based access IDs (`CS-ID-YEAR`) for every reservation.

### ✂️ Artisan Terminal (Worker)
- **Personal Priority Queue**: Filtered ritual lists ensuring artisans see only their assigned sessions.
- **Service Classification**: Visual flags for Standard, Bespoke, and Doorstep rituals.
- **Performance Analytics**: Personal revenue tracking and public guest feedback logs.
- **Ritual Management**: Full control over session status (Confirm, Mark Done, Absent, or Reschedule).

### 👑 Estate Directorate (Admin)
- **Central Dispatch**: Allocate specialized artisans to high-priority Home and Custom rituals.
- **Staff Management**: Full CRUD interface for artisan onboarding, vetting (approval), and decommissioning.
- **Service Inventory**: Dynamic creation of standard, bespoke, and doorstep service offerings.
- **Revenue Intelligence**: Real-time reporting by floor, service category, and guest membership tier.
- **Security Audits**: Continuous monitoring of all administrative and financial actions.

## 🛠️ Technology Stack
- **Frontend**: React.js with `lucide-react` for iconography.
- **Aesthetic**: Custom "Luxury Dark" CSS with glassmorphism, gold accents, and serif typography.
- **Backend**: FastAPI (Python) with JWT-based security.
- **Database**: SQLAlchemy ORM with SQLite (Current Development State).

## 🚀 Execution Guide

### Backend Initiation
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Initiation
```powershell
cd frontend
npm install
npm run dev
```

## 📜 Membership Categories
1. **Silver (Essential)**: Standard salon access with base monthly limits.
2. **Gold (Bespoke)**: Priority queue access and artisan name-requests.
3. **Elite (Luxury)**: Access to bespoke "Custom" services and VIP lounge floor.
4. **Royal (Imperial)**: Doorstep "Home" service included with unlimited artisan dispatch.

---
*Created with Excellence by Antigravity*
