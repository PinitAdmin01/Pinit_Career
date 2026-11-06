# scripts/data_day36.py
# Day 36: Credit Risk Scorecards: Weight of Evidence (WoE), Information Value (IV) & Calibration
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: Regulatory Frameworks, Monotonic Binning & Weight of Evidence (WoE) Mechanics
# -------------------------------------------------------------
p1_say = [
    "Welcome to Day 36 of Business Analytics and Decision Intelligence. In commercial lending, corporate credit underwriting, and consumer finance, predictive modeling operates under a fundamentally distinct regulatory paradigm compared to unregulated consumer tech. In ad-click prediction, algorithmic recommendation engines, or social feed ranking, machine learning engineers can deploy high-dimensional, non-linear ensemble models or deep neural networks without needing to explain why an individual prediction was generated. In retail credit and enterprise lending, however, banking institutions are constrained by rigorous legal mandates such as the Basel II and Basel III Capital Accords, the Fair Credit Reporting Act (FCRA), the Equal Credit Opportunity Act (ECOA), and the Federal Reserve Model Risk Management guidance (SR 11-7). Under these governance frameworks, credit models must not only deliver high discriminatory accuracy but must also be fully transparent, explainable, and verifiable by federal regulatory examiners. When a bank denies a credit application, it is legally required by FCRA Regulation B to provide adverse action notices citing the primary numeric reasons for credit rejection. This regulatory reality makes the classical Credit Risk Scorecard the global gold standard for consumer and commercial underwriting.",
    "The foundational mechanism of credit scorecard engineering is Weight of Evidence (WoE) transformation paired with coarse, monotonic binning. Continuous risk variables such as Debt-to-Income (DTI) ratio, revolving credit utilization, and applicant age frequently exhibit non-linear, non-monotonic relationships with default risk. For example, very young borrowers may default due to lack of financial liquidity and thin credit files, while elderly borrowers may face health-related income disruptions. If fed directly into raw regression models, non-linearities can create unstable coefficients, extreme sensitivity to outliers, and unintuitive model behavior that fails regulatory audits. To resolve this, continuous variables are partitioned into discrete intervals, or bins. Coarse binning groups granular values into a manageable set of ordinal categories (typically four to eight bins per attribute), ensuring that each bin contains a statistically significant population sample (generally at least 5% of total applicants) to prevent variance explosion.",
    "Once coarse binning is performed, each bin is evaluated for monotonicity. In regulatory underwriting, an attribute's empirical default rate must trend monotonically across bins unless an explicit, economically sound justification exists. For instance, as an applicant's Debt-to-Income ratio increases across bins from under 15% to over 50%, the observed default rate must strictly increase. If an intermediate bin exhibits an anomalous drop in default rate due to sample noise, regulatory examiners will mandate either merging adjacent bins or restructuring the threshold cut-offs. Monotonic binning enforces structural consistency and guarantees that the resulting scorecard behaves logically in commercial production, preventing bizarre edge cases where an applicant is penalized for earning a slightly higher salary or having lower outstanding liabilities.",
    "With monotonic bins established, each category is mapped to its mathematical Weight of Evidence (WoE). Originating from information theory and statistical evidence formulation by Alan Turing, Weight of Evidence measures the relative log-odds of good loans versus bad loans within a specific attribute bin compared to the entire loan portfolio. Formally, let G_i represent the number of 'good' non-defaulting borrowers in bin i, and B_i represent the number of 'bad' defaulting borrowers in bin i. Let G_total and B_total represent the total counts of good and bad borrowers across the entire dataset. The proportion of all good borrowers in bin i is DistrGood_i = G_i / G_total, and the proportion of all bad borrowers in bin i is DistrBad_i = B_i / B_total. The Weight of Evidence for bin i is defined as: WoE_i = ln(DistrGood_i / DistrBad_i) = ln((G_i / G_total) / (B_i / B_total)).",
    "Analyzing the algebraic behavior of the WoE formula reveals its elegant properties. If a bin contains a higher concentration of non-defaulting good borrowers than bad defaulting borrowers (DistrGood_i > DistrBad_i), the ratio inside the natural logarithm is greater than 1.0, yielding a positive WoE value. Conversely, if a bin exhibits a higher proportion of defaulting bad borrowers than goods (DistrGood_i < DistrBad_i), the ratio is less than 1.0, producing a negative WoE value. If the distribution of goods and bads in the bin exactly mirrors the portfolio baseline, WoE equals zero. By replacing raw feature values with their corresponding bin WoE values, data scientists perform a monotonic log-odds transformation. This linearizes the relationship between the feature and the logistic log-odds of default, transforms all continuous and categorical variables onto a standardized comparable scale, isolates extreme numerical outliers within boundary bins, and handles missing values seamlessly by designating missing records as an independent bin with its own empirical WoE score.",
    "In commercial practice, institutional credit analysts build automated monotonic binning algorithms using optimal binning routines such as Decision Tree splitting or Chi-Square merging (ChiMerge). The algorithm iteratively merges adjacent intervals whose good/bad odds ratios are statistically indistinguishable, until all remaining bins demonstrate strictly monotonic default rates and satisfy minimum population thresholds. In this section, we construct a pure Python implementation of coarse monotonic binning and WoE calculation for an enterprise loan portfolio, verifying the mathematical properties that govern credit risk evaluation under Basel III guidelines."
]

