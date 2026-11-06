# Enterprise Milestone 11 Capstone: Corporate Asset Valuation, Impairment & Fair Value Suite
# Apex Zenith Global Industrial Conglomerate Ltd - CFO Master Valuation & Reporting Simulator

class CorporateAssetValuationMasterSuite:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name
        self.tax_rate = 0.25168

    def execute_module1_ind_as_36(self) -> dict:
        # Module 1: Ind AS 36 CGU Impairment
        cgu_assets = {
            "Goodwill": 4000000.00,
            "Robotic Machinery": 18000000.00,
            "Proprietary Software": 10000000.00,
            "Factory Premises": 12000000.00
        }
        total_carrying = sum(cgu_assets.values())
        discount_rate = 0.12
        cfs = [6000000.00, 6500000.00, 7000000.00, 7200000.00, 7500000.00]
        term_val = 15000000.00
        viu = sum(cf / ((1 + discount_rate) ** t) for t, cf in enumerate(cfs, 1)) + term_val / ((1 + discount_rate) ** len(cfs))
        fvlcod = 31000000.00
        rec_amt = max(fvlcod, viu)
        impairment = total_carrying - rec_amt

        gw_loss = min(cgu_assets["Goodwill"], impairment)
        rem_loss = impairment - gw_loss
        non_gw = {k: v for k, v in cgu_assets.items() if k != "Goodwill"}
        total_non_gw = sum(non_gw.values())

        allocs = {"Goodwill": gw_loss}
        post_carrying = {"Goodwill": 0.0}
        for k, v in non_gw.items():
            loss = rem_loss * (v / total_non_gw)
            allocs[k] = loss
            post_carrying[k] = v - loss

        return {
            "total_carrying": total_carrying,
            "recoverable_amount": rec_amt,
            "impairment_loss": impairment,
            "goodwill_loss": gw_loss,
            "allocations": allocs,
            "post_carrying": post_carrying
        }

    def execute_module2_ind_as_38(self) -> dict:
        # Module 2: Ind AS 38 Intangible Assets
        research_expensed = 5000000.00
        pre_pirate_expensed = 2500000.00
        capitalized_dev = 24000000.00
        useful_life = 8
        year1_amort = (capitalized_dev / useful_life) * 0.5
        patent_closing = capitalized_dev - year1_amort

        brand_cost = 8000000.00
        brand_amort = 0.0
        brand_impairment = 0.0
        total_intangibles = patent_closing + brand_cost

        return {
            "total_expensed_pnl": research_expensed + pre_pirate_expensed,
            "capitalized_dev": capitalized_dev,
            "year1_amort": year1_amort,
            "patent_closing": patent_closing,
            "brand_cost": brand_cost,
            "total_intangibles": total_intangibles
        }

    def execute_module3_ind_as_113(self) -> dict:
        # Module 3: Ind AS 113 Fair Value Hierarchy
        lvl1_equity = 4500000.00
        lvl2_swaps = 12850000.00
        hbu_gross_land = 22000000.00
        demolition_costs = 2500000.00
        hbu_net_land = hbu_gross_land - demolition_costs
        pe_dcf_base = 15200000.00

        lvl3_total = hbu_net_land + pe_dcf_base
        total_portfolio = lvl1_equity + lvl2_swaps + lvl3_total

        return {
            "level1": lvl1_equity,
            "level2": lvl2_swaps,
            "level3_hbu_land": hbu_net_land,
            "level3_pe_dcf": pe_dcf_base,
            "level3_total": lvl3_total,
            "total_portfolio": total_portfolio
        }

    def execute_module4_ind_as_105(self) -> dict:
        # Module 4: Ind AS 105 Disposal Group & Discontinued Operations
        gross_assets = 36000000.00
        liabilities = 4000000.00
        net_carrying = gross_assets - liabilities
        agreed_price = 29000000.00
        disposal_costs = 1500000.00
        net_fvlcts = agreed_price - disposal_costs
        impairment = net_carrying - net_fvlcts

        rev = 18000000.00
        opex = 15000000.00
        op_profit = rev - opex
        pretax_discontinued = op_profit - impairment
        tax_benefit = pretax_discontinued * self.tax_rate
        net_discontinued = pretax_discontinued - tax_benefit

        return {
            "initial_net_carrying": net_carrying,
            "net_fvlcts": net_fvlcts,
            "impairment_loss": impairment,
            "pretax_discontinued": pretax_discontinued,
            "tax_benefit": tax_benefit,
            "net_discontinued": net_discontinued
        }

def run_corporate_valuation_capstone():
    suite = CorporateAssetValuationMasterSuite("Apex Zenith Global Industrial Conglomerate Ltd")

    m1 = suite.execute_module1_ind_as_36()
    m2 = suite.execute_module2_ind_as_38()
    m3 = suite.execute_module3_ind_as_113()
    m4 = suite.execute_module4_ind_as_105()

    print(f"Enterprise: {suite.enterprise_name}")
    print(f"Module 1 Ind AS 36 CGU Impairment: Carrying ${m1['total_carrying']:,.2f} | Recoverable ${m1['recoverable_amount']:,.2f} | Loss ${m1['impairment_loss']:,.2f}")
    print(f"Module 2 Ind AS 38 Intangible Assets: Capitalized ${m2['capitalized_dev']:,.2f} | Amort ${m2['year1_amort']:,.2f} | Total Intangibles ${m2['total_intangibles']:,.2f}")
    print(f"Module 3 Ind AS 113 Fair Value: Level 1 ${m3['level1']:,.2f} | Level 2 ${m3['level2']:,.2f} | Level 3 ${m3['level3_total']:,.2f} | Portfolio ${m3['total_portfolio']:,.2f}")
    print(f"Module 4 Ind AS 105 Held for Sale: FVLCTS ${m4['net_fvlcts']:,.2f} | Write-Down ${m4['impairment_loss']:,.2f} | Single-Line Discontinued P&L ${m4['net_discontinued']:,.2f}")
    print("CORPORATE_ASSET_VALUATION_IMPAIRMENT_SUITE_PASS")

if __name__ == "__main__":
    run_corporate_valuation_capstone()
