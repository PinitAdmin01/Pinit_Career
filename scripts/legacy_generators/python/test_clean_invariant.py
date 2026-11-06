import re

sample = '"Mastered High Availability Clustering, Heartbeat Networks & Quorum Calculus ($Q > N/2$) and verified its core production invariant (Clustering Quorum Invariant: A cluster partition is authorized to execute writes if and only if it contains a strict majority of nodes)."'

cleaned = re.sub(
    r'\s+and verified its core production invariant\s*\((?:[^:)]+:\s*)?(.*?)\)',
    r'. Key takeaway: \1',
    sample
)

print("BEFORE:", sample)
print("AFTER: ", cleaned)