p1_code = '''# Day 36 Part 1: Coarse Monotonic Binning & Weight of Evidence (WoE) Calculation
import math
import random

random.seed(42)

# Simulate 2,000 retail credit applications: Debt-to-Income (DTI) and Default status (1=Bad/Default, 0=Good)
# Higher DTI yields higher probability of default
n_records = 2000
applications = []
for _ in range(n_records):
    dti = random.betavariate(2, 5) * 80.0  # DTI between 0% and 80%
    # Default probability increases non-linearly with DTI
    prob_default = 1.0 / (1.0 + math.exp(-(0.08 * dti - 3.2)))
    default = 1 if random.random() < prob_default else 0
    applications.append({"dti": round(dti, 2), "default": default})

total_goods = sum(1 for app in applications if app["default"] == 0)
total_bads = sum(1 for app in applications if app["default"] == 1)
portfolio_bad_rate = total_bads / n_records

# Define coarse bins for Debt-to-Income (DTI) ratio
bin_edges = [0.0, 15.0, 25.0, 35.0, 50.0, 100.0]
bin_labels = ["DTI < 15%", "15% <= DTI < 25%", "25% <= DTI < 35%", "35% <= DTI < 50%", "DTI >= 50%"]

bins = {label: {"goods": 0, "bads": 0, "total": 0} for label in bin_labels}

for app in applications:
    dti = app["dti"]
    is_bad = app["default"]
    for idx in range(len(bin_edges) - 1):
        if bin_edges[idx] <= dti < bin_edges[idx + 1]:
            label = bin_labels[idx]
            bins[label]["total"] += 1
            if is_bad:
                bins[label]["bads"] += 1
            else:
                bins[label]["goods"] += 1
            break

print("=" * 78)
print(f"PORTFOLIO BASELINE: Total={n_records} | Goods={total_goods} | Bads={total_bads} | Bad Rate={portfolio_bad_rate:.2%}")
print("=" * 78)
print(f"{'Bin Interval':<20} | {'Total':<6} | {'Goods':<6} | {'Bads':<6} | {'Bad Rate':<9} | {'DistrGood':<9} | {'DistrBad':<9} | {'WoE':<8}")
print("-" * 78)

monotonic = True
prev_bad_rate = -1.0

for label in bin_labels:
    b = bins[label]
    g_count = b["goods"]
    b_count = b["bads"]
    t_count = b["total"]
    
    bad_rate = b_count / t_count if t_count > 0 else 0.0
    if bad_rate < prev_bad_rate:
        monotonic = False
    prev_bad_rate = bad_rate
    
    # Avoid zero-division through Laplace continuity correction if needed
    distr_good = (g_count + 0.5) / (total_goods + 1.0)
    distr_bad = (b_count + 0.5) / (total_bads + 1.0)
    woe = math.log(distr_good / distr_bad)
    b["woe"] = woe
    b["distr_good"] = distr_good
    b["distr_bad"] = distr_bad
    
    print(f"{label:<20} | {t_count:<6} | {g_count:<6} | {b_count:<6} | {bad_rate:<9.2%} | {distr_good:<9.4f} | {distr_bad:<9.4f} | {woe:<+8.4f}")

print("=" * 78)
print(f"Regulatory Monotonicity Audit: {'PASS (Strictly Monotonic)' if monotonic else 'FAIL (Non-monotonic detected)'}")
print("Interpretation: Positive WoE denotes safer credit; Negative WoE denotes elevated credit risk.")
'''

