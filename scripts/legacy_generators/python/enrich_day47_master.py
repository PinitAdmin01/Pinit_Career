with open('scripts/build_day47_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Part 1 addition (~90 words)
p1_target = 'updates the cluster state deterministically."'
p1_add = '''updates the cluster state deterministically.",
    "Additionally, enterprise platform teams evaluate Flux v2 as an alternative GitOps engine. While ArgoCD provides a centralized web dashboard and application controller, Flux v2 embraces a modular, composable micro-controller architecture: decomposing responsibilities across the Source Controller, Kustomize Controller, Helm Controller, and Notification Controller. Flux v2 natively supports Open Container Initiative (OCI) registries—such as Amazon Elastic Container Registry (ECR)—allowing teams to package, sign, and distribute Kubernetes manifests and Helm charts as immutable OCI artifacts, further streamlining secure GitOps supply chains."'''

# Part 2 addition (~160 words)
p2_target = 'restore the six-replica Git standard."'
p2_add = '''restore the six-replica Git standard.",
    "To orchestrate complex multi-step deployments, ArgoCD provides Sync Waves and Resource Hooks. In enterprise architectures, deploying an application often requires executing database schema migrations before launching updated application pods. Using the annotation argocd.argoproj.io/sync-wave with numeric priority values (e.g., wave -1 for database migrations, wave 0 for application deployments, wave 1 for ingress routes), ArgoCD coordinates ordered execution. The controller pauses until pre-sync migration jobs complete successfully before triggering pod rollout, guaranteeing zero data corruption during schema upgrades.",
    "Furthermore, ArgoCD handles SyncFail and PostSync hooks for automated incident mitigation. If a database migration job fails during a sync wave, the controller immediately intercepts the failure event, aborts the remaining waves, and triggers a SyncFail hook that invokes an automated rollback or alerts on-call SRE squads via PagerDuty, preventing broken application revisions from ever receiving live user traffic."'''

# Part 3 addition (~200 words)
p3_target = 'instances with zero code duplication."'
p3_add = '''instances with zero code duplication.",
    "In addition to Matrix Generators, enterprise platform teams leverage the ApplicationSet Pull Request (PR) Generator to implement Ephemeral Preview Environments. When a software developer opens a pull request against a microservice repository, the PR generator automatically discovers the branch, provisions an ephemeral Kubernetes namespace on a designated development cluster, and deploys the feature branch manifests. Automated bots post the unique preview URL directly as a comment on the pull request, enabling product managers and QA engineers to test live feature branches before code is merged.",
    "Once the pull request is merged into main or closed, the ApplicationSet PR generator automatically detects the event and triggers garbage collection: completely tearing down the preview namespace and deleting associated cloud resources within sixty seconds. This automated ephemeral lifecycle eliminates developer environment bottlenecks while preventing cloud resource waste across enterprise development clusters."'''

# Part 4 addition (~170 words)
p4_target = 'immediately and resets traffic to stable."'
p4_add = '''immediately and resets traffic to stable.",
    "From an AWS infrastructure integration perspective, Argo Rollouts pairs natively with the AWS Load Balancer Controller using TargetGroupBinding custom resources. In a standard Kubernetes deployment, shifting HTTP traffic proportionally requires deploying external proxies. With Argo Rollouts and the AWS Load Balancer Controller, the rollout controller directly manipulates the weights of target groups attached to an Amazon Application Load Balancer (ALB). During a canary release, the ALB splits incoming production HTTPS traffic at hardware line rate (e.g., 90% to the stable target group, 10% to the canary target group) with zero latency penalty.",
    "Furthermore, enterprise platforms deploy Blue-Green deployment strategies using Argo Rollouts for high-risk transactional services that cannot tolerate mixed-version traffic. The rollout provisions a brand-new green replica set alongside the active blue replica set. Automated analysis templates execute comprehensive end-to-end integration test suites against the green preview service; only after all tests pass with zero errors does the controller instantly switch the production active service selector to the green pods, achieving instantaneous atomic promotion."'''

# Part 5 addition (~230 words)
p5_target = 'conclude your mastery of enterprise GitOps on AWS!"'
p5_add = '''conclude your mastery of enterprise GitOps on AWS!",
    "To enforce strict enterprise security, platform architects integrate ArgoCD with AWS IAM Identity Center and external Identity Providers via OIDC and SAML. Granular role-based access control (RBAC) policies defined within the argocd-rbac-cm ConfigMap enforce least-privilege permissions: granting product engineering teams read-only access to their specific namespaces while restricting cluster-level administrative privileges strictly to platform reliability engineers. Furthermore, all ArgoCD API interactions and console logins generate immutable audit records streaming directly to AWS CloudTrail and Amazon OpenSearch for compliance indexing.",
    "Finally, enterprise platforms deploy Policy-as-Code admission controllers such as Kyverno or Open Policy Agent (OPA) Gatekeeper to enforce GitOps as the mandatory deployment vector. Admission controller policies intercept all incoming Kubernetes API requests: explicitly blocking any direct kubectl create or apply request initiated by human IAM roles, while permitting operations only from verified in-cluster GitOps service accounts. This technical constraint guarantees that no engineer can bypass the version-controlled Git review pipeline, establishing an impenetrable defense against unapproved production drift across the multi-account AWS cloud estate."'''

assert p1_target in c, "p1_target not found"
assert p2_target in c, "p2_target not found"
assert p3_target in c, "p3_target not found"
assert p4_target in c, "p4_target not found"
assert p5_target in c, "p5_target not found"

c = c.replace(p1_target, p1_add)
c = c.replace(p2_target, p2_add)
c = c.replace(p3_target, p3_add)
c = c.replace(p4_target, p4_add)
c = c.replace(p5_target, p5_add)

with open('scripts/build_day47_cloud.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Enriched build_day47_cloud.py with deep paragraphs!")
