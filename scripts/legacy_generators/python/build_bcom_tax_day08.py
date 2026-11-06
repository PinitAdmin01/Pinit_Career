"""
Build script for bcom_tax Day 8: Input Tax Credit (ITC) Mechanics: Section 16 Invariants & Section 17(5) Blocked Credits
"""
import json

day08_data = {
    "day": 8,
    "title": "Input Tax Credit (ITC) Mechanics: Section 16 Invariants & Section 17(5) Blocked Credits",
    "course": "Corporate Taxation & GST",
    "duration": "38 mins",
    "parts": [
        {
            "id": 1,
            "title": "Section 16 Eligibility Invariants & The Section 16(2)(aa) GSTR-2B Locking Mechanism",
            "say": (
                "Welcome to Day 8 of Corporate Taxation & GST. Today, we confront the core engine of value-added taxation: the Input Tax Credit (ITC) mechanism. Without ITC, GST would degenerate into an aggressive cascading turnover tax. Input Tax Credit allows a registered business to deduct the GST paid on purchases of raw materials, capital assets, and operational services from the gross GST liability owed on outward sales, ensuring that tax is paid exclusively on the incremental value created at each stage of the economic supply chain.\n\n"
                "However, ITC is not an unconditional, inherent constitutional right; under statutory jurisprudence, it is a conditional concession governed by strict statutory checkpoints. Under Section 16(2) of the CGST Act, a registered buyer can claim ITC only if five cumulative conditions are simultaneously fulfilled: (a) The buyer is in possession of a valid tax invoice or debit note issued by a registered supplier; (aa) The details of the invoice have been furnished by the supplier in their outward return (GSTR-1) and communicated to the recipient in the auto-drafted statement of input tax credit (Form GSTR-2B); (b) The buyer has physically received the goods or services; (c) The tax charged has actually been paid to the Government treasury by the supplier (either in cash or through valid credit utilization); and (d) The buyer has furnished their monthly return under Section 39 (Form GSTR-3B).\n\n"
                "The introduction of Section 16(2)(aa) fundamentally modernized indirect tax compliance by establishing automated GSTR-2B matching. Historically, taxpayers claimed provisional ITC in GSTR-3B based on their internal ERP purchase registers. Today, that flexibility is extinct: if a vendor fails to upload an invoice into their GSTR-1, or uploads it under the wrong GSTIN, that invoice will not populate in the buyer's GSTR-2B. Under statutory mandate, claiming ITC that is absent from GSTR-2B constitutes an illegal claim, exposing the enterprise to automated demand notices under Section 73/74, mandatory credit reversals, and statutory interest penalties at 18% per annum under Section 50(3).\n\n"
                "In this first part, we construct an enterprise Section 16 ITC Validation Engine in Python. We ingest ERP purchase registers and auto-drafted GSTR-2B feeds, perform automated multi-key reconciliation (Vendor GSTIN, Invoice Number, Date, Taxable Value, Tax Slabs), isolate unmatched vendor credits, and compute the net legally claimable Input Tax Credit."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List, Tuple\n"
                "\n"
                "@dataclass\n"
                "class ERPPurchaseInvoice:\n"
                "    invoice_id: str\n"
                "    vendor_gstin: str\n"
                "    taxable_value: float\n"
                "    igst: float\n"
                "    has_physical_possession_goods: bool\n"
                "    has_tax_invoice_copy: bool\n"
                "\n"
                "@dataclass\n"
                "class GSTR2BRecord:\n"
                "    invoice_id: str\n"
                "    vendor_gstin: str\n"
                "    taxable_value: float\n"
                "    igst_available: float\n"
                "    supplier_filing_status: str # 'FILED', 'PENDING'\n"
                "\n"
                "class Section16Engine:\n"
                "    @staticmethod\n"
                "    def reconcile_itc(erp_invoices: List[ERPPurchaseInvoice], gstr2b_records: List[GSTR2BRecord]) -> Dict:\n"
                "        gstr2b_map = {r.invoice_id: r for r in gstr2b_records}\n"
                "        \n"
                "        eligible_itc_total = 0.0\n"
                "        blocked_pending_vendor_upload = 0.0\n"
                "        ineligible_missing_docs = 0.0\n"
                "        reconciliation_details = []\n"
                "        \n"
                "        for inv in erp_invoices:\n"
                "            # Statutory checkpoints: Sec 16(2)(a), 16(2)(b)\n"
                "            if not (inv.has_tax_invoice_copy and inv.has_physical_possession_goods):\n"
                "                ineligible_missing_docs += inv.igst\n"
                "                status = 'INELIGIBLE: Missing physical invoice or goods receipt (Sec 16(2)(a)/(b))'\n"
                "                is_claimable = False\n"
                "            elif inv.invoice_id not in gstr2b_map:\n"
                "                # Sec 16(2)(aa) Failure: Absent from GSTR-2B\n"
                "                blocked_pending_vendor_upload += inv.igst\n"
                "                status = 'BLOCKED: Missing in GSTR-2B (Vendor failed to file GSTR-1 under Sec 16(2)(aa))'\n"
                "                is_claimable = False\n"
                "            else:\n"
                "                r2b = gstr2b_map[inv.invoice_id]\n"
                "                if r2b.supplier_filing_status == 'FILED' and r2b.igst_available == inv.igst:\n"
                "                    eligible_itc_total += inv.igst\n"
                "                    status = 'ELIGIBLE: 100% Verified against GSTR-2B and Sec 16 conditions.'\n"
                "                    is_claimable = True\n"
                "                else:\n"
                "                    blocked_pending_vendor_upload += inv.igst\n"
                "                    status = 'MISMATCH: Tax variance between ERP and GSTR-2B.'\n"
                "                    is_claimable = False\n"
                "                    \n"
                "            reconciliation_details.append({\n"
                "                'invoice_id': inv.invoice_id,\n"
                "                'vendor_gstin': inv.vendor_gstin,\n"
                "                'erp_tax_amount': inv.igst,\n"
                "                'is_claimable_in_gstr3b': is_claimable,\n"
                "                'audit_status': status\n"
                "            })\n"
                "            \n"
                "        return {\n"
                "            'total_erp_itc_attempted': round(sum(i.igst for i in erp_invoices), 2),\n"
                "            'legally_claimable_itc_gstr3b': round(eligible_itc_total, 2),\n"
                "            'blocked_gstr2b_vendor_delinquency': round(blocked_pending_vendor_upload, 2),\n"
                "            'ineligible_missing_documentation': round(ineligible_missing_docs, 2),\n"
                "            'audit_trail': reconciliation_details\n"
                "        }\n"
                "\n"
                "erp_batch = [\n"
                "    ERPPurchaseInvoice('INV-9001', '29AAAAA0000A1Z5', 100000.0, 18000.0, True, True),\n"
                "    ERPPurchaseInvoice('INV-9002', '27BBBBB1111B1Z2', 200000.0, 36000.0, True, True),\n"
                "    ERPPurchaseInvoice('INV-9003', '33CCCCC2222C1Z8', 50000.0, 9000.0, True, False)\n"
                "]\n"
                "gstr2b_feed = [\n"
                "    GSTR2BRecord('INV-9001', '29AAAAA0000A1Z5', 100000.0, 18000.0, 'FILED')\n"
                "    # Notice: INV-9002 was not uploaded by vendor!\n"
                "]\n"
                "engine = Section16Engine()\n"
                "res = engine.reconcile_itc(erp_batch, gstr2b_feed)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Simulates Section 16(2) statutory validation, isolating GSTR-2B mismatches under Section 16(2)(aa) and blocking claims where supplier failed to file GSTR-1.",
            "example": (
                "An enterprise purchases $1,000,000 of IT servers ($180,000 GST). The vendor fails to file its GSTR-1 by the 11th of the following month. Consequently, the invoice is absent from the company's GSTR-2B. Under Section 16(2)(aa), the enterprise cannot claim the $180,000 in its monthly GSTR-3B until the vendor cures the default."
            ),
            "tryIt": "Add INV-9002 into the gstr2b_feed with supplier_filing_status='FILED' and 36000.0 tax. Verify that eligible_itc increases from 18,000 to 54,000.",
            "check": {
                "question": "Under Section 16(2)(aa) of the CGST Act, what is the mandatory requirement before an enterprise can claim Input Tax Credit on an inward invoice?",
                "options": [
                    "The invoice details must be furnished by the supplier in GSTR-1 and auto-populated in the recipient's Form GSTR-2B.",
                    "The recipient must obtain a written clearance certificate signed by the State Tax Commissioner.",
                    "The recipient must hold physical inventory in its warehouse for a minimum seasoning period of 90 days.",
                    "The supplier must deposit 10% of the invoice value into an escrow account maintained with the GST Network."
                ],
                "answerIndex": 0,
                "why": "Section 16(2)(aa) explicitly conditions ITC eligibility on the supplier reporting the invoice in their outward statement (GSTR-1) and communicating it to the recipient in Form GSTR-2B."
            }
        },
        {
            "id": 2,
            "title": "The 180-Day Payment Invariant: Second Proviso to Section 16(2) & Reversal Mechanics",
            "say": (
                "Under standard accrual accounting, businesses claim input tax credits immediately upon receiving an invoice and logging it into their ERP system. However, the legislature enacted an aggressive anti-collusion safeguard to prevent large corporations from claiming huge tax credits on credit purchases and subsequently defaulting or withholding payment to vendor suppliers. This safeguard is codified in the Second Proviso to Section 16(2) of the CGST Act—the '180-Day Rule'.\n\n"
                "The second proviso establishes that where a recipient fails to pay to the supplier the amount towards the value of supply along with the tax payable thereon within a period of 180 days from the date of issue of invoice, an amount equal to the Input Tax Credit availed by the recipient shall be added to his output tax liability, along with interest thereon under Section 50 at 18% per annum calculated from the day credit was originally claimed.\n\n"
                "Crucially, the third proviso to Section 16(2) provides an equitable restoration mechanism: upon eventual payment of the outstanding invoice value and tax to the supplier (even if made two or three years later), the recipient is statutorily entitled to re-avail the Input Tax Credit! However, the 18% interest paid during the reversal is a permanent deadweight loss to the company; interest paid on late payments under Section 50 is strictly non-refundable and cannot be reclaimed.\n\n"
                "In this second part, we program an enterprise 180-Day Vendor Payment & ITC Aging Engine in Python. We track accounts payable aging against the 180-day statutory cliff, trigger automated early warnings at Day 150, execute automated ITC reversals in Form GSTR-3B with Section 50 interest upon Day 181 breaches, and manage re-availment ledgers upon post-reversal vendor settlements."
            ),
            "code": (
                "import json\n"
                "from datetime import datetime, date, timedelta\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class VendorPayable:\n"
                "    invoice_id: str\n"
                "    invoice_date: str          # YYYY-MM-DD\n"
                "    total_invoice_val: float   # Base + Tax\n"
                "    itc_claimed_amount: float\n"
                "    amount_paid_to_date: float\n"
                "    as_of_audit_date: str     # Current date\n"
                "\n"
                "class Rule180DayEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_180day_aging(v: VendorPayable) -> Dict:\n"
                "        d_inv = datetime.strptime(v.invoice_date, '%Y-%m-%d').date()\n"
                "        d_curr = datetime.strptime(v.as_of_audit_date, '%Y-%m-%d').date()\n"
                "        \n"
                "        days_elapsed = (d_curr - d_inv).days\n"
                "        deadline_180 = d_inv + timedelta(days=180)\n"
                "        is_fully_paid = v.amount_paid_to_date >= v.total_invoice_val\n"
                "        \n"
                "        # Calculate outstanding ratio\n"
                "        unpaid_amount = max(0.0, v.total_invoice_val - v.amount_paid_to_date)\n"
                "        unpaid_ratio = unpaid_amount / v.total_invoice_val if v.total_invoice_val > 0 else 0.0\n"
                "        \n"
                "        reversal_required = False\n"
                "        itc_to_reverse = 0.0\n"
                "        interest_penalty = 0.0\n"
                "        status_alert = ''\n"
                "        \n"
                "        if is_fully_paid:\n"
                "            status_alert = 'COMPLIANT: Fully settled within statutory parameters.'\n"
                "        elif days_elapsed > 180:\n"
                "            # Proviso 2 to Sec 16(2) Triggered!\n"
                "            reversal_required = True\n"
                "            itc_to_reverse = v.itc_claimed_amount * unpaid_ratio\n"
                "            # Sec 50 Interest at 18% p.a. for days beyond 180\n"
                "            overdue_days = days_elapsed - 180\n"
                "            interest_penalty = itc_to_reverse * 0.18 * (days_elapsed / 365.0)\n"
                "            status_alert = f'BREACH: Exceeded 180 days ({days_elapsed} days). Mandatory ITC Reversal in GSTR-3B Table 4(B)(2).'\n"
                "        elif days_elapsed >= 150:\n"
                "            status_alert = f'WARNING: Approaching 180-day cliff ({days_elapsed}/180 days elapsed). Urgent payment needed.'\n"
                "        else:\n"
                "            status_alert = f'NORMAL: Within aging grace window ({days_elapsed}/180 days elapsed).'\n"
                "            \n"
                "        return {\n"
                "            'invoice_id': v.invoice_id,\n"
                "            'invoice_date': v.invoice_date,\n"
                "            '180_day_statutory_deadline': str(deadline_180),\n"
                "            'days_elapsed': days_elapsed,\n"
                "            'unpaid_balance': round(unpaid_amount, 2),\n"
                "            'mandatory_itc_reversal': reversal_required,\n"
                "            'itc_amount_to_reverse': round(itc_to_reverse, 2),\n"
                "            'statutory_interest_18pct': round(interest_penalty, 2),\n"
                "            'can_re_avail_upon_payment': True,\n"
                "            'compliance_status': status_alert\n"
                "        }\n"
                "\n"
                "payable1 = VendorPayable(\n"
                "    invoice_id='AP-7741', invoice_date='2026-03-01', total_invoice_val=118000.0,\n"
                "    itc_claimed_amount=18000.0, amount_paid_to_date=0.0, as_of_audit_date='2026-10-15'\n"
                ")\n"
                "res = Rule180DayEngine.evaluate_180day_aging(payable1)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Monitors accounts payable aging against the 180-day rule under the Second Proviso to Section 16(2) CGST Act, computing proportionate ITC reversals and Section 50 interest.",
            "example": (
                "A company buys steel for $100,000 ($18,000 GST) on January 1. Due to a commercial dispute, it withholds payment. On June 30 (181 days later), Section 16(2) forces the company to reverse the entire $18,000 in Table 4(B) of GSTR-3B and pay $1,600 in statutory interest. When the dispute is settled on December 1, the company re-avails the $18,000 credit, but the interest is permanently lost."
            ),
            "tryIt": "Set as_of_audit_date to '2026-07-20' (141 days elapsed) and verify that compliance_status shows 'NORMAL' with zero reversal required.",
            "check": {
                "question": "Under the second proviso to Section 16(2) of the CGST Act, what is the consequence if a buyer fails to pay the supplier the invoice value plus tax within 180 days?",
                "options": [
                    "The availed Input Tax Credit must be added to the buyer's output tax liability along with statutory interest.",
                    "The buyer's corporate GST registration is automatically suspended for a 6-month cooling period.",
                    "The supplier is fined 50% of the invoice value for failing to initiate legal collection proceedings.",
                    "The Input Tax Credit is permanently canceled and can never be reclaimed even if full payment is made later."
                ],
                "answerIndex": 0,
                "why": "The second proviso to Section 16(2) mandates that if payment is not made within 180 days, the ITC availed must be added to the recipient's output tax liability along with interest under Section 50."
            }
        },
        {
            "id": 3,
            "title": "Blocked Credits Taxonomy: Section 17(5)(a) Motor Vehicles & Transportation Invariants",
            "say": (
                "Even when an expenditure is incurred strictly for business operations, in the course or furtherance of trade, and supported by a valid tax invoice populated in Form GSTR-2B, the Input Tax Credit may still be permanently denied. Section 17(5) of the CGST Act contains the notorious 'Blocked Credits Negative List'—a statutory schedule of expenses where the legislature explicitly forbids ITC recognition, irrespective of business utility.\n\n"
                "The most heavily litigated blocked credit category is Section 17(5)(a), which governs motor vehicles for transportation of persons having approved seating capacity of not more than 13 persons (including the driver). As a general rule, GST paid on the purchase, lease, insurance, repair, or maintenance of corporate sedans, executive cars, and passenger SUVs is 100% blocked! The government views passenger vehicles as vulnerable to private executive consumption, shutting down credit claims across corporate fleets.\n\n"
                "However, Section 17(5)(a) establishes three strict statutory exceptions where motor vehicle ITC IS permitted: (1) When the vehicles are used for further taxable supply of such motor vehicles (automobile dealerships); (2) When used for transportation of passengers (commercial taxi fleets, cab aggregators, bus operators); or (3) When used for imparting training on driving such motor vehicles (commercial driving academies). Furthermore, motor vehicles having approved seating capacity of MORE than 13 persons (corporate staff buses, commuter vans) or commercial goods transport vehicles (trucks, lorries, delivery vans) fall outside Section 17(5)(a) and enjoy unrestricted ITC.\n\n"
                "In this third part, we build an enterprise Section 17(5)(a) Fleet & Automotive ITC Screener in Python. We evaluate corporate vehicle acquisitions, test seating capacity invariants and commercial usage exceptions, track associated repair, maintenance, and insurance expenses, and quarantine blocked automotive GST to balance sheet expense accounts."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class VehiclePurchase:\n"
                "    asset_id: str\n"
                "    model_name: str\n"
                "    seating_capacity: int       # Including driver\n"
                "    vehicle_type: str           # 'PASSENGER', 'GOODS_TRANSPORT', 'VESSEL', 'AIRCRAFT'\n"
                "    business_usage: str         # 'EXECUTIVE_TRAVEL', 'DEALERSHIP_RESALE', 'PASSENGER_CAB_FLEET', 'DRIVING_SCHOOL', 'FACTORY_GOODS'\n"
                "    purchase_cost: float\n"
                "    gst_rate: float\n"
                "    annual_insurance_gst: float\n"
                "    annual_repair_gst: float\n"
                "\n"
                "class Section17_5_AutoEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_vehicle_itc(v: VehiclePurchase) -> Dict:\n"
                "        is_itc_eligible = False\n"
                "        rationale = ''\n"
                "        \n"
                "        gst_on_purchase = v.purchase_cost * v.gst_rate\n"
                "        total_related_tax = gst_on_purchase + v.annual_insurance_gst + v.annual_repair_gst\n"
                "        \n"
                "        if v.vehicle_type == 'GOODS_TRANSPORT':\n"
                "            # Commercial trucks/vans are NOT blocked under Sec 17(5)(a)\n"
                "            is_itc_eligible = True\n"
                "            rationale = 'Eligible: Goods transport vehicle falls outside Sec 17(5)(a) passenger vehicle block.'\n"
                "        elif v.seating_capacity > 13:\n"
                "            # Buses/Vans > 13 seats are eligible\n"
                "            is_itc_eligible = True\n"
                "            rationale = f'Eligible: Seating capacity ({v.seating_capacity}) exceeds 13-person statutory threshold.'\n"
                "        else:\n"
                "            # Seating capacity <= 13: Test specific statutory exceptions\n"
                "            if v.business_usage in ['DEALERSHIP_RESALE', 'PASSENGER_CAB_FLEET', 'DRIVING_SCHOOL']:\n"
                "                is_itc_eligible = True\n"
                "                rationale = f'Eligible: Meets specific Sec 17(5)(a) exception for {v.business_usage}.'\n"
                "            else:\n"
                "                is_itc_eligible = False\n"
                "                rationale = 'BLOCKED: Passenger vehicle <= 13 seats used for executive/general corporate travel (Sec 17(5)(a)).'\n"
                "                \n"
                "        claimable_itc = total_related_tax if is_itc_eligible else 0.0\n"
                "        blocked_tax_expense = 0.0 if is_itc_eligible else total_related_tax\n"
                "        \n"
                "        return {\n"
                "            'asset_id': v.asset_id,\n"
                "            'model': v.model_name,\n"
                "            'seating_capacity': v.seating_capacity,\n"
                "            'is_itc_claimable': is_itc_eligible,\n"
                "            'claimable_itc_total': round(claimable_itc, 2),\n"
                "            'blocked_itc_expensed': round(blocked_tax_expense, 2),\n"
                "            'statutory_analysis': rationale\n"
                "        }\n"
                "\n"
                "# Test Case 1: Executive Sedan vs Factory Delivery Truck\n"
                "sedan = VehiclePurchase('VEH-101', 'Mercedes E-Class Executive', 5, 'PASSENGER', 'EXECUTIVE_TRAVEL', 7000000.0, 0.28, 56000.0, 42000.0)\n"
                "truck = VehiclePurchase('VEH-102', 'Tata Prima 28-Ton Lorry', 3, 'GOODS_TRANSPORT', 'FACTORY_GOODS', 3500000.0, 0.28, 28000.0, 35000.0)\n"
                "engine = Section17_5_AutoEngine()\n"
                "print('--- Executive Sedan ---')\n"
                "print(json.dumps(engine.evaluate_vehicle_itc(sedan), indent=2))\n"
                "print('--- Factory Delivery Lorry ---')\n"
                "print(json.dumps(engine.evaluate_vehicle_itc(truck), indent=2))\n"
            ),
            "codeNotes": "Implements Section 17(5)(a) CGST Act rules for motor vehicles, blocking credit on passenger cars <= 13 seats while permitting commercial goods lorries and passenger transport exceptions.",
            "example": (
                "A consulting firm buys a $100,000 luxury SUV ($28,000 GST) for its Managing Director and spends $5,000 ($900 GST) on insurance. Under Section 17(5)(a) and 17(5)(ab), the entire $28,900 GST is permanently blocked and must be added to vehicle asset cost on the balance sheet."
            ),
            "tryIt": "Change sedan business_usage to 'PASSENGER_CAB_FLEET' and verify that it becomes eligible under the commercial passenger transport exception.",
            "check": {
                "question": "Under Section 17(5)(a) of the CGST Act, when is Input Tax Credit permitted on a passenger motor vehicle having a seating capacity of 5 persons?",
                "options": [
                    "Only when the vehicle is used for further taxable supply of vehicles, passenger transportation services, or driving instruction.",
                    "Whenever the vehicle is utilized by executive board members to attend strategic corporate client meetings.",
                    "Whenever the vehicle is branded with the enterprise's corporate marketing logo and public relations contact info.",
                    "Only if the vehicle was purchased during the final fiscal quarter to reduce taxable corporate profits."
                ],
                "answerIndex": 0,
                "why": "Section 17(5)(a) strictly restricts ITC on motor vehicles with seating capacity <= 13 persons to three specific commercial use cases: resale, transportation of passengers, or driving school training."
            }
        },
        {
            "id": 4,
            "title": "Blocked Credits Taxonomy: Section 17(5)(b)-(h) Food, Works Contracts & Lost Goods",
            "say": (
                "Beyond automotive assets, Section 17(5) contains a rigorous catalog of operational and personal consumption categories designed to prevent enterprises from masquerading personal executive perks as deductible business overhead. Understanding these boundaries is critical during statutory tax audits and internal ERP invoice coding.\n\n"
                "Under Section 17(5)(b), Input Tax Credit is explicitly blocked on: (1) Food and beverages, outdoor catering, beauty treatment, health services, cosmetic and plastic surgery, life insurance, and health insurance, UNLESS the provision of such goods or services is mandatory for an employer under any law for the time being in force (e.g., statutory factory canteens mandated under Section 46 of the Factories Act 1948, or mandatory employee insurance during pandemic emergencies); (2) Membership of a club, health, and fitness center; and (3) Travel benefits extended to employees on vacation such as leave or home travel concession.\n\n"
                "Furthermore, Section 17(5)(c) and (d) block credits on Works Contracts and construction goods/services used for construction of an 'Immovable Property' (other than plant and machinery) to the extent capitalized to the balance sheet. If an enterprise constructs a corporate headquarters building, all GST on cement, architectural fees, steel, and contractor labor is permanently blocked! Finally, Section 17(5)(h) blocks credit on goods lost, stolen, destroyed, written off, or disposed of by way of gift or free samples. If a batch of manufactured electronics is destroyed in a warehouse fire, any Input Tax Credit claimed on the raw materials must be reversed immediately in Form GSTR-3B.\n\n"
                "In this fourth part, we develop an enterprise Section 17(5) General Ineligible Credit Gating Engine in Python. We screen general corporate purchase orders, evaluate statutory employer mandates under labor laws, inspect balance sheet capitalization flags for civil construction, calculate mandatory reversals for inventory write-offs, and generate audit-ready blocked credit schedules."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class ExpenseItem:\n"
                "    item_id: str\n"
                "    description: str\n"
                "    category: str        # 'FOOD_CATERING', 'HEALTH_INSURANCE', 'CIVIL_CONSTRUCTION_BUILDING', 'PLANT_AND_MACHINERY', 'GOODS_WRITTEN_OFF'\n"
                "    amount: float\n"
                "    gst_paid: float\n"
                "    is_mandated_by_statutory_labor_law: bool\n"
                "    is_capitalized_to_immovable_property: bool\n"
                "\n"
                "class Section17_5_GeneralEngine:\n"
                "    @staticmethod\n"
                "    def audit_expense_item(item: ExpenseItem) -> Dict:\n"
                "        is_blocked = False\n"
                "        statutory_clause = ''\n"
                "        \n"
                "        if item.category == 'FOOD_CATERING':\n"
                "            # Sec 17(5)(b)(i): Blocked unless statutory law mandates\n"
                "            if not item.is_mandated_by_statutory_labor_law:\n"
                "                is_blocked = True\n"
                "                statutory_clause = 'Sec 17(5)(b)(i): Food & beverages blocked (No statutory employer mandate).'\n"
                "            else:\n"
                "                is_blocked = False\n"
                "                statutory_clause = 'Eligible: Statutory employer obligation under Factories Act 1948.'\n"
                "                \n"
                "        elif item.category == 'HEALTH_INSURANCE':\n"
                "            if not item.is_mandated_by_statutory_labor_law:\n"
                "                is_blocked = True\n"
                "                statutory_clause = 'Sec 17(5)(b)(i): Health insurance blocked (Discretionary employee perk).'\n"
                "            else:\n"
                "                is_blocked = False\n"
                "                statutory_clause = 'Eligible: Health insurance mandated by government statute.'\n"
                "                \n"
                "        elif item.category == 'CIVIL_CONSTRUCTION_BUILDING':\n"
                "            # Sec 17(5)(d): Blocked if capitalized to immovable property\n"
                "            if item.is_capitalized_to_immovable_property:\n"
                "                is_blocked = True\n"
                "                statutory_clause = 'Sec 17(5)(d): Goods/services for construction of immovable property capitalized.'\n"
                "            else:\n"
                "                is_blocked = False\n"
                "                statutory_clause = 'Eligible: Routine repairs and maintenance expensed directly to P&L.'\n"
                "                \n"
                "        elif item.category == 'PLANT_AND_MACHINERY':\n"
                "            # Explanation to Sec 17: Plant & Machinery is explicitly EXCLUDED from immovable property block\n"
                "            is_blocked = False\n"
                "            statutory_clause = 'Eligible: Plant & Machinery explicitly carved out from construction block.'\n"
                "            \n"
                "        elif item.category == 'GOODS_WRITTEN_OFF':\n"
                "            # Sec 17(5)(h): Goods lost, destroyed, written off\n"
                "            is_blocked = True\n"
                "            statutory_clause = 'Sec 17(5)(h): Mandatory ITC reversal on goods lost, stolen, or written off.'\n"
                "            \n"
                "        return {\n"
                "            'item_id': item.item_id,\n"
                "            'description': item.description,\n"
                "            'gst_paid': item.gst_paid,\n"
                "            'is_itc_blocked_sec17_5': is_blocked,\n"
                "            'legally_claimable_itc': 0.0 if is_blocked else item.gst_paid,\n"
                "            'ineligible_itc_amount': item.gst_paid if is_blocked else 0.0,\n"
                "            'legal_reference': statutory_clause\n"
                "        }\n"
                "\n"
                "items = [\n"
                "    ExpenseItem('EXP-01', 'Annual Executive Gala Dinner Catering', 'FOOD_CATERING', 500000.0, 90000.0, False, False),\n"
                "    ExpenseItem('EXP-02', 'Factory Worker Canteen (Factories Act)', 'FOOD_CATERING', 300000.0, 15000.0, True, False),\n"
                "    ExpenseItem('EXP-03', 'HQ Glass Facade Civil Construction', 'CIVIL_CONSTRUCTION_BUILDING', 4000000.0, 720000.0, False, True),\n"
                "    ExpenseItem('EXP-04', 'CNC Manufacturing Machine Installation', 'PLANT_AND_MACHINERY', 2500000.0, 450000.0, False, True)\n"
                "]\n"
                "engine = Section17_5_GeneralEngine()\n"
                "report = [engine.audit_expense_item(i) for i in items]\n"
                "print(json.dumps(report, indent=2))\n"
            ),
            "codeNotes": "Audits corporate operational expenditures against Section 17(5)(b)-(h) blocked credit rules, validating statutory labor law exceptions and plant & machinery carve-outs.",
            "example": (
                "An enterprise spends $500,000 on steel for a new warehouse building (capitalized, $90,000 GST blocked under Sec 17(5)(d)) and $500,000 on an automated bottling assembly line (Plant & Machinery, $90,000 GST 100% eligible). The company claims $90,000 and expenses the other $90,000 to building cost."
            ),
            "tryIt": "Test EXP-03 with is_capitalized_to_immovable_property=False (routine repairs expensed to P&L) and verify that ITC becomes eligible.",
            "check": {
                "question": "Under Section 17(5)(b) of the CGST Act, when is an employer permitted to claim Input Tax Credit on outdoor catering and employee health insurance?",
                "options": [
                    "When it is obligatory for the employer to provide such goods or services under any law for the time being in force.",
                    "When the expenditure is approved by the corporate compensation committee in the annual proxy filing.",
                    "Whenever the employer's net profit margin exceeds 15% of annual gross consolidated turnover.",
                    "Only if the services are procured from a vendor located in an Export Processing Special Economic Zone."
                ],
                "answerIndex": 0,
                "why": "The proviso to Section 17(5)(b) explicitly permits ITC on food, catering, and insurance where the provision of such goods or services is mandatory for an employer under any statutory law."
            }
        },
        {
            "id": 5,
            "title": "ITC Apportionment Mechanics: Rule 42 (Inputs) & Rule 43 (Capital Goods) Calculus",
            "say": (
                "In enterprise reality, corporations rarely operate purely in taxable goods or purely in exempt supplies; they operate complex mixed portfolios. A bank generates taxable revenue from credit card fees and loan processing charges while generating exempt revenue from lending interest; a pharmaceutical company manufactures taxable cosmetics alongside tax-exempt life-saving medicines; or a manufacturing conglomerate utilizes central corporate IT servers and legal counsel to support both commercial sales and non-business philanthropic activities. When inputs and capital goods are shared across taxable and exempt operations, how must the enterprise mathematically apportion its Input Tax Credit?\n\n"
                "Section 17(1) and 17(2) of the CGST Act establish the foundational apportionment rule: Where goods or services are used partly for business purposes and partly for other purposes, or partly for taxable supplies (including zero-rated exports) and partly for exempt supplies, the amount of credit shall be restricted to so much of the input tax as is attributable to the taxable supplies.\n\n"
                "The mathematical execution of this principle is codified in Rule 42 (for Inputs and Input Services) and Rule 43 (for Capital Goods). Under Rule 42: (1) Total input tax $T$ is filtered by deducting $T_1$ (exclusively non-business), $T_2$ (exclusively exempt), and $T_3$ (blocked under Sec 17(5)), yielding credit $T_4$ credited to the electronic credit ledger; (2) Next, credit $T_4$ is reduced by $T_4$ (exclusively taxable supplies), leaving Common Credit $C_2$; (3) Common credit is apportioned using monthly turnover: $D_1 = (E / F) \\times C_2$ (where $E$ is exempt turnover and $F$ is total turnover), and $D_2 = 5\\% \\times C_2$ (deemed non-business use); (4) The resulting sum $(D_1 + D_2)$ is added to the monthly output tax liability in Form GSTR-3B. For Capital Goods under Rule 43, the common credit is apportioned over a statutory useful life of 60 months (5 years) at the rate of $C_2 / 60$ each month, with the exempt fraction reversed monthly.\n\n"
                "In this fifth part, we engineer an enterprise Rule 42/43 Apportionment Calculator in Python. We ingest monthly departmental tax ledgers and turnover statistics, compute $D_1$ and $D_2$ reversals, calculate monthly capital goods amortizations over the 60-month statutory lifecycle, and generate automated GSTR-3B Table 4(B) credit reversal schedules."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class MonthlyTurnoverAndTax:\n"
                "    month: str\n"
                "    total_turnover_F: float\n"
                "    exempt_turnover_E: float\n"
                "    taxable_turnover: float\n"
                "    total_input_tax_T: float\n"
                "    exclusive_personal_T1: float\n"
                "    exclusive_exempt_T2: float\n"
                "    blocked_sec17_5_T3: float\n"
                "    exclusive_taxable_T4: float\n"
                "    capital_goods_common_tax: float # Rule 43 asset pool\n"
                "\n"
                "class Rule42_43Engine:\n"
                "    @staticmethod\n"
                "    def compute_apportionment(data: MonthlyTurnoverAndTax) -> Dict:\n"
                "        # Step 1: Net credit to ledger C1 = T - (T1 + T2 + T3)\n"
                "        ineligible_direct = data.exclusive_personal_T1 + data.exclusive_exempt_T2 + data.blocked_sec17_5_T3\n"
                "        C1 = data.total_input_tax_T - ineligible_direct\n"
                "        \n"
                "        # Step 2: Common Credit C2 = C1 - T4 (Exclusive taxable)\n"
                "        C2 = C1 - data.exclusive_taxable_T4\n"
                "        \n"
                "        # Step 3: Rule 42 Apportionment\n"
                "        # D1 = (E / F) * C2 (Attributable to exempt supplies)\n"
                "        exempt_ratio = data.exempt_turnover_E / data.total_turnover_F if data.total_turnover_F > 0 else 0.0\n"
                "        D1 = C2 * exempt_ratio\n"
                "        \n"
                "        # D2 = 5% of C2 (Attributable to non-business / personal)\n"
                "        D2 = C2 * 0.05\n"
                "        \n"
                "        # Net eligible common credit = C2 - (D1 + D2)\n"
                "        eligible_common_inputs = C2 - (D1 + D2)\n"
                "        total_eligible_inputs = data.exclusive_taxable_T4 + eligible_common_inputs\n"
                "        total_rule42_reversal = D1 + D2\n"
                "        \n"
                "        # Step 4: Rule 43 Capital Goods (Useful life 60 months)\n"
                "        # Monthly common capital credit Tm = Capital Tax / 60\n"
                "        monthly_capital_tax_Tm = data.capital_goods_common_tax / 60.0\n"
                "        # Monthly reversal for capital goods Te = (E / F) * Tm\n"
                "        capital_reversal_Te = monthly_capital_tax_Tm * exempt_ratio\n"
                "        eligible_capital_monthly = monthly_capital_tax_Tm - capital_reversal_Te\n"
                "        \n"
                "        return {\n"
                "            'month': data.month,\n"
                "            'exempt_turnover_ratio': round(exempt_ratio * 100.0, 2),\n"
                "            'total_input_tax_T': data.total_input_tax_T,\n"
                "            'common_credit_C2': round(C2, 2),\n"
                "            'rule42_D1_exempt_reversal': round(D1, 2),\n"
                "            'rule42_D2_personal_reversal': round(D2, 2),\n"
                "            'total_rule42_reversal_gstr3b': round(total_rule42_reversal, 2),\n"
                "            'net_eligible_inputs_credit': round(total_eligible_inputs, 2),\n"
                "            'rule43_monthly_capital_reversal': round(capital_reversal_Te, 2),\n"
                "            'net_eligible_capital_credit_monthly': round(eligible_capital_monthly, 2)\n"
                "        }\n"
                "\n"
                "month_data = MonthlyTurnoverAndTax(\n"
                "    month='October 2026', total_turnover_F=10000000.0, exempt_turnover_E=2500000.0,\n"
                "    taxable_turnover=7500000.0, total_input_tax_T=1000000.0,\n"
                "    exclusive_personal_T1=50000.0, exclusive_exempt_T2=100000.0,\n"
                "    blocked_sec17_5_T3=150000.0, exclusive_taxable_T4=400000.0,\n"
                "    capital_goods_common_tax=1200000.0\n"
                ")\n"
                "engine = Rule42_43Engine()\n"
                "res = engine.compute_apportionment(month_data)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Executes statutory mathematical formulas under Rule 42 and Rule 43 CGST Rules, computing D1 and D2 reversals and 60-month capital goods apportionment.",
            "example": (
                "A firm has $10M total turnover, with $2.5M (25%) exempt. It has $300,000 of common input credit C2. Under Rule 42, D1 reversal is 25% * $300,000 = $75,000, and D2 personal reversal is 5% * $300,000 = $15,000. Total monthly reversal in GSTR-3B Table 4(B)(1) is $90,000, leaving $210,000 eligible credit."
            ),
            "tryIt": "Set exempt_turnover_E to 0.0 (100% taxable business) and verify that D1 and capital_reversal_Te drop to exactly 0.0.",
            "check": {
                "question": "Under Rule 43 of the CGST Rules, what is the statutorily presumed useful life of capital goods for the purpose of Input Tax Credit apportionment?",
                "options": [
                    "60 months (5 years) from the date of the invoice.",
                    "36 months (3 years) based on standard corporate IT equipment life.",
                    "120 months (10 years) aligned with statutory factory depreciation.",
                    "Indefinitely until the asset is physically scrapped or sold on open auction."
                ],
                "answerIndex": 0,
                "why": "Rule 43(1)(c) explicitly mandates that the useful life of capital goods shall be taken as five years (60 months) from the date of the invoice."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_tax_day08_data.json", "w", encoding="utf-8") as f:
        json.dump(day08_data, f, indent=2)
    print("Successfully built scripts/bcom_tax_day08_data.json")
