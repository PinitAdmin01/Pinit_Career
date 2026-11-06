# scripts/expand_scrm_day32.py
from pathlib import Path

path = Path('scripts/data_scrm_day32.py')
content = path.read_text(encoding='utf-8')

p1_extra = '''    "A secondary architectural complexity in identity resolution is The Subsidiary & Corporate Acquisition Hierarchy Problem. Modern global conglomerates do not operate as single legal entities; they consist of hundreds of acquired brands, regional operating companies, and international holding structures (for instance, Slack, Tableau, and MuleSoft operating under Salesforce; or YouTube, DeepMind, and Waymo operating under Alphabet). When an engineer registers using a '@deepmind.com' address, a naive domain matcher fails to connect the lead to the master 'Alphabet Inc' enterprise account. Enterprise L2A engines resolve this by querying external firmographic graph databases (such as Dun & Bradstreet D-U-N-S hierarchy trees, ZoomInfo, and Clearbit APIs) to traverse the organizational DAG from Domestic Ultimate Subsidiary up to Global Ultimate Parent, consolidating multi-brand purchasing signals into a unified enterprise buying committee.",
'''

p2_extra = '''    "To resolve word inversion anomalies where corporate entities reorder words, architects integrate Token Sort Ratio and N-Gram Blocking Keys into the similarity pipeline. Consider the common corporate variation: 'The Home Depot Inc' versus 'Home Depot, The'. Because Jaro-Winkler heavily penalizes differing initial prefixes (comparing 'the' against 'home'), the similarity score drops below 0.65. Token Sort Ratio eliminates this prefix distortion by tokenizing the strings into individual words, removing punctuation, sorting the tokens alphabetically (transforming both strings into 'depot home'), and then executing string distance calculations. Furthermore, to prevent O(N * M) Cartesian product compute explosions across millions of CRM records, the engine implements N-Gram Index Blocking: grouping accounts into shared 3-character phonetic clusters (Soundex and Double Metaphone keys) so fuzzy comparisons execute strictly against relevant candidate subsets in sub-millisecond time.",
'''

p4_extra = '''    "In addition to baseline quotas, the routing engine incorporates Rep Ramp Schedules, Capacity Thresholds, and Lead Decay Prevention. In scaling enterprise sales organizations, newly hired sales representatives undergo a structured multi-month ramp period (for example, 25% quota in Month 1, 50% in Month 2, 75% in Month 3, and 100% full capacity in Month 4). The Quota-Weighted Round-Robin router continuously scales each rep's allocation weight W_i by their active ramp multiplier, ensuring ramping reps develop pipeline without being overwhelmed. Furthermore, the engine monitors Active Working Pipeline (AWP) and Lead Fatigue: if a sales representative's active pipeline of un-contacted inbound leads exceeds their maximum cognitive threshold (typically 20 active leads), the engine triggers an automated circuit breaker: temporarily pausing new assignments to that rep and overflowing leads to secondary standby reps until the backlog is cleared within SLA boundaries.",
'''

p5_extra = '''    "The production platform incorporates Event-Driven Webhook Ingestion, Asynchronous Queue Buffering, and Dead-Letter Queue (DLQ) Resilience. When marketing form engines (Marketo, HubSpot, Webflow) fire thousands of concurrent HTTP POST webhooks during peak product launch events, synchronous database processing would exhaust connection pools and trigger HTTP 504 gateway timeouts. The L2A platform decouples ingestion via high-throughput distributed message brokers (Apache Kafka or AWS SQS). Inbound payloads are acknowledged with immediate HTTP 202 Accepted status codes and queued for asynchronous parallel processing by worker pools. If a payload contains corrupted JSON, invalid UTF-8 byte sequences, or unresolvable country codes, the worker automatically diverts the record to a Dead-Letter Queue (DLQ), firing automated PagerDuty alerts to revenue operations engineers for manual review within a 4-hour SLA.",
'''

content = content.replace(
    '    "In Part 1, we build the Pure Python Inbound Lead Fragmentation & Domain Normalization Engine.',
    p1_extra + '    "In Part 1, we build the Pure Python Inbound Lead Fragmentation & Domain Normalization Engine.'
)

content = content.replace(
    '    "In Part 2, we build Pure Python Levenshtein and Jaro-Winkler Distance Engines',
    p2_extra + '    "In Part 2, we build Pure Python Levenshtein and Jaro-Winkler Distance Engines'
)

content = content.replace(
    '    "In Part 4, we build an Enterprise Lead Routing DAG & Quota-Weighted Round-Robin Engine in pure Python',
    p4_extra + '    "In Part 4, we build an Enterprise Lead Routing DAG & Quota-Weighted Round-Robin Engine in pure Python'
)

content = content.replace(
    '    "In Part 5, we execute this comprehensive Enterprise Lead-to-Account Matching & Routing Platform in pure Python',
    p5_extra + '    "In Part 5, we execute this comprehensive Enterprise Lead-to-Account Matching & Routing Platform in pure Python'
)

path.write_text(content, encoding='utf-8')
print("Expanded day 32 text successfully!")
