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
    raw_text = extract_text(image_bytes)
    result = analyze_prescription(raw_text, province)
    result["raw_text"] = raw_text
    return result

@app.post("/scan/booklet")
async def scan_booklet(file: UploadFile = File(...)):
    image_bytes = await file.read()
    raw_text = extract_text(image_bytes)
    result = parse_booklet(raw_text)
    result["raw_text"] = raw_text
    return result

@app.get("/health")
def health():
    return {"status": "ok"}