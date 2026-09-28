/**
 * Distributed Systems in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const DIST_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Distributed Systems Foundations & Fallacies",
    "goal": "You can explain why systems are distributed, name the fallacies of distributed computing, handle partial failure with timeouts and retries, and calculate exponential backoff delays.",
    "minutes": 30,
    "recap": "Welcome to Distributed Systems. You know Python and basic data structures; this course shows how many machines work together as one reliable system.",
    "parts": [
      {
        "title": "Many machines acting as one",
        "say": [
          "A distributed system is a group of computers that work together and appear to users as a single system. Every large app you use, from UPI payments to video streaming, is one.",
          "We distribute for three reasons. Scale: one machine cannot hold all the data or handle all the traffic. Availability: if one machine fails, others keep serving. Latency: servers near users answer faster.",
          "The price is complexity. Machines talk over a network that can be slow, lose messages or split apart, and each machine can fail on its own.",
          "This course is about the patterns that make such systems reliable anyway: retries, replication, consensus, sharding, idempotency and more.",
          "The example spreads user records across three servers by a simple rule, the first idea of sharding.",
          "Keep asking one question throughout the course: what happens if this message is lost, delayed or duplicated?"
        ],
        "example": "A chain of restaurants: one kitchen could not feed a whole city, so there are many branches. Customers see one brand, but each branch can run out of an item or close for the day on its own.",
        "code": "servers = {0: {}, 1: {}, 2: {}}\nusers = [\"asha\", \"bala\", \"chitra\", \"dev\", \"esha\", \"farid\"]\nfor name in users:\n    server = sum(map(ord, name)) % 3\n    servers[server][name] = {\"balance\": 100}\nfor sid, data in servers.items():\n    print(\"server\", sid, \"holds\", sorted(data))",
        "output": "server 0 holds ['esha']\nserver 1 holds ['bala', 'dev']\nserver 2 holds ['asha', 'chitra', 'farid']",
        "codeNotes": [
          {
            "line": 4,
            "note": "A simple rule picks which server stores each user."
          }
        ],
        "tryIt": "Add four more users. Are they spread evenly? What would happen if server 1 went down?",
        "check": {
          "question": "Which is NOT a main reason to distribute a system?",
          "options": [
            "Scale beyond one machine",
            "Staying available when a machine fails",
            "Making the code simpler"
          ],
          "answer": 2,
          "why": "Distribution adds complexity; we accept it for scale, availability and latency."
        }
      },
      {
        "title": "The fallacies of distributed computing",
        "say": [
          "In the 1990s, engineers at Sun Microsystems listed eight false assumptions that newcomers make about networks. Every one of them causes real outages.",
          "The network is reliable. Latency is zero. Bandwidth is infinite. The network is secure.",
          "Topology does not change. There is one administrator. Transport cost is zero. The network is homogeneous.",
          "Each fallacy leads to a bug: no timeouts (latency is zero), no retries (the network is reliable), huge messages (bandwidth is infinite), trusting internal traffic (the network is secure).",
          "Good distributed code assumes the opposite of every fallacy: calls can fail, be slow, be expensive and be tampered with.",
          "Keep this list nearby when reviewing designs; it catches a surprising number of problems."
        ],
        "example": "Assuming the postal service never loses letters, always delivers the next day and never changes routes. Most of the time it works, until the day it does not.",
        "code": "fallacies = [\n    (\"The network is reliable\", \"add retries and idempotency\"),\n    (\"Latency is zero\", \"set timeouts and avoid chatty calls\"),\n    (\"Bandwidth is infinite\", \"keep messages small, paginate\"),\n    (\"The network is secure\", \"encrypt and authenticate everything\"),\n    (\"Topology does not change\", \"use service discovery\"),\n    (\"There is one administrator\", \"document and automate config\"),\n    (\"Transport cost is zero\", \"batch calls, measure data transfer\"),\n    (\"The network is homogeneous\", \"use standard protocols\"),\n]\nfor i, (myth, fix) in enumerate(fallacies, start=1):\n    print(f\"{i}. {myth:28} -> {fix}\")",
        "output": "1. The network is reliable      -> add retries and idempotency\n2. Latency is zero              -> set timeouts and avoid chatty calls\n3. Bandwidth is infinite        -> keep messages small, paginate\n4. The network is secure        -> encrypt and authenticate everything\n5. Topology does not change     -> use service discovery\n6. There is one administrator   -> document and automate config\n7. Transport cost is zero       -> batch calls, measure data transfer\n8. The network is homogeneous   -> use standard protocols",
        "codeNotes": [
          {
            "line": 3,
            "note": "Believing latency is zero leads to missing timeouts."
          }
        ],
        "tryIt": "Pick one fallacy and describe a bug it could cause in an app you use.",
        "check": {
          "question": "Which fallacy leads to code with no timeouts?",
          "options": [
            "Bandwidth is infinite",
            "Latency is zero",
            "There is one administrator"
          ],
          "answer": 1,
          "why": "If you assume calls are instant, you never plan for a call that hangs."
        }
      },
      {
        "title": "Partial failure and timeouts",
        "say": [
          "On one computer, a function either runs or the whole program crashes. In a distributed system, one part can fail while the rest keeps running: a partial failure.",
          "Worse, when a call gets no reply, you cannot tell whether the request was lost, the server crashed, the server is slow, or the reply was lost. The work may or may not have happened.",
          "Timeouts are the first defence: never wait forever. Choose a timeout a bit above normal response times, for example the 99th percentile plus a margin.",
          "After a timeout, the caller must decide: retry, try another server, or report an error. Tomorrow's lessons and Day 13 cover how to make retries safe.",
          "The simulation below uses a seeded random generator to model a server that sometimes fails and sometimes is slow.",
          "Notice that \"slow\" and \"failed\" look the same to a caller with a timeout."
        ],
        "example": "Sending a parcel with no tracking: if it has not arrived after a week, you do not know if it is lost, stuck at customs, or already delivered to a neighbour.",
        "code": "import random\n\nrng = random.Random(7)\nTIMEOUT_MS = 300\n\ndef call_server():\n    roll = rng.random()\n    if roll < 0.1:\n        return None, \"server crashed\"\n    latency = 800 if roll < 0.25 else rng.randint(40, 120)\n    return latency, \"ok\"\n\nfor i in range(8):\n    latency, status = call_server()\n    if latency is None or latency > TIMEOUT_MS:\n        print(f\"call {i}: TIMEOUT (really: {status if latency is None else 'slow, ' + str(latency) + ' ms'})\")\n    else:\n        print(f\"call {i}: ok in {latency} ms\")",
        "output": "call 0: ok in 59 ms\ncall 1: ok in 46 ms\ncall 2: TIMEOUT (really: server crashed)\ncall 3: ok in 86 ms\ncall 4: ok in 104 ms\ncall 5: TIMEOUT (really: slow, 800 ms)\ncall 6: TIMEOUT (really: server crashed)\ncall 7: ok in 70 ms",
        "codeNotes": [
          {
            "line": 3,
            "note": "A seeded generator makes the simulation repeatable."
          },
          {
            "line": 15,
            "note": "A crash and a slow reply look the same to the caller."
          }
        ],
        "tryIt": "Raise TIMEOUT_MS to 1000. Which calls now succeed, and what is the cost of waiting longer?",
        "check": {
          "question": "After a timeout, what does the caller know for certain?",
          "options": [
            "The server crashed",
            "The request was never processed",
            "Only that no reply arrived in time"
          ],
          "answer": 2,
          "why": "The request may have been processed, lost, or still be running; the caller cannot tell."
        }
      },
      {
        "title": "Retrying with exponential backoff",
        "say": [
          "Many failures are temporary: a brief network glitch or a server restarting. Retrying often succeeds.",
          "But retrying immediately and repeatedly can overload a struggling server. Exponential backoff waits longer after each failure: 100 ms, then 200, then 400.",
          "Practice 1: execute_with_backoff(call, max_retries, base_delay_ms, sleep). Try call(); on an exception, wait base_delay_ms x 2^(n-1) before retry n, up to max_retries retries, and re-raise the last error if all fail.",
          "The sleep function is passed in, so tests can record the waits instead of really waiting. This is dependency injection again, and it keeps tests fast.",
          "Return as soon as a call succeeds; there is no point waiting after success.",
          "Only retry operations that are safe to repeat, which Day 13 covers in depth."
        ],
        "example": "Knocking on a friend's door: if nobody answers, you wait a little, knock again, then wait longer before the third knock, rather than hammering non-stop.",
        "code": "def execute_with_backoff(call, max_retries=3, base_delay_ms=100, sleep=None):\n    for attempt in range(max_retries + 1):\n        try:\n            return call()\n        except Exception:\n            if attempt == max_retries:\n                raise\n            sleep(base_delay_ms * 2 ** attempt)\n\noutcomes = iter([ConnectionError(\"reset\"), TimeoutError(\"slow\"), \"payment ok\"])\ndef flaky():\n    result = next(outcomes)\n    if isinstance(result, Exception):\n        raise result\n    return result\n\nwaits = []\nprint(execute_with_backoff(flaky, sleep=waits.append))\nprint(\"waited (ms):\", waits)",
        "output": "payment ok\nwaited (ms): [100, 200]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Out of retries: re-raise the last error."
          },
          {
            "line": 8,
            "note": "Wait 100, 200, 400 ms... before each retry."
          },
          {
            "line": 18,
            "note": "Tests pass a recorder instead of really sleeping."
          }
        ],
        "tryIt": "Make every outcome an error. Check that the last error is raised and that three waits were recorded.",
        "check": {
          "question": "Why is sleep passed in as a parameter?",
          "options": [
            "Python has no sleep function",
            "So tests can record the waits instead of really waiting",
            "To make retries faster in production"
          ],
          "answer": 1,
          "why": "Injecting sleep keeps the logic testable and the tests instant."
        }
      },
      {
        "title": "Backoff delays, jitter and retry budgets",
        "say": [
          "Practice 2: backoff_delay(attempt, base_delay) returns base_delay x 2^(attempt - 1): 100, 200, 400, 800 for attempts 1 to 4.",
          "Cap the delay (for example at 10 seconds), so a long outage does not lead to absurd waits.",
          "Add jitter, a random extra amount, so thousands of clients that failed together do not all retry at the same instant and cause a new spike.",
          "Use a retry budget: allow retries for at most, say, 10% of calls. If many calls are failing, the service is down, and retrying everything only makes it worse.",
          "Retry only temporary errors (timeouts, connection resets, \"service unavailable\"). Never retry \"bad input\", which will fail the same way again.",
          "Backoff with jitter and budgets is standard in every major cloud client library."
        ],
        "example": "After a power cut, if every fridge and AC in the city switched on at exactly the same second, the grid would trip again. Staggering them avoids a second outage.",
        "code": "import random\n\ndef backoff_delay(attempt, base_delay=100):\n    return base_delay * 2 ** (attempt - 1)\n\ndef with_jitter_and_cap(attempt, rng, base=100, cap=10_000):\n    return min(cap, backoff_delay(attempt, base)) + rng.randrange(base)\n\nprint([backoff_delay(a) for a in range(1, 6)])\nrng = random.Random(1)\nprint([with_jitter_and_cap(a, rng) for a in range(1, 10)])",
        "output": "[100, 200, 400, 800, 1600]\n[117, 272, 497, 808, 1632, 3215, 6463, 10097, 10057]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Doubles with each attempt."
          },
          {
            "line": 7,
            "note": "Capped, plus random jitter."
          }
        ],
        "tryIt": "Compute backoff_delay(10). Why is a cap important?",
        "check": {
          "question": "What does jitter prevent?",
          "options": [
            "Long waits",
            "Many clients retrying at exactly the same moment",
            "Errors being raised"
          ],
          "answer": 1,
          "why": "Randomness spreads retries out so they do not arrive as a synchronised wave."
        }
      },
      {
        "title": "Latency and the long tail",
        "say": [
          "Average latency hides problems. What users feel is often the slow tail: the 99th percentile (p99), the time that 99% of calls beat.",
          "Fan-out makes the tail matter more. If a page calls 100 servers in parallel and each is slow 1% of the time, the page is slow whenever any one is slow.",
          "The chance that all 100 are fast is 0.99^100, about 37%, so 63% of page loads hit at least one slow server.",
          "Defences include hedged calls (send a backup call if the first is slow), timeouts, caching and reducing fan-out.",
          "Memorise rough latencies: memory access in nanoseconds, a datacentre round trip about half a millisecond, a cross-continent round trip over 100 milliseconds.",
          "These numbers explain why you keep chatty calls inside one datacentre and cache data near users."
        ],
        "example": "Waiting for a group of friends before a film: the group is only as fast as its slowest member, and the bigger the group, the more likely someone is late.",
        "code": "for servers in [1, 10, 100, 1000]:\n    all_fast = 0.99 ** servers\n    print(f\"fan-out to {servers:>4} servers: page slow {1 - all_fast:.1%} of the time\")\n\nlatency_ns = {\"memory read\": 100, \"SSD read\": 100_000, \"datacentre round trip\": 500_000, \"India to US round trip\": 200_000_000}\nfor what, ns in latency_ns.items():\n    print(f\"{what:24} {ns / 1e6:>10.3f} ms\")",
        "output": "fan-out to    1 servers: page slow 1.0% of the time\nfan-out to   10 servers: page slow 9.6% of the time\nfan-out to  100 servers: page slow 63.4% of the time\nfan-out to 1000 servers: page slow 100.0% of the time\nmemory read                   0.000 ms\nSSD read                      0.100 ms\ndatacentre round trip         0.500 ms\nIndia to US round trip      200.000 ms",
        "codeNotes": [
          {
            "line": 2,
            "note": "The chance that every server is fast."
          },
          {
            "line": 6,
            "note": "Rough numbers every engineer should know."
          }
        ],
        "tryIt": "If each server is slow only 0.1% of the time, how often is a 100-server page slow?",
        "check": {
          "question": "Why does fan-out make tail latency worse?",
          "options": [
            "Servers get slower when called together",
            "The page waits for the slowest of many calls, so rare slowness becomes common",
            "Fan-out uses more bandwidth only"
          ],
          "answer": 1,
          "why": "With many parallel calls, the chance that at least one is slow grows quickly."
        }
      }
    ],
    "summary": [
      "Distributed systems trade simplicity for scale, availability and latency.",
      "The eight fallacies are false assumptions that cause real outages.",
      "Partial failure means a missing reply could mean anything; always use timeouts.",
      "Retry temporary errors with exponential backoff, a cap, jitter and a budget.",
      "Watch tail latency (p99); fan-out makes rare slowness common."
    ],
    "projectStep": {
      "title": "Start dist_toolkit.py",
      "steps": [
        "Create dist_toolkit.py and add execute_with_backoff and backoff_delay.",
        "Test execute_with_backoff with a fake call that fails twice then succeeds.",
        "Bonus: add jitter and a cap, and print the delays for 8 attempts."
      ]
    }
  },
  {
    "day": 2,
    "title": "The CAP Theorem & PACELC Theorem",
    "goal": "You can explain replication trade-offs with the CAP and PACELC theorems, classify real databases, check for a quorum, and use R + W > N to reason about consistent reads.",
    "minutes": 30,
    "recap": "Yesterday you saw that networks fail in partial ways. Today you learn the fundamental trade-off that failure forces on any system that keeps copies of data.",
    "parts": [
      {
        "title": "Why keep copies",
        "say": [
          "To survive machine failures and serve users faster, systems keep several copies of each piece of data, called replicas, often in different racks or regions.",
          "Replicas must be kept in sync. When a user updates their address on one replica, the others must learn about it.",
          "If a replica has not yet received an update, a read from it returns old (stale) data.",
          "The central question of this lesson: when replicas cannot talk to each other, what should the system do with reads and writes?",
          "The example shows two replicas and an update that has not yet reached the second one.",
          "Every database you will use makes a choice here, and knowing it helps you use the database correctly."
        ],
        "example": "Two branches of a bank keeping paper ledgers: when you deposit money in one branch, the other only knows after the evening courier delivers the update.",
        "code": "replica_a = {\"balance\": 500}\nreplica_b = {\"balance\": 500}\nreplica_a[\"balance\"] += 200\nprint(\"read from A:\", replica_a[\"balance\"])\nprint(\"read from B:\", replica_b[\"balance\"], \"(stale until the update arrives)\")\nreplica_b.update(replica_a)\nprint(\"after sync, B:\", replica_b[\"balance\"])",
        "output": "read from A: 700\nread from B: 500 (stale until the update arrives)\nafter sync, B: 700",
        "codeNotes": [
          {
            "line": 3,
            "note": "The update reaches only replica A at first."
          },
          {
            "line": 6,
            "note": "Replication copies the change later."
          }
        ],
        "tryIt": "What should happen if a customer withdraws 600 from branch B before the sync? Think about it before the next part.",
        "check": {
          "question": "What is a stale read?",
          "options": [
            "A read that fails",
            "A read that returns data older than the latest write",
            "A read from a cache only"
          ],
          "answer": 1,
          "why": "A replica that has not received the latest update returns old data."
        }
      },
      {
        "title": "The CAP theorem",
        "say": [
          "CAP says: when a network partition (P) splits replicas apart, a system must choose between consistency (C) and availability (A).",
          "Consistency here means every read sees the latest write, as if there were one copy. Availability means every request to a working node gets a response.",
          "A CP system refuses some requests during a partition, rather than risk returning or accepting conflicting data. A bank ledger usually chooses this.",
          "An AP system keeps answering on both sides, accepting that replicas may disagree for a while and must be reconciled later. A social media like counter usually chooses this.",
          "Partitions are not optional in real networks, so the real choice is C or A while a partition lasts.",
          "The simulation shows both behaviours for the same partition."
        ],
        "example": "Two ticket counters at a stadium lose their phone line. They can stop selling (consistent, but unavailable) or keep selling and risk selling the same seat twice (available, but inconsistent).",
        "code": "def write(system, replicas, reachable, key, value):\n    if system == \"CP\" and len(reachable) <= len(replicas) // 2:\n        return \"REJECTED: cannot reach a majority\"\n    for r in reachable:\n        replicas[r][key] = value\n    return \"ACCEPTED\"\n\nfor system in [\"CP\", \"AP\"]:\n    replicas = {\"r1\": {}, \"r2\": {}, \"r3\": {}}\n    print(system, \"side with r1:\", write(system, replicas, [\"r1\"], \"seat-12\", \"asha\"))\n    print(system, \"side with r2+r3:\", write(system, replicas, [\"r2\", \"r3\"], \"seat-12\", \"bala\"))\n    print(\"   \", {r: d.get(\"seat-12\") for r, d in replicas.items()})",
        "output": "CP side with r1: REJECTED: cannot reach a majority\nCP side with r2+r3: ACCEPTED\n    {'r1': None, 'r2': 'bala', 'r3': 'bala'}\nAP side with r1: ACCEPTED\nAP side with r2+r3: ACCEPTED\n    {'r1': 'asha', 'r2': 'bala', 'r3': 'bala'}",
        "codeNotes": [
          {
            "line": 2,
            "note": "CP: refuse writes without a majority."
          },
          {
            "line": 5,
            "note": "AP: accept on whatever side you are on."
          }
        ],
        "tryIt": "Look at the AP result: seat-12 has two owners. How could the system reconcile this later?",
        "check": {
          "question": "During a network partition, what does a CP system do?",
          "options": [
            "Accepts all writes on both sides",
            "Refuses some requests to avoid conflicting data",
            "Deletes the partition"
          ],
          "answer": 1,
          "why": "CP keeps consistency by giving up availability on the minority side."
        }
      },
      {
        "title": "PACELC: the trade-off without failures",
        "say": [
          "CAP only talks about partitions. PACELC adds: Else (no partition), there is still a choice between Latency (L) and Consistency (C).",
          "Waiting for every replica to confirm a write makes reads consistent but slower. Answering after one replica confirms is fast but may let others serve stale data briefly.",
          "So a system is described by two choices: PA or PC during partitions, and EL or EC otherwise.",
          "Practice 1: classify_system(partition, normal) maps AP/EL to DynamoDB and Cassandra, CP/EC to Spanner and CockroachDB, CP/EL to MongoDB primary-secondary, and anything else to CUSTOM.",
          "A dict keyed by the (partition, normal) pair, with .get(..., \"CUSTOM\"), is the cleanest way to write it.",
          "Many databases let you tune these choices per query, so the labels describe defaults rather than fixed rules."
        ],
        "example": "Even on a normal day with working phones, the ticket counters must decide: call each other before every sale (consistent, slower) or sell immediately and sync later (fast, briefly inconsistent).",
        "code": "SYSTEMS = {\n    (\"AP\", \"EL\"): \"AP/EL (e.g. Amazon DynamoDB, Apache Cassandra)\",\n    (\"CP\", \"EC\"): \"CP/EC (e.g. Google Cloud Spanner, CockroachDB)\",\n    (\"CP\", \"EL\"): \"CP/EL (e.g. MongoDB primary-secondary)\",\n}\n\ndef classify_system(partition, normal):\n    return SYSTEMS.get((partition, normal), \"CUSTOM\")\n\nfor combo in [(\"AP\", \"EL\"), (\"CP\", \"EC\"), (\"CP\", \"EL\"), (\"AP\", \"EC\")]:\n    print(combo, \"->\", classify_system(*combo))",
        "output": "('AP', 'EL') -> AP/EL (e.g. Amazon DynamoDB, Apache Cassandra)\n('CP', 'EC') -> CP/EC (e.g. Google Cloud Spanner, CockroachDB)\n('CP', 'EL') -> CP/EL (e.g. MongoDB primary-secondary)\n('AP', 'EC') -> CUSTOM",
        "codeNotes": [
          {
            "line": 8,
            "note": "Look up the pair; anything unknown is CUSTOM."
          }
        ],
        "tryIt": "Which PACELC class would you want for a payments ledger, and which for a news feed?",
        "check": {
          "question": "What does the \"ELC\" part of PACELC describe?",
          "options": [
            "Behaviour during a partition",
            "The latency versus consistency choice when there is no partition",
            "Encryption settings"
          ],
          "answer": 1,
          "why": "Else (normal operation), a system trades latency against consistency."
        }
      },
      {
        "title": "Quorums and majorities",
        "say": [
          "Many CP systems use majorities. A group of N nodes can act only when more than half can talk to each other: a quorum.",
          "Practice 2: has_quorum(active_nodes, total_nodes) returns True when active_nodes > total_nodes // 2.",
          "Two groups cannot both hold a majority at the same time, which prevents split brain, where two sides each think they are in charge and accept conflicting writes.",
          "Clusters usually have an odd number of nodes. With 5 nodes, 3 are needed, so 2 failures can be tolerated. With 4 nodes, 3 are still needed, so a fourth node adds cost without adding tolerance.",
          "The formula for failures tolerated is (N - 1) // 2.",
          "You will meet quorums again in leader election (Day 7) and Raft consensus (Day 9)."
        ],
        "example": "A housing society meeting that can pass decisions only when more than half the members are present. Two rival meetings in different rooms cannot both have a majority.",
        "code": "def has_quorum(active_nodes, total_nodes):\n    return active_nodes > total_nodes // 2\n\nfor total in [3, 4, 5, 7]:\n    need = total // 2 + 1\n    print(f\"{total} nodes: need {need}, can lose {(total - 1) // 2}\")\nprint(has_quorum(2, 3), has_quorum(2, 4), has_quorum(3, 5))",
        "output": "3 nodes: need 2, can lose 1\n4 nodes: need 3, can lose 1\n5 nodes: need 3, can lose 2\n7 nodes: need 4, can lose 3\nTrue False True",
        "codeNotes": [
          {
            "line": 2,
            "note": "More than half, using whole-number division."
          },
          {
            "line": 6,
            "note": "Odd cluster sizes tolerate the most failures per node."
          }
        ],
        "tryIt": "A 6-node cluster splits 3 and 3. Can either side act? Check with has_quorum.",
        "check": {
          "question": "Why do clusters usually have an odd number of nodes?",
          "options": [
            "Odd numbers are faster",
            "Adding a node to make an even number costs more without tolerating more failures",
            "Even clusters cannot elect leaders"
          ],
          "answer": 1,
          "why": "4 nodes tolerate 1 failure, the same as 3; 5 tolerate 2."
        }
      },
      {
        "title": "Tunable consistency: R + W > N",
        "say": [
          "Systems like Cassandra and DynamoDB let you choose, per operation, how many replicas must answer: W for writes and R for reads, out of N replicas.",
          "If R + W > N, every read set overlaps every write set in at least one replica, so a read always sees the latest acknowledged write.",
          "With N = 3, W = 2 and R = 2 give consistent reads while tolerating one slow or failed replica.",
          "W = 1 and R = 1 is fastest but may return stale data. W = 3 is consistent with R = 1 but fails if any replica is down.",
          "This lets one database serve both a shopping cart (fast, tolerant) and an order total (consistent) with different settings.",
          "The code lists every combination for N = 3."
        ],
        "example": "Asking several friends what time the party starts: if the number who got the update plus the number you ask is more than the group size, at least one person you ask knows the latest time.",
        "code": "N = 3\nfor W in range(1, N + 1):\n    for R in range(1, N + 1):\n        overlap = R + W > N\n        print(f\"W={W} R={R}: {'consistent' if overlap else 'may be stale'}\")",
        "output": "W=1 R=1: may be stale\nW=1 R=2: may be stale\nW=1 R=3: consistent\nW=2 R=1: may be stale\nW=2 R=2: consistent\nW=2 R=3: consistent\nW=3 R=1: consistent\nW=3 R=2: consistent\nW=3 R=3: consistent",
        "codeNotes": [
          {
            "line": 4,
            "note": "Overlap guarantees a read touches a replica with the latest write."
          }
        ],
        "tryIt": "For N = 5, which (W, R) pairs give consistent reads while tolerating two failed replicas?",
        "check": {
          "question": "With N = 3 replicas, which setting guarantees reads see the latest write?",
          "options": [
            "W = 1, R = 1",
            "W = 2, R = 2",
            "W = 1, R = 2"
          ],
          "answer": 1,
          "why": "2 + 2 = 4 > 3, so every read overlaps every write."
        }
      },
      {
        "title": "Choosing for real products",
        "say": [
          "Start from the business cost of each kind of error. A double-spent balance or an oversold seat is expensive; a like count that is briefly off is not.",
          "Money, inventory and unique usernames usually need strong consistency (CP/EC or quorum reads and writes).",
          "Feeds, counters, recommendations and analytics usually prefer availability and low latency (AP/EL).",
          "Many products mix both: a strongly consistent payments service next to an eventually consistent activity feed.",
          "Write the choice down in the design document, with the reason. It saves arguments later and guides testing.",
          "Tomorrow you will see how services talk to each other efficiently with RPC and Protocol Buffers."
        ],
        "example": "A shop that counts cash carefully at the till every time, but is happy for the \"visitors today\" counter at the door to be roughly right.",
        "code": "def recommend(data_kind):\n    strong = {\"account balance\", \"seat booking\", \"unique username\", \"stock count\"}\n    return \"strong consistency (CP/EC, quorum)\" if data_kind in strong else \"availability and low latency (AP/EL)\"\n\nfor kind in [\"account balance\", \"like count\", \"seat booking\", \"news feed\", \"unique username\"]:\n    print(f\"{kind:16} -> {recommend(kind)}\")",
        "output": "account balance  -> strong consistency (CP/EC, quorum)\nlike count       -> availability and low latency (AP/EL)\nseat booking     -> strong consistency (CP/EC, quorum)\nnews feed        -> availability and low latency (AP/EL)\nunique username  -> strong consistency (CP/EC, quorum)",
        "codeNotes": [
          {
            "line": 2,
            "note": "Data where errors cost real money or trust."
          }
        ],
        "tryIt": "Add three kinds of data from an app you use and decide which side each belongs on.",
        "check": {
          "question": "Which data most needs strong consistency?",
          "options": [
            "Number of views on a video",
            "Remaining seats on a flight",
            "A list of recommended songs"
          ],
          "answer": 1,
          "why": "Overselling seats has real costs, so the count must be consistent."
        }
      }
    ],
    "summary": [
      "Replicas improve availability and speed but can serve stale data.",
      "CAP: during a partition, choose consistency or availability.",
      "PACELC: otherwise, choose latency or consistency.",
      "Quorums need a majority: active > total // 2; odd sizes are efficient.",
      "R + W > N makes reads see the latest acknowledged write."
    ],
    "projectStep": {
      "title": "Consistency tools",
      "steps": [
        "Add classify_system and has_quorum to dist_toolkit.py.",
        "Print a table of failures tolerated for 3, 5 and 7 nodes.",
        "Bonus: list the (W, R) pairs that are consistent for N = 5."
      ]
    }
  },
  {
    "day": 3,
    "title": "RPC Communication & Protocol Buffers Binary Serialization",
    "goal": "You can explain remote procedure calls, compare text and binary serialisation, encode varints and Protobuf tags by hand, evolve schemas safely, and use deadlines in RPC.",
    "minutes": 30,
    "recap": "Yesterday you reasoned about replicas. They, and every other service, must exchange messages. Today: how services call each other and how data travels as bytes.",
    "parts": [
      {
        "title": "Remote procedure calls",
        "say": [
          "A remote procedure call (RPC) lets code call a function on another machine as if it were local: result = inventory.get_stock(\"sku-42\").",
          "Behind the scenes, a client stub turns the call into bytes (serialisation), sends them over the network, and the server stub turns them back into a call, runs it, and sends the result back.",
          "gRPC, Thrift and many internal frameworks work like this. REST with JSON is a looser cousin of the same idea.",
          "The danger is that a remote call looks local but is not: it can be slow, fail halfway, or time out. Remember the fallacies from Day 1.",
          "The example imitates a stub, a network (bytes only) and a server, using JSON for the bytes.",
          "Notice that only bytes cross the network; both sides must agree on how to read them."
        ],
        "example": "Ordering food by phone: you speak as if the kitchen were next to you, but your words are turned into sound, travel down the line, and a person on the other side turns them back into an order.",
        "code": "import json\n\ndef server_handle(raw):\n    msg = json.loads(raw.decode())\n    stock = {\"sku-42\": 7}.get(msg[\"args\"][\"sku\"], 0)\n    return json.dumps({\"result\": stock}).encode()\n\ndef get_stock(sku):\n    request = json.dumps({\"method\": \"get_stock\", \"args\": {\"sku\": sku}}).encode()\n    print(\"on the wire:\", request)\n    reply = server_handle(request)\n    return json.loads(reply.decode())[\"result\"]\n\nprint(\"stock:\", get_stock(\"sku-42\"))",
        "output": "on the wire: b'{\"method\": \"get_stock\", \"args\": {\"sku\": \"sku-42\"}}'\nstock: 7",
        "codeNotes": [
          {
            "line": 9,
            "note": "The client stub turns the call into bytes."
          },
          {
            "line": 11,
            "note": "Only bytes cross the \"network\"."
          },
          {
            "line": 4,
            "note": "The server stub turns bytes back into a call."
          }
        ],
        "tryIt": "Call get_stock(\"sku-99\"). Where does the 0 come from?",
        "check": {
          "question": "What does a client stub do in RPC?",
          "options": [
            "Runs the function locally",
            "Turns the call into bytes, sends them, and turns the reply back into a result",
            "Stores data in a database"
          ],
          "answer": 1,
          "why": "The stub hides serialisation and networking behind a normal-looking function call."
        }
      },
      {
        "title": "Text versus binary serialisation",
        "say": [
          "JSON is readable and universal, but verbose: field names are repeated in every message, and numbers are written as text.",
          "Binary formats like Protocol Buffers (Protobuf) send numbers in compact binary form and replace field names with small field numbers defined in a shared schema.",
          "The result is usually several times smaller and faster to parse, which matters for services exchanging millions of messages per second.",
          "The cost is readability: you need the schema to decode the bytes, and debugging needs tools.",
          "Python's struct module packs numbers into fixed binary sizes, which shows the size difference clearly.",
          "Many teams use JSON at the edges (public APIs) and Protobuf between internal services."
        ],
        "example": "Writing a full letter versus filling in a form with numbered boxes: the form is shorter because both sides already know what box 3 means.",
        "code": "import json\nimport struct\n\norder = {\"order_id\": 123456, \"quantity\": 3, \"price_paise\": 49900}\nas_json = json.dumps(order).encode()\nas_binary = struct.pack(\"<IHI\", order[\"order_id\"], order[\"quantity\"], order[\"price_paise\"])\nprint(len(as_json), \"bytes as JSON:\", as_json)\nprint(len(as_binary), \"bytes as binary:\", as_binary.hex())\nprint(\"decoded:\", struct.unpack(\"<IHI\", as_binary))",
        "output": "57 bytes as JSON: b'{\"order_id\": 123456, \"quantity\": 3, \"price_paise\": 49900}'\n10 bytes as binary: 40e201000300ecc20000\ndecoded: (123456, 3, 49900)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Fixed layout: 4-byte, 2-byte and 4-byte unsigned integers."
          },
          {
            "line": 9,
            "note": "Decoding needs the same layout, like a schema."
          }
        ],
        "tryIt": "Add a \"customer_id\" field to both formats. How much does each grow?",
        "check": {
          "question": "Why are binary formats like Protobuf smaller than JSON?",
          "options": [
            "They compress text with zip",
            "They use numeric field tags and binary numbers instead of repeated names and digits",
            "They drop some fields"
          ],
          "answer": 1,
          "why": "A shared schema replaces names with small numbers, and numbers are stored compactly."
        }
      },
      {
        "title": "Varints: small numbers, few bytes",
        "say": [
          "Protobuf stores integers as varints, so small numbers take fewer bytes. Each byte carries 7 bits of the number, lowest bits first.",
          "The top bit (0x80) of each byte is a continuation flag: 1 means \"more bytes follow\", 0 means \"this is the last byte\".",
          "Practice 1: encode_varint(value). While the value is 128 or more, output (value & 0x7F) | 0x80 and shift the value right by 7. Then output the final value.",
          "300 is 100101100 in binary. The low 7 bits (0101100 = 0x2C) with the flag give 0xAC; the remaining bits give 0x02. So 300 becomes [0xAC, 0x02].",
          "Numbers under 128 take one byte, under 16,384 take two, which suits IDs and counts that are usually small.",
          "Decoding reverses the process, adding each 7-bit group shifted into place until a byte without the flag appears."
        ],
        "example": "Writing a long number across several lines of a form, with an arrow at the end of each line that means \"continues on the next line\".",
        "code": "def encode_varint(value):\n    out = []\n    while value >= 0x80:\n        out.append((value & 0x7F) | 0x80)\n        value >>= 7\n    out.append(value)\n    return out\n\ndef decode_varint(data):\n    value, shift = 0, 0\n    for byte in data:\n        value |= (byte & 0x7F) << shift\n        shift += 7\n        if not byte & 0x80:\n            break\n    return value\n\nfor n in [1, 127, 128, 300, 16384]:\n    encoded = encode_varint(n)\n    print(n, \"->\", [hex(b) for b in encoded], \"-> back to\", decode_varint(encoded))",
        "output": "1 -> ['0x1'] -> back to 1\n127 -> ['0x7f'] -> back to 127\n128 -> ['0x80', '0x1'] -> back to 128\n300 -> ['0xac', '0x2'] -> back to 300\n16384 -> ['0x80', '0x80', '0x1'] -> back to 16384",
        "codeNotes": [
          {
            "line": 4,
            "note": "Low 7 bits, with the \"more follows\" flag set."
          },
          {
            "line": 5,
            "note": "Move on to the next 7 bits."
          },
          {
            "line": 14,
            "note": "A byte without the flag is the last one."
          }
        ],
        "tryIt": "Encode 1,000,000 and count the bytes. How many would a fixed 8-byte integer use?",
        "check": {
          "question": "What is 300 as a varint?",
          "options": [
            "[0x01, 0x2C]",
            "[0xAC, 0x02]",
            "[0x12, 0xC0]"
          ],
          "answer": 1,
          "why": "Low 7 bits 0x2C plus the flag make 0xAC; the remaining bits are 0x02."
        }
      },
      {
        "title": "Tags and wire types",
        "say": [
          "Each Protobuf field starts with a tag: (field_number << 3) | wire_type. The field number comes from the schema; the wire type says how to read the value.",
          "Wire type 0 is VARINT, 1 is FIXED64 (8 bytes), 2 is LENGTH_DELIMITED (a length, then that many bytes: strings, bytes, nested messages), and 5 is FIXED32.",
          "Practice 2: wire_type(tag) returns the name for tag & 0x07, the lowest three bits, or UNKNOWN.",
          "The field number is tag >> 3. Together, these tell a decoder which field it is reading and how many bytes to consume.",
          "The example encodes a tiny message by hand: field 1 is the number 150, field 2 is the text \"hi\".",
          "Seeing the bytes once makes Protobuf feel much less magical."
        ],
        "example": "A shipping label with a two-part code: the department number, and a letter saying whether the parcel is an envelope, a box, or a tube, so the sorter knows how to handle it.",
        "code": "WIRE_TYPES = {0: \"VARINT\", 1: \"FIXED64\", 2: \"LENGTH_DELIMITED\", 5: \"FIXED32\"}\n\ndef wire_type(tag):\n    return WIRE_TYPES.get(tag & 0x07, \"UNKNOWN\")\n\ndef varint(v):\n    out = []\n    while v >= 0x80:\n        out.append((v & 0x7F) | 0x80)\n        v >>= 7\n    return out + [v]\n\nmessage = [(1 << 3) | 0] + varint(150) + [(2 << 3) | 2, 2] + list(b\"hi\")\nprint(\"bytes:\", [hex(b) for b in message])\nprint(\"first tag:\", message[0], \"field\", message[0] >> 3, wire_type(message[0]))\nprint(\"second tag:\", message[3], \"field\", message[3] >> 3, wire_type(message[3]))",
        "output": "bytes: ['0x8', '0x96', '0x1', '0x12', '0x2', '0x68', '0x69']\nfirst tag: 8 field 1 VARINT\nsecond tag: 18 field 2 LENGTH_DELIMITED",
        "codeNotes": [
          {
            "line": 4,
            "note": "The lowest three bits give the wire type."
          },
          {
            "line": 13,
            "note": "Field 1 = 150 as a varint; field 2 = length 2, then \"hi\"."
          }
        ],
        "tryIt": "Add field 3 with the value 1 (a varint). What tag byte does it get?",
        "check": {
          "question": "What does wire type 2 (LENGTH_DELIMITED) mean?",
          "options": [
            "A fixed 8-byte number",
            "A length follows, then that many bytes",
            "A varint"
          ],
          "answer": 1,
          "why": "Strings, bytes and nested messages are sent as a length and then their bytes."
        }
      },
      {
        "title": "Evolving schemas safely",
        "say": [
          "Services are updated at different times, so old and new versions must understand each other's messages. This is schema evolution.",
          "Protobuf makes it possible: decoders skip fields they do not know (using the wire type to know how many bytes to skip), and missing fields get default values.",
          "Rules: add new fields with new numbers; never change the type of an existing field; never reuse a deleted field's number (mark it reserved instead).",
          "Renaming a field is safe on the wire, because only numbers are sent, but it can confuse people reading code.",
          "The decoder below reads only the fields it knows and skips the rest, just like an old service receiving a newer message.",
          "Backward and forward compatibility is what allows zero-downtime deployments."
        ],
        "example": "A form printed with an extra box on a new version: offices with the old instructions simply ignore the new box, and nothing breaks.",
        "code": "def read_varint(data, i):\n    value, shift = 0, 0\n    while True:\n        b = data[i]\n        value |= (b & 0x7F) << shift\n        i, shift = i + 1, shift + 7\n        if not b & 0x80:\n            return value, i\n\ndef decode_known(data, known):\n    i, result = 0, {}\n    while i < len(data):\n        tag, i = read_varint(data, i)\n        field, wtype = tag >> 3, tag & 7\n        if wtype == 0:\n            value, i = read_varint(data, i)\n        else:\n            length, i = read_varint(data, i)\n            value, i = bytes(data[i:i + length]).decode(), i + length\n        if field in known:\n            result[known[field]] = value\n    return result\n\nnew_message = [0x08, 0x96, 0x01, 0x12, 0x02, 0x68, 0x69, 0x18, 0x01]\nprint(\"old service:\", decode_known(new_message, {1: \"id\", 2: \"name\"}))\nprint(\"new service:\", decode_known(new_message, {1: \"id\", 2: \"name\", 3: \"is_premium\"}))",
        "output": "old service: {'id': 150, 'name': 'hi'}\nnew service: {'id': 150, 'name': 'hi', 'is_premium': 1}",
        "codeNotes": [
          {
            "line": 14,
            "note": "The tag gives the field number and how to read it."
          },
          {
            "line": 20,
            "note": "Unknown fields are read past, then ignored."
          },
          {
            "line": 24,
            "note": "A message from a newer version with field 3."
          }
        ],
        "tryIt": "Remove field 2 from the old service's known fields. What does it return now?",
        "check": {
          "question": "Why must a deleted field's number never be reused?",
          "options": [
            "Numbers run out",
            "Old messages with that number would be misread as the new field",
            "Protobuf forbids more than 10 fields"
          ],
          "answer": 1,
          "why": "Old senders may still send the old field under that number, which would now be misinterpreted."
        }
      },
      {
        "title": "Deadlines, retries and status codes",
        "say": [
          "Every RPC should carry a deadline: the time by which the caller needs an answer. gRPC passes deadlines along a chain of calls, so downstream services stop work nobody is waiting for.",
          "Pass the remaining time, not the original timeout. If service A has 500 ms and spends 200, it gives B only the 300 ms that are left.",
          "Use clear status codes: gRPC has codes like OK, INVALID_ARGUMENT, NOT_FOUND, DEADLINE_EXCEEDED and UNAVAILABLE. Retry only the temporary ones (UNAVAILABLE, sometimes DEADLINE_EXCEEDED).",
          "Retrying calls that change data is dangerous unless they are idempotent, a topic for Day 13.",
          "Tomorrow you will spread data across many servers with consistent hashing.",
          "Design RPC interfaces to be coarse, doing meaningful work per call, rather than chatty, since every call pays network latency."
        ],
        "example": "A relay race with a total time limit: each runner gets only the time left on the clock, and if time has run out, the next runner does not bother starting.",
        "code": "def call_chain(services, budget_ms):\n    for name, cost_ms in services:\n        if budget_ms <= 0:\n            return f\"DEADLINE_EXCEEDED before {name}\"\n        budget_ms -= cost_ms\n        print(f\"{name} used {cost_ms} ms, {max(budget_ms, 0)} ms left\")\n    return \"OK\" if budget_ms >= 0 else \"DEADLINE_EXCEEDED\"\n\nprint(call_chain([(\"api\", 50), (\"orders\", 120), (\"inventory\", 80)], budget_ms=500))\nprint(call_chain([(\"api\", 50), (\"orders\", 400), (\"inventory\", 80), (\"payments\", 90)], budget_ms=500))",
        "output": "api used 50 ms, 450 ms left\norders used 120 ms, 330 ms left\ninventory used 80 ms, 250 ms left\nOK\napi used 50 ms, 450 ms left\norders used 400 ms, 50 ms left\ninventory used 80 ms, 0 ms left\nDEADLINE_EXCEEDED before payments",
        "codeNotes": [
          {
            "line": 3,
            "note": "No time left: do not start work nobody is waiting for."
          },
          {
            "line": 5,
            "note": "Pass on only the remaining budget."
          }
        ],
        "tryIt": "Give the second chain a budget of 700 ms. Does it finish now?",
        "check": {
          "question": "Why pass the remaining deadline to downstream services?",
          "options": [
            "To make them faster",
            "So they stop work that the original caller will no longer wait for",
            "Deadlines are required by JSON"
          ],
          "answer": 1,
          "why": "Work finished after the caller gave up is wasted capacity."
        }
      }
    ],
    "summary": [
      "RPC makes remote calls look local, but they can fail and be slow.",
      "Binary formats like Protobuf are smaller and faster than JSON.",
      "Varints use 7 bits per byte with a continuation flag; 300 is [0xAC, 0x02].",
      "Tags are (field << 3) | wire_type; unknown fields are skipped.",
      "Evolve schemas with new numbers only; pass remaining deadlines down."
    ],
    "projectStep": {
      "title": "Serialisation tools",
      "steps": [
        "Add encode_varint and wire_type to dist_toolkit.py.",
        "Encode a small message with two fields by hand and decode it back.",
        "Bonus: write decode_varint and test it on 10 random numbers."
      ]
    }
  },
  {
    "day": 4,
    "title": "Consistent Hashing & Virtual Nodes Distribution",
    "goal": "You can explain why hash-mod-N sharding breaks when nodes change, build a consistent hash ring with virtual nodes, estimate how many keys move, and find replica nodes on the ring.",
    "minutes": 30,
    "recap": "Yesterday you sent data between services. Today you decide which server stores which data, in a way that survives servers joining and leaving.",
    "parts": [
      {
        "title": "The problem with hash mod N",
        "say": [
          "A simple way to spread keys over N servers is server = hash(key) % N. It spreads keys evenly and is easy to compute.",
          "The problem appears when N changes. Adding one server changes N, and most keys suddenly map to a different server.",
          "And N changes often in real life: servers fail, get replaced, and are added for busy seasons like festival sales.",
          "For a cache, that means most lookups miss at once, and the database is flooded. For a database, it means moving most of the data.",
          "Going from 4 to 5 servers moves about 80% of keys with mod-N. Ideally, only about 20% (the new server's fair share) should move.",
          "Consistent hashing achieves that ideal. It is used in Cassandra, DynamoDB, Memcached clients, load balancers and CDNs.",
          "The example measures how many keys move with mod-N. We use hashlib.md5 so hashes are the same on every run."
        ],
        "example": "Renumbering every house on a street when one new house is built: suddenly nobody's address is right, and every letter goes to the wrong door.",
        "code": "import hashlib\n\ndef h(key):\n    return int(hashlib.md5(key.encode()).hexdigest(), 16)\n\nkeys = [f\"user-{i}\" for i in range(10_000)]\nbefore = {k: h(k) % 4 for k in keys}\nafter = {k: h(k) % 5 for k in keys}\nmoved = sum(before[k] != after[k] for k in keys)\nprint(f\"4 -> 5 servers with mod N: {moved / len(keys):.1%} of keys moved\")",
        "output": "4 -> 5 servers with mod N: 79.8% of keys moved",
        "codeNotes": [
          {
            "line": 4,
            "note": "A stable hash, the same on every run."
          },
          {
            "line": 9,
            "note": "Count keys whose server changed."
          }
        ],
        "tryIt": "Try going from 10 to 11 servers. What fraction moves now?",
        "check": {
          "question": "What goes wrong with hash(key) % N when a server is added?",
          "options": [
            "Nothing",
            "Most keys map to a different server",
            "Keys are lost forever"
          ],
          "answer": 1,
          "why": "Changing N changes almost every result of the modulo."
        }
      },
      {
        "title": "The hash ring",
        "say": [
          "Consistent hashing places both servers and keys on a circle of hash values, from 0 up to the maximum, wrapping back to 0.",
          "Each key belongs to the first server found by moving clockwise from the key's position. If there is none before the end, wrap round to the first server.",
          "When a server joins, it only takes keys from the arc just before it. When it leaves, only its keys move, to the next server clockwise.",
          "In code, keep the server positions in a sorted list and use bisect to find the first position greater than or equal to the key's hash. An index equal to the list length wraps to 0.",
          "The ring is only a picture: in memory it is just that sorted list, and \"clockwise\" means \"the next bigger number\".",
          "That makes lookups O(log N) in the number of ring positions.",
          "We use a small ring (hashes mod 360, like degrees) in the example so the numbers are easy to read."
        ],
        "example": "Seats around a round table, with a waiter at a few positions: each guest is served by the next waiter clockwise. A new waiter only takes over the guests just before them.",
        "code": "import bisect\n\nring = sorted([(90, \"server-A\"), (200, \"server-B\"), (300, \"server-C\")])\npositions = [p for p, _ in ring]\n\ndef owner(key_pos):\n    i = bisect.bisect_left(positions, key_pos)\n    return ring[i % len(ring)][1]\n\nfor key_pos in [10, 90, 150, 250, 350]:\n    print(f\"key at {key_pos:>3} -> {owner(key_pos)}\")",
        "output": "key at  10 -> server-A\nkey at  90 -> server-A\nkey at 150 -> server-B\nkey at 250 -> server-C\nkey at 350 -> server-A",
        "codeNotes": [
          {
            "line": 7,
            "note": "First server position at or after the key."
          },
          {
            "line": 8,
            "note": "Past the last server: wrap to the first."
          }
        ],
        "tryIt": "Add server-D at position 150 and see which keys change owner.",
        "check": {
          "question": "On a consistent hash ring, which server owns a key?",
          "options": [
            "The server with the lowest number",
            "The first server clockwise from the key",
            "A random server"
          ],
          "answer": 1,
          "why": "Moving clockwise from the key's position, the first server found owns it."
        }
      },
      {
        "title": "Building the ring with virtual nodes",
        "say": [
          "Practice 1: ConsistentHashRing with add_node(node, vnodes), remove_node(node) and get_node(key).",
          "Each node is placed vnodes times, hashing names like \"A#0\", \"A#1\", \"A#2\". Keep self.ring as a sorted list of (hash, node) pairs.",
          "remove_node filters out every point belonging to that node. get_node returns None for an empty ring, otherwise the owner found with bisect.",
          "The hash function is passed in (hash_fn), so tests can use predictable hashes and production can use a strong one.",
          "Keeping a separate sorted list of just the hashes makes bisect simple and fast.",
          "The example uses md5-based hashes and shows keys moving only from the removed node."
        ],
        "example": "A pizza chain placing each outlet at several points around a ring road, so every part of the city is close to some outlet.",
        "code": "import bisect\nimport hashlib\n\ndef md5_hash(s):\n    return int(hashlib.md5(s.encode()).hexdigest(), 16) % 1_000_000\n\nclass ConsistentHashRing:\n    def __init__(self, hash_fn=md5_hash):\n        self.hash_fn, self.ring = hash_fn, []\n\n    def add_node(self, node, vnodes=3):\n        for i in range(vnodes):\n            self.ring.append((self.hash_fn(f\"{node}#{i}\"), node))\n        self.ring.sort()\n\n    def remove_node(self, node):\n        self.ring = [(h, n) for h, n in self.ring if n != node]\n\n    def get_node(self, key):\n        if not self.ring:\n            return None\n        hashes = [h for h, _ in self.ring]\n        i = bisect.bisect_left(hashes, self.hash_fn(key))\n        return self.ring[i % len(self.ring)][1]\n\nring = ConsistentHashRing()\nfor node in [\"A\", \"B\", \"C\"]:\n    ring.add_node(node)\nkeys = [f\"key-{i}\" for i in range(12)]\nbefore = {k: ring.get_node(k) for k in keys}\nring.remove_node(\"B\")\nmoved = {k: (before[k], ring.get_node(k)) for k in keys if before[k] != ring.get_node(k)}\nprint(\"moved:\", moved)\nprint(\"all moved keys came from B:\", all(old == \"B\" for old, _ in moved.values()))",
        "output": "moved: {'key-1': ('B', 'C'), 'key-3': ('B', 'C'), 'key-8': ('B', 'C')}\nall moved keys came from B: True",
        "codeNotes": [
          {
            "line": 13,
            "note": "Each node appears vnodes times on the ring."
          },
          {
            "line": 23,
            "note": "First ring point at or after the key's hash."
          },
          {
            "line": 24,
            "note": "Wrap around past the end."
          }
        ],
        "tryIt": "Add a node \"D\" instead of removing B. Check that moved keys all go TO D.",
        "check": {
          "question": "When a node is removed from the ring, which keys move?",
          "options": [
            "All keys",
            "Only the keys that the removed node owned",
            "Keys owned by the next node"
          ],
          "answer": 1,
          "why": "Other nodes keep their keys; only the removed node's keys go to their clockwise neighbours."
        }
      },
      {
        "title": "Why virtual nodes balance load",
        "say": [
          "With only one point per node, the ring's arcs have very uneven sizes by chance. One server might own 50% of the keys and another 10%.",
          "Virtual nodes give each server many points spread around the ring. The arcs average out, and each server's share gets close to fair.",
          "They also spread the load when a node fails: its keys move to many different neighbours instead of all landing on one.",
          "Stronger machines can get more virtual nodes, which gives them a proportionally bigger share. This is weighted consistent hashing.",
          "Typical systems use 100 to 256 virtual nodes per server.",
          "More virtual nodes cost a little memory and a slightly bigger sorted list, which is a tiny price for even load.",
          "The experiment compares key shares with 1 and with 100 virtual nodes."
        ],
        "example": "Scattering many small bins around a park instead of one big bin per corner: every visitor has a bin nearby, and the rubbish is shared more evenly.",
        "code": "import bisect\nimport hashlib\nfrom collections import Counter\n\ndef hv(s):\n    return int(hashlib.md5(s.encode()).hexdigest(), 16)\n\ndef shares(nodes, vnodes, n_keys=20_000):\n    ring = sorted((hv(f\"{n}#{i}\"), n) for n in nodes for i in range(vnodes))\n    hashes = [h for h, _ in ring]\n    counts = Counter(ring[bisect.bisect_left(hashes, hv(f\"k{k}\")) % len(ring)][1] for k in range(n_keys))\n    return {n: f\"{counts[n] / n_keys:.0%}\" for n in nodes}\n\nnodes = [\"A\", \"B\", \"C\", \"D\"]\nprint(\"1 vnode:   \", shares(nodes, 1))\nprint(\"100 vnodes:\", shares(nodes, 100))",
        "output": "1 vnode:    {'A': '3%', 'B': '1%', 'C': '40%', 'D': '56%'}\n100 vnodes: {'A': '25%', 'B': '26%', 'C': '26%', 'D': '24%'}",
        "codeNotes": [
          {
            "line": 9,
            "note": "Every node placed vnodes times."
          },
          {
            "line": 11,
            "note": "Count how many keys each node owns."
          }
        ],
        "tryIt": "Give node \"A\" 200 virtual nodes and the others 100. What share does A get?",
        "check": {
          "question": "What problem do virtual nodes solve?",
          "options": [
            "Slow hashing",
            "Uneven key shares caused by a few randomly placed points",
            "Too many servers"
          ],
          "answer": 1,
          "why": "Many points per server average out the arc sizes, balancing the load."
        }
      },
      {
        "title": "How many keys move?",
        "say": [
          "When a node joins a ring of N nodes, it takes a fair share of the keys: about 1 / (N + 1). The rest stay where they are.",
          "Practice 2: migration_estimate(total_keys, nodes) returns that share as a percentage with 1 decimal and the number of keys moved: round(total_keys / (nodes + 1)).",
          "For 1,000,000 keys on 9 nodes, adding a tenth moves about 100,000 keys, or 10%, instead of the 90% that mod-N would move.",
          "This estimate helps plan capacity changes: how long data transfer will take and how much extra load the database will see from cache misses.",
          "The experiment confirms the estimate with real hashing.",
          "Add nodes during quiet hours and one at a time, so each change moves only a small share."
        ],
        "example": "When a new teacher joins a school with nine teachers, they take roughly a tenth of the students, and the other classes barely change.",
        "code": "import bisect\nimport hashlib\n\ndef migration_estimate(total_keys, nodes):\n    share = 1 / (nodes + 1)\n    return {\"fraction\": f\"{share * 100:.1f}%\", \"keys_moved\": round(total_keys / (nodes + 1))}\n\ndef hv(s):\n    return int(hashlib.md5(s.encode()).hexdigest(), 16)\n\ndef owner_map(nodes, keys, vnodes=100):\n    ring = sorted((hv(f\"{n}#{i}\"), n) for n in nodes for i in range(vnodes))\n    hashes = [h for h, _ in ring]\n    return {k: ring[bisect.bisect_left(hashes, hv(k)) % len(ring)][1] for k in keys}\n\nkeys = [f\"k{i}\" for i in range(20_000)]\nnodes = [f\"n{i}\" for i in range(9)]\nbefore, after = owner_map(nodes, keys), owner_map(nodes + [\"n9\"], keys)\nprint(\"estimate:\", migration_estimate(len(keys), 9))\nprint(f\"measured: {sum(before[k] != after[k] for k in keys) / len(keys):.1%}\")",
        "output": "estimate: {'fraction': '10.0%', 'keys_moved': 2000}\nmeasured: 10.4%",
        "codeNotes": [
          {
            "line": 5,
            "note": "A new node takes about 1 / (N + 1) of the keys."
          },
          {
            "line": 20,
            "note": "Compare with a real experiment."
          }
        ],
        "tryIt": "Compute migration_estimate(1_000_000, 4). How does it compare with mod-N going from 4 to 5?",
        "check": {
          "question": "Adding one node to a ring of 4 moves about what share of keys?",
          "options": [
            "80%",
            "20%",
            "4%"
          ],
          "answer": 1,
          "why": "1 / (4 + 1) = 20%."
        }
      },
      {
        "title": "Replicas on the ring",
        "say": [
          "For fault tolerance, each key is stored on several nodes. With consistent hashing, the replicas are the first R distinct nodes found clockwise from the key.",
          "Skip positions belonging to a node already chosen, since virtual nodes mean the same server can appear several times in a row.",
          "This list is called the preference list in Dynamo-style databases. Reads and writes go to it, often with the quorums from Day 2.",
          "Rack or region awareness goes further: choose replicas on different racks or data centres, so one power failure cannot take out every copy.",
          "Tomorrow's milestone builds a cache that could be spread over such a ring.",
          "Walking the ring clockwise and skipping duplicates is a small loop, shown below."
        ],
        "example": "Keeping copies of important documents with three different relatives who live in different towns, not three copies in the same cupboard.",
        "code": "import bisect\nimport hashlib\n\ndef hv(s):\n    return int(hashlib.md5(s.encode()).hexdigest(), 16)\n\nring = sorted((hv(f\"{n}#{i}\"), n) for n in [\"A\", \"B\", \"C\", \"D\"] for i in range(3))\nhashes = [h for h, _ in ring]\n\ndef preference_list(key, replicas=3):\n    i = bisect.bisect_left(hashes, hv(key))\n    chosen = []\n    for step in range(len(ring)):\n        node = ring[(i + step) % len(ring)][1]\n        if node not in chosen:\n            chosen.append(node)\n        if len(chosen) == replicas:\n            break\n    return chosen\n\nfor key in [\"cart:asha\", \"cart:bala\", \"order:42\"]:\n    print(key, \"->\", preference_list(key))",
        "output": "cart:asha -> ['B', 'D', 'C']\ncart:bala -> ['C', 'D', 'A']\norder:42 -> ['D', 'C', 'A']",
        "codeNotes": [
          {
            "line": 14,
            "note": "Walk clockwise around the ring."
          },
          {
            "line": 15,
            "note": "Skip nodes already chosen (virtual nodes repeat)."
          }
        ],
        "tryIt": "Ask for 5 replicas when there are only 4 nodes. What does the function return?",
        "check": {
          "question": "Why skip nodes already in the list when choosing replicas?",
          "options": [
            "To save time",
            "Virtual nodes mean one server appears many times, and replicas must be on different servers",
            "The ring is too small"
          ],
          "answer": 1,
          "why": "Two copies on the same server would not protect against that server failing."
        }
      }
    ],
    "summary": [
      "hash % N moves most keys when N changes.",
      "Consistent hashing: the first node clockwise owns a key; use bisect and wrap around.",
      "Virtual nodes balance shares and spread load after failures.",
      "A new node moves about 1 / (N + 1) of the keys.",
      "Replicas are the next R distinct nodes clockwise."
    ],
    "projectStep": {
      "title": "Hash ring",
      "steps": [
        "Add ConsistentHashRing and migration_estimate to dist_toolkit.py.",
        "Measure key movement when adding a node, and compare with the estimate.",
        "Bonus: add preference_list(key, replicas) that skips duplicate nodes."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense",
    "goal": "You can build a cache-aside cache with TTL expiry, stop thundering herds by fetching each key once, spread expiries with jitter, invalidate on writes, and evict with LRU.",
    "minutes": 30,
    "recap": "This week covered failures, replication trade-offs, RPC and consistent hashing. Milestone 1 builds the most common distributed component: a cache in front of a database.",
    "parts": [
      {
        "title": "The cache-aside pattern",
        "say": [
          "Databases are slow and expensive compared with memory. A cache keeps recently used data in memory (for example in Redis or Memcached) to answer most reads quickly.",
          "In cache-aside, the application manages the cache. On a read: look in the cache; on a miss, load from the database, store the value in the cache, and return it.",
          "On a write: update the database, then delete (or update) the cache entry, so the next read loads fresh data.",
          "Cache-aside is simple and resilient: if the cache fails, reads still work, just slower.",
          "The example counts database calls to show how the cache saves work.",
          "The hit rate, the share of reads served by the cache, is the number to watch."
        ],
        "example": "Keeping the spices you use every day on the kitchen counter, and fetching the rarely used ones from the storeroom only when needed, then leaving them on the counter for a while.",
        "code": "db_calls = 0\nDATABASE = {\"user:1\": \"Asha\", \"user:2\": \"Bala\"}\ncache = {}\n\ndef load_from_db(key):\n    global db_calls\n    db_calls += 1\n    return DATABASE.get(key)\n\ndef get(key):\n    if key in cache:\n        return cache[key]\n    value = load_from_db(key)\n    cache[key] = value\n    return value\n\nfor key in [\"user:1\", \"user:1\", \"user:2\", \"user:1\", \"user:2\"]:\n    get(key)\nprint(\"reads: 5, database calls:\", db_calls)",
        "output": "reads: 5, database calls: 2",
        "codeNotes": [
          {
            "line": 11,
            "note": "Hit: answer from memory."
          },
          {
            "line": 13,
            "note": "Miss: load from the database, then keep it in the cache."
          }
        ],
        "tryIt": "Read 100 random keys from a set of 10. What hit rate do you get?",
        "check": {
          "question": "In cache-aside, what happens on a cache miss?",
          "options": [
            "The read fails",
            "The app loads from the database, stores the value in the cache, and returns it",
            "The cache calls the database automatically"
          ],
          "answer": 1,
          "why": "The application fills the cache itself after reading from the database."
        }
      },
      {
        "title": "Expiry with TTL",
        "say": [
          "Cached data goes stale when the database changes. A time-to-live (TTL) limits how long an entry is trusted: after it expires, the next read reloads it.",
          "Store each value with its expiry time: now + ttl. On a read, check whether now is still before the expiry.",
          "Choosing the TTL is a trade-off: longer TTLs mean more hits but staler data; shorter TTLs mean fresher data but more database load.",
          "Pass the current time in as a parameter (now). Tests can then move time forward instantly, as in Practice 1.",
          "The example stores an entry for 60 seconds and reads it at different times.",
          "TTLs are a safety net even when you also invalidate on writes, catching any update you missed."
        ],
        "example": "Milk in the fridge with a use-by date: you use it happily until the date, and after that you buy fresh, even if it might still be fine.",
        "code": "class TtlCache:\n    def __init__(self):\n        self.data = {}\n\n    def get_or_fetch(self, key, fetch, now, ttl=60):\n        entry = self.data.get(key)\n        if entry and entry[1] > now:\n            return entry[0]\n        value = fetch(key)\n        self.data[key] = (value, now + ttl)\n        return value\n\ncalls = []\nfetch = lambda k: calls.append(k) or f\"value of {k}\"\ncache = TtlCache()\nfor t in [0, 30, 59, 60, 90]:\n    cache.get_or_fetch(\"price:sku-42\", fetch, now=t)\n    print(f\"t={t:>2}s database calls so far: {len(calls)}\")",
        "output": "t= 0s database calls so far: 1\nt=30s database calls so far: 1\nt=59s database calls so far: 1\nt=60s database calls so far: 2\nt=90s database calls so far: 2",
        "codeNotes": [
          {
            "line": 7,
            "note": "Still before its expiry time: a hit."
          },
          {
            "line": 10,
            "note": "Store the value with its expiry time."
          }
        ],
        "tryIt": "Change the TTL to 20. At which times does the database get called now?",
        "check": {
          "question": "An entry is stored at t = 0 with ttl = 60. Is it a hit at t = 60?",
          "options": [
            "Yes",
            "No, it expires at 60",
            "Only if the database is down"
          ],
          "answer": 1,
          "why": "It is valid only while its expiry (60) is greater than now; at 60 it has expired."
        }
      },
      {
        "title": "The thundering herd",
        "say": [
          "When a popular key expires, many requests arrive for it at the same moment. Each sees a miss and queries the database: a thundering herd, or cache stampede.",
          "For a hot key read thousands of times per second, that can knock over the database exactly when it is needed most.",
          "Practice 1: get_many(keys, fetch, now, ttl) serves a burst of requests, returning one value per key in order, but calling fetch at most once per distinct key.",
          "Because get_or_fetch stores the value after the first fetch, the other requests for that key in the same burst become hits.",
          "In real multi-threaded systems, you also need a lock or a \"single flight\" mechanism so concurrent misses wait for one fetch instead of all fetching.",
          "The example shows ten requests for two keys causing only two database calls."
        ],
        "example": "When a shop announces a sale, if every customer asked the warehouse separately for the same item, the warehouse would be swamped. One staff member fetches it once and puts it on the shelf for everyone.",
        "code": "class TtlCache:\n    def __init__(self):\n        self.data = {}\n\n    def get_or_fetch(self, key, fetch, now, ttl=60):\n        entry = self.data.get(key)\n        if entry and entry[1] > now:\n            return entry[0]\n        value = fetch(key)\n        self.data[key] = (value, now + ttl)\n        return value\n\n    def get_many(self, keys, fetch, now, ttl=60):\n        return [self.get_or_fetch(k, fetch, now, ttl) for k in keys]\n\ncalls = []\nfetch = lambda k: calls.append(k) or k.upper()\nburst = [\"hot\"] * 8 + [\"cold\", \"hot\"]\nprint(TtlCache().get_many(burst, fetch, now=0))\nprint(\"database calls:\", calls)",
        "output": "['HOT', 'HOT', 'HOT', 'HOT', 'HOT', 'HOT', 'HOT', 'HOT', 'COLD', 'HOT']\ndatabase calls: ['hot', 'cold']",
        "codeNotes": [
          {
            "line": 14,
            "note": "The first request fills the cache; the rest are hits."
          },
          {
            "line": 20,
            "note": "Only one fetch per distinct key."
          }
        ],
        "tryIt": "Call get_many again at now=61 with the same burst. How many new database calls happen?",
        "check": {
          "question": "What is a thundering herd?",
          "options": [
            "A slow network",
            "Many requests missing the cache at once and all hitting the database",
            "Too many cache servers"
          ],
          "answer": 1,
          "why": "A popular key expiring sends a wave of identical queries to the database."
        }
      },
      {
        "title": "Spreading expiries with jitter",
        "say": [
          "A related problem: if many keys are cached at the same moment with the same TTL (for example after a deploy or a cache restart), they all expire together.",
          "Practice 2: ttl_with_jitter(base, max_jitter, rng) returns base plus a random whole number from 0 to max_jitter - 1, using rng.randrange.",
          "Passing rng in lets tests use a seeded random.Random for repeatable results.",
          "With jitter, expiries are spread over a window, so the database sees a steady trickle of reloads instead of a spike.",
          "A small jitter of 5% to 10% of the TTL is usually enough.",
          "This is the same idea as jitter in retries on Day 1: randomness breaks up synchronised crowds."
        ],
        "example": "Staggering the end of classes in a big school by a few minutes each, so the corridors do not fill with every student at the same second.",
        "code": "import random\nfrom collections import Counter\n\ndef ttl_with_jitter(base, max_jitter=10, rng=random):\n    return base + rng.randrange(max_jitter)\n\nrng = random.Random(3)\nexpiries = [ttl_with_jitter(300, 30, rng) for _ in range(1000)]\nprint(\"without jitter: all 1000 keys expire at t=300\")\nbuckets = Counter(e // 10 * 10 for e in expiries)\nfor start in sorted(buckets):\n    print(f\"expire between {start} and {start + 9}: {buckets[start]} keys\")",
        "output": "without jitter: all 1000 keys expire at t=300\nexpire between 300 and 309: 314 keys\nexpire between 310 and 319: 344 keys\nexpire between 320 and 329: 342 keys",
        "codeNotes": [
          {
            "line": 5,
            "note": "Base TTL plus a random 0 to max_jitter - 1."
          },
          {
            "line": 7,
            "note": "A seeded generator gives the same result every run."
          }
        ],
        "tryIt": "Use a jitter of 60 instead of 30. How are the expiries spread now?",
        "check": {
          "question": "Why add jitter to TTLs?",
          "options": [
            "To make entries last longer",
            "So keys cached together do not all expire at the same moment",
            "To save memory"
          ],
          "answer": 1,
          "why": "Spreading expiries avoids a sudden wave of database reloads."
        }
      },
      {
        "title": "Invalidation on writes",
        "say": [
          "When data changes, the cache must stop serving the old value. The common approach: write to the database first, then delete the cache entry.",
          "Deleting is safer than updating the cache directly: if two writes race, an update could leave the older value in the cache, while a delete simply forces a fresh load.",
          "There is still a small window where a slow reader can put an old value back after the delete. Short TTLs limit the damage, and some systems delete twice (before and after the write) or use versions.",
          "Write-through caching (update the cache as part of every write) and write-behind (write to the cache, save to the database later) are other options with different trade-offs.",
          "Phil Karlton's famous joke says cache invalidation is one of the two hard things in computer science. Keep it simple and measured.",
          "The example shows the stale-read problem without invalidation, and the fix with a delete."
        ],
        "example": "After changing the price of an item, a shopkeeper removes the old price tag rather than trying to write over it, so the next person to check looks up the new price.",
        "code": "database = {\"price:sku-42\": 499}\ncache = {}\n\ndef read(key):\n    if key not in cache:\n        cache[key] = database[key]\n    return cache[key]\n\ndef write(key, value, invalidate=True):\n    database[key] = value\n    if invalidate:\n        cache.pop(key, None)\n\nprint(\"read:\", read(\"price:sku-42\"))\nwrite(\"price:sku-42\", 449, invalidate=False)\nprint(\"after write without invalidation:\", read(\"price:sku-42\"), \"(stale!)\")\nwrite(\"price:sku-42\", 399)\nprint(\"after write with invalidation:\", read(\"price:sku-42\"))",
        "output": "read: 499\nafter write without invalidation: 499 (stale!)\nafter write with invalidation: 399",
        "codeNotes": [
          {
            "line": 10,
            "note": "Database first..."
          },
          {
            "line": 12,
            "note": "...then delete the cache entry."
          },
          {
            "line": 16,
            "note": "Without invalidation, readers see the old price."
          }
        ],
        "tryIt": "Add a TTL to this cache so that even the stale value would be replaced within 60 seconds.",
        "check": {
          "question": "Why delete the cache entry on a write rather than updating it?",
          "options": [
            "Deleting is faster",
            "Racing updates can leave an old value cached; a delete forces a fresh load",
            "Caches cannot be updated"
          ],
          "answer": 1,
          "why": "Deletion avoids ordering bugs between concurrent writers."
        }
      },
      {
        "title": "Milestone 1: a bounded, distributed cache",
        "say": [
          "Memory is limited, so a cache needs an eviction policy. Least recently used (LRU) removes the entry that has gone longest without being read.",
          "Python's OrderedDict makes LRU easy: move a key to the end on every access, and pop from the front when the cache is full.",
          "To spread a cache over several servers, use the consistent hash ring from Day 4 to choose the server for each key. Adding a server then moves only a small share of keys.",
          "Measure hits, misses and evictions per server; a server with many evictions needs more memory or fewer keys.",
          "Together, cache-aside, TTL with jitter, herd protection, invalidation and LRU make a production-quality cache.",
          "Next week: coordinating many machines with locks, leader election, unique IDs and consensus."
        ],
        "example": "A small bookshelf by your desk: when it is full and you add a new book, you return the one you have not opened for the longest time to the library.",
        "code": "from collections import OrderedDict\n\nclass LruCache:\n    def __init__(self, capacity):\n        self.capacity, self.data = capacity, OrderedDict()\n        self.hits = self.misses = self.evictions = 0\n\n    def get(self, key, fetch):\n        if key in self.data:\n            self.hits += 1\n            self.data.move_to_end(key)\n            return self.data[key]\n        self.misses += 1\n        value = self.data[key] = fetch(key)\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)\n            self.evictions += 1\n        return value\n\ncache = LruCache(capacity=3)\nfor key in [\"a\", \"b\", \"c\", \"a\", \"d\", \"b\", \"a\", \"e\"]:\n    cache.get(key, str.upper)\nprint(\"kept:\", list(cache.data))\nprint(\"hits\", cache.hits, \"misses\", cache.misses, \"evictions\", cache.evictions)",
        "output": "kept: ['b', 'a', 'e']\nhits 2 misses 6 evictions 3",
        "codeNotes": [
          {
            "line": 11,
            "note": "A read makes the key the most recently used."
          },
          {
            "line": 16,
            "note": "Full: remove the least recently used entry."
          }
        ],
        "tryIt": "Change the capacity to 2 and run it. How do hits and evictions change?",
        "check": {
          "question": "Which entry does an LRU cache evict?",
          "options": [
            "The newest entry",
            "The entry unused for the longest time",
            "A random entry"
          ],
          "answer": 1,
          "why": "Least recently used means the one that has waited longest since its last access."
        }
      }
    ],
    "summary": [
      "Cache-aside: read the cache, on a miss load from the database and fill the cache.",
      "TTLs limit staleness; pass \"now\" in to make expiry testable.",
      "Fetch each key once per burst to stop thundering herds.",
      "Add jitter so keys cached together do not expire together.",
      "Write to the database then delete the cache entry; evict with LRU."
    ],
    "projectStep": {
      "title": "Milestone 1: distributed cache",
      "steps": [
        "Add TtlCache (with get_many) and ttl_with_jitter to dist_toolkit.py.",
        "Show that a burst of 100 reads for 3 keys makes only 3 database calls.",
        "Bonus: add an LRU limit and place 3 cache servers on your hash ring."
      ]
    }
  }
];
