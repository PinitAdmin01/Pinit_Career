# scripts/data_day21.py
# Day 21: Inventory Analytics & Demand Volatility: Safety Stock, Reorder Points & Lead-Time Variance
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: The Mechanics of Safety Stock: Demand Stochasticity, Service Levels & Normal Deviates (Z-Scores)
# -------------------------------------------------------------
p1_say = [
    "Welcome to Block Five of Business Analytics and Decision Intelligence. Over the next five days, we transition our quantitative apparatus from macro time series forecasting into the operational core of commercial enterprise: Supply Chain Inventory Analytics, SKU Portfolio Optimization, Microeconomic Price Elasticity, Multi-Touch Marketing Attribution, and Customer Lifetime Value Unit Economics. Every commercial enterprise is fundamentally an engine that converts working capital into inventory, services, and customer relationships. The efficiency with which an organization manages this capital transformation dictates its return on invested capital, cash conversion speed, and long-term solvency.",

    "We begin on Day 21 with the quantitative foundation of supply chain engineering: Safety Stock, Reorder Point Dynamics, and Lead-Time Volatility Modeling. In any real-world supply chain, inventory planners face a fundamental dilemma: customer demand is inherently uncertain, and supplier replenishment lead times are rarely instantaneous or deterministic. If a firm maintains insufficient inventory, it suffers stockouts, which cause lost immediate revenue, customer churn, contractual service-level penalties, and reputational destruction. Conversely, if a firm hoards excessive inventory to ensure zero stockouts, it ties up scarce working capital, incurs crippling warehouse holding and handling costs, and risks inventory obsolescence, spoilage, and markdown write-downs.",

    "To resolve this fundamental tension between stockout penalties and holding costs, inventory theory establishes Safety Stock (SS) as an operational buffer against stochastic volatility. Safety stock is the quantity of buffer inventory held on hand at all times to protect against stockout risk during the replenishment lead-time cycle. When customer demand is stochastic but supplier replenishment lead time L is known and deterministic, safety stock is mathematically formulated as: SS = Z * sigma_d * sqrt(L). In this classical formula, sigma_d represents the standard deviation of daily customer demand, L represents the supplier replenishment lead time measured in days, and Z represents the standard normal deviate (Z-score) corresponding to the target Cycle Service Level (CSL).",

    "The Cycle Service Level (CSL), designated as alpha or Type 1 Service Level, is defined as the statistical probability that customer demand does not exceed available inventory during a replenishment cycle; equivalently, it is the probability of not experiencing a stockout during lead time. Because demand during lead time is modeled as a normal distribution under the Central Limit Theorem, the target CSL directly maps to the cumulative distribution function (CDF) of the standard normal distribution: CSL = Phi(Z) = P(X <= Z). Therefore, to determine the required safety stock buffer for a desired service level, the analyst must invert the Gaussian CDF to obtain Z = Phi^{-1}(CSL).",

    "In computational analytics engines operating without external numerical libraries, the Gaussian quantile function Phi^{-1}(p) can be computed using high-precision rational approximations, such as the Beasley-Springer-Moro algorithm or Acklam's rational Chebyshev minimax polynomial approximation. For common service level benchmarks, standard normal deviates are well-established: a 90% service level requires Z = 1.282; a 95% service level requires Z = 1.645; a 98% service level requires Z = 2.054; and a 99% service level requires Z = 2.326. Notice the dramatic non-linear escalation: increasing the service level from 90% to 95% requires a 28% increase in safety stock, while moving from 95% to 99% requires an additional 41% surge in buffer inventory.",

    "This non-linear explosion in safety stock as service levels approach 100% is known in supply chain operations as the Asymptotic Cost Curve of Perfection. Because the tails of the Gaussian distribution extend to infinity, achieving a 100% Cycle Service Level mathematically requires infinite safety stock and infinite working capital. Consequently, commercial organizations must establish differentiated, economically optimized service level targets that balance the marginal annual holding cost of an additional unit of safety stock against the marginal expected stockout cost. Annual inventory holding cost H is typically quantified as a percentage h (ranging from 15% to 30% per year for capital cost, insurance, taxes, shrinkage, and warehouse storage) multiplied by the unit purchase cost C: H = h * C.",

    "In the accompanying Python implementation, we build a foundational Safety Stock and Z-Score Analytical Engine from first principles using pure Python standard library routines. We implement an analytical approximation of the Gaussian quantile function, model empirical demand distributions, evaluate safety stock requirements across multiple target Cycle Service Levels, and quantify the non-linear working capital investment required to achieve ultra-high reliability."
]

