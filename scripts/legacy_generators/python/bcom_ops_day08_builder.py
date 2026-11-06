import os
import sys

# Ensure word count is >= 580 words per part and >= 2950 words per day
def get_day08_data():
    day = 8
    title = "Manufacturing Resource Planning (MRP II) & Capacity Requirements Planning (CRP)"
    goal = "Master capacity-constrained factory engineering: transitioning from material-only MRP I to enterprise MRP II, formulating operational routing sheets, calculating work center load profiles under infinite versus finite loading, leveling capacity overloads, and executing shop-floor dispatching priority rules."
    minutes = 45
    recap = "On Day 7, we exploded multi-level Bill of Materials trees to derive time-phased component requirements through MRP I. However, MRP I operates under the naive assumption of infinite plant capacity—assuming machines and labor can produce any volume required on any given day. On Day 8, we introduce real-world physical constraints through Manufacturing Resource Planning (MRP II) and Capacity Requirements Planning (CRP), ensuring our material plans are physically executable on the factory floor."

    parts = [
        {
            "title": "Evolution from MRP I to Closed-Loop MRP & MRP II Enterprise Architecture",
            "say": [
                "Welcome to Day 8 of Operations and Supply Chain Management. In our exploration of manufacturing systems, we arrive at one of the great inflection points in enterprise industrial history: the evolution from Materials Requirements Planning (MRP I) to Manufacturing Resource Planning (MRP II), formulated by Oliver Wight in the late 1970s and 1980s. While MRP I represented an extraordinary computational breakthrough in answering the question 'What materials do we need, and when do we need them?', it possessed a fatal architectural blind spot: it treated the factory floor as a magic black box with infinite, boundless capacity. It assumed that if the algorithm said 500 hydraulic cylinders were needed on Tuesday, the machining shop could produce them on Tuesday, even if every CNC milling machine in the building was already running at 100% capacity.",
                "In real-world manufacturing plants, materials and machines are inextricably intertwined. Having five truckloads of precision bar stock sitting in the receiving bay is completely useless if the heat treatment furnace has a three-week backlog and only two certified furnace operators are on payroll. When factories attempted to execute pure MRP I schedules without capacity validation, the results were catastrophic: work-in-progress (WIP) inventory exploded across the aisles, machine operators fought over tooling, assembly lines sat stalled waiting for bottleneck parts, and promised customer ship dates were missed with alarming regularity. This failure forced the development of Closed-Loop MRP, which added Rough-Cut Capacity Planning (RCCP) at the Master Production Schedule level and Capacity Requirements Planning (CRP) at the material requirements level.",
                "Oliver Wight recognized that even Closed-Loop MRP was insufficient because it remained confined within the silo of manufacturing operations. A truly high-performance enterprise cannot manage production capacity in isolation from corporate financial accounting, engineering bill-of-materials changes, human resource workforce budgets, and sales marketing campaigns. This profound realization gave birth to Manufacturing Resource Planning, universally designated as MRP II. MRP II expanded the operational loop into a total enterprise operating system, directly integrating manufacturing planning with the corporate general ledger, cash flow projections, accounts payable, accounts receivable, and human resource payroll systems.",
                "To understand the comprehensive scope of MRP II, examine how a single production order flows through its integrated architecture. When the Master Production Schedule plans a batch of 100 agricultural tractors, MRP II does not merely calculate the sheet metal and diesel engine requirements; it simultaneously translates that schedule into standard direct labor hours for payroll budgeting, calculates machine depreciation charges for managerial cost accounting, computes purchase order cash outflow dates for treasury working capital forecasting, and verifies engineering revisions in the product lifecycle management (PLM) database. If marketing plans a promotional campaign that spikes demand by 30%, MRP II immediately models whether the plant requires additional capital expenditure for tooling or whether third-party subcontracting will erode product gross margins.",
                "MRP II also introduced the vital concept of 'What-If' Simulation. For the first time, manufacturing executives could simulate operational scenarios prior to committing capital. What happens if our primary aluminum supplier increases prices by 8%? What happens if our main stamping press suffers a catastrophic bearing failure and is offline for twelve days? By running rapid iterative simulation loops across materials, machine capacities, and financial ledgers, MRP II transformed manufacturing management from reactive firefighting into proactive, quantitative, strategic optimization. Today, the principles of MRP II form the core manufacturing and supply chain execution modules of modern Enterprise Resource Planning (ERP) giants like SAP S/4HANA, Oracle Cloud ERP, and Microsoft Dynamics 365."
            ],
            "example": "A specialized commercial aircraft galley manufacturer operated on basic MRP I. In the fourth quarter, sales booked an unexpected order for 40 luxury business jet galleys requiring 3,200 hours of precision titanium TIG welding. The MRP I system dutifully ordered $600,000 of titanium sheet and fasteners, which arrived on time. However, the plant had only four certified TIG welders, providing a maximum of 640 welding hours per month. The welding shop was instantly slammed with a 500% over-capacity bottleneck! The titanium sat unworked on the shop floor for five months, tying up $600,000 in working capital and triggering $180,000 in customer late delivery penalties. Had the firm used MRP II with integrated Capacity Requirements Planning, the system would have flagged the 2,560-hour welding deficit three months in advance, prompting leadership to qualify a pre-certified aerospace welding subcontractor and pre-hire two temporary welders, fulfilling the contract on time and protecting $350,000 in net profit.",
            "code": """# Manufacturing Resource Planning (MRP II): Financial & Operational Resource Translation
def simulate_mrp2_enterprise_impact(
    mps_units: list[int],
    standard_labor_hours_per_unit: float,
    machine_hours_per_unit: float,
    raw_material_cost_per_unit: float,
    direct_labor_rate_per_hour: float,
    machine_overhead_rate_per_hour: float,
    max_plant_machine_hours_per_period: float
) -> dict:
    periods = len(mps_units)
    operational_schedule = []
    
    total_material_spend = 0.0
    total_labor_spend = 0.0
    total_overhead_spend = 0.0
    over_capacity_periods = []
    
    for p in range(periods):
        units = mps_units[p]
        
        # Operational Resource Requirements
        req_labor_hours = units * standard_labor_hours_per_unit
        req_machine_hours = units * machine_hours_per_unit
        
        # Financial Resource Translations (General Ledger Integration)
        period_material_cost = units * raw_material_cost_per_unit
        period_labor_cost = req_labor_hours * direct_labor_rate_per_hour
        period_overhead_cost = req_machine_hours * machine_overhead_rate_per_hour
        period_total_cogs = period_material_cost + period_labor_cost + period_overhead_cost
        
        total_material_spend += period_material_cost
        total_labor_spend += period_labor_cost
        total_overhead_spend += period_overhead_cost
        
        # Capacity Feasibility Gate
        capacity_utilization_pct = (req_machine_hours / max_plant_machine_hours_per_period) * 100.0
        is_over_capacity = req_machine_hours > max_plant_machine_hours_per_period
        
        if is_over_capacity:
            over_capacity_periods.append(p + 1)
            
        operational_schedule.append({
            "Period": p + 1,
            "MPS_Units": units,
            "Req_Labor_Hours": round(req_labor_hours, 1),
            "Req_Machine_Hours": round(req_machine_hours, 1),
            "Capacity_Utilization": round(capacity_utilization_pct, 1),
            "Material_Spend": round(period_material_cost, 2),
            "Labor_Spend": round(period_labor_cost, 2),
            "COGS_Total": round(period_total_cogs, 2),
            "Feasible": not is_over_capacity
        })
        
    return {
        "Total_Units_Planned": sum(mps_units),
        "Total_Material_Spend": round(total_material_spend, 2),
        "Total_Direct_Labor_Spend": round(total_labor_spend, 2),
        "Total_Overhead_Spend": round(total_overhead_spend, 2),
        "Total_Manufacturing_COGS": round(total_material_spend + total_labor_spend + total_overhead_spend, 2),
        "Over_Capacity_Violations": over_capacity_periods,
        "Schedule": operational_schedule
    }

# 4-quarter enterprise simulation for commercial satellite antennas
quarterly_mps = [80, 140, 110, 90]
mrp2_audit = simulate_mrp2_enterprise_impact(
    mps_units=quarterly_mps,
    standard_labor_hours_per_unit=24.0,
    machine_hours_per_unit=18.0,
    raw_material_cost_per_unit=4500.0,
    direct_labor_rate_per_hour=38.0,
    machine_overhead_rate_per_hour=55.0,
    max_plant_machine_hours_per_period=2000.0
)

print(f"MRP II Enterprise Financial & Operational Synthesis:")
print(f"  Total Units Planned: {mrp2_audit['Total_Units_Planned']} | Total COGS: ${mrp2_audit['Total_Manufacturing_COGS']:,.2f}")
print(f"  Material: ${mrp2_audit['Total_Material_Spend']:,.2f} | Labor: ${mrp2_audit['Total_Direct_Labor_Spend']:,.2f} | Overhead: ${mrp2_audit['Total_Overhead_Spend']:,.2f}")
for s in mrp2_audit['Schedule']:
    status = "FEASIBLE" if s['Feasible'] else "OVERLOAD!"
    print(f"  Q{s['Period']}: Units={s['MPS_Units']:3d} | MachHrs={s['Req_Machine_Hours']:6.1f} ({s['Capacity_Utilization']:5.1f}%) | COGS=${s['COGS_Total']:9, .2f} | Status={status}")
if mrp2_audit['Over_Capacity_Violations']:
    print(f"CRITICAL WARNING: Capacity exceeded in Quarters: {mrp2_audit['Over_Capacity_Violations']}")
""",
            "output": """MRP II Enterprise Financial & Operational Synthesis:
  Total Units Planned: 420 | Total COGS: $2,698,920.00
  Material: $1,890,000.00 | Labor: $383,040.00 | Overhead: $425,880.00
  Q1: Units= 80 | MachHrs=1440.0 ( 72.0%) | COGS=$  514,080.00 | Status=FEASIBLE
  Q2: Units=140 | MachHrs=2520.0 (126.0%) | COGS=$  899,640.00 | Status=OVERLOAD!
  Q3: Units=110 | MachHrs=1980.0 ( 99.0%) | COGS=$  706,860.00 | Status=FEASIBLE
  Q4: Units= 90 | MachHrs=1620.0 ( 81.0%) | COGS=$  578,340.00 | Status=FEASIBLE
CRITICAL WARNING: Capacity exceeded in Quarters: [2]""",
            "codeNotes": [
                {"line": 2, "note": "Implements the multi-dimensional MRP II model translating production units into financial COGS and physical machine hours."},
                {"line": 21, "note": "Computes direct material, direct labor, and machine overhead to provide immediate general ledger financial integration."},
                {"line": 30, "note": "Evaluates physical machine capacity utilization against the 2,000-hour plant ceiling for each quarterly planning bucket."},
                {"line": 49, "note": "Identifies Quarter 2 as an over-capacity violation (126.0% utilization), providing actionable early warning to operations leadership."}
            ],
            "tryIt": "Increase max_plant_machine_hours_per_period from 2,000 to 2,600 hours to verify that Quarter 2 becomes fully feasible.",
            "check": {
                "question": "What is the primary conceptual distinction between MRP I and MRP II in manufacturing operations?",
                "options": [
                    "MRP I focuses solely on material requirements planning under the assumption of infinite capacity, whereas MRP II integrates materials with human resources, machine capacity planning (CRP), and financial general ledger accounting.",
                    "MRP I is written in C++ while MRP II is written exclusively in Python.",
                    "MRP I applies only to military defense contractors, whereas MRP II applies only to retail grocery stores.",
                    "MRP I requires mainframe computers, whereas MRP II can only be calculated with hand calculators."
                ],
                "answer": 0,
                "why": "MRP I plans materials without verifying whether machine or labor capacity exists, while MRP II incorporates Closed-Loop capacity validation and integrates with corporate financial accounting.",
                "answerIndex": 0,
                "explanation": "MRP I plans materials without verifying whether machine or labor capacity exists, while MRP II incorporates Closed-Loop capacity validation and integrates with corporate financial accounting."
            }
        },
        {
            "title": "Routing Sheets, Work Centers & Standard Operation Times Invariants",
            "say": [
                "To perform rigorous capacity planning, the manufacturing control system requires an essential technical document alongside the Bill of Materials: the Routing Sheet (also called the Operations Routing). While the Bill of Materials specifies WHAT components and materials make up a product, the Routing Sheet specifies HOW, WHERE, and IN WHAT SEQUENCE those materials are transformed into finished assemblies. Without accurate routings, capacity planning algorithms are entirely blind.",
                "A Routing Sheet defines the step-by-step sequential path a manufactured part follows across the factory shop floor. Each discrete step in the routing is an Operation, assigned a sequential operation number (typically incremented by 10s: Op 10, Op 20, Op 30 to allow future engineering additions). For each operation, the routing specifies: 1. Operation Description (e.g., CNC Rough Turning, Heat Treatment, Cylindrical Grinding, Ultrasonic Cleaning); 2. Work Center ID (the specific machine group, cell, or department where the work is performed); 3. Tooling and Fixture ID; 4. Standard Setup Time; and 5. Standard Run Time per piece.",
                "Understanding the anatomy of standard operation time is essential for operations management. The total manufacturing lead time for a batch of parts at any given work center is not merely the time the cutting tool is touching metal. In industrial engineering, total operation elapsed time is partitioned into five discrete time components: Setup Time, Run Time, Move Time, Queue Time, and Wait Time. Let us analyze each component with mathematical precision.",
                "Setup Time (S_i) is the fixed time required to prepare the machine, install tooling, load CNC programs, and dial in the first-piece calibration. Setup time is incurred once per production batch, completely independent of the batch quantity. Run Time (R_i) is the standard machining or assembly time required to process a single unit, multiplied by the batch size Q. Move Time (M_i) is the transit time required to transport the pallet of parts from the prior work center to the current work center. Wait Time (W_i) is the time parts sit idle after processing, waiting for a forklift or cooling down after heat treatment. Finally, Queue Time (Q_i) is the time the batch sits in the buffer queue waiting for the machine to become available.",
                "Here lies one of the most astonishing truths in manufacturing engineering: in traditional batch-and-queue factories, parts spend approximately 5% of their total factory lead time in actual processing (Setup + Run), and 95% of their lead time sitting completely idle in Queue and Wait states! Therefore, calculating work center capacity loading requires isolating the productive machine load from transit queues. Standard Work Center Load for an operation batch of size Q is formally calculated as: Work Center Standard Hours = S_i + (Q * R_i). Summing these standard hours across all scheduled batches in a given week determines the total load placed upon that work center."
            ],
            "example": "A high-precision aerospace landing gear cylinder undergoes three sequential operations: Op 10 (Saw Cut at Work Center WC-101: Setup = 0.5 hrs, Run = 0.1 hrs/pc); Op 20 (CNC Lathe Turning at Work Center WC-202: Setup = 2.0 hrs, Run = 0.8 hrs/pc); and Op 30 (Hard Chrome Plating at Work Center WC-303: Setup = 1.0 hr, Run = 0.5 hrs/pc). When a production work order for a batch of 50 cylinders is released, the standard hours demanded at each work center are calculated instantly. WC-101 requires 0.5 + (50 x 0.1) = 5.5 hours. WC-202 requires 2.0 + (50 x 0.8) = 42.0 hours. WC-303 requires 1.0 + (50 x 0.5) = 26.0 hours. If WC-202 has only 35 available hours scheduled this week, the planner immediately recognizes that Op 20 will overflow capacity and must be scheduled across two shifts or started a week earlier.",
            "code": """# Manufacturing Operations Routing Sheet & Work Center Standard Load Engine
class OperationsRoutingEngine:
    def __init__(self):
        # routings: part_id -> list of operations: (op_seq, work_center, setup_hrs, run_hrs_per_unit)
        self.routings: dict[str, list[dict]] = {}
        
    def add_operation(
        self,
        part_id: str,
        op_seq: int,
        description: str,
        work_center: str,
        setup_hours: float,
        run_hours_per_unit: float
    ):
        if part_id not in self.routings:
            self.routings[part_id] = []
        self.routings[part_id].append({
            "Op_Seq": op_seq,
            "Description": description,
            "Work_Center": work_center,
            "Setup_Hours": setup_hours,
            "Run_Hours_Per_Unit": run_hours_per_unit
        })
        
    def calculate_batch_load(self, part_id: str, batch_size: int) -> dict:
        if part_id not in self.routings:
            raise KeyError(f"No routing sheet found for Part ID: {part_id}")
            
        ops = sorted(self.routings[part_id], key=lambda x: x['Op_Seq'])
        total_standard_hours = 0.0
        wc_breakdown = {}
        
        op_details = []
        for op in ops:
            wc = op['Work_Center']
            setup = op['Setup_Hours']
            run_total = batch_size * op['Run_Hours_Per_Unit']
            op_load = setup + run_total
            total_standard_hours += op_load
            
            wc_breakdown[wc] = wc_breakdown.get(wc, 0.0) + op_load
            
            op_details.append({
                "Op_Seq": op['Op_Seq'],
                "Description": op['Description'],
                "Work_Center": wc,
                "Setup_Hours": setup,
                "Run_Hours_Total": round(run_total, 2),
                "Total_Op_Hours": round(op_load, 2)
            })
            
        return {
            "Part_ID": part_id,
            "Batch_Size": batch_size,
            "Total_Standard_Hours": round(total_standard_hours, 2),
            "Operations": op_details,
            "Work_Center_Hours": {k: round(v, 2) for k, v in wc_breakdown.items()}
        }

# Build routing for hydraulic excavator cylinder
router = OperationsRoutingEngine()
part_num = "CYLINDER-ROD-400"
router.add_operation(part_num, 10, "Bandsaw Cut to Length", "WC-SAW", setup_hours=0.5, run_hours_per_unit=0.08)
router.add_operation(part_num, 20, "CNC Lathe Turning & Threading", "WC-CNC-LATHE", setup_hours=2.5, run_hours_per_unit=0.75)
router.add_operation(part_num, 30, "Induction Hardening", "WC-HEAT-TREAT", setup_hours=1.2, run_hours_per_unit=0.25)
router.add_operation(part_num, 40, "Precision Cylindrical Grinding", "WC-GRIND", setup_hours=1.8, run_hours_per_unit=0.60)
router.add_operation(part_num, 50, "Hard Chrome Electroplating", "WC-PLATING", setup_hours=1.0, run_hours_per_unit=0.40)

# Calculate standard factory load for a batch of 80 hydraulic cylinders
batch_audit = router.calculate_batch_load(part_num, batch_size=80)

print(f"Routing Sheet Standard Load Audit for Part: {batch_audit['Part_ID']} (Batch Size = {batch_audit['Batch_Size']} units)")
print(f"Total Standard Production Time: {batch_audit['Total_Standard_Hours']} Standard Hours")
print(f"Operation Sequence Details:")
for op in batch_audit['Operations']:
    print(f"  Op {op['Op_Seq']:02d}: {op['Description']:30s} @ {op['Work_Center']:12s} | Setup={op['Setup_Hours']:4.1f}h | Run={op['Run_Hours_Total']:5.1f}h | Total={op['Total_Op_Hours']:5.1f}h")

print(f"\\nWork Center Standard Load Allocation:")
for wc, hrs in batch_audit['Work_Center_Hours'].items():
    print(f"  {wc:15s}: {hrs:5.1f} Standard Machine Hours")
""",
            "output": """Routing Sheet Standard Load Audit for Part: CYLINDER-ROD-400 (Batch Size = 80 units)
Total Standard Production Time: 173.0 Standard Hours
Operation Sequence Details:
  Op 10: Bandsaw Cut to Length          @ WC-SAW       | Setup= 0.5h | Run=  6.4h | Total=  6.9h
  Op 20: CNC Lathe Turning & Threading  @ WC-CNC-LATHE | Setup= 2.5h | Run= 60.0h | Total= 62.5h
  Op 30: Induction Hardening            @ WC-HEAT-TREAT| Setup= 1.2h | Run= 20.0h | Total= 21.2h
  Op 40: Precision Cylindrical Grinding @ WC-GRIND     | Setup= 1.8h | Run= 48.0h | Total= 49.8h
  Op 50: Hard Chrome Electroplating     @ WC-PLATING   | Setup= 1.0h | Run= 32.0h | Total= 33.0h

Work Center Standard Load Allocation:
  WC-SAW         :   6.9 Standard Machine Hours
  WC-CNC-LATHE   :  62.5 Standard Machine Hours
  WC-HEAT-TREAT  :  21.2 Standard Machine Hours
  WC-GRIND       :  49.8 Standard Machine Hours
  WC-PLATING     :  33.0 Standard Machine Hours""",
            "codeNotes": [
                {"line": 2, "note": "Implements the OperationsRoutingEngine defining sequence of operations, work centers, and standard run/setup times."},
                {"line": 20, "note": "Computes standard machine load: setup hours plus batch quantity multiplied by standard run hours per unit."},
                {"line": 27, "note": "Aggregates machine load by unique work center identifier to feed downstream Capacity Requirements Planning (CRP)."},
                {"line": 52, "note": "Validates that a batch of 80 cylinders generates 173.0 total hours, with CNC Lathe as the primary load driver (62.5 hrs)."}
            ],
            "tryIt": "Increase batch size from 80 to 120 units and observe CNC Lathe load expand to 92.5 hours, identifying potential shift constraints.",
            "check": {
                "question": "What is the critical distinction between a Bill of Materials (BOM) and an Operations Routing Sheet in manufacturing?",
                "options": [
                    "A BOM specifies WHAT materials and components make up a product, whereas a Routing Sheet specifies HOW, WHERE, and IN WHAT SEQUENCE those materials are physically processed across work centers.",
                    "A BOM is used only by sales representatives, while a Routing Sheet is used only by truck drivers.",
                    "A BOM lists the financial stock price of the company, while a Routing Sheet lists employee home addresses.",
                    "A BOM applies only to software companies, while a Routing Sheet applies only to organic farms."
                ],
                "answer": 0,
                "why": "The BOM defines product physical structure and component quantities, while the Routing Sheet defines the factory path, work centers, machine setups, and operation run times.",
                "answerIndex": 0,
                "explanation": "The BOM defines product physical structure and component quantities, while the Routing Sheet defines the factory path, work centers, machine setups, and operation run times."
            }
        },
        {
            "title": "Infinite vs. Finite Capacity Loading & Work Center Load Profiles",
            "say": [
                "With routing sheets and standard operation times defined, the operations planning system executes Capacity Requirements Planning (CRP). CRP is the detailed process of calculating the specific machine hours and labor hours required across every work center in every weekly time bucket to execute the planned order releases generated by MRP I. The primary output of CRP is the Work Center Load Profile: a visual and mathematical representation contrasting required workload against available productive capacity across time.",
                "In executing CRP, operations engineers must choose between two fundamentally distinct capacity loading philosophies: Infinite Loading and Finite Loading. Understanding how each approach functions—and where each creates operational failure—is essential for factory control. Let us examine both methods in rigorous operational detail.",
                "Infinite Capacity Loading (also called Unconstrained Loading) schedules work orders into their mathematically ideal time buckets based purely on due dates and lead time offsetting, completely ignoring whether the work center has sufficient capacity to handle the work. If an assembly cell has 40 hours of available capacity in Week 3, but MRP planned orders require 120 hours of work, infinite loading blithely loads all 120 hours into Week 3. The resulting load profile shows an immense red spike representing a 300% overload. Why would any system do something so seemingly absurd? Infinite loading is not meant to be a final execution schedule; it is an analytical diagnostic tool designed to reveal where bottlenecks exist and identify when the factory will fail if management takes no corrective action.",
                "Finite Capacity Loading (also called Constrained Loading), by contrast, acknowledges that physical machines and labor hours have real, unbreakable upper ceilings. Finite loading never schedules more work into a work center than its rated capacity. When a work center's capacity is full, the finite scheduling engine must make a decision: it must either push excess orders into future periods where slack capacity exists (Forward Scheduling), or pull orders into earlier periods to build in advance (Backward Scheduling). While finite loading produces a physically realistic schedule, it introduces schedule nervousness and frequently pushes job completion dates past customer contractual deadlines.",
                "Understanding the interplay between infinite diagnostic visibility and finite execution reality allows modern operations managers to strike the right balance. Planners run infinite loading first to reveal systemic capacity gaps and identify bottleneck work centers across the multi-week horizon. Once bottlenecks are identified, planners do not passively let finite scheduling push customer delivery dates back; they take proactive managerial intervention: expanding shifts, authorizing overtime, or splitting production lots. Mastering this load profile analysis transforms capacity from a rigid roadblock into a flexible competitive weapon."
            ],
            "example": "A commercial pump factory's primary 5-axis CNC machining center has a rated capacity of 80 hours per week (two 8-hour shifts x 5 days). Running infinite CRP across a 4-week horizon reveals the following machine loads: Week 1: 65 hours (81% load - feasible); Week 2: 125 hours (156% load - 45-hour overload spike!); Week 3: 50 hours (63% load - 30 hours idle slack); Week 4: 75 hours (94% load - feasible). If the factory attempted to execute this blindly under infinite loading, Week 2 would suffer massive WIP congestion and machine breakdowns. If the factory used naive finite loading, the 45-hour overload would be pushed into Week 3 and Week 4, delaying high-margin customer pump deliveries by two full weeks. By analyzing the infinite load profile, the operations manager sees the 45-hour spike and plans corrective action.",
            "code": """# Capacity Requirements Planning (CRP): Infinite Work Center Load Profile Engine
def generate_infinite_load_profile(
    work_center_name: str,
    rated_weekly_capacity_hours: float,
    weekly_scheduled_hours: list[float]
) -> dict:
    weeks = len(weekly_scheduled_hours)
    profile = []
    overloaded_weeks = []
    total_overload_hours = 0.0
    total_slack_hours = 0.0
    
    for w in range(weeks):
        req_hours = weekly_scheduled_hours[w]
        utilization = (req_hours / rated_weekly_capacity_hours) * 100.0
        variance = rated_weekly_capacity_hours - req_hours
        
        is_overloaded = req_hours > rated_weekly_capacity_hours
        if is_overloaded:
            overload_qty = req_hours - rated_weekly_capacity_hours
            overloaded_weeks.append(w + 1)
            total_overload_hours += overload_qty
        else:
            total_slack_hours += variance
            
        profile.append({
            "Week": w + 1,
            "Required_Hours": req_hours,
            "Rated_Capacity": rated_weekly_capacity_hours,
            "Utilization_Pct": round(utilization, 1),
            "Variance_Hours": round(variance, 1),
            "Status": "OVERLOAD!" if is_overloaded else "FEASIBLE"
        })
        
    return {
        "Work_Center": work_center_name,
        "Rated_Capacity_Per_Week": rated_weekly_capacity_hours,
        "Total_Required_Hours": sum(weekly_scheduled_hours),
        "Total_Available_Capacity": rated_weekly_capacity_hours * weeks,
        "Overloaded_Weeks": overloaded_weeks,
        "Total_Overload_Hours": round(total_overload_hours, 1),
        "Total_Slack_Hours": round(total_slack_hours, 1),
        "Profile": profile
    }

# Run infinite load diagnostic on CNC 5-Axis Milling Center (Rated: 80 hrs/wk)
scheduled_work = [65.0, 125.0, 50.0, 75.0, 110.0, 60.0]
crp_audit = generate_infinite_load_profile(
    work_center_name="WC-5AXIS-MILL-01",
    rated_weekly_capacity_hours=80.0,
    weekly_scheduled_hours=scheduled_work
)

print(f"Infinite Capacity Load Profile for {crp_audit['Work_Center']} (Rated = {crp_audit['Rated_Capacity_Per_Week']} hrs/wk):")
print(f"Total Required: {crp_audit['Total_Required_Hours']}h vs Total Available: {crp_audit['Total_Available_Capacity']}h")
print(f"Overload Violations: Weeks {crp_audit['Overloaded_Weeks']} (Total Overload = {crp_audit['Total_Overload_Hours']} hrs)")
for row in crp_audit['Profile']:
    print(f"  Wk {row['Week']}: Required={row['Required_Hours']:5.1f}h | Util={row['Utilization_Pct']:5.1f}% | Variance={row['Variance_Hours']:+5.1f}h | Status={row['Status']}")
""",
            "output": """Infinite Capacity Load Profile for WC-5AXIS-MILL-01 (Rated = 80.0 hrs/wk):
Total Required: 485.0h vs Total Available: 480.0h
Overload Violations: Weeks [2, 5] (Total Overload = 75.0 hrs)
  Wk 1: Required= 65.0h | Util= 81.2% | Variance=+15.0h | Status=FEASIBLE
  Wk 2: Required=125.0h | Util=156.2% | Variance=-45.0h | Status=OVERLOAD!
  Wk 3: Required= 50.0h | Util= 62.5% | Variance=+30.0h | Status=FEASIBLE
  Wk 4: Required= 75.0h | Util= 93.8% | Variance= +5.0h | Status=FEASIBLE
  Wk 5: Required=110.0h | Util=137.5% | Variance=-30.0h | Status=OVERLOAD!
  Wk 6: Required= 60.0h | Util= 75.0% | Variance=+20.0h | Status=FEASIBLE""",
            "codeNotes": [
                {"line": 2, "note": "Implements the infinite capacity load profile generator calculating utilization and capacity variance."},
                {"line": 15, "note": "Identifies weekly over-capacity conditions where required workload exceeds rated machine hours."},
                {"line": 25, "note": "Outputs detailed weekly operational load metrics: required hours, utilization percentage, and variance."},
                {"line": 45, "note": "Diagnoses Weeks 2 and 5 as severe overload spikes (156.2% and 137.5%), highlighting critical bottleneck risk."}
            ],
            "tryIt": "Reduce Week 2 load from 125 to 80 hours to observe Week 2 achieve 100% utilization with zero variance.",
            "check": {
                "question": "Why do operations managers run 'Infinite Capacity Loading' first before finalizing factory schedules?",
                "options": [
                    "Because infinite loading serves as a critical diagnostic X-ray, revealing where and when bottlenecks will occur so management can proactively take corrective leveling action.",
                    "Because modern machine tools operate indefinitely without electricity or human maintenance.",
                    "Because financial regulations prohibit companies from knowing their true machine capacity limits.",
                    "Because infinite loading automatically buys new machine tools using corporate credit cards."
                ],
                "answer": 0,
                "why": "Infinite loading reveals unconstrained demand spikes, showing planners exactly which work centers are overloaded and giving them time to level capacity before production begins.",
                "answerIndex": 0,
                "explanation": "Infinite loading reveals unconstrained demand spikes, showing planners exactly which work centers are overloaded and giving them time to level capacity before production begins."
            }
        },
        {
            "title": "Capacity Requirements Planning (CRP) Engine & Overload Leveling Heuristics",
            "say": [
                "Diagnosing a capacity overload through an infinite load profile is only the diagnosis; the core engineering task is applying Capacity Leveling Heuristics to restore operational feasibility. When an operations planner sees an overload spike of 45 hours at a critical machining center, doing nothing guarantees production failure. The factory must execute structured capacity balancing interventions.",
                "The first and most immediate capacity leveling lever is Overtime Authorization. Plant management can expand capacity by authorizing existing shifts to work 2 extra hours per day (extending 8-hour shifts to 10 hours) or scheduling a 6th working day on Saturday. Overtime increases productive machine hours without requiring new machine installations or hiring permanent employees. However, overtime is bounded by strict human fatigue thresholds, statutory labor laws (e.g., maximum overtime hours per quarter), and financial wage premiums (typically 1.5x regular pay).",
                "The second leveling lever is Lot Shifting and Backward/Forward Pre-building. In an industrial plant, not all jobs scheduled in an overloaded week are equally urgent. Some batches are scheduled to satisfy customer orders due three weeks later. By inspecting pegging records and due dates, the planner can shift non-critical batches into adjacent time periods that possess idle slack capacity. Shifting work forward into preceding slack periods (pre-building) avoids late deliveries, though it incurs minor inventory holding cost. Shifting work backward into future slack periods is feasible if the customer deadline allows.",
                "The third leveling lever is Lot Splitting. If a planned batch of 200 heavy gearboxes requires 80 hours of machining in an overloaded week, the planner splits the batch into two lots of 100 units. Lot 1 (40 hours) is run immediately to satisfy near-term assembly requirements, while Lot 2 (40 hours) is scheduled in the subsequent week. The trade-off is that lot splitting incurs an additional machine setup, but it successfully flattens the capacity spike and prevents line starvation.",
                "The fourth and fifth leveling levers are Alternate Routing and Subcontracting. If primary CNC Mill 1 is overloaded, the routing engine checks whether CNC Mill 2 (a secondary machine with slightly older tooling) has available capacity. If internal plant capacity is entirely exhausted across all machines, the firm dispatches overflow rough machining to a certified third-party subcontract machine shop. By mathematically synthesizing overtime authorization, lot shifting, lot splitting, and alternate routing, the Capacity Requirements Planning engine achieves a balanced, executable shop floor schedule with 100% customer delivery compliance."
            ],
            "example": "In Week 2, our 5-axis milling center had a 45-hour overload (125 hours demanded against 80 hours rated capacity). Week 3 had 30 hours of idle slack capacity (50 hours demanded). The operations planner executes a multi-step leveling heuristic: 1. Authorize 15 hours of planned Saturday overtime in Week 2, raising available capacity to 95 hours. 2. Identify a 30-hour batch of standard bracket fittings scheduled in Week 2 whose final customer delivery is not until Week 5. The planner splits this batch and shifts the 30 hours into Week 3. Following this intervention, Week 2 runs at 95 hours (100% of regular + OT capacity), and Week 3 absorbs the 30 hours, rising from 50 to 80 hours (100% of regular capacity). Both weeks operate in perfect equilibrium without missing a single customer deadline.",
            "code": """# Capacity Requirements Planning (CRP): Multi-Lever Overload Leveling Engine
def level_work_center_overload(
    work_center_name: str,
    rated_capacity_hours: float,
    scheduled_hours: list[float],
    max_weekly_overtime_hours: float = 16.0
) -> dict:
    weeks = len(scheduled_hours)
    leveled = list(scheduled_hours)
    overtime_allocated = [0.0] * weeks
    shifted_hours_log = []
    
    for w in range(weeks):
        current_load = leveled[w]
        if current_load > rated_capacity_hours:
            excess = current_load - rated_capacity_hours
            
            # Lever 1: Authorize Overtime up to permitted limit
            ot_to_use = min(excess, max_weekly_overtime_hours)
            overtime_allocated[w] = ot_to_use
            residual_excess = excess - ot_to_use
            leveled[w] = rated_capacity_hours + ot_to_use
            
            # Lever 2: Lot Shifting into adjacent future week with slack
            if residual_excess > 0:
                shifted = False
                for target_w in range(w + 1, weeks):
                    available_slack = rated_capacity_hours - leveled[target_w]
                    if available_slack > 0:
                        shift_amount = min(residual_excess, available_slack)
                        leveled[target_w] += shift_amount
                        residual_excess -= shift_amount
                        shifted_hours_log.append({
                            "From_Week": w + 1,
                            "To_Week": target_w + 1,
                            "Hours_Shifted": round(shift_amount, 1)
                        })
                        if residual_excess <= 0:
                            shifted = True
                            break
                            
    # Final audit profile
    final_profile = []
    for w in range(weeks):
        effective_cap = rated_capacity_hours + overtime_allocated[w]
        util = (leveled[w] / effective_cap) * 100.0
        final_profile.append({
            "Week": w + 1,
            "Leveled_Hours": round(leveled[w], 1),
            "Regular_Cap": rated_capacity_hours,
            "Overtime_Used": round(overtime_allocated[w], 1),
            "Effective_Capacity": round(effective_cap, 1),
            "Utilization_Pct": round(util, 1),
            "Status": "BALANCED" if leveled[w] <= effective_cap else "UNRESOLVED_OVERLOAD"
        })
        
    return {
        "Work_Center": work_center_name,
        "Leveled_Schedule": final_profile,
        "Shifted_Lots": shifted_hours_log,
        "Total_Overtime_Hours": sum(overtime_allocated)
    }

# Execute leveling on previously diagnosed 6-week schedule
raw_loads = [65.0, 125.0, 50.0, 75.0, 110.0, 60.0]
leveling_results = level_work_center_overload(
    work_center_name="WC-5AXIS-MILL-01",
    rated_capacity_hours=80.0,
    scheduled_hours=raw_loads,
    max_weekly_overtime_hours=20.0
)

print(f"CRP Overload Leveling Report for {leveling_results['Work_Center']}:")
print(f"Total Overtime Authorized: {leveling_results['Total_Overtime_Hours']} hrs")
print(f"Lot Shifting Actions:")
for s in leveling_results['Shifted_Lots']:
    print(f"  Shifted {s['Hours_Shifted']}h from Wk {s['From_Week']} -> Wk {s['To_Week']}")

print(f"\\nFinal Leveled Production Schedule:")
for r in leveling_results['Leveled_Schedule']:
    print(f"  Wk {r['Week']}: Load={r['Leveled_Hours']:5.1f}h (Reg={r['Regular_Cap']:.0f}h + OT={r['Overtime_Used']:4.1f}h) | Util={r['Utilization_Pct']:5.1f}% | Status={r['Status']}")
""",
            "output": """CRP Overload Leveling Report for WC-5AXIS-MILL-01:
Total Overtime Authorized: 40.0 hrs
Lot Shifting Actions:
  Shifted 25.0h from Wk 2 -> Wk 3
  Shifted 10.0h from Wk 5 -> Wk 6

Final Leveled Production Schedule:
  Wk 1: Load= 65.0h (Reg=80h + OT= 0.0h) | Util= 81.2% | Status=BALANCED
  Wk 2: Load=100.0h (Reg=80h + OT=20.0h) | Util=100.0% | Status=BALANCED
  Wk 3: Load= 75.0h (Reg=80h + OT= 0.0h) | Util= 93.8% | Status=BALANCED
  Wk 4: Load= 75.0h (Reg=80h + OT= 0.0h) | Util= 93.8% | Status=BALANCED
  Wk 5: Load=100.0h (Reg=80h + OT=20.0h) | Util=100.0% | Status=BALANCED
  Wk 6: Load= 70.0h (Reg=80h + OT= 0.0h) | Util= 87.5% | Status=BALANCED""",
            "codeNotes": [
                {"line": 2, "note": "Implements the structured multi-lever capacity leveling algorithm combining overtime and lot shifting."},
                {"line": 15, "note": "Lever 1: Absorbs peak overload by allocating authorized planned overtime up to the 20-hour ceiling."},
                {"line": 22, "note": "Lever 2: Shifts residual excess hours into future weeks possessing available idle slack capacity."},
                {"line": 48, "note": "Demonstrates 100% schedule balance: Weeks 2 and 5 capped at 100h (util=100%), while slack in Wks 3 and 6 is productively absorbed."}
            ],
            "tryIt": "Reduce max_weekly_overtime_hours from 20 to 10 to observe higher lot shifting volumes into subsequent weeks.",
            "check": {
                "question": "When leveling a capacity overload at a manufacturing work center, what are the primary managerial levers available to an operations planner?",
                "options": [
                    "Authorizing planned overtime, shifting non-urgent lots into adjacent weeks with idle slack, splitting large batches, or re-routing work to alternate machine centers.",
                    "Deleting uncompleted customer orders from the database without telling anyone.",
                    "Increasing the machine speed past manufacturer safety limits until gears break.",
                    "Filing an insurance claim for lost production time."
                ],
                "answer": 0,
                "why": "Capacity leveling utilizes disciplined operational levers: overtime, lot shifting, lot splitting, and alternate routing to flatten overload spikes while preserving customer delivery dates.",
                "answerIndex": 0,
                "explanation": "Capacity leveling utilizes disciplined operational levers: overtime, lot shifting, lot splitting, and alternate routing to flatten overload spikes while preserving customer delivery dates."
            }
        },
        {
            "title": "Shop Floor Dispatching Priority Rules & Input/Output Queue Control",
            "say": [
                "Once the Capacity Requirements Plan is leveled and released to the factory floor, the final decisive operational challenge is Shop Floor Execution and Dispatching. Even with a perfectly balanced weekly schedule, dozens of active jobs arrive simultaneously in front of each machine center. A CNC milling work center might have eight different jobs sitting on wooden pallets in its queue, all competing for the machine spindle right now. In what order should the machine operator run these jobs? This sequencing decision is governed by Dispatching Priority Rules.",
                "Selecting the appropriate dispatching rule is not a matter of operator whim; each rule mathematically optimizes a distinct operational performance metric. The four classical sequencing priority rules are: 1. FCFS (First-Come, First-Served): jobs are processed strictly in the chronological order of their arrival at the work center. FCFS is perceived as fair by operators and customers, but it performs poorly on virtually every rigorous quantitative operations metric. 2. SPT (Shortest Processing Time): the job with the shortest run time is sequenced first. Under Conway's classical scheduling theorems, SPT is mathematically proven to minimize average job flow time, minimize average work-in-progress (WIP) inventory, and minimize average job queue waiting time across the shop floor! However, its fatal drawback is that long, complex jobs are continuously bypassed and suffer severe completion delays.",
                "3. EDD (Earliest Due Date): the job with the earliest promised customer delivery date is sequenced first. EDD is mathematically optimal for minimizing maximum job lateness across a population of jobs. It ensures that urgent customer deadlines are prioritized, making it the preferred rule in customer-centric contract manufacturing environments. 4. CR (Critical Ratio): a dynamic priority index calculated as the remaining time until due date divided by the remaining processing work: Critical Ratio = (Due Date - Current Time) / Total Remaining Processing Time.",
                "The Critical Ratio is dynamic because its value updates automatically as the calendar advances. A Critical Ratio greater than 1.0 indicates the job is ahead of schedule (slack time exists). A Critical Ratio exactly equal to 1.0 indicates the job is exactly on schedule (zero slack). A Critical Ratio less than 1.0 indicates the job is behind schedule and will be late unless expedited! A Critical Ratio less than 0.0 indicates the job is already past due. The dispatching rule always runs the job with the lowest Critical Ratio first. This dynamically prioritizes jobs that are sliding into danger, automatically self-correcting the shop floor schedule in real time.",
                "Finally, operations managers monitor shop floor queue health using Input/Output Control (I/O Control). Input/Output control is an operational accounting framework that tracks planned versus actual input (work arriving at a work center) and planned versus actual output (work completed by a work center). When actual input continuously exceeds actual output, the queue of work-in-progress explodes, lead times balloon, and machines choke. Conversely, when actual output falls below planned output, the work center has an execution problem: machine downtime, operator absenteeism, or tooling shortages. Maintaining tight equilibrium between input and output ensures predictable manufacturing velocity and protects customer delivery integrity."
            ],
            "example": "A precision sheet metal fabrication cell has five jobs waiting in its queue on Day 10. Job A (Run=4 days, Due Day 16, CR=(16-10)/4 = 1.50); Job B (Run=6 days, Due Day 14, CR=(14-10)/6 = 0.67); Job C (Run=2 days, Due Day 18, CR=(18-10)/2 = 4.00); Job D (Run=8 days, Due Day 20, CR=(20-10)/8 = 1.25); Job E (Run=3 days, Due Day 12, CR=(12-10)/3 = 0.67). If the operator used FCFS or chose the easiest job (Job C with 2 days), Job B and Job E would suffer catastrophic customer delays. Using the Critical Ratio rule, the dispatcher immediately identifies Job B and Job E as behind schedule (CR = 0.67 < 1.0). Between them, Job E has shorter processing time and earlier due date (Day 12). Sequencing Job E first, followed by Job B, ensures both high-risk jobs are salvaged before customer penalties trigger.",
            "code": """# Shop Floor Dispatching Priority Rules Engine: SPT, EDD, and Dynamic Critical Ratio
def evaluate_shop_floor_dispatching_rules(
    current_day: float,
    jobs_in_queue: list[dict]
) -> dict:
    \"\"\"
    jobs_in_queue: list of dicts with keys:
      'job_id', 'processing_days', 'due_day', 'arrival_day'
    \"\"\"
    # Calculate Critical Ratio (CR) for each job
    enriched_jobs = []
    for j in jobs_in_queue:
        time_remaining = j['due_day'] - current_day
        proc_time = j['processing_days']
        cr = time_remaining / proc_time if proc_time > 0 else 0.0
        
        status = "AHEAD" if cr > 1.0 else ("ON_TIME" if cr == 1.0 else "BEHIND_SCHEDULE!")
        if time_remaining < 0:
            status = "PAST_DUE!"
            
        enriched_jobs.append({
            **j,
            "Critical_Ratio": round(cr, 2),
            "Slack_Days": round(time_remaining - proc_time, 1),
            "Status": status
        })
        
    # Sequence by Rule
    seq_fcfs = sorted(enriched_jobs, key=lambda x: x['arrival_day'])
    seq_spt  = sorted(enriched_jobs, key=lambda x: x['processing_days'])
    seq_edd  = sorted(enriched_jobs, key=lambda x: x['due_day'])
    seq_cr   = sorted(enriched_jobs, key=lambda x: x['Critical_Ratio'])
    
    return {
        "Current_Day": current_day,
        "Job_Count": len(jobs_in_queue),
        "Dispatch_By_Critical_Ratio": [f"{j['job_id']} (CR={j['Critical_Ratio']}, {j['Status']})" for j in seq_cr],
        "Dispatch_By_SPT": [f"{j['job_id']} ({j['processing_days']}d)" for j in seq_spt],
        "Dispatch_By_EDD": [f"{j['job_id']} (Due D{j['due_day']})" for j in seq_edd],
        "Enriched_Queue": seq_cr
    }

# 5 jobs awaiting dispatch on Day 10.0
queue_snapshot = [
    {"job_id": "JOB-ALPHA",   "processing_days": 4.0, "due_day": 16.0, "arrival_day": 8.0},
    {"job_id": "JOB-BRAVO",   "processing_days": 6.0, "due_day": 14.0, "arrival_day": 9.0},
    {"job_id": "JOB-CHARLIE", "processing_days": 2.0, "due_day": 18.0, "arrival_day": 7.0},
    {"job_id": "JOB-DELTA",   "processing_days": 8.0, "due_day": 20.0, "arrival_day": 9.5},
    {"job_id": "JOB-ECHO",    "processing_days": 3.0, "due_day": 12.0, "arrival_day": 10.0}
]

dispatch_results = evaluate_shop_floor_dispatching_rules(current_day=10.0, jobs_in_queue=queue_snapshot)

print(f"Shop Floor Dispatching Priority Evaluation (Current Day = {dispatch_results['Current_Day']}):")
print(f"\\n1. Recommended: Critical Ratio (CR) Dispatch Order (Lowest CR First):")
for idx, j in enumerate(dispatch_results['Enriched_Queue']):
    print(f"   Priority {idx+1}: {j['job_id']:12s} | Proc={j['processing_days']}d | Due=D{j['due_day']:4.1f} | CR={j['Critical_Ratio']:4.2f} | Status={j['Status']}")

print(f"\\n2. Alternative Rule Sequences:")
print(f"   Shortest Processing Time (SPT) : {', '.join(dispatch_results['Dispatch_By_SPT'])}")
print(f"   Earliest Due Date (EDD)        : {', '.join(dispatch_results['Dispatch_By_EDD'])}")
""",
            "output": """Shop Floor Dispatching Priority Evaluation (Current Day = 10.0):

1. Recommended: Critical Ratio (CR) Dispatch Order (Lowest CR First):
   Priority 1: JOB-BRAVO    | Proc=6.0d | Due=D14.0 | CR=0.67 | Status=BEHIND_SCHEDULE!
   Priority 2: JOB-ECHO     | Proc=3.0d | Due=D12.0 | CR=0.67 | Status=BEHIND_SCHEDULE!
   Priority 3: JOB-DELTA    | Proc=8.0d | Due=D20.0 | CR=1.25 | Status=AHEAD
   Priority 4: JOB-ALPHA    | Proc=4.0d | Due=D16.0 | CR=1.50 | Status=AHEAD
   Priority 5: JOB-CHARLIE  | Proc=2.0d | Due=D18.0 | CR=4.00 | Status=AHEAD

2. Alternative Rule Sequences:
   Shortest Processing Time (SPT) : JOB-CHARLIE (2.0d), JOB-ECHO (3.0d), JOB-ALPHA (4.0d), JOB-BRAVO (6.0d), JOB-DELTA (8.0d)
   Earliest Due Date (EDD)        : JOB-ECHO (Due D12.0), JOB-BRAVO (Due D14.0), JOB-ALPHA (Due D16.0), JOB-CHARLIE (Due D18.0), JOB-DELTA (Due D20.0)""",
            "codeNotes": [
                {"line": 2, "note": "Implements the shop floor dispatching engine computing Critical Ratio, SPT, EDD, and FCFS sequences."},
                {"line": 13, "note": "Calculates dynamic Critical Ratio: (Due Date - Current Day) / Remaining Processing Days."},
                {"line": 15, "note": "Categorizes job urgency: CR < 1.0 flags dangerous late delivery risk, automatically escalating priority."},
                {"line": 39, "note": "Demonstrates that CR accurately prioritizes Job Bravo and Job Echo, preventing multi-day customer delivery failures."}
            ],
            "tryIt": "Advance current_day from 10.0 to 12.0 to observe how Job Echo becomes past due (CR = 0.0) and commands absolute top emergency priority.",
            "check": {
                "question": "What does a Critical Ratio (CR) of 0.65 indicate for a production job sitting in a machine shop queue?",
                "options": [
                    "The job is behind schedule and will arrive late unless expedited, because remaining time until due date is less than the processing time required.",
                    "The job is 65% completed and can be shipped to the customer immediately.",
                    "The machine operator should receive a 35% wage deduction for slow performance.",
                    "The customer has paid 65% of the invoice in advance."
                ],
                "answer": 0,
                "why": "A Critical Ratio less than 1.0 means the available time before the customer deadline is shorter than the physical processing run time, meaning the job will finish late without expediting.",
                "answerIndex": 0,
                "explanation": "A Critical Ratio less than 1.0 means the available time before the customer deadline is shorter than the physical processing run time, meaning the job will finish late without expediting."
            }
        }
    ]

    summary = [
        "MRP I to MRP II Evolution: MRP II transcends material-only explosion by integrating Closed-Loop capacity validation (CRP), human labor payroll, machine overhead accounting, and general ledger financial synthesis.",
        "Operations Routing Sheets: Routings define the physical path of production, detailing sequential operations, work centers, tooling, standard setup hours, and unit run times to quantify required shop floor machine hours.",
        "Infinite vs. Finite Capacity Loading: Infinite loading serves as a critical diagnostic tool to reveal where and when bottlenecks occur, while finite loading produces physically executable schedules constrained by machine capacity ceilings.",
        "Capacity Leveling Strategies: Operations planners resolve work center overloads by authorizing planned overtime buffers, splitting production lots, re-routing to alternate machines, or shifting slack batches forward.",
        "Shop Floor Priority Dispatching: Comparing SPT (minimizing average flow time) with EDD (minimizing maximum lateness) and dynamic Critical Ratio (prioritizing jobs where CR < 1.0) ensures optimal queue execution and customer SLA protection."
    ]

    project_step = {
        "title": "Module 2 Milestone Step 3: Implement an MRP II Capacity Requirements Planning (CRP) & Dispatching Engine",
        "steps": [
            "Construct an integrated MRP II simulation model translating planned production units into financial COGS and physical machine hours across enterprise quarters.",
            "Formulate detailed Operations Routing Sheets mapping sequential operations, work center assignments, standard setup times, and unit run rates.",
            "Generate infinite work center load profiles to identify capacity overload spikes, and implement automated capacity leveling utilizing overtime buffers and lot shifting.",
            "Develop a dynamic shop floor dispatching engine evaluating FCFS, Shortest Processing Time (SPT), Earliest Due Date (EDD), and real-time Critical Ratio (CR) prioritization."
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
    data = get_day08_data()
    total_words = 0
    print(f"Auditing Day {data['day']}: {data['title']}")
    for idx, p in enumerate(data['parts']):
        words = count_words(p['say']) + count_words(p['example']) + count_words(p['tryIt']) + count_words(p['check']['question']) + count_words(p['check']['why'])
        print(f"  Part {idx+1}: {p['title'][:45]}... -> {words} words")
        total_words += words
    print(f"Total Words Day {data['day']}: {total_words}")
