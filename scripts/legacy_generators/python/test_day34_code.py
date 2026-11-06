# Day 34: Ind AS 109 / IFRS 9 Financial Instruments & 3-Stage ECL Impairment Engine
# Simulating Business Model & SPPI classification, 3-Stage Expected Credit Loss (ECL) transitions,
# and Simplified Provision Matrix for corporate trade receivables.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class DebtInstrument:
    instrument_id: str
    counterparty: str
    gross_exposure_usd: float
    days_past_due: int
    pd_12m_pct: float       # Probability of Default (12-month)
    pd_lifetime_pct: float  # Probability of Default (Lifetime)
    lgd_pct: float          # Loss Given Default (LGD)

class IndAS109InstrumentsEngine:
    def __init__(self, portfolio_name: str):
        self.portfolio_name = portfolio_name
        self.instruments: List[DebtInstrument] = []

    def add_instrument(self, inst: DebtInstrument):
        self.instruments.append(inst)

    def classify_and_measure_ecl(self) -> List[Dict[str, any]]:
        """
        Ind AS 109 3-Stage ECL Model:
        - Stage 1: Performing (DPD <= 30). Allowance = 12-Month ECL. Interest on Gross exposure.
        - Stage 2: Underperforming / SICR (30 < DPD <= 90). Allowance = Lifetime ECL. Interest on Gross exposure.
        - Stage 3: Credit-Impaired (DPD > 90). Allowance = Lifetime ECL. Interest on Net exposure (Gross - ECL).
        ECL Formula: Exposure at Default (EAD) * PD * LGD.
        """
        results = []
        for inst in self.instruments:
            lgd = inst.lgd_pct / 100.0

            if inst.days_past_due <= 30:
                stage = "Stage 1 (Performing)"
                pd = inst.pd_12m_pct / 100.0
                ecl_amount = round(inst.gross_exposure_usd * pd * lgd, 2)
                interest_basis = "Gross Carrying Amount"
                net_carrying = round(inst.gross_exposure_usd - ecl_amount, 2)
            elif 30 < inst.days_past_due <= 90:
                stage = "Stage 2 (Underperforming - SICR)"
                pd = inst.pd_lifetime_pct / 100.0
                ecl_amount = round(inst.gross_exposure_usd * pd * lgd, 2)
                interest_basis = "Gross Carrying Amount"
                net_carrying = round(inst.gross_exposure_usd - ecl_amount, 2)
            else:
                stage = "Stage 3 (Credit-Impaired)"
                pd = inst.pd_lifetime_pct / 100.0
                ecl_amount = round(inst.gross_exposure_usd * pd * lgd, 2)
                interest_basis = "Net Carrying Amount (Gross - Allowance)"
                net_carrying = round(inst.gross_exposure_usd - ecl_amount, 2)

            results.append({
                "id": inst.instrument_id,
                "counterparty": inst.counterparty,
                "gross_usd": inst.gross_exposure_usd,
                "dpd": inst.days_past_due,
                "stage": stage,
                "applied_pd_pct": round(pd * 100.0, 2),
                "lgd_pct": inst.lgd_pct,
                "ecl_allowance_usd": ecl_amount,
                "interest_basis": interest_basis,
                "net_carrying_usd": net_carrying
            })
        return results

    def compute_simplified_provision_matrix(self, aging_buckets: Dict[str, Dict[str, float]]) -> Dict[str, float]:
        """
        Simplified Approach for Trade Receivables (Ind AS 109.5.5.15):
        Lifetime ECL calculated using provision matrix historical default rates adjusted for macro factors.
        """
        total_receivables = 0.0
        total_allowance = 0.0

        for bucket, data in aging_buckets.items():
            exposure = data["exposure"]
            default_rate = data["default_rate_pct"] / 100.0
            allowance = round(exposure * default_rate, 2)
            total_receivables += exposure
            total_allowance += allowance

        return {
            "total_trade_receivables": round(total_receivables, 2),
            "total_lifetime_ecl_allowance": round(total_allowance, 2),
            "effective_coverage_pct": round((total_allowance / total_receivables) * 100.0, 2)
        }

# Execution and verification
engine = IndAS109InstrumentsEngine("Global Commercial Loan & Receivables Portfolio")

# Loan A: Stage 1 (0 DPD, 12m PD 1.5%, Lifetime PD 4.0%, LGD 40%) -> ECL = 1M * 1.5% * 40% = 6,000
engine.add_instrument(DebtInstrument("LOAN-01", "Veritas Industrial Ltd", 1000000.0, 5, 1.5, 4.0, 40.0))
# Loan B: Stage 2 (45 DPD, 12m PD 3.0%, Lifetime PD 12.0%, LGD 45%) -> ECL = 500k * 12.0% * 45% = 27,000
engine.add_instrument(DebtInstrument("LOAN-02", "Titan Logistics Corp", 500000.0, 45, 3.0, 12.0, 45.0))
# Loan C: Stage 3 (105 DPD, 12m PD 20.0%, Lifetime PD 60.0%, LGD 65%) -> ECL = 200k * 60.0% * 65% = 78,000
engine.add_instrument(DebtInstrument("LOAN-03", "Apex Distressed Retail", 200000.0, 105, 20.0, 60.0, 65.0))

ecl_results = engine.classify_and_measure_ecl()

assert ecl_results[0]["stage"] == "Stage 1 (Performing)"
assert ecl_results[0]["ecl_allowance_usd"] == 6000.0
assert ecl_results[0]["interest_basis"] == "Gross Carrying Amount"

assert ecl_results[1]["stage"] == "Stage 2 (Underperforming - SICR)"
assert ecl_results[1]["ecl_allowance_usd"] == 27000.0
assert ecl_results[1]["interest_basis"] == "Gross Carrying Amount"

assert ecl_results[2]["stage"] == "Stage 3 (Credit-Impaired)"
assert ecl_results[2]["ecl_allowance_usd"] == 78000.0
assert ecl_results[2]["interest_basis"] == "Net Carrying Amount (Gross - Allowance)"
assert ecl_results[2]["net_carrying_usd"] == 122000.0

# Simplified Provision Matrix Verification
matrix_data = {
    "Current": {"exposure": 800000.0, "default_rate_pct": 0.5},
    "1-30 DPD": {"exposure": 150000.0, "default_rate_pct": 2.0},
    "31-60 DPD": {"exposure": 40000.0, "default_rate_pct": 10.0},
    "60+ DPD": {"exposure": 10000.0, "default_rate_pct": 40.0}
}
# Total = 800k*0.5% (4000) + 150k*2% (3000) + 40k*10% (4000) + 10k*40% (4000) = 15,000
matrix_res = engine.compute_simplified_provision_matrix(matrix_data)
assert matrix_res["total_trade_receivables"] == 1000000.0
assert matrix_res["total_lifetime_ecl_allowance"] == 15000.0
assert matrix_res["effective_coverage_pct"] == 1.5

print(f"Portfolio: {engine.portfolio_name}")
for r in ecl_results:
    print(f"[{r['id']}] {r['counterparty']} ({r['stage']}): Gross ${r['gross_usd']} | ECL ${r['ecl_allowance_usd']} | Net ${r['net_carrying_usd']}")
print(f"Trade Receivables Matrix: Total ${matrix_res['total_trade_receivables']} | Lifetime ECL ${matrix_res['total_lifetime_ecl_allowance']} ({matrix_res['effective_coverage_pct']}%)")
print("IND_AS_109_ECL_FINANCIAL_INSTRUMENTS_PASS")