p1_code = r"""# Pure Python Safety Stock & Gaussian Quantile Engine
import math

def normal_cdf(x):
    # Cumulative distribution function for standard normal distribution
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def normal_ppf(p):
    # Inverse normal CDF (quantile function) via rational approximation
    if p <= 0.0 or p >= 1.0:
        raise ValueError("Probability p must lie strictly in (0, 1).")
    # Coefficients in rational approximations
    a = [-3.969683028665376e+01,  2.209460984245205e+02,
         -2.759285104469687e+02,  1.383577518672690e+02,
         -3.066479806614716e+01,  2.506628277459239e+00]
    b = [-5.447609879822406e+01,  1.615858368580409e+02,
         -1.556989798598866e+02,  6.680133080352692e+01,
         -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01,
         -2.400758277161838e+00, -2.549732539343734e+00,
          4.374664141464968e+00,  2.938163982698783e+00]
    d = [ 7.784695709041462e-03,  3.224671290700398e-01,
          2.445134137142996e+00,  3.754408661907416e+00]
    p_low = 0.02425
    p_high = 1.0 - p_low
    
    if p < p_low:
        q = math.sqrt(-2.0 * math.log(p))
        num = sum(c[i] * (q ** (5 - i)) for i in range(6))
        den = 1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4))
        return num / den
    elif p <= p_high:
        q = p - 0.5
        r = q * q
        num = sum(a[i] * (r ** (5 - i)) for i in range(6)) * q
        den = 1.0 + sum(b[i] * (r ** (5 - i)) for i in range(5))
        return num / den
    else:
        q = math.sqrt(-2.0 * math.log(1.0 - p))
        num = -sum(c[i] * (q ** (5 - i)) for i in range(6))
        den = 1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4))
        return num / den

class SafetyStockCalculator:
    def __init__(self, mean_daily_demand, std_daily_demand, lead_time_days, unit_cost, holding_cost_pct=0.25):
        self.d_bar = mean_daily_demand
        self.sigma_d = std_daily_demand
        self.L = lead_time_days
        self.unit_cost = unit_cost
        self.H = unit_cost * holding_cost_pct
        
    def evaluate_service_level(self, csl):
        z = normal_ppf(csl)
        # Standard safety stock formula with deterministic lead time: SS = Z * sigma_d * sqrt(L)
        ss_units = z * self.sigma_d * math.sqrt(self.L)
        annual_holding_cost = ss_units * self.H
        working_capital = ss_units * self.unit_cost
        return {
            "csl": csl,
            "z_score": round(z, 4),
            "safety_stock_units": round(ss_units, 2),
            "working_capital_tied": round(working_capital, 2),
            "annual_holding_cost": round(annual_holding_cost, 2)
        }

# Model enterprise inventory parameters: High-volume SKU
calc = SafetyStockCalculator(mean_daily_demand=250, std_daily_demand=45, lead_time_days=9, unit_cost=85.00, holding_cost_pct=0.22)

service_levels = [0.85, 0.90, 0.95, 0.98, 0.99, 0.999]
print("--- SAFETY STOCK & WORKING CAPITAL EVALUATION ---")
for csl in service_levels:
    res = calc.evaluate_service_level(csl)
    print(f"CSL: {res['csl']*100:5.1f}% | Z: {res['z_score']:6.3f} | SS Units: {res['safety_stock_units']:7.1f} | Capital: ${res['working_capital_tied']:10.2f} | Hold Cost: ${res['annual_holding_cost']:8.2f}")
"""

