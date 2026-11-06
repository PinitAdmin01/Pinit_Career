# scripts/data_day20.py
# Day 20: Exponential Smoothing & Holt-Winters State-Space Systems: Level, Trend & Seasonal Filtering
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

# -------------------------------------------------------------
# Part 1: Simple Exponential Smoothing (SES): Memory Decay, Alpha Damping & Recursive State Updates
# -------------------------------------------------------------
p1_say = [
    "To conclude Block Four of Business Analytics and Decision Intelligence, we investigate the most widely deployed, computationally efficient, and operationally reliable family of algorithms in commercial demand forecasting: Exponential Smoothing and Holt-Winters State-Space Systems. While ARIMA models model series via differenced lagged correlations and stochastic error polynomials, Exponential Smoothing models temporal series through Dynamic State Components—Level, Trend, and Seasonality—recursively updated as new evidence arrives.",

    "The foundational baseline of the exponential smoothing family is Simple Exponential Smoothing (SES), originally formulated by Charles C. Holt in 1957 and Robert G. Brown in 1959. Simple Exponential Smoothing is designed specifically for stationary or near-stationary time series that exhibit neither a persistent secular trend nor systematic calendar seasonality. In commercial operations, SES is the industry-standard algorithm used to forecast short-term inventory demand for mature SKUs, daily customer service ticket volumes, and server network utilization.",

    "The mathematical formulation of Simple Exponential Smoothing operates through a single Recursive State Update equation: l_t = alpha * Y_t + (1 - alpha) * l_{t-1}. Here, Y_t is the actual observed business metric at time t, l_t is the estimated Level (the smoothed baseline state) of the series at time t, and alpha is the Smoothing Hyperparameter, strictly bounded between zero and one: 0 < alpha < 1. The forecast for any future horizon h is simply the most recently updated level state: Y_hat_{t+h|t} = l_t. Notice that for Simple Exponential Smoothing, point forecasts across all future horizons h = 1, 2, ..., H are completely flat, reflecting the absence of trend.",

    "The genius of SES lies in its Weighted Exponential Memory Decay. By unrolling the recursive state equation backward through time, we discover that the smoothed level l_t is an exponentially weighted moving average of all past historical observations: l_t = alpha * Y_t + alpha*(1 - alpha) * Y_{t-1} + alpha*(1 - alpha)^2 * Y_{t-2} + ... + (1 - alpha)^t * l_0. Because the weights alpha*(1 - alpha)^k sum to exactly 1.0 (as an infinite geometric series), SES computes a valid weighted average where the most recent observation receives the highest weight alpha, and weights decay exponentially into the distant past at the geometric rate (1 - alpha).",

    "The smoothing parameter alpha dictates the Model's Adaptability vs Stability Trade-Off: If alpha is close to 1.0 (such as alpha = 0.90), the algorithm reacts aggressively to the most recent observation, virtually ignoring past history. This produces high responsiveness to rapid shifts, but makes the model highly vulnerable to chasing random noise. Conversely, if alpha is small (such as alpha = 0.10), the algorithm discounts contemporary fluctuations, heavily weighting the long historical baseline. This produces rock-solid stability and noise filtering, but causes the model to lag behind genuine structural shifts. In professional MLOps pipelines, optimal alpha is determined by numerically minimizing in-sample SSE.",

    "Furthermore, institutional forecasting platforms establish the Average Age of Data in an SES model as: Age = 1 / alpha. If an inventory forecasting system operates with alpha = 0.20, the effective average age of the data informing today's forecast is exactly five periods (1 / 0.20 = 5). Understanding average data age allows operations managers to tune smoothing parameters to match specific procurement supply lead times: short-cycle components utilize high alpha (responsive, low data age), while long-lead overseas maritime inventory utilizes low alpha (stable, high data age).",

    "In theoretical time series econometrics, Simple Exponential Smoothing has a direct, exact mathematical equivalence: an SES model with smoothing parameter alpha is mathematically isomorphic to an ARIMA(0, 1, 1) process with moving average parameter theta = alpha - 1. Because theta is bounded between -1.0 and 0.0, the invertibility of the ARIMA process guarantees the stability of exponential smoothing. This structural bridge proves that exponential smoothing is not an arbitrary heuristic hack, but a fully certified Gaussian state-space statistical model.",

    "In the accompanying Python implementation, we build a Simple Exponential Smoothing (SES) Engine from first principles without external dependencies. We simulate empirical inventory demand, execute recursive state updates across varying alpha parameters, compute in-sample sum of squared errors, and benchmark the adaptability-stability frontier."
]

