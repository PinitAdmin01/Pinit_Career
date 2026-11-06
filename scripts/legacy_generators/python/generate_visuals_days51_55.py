import json
import hashlib
import sys

with open("scripts/soft_skills_days51_55_generated.json", "r", encoding="utf-8") as f:
    days = json.load(f)

domain_stages = {
    51: [
        {"id": "s1", "name": "CFP Architecture & Hook", "subtext": "Audience Value & Problem Framing", "tone": "data"},
        {"id": "s2", "name": "Outline & Technical Depth", "subtext": "4-Act Architecture & Code Walkthrough", "tone": "data"},
        {"id": "s3", "name": "Live Demo Hardening", "subtext": "Offline Docker & Network Resilience", "tone": "warn"},
        {"id": "s4", "name": "Keynote Delivery & Q&A Mastery", "subtext": "Disaster Recovery & Executive Poise", "tone": "ok"}
    ],
    52: [
        {"id": "s1", "name": "Story Pitch & Hook", "subtext": "Detective Mystery Framing", "tone": "data"},
        {"id": "s2", "name": "Deep Dive & Forensic Proof", "subtext": "Flame Graphs & Kernel Sysctl Diagnostics", "tone": "data"},
        {"id": "s3", "name": "Syndication & Canonical SEO", "subtext": "Substack/Medium Cross-Posting", "tone": "warn"},
        {"id": "s4", "name": "HN Community Defense", "subtext": "First 120-Min Rigorous De-escalation", "tone": "ok"}
    ],
    53: [
        {"id": "s1", "name": "Handbook-First SSOT", "subtext": "Documentation Over Slack Whisper", "tone": "data"},
        {"id": "s2", "name": "High-Bandwidth Async Video", "subtext": "120-Second Loom Walkthrough", "tone": "data"},
        {"id": "s3", "name": "Follow-the-Sun Relay", "subtext": "Tokyo-Berlin-SF Handover Protocol", "tone": "warn"},
        {"id": "s4", "name": "Zero-Overlap Crisis Patching", "subtext": "High-Context Execution Sovereignty", "tone": "ok"}
    ],
    54: [
        {"id": "s1", "name": "Gauntlet Modeling & Independence", "subtext": "Bayesian Scoring & Reset Protocol", "tone": "data"},
        {"id": "s2", "name": "14-Day Structured Schedule", "subtext": "Phased Milestones & Tapering", "tone": "data"},
        {"id": "s3", "name": "Loop Performance Telemetry", "subtext": "Automated Matrix & Dimension Scoring", "tone": "warn"},
        {"id": "s4", "name": "Staff+ Onsite Stamina", "subtext": "Continuous High-Energy Execution", "tone": "ok"}
    ],
    55: [
        {"id": "s1", "name": "Disaster Context & Teleconference", "subtext": "Challenger 1986 O-Ring Threat", "tone": "warn"},
        {"id": "s2", "name": "Chart Deconstruction & Anti-Patterns", "subtext": "Tufte Forensic Flaw Analysis", "tone": "warn"},
        {"id": "s3", "name": "Scatterplot Reconstruction", "subtext": "Complete Temperature vs Damage Evidence", "tone": "data"},
        {"id": "s4", "name": "Critical Threat Visualizer & Defense", "subtext": "Uncompromising Technical Advocacy", "tone": "ok"}
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

print("All visuals generated successfully!")
