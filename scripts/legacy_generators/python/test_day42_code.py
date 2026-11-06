# test_day42_code.py
from dataclasses import dataclass
from typing import Dict, Tuple

class ConsolidatedFinancialStatementsEngine:
    def __init__(self, parent: str, subsidiary: str, ownership_pct: float):
        self.parent = parent
        self.subsidiary = subsidiary
        self.ownership_pct = ownership_pct / 100.0
        self.nci_pct = 1.0 - self.ownership_pct

    def eliminate_intragroup_trading(
        self,
        parent_rev: float,
        sub_rev: float,
        intragroup_sales: float,
        unsold_inventory_at_cost_to_buyer: float,
        gross_profit_margin_pct: float,
        is_downstream: bool = True
    ) -> Dict[str, float]:
        """Eliminates intra-group revenue and unrealized inventory profit."""
        gross_rev = parent_rev + sub_rev
        elim_rev = gross_rev - intragroup_sales
        unrealized_profit = unsold_inventory_at_cost_to_buyer * (gross_profit_margin_pct / 100.0)
        
        return {
            "combined_revenue_pre_elim": round(gross_rev, 2),
            "consolidated_revenue": round(elim_rev, 2),
            "unrealized_inventory_profit": round(unrealized_profit, 2),
            "is_downstream": is_downstream
        }

    def allocate_consolidated_profit(
        self,
        parent_profit: float,
        sub_profit: float,
        unrealized_profit: float,
        is_downstream: bool = True
    ) -> Dict[str, float]:
        """Calculates consolidated profit and attributes to Parent and NCI."""
        if is_downstream:
            # Downstream: Parent made profit, so 100% eliminated from parent profit
            adj_parent_profit = parent_profit - unrealized_profit
            adj_sub_profit = sub_profit
        else:
            # Upstream: Sub made profit, so eliminated from sub profit (shared with NCI)
            adj_parent_profit = parent_profit
            adj_sub_profit = sub_profit - unrealized_profit
            
        nci_profit_share = adj_sub_profit * self.nci_pct
        parent_profit_share = adj_parent_profit + (adj_sub_profit * self.ownership_pct)
        total_consolidated_profit = parent_profit_share + nci_profit_share
        
        return {
            "total_consolidated_profit": round(total_consolidated_profit, 2),
            "profit_attributable_to_owners": round(parent_profit_share, 2),
            "profit_attributable_to_nci": round(nci_profit_share, 2)
        }

    def eliminate_intragroup_financing(
        self,
        loan_balance: float,
        annual_interest: float
    ) -> Dict[str, float]:
        """Eliminates reciprocal loan balances and interest income/expense."""
        return {
            "eliminated_loan_principal": round(loan_balance, 2),
            "eliminated_interest_pnl": round(annual_interest, 2)
        }

engine = ConsolidatedFinancialStatementsEngine("Phoenix Industrial Group Ltd", "Zenith Sensor Technologies Ltd", 80.0)

trade_res = engine.eliminate_intragroup_trading(
    parent_rev=50000000.0,
    sub_rev=20000000.0,
    intragroup_sales=4000000.0,
    unsold_inventory_at_cost_to_buyer=1000000.0,
    gross_profit_margin_pct=25.0,
    is_downstream=True
)
assert trade_res["consolidated_revenue"] == 66000000.0
assert trade_res["unrealized_inventory_profit"] == 250000.0

profit_res = engine.allocate_consolidated_profit(
    parent_profit=8500000.0,
    sub_profit=3000000.0,
    unrealized_profit=trade_res["unrealized_inventory_profit"],
    is_downstream=True
)
assert profit_res["total_consolidated_profit"] == 11250000.0
assert profit_res["profit_attributable_to_nci"] == 600000.0
assert profit_res["profit_attributable_to_owners"] == 10650000.0

fin_res = engine.eliminate_intragroup_financing(
    loan_balance=2000000.0,
    annual_interest=160000.0
)
assert fin_res["eliminated_loan_principal"] == 2000000.0
assert fin_res["eliminated_interest_pnl"] == 160000.0

print(f"Group: {engine.parent} + {engine.subsidiary} (Ownership: 80.0%)")
print(f"Consolidated Revenue: ${trade_res['consolidated_revenue']:,.2f}")
print(f"Unrealized Inventory Profit Eliminated: ${trade_res['unrealized_inventory_profit']:,.2f}")
print(f"Total Consolidated Net Profit: ${profit_res['total_consolidated_profit']:,.2f}")
print(f"Attributable to Owners of Parent: ${profit_res['profit_attributable_to_owners']:,.2f} | NCI Share: ${profit_res['profit_attributable_to_nci']:,.2f}")
print(f"Intragroup Loan Eliminated: ${fin_res['eliminated_loan_principal']:,.2f} | Interest: ${fin_res['eliminated_interest_pnl']:,.2f}")
print("IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS")
