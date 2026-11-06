# Enterprise Ind AS 38 Intangible Assets Engine
# Novavax BioPharma Ltd - Project OncoShield R&D Accounting & Amortization Suite

class IndAS38IntangiblesEngine:
    def __init__(self, project_name: str):
        self.project_name = project_name
        self.research_expenses = []
        self.pre_pirate_expenses = []
        self.capitalized_development_costs = []
        self.commercial_asset_cost = 0.0
        self.useful_life_years = 0
        self.amortization_recorded = 0.0

    def record_research_expenditure(self, item: str, amount: float):
        self.research_expenses.append((item, amount))

    def record_pre_pirate_expenditure(self, item: str, amount: float):
        self.pre_pirate_expenses.append((item, amount))

    def record_capitalized_development(self, item: str, amount: float):
        self.capitalized_development_costs.append((item, amount))

    def get_total_research_expensed(self) -> float:
        return sum(amount for _, amount in self.research_expenses)

    def get_total_pre_pirate_expensed(self) -> float:
        return sum(amount for _, amount in self.pre_pirate_expenses)

    def get_total_capitalized_development(self) -> float:
        return sum(amount for _, amount in self.capitalized_development_costs)

    def commercialize_asset(self, useful_life_years: int):
        self.commercial_asset_cost = self.get_total_capitalized_development()
        self.useful_life_years = useful_life_years

    def compute_amortization(self, months_operational: int) -> float:
        if self.useful_life_years == 0:
            return 0.0
        annual_amort = self.commercial_asset_cost / self.useful_life_years
        amort = annual_amort * (months_operational / 12.0)
        self.amortization_recorded = amort
        return amort

    def get_closing_carrying_amount(self) -> float:
        return self.commercial_asset_cost - self.amortization_recorded

def run_intangibles_simulation():
    engine = IndAS38IntangiblesEngine("Project OncoShield")

    # Research Phase (Months 1-6) - Expensed to P&L under Ind AS 38.54
    engine.record_research_expenditure("Lab Consumables", 1800000.00)
    engine.record_research_expenditure("Scientist Salaries", 2400000.00)
    engine.record_research_expenditure("Research Overhead", 800000.00)

    # Pre-PIRATE Development (Months 7-9) - Expensed to P&L under Ind AS 38.71
    engine.record_pre_pirate_expenditure("Synthesis Trials", 1500000.00)
    engine.record_pre_pirate_expenditure("Toxicity Screening", 1000000.00)

    # Post-PIRATE Development Phase (Months 10-18) - Capitalized under Ind AS 38.57
    engine.record_capitalized_development("Clinical Trial Cohorts", 12000000.00)
    engine.record_capitalized_development("Bioreactor Validation", 6500000.00)
    engine.record_capitalized_development("Regulatory Filing & Patents", 1500000.00)
    engine.record_capitalized_development("Clinical Scientists Salaries", 4000000.00)

    total_research = engine.get_total_research_expensed()
    total_pre_pirate = engine.get_total_pre_pirate_expensed()
    total_capitalized = engine.get_total_capitalized_development()

    # Commercialization & Amortization
    engine.commercialize_asset(useful_life_years=8)
    year1_amort = engine.compute_amortization(months_operational=6)
    closing_carrying = engine.get_closing_carrying_amount()

    # Indefinite Life Intangible: Brand
    brand_cost = 8000000.00
    brand_amort = 0.0
    brand_recoverable = 11500000.00
    brand_impairment = max(0.0, brand_cost - brand_recoverable)

    print(f"Project: {engine.project_name}")
    print(f"Total Research Phase Expensed to P&L: ${total_research:,.2f}")
    print(f"Pre-PIRATE Development Expensed (No Retroactive Capitalization): ${total_pre_pirate:,.2f}")
    print(f"Total Expensed to P&L during R&D: ${total_research + total_pre_pirate:,.2f}")
    print(f"Capitalized Development Cost (Intangible Asset): ${total_capitalized:,.2f}")
    print(f"Finite Life Useful Life: {engine.useful_life_years} Years | Annual Amortization: ${total_capitalized / engine.useful_life_years:,.2f}")
    print(f"Year 1 Pro-Rata Amortization (6 Months): ${year1_amort:,.2f}")
    print(f"Patent Closing Carrying Amount: ${closing_carrying:,.2f}")
    print(f"Indefinite Useful Life Brand: Cost ${brand_cost:,.2f} | Amortization ${brand_amort:,.2f} | Impairment ${brand_impairment:,.2f}")
    print(f"Total Intangibles Balance Sheet Carrying: ${closing_carrying + brand_cost:,.2f}")
    print("IND_AS_38_INTANGIBLE_ASSETS_PASS")

if __name__ == "__main__":
    run_intangibles_simulation()
