# Day 11: Categorical Modeling & Logistic Regression: Odds Ratios, ROC-AUC & Precision-Recall

p1_say = [
    "Welcome to Day Eleven of Business Analytics and Decision Intelligence. Up to this point in our curriculum, our predictive engines have operated under the assumption of continuous dependent variables, forecasting metrics such as revenue run-rates, customer acquisition costs, or inventory turnover. However, in corporate decision systems, the most consequential executive decisions involve discrete binary choices: Will this commercial enterprise borrower default on its credit obligations? Will this high-margin subscriber cancel their enterprise contract? Will a specific transaction be flagged as fraudulent? In these scenarios, the dependent variable is qualitative and binary, constrained strictly to zero or one. Today, we master the mathematics and business application of logistic regression, odds ratios, and non-linear classification physics.",

    "Attempting to model a binary outcome using standard Ordinary Least Squares regression creates what econometricians call the Linear Probability Model. While superficially simple, the Linear Probability Model violates the core tenets of probability theory. Because a linear function extends infinitely in both directions, Ordinary Least Squares will inevitably predict probabilities below zero for low-risk entities and probabilities greater than one for high-risk entities. Furthermore, binary outcomes inherently violate the Gauss-Markov assumption of homoskedasticity, because the variance of a Bernoulli random variable is p multiplied by one minus p, which varies directly with the predicted probability.",

    "To resolve this fundamental limitation, we utilize the logit link function, which maps continuous linear combinations of independent predictors into the bounded probability interval between zero and one. We begin with the concept of odds, defined as the probability of an event occurring divided by the probability of the event not occurring. When we take the natural logarithm of the odds, we obtain the logit or log-odds. The logistic regression model expresses the log-odds as a linear equation of the explanatory variables, ensuring that regardless of the magnitude of the inputs, the inverted logistic sigmoid function guarantees a mathematically valid probability output.",

    "Unlike linear regression, which minimizes the sum of squared residuals using closed-form matrix algebra, logistic regression models cannot be solved through direct analytical inversion. Instead, logistic parameters are estimated using Maximum Likelihood Estimation. Maximum Likelihood Estimation seeks the parameter vector that maximizes the likelihood of observing the actual historical pattern of zeros and ones in our corporate dataset. The mathematical objective function is formulated as the joint Bernoulli likelihood product, which is converted via logarithmic transformation into the log-likelihood function and iteratively optimized using Newton-Raphson or gradient ascent algorithms.",

    "In corporate decision environments, the log-likelihood is directly evaluated through deviance statistics. Deviance measures the discrepancy between the fitted model and a theoretically perfect saturated model that perfectly predicts every observation. By comparing the deviance of our fitted model against a null model containing only an intercept, we compute the likelihood ratio test statistic. This test follows a chi-square distribution and serves as the non-linear equivalent of the overall F-test in ordinary least squares, providing rigorous statistical proof of whether our explanatory variables collectively provide explanatory power.",

    "A critical distinction that corporate analysts must communicate to boardroom executives is the difference between marginal effects and log-odds coefficients. In linear models, the slope coefficient represents the constant unit increase in the outcome variable. In logistic models, the slope represents the constant increase in the log-odds, but the change in absolute probability depends entirely on the baseline starting point along the S-shaped sigmoid curve. At the extremes of the curve, large shifts in predictors produce minimal changes in absolute probability, whereas near the inflection point of fifty percent, small shifts trigger substantial swings.",

    "Understanding this sigmoid curvature is vital for strategic capital allocation. For example, in credit risk modeling, increasing a small business's debt-service coverage ratio from one point zero to one point five shifts their default probability away from the steep precipice of bankruptcy down into safe territory. Conversely, increasing the coverage ratio from four point zero to four point five provides negligible marginal safety because the firm is already deeply entrenched in the flat, low-risk tail of the logistic distribution.",

    "Finally, logistic regression provides the mathematical foundation for modern risk scoring across banking, insurance, and SaaS customer success. When an enterprise configures an algorithmic decision gateway, the underlying scoring engine evaluates the vector of explanatory factors, calculates the dot product with the estimated weights, and applies the sigmoid transformation to output a calibrated risk probability. In subsequent parts of this lesson, we will master how to transform these log-odds into intuitive multiplicative odds ratios and optimize decision thresholds for asymmetric financial losses."
]

