# scripts/data_scrm_day48.py
# Day 48: Enterprise Access Governance: Role-Based Access Control (RBAC), Territory Hierarchy & Field-Level Security
# Course: bcom_scrm (Enterprise B2B Sales, Customer Success & CRM Systems Architecture)
# 100% pure Python standard library, strictly zero third-party packages.

# -------------------------------------------------------------
# Part 1: Enterprise Access Topology: Profiles, Permission Sets, Roles & Multi-Org Federation
# -------------------------------------------------------------
p1_say = [
    "Welcome to Day 48 of the Enterprise B2B Sales, Customer Success & CRM Systems Architecture curriculum. On Days 46 and 47, we engineered the data movement layer: bi-directional application synchronization and data warehouse reverse ETL pipelines. Today, we confront the foundational security and authorization layer of enterprise RevOps: Enterprise Access Governance, Role-Based Access Control (RBAC), Hierarchical Territory Management, and Field-Level Security (FLS).",
    "In a global enterprise employing thousands of sales representatives, account executives, solution architects, customer success managers, and financial controllers across multiple continents, access control is not merely an IT checkbox; it is a critical commercial and legal imperative. In an un-governed CRM, a junior sales development representative in EMEA could view sensitive pricing models for North American defense contractors, or an account executive could export five hundred thousand proprietary executive phone numbers to a personal device before defecting to a competitor. Furthermore, international regulatory frameworks (GDPR, CCPA, HIPAA, SOC 2 Type II) legally mandate strict segregation of duties and data minimization.",
    "Enterprise CRM authorization architectures operate on a Decoupled Multi-Layered Access Topology composed of four distinct primitives: 1) User Profiles (Baseline Operational Guardrails): Enforcing system-wide baseline permissions, login IP ranges, session timeout limits, and default object CRUD (Create, Read, Edit, Delete) rights. In modern security paradigms, profiles are kept minimally privileged, functioning strictly as baseline organizational templates; 2) Permission Sets and Permission Set Groups (Additive Capability Grants): Providing modular, composable privileges that can be assigned to individual users regardless of profile. A sales representative needing temporary Deal Desk approval rights or billing dispute authorization receives an additive Permission Set rather than being granted a permanently elevated profile;",
    "3) The Role Hierarchy (Vertical Data Visibility Trees): Determining record-level visibility where managers and executives automatically inherit visibility over records owned by their organizational subordinates, following the principle of managerial rollup; and 4) Multi-Org Federation & Single Sign-On (SSO): Utilizing SAML 2.0 and OIDC protocols with centralized Identity Providers (Okta, Azure Active Directory, Ping Identity) and SCIM (System for Cross-domain Identity Management) automated provisioning, ensuring that employee onboarding and immediate offboarding propagate instantly across all revenue systems.",
    "A fundamental security design tenet in enterprise RevOps is The Principle of Least Privilege (PoLP): Every employee, service account, and integration worker must be granted strictly the minimum access required to execute their job functions, and not a single privilege more. When configuring API service accounts for Reverse ETL or ERP sync, granting `System Administrator` access is a severe security vulnerability. Dedicated integration users must be restricted to specific object-level read/write permissions and bounded IP ranges.",
    "In Part 1, we establish the formal specification of Enterprise Access Topology in pure Python standard library. We construct user directory models, permission set registries, and multi-tenant profile templates, enforcing deterministic authorization checks across diverse corporate user personas.",
    "From an enterprise IT auditing standpoint, modern authorization architectures enforce Just-In-Time (JIT) Privileged Access Management (PAM): allowing senior sales engineers or administrators to request temporary, time-bounded elevation (e.g. four-hour access to high-tier financial ledgers for a quarterly audit), automatically revoking privileges and logging an immutable session transcript upon expiration.",
    "Furthermore, enterprise RevOps architectures implement Multi-Org Segregation for Multinational Conglomerates: operating distinct Salesforce orgs for separate sovereign jurisdictions (e.g. an isolated US Government Cloud org complying with FedRAMP High, and an EU Commercial org complying with GDPR cross-border transfer restrictions), linked through cryptographically secured Salesforce-to-Salesforce or hub-and-spoke API bridges.",
    "Additionally, modern access governance platforms enforce Automated Deprovisioning SLAs: triggering automated SCIM termination events within sixty seconds of an employee departure in Workday, revoking active OAuth refresh tokens, expiring active sessions, and transferring open pipeline records to designated pool owners.",
    "Finally, RevOps security engineers conduct Monthly Privilege Drift Audits: comparing active permission set assignments against HR job codes to detect and revoke unneeded privileges accumulated during internal team transfers."
]

