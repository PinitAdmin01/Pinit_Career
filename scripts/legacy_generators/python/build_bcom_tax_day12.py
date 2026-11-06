"""
Build script for bcom_tax Day 12: Minimum Alternate Tax (MAT) Mechanics under Section 115JB & Book Profit Adjustments
"""
import json

day12_data = {
    "day": 12,
    "title": "Minimum Alternate Tax (MAT) Mechanics under Section 115JB & Book Profit Adjustments",
    "course": "Corporate Taxation & GST",
    "duration": "38 mins",
    "parts": [
        {
            "id": 1,
            "title": "Legislative Genesis of Section 115JB: The 'Zero-Tax Company' Problem & 15% MAT Benchmark",
            "say": (
                "Welcome to Day 12 of Corporate Taxation & GST. Today, we confront one of the most critical structural pillars of modern corporate fiscal policy: the Minimum Alternate Tax (MAT) codified under Section 115JB of the Income Tax Act. In corporate finance, MAT represents the state's sovereign anti-avoidance firewall designed to ensure that profitable corporations contribute their fair share of revenue to the national treasury.\n\n"
                "During the late 20th century, corporate taxation was characterized by the phenomenon of 'Zero-Tax Companies'. Highly profitable multinational corporations and industrial giants reported massive book profits on their financial statements, distributed generous dividends to shareholders, and commanded multi-billion-dollar stock market valuations. Yet, on their tax returns, they legally paid zero corporate income tax! They accomplished this by aggressively leveraging statutory tax shields: accelerated 100% tax depreciation, scientific research deductions under Section 35, tax holidays in special economic zones under Section 10AA, and investment allowances. While entirely lawful under standard PGBP provisions, this created immense public cynicism and eroded the sovereign tax base.\n\n"
                "To counter this distortion, Parliament enacted Section 115JB. Under this provision, every corporate taxpayer must calculate its tax liability through a dual-track parallel calculus: Track 1: Normal Corporate Tax computed on taxable business income under Sections 28 to 44; and Track 2: Minimum Alternate Tax computed at the statutory rate of 15% (plus applicable surcharge and 4% Health and Education Cess) on its 'Book Profit'. If the tax payable under normal provisions is less than 15% of its book profit, the book profit is statutorily deemed to be the total income, and the company MUST pay the higher MAT amount!\n\n"
                "In this first part, we construct an enterprise Dual-Track Corporate Tax & MAT Benchmark Engine in Python. We model simultaneous Normal Tax and Section 115JB computations across multiple corporate profit scenarios, evaluate effective tax rates including surcharges and cess, identify when a company falls into MAT territory, and compute the resulting MAT tax floor."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class DualTrackTaxProfile:\n"
                "    company_name: str\n"
                "    book_profit: float\n"
                "    taxable_income_normal: float\n"
                "    normal_tax_rate: float      # e.g., 0.30 or 0.25\n"
                "    mat_statutory_rate: float   # 0.15\n"
                "    surcharge_rate_normal: float\n"
                "    surcharge_rate_mat: float\n"
                "    cess_rate: float            # 0.04 (Health & Education Cess)\n"
                "\n"
                "class MATBenchmarkEngine:\n"
                "    @staticmethod\n"
                "    def evaluate_dual_track(p: DualTrackTaxProfile) -> Dict:\n"
                "        # Track 1: Normal Corporate Tax\n"
                "        base_normal_tax = p.taxable_income_normal * p.normal_tax_rate\n"
                "        normal_surcharge = base_normal_tax * p.surcharge_rate_normal\n"
                "        normal_tax_with_sc = base_normal_tax + normal_surcharge\n"
                "        normal_cess = normal_tax_with_sc * p.cess_rate\n"
                "        total_normal_tax = normal_tax_with_sc + normal_cess\n"
                "        \n"
                "        # Track 2: Section 115JB MAT Tax\n"
                "        base_mat_tax = p.book_profit * p.mat_statutory_rate\n"
                "        mat_surcharge = base_mat_tax * p.surcharge_rate_mat\n"
                "        mat_tax_with_sc = base_mat_tax + mat_surcharge\n"
                "        mat_cess = mat_tax_with_sc * p.cess_rate\n"
                "        total_mat_tax = mat_tax_with_sc + mat_cess\n"
                "        \n"
                "        # Comparison and determination\n"
                "        is_mat_applicable = total_mat_tax > total_normal_tax\n"
                "        final_tax_payable = max(total_normal_tax, total_mat_tax)\n"
                "        governing_regime = 'SECTION_115JB_MAT' if is_mat_applicable else 'NORMAL_TAX_PROVISIONS'\n"
                "        \n"
                "        # MAT Credit created under Section 115JAA\n"
                "        mat_credit_generated = max(0.0, total_mat_tax - total_normal_tax)\n"
                "        \n"
                "        return {\n"
                "            'company': p.company_name,\n"
                "            'book_profit': p.book_profit,\n"
                "            'taxable_income_normal': p.taxable_income_normal,\n"
                "            'gross_normal_tax_payable': round(total_normal_tax, 2),\n"
                "            'gross_mat_tax_payable': round(total_mat_tax, 2),\n"
                "            'is_mat_higher_than_normal': is_mat_applicable,\n"
                "            'governing_tax_regime': governing_regime,\n"
                "            'final_statutory_tax_liability': round(final_tax_payable, 2),\n"
                "            'mat_credit_generated_sec115jaa': round(mat_credit_generated, 2),\n"
                "            'effective_tax_rate_on_book_profit': round((final_tax_payable / p.book_profit) * 100.0, 2)\n"
                "        }\n"
                "\n"
                "corp_zero_tax = DualTrackTaxProfile(\n"
                "    company_name='SolarTech Manufacturing Ltd', book_profit=50000000.0,\n"
                "    taxable_income_normal=10000000.0, normal_tax_rate=0.30,\n"
                "    mat_statutory_rate=0.15, surcharge_rate_normal=0.07,\n"
                "    surcharge_rate_mat=0.07, cess_rate=0.04\n"
                ")\n"
                "engine = MATBenchmarkEngine()\n"
                "res = engine.evaluate_dual_track(corp_zero_tax)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Executes dual-track tax evaluation under Section 115JB, demonstrating how MAT acts as a statutory floor when accelerated deductions compress normal taxable income.",
            "example": (
                "A solar panel manufacturer earns $50M in book profit. Because of accelerated green energy tax depreciation, its normal taxable income is only $10M, yielding $3.33M in normal tax. However, Section 115JB MAT on $50M book profit is $8.34M. The company must pay $8.34M in cash tax, generating an initial $5.01M MAT Credit under Section 115JAA."
            ),
            "tryIt": "Increase taxable_income_normal to 35,000,000.0 and verify that Normal Tax exceeds MAT, rendering Section 115JB non-applicable.",
            "check": {
                "question": "Under Section 115JB of the Income Tax Act, when does a corporate taxpayer become legally obligated to pay Minimum Alternate Tax (MAT)?",
                "options": [
                    "Whenever the tax payable on total taxable income computed under normal provisions is less than 15% of its adjusted Book Profit.",
                    "Only in financial years where the company declares a cash dividend payout ratio exceeding 50% of net earnings.",
                    "Whenever the company's gross export turnover falls below the prescribed threshold set by the Foreign Trade Policy.",
                    "Exclusively when an independent forensic chartered accountant issues an adverse audit qualification."
                ],
                "answerIndex": 0,
                "why": "Section 115JB(1) explicitly provides that where the income tax payable on total income under normal provisions is less than fifteen percent of its book profit, such book profit shall be deemed to be total income and tax shall be paid on that basis."
            }
        },
        {
            "id": 2,
            "title": "Book Profit Computation: Mandatory Statutory Additions under Explanation 1 to Section 115JB",
            "say": (
                "The defining operational battleground of Minimum Alternate Tax is the computation of 'Book Profit'. Under Section 115JB(2), every company must prepare its statement of profit and loss in accordance with Schedule III of the Companies Act 2013. In the historic landmark ruling of Apollo Tyres Ltd v. CIT, the Supreme Court ruled that the Assessing Officer has NO jurisdiction to go behind the net profit shown in the audited P&L accounts, provided it was prepared in accordance with the Companies Act.\n\n"
                "However, Parliament enacted Explanation 1 to Section 115JB(2), creating an exhaustive statutory list of mandatory additions and deductions that must be applied to the net profit. Under Explanation 1, the tax accountant must ADD BACK the following debits if they were charged to the P&L: (a) Income tax paid or payable, and the provision therefor (including dividend distribution tax, interest, surcharge, and cess); (b) Amounts carried to any reserves (general reserve, capital redemption reserve, contingency reserve); (c) Provisions made for setting off liabilities other than ascertained liabilities (contingent liability reserves, litigation provisions, warranty reserves based on unverified estimates); (d) Provisions for losses of subsidiary companies; (e) Dividends paid or proposed; (f) Expenditure relatable to any income which is exempt under Section 10 (subject to specific exclusions); (g) Deferred tax and the provision therefor; and (h) Amounts set aside as provision for diminution in the value of any asset (such as provision for doubtful debts or inventory write-downs).\n\n"
                "The addback of deferred tax debits under Clause (h) of Explanation 1 is especially critical. Under accounting standards (Ind AS 12 / ASC 740), companies debit deferred tax expense to reflect future tax obligations. For MAT purposes, all deferred tax debits are strictly neutralized by being added back to book profit, ensuring that non-cash accounting tax entries do not manipulate the statutory MAT base.\n\n"
                "In this second part, we program an enterprise Section 115JB Statutory Additions Engine in Python. We audit corporate P&L line items, identify non-ascertained provisions, tax reserves, and deferred tax charges, execute statutory addbacks under Explanation 1 clauses (a) through (k), and compute the interim unadjusted Book Profit."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class BookProfitDebitItem:\n"
                "    item_description: str\n"
                "    amount_debited_to_pl: float\n"
                "    clause_explanation_1: str # 'CLAUSE_A_INCOME_TAX', 'CLAUSE_B_RESERVES', 'CLAUSE_C_UNASCERTAINED_LIAB', 'CLAUSE_G_DEFERRED_TAX', 'COMMERCIAL_EXPENSE'\n"
                "\n"
                "class Section115JBAdditionsEngine:\n"
                "    @staticmethod\n"
                "    def calculate_statutory_addbacks(net_profit_pl: float, debits: List[BookProfitDebitItem]) -> Dict:\n"
                "        total_addbacks = 0.0\n"
                "        audit_schedule = []\n"
                "        \n"
                "        for d in debits:\n"
                "            addback = False\n"
                "            legal_note = ''\n"
                "            \n"
                "            if d.clause_explanation_1 == 'CLAUSE_A_INCOME_TAX':\n"
                "                addback = True\n"
                "                legal_note = 'Clause (a): Income tax paid/payable and provisions therefor must be added back.'\n"
                "            elif d.clause_explanation_1 == 'CLAUSE_B_RESERVES':\n"
                "                addback = True\n"
                "                legal_note = 'Clause (b): Amounts carried to any reserve must be added back.'\n"
                "            elif d.clause_explanation_1 == 'CLAUSE_C_UNASCERTAINED_LIAB':\n"
                "                addback = True\n"
                "                legal_note = 'Clause (c): Provisions for unascertained contingent liabilities added back.'\n"
                "            elif d.clause_explanation_1 == 'CLAUSE_G_DEFERRED_TAX':\n"
                "                addback = True\n"
                "                legal_note = 'Clause (h): Deferred tax debits and provisions must be added back.'\n"
                "            elif d.clause_explanation_1 == 'CLAUSE_I_ASSET_DIMINUTION':\n"
                "                addback = True\n"
                "                legal_note = 'Clause (i): Provision for diminution in value of assets (doubtful debts) added back.'\n"
                "            else:\n"
                "                legal_note = 'Standard commercial debit: Not subject to statutory addback.'\n"
                "                \n"
                "            if addback:\n"
                "                total_addbacks += d.amount_debited_to_pl\n"
                "                \n"
                "            audit_schedule.append({\n"
                "                'description': d.item_description,\n"
                "                'amount': d.amount_debited_to_pl,\n"
                "                'is_mandatory_addback': addback,\n"
                "                'statutory_authority': legal_note\n"
                "            })\n"
                "            \n"
                "        interim_book_profit = net_profit_pl + total_addbacks\n"
                "        \n"
                "        return {\n"
                "            'starting_accounting_net_profit': net_profit_pl,\n"
                "            'total_explanation_1_addbacks': round(total_addbacks, 2),\n"
                "            'interim_adjusted_book_profit': round(interim_book_profit, 2),\n"
                "            'addback_details': audit_schedule\n"
                "        }\n"
                "\n"
                "pl_debits = [\n"
                "    BookProfitDebitItem('Provision for Current Income Tax', 3500000.0, 'CLAUSE_A_INCOME_TAX'),\n"
                "    BookProfitDebitItem('Transfer to General Reserve', 2000000.0, 'CLAUSE_B_RESERVES'),\n"
                "    BookProfitDebitItem('Provision for Contingent Patent Litigation', 1000000.0, 'CLAUSE_C_UNASCERTAINED_LIAB'),\n"
                "    BookProfitDebitItem('Deferred Tax Liability Provision Ind AS 12', 1500000.0, 'CLAUSE_G_DEFERRED_TAX'),\n"
                "    BookProfitDebitItem('Provision for Doubtful Trade Receivables', 500000.0, 'CLAUSE_I_ASSET_DIMINUTION'),\n"
                "    BookProfitDebitItem('Employee Enterprise Salaries', 15000000.0, 'COMMERCIAL_EXPENSE')\n"
                "]\n"
                "engine = Section115JBAdditionsEngine()\n"
                "res = engine.calculate_statutory_addbacks(25000000.0, pl_debits)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Calculates mandatory statutory addbacks to accounting profit under Explanation 1 clauses (a) to (i) of Section 115JB(2) Income Tax Act.",
            "example": (
                "An enterprise reports $25M in accounting net profit. It debited $3.5M for tax provision, $2M for general reserves, $1M for patent litigation contingencies, $1.5M for deferred tax, and $0.5M for bad debt reserves ($8.5M total addbacks). Under Section 115JB Explanation 1, its interim book profit expands from $25M to $33.5M."
            ),
            "tryIt": "Add a proposed dividend debit of 1,000,000 under CLAUSE_A_INCOME_TAX and observe how it is added back to book profit.",
            "check": {
                "question": "Under Explanation 1 to Section 115JB(2) of the Income Tax Act, which of the following accounting debits must be ADDED BACK to net profit to compute Book Profit for MAT?",
                "options": [
                    "Deferred tax debits and provisions for unascertained liabilities.",
                    "Actual bonuses paid to factory employees on or before the due date.",
                    "Electricity and power utility bills incurred during commercial manufacturing.",
                    "Routine repairs and maintenance expensed on plant and machinery."
                ],
                "answerIndex": 0,
                "why": "Explanation 1 to Section 115JB(2) explicitly mandates the addback of deferred tax debits (clause h) and amounts set aside to meet unascertained contingent liabilities (clause c)."
            }
        },
        {
            "id": 3,
            "title": "Book Profit Computation: Mandatory Deductions & The Lower of Loss/Depreciation Rule",
            "say": (
                "Once the statutory additions under Explanation 1 are completed, the enterprise must apply the permissible statutory deductions to arrive at the final 'Book Profit' under Section 115JB. Just as additions prevent profit suppression, statutory deductions prevent double taxation of previously taxed reserves and provide relief for struggling enterprises.\n\n"
                "Under Explanation 1 to Section 115JB(2), the following credits are statutorily DEDUCTED from the interim book profit: (i) Amounts withdrawn from any reserve or provision, if such reserve was originally created out of book profits and added back in a prior financial year; (ii) Income exempt under Section 10 (such as agricultural income under Section 10(1)); (iii) The amount of depreciation debited to the profit and loss statement, EXCLUDING the depreciation attributable to revaluation of assets; (iv) The amount withdrawn from revaluation reserve and credited to the P&L, up to the extent of revaluation depreciation; and (v) The famous 'Clause (iii) Loss Offset Rule'.\n\n"
                "Clause (iii) of Explanation 1 provides an enormous fiscal lifeline for financially distressed or turnaround enterprises. It permits the deduction of: The amount of brought forward loss OR unabsorbed depreciation, WHICHEVER IS LESS, as per books of account. The statutory rules governing Clause (iii) are mathematically rigorous: (1) 'Loss' for this purpose excludes depreciation; (2) If either brought forward loss OR unabsorbed depreciation is NIL in the company's books, the allowable deduction under Clause (iii) is automatically ZERO! Both balances must be tracked on an annual historical cumulative basis; and (3) For companies undergoing corporate insolvency resolution under the Insolvency and Bankruptcy Code (IBC 2016), the statute relaxes this rule, permitting deduction of the aggregate sum of BOTH loss and depreciation without the 'whichever is less' restriction.\n\n"
                "In this third part, we engineer an enterprise Section 115JB Statutory Deductions & Clause (iii) Engine in Python. We track cumulative historical book loss and unabsorbed depreciation schedules, evaluate revaluation reserve reversals, apply the 'whichever is less' rule, and output the final certified Book Profit for Section 115JB tax levy."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class BookProfitDeductionData:\n"
                "    interim_book_profit: float\n"
                "    total_book_depreciation_in_pl: float\n"
                "    depreciation_attributable_to_revaluation: float\n"
                "    exempt_income_sec10: float\n"
                "    brought_forward_book_loss_excluding_depr: float\n"
                "    brought_forward_unabsorbed_book_depreciation: float\n"
                "    is_company_under_ibc_insolvency: bool\n"
                "\n"
                "class Section115JBDeductionsEngine:\n"
                "    @staticmethod\n"
                "    def compute_final_book_profit(d: BookProfitDeductionData) -> Dict:\n"
                "        # Deduction 1: Book depreciation excluding revaluation depreciation\n"
                "        allowable_book_depr_deduction = max(0.0, d.total_book_depreciation_in_pl - d.depreciation_attributable_to_revaluation)\n"
                "        \n"
                "        # Deduction 2: Exempt income\n"
                "        exempt_deduction = d.exempt_income_sec10\n"
                "        \n"
                "        # Deduction 3: Clause (iii) Lower of B/F Loss or Unabsorbed Depreciation\n"
                "        if d.is_company_under_ibc_insolvency:\n"
                "            # Special IBC relief: Aggregate of both is allowed!\n"
                "            clause_iii_deduction = d.brought_forward_book_loss_excluding_depr + d.brought_forward_unabsorbed_book_depreciation\n"
                "            clause_iii_note = 'IBC 2016 Special Relief: Aggregate of brought forward loss AND unabsorbed depreciation allowed.'\n"
                "        else:\n"
                "            # Standard Rule: Whichever is LESS\n"
                "            clause_iii_deduction = min(d.brought_forward_book_loss_excluding_depr, d.brought_forward_unabsorbed_book_depreciation)\n"
                "            clause_iii_note = f'Standard Clause (iii): Lower of Loss ({d.brought_forward_book_loss_excluding_depr}) or Depreciation ({d.brought_forward_unabsorbed_book_depreciation}) allowed.'\n"
                "            \n"
                "        total_deductions = allowable_book_depr_deduction + exempt_deduction + clause_iii_deduction\n"
                "        final_book_profit = max(0.0, d.interim_book_profit - total_deductions)\n"
                "        \n"
                "        return {\n"
                "            'interim_book_profit_before_deductions': d.interim_book_profit,\n"
                "            'book_depreciation_deduction_excl_reval': round(allowable_book_depr_deduction, 2),\n"
                "            'exempt_income_deduction': round(exempt_deduction, 2),\n"
                "            'clause_iii_loss_offset_allowed': round(clause_iii_deduction, 2),\n"
                "            'clause_iii_governing_rule': clause_iii_note,\n"
                "            'total_explanation_1_deductions': round(total_deductions, 2),\n"
                "            'final_statutory_book_profit_sec115jb': round(final_book_profit, 2),\n"
                "            'mat_tax_at_15pct_base': round(final_book_profit * 0.15, 2)\n"
                "        }\n"
                "\n"
                "ded_data = BookProfitDeductionData(\n"
                "    interim_book_profit=35000000.0, total_book_depreciation_in_pl=5000000.0,\n"
                "    depreciation_attributable_to_revaluation=800000.0, exempt_income_sec10=200000.0,\n"
                "    brought_forward_book_loss_excluding_depr=6000000.0,\n"
                "    brought_forward_unabsorbed_book_depreciation=4000000.0,\n"
                "    is_company_under_ibc_insolvency=False\n"
                ")\n"
                "engine = Section115JBDeductionsEngine()\n"
                "res = engine.compute_final_book_profit(ded_data)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Enforces Section 115JB Explanation 1 deductions, strictly applying the 'lower of loss or depreciation' rule under Clause (iii) and IBC insolvency exceptions.",
            "example": (
                "A company has $35M in interim book profit. Its accounts show $6M brought forward business loss and $4M unabsorbed depreciation. Under Clause (iii), the deduction is strictly the lower figure ($4M). Subtracting $4.2M depreciation (net of revaluation) and $4M Clause (iii) relief leaves $26.8M final Book Profit, resulting in $4.02M base MAT."
            ),
            "tryIt": "Set brought_forward_book_loss_excluding_depr to 0.0 and observe how Clause (iii) deduction collapses to 0.0 under the 'whichever is less' rule.",
            "check": {
                "question": "Under Clause (iii) of Explanation 1 to Section 115JB(2), what amount is deductible from book profit in respect of past accumulated losses for a standard company?",
                "options": [
                    "The amount of brought forward business loss (excluding depreciation) OR unabsorbed depreciation, whichever is LESS.",
                    "The combined aggregate sum of brought forward business loss and unabsorbed depreciation.",
                    "The higher of brought forward business loss or unabsorbed depreciation up to a maximum cap of 50% of profit.",
                    "Only the brought forward loss, provided unabsorbed depreciation is permanently forfeited."
                ],
                "answerIndex": 0,
                "why": "Clause (iii) of Explanation 1 explicitly mandates that the amount of loss brought forward or unabsorbed depreciation, whichever is less, as per books of account, shall be deducted."
            }
        },
        {
            "id": 4,
            "title": "MAT Credit Mechanics: Section 115JAA Entitlement, Set-Off & 15-Year Carryforward",
            "say": (
                "When a company is forced to pay Minimum Alternate Tax because MAT exceeds its normal tax liability, is that extra cash tax permanently forfeited? If it were, MAT would constitute a punitive, double-taxation penalty on capital investment. To preserve equity, Parliament enacted Section 115JAA—establishing the 'MAT Credit Entitlement' mechanism.\n\n"
                "Under Section 115JAA(2A), the MAT Credit generated in any financial year is defined as: The excess of tax paid under Section 115JB (MAT) over the tax payable under the normal provisions of the Income Tax Act. This credit balance is recorded as a Non-Current Asset on the corporate balance sheet under GAAP/Ind AS (subject to reasonable certainty of future realization).\n\n"
                "Under Section 115JAA(3A), an enterprise is statutorily entitled to carry forward its accumulated MAT Credit for up to 15 immediately succeeding assessment years! In any future year where the company's Normal Tax liability EXCEEDS its MAT liability, the company is allowed to set off its accumulated MAT credit against that excess. The set-off is statutorily restricted: the company can utilize MAT credit only up to the difference between Normal Tax and MAT in that utilization year, ensuring that the company's net tax outflow in any given year never falls below the MAT floor.\n\n"
                "In this fourth part, we engineer an enterprise Section 115JAA MAT Credit Carryforward & Set-Off Engine in Python. We maintain multi-year aging buckets across the 15-year statutory lifecycle, execute optimal set-off algorithms when normal tax surges, track expiring credit vintages, and project cash tax savings."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class MATCreditVintage:\n"
                "    origination_ay: str         # e.g., 'AY 2022-23'\n"
                "    credit_generated: float\n"
                "    utilized_so_far: float\n"
                "    expiry_ay: str              # 15 assessment years from origination\n"
                "\n"
                "class Section115JAAEngine:\n"
                "    @staticmethod\n"
                "    def process_annual_mat_credit(\n"
                "        current_ay: str,\n"
                "        normal_tax_payable: float,\n"
                "        mat_tax_payable: float,\n"
                "        credit_pool: List[MATCreditVintage]\n"
                "    ) -> Dict:\n"
                "        is_mat_year = mat_tax_payable > normal_tax_payable\n"
                "        \n"
                "        if is_mat_year:\n"
                "            # Generate new MAT Credit\n"
                "            new_credit = mat_tax_payable - normal_tax_payable\n"
                "            cash_tax_paid = mat_tax_payable\n"
                "            credit_utilized = 0.0\n"
                "            operation = f'MAT Year: Paid MAT of {mat_tax_payable}. Generated {new_credit} new MAT credit.'\n"
                "        else:\n"
                "            # Normal Tax year -> Set-off opportunity!\n"
                "            # Max allowable set-off is (Normal Tax - MAT Tax)\n"
                "            new_credit = 0.0\n"
                "            headroom_for_setoff = normal_tax_payable - mat_tax_payable\n"
                "            \n"
                "            # Utilize oldest active vintages first (FIFO)\n"
                "            credit_utilized = 0.0\n"
                "            for v in credit_pool:\n"
                "                avail = v.credit_generated - v.utilized_so_far\n"
                "                if avail > 0 and headroom_for_setoff > 0:\n"
                "                    use = min(avail, headroom_for_setoff)\n"
                "                    v.utilized_so_far += use\n"
                "                    credit_utilized += use\n"
                "                    headroom_for_setoff -= use\n"
                "                    \n"
                "            cash_tax_paid = normal_tax_payable - credit_utilized\n"
                "            operation = f'Normal Tax Year: Offset {credit_utilized} MAT credit against normal tax surplus. Cash tax reduced to {cash_tax_paid}.'\n"
                "            \n"
                "        # Calculate closing active credit pool\n"
                "        total_active_credit = sum(v.credit_generated - v.utilized_so_far for v in credit_pool) + new_credit\n"
                "        \n"
                "        return {\n"
                "            'assessment_year': current_ay,\n"
                "            'normal_tax': round(normal_tax_payable, 2),\n"
                "            'mat_tax': round(mat_tax_payable, 2),\n"
                "            'actual_cash_tax_remitted': round(cash_tax_paid, 2),\n"
                "            'mat_credit_utilized_this_year': round(credit_utilized, 2),\n"
                "            'new_mat_credit_created': round(new_credit, 2),\n"
                "            'total_closing_mat_credit_balance': round(total_active_credit, 2),\n"
                "            'operational_summary': operation\n"
                "        }\n"
                "\n"
                "vintages = [\n"
                "    MATCreditVintage('AY 2024-25', 5000000.0, 1000000.0, 'AY 2039-40'),\n"
                "    MATCreditVintage('AY 2025-26', 3000000.0, 0.0, 'AY 2040-41')\n"
                "]\n"
                "# Year where Normal Tax surges to 12M, while MAT is 8M (4M headroom for setoff)\n"
                "engine = Section115JAAEngine()\n"
                "res = engine.process_annual_mat_credit('AY 2027-28', 12000000.0, 8000000.0, vintages)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Simulates Section 115JAA MAT credit mechanics, utilizing available credit pool up to the statutory ceiling of (Normal Tax - MAT) using FIFO vintage ordering.",
            "example": (
                "A company has $7,000,000 in accumulated MAT credit. In the current year, Normal Tax is $12,000,000 and MAT is $8,000,000 (a $4,000,000 surplus). Under Section 115JAA, it sets off $4,000,000 of MAT credit against Normal Tax, reducing cash tax outflow to $8,000,000 while preserving $3,000,000 in carried forward credit."
            ),
            "tryIt": "Set normal_tax_payable to 7,000,000.0 (less than MAT) and observe how credit utilization drops to 0.0 while 1,000,000 in new credit is generated.",
            "check": {
                "question": "Under Section 115JAA(3A) of the Income Tax Act, for how many assessment years can unutilized Minimum Alternate Tax (MAT) credit be carried forward?",
                "options": [
                    "Up to 15 assessment years immediately succeeding the assessment year in which credit was generated.",
                    "Up to 8 assessment years, identical to the business loss carryforward rules under Section 72.",
                    "Indefinitely until fully absorbed against future corporate dividend distributions.",
                    "Only up to 5 assessment years under revised international accounting convergence standards."
                ],
                "answerIndex": 0,
                "why": "Section 115JAA(3A) explicitly provides that the amount of tax credit determined shall be carried forward to be set off up to fifteen assessment years immediately succeeding the assessment year in which such credit becomes allowable."
            }
        },
        {
            "id": 5,
            "title": "Ind AS Transition Adjustments: Section 115JB(2A) Other Comprehensive Income (OCI) Rules",
            "say": (
                "With the mandatory adoption of Indian Accounting Standards (Ind AS / IFRS converged) by corporate India, the calculation of Book Profit underwent a radical architectural evolution. Ind AS introduced 'Fair Value Accounting' and the concept of 'Other Comprehensive Income' (OCI)—capturing unrealized mark-to-market swings on financial instruments, actuarial gains/losses on employee pension schemes, and foreign currency translation reserves.\n\n"
                "Because fair value gains and losses do not reflect realized commercial cash flows, Parliament enacted Section 115JB(2A) to govern Ind AS transition adjustments. Under this provision, Book Profit must be adjusted for two distinct Ind AS mechanisms: (1) Annual OCI Items under Section 115JB(2A)(b): Items credited or debited to OCI that will never be reclassified to the P&L (such as actuarial gains/losses on defined benefit pension plans under Ind AS 19) must be adjusted annually in Book Profit; and (2) The 5-Year Transition Basket under Section 115JB(2C).\n\n"
                "The Transition Basket under Section 115JB(2C) is critical during corporate conversions. On the date of Ind AS transition (the 'Convergence Date'), corporations adjusted their opening retained earnings and reserves for fair valuation of financial assets and property. To prevent massive one-time tax shocks, the statute mandates that the net aggregate 'Transition Amount' must be spread evenly over five successive financial years, with exactly one-fifth (20%) added or deducted from Book Profit each year starting from the year of transition!\n\n"
                "In this fifth part, we build an enterprise Ind AS Section 115JB(2A) & Transition Amount Calculator in Python. We parse OCI line items, isolate items that reclassify to P&L from permanent non-reclassifying equity adjustments, track 5-year transition amortization schedules, and compute Ind AS adjusted certified Book Profit."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class IndASAdjustmentData:\n"
                "    book_profit_before_ind_as: float\n"
                "    oci_actuarial_pension_gains: float     # Non-reclassifying to P&L (Included in MAT)\n"
                "    oci_equity_fvoci_fair_value_gains: float # Non-reclassifying (Included on disposal/realization)\n"
                "    net_transition_amount_convergence_date: float # Total day-1 transition reserve adjustment\n"
                "    current_transition_year_index: int     # 1, 2, 3, 4, 5 (One-fifth each year)\n"
                "\n"
                "class IndASMATAdjuster:\n"
                "    @staticmethod\n"
                "    def apply_ind_as_adjustments(d: IndASAdjustmentData) -> Dict:\n"
                "        # Step 1: OCI Adjustments under Sec 115JB(2A)\n"
                "        # Actuarial gains on defined benefit plans are included in book profit\n"
                "        annual_oci_adjustment = d.oci_actuarial_pension_gains\n"
                "        \n"
                "        # Step 2: 5-Year Transition Basket under Sec 115JB(2C)\n"
                "        # 1/5th (20%) of Transition Amount added/deducted each year\n"
                "        if 1 <= d.current_transition_year_index <= 5:\n"
                "            one_fifth_transition = d.net_transition_amount_convergence_date / 5.0\n"
                "            transition_status = f'Active: Year {d.current_transition_year_index} of 5. One-fifth ({one_fifth_transition}) applied.'\n"
                "        else:\n"
                "            one_fifth_transition = 0.0\n"
                "            transition_status = 'Expired: Beyond 5-year statutory transition window.'\n"
                "            \n"
                "        final_ind_as_book_profit = d.book_profit_before_ind_as + annual_oci_adjustment + one_fifth_transition\n"
                "        mat_tax_15pct = final_ind_as_book_profit * 0.15\n"
                "        \n"
                "        return {\n"
                "            'book_profit_before_ind_as': d.book_profit_before_ind_as,\n"
                "            'annual_oci_actuarial_adjustment': round(annual_oci_adjustment, 2),\n"
                "            'statutory_one_fifth_transition_amount': round(one_fifth_transition, 2),\n"
                "            'transition_basket_status': transition_status,\n"
                "            'final_ind_as_adjusted_book_profit': round(final_ind_as_book_profit, 2),\n"
                "            'statutory_mat_base_tax': round(mat_tax_15pct, 2)\n"
                "        }\n"
                "\n"
                "ind_as_profile = IndASAdjustmentData(\n"
                "    book_profit_before_ind_as=40000000.0, oci_actuarial_pension_gains=1500000.0,\n"
                "    oci_equity_fvoci_fair_value_gains=2500000.0,\n"
                "    net_transition_amount_convergence_date=10000000.0,\n"
                "    current_transition_year_index=3\n"
                ")\n"
                "engine = IndASMATAdjuster()\n"
                "res = engine.apply_ind_as_adjustments(ind_as_profile)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Implements Section 115JB(2A) and 115JB(2C) Ind AS adjustments, incorporating non-reclassifying OCI items and amortizing transition reserves over the 5-year statutory spread.",
            "example": (
                "An Ind AS company has $40M in pre-Ind AS book profit, $1.5M in actuarial pension gains in OCI, and a $10M convergence date transition reserve. In Year 3 of transition, exactly 1/5th ($2M) of the transition reserve is added to book profit along with the $1.5M OCI gain, yielding $43.5M final Ind AS Book Profit."
            ),
            "tryIt": "Set current_transition_year_index to 6 and verify that the transition amount amortizer shuts off automatically.",
            "check": {
                "question": "Under Section 115JB(2C) of the Income Tax Act, over how many successive financial years must the net Ind AS transition amount be spread for Book Profit calculation?",
                "options": [
                    "Five successive financial years starting from the convergence year (one-fifth each year).",
                    "Three successive financial years starting from the date of the first Ind AS audit.",
                    "Ten successive financial years aligned with standard goodwill amortization schedules.",
                    "It must be recognized immediately as a lump sum in the initial convergence financial year."
                ],
                "answerIndex": 0,
                "why": "Section 115JB(2C) explicitly provides that the transition amount shall be adjusted in book profit in five equal installments (one-fifth each year) starting from the year of convergence."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_tax_day12_data.json", "w", encoding="utf-8") as f:
        json.dump(day12_data, f, indent=2)
    print("Successfully built scripts/bcom_tax_day12_data.json")
