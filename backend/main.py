from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ocr import extract_text
from pydantic import BaseModel

app = FastAPI()

# allow Rafael's React Native app to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProvinceRequest(BaseModel):
    province: str

@app.get("/")
def root():
    return {"status": "Benefit Bot backend running"}

@app.post("/scan/receipt")
async def scan_receipt(file: UploadFile = File(...), province: str = "ontario"):
    image_bytes = await file.read()
    raw_text = extract_text(image_bytes)

    # dummy response for now — replace with real AI tomorrow
    return {
        "raw_text": raw_text,
        "drug_name": "Metformin 500mg",
        "brand_cost": 94.00,
        "insurance_coverage": 0.70,
        "out_of_pocket": 28.20,
        "generic_name": "Metformin (generic)",
        "generic_cost": 12.00,
        "provincial_program": "Ontario Trillium Drug Program",
        "provincial_covered": True,
        "savings": 82.00,
        "apply_link": "https://www.ontario.ca/page/trillium-drug-program"
    }

@app.post("/scan/booklet")
async def scan_booklet(file: UploadFile = File(...)):
    image_bytes = await file.read()
    raw_text = extract_text(image_bytes)

    # dummy response for now
    return {
        "raw_text": raw_text,
        "coverage_percentage": 70,
        "max_annual": 5000,
        "deductible": 200,
        "exclusions": ["cosmetic", "experimental"]
    }

@app.get("/health")
def health():
    return {"status": "ok"}