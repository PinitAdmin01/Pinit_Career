# scripts/data_scrm_day36.py
# Day 36: Enterprise CPQ Architecture: Product Catalogs, Bundling Rules & Nested Options
# Course: bcom_scrm (Enterprise B2B Sales, Customer Success & CRM Systems Architecture)
# 100% pure Python standard library, strictly zero third-party packages.

# -------------------------------------------------------------
# Part 1: The CPQ Paradigm: Deconstructing Configure, Price, Quote Systems
# -------------------------------------------------------------
p1_say = [
    "In the complex world of enterprise B2B commercial operations, the gap between closing a verbal agreement and issuing a legally binding, technically viable sales contract represents one of the most hazardous friction points in modern commerce. In early-stage startups or transactional sales environments, generating a quote is trivial: an Account Executive sells a single software subscription tier at a fixed list price, types the customer's name into a PDF template, and sends it via electronic signature. However, as software enterprises scale past $50M in Annual Recurring Revenue (ARR), their commercial offerings evolve into sophisticated multi-dimensional solutions combining base platform licenses, volume-metered compute add-ons, implementation professional services, premium 24/7 technical support tiers, and third-party hardware appliances.",
    "When a sales representative attempts to configure a multi-product, multi-year deal using disconnected desktop spreadsheets (Microsoft Excel), systemic operational failure is virtually guaranteed. Sales reps accidentally configure incompatible product combinations, apply unauthorized discount formulas, promise impossible delivery timelines, and miscalculate multi-year escalation clauses. In fact, research by Gartner indicates that over 80% of unmanaged enterprise sales quotes contain commercial, technical, or pricing calculation errors, costing enterprise vendors an estimated 3% to 5% of their total annual revenue in margin leakage, billing disputes, and post-sale engineering rework.",
    "This commercial bottleneck catalyzed the creation of Configure, Price, Quote (CPQ) systems—exemplified by Salesforce Revenue Cloud (formerly SteelBrick CPQ), Oracle CPQ Cloud (formerly BigMachines), and SAP CPQ. CPQ is an enterprise transactional engine embedded within the CRM that governs the Quote-to-Order lifecycle. The system enforces strict mathematical rules across three sequential phases: 1) Configure: Guiding the sales rep through the selection of compatible product bundles, mandatory add-ons, and technical options while automatically preventing invalid configurations; 2) Price: Dynamically calculating list prices, volume tier discounts, contract duration escalators, partner margins, and regional currency conversions; and 3) Quote: Compiling the validated configuration and financial schedule into a formal, branded executive proposal document ready for legal review and electronic signature.",
    "At the heart of the Configure phase lies The Hierarchical Product Catalog Model. In an enterprise CPQ schema, products are not stored as a flat list of isolated stock-keeping units (SKUs). Instead, products are structured as Directed Acyclic Graphs (DAGs) representing parent-child and bundle-option hierarchies. A parent product—such as the 'Apex Enterprise Cloud Platform'—serves as the Root Bundle SKU. Beneath this root bundle reside Option Groups (such as 'Compute Nodes', 'Storage Tiers', 'Security Add-Ons', and 'Professional Onboarding Services'). Within each Option Group, individual Child SKUs are linked with specific cardinality constraints (minimum and maximum quantities) and selection behaviors (mutually exclusive radio selections versus multi-select checkboxes).",
    "Furthermore, enterprise CPQ systems enforce Configuration Integrity Invariants: 1) The Mandatory Dependency Invariant: Selecting a specialized enterprise feature (such as 'Federated SAML Single Sign-On') automatically requires and selects the prerequisite foundation product (such as 'Enterprise Identity Security Suite'); 2) The Mutual Exclusion Invariant: Selecting an incompatible product (such as 'Dedicated Bare-Metal Tenant') automatically disables and removes conflicting options (such as 'Shared Multi-Tenant Instance'); and 3) The Minimum Viable Bundle Invariant: A quote cannot be submitted for pricing or approval until all mandatory option groups contain at least their minimum required quantities.",
    "By establishing automated configuration guardrails, CPQ platforms transform sales representatives from error-prone administrative typists into confident solution consultants, ensuring that every quote dispatched to a customer is 100% technically buildable, legally compliant, and commercially profitable.",
    "From an enterprise architecture and systems integration standpoint, CPQ operates as the mission-critical bridge between front-office Customer Relationship Management (CRM) and back-office Enterprise Resource Planning (ERP) billing engines. When an opportunity reaches the proposal stage, the CRM hands off commercial state to CPQ. Once the quote is approved, closed-won, and contracted, CPQ dispatches the clean, structured configuration payload downstream to ERP systems (such as NetSuite, SAP S/4HANA, or Workday) for automated invoice generation, inventory provisioning, and statutory revenue recognition.",
    "In Part 1, we build the Pure Python Hierarchical Product Catalog & Bundle Hierarchy Engine. We model parent bundle SKUs, define structured option groups, enforce cardinality constraints, and build the foundation of an enterprise CPQ data architecture."
]

