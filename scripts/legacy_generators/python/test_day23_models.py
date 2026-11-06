"""
Test Script for Day 23 Models: Islamic Banking & Shariah Finance
Course: B.Com Banking & Financial Services (bcom_ban)
Task: TASK-793
"""

def model_riba_vs_murabaha_comparison(
    principal_usd: float,
    interest_rate_annual_pct: float,
    tenor_years: int,
    murabaha_cost_plus_markup_pct: float
) -> dict:
    conventional_repayment = principal_usd * ((1.0 + (interest_rate_annual_pct / 100.0)) ** tenor_years)
    conventional_interest = conventional_repayment - principal_usd
    
    murabaha_profit = principal_usd * (murabaha_cost_plus_markup_pct / 100.0)
    murabaha_total_price = principal_usd + murabaha_profit
    
    return {
        "principal_usd": principal_usd,
        "conventional_total_repayment_usd": round(conventional_repayment, 2),
        "conventional_interest_usd": round(conventional_interest, 2),
        "murabaha_cost_price_usd": principal_usd,
        "murabaha_profit_markup_usd": round(murabaha_profit, 2),
        "murabaha_sale_price_usd": round(murabaha_total_price, 2),
        "asset_backed": True,
        "riba_free": True
    }

def model_commodity_murabaha_tawarruq(
    commodity_cost_usd: float,
    profit_margin_pct: float,
    tenor_months: int
) -> dict:
    profit_amount = commodity_cost_usd * (profit_margin_pct / 100.0) * (tenor_months / 12.0)
    total_deferred_price = commodity_cost_usd + profit_amount
    monthly_installment = total_deferred_price / tenor_months
    
    return {
        "commodity_cost_usd": commodity_cost_usd,
        "profit_margin_pct": profit_margin_pct,
        "profit_amount_usd": round(profit_amount, 2),
        "total_deferred_sale_price_usd": round(total_deferred_price, 2),
        "monthly_installment_usd": round(monthly_installment, 2),
        "tawarruq_liquidity_usd": commodity_cost_usd
    }

def model_diminishing_musharakah(
    property_value_usd: float,
    bank_initial_share_pct: float,
    annual_rental_yield_pct: float,
    annual_equity_buyout_pct: float
) -> dict:
    bank_equity = property_value_usd * (bank_initial_share_pct / 100.0)
    customer_equity = property_value_usd * ((100.0 - bank_initial_share_pct) / 100.0)
    
    year1_rent = bank_equity * (annual_rental_yield_pct / 100.0)
    year1_buyout = property_value_usd * (annual_equity_buyout_pct / 100.0)
    year1_total_payment = year1_rent + year1_buyout
    
    bank_equity_end_year1 = bank_equity - year1_buyout
    customer_equity_end_year1 = customer_equity + year1_buyout
    
    return {
        "property_value_usd": property_value_usd,
        "initial_bank_equity_usd": round(bank_equity, 2),
        "year1_rental_payment_usd": round(year1_rent, 2),
        "year1_equity_buyout_usd": round(year1_buyout, 2),
        "year1_total_cash_outlay_usd": round(year1_total_payment, 2),
        "bank_equity_end_year1_usd": round(bank_equity_end_year1, 2),
        "customer_ownership_pct": round((customer_equity_end_year1 / property_value_usd) * 100.0, 1)
    }

def model_sukuk_al_ijara_issuance(
    issuance_size_usd: float,
    annual_rental_yield_pct: float,
    tenor_years: int,
    tangible_asset_value_usd: float
) -> dict:
    assert tangible_asset_value_usd >= issuance_size_usd, "Sukuk al-Ijara requires full tangible asset backing"
    
    annual_rental_distribution = issuance_size_usd * (annual_rental_yield_pct / 100.0)
    total_rental_cash_flows = annual_rental_distribution * tenor_years
    
    return {
        "sukuk_issuance_usd": issuance_size_usd,
        "underlying_tangible_asset_usd": tangible_asset_value_usd,
        "annual_rental_yield_pct": annual_rental_yield_pct,
        "annual_rental_coupon_usd": round(annual_rental_distribution, 2),
        "cumulative_rental_distributions_usd": round(total_rental_cash_flows, 2),
        "asset_backed_compliant": True
    }

def model_mudarabah_profit_sharing(
    capital_investment_usd: float,
    gross_venture_profit_usd: float,
    rabb_ul_mal_share_pct: float,
    mudarib_share_pct: float,
    capital_loss_scenario: bool = False,
    capital_loss_amount_usd: float = 0.0
) -> dict:
    assert abs((rabb_ul_mal_share_pct + mudarib_share_pct) - 100.0) < 1e-6, "Profit shares must sum to 100%"
    
    if capital_loss_scenario:
        # In Mudarabah, capital provider absorbs financial loss; manager loses time/labor
        rabb_ul_mal_profit = -capital_loss_amount_usd
        mudarib_profit = 0.0
    else:
        rabb_ul_mal_profit = gross_venture_profit_usd * (rabb_ul_mal_share_pct / 100.0)
        mudarib_profit = gross_venture_profit_usd * (mudarib_share_pct / 100.0)
        
    return {
        "capital_investment_usd": capital_investment_usd,
        "gross_venture_profit_usd": gross_venture_profit_usd,
        "rabb_ul_mal_profit_usd": round(rabb_ul_mal_profit, 2),
        "mudarib_profit_usd": round(mudarib_profit, 2),
        "rabb_ul_mal_roi_pct": round((rabb_ul_mal_profit / capital_investment_usd) * 100.0, 2),
        "shariah_governance_cleared": True
    }

# Run tests
res1 = model_riba_vs_murabaha_comparison(100_000.0, 8.0, 5, 30.0)
res2 = model_commodity_murabaha_tawarruq(5_000_000.0, 6.0, 12)
res3 = model_diminishing_musharakah(500_000.0, 80.0, 5.0, 5.0)
res4 = model_sukuk_al_ijara_issuance(300_000_000.0, 5.5, 7, 320_000_000.0)
res5 = model_mudarabah_profit_sharing(10_000_000.0, 2_500_000.0, 70.0, 30.0)

print("Day 23 models executed successfully.")
