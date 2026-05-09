from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from ocr import extract_text
from ai import analyze_prescription, parse_booklet

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Benefit Bot backend running"}

@app.post("/scan/receipt")
async def scan_receipt(
    file: UploadFile = File(...),
    province: str = Form(default="ontario")
):
    image_bytes = await file.read()
    raw_text = extract_text(image_bytes, file.filename)
    # reject if OCR found nothing useful
    if len(raw_text.strip()) < 20:
        return {
            "error": True,
            "message": "Could not read document. Please upload a clear photo of a pharmacy receipt or benefit booklet."
        }
    
    # reject if no medical keywords found
    medical_keywords = ["mg", "rx", "din", "pharmacy", "prescription", "drug", "tablet", "capsule", "ml", "dose"]
    has_medical = any(word in raw_text.lower() for word in medical_keywords)
    
    if not has_medical:
        return {
            "error": True,
            "message": "This doesn't look like a pharmacy receipt. Please upload a prescription receipt or benefit booklet."
        }
    
    result = analyze_prescription(raw_text, province)
    result["raw_text"] = raw_text
    return result

@app.post("/scan/booklet")
async def scan_booklet(file: UploadFile = File(...)):
    image_bytes = await file.read()
    raw_text = extract_text(image_bytes, file.filename)
    # reject if OCR found nothing useful
    if len(raw_text.strip()) < 20:
        return {
            "error": True,
            "message": "Could not read document. Please upload a clear photo of your benefit booklet."
        }
    
    # reject if no insurance keywords found
    insurance_keywords = ["coverage", "benefit", "insurance", "dental", "vision", "prescription", 
                         "deductible", "premium", "plan", "eligible", "claim", "maximum", "reimburs"]
    has_insurance = any(word in raw_text.lower() for word in insurance_keywords)
    
    if not has_insurance:
        return {
            "error": True,
            "message": "This doesn't look like a benefit booklet. Please upload your insurance benefit document."
        }
    result = parse_booklet(raw_text)
    result["raw_text"] = raw_text
    return result

@app.get("/health")
def health():
    return {"status": "ok"}