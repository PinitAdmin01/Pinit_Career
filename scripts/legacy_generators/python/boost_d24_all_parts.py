import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day24 import get_day_24
d = get_day_24()

# Part 1 boost
d['parts'][0]['say'].extend([
    "Consider the psychological difference between how a junior candidate and a staff architect approach whiteboard real estate: A junior candidate fills the entire board with a tangled web of arrows and boxes, crossing lines everywhere until nobody can decipher the flow. A staff architect treats the whiteboard like an executive dashboard: They divide the board into clear, labeled quadrants: Requirements and Scale on the far left, High-Level Component Topology in the center, Data Models and Interfaces on the lower half, and Deep-Dive Trade-offs and Failure Modes on the right.",
    "Notice how this visual discipline reinforces your verbal command. When an interviewer glances at your board, they do not see chaotic scribbles; they see a structured, elegant architectural document that could be presented directly to an engineering director or VP of Infrastructure. This visual and verbal alignment is what commands unanimous Staff-level hiring committee consensus."
])

# Part 2 boost
d['parts'][1]['say'].extend([
    "Let us explore how back-of-the-envelope calculations protect you from architectural embarrassment. Suppose you are designing a URL shortener like bit.ly. An inexperienced engineer says: 'We need a distributed NoSQL database with 50 nodes and Kafka.' But when you do the math: 100 million URLs generated per year at 500 bytes each is only 50 GB of data per year! 50 GB easily fits on a single commodity SSD drive or a single PostgreSQL instance with replication! Recommending a 50-node Cassandra cluster for 50 GB of data proves that you have zero sense of financial or operational cost.",
    "By contrast, when designing a system where writes genuinely reach 50,000 QPS and storage hits petabytes, your calculations prove that single-node architectures are physically impossible. You can say: 'Because our network ingress reaches 400 Megabits per second and storage grows by 500 Gigabytes daily, we require horizontal partitioning and asynchronous write batching.' This quantitative grounding elevates your credibility to the highest tier of engineering leadership."
])

# Part 3 boost
d['parts'][2]['say'].extend([
    "Notice how API design separates senior practitioners from theoretical academics. In production systems, mobile clients drop connections constantly, requests time out, and users mash the submit button repeatedly. If your payment or post API does not enforce idempotency keys, you will double-charge credit cards or create duplicate posts every single day. When you explicitly specify an `Idempotency-Key: <uuidv4>` header and explain how the API gateway uses a Redis SETNX lock to reject concurrent duplicate requests, the interviewer knows you have built mission-critical production systems.",
    "Similarly, when designing list endpoints, explain why offset-based pagination fails at scale. With `LIMIT 20 OFFSET 1000000`, the database must scan 1,000,020 rows, discard the first million, and return twenty—a disastrous operation that causes CPU spikes and database timeouts. Cursor-based pagination, using an indexed column like `WHERE created_at < :cursor ORDER BY created_at DESC LIMIT 20`, executes in constant O(1) time regardless of whether you are reading page one or page one million."
])

# Part 4 boost
d['parts'][3]['say'].extend([
    "Let us examine how to handle the inevitable curveball questions that interviewers throw at minute 35. An interviewer might ask: 'What happens if your primary datacenter in Virginia experiences a complete fiber optic sever?' A junior candidate panics, assuming their design failed. A staff architect leans forward with calm confidence: 'That is an excellent scenario to explore. Let us examine our Disaster Recovery and Business Continuity posture.'",
    "You explain multi-region active-active versus active-passive deployments, Anycast DNS health check failover, and how you handle split-brain scenarios using distributed consensus protocols like Raft or Paxos. You analyze RTO (Recovery Time Objective) and RPO (Recovery Point Objective), explaining whether you accept a five-second data loss window in exchange for near-instant failover. When you speak the language of enterprise resilience, you prove that you are ready to steward the most critical infrastructure in the company."
])

# Part 5 boost
d['parts'][4]['say'].extend([
    "To build world-class fluency in the RADIO framework, practice drawing and narrating complete system design architectures in 35-minute solo time trials. Pick classic problems—URL Shortener, Distributed Rate Limiter, Web Crawler, Ride Sharing, Video Streaming, Collaborative Document Editing—and force yourself to follow the exact RADIO progression without skipping steps.",
    "Always remember the core truth of technical leadership: At the Staff and Principal level, your value is not measured by how many lines of code you personally write each day, but by the quality of the technical decisions you influence and the resilience of the systems you architect. The RADIO framework provides the communication bridge that turns your architectural intuition into influential, career-defining leadership."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 24 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day24.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_24():\n    return {json.dumps(d, indent=4)}\n')

print('Day 24 updated successfully!')
