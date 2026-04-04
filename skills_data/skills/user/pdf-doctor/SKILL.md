---
name: pdf-doctor
description: >
  A comprehensive PDF expert skill. Trigger this skill whenever the user uploads ANY file (PDF, DOCX, XLSX, PPTX, image, TXT, CSV, HTML, etc.) and wants to: convert it to PDF (as one page or multiple pages), split/separate a PDF into pages, extract photos or images from a PDF as PNG files, merge multiple PDFs in a given order, fill out a form using information extracted from uploaded documents, or place a passport-style photo in a form's photo box. Also trigger for phrases like "pdf doctor", "convert to pdf", "make this a pdf", "fill this form", "separate my pdf", "merge these pdfs", "extract my photo", or when ANY non-PDF file is uploaded and the user asks to do something with it in PDF format. Always default to single-page PDF and ask about multi-page if the content is long. This skill handles multi-step document workflows end-to-end.
---

# PDF Doctor Skill

You are acting as a **PDF Doctor** — a specialist that performs surgical operations on PDF documents and forms. You handle five core operations, which can be combined in a single request.

---

## 🗂️ OPERATION OVERVIEW

| Operation | Trigger Keywords | Output |
|-----------|-----------------|--------|
| **Convert to PDF** | "convert to pdf", "make pdf", any non-PDF file uploaded | Single or multi-page PDF |
| **Split PDF** | "separate", "split", "extract pages" | Individual page PDFs |
| **Extract Photo** | "photo in pdf", "get my photo", "extract image" | `.png` photo file(s) |
| **Merge PDFs** | "merge", "combine", "join pdfs in order" | Single merged PDF |
| **Fill Form** | "fill this form", "complete this application", upload form + documents | Filled form PDF with photo placed |

> Always check: **what files has the user uploaded?** Identify each file's role (source document, form to fill, etc.) before starting.
> 
> **For conversion**: When a non-PDF is uploaded, **default to single-page PDF** (all content fits one page) and ask: *"Would you like this as one continuous page, or split into multiple standard pages (A4/Letter)?"* — unless the user already specified.

---

## 🔧 SETUP — Install Tools First

```bash
pip install pypdf pdfplumber pdf2image Pillow reportlab pymupdf --break-system-packages -q
apt-get install -y poppler-utils tesseract-ocr libreoffice > /dev/null 2>&1
```

For form filling (HTML/DOCX forms):
```bash
pip install python-docx fillpdf --break-system-packages -q
```

For file conversion (images, XLSX, PPTX, HTML, TXT, CSV, Markdown):
```bash
pip install python-docx openpyxl python-pptx markdown2 weasyprint --break-system-packages -q
# LibreOffice handles DOCX/XLSX/PPTX → PDF (most reliable)
# weasyprint handles HTML/Markdown → PDF
```

---

## OPERATION 0: CONVERT ANY FILE TO PDF

**This triggers whenever a non-PDF file is uploaded.** Supported formats and the best conversion method for each are documented in `references/FILE_CONVERSION.md`. Read that file before proceeding.

### Quick Decision Table

| File Type | Best Method | Notes |
|-----------|------------|-------|
| `.docx`, `.odt` | LibreOffice CLI | Most faithful layout |
| `.xlsx`, `.ods` | LibreOffice CLI | Preserves table formatting |
| `.pptx`, `.odp` | LibreOffice CLI | Each slide → one page |
| `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.tiff` | Pillow → reportlab | High quality |
| `.html`, `.htm` | weasyprint | CSS preserved |
| `.md`, `.markdown` | markdown2 → weasyprint | Convert to HTML first |
| `.txt` | reportlab | Monospace font, wraps text |
| `.csv` | pandas → reportlab table | Auto-format as table |
| `.rtf` | LibreOffice CLI | |
| `.svg` | cairosvg → Pillow | Vector preserved |

### Single-Page vs Multi-Page Logic

