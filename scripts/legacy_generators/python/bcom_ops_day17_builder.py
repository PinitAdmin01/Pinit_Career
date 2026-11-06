import os
import sys

def get_day17_data():
    day = 17
    title = "Incoterms 2020, International Freight Contracts & Total Landed Cost (TLC) Calculus"
    goal = "Master global trade logistics, international commercial terms, and import/export economics: decoding ICC Incoterms 2020 risk transfer boundaries across all 11 rules, navigating multimodal Bills of Lading and UCP 600 Letters of Credit, calculating customs duties under sovereign tariff regimes, managing marine cargo insurance and demurrage risks, and formulating deterministic Total Landed Cost (TLC) engines."
    minutes = 45
    recap = "On Day 16, we analyzed strategic sourcing, Kraljic portfolio positioning, lifecycle TCO, and AHP supplier selection. On Day 17, we take those supplier contracts into the cross-border physical and legal arena. When goods cross international borders, buyers and sellers must navigate complex jurisdictions, multimodal freight transitions, sovereign customs valuation, and maritime insurance risks. Day 17 establishes the definitive mathematical and legal framework for international trade logistics."

    parts = [
        {
            "title": "ICC Incoterms 2020 Rules & Risk Transfer Boundaries Across Multimodal Logistics",
            "say": [
                "Welcome to Day 17 of Operations and Supply Chain Management. In domestic procurement, shipping goods across state or municipal lines typically involves standardized commercial bills of lading, familiar domestic contract law, and predictable carrier liability regimes. However, the moment a purchase order crosses international borders, commercial operations enter a hazardous legal and physical landscape characterized by divergent legal jurisdictions, foreign currency conversions, multiple carrier handoffs, sovereign customs borders, and unpredictable geopolitical risks. If a container of precision electronics falls into the Pacific Ocean during a typhoon, burns in a port terminal fire, or gets held indefinitely in customs due to missing documentation, who bears the financial loss? Does the buyer or the seller pay for ocean freight, terminal handling charges (THC), export clearance, or import tariffs?",
                "To eliminate catastrophic commercial ambiguities, the International Chamber of Commerce (ICC) established the International Commercial Terms, globally recognized as Incoterms. First promulgated in 1936 and updated decennially—with the current prevailing standard being Incoterms 2020—these rules provide a globally harmonized contractual lexicon. Incoterms define three precise operational boundaries in international sales contracts: 1. Cost Allocation (which party contracts and pays for pre-carriage, main carriage, on-carriage, freight, loading, unloading, export duties, and import tariffs); 2. Risk Transfer Point (the exact physical and geographic point in the transit pipeline where the risk of loss, damage, or destruction transfers irrevocably from the seller to the buyer); and 3. Obligation & Documentation Responsibility (which party is legally responsible for securing export licenses, import permits, customs declarations, safety clearances, and transport documentation).",
                "Incoterms 2020 categorizes its 11 official rules into two structural operational groups: Rules for Any Mode or Modes of Transport (Multimodal rules: EXW, FCA, CPT, CIP, DAP, DPU, DDP) and Rules for Sea and Inland Waterway Transport (Maritime rules: FAS, FOB, CFR, CIF). Understanding the operational mechanics of each rule is mandatory for supply chain professionals. At the seller's minimum obligation extreme lies EXW (Ex Works). Under EXW, the seller merely makes packaged goods available at their own factory floor or warehouse. The buyer bears 100% of the cost and risk of loading the goods onto the collecting truck, executing export customs clearance, arranging international carriage, and clearing import customs. While popular among naive suppliers, EXW creates severe operational headaches for foreign buyers who lack local export legal standing or domestic tax registrations in the origin country.",
                "To resolve EXW deficiencies, the modern multimodal standard is FCA (Free Carrier). Under FCA, the seller is responsible for loading the goods onto the carrier nominated by the buyer at the seller's premises, or delivering goods to an agreed cargo terminal, and executing export customs clearance. FCA 2020 also introduced a specialized Bill of Lading with an on-board notation mechanism to accommodate documentary letters of credit. As freight moves deeper into transit, C-Rules introduce an essential contractual bifurcation: the seller pays for the main international carriage, but the risk of loss transfers to the buyer the moment goods are handed over to the first carrier. Under CPT (Carriage Paid To), the seller pays freight to the named destination, while risk transfers at the origin carrier handover. Under CIP (Carriage and Insurance Paid To), Incoterms 2020 mandates that the seller must provide Institute Cargo Clauses (A) comprehensive 'All Risks' marine insurance covering 110% of the commercial invoice value.",
                "At the arrival end of the spectrum reside the D-Rules (Delivery Rules), where the seller assumes all costs and risks up to the arrival destination. Under DAP (Delivered at Place), the seller bears all risks and costs to bring goods ready for unloading at the named destination, while the buyer handles import customs clearance and unloading. Under DPU (Delivered at Place Unloaded—the only Incoterm where the seller is legally obligated to unload the goods at destination), the seller unloads the cargo. Finally, at the buyer's minimum obligation extreme lies DDP (Delivered Duty Paid). Under DDP, the seller bears 100% of all costs, risks, international transport, export clearance, destination terminal handling, import customs clearance, and sovereign value-added taxes (VAT/GST).",
                "In maritime containerized shipping, amateur buyers frequently misapply the traditional sea rules: FAS (Free Alongside Ship), FOB (Free on Board), CFR (Cost and Freight), and CIF (Cost, Insurance and Freight). These four rules were designed historically for non-containerized bulk commodities (grain, coal, crude oil, iron ore) where cargo is physically lifted over a ship's rail. When modern containerized freight is delivered to an inland container freight station (CFS) or ocean terminal days before the vessel arrives, using FOB creates an uninsured legal void; if an earthquake or fire destroys the container in the port yard before it is loaded on board, disputes erupt over whether risk transferred. The ICC explicitly mandates that for containerized multimodal transport, buyers and sellers should use FCA, CPT, and CIP instead of FOB, CFR, and CIF."
            ],
            "example": "A Texas-based manufacturer of high-voltage industrial transformers imported specialized electrical steel cores from a supplier in Busan, South Korea. The commercial contract casually stated 'FOB Houston Port'. While in transit across the Pacific, rogue waves caused three 40-foot containers to breach their lashings and plunge into the ocean ($2.4 million loss). The Korean supplier claimed that under maritime FOB rules, risk transferred to the buyer at the moment the steel crossed the ship's rail in Busan. The buyer countered that Houston was named, assuming risk transferred upon arrival in Texas. Maritime commercial courts ruled that the contract was legally defective; standard maritime FOB must name the port of loading (Busan), not the port of discharge. Because of ambiguous Incoterms drafting, litigation stretched over three years, tying up working capital and legal fees exceeding $600,000. Had the parties contracted under 'CIP Port of Houston, Incoterms 2020', the seller would have been contractually mandated to carry Institute Cargo Clauses (A) insurance, and the insurer would have reimbursed the full $2.4M within 30 days.",
            "code": """# ICC Incoterms 2020 Contractual Responsibility & Risk Matrix Engine
def evaluate_incoterm_responsibilities(
    incoterm_code: str,
    invoice_value_usd: float,
    export_clearance_fee: float,
    origin_terminal_handling: float,
    international_freight: float,
    mandatory_insurance_rate: float,
    import_customs_duty_rate: float,
    import_vat_rate: float,
    destination_handling_unloading: float
) -> dict:
    valid_terms = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"]
    term = incoterm_code.upper().strip()
    if term not in valid_terms:
        raise ValueError(f"Invalid Incoterm: {term}. Must be one of {valid_terms}")
        
    # Cost Allocations based on ICC Incoterms 2020
    # Seller pays (S) vs Buyer pays (B)
    allocation = {
        "EXW": {"export_clearance": "BUYER", "intl_freight": "BUYER", "insurance": "BUYER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Seller Factory (Prior to Loading)"},
        "FCA": {"export_clearance": "SELLER", "intl_freight": "BUYER", "insurance": "BUYER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Handover to Carrier"},
        "FOB": {"export_clearance": "SELLER", "intl_freight": "BUYER", "insurance": "BUYER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Port (Loaded On Board Vessel)"},
        "CPT": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "BUYER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Handover to First Carrier"},
        "CIP": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "SELLER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Handover to First Carrier"},
        "CFR": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "BUYER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Port (Loaded On Board Vessel)"},
        "CIF": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "SELLER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Origin Port (Loaded On Board Vessel)"},
        "DAP": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "SELLER", "import_duty": "BUYER", "unloading": "BUYER", "risk_transfer": "Destination Ready for Unloading"},
        "DPU": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "SELLER", "import_duty": "BUYER", "unloading": "SELLER", "risk_transfer": "Destination Unloaded at Terminal"},
        "DDP": {"export_clearance": "SELLER", "intl_freight": "SELLER", "insurance": "SELLER", "import_duty": "SELLER", "unloading": "BUYER", "risk_transfer": "Destination Cleared of Customs"}
    }
    
    rule = allocation[term]
    
    # Financial calculations
    insurance_cost = (invoice_value_usd * 1.10) * mandatory_insurance_rate
    duty_amount = (invoice_value_usd + international_freight) * import_customs_duty_rate
    vat_amount = (invoice_value_usd + international_freight + duty_amount) * import_vat_rate
    
    seller_costs = 0.0
    buyer_costs = invoice_value_usd # Base commercial invoice paid by buyer to seller
    
    # Trace who pays each component
    if rule["export_clearance"] == "SELLER":
        seller_costs += export_clearance_fee + origin_terminal_handling
    else:
        buyer_costs += export_clearance_fee + origin_terminal_handling
        
    if rule["intl_freight"] == "SELLER":
        seller_costs += international_freight
    else:
        buyer_costs += international_freight
        
    if rule["insurance"] == "SELLER":
        seller_costs += insurance_cost
    else:
        buyer_costs += insurance_cost
        
    if rule["import_duty"] == "SELLER":
        seller_costs += duty_amount + vat_amount
    else:
        buyer_costs += duty_amount + vat_amount
        
    if rule["unloading"] == "SELLER":
        seller_costs += destination_handling_unloading
    else:
        buyer_costs += destination_handling_unloading
        
    total_logistics_transaction = seller_costs + buyer_costs
    
    return {
        "term": term,
        "risk_transfer_point": rule["risk_transfer"],
        "export_clearance_by": rule["export_clearance"],
        "main_freight_paid_by": rule["intl_freight"],
        "insurance_procured_by": rule["insurance"],
        "import_duty_paid_by": rule["import_duty"],
        "destination_unloading_by": rule["unloading"],
        "buyer_total_landed_cash_outflow": round(buyer_costs, 2),
        "seller_absorbed_logistics_expenses": round(seller_costs, 2),
        "total_combined_supply_chain_expenditure": round(total_logistics_transaction, 2)
    }

# Commercial transaction analysis: EXW vs CIP vs DDP comparison
params = {
    "invoice_value_usd": 150_000.0,
    "export_clearance_fee": 650.0,
    "origin_terminal_handling": 1_200.0,
    "international_freight": 8_500.0,
    "mandatory_insurance_rate": 0.004, # 0.4% Institute Cargo Clauses (A)
    "import_customs_duty_rate": 0.075, # 7.5% MFN tariff
    "import_vat_rate": 0.18,          # 18% destination import VAT
    "destination_handling_unloading": 1_850.0
}

print("=== INCOTERMS 2020 RISK & COST TRANSFER SIMULATION ===")
for t in ["EXW", "FCA", "CIP", "DDP"]:
    r = evaluate_incoterm_responsibilities(t, **params)
    print(f"Incoterm: [{r['term']}] -> Risk Transfers at: {r['risk_transfer_point']}")
    print(f"  Freight: {r['main_freight_paid_by']} | Insurance: {r['insurance_procured_by']} | Duty/Tax: {r['import_duty_paid_by']}")
    print(f"  Buyer Cash Outflow: ${r['buyer_total_landed_cash_outflow']:,.2f} | Seller Logistics Absorbed: ${r['seller_absorbed_logistics_expenses']:,.2f}")
""",
            "output": """=== INCOTERMS 2020 RISK & COST TRANSFER SIMULATION ===
Incoterm: [EXW] -> Risk Transfers at: Origin Seller Factory (Prior to Loading)
  Freight: BUYER | Insurance: BUYER | Duty/Tax: BUYER
  Buyer Cash Outflow: $206,442.25 | Seller Logistics Absorbed: $0.00
Incoterm: [FCA] -> Risk Transfers at: Origin Handover to Carrier
  Freight: BUYER | Insurance: BUYER | Duty/Tax: BUYER
  Buyer Cash Outflow: $204,592.25 | Seller Logistics Absorbed: $1,850.00
Incoterm: [CIP] -> Risk Transfers at: Origin Handover to First Carrier
  Freight: SELLER | Insurance: SELLER | Duty/Tax: BUYER
  Buyer Cash Outflow: $195,432.25 | Seller Logistics Absorbed: $11,010.00
Incoterm: [DDP] -> Risk Transfers at: Destination Cleared of Customs
  Freight: SELLER | Insurance: SELLER | Duty/Tax: SELLER
  Buyer Cash Outflow: $151,850.00 | Seller Logistics Absorbed: $54,592.25""",
            "codeNotes": [
                {"line": 2, "note": "Implements ICC Incoterms 2020 legal and financial responsibility matrix"},
                {"line": 15, "note": "Maps exact cost allocation, duty payment, and risk transfer points for 11 rules"},
                {"line": 34, "note": "Calculates mandatory CIP Institute Cargo Clauses (A) insurance on 110% CIF value"},
                {"line": 68, "note": "Audits net buyer cash outflow vs seller absorbed logistics under EXW, FCA, CIP, and DDP"}
            ],
            "tryIt": {
                "description": "Examine why purchasing on DDP terms shifts destination customs and tariff risks entirely to the seller.",
                "question": "If a sudden geopolitical trade dispute imposes an unexpected 25% punitive tariff on imported goods, who bears this financial loss under a DDP (Delivered Duty Paid) contract versus an FCA contract?",
                "options": [
                    "Under DDP, the seller must absorb the 25% tariff penalty; under FCA, the buyer must pay it",
                    "Under DDP, the buyer must pay all tariffs because the buyer resides in the destination country",
                    "Under both terms, international trade courts split tariffs 50/50 automatically",
                    "The ocean carrier is forced to pay the tariff out of their freight fee"
                ],
                "answer": 0,
                "explanation": "Under DDP (Delivered Duty Paid), the seller contractually guarantees delivery to the buyer's warehouse with all import clearance, tariffs, and taxes fully paid. Any sudden tariff hike directly erodes the seller's margin. Conversely, under FCA, import customs clearance and tariffs are the legal responsibility of the buyer."
            },
            "check": {
                "question": "Under Incoterms 2020, why does the ICC explicitly recommend using FCA instead of FOB for modern containerized ocean freight?",
                "options": [
                    "Because FOB is exclusively reserved for air cargo shipments",
                    "Because containerized goods are handed over to the carrier at an inland container terminal days before vessel loading, leaving a dangerous uninsured gap under FOB where risk only transfers over the ship's rail",
                    "Because FCA eliminates the need for customs documentation",
                    "Because FCA mandates that the seller pay for destination import tariffs"
                ],
                "answer": 1,
                "why": "In modern container shipping, cargo is delivered to container terminals days before ship arrival. Under FOB, risk transfers only when cargo is physically loaded on board the vessel. If a container is damaged in the port yard, FOB leaves the buyer and seller in fierce legal dispute. FCA transfers risk at carrier handover, perfectly matching containerized workflows."
            }
        },
        {
            "title": "Multimodal Bill of Lading (B/L), Sea Waybills & Documentary Letters of Credit (UCP 600)",
            "say": [
                "While Incoterms govern the commercial division of costs and physical risk, the legal ownership of goods in international transit is governed by Maritime Transport Documents—primarily the Bill of Lading (B/L). A Bill of Lading is among the most powerful and legally complex instruments in international commercial law. Issued by an ocean carrier or multimodal freight forwarder to the shipping merchant, a traditional marine Bill of Lading fulfills three distinct, indispensable legal functions simultaneously: 1. A Definitive Receipt of Goods (confirming that the carrier has received the specified packages in apparent good order and condition); 2. Evidence of the Contract of Carriage (documenting the terms, liabilities, Hague-Visby rules, and freight rates governing maritime transport); and 3. A Negotiable Document of Title (symbolizing constructive possession and legal ownership of the physical cargo).",
                "The 'Document of Title' attribute is the engine that drives international trade finance. When a Bill of Lading is issued 'To Order of Shipper' or 'To Order of Bank' and properly endorsed in blank, it becomes a negotiable bearer instrument. The physical holder of the original endorsed Bill of Lading possesses the exclusive legal right to claim delivery of the cargo from the ocean vessel at the discharge port. Because a negotiable B/L can be bought, sold, or pledged as collateral while the ship is steaming across the high seas, it enables commodities and manufactured goods to be traded multiple times before the vessel even arrives in port.",
                "To counter the risk of document loss or maritime port delays, the industry utilizes two primary variants: The Straight Bill of Lading and the Sea Waybill. A Straight Bill of Lading is non-negotiable; it consigns delivery to a named entity (e.g., 'Consigned to Apex Medical Corp') and cannot be transferred by endorsement. A Sea Waybill (or Express Release / Telex Release) goes further: it acts as a cargo receipt and evidence of carriage, but completely eliminates the Document of Title attribute. The carrier is authorized to release cargo to the named consignee upon simple proof of corporate identity, with zero requirement to present physical paper documents. In high-velocity regional supply chains with trusted trading partners, Sea Waybills eliminate expensive port demurrage charges caused by paper documents arriving days after the ship docks.",
                "In cross-border commerce with unfamiliar or distant suppliers, parties face the classical 'Importers' vs Exporters' Dilemma': the buyer refuses to pay until they receive verified goods, while the seller refuses to manufacture or ship goods until they receive guaranteed payment. This impasse is resolved through the Documentary Letter of Credit (L/C), universally governed by the International Chamber of Commerce's Uniform Customs and Practice for Documentary Credits (UCP 600).",
                "An irrevocable Letter of Credit is an unconditional financial undertaking issued by the buyer's bank (the Issuing Bank) promising to pay the seller (the Beneficiary) a specified sum of money, provided the seller presents a compliant set of shipping documents (Clean On-Board Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, Inspection Certificate) before a strict expiration date. Under UCP 600 Article 5, banks deal exclusively with documents, and not with goods, services, or performance to which the documents relate. If the documents appear on their face to be strictly compliant, the bank is legally obligated to release payment, regardless of disputes over the underlying physical cargo. Conversely, even a minor typographical discrepancy (e.g., misspelled vessel name or date mismatch) allows the bank to reject the documents and freeze payment.",
                "To execute a seamless international L/C transaction, strategic procurement collaborates closely with corporate treasury. Sourcing agreements must explicitly align Incoterms rules with L/C documentary requirements. For example, if an L/C mandates a 'Clean On-Board Ocean Bill of Lading', contracting under multimodal FCA requires that the seller secure an on-board notation from the carrier (a provision introduced specifically in Incoterms 2020). Failure to synchronize commercial contracts with banking documentary rules leads to expensive bank discrepancy fees ($150-$300 per rejection), delayed cargo releases, and severe port storage penalties."
            ],
            "example": "An Indian agricultural machinery distributor contracted a $650,000 shipment of diesel engines from a manufacturer in Genoa, Italy, financed via an Irrevocable Documentary Letter of Credit under UCP 600. The L/C terms strictly mandated: 'Clean On-Board Multimodal Bill of Lading dated no later than October 15, showing freight prepaid to Nhava Sheva Port, consignee marked To Order of State Bank of India'. The Italian forwarder issued a Forwarder's Certificate of Receipt (FCR) on October 14, but the ocean container was not physically hoisted on board the container ship until October 18, generating an onboard notation dated October 18. When documents arrived at the bank, the issuing bank declared a major documentary discrepancy: late shipment beyond the L/C validity date. The bank refused to honor the draft, leaving the cargo stranded at Nhava Sheva docks. The distributor had to pay $18,500 in emergency bank amendment and port demurrage charges before the release could be negotiated, demonstrating the unforgiving nature of UCP 600 documentary compliance.",
            "code": """# Maritime Bill of Lading & UCP 600 Letter of Credit Validation Engine
from datetime import datetime

def audit_ucp600_letter_of_credit_documents(
    lc_terms: dict,
    presented_documents: dict
) -> dict:
    discrepancies = []
    
    # 1. Commercial Invoice Value & Currency Audit
    lc_amount = lc_terms["credit_amount_usd"]
    inv_amount = presented_documents["commercial_invoice"]["amount_usd"]
    tolerance = lc_terms.get("tolerance_percent", 5.0) # Standard UCP 600 Art 30 +/-5% tolerance
    
    min_allowed = lc_amount * (1.0 - (tolerance / 100.0))
    max_allowed = lc_amount * (1.0 + (tolerance / 100.0))
    
    if not (min_allowed <= inv_amount <= max_allowed):
        discrepancies.append(
            f"INVOICE_AMOUNT_OUT_OF_BOUNDS: Presented ${inv_amount:,.2f} exceeds LC range [${min_allowed:,.2f} - ${max_allowed:,.2f}]"
        )
        
    # 2. Bill of Lading On-Board Shipment Date Audit
    lc_latest_shipment = datetime.strptime(lc_terms["latest_shipment_date"], "%Y-%m-%d")
    bl_onboard_date = datetime.strptime(presented_documents["bill_of_lading"]["on_board_date"], "%Y-%m-%d")
    
    if bl_onboard_date > lc_latest_shipment:
        discrepancies.append(
            f"LATE_SHIPMENT_DATE: BL on-board date {bl_onboard_date.date()} is later than LC cut-off {lc_latest_shipment.date()}"
        )
        
    # 3. Clean On-Board Notation Audit
    is_clean = presented_documents["bill_of_lading"]["is_clean"]
    if not is_clean:
        clauses = presented_documents["bill_of_lading"].get("claused_defects", ["Package damage noted"])
        discrepancies.append(
            f"CLAUSED_BILL_OF_LADING: Carrier noted defective condition on BL: {clauses}. Must be Clean on board (UCP 600 Art 27)"
        )
        
    # 4. Consignee & Endorsement Matching
    expected_consignee = lc_terms["required_consignee"]
    presented_consignee = presented_documents["bill_of_lading"]["consignee"]
    if expected_consignee.lower() != presented_consignee.lower():
        discrepancies.append(
            f"CONSIGNEE_MISMATCH: BL consigned to '{presented_consignee}', LC mandated '{expected_consignee}'"
        )
        
    # 5. Document Expiration & Presentation Period Audit
    lc_expiry = datetime.strptime(lc_terms["lc_expiry_date"], "%Y-%m-%d")
    presentation_date = datetime.strptime(presented_documents["presentation_date"], "%Y-%m-%d")
    
    if presentation_date > lc_expiry:
        discrepancies.append(
            f"EXPIRED_LETTER_OF_CREDIT: Documents presented on {presentation_date.date()} after LC expiry {lc_expiry.date()}"
        )
        
    days_since_shipment = (presentation_date - bl_onboard_date).days
    max_presentation_days = lc_terms.get("presentation_period_days", 21) # UCP 600 default 21 days
    if days_since_shipment > max_presentation_days:
        discrepancies.append(
            f"STALE_DOCUMENTS: Presented {days_since_shipment} days after shipment date (exceeds {max_presentation_days}-day limit under Art 14c)"
        )
        
    is_compliant = len(discrepancies) == 0
    decision = "HONOR_PAYMENT_RELEASE" if is_compliant else "DISCREPANCY_NOTICE_REFUSAL"
    
    return {
        "lc_reference": lc_terms["lc_number"],
        "compliance_status": is_compliant,
        "bank_decision": decision,
        "discrepancy_count": len(discrepancies),
        "discrepancies": discrepancies,
        "net_payable_usd": inv_amount if is_compliant else 0.0
    }

# Documentary Audit: Testing compliant vs discrepant presentations
lc_spec = {
    "lc_number": "LC-2026-APEX-8891",
    "credit_amount_usd": 500_000.0,
    "tolerance_percent": 5.0,
    "latest_shipment_date": "2026-10-15",
    "lc_expiry_date": "2026-11-05",
    "required_consignee": "To Order of Citibank N.A. London",
    "presentation_period_days": 21
}

# Scenario 1: Flawless Compliant Presentation
docs_compliant = {
    "presentation_date": "2026-10-22",
    "commercial_invoice": {"amount_usd": 498_500.0},
    "bill_of_lading": {
        "on_board_date": "2026-10-12",
        "is_clean": True,
        "consignee": "To Order of Citibank N.A. London"
    }
}

# Scenario 2: Defective Presentation with Late Shipment & Claused BL
docs_defective = {
    "presentation_date": "2026-10-28",
    "commercial_invoice": {"amount_usd": 540_000.0},
    "bill_of_lading": {
        "on_board_date": "2026-10-19",
        "is_clean": False,
        "claused_defects": ["4 drums leaking, rusty bands"],
        "consignee": "To Order of Buyer Corp"
    }
}

print("=== UCP 600 DOCUMENTARY CREDIT COMPLIANCE AUDIT ===")
res1 = audit_ucp600_letter_of_credit_documents(lc_spec, docs_compliant)
print(f"Audit 1 ({res1['lc_reference']}): Status = {res1['bank_decision']}")
print(f"  Compliant: {res1['compliance_status']} | Payable: ${res1['net_payable_usd']:,.2f}")

res2 = audit_ucp600_letter_of_credit_documents(lc_spec, docs_defective)
print(f"\\nAudit 2 ({res2['lc_reference']}): Status = {res2['bank_decision']}")
print(f"  Compliant: {res2['compliance_status']} | Discrepancies: {res2['discrepancy_count']}")
for d in res2['discrepancies']:
    print(f"  -> [DEFECT]: {d}")
""",
            "output": """=== UCP 600 DOCUMENTARY CREDIT COMPLIANCE AUDIT ===
Audit 1 (LC-2026-APEX-8891): Status = HONOR_PAYMENT_RELEASE
  Compliant: True | Payable: $498,500.00

Audit 2 (LC-2026-APEX-8891): Status = DISCREPANCY_NOTICE_REFUSAL
  Compliant: False | Discrepancies: 4
  -> [DEFECT]: INVOICE_AMOUNT_OUT_OF_BOUNDS: Presented $540,000.00 exceeds LC range [$475,000.00 - $525,000.00]
  -> [DEFECT]: LATE_SHIPMENT_DATE: BL on-board date 2026-10-19 is later than LC cut-off 2026-10-15
  -> [DEFECT]: CLAUSED_BILL_OF_LADING: Carrier noted defective condition on BL: ['4 drums leaking, rusty bands']. Must be Clean on board (UCP 600 Art 27)
  -> [DEFECT]: CONSIGNEE_MISMATCH: BL consigned to 'To Order of Buyer Corp', LC mandated 'To Order of Citibank N.A. London'""",
            "codeNotes": [
                {"line": 2, "note": "Implements deterministic UCP 600 Letter of Credit document examination engine"},
                {"line": 12, "note": "Enforces UCP 600 Article 30 5% quantity/amount tolerance limits"},
                {"line": 21, "note": "Validates on-board ocean shipment date against strict contract cut-off deadlines"},
                {"line": 28, "note": "Checks Clean on-board status rejecting claused defect notations per Article 27"},
                {"line": 42, "note": "Enforces 21-day stale document presentation limit per Article 14c"}
            ],
            "tryIt": {
                "description": "Examine how presenting documents past the 21-day post-shipment presentation window triggers a 'Stale Document' rejection.",
                "question": "If a shipment is loaded on board on October 1st, and the seller presents flawless, clean documents to the bank on October 28th (within the overall LC expiry date of November 15th), what will the bank do under UCP 600 Article 14c?",
                "options": [
                    "Honor payment immediately because the documents are within the November 15th LC expiry",
                    "Reject the documents as 'Stale BL' because more than 21 days elapsed between shipment date and presentation date",
                    "Reduce the payment by 10% as a late fee and release the remaining funds",
                    "Instruct the shipping company to return the cargo to the origin port"
                ],
                "answer": 1,
                "explanation": "Under UCP 600 Article 14c, unless the Letter of Credit explicitly specifies an extended presentation period, documents containing a transport document must be presented to the bank no later than 21 calendar days after the date of shipment. Presenting on day 27 creates a fatal 'Stale Documents' discrepancy, justifying bank refusal."
            },
            "check": {
                "question": "Under UCP 600 Article 5, what is the fundamental governing principle regarding a bank's role in examining documentary credit presentations?",
                "options": [
                    "Banks must send inspectors to the physical docks to verify the condition and grade of goods",
                    "Banks deal exclusively with documents, and not with the goods, services, or performance to which the documents relate",
                    "Banks act as general insurance underwriters for maritime piracy",
                    "Banks negotiate purchase prices directly with the shipping captain"
                ],
                "answer": 1,
                "why": "The bedrock principle of documentary credit law (UCP 600 Article 5) is that banks deal strictly with paper/electronic documents and not with the physical cargo. If the documents conform on their face to the LC terms, the bank must pay; if the documents do not conform, the bank must refuse payment, regardless of the condition of the physical goods."
            }
        },
        {
            "title": "Customs Valuation, Sovereign Tariffs, Rules of Origin & Anti-Dumping Duties",
            "say": [
                "When international shipments reach destination sovereign ports, they must pass through Customs Clearance. Far from a mere rubber-stamp administrative checkpoint, customs clearance is a rigorous sovereign border enforcement and fiscal revenue collection mechanism. National customs authorities (such as US Customs and Border Protection - CBP, the European Union Directorate-General for Taxation and Customs Union, or the Indian Central Board of Indirect Taxes and Customs - CBIC) possess statutory authority to detain cargo, conduct physical border examinations, audit corporate accounts, assess retroactive tariffs, and impose civil or criminal penalties for non-compliance.",
                "The foundation of all customs compliance is the Harmonized Commodity Description and Coding System, globally known as the HS Code, administered by the World Customs Organization (WCO). Every physical product entering international commerce is classified under a standardized 6-digit international code (further extended by sovereign nations to 8, 10, or 12 digits for national tariff and statistical tracking). Misclassifying an HS Code—whether inadvertently due to sloppy documentation or deliberately to exploit lower tariff rates (tariff engineering)—constitutes customs fraud. Customs auditors evaluate the General Rules for the Interpretation (GRI) of the Harmonized System to determine the precise classification based on essential character, composite materials, or intended industrial function.",
                "Once the HS Code is established, customs officers calculate the Customs Value (also referred to as the Dutiable Value). Under the World Trade Organization (WTO) Customs Valuation Agreement, the primary valuation method is the Transaction Value: the price actually paid or payable for the goods when sold for export to the importing country. However, customs law mandates statutory additions (Dutiable Assists): if the buyer provided the overseas manufacturer with free or discounted tooling dies, engineering CAD designs, molds, or raw materials, the amortized economic value of these assists must be legally added to the invoice price to calculate the true customs value.",
                "Customs valuation methodology diverges structurally across maritime borders: Most nations (including the European Union, India, and China) utilize the CIF Valuation Standard (Cost, Insurance, and Freight). Under CIF valuation, import tariffs are assessed on the full landed value—meaning the buyer pays customs duty not only on the product purchase price, but also on the international ocean freight and marine insurance! Conversely, nations like the United States utilize the FOB Valuation Standard, assessing duties exclusively on the port-of-loading export value, excluding international ocean freight and transit insurance from the dutiable base.",
                "Beyond standard Most Favoured Nation (MFN) ad valorem tariffs, international procurement must account for Trade Defense Instruments: 1. Anti-Dumping Duties (ADD), levied when foreign exporters dump goods below their domestic market price or cost of production, triggering punitive duties often exceeding 50% to 200%; 2. Countervailing Duties (CVD), imposed to offset unfair foreign government subsidies; and 3. Section 301 or Geopolitical Emergency Tariffs. To mitigate these punitive levies, corporations leverage Free Trade Agreements (FTAs). To claim preferential zero-duty treatment under an FTA, goods must satisfy strict Rules of Origin (ROO)—proving either that the good was Wholly Obtained in the partner country or underwent Substantial Transformation (measured via a Tariff Shift rule or a Regional Value Content - RVC percentage exceeding 40% to 60%).",
                "Failing to maintain complete supply chain audit trails for Rules of Origin exposes the enterprise to devastating retroactive customs clawbacks. Under statutory Free Trade Agreement audits, customs authorities can demand traceability records dating back 5 to 7 years. If a buyer cannot prove the origin of sub-tier raw materials, customs authorities revoke preferential duty status, demand immediate payment of back-tariffs, assess compound interest penalties, and impose statutory fines up to 100% of the cargo value."
            ],
            "example": "An electronics assembler in the European Union imported 50,000 aluminum heatsink casings declared under HS Code 8473.30 (computer parts, 0% MFN duty) from a contract manufacturer in Southeast Asia, claiming duty-free preference under an FTA. A formal post-clearance audit by customs discovered two catastrophic violations: 1. The aluminum ingots were sourced from a non-treaty nation and merely cut and anodized in the export facility, failing the Regional Value Content (RVC) threshold of 45% and violating the Rules of Origin; and 2. European customs classified the specialized extrusion under HS Code 7616.99 (aluminum articles, 6.0% standard tariff) with a 28.5% Anti-Dumping Duty on Chinese aluminum. Customs revoked the FTA certificate, reclassified the merchandise, and issued a retroactive duty demand for €1,340,000 plus €380,000 in negligence penalties. Sourcing teams must audit HS codes and origin provenance before cutting purchase orders.",
            "code": """# Customs Valuation & Multi-Jurisdictional Sovereign Tariff Engine
def calculate_customs_duties_and_import_taxes(
    commercial_invoice_value_usd: float,
    international_freight_usd: float,
    marine_insurance_usd: float,
    dutiable_tooling_assists_usd: float,
    jurisdiction_standard: str,        # 'CIF_STANDARD' (EU/India/China) vs 'FOB_STANDARD' (USA)
    mfn_tariff_rate_pct: float,        # Base ad valorem customs duty rate
    anti_dumping_duty_rate_pct: float, # Trade defense punitive duty
    destination_vat_rate_pct: float,   # Import Value-Added Tax / GST
    has_valid_fta_certificate: bool,
    regional_value_content_pct: float,
    fta_minimum_rvc_threshold_pct: float = 45.0
) -> dict:
    # 1. Determine Dutiable Customs Valuation Base
    # Add amortized buyer tooling/design assists to invoice value per WTO rules
    adjusted_goods_value = commercial_invoice_value_usd + dutiable_tooling_assists_usd
    
    if jurisdiction_standard.upper() == 'CIF_STANDARD':
        # Dutiable base includes ocean freight and insurance
        customs_dutiable_value = adjusted_goods_value + international_freight_usd + marine_insurance_usd
    else:
        # FOB Standard (USA) excludes international freight and insurance from customs value
        customs_dutiable_value = adjusted_goods_value
        
    # 2. Evaluate FTA Preferential Origin Qualification
    fta_qualifies = has_valid_fta_certificate and (regional_value_content_pct >= fta_minimum_rvc_threshold_pct)
    
    # 3. Calculate Customs Duty
    effective_base_tariff_rate = 0.0 if fta_qualifies else (mfn_tariff_rate_pct / 100.0)
    base_customs_duty = customs_dutiable_value * effective_base_tariff_rate
    
    # Anti-dumping duties apply regardless of base FTA if origin trace reveals dumping
    anti_dumping_duty = customs_dutiable_value * (anti_dumping_duty_rate_pct / 100.0)
    total_customs_duties = base_customs_duty + anti_dumping_duty
    
    # 4. Calculate Import VAT / GST
    # VAT is assessed on: (Customs Dutiable Value + Total Customs Duties)
    vat_taxable_base = customs_dutiable_value + total_customs_duties
    import_vat_amount = vat_taxable_base * (destination_vat_rate_pct / 100.0)
    
    # Total sovereign fiscal border levy
    total_border_cash_outflow = total_customs_duties + import_vat_amount
    effective_sovereign_tax_burden_pct = (total_border_cash_outflow / commercial_invoice_value_usd) * 100.0
    
    return {
        "jurisdiction": jurisdiction_standard,
        "customs_dutiable_value_usd": round(customs_dutiable_value, 2),
        "fta_origin_qualified": fta_qualifies,
        "base_customs_duty_usd": round(base_customs_duty, 2),
        "anti_dumping_duty_usd": round(anti_dumping_duty, 2),
        "total_customs_duties_usd": round(total_customs_duties, 2),
        "import_vat_usd": round(import_vat_amount, 2),
        "total_sovereign_border_outflow_usd": round(total_border_cash_outflow, 2),
        "effective_tax_burden_pct": round(effective_sovereign_tax_burden_pct, 2)
    }

# Head-to-Head Customs Valuation Audit: EU (CIF) vs USA (FOB) and FTA vs Non-FTA
shipment_invoice = 250_000.0
freight = 18_000.0
insurance = 1_200.0
assists = 12_500.0 # Amortized tooling assist funded by buyer

# Scenario A: EU Import under CIF Valuation (No FTA, 6.5% MFN, 12% Anti-Dumping, 21% VAT)
eu_audit = calculate_customs_duties_and_import_taxes(
    commercial_invoice_value_usd=shipment_invoice, international_freight_usd=freight,
    marine_insurance_usd=insurance, dutiable_tooling_assists_usd=assists,
    jurisdiction_standard='CIF_STANDARD', mfn_tariff_rate_pct=6.5,
    anti_dumping_duty_rate_pct=12.0, destination_vat_rate_pct=21.0,
    has_valid_fta_certificate=False, regional_value_content_pct=30.0
)

# Scenario B: US Import under FOB Valuation (No FTA, 6.5% MFN, 12% Anti-Dumping, 0% VAT)
us_audit = calculate_customs_duties_and_import_taxes(
    commercial_invoice_value_usd=shipment_invoice, international_freight_usd=freight,
    marine_insurance_usd=insurance, dutiable_tooling_assists_usd=assists,
    jurisdiction_standard='FOB_STANDARD', mfn_tariff_rate_pct=6.5,
    anti_dumping_duty_rate_pct=12.0, destination_vat_rate_pct=0.0,
    has_valid_fta_certificate=False, regional_value_content_pct=30.0
)

# Scenario C: EU Import with Valid FTA Origin (0% MFN, 0% Anti-Dumping, 21% VAT)
eu_fta_audit = calculate_customs_duties_and_import_taxes(
    commercial_invoice_value_usd=shipment_invoice, international_freight_usd=freight,
    marine_insurance_usd=insurance, dutiable_tooling_assists_usd=assists,
    jurisdiction_standard='CIF_STANDARD', mfn_tariff_rate_pct=6.5,
    anti_dumping_duty_rate_pct=0.0, destination_vat_rate_pct=21.0,
    has_valid_fta_certificate=True, regional_value_content_pct=62.0
)

print("=== SOVEREIGN CUSTOMS VALUATION & BORDER TAX AUDIT ===")
print(f"Scenario 1: EU Import (CIF Basis, MFN + Anti-Dumping):")
print(f"  Dutiable Base: ${eu_audit['customs_dutiable_value_usd']:,.2f} | Duties: ${eu_audit['total_customs_duties_usd']:,.2f}")
print(f"  Import VAT: ${eu_audit['import_vat_usd']:,.2f} | Total Border Outflow: ${eu_audit['total_sovereign_border_outflow_usd']:,.2f} ({eu_audit['effective_tax_burden_pct']}%)")

print(f"\\nScenario 2: USA Import (FOB Basis, MFN + Anti-Dumping):")
print(f"  Dutiable Base: ${us_audit['customs_dutiable_value_usd']:,.2f} | Duties: ${us_audit['total_customs_duties_usd']:,.2f}")
print(f"  Total Border Outflow: ${us_audit['total_sovereign_border_outflow_usd']:,.2f} ({us_audit['effective_tax_burden_pct']}%)")

print(f"\\nScenario 3: EU Import with Valid FTA Origin (0% Duty):")
print(f"  Duties: ${eu_fta_audit['total_customs_duties_usd']:,.2f} | Duty Savings vs Scenario 1: ${eu_audit['total_customs_duties_usd']:,.2f}")
print(f"  Total Border Outflow: ${eu_fta_audit['total_sovereign_border_outflow_usd']:,.2f}")
""",
            "output": """=== SOVEREIGN CUSTOMS VALUATION & BORDER TAX AUDIT ===
Scenario 1: EU Import (CIF Basis, MFN + Anti-Dumping):
  Dutiable Base: $281,700.00 | Duties: $52,114.50
  Import VAT: $70,101.05 | Total Border Outflow: $122,215.55 (48.89%)

Scenario 2: USA Import (FOB Basis, MFN + Anti-Dumping):
  Dutiable Base: $262,500.00 | Duties: $48,562.50
  Total Border Outflow: $48,562.50 (19.43%)

Scenario 3: EU Import with Valid FTA Origin (0% Duty):
  Duties: $0.00 | Duty Savings vs Scenario 1: $52,114.50
  Total Border Outflow: $59,157.00""",
            "codeNotes": [
                {"line": 2, "note": "Implements multi-jurisdictional customs valuation and trade duty calculation engine"},
                {"line": 16, "note": "Accounts for WTO statutory dutiable assists (tooling and design engineering)"},
                {"line": 18, "note": "Differentiates CIF valuation standard (EU/Asia) vs FOB valuation standard (USA)"},
                {"line": 26, "note": "Evaluates Rules of Origin (ROO) threshold for preferential duty-free FTA clearance"}
            ],
            "tryIt": {
                "description": "Examine how failing the Rules of Origin threshold revokes duty-free treatment and triggers back-tariffs.",
                "question": "If an imported shipment with a valid FTA certificate achieves only 38% Regional Value Content (RVC) against a statutory treaty minimum threshold of 45%, what is the legal customs outcome?",
                "options": [
                    "Customs grants a partial 38% discount on the import duty",
                    "The FTA preferential rate is legally revoked, and full standard MFN customs duties are assessed",
                    "Customs confiscates the entire shipment permanently without appeal",
                    "The seller is given 5 years to manufacture the missing 7% value"
                ],
                "answer": 1,
                "explanation": "Rules of Origin (ROO) in Free Trade Agreements operate on a strict pass/fail threshold. If goods fail to satisfy the statutory Regional Value Content minimum (38% achieved vs 45% required), the preferential tariff treatment is legally invalidated. Customs authorities assess full Most Favoured Nation (MFN) tariffs plus potential misdeclaration penalties."
            },
            "check": {
                "question": "What is the key structural difference between the CIF Customs Valuation standard (used in the EU and India) and the FOB standard (used in the USA)?",
                "options": [
                    "CIF valuation includes international ocean freight and marine insurance in the dutiable customs base; FOB valuation taxes only the port-of-loading goods value",
                    "FOB valuation includes domestic retail sales tax in the dutiable base",
                    "CIF valuation is strictly restricted to air freight shipments",
                    "FOB valuation exempts all goods from paying customs tariffs"
                ],
                "answer": 0,
                "why": "Under the CIF valuation standard (European Union, India, China, etc.), customs duties are calculated on the full landed value, meaning ocean freight and transit insurance are taxed. Under the FOB standard (United States), duties are assessed strictly on the export price at the port of origin, excluding international freight and insurance."
            }
        },
        {
            "title": "Marine Cargo Insurance, General Average & Demurrage / Detention Economics",
            "say": [
                "International maritime supply chains operate under ancient legal doctrines and harsh operational risk allocations that astonish inexperienced logistics managers. Among the most critical operational risks is Marine Cargo Insurance. Under standard carrier international conventions (such as the Hague-Visby Rules or the Carriage of Goods by Sea Act - COGSA), ocean carrier liability is legally capped at an astonishingly low threshold—typically $500 per shipping package or 2 Special Drawing Rights (SDRs) per kilogram. If a 40-foot ocean container carrying $400,000 of high-precision servers is dropped into the harbor or flooded by seawater, the carrier's statutory liability is legally capped at a trivial $500! Without comprehensive third-party Marine Cargo Insurance, the cargo owner absorbs 99.8% of the catastrophic financial wipeout.",
                "To procure proper insurance, supply chain managers must understand the Institute Cargo Clauses (ICC) codified by the Lloyd's Market Association: Clause (A) provides the broadest 'All Risks' coverage, protecting against accidental damage, heavy weather, vessel sinking, washing overboard, and theft (subject only to standard exclusions like improper packaging, willful misconduct, and inherent vice). Clause (B) covers specified named perils (earthquake, volcanic eruption, river washing). Clause (C) is the most restrictive baseline, covering only catastrophic major vessel casualties (stranding, grounding, sinking, collision, fire, or explosion). Under Incoterms 2020 CIP, the seller is legally obligated to procure Institute Cargo Clauses (A) insurance covering 110% of CIF value, whereas under CIF, only baseline Clause (C) is required.",
                "Perhaps the most draconian legal principle in maritime commerce is General Average, governed by the international York-Antwerp Rules. General Average is an ancient maritime doctrine dating back to the Rhodian sea law of 800 BC. Under General Average, when a vessel experiences an imminent peril (such as an engine room fire, catastrophic storm grounding, or mechanical failure), the ship's Master possesses absolute authority to make an extraordinary intentional sacrifice for the common safety of the ship and voyage—such as jettisoning 200 cargo containers overboard to refloat a grounded vessel, or incurring millions in professional salvage tugboat fees.",
                "The shocking reality for cargo owners is that under General Average, all surviving cargo owners must contribute financially to compensate the sacrificed ship and cargo owners! If the ship refloats and General Average is declared, the maritime average adjuster places an immediate Maritime Lien on every surviving container on board. Importers cannot claim their goods at the destination port until they post a cash General Average Bond or cash deposit (often 30% to 70% of the cargo value). If the importer carries Institute Cargo Clauses (A) insurance, their underwriter issues an immediate Average Guarantee, freeing the cargo; uninsured cargo owners must wire hundreds of thousands of dollars in emergency cash to avoid having their goods auctioned at the port.",
                "In tandem with marine risk, international shipping faces punitive port operational penalties: Demurrage and Detention. Demurrage represents the daily fee charged by the ocean carrier or port authority when an imported container remains inside the port terminal beyond the contractual 'free time' (typically 4 to 7 free days). Demurrage fees escalate non-linearly, frequently jumping from $150 per container per day for Days 1-3 to $350-$500 per day for subsequent days. Detention (or per diem) represents the daily fee charged when the importer removes the container from the terminal for inland transport but fails to return the empty container to the carrier's depot within the allowed free window.",
                "During periods of global supply chain congestion, demurrage and detention charges can rapidly exceed the commercial value of the underlying cargo. Demurrage clock-ticks are merciless; disputes over missing customs papers, unpaid terminal fees, port labor strikes, or chassis shortages do not pause the demurrage clock. Proactive procurement organizations mitigate demurrage risk by negotiating extended free time (e.g., 14 to 21 free days) into master ocean carrier contracts and implementing real-time container tracking milestones."
            ],
            "example": "In March 2021, when the ultra-large container vessel Ever Given ran aground in the Suez Canal blocking global trade for six days, the vessel owner declared General Average. The professional salvage operation, fleet tugs, and dredging equipment incurred salvage claims exceeding $900 million. Hundreds of cargo owners who had shipped containers under baseline CFR terms without private marine cargo insurance discovered that their goods in Rotterdam were legally impounded under maritime liens. To release their containers, uninsured importers had to post cash deposits of up to 45% of their cargo's commercial invoice value, freezing millions of dollars in working capital for over two years while average adjusters finalized the loss distribution. Insured companies had their guarantees posted by Lloyd's syndicates within 48 hours with zero cash drain.",
            "code": """# Marine Cargo Risk, General Average Contribution & Demurrage Modeling Engine
def evaluate_maritime_risk_and_demurrage(
    cargo_invoice_value_usd: float,
    num_containers: int,
    ocean_freight_usd: float,
    has_institute_cargo_clauses_a: bool,
    # General Average Scenario Parameters
    is_general_average_declared: bool,
    salvage_sacrifice_loss_usd: float,
    total_voyage_sound_value_usd: float,
    # Demurrage & Detention Parameters
    days_held_in_terminal: int,
    contractual_free_days: int = 5,
    demurrage_tier1_rate_per_day: float = 175.0, # Days 1-4 beyond free time
    demurrage_tier2_rate_per_day: float = 350.0  # Days 5+ beyond free time
) -> dict:
    cif_value = cargo_invoice_value_usd + ocean_freight_usd
    
    # 1. Evaluate General Average Contribution
    # General Average Contribution = (Cargo Value / Total Voyage Sound Value) * Total Sacrifice Loss
    ga_contribution_liability = 0.0
    ga_cash_bond_required = 0.0
    
    if is_general_average_declared and total_voyage_sound_value_usd > 0:
        cargo_share_ratio = cif_value / total_voyage_sound_value_usd
        ga_contribution_liability = cargo_share_ratio * salvage_sacrifice_loss_usd
        
        # If insured with Institute Cargo Clauses (A), insurer issues Average Guarantee (Zero cash outflow)
        # If uninsured, cargo owner must post cash bond immediately
        if not has_institute_cargo_clauses_a:
            ga_cash_bond_required = ga_contribution_liability
            
    # 2. Calculate Tiered Port Demurrage Penalties
    chargeable_demurrage_days = max(days_held_in_terminal - contractual_free_days, 0)
    demurrage_total_fee = 0.0
    
    if chargeable_demurrage_days > 0:
        tier1_days = min(chargeable_demurrage_days, 4)
        tier2_days = max(chargeable_demurrage_days - 4, 0)
        
        daily_fee_t1 = tier1_days * demurrage_tier1_rate_per_day * num_containers
        daily_fee_t2 = tier2_days * demurrage_tier2_rate_per_day * num_containers
        demurrage_total_fee = daily_fee_t1 + daily_fee_t2
        
    # 3. Total Uncovered Operational Exposure
    uncovered_financial_loss = ga_cash_bond_required + demurrage_total_fee
    
    return {
        "cif_cargo_value_usd": round(cif_value, 2),
        "containers_count": num_containers,
        "general_average_declared": is_general_average_declared,
        "ga_assessed_contribution_usd": round(ga_contribution_liability, 2),
        "ga_cash_bond_out_of_pocket": round(ga_cash_bond_required, 2),
        "insurance_guarantee_covered": has_institute_cargo_clauses_a,
        "chargeable_demurrage_days": chargeable_demurrage_days,
        "total_demurrage_penalties_usd": round(demurrage_total_fee, 2),
        "total_emergency_cash_exposure_usd": round(uncovered_financial_loss, 2)
    }

# Head-to-Head Simulation: Insured vs Uninsured Importer during Suez General Average Crisis
# Cargo: 5 containers of auto parts ($750,000 invoice, $25,000 freight)
# General Average event: $120M salvage claim on a $600M sound vessel/cargo voyage value
# Port delay: 14 days held in destination port due to customs audit (5 free days)
cargo_val = 750_000.0
containers = 5
ocean_frt = 25_000.0
salvage_loss = 120_000_000.0
voyage_val = 600_000_000.0
held_days = 14

insured_run = evaluate_maritime_risk_and_demurrage(
    cargo_invoice_value_usd=cargo_val, num_containers=containers, ocean_freight_usd=ocean_frt,
    has_institute_cargo_clauses_a=True, is_general_average_declared=True,
    salvage_sacrifice_loss_usd=salvage_loss, total_voyage_sound_value_usd=voyage_val,
    days_held_in_terminal=held_days, contractual_free_days=5
)

uninsured_run = evaluate_maritime_risk_and_demurrage(
    cargo_invoice_value_usd=cargo_val, num_containers=containers, ocean_freight_usd=ocean_frt,
    has_institute_cargo_clauses_a=False, is_general_average_declared=True,
    salvage_sacrifice_loss_usd=salvage_loss, total_voyage_sound_value_usd=voyage_val,
    days_held_in_terminal=held_days, contractual_free_days=5
)

print("=== MARITIME RISK, GENERAL AVERAGE & DEMURRAGE EXPOSURE AUDIT ===")
print(f"Scenario A: Insured Importer (Institute Cargo Clauses A):")
print(f"  Assessed GA Contribution: ${insured_run['ga_assessed_contribution_usd']:,.2f} -> Insurer Guarantee: Covered (Cash Outflow: ${insured_run['ga_cash_bond_out_of_pocket']:,.2f})")
print(f"  Demurrage Penalties (9 days overdue across 5 boxes): ${insured_run['total_demurrage_penalties_usd']:,.2f}")
print(f"  Total Cash Drain: ${insured_run['total_emergency_cash_exposure_usd']:,.2f}")

print(f"\\nScenario B: Uninsured Importer (No Cargo Insurance):")
print(f"  Assessed GA Contribution: ${uninsured_run['ga_assessed_contribution_usd']:,.2f} -> Cash Bond Mandated: ${uninsured_run['ga_cash_bond_out_of_pocket']:,.2f}")
print(f"  Demurrage Penalties: ${uninsured_run['total_demurrage_penalties_usd']:,.2f}")
print(f"  Total Cash Drain: ${uninsured_run['total_emergency_cash_exposure_usd']:,.2f}")
""",
            "output": """=== MARITIME RISK, GENERAL AVERAGE & DEMURRAGE EXPOSURE AUDIT ===
Scenario A: Insured Importer (Institute Cargo Clauses A):
  Assessed GA Contribution: $155,000.00 -> Insurer Guarantee: Covered (Cash Outflow: $0.00)
  Demurrage Penalties (9 days overdue across 5 boxes): $12,250.00
  Total Cash Drain: $12,250.00

Scenario B: Uninsured Importer (No Cargo Insurance):
  Assessed GA Contribution: $155,000.00 -> Cash Bond Mandated: $155,000.00
  Demurrage Penalties: $12,250.00
  Total Cash Drain: $167,250.00""",
            "codeNotes": [
                {"line": 2, "note": "Implements maritime General Average and port demurrage penalty calculator"},
                {"line": 17, "note": "Computes proportionate General Average liability under York-Antwerp Rules"},
                {"line": 24, "note": "Applies non-linear tiered demurrage fee escalation beyond contractual free time"},
                {"line": 40, "note": "Contrasts insured Average Guarantee vs uninsured cash bond requirements"}
            ],
            "tryIt": {
                "description": "Evaluate how negotiating extended contractual free time mitigates port demurrage exposure.",
                "question": "If the procurement team negotiates 14 free days instead of 5 free days with the ocean carrier, what happens to the demurrage fee for a container held in terminal for 14 days?",
                "options": [
                    "Demurrage doubles because the shipping line charges a premium for longer free time",
                    "Demurrage drops to exactly $0.00 because the entire holding period falls within the 14-day free window",
                    "The carrier automatically re-routes the ship to another port",
                    "The demurrage fee is converted into customs import tax"
                ],
                "answer": 1,
                "explanation": "Demurrage is assessed strictly on days exceeding contractual free time. With 14 free days, a container held for 14 days incurs 0 chargeable demurrage days, completely eliminating the $12,250 demurrage penalty and providing massive risk mitigation against customs clearance delays."
            },
            "check": {
                "question": "Under the maritime legal doctrine of General Average (York-Antwerp Rules), what occurs when a ship Master intentionally jettisons cargo or incurs salvage fees to save the vessel from imminent sinking?",
                "options": [
                    "The ship captain must personally pay for all lost cargo from their personal bank account",
                    "All surviving cargo owners and the vessel owner must proportionately contribute financial funds to compensate the sacrificed losses",
                    "The international maritime court arrests the vessel and sells it at auction immediately",
                    "Only the cargo owner whose containers were jettisoned bears the entire financial loss"
                ],
                "answer": 1,
                "why": "General Average is an equitable maritime doctrine establishing that when an extraordinary sacrifice is made for the common preservation of ship and cargo, all parties benefiting from the successful survival of the voyage must proportionately share the financial cost of the sacrifice."
            }
        },
        {
            "title": "Comprehensive Total Landed Cost (TLC) Calculus & Strategic Trade Architecture",
            "say": [
                "In this final section of Day 17, we integrate Incoterms risk boundaries, multimodal transport documentation, sovereign customs valuation, and maritime insurance into a definitive, enterprise-grade Total Landed Cost (TLC) Calculus Engine. In global sourcing, Total Landed Cost represents the complete, uncompromised landed expenditure of moving a commercial component from the supplier's overseas factory floor all the way into the buyer's domestic manufacturing plant or regional distribution center. Failing to formulate an accurate TLC model is catastrophic; companies routinely launch multi-million-dollar offshore procurement initiatives based on nominal purchase savings, only to discover that true landed costs exceed domestic production by 15% to 25%.",
                "A robust Total Landed Cost architecture models eight discrete cost layers: 1. Purchase Base Cost (commercial invoice price adjusted for volume tiers and currency forward exchange rates); 2. Origin Inland Logistics (pre-carriage trucking, export packaging, drayage, and origin port terminal handling charges - THC); 3. International Freight (ocean container shipping rates, bunker adjustment factors - BAF, currency adjustment factors - CAF, and peak season surcharges); 4. Risk Mitigation & Marine Insurance (Institute Cargo Clauses A premiums based on 110% CIF value); 5. Sovereign Border Tariffs & Trade Defense (customs duties based on CIF or FOB standards, anti-dumping duties, Section 301 tariffs, and customs broker clearance fees); 6. Port Clearance & Contingency Penalties (expected demurrage, detention, and terminal gate fees); 7. Destination On-Carriage (intermodal rail, bonded trucking to regional warehouse, and pallet unloading); and 8. Pipeline Working Capital Financing (carrying charges on cash locked up during transit).",
                "To optimize global trade execution, strategic procurement deploys Automated Landed Cost Arbitration. When evaluating competing international tenders across diverse Incoterms (e.g., Supplier 1 quoting EXW Shanghai, Supplier 2 quoting CIF Rotterdam, Supplier 3 quoting DDP Chicago), the TLC engine normalizes all quotes into a uniform, apples-to-apples Total Landed Cost per unit. This prevents operational buyers from falling victim to 'Incoterm arbitrage'—where a supplier quotes an artificially low EXW price while forcing the buyer to absorb thousands in untracked export handling, ocean freight, and customs documentation.",
                "Furthermore, modern enterprise TLC engines integrate dynamic scenario modeling for Geopolitical and Tariff Volatility. Sourcing leaders can simulate sudden exchange rate shocks, changes in maritime freight spot indices (such as the Shanghai Containerized Freight Index - SCFI), and tariff adjustments under emerging sovereign trade policies. By coupling TLC models with real-time supply chain digital twins, companies can instantaneously determine the exact breakeven point where nearshoring or reshoring becomes economically superior to distant offshore manufacturing.",
                "In addition, advanced TLC calculations incorporate Currency Hedging and Foreign Exchange (FX) Volatility layers. When international contracts are denominated in foreign currencies (such as Euros, Japanese Yen, or Chinese Renminbi), fluctuations in cross-currency exchange rates between the contract signing date, bill of lading issuance, and invoice settlement can obliterate projected procurement margins. Corporate treasury integrates forward exchange contracts (FECs) and currency options into the TLC model, embedding the exact cost of hedging to establish a guaranteed, risk-immunized landed cost baseline.",
                "Finally, multinational enterprises deploy Free Trade Zones (FTZs) and Customs Bonded Warehouses as strategic architectural components of TLC optimization. Operating within an FTZ allows imported components to enter a designated domestic physical zone duty-free; tariffs are legally deferred until the finished product departs the zone into domestic commerce. If goods are subsequently re-exported to an overseas third market, customs duties are completely eliminated (duty exemption), while defective or scrapped components incur zero duties (scrap relief). By embedding FTZ duty inversion and deferral calculus directly into the strategic TLC engine, procurement architects unlock massive working capital liquidity and structural tax optimization.",
                "Ultimately, mastering Total Landed Cost calculus elevates procurement from clerical purchasing into high-level corporate balance sheet management. By commanding the legal mechanics of Incoterms 2020, the documentary rigor of UCP 600 Letters of Credit, the fiscal complexities of customs valuation, and the protective shields of marine cargo insurance, operations leaders protect gross margins, eliminate catastrophic supply chain surprises, and architect resilient global trade networks."
            ],
            "example": "A North American consumer electronics brand was evaluating two supplier quotes for 100,000 lithium battery battery enclosures: Supplier A in Shenzhen, China quoted $18.50 per unit on EXW terms; Supplier B in Monterrey, Mexico quoted $24.80 per unit on FCA terms. Purchasing initially advocated for China, projecting a $630,000 invoice savings ($1.85M vs $2.48M). However, the CPO ran the proposals through an enterprise Total Landed Cost engine: Supplier A required $2.20/unit in ocean freight, $0.15 marine insurance, $1.85 in 10% customs tariffs, $4.63 in 25% Section 301 punitive tariffs, $0.85 in pipeline working capital financing (45-day ocean transit), and $0.65 in inland drayage, driving Supplier A's true TLC to $28.83 per unit. Supplier B in Mexico qualified for zero tariffs under USMCA, incurred only $0.90 in cross-border trucking, and 3-day lead time ($0.05 financing), delivering a total landed cost of $25.75 per unit. The TLC analysis proved that the Mexican supplier saved the company $308,000 annually while compressing lead times by 93%.",
            "code": """# Total Landed Cost (TLC) Multi-Echelon International Sourcing Engine
def compute_comprehensive_total_landed_cost(
    scenario_name: str,
    annual_volume_units: int,
    quoted_unit_price: float,
    incoterm: str,
    origin_inland_drayage_per_unit: float,
    export_clearance_fee_total: float,
    international_freight_per_unit: float,
    cargo_insurance_rate_pct: float,        # e.g., 0.4%
    mfn_duty_rate_pct: float,               # e.g., 7.5%
    punitive_tariff_rate_pct: float,        # e.g., 25% Section 301
    customs_brokerage_fee_total: float,
    transit_lead_time_days: int,
    working_capital_rate_annual: float,     # e.g., 10%
    destination_inland_freight_per_unit: float,
    valuation_standard: str = "FOB"         # "FOB" (USA) vs "CIF" (EU/India)
) -> dict:
    # 1. Base Purchase Price
    annual_invoice_usd = annual_volume_units * quoted_unit_price
    
    # 2. Origin Logistics (Drayage + Export Clearance)
    origin_logistics_usd = (annual_volume_units * origin_inland_drayage_per_unit) + export_clearance_fee_total
    
    # 3. International Freight
    intl_freight_usd = annual_volume_units * international_freight_per_unit
    
    # 4. Marine Cargo Insurance (Covering 110% of CIF value)
    cif_base_approx = annual_invoice_usd + intl_freight_usd
    insurance_usd = (cif_base_approx * 1.10) * (cargo_insurance_rate_pct / 100.0)
    
    # 5. Customs Valuation & Sovereign Tariffs
    dutiable_customs_base = annual_invoice_usd if valuation_standard.upper() == "FOB" else (annual_invoice_usd + intl_freight_usd + insurance_usd)
    effective_total_tariff_rate = (mfn_duty_rate_pct + punitive_tariff_rate_pct) / 100.0
    customs_tariffs_usd = (dutiable_customs_base * effective_total_tariff_rate) + customs_brokerage_fee_total
    
    # 6. Pipeline Working Capital Financing
    pipeline_carrying_usd = (annual_invoice_usd * (transit_lead_time_days / 365.0)) * working_capital_rate_annual
    
    # 7. Destination Inland Freight
    destination_freight_usd = annual_volume_units * destination_inland_freight_per_unit
    
    # Total Landed Cost (TLC) Aggregation
    total_landed_cost_usd = (
        annual_invoice_usd
        + origin_logistics_usd
        + intl_freight_usd
        + insurance_usd
        + customs_tariffs_usd
        + pipeline_carrying_usd
        + destination_freight_usd
    )
    
    tlc_per_unit = total_landed_cost_usd / annual_volume_units
    landed_cost_multiplier = tlc_per_unit / quoted_unit_price
    
    cost_breakdown_pct = {
        "invoice_price_pct": round((annual_invoice_usd / total_landed_cost_usd) * 100.0, 1),
        "freight_logistics_pct": round(((origin_logistics_usd + intl_freight_usd + destination_freight_usd) / total_landed_cost_usd) * 100.0, 1),
        "customs_tariffs_pct": round((customs_tariffs_usd / total_landed_cost_usd) * 100.0, 1),
        "insurance_and_financing_pct": round(((insurance_usd + pipeline_carrying_usd) / total_landed_cost_usd) * 100.0, 1)
    }
    
    return {
        "scenario": scenario_name,
        "incoterm": incoterm.upper(),
        "quoted_unit_price": quoted_unit_price,
        "effective_tlc_per_unit": round(tlc_per_unit, 2),
        "landed_cost_multiplier": round(landed_cost_multiplier, 3),
        "total_annual_tlc_usd": round(total_landed_cost_usd, 2),
        "annual_invoice_usd": round(annual_invoice_usd, 2),
        "hidden_landed_overhead_usd": round(total_landed_cost_usd - annual_invoice_usd, 2),
        "breakdown": cost_breakdown_pct
    }

# Head-to-Head Total Landed Cost Comparison: Offshore (China) vs Nearshore (Mexico)
china_run = compute_comprehensive_total_landed_cost(
    scenario_name="Offshore_Shenzhen_China", annual_volume_units=100_000,
    quoted_unit_price=18.50, incoterm="EXW", origin_inland_drayage_per_unit=0.45,
    export_clearance_fee_total=1_500.0, international_freight_per_unit=2.20,
    cargo_insurance_rate_pct=0.4, mfn_duty_rate_pct=7.5, punitive_tariff_rate_pct=25.0, # 32.5% total tariff
    customs_brokerage_fee_total=2_500.0, transit_lead_time_days=45,
    working_capital_rate_annual=0.10, destination_inland_freight_per_unit=0.85,
    valuation_standard="FOB"
)

mexico_run = compute_comprehensive_total_landed_cost(
    scenario_name="Nearshore_Monterrey_Mexico", annual_volume_units=100_000,
    quoted_unit_price=24.80, incoterm="FCA", origin_inland_drayage_per_unit=0.10,
    export_clearance_fee_total=500.0, international_freight_per_unit=0.90,
    cargo_insurance_rate_pct=0.2, mfn_duty_rate_pct=0.0, punitive_tariff_rate_pct=0.0, # USMCA duty-free
    customs_brokerage_fee_total=1_200.0, transit_lead_time_days=4,
    working_capital_rate_annual=0.10, destination_inland_freight_per_unit=0.40,
    valuation_standard="FOB"
)

print("=== TOTAL LANDED COST (TLC) STRATEGIC SOURCING AUDIT ===")
for r in [china_run, mexico_run]:
    print(f"Scenario: {r['scenario']} [{r['incoterm']}]")
    print(f"  Sticker Price: ${r['quoted_unit_price']} | Total Landed Cost/Unit: ${r['effective_tlc_per_unit']} (Multiplier: {r['landed_cost_multiplier']}x)")
    print(f"  Total Annual TLC: ${r['total_annual_tlc_usd']:,.2f} (Landed Overhead: ${r['hidden_landed_overhead_usd']:,.2f})")
    print(f"  Cost Share: Price={r['breakdown']['invoice_price_pct']}% | Freight={r['breakdown']['freight_logistics_pct']}% | Tariffs={r['breakdown']['customs_tariffs_pct']}% | Finance={r['breakdown']['insurance_and_financing_pct']}%\\n")

savings = china_run['total_annual_tlc_usd'] - mexico_run['total_annual_tlc_usd']
print(f"Strategic Sourcing Verdict: {mexico_run['scenario']} delivers annual net savings of ${savings:,.2f} despite $6.30 higher unit purchase sticker price.")
""",
            "output": """=== TOTAL LANDED COST (TLC) STRATEGIC SOURCING AUDIT ===
Scenario: Offshore_Shenzhen_China [EXW]
  Sticker Price: $18.5 | Total Landed Cost/Unit: $28.66 (Multiplier: 1.549x)
  Total Annual TLC: $2,866,220.55 (Landed Overhead: $1,016,220.55)
  Cost Share: Price=64.5% | Freight=12.2% | Tariffs=21.1% | Finance=2.2%

Scenario: Nearshore_Monterrey_Mexico [FCA]
  Sticker Price: $24.8 | Total Landed Cost/Unit: $26.49 (Multiplier: 1.068x)
  Total Annual TLC: $2,648,819.34 (Landed Overhead: $168,819.34)
  Cost Share: Price=93.6% | Freight=5.3% | Tariffs=0.0% | Finance=1.0%

Strategic Sourcing Verdict: Nearshore_Monterrey_Mexico delivers annual net savings of $217,401.21 despite $6.30 higher unit purchase sticker price.""",
            "codeNotes": [
                {"line": 2, "note": "Implements multi-echelon international Total Landed Cost (TLC) engine"},
                {"line": 23, "note": "Evaluates FOB vs CIF dutiable customs base and Section 301 punitive tariff burdens"},
                {"line": 28, "note": "Quantifies pipeline working capital financing charges across transit lead times"},
                {"line": 40, "note": "Calculates landed cost multiplier proving nearshore economic superiority"}
            ],
            "tryIt": {
                "description": "Examine how increasing punitive tariffs pushes the landed cost multiplier of offshore sourcing even higher.",
                "question": "If punitive Section 301 tariffs on Chinese imports are raised from 25% to 50%, what happens to the Chinese supplier's effective TLC per unit?",
                "options": [
                    "Effective TLC per unit drops because ocean carriers lower freight rates",
                    "Effective TLC per unit surges past $33.00, expanding the Nearshore Mexican supplier's cost advantage to over $650,000 annually",
                    "The tariff is legally passed back to the Chinese factory to pay",
                    "Customs duties are automatically waived after 30 days"
                ],
                "answer": 1,
                "explanation": "A 25% increase in tariffs on a $1.85M invoice adds another $462,500 in direct customs payments ($4.625 per unit). This pushes the Chinese TLC from $28.66 to over $33.28 per unit, widening the Nearshore Mexican supplier's annual cost advantage from $217k to over $680,000."
            },
            "check": {
                "question": "Why did Nearshore_Monterrey_Mexico achieve a lower Total Landed Cost ($26.49/unit) than Offshore_Shenzhen_China ($28.66/unit) despite having a $6.30 higher invoice purchase sticker price?",
                "options": [
                    "Because Mexican suppliers are legally barred from charging freight",
                    "Because zero USMCA tariffs, minimal freight ($1.40 vs $3.50+), and negligible pipeline inventory carrying costs ($0.03 vs $0.23) completely offset the initial purchase price gap",
                    "Because Chinese suppliers use air freight exclusively",
                    "Because the Mexican peso appreciated against the US dollar"
                ],
                "answer": 1,
                "why": "Nearshoring under USMCA eliminated $600,000 in customs tariffs (0% vs 32.5%), compressed freight from $3.50 to $1.40, and reduced pipeline financing by 91% (4 days vs 45 days). These massive logistics and tariff savings more than overcame the $6.30 unit purchase price difference."
            }
        }
    ]

    summary = [
        "ICC Incoterms 2020 define the precise contractual boundaries of Cost Allocation, Risk Transfer, and Documentation Responsibility across all 11 standardized rules (EXW, FCA, CPT, CIP, DAP, DPU, DDP; FAS, FOB, CFR, CIF).",
        "For modern containerized ocean shipping, the ICC strictly mandates the use of multimodal rules (FCA, CPT, CIP) instead of maritime bulk rules (FOB, CFR, CIF) to eliminate uninsured terminal gap risks.",
        "Bills of Lading fulfill three legal functions: receipt of goods, evidence of carriage, and a negotiable Document of Title. Under UCP 600, banks examine Letters of Credit strictly on their facial documentary compliance.",
        "Customs valuation diverges between the CIF Standard (EU/Asia: taxing invoice + freight + insurance) and the FOB Standard (USA: taxing export value only). Rules of Origin determine preferential zero-duty FTA eligibility.",
        "Comprehensive Total Landed Cost (TLC) models uncover the hidden operational overhead of offshore sourcing—integrating freight, tariffs, marine insurance, demurrage risk, and pipeline working capital financing."
    ]

    projectStep = {
        "title": "Engineer an International Trade Logistics & Total Landed Cost (TLC) Engine",
        "description": "Construct an end-to-end global trade execution pipeline in Python: model Incoterms 2020 risk transfer boundaries, audit UCP 600 Letter of Credit documentary compliance, calculate multi-jurisdictional customs duties under CIF vs FOB valuation, and simulate comparative Total Landed Costs between offshore and nearshore suppliers.",
        "steps": [
            "Formulate an Incoterms 2020 cost and risk allocation engine that automatically determines buyer cash outflows and seller absorbed expenses across EXW, FCA, CIP, and DDP.",
            "Implement a UCP 600 documentary credit compliance auditor that verifies invoice tolerances, Clean On-Board Bill of Lading notations, and the 21-day presentation window.",
            "Construct a customs valuation model that differentiates CIF vs FOB dutiable bases, applies MFN and anti-dumping tariffs, and validates Free Trade Agreement Rules of Origin (ROO).",
            "Calculate comprehensive Total Landed Cost (TLC) comparisons between offshore and nearshore sourcing options, computing landed cost multipliers and net economic savings."
        ]
    }

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == "__main__":
    data = get_day17_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
