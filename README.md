# 🛡️ SHIELD: Community-Powered Women's Safety & Incident Intelligence

> **NITK Women Hackathon • Problem Statement 2 (PS2: Women’s Safety)**  
> **PRD Version 2.0 (Final)**  
> **BEFORE • DURING • AFTER — Prevent • Protect • Prove • Warn**  
> *"SHIELD keeps her safe before, with her during, and behind her after."*

---

## 🌟 Executive Summary

Women face a continuum of safety threats across physical and digital spaces—from stalking, dark corridors, and cab harassment to leaked intimate imagery, extortion, and identity impersonation. Most existing tools are merely a single panic button pressed after danger has occurred, leaving victims vulnerable while watched, producing unverifiable evidence courts discard, and hoarding incident knowledge rather than warning other women.

**SHIELD** is a privacy-first, community-powered women’s safety platform built on one core conviction: **one woman’s safety experience should help protect other women without ever exposing the reporter.**

---

## 🎯 High-Impact Innovation Layers

### 1. 🌅 BEFORE (Prevention & Informed Decisions)
* **Time-Aware Safety Map (FR-32):** Dynamic time slider (Morning 8 AM–2 PM, Evening 2 PM–8 PM, Night 8 PM–4 AM) showing shifting historical community concern levels with strict non-stigmatizing terminology (*"concerns detected at this hour"*, never *"unsafe area"*).
* **Safe Havens Network (FR-30):** One-tap proximity routing to 24x7 police desks (112), emergency trauma care (108), round-the-clock pharmacies, and campus security outposts.
* **Partner Safe Spots (FR-31):** Registered shops display a storefront QR code. Entering women can send a silent signal to the shopkeeper's desk with **zero personal data disclosure**.
* **Safe Journey Check-In (FR-13):** Timed journeys with check-in countdowns and safety confirmations.

### 2. ⚡ DURING (Help That Works When Watched)
* **Hold-to-Activate SOS (FR-02):** 2.5-second radial progress hold with haptic feedback to prevent accidental triggers.
* **Disguised Decoy Mode & Duress PIN (FR-21, FR-22):** App launches as a fully functional, working calculator. Normal PIN (`1234`) reveals SHIELD; entering Duress PIN (`9999`) keeps the screen as a normal calculator while secretly broadcasting an emergency silent beacon with GPS to trusted contacts!
* **Cab Guard with Route-Deviation Detection (FR-17, FR-18, FR-19):**
  * License plate OCR via browser-based Tesseract.js.
  * 300m safety corridor around expected route using Turf.js.
  * Screen kept active via Screen Wake Lock API.
  * Live corridor breach detection triggering a 20-second *"Are you okay?"* countdown prompt with auto-escalation to contacts and 112.
  * Built-in **Demo Simulator** replaying GPS waypoints with deviation for live judging demonstrations.
* **AI Fake Call (FR-36):** Believable incoming call with synthetic ringtone oscillator and branching Text-to-Speech (TTS) voice dialogues giving a natural excuse to leave an uncomfortable situation.

### 3. 🏛️ AFTER (Proof & Legal Accountability)
* **Private Evidence Vault (FR-05, FR-15):** On-device cryptographic SHA-256 hashing of photos, audio notes, and screenshots.
* **Tamper-Evident Audit Chain (FR-23):** Cryptographically linked nodes (`prev_hash` + `entry_hash`), mathematically proving unbroken chain-of-custody.
* **Court-Ready Evidence Pack PDF (FR-24):** Generates exportable PDF dossiers complete with timelines, file digests, and compliance notes under **Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023** (formerly Section 65B Indian Evidence Act).
* **Verify Evidence Inspector (FR-25):** Live verification tool allowing re-upload of files. Features a **"Simulate Byte Tampering (Flip 1 Byte)"** button that proves to evaluators how even a single modified byte causes immediate SHA-256 mismatch detection!
* **AI Complaint Assistant (FR-26):** Context-aware drafting of factual, non-accusatory representations tailored for 112 Police, 181 Women's Helpline, 1930 Cybercrime, or College Internal Complaints Committees (ICC).
* **Report-Back Loop (FR-34):** Anonymous private updates for reporters (Received → Verified → Action Taken → Resolved).

