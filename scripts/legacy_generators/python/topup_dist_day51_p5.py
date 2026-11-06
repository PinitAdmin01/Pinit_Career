# scripts/topup_dist_day51_p5.py

with open("scripts/create_dist_day51_data.py", "r", encoding="utf-8") as f:
    content = f.read()

target = '"Notice how the production audit confirms 8,500,000 spans ingested'
extra = '''    "From an enterprise cybersecurity and compliance standpoint, our OpenTelemetry ingestion pipeline features automated Sensitive Data Redaction. In accordance with GDPR and PCI-DSS regulations, span processor filter hooks automatically inspect span attributes and event logs, hashing credit card numbers, masking email addresses, and stripping JWT authentication bearer tokens before spans are serialized and exported to central observability data lakes.",
    "Notice how the production audit confirms 8,500,000 spans ingested'''

content = content.replace(target, extra)

with open("scripts/create_dist_day51_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Topped up Part 5 of Day 51!")
