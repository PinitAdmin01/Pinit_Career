import os
import json
import hashlib
from visual_builder import generate_workflow_visual, make_sha256

from bcom_ops_day11_builder import get_day11_data
from bcom_ops_day12_builder import get_day12_data
from bcom_ops_day13_builder import get_day13_data
from bcom_ops_day14_builder import get_day14_data
from bcom_ops_day15_builder import get_day15_data

def format_ts_string(s: str) -> str:
    escaped = s.replace('\\', '\\\\').replace("'", "\\'")
    return f"'{escaped}'"

def adapt_day_data(d: dict) -> dict:
    # Ensure coursePrefix is set
    d['coursePrefix'] = d.get('coursePrefix', 'bcom_ops')
    
    # Adapt parts tryIt and check
    for p in d['parts']:
        if isinstance(p.get('tryIt'), dict):
            t_dict = p['tryIt']
            p['tryIt'] = t_dict['description']
            p['check'] = {
                'question': t_dict['question'],
                'options': t_dict['options'],
                'answer': t_dict['answer'],
                'why': t_dict['explanation'],
                'answerIndex': t_dict['answer'],
                'explanation': t_dict['explanation']
            }
            
    # Provide default summary and projectStep if missing
    day_num = d['day']
    if 'summary' not in d:
        if day_num == 11:
            d['summary'] = [
                "Distribution Center Topology: Partitioning facilities into receiving, cross-docking, reserve storage, forward picking, and pack-and-ship zones minimizes material handling travel distance, which comprises 50% to 65% of warehouse labor costs.",
                "Dynamic Slotting & COI Physics: Placing items with the lowest Cube-Per-Order Index (COI = Volume / Pick Frequency) in prime forward pick slots nearest dispatch depots dramatically minimizes picker travel.",
                "Golden Zone Ergonomics: Concentrating high-velocity pick faces between waist and chest height (0.8m to 1.4m) doubles pick speed while eliminating bending and overhead reaching fatigue.",
                "Pick Path Optimization Heuristics: S-Shape heuristics sweep entire aisles to maximize throughput in dense picking waves, while Return heuristics minimize deadhead travel in low-density single-pick corridors.",
                "Statistical Cycle Counting & IRA >= 99.5%: Perpetual ABC cycle counting audits stratified item subsets daily without halting operations, reconciling discrepancies to eliminate systemic root causes."
            ]
        elif day_num == 12:
            d['summary'] = [
                "Cold Chain Thermodynamics: Regulating temperature regimes across Ultra-Deep Freeze (-80°C to -60°C), Frozen (-20°C), Chilled (+2°C to +8°C), and Controlled Ambient (+15°C to +25°C) preserves biological and chemical efficacy.",
                "Mean Kinetic Temperature (MKT): Applying the Arrhenius equation (USP <1159>) exponentially weights elevated temperature excursions, evaluating true molecular degradation over misleading arithmetic averages.",
                "First-Expired, First-Out (FEFO) Allocation: Picking inventory strictly by expiration date rather than receipt date protects customer shelf-life contractual SLAs and prevents catastrophic inventory spoilage.",
                "HACCP In-Transit Governance: Continuous IoT sensor telemetry tracks Critical Control Point (CCP) limits, automatically triggering auxiliary compressors or emergency rerouting upon thermal excursions.",
                "Multi-Zone Refrigerated Fleet Routing: Partitioning reefer trailers into independent thermal compartments and modeling door-opening thermal shocks preserves cargo integrity across multi-stop urban delivery corridors."
            ]
        elif day_num == 13:
            d['summary'] = [
                "Reverse Supply Chain Economics: Managing entropy, high freight costs, and condition uncertainty through automated digital returns gatekeeping protects corporate operating margins.",
                "Return Fraud & Gatekeeping: Screening return requests with risk scoring and photo verification prevents wardrobing, issuing customer-keep refunds when return logistics costs exceed salvage value.",
                "Multi-Tier Disposition Tree: Rapid functional and cosmetic triage routes returned goods across Grade A restock, secondary open-box sales, factory refurbishment, parts harvesting, and certified recycling.",
                "Remanufacturing Operations & Cannibalization: Restoring worn cores to OEM performance consumes 85% less energy and yields higher gross margins (40%+) than new manufacturing, expanding addressable market share.",
                "Statutory EPR Compliance & Credit Trading: Fulfilling mandatory e-waste collection targets (70%) through in-house reverse logistics and certified PRO market credit trading avoids severe statutory penalties."
            ]
        elif day_num == 14:
            d['summary'] = [
                "Statutory Governance & Companies Act 2013: Sections 134(5)(e) and 143(3)(i) mandate adequate, operating Internal Financial Controls over Financial Reporting (ICoFR) across procurement and inventory cycles.",
                "Segregation of Duties & Three-Way Matching: Automated ERP control gates require independent users for requisition, PO approval, receiving, and invoice authorization, blocking payments on quantity or price variances.",
                "Related Party Transactions (Section 188): Supply chain contracts with related parties require prior Audit Committee pre-approval and proof of Ordinary Course of Business on an Arm's Length Basis via CUP benchmarking.",
                "CARO 2020 Clause 3(ii) Inventory Reporting: Discrepancies of 10% or more per inventory class must be publicly disclosed by auditors, and quarterly bank stock statements for > ₹5 Cr credit lines must reconcile with book ledgers.",
                "Supply Chain Due Diligence & Anti-Bribery: Enforcing Vendor Codes of Conduct (VCoC) and monitoring anti-corruption red flags under the FCPA/PCA prevents criminal corporate liability for third-party intermediary misconduct."
            ]
        elif day_num == 15:
            d['summary'] = [
                "Enterprise Operations Control Tower: Synthesizes multi-echelon WMS, in-transit IoT cold chain telematics, circular reverse logistics, and statutory fiduciary compliance into a unified operational nervous system.",
                "Multi-Echelon Omnichannel Sourcing: Mixed-integer allocation algorithms minimize landed fulfillment costs across regional DCs and urban dark stores, suppressing split-shipment penalties.",
                "Autonomous Cold Chain Triage: Real-time Arrhenius MKT processing detects critical in-transit thermal excursions, autonomously rerouting reefers to nearby certified cold docks for emergency cargo interception.",
                "Closed-Loop Circular Recovery: Tiered disposition routing captures high-margin remanufacturing and component harvesting value, achieving > 95% landfill diversion and 100% statutory EPR credit compliance.",
                "Master Governance Quality Gates: Automated validation across 5 Quality Gates (WMS IRA, Cold Chain MKT, Circular EPR, ICoFR RPT, and CARO 2020 ESG) earns an Unqualified Clean Statutory Audit Opinion."
            ]

    if 'projectStep' not in d:
        if day_num == 11:
            d['projectStep'] = {
                "title": "Module 3 Milestone Step 1: Design an Algorithmic Warehouse Slotting & Cycle Counting Engine",
                "steps": [
                    "Model warehouse floor topology and formulate directed putaway logic enforcing structural beam safety constraints.",
                    "Calculate Cube-Per-Order Index (COI) and ergonomic Golden Zone placement for an active SKU catalog.",
                    "Simulate comparative pick path travel distances contrasting pure S-Shape traversal against dynamic Return heuristics.",
                    "Execute an ABC stratified cycle counting audit protocol, computing Inventory Record Accuracy (IRA) and isolating root-cause discrepancies."
                ]
            }
        elif day_num == 12:
            d['projectStep'] = {
                "title": "Module 3 Milestone Step 2: Formulate Cold Chain Telematics & FEFO Perishable Allocation Engine",
                "steps": [
                    "Define thermal operational boundaries across biologics and vaccines, modeling packaging dampening coefficients under dock exposure.",
                    "Calculate Mean Kinetic Temperature (MKT) over continuous multi-day telemetry logs to evaluate regulatory release compliance.",
                    "Implement a customer SLA-aware First-Expired, First-Out (FEFO) allocation algorithm matching lot shelf life to customer contracts.",
                    "Simulate in-transit HACCP CCP monitoring and multi-stop urban delivery door-opening thermal decay."
                ]
            }
        elif day_num == 13:
            d['projectStep'] = {
                "title": "Module 3 Milestone Step 3: Architect Closed-Loop Reverse Logistics & EPR Credit Ledger",
                "steps": [
                    "Formulate an algorithmic returns gatekeeping engine evaluating net economic recovery and customer fraud risk.",
                    "Construct a 5-tier product disposition tree optimizing secondary market recovery and component harvesting yield.",
                    "Model remanufacturing batch economics, core buyback deposits, and disassembly qualification yield rates.",
                    "Reconcile statutory Extended Producer Responsibility (EPR) e-waste obligations against certified market recycling credit exchanges."
                ]
            }
        elif day_num == 14:
            d['projectStep'] = {
                "title": "Module 3 Milestone Step 4: Implement Statutory Corporate Governance & Due Diligence Auditing",
                "steps": [
                    "Construct an ICoFR compliance verification engine auditing Segregation of Duties (SoD) and Three-Way Matching invariants.",
                    "Implement a Section 188 Related Party Transaction evaluator applying Comparable Uncontrolled Price (CUP) arm's length benchmarking.",
                    "Audit physical inventory variances against the CARO 2020 10% materiality threshold and reconcile bank stock statements.",
                    "Deploy an ESG supplier due diligence audit scorer and automated FCPA anti-bribery red-flag monitoring engine."
                ]
            }
        elif day_num == 15:
            d['projectStep'] = {
                "title": "Milestone 3 Grand Capstone: Build and Verify the Master Operations & Compliance Control Tower",
                "steps": [
                    "Register a multi-echelon distribution network topology and audit baseline inventory valuation across regional and urban nodes.",
                    "Optimize multi-item omnichannel order sourcing across candidate facilities, minimizing freight, labor, and split-shipment penalties.",
                    "Execute real-time in-transit cold chain telemetry triage, computing MKT and dynamically routing emergency hub interceptions.",
                    "Reconcile closed-loop reverse returns, remanufacturing yield, and statutory EPR recycling credit balances.",
                    "Run the Master 5-Gate Governance Verification Engine to audit inventory accuracy, ICoFR controls, and CARO 2020 statutory compliance."
                ]
            }

    return d