p1_code = '''# Day 48 Part 1: Enterprise Access Topology & Composable Permission Set Engine
import json
from datetime import datetime

class EnterpriseUser:
    """Represents a corporate user with profile, assigned permission sets, and role node."""
    def __init__(self, user_id, name, email, profile, role_id):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.profile = profile
        self.role_id = role_id
        self.permission_sets = set()
        self.is_active = True

    def assign_permission_set(self, perm_set_name):
        self.permission_sets.add(perm_set_name)

    def revoke_permission_set(self, perm_set_name):
        self.permission_sets.discard(perm_set_name)

class AccessControlRegistry:
    """Manages baseline profile permissions and additive permission set definitions."""
    def __init__(self):
        # Baseline profile permissions: PROFILE -> OBJECT -> CRUD
        self.profiles = {
            "STANDARD_SALES_REP": {
                "Account": {"C": True, "R": True, "U": True, "D": False},
                "Opportunity": {"C": True, "R": True, "U": True, "D": False},
                "Invoice": {"C": False, "R": True, "U": False, "D": False}
            },
            "READ_ONLY_ANALYST": {
                "Account": {"C": False, "R": True, "U": False, "D": False},
                "Opportunity": {"C": False, "R": True, "U": False, "D": False},
                "Invoice": {"C": False, "R": True, "U": False, "D": False}
            }
        }
        # Additive permission sets: PERM_SET -> OBJECT -> ADDITIONAL_CRUD
        self.permission_sets = {
            "DEAL_DESK_APPROVER": {
                "Opportunity": {"D": True}, # Add Delete / Override
                "Contract": {"C": True, "R": True, "U": True, "D": False}
            },
            "BILLING_CONTROLLER": {
                "Invoice": {"C": True, "R": True, "U": True, "D": False}
            }
        }

    def check_object_permission(self, user: EnterpriseUser, s_object: str, action: str):
        """Evaluate combined permissions: Profile baseline + Additive Permission Sets."""
        if not user.is_active:
            return False, "USER_INACTIVE"

        # 1. Check Profile Baseline
        prof_perms = self.profiles.get(user.profile, {}).get(s_object, {})
        has_perm = prof_perms.get(action, False)
        granting_source = f"PROFILE_{user.profile}" if has_perm else None

        # 2. Check Additive Permission Sets
        if not has_perm:
            for ps_name in user.permission_sets:
                ps_perms = self.permission_sets.get(ps_name, {}).get(s_object, {})
                if ps_perms.get(action, False):
                    has_perm = True
                    granting_source = f"PERMISSION_SET_{ps_name}"
                    break

        return has_perm, granting_source or "ACCESS_DENIED"

# Demonstration
registry = AccessControlRegistry()
rep_bob = EnterpriseUser("USR-101", "Bob Sales", "bob@apex.io", "STANDARD_SALES_REP", "ROLE_NA_ENTERPRISE_REP")

# Baseline check: Can Bob edit an Opportunity?
can_edit, src1 = registry.check_object_permission(rep_bob, "Opportunity", "U")
# Baseline check: Can Bob edit an Invoice?
can_edit_inv, src2 = registry.check_object_permission(rep_bob, "Invoice", "U")

print("=== ACCESS TOPOLOGY & PERMISSION SET EVALUATION ===")
print(f"User: {rep_bob.name} | Profile: {rep_bob.profile}")
print(f"  Opportunity [Update]: Permitted={can_edit} (Source: {src1})")
print(f"  Invoice [Update]: Permitted={can_edit_inv} (Source: {src2})")

# Grant additive permission set for Billing Controller
rep_bob.assign_permission_set("BILLING_CONTROLLER")
can_edit_inv_post, src3 = registry.check_object_permission(rep_bob, "Invoice", "U")
print(f"  After Billing_Controller Grant -> Invoice [Update]: Permitted={can_edit_inv_post} (Source: {src3})")
'''

# -------------------------------------------------------------
# Part 2: Hierarchical Territory Management (HTM): Territory Trees, Assignment Rules & Matrix Inheritance
# -------------------------------------------------------------
p2_say = [
    "In Part 2 of Day 48, we investigate the structural mechanism that maps corporate organizational charts and market segmentation onto CRM data access: Hierarchical Territory Management (HTM). In high-scale enterprise sales organizations, account ownership cannot be modeled as a flat, single-owner lookup field. An enterprise conglomerate like General Electric or Siemens has hundreds of subsidiary entities, multiple product lines, and diverse geographic divisions operating across eighty countries.",
    "Hierarchical Territory Management structures customer data access into an Inverted Directed Tree (Territory Hierarchy): Root -> Global Enterprise -> Geographic Theatre (Americas, EMEA, APAC) -> Regional Division (North America East, DACH, Japan) -> Industry Vertical (Fintech, Healthcare, Retail) -> Territory Leaf Node. Each territory node encapsulates three operational components: 1) Assigned Personnel (Account Executives, Sales Engineers, Customer Success Managers); 2) Automated Territory Assignment Rules (evaluating account attributes such as Annual Revenue, Employee Headcount, Billing Country, and SIC/NAICS industry codes); and 3) Access Privilege Levels (Read-Only, Read/Write, Owner-Transfer).",
    "A foundational computational mechanic of HTM is Matrix Inheritance and Managerial Rollup: An Account Executive assigned to the 'EMEA Financial Services' territory node gains access to all accounts that match the territory's assignment criteria. Simultaneously, the VP of EMEA Sales, positioned higher in the hierarchy, automatically inherits Read/Write access over every child territory in the EMEA subtree without requiring manual sharing rules.",
    "Furthermore, modern enterprise sales models implement Matrixed Dual-Reporting Structures (Overlay Territories): A specialized Solution Architect for Generative AI or Cybersecurity does not hold direct geographical account ownership, but must collaborate on high-value deals across multiple geographic regions. HTM models Overlay Territories as cross-cutting branches: granting overlay specialists scoped access to opportunities matching their product specialization while preserving core geographical account ownership for the primary representative.",
    "A critical operational challenge in territory management is Automated Territory Realignment (The Annual Sales Carve-Up): Every fiscal year, sales leadership re-draws territory boundaries, splits growing territories, and reassigns thousands of accounts. In legacy CRMs, territory re-calculations locked databases for hours. Modern RevOps engines execute asynchronous territory rule evaluation engines, computing account-to-territory mappings in batch workers and previewing pipeline compensation impacts before committing changes to production ledgers.",
    "In Part 2, we formulate a complete Hierarchical Territory Management Engine in pure Python standard library. We construct recursive territory trees, implement multi-attribute assignment rule evaluators, model managerial rollup inheritance, and execute dynamic account territory assignments.",
    "From a sales operational efficiency standpoint, automated territory assignment rules eliminate Lead Routing Disputes: replacing subjective arguments between sales representatives with deterministic algorithmic routing based on verified corporate hierarchy and geographic data.",
    "Moreover, the territory engine enforces Territory Exclusivity Invariants: ensuring that an enterprise account cannot be accidentally assigned to conflicting territory nodes, preventing duplicate sales outreach and commission payout double-dipping.",
    "Additionally, modern HTM platforms incorporate Parent-Child Account Hierarchy Inheritance: allowing subsidiary child accounts (e.g. a regional office in Berlin) to automatically inherit territory alignment and commercial discounting privileges from the parent global headquarters in New York.",
    "Finally, Revenue Operations leadership tracks Territory Saturation & Quota Capacity Metrics: analyzing whether account-to-representative ratios across territory subtrees are balanced to ensure equitable earning potential across global sales teams.",
    "Furthermore, modern enterprise territory systems incorporate Predictive Territory Re-balancing and Workload Optimization algorithms. Rather than relying solely on static demographic indicators (such as industry SIC codes or revenue brackets), advanced RevOps platforms continuously evaluate dynamic sales rep capacity metrics: tracking open pipeline deal volume, active customer meeting frequency, and historical sales cycle velocities across each territory node. If market expansion causes an unexpected surge in qualified accounts within the DACH Enterprise node while the UK Enterprise node experiences lower deal activity, the territory engine flags a capacity imbalance and models candidate boundary adjustments. This predictive modeling allows Revenue Operations leadership to redistribute prospective accounts proactively, preventing sales representative burnout and maximizing overall quota attainment across global sales teams."
]

