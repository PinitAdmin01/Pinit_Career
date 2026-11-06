with open('scripts/build_day35_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Paragraph to append to p3_say
p3_extra = '''    "Additionally, to satisfy strict enterprise audit requirements, all Application Load Balancer access logs are automatically published to Amazon S3 server access logging buckets with server-side encryption enabled (SSE-S3 or SSE-KMS). These access logs capture client IP addresses, TLS protocol versions, cipher suites, target response times, and HTTP status codes, empowering security analytics with Amazon Athena queries."\n]\n\np3_code'''

# Paragraph to append to p4_say
p4_extra = '''    "To guarantee business continuity during mesh upgrades, the Istio control plane supports canary control plane revisions (such as 'revision: 1-22-0'). This allows platform engineers to run two versions of istiod side-by-side in production, migrating microservices gradually namespace-by-namespace and testing data plane compatibility before retiring the previous control plane version."\n]\n\np4_code'''

# Paragraph to append to p5_say
p5_extra = '''    "Finally, platform health is continuously audited by autonomous synthetic probes running from multiple external AWS regions. These synthetic canaries execute end-to-end user transactions every sixty seconds, asserting that p99 response times stay beneath one hundred milliseconds and verifying that zero-downtime rolling deployments maintain 100% availability during active cluster autoscaling events."\n]\n\np5_code'''

content = content.replace(']\n\np3_code', p3_extra, 1)
content = content.replace(']\n\np4_code', p4_extra, 1)
content = content.replace(']\n\np5_code', p5_extra, 1)

with open('scripts/build_day35_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Topped up Day 35 texts successfully.")