**Always default to single-page** (one long/scrollable PDF page) unless:
- The user explicitly asks for multi-page / "normal pages"
- The content clearly warrants pages (e.g. a PPTX naturally has slides)
- The content is so long a single page would be unusably tiny

**When to ask the user:**
```
"I can convert this as:
  (A) One continuous page — everything on a single long PDF page
  (B) Multiple standard A4 pages — content flows across pages naturally
Which do you prefer?"
```

### Universal Conversion Entry Point

```python
import os, subprocess

def detect_file_type(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    return ext

def convert_to_pdf(input_path, output_path, multipage=False):
    """
    Route to the correct converter based on file extension.
    multipage=False → single long page
    multipage=True  → standard A4 pages
    """
    ext = detect_file_type(input_path)

    office_formats = [".docx", ".doc", ".odt", ".rtf", ".xlsx", ".xls",
                      ".ods", ".pptx", ".ppt", ".odp", ".csv"]
    image_formats  = [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif", ".gif"]
    web_formats    = [".html", ".htm"]
    text_formats   = [".txt", ".md", ".markdown", ".log"]
    svg_formats    = [".svg"]

    if ext in office_formats:
        return convert_office_to_pdf(input_path, output_path, multipage)
    elif ext in image_formats:
        return convert_image_to_pdf(input_path, output_path, multipage)
    elif ext in web_formats:
        return convert_html_to_pdf(input_path, output_path, multipage)
    elif ext in text_formats:
        return convert_text_to_pdf(input_path, output_path, ext, multipage)
    elif ext in svg_formats:
        return convert_svg_to_pdf(input_path, output_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}. Try uploading as DOCX, image, or HTML.")
```

### Method A — Office Files (DOCX, XLSX, PPTX, RTF, CSV) via LibreOffice

```python
import subprocess, os, shutil

def convert_office_to_pdf(input_path, output_path, multipage=True):
    """LibreOffice headless conversion — most faithful to original formatting."""
    out_dir = os.path.dirname(output_path) or "/tmp"
    
    result = subprocess.run(
        ["libreoffice", "--headless", "--convert-to", "pdf",
         "--outdir", out_dir, input_path],
        capture_output=True, text=True, timeout=60
    )
    
    if result.returncode != 0:
        raise RuntimeError(f"LibreOffice failed: {result.stderr}")
    
    # LibreOffice names the output after the input file
    base = os.path.splitext(os.path.basename(input_path))[0]
    lo_output = os.path.join(out_dir, base + ".pdf")
    
    if lo_output != output_path:
        shutil.move(lo_output, output_path)
    
    # If single-page requested, reflow with PyMuPDF
    if not multipage:
        make_single_page(output_path, output_path)
    
    print(f"  ✓ Converted via LibreOffice → {output_path}")
    return output_path
```

### Method B — Images (PNG, JPG, WEBP, BMP, TIFF) via Pillow + ReportLab

```python
from PIL import Image
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
import os

def convert_image_to_pdf(input_path, output_path, multipage=False):
    """
    Convert image to PDF.
    multipage=False → page sized exactly to image dimensions (single page)
    multipage=True  → fit image onto A4 page
    """
    img = Image.open(input_path).convert("RGB")
    img_w, img_h = img.size  # pixels

    # Convert pixels to points (assuming 96 DPI)
    dpi = img.info.get("dpi", (96, 96))[0]
    pt_w = img_w * 72 / dpi
    pt_h = img_h * 72 / dpi

    if multipage:
        # Fit to A4
        page_w, page_h = A4
        scale = min(page_w / pt_w, page_h / pt_h) * 0.95
        draw_w, draw_h = pt_w * scale, pt_h * scale
        x_offset = (page_w - draw_w) / 2
        y_offset = (page_h - draw_h) / 2
    else:
        # Page = image size (single continuous page)
        page_w, page_h = pt_w, pt_h
        draw_w, draw_h = pt_w, pt_h
        x_offset, y_offset = 0, 0

    c = canvas.Canvas(output_path, pagesize=(page_w, page_h))
    c.drawImage(input_path, x_offset, y_offset, width=draw_w, height=draw_h,
                preserveAspectRatio=True)
    c.save()

    print(f"  ✓ Image converted to PDF ({img_w}x{img_h}px) → {output_path}")
    return output_path
```