p1_code = """# Pure Python Simple Exponential Smoothing (SES) Engine & Alpha Optimizer
import math
import random

random.seed(42)

class SimpleExponentialSmoothing:
    def __init__(self, alpha=0.30):
        if not (0.0 < alpha < 1.0):
            raise ValueError("Smoothing parameter alpha must satisfy 0 < alpha < 1.")
        self.alpha = alpha
        
    def fit_and_forecast(self, series, horizon=4):
        n = len(series)
        # Initialization: l_0 set to first observation Y_1
        level = series[0]
        smoothed_levels = [level]
        in_sample_forecasts = [level] # Y_hat_1|0 = l_0
        
        for t in range(n):
            y_t = series[t]
            # Recursive state update: l_t = alpha * Y_t + (1 - alpha) * l_{t-1}
            level = self.alpha * y_t + (1.0 - self.alpha) * level
            smoothed_levels.append(level)
            in_sample_forecasts.append(level)
            
        # Point forecasts across future horizon h: Flat line at l_N
        out_of_sample = [level] * horizon
        
        # Calculate in-sample SSE
        # Forecast errors: e_t = Y_t - Y_hat_{t|t-1}
        errors = [series[t] - in_sample_forecasts[t] for t in range(n)]
        sse = sum(e * e for e in errors)
        mae = sum(abs(e) for e in errors) / float(n)
        
        return {
            'final_level': level,
            'forecasts': out_of_sample,
            'sse': sse,
            'mae': mae,
            'smoothed_history': smoothed_levels[1:]
        }

# Synthesize baseline SKU inventory demand (Mean = 150 units, stationary noise)
inventory_demand = [150.0 + random.gauss(0, 12.0) for _ in range(40)]

# Compare Alpha = 0.10 (High Stability) vs Alpha = 0.80 (High Responsiveness) vs Optimal Alpha
ses_stable = SimpleExponentialSmoothing(alpha=0.10).fit_and_forecast(inventory_demand)
ses_reactive = SimpleExponentialSmoothing(alpha=0.80).fit_and_forecast(inventory_demand)

# Find optimal alpha via grid search (0.05 to 0.95)
best_alpha = 0.05
best_sse = float('inf')
for i in range(1, 20):
    a = i * 0.05
    res = SimpleExponentialSmoothing(alpha=a).fit_and_forecast(inventory_demand)
    if res['sse'] < best_sse:
        best_sse = res['sse']
        best_alpha = a

ses_opt = SimpleExponentialSmoothing(alpha=best_alpha).fit_and_forecast(inventory_demand)

print("Simple Exponential Smoothing (SES) Parameter Benchmark:")
print("=" * 75)
print(f"Sample Observations : N={len(inventory_demand)} Weeks | True Baseline: 150.0 Units")
print("-" * 75)
print(f"{'Configuration':<22} | {'Alpha':<8} | {'In-Sample MAE':<14} | {'SSE':<12} | {'Data Age (1/a)'}")
print("-" * 75)
print(f"High Stability Model   | a=0.10   | {ses_stable['mae']:>10.2f} units | {ses_stable['sse']:>10.1f} | 10.0 Periods")
print(f"High Reactive Model    | a=0.80   | {ses_reactive['mae']:>10.2f} units | {ses_reactive['sse']:>10.1f} |  1.25 Periods")
print(f"Optimal Minimum-SSE    | a={best_alpha:.2f}   | {ses_opt['mae']:>10.2f} units | {ses_opt['sse']:>10.1f} | {1.0/best_alpha:>4.1f} Periods [CHAMPION]")
print("=" * 75)
print(f"Forward 4-Week Production Forecast: {ses_opt['forecasts'][0]:.1f} units/week (Fixed Level Projection)")
"""

p1_example = "An automotive parts supplier forecasts brake pad shipments using Simple Exponential Smoothing. Testing alpha across 0.10 to 0.90 reveals optimal alpha at 0.25 (data age of 4 weeks), which filters out erratic daily warehouse noise while adapting smoothly to monthly fleet demand."
p1_tryIt = "Introduce a permanent step jump of +50 units starting at week 20 in inventory_demand and observe how alpha=0.80 adapts in 2 weeks while alpha=0.10 takes 15 weeks to catch up."

