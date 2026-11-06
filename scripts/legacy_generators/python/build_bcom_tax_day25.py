"""
Build Day 25 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Milestone Project 5: Enterprise Tax Controversy, Scrutiny Defense & Litigation Cockpit
"""
import json
import os

day_data = {
    "day": 25,
    "title": "Milestone Project 5: Enterprise Tax Controversy, Scrutiny Defense & Litigation Cockpit",
    "parts": [
        {
            "title": "Tax Controversy Cockpit Architecture & E-Scrutiny Defense Module",
            "say": [
                "Welcome to Day 25 Milestone Project 5: The Enterprise Tax Controversy, Scrutiny Defense & Litigation Cockpit. Over Days 21 to 24, we mastered the statutory architecture of direct tax controversy: faceless assessments under Section 144B, income escaping reassessments under Section 147/148, appellate hierarchies from CIT(A) to the Supreme Court, and Section 270A penalty frameworks. Today, we synthesize these procedures into an automated corporate defense cockpit.",
                "In Part 1, we build the E-Scrutiny Defense Module under Section 143(3) and Section 144B. When NaFAC issues electronic notices under Section 142(1) or Section 143(2), enterprise legal teams must immediately evaluate statutory limitation periods, verify whether requests exceed the 3-year prior book production limit under Section 142(1) proviso, and prepare structured factual submissions.",
                "Our Python module audits notice metadata, tracks the statutory 3-month limitation window for Section 143(2) notices from the end of the financial year, and verifies whether the assessment unit served mandatory Show Cause Notices prior to framing adverse variations. If procedural flaws exist, the engine automatically generates writ petition grounds under Article 226 of the Constitution to challenge defective jurisdiction before the High Court.",
                "Simultaneously, the engine logs all portal submissions, tracks digital acknowledgments, and schedules video conference hearing requests to ensure compliance with principles of natural justice."
            ],
            "example": "A corporation receives a Section 143(2) notice dated July 10, 2026 for a return filed in October 2025. The engine calculates the limitation deadline of June 30, 2026, flags the notice as served after 3 months from FY end, and prepares a jurisdictional challenge invoking the Supreme Court's Hotel Blue Moon precedent.",
            "code": '''class ScrutinyDefenseEngine:
    def __init__(self, fy_return_filed: int, assessment_year: int):
        self.fy_return_filed = fy_return_filed
        self.assessment_year = assessment_year
        self.disallowances = []

    def verify_sec143_2_limitation(self, notice_service_date: str) -> dict:
        limitation_deadline = f"{self.fy_return_filed + 1}-06-30"
        is_time_barred = notice_service_date > limitation_deadline
        
        return {
            "notice_service_date": notice_service_date,
            "statutory_deadline": limitation_deadline,
            "is_time_barred": is_time_barred,
            "legal_status": "VOID AB INITIO (CIT v. Hotel Blue Moon)" if is_time_barred else "Jurisdictionally Valid"
        }

    def register_adverse_variation(self, issue: str, proposed_addition_cr: float, has_scn: bool, video_hearing_granted: bool):
        is_quashable = (not has_scn) or (not video_hearing_granted)
        record = {
            "issue": issue,
            "addition_cr": proposed_addition_cr,
            "has_mandatory_scn": has_scn,
            "video_hearing_honored": video_hearing_granted,
            "order_quashable_under_sec144b": is_quashable
        }
        self.disallowances.append(record)
        return record

scrutiny_eng = ScrutinyDefenseEngine(fy_return_filed=2025, assessment_year=2026)
lim_check = scrutiny_eng.verify_sec143_2_limitation(notice_service_date="2026-06-20")
print(f"Scrutiny Notice Jurisdictional Check: {lim_check['legal_status']} (Served: {lim_check['notice_service_date']} <= {lim_check['statutory_deadline']})")

var1 = scrutiny_eng.register_adverse_variation("PGBP Section 37 Disallowance", proposed_addition_cr=1.5, has_scn=True, video_hearing_granted=True)
var2 = scrutiny_eng.register_adverse_variation("Section 68 Unexplained Share Premium", proposed_addition_cr=3.0, has_scn=False, video_hearing_granted=False)

print(f"Variation 1 Status: Quashable = {var1['order_quashable_under_sec144b']}")
print(f"Variation 2 Status: Quashable = {var2['order_quashable_under_sec144b']} (Breach of Sec 144B SCN requirement)")
''',
            "tryIt": "Modify notice_service_date to '2026-07-05' to observe the engine flagging the notice as void ab initio due to time bar.",
            "check": {
                "question": "In our ScrutinyDefenseEngine, what legal consequence is identified when NaFAC proposes an adverse addition without issuing an electronic Show Cause Notice under Section 144B?",
                "options": [
                    "The assessment order is quashable in writ jurisdiction for violating mandatory Section 144B procedures and principles of natural justice",
                    "The addition is automatically halved by the software",
                    "The taxpayer is required to deposit 50% of the disputed demand",
                    "The Assessing Officer is rewarded with an accelerated promotion"
                ],
                "answerIndex": 0,
                "why": "Section 144B establishes that an adverse variation cannot be made without serving a show-cause notice with draft order; failure to do so violates statutory natural justice, rendering the order quashable."
            }
        },
        {
            "title": "Reopening & Section 148A Pre-Notice Invalidation Simulator",
            "say": [
                "In Part 2 of our Milestone Project, we operationalize defense against reassessment notices: the Section 148A Reassessment Defense Simulator. When tax authorities attempt to reopen concluded assessments, corporate taxpayers must rigorously challenge the reassessment at the threshold stage.",
                "Our Python module audits Section 148A proceedings across four statutory filters: (1) verifying whether the inquiry was backed by 'information' under Section 148 Explanation 1 rather than an impermissible change of opinion under the Kelvinator doctrine; (2) testing compliance with Section 148A(b), ensuring that the taxpayer was served with the actual underlying evidentiary material and granted between 7 and 30 days to reply; (3) auditing Section 149 limitation windows, verifying whether notices issued beyond 3 years involve escaped income of Rs 50 Lakh or more represented by assets or entries; and (4) verifying whether sanction under Section 151 was granted by the competent Specified Authority (PCIT within 3 years, PCCIT/CCIT beyond 3 years) with genuine application of mind.",
                "If any of these statutory checks fail, the engine drafts formal legal objections under Section 148A(c), challenging the jurisdiction of the Assessing Officer to issue the Section 148 notice.",
                "The engine provides corporate tax counsel with an objective probability-of-success score for quashing Section 148 notices before the High Court."
            ],
            "example": "An AO issues a Section 148A(b) notice for AY 2021-22 in year 2026, alleging Rs 42 Lakh of escaped income, with approval from the PCIT. The simulator flags: (a) escaped income is under Rs 50 Lakh, barring reopening beyond 3 years under Section 149(1)(b); and (b) approval was granted by PCIT instead of CCIT under Section 151(ii). The simulator certifies a 100% quashable rating.",
            "code": '''class ReopeningDefenseSimulator:
    def __init__(self, assessment_year: int, reopen_year: int):
        self.ay = assessment_year
        self.reopen_year = reopen_year
        self.ay_end = assessment_year + 1
        self.years_elapsed = reopen_year - self.ay_end

    def audit_reassessment_package(self, alleged_escaped_cr: float, is_change_of_opinion: bool, evidence_shared_with_scn: bool, reply_days: int, approver_rank: str) -> dict:
        defects = []
        
        # 1. Kelvinator Change of Opinion test
        if is_change_of_opinion:
            defects.append("Impermissible Change of Opinion (CIT v. Kelvinator of India Ltd.)")
            
        # 2. Sec 148A(b) Evidence Disclosure
        if not evidence_shared_with_scn:
            defects.append("Sec 148A(b) Violation: Underlying evidence withheld (UOI v. Ashish Agarwal)")
            
        # 3. Sec 148A(b) Reply Window
        if reply_days < 7 or reply_days > 30:
            defects.append(f"Statutory reply window breached: {reply_days} days (Must be 7-30 days)")
            
        # 4. Sec 149 Limitation Test
        if self.years_elapsed > 3:
            if alleged_escaped_cr < 0.50:  # Less than Rs 50 Lakh
                defects.append(f"Sec 149(1)(b) Bar: Escaped income INR {alleged_escaped_cr:.2f} Cr < Rs 50 Lakh threshold for >3 years")
                
        # 5. Sec 151 Approval Competence
        if self.years_elapsed > 3 and approver_rank not in ["PCCIT", "CCIT", "PDGIT", "DGIT"]:
            defects.append(f"Sec 151(ii) Competence Failure: Approved by {approver_rank}, but PCCIT/CCIT mandatory beyond 3 years")
            
        is_quashable = len(defects) > 0
        return {
            "assessment_year": f"AY {self.ay}-{str(self.ay+1)[-2:]}",
            "years_elapsed": self.years_elapsed,
            "escaped_income_cr": alleged_escaped_cr,
            "total_defects_found": len(defects),
            "jurisdictional_defects": defects,
            "quash_probability_rating": "High (Quashable in Writ)" if is_quashable else "Low (Validly Reopened)"
        }

reopen_sim = ReopeningDefenseSimulator(assessment_year=2021, reopen_year=2026)
reopen_audit = reopen_sim.audit_reassessment_package(
    alleged_escaped_cr=0.42,
    is_change_of_opinion=True,
    evidence_shared_with_scn=False,
    reply_days=10,
    approver_rank="PCIT"
)

print("Reopening Defense Audit:")
print(f"  Assessment Year: {reopen_audit['assessment_year']} ({reopen_audit['years_elapsed']} years elapsed)")
print(f"  Escaped Income: INR {reopen_audit['escaped_income_cr']:.2f} Cr")
print(f"  Defects Found: {reopen_audit['total_defects_found']}")
for d in reopen_audit['jurisdictional_defects']:
    print(f"    [!] {d}")
print(f"  Writ Quash Verdict: {reopen_audit['quash_probability_rating']}")
''',
            "tryIt": "Set alleged_escaped_cr to 1.20 Cr, is_change_of_opinion to False, evidence_shared_with_scn to True, and approver_rank to 'CCIT' to observe the assessment becoming legally defensible by revenue.",
            "check": {
                "question": "In our ReopeningDefenseSimulator, why was the reassessment notice for AY 2021-22 quashable despite approval from the Principal Commissioner (PCIT)?",
                "options": [
                    "Because more than 3 years had elapsed from the end of AY, Section 151(ii) strictly mandated approval from a Chief Commissioner (CCIT/PCCIT), and escaped income was below Rs 50 Lakh",
                    "Because all reassessments are unconstitutional under Indian law",
                    "Because the company was located in a Special Economic Zone",
                    "Because the Assessing Officer failed to arrest the company's directors"
                ],
                "answerIndex": 0,
                "why": "Section 151(ii) strictly requires Chief Commissioner sanction beyond 3 years, and Section 149(1)(b) prohibits reopening beyond 3 years if escaped income is under Rs 50 Lakh."
            }
        },
        {
            "title": "Appellate Decision Matrix & ITAT Stay of Demand Optimizer",
            "say": [
                "In Part 3 of our Milestone Project, we engineer the strategic litigation management component: The Appellate Decision Matrix & Stay of Demand Optimizer under Sections 246A, 253, and 254.",
                "When an adverse assessment order is received, corporate finance must execute an immediate cost-benefit analysis comparing: (1) accepting the order and claiming Section 270AA statutory immunity from penalties; (2) filing a first appeal before the Faceless CIT(Appeals) in Form 35 within 30 days; or (3) where a draft order was issued under Section 144C, filing objections before the Dispute Resolution Panel (DRP) within 30 days.",
                "Where high-value tax demands are sustained by the CIT(A), the engine models the second appellate filing before the ITAT in Form 36 within 60 days. It automates the stay of demand calculation under Section 254(2A), computing the mandatory 20% deposit threshold required to secure an initial 180-day stay of coercive recovery proceedings.",
                "The engine also projects the financial impact of Section 220(2) interest (1% per month) accruing during appeal pendency versus the expected internal rate of return (IRR) on capital retained, empowering the CFO to make mathematically optimal treasury decisions."
            ],
            "example": "A company faces a Rs 5 Crore tax demand. The engine models three paths: (A) Pay Rs 5Cr + waive appeal -> Sec 270AA immunity; (B) File CIT(A) appeal + request 20% stay (pay Rs 1Cr, retain Rs 4Cr); (C) DRP fast-track for transfer pricing issues. The engine calculates interest costs under Section 220(2) at Rs 5 Lakh/month and evaluates litigation success probabilities.",
            "code": '''class AppellateStrategyEngine:
    def __init__(self, disputed_tax_cr: float, interest_220_months: int = 12):
        self.disputed_tax_cr = disputed_tax_cr
        self.interest_months = interest_220_months

    def compare_litigation_paths(self, is_tp_or_foreign_co: bool, win_probability_pct: float, treasury_yield_pct: float = 7.5) -> dict:
        # Option 1: Sec 270AA Immunity (Pay 100% tax, 0% penalty, waive appeal)
        cost_option_1 = self.disputed_tax_cr
        
        # Option 2: Appeal Route with 20% Stay of Demand
        deposit_20pct_cr = self.disputed_tax_cr * 0.20
        retained_capital_cr = self.disputed_tax_cr * 0.80
        
        # Sec 220(2) Interest on unpaid demand: 1% per month (12% per annum)
        unpaid_demand_cr = self.disputed_tax_cr - deposit_20pct_cr
        accrued_interest_cr = unpaid_demand_cr * (0.01 * self.interest_months)
        
        # Treasury yield on retained capital
        treasury_income_cr = retained_capital_cr * (treasury_yield_pct / 100.0) * (self.interest_months / 12.0)
        
        # Expected value of appeal: (Disputed Tax + Interest) * (1 - win_prob)
        expected_appeal_cost = (self.disputed_tax_cr + accrued_interest_cr) * (1.0 - (win_probability_pct / 100.0)) - treasury_income_cr
        
        fast_track_channel = "Dispute Resolution Panel (DRP under Sec 144C)" if is_tp_or_foreign_co else "Faceless CIT(Appeals) under Sec 246A"
        
        recommended_action = "Pursue Appeal with 20% Stay" if expected_appeal_cost < cost_option_1 else "Settle via Section 270AA Immunity"
        
        return {
            "disputed_tax_cr": self.disputed_tax_cr,
            "fast_track_forum": fast_track_channel,
            "statutory_20pct_deposit_cr": deposit_20pct_cr,
            "accrued_sec220_interest_cr": accrued_interest_cr,
            "retained_treasury_income_cr": treasury_income_cr,
            "expected_appeal_economic_cost_cr": expected_appeal_cost,
            "cost_of_immediate_settlement_cr": cost_option_1,
            "strategic_recommendation": recommended_action
        }

strategy_eng = AppellateStrategyEngine(disputed_tax_cr=5.0, interest_220_months=18)
sim = strategy_eng.compare_litigation_paths(is_tp_or_foreign_co=True, win_probability_pct=65.0, treasury_yield_pct=7.5)

print("Appellate Decision Optimization Matrix:")
print(f"  Disputed Tax: INR {sim['disputed_tax_cr']:.2f} Cr | Preferred Forum: {sim['fast_track_forum']}")
print(f"  Mandatory 20% Stay Deposit: INR {sim['statutory_20pct_deposit_cr']:.2f} Cr")
print(f"  18-Month Sec 220(2) Interest (1%/mo): INR {sim['accrued_sec220_interest_cr']:.4f} Cr")
print(f"  Expected Economic Cost of Appeal (65% Win Prob): INR {sim['expected_appeal_economic_cost_cr']:.4f} Cr")
print(f"  Cost of Immediate Sec 270AA Settlement: INR {sim['cost_of_immediate_settlement_cr']:.2f} Cr")
print(f"  CFO Advisory: {sim['strategic_recommendation']}")
''',
            "tryIt": "Reduce win_probability_pct to 20.0% to observe the strategic recommendation shifting to immediate settlement via Section 270AA immunity.",
            "check": {
                "question": "What is the monthly interest rate charged under Section 220(2) of the Income Tax Act on unpaid tax demands during the pendency of appeals?",
                "options": [
                    "One percent (1%) for every month or part of a month",
                    "Half percent (0.5%) per month",
                    "Two percent (2%) quarterly",
                    "Zero interest if an appeal is pending before the CIT(Appeals)"
                ],
                "answerIndex": 0,
                "why": "Section 220(2) explicitly provides that if the amount specified in any notice of demand is not paid within the period limited, the assessee shall be liable to pay simple interest at one percent for every month or part of a month."
            }
        },
        {
            "title": "Penalty Mitigation & Section 270AA Immunity Execution Engine",
            "say": [
                "In Part 4 of our Milestone Project, we construct the penalty defense and immunity execution engine: The Penalty Mitigation Engine under Sections 270A, 270AA, and 271AAC.",
                "When the assessing unit issues a penalty notice under Section 274 read with Section 270A, corporate tax teams must analyze whether the addition represents under-reporting (50% penalty) or misreporting (200% penalty). The engine checks whether the additions fall into any of the statutory safe harbors under Section 270A(6)—such as bona fide explanations, transfer pricing documentation maintenance, or book estimates.",
                "Where additions are classified under Section 270A(7) (under-reporting), the engine automates the Section 270AA immunity execution package: calculating the exact demand payable under Section 156, verifying payment within 30 days, confirming that appellate remedies were waived, and generating Form 68 within one month from the end of the month of assessment order receipt.",
                "If the assessing unit attempts to invoke punitive unexplained income rates under Section 115BBE and Section 271AAC (83.25% total leakage), the engine models evidentiary submissions proving source, identity, and creditworthiness under Section 68 to reclassify the receipts as regular business turnover taxable at 25.168%."
            ],
            "example": "An Indian manufacturing company receives a Section 143(3) order with a Rs 1.2 Crore disallowance under Section 43B. The engine analyzes the order, confirms it is under-reporting under Section 270A(7), verifies zero misreporting allegations, computes the Rs 30.2 Lakh tax demand, and prepares the Form 68 filing package, securing 100% immunity from the Rs 15.1 Lakh penalty.",
            "code": '''class PenaltyDefenseEngine:
    def __init__(self, corporate_tax_rate_pct: float = 25.168):
        self.tax_rate = corporate_tax_rate_pct

    def process_penalty_notice(self, addition_cr: float, addition_type: str, has_bona_fide_explanation: bool, paid_within_30d: bool, appeal_waived: bool) -> dict:
        tax_demand_cr = addition_cr * (self.tax_rate / 100.0)
        
        if addition_type == "unexplained_sec68":
            # Section 115BBE + Sec 271AAC (77.25% + 6% = 83.25%)
            effective_tax_pct = 77.25
            penalty_pct = 6.0
            total_leakage_cr = addition_cr * 0.8325
            return {
                "addition_cr": addition_cr,
                "classification": "Section 68 Unexplained Credit",
                "tax_payable_cr": addition_cr * (effective_tax_pct / 100.0),
                "penalty_payable_cr": addition_cr * (penalty_pct / 100.0),
                "total_demand_cr": total_leakage_cr,
                "sec270aa_immunity_eligible": False,
                "strategy": "Contest on merit; prove Identity, Creditworthiness, and Genuineness under Sec 68"
            }
            
        elif addition_type == "misreporting_sec270a_9":
            penalty_200pct_cr = tax_demand_cr * 2.0
            return {
                "addition_cr": addition_cr,
                "classification": "Section 270A(8)/(9) Misreporting",
                "tax_payable_cr": tax_demand_cr,
                "penalty_payable_cr": penalty_200pct_cr,
                "total_demand_cr": tax_demand_cr + penalty_200pct_cr,
                "sec270aa_immunity_eligible": False,
                "strategy": "Mandatory Appeal to ITAT; challenge failure to specify exact Sec 270A(9) clause"
            }
            
        else:  # Standard Under-Reporting
            if has_bona_fide_explanation:
                penalty_payable = 0.0
                status = "Penalty Excluded under Section 270A(6)(a)"
                immunity_needed = False
            elif paid_within_30d and appeal_waived:
                penalty_payable = 0.0
                status = "100% Penalty Waived via Form 68 Immunity under Section 270AA"
                immunity_needed = True
            else:
                penalty_payable = tax_demand_cr * 0.50
                status = "50% Penalty Payable under Section 270A(7)"
                immunity_needed = False
                
            return {
                "addition_cr": addition_cr,
                "classification": "Section 270A(7) Under-Reporting",
                "tax_payable_cr": tax_demand_cr,
                "penalty_payable_cr": penalty_payable,
                "total_demand_cr": tax_demand_cr + penalty_payable,
                "sec270aa_immunity_eligible": True,
                "status": status,
                "form_68_action": "Execute Form 68 Filing" if immunity_needed else "Not Required"
            }

pen_eng = PenaltyDefenseEngine()
defense_eval = pen_eng.process_penalty_notice(
    addition_cr=1.20,
    addition_type="under_reporting",
    has_bona_fide_explanation=False,
    paid_within_30d=True,
    appeal_waived=True
)

print("Penalty Mitigation Analysis:")
print(f"  Addition Assessed: INR {defense_eval['addition_cr']:.2f} Cr ({defense_eval['classification']})")
print(f"  Tax Demand: INR {defense_eval['tax_payable_cr']:.4f} Cr")
print(f"  Penalty Due: INR {defense_eval['penalty_payable_cr']:.4f} Cr")
print(f"  Outcome: {defense_eval['status']}")
print(f"  Action Required: {defense_eval['form_68_action']}")
''',
            "tryIt": "Set addition_type to 'unexplained_sec68' to observe the engine quantifying the 83.25% punitive rate under Section 115BBE and Section 271AAC.",
            "check": {
                "question": "What is the primary statutory prerequisite for an Assessing Officer to grant an order waiving 100% of penalty under Section 270AA?",
                "options": [
                    "The tax demand is paid within the notice period, no appeal is filed, and Form 68 is submitted within one month of order receipt for under-reporting cases",
                    "The company pledges 51% of its voting equity to the President of India",
                    "The company agrees to undergo voluntary corporate liquidation",
                    "The company files a writ petition before the High Court"
                ],
                "answerIndex": 0,
                "why": "Section 270AA(1) strictly conditions immunity on: (a) payment of demand within the notice window, (b) non-filing of appeal, and (c) submission of application within one month from end of order receipt month."
            }
        },
        {
            "title": "Integrated Master Capstone: The Enterprise Tax Controversy & Litigation Cockpit",
            "say": [
                "In this final capstone part of Milestone Project 5, we unite all four specialized controversy sub-engines into a single, comprehensive corporate command center: The Enterprise Tax Controversy, Scrutiny Defense & Litigation Cockpit.",
                "Our master cockpit manages the entire lifecycle of corporate tax disputes: (1) automated intake of Section 143(1) intimations and Section 143(2) scrutiny notices with limitation date tracking; (2) Section 148A reassessment audit defense with Kelvinator change of opinion checks and Section 149/151 jurisdictional validation; (3) appellate management modeling CIT(Appeals), DRP fast-track routing, and ITAT Section 254(2A) 20% stay deposits; and (4) penalty optimization deploying Section 270AA Form 68 immunity protocols.",
                "The cockpit provides corporate boards and audit committees with a real-time Tax Controversy Balance Sheet: tracking total disputed tax demands, accrued Section 220(2) interest liabilities, bank guarantees furnished, and risk-weighted provisions required under Ind AS 37 (Provisions, Contingent Liabilities and Contingent Assets).",
                "Graduating from Milestone Project 5 certifies your accreditation as a Master Corporate Tax Controversialist and Litigation Strategist, capable of defending multinational balance sheets against adverse assessments and securing statutory finality across all judicial forums."
            ],
            "example": "A multi-billion rupee conglomerate executes the cockpit across four open assessment years. The cockpit flags an AY 2021-22 reassessment as quashable in writ jurisdiction (saving Rs 4 Crore), processes an AY 2023-24 scrutiny order through Section 270AA immunity (saving Rs 35 Lakh in penalties), and secures an ITAT stay of demand for AY 2022-23 on a 20% deposit, delivering an audited litigation report to the Board of Directors.",
            "code": '''class EnterpriseTaxControversyCockpit:
    def __init__(self, company_name: str, pan: str):
        self.company_name = company_name
        self.pan = pan
        self.scrutiny_engine = ScrutinyDefenseEngine(fy_return_filed=2025, assessment_year=2026)
        self.reopen_sim = ReopeningDefenseSimulator(assessment_year=2021, reopen_year=2026)
        self.appellate_engine = AppellateStrategyEngine(disputed_tax_cr=4.5)
        self.penalty_engine = PenaltyDefenseEngine()

    def generate_executive_controversy_dossier(self) -> dict:
        # 1. Scrutiny Jurisdictional Health
        scrutiny_res = self.scrutiny_engine.verify_sec143_2_limitation("2026-06-25")
        
        # 2. Reopening Writ Assessment
        reopen_res = self.reopen_sim.audit_reassessment_package(
            alleged_escaped_cr=0.45,
            is_change_of_opinion=True,
            evidence_shared_with_scn=False,
            reply_days=10,
            approver_rank="PCIT"
        )
        
        # 3. Appellate Strategy
        appellate_res = self.appellate_engine.compare_litigation_paths(is_tp_or_foreign_co=True, win_probability_pct=70.0)
        
        # 4. Penalty Mitigation Package
        penalty_res = self.penalty_engine.process_penalty_notice(
            addition_cr=1.0,
            addition_type="under_reporting",
            has_bona_fide_explanation=False,
            paid_within_30d=True,
            appeal_waived=True
        )
        
        contingent_liability_cr = appellate_res["disputed_tax_cr"] + reopen_res["escaped_income_cr"] * 0.25168
        
        return {
            "company": self.company_name,
            "pan": self.pan,
            "scrutiny_status": scrutiny_res["legal_status"],
            "reopening_writ_viability": reopen_res["quash_probability_rating"],
            "appellate_channel": appellate_res["fast_track_forum"],
            "stay_deposit_required_cr": appellate_res["statutory_20pct_deposit_cr"],
            "penalty_resolution": penalty_res["status"],
            "total_contingent_liability_cr": contingent_liability_cr,
            "ind_as_37_disclosure": f"Contingent Liability of INR {contingent_liability_cr:.2f} Cr disclosed in Notes to Accounts",
            "boardroom_accreditation": "Accredited by Chief Tax Counsel & Head of Tax Litigation"
        }

cockpit = EnterpriseTaxControversyCockpit(company_name="Apex Industrial Enterprises Ltd", pan="AAACA1234F")
dossier = cockpit.generate_executive_controversy_dossier()

print("=" * 80)
print(f"ENTERPRISE TAX CONTROVERSY & LITIGATION COCKPIT — {dossier['company']}")
print(f"Permanent Account Number (PAN): {dossier['pan']}")
print("=" * 80)
print(f"  Current Scrutiny Health  : {dossier['scrutiny_status']}")
print(f"  Reassessment Defense     : {dossier['reopening_writ_viability']}")
print(f"  Appellate Routing        : {dossier['appellate_channel']}")
print(f"  ITAT 20% Stay Deposit    : INR {dossier['stay_deposit_required_cr']:.2f} Crores")
print(f"  Penalty Immunity Status  : {dossier['penalty_resolution']}")
print(f"  Ind AS 37 Accounting    : {dossier['ind_as_37_disclosure']}")
print(f"  Executive Signoff        : {dossier['boardroom_accreditation']}")
print("=" * 80)
''',
            "tryIt": "Execute the script to observe the comprehensive boardroom controversy report consolidating scrutiny, reassessment, appellate stay, and penalty immunity into an executive dashboard.",
            "check": {
                "question": "What is the primary corporate governance purpose of maintaining an integrated Tax Controversy & Litigation Cockpit under Ind AS 37?",
                "options": [
                    "To accurately quantify contingent tax liabilities, track limitation periods, optimize cash deposits, and defend corporate balance sheets across all appellate tiers",
                    "To permanently abolish all future income tax assessments",
                    "To allow corporate officers to evade responding to statutory notices",
                    "To transfer all tax liabilities to overseas shell corporations"
                ],
                "answerIndex": 0,
                "why": "The integrated cockpit ensures rigorous quantitative risk management, monitoring statutory limitation dates, optimizing stay of demand deposits, and fulfilling audited Ind AS 37 contingent liability disclosures."
            }
        }
    ]
}

with open("scripts/bcom_tax_day25_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day25_data.json")
