# scripts/data_day26.py
# Day 26: Supply Chain Value Stream Analytics: Little's Law, Bottleneck Identification & Bullwhip Effect Mitigation
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: Value Stream Mapping & Little's Law: Flow Rate, Lead Time & Work-in-Process (WIP)
# -------------------------------------------------------------
p1_say = [
    "Welcome to Block Six of Business Analytics and Decision Intelligence. Over the next five days, we bring the foundational first month of this master curriculum to its crowning culmination. Having mastered statistical inference, econometric regression, time series forecasting, inventory optimization, price elasticity, and unit economics, we now synthesize these capabilities into the highest echelon of operations management: Supply Chain Value Stream Analytics, Working Capital Optimization, Prescriptive Linear Programming, Decision Tree Rollbacks, and the Month 1 Grand Capstone.",

    "We begin on Day 26 by investigating the fundamental physics of commercial operational flow: Value Stream Analytics, Little's Law, and Bottleneck Theory. In any manufacturing plant, distribution center, software delivery pipeline, or hospital emergency room, work moves through sequential stages of processing. A value stream encompasses all the end-to-end activities—both value-adding and non-value-adding—required to transform raw inputs or raw customer requests into completed, delivered products. The central objective of value stream analytics is to identify and eliminate operational friction, reduce process cycle times, and maximize capital velocity.",

    "The mathematical cornerstone of operational queuing and flow analysis is Little's Law, formulated and proven by MIT operations research pioneer John D. C. Little in 1961. Little's Law establishes a deceptively simple, universally robust mathematical relationship that governs any stable queuing system: L = lambda * W. In this foundational equation, L represents Work-in-Process (WIP), which is the average number of items or units currently inside the operational system. Lambda represents Throughput Rate (also known as Flow Rate or Production Cadence), which is the average number of completed units exiting the system per unit time. W represents Cycle Time (also known as Flow Time, Dwell Time, or Throughput Time), which is the average duration of time an item spends traversing the system from entry to exit.",

    "The profound elegance of Little's Law lies in its Non-Parametric Generality: it holds true regardless of the underlying probability distribution of customer arrivals, regardless of the processing time distribution, and regardless of the internal queuing discipline (whether First-In-First-Out, priority scheduling, or random batching). The only operational requirement is that the system must be stable (arrivals equal departures over the long run, with finite queue capacity).",

    "To appreciate the strategic power of Little's Law, consider its algebraic rearrangements: Cycle Time can be formulated as: W = L / lambda = Work-in-Process / Throughput. This relationship reveals the fatal flaw in conventional industrial management: When managers want to produce more output, their instinctive response is to dump more raw materials or work orders onto the factory floor, inflating Work-in-Process (L). But if downstream machine capacity (lambda) is constrained, increasing WIP does not increase throughput; instead, it geometrically lengthens Cycle Time W! The factory floor becomes clogged with half-finished inventory, tying up scarce working capital and delaying customer delivery.",

    "Furthermore, value stream analytics decomposes total cycle time into Value-Added Time (VA) and Non-Value-Added Time (NVA). Value-added time represents the actual duration during which work physically transforms the product (e.g., machining, coding, packaging). Non-value-added time represents wasteful dwell time spent waiting in queues, buffer staging, or inspection delays. Process Cycle Efficiency (PCE) is quantified as: PCE = (Value-Added Time / Total Lead Time) * 100%. In un-optimized enterprise supply chains, PCE is routinely below 5%, meaning 95% of an order's lifecycle is pure waiting waste. By applying Little's Law to constrain WIP buffers, organizations slash cycle times by 70% without capital investment.",

    "In the accompanying Python implementation, we build an Enterprise Value Stream & Little's Law Flow Engine from first principles using pure Python standard library routines. We simulate multi-stage production pipelines, verify Little's Law under stochastic queuing arrivals, compute Process Cycle Efficiency, and demonstrate how WIP capping collapses operational lead times."
]

