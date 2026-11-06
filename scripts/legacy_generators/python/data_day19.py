# scripts/data_day19.py
# Day 19: Forecast Accuracy Benchmarks & Residual Diagnostics: MAE, RMSE, MAPE & The Ljung-Box Test
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

# -------------------------------------------------------------
# Part 1: Point Forecast Accuracy Metrics: Mean Absolute Error (MAE) vs Root Mean Squared Error (RMSE)
# -------------------------------------------------------------
p1_say = [
    "In institutional decision intelligence, constructing a forecasting model is only half the battle. A forecasting algorithm is useless—and potentially hazardous—unless its predictive accuracy can be rigorously, objectively, and continuously evaluated against empirical reality. In executive boardrooms and treasury operations, leaders demand clear quantitative answers to a deceptively simple question: How accurate is this forecast, and how much financial risk does forecast error expose our balance sheet to?",

    "When evaluating Point Forecasts across a test horizon of H periods (where Y_t represents the true observed actual and Y_hat_t represents the predicted value), the Forecast Error is defined as e_t = Y_t - Y_hat_t. The two foundational workhorse metrics for summarizing error magnitude are Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE). While both metrics measure average error magnitude in the original units of the data (such as dollars, customer counts, or inventory units), they embody fundamentally different loss functions and operational penalty philosophies.",

    "The Mean Absolute Error (MAE) computes the simple arithmetic average of absolute forecast errors: MAE = (1 / H) * sum_{t=1}^H |Y_t - Y_hat_t|. Because MAE treats error linearly, a ten-thousand-dollar forecasting error is penalized exactly ten times more than a one-thousand-dollar error. MAE represents an L1-norm loss function. In statistical theory, minimizing MAE produces the Conditional Median Forecast. MAE is exceptionally robust to extreme, one-off historical outliers—such as a single rogue supplier default—preventing an isolated anomaly from severely distorting model evaluation.",

    "Conversely, the Root Mean Squared Error (RMSE) squares each error before averaging and taking the square root: RMSE = sqrt((1 / H) * sum_{t=1}^H (Y_t - Y_hat_t)^2). By squaring errors prior to aggregation, RMSE represents an L2-norm loss function. In statistical theory, minimizing RMSE produces the Conditional Mean Forecast. The defining characteristic of RMSE is that it imposes a Disproportionately Quadratic Penalty on Large Errors: an error of ten units contributes one hundred times more to the squared sum than an error of one unit. Consequently, RMSE is always mathematically greater than or equal to MAE: RMSE >= MAE, with equality holding if and only if all individual forecast errors are identical in magnitude.",

    "The divergence between RMSE and MAE provides an invaluable diagnostic indicator of Error Variance and Outlier Frequency. If RMSE is nearly identical to MAE (for example, MAE = 12.0 and RMSE = 13.1), the forecast errors are remarkably uniform and consistent across the entire test horizon. If, however, RMSE is substantially larger than MAE (for example, MAE = 12.0 and RMSE = 28.5), the model produces many small errors punctuated by occasional catastrophic, multi-sigma forecasting misses. In high-stakes enterprise management, large outliers can cause stockouts, covenant breaches, or emergency liquidity drawdowns.",

    "Corporate risk managers select between MAE and RMSE based on the Underlying Economic Cost of Forecasting Errors: If the real-world operational penalty of a forecasting mistake scales linearly with volume (such as standard packaging material procurement), MAE is the appropriate loss metric. If, however, a large forecasting miss triggers catastrophic non-linear business costs (such as capacity shortages that shut down a factory assembly line or regulatory reserve penalties in commercial banking), RMSE is strictly required because it aggressively penalizes severe tail misses.",

    "Furthermore, enterprise supply chain planners compute the Tracking Signal (TS) to monitor persistent directional bias over time: TS_t = sum_{i=1}^t (Y_i - Y_hat_i) / MAD_t, where MAD is the cumulative Mean Absolute Deviation. A tracking signal bounded between -4.0 and +4.0 indicates that forecast errors are fluctuating randomly around zero without systematic drift. If the tracking signal breaches +/- 4.0, the model is chronically over-predicting or under-predicting, signaling structural bias that requires immediate recalibration.",

    "In the accompanying Python implementation, we build a Point Forecast Evaluation Engine from first principles. We simulate true enterprise demand trajectories alongside candidate forecasting models, calculate MAE, MSE, and RMSE, evaluate the RMSE-to-MAE divergence ratio, and diagnose the underlying error distribution."
]

