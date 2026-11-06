"""
Build Day 16 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Transfer Pricing & Arm's Length Principle (ALP) - Sections 92 to 92F, Methods (CUP, RPM, CPM, PSM, TNMM) & Range Concept
"""
import json
import os

day_data = {
    "day": 16,
    "title": "Transfer Pricing & Arm's Length Principle (ALP): Section 92C & 5 Statutory Methods",
    "parts": [
        {
            "title": "Associated Enterprises & International Transactions (Sections 92A & 92B)",
            "say": [
                "In multinational enterprise taxation, cross-border intra-group pricing is strictly governed by the transfer pricing regime under Chapter X (Sections 92 to 92F) of the Income Tax Act. The primary statutory trigger is the existence of two or more Associated Enterprises (AEs) engaging in an international transaction. Under Section 92A(1), enterprises are associated if one enterprise participates, directly or indirectly, in the management, control, or capital of the other.",
                "To prevent artificial avoidance through formal shareholding manipulation, Section 92A(2) establishes 13 objective deemed association criteria. These include direct or indirect shareholding holding not less than 26% of voting power, advancement of loans constituting not less than 51% of total asset book value, appointment of more than half the board of directors or one executive director, total reliance on licensed intellectual property or manufacturing patents, or supply of over 90% of raw materials under dictated terms.",
                "Under Section 92B, an international transaction encompasses transactions between two or more associated enterprises—either or both of whom are non-residents—in the nature of purchase, sale, or lease of tangible or intangible property, provision of services, lending or borrowing money, or cost-sharing arrangements. Crucially, the Finance Act expanded this to deemed international transactions under Section 92B(2) where an enterprise deals with an unrelated third party pursuant to a prior agreement or terms determined in substance with its AE.",
                "Enterprise tax directors must conduct exhaustive transaction inventories at the commencement of each fiscal year. Documenting contract terms, risk allocation profiles, and economic ownership across global affiliates establishes the jurisdictional foundation required to defend transfer pricing filings under Form 3CEB during statutory transfer pricing audits."
            ],
            "example": "Multinational TechCorp US owns 28% of TechCorp India and licenses proprietary semiconductor designs. Because shareholding exceeds 26% and proprietary IP dictates operations under Section 92A(2), all inter-company royalty payments and engineering service billings constitute international transactions subject to arm's length scrutiny under Section 92.",
            "code": '''def evaluate_associated_enterprise(equity_pct: float, loan_pct_of_assets: float, board_control_pct: float, ip_dependent: bool) -> dict:
    criteria_met = []
    if equity_pct >= 26.0:
        criteria_met.append(f"Sec 92A(2)(a): Equity shareholding {equity_pct}% >= 26%")
    if loan_pct_of_assets >= 51.0:
        criteria_met.append(f"Sec 92A(2)(c): Debt/asset ratio {loan_pct_of_assets}% >= 51%")
    if board_control_pct > 50.0:
        criteria_met.append(f"Sec 92A(2)(e): Board appointment {board_control_pct}% > 50%")
    if ip_dependent:
        criteria_met.append("Sec 92A(2)(g): Manufacturing 100% dependent on AE patent/IP")
        
    is_associated = len(criteria_met) > 0
    return {
        "is_associated_enterprise": is_associated,
        "criteria_triggered": criteria_met,
        "compliance_requirement": "Form 3CEB & Local File Mandatory" if is_associated else "Exempt from TP"
    }

res = evaluate_associated_enterprise(equity_pct=28.5, loan_pct_of_assets=42.0, board_control_pct=30.0, ip_dependent=True)
print(f"AE Status: {res['is_associated_enterprise']}")
for c in res['criteria_triggered']:
    print(f"  Triggered: {c}")
print(f"Action: {res['compliance_requirement']}")
''',
            "tryIt": "Modify equity_pct to 22.0% and ip_dependent to False, but increase loan_pct_of_assets to 55.0% to observe deemed association via debt leverage under Section 92A(2)(c).",
            "check": {
                "question": "Under Section 92A(2)(a) and (c) of the Income Tax Act, which parameter automatically deems two corporate entities as Associated Enterprises (AE)?",
                "options": [
                    "Direct or indirect holding of at least 26% voting power, or loans advanced constituting at least 51% of total asset book value",
                    "Direct holding of at least 51% equity, or loans advanced exceeding 25% of annual operating revenue",
                    "Common board representation of at least 15%, or trade credit terms exceeding 90 days across borders",
                    "Exclusive distribution rights spanning a minimum of 3 consecutive calendar years without capital ownership"
                ],
                "answerIndex": 0,
                "why": "Section 92A(2)(a) establishes the 26% voting power threshold, and Section 92A(2)(c) establishes the 51% book value asset debt threshold as conclusive statutory triggers for deemed association."
            }
        },
        {
            "title": "Traditional Transaction Methods: CUP, RPM & Cost Plus (Section 92C(1)(a)-(c))",
            "say": [
                "Section 92C mandates that arm's length prices (ALP) in international transactions must be determined using the Most Appropriate Method (MAM) selected from five prescribed statutory methods under Rule 10B. Traditional transaction methods focus directly on the prices or gross profit markups realized in comparable uncontrolled transactions, providing the highest evidentiary directness when robust transaction-level data exists.",
                "The Comparable Uncontrolled Price (CUP) method under Rule 10B(1)(a) evaluates the exact unit price charged or paid in an uncontrolled transaction under identical or closely comparable economic conditions. CUP is the gold standard for standardized commodities, financial interest rates, and listed raw materials. However, CUP is exceptionally vulnerable to minor differences in volume discounts, delivery terms (FOB vs CIF), credit periods, and geographic markets, requiring rigorous economic adjustments under Rule 10B(1)(a)(iii).",
                "The Resale Price Method (RPM) under Rule 10B(1)(b) applies primarily to wholesale distributors and marketers who purchase finished goods from foreign AEs and resell them to independent third parties without substantial value addition. The ALP is computed by subtracting the comparable uncontrolled distributor's gross profit margin from the ultimate resale price, adjusting for warranty obligations, freight costs, and inventory holding risks.",
                "The Cost Plus Method (CPM) under Rule 10B(1)(c) is tailored for contract manufacturers, toll processors, and shared service providers who incur direct and indirect production costs on behalf of foreign AEs. Under CPM, the arm's length gross markup earned by comparable independent manufacturers is added to the enterprise's validated cost of production. Ensuring consistent cost accounting classifications between direct production costs and operating overheads across comparable companies is paramount."
            ],
            "example": "An Indian electronics distributor imports laptops from its Taiwan AE at $800 each and resells them locally for $950. Independent consumer electronics distributors in India earn an average gross margin of 20% on resale. Under RPM, the Arm's Length import price is $950 * (1 - 0.20) = $760. The $40 difference ($800 - $760) per unit represents an upward transfer pricing adjustment to Indian taxable income.",
            "code": '''def calculate_rpm_adjustment(resale_price: float, import_price: float, comp_gross_margin_pct: float, units_sold: int) -> dict:
    arm_length_margin = resale_price * (comp_gross_margin_pct / 100.0)
    arm_length_purchase_price = resale_price - arm_length_margin
    excess_cost_per_unit = max(0.0, import_price - arm_length_purchase_price)
    total_tp_addition = excess_cost_per_unit * units_sold
    
    return {
        "resale_price": resale_price,
        "actual_import_price": import_price,
        "arm_length_purchase_price": arm_length_purchase_price,
        "excess_cost_per_unit": excess_cost_per_unit,
        "total_upward_tp_adjustment": total_tp_addition
    }

rpm_res = calculate_rpm_adjustment(resale_price=950.0, import_price=800.0, comp_gross_margin_pct=20.0, units_sold=25000)
print(f"Arm's Length Import Price: ${rpm_res['arm_length_purchase_price']:.2f}")
print(f"Excess Cost / Unit: ${rpm_res['excess_cost_per_unit']:.2f}")
print(f"Total Upward TP Adjustment to Income: INR {rpm_res['total_upward_tp_adjustment'] * 85.0:,.2f} (USD {rpm_res['total_upward_tp_adjustment']:,.2f})")
''',
            "tryIt": "Adjust comp_gross_margin_pct to 15.0% and evaluate how the lower comparable gross margin increases the allowable Arm's Length purchase price to $807.50, eliminating the transfer pricing addition.",
            "check": {
                "question": "A contract distributor buys finished goods from its overseas AE at $500/unit and resells to Indian retailers at $600/unit. Independent distributors earn a 25% gross margin on resale. Under RPM, what is the Arm's Length purchase price and resulting adjustment?",
                "options": [
                    "ALP is $450 ($600 - 25%); excess purchase price of $50/unit is added back to taxable income",
                    "ALP is $500 ($600 - 16.6%); zero transfer pricing adjustment is required",
                    "ALP is $625 ($500 * 1.25); a downward adjustment reducing Indian taxable profit is claimed",
                    "ALP is $400 ($500 - $100); a flat 20% penalty is automatically levied on gross revenue"
                ],
                "answerIndex": 0,
                "why": "Under Rule 10B(1)(b), the arm's length price equals resale price minus comparable gross margin: $600 - (25% * $600) = $450. Paying $500 overstates cost by $50/unit, requiring an upward adjustment under Section 92C."
            }
        },
        {
            "title": "Profit-Based Methods: TNMM & Profit Split Method (Rule 10B(1)(d)-(e))",
            "say": [
                "When product differentiation, unique intellectual property, or lack of granular gross margin disclosures render traditional transaction methods impracticable, corporate tax practitioners turn to profit-based methods. The Transactional Net Margin Method (TNMM) under Rule 10B(1)(e) is by far the most widely deployed transfer pricing method in India, serving as the benchmark for IT/ITeS offshore development centers, pharmaceutical contract R&D, and engineering support services.",
                "TNMM examines the net operating profit margin realized by the tested party relative to an appropriate base, such as Operating Cost (Operating Profit to Total Cost or OP/TC), Operating Revenue (Operating Profit Margin or OP/OR), or Capital Employed (Return on Capital Employed or ROCE). The tested party is typically the least complex entity—the affiliate that does not own valuable non-routine intangibles and performs routine, predictable business functions.",
                "In contrast, the Profit Split Method (PSM) under Rule 10B(1)(d) applies to complex, integrated global business topologies where both associated enterprises contribute unique, non-routine intangibles, or where operations are so intertwined that single-sided benchmarking is economically meaningless. Under the Residual Profit Split approach, routine basic returns are first allocated to each entity for standard manufacturing or distribution activities, and the remaining residual entrepreneurial profit is split based on the relative economic value of each entity's IP, DEMPE contributions, or R&D expenditures.",
                "Selecting the Most Appropriate Method (MAM) under Rule 10C requires formal documentation in the Transfer Pricing Study Report. Tax authorities scrutinize whether the tested party was correctly selected, whether financial database search filters (e.g. Prowess, Capitaline) were applied objectively, and whether working capital adjustments under Rule 10B(1)(e)(iii) accurately eliminated differences in trade receivables and inventory holding days."
            ],
            "example": "FinTech India operates as an offshore software development center for FinTech UK. Incurring Rs 100 Crore in operating costs, FinTech India bills its UK parent Rs 112 Crore, reporting an OP/TC margin of 12.0%. A benchmarking search of 15 comparable software service providers reveals an arm's length interquartile range of 14.5% to 18.0%, with a median of 16.2%. Because 12.0% falls below the statutory 35th percentile, the transfer pricing officer increases Indian taxable profits to reflect the 16.2% median margin.",
            "code": '''def calculate_tnmm_adjustment(operating_cost: float, billed_revenue: float, comp_optc_margins: list) -> dict:
    actual_profit = billed_revenue - operating_cost
    actual_optc_pct = (actual_profit / operating_cost) * 100.0
    
    # Calculate Range Concept percentiles (35th, Median 50th, 65th)
    sorted_margins = sorted(comp_optc_margins)
    n = len(sorted_margins)
    p35_idx = int(0.35 * n)
    p50_idx = int(0.50 * n)
    p65_idx = int(0.65 * n)
    
    p35 = sorted_margins[p35_idx]
    median = sorted_margins[p50_idx]
    p65 = sorted_margins[p65_idx]
    
    in_range = p35 <= actual_optc_pct <= p65
    
    if in_range:
        tp_addition = 0.0
        arm_length_rev = billed_revenue
    else:
        # snap to median under Rule 10CA
        arm_length_optc = median
        arm_length_rev = operating_cost * (1.0 + (arm_length_optc / 100.0))
        tp_addition = max(0.0, arm_length_rev - billed_revenue)
        
    return {
        "actual_optc_pct": actual_optc_pct,
        "range_p35": p35,
        "median_p50": median,
        "range_p65": p65,
        "in_arm_length_range": in_range,
        "arm_length_revenue": arm_length_rev,
        "upward_tp_adjustment": tp_addition
    }

comps = [12.5, 13.8, 14.2, 14.8, 15.5, 16.0, 16.2, 16.8, 17.1, 17.5, 18.2, 19.0]
tnmm_res = calculate_tnmm_adjustment(operating_cost=100.0, billed_revenue=112.0, comp_optc_margins=comps)
print(f"Actual OP/TC Margin: {tnmm_res['actual_optc_pct']:.2f}%")
print(f"35th-65th Percentile Range: {tnmm_res['range_p35']:.2f}% - {tnmm_res['range_p65']:.2f}%, Median: {tnmm_res['median_p50']:.2f}%")
print(f"Within ALP Range: {tnmm_res['in_arm_length_range']}")
print(f"Upward TP Addition: INR {tnmm_res['upward_tp_adjustment']:.2f} Crores")
''',
            "tryIt": "Update billed_revenue to 115.0 Crores (15.0% OP/TC). Re-run to verify that falling within the 35th-65th percentile range reduces the upward TP addition to exactly 0.00.",
            "check": {
                "question": "Under Rule 10CA of the Income Tax Rules, if a taxpayer's tested margin falls outside the 35th to 65th percentile arm's length dataset range, to what value must the Arm's Length Price be adjusted?",
                "options": [
                    "The Median (50th percentile) of the comparable dataset",
                    "The 35th percentile boundary value of the dataset",
                    "The arithmetic mean of the entire dataset plus a statutory 3% tolerance band",
                    "The highest value within the 65th percentile range"
                ],
                "answerIndex": 0,
                "why": "Rule 10CA explicitly mandates that if the tested party's transaction price/margin falls outside the 35th-65th percentile range, the arm's length price is determined as the median (50th percentile) of the dataset."
            }
        },
        {
            "title": "The Arm's Length Range Concept & Tolerance Band (Rule 10CA & Sec 92C(2))",
            "say": [
                "Prior to the introduction of the Range Concept, Indian transfer pricing mandated the rigid arithmetic mean of all comparable uncontrolled prices, accompanied by a narrow +/-3% tolerance band (or +/-1% for wholesale traders). While the arithmetic mean remains applicable when the dataset contains fewer than six comparable entities, Rule 10CA established a statistically robust Range Concept for datasets containing six or more comparables.",
                "Under Rule 10CA, the comparable dataset is constructed by assembling financial data over a multiple-year period—specifically the current financial year and the two preceding financial years. The operating margins of the comparable companies are sorted in ascending order. The arm's length range begins at the 35th percentile and ends at the 65th percentile of the sorted distribution.",
                "If the transaction price or profit margin of the tested party falls within this 35th-to-65th percentile corridor, the transaction is deemed to satisfy the Arm's Length Principle, requiring zero adjustment. However, if the tested party's price or margin falls even one basis point outside this corridor, the tolerance band ceases to apply, and the arm's length price snaps strictly to the 50th percentile (Median) of the dataset.",
                "Corporate tax controllers must strategically manage multiple-year data aggregation. Leveraging multiple-year weighted averages smooths out temporary industry cyclicality and capacity underutilization spikes, preventing unjustified transfer pricing additions during adverse economic cycles."
            ],
            "example": "A company benchmarks its IT service export margin against 10 comparable firms whose 3-year weighted average margins are [10%, 12%, 13%, 14%, 15%, 16%, 17%, 18%, 20%, 22%]. With 10 entries, the 35th percentile is 14% and the 65th percentile is 17%. If the company reported 14.5%, it is 100% compliant. If it reported 13.8%, it is outside the range, and the TPO re-prices the contract to the median (15.5%), adding 1.7% to corporate taxable income.",
            "code": '''def evaluate_range_vs_tolerance(dataset: list, tested_price: float, is_wholesale: bool = False) -> dict:
    n = len(dataset)
    tolerance_pct = 1.0 if is_wholesale else 3.0
    
    if n >= 6:
        sorted_ds = sorted(dataset)
        p35 = sorted_ds[int(0.35 * n)]
        p50 = sorted_ds[int(0.50 * n)]
        p65 = sorted_ds[int(0.65 * n)]
        
        in_range = p35 <= tested_price <= p65
        final_alp = tested_price if in_range else p50
        method_used = "Range Concept (35th to 65th Percentile)"
    else:
        # Arithmetic mean with tolerance band under Sec 92C(2)
        mean_val = sum(dataset) / float(n)
        lower_bound = mean_val * (1.0 - (tolerance_pct / 100.0))
        upper_bound = mean_val * (1.0 + (tolerance_pct / 100.0))
        in_range = lower_bound <= tested_price <= upper_bound
        final_alp = tested_price if in_range else mean_val
        method_used = f"Arithmetic Mean with +/-{tolerance_pct}% Tolerance Band"
        
    return {
        "dataset_size": n,
        "method_used": method_used,
        "tested_price": tested_price,
        "is_compliant": in_range,
        "final_alp": final_alp,
        "adjustment_required": abs(final_alp - tested_price) if not in_range else 0.0
    }

ds_large = [100.0, 105.0, 110.0, 112.0, 115.0, 118.0, 122.0, 125.0]
res_range = evaluate_range_vs_tolerance(ds_large, tested_price=108.0)
print(f"Dataset Size >= 6: {res_range['method_used']}")
print(f"Compliant: {res_range['is_compliant']}, Final ALP: {res_range['final_alp']}, Adjustment: {res_range['adjustment_required']}")

ds_small = [100.0, 108.0, 112.0, 116.0]
res_mean = evaluate_range_vs_tolerance(ds_small, tested_price=103.0)
print(f"\nDataset Size < 6: {res_mean['method_used']}")
print(f"Compliant: {res_mean['is_compliant']}, Final ALP: {res_mean['final_alp']:.2f}, Adjustment: {res_mean['adjustment_required']:.2f}")
''',
            "tryIt": "Modify ds_small tested_price to 106.0 and verify compliance under the +/-3% tolerance band around the arithmetic mean (109.0 * 0.97 = 105.73).",
            "check": {
                "question": "When does the Arithmetic Mean with +/-3% tolerance band apply instead of the 35th-65th percentile Range Concept under Section 92C and Rule 10CA?",
                "options": [
                    "When the dataset of comparable uncontrolled entities contains fewer than 6 entries",
                    "When the transaction involves wholesale trading of agricultural commodities",
                    "When the taxpayer has entered into an active Advance Pricing Agreement (APA)",
                    "When the enterprise is registered as an export unit under Section 10AA"
                ],
                "answerIndex": 0,
                "why": "Rule 10CA(1) explicitly provides that the range concept applies only when there are at least 6 comparable entities; if there are fewer than 6, the arithmetic mean under Section 92C(2) applies."
            }
        },
        {
            "title": "Three-Tier TP Documentation & Form 3CEB Compliance (Sec 92D & Rule 10DA)",
            "say": [
                "Pursuant to OECD BEPS Action 13 recommendations, India incorporated a rigorous three-tier transfer pricing documentation architecture under Section 92D and Rule 10DA. Global corporate groups must orchestrate three distinct layers of transfer pricing documentation to satisfy statutory audit standards: the Local File, the Master File, and Country-by-Country Reporting (CbCR).",
                "The Local File represents the granular domestic documentation report, certifying the economic analysis of international transactions entered into by the Indian entity. Form 3CEB—the statutory chartered accountant certification under Section 92E—must be digitally filed on the income tax portal on or before October 31 following the relevant assessment year, disclosing transaction values, method selections, and AE identifiers.",
                "The Master File (Form 3CEAA) provides tax authorities with a high-level global overview of the multinational enterprise group, detailing organizational structure, global value chains, drivers of business profit, intangibles ownership (DEMPE functions), and centralized financing arrangements. Filing is mandatory for corporate groups with consolidated group revenue exceeding Rs 500 Crore AND aggregate international transactions exceeding Rs 50 Crore (or intangible transactions exceeding Rs 10 Crore).",
                "Country-by-Country Reporting (CbCR in Form 3CEAD) mandates tax disclosure of global revenue, profit before tax, income taxes paid, stated capital, accumulated earnings, and employee headcount across every tax jurisdiction where the group operates. CbCR applies to multinational groups with consolidated group revenue exceeding Rs 6,400 Crore (approx. 750M EUR), creating complete transparency for tax authorities."
            ],
            "example": "A multinational group with Rs 1,200 Crore consolidated global revenue and Rs 75 Crore in Indian inter-company transactions must file: (1) Form 3CEB Local File certification, and (2) Form 3CEAA Master File Part A & Part B. Because group revenue is under Rs 6,400 Crore, it is exempt from Form 3CEAD CbCR filing.",
            "code": '''def evaluate_tp_compliance_tiers(group_global_turnover_cr: float, local_tx_value_cr: float, intangible_tx_cr: float) -> dict:
    # Tier 1: Local File & Form 3CEB
    local_file_required = local_tx_value_cr > 0.0
    
    # Tier 2: Master File (Rule 10DA) - Group Turnover > 500 Cr AND (Local Tx > 50 Cr OR Intangibles > 10 Cr)
    mf_threshold_met = (group_global_turnover_cr > 500.0) and (local_tx_value_cr > 50.0 or intangible_tx_cr > 10.0)
    
    # Tier 3: CbCR (Section 286) - Consolidated Group Turnover > 6,400 Cr
    cbcr_required = group_global_turnover_cr >= 6400.0
    
    return {
        "form_3ceb_local_file": "Mandatory" if local_file_required else "Not Applicable",
        "form_3ceaa_master_file": "Mandatory" if mf_threshold_met else "Exempt",
        "form_3cead_cbcr": "Mandatory" if cbcr_required else "Exempt",
        "statutory_filing_deadline": "October 31 (Local File) / November 30 (Master File / CbCR)"
    }

tp_filings = evaluate_tp_compliance_tiers(group_global_turnover_cr=1200.0, local_tx_value_cr=75.0, intangible_tx_cr=12.0)
print("Transfer Pricing Documentation Matrix:")
print(f"  Form 3CEB (Local File): {tp_filings['form_3ceb_local_file']}")
print(f"  Form 3CEAA (Master File): {tp_filings['form_3ceaa_master_file']}")
print(f"  Form 3CEAD (CbCR): {tp_filings['form_3cead_cbcr']}")
print(f"  Deadlines: {tp_filings['statutory_filing_deadline']}")
''',
            "tryIt": "Increase group_global_turnover_cr to 7000.0 Cr to observe Form 3CEAD CbCR triggering across the multinational enterprise group.",
            "check": {
                "question": "What are the statutory consolidated group turnover and international transaction thresholds that trigger mandatory Master File filing (Form 3CEAA) in India under Rule 10DA?",
                "options": [
                    "Consolidated group turnover exceeding Rs 500 Crore AND aggregate international transactions exceeding Rs 50 Crore (or intangibles exceeding Rs 10 Crore)",
                    "Consolidated group turnover exceeding Rs 6,400 Crore AND international transactions exceeding Rs 100 Crore",
                    "Domestic company turnover exceeding Rs 250 Crore AND export turnover exceeding Rs 25 Crore",
                    "Any company with cross-border related party transactions exceeding Rs 1 Crore"
                ],
                "answerIndex": 0,
                "why": "Rule 10DA(1) explicitly establishes the twin threshold: consolidated group revenue > Rs 500 Crore AND international transactions > Rs 50 Crore (or intangible property transactions > Rs 10 Crore)."
            }
        }
    ]
}

with open("scripts/bcom_tax_day16_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day16_data.json")
