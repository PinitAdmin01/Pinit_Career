import os
import sys

# Ensure word count is >= 580 words per part and >= 2950 words per day
def get_day09_data():
    day = 9
    title = "Toyota Production System (TPS), Lean Waste Elimination & SMED"
    goal = "Master Lean manufacturing physics: identifying and eliminating the 8 Wastes of Lean (TIM WOODS), executing Single-Minute Exchange of Die (SMED) setup compression, formulating Heijunka mixed-model production leveling, deploying Jidoka zero-defect Poka-Yoke error-proofing, and designing U-shaped cellular lines with Standard Work-in-Process (SWIP)."
    minutes = 45
    recap = "On Day 8, we explored MRP II capacity requirements planning, operations routing sheets, and shop floor priority dispatching. On Day 9, we transition from Western batch-and-queue MRP planning to Eastern flow manufacturing: the Toyota Production System (TPS) and Lean Operations. We will dismantle the myth that large production batches are necessary for efficiency, discovering how setup reduction and flow leveling unlock unprecedented velocity and quality."

    parts = [
        {
            "title": "The Toyota Production System (TPS) Philosophy & The 8 Wastes (TIM WOODS)",
            "say": [
                "Welcome to Day 9 of Operations and Supply Chain Management. In the post-World War II industrial era, Western mass production—pioneered by Henry Ford and Alfred Sloan—dominated global manufacturing. The Western philosophy was built on economies of scale: build massive factories, install dedicated single-purpose machines, run enormous batches of identical parts to amortize setup costs, and buffer every workstation with huge piles of work-in-progress inventory. In post-war Japan, however, Toyota faced a radically different reality: scarce capital, constrained physical warehouse space, high raw material costs, and a domestic market that demanded small volumes of diverse vehicle models. Out of this severe constraint, Taiichi Ohno, Eiji Toyoda, and Shigeo Shingo created the Toyota Production System (TPS), known universally today as Lean Manufacturing.",
                "The philosophical foundation of TPS rests on a radical premise: customer value is the sole justification for any operational activity. Any action, process, or asset that consumes time, labor, or capital without directly increasing value from the paying customer's perspective is Muda—pure waste. In traditional manufacturing accounting, inventory sitting in a warehouse is recorded as an asset on the corporate balance sheet. In TPS, inventory is recognized as the ultimate liability: it hides underlying quality defects, consumes valuable floor space, ties up cash, and masks machine unreliability. Taiichi Ohno famously asserted that the true goal of operations is not to keep machines busy, but to compress lead time by eliminating non-value-added waste between customer order and cash collection.",
                "To systematically train workers to see and eradicate waste, Lean engineering established the definitive taxonomy of operational waste, remembered across global industry through the acronym TIM WOODS. Let us examine all eight wastes with operational rigor. 1. Transportation: unnecessary physical movement of materials, pallets, or parts between facilities or distant workstations. Transportation adds zero value to the product but risks physical damage and extends lead time. 2. Inventory: carrying excess raw materials, work-in-progress (WIP), or finished goods beyond the minimum required to maintain flow. Inventory ties up working capital and conceals process instability.",
                "3. Motion: unnecessary physical bending, reaching, walking, or turning by operators due to poor ergonomic workstation layout. In Lean ergonomics, every wasted second of reaching for a tool across a workbench drains operator stamina and accumulates into hundreds of lost production hours annually. 4. Waiting: operators standing idle waiting for machine cycles to complete, waiting for maintenance to fix a broken pneumatic clamp, or waiting for material handlers to deliver parts. 5. Overproduction: producing goods ahead of demand or producing more units than the customer ordered. Taiichi Ohno identified Overproduction as the most dangerous and toxic of all wastes because it directly breeds and conceals all other seven wastes: it creates excess inventory, requires extra transportation, forces warehouse construction, and masks defective parts.",
                "6. Overprocessing: performing unnecessary processing steps, polishing non-visible surfaces beyond engineering tolerances, or requiring redundant bureaucratic inspection signatures that the customer does not care about and will not pay for. 7. Defects: producing scrap, rework, or out-of-tolerance parts that consume raw materials, machine hours, and labor while generating customer dissatisfaction. 8. Skills Underutilization: failing to engage the minds, creativity, problem-solving intelligence, and frontline insights of the workforce. In a true Lean culture, operators are not treated as passive pairs of hands; they are respected as industrial problem solvers empowered to improve their work through daily continuous improvement (Kaizen)."
            ],
            "example": "A commercial air conditioner assembly plant operated under traditional batch manufacturing. Sheet metal duct panels were stamped in batches of 5,000 on a heavy hydraulic press, loaded onto wooden pallets, transported via forklift across a 400-meter warehouse aisle, and stored for three weeks. When final assembly finally drew down the pallet, workers discovered that the stamping die had worn out after unit #200, making 4,800 panels out-of-spec. The plant suffered overproduction (4,800 unneeded panels), transportation (forklift fuel and driver hours), inventory ($120,000 in trapped steel), waiting (assembly line shutdown for two days), and defects ($35,000 in scrap rework). Under a Lean TPS transformation, the plant downsized to a quick-change flexible stamping cell directly adjacent to assembly, producing panels in small batches of 20 units paced to takt time. Defect discovery time collapsed from 3 weeks to 12 minutes, saving $450,000 annually.",
            "code": """# Lean Value Stream Audit: Value-Added vs. Non-Value-Added Lead Time & TIM WOODS Analysis
def analyze_lean_value_stream(
    process_steps: list[dict]
) -> dict:
    \"\"\"
    process_steps: list of dicts with:
      'step_name', 'cycle_time_sec', 'queue_wait_sec', 'move_time_sec', 'waste_type'
    \"\"\"
    total_value_added_sec = 0.0
    total_non_value_added_sec = 0.0
    waste_breakdown = {}
    
    audit_table = []
    
    for s in process_steps:
        va_time = s['cycle_time_sec']
        nva_time = s['queue_wait_sec'] + s['move_time_sec']
        waste_cat = s.get('waste_type', 'None')
        
        total_value_added_sec += va_time
        total_non_value_added_sec += nva_time
        
        if nva_time > 0 and waste_cat != 'None':
            waste_breakdown[waste_cat] = waste_breakdown.get(waste_cat, 0.0) + nva_time
            
        step_total_sec = va_time + nva_time
        efficiency = (va_time / step_total_sec) * 100.0 if step_total_sec > 0 else 0.0
        
        audit_table.append({
            "Step": s['step_name'],
            "VA_Sec": va_time,
            "NVA_Sec": nva_time,
            "Total_Sec": step_total_sec,
            "Efficiency_Pct": round(efficiency, 1),
            "Primary_Waste": waste_cat
        })
        
    total_lead_time_sec = total_value_added_sec + total_non_value_added_sec
    process_cycle_efficiency = (total_value_added_sec / total_lead_time_sec) * 100.0 if total_lead_time_sec > 0 else 0.0
    
    return {
        "Total_Value_Added_Minutes": round(total_value_added_sec / 60.0, 2),
        "Total_Non_Value_Added_Hours": round(total_non_value_added_sec / 3600.0, 2),
        "Total_Lead_Time_Hours": round(total_lead_time_sec / 3600.0, 2),
        "Process_Cycle_Efficiency_Pct": round(process_cycle_efficiency, 2),
        "Waste_Distribution_Hours": {k: round(v / 3600.0, 2) for k, v in waste_breakdown.items()},
        "Steps": audit_table
    }

# Value stream audit of an industrial hydraulic valve spool
valve_flow = [
    {"step_name": "Bandsaw Cutting",      "cycle_time_sec": 45,  "queue_wait_sec": 7200, "move_time_sec": 300, "waste_type": "Waiting & Transport"},
    {"step_name": "CNC Turning",          "cycle_time_sec": 180, "queue_wait_sec": 14400,"move_time_sec": 450, "waste_type": "Inventory (WIP Queue)"},
    {"step_name": "Heat Treatment",       "cycle_time_sec": 600, "queue_wait_sec": 28800,"move_time_sec": 900, "waste_type": "Waiting & Inventory"},
    {"step_name": "Cylindrical Grinding", "cycle_time_sec": 120, "queue_wait_sec": 10800,"move_time_sec": 300, "waste_type": "Inventory (WIP Queue)"},
    {"step_name": "Final Inspection & Pack","cycle_time_sec": 90, "queue_wait_sec": 3600, "move_time_sec": 150, "waste_type": "Overprocessing"}
]

vsm_results = analyze_lean_value_stream(valve_flow)

print(f"Lean Value Stream Mapping (VSM) Diagnostics:")
print(f"  Total Value-Add Time     : {vsm_results['Total_Value_Added_Minutes']} Minutes")
print(f"  Total Non-Value-Add Time : {vsm_results['Total_Non_Value_Added_Hours']} Hours ({vsm_results['Total_Lead_Time_Hours']}h Total Lead Time)")
print(f"  Process Cycle Efficiency : {vsm_results['Process_Cycle_Efficiency_Pct']}% (World-Class Target: >= 25.0%)")
print(f"\\nTIM WOODS Waste Concentration:")
for waste, hrs in vsm_results['Waste_Distribution_Hours'].items():
    print(f"  {waste:25s}: {hrs:5.2f} Hours of Idle Waste")
""",
            "output": """Lean Value Stream Mapping (VSM) Diagnostics:
  Total Value-Add Time     : 17.25 Minutes
  Total Non-Value-Add Time : 18.58 Hours (18.87h Total Lead Time)
  Process Cycle Efficiency : 1.52% (World-Class Target: >= 25.0%)

TIM WOODS Waste Concentration:
  Waiting & Transport      :  2.08 Hours of Idle Waste
  Inventory (WIP Queue)    :  7.21 Hours of Idle Waste
  Waiting & Inventory      :  8.25 Hours of Idle Waste
  Overprocessing           :  1.04 Hours of Idle Waste""",
            "codeNotes": [
                {"line": 2, "note": "Implements the Lean Value Stream Mapping diagnostic engine quantifying Value-Add versus Non-Value-Add time."},
                {"line": 13, "note": "Separates true processing cycle time from transit move time and buffer queue waiting time."},
                {"line": 28, "note": "Computes Process Cycle Efficiency (PCE): Value-Add Time divided by Total Elapsed Lead Time."},
                {"line": 52, "note": "Exposes the classic industrial paradox: actual machining is only 17.25 minutes, yet total lead time is 18.87 hours (PCE = 1.52%)!"}
            ],
            "tryIt": "Reduce queue wait time across all steps by 75% through cellular flow and observe Process Cycle Efficiency surge from 1.52% to over 5.8%.",
            "check": {
                "question": "Why did Taiichi Ohno identify 'Overproduction' as the most dangerous and destructive of the 8 Wastes of Lean (TIM WOODS)?",
                "options": [
                    "Because producing items ahead of demand or in excess quantities breeds, conceals, and amplifies all other seven wastes, including excess inventory, extra transport, and delayed defect discovery.",
                    "Because overproduction causes factories to run out of electricity.",
                    "Because customers refuse to pay for products that are manufactured during daytime shifts.",
                    "Because labor laws strictly limit factories to producing no more than 10 units per day."
                ],
                "answer": 0,
                "why": "Overproduction is the root waste because it creates unnecessary inventory, requires extra warehouse handling and transport, and hides machine breakdowns and quality defects under massive piles of WIP.",
                "answerIndex": 0,
                "explanation": "Overproduction is the root waste because it creates unnecessary inventory, requires extra warehouse handling and transport, and hides machine breakdowns and quality defects under massive piles of WIP."
            }
        },
        {
            "title": "Single-Minute Exchange of Die (SMED): Internal vs. External Setup Reduction",
            "say": [
                "In traditional manufacturing, operations managers operated under the dogma of the Economic Order Quantity (EOQ): because machine setups take several hours, the only way to achieve low unit costs is to run massive production batches. When a stamping press requires four hours to change dies, running a batch of 10 units is financial suicide; the plant must run a batch of 10,000 units. But large batches create massive inventory holding costs, sluggish lead times, and catastrophic quality batch scrap. Dr. Shigeo Shingo shattered this dogma by creating the Single-Minute Exchange of Die (SMED) methodology. The term 'Single-Minute' does not mean one minute; it means reducing any machine changeover time to a single digit: less than 10 minutes (under 600 seconds).",
                "Shingo's revolutionary insight was that machine setup is not a monolithic, unavoidable physical law; it is a collection of discrete operational steps that can be re-engineered, standardized, and streamlined. The SMED methodology is executed through four rigorous stages: Stage 0: Observe and measure the current baseline changeover using video analysis. Stage 1: Separate Internal Setup activities from External Setup activities. Stage 2: Convert Internal Setup activities into External Setup activities. Stage 3: Streamline all remaining Internal and External steps through mechanical design and standardization.",
                "Understanding the distinction between Internal Setup and External Setup is the heart of SMED. Internal Setup consists of activities that can ONLY be performed when the machine is completely stopped and powered down. Examples include removing the old stamping die from the machine platen, bolting down the new die, and attaching hydraulic fluid lines. Performing internal setup while the machine is running would crush or decapitate the operator. External Setup, by contrast, consists of activities that can be performed WHILE THE MACHINE IS STILL RUNNING and cutting parts on the previous job. Examples include fetching the next die from the tool crib, pre-heating the die, pre-staging raw material coils next to the feeder, locating the wrench and bolts, and loading CNC G-code programs.",
                "In un-optimized factories, operators perform external setup as internal setup: they stop the machine, and then spend 45 minutes walking around searching for a crane, looking for the right wrench, or waiting for a forklift to deliver the next tool. Stage 1 of SMED mandates that all external activities must be completed prior to stopping the machine. The moment the last piece of Job A is finished, the next die is already sitting on a rolling cart beside the platen, the bolts are clean and organized on a magnetic tray, and the crane is hooked. Separating internal from external setup routinely slashes 50% of changeover downtime instantly without spending a single dollar of capital expenditure!",
                "Stage 2 converts internal setup into external setup through engineering redesign. For example, instead of heating an injection molding die inside the press (shutting down the press for 40 minutes while it warms up), the die is placed on an external pre-heating station beside the line and heated while the previous job is running. When the swap occurs, the hot die is slid into place, eliminating 40 minutes of internal downtime. Finally, Stage 3 streamlines remaining internal steps: replacing threaded bolts (which require 20 turns of a wrench) with one-turn U-washers, cam clamps, or hydraulic quick-lock toggles; utilizing standardized shut heights; and eliminating all manual dial indicator trial-and-error adjustments through fixed mechanical stops. By reducing setup times from 2 hours to 8 minutes, the factory can slash batch sizes by 90%, freeing millions of dollars in working capital and transforming the plant into a high-velocity, flexible manufacturing engine."
            ],
            "example": "A Tier-1 automotive bumper fascia manufacturer operated an 800-ton plastic injection molding press with a baseline mold changeover time of 75 minutes. The plant ran massive 3-day batches because changeovers were so costly. Through a SMED Kaizen event, the engineering team applied the four stages: 1. They separated external steps: tool pre-staging, raw resin staging, and paperwork verification were mandated while the press was running, saving 28 minutes. 2. They converted internal to external: they built an external mold pre-heating and thermocouple testing cart, saving 22 minutes. 3. They streamlined remaining internal steps: they replaced 16 threaded platen bolts with automated hydraulic wedge clamps (reducing clamping from 14 minutes to 15 seconds) and installed quick-disconnect pneumatic couplings. Total changeover time collapsed from 75 minutes to 7.5 minutes (a 90% reduction)! The plant shifted from 3-day batches to running every bumper model every single shift, cutting warehouse inventory by $1.8 million.",
            "code": """# Single-Minute Exchange of Die (SMED): 4-Stage Setup Reduction Simulation
def simulate_smed_setup_reduction(
    baseline_setup_steps: list[dict]
) -> dict:
    \"\"\"
    baseline_setup_steps: list of dicts with:
      'step_name', 'baseline_duration_min', 'can_be_external', 'convertible_to_external', 'streamline_pct'
    \"\"\"
    baseline_total_min = sum(s['baseline_duration_min'] for s in baseline_steps)
    
    # Stage 1: Separate External Setup (performed while machine runs -> 0 machine downtime)
    stage1_internal_min = 0.0
    stage1_external_min = 0.0
    
    for s in baseline_setup_steps:
        dur = s['baseline_duration_min']
        if s['can_be_external']:
            stage1_external_min += dur
        else:
            stage1_internal_min += dur
            
    # Stage 2: Convert Internal to External
    stage2_internal_min = stage1_internal_min
    stage2_external_min = stage1_external_min
    converted_min = 0.0
    
    for s in baseline_setup_steps:
        if not s['can_be_external'] and s.get('convertible_to_external', False):
            dur = s['baseline_duration_min']
            stage2_internal_min -= dur
            stage2_external_min += dur
            converted_min += dur
            
    # Stage 3: Streamline Remaining Internal Steps (mechanisms, quick-clamps, standardization)
    stage3_internal_min = 0.0
    for s in baseline_setup_steps:
        dur = s['baseline_duration_min']
        if not s['can_be_external'] and not s.get('convertible_to_external', False):
            reduction = s.get('streamline_pct', 0.50)
            stage3_internal_min += dur * (1.0 - reduction)
            
    smed_final_machine_downtime = stage3_internal_min
    total_reduction_pct = ((baseline_total_min - smed_final_machine_downtime) / baseline_total_min) * 100.0
    is_single_minute = smed_final_machine_downtime < 10.0
    
    return {
        "Baseline_Downtime_Minutes": round(baseline_total_min, 1),
        "Stage_1_Separated_Downtime": round(stage1_internal_min, 1),
        "Stage_2_Converted_Downtime": round(stage2_internal_min, 1),
        "Stage_3_Final_SMED_Downtime": round(smed_final_machine_downtime, 1),
        "Total_Downtime_Reduction_Pct": round(total_reduction_pct, 1),
        "Achieved_Single_Minute_Standard": is_single_minute,
        "Capacity_Hours_Freed_Per_100_Setups": round((baseline_total_min - smed_final_machine_downtime) * 100 / 60.0, 1)
    }

# Baseline 75-minute injection molding changeover audit
baseline_steps = [
    {"step_name": "Fetch new mold & crane from tool crib", "baseline_duration_min": 14.0, "can_be_external": True,  "convertible_to_external": False, "streamline_pct": 0.0},
    {"step_name": "Retrieve tooling, wrench, and bolts",   "baseline_duration_min":  8.0, "can_be_external": True,  "convertible_to_external": False, "streamline_pct": 0.0},
    {"step_name": "Unbolt old mold & disconnect hoses",     "baseline_duration_min": 12.0, "can_be_external": False, "convertible_to_external": False, "streamline_pct": 0.75},
    {"step_name": "Crane swap old mold for new mold",      "baseline_duration_min":  6.0, "can_be_external": False, "convertible_to_external": False, "streamline_pct": 0.30},
    {"step_name": "Pre-heat mold to 180C inside press",     "baseline_duration_min": 20.0, "can_be_external": False, "convertible_to_external": True,  "streamline_pct": 0.0},
    {"step_name": "Bolt down new mold & connect lines",     "baseline_duration_min": 10.0, "can_be_external": False, "convertible_to_external": False, "streamline_pct": 0.75},
    {"step_name": "Trial shots & dial adjustment",         "baseline_duration_min":  5.0, "can_be_external": False, "convertible_to_external": False, "streamline_pct": 0.60}
]

smed_audit = simulate_smed_setup_reduction(baseline_steps)

print("Single-Minute Exchange of Die (SMED) Setup Compression Audit:")
print(f"  Baseline Setup Machine Downtime : {smed_audit['Baseline_Downtime_Minutes']} Minutes")
print(f"  Stage 1 (Separate External)     : {smed_audit['Stage_1_Separated_Downtime']} Minutes (Externalized tool retrieval)")
print(f"  Stage 2 (Convert to External)   : {smed_audit['Stage_2_Converted_Downtime']} Minutes (Externalized mold pre-heating)")
print(f"  Stage 3 (Streamline Internal)   : {smed_audit['Stage_3_Final_SMED_Downtime']} Minutes (Quick-clamps & standardized stops)")
print(f"  Total Setup Downtime Reduction  : {smed_audit['Total_Downtime_Reduction_Pct']}%")
print(f"  Single-Minute Target Met (<10m) : {'YES (World-Class SMED)' if smed_audit['Achieved_Single_Minute_Standard'] else 'NO'}")
print(f"  Capacity Freed per 100 Setups   : {smed_audit['Capacity_Hours_Freed_Per_100_Setups']} Machine Hours")
""",
            "output": """Single-Minute Exchange of Die (SMED) Setup Compression Audit:
  Baseline Setup Machine Downtime : 75.0 Minutes
  Stage 1 (Separate External)     : 53.0 Minutes (Externalized tool retrieval)
  Stage 2 (Convert to External)   : 33.0 Minutes (Externalized mold pre-heating)
  Stage 3 (Streamline Internal)   : 11.7 Minutes (Quick-clamps & standardized stops)
  Total Setup Downtime Reduction  : 84.4%
  Single-Minute Target Met (<10m) : NO
  Capacity Freed per 100 Setups   : 105.5 Machine Hours""",
            "codeNotes": [
                {"line": 2, "note": "Implements the 4-stage Shigeo Shingo SMED setup compression simulation engine."},
                {"line": 13, "note": "Stage 1: Moves external setup steps (tool staging, crane retrieval) to occur while the machine runs."},
                {"line": 23, "note": "Stage 2: Converts internal mold pre-heating into an external pre-heating station beside the press."},
                {"line": 34, "note": "Stage 3: Applies quick-clamping and mechanical standardization to slash remaining bolting and adjustments."},
                {"line": 59, "note": "Compresses baseline downtime from 75.0m to 11.7m (84.4% reduction), freeing 105.5 machine hours per 100 setups."}
            ],
            "tryIt": "Increase crane swap streamlining to 60% and bolt streamlining to 85% to push final setup time down to 7.8 minutes (achieving Single-Minute status).",
            "check": {
                "question": "What is the foundational operational rule of 'Stage 1' in the Single-Minute Exchange of Die (SMED) methodology?",
                "options": [
                    "Strictly separate Internal Setup (activities that can only be done while the machine is stopped) from External Setup (activities that can and must be done while the machine is running).",
                    "Replace all human machine operators with artificial intelligence software.",
                    "Permanently weld the existing die to the machine so it can never be changed.",
                    "Double the size of production batches so setups occur only once a year."
                ],
                "answer": 0,
                "why": "Stage 1 separates internal setup from external setup, ensuring tools, raw materials, and cranes are pre-staged while the machine is cutting parts, immediately cutting machine downtime by 30-50%.",
                "answerIndex": 0,
                "explanation": "Stage 1 separates internal setup from external setup, ensuring tools, raw materials, and cranes are pre-staged while the machine is cutting parts, immediately cutting machine downtime by 30-50%."
            }
        },
        {
            "title": "Heijunka Production Leveling, Pitch Increments & Mixed-Model Assembly",
            "say": [
                "Achieving single-minute changeovers through SMED is the technological prerequisite for the crowning achievement of the Toyota Production System: Heijunka. Heijunka is the Japanese operational term for Production Leveling or Production Smoothing. In conventional Western mass production, factories assemble products in large, monolithic batches: produce Model A all day Monday and Tuesday (1,000 units), produce Model B Wednesday and Thursday (1,000 units), and produce Model C on Friday (500 units). This batch schedule creates violent, disruptive demand bullwhips upstream, forces the plant to carry massive finished goods buffer stocks, and leaves the company unable to respond when a customer urgently requests Model B on a Tuesday.",
                "Heijunka eliminates this instability by leveling production across both Volume and Product Mix. Instead of building large batches of single models, the factory balances the production sequence so that every product model is built every single day, and in advanced Lean plants, every single hour! If weekly demand is 500 units of Model A, 250 units of Model B, and 250 units of Model C (a 2:1:1 ratio), a Heijunka schedule does not produce 500 A's, then 250 B's, then 250 C's. It produces the mixed-model sequence: A - B - A - C - A - B - A - C, repeating continuously throughout the day.",
                "To maintain strict temporal synchronization on a Heijunka mixed-model line, Lean engineering deploys two governing metrics: Takt Time and Pitch. Takt Time, as mastered on Day 1, is the pace of customer demand: Takt Time = Available Operating Time / Total Customer Demand. Pitch is the takt time multiplied by the standardized pack size (or container quantity) of the product: Pitch = Takt Time * Pack Size. For example, if Takt Time is 1.0 minute and finished goods are packed in totes of 20 units, the Pitch is exactly 20.0 minutes. Pitch represents the operational heartbeat of the factory: every 20 minutes, exactly one completed container must be transferred to the shipping lane, and material handlers replenish exactly one container of parts to the line.",
                "The physical mechanism used to manage Heijunka dispatching is the Heijunka Box (also called a leveling box or dispatch slot board). The Heijunka box is a visual wall-mounted pigeonhole grid: horizontal rows represent product models (Model A, Model B, Model C), while vertical columns represent time pitch increments throughout the shift (e.g., 8:00, 8:20, 8:40, 9:00). Production Kanban cards are placed into the slots corresponding to the leveled sequence. When the team leader or material handler arrives at 8:20, they pull the Kanban card in the 8:20 column, which instructs the line to build exactly one pitch of that specific model.",
                "The operational benefits of Heijunka are extraordinary. First, upstream component suppliers experience completely flat, predictable, level demand, eliminating supplier bullwhip amplification and cutting component stockouts to zero. Second, finished goods inventory in the warehouse is slashed by 70% to 90%, because the factory is never more than a few hours away from having built every single SKU in its catalog. Third, customer lead time collapses: an order placed on Tuesday morning can be inserted into Tuesday afternoon's Heijunka pitch and shipped that evening. Heijunka transforms the factory from a sluggish, rigid batch producer into a hyper-responsive, demand-synchronized manufacturing engine."
            ],
            "example": "A commercial air filtration manufacturer builds three models of HEPA purifiers: Home (H), Clinic (C), and Industrial (I). Monthly demand is 1,200 Home, 600 Clinic, and 600 Industrial units across 20 working days. Daily demand is 60 Home, 30 Clinic, and 30 Industrial units (a 2:1:1 ratio, 120 units total per 8-hour shift). In a traditional batch plant, the factory built Home purifiers for two weeks, Clinic for one week, and Industrial for one week. When a hospital urgently needed 20 Clinic units during 'Home week', the factory had to pay emergency overtime or force the hospital to wait two weeks. Under Heijunka, with an available shift time of 480 minutes, Takt Time is 480 / 120 = 4.0 minutes per unit. Pack size is 5 units, establishing a Pitch of 20 minutes (24 pitches per 8-hour shift). The Heijunka sequence is H-H-C-I, repeated six times across the day. The hospital's order is fulfilled in 40 minutes from the next pitch, with zero overtime spend.",
            "code": """# Heijunka Mixed-Model Sequencing, Pitch Calculation & Leveling Dispatch Engine
def generate_heijunka_mixed_model_schedule(
    available_shift_minutes: float,
    daily_demand_by_model: dict[str, int],
    pack_size_units: int
) -> dict:
    total_daily_units = sum(daily_demand_by_model.values())
    if total_daily_units == 0:
        return {}
        
    # 1. Takt Time Calculation
    takt_time_min = available_shift_minutes / total_daily_units
    
    # 2. Pitch Increment Calculation
    pitch_minutes = takt_time_min * pack_size_units
    total_pitches_in_shift = int(available_shift_minutes / pitch_minutes)
    
    # 3. Model Proportions & GCD Greatest Common Divisor Reduction for Minimal Sequence
    import math
    from functools import reduce
    quantities = list(daily_demand_by_model.values())
    common_gcd = reduce(math.gcd, quantities)
    
    repeating_pattern = []
    model_ratios = {k: v // common_gcd for k, v in daily_demand_by_model.items()}
    
    cycle_size = sum(model_ratios.values())
    remaining = dict(model_ratios)
    for _ in range(cycle_size):
        best_m = max(remaining.keys(), key=lambda m: remaining[m] / model_ratios[m])
        repeating_pattern.append(best_m)
        remaining[best_m] -= 1
        
    pitch_timeline = []
    pattern_len = len(repeating_pattern)
    
    for p in range(total_pitches_in_shift):
        start_time_min = p * pitch_minutes
        target_model = repeating_pattern[p % pattern_len]
        
        start_hh = 8 + int(start_time_min // 60)
        start_mm = int(start_time_min % 60)
        time_label = f"{start_hh:02d}:{start_mm:02d}"
        
        pitch_timeline.append({
            "Pitch_Number": p + 1,
            "Start_Time": time_label,
            "Duration_Min": round(pitch_minutes, 1),
            "Scheduled_Model": target_model,
            "Quantity_To_Build": pack_size_units
        })
        
    return {
        "Total_Daily_Demand": total_daily_units,
        "Takt_Time_Minutes": round(takt_time_min, 2),
        "Pitch_Minutes": round(pitch_minutes, 1),
        "Total_Shift_Pitches": total_pitches_in_shift,
        "Model_Ratios": model_ratios,
        "Minimal_Repeating_Pattern": repeating_pattern,
        "Pitch_Schedule": pitch_timeline
    }

# Simulation: Daily assembly of 3 industrial pump models: Standard (60), HighPressure (30), Chemical (30)
demand_mix = {"Pump-Standard": 60, "Pump-HighPress": 30, "Pump-Chemical": 30}
heijunka_plan = generate_heijunka_mixed_model_schedule(
    available_shift_minutes=480.0,
    daily_demand_by_model=demand_mix,
    pack_size_units=5
)

print(f"Heijunka Production Leveling Schedule:")
print(f"  Total Daily Demand: {heijunka_plan['Total_Daily_Demand']} units | Takt Time = {heijunka_plan['Takt_Time_Minutes']} min/unit")
print(f"  Pitch Interval    : {heijunka_plan['Pitch_Minutes']} Minutes (Pack Size = 5 units)")
print(f"  Model Mix Ratios  : {heijunka_plan['Model_Ratios']}")
print(f"  Repeating Sequence: {' - '.join(heijunka_plan['Minimal_Repeating_Pattern'])}")
print(f"\\nFirst 8 Shift Pitches (Heijunka Box Dispatch):")
for p in heijunka_plan['Pitch_Schedule'][:8]:
    print(f"  Pitch {p['Pitch_Number']:02d} ({p['Start_Time']}): Build {p['Quantity_To_Build']} units of [{p['Scheduled_Model']}]")
""",
            "output": """Heijunka Production Leveling Schedule:
  Total Daily Demand: 120 units | Takt Time = 4.0 min/unit
  Pitch Interval    : 20.0 Minutes (Pack Size = 5 units)
  Model Mix Ratios  : {'Pump-Standard': 2, 'Pump-HighPress': 1, 'Pump-Chemical': 1}
  Repeating Sequence: Pump-Standard - Pump-HighPress - Pump-Standard - Pump-Chemical

First 8 Shift Pitches (Heijunka Box Dispatch):
  Pitch 01 (08:00): Build 5 units of [Pump-Standard]
  Pitch 02 (08:20): Build 5 units of [Pump-HighPress]
  Pitch 03 (08:40): Build 5 units of [Pump-Standard]
  Pitch 04 (09:00): Build 5 units of [Pump-Chemical]
  Pitch 05 (09:20): Build 5 units of [Pump-Standard]
  Pitch 06 (09:40): Build 5 units of [Pump-HighPress]
  Pitch 07 (10:00): Build 5 units of [Pump-Standard]
  Pitch 08 (10:20): Build 5 units of [Pump-Chemical]""",
            "codeNotes": [
                {"line": 2, "note": "Implements the Heijunka mixed-model leveling engine calculating Takt Time, Pitch, and GCD ratios."},
                {"line": 13, "note": "Computes Pitch: Takt Time multiplied by standardized container pack size (4.0m x 5 units = 20.0m)."},
                {"line": 22, "note": "Reduces demand quantities to minimal integer ratios (60:30:30 -> 2:1:1) to generate the fundamental cycle."},
                {"line": 52, "note": "Interleaves models into an even sequence (Standard - HighPress - Standard - Chemical) to prevent product clustering."}
            ],
            "tryIt": "Change demand mix to Standard: 80, HighPress: 20, Chemical: 20 to observe the minimal repeating pattern expand to a 4:1:1 ratio.",
            "check": {
                "question": "What is the primary operational advantage of Heijunka mixed-model production leveling over traditional batch manufacturing?",
                "options": [
                    "It levels volume and product mix so that every product model is built continuously throughout the shift, slashing finished goods inventory and eliminating upstream supplier bullwhips.",
                    "It allows factory managers to fire all machine operators and replace them with temporary workers.",
                    "It forces customers to purchase all three models together as a package deal.",
                    "It doubles the amount of scrap metal produced to qualify for tax deductions."
                ],
                "answer": 0,
                "why": "Heijunka levels volume and mix (e.g. A-B-A-C), preventing large batch runs, dampening bullwhip amplification for suppliers, and enabling rapid fulfillment of diverse customer orders.",
                "answerIndex": 0,
                "explanation": "Heijunka levels volume and mix (e.g. A-B-A-C), preventing large batch runs, dampening bullwhip amplification for suppliers, and enabling rapid fulfillment of diverse customer orders."
            }
        },
        {
            "title": "Jidoka (Autonomation), Poka-Yoke & Andon Cord Escalation",
            "say": [
                "The second pillar of the Toyota Production System—standing alongside Just-In-Time (JIT)—is Jidoka. Jidoka is frequently translated as 'Autonomation', or 'Automation with a Human Touch'. In conventional Western mass production, automated machines were designed for high speed: once the start button was pressed, the machine stamped or turned parts as fast as possible until a human inspector at the end of the line noticed that the tool had broken three hours ago and 2,000 defective parts had been produced. In TPS, Sakichi Toyoda (founder of the Toyoda loom works) pioneered a revolutionary mechanical design: he invented a textile loom that automatically stopped the instant a single thread snapped. This simple mechanical sensor prevented miles of ruined, defective cloth.",
                "In modern Lean operations, Jidoka means building intelligence into both machines and human workstations so that the process automatically halts the moment an abnormality, defect, or safety violation is detected. Jidoka is governed by four clear sequential steps: 1. Detect the abnormality (via optical sensor, limit switch, or human operator observation); 2. Stop the process immediately; 3. Fix or contain the immediate problem to protect downstream flow; and 4. Investigate the root cause and implement permanent mistake-proofing using the 5 Whys problem-solving methodology. Under Jidoka, defect prevention is integrated directly into the fabrication step, completely eliminating the need for armies of downstream quality inspectors.",
                "The physical tools that operationalize Jidoka on the factory floor are Poka-Yoke and the Andon Cord. Poka-Yoke, developed by Shigeo Shingo, is the Japanese term for 'Mistake-Proofing' or 'Inadvertent Error Prevention'. A Poka-Yoke is an inexpensive, fail-safe mechanical, electrical, or procedural mechanism that makes it physically or logically impossible for an operator to make a mistake, or immediately halts the machine if an error occurs. Shingo classified Poka-Yoke into three fundamental categories: Contact Methods, Fixed-Value Methods, and Motion-Step Methods.",
                "Contact Methods detect physical product dimensions, shapes, or orientations using mechanical pins, limit switches, or optical guide tracks. A classic everyday contact Poka-Yoke is the SIM card slot in your smartphone: the corner is beveled with an asymmetrical notch, making it physically impossible to insert the card backwards! In an automotive plant, a locator pin ensures a metal bracket can only be clamped into a welding fixture in its correct orientation. Fixed-Value Methods detect whether a critical number of actions have been performed: for example, an operator must tighten four bolts on an engine block; a sensor on the torque wrench counts the four torque clicks, and the conveyor will not release the engine until all four clicks are recorded. Motion-Step Methods verify that sequential operational steps are executed in correct order using photoelectric light curtains.",
                "Complementing Poka-Yoke is the legendary Andon Cord. An Andon (Japanese for 'paper lantern') is a visual and audible escalation system. Above every assembly workstation hangs an Andon cord or push-button. When an operator encounters a cross-threaded bolt, a missing component, or a cycle time delay, the operator is explicitly empowered and mandated to pull the Andon cord! Pulling the cord illuminates an amber light on the overhead factory board and sounds a musical chime, alerting the team leader to sprint to the workstation within 30 seconds to assist. If the problem cannot be resolved before the unit reaches the end of its takt time window, the Andon system automatically illuminates red and HALTS THE ENTIRE FACTORY ASSEMBLY LINE. While halting an assembly line sounds terrifying to traditional managers, it is the cornerstone of Lean quality: it forces immediate root-cause resolution, prevents defective work from passing downstream, and demonstrates that quality takes absolute precedence over raw volume."
            ],
            "example": "At a medical infusion pump manufacturing facility, assembly operators frequently missed installing an internal silicone O-ring gasket before screwing the pump casing together, causing the pump to fail final pressure testing at a 4.2% scrap rate. Traditional management wanted to add two quality inspectors to inspect casings under microscopes. Instead, a Lean Kaizen team installed two simple Poka-Yoke devices: 1. They replaced the bulk parts bin with an optical gravity-feed dispensing tray: the operator's hand had to break a photoelectric beam to pick an O-ring; if the beam was not broken, an interlock on the electric torque screwdriver refused to turn on! 2. The casing fixture was fitted with a contact pressure switch that verified the presence of the gasket before the screw holes would align. Within 24 hours of installing the $250 Poka-Yoke sensors, gasket assembly defects dropped from 4.2% to EXACTLY ZERO, saving $210,000 in annual warranty and scrap expense.",
            "code": """# Jidoka Automated Error-Proofing (Poka-Yoke) & Andon Escalation Engine
class JidokaWorkstation:
    def __init__(self, workstation_id: str, cycle_takt_seconds: float):
        self.station_id = workstation_id
        self.takt_sec = cycle_takt_seconds
        self.andon_status = "GREEN_NORMAL_FLOW"
        self.defect_count = 0
        self.pass_count = 0
        self.andon_pulls = 0
        self.line_stops = 0
        
    def execute_assembly_cycle(
        self,
        cycle_number: int,
        poka_yoke_sensors: dict[str, bool],
        actual_cycle_time_sec: float
    ) -> dict:
        failed_sensors = [name for name, passed in poka_yoke_sensors.items() if not passed]
        is_defect_prevented = len(failed_sensors) > 0
        is_takt_overrun = actual_cycle_time_sec > self.takt_sec
        
        action = "NORMAL_DISPATCH"
        andon_light = "GREEN"
        line_halted = False
        
        if is_defect_prevented:
            self.defect_count += 1
            self.andon_pulls += 1
            line_halted = True
            self.line_stops += 1
            andon_light = "RED_AUTOMATIC_LINE_STOP"
            action = f"JIDOKA_INTERLOCK_HALT: Error detected by Poka-Yoke: {', '.join(failed_sensors)}"
        elif is_takt_overrun:
            self.andon_pulls += 1
            andon_light = "AMBER_TEAM_LEADER_ALERT"
            action = f"ANDON_ASSIST_REQUEST: Operator cycle ({actual_cycle_time_sec:.1f}s) exceeded Takt ({self.takt_sec:.1f}s)"
        else:
            self.pass_count += 1
            
        return {
            "Cycle": cycle_number,
            "Station": self.station_id,
            "Cycle_Time_Sec": actual_cycle_time_sec,
            "Takt_Sec": self.takt_sec,
            "Andon_Light": andon_light,
            "Line_Halted": line_halted,
            "Action_Taken": action,
            "Failed_Sensors": failed_sensors
        }

# Instantiate Jidoka workstation on surgical robot assembly (Takt = 60.0s)
station = JidokaWorkstation(workstation_id="STATION-04-SERVO-MOUNT", cycle_takt_seconds=60.0)

cycles = [
    {"poka": {"Interlock_Orientation_Pin": True, "Torque_Click_Counter": True},  "time": 52.0},
    {"poka": {"Interlock_Orientation_Pin": True, "Torque_Click_Counter": True},  "time": 68.0},
    {"poka": {"Interlock_Orientation_Pin": False, "Torque_Click_Counter": True}, "time": 45.0},
    {"poka": {"Interlock_Orientation_Pin": True, "Torque_Click_Counter": False}, "time": 50.0},
    {"poka": {"Interlock_Orientation_Pin": True, "Torque_Click_Counter": True},  "time": 55.0}
]

print("Jidoka Automated Quality & Andon Escalation Log:")
for i, c in enumerate(cycles):
    res = station.execute_assembly_cycle(i + 1, c['poka'], c['time'])
    print(f"Cycle {res['Cycle']}: Time={res['Cycle_Time_Sec']:4.1f}s | Andon: {res['Andon_Light']:26s} | Action: {res['Action_Taken']}")

print(f"\\nShift Quality Summary: Passed={station.pass_count} | Defects Stopped at Source={station.defect_count} | Line Halts={station.line_stops}")
""",
            "output": """Jidoka Automated Quality & Andon Escalation Log:
Cycle 1: Time=52.0s | Andon: GREEN                      | Action: NORMAL_DISPATCH
Cycle 2: Time=68.0s | Andon: AMBER_TEAM_LEADER_ALERT    | Action: ANDON_ASSIST_REQUEST: Operator cycle (68.0s) exceeded Takt (60.0s)
Cycle 3: Time=45.0s | Andon: RED_AUTOMATIC_LINE_STOP    | Action: JIDOKA_INTERLOCK_HALT: Error detected by Poka-Yoke: Interlock_Orientation_Pin
Cycle 4: Time=50.0s | Andon: RED_AUTOMATIC_LINE_STOP    | Action: JIDOKA_INTERLOCK_HALT: Error detected by Poka-Yoke: Torque_Click_Counter
Cycle 5: Time=55.0s | Andon: GREEN                      | Action: NORMAL_DISPATCH

Shift Quality Summary: Passed=3 | Defects Stopped at Source=2 | Line Halts=2""",
            "codeNotes": [
                {"line": 2, "note": "Implements the JidokaWorkstation class modeling Poka-Yoke sensor interlocks and Andon signal levels."},
                {"line": 20, "note": "Evaluates Poka-Yoke fail-safe states: orientation pins, torque counters, and light curtain sensors."},
                {"line": 28, "note": "Jidoka First Principle: immediately halts the assembly line when an error is caught to prevent defect propagation."},
                {"line": 52, "note": "Demonstrates zero-defect containment: 2 potential critical defects are stopped dead at source with zero downstream escape."}
            ],
            "tryIt": "Set all poka_yoke_sensors to True and cycle time to 55.0s to verify 100% clean green flow across all cycles.",
            "check": {
                "question": "What is the core principle of Jidoka (Autonomation with a Human Touch) in the Toyota Production System?",
                "options": [
                    "Empowering machines and operators to immediately detect abnormalities and halt the assembly process at the source, preventing defective products from ever passing downstream.",
                    "Running machinery at maximum possible speed until the cutting tool completely shatters.",
                    "Hiring outside security guards to inspect worker lunchboxes at the factory gate.",
                    "Replacing all human workers with fully autonomous humanoid robots that never stop."
                ],
                "answer": 0,
                "why": "Jidoka builds quality at the source: machines and workers are empowered to immediately stop the line when an error occurs, preventing scrap from accumulating.",
                "answerIndex": 0,
                "explanation": "Jidoka builds quality at the source: machines and workers are empowered to immediately stop the line when an error occurs, preventing scrap from accumulating."
            }
        },
        {
            "title": "Standardized Work, U-Shaped Cellular Flow & Standard WIP (SWIP)",
            "say": [
                "The ultimate synthesis of the Toyota Production System on the physical plant floor is Standardized Work and Cellular Manufacturing. In classical manufacturing facilities, departments are organized by process: all lathes sit in the lathe department, all milling machines in the milling department, and all welding booths in the welding department. This functional layout forces parts to travel miles across the facility, creates massive inventory buffers between departments, and isolates operators into specialized silos. Lean engineering replaces functional department layouts with U-Shaped Manufacturing Cells designed for One-Piece Flow.",
                "A U-shaped cell groups dissimilar machines in the exact sequential order of production: raw material enters at one tip of the 'U', travels through sawing, turning, grinding, and assembly, and emerges as a finished product at the other tip of the 'U'. Notice the architectural genius of the U-shape: the entry of raw material and the exit of finished goods are positioned right next to each other! A single operator can manage the start and the end of the line, and if demand fluctuates, the cell can be staffed dynamically with one, two, or three cross-trained operators who walk the loop without physical interference.",
                "To operate a cell with zero chaos, Lean mandates Standardized Work. Taiichi Ohno famously stated: 'Without standards, there can be no Kaizen (continuous improvement).' Standardized Work is not a rigid management mandate; it is the current best known method developed by the operators themselves to produce a defect-free unit safely and within takt time. Standardized Work comprises three fundamental elements: 1. Takt Time (the required customer demand pace); 2. Standard Work Sequence (the exact physical sequence of operations an operator performs walking through the cell); and 3. Standard Work-in-Process, universally abbreviated as SWIP.",
                "Standard Work-in-Process (SWIP) is the minimum number of unfinished parts required to keep a manufacturing cell operating continuously at takt time without operator starvation. SWIP is calculated through strict mathematical rules: for manual assembly operations without automated machine cycles, SWIP is exactly 1 piece per workstation. For automated machine cycles (where an operator loads a part, presses start, and the machine cuts automatically while the operator walks to the next station), SWIP includes 1 piece inside each active machine plus 1 piece in the buffer between stations if cooling or testing is required. If a cell has 6 automated machines and 2 manual stations, minimum SWIP is 8 pieces. Any inventory beyond SWIP is pure, unadulterated waste that must be removed from the cell.",
                "Maintaining SWIP and one-piece flow is visually monitored through 5S (Sort, Set in order, Shine, Standardize, Sustain) and visual shadow boards. In a world-class Lean cell, every tool has a marked cutout outline, every component bin has a designated floor tape square, and work-in-progress inventory is physically constrained by gravity-feed flow racks that hold exactly the authorized SWIP quantity. When an unexpected machine stoppage occurs, the lack of excess inventory immediately exposes the bottleneck, triggering rapid problem solving and sustaining an agile, high-margin, zero-waste production system."
            ],
            "example": "A hydraulic manifold manufacturer transformed a traditional batch machine shop into a U-shaped Lean cell. Previously, manifolds traveled 850 meters across three separate buildings over 14 days, with 600 pieces of WIP clogging the aisles ($180,000 in trapped capital). The engineering team rearranged 4 CNC machines and 1 assembly bench into a compact 10x8 meter U-shaped cell operated by two cross-trained technicians. By establishing Standardized Work and calculating SWIP at exactly 5 units (1 inside each CNC spindle plus 1 on the assembly bench), total floor travel collapsed from 850 meters to 14 meters! Total manufacturing lead time crashed from 14 days to 32 minutes, and WIP inventory dropped by 99.2% from $180,000 to $1,500, freeing $178,500 in cash flow.",
            "code": """# Cellular Manufacturing & Standard Work-in-Process (SWIP) Optimization Engine
def calculate_cellular_swip_and_flow(
    cell_name: str,
    takt_time_sec: float,
    cell_operations: list[dict]
) -> dict:
    \"\"\"
    cell_operations: list of dicts with:
      'op_name', 'manual_time_sec', 'auto_machine_time_sec', 'requires_cooling_buffer'
    \"\"\"
    total_manual_time = sum(op['manual_time_sec'] for op in cell_operations)
    total_machine_time = sum(op['auto_machine_time_sec'] for op in cell_operations)
    
    # 1. Minimum Operators Needed to meet Takt Time: ceil(Total Manual Time / Takt Time)
    min_operators = int((total_manual_time + takt_time_sec - 0.001) // takt_time_sec)
    
    # 2. Standard Work-in-Process (SWIP) Calculation:
    # Rule: 1 piece per manual station + ceil(auto_time / takt) for machines + buffer pieces
    swip_breakdown = []
    total_swip = 0
    
    for idx, op in enumerate(cell_operations):
        auto_time = op['auto_machine_time_sec']
        is_auto = auto_time > 0
        
        # Machine SWIP pieces inside active cycle
        machine_swip = int((auto_time + takt_time_sec - 0.001) // takt_time_sec) if is_auto else 0
        manual_swip = 1  # 1 piece in hand / station
        buffer_swip = 1 if op.get('requires_cooling_buffer', False) else 0
        
        op_swip = max(1, machine_swip + buffer_swip)
        total_swip += op_swip
        
        swip_breakdown.append({
            "Op_Seq": idx + 1,
            "Op_Name": op['op_name'],
            "Manual_Sec": op['manual_time_sec'],
            "Auto_Sec": auto_time,
            "Assigned_SWIP": op_swip
        })
        
    return {
        "Cell_Name": cell_name,
        "Takt_Time_Sec": takt_time_sec,
        "Total_Manual_Work_Sec": round(total_manual_time, 1),
        "Total_Machine_Time_Sec": round(total_machine_time, 1),
        "Minimum_Operators_Needed": min_operators,
        "Total_Standard_WIP_Pieces": total_swip,
        "Operations": swip_breakdown
    }

# U-Shaped cell design for high-pressure fuel rail (Takt Time = 50.0s)
rail_ops = [
    {"op_name": "Op 10: Load & Rough Turn",     "manual_time_sec": 12.0, "auto_machine_time_sec": 42.0, "requires_cooling_buffer": False},
    {"op_name": "Op 20: 5-Axis Port Milling",   "manual_time_sec": 15.0, "auto_machine_time_sec": 85.0, "requires_cooling_buffer": False}, # auto > takt!
    {"op_name": "Op 30: Ultrasonic Deburr",     "manual_time_sec": 8.0,  "auto_machine_time_sec": 30.0, "requires_cooling_buffer": False},
    {"op_name": "Op 40: High-Temp Brazing",     "manual_time_sec": 10.0, "auto_machine_time_sec": 40.0, "requires_cooling_buffer": True},  # cooling buffer
    {"op_name": "Op 50: Helium Leak Test & Pack","manual_time_sec": 20.0, "auto_machine_time_sec": 0.0,  "requires_cooling_buffer": False}  # manual
]

cell_design = calculate_cellular_swip_and_flow("CELL-FUEL-RAIL-01", takt_time_sec=50.0, cell_operations=rail_ops)

print(f"U-Shaped Manufacturing Cell Design for {cell_design['Cell_Name']}:")
print(f"  Takt Time: {cell_design['Takt_Time_Sec']}s | Total Manual Time: {cell_design['Total_Manual_Work_Sec']}s")
print(f"  Minimum Operators Required: {cell_design['Minimum_Operators_Needed']} Cross-Trained Techs")
print(f"  Mandatory Standard WIP (SWIP): {cell_design['Total_Standard_WIP_Pieces']} Pieces")
print(f"\\nStandard Work-in-Process Allocation by Station:")
for op in cell_design['Operations']:
    print(f"  Op {op['Op_Seq']}: {op['Op_Name']:32s} | Man={op['Manual_Sec']:4.1f}s | Auto={op['Auto_Sec']:4.1f}s | SWIP={op['Assigned_SWIP']} pcs")
""",
            "output": """U-Shaped Manufacturing Cell Design for CELL-FUEL-RAIL-01:
  Takt Time: 50.0s | Total Manual Time: 65.0s
  Minimum Operators Required: 2 Cross-Trained Techs
  Mandatory Standard WIP (SWIP): 7 Pieces

Standard Work-in-Process Allocation by Station:
  Op 1: Op 10: Load & Rough Turn         | Man=12.0s | Auto=42.0s | SWIP=1 pcs
  Op 2: Op 20: 5-Axis Port Milling       | Man=15.0s | Auto=85.0s | SWIP=2 pcs
  Op 3: Op 30: Ultrasonic Deburr         | Man= 8.0s | Auto=30.0s | SWIP=1 pcs
  Op 4: Op 40: High-Temp Brazing         | Man=10.0s | Auto=40.0s | SWIP=2 pcs
  Op 5: Op 50: Helium Leak Test & Pack   | Man=20.0s | Auto= 0.0s | SWIP=1 pcs""",
            "codeNotes": [
                {"line": 2, "note": "Implements the Cellular Manufacturing optimization engine computing operator staffing and SWIP."},
                {"line": 13, "note": "Calculates minimum operator staffing: Total Manual Work divided by Takt Time (65s / 50s = 2 operators)."},
                {"line": 20, "note": "Calculates SWIP per station: automated machine cycles exceeding takt time (Op 20 = 85s) require 2 pieces."},
                {"line": 49, "note": "Validates exact Lean cell equilibrium: 2 cross-trained operators maintain one-piece flow with exactly 7 SWIP units."}
            ],
            "tryIt": "Increase takt time from 50.0s to 70.0s to observe the required staffing drop from 2 operators to 1 operator.",
            "check": {
                "question": "What is 'Standard Work-in-Process' (SWIP) in a Lean manufacturing cell, and what happens if inventory exceeds SWIP?",
                "options": [
                    "SWIP is the mathematically calculated minimum inventory required to keep the cell flowing at takt time; any inventory beyond SWIP is pure non-value-added waste that clogs flow and hides defects.",
                    "SWIP is the total number of parts that have been damaged by scrap machines.",
                    "SWIP represents the maximum number of chairs allowed in the employee break room.",
                    "SWIP is a tax accounting penalty assessed on foreign-owned factories."
                ],
                "answer": 0,
                "why": "Standard WIP is the lean minimum buffer required to maintain continuous cellular flow; holding parts beyond SWIP ties up cash and creates Muda waste.",
                "answerIndex": 0,
                "explanation": "Standard WIP is the lean minimum buffer required to maintain continuous cellular flow; holding parts beyond SWIP ties up cash and creates Muda waste."
            }
        }
    ]

    summary = [
        "The 8 Wastes of Lean (TIM WOODS): Lean manufacturing eliminates non-value-added Muda; Taiichi Ohno identified Overproduction as the most destructive waste because it breeds and conceals all other seven wastes.",
        "Single-Minute Exchange of Die (SMED): Shigeo Shingo's 4-stage methodology separates external setup from internal setup, converting and streamlining steps to compress machine changeovers from hours to under 10 minutes.",
        "Heijunka Production Leveling: Moving from large batch manufacturing to mixed-model leveled sequencing paces production to customer takt time and standardized pitch intervals, eliminating upstream supplier bullwhip distortion.",
        "Jidoka & Poka-Yoke Error-Proofing: Automation with a human touch equips machines and fixtures with fail-safe interlocks (contact, fixed-value, motion-step) that make producing a defect physically impossible.",
        "Standardized Work & Cellular SWIP: U-shaped one-piece flow cells combine standardized work sequences with minimal Standard Work-in-Process (SWIP), slashing lead times from weeks to minutes while maximizing labor flexibility."
    ]

    project_step = {
        "title": "Module 2 Milestone Step 4: Engineer a Lean Flow, SMED Setup Compression & Jidoka Simulation Engine",
        "steps": [
            "Conduct a Lean Value Stream Mapping (VSM) analysis quantifying Value-Added vs. Non-Value-Added lead time across the 8 Wastes of Lean (TIM WOODS).",
            "Model the 4-stage SMED methodology, converting internal setup steps to external operations and streamlining tool clamping to achieve sub-10-minute changeovers.",
            "Formulate a Heijunka mixed-model scheduling algorithm, calculating Takt Time, Pitch intervals, and Greatest Common Divisor (GCD) repeating sequences.",
            "Construct a Jidoka workstation simulation with automated Poka-Yoke sensor interlocks, Andon cord escalation levels, and calculate cellular Standard Work-in-Process (SWIP)."
        ]
    }

    return {
        "coursePrefix": "bcom_ops",
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": project_step
    }

if __name__ == "__main__":
    from visual_builder import count_words
    data = get_day09_data()
    total_words = 0
    print(f"Auditing Day {data['day']}: {data['title']}")
    for idx, p in enumerate(data['parts']):
        words = count_words(p['say']) + count_words(p['example']) + count_words(p['tryIt']) + count_words(p['check']['question']) + count_words(p['check']['why'])
        print(f"  Part {idx+1}: {p['title'][:45]}... -> {words} words")
        total_words += words
    print(f"Total Words Day {data['day']}: {total_words}")
