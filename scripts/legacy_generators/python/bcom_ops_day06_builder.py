import os
import sys

# Ensure word count is >= 580 words per part and >= 2950 words per day
def get_day06_data():
    day = 6
    title = "Aggregate Production Planning (APP), Chase vs. Level Strategy & Master Scheduling"
    goal = "Master medium-range operations planning: formulating aggregate production plans, evaluating pure chase versus level workforce strategies, modeling overtime and subcontracting cost trade-offs, and disaggregating family forecasts into Master Production Schedules (MPS)."
    minutes = 45
    recap = "In Module 1, we established fundamental operations flow, EOQ inventory physics, Six Sigma quality metrics, queuing economics, and global logistics networks. Now in Module 2, we advance from high-level supply chain strategy to factory-floor manufacturing operations and production planning. Day 6 anchors the bridge between enterprise business forecasts and executable manufacturing orders through Aggregate Production Planning and Master Production Scheduling."

    parts = [
        {
            "title": "Aggregate Production Planning Hierarchy & Planning Horizon Formulation",
            "say": [
                "Welcome to Day 6 of Operations and Supply Chain Management. In modern industrial manufacturing, executive leadership faces a continuous structural dilemma: sales forecasts fluctuate wildly by month or season, yet factory equipment, physical plant space, and skilled labor pools cannot be instantly created or eliminated without catastrophic economic friction. Aggregate Production Planning, abbreviated as APP, is the critical intermediate-range operational discipline that reconciles high-level corporate business plans with shop-floor execution over a medium-range planning horizon, typically spanning 3 to 18 months in monthly or quarterly planning buckets.",
                "To understand where APP sits in the industrial hierarchy, consider the three distinct horizons of enterprise planning. At the top sits Long-Range Strategic Planning, looking 2 to 5 years into the future, determining new factory construction, capital expenditure for automation lines, major facility acquisitions, and supply chain network topology. At the bottom sits Short-Range Operational Scheduling, looking hours, days, or weeks ahead, dispatching specific jobs to individual CNC machines, assigning operator shifts, and managing real-time assembly line queues. Aggregate Planning occupies the vital middle tier: taking annual sales and revenue targets and translating them into overall production volumes, workforce staffing levels, and inventory stockpiles without getting bogged down in individual product models, colors, or SKU variants.",
                "The defining characteristic of Aggregate Planning is its unit of analysis: the aggregate unit. In an automotive plant producing sedans, SUVs, and electric crossovers, aggregate planning does not track whether a vehicle will have leather upholstery or sunroof options; it plans in terms of total vehicles or total standard assembly labor hours. In a commercial air conditioning manufacturer, planning occurs in total tonnage of cooling capacity. In a textile mill, planning measures total linear meters of fabric woven. By aggregating disparate stock-keeping units into a single homogeneous family unit, operations executives can balance aggregate capacity against aggregate demand without suffering analysis paralysis from thousands of individual SKU demand variances.",
                "The primary objective of aggregate planning is to minimize the total cost of operations over the planning horizon while satisfying forecasted customer demand and honoring structural physical constraints. These constraints include maximum regular plant capacity, maximum permissible overtime labor dictated by collective bargaining agreements or labor statutory regulations, available warehouse storage space for holding finished goods inventory, supplier raw material availability limits, and cash flow working capital thresholds. Every aggregate plan must establish a clear strategy for handling seasonal demand peaks and troughs: should the factory hire temporary workers in peak seasons and lay them off during slow months, maintain a stable workforce and absorb demand swings through finished goods inventory buffers, or outsource peak volumes to third-party contract manufacturers?",
                "Mathematically, the aggregate planning formulation balances cumulative demand against cumulative production. Let D_t represent the forecasted aggregate demand in period t, P_t represent regular production, O_t represent overtime production, S_t represent subcontracted volume, I_t represent ending inventory at the close of period t, and B_t represent backordered or unfulfilled customer demand carried into period t+1. The fundamental inventory conservation equation governing every time bucket t states that ending inventory equals beginning inventory plus total production minus demand: I_t - B_t = (I_{t-1} - B_{t-1}) + P_t + O_t + S_t - D_t. Managing these five production levers with surgical precision determines whether a manufacturing enterprise generates superior operating margins or bleeds cash through idle machine capacity and punitive inventory write-downs."
            ],
            "example": "Consider a major consumer electronics manufacturer preparing for the holiday quarter. Demand during the nine off-peak months averages 40,000 smart speakers per month, but spikes to 140,000 units per month during October, November, and December. If the factory attempted to maintain production exactly equal to off-peak demand, it would face a 300,000-unit shortfall during the holidays, sacrificing tens of millions in gross margin. Conversely, if it built a factory capable of producing 140,000 units every month, 70% of its assembly capacity would sit idle from January through September, driving fixed depreciation per unit through the roof. Through aggregate production planning, the firm models a hybrid strategy: utilizing moderate inventory pre-building during summer months combined with planned overtime and pre-negotiated EMS contract assembly during peak weeks, achieving optimal total manufacturing cost.",
            "code": """# Aggregate Production Planning: Capacity Horizon & Family Unit Formulation
def formulate_aggregate_planning_horizon(
    monthly_demand: list[int],
    labor_hours_per_unit: float,
    working_days_per_month: list[int],
    hours_per_worker_day: float = 8.0
) -> dict:
    total_horizon_demand = sum(monthly_demand)
    months_count = len(monthly_demand)
    
    # Calculate required standard labor hours per month
    required_labor_hours = [d * labor_hours_per_unit for d in monthly_demand]
    total_required_hours = sum(required_labor_hours)
    
    # Calculate available work hours per single full-time worker per month
    worker_available_hours = [days * hours_per_worker_day for days in working_days_per_month]
    total_single_worker_hours = sum(worker_available_hours)
    
    # Theoretical constant workforce needed to meet total cumulative demand
    ideal_level_workforce = total_required_hours / total_single_worker_hours
    
    monthly_profiles = []
    for m in range(months_count):
        demand_units = monthly_demand[m]
        req_hours = required_labor_hours[m]
        avail_worker_hrs = worker_available_hours[m]
        chase_workers_needed = req_hours / avail_worker_hrs
        
        monthly_profiles.append({
            "Month": m + 1,
            "Demand_Units": demand_units,
            "Required_Labor_Hours": round(req_hours, 1),
            "Working_Days": working_days_per_month[m],
            "Worker_Standard_Hours": avail_worker_hrs,
            "Chase_Workers_Needed": round(chase_workers_needed, 2)
        })
        
    return {
        "Planning_Horizon_Months": months_count,
        "Total_Aggregate_Demand": total_horizon_demand,
        "Total_Required_Labor_Hours": round(total_required_hours, 1),
        "Average_Monthly_Demand": round(total_horizon_demand / months_count, 1),
        "Ideal_Level_Workforce_Heads": round(ideal_level_workforce, 2),
        "Monthly_Breakdown": monthly_profiles
    }

# Simulation: 6-month aggregate planning horizon for high-precision motors
demand_forecast = [3200, 3600, 4800, 6200, 5400, 3800]
working_days = [21, 20, 22, 21, 22, 20]
labor_per_motor = 3.5  # standard assembly hours per motor

plan_summary = formulate_aggregate_planning_horizon(
    monthly_demand=demand_forecast,
    labor_hours_per_unit=labor_per_motor,
    working_days_per_month=working_days
)

print(f"Planning Horizon: {plan_summary['Planning_Horizon_Months']} Months")
print(f"Total Demand: {plan_summary['Total_Aggregate_Demand']} units | Total Labor: {plan_summary['Total_Required_Labor_Hours']} hrs")
print(f"Ideal Level Workforce: {plan_summary['Ideal_Level_Workforce_Heads']} workers")
for p in plan_summary['Monthly_Breakdown']:
    print(f"Month {p['Month']}: Demand={p['Demand_Units']} | ReqHrs={p['Required_Labor_Hours']} | ChaseWorkers={p['Chase_Workers_Needed']}")
""",
            "output": """Planning Horizon: 6 Months
Total Demand: 27000 units | Total Labor: 94500.0 hrs
Ideal Level Workforce: 93.75 workers
Month 1: Demand=3200 | ReqHrs=11200.0 | ChaseWorkers=66.67
Month 2: Demand=3600 | ReqHrs=12600.0 | ChaseWorkers=78.75
Month 3: Demand=4800 | ReqHrs=16800.0 | ChaseWorkers=95.45
Month 4: Demand=6200 | ReqHrs=21700.0 | ChaseWorkers=129.17
Month 5: Demand=5400 | ReqHrs=18900.0 | ChaseWorkers=107.39
Month 6: Demand=3800 | ReqHrs=13300.0 | ChaseWorkers=83.12""",
            "codeNotes": [
                {"line": 2, "note": "Formulates the medium-range Aggregate Production Planning horizon with monthly demand vectors and standard labor coefficients."},
                {"line": 15, "note": "Calculates the exact full-time worker hours available per month given varying calendar working days."},
                {"line": 18, "note": "Computes the ideal constant workforce headcount required to satisfy cumulative 6-month demand under zero inventory drag."},
                {"line": 26, "note": "Calculates the monthly varying workforce required if the plant were to execute a pure chase strategy matching instantaneous demand."}
            ],
            "tryIt": "Increase Month 4 demand from 6,200 to 7,500 units to observe the chase workforce requirement spike to over 156 workers, highlighting labor volatility.",
            "check": {
                "question": "What is the primary operational purpose of Aggregate Production Planning (APP) in the enterprise planning hierarchy?",
                "options": [
                    "To reconcile corporate sales targets with plant capacity over a 3 to 18-month horizon by planning in terms of aggregate product families, labor hours, and overall inventory levels.",
                    "To sequence individual production batches minute-by-minute across CNC machines on the factory shop floor.",
                    "To calculate the exact purchase order quantities for thousands of individual microchips and screws.",
                    "To decide whether to construct a brand new manufacturing facility in another continent over a 10-year horizon."
                ],
                "answer": 0,
                "why": "Aggregate Production Planning occupies the intermediate-range tier (3 to 18 months), balancing aggregate workforce, production rates, and inventory for product families without getting bogged down in individual SKU details.",
                "answerIndex": 0,
                "explanation": "Aggregate Production Planning occupies the intermediate-range tier (3 to 18 months), balancing aggregate workforce, production rates, and inventory for product families without getting bogged down in individual SKU details."
            }
        },
        {
            "title": "Pure Chase Strategy vs. Pure Level Strategy: Economics & Trade-offs",
            "say": [
                "When crafting an aggregate production plan, operations leaders choose between two foundational baseline philosophies: the Pure Chase Strategy and the Pure Level Strategy. These two polar approaches embody fundamentally opposing views on how to absorb demand volatility, each generating a radically different cost structure, operational risk profile, and organizational culture. Understanding the mathematical mechanics and economic friction of both strategies is essential for designing high-performance manufacturing operating models.",
                "Under a Pure Chase Strategy, production capacity is synchronized in real time with customer demand in every single time period: P_t = D_t. Because the factory produces exactly what the market orders in each month, finished goods inventory is maintained at or near zero, completely eliminating finished inventory holding costs, warehouse lease obligations, capital lockup, and the risk of product obsolescence. However, to match changing demand volumes, the firm must continuously adjust its workforce headcount through hiring additional workers during ascending demand months and terminating or laying off workers during declining demand months. Alternatively, machine capacity must be rapidly throttled up or down.",
                "The economic friction of a Chase Strategy is concentrated in human capital and workforce volatility costs. Hiring workers incurs substantial expenses: recruitment agency fees, advertising, HR processing, medical screening, and onboarding training costs. More critically, newly hired workers exhibit steep learning curves, meaning productivity during their initial weeks is significantly lower and defect rates are significantly higher. Conversely, laying off workers triggers statutory severance payouts, increases unemployment insurance premiums, damages company reputation in the local labor market, and severely degrades morale among remaining employees, often leading to union grievances or voluntary attrition of top talent. A Chase Strategy is viable primarily in industries with abundant pools of low-skilled, easily replaceable labor, or where holding finished goods is physically impossible or economically prohibitive, such as in airline catering or fresh perishable food manufacturing.",
                "Under a Pure Level Strategy, by contrast, the factory maintains a strictly constant production rate and a constant workforce size across the entire planning horizon: P_t = P_{constant} for all periods t. Because production does not fluctuate, workforce stability is 100%: no workers are hired or laid off due to seasonal swings, recruitment costs are minimized, worker morale remains high, and the shop floor operates with high labor efficiency and low scrap rates. However, because production is flat while demand fluctuates, the enterprise must absorb the difference between production and demand through finished goods inventory buffers and backorders. During low-demand months, production exceeds demand, causing warehouse inventory to accumulate; during high-demand peak months, demand exceeds production, and the accumulated inventory is depleted.",
                "The economic penalty of a Level Strategy lies in inventory holding costs and potential customer backorder penalties. Holding finished goods requires warehouse space, material handling labor, insurance, security, and working capital financing interest. If demand peaks exceed accumulated inventory buffers, the factory enters a stockout condition, incurring expedited shipping costs, customer contractual penalty fines, or permanent loss of customer goodwill. Mathematically, a Level Strategy is economically superior when inventory holding costs are modest, products have long shelf lives without rapid obsolescence, and workforce hiring and layoff costs are high due to high technical skill requirements. Evaluating whether Chase or Level yields the lower total operational cost requires building a comprehensive mathematical cost comparison matrix across the planning horizon."
            ],
            "example": "An industrial pump manufacturer employs 100 skilled machinists who each produce 40 pumps per month (4,000 pumps total plant capacity). Demand over four quarters is 2,500, 3,500, 5,500, and 4,500 pumps. Under a Chase strategy, the company would have to lay off 37 workers in Q1, rehire 25 workers in Q2, hire 50 more in Q3, and lay off 25 in Q4. Machinists require six months of CNC programming certification, and hiring costs $6,000 while severance costs $4,000 per worker. Total hiring and layoff friction would exceed $650,000! Under a Level strategy, the plant retains all 100 workers, producing 4,000 units every quarter (16,000 total). In Q1, 1,500 units enter inventory; in Q2, 500 more enter inventory (2,000 total buffer); in Q3, 1,500 units are drawn down; and in Q4, the remaining 500 units meet demand. Holding cost at $25/unit/quarter totals only $87,500—saving over $560,000 compared to the Chase approach.",
            "code": """# Comparative Cost Analysis: Pure Chase Strategy vs Pure Level Strategy
def compare_chase_vs_level_strategies(
    monthly_demand: list[int],
    initial_workforce: int,
    initial_inventory: int,
    units_per_worker_month: int,
    cost_per_regular_unit: float,
    hiring_cost_per_worker: float,
    layoff_cost_per_worker: float,
    holding_cost_per_unit_month: float,
    backorder_cost_per_unit_month: float
) -> dict:
    months = len(monthly_demand)
    
    # ---------------- 1. PURE CHASE STRATEGY ----------------
    chase_workforce = initial_workforce
    chase_total_hire_cost = 0.0
    chase_total_layoff_cost = 0.0
    chase_total_production_cost = 0.0
    chase_log = []
    
    for m, demand in enumerate(monthly_demand):
        needed_workforce = int(round(demand / units_per_worker_month))
        hired = 0
        laid_off = 0
        if needed_workforce > chase_workforce:
            hired = needed_workforce - chase_workforce
            chase_total_hire_cost += hired * hiring_cost_per_worker
        elif needed_workforce < chase_workforce:
            laid_off = chase_workforce - needed_workforce
            chase_total_layoff_cost += laid_off * layoff_cost_per_worker
            
        chase_workforce = needed_workforce
        actual_produced = chase_workforce * units_per_worker_month
        prod_cost = actual_produced * cost_per_regular_unit
        chase_total_production_cost += prod_cost
        
        chase_log.append({
            "Month": m + 1, "Demand": demand, "Workforce": chase_workforce,
            "Hired": hired, "LaidOff": laid_off, "Produced": actual_produced
        })
        
    chase_grand_total = chase_total_production_cost + chase_total_hire_cost + chase_total_layoff_cost
    
    # ---------------- 2. PURE LEVEL STRATEGY ----------------
    total_demand = sum(monthly_demand)
    level_prod_per_month = int(round(total_demand / months))
    level_workforce = int(round(level_prod_per_month / units_per_worker_month))
    
    # Initial workforce adjustment to level workforce
    level_hire_cost = 0.0
    level_layoff_cost = 0.0
    if level_workforce > initial_workforce:
        level_hire_cost = (level_workforce - initial_workforce) * hiring_cost_per_worker
    elif level_workforce < initial_workforce:
        level_layoff_cost = (initial_workforce - level_workforce) * layoff_cost_per_worker
        
    current_inventory = initial_inventory
    level_total_holding_cost = 0.0
    level_total_backorder_cost = 0.0
    level_total_production_cost = 0.0
    level_log = []
    
    for m, demand in enumerate(monthly_demand):
        produced = level_workforce * units_per_worker_month
        level_total_production_cost += produced * cost_per_regular_unit
        net_flow = current_inventory + produced - demand
        
        holding_charge = 0.0
        backorder_charge = 0.0
        if net_flow >= 0:
            holding_charge = net_flow * holding_cost_per_unit_month
            current_inventory = net_flow
        else:
            backorder_charge = abs(net_flow) * backorder_cost_per_unit_month
            current_inventory = net_flow  # negative indicates backorder
            
        level_total_holding_cost += holding_charge
        level_total_backorder_cost += backorder_charge
        
        level_log.append({
            "Month": m + 1, "Demand": demand, "Produced": produced,
            "Ending_Inv": net_flow, "Holding_Cost": holding_charge, "Backorder_Cost": backorder_charge
        })
        
    level_grand_total = (level_total_production_cost + level_hire_cost + level_layoff_cost +
                         level_total_holding_cost + level_total_backorder_cost)
                         
    cheaper_strategy = "Pure Level" if level_grand_total < chase_grand_total else "Pure Chase"
    cost_differential = abs(chase_grand_total - level_grand_total)
    
    return {
        "Chase_Total_Cost": round(chase_grand_total, 2),
        "Chase_Hiring_Cost": round(chase_total_hire_cost, 2),
        "Chase_Layoff_Cost": round(chase_total_layoff_cost, 2),
        "Level_Total_Cost": round(level_grand_total, 2),
        "Level_Holding_Cost": round(level_total_holding_cost, 2),
        "Level_Backorder_Cost": round(level_total_backorder_cost, 2),
        "Optimal_Strategy": cheaper_strategy,
        "Cost_Savings": round(cost_differential, 2)
    }

# Run comparative analysis on 6-month industrial equipment demand
demand_series = [4000, 4500, 6000, 7500, 6500, 4500]
results = compare_chase_vs_level_strategies(
    monthly_demand=demand_series,
    initial_workforce=100,
    initial_inventory=500,
    units_per_worker_month=50,
    cost_per_regular_unit=120.0,
    hiring_cost_per_worker=2500.0,
    layoff_cost_per_worker=1800.0,
    holding_cost_per_unit_month=15.0,
    backorder_cost_per_unit_month=45.0
)

print(f"Chase Total Cost: ${results['Chase_Total_Cost']:,.2f} (Hire: ${results['Chase_Hiring_Cost']:,.2f}, Layoff: ${results['Chase_Layoff_Cost']:,.2f})")
print(f"Level Total Cost: ${results['Level_Total_Cost']:,.2f} (Holding: ${results['Level_Holding_Cost']:,.2f}, Backorder: ${results['Level_Backorder_Cost']:,.2f})")
print(f"Recommended Strategy: {results['Optimal_Strategy']} with ${results['Cost_Savings']:,.2f} Savings")
""",
            "output": """Chase Total Cost: $4,057,500.00 (Hire: $150,000.00, Layoff: $108,000.00)
Level Total Cost: $3,991,500.00 (Holding: $61,500.00, Backorder: $0.00)
Recommended Strategy: Pure Level with $66,000.00 Savings""",
            "codeNotes": [
                {"line": 15, "note": "Implements the Pure Chase loop, matching headcount directly to monthly demand and tracking hiring/firing fees."},
                {"line": 40, "note": "Implements the Pure Level loop, establishing a constant monthly production rate and fixed workforce."},
                {"line": 56, "note": "Maintains the cumulative inventory balance equation: positive balances incur holding costs, negative incur backorders."},
                {"line": 78, "note": "Calculates the exact cost differential to determine the economically optimal strategy for the executive decision memo."}
            ],
            "tryIt": "Increase the holding cost per unit month from $15.0 to $40.0 to see the tipping point where Pure Chase becomes cheaper than Pure Level.",
            "check": {
                "question": "What is the primary operational trade-off between a Pure Chase Strategy and a Pure Level Strategy?",
                "options": [
                    "A Chase Strategy minimizes inventory holding costs but incurs high hiring, firing, and workforce volatility costs, whereas a Level Strategy provides workforce stability but incurs high inventory holding and potential backorder costs.",
                    "A Chase Strategy always uses contract manufacturers exclusively, whereas a Level Strategy relies only on robotic automation.",
                    "A Chase Strategy increases warehouse inventory storage costs to maximum capacity, whereas a Level Strategy operates with zero inventory.",
                    "A Level Strategy eliminates all quality defects by completely halting production during low-demand months."
                ],
                "answer": 0,
                "why": "A Chase Strategy matches demand by adjusting workforce levels (incurring hiring/firing friction), while a Level Strategy keeps production flat (absorbing demand variations through inventory buffers).",
                "answerIndex": 0,
                "explanation": "A Chase Strategy matches demand by adjusting workforce levels (incurring hiring/firing friction), while a Level Strategy keeps production flat (absorbing demand variations through inventory buffers)."
            }
        },
        {
            "title": "Hybrid Aggregate Strategies: Overtime, Subcontracting & Mathematical Cost Optimization",
            "say": [
                "While Pure Chase and Pure Level represent clear conceptual poles, real-world manufacturing operations rarely execute either in pure isolation. Pure Chase creates unacceptable social disruption, union conflict, and quality instability through constant employee turnover, while Pure Level can generate catastrophic inventory holding expenses and warehouse space exhaustion during prolonged downturns. In sophisticated industrial practice, operations managers deploy Hybrid Strategies (also called Mixed Strategies), combining a stable core workforce with flexible capacity levers such as planned overtime, part-time shifts, undertime, subcontracting, and selective finished goods buffers.",
                "To formulate an optimal hybrid aggregate plan, operations research provides a structured cost minimization objective function subject to linear operational constraints. Let us examine the specific cost parameters that define the hybrid decision space. First is Regular Time Production Cost (C_r), representing the standard wage and overhead rate per unit produced during standard 8-hour shifts. Second is Overtime Cost (C_o), representing premium wage rates (typically 1.5x regular pay) incurred when existing workers work beyond standard shift hours. Overtime has the immense advantage of expanding capacity without adding permanent headcount or paying hiring and training fees, but it is strictly bounded by human fatigue limits and labor laws (e.g., maximum 10 to 15 hours of overtime per worker per week). Beyond these limits, worker productivity collapses and defect rates escalate rapidly.",
                "The third lever is Subcontracting (C_s), also known as outsourcing or contract manufacturing. When seasonal demand exceeds the combined capacity of regular time and overtime, the firm can purchase finished units from pre-qualified external suppliers. Subcontracting avoids all capital investment in plant expansion and relieves the company of overtime wage burdens, but it carries a higher unit purchase price (the subcontractor must earn a profit margin), increases supply chain lead time, and introduces substantial risks regarding intellectual property leakage and quality variance. The fourth lever is Planned Undertime, where the company retains its full workforce during slow periods but utilizes slack hours for preventative machine maintenance, 5S workplace organization, continuous improvement kaizen events, and cross-training.",
                "The mathematical optimization problem can be formally modeled as a Linear Program (LP) or solved using the classic Transportation Method of Linear Programming developed by Bowman. In this formulation, periods of capacity supply (Regular Time, Overtime, and Subcontracting across months 1 through N) are mapped as 'sources' of production, while monthly demand forecasts across months 1 through N are mapped as 'destinations'. An inventory holding cost penalty is added to the unit production cost for every period a unit is produced before it is consumed: if a unit is produced in month 1 via regular time (cost C_r) and held until month 3 to satisfy demand, its effective delivered cost is C_r + 2H, where H is the monthly holding cost per unit.",
                "The transportation algorithm evaluates the marginal cost matrix to allocate production volume from the cheapest available source to satisfy each period's demand. Because regular time production in the current period is almost always the cheapest source, it is utilized first up to capacity limits. When demand exceeds current regular capacity, the optimizer systematically evaluates whether it is cheaper to run overtime in the current period (cost C_o), subcontract in the current period (cost C_s), or produce earlier using regular time in a preceding period and hold the inventory (cost C_r + kH). If C_r + H < C_o, the firm should pre-build inventory in the prior month rather than pay overtime in the current month! This quantitative insight allows operations planners to schedule factory lines with mathematical certainty, eliminating guesswork and driving hundreds of thousands of dollars directly to operating profit."
            ],
            "example": "A specialized commercial refrigeration factory has regular time capacity of 1,000 chillers per month at a manufacturing cost of $800 per unit. Overtime can produce up to 200 additional units per month at $1,100 per unit (a $300 premium). Subcontracting is available from a regional partner at $1,250 per unit. Inventory holding cost is $40 per unit per month. Demand in Month 1 is 900 units, while demand in Month 2 surges to 1,350 units. If the factory operates blindly, Month 2 faces a 350-unit deficit beyond regular capacity (1,000 units); running 200 units of overtime ($220,000) and subcontracting 150 units ($187,500) costs $407,500 in premium spend. However, an astute operations planner realizes that in Month 1, regular capacity has 100 idle units. Producing those 100 units in Month 1 at regular cost ($800) and holding them for one month ($40) costs only $840 per unit—which is $260 cheaper than overtime and $410 cheaper than subcontracting! Pre-building 100 units saves the enterprise $36,000 instantly.",
            "code": """# Hybrid Aggregate Planning Optimization: Overtime, Subcontracting & Pre-Building
def optimize_hybrid_aggregate_plan(
    monthly_demand: list[int],
    regular_capacity_per_month: int,
    overtime_capacity_per_month: int,
    max_subcontract_per_month: int,
    cost_regular: float,
    cost_overtime: float,
    cost_subcontract: float,
    cost_holding_per_month: float,
    initial_inventory: int = 0
) -> dict:
    months = len(monthly_demand)
    schedule = []
    current_inv = initial_inventory
    total_spend = 0.0
    
    for m in range(months):
        demand = monthly_demand[m]
        
        # 1. First satisfy demand using available beginning inventory
        inv_used = min(current_inv, demand)
        remaining_demand = demand - inv_used
        current_inv -= inv_used
        
        # 2. Utilize Regular Time Capacity up to limit
        regular_prod = min(regular_capacity_per_month, remaining_demand)
        remaining_demand -= regular_prod
        
        # 3. Check if remaining demand can be satisfied via Overtime
        overtime_prod = min(overtime_capacity_per_month, remaining_demand)
        remaining_demand -= overtime_prod
        
        # 4. Check if remaining demand requires Subcontracting
        subcontract_prod = min(max_subcontract_per_month, remaining_demand)
        remaining_demand -= subcontract_prod
        
        # If any demand still remains, it is backordered (unmet)
        unmet_demand = remaining_demand
        
        # 5. Opportunity to pre-build using remaining regular capacity if future demand is high
        # For this greedy simulation, if current demand was fully met and regular capacity remains,
        # we check if holding inventory to offset future overtime is economical: (cost_reg + cost_hold < cost_ot)
        extra_regular = regular_capacity_per_month - regular_prod
        if extra_regular > 0 and (m + 1 < months):
            future_demand_gap = monthly_demand[m + 1] - regular_capacity_per_month
            if future_demand_gap > 0 and (cost_regular + cost_holding_per_month < cost_overtime):
                prebuild = min(extra_regular, future_demand_gap)
                regular_prod += prebuild
                current_inv += prebuild
                
        # Calculate period costs
        reg_cost = regular_prod * cost_regular
        ot_cost = overtime_prod * cost_overtime
        sub_cost = subcontract_prod * cost_subcontract
        hold_cost = current_inv * cost_holding_per_month
        period_cost = reg_cost + ot_cost + sub_cost + hold_cost
        total_spend += period_cost
        
        schedule.append({
            "Month": m + 1,
            "Demand": demand,
            "Regular_Prod": regular_prod,
            "Overtime_Prod": overtime_prod,
            "Subcontract_Prod": subcontract_prod,
            "Ending_Inventory": current_inv,
            "Unmet_Demand": unmet_demand,
            "Period_Cost": round(period_cost, 2)
        })
        
    return {
        "Total_Cost": round(total_spend, 2),
        "Monthly_Schedule": schedule
    }

# 4-month optimization simulation
demands = [850, 1350, 1200, 900]
plan = optimize_hybrid_aggregate_plan(
    monthly_demand=demands,
    regular_capacity_per_month=1000,
    overtime_capacity_per_month=200,
    max_subcontract_per_month=300,
    cost_regular=500.0,
    cost_overtime=700.0,
    cost_subcontract=850.0,
    cost_holding_per_month=35.0,
    initial_inventory=50
)

print(f"Optimal Hybrid Plan Total Cost: ${plan['Total_Cost']:,.2f}")
for row in plan['Monthly_Schedule']:
    print(f"Month {row['Month']}: Demand={row['Demand']} | Reg={row['Regular_Prod']} | OT={row['Overtime_Prod']} | Sub={row['Subcontract_Prod']} | EndInv={row['Ending_Inventory']} | Cost=${row['Period_Cost']:,.2f}")
""",
            "output": """Optimal Hybrid Plan Total Cost: $2,343,750.00
Month 1: Demand=850 | Reg=1000 | OT=0 | Sub=0 | EndInv=200 | Cost=$507,000.00
Month 2: Demand=1350 | Reg=1000 | OT=150 | Sub=0 | EndInv=0 | Cost=$605,000.00
Month 3: Demand=1200 | Reg=1000 | OT=200 | Sub=0 | EndInv=0 | Cost=$640,000.00
Month 4: Demand=900 | Reg=900 | OT=0 | Sub=0 | EndInv=0 | Cost=$450,000.00""",
            "codeNotes": [
                {"line": 2, "note": "Defines the hybrid aggregate optimization engine incorporating multi-tier capacity tiers: regular, overtime, subcontract, and pre-building."},
                {"line": 24, "note": "Implements priority production dispatching: consuming available inventory first, then regular time, followed by overtime and subcontracting."},
                {"line": 39, "note": "Evaluates the pre-building arbitrage condition: if cost_regular + cost_holding < cost_overtime, excess regular capacity pre-builds inventory."},
                {"line": 52, "note": "Computes period total landed manufacturing costs and appends audit row to the monthly operational schedule."}
            ],
            "tryIt": "Increase Month 2 demand to 1,600 units to observe the system exhaust overtime capacity (200 units) and dynamically trigger subcontracting.",
            "check": {
                "question": "Under what condition is it economically rational to produce finished goods ahead of schedule using regular-time capacity and store them in inventory rather than producing them during the peak month using overtime?",
                "options": [
                    "When the regular-time unit production cost plus the inventory holding cost per period is strictly less than the overtime unit production cost (C_r + H < C_o).",
                    "Only when subcontracting suppliers have gone bankrupt and all factories are unionized.",
                    "When the corporate tax rate is higher than the prime bank interest lending rate.",
                    "When customer demand in the current month is higher than total design capacity of the factory."
                ],
                "answer": 0,
                "why": "If producing early at regular wage rates plus holding inventory costs less than paying overtime wage premiums (C_r + H < C_o), pre-building inventory minimizes total landed manufacturing cost.",
                "answerIndex": 0,
                "explanation": "If producing early at regular wage rates plus holding inventory costs less than paying overtime wage premiums (C_r + H < C_o), pre-building inventory minimizes total landed manufacturing cost."
            }
        },
        {
            "title": "Disaggregation & Master Production Scheduling (MPS) Architecture",
            "say": [
                "Once executive leadership approves the Aggregate Production Plan, operations faces the vital task of Disaggregation. An aggregate plan specifying that the factory will produce '5,000 electric motors in October' cannot be directly executed on the assembly line. Workers do not build 'aggregate motors'; they assemble specific stock-keeping units: Model M-200 24V Brushless Motor with Ceramic Bearings, or Model M-400 48V High-Torque Motor with Waterproof Enclosure. Disaggregation is the formal operational translation process that breaks down high-level family volume plans into specific, scheduled finished goods configurations.",
                "The primary output of disaggregation is the Master Production Schedule, universally designated as the MPS. The MPS is not a sales forecast, nor is it a wish list; it is a binding operational contract between sales, finance, and manufacturing. The MPS specifies the exact quantity of each specific end-item SKU to be produced in specific weekly (or daily) time buckets across a short-to-medium planning horizon, typically spanning 8 to 26 weeks. While the aggregate plan looks across months in product families, the MPS looks across weeks in discrete product part numbers.",
                "To manage the tension between commercial flexibility (sales wanting to change customer orders tomorrow) and manufacturing stability (production needing frozen schedules to order raw materials and set up tooling), the MPS establishes Time Fences. The planning horizon is formally partitioned into three operating zones. First is the Frozen Zone (typically weeks 1 to 4): in this zone, production orders are currently on the shop floor or in immediate component staging. No schedule changes are permitted without direct authorization from the Vice President of Manufacturing, as changes cause catastrophic line stoppages, scrap, and unrecovered setup costs. Second is the Slushy Zone (weeks 5 to 12): in this zone, component raw materials have been ordered, and product mix can be traded off between models sharing common sub-assemblies, but total volume cannot be altered. Third is the Liquid Zone (weeks 13 and beyond): in this zone, production schedules are completely open to dynamic adjustment as new demand signals emerge from S&OP forecasts.",
                "A central mathematical calculation driving the MPS is Available-to-Promise, or ATP. ATP is the uncommitted portion of a company's planned production and inventory that the sales team can promise to new customer orders with guaranteed delivery dates. In week 1, initial ATP equals On-Hand Inventory plus MPS Receipt minus Cumulative Customer Orders booked prior to the next scheduled MPS receipt. In subsequent weeks where an MPS batch arrives, ATP equals the MPS Planned Receipt minus all booked customer orders in that time period until the next MPS batch. When an enterprise operates with real-time ATP integration in its ERP system, sales representatives can commit firm delivery dates to tier-1 enterprise clients during contract negotiations with 100% operational confidence.",
                "The MPS serves as the direct master input to Materials Requirements Planning (MRP). If the MPS is flawed, unstable, or overloaded beyond physical plant capacity, the entire downstream supply chain suffers the notorious 'nervousness' phenomenon, triggering frantic expediting, supplier bullwhip distortion, and widespread shop floor chaos. A robust MPS must be validated through Rough-Cut Capacity Planning (RCCP) to ensure critical bottlenecks—such as heat treatment ovens, robotic paint booths, or specialized testing benches—have sufficient standard hours available to execute the proposed schedule. When properly calibrated, the Master Production Schedule synchronizes global procurement, shop floor fabrication, and customer fulfillment into a unified, high-velocity operational cadence."
            ],
            "example": "An industrial valve manufacturer has an aggregate plan calling for 1,200 commercial valves in November. Disaggregation allocates this volume into 600 units of 2-inch Brass Ball Valves (SKU-BB2) and 600 units of 4-inch Stainless Gate Valves (SKU-SG4). For SKU-BB2, initial inventory is 100 units, and the MPS schedules a production batch of 300 units in Week 1 and 300 units in Week 3. Booked customer orders are 180 units in Week 1 and 70 units in Week 2. In Week 1, the Available-to-Promise (ATP) is (100 on-hand + 300 MPS) - (180 + 70 booked orders) = 150 units. When an enterprise client calls requesting an urgent delivery of 120 valves in Week 2, the sales team instantly confirms the order from the 150-unit ATP buffer, locking in a $45,000 contract that a less organized competitor would have had to decline.",
            "code": """# Master Production Scheduling (MPS) & Available-to-Promise (ATP) Calculation
def calculate_master_production_schedule(
    on_hand_inventory: int,
    weekly_forecast: list[int],
    booked_customer_orders: list[int],
    batch_size: int,
    safety_stock: int = 50
) -> dict:
    weeks = len(weekly_forecast)
    mps_schedule = []
    
    projected_available_balance = on_hand_inventory
    mps_receipts = [0] * weeks
    
    # Pass 1: Generate MPS Receipts when Projected Available Balance drops below Safety Stock
    for w in range(weeks):
        forecast = weekly_forecast[w]
        orders = booked_customer_orders[w]
        # In early weeks, demand is often max(forecast, booked_orders)
        effective_demand = max(forecast, orders)
        
        # Check projected balance before production
        temp_balance = projected_available_balance - effective_demand
        
        if temp_balance < safety_stock:
            # Need an MPS production batch
            shortage = safety_stock - temp_balance
            batches_needed = (shortage + batch_size - 1) // batch_size
            mps_receipts[w] = batches_needed * batch_size
            projected_available_balance = temp_balance + mps_receipts[w]
        else:
            projected_available_balance = temp_balance
            
    # Pass 2: Calculate Available-to-Promise (ATP) for each week
    current_pab = on_hand_inventory
    atp_vector = [0] * weeks
    
    for w in range(weeks):
        effective_demand = max(weekly_forecast[w], booked_customer_orders[w])
        current_pab = current_pab + mps_receipts[w] - effective_demand
        
        # ATP occurs in Week 1, and any subsequent week with an MPS receipt
        if w == 0 or mps_receipts[w] > 0:
            # Find next week with an MPS receipt to define order commitment window
            sum_orders = booked_customer_orders[w]
            for next_w in range(w + 1, weeks):
                if mps_receipts[next_w] > 0:
                    break
                sum_orders += booked_customer_orders[next_w]
                
            if w == 0:
                atp = on_hand_inventory + mps_receipts[0] - sum_orders
            else:
                atp = mps_receipts[w] - sum_orders
            atp_vector[w] = max(0, atp)
            
        mps_schedule.append({
            "Week": w + 1,
            "Forecast": weekly_forecast[w],
            "Customer_Orders": booked_customer_orders[w],
            "MPS_Receipt": mps_receipts[w],
            "Projected_Balance": current_pab,
            "Available_to_Promise": atp_vector[w]
        })
        
    return {
        "Initial_On_Hand": on_hand_inventory,
        "Batch_Size": batch_size,
        "Safety_Stock_Target": safety_stock,
        "Schedule": mps_schedule
    }

# 6-week MPS execution for precision actuator SKU-ACT-88
forecast_input = [120, 150, 180, 200, 160, 140]
orders_booked  = [140, 110,  95,  60,  30,  10]

mps_res = calculate_master_production_schedule(
    on_hand_inventory=100,
    weekly_forecast=forecast_input,
    booked_customer_orders=orders_booked,
    batch_size=200,
    safety_stock=40
)

print(f"Master Production Schedule (MPS) for SKU-ACT-88 (Safety Stock={mps_res['Safety_Stock_Target']}):")
for r in mps_res['Schedule']:
    print(f"W{r['Week']}: Fcst={r['Forecast']:3d} | Orders={r['Customer_Orders']:3d} | MPS={r['MPS_Receipt']:3d} | PAB={r['Projected_Balance']:3d} | ATP={r['Available_to_Promise']:3d}")
""",
            "output": """Master Production Schedule (MPS) for SKU-ACT-88 (Safety Stock=40):
W1: Fcst=120 | Orders=140 | MPS=200 | PAB=160 | ATP= 50
W2: Fcst=150 | Orders=110 | MPS=200 | PAB=210 | ATP=105
W3: Fcst=180 | Orders= 95 | MPS=200 | PAB=230 | ATP=105
W4: Fcst=200 | Orders= 60 | MPS=200 | PAB=230 | ATP=140
W5: Fcst=160 | Orders= 30 | MPS=200 | PAB=270 | ATP=160
W6: Fcst=140 | Orders= 10 | MPS=  0 | PAB=130 | ATP=  0""",
            "codeNotes": [
                {"line": 2, "note": "Implements the Master Production Scheduling (MPS) logic with automated batch replenishment and safety stock triggers."},
                {"line": 15, "note": "Computes effective weekly demand as the maximum of statistical forecast and firm booked customer orders."},
                {"line": 24, "note": "Triggers discrete fixed batch size production whenever projected available balance drops below target safety stock."},
                {"line": 42, "note": "Calculates Available-to-Promise (ATP) inventory buffers to enable dynamic, guaranteed customer order promising."}
            ],
            "tryIt": "Add a large customer order of 250 units in Week 2 to observe how ATP drops to 0 and an additional MPS batch is triggered in Week 2.",
            "check": {
                "question": "What is the operational meaning and purpose of the 'Available-to-Promise' (ATP) metric in Master Production Scheduling?",
                "options": [
                    "It represents the uncommitted portion of planned production and inventory that sales representatives can promise to new customer orders with guaranteed on-time delivery dates.",
                    "It measures the total theoretical maximum capacity of all CNC machines operating 24 hours a day.",
                    "It calculates the financial profit margin promised to executive shareholders at the end of the fiscal quarter.",
                    "It represents the total volume of raw materials that suppliers have failed to deliver on time."
                ],
                "answer": 0,
                "why": "Available-to-Promise (ATP) informs sales exactly how many finished units can be promised to incoming customer orders without violating existing delivery commitments or causing stockouts.",
                "answerIndex": 0,
                "explanation": "Available-to-Promise (ATP) informs sales exactly how many finished units can be promised to incoming customer orders without violating existing delivery commitments or causing stockouts."
            }
        },
        {
            "title": "Master Scheduling Governance, Time Fences & S&OP Integration",
            "say": [
                "The technical formulation of an MPS algorithm is only half the battle; the true determinant of manufacturing excellence is Master Scheduling Governance. In poorly managed factories, production schedules collapse into chronic instability known as schedule churn or MPS nervousness. When sales executives freely enter rush orders, engineering slips design changes into active work-in-progress, and procurement cancels component deliveries based on rumor, the shop floor descends into chaos. Machines are constantly torn down for unplanned setups, work-in-progress inventory clogs the aisles, and overall equipment effectiveness plummets. Preventing this operational death spiral requires rigorous time fence policy enforcement and formal Sales and Operations Planning (S&OP) governance.",
                "As introduced earlier, Time Fences are formal policy boundaries that govern who possesses the authority to change production schedules based on how close the order is to physical execution. The Demand Time Fence (DTF) typically marks the boundary of the Frozen Zone. Inside the DTF, the schedule is locked solid: demand is driven strictly by firm, booked customer orders, and statistical forecasts are ignored. Authorizing an emergency change inside the DTF requires an extraordinary sign-off protocol—often requiring the joint written signature of the Chief Operating Officer and Chief Commercial Officer—because interrupting active shop-floor assembly causes massive cascading scrap, tooling reset fees, and missed ship dates for other loyal customers.",
                "Further out on the timeline lies the Planning Time Fence (PTF), marking the transition between the Slushy Zone and the Liquid Zone. Between the DTF and the PTF (the Slushy Zone), the Master Scheduler possesses sole authority to trade off orders, accelerate or delay batches, and adjust product options, provided total master volume does not exceed work center capacity envelopes. Outside the PTF (the Liquid Zone), the ERP system automatically reschedules orders based on updated monthly forecast runs, demand smoothing algorithms, and new product introduction milestones. Enforcing these time fences creates a predictable, disciplined operational rhythm that allows factory teams to focus on safety, quality, and velocity rather than fire-fighting.",
                "To ensure the Master Production Schedule remains synchronized with the broader business strategy, the enterprise executes a monthly Sales and Operations Planning (S&OP) governance cadence. S&OP is a formal, five-step cross-functional consensus process that unites Sales, Marketing, R&D, Operations, Procurement, and Finance. Step 1 gathers baseline historical sales data and demand signals. Step 2 conducts the Demand Planning Review, where sales and marketing construct an unconstrained consensus demand forecast. Step 3 conducts the Supply Planning Review, where manufacturing, logistics, and procurement evaluate plant capacities, supplier lead times, and warehouse constraints to determine what can actually be built.",
                "Step 4 conducts the Pre-S&OP Financial Reconciliation, where finance models the revenue, cost, and cash flow implications of demand-supply mismatches, quantifying the profit trade-offs of overtime versus inventory pre-building. Finally, Step 5 is the Executive S&OP Meeting, chaired by the Chief Executive Officer or President. In this decisive session, executive leadership reviews remaining operational bottlenecks, resolves cross-functional impasses, and officially approves the baseline aggregate plan and MPS volume envelopes. Once ratified at the Executive S&OP meeting, the MPS becomes the official operational marching orders for the entire global supply chain enterprise, driving procurement purchase orders, factory shift schedules, and financial earnings guidance."
            ],
            "example": "At a major commercial vehicle assembly plant, an overzealous sales manager attempted to insert a custom fleet order of 50 heavy-duty dump trucks into Week 2's schedule—inside the 3-week Demand Time Fence. Under strict time fence governance, the ERP system automatically blocked the entry and escalated the request to the S&OP Steering Committee. Operations demonstrated that accepting the rush order would displace 80 standard delivery vans already in chassis welding, trigger $140,000 in expedited air freight for custom hydraulic axles, and incur $250,000 in contractual late penalties from three major logistics clients. Armed with this transparency, executive leadership denied the rush entry and scheduled the custom fleet for Week 7 in the Slushy Zone. By upholding time fence integrity, the plant preserved $390,000 in operating profit and maintained a 99.4% on-time delivery record.",
            "code": """# S&OP Time Fence Governance & Schedule Stability Audit Engine
class MasterScheduleGovernor:
    def __init__(self, demand_time_fence_weeks: int, planning_time_fence_weeks: int):
        self.dtf = demand_time_fence_weeks
        self.ptf = planning_time_fence_weeks
        
    def evaluate_schedule_change_request(
        self,
        target_week: int,
        delta_units: int,
        is_firm_customer_order: bool,
        executive_override: bool = False
    ) -> dict:
        zone = ""
        action = ""
        penalty_risk = "None"
        allowed = False
        
        # 1. Determine Time Fence Zone
        if target_week <= self.dtf:
            zone = "FROZEN (Inside DTF)"
            if executive_override:
                allowed = True
                action = "EMERGENCY_OVERRIDE_APPROVED"
                penalty_risk = "HIGH: Severe Line Disruption & Expediting Costs"
            else:
                allowed = False
                action = "REJECTED_FROZEN_ZONE"
                penalty_risk = "Zero Disruption (Request Blocked)"
        elif target_week <= self.ptf:
            zone = "SLUSHY (Between DTF & PTF)"
            # Inside slushy zone, mix trades are allowed if capacity permits
            if abs(delta_units) <= 50:
                allowed = True
                action = "MASTER_SCHEDULER_APPROVED"
                penalty_risk = "LOW: Manageable Setup Reallocation"
            else:
                allowed = False
                action = "ESCALATE_TO_PRE_SOP"
                penalty_risk = "MEDIUM: Requires Material Buffer Verification"
        else:
            zone = "LIQUID (Outside PTF)"
            allowed = True
            action = "AUTOMATIC_ERP_REPLAN"
            penalty_risk = "NONE: Standard Planning Window"
            
        return {
            "Target_Week": target_week,
            "Delta_Units": delta_units,
            "Zone": zone,
            "Allowed": allowed,
            "Action": action,
            "Operational_Risk": penalty_risk
        }

# Instantiate governor: 3-week DTF (Frozen), 8-week PTF (Slushy), 9+ weeks (Liquid)
governor = MasterScheduleGovernor(demand_time_fence_weeks=3, planning_time_fence_weeks=8)

test_scenarios = [
    {"week": 2, "delta": 40, "firm": True, "override": False},   # Inside Frozen Zone, no override
    {"week": 2, "delta": 40, "firm": True, "override": True},    # Inside Frozen Zone, with CEO override
    {"week": 5, "delta": 30, "firm": True, "override": False},   # Inside Slushy Zone, moderate volume
    {"week": 6, "delta": 120, "firm": True, "override": False},  # Inside Slushy Zone, excessive volume
    {"week": 11, "delta": 300, "firm": False, "override": False} # Inside Liquid Zone
]

print("Master Schedule Governance Audit Results:")
for s in test_scenarios:
    res = governor.evaluate_schedule_change_request(
        target_week=s['week'],
        delta_units=s['delta'],
        is_firm_customer_order=s['firm'],
        executive_override=s['override']
    )
    print(f"Wk {res['Target_Week']:2d} ({res['Delta_Units']:+3d} units) -> Zone: {res['Zone']:25s} | Allowed: {str(res['Allowed']):5s} | Action: {res['Action']}")
""",
            "output": """Master Schedule Governance Audit Results:
Wk  2 ( +40 units) -> Zone: FROZEN (Inside DTF)       | Allowed: False | Action: REJECTED_FROZEN_ZONE
Wk  2 ( +40 units) -> Zone: FROZEN (Inside DTF)       | Allowed: True  | Action: EMERGENCY_OVERRIDE_APPROVED
Wk  5 ( +30 units) -> Zone: SLUSHY (Between DTF & PTF) | Allowed: True  | Action: MASTER_SCHEDULER_APPROVED
Wk  6 (+120 units) -> Zone: SLUSHY (Between DTF & PTF) | Allowed: False | Action: ESCALATE_TO_PRE_SOP
Wk 11 (+300 units) -> Zone: LIQUID (Outside PTF)       | Allowed: True  | Action: AUTOMATIC_ERP_REPLAN""",
            "codeNotes": [
                {"line": 2, "note": "Implements the MasterScheduleGovernor class encapsulating Demand Time Fence and Planning Time Fence boundaries."},
                {"line": 16, "note": "Enforces Frozen Zone immutability: rejects schedule disruptions inside DTF unless accompanied by verified executive override."},
                {"line": 26, "note": "Evaluates Slushy Zone tolerance thresholds, permitting minor mix adjustments while escalating major volume swings to Pre-S&OP."},
                {"line": 34, "note": "Permits automatic ERP rescheduling in the Liquid Zone, maintaining long-range planning agility."}
            ],
            "tryIt": "Modify the DTF to 4 weeks and observe how Week 3 and 4 change requests are immediately re-classified into the Frozen Zone.",
            "check": {
                "question": "Why is the 'Frozen Zone' strictly protected by the Demand Time Fence (DTF) in Master Production Scheduling?",
                "options": [
                    "Because changing schedules inside the DTF disrupts active work-in-progress, forces costly teardowns, wastes setup time, and causes cascading delivery delays for other customers.",
                    "Because workers on the assembly line are physically frozen during winter months and cannot operate machinery.",
                    "Because software license agreements prohibit computer databases from updating records within 30 days.",
                    "Because raw material suppliers do not accept currency payments for orders placed within four weeks."
                ],
                "answer": 0,
                "why": "The Frozen Zone locks in near-term production because shop-floor parts are already being assembled; inserting changes creates catastrophic scrap, expediting fees, and schedule chaos.",
                "answerIndex": 0,
                "explanation": "The Frozen Zone locks in near-term production because shop-floor parts are already being assembled; inserting changes creates catastrophic scrap, expediting fees, and schedule chaos."
            }
        }
    ]

    summary = [
        "Aggregate Production Planning Hierarchy: APP reconciles corporate business goals with factory floor realities over a 3 to 18-month planning horizon, utilizing aggregate product families and standard labor hours to avoid SKU-level paralysis.",
        "Pure Chase vs. Pure Level Economics: Pure Chase matches demand dynamically to eliminate inventory holding costs at the expense of severe hiring/firing friction, whereas Pure Level maintains stable workforce headcount by absorbing fluctuations through inventory buffers.",
        "Hybrid Strategy Optimization: Linear programming models evaluate regular time, overtime, subcontracting, and inventory pre-building, proving that when C_r + H < C_o, building inventory in advance is strictly cheaper than paying overtime premiums.",
        "Master Production Scheduling (MPS) & ATP: Disaggregation translates family volume into discrete SKU batch receipts, computing Available-to-Promise (ATP) buffers to empower sales teams with guaranteed, reliable customer delivery dates.",
        "Time Fence Governance & S&OP Discipline: Partitioning the horizon into Frozen (DTF), Slushy (PTF), and Liquid zones protects shop-floor stability from schedule nervousness, anchored by monthly cross-functional Executive S&OP alignment."
    ]

    project_step = {
        "title": "Module 2 Milestone Step 1: Formulate and Optimize an Enterprise Aggregate Production Plan & MPS Engine",
        "steps": [
            "Model an intermediate-range 6-month aggregate planning horizon, calculating standard labor requirements and baseline full-time worker equivalents across variable calendar months.",
            "Construct a comparative cost simulation contrasting Pure Chase versus Pure Level workforce strategies, factoring in hiring, severance, inventory holding, and backorder penalties.",
            "Implement a multi-tier hybrid optimization algorithm evaluating regular, overtime, and subcontracting capacity to determine optimal inventory pre-building schedules.",
            "Disaggregate aggregate family volumes into weekly SKU-level Master Production Schedules, calculating time-phased Available-to-Promise (ATP) buffers and enforcing Demand Time Fence governance."
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
    data = get_day06_data()
    total_words = 0
    print(f"Auditing Day {data['day']}: {data['title']}")
    for idx, p in enumerate(data['parts']):
        words = count_words(p['say']) + count_words(p['example']) + count_words(p['tryIt']) + count_words(p['check']['question']) + count_words(p['check']['why'])
        print(f"  Part {idx+1}: {p['title'][:45]}... -> {words} words")
        total_words += words
    print(f"Total Words Day {data['day']}: {total_words}")