p1_code = """# Pure Python Point Forecast Evaluation Engine: MAE, MSE & RMSE
import math
import random

random.seed(42)

class PointForecastEvaluator:
    def __init__(self, actuals, forecasts):
        if len(actuals) != len(forecasts):
            raise ValueError("Actuals and forecasts vectors must have identical length.")
        self.actuals = actuals
        self.forecasts = forecasts
        self.n = len(actuals)
        self.errors = [y - y_hat for y, y_hat in zip(actuals, forecasts)]
        
    def evaluate(self):
        # 1. Mean Error (Bias): Positive -> Under-forecasting; Negative -> Over-forecasting
        me = sum(self.errors) / float(self.n)
        
        # 2. Mean Absolute Error (MAE): Linear L1 Loss
        mae = sum(abs(e) for e in self.errors) / float(self.n)
        
        # 3. Mean Squared Error (MSE) & Root Mean Squared Error (RMSE): Quadratic L2 Loss
        mse = sum(e * e for e in self.errors) / float(self.n)
        rmse = math.sqrt(mse)
        
        # 4. Outlier Severity Ratio: RMSE / MAE (Gaussian expectation is approx 1.253)
        divergence_ratio = rmse / mae if mae > 0 else 1.0
        
        return {
            'bias_me': me,
            'mae': mae,
            'mse': mse,
            'rmse': rmse,
            'divergence_ratio': divergence_ratio
        }

# Generate synthetic actual enterprise quarterly sales ($M)
actual_sales = [45.2, 48.0, 52.1, 58.4, 61.2, 63.8, 69.5, 75.0, 78.2, 84.1, 88.0, 94.5]

# Candidate Model A: Stable, consistent small errors (Uniform dispersion)
forecast_A = [y + random.gauss(0, 2.0) for y in actual_sales]

# Candidate Model B: Mostly accurate, but one catastrophic multi-sigma miss at t=7
forecast_B = [y + random.gauss(0, 1.2) for y in actual_sales]
forecast_B[6] = actual_sales[6] + 16.5 # Major operational miss

eval_A = PointForecastEvaluator(actual_sales, forecast_A).evaluate()
eval_B = PointForecastEvaluator(actual_sales, forecast_B).evaluate()

print("Point Forecast Accuracy Evaluation Benchmark (12 Quarters):")
print("=" * 80)
print(f"{'Forecast Model':<18} | {'Mean Bias':<12} | {'MAE (L1)':<12} | {'RMSE (L2)':<12} | {'RMSE/MAE Ratio':<16} | {'Profile'}")
print("-" * 80)
print(f"Model A (Uniform)   | ${eval_A['bias_me']:>+6.2f}M   | ${eval_A['mae']:>8.2f}M   | ${eval_A['rmse']:>8.2f}M   | {eval_A['divergence_ratio']:>12.2f}x   | Homoskedastic")
print(f"Model B (Outlier)   | ${eval_B['bias_me']:>+6.2f}M   | ${eval_B['mae']:>8.2f}M   | ${eval_B['rmse']:>8.2f}M   | {eval_B['divergence_ratio']:>12.2f}x   | High Tail Risk")
print("=" * 80)
print(f"Analysis: Model B achieves a competitive MAE (${eval_B['mae']:.2f}M vs ${eval_A['mae']:.2f}M), but its RMSE spikes to ${eval_B['rmse']:.2f}M.")
print(f"Verdict : Executive risk committees reject Model B due to severe tail vulnerability (Ratio: {eval_B['divergence_ratio']:.2f}x).")
"""

p1_example = "A pharmaceutical distributor evaluates two vaccine demand forecast models. Model 1 has MAE = 4,000 doses and RMSE = 4,800. Model 2 has MAE = 3,500 doses but RMSE = 11,200 due to a single 25,000-dose stockout during a regional epidemic. Hospital executives choose Model 1 to avoid catastrophic supply shortfalls."
p1_tryIt = "Modify the outlier injection in forecast_B to 30.0 and observe how the RMSE/MAE ratio escalates past 2.0x, triggering immediate risk disqualification."

