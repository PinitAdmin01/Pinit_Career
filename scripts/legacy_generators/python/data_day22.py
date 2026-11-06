# scripts/data_day22.py
# Day 22: Inventory ABC/XYZ Classification: Pareto Skew, Coefficient of Variation & SKU Service Levels
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: The Pareto Principle in SKU Portfolio Management: Cumulative Revenue & Lorenz Asymmetry
# -------------------------------------------------------------
p1_say = [
    "In large-scale commercial enterprises, product portfolios rarely consist of a handful of homogeneous items. Global retailers, industrial distributors, automotive manufacturers, and e-commerce platforms routinely manage catalogs spanning tens of thousands, or even hundreds of thousands, of distinct Stock Keeping Units (SKUs). A fatal error in supply chain management is the Uniform Treatment Fallacy: the naive assumption that all SKUs in a warehouse deserve identical inventory replenishment policies, identical safety stock buffers, and identical management oversight. In operational reality, treating a high-volume, mission-critical component with the same protocols as a slow-moving, long-tail accessory guarantees both rampant stockouts and catastrophic working capital bloat.",

    "To impose strategic discipline upon massive product catalogs, operations research relies upon ABC Analysis, rooted in the Pareto Principle (the 80/20 Rule) formulated by Italian polymath Vilfredo Pareto and adapted to industrial inventory by Joseph M. Juran. In an enterprise catalog, the distribution of annual economic consumption exhibits profound skewness: a tiny fraction of active SKUs accounts for the vast majority of total annual revenue and working capital throughput, while the vast majority of SKUs contributes an almost negligible fraction of financial volume.",

    "The quantitative metric governing classical ABC classification is Annual Dollar Usage (ADU), also known as Annual Monetary Value or Annual Consumption Value. For each individual SKU i, the annual dollar usage is computed as the product of its forecasted annual unit sales demand D_i and its unit acquisition cost C_i: ADU_i = D_i * C_i. Once ADU is computed across all N items in the portfolio, the items are sorted in strictly descending order of ADU: ADU_{(1)} >= ADU_{(2)} >= ... >= ADU_{(N)}. The analytics engine then computes the cumulative dollar usage and the cumulative percentage of total portfolio value represented by each successive SKU.",

    "Based on cumulative monetary value, the SKU catalog is partitioned into three canonical management tiers: Category A represents the elite economic core of the enterprise, typically comprising approximately 10% to 20% of total SKU count but driving approximately 70% to 80% of total annual dollar usage. Category B represents the intermediate commercial tier, typically comprising 20% to 30% of total SKU count and accounting for approximately 15% to 20% of annual monetary value. Category C represents the vast commercial long tail, comprising 50% to 70% of all catalog SKUs but generating only the bottom 5% to 10% of total financial throughput.",

    "To formalize the degree of portfolio concentration mathematically, quantitative analytics utilizes the Lorenz Curve and the Gini Coefficient. The Lorenz curve plots the cumulative proportion of catalog SKUs on the horizontal axis against the cumulative proportion of annual monetary throughput on the vertical axis. In an egalitarian inventory where every SKU generated identical dollar sales, the Lorenz curve would follow the 45-degree diagonal line of perfect equality. In real enterprise catalogs, the curve sags dramatically downward, illustrating extreme concentration.",

    "The Gini Coefficient G quantifies this economic asymmetry as the ratio of the area between the line of perfect equality and the empirical Lorenz curve to the total triangular area under the diagonal. Formulated for discrete SKU portfolios, Gini G = (2 * sum_{i=1}^N (i * ADU_{(N - i + 1)}) ) / (N * sum_{i=1}^N ADU_i) - (N + 1) / N. An enterprise inventory portfolio typically exhibits a Gini coefficient between 0.70 and 0.90, reflecting extreme Pareto skew. Recognizing this extreme concentration allows management to deploy 80% of executive bandwidth and high-frequency analytical audits to Class A items, while automating Class C replenishment.",

    "In the accompanying Python implementation, we construct an Enterprise ABC Classification & Lorenz Concentration Engine from first principles using pure Python standard library tools. We ingest multi-SKU catalog records, compute annual dollar usage, establish Pareto boundaries, compute empirical Lorenz coordinates, and calculate the exact Gini concentration coefficient."
]