### Method C — HTML / Markdown via weasyprint

```python
import subprocess, tempfile, os

def convert_html_to_pdf(input_path, output_path, multipage=True):
    """Convert HTML to PDF using weasyprint."""
    if not multipage:
        # Inject CSS to make one long page
        with open(input_path, "r", encoding="utf-8") as f:
            html = f.read()
        single_page_css = """
        <style>
          @page { size: A4 100000px; margin: 1cm; }
          body { page-break-inside: avoid; }
        </style>"""
        html = html.replace("<head>", f"<head>{single_page_css}", 1)
        tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w")
        tmp.write(html)
        tmp.close()
        input_path = tmp.name

    result = subprocess.run(
        ["python3", "-m", "weasyprint", input_path, output_path],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"weasyprint failed: {result.stderr}")

    print(f"  ✓ HTML → PDF via weasyprint → {output_path}")
    return output_path


def convert_text_to_pdf(input_path, output_path, ext=".txt", multipage=False):
    """Convert TXT or Markdown to PDF."""
    with open(input_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    if ext in [".md", ".markdown"]:
        import markdown2
        html_body = markdown2.markdown(content, extras=["tables", "fenced-code-blocks"])
    else:
        # Plain text → wrap in pre tag
        html_body = f"<pre style='font-family:monospace;font-size:11pt;white-space:pre-wrap'>{content}</pre>"

    html = f"""<!DOCTYPE html>
<html><head><meta charset='utf-8'>
<style>body{{font-family:Arial,sans-serif;margin:2cm;line-height:1.5}}
pre{{background:#f5f5f5;padding:1em;border-radius:4px}}</style>
</head><body>{html_body}</body></html>"""

    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html)
    tmp.close()

    return convert_html_to_pdf(tmp.name, output_path, multipage)
```

### Method D — Single-Page Reflow (Make Any PDF a Single Page)

```python
import fitz

def make_single_page(input_pdf, output_pdf):
    """
    Reflow a multi-page PDF into ONE long continuous page.
    Useful after LibreOffice conversion when user wants single-page output.
    """
    doc = fitz.open(input_pdf)
    total_height = sum(page.rect.height for page in doc)
    max_width = max(page.rect.width for page in doc)

    new_doc = fitz.open()
    new_page = new_doc.new_page(width=max_width, height=total_height)

    y_offset = 0
    for page in doc:
        h = page.rect.height
        src_rect = page.rect
        dst_rect = fitz.Rect(0, y_offset, max_width, y_offset + h)
        new_page.show_pdf_page(dst_rect, doc, page.number)
        y_offset += h

    new_doc.save(output_pdf)
    new_doc.close()
    doc.close()
    print(f"  ✓ Reflowed to single page ({max_width:.0f}x{total_height:.0f} pts) → {output_pdf}")
    return output_pdf
```

> 📖 For SVG conversion, CSV table formatting, batch multi-file conversion, and advanced page sizing options, see `references/FILE_CONVERSION.md`.

---

## OPERATION 1: SPLIT / SEPARATE A PDF

Split a PDF into individual pages, or by a specified range.

```python
from pypdf import PdfReader, PdfWriter
import os

def split_pdf(input_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    reader = PdfReader(input_path)
    total = len(reader.pages)
    output_files = []

    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)
        out_path = os.path.join(output_dir, f"page_{i+1:03d}.pdf")
        with open(out_path, "wb") as f:
            writer.write(f)
        output_files.append(out_path)
        print(f"  ✓ Saved page {i+1}/{total}: {out_path}")

    return output_files

files = split_pdf("/mnt/user-data/uploads/input.pdf", "/home/claude/split_pages")
print(f"\nDone. {len(files)} pages extracted.")
```