p2_code = '''# Day 48 Part 2: Hierarchical Territory Management & Automated Rule Evaluator
class TerritoryNode:
    """Represents a node in an enterprise territory hierarchy tree."""
    def __init__(self, territory_id, name, parent_id=None):
        self.territory_id = territory_id
        self.name = name
        self.parent_id = parent_id
        self.assigned_users = set()
        self.children = []
        self.assignment_rules = []

    def add_user(self, user_id):
        self.assigned_users.add(user_id)

    def add_rule(self, rule_fn):
        self.assignment_rules.append(rule_fn)

class HierarchicalTerritoryManager:
    """Manages territory tree structure, rule evaluations, and inheritance rollups."""
    def __init__(self):
        self.territories = {}
        self.root_id = None

    def add_territory(self, territory: TerritoryNode):
        self.territories[territory.territory_id] = territory
        if territory.parent_id is None:
            self.root_id = territory.territory_id
        elif territory.parent_id in self.territories:
            self.territories[territory.parent_id].children.append(territory)

    def get_ancestors(self, territory_id):
        """Retrieve all parent nodes up to root for managerial inheritance rollup."""
        ancestors = []
        curr = self.territories.get(territory_id)
        while curr and curr.parent_id:
            curr = self.territories.get(curr.parent_id)
            if curr:
                ancestors.append(curr)
        return ancestors

    def assign_account_to_territory(self, account_data):
        """Evaluate assignment rules across leaf territories to find matching territory node."""
        matching_territories = []
        for t_id, t_node in self.territories.items():
            if t_node.assignment_rules:
                # All rules in node must match
                if all(rule(account_data) for rule in t_node.assignment_rules):
                    matching_territories.append(t_node)
        return matching_territories

    def check_user_access(self, user_id, assigned_territory_id):
        """Check access: user has direct assignment OR managerial inheritance from ancestor node."""
        target_t = self.territories.get(assigned_territory_id)
        if not target_t:
            return False, "TERRITORY_NOT_FOUND"

        # Direct assignment
        if user_id in target_t.assigned_users:
            return True, f"DIRECT_ASSIGNMENT_TO_{target_t.name}"

        # Managerial rollup: is user assigned to any ancestor?
        for anc in self.get_ancestors(assigned_territory_id):
            if user_id in anc.assigned_users:
                return True, f"MANAGERIAL_INHERITANCE_FROM_{anc.name}"

        return False, "NO_TERRITORY_ACCESS"

# Demonstration
htm = HierarchicalTerritoryManager()

# Build tree: Global -> Americas -> NA_Enterprise_Fintech
t_global = TerritoryNode("T-GLOBAL", "Global Commercial Root")
t_americas = TerritoryNode("T-AMER", "Americas Theatre", parent_id="T-GLOBAL")
t_na_fin = TerritoryNode("T-NA-FIN", "North America Enterprise Fintech", parent_id="T-AMER")

htm.add_territory(t_global)
htm.add_territory(t_americas)
htm.add_territory(t_na_fin)

# Assign users: Alice is VP Americas, Bob is NA Fintech Rep
t_americas.add_user("USR-ALICE-VP")
t_na_fin.add_user("USR-BOB-REP")

# Add territory assignment rules to NA Fintech leaf: Country==USA, Industry==FINTECH, Rev >= 50M
t_na_fin.add_rule(lambda acc: acc.get("country") == "USA")
t_na_fin.add_rule(lambda acc: acc.get("industry") == "FINTECH")
t_na_fin.add_rule(lambda acc: acc.get("annual_revenue_usd", 0) >= 50000000)

account_apex = {"account_id": "ACC-APEX", "name": "Apex Global Bank", "country": "USA", "industry": "FINTECH", "annual_revenue_usd": 120000000}
assigned_nodes = htm.assign_account_to_territory(account_apex)

print("=== HIERARCHICAL TERRITORY MANAGEMENT AUDIT ===")
print(f"Account: {account_apex['name']} -> Assigned Territory: {assigned_nodes[0].name}")

# Evaluate access: Can Bob access it? Can Alice (VP) access it? Can Charlie (EMEA rep) access it?
bob_access, bob_reason = htm.check_user_access("USR-BOB-REP", "T-NA-FIN")
alice_access, alice_reason = htm.check_user_access("USR-ALICE-VP", "T-NA-FIN")
charlie_access, charlie_reason = htm.check_user_access("USR-CHARLIE-EMEA", "T-NA-FIN")

print(f"  Bob (Rep) Access: {bob_access} ({bob_reason})")
print(f"  Alice (VP) Access: {alice_access} ({alice_reason})")
print(f"  Charlie (EMEA) Access: {charlie_access} ({charlie_reason})")
'''

