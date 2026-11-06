# test_day45_code.py
from dataclasses import dataclass
from typing import Dict, Tuple

class GroupConsolidationMASuite:
    def __init__(self, parent_name: str, tax_rate_pct: float):
        self.parent_name = parent_name
        self.tax_rate = tax_rate_pct / 100.0

    def process_ind_as_103_acquisition(
        self,
        target_name: str,
        cash_paid: float,
        shares_issued: int,
        share_price: float,
        contingent_pv: float,
        target_book_net_assets: float,
        ppe_step_up: float,
        patents_identified: float,
        nci_pct: float
    ) -> Dict[str, float]:
        """Module 1: Ind AS 103 Business Combination & Goodwill."""
        equity_fv = shares_issued * share_price
        total_consideration = cash_paid + equity_fv + contingent_pv
        
        gross_step_up = ppe_step_up + patents_identified
        dtl_step_up = gross_step_up * self.tax_rate
        net_identifiable_assets = target_book_net_assets + gross_step_up - dtl_step_up
        
        nci_prop = net_identifiable_assets * (nci_pct / 100.0)
        goodwill = total_consideration + nci_prop - net_identifiable_assets
        
        return {
            "total_consideration": round(total_consideration, 2),
            "net_identifiable_assets": round(net_identifiable_assets, 2),
            "dtl_on_step_up": round(dtl_step_up, 2),
            "nci_acquisition_date": round(nci_prop, 2),
            "goodwill_proportionate": round(goodwill, 2)
        }

    def process_ind_as_110_consolidation(
        self,
        parent_rev: float,
        sub_rev: float,
        intragroup_sales: float,
        unsold_inventory: float,
        margin_pct: float,
        parent_profit: float,
        sub_profit: float,
        nci_pct: float
    ) -> Dict[str, float]:
        """Module 2: Ind AS 110 Consolidated Statement of Profit and Loss."""
        cons_rev = parent_rev + sub_rev - intragroup_sales
        unrealized_profit = unsold_inventory * (margin_pct / 100.0)
        
        # Downstream elimination from parent
        adj_parent_profit = parent_profit - unrealized_profit
        total_cons_profit = adj_parent_profit + sub_profit
        
        nci_share_profit = sub_profit * (nci_pct / 100.0)
        parent_share_profit = total_cons_profit - nci_share_profit
        
        return {
            "consolidated_revenue": round(cons_rev, 2),
            "unrealized_inventory_profit": round(unrealized_profit, 2),
            "total_consolidated_profit": round(total_cons_profit, 2),
            "profit_attributable_to_owners": round(parent_share_profit, 2),
            "profit_attributable_to_nci": round(nci_share_profit, 2)
        }

    def process_ind_as_111_and_28_partnerships(
        self,
        jo_assets: float,
        jo_expenses: float,
        jo_share_pct: float,
        assoc_initial_cost: float,
        assoc_profit: float,
        assoc_oci: float,
        assoc_dividend: float,
        assoc_share_pct: float,
        downstream_unrealized_profit: float
    ) -> Dict[str, float]:
        """Module 3: Ind AS 111 Joint Operation and Ind AS 28 Equity Method."""
        jo_share = jo_share_pct / 100.0
        rec_jo_assets = jo_assets * jo_share
        rec_jo_expenses = jo_expenses * jo_share
        
        assoc_share = assoc_share_pct / 100.0
        elim_unrealized = downstream_unrealized_profit * assoc_share
        share_profit = (assoc_profit * assoc_share) - elim_unrealized
        share_oci = assoc_oci * assoc_share
        
        ending_assoc_carrying = (
            assoc_initial_cost + share_profit + share_oci - assoc_dividend
        )
        
        return {
            "jo_recognized_assets": round(rec_jo_assets, 2),
            "jo_recognized_expenses": round(rec_jo_expenses, 2),
            "assoc_share_profit_pnl": round(share_profit, 2),
            "assoc_share_oci": round(share_oci, 2),
            "assoc_ending_carrying_amount": round(ending_assoc_carrying, 2)
        }

    def process_ind_as_112_structured_entity(
        self,
        trust_assets: float,
        subordinated_debt: float,
        guarantee_limit: float
    ) -> Dict[str, float]:
        """Module 4: Ind AS 112 Structured Entity Max Exposure to Loss."""
        max_exposure = subordinated_debt + guarantee_limit
        return {
            "trust_size": round(trust_assets, 2),
            "maximum_exposure_to_loss": round(max_exposure, 2)
        }

