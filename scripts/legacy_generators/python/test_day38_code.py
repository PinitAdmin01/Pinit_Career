# Day 38 Code Prototype: Ind AS 33 Earnings Per Share Engine
# Computes Basic EPS and Diluted EPS using the Treasury Stock Method and If-Converted Method.

from dataclasses import dataclass
from typing import List, Dict

class IndAS33EarningsPerShareEngine:
    def __init__(self, enterprise_name: str, tax_rate_pct: float):
        self.enterprise_name = enterprise_name
        self.tax_rate = tax_rate_pct / 100.0

    def compute_basic_eps(self, net_profit: float, wanos: int) -> Dict[str, float]:
        """Module 1: Basic EPS calculation."""
        basic_eps = net_profit / wanos
        return {
            "net_profit": net_profit,
            "wanos": float(wanos),
            "basic_eps": round(basic_eps, 2)
        }

    def compute_treasury_stock_options(self, options_count: int, strike_price: float, avg_market_price: float) -> Dict[str, float]:
        """Module 2: Treasury Stock Method for options/warrants."""
        if avg_market_price <= strike_price:
            return {"incremental_shares": 0.0, "is_dilutive": False}
        
        proceeds = options_count * strike_price
        shares_repurchased = proceeds / avg_market_price
        incremental_shares = options_count - shares_repurchased
        return {
            "options_count": float(options_count),
            "proceeds": round(proceeds, 2),
            "shares_repurchased": round(shares_repurchased, 2),
            "incremental_shares": round(incremental_shares, 2),
            "is_dilutive": True
        }

    def compute_if_converted_debentures(self, principal: float, coupon_rate_pct: float, conversion_shares: int) -> Dict[str, float]:
        """Module 3: If-Converted Method for convertible bonds/debentures."""
        gross_interest = principal * (coupon_rate_pct / 100.0)
        tax_shield = gross_interest * self.tax_rate
        after_tax_interest = gross_interest - tax_shield
        incremental_eps = after_tax_interest / conversion_shares
        
        return {
            "gross_interest_saved": round(gross_interest, 2),
            "after_tax_interest_saved": round(after_tax_interest, 2),
            "conversion_shares": float(conversion_shares),
            "incremental_eps": round(incremental_eps, 4)
        }

    def compute_diluted_eps(
        self,
        net_profit: float,
        wanos: int,
        options_data: Dict[str, float],
        debenture_data: Dict[str, float]
    ) -> Dict[str, float]:
        """Module 4: Integrated Diluted EPS synthesis and anti-dilution filtering."""
        basic_eps = net_profit / wanos
        adj_profit = net_profit
        adj_shares = float(wanos)

        # Options check
        if options_data.get("is_dilutive"):
            adj_shares += options_data["incremental_shares"]

        # Debentures check (dilutive if incremental EPS < basic EPS)
        if debenture_data["incremental_eps"] < basic_eps:
            adj_profit += debenture_data["after_tax_interest_saved"]
            adj_shares += debenture_data["conversion_shares"]

        diluted_eps = adj_profit / adj_shares
        eps_dilution_pct = ((basic_eps - diluted_eps) / basic_eps) * 100.0

        return {
            "basic_eps": round(basic_eps, 2),
            "adjusted_profit": round(adj_profit, 2),
            "adjusted_shares": round(adj_shares, 2),
            "diluted_eps": round(diluted_eps, 2),
            "dilution_percentage": round(eps_dilution_pct, 2)
        }

engine = IndAS33EarningsPerShareEngine("Titan Global Aerospace Corp", 25.168)

# Basic EPS: $5M profit, 1M shares
basic_res = engine.compute_basic_eps(5000000.0, 1000000)
assert basic_res["basic_eps"] == 5.00

# Options: 100k options, $30 strike, $50 avg market price
# Proceeds = $3M -> repurchased = 60,000 -> incremental = 40,000 shares
opt_res = engine.compute_treasury_stock_options(100000, 30.0, 50.0)
assert opt_res["incremental_shares"] == 40000.0
assert opt_res["is_dilutive"] is True

# Debentures: $5M principal, 6% coupon, convertible into 200,000 shares
# Gross int = 300,000 -> after-tax = 300,000 * (1 - 0.25168) = 224,496.0
# Incremental EPS = 224,496 / 200,000 = 1.1225 (< 5.00 -> dilutive)
deb_res = engine.compute_if_converted_debentures(5000000.0, 6.0, 200000)
assert deb_res["after_tax_interest_saved"] == 224496.0
assert deb_res["incremental_eps"] == 1.1225

# Integrated Diluted EPS:
# Numerator = 5,000,000 + 224,496 = 5,224,496.0
# Denominator = 1,000,000 + 40,000 + 200,000 = 1,240,000
# Diluted EPS = 5,224,496 / 1,240,000 = 4.213303 -> 4.21
dil_res = engine.compute_diluted_eps(5000000.0, 1000000, opt_res, deb_res)
assert dil_res["diluted_eps"] == 4.21
assert dil_res["adjusted_shares"] == 1240000.0
assert dil_res["dilution_percentage"] == 15.73

print(f"Enterprise: {engine.enterprise_name}")
print(f"Basic EPS: ${dil_res['basic_eps']} (WANOS: {int(basic_res['wanos'])})")
print(f"Treasury Stock Incremental Shares: {int(opt_res['incremental_shares'])}")
print(f"If-Converted Interest Saved: ${deb_res['after_tax_interest_saved']} (Shares: {int(deb_res['conversion_shares'])})")
print(f"Diluted EPS: ${dil_res['diluted_eps']} (Total Diluted Shares: {int(dil_res['adjusted_shares'])})")
print(f"EPS Dilution Drag: {dil_res['dilution_percentage']}%")
print("IND_AS_33_EARNINGS_PER_SHARE_PASS")
