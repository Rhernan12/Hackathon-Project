import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text(image_bytes: bytes, filename:str="") -> str:
    # handle PDF
    if filename.lower().endswith(".pdf"):
        from pdf2image import convert_from_bytes
        pages = convert_from_bytes(image_bytes)
        text = ""
        for page in pages:
            page = page.convert('L')
            text += pytesseract.image_to_string(page)
        return text.strip()
    
    #handle images
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert('L')
    text = pytesseract.image_to_string(image)
    return text.strip()