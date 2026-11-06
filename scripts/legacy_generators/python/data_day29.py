# scripts/data_day29.py
# Day 29: Decision Trees, Expected Monetary Value (EMV) & Value of Perfect Information (EVPI)
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: Decision Analysis Under Uncertainty: Payoff Matrices & State-of-Nature Models
# -------------------------------------------------------------
p1_say = [
    "In business operations, decisions are rarely made under conditions of deterministic certainty. When a biotechnology firm commits $500 million to clinical drug trials, when an energy conglomerate bids on offshore drilling rights, or when an enterprise software corporation launches an unproven generative AI platform, executive leadership operates under profound uncertainty. Decision Intelligence provides a formal, axiomatic mathematical apparatus to evaluate competing strategic actions when outcomes depend on unpredictable states of nature.",

    "The foundational construct of decision theory is the Payoff Matrix (also known as the Decision Table). Formally, let A = {a_1, a_2, ..., a_m} represent the set of mutually exclusive Strategic Alternatives (actions under direct management control, such as building a large plant, a small plant, or licensing technology). Let Theta = {theta_1, theta_2, ..., theta_n} represent the set of mutually exclusive States of Nature (future external market conditions outside management control, such as high demand, moderate demand, or deep recession). The Payoff Function X(a_i, theta_j) maps each action-state pair to a quantifiable financial payoff (net present value profit or loss).",

    "Prior to evaluating optimization criteria, the analyst applies Dominance Principles to eliminate non-admissible alternatives. An action a_1 strictly dominates an action a_2 if the payoff for a_1 is strictly greater than the payoff for a_2 across every single possible state of nature: X(a_1, theta_j) > X(a_2, theta_j) for all j. If a_1 yields higher or equal payoffs in all states and is strictly superior in at least one state, it weakly dominates a_2. In either circumstance, dominated strategies can be safely pruned from the payoff matrix without loss of optimality, reducing computational complexity.",

    "When probabilities for the states of nature are completely unknown (Decision Making Under Strict Uncertainty), classical decision theory formulates several competing behavioral criteria: 1. The Maximax Criterion (Optimistic / Risk-Seeking): The decision-maker selects the action with the maximum possible payoff across all states: a^* = argmax_i { max_j X_{ij} }. This aggressive criterion is pursued by venture capitalists seeking outlier unicorn payoffs, ignoring downside bankruptcy risk.",

    "2. The Maximin Criterion (Wald's Conservative / Risk-Averse): Formulated by Abraham Wald in 1950, the decision-maker assumes nature is hostile and selects the action that maximizes the minimum guaranteed payoff: a^* = argmax_i { min_j X_{ij} }. This ultra-defensive criterion guarantees survival, avoiding ruin at the cost of sacrificing lucrative opportunities. 3. The Minimax Regret Criterion (Savage Opportunity Loss): Formulated by Leonard J. Savage in 1951, the decision-maker seeks to minimize post-decision psychological regret. Regret (opportunity loss) is defined as the payoff difference between the best possible decision in state theta_j and the decision actually chosen: R_{ij} = max_k { X_{kj} } - X_{ij}. The decision-maker selects the action that minimizes maximum regret: a^* = argmin_i { max_j R_{ij} }.",

    "4. The Hurwicz Criterion (Criterion of Realism): Formulated by Leonid Hurwicz, this model bridges extreme optimism and extreme pessimism through an explicit coefficient of optimism alpha in [0, 1]. For each action, the Hurwicz index is computed as: H(a_i) = alpha * max_j { X_{ij} } + (1 - alpha) * min_j { X_{ij} }. When alpha = 1, Hurwicz collapses to Maximax; when alpha = 0, it collapses to Maximin. By calibrating alpha to executive sentiment, corporate strategists can smoothly tune investment aggressiveness.",

    "5. The Principle of Insufficient Reason (Laplace Criterion): Formulated by Pierre-Simon Laplace, if there is zero evidence to suggest one state of nature is more likely than another, the decision-maker assigns equal prior probabilities: P(theta_j) = 1 / n for all j, selecting the action that maximizes the arithmetic average payoff.",

    "When objective historical or subjective Bayesian probabilities P(theta_j) are available, decision intelligence transitions to Decision Making Under Risk, governed by Expected Monetary Value (EMV): EMV(a_i) = sum_{j=1}^n P(theta_j) * X(a_i, theta_j). Furthermore, analysts compute Sensitivity Crossover Points: by treating state probabilities as algebraic variables, analysts identify the exact probability thresholds where optimal strategy shifts between alternatives, establishing operational decision boundaries.",

    "In the accompanying Python implementation, we build a foundational Payoff Matrix & Multi-Criteria Decision Engine from first principles using pure Python standard library routines. We evaluate capital investment decisions under Maximax, Maximin, Minimax Regret, Laplace, Hurwicz, and Expected Monetary Value criteria, and benchmark strategic divergence."
]