**After splitting**: call `present_files` with all output PDFs so the user can download them.

---

## OPERATION 2: EXTRACT PHOTO FROM PDF

Detect and extract embedded photos/images from a PDF, then save as high-quality PNG.

### Step 1 — Detect and Extract Images

```python
import fitz  # PyMuPDF
from PIL import Image
import io, os

def extract_photos_from_pdf(pdf_path, output_dir, min_width=80, min_height=80):
    """Extract all images from PDF, filter out tiny icons/logos."""
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    photo_files = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)

        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            width = base_image["width"]
            height = base_image["height"]

            # Skip tiny decorative images (icons, borders)
            if width < min_width or height < min_height:
                continue

            # Convert to PIL and save as PNG
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
            out_path = os.path.join(output_dir, f"photo_page{page_num+1}_img{img_index+1}.png")
            pil_img.save(out_path, "PNG")
            photo_files.append((out_path, width, height))
            print(f"  ✓ Extracted image {width}x{height}px → {out_path}")

    doc.close()
    return photo_files

photos = extract_photos_from_pdf("/mnt/user-data/uploads/document.pdf", "/home/claude/extracted_photos")
print(f"\nFound {len(photos)} photo(s).")
```

### Step 2 — Identify the "Main Photo" (portrait/headshot)

If multiple images are found, identify the portrait photo using aspect ratio heuristics:

```python
def find_portrait_photo(photo_files):
    """Portraits are typically taller than wide, or nearly square."""
    portraits = []
    for path, w, h in photo_files:
        aspect = w / h
        # Portrait: 0.6–1.1 aspect ratio (passport photos ~0.75)
        if 0.55 <= aspect <= 1.15 and w >= 100 and h >= 100:
            portraits.append((path, w, h))
    return portraits

portraits = find_portrait_photo(photos)
if portraits:
    print(f"Portrait photo(s) found: {[p[0] for p in portraits]}")
```

> **Tip**: If the user says "my photo" or "passport photo", pick the portrait-ratio image. If ambiguous, output all images and ask the user to confirm which one.

---

## OPERATION 3: MERGE PDFs IN ORDER

Merge multiple PDF files into one, in the exact order specified by the user.

```python
from pypdf import PdfWriter, PdfReader

def merge_pdfs(pdf_list, output_path):
    """
    pdf_list: list of file paths in the desired merge order.
    E.g. ["cover.pdf", "section1.pdf", "appendix.pdf"]
    """
    writer = PdfWriter()
    total_pages = 0

    for pdf_path in pdf_list:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            writer.add_page(page)
        total_pages += len(reader.pages)
        print(f"  ✓ Added {len(reader.pages)} pages from: {pdf_path}")

    with open(output_path, "wb") as f:
        writer.write(f)

    print(f"\nMerged {len(pdf_list)} PDFs → {total_pages} total pages → {output_path}")
    return output_path

# Example usage — order from user's instructions:
merge_pdfs(
    ["/mnt/user-data/uploads/doc1.pdf",
     "/mnt/user-data/uploads/doc2.pdf",
     "/mnt/user-data/uploads/doc3.pdf"],
    "/home/claude/merged_output.pdf"
)
```

**If the user gives an order like "first the CV, then the transcript, then the letter"**, map the uploaded filenames to the described order and confirm with the user before merging.

---

## OPERATION 4: FILL A FORM WITH EXTRACTED INFORMATION + PLACE PHOTO

This is the most complex operation. Read `references/FORM_FILLING.md` before proceeding.

### High-Level Steps

1. **Extract all data** from the uploaded source documents (passport, CV, ID card, etc.)
2. **Map the data** to the form fields intelligently
3. **Fill the form** — method depends on form type (see below)
4. **Detect the photo box** in the form
5. **Resize & place the photo** precisely in the photo box

### Step 1 — Extract Info from Source Documents

