"""
Day 24 Builder: B2B E-Commerce & Wholesale Portals: Net Payment Terms, PunchOut Catalogs & Custom Contract Pricing
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-819
"""

import os
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day24():
    parts = []

    # Part 1: B2B vs B2C Commerce Dynamics: Complex Corporate Buying Centers, Hierarchical Account Roles, Multiple Shipping Addresses & Credit Limits
    p1_say = [
        "Welcome to Day 24 of B.Com E-Commerce and Digital Business. Today, we enter the largest segment of the digital commercial economy by transaction volume: Business-to-Business (B2B) E-Commerce and Enterprise Wholesale Portals. While Business-to-Consumer (B2C) e-commerce captures intense media attention with consumer retail shopping carts, global B2B digital commerce exceeds twenty trillion dollars annually—more than five times the size of global retail e-commerce. However, architecting a B2B digital commerce portal requires fundamentally different engineering principles than building a B2C storefront.",
        
        "In B2C commerce, purchasing is individual, emotional, and transactional: a single consumer browses a catalog, selects a product, pays instantly with a credit card, and dispatches the parcel to their residential address. In sharp contrast, B2B purchasing is organizational, rational, and governed by Complex Corporate Buying Centers. A single corporate client might consist of a multinational parent corporation with hundreds of subsidiary legal entities, dozens of regional manufacturing facilities, and thousands of authorized employee purchasers. A B2B e-commerce platform must model Hierarchical Account Structures: defining Parent-Child corporate relationships, assigning granular Role-Based Access Controls (RBAC), managing departmental spending limits, and maintaining approved corporate shipping address directories.",
        
        "Furthermore, B2B purchasing workflows enforce Hierarchical Approval Thresholds. In a corporate procurement environment, an individual maintenance technician or junior buyer does not possess unrestricted purchasing authority. If a technician places an order for two hundred dollars in industrial safety gloves, the order may be approved automatically; however, if an order exceeds five thousand dollars, the e-commerce system must intercept the transaction, transition it into an 'Approval Pending' state, and route automated digital approval alerts to the facility procurement manager and corporate comptroller before fulfillment can proceed.",
        
        "In our institutional Python model for Part 1, we simulate an enterprise B2B corporate organizational hierarchy and automated purchasing authority engine. The algorithm evaluates buyer authorization limits, checks departmental budget quotas, enforces multi-tier approval routing, and audits order authorization. Review the deterministic code below to master B2B account architecture."
    ]

    p1_code = '''def simulate_b2b_organization_hierarchy_and_permissions(
    buyer_profile: dict,
    purchase_request_usd: float,
    department_budget: dict
) -> dict:
    """
    B2B Organizational Account Hierarchy & Purchasing Authority Gateway.
    Evaluates buyer spending limits, department budget caps, and approval workflows.
    """
    buyer_limit = buyer_profile['individual_approval_limit_usd']
    dept_remaining_budget = department_budget['annual_budget_usd'] - department_budget['spent_to_date_usd']
    
    # 1. Check if department has adequate remaining budget
    if purchase_request_usd > dept_remaining_budget:
        status = 'REJECTED_DEPARTMENT_BUDGET_EXCEEDED'
        approval_tier_required = 'CFO_EXECUTIVE_EXCEPTION'
        authorized = False
    elif purchase_request_usd <= buyer_limit:
        status = 'AUTOMATICALLY_AUTHORIZED_WITHIN_LIMIT'
        approval_tier_required = 'NONE_SELF_APPROVED'
        authorized = True
        department_budget['spent_to_date_usd'] += purchase_request_usd
    elif purchase_request_usd <= buyer_profile['manager_approval_limit_usd']:
        status = 'ROUTED_TO_FACILITY_MANAGER_APPROVAL'
        approval_tier_required = 'TIER_1_FACILITY_MANAGER'
        authorized = False
    else:
        status = 'ROUTED_TO_VP_PROCUREMENT_APPROVAL'
        approval_tier_required = 'TIER_2_VP_PROCUREMENT'
        authorized = False
        
    return {
        'buyer_id': buyer_profile['buyer_id'],
        'buyer_role': buyer_profile['role'],
        'corporate_account': buyer_profile['parent_corporation'],
        'purchase_amount_usd': round(purchase_request_usd, 2),
        'buyer_self_approval_limit_usd': round(buyer_limit, 2),
        'department_remaining_budget_usd': round(dept_remaining_budget, 2),
        'authorization_status': status,
        'approval_tier_required': approval_tier_required,
        'order_cleared_for_fulfillment': authorized
    }

corp_buyer = {
    'buyer_id': 'BUYER-ENG-44',
    'role': 'SENIOR_PLANT_ENGINEER',
    'parent_corporation': 'ACME_INDUSTRIAL_MANUFACTURING_CORP',
    'individual_approval_limit_usd': 2500.0,
    'manager_approval_limit_usd': 15000.0
}

mfg_dept_budget = {
    'department_name': 'PLANT_OPERATIONS_CHICAGO',
    'annual_budget_usd': 250000.0,
    'spent_to_date_usd': 185000.0 # $65,000 remaining
}

# Test 3 purchasing orders of varying magnitudes
orders_to_test = [1850.0, 7500.0, 85000.0]

print("=== B2B CORPORATE ACCOUNT HIERARCHY & APPROVAL AUDIT ===")
print(f"Corporate Account:              {corp_buyer['parent_corporation']}")
print(f"Purchaser:                      {corp_buyer['buyer_id']} ({corp_buyer['role']})")
print(f"Self-Approval Limit:            ${corp_buyer['individual_approval_limit_usd']:,.2f}")
print()

for amt in orders_to_test:
    res = simulate_b2b_organization_hierarchy_and_permissions(corp_buyer, amt, mfg_dept_budget)
    print(f"Order Request: ${res['purchase_amount_usd']:,.2f} USD")
    print(f"  Authorization Status: [{res['authorization_status']}]")
    print(f"  Approval Tier Needed: [{res['approval_tier_required']}] | Cleared for Fulfillment: {res['order_cleared_for_fulfillment']}")
    print(f"  Remaining Dept Budget:${res['department_remaining_budget_usd']:,.2f}")
    print()'''

    p1_output = """=== B2B CORPORATE ACCOUNT HIERARCHY & APPROVAL AUDIT ===
Corporate Account:              ACME_INDUSTRIAL_MANUFACTURING_CORP
Purchaser:                      BUYER-ENG-44 (SENIOR_PLANT_ENGINEER)
Self-Approval Limit:            $2,500.00

Order Request: $1,850.00 USD
  Authorization Status: [AUTOMATICALLY_AUTHORIZED_WITHIN_LIMIT]
  Approval Tier Needed: [NONE_SELF_APPROVED] | Cleared for Fulfillment: True
  Remaining Dept Budget:$65,000.00

Order Request: $7,500.00 USD
  Authorization Status: [ROUTED_TO_FACILITY_MANAGER_APPROVAL]
  Approval Tier Needed: [TIER_1_FACILITY_MANAGER] | Cleared for Fulfillment: False
  Remaining Dept Budget:$63,150.00

Order Request: $85,000.00 USD
  Authorization Status: [REJECTED_DEPARTMENT_BUDGET_EXCEEDED]
  Approval Tier Needed: [CFO_EXECUTIVE_EXCEPTION] | Cleared for Fulfillment: False
  Remaining Dept Budget:$63,150.00"""

    p1_notes = [
        "The $1,850.00 order was automatically authorized and cleared for fulfillment because it was under the buyer's $2,500 limit.",
        "The $7,500.00 order breached self-approval limits and was automatically intercepted and routed to the Facility Manager for Tier 1 approval.",
        "The $85,000.00 order was blocked because it exceeded the department's $63,150 remaining annual budget, requiring executive CFO sign-off."
    ]

    p1_check = {
        "question": "Why must B2B e-commerce portals support complex organizational account hierarchies and approval workflows?",
        "options": [
            "Because corporate purchasing policies legally mandate spend limits, manager approvals, and budget governance before procurement funds can be committed",
            "Because corporate procurement managers enjoy clicking approval buttons as a hobby",
            "Because credit card companies refuse to process transactions over five hundred dollars",
            "Because B2B buyers are forbidden from using computers without manager supervision"
        ],
        "answer": 0,
        "why": "Enterprise governance requires strict budget controls and delegated signing authorities; B2B portals must enforce these organizational approval chains digitally."
    }

    parts.append({
        "title": "B2B vs B2C Commerce Dynamics: Complex Corporate Buying Centers, Hierarchical Account Roles & Spend Limits",
        "say": p1_say,
        "example": "Grainger powers industrial MRO supply for Fortune 500 manufacturers. Boeing buyers across 20 facilities log into a unified Grainger portal where individual assembly line supervisors can self-approve tool purchases up to $1,000, while multi-thousand-dollar machinery orders route automatically to regional procurement directors.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Increase buyer individual_approval_limit_usd to $10,000.00 to observe how the $7,500 order becomes self-approved.",
        "check": p1_check
    })

    # Part 2: Custom Contract Pricing, Volume Tier Price Breaks, MOQ & Customer-Specific Catalogs
    p2_say = [
        "In B2C e-commerce, every visitor views the identical retail list price (Manufacturer's Suggested Retail Price - MSRP). In B2B wholesale commerce, nobody pays list price. B2B transactions are governed by negotiated Master Services Agreements (MSAs) and Customer-Specific Contract Pricing. When a commercial account logs into a B2B wholesale portal, the catalog dynamically re-prices every single SKU according to that specific customer's negotiated corporate rate schedule, reflecting negotiated discounts of twenty to fifty percent off MSRP.",
        
        "Furthermore, B2B wholesale engines enforce Volume Tier Price Breaks. Because fulfilling one bulk order of five hundred units is far more labor-efficient than picking five hundred individual parcels, suppliers pass economies of scale to corporate buyers through tiered volume discounting. A commercial pricing engine models non-linear price schedules: for example, 1 to 49 units at $100 per unit, 50 to 199 units at $85 per unit, and 200+ units at $70 per unit. Dynamic pricing algorithms calculate order volume discounts in real time, displaying quantity break tables on the Product Detail Page to incentivize larger order sizes.",
        
        "Concurrently, wholesale platforms enforce Minimum Order Quantities (MOQ) and Case Pack Multiples. Wholesale manufacturers do not break open manufacturer master cartons to ship a single bolt or one individual widget. If a master carton contains 24 units, the system enforces an MOQ of 24 and restricts quantity selectors to integer multiples of 24 (e.g., 24, 48, 72, 96). Orders that do not satisfy cartonization requirements or minimum order values are blocked at the cart level, protecting warehouse fulfillment efficiency.",
        
        "In our institutional Python model for Part 2, we simulate an enterprise B2B contract pricing and MOQ validation engine. The program applies customer-specific price tier matrices, enforces case pack cartonization multiples, audits minimum order thresholds, and calculates wholesale volume savings. Review the deterministic code below to master B2B pricing algorithms."
    ]

    p2_code = '''def calculate_b2b_contract_pricing_and_moq(
    sku: str,
    requested_units: int,
    customer_contract: dict,
    catalog_master: dict
) -> dict:
    """
    B2B Custom Contract Pricing & MOQ Verification Engine.
    Applies customer tier matrices, enforces case pack multiples, and calculates volume discounts.
    """
    product = catalog_master.get(sku, {})
    list_price_usd = product.get('msrp_list_price_usd', 100.0)
    case_pack_units = product.get('case_pack_multiple', 1)
    moq_units = product.get('minimum_order_quantity', 1)
    
    # 1. Enforce Minimum Order Quantity (MOQ)
    if requested_units < moq_units:
        return {
            'sku': sku, 'status': 'REJECTED_BELOW_MOQ',
            'requested_units': requested_units, 'required_moq': moq_units,
            'cleared': False, 'total_price_usd': 0.0
        }
        
    # 2. Enforce Case Pack Multiples (Must be divisible by case pack)
    if requested_units % case_pack_units != 0:
        suggested_units = ((requested_units // case_pack_units) + 1) * case_pack_units
        return {
            'sku': sku, 'status': 'REJECTED_NON_CASE_PACK_MULTIPLE',
            'requested_units': requested_units, 'case_pack': case_pack_units,
            'suggested_units': suggested_units, 'cleared': False, 'total_price_usd': 0.0
        }
        
    # 3. Determine Tiered Contract Unit Price
    # Check customer-specific volume schedule
    tier_schedule = customer_contract.get('custom_tiers', {}).get(sku, [
        {'min_qty': 1, 'unit_price_usd': list_price_usd}
    ])
    
    # Sort descending by min_qty to find matching volume tier
    sorted_tiers = sorted(tier_schedule, key=lambda x: x['min_qty'], reverse=True)
    applied_unit_price = list_price_usd
    applied_tier_label = 'LIST_MSRP'
    
    for tier in sorted_tiers:
        if requested_units >= tier['min_qty']:
            applied_unit_price = tier['unit_price_usd']
            applied_tier_label = tier.get('tier_name', f">={tier['min_qty']} units")
            break
            
    total_contract_price_usd = requested_units * applied_unit_price
    baseline_list_total_usd = requested_units * list_price_usd
    total_savings_usd = baseline_list_total_usd - total_contract_price_usd
    discount_percentage = (total_savings_usd / baseline_list_total_usd) * 100.0 if baseline_list_total_usd > 0 else 0.0
    
    return {
        'sku': sku,
        'status': 'AUTHORIZED_CONTRACT_PRICE_APPLIED',
        'requested_units': requested_units,
        'case_pack': case_pack_units,
        'applied_tier': applied_tier_label,
        'contract_unit_price_usd': round(applied_unit_price, 2),
        'total_contract_price_usd': round(total_contract_price_usd, 2),
        'wholesale_savings_usd': round(total_savings_usd, 2),
        'discount_pct': round(discount_percentage, 1),
        'cleared': True
    }

mock_catalog = {
    'SKU-IND-VALVE-50': {
        'name': 'High-Pressure Hydraulic Valve 50mm',
        'msrp_list_price_usd': 120.00,
        'minimum_order_quantity': 24, # MOQ 24 units (1 master carton)
        'case_pack_multiple': 12      # Must be ordered in multiples of 12
    }
}

tier1_contract = {
    'client_id': 'CLIENT-GENERAL-MOTORS',
    'custom_tiers': {
        'SKU-IND-VALVE-50': [
            {'min_qty': 24,  'unit_price_usd': 96.00, 'tier_name': 'TIER_1_STANDARD_WHOLESALE (-20%)'},
            {'min_qty': 60,  'unit_price_usd': 84.00, 'tier_name': 'TIER_2_BULK_PROCUREMENT (-30%)'},
            {'min_qty': 120, 'unit_price_usd': 72.00, 'tier_name': 'TIER_3_ENTERPRISE_OEM (-40%)'}
        ]
    }
}

# Scenario 1: Below MOQ (10 units)
s1 = calculate_b2b_contract_pricing_and_moq('SKU-IND-VALVE-50', 10, tier1_contract, mock_catalog)
# Scenario 2: Broken Case Pack (28 units - not divisible by 12)
s2 = calculate_b2b_contract_pricing_and_moq('SKU-IND-VALVE-50', 28, tier1_contract, mock_catalog)
# Scenario 3: Valid Enterprise Bulk Order (120 units)
s3 = calculate_b2b_contract_pricing_and_moq('SKU-IND-VALVE-50', 120, tier1_contract, mock_catalog)

print("=== B2B CUSTOM CONTRACT PRICING & MOQ AUDIT ===")
print("Scenario 1 (10 units):")
print(f"  Status: [{s1['status']}] (Requested: {s1['requested_units']} | Required MOQ: {s1['required_moq']})")
print()

print("Scenario 2 (28 units):")
print(f"  Status: [{s2['status']}] (Must order in case packs of {s2['case_pack']} | Suggested: {s2['suggested_units']})")
print()

print("Scenario 3 (120 units - Valid Bulk):")
print(f"  Status: [{s3['status']}]")
print(f"  Applied Tier:        {s3['applied_tier']}")
print(f"  Unit Contract Price: ${s3['contract_unit_price_usd']:.2f} USD (MSRP: $120.00)")
print(f"  Total Order Value:   ${s3['total_contract_price_usd']:,.2f} USD")
print(f"  Contract Savings:    ${s3['wholesale_savings_usd']:,.2f} USD (-{s3['discount_pct']}%)")'''

    p2_output = """=== B2B CUSTOM CONTRACT PRICING & MOQ AUDIT ===
Scenario 1 (10 units):
  Status: [REJECTED_BELOW_MOQ] (Requested: 10 | Required MOQ: 24)

Scenario 2 (28 units):
  Status: [REJECTED_NON_CASE_PACK_MULTIPLE] (Must order in case packs of 12 | Suggested: 36)

Scenario 3 (120 units - Valid Bulk):
  Status: [AUTHORIZED_CONTRACT_PRICE_APPLIED]
  Applied Tier:        TIER_3_ENTERPRISE_OEM (-40%)
  Unit Contract Price: $72.00 USD (MSRP: $120.00)
  Total Order Value:   $8,640.00 USD
  Contract Savings:    $5,760.00 USD (-40.0%)"""

    p2_notes = [
        "Scenario 1 was blocked because 10 units fell below the statutory 24-unit Minimum Order Quantity.",
        "Scenario 2 was blocked for non-case pack multiples (28 is not divisible by 12); the system automatically suggested 36 units.",
        "Scenario 3 successfully activated Tier 3 Enterprise OEM pricing ($72.00/unit), saving the client $5,760.00 (40.0% off list)."
    ]

    p2_check = {
        "question": "Why do wholesale B2B manufacturers enforce Case Pack Multiples in their digital ordering engines?",
        "options": [
            "To ensure warehouse pickers can retrieve sealed, palletized manufacturer cartons without breaking open boxes and incurring manual counting labor",
            "To prevent customers from buying more products than can fit in a car",
            "Because digital computers can only calculate numbers divisible by 12",
            "To comply with federal postal weight limits"
        ],
        "answer": 0,
        "why": "Enforcing case pack multiples allows warehouses to ship intact master cartons directly from pallets, eliminating expensive piece-picking labor and reducing packaging waste."
    }

    parts.append({
        "title": "Custom Contract Pricing, Volume Tier Price Breaks, MOQ & Customer-Specific Catalogs",
        "say": p2_say,
        "example": "Cisco Systems sells networking routers and enterprise switches through its partner wholesale portal. Global system integrators like Accenture access custom contract pricing with 45% volume breaks and strict case pack rules for transceivers, processing over $30B in digital hardware orders annually.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Order 60 units in Scenario 3 to observe the engine transition to Tier 2 pricing ($84.00/unit) for a total of $5,040.00.",
        "check": p2_check
    })

    # Part 3: B2B Trade Credit & Payment Terms: Net 30/60/90 Days, Trade Credit Risk Scoring, Automated Invoicing & Factoring Economics
    p3_say = [
        "In B2C digital commerce, credit card or digital wallet authorization is mandatory before an order can be fulfilled: if payment fails, the order does not ship. In B2B commerce, demanding upfront credit card payment on fifty-thousand-dollar transactions is unacceptable to corporate procurement departments. Enterprise buyers transact on Trade Credit Terms (also known as Open Account Terms), most commonly Net 30, Net 60, or Net 90 days. Under trade terms, the seller dispatches goods immediately, generates a commercial tax invoice, and grants the buyer thirty to ninety days to settle payment via Automated Clearing House (ACH), wire transfer, or corporate purchasing card.",
        
        "Granting trade credit exposes the seller to severe Working Capital and Default Risk. If a wholesale seller generates five million dollars in monthly sales on Net 60 terms, the company must finance ten million dollars in outstanding Accounts Receivable (A/R) before collecting cash. To govern trade credit safely, B2B finance engines integrate Credit Risk Scoring algorithms: ingesting business credit ratings (such as Dun & Bradstreet PAYDEX scores), corporate financial statements, and historical Days Sales Outstanding (DSO). The system assigns automated Credit Limits (e.g., $100,000 max outstanding balance) and enforces Automated Credit Holds: if a buyer's unpaid invoices exceed their credit limit or become sixty days past due, the portal automatically blocks new order placements until past invoices are settled.",
        
        "To optimize treasury cash flow, B2B sellers also utilize Early Payment Cash Discounts (e.g., `2/10 Net 30`, meaning the buyer receives a 2% discount if they pay within 10 days, otherwise full payment is due in 30 days). Alternatively, when working capital is constrained, enterprises engage in Accounts Receivable Factoring: selling unpaid trade invoices to financial institutions (factors) at a small discount (typically 1.5% to 3.0%) to obtain immediate cash liquidity, eliminating balance sheet collection delays.",
        
        "In our institutional Python model for Part 3, we simulate a B2B trade credit underwriting and accounts receivable management engine. The model evaluates credit utilization ratios, calculates early payment discount yields, enforces automated credit hold freezes, and models factoring economics. Review the deterministic code below to master trade credit finance."
    ]

    p3_code = '''def evaluate_b2b_trade_credit_and_terms(
    account_credit_profile: dict,
    new_order_value_usd: float,
    early_payment_discount_accepted: bool
) -> dict:
    """
    B2B Trade Credit Underwriting & Invoicing Engine.
    Audits credit limits, evaluates Net 30/60 terms, and calculates early payment yields.
    """
    credit_limit = account_credit_profile['credit_limit_usd']
    current_outstanding_ar = account_credit_profile['current_outstanding_ar_usd']
    overdue_invoices_count = account_credit_profile['overdue_invoices_count']
    paydex_score = account_credit_profile['dnb_paydex_score'] # 0 to 100 (>80 is low risk)
    
    projected_ar = current_outstanding_ar + new_order_value_usd
    credit_utilization_pct = (projected_ar / credit_limit) * 100.0 if credit_limit > 0 else 100.0
    
    # Credit Underwriting Rules:
    # 1. Zero tolerance for past-due invoices > 30 days
    # 2. Credit limit cannot be exceeded
    # 3. Paydex score must be >= 70 for open terms
    if overdue_invoices_count > 0:
        status = 'CREDIT_HOLD_OVERDUE_INVOICES_EXIST'
        cleared_for_terms = False
    elif projected_ar > credit_limit:
        status = 'CREDIT_HOLD_CREDIT_LIMIT_EXCEEDED'
        cleared_for_terms = False
    elif paydex_score < 70:
        status = 'CREDIT_HOLD_POOR_CREDIT_SCORE'
        cleared_for_terms = False
    else:
        status = 'TRADE_CREDIT_APPROVED_NET_30'
        cleared_for_terms = True
        account_credit_profile['current_outstanding_ar_usd'] = projected_ar
        
    # Calculate 2/10 Net 30 economics if terms approved
    if cleared_for_terms:
        if early_payment_discount_accepted:
            discount_usd = new_order_value_usd * 0.02 # 2% discount
            net_cash_received = new_order_value_usd - discount_usd
            terms_applied = '2/10_NET_30_EARLY_PAYMENT_APPLIED'
        else:
            discount_usd = 0.0
            net_cash_received = new_order_value_usd
            terms_applied = 'STANDARD_NET_30_DAYS'
    else:
        discount_usd = 0.0
        net_cash_received = 0.0
        terms_applied = 'PRE_PAYMENT_CREDIT_CARD_REQUIRED'
        
    return {
        'account_id': account_credit_profile['account_id'],
        'order_value_usd': round(new_order_value_usd, 2),
        'credit_limit_usd': round(credit_limit, 2),
        'new_ar_balance_usd': round(account_credit_profile['current_outstanding_ar_usd'], 2),
        'credit_utilization_pct': round(credit_utilization_pct, 1),
        'credit_status': status,
        'terms_applied': terms_applied,
        'early_discount_usd': round(discount_usd, 2),
        'net_receivable_usd': round(net_cash_received, 2),
        'cleared': cleared_for_terms
    }

buyer_account = {
    'account_id': 'CORP-DELL-COMPONENTS',
    'credit_limit_usd': 150000.0,
    'current_outstanding_ar_usd': 85000.0,
    'overdue_invoices_count': 0,
    'dnb_paydex_score': 85 # Excellent corporate credit
}

# Order 1: $40,000 order taking early 2/10 payment discount
t1 = evaluate_b2b_trade_credit_and_terms(buyer_account, 40000.0, early_payment_discount_accepted=True)
# Order 2: $35,000 order breaching the $150k credit limit
t2 = evaluate_b2b_trade_credit_and_terms(buyer_account, 35000.0, early_payment_discount_accepted=False)

print("=== B2B TRADE CREDIT UNDERWRITING & AR AUDIT ===")
print("Order 1 ($40,000 - With 2/10 Discount):")
print(f"  Credit Status:        [{t1['credit_status']}]")
print(f"  Credit Utilization:   {t1['credit_utilization_pct']}% of $150,000 limit")
print(f"  Terms Applied:        [{t1['terms_applied']}]")
print(f"  Early Cash Discount:  -${t1['early_discount_usd']:,.2f} USD")
print(f"  Net Cash Receivable:  ${t1['net_receivable_usd']:,.2f} USD")
print()

print("Order 2 ($35,000 - Credit Limit Breach):")
print(f"  Credit Status:        [{t2['credit_status']}]")
print(f"  Credit Utilization:   {t2['credit_utilization_pct']}% (Exceeds 100% cap!)")
print(f"  Terms Applied:        [{t2['terms_applied']}]")
print(f"  Order Cleared:        {t2['cleared']}")'''

    p3_output = """=== B2B TRADE CREDIT UNDERWRITING & AR AUDIT ===
Order 1 ($40,000 - With 2/10 Discount):
  Credit Status:        [TRADE_CREDIT_APPROVED_NET_30]
  Credit Utilization:   83.3% of $150,000 limit
  Terms Applied:        [2/10_NET_30_EARLY_PAYMENT_APPLIED]
  Early Cash Discount:  -$800.00 USD
  Net Cash Receivable:  $39,200.00 USD

Order 2 ($35,000 - Credit Limit Breach):
  Credit Status:        [CREDIT_HOLD_CREDIT_LIMIT_EXCEEDED]
  Credit Utilization:   106.7% (Exceeds 100% cap!)
  Terms Applied:        [PRE_PAYMENT_CREDIT_CARD_REQUIRED]
  Order Cleared:        False"""

    p3_notes = [
        "Order 1 was approved on Net 30 terms, utilizing 83.3% of the buyer's credit limit; the 2% discount provided an $800 incentive for fast 10-day cash settlement.",
        "Order 2 pushed projected receivables to $160,000 (106.7% utilization), automatically triggering a Credit Hold that required upfront pre-payment.",
        "Automated credit limits protect the seller's treasury from corporate default risk and reduce average Days Sales Outstanding (DSO)."
    ]

    p3_check = {
        "question": "What is the primary financial rationale for a B2B merchant to offer '2/10 Net 30' early payment terms?",
        "options": [
            "It incentivizes enterprise buyers to settle invoices in 10 days rather than 30, accelerating cash flow velocity and reducing working capital financing costs",
            "It legally waives all corporate sales taxes on wholesale transactions",
            "It forces the buyer to pay the merchant in corporate stock",
            "It allows the merchant to avoid delivering the ordered products"
        ],
        "answer": 0,
        "why": "Offering a 2% discount for 10-day payment accelerates cash collection, reducing Days Sales Outstanding (DSO) and freeing up treasury working capital."
    }

    parts.append({
        "title": "B2B Trade Credit & Payment Terms: Net 30/60/90 Days, Trade Credit Risk Scoring & Factoring Economics",
        "say": p3_say,
        "example": "Anixter (part of WESCO) distributes electrical wire and communications cabling on billions in trade credit. By linking its digital B2B ordering portal to Dun & Bradstreet credit underwriting APIs, Anixter automatically approves Net 60 terms for certified electrical contractors while enforcing instant credit holds on delinquent accounts.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Increase credit_limit_usd to $200,000.00 for buyer_account to observe how Order 2 clears successfully at 80.0% utilization.",
        "check": p3_check
    })

    # Part 4: PunchOut Catalogs, e-Procurement Systems (Ariba, Coupa), cXML/EDI Data Interchange & Multi-Tier Purchase Approval Workflows
    p4_say = [
        "In enterprise corporations and government agencies, purchasing managers do not open a web browser and type in a supplier's URL. Large corporations enforce centralized e-Procurement Systems (such as SAP Ariba, Coupa, Jaggaer, or Oracle Procurement Cloud) to govern all corporate spending. To do business with Global 2000 enterprises, a B2B supplier cannot simply provide a standard website; they must implement a PunchOut Catalog.",
        
        "A PunchOut Catalog (built on standard commerce eXtensible Markup Language - cXML protocols) connects the buyer's internal ERP system directly to the supplier's digital commerce storefront. The workflow operates as follows: First, Single Sign-On Ingress (`PunchOutSetupRequest`)—the corporate employee inside SAP Ariba clicks the supplier's logo, sending a cryptographically signed cXML request that automatically authenticates the user into the supplier's e-commerce portal with their custom negotiated contract pricing; Second, Interactive Browsing & Cart Assembly—the buyer browses the supplier's catalog, checks real-time inventory availability, and builds a shopping cart; Third, Requisition PunchOut (`PunchOutOrderMessage`)—rather than checking out and entering a credit card, the buyer clicks 'Return Cart to Ariba'. The portal formats the cart items, quantities, and contract prices into a cXML data packet and 'punches back' the payload into the buyer's internal ERP.",
        
        "Inside the buyer's ERP, the returned cart is converted into an internal Purchase Requisition, routing through corporate financial approval hierarchies. Once approved, the buyer's ERP automatically transmits a digital Purchase Order (via cXML `OrderRequest` or EDI 850) back to the supplier's Order Management System for automated warehouse dispatch. PunchOut integration binds the supplier tightly into the customer's enterprise software ecosystem, creating virtually insurmountable competitive switching costs.",
        
        "In our institutional Python model for Part 4, we simulate an end-to-end cXML PunchOut transaction. The algorithm validates the incoming setup request, applies customer contract parameters, constructs the cXML Order Message payload, and routes the digital purchase order into the supplier's OMS. Review the deterministic code below to master e-procurement data interchange."
    ]

    p4_code = '''def simulate_cxml_punchout_and_approval_workflow(
    punchout_session: dict,
    cart_items: list[dict]
) -> dict:
    """
    cXML PunchOut Catalog & e-Procurement Integration Gateway.
    Simulates SAP Ariba / Coupa PunchOutSetupRequest and PunchOutOrderMessage round-trip.
    """
    buyer_cookie = punchout_session['buyer_cookie']
    erp_system = punchout_session['procurement_system'] # e.g. SAP_ARIBA
    contract_id = punchout_session['contract_id']
    
    total_cart_value_usd = 0.0
    cxml_line_items = []
    
    for idx, item in enumerate(cart_items, 1):
        line_total = item['quantity'] * item['contract_unit_price_usd']
        total_cart_value_usd += line_total
        
        cxml_line_items.append({
            'line_number': idx,
            'supplier_part_id': item['sku'],
            'description': item['description'],
            'quantity': item['quantity'],
            'unit_price_usd': item['contract_unit_price_usd'],
            'subtotal_usd': round(line_total, 2),
            'classification_unspsc': item.get('unspsc_code', '43211500') # Standard commodity code
        })
        
    # Construct cXML PunchOutOrderMessage payload
    cxml_payload = {
        'cxml_version': '1.2.040',
        'message_type': 'PunchOutOrderMessage',
        'buyer_cookie': buyer_cookie,
        'header': {
            'from_identity': 'SUPPLIER_B2B_NETWORK_ID',
            'to_identity': erp_system,
            'contract_reference': contract_id
        },
        'body': {
            'total_items': len(cxml_line_items),
            'total_amount_usd': round(total_cart_value_usd, 2),
            'currency': 'USD',
            'items': cxml_line_items
        }
    }
    
    # Internal ERP Requisition Approval Simulation
    requires_vp_signoff = total_cart_value_usd > 10000.0
    approval_status = 'PENDING_VP_PROCUREMENT' if requires_vp_signoff else 'APPROVED_LINE_MANAGER'
    
    return {
        'erp_integration_platform': erp_system,
        'buyer_cookie': buyer_cookie,
        'cxml_status': 'PUNCHOUT_CART_RETURNED_SUCCESS',
        'total_cart_lines': len(cxml_line_items),
        'total_order_value_usd': round(total_cart_value_usd, 2),
        'internal_erp_approval_status': approval_status,
        'cxml_payload_summary': cxml_payload
    }

mock_session = {
    'buyer_cookie': 'ARIBA-SESSION-TOKEN-9948271',
    'procurement_system': 'SAP_ARIBA',
    'contract_id': 'CONTRACT-BOEING-2026-MSA'
}

mock_cart = [
    {'sku': 'SKU-TITANIUM-BOLT-10', 'description': 'Aerospace Grade Titanium Bolt M10', 'quantity': 500, 'contract_unit_price_usd': 12.50, 'unspsc_code': '31161601'},
    {'sku': 'SKU-SEAL-NITRILE-25',  'description': 'High-Temp Nitrile O-Ring Seal 25mm', 'quantity': 200, 'contract_unit_price_usd': 4.20,  'unspsc_code': '31181504'}
]

punchout_audit = simulate_cxml_punchout_and_approval_workflow(mock_session, mock_cart)

print("=== cXML PUNCHOUT CATALOG & e-PROCUREMENT GATEWAY ===")
print(f"e-Procurement Platform:         {punchout_audit['erp_integration_platform']}")
print(f"Buyer Session Token:            {punchout_audit['buyer_cookie']}")
print(f"PunchOut Round-Trip Status:     [{punchout_audit['cxml_status']}]")
print(f"Total Cart Items Transferred:   {punchout_audit['total_cart_lines']} line items")
print(f"Total Requisition Value:        ${punchout_audit['total_order_value_usd']:,.2f} USD")
print(f"Internal ERP Approval Routing:  [{punchout_audit['internal_erp_approval_status']}] (Automatic PO dispatch)")
print()
print("cXML Line Item Transmission:")
for itm in punchout_audit['cxml_payload_summary']['body']['items']:
    print(f"  Line {itm['line_number']}: [{itm['supplier_part_id']}] {itm['description'][:32]} | Qty: {itm['quantity']} | Unit: ${itm['unit_price_usd']:.2f} -> Total: ${itm['subtotal_usd']:,.2f}")'''

    p4_output = """=== cXML PUNCHOUT CATALOG & e-PROCUREMENT GATEWAY ===
e-Procurement Platform:         SAP_ARIBA
Buyer Session Token:            ARIBA-SESSION-TOKEN-9948271
PunchOut Round-Trip Status:     [PUNCHOUT_CART_RETURNED_SUCCESS]
Total Cart Items Transferred:   2 line items
Total Requisition Value:        $7,090.00 USD
Internal ERP Approval Routing:  [APPROVED_LINE_MANAGER] (Automatic PO dispatch)

cXML Line Item Transmission:
  Line 1: [SKU-TITANIUM-BOLT-10] Aerospace Grade Titanium Bolt M1 | Qty: 500 | Unit: $12.50 -> Total: $6,250.00
  Line 2: [SKU-SEAL-NITRILE-25] High-Temp Nitrile O-Ring Seal 25 | Qty: 200 | Unit: $4.20 -> Total: $840.00"""

    p4_notes = [
        "The cXML PunchOutOrderMessage payload transferred 2 lines ($7,090.00 total) directly back into SAP Ariba with zero manual data entry.",
        "UNSPSC commodity codes were embedded into each line item, enabling automated spend category tracking in corporate procurement reporting.",
        "Because the order fell below the $10,000 threshold, it achieved line-manager approval for instant digital purchase order generation."
    ]

    p4_check = {
        "question": "What is the primary operational mechanism of a cXML PunchOut Catalog integration with SAP Ariba or Coupa?",
        "options": [
            "It allows corporate buyers to launch the supplier's web catalog from within their ERP, build a cart with contract pricing, and return the cart data seamlessly as an internal procurement requisition",
            "It punches physical holes into warehouse shipping boxes to inspect contents",
            "It prevents corporate buyers from communicating with supplier sales representatives",
            "It automatically cancels orders if delivery takes longer than 24 hours"
        ],
        "answer": 0,
        "why": "PunchOut connects enterprise ERP systems directly to supplier catalogs via cXML, allowing buyers to select items and return cart data directly into their corporate procurement approval pipeline."
    }

    parts.append({
        "title": "PunchOut Catalogs, e-Procurement Systems (Ariba, Coupa), cXML/EDI Data Interchange & Multi-Tier Purchase Approval Workflows",
        "say": p4_say,
        "example": "Fastenal integrates its industrial supply catalog with over 3,000 corporate SAP Ariba and Coupa procurement systems. By eliminating manual purchase orders and phone quotes through automated cXML PunchOut integration, Fastenal processes over 70% of its national account sales digitally with near-zero data entry errors.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Increase the titanium bolt quantity to 1,000 units to observe the requisition value surge to $13,340.00, triggering PENDING_VP_PROCUREMENT approval.",
        "check": p4_check
    })

    # Part 5: Enterprise B2B Wholesale Commerce Command Gateway & B2BEI Certification
    p5_say = [
        "To conclude Day 24, we synthesize organizational account hierarchies, contract pricing and MOQ enforcement, trade credit risk management, and cXML PunchOut e-procurement integrations into the Enterprise B2B Wholesale Commerce Command Gateway. In modern enterprise supply chains, B2B digital commerce is the critical engine of operational scale and customer account retention.",
        
        "The Enterprise B2B Wholesale Commerce Command Gateway evaluates four strategic operational pillars to compute the B2B Enterprise Commerce Index (B2BEI, 100 max points): First, Contract Pricing & MOQ Compliance Precision (30 points)—it audits automated price-break calculations and verifies that 100% of orders strictly adhere to case pack multiples and customer MSA schedules; Second, Trade Credit Health & DSO Velocity (25 points)—it benchmarks Days Sales Outstanding (DSO, target <= 38 days) and monitors trade credit default and bad debt write-off rates (target < 0.5%); Third, e-Procurement & PunchOut Integration Share (25 points)—it measures the percentage of corporate GMV transacted via automated cXML PunchOut and EDI protocols (target >= 60.0%), maximizing enterprise customer retention; and Fourth, Multi-Tier Approval Workflow Efficiency (20 points)—it tracks organizational approval velocity, ensuring corporate purchase orders transition from requisition to warehouse dispatch in under four hours.",
        
        "Achieving a B2BEI score of 85.0 points or above confers the Apex B2B Enterprise Commerce Certification. In our institutional Python capstone for Day 24, we simulate an enterprise B2B command gateway governing a national industrial wholesale network generating two hundred million dollars in annual wholesale GMV across two thousand corporate accounts. Review the deterministic code below to master B2B commerce governance."
    ]

    p5_code = '''def run_enterprise_b2b_commerce_gateway(
    annual_b2b_gmv_usd: float,
    contract_pricing_compliance_pct: float,
    days_sales_outstanding_days: float,
    punchout_cxml_gmv_share_pct: float,
    bad_debt_default_rate_pct: float
) -> dict:
    """
    Enterprise B2B Wholesale Commerce Command Gateway.
    Synthesizes wholesale metrics into the B2BEI certification score.
    """
    # 1. Contract Pricing & MOQ Compliance (30 pts, target >= 99.0%)
    score_pricing = min(30.0, (contract_pricing_compliance_pct / 99.0) * 30.0)
    
    # 2. DSO Working Capital Health (25 pts, target <= 38 days)
    # Lower DSO is better: 38 days gets full 25 pts, decays above 38
    if days_sales_outstanding_days <= 38.0:
        score_dso = 25.0
    else:
        score_dso = max(5.0, 25.0 - (days_sales_outstanding_days - 38.0) * 1.5)
        
    # 3. PunchOut / cXML Integration Share (25 pts, target >= 60.0%)
    score_punchout = min(25.0, (punchout_cxml_gmv_share_pct / 60.0) * 25.0)
    
    # 4. Bad Debt & Credit Risk Mitigation (20 pts, target <= 0.40% default)
    if bad_debt_default_rate_pct <= 0.40:
        score_credit = 20.0
    else:
        score_credit = max(5.0, 20.0 - (bad_debt_default_rate_pct - 0.40) * 25.0)
        
    b2bei_score = round(score_pricing + score_dso + score_punchout + score_credit, 2)
    certified = b2bei_score >= 85.0
    
    return {
        'annual_b2b_gmv_usd': round(annual_b2b_gmv_usd, 2),
        'b2bei_composite_score': b2bei_score,
        'pillar_scores': {
            'contract_pricing_compliance_pts': round(score_pricing, 2),
            'dso_working_capital_pts': round(score_dso, 2),
            'punchout_integration_pts': round(score_punchout, 2),
            'credit_risk_mitigation_pts': round(score_credit, 2)
        },
        'system_kpis': {
            'contract_compliance': f"{contract_pricing_compliance_pct}%",
            'dso_latency': f"{days_sales_outstanding_days} days",
            'punchout_share': f"{punchout_cxml_gmv_share_pct}%",
            'bad_debt_rate': f"{bad_debt_default_rate_pct:.3f}%"
        },
        'certification_conferred': certified,
        'governance_status': 'APEX_B2B_ENTERPRISE_COMMERCE_CERTIFIED' if certified else 'B2B_COMMERCE_REMEDIATION_REQUIRED'
    }

b2b_audit = run_enterprise_b2b_commerce_gateway(
    annual_b2b_gmv_usd=200000000.0,              # $200M Annual Wholesale GMV
    contract_pricing_compliance_pct=99.6,         # 99.6% Automated contract pricing compliance
    days_sales_outstanding_days=34.2,             # 34.2 Days DSO (Superb working capital turnaround)
    punchout_cxml_gmv_share_pct=68.5,             # 68.5% of GMV transacted via PunchOut/EDI
    bad_debt_default_rate_pct=0.18                # 0.18% Low bad debt write-offs
)

print("=== ENTERPRISE B2B WHOLESALE COMMERCE COMMAND GATEWAY ===")
print(f"Annual B2B Wholesale GMV:       ${b2b_audit['annual_b2b_gmv_usd']:,.2f}")
print(f"B2BEI Composite Score:          {b2b_audit['b2bei_composite_score']} / 100.00 pts")
print(f"Pillar Breakdown:               Pricing: {b2b_audit['pillar_scores']['contract_pricing_compliance_pts']} | DSO: {b2b_audit['pillar_scores']['dso_working_capital_pts']} | PunchOut: {b2b_audit['pillar_scores']['punchout_integration_pts']} | Credit: {b2b_audit['pillar_scores']['credit_risk_mitigation_pts']}")
print(f"System Performance KPIs:        {b2b_audit['system_kpis']}")
print(f"Platform Governance Status:     [{b2b_audit['governance_status']}] (Certified: {b2b_audit['certification_conferred']})")'''

    p5_output = """=== ENTERPRISE B2B WHOLESALE COMMERCE COMMAND GATEWAY ===
Annual B2B Wholesale GMV:       $200,000,000.00
B2BEI Composite Score:          100.0 / 100.00 pts
Pillar Breakdown:               Pricing: 30.0 | DSO: 25.0 | PunchOut: 25.0 | Credit: 20.0
System Performance KPIs:        {'contract_compliance': '99.6%', 'dso_latency': '34.2 days', 'punchout_share': '68.5%', 'bad_debt_rate': '0.180%'}
Platform Governance Status:     [APEX_B2B_ENTERPRISE_COMMERCE_CERTIFIED] (Certified: True)"""

    p5_notes = [
        "The B2B Wholesale Gateway verified governance across $200M in annual corporate volume across 2,000 enterprise accounts.",
        "Achieving a 34.2-day DSO turnaround and 68.5% PunchOut GMV share minimized working capital drag and created sticky account retention.",
        "Achieving a perfect 100.0/100 B2BEI score confers Apex B2B Enterprise Commerce Certification."
    ]

    p5_check = {
        "question": "Why is Days Sales Outstanding (DSO) a critical metric in B2B e-commerce enterprise health?",
        "options": [
            "Because it measures how quickly trade receivables are converted into liquid cash; lower DSO frees up working capital and lowers corporate borrowing costs",
            "Because DSO calculates the speed of delivery trucks on the highway",
            "Because high DSO increases the number of email subscribers",
            "Because DSO is legally mandated to equal exactly 365 days by international trade treaties"
        ],
        "answer": 0,
        "why": "DSO measures the average number of days it takes for a company to collect payment after a sale. Lower DSO ensures capital is rapidly recouped rather than locked in unpaid receivables."
    }

    parts.append({
        "title": "Enterprise B2B Wholesale Commerce Command Gateway & B2BEI Certification",
        "say": p5_say,
        "example": "Grainger and Fastenal operate high-volume B2B e-commerce platforms generating billions in annual digital sales. By uniting custom contract pricing, cXML PunchOut integrations, and automated trade credit underwriting, these enterprises maintain Days Sales Outstanding below 35 days while serving hundreds of thousands of corporate accounts.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Increase days_sales_outstanding_days to 50.0 to observe how working capital delay degrades the DSO pillar score and lowers B2BEI.",
        "check": p5_check
    })

    # Assemble Day 24 dictionary
    day24_dict = {
        "day": 24,
        "title": "B2B E-Commerce & Wholesale Portals: Net Payment Terms, PunchOut Catalogs & Custom Contract Pricing",
        "summary": [
            "B2B organizational account structures: parent-child corporate hierarchies, RBAC, and tiered approval limit routing.",
            "Custom contract pricing and volume tier breaks: customer price schedules, case pack multiples, and MOQ enforcement.",
            "B2B trade credit terms: Net 30/60 open account financing, 2/10 early cash discounts, and automated credit hold freezes.",
            "cXML PunchOut catalogs and e-procurement systems: SAP Ariba/Coupa round-trip integration and automated PO dispatch.",
            "Enterprise B2B Wholesale Commerce Command Gateway and B2BEI institutional operational certification."
        ],
        "parts": parts
    }

    # Ensure invariant: >= 580 words per part and >= 2,950 words total
    total_words = ensure_ecom_day_budget(day24_dict, min_part_words=580, min_day_words=2950)
    return day24_dict, total_words

if __name__ == '__main__':
    d, w = build_day24()
    print(f"Day 24 Built Successfully! Total Spoken Words: {w:,}")
    for idx, p in enumerate(d['parts']):
        words = count_words(" ".join(p['say']))
        print(f"  Part {idx+1}: {p['title'][:45]}... ({words} words)")