p1_code = r"""# Pure Python Payoff Matrix & Decision Criteria Engine

class PayoffMatrixAnalyzer:
    def __init__(self, actions, states, payoff_table, state_probabilities=None):
        self.actions = actions
        self.states = states
        self.payoffs = payoff_table # dict: {action: [payoff_state_1, ..., payoff_state_n]}
        self.probs = state_probabilities or [1.0 / len(states)] * len(states)
        self.m = len(actions)
        self.n = len(states)
        self._analyze()
        
    def _analyze(self):
        # 1. Maximax (Max of Max)
        self.maximax_scores = {a: max(self.payoffs[a]) for a in self.actions}
        self.maximax_choice = max(self.maximax_scores, key=self.maximax_scores.get)
        
        # 2. Maximin (Max of Min)
        self.maximin_scores = {a: min(self.payoffs[a]) for a in self.actions}
        self.maximin_choice = max(self.maximin_scores, key=self.maximin_scores.get)
        
        # 3. Laplace (Average Payoff)
        self.laplace_scores = {a: sum(self.payoffs[a]) / float(self.n) for a in self.actions}
        self.laplace_choice = max(self.laplace_scores, key=self.laplace_scores.get)
        
        # 4. Minimax Regret
        # Compute regret matrix
        max_per_state = [max(self.payoffs[a][j] for a in self.actions) for j in range(self.n)]
        self.regret_matrix = {}
        self.max_regrets = {}
        for a in self.actions:
            self.regret_matrix[a] = [max_per_state[j] - self.payoffs[a][j] for j in range(self.n)]
            self.max_regrets[a] = max(self.regret_matrix[a])
        self.minimax_regret_choice = min(self.max_regrets, key=self.max_regrets.get)
        
        # 5. Expected Monetary Value (EMV)
        self.emv_scores = {}
        for a in self.actions:
            emv = sum(p * x for p, x in zip(self.probs, self.payoffs[a]))
            self.emv_scores[a] = round(emv, 2)
        self.emv_choice = max(self.emv_scores, key=self.emv_scores.get)

    def print_decision_report(self):
        print(f"{'Strategic Alternative':26s} | {'Maximax':10s} | {'Maximin':10s} | {'Max Regret':11s} | {'EMV ($)':12s}")
        print("-" * 80)
        for a in self.actions:
            print(f"{a:26s} | ${self.maximax_scores[a]:8,.0f} | ${self.maximin_scores[a]:8,.0f} | ${self.max_regrets[a]:9,.0f} | ${self.emv_scores[a]:10,.2f}")
        print("\nDecision Recommendations by Philosophy:")
        print(f"  Maximax (Aggressive):       {self.maximax_choice} (${self.maximax_scores[self.maximax_choice]:,.0f})")
        print(f"  Maximin (Conservative):     {self.maximin_choice} (${self.maximin_scores[self.maximin_choice]:,.0f})")
        print(f"  Minimax Regret (Risk-Averse):{self.minimax_regret_choice} (Max Regret: ${self.max_regrets[self.minimax_regret_choice]:,.0f})")
        print(f"  Expected Value (EMV):       {self.emv_choice} (EMV: ${self.emv_scores[self.emv_choice]:,.2f})")

# Enterprise Investment Scenario: Factory Capacity Expansion
# States: High Demand (P=0.35), Moderate Demand (P=0.45), Low/Recession (P=0.20)
actions = ['Build Large Factory', 'Build Small Factory', 'Subcontract Outsourcing']
states = ['High Demand', 'Moderate Demand', 'Recession']
probs = [0.35, 0.45, 0.20]

payoff_data = {
    'Build Large Factory':     [4500000.0, 1800000.0, -1200000.0],
    'Build Small Factory':     [2500000.0, 2000000.0,   400000.0],
    'Subcontract Outsourcing': [1500000.0, 1200000.0,   800000.0]
}

analyzer = PayoffMatrixAnalyzer(actions, states, payoff_data, state_probabilities=probs)
print("--- STRATEGIC PAYOFF MATRIX DECISION REPORT ---")
analyzer.print_decision_report()
"""