p1_code = r"""# Pure Python Enterprise ABC Classification & Gini Concentration Engine

class ABCPortfolioAnalyzer:
    def __init__(self, sku_data):
        # sku_data: list of dicts with 'sku_id', 'annual_demand', 'unit_cost'
        self.skus = sku_data
        self._analyze()
        
    def _analyze(self):
        # 1. Compute Annual Dollar Usage (ADU)
        for item in self.skus:
            item['adu'] = item['annual_demand'] * item['unit_cost']
            
        # 2. Sort descending by ADU
        self.skus.sort(key=lambda x: x['adu'], reverse=True)
        
        self.total_adu = sum(item['adu'] for item in self.skus)
        self.n = len(self.skus)
        
        # 3. Compute cumulative percentages and assign ABC tier
        cum_adu = 0.0
        for idx, item in enumerate(self.skus):
            cum_adu += item['adu']
            item['cum_adu_pct'] = (cum_adu / self.total_adu) * 100.0
            item['cum_sku_pct'] = ((idx + 1) / float(self.n)) * 100.0
            
            # Classical Pareto thresholds: A <= 80%, B <= 95%, C > 95%
            if item['cum_adu_pct'] <= 80.0:
                item['abc_class'] = 'A'
            elif item['cum_adu_pct'] <= 95.0:
                item['abc_class'] = 'B'
            else:
                item['abc_class'] = 'C'
                
        # 4. Compute Gini Coefficient for portfolio concentration
        # Sort ascending for standard Gini formula
        sorted_adu_asc = sorted([item['adu'] for item in self.skus])
        numerator = sum((i + 1) * val for i, val in enumerate(sorted_adu_asc))
        self.gini = (2.0 * numerator) / (self.n * self.total_adu) - (self.n + 1.0) / float(self.n)
        
    def get_summary(self):
        summary = {'A': {'count': 0, 'adu': 0.0}, 'B': {'count': 0, 'adu': 0.0}, 'C': {'count': 0, 'adu': 0.0}}
        for item in self.skus:
            c = item['abc_class']
            summary[c]['count'] += 1
            summary[c]['adu'] += item['adu']
            
        return {
            'total_skus': self.n,
            'total_portfolio_adu': round(self.total_adu, 2),
            'portfolio_gini_coefficient': round(self.gini, 4),
            'tier_distribution': {
                c: {
                    'sku_count': summary[c]['count'],
                    'sku_pct': round((summary[c]['count'] / float(self.n)) * 100.0, 1),
                    'total_adu': round(summary[c]['adu'], 2),
                    'adu_pct': round((summary[c]['adu'] / self.total_adu) * 100.0, 1)
                } for c in ['A', 'B', 'C']
            }
        }

# Generate representative enterprise portfolio of 25 SKUs across value spectrum
raw_catalog = [
    {'sku_id': f'SKU-{i:03d}', 'annual_demand': int(120000 / (i**1.4)), 'unit_cost': round(15.0 + (i * 8.5), 2)}
    for i in range(1, 26)
]

analyzer = ABCPortfolioAnalyzer(raw_catalog)
res = analyzer.get_summary()

print("--- ENTERPRISE ABC PORTFOLIO PARETO CLASSIFICATION ---")
print(f"Total Portfolio SKUs: {res['total_skus']} | Total Annual Value: ${res['total_portfolio_adu']:,.2f} | Gini: {res['portfolio_gini_coefficient']}")
print("\nTier Breakdown:")
for tier, metrics in res['tier_distribution'].items():
    print(f"  Class {tier}: {metrics['sku_count']:2d} SKUs ({metrics['sku_pct']:4.1f}% of catalog) -> ${metrics['total_adu']:10,.2f} ({metrics['adu_pct']:4.1f}% of revenue)")
"""

