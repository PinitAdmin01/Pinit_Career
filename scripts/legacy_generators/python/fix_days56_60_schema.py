import json

with open("scripts/soft_skills_days56_60_generated.json", "r", encoding="utf-8") as f:
    days = json.load(f)

project_steps_data = {
    56: {
        "title": "Build the Deep Functional Observability & Alert Disambiguation Suite",
        "steps": [
            "Deploy ThreeMileIslandForensics to audit control room telemetry against commanded vs actual state divergence.",
            "Scan enterprise monitoring catalogs using AlertCatalogAuditor to eradicate false-positive command-echo indicators.",
            "Implement DeepHealthProbe with closed-loop synthetic write/read assertions, queue depth monitoring, and heap thresholds.",
            "Run ControlRoomIncidentSimulator to resolve conflicting telemetry alarms using orthogonal thermal verification sources.",
            "Execute Day 56 Capstone to officially certify competence as an accredited Observability Systems Specialist."
        ]
    },
    57: {
        "title": "Build the Cryptographic Fleet Deployment & Algorithmic Circuit Breaker Suite",
        "steps": [
            "Deploy KnightCapitalDeploymentForensics to reconstruct the 45-minute runaway order loop caused by manual deployment drift.",
            "Implement FinancialCircuitBreaker at the API gateway layer, enforcing real-time loss limits and order velocity ceilings.",
            "Deploy ClusterDeploymentVerifier to assert 100% cryptographic SHA-256 container digest homogeneity across all cluster nodes.",
            "Execute AlgorithmicCrisisSimulator to practice the First-180-Seconds Emergency Containment Doctrine and kill-switch activation.",
            "Execute Day 57 Capstone to officially certify competence in Atomic Fleet Deployment and Risk Governance."
        ]
    },
    58: {
        "title": "Build the Nominal Branded Type System & Interface Schema Linting Suite",
        "steps": [
            "Deploy MarsClimateOrbiterForensics to analyze the 4.45x thruster impulse calculation mismatch across interplanetary cruise.",
            "Construct the TypeScript BrandedTypeEngine to enforce compile-time dimensional analysis for NewtonSeconds and PoundForceSeconds.",
            "Execute InterfaceSchemaLinter to enforce explicit unit suffixes (timeoutMs, distanceKm) across enterprise OpenAPI specifications.",
            "Run OrbitalDescentTelemetryLab to intercept real-time trajectory decay anomalies and execute emergency correction burns.",
            "Execute Day 58 Capstone to officially certify competence as an accredited Dimensional Type Safety Architect."
        ]
    },
    59: {
        "title": "Author and Defend the $5,000,000 Principal Modernization RFC Suite",
        "steps": [
            "Deploy ConwaysLawTopologyAuditor to quantify communication fragmentation, deep-work deficits, and distributed monolith coupling.",
            "Model the $5M Modernization RFC financial return across 4 strategic pillars, projecting $14.7M in recurring annual returns.",
            "Construct CommunicationTelemetryEngine to track Maker's Schedule fragmentation, RFC cycle time, and PR review dynamics.",
            "Execute BoardroomDefenseSimulator to field adversarial challenges from the CFO and VP of Product using financial ROI and Conway's Law.",
            "Execute Day 59 Capstone to officially certify competence as an accredited Principal Systems Architect."
        ]
    },
    60: {
        "title": "Assemble and Defend the Sovereign ApexExecutiveComms Grand Capstone Portfolio",
        "steps": [
            "Synthesize the Unified Principal Communication Invariant, mathematically unifying Shannon, Minto, Conway, and Radical Candor.",
            "Assemble and audit the 4-part Master Executive Communications Portfolio Dossier to certify 100/100 publication readiness.",
            "Execute ApexVivaVoceSimulator CLI to undergo randomized evaluation across Whiteboard Defense, Negotiation, and Crisis Orchestration.",
            "Conquer the 45-Minute Grand Master Capstone Viva Voce Examination before the Senior Review Board with Summa Cum Laude honors.",
            "Issue the Full 60-Day Curriculum Graduation Certificate, conferring Certified ApexExecutiveComms Principal Technical Leader (L7-L9)."
        ]
    }
}

cleaned_days = []
for d in days:
    day_num = d["day"]
    cleaned_parts = []
    for p in d["parts"]:
        part_dict = {
            "title": p["title"],
            "say": p["say"],
            "example": p.get("example"),
            "code": p.get("code"),
            "output": p.get("output"),
            "codeNotes": p.get("notes"),
            "tryIt": p.get("tryIt"),
            "check": {
                "question": p["check"]["question"],
                "options": p["check"]["options"],
                "answer": p["check"]["answer"],
                "why": p["check"]["why"],
                "answerIndex": p["check"]["answer"],
                "explanation": p["check"]["why"]
            }
        }
        cleaned_parts.append(part_dict)

    cleaned_day = {
        "coursePrefix": "soft_skills",
        "day": day_num,
        "title": d["title"],
        "goal": d["goal"],
        "minutes": 45,
        "recap": d["recap"],
        "parts": cleaned_parts,
        "summary": d["summary"],
        "projectStep": project_steps_data[day_num]
    }
    cleaned_days.append(cleaned_day)

with open("scripts/soft_skills_days56_60_generated.json", "w", encoding="utf-8") as f:
    json.dump(cleaned_days, f, indent=2, ensure_ascii=False)

print("Cleaned and updated scripts/soft_skills_days56_60_generated.json conforming strictly to LongLesson interface!")
