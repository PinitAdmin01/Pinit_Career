# Day 49: Quality of Earnings & Forensic Accounting Diagnostics
# Comprehensive forensic accounting suite computing Sloan Accruals, Cash Flow Realism, and Beneish M-Score.

from dataclasses import dataclass
from typing import Dict

@dataclass
class ForensicFinancials:
    # Year t (current)
    rev_t: float
    cogs_t: float
    rec_t: float
    ca_t: float
    ppe_t: float
    ta_t: float
    dep_t: float
    sga_t: float
    ltd_t: float
    ni_t: float
    cfo_t: float
    # Year t-1 (prior)
    rev_prev: float
    cogs_prev: float
    rec_prev: float
    ca_prev: float
    ppe_prev: float
    ta_prev: float
    dep_prev: float
    sga_prev: float
    ltd_prev: float
    ni_prev: float
    cfo_prev: float

class ForensicAccountingDiagnostics:
    def __init__(self, f: ForensicFinancials):
        self.f = f

    def compute_sloan_accrual_analysis(self) -> Dict[str, float]:
        accruals = self.f.ni_t - self.f.cfo_t
        avg_assets = (self.f.ta_t + self.f.ta_prev) / 2.0
        accrual_ratio = accruals / avg_assets
        cf_realism = self.f.cfo_t / self.f.ni_t if self.f.ni_t != 0 else 0.0
        return {
            "total_accruals": round(accruals, 2),
            "accrual_ratio_pct": round(accrual_ratio * 100, 2),
            "cash_flow_realism_ratio": round(cf_realism, 2)
        }

    def compute_beneish_m_score(self) -> Dict[str, any]:
        # 1. DSRI
        dsri = (self.f.rec_t / self.f.rev_t) / (self.f.rec_prev / self.f.rev_prev)
        # 2. GMI
        gm_prev = (self.f.rev_prev - self.f.cogs_prev) / self.f.rev_prev
        gm_t = (self.f.rev_t - self.f.cogs_t) / self.f.rev_t
        gmi = gm_prev / gm_t
        # 3. AQI
        non_ca_ppe_t = 1.0 - ((self.f.ca_t + self.f.ppe_t) / self.f.ta_t)
        non_ca_ppe_prev = 1.0 - ((self.f.ca_prev + self.f.ppe_prev) / self.f.ta_prev)
        aqi = non_ca_ppe_t / non_ca_ppe_prev
        # 4. SGI
        sgi = self.f.rev_t / self.f.rev_prev
        # 5. DEPI
        dep_rate_prev = self.f.dep_prev / (self.f.ppe_prev + self.f.dep_prev)
        dep_rate_t = self.f.dep_t / (self.f.ppe_t + self.f.dep_t)
        depi = dep_rate_prev / dep_rate_t
        # 6. SGAI
        sgai = (self.f.sga_t / self.f.rev_t) / (self.f.sga_prev / self.f.rev_prev)
        # 7. LVGI
        lvgi = (self.f.ltd_t / self.f.ta_t) / (self.f.ltd_prev / self.f.ta_prev)
        # 8. TATA
        tata = (self.f.ni_t - self.f.cfo_t) / self.f.ta_t

        m_score = (
            -4.84
            + (0.920 * dsri)
            + (0.528 * gmi)
            + (0.404 * aqi)
            + (0.892 * sgi)
            + (0.115 * depi)
            - (0.172 * sgai)
            + (4.037 * tata)
            + (0.0327 * lvgi)
        )

        manipulation_risk = "Low Risk (Unlikely Manipulator)" if m_score <= -1.78 else "High Risk (Likely Manipulator)"
        return {
            "dsri": round(dsri, 4),
            "gmi": round(gmi, 4),
            "aqi": round(aqi, 4),
            "sgi": round(sgi, 4),
            "depi": round(depi, 4),
            "sgai": round(sgai, 4),
            "lvgi": round(lvgi, 4),
            "tata": round(tata, 4),
            "m_score": round(m_score, 2),
            "manipulation_risk": manipulation_risk
        }

# Case Study: Veritas Technologies Ltd
fin = ForensicFinancials(
    rev_t=120000000.0,
    cogs_t=72000000.0,
    rec_t=16000000.0,
    ca_t=44000000.0,
    ppe_t=60000000.0,
    ta_t=124000000.0,
    dep_t=6000000.0,
    sga_t=18000000.0,
    ltd_t=30000000.0,
    ni_t=14966400.0,
    cfo_t=18000000.0,
    rev_prev=100000000.0,
    cogs_prev=60000000.0,
    rec_prev=14000000.0,
    ca_prev=38000000.0,
    ppe_prev=54000000.0,
    ta_prev=110000000.0,
    dep_prev=5000000.0,
    sga_prev=16000000.0,
    ltd_prev=28000000.0,
    ni_prev=12000000.0,
    cfo_prev=14000000.0
)

analyzer = ForensicAccountingDiagnostics(fin)
sloan = analyzer.compute_sloan_accrual_analysis()
beneish = analyzer.compute_beneish_m_score()

assert sloan["total_accruals"] == -3033600.0
assert sloan["accrual_ratio_pct"] == -2.59
assert sloan["cash_flow_realism_ratio"] == 1.20

assert beneish["dsri"] == 0.9524
assert beneish["gmi"] == 1.0
assert beneish["aqi"] == 0.9857
assert beneish["sgi"] == 1.20
assert beneish["depi"] == 0.9322
assert beneish["sgai"] == 0.9375
assert beneish["lvgi"] == 0.9505
assert beneish["tata"] == -0.0245
assert beneish["m_score"] == -2.09
assert beneish["manipulation_risk"] == "Low Risk (Unlikely Manipulator)"

print(f"Sloan Accruals: ${sloan['total_accruals']:,.2f} | Accrual Ratio: {sloan['accrual_ratio_pct']}% | CF Realism: {sloan['cash_flow_realism_ratio']}x")
print(f"Beneish M-Score: {beneish['m_score']} ({beneish['manipulation_risk']}) | DSRI: {beneish['dsri']} | SGI: {beneish['sgi']} | TATA: {beneish['tata']}")
print("EARNINGS_QUALITY_FORENSIC_PASS")
