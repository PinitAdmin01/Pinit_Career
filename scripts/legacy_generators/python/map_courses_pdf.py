import sys
import os
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.abspath('docs/visuals/PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf')
reader = PdfReader(pdf_path)

tracks = [
    'bcom-marketing', 'bcom_marketing', 'marketing',
    'bcom-accounting', 'bcom_accounting', 'accounting',
    'bcom-finance', 'bcom_finance', 'finance',
    'bcom-tax', 'bcom_tax', 'taxation',
    'bcom-aud', 'bcom_aud', 'auditing',
    'bcom-law', 'bcom_law', 'corporate law',
    'bcom-ban', 'bcom_ban', 'banking',
    'bcom-ecom', 'bcom_ecom', 'ecommerce',
    'bcom-dmkt', 'bcom_dmkt', 'digital marketing',
    'bcom-ops', 'bcom_ops', 'operations',
    'bcom-ait', 'bcom_ait', 'ai transformation',
    'bcom-scrm', 'bcom_scrm', 'crm',
    'bcom-ent', 'bcom_ent', 'entrepreneurship',
    'bcom-ana', 'bcom_ana', 'business analytics',
    'iot-net', 'iot_net', 'iot network',
    'iot-edge', 'iot_edge', 'edge ai',
    'iot-sec', 'iot_sec', 'iot security',
    'iot-emb', 'iot_emb', 'embedded'
]

course_pages = {}

for idx, page in enumerate(reader.pages):
    text = page.extract_text().lower()
    for t in tracks:
        if t in text:
            if t not in course_pages:
                course_pages[t] = []
            if len(course_pages[t]) < 10:
                course_pages[t].append(idx + 1)

print("Track to Page Mapping in Master PDF:")
for t, pages in sorted(course_pages.items()):
    print(f"  {t:20s}: Pages {pages[:8]}")
