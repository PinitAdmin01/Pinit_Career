import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day54_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add to Part 3
p3_target = '"In this third segment, we construct a Cooperative Game-Theoretic Shapley Attribution Engine in pure standard Python. We compute exact Shapley values across combinatorial feature coalitions, verify the Efficiency Property, rank negative contributors, and generate an official ECOA-compliant Adverse Action Notice."'
p3_rep = '''"Furthermore, KernelSHAP provides a model-agnostic formulation that frames Shapley estimation as a weighted linear regression problem. By solving for the optimal feature coefficients under a specialized Shapley kernel weight function, KernelSHAP computes unbiased approximations of complex non-linear models without requiring internal model architecture access or gradient computations. This enables third-party regulatory examiners to audit proprietary vendor models while protecting commercial intellectual property.",
                    "In this third segment, we construct a Cooperative Game-Theoretic Shapley Attribution Engine in pure standard Python. We compute exact Shapley values across combinatorial feature coalitions, verify the Efficiency Property, rank negative contributors, and generate an official ECOA-compliant Adverse Action Notice."'''

# Add to Part 5
p5_target = '"In this final masterclass implementation, we construct the complete Enterprise Algorithmic Fairness Cockpit in pure standard Python. We execute an end-to-end audit cycle, detect a disparate impact breach, generate CFPB adverse action disclosures, synthesize actionable counterfactual recourse, and confer the CEAIFO credential."'
p5_rep = '''"Finally, the Boardroom Fiduciary Attestation Ceremony establishes personal executive accountability for algorithmic integrity. Under the Sarbanes-Oxley Act (SOX) Section 302/404 framework extended to automated cognitive systems, the Chief Executive Officer and Chief Financial Officer must formally certify the adequacy of internal algorithmic fairness controls. By generating cryptographically timestamped audit artifacts that document mathematical parity, Shapley attribution fidelity, and counterfactual feasibility, the enterprise creates an irrefutable defense against regulatory scrutiny.",
                    "In this final masterclass implementation, we construct the complete Enterprise Algorithmic Fairness Cockpit in pure standard Python. We execute an end-to-end audit cycle, detect a disparate impact breach, generate CFPB adverse action disclosures, synthesize actionable counterfactual recourse, and confer the CEAIFO credential."'''

text = text.replace(p3_target, p3_rep)
text = text.replace(p5_target, p5_rep)

with open('scripts/day54_builder.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved enriched day54_builder.py!")