p1_code = """import math

# Sigmoid function implementation and derivative dynamics
def sigmoid(z):
    return 1.0 / (1.0 + math.exp(-z))

# Evaluate logit output across risk scores
risk_scores = [-4.0, -2.0, -0.5, 0.0, 0.5, 2.0, 4.0]
print("Logit Score to Calibrated Default Probability Mapping:")
for z in risk_scores:
    p = sigmoid(z)
    odds = p / (1.0 - p)
    marginal_effect = p * (1.0 - p)
    print(f"z={z:5.1f} | Prob={p:6.4f} | Odds={odds:7.4f} | Slope={marginal_effect:6.4f}")
"""

p1_example = "Consider a corporate credit officer evaluating commercial loan applicants. A linear model might predict a negative twelve percent probability of default for an exceptionally solvent multinational, which is nonsensical. A logistic model asymptotically bounds the probability strictly between zero and one, accurately reflecting that even the most pristine balance sheet carries a tiny non-zero default probability."
p1_tryIt = "Modify the sigmoid evaluation script to calculate the exact log-odds value z where the default probability reaches eighty percent, and verify that the calculated odds equal exactly four to one."

p1_check = {
    "question": "Why is Ordinary Least Squares (Linear Probability Model) mathematically invalid for modeling corporate loan default probabilities?",
    "options": [
        "OLS can predict default probabilities below zero or above one and severely violates homoskedasticity.",
        "OLS requires categorical independent variables and cannot process continuous financial metrics.",
        "OLS models cannot be estimated when the sample size exceeds one thousand observations.",
        "OLS always produces identical parameter estimates to logistic regression regardless of sample size."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Linear Probability Model fails to bound predictions within the valid probability range [0, 1] and creates severe heteroskedasticity because Bernoulli variance varies with the mean."
}

# -------------------------------------------------------------
# Part 2: Odds Ratios & Multiplicative Risk
# -------------------------------------------------------------
p2_say = [
    "Having established the mathematical foundations of the logistic sigmoid transformation, we must now address the primary communication challenge facing business analytics professionals: explaining logistic regression outputs to non-technical executive stakeholders. While corporate leaders intuitively understand linear slope coefficients—such as 'each additional sales rep adds fifty thousand dollars in revenue'—they are bewildered when an analyst announces that 'each additional debt ratio point increases the log-odds of insolvency by zero point six nine three.' To make logistic models actionable, we must convert raw parameters into odds ratios.",

    "The odds ratio represents the factor by which the odds of an outcome change following a one-unit increase in an independent variable. Mathematically, the odds ratio is obtained by taking the mathematical constant e raised to the power of the estimated slope coefficient beta. If beta is positive, the odds ratio is strictly greater than one, indicating an increase in the odds of the event. If beta is negative, the odds ratio is between zero and one, indicating a decrease in odds. If beta equals zero, the odds ratio equals exactly one, signifying no relationship.",

    "Let us examine a concrete commercial banking underwriting scenario. Suppose a logistic default model estimates a coefficient of zero point four zero five for a firm's leverage ratio. Raising e to the power of zero point four zero five yields an odds ratio of exactly one point five zero. This allows the analyst to state with precision: 'Controlling for liquidity and profitability, each one-unit increase in leverage multiplies the odds of commercial default by one point five zero, representing a fifty percent expansion in default odds.' This multiplicative interpretation translates abstract econometric parameters into intuitive boardroom risk metrics.",

    "However, analysts must remain vigilant against a ubiquitous executive cognitive trap: confusing the odds ratio with the relative risk ratio. The odds ratio compares odds to odds, whereas relative risk compares probability to probability. When the baseline probability of an event is very small—such as aircraft hull losses or rare algorithmic fraud affecting less than one percent of cases—the odds ratio and relative risk ratio are nearly identical. But when the baseline event rate is common—such as customer churn in consumer telecommunications where thirty percent of users churn annually—the odds ratio significantly overstates the relative risk.",

    "For instance, consider a cohort where the baseline probability of churn is forty percent, representing odds of zero point six six seven. If an aggressive marketing competitor doubles the odds to one point three three three, the corresponding churn probability rises to fifty-seven percent. The odds ratio is two point zero, but the relative risk is fifty-seven divided by forty, which is only one point four three. If an analyst incorrectly presents this finding to the Chief Commercial Officer as 'a doubling of churn risk,' the organization will panic and misallocate defensive retention capital.",

    "To calculate confidence intervals for odds ratios, analysts cannot simply add and subtract two standard errors from the odds ratio itself, because the exponentiated sampling distribution is log-normally distributed and asymmetric. Instead, the correct econometric protocol requires constructing the symmetric confidence interval in the log-odds space using the standard error of beta, and then exponentiating both the lower and upper bounds. If the ninety-five percent confidence interval of the odds ratio encompasses the value of one point zero, we cannot reject the null hypothesis of no statistical effect.",

    "Furthermore, continuous financial predictors often vary by units much smaller or larger than one. For example, annual revenue might be measured in millions of dollars, while a working capital ratio might change by zero point one. In such cases, analysts compute scaled odds ratios by multiplying beta by the desired increment delta prior to exponentiation. Exponentiating delta times beta yields the exact multiplicative shift in odds corresponding to realistic operational movements.",

    "By mastering the calculation, interpretation, and boundary conditions of odds ratios, business analytics teams provide senior leadership with clear, quantitative levers for strategic policy formulation. Whether adjusting credit approval thresholds, modifying subscription pricing tiers, or underwriting cyber risk policies, odds ratios transform complex non-linear econometrics into transparent decision rules."
]

p2_code = """import math

# Odds Ratio and Relative Risk demonstration
def analyze_odds_ratio(beta, baseline_prob):
    or_val = math.exp(beta)
    baseline_odds = baseline_prob / (1.0 - baseline_prob)
    new_odds = baseline_odds * or_val
    new_prob = new_odds / (1.0 + new_odds)
    relative_risk = new_prob / baseline_prob
    return or_val, new_prob, relative_risk

beta = 0.69315  # ln(2.0), doubling of odds
baseline_scenarios = [0.01, 0.05, 0.20, 0.50]

print(f"Effect of Odds Ratio = {math.exp(beta):.2f} across Baseline Probabilities:")
for p0 in baseline_scenarios:
    odds_ratio, p1, rr = analyze_odds_ratio(beta, p0)
    print(f"Base P={p0*100:4.1f}% -> New P={p1*100:4.1f}% | Odds Ratio={odds_ratio:.2f} | Relative Risk={rr:.2f}")
"""

p2_example = "Imagine a SaaS startup analyzing churn. An odds ratio of 2.0 on a customer service complaint sounds like churn risk has doubled. For low-churn enterprise clients with a 2% baseline, risk rises to 3.9% (relative risk 1.96). But for self-serve users with a 40% base churn, risk rises to 57% (relative risk only 1.43)."
p2_tryIt = "Run the script with a negative beta of -0.405 (odds ratio ~0.667) and observe how protective factors compress odds and probabilities across high and low baselines."

p2_check = {
    "question": "Under what mathematical condition does an odds ratio approximately equal the relative risk ratio?",
    "options": [
        "When the baseline probability of the outcome event is very low (the rare disease or rare event assumption).",
        "When the independent explanatory variables follow a perfectly uniform distribution.",
        "When the estimated logistic slope coefficient beta is strictly greater than five.",
        "When the sample size in the training dataset is exactly equal to the validation dataset."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "When probability p is near zero, 1 - p approaches 1, meaning odds p/(1-p) converges directly to probability p, making the odds ratio equivalent to relative risk."
}

# -------------------------------------------------------------
# Part 3: Classification Thresholds & Asymmetric Loss
# -------------------------------------------------------------
p3_say = [
    "In standard academic machine learning coursework, students are almost universally taught to apply a default probability threshold of zero point five zero to binary classifiers: if the predicted probability exceeds fifty percent, classify as positive; otherwise, classify as negative. In corporate decision intelligence and institutional risk management, applying a zero point five zero cutoff without economic analysis is administrative malpractice. In real business operations, the costs of classification errors are radically asymmetric.",

    "Consider an enterprise fraud detection system protecting a digital payments processor. The classifier must distinguish between legitimate merchant transactions and fraudulent unauthorized card payments. A Type I error, or False Positive, occurs when the model flags a legitimate purchase as fraudulent. The economic cost is temporary customer friction, potential checkout abandonment, and minor customer support overhead, totaling perhaps ten dollars. A Type II error, or False Negative, occurs when the model allows a fraudulent transaction to proceed. Here, the company suffers direct chargeback loss, interchange penalty fees, and investigative costs, averaging five hundred dollars.",

    "When the cost of a False Negative is fifty times greater than the cost of a False Positive, setting the decision cutoff at fifty percent guarantees catastrophic financial hemorrhaging. To minimize total expected financial loss, the operational threshold must be set significantly lower, intercepting suspicious transactions even when the calculated probability of fraud is only two or three percent. Conversely, in targeted high-cost customer marketing campaigns where direct mail catalogs cost twenty-five dollars each, the cutoff must be elevated to ensure capital is spent only on high-propensity prospects.",

    "To formalize this optimization, business analytics architects utilize the Expected Cost Matrix. Let C_FP represent the cost of a False Positive and C_FN represent the cost of a False Negative. Assuming the costs of True Positives and True Negatives are zero, the optimal decision threshold p-star is derived by setting the expected cost of classifying an observation as positive equal to the expected cost of classifying it as negative. The resulting mathematical formula dictates that p-star equals C_FP divided by the sum of C_FP and C_FN.",

    "Applying this elegant formula to our payments fraud scenario demonstrates the power of quantitative business analytics. With C_FP equal to ten dollars and C_FN equal to five hundred dollars, the optimal cutoff p-star equals ten divided by five hundred and ten, which is approximately zero point zero one nine six, or slightly under two percent. Any transaction with an algorithmic fraud score of two percent or higher must be routed to secondary verification. A blind fifty percent rule would allow ninety-eight percent of fraudulent transactions to execute cleanly.",

    "To systematically evaluate classifier performance across all possible operating thresholds, analysts construct the Confusion Matrix. The Confusion Matrix cross-tabulates actual historical outcomes against algorithmic predictions, yielding four fundamental quadrants: True Positives, False Positives, True Negatives, and False Negatives. From these raw counts, we derive vital diagnostic ratios including Sensitivity (True Positive Rate or Recall), Specificity (True Negative Rate), Precision (Positive Predictive Value), and Accuracy.",

    "Corporate analysts must exercise extreme caution with the metric of Accuracy. In severely imbalanced datasets—such as commercial loan defaults where only one percent of loans default annually—a completely naive model that classifies every single borrower as solvent will achieve a deceptive ninety-nine percent accuracy. Yet this useless model will fail to catch a single default, driving the financial institution into insolvency during the first economic downturn.",

    "Therefore, an enterprise analytics engine must report class-specific metrics and cost-weighted objective functions. In subsequent operational pipelines, models must be scored not on raw percentage accuracy, but on net monetary value generated: total revenue saved from prevented defaults minus total friction costs imposed on legitimate customers. This marks the transition from academic data science to institutional decision intelligence."
]

p3_code = """# Cost-sensitive classification threshold optimization
def calculate_optimal_threshold(cost_fp, cost_fn):
    return cost_fp / (cost_fp + cost_fn)

def evaluate_financial_loss(probs, actuals, threshold, cost_fp, cost_fn):
    fp = sum(1 for p, y in zip(probs, actuals) if p >= threshold and y == 0)
    fn = sum(1 for p, y in zip(probs, actuals) if p < threshold and y == 1)
    tp = sum(1 for p, y in zip(probs, actuals) if p >= threshold and y == 1)
    tn = sum(1 for p, y in zip(probs, actuals) if p < threshold and y == 0)
    total_loss = (fp * cost_fp) + (fn * cost_fn)
    return total_loss, fp, fn, tp, tn

# Simulated portfolio: 1000 transactions, 30 actual frauds (3%)
import random
random.seed(42)
actuals = [1 if i < 30 else 0 for i in range(1000)]
# Algorithmic scores: frauds score higher on average
probs = [random.betavariate(2, 5) if y == 1 else random.betavariate(1, 15) for y in actuals]

cost_fp = 15.0   # $15 merchant investigation friction
cost_fn = 600.0  # $600 chargeback + stolen funds loss
p_star = calculate_optimal_threshold(cost_fp, cost_fn)

loss_default, fp_d, fn_d, tp_d, tn_d = evaluate_financial_loss(probs, actuals, 0.50, cost_fp, cost_fn)
loss_optimal, fp_o, fn_o, tp_o, tn_o = evaluate_financial_loss(probs, actuals, p_star, cost_fp, cost_fn)

print(f"Optimal Economic Threshold p* = {p_star*100:.2f}%")
print(f"Default 0.50 Threshold -> Total Loss: ${loss_default:,.2f} | Caught {tp_d}/30 frauds (Missed {fn_d})")
print(f"Optimal {p_star*100:.2f}% Threshold -> Total Loss: ${loss_optimal:,.2f} | Caught {tp_o}/30 frauds (Missed {fn_o})")
print(f"Net Corporate Savings: ${loss_default - loss_optimal:,.2f}")
"""

p3_example = "In airport security luggage screening, the cost of missing an explosive device (False Negative) is catastrophic, while the cost of a manual bag search (False Positive) is a two-minute delay. Security scanning algorithms are therefore configured with ultra-low thresholds, accepting high false alarm rates to ensure zero misses."
p3_tryIt = "Adjust the cost parameters in the script to model a luxury VIP concierge where false positive friction costs $200 and fraud costs $400. Observe how p* shifts toward 33%."

p3_check = {
    "question": "What is the optimal classification threshold p* when False Positive cost is $20 and False Negative cost is $180?",
    "options": [
        "p* = 0.10 (10%), calculated as 20 / (20 + 180).",
        "p* = 0.50 (50%), because binary classifiers always default to equal probability.",
        "p* = 0.90 (90%), calculated as 180 / 200.",
        "p* = 0.00 (0%), because all risk must be eliminated regardless of cost."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The economic threshold formula p* = Cost_FP / (Cost_FP + Cost_FN) yields 20 / 200 = 0.10, balancing marginal expected costs."
}

# -------------------------------------------------------------
# Part 4: ROC-AUC & Precision-Recall Invariants
# -------------------------------------------------------------
p4_say = [
    "Because the optimal operational threshold varies depending on corporate cost structures, evaluating a classifier at a single fixed cutoff gives an incomplete picture of its predictive power. An executive risk committee needs an objective, threshold-independent measure of how effectively the model discriminates between positive and negative instances across all possible operating environments. The gold standard statistical framework for threshold-independent evaluation is the Receiver Operating Characteristic curve and its corresponding Area Under the Curve metric.",

    "The Receiver Operating Characteristic curve originates from World War II radar signal detection theory, where radar operators had to differentiate incoming enemy aircraft from flocks of birds. In business analytics, the ROC curve plots the True Positive Rate (Sensitivity) on the vertical y-axis against the False Positive Rate (one minus Specificity) on the horizontal x-axis across every conceivable cutoff threshold from zero to one. A completely uninformative classifier—equivalent to flipping a coin—traces a diagonal forty-five-degree reference line from the origin to the top right corner.",

    "The Area Under the ROC Curve, abbreviated as ROC-AUC, integrates the area beneath this plotted trajectory, yielding a single scalar summary bounded between zero point five zero and one point zero. An AUC of zero point five zero indicates zero discriminative ability, while an AUC of one point zero represents a flawless classifier with zero overlap between the risk distributions of positive and negative classes. In commercial underwriting and fraud analytics, models achieving an AUC between zero point seven zero and zero point eight zero are considered acceptable, while those exceeding zero point eight five are institutional-grade.",

    "From a probabilistic standpoint, the ROC-AUC possesses a remarkable mathematical property: it equals the exact Wilcoxon-Mann-Whitney rank-sum statistic. Specifically, the AUC represents the probability that the classifier will assign a higher risk score to a randomly chosen positive instance (such as a defaulting borrower) than to a randomly chosen negative instance (a solvent borrower). This non-parametric interpretation provides board members with an intuitive grasp of ranking fidelity without requiring immersion in calculus.",

    "However, a critical vulnerability arises when applying ROC-AUC to severely imbalanced datasets. Because the horizontal axis of the ROC curve measures the False Positive Rate—defined as False Positives divided by total actual negatives—when the negative class comprises hundreds of thousands of observations, the denominator is massive. Consequently, a model could generate thousands of false alarms, yet the False Positive Rate remains tiny, creating an artificially inflated and overly optimistic ROC-AUC curve.",

    "To counteract this distortion in high-imbalance corporate environments—such as cyber intrusion detection, ad-click prediction, or AML money laundering alerts—analytics teams deploy the Precision-Recall Curve. Precision measures the proportion of positive identifications that were actually correct, while Recall measures the proportion of actual positives that were successfully captured. Unlike the ROC curve, the Precision-Recall curve focuses exclusively on the minority positive class, completely excluding True Negatives from its calculations.",

    "In a Precision-Recall curve, the baseline horizontal benchmark for a random classifier is not zero point five zero, but rather the raw prevalence of the positive class in the underlying population. If fraud prevalence is zero point two percent, the random baseline AUC-PR is zero point zero zero two. An analytics team that achieves an AUC-PR of zero point four zero in such an environment has engineered an extraordinary two-hundred-fold improvement over random selection, providing vital business clarity that raw ROC-AUC would obscure.",

    "To balance precision and recall into a single operational key performance indicator, decision architects compute the F-beta score. While the standard F1-score represents the harmonic mean of precision and recall with equal weighting, real-world commercial strategies require parameterized asymmetry. In loan underwriting where missing a default is far more damaging than manual review overhead, teams deploy the F2-score, which weights recall twice as heavily as precision. Conversely, in automated customer email marketing where spamming uninterested clients destroys brand reputation, teams employ the F0.5-score to prioritize precision over recall.",

    "Modern decision systems therefore monitor both metrics concurrently: ROC-AUC to confirm broad population ranking capability, and Precision-Recall AUC alongside parameterized F-beta measures to evaluate tactical triage efficiency in high-noise operational queues. In our final part, we synthesize these tools into an integrated credit scoring engine."
]

p4_code = """# Compute ROC-AUC via Wilcoxon-Mann-Whitney Rank-Sum formulation
def calculate_roc_auc(scores, actuals):
    # Pair scores with labels and rank them
    paired = sorted(zip(scores, actuals), key=lambda x: x[0])
    n_pos = sum(actuals)
    n_neg = len(actuals) - n_pos
    
    if n_pos == 0 or n_neg == 0:
        return 0.5
        
    rank_sum_pos = 0.0
    for rank, (score, label) in enumerate(paired, start=1):
        if label == 1:
            rank_sum_pos += rank
            
    # U-statistic formula
    u_pos = rank_sum_pos - (n_pos * (n_pos + 1)) / 2.0
    auc = u_pos / (n_pos * n_neg)
    return auc

# Simulated corporate loan scores
actual_defaults = [0, 0, 1, 0, 0, 1, 0, 1, 1, 1]
credit_scores   = [0.12, 0.25, 0.38, 0.41, 0.52, 0.61, 0.68, 0.79, 0.84, 0.92]

auc = calculate_roc_auc(credit_scores, actual_defaults)
print(f"Portfolio Model Evaluated: {len(actual_defaults)} Commercial Borrowers")
print(f"Calculated ROC-AUC Statistic: {auc:.4f}")
print("Interpretation: Probability that a defaulting firm scored higher than a solvent firm is {:.1f}%".format(auc * 100))
"""

p4_example = "A hospital cancer screening diagnostic test with an impressive 0.96 ROC-AUC might still yield only 10% precision if cancer incidence is 1 in 10,000, meaning 9 out of 10 positive alerts are false alarms. Precision-Recall curves illuminate this reality, preventing diagnostic panic."
p4_tryIt = "Invert the credit scores in the test script and observe how the AUC drops to (1 - AUC), proving the symmetric ranking properties of the Wilcoxon formulation."

p4_check = {
    "question": "Why is the Precision-Recall curve preferred over the ROC curve when evaluating rare fraud detection models?",
    "options": [
        "Precision-Recall excludes True Negatives, preventing huge non-fraud volumes from masking false alarms.",
        "Precision-Recall curves can only be computed when the sample size is under one hundred rows.",
        "ROC curves cannot be drawn if the classifier uses non-linear sigmoid activation functions.",
        "Precision-Recall metrics always produce a higher numerical score than ROC-AUC."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Because True Negatives dominate imbalanced datasets, the False Positive Rate in ROC curves remains deceptively small; Precision-Recall isolates positive class performance."
}

# -------------------------------------------------------------
# Part 5: Corporate Credit Scoring Engine & Capstone
# -------------------------------------------------------------
p5_say = [
    "To conclude our deep immersion in categorical modeling, we assemble an end-to-end Corporate Credit Underwriting and Capital Allocation Engine. In institutional banking and financial services, the output of a credit scoring model directly dictates regulatory capital reserve allocations under the Basel III and Basel IV banking accords. Financial institutions are legally required to maintain loss-absorbing capital reserves calculated from three structural variables: Probability of Default (PD), Exposure at Default (EAD), and Loss Given Default (LGD). Today, our focus centers on the rigorous estimation and validation of the Probability of Default.",

    "Our comprehensive enterprise workflow integrates every component mastered today: raw financial statement ratio ingestion (leverage, interest coverage, liquidity), conversion through the logistic logit link function, exponentiated odds ratio interpretation for regulatory compliance audits, cost-sensitive threshold optimization to minimize loan write-offs, and ROC-AUC discriminatory validation. Furthermore, institutional regulators demand that model parameters demonstrate strict monotonic relationships with credit risk to prevent algorithmic discrimination or arbitrary lending rejections.",

    "When deploying credit models into production banking architectures, analysts must establish automated model governance and drift detection pipelines. The primary operational risk in credit scoring is Population Stability Index drift. Over economic business cycles, corporate borrower characteristics shift: an interest coverage ratio that indicated prime solvency during a zero-interest-rate regime may signal severe distress when benchmark interest rates surge by five hundred basis points. If the Population Stability Index exceeds zero point two five, the model has decayed and must undergo mandatory recalibration.",

    "Institutional risk frameworks also require stress testing under Comprehensive Capital Analysis and Review guidelines mandated by global banking authorities. Analysts simulate severe macroeconomic downturns—such as a thirty percent contraction in commercial real estate values combined with a two hundred basis point widening of corporate credit spreads—to project how the portfolio default rate would migrate across rating buckets. By examining credit transition matrices and multi-period Markov chains, risk teams ensure the bank maintains sufficient tier-one capital reserves to absorb sudden clusters of corporate defaults without seeking emergency recapitalization.",

    "Furthermore, model governance protocols demand rigorous compliance with Fair Lending regulations, such as the Equal Credit Opportunity Act and Adverse Action Notice requirements. Under administrative law, financial institutions cannot utilize black-box machine learning algorithms that lack clear interpretability. When a loan application is rejected by an automated scoring gateway, the institution is legally obligated to provide the specific top four adverse action reasons—such as excessive debt-to-income ratio or insufficient debt service coverage. Logistic regression remains the global industry standard for regulated credit underwriting precisely because its additive log-odds structure allows exact, legally defensible attribution of denial reasons.",

    "In the accompanying Python capstone pipeline, we execute a complete corporate portfolio audit across twenty commercial enterprises. The pipeline calculates log-odds, maps calibrated default probabilities, computes the portfolio Expected Credit Loss using standard Basel parameters, and compares an unoptimized fifty percent cutoff against our mathematically derived economic loss cutoff. The financial divergence is striking, demonstrating how quantitative decision intelligence directly preserves millions of dollars in balance sheet equity.",

    "As you review the output of this production pipeline, pay particular attention to the trade-off between credit expansion and default containment. An overly conservative threshold paralyzes commercial lending growth, rejecting creditworthy mid-market enterprises and sacrificing net interest margin. An overly permissive threshold triggers surges in non-performing loans and credit rating downgrades. Mathematical decision intelligence provides the precise navigational instrument to balance this institutional tension.",

    "In tomorrow's masterclass, we will expand our predictive toolkit from supervised binary classification into unsupervised pattern discovery, mastering Customer Segmentation Analytics through RFM behavioral scoring, K-Means clustering mechanics, and silhouette score optimization.",

    "Take time to examine every line of the production underwriting code below. Verify how the odds ratio calculations align with your theoretical derivations, test varying loss assumptions, and complete the final Socratic self-check to lock in your mastery of logistic regression and categorical decision modeling."
]

p5_code = """# Production Corporate Credit Scoring & Basel Expected Loss Engine
import math

class CommercialCreditEngine:
    def __init__(self, beta_intercept, beta_leverage, beta_icr, cost_fp, cost_fn):
        self.b0 = beta_intercept
        self.b_lev = beta_leverage
        self.b_icr = beta_icr
        self.p_star = cost_fp / (cost_fp + cost_fn)
        
    def predict_pd(self, leverage, interest_coverage):
        # Logit equation: higher leverage increases PD, higher ICR decreases PD
        z = self.b0 + (self.b_lev * leverage) + (self.b_icr * interest_coverage)
        return 1.0 / (1.0 + math.exp(-z))
        
    def evaluate_portfolio(self, portfolio):
        print(f"Credit Policy Initialized | Optimal Economic Cutoff p* = {self.p_star*100:.2f}%")
        print("-" * 75)
        print(f"{'Borrower':<12} | {'Lev':<5} | {'ICR':<5} | {'PD':<8} | {'50% Dec':<8} | {'Opt Dec':<8} | {'Exp Loss ($)'}")
        print("-" * 75)
        
        total_exp_loss = 0.0
        for b in portfolio:
            pd = self.predict_pd(b['leverage'], b['icr'])
            dec_50 = "REJECT" if pd >= 0.50 else "APPROVE"
            dec_opt = "REJECT" if pd >= self.p_star else "APPROVE"
            # Basel ECL = EAD * PD * LGD (assume LGD = 45%)
            ecl = b['ead'] * pd * 0.45
            total_exp_loss += ecl
            print(f"{b['name']:<12} | {b['leverage']:<5.2f} | {b['icr']:<5.2f} | {pd*100:<6.2f}% | {dec_50:<8} | {dec_opt:<8} | ${ecl:>10,.2f}")
            
        print("-" * 75)
        print(f"Total Portfolio Basel Expected Credit Loss (ECL): ${total_exp_loss:,.2f}")

# Instantiate engine: b0=-2.0, leverage=+0.8 (OR=2.23), ICR=-0.5 (OR=0.61)
# Cost of rejecting good client=$5,000; Cost of defaulting client write-off=$80,000
engine = CommercialCreditEngine(beta_intercept=-2.0, beta_leverage=0.8, beta_icr=-0.5, cost_fp=5000, cost_fn=80000)

sample_portfolio = [
    {"name": "Apex Global", "leverage": 1.2, "icr": 6.5, "ead": 500000},
    {"name": "Beacon Corp", "leverage": 3.8, "icr": 1.4, "ead": 750000},
    {"name": "Cascade Ltd", "leverage": 2.1, "icr": 3.2, "ead": 300000},
    {"name": "Dynasty Inc", "leverage": 4.5, "icr": 0.8, "ead": 1200000},
    {"name": "Echo Energy", "leverage": 1.8, "icr": 4.5, "ead": 400000}
]

engine.evaluate_portfolio(sample_portfolio)
"""

p5_example = "Global investment banks using Basel capital models evaluate thousands of corporate loan applications daily. By calibrating probability of default to economic loss cutoffs rather than 50%, banks avert systemic insolvency while maximizing risk-adjusted return on capital (RAROC)."
p5_tryIt = "Add a distressed company to the portfolio with leverage of 6.0 and ICR of 0.4, and verify how its PD jumps toward 90% with substantial Expected Credit Loss."

p5_check = {
    "question": "In the Basel regulatory framework, how is Expected Credit Loss (ECL) calculated for commercial loan portfolios?",
    "options": [
        "ECL = Exposure at Default (EAD) * Probability of Default (PD) * Loss Given Default (LGD).",
        "ECL is calculated by dividing total company assets by annual gross operating revenue.",
        "ECL equals the arithmetic mean of all historical non-performing loan balances.",
        "ECL is strictly determined by national central bank interest rate benchmarks without firm-level data."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Under Basel banking standards, credit risk capital is governed by Expected Credit Loss = EAD * PD * LGD, modeling exposure, likelihood, and recovery severity."
}

DAY_DATA = {
    "day": 11,
    "month": 1,
    "title": "Categorical Modeling & Logistic Regression: Odds Ratios, ROC-AUC & Precision-Recall",
    "goal": "Master binary classification physics, logit link mechanics, odds ratios, asymmetric cost optimization, and ROC-AUC discriminatory validation for corporate decision intelligence.",
    "recap": "Yesterday we mastered non-linear regression, polynomial elasticities, log-log transformations, and Ramsey RESET specification error diagnostics.",
    "minutes": 38,
    "parts": [
        {"title": "Sigmoid Mechanics, Logit Link Function & Maximum Likelihood Estimation", "say": p1_say, "example": p1_example, "code": p1_code, "tryIt": p1_tryIt, "check": p1_check},
        {"title": "Odds Ratios, Multiplicative Risk & Exponentiated Coefficients in Credit Default", "say": p2_say, "example": p2_example, "code": p2_code, "tryIt": p2_tryIt, "check": p2_check},
        {"title": "Classification Thresholds, Confusion Matrix & Asymmetric Cost Optimization", "say": p3_say, "example": p3_example, "code": p3_code, "tryIt": p3_tryIt, "check": p3_check},
        {"title": "ROC Curves, AUC Invariants & Precision-Recall Trade-offs in Severe Imbalance", "say": p4_say, "example": p4_example, "code": p4_code, "tryIt": p4_tryIt, "check": p4_check},
        {"title": "Corporate Credit Scoring Engine, Boardroom Governance & Diagnostic Outages", "say": p5_say, "example": p5_example, "code": p5_code, "tryIt": p5_tryIt, "check": p5_check}
    ]
}
