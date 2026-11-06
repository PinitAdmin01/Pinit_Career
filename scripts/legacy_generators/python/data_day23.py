# scripts/data_day23.py
# Day 23: Price Elasticity of Demand & Revenue Optimization: Midpoint Formula, Revenue Curves & Dynamic Pricing Bounds
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: Price Elasticity of Demand (PED): Microeconomic Foundations & The Midpoint Formula
# -------------------------------------------------------------
p1_say = [
    "Pricing is the single most powerful lever in commercial business analytics. While cost reductions and operational efficiencies require grueling organizational friction and capital expenditures, an optimal pricing adjustment flows directly to operating income with zero cost of goods sold. Yet in boardrooms and pricing committees across the globe, pricing decisions are frequently governed by simplistic cost-plus rules of thumb or anecdotal competitor tracking. To transform pricing into an exact, quantitative science, decision intelligence relies on the microeconomic apparatus of Price Elasticity of Demand (PED).",

    "Formulated by Alfred Marshall in 1890, Price Elasticity of Demand measures the percentage responsiveness of customer demand quantity Q to a percentage change in the product's price P. The foundational definition of price elasticity is: PED = (% Delta Q) / (% Delta P) = (Delta Q / Q) / (Delta P / P). Because the Law of Demand dictates that price and quantity demanded move in opposite directions (a price increase causes quantity demanded to contract, ceteris paribus), the raw algebraic value of PED is almost universally negative. In analytical practice, practitioners either retain the explicit negative sign or discuss its absolute magnitude |PED|.",

    "However, calculating percentage changes using standard endpoint baselines introduces a severe mathematical flaw known as the Directional Asymmetry Problem. Consider a product priced at $100 where sales volume is 100 units. If the price increases to $120 (+20.0%) and demand drops to 80 units (-20.0%), the standard formula yields: PED = (-20.0%) / (+20.0%) = -1.0. Now consider the exact reverse experiment: the price drops from $120 to $100 (-16.67%) and sales rebound from 80 to 100 units (+25.0%). The standard formula now yields: PED = (+25.0%) / (-16.67%) = -1.50! The exact same pair of price-quantity coordinates produces two completely different elasticity estimates simply because the baseline denominator shifted.",

    "To eliminate directional asymmetry and ensure mathematical consistency regardless of whether price is increasing or decreasing, econometricians utilize the Midpoint (Arc) Elasticity Formula, developed by R.G.D. Allen. The midpoint formula uses the arithmetic average of the starting and ending values as the denominator for both price and quantity: PED_{mid} = [ (Q_2 - Q_1) / ((Q_1 + Q_2) / 2) ] / [ (P_2 - P_1) / ((P_1 + P_2) / 2) ]. Simplifying this rational expression yields: PED_{mid} = [ (Q_2 - Q_1) / (Q_1 + Q_2) ] * [ (P_1 + P_2) / (P_2 - P_1) ]. Applying the midpoint formula to our previous example yields: [ (80 - 100) / 180 ] / [ (120 - 100) / 220 ] = (-0.1111) / (+0.0909) = -1.222, completely symmetric in both directions.",

    "Based on the absolute magnitude |PED|, economists classify demand response into five distinct structural regimes: Elastic Demand (|PED| > 1.0): percentage change in quantity demanded exceeds the percentage change in price. Customers are highly price-sensitive; raising prices destroys total revenue. Inelastic Demand (|PED| < 1.0): percentage change in quantity demanded is smaller than the percentage change in price. Customers are price-insensitive (due to necessity, brand loyalty, or lack of substitutes); raising prices increases total revenue. Unit Elastic Demand (|PED| = 1.0): percentage changes in price and quantity are perfectly balanced; total revenue is maximized at this exact inflection point.",

    "The extreme boundary cases are Perfectly Inelastic Demand (|PED| = 0.0), where quantity demanded is completely fixed regardless of price (such as life-saving insulin or monopolized enterprise utility licenses), and Perfectly Elastic Demand (|PED| -> infinity), where any price increase above the market clearing price causes quantity demanded to collapse instantaneously to zero (such as undifferentiated agricultural commodities in perfect competition).",

    "In the accompanying Python implementation, we build a foundational Midpoint Arc Elasticity Engine from first principles using pure Python standard library routines. We simulate price testing experiments across multiple SKU categories, compute directional percentage changes versus midpoint arc elasticities, verify mathematical symmetry, and classify demand elasticity regimes."
]