# -------------------------------------------------------------
# Part 3: Field-Level Security (FLS) & Object-Level Security (OLS): Principal of Least Privilege & Record Sharing Rules
# -------------------------------------------------------------
p3_say = [
    "In Part 3 of Day 48, we examine the fine-grained data shielding mechanisms that govern enterprise CRM databases: Field-Level Security (FLS) and Object-Level Security (OLS). While territory hierarchies and role trees determine which records a user can see (Row-Level Security), Field-Level Security governs which specific attributes within that record the user is permitted to view or edit (Column-Level Security).",
    "Field-Level Security is an indispensable defense against internal data exposure. In an enterprise CRM, a single Account or Opportunity object holds hundreds of diverse fields spanning commercial, technical, and highly confidential financial data. For example, an Opportunity record contains: 1) Commercial Metadata (Deal Name, Stage, Close Date)—visible and editable by all sales reps; 2) Margin & Discount Ledgers (Executive Discount %, Gross Margin %, COGS Floor)—editable only by Deal Desk approvers and hidden from standard reps; and 3) Compliance & Security Identifiers (Tax ID, Customer Bank Routing Numbers, SSN, Credit Card Tokens)—strictly masked or completely hidden from all sales personnel, accessible exclusively to automated billing services.",
    "If an enterprise relies strictly on user interface layout rules to hide fields, the system suffers from The API Exposure Vulnerability: A technically savvy sales representative using the Salesforce REST API, GraphQL, or developer console can query fields hidden on the page layout, exposing un-redacted executive discount thresholds and corporate margin targets. Field-Level Security is enforced at the Database Kernel Layer: When a field is configured as `Hidden` for a user profile, the database query engine strips that column from all API queries, reports, list views, and global search indexes, rendering it completely invisible regardless of the access vector.",
    "Furthermore, enterprise architectures implement Granular Record Sharing Rules: extending record visibility beyond strict hierarchical lines. In complex B2B selling motions, cross-functional deal teams collaborate across departments. RevOps engines utilize Three Sharing Mechanisms: 1) Ownership-Based Sharing Rules: Automatically sharing records owned by members of one public group with members of another group; 2) Criteria-Based Sharing Rules: Evaluating attribute logic (e.g. `WHERE Deal_Size__c > 1000000` automatically shares Read/Write access with the Strategic Deals Legal Team); and 3) Apex/Programmatic Managed Sharing: Dynamically granting record access via backend software triggers during deal team assignments.",
    "Additionally, modern privacy standards enforce Dynamic Data Masking (DDM): displaying partially obfuscated strings (e.g. `****-****-****-4089` for payment instruments or `***-**-1234` for tax identifiers) to non-privileged users while storing the underlying plaintext securely encrypted in the database.",
    "In Part 3, we build a Kernel-Level Field Security and Record Masking Engine in pure Python standard library. We define profile field permission matrices, intercept record serialization, filter unauthorized attributes from query payloads, apply dynamic masking to sensitive identifiers, and simulate multi-persona data extraction.",
    "From an enterprise regulatory compliance perspective (GDPR Article 25 and HIPAA Security Rule), Field-Level Security guarantees Data Minimization: ensuring that customer personal data is never disclosed to corporate employees who do not require it for direct service fulfillment.",
    "Moreover, the security engine enforces Read-Only Field Immutability: allowing sales reps to view calculated financial indicators (such as Net Revenue Retention or AI Churn Risk) while strictly preventing manual tampering or field overrides.",
    "Additionally, modern CRM architectures support Encrypted Fields with Key Rotation (Salesforce Shield Platform Encryption): encrypting sensitive database columns at rest using tenant-specific AES-256 keys, ensuring that even raw database administrators cannot inspect sensitive customer secrets without authorized encryption context.",
    "Finally, Revenue Operations security engineers review Field Access Change Logs: continuously auditing who granted or modified field visibility across all corporate profiles to maintain complete SOC 2 compliance.",
    "In addition to static profile matrices, enterprise architectures implement Contextual Field-Level Access Auditing and Real-Time Exfiltration Detection. By integrating field-level read events with corporate User and Entity Behavior Analytics (UEBA) systems, the platform monitors how many sensitive or masked attributes an employee accesses within a given time window. If an account manager who typically views ten customer billing records per day suddenly executes programmatic bulk queries touching thousands of sensitive tax identifiers or credit card tokens, the security filter intercepts the query stream, logs an anomaly alert to the security operations center, and temporarily downgrades the user's field-level permissions to restricted view pending security re-verification."
]

p3_code = '''# Day 48 Part 3: Field-Level Security (FLS) & Dynamic Data Masking Engine
import copy

class FieldLevelSecurityFilter:
    """Kernel-level attribute filter enforcing FLS permissions and dynamic data masking."""
    def __init__(self):
        # Master FLS matrix: PROFILE -> OBJECT -> FIELD -> ACCESS ('READ_WRITE', 'READ_ONLY', 'HIDDEN', 'MASKED')
        self.fls_matrix = {
            "STANDARD_SALES_REP": {
                "Opportunity": {
                    "deal_name": "READ_WRITE",
                    "stage": "READ_WRITE",
                    "amount_usd": "READ_WRITE",
                    "gross_margin_percent": "HIDDEN",        # Executive field hidden!
                    "cogs_floor_usd": "HIDDEN",              # Executive field hidden!
                    "customer_bank_account": "MASKED"        # Sensitive financial field masked!
                }
            },
            "DEAL_DESK_APPROVER": {
                "Opportunity": {
                    "deal_name": "READ_WRITE",
                    "stage": "READ_WRITE",
                    "amount_usd": "READ_WRITE",
                    "gross_margin_percent": "READ_WRITE",    # Authorized to edit margins!
                    "cogs_floor_usd": "READ_ONLY",           # Authorized to inspect cost floor!
                    "customer_bank_account": "MASKED"
                }
            },
            "FINANCE_BILLING_ADMIN": {
                "Opportunity": {
                    "deal_name": "READ_ONLY",
                    "stage": "READ_ONLY",
                    "amount_usd": "READ_ONLY",
                    "gross_margin_percent": "READ_ONLY",
                    "cogs_floor_usd": "READ_ONLY",
                    "customer_bank_account": "READ_WRITE"    # Full access to billing details!
                }
            }
        }

    def apply_fls(self, profile: str, s_object: str, raw_record: dict):
        """Filter and mask record attributes based on user profile permissions."""
        profile_rules = self.fls_matrix.get(profile, {}).get(s_object, {})
        sanitized_record = {}

        for field, value in raw_record.items():
            rule = profile_rules.get(field, "HIDDEN") # Default to Least Privilege (HIDDEN)
            if rule == "HIDDEN":
                continue # Strip field completely from payload!
            elif rule == "MASKED":
                # Dynamic masking: mask all but last 4 characters
                val_str = str(value)
                if len(val_str) > 4:
                    sanitized_record[field] = "*" * (len(val_str) - 4) + val_str[-4:]
                else:
                    sanitized_record[field] = "****"
            else:
                # READ_ONLY or READ_WRITE: include plaintext value
                sanitized_record[field] = value

        return sanitized_record

# Demonstration
fls_filter = FieldLevelSecurityFilter()

raw_opportunity = {
    "deal_name": "Apex Global 500-Seat Expansion",
    "stage": "Negotiation/Review",
    "amount_usd": 350000,
    "gross_margin_percent": 74.2,
    "cogs_floor_usd": 85000,
    "customer_bank_account": "987654321045"
}

print("=== FIELD-LEVEL SECURITY (FLS) MULTI-PROFILE AUDIT ===")
for test_profile in ["STANDARD_SALES_REP", "DEAL_DESK_APPROVER", "FINANCE_BILLING_ADMIN"]:
    filtered_payload = fls_filter.apply_fls(test_profile, "Opportunity", raw_opportunity)
    print(f"\\nProfile: {test_profile}")
    for k, v in filtered_payload.items():
        print(f"  {k:<24}: {v}")
'''

