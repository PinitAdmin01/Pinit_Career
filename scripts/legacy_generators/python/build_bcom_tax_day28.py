"""
Build Day 28 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Digital Tax Strategy, E-Invoicing (Rule 48(4)), E-Way Bills & Real-Time GST Analytics
"""
import json
import os

day_data = {
    "day": 28,
    "title": "Digital Tax Architecture: E-Invoicing (Rule 48(4)), E-Way Bills & Real-Time Analytics",
    "parts": [
        {
            "title": "Mandatory E-Invoicing Framework & Rule 48(4) Legal Invariants",
            "say": [
                "The digitization of indirect tax reached its technical zenith with the implementation of the electronic invoicing (e-Invoicing) system under Rule 48(4) of the CGST Rules. E-invoicing is not the generation of an invoice on the government portal; it is the real-time reporting of standard ERP-generated invoices to the Invoice Registration Portal (IRP) for electronic authentication and cryptographic signing.",
                "E-invoicing applies to all registered taxpayers whose aggregate annual turnover exceeds Rs 5 Crore in any preceding financial year from 2017-18 onwards, in respect of B2B supplies, supplies to SEZs, exports, and deemed exports. Specific entities are statutorily exempt under Rule 48(4)—including insurance and banking companies, Goods Transport Agencies (GTAs), passenger transport services, multiplex cinema admissions, and SEZ units (though not SEZ developers).",
                "The legal invariant codified in Rule 48(5) carries severe operational consequences: any invoice issued by a non-exempt taxpayer without an authenticated Invoice Reference Number (IRN) and digitally signed QR code shall NOT be treated as a valid invoice. If a seller issues an unauthenticated invoice, the document is legally null and void: the buyer is strictly prohibited from claiming Input Tax Credit under Section 16(2)(a), transport vehicles are liable to interception and detention under Section 129, and the seller faces general penalties under Section 122.",
                "Enterprise ERP systems must establish unbroken API integrations with the IRP, ensuring automated payload schema validation before goods leave warehouse loading docks."
            ],
            "example": "An enterprise with Rs 8 Crore turnover issues an invoice to a corporate client without uploading it to the IRP. Under Rule 48(5), the invoice is legally non-existent. When the delivery truck is intercepted, the GST officer treats the shipment as transport without valid documentation, seizing the goods under Section 129 and denying the buyer Rs 1.8 Lakh in Input Tax Credit.",
            "code": '''def validate_einvoice_compliance(supplier_turnover_cr: float, is_b2b_or_export: bool, is_exempt_entity_type: bool, has_valid_irn: bool, has_signed_qr: bool) -> dict:
    threshold_5cr = 5.0
    turnover_qualifies = supplier_turnover_cr > threshold_5cr
    
    einvoice_mandatory = turnover_qualifies and is_b2b_or_export and (not is_exempt_entity_type)
    
    if not einvoice_mandatory:
        return {
            "einvoice_mandatory": False,
            "status": "Exempt from Rule 48(4): Turnover <= Rs 5 Cr or exempt entity type",
            "invoice_legal_status": "Valid Tax Invoice under Section 31"
        }
        
    # Rule 48(5) Invariant: Invoice without IRN is legally non-existent
    is_valid_legal_invoice = has_valid_irn and has_signed_qr
    
    if is_valid_legal_invoice:
        return {
            "einvoice_mandatory": True,
            "is_valid_legal_invoice": True,
            "status": "Fully Compliant: Authenticated IRN and Digitally Signed QR Code verified",
            "buyer_itc_eligible": True,
            "transit_detention_risk": "Zero"
        }
    else:
        return {
            "einvoice_mandatory": True,
            "is_valid_legal_invoice": False,
            "status": "VOID under Rule 48(5): Document is NOT an invoice; ITC strictly barred for recipient",
            "buyer_itc_eligible": False,
            "transit_detention_risk": "HIGH: Subject to seizure and 200% penalty under Section 129"
        }

inv_res = validate_einvoice_compliance(
    supplier_turnover_cr=8.0,
    is_b2b_or_export=True,
    is_exempt_entity_type=False,
    has_valid_irn=True,
    has_signed_qr=True
)
print("Rule 48(4) E-Invoice Validation:")
print(f"  Mandatory: {inv_res['einvoice_mandatory']}")
print(f"  Legal Validity: {inv_res['is_valid_legal_invoice']}")
print(f"  Buyer ITC Admissibility: {inv_res['buyer_itc_eligible']}")
print(f"  Transit Seizure Risk: {inv_res['transit_detention_risk']}")
''',
            "tryIt": "Set has_valid_irn to False to observe how Rule 48(5) invalidates the document, stripping buyer ITC and triggering transit seizure risks.",
            "check": {
                "question": "What is the legal consequence under Rule 48(5) of the CGST Rules if an invoice is issued without an IRN by an enterprise whose turnover exceeds the statutory threshold?",
                "options": [
                    "The invoice shall not be treated as a valid tax invoice; recipient cannot claim ITC and goods are liable to detention in transit",
                    "The taxpayer is merely required to pay a nominal late fee of Rs 100",
                    "The invoice remains fully valid, but buyer credit is delayed by 30 days",
                    "The transaction is converted into an exempt supply"
                ],
                "answerIndex": 0,
                "why": "Rule 48(5) explicitly provides that every invoice issued by a person to whom sub-rule (4) applies in any manner other than the manner specified in the said sub-rule shall not be treated as an invoice."
            }
        },
        {
            "title": "IRN Generation Mechanics, Schema Validation & Cryptographic Signing",
            "say": [
                "Understanding the cryptographic mechanics of the Invoice Registration Portal is vital for enterprise software architects and tax engineers. The IRP does not store invoice transaction data permanently; it acts as a high-speed cryptographic validator and routing hub.",
                "The process begins within the enterprise ERP, which compiles invoice metadata into the standardized JSON schema prescribed under Form GST INV-01. The schema enforces rigid data types: mandatory supplier and recipient GSTINs, 6-digit or 8-digit HSN codes for goods, SAC codes for services, tax rates, itemized quantities, and total tax breakdowns.",
                "The Invoice Reference Number (IRN) is a unique 64-character alphanumeric hash generated using the SHA-256 cryptographic algorithm. The input payload for the hash comprises: Supplier GSTIN, Supplier Invoice Number, Financial Year, and Document Type, separated by hyphens (e.g. `GSTIN-INV123-2025-26-INV`). This mathematical structure ensures that no duplicate invoice number can ever be registered across the entire country.",
                "Upon receiving the JSON payload, the IRP validates the schema, computes the SHA-256 hash to ensure uniqueness, stamps the payload with an authorized digital signature using an asymmetric private key, generates a compressed base64 QR code, and auto-populates the outward supply directly into the seller's Form GSTR-1 and buyer's Form GSTR-2B."
            ],
            "example": "An ERP prepares invoice #INV-9001 for Supplier GSTIN 27AABCT1234F1Z5 for FY 2025-26. The system concatenates `27AABCT1234F1Z5-INV-9001-2025-26-INV`, executes SHA-256 hashing, and transmits the JSON payload to the IRP. Within 80 milliseconds, the IRP returns the certified 64-character IRN and cryptographic QR code.",
            "code": '''import hashlib

def generate_invoice_reference_number(supplier_gstin: str, invoice_number: str, financial_year: str, doc_type: str = "INV") -> dict:
    # Standard IRP Concatenation String: SupplierGSTIN + FinYear + DocType + DocNumber
    concatenated_key = f"{supplier_gstin.upper()}-{invoice_number.upper()}-{financial_year}-{doc_type}"
    
    # SHA-256 Cryptographic Hash Generation
    irn_hash = hashlib.sha256(concatenated_key.encode('utf-8')).hexdigest()
    
    return {
        "concatenated_key": concatenated_key,
        "irn_sha256": irn_hash,
        "hash_length": len(irn_hash),
        "qr_payload_sample": f"IRN:{irn_hash[:16]}...|SUP:{supplier_gstin}|DOC:{invoice_number}|DT:{financial_year}",
        "status": "IRN Generated successfully; ready for IRP registration"
    }

irn_res = generate_invoice_reference_number(
    supplier_gstin="27AABCT1234F1Z5",
    invoice_number="INV-9001",
    financial_year="2025-26"
)
print("Cryptographic IRN Generation:")
print(f"  Input Key: {irn_res['concatenated_key']}")
print(f"  Certified 64-Char IRN: {irn_res['irn_sha256']}")
print(f"  Length: {irn_res['hash_length']} characters (SHA-256)")
print(f"  QR Payload: {irn_res['qr_payload_sample']}")
''',
            "tryIt": "Change invoice_number to 'INV-9002' to verify how the SHA-256 hash changes completely (avalanche effect), guaranteeing unique non-colliding identifiers.",
            "check": {
                "question": "What cryptographic algorithm is utilized to generate the unique 64-character Invoice Reference Number (IRN) under the Indian e-Invoicing architecture?",
                "options": [
                    "SHA-256 algorithm on the concatenated key of Supplier GSTIN, Document Number, Financial Year, and Document Type",
                    "MD5 hash of the total invoice monetary value",
                    "RSA 4096 public key encryption of the buyer's company name",
                    "AES-128 symmetric stream cipher"
                ],
                "answerIndex": 0,
                "why": "The IRP architecture specifically uses the SHA-256 cryptographic hashing algorithm applied to the unique concatenated string of Supplier GSTIN, Document Number, Financial Year, and Document Type."
            }
        },
        {
            "title": "E-Way Bill Integration & Dynamic Multi-Modal Logistics (Rule 138)",
            "say": [
                "Under Rule 138 of the CGST Rules, an Electronic Way Bill (e-Way Bill) is mandatory for the movement of goods of consignment value exceeding Rs 50,000. An e-Way Bill is an electronic document evidencing the lawful transit of goods across interstate and intrastate transport corridors.",
                "An e-Way Bill comprises two essential parts: Part A captures transaction metadata—GSTIN of supplier and recipient, place of delivery, invoice number, date, value, HSN code, and reason for transportation; Part B captures vehicle conveyance particulars—vehicle registration number for road transport, railway receipt number, airway bill number, or bill of lading for ship transport.",
                "E-Invoicing and e-Way Bill systems are dynamically integrated. When an enterprise generates an e-invoice with vehicle conveyance particulars, the IRP automatically generates Part A and Part B of the e-Way Bill simultaneously, returning both the IRN and the 12-digit e-Way Bill number in a single API call.",
                "Validity periods under Rule 138(10) are governed by distance: for non-over-dimensional cargo, validity is 1 day for every 200 kilometers (or part thereof); for over-dimensional cargo (ODC), validity is 1 day for every 20 kilometers. Tracking vehicle transit progress against validity expiration timestamps prevents statutory vehicle interceptions under Section 129."
            ],
            "example": "A logistics fleet transports pharmaceutical products over 750 kilometers. Under Rule 138(10), validity is 1 day for the first 200 km + 3 days for the remaining 550 km = 4 days total validity. If transport is delayed due to breakdown, Part B must be updated before validity expires to prevent detention.",
            "code": '''def calculate_eway_bill_validity(distance_km: float, is_over_dimensional_cargo: bool) -> dict:
    if is_over_dimensional_cargo:
        km_per_day = 20.0
    else:
        km_per_day = 200.0  # Standard cargo post-Notification 94/2020
        
    import math
    validity_days = math.ceil(distance_km / km_per_day)
    
    return {
        "distance_km": distance_km,
        "cargo_type": "Over-Dimensional Cargo (ODC)" if is_over_dimensional_cargo else "Standard Commercial Cargo",
        "km_per_validity_day": km_per_day,
        "statutory_validity_days": validity_days,
        "validity_expiry_window": f"{validity_days} days from midnight following generation timestamp"
    }

ewb_res = calculate_eway_bill_validity(distance_km=750.0, is_over_dimensional_cargo=False)
print("E-Way Bill Statutory Validity Analysis:")
print(f"  Transit Distance: {ewb_res['distance_km']} km ({ewb_res['cargo_type']})")
print(f"  Rate: {ewb_res['km_per_validity_day']} km / day")
print(f"  Total Statutory Validity: {ewb_res['statutory_validity_days']} Days")
''',
            "tryIt": "Set is_over_dimensional_cargo to True to observe how specialized ODC freight requires 1 day for every 20 kilometers, increasing validity to 38 days.",
            "check": {
                "question": "What is the statutory validity period of an e-Way Bill for standard (non-over-dimensional) cargo under Rule 138(10) of the CGST Rules?",
                "options": [
                    "One day for every 200 kilometers or part thereof",
                    "One day for every 100 kilometers",
                    "Seven fixed days regardless of distance",
                    "Twelve hours from vehicle departure"
                ],
                "answerIndex": 0,
                "why": "Notification No. 94/2020-CT amended Rule 138(10), providing that for cargo other than over-dimensional cargo, validity is one day for up to 200 kilometers and one additional day for every 200 km thereafter."
            }
        },
        {
            "title": "Transit Detention & Penalty Defense under Sections 129 & 130",
            "say": [
                "The physical enforcement arm of indirect taxation is codified in Section 129 (Detention, seizure and release of goods and conveyances in transit) and Section 130 (Confiscation of goods and conveyances). When a transport vehicle is intercepted by mobile tax squads without a valid e-way bill or with invalid invoice documentation, the statutory consequences are immediate and severe.",
                "Under Section 129(1)(a) as amended by Finance Act 2021, if the owner of the goods comes forward for payment, the statutory penalty is exactly 200% of the tax payable on the detained goods. If the owner does not come forward under Section 129(1)(b), the penalty rises to 50% of the value of the goods or 200% of tax, whichever is higher.",
                "In contrast, Section 130 applies where there is deliberate intent to evade payment of tax. Under Section 130, the proper officer can order the complete confiscation of the goods and conveyance, requiring payment of redemption fines in addition to full tax and maximum Section 122 penalties.",
                "To mitigate harsh enforcement, CBIC Circular No. 64/2018 established a crucial administrative carve-out: minor clerical errors—such as spelling mistakes in consignor/consignee names where GSTIN is correct, minor pin code errors not affecting distance calculation, or typographical errors in vehicle number in the last 1-2 digits—shall NOT trigger 200% penalties under Section 129. Instead, the officer must release the vehicle upon levying a nominal penalty of Rs 500 under Section 125."
            ],
            "example": "A truck carrying goods worth Rs 10 Lakh (tax Rs 1.8 Lakh) is intercepted. The vehicle registration number in e-Way Bill Part B contains a minor typo: 'MH-04-AB-1234' was typed as 'MH-04-AB-1235'. Instead of a 200% penalty of Rs 3.6 Lakh, the company invokes CBIC Circular 64/2018, securing immediate vehicle release upon paying a Rs 1,000 nominal penalty (Rs 500 CGST + Rs 500 SGST).",
            "code": '''def evaluate_transit_interception(goods_value_inr: float, tax_payable_inr: float, is_minor_clerical_typo: bool, owner_comes_forward: bool) -> dict:
    if is_minor_clerical_typo:
        # CBIC Circular No. 64/2018 Carve-out: Nominal penalty of Rs 500 under Sec 125 (CGST + SGST = Rs 1,000)
        penalty = 1000.0
        ruling = "Circular No. 64/2018 Applied: Minor clerical typo; released on nominal Rs 1,000 penalty"
        sec129_detention = False
    else:
        sec129_detention = True
        if owner_comes_forward:
            # Section 129(1)(a): 200% of tax payable
            penalty = tax_payable_inr * 2.0
            ruling = "Section 129(1)(a): 200% penalty on tax payable (Owner comes forward)"
        else:
            # Section 129(1)(b): Higher of 50% of goods value or 200% of tax
            penalty = max(goods_value_inr * 0.50, tax_payable_inr * 2.0)
            ruling = "Section 129(1)(b): 50% of goods value or 200% of tax (Owner absent)"
            
    return {
        "goods_value_inr": goods_value_inr,
        "tax_payable_inr": tax_payable_inr,
        "is_minor_typo": is_minor_clerical_typo,
        "sec129_penalty_payable_inr": penalty,
        "statutory_ruling": ruling,
        "release_condition": "Vehicle released upon payment of penalty"
    }

interception1 = evaluate_transit_interception(goods_value_inr=1000000.0, tax_payable_inr=180000.0, is_minor_clerical_typo=True, owner_comes_forward=True)
print("Case 1 (Minor Typo):")
print(f"  Penalty Due: INR {interception1['sec129_penalty_payable_inr']:,.2f}")
print(f"  Legal Basis: {interception1['statutory_ruling']}")

interception2 = evaluate_transit_interception(goods_value_inr=1000000.0, tax_payable_inr=180000.0, is_minor_clerical_typo=False, owner_comes_forward=True)
print("\nCase 2 (Major Non-Compliance / No E-Way Bill):")
print(f"  Penalty Due: INR {interception2['sec129_penalty_payable_inr']:,.2f} (200% of tax)")
print(f"  Legal Basis: {interception2['statutory_ruling']}")
''',
            "tryIt": "Set owner_comes_forward to False in Case 2 to observe the penalty increasing to Rs 5 Lakh (50% of goods value) under Section 129(1)(b).",
            "check": {
                "question": "What is the penalty rate prescribed under Section 129(1)(a) of the CGST Act for releasing detained goods and conveyances where the owner of the goods comes forward?",
                "options": [
                    "Penalty equal to 200% of the tax payable on such goods",
                    "Penalty equal to 50% of the value of the goods",
                    "A flat penalty of Rs 25,000",
                    "Zero penalty if the goods are perishable agricultural produce"
                ],
                "answerIndex": 0,
                "why": "Section 129(1)(a) as amended by Finance Act 2021 prescribes a mandatory penalty equal to two hundred percent (200%) of the tax payable on such goods."
            }
        },
        {
            "title": "Real-Time GST Analytics & Automated E-Way Bill Mismatch Engine",
            "say": [
                "The modern indirect tax department operates on real-time automated data surveillance. By integrating e-Invoicing feeds from the IRP, e-Way bill data from the National Informatics Centre (NIC), toll plaza RFID logs via FASTag, and monthly returns in GSTR-1 and GSTR-3B, tax analytics platforms flag non-compliance within seconds.",
                "Corporate tax controllers must implement internal mirrored analytics engines to preempt departmental red flags. The three most common analytical mismatches are: (1) E-Invoice vs GSTR-1 Turnover variance: where invoices generated on the IRP fail to synchronize with GSTR-1 outward tables; (2) E-Way Bill vs E-Invoice discrepancy: where e-way bills are generated without a valid IRN or for values differing from the registered tax invoice; and (3) Vehicle FASTag Tracking mismatch: where an e-way bill is generated for a transit route but FASTag toll logs reveal that the vehicle never traversed the registered corridor.",
                "Deploying automated daily reconciliation bots between general ledger billing and government portal feeds ensures that cancelations, credit notes, and transit extensions are executed within the statutory 24-hour window, eliminating Section 122 penalty notices."
            ],
            "example": "An enterprise analytics bot compares monthly billing records: 5,000 invoices generated in ERP, 4,998 certified with IRN, and 2 unauthenticated due to network timeouts. The bot flags the 2 unauthenticated invoices before shipping, preventing a Section 129 detention and safeguarding buyer ITC.",
            "code": '''def run_realtime_gst_analytics(erp_invoices_count: int, irn_generated_count: int, ewb_generated_count: int, gstr1_synced_count: int) -> dict:
    unauthenticated_invoices = erp_invoices_count - irn_generated_count
    missing_ewb_count = max(0, irn_generated_count - ewb_generated_count)
    gstr1_sync_gap = irn_generated_count - gstr1_synced_count
    
    anomalies = []
    if unauthenticated_invoices > 0:
        anomalies.append(f"CRITICAL: {unauthenticated_invoices} invoices lack IRN; goods cannot be shipped under Rule 48(5)")
    if missing_ewb_count > 0:
        anomalies.append(f"WARNING: {missing_ewb_count} e-invoices lack e-Way Bill; verify if consignment value > Rs 50,000")
    if gstr1_sync_gap > 0:
        anomalies.append(f"DATA GAP: {gstr1_sync_gap} IRN invoices not auto-populated into GSTR-1 tables")
        
    is_fully_healthy = len(anomalies) == 0
    
    return {
        "erp_invoices": erp_invoices_count,
        "irn_authenticated": irn_generated_count,
        "ewb_generated": ewb_generated_count,
        "gstr1_synced": gstr1_synced_count,
        "system_health": "100% HEALTHY" if is_fully_healthy else "ANOMALIES DETECTED",
        "detected_anomalies": anomalies
    }

analytics_res = run_realtime_gst_analytics(
    erp_invoices_count=5000,
    irn_generated_count=4998,
    ewb_generated_count=4850,
    gstr1_synced_count=4998
)
print("Real-Time Enterprise GST Analytics Cockpit:")
print(f"  System Health: {analytics_res['system_health']}")
print(f"  ERP Invoices: {analytics_res['erp_invoices']} | IRN Authenticated: {analytics_res['irn_authenticated']}")
for a in analytics_res['detected_anomalies']:
    print(f"  [!] {a}")
''',
            "tryIt": "Increase irn_generated_count to 5000 and ewb_generated_count to 5000 to observe the analytics cockpit reporting 100% Healthy enterprise compliance.",
            "check": {
                "question": "What is the primary operational objective of deploying mirrored real-time GST analytics within an enterprise tax technology architecture?",
                "options": [
                    "To detect unauthenticated e-invoices, missing e-way bills, and GSTR-1 synchronization gaps before shipments leave warehouses, preempting detention and penalties",
                    "To avoid paying GST by bypassing government server logs",
                    "To automatically generate cash loans from public sector banks",
                    "To eliminate the need for having a physical accounting department"
                ],
                "answerIndex": 0,
                "why": "Real-time GST analytics proactively identify synchronization failures between ERP billing, IRP registration, and e-way bill generation, preventing statutory penalties under Sections 122 and 129."
            }
        }
    ]
}

with open("scripts/bcom_tax_day28_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day28_data.json")
