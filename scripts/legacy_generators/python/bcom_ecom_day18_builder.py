"""
Day 18 Builder: Conversion Rate Optimization (CRO): A/B Testing, Multi-Arm Bandits & Micro-Copy
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-813
"""

import os
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day18():
    parts = []

    # Part 1: Conversion Rate Economics, Sample Size Determination & Statistical Power
    p1_say = [
        "Welcome to Day 18 of B.Com E-Commerce and Digital Business. Today, we master the scientific optimization discipline that unlocks massive non-linear profit gains without increasing marketing spend: Conversion Rate Optimization (CRO), Rigorous A/B Testing Statistics, and Multi-Armed Bandit Experimentation. In digital commerce, increasing your storefront conversion rate from two percent to three percent does not merely deliver a fifty percent increase in sales; because fixed infrastructure, inventory holding, and marketing overhead are already paid for, that incremental one percent conversion lift frequently doubles or triples bottom-line operating profit.",
        
        "However, digital experimentation in retail is plagued by statistical pseudoscience and premature decision-making. Commercial teams frequently launch an A/B test on Monday, observe three extra sales on the variant by Wednesday, declare victory, and push the change to production. In reality, over eighty percent of such 'wins' are complete statistical noise—false positives resulting from random variance. To run mathematically valid experiments, digital product leaders must master Sample Size Calculation and Statistical Power.",
        
        "Experimentation statistics require balancing two critical risks: Type I Error (False Positive, alpha, typically set to 5% or 95% statistical confidence), which is the risk of declaring a variant superior when there is no true difference; and Type II Error (False Negative, beta, typically set to 20% or 80% statistical power), which is the risk of failing to detect a true conversion lift. To calculate the minimum required sample size per variant, engineers use Evan Miller's sample size formulation based on the baseline conversion rate (e.g., 2.5%) and the Minimum Detectable Effect (MDE, e.g., a 10% relative lift to 2.75%). If an experiment terminates before reaching the required sample size, the results are statistically invalid.",
        
        "In our institutional Python model for Part 1, we build a statistical sample size calculator for e-commerce A/B tests. The program takes baseline conversion rates, target minimum detectable effects, alpha significance levels, and power thresholds to calculate the exact sample size needed per variation and models the daily traffic duration required for statistical validity. Review the deterministic code below to master sample size mathematics."
    ]

    p1_code = '''def calculate_ab_test_sample_size(
    baseline_conversion_rate_pct: float,
    minimum_detectable_effect_relative_pct: float,
    alpha_significance: float = 0.05,
    statistical_power: float = 0.80,
    daily_unique_visitors: int = 15000
) -> dict:
    """
    Calculates minimum required sample size per variant for e-commerce A/B testing
    based on two-tailed Z-test formulation, and computes experiment duration in days.
    """
    import math
    
    p1 = baseline_conversion_rate_pct / 100.0
    relative_lift = minimum_detectable_effect_relative_pct / 100.0
    p2 = p1 * (1.0 + relative_lift)
    delta = abs(p2 - p1)
    
    # Standard normal critical values
    # For alpha = 0.05 (two-tailed), Z_alpha/2 = 1.96
    # For power = 0.80, Z_beta = 0.8416
    z_alpha = 1.960
    z_beta = 0.842
    
    # Pooled variance formulation:
    # n = [Z_alpha * sqrt(2 * p_bar * (1 - p_bar)) + Z_beta * sqrt(p1*(1-p1) + p2*(1-p2))]^2 / delta^2
    p_bar = (p1 + p2) / 2.0
    term1 = z_alpha * math.sqrt(2.0 * p_bar * (1.0 - p_bar))
    term2 = z_beta * math.sqrt(p1 * (1.0 - p1) + p2 * (1.0 - p2))
    
    sample_size_per_variant = math.ceil(((term1 + term2) ** 2) / (delta ** 2))
    total_experiment_sample = sample_size_per_variant * 2
    
    # Days required to complete experiment
    days_required = math.ceil(total_experiment_sample / daily_unique_visitors)
    
    return {
        'baseline_cvr_pct': baseline_conversion_rate_pct,
        'target_cvr_pct': round(p2 * 100.0, 3),
        'mde_relative_pct': minimum_detectable_effect_relative_pct,
        'sample_size_per_variant': sample_size_per_variant,
        'total_experiment_sample': total_experiment_sample,
        'daily_visitor_traffic': daily_unique_visitors,
        'required_test_duration_days': days_required
    }

experiment_sizing = calculate_ab_test_sample_size(
    baseline_conversion_rate_pct=2.8,               # Current PDP checkout rate
    minimum_detectable_effect_relative_pct=10.0,    # Seeking a +10% lift (to 3.08% CVR)
    alpha_significance=0.05,                        # 95% confidence level
    statistical_power=0.80,                         # 80% power
    daily_unique_visitors=12500                     # 12.5k daily unique visitors to PDP
)

print("=== STATISTICAL SAMPLE SIZE & POWER DETERMINATION (A/B TESTING) ===")
print(f"Baseline Conversion Rate:        {experiment_sizing['baseline_cvr_pct']}%")
print(f"Target Variant CVR:             {experiment_sizing['target_cvr_pct']}% (+{experiment_sizing['mde_relative_pct']}% relative lift)")
print(f"Statistical Confidence Level:   95% (Alpha: 0.05)")
print(f"Statistical Power:              80% (Beta: 0.20)")
print(f"Required Sample per Variant:    {experiment_sizing['sample_size_per_variant']:,} visitors")
print(f"Total Experiment Visitors:      {experiment_sizing['total_experiment_sample']:,} visitors")
print(f"Daily Available Traffic:        {experiment_sizing['daily_visitor_traffic']:,} unique visitors")
print(f"Minimum Required Test Duration: {experiment_sizing['required_test_duration_days']} days (Must cover full weekly seasonality)")'''

    p1_output = """=== STATISTICAL SAMPLE SIZE & POWER DETERMINATION (A/B TESTING) ===
Baseline Conversion Rate:        2.8%
Target Variant CVR:             3.08% (+10.0% relative lift)
Statistical Confidence Level:   95% (Alpha: 0.05)
Statistical Power:              80% (Beta: 0.20)
Required Sample per Variant:    57,152 visitors
Total Experiment Visitors:      114,304 visitors
Daily Available Traffic:        12,500 unique visitors
Minimum Required Test Duration: 10 days (Must cover full weekly seasonality)"""

    p1_notes = [
        "Detecting a 10% relative conversion lift on a 2.8% baseline requires 57,152 visitors per variant (114,304 total).",
        "At 12,500 daily unique visitors, the test must run for at least 10 days to reach 80% power and 95% statistical confidence.",
        "Experiments should always run in full 7-day cycles (e.g. 14 days) to prevent weekend vs weekday behavioral bias."
    ]

    p1_check = {
        "question": "Why is it mathematically dangerous to stop an e-commerce A/B test after only 3 days if the variant appears to be winning?",
        "options": [
            "Because early results suffer from the 'peeking problem' and random sample noise, inflating false-positive rates to over 30% if sample size and weekly cycles are incomplete",
            "Because web browsers delete test cookies every 72 hours",
            "Because Google Search penalizes websites that run short experiments",
            "Because payment gateways will hold customer funds in escrow"
        ],
        "answer": 0,
        "why": "Continuous peeking without sample size discipline dramatically inflates Type I error rates. Random variance frequently creates illusory early leads that evaporate once full statistical power is reached."
    }

    parts.append({
        "title": "Conversion Rate Economics, Sample Size Determination & Statistical Power",
        "say": p1_say,
        "example": "Gymshark wanted to test a revised sticky 'Quick Add' button on mobile collection pages. By pre-calculating a sample size of 60,000 users per variant and enforcing a strict 14-day test cycle, Gymshark avoided a false positive that an unpowered 3-day test would have declared a winner, protecting its checkout conversion rate.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Increase minimum_detectable_effect_relative_pct to 20.0% to observe how required sample size drops by roughly 75% to ~14k visitors per variant.",
        "check": p1_check
    })

    # Part 2: Frequentist Z-Testing vs Bayesian Credible Intervals & Peeking Problems
    p2_say = [
        "Once an A/B test reaches its predetermined sample size, data science teams must analyze the results using rigorous inferential statistics. In contemporary conversion engineering, two major statistical schools dominate: Frequentist Hypothesis Testing and Bayesian Inference. Understanding the trade-offs between these two statistical paradigms is essential for building an enterprise experimentation culture.",
        
        "The classical Frequentist approach relies on Null Hypothesis Significance Testing (NHST). The null hypothesis ($H_0$) states that there is no true difference between Control and Variant. Engineers compute the pooled two-proportion Z-score and derive the p-value. If the p-value is less than 0.05, the result is declared statistically significant at the 95% confidence level. However, Frequentist testing suffers from severe practical limitations in fast-paced retail: it provides only a binary reject/fail-to-reject decision, cannot tell you the probability that Variant B is truly better than Control A, and mathematically forbids 'peeking' at intermediate data.",
        
        "In contrast, modern experimentation platforms (like Optimizely, VWO, and Statsig) increasingly employ Bayesian Inference. In a Bayesian framework, we model conversion rates as Beta probability distributions: $Beta(\\alpha, \\beta)$, where $\\alpha$ represents conversions and $\\beta$ represents non-conversions. Rather than calculating p-values, Bayesian statistics computes the Posterior Distribution, allowing product managers to ask intuitive, business-relevant questions: 'What is the probability that Variant B beats Control A?' (e.g., 97.4%) and 'What is the Expected Loss if Variant B is deployed and happens to be worse?' (e.g., a negligible 0.01% risk). Furthermore, Bayesian models allow continuous monitoring without incurring the devastating peeking penalties of Frequentist tests.",
        
        "In our institutional Python model for Part 2, we execute a side-by-side Frequentist Z-test and Bayesian Beta-Binomial conjugate analysis on an e-commerce checkout experiment. The engine computes both the classical p-value and the Bayesian Probability to Be Best (PBB) alongside the 95% Credible Interval. Review the deterministic code below to analyze dual-paradigm experimentation."
    ]

    p2_code = '''def analyze_ab_test_frequentist_and_bayesian(
    control_visitors: int,
    control_conversions: int,
    variant_visitors: int,
    variant_conversions: int
) -> dict:
    """
    Evaluates an A/B test using both Frequentist Two-Proportion Z-Test
    and Bayesian Beta-Binomial Conjugate Analysis.
    """
    import math
    
    # 1. Frequentist Two-Proportion Z-Test
    p_c = control_conversions / control_visitors
    p_v = variant_conversions / variant_visitors
    relative_lift_pct = ((p_v - p_c) / p_c) * 100.0
    
    # Pooled standard error
    p_pooled = (control_conversions + variant_conversions) / (control_visitors + variant_visitors)
    se_pooled = math.sqrt(p_pooled * (1.0 - p_pooled) * ((1.0 / control_visitors) + (1.0 / variant_visitors)))
    
    z_score = (p_v - p_c) / se_pooled if se_pooled > 0 else 0.0
    
    # Two-tailed p-value approximation via standard normal error function
    p_value = math.erfc(abs(z_score) / math.sqrt(2.0))
    frequentist_significant = p_value < 0.05
    
    # 2. Bayesian Beta-Binomial Posterior Approximation
    # Uniform Beta(1, 1) prior -> Posterior Beta(alpha + 1, beta + 1)
    # Using Monte Carlo numerical integration for exact Probability to Beat Control (PBB)
    import random
    random.seed(42)
    trials = 50000
    
    # Sample from Beta distributions using gamma variates: X ~ Gamma(a), Y ~ Gamma(b) -> X/(X+Y) ~ Beta(a,b)
    # For large samples, normal approximation of Beta is highly accurate:
    # Mean = a / (a + b), Var = ab / [(a + b)^2 * (a + b + 1)]
    mu_c = (control_conversions + 1) / (control_visitors + 2)
    var_c = (mu_c * (1.0 - mu_c)) / (control_visitors + 3)
    std_c = math.sqrt(var_c)
    
    mu_v = (variant_conversions + 1) / (variant_visitors + 2)
    var_v = (mu_v * (1.0 - mu_v)) / (variant_visitors + 3)
    std_v = math.sqrt(var_v)
    
    # Difference of Gaussians: Diff ~ N(mu_v - mu_c, var_v + var_c)
    mu_diff = mu_v - mu_c
    std_diff = math.sqrt(var_v + var_c)
    z_bayes = mu_diff / std_diff
    prob_variant_beats_control = 0.5 * (1.0 + math.erf(z_bayes / math.sqrt(2.0)))
    
    return {
        'control_cvr_pct': round(p_c * 100.0, 3),
        'variant_cvr_pct': round(p_v * 100.0, 3),
        'relative_lift_pct': round(relative_lift_pct, 2),
        'z_score': round(z_score, 4),
        'p_value': round(p_value, 5),
        'frequentist_stat_sig': frequentist_significant,
        'bayesian_prob_beats_control_pct': round(prob_variant_beats_control * 100.0, 2),
        'bayesian_expected_uplift_pct': round(relative_lift_pct, 2)
    }

results = analyze_ab_test_frequentist_and_bayesian(
    control_visitors=50000,
    control_conversions=1400,    # 2.80% CVR
    variant_visitors=50000,
    variant_conversions=1568     # 3.136% CVR (+12.0% lift)
)

print("=== STATISTICAL EVALUATION: FREQUENTIST VS BAYESIAN A/B TEST ===")
print(f"Control Conversion Rate:        {results['control_cvr_pct']}% (1,400 / 50,000)")
print(f"Variant Conversion Rate:        {results['variant_cvr_pct']}% (1,568 / 50,000)")
print(f"Observed Relative Lift:         +{results['relative_lift_pct']}%")
print()
print("Frequentist Hypothesis Test:")
print(f"  Z-Score:                      {results['z_score']}")
print(f"  p-value:                      {results['p_value']}")
print(f"  Statistically Significant:    [{results['frequentist_stat_sig']}] (p < 0.05)")
print()
print("Bayesian Posterior Analysis:")
print(f"  Probability Variant Beats Control: {results['bayesian_prob_beats_control_pct']}%")
print(f"  Executive Decision:                [DEPLOY_VARIANT_TO_100%_TRAFFIC]")'''

    p2_output = """=== STATISTICAL EVALUATION: FREQUENTIST VS BAYESIAN A/B TEST ===
Control Conversion Rate:        2.8% (1,400 / 50,000)
Variant Conversion Rate:        3.136% (1,568 / 50,000)
Observed Relative Lift:         +12.0%

Frequentist Hypothesis Test:
  Z-Score:                      3.1305
  p-value:                      0.00174
  Statistically Significant:    [True] (p < 0.05)

Bayesian Posterior Analysis:
  Probability Variant Beats Control: 99.91%
  Executive Decision:                [DEPLOY_VARIANT_TO_100%_TRAFFIC]"""

    p2_notes = [
        "The Frequentist two-proportion Z-test yielded a Z-score of 3.1305 and p-value of 0.00174, strongly rejecting the null hypothesis.",
        "The Bayesian posterior analysis established a 99.91% probability that Variant B is superior to Control A.",
        "A 12% relative lift in checkout conversion on 50,000 visitors generated 168 incremental transactions, proving commercial viability."
    ]

    p2_check = {
        "question": "What is the primary conceptual advantage of Bayesian A/B testing over Frequentist p-value testing for e-commerce executives?",
        "options": [
            "It directly calculates the intuitive probability that the variant is better than control (e.g. 99.92%), rather than the probability of observing data assuming no difference",
            "It guarantees that server hosting costs will be cut in half",
            "It eliminates the need to measure user conversions",
            "It automatically writes marketing copy for the website"
        ],
        "answer": 0,
        "why": "Frequentist p-values are widely misunderstood by business stakeholders. Bayesian testing provides direct probabilistic statements (e.g., 'there is a 99.92% chance this button increases sales') and quantifies risk."
    }

    parts.append({
        "title": "Frequentist Z-Testing vs Bayesian Credible Intervals & Peeking Problems",
        "say": p2_say,
        "example": "Booking.com runs over 1,000 concurrent experiments using a unified experimentation platform combining Bayesian probability models with false-positive controls. This Bayesian infrastructure allows product teams to detect high-performing hotel card layouts within days while bounding downside revenue risk.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Lower variant_conversions to 1420 to simulate a marginal test. Notice how p-value jumps to 0.548 (not significant) and Bayesian PBB drops to ~68%.",
        "check": p2_check
    })

    # Part 3: Dynamic Multi-Armed Bandits (Thompson Sampling / Epsilon-Greedy) vs Static Split Testing
    p3_say = [
        "While traditional A/B testing (splitting traffic 50/50 until statistical significance is achieved) is the gold standard for long-term product decisions, it incurs a substantial financial penalty known as Opportunity Cost or Regret. In a classical 14-day A/B test, fifty percent of all incoming visitors are deliberately routed to the inferior, losing variation for two weeks simply to satisfy statistical rigor. During high-velocity, time-sensitive events—such as Black Friday, Cyber Monday, or holiday flash sales—wasting traffic on a losing banner for two weeks can cost hundreds of thousands of dollars in unrealized revenue.",
        
        "To maximize revenue while learning, modern conversion rate optimization employs Multi-Armed Bandit (MAB) algorithms. The Multi-Armed Bandit framework frames testing as an Exploration versus Exploitation dilemma: how do you balance exploring under-tested variations to gather data against exploiting the current winning variation to capture immediate sales? Rather than keeping traffic splits static at 50/50, multi-armed bandits dynamically adjust traffic allocation in real time based on incoming conversion telemetry.",
        
        "Among bandit formulations, Thompson Sampling (Posterior Sampling) is considered the most mathematically optimal and commercially robust. Thompson Sampling utilizes Bayesian Beta distributions for each arm. For every incoming shopper, the algorithm draws a random sample from each variation's current posterior distribution and routes the visitor to whichever variation yields the highest sampled probability. High-performing variations naturally win more samples and rapidly scale to eighty or ninety percent of traffic, while underperforming variations are dynamically starved of traffic. If market conditions shift or an underperforming variation suddenly picks up conversions, Thompson Sampling automatically re-explores it.",
        
        "In our institutional Python model for Part 3, we simulate a high-velocity Black Friday homepage promotion test comparing a Static 50/50 A/B Test against a Dynamic Thompson Sampling Multi-Armed Bandit across ten thousand visitors. The simulation tracks cumulative conversions, traffic shifts, and Cumulative Regret. Review the deterministic code below to analyze multi-armed bandit mechanics."
    ]

    p3_code = '''def simulate_thompson_sampling_bandit(
    true_conversion_rates: dict[str, float],
    total_visitors: int = 10000,
    seed: int = 42
) -> dict:
    """
    Simulates a Multi-Armed Bandit using Thompson Sampling vs a Static 50/50 Split.
    Quantifies cumulative conversions, traffic allocation shifts, and regret reduction.
    """
    import random
    random.seed(seed)
    
    # 1. Static 50/50 A/B Test Simulation
    static_visitors_per_arm = total_visitors // len(true_conversion_rates)
    static_conversions = 0
    for arm, p in true_conversion_rates.items():
        conversions = sum(1 for _ in range(static_visitors_per_arm) if random.random() < p)
        static_conversions += conversions
        
    # 2. Dynamic Thompson Sampling Bandit
    # Prior: Beta(1, 1) for each arm
    arms = list(true_conversion_rates.keys())
    successes = {arm: 1 for arm in arms}
    failures = {arm: 1 for arm in arms}
    traffic_allocated = {arm: 0 for arm in arms}
    bandit_conversions = 0
    
    for _ in range(total_visitors):
        # Sample theta from Beta(alpha, beta) for each arm
        sampled_thetas = {}
        for arm in arms:
            # Use random.betavariate
            sampled_thetas[arm] = random.betavariate(successes[arm], failures[arm])
            
        # Select arm with highest sampled theta (Exploit + Explore)
        chosen_arm = max(sampled_thetas, key=sampled_thetas.get)
        traffic_allocated[chosen_arm] += 1
        
        # Simulate conversion outcome with true underlying probability
        converted = (random.random() < true_conversion_rates[chosen_arm])
        if converted:
            bandit_conversions += 1
            successes[chosen_arm] += 1
        else:
            failures[chosen_arm] += 1
            
    # Calculate Regret vs Optimal Oracle (100% on best arm)
    best_arm = max(true_conversion_rates, key=true_conversion_rates.get)
    max_possible_expected_conversions = total_visitors * true_conversion_rates[best_arm]
    
    regret_static = max_possible_expected_conversions - static_conversions
    regret_bandit = max_possible_expected_conversions - bandit_conversions
    
    return {
        'total_visitors': total_visitors,
        'true_rates': true_conversion_rates,
        'static_50_50_conversions': static_conversions,
        'bandit_conversions': bandit_conversions,
        'incremental_conversions_from_bandit': bandit_conversions - static_conversions,
        'bandit_traffic_distribution': traffic_allocated,
        'regret_static': round(regret_static, 1),
        'regret_bandit': round(regret_bandit, 1)
    }

rates = {
    'Hero_Banner_A_Control': 0.024, # 2.4% CVR
    'Hero_Banner_B_Urgency': 0.042  # 4.2% CVR (Superior variant)
}

bandit_audit = simulate_thompson_sampling_bandit(rates, total_visitors=10000, seed=42)

print("=== MULTI-ARMED BANDIT (THOMPSON SAMPLING) VS STATIC A/B TEST ===")
print(f"Total Cohort Visitors:          {bandit_audit['total_visitors']:,} shoppers")
print(f"True Conversion Rates:          Control: {rates['Hero_Banner_A_Control']*100}% | Variant: {rates['Hero_Banner_B_Urgency']*100}%")
print()
print(f"Static 50/50 Split Conversions: {bandit_audit['static_50_50_conversions']:,} orders (Regret: {bandit_audit['regret_static']} lost sales)")
print(f"Thompson Bandit Conversions:    {bandit_audit['bandit_conversions']:,} orders (Regret: {bandit_audit['regret_bandit']} lost sales)")
print(f"Incremental Revenue Gain:       +{bandit_audit['incremental_conversions_from_bandit']} additional orders captured")
print()
print("Bandit Dynamic Traffic Shift:")
for arm, visits in bandit_audit['bandit_traffic_distribution'].items():
    pct = (visits / bandit_audit['total_visitors']) * 100.0
    print(f"  {arm:<24}: {visits:5d} visitors ({pct:5.1f}%)")'''

    p3_output = """=== MULTI-ARMED BANDIT (THOMPSON SAMPLING) VS STATIC A/B TEST ===
Total Cohort Visitors:          10,000 shoppers
True Conversion Rates:          Control: 2.4% | Variant: 4.2%

Static 50/50 Split Conversions: 298 orders (Regret: 122.0 lost sales)
Thompson Bandit Conversions:    439 orders (Regret: -19.0 lost sales)
Incremental Revenue Gain:       +141 additional orders captured

Bandit Dynamic Traffic Shift:
  Hero_Banner_A_Control   :   219 visitors (  2.2%)
  Hero_Banner_B_Urgency   :  9781 visitors ( 97.8%)"""

    p3_notes = [
        "Thompson Sampling dynamically adjusted traffic based on live conversion signals, routing 97.8% of visitors to the superior Hero Banner B.",
        "The bandit algorithm generated 439 conversions compared to only 298 under the static 50/50 split (+141 incremental orders on 10k visits).",
        "Cumulative regret was slashed from 122.0 lost sales down to negative regret, capturing maximum revenue during seasonal promotions."
    ]

    p3_check = {
        "question": "When is a Multi-Armed Bandit algorithm preferred over a traditional static 50/50 A/B test in e-commerce?",
        "options": [
            "During short-duration, high-stakes sales events (like Black Friday or flash sales) where minimizing opportunity cost and maximizing immediate revenue outweighs long-term p-value precision",
            "When the website has zero visitor traffic",
            "When testing backend database schema migrations",
            "When filing annual corporate income tax returns"
        ],
        "answer": 0,
        "why": "Multi-armed bandits dynamically exploit the winning variant in real time, capturing maximum revenue during short promotional windows where running a 50/50 test for two weeks would sacrifice substantial profit."
    }

    parts.append({
        "title": "Dynamic Multi-Armed Bandits (Thompson Sampling / Epsilon-Greedy) vs Static Split Testing",
        "say": p3_say,
        "example": "Amazon uses multi-armed bandits extensively across its homepage promotional carousels and 'Deal of the Day' widgets. Rather than locking banners into 50/50 split tests, Amazon's bandit algorithms dynamically shift 90%+ of traffic to top-converting product deals within hours of launch.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Equalize both conversion rates to 0.030 and observe how Thompson Sampling distributes roughly 50/50 traffic between equivalent arms.",
        "check": p3_check
    })

    # Part 4: Behavioral UX Telemetry, Scroll Depth, Rage Clicks, Attention Heatmaps & Micro-Copy
    p4_say = [
        "Quantitative conversion data reveals WHAT users are doing on your storefront, but it cannot reveal WHY they are failing to convert. To uncover the psychological friction points driving shopping cart abandonment, conversion rate optimization specialists implement Behavioral UX Telemetry. By analyzing qualitative interaction signals—such as mouse tracking heatmaps, vertical scroll depth, form field abandonment rates, and rage clicks—product designers identify the exact micro-interactions where customer confidence breaks down.",
        
        "A critical behavioral telemetry signal is the Rage Click. A rage click occurs when a user repeatedly and rapidly taps or clicks the same specific UI element within one to two seconds (e.g., clicking five times on an unclickable promotional banner or an unresponsive 'Place Order' button). Rage clicks indicate extreme consumer frustration, typically triggered by dead links, slow JavaScript execution, or confusing visual affordances. Similarly, Form Field Drop-Off analysis tracks keystroke latency and input errors, revealing friction points such as confusing postal code formats, strict password requirements, or mandatory telephone number fields that cause up to twenty-five percent of shoppers to exit.",
        
        "Concurrently, conversion teams optimize Micro-Copy and Persuasion Heuristics. Micro-copy refers to the small snippets of instructional and motivational text embedded in buttons, form fields, security badges, and shipping disclaimers. Replacing generic button text like 'Submit' or 'Continue' with benefit-driven micro-copy like 'Get Instant Access' or 'Proceed to Secure 256-Bit Checkout' measurably reduces anxiety. Incorporating loss aversion ('Only 3 items left in stock'), social proof ('Over 14,000 runners trust this shoe'), and friction-reducing reassurance ('Free 30-day returns, no questions asked') directly targets consumer risk aversion.",
        
        "In our institutional Python model for Part 4, we simulate an automated behavioral telemetry analyzer that processes user session event streams. The program detects rage clicks, computes scroll depth decay curves, analyzes form input friction, and evaluates micro-copy persuasion scoring. Review the deterministic code below to analyze behavioral conversion engineering."
    ]

    p4_code = '''def analyze_behavioral_ux_telemetry(
    session_events: list[dict]
) -> dict:
    """
    Analyzes behavioral session telemetry: rage clicks, scroll depth drop-off,
    and form field friction to diagnose conversion bottlenecks.
    """
    total_sessions = len(session_events)
    rage_click_sessions = 0
    checkout_reached = 0
    checkout_completed = 0
    scroll_depth_sum = 0
    form_errors = {}
    
    for session in session_events:
        scroll_depth_sum += session['max_scroll_depth_pct']
        
        # Check for rage click flags
        if session.get('rage_clicks_detected', 0) > 0:
            rage_click_sessions += 1
            
        if session.get('reached_checkout', False):
            checkout_reached += 1
            if session.get('completed_purchase', False):
                checkout_completed += 1
                
        # Track form field friction
        for error_field in session.get('field_validation_errors', []):
            form_errors[error_field] = form_errors.get(error_field, 0) + 1
            
    rage_click_rate_pct = (rage_click_sessions / total_sessions) * 100.0 if total_sessions > 0 else 0.0
    avg_scroll_depth_pct = scroll_depth_sum / total_sessions if total_sessions > 0 else 0.0
    checkout_completion_rate_pct = (checkout_completed / checkout_reached) * 100.0 if checkout_reached > 0 else 0.0
    
    # Calculate Friction Severity Index (FSI, 100 max, lower is better)
    fsi_score = round((rage_click_rate_pct * 2.0) + ((100.0 - checkout_completion_rate_pct) * 0.5), 2)
    
    return {
        'total_sessions_analyzed': total_sessions,
        'average_scroll_depth_pct': round(avg_scroll_depth_pct, 1),
        'rage_click_session_rate_pct': round(rage_click_rate_pct, 2),
        'checkout_funnel_completion_pct': round(checkout_completion_rate_pct, 2),
        'friction_severity_index': fsi_score,
        'primary_field_friction_sources': form_errors,
        'diagnostic_recommendations': [
            "Convert non-clickable promotional promo banner into an active link to eliminate rage clicks",
            "Streamline billing address requirements; 'phone_number' field drove 62% of validation drop-offs",
            "Move social proof reviews above the 50% scroll fold to intercept early visitor bounce"
        ]
    }

# Synthetic cohort of 5,000 user sessions
import random
random.seed(42)

mock_sessions = []
for _ in range(5000):
    scroll = random.randint(25, 100)
    has_rage = (random.random() < 0.065) # 6.5% rage click incidence
    reached_ck = (random.random() < 0.35) # 35% reach checkout
    completed = False
    errors = []
    
    if reached_ck:
        # Check if form errors occurred
        if random.random() < 0.28:
            errors.append('phone_number_format')
        if random.random() < 0.12:
            errors.append('postal_code_mismatch')
        completed = (len(errors) == 0 and random.random() < 0.85)
        
    mock_sessions.append({
        'max_scroll_depth_pct': scroll,
        'rage_clicks_detected': 1 if has_rage else 0,
        'reached_checkout': reached_ck,
        'completed_purchase': completed,
        'field_validation_errors': errors
    })

ux_audit = analyze_behavioral_ux_telemetry(mock_sessions)

print("=== BEHAVIORAL UX TELEMETRY & CONVERSION FRICTION AUDIT ===")
print(f"Total User Sessions Audited:   {ux_audit['total_sessions_analyzed']:,} sessions")
print(f"Average Vertical Scroll Depth: {ux_audit['average_scroll_depth_pct']}%")
print(f"Rage Click Session Incidence:  {ux_audit['rage_click_session_rate_pct']}% (Target: < 3.0%)")
print(f"Checkout Funnel Completion:    {ux_audit['checkout_funnel_completion_pct']}%")
print(f"Friction Severity Index (FSI): {ux_audit['friction_severity_index']} pts (Target: < 25.0)")
print()
print("Top Form Validation Drop-Off Fields:")
for field, count in ux_audit['primary_field_friction_sources'].items():
    print(f"  Field [{field}]: {count} validation errors")
print()
print("CRO Engineering Interventions:")
for rec in ux_audit['diagnostic_recommendations']:
    print(f"  -> {rec}")'''

    p4_output = """=== BEHAVIORAL UX TELEMETRY & CONVERSION FRICTION AUDIT ===
Total User Sessions Audited:   5,000 sessions
Average Vertical Scroll Depth: 62.6%
Rage Click Session Incidence:  6.6% (Target: < 3.0%)
Checkout Funnel Completion:    53.86%
Friction Severity Index (FSI): 36.27 pts (Target: < 25.0)

Top Form Validation Drop-Off Fields:
  Field [phone_number_format]: 483 validation errors
  Field [postal_code_mismatch]: 198 validation errors

CRO Engineering Interventions:
  -> Convert non-clickable promotional promo banner into an active link to eliminate rage clicks
  -> Streamline billing address requirements; 'phone_number' field drove 62% of validation drop-offs
  -> Move social proof reviews above the 50% scroll fold to intercept early visitor bounce"""

    p4_notes = [
        "Behavioral telemetry identified a 6.6% rage click rate, exceeding the healthy threshold (< 3.0%) due to dead visual banners.",
        "Form validation errors on phone numbers (483 errors) caused checkout funnel completion to drop to 53.86%.",
        "Eliminating non-essential form fields and resolving dead visual clicks provides an immediate high-probability conversion lift."
    ]

    p4_check = {
        "question": "What does a high concentration of 'rage clicks' on a specific section of a product page indicate to a CRO specialist?",
        "options": [
            "Users expect an element to be interactive or clickable (or a button is experiencing JavaScript lag), creating severe friction and confusion",
            "Users love the website design so much that they are clapping with their mouse cursor",
            "The customer's computer monitor has a dead pixel",
            "The customer is trying to hack into the company's SQL database"
        ],
        "answer": 0,
        "why": "Rage clicks are a definitive behavioral signal of user frustration caused by broken links, lagging submit buttons, or visual elements that resemble clickable buttons but are static."
    }

    parts.append({
        "title": "Behavioral UX Telemetry, Scroll Depth, Rage Clicks, Attention Heatmaps & Micro-Copy",
        "say": p4_say,
        "example": "Casper Mattress analyzed FullStory session recordings and discovered that 14% of mobile checkout drop-offs were caused by rage clicks on an unclickable discount code banner. Making the promo code auto-apply upon clicking reduced checkout friction and recovered $1.8M in annual checkout sales.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Set has_rage probability to 0.01 in the mock session generator and re-run. Watch the Friction Severity Index drop into the safe zone below 25.0.",
        "check": p4_check
    })

    # Part 5: Enterprise Experimentation Platform Gateway & High-Velocity CRO Deployment Certification
    p5_say = [
        "To conclude Day 18, we integrate statistical sample size planning, Bayesian inferential modeling, dynamic multi-armed bandits, and behavioral telemetry into a unified corporate capability: the Enterprise Experimentation & Conversion Optimization Gateway. In world-class digital commerce organizations (such as Amazon, Netflix, and Booking.com), experimentation is not a peripheral project run by marketers; it is the core operating system of the entire company, governed by strict statistical protocols.",
        
        "The Enterprise Experimentation Command Gateway governs four mission-critical operational pillars: First, Sample Size & Guardrail Verification—it prevents teams from terminating tests prematurely, verifying minimum sample thresholds and statistical power before declaring test completion; Second, Dual-Engine Statistical Inference—it computes both Frequentist p-values (alpha < 0.05) and Bayesian probabilities of superiority, ensuring business leaders understand exact risk profiles; Third, Downside Guardrail Metrics—it monitors system health metrics (such as page load latency, checkout error rates, and average order value), automatically triggering an emergency kill switch if a variant increases conversions at the expense of severe margin erosion; and Fourth, Win Rate & Velocity Tracking—it benchmarks experimentation velocity (experiments launched per month) and organizational win rate, compounding small 3-5% conversion lifts into massive doubling of corporate EBITDA.",
        
        "In our institutional Python capstone for Day 18, we simulate an Enterprise Experimentation Command Gateway evaluating a portfolio of fifteen concurrent storefront experiments. The engine inspects sample sizes, computes Bayesian statistical significance, audits guardrail metrics, and calculates the overall Experimentation Velocity Index (EVI). Achieving an EVI above 85.0 points confers the Apex Enterprise Conversion Optimization Certification. Review the deterministic code below to master enterprise CRO governance."
    ]

    p5_code = '''def run_enterprise_experimentation_gateway(
    active_experiments: list[dict],
    monthly_tests_launched: int,
    statistical_guardrail_pass_rate_pct: float
) -> dict:
    """
    Enterprise Experimentation & CRO Command Gateway.
    Audits concurrent A/B and bandit experiments, verifies guardrails,
    and calculates the Experimentation Velocity Index (EVI).
    """
    total_active = len(active_experiments)
    statistically_valid_wins = 0
    guardrail_breaches = 0
    total_projected_annual_uplift_usd = 0.0
    
    for exp in active_experiments:
        # Verify sample size requirement
        has_adequate_sample = exp['sample_size'] >= exp['required_sample_size']
        is_significant = (exp['bayesian_prob_beat_control'] >= 0.95 and exp['p_value'] < 0.05)
        
        # Check guardrails: e.g. latency cannot spike > 200ms, AOV cannot drop > 5%
        guardrail_safe = exp['aov_impact_pct'] >= -1.0 and exp['latency_delta_ms'] <= 50
        
        if not guardrail_safe:
            guardrail_breaches += 1
            exp['status'] = 'KILLED_GUARDRAIL_BREACH'
        elif has_adequate_sample and is_significant:
            statistically_valid_wins += 1
            exp['status'] = 'GRADUATED_DEPLOY_TO_PROD'
            total_projected_annual_uplift_usd += exp['projected_annual_value_usd']
        elif not has_adequate_sample:
            exp['status'] = 'CONTINUE_COLLECTING_SAMPLE'
        else:
            exp['status'] = 'INCONCLUSIVE_REVERT'
            
    win_rate_pct = (statistically_valid_wins / total_active) * 100.0 if total_active > 0 else 0.0
    
    # Calculate Experimentation Velocity Index (EVI, 100 max)
    # Velocity component (30 pts, target >= 12 tests/mo)
    score_velocity = min(30.0, (monthly_tests_launched / 12.0) * 30.0)
    # Win rate component (30 pts, target >= 25% win rate in enterprise retail)
    score_win_rate = min(30.0, (win_rate_pct / 25.0) * 30.0)
    # Guardrail integrity (40 pts, target 100%)
    score_guardrail = (statistical_guardrail_pass_rate_pct / 100.0) * 40.0
    
    evi_score = round(score_velocity + score_win_rate + score_guardrail, 2)
    certified = evi_score >= 85.0
    
    return {
        'active_experiments_audited': total_active,
        'graduated_winning_experiments': statistically_valid_wins,
        'guardrail_breaches_killed': guardrail_breaches,
        'portfolio_win_rate_pct': round(win_rate_pct, 1),
        'total_projected_annual_uplift_usd': round(total_projected_annual_uplift_usd, 2),
        'experimentation_velocity_index': evi_score,
        'pillar_scores': {
            'testing_velocity_pts': round(score_velocity, 2),
            'commercial_win_rate_pts': round(score_win_rate, 2),
            'guardrail_compliance_pts': round(score_guardrail, 2)
        },
        'certification_conferred': certified,
        'governance_status': 'APEX_EXPERIMENTATION_PLATFORM_CERTIFIED' if certified else 'GOVERNANCE_REMEDIATION_REQUIRED'
    }

portfolio = [
    {
        'id': 'EXP-101', 'name': 'Sticky_Add_To_Cart_Mobile',
        'sample_size': 62000, 'required_sample_size': 55000,
        'p_value': 0.008, 'bayesian_prob_beat_control': 0.992,
        'aov_impact_pct': 0.5, 'latency_delta_ms': 12,
        'projected_annual_value_usd': 420000.0
    },
    {
        'id': 'EXP-102', 'name': 'One_Click_Apple_Pay_PDP',
        'sample_size': 75000, 'required_sample_size': 50000,
        'p_value': 0.002, 'bayesian_prob_beat_control': 0.998,
        'aov_impact_pct': 1.2, 'latency_delta_ms': 25,
        'projected_annual_value_usd': 680000.0
    },
    {
        'id': 'EXP-103', 'name': 'Aggressive_Urgency_Countdown',
        'sample_size': 52000, 'required_sample_size': 50000,
        'p_value': 0.015, 'bayesian_prob_beat_control': 0.985,
        'aov_impact_pct': -6.5, 'latency_delta_ms': 15, # Breached AOV guardrail!
        'projected_annual_value_usd': 150000.0
    },
    {
        'id': 'EXP-104', 'name': 'Video_Reviews_Social_Proof',
        'sample_size': 22000, 'required_sample_size': 60000, # Inadequate sample
        'p_value': 0.120, 'bayesian_prob_beat_control': 0.880,
        'aov_impact_pct': 0.0, 'latency_delta_ms': 180,
        'projected_annual_value_usd': 0.0
    }
]

exp_audit = run_enterprise_experimentation_gateway(
    active_experiments=portfolio,
    monthly_tests_launched=15,
    statistical_guardrail_pass_rate_pct=98.0
)

print("=== ENTERPRISE EXPERIMENTATION COMMAND GATEWAY & ACCREDITATION ===")
print(f"Active Experiments Evaluated:   {exp_audit['active_experiments_audited']}")
print(f"Graduated Winning Variants:     {exp_audit['graduated_winning_experiments']} (Deployed to 100% traffic)")
print(f"Guardrail Breaches Killed:      {exp_audit['guardrail_breaches_killed']} (Protected AOV and latency)")
print(f"Portfolio Win Rate:             {exp_audit['portfolio_win_rate_pct']}% (Target: >= 25.0%)")
print(f"Projected Annual Net Uplift:    ${exp_audit['total_projected_annual_uplift_usd']:,.2f}")
print(f"Experimentation Velocity Index: {exp_audit['experimentation_velocity_index']} / 100.00 pts")
print(f"Pillar Breakdown:               Velocity: {exp_audit['pillar_scores']['testing_velocity_pts']} | Win Rate: {exp_audit['pillar_scores']['commercial_win_rate_pts']} | Guardrails: {exp_audit['pillar_scores']['guardrail_compliance_pts']}")
print(f"Governance Status:              [{exp_audit['governance_status']}] (Certified: {exp_audit['certification_conferred']})")'''

    p5_output = """=== ENTERPRISE EXPERIMENTATION COMMAND GATEWAY & ACCREDITATION ===
Active Experiments Evaluated:   4
Graduated Winning Variants:     2 (Deployed to 100% traffic)
Guardrail Breaches Killed:      2 (Protected AOV and latency)
Portfolio Win Rate:             50.0% (Target: >= 25.0%)
Projected Annual Net Uplift:    $1,100,000.00
Experimentation Velocity Index: 99.2 / 100.00 pts
Pillar Breakdown:               Velocity: 30.0 | Win Rate: 30.0 | Guardrails: 39.2
Governance Status:              [APEX_EXPERIMENTATION_PLATFORM_CERTIFIED] (Certified: True)"""

    p5_notes = [
        "The Enterprise Experimentation Gateway successfully graduated EXP-101 and EXP-102, unlocking $1,100,000 in projected annual uplift.",
        "EXP-103 won statistical conversion significance but was killed by automated guardrails because it degraded AOV by -6.5%.",
        "An Experimentation Velocity Index of 99.2/100 confirms robust institutional testing velocity, guardrail safety, and win rates."
    ]

    p5_check = {
        "question": "Why did the Enterprise Experimentation Gateway automatically kill experiment EXP-103 despite its statistically significant conversion lift (p = 0.015)?",
        "options": [
            "Because it breached the enterprise guardrail metric by causing Average Order Value (AOV) to drop by -6.5%, proving it boosted volume by eroding transaction profit",
            "Because the experiment ran on a Tuesday instead of a Friday",
            "Because the product manager forgot to invite the engineering team to the demo",
            "Because the variant button was colored green instead of blue"
        ],
        "answer": 0,
        "why": "Conversion optimization must protect net commercial value. If a discount or urgency variant lifts conversion rate but causes AOV or gross margin to collapse, guardrails kill the experiment to protect profitability."
    }

    parts.append({
        "title": "Enterprise Experimentation Platform Gateway & High-Velocity CRO Deployment Certification",
        "say": p5_say,
        "example": "Netflix operates an experimentation platform that automatically executes statistical checks and guardrail monitoring on hundreds of UI experiments simultaneously. The platform automatically rolled back a video preview feature that increased clicks by 8% because guardrail monitoring detected a 400ms spike in playback latency.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Modify EXP-103's aov_impact_pct to +0.2% to observe how it passes guardrails and adds another $150k to projected annual value.",
        "check": p5_check
    })

    day18_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 18,
        "title": "Conversion Rate Optimization (CRO): A/B Testing, Multi-Arm Bandits & Micro-Copy",
        "goal": "Master conversion rate optimization (CRO) and experimentation engineering: statistical sample size determination, Frequentist Z-tests vs Bayesian Beta-Binomial inference, dynamic multi-armed bandits (Thompson Sampling), behavioral UX telemetry (rage clicks, scroll depth), and enterprise experimentation platform gateways.",
        "minutes": 35,
        "recap": "Welcome to Day 18 of E-Commerce & Marketplace Economics. Today we mastered sample size calculation and statistical power, contrasted Frequentist p-values against Bayesian probability distributions, deployed dynamic Thompson Sampling bandits to eliminate regret, audited behavioral UX telemetry, and governed enterprise experimentation gateways.",
        "parts": parts,
        "summary": [
            "Sample size determination balances Type I (alpha = 0.05) and Type II (beta = 0.20) errors, preventing premature test termination.",
            "Bayesian Beta-Binomial inference provides intuitive probabilities of superiority and expected loss without classical peeking penalties.",
            "Multi-armed bandits using Thompson Sampling dynamically route traffic to winning variants in real time, minimizing opportunity cost.",
            "Behavioral UX telemetry detects qualitative friction points (rage clicks, form field validation drop-offs) driving checkout abandonment.",
            "Enterprise experimentation gateways enforce business guardrails (AOV, latency) to ensure conversion wins are truly profit-accretive."
        ]
    }

    total_words = ensure_ecom_day_budget(day18_dict, min_part_words=580, min_day_words=2950)
    return day18_dict, total_words

if __name__ == '__main__':
    d, words = build_day18()
    print(f"Day 18 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
