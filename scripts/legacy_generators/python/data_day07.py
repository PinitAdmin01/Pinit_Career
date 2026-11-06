import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))
from scripts.bcom_ana_utils import count_words

d7_parts = [
    {
        "title": "Correlation vs Causation & The Formal Calculus of Interventions",
        "say": [
            "In commercial decision-making, mistaking statistical correlation for genuine causal causation is the single most pervasive and expensive cognitive error committed by corporate leadership. Two business variables may exhibit a near-perfect Pearson correlation coefficient of zero point ninety-five while sharing zero underlying causal mechanism. For example, ice cream sales and consumer drowning deaths correlate strongly throughout the calendar year; a naive executive interpreting this correlation might ban ice cream sales to prevent drownings, failing to recognize that outdoor summer temperature is an unobserved common cause driving both phenomena simultaneously.",
            "In modern econometrics and causal data science, this distinction is formalized through the groundbreaking work of Turing Award laureate Judea Pearl. Pearl introduced the Structural Causal Model (SCM) framework and the Do-Calculus mathematical operator. The fundamental insight of Do-Calculus is that passive observational conditioning, denoted mathematically as the conditional probability of Y given that X equals x, is fundamentally distinct from active experimental intervention, denoted as the probability of Y given do(X = x). Observational conditioning merely filters historical data; the do-operator physically severs the natural incoming mechanisms governing X, setting its value exogenously.",
            "When an enterprise relies solely on observational data to set strategic policies, it frequently incurs catastrophic unintended consequences. For instance, analyzing observational customer support logs might reveal that enterprise clients who submit more support tickets generate twenty percent higher renewal revenues than clients who never submit tickets. A naive product manager confusing association with causation might intentionally degrade software stability to force customers to file tickets, mistakenly believing ticket volume causes revenue. In reality, customer company size is a confounding variable: larger enterprises with thousands of active employees naturally generate both higher ticket volumes and higher contract renewals.",
            "To model and dissect these relationships systematically, analysts represent causal assumptions using Causal Directed Acyclic Graphs (DAGs). In a causal DAG, nodes represent random variables—such as corporate marketing spend, customer engagement, competitor pricing, and revenue—while directed arrows represent direct, asymmetric causal influences. The acyclic condition guarantees that no variable can be a direct or indirect cause of itself, ruling out ungrounded circular causal loops in discrete time-slice modeling.",
            "Within a causal DAG, the relationship between any two variables can be transmitted along three fundamental path topologies: Chains of mediation (X causes M, which causes Y), Forks of common cause confounding (Z causes both X and Y), and Colliders of common consequence selection (X causes C, and Y causes C). Each of these three elementary graphical structures exhibits distinct, mathematically precise implications for conditional independence and statistical conditioning.",
            "Understanding the formal calculus of interventions allows the Chief Analytics Officer to design empirical strategies that withstand rigorous scientific scrutiny. When multi-million-dollar capital reallocations are debated in the boardroom, you do not present fragile correlations or naive regressions. You delineate the underlying directed acyclic graph, prove the causal identifiability of the treatment effect, and demonstrate that observed revenue uplifts reflect true structural interventions rather than observational illusions.",
            "By establishing this foundational rigor, enterprise leadership is permanently insulated from costly strategic blunders. You anchor corporate intelligence in structural reality, ensuring that every strategic intervention executed by the firm delivers predictable, reproducible, and verifiable economic value.",
            "Furthermore, causal DAGs provide an immutable audit trail for cross-functional alignment between engineering, finance, and marketing directorates. When business units disagree on the true drivers of customer churn or pricing elasticity, constructing an explicit directed graph forces stakeholders to state their causal assumptions transparently rather than hiding behind ambiguous regression coefficients. Once the structural topology is codified, the mathematical rules of do-calculus dictate precisely which datasets must be captured, which confounders must be controlled, and which metrics must remain untouched to isolate the true treatment effect."
        ],
        "example": "Think of the rooster that crows every morning right before sunrise. There is a perfect daily correlation between the rooster's crow and the sun appearing on the horizon. But if a farmer keeps the rooster asleep inside a soundproof barn (an intervention setting crow to false), the sun still rises at its exact scheduled time. Crowing does not cause sunrise; both are synchronized to Earth's planetary rotation.",
        "code": """# Deterministic Causal DAG Path & Confounding Simulation Engine
class CausalDAGSimulator:
    def __init__(self, n_samples: int = 10000):
        self.n = n_samples

    def simulate_confounded_system(self) -> dict:
        # Z: Enterprise Client Size (Scale 1 to 10)
        # Z -> X (Support Tickets filed)
        # Z -> Y (Contract Renewal Value in $k)
        # True direct causal effect of Ticket on Renewal is -2.0 (tickets actually signal frustration!)
        
        # Deterministic pseudo-random generation
        import random
        random.seed(101)
        
        z_vals = [random.uniform(1.0, 10.0) for _ in range(self.n)]
        # Larger clients file more tickets naturally
        x_vals = [3.0 * z + random.gauss(0, 1) for z in z_vals]
        # Larger clients have bigger budgets, but tickets hurt slightly (-2.0)
        y_vals = [10.0 * z - 2.0 * x + random.gauss(0, 1) for z, x in zip(z_vals, x_vals)]
        
        # Calculate naive observational covariance & slope between X and Y
        mean_x = sum(x_vals) / self.n
        mean_y = sum(y_vals) / self.n
        cov_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_vals, y_vals)) / self.n
        var_x = sum((x - mean_x) ** 2 for x in x_vals) / self.n
        naive_slope = cov_xy / var_x
        
        return {
            "Total_Observations": self.n,
            "True_Causal_Effect_Beta": -2.00,
            "Naive_Observational_Slope": round(naive_slope, 4),
            "Confounding_Bias_Direction": "POSITIVE_MASKING_NEGATIVE_EFFECT",
            "Severe_Risk": naive_slope > 0 # Appears positive observationally!
        }

sim = CausalDAGSimulator()
res = sim.simulate_confounded_system()
for k, v in res.items():
    print(f"{k}: {v}")""",
        "tryIt": "Modify the simulation by increasing the confounding strength of client size Z; observe how the naive observational slope becomes even more deceptively positive while the true causal effect remains negative.",
        "check": {
            "scenario": "A product team observes that enterprise clients with high support ticket counts have higher contract renewal rates, and proposes creating complex user workflows to induce more ticket submissions. How should the Chief Analytics Officer respond?",
            "options": [
                "Reject the proposal immediately: enterprise client size is a confounding variable that causes both high ticket counts and high contract values; the true causal effect of tickets is negative once client size is controlled.",
                "Approve the proposal because a positive Pearson correlation coefficient always indicates a positive causal return on investment.",
                "Recommend increasing ticket response times so tickets stay open longer.",
                "Advise running an unadjusted linear regression with ticket count as the sole independent variable."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Enterprise size is a classic fork confounder (Z -> X and Z -> Y). Because large enterprises naturally file more tickets and have larger budgets, observational data shows a spurious positive correlation. Inducing tickets through friction will alienate customers and destroy revenue because the true conditional causal effect do(X) on Y is negative."
        }
    },
    {
        "title": "Simpson's Paradox & The Mechanics of Subgroup Inversion",
        "say": [
            "Among all statistical anomalies encountered in corporate analytics, Simpson's Paradox is the most counter-intuitive, dramatic, and hazardous to executive decision-making. First described by Edward H. Simpson in 1951, the paradox occurs when an apparent statistical association or trend observed across an aggregate population completely reverses its mathematical sign when the data is disaggregated into underlying sub-populations or demographic segments. An aggregate dataset may show that Strategy B outperforms Strategy A overall, while simultaneously Strategy A outperforms Strategy B within every single individual customer segment.",
            "The classic real-world demonstration of Simpson's Paradox occurred in the famous 1973 UC Berkeley graduate admissions study. Overall aggregate admissions figures showed that forty-four percent of male applicants were admitted compared to only thirty-five percent of female applicants, prompting intense public allegations of gender bias in admissions. However, when researchers disaggregated the applicant data across individual academic departments, they discovered that within the vast majority of individual departments, female applicants actually had an equal or slightly higher acceptance rate than male applicants.",
            "The mathematical explanation for this apparent impossibility lies in non-uniform group assignment weights driven by an unobserved confounder: department competitiveness. Female candidates disproportionately applied to highly competitive humanities departments with tiny admission quotas and very low overall acceptance rates (often below ten percent), whereas male candidates disproportionately applied to engineering and science departments with massive quotas and high acceptance rates (often exceeding sixty percent). When pooled together, the unequal weighting of applicant volume across departments inverted the aggregate direction.",
            "In modern enterprise SaaS and e-commerce analytics, Simpson's Paradox strikes regularly in digital marketing, conversion rate optimization, and pricing experiments. Consider an e-commerce platform testing a newly redesigned checkout interface against their legacy interface across two distinct customer traffic channels: Desktop users and Mobile users. The redesign might convert mobile users at twelve percent compared to ten percent for legacy (a clear win on mobile), and convert desktop users at thirty-two percent compared to thirty percent for legacy (a clear win on desktop).",
            "Yet, if the marketing algorithm disproportionately directs Mobile traffic (which converts at a lower baseline rate of around ten percent) to the New redesign, and directs Desktop traffic (which converts at thirty percent) to the Legacy checkout, the aggregate pooled conversion rate will show Legacy at twenty-four percent and New at only fourteen percent! An uninformed executive inspecting only the top-level executive dashboard would immediately fire the UX design agency and roll back the redesign, destroying millions of dollars in enterprise value by failing to recognize that the redesign won in every single segment.",
            "To diagnose and resolve Simpson's Paradox, business analysts cannot rely purely on statistical equations; they must construct a causal model. Data alone cannot tell you whether to trust the aggregate data or the disaggregated subgroup data. According to Judea Pearl's causal theory, the decision to condition on a subgroup variable Z depends strictly on whether Z is a confounder on a backdoor path or a mediator on a frontdoor path.",
            "If Z is a confounder (such as device category or customer company size), conditioning on Z is mathematically mandatory to block the spurious backdoor association and recover the true average treatment effect. Conversely, if Z is a mediator along the causal chain from X to Y, conditioning on Z blocks the legitimate causal mechanism, introducing conditioning bias and leading to incorrect conclusions.",
            "Mastering the resolution of Simpson's Paradox elevates the senior data leader into a trusted corporate gatekeeper. You ensure that executive leadership never makes billion-dollar strategic retreats based on distorted aggregate metrics, ensuring that every operational insight reflects true, uncorrupted causal reality.",
            "In financial portfolio management, Simpson's Paradox appears frequently when evaluating investment fund manager track records. An aggregate ranking might suggest that Asset Manager Alpha generated lower overall portfolio returns than Asset Manager Beta over a five-year economic cycle. However, when disaggregating investments across asset classes—high-risk venture equity, corporate debt, and municipal bonds—Manager Alpha generated strictly higher alpha within every individual asset tier. Manager Alpha's aggregate return appeared lower solely because institutional clients allocated eighty percent of their capital into ultrasafe, low-yield municipal bonds, demonstrating why macroeconomic weighting must always be controlled when benchmarking human or algorithmic performance."
        ],
        "example": "Imagine two doctors performing surgery: Doctor Alice and Doctor Bob. Overall, Doctor Bob has an eighty percent patient survival rate while Doctor Alice has only a seventy percent survival rate. But Doctor Alice is the chief trauma surgeon who operates almost exclusively on critical, life-threatening emergency cases, where her survival rate is sixty percent (compared to Bob's forty percent on emergencies). For minor routine cases, Alice has a ninety-five percent survival rate (compared to Bob's ninety percent). Alice is strictly superior in every single patient category, but her aggregate rate looks worse because she takes on all the hardest cases.",
        "code": """# Pure Python Demonstration of Simpson's Paradox in E-Commerce Redesign
class SimpsonsParadoxEngine:
    def __init__(self):
        # Disaggregated performance data
        # Segment 1: Mobile Users (Low baseline conversion)
        # Segment 2: Desktop Users (High baseline conversion)
        self.data = {
            "Mobile": {
                "New_Design": {"visitors": 8000, "conversions": 960},  # 12.0%
                "Legacy_Design": {"visitors": 2000, "conversions": 200} # 10.0%
            },
            "Desktop": {
                "New_Design": {"visitors": 2000, "conversions": 640},  # 32.0%
                "Legacy_Design": {"visitors": 8000, "conversions": 2400} # 30.0%
            }
        }

    def analyze(self) -> dict:
        # 1. Segment-level rates
        mobile_new_rate = self.data["Mobile"]["New_Design"]["conversions"] / self.data["Mobile"]["New_Design"]["visitors"]
        mobile_leg_rate = self.data["Mobile"]["Legacy_Design"]["conversions"] / self.data["Mobile"]["Legacy_Design"]["visitors"]
        
        desktop_new_rate = self.data["Desktop"]["New_Design"]["conversions"] / self.data["Desktop"]["New_Design"]["visitors"]
        desktop_leg_rate = self.data["Desktop"]["Legacy_Design"]["conversions"] / self.data["Desktop"]["Legacy_Design"]["visitors"]
        
        # 2. Pooled Aggregate rates
        total_new_vis = self.data["Mobile"]["New_Design"]["visitors"] + self.data["Desktop"]["New_Design"]["visitors"]
        total_new_conv = self.data["Mobile"]["New_Design"]["conversions"] + self.data["Desktop"]["New_Design"]["conversions"]
        aggregate_new_rate = total_new_conv / total_new_vis
        
        total_leg_vis = self.data["Mobile"]["Legacy_Design"]["visitors"] + self.data["Desktop"]["Legacy_Design"]["visitors"]
        total_leg_conv = self.data["Mobile"]["Legacy_Design"]["conversions"] + self.data["Desktop"]["Legacy_Design"]["conversions"]
        aggregate_leg_rate = total_leg_conv / total_leg_vis
        
        return {
            "Mobile_New_Rate": round(mobile_new_rate * 100, 2),
            "Mobile_Legacy_Rate": round(mobile_leg_rate * 100, 2),
            "Desktop_New_Rate": round(desktop_new_rate * 100, 2),
            "Desktop_Legacy_Rate": round(desktop_leg_rate * 100, 2),
            "Aggregate_New_Rate": round(aggregate_new_rate * 100, 2),
            "Aggregate_Legacy_Rate": round(aggregate_leg_rate * 100, 2),
            "Paradox_Detected": (mobile_new_rate > mobile_leg_rate) and \\
                                (desktop_new_rate > desktop_leg_rate) and \\
                                (aggregate_new_rate < aggregate_leg_rate)
        }

engine = SimpsonsParadoxEngine()
res = engine.analyze()
for k, v in res.items():
    print(f"{k}: {v}")""",
        "tryIt": "Adjust the visitor allocation so that Mobile and Desktop users are split equally fifty-fifty across both designs; observe how the paradox vanishes and the aggregate rate reflects the true subgroup superiority.",
        "check": {
            "scenario": "A digital analytics dashboard indicates that a new checkout flow converted at sixteen percent overall compared to twenty-two percent for the old flow. However, when split by device, the new flow won on mobile (twelve vs ten percent) and won on desktop (thirty-four vs thirty percent). What must leadership conclude?",
            "options": [
                "The new flow is strictly superior; Simpson's Paradox occurred because the new flow received a disproportionate volume of low-converting mobile traffic, artificially deflating its aggregate rate.",
                "The old flow is superior because aggregate numbers always supersede subgroup partitions.",
                "The experiment was corrupted by malware and all customer transactions should be refunded.",
                "Both flows are statistically identical and sample sizes should be discarded."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "This is textbook Simpson's Paradox. The new design won in every individual customer segment (mobile and desktop). The aggregate rate looked worse only because 80% of the traffic assigned to the new design was mobile traffic (which has a lower baseline conversion rate across all flows). Conditioning on device category reveals the true positive treatment effect."
        }
    },
    {
        "title": "Judea Pearl's Causal DAGs & The Backdoor Criterion Invariant",
        "say": [
            "To move beyond intuitive hand-waving and establish an unimpeachable scientific methodology for causal identification, modern business analytics relies on Judea Pearl's Backdoor Criterion. In observational data, estimating the causal effect of an action X on an outcome Y is frequently contaminated by confounding paths that transmit spurious non-causal correlations. The Backdoor Criterion provides a rigorous graphical test that determines whether a specific set of observed control variables Z is sufficient to block all spurious associations, enabling the unbiased estimation of the causal effect using standard regression or propensity score weighting.",
            "Formally, a set of variables Z satisfies the Backdoor Criterion relative to an ordered pair of variables (X, Y) in a causal DAG if two conditions are met simultaneously: First, no node in Z can be a causal descendant of X (meaning Z cannot lie on the causal path originating from X to Y, nor can it be caused by X). Second, Z blocks every path between X and Y that contains an arrow pointing into X (commonly termed a backdoor path). If these two conditions are satisfied, the causal effect of X on Y is non-parametrically identifiable from observational data.",
            "Understanding how paths are blocked requires mastering the mechanics of d-separation (directional separation). In a causal DAG, a path is blocked by a conditioning set Z if and only if one of two conditions holds: The path contains a chain (A -> B -> C) or a fork (A <- B -> C) such that the middle node B is included in the conditioning set Z; or the path contains an inverted fork, known as a Collider (A -> B <- C), such that neither the middle node B nor any of its descendants are included in Z.",
            "The concept of the Collider is one of the most vital insights in modern econometrics, representing an area where classical regression modeling often goes catastrophically wrong. When two independent variables X and Y both cause a common consequence C, they are unconditionally independent. However, if an analyst conditions on the collider C (by including it as a control variable in a multiple regression model or filtering the dataset to a specific value of C), X and Y become spuriously correlated! This phenomenon is known as Collider Stratification Bias or Berkson's Paradox.",
            "A classic commercial example of collider stratification occurs in venture capital analytics when evaluating startup success. Suppose startup founder technical competence and market luck are completely independent across the global population of entrepreneurs. If a venture fund analyzes only the portfolio of startups that received funding (a collider variable caused by both competence and luck), competence and luck will appear strongly negatively correlated! Highly competent founders with bad luck get funded, and lucky founders with low competence get funded, while unlucky, incompetent founders are excluded from the dataset.",
            "If an analyst naively controls for funded status in an econometric regression, they introduce artificial negative bias, erroneously concluding that greater founder competence reduces business luck! The Backdoor Criterion provides the mathematical antidote: it strictly forbids conditioning on colliders or descendant colliders, protecting the analytics architecture from manufacturing false causal relationships out of thin air.",
            "By synthesizing causal DAG topology, d-separation rules, and the Backdoor Criterion, the Chief Analytics Officer constructs defensible econometric models. You know with mathematical certainty which covariates must be controlled to purge confounding bias, and precisely which variables must be omitted to prevent collider contamination.",
            "In enterprise governance, this mathematical framework eliminates subjective corporate debates. When business leaders propose adding dozens of arbitrary control variables into a machine learning regression, you can prove using DAG structure whether each variable acts as a true confounder or a destructive collider. You protect the enterprise from spurious statistical noise, ensuring that every strategic policy is grounded in provable causal science."
        ],
        "example": "Think of a highway traffic intersection. A fork is a single water pipe splitting into two houses: controlling the main valve stops water to both. A collider is two separate rivers flowing into a single lake: if you inspect only the lake's water level, you create an artificial relationship between rain in river A and rain in river B, even though the two mountain weather systems are entirely independent.",
        "code": """# Pure Python Implementation of Backdoor Path & D-Separation Checker
class CausalGraph:
    def __init__(self):
        # Adjacency list: Directed edges A -> B
        self.edges = {
            "Z": ["X", "Y"], # Z is a confounder: Z -> X and Z -> Y
            "X": ["M"],      # X -> M (Mediator)
            "M": ["Y"],      # M -> Y
            "W": ["C"],      # W -> C (Collider input)
            "Y": ["C"],      # Y -> C (Collider input)
            "C": []
        }

    def verify_backdoor_criterion(self, treatment: str, outcome: str, conditioning_set: set) -> dict:
        # Check Condition 1: No element in Z is a descendant of treatment X
        descendants_of_x = set()
        queue = list(self.edges.get(treatment, []))
        while queue:
            curr = queue.pop(0)
            descendants_of_x.add(curr)
            queue.extend(self.edges.get(curr, []))
            
        violates_descendant_rule = bool(conditioning_set.intersection(descendants_of_x))
        
        # Check Condition 2: Confounder Z -> X and Z -> Y must be blocked
        # In our graph, the backdoor path is X <- Z -> Y.
        # This path is blocked if Z is in conditioning_set.
        backdoor_blocked = "Z" in conditioning_set
        
        # Collider safety check: C should NOT be in conditioning_set
        collider_activated = "C" in conditioning_set
        
        is_valid_adjustment_set = (not violates_descendant_rule) and backdoor_blocked and (not collider_activated)
        
        return {
            "Treatment": treatment,
            "Outcome": outcome,
            "Conditioning_Set": list(conditioning_set),
            "Descendant_Rule_Passed": not violates_descendant_rule,
            "Backdoor_Path_Blocked": backdoor_blocked,
            "Collider_Bias_Avoided": not collider_activated,
            "Is_Valid_Causal_Adjustment_Set": is_valid_adjustment_set
        }

graph = CausalGraph()

# Test 1: Condition on true confounder Z only
test_valid = graph.verify_backdoor_criterion("X", "Y", conditioning_set={"Z"})
# Test 2: Inadvertently condition on collider C
test_collider = graph.verify_backdoor_criterion("X", "Y", conditioning_set={"Z", "C"})
# Test 3: Condition on mediator M (violates descendant rule)
test_mediator = graph.verify_backdoor_criterion("X", "Y", conditioning_set={"Z", "M"})

print("Test 1 (Valid Set {Z}):", test_valid["Is_Valid_Causal_Adjustment_Set"])
print("Test 2 (Conditioning on Collider C):", test_collider["Is_Valid_Causal_Adjustment_Set"])
print("Test 3 (Conditioning on Mediator M):", test_mediator["Is_Valid_Causal_Adjustment_Set"])""",
        "tryIt": "Add a new variable to the graph representing customer satisfaction and test whether conditioning on it satisfies the backdoor criterion.",
        "check": {
            "scenario": "An analyst evaluates an employee compensation model where Talent and Drive independently cause Promotion (a collider). If the analyst filters the regression dataset exclusively to promoted employees, what happens to the estimated relationship between Talent and Drive?",
            "options": [
                "It induces severe collider stratification bias, creating a spurious negative correlation between Talent and Drive because employees with low talent must have had extreme drive to be promoted.",
                "It eliminates all observational noise and reveals the true positive causal effect.",
                "It automatically converts the regression into a randomized control trial.",
                "It increases the degrees of freedom of the t-distribution."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Conditioning on a collider (Promotion) opens a spurious non-causal path between its independent causes (Talent and Drive). In the promoted sub-sample, high talent compensates for low drive, artificially manufacturing a deceptive negative correlation (Berkson's bias) where none exists in the broader population."
        }
    },
    {
        "title": "Frontdoor Adjustment & Natural Experiments in Corporate Strategy",
        "say": [
            "In real-world corporate ecosystems, satisfying the Backdoor Criterion is frequently impossible because critical confounding variables remain completely unobserved. For example, when evaluating the causal impact of employee training programs on sales productivity, unobserved employee intrinsic motivation and ambition confound the relationship: ambitious employees voluntarily sign up for training and also generate higher sales. Because motivation cannot be objectively measured or fully controlled in observational HR records, the backdoor path remains unblocked, contaminating naive regression estimates with positive omitted variable bias.",
            "To solve the dilemma of unobserved confounders, Judea Pearl formulated the profound Frontdoor Criterion. Unlike backdoor adjustment which attempts to control for common causes behind the treatment, frontdoor adjustment looks downstream: it identifies an intermediate mechanism or mediator M that lies entirely along the causal pathway from X to Y. If M captures the full causal effect of X on Y, if there are no unblocked backdoor paths from X to M, and if all backdoor paths from M to Y are blocked by conditioning on X, the true causal effect is fully identifiable without measuring the unobserved confounder.",
            "The mathematical derivation of the Frontdoor Formula is one of the crowning achievements of causal inference. It establishes that the causal effect probability of Y given do(X = x) can be calculated by summing over all possible states of the mediator M and integrating over the observational distribution of X. In essence, the formula uses the unconfounded relationship between X and M to determine how the intervention shifts M, and then uses the relationship between M and Y (controlled for X) to determine how M shifts Y, completely bypassing the unobserved confounder.",
            "Beyond graphical frontdoor adjustments, corporate analytics leaders exploit Natural Experiments and Quasi-Experimental designs to identify causal effects in non-randomized environments. When macroeconomic shocks, sudden regulatory shifts, or platform technical glitches alter business conditions for one cohort while leaving an identical cohort untouched, the shock functions as a natural randomization mechanism, breaking the hold of unobserved confounders.",
            "The premier quasi-experimental methodology across modern business analytics is Difference-in-Differences (DiD). DiD evaluates the causal impact of an enterprise intervention (such as rolling out a new dynamic pricing algorithm across retail stores in Ohio while leaving stores in Pennsylvania on legacy pricing) by comparing the change in outcomes over time between the treatment group and the control group. The foundational assumption of Difference-in-Differences is the Parallel Trends Invariant: in the absence of treatment, the average change in the outcome variable for the treatment group would have been identical to the change observed in the control group.",
            "If the Parallel Trends Invariant holds, DiD subtracts the pre-existing baseline trend of the control group from the post-intervention trajectory of the treatment group, neatly eliminating all time-invariant unobserved group confounders (such as state-level demographics) and shared temporal shocks (such as national inflation). However, if pre-treatment historical trajectories diverge, the parallel trends assumption fails, requiring synthetic control methods or propensity-matched double differencing.",
            "Equipped with Frontdoor adjustment and Difference-in-Differences quasi-experimentation, the Chief Analytics Officer possesses a formidable econometric toolkit. You never throw your hands up in defeat when unobserved confounders threaten observational datasets. You engineer structural identification strategies that extract clean, uncompromised causal truths from the chaotic reality of corporate enterprise operations.",
            "In modern enterprise pricing and algorithmic revenue management, Difference-in-Differences frameworks are frequently paired with Synthetic Control Methods to address heterogeneous pre-treatment market trends. When a tech enterprise pilots an aggressive enterprise pricing tier in a single major jurisdiction like California, no single other state functions as a perfect parallel control group. Synthetic control algorithms construct a mathematically weighted counterfactual combination of multiple states (e.g., thirty percent New York, forty percent Texas, and thirty percent Washington) that perfectly replicates California's historical pre-treatment revenue trajectory, isolating true causal pricing elasticity with unprecedented precision."
        ],
        "example": "Think of testing whether cigarette smoking causes lung cancer when human genetics might confound both. The frontdoor mechanism identifies tar deposits in the lungs: smoking directly causes tar deposits (with no genetic confounder affecting whether smoke leaves physical tar), and tar deposits cause cellular mutations. By measuring how smoking increases tar, and how tar increases cancer across non-smoking tar-exposed workers, science proved smoking causes cancer without needing to map the entire human genome.",
        "code": """# Pure Python Difference-in-Differences (DiD) Quasi-Experimental Engine
class DifferenceInDifferencesEstimator:
    def __init__(self, pre_control: list, post_control: list, pre_treatment: list, post_treatment: list):
        self.pre_c = pre_control
        self.post_c = post_control
        self.pre_t = pre_treatment
        self.post_t = post_treatment

    def estimate(self) -> dict:
        mean_pre_c = sum(self.pre_c) / len(self.pre_c)
        mean_post_c = sum(self.post_c) / len(self.post_c)
        
        mean_pre_t = sum(self.pre_t) / len(self.pre_t)
        mean_post_t = sum(self.post_t) / len(self.post_t)
        
        # Control group temporal drift: Delta_Control
        delta_control = mean_post_c - mean_pre_c
        
        # Treatment group observed drift: Delta_Treatment
        delta_treatment = mean_post_t - mean_pre_t
        
        # DiD Estimator: Delta_Treatment - Delta_Control
        did_effect = delta_treatment - delta_control
        
        return {
            "Control_Pre_Mean": round(mean_pre_c, 2),
            "Control_Post_Mean": round(mean_post_c, 2),
            "Control_Temporal_Drift": round(delta_control, 2),
            "Treatment_Pre_Mean": round(mean_pre_t, 2),
            "Treatment_Post_Mean": round(mean_post_t, 2),
            "Treatment_Observed_Change": round(delta_treatment, 2),
            "Causal_Treatment_Effect_DiD": round(did_effect, 2),
            "Parallel_Trends_Assumed": True
        }

# Store sales ($k) across Ohio (Treatment: new pricing) vs Pennsylvania (Control: legacy pricing)
pre_pa = [120, 115, 125, 118, 122]
post_pa = [135, 130, 140, 133, 137] # PA grew by ~15k due to seasonal holiday lift

pre_ohio = [110, 108, 112, 105, 115]
post_ohio = [148, 145, 152, 142, 153] # Ohio grew by ~38k (Holiday + Pricing algorithm)

did = DifferenceInDifferencesEstimator(pre_pa, post_pa, pre_ohio, post_ohio)
res = did.estimate()
for k, v in res.items():
    print(f"{k}: {v}")""",
        "tryIt": "Alter the post-control numbers to reflect a severe macro-economic recession; observe how DiD cleanly separates external economic contraction from internal pricing strategy gains.",
        "check": {
            "scenario": "A national retail chain rolls out a new loyalty program in region A, while region B remains on the legacy program. Over six months, region A sales grew by twenty-five percent and region B sales grew by ten percent due to national inflation. What is the true causal effect of the loyalty program under Difference-in-Differences?",
            "options": [
                "Fifteen percent net incremental sales lift, obtained by subtracting the ten percent control baseline inflation drift from the twenty-five percent treatment growth.",
                "Twenty-five percent gross lift because region A experienced the full twenty-five percent increase.",
                "Thirty-five percent combined impact by summing the two regional metrics.",
                "Zero percent because regional testing violates the Gauss-Markov theorem."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The Difference-in-Differences estimator subtracts the control group's baseline temporal drift (10% inflation) from the treatment group's observed total change (25%), isolating the true incremental causal treatment effect of 15%."
        }
    },
    {
        "title": "Milestone 3 Capstone: Enterprise Causal Inference & Boardroom Attribution Tower",
        "say": [
            "We culminate this profound exploration of causal economics with the architecture of Milestone 3: The Enterprise Causal Inference & Boardroom Attribution Tower. In modern corporate enterprises, marketing, sales, and operations departments routinely present competing, contradictory claims of revenue attribution to the Board of Directors. The marketing team claims their multi-million-dollar social media campaigns drove eighty percent of quarterly growth; the sales leadership claims their outbound sales incentive bonuses drove seventy percent; and the product team claims their new website features drove sixty percent. Summed together, internal claims represent two hundred and ten percent of total company revenue—a mathematical absurdity born of unadjusted observational correlation.",
            "The Boardroom Attribution Tower resolves this institutional conflict by deploying structural causal econometrics. Rather than allowing departments to present self-serving observational regressions, the Tower enforces automated Causal Directed Acyclic Graph validation across all corporate datasets. Every data pipeline feeding executive dashboards must register its structural assumptions, documenting all proposed treatment variables, candidate confounders, mediators, and colliders in an immutable, cryptographically signed graph schema.",
            "The Tower continuously audits corporate telemetry through an automated Identification Pipeline. When a business unit requests marketing budget expansion based on historical conversion correlations, the Tower automatically tests for backdoor paths. If unobserved confounders are detected, it evaluates frontdoor mechanisms and executes automated Difference-in-Differences quasi-experimental matches across historical geographic cohorts. The system systematically calculates the E-value—a sensitivity metric developed by Tyler VanderWeele that quantifies the minimum strength of unmeasured confounding required to explain away an observed treatment effect.",
            "If an observational finding exhibits a fragile E-value of one point one, the Tower immediately flags the finding as economically unsafe, informing executive leadership that minor unmeasured customer heterogeneity could completely negate the apparent marketing uplift. Conversely, if an intervention yields a robust E-value exceeding four point five with verified parallel pre-treatment trends, the Tower certifies the causal treatment effect, unlocking capital allocation with mathematical certitude.",
            "Furthermore, the Tower incorporates automated Simpson's Paradox surveillance. Every top-level corporate KPI is continuously cross-checked against disaggregated multi-dimensional customer slices (device category, enterprise tier, geographic territory, cohort tenure). If an aggregate executive dashboard displays an upward trend while underlying high-value customer tiers are deteriorating, the Tower triggers an emergency Boardroom Anomaly Alert, preventing executive leadership from celebrating a statistical mirage while the core enterprise foundation erodes.",
            "By synthesizing Judea Pearl's Do-Calculus, Causal DAG d-separation, Frontdoor adjustments, Difference-in-Differences quasi-experimentation, and automated E-value sensitivity testing into an enterprise-grade platform, you establish sovereign decision intelligence. You protect corporate capital from self-serving corporate marketing narratives, ensuring that every dollar invested generates verified, uncorrupted incremental cash flow.",
            "As you deploy this Capstone architecture, you stand as an uncompromised Chief Analytics Officer. You possess the intellectual clarity and engineering mastery to distinguish true causal drivers from superficial statistical noise, steering the enterprise with unshakeable scientific integrity.",
            "In boardrooms governed by aggressive private equity sponsors or activist shareholders, the Attribution Tower provides indispensable defense against short-term narrative manipulation. Operating executives frequently orchestrate timing games—such as pulling forward customer contract renewals into the current fiscal quarter through unbudgeted discounting—to claim that an operational initiative drove extraordinary revenue growth. By incorporating forward-looking baseline projections and counterfactual synthetic controls, the Tower exposes inter-temporal revenue cannibalization, confirming whether an initiative created authentic net enterprise value or merely borrowed liquidity from future reporting periods.",
            "Ultimately, institutionalizing structural causal inference transforms the corporate culture from opinion-driven executive rhetoric into an evidence-based meritocracy. Marketing, product, and sales teams no longer squander cognitive bandwidth debating vanity correlation metrics or defending territorial attribution silos. Every strategic initiative is subjected to deterministic graphical scrutiny, ensuring that shareholder capital is allocated exclusively to operational levers that provably generate compounding economic cash flow."
        ],
        "example": "Think of the forensic investigation following a complex aviation incident. The National Transportation Safety Board does not accept the airline's claim that weather caused the crash, nor the manufacturer's claim that pilot error was solely responsible. The forensic team constructs an immutable causal event tree, testing flight recorder telemetry, structural metal fatigue, and hydraulic pressure lines, isolating the precise sequential root cause that initiated the failure.",
        "code": """# Milestone 3 Capstone: Enterprise Causal Attribution & E-Value Sensitivity Tower
import math

class CausalAttributionControlTower:
    def __init__(self, campaign_name: str, claimed_uplift_pct: float, risk_ratio: float):
        self.campaign = campaign_name
        self.claimed_uplift = claimed_uplift_pct
        self.rr = risk_ratio # Observed Risk Ratio of Conversion

    def compute_e_value(self) -> dict:
        # VanderWeele E-value formula for Risk Ratio > 1:
        # E_value = RR + sqrt(RR * (RR - 1))
        if self.rr > 1.0:
            e_val = self.rr + math.sqrt(self.rr * (self.rr - 1.0))
        elif self.rr > 0.0:
            inv_rr = 1.0 / self.rr
            e_val = inv_rr + math.sqrt(inv_rr * (inv_rr - 1.0))
        else:
            e_val = 1.0
            
        # Governance Threshold: Enterprise investments require E-value >= 2.0
        # (meaning an unmeasured confounder must double the risk of both treatment and outcome to explain away effect)
        is_robust = e_val >= 2.0
        
        return {
            "Campaign_Initiative": self.campaign,
            "Claimed_Uplift_Percentage": self.claimed_uplift,
            "Observed_Risk_Ratio": round(self.rr, 4),
            "VanderWeele_E_Value": round(e_val, 4),
            "Confounding_Robustness": "HIGH_CAUSAL_INTEGRITY" if is_robust else "FRAGILE_CONFOUNDING_RISK",
            "Boardroom_Approval_Recommended": is_robust
        }

# Marketing team claims a 12% revenue lift (RR = 1.12) based on unadjusted social ads
tower_fragile = CausalAttributionControlTower("Social_Influencer_Q3", claimed_uplift_pct=12.0, risk_ratio=1.12)
# Product team claims an algorithmic pricing lift (RR = 2.40) backed by quasi-experimental DiD
tower_robust = CausalAttributionControlTower("Dynamic_Pricing_Engine", claimed_uplift_pct=140.0, risk_ratio=2.40)

res_fragile = tower_fragile.compute_e_value()
res_robust = tower_robust.compute_e_value()

print("Marketing Campaign Audit:")
for k, v in res_fragile.items():
    print(f"  {k}: {v}")
print("Pricing Engine Audit:")
for k, v in res_robust.items():
    print(f"  {k}: {v}")""",
        "tryIt": "Input a campaign with an observed risk ratio of 1.05; observe how a tiny E-value of 1.28 indicates that negligible unmeasured customer targeting bias could easily account for the entire reported uplift.",
        "check": {
            "scenario": "A marketing department requests a $5M expansion budget based on an observational correlation with a risk ratio of 1.15 and an E-value of 1.57. What is the Chief Analytics Officer's recommendation to the Board of Directors?",
            "options": [
                "Reject the budget expansion: an E-value of 1.57 is extremely fragile, meaning weak unmeasured customer targeting bias (such as customers already intending to buy clicking an ad) can completely explain away the apparent lift.",
                "Approve the $5M budget because any risk ratio greater than 1.0 proves economic causation.",
                "Recommend eliminating all customer targeting to make the marketing campaign purely random.",
                "Advise using a standard t-test to convert the observational data into an experimental design."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "An E-value of 1.57 indicates that an unmeasured confounder associated with both ad exposure and purchase intent by a risk ratio of just 1.57 could entirely explain away the observed effect. In digital marketing, intent-based self-selection easily exceeds 1.57, meaning the campaign's claimed uplift is likely an observational mirage."
        }
    }
]

day7 = {
    "coursePrefix": "bcom_ana",
    "day": 7,
    "title": "Correlation vs Causation: Confounding, Simpson's Paradox & Causal DAGs",
    "goal": "Master structural causal econometrics: prove causal identifiability using Judea Pearl's Do-Calculus, resolve Simpson's Paradox across multi-tier customer segments, enforce the Backdoor Criterion, and audit corporate attribution using Difference-in-Differences and VanderWeele E-values.",
    "minutes": 38,
    "recap": "Welcome to Day 7 of Business Analytics & Decision Intelligence. Mistaking correlation for causation is corporate suicide. Today, we replace fragile regressions with structural causal DAGs and uncompromised econometric identification.",
    "parts": d7_parts
}

for i, p in enumerate(d7_parts):
    w = count_words(p["say"])
    print(f"Day 7 Part {i+1}: {w} words")
    assert w >= 600, f"Day 7 Part {i+1} only has {w} words (minimum 600 required)"
print(f"Day 7 asserted: all 5 parts >= 600 words. Total day words: {sum(count_words(p['say']) for p in d7_parts)}")
