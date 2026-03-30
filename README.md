# CUTSLOT — Elite Atelier & Digital Salon Orchestrator

Welcome to the **CutSlot Platform**, an exclusive, state-of-the-art web application engineered to manage high-end luxury salon operations. The platform offers a seamless digital ecosystem integrating the needs of **Elite Clients**, **Skilled Artisans**, and the **General Directorate (Administrators)**.

---

## 🏛️ System Architecture

### 👑 The Estate Directorate (Admin)
Full systemic control over the entire CutSlot business platform.
- **Advanced Revenue Intelligence:** Tracks real-time, mathematically accurate revenue lines. Extracts total booking payouts, calculates exact tax collected, deducts fixed 15% Artisan Commissions, and maps the absolute **net profit** directly to the Directorate.
- **Artisan Credential Vetting:** New Artisans cannot automatically book clients. The Admin commands a strict approval pipeline where new worker registrations are flagged as "PENDING" and require explicit verification.
- **Service Inventory System:** Dynamic oversight of over 60+ meticulously seeded luxury rituals ranging across Grooming, VIP Skincare, Wellnes, and Subscriptions.
- **Central Dispatch Queue:** View, manage, or dynamically re-allocate high-priority bookings happening globally across the estate.

### ✂️ The Skilled Artisans (Staff)
A dedicated, distraction-free environment for professional cosmetologists and therapists.
- **Locked Commission Architecture:** Revenue transparency built-in. Every concluded ritual instantly deposits a strict, mathematically absolute **15.0% commission payout** securely into the Artisan's performance trackers.
- **Personal Dispatch Queue:** Utilizing an assigned-floor logic structure (Floors 1-4). Artisans only see clients bound to their precise domain, automatically preventing overlap and chaos.
- **Dynamic Ritual Flags:** Workers manage states through `Pending` -> `En-Route` (for doorstep/home visits) -> `Confirmed` -> `Completed`. 
- **Performance Analytics:** Real-time feedback tracking generated uniquely from clients they have *specifically engaged with*.

### 👤 The Elite Guest Experience (Client)
A glassmorphic, premium front-end delivering unparalleled booking luxury.
- **Authenticated Feedback Guard:** Clients are structurally locked from writing fake or arbitrary reviews. The backend ensures a Client can *only* evaluate Artisans they have successfully concluded a scheduled ritual with.
- **Smart Booking Flow:** Service limits, premium doorstep fees, timeline overlaps, and penalty-math (based on <6 hour cancellation bounds).
- **Client Wallet & Activity:** Direct portal highlighting Loyalty Points mapping, Subscription Renewals (Elite vs Gold packages), total Estate expenditure, and advance slot scheduling.
- **Membership Subscriptions:** Active memberships (like the 30-Day Elite Tier) bypass certain service fees or apply 20% discounts dynamically at checkout.

---

## 🛠️ Technology Stack & Environment

**Frontend Protocol:**
- **Core:** `React.js` powered by `Vite`.
- **Aesthetic DNA:** Completely custom "Luxury Dark-Mode" CSS featuring sweeping glassmorphism (`backdrop-filter: blur`), animated neon-gold glows, and serif typography (`Inter` / `Playfair Display`).
- **Iconography:** `lucide-react`.
- **Routing:** Deep `react-router-dom` role-based protection stopping role spillage.

**Backend Services:**
- **Engine:** `FastAPI` (Python)
- **Database:** `SQLAlchemy` mapping flawlessly into `SQLite` (running in Write-Ahead-Log architecture to eliminate concurrency locks).
- **Security:** Case-insensitive `JWT-Bearer` tokens running through `Passlib Bcrypt` hashing. 

---

## 🚀 Execution Guide

### Database Seeding & Resetting
To initialize the estate with the 60+ new luxury services, 10 active seeded clients, and pre-vetted Artisans, perform a pristine database reset:
```bash
python main.py --reset-db --seed-all
```

### Backend Initiation
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload --limit-concurrency 100
```
*(The CORS middleware natively supports frontend connections originating from `http://localhost:5173`, `5174`, and `5175`.)*

### Frontend Initiation
```powershell
cd frontend
npm install
npm run dev
```

---
*Developed & Stabilized by Antigravity*