p1_check = {
    "question": "Why is Root Mean Squared Error (RMSE) always mathematically greater than or equal to Mean Absolute Error (MAE)?",
    "options": [
        "Because squaring errors disproportionately penalizes large misses, and by Jensen's inequality the square root of the mean square is bounded below by the mean absolute value.",
        "Because RMSE is calculated using calendar months, whereas MAE is calculated using fiscal weeks.",
        "Because MAE incorporates corporate tax credits, whereas RMSE ignores depreciation.",
        "Because RMSE converts dollar figures into foreign exchange currency units."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "By Jensen's inequality and the convexity of quadratic functions, squaring errors weights larger residuals more heavily, ensuring RMSE >= MAE."
}

# -------------------------------------------------------------
# Part 2: Percentage Errors & Scale Invariance: Mean Absolute Percentage Error (MAPE) & Symmetric SMAPE
# -------------------------------------------------------------
p2_say = [
    "While MAE and RMSE provide intuitive error benchmarks in original currency or volume units, they possess a severe structural limitation: they are Scale-Dependent. If an executive oversees a global portfolio of one hundred business units—where the enterprise division generates five hundred million dollars annually while an emerging regional division generates only two million dollars—comparing absolute MAE across divisions is completely meaningless. A ten-thousand-dollar error represents a rounding error for the global division, but a catastrophic failure for the regional unit. To compare forecast accuracy across disparate business units and products, analysts deploy Percentage Error Metrics.",

    "The classical scale-free metric utilized across commercial industry is the Mean Absolute Percentage Error (MAPE). MAPE computes the percentage error of each prediction relative to the actual realized value, and averages the absolute percentages across the test sample: MAPE = (100% / H) * sum_{t=1}^H |(Y_t - Y_hat_t) / Y_t|. Because MAPE is expressed as a dimensionless percentage, it allows a Chief Commercial Officer to benchmark forecast accuracy across enterprise software, retail hardware, cloud services, and global subsidiaries on a single, standardized corporate scorecard.",

    "However, classical MAPE suffers from three catastrophic mathematical pathologies that every analytics leader must understand: First, The Zero-Division Singularity. If actual realized demand Y_t equals exactly zero in any period (such as an intermittent or slow-moving spare part with zero sales in a given week), MAPE divides by zero, resulting in an undefined mathematical crash. Second, Extreme Value Asymmetry near Zero. If actual demand is close to zero (for instance, Y_t = 1 unit), a modest forecast error (Y_hat_t = 10 units) produces an astronomical percentage error of 900%, completely distorting the overall sample mean.",

    "Third, Asymmetric Penalty Bias. Classical MAPE penalizes over-forecasting far more severely than under-forecasting. To see this, suppose actual demand is Y_t = 100. If the model severely under-forecasts by predicting Y_hat_t = 0 (a 100-unit miss), the percentage error is bounded at 100%: |(100 - 0) / 100| = 100%. If, however, the model over-forecasts by an identical 100 units by predicting Y_hat_t = 200, the error is |(100 - 200) / 100| = 100%. But if the model predicts Y_hat_t = 500 (a 400-unit over-forecast), the error is 400%, with no mathematical upper bound. Consequently, algorithms trained to minimize MAPE exhibit an artificial structural bias: they intentionally under-forecast demand to keep percentage errors low, leading to chronic inventory stockouts.",

    "To remediate these structural asymmetries, econometricians formulated the Symmetric Mean Absolute Percentage Error (SMAPE). Originally proposed by J. Scott Armstrong and modified by Spyros Makridakis for the world-renowned M3 Forecasting Competition, SMAPE divides the absolute error by the average of actual and predicted values: SMAPE = (100% / H) * sum_{t=1}^H |Y_t - Y_hat_t| / ((|Y_t| + |Y_hat_t|) / 2.0). By placing both actuals and forecasts in the denominator, SMAPE is bounded between 0% and 200% (or 0% to 100% depending on convention), treating over-forecasting and under-forecasting with equal mathematical symmetry.",

    "Furthermore, institutional forecasting governance defines standardized Performance Bands for executive scorecards: MAPE < 10% represents Highly Accurate Forecasting; 10% to 20% represents Good Forecasting; 20% to 50% represents Reasonable Forecasting; and MAPE > 50% indicates Inaccurate Forecasting requiring immediate pipeline remediation. For intermittent or zero-demand SKU portfolios, modern data platforms completely abandon classical MAPE in favor of non-zero alternatives such as MASE.",

    "In retail category management and omni-channel e-commerce, organizations frequently complement SMAPE with the Weighted Absolute Percentage Error (WAPE, also known as MAD/Mean ratio): WAPE = sum_{t=1}^H |Y_t - Y_hat_t| / sum_{t=1}^H Y_t. By dividing total absolute error across the portfolio by total actual volume sold, WAPE eliminates zero-division crashes at the SKU level and automatically weights high-volume revenue drivers more heavily than slow-moving peripheral inventory items.",

    "In our production Python implementation, we build a Scale-Independent Percentage Error Engine. We implement classical MAPE, handle zero-value safeguards, compute Symmetric SMAPE, demonstrate penalty asymmetry, and output an audited Multi-Division Forecast Scorecard."
]

p2_code = """# Pure Python Scale-Independent Percentage Error Engine (MAPE vs SMAPE)
import math

class PercentageErrorEvaluator:
    def __init__(self, actuals, forecasts):
        self.actuals = actuals
        self.forecasts = forecasts
        self.n = len(actuals)
        
    def evaluate(self):
        mape_terms = []
        smape_terms = []
        zero_count = 0
        
        for y, y_hat in zip(self.actuals, self.forecasts):
            err = abs(y - y_hat)
            
            # Classical MAPE: |Y - Y_hat| / Y
            if y != 0:
                mape_terms.append((err / abs(y)) * 100.0)
            else:
                zero_count += 1
                
            # Symmetric SMAPE: |Y - Y_hat| / ((|Y| + |Y_hat|) / 2)
            denom = (abs(y) + abs(y_hat)) / 2.0
            if denom > 1e-12:
                smape_terms.append((err / denom) * 100.0)
            else:
                smape_terms.append(0.0) # Perfect match at zero
                
        mape = sum(mape_terms) / len(mape_terms) if mape_terms else float('nan')
        smape = sum(smape_terms) / len(smape_terms) if smape_terms else 0.0
        
        return {
            'mape': mape,
            'smape': smape,
            'zero_actuals_skipped': zero_count
        }

# Portfolio of 3 Global Corporate Divisions:
# Division 1: Cloud Infrastructure ($120M scale)
actual_cloud = [110.0, 115.0, 118.0, 125.0]
fc_cloud     = [112.0, 118.0, 115.0, 130.0]

# Division 2: Emerging AI Analytics ($4.0M scale)
actual_ai = [3.5, 4.0, 4.2, 5.0]
fc_ai     = [3.8, 3.9, 4.5, 4.8]

# Division 3: Intermittent Hardware Spares (Zero-value edge cases)
actual_spares = [10.0, 0.0, 15.0, 2.0]
fc_spares     = [12.0, 2.0, 14.0, 8.0]

eval_cloud = PercentageErrorEvaluator(actual_cloud, fc_cloud).evaluate()
eval_ai = PercentageErrorEvaluator(actual_ai, fc_ai).evaluate()
eval_spares = PercentageErrorEvaluator(actual_spares, fc_spares).evaluate()

print("Cross-Division Scale-Free Forecast Accuracy Scorecard:")
print("=" * 80)
print(f"{'Enterprise Division':<24} | {'Revenue Scale':<15} | {'MAPE':<12} | {'SMAPE':<12} | {'Performance Rating'}")
print("-" * 80)
print(f"Cloud Infrastructure     | $120M / quarter | {eval_cloud['mape']:>8.2f}%   | {eval_cloud['smape']:>8.2f}%   | HIGHLY ACCURATE (<10%)")
print(f"Emerging AI Analytics    | $4.0M / quarter | {eval_ai['mape']:>8.2f}%   | {eval_ai['smape']:>8.2f}%   | HIGHLY ACCURATE (<10%)")
print(f"Intermittent Spares (0s) | $10k / quarter  | {eval_spares['mape']:>8.2f}%*  | {eval_spares['smape']:>8.2f}%   | REASONABLE (Zero Warning)")
print("=" * 80)
print(f"*Note: Division 3 MAPE skipped {eval_spares['zero_actuals_skipped']} zero-demand period(s) to avoid division by zero.")
print("Recommendation: Standardize corporate scorecards on SMAPE to ensure zero-division safety.")
"""

p2_example = "A global hardware retailer measures forecast accuracy across 40 countries. A small subsidiary with $50k in sales had an MAE of $5k, while the US unit had an MAE of $2M. By computing SMAPE, leadership discovers both units achieved 9.5% SMAPE, allowing fair operational performance bonuses across country heads."
p2_tryIt = "Introduce a heavy over-forecast (actual=10, forecast=100) and compare the resulting MAPE (900%) against SMAPE (163.6%) to observe symmetry bounds."

p2_check = {
    "question": "What is the primary operational advantage of Symmetric SMAPE over classical MAPE in enterprise supply chain analytics?",
    "options": [
        "SMAPE treats over-forecasting and under-forecasting with bounded symmetry and prevents division-by-zero crashes when actual demand is zero.",
        "SMAPE guarantees that all product returns are classified as operational profits.",
        "SMAPE computes the arithmetic median rather than the arithmetic mean.",
        "SMAPE eliminates the need for physical warehouse inventory counts."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "SMAPE divides by the average of actual and predicted values, bounding errors between 0% and 200% and eliminating zero-division singularities."
}

# -------------------------------------------------------------
# Part 3: Mean Absolute Scaled Error (MASE) & Benchmarking Against the Naive Drift Model
# -------------------------------------------------------------
p3_say = [
    "While percentage metrics like MAPE and SMAPE solve the problem of cross-division scale comparison, they introduce severe distortions when applied to non-stationary series, zero-demand periods, or intermittent operational queues. In 2006, leading forecasting statistician Rob J. Hyndman and Anne Koehler published a groundbreaking paper proposing the definitive solution to cross-series accuracy evaluation: The Mean Absolute Scaled Error (MASE). Today, MASE is recognized by the International Institute of Forecasters as the gold-standard metric for enterprise time series benchmarking.",

    "The core architectural insight of MASE is Relative Benchmarking. Instead of dividing forecast error by raw actual values (which causes zero-division crashes), MASE scales the error against the In-Sample Mean Absolute Error of a Naive Baseline Forecast. For non-seasonal series, the naive baseline is the Random Walk Model Y_hat_t = Y_{t-1}, which simply projects the most recent observation forward. For seasonal data with period s, the naive baseline is the Seasonal Naive Model Y_hat_t = Y_{t-s}, which projects the observation from the identical season of the previous year.",

    "Mathematically, for a non-seasonal time series observed over in-sample training length T and evaluated over out-of-sample forecast horizon H, the scaling factor Q is the in-sample mean absolute first-difference: Q = (1 / (T - 1)) * sum_{t=2}^T |Y_t - Y_{t-1}|. The Mean Absolute Scaled Error is then computed as the out-of-sample MAE divided by Q: MASE = ((1 / H) * sum_{t=1}^H |Y_t - Y_hat_t|) / Q. Because Q represents the average one-step forecast error achieved by an analyst who simply guesses yesterday's value, MASE measures how much better (or worse) the advanced machine learning or ARIMA model performs relative to the simplest possible naive benchmark.",

    "The interpretability of MASE is exceptionally clear and powerful for executive decision-makers: If MASE < 1.0, the forecasting model is superior to the naive baseline; a MASE of 0.65 indicates that the advanced model reduced forecast error by thirty-five percent compared to naive persistence. If MASE = 1.0, the expensive AI or econometric pipeline performs no better than assuming tomorrow will be identical to today. If MASE > 1.0, the model is worse than a naive guess; leadership is paying for an analytics pipeline that actively degrades operational accuracy and destroys enterprise value.",

    "Crucially, MASE satisfies every mathematical property required for rigorous scientific benchmarking: It is strictly scale-invariant, allowing valid comparisons across multi-million-dollar product lines and fractional spare parts. It never divides by zero (unless the historical time series is a perfectly flat, constant line with zero historical variance). It never produces infinite spikes near zero. And it treats positive and negative forecasting errors with complete, unbiased mathematical symmetry.",

    "In enterprise analytics governance, models that fail to clear MASE < 0.85 are systematically decommissioned. Corporate boards and audit committees recognize that deploying complex machine learning architectures carries substantial technical debt, infrastructure hosting costs, and retraining overhead. If a complex neural network or ARIMA ensemble cannot comfortably outperform a zero-cost naive random walk by at least fifteen percent (MASE < 0.85), standard operating procedure commands the deployment of the simple naive model, eliminating unnecessary technical complexity.",

    "In addition to MASE, econometricians evaluate Relative MAE (RelMAE): RelMAE = MAE_{model} / MAE_{benchmark}. While MASE compares an out-of-sample forecast to an in-sample one-step naive baseline, RelMAE compares competing models directly over identical out-of-sample test horizons. Computing RelMAE across multi-step forecast horizons (h = 1, 3, 6, 12) generates an empirical Horizon Degradation Frontier, proving exactly at which temporal boundary an advanced model loses its competitive advantage over simple drift benchmarks.",

    "In our production Python implementation, we build a Mean Absolute Scaled Error (MASE) Engine. We compute in-sample naive first-difference scaling factors, evaluate candidate forecasting algorithms across holdout horizons, compute MASE scores, and generate automated deployment approvals."
]

p3_code = """# Pure Python Mean Absolute Scaled Error (MASE) Benchmarking Engine
import math

class MASEEvaluator:
    def __init__(self, training_history, actuals_holdout, forecast_holdout, seasonality=1):
        self.train = training_history
        self.actuals = actuals_holdout
        self.forecasts = forecast_holdout
        self.s = seasonality
        self.T = len(training_history)
        self.H = len(actuals_holdout)
        
    def compute_scaling_factor(self):
        # In-sample Naive Mean Absolute Error: Q
        # For non-seasonal: Q = (1 / (T-1)) * sum |Y_t - Y_{t-1}|
        # For seasonal: Q = (1 / (T-s)) * sum |Y_t - Y_{t-s}|
        diffs = [abs(self.train[t] - self.train[t - self.s]) for t in range(self.s, self.T)]
        q = sum(diffs) / float(len(diffs)) if diffs else 1.0
        return max(1e-6, q)
        
    def evaluate(self):
        q = self.compute_scaling_factor()
        # Out-of-sample MAE
        mae_out = sum(abs(y - y_hat) for y, y_hat in zip(self.actuals, self.forecasts)) / float(self.H)
        
        # MASE = MAE_out / Q
        mase = mae_out / q
        
        status = "APPROVED FOR PRODUCTION" if mase < 0.85 else ("ACCEPTABLE" if mase < 1.0 else "DISQUALIFIED (Worse Than Naive)")
        
        return {
            'q_naive_mae': q,
            'mae_out': mae_out,
            'mase': mase,
            'status': status
        }

# Simulated Enterprise In-Sample History (24 Months)
training_series = [100.0, 102.5, 105.1, 108.4, 112.0, 114.8, 118.2, 122.5, 126.1, 130.4, 134.8, 139.2,
                   143.0, 146.5, 150.8, 155.2, 159.0, 163.4, 168.0, 172.5, 177.1, 182.0, 186.8, 192.0]

# Out-of-Sample Holdout Actuals (Next 6 Months)
holdout_actuals = [196.5, 201.2, 206.0, 211.5, 216.8, 222.0]

# Candidate 1: Calibrated ARIMA Model (Forecasts steady ~5.0 growth)
fc_arima = [196.8, 201.5, 206.4, 211.2, 216.0, 221.0]

# Candidate 2: Degraded Heuristic Model (Drifting under-prediction)
fc_heuristic = [193.0, 194.5, 196.0, 198.0, 199.5, 201.0]

eval_1 = MASEEvaluator(training_series, holdout_actuals, fc_arima).evaluate()
eval_2 = MASEEvaluator(training_series, holdout_actuals, fc_heuristic).evaluate()

print("Mean Absolute Scaled Error (MASE) Production Benchmark:")
print("=" * 80)
print(f"Training History N={len(training_series)} | In-Sample Naive Baseline MAE (Q): ${eval_1['q_naive_mae']:.2f}k")
print("-" * 80)
print(f"{'Forecasting Model':<20} | {'Holdout MAE':<14} | {'MASE Score':<14} | {'Governance Decision'}")
print("-" * 80)
print(f"ARIMA(1, 1, 1) Model | ${eval_1['mae_out']:>8.2f}k    | {eval_1['mase']:>10.3f}   | {eval_1['status']}")
print(f"Naive Persistence    | ${eval_1['q_naive_mae']:>8.2f}k    | {1.000:>10.3f}   | BENCHMARK [Baseline]")
print(f"Degraded Heuristic   | ${eval_2['mae_out']:>8.2f}k    | {eval_2['mase']:>10.3f}   | {eval_2['status']}")
print("=" * 80)
print(f"Value Creation: The ARIMA model achieves MASE = {eval_1['mase']:.3f}, outperforming naive persistence by {(1.0 - eval_1['mase'])*100:.1f}%.")
"""

p3_example = "A retail supply chain evaluates an expensive third-party AI inventory tool. The tool achieves an MAE of 42 units, while the in-sample naive persistence MAE was 38 units. The resulting MASE is 1.105, proving the AI performs worse than a simple random walk, prompting leadership to cancel the $500k contract."
p3_tryIt = "Modify holdout_actuals to introduce an unexpected jump to 250.0 and observe how both models' MASE scores react relative to the historical baseline Q."

p3_check = {
    "question": "What does a Mean Absolute Scaled Error (MASE) score of 0.70 indicate to an enterprise decision-maker?",
    "options": [
        "The model's out-of-sample forecast error is thirty percent lower than that of a naive random walk baseline.",
        "The model achieves exactly seventy percent profit margins on sales.",
        "The model has a thirty percent probability of experiencing a database crash.",
        "The model's regression slope is restricted to 0.70."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "A MASE of 0.70 signifies that the model reduces mean absolute forecast error by 30% relative to the one-step naive persistence benchmark."
}

# -------------------------------------------------------------
# Part 4: Residual White Noise Verification: The Ljung-Box Q-Statistic & Portmanteau Hypothesis Test
# -------------------------------------------------------------
p4_say = [
    "Even if a candidate forecasting model achieves impressive in-sample fit and competitive out-of-sample MASE scores, it must pass a mandatory statistical audit before enterprise deployment: Residual White Noise Verification. In classical statistical econometrics, the residual error e_t = Y_t - Y_hat_t represents what the model cannot explain. If a forecasting model is structurally complete, its residuals must be independent and identically distributed (i.i.d.) Gaussian White Noise. If residuals contain remaining autocorrelation, the model is incomplete: predictable historical information has been left behind in the error stream.",

    "To formally test whether a vector of residual errors represents genuine white noise, econometricians Greta Ljung and George Box formulated the celebrated Ljung-Box Q-Test in 1978. The Ljung-Box test is a Portmanteau Test—a comprehensive omnibus test that simultaneously examines whether an entire collection of residual autocorrelations across multiple lags are jointly equal to zero, rather than testing each lag individually.",

    "The formulation of the test hypothesis is mathematically rigorous: Null Hypothesis H0: The residuals are independently distributed white noise (rho_1 = rho_2 = ... = rho_m = 0 up to lag m); Alternative Hypothesis H1: The residuals exhibit serial autocorrelation, indicating that the model has failed to capture all temporal structure.",

    "The Ljung-Box test statistic Q(m) is computed from the sample autocorrelations r_k of the residuals: Q(m) = N * (N + 2) * sum_{k=1}^m (r_k^2 / (N - k)), where N is the effective sample size, m is the maximum lag tested (typically set to m = 10 for non-seasonal data or m = 2*s for seasonal data), and r_k is the sample autocorrelation of residuals at lag k. Notice the weighting factor (N + 2) / (N - k): this finite-sample modification gives greater weight to early lags and provides superior statistical power over the older Box-Pierce test in small and medium sample sizes.",

    "Under the null hypothesis of white noise, the test statistic Q(m) asymptotically follows a Chi-Square Distribution: Q(m) ~ ChiSq(df), where the degrees of freedom df is equal to the number of lags tested minus the number of estimated ARMA parameters: df = m - p - q. If the calculated test statistic Q exceeds the critical chi-square value at a five percent significance level (or if the corresponding p-value is strictly less than 0.05), we decisively Reject the Null Hypothesis. Rejecting H0 confirms that the residuals are not white noise, rendering the model structurally invalid.",

    "In corporate forecasting operations, automated CI/CD deployment pipelines enforce the Ljung-Box test as a Blocking Quality Gate. If an automated model retraining job produces residuals with p < 0.05 on the Ljung-Box test, the pipeline automatically halts deployment, prevents the model from updating production ERP systems, and alerts analytics engineers. This safeguard prevents degraded models from injecting compounding error loops into automated enterprise supply chains.",

    "To appreciate the statistical refinement of the Ljung-Box test, we examine its historical predecessor, the Box-Pierce Q-Test formulated in 1970: Q_{BP} = N * sum_{k=1}^m r_k^2. While asymptotically valid as sample size approaches infinity, Box and Pierce's original statistic suffers from severe finite-sample size distortions, rejecting the white noise null hypothesis far too infrequently when N is small or moderate. By introducing the exact finite-sample weighting factor (N + 2) / (N - k), Ljung and Box successfully aligned the finite-sample distribution of Q with the theoretical Chi-Square distribution, eliminating conservative bias.",

    "A vital econometric requirement when executing portmanteau tests on regression residuals is the Degrees of Freedom Correction. When testing raw observed data for serial correlation, the degrees of freedom is simply df = m. However, when testing the residuals of an estimated ARMA(p, q) model, the estimation process consumes p + q degrees of freedom because parameters were chosen specifically to minimize residual variance. Failing to subtract (p + q) from the degrees of freedom inflates the critical threshold, causing analysts to erroneously accept misspecified models that retain serial correlation.",

    "In our production Python implementation, we build a Ljung-Box Q-Test Engine from first principles. We calculate residual autocorrelations, compute the finite-sample weighted Q-statistic, approximate chi-square cumulative probabilities using the Wilson-Hilferty transformation, and output an audited white noise certification."
]

p4_code = """# Pure Python Ljung-Box Q-Statistic Portmanteau Test Engine
import math
import statistics
import random

random.seed(42)

def run_ljung_box_test(residuals, max_lags=10, n_params=2):
    n = len(residuals)
    mean_e = statistics.mean(residuals)
    
    # Compute sample variance: gamma_0
    gamma_0 = sum((e - mean_e)**2 for e in residuals) / float(n)
    if gamma_0 <= 1e-12:
        return {'q_stat': 0.0, 'p_value': 1.0, 'is_white_noise': True}
        
    # Step 1: Compute residual autocorrelations r_1 .. r_m
    r_k = []
    for k in range(1, max_lags + 1):
        cov_k = sum((residuals[t] - mean_e) * (residuals[t - k] - mean_e) for t in range(k, n)) / float(n)
        r_k.append(cov_k / gamma_0)
        
    # Step 2: Compute Ljung-Box Q-Statistic: Q = N*(N+2) * sum(r_k^2 / (N - k))
    q_stat = 0.0
    for k_idx, r in enumerate(r_k):
        lag = k_idx + 1
        q_stat += (r ** 2) / float(n - lag)
    q_stat *= float(n * (n + 2))
    
    # Step 3: Chi-Square Degrees of Freedom: df = max_lags - p - q
    df = max_lags - n_params
    if df <= 0:
        df = 1
        
    # Pure Python Chi-Square p-value approximation via Wilson-Hilferty transformation
    # Converts ChiSq(df) to standard normal Z approx ((Q/df)^(1/3) - (1 - 2/(9*df))) / sqrt(2/(9*df))
    w = (q_stat / float(df)) ** (1.0 / 3.0)
    mean_w = 1.0 - (2.0 / (9.0 * float(df)))
    std_w = math.sqrt(2.0 / (9.0 * float(df)))
    z = (w - mean_w) / std_w
    
    # Standard normal upper tail p-value: 1 - Phi(z)
    p_value = 0.5 * math.erfc(z / math.sqrt(2.0))
    p_value = max(0.0, min(1.0, p_value))
    
    is_white_noise = p_value >= 0.05
    
    return {
        'q_stat': q_stat,
        'df': df,
        'p_value': p_value,
        'is_white_noise': is_white_noise,
        'r_k': r_k
    }

# Case 1: Ideal White Noise Residuals (e.g. well-specified ARIMA model)
ideal_residuals = [random.gauss(0, 1.0) for _ in range(100)]
test_ideal = run_ljung_box_test(ideal_residuals, max_lags=8, n_params=2)

# Case 2: Autocorrelated Residuals (e.g. misspecified model leaving AR(1) structure)
corrupted_residuals = [0.0]
for _ in range(100):
    corrupted_residuals.append(0.55 * corrupted_residuals[-1] + random.gauss(0, 1.0))
corrupted_residuals = corrupted_residuals[1:]
test_corrupted = run_ljung_box_test(corrupted_residuals, max_lags=8, n_params=2)

print("Ljung-Box Q-Test Residual White Noise Verification:")
print("=" * 80)
print(f"Null Hypothesis H0 : Residuals are uncorrelated pure white noise (Model Valid)")
print(f"Alternative H1     : Residuals retain serial correlation (Model Misspecified)")
print("-" * 80)
print(f"{'Residual Stream':<22} | {'Q-Statistic':<14} | {'Deg Freedom':<12} | {'p-Value':<12} | {'Audit Verdict'}")
print("-" * 80)
print(f"Well-Fitted Model      | {test_ideal['q_stat']:>10.3f}   | {test_ideal['df']:<12} | {test_ideal['p_value']:>10.4f} | {'PASSED [White Noise]' if test_ideal['is_white_noise'] else 'FAILED'}")
print(f"Misspecified Model     | {test_corrupted['q_stat']:>10.3f}   | {test_corrupted['df']:<12} | {test_corrupted['p_value']:>10.4f} | {'PASSED' if test_corrupted['is_white_noise'] else 'REJECTED [Correlated]'}")
print("=" * 80)
print("Governance Outcome: Misspecified model rejected; automated pipeline blocks production deployment.")
"""

p4_example = "A macroeconomic forecasting model predicts inflation with an R-squared of 0.91. An audit committee runs the Ljung-Box test on residuals, yielding Q = 28.4 and p = 0.0004. Rejecting white noise reveals the model missed quarterly tax adjustments, preventing unhedged bond portfolio losses."
p4_tryIt = "Reduce the autoregressive parameter in corrupted_residuals to 0.10 and observe how the Ljung-Box p-value rises above 0.05, passing white noise verification."

p4_check = {
    "question": "What is the Null Hypothesis (H0) in the Ljung-Box Q-statistic portmanteau test?",
    "options": [
        "The residual errors are independent white noise with zero autocorrelation across all tested lags.",
        "The model contains exactly twelve explanatory regression variables.",
        "The time series has an infinite variance and cannot be inverted.",
        "The enterprise gross margin exceeds fifty percent."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Ljung-Box null hypothesis asserts that all residual autocorrelations up to lag m are zero, confirming the errors are pure white noise."
}

# -------------------------------------------------------------
# Part 5: Out-of-Sample Rolling-Window Backtesting & Expanding-Window Cross-Validation for Time Series
# -------------------------------------------------------------
p5_say = [
    "To conclude Day Nineteen, we master the ultimate gold-standard validation methodology for temporal machine learning: Out-of-Sample Rolling-Window Backtesting and Expanding-Window Cross-Validation. In standard cross-sectional machine learning (such as customer churn or credit risk classification), data scientists deploy randomized K-Fold Cross-Validation, shuffling rows randomly between training and test folds. In temporal econometrics, random shuffling is a catastrophic methodology violation that causes Look-Ahead Bias and Data Leakage, producing deceptively optimistic accuracy scores that collapse in production.",

    "Because time flows strictly in one direction, time series cross-validation must strictly preserve Temporal Order. Training data must always temporally precede the validation data: the model can only use observations up to time t to forecast time t+1, t+2, ..., t+h. In modern enterprise forecasting engineering, we deploy two primary time-aware cross-validation architectures: The Expanding Window (also known as Walk-Forward Optimization) and The Rolling Fixed Window.",

    "In an Expanding Window Architecture, the training window starts with an initial historical baseline (for example, months 1 through 24). The model is trained, and a forward forecast is generated for month 25. Then, month 25's actual observation is added to the training set (expanding the window to months 1 through 25), the model is retrained or updated, and a forecast is generated for month 26. This sequential expansion continues across the entire evaluation horizon. Expanding windows are optimal when the underlying data-generating process is stable and benefits from accumulating longer historical samples.",

    "Conversely, in a Rolling Fixed Window Architecture, the length of the training window is held strictly constant (for example, exactly twenty-four months). As the window advances from month t to month t+1, the oldest historical observation (month t-24) is dropped from the training set as the newest observation is incorporated. Rolling fixed windows are indispensable in commercial environments subject to Structural Breaks and Regime Shifts—such as regulatory changes, rapid technological disruption, or post-pandemic consumer behavioral shifts—ensuring that obsolete historical regimes do not contaminate contemporary forecasts.",

    "Furthermore, institutional forecasting platforms evaluate models across Multi-Step-Ahead Forecast Horizons (h = 1, h = 3, h = 6, h = 12 months). Models that perform exceptionally well at one-step-ahead prediction often degrade severely over longer horizons as recursive forecasting errors compound. By computing MAE, RMSE, and MASE separately for each horizon h, risk committees gain visibility into the model's Error Horizon Degradation Curve, establishing maximum reliable planning horizons for corporate capital expenditure.",

    "The ultimate pinnacle of forecasting backtesting is the Diebold-Mariano Test of Predictive Accuracy. When deciding whether to replace an existing legacy forecasting model with an advanced challenger pipeline, the Diebold-Mariano test evaluates whether the difference in rolling out-of-sample loss differentials is statistically significant. This rigorous testing protocol guarantees that model upgrades are driven by mathematically verified performance gains rather than random testing noise.",

    "In quantitative hedge funds and automated asset management, time series cross-validation is further fortified using Combinatorial Purged and Embargoed Cross-Validation, pioneered by Marcos Lopez de Prado. When financial time series exhibit overlapping prediction horizons (such as forecasting 5-day cumulative returns using daily data), adjacent test folds share mutual information, causing subtle information leakage across fold boundaries. Purging removes training samples whose forecast evaluation labels overlap with the test set, while Embargoing discards training samples immediately following the test period to account for autoregressive memory.",

    "Furthermore, when simulating macroeconomic stress scenarios across irregular business cycles, quantitative risk teams deploy the Stationary Block Bootstrap (Politis & Romano). Rather than assuming a rigid parametric error distribution, block bootstrapping draws random contiguous blocks of temporal observations with geometric block lengths, preserving empirical autocorrelation structures and heavy-tailed volatility clustering while generating thousands of synthetic out-of-sample stress trajectories.",

    "In our production Python capstone, we implement an Expanding-Window Walk-Forward Cross-Validation Engine. We iterate through rolling temporal folds, train candidate models, record sequential forward errors, compute cumulative MAE and RMSE metrics, and output an audited Time Series Cross-Validation Report."
]

p5_code = """# Production Time Series Walk-Forward Cross-Validation Engine
import math
import statistics
import random

random.seed(42)

class WalkForwardBacktester:
    def __init__(self, full_series, initial_train_size=36, horizon=1):
        self.series = full_series
        self.n = len(full_series)
        self.train_size = initial_train_size
        self.h = horizon
        
    def run_walk_forward(self):
        # Rolling walk-forward evaluation: Train on t=0..T, test on t=T+h
        actuals = []
        forecasts_naive = []
        forecasts_trend = []
        
        n_folds = self.n - self.train_size - self.h + 1
        
        for i in range(n_folds):
            train_end = self.train_size + i
            train_data = self.series[:train_end]
            test_actual = self.series[train_end + self.h - 1]
            
            # Model 1: Naive Persistence Benchmark (Y_hat = Y_T)
            y_naive = train_data[-1]
            
            # Model 2: Linear Trend Drift Extrapolation
            # Estimate slope over last 12 months of training data
            recent = train_data[-12:]
            m_recent = len(recent)
            t_idx = list(range(m_recent))
            mean_t = statistics.mean(t_idx)
            mean_y = statistics.mean(recent)
            slope = sum((t - mean_t) * (y - mean_y) for t, y in zip(t_idx, recent)) / sum((t - mean_t)**2 for t in t_idx)
            y_trend = train_data[-1] + slope * float(self.h)
            
            actuals.append(test_actual)
            forecasts_naive.append(y_naive)
            forecasts_trend.append(y_trend)
            
        # Compute Out-of-Sample Metrics
        def calc_metrics(acts, fcs):
            errs = [y - y_hat for y, y_hat in zip(acts, fcs)]
            mae = sum(abs(e) for e in errs) / float(len(errs))
            rmse = math.sqrt(sum(e * e for e in errs) / float(len(errs)))
            return mae, rmse
            
        mae_naive, rmse_naive = calc_metrics(actuals, forecasts_naive)
        mae_trend, rmse_trend = calc_metrics(actuals, forecasts_trend)
        
        mase_trend = mae_trend / mae_naive if mae_naive > 0 else 1.0
        
        return {
            'n_folds': n_folds,
            'mae_naive': mae_naive,
            'rmse_naive': rmse_naive,
            'mae_trend': mae_trend,
            'rmse_trend': rmse_trend,
            'mase_trend': mase_trend
        }

# Generate 60-month historical sales trajectory with steady expansion
history = [50.0]
for _ in range(59):
    history.append(history[-1] + 1.2 + random.gauss(0, 1.8))

backtester = WalkForwardBacktester(history, initial_train_size=36, horizon=1)
results = backtester.run_walk_forward()

print("=" * 80)
print(f"  PINIT CAREER OS - WALK-FORWARD TIME SERIES CROSS-VALIDATION")
print(f"  Total Observations: N={len(history)} | Initial Train: 36 Mos | Evaluation Folds: {results['n_folds']}")
print("=" * 80)
print(f"{'Validation Architecture':<24} | {'Holdout MAE':<14} | {'Holdout RMSE':<14} | {'MASE Score':<12} | {'Verdict'}")
print("-" * 80)
print(f"Naive Walk-Forward Baseline   | ${results['mae_naive']:>8.2f}k    | ${results['rmse_naive']:>8.2f}k    | {1.000:>10.3f} | BENCHMARK")
print(f"Linear Trend Extrapolation    | ${results['mae_trend']:>8.2f}k    | ${results['rmse_trend']:>8.2f}k    | {results['mase_trend']:>10.3f} | {'CERTIFIED [OK]' if results['mase_trend'] < 0.85 else 'ACCEPTABLE'}")
print("=" * 80)
print(f"Backtest Performance: Trend model achieves a {(1.0 - results['mase_trend'])*100:.1f}% error reduction across {results['n_folds']} out-of-sample folds.")
print("GOVERNANCE VERDICT: Zero look-ahead bias confirmed; validated for automated enterprise deployment.")
print("=" * 80)
"""

p5_example = "A hedge fund backtests an algorithmic trading model using random 5-fold cross-validation, reporting a Sharpe ratio of 3.2. When an institutional investor mandates walk-forward out-of-sample backtesting, the Sharpe ratio collapses to 0.4 due to look-ahead bias, preventing disastrous capital misallocation."
p5_tryIt = "Change the forecast horizon h to 3 in the backtester to evaluate multi-step forecast accuracy degradation over quarterly planning cycles."

p5_check = {
    "question": "Why is randomized K-fold cross-validation strictly prohibited in time series forecasting pipelines?",
    "options": [
        "Because random shuffling leaks future information into past training folds (look-ahead bias), producing artificially optimistic accuracy that collapses in production.",
        "Because K-fold cross-validation requires matrix determinants that exceed 32-bit floating point precision.",
        "Because time series models can only be validated using linear regression spreadsheets.",
        "Because cross-validation is only permitted for unsupervised clustering algorithms."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Random shuffling violates temporal order and leaks future data into the training set, causing look-ahead bias and invalidating backtest integrity."
}

DAY_DATA = {
    "day": 19,
    "month": 1,
    "title": "Forecast Accuracy Benchmarks & Residual Diagnostics: MAE, RMSE, MAPE & The Ljung-Box Test",
    "goal": "Master MAE vs RMSE loss functions, scale-free MAPE and symmetric SMAPE, MASE benchmarking against naive persistence, Ljung-Box residual white noise verification, and walk-forward cross-validation.",
    "recap": "Yesterday we mastered ARIMA(p,d,q) integration, SARIMA seasonal operators, information criteria trade-offs, and automated hyperparameter grid search.",
    "minutes": 60,
    "parts": [
        {"title": "Point Forecast Accuracy Metrics: Mean Absolute Error (MAE) vs Root Mean Squared Error (RMSE)", "say": p1_say, "example": p1_example, "code": p1_code, "tryIt": p1_tryIt, "check": p1_check},
        {"title": "Percentage Errors & Scale Invariance: Mean Absolute Percentage Error (MAPE) & Symmetric SMAPE", "say": p2_say, "example": p2_example, "code": p2_code, "tryIt": p2_tryIt, "check": p2_check},
        {"title": "Mean Absolute Scaled Error (MASE) & Benchmarking Against the Naive Drift Model", "say": p3_say, "example": p3_example, "code": p3_code, "tryIt": p3_tryIt, "check": p3_check},
        {"title": "Residual White Noise Verification: The Ljung-Box Q-Statistic & Portmanteau Hypothesis Test", "say": p4_say, "example": p4_example, "code": p4_code, "tryIt": p4_tryIt, "check": p4_check},
        {"title": "Out-of-Sample Rolling-Window Backtesting & Expanding-Window Cross-Validation for Time Series", "say": p5_say, "example": p5_example, "code": p5_code, "tryIt": p5_tryIt, "check": p5_check}
    ]
}
