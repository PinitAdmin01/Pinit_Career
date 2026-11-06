"""
Build script for bcom_tax Day 11: Corporate Tax Assessment & Statutory Deductions under Section 30 to 37
"""
import json

day11_data = {
    "day": 11,
    "title": "Corporate Tax Assessment & Statutory Deductions under Section 30 to 37",
    "course": "Corporate Taxation & GST",
    "duration": "38 mins",
    "parts": [
        {
            "id": 1,
            "title": "Profits and Gains of Business: Section 28 Charging Matrix & Section 29 Reconciliations",
            "say": (
                "Welcome to Day 11 of Corporate Taxation & GST. Today, we begin Block 3: Corporate Direct Tax Assessments, Minimum Alternate Tax (MAT) & Concessional Enterprise Tax Regimes. In the preceding block, we conquered the indirect tax architecture—GST supply classification, valuation, input tax credit mechanisms, and multi-tier return synthesis. Now, we return to the direct corporate tax domain to examine how enterprise taxable business profits are computed under the statutory framework of the Income Tax Act.\n\n"
                "Under Section 28 of the Income Tax Act, the charging section for 'Profits and Gains of Business or Profession' (PGBP) casts a wide jurisdictional net, capturing all commercial revenues, compensation received for contract termination, export incentives (such as duty drawback), fair market value of non-monetary inventory conversions, and any non-compete fees. However, a corporation's net profit reported on its audited financial statements (Book Profit under GAAP/Ind AS) is virtually never accepted by tax authorities as its taxable business income.\n\n"
                "Pursuant to Section 29, the income chargeable under the head PGBP must be computed in accordance with the provisions contained in Sections 30 to 43D. This statutory mandate requires corporate tax accountants to construct a rigorous 'Tax Reconciliation Statement': starting with Net Profit Before Tax from the audited P&L, disallowances and non-deductible commercial expenses must be added back, statutory tax depreciation must replace book depreciation, exempt incomes must be subtracted, and specific deductions under Sections 30 to 37 must be applied. Mastering this bridge between accounting profit and taxable profit is the primary fiduciary duty of corporate tax controllers.\n\n"
                "In this opening part, we construct an enterprise Book-to-Tax Reconciliation Engine in Python. We ingest commercial P&L accounts, identify non-business debits and accounting reserves, apply statutory Section 29 adjustment rules, and compute the starting adjusted Business Operating Profit for corporate assessment."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class ProfitAndLossItem:\n"
                "    account_name: str\n"
                "    accounting_amount: float\n"
                "    is_statutorily_admissible: bool\n"
                "    statutory_governing_section: str\n"
                "    tax_adjustment_type: str # 'ADD_BACK', 'DEDUCTION', 'NEUTRAL'\n"
                "\n"
                "class PGBPReconciliationEngine:\n"
                "    @staticmethod\n"
                "    def compute_pgbp_income(net_profit_before_tax: float, items: List[ProfitAndLossItem]) -> Dict:\n"
                "        adjusted_pgbp = net_profit_before_tax\n"
                "        total_addbacks = 0.0\n"
                "        total_deductions = 0.0\n"
                "        reconciliation_schedule = []\n"
                "        \n"
                "        for it in items:\n"
                "            adj_amount = 0.0\n"
                "            if it.tax_adjustment_type == 'ADD_BACK':\n"
                "                adj_amount = it.accounting_amount\n"
                "                adjusted_pgbp += adj_amount\n"
                "                total_addbacks += adj_amount\n"
                "            elif it.tax_adjustment_type == 'DEDUCTION':\n"
                "                adj_amount = it.accounting_amount\n"
                "                adjusted_pgbp -= adj_amount\n"
                "                total_deductions += adj_amount\n"
                "                \n"
                "            reconciliation_schedule.append({\n"
                "                'account': it.account_name,\n"
                "                'amount': it.accounting_amount,\n"
                "                'adjustment': it.tax_adjustment_type,\n"
                "                'statutory_section': it.statutory_governing_section\n"
                "            })\n"
                "            \n"
                "        return {\n"
                "            'book_net_profit_before_tax': net_profit_before_tax,\n"
                "            'total_statutory_addbacks': round(total_addbacks, 2),\n"
                "            'total_statutory_deductions': round(total_deductions, 2),\n"
                "            'taxable_pgbp_income_sec28': round(adjusted_pgbp, 2),\n"
                "            'book_to_tax_variance': round(adjusted_pgbp - net_profit_before_tax, 2),\n"
                "            'schedule': reconciliation_schedule\n"
                "        }\n"
                "\n"
                "pl_items = [\n"
                "    ProfitAndLossItem('Book Depreciation (Straight Line)', 1500000.0, False, 'Section 32 Override', 'ADD_BACK'),\n"
                "    ProfitAndLossItem('Provision for Doubtful Debts', 250000.0, False, 'Section 36(1)(vii) Contingent Reserve', 'ADD_BACK'),\n"
                "    ProfitAndLossItem('Statutory Tax Depreciation (WDV Block)', 2200000.0, True, 'Section 32 Tax Block Depreciation', 'DEDUCTION'),\n"
                "    ProfitAndLossItem('General Contingency Reserve', 100000.0, False, 'Section 37 Non-Commercial Reserve', 'ADD_BACK')\n"
                "]\n"
                "engine = PGBPReconciliationEngine()\n"
                "res = engine.compute_pgbp_income(10000000.0, pl_items)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Executes Section 28 & 29 Income Tax Act reconciliations, disallowing contingent accounting reserves and book depreciation while applying statutory tax depreciation.",
            "example": (
                "An enterprise reports $10,000,000 in Book Net Profit. It debited $1,500,000 of straight-line book depreciation and a $250,000 provision for bad debts. Statutory tax depreciation under Section 32 is $2,200,000. Taxable PGBP income is $10M + $1.5M (addback) + $0.25M (addback) - $2.2M (tax depreciation) = $9,550,000."
            ),
            "tryIt": "Add a tax-exempt dividend income item of 500,000 with tax_adjustment_type='DEDUCTION' under Section 10(34) and observe the reduction in taxable business income.",
            "check": {
                "question": "Under Section 29 of the Income Tax Act, how must income chargeable under the head 'Profits and Gains of Business or Profession' be computed?",
                "options": [
                    "In accordance with the specific statutory deduction and disallowance provisions contained in Sections 30 to 43D.",
                    "Strictly on the basis of gross commercial turnover reported in the audited Directors' Report.",
                    "By adopting the net profit reported under GAAP with zero mandatory tax adjustments.",
                    "Exclusively through a cash-basis single-entry bookkeeping ledger certified by a bank manager."
                ],
                "answerIndex": 0,
                "why": "Section 29 explicitly mandates that profits and gains of business or profession shall be computed in accordance with the provisions set forth in Sections 30 to 43D of the Income Tax Act."
            }
        },
        {
            "id": 2,
            "title": "Block of Assets & Depreciation Calculus: Section 32 Rules & Additional Depreciation",
            "say": (
                "Under corporate financial accounting (GAAP/Ind AS), depreciation is calculated on an asset-by-asset basis over its estimated useful economic life using Straight Line (SLM) or Written Down Value (WDV) methods. In direct corporate taxation, however, individual asset depreciation is completely abolished. Under Section 32 of the Income Tax Act, depreciation is calculated strictly on a 'Block of Assets' basis.\n\n"
                "Under Section 2(11), a 'Block of Assets' is defined as a group of assets falling within a class of assets (Buildings, Plant & Machinery, Furniture & Fixtures, or Intangible Assets) in respect of which the same percentage of depreciation is prescribed. To compute statutory depreciation: (1) Take the Opening Written Down Value (WDV) of the block; (2) Add actual cost of assets acquired during the previous year; (3) Deduct net sales consideration (moneys payable) of assets sold, discarded, or demolished during the year; and (4) Apply the statutory depreciation percentage on the resulting 'Depreciated Base'. If the net sales consideration exceeds the opening WDV plus additions, the block ceases to exist, and the surplus is taxed as Short-Term Capital Gains under Section 50.\n\n"
                "Furthermore, Section 32(1)(iia) provides an enormous fiscal incentive for industrial manufacturing: 'Additional Depreciation'. A manufacturing enterprise or power generating company that acquires and installs new plant and machinery is entitled to an extra 20% depreciation in the year of installation (or 35% in designated backward areas)! Crucially, under the 180-Day Put-to-Use Invariant: if a new asset is put to use for less than 180 days in the fiscal year of acquisition (i.e., on or after October 4 in India), the depreciation rate (both normal and additional) is restricted to exactly 50% of the prescribed rate, with the remaining 50% additional depreciation carried forward to the immediately succeeding financial year.\n\n"
                "In this second part, we develop an enterprise Section 32 Block of Assets & Additional Depreciation Engine in Python. We maintain corporate asset blocks, enforce the 180-day put-to-use rule, track additional depreciation carryforwards, compute terminal scrap values, and output statutory tax depreciation schedules."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class AssetAddition:\n"
                "    asset_name: str\n"
                "    actual_cost: float\n"
                "    is_new_manufacturing_pnm: bool\n"
                "    put_to_use_days: int        # >= 180 days -> 100% rate; < 180 days -> 50% rate\n"
                "\n"
                "@dataclass\n"
                "class AssetBlock:\n"
                "    block_name: str             # e.g., 'Plant & Machinery (General)'\n"
                "    depreciation_rate: float    # e.g., 0.15\n"
                "    opening_wdv: float\n"
                "    additions: List[AssetAddition]\n"
                "    sale_scrap_realization: float\n"
                "\n"
                "class Section32DepreciationEngine:\n"
                "    @staticmethod\n"
                "    def compute_block_depreciation(block: AssetBlock) -> Dict:\n"
                "        tot_additions_full = sum(a.actual_cost for a in block.additions if a.put_to_use_days >= 180)\n"
                "        tot_additions_half = sum(a.actual_cost for a in block.additions if a.put_to_use_days < 180)\n"
                "        tot_additions = tot_additions_full + tot_additions_half\n"
                "        \n"
                "        # Depreciated Base before depreciation\n"
                "        base_for_depr = block.opening_wdv + tot_additions - block.sale_scrap_realization\n"
                "        \n"
                "        if base_for_depr <= 0:\n"
                "            # Capital gains trigger under Sec 50\n"
                "            stcg_sec50 = abs(base_for_depr)\n"
                "            return {\n"
                "                'block': block.block_name,\n"
                "                'depreciation_allowed': 0.0,\n"
                "                'additional_depreciation_allowed': 0.0,\n"
                "                'closing_wdv': 0.0,\n"
                "                'short_term_capital_gains_sec50': round(stcg_sec50, 2)\n"
                "            }\n"
                "            \n"
                "        # Standard depreciation calculation:\n"
                "        # Assets put to use < 180 days get 50% of the prescribed rate\n"
                "        # Remainder of the base gets full rate\n"
                "        depr_half_pool = min(base_for_depr, tot_additions_half)\n"
                "        depr_full_pool = base_for_depr - depr_half_pool\n"
                "        \n"
                "        normal_depr = (depr_full_pool * block.depreciation_rate) + (depr_half_pool * (block.depreciation_rate / 2.0))\n"
                "        \n"
                "        # Additional Depreciation under Sec 32(1)(iia) (20% for new P&M)\n"
                "        addl_depr = 0.0\n"
                "        carried_fwd_addl_depr = 0.0\n"
                "        for a in block.additions:\n"
                "            if a.is_new_manufacturing_pnm:\n"
                "                if a.put_to_use_days >= 180:\n"
                "                    addl_depr += a.actual_cost * 0.20\n"
                "                else:\n"
                "                    addl_depr += a.actual_cost * 0.10  # 50% of 20%\n"
                "                    carried_fwd_addl_depr += a.actual_cost * 0.10 # Balance 10% carried to next year\n"
                "                    \n"
                "        total_depreciation = normal_depr + addl_depr\n"
                "        closing_wdv = max(0.0, base_for_depr - total_depreciation)\n"
                "        \n"
                "        return {\n"
                "            'block': block.block_name,\n"
                "            'opening_wdv': block.opening_wdv,\n"
                "            'total_additions': tot_additions,\n"
                "            'sales_realized': block.sale_scrap_realization,\n"
                "            'net_depreciable_base': round(base_for_depr, 2),\n"
                "            'normal_depreciation_sec32': round(normal_depr, 2),\n"
                "            'additional_depreciation_sec32_1_iia': round(addl_depr, 2),\n"
                "            'total_tax_depreciation_claimed': round(total_depreciation, 2),\n"
                "            'closing_wdv': round(closing_wdv, 2),\n"
                "            'carried_forward_addl_depr_next_year': round(carried_fwd_addl_depr, 2)\n"
                "        }\n"
                "\n"
                "pnm_block = AssetBlock(\n"
                "    block_name='Plant & Machinery (General 15%)', depreciation_rate=0.15,\n"
                "    opening_wdv=5000000.0,\n"
                "    additions=[\n"
                "        AssetAddition('CNC Milling Machine (New)', 2000000.0, True, 210),\n"
                "        AssetAddition('Robotic Assembly Arm (New)', 1000000.0, True, 120)\n"
                "    ],\n"
                "    sale_scrap_realization=500000.0\n"
                ")\n"
                "engine = Section32DepreciationEngine()\n"
                "res = engine.compute_block_depreciation(pnm_block)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Simulates Section 32 Block of Assets tax depreciation, correctly enforcing the 180-day 50% rate restriction and Section 32(1)(iia) 20% additional depreciation carryforward.",
            "example": (
                "A manufacturing company buys a $1,000,000 new robotic machine on November 15 (used for 136 days, < 180 days). Under Section 32, normal depreciation is 7.5% ($75,000, half of 15%) and additional depreciation is 10% ($100,000, half of 20%). The remaining $100,000 additional depreciation is carried forward to next year, giving $175,000 tax deduction today."
            ),
            "tryIt": "Set sale_scrap_realization to 10,000,000.0 (exceeding opening WDV and additions) and observe how Section 50 Short-Term Capital Gains triggers automatically.",
            "check": {
                "question": "Under the second proviso to Section 32(1)(ii) of the Income Tax Act, what is the statutory consequence if an asset acquired during the year is put to use for less than 180 days?",
                "options": [
                    "Depreciation is restricted to 50% of the prescribed statutory rate for that financial year.",
                    "No depreciation is allowed in the current year, and the entire deduction is permanently forfeited.",
                    "The asset must be depreciated under straight-line accounting rather than block of assets.",
                    "The asset cost must be treated as a revenue business expense deductible under Section 37."
                ],
                "answerIndex": 0,
                "why": "The proviso to Section 32(1)(ii) explicitly mandates that where an asset is acquired and put to use for less than 180 days in the previous year, the depreciation deduction shall be restricted to 50% of the prescribed percentage."
            }
        },
        {
            "id": 3,
            "title": "Specific Business Deductions: Sections 35, 36 & Scientific Research Incentives",
            "say": (
                "Beyond capital asset depreciation under Section 32, the Income Tax Act provides an array of targeted statutory deductions under Sections 35 and 36 designed to incentivize corporate research, capital formation, and credit management. Understanding these sections enables tax controllers to extract maximum statutory value from corporate operational expenditures.\n\n"
                "Section 35 governs 'Expenditure on Scientific Research'. Under this provision, 100% of both revenue expenditure (salaries of researchers, lab materials) and capital expenditure (specialized laboratory equipment, testing facilities, excluding land) incurred on in-house scientific research related to the business is fully deductible in the year incurred! Furthermore, pre-commencement research expenses incurred within the three years immediately preceding the commencement of commercial business are deductible in the year of commercial launch. This creates a massive front-loaded tax shield for biotechnology, pharmaceutical, and technology enterprises.\n\n"
                "In parallel, Section 36 governs specific corporate operational expenses: (1) Section 36(1)(iii): Interest on borrowed capital used for business purposes is fully deductible, provided interest incurred on capital borrowed for asset acquisition prior to the date the asset is first put to use must be capitalized; (2) Section 36(1)(vii): Bad debts written off as irrecoverable in the accounts of the taxpayer are deductible, provided mere accounting 'provisions for doubtful debts' are strictly disallowed; and (3) Section 36(1)(va): Any sum received by the employer from employees as contribution to Provident Fund or ESI must be credited to the employee's account on or before the statutory due date under the respective labor act. Under the Supreme Court ruling in Checkmate Services (and subsequent statutory amendments), if an employer deposits employee PF contributions even one day late, the deduction is permanently disallowed and taxed as corporate income!\n\n"
                "In this third part, we program an enterprise Section 35 & 36 Statutory Deductions Engine in Python. We audit R&D expenditures across capital and revenue categories, evaluate employee PF deposit timestamps against labor law due dates, test bad debt write-offs versus contingent reserves, and compile audit-ready PGBP deduction schedules."
            ),
            "code": (
                "import json\n"
                "from datetime import datetime, date\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class RAndDExpense:\n"
                "    project_name: str\n"
                "    is_related_to_business: bool\n"
                "    revenue_expenditure: float\n"
                "    capital_equipment_cost: float\n"
                "    land_cost: float            # Statutorily INELIGIBLE\n"
                "\n"
                "@dataclass\n"
                "class EmployeePFDeposit:\n"
                "    month: str\n"
                "    employee_pf_deducted: float\n"
                "    statutory_due_date_pf_act: str # 15th of following month\n"
                "    actual_deposit_date: str\n"
                "\n"
                "class Section35_36Engine:\n"
                "    @staticmethod\n"
                "    def evaluate_deductions(rnd: RAndDExpense, pf_records: List[EmployeePFDeposit], bad_debts_actual_writeoff: float, bad_debt_reserve: float) -> Dict:\n"
                "        # Sec 35 R&D Deduction (100% of revenue & capital PNM, 0% on land)\n"
                "        rnd_allowed = 0.0\n"
                "        rnd_disallowed_land = rnd.land_cost\n"
                "        if rnd.is_related_to_business:\n"
                "            rnd_allowed = rnd.revenue_expenditure + rnd.capital_equipment_cost\n"
                "            \n"
                "        # Sec 36(1)(va) Employee PF Deposit Strict Due Date Rule\n"
                "        allowed_pf = 0.0\n"
                "        disallowed_pf_late = 0.0\n"
                "        pf_audit = []\n"
                "        \n"
                "        for pf in pf_records:\n"
                "            d_due = datetime.strptime(pf.statutory_due_date_pf_act, '%Y-%m-%d').date()\n"
                "            d_act = datetime.strptime(pf.actual_deposit_date, '%Y-%m-%d').date()\n"
                "            is_on_time = d_act <= d_due\n"
                "            \n"
                "            if is_on_time:\n"
                "                allowed_pf += pf.employee_pf_deducted\n"
                "                status = 'ADMISSIBLE: Deposited on or before statutory PF Act due date.'\n"
                "            else:\n"
                "                # Checkmate Services SC Ruling & Sec 36(1)(va) amendment: Permanently disallowed!\n"
                "                disallowed_pf_late += pf.employee_pf_deducted\n"
                "                status = 'DISALLOWED: Delayed beyond PF Act due date. Deemed taxable income under Sec 2(24)(x).'\n"
                "                \n"
                "            pf_audit.append({'month': pf.month, 'amount': pf.employee_pf_deducted, 'status': status})\n"
                "            \n"
                "        # Sec 36(1)(vii): Bad Debts write-off allowed, reserves disallowed\n"
                "        allowed_bad_debts = bad_debts_actual_writeoff\n"
                "        disallowed_reserve = bad_debt_reserve\n"
                "        \n"
                "        return {\n"
                "            'sec35_rnd_deduction_allowed': round(rnd_allowed, 2),\n"
                "            'sec35_land_disallowed': round(rnd_disallowed_land, 2),\n"
                "            'sec36_1_va_pf_admissible': round(allowed_pf, 2),\n"
                "            'sec36_1_va_pf_permanently_disallowed': round(disallowed_pf_late, 2),\n"
                "            'sec36_1_vii_bad_debts_allowed': round(allowed_bad_debts, 2),\n"
                "            'sec36_doubtful_debt_reserve_disallowed': round(disallowed_reserve, 2),\n"
                "            'total_net_statutory_deductions': round(rnd_allowed + allowed_pf + allowed_bad_debts, 2),\n"
                "            'pf_audit_trail': pf_audit\n"
                "        }\n"
                "\n"
                "rnd_proj = RAndDExpense('AI Quantum Drug Discovery', True, 3000000.0, 5000000.0, 2000000.0)\n"
                "pf_entries = [\n"
                "    EmployeePFDeposit('October 2026', 150000.0, '2026-11-15', '2026-11-14'),\n"
                "    EmployeePFDeposit('November 2026', 150000.0, '2026-12-15', '2026-12-18') # 3 days late!\n"
                "]\n"
                "engine = Section35_36Engine()\n"
                "res = engine.evaluate_deductions(rnd_proj, pf_entries, bad_debts_actual_writeoff=400000.0, bad_debt_reserve=250000.0)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Audits Section 35 R&D deductions and Section 36 expenses, strictly enforcing the Supreme Court Checkmate Services mandate permanently disallowing late employee PF deposits.",
            "example": (
                "An enterprise spends $8,000,000 on in-house AI R&D ($3M salaries, $5M supercomputing equipment, $2M lab land). Section 35 allows $8M deduction ($2M land disallowed). It also deposits $150,000 in employee PF 3 days late. Under Section 36(1)(va), that $150,000 is permanently disallowed and taxed at corporate rates."
            ),
            "tryIt": "Set actual_deposit_date of November PF to '2026-12-15' (on time) and verify that disallowed_pf_late drops to 0.0.",
            "check": {
                "question": "Under Section 36(1)(va) read with the Supreme Court ruling in Checkmate Services, what is the tax treatment of employee contributions to Provident Fund deposited by the employer after the due date prescribed under the PF Act?",
                "options": [
                    "The deduction is permanently disallowed, and the amount is treated as taxable corporate income under Section 2(24)(x).",
                    "The deduction is allowed as long as the payment is made before filing the corporate income tax return under Section 139(1).",
                    "The deduction is permitted subject to payment of a nominal 1% administrative fee to the Ministry of Labour.",
                    "The contribution is converted into a deferred tax asset depreciable over 5 years."
                ],
                "answerIndex": 0,
                "why": "The Supreme Court in Checkmate Services conclusively established that Section 43B relaxation does NOT apply to employee contributions under Section 36(1)(va); any late deposit beyond the PF Act due date is permanently disallowed and taxed as income."
            }
        },
        {
            "id": 4,
            "title": "The General Deductions Catch-All: Section 37(1) Invariants & Statutory Disallowances",
            "say": (
                "While Sections 30 to 36 deal with enumerated categories of expenses, the vast majority of commercial operating costs incurred by an enterprise—salaries, marketing, travel, cloud hosting, audit fees, and legal expenses—are deducted under the 'General Deductions' catch-all provision: Section 37(1) of the Income Tax Act.\n\n"
                "To qualify for deduction under Section 37(1), an expenditure must satisfy five cumulative statutory negative and positive tests: (1) It must NOT be an expenditure of the nature described in Sections 30 to 36; (2) It must NOT be in the nature of capital expenditure; (3) It must NOT be personal expenses of the taxpayer; (4) It must have been laid out or expended wholly and exclusively for the purposes of the business or profession; and (5) It must NOT be incurred for any purpose which is an offence or which is prohibited by law (Explanation 1 to Section 37(1), disallowing bribes, extortion payments, fines, and penalties for violation of any law).\n\n"
                "Furthermore, statutory amendments and judicial interpretations have created crucial corporate disallowance boundaries: (1) Explanation 2 to Section 37(1) explicitly provides that any expenditure incurred by a corporate taxpayer on Corporate Social Responsibility (CSR) activities under Section 135 of the Companies Act 2013 shall NOT be deemed to be expenditure incurred for the purposes of business, rendering CSR 100% non-deductible; (2) Explanation 3 disallows any benefit or perquisite provided to a doctor or medical professional prohibited by medical councils (free travel, hotel stays, gift hampers); and (3) Under Section 40A(3), any expenditure in respect of which a payment exceeding INR 10,000 is made in cash (other than by crossed cheque, bank draft, or electronic clearing) is 100% disallowed!\n\n"
                "In this fourth part, we build an enterprise Section 37(1) Commercial Expenditure Screener in Python. We audit corporate ledger transactions, filter out CSR outlays, regulatory fines, and cash payments exceeding Section 40A(3) limits, and compile the statutory disallowance schedule for Form 3CD Tax Audit reporting."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class OperatingExpense:\n"
                "    voucher_id: str\n"
                "    description: str\n"
                "    amount: float\n"
                "    is_capital_in_nature: bool\n"
                "    is_wholly_and_exclusively_for_business: bool\n"
                "    is_csr_expenditure: bool      # Explanation 2 to Sec 37(1)\n"
                "    is_fine_or_penalty_for_law_breach: bool # Explanation 1 to Sec 37(1)\n"
                "    payment_mode: str            # 'ELECTRONIC_BANK', 'CHEQUE', 'CASH'\n"
                "\n"
                "class Section37AuditEngine:\n"
                "    @staticmethod\n"
                "    def audit_expenses(expenses: List[OperatingExpense]) -> Dict:\n"
                "        allowed_total = 0.0\n"
                "        disallowed_total = 0.0\n"
                "        audit_trail = []\n"
                "        \n"
                "        for exp in expenses:\n"
                "            disallowed = False\n"
                "            reason = 'Admissible under Section 37(1)'\n"
                "            \n"
                "            if exp.is_capital_in_nature:\n"
                "                disallowed = True\n"
                "                reason = 'Sec 37(1): Capital expenditure must be capitalized to block of assets.'\n"
                "            elif not exp.is_wholly_and_exclusively_for_business:\n"
                "                disallowed = True\n"
                "                reason = 'Sec 37(1): Not wholly and exclusively incurred for commercial business.'\n"
                "            elif exp.is_csr_expenditure:\n"
                "                # Explanation 2 to Sec 37(1)\n"
                "                disallowed = True\n"
                "                reason = 'Sec 37(1) Explanation 2: CSR outlays statutorily deemed non-business.'\n"
                "            elif exp.is_fine_or_penalty_for_law_breach:\n"
                "                # Explanation 1 to Sec 37(1)\n"
                "                disallowed = True\n"
                "                reason = 'Sec 37(1) Explanation 1: Fines/penalties for breach of statutory law disallowed.'\n"
                "            elif exp.payment_mode == 'CASH' and exp.amount > 10000.0:\n"
                "                # Section 40A(3) Cash Payment Limit\n"
                "                disallowed = True\n"
                "                reason = f'Section 40A(3): Cash payment of {exp.amount} exceeds statutory limit of INR 10,000.'\n"
                "                \n"
                "            if disallowed:\n"
                "                disallowed_total += exp.amount\n"
                "            else:\n"
                "                allowed_total += exp.amount\n"
                "                \n"
                "            audit_trail.append({\n"
                "                'voucher_id': exp.voucher_id,\n"
                "                'description': exp.description,\n"
                "                'amount': exp.amount,\n"
                "                'is_tax_deductible': not disallowed,\n"
                "                'statutory_audit_finding': reason\n"
                "            })\n"
                "            \n"
                "        return {\n"
                "            'total_expenses_screened': round(allowed_total + disallowed_total, 2),\n"
                "            'admissible_section37_deductions': round(allowed_total, 2),\n"
                "            'inadmissible_statutory_disallowances': round(disallowed_total, 2),\n"
                "            'audit_records': audit_trail\n"
                "        }\n"
                "\n"
                "exp_batch = [\n"
                "    OperatingExpense('VCH-01', 'Cloud Infrastructure Hosting AWS', 1200000.0, False, True, False, False, 'ELECTRONIC_BANK'),\n"
                "    OperatingExpense('VCH-02', 'Statutory CSR Rural Education Contribution', 500000.0, False, False, True, False, 'ELECTRONIC_BANK'),\n"
                "    OperatingExpense('VCH-03', 'Pollution Control Board Emission Fine', 150000.0, False, True, False, True, 'ELECTRONIC_BANK'),\n"
                "    OperatingExpense('VCH-04', 'Emergency Factory Spare Parts Purchase', 45000.0, False, True, False, False, 'CASH')\n"
                "]\n"
                "engine = Section37AuditEngine()\n"
                "res = engine.audit_expenses(exp_batch)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Audits operating costs against Section 37(1) statutory tests, Explanation 1 (penalties), Explanation 2 (CSR), and Section 40A(3) INR 10,000 cash payment disallowances.",
            "example": (
                "An enterprise incurs $1.2M in AWS hosting (100% deductible), $500,000 in mandatory CSR (100% disallowed under Expl 2), $150,000 in environmental fines (100% disallowed under Expl 1), and $45,000 paid in physical cash for emergency repairs (100% disallowed under Sec 40A(3)). Only $1.2M is deductible; $695,000 is added back to taxable profit."
            ),
            "tryIt": "Change payment_mode of VCH-04 to 'ELECTRONIC_BANK' and verify that the 45,000 emergency repair expense becomes 100% deductible under Section 37(1).",
            "check": {
                "question": "Under Explanation 2 to Section 37(1) of the Income Tax Act, what is the statutory tax treatment of expenditure incurred on Corporate Social Responsibility (CSR) activities under Section 135 of the Companies Act 2013?",
                "options": [
                    "It is statutorily deemed NOT to be an expenditure incurred for the purposes of business and is 100% disallowed.",
                    "It is eligible for a 150% weighted statutory deduction as an incentive for social upliftment.",
                    "It is treated as a deductible charitable donation under Section 80G subject to a 10% ceiling.",
                    "It can be offset against corporate tax liabilities up to a maximum cap of INR 50 Lakhs."
                ],
                "answerIndex": 0,
                "why": "Explanation 2 to Section 37(1) explicitly provides that any expenditure incurred by the assessee on the activities relating to corporate social responsibility referred to in Section 135 of the Companies Act, 2013 shall not be deemed to be an expenditure incurred for the purposes of the business or profession."
            }
        },
        {
            "id": 5,
            "title": "Statutory Payment Invariants: Section 43B Actual Payment Rules & Form 3CD Reporting",
            "say": (
                "Under mercantile (accrual) accounting, corporations deduct liabilities the moment they are incurred, regardless of when cash is physically disbursed. However, this accounting principle created severe delays in paying taxes, bank interest, and worker bonuses. To enforce commercial discipline, the legislature enacted Section 43B of the Income Tax Act—overriding the accrual system by mandating that specific statutory liabilities are deductible ONLY upon 'Actual Payment'.\n\n"
                "Section 43B applies to seven critical categories of corporate obligations: (a) Any tax, duty, cess, or fee payable under any law (GST, municipal tax, customs); (b) Any sum payable by the employer as contribution to Provident Fund, superannuation, or gratuity fund; (c) Any bonus or commission payable to employees for services rendered; (d) Any interest on loans or advances from scheduled banks, financial institutions, or NBFCs; (e) Any sum payable as interest on delayed payments; (f) Any sum payable by an employer in lieu of leave credit (leave encashment); and (g) Any sum payable by the taxpayer to a Micro or Small Enterprise (MSE) beyond the time limit specified in Section 15 of the MSMED Act 2006 (Section 43B(h)).\n\n"
                "The First Proviso to Section 43B provides a vital timing grace window: liabilities under clauses (a) through (f) ARE deductible in the financial year of incurrence IF they are actually paid on or before the due date for filing the corporate income tax return under Section 139(1) (October 31 for audited corporations). However, Section 43B(h) for MSME payments contains NO such return filing grace window! Under Section 43B(h), payments to micro and small enterprises must be made within the 15-day (or 45-day written agreement) limit of the MSMED Act; any delayed payment unpaid at fiscal year-end (March 31) is strictly disallowed in that year and can only be deducted in the subsequent year of actual payment!\n\n"
                "In this fifth part, we engineer an enterprise Section 43B Compliance & Form 3CD Reporting Engine in Python. We ingest year-end statutory accruals, evaluate payment dates against Section 139(1) filing deadlines and Section 43B(h) MSME clocks, calculate mandatory tax addbacks, and generate automated Tax Audit Clause 26 disclosures."
            ),
            "code": (
                "import json\n"
                "from datetime import datetime, date\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class Section43BPayable:\n"
                "    payable_id: str\n"
                "    category: str        # 'GST_DUTY', 'BANK_INTEREST', 'LEAVE_ENCASHMENT', 'MSME_VENDOR_43B_H'\n"
                "    accrual_year: str    # '2026-27'\n"
                "    amount: float\n"
                "    statutory_payment_due_date: str # Sec 139(1) deadline e.g., '2027-10-31' or MSME date\n"
                "    actual_payment_date: str        # '' if unpaid\n"
                "\n"
                "class Section43BEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_43b_liabilities(payables: List[Section43BPayable]) -> Dict:\n"
                "        allowed_current_year = 0.0\n"
                "        disallowed_addback = 0.0\n"
                "        audit_schedule = []\n"
                "        \n"
                "        for p in payables:\n"
                "            d_due = datetime.strptime(p.statutory_payment_due_date, '%Y-%m-%d').date()\n"
                "            is_paid = p.actual_payment_date != ''\n"
                "            \n"
                "            if is_paid:\n"
                "                d_act = datetime.strptime(p.actual_payment_date, '%Y-%m-%d').date()\n"
                "                paid_within_deadline = d_act <= d_due\n"
                "            else:\n"
                "                paid_within_deadline = False\n"
                "                \n"
                "            if paid_within_deadline:\n"
                "                allowed_current_year += p.amount\n"
                "                status = 'ADMISSIBLE: Paid on or before statutory Section 43B due date.'\n"
                "                deductible = True\n"
                "            else:\n"
                "                disallowed_addback += p.amount\n"
                "                deductible = False\n"
                "                if p.category == 'MSME_VENDOR_43B_H':\n"
                "                    status = 'DISALLOWED under Sec 43B(h): Not paid within MSMED Act 15/45-day window before March 31.'\n"
                "                else:\n"
                "                    status = 'DISALLOWED under Sec 43B: Unpaid prior to Section 139(1) tax return filing deadline.'\n"
                "                    \n"
                "            audit_schedule.append({\n"
                "                'payable_id': p.payable_id,\n"
                "                'category': p.category,\n"
                "                'amount': p.amount,\n"
                "                'deductible_in_current_year': deductible,\n"
                "                'tax_audit_status': status\n"
                "            })\n"
                "            \n"
                "        return {\n"
                "            'total_liabilities_reviewed': round(allowed_current_year + disallowed_addback, 2),\n"
                "            'admissible_deductions_sec43b': round(allowed_current_year, 2),\n"
                "            'disallowed_addbacks_form_3cd': round(disallowed_addback, 2),\n"
                "            'audit_records': audit_schedule\n"
                "        }\n"
                "\n"
                "payables_batch = [\n"
                "    Section43BPayable('P-01', 'GST_DUTY', '2026-27', 850000.0, '2027-10-31', '2027-08-15'),\n"
                "    Section43BPayable('P-02', 'BANK_INTEREST', '2026-27', 600000.0, '2027-10-31', '2027-11-10'), # Late!\n"
                "    Section43BPayable('P-03', 'LEAVE_ENCASHMENT', '2026-27', 400000.0, '2027-10-31', '2027-09-30'),\n"
                "    Section43BPayable('P-04', 'MSME_VENDOR_43B_H', '2026-27', 300000.0, '2027-03-31', '') # Unpaid at year-end!\n"
                "]\n"
                "engine = Section43BEngine()\n"
                "res = engine.evaluate_43b_liabilities(payables_batch)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Simulates Section 43B actual payment invariants, enforcing Section 139(1) return filing deadlines for statutory dues and Section 43B(h) strict year-end limits for MSME payables.",
            "example": (
                "An enterprise accrues $850,000 in GST duty, $600,000 in bank interest, and $300,000 in MSME trade payables. It pays the GST in August (before October 31 deadline: deductible). Bank interest is paid November 10 (after October 31: disallowed). The MSME payable is unpaid on March 31 (disallowed under Sec 43B(h)). Total $900,000 is added back to taxable profit."
            ),
            "tryIt": "Set actual_payment_date of bank interest to '2027-10-15' (before deadline) and observe how it shifts to admissible deductions.",
            "check": {
                "question": "Under Section 43B of the Income Tax Act, by when must accrued statutory taxes and bank interest be paid to remain deductible in the previous year of incurrence?",
                "options": [
                    "On or before the due date for furnishing the return of income under Section 139(1).",
                    "Before the statutory annual general meeting of shareholders under Section 96 Companies Act.",
                    "Strictly on or before March 31 of the relevant financial year with zero exceptions.",
                    "Within 180 days from the date the statutory audit report is signed by the chartered accountant."
                ],
                "answerIndex": 0,
                "why": "The first proviso to Section 43B explicitly provides that any sum referred to in clauses (a) to (g) shall be deductible if actually paid by the assessee on or before the due date applicable in his case for furnishing the return of income under Section 139(1)."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_tax_day11_data.json", "w", encoding="utf-8") as f:
        json.dump(day11_data, f, indent=2)
    print("Successfully built scripts/bcom_tax_day11_data.json")