p1_mcq = {
    "question": "Why does safety stock investment escalate asymptotically as the target Cycle Service Level approaches 100% under normally distributed demand?",
    "options": [
        "Because the Gaussian probability density tails extend to infinity, requiring exponentially larger Z-scores for marginal gains in tail coverage.",
        "Because supplier replenishment lead times systematically double whenever customer demand volumes increase.",
        "Because the annual inventory holding cost rate increases linearly with the total quantity of inventory ordered.",
        "Because warehouse handling charges are strictly non-linear functions of supplier transit distance."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Under a normal distribution, the cumulative distribution function approaches 1.0 asymptotically, meaning Z-scores and required safety stock surge exponentially to infinity as service levels approach 100%."
}

# -------------------------------------------------------------
# Part 2: Stochastic Lead-Time Variance: The Combined Variance Theorem & Risk Amplification
# -------------------------------------------------------------
p2_say = [
    "In foundational supply chain textbooks, inventory formulas frequently assume that supplier lead time is completely constant and deterministic. However, empirical operations auditing across global supply networks reveals that supplier lead-time variability is often a far more destructive driver of stockout risk than customer demand volatility. In maritime shipping, international freight forwarding, and cross-border customs clearance, port congestion, customs inspections, weather disruptions, and manufacturing line bottlenecks introduce substantial variance into procurement schedules.",

    "When both daily customer demand and supplier replenishment lead time are independent random variables, the demand during lead time (DDLT) becomes a compound random variable: the sum of a random number of random variables. To determine the correct safety stock buffer under dual stochasticity, we must invoke the Law of Total Variance (often referred to in inventory economics as the Combined Variance Theorem). Let D_t represent daily demand with mean d_bar and variance sigma_d^2, and let L represent supplier replenishment lead time in days with mean L_bar and variance sigma_L^2.",

    "The expected demand during lead time is straightforward: E[DDLT] = d_bar * L_bar. However, the variance of demand during lead time decomposes into two additive components: Var(DDLT) = L_bar * sigma_d^2 + (d_bar)^2 * sigma_L^2. Taking the square root of this total variance yields the standard deviation of lead-time demand: sigma_LTD = sqrt( L_bar * sigma_d^2 + (d_bar)^2 * sigma_L^2 ). Consequently, the general safety stock formula under dual stochasticity is formulated as: SS = Z * sqrt( L_bar * sigma_d^2 + (d_bar)^2 * sigma_L^2 ).",

    "Examining the two terms inside the radical reveals a profound mathematical asymmetry that every analytics leader must grasp. In the first term, L_bar * sigma_d^2, the variance of demand is multiplied by the average lead time L_bar. But in the second term, (d_bar)^2 * sigma_L^2, the variance of lead time is multiplied by the SQUARE of average daily demand (d_bar)^2. Because daily demand d_bar for a commercial enterprise is frequently a large number (e.g., hundreds or thousands of units per day), squaring this mean demand creates a massive numerical multiplier on lead-time variance sigma_L^2.",

    "As a direct mathematical consequence, even modest fluctuations in supplier delivery schedules (such as a standard deviation of lead time of just 2 or 3 days) will utterly swamp high volatility in customer demand. An organization that focuses all its analytics resources on refining demand forecasting while ignoring supplier lead-time reliability is optimizing the minor term while leaving the dominant source of risk unmanaged. For example, if a company reduces demand forecast error by 20%, safety stock might decrease by 8%; but if it works with suppliers to reduce lead-time standard deviation from 3 days to 0.5 days, safety stock requirements can plummet by more than 50%.",

    "Furthermore, lead-time variance directly magnifies working capital exposure. When suppliers are erratic, procurement managers compensate by artificially inflating purchase orders and padding lead-time buffers, which triggers the notorious Bullwhip Effect throughout upstream supply echelons. By deploying rigorous statistical lead-time tracking and supplier scorecard analytics, modern enterprises replace inventory buffers with information buffers, unlocking millions of dollars in trapped working capital.",

    "To formalize this mathematically, let us analyze the covariance structure across supply chain echelons. In classical inventory theory, daily customer demand and supplier replenishment lead times are assumed to be mutually independent. Under this orthogonality assumption, the covariance between daily demand and lead-time duration is identically zero: Cov(D, L) = 0. However, in real-world supply networks during macroeconomic shocks or sector-wide raw material shortages, demand spikes often coincide with supplier production delays, generating a positive covariance: Cov(D, L) > 0. When this positive covariance manifests, the true variance of lead-time demand expands further by the covariance cross-product, rendering standard safety stock calculations dangerously inadequate and precipitating catastrophic supply failure.",

    "Understanding this structural amplification also transforms how enterprise leadership allocates procurement capital. Rather than spending millions of dollars on speculative artificial intelligence forecasting engines to squeeze another two percentage points of demand forecast accuracy, high-performing supply chain organizations invest in supplier integration, automated electronic data interchange (EDI), vendor-managed inventory (VMI) agreements, and domestic dual-sourcing partnerships. By cutting lead-time variance down toward zero, the organization collapses the dominant (d_bar)^2 * sigma_L^2 term, permanently lowering safety stock requirements across the entire product catalog.",

    "In the accompanying Python implementation, we build an Enterprise Dual-Stochastic Safety Stock Engine. We simulate demand and lead-time distributions, compute the analytical variance decomposition between demand risk and lead-time risk, and demonstrate how supplier delivery unreliability geometrically expands required safety stock buffers."
]

p2_code = r"""# Pure Python Dual-Stochastic Safety Stock & Variance Decomposition Engine
import math

def normal_ppf(p):
    # Inverse normal CDF via rational approximation
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680133080352692e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [ 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00]
    p_low, p_high = 0.02425, 1.0 - 0.02425
    if p < p_low:
        q = math.sqrt(-2.0 * math.log(p))
        return sum(c[i] * (q ** (5 - i)) for i in range(6)) / (1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4)))
    elif p <= p_high:
        q = p - 0.5
        r = q * q
        return (sum(a[i] * (r ** (5 - i)) for i in range(6)) * q) / (1.0 + sum(b[i] * (r ** (5 - i)) for i in range(5)))
    else:
        q = math.sqrt(-2.0 * math.log(1.0 - p))
        return -sum(c[i] * (q ** (5 - i)) for i in range(6)) / (1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4)))

class DualStochasticInventoryModel:
    def __init__(self, d_bar, sigma_d, L_bar, sigma_L, csl=0.95):
        self.d_bar = float(d_bar)
        self.sigma_d = float(sigma_d)
        self.L_bar = float(L_bar)
        self.sigma_L = float(sigma_L)
        self.csl = float(csl)
        self.z = normal_ppf(csl)
        
    def calculate_variance_components(self):
        # Component 1: Variance due to demand volatility across mean lead time
        var_demand = self.L_bar * (self.sigma_d ** 2)
        # Component 2: Variance due to lead-time volatility across squared mean demand
        var_lead_time = (self.d_bar ** 2) * (self.sigma_L ** 2)
        total_var = var_demand + var_lead_time
        sigma_ltd = math.sqrt(total_var)
        
        # Safety stocks:
        # Deterministic lead time (sigma_L = 0)
        ss_det_lead_time = self.z * math.sqrt(var_demand)
        # Full dual stochastic safety stock
        ss_dual = self.z * sigma_ltd
        
        pct_variance_lead_time = (var_lead_time / total_var) * 100.0 if total_var > 0 else 0.0
        pct_variance_demand = (var_demand / total_var) * 100.0 if total_var > 0 else 0.0
        
        return {
            "var_demand_contrib": round(var_demand, 2),
            "var_lead_time_contrib": round(var_lead_time, 2),
            "pct_demand_risk": round(pct_variance_demand, 2),
            "pct_lead_time_risk": round(pct_variance_lead_time, 2),
            "sigma_ltd": round(sigma_ltd, 2),
            "ss_deterministic_lead_time": round(ss_det_lead_time, 2),
            "ss_dual_stochastic": round(ss_dual, 2),
            "amplification_factor": round(ss_dual / ss_det_lead_time, 3) if ss_det_lead_time > 0 else 1.0
        }

# Model scenario: Mean demand = 300 units/day, sigma_d = 50. Mean lead time = 10 days.
print("--- LEAD-TIME VARIABILITY SENSITIVITY ANALYSIS (CSL = 95%) ---")
lead_time_sigmas = [0.0, 0.5, 1.0, 2.0, 3.0, 5.0]

for s_L in lead_time_sigmas:
    model = DualStochasticInventoryModel(d_bar=300, sigma_d=50, L_bar=10, sigma_L=s_L, csl=0.95)
    metrics = model.calculate_variance_components()
    print(f"Sigma_L: {s_L:3.1f} days | Risk (Demand/LT): {metrics['pct_demand_risk']:5.1f}% / {metrics['pct_lead_time_risk']:5.1f}% | Total SS: {metrics['ss_dual_stochastic']:7.1f} units | Surge Factor: {metrics['amplification_factor']:5.2f}x")
"""

p2_mcq = {
    "question": "In the combined variance formula Var(DDLT) = L_bar * sigma_d^2 + (d_bar)^2 * sigma_L^2, why does lead-time variance have such a disproportionate impact on safety stock?",
    "options": [
        "Because lead-time variance is multiplied by the square of average daily demand (d_bar)^2, creating a massive numerical multiplier.",
        "Because supplier replenishment lead times follow an exponential distribution rather than a Gaussian distribution.",
        "Because the Z-score for lead-time variance is double the Z-score applied to customer demand volatility.",
        "Because daily demand variance is discounted by the annual cost of capital holding rate."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Law of Total Variance weights lead-time variance by (d_bar)^2, whereas demand variance is weighted only by L_bar. For any business with significant daily demand, (d_bar)^2 dwarfs L_bar."
}

# -------------------------------------------------------------
# Part 3: Continuous Review (s, Q) & Reorder Point (ROP) Policy Dynamics
# -------------------------------------------------------------
p3_say = [
    "Having established the statistical formulation of safety stock buffers, we now integrate safety stock into operational inventory control systems. The two primary replenishment archetypes in operations management are Continuous Review Policies and Periodic Review Policies. In modern enterprise resource planning (ERP) and warehouse management systems (WMS) equipped with real-time barcode scanning and RFID tracking, the standard replenishment operating framework is the Continuous Review (s, Q) Policy, also known as the Reorder Point (ROP) Policy.",

    "Under a Continuous Review (s, Q) framework, the firm continuously monitors its Inventory Position (IP) in real time. The crucial distinction in inventory analytics is between On-Hand Inventory (OH), Net Inventory (NI), and Inventory Position (IP). On-Hand Inventory is the physical count of units physically present on warehouse shelves. Net Inventory is physical on-hand units minus backorders (unfulfilled customer commitments): NI = OH - BO. However, ordering decisions must never be based solely on on-hand stock or net inventory; they must be governed strictly by Inventory Position.",

    "Inventory Position incorporates all pipeline inventory committed to the business: IP = On-Hand (OH) + On-Order (OO) - Backorders (BO) - Customer Allocations. On-Order inventory represents purchase orders already dispatched to suppliers that are currently in transit or manufacturing. If an inventory manager ignores on-order stock and looks only at physical shelf stock, they will repeatedly place duplicate replenishment orders whenever stock is low, causing massive over-ordering and inventory gluts once shipments arrive. The decision rule under an (s, Q) policy states: whenever the Inventory Position drops to or below the Reorder Point s (ROP), immediately dispatch a replenishment order of fixed batch size Q.",

    "The Reorder Point s is formulated as the sum of expected demand during replenishment lead time plus the safety stock buffer: ROP = E[DDLT] + SS = (d_bar * L_bar) + SS. The logic of this threshold is elegant and robust: if an order is triggered when IP hits ROP, the firm has exactly enough expected inventory (d_bar * L_bar) to fulfill expected customer orders during the lead time required for the supplier to deliver, while safety stock SS protects against upside demand spikes or shipping delays.",

    "The replenishment order quantity Q is determined economically via the classical Economic Order Quantity (EOQ) model, pioneered by Ford Whitman Harris in 1913. The EOQ formula balances annual fixed order placement costs S (administrative purchasing overhead, freight docking fees, customs documentation) against annual inventory holding costs H: EOQ = sqrt( (2 * D * S) / H ), where D is annual demand in units, S is fixed cost per order, and H = h * C is annual holding cost per unit. The total average inventory level carried by the firm under an (s, Q) continuous review policy is: Average Inventory = (Q / 2) + SS.",

    "Notice the structural dichotomy in average inventory composition: the first term, Q / 2, represents Cycle Stock (inventory held to satisfy expected demand between replenishment cycles), which is governed strictly by batch size economics and ordering costs. The second term, SS, represents Safety Stock, which is governed strictly by demand volatility, lead-time variance, and target service levels. Optimizing working capital requires attacking both terms simultaneously: lean setup reduction to shrink Q (slashing cycle stock) and supplier reliability to shrink SS (slashing buffer stock).",

    "To appreciate the operational superiority of Continuous Review (s, Q) policies, we must contrast them against Periodic Review (R, S) policies, commonly known as Order-Up-To policies. In a Periodic Review system, inventory is inspected only at fixed time intervals of duration R (such as every Monday morning or the first day of each month), at which point an order is placed to bring the inventory position up to an order-up-to level S. Because the system is blind to inventory depletion between review epochs, the safety stock buffer under periodic review must protect against demand volatility across an extended vulnerability window: Protection Interval = R + L.",

    "Under periodic review, safety stock expands to: SS_{periodic} = Z * sigma_d * sqrt(R + L). Because R + L is strictly greater than lead time L alone, a periodic review policy forces the enterprise to hold between 15% and 30% more safety stock than a continuous review policy operating at the exact same Cycle Service Level. In the modern era of real-time cloud data pipelines and automated API webhooks, maintaining continuous review capabilities allows organizations to eliminate the artificial review lag R, unlocking immediate working capital efficiencies and preventing unnecessary buffer accumulation.",

    "In the accompanying Python implementation, we build an (s, Q) Continuous Review Inventory Engine. We calculate EOQ, compute the Reorder Point across stochastic demand parameters, and track inventory position, cycle stock, safety stock, and average working capital."
]

p3_code = r"""# Pure Python Continuous Review (s, Q) & Reorder Point Engine
import math

class ContinuousReviewInventoryPolicy:
    def __init__(self, annual_demand, mean_daily_demand, std_daily_demand, lead_time_days, 
                 order_cost, unit_cost, holding_cost_pct=0.25, csl=0.95):
        self.D = float(annual_demand)
        self.d_bar = float(mean_daily_demand)
        self.sigma_d = float(std_daily_demand)
        self.L = float(lead_time_days)
        self.S = float(order_cost)
        self.C = float(unit_cost)
        self.H = self.C * float(holding_cost_pct)
        self.csl = float(csl)
        
        # Calculate EOQ (Q)
        self.eoq = math.sqrt((2.0 * self.D * self.S) / self.H)
        
        # Calculate Z-score for CSL
        # Approximation for normal_ppf
        self.z = self._calculate_z(csl)
        
        # Safety Stock: SS = Z * sigma_d * sqrt(L)
        self.safety_stock = self.z * self.sigma_d * math.sqrt(self.L)
        
        # Reorder Point: ROP = (d_bar * L) + SS
        self.expected_ltd = self.d_bar * self.L
        self.rop = self.expected_ltd + self.safety_stock
        
        # Decomposed inventory levels
        self.cycle_stock = self.eoq / 2.0
        self.average_inventory = self.cycle_stock + self.safety_stock
        self.annual_orders = self.D / self.eoq
        self.total_annual_cost = (self.annual_orders * self.S) + (self.average_inventory * self.H)

    def _calculate_z(self, p):
        # High precision rational approximation
        a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
        b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680133080352692e+01, -1.328068155288572e+01]
        c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
        d = [ 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00]
        p_low, p_high = 0.02425, 1.0 - 0.02425
        if p < p_low:
            q = math.sqrt(-2.0 * math.log(p))
            return sum(c[i] * (q ** (5 - i)) for i in range(6)) / (1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4)))
        elif p <= p_high:
            q = p - 0.5
            r = q * q
            return (sum(a[i] * (r ** (5 - i)) for i in range(6)) * q) / (1.0 + sum(b[i] * (r ** (5 - i)) for i in range(5)))
        else:
            q = math.sqrt(-2.0 * math.log(1.0 - p))
            return -sum(c[i] * (q ** (5 - i)) for i in range(6)) / (1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4)))

    def get_policy_summary(self):
        return {
            "EOQ_Batch_Q": round(self.eoq, 1),
            "Expected_LTD": round(self.expected_ltd, 1),
            "Safety_Stock_SS": round(self.safety_stock, 1),
            "Reorder_Point_ROP": round(self.rop, 1),
            "Average_Cycle_Stock": round(self.cycle_stock, 1),
            "Total_Average_Inventory": round(self.average_inventory, 1),
            "Orders_Per_Year": round(self.annual_orders, 2),
            "Total_Annual_Policy_Cost": round(self.total_annual_cost, 2),
            "Working_Capital_Tied": round(self.average_inventory * self.C, 2)
        }

# Example: Component with 75,000 annual units, mean daily demand 250, sigma 40, lead time 8 days
policy = ContinuousReviewInventoryPolicy(
    annual_demand=75000, mean_daily_demand=250, std_daily_demand=40,
    lead_time_days=8, order_cost=220.00, unit_cost=42.50, holding_cost_pct=0.20, csl=0.98
)
summary = policy.get_policy_summary()
print("--- CONTINUOUS REVIEW (s, Q) POLICY SPECIFICATIONS ---")
for k, v in summary.items():
    print(f"  {k:25s}: {v}")
"""

p3_mcq = {
    "question": "Why must replenishment orders be triggered based on Inventory Position (IP = OH + OO - BO) rather than physical On-Hand Inventory (OH)?",
    "options": [
        "Because ignoring On-Order pipeline inventory causes redundant replenishment orders to be placed while previous orders are in transit, leading to severe over-stocking.",
        "Because On-Hand inventory is legally owned by the freight carrier until customer delivery is completed.",
        "Because customer backorders automatically reduce the supplier's manufacturing lead time.",
        "Because accounting regulations prohibit recognizing inventory until invoices are settled in cash."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Inventory Position accounts for pipeline stock (On-Order). If an ERP triggers orders based on physical On-Hand stock alone, it will continuously reorder every day while waiting for shipments, flooding the warehouse."
}

# -------------------------------------------------------------
# Part 4: Unit Shortage Economics & The Normal Loss Function G(Z)
# -------------------------------------------------------------
p4_say = [
    "While Cycle Service Level (Type 1 Service) is a widely utilized metric, it possesses a severe commercial limitation: it treats all stockouts identically regardless of severity. If a warehouse experiences a stockout of a single unit on the final hour of a replenishment cycle, Type 1 service scores that cycle as a 100% failure, identical to a catastrophic stockout where 10,000 customer orders go unfulfilled. In commercial retail and enterprise distribution, executives care far more about the Fill Rate (Type 2 Service Level), which measures the exact fraction of total customer demand satisfied immediately from available inventory.",

    "To bridge the gap between binary cycle stockouts and quantitative unit shortages, inventory analytics employs the Unit Normal Loss Function, universally denoted as G(Z) or L(z). The Expected Units Short per replenishment cycle (EUS or ESC) measures the mathematical expectation of unsatisfied demand exceeding available inventory during lead time: EUS = integral from ROP to infinity of (x - ROP) * f(x) dx, where f(x) is the probability density function of demand during lead time.",

    "Under the assumption of normally distributed lead-time demand with standard deviation sigma_LTD, this integral resolves into an exact closed-form expression: EUS = sigma_LTD * G(Z). The Unit Normal Loss Function G(Z) is defined as: G(Z) = phi(Z) - Z * (1 - Phi(Z)), where phi(Z) is the standard normal probability density function: phi(Z) = (1 / sqrt(2 * pi)) * exp(-Z^2 / 2), and Phi(Z) is the standard normal cumulative distribution function. Notice that G(Z) is strictly non-negative and monotonically decreasing: as Z increases (more safety stock), G(Z) rapidly approaches zero.",

    "With the Expected Units Short (EUS) calculated, the Fill Rate (Type 2 Service Level, designated as beta) is formulated across replenishment cycles of batch size Q as: Fill Rate (beta) = 1 - (EUS / Q) = 1 - ( (sigma_LTD * G(Z)) / Q ). This formula yields an extraordinary insight into supply chain economics: Fill Rate is a function of BOTH safety stock (via G(Z)) and order batch size Q. Even if an organization operates with a modest Cycle Service Level (such as CSL = 90%, where Z = 1.282 and 1 out of 10 cycles experiences a stockout), if the replenishment batch size Q is large relative to lead-time demand, the resulting Fill Rate beta can easily exceed 99.5%!",

    "This distinction unlocks massive working capital optimizations for enterprise inventory managers. If contracts with retail partners (such as Walmart, Amazon, or Target) mandate a 98% Fill Rate (Type 2), an uninformed inventory planner using Type 1 CSL formulas would set Z = 2.054 (98% CSL), hoarding unnecessary safety stock. A sophisticated analytics leader, however, inverts the Fill Rate equation to solve for the target loss function value: G(Z) = (1 - beta) * (Q / sigma_LTD). They then solve for the exact, lower Z-score required to achieve the contractual Fill Rate, safely releasing substantial working capital.",

    "The mathematical elegance of the Unit Normal Loss function G(Z) is further demonstrated by examining its first derivative with respect to Z. By applying Leibniz's integral rule to the definition of G(Z), we obtain the derivative: d(G(Z)) / dZ = Phi(Z) - 1. Because the cumulative normal distribution Phi(Z) is bounded strictly between 0 and 1, this derivative is strictly negative for all finite Z, confirming that the expected shortage function is monotonically decreasing and strictly convex.",

    "This strict convexity links the Normal Loss function directly to the Newsvendor Critical Fractile theorem in stochastic decision theory. If an organization knows the unit cost of understocking C_u (lost margin and stockout penalties) and the unit cost of overstocking C_o (holding and obsolescence charges), the optimal service level is defined by the critical ratio: CR = C_u / (C_u + C_o). By equating the marginal shortage cost to the marginal holding cost via G(Z), operations research practitioners establish exact, profit-maximizing safety stock thresholds without relying on arbitrary management heuristics.",

    "In the accompanying Python implementation, we build a High-Precision Normal Loss Function Engine from first principles. We implement G(Z), demonstrate its numerical properties, compute Expected Units Short across varying safety stock buffers, and benchmark the relationship between Cycle Service Level (Type 1) and Fill Rate (Type 2)."
]

p4_code = r"""# Pure Python Normal Loss Function G(Z) & Fill Rate Optimization Engine
import math

def normal_pdf(x):
    # Standard normal probability density function phi(x)
    return (1.0 / math.sqrt(2.0 * math.pi)) * math.exp(-0.5 * x * x)

def normal_cdf(x):
    # Standard normal cumulative distribution function Phi(x)
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def unit_normal_loss(z):
    # Unit Normal Loss Function G(z) = phi(z) - z * (1 - Phi(z))
    pdf_val = normal_pdf(z)
    cdf_val = normal_cdf(z)
    g_z = pdf_val - z * (1.0 - cdf_val)
    return max(0.0, g_z)

def solve_z_for_fill_rate(target_fill_rate, batch_q, sigma_ltd, tolerance=1e-6, max_iter=100):
    # Inverts G(Z) = (1 - FillRate) * Q / sigma_ltd via Newton-Raphson
    target_gz = (1.0 - target_fill_rate) * (batch_q / sigma_ltd)
    if target_gz <= 0.0:
        return 3.5 # Near perfect
        
    # Newton-Raphson iteration: d(G(z))/dz = Phi(z) - 1
    z = 1.0 # Initial guess
    for _ in range(max_iter):
        gz = unit_normal_loss(z)
        diff = gz - target_gz
        if abs(diff) < tolerance:
            return z
        derivative = normal_cdf(z) - 1.0
        if abs(derivative) < 1e-12:
            break
        z = z - diff / derivative
    return z

class ServiceLevelBenchmarker:
    def __init__(self, d_bar, sigma_d, lead_time_days, batch_q):
        self.d_bar = float(d_bar)
        self.sigma_d = float(sigma_d)
        self.L = float(lead_time_days)
        self.sigma_ltd = self.sigma_d * math.sqrt(self.L)
        self.Q = float(batch_q)
        
    def evaluate_z(self, z):
        csl = normal_cdf(z)
        g_z = unit_normal_loss(z)
        eus = self.sigma_ltd * g_z
        fill_rate = 1.0 - (eus / self.Q)
        ss = z * self.sigma_ltd
        return {
            "z": round(z, 3),
            "CSL_Type1": round(csl * 100.0, 2),
            "G_Z": round(g_z, 5),
            "EUS_Units": round(eus, 2),
            "Fill_Rate_Type2": round(fill_rate * 100.0, 3),
            "Safety_Stock_Units": round(ss, 1)
        }

bench = ServiceLevelBenchmarker(d_bar=180, sigma_d=35, lead_time_days=9, batch_q=1500)
print(f"Lead-Time Demand StdDev (sigma_LTD): {bench.sigma_ltd:.2f} | Batch Size Q: {bench.Q:.0f}")
print("--- TYPE 1 (CSL) VS TYPE 2 (FILL RATE) TRADEOFF MATRIX ---")

test_z_values = [0.0, 0.84, 1.282, 1.645, 2.054, 2.326]
for z_val in test_z_values:
    res = bench.evaluate_z(z_val)
    print(f"Z: {res['z']:5.3f} | CSL: {res['CSL_Type1']:5.1f}% | G(Z): {res['G_Z']:7.5f} | EUS: {res['EUS_Units']:5.1f} | Fill Rate: {res['Fill_Rate_Type2']:6.2f}% | SS: {res['Safety_Stock_Units']:6.1f}")

# Solve exact Z needed for 99.0% Fill Rate
opt_z = solve_z_for_fill_rate(target_fill_rate=0.99, batch_q=bench.Q, sigma_ltd=bench.sigma_ltd)
opt_res = bench.evaluate_z(opt_z)
print(f"\nTarget 99.0% Fill Rate achieved with Z = {opt_z:.3f} (CSL = {opt_res['CSL_Type1']}%, SS = {opt_res['Safety_Stock_Units']} units)")
"""

p4_mcq = {
    "question": "What is the key mathematical reason that a firm can achieve a 99% Fill Rate (Type 2 Service) even when its Cycle Service Level (Type 1 Service) is only 90%?",
    "options": [
        "Because Fill Rate accounts for replenishment batch size Q, so a stockout occurring in only 10% of cycles represents a tiny fraction of the total units ordered across the entire cycle.",
        "Because supplier replenishment lead time drops to zero whenever the stockout quantity is small.",
        "Because the normal loss function G(Z) is mathematically identical to the cumulative distribution function Phi(Z).",
        "Because customer demand variance is eliminated when order sizes exceed economic order quantity thresholds."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Fill Rate = 1 - (EUS / Q). When batch size Q is large relative to Expected Units Short (EUS), even if 10% of cycles experience a minor stockout, the unsatisfied units represent less than 1% of total demand."
}

# -------------------------------------------------------------
# Part 5: Simulating Dynamic Inventory Queuing & Stockout Costs in Python
# -------------------------------------------------------------
p5_say = [
    "To conclude Day 21, we synthesize all mathematical constructs developed throughout this session—dual-stochastic variance decomposition, continuous review (s, Q) policies, reorder point triggering, and normal loss economics—into a full Monte Carlo discrete-event simulation engine. Analytical formulas provide indispensable baseline targets under idealized Gaussian assumptions; however, in operating enterprise environments, inventory systems experience non-linear feedback loops: backorders accumulate, pipeline shipments arrive asynchronously, and stockout penalty fees compound.",

    "Our simulation engine models an enterprise warehouse operating over an extended horizon of 180 business days. On each simulated day, customer demand is drawn stochastically from a Gaussian distribution with mean daily demand and standard deviation. The warehouse tracks physical On-Hand (OH) inventory, pipeline On-Order (OO) shipments, and accumulated customer Backorders (BO). Net inventory and inventory position are updated continuously at each discrete daily time step.",

    "When customer demand arrives, the engine first satisfies outstanding backorders and current daily demand from available on-hand stock. If customer demand exceeds physical on-hand inventory, available units are depleted to zero, and the remaining unsatisfied units transition into customer backorders. The firm incurs two opposing financial cash flows: carrying costs accrued daily on positive on-hand inventory (H / 365 per unit-day), and stockout penalty costs accrued on backorders (representing expedited emergency freight, contractual SLA breach fines, and lost goodwill).",

    "Simultaneously, the engine evaluates the Continuous Review decision rule: if Inventory Position IP = OH + OO - BO drops to or below the Reorder Point ROP, and no replenishment order is currently pending dispatch, the engine places an order of batch size Q with the upstream supplier. Rather than assuming instantaneous delivery, the engine models stochastic supplier lead time: the delivery date is scheduled as t + L, where lead time L is drawn from a discrete lead-time distribution. When the simulation clock reaches day t + L, the pipeline shipment arrives, physical on-hand stock increases by Q, on-order stock decreases by Q, and pending customer backorders are immediately cleared.",

    "By running this full discrete-event simulation across competing inventory policies (e.g., Lean Zero-Safety Stock vs Optimized (s, Q) vs Over-Buffered Hoarding), the analytics practitioner generates empirical empirical proof of financial performance. The simulation outputs total holding costs, total stockout penalty fees, realized empirical Cycle Service Level, realized empirical Fill Rate, and net cash flow performance.",

    "In enterprise queuing networks, discrete-event simulations capture the profound operational reality governed by Little's Law: L = lambda * W. In an inventory context, the average quantity of inventory in transit or in buffer (L) is the product of the long-term customer arrival throughput rate (lambda) and the average dwell time of an item in the warehouse system (W). When replenishment orders are delayed due to lead-time spikes, inventory dwell time W plummets for on-hand stock (leading to starvation) while dwell time in the pipeline explodes, shifting working capital into completely inaccessible transit states.",

    "Furthermore, tracking state trajectories across discrete simulation ticks reveals the non-linear cascading danger of Backorder Accumulation Traps. When a stockout occurs, demand does not vanish; it accumulates as a debt against the warehouse. When the next replenishment shipment finally arrives, a large fraction of the incoming batch is instantly consumed to clear backorders, leaving the warehouse with an immediate deficit for subsequent daily arrivals. If another demand spike strikes before the next order cycle, the system enters an unstable oscillatory state of chronic stockouts that no static formula could predict.",

    "By quantifying these non-linear feedback loops under realistic stochastic conditions, the simulation engine equips senior executives with stress-tested scenario models. Leaders can directly stress-test their supply chains against black swan port shutdowns, demand surges during promotional holidays, and severe working capital constraints, ensuring organizational resilience.",

    "In the accompanying Python implementation, we build this complete Discrete-Event Inventory Simulation Engine. We run a 180-day operational simulation, capture daily state trajectories, compute realized service metrics, and compare theoretical predictions against simulated empirical reality."
]

p5_code = r"""# Pure Python Discrete-Event Inventory Simulation Engine
import math
import random

random.seed(42)

def simulate_inventory_system(days=180, d_bar=200, sigma_d=35, L_bar=8, sigma_L=1.5,
                              unit_cost=50.0, holding_pct=0.20, stockout_penalty_per_unit=15.0,
                              order_cost=200.0, csl_target=0.95):
    # Calculate policy parameters
    z = 1.645 # for 95% CSL
    var_ltd = (L_bar * (sigma_d ** 2)) + ((d_bar ** 2) * (sigma_L ** 2))
    sigma_ltd = math.sqrt(var_ltd)
    ss = z * sigma_ltd
    rop = (d_bar * L_bar) + ss
    
    annual_demand = d_bar * 365.0
    h_annual = unit_cost * holding_pct
    h_daily = h_annual / 365.0
    eoq_q = math.sqrt((2.0 * annual_demand * order_cost) / h_annual)
    
    # State variables
    on_hand = int(eoq_q + ss)
    on_order = 0
    backorders = 0
    pipeline_orders = [] # list of tuples: (arrival_day, quantity)
    
    # Tracking metrics
    total_demand = 0
    total_satisfied_immediately = 0
    total_holding_cost = 0.0
    total_stockout_penalties = 0.0
    total_order_costs = 0.0
    cycles_total = 0
    cycles_stocked_out = 0
    in_stockout_state = False
    
    for current_day in range(1, days + 1):
        # 1. Process pipeline arrivals
        arrived_today = [qty for arr_day, qty in pipeline_orders if arr_day == current_day]
        pipeline_orders = [(arr_day, qty) for arr_day, qty in pipeline_orders if arr_day > current_day]
        for qty in arrived_today:
            on_hand += qty
            on_order -= qty
            
            # Clear backorders first
            if backorders > 0:
                cleared = min(on_hand, backorders)
                backorders -= cleared
                on_hand -= cleared
                
        # 2. Generate daily stochastic demand (Box-Muller transform)
        u1, u2 = random.random(), random.random()
        z_rand = math.sqrt(-2.0 * math.log(max(1e-9, u1))) * math.cos(2.0 * math.pi * u2)
        daily_demand = max(0, int(round(d_bar + sigma_d * z_rand)))
        total_demand += daily_demand
        
        # 3. Fulfill demand
        if on_hand >= daily_demand:
            on_hand -= daily_demand
            total_satisfied_immediately += daily_demand
        else:
            total_satisfied_immediately += on_hand
            shortage = daily_demand - on_hand
            on_hand = 0
            backorders += shortage
            total_stockout_penalties += shortage * stockout_penalty_per_unit
            if not in_stockout_state:
                cycles_stocked_out += 1
                in_stockout_state = True
                
        # 4. Check inventory position & place order if IP <= ROP
        ip = on_hand + on_order - backorders
        if ip <= rop and on_order == 0:
            # Place replenishment order
            cycles_total += 1
            in_stockout_state = False
            total_order_costs += order_cost
            
            # Stochastic lead time
            u3, u4 = random.random(), random.random()
            z_lt = math.sqrt(-2.0 * math.log(max(1e-9, u3))) * math.cos(2.0 * math.pi * u4)
            stochastic_lt = max(2, int(round(L_bar + sigma_L * z_lt)))
            arrival_day = current_day + stochastic_lt
            order_qty = int(round(eoq_q))
            pipeline_orders.append((arrival_day, order_qty))
            on_order += order_qty
            
        # 5. Accumulate daily holding costs
        total_holding_cost += on_hand * h_daily
        
    empirical_fill_rate = total_satisfied_immediately / float(total_demand) if total_demand > 0 else 1.0
    empirical_csl = 1.0 - (cycles_stocked_out / float(cycles_total)) if cycles_total > 0 else 1.0
    total_operating_cost = total_holding_cost + total_stockout_penalties + total_order_costs
    
    return {
        "days_simulated": days,
        "total_demand": total_demand,
        "total_orders_placed": cycles_total,
        "empirical_fill_rate_pct": round(empirical_fill_rate * 100.0, 2),
        "empirical_csl_pct": round(empirical_csl * 100.0, 2),
        "total_holding_cost": round(total_holding_cost, 2),
        "total_stockout_penalties": round(total_stockout_penalties, 2),
        "total_order_costs": round(total_order_costs, 2),
        "total_operating_cost": round(total_operating_cost, 2),
        "theoretical_ROP": round(rop, 1),
        "theoretical_SS": round(ss, 1),
        "theoretical_EOQ": round(eoq_q, 1)
    }

results = simulate_inventory_system(days=180, d_bar=200, sigma_d=35, L_bar=8, sigma_L=1.5)
print("--- 180-DAY DISCRETE EVENT INVENTORY SIMULATION RESULTS ---")
for k, v in results.items():
    print(f"  {k:28s}: {v}")
"""

p5_mcq = {
    "question": "In discrete-event inventory simulations, how does accumulated customer backorder volume affect the firm's financial cash flow?",
    "options": [
        "It triggers direct stockout penalty fees, lost customer goodwill costs, and consumes future replenishment shipments before new orders can be satisfied.",
        "It permanently eliminates the holding cost rate applied to warehouse storage.",
        "It increases the Economic Order Quantity (EOQ) by multiplying the fixed order placement fee.",
        "It causes the supplier to provide mandatory volume discounts on pipeline deliveries."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Backorders create stockout penalty expenses and must be cleared immediately upon shipment arrival, reducing the available inventory to fulfill subsequent daily customer orders."
}

# -------------------------------------------------------------
# DAY_DATA Aggregation & Validation
# -------------------------------------------------------------
DAY_DATA = {
    "day": 21,
    "courseId": "bcom_ana",
    "title": "Inventory Analytics & Demand Volatility: Safety Stock, Reorder Points & Lead-Time Variance",
    "description": "Master quantitative inventory control: Gaussian safety stock formulas, dual-stochastic variance decomposition, continuous review (s, Q) policies, the Unit Normal Loss function G(Z), and discrete-event Monte Carlo inventory simulation.",
    "parts": [
        {
            "title": "The Mechanics of Safety Stock: Demand Stochasticity, Service Levels & Normal Deviates (Z-Scores)",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "title": "Stochastic Lead-Time Variance: The Combined Variance Theorem & Risk Amplification",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "title": "Continuous Review (s, Q) & Reorder Point (ROP) Policy Dynamics",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "title": "Unit Shortage Economics & The Normal Loss Function G(Z)",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "title": "Simulating Dynamic Inventory Queuing & Stockout Costs in Python",
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
