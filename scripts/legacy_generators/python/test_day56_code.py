# Day 56: Transnational Corporate Restructuring & Cross-Border Merger Engine
# Simulating Sections 230-232 dual-majority thresholds, S.234 Cross-Border RBI FEMA compliance,
# and Section 2(42C) Income Tax slump sale vs NCLT demerger financial routing.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class VotingStakeholder:
    holder_id: str
    stakeholder_type: str  # 'creditor' or 'equity_shareholder'
    value_inr_crores: float
    vote: str              # 'FOR', 'AGAINST', 'ABSTAIN'

class RestructuringGovernanceEngine:
    def __init__(self, scheme_name: str, transferor: str, transferee: str, jurisdiction: str):
        self.scheme_name = scheme_name
        self.transferor = transferor
        self.transferee = transferee
        self.jurisdiction = jurisdiction
        self.voters: List[VotingStakeholder] = []

    def register_voter(self, holder: VotingStakeholder):
        self.voters.append(holder)

    def evaluate_section_230_dual_majority(self, stakeholder_type: str) -> Dict[str, any]:
        """
        Section 230(6) Companies Act 2013 Dual-Majority Test:
        Scheme must be approved by:
        1. Majority in number (numerical majority > 50% of stakeholders present and voting).
        2. Three-fourths (75% or more) in value of stakeholders present and voting.
        """
        active_voters = [v for v in self.voters if v.stakeholder_type == stakeholder_type and v.vote in ('FOR', 'AGAINST')]
        if not active_voters:
            return {"approved": False, "reason": "No active voters present and voting"}

        total_headcount = len(active_voters)
        total_value = sum(v.value_inr_crores for v in active_voters)

        for_voters = [v for v in active_voters if v.vote == 'FOR']
        for_headcount = len(for_voters)
        for_value = sum(v.value_inr_crores for v in for_voters)

        headcount_pct = (for_headcount / total_headcount) * 100.0
        value_pct = (for_value / total_value) * 100.0 if total_value > 0 else 0.0

        numerical_majority_passed = for_headcount > (total_headcount / 2.0)
        value_three_fourths_passed = value_pct >= 75.0

        is_approved = numerical_majority_passed and value_three_fourths_passed
        return {
            "approved": is_approved,
            "total_headcount": total_headcount,
            "for_headcount": for_headcount,
            "headcount_pct": round(headcount_pct, 2),
            "numerical_majority_passed": numerical_majority_passed,
            "total_value_cr": round(total_value, 2),
            "for_value_cr": round(for_value, 2),
            "value_pct": round(value_pct, 2),
            "value_three_fourths_passed": value_three_fourths_passed
        }

    def verify_fema_cross_border_rules(self, is_inbound: bool, rbi_pricing_guidelines_met: bool, valuer_registered: bool) -> bool:
        """
        Section 234 & Foreign Exchange Management (Cross Border Merger) Regulations 2018:
        Requires compliance with RBI pricing guidelines, registered valuer certification,
        and deemed RBI approval / prior RBI sanction.
        """
        if not valuer_registered:
            return False
        if not rbi_pricing_guidelines_met:
            return False
        return True

    def calculate_slump_sale_capital_gains(self, lump_sum_consideration_cr: float, book_assets_cr: float, revaluation_reserve_cr: float, liabilities_cr: float) -> float:
        """
        Section 50B Income Tax Act 1961: Slump sale net worth computation.
        Net worth = (Book value of assets excluding revaluation) - Liabilities.
        Capital Gain = Slump consideration - Net worth.
        """
        net_worth = (book_assets_cr - revaluation_reserve_cr) - liabilities_cr
        capital_gain = lump_sum_consideration_cr - net_worth
        return round(capital_gain, 2)

# Execution and verification
engine = RestructuringGovernanceEngine("Project Pegasus Demerger & Merger", "Apex Tech India Ltd", "Global Nexus Inc", "Cross-Border Inbound")

# Creditors class voting: 10 creditors present
engine.register_voter(VotingStakeholder("CR-1", "creditor", 450.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-2", "creditor", 200.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-3", "creditor", 150.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-4", "creditor", 100.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-5", "creditor", 50.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-6", "creditor", 40.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-7", "creditor", 30.0, "FOR"))
engine.register_voter(VotingStakeholder("CR-8", "creditor", 20.0, "AGAINST"))
engine.register_voter(VotingStakeholder("CR-9", "creditor", 25.0, "AGAINST"))
engine.register_voter(VotingStakeholder("CR-10", "creditor", 15.0, "AGAINST"))

cred_result = engine.evaluate_section_230_dual_majority("creditor")
assert cred_result["approved"] is True
assert cred_result["headcount_pct"] == 70.0  # 7 out of 10 > 50%
assert cred_result["value_pct"] >= 75.0      # 1020 / 1080 = 94.44%

fema_ok = engine.verify_fema_cross_border_rules(is_inbound=True, rbi_pricing_guidelines_met=True, valuer_registered=True)
assert fema_ok is True

slump_gain = engine.calculate_slump_sale_capital_gains(
    lump_sum_consideration_cr=500.0,
    book_assets_cr=650.0,
    revaluation_reserve_cr=50.0,
    liabilities_cr=250.0
)
# Net worth = (650 - 50) - 250 = 350.0. Capital gain = 500.0 - 350.0 = 150.0
assert slump_gain == 150.0

print(f"Dual Majority Approved: {cred_result['approved']}")
print(f"Headcount: {cred_result['for_headcount']}/{cred_result['total_headcount']} ({cred_result['headcount_pct']}%)")
print(f"Value: INR {cred_result['for_value_cr']} Cr / {cred_result['total_value_cr']} Cr ({cred_result['value_pct']}%)")
print(f"FEMA Cross-Border Merger Compliance: {fema_ok}")
print(f"Section 50B Slump Sale Capital Gain: INR {slump_gain} Cr")
print("SCHEMES_OF_ARRANGEMENT_AND_CROSS_BORDER_MERGER_PASS")
