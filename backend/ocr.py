import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text(image_bytes: bytes, filename: str = "") -> str:
    if filename.lower().endswith(".pdf"):
        from pdf2image import convert_from_bytes
        pages = convert_from_bytes(image_bytes)
        text = ""
        for page in pages:
            page = page.convert('L')
            text += pytesseract.image_to_string(page, config='--psm 6')
        return text.strip()
    
    image = Image.open(io.BytesIO(image_bytes))
    # resize for better OCR accuracy
    width, height = image.size
    if width < 1000:
        image = image.resize((width * 2, height * 2), Image.LANCZOS)
    image = image.convert('L')
    # increase contrast
    from PIL import ImageEnhance
    image = ImageEnhance.Contrast(image).enhance(2.0)
    text = pytesseract.image_to_string(image, config='--psm 6 --oem 3')
    return text.strip()