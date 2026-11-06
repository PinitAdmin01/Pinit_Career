"""
Build script for bcom_tax Day 15: 🏆 Milestone Project 3: Integrated Corporate Tax Computation & MAT vs Concessional Regime Decision Cockpit
"""
import json

day15_data = {
    "day": 15,
    "title": "🏆 Milestone Project 3: Integrated Corporate Tax Computation & MAT vs Concessional Regime Decision Cockpit",
    "course": "Corporate Taxation & GST",
    "duration": "40 mins",
    "parts": [
        {
            "id": 1,
            "title": "Comprehensive PGBP Income Engine: P&L Reconciliations & Statutory Disallowances",
            "say": (
                "Welcome to Day 15 of Corporate Taxation & GST. Today marks the culmination of Block 3: our Milestone Project 3 Grand Master Capstone. Over the preceding four days, you have deconstructed the statutory anatomy of direct corporate taxation: the Section 28–43D PGBP charging sections and block of assets depreciation rules, the Section 115JB Minimum Alternate Tax (MAT) and book profit adjustments, the Section 115BAA/BAB 25.168% and 17.16% concessional corporate regimes, and the Section 50/50B/50C capital gains deeming fictions. Now, in this capstone, you will synthesize these discrete statutory engines into a unified, end-to-end Enterprise Direct Tax Computation & Strategic Regime Optimization Cockpit.\n\n"
                "The foundation of the direct tax compliance cycle begins with the computation of 'Profits and Gains of Business or Profession' (PGBP) under Section 29. Operating as the Chief Tax Officer, you must bridge the divide between accounting net profit reported in the audited financial statements and taxable business income. Every single line item debited to the profit and loss account must be systematically audited against statutory disallowance tripwires: accounting book depreciation must be added back and replaced with Section 32 tax block depreciation; non-statutory provisions (such as provisions for doubtful debts or contingent litigation reserves) must be disallowed; Section 40(a) non-deductions for failure to withhold TDS must be enforced; Section 40A(3) cash payments exceeding INR 10,000 must be excised; and Section 43B accrued statutory dues unpaid before the Section 139(1) return filing deadline must be added back.\n\n"
                "This rigorous reconciliation establishes the true statutory PGBP base. Any error or oversight in this foundational computation corrupts both the Normal Tax liability and the subsequent MAT comparison, exposing the corporation to mandatory penalty proceedings under Section 270A for under-reporting of income and crippling interest charges under Section 234B and 234C.\n\n"
                "In this first part of our milestone project, we construct an enterprise PGBP Direct Tax Synthesis Engine in Python. We ingest comprehensive multi-million-dollar corporate trial balances, execute automated statutory additions and deductions under Sections 30 through 43D, calculate net taxable business profits, and output an audit-ready Form 3CD Tax Audit Reconciliation Schedule."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class ComprehensivePLData:\n"
                "    book_profit_before_tax: float\n"
                "    book_depreciation_debited: float\n"
                "    statutory_tax_depreciation_sec32: float\n"
                "    provision_for_doubtful_debts: float\n"
                "    csr_expenditure_debited: float         # Sec 37(1) Expl 2 Disallowance\n"
                "    penalties_and_fines_debited: float     # Sec 37(1) Expl 1 Disallowance\n"
                "    cash_payments_exceeding_10k: float     # Sec 40A(3) Disallowance\n"
                "    unpaid_statutory_taxes_sec43b: float   # Sec 43B Disallowance\n"
                "    sec80jjaa_new_employment_deduction: float # Chapter VI-A allowed\n"
                "\n"
                "class GrandPGBPEngine:\n"
                "    @staticmethod\n"
                "    def compute_statutory_pgbp(pl: ComprehensivePLData) -> Dict:\n"
                "        # Step 1: Start with Net Profit Before Tax\n"
                "        running_profit = pl.book_profit_before_tax\n"
                "        \n"
                "        # Step 2: Add-backs of non-permissible debits\n"
                "        addbacks = (\n"
                "            pl.book_depreciation_debited +\n"
                "            pl.provision_for_doubtful_debts +\n"
                "            pl.csr_expenditure_debited +\n"
                "            pl.penalties_and_fines_debited +\n"
                "            pl.cash_payments_exceeding_10k +\n"
                "            pl.unpaid_statutory_taxes_sec43b\n"
                "        )\n"
                "        \n"
                "        # Step 3: Statutory tax deductions\n"
                "        deductions = pl.statutory_tax_depreciation_sec32\n"
                "        \n"
                "        net_pgbp_income = running_profit + addbacks - deductions\n"
                "        # Apply Chapter VI-A Sec 80JJAA\n"
                "        gross_total_income = net_pgbp_income\n"
                "        total_taxable_normal_income = max(0.0, gross_total_income - pl.sec80jjaa_new_employment_deduction)\n"
                "        \n"
                "        return {\n"
                "            'starting_book_profit_before_tax': pl.book_profit_before_tax,\n"
                "            'total_statutory_addbacks': round(addbacks, 2),\n"
                "            'total_statutory_deductions_sec32': round(deductions, 2),\n"
                "            'net_pgbp_income_sec28': round(net_pgbp_income, 2),\n"
                "            'sec80jjaa_employment_deduction': round(pl.sec80jjaa_new_employment_deduction, 2),\n"
                "            'final_taxable_income_normal_regime': round(total_taxable_normal_income, 2)\n"
                "        }\n"
                "\n"
                "pl_corp = ComprehensivePLData(\n"
                "    book_profit_before_tax=120000000.0,\n"
                "    book_depreciation_debited=25000000.0,\n"
                "    statutory_tax_depreciation_sec32=38000000.0, # Accelerated tax block depreciation\n"
                "    provision_for_doubtful_debts=4000000.0,\n"
                "    csr_expenditure_debited=3000000.0,\n"
                "    penalties_and_fines_debited=500000.0,\n"
                "    cash_payments_exceeding_10k=800000.0,\n"
                "    unpaid_statutory_taxes_sec43b=2500000.0,\n"
                "    sec80jjaa_new_employment_deduction=6000000.0\n"
                ")\n"
                "engine = GrandPGBPEngine()\n"
                "res = engine.compute_statutory_pgbp(pl_corp)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Aggregates multi-tier corporate P&L reconciliations, disallowing book depreciation, CSR, penalties, Section 40A(3) cash, and Section 43B dues while applying Section 32 and 80JJAA deductions.",
            "example": (
                "An enterprise reports $120M in accounting profit. It debited $25M book depreciation, $4M bad debt reserve, $3M CSR, $0.5M fines, $0.8M cash, and $2.5M unpaid taxes ($35.8M total addbacks). Deducting $38M Section 32 tax depreciation yields $117.8M PGBP income. Subtracting $6M Section 80JJAA employment deduction leaves $111.8M taxable normal income."
            ),
            "tryIt": "Increase statutory_tax_depreciation_sec32 to 50,000,000.0 to simulate aggressive capital additions and observe the compression in normal taxable income.",
            "check": {
                "question": "Which of the following statutory add-backs is MANDATORY when reconciling Book Profit Before Tax to PGBP income under the Income Tax Act?",
                "options": [
                    "All of the above: Book depreciation, CSR expenditure under Expl 2 to Sec 37(1), and cash payments exceeding INR 10,000 under Sec 40A(3).",
                    "Only book depreciation, while CSR expenditures are 100% deductible as charitable donations.",
                    "Only cash payments exceeding INR 50,000, while smaller cash payments are universally exempt.",
                    "Only environmental penalties, while statutory municipal tax delays are fully deductible on an accrual basis."
                ],
                "answerIndex": 0,
                "why": "Section 32 overrides book depreciation, Explanation 2 to Section 37(1) statutorily disallows CSR outlays, and Section 40A(3) mandates 100% disallowance of cash payments exceeding INR 10,000."
            }
        },
        {
            "id": 2,
            "title": "Comprehensive Book Profit Synthesis: Explanation 1 Additions, Deductions & Clause (iii)",
            "say": (
                "Having established the taxable income under normal provisions, our Milestone Operating System transitions to Track 2: The computation of 'Book Profit' under Section 115JB(2) read with Explanation 1. As established by the Supreme Court in Apollo Tyres, the starting point must be the net profit as per the audited profit and loss account prepared under Schedule III of the Companies Act 2013.\n\n"
                "The engine executes the dual statutory adjustment pipeline: First, it applies all mandatory statutory ADDITIONS under Explanation 1: (a) Provision for current income tax; (b) Amounts transferred to general or contingency reserves; (c) Provisions for unascertained liabilities; (d) Provisions for losses of subsidiaries; (e) Dividends paid or proposed; and (f) Deferred tax debits under Ind AS 12 / ASC 740. This yields the gross interim book profit.\n\n"
                "Second, the engine applies all statutory DEDUCTIONS under Explanation 1: (i) Amounts withdrawn from reserves originally added back; (ii) Exempt incomes under Section 10; (iii) Depreciation debited to the P&L, EXCLUDING the depreciation attributable to revaluation of assets; and (iv) Clause (iii) loss offset relief: The lower of brought forward book loss (excluding depreciation) or unabsorbed book depreciation. The resulting figure represents the final certified statutory Book Profit under Section 115JB, upon which the 15% Minimum Alternate Tax floor is levied.\n\n"
                "In this second part of our milestone project, we program an enterprise Section 115JB Comprehensive Book Profit Engine in Python. We ingest corporate financial balance sheets, execute the complete statutory addition and deduction cascade, enforce the Clause (iii) 'lower of loss or depreciation' rule, and compute the certified Book Profit."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class ComprehensiveMATData:\n"
                "    book_net_profit_pl: float\n"
                "    tax_provisions_debited: float\n"
                "    transfers_to_reserves_debited: float\n"
                "    unascertained_liability_provisions: float\n"
                "    deferred_tax_debit_in_pl: float\n"
                "    total_book_depreciation_in_pl: float\n"
                "    revaluation_depreciation_component: float\n"
                "    exempt_income_sec10: float\n"
                "    brought_forward_book_loss_excl_depr: float\n"
                "    brought_forward_unabsorbed_book_depr: float\n"
                "\n"
                "class GrandBookProfitEngine:\n"
                "    @staticmethod\n"
                "    def compute_certified_book_profit(mat: ComprehensiveMATData) -> Dict:\n"
                "        # Step 1: Explanation 1 Mandatory Additions\n"
                "        additions = (\n"
                "            mat.tax_provisions_debited +\n"
                "            mat.transfers_to_reserves_debited +\n"
                "            mat.unascertained_liability_provisions +\n"
                "            mat.deferred_tax_debit_in_pl\n"
                "        )\n"
                "        interim_profit = mat.book_net_profit_pl + additions\n"
                "        \n"
                "        # Step 2: Explanation 1 Mandatory Deductions\n"
                "        # Depreciation deduction excl revaluation depreciation\n"
                "        allowable_depr = max(0.0, mat.total_book_depreciation_in_pl - mat.revaluation_depreciation_component)\n"
                "        \n"
                "        # Clause (iii) Lower of B/F Loss or Unabsorbed Depreciation\n"
                "        clause_iii_relief = min(mat.brought_forward_book_loss_excl_depr, mat.brought_forward_unabsorbed_book_depr)\n"
                "        \n"
                "        total_deductions = allowable_depr + mat.exempt_income_sec10 + clause_iii_relief\n"
                "        final_book_profit = max(0.0, interim_profit - total_deductions)\n"
                "        \n"
                "        return {\n"
                "            'starting_schedule_iii_net_profit': mat.book_net_profit_pl,\n"
                "            'total_explanation_1_addbacks': round(additions, 2),\n"
                "            'interim_book_profit': round(interim_profit, 2),\n"
                "            'allowable_book_depr_deduction': round(allowable_depr, 2),\n"
                "            'clause_iii_lower_of_loss_depr_deduction': round(clause_iii_relief, 2),\n"
                "            'total_explanation_1_deductions': round(total_deductions, 2),\n"
                "            'certified_book_profit_sec115jb': round(final_book_profit, 2),\n"
                "            'mat_base_tax_15pct': round(final_book_profit * 0.15, 2)\n"
                "        }\n"
                "\n"
                "mat_input = ComprehensiveMATData(\n"
                "    book_net_profit_pl=120000000.0,\n"
                "    tax_provisions_debited=28000000.0,\n"
                "    transfers_to_reserves_debited=10000000.0,\n"
                "    unascertained_liability_provisions=5000000.0,\n"
                "    deferred_tax_debit_in_pl=8000000.0,\n"
                "    total_book_depreciation_in_pl=25000000.0,\n"
                "    revaluation_depreciation_component=3000000.0,\n"
                "    exempt_income_sec10=1000000.0,\n"
                "    brought_forward_book_loss_excl_depr=18000000.0,\n"
                "    brought_forward_unabsorbed_book_depr=12000000.0 # Lower figure used\n"
                ")\n"
                "engine = GrandBookProfitEngine()\n"
                "res = engine.compute_certified_book_profit(mat_input)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Executes Section 115JB Book Profit synthesis, adding back tax, reserves, and deferred tax while deducting net book depreciation and the lower of loss or unabsorbed depreciation.",
            "example": (
                "A corporation has $120M in accounting profit. Additions total $51M ($28M tax, $10M reserves, $5M contingent liabilities, $8M deferred tax), expanding interim profit to $171M. Deductions total $35M ($22M depreciation net of revaluation, $1M exempt income, $12M lower of loss or depreciation). Final certified Book Profit is $136M, yielding $20.4M base MAT."
            ),
            "tryIt": "Set revaluation_depreciation_component to 0.0 and observe how allowable book depreciation increases from 22M to 25M.",
            "check": {
                "question": "In computing Book Profit under Section 115JB, why is depreciation attributable to revaluation of assets excluded from the depreciation deduction?",
                "options": [
                    "To prevent companies from artificially inflating book deductions by writing up asset values without actual cash expenditure.",
                    "Because revaluation surplus is statutorily treated as taxable dividend income under Section 2(22).",
                    "Because revaluation depreciation is deductible exclusively against capital gains under Section 50.",
                    "Because the Companies Act 2013 strictly prohibits companies from ever revaluing physical assets."
                ],
                "answerIndex": 0,
                "why": "Explanation 1 clause (iia) excludes revaluation depreciation to prevent corporations from reducing their MAT liability by artificially writing up fixed asset values on the balance sheet."
            }
        },
        {
            "id": 3,
            "title": "Dual-Track Tax Confrontation: Normal Corporate Tax vs Section 115JB MAT Floor",
            "say": (
                "With both statutory tracks finalized—Taxable Income under Normal Provisions (Track 1) and Certified Book Profit under Section 115JB (Track 2)—the enterprise reaches the moment of statutory confrontation. The corporate tax controller must determine which tax regime governs the annual return, compute surcharges and health & education cess, and calculate the movement in the Section 115JAA MAT Credit ledger.\n\n"
                "Under the Old Corporate Tax Regime, the taxation architecture operates as follows: (1) Normal Tax is computed on taxable income at 30% (or 25% if turnover was below INR 400 Cr in the relevant prior year), plus 7% surcharge (if income exceeds INR 1 Cr) or 12% surcharge (if income exceeds INR 10 Cr), plus 4% Cess; (2) Minimum Alternate Tax is computed on Book Profit at 15% base rate, plus 7% surcharge (if book profit exceeds INR 1 Cr) or 12% surcharge (if book profit exceeds INR 10 Cr), plus 4% Cess; (3) The higher of the two figures is the final statutory tax liability remitted to the treasury in Form ITR-6; and (4) If MAT exceeds Normal Tax, the differential creates new Section 115JAA MAT Credit; if Normal Tax exceeds MAT, accumulated prior-year MAT credit is set off against the surplus.\n\n"
                "This dual-track confrontation requires absolute mathematical precision. If normal tax is artificially depressed due to accelerated depreciation, the company pays MAT, but gains a valuable balance sheet credit asset. If business profits surge, the company burns its accumulated MAT credit, lowering its net cash tax outflow to the statutory MAT floor.\n\n"
                "In this third part of our milestone project, we build an enterprise Dual-Track Tax Confrontation & MAT Credit Ledger Engine in Python. We calculate exact surcharges and cesses across both tracks, execute the statutory comparison, manage MAT credit origination and absorption, and compile the Form ITR-6 Schedule MAT and Schedule MATC summaries."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class DualTrackConfrontationData:\n"
                "    taxable_normal_income: float\n"
                "    certified_book_profit: float\n"
                "    accumulated_mat_credit_opening: float\n"
                "\n"
                "class DualTrackConfrontationEngine:\n"
                "    @staticmethod\n"
                "    def execute_confrontation(d: DualTrackConfrontationData) -> Dict:\n"
                "        # Track 1: Normal Tax Calculus (30% Base + Surcharge + 4% Cess)\n"
                "        base_normal = d.taxable_normal_income * 0.30\n"
                "        # Surcharge: 12% if > 10 Cr (100M); 7% if > 1 Cr (10M)\n"
                "        sc_rate_normal = 0.12 if d.taxable_normal_income > 100000000.0 else (0.07 if d.taxable_normal_income > 10000000.0 else 0.0)\n"
                "        sc_normal = base_normal * sc_rate_normal\n"
                "        normal_with_sc = base_normal + sc_normal\n"
                "        cess_normal = normal_with_sc * 0.04\n"
                "        gross_normal_tax = normal_with_sc + cess_normal\n"
                "        \n"
                "        # Track 2: MAT Calculus (15% Base + Surcharge + 4% Cess)\n"
                "        base_mat = d.certified_book_profit * 0.15\n"
                "        sc_rate_mat = 0.12 if d.certified_book_profit > 100000000.0 else (0.07 if d.certified_book_profit > 10000000.0 else 0.0)\n"
                "        sc_mat = base_mat * sc_rate_mat\n"
                "        mat_with_sc = base_mat + sc_mat\n"
                "        cess_mat = mat_with_sc * 0.04\n"
                "        gross_mat_tax = mat_with_sc + cess_mat\n"
                "        \n"
                "        # Confrontation and MAT Credit Movement\n"
                "        is_mat_governing = gross_mat_tax > gross_normal_tax\n"
                "        \n"
                "        if is_mat_governing:\n"
                "            final_tax = gross_mat_tax\n"
                "            new_mat_credit_created = gross_mat_tax - gross_normal_tax\n"
                "            mat_credit_utilized = 0.0\n"
                "            closing_mat_credit = d.accumulated_mat_credit_opening + new_mat_credit_created\n"
                "            status = f'MAT GOVERNS: Paid MAT of {round(final_tax, 2)}. Created {round(new_mat_credit_created, 2)} new MAT credit.'\n"
                "        else:\n"
                "            # Normal Tax governs -> Set off accumulated MAT credit up to (Normal Tax - MAT)\n"
                "            headroom = gross_normal_tax - gross_mat_tax\n"
                "            mat_credit_utilized = min(d.accumulated_mat_credit_opening, headroom)\n"
                "            final_tax = gross_normal_tax - mat_credit_utilized\n"
                "            new_mat_credit_created = 0.0\n"
                "            closing_mat_credit = d.accumulated_mat_credit_opening - mat_credit_utilized\n"
                "            status = f'NORMAL TAX GOVERNS: Set off {round(mat_credit_utilized, 2)} MAT credit. Net cash tax reduced to {round(final_tax, 2)}.'\n"
                "            \n"
                "        return {\n"
                "            'gross_normal_tax_payable': round(gross_normal_tax, 2),\n"
                "            'gross_mat_tax_payable': round(gross_mat_tax, 2),\n"
                "            'is_mat_higher_than_normal': is_mat_governing,\n"
                "            'final_cash_tax_remitted_itr6': round(final_tax, 2),\n"
                "            'opening_mat_credit': d.accumulated_mat_credit_opening,\n"
                "            'new_mat_credit_created_sec115jaa': round(new_mat_credit_created, 2),\n"
                "            'mat_credit_utilized_sec115jaa': round(mat_credit_utilized, 2),\n"
                "            'closing_mat_credit_asset_balance': round(closing_mat_credit, 2),\n"
                "            'statutory_compliance_status': status\n"
                "        }\n"
                "\n"
                "conf_data = DualTrackConfrontationData(\n"
                "    taxable_normal_income=111800000.0, # 111.8M from Part 1\n"
                "    certified_book_profit=136000000.0, # 136M from Part 2\n"
                "    accumulated_mat_credit_opening=15000000.0\n"
                ")\n"
                "engine = DualTrackConfrontationEngine()\n"
                "res = engine.execute_confrontation(conf_data)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Executes dual-track tax confrontation under Section 115JB, determining whether Normal Tax or MAT governs, calculating surcharge/cess, and managing Section 115JAA MAT credit.",
            "example": (
                "An enterprise has $111.8M in normal taxable income (yielding $39.07M Normal Tax with 12% surcharge and 4% cess) and $136M in Book Profit (yielding $23.76M MAT). Normal Tax exceeds MAT by $15.31M! The company utilizes its entire $15M opening MAT credit, slashing cash tax from $39.07M down to $24.07M while closing out its MAT credit ledger."
            ),
            "tryIt": "Set taxable_normal_income to 50,000,000.0 and observe how MAT ($23.76M) exceeds Normal Tax ($17.47M), generating $6.29M in new MAT credit.",
            "check": {
                "question": "When a company's Normal Corporate Tax liability exceeds its Minimum Alternate Tax liability, what is the maximum amount of accumulated MAT credit that can be utilized under Section 115JAA?",
                "options": [
                    "Up to the difference between the Normal Tax liability and the Minimum Alternate Tax liability for that year.",
                    "100% of the accumulated MAT credit, even if it reduces cash tax liability to zero.",
                    "Strictly capped at 25% of the total book profit reported under Schedule III.",
                    "An amount equal to the additional depreciation claimed under Section 32(1)(iia)."
                ],
                "answerIndex": 0,
                "why": "Section 115JAA(5) mandates that the set-off in respect of brought forward tax credit shall be allowed only to the extent of the difference between the tax on total income and the tax which would have been payable under Section 115JB."
            }
        },
        {
            "id": 4,
            "title": "Concessional Regime Assessment: Section 115BAA Evaluation & MAT Credit Forfeiture",
            "say": (
                "Now, our Milestone Operating System executes the parallel evaluation: What would the corporation's tax liability be if it opts for the Concessional Regime under Section 115BAA?\n\n"
                "To evaluate Section 115BAA, the engine executes three statutory recalibrations: (1) Tax Base Recalibration: It strips away all prohibited incentives under Section 115BAA(2)—restoring additional depreciation, SEZ profit holidays, and scientific research allowances back into the taxable base, while retaining the Section 80JJAA new employment deduction; (2) Flat Concessional Rate Application: It levies the flat 22% base tax, plus flat 10% surcharge, plus 4% cess, generating an unalterable effective tax rate of 25.168%; and (3) The Balance Sheet Sacrifice: It executes Section 115JB(5A) complete MAT immunity, but simultaneously enforces CBDT Circular 29/2019 by lapsing all accumulated Section 115JAA MAT credit!\n\n"
                "This evaluation reveals the core dilemma of corporate tax architecture. In our enterprise scenario, does the lower 25.168% rate generate enough recurring annual tax savings to justify the immediate balance sheet impairment of writing off millions in pre-paid MAT credits? Fiduciary duty requires corporate directors to base this decision on empirical discounted cash flow modeling rather than raw intuition.\n\n"
                "In this fourth part of our milestone project, we engineer an enterprise Section 115BAA Assessment & Asset Impairment Engine in Python. We compute the exact Section 115BAA tax liability, quantify the immediate balance sheet asset write-off, measure the annual rate savings, and establish the financial trade-off parameters."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict\n"
                "\n"
                "@dataclass\n"
                "class Section115BAAAssessmentData:\n"
                "    book_profit_before_tax: float\n"
                "    taxable_income_normal_regime: float\n"
                "    special_deductions_forfeited_under_baa: float # e.g. Addl Depr, SEZ\n"
                "    sec80jjaa_employment_deduction_retained: float\n"
                "    accumulated_mat_credit_on_balance_sheet: float\n"
                "    old_regime_cash_tax_payable: float\n"
                "\n"
                "class Section115BAAEvaluator:\n"
                "    @staticmethod\n"
                "    def assess_concessional_regime(data: Section115BAAAssessmentData) -> Dict:\n"
                "        # Taxable base expands under Sec 115BAA by adding back forfeited deductions\n"
                "        taxable_base_baa = data.taxable_income_normal_regime + data.special_deductions_forfeited_under_baa\n"
                "        \n"
                "        # Tax at flat effective 25.168%\n"
                "        tax_liability_baa = taxable_base_baa * 0.25168\n"
                "        \n"
                "        # Annual tax savings compared to Old Regime cash tax\n"
                "        annual_variance = data.old_regime_cash_tax_payable - tax_liability_baa\n"
                "        \n"
                "        # Asset write-off of MAT credit\n"
                "        mat_credit_lost = data.accumulated_mat_credit_on_balance_sheet\n"
                "        \n"
                "        return {\n"
                "            'taxable_income_old_regime': data.taxable_income_normal_regime,\n"
                "            'deductions_forfeited_under_sec115baa': data.special_deductions_forfeited_under_baa,\n"
                "            'recalibrated_taxable_base_sec115baa': round(taxable_base_baa, 2),\n"
                "            'effective_tax_rate_sec115baa': 25.168,\n"
                "            'total_tax_payable_sec115baa': round(tax_liability_baa, 2),\n"
                "            'old_regime_cash_tax_benchmark': round(data.old_regime_cash_tax_payable, 2),\n"
                "            'immediate_annual_cash_tax_saving': round(annual_variance, 2),\n"
                "            'forfeited_mat_credit_asset_writeoff': round(mat_credit_lost, 2),\n"
                "            'complete_mat_immunity_sec115jb_5a': True\n"
                "        }\n"
                "\n"
                "baa_input = Section115BAAAssessmentData(\n"
                "    book_profit_before_tax=120000000.0,\n"
                "    taxable_income_normal_regime=111800000.0,\n"
                "    special_deductions_forfeited_under_baa=10000000.0, # 10M Additional Depr forfeited\n"
                "    sec80jjaa_employment_deduction_retained=6000000.0,\n"
                "    accumulated_mat_credit_on_balance_sheet=15000000.0,\n"
                "    old_regime_cash_tax_payable=24068576.0 # From Part 3 (after MAT credit absorption)\n"
                ")\n"
                "engine = Section115BAAEvaluator()\n"
                "res = engine.assess_concessional_regime(baa_input)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Assesses corporate tax liability under Section 115BAA, calculating the expanded taxable base, flat 25.168% tax liability, and the immediate balance sheet MAT credit write-off.",
            "example": (
                "An enterprise's taxable income expands from $111.8M to $121.8M under Section 115BAA due to forfeiting $10M in additional depreciation. At 25.168%, Section 115BAA tax is $30.65M. In the Old Regime, after burning $15M in MAT credit, cash tax was $24.07M. In Year 1, the Old Regime saves $6.58M in cash tax, proving that opting for Section 115BAA prematurely would destroy capital."
            ),
            "tryIt": "Set accumulated_mat_credit_on_balance_sheet to 0.0 and observe how Section 115BAA becomes significantly more attractive without credit write-offs.",
            "check": {
                "question": "Why is Section 115BAA often less advantageous in the immediate short-term for companies holding large unutilized MAT credit balances?",
                "options": [
                    "Because electing Section 115BAA permanently extinguishes the ability to set off accumulated MAT credit, forcing an immediate balance sheet write-off.",
                    "Because Section 115BAA imposes an additional 15% exit surtax on all corporate cash reserves.",
                    "Because companies opting for Section 115BAA are legally prohibited from paying commercial dividends for 3 years.",
                    "Because the statutory tax rate under Section 115BAA escalates to 40% if turnover exceeds INR 500 Crores."
                ],
                "answerIndex": 0,
                "why": "CBDT Circular No. 29/2019 confirmed that unutilized MAT credit cannot be set off against Section 115BAA tax liabilities, meaning companies with large MAT credits lose pre-paid tax dollars if they switch prematurely."
            }
        },
        {
            "id": 5,
            "title": "Grand Milestone Cockpit: Multi-Year NPV Decision Matrix & Controller Board Defense",
            "say": (
                "Welcome to the Grand Master Capstone Viva Gate of Milestone Project 3. In this culminating module, we integrate all four analytical pipelines—Comprehensive PGBP Income (Part 1), Certified Book Profit under Section 115JB (Part 2), Dual-Track Tax Confrontation & MAT Credit Mechanics (Part 3), and Section 115BAA Concessional Assessment (Part 4)—into an executive Multi-Year Decision Cockpit.\n\n"
                "The corporate Chief Tax Officer and Board Audit Committee must decide: Do we remain in the Old Regime for Assessment Year 2027-28, or do we irrevocably file Form 10-IC to adopt Section 115BAA? This decision cannot be made based on a single year's snapshot. Our Milestone Operating System executes a 5-Year Discounted Cash Flow NPV Simulation across projected corporate growth rates, forecasting the precise point in time when accumulated MAT credits will be fully exhausted.\n\n"
                "The Optimal Board Decision Algorithm functions as follows: (Phase 1) If the enterprise holds substantial accumulated MAT credit that can be fully absorbed within 1 to 2 assessment years, the system recommends: 'REMAIN IN OLD REGIME TEMPORARILY'. The enterprise utilizes its pre-paid MAT credit asset to minimize immediate cash tax outflows; (Phase 2) Once the MAT credit ledger balance reaches NIL, the system triggers the automated recommendation: 'FILE FORM 10-IC IRREVOCABLY'. The enterprise transitions to Section 115BAA, locking in the permanent 25.168% rate and perpetual immunity from Section 115JB MAT forever.\n\n"
                "Successfully executing this complete milestone project proves mastery of corporate direct tax strategy, statutory reconciliations, MAT economics, and capital allocation modeling. Upon running this master simulation, you are officially accredited as a Senior Fellow in Corporate Direct Taxation & Fiscal Strategy, equipped to defend enterprise tax architectures before corporate boards, statutory auditors, and national tax tribunals."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import Dict, List\n"
                "\n"
                "class GrandCorporateTaxOperatingSystem:\n"
                "    def __init__(self, company_name: str, pan: str, wacc_discount_rate: float):\n"
                "        self.company = company_name\n"
                "        self.pan = pan\n"
                "        self.wacc = wacc_discount_rate\n"
                "\n"
                "    def execute_board_crossover_defense(\n"
                "        self,\n"
                "        initial_mat_credit_asset: float,\n"
                "        projected_5yr_profits: List[float],\n"
                "        projected_5yr_deductions_forfeited: List[float]\n"
                "    ) -> Dict:\n"
                "        RATE_OLD = 0.34944\n"
                "        RATE_BAA = 0.25168\n"
                "        \n"
                "        rem_mat_credit = initial_mat_credit_asset\n"
                "        npv_old_regime = 0.0\n"
                "        npv_baa_regime = 0.0\n"
                "        mat_exhaustion_year = None\n"
                "        yearly_log = []\n"
                "        \n"
                "        for yr in range(5):\n"
                "            profit = projected_5yr_profits[yr]\n"
                "            ded = projected_5yr_deductions_forfeited[yr]\n"
                "            discount = 1.0 / ((1.0 + self.wacc) ** (yr + 1))\n"
                "            \n"
                "            # Old Regime Tax:\n"
                "            normal_tax_gross = max(0.0, profit - ded) * RATE_OLD\n"
                "            mat_floor = profit * 0.17472\n"
                "            headroom = max(0.0, normal_tax_gross - mat_floor)\n"
                "            mat_used = min(rem_mat_credit, headroom)\n"
                "            rem_mat_credit -= mat_used\n"
                "            cash_old = normal_tax_gross - mat_used\n"
                "            \n"
                "            if rem_mat_credit == 0.0 and mat_exhaustion_year is None:\n"
                "                mat_exhaustion_year = yr + 1\n"
                "                \n"
                "            # Sec 115BAA Tax:\n"
                "            cash_baa = profit * RATE_BAA\n"
                "            \n"
                "            npv_old_regime += cash_old * discount\n"
                "            npv_baa_regime += cash_baa * discount\n"
                "            \n"
                "            yearly_log.append({\n"
                "                'year': yr + 1,\n"
                "                'profit': profit,\n"
                "                'cash_tax_old': round(cash_old, 2),\n"
                "                'mat_credit_utilized': round(mat_used, 2),\n"
                "                'remaining_mat_credit': round(rem_mat_credit, 2),\n"
                "                'cash_tax_sec115baa': round(cash_baa, 2)\n"
                "            })\n"
                "            \n"
                "        # Strategic Crossover Recommendation\n"
                "        if initial_mat_credit_asset > 0 and (mat_exhaustion_year is not None and mat_exhaustion_year <= 2):\n"
                "            board_strategy = (\n"
                "                f'PHASED TWO-STEP STRATEGY (RECOMMENDED): Remain in Old Regime for Years 1-{mat_exhaustion_year} '\n"
                "                f'to fully monetize the ${initial_mat_credit_asset} MAT credit asset. '\n"
                "                f'File Form 10-IC in Year {mat_exhaustion_year + 1} to permanently lock in 25.168% Section 115BAA rate.'\n"
                "            )\n"
                "            optimal_action = 'HOLD_OLD_REGIME_THEN_SWITCH'\n"
                "        elif npv_baa_regime < npv_old_regime:\n"
                "            board_strategy = 'IMMEDIATE ELECTION: File Form 10-IC immediately. NPV of Section 115BAA savings exceeds MAT credit value.'\n"
                "            optimal_action = 'SWITCH_IMMEDIATELY'\n"
                "        else:\n"
                "            board_strategy = 'MAINTAIN OLD REGIME: Retain special deductions and exhaust MAT credits.'\n"
                "            optimal_action = 'STAY_OLD_REGIME'\n"
                "            \n"
                "        return {\n"
                "            'corporation': self.company,\n"
                "            'pan': self.pan,\n"
                "            'wacc_discount_rate_pct': self.wacc * 100.0,\n"
                "            'opening_mat_credit_asset': initial_mat_credit_asset,\n"
                "            'mat_credit_fully_exhausted_by_year': mat_exhaustion_year,\n"
                "            '5yr_npv_tax_old_regime': round(npv_old_regime, 2),\n"
                "            '5yr_npv_tax_section_115baa': round(npv_baa_regime, 2),\n"
                "            'strategic_board_resolution': board_strategy,\n"
                "            'optimal_action_code': optimal_action,\n"
                "            'multi_year_tax_schedule': yearly_log\n"
                "        }\n"
                "\n"
                "app = GrandCorporateTaxOperatingSystem('Tata Advanced Industrial Systems Ltd', 'AAACT2727Q', 0.10)\n"
                "profits = [120000000.0, 150000000.0, 180000000.0, 220000000.0, 260000000.0]\n"
                "deductions = [10000000.0, 8000000.0, 5000000.0, 0.0, 0.0]\n"
                "res = app.execute_board_crossover_defense(initial_mat_credit_asset=15000000.0, projected_5yr_profits=profits, projected_5yr_deductions_forfeited=deductions)\n"
                "print(json.dumps(res, indent=2))\n"
            ),
            "codeNotes": "Grand master simulation synthesizing PGBP reconciliations, Section 115JB MAT, Section 115JAA credit absorption, and Section 115BAA crossover timing into a boardroom defense cockpit.",
            "example": (
                "A corporate group projects $120M to $260M in profits over 5 years with a $15M MAT credit balance. In Year 1, staying in the Old Regime fully absorbs the $15M MAT credit asset. The cockpit formulates the optimal board strategy: stay in the Old Regime for Year 1 to monetize the $15M credit, and then file Form 10-IC in Year 2 to permanently lock in the 25.168% Section 115BAA rate."
            ),
            "tryIt": "Increase initial_mat_credit_asset to 50,000,000.0 to see how the MAT credit exhaustion year shifts and alters the phased crossover timing.",
            "check": {
                "question": "What is the primary fiduciary justification for an enterprise holding unutilized MAT credits to delay filing Form 10-IC for Section 115BAA?",
                "options": [
                    "To allow the corporation to absorb its accumulated MAT credit asset against normal tax surplus before permanently forfeiting it upon entering Section 115BAA.",
                    "To wait until the statutory corporate tax rate under Section 115BAA is reduced to zero by the Ministry of Finance.",
                    "Because Section 115BAA requires a mandatory 3-year cooling off audit period before any foreign direct investment can be accepted.",
                    "To avoid paying the mandatory capital gains surcharge on unquoted equity share buybacks."
                ],
                "answerIndex": 0,
                "why": "Filing Form 10-IC irrevocably terminates the right to set off Section 115JAA MAT credits. Delaying election until the credit is fully absorbed against normal tax surplus monetizes the balance sheet asset."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_tax_day15_data.json", "w", encoding="utf-8") as f:
        json.dump(day15_data, f, indent=2)
    print("Successfully built scripts/bcom_tax_day15_data.json")