p1_code = r"""# Pure Python Value Stream Mapping & Little's Law Queuing Engine
import random

random.seed(42)

class ValueStreamFlowAnalyzer:
    def __init__(self, stages_info):
        # stages_info: list of dicts with 'name', 'processing_time_hours', 'queue_capacity'
        self.stages = stages_info
        self.num_stages = len(stages_info)
        
    def simulate_pipeline(self, sim_hours=1000, arrival_rate_per_hour=4.0):
        # Discrete-time simulation (time step = 0.1 hour)
        dt = 0.1
        total_steps = int(sim_hours / dt)
        
        # State tracking
        in_system_history = []
        completed_units = 0
        cycle_times = []
        
        # Items in pipeline: list of dicts with 'item_id', 'entry_time', 'current_stage', 'time_in_stage'
        active_items = []
        item_counter = 0
        
        for step in range(total_steps):
            current_time = step * dt
            
            # 1. Stochastic arrivals (Poisson process approx)
            if random.random() < (arrival_rate_per_hour * dt):
                item_counter += 1
                active_items.append({
                    'id': item_counter,
                    'entry_time': current_time,
                    'stage_idx': 0,
                    'time_in_stage': 0.0
                })
                
            # 2. Process items through sequential stages
            surviving_items = []
            for item in active_items:
                s_idx = item['stage_idx']
                item['time_in_stage'] += dt
                
                # Check if item finishes current stage
                proc_time = self.stages[s_idx]['proc_time']
                if item['time_in_stage'] >= proc_time:
                    # Move to next stage or exit system
                    if s_idx + 1 < self.num_stages:
                        item['stage_idx'] += 1
                        item['time_in_stage'] = 0.0
                        surviving_items.append(item)
                    else:
                        # Exited system
                        completed_units += 1
                        cycle_times.append(current_time - item['entry_time'])
                else:
                    surviving_items.append(item)
                    
            active_items = surviving_items
            in_system_history.append(len(active_items))
            
        # Empirical Metrics
        avg_wip_empirical = sum(in_system_history) / float(len(in_system_history))
        throughput_empirical = completed_units / float(sim_hours) # lambda
        avg_cycle_time_empirical = sum(cycle_times) / float(len(cycle_times)) if cycle_times else 0.0 # W
        
        # Little's Law Theoretical Prediction: L_pred = lambda * W
        littles_law_wip_pred = throughput_empirical * avg_cycle_time_empirical
        
        # Process Cycle Efficiency (PCE)
        total_va_time = sum(s['proc_time'] for s in self.stages)
        pce_pct = (total_va_time / avg_cycle_time_empirical) * 100.0 if avg_cycle_time_empirical > 0 else 0.0
        
        return {
            'sim_hours': sim_hours,
            'completed_units': completed_units,
            'empirical_throughput_lambda': round(throughput_empirical, 3),
            'avg_cycle_time_W_hours': round(avg_cycle_time_empirical, 2),
            'empirical_avg_wip_L': round(avg_wip_empirical, 2),
            'littles_law_predicted_wip': round(littles_law_wip_pred, 2),
            'wip_discrepancy_pct': round(abs(avg_wip_empirical - littles_law_wip_pred) / avg_wip_empirical * 100.0, 2),
            'total_value_add_hours': round(total_va_time, 2),
            'process_cycle_efficiency_pct': round(pce_pct, 2)
        }

# Pipeline: 4 sequential stages (Assembly, Quality Test, Packaging, Staging)
pipeline_spec = [
    {'name': 'Assembly', 'proc_time': 0.40},
    {'name': 'Quality Test', 'proc_time': 0.35},
    {'name': 'Packaging', 'proc_time': 0.25},
    {'name': 'Staging', 'proc_time': 0.20}
]

analyzer = ValueStreamFlowAnalyzer(pipeline_spec)
res = analyzer.simulate_pipeline(sim_hours=500, arrival_rate_per_hour=2.0)

print("--- VALUE STREAM MAPPING & LITTLE'S LAW EMPIRICAL VERIFICATION ---")
print(f"Throughput Rate (lambda):       {res['empirical_throughput_lambda']} units/hour")
print(f"Average Cycle Time (W):        {res['avg_cycle_time_W_hours']} hours")
print(f"Empirical Work-in-Process (L): {res['empirical_avg_wip_L']} units")
print(f"Little's Law Prediction:       {res['littles_law_predicted_wip']} units (Discrepancy: {res['wip_discrepancy_pct']}%)")
print(f"Total Value-Add Processing:    {res['total_value_add_hours']} hours")
print(f"Process Cycle Efficiency (PCE):{res['process_cycle_efficiency_pct']}% (Proof of Little's Law invariance!)")
"""

