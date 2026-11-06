# scripts/topup_cyber_day58.py

with open("scripts/create_cyber_day58_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Top up say_p2 (+60w)
p2_add = '''    "Additionally, red team operators leverage process hollowing and dynamic-link library (DLL) search-order hijacking to blend their malicious code into legitimate Windows processes (such as `svchost.exe` or `explorer.exe`). By manipulating process memory structures, operators evade detection by basic process listing tools, requiring defenders to employ kernel-level memory scanning and thread call-stack inspection to detect anomalous unbacked executable memory regions.",'''

# Top up say_p3 (+70w)
p3_add = '''    "Deception engineering also extends into synthetic active directories and mock enterprise identities. By seeding Active Directory with decoy administrative user accounts adorned with tempting privileges and storing their credentials in memory on selected endpoints, blue teams create instantaneous detection tripwires. The moment an automated credential dumping tool queries the decoy account or an attacker attempts to log in using the decoy credentials, the SOC immediately isolates the attacking machine.",'''

# Top up say_p4 (+70w)
p4_add = '''    "Purple teaming also establishes a shared language and mutual respect between offensive and defensive teams. Rather than viewing offensive findings as criticisms or failures, engineering organizations embrace them as valuable empirical data points that drive measurable improvements in enterprise resilience. This collaborative culture transforms security from a source of operational friction into an accelerator of engineering excellence.",'''

# Top up say_p5 (+160w)
p5_add = '''    "A comprehensive war gaming platform also incorporates automated adversary emulation tooling (such as Caldera, Atomic Red Team, or Scythe) into continuous integration and continuous deployment (CI/CD) pipelines. By automatically replaying prioritized adversary attack chains against newly deployed cloud infrastructure, organizations ensure that detection rules and automated containment playbooks never regress as infrastructure evolves.",
    "Ultimately, the production cyber war gaming platform bridges the gap between theoretical security architecture and live combat effectiveness. By transforming annual audit exercises into continuous, realistic adversary engagements, enterprise defense teams achieve the rapid reflexes, deep situational awareness, and unshakeable confidence required to dominate on modern digital battlefields.",'''

content = content.replace(
    '    "In the TypeScript snippet below, we implement the KerberoastingDetector class',
    p2_add + '\n    "In the TypeScript snippet below, we implement the KerberoastingDetector class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the DeceptionEngineeringMesh class',
    p3_add + '\n    "In the TypeScript snippet below, we implement the DeceptionEngineeringMesh class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the PurpleTeamCoverageMatrix class',
    p4_add + '\n    "In the TypeScript snippet below, we implement the PurpleTeamCoverageMatrix class'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionCyberWarGamingPlatform class',
    p5_add + '\n    "In the TypeScript snippet below, we implement the ProductionCyberWarGamingPlatform class'
)

with open("scripts/create_cyber_day58_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated create_cyber_day58_data.py with topup text!")