# -------------------------------------------------------------
# Part 4: Dynamic Authorization & Attribute-Based Access Control (ABAC): Policy Enforcement Points (PEP)
# -------------------------------------------------------------
p4_say = [
    "In Part 4 of Day 48, we elevate beyond static Role-Based Access Control to modern Dynamic Authorization and Attribute-Based Access Control (ABAC). While RBAC evaluates static assignments ('Is Bob a Sales Rep?'), real-world enterprise compliance requires dynamic policy evaluation across four multidimensional attribute contexts: Subject Attributes, Resource Attributes, Action Attributes, and Environmental/Contextual Attributes.",
    "Consider a high-stakes enterprise compliance requirement: 'An account executive may only export customer records if: 1) They are the active account owner (Subject/Resource match); 2) The customer is not classified under GDPR Protected Jurisdiction (Resource attribute); 3) The request originates from a corporate-managed laptop within a corporate IP range (Environmental attribute); and 4) The time of access is during standard business hours (Temporal attribute).' Static profiles and roles cannot express such dynamic, multi-factor constraints; they require an Attribute-Based Policy Engine.",
    "Dynamic Authorization follows the XACML / NIST ABAC Reference Architecture composed of four decoupled operational components: 1) Policy Administration Point (PAP): Where RevOps and InfoSec engineers author and store declarative security policies in declarative formats (e.g. Open Policy Agent Rego or Cedar); 2) Policy Decision Point (PDP): The centralized decision engine that evaluates incoming authorization requests against active policies, returning a deterministic `Permit` or `Deny`;",
    "3) Policy Enforcement Point (PEP): The gateway or API middleware intercepting user actions, assembling the multidimensional context, querying the PDP, and enforcing the decision; and 4) Policy Information Point (PIP): External data sources supplying real-time contextual attributes (e.g. Okta device health scores, IP geolocation databases, or continuous fraud risk scores).",
    "Furthermore, ABAC enables Automated Export Throttling and Data Loss Prevention (DLP): If an account executive attempts to export more than fifty customer records in a single session from an off-network IP address, the Policy Enforcement Point intercepts the request, blocks the download, and dispatches a high-priority incident alert to the Chief Information Security Officer (CISO).",
    "In Part 4, we build an Attribute-Based Access Control Policy Decision Engine in pure Python standard library. We define declarative policy rules, evaluate dynamic multi-attribute context tuples `(Subject, Resource, Action, Environment)`, enforce contextual export controls, and log immutable authorization audit decisions.",
    "From an enterprise cybersecurity posture standpoint, ABAC eliminates Role Explosion: an administrative nightmare in legacy companies where IT teams created hundreds of bespoke, hyper-specific roles (e.g. `Sales_Rep_Germany_Healthcare_Mobile_User`) to handle unique edge cases. Under ABAC, a single standard Sales role is dynamically modulated by runtime attributes.",
    "Moreover, the dynamic authorization engine supports Contextual Step-Up Authentication: prompting users for secondary biometric MFA verification if an access request originates from an unrecognized device or unusual geolocation before granting access to sensitive customer ledgers.",
    "Additionally, modern RevOps engines implement Continuous Evaluation: continually re-verifying policy conditions during active user sessions rather than evaluating credentials only once at login, terminating access immediately if a user's device health status degrades mid-session.",
    "Finally, enterprise security controllers review ABAC Simulation Dry-Runs: testing proposed policy changes against historical transaction logs to ensure new access rules do not inadvertently block legitimate commercial sales workflows.",
    "Furthermore, enterprise Attribute-Based Access Control frameworks implement Real-Time Fraud & Anomaly Scoring as a dynamic Policy Information Point (PIP). Beyond verifying whether an IP address is corporate and whether a device is managed, the decision engine evaluates continuous behavioral biometric telemetry—such as mouse velocity patterns, keystroke dynamics, and sudden impossible geographic travel velocities (e.g. logging in from London twenty minutes after logging in from Singapore). If the real-time risk score computed by the anomaly pipeline exceeds acceptable threat thresholds, the Policy Decision Point overrides static role permissions and mandates immediate cryptographic step-up verification via hardware FIDO2 security keys, ensuring that compromised session tokens or stolen VPN credentials cannot be leveraged to exfiltrate proprietary customer data."
]

