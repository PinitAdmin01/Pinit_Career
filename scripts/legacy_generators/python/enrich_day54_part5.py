import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day54_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

part5_target = '"In this final masterclass implementation, we construct the complete Enterprise Algorithmic Fairness Cockpit in pure standard Python. We execute an end-to-end audit cycle, detect a disparate impact breach, generate CFPB adverse action disclosures, synthesize actionable counterfactual recourse, and confer the CEAIFO credential."'
part5_replacement = '''"Enterprise Algorithmic Auditing Architecture unifies these disparate analytical disciplines into a centralized fiduciary governance cockpit. In tier-one financial institutions, the Chief AI Ethics Officer and Chief Compliance Officer monitor live dashboards that integrate real-time disparate impact tracking, automated adverse action generation, counterfactual feasibility scores, and model drift telemetry. When regulatory examiners from the CFPB or European Data Protection Board conduct statutory audits, the system automatically exports cryptographically signed compliance ledgers proving that every automated corporate decision strictly complied with applicable legal and ethical mandates.",
                    "Continuous Model Validation & Automated Retraining Governance guarantees that post-deployment algorithmic updates do not reintroduce bias. When machine learning engineering teams propose retraining models on updated transaction datasets, the governance cockpit executes automated champion-challenger shadow audits. If a challenger model demonstrates superior predictive accuracy but degrades the Disparate Impact Ratio or increases the Equal Opportunity gap, automated fiduciary deployment gates block production release until fairness parity is restored.",
                    "In this final masterclass implementation, we construct the complete Enterprise Algorithmic Fairness Cockpit in pure standard Python. We execute an end-to-end audit cycle, detect a disparate impact breach, generate CFPB adverse action disclosures, synthesize actionable counterfactual recourse, and confer the CEAIFO credential."'''

if part5_target in text:
    text = text.replace(part5_target, part5_replacement)
    print("Applied expansion for Part 5!")
    with open('scripts/day54_builder.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Saved day54_builder.py successfully!")
else:
    print("ERROR: Target still not found!")
