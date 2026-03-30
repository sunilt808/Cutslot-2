# CUTSLOT — Elite Atelier & Digital Salon Orchestrator

Welcome to the **CutSlot Platform**, an exclusive, state-of-the-art web application engineered to manage high-end luxury salon operations. The platform offers a seamless digital ecosystem integrating the needs of **Elite Clients**, **Skilled Artisans**, and the **General Directorate (Administrators)**.

---

## 🏗️ System Architecture

### 👑 The Estate Directorate (Admin)
Full systemic control over the entire CutSlot business platform.
- **Advanced Revenue Intelligence:** Tracks real-time, mathematically accurate revenue lines. Extracts total booking payouts, calculates exact tax collected, deducts fixed 15% Artisan Commissions, and maps the absolute **net profit** directly to the Directorate.
- **Artisan Credential Vetting:** New Artisans cannot automatically book clients. The Admin commands a strict approval pipeline where new worker registrations are flagged as "PENDING" and require explicit verification.
- **Service Inventory System:** Dynamic oversight of over 60+ meticulously seeded luxury rituals ranging across Grooming, VIP Skincare, Wellnes, and Subscriptions.
- **Central Dispatch Queue:** View, manage, or dynamically re-allocate high-priority bookings happening globally across the estate.

### ✂️ The Skilled Artisans (Staff)
A dedicated, distraction-free environment for professional cosmetologists and therapists.
- **Locked Commission Architecture:** Revenue transparency built-in. Every concluded ritual instantly deposits a strict, mathematically absolute **15.0% commission payout** securely into the Artisan's performance trackers.
- **Personal Dispatch Queue:** Utilizing an assigned-floor logic structure (Floors 1-4). Artisans only see clients bound to their precise domain.
- **Dynamic Ritual Flags:** Workers manage states through `Pending` -> `En-Route` -> `Confirmed` -> `Completed`. 
- **Enhanced Accountability:** Detailed performance metrics and guest evaluations directly linked to their profile.

### 👤 The Elite Guest Experience (Client)
A premium front-end delivering unparalleled booking luxury.
- **Enhanced Guest Testimonials:** A fully transparent review system where guests evaluate specific **Rituals** (e.g., Hair Cut, Skincare) performed by specific **Artisans**. Reviews are now available to all registered clients, ensuring a comprehensive community voice.
- **Smart Booking Flow:** Service limits, premium doorstep fees, timeline overlaps, and penalty-math (based on <6 hour cancellation bounds).
- **Client Wallet & Activity:** Direct portal highlighting Loyalty Points mapping, Subscription Renewals (Elite vs Gold packages), total Estate expenditure, and advance slot scheduling.
- **Membership Subscriptions:** Active memberships (like the 30-Day Elite Tier) bypass certain service fees or apply 20% discounts dynamically at checkout.

---

## ✨ Core Modernizations (New)

### 🌓 Dynamic Theme Versatility
The CutSlot UI now supports a **seamless Light/Dark Mode** switch. 
- **Premium Aesthetics:** Both themes utilize custom glassmorphism and theme-aware variables (`--glass-tint`, `--glass-tint-gold`) to ensure visual depth and legibility across all backgrounds.
- **Consistent Luxury:** Whether in High-Contrast Dark or Sophisticated Light, the "Estate" aesthetic remains premium, utilizing Playfair Display typography and animated gold glows.

### 📝 Verified Review Protocols
We have stabilized the review submission architecture:
- **Verified Linkage:** Reviews now bridge the **Guest Name**, the **Artisan Name**, and the specific **Ritual Category**.
- **Public Transparency:** Reviews on the Landing page and dedicated feed provide granular insights into service quality.
- **Inclusive Vetting:** All registered users with completed sessions can now "Vette an Artisan" directly from their **Experience History** on the Profile page.

---

## 🛠️ Technology Stack & Environment

**Frontend Protocol:**
- **Core:** `React.js` powered by `Vite`.
- **Aesthetic DNA:** Completely custom responsive CSS with theme-aware tokens.
- **Iconography:** `lucide-react`.
- **Routing:** Deep `react-router-dom` role-based protection.

**Backend Services:**
- **Engine:** `FastAPI` (Python).
- **Database:** `SQLAlchemy` mapping into `SQLite` (Write-Ahead-Log architecture).
- **Security:** CSRF-protected `JWT-Bearer` tokens with `Passlib Bcrypt`.

---

## 🚀 Execution Guide

### Database Seeding & Resetting
To initialize the estate with 60+ new luxury services and pre-vetted Artisans:
```bash
python main.py --reset-db --seed-all
```

### Backend Initiation
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### Frontend Initiation
```powershell
cd frontend
npm install
npm run dev
```

---
*Developed & Stabilized by Antigravity*