### 4. 🔒 DIGITAL SAFETY & IDENTITY PROTECTION
* **NCII Perceptual Hash Shield (FR-27):** Uses HTML5 Canvas API to compute a 64-bit difference hash (dHash) strictly on-device. Sensitive intimate images **never leave the user's browser**. Matching against blocked hashes uses Hamming distance comparisons (distance ≤ 10 flags matches even when resized or cropped).
* **Data Breach Scanner (FR-28):** Checks email against known public credential leaks with actionable security remediation steps.
* **Fake Profile Takedown Kit (FR-29):** Guided generation of platform-compliant legal notices for Instagram, X, LinkedIn citing IT Act Sec 66D and BNS Sec 336(3).
* **AI Threat Analyzer (FR-14):** Analyzes blackmail/extortion messages, assigning threat scores (1–10) and preservation guidance.

---

## 🎬 10-Scene Judge Demo Script (PRD Section 15)

| # | Time | Scene | What Evaluators See |
|---|---|---|---|
| **1** | 0:20 | **Hook & Problem** | Before / During / After framework tackling both physical violence and digital extortion. |
| **2** | 0:20 | **Decoy Mode** | Fully functional calculator. Normal PIN (`1234`) unlocks SHIELD. Lock again. Duress PIN (`9999`) leaves screen on calculator while Device #2 receives silent alarm! |
| **3** | 0:30 | **Safety Circle & Map** | NITK Community Circle status bar and time-aware safety map with morning/evening/night slider. |
| **4** | 1:00 | **Report & Hash Chain** | Submit incident with photo evidence; browser computes SHA-256 fingerprint; privacy filter strips exact GPS. |
| **5** | 0:30 | **Emerging Pattern** | Anonymized warning appears on map; clustered reports form an *"Emerging Safety Concern"*. |
| **6** | 1:00 | **Cab Guard Simulation** | Number plate OCR; live tracking link on Device #2; simulator drives cab off corridor; 20s *"Are you okay?"* countdown times out and escalates to contacts + 112. |
| **7** | 0:30 | **Duress PIN Verification** | Device #2 displays critical silent alarm badge with GPS location while primary phone looks like a harmless calculator. |
| **8** | 0:45 | **Court Evidence Pack & Tamper Test** | Export PDF pack with BSA 2023 legal sheet; open Verify tool; click *"Simulate Byte Tampering"* to show red `TAMPER DETECTED: Hash Mismatch` alarm! |
| **9** | 0:30 | **NCII Hash Shield** | Compute 64-bit dHash on-device with zero image upload; test resized copy match; run AI Threat Analyzer. |
| **10** | 0:30 | **Safe Havens & Close** | Nearest safe places; Safe Spot storefront QR scan; shopkeeper dashboard receives anonymous assistance prompt. |

---

## 🛠️ Technology Architecture

* **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons
* **Maps & Geospatial:** Leaflet, OpenStreetMap Voyager tiles, `@turf/turf` (point-to-line distance & corridor geofencing)
* **Cryptographic Forensics:** Web Crypto API (`SubtleCrypto` SHA-256, PBKDF2 with salt)
* **Computer Vision & OCR:** Tesseract.js in-browser OCR, HTML5 Canvas API 64-bit perceptual dHash
* **PDF Engine:** `pdf-lib` client-side court-ready document generator
* **Voice & Audio:** Web Speech Recognition API, Web SpeechSynthesis TTS, Web Audio API Oscillator synthesizer
* **Backend:** Node.js Express server on port 4000
* **Realtime Sync:** Server-Sent Events (SSE) event bus for instant zero-latency multi-device / multi-tab synchronization

---

## 🚀 Running the Project

### Prerequisites
* Node.js v18+ (tested on Node v22.19.0)
* npm 10+

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd shebuilds
   ```

2. **Run Server:**
   ```bash
   cd server
   npm install
   npm start
   # Server listens on http://localhost:4000
   ```

3. **Run Client:**
   ```bash
   cd client
   npm install
   npm run dev
   # Client runs on http://localhost:5173
   ```

### 📱 Two-Device / Companion View URLs
* **Primary Safety App:** `http://localhost:5173/`
* **Device 2 (Trusted Contact Companion):** `http://localhost:5173/?view=contact`
* **Device 3 (Safe Spot Shopkeeper Front Desk):** `http://localhost:5173/?view=safe-spot`

---

## ⚖️ Statutory & Compliance Alignment

* **Bharatiya Sakshya Adhiniyam (BSA), 2023 — Section 63:** Replaced Section 65B of the Indian Evidence Act for electronic record admissibility.
* **Bharatiya Nyaya Sanhita (BNS), 2023 — Section 78 & 79:** Stalking and acts intended to insult modesty of women.
* **Information Technology Act, 2000 — Section 66D, 66E, 67A:** Identity impersonation, privacy violations, and non-consensual digital content.