def day_to_ts(d: dict) -> str:
    lines = []
    lines.append("  {")
    lines.append(f"    coursePrefix: {format_ts_string(d['coursePrefix'])},")
    lines.append(f"    day: {d['day']},")
    lines.append(f"    title: {format_ts_string(d['title'])},")
    lines.append(f"    goal: {format_ts_string(d['goal'])},")
    lines.append(f"    minutes: {d['minutes']},")
    lines.append(f"    recap: {format_ts_string(d['recap'])},")
    lines.append("    parts: [")
    
    for p in d['parts']:
        lines.append("      {")
        lines.append(f"        title: {format_ts_string(p['title'])},")
        lines.append("        say: [")
        for para in p['say']:
            lines.append(f"          {format_ts_string(para)},")
        lines.append("        ],")
        lines.append(f"        example: {format_ts_string(p['example'])},")
        
        # Code: multiline template string
        escaped_code = p['code'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"        code: `{escaped_code}`,")
        
        # Output: multiline template string
        escaped_out = p['output'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"        output: `{escaped_out}`,")
        
        # codeNotes
        lines.append("        codeNotes: [")
        for cn in p['codeNotes']:
            lines.append(f"          {{ line: {cn['line']}, note: {format_ts_string(cn['note'])} }},")
        lines.append("        ],")
        
        # tryIt
        lines.append(f"        tryIt: {format_ts_string(p['tryIt'])},")
        
        # check
        chk = p['check']
        lines.append("        check: {")
        lines.append(f"          question: {format_ts_string(chk['question'])},")
        lines.append("          options: [")
        for opt in chk['options']:
            lines.append(f"            {format_ts_string(opt)},")
        lines.append("          ],")
        lines.append(f"          answer: {chk['answer']},")
        lines.append(f"          why: {format_ts_string(chk['why'])},")
        lines.append(f"          answerIndex: {chk['answerIndex']},")
        lines.append(f"          explanation: {format_ts_string(chk['explanation'])}")
        lines.append("        }")
        lines.append("      },")
        
    lines.append("    ],")
    
    # summary
    lines.append("    summary: [")
    for s in d['summary']:
        lines.append(f"      {format_ts_string(s)},")
    lines.append("    ],")
    
    # projectStep
    pstep = d['projectStep']
    lines.append("    projectStep: {")
    lines.append(f"      title: {format_ts_string(pstep['title'])},")
    lines.append("      steps: [")
    for st in pstep['steps']:
        lines.append(f"        {format_ts_string(st)},")
    lines.append("      ]")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