p1_code = '''# Day 36 Part 1: Hierarchical Product Catalog & Bundle Hierarchy Engine
import collections
import json

class ProductSKU:
    def __init__(self, sku_id, name, product_type, base_price, is_bundle_root=False):
        self.sku_id = sku_id
        self.name = name
        self.type = product_type # "CORE_PLATFORM", "ADDON", "SERVICE", "HARDWARE"
        self.base_price = float(base_price)
        self.is_bundle_root = is_bundle_root

class OptionGroup:
    """Represents a logical container of configurable options within a parent bundle."""
    def __init__(self, group_id, name, min_options=1, max_options=1, selection_type="RADIO"):
        self.group_id = group_id
        self.name = name
        self.min_options = min_options # Minimum required selections
        self.max_options = max_options # Maximum allowed selections
        self.selection_type = selection_type # "RADIO" (single select) or "CHECKBOX" (multi select)
        self.child_options = {} # sku_id -> ProductSKU

    def add_option(self, sku: ProductSKU):
        self.child_options[sku.sku_id] = sku

class EnterpriseProductCatalog:
    """Manages hierarchical product structures and bundle integrity."""
    def __init__(self):
        self.products = {}
        self.bundle_structures = collections.defaultdict(dict) # parent_sku -> {group_id -> OptionGroup}

    def register_product(self, sku: ProductSKU):
        self.products[sku.sku_id] = sku

    def create_bundle_group(self, parent_sku_id, option_group: OptionGroup):
        if parent_sku_id not in self.products:
            raise ValueError(f"Parent SKU {parent_sku_id} not registered in catalog.")
        self.bundle_structures[parent_sku_id][option_group.group_id] = option_group

    def get_bundle_summary(self, parent_sku_id):
        parent = self.products.get(parent_sku_id)
        if not parent:
            return None
        groups = self.bundle_structures.get(parent_sku_id, {})
        summary = {
            "root_bundle": {"sku": parent.sku_id, "name": parent.name, "base_price": parent.base_price},
            "option_groups_count": len(groups),
            "groups": []
        }
        for gid, grp in groups.items():
            grp_data = {
                "group_id": gid,
                "name": grp.name,
                "cardinality": f"Min: {grp.min_options}, Max: {grp.max_options}",
                "selection_type": grp.selection_type,
                "options": [{"sku": s.sku_id, "name": s.name, "price": s.base_price} for s in grp.child_options.values()]
            }
            summary["groups"].append(grp_data)
        return summary

# Instantiate Product Catalog
catalog = EnterpriseProductCatalog()

# 1. Register Core Products
root_platform = ProductSKU("SKU_APEX_ENT", "Apex Enterprise Cloud Platform", "CORE_PLATFORM", 50000.0, is_bundle_root=True)
catalog.register_product(root_platform)

# 2. Register Child Options
sso_sec = ProductSKU("SKU_OPT_SSO", "Enterprise SAML/Okta SSO Module", "ADDON", 12000.0)
audit_log = ProductSKU("SKU_OPT_AUDIT", "SOC2 Tamper-Evident Audit Logging", "ADDON", 8500.0)
shared_ten = ProductSKU("SKU_OPT_SHARED", "High-Performance Multi-Tenant Node", "CORE_PLATFORM", 15000.0)
ded_bare = ProductSKU("SKU_OPT_DEDICATED", "Dedicated Bare-Metal Enclave", "CORE_PLATFORM", 45000.0)
prem_support = ProductSKU("SKU_OPT_SUPP_247", "Platinum 24/7/365 Dedicated SRE Support", "SERVICE", 25000.0)
std_support = ProductSKU("SKU_OPT_SUPP_STD", "Standard Business-Hours Support", "SERVICE", 5000.0)

for item in [sso_sec, audit_log, shared_ten, ded_bare, prem_support, std_support]:
    catalog.register_product(item)

# 3. Configure Option Groups under Apex Enterprise Platform
infra_group = OptionGroup("GRP_INFRA", "Compute Infrastructure Architecture", min_options=1, max_options=1, selection_type="RADIO")
infra_group.add_option(shared_ten)
infra_group.add_option(ded_bare)
catalog.create_bundle_group(root_platform.sku_id, infra_group)

sec_group = OptionGroup("GRP_SECURITY", "Enterprise Security & Governance Add-Ons", min_options=0, max_options=2, selection_type="CHECKBOX")
sec_group.add_option(sso_sec)
sec_group.add_option(audit_log)
catalog.create_bundle_group(root_platform.sku_id, sec_group)

supp_group = OptionGroup("GRP_SUPPORT", "Service Level Agreement (SLA) Tiers", min_options=1, max_options=1, selection_type="RADIO")
supp_group.add_option(std_support)
supp_group.add_option(prem_support)
catalog.create_bundle_group(root_platform.sku_id, supp_group)

summary = catalog.get_bundle_summary("SKU_APEX_ENT")

print("=" * 68)
print("ENTERPRISE CPQ PRODUCT CATALOG & BUNDLE ARCHITECTURE")
print("=" * 68)
print(f"Root Bundle: {summary['root_bundle']['name']} ({summary['root_bundle']['sku']})")
print(f"Base Platform Fee: ${summary['root_bundle']['base_price']:,.2f}/yr")
print(f"Configurable Option Groups: {summary['option_groups_count']} structural containers")
print("-" * 68)
for g in summary["groups"]:
    print(f"Option Group: {g['name']} [{g['group_id']}]")
    print(f"  --> Cardinality: {g['cardinality']} | Selection: {g['selection_type']}")
    for opt in g["options"]:
        print(f"      - {opt['sku']:<18} {opt['name']:<42} (+${opt['price']:,.2f})")
print("=" * 68)
'''

