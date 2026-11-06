import csv
import os
from datetime import datetime

MEM_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
TASKS_CSV = os.path.join(MEM_DIR, "agent_tasks.csv")
CONTROL_CSV = os.path.join(MEM_DIR, "multi_agent_control.csv")

# 1. Register tasks TASK-1539..1543 in agent_tasks.csv
new_tasks = [
    ["TASK-1539", "Course 20", "python", "Day 51 - Cryptographic Foundations & Password Hashing with Argon2", "IN_PROGRESS", "Password hashing algorithms (bcrypt, scrypt, Argon2id), salt generation, timing attacks, and constant-time comparisons."],
    ["TASK-1540", "Course 20", "python", "Day 52 - OAuth2, OpenID Connect & Stateless JWT Architectures", "PENDING", "OAuth 2.0 authorization code flow, PKCE, OIDC identity tokens, asymmetric RSA/ECDSA JWT signing, and token revocation."],
    ["TASK-1541", "Course 20", "python", "Day 53 - Role-Based & Attribute-Based Access Control (RBAC/ABAC)", "PENDING", "Fine-grained authorization, role hierarchies, policy decision points (PDP), context attributes, and FastAPI security dependencies."],
    ["TASK-1542", "Course 20", "python", "Day 54 - API Security: OWASP Top 10, SQLi, XSS & CSRF Defense", "PENDING", "OWASP API Top 10 vulnerabilities, parameterized queries, input sanitization, CSRF token cookies, and security middleware."],
    ["TASK-1543", "Course 20", "python", "Day 55 - Zero-Trust Microservice Identity & Mutual TLS (mTLS)", "PENDING", "Zero-trust architecture, SPIFFE/SPIRE workload identity, X.509 certificate management, and mutual TLS encryption."]
]

with open(TASKS_CSV, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Registered TASK-1539..1543 in agent_tasks.csv")

# 2. Register AGENT-437 as In_Progress in multi_agent_control.csv
control_rows = []
with open(CONTROL_CSV, "r", encoding="utf-8") as f:
    control_rows = list(csv.reader(f))

control_rows.append([
    "AGENT-437",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1539..1543",
    "In_Progress",
    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "Course 20 (python) Block 11: Days 51-55 (Stage 11: Security, Cryptography & Auth Systems)",
    "", "", "", ""
])

with open(CONTROL_CSV, "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(control_rows)

print("Registered AGENT-437 as In_Progress in multi_agent_control.csv")