```python
import pdfplumber, json

def extract_info_from_pdf(pdf_path):
    """Extract all text from a PDF source document."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

# For images/scanned docs — use OCR
from pdf2image import convert_from_path
import pytesseract

def ocr_pdf(pdf_path):
    images = convert_from_path(pdf_path, dpi=300)
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)
    return text
```

Then send the extracted text to Claude (via Anthropic API) to parse into structured fields:

```python
import anthropic, json

def parse_info_with_claude(raw_text):
    client = anthropic.Anthropic()
    prompt = f"""Extract all personal and professional information from this document text.
Return ONLY a JSON object with keys like: full_name, first_name, last_name, date_of_birth, 
nationality, passport_number, cnic_number, address, phone, email, father_name, 
gender, marital_status, occupation, education, etc.
Only include fields that are actually present in the text.

Document text:
{raw_text}"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    text = response.content[0].text
    # Strip markdown if present
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)
```

### Step 2 — Fill PDF Forms (Interactive Fields)

```python
from pypdf import PdfReader, PdfWriter

def fill_pdf_form(template_path, field_data, output_path):
    """Fill a PDF with AcroForm fields."""
    reader = PdfReader(template_path)
    writer = PdfWriter()
    writer.append(reader)

    # List available fields
    fields = reader.get_fields()
    print("Available form fields:", list(fields.keys()) if fields else "None (not an interactive form)")

    if fields:
        writer.update_page_form_field_values(writer.pages[0], field_data)

    with open(output_path, "wb") as f:
        writer.write(f)
    return output_path
```

For **non-interactive (flat) PDFs** or forms needing text overlaid, see `references/FORM_FILLING.md` → Section: "Overlay Text on Flat PDF".

### Step 3 — Detect Photo Box Location

```python
import fitz

def find_photo_box(pdf_path):
    """
    Detect photo placeholder boxes in the PDF.
    Looks for: rectangles with aspect ratio ~0.75, annotation boxes, 
    or regions with text like 'Photo', 'Paste Photo', 'Affix Photo'.
    """
    doc = fitz.open(pdf_path)
    page = doc[0]
    photo_regions = []

    # Method A: Search for text clues
    keywords = ["photo", "paste photo", "affix photo", "photograph", 
                "recent photo", "passport size", "تصویر"]
    for keyword in keywords:
        hits = page.search_for(keyword, quads=False)
        for rect in hits:
            # Expand the rect to find the box area nearby
            expanded = fitz.Rect(rect.x0 - 10, rect.y0 - 10,
                                  rect.x0 + 130, rect.y0 + 180)
            photo_regions.append(("text_hint", expanded, keyword))
            print(f"  Photo hint found: '{keyword}' at {rect}")

    # Method B: Look for drawing rectangles with portrait proportions
    drawings = page.get_drawings()
    for d in drawings:
        r = d["rect"]
        w, h = r.width, r.height
        if w > 40 and h > 50 and 0.5 <= (w/h) <= 1.0:
            photo_regions.append(("rect_drawing", r, "drawing"))

    doc.close()
    return photo_regions
```

### Step 4 — Resize & Place Photo in Form

```python
import fitz
from PIL import Image

def place_photo_in_form(form_pdf_path, photo_png_path, photo_rect, output_path):
    """
    Place a photo PNG into the specified rectangle on the form PDF.
    photo_rect: fitz.Rect(x0, y0, x1, y1) in PDF points.
    """
    # Resize photo to fit box using PIL
    img = Image.open(photo_png_path).convert("RGB")
    box_w = int(photo_rect.width)
    box_h = int(photo_rect.height)
    img_resized = img.resize((box_w * 3, box_h * 3), Image.LANCZOS)  # 3x for quality

    # Save resized temp photo
    temp_photo = "/tmp/photo_resized.png"
    img_resized.save(temp_photo, "PNG")

    # Insert into PDF
    doc = fitz.open(form_pdf_path)
    page = doc[0]

    # Optional: white out existing placeholder text/box
    page.draw_rect(photo_rect, color=(1, 1, 1), fill=(1, 1, 1))

    # Insert photo
    page.insert_image(photo_rect, filename=temp_photo)

    doc.save(output_path)
    doc.close()
    print(f"  ✓ Photo placed at {photo_rect} → {output_path}")
    return output_path
```