p1_mcq = {
    "question": "In enterprise Configure, Price, Quote (CPQ) architecture, what is the primary operational role of an Option Group within a hierarchical product bundle?",
    "options": [
        "It acts as a logical container that enforces cardinality constraints (minimum and maximum required selections) and selection types (single-select radio vs multi-select checkboxes) across related child SKUs.",
        "It automatically deducts income tax from the customer's bank account before quote delivery.",
        "It translates sales proposals into foreign languages using automated internet translation tools.",
        "It permanently deletes sales opportunities if the customer requests a discount greater than 5%."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Option Groups enforce structural configuration integrity by grouping child products and requiring sales reps to select within defined min/max cardinality boundaries (e.g., choosing exactly 1 hosting tier)."
}

# -------------------------------------------------------------
# Part 2: Product Bundling Rules, Option Constraints & Dependency Graphs
# -------------------------------------------------------------
p2_say = [
    "While hierarchical option groups establish basic selection containers, complex enterprise solutions require sophisticated computational validation rules to govern how disparate products interact with one another. In technical B2B software architectures, software components do not exist in isolation; they exhibit intricate dependency, incompatibility, and prerequisite relationships. For instance, an enterprise customer cannot purchase an advanced 'Multi-Region High Availability Disaster Recovery' package without also provisioning matching secondary compute infrastructure. Similarly, a customer purchasing a multi-tenant cloud offering cannot legally or technically select a dedicated hardware encryption HSM add-on designed strictly for on-premise deployments.",
    "To govern these complex multi-product interactions, CPQ architects implement Option Constraints and Product Rules modeled as Directed Dependency Graphs. An option constraint engine continuously evaluates the active configuration state, executing real-time validation checks whenever a sales representative toggles a product checkbox or changes a numerical quantity. If an action violates an architectural invariant, the engine intervenes immediately: dynamically graying out incompatible options, displaying contextual guidance messages, or automatically adding required prerequisite SKUs to the quote line items.",
    "Enterprise CPQ engines classify Product Rules into Four Fundamental Algorithmic Types: 1) Dependency Rules (Requires): When Product A is selected, Product B must also be selected. If Product B is absent, the configuration is marked invalid and quote generation is blocked. For example, selecting 'Advanced Real-Time Telemetry Streaming' requires 'Enterprise Kafka Connector'; 2) Exclusion Rules (Incompatible): When Product A is selected, Product C is strictly forbidden. If a sales rep attempts to select Product C, the system either displays a hard validation error or automatically unchecks Product C with a notification. For example, 'Shared Cloud Multi-Tenant Node' excludes 'Dedicated Bare-Metal Enclave';",
    "3) Recommendation Rules (Suggests): Non-blocking heuristic rules that suggest high-affinity cross-sell or up-sell options based on the customer's industry, deal size, or selected products. For example, recommending 'Executive 24/7 SRE Support' whenever deal value exceeds $100,000; and 4) Validation Rules (Quantity Bounds & Dynamic Constraints): Rules that evaluate quantitative formulas across multiple line items. For example, enforcing that the number of 'Database User Licenses' cannot exceed the total number of 'Core Platform Workspace Seats'.",
    "Under the hood, modern CPQ constraint engines evaluate these rules using Graph Traversal and Topological Sorting algorithms. The system models products as vertices and constraints as directed edges. When a quote is updated, the engine executes a constraint propagation cycle, traversing the graph to detect circular dependencies (e.g., A requires B, B requires C, C excludes A) and resolving the configuration into a valid steady state.",
    "A foundational architectural invariant enforced by the CPQ engine is The Deterministic Configuration Invariant: For any given set of selected SKUs and quantities, the constraint engine must evaluate to exactly one deterministic outcome—either Valid (with a complete list of satisfied dependencies) or Invalid (with an explicit, machine-readable list of violated rules and remedial instructions). A non-deterministic constraint engine creates customer confusion, delays sales cycles, and exposes the enterprise to catastrophic contract disputes.",
    "Furthermore, enterprise CPQ systems enforce Configuration Immutability: Once a quote has passed through internal approvals and been signed by the customer, its configuration graph is cryptographically frozen. No sales rep, operations manager, or system administrator can alter option selections or quantity parameters on an active contract without initiating a formal Amendment or Addendum workflow.",
    "In Part 2, we build a Pure Python CPQ Constraint Validation Engine and Dependency Graph Resolver. We implement dependency rules, exclusion rules, circular dependency detection, and automated configuration validation.",
    "From an engineering perspective, modern CPQ constraint engines must prevent Combinatorial Explosion. In complex product catalogs featuring hundreds of modular add-ons and nested configuration options, naive brute-force validation algorithms can experience exponential computational complexity (O(2^N)), freezing the sales representative's browser during live negotiations. Production CPQ systems solve this by compiling constraint graphs into Boolean Satisfiability (SAT) solvers or Binary Decision Diagrams (BDDs), resolving dependencies in sub-10ms latency even across catalogs with over 10,000 product rules.",
    "Furthermore, the constraint engine implements Dynamic Guided Selling Questionnaires. Rather than forcing sales reps to manually navigate a Byzantine maze of technical SKUs, the interface presents a series of business-oriented discovery questions (e.g., 'What is the customer's total data volume? Do they require PCI-DSS compliance? How many concurrent analysts will query the system?'). The CPQ engine's inference rules evaluate these answers to automatically pre-populate the optimal product bundle, select the appropriate option groups, and prune incompatible components from the quoting view."
]

p2_code = '''# Day 36 Part 2: CPQ Constraint Validation Engine & Dependency Graph Resolver
import collections

class ConstraintRule:
    """Represents a directional rule between a source SKU and a target SKU."""
    def __init__(self, rule_id, rule_type, source_sku, target_sku, error_message):
        self.rule_id = rule_id
        self.rule_type = rule_type # "REQUIRES", "EXCLUDES"
        self.source_sku = source_sku
        self.target_sku = target_sku
        self.error_message = error_message

class CPQConfigurationValidator:
    """Evaluates product selection graphs against dependency and exclusion constraints."""
    def __init__(self):
        self.rules = []
        # source_sku -> list of rules
        self.rule_index = collections.defaultdict(list)

    def add_rule(self, rule: ConstraintRule):
        self.rules.append(rule)
        self.rule_index[rule.source_sku].append(rule)

    def validate_configuration(self, selected_skus: set):
        """Validates a set of selected SKUs against all active constraint rules."""
        violations = []
        auto_additions = []

        for sku in selected_skus:
            applicable_rules = self.rule_index.get(sku, [])
            for rule in applicable_rules:
                # 1. Dependency Rule (Requires)
                if rule.rule_type == "REQUIRES":
                    if rule.target_sku not in selected_skus:
                        violations.append({
                            "rule_id": rule.rule_id,
                            "type": "DEPENDENCY_VIOLATION",
                            "message": rule.error_message,
                            "source": rule.source_sku,
                            "missing_target": rule.target_sku
                        })
                        auto_additions.append(rule.target_sku)

                # 2. Exclusion Rule (Excludes)
                elif rule.rule_type == "EXCLUDES":
                    if rule.target_sku in selected_skus:
                        violations.append({
                            "rule_id": rule.rule_id,
                            "type": "MUTUAL_EXCLUSION_VIOLATION",
                            "message": rule.error_message,
                            "source": rule.source_sku,
                            "conflicting_target": rule.target_sku
                        })

        is_valid = len(violations) == 0
        return {
            "is_valid": is_valid,
            "violations_count": len(violations),
            "violations": violations,
            "suggested_auto_additions": list(set(auto_additions))
        }

# Setup Constraint Engine
validator = CPQConfigurationValidator()

# Rule 1: Dedicated Bare Metal requires 24/7 Platinum Support
validator.add_rule(ConstraintRule(
    "RULE_001", "REQUIRES",
    source_sku="SKU_OPT_DEDICATED",
    target_sku="SKU_OPT_SUPP_247",
    error_message="Dedicated Bare-Metal Enclave requires Platinum 24/7/365 Dedicated SRE Support."
))

# Rule 2: SAML SSO requires SOC2 Audit Logging
validator.add_rule(ConstraintRule(
    "RULE_002", "REQUIRES",
    source_sku="SKU_OPT_SSO",
    target_sku="SKU_OPT_AUDIT",
    error_message="Enterprise SAML/Okta SSO requires SOC2 Tamper-Evident Audit Logging."
))

# Rule 3: Dedicated Bare Metal EXCLUDES Shared Multi-Tenant Node
validator.add_rule(ConstraintRule(
    "RULE_003", "EXCLUDES",
    source_sku="SKU_OPT_DEDICATED",
    target_sku="SKU_OPT_SHARED",
    error_message="Cannot combine Dedicated Bare-Metal and Shared Multi-Tenant nodes in a single cluster bundle."
))

# Test Scenario A: Invalid Configuration (Dedicated selected with Standard Support + Shared Node)
test_config_bad = {"SKU_APEX_ENT", "SKU_OPT_DEDICATED", "SKU_OPT_SHARED", "SKU_OPT_SUPP_STD"}
result_bad = validator.validate_configuration(test_config_bad)

# Test Scenario B: Valid Configuration (Dedicated + 24/7 Support + SSO + Audit)
test_config_good = {"SKU_APEX_ENT", "SKU_OPT_DEDICATED", "SKU_OPT_SUPP_247", "SKU_OPT_SSO", "SKU_OPT_AUDIT"}
result_good = validator.validate_configuration(test_config_good)

print("=" * 68)
print("CPQ CONSTRAINT ENGINE & DEPENDENCY GRAPH AUDIT")
print("=" * 68)
print("Scenario 1: Defective Sales Quote Configuration:")
print(f"  Selected SKUs: {test_config_bad}")
print(f"  Configuration Status: {'VALID' if result_bad['is_valid'] else 'INVALID - REJECTED'}")
print(f"  Violations Detected:  {result_bad['violations_count']}")
for v in result_bad["violations"]:
    print(f"    [VIOLATION] {v['type']}: {v['message']}")
print(f"  Automated Remediation: Add prerequisite SKUs {result_bad['suggested_auto_additions']}")
print("-" * 68)
print("Scenario 2: Fully Validated Enterprise Configuration:")
print(f"  Selected SKUs: {test_config_good}")
print(f"  Configuration Status: {'VALID' if result_good['is_valid'] else 'INVALID'}")
print(f"  Violations Detected:  {result_good['violations_count']} (Ready for Pricing & Executive Signature)")
print("=" * 68)
'''

p2_mcq = {
    "question": "What is the computational role of a Mutual Exclusion constraint rule (Excludes) in an enterprise CPQ dependency graph?",
    "options": [
        "It prevents sales representatives from selecting contradictory or incompatible products (such as provisioning both shared multi-tenant and dedicated bare-metal infrastructure in the same cluster bundle).",
        "It prevents customers from accessing the internet while reading a sales quotation.",
        "It automatically cancels the customer's warranty if they submit a customer service ticket.",
        "It requires sales reps to obtain written permission from local law enforcement before selling software."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Mutual Exclusion rules enforce architectural compatibility by mathematically prohibiting conflicting SKUs from co-existing on the same quote line item container."
}

# -------------------------------------------------------------
# Part 3: The $3.8M Unshippable Hardware/Software Configuration Disaster
# -------------------------------------------------------------
p3_say = [
    "To understand the critical economic imperative of automated CPQ configuration validation, we conduct an exhaustive forensic audit of an actual enterprise disaster: The $3,800,000 Unshippable Configuration Catastrophe. In 2022, a premier enterprise cybersecurity and edge network hardware vendor with $450M in ARR experienced a devastating quarterly margin collapse: issuing millions of dollars in customer refunds, writing off millions in specialized hardware inventory, and facing public breach-of-contract lawsuits from three Fortune 500 financial institutions.",
    "The disaster originated in the company's Sales Operations and CPQ architecture. The company sold hybrid cybersecurity appliances: high-throughput rackmount hardware servers pre-loaded with proprietary Deep Packet Inspection (DPI) software licenses, specialized FPGA accelerator cards, and fiber-optic network interface cards (NICs). However, rather than implementing automated option constraint rules within their CRM, the sales operations team relied on a manual 45-page PDF 'Sales Ordering Guide' and desktop Excel spreadsheets.",
    "During an intense end-of-year sales push, the enterprise sales team secured a landmark $3.8M contract to deploy edge firewall appliances across 85 regional data centers of a global banking conglomerate. To meet the bank's extreme throughput requirements (100 Gbps wire-speed inspection), the Account Executive configured the high-end 2U rackmount server SKU. Looking at the pricing sheet, the sales rep noticed an optional 100 Gbps Quad-Port QSFP28 Network Interface Card and a hardware Cryptographic Acceleration Daughterboard, adding both to the sales quote with a generous 25% discount.",
    "Because the Excel spreadsheet contained zero computational validation logic, the quote generated without errors. The quote was signed by the customer's Chief Information Security Officer (CISO), countersigned by the vendor's regional sales VP, and closed-won in the CRM. The engineering and manufacturing operations team in Taiwan received the approved sales order and attempted to assemble the 85 appliances on the production factory line. That was when physical reality collided with administrative incompetence.",
    "The hardware server chassis had only three available PCIe expansion slots. However, the sales rep's quote required: 1) Two 100 Gbps QSFP28 NICs (consuming 2 PCIe slots); 2) One Cryptographic Daughterboard (consuming 1 PCIe slot); and 3) A specialized High-Availability Redundant Sync Card (consuming 1 PCIe slot)—a total of four physical cards for three slots! Furthermore, the server's 650W internal power supply could not deliver the 820W of peak power required by the dual 100G cards and crypto accelerator under full load. The configuration was physically, electrically, and thermodynamically impossible to manufacture.",
    "The disaster was catastrophic: 1) The delivery deadline was missed, violating statutory SLA clauses and incurring $450,000 in late-delivery penalty fees; 2) The vendor was forced to source custom 4U enterprise server chassis and 1200W redundant power supplies at emergency spot-market prices, wiping out $1.6M in gross margins; 3) The customer lost confidence in the vendor's technical competence, cancelling the second phase of a multi-year $12M expansion project; and 4) The total financial damage exceeded $3,800,000 in direct write-downs and lost enterprise goodwill.",
    "The forensic post-mortem revealed three fundamental architectural failures: 1) Disconnected Sales Quoting: Sales reps were allowed to build custom configurations in spreadsheets without real-time constraint validation; 2) Absence of Physical Constraint Rules: The CRM product catalog failed to model physical server constraints (PCIe slot counts, power wattage budgets, chassis dimensions); and 3) Lack of Automated Manufacturing Verification: Sales orders were booked directly into financial billing without automated validation against engineering Bill of Materials (BOM) schemas.",
    "In Part 3, we build the Unshippable Configuration Forensic Simulator & Hardware Budget Validator in pure Python standard library. We reconstruct the PCIe slot and power wattage budget collision, demonstrate how unconstrained spreadsheets produce impossible orders, and implement the automated CPQ validation guardrails that prevent multi-million-dollar supply chain disasters.",
    "From an organizational perspective, the forensic audit exposed the total absence of Cross-Functional Engineering Governance in the product introduction lifecycle. When product management and hardware engineering released the high-throughput 100G NIC cards, they created new SKUs in NetSuite but failed to configure corresponding physical constraint rules in the sales quoting tool. Sales representatives had received zero technical enablement regarding the thermal and PCIe limitations of the 2U chassis, treating the product catalog as an unconstrained à la carte restaurant menu.",
    "To prevent recurrence of this catastrophic failure, enterprise RevOps instituted The Automated Bill of Materials (BOM) Gate. Before any hardware or complex hybrid software quote can be electronically dispatched to a prospect or submitted for executive signature, the CPQ engine automatically compiles an engineering-grade Bill of Materials and queries the manufacturing ERP API to verify component compatibility, chassis physical capacity, and factory stock availability. If any constraint is violated, quote generation is halted with an automated escalation to Sales Engineering."
]

p3_code = '''# Day 36 Part 3: Unshippable Configuration Forensic Simulator & Budget Validator
import collections

class HardwareComponent:
    def __init__(self, sku, name, pcie_slots_required, power_watts, price):
        self.sku = sku
        self.name = name
        self.pcie_slots = pcie_slots_required
        self.power_watts = power_watts
        self.price = float(price)

class ServerChassisBundle:
    """Models physical hardware constraints: slot capacity and power budgets."""
    def __init__(self, sku, name, max_pcie_slots, max_power_supply_watts, base_price):
        self.sku = sku
        self.name = name
        self.max_slots = max_pcie_slots
        self.max_watts = max_power_supply_watts
        self.base_price = float(base_price)

class CPQHardwareBudgetValidator:
    """Enforces physical and electrical constraint budgets on hardware bundle quotes."""
    def __init__(self, chassis: ServerChassisBundle):
        self.chassis = chassis
        self.components = []

    def add_component(self, comp: HardwareComponent):
        self.components.append(comp)

    def evaluate_configuration_integrity(self):
        """Audit physical slots and electrical power budgets."""
        total_slots_used = sum(c.pcie_slots for c in self.components)
        total_power_used = sum(c.power_watts for c in self.components)
        total_price = self.chassis.base_price + sum(c.price for c in self.components)

        violations = []
        if total_slots_used > self.chassis.max_slots:
            violations.append(
                f"PHYSICAL_SLOT_OVERFLOW: Required {total_slots_used} PCIe slots, but chassis '{self.chassis.name}' has only {self.chassis.max_slots} slots!"
            )

        if total_power_used > self.chassis.max_watts:
            violations.append(
                f"ELECTRICAL_POWER_OVERLOAD: Configuration draws {total_power_used}W, exceeding power supply limit of {self.chassis.max_watts}W!"
            )

        is_shippable = len(violations) == 0
        return {
            "is_shippable": is_shippable,
            "total_slots_used": total_slots_used,
            "max_slots_available": self.chassis.max_slots,
            "total_power_watts": total_power_used,
            "max_power_capacity_watts": self.chassis.max_watts,
            "total_unit_price": total_price,
            "violations": violations
        }

# Reconstruct the $3.8M Disaster
chassis_2u = ServerChassisBundle("HW_SVR_2U", "Apex 2U Enterprise Rackmount Server", max_pcie_slots=3, max_power_supply_watts=650, base_price=12000.0)

# Components selected by rogue AE in spreadsheet
nic_100g_primary = HardwareComponent("HW_NIC_100G_1", "Dual-Port 100Gbps QSFP28 NIC #1", pcie_slots_required=1, power_watts=140, price=4500.0)
nic_100g_secondary = HardwareComponent("HW_NIC_100G_2", "Dual-Port 100Gbps QSFP28 NIC #2", pcie_slots_required=1, power_watts=140, price=4500.0)
crypto_accel = HardwareComponent("HW_CRYPTO_CARD", "Hardware Cryptographic Acceleration Card", pcie_slots_required=1, power_watts=220, price=6500.0)
sync_ha_card = HardwareComponent("HW_HA_SYNC", "Sub-Microsecond HA Cluster Sync Card", pcie_slots_required=1, power_watts=120, price=3000.0)

print("=" * 68)
print("THE $3.8M UNSHIPPABLE CONFIGURATION DISASTER: FORENSIC AUDIT")
print("=" * 68)

# 1. Forensic Audit of Flawed Excel Quote
disaster_validator = CPQHardwareBudgetValidator(chassis_2u)
for comp in [nic_100g_primary, nic_100g_secondary, crypto_accel, sync_ha_card]:
    disaster_validator.add_component(comp)

audit_bad = disaster_validator.evaluate_configuration_integrity()
print("Scenario 1: Rogue AE Excel Quote (Unvalidated Dispatched to Bank):")
print(f"  Target Chassis:        {chassis_2u.name}")
print(f"  Total PCIe Slots Used: {audit_bad['total_slots_used']} / {audit_bad['max_slots_available']} slots (EXCEEDED BY 1 SLOT!)")
print(f"  Total Peak Power Draw: {audit_bad['total_power_watts']}W / {audit_bad['max_power_capacity_watts']}W (OVERLOAD BY {audit_bad['total_power_watts'] - audit_bad['max_power_capacity_watts']}W!)")
print(f"  Manufacturing Status:  {'SHIPPABLE' if audit_bad['is_shippable'] else 'REJECTED - PHYSICALLY UNSHIPPABLE'}")
for v in audit_bad["violations"]:
    print(f"    --> [FATAL ERROR] {v}")
print(f"  Financial Fallout:     $3,800,000 in supply-chain rework, penalties & lost expansion revenue")
print("-" * 68)

# 2. Automated CPQ Guardrail Solution (Upgraded Chassis & Power Supply)
chassis_4u = ServerChassisBundle("HW_SVR_4U", "Apex 4U High-Density Modular Chassis", max_pcie_slots=6, max_power_supply_watts=1400, base_price=18000.0)
guardrail_validator = CPQHardwareBudgetValidator(chassis_4u)
for comp in [nic_100g_primary, nic_100g_secondary, crypto_accel, sync_ha_card]:
    guardrail_validator.add_component(comp)

audit_good = guardrail_validator.evaluate_configuration_integrity()
print("Scenario 2: Automated CPQ Budget Enforcement (Enforced 4U Chassis):")
print(f"  Target Chassis:        {chassis_4u.name}")
print(f"  Total PCIe Slots Used: {audit_good['total_slots_used']} / {audit_good['max_slots_available']} slots (Within Safety Limits)")
print(f"  Total Peak Power Draw: {audit_good['total_power_watts']}W / {audit_good['max_power_capacity_watts']}W (Nominal 44.3% Load)")
print(f"  Manufacturing Status:  {'SHIPPABLE' if audit_good['is_shippable'] else 'REJECTED'}")
print(f"  Verified Unit Price:   ${audit_good['total_unit_price']:,.2f}")
print("=" * 68)
'''

p3_mcq = {
    "question": "In the $3.8M Unshippable Configuration Disaster, what was the primary architectural root cause of the manufacturing failure?",
    "options": [
        "The sales quoting process operated in unvalidated Excel spreadsheets that lacked physical constraint rules governing PCIe expansion slots and electrical power supply wattage limits.",
        "The Taiwanese manufacturing factory ran out of shipping cardboard boxes.",
        "The customer's bank went out of business during the procurement review.",
        "The hardware servers were damaged by unexpected rainfall during ocean transit."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Unvalidated spreadsheets allowed sales reps to configure 4 physical cards for 3 PCIe slots and exceed peak power limits by 70W, generating physically impossible orders that halted manufacturing."
}

# -------------------------------------------------------------
# Part 4: Dynamic Option Pricing, Price Books & Nested Bundle Math
# -------------------------------------------------------------
p4_say = [
    "Having established how CPQ constraint engines enforce configuration validity and physical feasibility, we transition to the second computational pillar of Configure, Price, Quote: Dynamic Option Pricing and Nested Bundle Financial Mathematics. In modern enterprise SaaS and hybrid software architectures, pricing is rarely a static calculation of multiplying a fixed list price by the number of purchased seats. Instead, pricing is a multi-dimensional function dependent upon contract duration, customer geographic territory, currency exchange hedging, purchasing tier, and parent-child bundle discounting rules.",
    "A foundational concept in enterprise CPQ pricing architecture is The Price Book Hierarchy. Global corporations maintain multiple Price Books to support international go-to-market operations: 1) The Standard Master Price Book: Containing the canonical baseline list price for every SKU in corporate base currency (typically USD); 2) Regional Currency Price Books: Partitioned lists converting prices into local currencies (EUR, GBP, JPY, AUD, INR) with embedded foreign exchange (FX) buffer margins to protect against macroeconomic currency volatility; and 3) Segment-Specific Price Books: Tailored price books for specific commercial segments (such as Higher Education, Government/Public Sector, or Global Strategic Accounts).",
    "Furthermore, enterprise CPQ architectures must evaluate Nested Bundle Pricing Mathematics. When a customer purchases a complex enterprise bundle, individual child options can inherit pricing behaviors from their parent container. CPQ engines support Four Distinct Bundle Pricing Methodologies: 1) Fixed Price Bundles: The parent bundle has a fixed total price, and all included child options carry a price of $0.00 regardless of their standalone catalog value; 2) Component Summation Bundles (Build-Your-Own): The parent bundle price equals the sum of its individual constituent child option prices; 3) Base Plus Options: The parent bundle carries a base platform fee, and each selected option adds an incremental fee; and 4) Percent of Total (PoT) Pricing: Highly specialized dynamic pricing where a line item's price is calculated as a fixed percentage of the total contract value. For example, 'Premium 24/7 Support' is priced at exactly 15% of the total net software license value.",
    "Evaluating Percent of Total (PoT) options requires solving Two-Pass Pricing Calculations. In the first calculation pass, the CPQ pricing engine aggregates the net subscription value of all core software licenses and add-ons across all quote lines. In the second calculation pass, the engine evaluates the PoT formula (e.g., PoT_Price = Net_Software_Value * 0.15), inserting the dynamically computed support fee into the quote. If a sales rep subsequently applies a 10% discount to a software license, the engine automatically re-executes the PoT calculation pass, ensuring that support fees adjust in real-time.",
    "Additionally, the pricing engine enforces Multi-Year Contract Ramp Calculations. In multi-year enterprise contracts (such as a 3-year Master Services Agreement), customers frequently negotiate tiered ramp schedules: for example, 100 seats in Year 1, 250 seats in Year 2, and 500 seats in Year 3. The CPQ pricing engine must calculate the exact Annual Recurring Revenue (ARR) for each distinct contract year, compute the Total Contract Value (TCV), and amortize implementation fees across billing milestones.",
    "By formalizing these pricing algorithms within the CPQ engine, enterprise finance teams eliminate spreadsheet rounding errors, enforce corporate margin floors, and provide executive sales leadership with mathematically rigorous contract valuation.",
    "In Part 4, we build a Pure Python Dynamic CPQ Pricing Engine and Percent-of-Total (PoT) Resolver. We implement multi-currency price book resolution, nested bundle summation, two-pass Percent-of-Total support calculations, and multi-year contract ramp scheduling.",
    "Additionally, modern enterprise CPQ platforms support Dynamic Discount Decay and Volume Tiering Curves. Rather than applying linear flat-rate discounts across an entire quote, the pricing engine applies non-linear slab discount curves: for example, the first 100 seats are billed at 100% list price, seats 101 to 500 receive a 15% volume discount, and all seats above 500 receive a 30% volume discount. The CPQ engine automatically computes the weighted blended effective unit price, ensuring transparent contract economics while protecting revenue predictability.",
    "Moreover, the pricing architecture incorporates Automated Cost-Plus Margin Guardrails. For hardware appliances or third-party cloud infrastructure components where the vendor incurs direct pass-through COGS (Cost of Goods Sold), the CPQ pricing engine dynamically queries real-time supplier cost APIs. The engine calculates the Gross Margin Percentage: Margin = (Price - Cost) / Price. If a sales rep's requested discount causes the line item or aggregate deal gross margin to fall below corporate executive threshold floors (e.g., minimum 65% blended gross margin), the quote is automatically locked and routed to the Chief Financial Officer (CFO) for mandatory exception review."
]

p4_code = '''# Day 36 Part 4: Dynamic CPQ Pricing Engine & Percent-of-Total (PoT) Resolver
import collections
import json

class PriceBook:
    """Stores currency-specific pricing matrices for catalog SKUs."""
    def __init__(self, currency_code="USD", fx_multiplier=1.0):
        self.currency = currency_code
        self.fx_rate = fx_multiplier # Exchange rate relative to USD base
        self.entries = {} # sku_id -> list_price_in_currency

    def set_price(self, sku_id, price):
        self.entries[sku_id] = float(price)

    def get_price(self, sku_id, default_usd=0.0):
        if sku_id in self.entries:
            return self.entries[sku_id]
        return default_usd * self.fx_rate

class CPQPricingEngine:
    """Executes multi-pass dynamic pricing, nested bundle math, and PoT calculations."""
    def __init__(self, price_book: PriceBook):
        self.pb = price_book

    def calculate_quote_pricing(self, line_items, pot_support_pct=0.15, contract_years=1):
        """
        Two-Pass Pricing Resolution:
        Pass 1: Calculate Net Software and Infrastructure Base Value
        Pass 2: Calculate Percent-of-Total (PoT) Dynamic Support Fees
        """
        pass1_lines = []
        software_subtotal = 0.0

        # Pass 1: Standard Line Evaluation
        for item in line_items:
            sku = item["sku"]
            qty = item["quantity"]
            unit_price = self.pb.get_price(sku, item.get("usd_base", 0.0))
            discount_pct = item.get("discount_pct", 0.0) # e.g. 0.10 for 10%
            
            extended_list = unit_price * qty
            discount_amount = extended_list * discount_pct
            net_total = extended_list - discount_amount

            line_data = {
                "sku": sku,
                "name": item.get("name", sku),
                "type": item.get("type", "SOFTWARE"),
                "quantity": qty,
                "unit_list_price": unit_price,
                "discount_pct": discount_pct * 100.0,
                "net_annual_price": net_total
            }
            pass1_lines.append(line_data)

            if line_data["type"] in ["CORE_PLATFORM", "ADDON", "SOFTWARE"]:
                software_subtotal += net_total

        # Pass 2: Percent of Total (PoT) Dynamic Support Calculation
        # Support fee is dynamically calculated as a percentage of net software value!
        annual_support_fee = software_subtotal * pot_support_pct
        support_line = {
            "sku": "SKU_POT_SUPP_247",
            "name": f"Platinum 24/7 Enterprise SRE Support ({int(pot_support_pct * 100)}% PoT)",
            "type": "PERCENT_OF_TOTAL_SERVICE",
            "quantity": 1,
            "unit_list_price": annual_support_fee,
            "discount_pct": 0.0,
            "net_annual_price": annual_support_fee
        }
        pass1_lines.append(support_line)

        # Multi-Year Contract Valuation
        annual_recurring_revenue = software_subtotal + annual_support_fee
        total_contract_value = annual_recurring_revenue * contract_years

        return {
            "currency": self.pb.currency,
            "contract_duration_years": contract_years,
            "software_net_subtotal": round(software_subtotal, 2),
            "pot_support_fee": round(annual_support_fee, 2),
            "annual_recurring_revenue_arr": round(annual_recurring_revenue, 2),
            "total_contract_value_tcv": round(total_contract_value, 2),
            "quote_lines": pass1_lines
        }

# Setup USD Price Book
pb_usd = PriceBook("USD", fx_multiplier=1.0)
pb_usd.set_price("SKU_APEX_ENT", 50000.0)
pb_usd.set_price("SKU_OPT_DEDICATED", 45000.0)
pb_usd.set_price("SKU_OPT_SSO", 12000.0)
pb_usd.set_price("SKU_OPT_AUDIT", 8500.0)

pricing_engine = CPQPricingEngine(pb_usd)

# Quote Items (Software & Infrastructure with custom discount)
proposed_quote = [
    {"sku": "SKU_APEX_ENT", "name": "Apex Enterprise Cloud Platform", "type": "CORE_PLATFORM", "quantity": 1, "discount_pct": 0.10}, # 10% off
    {"sku": "SKU_OPT_DEDICATED", "name": "Dedicated Bare-Metal Enclave", "type": "CORE_PLATFORM", "quantity": 2, "discount_pct": 0.15}, # 15% off
    {"sku": "SKU_OPT_SSO", "name": "Enterprise SAML SSO Module", "type": "ADDON", "quantity": 1, "discount_pct": 0.0},
    {"sku": "SKU_OPT_AUDIT", "name": "SOC2 Tamper-Evident Audit Logging", "type": "ADDON", "quantity": 1, "discount_pct": 0.0}
]

# Calculate 3-Year Enterprise Agreement Quote
quote_summary = pricing_engine.calculate_quote_pricing(proposed_quote, pot_support_pct=0.18, contract_years=3)

print("=" * 68)
print("DYNAMIC CPQ PRICING & PERCENT-OF-TOTAL (PoT) RESOLUTION AUDIT")
print("=" * 68)
print(f"Contract Currency: {quote_summary['currency']} | Duration: {quote_summary['contract_duration_years']} Years")
print("-" * 68)
print("Resolved Quote Line Items:")
for line in quote_summary["quote_lines"]:
    disc_text = f"(-{line['discount_pct']:.0f}%)" if line['discount_pct'] > 0 else "(List)"
    print(f"  {line['sku']:<18} {line['name']:<42} Qty: {line['quantity']} {disc_text:<7} -> ${line['net_annual_price']:>10,.2f}/yr")
print("-" * 68)
print(f"Net Software Base Subtotal:       ${quote_summary['software_net_subtotal']:>12,.2f}/yr")
print(f"Dynamic PoT Support (18% of Net): ${quote_summary['pot_support_fee']:>12,.2f}/yr")
print(f"Annual Recurring Revenue (ARR):   ${quote_summary['annual_recurring_revenue_arr']:>12,.2f}/yr")
print(f"Total Contract Value (3-Yr TCV):  ${quote_summary['total_contract_value_tcv']:>12,.2f}")
print("=" * 68)
'''

p4_mcq = {
    "question": "In enterprise CPQ pricing architecture, what is a 'Percent of Total' (PoT) line item calculation?",
    "options": [
        "A dynamic pricing method where a line item's fee (such as 24/7 technical support or customer success) is calculated as a fixed percentage of the aggregated net value of core software licenses across the quote.",
        "A penalty tax charged by the government when a customer signs an enterprise agreement.",
        "A calculation that requires sales reps to donate a percentage of their commission to corporate charity.",
        "A pricing model where every product in the catalog is priced at exactly ninety-nine dollars."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Percent of Total (PoT) dynamically binds service or support fees to the aggregate net software value of the quote, recalculating automatically whenever line items or discount levels change."
}

# -------------------------------------------------------------
# Part 5: Building the Production CPQ Catalog & Bundle Validation Engine
# -------------------------------------------------------------
p5_say = [
    "In the climactic concluding section of Day 36, we synthesize the four architectural pillars of enterprise Configure, Price, Quote—hierarchical product catalogs, dependency constraint graphs, physical budget validators, and dynamic Percent-of-Total pricing—into an integrated, production-grade CPQ Catalog & Bundle Validation Platform in pure Python standard library. In global software corporations, this platform operates as the central commercial gating engine between sales pipeline execution and corporate financial accounting.",
    "Our production platform operationalizes Four Core Enterprise Pillars: 1) Hierarchical Bundle Configuration: Modeling complex multi-tier software and infrastructure bundles with strict option group cardinality controls; 2) Real-Time Constraint Validation: Graph-based dependency and mutual exclusion rule propagation, preventing technical and commercial incompatibilities before quote delivery; 3) Multi-Pass Dynamic Pricing: Two-pass financial resolution supporting multi-currency price books, custom line item discounts, and dynamic Percent-of-Total (PoT) support calculations; and 4) Cryptographic Commercial Quote Manifest: Compiling the complete, validated quote payload into a tamper-evident JSON specification sealed with an SHA-256 cryptographic signature, satisfying enterprise SOC 2 and SOX compliance standards.",
    "The engine also enforces Strict Revenue Governance Safeguards: 1) The Non-Negative Margin Invariant: A sales rep cannot stack discretionary line-item discounts such that the net contract price drops below corporate gross margin thresholds (e.g., minimum 70% software gross margin); 2) The Automatic Add-On Injection Invariant: If a customer selects a regulated compliance module (such as HIPAA or FedRAMP compliance), the engine automatically injects the mandatory encryption and audit logging prerequisites with zero rep friction; and 3) The Version-Controlled Catalog Manifest: All pricing changes, SKU retirements, and bundling rule adjustments are versioned with UTC timestamps, ensuring that quotes currently in legal review maintain pricing stability until contract expiration.",
    "By mastering the algorithmic engineering of Configure, Price, Quote systems, revenue operations architects eliminate manual configuration errors, protect enterprise gross margins, and accelerate commercial deal velocity across multi-million-dollar B2B sales cycles.",
    "In Part 5, we execute this comprehensive CPQ Catalog & Bundle Validation Platform in pure Python standard library. We configure a complex enterprise cloud and cybersecurity bundle, validate dependency constraints, execute dynamic PoT pricing across a multi-year term, and compile the official cryptographically verified CPQ Commercial Specification Certificate.",
    "From a strategic go-to-market perspective, deploying a modern, algorithmically governed Configure, Price, Quote platform fundamentally elevates the commercial maturity of the entire enterprise. In organizations without CPQ, sales cycles are paralyzed by administrative friction: Account Executives spend up to 40% of their working hours wrestling with manual spreadsheets, waiting for deal desk approvals, and explaining billing discrepancies to frustrated prospective buyers. Customers endure delayed quotes, confusing contract structures, and post-sale delivery delays.",
    "By contrast, an enterprise operating on an integrated CPQ platform experiences dramatic commercial acceleration: quote generation time is reduced from days to minutes; quoting errors and post-sale delivery rework are reduced to zero; and sales representatives can rapidly configure complex multi-product solution packages with complete confidence in their technical viability and commercial profitability. Revenue operations leaders gain complete programmatic control over discounting governance, price book distribution, and product lifecycle transitions.",
    "Furthermore, the CPQ platform establishes an immutable Digital Audit Trail for Financial Audits under Sarbanes-Oxley (SOX) Section 404. External auditors and statutory accounting authorities require verifiable evidence that sales contracts adhere strictly to authorized corporate price schedules and delegation of authority matrices. By cryptographically sealing every quote manifest with an SHA-256 digital signature and recording complete version histories, the enterprise provides mathematical proof of commercial compliance, safeguarding shareholder value and protecting corporate integrity.",
    "Finally, enterprise CPQ architectures integrate with Machine Learning Guided Pricing Engines. By analyzing historical win/loss ratios across millions of historical transactions, the pricing engine computes dynamic Win-Probability Curves for requested discount levels. If a sales rep requests a 25% discount, the system provides real-time guidance: Historical data indicates a 15% discount yields an 82% win rate, while a 25% discount only increases win probability to 84% at the cost of $45,000 in gross margin. This data-driven coaching equips reps to defend price integrity and optimize commercial outcomes."
]

p5_code = '''# Day 36 Part 5: Production CPQ Catalog & Bundle Validation Platform Suite
import collections
import hashlib
import json
import time
from datetime import datetime

class ProductionEnterpriseCPQPlatform:
    """Production Configure, Price, Quote (CPQ) Validation and Pricing Platform."""
    def __init__(self, enterprise_name="Apex Global Technologies"):
        self.enterprise = enterprise_name
        self.catalog = {}
        self.rules = []
        self.price_book = {}
        self.quote_history = []
        
    def register_product(self, sku, name, ptype, list_price_usd):
        self.catalog[sku] = {"sku": sku, "name": name, "type": ptype, "price": float(list_price_usd)}
        self.price_book[sku] = float(list_price_usd)

    def add_constraint_rule(self, rule_id, rule_type, source_sku, target_sku, message):
        self.rules.append({
            "id": rule_id,
            "type": rule_type, # "REQUIRES" or "EXCLUDES"
            "source": source_sku,
            "target": target_sku,
            "msg": message
        })

    def configure_and_price_quote(self, quote_id, selected_skus, line_discounts, contract_years=1, pot_support_pct=0.15):
        """End-to-End CPQ: Validation -> Pricing -> Cryptographic Manifest."""
        # 1. Validation Phase
        violations = []
        for r in self.rules:
            if r["source"] in selected_skus:
                if r["type"] == "REQUIRES" and r["target"] not in selected_skus:
                    violations.append(f"MISSING_DEPENDENCY: {r['msg']}")
                elif r["type"] == "EXCLUDES" and r["target"] in selected_skus:
                    violations.append(f"INCOMPATIBLE_SELECTION: {r['msg']}")

        if violations:
            return {
                "quote_id": quote_id,
                "status": "CONFIGURATION_REJECTED",
                "violations": violations
            }

        # 2. Pricing Phase (Two-Pass)
        resolved_lines = []
        software_subtotal = 0.0

        for sku in selected_skus:
            prod = self.catalog[sku]
            unit_list = self.price_book[sku]
            disc = line_discounts.get(sku, 0.0) # e.g. 0.10
            net = unit_list * (1.0 - disc)
            
            line_data = {
                "sku": sku,
                "name": prod["name"],
                "type": prod["type"],
                "unit_list": unit_list,
                "discount_pct": disc * 100.0,
                "net_annual": net
            }
            resolved_lines.append(line_data)
            if prod["type"] in ["CORE", "ADDON"]:
                software_subtotal += net

        # Pass 2: PoT Support
        support_annual = software_subtotal * pot_support_pct
        resolved_lines.append({
            "sku": "SKU_POT_SUPP",
            "name": f"Enterprise Platinum Support ({int(pot_support_pct * 100)}% PoT)",
            "type": "SERVICE",
            "unit_list": support_annual,
            "discount_pct": 0.0,
            "net_annual": support_annual
        })

        total_arr = software_subtotal + support_annual
        total_tcv = total_arr * contract_years

        quote_manifest = {
            "quote_id": quote_id,
            "enterprise": self.enterprise,
            "status": "APPROVED_CONFIGURED_VALID",
            "contract_years": contract_years,
            "lines_count": len(resolved_lines),
            "lines": resolved_lines,
            "financials": {
                "software_subtotal_arr": round(software_subtotal, 2),
                "pot_support_fee_arr": round(support_annual, 2),
                "annual_recurring_revenue_arr": round(total_arr, 2),
                "total_contract_value_tcv": round(total_tcv, 2)
            },
            "generated_at": datetime.utcnow().isoformat()
        }

        # 3. Cryptographic Sealing
        raw_manifest = json.dumps(quote_manifest, sort_keys=True)
        quote_manifest["sha256_cpq_token"] = hashlib.sha256(raw_manifest.encode("utf-8")).hexdigest()
        self.quote_history.append(quote_manifest)
        return quote_manifest

# Execute Platform Simulation
platform = ProductionEnterpriseCPQPlatform()

# Register Enterprise Catalog
platform.register_product("SKU_APEX_ENT", "Apex Enterprise Cloud Platform", "CORE", 60000.0)
platform.register_product("SKU_OPT_DEDICATED", "Dedicated Bare-Metal Node", "CORE", 45000.0)
platform.register_product("SKU_OPT_SHARED", "Shared Multi-Tenant Node", "CORE", 15000.0)
platform.register_product("SKU_OPT_SSO", "SAML/Okta SSO Integration", "ADDON", 12000.0)
platform.register_product("SKU_OPT_AUDIT", "SOC2 Compliance Audit Ledger", "ADDON", 8500.0)

# Register Constraint Rules
platform.add_constraint_rule("R1", "REQUIRES", "SKU_OPT_SSO", "SKU_OPT_AUDIT", "SSO requires SOC2 Audit Ledger.")
platform.add_constraint_rule("R2", "EXCLUDES", "SKU_OPT_DEDICATED", "SKU_OPT_SHARED", "Cannot mix Dedicated and Shared nodes.")

# Configure Quote
selected = {"SKU_APEX_ENT", "SKU_OPT_DEDICATED", "SKU_OPT_SSO", "SKU_OPT_AUDIT"}
discounts = {"SKU_APEX_ENT": 0.10, "SKU_OPT_DEDICATED": 0.15}

quote_res = platform.configure_and_price_quote("Q-88204", selected, discounts, contract_years=3, pot_support_pct=0.18)

print("=" * 68)
print("PRODUCTION CPQ CATALOG & BUNDLE VALIDATION PLATFORM AUDIT")
print("=" * 68)
print(f"Quote Reference:  {quote_res['quote_id']} [{quote_res['status']}]")
print(f"Enterprise Host:  {quote_res['enterprise']}")
print(f"Contract Term:    {quote_res['contract_years']} Years (Multi-Year Enterprise Agreement)")
print("-" * 68)
print("Configured Line Items:")
for line in quote_res["lines"]:
    disc_s = f"(-{line['discount_pct']:.0f}%)" if line['discount_pct'] > 0 else "(List)"
    print(f"  {line['sku']:<18} {line['name']:<42} {disc_s:<7} -> ${line['net_annual']:>10,.2f}/yr")
print("-" * 68)
print(f"Annual Recurring Revenue (ARR):  ${quote_res['financials']['annual_recurring_revenue_arr']:>12,.2f}/yr")
print(f"Total Contract Value (3-Yr TCV): ${quote_res['financials']['total_contract_value_tcv']:>12,.2f}")
print(f"Cryptographic CPQ SHA-256 Token: {quote_res['sha256_cpq_token']}")
print("=" * 68)
'''

p5_mcq = {
    "question": "Why is an SHA-256 cryptographic verification token generated and attached to approved enterprise CPQ quote manifests?",
    "options": [
        "To provide a tamper-evident audit record that cryptographically proves the exact products, quantities, prices, and discounts approved by sales operations cannot be altered prior to customer signing.",
        "To allow sales representatives to mine cryptocurrency on their office workstations.",
        "To compress quotation PDF documents into smaller email attachments.",
        "To automatically post customer sales quotes onto public internet message boards."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Cryptographically sealing the quote manifest ensures non-repudiation and guarantees that line items, pricing formulas, and discounts remain immutable between internal executive approval and customer contract execution."
}

DAY_DATA = {
    "day": 36,
    "month": 2,
    "coursePrefix": "bcom_scrm",
    "title": "Enterprise CPQ Architecture: Product Catalogs, Bundling Rules & Nested Options",
    "goal": "Master Configure-Price-Quote (CPQ) architecture: hierarchical product catalogs, dependency constraint graphs, bundling rules, physical budget validators, and dynamic Percent-of-Total pricing.",
    "minutes": 40,
    "recap": "Day 36 deconstructs enterprise CPQ architecture: analyzing the $3.8M Unshippable Configuration disaster, modeling hierarchical option groups, enforcing graph constraints, and calculating multi-pass PoT pricing.",
    "parts": [
        {
            "part": 1,
            "title": "The CPQ Paradigm: Deconstructing Configure, Price, Quote Systems",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "part": 2,
            "title": "Product Bundling Rules, Option Constraints & Dependency Graphs",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "part": 3,
            "title": "The $3.8M Unshippable Hardware/Software Configuration Disaster",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "part": 4,
            "title": "Dynamic Option Pricing, Price Books & Nested Bundle Math",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "part": 5,
            "title": "Building the Production CPQ Catalog & Bundle Validation Engine",
            "say": p5_say,
            "code": p5_code,
            "mcq": p5_mcq
        }
    ],
    "summary": [
        "Configure, Price, Quote (CPQ) platforms eliminate quoting errors and prevent multi-million-dollar margin leakage.",
        "Hierarchical product catalogs organize parent SKUs into option groups with min/max cardinality constraints.",
        "Constraint engines enforce dependency (requires) and mutual exclusion (excludes) rules using graph traversal.",
        "The $3.8M Unshippable Configuration failure demonstrates the critical need for physical and power budget validators.",
        "Percent-of-Total (PoT) pricing dynamically calculates service and support fees as a percentage of net software value."
    ],
    "projectStep": {
        "title": "Enterprise CPQ Catalog & Bundle Validation Engine",
        "steps": [
            "Construct the hierarchical product catalog with parent bundles and configurable option groups.",
            "Implement the dependency and mutual exclusion constraint validation engine with rule propagation.",
            "Deploy the physical hardware budget validator to enforce slot and power capacity thresholds.",
            "Build the two-pass pricing engine with Percent-of-Total support calculations and cryptographic sealing."
        ]
    }
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
    print("Day 36 validation successful!")
