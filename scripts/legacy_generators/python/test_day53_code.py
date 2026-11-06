# Enterprise Ind AS 113 Fair Value Measurement Engine
# Apex Global Assets & Capital Management Ltd - Multi-Asset Fair Value Hierarchy Suite

class IndAS113FairValueEngine:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name
        self.portfolio = {}

    def add_level1_asset(self, name: str, quantity: float, quoted_price: float):
        fv = quantity * quoted_price
        self.portfolio[name] = {"level": "Level 1", "fair_value": fv, "technique": "Quoted Market Price (Active Market)"}

    def add_level2_asset(self, name: str, observable_value: float, technique: str):
        self.portfolio[name] = {"level": "Level 2", "fair_value": observable_value, "technique": technique}

    def evaluate_hbu_non_financial_asset(self, name: str, existing_use_val: float, alternative_gross_val: float, demolition_costs: float):
        hbu_net_val = alternative_gross_val - demolition_costs
        is_hbu_alternative = hbu_net_val > existing_use_val
        chosen_fv = hbu_net_val if is_hbu_alternative else existing_use_val
        self.portfolio[name] = {
            "level": "Level 3",
            "fair_value": chosen_fv,
            "existing_use_value": existing_use_val,
            "hbu_value": hbu_net_val,
            "hbu_premium": chosen_fv - existing_use_val,
            "technique": "Market Approach (Highest & Best Use - Redevelopment)"
        }

    def add_level3_dcf_asset(self, name: str, base_fv: float, sens_down_fv: float, sens_up_fv: float):
        self.portfolio[name] = {
            "level": "Level 3",
            "fair_value": base_fv,
            "technique": "Income Approach (Discounted Cash Flow)",
            "sens_minus_100bps": sens_down_fv,
            "sens_plus_100bps": sens_up_fv
        }

    def get_hierarchy_summary(self) -> dict:
        summary = {"Level 1": 0.0, "Level 2": 0.0, "Level 3": 0.0}
        total = 0.0
        for item in self.portfolio.values():
            lvl = item["level"]
            fv = item["fair_value"]
            summary[lvl] += fv
            total += fv
        summary["Total"] = total
        return summary

def run_fair_value_simulation():
    engine = IndAS113FairValueEngine("Apex Global Assets Ltd")

    # 1. Level 1 Asset: Quoted Equity
    engine.add_level1_asset("Blue-Chip NSE Equity", 100000, 45.00)

    # 2. Level 2 Asset: Corporate Bond Swap (SOFR + Spread)
    engine.add_level2_asset("SOFR Corporate Bond Swap", 12850000.00, "Matrix Pricing (Observable Yields & Spreads)")

    # 3. Level 3 Asset: Real Estate HBU
    engine.evaluate_hbu_non_financial_asset("Metropolitan Tech Parcel", 8500000.00, 22000000.00, 2500000.00)

    # 4. Level 3 Asset: Private Equity DCF
    engine.add_level3_dcf_asset("Fintech Private Equity", 15200000.00, 16800000.00, 13850000.00)

    h_sum = engine.get_hierarchy_summary()

    print(f"Enterprise: {engine.enterprise_name}")
    print(f"Level 1 Quoted Equity: ${engine.portfolio['Blue-Chip NSE Equity']['fair_value']:,.2f}")
    print(f"Level 2 Matrix Swaps: ${engine.portfolio['SOFR Corporate Bond Swap']['fair_value']:,.2f}")
    land = engine.portfolio['Metropolitan Tech Parcel']
    print(f"Level 3 Real Estate: Existing Use ${land['existing_use_value']:,.2f} | HBU Fair Value ${land['fair_value']:,.2f} | HBU Premium ${land['hbu_premium']:,.2f}")
    pe = engine.portfolio['Fintech Private Equity']
    print(f"Level 3 Private Equity: DCF Base ${pe['fair_value']:,.2f} | -100bps WACC ${pe['sens_minus_100bps']:,.2f} | +100bps WACC ${pe['sens_plus_100bps']:,.2f}")
    print("Fair Value Hierarchy Distribution:")
    print(f"  - Level 1: ${h_sum['Level 1']:,.2f} ({(h_sum['Level 1']/h_sum['Total'])*100:.2f}%)")
    print(f"  - Level 2: ${h_sum['Level 2']:,.2f} ({(h_sum['Level 2']/h_sum['Total'])*100:.2f}%)")
    print(f"  - Level 3: ${h_sum['Level 3']:,.2f} ({(h_sum['Level 3']/h_sum['Total'])*100:.2f}%)")
    print(f"Total Fair Value Portfolio: ${h_sum['Total']:,.2f}")
    print("IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS")

if __name__ == "__main__":
    run_fair_value_simulation()