---

## 📋 WORKFLOW DECISION TREE

```
User uploads files
       │
       ├─ Non-PDF file uploaded? ───────────────→ OPERATION 0 (Convert to PDF)
       │       │
       │       ├─ multipage preference known? → proceed
       │       └─ unknown? → ASK the user first (single vs multi-page)
       │
       ├─ "Split/Separate PDF" ──────────────→ OPERATION 1
       ├─ "Extract photo from PDF" ─────────→ OPERATION 2
       ├─ "Merge PDFs in order X, Y, Z" ───→ OPERATION 3
       ├─ "Fill this form" ──────────────────→ OPERATION 4
       │       │
       │       ├─ Has interactive fields? → fill_pdf_form()
       │       ├─ Flat PDF? → overlay text (see FORM_FILLING.md)
       │       ├─ DOCX form? → python-docx (see FORM_FILLING.md)
       │       └─ Has photo box? → detect + place photo
       │
       └─ Combined request → run operations in sequence
          (e.g. convert DOCX → PDF, then merge with another PDF)
```

---

## ⚠️ EDGE CASES & TIPS

- **Scanned PDFs**: No selectable text → use OCR path (`ocr_pdf()`)
- **Multi-language forms (Urdu/Arabic)**: Right-to-left text in forms needs special handling — see `references/FORM_FILLING.md` → Section: "RTL Languages"
- **Photo not found in PDF**: Inform the user and ask them to upload the photo separately as a PNG/JPG
- **Multiple photos in PDF**: Extract all, then ask user which one to use, or use the largest portrait-ratio image
- **Photo box not detected automatically**: Ask user to describe where it is (e.g., "top right corner") and use coordinates manually
- **Password-protected PDFs**: Ask user for the password; use `PdfReader(path, password="...")`
- **Form fields not writable**: The PDF may be locked — try `writer.encrypt("")` to reset, or overlay text instead
- **CNIC/Passport forms (Pakistan)**: Common photo box positions for NADRA forms are around coordinates (450, 80) to (550, 170) — adjust per form
- **Unsupported file format**: If a file type isn't in the supported list, try LibreOffice as a catch-all; if that fails, inform the user
- **LibreOffice not available**: Fall back to Python-native methods per file type
- **Very large images**: Compress before embedding — use `img.thumbnail((2480, 3508))` for A4 at 300DPI
- **Single-page vs multi-page ambiguity**: When in doubt, output both and let the user choose

---

## 📁 REFERENCE FILES

Read these when you need deeper guidance:

| File | When to Read |
|------|-------------|
| `references/FILE_CONVERSION.md` | SVG conversion, CSV tables, batch conversion, page sizing, font embedding |
| `references/FORM_FILLING.md` | Filling flat PDFs, DOCX forms, RTL text, coordinate mapping |
| `references/PHOTO_PROCESSING.md` | Advanced photo detection, face cropping, background removal |
| `references/TROUBLESHOOTING.md` | Errors, corrupted PDFs, font issues, encoding problems |

---

## OUTPUT CHECKLIST

Before presenting files to the user, verify:
- [ ] All output files are in `/mnt/user-data/outputs/`
- [ ] File names are descriptive (e.g., `filled_form_Ali_Ahmed.pdf`, not `output1.pdf`)
- [ ] Photo is correctly sized and not distorted in the form
- [ ] Filled text is legible and correctly mapped to fields
- [ ] Use `present_files` tool to deliver all outputs
- [ ] Give a brief summary of what was done (e.g., "Filled 12 fields, placed photo in top-right box")