p1_mcq = {
    "question": "In classical inventory ABC classification, how is Annual Dollar Usage (ADU) computed and utilized to segment catalog items?",
    "options": [
        "ADU is computed as Annual Unit Demand multiplied by Unit Cost, and items are sorted in descending order to assign Class A to the top ~80% of cumulative monetary value.",
        "ADU is computed as warehouse storage footprint multiplied by daily inventory holding cost rates.",
        "ADU is calculated by dividing annual sales revenue by the supplier replenishment lead time in weeks.",
        "ADU is derived by taking the logarithm of unit shipping weight multiplied by freight tariffs."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Annual Dollar Usage (ADU = D * C) measures total annual monetary throughput. Sorting descending allows identifying the vital few Class A items accounting for ~80% of total portfolio value."
}

# -------------------------------------------------------------
# Part 2: XYZ Volatility Matrix: Demand Coefficient of Variation (CV) & Predictability Thresholds
# -------------------------------------------------------------
p2_say = [
    "While ABC analysis provides essential clarity regarding monetary value, it possesses a dangerous blind spot: it measures financial volume but completely ignores demand volatility. A Class A SKU might generate two million dollars in annual sales through an exceptionally steady, predictable demand stream of approximately 8,000 units every single week. Simultaneously, another Class A SKU might generate two million dollars through erratic, lumpy project orders where zero units sell for five months, followed by an abrupt, unannounced purchase order of 40,000 units. Attempting to manage these two items with the same forecasting and safety stock model invites disaster.",

    "To inject demand predictability into portfolio governance, operations analytics pairs ABC analysis with XYZ Classification. Where ABC measures monetary magnitude, XYZ measures demand volatility, uncertainty, and forecastability. The mathematical foundation of XYZ analysis is the Coefficient of Variation (CV), also known as relative standard deviation. For any SKU over an evaluation period of T time intervals (typically 52 weekly or 12 monthly periods), let d_t represent demand in period t, mu_d represent the mean demand per period, and sigma_d represent the standard deviation of period demand.",

    "The Coefficient of Variation is formulated as the ratio of the standard deviation to the mean: CV = sigma_d / mu_d. The profound advantage of CV over raw standard deviation sigma_d is Scale Invariance. Consider a high-volume product selling an average of 10,000 units per month with a standard deviation of 500 units; its raw standard deviation is 500, but its CV is 500 / 10,000 = 0.05 (extremely stable). Now consider a low-volume spare part selling an average of 5 units per month with a standard deviation of 4 units; its raw standard deviation is only 4, but its CV is 4 / 5 = 0.80 (wildly erratic). If an analyst ranked items by raw standard deviation, they would misclassify the stable item as high-risk and the erratic item as low-risk.",

    "Standard enterprise supply chain engineering partitions the CV spectrum into three operational XYZ tiers: Category X encompasses SKUs with low demand volatility, defined by CV < 0.20 (or CV < 0.25 in retail contexts). Demand for Class X items is steady, non-seasonal, and highly predictable; automated time series statistical models achieve high forecast accuracy (e.g., MAPE < 10%). Category Y encompasses SKUs with moderate demand volatility, defined by 0.20 <= CV <= 0.50. Demand for Class Y items fluctuates due to seasonal cycles, product lifecycle transitions, or promotional campaigns; forecasting requires seasonal decomposition or causal regression.",

    "Category Z encompasses SKUs with high demand volatility and lumpy or sporadic patterns, defined by CV > 0.50 (frequently exceeding 1.0 in spare parts and industrial B2B environments). Demand for Class Z items is characterized by zero-demand periods interspersed with stochastic bursts. For Class Z items, standard Gaussian forecasting models collapse; practitioners must deploy specialized intermittent demand algorithms, such as Croston's Method or Syntetos-Boylan Approximations (SBA), which decompose intermittent demand into two separate state spaces: the inter-arrival interval between non-zero demand events and the magnitude of demand when an event occurs.",

    "Furthermore, the Syntetos-Boylan classification taxonomy formalizes intermittent demand by evaluating two orthogonal dimensions: the Average Demand Interval (ADI), measuring the average number of time periods between non-zero demand transactions, and the squared coefficient of variation (CV^2) of non-zero transaction sizes. When ADI < 1.32 and CV^2 < 0.49, demand is Smooth (Class X). When ADI < 1.32 but CV^2 >= 0.49, demand is Erratic (Class Y). When ADI >= 1.32 and CV^2 < 0.49, demand is Intermittent (Class Z). When ADI >= 1.32 and CV^2 >= 0.49, demand is Lumpy (extreme Class Z).",

    "In the accompanying Python implementation, we build an XYZ Demand Volatility Engine. We ingest multi-period demand histories across a diverse SKU catalog, calculate empirical mean, standard deviation, and Coefficient of Variation, classify items into XYZ categories, and diagnose intermittent versus smooth demand characteristics."
]

p2_code = r"""# Pure Python XYZ Demand Volatility & Coefficient of Variation (CV) Engine
import math

class XYZDemandAnalyzer:
    def __init__(self, weekly_sales_data):
        # weekly_sales_data: dict of {sku_id: [demand_week_1, ..., demand_week_52]}
        self.sales = weekly_sales_data
        self.results = {}
        self._analyze()
        
    def _analyze(self):
        for sku_id, series in self.sales.items():
            n = len(series)
            if n < 2:
                continue
            mean_d = sum(series) / float(n)
            
            # Sample variance and standard deviation
            variance = sum((x - mean_d) ** 2 for x in series) / float(n - 1)
            std_d = math.sqrt(variance)
            
            # Coefficient of Variation: CV = sigma / mu
            cv = (std_d / mean_d) if mean_d > 0 else 999.0
            
            # Intermittent demand metrics (ADI & Non-zero CV)
            non_zero_demands = [x for x in series if x > 0]
            non_zero_count = len(non_zero_demands)
            adi = (float(n) / non_zero_count) if non_zero_count > 0 else 999.0
            
            # XYZ classification thresholds:
            # X: CV < 0.25 (Steady, highly predictable)
            # Y: 0.25 <= CV <= 0.60 (Moderate volatility / seasonal)
            # Z: CV > 0.60 (Erratic, lumpy, intermittent)
            if cv < 0.25:
                xyz_class = 'X'
            elif cv <= 0.60:
                xyz_class = 'Y'
            else:
                xyz_class = 'Z'
                
            self.results[sku_id] = {
                'sku_id': sku_id,
                'mean_weekly_demand': round(mean_d, 2),
                'std_weekly_demand': round(std_d, 2),
                'cv': round(cv, 4),
                'adi': round(adi, 2),
                'zero_demand_weeks': n - non_zero_count,
                'xyz_class': xyz_class
            }
            
    def get_summary(self):
        summary = {'X': 0, 'Y': 0, 'Z': 0}
        for item in self.results.values():
            summary[item['xyz_class']] += 1
        return summary

# Simulate 52-week demand histories for 6 representative SKUs
import random
random.seed(42)

sim_sales = {
    # Steady high-volume consumer staple (X)
    'SKU-001': [int(random.gauss(500, 40)) for _ in range(52)],
    # Steady industrial component (X)
    'SKU-002': [int(random.gauss(120, 15)) for _ in range(52)],
    # Seasonal product with moderate volatility (Y)
    'SKU-003': [int(max(10, 200 + 120 * math.sin(i * 2 * math.pi / 26) + random.gauss(0, 30))) for i in range(52)],
    # Promotional swing item (Y)
    'SKU-004': [int(random.gauss(80, 35)) for _ in range(52)],
    # Intermittent spare part (Z)
    'SKU-005': [random.choice([0, 0, 0, 0, int(random.gauss(40, 10))]) for _ in range(52)],
    # Lumpy capital equipment component (Z)
    'SKU-006': [random.choice([0, 0, 0, 0, 0, 0, int(random.gauss(15, 8))]) for _ in range(52)]
}

analyzer = XYZDemandAnalyzer(sim_sales)
print("--- XYZ DEMAND VOLATILITY & COEFFICIENT OF VARIATION ANALYSIS ---")
for sku_id, m in analyzer.results.items():
    print(f"SKU: {sku_id} | Mean: {m['mean_weekly_demand']:6.1f} | StdDev: {m['std_weekly_demand']:5.1f} | CV: {m['cv']:6.3f} | ADI: {m['adi']:4.1f} | Class: {m['xyz_class']}")
"""

p2_mcq = {
    "question": "Why is the Coefficient of Variation (CV = sigma / mu) superior to raw standard deviation (sigma) when evaluating demand predictability across an inventory catalog?",
    "options": [
        "Because CV is scale-invariant, allowing relative demand volatility to be compared fairly between high-volume and low-volume SKUs.",
        "Because CV eliminates the need to calculate arithmetic sample variances.",
        "Because CV automatically converts weekly demand into annual currency valuations.",
        "Because CV is immune to supplier replenishment lead-time variability."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Standard deviation scales with demand volume. A high-volume SKU can have a large standard deviation but tiny relative volatility, while a low-volume SKU has a small standard deviation but massive relative volatility. CV normalizes by the mean."
}

# -------------------------------------------------------------
# Part 3: The 9-Box Multi-Dimensional ABC/XYZ Governance Matrix
# -------------------------------------------------------------
p3_say = [
    "Having independently derived ABC value tiers and XYZ volatility classifications, we now intersect them to construct the definitive operational cornerstone of supply chain governance: The 9-Box ABC/XYZ Matrix. By crossing the three value categories (A, B, C) with the three volatility categories (X, Y, Z), the analytics practitioner generates nine mutually exclusive operational cells: AX, AY, AZ, BX, BY, BZ, CX, CY, and CZ. Each cell embodies a radically distinct operational profile requiring customized procurement, inventory stocking, and forecasting policies.",

    "Let us systematically examine the operational characteristics and management mandates for each segment of the 9-Box Matrix: Cell AX (High Value, Low Volatility) represents the crown jewels of enterprise operations. These items generate enormous monetary throughput with smooth, predictable demand. In Cell AX, the organization deploys Just-In-Time (JIT) replenishment, Vendor-Managed Inventory (VMI), and automated daily electronic data interchange (EDI) orders. Because demand is predictable, safety stock can be kept lean, maximizing inventory turnover and freeing up cash.",

    "Cell AY (High Value, Medium Volatility) represents high-dollar items subject to seasonal, promotional, or cyclical shifts. Cell AY demands collaborative cross-functional forecasting, synchronizing marketing promotional calendars with procurement. Replenishment utilizes dynamic safety stock buffers that expand prior to peak seasons and contract during troughs. Cell AZ (High Value, High Volatility) represents the highest risk profile in the entire enterprise. These items tie up massive capital when purchased, yet demand is erratic and unpredictable. Cell AZ must NEVER be placed on unconstrained automated reordering. Best-practice governance mandates Make-to-Order (MTO), customer advance deposits, stocking un-assembled modular sub-components rather than finished goods, and strict executive sign-off for purchase orders.",

    "The intermediate tier (Cells BX, BY, BZ) represents steady middle-market volume. Cell BX operates on automated periodic replenishment with standard economic order quantities. Cell BY utilizes automated seasonal forecasting models. Cell BZ requires selective buffering, identifying whether erratic demand stems from customer concentration (e.g., one large client placing irregular orders) and negotiating contractual minimum order lead times.",

    "The bottom tier (Cells CX, CY, CZ) contains low-value items. Cell CX (Low Value, Low Volatility) contains steady, cheap consumables (such as standard bolts, packaging tape, or common resistors). Management should deploy Two-Bin Kanban systems or large bulk purchase orders to capture volume discounts; because unit holding costs are negligible, holding 90 days of inventory is far cheaper than the administrative overhead of weekly purchasing. Cell CY represents cheap items with moderate volatility, managed via simple automated reorder points.",

    "Finally, Cell CZ (Low Value, High Volatility) represents the operational graveyard of the warehouse: thousands of slow-moving, erratic, cheap parts that clutter physical space, consume administrative tracking bandwidth, and accumulate obsolescence reserves. Strategic management of Cell CZ involves SKU Rationalization (pruning redundant variations), establishing strict Minimum Order Quantities (MOQs), transferring stocking responsibility to third-party distributors, or introducing end-of-life phase-out protocols.",

    "To address the profound operational complexity of Cell AZ, advanced manufacturing and supply chain architectures deploy Postponement and Modular Decoupling Strategies. In a postponement architecture, the enterprise avoids committing expensive Class A components to final finished-goods configurations until customer orders are contractually confirmed. Instead, the firm maintains inventory in generic, un-configured semi-finished sub-assemblies (often designated as work-in-progress or WIP buffers). When a volatile customer demand spike manifests in Cell AZ, the factory rapidly executes final assembly and localization, shortening effective customer lead times without exposing the balance sheet to catastrophic finished-goods obsolescence.",

    "Furthermore, governance of the 9-Box Matrix must not remain static. Products continuously migrate across cells throughout their economic lifecycles. A newly launched cutting-edge product typically enters the portfolio in Cell AZ (high unit cost, highly uncertain exploratory demand). As market adoption stabilizes, sales volume surges and predictability improves, transitioning the product into Cell AY and ultimately into Cell AX during its mature cash-cow phase. Eventually, as competitor alternatives emerge and market saturation sets in, the product declines into Cell BX and ultimately Cell CZ. Robust analytics systems perform automated monthly drift detection, re-classifying migrating SKUs and adjusting procurement policies in real time.",

    "In the accompanying Python implementation, we build the complete 9-Box ABC/XYZ Cross-Tabulation Matrix Engine. We integrate SKU monetary values and volatility scores, map each item into its respective governance cell, compute cell aggregate working capital, and print the executive 9-box operational scorecard."
]

p3_code = r"""# Pure Python 9-Box ABC/XYZ Governance Matrix Engine

class ABCXYZMatrixEngine:
    def __init__(self, sku_catalog):
        # sku_catalog: list of dicts with 'sku_id', 'annual_revenue', 'cv'
        self.catalog = sku_catalog
        self.cells = {f"{abc}{xyz}": [] for abc in ['A', 'B', 'C'] for xyz in ['X', 'Y', 'Z']}
        self._build_matrix()
        
    def _build_matrix(self):
        # 1. Assign ABC based on revenue percentiles
        self.catalog.sort(key=lambda x: x['annual_revenue'], reverse=True)
        total_rev = sum(x['annual_revenue'] for x in self.catalog)
        cum_rev = 0.0
        
        for item in self.catalog:
            cum_rev += item['annual_revenue']
            cum_pct = (cum_rev / total_rev) * 100.0
            if cum_pct <= 80.0:
                item['abc'] = 'A'
            elif cum_pct <= 95.0:
                item['abc'] = 'B'
            else:
                item['abc'] = 'C'
                
            # 2. Assign XYZ based on CV
            cv = item['cv']
            if cv < 0.25:
                item['xyz'] = 'X'
            elif cv <= 0.60:
                item['xyz'] = 'Y'
            else:
                item['xyz'] = 'Z'
                
            cell_key = f"{item['abc']}{item['xyz']}"
            item['matrix_cell'] = cell_key
            self.cells[cell_key].append(item)
            
    def get_cell_policies(self):
        return {
            'AX': 'JIT / Vendor-Managed Inventory, lean safety stock, high turnover.',
            'AY': 'Collaborative seasonal planning, dynamic safety stock buffers.',
            'AZ': 'Make-To-Order (MTO), consignment, executive sign-off required.',
            'BX': 'Automated periodic review (s, Q), standard economic batching.',
            'BY': 'Automated seasonal forecasting models with trend tracking.',
            'BZ': 'Buffer at component level, negotiate customer advance notices.',
            'CX': 'Two-Bin Kanban, large bulk orders, maximize volume discounts.',
            'CY': 'Standard ROP, periodic review, low administrative oversight.',
            'CZ': 'SKU Rationalization candidate, MOQ enforcement, catalog purge.'
        }

    def generate_matrix_scorecard(self):
        policies = self.get_cell_policies()
        matrix_stats = {}
        for cell_key, items in self.cells.items():
            count = len(items)
            total_val = sum(x['annual_revenue'] for x in items)
            matrix_stats[cell_key] = {
                'count': count,
                'total_revenue': total_val,
                'policy': policies[cell_key]
            }
        return matrix_stats

# Generate catalog of 27 items distributed across matrix
test_catalog = [
    # Class A items
    {'sku_id': 'SKU-001', 'annual_revenue': 850000.0, 'cv': 0.12}, # AX
    {'sku_id': 'SKU-002', 'annual_revenue': 620000.0, 'cv': 0.18}, # AX
    {'sku_id': 'SKU-003', 'annual_revenue': 510000.0, 'cv': 0.42}, # AY
    {'sku_id': 'SKU-004', 'annual_revenue': 440000.0, 'cv': 0.88}, # AZ
    # Class B items
    {'sku_id': 'SKU-005', 'annual_revenue': 180000.0, 'cv': 0.15}, # BX
    {'sku_id': 'SKU-006', 'annual_revenue': 140000.0, 'cv': 0.35}, # BY
    {'sku_id': 'SKU-007', 'annual_revenue': 110000.0, 'cv': 0.75}, # BZ
    # Class C items
    {'sku_id': 'SKU-008', 'annual_revenue': 35000.0, 'cv': 0.10},  # CX
    {'sku_id': 'SKU-009', 'annual_revenue': 25000.0, 'cv': 0.45},  # CY
    {'sku_id': 'SKU-010', 'annual_revenue': 8000.0,  'cv': 1.15}   # CZ
]

engine = ABCXYZMatrixEngine(test_catalog)
scorecard = engine.generate_matrix_scorecard()

print("--- 9-BOX ABC/XYZ MATRIX GOVERNANCE SCORECARD ---")
for abc in ['A', 'B', 'C']:
    for xyz in ['X', 'Y', 'Z']:
        cell = f"{abc}{xyz}"
        stats = scorecard[cell]
        print(f"Cell [{cell}]: {stats['count']:2d} SKUs | Revenue: ${stats['total_revenue']:10,.2f} | Mandate: {stats['policy']}")
"""

p3_mcq = {
    "question": "Which inventory governance policy should be applied to items falling into Cell AZ (High Value, High Volatility)?",
    "options": [
        "Make-to-Order (MTO), customer advance deposits, buffer stock at the component level, and strict executive purchase sign-offs.",
        "Automated continuous reordering with large bulk batch sizes to achieve economies of scale.",
        "Two-bin Kanban replenishment with 180 days of on-hand safety stock.",
        "Immediate catalog deletion without notifying existing commercial clients."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Cell AZ items are expensive to hold and subject to erratic demand. Automated stocking risks massive capital lockup and obsolescence; MTO and strict controls prevent speculative overstocking."
}

# -------------------------------------------------------------
# Part 4: Differential Service Level Optimization Across the SKU Matrix
# -------------------------------------------------------------
p4_say = [
    "One of the most profound applications of the 9-Box ABC/XYZ framework is Differential Service Level Optimization. In traditional, unscientific inventory management, leadership declares an organization-wide blanket target, such as 'Our company maintains a 95% service level across all products.' While this sounds like a decisive executive commitment to customer satisfaction, it is economically disastrous. Applying a uniform 95% Cycle Service Level (or Fill Rate) across all nine boxes creates severe capital misallocation: it over-buffers erratic, cheap, slow-moving items in Cell CZ while under-buffering critical high-volume items in Cell AX.",

    "To optimize return on invested capital, the enterprise must establish a Differentiated Service Level Vector that assigns distinct target service levels to each cell in the 9-box matrix based on two economic forces: the financial consequence of a stockout and the working capital cost of holding buffer inventory. For Class A items with steady demand (Cell AX), a stockout halts massive revenue streams or stops automotive assembly lines; therefore, Cell AX warrants an ultra-high target Cycle Service Level, such as 98% or 99% (Z = 2.054 to 2.326). Because Cell AX demand volatility is low (CV < 0.25), achieving a 99% service level requires relatively modest safety stock units.",

    "Conversely, for Cell AZ items, demand is highly volatile (sigma_LTD is massive) and unit costs are high. Attempting to force a 95% or 98% Cycle Service Level on Cell AZ would require astronomical safety stock buffers, tying up millions of dollars in inventory that may sit in a warehouse for eighteen months before a customer arrives. Therefore, the optimal target service level for Cell AZ is deliberately lowered to 80% or 85% (Z = 0.84 to 1.036), or converted entirely to Make-To-Order with negotiated customer delivery lead times.",

    "For Class C items in Cell CX (cheap consumables with steady demand), unit holding costs are tiny (pennies per unit). Here, the firm can comfortably maintain a 98% service level with negligible financial impact, preventing annoying minor stockouts of cheap nuts, bolts, or packaging materials that could stall shipments of multi-thousand-dollar systems. Meanwhile, in Cell CZ (cheap, erratic items), service levels are set to 75% or 80%, forcing customer consolidation or minimum purchase quantities.",

    "Mathematically, when an enterprise transitions from a Flat Uniform Service Level Policy (e.g., 95% CSL across all SKUs) to a Differentiated 9-Box Policy (e.g., AX: 98%, BX: 95%, CX: 95%, AZ: 80%, CZ: 75%), total required safety stock working capital drops by 20% to 35% across the aggregate portfolio, while actual revenue-weighted availability and customer fulfillment rates INCREASE! By reallocating capital away from unpredictable slow-movers and concentrating it on high-velocity core products, the enterprise achieves superior customer fulfillment at significantly lower holding cost.",

    "The rigorous theoretical foundation for Differential Service Level Optimization is established through Constrained Optimization using Lagrange Multipliers. Formally, consider the enterprise objective: maximize the total expected revenue-weighted fill rate across all N SKUs, subject to the hard constraint that total portfolio safety stock holding capital does not exceed an allocated budgetary ceiling K: sum_{i=1}^N (SS_i * C_i) <= K. By constructing the Lagrangian function L(Z_1, ..., Z_N, lambda) = sum_{i=1}^N w_i * (1 - (sigma_{LTD, i} * G(Z_i)) / Q_i) - lambda * (sum_{i=1}^N (Z_i * sigma_{LTD, i} * C_i) - K), we take first-order partial derivatives with respect to each Z_i.",

    "Setting each partial derivative to zero yields the foundational Equi-Marginal Principle of Inventory Economics: at the optimal capital allocation point, the marginal increase in customer fill rate per additional dollar of inventory holding cost must be strictly identical across all N items in the portfolio: (w_i * (1 - Phi(Z_i))) / (Q_i * C_i) = lambda for all i. This mathematical truth proves conclusively why uniform service levels are sub-optimal: because item costs C_i and transaction sizes Q_i vary across multiple orders of magnitude, enforcing identical Z-scores across all items creates massive disparities in marginal capital efficiency.",

    "In the accompanying Python implementation, we build a Portfolio Working Capital & Differential Service Level Optimization Engine. We model a multi-SKU portfolio, compute required safety stock units and dollar values under a Flat Uniform 95% Policy versus an Optimized Differentiated Policy, and quantify the exact working capital released to the balance sheet."
]

p4_code = r"""# Pure Python Portfolio Differential Service Level Optimizer
import math

def normal_ppf(p):
    # High-precision rational approximation for inverse normal CDF
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680133080352692e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [ 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00]
    p_low, p_high = 0.02425, 1.0 - 0.02425
    if p < p_low:
        q = math.sqrt(-2.0 * math.log(p))
        return sum(c[i] * (q ** (5 - i)) for i in range(6)) / (1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4)))
    elif p <= p_high:
        q = p - 0.5
        r = q * q
        return (sum(a[i] * (r ** (5 - i)) for i in range(6)) * q) / (1.0 + sum(b[i] * (r ** (5 - i)) for i in range(5)))
    else:
        q = math.sqrt(-2.0 * math.log(1.0 - p))
        return -sum(c[i] * (q ** (5 - i)) for i in range(6)) / (1.0 + sum(d[i] * (q ** (4 - i)) for i in range(4)))

class DifferentialServiceLevelOptimizer:
    def __init__(self, sku_list, holding_rate=0.22):
        self.skus = sku_list
        self.holding_rate = holding_rate
        
        # Differentiated target service levels across 9-box matrix
        self.differentiated_targets = {
            'AX': 0.98, 'AY': 0.95, 'AZ': 0.82,
            'BX': 0.95, 'BY': 0.92, 'BZ': 0.85,
            'CX': 0.95, 'CY': 0.90, 'CZ': 0.78
        }
        
    def evaluate_policies(self, uniform_target=0.95):
        z_uniform = normal_ppf(uniform_target)
        
        uniform_capital_total = 0.0
        diff_capital_total = 0.0
        
        sku_comparisons = []
        for s in self.skus:
            # Lead time demand stddev: sigma_ltd = sigma_d * sqrt(L)
            sigma_ltd = s['daily_sigma'] * math.sqrt(s['lead_time_days'])
            unit_cost = s['unit_cost']
            cell = s['cell']
            
            # Policy 1: Uniform flat target
            ss_uniform = z_uniform * sigma_ltd
            capital_uniform = ss_uniform * unit_cost
            uniform_capital_total += capital_uniform
            
            # Policy 2: Differentiated target
            target_diff = self.differentiated_targets[cell]
            z_diff = normal_ppf(target_diff)
            ss_diff = z_diff * sigma_ltd
            capital_diff = ss_diff * unit_cost
            diff_capital_total += capital_diff
            
            sku_comparisons.append({
                'sku_id': s['sku_id'],
                'cell': cell,
                'unit_cost': unit_cost,
                'ss_uniform_units': round(ss_uniform, 1),
                'capital_uniform': round(capital_uniform, 2),
                'target_diff': target_diff,
                'ss_diff_units': round(ss_diff, 1),
                'capital_diff': round(capital_diff, 2),
                'capital_delta': round(capital_diff - capital_uniform, 2)
            })
            
        capital_released = uniform_capital_total - diff_capital_total
        pct_released = (capital_released / uniform_capital_total) * 100.0 if uniform_capital_total > 0 else 0.0
        
        return {
            'uniform_total_capital': round(uniform_capital_total, 2),
            'differentiated_total_capital': round(diff_capital_total, 2),
            'capital_released': round(capital_released, 2),
            'pct_working_capital_saved': round(pct_released, 2),
            'annual_holding_cost_saved': round(capital_released * self.holding_rate, 2),
            'sku_details': sku_comparisons
        }

# Multi-SKU test portfolio
portfolio = [
    {'sku_id': 'AX-Chipset', 'cell': 'AX', 'daily_sigma': 40, 'lead_time_days': 10, 'unit_cost': 120.0},
    {'sku_id': 'AY-Sensor',  'cell': 'AY', 'daily_sigma': 65, 'lead_time_days': 14, 'unit_cost': 85.0},
    {'sku_id': 'AZ-Module',  'cell': 'AZ', 'daily_sigma': 90, 'lead_time_days': 21, 'unit_cost': 450.0},
    {'sku_id': 'BX-Bracket', 'cell': 'BX', 'daily_sigma': 30, 'lead_time_days': 7,  'unit_cost': 22.0},
    {'sku_id': 'BY-Cable',   'cell': 'BY', 'daily_sigma': 50, 'lead_time_days': 10, 'unit_cost': 15.0},
    {'sku_id': 'BZ-Switch',  'cell': 'BZ', 'daily_sigma': 70, 'lead_time_days': 14, 'unit_cost': 65.0},
    {'sku_id': 'CX-Screw',   'cell': 'CX', 'daily_sigma': 100,'lead_time_days': 5,  'unit_cost': 0.40},
    {'sku_id': 'CY-Washer',  'cell': 'CY', 'daily_sigma': 150,'lead_time_days': 5,  'unit_cost': 0.15},
    {'sku_id': 'CZ-Relay',   'cell': 'CZ', 'daily_sigma': 80, 'lead_time_days': 28, 'unit_cost': 48.0}
]

opt = DifferentialServiceLevelOptimizer(portfolio, holding_rate=0.22)
res = opt.evaluate_policies(uniform_target=0.95)

print("--- UNIFORM (95%) VS DIFFERENTIATED 9-BOX CAPITAL ALLOCATION ---")
print(f"Uniform Policy Working Capital:       ${res['uniform_total_capital']:10,.2f}")
print(f"Differentiated Policy Working Capital: ${res['differentiated_total_capital']:10,.2f}")
print(f"Working Capital Released:             ${res['capital_released']:10,.2f} ({res['pct_working_capital_saved']}%)")
print(f"Annual Holding Cost Reduction:        ${res['annual_holding_cost_saved']:10,.2f}/yr")
"""

p4_mcq = {
    "question": "What is the primary financial benefit of implementing differential service levels across the 9-Box ABC/XYZ matrix compared to a blanket uniform 95% service level?",
    "options": [
        "It releases substantial working capital by intentionally lowering buffer stock on erratic, expensive items (Cell AZ) while increasing availability on predictable core revenue drivers (Cell AX).",
        "It eliminates all supplier replenishment lead-time variability across the maritime transport network.",
        "It guarantees that every SKU in the warehouse achieves exactly zero stockouts over a three-year operating horizon.",
        "It removes the need to track inventory carrying costs on balance sheet accounting reports."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "A blanket policy wastes massive capital hoarding buffer stock on erratic, expensive items (AZ/BZ). Differential policies trim safety stock on lumpy items and boost reliability on high-volume items, freeing cash."
}

# -------------------------------------------------------------
# Part 5: Building an Enterprise ABC/XYZ Matrix Engine from First Principles
# -------------------------------------------------------------
p5_say = [
    "To conclude Day 22, we synthesize all mathematical models and governance frameworks into a full, end-to-end Enterprise ABC/XYZ Inventory Optimization Engine. In enterprise data warehouse architectures (such as Snowflake, Databricks, or BigQuery), this pipeline runs periodically (e.g., quarterly or monthly) across the entire product catalog, re-calibrating SKU classifications, re-setting ERP safety stock parameters, and generating executive exception dashboards.",

    "The end-to-end analytics workflow executes four computational phases: In Phase One (Monetary Aggregation), the engine extracts historical sales orders over a 52-week lookback horizon, aggregates total unit demand and unit cost for each SKU, and computes Annual Dollar Usage. It sorts the catalog descending by ADU and identifies the Pareto inflection points to assign Class A (top 80% cumulative value), Class B (next 15%), and Class C (final 5%).",

    "In Phase Two (Volatility Profiling), the engine calculates the weekly demand time series for each SKU, filtering out promotion anomalies if necessary. It computes the arithmetic mean weekly demand, sample standard deviation, and Coefficient of Variation (CV). It flags intermittent zero-demand periods, computes Average Demand Interval (ADI), and assigns Class X (CV < 0.25), Class Y (0.25 <= CV <= 0.60), and Class Z (CV > 0.60).",

    "In Phase Three (Matrix Cross-Tabulation & Governance Binding), the engine joins the ABC and XYZ classifications to assign each SKU to its 9-box cell. For each cell, it binds the designated replenishment policy, reorder review frequency, and target Cycle Service Level. In Phase Four (Financial Optimization & Parameter Export), the engine computes the required safety stock in units and dollars under both uniform and differentiated policies, flags SKU rationalization candidates in Cell CZ, and produces actionable ERP configuration parameters ready for ingestion into SAP, NetSuite, or Microsoft Dynamics.",

    "In modern cloud analytics architectures, this classification pipeline is materialized as a set of idempotent transformation models (such as dbt SQL pipelines orchestrated in Databricks or Snowflake). By maintaining a historical audit log of SKU classifications, the system computes monthly Transition Probability Matrices for catalog migration. Operations executives track key performance indicators, such as the Volatility Transition Rate (the percentage of items drifting from X into Z due to demand fragmentation) and the SKU Proliferation Index (the net growth of Cell CZ over trailing twelve-month periods).",

    "Furthermore, the engine integrates directly with enterprise Procurement Alerting systems. When an expensive Class A item experiences an abrupt volatility surge that threatens to push it from Cell AX into Cell AZ, the system triggers an immediate anomaly notification to category supply planners. Rather than discovering supply chain stress months later when massive backorders accumulate, planners intervene proactively, conducting root-cause investigations with sales teams to determine whether the fluctuation was an isolated multi-truckload institutional order or a permanent structural shift in customer purchasing behavior.",

    "Finally, by linking portfolio Gini concentration metrics to company-wide financial reporting, the analytics team equips executive leadership with a clear, quantitative gauge of enterprise supply chain risk. An increasing Gini coefficient coupled with expanding CZ long tails warns management that working capital is becoming trapped in dead assets while corporate revenue depends on an increasingly narrow base of core items. Armed with this insight, leadership executes targeted product line cleanups and preserves balance sheet health.",

    "By executing this comprehensive workflow from first principles, analytics professionals bridge the gap between high-level econometric theory and operational frontline supply chain execution. The organization gains complete visibility into portfolio risk, slashes inventory holding costs, protects key enterprise accounts, and establishes a disciplined, data-driven operating rhythm.",

    "In the accompanying Python implementation, we build this comprehensive Enterprise ABC/XYZ Matrix Engine from first principles without external dependencies. We simulate a 30-SKU enterprise catalog, execute all four analytical phases, compute the portfolio Lorenz curve and Gini coefficient, and output the master operational configuration table."
]

p5_code = r"""# Pure Python Comprehensive Enterprise ABC/XYZ Inventory Engine
import math
import random

random.seed(42)

class MasterEnterpriseInventoryClassifier:
    def __init__(self, skus_metadata, weekly_transactions):
        self.metadata = {item['sku_id']: item for item in skus_metadata}
        self.transactions = weekly_transactions # dict of {sku_id: [w1, ..., w52]}
        self.catalog_results = []
        self._run_pipeline()
        
    def _run_pipeline(self):
        # Phase 1 & 2: Compute ADU and Volatility
        temp_items = []
        for sku_id, sales_history in self.transactions.items():
            meta = self.metadata[sku_id]
            unit_cost = meta['unit_cost']
            lead_time = meta['lead_time_days']
            
            annual_units = sum(sales_history)
            annual_revenue = annual_units * unit_cost
            
            n = len(sales_history)
            mean_w = annual_units / float(n) if n > 0 else 0.0
            variance_w = sum((x - mean_w) ** 2 for x in sales_history) / float(n - 1) if n > 1 else 0.0
            std_w = math.sqrt(variance_w)
            cv = (std_w / mean_w) if mean_w > 0 else 999.0
            
            temp_items.append({
                'sku_id': sku_id,
                'title': meta.get('title', sku_id),
                'unit_cost': unit_cost,
                'lead_time_days': lead_time,
                'annual_units': annual_units,
                'annual_revenue': annual_revenue,
                'mean_weekly_demand': mean_w,
                'std_weekly_demand': std_w,
                'cv': cv
            })
            
        # Phase 1: Sort by annual revenue for ABC
        temp_items.sort(key=lambda x: x['annual_revenue'], reverse=True)
        total_portfolio_rev = sum(x['annual_revenue'] for x in temp_items)
        cum_rev = 0.0
        
        for item in temp_items:
            cum_rev += item['annual_revenue']
            cum_pct = (cum_rev / total_portfolio_rev) * 100.0 if total_portfolio_rev > 0 else 100.0
            item['cum_rev_pct'] = cum_pct
            
            # ABC assignment
            if cum_pct <= 80.0:
                item['abc'] = 'A'
            elif cum_pct <= 95.0:
                item['abc'] = 'B'
            else:
                item['abc'] = 'C'
                
            # XYZ assignment
            cv = item['cv']
            if cv < 0.25:
                item['xyz'] = 'X'
            elif cv <= 0.60:
                item['xyz'] = 'Y'
            else:
                item['xyz'] = 'Z'
                
            item['matrix_cell'] = f"{item['abc']}{item['xyz']}"
            
        self.catalog_results = temp_items
        self.total_revenue = total_portfolio_rev
        
    def get_matrix_crosstab(self):
        crosstab = {f"{a}{x}": 0 for a in ['A', 'B', 'C'] for x in ['X', 'Y', 'Z']}
        for item in self.catalog_results:
            crosstab[item['matrix_cell']] += 1
        return crosstab

# Generate 30 realistic enterprise SKUs
skus_meta = []
sales_tx = {}

for i in range(1, 31):
    s_id = f"SKU-{i:03d}"
    cost = round(random.uniform(5.0, 350.0), 2)
    lt = random.choice([5, 7, 10, 14, 21])
    skus_meta.append({'sku_id': s_id, 'title': f'Industrial Item {i}', 'unit_cost': cost, 'lead_time_days': lt})
    
    # Generate demand profile with varying skew and volatility
    base_demand = int(random.uniform(20, 800) / (1.0 + (i * 0.15)))
    volatility = random.choice([0.15, 0.35, 0.85])
    
    weekly = []
    for _ in range(52):
        if volatility > 0.70 and random.random() < 0.50:
            weekly.append(0) # intermittent
        else:
            weekly.append(max(0, int(round(random.gauss(base_demand, base_demand * volatility)))))
    sales_tx[s_id] = weekly

classifier = MasterEnterpriseInventoryClassifier(skus_meta, sales_tx)
crosstab = classifier.get_matrix_crosstab()

print("--- 30-SKU ENTERPRISE ABC/XYZ MATRIX DISTRIBUTION ---")
for a in ['A', 'B', 'C']:
    row_str = " | ".join([f"{a}{x}: {crosstab[f'{a}{x}']:2d} SKUs" for x in ['X', 'Y', 'Z']])
    print(f"  Row Class {a} -> [ {row_str} ]")

print("\nSample Item Classifications:")
for item in classifier.catalog_results[:5]:
    print(f"  {item['sku_id']} | Rev: ${item['annual_revenue']:9,.2f} ({item['cum_rev_pct']:5.1f}%) | CV: {item['cv']:5.2f} | Cell: {item['matrix_cell']}")
"""

p5_mcq = {
    "question": "What is the recommended strategic action for catalog items diagnosed in Cell CZ (Low Monetary Value, High Demand Volatility)?",
    "options": [
        "Conduct SKU rationalization, enforce minimum order quantities (MOQ), transfer stocking to third-party distributors, or initiate phase-out.",
        "Deploy Vendor-Managed Inventory (VMI) with daily electronic data interchange (EDI) purchase orders.",
        "Increase safety stock targets to 99% Cycle Service Level using expedited air freight.",
        "Apply linear regression trend forecasting without evaluating zero-demand intervals."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Cell CZ items generate tiny financial returns while consuming high administrative and warehouse tracking effort. Best practice is SKU pruning, MOQ enforcement, or phasing them out."
}

# -------------------------------------------------------------
# DAY_DATA Aggregation & Validation
# -------------------------------------------------------------
DAY_DATA = {
    "day": 22,
    "courseId": "bcom_ana",
    "title": "Inventory ABC/XYZ Classification: Pareto Skew, Coefficient of Variation & SKU Service Levels",
    "description": "Master multi-dimensional inventory portfolio governance: Pareto Annual Dollar Usage (ADU), the Lorenz curve and Gini coefficient, the XYZ Coefficient of Variation (CV) matrix, the 9-Box ABC/XYZ operational framework, and differential service level capital optimization.",
    "parts": [
        {
            "title": "The Pareto Principle in SKU Portfolio Management: Cumulative Revenue & Lorenz Asymmetry",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "title": "XYZ Volatility Matrix: Demand Coefficient of Variation (CV) & Predictability Thresholds",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "title": "The 9-Box Multi-Dimensional ABC/XYZ Governance Matrix",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "title": "Differential Service Level Optimization Across the SKU Matrix",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "title": "Building an Enterprise ABC/XYZ Matrix Engine from First Principles",
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
