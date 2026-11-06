# scripts/topup_cyber_day34_final.py

content = open("scripts/create_cyber_day34_data.py", "r", encoding="utf-8").read()

p4_more = """    "Seventh, Real-Time Domain Monitoring & Take-Down Workflows: Enterprise security operations centers deploy automated CT log listeners (such as Certstream). Every time a global CA issues a certificate matching company domains or brand keywords (e.g., typosquatting domains like `paypa1-security.com`), the SOC receives an alert in less than ten seconds. Security teams can immediately inspect the certificate, identify phishing infrastructure, and initiate automated registrar take-down requests before malicious campaigns reach end users.",
"""

p5_more = """    "Seventh, Continuous Root Store Auditing & Revocation Readiness: Production PKI architectures maintain real-time telemetry on trusted root certificates. Security auditing bots continuously inspect operating system trust stores, validating that untrusted or deprecated root certificates (such as older SHA-1 roots or state-compromised CAs) are removed from server trust stores. Furthermore, automated disaster recovery drills simulate the sudden revocation of an intermediate issuing CA, validating that automated ACME certificate rotation re-issues and deploys fresh certificates across global clusters in under fifteen minutes.",
"""

content = content.replace(
    '    "In the TypeScript snippet below, we implement the CertificateTransparencyAuditor',
    f'{p4_more}    "In the TypeScript snippet below, we implement the CertificateTransparencyAuditor'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionPkiChainValidator',
    f'{p5_more}    "In the TypeScript snippet below, we implement the ProductionPkiChainValidator'
)

open("scripts/create_cyber_day34_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day34_data.py with final top-ups.")