p4_code = '''# Day 48 Part 4: Dynamic Attribute-Based Access Control (ABAC) Policy Decision Engine
import json
from datetime import datetime

class AbacPolicyDecisionPoint:
    """PDP evaluating multidimensional context: Subject, Resource, Action, Environment."""
    def __init__(self):
        self.policies = []

    def register_policy(self, policy_id, description, condition_fn, effect="PERMIT"):
        self.policies.append({
            "id": policy_id,
            "description": description,
            "condition": condition_fn,
            "effect": effect
        })

    def evaluate_access(self, subject: dict, resource: dict, action: str, environment: dict):
        """Evaluate request against policies using Default-Deny security posture."""
        context = {
            "subject": subject,
            "resource": resource,
            "action": action,
            "environment": environment
        }

        # Check for explicit Deny or valid Permit
        permitted = False
        matching_rule = "DEFAULT_DENY_FALLBACK"

        for p in self.policies:
            try:
                if p["condition"](context):
                    if p["effect"] == "DENY":
                        return False, f"EXPLICIT_DENY: {p['description']} (Policy: {p['id']})"
                    elif p["effect"] == "PERMIT":
                        permitted = True
                        matching_rule = f"{p['description']} (Policy: {p['id']})"
            except Exception as e:
                # Any policy evaluation error results in immediate safety Deny
                return False, f"POLICY_EVALUATION_ERROR: {str(e)}"

        return permitted, matching_rule

# Demonstration of enterprise export and governance policy
pdp = AbacPolicyDecisionPoint()

# Policy 1: Corporate Network Requirement for Bulk Export
pdp.register_policy(
    policy_id="POL-REV-01",
    description="Bulk Export restricted to Corporate Managed Network and Business Hours",
    condition_fn=lambda ctx: (
        ctx["action"] == "EXPORT_RECORDS" and
        (not ctx["environment"].get("is_corporate_ip", False) or not ctx["environment"].get("is_managed_device", False))
    ),
    effect="DENY" # Explicit deny if export requested from non-corporate environment
)

# Policy 2: GDPR Data Residency Protection
pdp.register_policy(
    policy_id="POL-REV-02",
    description="EU Citizen data cannot be exported outside EU region",
    condition_fn=lambda ctx: (
        ctx["action"] == "EXPORT_RECORDS" and
        ctx["resource"].get("jurisdiction") == "GDPR_EU" and
        ctx["subject"].get("user_region") != "EU"
    ),
    effect="DENY"
)

# Policy 3: Standard Commercial Access Permit
pdp.register_policy(
    policy_id="POL-REV-03",
    description="Standard Sales Access permitted for account owners on managed devices",
    condition_fn=lambda ctx: (
        ctx["subject"].get("role") in ["ACCOUNT_EXECUTIVE", "SALES_MANAGER"] and
        ctx["environment"].get("is_managed_device", False)
    ),
    effect="PERMIT"
)

# Context 1: Legitimate Account Executive on Corporate Laptop in NYC
subj1 = {"user_id": "U-1", "role": "ACCOUNT_EXECUTIVE", "user_region": "NA"}
res1 = {"account_id": "ACC-100", "jurisdiction": "US_COMMERCIAL"}
env1 = {"is_corporate_ip": True, "is_managed_device": True}
auth1, reason1 = pdp.evaluate_access(subj1, res1, "EXPORT_RECORDS", env1)

# Context 2: Same AE attempting export from home Wi-Fi on personal unmanaged phone
env2 = {"is_corporate_ip": False, "is_managed_device": False}
auth2, reason2 = pdp.evaluate_access(subj1, res1, "EXPORT_RECORDS", env2)

# Context 3: US AE attempting to export EU GDPR Protected Customer
res3 = {"account_id": "ACC-EU-200", "jurisdiction": "GDPR_EU"}
auth3, reason3 = pdp.evaluate_access(subj1, res3, "EXPORT_RECORDS", env1)

print("=== ATTRIBUTE-BASED ACCESS CONTROL (ABAC) DYNAMIC EVALUATION ===")
print(f"Scenario 1 (Corporate Laptop Export): Permitted={auth1} | Rule: {reason1}")
print(f"Scenario 2 (Personal Phone Export): Permitted={auth2} | Rule: {reason2}")
print(f"Scenario 3 (Cross-Border GDPR Export): Permitted={auth3} | Rule: {reason3}")
'''

# -------------------------------------------------------------
# Part 5: Full Python Implementation: Sovereign Enterprise Access & Territory Authorization Engine
# -------------------------------------------------------------
p5_say = [
    "In Part 5 of Day 48, we unite all four governance frameworks into a single master enterprise architecture: The SovereignAccessGovernanceEngine. This comprehensive platform coordinates user directory management, composable permission set assignment, hierarchical territory management with managerial inheritance, kernel-level field security with dynamic data masking, and multi-factor attribute-based access policy evaluation.",
    "The SovereignAccessGovernanceEngine executes the Complete Enterprise Authorization Pipeline across three divergent enterprise scenarios: 1) The Authorized Sales Executive: An Account Executive assigned to the North America Enterprise territory accesses an assigned Fortune 500 account from a corporate laptop. The engine validates territory tree alignment, filters sensitive executive margin fields via FLS, masks banking tokens, and permits record viewing; 2) The Multi-Level Managerial Rollup: The VP of Americas Sales inspects an account assigned to a subordinate territory leaf node. The territory engine computes the hierarchical ancestor tree and grants managerial access, demonstrating matrix inheritance; and",
    "3) The Cross-Border Data Leakage Prevention: A non-EU representative attempts to execute a bulk export of a GDPR-protected customer entity from an untrusted mobile device. The ABAC Policy Enforcement Point intercepts the request, evaluates environmental and data residency attributes, denies the export, and generates a security event notification.",
    "Every algorithm, recursive tree traversal, and data masking rule is implemented in 100% pure Python standard library (`math`, `datetime`, `json`, `hashlib`), strictly avoiding third-party dependencies to guarantee deterministic execution across enterprise runtime environments. Let us execute the complete governance engine and verify its security decisions.",
    "From an enterprise architectural maturity and CISO governance standpoint, the SovereignAccessGovernanceEngine establishes the benchmark for modern revenue operations security. In traditional corporations, access governance is fragmented across disjointed spreadsheets and manual IT tickets, leaving organizations vulnerable to data theft and catastrophic regulatory penalties. By unifying RBAC, HTM, FLS, and ABAC into a cohesive programmatic framework, RevOps leadership protects intellectual property while enabling frontline sales velocity.",
    "Furthermore, the governance engine maintains an Immutable Cryptographic Security Audit Trail: logging every access grant, policy evaluation, data masking event, and denied transaction. This audit trail provides statutory compliance officers with mathematical verification of SOC 2 Type II and ISO 27001 data protection controls.",
    "In addition, the architecture integrates with Enterprise SIEM and Security Operations Centers (Splunk, Datadog Security, AWS GuardDuty): streaming real-time authorization anomaly alerts whenever a user triggers multiple ABAC denial events in rapid succession.",
    "Moreover, the platform enforces Enterprise Separation of Duties (SoD): ensuring that no single corporate identity can create a sales opportunity, approve an executive discount, and execute an invoice payment without independent multi-party authorization.",
    "Finally, Revenue Operations leadership conducts Quarterly Access Attestation Reviews: certifying that active territory boundaries, field masking rules, and dynamic authorization policies evolve alongside changing global corporate structures.",
    "Analyzing the multi-scenario execution outputs of the SovereignAccessGovernanceEngine highlights the multi-dimensional precision required to secure modern recurring revenue systems. In Scenario 1, when Account Executive Bob accessed the Fortune 500 account, the engine verified his direct leaf node membership in the North America Enterprise territory. Simultaneously, the kernel-level FLS engine intercepted the record payload: completely stripping executive margin targets and dynamically masking the sensitive bank account number to prevent unauthorized exposure on standard sales terminals, demonstrating the Principle of Least Privilege in action.",
    "In Scenarios 2 and 3, the platform demonstrates the vital operational synergy between organizational hierarchy and dynamic environmental policy enforcement. When VP Alice reviewed the account, the territory engine traversed the tree to identify her managerial placement in the parent Americas Theatre node, granting managerial rollup access and permitting visibility into sensitive margin targets required for executive deal approvals. Conversely, when Bob attempted to execute an unauthorized bulk export from an unmanaged mobile device, the ABAC policy engine intercepted the transaction at the Policy Enforcement Point, blocking the download and preventing cross-border regulatory violations. By combining hierarchical data trees, granular attribute filters, and dynamic environmental constraints into an integrated framework, the SovereignAccessGovernanceEngine provides enterprise revenue teams with an unshakeable security posture that facilitates high-velocity commercial selling."
]

