# Day 46: Financial Statement Diagnostics & Advanced Ratio Analysis
# Comprehensive ratio diagnostics engine computing Liquidity, Solvency, Turnover, and Cash Conversion Cycle.

from dataclasses import dataclass
from typing import Dict

@dataclass
class FinancialData:
    revenue: float
    cogs: float
    ebit: float
    interest_expense: float
    tax_expense: float
    net_income: float
    cash: float
    marketable_securities: float
    accounts_receivable: float
    inventory: float
    accounts_payable: float
    current_assets: float
    current_liabilities: float
    total_debt: float
    total_equity: float
    total_assets: float
    principal_repayments: float

class FinancialRatioDiagnostics:
    def __init__(self, data: FinancialData):
        self.d = data

    def compute_liquidity_ratios(self) -> Dict[str, float]:
        cr = self.d.current_assets / self.d.current_liabilities
        quick_assets = self.d.cash + self.d.marketable_securities + self.d.accounts_receivable
        qr = quick_assets / self.d.current_liabilities
        cash_ratio = (self.d.cash + self.d.marketable_securities) / self.d.current_liabilities
        # Defensive interval: quick assets / daily cash operating expenses
        daily_opex = (self.d.revenue - self.d.ebit) / 365.0
        dir_days = quick_assets / daily_opex
        return {
            "current_ratio": round(cr, 2),
            "quick_ratio": round(qr, 2),
            "cash_ratio": round(cash_ratio, 2),
            "defensive_interval_days": round(dir_days, 1)
        }

    def compute_solvency_ratios(self) -> Dict[str, float]:
        de_ratio = self.d.total_debt / self.d.total_equity
        debt_to_capital = self.d.total_debt / (self.d.total_debt + self.d.total_equity)
        interest_coverage = self.d.ebit / self.d.interest_expense
        # DSCR = EBIT / (Interest + Principal / (1 - Tax Rate))
        tax_rate = self.d.tax_expense / (self.d.ebit - self.d.interest_expense)
        dscr = self.d.ebit / (self.d.interest_expense + (self.d.principal_repayments / (1 - tax_rate)))
        return {
            "debt_to_equity": round(de_ratio, 2),
            "debt_to_capital": round(debt_to_capital, 2),
            "interest_coverage_ratio": round(interest_coverage, 2),
            "debt_service_coverage_ratio": round(dscr, 2)
        }

    def compute_working_capital_cycle(self) -> Dict[str, float]:
        dso = (self.d.accounts_receivable / self.d.revenue) * 365.0
        dio = (self.d.inventory / self.d.cogs) * 365.0
        dpo = (self.d.accounts_payable / self.d.cogs) * 365.0
        ccc = dio + dso - dpo
        return {
            "days_sales_outstanding": round(dso, 1),
            "days_inventory_outstanding": round(dio, 1),
            "days_payable_outstanding": round(dpo, 1),
            "cash_conversion_cycle_days": round(ccc, 1)
        }

# Enterprise Case Study: Apex Engineering Ltd
data = FinancialData(
    revenue=120000000.0,
    cogs=72000000.0,
    ebit=24000000.0,
    interest_expense=4000000.0,
    tax_expense=5033600.0,  # 25.168% on 20,000,000 EBT
    net_income=14966400.0,
    cash=6000000.0,
    marketable_securities=4000000.0,
    accounts_receivable=16000000.0,
    inventory=18000000.0,
    accounts_payable=12000000.0,
    current_assets=44000000.0,
    current_liabilities=22000000.0,
    total_debt=40000000.0,
    total_equity=60000000.0,
    total_assets=124000000.0,
    principal_repayments=3000000.0
)

analyzer = FinancialRatioDiagnostics(data)
liq = analyzer.compute_liquidity_ratios()
solv = analyzer.compute_solvency_ratios()
wc = analyzer.compute_working_capital_cycle()

assert liq["current_ratio"] == 2.0
assert liq["quick_ratio"] == 1.18
assert liq["cash_ratio"] == 0.45
assert liq["defensive_interval_days"] == 98.9

assert solv["debt_to_equity"] == 0.67
assert solv["debt_to_capital"] == 0.40
assert solv["interest_coverage_ratio"] == 6.0
assert solv["debt_service_coverage_ratio"] == 3.0

assert wc["days_sales_outstanding"] == 48.7
assert wc["days_inventory_outstanding"] == 91.2
assert wc["days_payable_outstanding"] == 60.8
assert wc["cash_conversion_cycle_days"] == 79.1

print(f"Current Ratio: {liq['current_ratio']} | Quick Ratio: {liq['quick_ratio']} | Cash Ratio: {liq['cash_ratio']}")
print(f"Debt-to-Equity: {solv['debt_to_equity']} | Interest Coverage: {solv['interest_coverage_ratio']}x | DSCR: {solv['debt_service_coverage_ratio']}x")
print(f"Working Capital Cycle: DIO {wc['days_inventory_outstanding']}d + DSO {wc['days_sales_outstanding']}d - DPO {wc['days_payable_outstanding']}d = CCC {wc['cash_conversion_cycle_days']}d")
print("FINANCIAL_RATIO_DIAGNOSTICS_PASS")
