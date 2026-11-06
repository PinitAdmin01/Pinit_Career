"""
Build Day 29 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Boardroom Tax Governance, Effective Tax Rate (ETR) Optimization & Ind AS 12 Deferred Taxes
"""
import json
import os

day_data = {
    "day": 29,
    "title": "Boardroom Tax Governance, Effective Tax Rate (ETR) Optimization & Ind AS 12 Deferred Taxes",
    "parts": [
        {
            "title": "Corporate Tax Strategy & ESG Tax Transparency in the Boardroom",
            "say": [
                "In contemporary corporate governance, corporate taxation has transitioned from a routine back-office compliance function into a core boardroom strategic agenda item. Institutional investors, sovereign wealth funds, and proxy advisory firms evaluate an enterprise's tax behavior through the lens of Environmental, Social, and Governance (ESG) criteria—specifically tax transparency, economic contribution, and fair share compliance.",
                "Board of Directors and Audit Committees bear direct fiduciary oversight over corporate tax policy. Boards must establish a formally documented Corporate Tax Strategy that balances two competing mandates: (1) protecting shareholder value through lawful optimization of the Effective Tax Rate (ETR) and capital expenditure tax shields; and (2) mitigating aggressive tax avoidance that exposes the enterprise to severe reputational damage, public controversy, and GAAR challenges.",
                "Under the Global Reporting Initiative (GRI) 207 Tax Standard and the Business Responsibility and Sustainability Report (BRSR) mandated by SEBI for top Indian listed companies, enterprises must publish transparent Country-by-Country tax metrics: total direct taxes paid, indirect taxes collected, tax incentives claimed, and effective tax rates across operational jurisdictions.",
                "Corporate tax leaders must articulate tax positions in boardroom language: presenting quantified risk-reward matrices, evaluating prospective M&A tax structures, and certifying that tax planning carries demonstrable commercial substance."
            ],
            "example": "A multinational corporation's audit committee reviews an IP migration strategy saving Rs 50 Crore annually through a zero-tax offshore jurisdiction. The Chief Tax Officer presents a GRI 207 ESG impact assessment, demonstrating that without authentic commercial substance, the arrangement risks GAAR invocation and ESG investor divestment. The board adopts an onshore hybrid structure with an effective 22% rate under Section 115BAA, preserving both capital and brand reputation.",
            "code": '''def evaluate_boardroom_tax_strategy(headline_tax_savings_cr: float, esg_reputation_risk_score: int, gaar_challenge_probability_pct: float, litigation_cost_reserve_cr: float) -> dict:
    # ESG Risk Score: 1 (Lowest Risk) to 10 (Extreme Risk)
    risk_weighted_gaar_exposure = headline_tax_savings_cr * (gaar_challenge_probability_pct / 100.0)
    net_economic_benefit_cr = headline_tax_savings_cr - risk_weighted_gaar_exposure - litigation_cost_reserve_cr
    
    if esg_reputation_risk_score >= 8 or gaar_challenge_probability_pct > 50.0:
        board_verdict = "REJECT STRATEGY: Disproportionate ESG reputational risk and aggressive anti-avoidance exposure"
        approved = False
    elif net_economic_benefit_cr <= 0.0:
        board_verdict = "REJECT STRATEGY: Negative risk-adjusted net economic return"
        approved = False
    else:
        board_verdict = "APPROVE WITH GOVERNANCE GUARDS: Commercial substance documented with robust audit defense"
        approved = True
        
    return {
        "headline_tax_savings_cr": headline_tax_savings_cr,
        "esg_risk_score": f"{esg_reputation_risk_score}/10",
        "gaar_risk_weighted_loss_cr": risk_weighted_gaar_exposure,
        "net_economic_value_cr": net_economic_benefit_cr,
        "board_recommendation": board_verdict,
        "is_board_approved": approved
    }

board_eval = evaluate_boardroom_tax_strategy(
    headline_tax_savings_cr=50.0,
    esg_reputation_risk_score=9,
    gaar_challenge_probability_pct=65.0,
    litigation_cost_reserve_cr=5.0
)
print("Boardroom Tax Governance & ESG Risk Matrix:")
print(f"  Headline Tax Savings: INR {board_eval['headline_tax_savings_cr']:.2f} Cr")
print(f"  ESG Reputational Risk: {board_eval['esg_risk_score']}")
print(f"  GAAR Expected Loss: INR {board_eval['gaar_risk_weighted_loss_cr']:.2f} Cr")
print(f"  Net Economic Value: INR {board_eval['net_economic_value_cr']:.2f} Cr")
print(f"  Boardroom Decision: {board_eval['board_recommendation']}")
''',
            "tryIt": "Reduce esg_reputation_risk_score to 4 and gaar_challenge_probability_pct to 15.0% to observe the strategy qualifying for Board approval.",
            "check": {
                "question": "What is the primary corporate governance focus of the GRI 207 Tax Standard and SEBI's BRSR framework for large listed enterprises?",
                "options": [
                    "Promoting public tax transparency, country-by-country tax contribution reporting, and alignment between tax planning and genuine economic activity",
                    "Mandating that corporations maintain zero cash balances in commercial bank accounts",
                    "Requiring corporations to eliminate all foreign sales subsidiaries",
                    "Authorizing tax authorities to appoint corporate directors"
                ],
                "answerIndex": 0,
                "why": "GRI 207 and BRSR require comprehensive disclosures on tax strategy, governance, country-by-country taxes paid, and the alignment of tax practices with commercial substance."
            }
        },
        {
            "title": "Effective Tax Rate (ETR) Architecture & Multi-Jurisdictional Modeling",
            "say": [
                "The Effective Tax Rate (ETR) is the foremost financial performance metric by which Chief Financial Officers and equity research analysts evaluate corporate tax efficiency. ETR represents total income tax expense divided by Accounting Profit Before Tax (PBT).",
                "Corporate tax executives distinguish between two primary ETR variants: (1) Accounting ETR, computed as Total Tax Expense (Current Tax + Deferred Tax) divided by PBT under Ind AS 12; and (2) Cash ETR, computed as Actual Cash Taxes Paid divided by PBT or Operating Cash Flow. A persistent divergence between Accounting ETR and Cash ETR highlights temporary timing differences, utilization of accumulated MAT credits under Section 115JAA, or accelerated tax depreciation shields under Section 32.",
                "In multi-jurisdictional conglomerates, the Consolidated Global ETR is a function of geographic profit mix, inter-company transfer pricing margins, and bilateral tax treaty withholdings. Tax planning aims to optimize global ETR while complying with OECD Pillar Two Global Anti-Base Erosion (GloBE) rules, which enforce a global minimum tax rate of 15% on in-scope multinational groups.",
                "Corporate controllers must maintain automated ETR sensitivity bridges, tracking how shifts between concessional regimes (Section 115BAA 22% vs Section 115BAB 15%), SEZ sunset expirations, and capital expenditure additions impact quarterly earnings per share (EPS)."
            ],
            "example": "A conglomerate generates Rs 100 Crore in Profit Before Tax. It incurs Current Tax of Rs 18 Crore (benefiting from accelerated depreciation) and recognizes Deferred Tax Liability of Rs 6 Crore under Ind AS 12. Total Tax Expense is Rs 24 Crore. Accounting ETR is 24.0% (24/100), while Cash ETR is 18.0% (18/100). The 6.0% gap represents deferred cash outflow that bolsters operating liquidity.",
            "code": '''def calculate_corporate_etr(pbt_cr: float, current_tax_cr: float, deferred_tax_cr: float, cash_taxes_paid_cr: float) -> dict:
    total_tax_expense_cr = current_tax_cr + deferred_tax_cr
    
    accounting_etr_pct = (total_tax_expense_cr / pbt_cr) * 100.0 if pbt_cr > 0 else 0.0
    cash_etr_pct = (cash_taxes_paid_cr / pbt_cr) * 100.0 if pbt_cr > 0 else 0.0
    
    cash_tax_savings_cr = total_tax_expense_cr - cash_taxes_paid_cr
    
    return {
        "profit_before_tax_cr": pbt_cr,
        "total_tax_expense_cr": total_tax_expense_cr,
        "accounting_etr_pct": accounting_etr_pct,
        "cash_taxes_paid_cr": cash_taxes_paid_cr,
        "cash_etr_pct": cash_etr_pct,
        "cash_liquidity_shield_cr": cash_tax_savings_cr,
        "pillar_two_minimum_safe": accounting_etr_pct >= 15.0
    }

etr_eval = calculate_corporate_etr(
    pbt_cr=100.0,
    current_tax_cr=18.0,
    deferred_tax_cr=6.0,
    cash_taxes_paid_cr=18.0
)
print("Effective Tax Rate (ETR) Financial Analysis:")
print(f"  Profit Before Tax (PBT): INR {etr_eval['profit_before_tax_cr']:.2f} Cr")
print(f"  Accounting ETR: {etr_eval['accounting_etr_pct']:.2f}% (Tax Expense: INR {etr_eval['total_tax_expense_cr']:.2f} Cr)")
print(f"  Cash ETR: {etr_eval['cash_etr_pct']:.2f}% (Cash Paid: INR {etr_eval['cash_taxes_paid_cr']:.2f} Cr)")
print(f"  Cash Liquidity Shield: INR {etr_eval['cash_liquidity_shield_cr']:.2f} Cr")
print(f"  OECD Pillar Two 15% Minimum Compliant: {etr_eval['pillar_two_minimum_safe']}")
''',
            "tryIt": "Set current_tax_cr to 12.0 and cash_taxes_paid_cr to 12.0 (with deferred tax 2.0) to observe Accounting ETR dropping to 14.0%, triggering Pillar Two top-up tax risks.",
            "check": {
                "question": "What is the key difference between Accounting Effective Tax Rate (ETR) and Cash Effective Tax Rate (Cash ETR)?",
                "options": [
                    "Accounting ETR reflects total tax expense (Current + Deferred Tax) divided by PBT, whereas Cash ETR reflects actual cash tax paid divided by PBT",
                    "Accounting ETR applies exclusively to partnership firms, while Cash ETR applies to public companies",
                    "Cash ETR is calculated before deducting employee salaries",
                    "There is zero difference; both terms represent identical financial metrics"
                ],
                "answerIndex": 0,
                "why": "Accounting ETR measures the total tax expense charged to P&L (including deferred tax under Ind AS 12), while Cash ETR measures the actual cash outflow remitted to tax authorities in the fiscal period."
            }
        },
        {
            "title": "Ind AS 12 Deferred Taxes: Temporary Differences & Balance Sheet Approach",
            "say": [
                "Under Indian Accounting Standard (Ind AS) 12: Income Taxes, corporate financial controllers must account for the current and future tax consequences of items recognized in the balance sheet. Ind AS 12 establishes a comprehensive Balance Sheet Liability Method, shifting accounting practice away from legacy P&L timing differences to balance sheet carrying value vs tax base comparisons.",
                "A Temporary Difference is the difference between the carrying amount of an asset or liability in the balance sheet and its tax base. Temporary differences are categorized into: (1) Taxable Temporary Differences, which result in taxable amounts in future periods when the asset is recovered or liability settled, giving rise to a Deferred Tax Liability (DTL); and (2) Deductible Temporary Differences, which result in deductible amounts in future periods, giving rise to a Deferred Tax Asset (DTA).",
                "The classic corporate driver of DTL is Depreciation: where accelerated tax depreciation under Section 32 exceeds straight-line accounting depreciation, the tax base of the asset is lower than its book carrying amount, creating a mandatory DTL. Conversely, statutory disallowances—such as Section 43B unpaid liabilities or Section 40(a)(ia) TDS defaults—carry a zero tax base until paid, creating a DTA.",
                "Recognition of Deferred Tax Assets is subject to the strict Prudence Rule: a DTA shall be recognized for carry-forward unused tax losses and deductible differences if and only if it is probable that future taxable profit will be available against which the unused tax losses can be utilized."
            ],
            "example": "A company purchases machinery for Rs 100 Lakh. Year 1 book depreciation is Rs 10 Lakh (Carrying Amount Rs 90 Lakh). Tax depreciation under Section 32 is Rs 15 Lakh (Tax Base Rs 85 Lakh). The carrying amount exceeds tax base by Rs 5 Lakh. At a 25.168% tax rate, the company recognizes a Deferred Tax Liability of Rs 1.258 Lakh in balance sheet equity/P&L.",
            "code": '''def calculate_ind_as12_deferred_tax(asset_carrying_amount: float, asset_tax_base: float, liability_carrying_amount: float, liability_tax_base: float, tax_rate_pct: float = 25.168) -> dict:
    # Asset rule: If Carrying Amount > Tax Base -> Taxable Temporary Difference (DTL)
    # Asset rule: If Carrying Amount < Tax Base -> Deductible Temporary Difference (DTA)
    asset_diff = asset_carrying_amount - asset_tax_base
    
    # Liability rule: If Carrying Amount > Tax Base -> Deductible Temporary Difference (DTA)
    # Liability rule: If Carrying Amount < Tax Base -> Taxable Temporary Difference (DTL)
    liability_diff = liability_carrying_amount - liability_tax_base
    
    net_taxable_temporary_diff = asset_diff - liability_diff
    
    if net_taxable_temporary_diff > 0:
        dtl_inr = net_taxable_temporary_diff * (tax_rate_pct / 100.0)
        dta_inr = 0.0
        position = "Net Deferred Tax Liability (DTL) Recognized"
    else:
        dtl_inr = 0.0
        dta_inr = abs(net_taxable_temporary_diff) * (tax_rate_pct / 100.0)
        position = "Net Deferred Tax Asset (DTA) Recognized"
        
    return {
        "asset_carrying_amount_inr": asset_carrying_amount,
        "asset_tax_base_inr": asset_tax_base,
        "net_temporary_difference_inr": net_taxable_temporary_diff,
        "applicable_tax_rate_pct": tax_rate_pct,
        "deferred_tax_liability_inr": dtl_inr,
        "deferred_tax_asset_inr": dta_inr,
        "balance_sheet_classification": position
    }

dt_res = calculate_ind_as12_deferred_tax(
    asset_carrying_amount=9000000.0,
    asset_tax_base=8500000.0,
    liability_carrying_amount=500000.0,
    liability_tax_base=0.0
)
print("Ind AS 12 Deferred Tax Balance Sheet Computation:")
print(f"  Asset Carrying Value: INR {dt_res['asset_carrying_amount_inr']:,.2f} | Tax Base: INR {dt_res['asset_tax_base_inr']:,.2f}")
print(f"  Net Temporary Difference: INR {dt_res['net_temporary_difference_inr']:,.2f}")
print(f"  DTL Recognized: INR {dt_res['deferred_tax_liability_inr']:,.2f}")
print(f"  DTA Recognized: INR {dt_res['deferred_tax_asset_inr']:,.2f}")
print(f"  Position: {dt_res['balance_sheet_classification']}")
''',
            "tryIt": "Set asset_tax_base to 9500000.0 (where tax base exceeds book carrying amount) to observe the position flipping from DTL to a Deferred Tax Asset (DTA).",
            "check": {
                "question": "Under Ind AS 12, what balance sheet condition gives rise to a Deferred Tax Liability (DTL) in respect of an asset?",
                "options": [
                    "When the carrying amount of an asset in the financial balance sheet exceeds its tax base",
                    "When the tax base of an asset exceeds its carrying amount",
                    "When the company reports a net commercial loss for the financial year",
                    "When the asset is fully written off to zero value"
                ],
                "answerIndex": 0,
                "why": "Ind AS 12 paragraph 15 establishes that a deferred tax liability shall be recognized for all taxable temporary differences, which arise when the carrying amount of an asset exceeds its tax base."
            }
        },
        {
            "title": "M&A Tax Due Diligence & Section 79 Loss Continuity Rules",
            "say": [
                "Corporate restructuring, acquisitions, and strategic investments require exhaustive M&A tax due diligence. The foremost direct tax risk in corporate acquisitions is the forfeiture of brought-forward business losses under Section 79 of the Income Tax Act.",
                "Under Section 79(1), where a change in shareholding takes place in a previous year in the case of a company not being a company in which the public are substantially interested (closely held company), no loss incurred in any year prior to the previous year shall be carried forward and set off against income of the previous year, UNLESS on the last day of the previous year, shares carrying not less than 51% of the voting power were beneficially held by persons who beneficially held shares on the last day of the year in which the loss was incurred (the 51% continuity test).",
                "However, Parliament introduced a critical carve-out for Eligible Startups under Section 79(2): for startups recognized under DPIIT, carried forward losses can be set off even if the 51% voting continuity is breached, provided that 100% of the shareholders who held shares in the year of loss continue to hold those shares on the last day of the previous year.",
                "Corporate M&A teams must structure equity buyout agreements, secondary share sales, and anti-dilution clauses to maintain 51% beneficial voting continuity, protecting millions of dollars in valuable corporate tax shields."
            ],
            "example": "TechAcquire Ltd plans to buy 60% equity in LossCo (which has Rs 20 Crore in carried forward business losses). If the founders' shareholding drops to 40%, the 51% continuity test under Section 79 is breached, and all Rs 20 Crore of tax losses lapse permanently. The M&A team restructures the deal: acquiring 49% equity with convertible debentures, preserving the 51% founder holding and protecting the Rs 5 Crore tax shield.",
            "code": '''def evaluate_sec79_loss_carry_forward(brought_forward_loss_cr: float, original_shareholders_retained_pct: float, is_dpiit_startup: bool, all_original_shareholders_retained: bool) -> dict:
    if is_dpiit_startup:
        # Startup carve-out: 100% shareholder continuity even if equity diluted < 51%
        if all_original_shareholders_retained:
            allowed = True
            ruling = "Section 79(2) Startup Carve-out: Losses preserved as 100% original shareholders remain invested"
        else:
            allowed = False
            ruling = "Section 79(2) Breach: Startup original shareholders exited; losses lapse"
    else:
        # Standard closely-held company rule: Min 51% voting power continuity
        if original_shareholders_retained_pct >= 51.0:
            allowed = True
            ruling = f"Section 79(1) Compliant: {original_shareholders_retained_pct:.2f}% voting continuity >= 51% threshold"
        else:
            allowed = False
            ruling = f"Section 79(1) Violation: Beneficial holding dropped to {original_shareholders_retained_pct:.2f}% (< 51%); ALL losses forfeited"
            
    tax_shield_lost_cr = 0.0 if allowed else (brought_forward_loss_cr * 0.25168)
    
    return {
        "brought_forward_loss_cr": brought_forward_loss_cr,
        "continuity_pct": original_shareholders_retained_pct,
        "losses_carry_forward_allowed": allowed,
        "tax_shield_lost_cr": tax_shield_lost_cr,
        "statutory_ruling": ruling
    }

mna_eval = evaluate_sec79_loss_carry_forward(
    brought_forward_loss_cr=20.0,
    original_shareholders_retained_pct=40.0,
    is_dpiit_startup=False,
    all_original_shareholders_retained=False
)
print("Section 79 M&A Loss Continuity Evaluation:")
print(f"  Brought Forward Loss: INR {mna_eval['brought_forward_loss_cr']:.2f} Cr")
print(f"  Shareholder Continuity: {mna_eval['continuity_pct']:.2f}%")
print(f"  Losses Preserved: {mna_eval['losses_carry_forward_allowed']}")
print(f"  Tax Shield Forfeited: INR {mna_eval['tax_shield_lost_cr']:.2f} Cr")
print(f"  Finding: {mna_eval['statutory_ruling']}")
''',
            "tryIt": "Increase original_shareholders_retained_pct to 52.0% to observe the model confirming Section 79 compliance and safeguarding the Rs 5.03 Crore tax shield.",
            "check": {
                "question": "What is the minimum percentage of voting power that must be continuously held by original shareholders under Section 79(1) for a closely held company to carry forward its business losses upon a change in ownership?",
                "options": [
                    "Not less than 51% of the voting power",
                    "Not less than 26% of the voting power",
                    "Not less than 75% of the voting power",
                    "100% of the voting power"
                ],
                "answerIndex": 0,
                "why": "Section 79(1) mandates that shares carrying not less than fifty-one percent (51%) of the voting power must be beneficially held by persons who held them in the year the loss was incurred."
            }
        },
        {
            "title": "OECD Pillar Two Global Minimum Tax (GloBE) Preparedness",
            "say": [
                "The most significant international tax reform of the century is the implementation of the OECD/G20 Pillar Two Global Anti-Base Erosion (GloBE) Rules. Pillar Two introduces a global minimum corporate tax rate of 15% for multinational enterprise groups with consolidated annual revenue exceeding 750 Million EUR (approx. Rs 6,500 Crore).",
                "The core operational mechanism of Pillar Two is the Income Inclusion Rule (IIR) and the Undertaxed Profits Rule (UTPR). If a multinational subsidiary operating in any jurisdiction achieves an Effective Tax Rate (ETR) below 15%—whether due to local tax holidays, R&D patent boxes, or aggressive base erosion—the parent jurisdiction levies a 'Top-Up Tax' to bring the effective rate up to the 15% minimum threshold.",
                "To prevent top-up tax revenue from leaking to foreign treasury departments, participating countries are enacting a Qualified Domestic Minimum Top-Up Tax (QDMTT). Under a QDMTT, the source jurisdiction taxes the local low-tax profits up to 15% first, preempting foreign IIR claims.",
                "Corporate tax directors must audit all domestic tax incentives (such as Section 10AA SEZ exemptions or Section 115BAB concessional manufacturing rates). Where domestic incentives push local ETR below 15%, the tax benefit is clawed back abroad through Pillar Two top-up taxes, eliminating the economic advantage of tax holidays."
            ],
            "example": "MegaMNE India operates an SEZ unit with an effective tax rate of 8.0% on Rs 100 Crore in profits. Under Pillar Two, the effective rate is 7.0% below the 15% minimum rate. If India does not enact a QDMTT, the foreign parent jurisdiction levies a 7.0% Top-Up Tax (Rs 7 Crore) under the Income Inclusion Rule, neutralizing the SEZ tax holiday.",
            "code": '''def calculate_pillar_two_top_up_tax(jurisdiction_pbt_cr: float, local_covered_taxes_cr: float, global_group_turnover_eur: float) -> dict:
    threshold_eur = 750000000.0  # 750M EUR threshold
    is_in_scope = global_group_turnover_eur >= threshold_eur
    
    if not is_in_scope:
        return {
            "in_scope_pillar_two": False,
            "status": "Exempt from GloBE: Global group turnover < 750 Million EUR"
        }
        
    local_etr_pct = (local_covered_taxes_cr / jurisdiction_pbt_cr) * 100.0 if jurisdiction_pbt_cr > 0 else 0.0
    minimum_rate_pct = 15.0
    
    top_up_tax_pct = max(0.0, minimum_rate_pct - local_etr_pct)
    top_up_tax_payable_cr = jurisdiction_pbt_cr * (top_up_tax_pct / 100.0)
    
    return {
        "in_scope_pillar_two": True,
        "jurisdiction_pbt_cr": jurisdiction_pbt_cr,
        "local_covered_taxes_cr": local_covered_taxes_cr,
        "effective_tax_rate_pct": local_etr_pct,
        "pillar_two_minimum_pct": minimum_rate_pct,
        "top_up_tax_rate_pct": top_up_tax_pct,
        "top_up_tax_payable_cr": top_up_tax_payable_cr,
        "status": "Pillar Two Top-Up Tax Triggered" if top_up_tax_payable_cr > 0 else "Compliant: Local ETR >= 15%"
    }

p2_eval = calculate_pillar_two_top_up_tax(
    jurisdiction_pbt_cr=100.0,
    local_covered_taxes_cr=8.0,
    global_group_turnover_eur=950000000.0
)
print("OECD Pillar Two GloBE Top-Up Tax Evaluation:")
print(f"  In Scope (>750M EUR): {p2_eval['in_scope_pillar_two']}")
print(f"  Local Jurisdictional ETR: {p2_eval['effective_tax_rate_pct']:.2f}% (Minimum: {p2_eval['pillar_two_minimum_pct']}%)")
print(f"  Top-Up Tax Rate: {p2_eval['top_up_tax_rate_pct']:.2f}%")
print(f"  Top-Up Tax Payable: INR {p2_eval['top_up_tax_payable_cr']:.2f} Cr")
print(f"  Compliance Verdict: {p2_eval['status']}")
''',
            "tryIt": "Increase local_covered_taxes_cr to 16.0 Cr to verify that achieving a 16% local ETR eliminates Pillar Two top-up tax liabilities completely.",
            "check": {
                "question": "What is the global minimum corporate tax rate established under the OECD/G20 Pillar Two GloBE rules for multinational groups with turnover exceeding 750 Million EUR?",
                "options": [
                    "15.0% global minimum tax rate",
                    "20.0% global minimum tax rate",
                    "10.0% global minimum tax rate",
                    "25.0% global minimum tax rate"
                ],
                "answerIndex": 0,
                "why": "The OECD Pillar Two Global Anti-Base Erosion (GloBE) framework establishes an internationally agreed minimum corporate tax rate of 15%."
            }
        }
    ]
}

with open("scripts/bcom_tax_day29_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day29_data.json")
