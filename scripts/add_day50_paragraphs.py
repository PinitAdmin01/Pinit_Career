with open('scripts/build_day50_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add to Part 1
p1_target = '''    "To ensure cost governance and prevent resource starvation, each ephemeral namespace is governed by strict Kubernetes ResourceQuotas and LimitRanges.'''
p1_replacement = '''    "Automated DNS and TLS lifecycle orchestration is executed using ExternalDNS and cert-manager inside the EKS cluster. When the ingress resource is instantiated in the ephemeral namespace, ExternalDNS detects the host rule, establishes an authenticated IAM session via EKS Pod Identity, and creates a Route 53 A record pointing to the Application Load Balancer. Concurrently, cert-manager provisions an authenticated TLS certificate or binds a pre-existing wildcard ACM certificate, guaranteeing that the preview environment is immediately accessible over encrypted HTTPS without manual DNS intervention.",
    "Furthermore, security isolation is reinforced through Kubernetes Role-Based Access Control (RBAC). Each preview namespace receives an isolated ServiceAccount with strictly scoped execution privileges, preventing pods within one pull request environment from querying Kubernetes secrets or interacting with workloads in adjacent preview or production namespaces.",
    "To ensure cost governance and prevent resource starvation, each ephemeral namespace is governed by strict Kubernetes ResourceQuotas and LimitRanges.'''

# Add to Part 2
p2_target = '''    "Additionally, platform teams implement Pull Request Label Filtering within the ApplicationSet generator.'''
p2_replacement = '''    "A critical operational challenge when generating dynamic hostnames is RFC 1123 DNS Label Normalization. Git branch names frequently contain characters that are illegal in DNS hostnames—such as forward slashes in 'feature/SEC-1049_crypto' or uppercase letters. The ApplicationSet controller executes built-in string transformations and normalization filters: converting slashes and underscores into hyphens, converting uppercase characters to lowercase, and truncating branch strings to ensure that generated DNS subdomains strictly comply with the sixty-three character limit of RFC 1123.",
    "Moreover, platform teams configure advanced ArgoCD SyncOptions within the ApplicationSet template. Enforcing 'CreateNamespace=true' guarantees that the ephemeral namespace is automatically created on demand. Specifying 'PruneLast=true' ensures that dependent services and pods are terminated before namespace deletion, while 'ApplyOutOfSyncOnly=true' reduces load on the Kubernetes API server by skipping manifests that have not changed across successive pull request commits.",
    "Additionally, platform teams implement Pull Request Label Filtering within the ApplicationSet generator.'''

# Add to Part 3
p3_target = '''    "Furthermore, data privacy and regulatory compliance (such as GDPR, HIPAA, and PCI-DSS) strictly forbid using unmasked production customer data in ephemeral environments.'''
p3_replacement = '''    "To accelerate schema initialization and maintain database hygiene, database administrators leverage PostgreSQL Template Databases ('CREATE DATABASE pr_42 TEMPLATE template_seed'). Creating a database from a pre-configured template executes as a fast block-level copy on the database filesystem, avoiding the need to execute hundreds of sequential migration SQL scripts from scratch. When the pull request is merged, the teardown hook executes an immediate 'DROP SCHEMA schema_pr_42 CASCADE' or terminates the template clone, reclaiming storage instantly.",
    "Furthermore, data privacy and regulatory compliance (such as GDPR, HIPAA, and PCI-DSS) strictly forbid using unmasked production customer data in ephemeral environments.'''

# Add to Part 4
p4_target = '''    "To provide developer visibility and prevent accidental interruption of active testing, the Reaper Lambda integrates with enterprise collaboration channels (such as Slack or Microsoft Teams).'''
p4_replacement = '''    "To provide comprehensive financial visibility, the platform integrates ephemeral resource tagging with AWS Cost Allocation Tags and AWS Budgets. By activating 'Environment' and 'PRNumber' as user-defined cost allocation tags in the AWS Billing console, FinOps teams track the exact dollar cost incurred by each individual pull request in Amazon Athena or AWS Cost Explorer. If total preview environment spending exceeds an allocated monthly threshold (such as five thousand dollars), AWS Budgets automatically triggers an alert that throttles non-essential preview provisioning until expired environments are purged.",
    "To provide developer visibility and prevent accidental interruption of active testing, the Reaper Lambda integrates with enterprise collaboration channels (such as Slack or Microsoft Teams).'''

# Add to Part 5
p5_target = '''    "Completing Block 10 and Milestone 9 elevates software engineering organizations to the pinnacle of cloud native maturity.'''
p5_replacement = '''    "The end-to-end execution of the Autonomous GitOps Platform represents the culmination of modern cloud engineering practices. By synthesizing declarative infrastructure with continuous verification, teams achieve true zero-downtime velocity. Every merged pull request carries a cryptographic audit trail: proving that infrastructure was provisioned via tested Terraform modules, reconciled via in-cluster GitOps, validated against compile-time CDK Aspects, stressed under AWS FIS chaos conditions, and validated in an isolated ephemeral environment before ever touching customer-facing production.",
    "Upon successful teardown, the orchestrator emits the verified confirmation token 'Status=EPHEMERAL_GITOPS_PLATFORM_VERIFIED', proving that all five stages completed with zero resource leakage and full mathematical compliance.",
    "Completing Block 10 and Milestone 9 elevates software engineering organizations to the pinnacle of cloud native maturity.'''

assert p1_target in content, "p1_target not found"
assert p2_target in content, "p2_target not found"
assert p3_target in content, "p3_target not found"
assert p4_target in content, "p4_target not found"
assert p5_target in content, "p5_target not found"

content = content.replace(p1_target, p1_replacement)
content = content.replace(p2_target, p2_replacement)
content = content.replace(p3_target, p3_replacement)
content = content.replace(p4_target, p4_replacement)
content = content.replace(p5_target, p5_replacement)

with open('scripts/build_day50_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully injected paragraphs into build_day50_cloud.py!")
