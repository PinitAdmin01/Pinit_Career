# Enterprise Ind AS 105 Held for Sale & Discontinued Operations Engine
# Mahindra Sterling Industrial Holdings Ltd - Thermal Turbine Disposal Group Suite

class IndAS105DisposalGroupEngine:
    def __init__(self, division_name: str, assets: dict, liabilities: dict):
        self.division_name = division_name
        self.assets = assets.copy()
        self.liabilities = liabilities.copy()
        self.tax_rate = 0.25168

    def get_net_carrying_amount(self) -> float:
        return sum(self.assets.values()) - sum(self.liabilities.values())

    def measure_held_for_sale(self, agreed_price: float, disposal_costs: float) -> dict:
        net_fvlcts = agreed_price - disposal_costs
        net_carrying = self.get_net_carrying_amount()

        impairment_loss = max(0.0, net_carrying - net_fvlcts)
        allocations = {}
        post_assets = self.assets.copy()

        # Step 1: Write down Goodwill first
        gw = self.assets.get("Goodwill", 0.0)
        gw_loss = min(gw, impairment_loss)
        allocations["Goodwill"] = gw_loss
        post_assets["Goodwill"] -= gw_loss
        rem_loss = impairment_loss - gw_loss

        # Step 2: Allocate remaining loss to qualifying non-current assets (PPE & Intangibles)
        qualifying_assets = ["Plant & Machinery", "Factory Buildings", "Turbine Patents"]
        total_qualifying = sum(self.assets[k] for k in qualifying_assets)

        for k in qualifying_assets:
            prop = self.assets[k] / total_qualifying
            asset_loss = rem_loss * prop
            allocations[k] = asset_loss
            post_assets[k] -= asset_loss

        return {
            "initial_net_carrying": net_carrying,
            "net_fvlcts": net_fvlcts,
            "total_impairment_loss": impairment_loss,
            "goodwill_loss": gw_loss,
            "remaining_loss": rem_loss,
            "allocations": allocations,
            "post_assets": post_assets,
            "post_net_carrying": sum(post_assets.values()) - sum(self.liabilities.values())
        }

    def compute_discontinued_single_line_pnl(self, revenue: float, opex: float, measurement_impairment: float) -> dict:
        op_profit_pretax = revenue - opex
        total_pretax = op_profit_pretax - measurement_impairment
        tax_impact = total_pretax * self.tax_rate  # Negative indicates tax benefit
        post_tax_discontinued_result = total_pretax - tax_impact

        return {
            "revenue": revenue,
            "opex": opex,
            "op_profit_pretax": op_profit_pretax,
            "measurement_impairment": measurement_impairment,
            "total_pretax": total_pretax,
            "tax_impact": tax_impact,
            "single_line_discontinued_net_loss": post_tax_discontinued_result
        }

def run_held_for_sale_simulation():
    division_assets = {
        "Goodwill": 2000000.00,
        "Plant & Machinery": 14000000.00,
        "Factory Buildings": 10000000.00,
        "Turbine Patents": 4000000.00,
        "Working Capital": 6000000.00
    }
    division_liabilities = {
        "Trade Payables & Provisions": 4000000.00
    }

    engine = IndAS105DisposalGroupEngine("Thermal Turbine Division", division_assets, division_liabilities)

    # Classification & Measurement at Lower of Carrying and FVLCTS
    agreed_price = 29000000.00
    disposal_costs = 1500000.00
    m_res = engine.measure_held_for_sale(agreed_price, disposal_costs)

    # Single-line Discontinued Operations P&L
    revenue = 18000000.00
    opex = 15000000.00
    pnl_res = engine.compute_discontinued_single_line_pnl(revenue, opex, m_res["total_impairment_loss"])

    print(f"Division: {engine.division_name}")
    print(f"Initial Net Carrying Amount: ${m_res['initial_net_carrying']:,.2f}")
    print(f"Fair Value Less Costs to Sell (FVLCTS): ${m_res['net_fvlcts']:,.2f}")
    print(f"Ind AS 105 Measurement Impairment Loss: ${m_res['total_impairment_loss']:,.2f}")
    print(f"Goodwill Written Off: ${m_res['goodwill_loss']:,.2f}")
    print(f"Allocated to Plant & Machinery (50.0%): ${m_res['allocations']['Plant & Machinery']:,.2f} | Post-Carrying: ${m_res['post_assets']['Plant & Machinery']:,.2f}")
    print(f"Allocated to Factory Buildings (35.71%): ${m_res['allocations']['Factory Buildings']:,.2f} | Post-Carrying: ${m_res['post_assets']['Factory Buildings']:,.2f}")
    print(f"Allocated to Turbine Patents (14.29%): ${m_res['allocations']['Turbine Patents']:,.2f} | Post-Carrying: ${m_res['post_assets']['Turbine Patents']:,.2f}")
    print(f"Post-Measurement Net Carrying Amount: ${m_res['post_net_carrying']:,.2f}")
    print(f"Cessation of Depreciation: Strictly Enforced under Ind AS 105.25")
    print(f"Discontinued Operations Pre-Tax Result: ${pnl_res['total_pretax']:,.2f}")
    print(f"Discontinued Operations Tax Benefit (25.168%): ${abs(pnl_res['tax_impact']):,.2f}")
    print(f"Single-Line Discontinued Operations Post-Tax Net Result: ${pnl_res['single_line_discontinued_net_loss']:,.2f}")
    print("IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS")

if __name__ == "__main__":
    run_held_for_sale_simulation()