p1_check = {
    "question": "What is the structural effect of selecting a high alpha smoothing parameter (e.g. alpha = 0.85) in Simple Exponential Smoothing?",
    "options": [
        "The model becomes highly responsive to recent observations, adapting rapidly to level shifts but increasing vulnerability to random noise.",
        "The model completely eliminates all white noise innovations from future projections.",
        "The model automatically generates upward exponential growth curves.",
        "The model doubles the physical storage capacity of the warehouse."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "High alpha weights recent observations heavily, making the model fast to adapt to genuine shifts but highly volatile and prone to chasing random noise."
}

# -------------------------------------------------------------
# Part 2: Holt's Linear Trend Method: Level Equations, Slope Tracking & Beta Trend Hyperparameters
# -------------------------------------------------------------
p2_say = [
    "While Simple Exponential Smoothing performs masterfully on stationary series, it fails completely when a business metric exhibits a persistent secular trend. When applied to an expanding revenue stream, SES produces forecasts that chronically and systematically lag behind actuals, because a flat level forecast cannot account for forward trajectory. In 1957, Charles C. Holt resolved this fundamental limitation by extending exponential smoothing into a two-parameter state-space system: Holt's Linear Trend Method.",

    "Holt's Linear Trend Method decouples the temporal state into two distinct, mutually interacting dynamic equations: The Level Equation (l_t), representing the estimated baseline value at time t, and The Trend or Slope Equation (b_t), representing the estimated rate of growth or change per period at time t. By tracking both level and slope dynamically, the algorithm projects linear trajectory into the future.",

    "The mathematical formulation of Holt's Linear Trend Method operates through three coupled equations: First, The Level Update Equation: l_t = alpha * Y_t + (1 - alpha) * (l_{t-1} + b_{t-1}). The new level l_t is a weighted average of the newly observed value Y_t and the one-step-ahead expected level (l_{t-1} + b_{t-1}). Second, The Trend Update Equation: b_t = beta * (l_t - l_{t-1}) + (1 - beta) * b_{t-1}. The new slope b_t is a weighted average of the newly realized level change (l_t - l_{t-1}) and the previous estimated slope b_{t-1}, governed by the trend smoothing hyperparameter beta: 0 < beta < 1. Third, The Forward Forecast Equation: Y_hat_{t+h|t} = l_t + h * b_t.",

    "Notice the elegance of the forecast equation: unlike SES, which projects a flat horizontal line, Holt's linear method projects an upward or downward sloping linear trajectory across future horizon h: Y_hat_{t+h} = l_t + h * b_t. For h = 1, the forecast is l_t + b_t. For h = 4 quarters, the forecast is l_t + 4 * b_t. The model continuously updates its slope estimate b_t, allowing it to adapt if the company's growth rate accelerates or decelerates over time.",

    "The hyperparameter beta governs the Slope Adaptability vs Inertia Trade-Off: If beta is high (such as beta = 0.50), the algorithm rapidly adjusts its estimated growth slope in response to recent monthly changes. This enables fast tracking during product launch ramp-ups, but risks mistaking a one-month sales spike for a permanent acceleration in long-term trend. If beta is low (such as beta = 0.05), the estimated slope remains highly stable, anchored to the multi-year secular trend line.",

    "Initialization of level and trend is critical for numerical accuracy in Holt's method. Standard econometric practice initializes the baseline level as l_0 = Y_1, and the initial slope b_0 as the average historical growth rate over the first few observations: b_0 = (Y_n - Y_1) / (n - 1) or b_0 = Y_2 - Y_1. Modern optimization algorithms simultaneously optimize both smoothing parameters (alpha, beta) using bounded Nelder-Mead or L-BFGS-B search to minimize out-of-sample forecast error.",

    "Just as Simple Exponential Smoothing maps to an ARIMA(0, 1, 1) process, Holt's Linear Trend Method has an exact mathematical counterpart in the ARIMA taxonomy: Holt's linear method is structurally equivalent to an ARIMA(0, 2, 2) model with restricted moving average parameters. Double differencing eliminates both the level and the linear slope, while the two moving average parameters absorb level and trend state shocks. Furthermore, when the beta parameter approaches zero, Holt's linear trend collapses into a Random Walk with Constant Drift, demonstrating the seamless parametric continuum between exponential smoothing and classical econometrics.",

    "In our production Python implementation, we build Holt's Linear Trend Engine from first principles. We simulate an expanding SaaS enterprise MRR trajectory, implement coupled recursive state updates for level and slope, generate forward multi-step trajectory projections, and demonstrate how the model tracks structural growth without lagging."
]

p2_code = """# Pure Python Holt's Linear Trend State-Space Engine
import math
import random

random.seed(42)

class HoltsLinearTrend:
    def __init__(self, alpha=0.40, beta=0.15):
        self.alpha = alpha   # Level smoothing parameter (0 < alpha < 1)
        self.beta = beta     # Trend smoothing parameter (0 < beta < 1)
        
    def fit_and_forecast(self, series, horizon=6):
        n = len(series)
        # Initialization: l_0 = Y_1, b_0 = Y_2 - Y_1
        level = series[0]
        slope = series[1] - series[0]
        
        levels = [level]
        slopes = [slope]
        in_sample_preds = [level + slope]
        
        for t in range(1, n):
            y_t = series[t]
            # State 1: Level update: l_t = alpha * Y_t + (1 - alpha) * (l_{t-1} + b_{t-1})
            prev_level = level
            prev_slope = slope
            level = self.alpha * y_t + (1.0 - self.alpha) * (prev_level + prev_slope)
            
            # State 2: Trend update: b_t = beta * (l_t - l_{t-1}) + (1 - beta) * b_{t-1}
            slope = self.beta * (level - prev_level) + (1.0 - self.beta) * prev_slope
            
            levels.append(level)
            slopes.append(slope)
            in_sample_preds.append(level + slope)
            
        # State 3: Forward Forecast: Y_hat_{t+h} = l_N + h * b_N
        out_of_sample = [level + h * slope for h in range(1, horizon + 1)]
        
        # Calculate in-sample accuracy
        errors = [series[t] - (levels[t-1] + slopes[t-1]) for t in range(1, n)]
        mae = sum(abs(e) for e in errors) / float(len(errors))
        rmse = math.sqrt(sum(e * e for e in errors) / float(len(errors)))
        
        return {
            'final_level': level,
            'final_slope': slope,
            'forecasts': out_of_sample,
            'mae': mae,
            'rmse': rmse,
            'levels': levels,
            'slopes': slopes
        }

# Generate expanding SaaS MRR series: Starts at $50k, grows by +$2.5k/month with noise
n_months = 36
true_growth = 2.5
actual_mrr = [50.0 + true_growth * t + random.gauss(0, 1.8) for t in range(n_months)]

holt = HoltsLinearTrend(alpha=0.35, beta=0.10)
results = holt.fit_and_forecast(actual_mrr, horizon=6)

print("Holt's Linear Trend Model Execution & Growth Tracking:")
print("=" * 75)
print(f"Historical Sample: N={n_months} Months | True Monthly Growth Rate: +${true_growth:.2f}k/month")
print("-" * 75)
print(f"Calibrated Final Level (l_N) : ${results['final_level']:>8.2f}k (Current Baseline Run-Rate)")
print(f"Calibrated Final Slope (b_N) : +${results['final_slope']:>7.2f}k / month (Estimated Trajectory)")
print(f"In-Sample Accuracy Metrics   : MAE = ${results['mae']:.2f}k | RMSE = ${results['rmse']:.2f}k")
print("-" * 75)
print("Forward Out-of-Sample Projections (Next 6 Months):")
print(f"{'Horizon (h)':<14} | {'Projected MRR Level':<24} | {'Monthly Incremental Drift'}")
print("-" * 75)
for h in range(6):
    print(f"Month +{h+1:<9} | ${results['forecasts'][h]:>10.2f}k             | +${results['final_slope']:.2f}k")
print("=" * 75)
print(f"Total Projected 6-Month Expansion: +${results['forecasts'][-1] - results['final_level']:.2f}k")
"""

p2_example = "A high-growth SaaS business tracks Monthly Recurring Revenue. Using Simple Exponential Smoothing produced forecasts that under-predicted actuals by $80k every month. Implementing Holt's linear trend method captured the $3.2k/month trajectory, eliminating lag and reducing error by 78%."
p2_tryIt = "Introduce a sudden growth deceleration at month 25 (growth drops from +2.5 to +0.5) and observe how Holt's slope parameter b_t dynamically adapts to the new reality."

p2_check = {
    "question": "What is the primary role of the slope equation b_t in Holt's Linear Trend Method?",
    "options": [
        "It dynamically updates the estimated rate of growth per period, allowing forward forecasts to project an upward or downward sloping linear trajectory.",
        "It divides quarterly revenue by twelve to calculate daily operating margins.",
        "It eliminates all seasonal fluctuations using Fourier transform harmonics.",
        "It calculates foreign exchange conversion rates for overseas subsidiaries."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The slope equation b_t tracks the dynamic rate of change per period, enabling the forward forecast equation l_t + h*b_t to project realistic linear growth."
}

# -------------------------------------------------------------
# Part 3: Damped Trend Filtering (Gardner-McKenzie): Preventing Long-Horizon Linear Explosion
# -------------------------------------------------------------
p3_say = [
    "While Holt's Linear Trend Method represents a major advance over flat-level smoothing, empirical forecasting history reveals that it suffers from a well-documented and dangerous failure mode: Long-Horizon Linear Explosion. In real-world business environments, empirical growth rates rarely persist indefinitely along an unbounded linear path. Companies experience market saturation, supply constraints, competitive encroachment, and diminishing marginal returns.",

    "If an executive uses Holt's linear trend method to project revenue three to five years into the future, the linear extrapolation equation Y_hat_{t+h} = l_t + h * b_t produces wildly over-optimistic projections. A company growing by ten million dollars a year today will not continue growing by ten million dollars a year in decade three. In 1985, Everette S. Gardner and Ed McKenzie formulated the brilliant econometric solution that transformed commercial forecasting: The Damped Trend Filtering Model.",

    "The Damped Trend Model introduces a Damping Parameter phi strictly bounded between zero and one: 0 < phi < 1 (typically calibrated between 0.80 and 0.98 in enterprise applications). The damping parameter acts as a temporal brake on the growth slope, forcing the projected trend to decay geometrically into the future. Instead of assuming constant slope b_t across all horizons, the model assumes that each forward period retains only a fraction phi of the previous period's growth momentum.",

    "The mathematical formulation of Gardner and McKenzie's Damped Trend System updates the three core state equations: First, Level Update: l_t = alpha * Y_t + (1 - alpha) * (l_{t-1} + phi * b_{t-1}). Second, Slope Update: b_t = beta * (l_t - l_{t-1}) + (1 - beta) * phi * b_{t-1}. Third, The Forward Forecast Equation: Y_hat_{t+h|t} = l_t + sum_{i=1}^h phi^i * b_t = l_t + (phi * (1 - phi^h) / (1 - phi)) * b_t.",

    "Inspect the mathematical beauty of the damped forecast equation: As the forecast horizon h expands toward infinity (h -> infinity), the term phi^h converges to zero (because phi < 1). Consequently, the cumulative multiplier sum_{i=1}^h phi^i converges to a finite asymptotic ceiling: phi / (1 - phi). For example, if phi = 0.90, the maximum cumulative growth multiplier is 0.90 / (1 - 0.90) = 9.0 periods of growth. Even if you forecast twenty years into the future, the projected revenue level asymptotically caps out at l_t + 9.0 * b_t, completely preventing linear explosion.",

    "The empirical superiority of damped trend filtering has been repeatedly proven in large-scale forecasting benchmarks, most famously the M-Competitions (M1, M2, M3, and M4) organized by Spyros Makridakis. Across tens of thousands of real-world business and economic time series, the Damped Trend Model consistently outperformed standard linear trend models, random walks, and complex neural networks across medium and long horizons. Today, elite enterprise ERP systems (including SAP IBP, Oracle Demantra, and Anaplan) enforce damped trend filtering as the default setting for long-term strategic capacity planning.",

    "In ARIMA equivalence theory, Gardner and McKenzie's Damped Trend Model corresponds precisely to an ARIMA(1, 1, 2) process, where the autoregressive parameter phi is identically equal to the damping factor phi. When tested in the landmark M3 and M4 Forecasting Competitions—which evaluated over one hundred thousand empirical time series across macroeconomics, finance, demographics, and corporate operations—damped trend exponential smoothing achieved the lowest overall symmetric error across medium and long horizons, consistently outperforming deep learning architectures and complex ensemble pipelines due to its robust resistance to overfitting.",

    "In our production Python implementation, we build a Damped Trend State-Space Engine from first principles. We simulate a high-growth enterprise, benchmark standard Holt's linear trend against Gardner-McKenzie damped trend across a 24-month horizon, calculate the asymptotic growth ceiling, and demonstrate how damping protects capital allocation from runaway extrapolation bias."
]

p3_code = """# Pure Python Gardner-McKenzie Damped Trend State-Space Engine
import math
import random

random.seed(42)

class DampedTrendFilter:
    def __init__(self, alpha=0.35, beta=0.10, phi=0.88):
        self.alpha = alpha   # Level smoothing parameter
        self.beta = beta     # Trend smoothing parameter
        self.phi = phi       # Damping parameter (0 < phi < 1)
        
    def fit_and_forecast(self, series, horizon=24):
        n = len(series)
        level = series[0]
        slope = series[1] - series[0]
        
        levels = [level]
        slopes = [slope]
        
        for t in range(1, n):
            y_t = series[t]
            prev_l = level
            prev_b = slope
            
            # State 1: Damped Level Update: l_t = a*Y_t + (1-a)*(l_{t-1} + phi*b_{t-1})
            level = self.alpha * y_t + (1.0 - self.alpha) * (prev_l + self.phi * prev_b)
            
            # State 2: Damped Slope Update: b_t = b*(l_t - l_{t-1}) + (1-b)*phi*b_{t-1}
            slope = self.beta * (level - prev_l) + (1.0 - self.beta) * self.phi * prev_b
            
            levels.append(level)
            slopes.append(slope)
            
        # State 3: Damped Forecast: Y_hat_{t+h} = l_N + sum_{i=1}^h (phi^i) * b_N
        # Cumulative multiplier: phi * (1 - phi^h) / (1 - phi)
        forecasts = []
        for h in range(1, horizon + 1):
            cum_phi = sum(self.phi ** i for i in range(1, h + 1))
            forecasts.append(level + cum_phi * slope)
            
        # Asymptotic saturation ceiling as h -> infinity
        asymptotic_ceiling = level + (self.phi / (1.0 - self.phi)) * slope
        
        return {
            'final_level': level,
            'final_slope': slope,
            'forecasts': forecasts,
            'asymptotic_ceiling': asymptotic_ceiling
        }

# Generate 36 months of enterprise ARR ($M)
arr_history = [20.0 + 1.8 * t + random.gauss(0, 1.2) for t in range(36)]

# Model 1: Standard Holt's Linear (phi = 1.0 -> Unbounded linear explosion)
# Model 2: Gardner-McKenzie Damped Trend (phi = 0.88 -> Realistic asymptotic decay)
damped_engine = DampedTrendFilter(alpha=0.35, beta=0.10, phi=0.88)
res_damped = damped_engine.fit_and_forecast(arr_history, horizon=24)

# Linear comparison
l_final = res_damped['final_level']
b_final = res_damped['final_slope']
fc_linear = [l_final + h * b_final for h in range(1, 25)]

print("Gardner-McKenzie Damped Trend vs Linear Holt Benchmark (24-Month Horizon):")
print("=" * 80)
print(f"Current Baseline Level: ${l_final:.2f}M | Current Monthly Velocity: +${b_final:.2f}M/month")
print(f"Damping Parameter phi : {damped_engine.phi:.2f} | Asymptotic Ceiling: ${res_damped['asymptotic_ceiling']:.2f}M")
print("-" * 80)
print(f"{'Horizon':<10} | {'Linear Forecast (Holt)':<24} | {'Damped Forecast (Gardner)':<26} | {'Variance Prevented'}")
print("-" * 80)
for m in [1, 6, 12, 18, 24]:
    lin = fc_linear[m - 1]
    dmp = res_damped['forecasts'][m - 1]
    diff = lin - dmp
    print(f"Month +{m:<3} | ${lin:>10.2f}M                | ${dmp:>12.2f}M                | +${diff:>6.2f}M Over-Forecast")
print("=" * 80)
print(f"Strategic Impact: At Month 24, linear Holt over-predicts by +${fc_linear[-1] - res_damped['forecasts'][-1]:.2f}M.")
print("Verdict: Damped trend prevents long-term capital over-commitment and facility over-building.")
"""

p3_example = "A data center operator plans 3-year GPU cluster capacity. A linear trend model projected compute demand would reach 800 megawatts, triggering a $2B capital budget. Switching to a Gardner-McKenzie damped trend model (phi = 0.91) projected demand saturating at 440 megawatts, matching actual cloud adoption and saving $900M."
p3_tryIt = "Reduce phi to 0.75 in the DampedTrendFilter and observe how the forecast flattens out into an asymptotic ceiling within 8 months."

p3_check = {
    "question": "What mathematical purpose does the damping parameter phi (0 < phi < 1) serve in Gardner-McKenzie exponential smoothing?",
    "options": [
        "It applies a geometric brake to the trend slope, forcing long-horizon forecasts to converge asymptotically to a realistic finite ceiling rather than exploding linearly.",
        "It converts monthly accounting statements into continuous daily currency trades.",
        "It forces the model's regression residuals to follow an exponential probability distribution.",
        "It doubles the model's computation time to improve cryptographic security."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Damping parameter phi < 1 forces the cumulative slope multiplier to converge to phi / (1 - phi), preventing unrealistic long-horizon linear explosion."
}

# -------------------------------------------------------------
# Part 4: Holt-Winters Seasonal Filtering: Additive vs Multiplicative Gamma Factors & Seasonal Anchors
# -------------------------------------------------------------
p4_say = [
    "Having integrated level tracking, slope dynamics, and damped trend braking, we now incorporate the fourth and final dimension of temporal reality: Seasonality. In 1960, Peter R. Winters completed Holt's architectural vision by formulating the celebrated Holt-Winters Triple Exponential Smoothing Model. By maintaining three coupled recursive state vectors—Level (l_t), Trend (b_t), and Seasonal Factors (s_t)—Holt-Winters creates a comprehensive, adaptive forecasting machine capable of tracking multi-year trends and complex calendar seasonality simultaneously.",

    "The Holt-Winters architecture is split into two distinct physical variants based on the nature of seasonal fluctuations: The Additive Holt-Winters Model and The Multiplicative Holt-Winters Model: In Additive Holt-Winters, the seasonal fluctuations are expressed in absolute currency or volume units (such as 'plus five thousand units in Q4'), maintaining constant absolute amplitude regardless of the baseline trend. In Multiplicative Holt-Winters, seasonal factors are expressed as dimensionless percentage multipliers centered around 1.0 (such as 1.30 for a thirty percent December surge), expanding proportionally as enterprise volume grows.",

    "The state equations for Multiplicative Holt-Winters govern three smoothing hyperparameters: alpha (level), beta (trend), and gamma (seasonality), all bounded between zero and one: First, Level Equation: l_t = alpha * (Y_t / s_{t-m}) + (1 - alpha) * (l_{t-1} + b_{t-1}). Notice that the raw observation Y_t is deseasonalized by dividing by the seasonal factor from one full cycle ago s_{t-m}. Second, Trend Equation: b_t = beta * (l_t - l_{t-1}) + (1 - beta) * b_{t-1}. Third, Seasonal Factor Update: s_t = gamma * (Y_t / l_t) + (1 - gamma) * s_{t-m}. The newly updated seasonal multiplier s_t is a weighted average of the newly realized ratio (Y_t / l_t) and the historical seasonal factor from m periods ago.",

    "The Forward Forecast Equation for Multiplicative Holt-Winters across horizon h is formulated as: Y_hat_{t+h|t} = (l_t + h * b_t) * s_{t+h-m*(k+1)}, where k is the integer quotient of (h - 1) / m, ensuring that the forecast selects the appropriate historical seasonal anchor from the circular calendar buffer. Notice the powerful synergy: the linear trend term (l_t + h * b_t) projects the forward secular growth, while the seasonal factor s_{t+h-m} scales the projection to account for predictable calendar surges and dips.",

    "The seasonal smoothing hyperparameter gamma dictates the Adaptation Rate of Calendar Patterns: If gamma is low (such as gamma = 0.05), the seasonal indices remain rock-solid, requiring decades of empirical shifts to alter the company's December holiday multiplier. If gamma is high (such as gamma = 0.40), the model rapidly adapts to evolving consumer behaviors—such as Black Friday shopping shifting earlier into November or summer holiday timing migrating due to school calendar reforms.",

    "Initialization of the circular seasonal vector s_1 through s_m is essential for numerical stability. Standard practice computes average seasonal indices across the first two to three complete annual cycles of historical data, normalizing them so that their arithmetic mean is identically equal to 1.000 in multiplicative systems (or summing to zero in additive systems). Without proper normalization, initial seasonal factors can drift, injecting artificial trend bias into the baseline level equation.",

    "In long-range strategic operations, analysts frequently combine Holt-Winters seasonality with trend damping, producing the Damped Holt-Winters Model. In this unified architecture, while the trend slope decays toward an asymptotic ceiling, the seasonal multipliers continue to oscillate symmetrically across each recurring annual cycle. Furthermore, operations teams enforce Seasonal Multiplier Normalization Guards: after updating all m seasonal factors, the pipeline rescales the vector so that sum s_i = m. This invariant prevents numerical drift from artificially distorting long-term baseline capacity plans.",

    "In our production Python implementation, we build a Multiplicative Holt-Winters Triple Smoothing Engine from first principles. We track level, trend, and a 12-month circular seasonal buffer, execute coupled state updates, and generate forward 12-month forecasts that project both secular growth and rhythmic holiday surges."
]

p4_code = """# Pure Python Multiplicative Holt-Winters Triple Exponential Smoothing Engine
import math
import random

random.seed(42)

class HoltWintersMultiplicative:
    def __init__(self, m=12, alpha=0.30, beta=0.10, gamma=0.20):
        self.m = m           # Seasonal periodicity (12 for monthly, 4 for quarterly)
        self.alpha = alpha   # Level parameter
        self.beta = beta     # Trend parameter
        self.gamma = gamma   # Seasonal parameter
        
    def initialize_states(self, series):
        # Requires at least 2 full seasonal cycles for initialization
        n_init = 2 * self.m
        # Level: Average of first cycle
        level = sum(series[:self.m]) / float(self.m)
        # Trend: Average growth per period across first two cycles
        slope = (sum(series[self.m:n_init]) - sum(series[:self.m])) / float(self.m ** 2)
        
        # Initial Seasonal Factors: Ratio of actual to cycle-adjusted baseline
        seasonals = []
        for i in range(self.m):
            avg_val = (series[i] + series[i + self.m]) / 2.0
            seasonals.append(avg_val / level)
            
        # Normalize initial seasonals so mean is exactly 1.000
        mean_s = sum(seasonals) / float(self.m)
        seasonals = [s / mean_s for s in seasonals]
        return level, slope, seasonals
        
    def fit_and_forecast(self, series, horizon=12):
        n = len(series)
        level, slope, seasonals = self.initialize_states(series)
        
        # Buffer to store historical states
        levels = [level]
        slopes = [slope]
        # Circular seasonal buffer
        seasonal_buffer = list(seasonals)
        
        for t in range(n):
            y_t = series[t]
            s_prev = seasonal_buffer[t % self.m] # Factor from m periods ago
            
            prev_l = level
            prev_b = slope
            
            # State 1: Level Update (Deseasonalized actuals: Y_t / s_{t-m})
            level = self.alpha * (y_t / max(1e-6, s_prev)) + (1.0 - self.alpha) * (prev_l + prev_b)
            
            # State 2: Trend Update
            slope = self.beta * (level - prev_l) + (1.0 - self.beta) * prev_b
            
            # State 3: Seasonal Factor Update (Ratio: Y_t / l_t)
            s_new = self.gamma * (y_t / max(1e-6, level)) + (1.0 - self.gamma) * s_prev
            seasonal_buffer[t % self.m] = s_new
            
            levels.append(level)
            slopes.append(slope)
            
        # Forward Forecast: Y_hat_{t+h} = (l_N + h * b_N) * s_{t+h-m}
        forecasts = []
        for h in range(1, horizon + 1):
            s_idx = (n + h - 1) % self.m
            s_factor = seasonal_buffer[s_idx]
            fc_val = (level + h * slope) * s_factor
            forecasts.append(fc_val)
            
        return {
            'final_level': level,
            'final_slope': slope,
            'seasonal_factors': seasonal_buffer,
            'forecasts': forecasts
        }

# Generate 4 years (48 months) of seasonal enterprise revenue
# Trend: +$1.5k/month | Seasonality: Q4 peak (1.25x), Q1 lull (0.88x)
true_seasonals = [0.90, 0.88, 0.95, 1.00, 1.02, 0.98, 0.88, 0.85, 1.05, 1.10, 1.18, 1.25]
actual_rev = []
for t in range(48):
    baseline = 100.0 + 1.5 * t
    s_mult = true_seasonals[t % 12]
    actual_rev.append(baseline * s_mult + random.gauss(0, 2.0))

hw = HoltWintersMultiplicative(m=12, alpha=0.30, beta=0.10, gamma=0.20)
results = hw.fit_and_forecast(actual_rev, horizon=12)

print("Multiplicative Holt-Winters Triple Smoothing Engine Execution:")
print("=" * 80)
print(f"Historical Sample   : N=48 Months (4 Years) | Periodic Cycle: m=12 Months")
print(f"Calibrated State    : Level = ${results['final_level']:.2f}k | Trend Velocity = +${results['final_slope']:.2f}k/month")
print("-" * 80)
print("Forward 12-Month Out-of-Sample Projections (Year 5):")
print(f"{'Month':<10} | {'Baseline Trend':<16} | {'Seasonal Multiplier':<20} | {'Final Forecast'}")
print("-" * 80)
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
for h in range(12):
    base = results['final_level'] + (h + 1) * results['final_slope']
    s_fac = results['seasonal_factors'][h]
    proj = results['forecasts'][h]
    print(f"M{h+1:<2} ({months[h]})  | ${base:>10.2f}k     | {s_fac:>12.3f}x         | ${proj:>10.2f}k")
print("=" * 80)
print(f"Peak Revenue Projected: ${max(results['forecasts']):.2f}k (December Holiday Surge)")
"""

p4_example = "A retail department store uses Multiplicative Holt-Winters to forecast quarterly inventory. The algorithm captures a steady $2M quarterly secular baseline growth while automatically multiplying Q4 forecasts by 1.45x, ensuring adequate holiday stocking without excess post-holiday liquidation."
p4_tryIt = "Modify gamma to 0.60 in the Holt-Winters engine and observe how rapidly the seasonal factors adapt when customer purchase patterns shift."

p4_check = {
    "question": "What is the primary operational distinction between Additive and Multiplicative Holt-Winters models?",
    "options": [
        "Additive models assume seasonal variations have fixed absolute magnitude, whereas multiplicative models assume seasonal swings expand proportionally as business volume grows.",
        "Additive models only work on positive numbers, whereas multiplicative models only work on negative numbers.",
        "Multiplicative models eliminate the need for level and trend smoothing parameters.",
        "Additive models require neural network accelerators, whereas multiplicative models run on microcontrollers."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Multiplicative Holt-Winters scales seasonal amplitude proportionally with baseline growth, capturing the real-world expansion of holiday swings in growing firms."
}

# -------------------------------------------------------------
# Part 5: State-Space Innovations (ETS Models): Automated Error-Trend-Seasonal Model Selection
# -------------------------------------------------------------
p5_say = [
    "To conclude Day Twenty and synthesize the entire spectrum of exponential smoothing algorithms mastered in Block Four, we explore the modern statistical formulation that unifies all smoothing methods into a rigorous probabilistic foundation: Innovations State-Space Models, universally designated as ETS Models (Error, Trend, Seasonal). Formulated by Rob J. Hyndman, Anne Koehler, Ralph Snyder, and Simone Grose in 2002, the ETS taxonomic framework transformed exponential smoothing from a collection of ad-hoc heuristic formulas into a complete statistical theory with exact likelihood functions and analytical prediction intervals.",

    "The ETS classification framework categorizes every exponential smoothing model as a three-character code ETS(E, T, S), where: First, E represents the Error Type, which can be Additive (A) or Multiplicative (M). Second, T represents the Trend Type, which can be None (N), Additive (A), Additive Damped (Ad), Multiplicative (M), or Multiplicative Damped (Md). Third, S represents the Seasonal Type, which can be None (N), Additive (A), or Multiplicative (M).",

    "This systematic taxonomy generates Thirty Distinct Model Configurations across the ETS matrix: For instance, ETS(A, N, N) is Simple Exponential Smoothing with additive errors. ETS(A, A, N) is Holt's Linear Trend method with additive errors. ETS(A, Ad, N) is the Gardner-McKenzie Damped Trend model. ETS(M, A, M) is Multiplicative Holt-Winters with multiplicative error innovations. By formalizing smoothing models as state-space equations with a single source of innovation (the contemporary error epsilon_t), econometricians derive exact Gaussian likelihoods, enabling automated model selection via AIC and BIC.",

    "The operational power of the ETS framework is realized through Automated ETS Model Selection Algorithms, famously embedded in Hyndman's `ets()` function in R and modern enterprise time series libraries. The automated algorithm systematically fits candidate ETS specifications across the matrix, optimizes smoothing parameters (alpha, beta, gamma, phi) via maximum likelihood, prunes numerically unstable combinations (such as models with multiplicative trends and additive seasonality that can produce arithmetic overflow), and selects the champion model based on the Corrected Akaike Information Criterion (AICc).",

    "Furthermore, institutional financial governance demands that forecasting systems generate rigorous Prediction Intervals alongside point forecasts. Because ETS models possess an exact probabilistic state-space formulation, the algorithm mathematically derives the Analytical Conditional Variance of Forecast Errors for any future horizon h: Var(Y_{t+h|t}) = sigma^2 * sum_{j=1}^h c_j^2, where c_j are coefficients derived from state transition matrices. This allows the enterprise decision intelligence operating system to present leadership with Eighty Percent and Ninety-Five Percent Prediction Intervals, quantifying operational upside and downside risk with mathematical precision.",

    "The ETS classification framework represents the culmination of a half-century of forecasting science, synthesized in the foundational work of Rob J. Hyndman and George Athanasopoulos. By combining point forecasts, prediction intervals, likelihood metrics, and automatic state-space model selection into a cohesive pipeline, decision intelligence engineers empower modern enterprises to operate autonomously at global scale. Having conquered time series decomposition, stationarity, unit roots, ARIMA, SARIMA, forecast accuracy metrics, and ETS state-space systems, you have established sovereign quantitative fluency over temporal business intelligence.",

    "As you conclude Day Twenty, celebrate reaching the one-third milestone of Course Twenty-Four. Over the past five days, you have mastered the complete classical and modern time series stack: secular decomposition, stationarity diagnostics, Augmented Dickey-Fuller unit root tests, autoregressive persistence, moving average invertibility, ACF/PACF Box-Jenkins identification, ARIMA/SARIMA formulations, information criteria model selection, and Holt-Winters ETS state-space systems. You now possess the econometric firepower to model any temporal financial or operational dynamic across the enterprise.",

    "In our production Python capstone, we implement the complete Automated ETS Model Selection Engine. We fit competing ETS specifications to real-world corporate time series, evaluate AICc scores, extract calibrated state parameters, generate forward forecasts with 95% analytical prediction intervals, and output an audited Executive Forecasting Briefing."
]

p5_code = """# Production Automated ETS State-Space Engine & Prediction Interval Simulator
import math
import statistics
import random

random.seed(42)

class AutomatedETSEngine:
    def __init__(self, series, seasonality=12):
        self.series = series
        self.n = len(series)
        self.m = seasonality
        
    def evaluate_ets_ann(self, alpha=0.30):
        # ETS(A, N, N): Simple Exponential Smoothing with Additive Errors
        level = self.series[0]
        residuals = []
        for y in self.series:
            e = y - level
            residuals.append(e)
            level = alpha * y + (1.0 - alpha) * level
            
        sse = sum(e * e for e in residuals)
        k = 1 # Parameters: alpha
        sigma_sq = sse / float(self.n)
        log_lik = -0.5 * self.n * (math.log(2.0 * math.pi) + 1.0 + math.log(max(1e-12, sigma_sq)))
        aicc = 2.0 * k - 2.0 * log_lik + (2.0 * k * (k + 1.0)) / max(1, self.n - k - 1)
        
        return {'model': 'ETS(A, N, N) [SES]', 'aicc': aicc, 'sse': sse, 'final_level': level, 'sigma': math.sqrt(sigma_sq)}
        
    def evaluate_ets_aan(self, alpha=0.35, beta=0.10):
        # ETS(A, A, N): Holt's Linear Trend with Additive Errors
        level = self.series[0]
        slope = self.series[1] - self.series[0]
        residuals = []
        
        for t in range(1, self.n):
            y = self.series[t]
            pred = level + slope
            e = y - pred
            residuals.append(e)
            prev_l, prev_b = level, slope
            level = alpha * y + (1.0 - alpha) * (prev_l + prev_b)
            slope = beta * (level - prev_l) + (1.0 - beta) * prev_b
            
        sse = sum(e * e for e in residuals)
        k = 2 # Parameters: alpha, beta
        m_pts = len(residuals)
        sigma_sq = sse / float(m_pts)
        log_lik = -0.5 * m_pts * (math.log(2.0 * math.pi) + 1.0 + math.log(max(1e-12, sigma_sq)))
        aicc = 2.0 * k - 2.0 * log_lik + (2.0 * k * (k + 1.0)) / max(1, m_pts - k - 1)
        
        return {'model': 'ETS(A, A, N) [Holt]', 'aicc': aicc, 'sse': sse, 'final_level': level, 'final_slope': slope, 'sigma': math.sqrt(sigma_sq)}

    def generate_forward_intervals(self, best_res, horizon=6):
        # 95% Confidence Interval: +/- 1.96 * sigma * sqrt(h)
        forecasts = []
        l = best_res['final_level']
        b = best_res.get('final_slope', 0.0)
        sigma = best_res['sigma']
        
        for h in range(1, horizon + 1):
            point = l + h * b
            # Variance expands with horizon
            se_h = sigma * math.sqrt(h)
            lower_95 = point - 1.96 * se_h
            upper_95 = point + 1.96 * se_h
            forecasts.append({'h': h, 'point': point, 'lower_95': lower_95, 'upper_95': upper_95})
            
        return forecasts

# Synthesize expanding corporate revenue stream
data_stream = [50.0]
for _ in range(47):
    data_stream.append(data_stream[-1] + 1.8 + random.gauss(0, 1.5))

engine = AutomatedETSEngine(data_stream)
res_ann = engine.evaluate_ets_ann()
res_aan = engine.evaluate_ets_aan()

leaderboard = [res_ann, res_aan]
leaderboard.sort(key=lambda x: x['aicc'])
champ = leaderboard[0]
forward_bands = engine.generate_forward_intervals(champ, horizon=6)

print("=" * 80)
print(f"  PINIT CAREER OS - AUTOMATED ETS STATE-SPACE SELECTION & RISK BANDS")
print(f"  Series Length: N={len(data_stream)} Months | Optimization Objective: Min AICc")
print("=" * 80)
print(f"{'Rank':<6} | {'ETS Model Architecture':<26} | {'SSE':<12} | {'AICc':<10} | {'Selection Status'}")
print("-" * 80)
for r, m in enumerate(leaderboard):
    status = "CHAMPION [Optimal]" if r == 0 else "Runner-Up"
    print(f"#{r+1:<5} | {m['model']:<26} | {m['sse']:>10.1f} | {m['aicc']:>8.1f} | {status}")
print("-" * 80)
print(f"SELECTED CHAMPION: {champ['model']} (AICc = {champ['aicc']:.1f})")
print(f"Innovation Volatility (sigma) : ${champ['sigma']:.2f}k per period")
print("=" * 80)
print("Forward 6-Month Risk Horizon (Point Forecast & 95% Prediction Bounds):")
print(f"{'Horizon (h)':<14} | {'Lower 95% Bound':<18} | {'Point Forecast':<18} | {'Upper 95% Bound'}")
print("-" * 80)
for f in forward_bands:
    print(f"Month t+{f['h']:<8} | ${f['lower_95']:>10.2f}k        | ${f['point']:>10.2f}k        | ${f['upper_95']:>10.2f}k")
print("=" * 80)
print("GOVERNANCE VERDICT: State-space model selected; risk intervals certified for board capital review.")
print("=" * 80)
"""

p5_example = "A Chief Financial Officer presents a 6-month revenue projection to the Board of Directors using an automated ETS(A, A, N) model. Alongside the point estimate of $120M, the report provides certified 95% bounds of [$114M, $126M], giving the board complete visibility into treasury liquidity reserves."
p5_tryIt = "Introduce a heavy noise spike in data_stream and verify how the innovation volatility sigma expands, automatically widening the forward 95% prediction bands."

p5_check = {
    "question": "What is the primary role of the three-character ETS(E, T, S) taxonomy in modern time series econometrics?",
    "options": [
        "To classify exponential smoothing models across Error, Trend, and Seasonal dimensions into a unified state-space framework with exact likelihood functions.",
        "To compress SQL database tables into encrypted zip files.",
        "To calculate employee performance ratings based on sales targets.",
        "To convert annual corporate budgets into monthly cryptocurrency trades."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The ETS(E, T, S) framework unifies 30 distinct exponential smoothing configurations across Error, Trend, and Seasonal components, providing exact likelihoods for automated model selection."
}

DAY_DATA = {
    "day": 20,
    "month": 1,
    "title": "Exponential Smoothing & Holt-Winters State-Space Systems: Level, Trend & Seasonal Filtering",
    "goal": "Master Simple Exponential Smoothing (SES), Holt's Linear Trend tracking, Gardner-McKenzie damped trend filtering, Holt-Winters additive vs multiplicative seasonal buffers, and automated ETS state-space model selection.",
    "recap": "Yesterday we mastered forecast evaluation loss functions (MAE vs RMSE), scale-free SMAPE and MASE benchmarks, Ljung-Box residual white noise testing, and walk-forward cross-validation.",
    "minutes": 60,
    "parts": [
        {"title": "Simple Exponential Smoothing (SES): Memory Decay, Alpha Damping & Recursive State Updates", "say": p1_say, "example": p1_example, "code": p1_code, "tryIt": p1_tryIt, "check": p1_check},
        {"title": "Holt's Linear Trend Method: Level Equations, Slope Tracking & Beta Trend Hyperparameters", "say": p2_say, "example": p2_example, "code": p2_code, "tryIt": p2_tryIt, "check": p2_check},
        {"title": "Damped Trend Filtering (Gardner-McKenzie): Preventing Long-Horizon Linear Explosion", "say": p3_say, "example": p3_example, "code": p3_code, "tryIt": p3_tryIt, "check": p3_check},
        {"title": "Holt-Winters Seasonal Filtering: Additive vs Multiplicative Gamma Factors & Seasonal Anchors", "say": p4_say, "example": p4_example, "code": p4_code, "tryIt": p4_tryIt, "check": p4_check},
        {"title": "State-Space Innovations (ETS Models): Automated Error-Trend-Seasonal Model Selection", "say": p5_say, "example": p5_example, "code": p5_code, "tryIt": p5_tryIt, "check": p5_check}
    ]
}
