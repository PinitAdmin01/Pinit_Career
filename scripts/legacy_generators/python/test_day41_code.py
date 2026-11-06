# test_day41_code.py
from dataclasses import dataclass
from typing import Dict, Tuple

class BusinessCombinationsEngine:
    def __init__(self, acquirer: str, target: str, tax_rate_pct: float):
        self.acquirer = acquirer
        self.target = target
        self.tax_rate = tax_rate_pct / 100.0

    def compute_consideration(
        self,
        cash_paid: float,
        shares_issued: int,
        share_price: float,
        contingent_consideration_pv: float,
        acquisition_fees: float
    ) -> Tuple[float, float]:
        """Calculates total consideration and separates expensed acquisition fees."""
        equity_fair_value = shares_issued * share_price
        total_consideration = cash_paid + equity_fair_value + contingent_consideration_pv
        expensed_costs = acquisition_fees  # Expensed directly in P&L
        return total_consideration, expensed_costs

    def execute_purchase_price_allocation(
        self,
        target_book_net_assets: float,
        ppe_fair_value_step_up: float,
        intangible_assets_identified: float
    ) -> Dict[str, float]:
        """Performs PPA including deferred tax liabilities on fair value adjustments."""
        gross_step_up = ppe_fair_value_step_up + intangible_assets_identified
        dtl_on_step_up = gross_step_up * self.tax_rate
        net_identifiable_assets = (
            target_book_net_assets + gross_step_up - dtl_on_step_up
        )
        return {
            "gross_fair_value_step_up": round(gross_step_up, 2),
            "dtl_on_fair_value_adjustments": round(dtl_on_step_up, 2),
            "net_identifiable_assets": round(net_identifiable_assets, 2)
        }

    def compute_goodwill(
        self,
        consideration: float,
        net_identifiable_assets: float,
        nci_percentage: float,
        nci_fair_value: float = None
    ) -> Dict[str, float]:
        """Computes goodwill under both Proportionate Share and Full Goodwill methods."""
        # 1. Proportionate Share Method
        nci_prop = net_identifiable_assets * (nci_percentage / 100.0)
        goodwill_prop = consideration + nci_prop - net_identifiable_assets
        
        # 2. Full Goodwill (Fair Value) Method
        res = {
            "nci_proportionate": round(nci_prop, 2),
            "goodwill_proportionate": round(goodwill_prop, 2),
        }
        
        if nci_fair_value is not None:
            goodwill_full = consideration + nci_fair_value - net_identifiable_assets
            nci_goodwill = goodwill_full - goodwill_prop
            res.update({
                "nci_fair_value": round(nci_fair_value, 2),
                "goodwill_full": round(goodwill_full, 2),
                "nci_share_of_goodwill": round(nci_goodwill, 2)
            })
            
        return res

engine = BusinessCombinationsEngine("Phoenix Industrial Group Ltd", "Zenith Sensor Technologies Ltd", 25.168)

consideration, expensed_fees = engine.compute_consideration(
    cash_paid=8000000.0,
    shares_issued=400000,
    share_price=12.50,
    contingent_consideration_pv=1500000.0,
    acquisition_fees=450000.0
)
assert consideration == 14500000.0
assert expensed_fees == 450000.0

ppa = engine.execute_purchase_price_allocation(
    target_book_net_assets=10000000.0,
    ppe_fair_value_step_up=1200000.0,
    intangible_assets_identified=2000000.0
)
assert ppa["gross_fair_value_step_up"] == 3200000.0
assert ppa["dtl_on_fair_value_adjustments"] == 805376.0
assert ppa["net_identifiable_assets"] == 12394624.0

goodwill_res = engine.compute_goodwill(
    consideration=consideration,
    net_identifiable_assets=ppa["net_identifiable_assets"],
    nci_percentage=20.0,
    nci_fair_value=3500000.0
)
assert goodwill_res["nci_proportionate"] == 2478924.80
assert goodwill_res["goodwill_proportionate"] == 4584300.80
assert goodwill_res["goodwill_full"] == 5605376.00
assert goodwill_res["nci_share_of_goodwill"] == 1021075.20

print(f"Acquisition: {engine.acquirer} -> {engine.target}")
print(f"Total Consideration Transferred: ${consideration:,.2f}")
print(f"Acquisition Fees Expensed (P&L): ${expensed_fees:,.2f}")
print(f"Net Identifiable Assets Acquired: ${ppa['net_identifiable_assets']:,.2f}")
print(f"Proportionate Goodwill: ${goodwill_res['goodwill_proportionate']:,.2f} | NCI: ${goodwill_res['nci_proportionate']:,.2f}")
print(f"Full Goodwill: ${goodwill_res['goodwill_full']:,.2f} | NCI Fair Value: ${goodwill_res['nci_fair_value']:,.2f}")
print("IND_AS_103_BUSINESS_COMBINATIONS_PASS")
