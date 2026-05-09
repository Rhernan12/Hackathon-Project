# 💊 Benefit Bot
 
> AI-powered auditor that finds hidden savings in your Canadian drug benefits
 
Built at IBM × UNSA Hackathon 2026 | May 8–10, 2026
 
---
 
## 🩺 The Problem
 
Millions of Canadians with private insurance overpay for prescription drugs every year — not because coverage doesn't exist, but because navigating benefit booklets and provincial programs is confusing and time-consuming.
 
- 15 million+ Canadians have private drug insurance
- Billions in benefits go unclaimed annually
- Most people don't know generic alternatives exist
- Provincial programs like Ontario's Trillium Drug Program go underutilized
## 💡 The Solution
 
Benefit Bot lets users scan their pharmacy receipt and insurance benefit booklet using their phone camera. Our AI instantly:
 
- Identifies the medication and cost from the receipt
- Extracts coverage details from the benefit booklet
- Cross-references the Ontario Drug Benefit formulary
- Surfaces cheaper generic alternatives
- Checks eligibility for provincial programs (Trillium, RAMQ, PharmaCare, Alberta Blue Cross)
- Provides a one-tap apply button to the relevant program
## 🎯 SDG Alignment
 
| SDG | Goal | How Benefit Bot helps |
|-----|------|-----------------------|
| SDG 3 | Good Health & Wellbeing | Makes prescription drugs more affordable |
| SDG 10 | Reduced Inequalities | Levels the playing field for lower-income Canadians |
| SDG 1 | No Poverty | Reduces financial burden of healthcare costs |
 
## 🛠️ Tech Stack
 
| Component | Technology |
|-----------|-----------|
| Frontend | React Native + Expo |
| Backend | Python + FastAPI |
| AI / NLP | Groq Llama 3.3 70B |
| OCR | Tesseract OCR + pdf2image |
| Document Storage | IBM Cloud Object Storage |
| Drug Data | Ontario Drug Benefit (ODB) Formulary |
| Tunneling | ngrok |
 
## 🚀 How It Works
 
```
User uploads receipt + booklet
        ↓
Tesseract OCR extracts text
        ↓
Groq Llama 3.3 identifies drug, cost, coverage %
        ↓
Coverage engine cross-references ODB formulary
        ↓
Provincial program eligibility checked
        ↓
Savings surfaced with one-tap apply link
```
 
## 📱 Three Modes
 
**Receipt Only** — Upload just your pharmacy receipt. App finds the cheapest generic alternative available without needing insurance info.
 
**Booklet Only** — Upload your benefit booklet. App extracts your coverage details and prompts you to add a receipt for full analysis.
 
**Full Analysis (Wow Moment)** — Upload both. App cross-references your real insurance coverage against the drug cost and provincial programs to show your exact savings.
 
## 🗺️ Supported Provinces
 
- Ontario → Trillium Drug Program
- Quebec → RAMQ
- British Columbia → PharmaCare
- Alberta → Alberta Blue Cross (Government)
- Other → Defaults to Trillium as reference
## 📂 Project Structure
 
```
benefit-bot/
  ├── backend/
  │     ├── main.py        # FastAPI endpoints
  │     ├── ai.py          # Groq AI drug + booklet analysis
  │     ├── ocr.py         # Tesseract OCR + PDF support
  │     ├── coverage.py    # ODB formulary + provincial programs
  │     └── storage.py     # IBM Cloud Object Storage
  └── frontend/
        └── app/           # React Native + Expo screens
```
 
## ⚙️ Running Locally
 
### Backend
 
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install fastapi uvicorn groq pytesseract pillow pdf2image python-multipart boto3
uvicorn main:app --reload
```
 
### Frontend
 
```bash
cd frontend
npm install
npx expo start
```
 
Scan the QR code with Expo Go on your phone.

 
## 👥 Team
 
| Name | Role |
|------|------|
| Yao | ML/AI, Backend, OCR Pipeline |
| Rafael | React Native, Frontend, UX |
 
## 🏆 Hackathon
 
Built in 36 hours at the **IBM × UNSA Hackathon 2026**
 
---
 
*Addressing SDG 3, SDG 10, and SDG 1 — making Canadian healthcare benefits accessible to everyone*
