"""
Build Day 19 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Permanent Establishment (PE), Attribution of Profits & Digital Taxation (Equalisation Levy / SEP)
"""
import json
import os

day_data = {
    "day": 19,
    "title": "Permanent Establishment (PE), Profit Attribution & Digital Taxation (Equalisation Levy & SEP)",
    "parts": [
        {
            "title": "Permanent Establishment Typologies: Fixed Place, Service & Agency PE (Article 5)",
            "say": [
                "Under international tax law codified in Article 7 of double tax conventions, the business profits of a non-resident foreign enterprise are taxable in the source country if and only if the foreign enterprise carries on business in that country through a Permanent Establishment (PE) situated therein. Article 5 defines a PE as a fixed place of business through which the business of an enterprise is wholly or partly carried on.",
                "Tax jurisprudence categorizes PEs into four primary typologies: (1) Fixed Place PE under Article 5(1), requiring a physical location (office, factory, workshop, or server room) with a degree of permanence and at the disposal of the foreign enterprise; (2) Construction or Installation PE under Article 5(3), triggered when a building site or assembly project continues beyond a specified duration (typically 6 months in UN Model or 12 months in OECD Model); (3) Service PE, triggered when foreign personnel furnish managerial or technical services within the country for a period exceeding prescribed thresholds (e.g. 90 or 183 days within any 12-month period); and (4) Dependent Agent PE (DAPE) under Article 5(5).",
                "The Dependent Agent PE standard was significantly broadened post-BEPS Action 7 and the MLI. A foreign enterprise is deemed to have a DAPE if a person acting on its behalf habitually concludes contracts, or habitually plays the principal role leading to the conclusion of contracts that are routinely approved without material modification by the foreign enterprise.",
                "Multinational corporate groups must actively monitor cross-border business traveler days, executive contract negotiation footprints, and local affiliate authority limits. An inadvertent PE trigger subjects the foreign parent to direct corporate tax assessment in India at the foreign company headline rate of 40% (plus applicable surcharge and cess)."
            ],
            "example": "A US cloud analytics provider sends solutions architects to India to assist local enterprise clients. The consultants spend an aggregate of 120 days in India over a 9-month period. Under Article 5(2)(l) of the India-US DTAA, providing services for more than 90 days creates a Service PE, stripping the US parent of its treaty business profit exemption and subjecting its Indian-sourced revenue to domestic tax.",
            "code": '''def evaluate_pe_exposure(fixed_office_disposal: bool, construction_months: float, service_days: int, habitually_concludes_contracts: bool) -> dict:
    pe_types_triggered = []
    
    if fixed_office_disposal:
        pe_types_triggered.append("Fixed Place PE (Article 5(1)): Premises at disposal with degree of permanence")
    if construction_months > 6.0:
        pe_types_triggered.append(f"Construction PE (Article 5(3)): Duration {construction_months} months > 6-month threshold")
    if service_days > 90:
        pe_types_triggered.append(f"Service PE (Article 5(2)(l)): Foreign personnel {service_days} days > 90-day threshold")
    if habitually_concludes_contracts:
        pe_types_triggered.append("Dependent Agent PE (Article 5(5)): Authority to conclude or negotiate key contract terms")
        
    has_pe = len(pe_types_triggered) > 0
    return {
        "pe_created": has_pe,
        "taxable_in_india": "Yes - Subject to Section 9(1)(i) & Article 7" if has_pe else "No - Exempt under Article 7(1)",
        "triggered_pe_forms": pe_types_triggered,
        "foreign_tax_rate_bracket": "40% Base + Surcharge + Cess" if has_pe else "0% (Exempt)"
    }

pe_eval = evaluate_pe_exposure(fixed_office_disposal=False, construction_months=4.0, service_days=115, habitually_concludes_contracts=False)
print(f"PE Created: {pe_eval['pe_created']}")
print(f"Taxability Status: {pe_eval['taxable_in_india']}")
for form in pe_eval['triggered_pe_forms']:
    print(f"  -> {form}")
print(f"Applicable Rate: {pe_eval['foreign_tax_rate_bracket']}")
''',
            "tryIt": "Set service_days to 75 to verify that keeping personnel presence below the 90-day threshold avoids creating a Service PE under the India-US DTAA.",
            "check": {
                "question": "What is the primary legal consequence under Article 7 of a DTAA if a foreign enterprise is determined to have a Permanent Establishment (PE) in India?",
                "options": [
                    "The business profits of the foreign enterprise attributable to that PE become directly taxable in India",
                    "The foreign enterprise is immediately required to incorporate an Indian subsidiary company",
                    "All worldwide profits of the foreign parent become taxable in India regardless of economic source",
                    "The enterprise is permanently disqualified from claiming foreign tax credits in its home country"
                ],
                "answerIndex": 0,
                "why": "Article 7(1) of standard DTAAs establishes that if a foreign enterprise carries on business through a PE in the source state, so much of its business profits as are attributable to that PE may be taxed in the source state."
            }
        },
        {
            "title": "Attribution of Profits to PE & FAR Analysis (Rule 10(iii) & Rule 10B)",
            "say": [
                "Once the existence of a Permanent Establishment is established, the critical statutory challenge shifts to Profit Attribution—quantifying precisely what portion of the foreign enterprise's global revenue and profits are economically attributable to the activities carried out by the PE in India.",
                "Under Article 7(2) of the OECD/UN Models and Rule 10(iii) of the Income Tax Rules, profits attributable to a PE are those profits which it might be expected to make if it were a distinct and separate enterprise engaged in the same or similar activities under the same or similar conditions, dealing wholly independently with the foreign enterprise (the Authorized OECD Approach or AOA).",
                "Profit attribution is anchored in Functions, Assets, and Risks (FAR) Analysis. Tax authorities map the specific economic functions performed by Indian personnel, the tangible and intangible assets deployed in India, and the operational and financial risks assumed locally. In the landmark Supreme Court ruling Formula One World Championship Ltd. v. CIT and the historic Morgan Stanley precedent, the Court affirmed that if an Indian affiliate is remunerated at arm's length under transfer pricing rules for all functions performed, assets deployed, and risks assumed, no further profits can be attributed to the foreign enterprise.",
                "However, if the Indian dependent agent or branch performs significant marketing, contract negotiation, or risk-mitigation functions without receiving full arm's length compensation, additional entrepreneurial profits must be attributed to the PE using fractional apportionment formulas under Rule 10(iii)."
            ],
            "example": "Foreign Corp sells $100 Million of industrial machinery in India, realizing $20 Million in global profit. Its Indian liaison office is recharacterized as a Dependent Agent PE. The Indian entity was paid a routine cost-plus service fee of $2 Million. An economic FAR analysis reveals that 30% of the sales generation functions occurred in India. Attributable profit is 30% * $20M = $6M. Crediting the $2M already taxed locally, an additional $4 Million is attributed to the PE and taxed at 40%.",
            "code": '''def calculate_pe_profit_attribution(global_sales_usd: float, global_operating_profit_usd: float, far_attribution_pct: float, routine_remuneration_paid_usd: float) -> dict:
    # Attributable profits under Article 7(2) based on FAR weights
    attributable_profit = global_operating_profit_usd * (far_attribution_pct / 100.0)
    
    # Morgan Stanley Principle: Credit routine arm's length fee already taxed in India
    incremental_pe_profit = max(0.0, attributable_profit - routine_remuneration_paid_usd)
    
    # Foreign company tax rate: 40% + 2% Surcharge (if > 1 Cr) + 4% Cess = 42.432%
    effective_foreign_tax_rate = 40.0 * 1.02 * 1.04
    incremental_tax_usd = incremental_pe_profit * (effective_foreign_tax_rate / 100.0)
    
    return {
        "global_profit_usd": global_operating_profit_usd,
        "far_allocation_pct": far_attribution_pct,
        "total_attributable_profit_usd": attributable_profit,
        "routine_fee_credited_usd": routine_remuneration_paid_usd,
        "incremental_pe_taxable_profit_usd": incremental_pe_profit,
        "effective_foreign_tax_rate_pct": effective_foreign_tax_rate,
        "incremental_indian_tax_usd": incremental_tax_usd
    }

attr_res = calculate_pe_profit_attribution(
    global_sales_usd=100000000.0,
    global_operating_profit_usd=20000000.0,
    far_attribution_pct=30.0,
    routine_remuneration_paid_usd=2000000.0
)
print(f"Total Profit Attributable to PE: USD {attr_res['total_attributable_profit_usd']:,.2f}")
print(f"Less: Routine Fee Credited: USD {attr_res['routine_fee_credited_usd']:,.2f}")
print(f"Incremental Taxable PE Profit: USD {attr_res['incremental_pe_taxable_profit_usd']:,.2f}")
print(f"Incremental Indian Tax Liability: USD {attr_res['incremental_indian_tax_usd']:,.2f} ({attr_res['effective_foreign_tax_rate_pct']:.3f}%)")
''',
            "tryIt": "Increase routine_remuneration_paid_usd to 6000000.0 to verify that paying full arm's length compensation for all local FAR completely eliminates incremental PE profit attribution.",
            "check": {
                "question": "What principle was established by the Supreme Court of India in the landmark Morgan Stanley case regarding PE profit attribution?",
                "options": [
                    "If an Indian affiliate is adequately compensated at arm's length considering all functions performed, assets used, and risks assumed, no further profits can be attributed to the foreign enterprise's PE",
                    "A foreign enterprise is always taxed on 100% of its global revenues whenever a PE exists in India",
                    "Profit attribution is strictly limited to 1% of gross transaction turnover",
                    "Indian affiliates are completely exempt from transfer pricing audits if a PE is recognized"
                ],
                "answerIndex": 0,
                "why": "The Supreme Court in Morgan Stanley held that if an associated enterprise is remunerated on an arm's length basis taking into account all functions, assets, and risks, no further profits remain attributable to the PE."
            }
        },
        {
            "title": "Digital Economy Taxation & Equalisation Levy Architecture",
            "say": [
                "Traditional international tax treaties were constructed around physical nexus—brick-and-mortar factories and physical offices. In the digital economy, multinational tech giants generate billions in revenue from consumer data, digital advertising, and e-commerce platforms without having any physical presence or personnel in the market jurisdiction. To address this mismatch, India became a global pioneer in unilateral digital taxation.",
                "Enacted under Chapter VIII of Finance Act 2016, Equalisation Levy 1.0 imposed a 6% tax on gross consideration paid by an Indian resident to a non-resident for specified digital advertising services, provided the annual aggregate payments exceed Rs 1 Lakh. The Indian advertiser is responsible for deducting the 6% levy at source and remitting it to the government.",
                "Finance Act 2020 expanded this framework by introducing Equalisation Levy 2.0 (the 2% e-commerce levy). Equalisation Levy 2.0 applies at a 2% rate to the gross consideration received or receivable by a non-resident e-commerce operator from e-commerce supply or services provided to Indian residents, persons using an Indian IP address, or non-residents in targeted instances. The levy applies if the foreign e-commerce operator's gross turnover exceeds Rs 2 Crore in the financial year.",
                "Importantly, Section 10(50) of the Income Tax Act exempts any income arising from digital transactions subject to Equalisation Levy from regular income tax, eliminating double taxation. However, foreign tech firms face extensive compliance overhead in tracking gross transactional value and quarterly payment schedules."
            ],
            "example": "An Indian online retailer pays Rs 50 Lakh to a foreign search engine for targeted digital advertising. Because annual payments exceed Rs 1 Lakh, the Indian firm must deduct 6% Equalisation Levy (Rs 3 Lakh) and remit it by the 7th of the following month. For the foreign search engine, the remaining Rs 47 Lakh is 100% exempt from Indian corporate income tax under Section 10(50).",
            "code": '''def calculate_equalisation_levy(is_digital_advertising: bool, is_ecommerce_supply: bool, gross_value_inr: float) -> dict:
    if is_digital_advertising:
        threshold = 100000.0  # Rs 1 Lakh
        rate = 6.0
        levy_type = "Equalisation Levy 1.0 (Digital Advertising)"
        deductor = "Indian Payor (Withholding Mechanism)"
    elif is_ecommerce_supply:
        threshold = 20000000.0  # Rs 2 Crore
        rate = 2.0
        levy_type = "Equalisation Levy 2.0 (E-Commerce Operator)"
        deductor = "Foreign E-Commerce Operator (Direct Payment)"
    else:
        return {"applicable": False, "reason": "Not a covered digital supply"}
        
    applicable = gross_value_inr > threshold
    levy_amount = (gross_value_inr * (rate / 100.0)) if applicable else 0.0
    
    return {
        "levy_type": levy_type,
        "applicable": applicable,
        "gross_value_inr": gross_value_inr,
        "statutory_threshold_inr": threshold,
        "rate_pct": rate,
        "equalisation_levy_inr": levy_amount,
        "compliance_mechanism": deductor,
        "income_tax_exemption": "Exempt from regular Income Tax under Sec 10(50)" if applicable else "Subject to Income Tax"
    }

el_res1 = calculate_equalisation_levy(is_digital_advertising=True, is_ecommerce_supply=False, gross_value_inr=5000000.0)
print(f"{el_res1['levy_type']}: Applicable = {el_res1['applicable']}")
print(f"Levy Due: INR {el_res1['equalisation_levy_inr']:,.2f} ({el_res1['rate_pct']}%) via {el_res1['compliance_mechanism']}")

el_res2 = calculate_equalisation_levy(is_digital_advertising=False, is_ecommerce_supply=True, gross_value_inr=85000000.0)
print(f"\n{el_res2['levy_type']}: Applicable = {el_res2['applicable']}")
print(f"Levy Due: INR {el_res2['equalisation_levy_inr']:,.2f} ({el_res2['rate_pct']}%) via {el_res2['compliance_mechanism']}")
''',
            "tryIt": "Set gross_value_inr in el_res2 to 15000000.0 (Rs 1.5 Cr) to verify that falling below the Rs 2 Crore threshold renders Equalisation Levy 2.0 inapplicable.",
            "check": {
                "question": "What is the tax rate and threshold for Equalisation Levy 2.0 applicable to non-resident e-commerce operators?",
                "options": [
                    "2% on gross consideration, applicable if annual e-commerce turnover exceeds Rs 2 Crore",
                    "6% on gross consideration, applicable if annual payments exceed Rs 1 Lakh",
                    "15% on net operating profits, applicable to entities with over 100,000 active Indian users",
                    "5% on commission revenue, applicable to all transactions exceeding $10,000"
                ],
                "answerIndex": 0,
                "why": "Equalisation Levy 2.0 under Finance Act 2020 levies a 2% tax on gross consideration from e-commerce supply or services received by a non-resident operator whose annual turnover exceeds Rs 2 Crore."
            }
        },
        {
            "title": "Significant Economic Presence (SEP) Nexus under Section 9(1)(i)",
            "say": [
                "To establish a comprehensive domestic tax nexus for digital businesses that bypasses traditional physical PE concepts, Finance Act 2018 inserted Explanation 2A to Section 9(1)(i), introducing the doctrine of Significant Economic Presence (SEP). SEP enacts a bold statutory paradigm shift: economic participation in India creates a taxable business connection regardless of whether the non-resident has a residence, physical place of business, or renders services in India.",
                "Under Rule 11UD, Significant Economic Presence is established if a non-resident crosses either of two statutory thresholds: (1) Transaction Threshold: Any transaction in respect of goods, services, or property carried out by a non-resident with any person in India, including provision of download of data or software in India, if the aggregate payments arising from such transactions exceed Rs 2 Crore in the financial year; or",
                "(2) User Threshold: Systematic and continuous soliciting of business activities or engaging in interaction with Indian users through digital means, if the number of active Indian users exceeds 300,000.",
                "However, multinational tax directors must note the critical constitutional interplay between SEP and DTAAs under Section 90(2). While SEP expands India's domestic tax net under the Income Tax Act, bilateral tax treaties still define a Permanent Establishment using traditional physical and agency criteria. Consequently, if a foreign tech firm is resident in a jurisdiction with which India has a DTAA, the foreign firm can invoke Section 90(2) to shield its profits from SEP taxation, unless the treaty itself is modified by the UN/OECD Pillar One framework."
            ],
            "example": "A gaming company incorporated in the Cayman Islands (no DTAA with India) operates a freemium mobile app with 1,500,000 active Indian users, earning Rs 1.5 Crore in virtual purchases. Because active users exceed 300,000, SEP is triggered under Rule 11UD. Having no treaty protection, its Indian-attributable profits are directly taxable in India under Section 9(1)(i).",
            "code": '''def evaluate_sep_nexus(transaction_revenue_inr: float, active_indian_users: int, is_treaty_jurisdiction: bool) -> dict:
    # Rule 11UD Thresholds
    tx_threshold = 20000000.0  # Rs 2 Crore
    user_threshold = 300000     # 3 Lakh users
    
    tx_triggered = transaction_revenue_inr > tx_threshold
    user_triggered = active_indian_users > user_threshold
    sep_created = tx_triggered or user_triggered
    
    triggers = []
    if tx_triggered:
        triggers.append(f"Revenue INR {transaction_revenue_inr:,.2f} > Rs 2 Cr threshold")
    if user_triggered:
        triggers.append(f"User Base {active_indian_users:,} > 300,000 threshold")
        
    if not sep_created:
        return {"sep_triggered": False, "status": "No SEP: Below both statutory thresholds", "taxable_in_india": False}
        
    # Treaty protection check under Section 90(2)
    if is_treaty_jurisdiction:
        taxable = False
        status = "SEP created under domestic law, but protected by Article 7 physical PE requirement in DTAA"
    else:
        taxable = True
        status = "SEP created with NO Treaty Protection: Business connection taxable under Sec 9(1)(i)"
        
    return {
        "sep_triggered": True,
        "criteria_met": triggers,
        "treaty_protected": is_treaty_jurisdiction,
        "taxable_in_india": taxable,
        "adjudication_status": status
    }

sep_case1 = evaluate_sep_nexus(transaction_revenue_inr=15000000.0, active_indian_users=1500000, is_treaty_jurisdiction=False)
print(f"Non-Treaty Jurisdiction (Cayman): SEP Triggered = {sep_case1['sep_triggered']}")
print(f"Taxable in India: {sep_case1['taxable_in_india']} | {sep_case1['adjudication_status']}")

sep_case2 = evaluate_sep_nexus(transaction_revenue_inr=35000000.0, active_indian_users=500000, is_treaty_jurisdiction=True)
print(f"\nTreaty Jurisdiction (US/UK): SEP Triggered = {sep_case2['sep_triggered']}")
print(f"Taxable in India: {sep_case2['taxable_in_india']} | {sep_case2['adjudication_status']}")
''',
            "tryIt": "Set transaction_revenue_inr to 18000000.0 and active_indian_users to 250000 to verify that falling below both thresholds prevents SEP triggering.",
            "check": {
                "question": "What are the two alternative statutory thresholds prescribed under Rule 11UD for triggering Significant Economic Presence (SEP) in India?",
                "options": [
                    "Aggregate transaction value exceeding Rs 2 Crore OR active Indian user count exceeding 300,000",
                    "Aggregate transaction value exceeding Rs 10 Crore OR active Indian user count exceeding 1,000,000",
                    "Export turnover exceeding Rs 5 Crore OR data download volume exceeding 50 Terabytes",
                    "Physical server hosting in India for more than 6 consecutive months"
                ],
                "answerIndex": 0,
                "why": "Rule 11UD explicitly establishes the twin alternative thresholds for SEP: (a) payments in respect of transactions exceeding Rs 2 Crore, or (b) digital user interaction with more than 300,000 Indian users."
            }
        },
        {
            "title": "OECD Pillar One & Global Digital Tax Consensus",
            "say": [
                "Because unilateral digital taxes like India's Equalisation Levy, France's Digital Services Tax (DST), and the UK's DST created international trade tensions and threats of retaliatory tariffs, the OECD/G20 Inclusive Framework launched the Two-Pillar Solution to Address the Tax Challenges Arising from the Digitalisation of the Economy.",
                "Pillar One reallocates taxing rights over a portion of the global residual profits of the largest and most profitable multinational enterprises (MNEs) to market jurisdictions where goods or services are used or consumed. Specifically, Amount A applies to multinational groups with global turnover exceeding 20 Billion EUR and profitability (PBT to revenue) exceeding 10%.",
                "Under Amount A, 25% of the group's residual profit above the 10% profitability threshold is reallocated to market jurisdictions based on local revenue sourcing. In exchange for the implementation of Amount A, participating countries—including India—committed to withdraw all unilateral digital services taxes and equalisation levies and refrain from introducing similar measures in the future.",
                "Corporate tax executives must track the transition timelines for the Pillar One Multilateral Convention (MLC). Preparing corporate reporting systems to handle Amount A revenue sourcing keys and marketing and distribution safe harbor calculations ensures a seamless transition into the global consensus era."
            ],
            "example": "MegaTech Global generates 50 Billion EUR in revenue with a 24% profit margin (12 Billion EUR PBT). The 10% routine margin baseline is 5 Billion EUR. Residual profit is 12B - 5B = 7 Billion EUR. Under Pillar One Amount A, 25% of residual profit (1.75 Billion EUR) is reallocated across market countries. If India represents 8% of global sales, India receives taxing rights over 140 Million EUR.",
            "code": '''def calculate_pillar_one_amount_a(global_revenue_eur: float, pbt_eur: float, market_sales_pct: float) -> dict:
    if global_revenue_eur < 20000000000.0:
        return {"in_scope": False, "status": "Exempt: Global revenue < 20 Billion EUR threshold"}
        
    margin_pct = (pbt_eur / global_revenue_eur) * 100.0
    if margin_pct <= 10.0:
        return {"in_scope": False, "status": f"Exempt: Profit margin {margin_pct:.2f}% <= 10% profitability threshold"}
        
    # Amount A Formula: 25% of residual profit above 10% margin
    routine_profit_eur = global_revenue_eur * 0.10
    residual_profit_eur = pbt_eur - routine_profit_eur
    allocable_pool_eur = residual_profit_eur * 0.25
    
    # Market country allocation based on local sales ratio
    market_allocation_eur = allocable_pool_eur * (market_sales_pct / 100.0)
    
    return {
        "in_scope": True,
        "global_revenue_eur": global_revenue_eur,
        "profit_margin_pct": margin_pct,
        "residual_profit_eur": residual_profit_eur,
        "global_allocable_pool_eur": allocable_pool_eur,
        "market_share_pct": market_sales_pct,
        "market_jurisdiction_amount_a_eur": market_allocation_eur,
        "policy_condition": "Requires permanent repeal of unilateral Equalisation Levy / DST"
    }

p1_res = calculate_pillar_one_amount_a(global_revenue_eur=50000000000.0, pbt_eur=12000000000.0, market_sales_pct=8.0)
print(f"Pillar One Scope: {p1_res['in_scope']}")
print(f"Global Allocable Amount A Pool (25% of Residual): EUR {p1_res['global_allocable_pool_eur']:,.2f}")
print(f"India Market Allocation (8% Share): EUR {p1_res['market_jurisdiction_amount_a_eur']:,.2f}")
print(f"Statutory Trade-off: {p1_res['policy_condition']}")
''',
            "tryIt": "Set global_revenue_eur to 18000000000.0 to verify that falling below 20 Billion EUR excludes the enterprise from Pillar One Amount A scope.",
            "check": {
                "question": "Under OECD Pillar One Amount A, what percentage of residual profit above the 10% profitability threshold is reallocated to market jurisdictions for in-scope multinationals?",
                "options": [
                    "25% of residual profit exceeding the 10% margin threshold",
                    "15% flat on total worldwide net income",
                    "50% of gross international royalties and technical fees",
                    "10% of total commercial revenues earned in developing economies"
                ],
                "answerIndex": 0,
                "why": "OECD Pillar One Amount A specifically allocates 25% of residual profit (profits in excess of 10% of revenue) to eligible market jurisdictions."
            }
        }
    ]
}

with open("scripts/bcom_tax_day19_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day19_data.json")