p1_code = r"""# Pure Python Price Elasticity of Demand (PED) & Midpoint Arc Engine

class PriceElasticityCalculator:
    def __init__(self, p1, q1, p2, q2):
        self.p1 = float(p1)
        self.q1 = float(q1)
        self.p2 = float(p2)
        self.q2 = float(q2)
        
    def calculate_standard_ped(self):
        # Standard endpoint formula: (% Delta Q) / (% Delta P)
        pct_delta_p = (self.p2 - self.p1) / self.p1
        pct_delta_q = (self.q2 - self.q1) / self.q1
        ped = pct_delta_q / pct_delta_p if pct_delta_p != 0 else 0.0
        return {
            'pct_delta_price': round(pct_delta_p * 100.0, 2),
            'pct_delta_quantity': round(pct_delta_q * 100.0, 2),
            'standard_ped': round(ped, 4)
        }
        
    def calculate_midpoint_ped(self):
        # Allen Midpoint Arc Formula: ((Q2 - Q1) / Q_avg) / ((P2 - P1) / P_avg)
        q_diff = self.q2 - self.q1
        q_avg = (self.q1 + self.q2) / 2.0
        
        p_diff = self.p2 - self.p1
        p_avg = (self.p1 + self.p2) / 2.0
        
        pct_q_mid = q_diff / q_avg if q_avg > 0 else 0.0
        pct_p_mid = p_diff / p_avg if p_avg > 0 else 0.0
        
        midpoint_ped = pct_q_mid / pct_p_mid if pct_p_mid != 0 else 0.0
        abs_ped = abs(midpoint_ped)
        
        # Classification
        if abs_ped > 1.05:
            regime = "Elastic (|PED| > 1)"
        elif abs_ped < 0.95:
            regime = "Inelastic (|PED| < 1)"
        else:
            regime = "Unit Elastic (|PED| ~ 1)"
            
        return {
            'midpoint_pct_delta_p': round(pct_p_mid * 100.0, 2),
            'midpoint_pct_delta_q': round(pct_q_mid * 100.0, 2),
            'midpoint_ped': round(midpoint_ped, 4),
            'absolute_ped': round(abs_ped, 4),
            'regime': regime
        }

# Demonstrate Asymmetry Resolution: P: $100 -> $120 vs P: $120 -> $100
calc_forward = PriceElasticityCalculator(p1=100.0, q1=100.0, p2=120.0, q2=80.0)
calc_reverse = PriceElasticityCalculator(p1=120.0, q1=80.0, p2=100.0, q2=100.0)

f_std = calc_forward.calculate_standard_ped()
r_std = calc_reverse.calculate_standard_ped()
f_mid = calc_forward.calculate_midpoint_ped()
r_mid = calc_reverse.calculate_midpoint_ped()

print("--- DIRECTIONAL ASYMMETRY BENCHMARK ---")
print(f"Forward (100 -> 120): Standard PED = {f_std['standard_ped']:6.2f} | Midpoint PED = {f_mid['midpoint_ped']:6.2f}")
print(f"Reverse (120 -> 100): Standard PED = {r_std['standard_ped']:6.2f} | Midpoint PED = {r_mid['midpoint_ped']:6.2f}")
print("Proof of Symmetry: Midpoint formula produces identical values regardless of direction!")

# Test distinct commercial product profiles
scenarios = [
    ("Specialty B2B SaaS License", 500, 240, 600, 225),  # Inelastic
    ("Consumer Electronics Accessory", 45, 1200, 55, 750), # Highly Elastic
    ("Retail Coffee Subscription", 20, 5000, 25, 4000)     # Unit Elastic
]

print("\n--- COMMERCIAL PRODUCT ELASTICITY PROFILES ---")
for name, p1, q1, p2, q2 in scenarios:
    c = PriceElasticityCalculator(p1, q1, p2, q2)
    m = c.calculate_midpoint_ped()
    print(f"{name:32s}: Midpoint PED = {m['midpoint_ped']:6.3f} -> {m['regime']}")
"""

