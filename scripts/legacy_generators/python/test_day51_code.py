# Enterprise Ind AS 36 Impairment of Assets Engine
# Titan Industrial Technologies Ltd - Robotics CGU Valuation & Impairment Suite

class IndAS36ImpairmentEngine:
    def __init__(self, cgu_name: str, assets: dict, discount_rate: float):
        self.cgu_name = cgu_name
        self.assets = assets.copy()
        self.initial_carrying = assets.copy()
        self.discount_rate = discount_rate

    def compute_total_carrying(self) -> float:
        return sum(self.assets.values())

    def compute_viu(self, projected_cash_flows: list, terminal_value: float) -> float:
        viu = 0.0
        for t, cf in enumerate(projected_cash_flows, 1):
            viu += cf / ((1 + self.discount_rate) ** t)
        n = len(projected_cash_flows)
        viu += terminal_value / ((1 + self.discount_rate) ** n)
        return viu

    def determine_recoverable_amount(self, fvlcod: float, viu: float) -> tuple[float, str]:
        if viu >= fvlcod:
            return viu, "Value in Use (VIU)"
        return fvlcod, "Fair Value Less Costs of Disposal (FVLCOD)"

    def allocate_impairment(self, recoverable_amount: float) -> dict:
        total_carrying = self.compute_total_carrying()
        if recoverable_amount >= total_carrying:
            return {"impairment_loss": 0.0, "allocations": {}, "post_carrying": self.assets.copy()}

        total_loss = total_carrying - recoverable_amount
        allocations = {}
        post_carrying = self.assets.copy()

        # Step 1: Write down Goodwill first
        goodwill_carrying = self.assets.get("Goodwill", 0.0)
        goodwill_loss = min(goodwill_carrying, total_loss)
        allocations["Goodwill"] = goodwill_loss
        post_carrying["Goodwill"] -= goodwill_loss
        remaining_loss = total_loss - goodwill_loss

        # Step 2: Allocate remaining loss pro-rata to non-goodwill assets
        non_gw_assets = {k: v for k, v in self.assets.items() if k != "Goodwill"}
        total_non_gw = sum(non_gw_assets.values())

        for k, v in non_gw_assets.items():
            prop = v / total_non_gw
            asset_loss = remaining_loss * prop
            allocations[k] = asset_loss
            post_carrying[k] -= asset_loss

        return {
            "total_carrying": total_carrying,
            "recoverable_amount": recoverable_amount,
            "impairment_loss": total_loss,
            "goodwill_loss": goodwill_loss,
            "remaining_loss": remaining_loss,
            "allocations": allocations,
            "post_carrying": post_carrying
        }

def run_impairment_simulation():
    cgu_assets = {
        "Goodwill": 4000000.00,
        "Robotic Machinery": 18000000.00,
        "Proprietary Software": 10000000.00,
        "Factory Premises": 12000000.00
    }
    wacc_pre_tax = 0.12
    engine = IndAS36ImpairmentEngine("Titan Robotics CGU", cgu_assets, wacc_pre_tax)

    cf_projections = [6000000.00, 6500000.00, 7000000.00, 7200000.00, 7500000.00]
    terminal_val = 15000000.00

    viu = engine.compute_viu(cf_projections, terminal_val)
    fvlcod = 31000000.00
    rec_amt, basis = engine.determine_recoverable_amount(fvlcod, viu)

    result = engine.allocate_impairment(rec_amt)

    print(f"CGU: {engine.cgu_name}")
    print(f"Initial CGU Carrying Amount: ${result['total_carrying']:,.2f}")
    print(f"Fair Value Less Costs of Disposal: ${fvlcod:,.2f}")
    print(f"Value in Use (VIU at 12% WACC): ${viu:,.2f}")
    print(f"Recoverable Amount: ${rec_amt:,.2f} based on {basis}")
    print(f"Total Ind AS 36 Impairment Loss: ${result['impairment_loss']:,.2f}")
    print(f"Goodwill Impairment (100% written off): ${result['goodwill_loss']:,.2f}")
    print(f"Pro-Rata Impairment Allocated: ${result['remaining_loss']:,.2f}")
    print(f"  - Robotic Machinery (45.0%): ${result['allocations']['Robotic Machinery']:,.2f} | Carrying: ${result['post_carrying']['Robotic Machinery']:,.2f}")
    print(f"  - Proprietary Software (25.0%): ${result['allocations']['Proprietary Software']:,.2f} | Carrying: ${result['post_carrying']['Proprietary Software']:,.2f}")
    print(f"  - Factory Premises (30.0%): ${result['allocations']['Factory Premises']:,.2f} | Carrying: ${result['post_carrying']['Factory Premises']:,.2f}")
    print(f"Reconciled CGU Post-Impairment Carrying: ${sum(result['post_carrying'].values()):,.2f}")
    print("IND_AS_36_ASSET_IMPAIRMENT_PASS")

if __name__ == "__main__":
    run_impairment_simulation()