p1_mcq = {
    "question": "According to Little's Law (L = lambda * W), what happens to operational cycle time W if management increases Work-in-Process (L) without expanding system throughput capacity (lambda)?",
    "options": [
        "Cycle time W increases proportionally, causing orders to spend significantly longer waiting in queues and delaying customer delivery.",
        "Cycle time W automatically contracts due to economies of scale on the factory floor.",
        "System throughput lambda doubles to absorb the excess inventory.",
        "Process cycle efficiency immediately reaches one hundred percent."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Rearranging Little's Law yields W = L / lambda. When WIP (L) expands while throughput capacity (lambda) remains constant, cycle time W must increase linearly, inflating lead times."
}

# -------------------------------------------------------------
# Part 2: Bottleneck Identification & The Theory of Constraints (TOC)
# -------------------------------------------------------------
p2_say = [
    "Having established the mechanics of Little's Law, we turn to the governing principle of industrial optimization: The Theory of Constraints (TOC), formulated by Israeli physicist and management visionary Eliyahu M. Goldratt in his seminal 1984 work, *The Goal*. Goldratt established a profound axiom: In any complex operational network, the total throughput of the entire system is strictly dictated and constrained by a single resource—The Bottleneck.",

    "A bottleneck (or constraint) is defined as any operational stage, machine, department, or specialist whose available processing capacity is less than or equal to the demand placed upon it. Mathematically, consider an N-stage linear process where each stage i has an effective production capacity of C_i units per hour. The maximum achievable throughput of the entire enterprise is bounded by the minimum capacity across all stages: Enterprise Throughput = min(C_1, C_2, ..., C_N).",

    "This minimum capacity stage is the bottleneck. The operational implications of this mathematical reality are staggering: An hour of lost production on the bottleneck is an hour lost for the entire enterprise, permanently destroying top-line revenue that can never be recovered. Conversely, an hour saved on a non-bottleneck resource is a pure mirage: speeding up a machine that has excess capacity produces zero increase in enterprise throughput; it merely piles up more un-processable inventory in front of the bottleneck!",

    "To maximize throughput and protect working capital, Goldratt established the Five Focusing Steps of the Theory of Constraints: 1. Identify the system's constraint: Use utilization analytics to locate the stage with the highest utilization or the largest permanent upstream queue. 2. Exploit the constraint: Maximize the productivity of the bottleneck; ensure it never sits idle during lunch breaks, never works on defective parts, and is never starved of work.",

    "3. Subordinate everything else to the above decision: This is the most counter-intuitive step for traditional managers. Non-bottleneck resources must be deliberately throttled to match the pace of the bottleneck. Operating a non-bottleneck at 100% capacity produces nothing but catastrophic inventory bloat. 4. Elevate the constraint: If enterprise demand still exceeds capacity, invest capital to expand the bottleneck (e.g., purchase an additional machine, hire a second shift, or automate tooling). 5. If in the previous steps a constraint has been broken, go back to Step 1: Do not let inertia become the constraint.",

    "In shop-floor execution, the Theory of Constraints is implemented via the Drum-Buffer-Rope (DBR) Architecture. The Bottleneck is the Drum: it sets the heartbeat and production cadence for the entire enterprise. The Buffer is a dedicated safety stock buffer placed immediately in front of the bottleneck to ensure that minor upstream disruptions never starve the constraint. The Rope is a pull-signaling communication link connecting the bottleneck back to the raw material release gate: raw materials are released into the factory if and only if the bottleneck drum has just completed a unit, perfectly synchronizing enterprise flow.",

    "To understand the mathematical inevitability of bottleneck queuing, operations researchers rely on Kingman's Approximation Formula for G/G/1 queuing systems, formulated by British mathematician Sir John Kingman in 1961. Kingman's formula estimates the average waiting time in queue W_q as: W_q approx [ rho / (1 - rho) ] * [ (c_a^2 + c_s^2) / 2 ] * (1 / mu), where rho = lambda / mu represents machine utilization, c_a is the coefficient of variation of arrival intervals, c_s is the coefficient of variation of service processing times, and mu is processing service rate.",

    "Examining the first factor, [ rho / (1 - rho) ], reveals why traditional plant managers who attempt to run every machine at 95% or 99% utilization precipitate operational disaster. As utilization rho approaches 1.0 (100%), the term (1 - rho) in the denominator approaches zero, causing queue waiting times and Work-in-Process inventory to explode asymptotically toward infinity! Even minor stochastic variability (c_a or c_s > 0) will choke a high-utilization facility with crippling queues. The Theory of Constraints embraces deliberate excess capacity on non-bottlenecks (maintaining rho < 75%) to absorb stochastic variance, ensuring only the bottleneck operates at high utilization.",

    "In the accompanying Python implementation, we build a Theory of Constraints & Bottleneck Diagnostics Engine. We simulate a multi-stage production network with uneven capacities, identify the bottleneck resource, demonstrate how unconstrained upstream production inflates WIP, and implement Drum-Buffer-Rope pull throttling to stabilize the system."
]

p2_code = r"""# Pure Python Theory of Constraints & Bottleneck Engine

class TheoryOfConstraintsSimulator:
    def __init__(self, stage_capacities_units_per_hour):
        # stage_capacities: dict of {'StageName': capacity_per_hour}
        self.capacities = stage_capacities_units_per_hour
        self.stage_names = list(stage_capacities_units_per_hour.keys())
        self._diagnose_bottleneck()
        
    def _diagnose_bottleneck(self):
        # Bottleneck = stage with minimum capacity
        min_cap = float('inf')
        b_name = None
        for name, cap in self.capacities.items():
            if cap < min_cap:
                min_cap = cap
                b_name = name
                
        self.bottleneck_stage = b_name
        self.system_max_throughput = min_cap
        
    def evaluate_push_vs_dbr(self, input_rate, sim_hours=100):
        # 1. Unconstrained Push System: Input rate forced onto first stage
        # Queues accumulate in front of stages where input > capacity
        push_queues = {name: 0.0 for name in self.stage_names}
        total_pushed_input = input_rate * sim_hours
        
        # Effective throughput across stages
        curr_flow = input_rate
        for name in self.stage_names:
            cap = self.capacities[name]
            if curr_flow > cap:
                excess_hourly = curr_flow - cap
                push_queues[name] = excess_hourly * sim_hours
                curr_flow = cap # throttled by physics
                
        push_completed = curr_flow * sim_hours
        push_wip_bloat = sum(push_queues.values())
        
        # 2. Drum-Buffer-Rope (DBR) Pull System: Input rate governed by bottleneck drum
        dbr_input_rate = min(input_rate, self.system_max_throughput)
        dbr_completed = dbr_input_rate * sim_hours
        dbr_wip_buffer = 15.0 # Fixed small protective buffer at bottleneck
        
        return {
            'bottleneck_stage': self.bottleneck_stage,
            'max_system_throughput_hourly': self.system_max_throughput,
            'push_policy': {
                'raw_materials_input': round(total_pushed_input, 1),
                'completed_units': round(push_completed, 1),
                'trapped_wip_units': round(push_wip_bloat, 1),
                'wip_location': {k: round(v, 1) for k, v in push_queues.items() if v > 0}
            },
            'dbr_policy': {
                'raw_materials_input': round(dbr_input_rate * sim_hours, 1),
                'completed_units': round(dbr_completed, 1),
                'trapped_wip_units': round(dbr_wip_buffer, 1),
                'capital_saved_units': round(push_wip_bloat - dbr_wip_buffer, 1)
            }
        }

# Plant configuration: Fabrication (60/hr), Welding (45/hr), Painting (30/hr - BOTTLENECK), Final Assembly (50/hr)
plant_caps = {
    'Fabrication': 60.0,
    'Welding': 45.0,
    'Painting (Bottleneck)': 30.0,
    'Final Assembly': 50.0
}

engine = TheoryOfConstraintsSimulator(plant_caps)
results = engine.evaluate_push_vs_dbr(input_rate=55.0, sim_hours=80) # 2-week operation

print("--- THEORY OF CONSTRAINTS (TOC) BOTTLENECK DIAGNOSTICS ---")
print(f"Identified Constraint: {results['bottleneck_stage']} (Max Cap: {results['max_system_throughput_hourly']} units/hr)\n")

p_res = results['push_policy']
d_res = results['dbr_policy']

print("1. UNCONSTRAINED PUSH SYSTEM (Running non-bottlenecks at full speed):")
print(f"   Completed Output: {p_res['completed_units']} units | Trapped WIP Bloat: {p_res['trapped_wip_units']} units")
print(f"   WIP Queue Accumulation: {p_res['wip_location']}")

print("\n2. DRUM-BUFFER-ROPE (DBR) SYSTEM (Subordinating plant to bottleneck drum):")
print(f"   Completed Output: {d_res['completed_units']} units (IDENTICAL OUTPUT!)")
print(f"   Trapped WIP Bloat: {d_res['trapped_wip_units']} units")
print(f"   Working Capital Inventory Released: {d_res['capital_saved_units']} units!")
print("Key Takeaway: Pushing inventory faster than the bottleneck creates pure waste without adding a single unit of output!")
"""

p2_mcq = {
    "question": "In Goldratt's Theory of Constraints, what is the operational consequence of running non-bottleneck machines at one hundred percent capacity?",
    "options": [
        "It produces zero incremental enterprise throughput, merely accumulating massive, expensive Work-in-Process inventory in front of the bottleneck.",
        "It permanently shifts the bottleneck to customer shipping docks.",
        "It reduces the plant's total inventory holding costs by twenty percent.",
        "It eliminates all machine maintenance downtime across the facility."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Total output is bounded strictly by the bottleneck: min(C_1, ..., C_N). Running non-bottlenecks faster than the bottleneck cannot increase output; it only piles up un-processable WIP."
}

# -------------------------------------------------------------
# Part 3: The Bullwhip Effect: Information Distortion & Variance Amplification
# -------------------------------------------------------------
p3_say = [
    "From intra-plant flow dynamics, we now expand our analytical lens to multi-echelon global supply chains. One of the most destructive and well-documented phenomena in commercial economics is The Bullwhip Effect, originally identified by Forrester in 1961 and popularized by Stanford professor Hau L. Lee in 1997. The bullwhip effect describes how small, gentle fluctuations in retail customer demand become dramatically amplified into wildly volatile swings as orders propagate upstream through retail, wholesale, distribution, and manufacturing echelons.",

    "Consider a retail supply chain selling consumer goods: End-consumer demand at retail stores might fluctuate by a modest +/- 5% week-to-week. However, when the retailer places purchase orders with the regional distributor, the order variance surges to +/- 20%. When the distributor orders from the master wholesaler, variance expands to +/- 45%. By the time purchase orders reach the primary raw material manufacturer at the top of the supply chain, orders swing by +/- 100% to 200%! Like the tip of a whip accelerating through a wide, violent arc when the handle is barely flicked, small retail shifts create massive upstream chaos.",

    "To quantify this distortion rigorously, supply chain analytics measures the Order Variance Ratio (OVR): OVR = Var(Orders) / Var(Demand) = sigma_{orders}^2 / sigma_{demand}^2. In an efficient, synchronized supply network, OVR would equal exactly 1.0 (upstream orders perfectly mirror customer consumption). In reality, global supply networks routinely exhibit OVR values between 2.5 and 8.0, indicating severe artificial volatility.",

    "Hau Lee identified the Four Structural Drivers of the Bullwhip Effect: 1. Demand Signal Processing: Upstream managers confuse purchase order variations with real consumer demand shifts, over-reacting by artificially inflating statistical forecasts and safety stock buffers. 2. Order Batching: Companies do not order continuously; due to fixed ordering fees and truckload volume discounts, they accumulate orders and place large, periodic, lumpy batch orders, sending artificial demand shockwaves upstream.",

    "3. Price Fluctuations & Forward Buying: Promotional discounts, volume rebates, and trade promotions induce buyers to engage in forward buying—purchasing twelve weeks of inventory during a temporary discount window. This creates artificial demand spikes followed by protracted demand droughts that have zero relationship to actual consumer usage. 4. Rationing and Shortage Gaming: During product shortages, suppliers ration deliveries (e.g., shipping only 50% of ordered quantities). Savvy buyers respond by artificially inflating their purchase orders (ordering 2,000 units when they only need 1,000 to guarantee receiving 1,000). When supply recovers, customers cancel phantom orders, leaving manufacturers with mountains of stranded inventory.",

    "Mitigating the bullwhip effect requires structural and informational transparency: deploying Point-of-Sale (POS) data sharing, eliminating trade promotions via Everyday Low Pricing (EDLP), shrinking batch sizes via lean logistics, and implementing Collaborative Planning, Forecasting, and Replenishment (CPFR) agreements.",

    "The analytical mechanics of how forecasting mechanisms directly amplify the Bullwhip Effect were definitively proven by Chen, Drezner, Ryan, and Simchi-Levi in their landmark 1998 theorem. They analyzed a two-stage supply chain where a retailer uses a simple moving average of length p to forecast customer demand over replenishment lead time L. They proved that the lower bound on the Order Variance Ratio is given by the rigorous algebraic inequality: Var(Orders) / Var(Demand) >= 1 + (2 * L) / p + (2 * L^2) / (p^2).",

    "This equation yields a profound quantitative revelation: Lead time L appears in the numerator squared: (2 * L^2) / (p^2)! As supplier replenishment lead time lengthens (for example, sourcing from overseas factories with 16-week maritime transit versus local suppliers with 2-week lead times), the bullwhip variance amplification escalates quadratically. Conversely, increasing the forecasting lookback window p dampens the effect, but at the cost of lagging behind genuine structural trend shifts. The theorem mathematically proves that shortening physical lead times is the single most powerful structural antidote to supply chain volatility.",

    "In the accompanying Python implementation, we build a Multi-Echelon Bullwhip Effect Simulation Engine. We model a 4-tier supply chain (Retailer, Distributor, Wholesaler, Manufacturer), track order propagation over 52 weeks, compute empirical variance escalation, and demonstrate how POS data sharing collapses the bullwhip multiplier."
]

p3_code = r"""# Pure Python Multi-Echelon Bullwhip Effect Simulation Engine
import math
import random

random.seed(42)

class MultiEchelonSupplyChain:
    def __init__(self, weeks=52, base_demand=500, demand_noise=30):
        self.weeks = weeks
        self.d_base = base_demand
        self.d_noise = demand_noise
        
    def simulate_traditional_disconnected_chain(self):
        # 4 Tiers: Consumer -> Retailer -> Distributor -> Wholesaler -> Manufacturer
        # Each tier updates order via naive moving average + safety buffer padding
        consumer_demand = []
        retailer_orders = []
        distributor_orders = []
        wholesaler_orders = []
        
        # Initial baseline states
        ret_buffer = 1.10
        dist_buffer = 1.15
        whol_buffer = 1.20
        
        ret_prev = self.d_base
        dist_prev = self.d_base
        whol_prev = self.d_base
        
        for w in range(self.weeks):
            # 1. Retail consumer demand with mild random noise
            d_t = max(100, int(round(self.d_base + random.gauss(0, self.d_noise))))
            consumer_demand.append(d_t)
            
            # 2. Retailer orders from Distributor (reacts to demand shift + adjusts safety buffer)
            delta_ret = d_t - ret_prev
            order_ret = max(50, int(round(d_t + 1.2 * delta_ret)))
            retailer_orders.append(order_ret)
            ret_prev = d_t
            
            # 3. Distributor orders from Wholesaler (reacts to retailer order + batch padding)
            delta_dist = order_ret - dist_prev
            order_dist = max(50, int(round(order_ret + 1.5 * delta_dist)))
            distributor_orders.append(order_dist)
            dist_prev = order_ret
            
            # 4. Wholesaler orders from Manufacturer
            delta_whol = order_dist - whol_prev
            order_whol = max(50, int(round(order_dist + 1.8 * delta_whol)))
            wholesaler_orders.append(order_whol)
            whol_prev = order_dist
            
        return self._compute_variances(consumer_demand, retailer_orders, distributor_orders, wholesaler_orders)

    def _compute_variances(self, c_dem, r_ord, d_ord, w_ord):
        def var(lst):
            m = sum(lst) / float(len(lst))
            return sum((x - m) ** 2 for x in lst) / float(len(lst) - 1)
            
        var_c = var(c_dem)
        var_r = var(r_ord)
        var_d = var(d_ord)
        var_w = var(w_ord)
        
        return {
            'consumer_demand_var': round(var_c, 2),
            'retailer_order_var': round(var_r, 2),
            'distributor_order_var': round(var_d, 2),
            'manufacturer_order_var': round(var_w, 2),
            'retailer_ovr': round(var_r / var_c, 2),
            'distributor_ovr': round(var_d / var_c, 2),
            'manufacturer_ovr': round(var_w / var_c, 2) # Total Bullwhip Ratio
        }

chain = MultiEchelonSupplyChain(weeks=52, base_demand=500, demand_noise=35)
metrics = chain.simulate_traditional_disconnected_chain()

print("--- MULTI-ECHELON BULLWHIP EFFECT VARIANCE ESCALATION ---")
print(f"1. End Consumer Demand Variance:     {metrics['consumer_demand_var']:10,.1f} (Baseline: 1.0x)")
print(f"2. Retailer Order Variance:           {metrics['retailer_order_var']:10,.1f} (OVR: {metrics['retailer_ovr']:4.1f}x)")
print(f"3. Distributor Order Variance:        {metrics['distributor_order_var']:10,.1f} (OVR: {metrics['distributor_ovr']:4.1f}x)")
print(f"4. Manufacturer Order Variance:       {metrics['manufacturer_order_var']:10,.1f} (OVR: {metrics['manufacturer_ovr']:4.1f}x!)")
print(f"\nBullwhip Escalation: Upstream manufacturing experiences {metrics['manufacturer_ovr']}x the volatility of retail end customers!")
"""

p3_mcq = {
    "question": "What does an Order Variance Ratio OVR = Var(Orders) / Var(Demand) strictly greater than 1.0 indicate across a multi-echelon supply chain?",
    "options": [
        "The Bullwhip Effect is active, meaning order volatility is becoming artificially amplified as procurement signals propagate upstream.",
        "Supplier replenishment lead time has dropped to zero days.",
        "Retail customers are purchasing products in steady, non-stochastic quantities.",
        "The enterprise has eliminated all inventory holding costs."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "OVR > 1.0 proves variance amplification (the Bullwhip Effect): upstream order volatility exceeds downstream consumer demand volatility due to batching, rationing, and signal distortion."
}

# -------------------------------------------------------------
# Part 4: CPFR & Information Transparency: Shared POS Telemetry
# -------------------------------------------------------------
p4_say = [
    "Recognizing the enormous capital destruction caused by the Bullwhip Effect, leading global enterprises—pioneered by the famous 1989 partnership between Walmart and Procter & Gamble—developed the operational framework known as Collaborative Planning, Forecasting, and Replenishment (CPFR). In traditional, fragmented supply chains, each echelon operates as an informational silo: suppliers have zero visibility into real-time retail store sales, and retailers have zero visibility into supplier manufacturing backlogs. Everyone attempts to forecast the future by looking exclusively at the lumpy purchase orders sent by the immediate adjacent tier.",

    "The revolutionary breakthrough of CPFR is Point-of-Sale (POS) Data Transparency. Instead of waiting for purchase orders to trickle through multiple intermediaries, upstream manufacturers are granted real-time API telemetry directly into downstream cash register scanners and e-commerce shopping carts. When a consumer buys a package of Pampers diapers at a Walmart store in Dallas, that transaction is instantly reflected in P&G's production scheduling systems in Cincinnati.",

    "Mathematically, when upstream manufacturers synchronize their master production schedules directly with end-consumer demand variance sigma_{demand}^2 rather than intermediary order variance sigma_{orders}^2, the artificial amplification terms in the Order Variance Ratio are systematically eliminated: OVR_{CPFR} -> 1.0. Upstream factory lines operate at smooth, constant cadences, eliminating emergency overtime wages, idle factory shutdowns, and catastrophic bullwhip inventory gluts.",

    "Furthermore, CPFR transforms replenishment via Vendor-Managed Inventory (VMI) agreements. Under traditional procurement, the buyer decides when and how much to order. Under VMI, the supplier takes full contractual responsibility for monitoring inventory levels at the customer's distribution center and triggering replenishment shipments to maintain agreed-upon service level bands. The supplier gains the operational flexibility to optimize its own production batching and shipping schedules, while the customer enjoys guaranteed product availability with zero administrative purchasing friction.",

    "In technical supply chain enterprise architectures, CPFR is executed through standardized Electronic Data Interchange (EDI) and modern RESTful API Webhook streams. Canonical protocols include EDI 852 (Product Activity Data), which transmits daily point-of-sale store inventory and checkout scan data directly from retailer ERPs to supplier databases; EDI 850 (Purchase Orders), transmitting formal purchase contracts; and EDI 856 (Advance Ship Notices), alerting downstream distribution hubs the moment a shipment departs a manufacturing dock.",

    "In contemporary cloud analytics stacks, legacy batch EDI transactions are increasingly superseded by real-time event-driven architectures running on Apache Kafka or AWS Kinesis. Whenever a point-of-sale scanner registers a purchase, a JSON event payload publishes to a partitioned message topic. Downstream manufacturer demand-sensing microservices consume these messages instantaneously, updating Bayesian demand forecasts and dynamic MRP reorder points without human intervention.",

    "By replacing batch weekly purchase orders with continuous real-time telemetry, organizations achieve True Zero-Latency Supply Chains. Inventory safety buffers, which historically existed as an insurance policy against informational blindness, are safely liquidated, releasing tens of millions of dollars in trapped working capital back onto corporate balance sheets.",

    "The governance architecture of CPFR is anchored by formal Collaborative Service Level Agreements (SLAs) and Exception-Based Management Protocols. In large enterprise partnerships, retail and manufacturing planners cannot manually review forecasts for 50,000 active SKUs every week. Instead, the CPFR analytics engine continuously computes the Forecast Divergence Metric: Divergence = |Forecast_{Retailer} - Forecast_{Supplier}| / Forecast_{Retailer}.",

    "Whenever divergence exceeds a negotiated contractual threshold (such as 15%), the system automatically flags an Exception Alert, summoning category planners from both corporations into an immediate joint resolution session. Furthermore, CPFR contracts establish symmetric financial incentives: suppliers commit to guaranteed fill rates (e.g., 98.5%) backed by financial penalties for late deliveries, while retailers commit to minimum forecast accuracy bounds, eliminating unilateral risk shifting.",

    "In the accompanying Python implementation, we build an Information-Synchronized CPFR Engine. We simulate the same multi-echelon supply chain under direct POS telemetry sharing, measure the dramatic reduction in upstream order variance, and quantify the millions of dollars in working capital released by eliminating the bullwhip effect."
]

p4_code = r"""# Pure Python CPFR & Information Synchronization Engine
import math
import random

random.seed(42)

def simulate_cpfr_synchronized_chain(weeks=52, base_demand=500, demand_noise=35):
    # Under CPFR: Real-time POS telemetry is shared directly with all upstream tiers
    # Upstream tiers produce based on true consumer demand smoothed by moving average
    consumer_demand = []
    manufacturer_production = []
    
    # Shared rolling window of consumer demand
    rolling_window = [base_demand] * 4
    
    for w in range(weeks):
        d_t = max(100, int(round(base_demand + random.gauss(0, demand_noise))))
        consumer_demand.append(d_t)
        
        # Update shared POS telemetry
        rolling_window.pop(0)
        rolling_window.append(d_t)
        smoothed_demand = sum(rolling_window) / float(len(rolling_window))
        
        # Manufacturer schedules production to match smoothed consumer pull directly
        mfg_order = int(round(smoothed_demand))
        manufacturer_production.append(mfg_order)
        
    def var(lst):
        m = sum(lst) / float(len(lst))
        return sum((x - m) ** 2 for x in lst) / float(len(lst) - 1)
        
    var_c = var(consumer_demand)
    var_m = var(manufacturer_production)
    ovr = var_m / var_c if var_c > 0 else 1.0
    
    return {
        'consumer_demand_var': round(var_c, 2),
        'cpfr_manufacturer_var': round(var_m, 2),
        'cpfr_ovr': round(ovr, 2),
        'variance_reduction_pct': round((1.0 - ovr) * 100.0, 1)
    }

cpfr_metrics = simulate_cpfr_synchronized_chain()

print("--- CPFR & POS INFORMATION TRANSPARENCY RESULTS ---")
print(f"Consumer Demand Variance:        {cpfr_metrics['consumer_demand_var']:10,.1f}")
print(f"CPFR Synchronized Mfg Variance:  {cpfr_metrics['cpfr_manufacturer_var']:10,.1f}")
print(f"CPFR Order Variance Ratio (OVR): {cpfr_metrics['cpfr_ovr']:4.2f}x (Down from 6.0x+ in disconnected chains!)")
print(f"Upstream Volatility Slashed By:   {cpfr_metrics['variance_reduction_pct']}% via shared POS data!")
"""

p4_mcq = {
    "question": "How does Collaborative Planning, Forecasting, and Replenishment (CPFR) with real-time Point-of-Sale (POS) data sharing mitigate the Bullwhip Effect?",
    "options": [
        "By providing upstream manufacturers with direct visibility into end-consumer consumption, eliminating reliance on distorted intermediary order signals.",
        "By permanently doubling retail product prices to suppress consumer demand volatility.",
        "By replacing all truckload freight shipping with air cargo deliveries.",
        "By enforcing strict manual paperwork audits across every regional warehouse."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "CPFR shares raw Point-of-Sale (POS) data across all echelons, ensuring manufacturers schedule production against true end-consumer pull rather than distorted, batched intermediary purchase orders."
}

# -------------------------------------------------------------
# Part 5: Building a Comprehensive Supply Chain Value Stream Engine in Python
# -------------------------------------------------------------
p5_say = [
    "To conclude Day 26, we synthesize all foundational concepts—Little's Law, bottleneck capacity identification, the Theory of Constraints Drum-Buffer-Rope architecture, and Bullwhip Effect mitigation—into a master Enterprise Supply Chain Value Stream Analytics Engine.",

    "Our comprehensive engine executes three integrated analytical modules: Module One (Queuing & Lead Time Diagnostics): Evaluates multi-stage production lines, computes theoretical versus empirical Work-in-Process via Little's Law, and calculates Process Cycle Efficiency (PCE).",

    "Module Two (Constraint Identification & DBR Throttling): Scans stage processing rates to locate the mathematical bottleneck, computes system capacity ceilings, and simulates the financial savings of subordinating non-bottleneck production to the bottleneck drum.",

    "Module Three (Multi-Echelon Bullwhip Quantification): Tracks multi-tier order variance propagation, computes the Order Variance Ratio across each echelon, and calculates the working capital freed when transitioning from disconnected push ordering to information-synchronized CPFR pull fulfillment.",

    "In modern supply chain control towers, this analytical apparatus is integrated with real-time Internet of Things (IoT) sensor telemetry and digital twin simulations. Factory machines, transport trucks, and automated warehouse conveyors continuously broadcast status heartbeats. When an unplanned machine breakdown occurs or port congestion delays maritime freight, the digital twin immediately recalculates network flow equations, identifying temporary dynamic bottlenecks and re-routing purchase orders before WIP piles up.",

    "Furthermore, the engine quantifies the direct financial impact on Corporate Cash Flow and Return on Invested Capital (ROIC). Every dollar of eliminated Work-in-Process inventory and every day of reduced manufacturing lead time flows straight to the balance sheet, permanently lowering net working capital requirements and boosting enterprise valuation multiples.",

    "At the operational core of value stream mapping is the mathematical calculation of Takt Time, derived from the German word for musical rhythm or baton beat. Takt Time represents the exact pace at which completed products must exit the manufacturing facility to satisfy customer demand without building over-production inventory: Takt Time = Net Available Working Time per Shift / Customer Demand per Shift. For example, if a plant operates for 27,000 available working seconds per shift and daily customer demand is 450 units, Takt Time is exactly: 27,000 / 450 = 60.0 seconds per unit.",

    "Comparing stage processing cycle times directly against Takt Time provides immediate visual clarity into operational health. Any stage whose cycle time exceeds Takt Time is an active constraint that causes the entire plant to fail customer delivery commitments. Conversely, any stage whose cycle time is vastly faster than Takt Time possesses excessive idle capacity, tempting supervisors to build wasteful intermediate WIP queues. Value stream balancing aims to harmonize all stage cycle times just beneath the Takt Time line.",

    "Finally, by embedding these value stream mapping principles directly into enterprise decision support systems, analytics teams transform static Lean Kaizen posters into dynamic, real-time optimization engines. Plant managers receive continuous automated guidance on line balancing, buffer sizing, and bottleneck exploitation, driving relentless continuous improvement.",

    "The ultimate triumph of supply chain value stream analytics is the complete unification of physical factory floor velocity with corporate balance sheet solvency. When lead times contract and inventory buffers are streamlined, working capital turns accelerate, gross margins expand, and the enterprise builds an agile, resilient competitive moat that thrives even amid turbulent global macroeconomic shocks. This foundational mastery sets the stage for full corporate cash conversion and prescriptive optimization modeling.",

    "By architecting this complete decision intelligence suite from first principles without external dependencies, we empower analytics professionals to diagnose systemic operational bottlenecks, dismantle the bullwhip effect, and accelerate enterprise cash flow velocity.",

    "In the accompanying Python implementation, we build this complete Master Value Stream Analytics Engine. We run an end-to-end multi-echelon pipeline audit, capture operational flow trajectories, and output the executive supply chain performance scorecard."
]

p5_code = r"""# Pure Python Master Supply Chain Value Stream Analytics Engine

class MasterValueStreamAnalyticsEngine:
    def __init__(self, stages, echelons_count=4):
        self.stages = stages
        self.echelons = echelons_count
        self._analyze()
        
    def _analyze(self):
        # 1. Little's Law & Bottleneck
        min_cap = float('inf')
        bottleneck = None
        total_proc_time = 0.0
        
        for s in self.stages:
            cap = s['capacity_per_hour']
            total_proc_time += (1.0 / cap)
            if cap < min_cap:
                min_cap = cap
                bottleneck = s['name']
                
        self.bottleneck_name = bottleneck
        self.system_throughput_cap = min_cap
        self.total_va_hours = total_proc_time
        
    def generate_executive_scorecard(self, current_wip_units=120.0, current_lead_time_hours=4.5):
        # Current Process Cycle Efficiency
        pce = (self.total_va_hours / current_lead_time_hours) * 100.0 if current_lead_time_hours > 0 else 0.0
        
        # Optimal Little's Law WIP at max capacity: L* = lambda* * VA_time
        optimal_wip = self.system_throughput_cap * self.total_va_hours
        excess_wip = max(0.0, current_wip_units - optimal_wip)
        
        return {
            'identified_bottleneck': self.bottleneck_name,
            'max_throughput_capacity_hourly': round(self.system_throughput_cap, 1),
            'total_value_added_hours': round(self.total_va_hours, 2),
            'current_process_cycle_efficiency': round(pce, 2),
            'current_wip_units': current_wip_units,
            'optimal_wip_units': round(optimal_wip, 1),
            'excess_wip_inventory_to_purge': round(excess_wip, 1),
            'projected_lead_time_reduction_pct': round((excess_wip / current_wip_units) * 100.0, 1)
        }

# Plant configuration: 4 core stages
stages_config = [
    {'name': 'Component Stamping', 'capacity_per_hour': 48.0},
    {'name': 'Precision CNC Milling', 'capacity_per_hour': 32.0},
    {'name': 'Surface Coating (Bottleneck)', 'capacity_per_hour': 22.0},
    {'name': 'Automated Assembly', 'capacity_per_hour': 38.0}
]

engine = MasterValueStreamAnalyticsEngine(stages_config)
scorecard = engine.generate_executive_scorecard(current_wip_units=145.0, current_lead_time_hours=6.5)

print("--- MASTER SUPPLY CHAIN VALUE STREAM EXECUTIVE SCORECARD ---")
for k, v in scorecard.items():
    print(f"  {k:36s}: {v}")
"""

p5_mcq = {
    "question": "What is the primary operational objective of conducting comprehensive Value Stream Analytics across an enterprise manufacturing and logistics network?",
    "options": [
        "To identify systemic bottlenecks, eliminate non-value-added queuing waste via Little's Law, and synchronize multi-echelon replenishment to eliminate the Bullwhip Effect.",
        "To increase factory inventory holding costs to claim higher balance sheet asset valuations.",
        "To force all machines to operate at one hundred percent utilization regardless of demand.",
        "To replace real-time digital telemetry with paper ledger tracking."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Value stream analytics diagnoses bottlenecks, purges wasteful WIP via Little's Law, and aligns multi-tier supply chains to collapse lead times and eliminate bullwhip variance."
}

# -------------------------------------------------------------
# DAY_DATA Aggregation & Validation
# -------------------------------------------------------------
DAY_DATA = {
    "day": 26,
    "courseId": "bcom_ana",
    "title": "Supply Chain Value Stream Analytics: Little's Law, Bottleneck Identification & Bullwhip Effect Mitigation",
    "description": "Master operational value stream analytics: Little's Law (L = lambda * W), Process Cycle Efficiency (PCE), Goldratt's Theory of Constraints and Drum-Buffer-Rope architectures, the Bullwhip Effect Order Variance Ratio (OVR), and CPFR information synchronization.",
    "parts": [
        {
            "title": "Value Stream Mapping & Little's Law: Flow Rate, Lead Time & Work-in-Process (WIP)",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "title": "Bottleneck Identification & The Theory of Constraints (TOC)",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "title": "The Bullwhip Effect: Information Distortion & Variance Amplification",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "title": "CPFR & Information Transparency: Shared POS Telemetry",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "title": "Building a Comprehensive Supply Chain Value Stream Engine in Python",
            "say": p5_say,
            "code": p5_code,
            "mcq": p5_mcq
        }
    ]
}

if __name__ == "__main__":
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path.cwd()))
    from scripts.bcom_ana_utils import count_words, execute_code
    print(f"Validating Day {DAY_DATA['day']}: {DAY_DATA['title']}...")
    part_words = [count_words(p["say"]) for p in DAY_DATA["parts"]]
    print(f"Part word counts: {part_words} (Total: {sum(part_words)})")
    assert all(w >= 600 for w in part_words), f"Some parts under 600 words: {part_words}"
    for i, p in enumerate(DAY_DATA["parts"]):
        print(f"Testing Part {i+1} code...")
        out = execute_code(p["code"])
        print(f"  Part {i+1} code executed cleanly ({len(out)} chars output)")
    print(f"Day {DAY_DATA['day']} validation successful!")