p5_code = '''# Day 48 Part 5: Sovereign Enterprise Access & Territory Authorization Engine
import json
import hashlib
from datetime import datetime

class SovereignAccessGovernanceEngine:
    """Master Unified Enterprise Access Governance Engine: RBAC, HTM, FLS & ABAC."""
    def __init__(self):
        # 1. Territory Tree
        self.territories = {
            "T_ROOT": {"name": "Global Commercial Root", "parent": None, "users": set()},
            "T_AMER": {"name": "Americas Theatre", "parent": "T_ROOT", "users": {"USR-ALICE-VP"}},
            "T_NA_ENT": {"name": "NA Enterprise Accounts", "parent": "T_AMER", "users": {"USR-BOB-AE"}}
        }
        # 2. Field-Level Security Matrix
        self.fls_rules = {
            "STANDARD_AE": {
                "Account": {"name": "READ_WRITE", "revenue": "READ_ONLY", "margin_target": "HIDDEN", "tax_ssn": "MASKED"},
                "Opportunity": {"deal_name": "READ_WRITE", "amount": "READ_WRITE", "cogs_floor": "HIDDEN"}
            },
            "VP_SALES": {
                "Account": {"name": "READ_WRITE", "revenue": "READ_WRITE", "margin_target": "READ_WRITE", "tax_ssn": "MASKED"},
                "Opportunity": {"deal_name": "READ_WRITE", "amount": "READ_WRITE", "cogs_floor": "READ_ONLY"}
            }
        }
        self.security_audit_log = []

    def get_territory_ancestors(self, territory_id):
        ancestors = []
        curr = territory_id
        while curr and self.territories.get(curr, {}).get("parent"):
            curr = self.territories[curr]["parent"]
            ancestors.append(curr)
        return ancestors

    def check_territory_access(self, user_id, assigned_territory_id):
        """Check direct assignment or managerial rollup inheritance."""
        t_data = self.territories.get(assigned_territory_id)
        if not t_data:
            return False, "UNKNOWN_TERRITORY"
        if user_id in t_data["users"]:
            return True, f"DIRECT_TERRITORY_MEMBER: {t_data['name']}"
        for anc_id in self.get_territory_ancestors(assigned_territory_id):
            if user_id in self.territories[anc_id]["users"]:
                return True, f"MANAGERIAL_ROLLUP_FROM: {self.territories[anc_id]['name']}"
        return False, "NO_TERRITORY_PERMISSION"

    def apply_fls_masking(self, profile, s_object, raw_data):
        """Filter hidden fields and dynamically mask sensitive identifiers."""
        profile_map = self.fls_rules.get(profile, {}).get(s_object, {})
        sanitized = {}
        for k, v in raw_data.items():
            rule = profile_map.get(k, "HIDDEN")
            if rule == "HIDDEN":
                continue
            elif rule == "MASKED":
                s = str(v)
                sanitized[k] = ("*" * (len(s) - 4)) + s[-4:] if len(s) > 4 else "****"
            else:
                sanitized[k] = v
        return sanitized

    def evaluate_abac_policy(self, user_ctx, resource_ctx, action, env_ctx):
        """Dynamic ABAC policy evaluation point."""
        # Policy: Bulk export forbidden from unmanaged devices or for cross-border GDPR
        if action == "BULK_EXPORT":
            if not env_ctx.get("is_managed_device", False):
                return False, "DENIED_UNMANAGED_DEVICE"
            if resource_ctx.get("gdpr_protected", False) and user_ctx.get("region") != "EU":
                return False, "DENIED_CROSS_BORDER_GDPR_VIOLATION"
        return True, "PERMITTED_POLICY_APPROVED"

# End-to-end multi-persona simulation
engine = SovereignAccessGovernanceEngine()

print("=== SOVEREIGN ACCESS GOVERNANCE ENGINE SIMULATION ===")

# Raw database entity
raw_customer_account = {
    "name": "Apex Global Financial",
    "revenue": 140000000,
    "margin_target": 78.5,
    "tax_ssn": "987654321045",
    "assigned_territory": "T_NA_ENT",
    "gdpr_protected": True
}

# Scenario 1: Account Executive Bob accesses assigned account on managed laptop
print("[SCENARIO 1: STANDARD ACCOUNT EXECUTIVE ACCESS]")
t_auth_bob, t_reason_bob = engine.check_territory_access("USR-BOB-AE", raw_customer_account["assigned_territory"])
fls_bob = engine.apply_fls_masking("STANDARD_AE", "Account", raw_customer_account)
print(f"  Territory Permission: {t_auth_bob} ({t_reason_bob})")
print(f"  Sanitized Account Attributes (FLS Filtered & Masked):")
for k, v in fls_bob.items():
    print(f"    {k:<16}: {v}")

# Scenario 2: VP Alice accesses account via managerial rollup
print("[SCENARIO 2: MANAGERIAL ROLLUP INHERITANCE]")
t_auth_alice, t_reason_alice = engine.check_territory_access("USR-ALICE-VP", raw_customer_account["assigned_territory"])
fls_alice = engine.apply_fls_masking("VP_SALES", "Account", raw_customer_account)
print(f"  Territory Permission: {t_auth_alice} ({t_reason_alice})")
print(f"  VP Margin Target Visible: {fls_alice.get('margin_target')}% (Permitted for Executive)")

# Scenario 3: Bob attempts bulk export from personal mobile device
print("[SCENARIO 3: DYNAMIC ABAC POLICY ENFORCEMENT]")
user_bob_ctx = {"user_id": "USR-BOB-AE", "region": "NA"}
env_mobile = {"is_managed_device": False, "is_corporate_ip": False}
abac_auth, abac_reason = engine.evaluate_abac_policy(user_bob_ctx, raw_customer_account, "BULK_EXPORT", env_mobile)
print(f"  Bulk Export Decision: Permitted={abac_auth} | Rule: {abac_reason}")
'''