def run_block218_assembly():
    raw_days = [
        get_day11_data(),
        get_day12_data(),
        get_day13_data(),
        get_day14_data(),
        get_day15_data()
    ]
    
    days_data = [adapt_day_data(d) for d in raw_days]
    
    visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_ops")
    os.makedirs(visuals_dir, exist_ok=True)
    
    # 1. Generate and save Visual JSON files with SHA-256 bindings
    for d in days_data:
        day_num = d['day']
        entries = []
        for p in d['parts']:
            entries.append({
                "title": p['title'],
                "code": p['code']
            })
        visual_doc = generate_workflow_visual("bcom_ops", day_num, entries)
        visual_path = os.path.join(visuals_dir, f"day-{day_num:02d}.json")
        with open(visual_path, "w", encoding="utf-8") as f:
            json.dump(visual_doc, f, indent=2, ensure_ascii=False)
        print(f"Generated Visual JSON: {visual_path} (entries={len(visual_doc['entries'])})")
        
    # 2. Append to src/lib/data/bcomOpsLongLessons.ts
    target_ts = os.path.join("src", "lib", "data", "bcomOpsLongLessons.ts")
    with open(target_ts, "r", encoding="utf-8") as f:
        existing_code = f.read()
        
    # Ensure Days 11-15 are not already present
    if "day: 11," in existing_code:
        print("WARNING: Day 11 is already present in bcomOpsLongLessons.ts! Skipping append.")
        return
        
    # Find last occurrence of "];"
    last_bracket_idx = existing_code.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in bcomOpsLongLessons.ts")
        
    ts_blocks = []
    for d in days_data:
        ts_blocks.append(day_to_ts(d))
        
    insertion = ",\n" + ",\n".join(ts_blocks) + "\n"
    new_code = existing_code[:last_bracket_idx] + insertion + existing_code[last_bracket_idx:]
    
    with open(target_ts, "w", encoding="utf-8") as f:
        f.write(new_code)
        
    print(f"Successfully assembled Days 11-15 (Block 218) into {target_ts}!")

if __name__ == "__main__":
    run_block218_assembly()
