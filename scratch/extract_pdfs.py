import pypdf
import os

def extract_pdf_text(pdf_path, txt_path):
    print(f"Extracting {pdf_path} -> {txt_path} ...")
    if not os.path.exists(pdf_path):
        print(f"File {pdf_path} not found.")
        return
    
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for i, page in enumerate(reader.pages):
        page_text = page.extract_text()
        if page_text:
            text += f"--- PAGE {i+1} ---\n{page_text}\n"
    
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Extraction of {pdf_path} completed successfully! ({len(text)} chars)")

os.makedirs("scratch", exist_ok=True)
extract_pdf_text("Multi.pdf", "scratch/Multi_text.txt")
extract_pdf_text("genesis_gap_analysis.pdf", "scratch/genesis_gap_analysis_text.txt")