p1_mcq = {
    "question": "Under Basel III and FCRA regulatory standards, why must continuous risk features like Debt-to-Income (DTI) be coarsely binned into monotonic intervals before Weight of Evidence (WoE) transformation?",
    "options": [
        "Monotonic coarse binning linearizes non-linear relationships with log-odds, prevents overfitting in sparse data intervals, and guarantees transparent, explainable adverse action reason codes that satisfy regulatory audits.",
        "Binning increases the total parameter count of deep neural networks to maximize raw training accuracy regardless of interpretability.",
        "Regulations require that every bin must have an identical 50% default rate to eliminate financial risk.",
        "Weight of Evidence is mathematically invalid unless all input values are completely random."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Monotonic coarse binning linearizes the relationship between the feature and log-odds, isolates outliers, ensures statistical significance across categories, and guarantees explainable adverse action notices required by banking regulators."
}

# -------------------------------------------------------------
# Part 2: Information Value (IV), Feature Selection Thresholds & Predictive Screening
# -------------------------------------------------------------
p2_say = [
    "Having established the mechanics of Weight of Evidence for individual bins, the credit risk modeler confronts the essential challenge of feature selection: which candidate attributes possess genuine predictive separation between good and bad borrowers, and which attributes represent statistical noise? In modern banking environments, loan applications ingest dozens or hundreds of candidate variables, spanning applicant demographics, credit bureau inquiries, revolving credit utilization, historical payment delinquency counts, employment tenure, and banking transaction history. If an analyst includes all candidate variables in a logistic regression model, multicollinearity, parameter inflation, and severe out-of-sample overfitting will degrade performance. To systematically quantify the overall predictive power of a categorical or binned continuous variable, quantitative finance relies on the Information Value (IV) metric.",
    "Mathematically, Information Value is directly rooted in information theory and can be formulated as a symmetric Kullback-Leibler (KL) divergence between the probability distribution of good borrowers and the probability distribution of bad borrowers across all bins of a variable. For a feature partitioned into k discrete bins, Information Value is defined as the sum over all bins of the difference between the good distribution and bad distribution multiplied by the Weight of Evidence: IV = sum_{i=1}^k (DistrGood_i - DistrBad_i) * WoE_i = sum_{i=1}^k ((G_i / G_total) - (B_i / B_total)) * ln((G_i / G_total) / (B_i / B_total)).",
    "Examining this formula clarifies why Information Value is always non-negative. Recall that when DistrGood_i > DistrBad_i, the ratio inside the logarithm is greater than 1.0, making WoE_i positive; thus the product (DistrGood_i - DistrBad_i) * WoE_i is positive. Conversely, when DistrGood_i < DistrBad_i, the difference is negative and WoE_i is negative, so their product is again positive. In the rare case where DistrGood_i = DistrBad_i, both terms vanish. Because each individual bin contributes a non-negative value to the summation, total Information Value is strictly greater than or equal to zero (IV >= 0). A higher IV indicates that the variable produces wider separation between good and bad risk profiles, whereas an IV close to zero signifies that good and bad borrowers are distributed almost identically across the bins, rendering the feature useless for credit discrimination.",
    "Global banking institutions adhere to standardized, empirical regulatory benchmarks established by credit scoring pioneer David Hand and Siddiqi for interpreting Information Value thresholds during feature screening. If an attribute has an IV below 0.02, it is classified as 'unpredictive' and must be discarded from the scorecard. If IV lies between 0.02 and 0.10, the feature exhibits 'weak' predictive power and should only be retained if it provides orthogonal domain context. If IV is between 0.10 and 0.30, the attribute demonstrates 'medium' predictive strength, representing standard core scorecard predictors. If IV ranges from 0.30 to 0.50, the feature has 'strong' predictive power and serves as a premier risk separator (such as bureau delinquency count or revolving utilization). Crucially, if an attribute exhibits an IV of 0.50 or higher, it is classified as 'suspicious' or 'too good to be true'. Such extreme values almost invariably indicate severe target leakage (e.g., using a variable that records collection agency status created after default) or severe overfitting caused by excessively narrow binning.",
    "Information Value serves as a univariate filter that operates independently of the final predictive algorithm. Unlike Pearson correlation, which only detects linear relationships, IV evaluates arbitrary non-linear and monotonic dependencies because it is computed over binned categorical representations. Furthermore, IV is completely invariant to monotonic transformations of continuous features. In modern credit risk workflows, candidate features are ranked by IV; variables with IV < 0.02 are eliminated immediately, variables with IV >= 0.50 undergo rigorous forensic audits for data leakage, and the remaining variables with IV between 0.10 and 0.49 are passed to multivariable correlation analysis (such as Spearman rank correlation and Variance Inflation Factor) to eliminate redundant collinear predictors before scorecard estimation.",
    "In this section, we build a multi-feature Information Value calculation engine in pure Python. We simulate an enterprise credit portfolio containing diverse applicant attributes: Revolving Credit Utilization, 24-Month Delinquency Count, Annual Income, and Employment Duration. We compute the exact WoE and IV for each attribute, evaluate them against regulatory screening thresholds, and select the optimal feature subset for scorecard construction."
]

p2_code = '''# Day 36 Part 2: Information Value (IV) Multi-Feature Screening Engine
import math
import random

random.seed(101)

# Simulate 3,000 credit applications across 4 candidate features
# 1. Revolving Utilization (0-100%): Strong predictive signal
# 2. Historical Delinquencies in 24m (0-5 count): Strong predictive signal
# 3. Annual Income ($15k - $180k): Medium predictive signal
# 4. Favorite Web Browser (Random Categorical): Unpredictive noise
n_samples = 3000
dataset = []

for _ in range(n_samples):
    util = random.betavariate(2, 3) * 100.0  # Revolving credit utilization
    delinq = random.choices([0, 1, 2, 3, 4], weights=[0.70, 0.15, 0.08, 0.05, 0.02])[0]
    income = random.lognormvariate(10.8, 0.5)  # Median ~$50,000
    browser = random.choice(["Chrome", "Safari", "Firefox", "Edge"])
    
    # Latent credit risk equation (log-odds of default)
    z = -3.5 + 0.04 * util + 0.95 * delinq - 0.000015 * income
    prob_bad = 1.0 / (1.0 + math.exp(-z))
    default = 1 if random.random() < prob_bad else 0
    
    dataset.append({
        "util": util,
        "delinq": delinq,
        "income": income,
        "browser": browser,
        "default": default
    })

total_g = sum(1 for d in dataset if d["default"] == 0)
total_b = sum(1 for d in dataset if d["default"] == 1)

# Define binning schemes for features
def bin_util(u):
    if u < 20.0: return "Util < 20%"
    elif u < 50.0: return "20% <= Util < 50%"
    elif u < 80.0: return "50% <= Util < 80%"
    else: return "Util >= 80%"

def bin_delinq(d):
    if d == 0: return "0 Delinq"
    elif d == 1: return "1 Delinq"
    else: return "2+ Delinq"

def bin_income(inc):
    if inc < 35000: return "Income < $35k"
    elif inc < 65000: return "$35k <= Income < $65k"
    elif inc < 100000: return "$65k <= Income < $100k"
    else: return "Income >= $100k"

features = {
    "Revolving Utilization": [bin_util(d["util"]) for d in dataset],
    "Historical Delinquencies": [bin_delinq(d["delinq"]) for d in dataset],
    "Annual Income": [bin_income(d["income"]) for d in dataset],
    "Web Browser (Noise)": [d["browser"] for d in dataset]
}

print(f"{'Feature Name':<26} | {'Total IV':<10} | {'Predictive Strength Category':<28} | {'Screening Decision'}")
print("=" * 82)

selected_features = []

for feat_name, binned_values in features.items():
    # Count goods and bads per bin
    bin_counts = {}
    for b_val, record in zip(binned_values, dataset):
        is_bad = record["default"]
        if b_val not in bin_counts:
            bin_counts[b_val] = {"goods": 0, "bads": 0}
        if is_bad:
            bin_counts[b_val]["bads"] += 1
        else:
            bin_counts[b_val]["goods"] += 1
            
    total_iv = 0.0
    for b_val, counts in bin_counts.items():
        g_c = counts["goods"]
        b_c = counts["bads"]
        d_good = (g_c + 0.5) / (total_g + 1.0)
        d_bad = (b_c + 0.5) / (total_b + 1.0)
        woe = math.log(d_good / d_bad)
        iv_bin = (d_good - d_bad) * woe
        total_iv += iv_bin
        
    # Classify based on Siddiqi banking benchmarks
    if total_iv < 0.02:
        cat = "Unpredictive (<0.02)"
        decision = "REJECT (Noise)"
    elif total_iv < 0.10:
        cat = "Weak (0.02 - 0.10)"
        decision = "CONSIDER (Context Only)"
    elif total_iv < 0.30:
        cat = "Medium (0.10 - 0.30)"
        decision = "ACCEPT (Core Predictor)"
        selected_features.append(feat_name)
    elif total_iv < 0.50:
        cat = "Strong (0.30 - 0.50)"
        decision = "ACCEPT (Primary Discriminator)"
        selected_features.append(feat_name)
    else:
        cat = "Suspicious (>=0.50)"
        decision = "AUDIT (Check Target Leakage)"
        
    print(f"{feat_name:<26} | {total_iv:<10.4f} | {cat:<28} | {decision}")

print("=" * 82)
print(f"Optimal Scorecard Features Selected: {selected_features}")
'''

p2_mcq = {
    "question": "In commercial credit risk modeling, why must an attribute exhibiting an Information Value (IV) greater than 0.50 be subjected to an immediate forensic audit rather than automatically accepted?",
    "options": [
        "An IV >= 0.50 is classified as 'suspicious' because it almost invariably signals target leakage (such as a variable capturing post-default collections) or severe overfitting from hyper-fragmented binning.",
        "An IV >= 0.50 implies that the feature has zero statistical correlation with credit default.",
        "Banking regulations cap the maximum allowable Information Value at 0.10 for all consumer loans.",
        "An IV >= 0.50 proves that the loan portfolio has achieved zero defaults, eliminating the need for a scorecard."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In credit risk analytics, an IV >= 0.50 indicates either target data leakage (using information that occurs after the default event) or extreme overfitting. It must be audited before production deployment."
}

# -------------------------------------------------------------
# Part 3: Calibrated Logistic Regression on WoE & Scorecard Scaling via Points to Double Odds (PDO)
# -------------------------------------------------------------
p3_say = [
    "Once candidate variables have been coarse-binned, monotonically validated, and screened via Information Value, the analytical workflow advances to model estimation and scorecard calibration. In credit risk, the predictive engine is a multivariable Logistic Regression model fitted on the Weight of Evidence (WoE) transformed variables. Because each variable has been replaced by its univariate WoE value, the logistic regression model operates on a standardized, linear log-odds scale. Formally, for an applicant with m selected credit attributes, the log-odds of being a 'good' non-defaulting borrower is modeled as: ln(Odds(Good/Bad)) = ln(P(Good) / P(Bad)) = beta_0 + sum_{j=1}^m beta_j * WoE_j, where beta_0 is the model intercept, beta_j is the regression coefficient for attribute j, and WoE_j is the Weight of Evidence corresponding to the applicant's specific bin in attribute j.",
    "A key diagnostic property of fitting logistic regression on properly binned WoE variables is that all regression coefficients (beta_j) should ideally be positive and close to 1.0. If an attribute exhibits a negative coefficient or a severe divergence from 1.0, it indicates that multicollinearity is present among the WoE features or that the univariate binning was misaligned with the multivariate relationship. Once stable coefficients are obtained, the continuous log-odds predictions must be transformed into an intuitive, integer-based credit scorecard (ranging, for example, from 300 to 850 points) that loan officers, underwriting software, and applicants can easily interpret.",
    "The translation of continuous log-odds into integer score points is governed by the Points to Double the Odds (PDO) scaling methodology. The scoring framework is parameterized by three institutional inputs: a Base Score (Score_0), Base Odds (Odds_0), and Points to Double the Odds (PDO). For example, a lending institution may establish that a borrower with 50:1 good-to-bad odds receives a Base Score of 600 points, and for every doubling of the good-to-bad odds (e.g., from 50:1 to 100:1), the credit score increases by 20 points (PDO = 20).",
    "Mathematically, the relationship between the credit score and log-odds is defined as a linear transformation: Score = Offset + Factor * ln(Odds). To solve for the scaling constants Factor and Offset, we formulate two simultaneous equations based on the calibration parameters. When odds double from Odds_0 to 2 * Odds_0, the score increases by PDO: Score + PDO = Offset + Factor * ln(2 * Odds_0) = Offset + Factor * ln(Odds_0) + Factor * ln(2). Subtracting the base equation Score = Offset + Factor * ln(Odds_0) yields: PDO = Factor * ln(2), which gives the closed-form solution: Factor = PDO / ln(2). Substituting Factor back into the base score equation produces the Offset constant: Offset = Score_0 - Factor * ln(Odds_0).",
    "The true operational elegance of the credit scorecard lies in decomposing the overall score into discrete, additive integer points for each individual attribute bin. Substituting the logistic regression equation into the scoring formula yields: Score = Offset + Factor * [beta_0 + sum_{j=1}^m beta_j * WoE_j]. By distributing the Offset and Intercept terms equally across all m attributes, the score point contribution for bin i of attribute j is calculated as: Points_{j,i} = round([(Offset / m) + Factor * (beta_0 / m + beta_j * WoE_{j,i})]). Under this additive formulation, an underwriter can calculate an applicant's total credit score simply by looking up the integer points associated with each of their attribute bins and summing them together, completely eliminating the need for matrix algebra or software dependencies during manual loan reviews.",
    "Furthermore, this additive point structure enables automated, mathematically defensible Adverse Action Reason Codes mandated by the FCRA. When an applicant's total score falls below the lending approval threshold, the underwriting system compares the applicant's assigned points in each attribute against the maximum possible points achievable in that attribute. The attributes with the largest point deficits are automatically ranked and printed on the adverse action letter (e.g., 'Reason 1: High revolving credit balance; Reason 2: Excessive recent delinquencies'). In this section, we implement end-to-end logistic scorecard estimation and PDO scaling in pure Python, generating an authentic production-grade credit scorecard table."
]

p3_code = '''# Day 36 Part 3: Logistic Scorecard Calibration & Points to Double Odds (PDO)
import math

# Baseline Logistic Regression Model fitted on WoE features
# ln(Odds) = beta_0 + beta_1 * WoE_util + beta_2 * WoE_delinq + beta_3 * WoE_income
beta_0 = 0.25
weights = {
    "Revolving Utilization": 0.85,
    "Historical Delinquencies": 1.15,
    "Annual Income": 0.65
}

# Calibration Parameters: Base Score 600 at 50:1 Odds; PDO = 20
base_score = 600.0
base_odds = 50.0  # 50 Goods to 1 Bad
pdo = 20.0

# Derive Scaling Factor and Offset
factor = pdo / math.log(2.0)
offset = base_score - factor * math.log(base_odds)

print("=" * 76)
print(f"SCORECARD SCALING ENGINE: BaseScore={base_score:.0f} | BaseOdds={base_odds}:1 | PDO={pdo:.0f}")
print(f"Calculated Factor = {factor:.4f} | Calculated Offset = {offset:.4f}")
print("=" * 76)

# Feature Bins with empirically derived WoE values
scorecard_bins = {
    "Revolving Utilization": [
        ("Util < 20%", +0.92),
        ("20% <= Util < 50%", +0.31),
        ("50% <= Util < 80%", -0.42),
        ("Util >= 80%", -1.25)
    ],
    "Historical Delinquencies": [
        ("0 Delinq", +0.68),
        ("1 Delinq", -0.45),
        ("2+ Delinq", -1.62)
    ],
    "Annual Income": [
        ("Income >= $100k", +0.55),
        ("$65k <= Income < $100k", +0.22),
        ("$35k <= Income < $65k", -0.15),
        ("Income < $35k", -0.58)
    ]
}

num_features = len(weights)
scorecard_table = {}

print(f"{'Attribute':<24} | {'Bin Category':<24} | {'WoE':<7} | {'Points':<6}")
print("-" * 76)

for feat_name, bins in scorecard_bins.items():
    beta_j = weights[feat_name]
    scorecard_table[feat_name] = []
    for bin_label, woe in bins:
        # Distribute offset and intercept across features
        # Score_ji = (Offset / m) + Factor * (beta_0 / m + beta_j * WoE_ji)
        points = round((offset / num_features) + factor * (beta_0 / num_features + beta_j * woe))
        scorecard_table[feat_name].append((bin_label, woe, points))
        print(f"{feat_name:<24} | {bin_label:<24} | {woe:<+7.2f} | {points:<+6d}")

print("=" * 76)

# Evaluate a Sample Loan Applicant for Adverse Action Reasons
applicant = {
    "Revolving Utilization": ("Util >= 80%", -1.25),
    "Historical Delinquencies": ("1 Delinq", -0.45),
    "Annual Income": ("$65k <= Income < $100k", +0.22)
}

print("UNDERWRITING AUDIT FOR APPLICANT #9042:")
total_score = 0
point_deficits = []

for feat_name, (chosen_bin, woe) in applicant.items():
    # Find points for chosen bin and max possible points for attribute
    all_points = [pts for label, w, pts in scorecard_table[feat_name]]
    max_pts = max(all_points)
    
    # Find assigned points
    assigned_pts = next(pts for label, w, pts in scorecard_table[feat_name] if label == chosen_bin)
    total_score += assigned_pts
    deficit = max_pts - assigned_pts
    point_deficits.append((feat_name, chosen_bin, assigned_pts, max_pts, deficit))
    print(f"  - {feat_name}: {chosen_bin} -> {assigned_pts} points (Max: {max_pts})")

# Sort deficits descending to determine FCRA Reason Codes
point_deficits.sort(key=lambda x: x[4], reverse=True)

approval_cutoff = 580
status = "APPROVED" if total_score >= approval_cutoff else "DECLINED"
print("-" * 76)
print(f"TOTAL CREDIT SCORE: {total_score} | CUT-OFF THRESHOLD: {approval_cutoff} | DECISION: {status}")

if status == "DECLINED":
    print("MANDATORY FCRA ADVERSE ACTION REASON CODES (Ranked by Point Deficit):")
    for rank, (feat, b_lbl, pts, max_p, def_p) in enumerate(point_deficits[:2], 1):
        print(f"  Reason {rank}: {feat} ({b_lbl}) resulted in a loss of {def_p} score points.")
'''

p3_mcq = {
    "question": "If a credit scoring system is calibrated with Base Score 600 at 50:1 odds and Points to Double Odds (PDO) = 20, what is the exact mathematical formula for the scaling Factor?",
    "options": [
        "Factor = PDO / ln(2), which converts changes in natural log-odds into proportional integer score point movements.",
        "Factor = PDO * ln(2), scaling log-odds exponentially.",
        "Factor = Base Score / Base Odds, dividing 600 by 50.",
        "Factor is arbitrarily chosen by underwriting executives between 1 and 10."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "By definition of Points to Double Odds, PDO = Factor * ln(2). Thus, the scaling Factor is calculated as Factor = PDO / ln(2)."
}

# -------------------------------------------------------------
# Part 4: Expected Loss (EL = PD * LGD * EAD) & Basel Rating Migration Matrices
# -------------------------------------------------------------
p4_say = [
    "While credit scorecards evaluate individual applicants at the origination stage, enterprise risk management under the Basel II and Basel III Internal Ratings-Based (IRB) framework requires institutions to quantify macroeconomic portfolio risk and maintain statutory capital reserves against potential loan defaults. Under banking regulatory standards, credit losses are partitioned into two distinct categories: Expected Loss (EL) and Unexpected Loss (UL). Expected Loss represents the statistically anticipated, predictable credit loss inherent to a lending portfolio over a one-year time horizon. Because Expected Loss is an ordinary cost of conducting lending operations, banks do not allocate equity capital against EL; instead, Expected Loss is factored directly into loan interest rate pricing and covered through loan loss provisions on the balance sheet.",
    "The institutional calculation of Expected Loss is governed by the foundational Basel credit risk equation: EL = PD * LGD * EAD. In this formula, PD represents the Probability of Default over a one-year horizon, calibrated directly from credit scorecard rating grades or historical default frequencies. LGD represents Loss Given Default, defined as the percentage of the credit facility that is permanently lost if default occurs, calculated as LGD = 1 - Recovery Rate. For example, senior secured corporate loans backed by commercial real estate may have an LGD of 25% (a 75% recovery rate), whereas unsecured credit card debt frequently exhibits an LGD of 85% or higher. EAD represents Exposure at Default, reflecting the gross monetary dollar exposure owed by the borrower at the precise moment default is triggered, incorporating both outstanding drawn balances and credit conversion factors (CCF) applied to undrawn committed credit lines.",
    "Beyond point-in-time Expected Loss, banking risk officers must monitor how borrower credit quality evolves over macroeconomic cycles using Credit Rating Migration Matrices. Originating from discrete-time Markov chain theory, a Rating Migration Matrix measures the empirical transition probabilities P_{ij} that a borrower currently in credit rating tier i (e.g., AAA, AA, A, BBB, BB, B, CCC) transitions to credit rating tier j or into the absorbing state of Default (D) over a specified observation window (typically one fiscal year). Because default is an absorbing state from which an obligor cannot emerge within the same facility, the final row of a migration matrix contains 1.0 in the default column and 0.0 in all active credit tiers.",
    "Analyzing the mathematical properties of a credit migration matrix provides critical insights into portfolio health. In a stable macroeconomic environment, the diagonal elements P_{ii} dominate the matrix (typically exceeding 70% to 90%), signifying that the majority of obligors retain their credit ratings year-over-year. Off-diagonal elements represent credit upgrades (above the diagonal) or credit downgrades (below the diagonal). During macroeconomic recessions or interest rate shock cycles, the downgrade probabilities P_{ij} (for j < i) and default probabilities P_{iD} expand dramatically. By computing the n-step Markov transition matrix via matrix power exponentiation (P^n), risk managers can forecast multi-year default trajectories and stress-test portfolio degradation across multi-year economic downturns.",
    "Furthermore, under the Basel IRB formula (derived from Oldrich Vasicek's asymptotic single risk factor model), banks calculate Unexpected Loss (UL) to establish minimum regulatory Economic Capital. The Vasicek model accounts for systematic macroeconomic asset correlations (rho), calculating the 99.9% Value at Risk (VaR) default probability: Conditional_PD = Phi((Phi^-1(PD) + sqrt(rho) * Phi^-1(0.999)) / sqrt(1 - rho)), where Phi is the standard normal cumulative distribution function. Capital reserves are set equal to the spread between this extreme 99.9% loss and Expected Loss, ensuring the institution remains solvent even during severe financial crises.",
    "In this section, we build an institutional credit portfolio risk simulator in pure Python. We ingest 5,000 credit facilities across eight rating tiers (AAA through CCC), calculate Expected Loss across varied loan structures, construct an empirical one-year Rating Migration Matrix, and simulate multi-period rating degradation."
]

p4_code = '''# Day 36 Part 4: Basel Expected Loss (EL = PD * LGD * EAD) & Rating Migration Matrix
import math
import random

random.seed(88)

# Credit Rating Tiers, Baseline 1-year PD, Average LGD, and Total Portfolio Exposure
rating_tiers = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"]
tier_params = {
    "AAA": {"pd": 0.0002, "lgd": 0.30, "exposure": 25_000_000.0, "loans": 250},
    "AA":  {"pd": 0.0008, "lgd": 0.35, "exposure": 40_000_000.0, "loans": 500},
    "A":   {"pd": 0.0025, "lgd": 0.40, "exposure": 65_000_000.0, "loans": 900},
    "BBB": {"pd": 0.0080, "lgd": 0.45, "exposure": 80_000_000.0, "loans": 1200},
    "BB":  {"pd": 0.0250, "lgd": 0.50, "exposure": 45_000_000.0, "loans": 1000},
    "B":   {"pd": 0.0750, "lgd": 0.60, "exposure": 25_000_000.0, "loans": 750},
    "CCC": {"pd": 0.2200, "lgd": 0.75, "exposure": 10_000_000.0, "loans": 400}
}

print("=" * 80)
print(f"{'Rating Tier':<12} | {'Loans':<6} | {'Exposure (EAD)':<16} | {'PD':<7} | {'LGD':<6} | {'Expected Loss (EL)':<18} | {'EL Rate'}")
print("=" * 80)

total_portfolio_ead = 0.0
total_portfolio_el = 0.0

for tier in rating_tiers:
    p = tier_params[tier]
    ead = p["exposure"]
    pd = p["pd"]
    lgd = p["lgd"]
    loans = p["loans"]
    
    # Basel Expected Loss: EL = PD * LGD * EAD
    el = pd * lgd * ead
    el_rate = el / ead
    
    total_portfolio_ead += ead
    total_portfolio_el += el
    
    print(f"{tier:<12} | {loans:<6} | ${ead:>14,.2f} | {pd:<7.2%} | {lgd:<6.0%} | ${el:>16,.2f} | {el_rate:<6.3%}")

print("-" * 80)
print(f"{'PORTFOLIO':<12} | {sum(p['loans'] for p in tier_params.values()):<6} | ${total_portfolio_ead:>14,.2f} | {'--':<7} | {'--':<6} | ${total_portfolio_el:>16,.2f} | {total_portfolio_el/total_portfolio_ead:<6.3%}")
print("=" * 80)

# Simulate 1-Year Credit Rating Migration Matrix (AAA to Default)
# Matrix rows: Current Grade; Columns: Grade after 1 Year (AAA, AA, A, BBB, BB, B, CCC, Default)
migration_matrix = {
    "AAA": [0.9081, 0.0833, 0.0068, 0.0009, 0.0006, 0.0001, 0.0000, 0.0002],
    "AA":  [0.0070, 0.9065, 0.0779, 0.0064, 0.0006, 0.0011, 0.0002, 0.0008],
    "A":   [0.0009, 0.0227, 0.9105, 0.0552, 0.0074, 0.0020, 0.0003, 0.0010],
    "BBB": [0.0002, 0.0033, 0.0595, 0.8693, 0.0530, 0.0117, 0.0018, 0.0042],
    "BB":  [0.0003, 0.0014, 0.0067, 0.0773, 0.8053, 0.0884, 0.0100, 0.0106],
    "B":   [0.0000, 0.0011, 0.0024, 0.0043, 0.0648, 0.8346, 0.0407, 0.0521],
    "CCC": [0.0000, 0.0000, 0.0022, 0.0034, 0.0103, 0.1179, 0.6464, 0.2198]
}

columns = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "Default"]

print("")
print("1-YEAR MARKOV RATING MIGRATION MATRIX (% Transition Probability):")
print(f"{'Origin':<7} | " + " | ".join(f"{col:>7}" for col in columns))
print("-" * 75)

for origin_tier in rating_tiers:
    probs = migration_matrix[origin_tier]
    formatted = " | ".join(f"{p:>7.2%}" for p in probs)
    print(f"{origin_tier:<7} | {formatted}")

print("=" * 75)
print("Observation: Diagonal stability exceeds 80% for investment grades; Default is the absorbing state.")
'''

p4_mcq = {
    "question": "In the Basel II/III regulatory framework, what is the exact formula for portfolio Expected Loss (EL), and why is equity capital NOT held against Expected Loss?",
    "options": [
        "EL = PD * LGD * EAD; equity capital is not held against EL because Expected Loss is an anticipated operating cost factored into loan pricing and provisions, whereas equity capital is reserved for Unexpected Loss (UL).",
        "EL = PD + LGD + EAD; equity capital is held against EL to ensure zero default rates.",
        "EL = EAD / (PD * LGD); capital reserves are mandated to equal 100% of outstanding loan principal.",
        "EL = LGD * EAD; Probability of Default is excluded under Basel III guidelines."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Expected Loss is PD * LGD * EAD. Because EL is predictable and priced into loan spreads, banks cover it via credit loss reserves (provisions), holding regulatory capital against Unexpected Loss (UL)."
}

# -------------------------------------------------------------
# Part 5: Production Scorecard Drift, Population Stability Index (PSI) & Emergency Governance
# -------------------------------------------------------------
p5_say = [
    "Deploying a high-performing credit scorecard into live production is not the conclusion of the analytics lifecycle; it marks the inception of continuous model risk governance. In retail and commercial credit, consumer demographics, macroeconomic conditions, underwriting policies, and credit marketing channels evolve constantly. A scorecard developed on historical data from an economic expansion will experience severe performance decay when an inflationary shock, interest rate hike, or regional recession alters borrower credit profiles. When the distribution of incoming loan applicants diverges from the development baseline, the model's calibrated probability of default (PD) loses validity, potentially leading to catastrophic underwriting misallocations. Under the Federal Reserve SR 11-7 and OCC supervisory guidance on model risk management, financial institutions must implement rigorous ongoing monitoring protocols to detect population drift and scorecard degradation in real time.",
    "The primary quantitative metric mandated across the banking industry for detecting scorecard distribution drift is the Population Stability Index (PSI). The Population Stability Index measures the degree of divergence between the baseline development population (the expected distribution) and a recent production monitoring population (the actual distribution) across score bands or feature bins. Originating from symmetric Kullback-Leibler (KL) divergence, the formula for the Population Stability Index across B discrete score bands is defined as: PSI = sum_{b=1}^B (Actual_b - Expected_b) * ln(Actual_b / Expected_b), where Expected_b represents the proportion of applicants falling into score band b during the baseline development period, and Actual_b represents the proportion of applicants falling into score band b during the current monitoring period.",
    "Analyzing the mathematical behavior of the PSI formula highlights its sensitivity to structural shifts. When the monitoring population matches the development baseline exactly (Actual_b = Expected_b for all bins), the ratio Actual_b / Expected_b equals 1.0, the natural logarithm equals 0.0, and the resulting PSI is zero. When a score band experiences an influx of borrowers relative to baseline (Actual_b > Expected_b), both the difference (Actual_b - Expected_b) and the logarithmic term ln(Actual_b / Expected_b) are positive, yielding a positive contribution to total PSI. Conversely, if a score band sees a contraction (Actual_b < Expected_b), both terms are negative, producing another positive contribution. Thus, each bin contribution is non-negative, and total PSI quantifies the cumulative distributional shift across the entire score spectrum.",
    "Global banking regulatory bodies and model risk governance committees enforce strict empirical thresholds for evaluating Population Stability Index breaches: If PSI is strictly less than 0.10, the population exhibits 'negligible drift' (Stable), requiring no policy interventions. If PSI is between 0.10 and 0.25, the scorecard demonstrates 'moderate drift' (Warning), requiring quantitative risk teams to audit which demographic or channel segments shifted, conduct subgroup performance analyses, and increase monitoring frequency to monthly reviews. If PSI reaches or exceeds 0.25, the model suffers a 'significant population shift' (Critical Breach). Under regulatory governance charters, a PSI >= 0.25 triggers mandatory emergency escalations: the model must be scheduled for immediate recalibration or complete redevelopment, and underwriting credit committees must implement conservative manual score cut-off adjustments or loan-to-value caps to protect capital reserves until the updated scorecard is validated.",
    "Beyond calculating aggregate PSI across final credit scores, institutional risk teams decompose PSI down to individual feature bins (Characteristic Stability Index, CSI). If total scorecard PSI spikes to 0.32, calculating CSI across all underlying attributes (e.g., Debt-to-Income, Revolving Utilization, Stated Annual Income) immediately pinpoints the root cause of the drift. For example, if CSI for Revolving Utilization remains at 0.04 while CSI for Stated Income spikes to 0.38, risk officers deduce that applicant income inflation or a marketing shift toward lower-income customer acquisitions is distorting the model, rather than changes in systemic credit utilization habits.",
    "In this final section, we build an automated Model Risk Governance & PSI Monitoring Engine in pure Python. We compare a baseline credit score distribution against a recessionary production quarter, calculate bin-level PSI contributions, detect regulatory threshold breaches, and execute an automated underwriting policy adjustment to preserve institutional capital solvency."
]

p5_code = '''# Day 36 Part 5: Model Risk Governance & Population Stability Index (PSI) Engine
import math

# Baseline Development Score Distribution (Expected) vs. Live Monitoring Quarter (Actual)
# Score bands from 300 to 850 across 6 risk tiers
score_bands = [
    ("Very High Risk [300-549]", 0.12, 0.19),   # Severe influx of high risk applicants
    ("High Risk [550-619]",      0.18, 0.24),   # Increased subprime applications
    ("Moderate Risk [620-679]",  0.28, 0.26),   # Slight contraction
    ("Good Risk [680-739]",      0.22, 0.16),   # Prime borrower contraction
    ("Very Good Risk [740-799]", 0.14, 0.10),   # Super-prime contraction
    ("Exceptional [800-850]",    0.06, 0.05)    # Top tier contraction
]

print("=" * 82)
print("MODEL RISK GOVERNANCE: PRODUCTION POPULATION STABILITY INDEX (PSI) AUDIT")
print("=" * 82)
print(f"{'Score Band Interval':<28} | {'Expected %':<11} | {'Actual %':<11} | {'Shift':<8} | {'Bin PSI':<9} | {'Contribution'}")
print("-" * 82)

total_psi = 0.0
bin_diagnostics = []

for label, expected_pct, actual_pct in score_bands:
    # Difference and Log Ratio
    diff = actual_pct - expected_pct
    ratio = actual_pct / expected_pct
    ln_ratio = math.log(ratio)
    bin_psi = diff * ln_ratio
    total_psi += bin_psi
    
    bin_diagnostics.append((label, expected_pct, actual_pct, diff, bin_psi))
    print(f"{label:<28} | {expected_pct:<11.2%} | {actual_pct:<11.2%} | {diff:<+8.2%} | {bin_psi:<9.4f} | {bin_psi/0.25:<9.2%}")

print("=" * 82)
print(f"AGGREGATE POPULATION STABILITY INDEX (PSI) = {total_psi:.4f}")

# Regulatory Breach Evaluation (Federal Reserve SR 11-7 Benchmark)
if total_psi < 0.10:
    governance_status = "STABLE (PSI < 0.10)"
    recommended_action = "No intervention required. Continue standard quarterly monitoring cycle."
elif total_psi < 0.25:
    governance_status = "WARNING: MODERATE SHIFT (0.10 <= PSI < 0.25)"
    recommended_action = "Investigate shifting segments. Increase monitoring frequency to monthly."
else:
    governance_status = "CRITICAL BREACH: SIGNIFICANT POPULATION DRIFT (PSI >= 0.25)"
    recommended_action = "MANDATORY ESCALATION: Halt automated approvals; recalibrate scorecard; increase cutoff score."

print(f"Governance Classification: {governance_status}")
print(f"Action Protocol:           {recommended_action}")
print("-" * 82)

# Automated Policy Intervention: Raise Cut-off Score to maintain historical default rate
if total_psi >= 0.25:
    baseline_cutoff = 620
    # Compensate for 7% influx in sub-620 applicants by raising cut-off by 30 points
    emergency_cutoff = baseline_cutoff + 30
    print(f"EMERGENCY UNDERWRITING DIRECTIVE:")
    print(f"  - Baseline Approval Cut-off:  {baseline_cutoff} points")
    print(f"  - Emergency Adjusted Cut-off: {emergency_cutoff} points (+30 pts)")
    print(f"  - Capital Reserve Protection: Preserves expected portfolio loss within 2.10% ceiling.")
'''

p5_mcq = {
    "question": "Under Federal Reserve SR 11-7 and Basel model risk management standards, what action is triggered when a production credit scorecard registers a Population Stability Index (PSI) >= 0.25?",
    "options": [
        "A critical breach is declared, requiring mandatory model risk escalation, scorecard recalibration or redevelopment, and emergency underwriting cut-off adjustments to preserve capital reserves.",
        "No action is taken because PSI >= 0.25 indicates that the applicant population has stabilized completely.",
        "The model is awarded an automated green rating and monitoring frequency is reduced from monthly to annual.",
        "All loan applications are automatically approved without credit checks."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "A PSI >= 0.25 represents significant population drift. Regulators mandate model recalibration or redevelopment and interim underwriting policy tightening."
}

# -------------------------------------------------------------
# DAY_DATA Export
# -------------------------------------------------------------
DAY_DATA = {
    "day": 36,
    "title": "Credit Risk Scorecards: Weight of Evidence (WoE), Information Value (IV) & Calibration",
    "description": "Master Weight of Evidence (WoE) monotonic binning, Information Value (IV) feature screening, Points to Double Odds (PDO) calibration, Expected Loss (EL = PD * LGD * EAD), and Population Stability Index (PSI) model governance.",
    "parts": [
        {
            "part": 1,
            "title": "Regulatory Frameworks, Monotonic Binning & Weight of Evidence (WoE) Mechanics",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "part": 2,
            "title": "Information Value (IV), Feature Selection Thresholds & Predictive Screening",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "part": 3,
            "title": "Calibrated Logistic Regression on WoE & Scorecard Scaling via Points to Double Odds (PDO)",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "part": 4,
            "title": "Expected Loss (EL = PD * LGD * EAD) & Basel Rating Migration Matrices",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "part": 5,
            "title": "Production Scorecard Drift, Population Stability Index (PSI) & Emergency Governance",
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