DAY_DATA = {
    "day": 48,
    "title": "Enterprise Access Governance: Role-Based Access Control (RBAC), Territory Hierarchy & Field-Level Security",
    "goal": "Master enterprise revenue access governance: multi-layered RBAC topology, hierarchical territory management with managerial rollup, kernel-level field security with dynamic data masking, and dynamic ABAC policy decision engines.",
    "minutes": 45,
    "recap": "On Day 47, we built the Reverse ETL warehouse operationalization pipeline. Today, in Day 48, we architect enterprise access governance: RBAC, Hierarchical Territory Management, Field-Level Security, and dynamic ABAC policy enforcement.",
    "summary": [
        "Enterprise access topology decouples baseline profiles from additive permission sets and vertical role hierarchies, enforcing the Principle of Least Privilege.",
        "Hierarchical Territory Management (HTM) models multi-dimensional sales trees, enabling automated assignment rules and managerial inheritance rollups.",
        "Field-Level Security (FLS) enforces column-level visibility at the database kernel layer, stripping hidden attributes from API queries and dynamically masking sensitive tokens.",
        "Attribute-Based Access Control (ABAC) evaluates dynamic multidimensional context tuples (Subject, Resource, Action, Environment) to enforce export restrictions and data residency.",
        "The SovereignAccessGovernanceEngine synthesizes RBAC, HTM, FLS, and ABAC into a unified, cryptographically auditable authorization framework."
    ],
    "projectStep": {
        "title": "Build the Sovereign Access Governance Engine",
        "steps": [
            "Construct user directory models and composable permission set registries enforcing baseline CRUD privileges.",
            "Formulate recursive territory hierarchy trees with automated multi-attribute assignment rules and managerial inheritance.",
            "Implement kernel-level Field-Level Security (FLS) and dynamic data masking for sensitive financial identifiers.",
            "Build the Attribute-Based Access Control (ABAC) Policy Decision Point (PDP) evaluating multi-factor contextual tuples.",
            "Execute end-to-end multi-persona simulation across direct territory access, managerial rollup, and ABAC export blocks."
        ]
    },
    "parts": [
        {
            "title": "Enterprise Access Topology: Profiles, Permission Sets, Roles & Multi-Org Federation",
            "say": p1_say,
            "code": p1_code,
            "diagnosticCheck": {
                "question": "What is the primary security advantage of using composable Permission Sets over permanently elevated User Profiles in enterprise CRM architectures?",
                "options": [
                    "Permission sets grant granular, modular, and temporary privileges without permanently expanding the user's baseline profile, honoring the Principle of Least Privilege.",
                    "Permission sets eliminate the need for enterprise identity providers and passwords.",
                    "Permission sets automatically increase sales commission payouts by twenty percent.",
                    "Permission sets permanently disable security auditing logs in the CRM."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Composable permission sets allow additive, auditable privilege grants without permanently elevating a user's base organizational profile."
            }
        },
        {
            "title": "Hierarchical Territory Management (HTM): Territory Trees, Assignment Rules & Matrix Inheritance",
            "say": p2_say,
            "code": p2_code,
            "diagnosticCheck": {
                "question": "How does managerial rollup inheritance operate in a Hierarchical Territory Management (HTM) tree?",
                "options": [
                    "A sales manager or VP positioned higher in the territory hierarchy automatically inherits visibility and access over all child territory nodes in their subtree.",
                    "Account access is randomized among all sales representatives every Monday morning.",
                    "Subordinate sales representatives automatically inherit the salary and commission rates of their regional VP.",
                    "Territory assignments expire every twenty-four hours, requiring manual reassignment."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Managerial rollup ensures that executives automatically inherit visibility over all records belonging to child territories in their branch."
            }
        },
        {
            "title": "Field-Level Security (FLS) & Object-Level Security (OLS): Principal of Least Privilege & Record Sharing Rules",
            "say": p3_say,
            "code": p3_code,
            "diagnosticCheck": {
                "question": "Why is Kernel-Level Field-Level Security (FLS) superior to hiding sensitive fields via user interface page layouts?",
                "options": [
                    "Because kernel FLS strips unauthorized attributes at the database query layer, preventing data leakage via REST APIs, GraphQL, and developer consoles.",
                    "Because page layout rules permanently delete the field data from the underlying database storage.",
                    "Because user interface layouts require manual approval from the Chief Executive Officer.",
                    "Because kernel FLS reduces network latency by ninety-five percent on mobile devices."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Page layouts only hide fields in the visual UI; kernel-level FLS blocks unauthorized field access across all API and query interfaces."
            }
        },
        {
            "title": "Dynamic Authorization & Attribute-Based Access Control (ABAC): Policy Enforcement Points (PEP)",
            "say": p4_say,
            "code": p4_code,
            "diagnosticCheck": {
                "question": "In an Attribute-Based Access Control (ABAC) architecture, what is the role of the Policy Enforcement Point (PEP)?",
                "options": [
                    "To intercept incoming user actions, assemble the multidimensional context tuple, query the Policy Decision Point, and enforce the authorization decision.",
                    "To generate monthly sales invoices and mail physical checks to vendors.",
                    "To compress database backups into encrypted zip archives.",
                    "To monitor network cables for physical wiretap intrusions."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The PEP acts as the runtime gateway intercepting requests, consulting the decision engine (PDP), and enforcing permits or denials."
            }
        },
        {
            "title": "Full Python Implementation: Sovereign Enterprise Access & Territory Authorization Engine",
            "say": p5_say,
            "code": p5_code,
            "diagnosticCheck": {
                "question": "In the SovereignAccessGovernanceEngine simulation, why was Account Executive Bob denied permission to execute a bulk export of customer records?",
                "options": [
                    "The ABAC policy engine detected that the request originated from an unmanaged, non-corporate mobile device, triggering an explicit policy denial.",
                    "Bob failed to pay his monthly CRM licensing fee.",
                    "The customer's bank account was closed by financial regulators.",
                    "The territory hierarchy tree crashed during recursive traversal."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The dynamic ABAC policy evaluated environmental context, explicitly denying bulk record exports from unmanaged personal devices."
            }
        }
    ]
}
