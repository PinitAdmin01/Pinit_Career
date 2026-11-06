import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read scripts/day54_builder.py
with open('scripts/day54_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 2 expansion paragraph (adds ~130 words)
part2_target = '"In this second segment, we construct a Multi-Metric Mathematical Fairness Auditing Suite in Python. We implement Demographic Parity, Equal Opportunity (TPR parity), and Predictive Value Calibration across demographic cohorts, demonstrate the mathematical trade-offs of the Impossibility Theorem, and generate an executive fairness tradeoff matrix."'
part2_replacement = '''"Algorithmic Fairness Pareto Frontiers illustrate the operational tension between predictive accuracy and demographic equity. By plotting model ROC AUC against equalized odds violation across a spectrum of fairness regularization penalties, data science teams present clear tradeoff curves to executive oversight committees. Rather than operating blindly, the Board Audit Committee can strategically select an operating point that maximizes enterprise risk-adjusted return while maintaining statutory compliance margins well within regulatory tolerances.",
                    "Fairness Drift Monitoring is essential once models are deployed in volatile macroeconomic environments. Under changing inflation rates, labor market dislocations, or shifts in credit utilization, a model calibrated during economic expansion can rapidly develop acute disparate impact. Enterprise LLMOps platforms therefore compute continuous streaming confusion matrices across demographic cohorts, triggering automated rollback protocols whenever disparity metrics exceed pre-defined safety bounds.",
                    "In this second segment, we construct a Multi-Metric Mathematical Fairness Auditing Suite in Python. We implement Demographic Parity, Equal Opportunity (TPR parity), and Predictive Value Calibration across demographic cohorts, demonstrate the mathematical trade-offs of the Impossibility Theorem, and generate an executive fairness tradeoff matrix."'''

# Part 3 expansion paragraph (adds ~160 words)
part3_target = '"In this third segment, we construct a Cooperative Game-Theoretic Shapley Attribution Engine in pure standard Python. We compute exact Shapley values across combinatorial feature coalitions, verify the Efficiency Property, rank negative contributors, and generate an official ECOA-compliant Adverse Action Notice."'
part3_replacement = '''"Baseline and Background Distribution Selection in SHAP calculations demands rigorous statistical discipline. Because Shapley values measure deviations from an expected reference value, selecting an inappropriate baseline—such as an unrepresentative synthetic median applicant or an extreme outlier profile—can artificially distort feature attributions, masking discriminatory proxy influences or producing misleading adverse action justifications. Fiduciary standards mandate empirical background distribution sampling derived from audited demographic representative datasets.",
                    "High-Throughput TreeSHAP Approximations enable sub-millisecond real-time attribution in mission-critical transaction environments. While exact combinatorial Shapley computation scales exponentially with feature count (requiring 2^n model evaluations), TreeSHAP optimizes path-dependent tree traversals in polynomial time O(TLD^2), allowing banking gateways to generate certified adverse action notices synchronously during interactive underwriting without degrading customer application response latencies.",
                    "In this third segment, we construct a Cooperative Game-Theoretic Shapley Attribution Engine in pure standard Python. We compute exact Shapley values across combinatorial feature coalitions, verify the Efficiency Property, rank negative contributors, and generate an official ECOA-compliant Adverse Action Notice."'''

# Part 4 expansion paragraph (adds ~170 words)
part4_target = '"In this fourth segment, we construct a Local LIME Surrogate & Actionable Counterfactual Recourse Generator in pure standard Python. We fit local linear decision boundaries, enforce feasibility constraints on immutable features, compute minimal actionable feature perturbations, and generate an official Fiduciary Recourse Roadmap."'
part4_replacement = '''"Sparse Linear Surrogate Fidelity vs Complexity Tradeoffs govern the reliability of LIME explanations. When fitting local surrogates around complex decision boundaries, selecting an overly complex kernel width or excessive feature coefficients causes the surrogate to overfit local noise, generating volatile and irreproducible explanations that fail judicial scrutiny. Enterprise governance frameworks mandate strict regularization constraints (such as LASSO L1 penalties) to ensure that explanations remain both locally faithful and cognitively interpretable by non-technical administrative judges.",
                    "Counterfactual Manifold Proximity ensures that suggested recourse steps lie on the true data manifold rather than in unpopulated feature space. If an optimizer suggests paying down debt while simultaneously quintupling credit limits without additional income, the counterfactual violates implicit joint feature distributions. Advanced counterfactual engines incorporate generative density estimators (such as VAEs or normalizing flows) to guarantee that every proposed applicant pathway is economically realistic and achievable in the real economy.",
                    "In this fourth segment, we construct a Local LIME Surrogate & Actionable Counterfactual Recourse Generator in pure standard Python. We fit local linear decision boundaries, enforce feasibility constraints on immutable features, compute minimal actionable feature perturbations, and generate an official Fiduciary Recourse Roadmap."'''

# Part 5 expansion paragraph (adds ~230 words)
part5_target = '"In this final masterclass implementation, we construct the Enterprise Algorithmic Auditing & Fiduciary Fairness Cockpit in standard Python. We execute an end-to-end audit of a commercial lending engine, evaluate EEOC disparate impact ratios, test mathematical fairness trade-offs, compute game-theoretic Shapley attributions for denied applicants, generate actionable counterfactual recourse, and confer the CFAE credential."'
part5_replacement = '''"Enterprise Algorithmic Auditing Architecture unifies these disparate analytical disciplines into a centralized fiduciary governance cockpit. In tier-one financial institutions, the Chief AI Ethics Officer and Chief Compliance Officer monitor live dashboards that integrate real-time disparate impact tracking, automated adverse action generation, counterfactual feasibility scores, and model drift telemetry. When regulatory examiners from the CFPB or European Data Protection Board conduct statutory audits, the system automatically exports cryptographically signed compliance ledgers proving that every automated corporate decision strictly complied with applicable legal and ethical mandates.",
                    "Continuous Model Validation & Automated Retraining Governance guarantees that post-deployment algorithmic updates do not reintroduce bias. When machine learning engineering teams propose retraining models on updated transaction datasets, the governance cockpit executes automated champion-challenger shadow audits. If a challenger model demonstrates superior predictive accuracy but degrades the Disparate Impact Ratio or increases the Equal Opportunity gap, automated fiduciary deployment gates block production release until fairness parity is restored.",
                    "In this final masterclass implementation, we construct the Enterprise Algorithmic Auditing & Fiduciary Fairness Cockpit in standard Python. We execute an end-to-end audit of a commercial lending engine, evaluate EEOC disparate impact ratios, test mathematical fairness trade-offs, compute game-theoretic Shapley attributions for denied applicants, generate actionable counterfactual recourse, and confer the CFAE credential."'''

# Apply replacements
for name, tgt, rep in [
    ("Part 2", part2_target, part2_replacement),
    ("Part 3", part3_target, part3_replacement),
    ("Part 4", part4_target, part4_replacement),
    ("Part 5", part5_target, part5_replacement)
]:
    if tgt in text:
        text = text.replace(tgt, rep)
        print(f"Applied expansion for {name}!")
    else:
        print(f"ERROR: Target not found for {name}!")

with open('scripts/day54_builder.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved updated day54_builder.py!")
