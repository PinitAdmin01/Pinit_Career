day33_code = """# Day 33: Ind AS 113 / IFRS 13 Fair Value Measurement Engine
# Simulating the 3-Level Fair Value Hierarchy, Principal vs Most Advantageous Market Selection,
# Transport vs Transaction Cost Filtering, and Level 3 DCF Valuation with CVA/DVA Adjustments.

from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class MarketOption:
    market_name: str
    quoted_price: float
    volume_trades_per_day: int
    transaction_costs: float
    transport_costs: float

class IndAS113FairValueEngine:
    def __init__(self, asset_id: str, asset_name: str, asset_class: str):
        self.asset_id = asset_id
        self.asset_name = asset_name
        self.asset_class = asset_class
        self.markets: List[MarketOption] = []

    def add_market(self, market: MarketOption):
        self.markets.append(market)

    def determine_fair_value_market(self) -> Dict[str, any]:
        \"\"\"
        Ind AS 113 Market Selection:
        1. Principal Market: Market with greatest volume and level of activity.
        2. If no principal market exists, use Most Advantageous Market: Maximizes net proceeds
           (Quoted Price - Transaction Costs - Transport Costs).
        Crucially: Fair Value = Quoted Price - Transport Costs (Transaction costs are NOT deducted from Fair Value!).
        \"\"\"
        if not self.markets:
            raise ValueError("No markets provided")

        # Check for principal market based on trading volume (threshold: > 10,000 trades/day)
        principal = max(self.markets, key=lambda m: m.volume_trades_per_day)
        if principal.volume_trades_per_day >= 10000:
            selected_market = principal
            selection_basis = "Principal Market (Highest Volume)"
        else:
            # Most Advantageous Market evaluation
            selected_market = max(self.markets, key=lambda m: (m.quoted_price - m.transaction_costs - m.transport_costs))
            selection_basis = "Most Advantageous Market (Max Net Proceeds)"

        fair_value = selected_market.quoted_price - selected_market.transport_costs
        net_proceeds = fair_value - selected_market.transaction_costs

        return {
            "selected_market": selected_market.market_name,
            "selection_basis": selection_basis,
            "quoted_price": selected_market.quoted_price,
            "transport_costs": selected_market.transport_costs,
            "transaction_costs": selected_market.transaction_costs,
            "fair_value": round(fair_value, 2),
            "net_proceeds": round(net_proceeds, 2)
        }

    def compute_level_3_dcf_with_cva(self, projected_cash_flows: List[float], discount_rate: float, cva_pct: float) -> Dict[str, float]:
        \"\"\"
        Level 3 Fair Value Measurement:
        Unobservable DCF model adjusted for Credit Valuation Adjustment (CVA / counterparty credit risk).
        \"\"\"
        raw_pv = 0.0
        for t, cf in enumerate(projected_cash_flows, 1):
            raw_pv += cf / ((1.0 + discount_rate) ** t)

        cva_deduction = raw_pv * (cva_pct / 100.0)
        adjusted_fair_value = raw_pv - cva_deduction

        return {
            "unadjusted_level3_dcf": round(raw_pv, 2),
            "cva_deduction": round(cva_deduction, 2),
            "adjusted_level3_fair_value": round(adjusted_fair_value, 2)
        }

# Execution and verification
engine = IndAS113FairValueEngine("COMM-CRUDE-01", "Physical Crude Oil Inventory", "Non-Financial Asset")

# Market A: Major Mercantile Exchange (Volume 25,000 trades/day, Price $80, Trans $2, Transport $3)
# Market B: Regional Hub (Volume 4,000 trades/day, Price $82, Trans $1, Transport $2)
engine.add_market(MarketOption("National Mercantile Exchange", 80.0, 25000, 2.0, 3.0))
engine.add_market(MarketOption("Regional Coastal Hub", 82.0, 4000, 1.0, 2.0))

market_res = engine.determine_fair_value_market()
# National Mercantile Exchange is Principal Market (25,000 volume > 10,000)
assert market_res["selected_market"] == "National Mercantile Exchange"
assert market_res["selection_basis"] == "Principal Market (Highest Volume)"
# Fair value = $80 (Quoted) - $3 (Transport) = $77.00. Transaction costs ($2) NOT deducted!
assert market_res["fair_value"] == 77.0
assert market_res["net_proceeds"] == 75.0

# Level 3 DCF for unquoted private equity interest: 3-year cash flows [$100k, $120k, $150k] at 10% discount, 2.5% CVA
level3_res = engine.compute_level_3_dcf_with_cva([100000.0, 120000.0, 150000.0], 0.10, 2.5)
# PV = 100k/1.1 + 120k/1.21 + 150k/1.331 = 90,909.09 + 99,173.55 + 112,697.22 = 302,779.86
assert level3_res["unadjusted_level3_dcf"] == 302779.86
# CVA = 2.5% of 302,779.86 = 7,569.50. Adjusted FV = 295,210.36
assert level3_res["cva_deduction"] == 7569.5
assert level3_res["adjusted_level3_fair_value"] == 295210.36

print(f"Asset: {engine.asset_name} ({engine.asset_class})")
print(f"Selected Market: {market_res['selected_market']} ({market_res['selection_basis']})")
print(f"Quoted Price: ${market_res['quoted_price']} | Transport: ${market_res['transport_costs']}")
print(f"Fair Value (Exit Price): ${market_res['fair_value']}")
print(f"Net Economic Proceeds: ${market_res['net_proceeds']}")
print(f"Level 3 Unadjusted DCF: ${level3_res['unadjusted_level3_dcf']}")
print(f"CVA Credit Risk Adjustment: -${level3_res['cva_deduction']}")
print(f"Level 3 Final Fair Value: ${level3_res['adjusted_level3_fair_value']}")
print("IND_AS_113_FAIR_VALUE_HIERARCHY_PASS")
"""

with open("scripts/test_day33_code.py", "w", encoding="utf-8") as f:
    f.write(day33_code)

print("Saved scripts/test_day33_code.py")
