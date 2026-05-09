from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from ocr import extract_text
from ai import analyze_receipt_only, analyze_booklet_only, analyze_both, parse_booklet

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

@app.post("/analyze")
async def analyze(
    province: str = Form(default=""),
    receipt: Optional[UploadFile] = File(default=None),
    booklet: Optional[UploadFile] = File(default=None)
):
    # default to "other" if province not provided
    if not province or province.strip() == "":
        province = "other"
    
    medical_keywords = ["mg", "rx", "din", "pharmacy", "prescription", "drug", "tablet", "capsule", "ml", "dose"]
    insurance_keywords = ["coverage", "benefit", "insurance", "dental", "vision", "prescription",
                         "deductible", "premium", "plan", "eligible", "claim", "maximum"]

    receipt_text = None
    booklet_text = None

    # process receipt if uploaded
    if receipt:
        receipt_bytes = await receipt.read()
        receipt_text = extract_text(receipt_bytes, receipt.filename)
        if len(receipt_text.strip()) < 20 or not any(w in receipt_text.lower() for w in medical_keywords):
            return {
                "error": True,
                "message": "Could not read receipt. Please upload a clear photo of a pharmacy receipt."
            }

    # process booklet if uploaded
    if booklet:
        booklet_bytes = await booklet.read()
        booklet_text = extract_text(booklet_bytes, booklet.filename)
        if len(booklet_text.strip()) < 20 or not any(w in booklet_text.lower() for w in insurance_keywords):
            return {
                "error": True,
                "message": "Could not read booklet. Please upload a clear photo of your benefit booklet."
            }

    # decide which mode
    if receipt_text and booklet_text:
        # wow moment - full analysis
        result = analyze_both(receipt_text, booklet_text, province)
    elif receipt_text and not booklet_text:
        # receipt only - generic suggestions
        result = analyze_receipt_only(receipt_text, province)
    elif booklet_text and not receipt_text:
        # booklet only - ask for receipt
        result = analyze_booklet_only()
    else:
        return {
            "error": True,
            "message": "Please upload at least a pharmacy receipt to get started."
        }

    return result

@app.get("/health")
def health():
    return {"status": "ok"}