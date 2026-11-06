# scripts/expand_day34.py
import re

path = "scripts/data_scrm_day34.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Part 1 additions
p1_add = '''    "From an enterprise IT and security governance perspective, multi-tenant workspace aggregation also resolves the critical operational risk of Shadow IT. When dozens of independent engineering squads create separate, ungated free-tier workspaces using company email addresses, sensitive intellectual property, customer data, and proprietary source code become scattered across disconnected cloud environments lacking corporate security compliance. The PLS aggregation engine identifies this sprawl, providing enterprise IT directors and Chief Information Security Officers (CISOs) with unified visibility into organizational footprint.",
    "Furthermore, modern PLS architectures implement Domain Hierarchy Resolution Rules: parsing corporate subdomains, acquisitions, and regional subsidiary domains (such as de.corp.apexconglomerate.com or apex-logistics.co.uk) and mapping them back to the canonical Global Ultimate Owner (GUO) entity in the CRM hierarchy. This automated domain mapping ensures that disparate bottom-up adoption signals across global business units are accurately credited to the enterprise account record rather than languishing as unassigned, orphaned trial accounts."'''

# Part 2 additions
p2_add = '''    "To prevent operational noise and sales rep alert fatigue, the PQL scoring algorithm must incorporate Time-Decay Weighting Functions. Product adoption is highly dynamic; an account that completed 2,000 actions three months ago but has logged zero active sessions over the past fourteen days is an account experiencing churn risk rather than an enterprise expansion opportunity. The scoring engine applies exponential half-life decay (e.g., a 14-day half-life on activity metrics), ensuring that high composite scores reflect immediate, active, compounding adoption velocity.",
    "Moreover, enterprise RevOps teams conduct rigorous Threshold Sensitivity Optimization using Receiver Operating Characteristic (ROC) curve analysis. Setting the PQL threshold too low (e.g., PQL_Score >= 45.0) floods Account Executives with premature, low-intent leads, wasting expensive sales capacity on teams that are merely casually testing free features. Conversely, setting the threshold too high (PQL_Score >= 95.0) delays sales engagement until after purchasing decisions have already solidified or competitors have intervened. Calibrating the threshold at 75.0 strikes the optimal equilibrium between lead volume and conversion probability."'''

# Part 4 additions
p4_add = '''    "Beyond rate-limiting and incremental hashing, enterprise Reverse ETL architectures must withstand CRM Schema Drift and Pipeline Resiliency Failures. In fast-scaling SaaS enterprises, CRM administrators frequently alter custom field definitions, rename API labels, or enforce mandatory validation rules without coordinating with data engineering teams. A resilient Reverse ETL engine implements Dead-Letter Queues (DLQs) and automated payload quarantine: if Salesforce rejects an account update due to a custom validation rule, the failed record is isolated into a DLQ with detailed error logs while the remainder of the bulk synchronization batch completes without interruption.",
    "Additionally, modern data architectures structure Reverse ETL on top of standardized Semantic Layer Modeling (such as dbt metric definitions). Rather than allowing engineers to write ad-hoc SQL transformations directly inside the sync tool, metrics like Monthly Active Users, Total Workspaces, and PQL Score are defined as version-controlled code in the central data warehouse repository. This semantic governance ensures that the exact same metric definition displayed on the CEO's executive dashboard matches the active seat count synced to the frontline sales rep's CRM interface."'''

# Part 5 additions
p5_add = '''    "From an organizational design standpoint, the successful deployment of a Product-Led Sales and Reverse ETL platform fundamentally transforms the relationship between Product, Marketing, and Sales. In the legacy go-to-market structure, these departments operated in contentious silos: Marketing blamed Sales for failing to close low-quality MQLs, Sales blamed Product for failing to build enterprise features, and Product blamed Sales for making unrealistic roadmap promises to prospective clients.",
    "By establishing a single source of truth grounded in verified product telemetry, the PLS platform creates an objective, data-driven revenue engine. Sales development representatives receive automated, pre-qualified target lists with complete visibility into exact feature usage and paywall friction points, enabling consultative, high-value conversations. Product managers gain empirical insight into which specific feature workflows trigger enterprise buying velocity, directly informing roadmap prioritization. And executive leadership gains real-time visibility into the health and expansion trajectory of the entire enterprise customer base.",
    "Finally, the platform establishes Continuous Closed-Loop Attribution: tracking opportunities from initial self-serve signup through PQL classification, executive sales engagement, and closed-won contract finalization. This closed-loop feedback provides revenue leaders with precise Return on Investment (ROI) metrics for product investments, proving that engineering investments in frictionless onboarding and viral collaboration features generate quantifiable enterprise contract revenue."'''

# Replace p1_say
target_p1 = '    "In Part 1, we build the Pure Python Workspace Identity Hierarchy & Product Telemetry Aggregator. We model individual user telemetry events, aggregate usage across multi-tenant workspaces, roll up metrics to master corporate domains, and track bottom-up organic expansion patterns."\n]'
replacement_p1 = target_p1[:-2] + ',\n' + p1_add + '\n]'

content = content.replace(target_p1, replacement_p1)

# Replace p2_say
target_p2 = '    "In Part 2, we build a Pure Python Multi-Factor PQL Scoring Engine from mathematical first principles. We define activation thresholds, compute usage velocity and viral invite rates, evaluate paywall friction signals, and classify account tiers across Self-Serve, Product-Qualified, and Enterprise Expansion targets."\n]'
replacement_p2 = target_p2[:-2] + ',\n' + p2_add + '\n]'

content = content.replace(target_p2, replacement_p2)

# Replace p4_say
target_p4 = '    "In Part 4, we build an Enterprise Reverse ETL Synchronization Engine in pure Python standard library. We implement incremental diffing, simulate bulk API batching with rate limit buffering, enforce field-level authority conflict resolution, and execute live product telemetry synchronization from warehouse to CRM."\n]'
replacement_p4 = target_p4[:-2] + ',\n' + p4_add + '\n]'

content = content.replace(target_p4, replacement_p4)

# Replace p5_say
target_p5 = '    "In Part 5, we execute this comprehensive Product-Led Sales & Reverse ETL Platform in pure Python standard library. We simulate a live streaming product event feed, calculate real-time PQL scores, execute incremental Reverse ETL syncs to CRM, generate contextual sales expansion alerts, and output the official cryptographically verified PLS Architecture Audit Certificate."\n]'
replacement_p5 = target_p5[:-2] + ',\n' + p5_add + '\n]'

content = content.replace(target_p5, replacement_p5)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Expansion applied successfully to scripts/data_scrm_day34.py")
