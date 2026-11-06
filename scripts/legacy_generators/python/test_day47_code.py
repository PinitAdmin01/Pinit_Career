# Day 47: DuPont Analysis & Return on Equity (ROE) Decomposition
# Comprehensive DuPont 3-stage and 5-stage decomposition engine with ROIC and EVA analytics.

from dataclasses import dataclass
from typing import Dict

@dataclass
class DuPontData:
    revenue: float
    cogs: float
    ebit: float
    interest_expense: float
    tax_expense: float
    net_income: float
    total_assets: float
    equity: float
    total_debt: float
    cash: float
    wacc_pct: float

class DuPontDecompositionEngine:
    def __init__(self, data: DuPontData):
        self.d = data
        self.ebt = self.d.ebit - self.d.interest_expense
        self.tax_rate = self.d.tax_expense / self.ebt if self.ebt != 0 else 0.0

    def compute_3stage_dupont(self) -> Dict[str, float]:
        npm = self.d.net_income / self.d.revenue
        ato = self.d.revenue / self.d.total_assets
        em = self.d.total_assets / self.d.equity
        roe_3stage = npm * ato * em
        return {
            "net_profit_margin_pct": round(npm * 100, 2),
            "asset_turnover": round(ato, 4),
            "equity_multiplier": round(em, 4),
            "roe_pct": round(roe_3stage * 100, 2)
        }

    def compute_5stage_dupont(self) -> Dict[str, float]:
        tax_burden = self.d.net_income / self.ebt
        interest_burden = self.ebt / self.d.ebit
        operating_margin = self.d.ebit / self.d.revenue
        asset_turnover = self.d.revenue / self.d.total_assets
        equity_multiplier = self.d.total_assets / self.d.equity
        roe_5stage = tax_burden * interest_burden * operating_margin * asset_turnover * equity_multiplier
        return {
            "tax_burden": round(tax_burden, 4),
            "interest_burden": round(interest_burden, 4),
            "operating_margin_pct": round(operating_margin * 100, 2),
            "asset_turnover": round(asset_turnover, 4),
            "equity_multiplier": round(equity_multiplier, 4),
            "roe_pct": round(roe_5stage * 100, 2)
        }

    def compute_roic_and_eva(self) -> Dict[str, float]:
        nopat = self.d.ebit * (1 - self.tax_rate)
        invested_capital = (self.d.total_debt + self.d.equity) - self.d.cash
        roic = nopat / invested_capital
        capital_charge = invested_capital * (self.d.wacc_pct / 100.0)
        eva = nopat - capital_charge
        return {
            "nopat": round(nopat, 2),
            "invested_capital": round(invested_capital, 2),
            "roic_pct": round(roic * 100, 2),
            "capital_charge": round(capital_charge, 2),
            "economic_value_added": round(eva, 2)
        }

# Enterprise Case Study: Apex Engineering Ltd
data = DuPontData(
    revenue=120000000.0,
    cogs=72000000.0,
    ebit=24000000.0,
    interest_expense=4000000.0,
    tax_expense=5033600.0,  # 25.168% on 20,000,000 EBT
    net_income=14966400.0,
    total_assets=124000000.0,
    equity=60000000.0,
    total_debt=40000000.0,
    cash=6000000.0,
    wacc_pct=11.5
)

engine = DuPontDecompositionEngine(data)
m3 = engine.compute_3stage_dupont()
m5 = engine.compute_5stage_dupont()
va = engine.compute_roic_and_eva()

assert m3["net_profit_margin_pct"] == 12.47
assert m3["asset_turnover"] == 0.9677
assert m3["equity_multiplier"] == 2.0667
assert m3["roe_pct"] == 24.94

assert m5["tax_burden"] == 0.7483
assert m5["interest_burden"] == 0.8333
assert m5["operating_margin_pct"] == 20.0
assert m5["asset_turnover"] == 0.9677
assert m5["equity_multiplier"] == 2.0667
assert m5["roe_pct"] == 24.94

assert va["nopat"] == 17959680.0
assert va["invested_capital"] == 94000000.0
assert va["roic_pct"] == 19.11
assert va["capital_charge"] == 10810000.0
assert va["economic_value_added"] == 7149680.0

print(f"3-Stage DuPont ROE: {m3['roe_pct']}% (Margin {m3['net_profit_margin_pct']}% * Turnover {m3['asset_turnover']} * Leverage {m3['equity_multiplier']})")
print(f"5-Stage DuPont ROE: {m5['roe_pct']}% (Tax {m5['tax_burden']} * Interest {m5['interest_burden']} * EBIT Margin {m5['operating_margin_pct']}% * ATO {m5['asset_turnover']} * EM {m5['equity_multiplier']})")
print(f"Value Creation: NOPAT ${va['nopat']:,.2f} | ROIC {va['roic_pct']}% vs WACC {data.wacc_pct}% | EVA ${va['economic_value_added']:,.2f}")
print("DUPONT_ROE_DECOMPOSITION_PASS")