suite = GroupConsolidationMASuite("Phoenix Industrial Group Ltd", 25.168)

# Module 1
m1 = suite.process_ind_as_103_acquisition(
    target_name="Zenith Sensor Technologies Ltd",
    cash_paid=8000000.0,
    shares_issued=400000,
    share_price=12.50,
    contingent_pv=1500000.0,
    target_book_net_assets=10000000.0,
    ppe_step_up=1200000.0,
    patents_identified=2000000.0,
    nci_pct=20.0
)
assert m1["total_consideration"] == 14500000.0
assert m1["net_identifiable_assets"] == 12394624.0
assert m1["dtl_on_step_up"] == 805376.0
assert m1["nci_acquisition_date"] == 2478924.80
assert m1["goodwill_proportionate"] == 4584300.80

# Module 2
m2 = suite.process_ind_as_110_consolidation(
    parent_rev=50000000.0,
    sub_rev=20000000.0,
    intragroup_sales=4000000.0,
    unsold_inventory=1000000.0,
    margin_pct=25.0,
    parent_profit=8500000.0,
    sub_profit=3000000.0,
    nci_pct=20.0
)
assert m2["consolidated_revenue"] == 66000000.0
assert m2["unrealized_inventory_profit"] == 250000.0
assert m2["total_consolidated_profit"] == 11250000.0
assert m2["profit_attributable_to_owners"] == 10650000.0
assert m2["profit_attributable_to_nci"] == 600000.0

# Module 3
m3 = suite.process_ind_as_111_and_28_partnerships(
    jo_assets=8000000.0,
    jo_expenses=2400000.0,
    jo_share_pct=50.0,
    assoc_initial_cost=4500000.0,
    assoc_profit=1800000.0,
    assoc_oci=200000.0,
    assoc_dividend=300000.0,
    assoc_share_pct=30.0,
    downstream_unrealized_profit=100000.0
)
assert m3["jo_recognized_assets"] == 4000000.0
assert m3["jo_recognized_expenses"] == 1200000.0
assert m3["assoc_share_profit_pnl"] == 510000.0
assert m3["assoc_share_oci"] == 60000.0
assert m3["assoc_ending_carrying_amount"] == 4770000.0

# Module 4
m4 = suite.process_ind_as_112_structured_entity(
    trust_assets=50000000.0,
    subordinated_debt=2000000.0,
    guarantee_limit=3000000.0
)
assert m4["trust_size"] == 50000000.0
assert m4["maximum_exposure_to_loss"] == 5000000.0

print(f"Parent: {suite.parent_name}")
print(f"Ind AS 103 Consideration: ${m1['total_consideration']:,.2f} | Goodwill: ${m1['goodwill_proportionate']:,.2f}")
print(f"Ind AS 110 Cons. Revenue: ${m2['consolidated_revenue']:,.2f} | Net Profit: ${m2['total_consolidated_profit']:,.2f}")
print(f"Ind AS 111 JO Assets: ${m3['jo_recognized_assets']:,.2f} | Ind AS 28 Assoc Value: ${m3['assoc_ending_carrying_amount']:,.2f}")
print(f"Ind AS 112 Max Exposure to Loss: ${m4['maximum_exposure_to_loss']:,.2f}")
print("GROUP_CONSOLIDATION_MA_SUITE_PASS")
