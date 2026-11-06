# Day 37 Code Prototype: Ind AS 12 Income Taxes & Deferred Tax Engine
# Balance Sheet Liability Method calculating Taxable vs Deductible Temporary Differences and Net DTA/DTL.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class BalanceSheetItem:
    item_name: str
    is_asset: bool
    carrying_amount: float
    tax_base: float

class IndAS12DeferredTaxEngine:
    def __init__(self, enterprise_name: str, tax_rate_pct: float):
        self.enterprise_name = enterprise_name
        self.tax_rate = tax_rate_pct / 100.0

    def compute_deferred_tax(self, items: List[BalanceSheetItem]) -> Dict[str, any]:
        """Calculates temporary differences and DTA/DTL using Balance Sheet Liability method."""
        taxable_temp_diff = 0.0
        deductible_temp_diff = 0.0
        details = []

        for item in items:
            if item.is_asset:
                diff = item.carrying_amount - item.tax_base
                if diff > 0:
                    taxable_temp_diff += diff
                    kind = "Taxable (DTL)"
                else:
                    deductible_temp_diff += abs(diff)
                    kind = "Deductible (DTA)"
            else: # Liability
                diff = item.tax_base - item.carrying_amount
                if diff > 0:
                    taxable_temp_diff += diff
                    kind = "Taxable (DTL)"
                else:
                    deductible_temp_diff += abs(diff)
                    kind = "Deductible (DTA)"

            details.append({
                "item": item.item_name,
                "carrying": item.carrying_amount,
                "tax_base": item.tax_base,
                "difference": round(abs(item.carrying_amount - item.tax_base), 2),
                "type": kind
            })

        dtl_amount = round(taxable_temp_diff * self.tax_rate, 2)
        dta_amount = round(deductible_temp_diff * self.tax_rate, 2)
        net_position = round(dtl_amount - dta_amount, 2)
        is_net_dtl = net_position > 0

        return {
            "taxable_temporary_difference": round(taxable_temp_diff, 2),
            "deductible_temporary_difference": round(deductible_temp_diff, 2),
            "deferred_tax_liability": dtl_amount,
            "deferred_tax_asset": dta_amount,
            "net_deferred_tax_balance": abs(net_position),
            "net_classification": "Net Deferred Tax Liability" if is_net_dtl else "Net Deferred Tax Asset",
            "details": details
        }

# Enacted tax rate under Section 115BAA: 22% base + 10% surcharge + 4% cess = 25.168%
engine = IndAS12DeferredTaxEngine("Vertex Industrial Solutions Ltd", 25.168)

portfolio = [
    BalanceSheetItem("Plant & Machinery (SLM vs WDV)", is_asset=True, carrying_amount=800000.0, tax_base=600000.0),
    BalanceSheetItem("Provision for Warranties", is_asset=False, carrying_amount=150000.0, tax_base=0.0),
    BalanceSheetItem("Right-of-Use Asset (Ind AS 116)", is_asset=True, carrying_amount=517024.0, tax_base=0.0),
    BalanceSheetItem("Lease Liability (Ind AS 116)", is_asset=False, carrying_amount=492024.0, tax_base=0.0),
]

res = engine.compute_deferred_tax(portfolio)

# Plant: +$200k taxable diff
# Warranties: +$150k deductible diff
# ROU Asset: +$517,024 taxable diff
# Lease Liability: +$492,024 deductible diff
# Total Taxable = 200,000 + 517,024 = 717,024.0
# Total Deductible = 150,000 + 492,024 = 642,024.0
assert res["taxable_temporary_difference"] == 717024.0
assert res["deductible_temporary_difference"] == 642024.0

# DTL = 717,024 * 0.25168 = 180,460.60
# DTA = 642,024 * 0.25168 = 161,584.60
assert res["deferred_tax_liability"] == 180460.60
assert res["deferred_tax_asset"] == 161584.60
# Net DTL = 180,460.60 - 161,584.60 = 18,876.00
assert res["net_deferred_tax_balance"] == 18876.00
assert res["net_classification"] == "Net Deferred Tax Liability"

print(f"Enterprise: {engine.enterprise_name} (Tax Rate: {engine.tax_rate*100}%)")
print(f"Total Taxable Temporary Differences: ${res['taxable_temporary_difference']}")
print(f"Total Deductible Temporary Differences: ${res['deductible_temporary_difference']}")
print(f"Gross DTL: ${res['deferred_tax_liability']} | Gross DTA: ${res['deferred_tax_asset']}")
print(f"Reported Balance Sheet Position: {res['net_classification']} of ${res['net_deferred_tax_balance']}")
print("IND_AS_12_INCOME_TAXES_DTA_DTL_PASS")
