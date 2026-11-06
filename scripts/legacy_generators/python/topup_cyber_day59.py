# scripts/topup_cyber_day59.py

with open("scripts/create_cyber_day59_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Top up say_p1 (+60w)
p1_add = '''    "Under modern cybersecurity jurisprudence, executive liability is no longer theoretical. Regulatory authorities actively investigate whether executive officers made misleading statements regarding incident impact or delayed public notifications to protect stock valuations. By implementing automated materiality assessment engines, organizations eliminate ambiguity and ensure timely, legally defensible disclosures.",'''

# Top up say_p2 (+120w)
p2_add = '''    "In addition to evaluating single loss events, the FAIR framework models multi-stage loss scenarios where an initial ransomware intrusion triggers cascading regulatory fines, customer churn, and long-term litigation. By applying calibrated probability distributions to secondary loss factors, risk analysts provide executive boards with comprehensive Value-at-Risk (VaR) metrics that reflect the full financial reality of catastrophic cyber incidents.",
    "Furthermore, quantitative risk modeling bridges the communication gap between technical security teams and corporate finance departments. When the CISO can demonstrate how specific architectural controls directly reduce the organization's Annualized Loss Expectancy, security budgeting transitions from an emotional debate into a rigorous, ROI-driven business investment.",'''

# Top up say_p3 (+140w)
p3_add = '''    "Beyond static SBOM analysis, modern Third-Party Risk Management incorporates Vulnerability Exploitability eXchange (VEX) statements. While an open-source library may contain a known CVE, the specific vulnerable code path may never be executed or exposed in the parent application. VEX machine-readable documents allow vendors and internal teams to cryptographically assert that a reported vulnerability is not exploitable in their specific deployment, eliminating wasted engineering cycles on benign warnings.",
    "Additionally, supply chain security requires rigorous continuous verification of developer identities and code commit signatures. By enforcing hardware security key signing for all Git commits and automating dependency pin verification in package managers, organizations ensure that malicious commits cannot be introduced through hijacked developer credentials.",'''

# Top up say_p4 (+120w)
p4_add = '''    "To maintain board engagement, successful CISOs structure their boardroom presentations around business impact, threat landscape evolution, and strategic initiatives. Rather than dwelling on technical vulnerabilities, the CISO presents clear trends in risk reduction, demonstrates compliance with emerging regulatory directives, and highlights how robust security architecture accelerates enterprise digital transformation.",
    "Moreover, board reporting must establish a clear escalation path for risk appetite exceptions. When business units request temporary waivers for legacy systems or third-party integrations that exceed established thresholds, the governance framework requires formal executive review, compensatory control implementation, and time-bound remediation plans approved by the audit committee.",'''

# Top up say_p5 (+160w)
p5_add = '''    "A mature cybersecurity governance platform also integrates continuous automated evidence collection across multi-cloud and on-premises environments. By continuously harvesting configuration states, identity audit trails, and encryption attestations, the platform eliminates the manual burden of periodic compliance audits, providing executive leadership and external regulators with real-time proof of continuous compliance.",
    "Ultimately, the production governance and risk architecture platform serves as the strategic steering wheel of enterprise cyber defense. By uniting regulatory compliance, quantitative financial modeling, supply chain integrity, and executive boardroom alignment into an automated engine, modern organizations achieve resilient, legally sound, and strategically fortified digital leadership.",'''

content = content.replace(
    '    "In the TypeScript snippet below, we implement the SecRegulatoryMaterialityAssessor class',
    p1_add + '\n    "In the TypeScript snippet below, we implement the SecRegulatoryMaterialityAssessor class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the FairRiskCalculator class',
    p2_add + '\n    "In the TypeScript snippet below, we implement the FairRiskCalculator class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the SupplyChainRiskValidator class',
    p3_add + '\n    "In the TypeScript snippet below, we implement the SupplyChainRiskValidator class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ExecutiveBoardRiskDashboard class',
    p4_add + '\n    "In the TypeScript snippet below, we implement the ExecutiveBoardRiskDashboard class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionCyberGovernancePlatform class',
    p5_add + '\n    "In the TypeScript snippet below, we implement the ProductionCyberGovernancePlatform class'
)

with open("scripts/create_cyber_day59_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated create_cyber_day59_data.py with topup text!")
