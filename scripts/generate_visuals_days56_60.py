import json
import hashlib
import sys

with open("scripts/soft_skills_days56_60_generated.json", "r", encoding="utf-8") as f:
    days = json.load(f)

domain_stages = {
    56: [
        {"id": "s1", "name": "Telemetry Command Invariant", "subtext": "Command vs Actual Physical State", "tone": "warn"},
        {"id": "s2", "name": "Alert Catalog Disambiguation", "subtext": "Eliminating Echo Indicators", "tone": "data"},
        {"id": "s3", "name": "Deep Closed-Loop Synthetic Probing", "subtext": "Synthetic Write/Read Assertions", "tone": "data"},
        {"id": "s4", "name": "Control Room Orthogonal Triage", "subtext": "Physical Telemetry Corroboration", "tone": "ok"}
    ],
    57: [
        {"id": "s1", "name": "Deployment Drift Forensics", "subtext": "Knight Capital SMARS Root Cause", "tone": "warn"},
        {"id": "s2", "name": "Financial Gateway Circuit Breaker", "subtext": "Real-Time Loss & Velocity Sentinel", "tone": "data"},
        {"id": "s3", "name": "Cryptographic Fleet Verification", "subtext": "SHA-256 Digest Homogeneity Guard", "tone": "data"},
        {"id": "s4", "name": "First-180-Seconds Containment", "subtext": "Immediate Emergency Kill-Switch Protocol", "tone": "ok"}
    ],
    58: [
        {"id": "s1", "name": "Cross-Team Interface Forensics", "subtext": "Lockheed Imperial vs NASA Metric", "tone": "warn"},
        {"id": "s2", "name": "Nominal Branded Type System", "subtext": "Compile-Time Dimensional Analysis", "tone": "data"},
        {"id": "s3", "name": "API Schema Contract Linting", "subtext": "Mandatory Explicit Unit Suffixes", "tone": "data"},
        {"id": "s4", "name": "Runtime Anomaly Interception", "subtext": "Physical Plausibility Trajectory Guards", "tone": "ok"}
    ],
    59: [
        {"id": "s1", "name": "Conway's Law Topology Audit", "subtext": "Communication Silos & Monolith Coupling", "tone": "data"},
        {"id": "s2", "name": "$5M Modernization Financial ROI", "subtext": "194% Net ROI & 4.1-Month Capital Payback", "tone": "data"},
        {"id": "s3", "name": "Objective Communication Telemetry", "subtext": "Maker's Schedule & RFC Cycle Velocity", "tone": "warn"},
        {"id": "s4", "name": "Board of Directors Defense", "subtext": "Executive Composure & Business Stewardship", "tone": "ok"}
    ],
    60: [
        {"id": "s1", "name": "Theoretical Synthesis & Entropy", "subtext": "Shannon, Minto, Conway & Scott Unified", "tone": "data"},
        {"id": "s2", "name": "ApexExecutiveComms Master Dossier", "subtext": "Complete 4-Part Sovereign Portfolio", "tone": "data"},
        {"id": "s3", "name": "Live Viva Voce Simulation", "subtext": "Randomized 4-Stage High-Stakes Probes", "tone": "warn"},
        {"id": "s4", "name": "Senior Review Board Ratification", "subtext": "Summa Cum Laude Principal Certification", "tone": "ok"}
    ]
}

for d in days:
    day_num = d["day"]
    entries = []
    stages = domain_stages.get(day_num, [
        {"id": "s1", "name": "Analysis & Grounding", "subtext": "Initial Evaluation", "tone": "data"},
        {"id": "s2", "name": "Architecture & Strategy", "subtext": "Core Mechanics", "tone": "data"},
        {"id": "s3", "name": "Resilience & Hardening", "subtext": "Edge Case Handling", "tone": "warn"},
        {"id": "s4", "name": "Execution & Resolution", "subtext": "Final Verification", "tone": "ok"}
    ])
    
    for part in d["parts"]:
        part_title = part["title"]
        code = part["code"]
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        
        short_title = (part_title[:45] + "...") if len(part_title) > 45 else part_title
        
        entry = {
            "codeHash": code_hash,
            "title": f"Day {day_num}: {short_title}",
            "subtitle": f"Technical Communication & Strategic Mastery — {part_title}",
            "stages": stages
        }
        entries.append(entry)
        
    out_path = f"src/lib/data/lessonVisuals/soft-skills/day-{day_num}.json"
    with open(out_path, "w", encoding="utf-8") as f_out:
        json.dump(entries, f_out, indent=2)
    print(f"Generated {out_path} with {len(entries)} entries.")

print("All visuals generated successfully for Days 56-60!")