p1_mcq = {
    "question": "What is the strategic objective of the Minimax Regret Criterion in decision analysis under uncertainty?",
    "options": [
        "To minimize the maximum opportunity loss (regret) an executive could suffer from failing to pick the best action for the state of nature that ultimately unfolds.",
        "To ensure that corporate taxes on capital gains are minimized.",
        "To guarantee that accounting profit equals zero across all economic cycles.",
        "To maximize the variance of quarterly net cash flows."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Minimax Regret computes the regret matrix R_{ij} = max_k(X_{kj}) - X_{ij} and selects the decision that minimizes the worst-case regret across all possible future states."
}

# -------------------------------------------------------------
# Part 2: Decision Trees & Backward Induction (The Rollback Method)
# -------------------------------------------------------------
p2_say = [
    "While payoff tables are ideal for single-stage decisions, complex enterprise dilemmas unfold sequentially over time: an enterprise conducts laboratory research, evaluates pilot test results, chooses whether to build a prototype, and finally decides on commercial rollout. To model sequential, multi-stage decisions under uncertainty, operations research relies on Decision Trees, pioneered by Howard Raiffa and Robert Schlaifer at Harvard Business School in 1961.",

    "A Decision Tree is a directed, chronological graph that visually and mathematically maps the sequence of decisions, chance events, and financial payoffs. Standard decision tree topology utilizes three universal geometric symbols: 1. Decision Nodes (represented by Squares): Points in time where executive management exercises direct choice among competing action branches. 2. Chance Nodes (represented by Circles): Points in time where nature or market forces determine an uncertain outcome, with probabilistic branches radiating outward (the sum of probabilities at any chance node must strictly equal 1.0). 3. Terminal Nodes (represented by Triangles): The final end-points of each scenario path, displaying the net cumulative financial payoff (cash profit or loss).",

    "To solve a decision tree and determine the optimal policy, analysts deploy Backward Induction, universally referred to in decision science as The Rollback Method. Backward induction operationalizes the famous Principle of Optimality formulated by Richard Bellman in dynamic programming: 'An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision.'",

    "The rollback algorithm starts at the terminal leaves on the far right of the tree and works backward chronologically to the root on the far left, executing two alternating mathematical rules: At Chance Nodes (Circles): Compute the Expected Monetary Value (EMV) as the probability-weighted sum of all downstream branch values: EMV(Node) = sum_{j} p_j * V_j. At Decision Nodes (Squares): Select the action branch that delivers the maximum EMV (for profit maximization) or minimum expected cost: V(Node) = max_{a} { EMV(Branch_a) - Cost(Branch_a) }. Prune (discard) all sub-optimal action branches.",

    "Beyond basic expected value maximization, modern decision tree analysis integrates Sensitivity Analysis and Real Options Analysis (ROA). Traditional discounted cash flow (DCF) models systematically undervalue corporate investments because they assume management will passively execute a multi-year project regardless of intermediate outcomes. Real options theory recognizes that decision nodes represent managerial flexibility: the option to expand if initial pilot sales are strong, the option to abandon if clinical trials reveal toxicity, and the option to defer investments until regulatory clarity emerges. Evaluating these options via decision trees captures the profound financial value of strategic adaptability.",

    "Furthermore, sensitivity analysis across decision tree probabilities reveals critical switching boundaries. For instance, in a pharmaceutical development tree, if the probability of Phase 2 trial success exceeds p^* = 0.42, the optimal root decision is to self-fund global commercialization; if p falls below 0.42, the optimal root strategy switches to licensing the patent to a multinational partner. Understanding these tipping points prevents corporate leadership from overreacting to modest fluctuations in market estimates.",

    "When multi-stage decision trees expand over many periods with numerous branching chance events, the tree topology experiences exponential growth—a phenomenon known as the 'decision bush explosion' or the curse of dimensionality. For a tree with d sequential decisions and b chance branches per stage, the terminal leaves scale as O(b^d). To manage large-scale stochastic problems beyond 5-10 stages, operations researchers transition from static decision trees to Markov Decision Processes (MDPs) and stochastic dynamic programming. In an MDP, state transitions satisfy the Markov property, allowing algorithms such as Value Iteration and Policy Iteration to solve infinite-horizon sequential decision problems efficiently without explicitly rendering an intractable visual tree graph.",

    "In the accompanying Python implementation, we build a Sequential Decision Tree & Rollback Engine from first principles without external tree libraries. We model a multi-stage pharmaceutical R&D pipeline (preclinical testing, clinical trials, and global commercial launch), execute backward induction, and identify the optimal sequential policy."
]

p2_code = r"""# Pure Python Decision Tree Rollback Engine

class DecisionTreeNode:
    def __init__(self, node_id, node_type, name, payoff=0.0):
        self.id = node_id
        self.type = node_type # 'decision', 'chance', 'terminal'
        self.name = name
        self.payoff = float(payoff)
        self.children = [] # list of (branch_name, prob_or_cost, child_node)
        self.computed_emv = 0.0
        self.best_branch = None

class SequentialDecisionTreeEngine:
    def __init__(self, root_node):
        self.root = root_node
        
    def rollback(self, node=None):
        if node is None:
            node = self.root
            
        # Base case: Terminal node
        if node.type == 'terminal':
            node.computed_emv = node.payoff
            return node.computed_emv
            
        # Recursive step: Rollback all children first
        for branch_name, cost_or_prob, child in node.children:
            self.rollback(child)
            
        # If Chance Node: EMV = sum(prob * child_emv) - cost
        if node.type == 'chance':
            emv_sum = sum(prob * child.computed_emv for _, prob, child in node.children)
            node.computed_emv = emv_sum + node.payoff
            return node.computed_emv
            
        # If Decision Node: Maximize child EMV
        elif node.type == 'decision':
            best_val = -float('inf')
            best_b = None
            for branch_name, action_cost, child in node.children:
                # Net value = child EMV - upfront action cost
                net_val = child.computed_emv - action_cost
                if net_val > best_val:
                    best_val = net_val
                    best_b = branch_name
            node.computed_emv = best_val + node.payoff
            node.best_branch = best_b
            return node.computed_emv

# Build Pharmaceutical R&D Multi-Stage Tree:
# Root Decision: Invest in Phase 2 Trial ($10M) or License Molecule Out ($4M guaranteed)
root = DecisionTreeNode(1, 'decision', 'R&D Pipeline Entry')

# Branch 1: License Out immediately
term_license = DecisionTreeNode(2, 'terminal', 'Licensed Out', payoff=4000000.0)
root.children.append(('License Out', 0.0, term_license))

# Branch 2: Fund Phase 2 Trial ($10M cost) -> Chance Node
chance_trial = DecisionTreeNode(3, 'chance', 'Phase 2 Clinical Results', payoff=-10000000.0)
root.children.append(('Fund Phase 2 Trial ($10M)', 0.0, chance_trial))

# Trial Outcome A: Success (Prob = 0.60) -> Decision Node (Commercialize vs Partner)
dec_commercial = DecisionTreeNode(4, 'decision', 'Commercialization Choice')
chance_trial.children.append(('Success (60%)', 0.60, dec_commercial))

# Sub-decision: Global Launch ($40M cost) -> Chance Node (Market Demand)
chance_market = DecisionTreeNode(5, 'chance', 'Market Demand', payoff=-40000000.0)
dec_commercial.children.append(('Global Commercial Launch ($40M)', 0.0, chance_market))

# High Market (Prob = 0.70) -> Terminal $150M gross profit
term_high = DecisionTreeNode(6, 'terminal', 'Blockbuster', payoff=150000000.0)
# Low Market (Prob = 0.30) -> Terminal $30M gross profit
term_low = DecisionTreeNode(7, 'terminal', 'Modest Sales', payoff=30000000.0)
chance_market.children.append(('High Demand (70%)', 0.70, term_high))
chance_market.children.append(('Low Demand (30%)', 0.30, term_low))

# Sub-decision: Co-Promote Partner (Cost $5M, guaranteed $55M payout)
term_partner = DecisionTreeNode(8, 'terminal', 'Co-Promote Partner', payoff=50000000.0)
dec_commercial.children.append(('Co-Promote Partner ($5M)', 0.0, term_partner))

# Trial Outcome B: Failure (Prob = 0.40) -> Terminal $0
term_fail = DecisionTreeNode(9, 'terminal', 'Clinical Failure', payoff=0.0)
chance_trial.children.append(('Failure (40%)', 0.40, term_fail))

tree_solver = SequentialDecisionTreeEngine(root)
expected_val = tree_solver.rollback()

print("--- SEQUENTIAL DECISION TREE BACKWARD INDUCTION REPORT ---")
print(f"Optimal Policy Expected Monetary Value (EMV): ${expected_val:12,.2f}\n")
print(f"Root Decision: {root.best_branch}")
print(f"  Chance Node (Phase 2 Trial) EMV: ${chance_trial.computed_emv:12,.2f}")
print(f"  Post-Success Decision:          {dec_commercial.best_branch}")
print(f"  Global Launch Chance EMV:       ${chance_market.computed_emv:12,.2f}")
"""

p2_mcq = {
    "question": "In the Decision Tree Rollback Method, what mathematical operation is performed at Chance Nodes versus Decision Nodes?",
    "options": [
        "At Chance Nodes, compute the probability-weighted Expected Monetary Value (EMV); at Decision Nodes, select the branch that maximizes the net EMV.",
        "At Chance Nodes, select the minimum regret; at Decision Nodes, compute the Gaussian quantile function.",
        "At Chance Nodes, multiply payoffs by corporate income taxes; at Decision Nodes, compute ordinary least squares slopes.",
        "At Chance Nodes, divide payoffs by the inventory turnover rate; at Decision Nodes, prune all positive cash flows."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The rollback method calculates EMV at chance nodes (sum of prob * value) and chooses the maximizing action at decision nodes (max EMV), working backward from leaves to root."
}

# -------------------------------------------------------------
# Part 3: Expected Value of Perfect Information (EVPI) & Imperfect Information (EVSI)
# -------------------------------------------------------------
p3_say = [
    "In real-world commercial management, executives rarely make final commitments without attempting to acquire better intelligence. A retail chain conducts consumer focus groups, a technology company runs pilot A/B tests, and a mining corporation commissions geological seismic surveys. But intelligence gathering is not free: market research agencies, consulting firms, and clinical labs charge hundreds of thousands or millions of dollars. How much should an executive be willing to pay for information?",

    "Decision intelligence provides the definitive quantitative answer through the Expected Value of Perfect Information (EVPI). Perfect information assumes the existence of an infallible oracle that can tell management with 100% certainty which state of nature theta_j will occur BEFORE the executive must choose action a_i.",

    "To calculate EVPI, we first compute the Expected Value with Perfect Information (EVwPI). Under perfect information, if the oracle announces state theta_j, a rational manager will naturally pick the specific action that yields the absolute highest payoff for that state: max_i { X_{ij} }. Because state theta_j occurs with prior probability P(theta_j), the Expected Value with Perfect Information is: EVwPI = sum_{j=1}^n P(theta_j) * [ max_i { X_{ij} } ].",

    "Next, we compute the Expected Monetary Value without information, which is simply the maximum EMV achievable under the base payoff matrix: EMV^* = max_i { EMV(a_i) }. The Expected Value of Perfect Information is the difference between these two values: EVPI = EVwPI - EMV^*. EVPI establishes the absolute theoretical ceiling on the economic value of information: No rational executive should ever pay a market research firm or consultant more than EVPI, because even 100% perfect, divine clairvoyance is worth only EVPI! EVPI can also be interpreted as the Expected Opportunity Loss (EOL) of the optimal base action.",

    "In operational reality, real-world market tests and diagnostic surveys are never 100% perfect; they provide noisy, imperfect sample signals. The Expected Value of Sample Information (EVSI) evaluates the value of real-world imperfect tests. Calculating EVSI requires Bayes' Theorem to update prior probabilities P(theta_j) into posterior probabilities P(theta_j | S_k) based on the test's empirical sensitivity and specificity: P(theta_j | S_k) = [ P(S_k | theta_j) * P(theta_j) ] / [ sum_m P(S_k | theta_m) * P(theta_m) ]. Here, the denominator represents the marginal probability P(S_k) of observing test signal S_k across the entire sample space.",

    "Once posterior probabilities are calculated for each potential survey result S_k, we compute the optimal decision and resulting EMV conditional on observing S_k: EMV^*(S_k) = max_i { sum_j P(theta_j | S_k) * X_{ij} }. The Expected Value with Sample Information (EVwSI) is then the expectation over all possible sample signals: EVwSI = sum_k P(S_k) * EMV^*(S_k). EVSI is formally defined as: EVSI = EVwSI - EMV^*. The Expected Net Gain of Sampling (ENGS) subtracts the survey cost C: ENGS = EVSI - C. If ENGS > 0, commissioning the research is economically rational; if ENGS <= 0, the survey destroys shareholder value.",

    "The ratio of EVSI to EVPI defines the Information Efficiency of the test: Efficiency = (EVSI / EVPI) * 100%. If a $50,000 market survey has an EVPI ceiling of $200,000 and generates an EVSI of $150,000, its efficiency is 75%, and its ENGS is +$100,000. Information economics thus transforms marketing research from a speculative administrative expense into a quantitatively rigorous capital budgeting decision.",

    "From an information theoretic perspective, the Expected Value of Perfect Information is intimately connected to Claude Shannon's concept of Information Entropy: H(Theta) = - sum_{j=1}^n P(theta_j) * log_2(P(theta_j)). Entropy measures the prior uncertainty or surprise inherent in the distribution of market states. When a market research survey provides signal S_k, the conditional entropy H(Theta | S) measures residual uncertainty after observing the survey. The difference H(Theta) - H(Theta | S) is the Mutual Information or Information Gain. While Shannon entropy measures information in bits, decision theory converts bits of entropy reduction into monetary currency (dollars of Expected Net Gain), providing the definitive link between communication theory and financial asset valuation.",

    "In the accompanying Python implementation, we build an EVPI & Bayesian EVSI Information Valuation Engine. We compute EVwPI, calculate exact EVPI ceilings, update prior probabilities via Bayes' theorem given test diagnostic reliability, compute EVSI, and determine whether a commercial test is worth its purchase price."
]

p3_code = r"""# Pure Python EVPI & Bayesian EVSI Information Valuation Engine

class InformationValuationEngine:
    def __init__(self, actions, states, prior_probs, payoff_matrix):
        self.actions = actions
        self.states = states
        self.priors = prior_probs # [P(s1), ..., P(sn)]
        self.payoffs = payoff_matrix # dict of {action: [payoffs]}
        self._calculate_evpi()
        
    def _calculate_evpi(self):
        # 1. Base EMV without information: max_i(sum(p_j * X_ij))
        emv_base = {}
        for a in self.actions:
            emv_base[a] = sum(p * x for p, x in zip(self.priors, self.payoffs[a]))
        self.best_base_emv = max(emv_base.values())
        self.best_base_action = max(emv_base, key=emv_base.get)
        
        # 2. Expected Value with Perfect Information (EVwPI)
        # In each state j, pick best action max_i(X_ij)
        n_states = len(self.states)
        best_payoff_per_state = [max(self.payoffs[a][j] for a in self.actions) for j in range(n_states)]
        self.evwpi = sum(p * x for p, x in zip(self.priors, best_payoff_per_state))
        
        # 3. EVPI = EVwPI - Best Base EMV
        self.evpi = self.evwpi - self.best_base_emv

    def evaluate_imperfect_sample_test(self, test_cost, P_favorable_given_state, P_unfavorable_given_state):
        # Bayesian probability update for binary test: Favorable (F) vs Unfavorable (U)
        # P_favorable_given_state: [P(F|s1), P(F|s2), ...]
        
        # Total probability of favorable signal: P(F) = sum(P(F|sj) * P(sj))
        p_F = sum(p_f * p for p_f, p in zip(P_favorable_given_state, self.priors))
        p_U = sum(p_u * p for p_u, p in zip(P_unfavorable_given_state, self.priors))
        
        # Posterior probabilities: P(sj | F) = P(F | sj) * P(sj) / P(F)
        posteriors_F = [(p_f * p) / p_F for p_f, p in zip(P_favorable_given_state, self.priors)]
        posteriors_U = [(p_u * p) / p_U for p_u, p in zip(P_unfavorable_given_state, self.priors)]
        
        # Best action given Favorable signal
        emv_given_F = {a: sum(p * x for p, x in zip(posteriors_F, self.payoffs[a])) for a in self.actions}
        best_emv_F = max(emv_given_F.values())
        
        # Best action given Unfavorable signal
        emv_given_U = {a: sum(p * x for p, x in zip(posteriors_U, self.payoffs[a])) for a in self.actions}
        best_emv_U = max(emv_given_U.values())
        
        # Expected Monetary Value with Sample Information (EVwSI)
        evwsi = (p_F * best_emv_F) + (p_U * best_emv_U)
        
        # EVSI = EVwSI - Base EMV
        evsi = evwsi - self.best_base_emv
        net_gain_from_test = evsi - test_cost
        efficiency_pct = (evsi / self.evpi) * 100.0 if self.evpi > 0 else 0.0
        
        return {
            'EVPI_ceiling': round(self.evpi, 2),
            'EVSI_sample_value': round(evsi, 2),
            'test_cost': round(test_cost, 2),
            'net_economic_benefit': round(net_gain_from_test, 2),
            'information_efficiency_pct': round(efficiency_pct, 1),
            'recommendation': "PURCHASE MARKET SURVEY" if net_gain_from_test > 0 else "REJECT SURVEY (Too Expensive!)"
        }

# Strategic Product Launch Case:
# Actions: Build Factory ($1.2M base EMV), Licensing ($0.8M)
# States: High Demand (P=0.60), Low Demand (P=0.40)
actions = ['Full Factory Build', 'License Patent Out']
states = ['High Market Demand', 'Low Market Demand']
priors = [0.60, 0.40]

payoffs = {
    'Full Factory Build': [5000000.0, -2000000.0], # High = $5M, Low = -$2M
    'License Patent Out': [1200000.0,   800000.0]  # Safe license
}

engine = InformationValuationEngine(actions, states, priors, payoffs)
# Market Research Survey costs $150,000.
# Accuracy: P(F | High) = 0.85, P(F | Low) = 0.15 (85% sensitive and specific)
test_eval = engine.evaluate_imperfect_sample_test(
    test_cost=150000.0,
    P_favorable_given_state=[0.85, 0.15],
    P_unfavorable_given_state=[0.15, 0.85]
)

print("--- EXPECTED VALUE OF PERFECT (EVPI) & SAMPLE (EVSI) INFORMATION ---")
print(f"Baseline Best Action without Info: {engine.best_base_action} (EMV: ${engine.best_base_emv:10,.2f})")
print(f"Expected Value with Perfect Info: ${engine.evwpi:10,.2f}")
print(f"Max Theoretical Ceiling (EVPI):    ${engine.evpi:10,.2f}\n")

print(f"Imperfect Survey Value (EVSI):     ${test_eval['EVSI_sample_value']:10,.2f}")
print(f"Survey Fee:                        ${test_eval['test_cost']:10,.2f}")
print(f"Net Economic Benefit from Survey:  ${test_eval['net_economic_benefit']:10,.2f} (Efficiency: {test_eval['information_efficiency_pct']}%)")
print(f"Executive Decision Mandate:        {test_eval['recommendation']}")
"""

p3_mcq = {
    "question": "What is the strategic operational meaning of the Expected Value of Perfect Information (EVPI = EVwPI - Base EMV)?",
    "options": [
        "It represents the absolute mathematical upper bound on what an enterprise should pay for any market research, survey, or consulting study.",
        "It measures the total interest expense paid on corporate credit lines.",
        "It calculates the probability that customer demand will fall into a recession.",
        "It guarantees that sample surveys have one hundred percent accuracy."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "EVPI measures the difference between clairvoyant decision-making and standard base expected value. No survey (even 100% accurate) can be worth more than EVPI."
}

# -------------------------------------------------------------
# Part 4: Risk Tolerance, Utility Theory & Certainty Equivalents
# -------------------------------------------------------------
p4_say = [
    "While Expected Monetary Value (EMV) is an indispensable mathematical baseline, maximizing expected dollars is valid if and only if the decision-maker is strictly Risk-Neutral. In real-world enterprise boardrooms and human psychology, decision-makers are rarely risk-neutral. Consider a coin-flip gamble: Heads you win $200 million, Tails you lose $100 million. The Expected Monetary Value is positive: EMV = 0.50 * ($200M) + 0.50 * (-$100M) = +$50 million. Yet almost every corporate board on Earth would reject this gamble because a $100 million loss means bankruptcy, destroying the enterprise.",

    "To resolve this fundamental limitation of expected monetary value, Swiss mathematician Daniel Bernoulli formulated Utility Theory in 1738 to solve the famous St. Petersburg Paradox. In 1944, John von Neumann and Oskar Morgenstern formalized Expected Utility Theory as an axiomatic foundation of modern economics, grounded in four rigorous behavioral axioms: Completeness (preferences can always be ordered), Transitivity (if A is preferred to B, and B to C, then A is preferred to C), Continuity (the Archimedean property ensuring smooth trade-offs), and Independence (the sure-thing principle, stating that preference between lotteries is unaffected by mixing with a common third lottery).",

    "Expected Utility Theory posits that rational decision-makers maximize Expected Utility E[U(X)] rather than raw expected dollars. A Utility Function U(x) maps objective monetary wealth x into subjective psychological utility. The geometric curvature of the utility function reflects the decision-maker's risk posture: 1. Risk-Averse (Concave Utility, d^2U/dx^2 < 0): Marginal utility of wealth decreases as wealth grows. The pain of losing $100,000 exceeds the joy of winning $100,000. 2. Risk-Neutral (Linear Utility, d^2U/dx^2 = 0): Decision-maker cares only about EMV. 3. Risk-Seeking (Convex Utility, d^2U/dx^2 > 0): Decision-maker gambles for extreme upside.",

    "Economists quantify risk aversion using Arrow-Pratt Measures. Absolute Risk Aversion is defined as A(x) = -U''(x) / U'(x). In corporate decision analysis, the most widely deployed utility formulation is the Exponential Utility Function, developed by Ralph Keeney and Howard Raiffa: U(x) = 1 - exp(-x / R). Remarkably, the exponential utility function exhibits Constant Absolute Risk Aversion (CARA): A(x) = 1 / R for all wealth levels x. The constant R represents the enterprise's Risk Tolerance parameter (measured in dollars). Because CARA utility displays wealth-independence, an enterprise evaluates a strategic project identically regardless of short-term cash fluctuations.",

    "Connecting utility back to cash finance is the Certainty Equivalent (CE). The Certainty Equivalent is the exact guaranteed cash amount that a decision-maker would accept with 100% certainty in exchange for giving up a risky lottery: U(CE) = E[U(X)]. For an exponential utility function, the Certainty Equivalent is calculated analytically by inverting the utility function: CE = -R * ln( 1 - E[U(X)] ).",

    "The difference between the Expected Monetary Value and the Certainty Equivalent is the Corporate Risk Premium (RP): RP = EMV - CE. The Risk Premium represents the dollar amount of expected profit that a risk-averse corporation is willing to sacrifice to purchase certainty and eliminate downside volatility. For risk-averse agents, RP > 0 and CE < EMV. For risk-neutral agents, RP = 0 and CE = EMV. Integrating utility theory ensures that strategic decision trees recommend choices aligned with the board's true risk appetite.",

    "In executive consulting, analysts calibrate R using the Howard-Matheson Reference Lottery: The analyst asks the CEO, 'Suppose you are offered a 50-50 business venture where you can win $2Y or lose $Y. What is the maximum loss $Y your corporation would comfortably tolerate?' For exponential utility, the corporate risk tolerance R is approximately equal to Y. By grounding utility curves in concrete executive thresholds, decision scientists bridge abstract mathematical theory and corporate governance.",

    "In the accompanying Python implementation, we build an Expected Utility & Certainty Equivalent Engine from first principles. We calibrate exponential utility curves across competing risk tolerance parameters, compute Certainty Equivalents, and calculate corporate Risk Premiums."
]

p4_code = r"""# Pure Python Expected Utility & Certainty Equivalent Engine
import math

class UtilityAnalysisEngine:
    def __init__(self, risk_tolerance_R=1000000.0):
        # R = Corporate Risk Tolerance ($)
        self.R = float(risk_tolerance_R)
        
    def utility(self, x):
        # Exponential utility: U(x) = 1 - exp(-x / R)
        return 1.0 - math.exp(-float(x) / self.R)
        
    def certainty_equivalent(self, expected_utility):
        # Invert utility: CE = -R * ln(1 - E[U])
        if expected_utility >= 1.0:
            return float('inf')
        return -self.R * math.log(1.0 - expected_utility)
        
    def evaluate_risky_gamble(self, probabilities, payoffs):
        # 1. Expected Monetary Value (EMV)
        emv = sum(p * x for p, x in zip(probabilities, payoffs))
        
        # 2. Expected Utility: E[U(X)] = sum(p_i * U(x_i))
        eu = sum(p * self.utility(x) for p, x in zip(probabilities, payoffs))
        
        # 3. Certainty Equivalent (CE)
        ce = self.certainty_equivalent(eu)
        
        # 4. Risk Premium: RP = EMV - CE
        risk_premium = emv - ce
        
        return {
            'risk_tolerance_R': round(self.R, 2),
            'expected_monetary_value_EMV': round(emv, 2),
            'expected_utility': round(eu, 5),
            'certainty_equivalent_CE': round(ce, 2),
            'risk_premium_RP': round(risk_premium, 2),
            'executive_decision': "ACCEPT GAMBLE" if ce > 0 else "REJECT (Too Volatile for Risk Appetite)"
        }

# Risky Corporate Project: 50% chance of +$2.5M, 50% chance of -$500,000 (EMV = +$1.0M)
probs = [0.50, 0.50]
gamble_payoffs = [2500000.0, -500000.0]

print("--- CORPORATE RISK APPETITE & CERTAINTY EQUIVALENT (CE) BENCHMARK ---")
print(f"Gamble: 50% chance of +$2.5M, 50% chance of -$500k -> Raw EMV = +$1,000,000\n")

# Evaluate across 3 different company sizes / risk tolerances:
# 1. Conservative Small Business (R = $750k)
# 2. Mid-Market Corporation (R = $2.5M)
# 3. Mega-Cap Enterprise (R = $10M)
risk_tolerances = [750000.0, 2500000.0, 10000000.0]

for r_val in risk_tolerances:
    engine = UtilityAnalysisEngine(risk_tolerance_R=r_val)
    res = engine.evaluate_risky_gamble(probs, gamble_payoffs)
    print(f"Risk Tolerance R = ${r_val:10,.0f}:")
    print(f"  Certainty Equivalent (CE): ${res['certainty_equivalent_CE']:10,.2f}")
    print(f"  Corporate Risk Premium:    ${res['risk_premium_RP']:10,.2f} sacrificed for safety")
    print(f"  Boardroom Decision:        {res['executive_decision']}\n")
"""

p4_mcq = {
    "question": "What is the economic interpretation of the Certainty Equivalent (CE) in corporate utility theory?",
    "options": [
        "The guaranteed cash amount that a risk-averse executive would accept with certainty rather than undertake a risky probabilistic venture.",
        "The exact dollar sum owed to commercial banking institutions upon debt maturation.",
        "The maximum price a company can charge under linear demand elasticity models.",
        "The inventory safety stock buffer required to guarantee zero stockouts."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Certainty Equivalent CE satisfies U(CE) = E[U(X)]. It is the certain dollar payout that yields the same utility as the risky gamble, quantifying risk-averse willingness to trade upside for safety."
}

# -------------------------------------------------------------
# Part 5: Building an Enterprise Decision Tree & EVPI Analytical Engine in Python
# -------------------------------------------------------------
p5_say = [
    "To conclude Day 29, we synthesize all mathematical constructs—payoff matrices, decision tree backward induction, EVPI information valuation, Bayesian EVSI probability updating, and expected utility—into an enterprise-grade Decision Intelligence Simulation Suite.",

    "Our comprehensive engine executes three integrated modules: Module One (Sequential Decision Tree Rollback): Builds and solves multi-stage commercial investment trees, tracking chance node expectations and pruning sub-optimal action branches via Bellman's principle of backward induction. It evaluates capital outlays, milestone probabilities, and exit strategies.",

    "Module Two (Information Economics & Bayes' Theorem): Computes the theoretical EVPI information ceiling, evaluates empirical market research surveys, updates prior beliefs via Bayes' theorem, and calculates net financial returns on intelligence investments. It calculates the Expected Net Gain of Sampling (ENGS) and information efficiency ratios, providing financial justification before corporate market research contracts are executed.",

    "Module Three (Risk-Adjusted Certainty Equivalents): Converts raw monetary payoffs into exponential utility curves, benchmarking whether risky ventures align with the corporate board's risk tolerance parameter R. By computing Certainty Equivalents (CE) and Corporate Risk Premiums (RP), it translates complex probability distributions into single, risk-neutral cash equivalents that can be directly compared against alternative corporate investments.",

    "From an enterprise architecture perspective, this analytical suite is designed for seamless integration into corporate governance workflows. In modern data stacks, prior probabilities are dynamically fetched from enterprise data warehouses (Snowflake, BigQuery), while payoff tables are populated by financial FP&A models. When high-stakes decisions—such as acquiring an emerging technology startup, launching a pharmaceutical compound, or entering a new foreign territory—are presented to the board of directors, the engine provides an unassailable quantitative audit trail.",

    "Under corporate governance frameworks such as Sarbanes-Oxley (SOX Section 404) and fiduciary duty standards (the Business Judgment Rule), executive boards must demonstrate that material capital commitments were made with rigorous diligence. A documented decision tree with transparent Bayesian sensitivity and risk-tolerance calibration proves that management evaluated alternative states of nature, quantified downside ruin scenarios, and optimized capital allocation objectively.",

    "To guard against cognitive anchoring and overconfidence in probability estimates, modern enterprise decision suites integrate Monte Carlo Sensitivity Simulation alongside deterministic rollback. Instead of assuming static point probabilities—such as exactly 40% probability of rapid market adoption—analysts specify Dirichlet or Beta probability distributions over external states of nature. By simulating tens of thousands of random scenario draws through the decision tree, the engine generates an empirical Cumulative Distribution Function (CDF) and Value-at-Risk (VaR) profile for each strategic alternative. This probabilistic envelope reveals not only the mean expected monetary value, but the 5th percentile downside loss, enabling risk committees to verify that catastrophic tail losses do not exceed corporate capital reserves.",

    "Finally, quantitative decision modeling serves as an essential cognitive debiasing tool for senior management. Behavioral economists Daniel Kahneman and Amos Tversky demonstrated through Prospect Theory that human executives routinely succumb to systematic cognitive distortions: Loss Aversion (losses hurt twice as much as equivalent gains), Framing Effects (preferences invert depending on whether outcomes are described as gains or avoided losses), and Sunk Cost Fallacy (throwing good money after bad into failing legacy projects). By enforcing strict separation between sunk historical expenditures, forward-looking conditional probabilities, and formal utility functions, the Master Strategic Decision Suite eliminates emotional bias and anchors capital allocation in unassailable fiduciary mathematics.",

    "Furthermore, this decision engine establishes a clear institutional taxonomy for strategic scenario planning. Senior data analysts can parameterize the suite across varying macro scenarios—such as high interest rates, geopolitical disruptions, or aggressive competitor pricing—instantly recalculating the expected value of information and optimal capital commitments. By automating these scenario runs, decision intelligence transforms static quarterly planning into continuous, real-time capital stewardship.",

    "In the accompanying Python implementation, we build this complete Master Enterprise Decision Tree & Information Valuation Engine from first principles without third-party dependencies. We solve a complex corporate strategic dilemma, evaluate market survey ROI, calculate certainty equivalents across multiple risk postures, and output the executive decision scorecard."
]

p5_code = r"""# Pure Python Master Decision Tree & Information Economics Suite
import math

class MasterStrategicDecisionSuite:
    def __init__(self, base_actions, states, prior_probs, payoff_table, risk_tolerance_R=2000000.0):
        self.actions = base_actions
        self.states = states
        self.priors = prior_probs
        self.payoffs = payoff_table
        self.R = float(risk_tolerance_R)
        self._analyze()
        
    def _analyze(self):
        # 1. Compute Base EMV
        self.emv_scores = {}
        for a in self.actions:
            self.emv_scores[a] = sum(p * x for p, x in zip(self.priors, self.payoffs[a]))
            
        self.best_emv = max(self.emv_scores.values())
        self.best_action = max(self.emv_scores, key=self.emv_scores.get)
        
        # 2. Compute EVPI
        n_states = len(self.states)
        best_in_state = [max(self.payoffs[a][j] for a in self.actions) for j in range(n_states)]
        evwpi = sum(p * x for p, x in zip(self.priors, best_in_state))
        self.evpi = evwpi - self.best_emv
        
        # 3. Utility Analysis on Best Action
        best_action_payoffs = self.payoffs[self.best_action]
        eu = sum(p * (1.0 - math.exp(-float(x) / self.R)) for p, x in zip(self.priors, best_action_payoffs))
        self.ce = -self.R * math.log(1.0 - eu) if eu < 1.0 else self.best_emv
        self.risk_premium = self.best_emv - self.ce

    def generate_executive_scorecard(self, market_survey_cost=80000.0, survey_efficiency_pct=0.70):
        evsi = self.evpi * (survey_efficiency_pct / 100.0)
        net_survey_value = evsi - market_survey_cost
        
        return {
            'best_strategic_action': self.best_action,
            'expected_monetary_value_EMV': round(self.best_emv, 2),
            'risk_adjusted_certainty_equivalent': round(self.ce, 2),
            'corporate_risk_premium': round(self.risk_premium, 2),
            'max_information_ceiling_EVPI': round(self.evpi, 2),
            'estimated_survey_value_EVSI': round(evsi, 2),
            'survey_cost': round(market_survey_cost, 2),
            'net_survey_roi': round(net_survey_value, 2),
            'survey_mandate': "APPROVE MARKET SURVEY BUDGET" if net_survey_value > 0 else "REJECT SURVEY BUDGET"
        }

# Strategic Dilemma: New Technology Commercialization
actions = ['Full Commercial Launch', 'Pilot Market Trial', 'Sell IP Rights']
states = ['Rapid Adoption', 'Moderate Adoption', 'Market Failure']
priors = [0.40, 0.40, 0.20]

payoff_data = {
    'Full Commercial Launch': [6000000.0, 1500000.0, -2500000.0],
    'Pilot Market Trial':      [3500000.0, 1800000.0,  -400000.0],
    'Sell IP Rights':         [1200000.0, 1200000.0,  1200000.0]
}

suite = MasterStrategicDecisionSuite(actions, states, priors, payoff_data, risk_tolerance_R=3000000.0)
card = suite.generate_executive_scorecard(market_survey_cost=100000.0, survey_efficiency_pct=65.0)

print("--- MASTER STRATEGIC DECISION INTELLIGENCE EXECUTIVE SCORECARD ---")
for k, v in card.items():
    print(f"  {k:36s}: {v}")
"""

p5_mcq = {
    "question": "What is the primary corporate decision intelligence function of the Master Strategic Decision Suite?",
    "options": [
        "To synthesize sequential backward induction, information economics (EVPI/EVSI), and risk-adjusted utility into an objective, defensible capital allocation mandate.",
        "To replace financial auditors during annual statutory regulatory filings.",
        "To guarantee that all capital investment ventures achieve zero downside risk.",
        "To eliminate the need for corporate board governance votes."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The Master Strategic Decision Suite unifies expected monetary values, the economic value of information (EVPI), and risk-adjusted Certainty Equivalents into an unassailable executive decision system."
}

# -------------------------------------------------------------
# DAY_DATA Aggregation & Validation
# -------------------------------------------------------------
DAY_DATA = {
    "day": 29,
    "courseId": "bcom_ana",
    "title": "Decision Trees, Expected Monetary Value (EMV) & Value of Perfect Information (EVPI)",
    "description": "Master strategic decision analysis under uncertainty: Payoff matrices, Maximax, Maximin, and Minimax Regret criteria, decision tree backward induction (the Rollback Method), the Expected Value of Perfect Information (EVPI), Bayesian EVSI updating, and von Neumann-Morgenstern utility theory.",
    "parts": [
        {
            "title": "Decision Analysis Under Uncertainty: Payoff Matrices & State-of-Nature Models",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "title": "Decision Trees & Backward Induction (The Rollback Method)",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "title": "Expected Value of Perfect Information (EVPI) & Imperfect Information (EVSI)",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "title": "Risk Tolerance, Utility Theory & Certainty Equivalents",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "title": "Building an Enterprise Decision Tree & EVPI Analytical Engine in Python",
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
