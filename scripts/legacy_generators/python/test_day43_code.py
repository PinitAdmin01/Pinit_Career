# test_day43_code.py
from dataclasses import dataclass
from typing import Dict, Tuple

class JointArrangementsEquityMethodEngine:
    def __init__(self, investor_name: str):
        self.investor_name = investor_name

    def process_joint_operation(
        self,
        facility_name: str,
        total_assets: float,
        total_liabilities: float,
        total_revenue: float,
        total_expenses: float,
        participating_share_pct: float
    ) -> Dict[str, float]:
        """Module 1: Ind AS 111 Joint Operation Line-by-Line Recognition."""
        share = participating_share_pct / 100.0
        return {
            "facility_name": facility_name,
            "recognized_assets": round(total_assets * share, 2),
            "recognized_liabilities": round(total_liabilities * share, 2),
            "recognized_revenue": round(total_revenue * share, 2),
            "recognized_expenses": round(total_expenses * share, 2),
            "net_operational_contribution": round((total_revenue - total_expenses) * share, 2)
        }

    def process_equity_method_investment(
        self,
        investee_name: str,
        initial_cost: float,
        investee_net_profit: float,
        investee_oci: float,
        dividends_received: float,
        ownership_pct: float,
        downstream_unrealized_profit: float
    ) -> Dict[str, float]:
        """Module 2: Ind AS 28 / Ind AS 111 Equity Method for Joint Ventures and Associates."""
        share = ownership_pct / 100.0
        
        # Share of profit adjusted for investor's share of unrealized profit
        elim_unrealized = downstream_unrealized_profit * share
        share_of_profit = (investee_net_profit * share) - elim_unrealized
        share_of_oci = investee_oci * share
        
        # Carrying value: Initial Cost + Share of Profit + Share of OCI - Dividends Received
        ending_carrying_amount = (
            initial_cost + share_of_profit + share_of_oci - dividends_received
        )
        
        return {
            "investee_name": investee_name,
            "initial_investment_cost": round(initial_cost, 2),
            "eliminated_unrealized_profit": round(elim_unrealized, 2),
            "share_of_profit_pnl": round(share_of_profit, 2),
            "share_of_oci": round(share_of_oci, 2),
            "dividends_received_reduction": round(dividends_received, 2),
            "ending_carrying_amount": round(ending_carrying_amount, 2)
        }

engine = JointArrangementsEquityMethodEngine("Phoenix Industrial Group Ltd")

jo_res = engine.process_joint_operation(
    facility_name="Aero-Turbine Testing Facility",
    total_assets=8000000.0,
    total_liabilities=1500000.0,
    total_revenue=3000000.0,
    total_expenses=2400000.0,
    participating_share_pct=50.0
)
assert jo_res["recognized_assets"] == 4000000.0
assert jo_res["recognized_liabilities"] == 750000.0
assert jo_res["recognized_expenses"] == 1200000.0
assert jo_res["net_operational_contribution"] == 300000.0

eq_res = engine.process_equity_method_investment(
    investee_name="Quantum Navigation Systems Ltd",
    initial_cost=4500000.0,
    investee_net_profit=1800000.0,
    investee_oci=200000.0,
    dividends_received=300000.0,
    ownership_pct=30.0,
    downstream_unrealized_profit=100000.0
)
assert eq_res["eliminated_unrealized_profit"] == 30000.0
assert eq_res["share_of_profit_pnl"] == 510000.0
assert eq_res["share_of_oci"] == 60000.0
assert eq_res["ending_carrying_amount"] == 4770000.0

print(f"Investor: {engine.investor_name}")
print(f"Joint Operation ({jo_res['facility_name']}): Assets: ${jo_res['recognized_assets']:,.2f} | Expenses: ${jo_res['recognized_expenses']:,.2f}")
print(f"Equity Method ({eq_res['investee_name']}): Initial Cost: ${eq_res['initial_investment_cost']:,.2f}")
print(f"Equity Method: Share of P&L: ${eq_res['share_of_profit_pnl']:,.2f} | Share of OCI: ${eq_res['share_of_oci']:,.2f}")
print(f"Equity Method: Dividends: -${eq_res['dividends_received_reduction']:,.2f} | Ending Carrying Value: ${eq_res['ending_carrying_amount']:,.2f}")
print("IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS")