p1_mcq = {
    "question": "Why is the Allen Midpoint Arc Formula universally preferred over the standard endpoint formula when computing Price Elasticity of Demand from historical price tests?",
    "options": [
        "Because it uses average price and average quantity as denominators, eliminating directional asymmetry and yielding identical elasticity values whether prices rise or fall.",
        "Because it automatically eliminates all marginal production costs from the gross margin equation.",
        "Because it converts non-linear demand curves into quadratic exponential smoothing models.",
        "Because it guarantees that price elasticity will always be greater than positive one."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The standard percentage change formula produces conflicting elasticity values depending on which point is used as the base. The Midpoint Arc formula averages endpoints, creating mathematical symmetry."
}

# -------------------------------------------------------------
# Part 2: Linear Demand Calibration & Total Revenue Curve Geometry
# -------------------------------------------------------------
p2_say = [
    "While the midpoint arc formula evaluates elasticity across discrete historical price steps, enterprise decision engines require continuous mathematical formulations to model demand across any hypothetical price point. In pricing analytics, the foundational continuous formulation is the Linear Demand Curve. Let P represent price and Q represent unit demand. The direct linear demand function expresses customer quantity demanded as a decreasing linear function of price: Q(P) = alpha - beta * P, where alpha > 0 represents maximum market saturation demand when price is zero, and beta > 0 represents the marginal price sensitivity slope (dQ / dP = -beta).",

    "Inverting this equation yields the Inverse Demand Curve, expressing the maximum price the market will bear for a given quantity: P(Q) = a - b * Q, where the vertical intercept a = alpha / beta represents the choke price (the price at which customer demand is completely choked off to zero, Q = 0), and b = 1 / beta represents the quantity slope. Understanding both direct and inverse representations allows analytics teams to transition seamlessly between sales-volume planning and revenue-maximization modeling.",

    "With the demand curve specified, we formulate Total Revenue (TR) as the product of price and quantity: TR(P) = P * Q(P) = P * (alpha - beta * P) = alpha * P - beta * P^2. Notice the parabolic geometry of the total revenue curve: because the coefficient on P^2 is negative (-beta < 0), Total Revenue is a strictly concave quadratic function that starts at zero when P = 0, rises to a unique global peak, and declines back to zero when price reaches the choke price a.",

    "To determine the unique price that maximizes Total Revenue, we apply differential calculus by taking the first derivative of TR with respect to P, defining Marginal Revenue (MR_P): d(TR) / dP = alpha - 2 * beta * P. By the first-order necessary condition for unconstrained optimization, we set Marginal Revenue to zero: alpha - 2 * beta * P = 0. Solving for P yields the Revenue-Maximizing Price: P_{rev}^* = alpha / (2 * beta) = a / 2. The revenue-maximizing price is exactly half the choke price!",

    "At this optimal price P_{rev}^*, optimal quantity demanded is: Q^* = alpha - beta * (alpha / (2 * beta)) = alpha / 2. We can now compute the Point Price Elasticity of Demand at this revenue-maximizing point using the continuous calculus definition: PED(P) = (dQ / dP) * (P / Q) = (-beta) * (P / (alpha - beta * P)). Substituting P = P_{rev}^* = alpha / (2 * beta) and Q = alpha / 2 into the point elasticity formula yields: PED(P_{rev}^*) = (-beta) * [ (alpha / 2 * beta) / (alpha / 2) ] = -1.0. This constitutes one of the most elegant proofs in economics: Total Revenue is strictly maximized where Price Elasticity of Demand is exactly Unit Elastic (|PED| = 1.0).",

    "Furthermore, this calculus illuminates the two operational regimes along any linear demand curve: For all prices below P_{rev}^* (where P < a / 2), the demand curve is Inelastic (|PED| < 1.0). In this inelastic regime, Marginal Revenue is positive (d(TR)/dP > 0): raising prices increases total revenue. For all prices above P_{rev}^* (where P > a / 2), the demand curve is Elastic (|PED| > 1.0). In this elastic regime, Marginal Revenue is negative (d(TR)/dP < 0): raising prices destroys total revenue. A business that charges a price in the inelastic zone is leaving free revenue on the table.",

    "In the accompanying Python implementation, we build a Continuous Demand Calibration & Total Revenue Optimizer from first principles. We fit linear demand functions from empirical price experiments, compute analytical derivatives, plot the parabolic total revenue curve, and prove that peak revenue occurs exactly at unit elasticity."
]

p2_code = r"""# Pure Python Linear Demand Calibration & Revenue Optimization Engine

class LinearDemandModel:
    def __init__(self, alpha, beta):
        self.alpha = float(alpha) # Market saturation demand
        self.beta = float(beta)   # Price sensitivity slope
        self.choke_price = self.alpha / self.beta
        
    def quantity(self, price):
        return max(0.0, self.alpha - self.beta * price)
        
    def total_revenue(self, price):
        return price * self.quantity(price)
        
    def point_elasticity(self, price):
        q = self.quantity(price)
        if q <= 0.0:
            return -999.0 # Beyond choke price
        # PED = (dQ/dP) * (P/Q) = -beta * (P / Q)
        return -self.beta * (price / q)
        
    def find_optimal_revenue_point(self):
        # Analytical optimum: P* = alpha / (2 * beta)
        p_opt = self.alpha / (2.0 * self.beta)
        q_opt = self.quantity(p_opt)
        tr_opt = self.total_revenue(p_opt)
        ped_opt = self.point_elasticity(p_opt)
        return {
            'optimal_price': round(p_opt, 2),
            'optimal_quantity': round(q_opt, 1),
            'maximum_total_revenue': round(tr_opt, 2),
            'elasticity_at_peak': round(ped_opt, 4),
            'choke_price': round(self.choke_price, 2)
        }

# Calibrate model: Market demand Q(P) = 10,000 - 80 * P
# Choke price = 10,000 / 80 = $125.00
model = LinearDemandModel(alpha=10000, beta=80)
opt = model.find_optimal_revenue_point()

print("--- LINEAR DEMAND & REVENUE MAXIMIZATION CALCULUS ---")
print(f"Demand Function: Q(P) = {model.alpha:.0f} - {model.beta:.0f} * P | Choke Price: ${opt['choke_price']:.2f}")
print(f"Optimal Price (P*):        ${opt['optimal_price']:.2f}")
print(f"Optimal Sales Volume (Q*): {opt['optimal_quantity']:.0f} units")
print(f"Maximum Total Revenue:     ${opt['maximum_total_revenue']:,.2f}")
print(f"Elasticity at Maximum:     PED = {opt['elasticity_at_peak']:.4f} (Proof of Unit Elasticity!)")

print("\n--- PRICE SENSITIVITY SWEEP ALONG DEMAND CURVE ---")
test_prices = [25.0, 45.0, 62.50, 80.0, 100.0]
for p in test_prices:
    q = model.quantity(p)
    tr = model.total_revenue(p)
    ped = model.point_elasticity(p)
    status = "Inelastic (Raise Price!)" if abs(ped) < 0.98 else ("Elastic (Lower Price!)" if abs(ped) > 1.02 else "Peak Optimum (Unit Elastic)")
    print(f"Price: ${p:5.2f} | Quantity: {q:5.0f} | Revenue: ${tr:9,.2f} | PED: {ped:6.2f} | Status: {status}")
"""

p2_mcq = {
    "question": "Along a downward-sloping linear demand curve Q(P) = alpha - beta * P, at what exact price point is Total Revenue strictly maximized?",
    "options": [
        "At P = alpha / (2 * beta), which represents exactly half the choke price and where Price Elasticity of Demand is exactly Unit Elastic (|PED| = 1.0).",
        "At the choke price where customer demand drops to zero.",
        "At a price of zero where total sales volume is maximized.",
        "At the price point where the marginal cost of production equals total fixed overhead."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Total Revenue TR(P) = alpha*P - beta*P^2. Setting the derivative alpha - 2*beta*P = 0 yields P* = alpha / (2*beta). At this price, point elasticity is exactly -1.0."
}

# -------------------------------------------------------------
# Part 3: Profit Maximization vs Revenue Maximization: Marginal Cost Integration
# -------------------------------------------------------------
p3_say = [
    "While maximizing total revenue is a fascinating mathematical exercise, commercial enterprises do not pay dividends or service debt with top-line revenue; they survive on bottom-line operating profit and free cash flow. In the real world, producing, packaging, shipping, and servicing goods incurs variable costs. A business strategy focused exclusively on revenue maximization will systematically over-produce, sell at prices that are dangerously low, and destroy shareholder value.",

    "To elevate pricing analytics into true financial decision intelligence, we must integrate Marginal Cost (MC) into our optimization framework. Let Total Cost TC(Q) decompose into Fixed Overhead Costs (FC) and constant Marginal Cost per unit (MC): TC(Q) = FC + MC * Q. Substituting the direct demand function Q(P) = alpha - beta * P yields Total Cost as a function of price: TC(P) = FC + MC * (alpha - beta * P). Total Operating Profit Pi(P) is defined as Total Revenue minus Total Cost: Pi(P) = TR(P) - TC(P) = [ P * (alpha - beta * P) ] - [ FC + MC * (alpha - beta * P) ].",

    "Factoring out the quantity term yields the classical Unit Margin Formulation of Profit: Pi(P) = (P - MC) * (alpha - beta * P) - FC. Expanding this algebraic expression: Pi(P) = alpha * P - beta * P^2 - MC * alpha + beta * MC * P - FC = -beta * P^2 + (alpha + beta * MC) * P - (MC * alpha + FC). Notice that profit remains a concave quadratic parabola with respect to price. To find the unique Profit-Maximizing Price P_{pi}^*, we take the first derivative of profit with respect to price and set it to zero: d(Pi) / dP = -2 * beta * P + alpha + beta * MC = 0.",

    "Solving for P yields the Profit-Maximizing Pricing Equation: P_{pi}^* = (alpha + beta * MC) / (2 * beta) = (alpha / (2 * beta)) + (MC / 2) = P_{rev}^* + (MC / 2). This elegant formula reveals a profound operational truth: The profit-maximizing price is ALWAYS strictly higher than the revenue-maximizing price, exceeding it by exactly half the marginal cost of production (MC / 2)! If a product has a marginal cost of $40 per unit, the profit-maximizing price is exactly $20 higher than the revenue-maximizing price.",

    "Furthermore, we can connect profit-maximizing pricing directly to microeconomic market power through the Lerner Index of Monopoly Power, formulated by Abba Lerner in 1934. The Lerner Index L measures a firm's pricing discretion as the normalized gross margin markup over marginal cost: L = (P - MC) / P. In neoclassical microeconomics, setting Marginal Revenue equal to Marginal Cost (MR = MC) yields the foundational Inverse Elasticity Rule: (P - MC) / P = -1 / PED, or equivalently: P = MC / (1 + 1 / PED) = MC * [ |PED| / (|PED| - 1) ].",

    "The Lerner Index proves that the optimal gross margin percentage is inversely proportional to price elasticity. If an enterprise possesses high pricing power (inelastic demand where |PED| = 1.25), the optimal markup is 1 / 1.25 = 80%, allowing massive profit margins. Conversely, in highly commoditized markets where customers are hyper-sensitive (|PED| = 5.0), the optimal markup is 1 / 5.0 = 20%. Understanding this dynamic prevents pricing committees from setting arbitrary margins across products with divergent competitive moats.",

    "In the accompanying Python implementation, we build an Integrated Profit Maximization & Lerner Index Engine from first principles. We simulate cost structures, solve for both revenue-maximizing and profit-maximizing prices, plot profit versus revenue curves, and compute the exact financial penalty of confusing revenue maximization with profit maximization."
]

p3_code = r"""# Pure Python Profit Maximization & Lerner Index Markup Engine

class ProfitPricingOptimizer:
    def __init__(self, alpha, beta, unit_marginal_cost, fixed_costs=0.0):
        self.alpha = float(alpha)
        self.beta = float(beta)
        self.mc = float(unit_marginal_cost)
        self.fc = float(fixed_costs)
        
    def quantity(self, price):
        return max(0.0, self.alpha - self.beta * price)
        
    def total_revenue(self, price):
        return price * self.quantity(price)
        
    def total_cost(self, price):
        return self.fc + self.mc * self.quantity(price)
        
    def profit(self, price):
        return self.total_revenue(price) - self.total_cost(price)
        
    def point_elasticity(self, price):
        q = self.quantity(price)
        return -self.beta * (price / q) if q > 0 else -999.0
        
    def optimize(self):
        # 1. Revenue Maximizing Price: P_rev* = alpha / (2 * beta)
        p_rev_opt = self.alpha / (2.0 * self.beta)
        q_rev = self.quantity(p_rev_opt)
        tr_rev = self.total_revenue(p_rev_opt)
        profit_at_rev_opt = self.profit(p_rev_opt)
        
        # 2. Profit Maximizing Price: P_profit* = (alpha + beta * MC) / (2 * beta) = P_rev* + MC/2
        p_profit_opt = (self.alpha + self.beta * self.mc) / (2.0 * self.beta)
        q_profit = self.quantity(p_profit_opt)
        tr_profit = self.total_revenue(p_profit_opt)
        max_profit = self.profit(p_profit_opt)
        
        # Lerner Index at profit optimum: L = (P - MC) / P
        lerner_index = (p_profit_opt - self.mc) / p_profit_opt if p_profit_opt > 0 else 0.0
        ped_at_profit_opt = self.point_elasticity(p_profit_opt)
        
        # Profit destroyed by optimizing for revenue instead of profit
        profit_deficit = max_profit - profit_at_rev_opt
        
        return {
            'revenue_max_price': round(p_rev_opt, 2),
            'profit_at_revenue_opt': round(profit_at_rev_opt, 2),
            'profit_max_price': round(p_profit_opt, 2),
            'max_profit': round(max_profit, 2),
            'profit_sacrificed_by_rev_opt': round(profit_deficit, 2),
            'lerner_index': round(lerner_index, 4),
            'ped_at_profit_max': round(ped_at_profit_opt, 4)
        }

# Model commercial scenario: Q(P) = 12,000 - 100 * P, Marginal Cost MC = $30.00, Fixed Cost = $50,000
opt_engine = ProfitPricingOptimizer(alpha=12000, beta=100, unit_marginal_cost=30.0, fixed_costs=50000.0)
metrics = opt_engine.optimize()

print("--- PROFIT MAXIMIZATION VS REVENUE MAXIMIZATION ---")
print(f"Revenue Maximizing Price: ${metrics['revenue_max_price']:.2f} -> Generates Profit of: ${metrics['profit_at_revenue_opt']:,.2f}")
print(f"Profit Maximizing Price:  ${metrics['profit_max_price']:.2f} -> Generates Profit of: ${metrics['max_profit']:,.2f}")
print(f"Capital Destroyed by Revenue Bias: ${metrics['profit_sacrificed_by_rev_opt']:,.2f}")
print(f"Lerner Index of Market Power:     {metrics['lerner_index']:.4f}")
print(f"PED at Profit-Maximizing Price:   PED = {metrics['ped_at_profit_max']:.4f}")
print("Key Takeaway: Profit maximization operates strictly in the elastic zone (|PED| > 1) when MC > 0!")
"""

p3_mcq = {
    "question": "Why is the profit-maximizing price P_{pi}^* strictly higher than the revenue-maximizing price P_{rev}^* whenever marginal production costs are greater than zero?",
    "options": [
        "Because profit optimization balances incremental revenue against incremental production costs, adding exactly half of marginal cost (MC / 2) to the revenue-maximizing price.",
        "Because fixed warehouse overhead expenses automatically double when unit production volume contracts.",
        "Because tax authorities mandate higher statutory gross profit margins on manufactured physical inventory.",
        "Because price elasticity of demand shifts from negative to positive when marginal costs are recognized."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In linear demand systems, P_{pi}^* = P_{rev}^* + (MC / 2). When MC > 0, producing additional units costs money, so the firm optimally charges a higher price and produces fewer units to maximize profit."
}

# -------------------------------------------------------------
# Part 4: Cross-Price Elasticity (XED), Income Elasticity (YED) & Multi-Product Cannibalization
# -------------------------------------------------------------
p4_say = [
    "In multi-product commercial enterprises, no pricing decision occurs in an isolated vacuum. When an enterprise adjusts the price of one subscription tier, product variation, or software SKU, that adjustment ripples throughout the entire portfolio, triggering demand migration, substitution, and product line cannibalization. To quantify these inter-product dependencies, economists rely on Cross-Price Elasticity of Demand (XED) and Income Elasticity of Demand (YED).",

    "Cross-Price Elasticity of Demand measures the percentage responsiveness of quantity demanded for Product A in response to a percentage change in the price of Product B: XED_{A, B} = (% Delta Q_A) / (% Delta P_B) = (dQ_A / dP_B) * (P_B / Q_A). Unlike own-price elasticity (which is strictly negative), the sign of Cross-Price Elasticity establishes the exact economic relationship between the two goods:",

    "Substitute Goods (XED_{A, B} > 0): When the price of Product B increases, customers substitute away from B and purchase more of Product A (such as competing software platforms, or an economy tier versus a premium tier). Complementary Goods (XED_{A, B} < 0): When the price of Product B increases, demand for Product A contracts (such as gaming consoles and video games, or razor handles and razor cartridges). Independent Goods (XED_{A, B} = 0): Price changes in one category have zero statistically detectable impact on the other.",

    "In product management, the central danger of Cross-Price Elasticity is Product Cannibalization. When an enterprise introduces a lower-priced 'Essentials' product tier or discounts an entry-level SKU, some fraction of sales generated by the cheaper item does not represent incremental new market acquisition; instead, it is siphoned directly from existing customers who downgrade from higher-margin premium offerings. The Cannibalization Rate C is defined as: C = (Lost Sales of Existing Product A) / (Total Sales of New Product B).",

    "To prevent destructive revenue leakage, analytics leaders calculate the Break-Even Cannibalization Threshold. Let Margin_A represent the dollar contribution margin of the existing premium product, and let Margin_B represent the contribution margin of the new budget product (where Margin_A > Margin_B). When a customer downgrades from A to B, the enterprise suffers a net margin loss of (Margin_A - Margin_B). For the product launch to be net accretive to enterprise operating profit, the ratio of truly incremental new customers to cannibalized customers must satisfy: Incremental_New / Cannibalized >= (Margin_A - Margin_B) / Margin_B.",

    "Complementing XED is Income Elasticity of Demand (YED), which measures demand responsiveness to changes in customer real income or macroeconomic GDP growth: YED = (% Delta Q) / (% Delta Income). Normal Goods exhibit YED > 0 (demand expands during economic growth). Luxury Goods exhibit YED > 1.0 (demand expands more than proportionally, such as high-end enterprise consulting). Inferior Goods exhibit YED < 0 (demand contracts during economic expansion, as buyers upgrade to premium alternatives). Modeling YED enables quantitative stress-testing during macroeconomic recessions.",

    "The microeconomic foundation linking cross-price elasticity to consumer utility maximization is formalized by the famous Slutsky Equation in consumer choice theory. Formulated by Eugen Slutsky, the equation decomposes the total observable change in demand into two fundamental economic forces: the Substitution Effect and the Income Effect: dQ_i / dP_j = (dH_i / dP_j)|_{utility=const} - Q_j * (dQ_i / dW), where H_i represents Hicksian compensated demand and W represents total customer wealth or enterprise budget.",

    "The first term, (dH_i / dP_j)|_{utility=const}, represents the pure Substitution Effect: when the price of Product B increases, the consumer substitutes toward Product A while holding real purchasing power constant. The second term, -Q_j * (dQ_i / dW), represents the Income Effect: the price increase in Product B reduces the customer's effective budget, which dampens overall purchasing across all normal goods. In enterprise B2B software and subscription pricing, because software typically represents a modest fraction of a corporate client's total operating budget, the income effect is negligible, meaning cross-price elasticity is dominated almost entirely by pure substitution.",

    "In the accompanying Python implementation, we build a Multi-Product Cross-Price Elasticity & Cannibalization Simulation Engine. We model a two-tier product line, calibrate cross-price substitution parameters, simulate customer migration under price changes, and compute net portfolio financial impacts."
]

p4_code = r"""# Pure Python Cross-Price Elasticity (XED) & Cannibalization Simulation Engine

class MultiProductPricingPortfolio:
    def __init__(self, base_price_a, base_demand_a, margin_a,
                       base_price_b, base_demand_b, margin_b,
                       own_ped_b=-1.6, cross_xed_a_b=0.45):
        self.p_a = float(base_price_a)
        self.q_a = float(base_demand_a)
        self.m_a = float(margin_a) # Contribution margin $/unit
        
        self.p_b = float(base_price_b)
        self.q_b = float(base_demand_b)
        self.m_b = float(margin_b)
        
        self.ped_b = float(own_ped_b)       # Own price elasticity of B
        self.xed_ab = float(cross_xed_a_b)  # Cross elasticity: % delta Q_A / % delta P_B
        
    def simulate_price_change_on_product_b(self, new_price_b):
        # Calculate percentage price change in B
        pct_delta_pb = (new_price_b - self.p_b) / self.p_b
        
        # 1. New quantity demanded for B: % delta Q_B = PED_B * % delta P_B
        pct_delta_qb = self.ped_b * pct_delta_pb
        new_q_b = self.q_b * (1.0 + pct_delta_qb)
        delta_q_b = new_q_b - self.q_b
        
        # 2. Cannibalization impact on A: % delta Q_A = XED_AB * % delta P_B
        # If P_B drops (pct_delta_pb < 0), Q_A contracts (pct_delta_qa < 0)
        pct_delta_qa = self.xed_ab * pct_delta_pb
        new_q_a = self.q_a * (1.0 + pct_delta_qa)
        delta_q_a = new_q_a - self.q_a # Negative when B is discounted
        
        # 3. Financial Portfolio Accounting
        base_total_margin = (self.q_a * self.m_a) + (self.q_b * self.m_b)
        
        # New unit margins (assuming price change directly impacts margin)
        price_diff_b = new_price_b - self.p_b
        new_margin_b = self.m_b + price_diff_b
        
        new_total_margin = (new_q_a * self.m_a) + (new_q_b * new_margin_b)
        net_profit_delta = new_total_margin - base_total_margin
        
        # Cannibalization rate: Units lost in A per unit gained in B
        cannibalization_rate = (-delta_q_a / delta_q_b) if delta_q_b > 0 else 0.0
        
        return {
            'new_price_b': round(new_price_b, 2),
            'pct_price_change_b': round(pct_delta_pb * 100.0, 1),
            'new_demand_product_b': round(new_q_b, 1),
            'units_gained_in_b': round(delta_q_b, 1),
            'new_demand_product_a': round(new_q_a, 1),
            'units_cannibalized_from_a': round(-delta_q_a, 1),
            'cannibalization_rate': round(cannibalization_rate * 100.0, 2),
            'base_portfolio_margin': round(base_total_margin, 2),
            'new_portfolio_margin': round(new_total_margin, 2),
            'net_profit_delta': round(net_profit_delta, 2)
        }

# Portfolio: Product A (Enterprise Tier, $1,200, Margin $900), Product B (Pro Tier, $600, Margin $400)
# Test price discounting on Product B to stimulate volume
portfolio = MultiProductPricingPortfolio(
    base_price_a=1200.0, base_demand_a=500.0, margin_a=900.0,
    base_price_b=600.0,  base_demand_b=800.0, margin_b=400.0,
    own_ped_b=-1.8, cross_xed_a_b=0.55
)

print("--- MULTI-PRODUCT CANNIBALIZATION SIMULATION ---")
discount_prices = [550.0, 500.0, 450.0]
for p_b in discount_prices:
    res = portfolio.simulate_price_change_on_product_b(p_b)
    print(f"\nDiscount Product B to ${res['new_price_b']:.2f} ({res['pct_price_change_b']}%):")
    print(f"  Sales B: {portfolio.q_b:.0f} -> {res['new_demand_product_b']:.0f} (+{res['units_gained_in_b']:.0f} units)")
    print(f"  Sales A: {portfolio.q_a:.0f} -> {res['new_demand_product_a']:.0f} (-{res['units_cannibalized_from_a']:.0f} cannibalized units)")
    print(f"  Cannibalization Rate: {res['cannibalization_rate']}% of new B units were stolen from A!")
    print(f"  Portfolio Net Margin Delta: ${res['net_profit_delta']:+10,.2f}")
"""

p4_mcq = {
    "question": "What does a positive Cross-Price Elasticity of Demand (XED_{A, B} > 0) signify in multi-product portfolio analytics?",
    "options": [
        "Products A and B are economic substitutes, meaning a price drop in Product B will siphon sales away from Product A through cannibalization.",
        "Products A and B are economic complements, meaning a price increase in B will increase demand for A.",
        "Both products have negative gross profit contribution margins.",
        "Customer income elasticity is strictly greater than positive two."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Positive XED means quantity of A and price of B move in the same direction. When B's price drops, demand for A drops as buyers substitute into B, causing cannibalization."
}

# -------------------------------------------------------------
# Part 5: Building a Dynamic Pricing & Revenue Optimization Engine in Python
# -------------------------------------------------------------
p5_say = [
    "To conclude Day 23, we synthesize all econometric foundations—elasticity estimation, revenue concavity, marginal cost calibration, and multi-product cannibalization bounds—into an enterprise-grade Dynamic Pricing Optimization Engine. In contemporary e-commerce and digital marketplace platforms (such as Uber, Airbnb, or Amazon), pricing is not an annual static ritual; prices adjust dynamically based on real-time inventory levels, competitor price scrapers, and demand elasticity calibrations.",

    "Our end-to-end engine executes five computational modules: Module One (Data Ingestion & Econometric Estimation): The engine ingests historical A/B pricing test records, filters out exogenous demand shocks, and applies Ordinary Least Squares (OLS) regression to estimate the empirical price sensitivity slope beta and market saturation intercept alpha.",

    "Module Two (Elasticity Profiling): For any current operating price point, the engine computes point elasticity, confirms whether the product resides in the elastic or inelastic zone, and determines the directional recommendation (increase price, hold, or decrease price).",

    "Module Three (Analytical Optimization): The engine computes the unconstrained revenue-maximizing price P_{rev}^* and the profit-maximizing price P_{pi}^*. Module Four (Boundary Enforcement & Guardrails): In commercial operations, unconstrained optimization models can produce mathematically optimal prices that violate brand positioning or regulatory constraints. The engine enforces realistic business guardrails: a Cost Floor (ensuring price never drops below minimum gross margin requirements, such as P >= MC * 1.20) and a Price Ceiling (ensuring prices do not trigger customer brand backlash).",

    "Module Five (Financial Impact Forecasting): The engine simulates the projected financial outcome of moving from the current price to the optimized recommendation, forecasting percentage changes in sales volume, total revenue, operating profit, and customer surplus.",

    "To prevent static model decay, advanced dynamic pricing platforms deploy Multi-Armed Bandit (MAB) Reinforcement Learning algorithms, such as Thompson Sampling or Upper Confidence Bound (UCB1). Rather than executing disruptive, large-scale price changes that risk customer outrage, the bandit engine allocates a small exploratory traffic slice (e.g., 5% of web visitors) across adjacent price candidates, while serving the currently estimated optimal price to the remaining 95% of traffic. As conversion telemetry streams into the analytics store, Bayesian posterior distributions over price sensitivity parameters are continuously updated, enabling the system to adapt smoothly to seasonal shifts, competitor promotional salvos, and macroeconomic cycles.",

    "Furthermore, enterprise dynamic pricing systems must account for Long-Horizon Customer Churn and LTV Feedback Loops. In subscription models and recurring revenue contracts, an aggressive price hike might maximize short-term monthly revenue, but trigger an invisible surge in trailing customer churn six months later when contracts come up for renewal. Sophisticated decision intelligence architectures integrate price elasticity models directly into survival analysis and Customer Lifetime Value (CLV) engines, discounting short-term margin gains against long-term customer equity destruction.",

    "Finally, by maintaining strict audit logging and explainability guardrails, the pricing engine ensures compliance with antitrust and fair pricing regulations (such as avoiding unlawful price discrimination under the Robinson-Patman Act). Executive stakeholders receive clear, transparent sensitivity curves that visualize trade-offs between unit sales volume and gross margin dollars, transforming pricing discussions into high-conviction strategic decisions.",

    "The ultimate goal of algorithmic pricing intelligence is not merely the extraction of short-term economic rents, but the dynamic alignment of commercial price with perceived customer utility. When an enterprise prices efficiently along its empirical demand curve, deadweight loss is minimized, production capacity is utilized near optimal utilization rates, and the enterprise builds durable economic moats that insulate it against competitive commoditization.",

    "By architecting this complete decision intelligence workflow from first principles, analytics professionals equip enterprise pricing committees with transparent, defensible, and profit-maximizing recommendations. The organization replaces subjective executive hunches with mathematically verified microeconomic optimization.",

    "In the accompanying Python implementation, we build this complete Dynamic Pricing & Revenue Optimization Engine from first principles without external dependencies. We simulate empirical pricing experiments, estimate demand parameters, optimize price points under operational margin constraints, and output the executive pricing decision scorecard."
]

p5_code = r"""# Pure Python Dynamic Pricing & Revenue Optimization Engine

class DynamicPricingEngine:
    def __init__(self, historical_price_experiments, unit_marginal_cost, min_margin_pct=0.20):
        self.experiments = historical_price_experiments # list of (price, quantity_sold)
        self.mc = float(unit_marginal_cost)
        self.min_margin = float(min_margin_pct)
        self.cost_floor = self.mc / (1.0 - self.min_margin) if self.min_margin < 1.0 else self.mc
        self._fit_ols_demand()
        
    def _fit_ols_demand(self):
        # Fit linear regression: Q = alpha - beta * P via OLS
        n = len(self.experiments)
        prices = [p for p, q in self.experiments]
        quantities = [q for p, q in self.experiments]
        
        mean_p = sum(prices) / float(n)
        mean_q = sum(quantities) / float(n)
        
        num = sum((p - mean_p) * (q - mean_q) for p, q in self.experiments)
        den = sum((p - mean_p) ** 2 for p in prices)
        
        # Slope: dQ/dP (typically negative)
        slope = num / den if den != 0 else 0.0
        self.beta = -slope # Store positive sensitivity
        self.alpha = mean_q - slope * mean_p
        
    def recommend_optimal_price(self, current_price):
        # 1. Unconstrained Profit Maximizing Price
        p_profit_raw = (self.alpha + self.beta * self.mc) / (2.0 * self.beta)
        
        # 2. Apply Operational Guardrails (Cost Floor)
        p_profit_bounded = max(self.cost_floor, p_profit_raw)
        
        # Current metrics
        q_curr = max(0.0, self.alpha - self.beta * current_price)
        rev_curr = current_price * q_curr
        profit_curr = (current_price - self.mc) * q_curr
        ped_curr = -self.beta * (current_price / q_curr) if q_curr > 0 else -999.0
        
        # Recommended metrics
        q_rec = max(0.0, self.alpha - self.beta * p_profit_bounded)
        rev_rec = p_profit_bounded * q_rec
        profit_rec = (p_profit_bounded - self.mc) * q_rec
        ped_rec = -self.beta * (p_profit_bounded / q_rec) if q_rec > 0 else -999.0
        
        profit_lift = profit_rec - profit_curr
        pct_profit_lift = (profit_lift / profit_curr) * 100.0 if profit_curr > 0 else 0.0
        
        return {
            'calibrated_demand_equation': f"Q = {self.alpha:.1f} - {self.beta:.2f} * P",
            'cost_floor': round(self.cost_floor, 2),
            'current_price': round(current_price, 2),
            'current_demand': round(q_curr, 1),
            'current_profit': round(profit_curr, 2),
            'current_ped': round(ped_curr, 3),
            'recommended_price': round(p_profit_bounded, 2),
            'recommended_demand': round(q_rec, 1),
            'recommended_profit': round(profit_rec, 2),
            'recommended_ped': round(ped_rec, 3),
            'projected_profit_lift': round(profit_lift, 2),
            'pct_profit_lift': round(pct_profit_lift, 2)
        }

# Simulated historical A/B price experiment data points: (Price, Weekly Quantity)
historical_data = [
    (80.0, 4200), (85.0, 3950), (90.0, 3700), (95.0, 3420),
    (100.0, 3210), (105.0, 2900), (110.0, 2680), (115.0, 2410)
]

# Marginal unit cost = $45.00, Minimum gross margin constraint = 25% (Floor = $60.00)
engine = DynamicPricingEngine(historical_data, unit_marginal_cost=45.0, min_margin_pct=0.25)

# Current suboptimal operating price: $85.00 (under-priced!)
rec = engine.recommend_optimal_price(current_price=85.0)

print("--- DYNAMIC PRICING OPTIMIZATION SCORECARD ---")
for k, v in rec.items():
    print(f"  {k:28s}: {v}")
"""

p5_mcq = {
    "question": "Why do enterprise dynamic pricing engines enforce an operational cost floor (e.g., P >= MC / (1 - Margin%)) alongside unconstrained econometric optimization models?",
    "options": [
        "To ensure that algorithmic recommendations never price products below minimum required gross margins, preventing cash-burning pricing blunders.",
        "To eliminate all income elasticity variance from customer demand estimation.",
        "To guarantee that own-price elasticity of demand remains strictly equal to positive zero.",
        "To bypass statutory sales tax reporting requirements."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Unconstrained mathematical models might recommend prices below variable cost if demand slopes are distorted. Operational cost floors guarantee positive unit economics and prevent capital destruction."
}

# -------------------------------------------------------------
# DAY_DATA Aggregation & Validation
# -------------------------------------------------------------
DAY_DATA = {
    "day": 23,
    "courseId": "bcom_ana",
    "title": "Price Elasticity of Demand & Revenue Optimization: Midpoint Formula, Revenue Curves & Dynamic Pricing Bounds",
    "description": "Master quantitative pricing intelligence: Allen Midpoint Arc Elasticity, linear demand calibration, quadratic total revenue concavity, profit maximization versus revenue maximization, the Lerner Index, multi-product cannibalization, and dynamic pricing engines.",
    "parts": [
        {
            "title": "Price Elasticity of Demand (PED): Microeconomic Foundations & The Midpoint Formula",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "title": "Linear Demand Calibration & Total Revenue Curve Geometry",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "title": "Profit Maximization vs Revenue Maximization: Marginal Cost Integration",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "title": "Cross-Price Elasticity (XED), Income Elasticity (YED) & Multi-Product Cannibalization",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "title": "Building a Dynamic Pricing & Revenue Optimization Engine in Python",
            "say": p5_say,
            "code": p5_code,
            "mcq": p5_mcq
        }
    ]
}

if __name__ == "__main__":
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path.cwd()))
    from scripts.bcom_ana_utils import count_words, execute_code
    print(f"Validating Day {DAY_DATA['day']}: {DAY_DATA['title']}...")
    part_words = [count_words(p["say"]) for p in DAY_DATA["parts"]]
    print(f"Part word counts: {part_words} (Total: {sum(part_words)})")
    assert all(w >= 600 for w in part_words), f"Some parts under 600 words: {part_words}"
    for i, p in enumerate(DAY_DATA["parts"]):
        print(f"Testing Part {i+1} code...")
        out = execute_code(p["code"])
        print(f"  Part {i+1} code executed cleanly ({len(out)} chars output)")
    print(f"Day {DAY_DATA['day']} validation successful!")
