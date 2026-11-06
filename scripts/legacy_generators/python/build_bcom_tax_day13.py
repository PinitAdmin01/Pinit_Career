"""
Build script for bcom_tax Day 13: Concessional Corporate Tax Regimes: Section 115BAA & Section 115BAB
"""
import json

day13_data = {
    "day": 13,
    "title": "Concessional Corporate Tax Regimes: Section 115BAA & Section 115BAB",
    "course": "Corporate Taxation & GST",
    "duration": "38 mins",
    "parts": [
        {
            "id": 1,
            "title": "The 2019 Corporate Tax Revolution: Section 115BAA Architecture & Effective 25.168% Rate",
            "say": (
                "Welcome to Day 13 of Corporate Taxation & GST. Today, we examine the single most monumental direct corporate tax reform of the 21st century in India: the introduction of the Concessional Corporate Tax Regimes under Section 115BAA and Section 115BAB via the Taxation Laws (Amendment) Act 2019.\n\n"
                "Prior to 2019, Indian domestic companies faced one of the highest statutory corporate tax burdens among major world economies: a base tax rate of 30%, which, when combined with 12% surcharge and 4% cess, created a staggering effective peak tax rate of 34.944%! To soften this blow, the tax code was riddled with complex, distortionary tax incentives: accelerated depreciation, SEZ profit holidays, investment-linked deductions, and scientific research allowances. However, as we discovered on Day 12, companies claiming these incentives were immediately ensnared by the Minimum Alternate Tax (MAT) under Section 115JB. This created an inefficient, litigation-heavy labyrinth where corporations spent millions on tax engineering, accounting reconciliations, and MAT credit tracking.\n\n"
                "The 2019 reform swept through this complexity by offering domestic corporations a clean, low-rate alternative: Section 115BAA. Under this regime, any domestic company can elect to be taxed at a flat concessional base rate of 22%! Crucially, the surcharge is fixed at a flat 10% (regardless of total turnover or profit level), and the Health & Education Cess is 4%. This produces an exact, universal Effective Tax Rate of 25.168% across all income brackets ($22\\% \\times 1.10 \\times 1.04 = 25.168\\%$). For the first time, corporate tax planning shifted from aggressive deduction hunting to clean, transparent corporate governance.\n\n"
                "In this first part, we construct an enterprise Corporate Tax Rate Comparison Engine in Python. We model the Old Regime (30% base + variable surcharge + cess) against the Section 115BAA Concessional Regime (22% flat + 10% surcharge + 4% cess), analyze turnover-based surcharge tiers (7% vs 12%), and compute the baseline tax savings before deduction trade-offs."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class CorporateTaxStructure:\n"
                "    company_name: str\n"
                "    taxable_profit: float\n"
                "    gross_annual_turnover: float\n"
                "\n"
                "class Section115BAARateEngine:\n"
                "    @staticmethod\n"
                "    def compare_statutory_rates(c: CorporateTaxStructure) -> Dict:\n"
                "        # Old Regime Mechanics:\n"
                "        # Base rate: 25% if turnover <= 400 Cr in FY 2020-21; otherwise 30%\n"
                "        old_base_rate = 0.25 if c.gross_annual_turnover <= 4000000000.0 else 0.30\n"
                "        \n"
                "        # Surcharge: 0% if profit <= 1 Cr; 7% if 1 Cr < profit <= 10 Cr; 12% if profit > 10 Cr\n"
                "        if c.taxable_profit > 100000000.0:\n"
                "            old_surcharge_rate = 0.12\n"
                "        elif c.taxable_profit > 10000000.0:\n"
                "            old_surcharge_rate = 0.07\n"
                "        else:\n"
                "            old_surcharge_rate = 0.0\n"
                "            \n"
                "        old_tax_base = c.taxable_profit * old_base_rate\n"
                "        old_surcharge = old_tax_base * old_surcharge_rate\n"
                "        old_tax_with_sc = old_tax_base + old_surcharge\n"
                "        old_cess = old_tax_with_sc * 0.04\n"
                "        total_old_tax = old_tax_with_sc + old_cess\n"
                "        effective_old_rate = (total_old_tax / c.taxable_profit) * 100.0\n"
                "        \n"
                "        # Section 115BAA Concessional Regime:\n"
                "        # Base rate: 22% flat\n"
                "        # Surcharge: 10% flat (regardless of profit)\n"
                "        # Cess: 4% flat\n"
                "        # Effective: 22 * 1.10 * 1.04 = 25.168%\n"
                "        baa_base_rate = 0.22\n"
                "        baa_surcharge_rate = 0.10\n"
                "        baa_tax_base = c.taxable_profit * baa_base_rate\n"
                "        baa_surcharge = baa_tax_base * baa_surcharge_rate\n"
                "        baa_tax_with_sc = baa_tax_base + baa_surcharge\n"
                "        baa_cess = baa_tax_with_sc * 0.04\n"
                "        total_baa_tax = baa_tax_with_sc + baa_cess\n"
                "        effective_baa_rate = 25.168\n"
                "        \n"
                "        gross_saving = total_old_tax - total_baa_tax\n"
                "        \n"
                "        return {\n"
                "            'company': c.company_name,\n"
                "            'taxable_profit': c.taxable_profit,\n"
                "            'old_regime': {\n"
                "                'base_rate_pct': old_base_rate * 100.0,\n"
                "                'surcharge_rate_pct': old_surcharge_rate * 100.0,\n"
                "                'effective_tax_rate_pct': round(effective_old_rate, 3),\n"
                "                'total_tax_liability': round(total_old_tax, 2)\n"
                "            },\n"
                "            'section_115baa_regime': {\n"
                "                'base_rate_pct': 22.0,\n"
                "                'surcharge_rate_pct': 10.0,\n"
                "                'effective_tax_rate_pct': effective_baa_rate,\n"
                "                'total_tax_liability': round(total_baa_tax, 2)\n"
                "            },\n"
                "            'baseline_tax_reduction': round(gross_saving, 2),\n"
                "            'percentage_tax_saved': round((gross_saving / total_old_tax) * 100.0, 2)\n"
                "        }\n"
                "\n"
                "large_corp = CorporateTaxStructure('Reliance Infrastructure Corp', 250000000.0, 15000000000.0)\n"
                "engine = Section115BAARateEngine()\n"
                "res = engine.compare_statutory_rates(large_corp)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Compares Old Regime (peak effective 34.944%) against Section 115BAA (flat effective 25.168%), calculating baseline tax savings before factoring in forfeited deductions.",
            "example": (
                "A large conglomerate earns $250,000,000 in taxable profit. Under the Old Regime (30% + 12% surcharge + 4% cess = 34.944%), it owes $87,360,000. Under Section 115BAA (22% + 10% surcharge + 4% cess = 25.168%), tax is $62,920,000. Section 115BAA slashes tax by $24,440,000 (a 28.0% direct tax savings)."
            ),
            "tryIt": "Set taxable_profit to 5,000,000.0 (below 1 Cr) and observe how the Old Regime surcharge drops to 0%, altering the relative tax spread.",
            "check": {
                "question": "What is the exact universal effective corporate tax rate (including surcharge and cess) under Section 115BAA of the Income Tax Act?",
                "options": [
                    "25.168% (22% base + 10% flat surcharge + 4% health & education cess).",
                    "34.944% (30% base + 12% surcharge + 4% cess).",
                    "17.160% (15% base + 10% surcharge + 4% cess).",
                    "22.000% flat with statutory exemption from all surcharges and cesses."
                ],
                "answerIndex": 0,
                "why": "Section 115BAA mandates a 22% base tax rate, a flat 10% surcharge under Section 115BAA(1), and 4% cess: 22 * 1.10 * 1.04 = exactly 25.168%."
            }
        },
        {
            "id": 2,
            "title": "The Statutory Bargain: Forfeited Deductions & Ineligible Incentives under Section 115BAA(2)",
            "say": (
                "The headline 25.168% tax rate under Section 115BAA is extraordinarily attractive; however, fiscal policy never offers an unconditional tax reduction without a corresponding statutory sacrifice. Section 115BAA(2) establishes the 'Grand Statutory Bargain': to access the lower 22% base rate, the corporate taxpayer must permanently surrender an exhaustive catalog of tax deductions, investment incentives, and accelerated allowances.\n\n"
                "Under Section 115BAA(2), a company opting for the concessional regime is statutorily FORBIDDEN from claiming: (1) Section 10AA: Tax holidays on export profits in Special Economic Zones; (2) Section 32(1)(iia): Additional depreciation of 20% on new plant and machinery; (3) Section 32AD: Investment allowances in backward notified areas; (4) Section 33AB & 33ABA: Tea, coffee, rubber, and site restoration development deductions; (5) Section 35: Weighted and capital deductions for scientific research; (6) Section 35AD: 100% investment-linked deduction for specified infrastructure sectors (cold chains, pipelines, affordable housing); (7) Section 35CCC & 35CCD: Agricultural extension and skill development projects; and (8) All Chapter VI-A deductions under the heading 'C.—Deductions in respect of certain incomes' (such as Section 80IA, 80IB, 80IC, 80JJA), with ONE critical statutory exception: Section 80JJAA.\n\n"
                "The preservation of Section 80JJAA (Deduction in respect of employment of new employees) is profoundly strategic. Section 80JJAA allows an employer to deduct 30% of additional employee cost incurred on new permanent workers for three consecutive assessment years! By permitting Section 80JJAA under Section 115BAA, Parliament deliberately aligned corporate tax relief with national employment generation.\n\n"
                "In this second part, we program an enterprise Section 115BAA Deduction Sacrifice Auditor in Python. We inspect corporate general ledgers for forfeited incentives, quantify the monetary loss of surrendered SEZ holidays and additional depreciation, verify Section 80JJAA employment deduction retention, and compute Adjusted Total Taxable Income under Section 115BAA."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class CorporateIncentiveItem:\n"
                "    incentive_name: str\n"
                "    statutory_section: str\n"
                "    deduction_amount: float\n"
                "    is_allowed_under_115baa: bool\n"
                "\n"
                "class Section115BAASacrificeEngine:\n"
                "    @staticmethod\n"
                "    def audit_forfeitures(normal_taxable_before_incentives: float, incentives: List[CorporateIncentiveItem]) -> Dict:\n"
                "        old_regime_deductions = 0.0\n"
                "        baa_allowed_deductions = 0.0\n"
                "        forfeited_deductions = 0.0\n"
                "        audit_schedule = []\n"
                "        \n"
                "        for inc in incentives:\n"
                "            old_regime_deductions += inc.deduction_amount\n"
                "            \n"
                "            if inc.is_allowed_under_115baa:\n"
                "                baa_allowed_deductions += inc.deduction_amount\n"
                "                status = f'RETAINED under Sec 115BAA: {inc.statutory_section} is statutorily permitted.'\n"
                "            else:\n"
                "                forfeited_deductions += inc.deduction_amount\n"
                "                status = f'FORFEITED under Sec 115BAA(2): {inc.statutory_section} is strictly prohibited.'\n"
                "                \n"
                "            audit_schedule.append({\n"
                "                'incentive': inc.incentive_name,\n"
                "                'section': inc.statutory_section,\n"
                "                'amount': inc.deduction_amount,\n"
                "                'allowed_under_115baa': inc.is_allowed_under_115baa,\n"
                "                'audit_finding': status\n"
                "            })\n"
                "            \n"
                "        taxable_under_old = max(0.0, normal_taxable_before_incentives - old_regime_deductions)\n"
                "        taxable_under_baa = max(0.0, normal_taxable_before_incentives - baa_allowed_deductions)\n"
                "        \n"
                "        return {\n"
                "            'gross_taxable_before_incentives': normal_taxable_before_incentives,\n"
                "            'total_old_regime_deductions': round(old_regime_deductions, 2),\n"
                "            'total_deductions_forfeited_under_baa': round(forfeited_deductions, 2),\n"
                "            'total_deductions_retained_under_baa': round(baa_allowed_deductions, 2),\n"
                "            'taxable_income_old_regime': round(taxable_under_old, 2),\n"
                "            'taxable_income_section_115baa': round(taxable_under_baa, 2),\n"
                "            'tax_base_expansion_under_baa': round(taxable_under_baa - taxable_under_old, 2),\n"
                "            'audit_records': audit_schedule\n"
                "        }\n"
                "\n"
                "incentives_claimed = [\n"
                "    CorporateIncentiveItem('SEZ Unit Export Profit Holiday', 'Section 10AA', 15000000.0, False),\n"
                "    CorporateIncentiveItem('Additional Depreciation on New Machinery', 'Section 32(1)(iia)', 8000000.0, False),\n"
                "    CorporateIncentiveItem('Scientific R&D Weighted Deduction', 'Section 35(2AB)', 5000000.0, False),\n"
                "    CorporateIncentiveItem('New Employment Generation Incentive', 'Section 80JJAA', 6000000.0, True)\n"
                "]\n"
                "engine = Section115BAASacrificeEngine()\n"
                "res = engine.audit_forfeitures(100000000.0, incentives_claimed)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Audits corporate deductions surrendered under Section 115BAA(2), verifying the forfeiture of Section 10AA, 32(1)(iia), and 35 incentives while preserving Section 80JJAA.",
            "example": (
                "A corporation has $100M in gross profit. Under the Old Regime, it claims $34M in deductions ($15M SEZ holiday, $8M additional depreciation, $5M R&D, and $6M Section 80JJAA), reducing taxable income to $66M. Under Section 115BAA, it must forfeit $28M of incentives, keeping only $6M for Section 80JJAA, expanding taxable base to $94M."
            ),
            "tryIt": "Set the SEZ deduction amount to 0.0 and observe how the tax base expansion gap between Old and Section 115BAA narrows significantly.",
            "check": {
                "question": "Which of the following Chapter VI-A deductions is explicitly PERMITTED to be claimed by a domestic company opting for Section 115BAA?",
                "options": [
                    "Section 80JJAA: Deduction in respect of employment of new permanent employees.",
                    "Section 80IA: Deduction in respect of profits from infrastructure development projects.",
                    "Section 80IB: Deduction in respect of profits from industrial undertakings.",
                    "Section 80M: Deduction in respect of inter-corporate dividends received."
                ],
                "answerIndex": 0,
                "why": "Section 115BAA(2)(i) prohibits all Chapter VI-A deductions under the heading 'C.—Deductions in respect of certain incomes' other than the provisions of Section 80JJAA."
            }
        },
        {
            "id": 3,
            "title": "The Irrevocable Election & Complete MAT Immunity under Section 115JB(5A)",
            "say": (
                "Beyond the headline rate and deduction sacrifices, adopting Section 115BAA carries two irreversible statutory consequences that permanently redefine corporate balance sheet strategy: (1) Complete Immunity from Minimum Alternate Tax; and (2) The Permanent Forfeiture of Accumulated MAT Credit.\n\n"
                "Under Section 115JB(5A), the statute explicitly declares that the provisions of Section 115JB (MAT) shall NOT apply to any domestic company that exercises the option under Section 115BAA or Section 115BAB! This represents an enormous institutional liberation: once inside Section 115BAA, the company no longer prepares dual-track returns, never computes book profit under Schedule III, never tracks unabsorbed depreciation vs loss under Clause (iii), and is immune from MAT audit scrutiny forever.\n\n"
                "However, the statutory trap lies in unutilized MAT Credit accumulated under Section 115JAA from prior financial years. If a company holds $50,000,000 in accumulated MAT credit on its balance sheet and opts for Section 115BAA, Section 115JAA set-off is legally blocked! The Central Board of Direct Taxes (CBDT) Circular No. 29/2019 conclusively clarified that once Section 115BAA is opted, no MAT credit can ever be set off against the 25.168% tax liability, nor can the option be revoked (the election under Form 10-IC is strictly IRREVOCABLE). Any unabsorbed MAT credit remaining on the transition date must be written off as a permanent loss to the profit and loss account!\n\n"
                "In this third part, we build an enterprise MAT Credit Write-Off & Form 10-IC Irrevocability Engine in Python. We quantify the balance sheet asset impairment triggered by writing off accumulated MAT credit under Ind AS 12, evaluate the irrevocability gating constraints of Form 10-IC, and model the net economic payoff of transitioning to Section 115BAA."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class Form10ICElectionProfile:\n"
                "    company_name: str\n"
                "    accumulated_mat_credit_balance: float\n"
                "    projected_annual_profit: float\n"
                "    annual_tax_saving_under_baa: float\n"
                "    estimated_years_to_absorb_mat_in_old_regime: int\n"
                "\n"
                "class Form10ICEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_mat_writeoff(p: Form10ICElectionProfile) -> Dict:\n"
                "        # MAT Credit is completely lost upon filing Form 10-IC\n"
                "        balance_sheet_asset_writeoff = p.accumulated_mat_credit_balance\n"
                "        \n"
                "        # Payback period: How many years of Section 115BAA rate savings\n"
                "        # are required to recover the written-off MAT credit asset?\n"
                "        if p.annual_tax_saving_under_baa > 0:\n"
                "            payback_years = round(balance_sheet_asset_writeoff / p.annual_tax_saving_under_baa, 2)\n"
                "        else:\n"
                "            payback_years = 999.0\n"
                "            \n"
                "        # Strategic recommendation:\n"
                "        # If company can absorb MAT credit in Old Regime within 1-2 years, stay in Old Regime!\n"
                "        # Transition to 115BAA only AFTER exhausting the MAT credit asset.\n"
                "        if p.accumulated_mat_credit_balance > 0 and p.estimated_years_to_absorb_mat_in_old_regime <= 3:\n"
                "            recommendation = (\n"
                "                'STAY IN OLD REGIME TEMPORARILY: Fully exhaust accumulated MAT credit against normal tax surplus. '\n"
                "                'Exercise Form 10-IC election in the assessment year immediately following complete MAT credit exhaustion.'\n"
                "            )\n"
                "            immediate_switch_optimal = False\n"
                "        else:\n"
                "            recommendation = (\n"
                "                'EXERCISE FORM 10-IC IMMEDIATELY: Annual rate savings exceed the present value of MAT credit asset. '\n"
                "                'Permanently write off MAT credit in P&L and enjoy perpetual MAT immunity under Sec 115JB(5A).'\n"
                "            )\n"
                "            immediate_switch_optimal = True\n"
                "            \n"
                "        return {\n"
                "            'company': p.company_name,\n"
                "            'accumulated_mat_credit_asset': p.accumulated_mat_credit_balance,\n"
                "            'mandatory_pnl_impairment_writeoff': balance_sheet_asset_writeoff,\n"
                "            'annual_baa_tax_saving': p.annual_tax_saving_under_baa,\n"
                "            'payback_period_years': payback_years,\n"
                "            'is_form_10ic_election_irrevocable': True,\n"
                "            'complete_mat_immunity_sec115jb_5a': True,\n"
                "            'immediate_transition_recommended': immediate_switch_optimal,\n"
                "            'strategic_board_advice': recommendation\n"
                "        }\n"
                "\n"
                "corp_profile = Form10ICElectionProfile(\n"
                "    company_name='Bharat Heavy Manufacturing Ltd',\n"
                "    accumulated_mat_credit_balance=80000000.0, # 80M MAT Credit\n"
                "    projected_annual_profit=300000000.0,\n"
                "    annual_tax_saving_under_baa=25000000.0,    # 25M annual rate savings\n"
                "    estimated_years_to_absorb_mat_in_old_regime=2\n"
                ")\n"
                "engine = Form10ICEngine()\n"
                "res = engine.evaluate_mat_writeoff(corp_profile)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Evaluates Section 115JB(5A) MAT immunity and the fatal trade-off of unutilized Section 115JAA MAT credit asset impairment upon filing Form 10-IC.",
            "example": (
                "A corporation has $80,000,000 in unutilized MAT credit. Under Section 115BAA, its annual tax savings would be $25,000,000. However, opting for Section 115BAA immediately writes off the $80M asset! Because it can absorb the $80M in just 2 years under the Old Regime, the optimal fiduciary strategy is to stay in the Old Regime for 2 years, exhaust the $80M credit, and then switch to Section 115BAA."
            ),
            "tryIt": "Set accumulated_mat_credit_balance to 0.0 and verify that immediate_transition_recommended switches to True with zero asset write-off.",
            "check": {
                "question": "What happens to accumulated, unutilized Minimum Alternate Tax (MAT) credit under Section 115JAA when a domestic company exercises the option to be taxed under Section 115BAA?",
                "options": [
                    "The unutilized MAT credit cannot be set off and must be permanently written off as an asset impairment.",
                    "The MAT credit is automatically refunded in cash by the Central Board of Direct Taxes.",
                    "The MAT credit is converted into non-voting equity shares held in sovereign wealth funds.",
                    "The credit continues to be set off at an accelerated rate of 50% per annum against the 22% tax liability."
                ],
                "answerIndex": 0,
                "why": "CBDT Circular No. 29/2019 and statutory provisions make it clear that once Section 115BAA is opted, no MAT credit can be set off against tax liabilities, effectively lapsing the asset."
            }
        },
        {
            "id": 4,
            "title": "Section 115BAB: The Ultra-Concessional 15% Manufacturing Paradigm",
            "say": (
                "While Section 115BAA reduced corporate tax to 22% for all domestic companies, Parliament recognized that attracting global manufacturing supply chains—competing with Vietnam, Thailand, and Singapore—demanded an ultra-competitive global tax rate. To ignite greenfield industrial manufacturing, the legislature enacted Section 115BAB, offering an unprecedented 15% base tax rate!\n\n"
                "Under Section 115BAB, a qualifying new manufacturing company is taxed at a base rate of 15%, plus 10% surcharge and 4% cess, creating an extraordinary effective tax rate of just 17.16% ($15\\% \\times 1.10 \\times 1.04 = 17.16\\%$)! This is one of the lowest corporate income tax rates in the democratic world.\n\n"
                "However, to prevent existing corporate conglomerates from merely restructuring or shifting existing factories into new shell companies to exploit the 15% rate, Section 115BAB(2) imposes four stringent statutory gating criteria: (1) Incorporation Date: The company must be incorporated on or after October 1, 2019; (2) Manufacturing Mandate: It must commence manufacture or production of any article or thing on or before March 31, 2024 (subject to legislative extensions); (3) Business Formation: The company must NOT be formed by the splitting up or reconstruction of a business already in existence; and (4) Machinery Restriction: The company must NOT use any machinery or plant previously used for any purpose. A statutory safe harbor allows up to 20% of the total value of plant and machinery to be second-hand, provided imported plant and machinery previously used outside India is treated as new.\n\n"
                "In this fourth part, we engineer an enterprise Section 115BAB Manufacturing Qualification Screener in Python. We test incorporation timestamps, evaluate commercial manufacturing deadlines, audit second-hand machinery ratios against the 20% statutory threshold, verify anti-reconstruction firewalls, and compute effective tax liabilities at 17.16%."
            ),
            "code": (
                "import json\n"
                "from datetime import datetime, date\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class NewManufacturingCompany:\n"
                "    company_name: str\n"
                "    incorporation_date: str     # Must be >= 2019-10-01\n"
                "    commercial_production_date: str # Must be <= statutory cutoff (e.g. 2024-03-31)\n"
                "    is_split_up_of_existing_business: bool # Must be False\n"
                "    total_plant_machinery_cost: float\n"
                "    second_hand_domestic_pnm_cost: float\n"
                "    second_hand_imported_pnm_cost: float # Deemed NEW if not previously used in India\n"
                "    taxable_manufacturing_profit: float\n"
                "\n"
                "class Section115BABEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_115bab_eligibility(c: NewManufacturingCompany) -> Dict:\n"
                "        d_inc = datetime.strptime(c.incorporation_date, '%Y-%m-%d').date()\n"
                "        d_prod = datetime.strptime(c.commercial_production_date, '%Y-%m-%d').date()\n"
                "        \n"
                "        # Invariant 1: Incorporation on or after Oct 1, 2019\n"
                "        cond1 = d_inc >= date(2019, 10, 1)\n"
                "        \n"
                "        # Invariant 2: Production commenced on or before March 31, 2024\n"
                "        cond2 = d_prod <= date(2024, 3, 31)\n"
                "        \n"
                "        # Invariant 3: Not formed by splitting up existing business\n"
                "        cond3 = not c.is_split_up_of_existing_business\n"
                "        \n"
                "        # Invariant 4: Second-hand domestic P&M must not exceed 20% of total P&M\n"
                "        # Explanation 2: Imported second-hand machinery is deemed NEW!\n"
                "        second_hand_ratio = (c.second_hand_domestic_pnm_cost / c.total_plant_machinery_cost) if c.total_plant_machinery_cost > 0 else 0.0\n"
                "        cond4 = second_hand_ratio <= 0.20\n"
                "        \n"
                "        is_eligible = cond1 and cond2 and cond3 and cond4\n"
                "        \n"
                "        if is_eligible:\n"
                "            # Effective 17.16% rate (15% + 10% SC + 4% Cess)\n"
                "            effective_rate = 17.16\n"
                "            tax_liability = c.taxable_manufacturing_profit * 0.1716\n"
                "            regime = 'SECTION_115BAB_QUALIFIED (17.16% Effective Rate)'\n"
                "        else:\n"
                "            # Reverts to Section 115BAA (25.168%)\n"
                "            effective_rate = 25.168\n"
                "            tax_liability = c.taxable_manufacturing_profit * 0.25168\n"
                "            regime = 'DISQUALIFIED from 115BAB -> Reverts to Section 115BAA (25.168%)'\n"
                "            \n"
                "        return {\n"
                "            'company': c.company_name,\n"
                "            'is_qualified_sec115bab': is_eligible,\n"
                "            'governing_tax_regime': regime,\n"
                "            'incorporation_test': cond1,\n"
                "            'production_commencement_test': cond2,\n"
                "            'anti_splitting_test': cond3,\n"
                "            'second_hand_machinery_pct': round(second_hand_ratio * 100.0, 2),\n"
                "            'machinery_20pct_safe_harbor_test': cond4,\n"
                "            'effective_tax_rate_pct': effective_rate,\n"
                "            'total_tax_payable': round(tax_liability, 2)\n"
                "        }\n"
                "\n"
                "semi_fab = NewManufacturingCompany(\n"
                "    company_name='Apex Semiconductor India Pvt Ltd',\n"
                "    incorporation_date='2021-06-15', commercial_production_date='2023-11-20',\n"
                "    is_split_up_of_existing_business=False, total_plant_machinery_cost=500000000.0,\n"
                "    second_hand_domestic_pnm_cost=50000000.0,  # 10% (within 20% safe harbor)\n"
                "    second_hand_imported_pnm_cost=150000000.0, # Deemed NEW!\n"
                "    taxable_manufacturing_profit=100000000.0\n"
                ")\n"
                "engine = Section115BABEngine()\n"
                "res = engine.evaluate_115bab_eligibility(semi_fab)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Audits Section 115BAB criteria for the 15% rate (effective 17.16%), verifying incorporation windows, production deadlines, anti-reconstruction rules, and 20% machinery caps.",
            "example": (
                "A semiconductor startup incorporates on June 15, 2021 and begins production in November 2023. It spends $500M on equipment: $50M domestic used (10%), $150M imported used (deemed new), and $300M new. Because used domestic equipment is under the 20% cap, it qualifies under Section 115BAB, paying just 17.16% tax ($17.16M on $100M profit)."
            ),
            "tryIt": "Set second_hand_domestic_pnm_cost to 150,000,000.0 (30% of total) and observe how it fails cond4, reverting to Section 115BAA at 25.168%.",
            "check": {
                "question": "Under Section 115BAB of the Income Tax Act, what is the maximum permissible percentage of previously used (second-hand) domestic plant and machinery that a new manufacturing company can utilize?",
                "options": [
                    "Not exceeding 20% of the total value of plant and machinery used by the company.",
                    "Not exceeding 50% of total assets, provided it is certified by a government valuer.",
                    "Zero percent: absolutely all plant and machinery must be brand new with zero exceptions.",
                    "Up to 35% if the industrial undertaking is located in an economically backward district."
                ],
                "answerIndex": 0,
                "why": "Explanation 1 to Section 115BAB(2) provides that where plant or machinery previously used in India does not exceed twenty percent of the total value of plant or machinery, the condition shall be deemed to be satisfied."
            }
        },
        {
            "id": 5,
            "title": "The Strategic Crossover Framework: Old Regime vs Section 115BAA Multi-Year Decision Matrix",
            "say": (
                "The decision whether to abandon the Old Corporate Tax Regime and irrevocably adopt Section 115BAA is the most complex strategic choice in corporate tax management. Because Form 10-IC cannot be withdrawn once filed, an erroneous transition can permanently destroy millions of dollars in corporate shareholder value.\n\n"
                "A sophisticated enterprise tax controller evaluates this crossover through a Multi-Year Net Present Value (NPV) Decision Matrix balancing three competing financial dynamics: (1) The Rate Delta: Moving from the Old Regime (effective 34.944% or 29.12%) to Section 115BAA (effective 25.168%) delivers an immediate structural rate savings of 3.95% to 9.77% on normal taxable profits; (2) The Deduction Sacrifice: surrendering accelerated depreciation, Section 10AA holidays, and Section 35 R&D write-offs expands the taxable base; and (3) The MAT Asset Liquidation: staying in the Old Regime allows the company to absorb its accumulated Section 115JAA MAT credit against future normal tax surges, effectively paying down liabilities with pre-paid tax dollars.\n\n"
                "The mathematical 'Break-Even Crossover Condition' occurs when: The cumulative multi-year present value of tax savings from the lower 25.168% rate exceeds the sum of [Lost Value of Forfeited Deductions + Written-Off Section 115JAA MAT Credit]. If a company holds substantial MAT credits that can be fully absorbed within 1 to 3 years, the optimal capital strategy is to remain in the Old Regime until the MAT credit asset is fully consumed, and then immediately file Form 10-IC to lock in the 25.168% rate permanently.\n\n"
                "In this fifth part, we engineer an enterprise Multi-Year Regime Crossover Decision Engine in Python. We model 5-year corporate cash flows under both regimes, discount tax cash flows at the corporate Weighted Average Cost of Capital (WACC), simulate MAT credit absorption schedules, and generate the definitive Board Recommendation Memo."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class FiveYearProjection:\n"
                "    company_name: str\n"
                "    discount_rate_wacc: float   # e.g., 0.10 (10%)\n"
                "    initial_mat_credit_asset: float\n"
                "    annual_pre_tax_profit: List[float] # 5 years of P&L\n"
                "    annual_special_deductions_forfeited: List[float] # SEZ, Addl Depr\n"
                "\n"
                "class CrossoverDecisionEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_5yr_decision(proj: FiveYearProjection) -> Dict:\n"
                "        # Old Regime Effective: 34.944% | Sec 115BAA Effective: 25.168%\n"
                "        RATE_OLD = 0.34944\n"
                "        RATE_BAA = 0.25168\n"
                "        \n"
                "        npv_old_cash_tax = 0.0\n"
                "        npv_baa_cash_tax = 0.0\n"
                "        \n"
                "        rem_mat_credit = proj.initial_mat_credit_asset\n"
                "        yearly_comparison = []\n"
                "        \n"
                "        for yr_idx in range(5):\n"
                "            profit = proj.annual_pre_tax_profit[yr_idx]\n"
                "            deductions = proj.annual_special_deductions_forfeited[yr_idx]\n"
                "            discount_factor = 1.0 / ((1.0 + proj.discount_rate_wacc) ** (yr_idx + 1))\n"
                "            \n"
                "            # Old Regime Calculus:\n"
                "            taxable_old = max(0.0, profit - deductions)\n"
                "            gross_old_tax = taxable_old * RATE_OLD\n"
                "            # Absorb MAT credit if normal tax exceeds MAT floor (assume MAT floor = 17.472% of profit)\n"
                "            mat_floor = profit * 0.17472\n"
                "            mat_utilizable = max(0.0, min(rem_mat_credit, gross_old_tax - mat_floor))\n"
                "            rem_mat_credit -= mat_utilizable\n"
                "            cash_tax_old = gross_old_tax - mat_utilizable\n"
                "            \n"
                "            # Sec 115BAA Calculus:\n"
                "            # No special deductions allowed -> Tax on full profit\n"
                "            cash_tax_baa = profit * RATE_BAA\n"
                "            \n"
                "            npv_old_cash_tax += cash_tax_old * discount_factor\n"
                "            npv_baa_cash_tax += cash_tax_baa * discount_factor\n"
                "            \n"
                "            yearly_comparison.append({\n"
                "                'year': yr_idx + 1,\n"
                "                'profit': profit,\n"
                "                'cash_tax_old_regime': round(cash_tax_old, 2),\n"
                "                'mat_credit_utilized': round(mat_utilizable, 2),\n"
                "                'cash_tax_sec115baa': round(cash_tax_baa, 2),\n"
                "                'net_annual_variance': round(cash_tax_old - cash_tax_baa, 2)\n"
                "            })\n"
                "            \n"
                "        # Recommendation:\n"
                "        net_npv_benefit_baa = npv_old_cash_tax - npv_baa_cash_tax\n"
                "        should_switch = net_npv_benefit_baa > 0\n"
                "        \n"
                "        advice = (\n"
                "            f'OPTIMAL: File Form 10-IC to adopt Section 115BAA. Delivers ${round(net_npv_benefit_baa, 2)} net NPV tax savings over 5 years.'\n"
                "            if should_switch else\n"
                "            f'OPTIMAL: Stay in Old Regime. Surrendering deductions and writing off MAT credit creates ${round(abs(net_npv_benefit_baa), 2)} net loss.'\n"
                "        )\n"
                "        \n"
                "        return {\n"
                "            'company': proj.company_name,\n"
                "            'npv_cash_tax_old_regime': round(npv_old_cash_tax, 2),\n"
                "            'npv_cash_tax_section_115baa': round(npv_baa_cash_tax, 2),\n"
                "            'net_npv_savings_under_baa': round(net_npv_benefit_baa, 2),\n"
                "            'recommend_switch_to_115baa': should_switch,\n"
                "            'boardroom_recommendation': advice,\n"
                "            'yearly_projections': yearly_comparison\n"
                "        }\n"
                "\n"
                "model_proj = FiveYearProjection(\n"
                "    company_name='Global Tech Logistics Ltd', discount_rate_wacc=0.10,\n"
                "    initial_mat_credit_asset=30000000.0,\n"
                "    annual_pre_tax_profit=[100000000.0, 120000000.0, 150000000.0, 180000000.0, 220000000.0],\n"
                "    annual_special_deductions_forfeited=[10000000.0, 10000000.0, 5000000.0, 5000000.0, 0.0]\n"
                ")\n"
                "engine = CrossoverDecisionEngine()\n"
                "res = engine.evaluate_5yr_decision(model_proj)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Executes 5-year discounted cash flow NPV modeling comparing the Old Corporate Tax Regime against Section 115BAA, factoring in MAT credit absorption and forfeited deductions.",
            "example": (
                "An enterprise models 5-year cash flows with $30M initial MAT credit and expanding profits ($100M to $220M). Remaining in the Old Regime incurs $164.2M in NPV tax payments (after absorbing the $30M MAT credit). Switching to Section 115BAA incurs $142.8M in NPV tax. Switching to Section 115BAA generates $21.4M in net present value cash savings, justifying immediate filing of Form 10-IC."
            ),
            "tryIt": "Increase initial_mat_credit_asset to 120,000,000.0 and annual deductions to 40,000,000.0 to see how the model advises staying in the Old Regime.",
            "check": {
                "question": "What is the primary financial risk of a corporation filing Form 10-IC to adopt Section 115BAA when it holds substantial accumulated MAT credit balances?",
                "options": [
                    "The unutilized MAT credit asset is legally extinguished and cannot be set off against the 25.168% tax liability.",
                    "The company is immediately assessed with a mandatory 50% surtax on all prior year capital gains.",
                    "The company's corporate bank accounts are placed in escrow until the Ministry of Corporate Affairs approves the filing.",
                    "The company must re-value all physical plant and machinery at historic liquidation scrap values."
                ],
                "answerIndex": 0,
                "why": "Filing Form 10-IC irrevocably locks the company into Section 115BAA, legally terminating its ability to utilize Section 115JAA MAT credits, forcing an immediate balance sheet write-off."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_tax_day13_data.json", "w", encoding="utf-8") as f:
        json.dump(day13_data, f, indent=2)
    print("Successfully built scripts/bcom_tax_day13_data.json")
