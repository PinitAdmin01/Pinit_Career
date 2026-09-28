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
  },
  {
    "day": 6,
    "title": "Distributed Locks: Redis Redlock & Fencing Tokens",
    "goal": "You can explain why distributed locks are needed, use leases that expire, issue and check fencing tokens, account for clock drift, and judge when Redlock or a consensus store is appropriate.",
    "minutes": 30,
    "recap": "Milestone 1 built a cache. Caches tolerate small mistakes; some operations do not. Today you make sure only one machine does a critical job at a time.",
    "parts": [
      {
        "title": "Why locks across machines",
        "say": [
          "On one computer, a lock (mutex) stops two threads from changing the same data at once. With many servers, threads on different machines cannot share that lock.",
          "Without coordination, two workers can pick up the same job: two emails sent, two refunds paid, one seat sold twice.",
          "A distributed lock is a record in a shared service (Redis, etcd, ZooKeeper or a database) that says \"worker X holds resource R\".",
          "Taking the lock must be a single atomic operation in that service, such as Redis SET with the NX option, so two workers cannot both see it as free.",
          "Only the holder may do the protected work. Others wait, skip or retry later.",
          "The simulation shows two workers both checking and then both paying a refund, a classic race condition.",
          "Everything in this lesson is about making that \"only one\" guarantee survive crashes, pauses and clock problems."
        ],
        "example": "A single key to the store room hanging at reception: whoever takes the key is the only one allowed in, and everyone else can see it is taken.",
        "code": "refund_paid = {\"order-7\": False}\npayments = []\n\ndef worker(name):\n    already = refund_paid[\"order-7\"]\n    return name, already\n\nchecks = [worker(\"worker-1\"), worker(\"worker-2\")]\nfor name, already in checks:\n    if not already:\n        payments.append(name)\n        refund_paid[\"order-7\"] = True\nprint(\"refunds paid by:\", payments, \"<- paid twice!\")",
        "output": "refunds paid by: ['worker-1', 'worker-2'] <- paid twice!",
        "codeNotes": [
          {
            "line": 8,
            "note": "Both workers check before either one writes."
          },
          {
            "line": 13,
            "note": "Without a lock, the refund goes out twice."
          }
        ],
        "tryIt": "How would a single shared lock around the check and the payment prevent the double refund?",
        "check": {
          "question": "What problem does a distributed lock solve?",
          "options": [
            "Slow networks",
            "Two machines doing the same critical work at the same time",
            "Running out of memory"
          ],
          "answer": 1,
          "why": "A lock ensures only one machine performs the protected operation."
        }
      },
      {
        "title": "Leases: locks that expire",
        "say": [
          "If a worker takes a lock and then crashes, a normal lock would stay held forever. Distributed locks are therefore leases: they expire after a time-to-live.",
          "The holder must finish (or renew the lease) before it expires. If it crashes, the lease runs out and another worker can take over.",
          "Choosing the TTL is a trade-off: too short, and a slow but healthy worker loses its lock mid-job; too long, and a crash blocks everyone for a long time.",
          "Long jobs renew their lease periodically, like a heartbeat.",
          "If renewal fails, the worker must stop the protected work at once, because another worker may take over at any moment.",
          "The code uses a fake clock in milliseconds, passed in as now, so the behaviour is repeatable.",
          "Expiry fixes crashes, but introduces a new danger: a worker that is paused, not crashed, may wake up after its lease has expired."
        ],
        "example": "Booking a meeting room for one hour: if you do not show up or extend the booking, the room frees up automatically for others.",
        "code": "leases = {}\n\ndef acquire(resource, owner, now, ttl_ms=1000):\n    held = leases.get(resource)\n    if held and held[\"expires_at\"] > now:\n        return False\n    leases[resource] = {\"owner\": owner, \"expires_at\": now + ttl_ms}\n    return True\n\nprint(\"t=0    worker-1:\", acquire(\"job-42\", \"worker-1\", now=0))\nprint(\"t=500  worker-2:\", acquire(\"job-42\", \"worker-2\", now=500))\nprint(\"t=1200 worker-2:\", acquire(\"job-42\", \"worker-2\", now=1200), \"(worker-1 crashed, lease expired)\")",
        "output": "t=0    worker-1: True\nt=500  worker-2: False\nt=1200 worker-2: True (worker-1 crashed, lease expired)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Someone holds an unexpired lease: refuse."
          },
          {
            "line": 7,
            "note": "Take the lease until now + ttl."
          }
        ],
        "tryIt": "Change the TTL to 2000. At t=1200, can worker-2 take the lock?",
        "check": {
          "question": "Why do distributed locks expire?",
          "options": [
            "To save memory",
            "So a crashed holder does not block everyone forever",
            "To make them faster"
          ],
          "answer": 1,
          "why": "A lease that expires lets others take over after the holder dies."
        }
      },
      {
        "title": "Fencing tokens",
        "say": [
          "Imagine worker-1 takes the lock, then freezes for 10 seconds (a long garbage-collection pause or a slow disk). Its lease expires, worker-2 takes the lock and writes. Then worker-1 wakes up and writes too, believing it still holds the lock.",
          "The fix is a fencing token: a number that increases every time the lock is granted. Each holder sends its token with every write.",
          "The storage remembers the highest token it has seen and rejects writes with a lower one. Worker-1's old token is refused, however late it arrives.",
          "Practice 1: LockManager.acquire returns success, a lock_id like \"lock_3\" and the fencing token; release frees the lock only if the lock_id matches.",
          "Checking the lock_id on release stops a worker from releasing someone else's lock after its own has expired.",
          "Fencing moves the final safety check to the resource itself, which is the only place that can enforce it reliably."
        ],
        "example": "Ticket numbers at a bank counter: if someone with an old ticket number 12 comes back after number 15 has been served, the teller refuses them, because the counter has moved on.",
        "code": "class LockManager:\n    def __init__(self):\n        self.locks, self.counter = {}, 0\n\n    def acquire(self, resource, now, ttl_ms=1000):\n        held = self.locks.get(resource)\n        if held and held[\"expires_at\"] > now:\n            return {\"success\": False}\n        self.counter += 1\n        lock_id = f\"lock_{self.counter}\"\n        self.locks[resource] = {\"lock_id\": lock_id, \"expires_at\": now + ttl_ms}\n        return {\"success\": True, \"lock_id\": lock_id, \"fencing_token\": self.counter}\n\n    def release(self, resource, lock_id):\n        held = self.locks.get(resource)\n        if held and held[\"lock_id\"] == lock_id:\n            del self.locks[resource]\n            return True\n        return False\n\nclass Storage:\n    def __init__(self):\n        self.highest = 0\n    def write(self, token, value):\n        if token < self.highest:\n            return f\"REJECTED {value!r} (token {token} < {self.highest})\"\n        self.highest = token\n        return f\"stored {value!r} with token {token}\"\n\nlocks, db = LockManager(), Storage()\nw1 = locks.acquire(\"invoice-9\", now=0)\nw2 = locks.acquire(\"invoice-9\", now=1500)\nprint(db.write(w2[\"fencing_token\"], \"from worker-2\"))\nprint(db.write(w1[\"fencing_token\"], \"from worker-1 after its pause\"))\nprint(\"worker-1 release:\", locks.release(\"invoice-9\", w1[\"lock_id\"]))",
        "output": "stored 'from worker-2' with token 2\nREJECTED 'from worker-1 after its pause' (token 1 < 2)\nworker-1 release: False",
        "codeNotes": [
          {
            "line": 9,
            "note": "Every grant gets a bigger token."
          },
          {
            "line": 16,
            "note": "Only the current holder can release."
          },
          {
            "line": 25,
            "note": "Storage refuses tokens older than the newest seen."
          }
        ],
        "tryIt": "Swap the order of the two writes. Are both accepted now? Why is that still safe?",
        "check": {
          "question": "How does a fencing token stop a paused worker from corrupting data?",
          "options": [
            "It makes the worker faster",
            "Storage rejects writes carrying a token older than the newest it has seen",
            "It deletes the paused worker"
          ],
          "answer": 1,
          "why": "The resource itself refuses stale holders, whatever they believe about their lock."
        }
      },
      {
        "title": "Clock drift and safety margins",
        "say": [
          "Leases depend on time, and clocks on different machines disagree. A server's clock can run fast or slow by milliseconds or more, and NTP corrections can make it jump.",
          "If the holder's clock runs slow, it may think its lease is still valid after the lock service has already expired it.",
          "The defence is a safety margin: treat the lease as valid only while now - acquired_at + drift_ms is less than ttl_ms.",
          "Practice 2: is_lock_valid(acquired_at, ttl_ms, now, drift_ms) returns exactly that check.",
          "In other words, a holder should stop working a little before the lease really ends, leaving room for clock differences.",
          "Day 16 looks at clocks in much more depth, including why \"now\" is so hard in distributed systems."
        ],
        "example": "Leaving a parking spot five minutes before your ticket expires, in case your watch is a little behind the warden's.",
        "code": "def is_lock_valid(acquired_at, ttl_ms, now, drift_ms=50):\n    return now - acquired_at + drift_ms < ttl_ms\n\nfor now in [0, 900, 949, 950, 1000]:\n    print(f\"t={now:>4}: still safe to work? {is_lock_valid(0, 1000, now)}\")",
        "output": "t=   0: still safe to work? True\nt= 900: still safe to work? True\nt= 949: still safe to work? True\nt= 950: still safe to work? False\nt=1000: still safe to work? False",
        "codeNotes": [
          {
            "line": 2,
            "note": "Stop drift_ms before the lease really ends."
          }
        ],
        "tryIt": "Use drift_ms=200. From what time should the worker stop?",
        "check": {
          "question": "Why subtract a drift margin when checking a lease?",
          "options": [
            "To make locks last longer",
            "Clocks disagree, so the holder must stop before the lease could have expired elsewhere",
            "Drift makes locks faster"
          ],
          "answer": 1,
          "why": "The margin covers the difference between the holder's clock and the lock service's clock."
        }
      },
      {
        "title": "Redlock and majority locks",
        "say": [
          "A lock stored on one Redis server fails if that server fails. Redlock spreads the lock across N independent Redis servers (usually 5).",
          "A client tries to set the lock on all of them. It holds the lock only if it succeeded on a majority, and did so quickly enough that the lease is still mostly valid.",
          "If it fails to reach a majority, it releases whatever it did acquire, so others are not blocked.",
          "Redlock is debated: under long pauses and clock jumps it can still grant the lock twice, which is why fencing tokens matter.",
          "For locks that protect correctness (money, inventory), many teams prefer a consensus store like etcd or ZooKeeper, which use Raft or Zab (Day 9).",
          "The simulation grants the lock only with a majority of five nodes."
        ],
        "example": "Getting permission to use the society hall by collecting signatures from a majority of the committee, instead of relying on one member who might be away.",
        "code": "def redlock(node_ok, elapsed_ms, ttl_ms=1000):\n    acquired = sum(node_ok)\n    majority = len(node_ok) // 2 + 1\n    validity = ttl_ms - elapsed_ms\n    if acquired >= majority and validity > 0:\n        return f\"LOCKED on {acquired}/{len(node_ok)}, valid for {validity} ms\"\n    return f\"FAILED ({acquired}/{len(node_ok)}), releasing any partial locks\"\n\nprint(redlock([True, True, True, False, False], elapsed_ms=40))\nprint(redlock([True, True, False, False, False], elapsed_ms=40))\nprint(redlock([True, True, True, True, True], elapsed_ms=1200))",
        "output": "LOCKED on 3/5, valid for 960 ms\nFAILED (2/5), releasing any partial locks\nFAILED (5/5), releasing any partial locks",
        "codeNotes": [
          {
            "line": 5,
            "note": "A majority, and time left on the lease."
          },
          {
            "line": 7,
            "note": "Otherwise undo and report failure."
          }
        ],
        "tryIt": "What should happen if acquiring took 990 ms of a 1000 ms TTL? Is a 10 ms lease useful?",
        "check": {
          "question": "When does a Redlock client hold the lock?",
          "options": [
            "When one node agrees",
            "When a majority of nodes agree and the lease is still valid",
            "When all nodes agree"
          ],
          "answer": 1,
          "why": "A majority prevents two clients from holding it, and the validity check accounts for time spent acquiring."
        }
      },
      {
        "title": "Avoiding locks when you can",
        "say": [
          "Locks are slow and tricky. Often a design without them is simpler and safer.",
          "Idempotency (Day 13): make repeated operations harmless, so it does not matter if two workers do the same job.",
          "Single writer: route all work for one key to one worker (for example with the partitions of Day 12), so there is no competition.",
          "Conditional writes: databases can update only if a version number is unchanged (\"compare and set\"), which detects conflicts without a separate lock service.",
          "When you truly need a lock, use a consensus-backed store, short leases, fencing tokens and a drift margin.",
          "Tomorrow you will see a special kind of lock: electing one leader for a whole cluster."
        ],
        "example": "Instead of a queue and a lock on one shared microwave, giving each team its own microwave: no waiting, no conflicts.",
        "code": "record = {\"stock\": 5, \"version\": 1}\n\ndef compare_and_set(expected_version, new_stock):\n    if record[\"version\"] != expected_version:\n        return \"CONFLICT: re-read and try again\"\n    record.update(stock=new_stock, version=expected_version + 1)\n    return f\"OK: stock={new_stock}, version={record['version']}\"\n\nseen_by_a = seen_by_b = record[\"version\"]\nprint(\"worker A:\", compare_and_set(seen_by_a, 4))\nprint(\"worker B:\", compare_and_set(seen_by_b, 4))",
        "output": "worker A: OK: stock=4, version=2\nworker B: CONFLICT: re-read and try again",
        "codeNotes": [
          {
            "line": 4,
            "note": "Update only if nobody changed the record since we read it."
          },
          {
            "line": 11,
            "note": "B read an old version, so its write is refused."
          }
        ],
        "tryIt": "Make worker B re-read the record and retry. What is the final stock?",
        "check": {
          "question": "How does compare-and-set avoid a separate lock?",
          "options": [
            "It locks the whole database",
            "The write only succeeds if the version is unchanged since it was read",
            "It ignores conflicts"
          ],
          "answer": 1,
          "why": "Conflicting writers are detected by the version check and must retry."
        }
      }
    ],
    "summary": [
      "Distributed locks stop two machines doing the same critical work.",
      "Locks are leases with a TTL, so crashed holders do not block forever.",
      "Fencing tokens let storage reject writes from stale holders.",
      "Allow for clock drift: stop work before the lease could have expired.",
      "Prefer idempotency, single writers or compare-and-set when possible."
    ],
    "projectStep": {
      "title": "Locks",
      "steps": [
        "Add LockManager and is_lock_valid to dist_toolkit.py.",
        "Recreate the paused-worker scenario and show fencing rejecting the old write.",
        "Bonus: implement compare_and_set for a stock counter with two workers."
      ]
    }
  },
  {
    "day": 7,
    "title": "Leader Election: Bully Algorithm & Raft Heartbeats",
    "goal": "You can explain why clusters elect a leader, detect failures with heartbeats, run the Bully algorithm, check vote majorities, and describe how Raft elections use terms and randomised timeouts.",
    "minutes": 30,
    "recap": "Yesterday one worker at a time held a lock on a resource. Today a whole cluster agrees on one leader to coordinate it, and replaces the leader when it fails.",
    "parts": [
      {
        "title": "Why have a leader?",
        "say": [
          "Many systems are simpler with one coordinator: one node decides the order of writes, assigns work or holds the master copy of data.",
          "With one decision maker there are no conflicts to resolve, because nobody else is making decisions at the same time.",
          "Databases with a primary, Kafka partition leaders, and Raft clusters all work this way.",
          "The risk is obvious: if the leader fails, coordination stops. So the cluster must notice the failure and elect a new leader automatically.",
          "The election must produce exactly one leader. Two leaders at once (split brain) can make conflicting decisions and corrupt data.",
          "This lesson covers detecting failures, a simple election (Bully), and the safer elections used by Raft.",
          "The example routes writes through a leader so they get a single order."
        ],
        "example": "A cricket team has one captain who decides the field placements. If the captain is injured, the team quickly agrees on a vice-captain, and never has two captains giving different orders.",
        "code": "nodes = [\"n1\", \"n2\", \"n3\"]\nleader = \"n3\"\nlog = []\n\ndef write(from_node, cmd):\n    log.append((len(log) + 1, cmd, f\"via {from_node} -> ordered by {leader}\"))\n\nwrite(\"n1\", \"set x=1\")\nwrite(\"n2\", \"set x=2\")\nfor entry in log:\n    print(entry)",
        "output": "(1, 'set x=1', 'via n1 -> ordered by n3')\n(2, 'set x=2', 'via n2 -> ordered by n3')",
        "codeNotes": [
          {
            "line": 6,
            "note": "The leader gives every write a single position in the order."
          }
        ],
        "tryIt": "What would happen to the order of writes if n1 and n2 each thought they were the leader?",
        "check": {
          "question": "What is split brain?",
          "options": [
            "A slow leader",
            "Two nodes acting as leader at the same time",
            "A leader with two CPUs"
          ],
          "answer": 1,
          "why": "Two leaders can make conflicting decisions, so elections must prevent it."
        }
      },
      {
        "title": "Detecting failure with heartbeats",
        "say": [
          "The leader sends a small heartbeat message to followers at a regular interval, for example every 100 ms.",
          "If a follower hears nothing for longer than an election timeout, for example 500 ms, it suspects the leader has failed.",
          "Remember Day 1: a missing heartbeat could mean a crash, a slow network or a partition. The follower cannot be sure, only suspicious.",
          "The timeout balances speed and false alarms. Too short, and brief network hiccups trigger unnecessary elections; too long, and real failures take a long time to fix.",
          "Heartbeats also carry useful information, such as the leader's term and how far its log has progressed, so followers stay up to date.",
          "The example checks a follower's view at several times, using a fake clock.",
          "Day 22 covers gossip-based failure detection, which scales to thousands of nodes."
        ],
        "example": "A night watchman who calls the control room every ten minutes: if there is no call for half an hour, the control room sends someone to check.",
        "code": "ELECTION_TIMEOUT_MS = 500\nheartbeats_at = [0, 100, 200, 300]\n\ndef leader_suspected(now):\n    last = max(t for t in heartbeats_at if t <= now)\n    return now - last > ELECTION_TIMEOUT_MS\n\nfor now in [350, 700, 801, 1000]:\n    print(f\"t={now:>4}: suspect leader? {leader_suspected(now)}\")",
        "output": "t= 350: suspect leader? False\nt= 700: suspect leader? False\nt= 801: suspect leader? True\nt=1000: suspect leader? True",
        "codeNotes": [
          {
            "line": 5,
            "note": "The most recent heartbeat before now."
          },
          {
            "line": 6,
            "note": "Too long since the last heartbeat: suspect a failure."
          }
        ],
        "tryIt": "Add a heartbeat at 750. How do the answers change?",
        "check": {
          "question": "Why can a follower only suspect, not know, that the leader failed?",
          "options": [
            "Followers are not allowed to know",
            "A missing heartbeat could also be a slow network or a partition",
            "Heartbeats are encrypted"
          ],
          "answer": 1,
          "why": "Silence has many possible causes in a distributed system."
        }
      },
      {
        "title": "The Bully algorithm",
        "say": [
          "The Bully algorithm is the simplest election: every node has a unique id, and the highest id among the live nodes becomes leader.",
          "When a node notices the leader is gone, it asks all higher-id nodes if they are alive. If none answer, it declares itself leader with a COORDINATOR message. If one answers, that node takes over the election.",
          "Practice 1: bully_election(node_ids, failed_leader) returns the highest remaining id with the message \"COORDINATOR: Node N\", or NO_ACTIVE_NODES when none remain.",
          "Bully is easy to understand, but it can cause many messages, and a partition can make both sides elect their own leader.",
          "It also always prefers the highest id, even if that machine is overloaded or far away, which is not always the best choice.",
          "It is useful in small, trusted clusters, and as a first step to understanding safer algorithms.",
          "The code handles an empty cluster explicitly rather than crashing on max() of an empty list."
        ],
        "example": "In a group without a leader, the eldest person present takes charge. If the eldest leaves, the next eldest steps up.",
        "code": "def bully_election(node_ids, failed_leader):\n    remaining = [n for n in node_ids if n != failed_leader]\n    if not remaining:\n        return {\"leader\": None, \"message\": \"\", \"status\": \"NO_ACTIVE_NODES\"}\n    leader = max(remaining)\n    return {\"leader\": leader, \"message\": f\"COORDINATOR: Node {leader}\", \"status\": \"ELECTED\"}\n\nprint(bully_election([1, 3, 5, 7], failed_leader=7))\nprint(bully_election([2, 9, 4], failed_leader=4))\nprint(bully_election([7], failed_leader=7))",
        "output": "{'leader': 5, 'message': 'COORDINATOR: Node 5', 'status': 'ELECTED'}\n{'leader': 9, 'message': 'COORDINATOR: Node 9', 'status': 'ELECTED'}\n{'leader': None, 'message': '', 'status': 'NO_ACTIVE_NODES'}",
        "codeNotes": [
          {
            "line": 3,
            "note": "No node left: say so clearly."
          },
          {
            "line": 5,
            "note": "The highest remaining id wins."
          }
        ],
        "tryIt": "What happens if the failed leader is not the highest id, as in the second example?",
        "check": {
          "question": "In the Bully algorithm, which node becomes leader?",
          "options": [
            "The first node to notice the failure",
            "The live node with the highest id",
            "A random node"
          ],
          "answer": 1,
          "why": "The highest id among the remaining nodes always wins."
        }
      },
      {
        "title": "Majorities and terms",
        "say": [
          "Safer elections require votes from a majority, as with quorums on Day 2. Two candidates cannot both get a majority of the same cluster.",
          "Practice 2: has_majority(votes, total) returns True when votes >= total // 2 + 1.",
          "Raft also numbers elections with terms: 1, 2, 3... Each node votes at most once per term, and a leader of term 5 is ignored by nodes that have seen term 6.",
          "Terms act like the fencing tokens of Day 6: an old leader returning after a partition sees a higher term and steps down.",
          "Every message carries the sender's term, so stale leaders are detected quickly.",
          "The code counts votes for a candidate in a 5-node cluster."
        ],
        "example": "Elections for a class monitor: each student votes once per election, a winner needs more than half the class, and a monitor from last year has no authority in this year's term.",
        "code": "def has_majority(votes, total):\n    return votes >= total // 2 + 1\n\nvotes_by_node = {\"n1\": \"n3\", \"n2\": \"n3\", \"n3\": \"n3\", \"n4\": \"n5\", \"n5\": \"n5\"}\ntally = {}\nfor voter, choice in votes_by_node.items():\n    tally[choice] = tally.get(choice, 0) + 1\nfor candidate, count in tally.items():\n    print(candidate, count, \"votes, leader?\", has_majority(count, len(votes_by_node)))",
        "output": "n3 3 votes, leader? True\nn5 2 votes, leader? False",
        "codeNotes": [
          {
            "line": 2,
            "note": "More than half of the cluster."
          },
          {
            "line": 4,
            "note": "Each node votes once in this term."
          }
        ],
        "tryIt": "Change n1's vote to n5. Does anyone win now?",
        "check": {
          "question": "How many votes does a candidate need in a 7-node cluster?",
          "options": [
            "3",
            "4",
            "7"
          ],
          "answer": 1,
          "why": "7 // 2 + 1 = 4."
        }
      },
      {
        "title": "Raft elections with randomised timeouts",
        "say": [
          "In Raft, a follower whose election timeout expires becomes a candidate: it increases its term, votes for itself, and asks the others for votes.",
          "A node grants its vote if it has not voted in this term and the candidate's log is at least as up to date as its own (so leaders never lose committed data).",
          "If several followers time out together, votes split and nobody wins. Raft avoids this by giving each node a random timeout, for example between 150 and 300 ms.",
          "The node with the shortest timeout usually starts first, wins before others wake up, and sends heartbeats that stop other elections.",
          "Round 1 in the output shows a tie: n1 and n4 picked the same timeout. When that happens and votes split, both simply wait a new random timeout and try again.",
          "The simulation draws seeded random timeouts and shows who starts the election.",
          "Randomness here is a tool for breaking ties, as jitter was for retries."
        ],
        "example": "Several people waiting to speak in a meeting after a silence: if everyone waited exactly five seconds, they would all speak at once; waiting a random few seconds lets one person start.",
        "code": "import random\n\nrng = random.Random(11)\nfor round_no in range(1, 4):\n    timeouts = {f\"n{i}\": rng.randint(150, 300) for i in range(1, 6)}\n    first = min(timeouts, key=timeouts.get)\n    gap = sorted(timeouts.values())[1] - timeouts[first]\n    print(f\"round {round_no}: {timeouts} -> {first} starts first, {gap} ms before the next\")",
        "output": "round 1: {'n1': 265, 'n2': 293, 'n3': 269, 'n4': 265, 'n5': 280} -> n1 starts first, 0 ms before the next\nround 2: {'n1': 300, 'n2': 198, 'n3': 197, 'n4': 281, 'n5': 271} -> n3 starts first, 1 ms before the next\nround 3: {'n1': 197, 'n2': 174, 'n3': 264, 'n4': 227, 'n5': 186} -> n2 starts first, 12 ms before the next",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each node picks a random election timeout."
          },
          {
            "line": 7,
            "note": "A gap gives the first candidate time to win."
          }
        ],
        "tryIt": "Change the range to 150 to 151. How often do two nodes time out together now?",
        "check": {
          "question": "Why does Raft use randomised election timeouts?",
          "options": [
            "To save power",
            "To make split votes unlikely, so one candidate usually wins quickly",
            "To confuse attackers"
          ],
          "answer": 1,
          "why": "Different timeouts mean one node usually starts and wins before others begin."
        }
      },
      {
        "title": "Safety: at most one leader per term",
        "say": [
          "Raft guarantees at most one leader per term: each node votes once per term, and a leader needs a majority, so two majorities would have to share a node that voted twice.",
          "During a partition, the side with a majority can elect a leader; the minority side cannot, so it stops accepting writes (the CP choice from Day 2).",
          "When the partition heals, the old leader sees the higher term and steps down.",
          "A leader that is cut off may still believe it leads for a short time. Raft handles this by only committing entries a majority has confirmed, which it cannot get.",
          "Tomorrow you will generate unique IDs without any leader at all, and on Day 9 you will see how Raft's leader replicates its log.",
          "The simulation shows a 5-node partition split 3 and 2."
        ],
        "example": "A company with offices in two cities during a phone outage: only the city with most of the board members can make binding decisions; the other waits.",
        "code": "def elect(side, total):\n    return side[0] if len(side) > total // 2 else None\n\ncluster = [\"n1\", \"n2\", \"n3\", \"n4\", \"n5\"]\nside_a, side_b = [\"n3\", \"n4\", \"n5\"], [\"n1\", \"n2\"]\nprint(\"side A leader:\", elect(side_a, len(cluster)))\nprint(\"side B leader:\", elect(side_b, len(cluster)), \"(minority cannot elect)\")",
        "output": "side A leader: n3\nside B leader: None (minority cannot elect)",
        "codeNotes": [
          {
            "line": 2,
            "note": "Only a side with a majority can choose a leader."
          }
        ],
        "tryIt": "Split the cluster 2, 2 and 1. Can any side elect a leader? What does that mean for availability?",
        "check": {
          "question": "During a partition, which side of a Raft cluster can elect a leader?",
          "options": [
            "Both sides",
            "Only the side with a majority of nodes",
            "The side with the old leader"
          ],
          "answer": 1,
          "why": "A leader needs majority votes, which only one side can have."
        }
      }
    ],
    "summary": [
      "A leader simplifies coordination; failures trigger elections.",
      "Heartbeats and timeouts let followers suspect a failed leader.",
      "Bully elects the highest live id; simple but not partition-safe.",
      "Majorities and terms guarantee at most one leader per term.",
      "Randomised timeouts make split votes rare in Raft."
    ],
    "projectStep": {
      "title": "Elections",
      "steps": [
        "Add bully_election and has_majority to dist_toolkit.py.",
        "Simulate heartbeats and print when a follower would start an election.",
        "Bonus: simulate 5 rounds of randomised timeouts and count split starts."
      ]
    }
  },
  {
    "day": 8,
    "title": "Distributed Unique ID Generation: Twitter Snowflake & ULID",
    "goal": "You can explain why auto-increment IDs do not scale, build a Snowflake ID generator with timestamp, machine and sequence bits, decode IDs, and create time-sortable base-36 prefixes.",
    "minutes": 30,
    "recap": "Yesterday a cluster agreed on a leader. Today many machines create unique IDs at high speed without talking to each other at all.",
    "parts": [
      {
        "title": "Why not a simple counter?",
        "say": [
          "A single database with an auto-increment column gives neat IDs: 1, 2, 3. But every insert across the whole system must go through that one database, which becomes a bottleneck and a single point of failure.",
          "Random UUIDs (version 4) are 128-bit random values, like 3f2a9c1e-..., generated anywhere with no coordination. Collisions are practically impossible.",
          "But random UUIDs are long, and they are not ordered by time, which makes database indexes slower and sorting by creation time impossible.",
          "New rows with random IDs land all over a database index, instead of at the end, which causes more disk work and slower inserts at scale.",
          "The ideal ID is unique without coordination, roughly sorted by time, and fits in 64 bits. Twitter's Snowflake design does exactly that.",
          "The example compares the options on these properties.",
          "IDs look like a small detail, but at millions of inserts per second they shape the whole storage design."
        ],
        "example": "Giving out token numbers at a busy temple: one counter with one token machine creates a long queue, so each gate prints its own tokens, with the gate number and time built in.",
        "code": "options = {\n    \"auto-increment\": {\"no coordination\": False, \"time sortable\": True, \"bits\": 64},\n    \"random UUID v4\": {\"no coordination\": True, \"time sortable\": False, \"bits\": 128},\n    \"Snowflake\": {\"no coordination\": True, \"time sortable\": True, \"bits\": 64},\n}\nfor name, props in options.items():\n    print(f\"{name:15} {props}\")",
        "output": "auto-increment  {'no coordination': False, 'time sortable': True, 'bits': 64}\nrandom UUID v4  {'no coordination': True, 'time sortable': False, 'bits': 128}\nSnowflake       {'no coordination': True, 'time sortable': True, 'bits': 64}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Unique, ordered by time, and compact."
          }
        ],
        "tryIt": "Which property matters most for a chat app that shows messages in time order?",
        "check": {
          "question": "What is the main scaling problem with auto-increment IDs?",
          "options": [
            "They are too long",
            "Every insert must go through one database",
            "They are random"
          ],
          "answer": 1,
          "why": "A single counter becomes a bottleneck and a single point of failure."
        }
      },
      {
        "title": "The Snowflake layout",
        "say": [
          "A Snowflake ID is a 64-bit number made of fields. The top bit is unused (keeps it positive). The next 41 bits are milliseconds since a custom epoch.",
          "Then 5 bits of datacenter id and 5 bits of worker id: 32 x 32 = 1,024 generators. The last 12 bits are a sequence number for IDs made in the same millisecond: up to 4,096 per millisecond per worker.",
          "The ID is built with shifts and ORs: (ms - EPOCH) << 22 | datacenter << 17 | worker << 12 | sequence.",
          "41 bits of milliseconds last about 70 years from the chosen epoch.",
          "Because time is in the highest bits, IDs sort by creation time, and generators never collide because their datacenter and worker bits differ.",
          "Sorting by ID is also cheaper than sorting by a separate timestamp column, because the ID is already the primary key and indexed.",
          "The code computes the capacity numbers from the bit sizes."
        ],
        "example": "A train ticket number made of the date and time, the station code, the counter number and a running count: unique everywhere, and it tells you when it was issued.",
        "code": "TIME_BITS, DC_BITS, WORKER_BITS, SEQ_BITS = 41, 5, 5, 12\nprint(\"total bits:\", 1 + TIME_BITS + DC_BITS + WORKER_BITS + SEQ_BITS)\nprint(\"generators:\", 2 ** DC_BITS * 2 ** WORKER_BITS)\nprint(\"ids per ms per worker:\", 2 ** SEQ_BITS)\nyears = 2 ** TIME_BITS / 1000 / 3600 / 24 / 365.25\nprint(f\"lifetime: about {years:.0f} years\")\nprint(\"ids per second, whole system:\", f\"{2 ** SEQ_BITS * 1000 * 1024:,}\")",
        "output": "total bits: 64\ngenerators: 1024\nids per ms per worker: 4096\nlifetime: about 70 years\nids per second, whole system: 4,194,304,000",
        "codeNotes": [
          {
            "line": 5,
            "note": "Milliseconds that fit in 41 bits, in years."
          }
        ],
        "tryIt": "If you used 10 bits for the sequence and 7 for the worker, how would the numbers change?",
        "check": {
          "question": "Why are the timestamp bits placed at the top of a Snowflake ID?",
          "options": [
            "To make IDs shorter",
            "So IDs sort in creation-time order",
            "It is required by databases"
          ],
          "answer": 1,
          "why": "The highest bits decide numeric order, so time order becomes ID order."
        }
      },
      {
        "title": "Building the generator",
        "say": [
          "Practice 1: next_id() reads the clock. If the millisecond equals the last one, increase the sequence; otherwise reset the sequence to 0.",
          "If the clock has gone backwards (for example after an NTP correction), raise ValueError(\"CLOCK_MOVED_BACKWARDS\"). Issuing IDs anyway could create duplicates.",
          "If the sequence passes 4,095 within one millisecond, a real generator waits for the next millisecond. Our tests do not reach that, but the code shows where it would go.",
          "The clock is passed in as a function, so tests can control time exactly, as with sleep on Day 1.",
          "Each generator needs its own datacenter and worker ids, usually from configuration or a coordination service at start-up.",
          "Two generators accidentally given the same worker id would create duplicate IDs, so assign them carefully and check at start-up.",
          "Everything else happens locally, with no network calls, which is why Snowflake is so fast."
        ],
        "example": "A ticket machine that prints the time and a running number, restarting the number every new minute, and refuses to print if its clock suddenly shows an earlier time.",
        "code": "EPOCH = 1_700_000_000_000\n\nclass Snowflake:\n    def __init__(self, datacenter_id, worker_id, clock):\n        self.dc, self.worker, self.clock = datacenter_id, worker_id, clock\n        self.last_ms, self.sequence = -1, 0\n\n    def next_id(self):\n        ms = self.clock()\n        if ms < self.last_ms:\n            raise ValueError(\"CLOCK_MOVED_BACKWARDS\")\n        self.sequence = self.sequence + 1 if ms == self.last_ms else 0\n        self.last_ms = ms\n        return ((ms - EPOCH) << 22) | (self.dc << 17) | (self.worker << 12) | self.sequence\n\ntimes = iter([EPOCH + 5, EPOCH + 5, EPOCH + 5, EPOCH + 6, EPOCH + 4])\ngen = Snowflake(datacenter_id=1, worker_id=3, clock=lambda: next(times))\nfor _ in range(4):\n    print(gen.next_id())\ntry:\n    gen.next_id()\nexcept ValueError as err:\n    print(\"error:\", err)",
        "output": "21114880\n21114881\n21114882\n25309184\nerror: CLOCK_MOVED_BACKWARDS",
        "codeNotes": [
          {
            "line": 10,
            "note": "The clock went backwards: refuse rather than risk duplicates."
          },
          {
            "line": 12,
            "note": "Same millisecond: next sequence number; new millisecond: start at 0."
          },
          {
            "line": 14,
            "note": "Shift each field into its place."
          }
        ],
        "tryIt": "Make the generator use worker_id 4 instead. Do the IDs change even for the same time?",
        "check": {
          "question": "What should a Snowflake generator do if the clock moves backwards?",
          "options": [
            "Keep issuing IDs",
            "Raise an error or wait, to avoid duplicate IDs",
            "Reset the sequence to 4095"
          ],
          "answer": 1,
          "why": "Going back in time could repeat an earlier timestamp and sequence."
        }
      },
      {
        "title": "Decoding an ID",
        "say": [
          "Because the layout is fixed, any ID can be taken apart again with shifts and masks.",
          "Timestamp: id >> 22, plus the epoch. Datacenter: (id >> 17) & 31. Worker: (id >> 12) & 31. Sequence: id & 4095.",
          "This is very handy for debugging: from an order ID alone you can tell when it was created and which machine created it.",
          "Logs and support tickets often contain only an ID, so being able to read the creation time from it saves a database lookup.",
          "It also means IDs leak information: anyone can see roughly how many orders you create per second. For public IDs, some systems add encryption or use other schemes.",
          "The masks are just the maximum value for each field: 31 is five 1-bits, 4095 is twelve 1-bits.",
          "The example builds an ID and decodes it back."
        ],
        "example": "Reading a vehicle registration number: KA-01 tells you the state and the transport office that issued it.",
        "code": "EPOCH = 1_700_000_000_000\n\ndef decode(snowflake_id):\n    return {\n        \"ms_since_epoch\": snowflake_id >> 22,\n        \"datacenter\": (snowflake_id >> 17) & 0b11111,\n        \"worker\": (snowflake_id >> 12) & 0b11111,\n        \"sequence\": snowflake_id & 0xFFF,\n    }\n\nmade = ((123_456 << 22) | (2 << 17) | (7 << 12) | 42)\nprint(made)\nprint(decode(made))",
        "output": "517812285482\n{'ms_since_epoch': 123456, 'datacenter': 2, 'worker': 7, 'sequence': 42}",
        "codeNotes": [
          {
            "line": 5,
            "note": "Drop the lower 22 bits to get the time."
          },
          {
            "line": 8,
            "note": "The lowest 12 bits are the sequence."
          }
        ],
        "tryIt": "Decode one of the IDs printed in the previous part.",
        "check": {
          "question": "Which operation extracts the 12-bit sequence from an ID?",
          "options": [
            "id >> 12",
            "id & 4095",
            "id << 22"
          ],
          "answer": 1,
          "why": "4095 has twelve 1-bits, so AND keeps just the lowest 12 bits."
        }
      },
      {
        "title": "Time-sortable text IDs",
        "say": [
          "Sometimes IDs are strings, such as in URLs or ULIDs. Putting a timestamp at the start, in a fixed-width compact alphabet, keeps them sortable as text.",
          "Practice 2: time_prefix(ms) writes ms in base 36, digits 0-9 then A-Z. 35 is \"Z\", 36 is \"10\".",
          "Repeatedly take ms % 36 as the next digit (from the right), then divide ms by 36. Handle 0 specially, since the loop would produce an empty string.",
          "Base 36 makes a 13-digit millisecond timestamp only 8 or 9 characters long.",
          "ULID uses the same idea with base 32 (skipping confusing letters like I, L, O, U) and adds random characters after the time part.",
          "For text sorting to match time order, all prefixes must have the same length, so real schemes pad with leading zeros."
        ],
        "example": "Writing dates as 2026-09-28 instead of 28/9/26: when every date has the same fixed format, sorting the text also sorts by date.",
        "code": "DIGITS = \"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\"\n\ndef time_prefix(ms):\n    if ms == 0:\n        return \"0\"\n    out = \"\"\n    while ms:\n        out = DIGITS[ms % 36] + out\n        ms //= 36\n    return out\n\nprint(time_prefix(35), time_prefix(36), time_prefix(0))\nfor ms in [1_790_000_000_000, 1_790_000_000_001, 1_800_000_000_000]:\n    print(ms, \"->\", time_prefix(ms).rjust(9, \"0\"))",
        "output": "Z 10 0\n1790000000000 -> 0MUBBS7I8\n1790000000001 -> 0MUBBS7I9\n1800000000000 -> 0MYWPIWW0",
        "codeNotes": [
          {
            "line": 8,
            "note": "The next digit, added on the left."
          },
          {
            "line": 14,
            "note": "Pad to a fixed width so text order matches time order."
          }
        ],
        "tryIt": "Sort the three padded prefixes as strings and check they come out in time order.",
        "check": {
          "question": "What is time_prefix(36)?",
          "options": [
            "\"Z\"",
            "\"10\"",
            "\"36\""
          ],
          "answer": 1,
          "why": "36 in base 36 is one 36 and zero units: \"10\"."
        }
      },
      {
        "title": "Choosing an ID scheme",
        "say": [
          "Auto-increment: fine for small, single-database apps; simple and readable.",
          "Random UUID v4: easy and collision-free, good when order does not matter and 128 bits are acceptable.",
          "Time-ordered UUIDs (UUID v7) and ULIDs: 128-bit, sortable, no coordination. A great default for new systems.",
          "Snowflake-style 64-bit IDs: compact and fast, but need worker ids assigned and care with clocks.",
          "Whatever you choose, never let clients choose IDs for server-side records without validation, and never expose sequential IDs where they could leak business numbers or allow guessing.",
          "Tomorrow you will see how Raft keeps a replicated log consistent across a cluster."
        ],
        "example": "Choosing between house numbers, plot survey numbers and GPS coordinates: each identifies a place, but suits different needs.",
        "code": "def choose_id(single_db, needs_sorting, max_bits):\n    if single_db:\n        return \"auto-increment\"\n    if not needs_sorting:\n        return \"UUID v4\"\n    return \"Snowflake (64-bit)\" if max_bits <= 64 else \"UUID v7 / ULID (128-bit)\"\n\nfor case in [(True, True, 64), (False, False, 128), (False, True, 64), (False, True, 128)]:\n    print(case, \"->\", choose_id(*case))",
        "output": "(True, True, 64) -> auto-increment\n(False, False, 128) -> UUID v4\n(False, True, 64) -> Snowflake (64-bit)\n(False, True, 128) -> UUID v7 / ULID (128-bit)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Sortable IDs: pick by size."
          }
        ],
        "tryIt": "Which scheme would you choose for public order numbers shown to customers, and why?",
        "check": {
          "question": "What is a downside of Snowflake IDs compared with UUID v7?",
          "options": [
            "They are not sortable",
            "Worker ids must be assigned and clocks handled carefully",
            "They are 256 bits long"
          ],
          "answer": 1,
          "why": "Snowflake needs unique worker ids and protection against clock problems."
        }
      }
    ],
    "summary": [
      "Auto-increment needs one database; random UUIDs are unsorted and long.",
      "Snowflake: 41 time bits, 10 machine bits, 12 sequence bits in 64 bits.",
      "Increase the sequence within a millisecond; refuse if the clock goes back.",
      "Decode IDs with shifts and masks to see time and machine.",
      "Fixed-width time prefixes (base 36, ULID) keep text IDs sortable."
    ],
    "projectStep": {
      "title": "ID generation",
      "steps": [
        "Add the Snowflake generator and time_prefix to dist_toolkit.py.",
        "Generate 5 IDs with a fake clock and decode each one.",
        "Bonus: pad prefixes to a fixed width and prove they sort in time order."
      ]
    }
  },
  {
    "day": 9,
    "title": "Consensus Protocols: Raft Log Replication & Quorum Mathematics",
    "goal": "You can explain replicated state machines, follow Raft log replication with AppendEntries and its consistency check, decide when entries are committed, and repair followers' logs.",
    "minutes": 30,
    "recap": "On Day 7 a Raft cluster elected a leader. Today the leader does its real job: copying an ordered log of commands to every follower, safely.",
    "parts": [
      {
        "title": "Replicated state machines",
        "say": [
          "If several machines start in the same state and apply the same commands in the same order, they end in the same state. This is a replicated state machine.",
          "So the hard problem becomes: make every node agree on the same ordered log of commands, even when nodes and networks fail. That is consensus.",
          "Commands must be deterministic: no random numbers or reading the local clock while applying them, or replicas would drift apart.",
          "Raft (and Paxos before it) solve consensus. etcd, Consul, CockroachDB, TiKV and Kafka's KRaft mode all use Raft.",
          "The leader receives commands from clients, appends them to its log, and replicates them to followers.",
          "The example applies the same log to two copies of a key-value store and gets identical results.",
          "Keep the separation clear: the log is agreed first; applying it to the state is deterministic and local."
        ],
        "example": "Two people following the same recipe card step by step with the same ingredients end up with the same dish. The hard part is making sure everyone has the same card.",
        "code": "log = [(\"set\", \"x\", 1), (\"set\", \"y\", 5), (\"add\", \"x\", 10), (\"del\", \"y\", None)]\n\ndef apply(state, entry):\n    op, key, value = entry\n    if op == \"set\":\n        state[key] = value\n    elif op == \"add\":\n        state[key] = state.get(key, 0) + value\n    elif op == \"del\":\n        state.pop(key, None)\n\nnode_a, node_b = {}, {}\nfor entry in log:\n    apply(node_a, entry)\n    apply(node_b, entry)\nprint(node_a, node_b, node_a == node_b)",
        "output": "{'x': 11} {'x': 11} True",
        "codeNotes": [
          {
            "line": 3,
            "note": "Applying an entry is deterministic."
          },
          {
            "line": 16,
            "note": "Same log, same order: same state."
          }
        ],
        "tryIt": "Apply the log to node_b in a different order. Is the final state still the same?",
        "check": {
          "question": "Why do replicated state machines end in the same state?",
          "options": [
            "They share memory",
            "They apply the same commands in the same order, deterministically",
            "They copy the whole state every second"
          ],
          "answer": 1,
          "why": "Deterministic commands applied in one agreed order produce identical results."
        }
      },
      {
        "title": "Log entries, terms and AppendEntries",
        "say": [
          "Each log entry records the command and the term in which the leader received it.",
          "The leader sends followers AppendEntries messages containing new entries, plus the index and term of the entry just before them (prev_index and prev_term).",
          "The same message with no entries doubles as the heartbeat from Day 7.",
          "Followers check that their log matches the leader's at prev_index before adding anything. This check is what keeps logs identical.",
          "Raft proves that if two logs have an entry with the same index and term, all entries before it are identical too. That is why checking just one entry is enough.",
          "Terms in entries let nodes detect entries written by an old, deposed leader.",
          "The example prints a leader's log with index and term, the way Raft papers draw it."
        ],
        "example": "A teacher dictating notes: before each new sentence, the teacher reads the previous sentence aloud so students can check they are on the same line.",
        "code": "leader_log = [{\"term\": 1, \"cmd\": \"set x=1\"}, {\"term\": 1, \"cmd\": \"set y=2\"}, {\"term\": 2, \"cmd\": \"set x=3\"}]\nfor index, entry in enumerate(leader_log):\n    print(f\"index {index}: term {entry['term']}  {entry['cmd']}\")\nnew = [{\"term\": 3, \"cmd\": \"set z=9\"}]\nmessage = {\"prev_index\": len(leader_log) - 1, \"prev_term\": leader_log[-1][\"term\"], \"entries\": new}\nprint(\"AppendEntries:\", message)",
        "output": "index 0: term 1  set x=1\nindex 1: term 1  set y=2\nindex 2: term 2  set x=3\nAppendEntries: {'prev_index': 2, 'prev_term': 2, 'entries': [{'term': 3, 'cmd': 'set z=9'}]}",
        "codeNotes": [
          {
            "line": 5,
            "note": "The message says which entry the new ones follow."
          }
        ],
        "tryIt": "Write the AppendEntries message that would send only the heartbeat (no entries).",
        "check": {
          "question": "What do prev_index and prev_term let a follower check?",
          "options": [
            "Its disk space",
            "That its log matches the leader's just before the new entries",
            "The leader's IP address"
          ],
          "answer": 1,
          "why": "If the entry before matches, the logs agree up to that point."
        }
      },
      {
        "title": "The follower's consistency check",
        "say": [
          "Practice 1: append_entries(log, prev_index, prev_term, entries). If prev_index is not -1 and the follower has no entry there, or its term differs, reply LOG_MISMATCH.",
          "Otherwise keep log[:prev_index + 1], add the new entries (dropping any conflicting tail), and reply success with the new log and match_index = len(new_log) - 1.",
          "prev_index of -1 means \"from the very start\", which always matches.",
          "Dropping the tail matters: entries after prev_index on the follower may come from an old leader and were never committed, so the current leader's version wins.",
          "Build a new list instead of changing the input, so a failed check leaves the follower's log untouched.",
          "By induction, if every append passes this check, follower logs always match the leader's prefix."
        ],
        "example": "Before copying the next page of notes, a student checks that the last line on their page matches the teacher's; if not, they rewrite from the last matching line.",
        "code": "def append_entries(log, prev_index, prev_term, entries):\n    if prev_index >= 0 and (prev_index >= len(log) or log[prev_index][\"term\"] != prev_term):\n        return {\"success\": False, \"reason\": \"LOG_MISMATCH\"}\n    new_log = log[:prev_index + 1] + list(entries)\n    return {\"success\": True, \"log\": new_log, \"match_index\": len(new_log) - 1}\n\nfollower = [{\"term\": 1, \"cmd\": \"a\"}, {\"term\": 1, \"cmd\": \"b\"}, {\"term\": 2, \"cmd\": \"stale\"}]\nprint(append_entries(follower, 1, 1, [{\"term\": 3, \"cmd\": \"c\"}]))\nprint(append_entries(follower, 2, 3, [{\"term\": 3, \"cmd\": \"d\"}]))\nprint(append_entries([], -1, 0, [{\"term\": 1, \"cmd\": \"first\"}]))\nprint(\"input unchanged:\", len(follower))",
        "output": "{'success': True, 'log': [{'term': 1, 'cmd': 'a'}, {'term': 1, 'cmd': 'b'}, {'term': 3, 'cmd': 'c'}], 'match_index': 2}\n{'success': False, 'reason': 'LOG_MISMATCH'}\n{'success': True, 'log': [{'term': 1, 'cmd': 'first'}], 'match_index': 0}\ninput unchanged: 3",
        "codeNotes": [
          {
            "line": 2,
            "note": "No entry at prev_index, or a different term: mismatch."
          },
          {
            "line": 4,
            "note": "Keep the matching prefix, replace the rest."
          },
          {
            "line": 8,
            "note": "The stale term-2 entry is dropped."
          }
        ],
        "tryIt": "Call append_entries(follower, 5, 1, []). Why is it a mismatch?",
        "check": {
          "question": "Why does the follower drop entries after prev_index?",
          "options": [
            "To save space",
            "They may be uncommitted entries from an old leader, and the current leader's log wins",
            "Raft keeps only 3 entries"
          ],
          "answer": 1,
          "why": "Conflicting uncommitted entries are replaced by the leader's entries."
        }
      },
      {
        "title": "When is an entry committed?",
        "say": [
          "An entry is committed once the leader knows it is stored on a majority of the cluster. Committed entries will never be lost, even if the leader crashes.",
          "Practice 2: is_committed(match_count, cluster_size) returns match_count > cluster_size // 2.",
          "The leader tracks each follower's match_index. Sorting those (including its own) and taking the middle value gives the highest index stored on a majority: the commit index.",
          "Only committed entries are applied to the state machine and acknowledged to clients.",
          "A client only gets its \"success\" reply after commit, so an acknowledged write can never disappear, even if the leader crashes right after replying.",
          "Raft adds one rule: a leader only commits entries from its own term by counting replicas; older entries become committed along with them.",
          "The code computes the commit index for a 5-node cluster."
        ],
        "example": "A decision in a club becomes official once more than half the members have signed the minutes; after that, nobody can quietly undo it.",
        "code": "def is_committed(match_count, cluster_size):\n    return match_count > cluster_size // 2\n\nmatch_index = {\"leader\": 7, \"n2\": 7, \"n3\": 5, \"n4\": 4, \"n5\": 2}\nordered = sorted(match_index.values(), reverse=True)\ncommit_index = ordered[len(ordered) // 2]\nprint(\"match indexes:\", ordered, \"-> commit index\", commit_index)\nfor index in [2, 5, 6, 7]:\n    stored_on = sum(m >= index for m in match_index.values())\n    print(f\"entry {index}: on {stored_on} nodes, committed? {is_committed(stored_on, 5)}\")",
        "output": "match indexes: [7, 7, 5, 4, 2] -> commit index 5\nentry 2: on 5 nodes, committed? True\nentry 5: on 3 nodes, committed? True\nentry 6: on 2 nodes, committed? False\nentry 7: on 2 nodes, committed? False",
        "codeNotes": [
          {
            "line": 6,
            "note": "The middle value is stored on a majority."
          },
          {
            "line": 9,
            "note": "How many nodes have at least this entry."
          }
        ],
        "tryIt": "Raise n4's match index to 7. What is the new commit index?",
        "check": {
          "question": "In a 5-node cluster, how many nodes must store an entry before it is committed?",
          "options": [
            "2",
            "3",
            "5"
          ],
          "answer": 1,
          "why": "More than half: 3 of 5."
        }
      },
      {
        "title": "Repairing a lagging follower",
        "say": [
          "A follower that was offline has a shorter or different log. The leader keeps a next_index for each follower: the next entry to send.",
          "If AppendEntries fails with a mismatch, the leader decreases next_index by one and tries again, stepping back until the logs match.",
          "Followers never change their logs on their own; they only accept what a current leader sends, which keeps the rules simple.",
          "Then one successful append replaces the follower's conflicting tail and adds everything it missed.",
          "Real implementations skip back faster, for example by term, but the simple version shows the idea.",
          "This repair is automatic: operators do not need to fix logs by hand after an outage.",
          "The simulation brings a follower from a stale log to the leader's log."
        ],
        "example": "Finding where two copies of a document started to differ by comparing them line by line from the end, then copying everything after that point.",
        "code": "def append_entries(log, prev_index, prev_term, entries):\n    if prev_index >= 0 and (prev_index >= len(log) or log[prev_index][\"term\"] != prev_term):\n        return None\n    return log[:prev_index + 1] + entries\n\nleader = [{\"term\": t} for t in [1, 1, 2, 3, 3, 3]]\nfollower = [{\"term\": t} for t in [1, 1, 2, 2, 2]]\nnext_index = len(leader)\nwhile True:\n    prev = next_index - 1\n    prev_term = leader[prev][\"term\"] if prev >= 0 else 0\n    result = append_entries(follower, prev, prev_term, leader[next_index:])\n    if result is not None:\n        break\n    next_index -= 1\n    print(\"mismatch, stepping back to\", next_index)\nprint(\"repaired:\", [e[\"term\"] for e in result] == [e[\"term\"] for e in leader])",
        "output": "mismatch, stepping back to 5\nmismatch, stepping back to 4\nmismatch, stepping back to 3\nrepaired: True",
        "codeNotes": [
          {
            "line": 12,
            "note": "Try appending from next_index."
          },
          {
            "line": 15,
            "note": "Mismatch: step back one entry and retry."
          }
        ],
        "tryIt": "Start the follower with an empty log. How many steps back does the leader take?",
        "check": {
          "question": "What does the leader do when a follower rejects AppendEntries?",
          "options": [
            "Gives up",
            "Steps next_index back and retries until the logs match",
            "Deletes its own log"
          ],
          "answer": 1,
          "why": "Stepping back finds the last matching entry, and then the follower is brought up to date."
        }
      },
      {
        "title": "Reads, snapshots and Raft in practice",
        "say": [
          "Writes go through the log. For reads that must see the latest data (linearizable reads), the leader confirms it is still leader with a round of heartbeats, or reads through the log.",
          "Logs grow forever, so nodes periodically save a snapshot of the state and delete older log entries (log compaction). New or far-behind followers receive the snapshot first.",
          "Snapshots also speed up restarts: a node loads the latest snapshot and replays only the few entries after it.",
          "Clusters usually have 3 or 5 nodes: every write waits for a majority, so larger clusters are slower.",
          "Raft is used for metadata and coordination (who is leader, configuration, locks) more than for bulk data, though some databases use a Raft group per data range.",
          "Tomorrow you will look at the classic protocol for committing a transaction across several separate databases: two-phase commit.",
          "The example computes the time a write waits in a 5-node cluster: the majority's slowest replies decide it."
        ],
        "example": "A committee that keeps meeting minutes: once a year the secretary writes a one-page summary of all decisions so far, and the old minute books go to the archive.",
        "code": "reply_ms = {\"leader\": 0, \"n2\": 3, \"n3\": 4, \"n4\": 40, \"n5\": 120}\nordered = sorted(reply_ms.values())\nmajority = len(reply_ms) // 2 + 1\nprint(\"write committed after\", ordered[majority - 1], \"ms (waits for\", majority, \"of\", len(reply_ms), \"nodes)\")\nprint(\"waiting for everyone would take\", max(ordered), \"ms\")",
        "output": "write committed after 4 ms (waits for 3 of 5 nodes)\nwaiting for everyone would take 120 ms",
        "codeNotes": [
          {
            "line": 4,
            "note": "The write waits only for the fastest majority."
          }
        ],
        "tryIt": "What happens to commit time if n2 and n3 are also slow (40 ms and 120 ms)?",
        "check": {
          "question": "Why do Raft clusters usually have only 3 or 5 nodes?",
          "options": [
            "Raft cannot count higher",
            "Every write waits for a majority, so more nodes mean slower writes",
            "To save licence costs"
          ],
          "answer": 1,
          "why": "Bigger clusters tolerate more failures but need more replies per write."
        }
      }
    ],
    "summary": [
      "Same commands, same order, deterministic apply: same state everywhere.",
      "AppendEntries carries prev_index and prev_term for a consistency check.",
      "Followers keep the matching prefix and replace conflicting tails.",
      "An entry is committed once stored on a majority; the commit index is the median match.",
      "Leaders repair followers by stepping back; snapshots keep logs small."
    ],
    "projectStep": {
      "title": "Raft log",
      "steps": [
        "Add append_entries and is_committed to dist_toolkit.py.",
        "Simulate a follower that missed 3 entries and repair it.",
        "Bonus: compute the commit index from a dict of match indexes."
      ]
    }
  },
  {
    "day": 10,
    "title": "Two-Phase Commit (2PC) vs Three-Phase Commit (3PC)",
    "goal": "You can explain atomic commit across services, run two-phase commit with prepare and commit phases, count votes, describe why 2PC blocks when the coordinator fails, and compare 3PC and alternatives.",
    "minutes": 30,
    "recap": "Raft keeps one replicated log consistent. Today's problem is different: one transaction touching several separate databases, which must all commit or all abort.",
    "parts": [
      {
        "title": "All or nothing across services",
        "say": [
          "A money transfer between two banks' systems must debit one account and credit the other. If only one side happens, money appears or vanishes.",
          "Inside one database, a transaction gives all-or-nothing. Across separate databases or services, nothing provides it automatically.",
          "Microservice architectures make this common, because each service owns its own database, and one business action often touches several services.",
          "An atomic commit protocol coordinates several participants so that either all commit or all abort.",
          "Two-phase commit (2PC) is the classic protocol, used by databases with XA transactions and some message brokers.",
          "The example shows what goes wrong without coordination when one side fails.",
          "Keep this failure picture in mind; tomorrow's sagas solve the same problem differently."
        ],
        "example": "Exchanging a car for cash with a stranger: you want both handovers to happen or neither. A trusted middleman who holds both until both sides are ready makes that possible.",
        "code": "bank_a = {\"asha\": 1000}\nbank_b = {\"bala\": 200}\n\ndef transfer(amount, credit_fails):\n    bank_a[\"asha\"] -= amount\n    if credit_fails:\n        return \"credit failed after debit!\"\n    bank_b[\"bala\"] += amount\n    return \"done\"\n\nprint(transfer(300, credit_fails=True))\nprint(\"total money:\", bank_a[\"asha\"] + bank_b[\"bala\"], \"(was 1200)\")",
        "output": "credit failed after debit!\ntotal money: 900 (was 1200)",
        "codeNotes": [
          {
            "line": 5,
            "note": "The debit happens..."
          },
          {
            "line": 7,
            "note": "...but the credit fails: money has vanished."
          }
        ],
        "tryIt": "Run the transfer again with credit_fails=False and check the total.",
        "check": {
          "question": "What does atomic commit guarantee?",
          "options": [
            "Speed",
            "All participants commit, or all abort",
            "Only one participant writes"
          ],
          "answer": 1,
          "why": "Atomicity means no partial outcome across participants."
        }
      },
      {
        "title": "The two phases",
        "say": [
          "A coordinator runs the protocol. Phase 1 (prepare): it asks every participant, \"can you commit?\". Each participant does the work, locks the data, writes it durably, and votes COMMIT or ABORT.",
          "A COMMIT vote is a promise: the participant must be able to commit later even if it crashes and restarts, so it records the prepared state on disk.",
          "That is why preparing is the expensive phase: the participant must do the real work and save it, while keeping it invisible to others.",
          "Phase 2 (decision): if every vote is COMMIT, the coordinator tells everyone to commit. If any vote is ABORT (or a participant does not answer), it tells everyone to abort.",
          "The coordinator writes its decision to its own log before sending it, so it can finish the protocol after a crash.",
          "Participants hold their locks from prepare until the decision arrives.",
          "The trace below shows both phases for a successful transaction."
        ],
        "example": "A wedding: the officiant first asks each partner \"do you?\" (prepare), and only after both say yes pronounces them married (commit). One \"no\" stops the whole thing.",
        "code": "participants = [\"bank_a\", \"bank_b\"]\nvotes = {\"bank_a\": \"VOTE_COMMIT\", \"bank_b\": \"VOTE_COMMIT\"}\nprint(\"PHASE 1: prepare\")\nfor p in participants:\n    print(f\"  coordinator -> {p}: prepare?   {p} -> coordinator: {votes[p]}\")\ndecision = \"COMMIT\" if all(v == \"VOTE_COMMIT\" for v in votes.values()) else \"ABORT\"\nprint(\"coordinator writes decision to its log:\", decision)\nprint(\"PHASE 2:\", decision.lower())\nfor p in participants:\n    print(f\"  coordinator -> {p}: {decision}\")",
        "output": "PHASE 1: prepare\n  coordinator -> bank_a: prepare?   bank_a -> coordinator: VOTE_COMMIT\n  coordinator -> bank_b: prepare?   bank_b -> coordinator: VOTE_COMMIT\ncoordinator writes decision to its log: COMMIT\nPHASE 2: commit\n  coordinator -> bank_a: COMMIT\n  coordinator -> bank_b: COMMIT",
        "codeNotes": [
          {
            "line": 6,
            "note": "Commit only if every participant voted commit."
          },
          {
            "line": 7,
            "note": "The decision is logged before it is sent."
          }
        ],
        "tryIt": "Change bank_b's vote to VOTE_ABORT and rerun. What does phase 2 send?",
        "check": {
          "question": "What does a participant promise when it votes COMMIT?",
          "options": [
            "Nothing",
            "That it can commit later, even after a crash",
            "That it has already committed"
          ],
          "answer": 1,
          "why": "A yes vote is binding: the prepared state is saved so the commit can always complete."
        }
      },
      {
        "title": "Implementing the coordinator",
        "say": [
          "Practice 1: two_phase_commit(cohorts). Call prepare() on every cohort and collect the votes.",
          "If all are VOTE_COMMIT, call commit() on every cohort and return GLOBAL_COMMITTED with the votes; otherwise call abort() on every cohort and return GLOBAL_ABORTED.",
          "Abort goes to every cohort, including the ones that voted commit, because they are holding locks and prepared data.",
          "Commit and abort messages may need to be resent until every cohort confirms, so both operations must be safe to repeat.",
          "In real systems, a participant that does not answer the prepare in time counts as an ABORT vote.",
          "Cohorts are objects with three methods, so tests can use simple fakes that record what happened to them.",
          "The code runs one transaction that commits and one that aborts."
        ],
        "example": "A trip organiser who books only if every friend confirms they can come, and otherwise tells everyone the trip is cancelled so they can free their dates.",
        "code": "class Cohort:\n    def __init__(self, name, vote):\n        self.name, self.vote, self.state = name, vote, \"idle\"\n    def prepare(self):\n        self.state = \"prepared\"\n        return self.vote\n    def commit(self):\n        self.state = \"committed\"\n    def abort(self):\n        self.state = \"aborted\"\n\ndef two_phase_commit(cohorts):\n    votes = [c.prepare() for c in cohorts]\n    if all(v == \"VOTE_COMMIT\" for v in votes):\n        for c in cohorts:\n            c.commit()\n        return {\"status\": \"GLOBAL_COMMITTED\", \"votes\": votes}\n    for c in cohorts:\n        c.abort()\n    return {\"status\": \"GLOBAL_ABORTED\", \"votes\": votes}\n\nfor votes in [(\"VOTE_COMMIT\", \"VOTE_COMMIT\"), (\"VOTE_COMMIT\", \"VOTE_ABORT\")]:\n    cohorts = [Cohort(\"orders\", votes[0]), Cohort(\"payments\", votes[1])]\n    print(two_phase_commit(cohorts), [c.state for c in cohorts])",
        "output": "{'status': 'GLOBAL_COMMITTED', 'votes': ['VOTE_COMMIT', 'VOTE_COMMIT']} ['committed', 'committed']\n{'status': 'GLOBAL_ABORTED', 'votes': ['VOTE_COMMIT', 'VOTE_ABORT']} ['aborted', 'aborted']",
        "codeNotes": [
          {
            "line": 13,
            "note": "Phase 1: collect every vote."
          },
          {
            "line": 18,
            "note": "Any abort: tell everyone to abort, even those who voted commit."
          }
        ],
        "tryIt": "Add a third cohort, \"inventory\", and try all combinations of its vote.",
        "check": {
          "question": "After one ABORT vote, which cohorts receive abort()?",
          "options": [
            "Only the one that voted abort",
            "Every cohort",
            "None"
          ],
          "answer": 1,
          "why": "All participants must release their prepared work and locks."
        }
      },
      {
        "title": "Counting votes and keeping a log",
        "say": [
          "Practice 2: count_votes(votes) returns {\"commit\": ..., \"abort\": ...} using list.count.",
          "Counts are useful for monitoring: a rising number of abort votes can mean lock contention, validation failures or an unhealthy participant.",
          "Logging the time each phase takes also helps, since slow prepares mean locks are held longer and other transactions wait.",
          "The coordinator's log is essential. After a crash, it reads its log: a recorded decision is resent to everyone; no decision means the transaction is aborted.",
          "Participants keep their own logs of prepared transactions, so after a restart they know which transactions still wait for a decision.",
          "These logs are why 2PC is safe: every promise and decision survives crashes.",
          "The code counts votes and shows the recovery rule."
        ],
        "example": "A referee's scorecard: after a power cut in the stadium, the result is taken from the written card, not from anyone's memory.",
        "code": "def count_votes(votes):\n    return {\"commit\": votes.count(\"VOTE_COMMIT\"), \"abort\": votes.count(\"VOTE_ABORT\")}\n\nprint(count_votes([\"VOTE_COMMIT\", \"VOTE_ABORT\", \"VOTE_COMMIT\"]))\n\ncoordinator_log = {\"tx-1\": \"COMMIT\", \"tx-2\": None}\nfor tx, decision in coordinator_log.items():\n    action = f\"resend {decision}\" if decision else \"no decision logged: ABORT\"\n    print(f\"after restart, {tx}: {action}\")",
        "output": "{'commit': 2, 'abort': 1}\nafter restart, tx-1: resend COMMIT\nafter restart, tx-2: no decision logged: ABORT",
        "codeNotes": [
          {
            "line": 2,
            "note": "Count each kind of vote."
          },
          {
            "line": 8,
            "note": "Recovery: follow the logged decision, or abort if there is none."
          }
        ],
        "tryIt": "Add a transaction \"tx-3\" with decision \"ABORT\" and check the recovery message.",
        "check": {
          "question": "After a restart, what does a coordinator do with a transaction that has no logged decision?",
          "options": [
            "Commit it",
            "Abort it",
            "Wait forever"
          ],
          "answer": 1,
          "why": "Without a logged commit decision, aborting is the safe choice."
        }
      },
      {
        "title": "The blocking problem",
        "say": [
          "2PC has a famous weakness. If the coordinator crashes after participants voted COMMIT but before they learn the decision, they are stuck.",
          "They cannot commit (maybe someone else voted abort) and cannot abort (maybe the coordinator decided commit and others already committed). They must wait, holding their locks.",
          "Meanwhile other transactions needing those rows also wait. One crashed coordinator can freeze part of the system until it recovers.",
          "Production systems add timeouts and manual tools for operators to resolve such in-doubt transactions, but that is a last resort.",
          "This is why 2PC is called a blocking protocol, and why it is used carefully, mostly inside one organisation's database systems.",
          "Participants can ask each other what they know, which sometimes resolves the uncertainty, but not always.",
          "The simulation shows participants stuck in the prepared state."
        ],
        "example": "Friends who each agreed to a trip and paid a deposit, waiting for the organiser to confirm, when the organiser's phone dies. Nobody knows whether to pack or cancel, and the deposits stay locked.",
        "code": "participants = {\"orders\": \"prepared\", \"payments\": \"prepared\"}\ncoordinator_alive = False\n\nfor name, state in participants.items():\n    if state == \"prepared\" and not coordinator_alive:\n        print(f\"{name}: voted COMMIT, no decision received -> BLOCKED, holding locks\")\nprint(\"other transactions waiting for these rows: blocked too\")",
        "output": "orders: voted COMMIT, no decision received -> BLOCKED, holding locks\npayments: voted COMMIT, no decision received -> BLOCKED, holding locks\nother transactions waiting for these rows: blocked too",
        "codeNotes": [
          {
            "line": 5,
            "note": "A prepared participant cannot decide on its own."
          }
        ],
        "tryIt": "If one participant had voted ABORT and the others know it, can they safely abort? Why?",
        "check": {
          "question": "Why is 2PC called a blocking protocol?",
          "options": [
            "It blocks all networks",
            "Prepared participants must wait, holding locks, if the coordinator fails",
            "It only allows one transaction at a time"
          ],
          "answer": 1,
          "why": "Without the decision, participants can neither commit nor abort safely."
        }
      },
      {
        "title": "Three-phase commit and alternatives",
        "say": [
          "Three-phase commit (3PC) adds a pre-commit phase between voting and committing, so participants know the decision is heading to commit before anyone commits.",
          "With timeouts, 3PC lets participants finish on their own if the coordinator fails, but only when the network does not partition. Real networks do partition, so 3PC is rarely used.",
          "Modern systems either replicate the coordinator with consensus (Paxos Commit, or Spanner running 2PC over Raft-like groups) so it never disappears, or avoid distributed transactions altogether.",
          "Google Spanner does this at global scale, combining 2PC with replicated Paxos groups and precise clocks.",
          "Sagas (tomorrow) break a long transaction into local steps with compensating actions, accepting temporary inconsistency in exchange for no global locks.",
          "Rule of thumb: keep strongly related data in one database where possible; use 2PC inside a database cluster; use sagas across independent services.",
          "The table compares the options."
        ],
        "example": "Instead of one organiser whose phone can die, a small committee that keeps shared notes: if one member is unavailable, the others know the decision.",
        "code": "options = [\n    (\"2PC\", \"atomic\", \"blocks if coordinator fails\", \"databases, XA\"),\n    (\"3PC\", \"atomic\", \"unsafe under partitions\", \"rarely used\"),\n    (\"2PC + consensus\", \"atomic\", \"complex, slower\", \"Spanner, CockroachDB\"),\n    (\"Saga\", \"eventually consistent\", \"needs compensations\", \"microservices\"),\n]\nfor name, guarantee, weakness, used in options:\n    print(f\"{name:16} {guarantee:22} {weakness:28} {used}\")",
        "output": "2PC              atomic                 blocks if coordinator fails  databases, XA\n3PC              atomic                 unsafe under partitions      rarely used\n2PC + consensus  atomic                 complex, slower              Spanner, CockroachDB\nSaga             eventually consistent  needs compensations          microservices",
        "codeNotes": [
          {
            "line": 4,
            "note": "Replicating the coordinator removes the single point of failure."
          }
        ],
        "tryIt": "For a food delivery app (order, payment, restaurant, rider), which option would you choose? Why?",
        "check": {
          "question": "Why is 3PC rarely used in practice?",
          "options": [
            "It is too fast",
            "It is not safe when the network partitions, which real networks do",
            "It needs 3 coordinators"
          ],
          "answer": 1,
          "why": "Its non-blocking guarantee assumes no partitions."
        }
      }
    ],
    "summary": [
      "Atomic commit: every participant commits or every participant aborts.",
      "2PC: prepare and vote, then commit only if all voted commit.",
      "Votes and decisions are logged so crashes can be recovered.",
      "2PC blocks if the coordinator fails after prepare.",
      "3PC is unsafe under partitions; use consensus-backed 2PC or sagas."
    ],
    "projectStep": {
      "title": "Two-phase commit",
      "steps": [
        "Add two_phase_commit and count_votes to dist_toolkit.py.",
        "Test a transaction with three cohorts where the last one aborts.",
        "Bonus: add a coordinator log and recovery after a simulated crash."
      ]
    }
  },
  {
    "day": 11,
    "title": "The Saga Pattern: Orchestration vs Choreography & Compensating Actions",
    "goal": "You can design a saga of local transactions with compensating actions, run it with rollback in reverse order, log its progress, and choose between orchestration and choreography.",
    "minutes": 30,
    "recap": "Yesterday 2PC gave atomic commits but could block and hold locks. Sagas take a different path for long business processes across independent services.",
    "parts": [
      {
        "title": "A saga is a chain of local transactions",
        "say": [
          "Booking a trip might touch a flight service, a hotel service and a payment service, each with its own database. Holding locks across all of them for seconds is impractical.",
          "A saga splits the business transaction into steps. Each step is a normal local transaction in one service, committed immediately.",
          "The idea comes from a 1987 database paper about long-lived transactions, and it fits microservices well because each service keeps full control of its own data.",
          "If a later step fails, the saga runs compensating actions for the earlier steps to undo their business effect.",
          "There are no global locks and no blocking coordinator, so services stay available and independent.",
          "The price: for a short time, other users can see the partial state (a flight booked but no hotel yet). The design must allow for that.",
          "The example lists a trip-booking saga with a compensation for each step."
        ],
        "example": "Planning a wedding with separate vendors: you book the hall, then the caterer, then the band. If the band falls through and you cancel, you ring the caterer and the hall to cancel, one by one.",
        "code": "saga = [\n    (\"reserve flight\", \"cancel flight\"),\n    (\"reserve hotel\", \"cancel hotel\"),\n    (\"charge card\", \"refund card\"),\n    (\"send confirmation\", \"send cancellation\"),\n]\nfor i, (action, compensation) in enumerate(saga, start=1):\n    print(f\"step {i}: {action:18} undo with: {compensation}\")",
        "output": "step 1: reserve flight     undo with: cancel flight\nstep 2: reserve hotel      undo with: cancel hotel\nstep 3: charge card        undo with: refund card\nstep 4: send confirmation  undo with: send cancellation",
        "codeNotes": [
          {
            "line": 2,
            "note": "Every step has a matching compensating action."
          }
        ],
        "tryIt": "Add a step \"reserve airport taxi\" and choose its compensation.",
        "check": {
          "question": "How does a saga undo completed steps after a failure?",
          "options": [
            "A database rollback across services",
            "Compensating actions for each completed step",
            "It cannot undo them"
          ],
          "answer": 1,
          "why": "Each step was committed locally, so the saga runs explicit compensations."
        }
      },
      {
        "title": "Designing compensations",
        "say": [
          "A compensation is a semantic undo, not a database rollback. A charged card is refunded; the charge still appears in the history.",
          "Some actions cannot be undone: an email already sent can only be followed by an apology or correction email. Put such steps last, after everything that might fail.",
          "Others can only be partly undone: a cancelled flight may carry a fee. The compensation then records the fee rather than pretending nothing happened.",
          "The step after which the saga will definitely complete is the pivot. Steps before it can be compensated; steps after it must be retried until they succeed.",
          "Compensations must be idempotent and retryable: if a refund request times out, sending it again must not refund twice.",
          "Write the compensation at the same time as the action, and test both together.",
          "The code orders steps so the risky ones come first and the irreversible one last."
        ],
        "example": "Cooking for guests: you check you have every ingredient before you start cooking, because once the rice is cooked you cannot uncook it.",
        "code": "steps = [\n    {\"name\": \"validate address\", \"reversible\": True, \"can_fail\": True},\n    {\"name\": \"reserve stock\", \"reversible\": True, \"can_fail\": True},\n    {\"name\": \"charge card\", \"reversible\": True, \"can_fail\": True},\n    {\"name\": \"ship parcel\", \"reversible\": False, \"can_fail\": False},\n]\npivot = max(i for i, s in enumerate(steps) if s[\"can_fail\"])\nprint(\"pivot step:\", steps[pivot][\"name\"])\nfor i, s in enumerate(steps):\n    kind = \"compensate if later fails\" if i <= pivot else \"retry until done\"\n    print(f\"  {s['name']:17} -> {kind}\")",
        "output": "pivot step: charge card\n  validate address  -> compensate if later fails\n  reserve stock     -> compensate if later fails\n  charge card       -> compensate if later fails\n  ship parcel       -> retry until done",
        "codeNotes": [
          {
            "line": 7,
            "note": "The last step that can still fail."
          },
          {
            "line": 10,
            "note": "After the pivot, steps are retried, never undone."
          }
        ],
        "tryIt": "Move \"ship parcel\" before \"charge card\". Why is that order a bad idea?",
        "check": {
          "question": "Where should an action that cannot be undone go in a saga?",
          "options": [
            "First",
            "After every step that might fail",
            "Anywhere"
          ],
          "answer": 1,
          "why": "Irreversible steps belong after the pivot, when completion is certain."
        }
      },
      {
        "title": "Running a saga",
        "say": [
          "Practice 1: run_saga(steps). Each step has a name, an action and a compensate function. Run the actions in order, remembering the finished steps.",
          "If an action raises, run compensate() for every finished step, newest first, and return SAGA_COMPENSATED with the failed step's name and the error text.",
          "If all actions succeed, return SAGA_COMPLETED.",
          "Newest first matters: later steps may depend on earlier ones, just as you undo in reverse when unpacking.",
          "Compensations should never throw away information: record that a booking was cancelled and why, rather than deleting it, so history and audits stay intact.",
          "The failed step itself is not compensated, because its action did not complete.",
          "The example books a trip where the payment step fails."
        ],
        "example": "Taking off layers of clothing in the reverse order you put them on: jacket first, then sweater, then shirt.",
        "code": "def run_saga(steps):\n    finished = []\n    for step in steps:\n        try:\n            step[\"action\"]()\n            finished.append(step)\n        except Exception as err:\n            for done in reversed(finished):\n                done[\"compensate\"]()\n            return {\"status\": \"SAGA_COMPENSATED\", \"failed_at\": step[\"name\"], \"error\": str(err)}\n    return {\"status\": \"SAGA_COMPLETED\"}\n\nlog = []\ndef fail():\n    raise RuntimeError(\"card declined\")\nsteps = [\n    {\"name\": \"flight\", \"action\": lambda: log.append(\"book flight\"), \"compensate\": lambda: log.append(\"cancel flight\")},\n    {\"name\": \"hotel\", \"action\": lambda: log.append(\"book hotel\"), \"compensate\": lambda: log.append(\"cancel hotel\")},\n    {\"name\": \"payment\", \"action\": fail, \"compensate\": lambda: log.append(\"refund\")},\n]\nprint(run_saga(steps))\nprint(log)",
        "output": "{'status': 'SAGA_COMPENSATED', 'failed_at': 'payment', 'error': 'card declined'}\n['book flight', 'book hotel', 'cancel hotel', 'cancel flight']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Remember each step that finished."
          },
          {
            "line": 8,
            "note": "Undo finished steps, newest first."
          },
          {
            "line": 10,
            "note": "Report where and why it failed."
          }
        ],
        "tryIt": "Make the hotel step fail instead. Which compensations run now?",
        "check": {
          "question": "In which order are compensations run?",
          "options": [
            "Oldest first",
            "Newest first",
            "Random order"
          ],
          "answer": 1,
          "why": "Undoing in reverse respects dependencies between steps."
        }
      },
      {
        "title": "The saga log",
        "say": [
          "A saga may run for seconds or days, and the service running it can crash in the middle. So every step's outcome is written to a durable saga log.",
          "The log can be a table in the orchestrator's database or a stream of events; what matters is that it is durable and written before moving on.",
          "After a restart, the service reads the log: steps that finished are known, and the saga continues forward or compensates backward from there.",
          "Practice 2: format_saga_log(step, status) returns \"[SAGA]: step -> status\". A consistent format makes logs easy to read and search.",
          "Include a saga id in real logs, so the lines for one booking can be pulled together.",
          "The log is also what support staff read when a customer asks \"what happened to my booking?\".",
          "The example prints a readable log for a compensated saga."
        ],
        "example": "A courier's delivery sheet signed at each stop: if the van breaks down, the next driver knows exactly which parcels were delivered and which were not.",
        "code": "def format_saga_log(step, status):\n    return f\"[SAGA]: {step} -> {status}\"\n\nevents = [(\"flight\", \"DONE\"), (\"hotel\", \"DONE\"), (\"payment\", \"FAILED\"), (\"hotel\", \"COMPENSATED\"), (\"flight\", \"COMPENSATED\")]\nfor step, status in events:\n    print(format_saga_log(step, status))\ndone = [s for s, st in events if st == \"DONE\"]\nundone = [s for s, st in events if st == \"COMPENSATED\"]\nprint(\"all finished steps compensated:\", sorted(done) == sorted(undone))",
        "output": "[SAGA]: flight -> DONE\n[SAGA]: hotel -> DONE\n[SAGA]: payment -> FAILED\n[SAGA]: hotel -> COMPENSATED\n[SAGA]: flight -> COMPENSATED\nall finished steps compensated: True",
        "codeNotes": [
          {
            "line": 2,
            "note": "A fixed, searchable format."
          },
          {
            "line": 9,
            "note": "Recovery can check every finished step was undone."
          }
        ],
        "tryIt": "Remove the last event. What should a recovering service do next?",
        "check": {
          "question": "Why must a saga write its progress to a durable log?",
          "options": [
            "To make it faster",
            "So it can continue or compensate correctly after a crash",
            "Logs are required by Python"
          ],
          "answer": 1,
          "why": "The log tells a restarted service which steps completed."
        }
      },
      {
        "title": "Orchestration or choreography",
        "say": [
          "In orchestration, one orchestrator service tells each participant what to do next and handles failures. The whole flow is visible in one place.",
          "The orchestrator itself must be reliable, so it stores its state durably and can resume sagas after a restart.",
          "In choreography, there is no central controller: each service listens for events and publishes its own (\"FlightBooked\" leads the hotel service to book, then \"HotelBooked\" leads payment to charge).",
          "Choreography keeps services loosely coupled, but the overall flow is spread across many services and harder to follow and change.",
          "Orchestration is easier to monitor and debug, and is the usual choice for complex or critical flows. Tools like Temporal and AWS Step Functions help.",
          "Simple flows with two or three steps often work well with choreography.",
          "The example runs the same flow both ways."
        ],
        "example": "An orchestra with a conductor giving every cue, versus a folk dance where each dancer reacts to the others' moves without a leader.",
        "code": "def orchestrator():\n    trail = []\n    for step in [\"book flight\", \"book hotel\", \"charge card\"]:\n        trail.append(f\"orchestrator -> {step}\")\n    return trail\n\nhandlers = {\"TripRequested\": \"FlightBooked\", \"FlightBooked\": \"HotelBooked\", \"HotelBooked\": \"CardCharged\"}\ndef choreography(first_event):\n    trail, event = [], first_event\n    while event in handlers:\n        trail.append(f\"{event} -> {handlers[event]}\")\n        event = handlers[event]\n    return trail\n\nprint(orchestrator())\nprint(choreography(\"TripRequested\"))",
        "output": "['orchestrator -> book flight', 'orchestrator -> book hotel', 'orchestrator -> charge card']\n['TripRequested -> FlightBooked', 'FlightBooked -> HotelBooked', 'HotelBooked -> CardCharged']",
        "codeNotes": [
          {
            "line": 3,
            "note": "One place decides every step."
          },
          {
            "line": 10,
            "note": "Each service reacts to the previous event."
          }
        ],
        "tryIt": "In the choreography, where would you look to find out the full flow? Compare with the orchestrator.",
        "check": {
          "question": "What is a main advantage of orchestration?",
          "options": [
            "No service knows about others",
            "The whole flow is visible and controlled in one place",
            "It needs no code"
          ],
          "answer": 1,
          "why": "A central orchestrator makes the flow easy to understand, monitor and change."
        }
      },
      {
        "title": "Isolation and other pitfalls",
        "say": [
          "Sagas lack isolation: other transactions can see intermediate states. A customer might see a seat as taken for a booking that is later compensated.",
          "A common fix is a semantic lock: mark records as PENDING during the saga, and let other code treat PENDING carefully (for example, not counting it as confirmed).",
          "Compensations can also fail. Retry them with backoff until they succeed, and alert people if they keep failing; a stuck compensation needs human attention.",
          "Because a compensation may be retried many times, write it so that a second run notices the work is already undone and does nothing.",
          "Every action and compensation must be idempotent, because retries and duplicate messages are normal (Days 13 and 14).",
          "Design user-facing messages for the in-between states: \"Booking in progress\" is better than showing a half-finished booking as confirmed.",
          "Tomorrow you will look at the messaging system that often carries saga events: Kafka."
        ],
        "example": "A restaurant table marked \"reserved, awaiting confirmation\": other guests can see it is not free, but the staff know it may still open up.",
        "code": "seats = {\"12A\": \"FREE\"}\n\ndef start_booking(seat):\n    if seats[seat] != \"FREE\":\n        return f\"{seat} not available ({seats[seat]})\"\n    seats[seat] = \"PENDING\"\n    return f\"{seat} held as PENDING\"\n\nprint(start_booking(\"12A\"))\nprint(start_booking(\"12A\"))\nseats[\"12A\"] = \"FREE\"\nprint(\"after compensation:\", seats)",
        "output": "12A held as PENDING\n12A not available (PENDING)\nafter compensation: {'12A': 'FREE'}",
        "codeNotes": [
          {
            "line": 6,
            "note": "A semantic lock: others can see the seat is in progress."
          },
          {
            "line": 11,
            "note": "Compensation releases it."
          }
        ],
        "tryIt": "Add a CONFIRMED state set at the end of a successful saga, and show what a second booking sees.",
        "check": {
          "question": "What is a semantic lock in a saga?",
          "options": [
            "A database table lock",
            "A status like PENDING that tells other code a record is mid-saga",
            "An encrypted field"
          ],
          "answer": 1,
          "why": "The status warns others without holding real locks."
        }
      }
    ],
    "summary": [
      "A saga is a chain of local transactions with compensating actions.",
      "Compensations are semantic undos; put irreversible steps after the pivot.",
      "On failure, compensate finished steps newest first.",
      "Log every step durably so a crashed saga can recover.",
      "Choose orchestration for complex flows; handle isolation with PENDING states."
    ],
    "projectStep": {
      "title": "Sagas",
      "steps": [
        "Add run_saga and format_saga_log to dist_toolkit.py.",
        "Model an order saga with 4 steps and make the third one fail.",
        "Bonus: add a PENDING semantic lock and show what a second order sees."
      ]
    }
  },
  {
    "day": 12,
    "title": "Event-Driven Messaging: Kafka Partitions & Consumer Group Rebalancing",
    "goal": "You can explain topics, partitions and consumer groups, route messages by key to keep per-key order, assign partitions round-robin, follow offsets and rebalancing, and measure consumer lag.",
    "minutes": 30,
    "recap": "Sagas and many other patterns pass events between services. Kafka is the most widely used system for that. Today you learn how it scales while keeping order.",
    "parts": [
      {
        "title": "Events, producers and consumers",
        "say": [
          "In event-driven systems, services publish events (\"OrderPlaced\", \"PaymentFailed\") to a message broker instead of calling each other directly.",
          "Producers write events to a topic; consumers read them. Neither needs to know the other exists, and a slow consumer does not slow the producer.",
          "Events describe facts that happened (\"OrderPlaced\"), in the past tense, rather than commands (\"PlaceOrder\"), which makes it clear they cannot be refused.",
          "Apache Kafka stores events in an append-only log, kept for days or weeks, so consumers can read at their own pace and even replay history.",
          "This decoupling lets new services be added later, for example analytics reading the same order events, with no change to the producer.",
          "The example builds a tiny topic as a list and two consumers reading at different positions.",
          "The rest of the lesson explains how Kafka splits a topic for scale without losing order where it matters."
        ],
        "example": "A notice board in a college corridor: whoever has news pins it up, and anyone interested reads it when they pass, without the writer needing to find each reader.",
        "code": "topic = []\ndef publish(event):\n    topic.append(event)\n\nfor e in [\"OrderPlaced #1\", \"OrderPlaced #2\", \"PaymentDone #1\", \"OrderPlaced #3\"]:\n    publish(e)\npositions = {\"email-service\": 0, \"analytics\": 2}\nfor consumer, pos in positions.items():\n    print(consumer, \"reads\", topic[pos:])",
        "output": "email-service reads ['OrderPlaced #1', 'OrderPlaced #2', 'PaymentDone #1', 'OrderPlaced #3']\nanalytics reads ['PaymentDone #1', 'OrderPlaced #3']",
        "codeNotes": [
          {
            "line": 3,
            "note": "The topic is an append-only log."
          },
          {
            "line": 7,
            "note": "Each consumer keeps its own reading position."
          }
        ],
        "tryIt": "Add a third consumer that starts from the beginning. What does it read?",
        "check": {
          "question": "Why does a slow consumer not slow down the producer in Kafka?",
          "options": [
            "Kafka deletes slow consumers",
            "The producer writes to the log, and each consumer reads at its own pace",
            "Producers wait for all consumers"
          ],
          "answer": 1,
          "why": "The log decouples writing from reading."
        }
      },
      {
        "title": "Partitions and ordering by key",
        "say": [
          "One log on one machine cannot handle huge traffic, so a topic is split into partitions, each an independent ordered log, spread across brokers.",
          "Order is guaranteed only within a partition. So events that must stay in order, such as all events for one order, must go to the same partition.",
          "Choosing the key is a design decision: key by order id to keep each order's events in sequence, or by customer id to keep all of a customer's activity in sequence.",
          "Producers choose the partition by hashing the message key: same key, same partition, same order.",
          "Practice 2: route_to_partition(key, total) uses the hash h = (h x 31 + ord(ch)) mod 2^32 for each character, then returns h % total.",
          "Messages without a key are spread for balance, with no ordering promise.",
          "The example routes events for three orders and shows each order's events staying together."
        ],
        "example": "A bank with several counters, where each customer always goes to the counter assigned by their account number, so their deposits and withdrawals are handled in the order they arrive.",
        "code": "def route_to_partition(key, total):\n    h = 0\n    for ch in key:\n        h = (h * 31 + ord(ch)) % 2 ** 32\n    return h % total\n\nevents = [(\"order-7\", \"placed\"), (\"order-9\", \"placed\"), (\"order-7\", \"paid\"), (\"order-3\", \"placed\"), (\"order-7\", \"shipped\"), (\"order-9\", \"paid\")]\npartitions = {p: [] for p in range(3)}\nfor key, what in events:\n    partitions[route_to_partition(key, 3)].append(f\"{key}:{what}\")\nfor p, items in partitions.items():\n    print(\"partition\", p, items)",
        "output": "partition 0 []\npartition 1 ['order-9:placed', 'order-3:placed', 'order-9:paid']\npartition 2 ['order-7:placed', 'order-7:paid', 'order-7:shipped']",
        "codeNotes": [
          {
            "line": 4,
            "note": "A simple, stable string hash."
          },
          {
            "line": 10,
            "note": "Same key, same partition: order-7's events stay in order."
          }
        ],
        "tryIt": "Change the number of partitions to 4. Do order-7's events still stay together?",
        "check": {
          "question": "How does Kafka keep all events for one order in sequence?",
          "options": [
            "It sorts the whole topic",
            "Events with the same key go to the same partition, which is ordered",
            "It uses one partition per topic"
          ],
          "answer": 1,
          "why": "Per-key partitioning plus per-partition order gives per-key ordering."
        }
      },
      {
        "title": "Consumer groups",
        "say": [
          "To process a busy topic faster, several consumers form a consumer group. Kafka gives each partition to exactly one consumer in the group.",
          "So partitions are the unit of parallelism: a topic with 6 partitions can be processed by up to 6 consumers in one group.",
          "Practice 1: assign_partitions(num_partitions, consumers) assigns partition p to consumers[p % len(consumers)], and returns every consumer with its list (even empty).",
          "Different groups each receive all messages. The email service and the analytics service are separate groups reading the same topic.",
          "This is what makes Kafka good for fan-out: one event can drive emails, analytics, search indexing and fraud checks, each in its own group.",
          "Round-robin is one strategy; Kafka also has range and sticky assignors, which differ in how evenly and how stably they spread partitions.",
          "The example assigns 6 partitions to 4 consumers."
        ],
        "example": "Six checkout counters and four cashiers: each counter is staffed by exactly one cashier, so some cashiers handle two counters.",
        "code": "def assign_partitions(num_partitions, consumers):\n    assignment = {c: [] for c in consumers}\n    for p in range(num_partitions):\n        assignment[consumers[p % len(consumers)]].append(p)\n    return assignment\n\nprint(assign_partitions(6, [\"c1\", \"c2\", \"c3\", \"c4\"]))\nprint(assign_partitions(2, [\"c1\", \"c2\", \"c3\"]))",
        "output": "{'c1': [0, 4], 'c2': [1, 5], 'c3': [2], 'c4': [3]}\n{'c1': [0], 'c2': [1], 'c3': []}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Every consumer appears, even with no partitions."
          },
          {
            "line": 4,
            "note": "Partition p goes to consumer p mod the group size."
          }
        ],
        "tryIt": "Assign 12 partitions to 5 consumers. Is the load balanced?",
        "check": {
          "question": "What happens with 2 partitions and 3 consumers in one group?",
          "options": [
            "All three share both partitions",
            "One consumer sits idle",
            "Kafka creates a third partition"
          ],
          "answer": 1,
          "why": "Each partition goes to one consumer, so the third has nothing to read."
        }
      },
      {
        "title": "Rebalancing",
        "say": [
          "When a consumer joins, leaves or crashes, the group rebalances: partitions are reassigned among the current members.",
          "During a rebalance, consumption pauses briefly. Frequent rebalances, for example from consumers that are too slow to send heartbeats, hurt throughput.",
          "Deploying a new version of a consumer restarts every instance, which can trigger several rebalances in a row; rolling deploys and cooperative assignors reduce the disruption.",
          "Simple strategies can move many partitions even when one consumer leaves. Sticky and cooperative assignors keep as many assignments unchanged as possible.",
          "After a rebalance, a consumer starts reading a partition from the last committed offset, so some messages may be read again (next part).",
          "The example counts how many partitions change owner when a consumer leaves under round-robin.",
          "Keep processing per message short, and heartbeats regular, to avoid unnecessary rebalances."
        ],
        "example": "When a cashier goes on break, the manager reshuffles counters. A good manager moves only that cashier's counters, not everyone's.",
        "code": "def assign(n, consumers):\n    out = {c: [] for c in consumers}\n    for p in range(n):\n        out[consumers[p % len(consumers)]].append(p)\n    return out\n\ndef owner(assignment):\n    return {p: c for c, ps in assignment.items() for p in ps}\n\nbefore = owner(assign(12, [\"c1\", \"c2\", \"c3\", \"c4\"]))\nafter = owner(assign(12, [\"c1\", \"c2\", \"c4\"]))\nmoved = sorted(p for p in before if before[p] != after[p])\nprint(\"c3 owned:\", [p for p, c in before.items() if c == \"c3\"])\nprint(\"partitions that changed owner:\", moved)",
        "output": "c3 owned: [2, 6, 10]\npartitions that changed owner: [2, 3, 4, 5, 6, 7, 8, 9, 10]",
        "codeNotes": [
          {
            "line": 12,
            "note": "Round-robin moves far more than c3's partitions."
          }
        ],
        "tryIt": "How many moves would a perfectly sticky strategy need? (Only c3's partitions.)",
        "check": {
          "question": "What does a sticky assignor try to do during rebalancing?",
          "options": [
            "Move every partition",
            "Keep existing assignments and move as few partitions as possible",
            "Stop consumption forever"
          ],
          "answer": 1,
          "why": "Fewer moves mean less disruption and less re-reading."
        }
      },
      {
        "title": "Offsets and commits",
        "say": [
          "Each message in a partition has an offset, its position number. A consumer group stores, per partition, the offset it has committed: \"we have processed everything before this\".",
          "After a restart or rebalance, reading resumes from the committed offset.",
          "Commit after processing, and a crash between processing and committing means the message is processed again (at-least-once). Commit before processing, and a crash means it is skipped (at-most-once).",
          "Most systems choose commit-after-processing and make processing idempotent, which is tomorrow's topic.",
          "Offsets also allow replay: reset a group's offset to an earlier point to reprocess history after fixing a bug.",
          "Replaying is powerful but must be deliberate: every side effect runs again, so it is only safe when processing is idempotent.",
          "The simulation shows a crash between processing and committing."
        ],
        "example": "A bookmark in a novel: if you fall asleep before moving the bookmark, you reread a few pages the next day, which is annoying but safe.",
        "code": "partition = [\"m0\", \"m1\", \"m2\", \"m3\", \"m4\"]\ncommitted = 0\nprocessed = []\n\ndef consume(crash_before_commit_at=None):\n    global committed\n    for offset in range(committed, len(partition)):\n        processed.append(partition[offset])\n        if offset == crash_before_commit_at:\n            return \"crashed\"\n        committed = offset + 1\n    return \"done\"\n\nprint(consume(crash_before_commit_at=2), \"committed =\", committed)\nprint(consume(), \"committed =\", committed)\nprint(\"processed:\", processed, \"<- m2 twice\")",
        "output": "crashed committed = 2\ndone committed = 5\nprocessed: ['m0', 'm1', 'm2', 'm2', 'm3', 'm4'] <- m2 twice",
        "codeNotes": [
          {
            "line": 8,
            "note": "Process the message first..."
          },
          {
            "line": 11,
            "note": "...then commit the next offset."
          },
          {
            "line": 16,
            "note": "The crash before commit causes a re-read."
          }
        ],
        "tryIt": "Move the commit line before processing. What happens to m2 after the crash now?",
        "check": {
          "question": "Committing offsets after processing gives which guarantee?",
          "options": [
            "At-most-once",
            "At-least-once",
            "Never-once"
          ],
          "answer": 1,
          "why": "A crash before the commit causes redelivery, so each message is processed at least once."
        }
      },
      {
        "title": "Consumer lag and scaling",
        "say": [
          "Consumer lag is the latest offset in a partition minus the group's committed offset: how many messages are waiting.",
          "Rising lag means consumers cannot keep up. Add consumers (up to the number of partitions), make processing faster, or add partitions.",
          "You cannot scale a group beyond its partition count, so choose enough partitions up front; adding them later changes key-to-partition mapping.",
          "Hot keys cause uneven lag: if one customer produces most events, their partition lags while others are idle.",
          "One fix is splitting a hot key, for example adding a suffix to spread one big customer's events across several partitions when their order does not matter.",
          "Monitor lag per partition and alert when it grows for several minutes.",
          "Tomorrow: making sure each message has its effect exactly once, even though it may be delivered twice."
        ],
        "example": "The queue at each checkout counter: if one queue keeps growing, you either open more counters or make that cashier faster.",
        "code": "latest = {0: 1500, 1: 1480, 2: 9200, 3: 1510}\ncommitted = {0: 1490, 1: 1480, 2: 3100, 3: 1500}\nfor p in latest:\n    lag = latest[p] - committed[p]\n    flag = \"  <- hot partition\" if lag > 1000 else \"\"\n    print(f\"partition {p}: lag {lag}{flag}\")\nprint(\"total lag:\", sum(latest[p] - committed[p] for p in latest))",
        "output": "partition 0: lag 10\npartition 1: lag 0\npartition 2: lag 6100  <- hot partition\npartition 3: lag 10\ntotal lag: 6120",
        "codeNotes": [
          {
            "line": 4,
            "note": "Waiting messages = newest offset minus committed offset."
          }
        ],
        "tryIt": "If partition 2 is hot because of one big customer, would adding consumers help? Why or why not?",
        "check": {
          "question": "Why can a consumer group not use more consumers than partitions?",
          "options": [
            "Kafka limits groups to 4",
            "Each partition goes to only one consumer in a group",
            "Consumers share offsets"
          ],
          "answer": 1,
          "why": "Extra consumers beyond the partition count have nothing assigned."
        }
      }
    ],
    "summary": [
      "Topics are append-only logs; producers and consumers are decoupled.",
      "Partitions give scale; order holds only within a partition, so route by key.",
      "Each partition goes to one consumer per group; groups each see every message.",
      "Rebalancing reassigns partitions; sticky strategies move fewer.",
      "Commit offsets after processing (at-least-once) and watch lag."
    ],
    "projectStep": {
      "title": "Kafka concepts",
      "steps": [
        "Add assign_partitions and route_to_partition to dist_toolkit.py.",
        "Route 20 events with 5 keys into 4 partitions and check per-key order.",
        "Bonus: compute lag per partition from two dicts of offsets."
      ]
    }
  },
  {
    "day": 13,
    "title": "Message Delivery Guarantees: At-Least-Once, At-Most-Once & Exactly-Once Idempotency",
    "goal": "You can explain at-most-once, at-least-once and exactly-once delivery, make message processing idempotent with a dedupe store, use idempotency keys safely, and design operations that are naturally repeatable.",
    "minutes": 30,
    "recap": "Yesterday you saw that committing after processing can deliver a message twice. Today you make duplicates harmless, the key to reliable messaging.",
    "parts": [
      {
        "title": "Three delivery guarantees",
        "say": [
          "At-most-once: a message is delivered zero or one times. Fast and simple, but messages can be lost. Fine for metrics you can afford to drop.",
          "At-least-once: every message is delivered, possibly more than once. The common default; the receiver must handle duplicates.",
          "Most real systems choose it because losing a payment or an order is far worse than processing a duplicate that you can detect.",
          "Exactly-once: each message has its effect exactly once. True exactly-once delivery over an unreliable network is impossible in general, but exactly-once processing is achievable with idempotency.",
          "Duplicates come from retries after lost acknowledgements, consumer crashes before committing, and producers resending after timeouts.",
          "The simulation shows a producer retrying after a lost acknowledgement and the broker receiving the message twice.",
          "The rest of the lesson is about making the receiver's effect happen once, whatever arrives."
        ],
        "example": "Sending a registered letter: if the receipt is lost in the post, you send another copy, and the recipient ends up with two identical letters.",
        "code": "broker = []\nacks_lost = {1}\n\ndef send(msg, attempt):\n    broker.append(msg)\n    return attempt not in acks_lost\n\nfor attempt in range(1, 4):\n    if send(\"pay order-7 Rs 500\", attempt):\n        break\n    print(f\"attempt {attempt}: no ack, retrying\")\nprint(\"broker received:\", broker)",
        "output": "attempt 1: no ack, retrying\nbroker received: ['pay order-7 Rs 500', 'pay order-7 Rs 500']",
        "codeNotes": [
          {
            "line": 5,
            "note": "The message arrives..."
          },
          {
            "line": 6,
            "note": "...but the acknowledgement can be lost, so the sender retries."
          }
        ],
        "tryIt": "Make acks_lost = {1, 2}. How many copies does the broker hold?",
        "check": {
          "question": "Which guarantee is the common default in messaging systems?",
          "options": [
            "At-most-once",
            "At-least-once",
            "Exactly-once delivery"
          ],
          "answer": 1,
          "why": "At-least-once never loses messages, and duplicates are handled by the receiver."
        }
      },
      {
        "title": "Why duplicates hurt",
        "say": [
          "Some operations are harmless to repeat: setting a user's email to the same value twice changes nothing. These are idempotent.",
          "Others are not: \"add Rs 500 to the balance\" twice adds Rs 1000. \"Send the order confirmation\" twice sends two emails.",
          "With at-least-once delivery, every non-idempotent operation is a bug waiting for a duplicate.",
          "There are two fixes: make the operation naturally idempotent, or remember which messages were already processed and skip repeats.",
          "The first fix is better when possible, because it needs no extra storage and no cleanup.",
          "The example applies the same \"credit\" message twice with and without protection.",
          "Always ask of any message handler: what happens if this runs twice?"
        ],
        "example": "Pressing a lift button twice does no harm, but pressing \"order\" twice in a food app may bring two meals.",
        "code": "balance = {\"asha\": 1000}\n\ndef credit(amount):\n    balance[\"asha\"] += amount\n\ndef set_email(profile, email):\n    profile[\"email\"] = email\n\nfor _ in range(2):\n    credit(500)\nprint(\"after a duplicate credit:\", balance, \"<- wrong\")\nprofile = {}\nfor _ in range(2):\n    set_email(profile, \"asha@example.com\")\nprint(\"after a duplicate set:\", profile, \"<- fine\")",
        "output": "after a duplicate credit: {'asha': 2000} <- wrong\nafter a duplicate set: {'email': 'asha@example.com'} <- fine",
        "codeNotes": [
          {
            "line": 4,
            "note": "Not idempotent: each repeat adds again."
          },
          {
            "line": 7,
            "note": "Idempotent: repeating gives the same result."
          }
        ],
        "tryIt": "Rewrite credit so it takes the new balance (\"set balance to 1500\") instead of an amount. Is it idempotent now? What new problem appears?",
        "check": {
          "question": "Which operation is idempotent?",
          "options": [
            "Add 1 to a counter",
            "Set an order's status to SHIPPED",
            "Send a welcome email"
          ],
          "answer": 1,
          "why": "Setting a value to the same thing twice has the same effect as once."
        }
      },
      {
        "title": "Processing each message once",
        "say": [
          "Practice 1: process_once(message_id, payload_hash, store, handler). The first time an id is seen, run the handler, save the hash and the result in the store, and return duplicate False with the result.",
          "If the id was seen before and the hash matches, return duplicate True with the saved result, without running the handler again.",
          "If the id was seen with a different hash, return PAYLOAD_MISMATCH: someone reused an id for different content, which is a bug or an attack.",
          "Returning the saved result means the caller gets the same answer on a retry, which is important for APIs.",
          "In production the store is a database table with the message id as a unique key, often with an expiry after a few days.",
          "The payload hash is usually a hash such as SHA-256 of the message body, which is short to store and compare.",
          "The example processes one payment message three times."
        ],
        "example": "A ticket inspector who punches each ticket: a ticket shown again is recognised immediately, and a ticket with the same number but different details is flagged as fake.",
        "code": "def process_once(message_id, payload_hash, store, handler):\n    seen = store.get(message_id)\n    if seen:\n        if seen[\"hash\"] != payload_hash:\n            return {\"duplicate\": True, \"error\": \"PAYLOAD_MISMATCH\"}\n        return {\"duplicate\": True, \"result\": seen[\"result\"]}\n    result = handler()\n    store[message_id] = {\"hash\": payload_hash, \"result\": result}\n    return {\"duplicate\": False, \"result\": result}\n\nstore, charges = {}, []\ncharge = lambda: charges.append(500) or f\"charged, total {sum(charges)}\"\nprint(process_once(\"msg-1\", \"h-abc\", store, charge))\nprint(process_once(\"msg-1\", \"h-abc\", store, charge))\nprint(process_once(\"msg-1\", \"h-xyz\", store, charge))\nprint(\"charges made:\", charges)",
        "output": "{'duplicate': False, 'result': 'charged, total 500'}\n{'duplicate': True, 'result': 'charged, total 500'}\n{'duplicate': True, 'error': 'PAYLOAD_MISMATCH'}\ncharges made: [500]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Same id, different content: refuse."
          },
          {
            "line": 6,
            "note": "A true duplicate: return the saved result, do not run again."
          },
          {
            "line": 8,
            "note": "Remember the result for future repeats."
          }
        ],
        "tryIt": "Process \"msg-2\" with a new hash. How many charges are there now?",
        "check": {
          "question": "What should happen when a known message id arrives with a different payload?",
          "options": [
            "Process it again",
            "Return an error such as PAYLOAD_MISMATCH",
            "Overwrite the saved result"
          ],
          "answer": 1,
          "why": "Reusing an id for different content is a bug or attack and must not be processed silently."
        }
      },
      {
        "title": "Idempotency keys in APIs",
        "say": [
          "Payment APIs such as Stripe accept an Idempotency-Key header. The client creates a unique key per logical operation and resends the same key on retries.",
          "Practice 2: idempotency_key(user_id, order_id) returns \"idemp_USER_ORDER\". Deriving the key from the business operation guarantees retries reuse it.",
          "A random key per attempt would defeat the purpose: each retry would look like a new operation.",
          "Clients should create the key once, before the first attempt, and keep it with the pending operation so a crash and restart still reuses it.",
          "The server stores the key with the request's hash and response, exactly like process_once, and returns the stored response for repeats.",
          "Keep keys for long enough to cover realistic retries, typically 24 hours or more.",
          "The example shows a client retrying a payment call with the same key."
        ],
        "example": "Writing a reference number on a cheque: if the bank sees the same reference twice, it knows it is the same cheque, not a second payment.",
        "code": "def idempotency_key(user_id, order_id):\n    return f\"idemp_{user_id}_{order_id}\"\n\nserver_store = {}\ndef pay(key, amount):\n    if key in server_store:\n        return server_store[key] + \" (replayed)\"\n    server_store[key] = f\"paid Rs {amount}\"\n    return server_store[key]\n\nkey = idempotency_key(\"u42\", \"order-7\")\nprint(key)\nprint(pay(key, 500))\nprint(pay(key, 500))\nprint(pay(idempotency_key(\"u42\", \"order-8\"), 300))",
        "output": "idemp_u42_order-7\npaid Rs 500\npaid Rs 500 (replayed)\npaid Rs 300",
        "codeNotes": [
          {
            "line": 2,
            "note": "The key comes from the business operation, not from the attempt."
          },
          {
            "line": 7,
            "note": "A retry gets the original response."
          }
        ],
        "tryIt": "What would go wrong if the client generated a new random key on each retry?",
        "check": {
          "question": "Why derive the idempotency key from the user and order?",
          "options": [
            "It is shorter",
            "So every retry of the same operation carries the same key",
            "Keys must contain user ids"
          ],
          "answer": 1,
          "why": "The same logical operation must always produce the same key."
        }
      },
      {
        "title": "Exactly-once processing in practice",
        "say": [
          "The dedupe store and the business change must be updated together. If you save the result but crash before recording the message id, the next delivery repeats the work.",
          "The cleanest fix is one database transaction that writes both the business change and the processed-message record.",
          "This is why keeping the dedupe table in the same database as the business data is so useful: one transaction covers both.",
          "Kafka offers transactions that commit output messages and consumer offsets atomically, giving exactly-once processing within Kafka pipelines.",
          "When the side effect is outside your database (an email, a payment provider), pass an idempotency key to that provider so it deduplicates too.",
          "Exactly-once is always \"exactly-once effect\": delivery may repeat; the effect does not.",
          "The code updates a balance and the processed set in one step, standing in for a transaction."
        ],
        "example": "A shopkeeper who writes the sale in the ledger and stamps the receipt as paid in the same moment, so there is never a paid receipt without a ledger entry or the reverse.",
        "code": "db = {\"balance\": 1000, \"processed\": set()}\n\ndef apply_credit(message_id, amount):\n    if message_id in db[\"processed\"]:\n        return \"skipped duplicate\"\n    new_state = {\"balance\": db[\"balance\"] + amount, \"processed\": db[\"processed\"] | {message_id}}\n    db.update(new_state)\n    return f\"credited, balance {db['balance']}\"\n\nfor mid in [\"m1\", \"m1\", \"m2\", \"m1\"]:\n    print(mid, \"->\", apply_credit(mid, 500))",
        "output": "m1 -> credited, balance 1500\nm1 -> skipped duplicate\nm2 -> credited, balance 2000\nm1 -> skipped duplicate",
        "codeNotes": [
          {
            "line": 6,
            "note": "Compute the change and the processed record together..."
          },
          {
            "line": 7,
            "note": "...and apply them in one step, like a transaction."
          }
        ],
        "tryIt": "Split line 7 into two separate updates and imagine a crash between them. What could go wrong?",
        "check": {
          "question": "What does \"exactly-once\" usually mean in practice?",
          "options": [
            "The network never duplicates messages",
            "Each message's effect happens once, even if it is delivered more than once",
            "Messages are never retried"
          ],
          "answer": 1,
          "why": "Delivery can repeat; idempotent processing makes the effect happen once."
        }
      },
      {
        "title": "Designing naturally idempotent operations",
        "say": [
          "Prefer operations that are safe by design. \"Set status to PAID\" is idempotent; \"toggle status\" is not.",
          "Use upserts (insert or update by a unique key) instead of plain inserts, so a repeated create does not add a second row.",
          "Use conditional updates with versions (Day 6's compare-and-set) so an old retry cannot overwrite newer data.",
          "Use natural unique keys, such as order id plus line number, so the database rejects duplicates by itself.",
          "A unique constraint in the database is the final safety net: even if two consumers race, only one insert can succeed.",
          "Where an operation must add (a counter, a balance), attach the message id and deduplicate as in part 3.",
          "Tomorrow: what to do with messages that fail every time, the poison pills."
        ],
        "example": "A school register where each student is marked present by roll number: marking the same roll number twice still counts one student.",
        "code": "orders = {}\n\ndef upsert_order(order_id, status):\n    orders[order_id] = {\"status\": status}\n\ndef insert_order(rows, order_id, status):\n    rows.append({\"order_id\": order_id, \"status\": status})\n\nrows = []\nfor _ in range(2):\n    upsert_order(\"order-7\", \"PLACED\")\n    insert_order(rows, \"order-7\", \"PLACED\")\nprint(\"upsert:\", orders)\nprint(\"plain insert:\", rows, \"<- duplicate row\")",
        "output": "upsert: {'order-7': {'status': 'PLACED'}}\nplain insert: [{'order_id': 'order-7', 'status': 'PLACED'}, {'order_id': 'order-7', 'status': 'PLACED'}] <- duplicate row",
        "codeNotes": [
          {
            "line": 4,
            "note": "Keyed by order id: repeats overwrite, not duplicate."
          },
          {
            "line": 7,
            "note": "A plain append creates a second row."
          }
        ],
        "tryIt": "Make insert_order skip the append if a row with that order_id already exists. Which pattern is that?",
        "check": {
          "question": "Why is an upsert safer than an insert with at-least-once delivery?",
          "options": [
            "Upserts are faster",
            "A repeated upsert updates the same row instead of creating a duplicate",
            "Inserts cannot fail"
          ],
          "answer": 1,
          "why": "Keyed writes turn duplicates into harmless overwrites."
        }
      }
    ],
    "summary": [
      "At-most-once can lose messages; at-least-once can duplicate them.",
      "Exactly-once means exactly-once effect, achieved with idempotency.",
      "A dedupe store saves each message id, payload hash and result.",
      "Idempotency keys come from the business operation, reused on retries.",
      "Prefer set, upsert and conditional updates over add, toggle and insert."
    ],
    "projectStep": {
      "title": "Idempotency",
      "steps": [
        "Add process_once and idempotency_key to dist_toolkit.py.",
        "Deliver the same 3 messages twice each and prove each effect happens once.",
        "Bonus: detect a reused id with a different payload."
      ]
    }
  },
  {
    "day": 14,
    "title": "Dead Letter Queues (DLQ), Exponential Backoff & Poison Pill Handling",
    "goal": "You can recognise poison-pill messages, separate temporary from permanent errors, retry with limits, route failing messages to a dead letter queue with useful details, and redrive them after a fix.",
    "minutes": 30,
    "recap": "Yesterday you made duplicate messages harmless. Today you handle the opposite problem: messages that fail every time they are processed.",
    "parts": [
      {
        "title": "The poison pill",
        "say": [
          "A poison pill is a message that makes the consumer fail every time: malformed data, an unexpected field, or a bug triggered by one rare case.",
          "Poison pills often appear after a producer changes its message format without telling consumers, which is why schema checks (Day 3) matter.",
          "With at-least-once delivery, the consumer does not commit the failed message, so it is delivered again, fails again, and so on forever.",
          "Because partitions are ordered, every message behind it waits. One bad message can stop a whole partition.",
          "The consumer needs a way to stop retrying, set the message aside, and move on.",
          "The simulation shows a consumer stuck on a malformed message.",
          "Handling poison pills well is one of the main differences between a demo consumer and a production one."
        ],
        "example": "A jammed ticket in a car-park barrier: every car behind it waits until someone removes the bad ticket by hand.",
        "code": "import json\n\nqueue = ['{\"order\": 1}', \"{broken json\", '{\"order\": 3}']\nattempts = 0\nposition = 0\nwhile position < len(queue) and attempts < 5:\n    try:\n        print(\"processed\", json.loads(queue[position]))\n        position += 1\n    except json.JSONDecodeError:\n        attempts += 1\n        print(f\"failed on message {position}, attempt {attempts}\")\nprint(\"messages behind it still waiting:\", queue[position + 1:])",
        "output": "processed {'order': 1}\nfailed on message 1, attempt 1\nfailed on message 1, attempt 2\nfailed on message 1, attempt 3\nfailed on message 1, attempt 4\nfailed on message 1, attempt 5\nmessages behind it still waiting: ['{\"order\": 3}']",
        "codeNotes": [
          {
            "line": 10,
            "note": "The same bad message fails again and again."
          },
          {
            "line": 13,
            "note": "Everything behind the poison pill is stuck."
          }
        ],
        "tryIt": "Put the broken message last. How does that change the harm it does?",
        "check": {
          "question": "Why is a poison pill so harmful in an ordered partition?",
          "options": [
            "It deletes other messages",
            "Messages behind it cannot be processed while it keeps failing",
            "It slows the producer"
          ],
          "answer": 1,
          "why": "Ordered processing means the failing message blocks the rest."
        }
      },
      {
        "title": "Temporary or permanent?",
        "say": [
          "Errors fall into two groups. Temporary (transient) errors may succeed on retry: timeouts, a database restarting, a rate limit.",
          "Permanent errors will fail every time: invalid data, a missing required field, a business rule violation.",
          "Retry temporary errors with backoff (Day 1). Send permanent errors straight to the dead letter queue; retrying them wastes time.",
          "A retry limit applies even to temporary errors: after enough attempts, a \"temporary\" problem should be treated as something a person needs to see.",
          "Classify by exception type or error code, and default to \"temporary\" only for errors you know are temporary.",
          "The classification belongs in one function so every consumer handles errors the same way.",
          "The example classifies a few common errors."
        ],
        "example": "A delivery that fails because the customer was out (try again tomorrow) versus one that fails because the address does not exist (no point trying again).",
        "code": "TRANSIENT = (TimeoutError, ConnectionError)\n\ndef classify(error):\n    return \"retry with backoff\" if isinstance(error, TRANSIENT) else \"send to DLQ\"\n\nerrors = [TimeoutError(\"db slow\"), ValueError(\"amount is negative\"), ConnectionError(\"reset\"), KeyError(\"customer_id\")]\nfor err in errors:\n    print(f\"{type(err).__name__:16} {str(err):22} -> {classify(err)}\")",
        "output": "TimeoutError     db slow                -> retry with backoff\nValueError       amount is negative     -> send to DLQ\nConnectionError  reset                  -> retry with backoff\nKeyError         'customer_id'          -> send to DLQ",
        "codeNotes": [
          {
            "line": 1,
            "note": "Only errors known to be temporary are retried."
          },
          {
            "line": 4,
            "note": "Everything else goes aside for a person to look at."
          }
        ],
        "tryIt": "Add a custom RateLimitError class and make it count as transient.",
        "check": {
          "question": "What should happen to a message that fails with \"amount is negative\"?",
          "options": [
            "Retry it forever",
            "Send it to the dead letter queue",
            "Delete it silently"
          ],
          "answer": 1,
          "why": "Invalid data will fail every time, so it should be set aside for investigation."
        }
      },
      {
        "title": "Retry, then dead-letter",
        "say": [
          "Practice 1: handle_message(msg, handler, dlq, max_attempts). Call the handler on the payload; on success return PROCESSED with the result.",
          "On an exception, add 1 to msg[\"retry_count\"]. If it has reached max_attempts, append the message and error to the DLQ and return ROUTED_TO_DLQ; otherwise return RETRY_SCHEDULED with the next attempt number.",
          "Storing the retry count on the message means the count survives redelivery to another consumer.",
          "In Kafka, retries are often done by re-publishing the message to a retry topic with an updated count in a header.",
          "A dead letter queue (DLQ) is simply another topic or queue for failed messages, so the main flow continues.",
          "The example runs one message that succeeds on its second try and one that never succeeds.",
          "Once a message is in the DLQ, the consumer moves on to the next one: the partition is unblocked."
        ],
        "example": "A post office that tries to deliver a parcel three times, and then sends it to the returns office instead of blocking the van forever.",
        "code": "def handle_message(msg, handler, dlq, max_attempts=3):\n    try:\n        return {\"status\": \"PROCESSED\", \"result\": handler(msg[\"payload\"])}\n    except Exception as err:\n        msg[\"retry_count\"] += 1\n        if msg[\"retry_count\"] >= max_attempts:\n            dlq.append({\"message\": msg, \"error\": str(err)})\n            return {\"status\": \"ROUTED_TO_DLQ\"}\n        return {\"status\": \"RETRY_SCHEDULED\", \"attempt\": msg[\"retry_count\"] + 1}\n\nflaky_calls = iter([TimeoutError(\"slow\"), \"ok\"])\ndef flaky(payload):\n    r = next(flaky_calls)\n    if isinstance(r, Exception):\n        raise r\n    return r\ndef broken(payload):\n    raise ValueError(\"missing customer_id\")\n\ndlq = []\nm1, m2 = {\"id\": 1, \"payload\": {}, \"retry_count\": 0}, {\"id\": 2, \"payload\": {}, \"retry_count\": 0}\nprint(handle_message(m1, flaky, dlq), handle_message(m1, flaky, dlq))\nprint([handle_message(m2, broken, dlq)[\"status\"] for _ in range(3)])\nprint(\"DLQ:\", dlq)",
        "output": "{'status': 'RETRY_SCHEDULED', 'attempt': 2} {'status': 'PROCESSED', 'result': 'ok'}\n['RETRY_SCHEDULED', 'RETRY_SCHEDULED', 'ROUTED_TO_DLQ']\nDLQ: [{'message': {'id': 2, 'payload': {}, 'retry_count': 3}, 'error': 'missing customer_id'}]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Count the failure on the message itself."
          },
          {
            "line": 7,
            "note": "Out of attempts: set the message aside."
          },
          {
            "line": 9,
            "note": "Otherwise schedule another try."
          }
        ],
        "tryIt": "Change max_attempts to 5. How many times does message 2 fail before reaching the DLQ?",
        "check": {
          "question": "What does routing a message to the DLQ achieve?",
          "options": [
            "It fixes the message",
            "The failing message is set aside so the rest of the queue can continue",
            "It deletes the message forever"
          ],
          "answer": 1,
          "why": "The DLQ unblocks processing while keeping the failed message for later."
        }
      },
      {
        "title": "What to store in the DLQ",
        "say": [
          "A DLQ entry must contain everything needed to understand and replay the failure: the original message, the error text, and when it failed.",
          "Keep the original message bytes unchanged, so a redrive sends exactly what the producer sent, not a modified copy.",
          "Practice 2: dlq_entry(msg_id, error, now) returns {\"msg_id\", \"error\", \"failed_at\"}.",
          "Useful extras: the consumer name and version, the retry count, the source topic, partition and offset, and a stack trace.",
          "Never store secrets or unmasked personal data in DLQ entries longer than needed; DLQs are read by many people during incidents.",
          "Group DLQ entries by error message to see patterns: 500 entries with the same KeyError point to one bug.",
          "The example groups a small DLQ by error."
        ],
        "example": "A lost-and-found office that labels every item with where and when it was found, so its owner can be traced.",
        "code": "from collections import Counter\n\ndef dlq_entry(msg_id, error, now):\n    return {\"msg_id\": msg_id, \"error\": error, \"failed_at\": now}\n\ndlq = [dlq_entry(1, \"KeyError: customer_id\", 1000), dlq_entry(2, \"ValueError: negative amount\", 1010),\n       dlq_entry(3, \"KeyError: customer_id\", 1020), dlq_entry(4, \"KeyError: customer_id\", 1030)]\nprint(dlq[0])\nfor error, count in Counter(e[\"error\"] for e in dlq).most_common():\n    print(f\"{count} x {error}\")",
        "output": "{'msg_id': 1, 'error': 'KeyError: customer_id', 'failed_at': 1000}\n3 x KeyError: customer_id\n1 x ValueError: negative amount",
        "codeNotes": [
          {
            "line": 4,
            "note": "Id, error and time: the minimum for investigation."
          },
          {
            "line": 9,
            "note": "Grouping by error reveals the main bug."
          }
        ],
        "tryIt": "Add \"consumer\": \"billing-v2\" to each entry. How would that help after a deploy?",
        "check": {
          "question": "Why group DLQ entries by error message?",
          "options": [
            "To delete them faster",
            "Many entries with the same error usually point to one bug to fix",
            "DLQs require grouping"
          ],
          "answer": 1,
          "why": "Patterns show which fix will clear the most failures."
        }
      },
      {
        "title": "Redrive and retry topics",
        "say": [
          "After fixing the bug or the data, messages in the DLQ are redriven: sent back to the main topic (or straight to the fixed consumer) to be processed again.",
          "Sometimes the right action is to discard a message, for example a test event sent to production by mistake. Record that decision too.",
          "Because processing is idempotent (Day 13), redriving a message that partly succeeded before is safe.",
          "Some systems use retry topics with delays, such as retry-10s, retry-1m and retry-10m, before the final DLQ. The main partition never waits for backoff.",
          "Redrive in small batches and watch the error rate, so a fix that is not quite right does not flood the DLQ again.",
          "Record who redrove what and when; it is part of the operational history.",
          "The example redrives only the entries whose error has been fixed."
        ],
        "example": "Returned parcels are re-sent once the correct address has been found, a few at a time, checking that the first ones arrive.",
        "code": "dlq = [{\"id\": 1, \"error\": \"KeyError: customer_id\"}, {\"id\": 2, \"error\": \"ValueError: negative amount\"}, {\"id\": 3, \"error\": \"KeyError: customer_id\"}]\nfixed_errors = {\"KeyError: customer_id\"}\nmain_topic = []\n\nremaining = []\nfor entry in dlq:\n    (main_topic if entry[\"error\"] in fixed_errors else remaining).append(entry)\nprint(\"redriven:\", [e[\"id\"] for e in main_topic])\nprint(\"still in DLQ:\", [e[\"id\"] for e in remaining])",
        "output": "redriven: [1, 3]\nstill in DLQ: [2]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Only messages whose cause has been fixed go back."
          }
        ],
        "tryIt": "Add a batch limit so at most one message is redriven per run.",
        "check": {
          "question": "Why is redriving DLQ messages safe only with idempotent processing?",
          "options": [
            "DLQs change message ids",
            "A redriven message may have partly succeeded before, so repeats must be harmless",
            "Redrive deletes the original"
          ],
          "answer": 1,
          "why": "Idempotency ensures a second attempt does not double any effect."
        }
      },
      {
        "title": "Monitoring and ordering concerns",
        "say": [
          "Alert when the DLQ grows, and review it daily. A DLQ nobody watches is just a place where data goes to be forgotten.",
          "Give each DLQ an owner team, so someone is clearly responsible for looking at it.",
          "Track the ratio of dead-lettered to processed messages per consumer; a sudden rise usually follows a deploy or an upstream change.",
          "Skipping a message breaks ordering: later messages for the same key are processed before the failed one. For some data (account balances), you may need to pause that key instead.",
          "A common approach is to park later messages for the same key until the failed one is resolved.",
          "Tomorrow's milestone combines idempotency, sagas and the DLQ into one transaction engine.",
          "The code shows a simple check for \"later messages of the same key\" when one fails."
        ],
        "example": "If one instalment payment bounces, a bank does not process the next month's instalment for the same loan as if nothing happened; it holds that loan until the problem is solved.",
        "code": "stream = [(\"acct-1\", \"deposit 100\"), (\"acct-2\", \"deposit 50\"), (\"acct-1\", \"withdraw 80\"), (\"acct-2\", \"withdraw 20\")]\nfailed_keys = set()\nfor key, op in stream:\n    if key in failed_keys:\n        print(f\"parked: {key} {op} (waiting for an earlier failure)\")\n        continue\n    if op == \"deposit 100\":\n        failed_keys.add(key)\n        print(f\"FAILED: {key} {op} -> DLQ\")\n        continue\n    print(f\"ok: {key} {op}\")",
        "output": "FAILED: acct-1 deposit 100 -> DLQ\nok: acct-2 deposit 50\nparked: acct-1 withdraw 80 (waiting for an earlier failure)\nok: acct-2 withdraw 20",
        "codeNotes": [
          {
            "line": 4,
            "note": "Hold later messages for a key that has a failed message."
          },
          {
            "line": 8,
            "note": "Simulate the first message failing."
          }
        ],
        "tryIt": "What would have happened to acct-1's balance if the withdraw had been processed without the deposit?",
        "check": {
          "question": "Why might you park later messages for a key after one of its messages fails?",
          "options": [
            "To save memory",
            "Processing them out of order could give wrong results, such as a withdrawal before its deposit",
            "DLQs require it"
          ],
          "answer": 1,
          "why": "Per-key order matters for data like balances."
        }
      }
    ],
    "summary": [
      "A poison pill fails every time and can block a whole partition.",
      "Retry temporary errors with backoff; dead-letter permanent ones.",
      "Count attempts on the message and route to the DLQ after the limit.",
      "Store id, error and time in DLQ entries; group them to find bugs.",
      "Redrive after fixes in small batches; watch the DLQ and per-key order."
    ],
    "projectStep": {
      "title": "Dead letter queues",
      "steps": [
        "Add handle_message and dlq_entry to dist_toolkit.py.",
        "Process 5 messages where one always fails, and show it lands in the DLQ.",
        "Bonus: redrive only the DLQ entries whose error you have marked as fixed."
      ]
    }
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys",
    "goal": "You can build an event-driven transaction engine that drops duplicate events, runs saga steps with compensation, sends failures to a DLQ, measures duration, and publishes events reliably with an outbox.",
    "minutes": 30,
    "recap": "This week covered 2PC, sagas, Kafka, delivery guarantees and dead letter queues. Milestone 2 combines them into one resilient transaction engine.",
    "parts": [
      {
        "title": "The engine's flow",
        "say": [
          "An event arrives, such as \"place order 7 for Asha\", carrying an idempotency key.",
          "Step 1: if the key was already processed, drop the event as a duplicate (Day 13).",
          "Step 2: run the saga steps, such as reserve stock, charge payment, create shipment (Day 11).",
          "Each step talks to a different service, so each can fail independently, which is exactly why compensation is needed.",
          "Step 3: if a step fails, compensate the finished steps newest first and send the event to the DLQ with the error (Day 14).",
          "Step 4: on success, record the key as COMMITTED so repeats are dropped.",
          "Each part of this flow is small and already familiar; the milestone is in joining them carefully."
        ],
        "example": "A hotel front desk: check whether the guest already checked in, then assign a room, take the deposit and issue a key; if the card fails, release the room, and note the problem for the manager.",
        "code": "flow = [\n    (\"dedupe\", \"Day 13: drop events whose key is already committed\"),\n    (\"saga steps\", \"Day 11: run each step in order\"),\n    (\"compensate\", \"Day 11: undo finished steps newest first\"),\n    (\"dead letter\", \"Day 14: park the failed event with its error\"),\n    (\"commit key\", \"Day 13: remember the key as COMMITTED\"),\n]\nfor stage, source in flow:\n    print(f\"{stage:12} {source}\")",
        "output": "dedupe       Day 13: drop events whose key is already committed\nsaga steps   Day 11: run each step in order\ncompensate   Day 11: undo finished steps newest first\ndead letter  Day 14: park the failed event with its error\ncommit key   Day 13: remember the key as COMMITTED",
        "codeNotes": [
          {
            "line": 2,
            "note": "Duplicates are stopped before any work happens."
          }
        ],
        "tryIt": "Where in this flow would you add metrics for duration? Where for failure counts?",
        "check": {
          "question": "Why is the duplicate check done first?",
          "options": [
            "It is the slowest step",
            "So a repeated event never runs any saga step",
            "Duplicates must be compensated"
          ],
          "answer": 1,
          "why": "Checking first guarantees no side effects for repeats."
        }
      },
      {
        "title": "Dropping duplicates",
        "say": [
          "The store maps idempotency keys to their final state. A key present in the store means the event has already been fully handled.",
          "Return DUPLICATE_DROPPED straight away, without running any step. This is cheap and completely safe.",
          "Only record the key after success. If you recorded it before the saga and the saga failed, a corrected retry would be wrongly dropped.",
          "If two copies of the same event arrive at the same moment, the unique key in the store ensures only one of them can record COMMITTED; the other must re-check and stop.",
          "For failed events, the key stays unrecorded, so a redrive from the DLQ after a fix can process it.",
          "Real stores are database tables with the key as a unique column, which also protects against two consumers racing.",
          "The example sends the same event twice."
        ],
        "example": "A guest list at the door: once a name is ticked as arrived, the same name coming again is politely turned away.",
        "code": "store = {}\n\ndef receive(event):\n    if event[\"key\"] in store:\n        return {\"status\": \"DUPLICATE_DROPPED\"}\n    store[event[\"key\"]] = \"COMMITTED\"\n    return {\"status\": \"COMMITTED\"}\n\nevent = {\"key\": \"idemp_u42_order-7\", \"amount\": 500}\nprint(receive(event))\nprint(receive(event))",
        "output": "{'status': 'COMMITTED'}\n{'status': 'DUPLICATE_DROPPED'}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Already handled: do nothing."
          },
          {
            "line": 6,
            "note": "Record the key only after success (here the \"saga\" is trivially successful)."
          }
        ],
        "tryIt": "Why must the key not be stored before the saga steps run? Describe a failing case.",
        "check": {
          "question": "When should the idempotency key be recorded as COMMITTED?",
          "options": [
            "Before running any step",
            "After all saga steps succeed",
            "When the event is first received, even if it fails"
          ],
          "answer": 1,
          "why": "Recording only after success lets failed events be retried after a fix."
        }
      },
      {
        "title": "The run_transaction function",
        "say": [
          "Practice 1: run_transaction(event, store, steps, dlq). If store has event[\"key\"], return DUPLICATE_DROPPED.",
          "Otherwise run each step's execute(), remembering finished steps. If one raises, run compensate() on finished steps newest first, append {\"event\", \"error\"} to the DLQ, and return FAILED_COMPENSATED.",
          "If all steps succeed, set store[key] = \"COMMITTED\" and return COMMITTED.",
          "Steps are dicts with execute and compensate functions, so tests can use small fakes that record calls.",
          "Keeping the engine separate from the steps means new business flows reuse the same, well-tested engine code.",
          "Notice how the saga and DLQ code from earlier lessons fits in with barely any change.",
          "The example runs a successful order, a duplicate, and an order whose payment fails."
        ],
        "example": "A checklist the hotel desk follows for every guest, with a clear \"if something fails\" section at the bottom.",
        "code": "def run_transaction(event, store, steps, dlq):\n    if event[\"key\"] in store:\n        return {\"status\": \"DUPLICATE_DROPPED\"}\n    finished = []\n    for step in steps:\n        try:\n            step[\"execute\"]()\n            finished.append(step)\n        except Exception as err:\n            for done in reversed(finished):\n                done[\"compensate\"]()\n            dlq.append({\"event\": event, \"error\": str(err)})\n            return {\"status\": \"FAILED_COMPENSATED\"}\n    store[event[\"key\"]] = \"COMMITTED\"\n    return {\"status\": \"COMMITTED\"}\n\nlog = []\ndef step(name, fail=False):\n    def execute():\n        if fail:\n            raise RuntimeError(f\"{name} failed\")\n        log.append(name)\n    return {\"execute\": execute, \"compensate\": lambda: log.append(f\"undo {name}\")}\n\nstore, dlq = {}, []\nok_steps = [step(\"reserve stock\"), step(\"charge card\")]\nprint(run_transaction({\"key\": \"k1\"}, store, ok_steps, dlq))\nprint(run_transaction({\"key\": \"k1\"}, store, ok_steps, dlq))\nprint(run_transaction({\"key\": \"k2\"}, store, [step(\"reserve stock\"), step(\"charge card\", fail=True)], dlq))\nprint(log)\nprint(dlq)",
        "output": "{'status': 'COMMITTED'}\n{'status': 'DUPLICATE_DROPPED'}\n{'status': 'FAILED_COMPENSATED'}\n['reserve stock', 'charge card', 'reserve stock', 'undo reserve stock']\n[{'event': {'key': 'k2'}, 'error': 'charge card failed'}]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Duplicates are dropped before any step."
          },
          {
            "line": 10,
            "note": "Compensate finished steps, newest first."
          },
          {
            "line": 12,
            "note": "Park the failed event with its error."
          },
          {
            "line": 14,
            "note": "Commit the key only after success."
          }
        ],
        "tryIt": "Make \"reserve stock\" fail for k3. Which compensations run, and what is in the DLQ?",
        "check": {
          "question": "What happens to the idempotency key of a failed transaction?",
          "options": [
            "It is stored as COMMITTED",
            "It is not stored, so the event can be retried after a fix",
            "It is deleted from the event"
          ],
          "answer": 1,
          "why": "Only successful transactions record their key."
        }
      },
      {
        "title": "Measuring duration",
        "say": [
          "Practice 2: tx_duration(start_ms, end_ms) returns the time taken as a string like \"125ms\".",
          "Measure each transaction and each step. Slow steps hold resources longer and make conflicts more likely.",
          "Tag each measurement with the step name and the outcome, so dashboards can show which step is slow and whether failures are slower than successes.",
          "Pass the clock in (as on Day 8) so durations can be tested exactly.",
          "Record durations as numbers in your metrics system; format them as text only for logs and people.",
          "Watch p95 and p99 durations as well as the average, since the slow tail is where timeouts and retries start.",
          "The example times three transactions with a fake clock."
        ],
        "example": "A stopwatch on each station of a production line, so the slowest station can be found and improved.",
        "code": "def tx_duration(start_ms, end_ms):\n    return f\"{end_ms - start_ms}ms\"\n\nclock = iter([1000, 1125, 2000, 2090, 3000, 3700])\ndurations = []\nfor tx in [\"k1\", \"k2\", \"k3\"]:\n    start, end = next(clock), next(clock)\n    durations.append(end - start)\n    print(tx, tx_duration(start, end))\nprint(\"slowest:\", max(durations), \"ms, average:\", round(sum(durations) / len(durations)), \"ms\")",
        "output": "k1 125ms\nk2 90ms\nk3 700ms\nslowest: 700 ms, average: 305 ms",
        "codeNotes": [
          {
            "line": 2,
            "note": "Whole milliseconds with the unit."
          },
          {
            "line": 8,
            "note": "Keep the numbers for metrics; format only for display."
          }
        ],
        "tryIt": "Add a fourth transaction that takes 2 seconds. How much does it change the average?",
        "check": {
          "question": "What does tx_duration(1000, 1125) return?",
          "options": [
            "\"1125ms\"",
            "\"125ms\"",
            "\"0.125s\""
          ],
          "answer": 1,
          "why": "1125 - 1000 = 125, formatted as \"125ms\"."
        }
      },
      {
        "title": "Testing every failure path",
        "say": [
          "A transaction engine must be tested on every path: success, duplicate, failure at the first step, failure at the last step, and a failing compensation.",
          "Write each test as a small table row: the steps, which one fails, and the expected status, compensations and DLQ size.",
          "When a production incident reveals a new failure path, the first fix is adding a row that reproduces it.",
          "Checking the exact order of compensations catches bugs where undo happens in the wrong order.",
          "Also test that a redriven event (same key, now succeeding) commits normally after a failure.",
          "Table-driven tests like these are short to write and easy to extend when a new bug is found.",
          "The example runs four scenarios and asserts the results."
        ],
        "example": "A flight simulator session where the trainer triggers engine failure, a bird strike and a hydraulics fault one by one, checking the pilot's response each time.",
        "code": "def run_transaction(event, store, steps, dlq):\n    if event[\"key\"] in store:\n        return \"DUPLICATE_DROPPED\"\n    finished = []\n    for name, fails in steps:\n        if fails:\n            dlq.append(event[\"key\"])\n            return \"FAILED_COMPENSATED:\" + \",\".join(f\"undo {n}\" for n in reversed(finished))\n        finished.append(name)\n    store[event[\"key\"]] = \"COMMITTED\"\n    return \"COMMITTED\"\n\nstore, dlq = {\"done-key\": \"COMMITTED\"}, []\ncases = [\n    (\"new\", [(\"a\", False), (\"b\", False)], \"COMMITTED\"),\n    (\"done-key\", [(\"a\", False)], \"DUPLICATE_DROPPED\"),\n    (\"fail-first\", [(\"a\", True), (\"b\", False)], \"FAILED_COMPENSATED:\"),\n    (\"fail-last\", [(\"a\", False), (\"b\", False), (\"c\", True)], \"FAILED_COMPENSATED:undo b,undo a\"),\n]\nfor key, steps, expected in cases:\n    got = run_transaction({\"key\": key}, store, steps, dlq)\n    assert got == expected, (key, got)\n    print(f\"{key:10} {got}\")\nprint(\"DLQ:\", dlq)",
        "output": "new        COMMITTED\ndone-key   DUPLICATE_DROPPED\nfail-first FAILED_COMPENSATED:\nfail-last  FAILED_COMPENSATED:undo b,undo a\nDLQ: ['fail-first', 'fail-last']",
        "codeNotes": [
          {
            "line": 8,
            "note": "The result lists compensations in the order they ran."
          },
          {
            "line": 22,
            "note": "Each scenario checks the exact outcome."
          }
        ],
        "tryIt": "Add a case where \"fail-first\" is retried with no failing step. It should now commit.",
        "check": {
          "question": "Why check the exact order of compensations in tests?",
          "options": [
            "Order never matters",
            "Undoing in the wrong order is a real bug that simple success tests miss",
            "To make tests longer"
          ],
          "answer": 1,
          "why": "Only an explicit check catches compensations running oldest first."
        }
      },
      {
        "title": "Publishing events reliably: the outbox",
        "say": [
          "After committing, the engine often publishes an event such as \"OrderPlaced\". If it writes to the database and then crashes before publishing, the event is lost; if it publishes first and then fails to write, the event is false.",
          "The transactional outbox fixes this: write the business change and the outgoing event to an outbox table in the same database transaction.",
          "A separate relay reads the outbox and publishes the events to Kafka, marking each as sent. If it crashes, it resends, so consumers must be idempotent.",
          "Old outbox rows are deleted or archived after they are sent, so the table stays small.",
          "This gives at-least-once publishing that matches the database state exactly, without 2PC between the database and the broker.",
          "Change data capture tools (such as Debezium) can play the relay's role by reading the database log.",
          "Congratulations on Milestone 2! Next week covers time, clocks, CRDTs, sharding, replicas and circuit breakers."
        ],
        "example": "Writing a letter and putting it in your own out-tray at the same moment you file the copy: the post room later collects everything in the out-tray, so no letter is forgotten or sent without its copy.",
        "code": "db = {\"orders\": {}, \"outbox\": []}\n\ndef place_order(order_id, amount):\n    new_orders = {**db[\"orders\"], order_id: {\"amount\": amount, \"status\": \"PLACED\"}}\n    new_outbox = db[\"outbox\"] + [{\"event\": \"OrderPlaced\", \"order_id\": order_id, \"sent\": False}]\n    db.update(orders=new_orders, outbox=new_outbox)\n\ndef relay(publish):\n    for row in db[\"outbox\"]:\n        if not row[\"sent\"]:\n            publish(row)\n            row[\"sent\"] = True\n\npublished = []\nplace_order(\"order-7\", 500)\nplace_order(\"order-8\", 300)\nrelay(published.append)\nrelay(published.append)\nprint(\"orders:\", list(db[\"orders\"]))\nprint(\"published:\", [(p[\"event\"], p[\"order_id\"]) for p in published])",
        "output": "orders: ['order-7', 'order-8']\npublished: [('OrderPlaced', 'order-7'), ('OrderPlaced', 'order-8')]",
        "codeNotes": [
          {
            "line": 6,
            "note": "The order and its event are saved together, like one transaction."
          },
          {
            "line": 12,
            "note": "Mark as sent after publishing; a crash before this means a resend."
          },
          {
            "line": 18,
            "note": "Running the relay again sends nothing new."
          }
        ],
        "tryIt": "Imagine the relay crashes after publish but before marking sent. What happens on its next run, and why is that acceptable?",
        "check": {
          "question": "What problem does the transactional outbox solve?",
          "options": [
            "Slow databases",
            "Keeping database changes and published events in step without 2PC",
            "Too many Kafka partitions"
          ],
          "answer": 1,
          "why": "Saving the event with the change guarantees it is eventually published, and only if the change happened."
        }
      }
    ],
    "summary": [
      "Check the idempotency key first; drop duplicates without side effects.",
      "Run saga steps; on failure compensate newest first and dead-letter the event.",
      "Record the key as COMMITTED only after success.",
      "Measure durations with an injected clock; watch the slow tail.",
      "Use a transactional outbox to publish events reliably."
    ],
    "projectStep": {
      "title": "Milestone 2: transaction engine",
      "steps": [
        "Add run_transaction and tx_duration to dist_toolkit.py.",
        "Write table-driven tests for success, duplicate and two failure cases.",
        "Bonus: add an outbox and a relay that publishes each event exactly once per run."
      ]
    }
  },
  {
    "day": 16,
    "title": "Physical Clocks, NTP Drift, Lamport Timestamps & Vector Clocks",
    "goal": "You can explain why physical clocks cannot order events across machines, use Lamport timestamps for a consistent order, and compare vector clocks to detect causality and real conflicts.",
    "minutes": 30,
    "recap": "Many earlier lessons relied on time: leases, TTLs, Snowflake IDs. Today you learn why \"what happened first?\" is a hard question across machines, and how logical clocks answer it.",
    "parts": [
      {
        "title": "Physical clocks drift",
        "say": [
          "Every server has a quartz clock that runs slightly fast or slow, typically drifting by milliseconds per hour. NTP (Network Time Protocol) corrects them against time servers.",
          "Corrections can make a clock jump forwards or even backwards, and NTP accuracy over the internet is only a few milliseconds at best.",
          "So two events on different machines, a few milliseconds apart, cannot be reliably ordered by their timestamps.",
          "Last-write-wins based on wall-clock time can silently drop the real latest write if the writer's clock was behind.",
          "The example shows two servers with skewed clocks recording updates to the same record, with the \"wrong\" update winning.",
          "Google Spanner uses GPS and atomic clocks with a known error bound; most systems instead use logical clocks, which count events rather than seconds."
        ],
        "example": "Two friends with watches that differ by two minutes both note when they sent a message. Comparing the notes can put the messages in the wrong order.",
        "code": "true_time = [1000, 1003]\nskew = {\"server-A\": +5, \"server-B\": -2}\nupdates = [(\"server-A\", \"status=SHIPPED\", true_time[0]), (\"server-B\", \"status=DELIVERED\", true_time[1])]\nstamped = [(t + skew[server], server, value) for server, value, t in updates]\nfor ts, server, value in stamped:\n    print(f\"{server} recorded {value!r} at clock {ts}\")\nwinner = max(stamped)[2]\nprint(\"last-write-wins keeps:\", winner, \"(but DELIVERED really happened later)\")",
        "output": "server-A recorded 'status=SHIPPED' at clock 1005\nserver-B recorded 'status=DELIVERED' at clock 1001\nlast-write-wins keeps: status=SHIPPED (but DELIVERED really happened later)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each server stamps with its own, skewed clock."
          },
          {
            "line": 7,
            "note": "Comparing timestamps picks the wrong update."
          }
        ],
        "tryIt": "Set both skews to 0 and run again. Which update wins now?",
        "check": {
          "question": "Why can wall-clock timestamps order events wrongly across machines?",
          "options": [
            "Clocks are too precise",
            "Clocks drift and are corrected, so machines disagree by milliseconds or more",
            "Timestamps are rounded to seconds"
          ],
          "answer": 1,
          "why": "Small clock differences can reverse the order of events that happened close together."
        }
      },
      {
        "title": "Happened-before",
        "say": [
          "Leslie Lamport's 1978 paper defined the happened-before relation. Event a happened before b if they are on the same process and a came first, or a is sending a message and b is receiving it, or through a chain of such steps.",
          "If neither happened before the other, the events are concurrent: no information could have flowed between them.",
          "Concurrent does not mean \"at the same moment\"; it means \"unaware of each other\". Two edits made an hour apart without syncing are concurrent.",
          "Thinking in terms of cause and effect, rather than clock time, is the key mental shift of this lesson.",
          "This relation is what we really care about: could event b have been influenced by event a?",
          "Logical clocks capture happened-before without looking at real time.",
          "The example traces a chain of messages between three processes."
        ],
        "example": "In a group chat, a reply \"yes, 7 pm works\" clearly came after the question it answers, whatever the phones' clocks say. Two unrelated messages posted by people who had not read each other are concurrent.",
        "code": "events = [\n    (\"P1\", \"write draft\"),\n    (\"P1\", \"send draft to P2\"),\n    (\"P2\", \"receive draft\"),\n    (\"P2\", \"send review to P3\"),\n    (\"P3\", \"receive review\"),\n    (\"P3\", \"write unrelated note\"),\n]\nfor i, (proc, what) in enumerate(events):\n    print(i, proc, what)\nprint(\"write draft -> receive review: happened-before (through messages)\")",
        "output": "0 P1 write draft\n1 P1 send draft to P2\n2 P2 receive draft\n3 P2 send review to P3\n4 P3 receive review\n5 P3 write unrelated note\nwrite draft -> receive review: happened-before (through messages)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Sending and receiving link events on different processes."
          }
        ],
        "tryIt": "Is \"write unrelated note\" concurrent with \"write draft\"? Trace the chain to decide.",
        "check": {
          "question": "When are two events concurrent?",
          "options": [
            "When they have the same timestamp",
            "When neither happened before the other",
            "When they are on the same machine"
          ],
          "answer": 1,
          "why": "Concurrent means no chain of messages links them."
        }
      },
      {
        "title": "Lamport timestamps",
        "say": [
          "A Lamport clock is a counter on each process. Before each local event or send, add 1. Every message carries the sender's counter.",
          "Practice 2: on receiving, the clock becomes max(local, received) + 1, so the receive event is always later than the send.",
          "Lamport timestamps guarantee: if a happened before b, then L(a) < L(b). Sorting by (timestamp, process id) gives a total order that every node agrees on.",
          "The reverse is not true: L(a) < L(b) does not mean a happened before b. Lamport clocks cannot detect concurrency.",
          "They are enough for many uses, such as ordering operations consistently in a replicated log.",
          "Adding the process id as a tie-break matters: two events can share a Lamport number, and every node must break the tie the same way.",
          "The simulation runs three processes exchanging two messages."
        ],
        "example": "Numbering pages in a shared notebook: whenever you receive the notebook, you continue from the highest page number anyone has written, plus one.",
        "code": "def lamport_receive(local, received):\n    return max(local, received) + 1\n\nclock = {\"P1\": 0, \"P2\": 0, \"P3\": 0}\ndef local_event(p):\n    clock[p] += 1\n    return clock[p]\n\nsent = local_event(\"P1\")\nlocal_event(\"P2\"); local_event(\"P2\"); local_event(\"P2\")\nclock[\"P2\"] = lamport_receive(clock[\"P2\"], sent)\nsent2 = local_event(\"P2\")\nclock[\"P3\"] = lamport_receive(clock[\"P3\"], sent2)\nprint(clock)\nprint(lamport_receive(10, 3), lamport_receive(2, 7))",
        "output": "{'P1': 1, 'P2': 5, 'P3': 6}\n11 8",
        "codeNotes": [
          {
            "line": 2,
            "note": "Jump past whatever the sender had seen, then add one."
          },
          {
            "line": 11,
            "note": "P2 had counted to 3; the message from P1 carried 1."
          }
        ],
        "tryIt": "Make P1 do 10 local events before sending. What is P3's final clock?",
        "check": {
          "question": "What is lamport_receive(4, 9)?",
          "options": [
            "5",
            "10",
            "13"
          ],
          "answer": 1,
          "why": "max(4, 9) + 1 = 10."
        }
      },
      {
        "title": "Vector clocks",
        "say": [
          "A vector clock keeps one counter per process: {\"N1\": 2, \"N2\": 1} means \"I have seen 2 events from N1 and 1 from N2\".",
          "On a local event, a process increases its own entry. On receiving, it takes the element-wise maximum of both clocks, then increases its own entry.",
          "Vector clocks capture happened-before exactly: A happened before B if every entry of A is less than or equal to B's and at least one is smaller.",
          "If A is ahead in some entry and B is ahead in another, they are concurrent: a real conflict that needs resolving.",
          "Dynamo-style databases and some sync tools use vector clocks (or versions based on them) to detect conflicting writes.",
          "The price is size: a vector clock has one entry per node that ever wrote, so systems with many writers trim or summarise them.",
          "The example builds two diverging clocks and a merged one."
        ],
        "example": "Two people editing copies of the same shopping list: each keeps a tally of the edits they have seen from each person. If each has seen an edit the other has not, their lists conflict.",
        "code": "def merge(a, b):\n    return {n: max(a.get(n, 0), b.get(n, 0)) for n in set(a) | set(b)}\n\nbase = {\"N1\": 1, \"N2\": 1}\nedit_on_n1 = {**base, \"N1\": base[\"N1\"] + 1}\nedit_on_n2 = {**base, \"N2\": base[\"N2\"] + 1}\nprint(\"N1 after its edit:\", edit_on_n1)\nprint(\"N2 after its edit:\", edit_on_n2)\nmerged = merge(edit_on_n1, edit_on_n2)\nmerged[\"N1\"] += 1\nprint(\"N1 after receiving N2's edit:\", dict(sorted(merged.items())))",
        "output": "N1 after its edit: {'N1': 2, 'N2': 1}\nN2 after its edit: {'N1': 1, 'N2': 2}\nN1 after receiving N2's edit: {'N1': 3, 'N2': 2}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Element-wise maximum of two clocks."
          },
          {
            "line": 5,
            "note": "Each node increases only its own entry."
          }
        ],
        "tryIt": "Is edit_on_n1 before, after, or concurrent with edit_on_n2? Decide before the next part.",
        "check": {
          "question": "What does a vector clock entry {\"N2\": 3} mean?",
          "options": [
            "N2 has 3 CPUs",
            "The holder has seen 3 events from N2",
            "N2 is 3 seconds behind"
          ],
          "answer": 1,
          "why": "Each entry counts the events seen from that node."
        }
      },
      {
        "title": "Comparing vector clocks",
        "say": [
          "Practice 1: compare_vector_clocks(a, b) returns A_BEFORE_B, B_BEFORE_A, EQUAL or CONCURRENT. A node missing from a clock counts as 0.",
          "Compute two flags over every node in either clock: a_ahead (some entry of a is bigger) and b_ahead (some entry of b is bigger).",
          "Neither ahead: EQUAL. Only b ahead: A_BEFORE_B. Only a ahead: B_BEFORE_A. Both ahead: CONCURRENT.",
          "CONCURRENT is the valuable answer: it tells the system that two writes truly conflict and must be merged or shown to the user.",
          "Using set(a) | set(b) makes sure nodes present in only one clock are compared too.",
          "The examples cover all four outcomes."
        ],
        "example": "Comparing two students' progress charts across subjects: if one is ahead or equal in every subject, they are ahead overall; if each leads in some subject, neither is simply ahead.",
        "code": "def compare_vector_clocks(a, b):\n    nodes = set(a) | set(b)\n    a_ahead = any(a.get(n, 0) > b.get(n, 0) for n in nodes)\n    b_ahead = any(b.get(n, 0) > a.get(n, 0) for n in nodes)\n    if a_ahead and b_ahead:\n        return \"CONCURRENT\"\n    if b_ahead:\n        return \"A_BEFORE_B\"\n    if a_ahead:\n        return \"B_BEFORE_A\"\n    return \"EQUAL\"\n\nprint(compare_vector_clocks({\"N1\": 1}, {\"N1\": 2, \"N2\": 1}))\nprint(compare_vector_clocks({\"N1\": 3, \"N2\": 1}, {\"N1\": 2, \"N2\": 1}))\nprint(compare_vector_clocks({\"N1\": 2, \"N2\": 1}, {\"N1\": 1, \"N2\": 2}))\nprint(compare_vector_clocks({\"N1\": 1, \"N2\": 0}, {\"N1\": 1}))",
        "output": "A_BEFORE_B\nB_BEFORE_A\nCONCURRENT\nEQUAL",
        "codeNotes": [
          {
            "line": 2,
            "note": "Every node that appears in either clock."
          },
          {
            "line": 5,
            "note": "Each is ahead somewhere: a real conflict."
          }
        ],
        "tryIt": "Compare the two edits from the previous part with this function.",
        "check": {
          "question": "Clocks {\"N1\": 2, \"N2\": 1} and {\"N1\": 1, \"N2\": 2} are...",
          "options": [
            "A_BEFORE_B",
            "EQUAL",
            "CONCURRENT"
          ],
          "answer": 2,
          "why": "Each clock is ahead in one entry, so the events are concurrent."
        }
      },
      {
        "title": "Resolving conflicts",
        "say": [
          "When writes are concurrent, the system must choose what to keep. Options: last-write-wins (simple, but loses data), keep both and let the application or user merge (like \"conflicted copy\" files), or use data types that merge automatically.",
          "Shopping carts in Amazon's original Dynamo kept both versions and merged them by union, so no added item was lost (though deleted items could reappear).",
          "Collaborative editors merge character-level edits automatically using special algorithms.",
          "Git does something similar for code: it detects concurrent edits to the same lines and asks a person to resolve them.",
          "The cleanest general solution for many data types is the CRDT, which is tomorrow's topic.",
          "Whatever you choose, make it deterministic: every replica must reach the same result when it sees the same writes.",
          "The example merges two concurrent carts by union."
        ],
        "example": "Two family members each add items to a shared shopping list while offline. When they sync, the sensible merge keeps every item either of them added.",
        "code": "cart_phone = {\"rice\", \"dal\", \"ghee\"}\ncart_laptop = {\"rice\", \"dal\", \"jaggery\"}\nmerged = cart_phone | cart_laptop\nprint(\"merged cart:\", sorted(merged))\nlww = cart_laptop\nprint(\"last-write-wins would keep:\", sorted(lww), \"(ghee lost)\")",
        "output": "merged cart: ['dal', 'ghee', 'jaggery', 'rice']\nlast-write-wins would keep: ['dal', 'jaggery', 'rice'] (ghee lost)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Union keeps every added item."
          },
          {
            "line": 5,
            "note": "Last-write-wins silently drops the other change."
          }
        ],
        "tryIt": "If the phone user had removed \"dal\", what would the union merge do? Why is that a problem?",
        "check": {
          "question": "Why is last-write-wins risky for concurrent writes?",
          "options": [
            "It is slow",
            "It silently throws away one of the conflicting changes",
            "It needs vector clocks"
          ],
          "answer": 1,
          "why": "Only one version survives; the other edit is lost without anyone noticing."
        }
      }
    ],
    "summary": [
      "Physical clocks drift and jump, so timestamps cannot reliably order events across machines.",
      "Happened-before links events through process order and messages; others are concurrent.",
      "Lamport clocks: receive = max(local, received) + 1; they give a consistent total order.",
      "Vector clocks capture causality and detect concurrent (conflicting) writes.",
      "Resolve conflicts deterministically: LWW, keep both, or mergeable data types."
    ],
    "projectStep": {
      "title": "Logical clocks",
      "steps": [
        "Add lamport_receive and compare_vector_clocks to dist_toolkit.py.",
        "Simulate three processes exchanging messages and print their Lamport clocks.",
        "Bonus: create two concurrent vector clocks and merge them."
      ]
    }
  },
  {
    "day": 17,
    "title": "Conflict-Free Replicated Data Types (CRDTs): G-Counter, PN-Counter & LWW-Set",
    "goal": "You can explain why CRDTs converge without coordination, build G-Counters and PN-Counters with max-based merge, resolve last-writer-wins registers deterministically, and choose CRDTs for offline and multi-region data.",
    "minutes": 30,
    "recap": "Yesterday vector clocks detected conflicting writes. Today you use data types designed so that conflicts merge automatically: CRDTs.",
    "parts": [
      {
        "title": "Merging without coordination",
        "say": [
          "A CRDT (conflict-free replicated data type) is a data structure that replicas can update independently and later merge, always reaching the same result.",
          "The merge must be commutative (order does not matter), associative (grouping does not matter) and idempotent (merging the same thing twice changes nothing).",
          "With those properties, replicas can exchange state in any order, any number of times, over unreliable networks, and still converge.",
          "That means no leader, no locks and no waiting: each replica accepts writes immediately, even while offline.",
          "CRDTs power collaborative apps, offline-first mobile apps, and multi-region databases such as Redis Enterprise and Riak.",
          "The example shows why a naive counter fails: adding replica totals double-counts.",
          "Choosing the right structure makes the merge rule simple and safe."
        ],
        "example": "Three shop branches counting footfall. If each simply reported \"total visitors so far\" and head office added the reports every hour, repeated reports would double-count.",
        "code": "branch_counts = {\"A\": 5, \"B\": 3}\nnaive_total = 0\nfor report in [branch_counts, branch_counts]:\n    naive_total += sum(report.values())\nprint(\"adding the same report twice:\", naive_total, \"(wrong, should be 8)\")\nmerged = {}\nfor report in [branch_counts, branch_counts]:\n    for b, c in report.items():\n        merged[b] = max(merged.get(b, 0), c)\nprint(\"merging with max per branch:\", sum(merged.values()))",
        "output": "adding the same report twice: 16 (wrong, should be 8)\nmerging with max per branch: 8",
        "codeNotes": [
          {
            "line": 4,
            "note": "Addition is not idempotent: repeats double-count."
          },
          {
            "line": 9,
            "note": "Max per branch: repeats change nothing."
          }
        ],
        "tryIt": "Merge a newer report {\"A\": 7, \"B\": 3} as well. What is the total now?",
        "check": {
          "question": "Which property means merging the same state twice changes nothing?",
          "options": [
            "Commutative",
            "Idempotent",
            "Associative"
          ],
          "answer": 1,
          "why": "An idempotent merge gives the same result however many times it is repeated."
        }
      },
      {
        "title": "The G-Counter",
        "say": [
          "A grow-only counter (G-Counter) keeps one entry per node. Each node increments only its own entry.",
          "The value is the sum of all entries. The merge takes the maximum of each entry.",
          "Because each entry only grows and only its owner changes it, the maximum is always the newest known value for that node.",
          "A replica that has not heard from node C for a while simply keeps C's old count; the next merge brings it up to date.",
          "Max is commutative, associative and idempotent, so the merge satisfies all three properties.",
          "G-Counters are ideal for likes, views and other counts that only go up.",
          "The example increments on two replicas, merges both ways, and gets the same value."
        ],
        "example": "A scoreboard where each player writes only their own score, and only upwards. Combining two copies means taking the higher number for each player.",
        "code": "class GCounter:\n    def __init__(self, node):\n        self.node, self.counts = node, {}\n    def increment(self, v=1):\n        self.counts[self.node] = self.counts.get(self.node, 0) + v\n    def value(self):\n        return sum(self.counts.values())\n    def merge(self, other):\n        for n in set(self.counts) | set(other.counts):\n            self.counts[n] = max(self.counts.get(n, 0), other.counts.get(n, 0))\n\na, b = GCounter(\"A\"), GCounter(\"B\")\na.increment(3)\nb.increment(2)\na.merge(b)\nb.merge(a)\na.merge(b)\nprint(a.value(), b.value(), a.counts == b.counts)",
        "output": "5 5 True",
        "codeNotes": [
          {
            "line": 5,
            "note": "A node only ever changes its own entry."
          },
          {
            "line": 10,
            "note": "Merge: the larger value for every node."
          }
        ],
        "tryIt": "Increment b again after the merges, then merge into a. What is the value?",
        "check": {
          "question": "Why can a G-Counter merge use max for each entry?",
          "options": [
            "Max is fastest",
            "Each entry only grows and is owned by one node, so the larger value is the newest",
            "Counters cannot be added"
          ],
          "answer": 1,
          "why": "Ownership plus growth make max the correct combination."
        }
      },
      {
        "title": "The PN-Counter",
        "say": [
          "A G-Counter cannot go down. A PN-Counter combines two G-Counters: P for increments and N for decrements.",
          "Practice 1: increment adds to this node's P entry, decrement adds to its N entry, value() is sum(P) - sum(N), and merge takes the max of each entry in both P and N.",
          "Both halves only grow, so the max merge still works, while the value can go up and down.",
          "Notice that a PN-Counter never stores the current value itself; the value is always computed from the two maps, which is what keeps merging safe.",
          "Use PN-Counters for stock levels in carts, votes that can be withdrawn, or seat counts that go both ways, when a temporary overshoot is acceptable.",
          "A PN-Counter cannot stop the value going below zero across replicas, because each replica decides alone. For hard limits you need coordination.",
          "The example runs increments and decrements on two replicas and merges them."
        ],
        "example": "Two notebooks per branch: one for items received and one for items sold. Stock is received minus sold, and each notebook only ever gets new lines.",
        "code": "class PNCounter:\n    def __init__(self, node):\n        self.node, self.p, self.n = node, {}, {}\n    def increment(self, v=1):\n        self.p[self.node] = self.p.get(self.node, 0) + v\n    def decrement(self, v=1):\n        self.n[self.node] = self.n.get(self.node, 0) + v\n    def value(self):\n        return sum(self.p.values()) - sum(self.n.values())\n    def merge(self, other):\n        for mine, theirs in ((self.p, other.p), (self.n, other.n)):\n            for node in set(mine) | set(theirs):\n                mine[node] = max(mine.get(node, 0), theirs.get(node, 0))\n\nmumbai, delhi = PNCounter(\"mumbai\"), PNCounter(\"delhi\")\nmumbai.increment(10)\ndelhi.increment(5)\nmumbai.decrement(3)\ndelhi.decrement(4)\nmumbai.merge(delhi)\ndelhi.merge(mumbai)\nprint(mumbai.value(), delhi.value())",
        "output": "8 8",
        "codeNotes": [
          {
            "line": 9,
            "note": "Increments minus decrements."
          },
          {
            "line": 13,
            "note": "Max merge on both halves."
          }
        ],
        "tryIt": "Merge mumbai into delhi twice more. Does the value change?",
        "check": {
          "question": "Why does a PN-Counter use two grow-only maps?",
          "options": [
            "To save memory",
            "So both maps only grow and the max merge stays correct while the value can fall",
            "Decrements are not allowed"
          ],
          "answer": 1,
          "why": "Separating increments and decrements keeps each half mergeable with max."
        }
      },
      {
        "title": "Last-writer-wins registers",
        "say": [
          "For a single value (a profile name, a setting), a last-writer-wins (LWW) register keeps the value with the highest timestamp.",
          "Practice 2: resolve_lww(a, b) compares (ts, node) pairs: higher timestamp wins, and on a tie, the higher node id wins, so every replica picks the same value.",
          "The tie-break is essential. Without it, two replicas could each keep their own value and never converge.",
          "LWW is simple but discards the losing write, and clock skew (Day 16) can make an older write win. Use hybrid logical clocks or Lamport timestamps to reduce that risk.",
          "Always use the same timestamp source for all replicas, and store the timestamp with the value so any replica can compare later.",
          "LWW suits data where losing a concurrent edit is acceptable, like \"last seen\" times or display settings.",
          "The example resolves several pairs, including a tie."
        ],
        "example": "When two people rename the same WhatsApp group at the same moment, everyone must end up seeing the same name, so a fixed rule decides which rename wins.",
        "code": "def resolve_lww(a, b):\n    return a[\"value\"] if (a[\"ts\"], a[\"node\"]) > (b[\"ts\"], b[\"node\"]) else b[\"value\"]\n\nx = {\"value\": \"Asha K\", \"ts\": 105, \"node\": \"n1\"}\ny = {\"value\": \"Asha Kumar\", \"ts\": 110, \"node\": \"n2\"}\nz = {\"value\": \"Asha R\", \"ts\": 110, \"node\": \"n3\"}\nprint(resolve_lww(x, y), \"|\", resolve_lww(y, x))\nprint(resolve_lww(y, z), \"|\", resolve_lww(z, y))",
        "output": "Asha Kumar | Asha Kumar\nAsha R | Asha R",
        "codeNotes": [
          {
            "line": 2,
            "note": "Timestamp first, then node id to break ties."
          },
          {
            "line": 8,
            "note": "Same result whichever replica compares."
          }
        ],
        "tryIt": "Remove the node from the comparison and check the tie case. Do both orders still agree?",
        "check": {
          "question": "Why does an LWW register need a tie-break on node id?",
          "options": [
            "To make it faster",
            "So replicas with equal timestamps still choose the same value",
            "Node ids are more accurate than time"
          ],
          "answer": 1,
          "why": "A deterministic tie-break guarantees convergence."
        }
      },
      {
        "title": "Sets that merge: add-wins sets",
        "say": [
          "Sets are harder: if one replica adds \"milk\" and another removes it concurrently, what should the merged set contain?",
          "A grow-only set (G-Set) allows only additions; merge is union. Simple, but items can never be removed.",
          "An observed-remove set (OR-Set) tags each addition with a unique id. A remove deletes only the tags it has seen. A concurrent add has a new tag, so it survives: \"add wins\".",
          "The unique tag can be as simple as the node id plus a counter, which is guaranteed unique without any coordination.",
          "This matches user expectations in shopping lists and to-do apps: an item re-added on another device is not lost.",
          "The example shows an add on one replica surviving a concurrent remove on another.",
          "Libraries such as Automerge and Yjs provide ready-made CRDTs for lists, maps and text."
        ],
        "example": "Adding \"milk\" to a shared list from your phone while your partner, who saw an older \"milk\" entry, crosses it off. The fresh \"milk\" you added should stay.",
        "code": "def merge(a, b):\n    return {\"adds\": a[\"adds\"] | b[\"adds\"], \"removes\": a[\"removes\"] | b[\"removes\"]}\n\ndef items(s):\n    return sorted({item for item, tag in s[\"adds\"] - s[\"removes\"]})\n\nbase = {\"adds\": {(\"milk\", \"t1\")}, \"removes\": set()}\nphone = {\"adds\": base[\"adds\"] | {(\"milk\", \"t2\")}, \"removes\": set()}\nlaptop = {\"adds\": set(base[\"adds\"]), \"removes\": {(\"milk\", \"t1\")}}\nprint(\"phone:\", items(phone), \"laptop:\", items(laptop))\nprint(\"merged:\", items(merge(phone, laptop)))",
        "output": "phone: ['milk'] laptop: []\nmerged: ['milk']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Visible items: additions whose tag has not been removed."
          },
          {
            "line": 8,
            "note": "The phone adds milk again with a new tag, t2."
          },
          {
            "line": 9,
            "note": "The laptop removes only the tag it saw, t1."
          }
        ],
        "tryIt": "Remove t2 on the laptop as well, then merge. Is milk gone?",
        "check": {
          "question": "In an add-wins set, why does a concurrent add survive a remove?",
          "options": [
            "Adds are processed first",
            "The remove only deletes the tags it had seen, and the new add has a new tag",
            "Removes are ignored"
          ],
          "answer": 1,
          "why": "Unique tags let the set tell old additions from new ones."
        }
      },
      {
        "title": "When to use CRDTs",
        "say": [
          "Use CRDTs when replicas must accept writes independently: offline mobile apps, collaborative editing, and multi-region databases that write locally in each region.",
          "They give high availability and low latency (AP/EL from Day 2) with guaranteed convergence.",
          "They cannot enforce global limits, such as \"stock never below zero\" or \"usernames are unique\". Those need coordination.",
          "A common pattern combines both worlds: CRDTs for most data, plus a small coordinated service for the few decisions that must be globally unique.",
          "Metadata can grow: per-node entries and tags accumulate. Real implementations compact or garbage-collect them.",
          "Many teams start with a CRDT library rather than writing their own, since the edge cases, especially for text and lists, are subtle.",
          "Tomorrow switches to splitting data across servers by key: sharding.",
          "The decision helper sums up when CRDTs fit."
        ],
        "example": "A shared family calendar that works on everyone's phone offline and syncs later: fine for adding events, but not for booking the one family car, which needs a single decision.",
        "code": "def fits_crdt(needs_offline_writes, needs_global_limit):\n    if needs_global_limit:\n        return \"no: needs coordination (consensus or a single leader)\"\n    return \"yes: CRDT\" if needs_offline_writes else \"maybe: a simpler single-leader design may do\"\n\nfor case, args in {\"likes counter\": (True, False), \"unique username\": (True, True), \"shared notes\": (True, False), \"admin settings\": (False, False)}.items():\n    print(f\"{case:16} -> {fits_crdt(*args)}\")",
        "output": "likes counter    -> yes: CRDT\nunique username  -> no: needs coordination (consensus or a single leader)\nshared notes     -> yes: CRDT\nadmin settings   -> maybe: a simpler single-leader design may do",
        "codeNotes": [
          {
            "line": 2,
            "note": "Global limits cannot be enforced by independent replicas."
          }
        ],
        "tryIt": "Would a CRDT suit a train seat reservation system? Explain using the helper.",
        "check": {
          "question": "Which requirement rules out a pure CRDT?",
          "options": [
            "Working offline",
            "A limit like \"stock can never go below zero\"",
            "Merging in any order"
          ],
          "answer": 1,
          "why": "Independent replicas cannot jointly enforce a global limit without coordination."
        }
      }
    ],
    "summary": [
      "CRDT merges are commutative, associative and idempotent, so replicas converge.",
      "G-Counter: per-node entries, sum for value, max for merge.",
      "PN-Counter: separate P and N G-Counters; value = P - N.",
      "LWW registers compare (timestamp, node) for a deterministic winner.",
      "Add-wins sets tag additions; CRDTs cannot enforce global limits."
    ],
    "projectStep": {
      "title": "CRDTs",
      "steps": [
        "Add PNCounter and resolve_lww to dist_toolkit.py.",
        "Simulate three replicas updating a PN-Counter and merging in different orders.",
        "Bonus: build a small add-wins set and show a concurrent add surviving."
      ]
    }
  },
  {
    "day": 18,
    "title": "Database Sharding Strategies: Range, Hash & Directory Sharding",
    "goal": "You can split a database into shards by range, hash or directory, route queries to the right shard, spot hot shards, and plan resharding and cross-shard queries.",
    "minutes": 30,
    "recap": "Replication (Days 2 and 9) copies data for safety. When one machine cannot hold or serve all the data, you split it instead: sharding.",
    "parts": [
      {
        "title": "Why shard?",
        "say": [
          "A single database server has limits: disk size, memory for indexes, and how many writes per second it can handle.",
          "Sharding (horizontal partitioning) splits the rows of a table across several servers, each holding a subset: a shard.",
          "Reads and writes for one key go to one shard, so capacity grows roughly with the number of shards.",
          "Each shard is usually itself replicated (Day 19), so sharding and replication work together: sharding for capacity, replication for safety and read scale.",
          "The cost is complexity: routing, queries across shards, rebalancing, and transactions that span shards.",
          "Many teams delay sharding with bigger machines, read replicas (tomorrow) and caching, and shard only when needed.",
          "The example estimates when a single server runs out of room."
        ],
        "example": "A library that outgrows its building opens branches, each holding books for part of the alphabet. Each branch is smaller and faster to search, but you need to know which branch to visit.",
        "code": "rows_per_day = 2_000_000\nbytes_per_row = 1_000\nserver_capacity_tb = 4\ndays = server_capacity_tb * 1e12 / (rows_per_day * bytes_per_row)\nprint(f\"one server fills up in about {days:.0f} days ({days / 365:.1f} years)\")\nfor shards in [2, 4, 8]:\n    print(f\"with {shards} shards: about {days * shards / 365:.1f} years\")",
        "output": "one server fills up in about 2000 days (5.5 years)\nwith 2 shards: about 11.0 years\nwith 4 shards: about 21.9 years\nwith 8 shards: about 43.8 years",
        "codeNotes": [
          {
            "line": 4,
            "note": "Time until the disk is full."
          }
        ],
        "tryIt": "Double rows_per_day. How many shards keep you going for 5 years?",
        "check": {
          "question": "What does sharding split across servers?",
          "options": [
            "Copies of the whole table",
            "The rows of a table, so each server holds a subset",
            "Only the indexes"
          ],
          "answer": 1,
          "why": "Each shard holds part of the data; together they hold all of it."
        }
      },
      {
        "title": "Range sharding",
        "say": [
          "Range sharding assigns contiguous key ranges to shards: user ids 1 to 1000 on shard 1, 1001 to 2000 on shard 2, and so on.",
          "Practice 2: range_shard(user_id) returns shard_1 for up to 1000, shard_2 for up to 2000, and shard_3 above that.",
          "Range queries are efficient: \"all orders from last week\" touches only the shards covering that range.",
          "Ranges also make it easy to move old data: a shard holding last year's orders can be moved to cheaper storage.",
          "The danger is hot spots. With increasing ids or timestamps, all new writes land on the last shard, while old shards sit idle.",
          "Systems like HBase, Bigtable and CockroachDB use ranges and split hot or large ranges automatically.",
          "The example routes a few ids and shows how new users pile onto the last range."
        ],
        "example": "Exam halls allocated by roll number ranges: easy to find your hall, but if most late registrations get the highest numbers, the last hall overflows.",
        "code": "def range_shard(user_id):\n    if user_id <= 1000:\n        return \"shard_1\"\n    if user_id <= 2000:\n        return \"shard_2\"\n    return \"shard_3\"\n\nprint([range_shard(u) for u in [1, 1000, 1001, 2000, 2001, 99999]])\nnew_signups = range(5000, 5100)\nprint(\"today's 100 new users all go to:\", {range_shard(u) for u in new_signups})",
        "output": "['shard_1', 'shard_1', 'shard_2', 'shard_2', 'shard_3', 'shard_3']\ntoday's 100 new users all go to: {'shard_3'}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Each shard owns a contiguous range."
          },
          {
            "line": 10,
            "note": "Increasing ids pile onto the last shard."
          }
        ],
        "tryIt": "Add shard_4 for ids above 3000. Where do the new users go now?",
        "check": {
          "question": "What is the main risk of range sharding by increasing id?",
          "options": [
            "Range queries are slow",
            "All new writes hit the last shard, creating a hot spot",
            "Keys are lost"
          ],
          "answer": 1,
          "why": "Monotonically increasing keys concentrate writes at the end of the range."
        }
      },
      {
        "title": "Hash and directory sharding",
        "say": [
          "Hash sharding applies a hash to the key and takes it modulo the number of shards. Keys spread evenly, even if ids increase.",
          "The trade-off: range queries must ask every shard, since neighbouring keys are scattered.",
          "Directory sharding keeps a lookup table from key to shard. It allows any placement, such as giving a huge customer their own shard.",
          "Practice 1: shard_for_customer(customer_id, directory, num_shards) uses the directory for listed big customers and a hash for everyone else.",
          "The directory must be fast and highly available, since every query consults it; it is often cached in each app server.",
          "Directories make it possible to move a single big customer to a new shard without touching anyone else's data.",
          "Recall Day 4: consistent hashing avoids moving most keys when the number of shards changes."
        ],
        "example": "A hospital that assigns most patients to wards by a simple rule, but has a special register sending VIP or complex cases to specific wards.",
        "code": "def shard_for_customer(customer_id, directory, num_shards=4):\n    if customer_id in directory:\n        return directory[customer_id]\n    h = 0\n    for ch in customer_id:\n        h = (h * 31 + ord(ch)) % 2 ** 32\n    return f\"shard_{h % num_shards}\"\n\ndirectory = {\"megamart\": \"shard_dedicated_1\"}\nfor c in [\"megamart\", \"asha-store\", \"bala-bakes\", \"chai-point\"]:\n    print(f\"{c:12} -> {shard_for_customer(c, directory)}\")",
        "output": "megamart     -> shard_dedicated_1\nasha-store   -> shard_3\nbala-bakes   -> shard_1\nchai-point   -> shard_0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Big customers are placed by hand."
          },
          {
            "line": 7,
            "note": "Everyone else is spread by hash."
          }
        ],
        "tryIt": "Move \"chai-point\" to its own dedicated shard using the directory.",
        "check": {
          "question": "What is a downside of hash sharding?",
          "options": [
            "Keys are unevenly spread",
            "Range queries must ask every shard",
            "It needs a directory"
          ],
          "answer": 1,
          "why": "Hashing scatters neighbouring keys, so ranges touch all shards."
        }
      },
      {
        "title": "Choosing a shard key",
        "say": [
          "The shard key decides everything. A good key spreads load evenly and keeps data that is used together on the same shard.",
          "For a multi-tenant SaaS app, the tenant (customer) id is often ideal: each customer's data stays together, and queries rarely cross customers.",
          "It also simplifies privacy and compliance, such as deleting all of one customer's data or keeping a customer in a specific country.",
          "Low-cardinality keys (like country, with a few values) create uneven shards. Monotonic keys (timestamps) create hot spots with range sharding.",
          "Measure skew: compare the busiest shard's load with the average. A ratio well above 1 means a hot shard.",
          "Changing the shard key later is very expensive, so decide carefully and test with realistic data.",
          "The code measures skew for two candidate keys."
        ],
        "example": "Organising a school's files by class section keeps each class's papers together; organising them by the student's first letter scatters a class across many cabinets.",
        "code": "from collections import Counter\n\norders = [(\"IN\", \"t1\"), (\"IN\", \"t2\"), (\"IN\", \"t3\"), (\"IN\", \"t1\"), (\"US\", \"t4\"), (\"IN\", \"t5\"), (\"SG\", \"t6\"), (\"IN\", \"t2\")]\n\ndef skew(keys, shards=3):\n    load = Counter(hash_key(k) % shards for k in keys)\n    counts = [load.get(s, 0) for s in range(shards)]\n    return max(counts) / (sum(counts) / shards)\n\ndef hash_key(k):\n    return sum(ord(c) for c in k)\n\nprint(f\"by country: skew {skew([c for c, _ in orders]):.2f}\")\nprint(f\"by tenant:  skew {skew([t for _, t in orders]):.2f}\")",
        "output": "by country: skew 2.62\nby tenant:  skew 1.12",
        "codeNotes": [
          {
            "line": 8,
            "note": "Busiest shard compared with the average."
          },
          {
            "line": 13,
            "note": "Most orders are from one country: a hot shard."
          }
        ],
        "tryIt": "Add 10 more orders from different tenants in India. How do the two skews change?",
        "check": {
          "question": "Why is \"country\" often a poor shard key?",
          "options": [
            "Countries change often",
            "Few values and uneven sizes create hot shards",
            "It cannot be hashed"
          ],
          "answer": 1,
          "why": "Low cardinality and skewed distribution concentrate load."
        }
      },
      {
        "title": "Resharding",
        "say": [
          "Data grows and shards fill up, so you will eventually need more shards. Moving data while the system runs is called resharding.",
          "With hash % N, changing N moves most keys (Day 4). Consistent hashing or a fixed large number of logical shards avoids that.",
          "A common trick: create many logical shards (say 1024) up front and map them to a few physical servers. Resharding moves whole logical shards to new servers.",
          "Moves are done online: copy the data, keep copying new changes, then switch routing and delete the old copy.",
          "During the switch, a short pause in writes for the moving shard, or a double-write period, keeps the old and new copies identical.",
          "Always test resharding before you urgently need it; doing it for the first time during a crisis is risky.",
          "The example maps logical shards to servers and moves some to a new server."
        ],
        "example": "Packing a house into many small labelled boxes instead of a few huge ones: moving to a bigger house means carrying some boxes to new rooms, not repacking everything.",
        "code": "LOGICAL = 16\nplacement = {ls: f\"server-{ls % 2}\" for ls in range(LOGICAL)}\n\ndef server_for(key):\n    return placement[sum(map(ord, key)) % LOGICAL]\n\nprint(\"before:\", sorted(set(placement.values())))\nfor ls in range(0, LOGICAL, 3):\n    placement[ls] = \"server-2\"\nprint(\"moved logical shards:\", [ls for ls, s in placement.items() if s == \"server-2\"])\nprint(\"key user-42 now lives on\", server_for(\"user-42\"))",
        "output": "before: ['server-0', 'server-1']\nmoved logical shards: [0, 3, 6, 9, 12, 15]\nkey user-42 now lives on server-0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Many logical shards mapped onto few servers."
          },
          {
            "line": 9,
            "note": "Resharding moves whole logical shards."
          }
        ],
        "tryIt": "How many logical shards did server-2 receive? What share of the data is that?",
        "check": {
          "question": "Why create many logical shards up front?",
          "options": [
            "To use more disk",
            "So resharding moves whole logical shards instead of rehashing every key",
            "Logical shards are faster to query"
          ],
          "answer": 1,
          "why": "A fixed key-to-logical-shard mapping never changes; only placement does."
        }
      },
      {
        "title": "Queries across shards",
        "say": [
          "A query that includes the shard key goes to one shard: fast and simple.",
          "A query without it (for example \"top 10 products by sales across all customers\") must scatter to every shard and gather the results.",
          "Scatter-gather is slower and its latency is set by the slowest shard, the fan-out problem from Day 1.",
          "Joins across shards and multi-shard transactions are hard; they need the sagas and 2PC of earlier lessons, or should be avoided by design.",
          "Keep cross-shard analytics in a separate system (a data warehouse fed from the shards) rather than running them on live shards.",
          "Designing the data model so that the most common queries include the shard key is one of the most valuable decisions in a sharded system.",
          "The example gathers a top-3 across three shards."
        ],
        "example": "Asking every branch of a bank for its largest deposits and combining their answers, rather than one branch knowing everything.",
        "code": "import heapq\n\nshards = {\n    \"shard_0\": [(\"pen\", 120), (\"book\", 540)],\n    \"shard_1\": [(\"bag\", 800), (\"pen\", 90)],\n    \"shard_2\": [(\"shoe\", 650), (\"cap\", 60)],\n}\npartial = [heapq.nlargest(3, rows, key=lambda r: r[1]) for rows in shards.values()]\noverall = heapq.nlargest(3, [r for p in partial for r in p], key=lambda r: r[1])\nprint(\"each shard returns its own top 3, then we merge:\", overall)",
        "output": "each shard returns its own top 3, then we merge: [('bag', 800), ('shoe', 650), ('book', 540)]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Scatter: each shard computes a partial answer."
          },
          {
            "line": 9,
            "note": "Gather: merge the partial answers."
          }
        ],
        "tryIt": "Why is asking each shard for its top 3 enough to find the overall top 3?",
        "check": {
          "question": "What is scatter-gather?",
          "options": [
            "Moving shards between servers",
            "Sending a query to every shard and combining the results",
            "A type of shard key"
          ],
          "answer": 1,
          "why": "Queries without the shard key must ask all shards and merge the answers."
        }
      }
    ],
    "summary": [
      "Sharding splits rows across servers when one machine is not enough.",
      "Range sharding helps range queries but can create hot spots.",
      "Hash sharding spreads evenly; directories allow custom placement.",
      "Choose shard keys with high cardinality that keep related data together.",
      "Use many logical shards for resharding; avoid cross-shard queries where possible."
    ],
    "projectStep": {
      "title": "Sharding",
      "steps": [
        "Add shard_for_customer and range_shard to dist_toolkit.py.",
        "Measure skew for two shard keys on a sample of 50 made-up orders.",
        "Bonus: implement scatter-gather top-k across three shards."
      ]
    }
  },
  {
    "day": 19,
    "title": "Read Replicas, Replication Lag & Read-Your-Own-Writes Consistency",
    "goal": "You can scale reads with replicas, explain replication lag and its effects, route queries to keep read-your-own-writes consistency, balance reads across replicas, and alert on lag.",
    "minutes": 30,
    "recap": "Yesterday you split data with sharding. Most apps read far more than they write, and read replicas are the easiest way to scale those reads.",
    "parts": [
      {
        "title": "Primary and read replicas",
        "say": [
          "In primary-replica (leader-follower) replication, all writes go to the primary. The primary streams its changes to one or more replicas.",
          "Replicas serve reads, so read capacity grows with the number of replicas. Many apps read 10 to 100 times more than they write.",
          "Replicas also help availability: if the primary fails, a replica can be promoted.",
          "They can also be placed in other regions, so users far from the primary get fast local reads.",
          "Replication is usually asynchronous: the primary confirms a write before replicas have it, for speed.",
          "Lag is usually milliseconds, but it can grow to seconds or minutes under heavy load, and code must be written for the bad case, not the typical one.",
          "That creates replication lag: a short time when replicas show older data than the primary.",
          "The example sends reads round-robin to replicas and writes to the primary."
        ],
        "example": "A head office publishing price lists that branch offices copy: customers can ask any branch for prices, but a price change reaches branches a little later.",
        "code": "primary = {\"price:sku-1\": 499}\nreplicas = [dict(primary), dict(primary)]\n\nprimary[\"price:sku-1\"] = 449\nprint(\"primary:\", primary[\"price:sku-1\"])\nprint(\"replicas (before sync):\", [r[\"price:sku-1\"] for r in replicas])\nfor r in replicas:\n    r.update(primary)\nprint(\"replicas (after sync):\", [r[\"price:sku-1\"] for r in replicas])",
        "output": "primary: 449\nreplicas (before sync): [499, 499]\nreplicas (after sync): [449, 449]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Writes go to the primary only."
          },
          {
            "line": 6,
            "note": "Replicas lag until changes arrive."
          }
        ],
        "tryIt": "Sync only the first replica. What would two users see if they hit different replicas?",
        "check": {
          "question": "What is replication lag?",
          "options": [
            "The time to write to the primary",
            "The delay before replicas receive the primary's changes",
            "A slow network card"
          ],
          "answer": 1,
          "why": "Asynchronous replicas trail the primary by some time."
        }
      },
      {
        "title": "The read-your-own-writes problem",
        "say": [
          "A user updates their profile photo (a write to the primary), then the page reloads and reads from a lagging replica. The old photo appears, and the user thinks the update failed.",
          "Read-your-own-writes (RYW) consistency guarantees a user always sees their own changes, even if others may briefly see old data.",
          "One simple approach: after a user writes, send that user's reads to the primary for a short window, longer than typical lag.",
          "A cookie or token can carry the last-write time, so any app server handling the user's next request knows to use the primary.",
          "Other approaches: remember the write's position in the replication log and only read from replicas that have reached it.",
          "RYW is a session guarantee: it is about one user's experience, not global consistency.",
          "The example shows the stale read that confuses users."
        ],
        "example": "Posting a letter and then asking a local post office whether it has arrived: of course it has not yet, but you wanted to confirm you sent it.",
        "code": "primary = {\"photo:u1\": \"old.jpg\"}\nreplica = dict(primary)\n\nprimary[\"photo:u1\"] = \"new.jpg\"\nprint(\"user reloads profile from replica:\", replica[\"photo:u1\"], \"<- looks like the update failed\")\nprint(\"user reads from primary:\", primary[\"photo:u1\"])",
        "output": "user reloads profile from replica: old.jpg <- looks like the update failed\nuser reads from primary: new.jpg",
        "codeNotes": [
          {
            "line": 5,
            "note": "The replica has not caught up yet."
          }
        ],
        "tryIt": "How long should the \"read from primary\" window be? What information would you need?",
        "check": {
          "question": "What does read-your-own-writes guarantee?",
          "options": [
            "Everyone sees every write instantly",
            "A user always sees their own recent changes",
            "Writes never fail"
          ],
          "answer": 1,
          "why": "It is a per-session guarantee about a user's own writes."
        }
      },
      {
        "title": "Routing queries by session",
        "say": [
          "Practice 1: route_query(op, session, now, replicas). A WRITE records session[\"last_write\"] = now and goes to MASTER.",
          "A READ within 5000 ms of the session's last write also goes to MASTER. Other reads go to the replicas in turn, using session[\"reads\"] as a counter.",
          "The session dict belongs to one user, so only that user is pinned to the primary after writing. Everyone else keeps using replicas.",
          "In a web app, the session could live in a signed cookie or in a shared cache keyed by the user id.",
          "Round-robin spreads reads evenly across replicas.",
          "The window (5 seconds here) should comfortably exceed normal lag; monitor lag to confirm.",
          "The example routes a sequence of operations for one session."
        ],
        "example": "After you change your address, the bank's staff check the main system for your account for the next few minutes, while other customers are served from the local copy.",
        "code": "def route_query(op, session, now, replicas):\n    if op == \"WRITE\":\n        session[\"last_write\"] = now\n        return \"MASTER\"\n    last = session.get(\"last_write\")\n    if last is not None and now - last < 5000:\n        return \"MASTER\"\n    reads = session.get(\"reads\", 0)\n    session[\"reads\"] = reads + 1\n    return replicas[reads % len(replicas)]\n\nsession, replicas = {}, [\"replica-1\", \"replica-2\"]\nfor op, now in [(\"READ\", 0), (\"READ\", 100), (\"WRITE\", 200), (\"READ\", 300), (\"READ\", 5100), (\"READ\", 5300), (\"READ\", 5400)]:\n    print(f\"t={now:>4} {op:5} -> {route_query(op, session, now, replicas)}\")",
        "output": "t=   0 READ  -> replica-1\nt= 100 READ  -> replica-2\nt= 200 WRITE -> MASTER\nt= 300 READ  -> MASTER\nt=5100 READ  -> MASTER\nt=5300 READ  -> replica-1\nt=5400 READ  -> replica-2",
        "codeNotes": [
          {
            "line": 3,
            "note": "Remember when this session last wrote."
          },
          {
            "line": 6,
            "note": "Recent writer: read from the primary."
          },
          {
            "line": 10,
            "note": "Otherwise take the next replica in turn."
          }
        ],
        "tryIt": "Add a second session that never writes and interleave its reads. Is it ever sent to MASTER?",
        "check": {
          "question": "Why store last_write in the session rather than globally?",
          "options": [
            "Globals are slow",
            "Only the user who wrote needs to read from the primary; others can use replicas",
            "Sessions are encrypted"
          ],
          "answer": 1,
          "why": "Pinning everyone to the primary after any write would defeat the replicas."
        }
      },
      {
        "title": "Measuring and alerting on lag",
        "say": [
          "Lag is measured as time (seconds behind the primary) or as position (bytes or transactions behind in the replication log).",
          "Practice 2: lag_exceeded(lag_seconds, max_lag) returns True when lag is above the limit.",
          "When a replica lags too much, remove it from the read pool until it catches up, and alert the team.",
          "Graphs of lag over time are among the most useful database dashboards: spikes line up with batch jobs, deploys or traffic peaks.",
          "Common causes: heavy write bursts, long-running queries on the replica, slow disks, or network problems between regions.",
          "Lag also matters for failover: promoting a lagging replica loses the writes it had not received.",
          "The example checks several replicas and removes the slow one from routing."
        ],
        "example": "A newsreader who is more than a day behind the news is taken off air until they catch up.",
        "code": "def lag_exceeded(lag_seconds, max_lag=10):\n    return lag_seconds > max_lag\n\nlag = {\"replica-1\": 0.4, \"replica-2\": 14.2, \"replica-3\": 2.1}\nhealthy = [r for r, s in lag.items() if not lag_exceeded(s)]\nfor r, s in lag.items():\n    print(f\"{r}: {s:>5}s {'ALERT, removed from pool' if lag_exceeded(s) else 'ok'}\")\nprint(\"read pool:\", healthy)",
        "output": "replica-1:   0.4s ok\nreplica-2:  14.2s ALERT, removed from pool\nreplica-3:   2.1s ok\nread pool: ['replica-1', 'replica-3']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Above the limit means too stale to serve."
          },
          {
            "line": 5,
            "note": "Route reads only to replicas within the limit."
          }
        ],
        "tryIt": "Lower max_lag to 1 second. Which replicas remain in the pool?",
        "check": {
          "question": "What should happen to a replica whose lag exceeds the limit?",
          "options": [
            "Keep sending it reads",
            "Remove it from the read pool until it catches up, and alert",
            "Promote it to primary"
          ],
          "answer": 1,
          "why": "Serving from it would show very stale data."
        }
      },
      {
        "title": "Synchronous, asynchronous and semi-synchronous",
        "say": [
          "Synchronous replication waits for replicas to confirm before acknowledging a write: no lag for those replicas, but slower writes, and a slow replica slows everyone.",
          "Asynchronous replication acknowledges immediately: fast, but a primary crash can lose recent writes that had not reached any replica.",
          "Semi-synchronous replication waits for at least one replica: a middle ground that bounds data loss without waiting for all.",
          "This is the PACELC latency-versus-consistency trade-off from Day 2 in practice.",
          "Financial systems usually choose at least semi-synchronous replication, because losing an acknowledged payment is unacceptable.",
          "Cloud databases often let you choose per replica, for example one synchronous replica in the same region and asynchronous ones far away.",
          "The example compares write latency and potential data loss for the three modes."
        ],
        "example": "Sending a document by hand to one colleague and waiting for their signature before telling the client \"done\", while emailing copies to others without waiting.",
        "code": "replica_ack_ms = [4, 6, 90]\nmodes = {\n    \"synchronous (all)\": max(replica_ack_ms),\n    \"semi-synchronous (1)\": min(replica_ack_ms),\n    \"asynchronous\": 0,\n}\nfor mode, wait in modes.items():\n    loss = \"none\" if mode.startswith(\"synchronous\") else (\"small\" if wait else \"possible\")\n    print(f\"{mode:22} write waits {wait:>3} ms, data loss on primary crash: {loss}\")",
        "output": "synchronous (all)      write waits  90 ms, data loss on primary crash: none\nsemi-synchronous (1)   write waits   4 ms, data loss on primary crash: small\nasynchronous           write waits   0 ms, data loss on primary crash: possible",
        "codeNotes": [
          {
            "line": 3,
            "note": "Waiting for every replica means waiting for the slowest."
          }
        ],
        "tryIt": "If the 90 ms replica is in another region, which mode would you choose for a payments database?",
        "check": {
          "question": "What does semi-synchronous replication wait for?",
          "options": [
            "Every replica",
            "At least one replica",
            "No replica"
          ],
          "answer": 1,
          "why": "Waiting for one replica bounds data loss without waiting for the slowest."
        }
      },
      {
        "title": "Other session guarantees",
        "say": [
          "Monotonic reads: a user never sees data go backwards in time. Reading from a fresh replica and then a lagging one can show a comment, then hide it.",
          "Sticky routing (sending each user to the same replica) gives monotonic reads cheaply.",
          "If a user's replica fails, move them to another replica that is at least as up to date, or to the primary, to keep the guarantee.",
          "Consistent prefix reads: if writes happened in an order, readers see them in that order, so an answer never appears before its question.",
          "These guarantees are weaker than full consistency but cover what users notice most.",
          "Chat apps, social feeds and comment threads rely on them heavily, because users notice immediately when order looks wrong.",
          "Tomorrow you will protect services from failing dependencies with circuit breakers.",
          "The example shows a read going backwards and how sticky routing prevents it."
        ],
        "example": "Watching a cricket score on two TVs with different delays: switching between them can make the score go backwards. Sticking to one TV avoids the confusion.",
        "code": "replica_views = {\"fresh\": [\"post\", \"comment-1\", \"comment-2\"], \"lagging\": [\"post\", \"comment-1\"]}\n\ndef read(replica):\n    return replica_views[replica]\n\nprint(\"alternating replicas:\", [len(read(r)) for r in [\"fresh\", \"lagging\", \"fresh\"]], \"comments seen\")\nuser_replica = {\"u1\": \"lagging\"}\nprint(\"sticky routing:\", [len(read(user_replica[\"u1\"])) for _ in range(3)], \"comments seen\")",
        "output": "alternating replicas: [3, 2, 3] comments seen\nsticky routing: [2, 2, 2] comments seen",
        "codeNotes": [
          {
            "line": 6,
            "note": "The count goes 3, 2, 3: time appears to go backwards."
          },
          {
            "line": 8,
            "note": "Sticking to one replica never goes backwards."
          }
        ],
        "tryIt": "Is sticky routing enough for read-your-own-writes? Why not?",
        "check": {
          "question": "What does monotonic reads guarantee?",
          "options": [
            "Reads are always fresh",
            "A user never sees data go backwards in time",
            "Reads are sorted"
          ],
          "answer": 1,
          "why": "Once a user has seen a version, later reads never show an older one."
        }
      }
    ],
    "summary": [
      "Writes go to the primary; replicas serve reads and lag behind.",
      "Read-your-own-writes: route a user's reads to the primary shortly after they write.",
      "Spread other reads across replicas round-robin.",
      "Remove replicas whose lag exceeds a limit, and alert.",
      "Choose sync, semi-sync or async replication; sticky routing gives monotonic reads."
    ],
    "projectStep": {
      "title": "Read replicas",
      "steps": [
        "Add route_query and lag_exceeded to dist_toolkit.py.",
        "Simulate two sessions, one writing and one only reading, and print where each query goes.",
        "Bonus: remove lagging replicas from the pool before routing."
      ]
    }
  },
  {
    "day": 20,
    "title": "Circuit Breakers (Resilience4j / Envoy) & Bulkhead Isolation",
    "goal": "You can explain cascading failures, implement a circuit breaker with closed, open and half-open states, report its status, isolate resources with bulkheads, and add fallbacks.",
    "minutes": 30,
    "recap": "Last week you made messages safe to retry. But retrying a dependency that is down makes things worse. Today you learn to fail fast and contain the damage.",
    "parts": [
      {
        "title": "Cascading failures",
        "say": [
          "When a dependency (say the payments service) becomes slow, callers wait on it. Their threads and connections fill up with waiting calls.",
          "Slow is often worse than down: a service that refuses connections fails quickly, while a slow one ties up callers for the full timeout.",
          "Soon the callers cannot serve anything, even requests that do not need payments. The failure spreads upstream: a cascading failure.",
          "In microservice systems, one slow service deep in a chain can make a whole website unresponsive within minutes.",
          "Retries make it worse: every caller retries, multiplying the load on the struggling service.",
          "The fix is to stop calling a dependency that is clearly failing, fail fast, and give it time to recover.",
          "Netflix popularised this pattern with its Hystrix library, after seeing how one slow service could take down its whole streaming site.",
          "The simulation shows threads filling up while a dependency hangs.",
          "Timeouts (Day 1) limit how long each call waits; circuit breakers stop the calls altogether."
        ],
        "example": "One broken ticket machine at a station: the queue for it grows until it blocks the corridor, and people going to other platforms cannot get through.",
        "code": "pool_size = 10\nbusy = 0\nfor second in range(1, 7):\n    new_calls = 3\n    busy = min(pool_size, busy + new_calls)\n    free = pool_size - busy\n    print(f\"t={second}s: {busy} threads stuck waiting on payments, {free} free for other work\")",
        "output": "t=1s: 3 threads stuck waiting on payments, 7 free for other work\nt=2s: 6 threads stuck waiting on payments, 4 free for other work\nt=3s: 9 threads stuck waiting on payments, 1 free for other work\nt=4s: 10 threads stuck waiting on payments, 0 free for other work\nt=5s: 10 threads stuck waiting on payments, 0 free for other work\nt=6s: 10 threads stuck waiting on payments, 0 free for other work",
        "codeNotes": [
          {
            "line": 5,
            "note": "Calls to a hanging dependency never return, so threads pile up."
          }
        ],
        "tryIt": "Add a timeout that frees 2 threads per second. Does the pool still fill up?",
        "check": {
          "question": "What is a cascading failure?",
          "options": [
            "A slow database query",
            "A failure in one service spreading to the services that call it",
            "A network cable fault"
          ],
          "answer": 1,
          "why": "Waiting callers run out of resources and fail too."
        }
      },
      {
        "title": "The circuit breaker states",
        "say": [
          "A circuit breaker wraps calls to a dependency and has three states. CLOSED: calls pass through normally, and failures are counted.",
          "OPEN: after too many failures, calls are rejected immediately with an error, without contacting the dependency.",
          "Some breakers count the failure rate over a sliding window, such as 50% of the last 20 calls, instead of consecutive failures.",
          "HALF_OPEN: after a reset timeout, one trial call is allowed. If it succeeds, the breaker closes; if it fails, it opens again.",
          "Failing fast frees the caller's resources and gives the dependency room to recover.",
          "It also protects the dependency: fewer calls arriving means it can recover instead of being buried under retries.",
          "Libraries such as Resilience4j (Java) and proxies such as Envoy provide circuit breakers.",
          "The example prints the state transitions for a sequence of outcomes."
        ],
        "example": "An electrical circuit breaker at home: when there is a fault, it trips and cuts the power, protecting the wiring. After the fault is fixed, you switch it back on to test.",
        "code": "transitions = [\n    (\"CLOSED\", \"failure count reaches threshold\", \"OPEN\"),\n    (\"OPEN\", \"reset timeout passes\", \"HALF_OPEN\"),\n    (\"HALF_OPEN\", \"trial call succeeds\", \"CLOSED\"),\n    (\"HALF_OPEN\", \"trial call fails\", \"OPEN\"),\n]\nfor start, event, end in transitions:\n    print(f\"{start:9} --[{event}]--> {end}\")",
        "output": "CLOSED    --[failure count reaches threshold]--> OPEN\nOPEN      --[reset timeout passes]--> HALF_OPEN\nHALF_OPEN --[trial call succeeds]--> CLOSED\nHALF_OPEN --[trial call fails]--> OPEN",
        "codeNotes": [
          {
            "line": 4,
            "note": "One successful trial closes the circuit again."
          }
        ],
        "tryIt": "Draw the states on paper as a diagram with arrows, using this list.",
        "check": {
          "question": "What happens to calls while the breaker is OPEN?",
          "options": [
            "They are queued",
            "They are rejected immediately without calling the dependency",
            "They are retried three times"
          ],
          "answer": 1,
          "why": "OPEN means fail fast, to protect both sides."
        }
      },
      {
        "title": "Implementing the breaker",
        "say": [
          "Practice 1: CircuitBreaker.call(fn, now). If OPEN and the reset timeout has not passed since opened_at, raise CircuitOpenError without calling fn.",
          "If the timeout has passed, move to HALF_OPEN and let this call through.",
          "If fn raises, count a failure and re-raise. Move to OPEN (recording opened_at) once failures reach the threshold, or immediately if this was the HALF_OPEN trial.",
          "Only count errors that indicate the dependency is unhealthy, such as timeouts and server errors. A \"not found\" answer is a normal reply, not a failure.",
          "On success, reset failures to 0, set CLOSED and return the result.",
          "Passing now in keeps tests exact, as with every time-based component in this course.",
          "Real breakers also need to be safe when many threads call them at once, usually with a lock around the state changes.",
          "The example drives the breaker through all states."
        ],
        "example": "A shop that stops ordering from a supplier after three failed deliveries, waits a week, then places one small trial order before trusting them again.",
        "code": "class CircuitOpenError(Exception):\n    pass\n\nclass CircuitBreaker:\n    def __init__(self, threshold=3, reset_timeout_ms=1000):\n        self.threshold, self.reset_timeout_ms = threshold, reset_timeout_ms\n        self.state, self.failures, self.opened_at = \"CLOSED\", 0, None\n\n    def call(self, fn, now):\n        if self.state == \"OPEN\":\n            if now - self.opened_at < self.reset_timeout_ms:\n                raise CircuitOpenError(\"circuit open\")\n            self.state = \"HALF_OPEN\"\n        try:\n            result = fn()\n        except Exception:\n            self.failures += 1\n            if self.state == \"HALF_OPEN\" or self.failures >= self.threshold:\n                self.state, self.opened_at = \"OPEN\", now\n            raise\n        self.failures, self.state = 0, \"CLOSED\"\n        return result\n\ndef down():\n    raise ConnectionError(\"payments down\")\n\ncb = CircuitBreaker()\nfor now, fn in [(0, down), (10, down), (20, down), (30, down), (1100, lambda: \"ok\"), (1200, lambda: \"ok\")]:\n    try:\n        print(f\"t={now:>4}: {cb.call(fn, now)} -> {cb.state}\")\n    except Exception as err:\n        print(f\"t={now:>4}: {type(err).__name__} -> {cb.state}\")",
        "output": "t=   0: ConnectionError -> CLOSED\nt=  10: ConnectionError -> CLOSED\nt=  20: ConnectionError -> OPEN\nt=  30: CircuitOpenError -> OPEN\nt=1100: ok -> CLOSED\nt=1200: ok -> CLOSED",
        "codeNotes": [
          {
            "line": 11,
            "note": "OPEN and still cooling down: fail fast."
          },
          {
            "line": 18,
            "note": "Trip on the threshold, or at once if the trial failed."
          },
          {
            "line": 21,
            "note": "Success closes the circuit and clears the count."
          }
        ],
        "tryIt": "Make the call at t=1100 fail. What state does the breaker end in, and when can the next trial happen?",
        "check": {
          "question": "What happens if the HALF_OPEN trial call fails?",
          "options": [
            "The breaker closes",
            "The breaker opens again straight away",
            "The failure count resets"
          ],
          "answer": 1,
          "why": "A failed trial shows the dependency is still unhealthy."
        }
      },
      {
        "title": "Reporting breaker status",
        "say": [
          "Practice 2: format_circuit_status(state) returns \"[CIRCUIT]: STATE\", a consistent line for logs and dashboards.",
          "Log every state change with the dependency name and the reason. An OPEN breaker is an important signal for on-call engineers.",
          "Logging every rejected call would flood the logs while a breaker is open; count them instead.",
          "Export the state as a metric (0 closed, 1 half-open, 2 open) so dashboards can show it over time.",
          "Alert when a breaker stays open for longer than expected; it may mean a dependency is really down.",
          "Show users a helpful message when a feature is unavailable, rather than a generic error.",
          "The example logs transitions for three dependencies."
        ],
        "example": "The status board at an airport showing each gate as open, boarding or closed, so staff know at a glance where problems are.",
        "code": "def format_circuit_status(state):\n    return f\"[CIRCUIT]: {state}\"\n\nSTATE_METRIC = {\"CLOSED\": 0, \"HALF_OPEN\": 1, \"OPEN\": 2}\nbreakers = {\"payments\": \"OPEN\", \"inventory\": \"CLOSED\", \"recommendations\": \"HALF_OPEN\"}\nfor dep, state in breakers.items():\n    print(f\"{dep:16} {format_circuit_status(state)}  metric={STATE_METRIC[state]}\")\nprint(\"alert:\", [d for d, s in breakers.items() if s == \"OPEN\"])",
        "output": "payments         [CIRCUIT]: OPEN  metric=2\ninventory        [CIRCUIT]: CLOSED  metric=0\nrecommendations  [CIRCUIT]: HALF_OPEN  metric=1\nalert: ['payments']",
        "codeNotes": [
          {
            "line": 2,
            "note": "One consistent format for every log line."
          },
          {
            "line": 4,
            "note": "Numbers for dashboards."
          }
        ],
        "tryIt": "Add a time for each state change and print how long payments has been open.",
        "check": {
          "question": "What does format_circuit_status(\"OPEN\") return?",
          "options": [
            "\"OPEN\"",
            "\"[CIRCUIT]: OPEN\"",
            "\"circuit open\""
          ],
          "answer": 1,
          "why": "The fixed prefix makes lines easy to search."
        }
      },
      {
        "title": "Bulkheads",
        "say": [
          "A bulkhead isolates resources so one failing dependency cannot use them all. The name comes from ships, whose hulls are divided into watertight compartments.",
          "Give each dependency its own limited pool of threads or connections. If payments hangs, only the payments pool fills; inventory and search keep working.",
          "Bulkheads work together with circuit breakers: the bulkhead limits the damage while the breaker notices the failure and stops calls.",
          "Size pools from measurements: normal concurrency plus some headroom.",
          "Queues in front of pools need limits too; an unbounded queue just moves the pile-up from threads to memory.",
          "Separate critical traffic (checkout) from non-critical traffic (recommendations) so a spike in one cannot starve the other.",
          "The example gives each dependency its own pool."
        ],
        "example": "A ship divided into watertight compartments: a hole floods one compartment, but the ship stays afloat.",
        "code": "pools = {\"payments\": 4, \"inventory\": 4, \"search\": 4}\nin_use = {name: 0 for name in pools}\n\ndef try_call(dep, hangs):\n    if in_use[dep] >= pools[dep]:\n        return f\"{dep}: rejected (pool full)\"\n    if hangs:\n        in_use[dep] += 1\n        return f\"{dep}: waiting ({in_use[dep]}/{pools[dep]})\"\n    return f\"{dep}: ok\"\n\nfor _ in range(5):\n    print(try_call(\"payments\", hangs=True))\nprint(try_call(\"inventory\", hangs=False))\nprint(try_call(\"search\", hangs=False))",
        "output": "payments: waiting (1/4)\npayments: waiting (2/4)\npayments: waiting (3/4)\npayments: waiting (4/4)\npayments: rejected (pool full)\ninventory: ok\nsearch: ok",
        "codeNotes": [
          {
            "line": 5,
            "note": "A full pool rejects new calls instead of taking other pools' resources."
          },
          {
            "line": 14,
            "note": "Other dependencies are unaffected."
          }
        ],
        "tryIt": "Replace the three pools with one shared pool of 12. How many payment calls can hang before search is affected?",
        "check": {
          "question": "What does a bulkhead protect against?",
          "options": [
            "Slow databases only",
            "One failing dependency using up all shared resources",
            "Too many circuit breakers"
          ],
          "answer": 1,
          "why": "Separate pools contain the damage to the failing dependency."
        }
      },
      {
        "title": "Fallbacks and graceful degradation",
        "say": [
          "When a call fails or the breaker is open, return a fallback where possible: cached data, a default value, or a simpler feature.",
          "Recommendations down? Show popular items. Reviews service down? Hide the reviews section. Currency rates down? Use the last known rates with a note.",
          "Never invent data for critical paths: a payment must not \"succeed\" as a fallback. Some failures must be shown honestly.",
          "Fallbacks should be cheap and reliable themselves; a fallback that calls another fragile service just moves the problem.",
          "Tell users what is happening when a fallback is used, for example \"showing prices from 10 minutes ago\", so they are not misled.",
          "Test fallbacks regularly, for example by turning off a dependency in a staging environment.",
          "Tomorrow's milestone combines rate limiting and circuit breakers into an API gateway."
        ],
        "example": "A restaurant whose tandoor breaks down still serves the rest of the menu and tells guests which dishes are unavailable, rather than closing.",
        "code": "cache = {\"recs:u1\": [\"popular item A\", \"popular item B\"]}\n\ndef get_recommendations(user, breaker_open):\n    if breaker_open:\n        return cache.get(f\"recs:{user}\", []), \"fallback: cached popular items\"\n    return [\"personal pick 1\", \"personal pick 2\"], \"live\"\n\ndef charge(amount, breaker_open):\n    if breaker_open:\n        return \"Payment is unavailable right now, please try again shortly\"\n    return f\"charged Rs {amount}\"\n\nprint(get_recommendations(\"u1\", breaker_open=True))\nprint(charge(499, breaker_open=True))",
        "output": "(['popular item A', 'popular item B'], 'fallback: cached popular items')\nPayment is unavailable right now, please try again shortly",
        "codeNotes": [
          {
            "line": 5,
            "note": "A safe, cheap fallback for a non-critical feature."
          },
          {
            "line": 10,
            "note": "Critical paths fail honestly instead of pretending."
          }
        ],
        "tryIt": "Add a fallback for a \"delivery estimate\" feature. What is a safe default?",
        "check": {
          "question": "When should a fallback NOT pretend to succeed?",
          "options": [
            "For recommendations",
            "For critical operations like payments",
            "For cached content"
          ],
          "answer": 1,
          "why": "Faking success on critical paths causes real harm."
        }
      }
    ],
    "summary": [
      "Slow dependencies cause cascading failures as callers run out of resources.",
      "Circuit breakers: CLOSED counts failures, OPEN fails fast, HALF_OPEN tests recovery.",
      "Report breaker states consistently and alert on long OPEN periods.",
      "Bulkheads give each dependency its own resource pool.",
      "Use cheap fallbacks for non-critical features; fail honestly on critical ones."
    ],
    "projectStep": {
      "title": "Resilience",
      "steps": [
        "Add CircuitBreaker and format_circuit_status to dist_toolkit.py.",
        "Drive a breaker through CLOSED, OPEN, HALF_OPEN and back to CLOSED with a fake clock.",
        "Bonus: add a bulkhead limit and a cached fallback for one dependency."
      ]
    }
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway",
    "goal": "You can build an API gateway that rate-limits each client, protects backends with a circuit breaker, maps outcomes to the right HTTP status codes, and adds timing headers and tests for every path.",
    "minutes": 30,
    "recap": "This week covered clocks, CRDTs, sharding, replicas and circuit breakers. Milestone 3 puts rate limiting and circuit breaking together at the front door of your system: the API gateway.",
    "parts": [
      {
        "title": "What a gateway does",
        "say": [
          "An API gateway is the single entry point for client traffic. It sits in front of many backend services and applies shared rules before any request reaches them.",
          "Typical duties: authentication, rate limiting, routing to the right service, circuit breaking, timeouts, and adding standard headers such as request ids and timings.",
          "Doing these once at the edge is simpler and safer than re-implementing them in every service.",
          "It also gives one place to change policy: raising a client's limit or blocking an abusive key needs no change to any backend service.",
          "The gateway must be fast and highly available, since every request passes through it. It usually runs as several identical instances behind a load balancer.",
          "Today's milestone focuses on the two protections you built recently: per-client rate limiting and a circuit breaker around the backend.",
          "The example lists a request's journey through the gateway."
        ],
        "example": "The security desk of an office tower: it checks your pass, limits how many visitors go up at once, and tells you when a floor is closed, before you ever reach the lift.",
        "code": "journey = [\n    \"authenticate the client\",\n    \"check the client's rate limit (429 if exceeded)\",\n    \"call the backend through the circuit breaker (503 if open)\",\n    \"map backend errors to 500\",\n    \"add X-Response-Time and request id headers\",\n]\nfor i, step in enumerate(journey, start=1):\n    print(i, step)",
        "output": "1 authenticate the client\n2 check the client's rate limit (429 if exceeded)\n3 call the backend through the circuit breaker (503 if open)\n4 map backend errors to 500\n5 add X-Response-Time and request id headers",
        "codeNotes": [
          {
            "line": 3,
            "note": "Rate limiting stops one client from overwhelming everyone."
          },
          {
            "line": 4,
            "note": "The breaker protects the backend and fails fast."
          }
        ],
        "tryIt": "Where in this journey would you add caching of popular responses?",
        "check": {
          "question": "Why put rate limiting and circuit breaking in the gateway?",
          "options": [
            "Backends cannot do it",
            "Applying shared rules once at the edge is simpler and consistent",
            "Gateways are faster than backends"
          ],
          "answer": 1,
          "why": "Central enforcement avoids duplicating the logic in every service."
        }
      },
      {
        "title": "Per-client rate limiting",
        "say": [
          "Each client (an API key or a user) gets its own token bucket: a capacity that allows short bursts, and a refill rate that sets the long-run average.",
          "The gateway checks the bucket before doing any work. If the client is over its limit, it returns 429 Too Many Requests at once.",
          "Include a Retry-After header with 429 responses, telling well-behaved clients exactly how long to wait.",
          "Keeping the limiter check first protects everything behind it, including the circuit breaker's failure counts, from abusive traffic.",
          "In a real deployment, buckets live in a shared store such as Redis, so all gateway instances agree on each client's usage.",
          "Different plans can have different limits: free users 60 calls per minute, paying users 600.",
          "The example implements a small per-client limiter with a fake clock."
        ],
        "example": "A buffet where each guest may take three plates per hour: the counter keeps a tally per guest, not one shared tally for the whole room.",
        "code": "class ClientLimiter:\n    def __init__(self, capacity, refill_per_sec):\n        self.capacity, self.rate, self.buckets = capacity, refill_per_sec, {}\n\n    def is_allowed(self, client, now):\n        tokens, last = self.buckets.get(client, (self.capacity, now))\n        tokens = min(self.capacity, tokens + (now - last) * self.rate)\n        allowed = tokens >= 1\n        self.buckets[client] = (tokens - 1 if allowed else tokens, now)\n        return allowed\n\nlimiter = ClientLimiter(capacity=3, refill_per_sec=1)\ncalls = [(\"free-app\", 0), (\"free-app\", 0), (\"free-app\", 0), (\"free-app\", 0), (\"paid-app\", 0), (\"free-app\", 2)]\nfor client, t in calls:\n    print(f\"t={t} {client:9} allowed: {limiter.is_allowed(client, t)}\")",
        "output": "t=0 free-app  allowed: True\nt=0 free-app  allowed: True\nt=0 free-app  allowed: True\nt=0 free-app  allowed: False\nt=0 paid-app  allowed: True\nt=2 free-app  allowed: True",
        "codeNotes": [
          {
            "line": 7,
            "note": "Refill for the time since this client's last call."
          },
          {
            "line": 9,
            "note": "Spend a token only if the call is allowed."
          }
        ],
        "tryIt": "Give paid-app a capacity of 10 by keeping a separate limiter per plan.",
        "check": {
          "question": "Why does each client get its own bucket?",
          "options": [
            "Buckets are cheap",
            "So one busy client cannot use up everyone else's allowance",
            "Clients prefer it"
          ],
          "answer": 1,
          "why": "Per-client limits keep the system fair."
        }
      },
      {
        "title": "Handling a request end to end",
        "say": [
          "Practice 1: handle_gateway(client_id, is_allowed, breaker_call, backend). If is_allowed(client_id) is False, return {\"status\": 429}.",
          "Otherwise run breaker_call(backend). On success return {\"status\": 200, \"data\": result}. If it raises CircuitOpenError, return {\"status\": 503}; any other exception returns {\"status\": 500, \"error\": ...}.",
          "Order the except clauses from most specific to most general, so the circuit-open case is not swallowed by the generic handler.",
          "Never put raw internal error messages in responses to external clients; log the details and return a short, safe message with the request id.",
          "503 Service Unavailable tells clients the problem is temporary and they may retry later; 500 says the request failed inside the server.",
          "Passing the limiter and breaker in as functions keeps the gateway logic easy to test with fakes.",
          "The example exercises all four outcomes."
        ],
        "example": "A receptionist with a simple script: too many visits today, come back tomorrow; that department is closed, try later; something went wrong, here is the reason; or here is what you asked for.",
        "code": "class CircuitOpenError(Exception):\n    pass\n\ndef handle_gateway(client_id, is_allowed, breaker_call, backend):\n    if not is_allowed(client_id):\n        return {\"status\": 429}\n    try:\n        return {\"status\": 200, \"data\": breaker_call(backend)}\n    except CircuitOpenError:\n        return {\"status\": 503}\n    except Exception as err:\n        return {\"status\": 500, \"error\": str(err)}\n\ndef open_breaker(fn):\n    raise CircuitOpenError()\ndef failing_backend():\n    raise ValueError(\"bad row in orders table\")\npassthrough = lambda fn: fn()\n\nprint(handle_gateway(\"c1\", lambda c: False, passthrough, lambda: \"orders\"))\nprint(handle_gateway(\"c1\", lambda c: True, passthrough, lambda: [\"order-7\"]))\nprint(handle_gateway(\"c1\", lambda c: True, open_breaker, lambda: \"orders\"))\nprint(handle_gateway(\"c1\", lambda c: True, passthrough, failing_backend))",
        "output": "{'status': 429}\n{'status': 200, 'data': ['order-7']}\n{'status': 503}\n{'status': 500, 'error': 'bad row in orders table'}",
        "codeNotes": [
          {
            "line": 5,
            "note": "Rate limit first: no work for clients over their limit."
          },
          {
            "line": 9,
            "note": "The specific circuit-open case before the generic one."
          },
          {
            "line": 12,
            "note": "Anything else is a server error."
          }
        ],
        "tryIt": "Swap the two except clauses. Which test now gives the wrong status?",
        "check": {
          "question": "Which status should a client get when the backend's circuit is open?",
          "options": [
            "429",
            "500",
            "503"
          ],
          "answer": 2,
          "why": "503 Service Unavailable signals a temporary problem on the server side."
        }
      },
      {
        "title": "Timing headers",
        "say": [
          "Practice 2: response_time_header(ms) returns \"X-Response-Time: 12ms\". Gateways add headers like this so clients and tools can see how long the request took.",
          "Measure time at the gateway: from receiving the request to sending the response, including the backend call.",
          "Comparing the gateway's timing with the backend's own timing shows how much time is spent in the network and the gateway itself.",
          "Also add a request id header (for example X-Request-Id) and pass it to backends, so logs across services can be joined. Day 26 extends this into full distributed tracing.",
          "Timing headers help clients report slow requests precisely, and help you spot slow routes in logs.",
          "Do not leak internal details in headers, such as backend host names; they help attackers.",
          "The example measures and formats timings with a fake clock."
        ],
        "example": "A delivery receipt that shows when the order was placed and when it arrived, so everyone agrees how long it took.",
        "code": "def response_time_header(ms):\n    return f\"X-Response-Time: {ms}ms\"\n\nclock = iter([1000, 1012, 2000, 2350])\nfor request_id in [\"req-1\", \"req-2\"]:\n    start = next(clock)\n    end = next(clock)\n    print(request_id, response_time_header(end - start), f\"X-Request-Id: {request_id}\")",
        "output": "req-1 X-Response-Time: 12ms X-Request-Id: req-1\nreq-2 X-Response-Time: 350ms X-Request-Id: req-2",
        "codeNotes": [
          {
            "line": 2,
            "note": "Milliseconds with a unit, in a standard header."
          },
          {
            "line": 8,
            "note": "A request id lets logs across services be joined."
          }
        ],
        "tryIt": "Add a Server-Timing header that separates gateway time from backend time.",
        "check": {
          "question": "Why add a request id header at the gateway?",
          "options": [
            "It speeds up requests",
            "So logs from every service handling the request can be joined together",
            "Clients require it"
          ],
          "answer": 1,
          "why": "One id followed through all services makes debugging possible."
        }
      },
      {
        "title": "Testing every gateway path",
        "say": [
          "The gateway sits in front of everything, so its behaviour must be tested for every outcome: allowed and successful, rate limited, circuit open, backend error.",
          "Also test the order: a rate-limited request must not reach the breaker or the backend at all. Recording fakes prove it, as in the AI capstone.",
          "Test boundaries: exactly at the limit, just over it, and after the bucket refills.",
          "Run the same tests against every gateway instance configuration you deploy, since a missing setting on one instance can quietly disable a protection.",
          "Test the breaker together with the gateway: after enough backend errors, later calls should get 503 without reaching the backend.",
          "Table-driven tests keep these cases short and easy to extend.",
          "The example checks the order of calls for a rate-limited request."
        ],
        "example": "A fire drill for the front desk: each emergency is rehearsed, including making sure blocked visitors never reach the lifts.",
        "code": "class CircuitOpenError(Exception):\n    pass\n\ndef handle_gateway(client_id, is_allowed, breaker_call, backend):\n    if not is_allowed(client_id):\n        return {\"status\": 429}\n    try:\n        return {\"status\": 200, \"data\": breaker_call(backend)}\n    except CircuitOpenError:\n        return {\"status\": 503}\n    except Exception as err:\n        return {\"status\": 500, \"error\": str(err)}\n\ncalls = []\ndef recording_breaker(fn):\n    calls.append(\"breaker\")\n    return fn()\ndef backend():\n    calls.append(\"backend\")\n    return \"ok\"\n\nassert handle_gateway(\"c\", lambda c: False, recording_breaker, backend) == {\"status\": 429} and calls == []\nassert handle_gateway(\"c\", lambda c: True, recording_breaker, backend) == {\"status\": 200, \"data\": \"ok\"}\nassert calls == [\"breaker\", \"backend\"]\nprint(\"rate-limited requests never reach the breaker or backend; allowed ones do\")",
        "output": "rate-limited requests never reach the breaker or backend; allowed ones do",
        "codeNotes": [
          {
            "line": 22,
            "note": "A 429 must not touch anything behind the limiter."
          },
          {
            "line": 24,
            "note": "An allowed request goes through the breaker to the backend."
          }
        ],
        "tryIt": "Add a test for a backend that raises, checking the status is 500 and the error text is included.",
        "check": {
          "question": "How can a test prove a rate-limited request never reached the backend?",
          "options": [
            "By timing it",
            "By using fakes that record calls and checking the record is empty",
            "It cannot be tested"
          ],
          "answer": 1,
          "why": "Recording fakes show exactly what was called."
        }
      },
      {
        "title": "Running gateways in production",
        "say": [
          "Run several gateway instances behind a load balancer (Day 23) so one failure does not stop all traffic.",
          "Keep limiter state in a shared store, and circuit breaker state per instance or shared, depending on how quickly you need all instances to react.",
          "If the shared store is unreachable, decide in advance whether the gateway fails open (allow traffic) or fails closed (reject it); most choose to allow, with an alert.",
          "Watch gateway metrics: requests per second, error rates by status code, p95 latency per route, and the number of 429s and 503s.",
          "Popular gateways include NGINX, Envoy, Kong, AWS API Gateway and cloud load balancers with gateway features.",
          "Congratulations on Milestone 3! Next week covers gossip, load balancing, discovery, tracing, consistency, CDNs and disaster recovery.",
          "The example summarises a minute of gateway traffic by status code."
        ],
        "example": "A busy railway station with several ticket gates: if one gate breaks, the others keep working, and the station manager watches a board showing how each gate is doing.",
        "code": "from collections import Counter\n\nstatuses = [200] * 940 + [429] * 35 + [503] * 20 + [500] * 5\ncounts = Counter(statuses)\ntotal = len(statuses)\nfor status in sorted(counts):\n    print(f\"{status}: {counts[status]:>4} ({counts[status] / total:.1%})\")\nprint(\"server error rate:\", f\"{(counts[500] + counts[503]) / total:.1%}\")",
        "output": "200:  940 (94.0%)\n429:   35 (3.5%)\n500:    5 (0.5%)\n503:   20 (2.0%)\nserver error rate: 2.5%",
        "codeNotes": [
          {
            "line": 8,
            "note": "5xx responses are the server's fault; 429s are clients over their limits."
          }
        ],
        "tryIt": "If 503s suddenly jump to 20%, which component would you look at first?",
        "check": {
          "question": "Why run several gateway instances?",
          "options": [
            "To use more memory",
            "So one instance failing does not stop all traffic",
            "Gateways cannot handle more than 100 requests"
          ],
          "answer": 1,
          "why": "The gateway is on every request path, so it must not be a single point of failure."
        }
      }
    ],
    "summary": [
      "An API gateway applies shared rules at the single entry point.",
      "Per-client token buckets return 429 before any work is done.",
      "Map outcomes: 200 success, 429 limited, 503 circuit open, 500 server error.",
      "Add timing and request id headers for debugging and tracing.",
      "Test every path and the order of calls; run several gateway instances."
    ],
    "projectStep": {
      "title": "Milestone 3: API gateway",
      "steps": [
        "Add handle_gateway and response_time_header to dist_toolkit.py.",
        "Combine your token bucket and circuit breaker into one gateway and test all four statuses.",
        "Bonus: summarise 1,000 fake responses by status code and error rate."
      ]
    }
  },
  {
    "day": 22,
    "title": "Gossip Protocols: SWIM Failure Detection & Cluster Membership",
    "goal": "You can explain gossip protocols, spread information epidemically with a small fan-out, detect failures with SWIM's direct and indirect probes, and manage suspicion to avoid false alarms.",
    "minutes": 30,
    "recap": "Leader election used heartbeats to one leader. In clusters of hundreds or thousands of nodes, every node checking every other node is too expensive. Gossip spreads the work.",
    "parts": [
      {
        "title": "Why gossip?",
        "say": [
          "In a cluster of N nodes, if every node sends heartbeats to every other node, there are N x (N - 1) messages per round. With 1,000 nodes, that is about a million messages.",
          "Gossip protocols instead have each node talk to a few random peers per round. Information spreads like a rumour: each informed node tells a few others.",
          "The number of informed nodes roughly multiplies each round, so news reaches the whole cluster in about log(N) rounds.",
          "With 1,000 nodes and a fan-out of 3, news typically reaches everyone in under ten rounds, with each node sending only 3 messages per round.",
          "Gossip is robust: no central server, no single point of failure, and lost messages are compensated by later rounds.",
          "It also degrades gracefully: losing a few nodes or messages slows the spread slightly instead of stopping it.",
          "Cassandra, Consul, Redis Cluster and many others use gossip for membership and failure detection.",
          "The simulation spreads one update through 100 nodes with a fan-out of 3."
        ],
        "example": "A piece of news in a small town: each person who hears it tells three friends at the market, and within a few days everyone knows, without any announcement.",
        "code": "import random\n\nrng = random.Random(5)\nnodes = list(range(100))\ninformed = {0}\nrounds = 0\nwhile len(informed) < len(nodes):\n    rounds += 1\n    for node in list(informed):\n        informed.update(rng.sample(nodes, 3))\n    print(f\"round {rounds}: {len(informed)} nodes informed\")\nprint(\"all-to-all heartbeats would need\", len(nodes) * (len(nodes) - 1), \"messages per round\")",
        "output": "round 1: 4 nodes informed\nround 2: 14 nodes informed\nround 3: 41 nodes informed\nround 4: 83 nodes informed\nround 5: 99 nodes informed\nround 6: 100 nodes informed\nall-to-all heartbeats would need 9900 messages per round",
        "codeNotes": [
          {
            "line": 10,
            "note": "Each informed node tells 3 random peers."
          },
          {
            "line": 12,
            "note": "The cost of everyone checking everyone."
          }
        ],
        "tryIt": "Try a fan-out of 1 and of 5. How many rounds does each take?",
        "check": {
          "question": "How many rounds does gossip roughly need to reach N nodes?",
          "options": [
            "N rounds",
            "About log(N) rounds",
            "Exactly 3 rounds"
          ],
          "answer": 1,
          "why": "The informed set multiplies each round, so growth is exponential."
        }
      },
      {
        "title": "Choosing gossip peers",
        "say": [
          "Each round, a node picks k peers to gossip with. Practice 2: fanout_peers(peers, k, me) returns the first k peers, skipping the node itself.",
          "Real protocols pick peers randomly (or shuffle the list each round) so that information travels along different paths.",
          "Some protocols prefer peers they have not contacted recently, which spreads information even more evenly.",
          "A small k (2 to 4) is usually enough; the exponential spread does the rest.",
          "Nodes also exchange their membership lists during gossip, so everyone learns about new and departed nodes.",
          "Pick peers from the whole cluster, not only nearby ones, or information can get stuck inside one rack or region.",
          "The example chooses peers from a shuffled list with a seeded generator."
        ],
        "example": "Choosing a few different friends to share news with each day, instead of always the same two, so the news reaches different circles.",
        "code": "import random\n\ndef fanout_peers(peers, k=3, me=None):\n    return [p for p in peers if p != me][:k]\n\npeers = [\"n1\", \"n2\", \"n3\", \"n4\", \"n5\", \"n6\"]\nprint(fanout_peers(peers, 3, me=\"n1\"))\nrng = random.Random(8)\nfor round_no in range(1, 4):\n    shuffled = peers[:]\n    rng.shuffle(shuffled)\n    print(f\"round {round_no}:\", fanout_peers(shuffled, 2, me=\"n1\"))",
        "output": "['n2', 'n3', 'n4']\nround 1: ['n6', 'n5']\nround 2: ['n2', 'n3']\nround 3: ['n6', 'n3']",
        "codeNotes": [
          {
            "line": 4,
            "note": "Skip yourself, then take the first k."
          },
          {
            "line": 11,
            "note": "Shuffle each round so different peers are chosen."
          }
        ],
        "tryIt": "Change k to 5. What happens when k is larger than the number of other peers?",
        "check": {
          "question": "Why shuffle the peer list each gossip round?",
          "options": [
            "To save memory",
            "So information travels along different paths and does not get stuck",
            "Gossip requires sorted lists"
          ],
          "answer": 1,
          "why": "Random peers make the spread fast and robust."
        }
      },
      {
        "title": "SWIM: probing for failures",
        "say": [
          "SWIM (Scalable Weakly-consistent Infection-style Membership) detects failures efficiently. Each round, a node pings one random member directly.",
          "If the direct ping times out, the node does not conclude failure at once. It asks k other members to ping the target on its behalf (indirect probes).",
          "This handles cases where the network between two particular nodes is broken but the target is actually fine.",
          "Such partial network problems are common in large datacentres, where one switch or link can fail while the rest of the network works.",
          "Practice 1: swim_probe(target, ping, peers, k) returns ALIVE via DIRECT, ALIVE via INDIRECT, or SUSPECT via INDIRECT when nobody could reach the target.",
          "Choose helpers from the peers excluding the target itself, and take the first k.",
          "The example simulates a target that is unreachable directly but reachable through a helper."
        ],
        "example": "If a friend does not answer your call, you ask two mutual friends to try calling them too, before assuming something is wrong.",
        "code": "def swim_probe(target, ping, peers, k=2):\n    try:\n        ping(target)\n        return {\"status\": \"ALIVE\", \"method\": \"DIRECT\"}\n    except TimeoutError:\n        pass\n    for helper in [p for p in peers if p != target][:k]:\n        try:\n            ping(target, via=helper)\n            return {\"status\": \"ALIVE\", \"method\": \"INDIRECT\"}\n        except TimeoutError:\n            continue\n    return {\"status\": \"SUSPECT\", \"method\": \"INDIRECT\"}\n\ndef make_ping(reachable_via):\n    def ping(target, via=None):\n        if via not in reachable_via:\n            raise TimeoutError(f\"no answer from {target} via {via}\")\n    return ping\n\npeers = [\"n2\", \"n3\", \"n4\"]\nprint(swim_probe(\"n4\", make_ping({None}), peers))\nprint(swim_probe(\"n4\", make_ping({\"n3\"}), peers))\nprint(swim_probe(\"n4\", make_ping(set()), peers))",
        "output": "{'status': 'ALIVE', 'method': 'DIRECT'}\n{'status': 'ALIVE', 'method': 'INDIRECT'}\n{'status': 'SUSPECT', 'method': 'INDIRECT'}",
        "codeNotes": [
          {
            "line": 3,
            "note": "Try a direct ping first."
          },
          {
            "line": 7,
            "note": "Ask up to k helpers, never the target itself."
          },
          {
            "line": 13,
            "note": "Nobody reached it: suspect, do not declare dead yet."
          }
        ],
        "tryIt": "Make n4 reachable only via n2. With k=1, what is the result?",
        "check": {
          "question": "Why does SWIM use indirect probes?",
          "options": [
            "To save bandwidth",
            "A failed direct ping may be a broken link between two nodes, not a dead target",
            "Indirect pings are faster"
          ],
          "answer": 1,
          "why": "Other nodes may still reach the target, avoiding a false failure."
        }
      },
      {
        "title": "Suspicion before declaring death",
        "say": [
          "SWIM marks an unreachable node as SUSPECT first, and gossips that suspicion. The suspected node, if alive, hears about it and gossips an \"I am alive\" message with a higher incarnation number.",
          "Only if the suspicion is not refuted within a timeout is the node declared DEAD and removed from membership.",
          "This greatly reduces false positives caused by brief pauses, such as garbage collection or a busy CPU.",
          "False positives are expensive: a node wrongly declared dead may have its data moved or its work reassigned for no reason.",
          "Incarnation numbers work like terms or fencing tokens: a newer \"alive\" message overrides an older \"suspect\" message.",
          "Tuning the suspicion timeout balances detection speed against false alarms, just like heartbeat timeouts on Day 7.",
          "The simulation walks one node through suspect, refute, and later dead."
        ],
        "example": "Before a team marks a colleague as absent, they wait a little in case the person just stepped out; if the colleague walks back in, they are marked present again.",
        "code": "SUSPICION_TIMEOUT = 5\nstate = {\"n4\": {\"status\": \"ALIVE\", \"incarnation\": 0}}\n\ndef suspect(node, now):\n    state[node].update(status=\"SUSPECT\", since=now)\n\ndef refute(node, incarnation):\n    if incarnation > state[node][\"incarnation\"]:\n        state[node].update(status=\"ALIVE\", incarnation=incarnation)\n\ndef tick(now):\n    for node, s in state.items():\n        if s[\"status\"] == \"SUSPECT\" and now - s[\"since\"] >= SUSPICION_TIMEOUT:\n            s[\"status\"] = \"DEAD\"\n\nsuspect(\"n4\", now=0); refute(\"n4\", incarnation=1); tick(now=6)\nprint(\"after refuting:\", state[\"n4\"])\nsuspect(\"n4\", now=10); tick(now=16)\nprint(\"no refutation:\", state[\"n4\"])",
        "output": "after refuting: {'status': 'ALIVE', 'incarnation': 1, 'since': 0}\nno refutation: {'status': 'DEAD', 'incarnation': 1, 'since': 10}",
        "codeNotes": [
          {
            "line": 8,
            "note": "A newer incarnation overrides the suspicion."
          },
          {
            "line": 13,
            "note": "Unrefuted for too long: declare dead."
          }
        ],
        "tryIt": "Refute with incarnation 0 instead of 1. Does the refutation work? Why?",
        "check": {
          "question": "What does a suspected node do if it is actually alive?",
          "options": [
            "Nothing",
            "Gossips an \"alive\" message with a higher incarnation number",
            "Restarts itself"
          ],
          "answer": 1,
          "why": "The higher incarnation overrides the old suspicion."
        }
      },
      {
        "title": "Membership and dissemination",
        "say": [
          "SWIM piggybacks membership updates (joined, suspect, alive, dead) on its ping and ack messages, so dissemination costs no extra messages.",
          "Each update is sent a limited number of times (about log(N)) and then dropped, which keeps messages small.",
          "Recent updates are sent first, so the newest news travels fastest through the cluster.",
          "New nodes join by contacting any existing member (a seed node), which then gossips the join to everyone.",
          "Membership is eventually consistent: for a short while, different nodes may have slightly different lists. Systems built on gossip must tolerate that.",
          "HashiCorp's memberlist (used by Consul and Serf) is a widely used SWIM implementation.",
          "The example merges membership updates using incarnation numbers."
        ],
        "example": "Office news passed along during tea breaks: each person mentions the latest joiner or leaver to whoever they chat with, and after a few breaks everyone knows.",
        "code": "members = {\"n1\": (\"ALIVE\", 3), \"n2\": (\"SUSPECT\", 1)}\nincoming = [(\"n2\", (\"ALIVE\", 2)), (\"n3\", (\"ALIVE\", 0)), (\"n1\", (\"SUSPECT\", 2))]\n\nfor node, (status, inc) in incoming:\n    current = members.get(node)\n    if current is None or inc > current[1]:\n        members[node] = (status, inc)\nprint(members)",
        "output": "{'n1': ('ALIVE', 3), 'n2': ('ALIVE', 2), 'n3': ('ALIVE', 0)}",
        "codeNotes": [
          {
            "line": 6,
            "note": "Accept an update only if it is newer (a higher incarnation)."
          }
        ],
        "tryIt": "Add an update (\"n1\", (\"DEAD\", 4)). What does n1's entry become?",
        "check": {
          "question": "How does SWIM spread membership updates without extra messages?",
          "options": [
            "It sends a broadcast",
            "It piggybacks them on ping and ack messages",
            "It writes them to a database"
          ],
          "answer": 1,
          "why": "Updates ride along with the failure-detection traffic that is sent anyway."
        }
      },
      {
        "title": "Where gossip fits",
        "say": [
          "Gossip is ideal for information that can be slightly out of date: membership, health, load statistics, and configuration hints.",
          "It is not a replacement for consensus. Decisions that must be agreed exactly, such as who holds a lock or the order of writes, still need Raft or similar.",
          "Many systems combine both: gossip for cheap, scalable membership, and a small Raft group for critical metadata.",
          "Consul does exactly this: gossip (Serf) for membership across many nodes, and Raft among a few server nodes for the service catalogue.",
          "The costs are predictable: each node sends a constant number of messages per round, whatever the cluster size.",
          "Tomorrow you will spread requests across healthy servers with load balancing algorithms.",
          "The helper compares gossip and consensus for different kinds of information."
        ],
        "example": "Word of mouth is great for spreading the news that the canteen has a new dish, but you would not use it to decide who owns the flat.",
        "code": "def pick_protocol(info):\n    exact = {\"lock owner\", \"order of writes\", \"leader identity\", \"configuration version\"}\n    return \"consensus (Raft)\" if info in exact else \"gossip\"\n\nfor info in [\"node health\", \"lock owner\", \"cluster membership\", \"order of writes\", \"load per node\"]:\n    print(f\"{info:20} -> {pick_protocol(info)}\")",
        "output": "node health          -> gossip\nlock owner           -> consensus (Raft)\ncluster membership   -> gossip\norder of writes      -> consensus (Raft)\nload per node        -> gossip",
        "codeNotes": [
          {
            "line": 2,
            "note": "Things that must be agreed exactly need consensus."
          }
        ],
        "tryIt": "Which would you use for \"current CPU usage of each node\"? Why?",
        "check": {
          "question": "Which information is a poor fit for gossip?",
          "options": [
            "Which nodes are alive",
            "Who currently holds a lock",
            "Load statistics"
          ],
          "answer": 1,
          "why": "Lock ownership must be agreed exactly, which gossip does not guarantee."
        }
      }
    ],
    "summary": [
      "Gossip spreads information in about log(N) rounds with a small fan-out.",
      "Pick a few random peers each round, never yourself.",
      "SWIM pings directly, then asks k helpers before suspecting a node.",
      "Suspicion plus incarnation numbers avoid false failure alarms.",
      "Use gossip for membership and health; consensus for exact decisions."
    ],
    "projectStep": {
      "title": "Gossip",
      "steps": [
        "Add swim_probe and fanout_peers to dist_toolkit.py.",
        "Simulate gossip in a 200-node cluster and count rounds for fan-outs 2, 3 and 4.",
        "Bonus: add suspicion with incarnation numbers and a timeout."
      ]
    }
  },
  {
    "day": 23,
    "title": "Load Balancing Algorithms: Weighted Round-Robin, Least Connections & Consistent Hash Ring",
    "goal": "You can spread traffic with round-robin, smooth weighted round-robin, least connections and consistent hashing, choose the right algorithm for each workload, and remove unhealthy servers from rotation.",
    "minutes": 30,
    "recap": "Yesterday's gossip told every node who is alive. A load balancer uses that knowledge to spread requests across the healthy servers.",
    "parts": [
      {
        "title": "Why load balance?",
        "say": [
          "A load balancer receives client requests and forwards each one to one of several identical backend servers.",
          "It lets you scale by adding servers, keeps serving when a server fails, and allows rolling deployments one server at a time.",
          "It also hides the servers from clients: clients know one address, and servers can change behind it without anyone noticing.",
          "Balancers work at layer 4 (TCP connections, very fast) or layer 7 (HTTP requests, able to route by path, header or cookie).",
          "Cloud providers offer both kinds as managed services, so most teams configure balancers rather than build them.",
          "The algorithm that picks the next server matters: a poor choice overloads some servers while others idle.",
          "Common algorithms are round-robin, weighted round-robin, least connections, and hashing for stickiness.",
          "The example sends requests round-robin to three servers."
        ],
        "example": "A restaurant host seating arriving guests at different waiters' tables, so no single waiter is overwhelmed.",
        "code": "servers = [\"s1\", \"s2\", \"s3\"]\ncounts = {s: 0 for s in servers}\nfor request in range(10):\n    chosen = servers[request % len(servers)]\n    counts[chosen] += 1\nprint(counts)",
        "output": "{'s1': 4, 's2': 3, 's3': 3}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Round-robin: take the next server in turn."
          }
        ],
        "tryIt": "Remove s2 from the list (it failed). How are the 10 requests spread now?",
        "check": {
          "question": "What does a layer 7 load balancer understand that layer 4 does not?",
          "options": [
            "IP addresses",
            "HTTP details such as paths and headers",
            "Network cables"
          ],
          "answer": 1,
          "why": "Layer 7 balancers read the HTTP request and can route on its contents."
        }
      },
      {
        "title": "Smooth weighted round-robin",
        "say": [
          "Servers are not always equal: a bigger machine may handle three times the traffic. Weighted round-robin sends traffic in proportion to weights.",
          "A naive approach sends a heavy server's requests in a burst (A, A, A, B). NGINX's smooth weighted round-robin interleaves them (A, A, B, A) for steadier load.",
          "Bursts matter because they briefly overload even a big server, while its smaller neighbours sit idle.",
          "Practice 1: each round, add each server's weight to its current weight, pick the server with the highest current weight (first on a tie), subtract the total of all weights from it, and return its id.",
          "Over a full cycle, each server is chosen exactly weight times, and heavy servers are spread through the cycle.",
          "Using max with a key keeps the first server on a tie, which makes the order predictable and testable.",
          "The example runs a full cycle for weights 5, 1 and 1."
        ],
        "example": "Dealing cards from three piles of different sizes so that the big pile's cards are spread through the deal instead of all coming first.",
        "code": "class SmoothWeightedBalancer:\n    def __init__(self, weights):\n        self.servers = [{\"id\": sid, \"weight\": w, \"current\": 0} for sid, w in weights.items()]\n        self.total = sum(weights.values())\n\n    def next_server(self):\n        for s in self.servers:\n            s[\"current\"] += s[\"weight\"]\n        best = max(self.servers, key=lambda s: s[\"current\"])\n        best[\"current\"] -= self.total\n        return best[\"id\"]\n\nlb = SmoothWeightedBalancer({\"big\": 5, \"small-1\": 1, \"small-2\": 1})\nprint([lb.next_server() for _ in range(7)])",
        "output": "['big', 'big', 'small-1', 'big', 'small-2', 'big', 'big']",
        "codeNotes": [
          {
            "line": 8,
            "note": "Every server gains its weight each round."
          },
          {
            "line": 9,
            "note": "The highest current weight wins; max keeps the first on a tie."
          },
          {
            "line": 10,
            "note": "The winner pays back the total."
          }
        ],
        "tryIt": "Try weights {\"a\": 2, \"b\": 1}. What order do you get over 6 picks?",
        "check": {
          "question": "How many times is a server with weight 5 chosen in a cycle of total weight 7?",
          "options": [
            "1",
            "5",
            "7"
          ],
          "answer": 1,
          "why": "Each server is chosen exactly its weight times per cycle."
        }
      },
      {
        "title": "Least connections",
        "say": [
          "Round-robin assumes every request costs about the same. When some requests take much longer (file uploads, reports), servers with long requests pile up work.",
          "Least connections sends each new request to the server with the fewest active connections, adapting to actual load.",
          "The balancer already knows each server's open connections, so this information is free to use.",
          "Practice 2: least_connections(servers) returns the id of the server with the fewest \"active\" connections, first on a tie, without reordering the input.",
          "min with a key returns the first minimum and does not change the list.",
          "A variant, least response time, also considers how fast each server has been answering.",
          "The example routes a sequence of requests, some long, some short."
        ],
        "example": "Joining the shortest queue at a supermarket instead of going to checkouts in strict turn.",
        "code": "def least_connections(servers):\n    return min(servers, key=lambda s: s[\"active\"])[\"id\"]\n\nservers = [{\"id\": \"s1\", \"active\": 0}, {\"id\": \"s2\", \"active\": 0}, {\"id\": \"s3\", \"active\": 0}]\nlong_jobs = {\"s1\"}\nfor request in range(6):\n    chosen = least_connections(servers)\n    for s in servers:\n        if s[\"id\"] == chosen:\n            s[\"active\"] += 3 if chosen in long_jobs else 1\n    print(f\"request {request} -> {chosen}\", [s[\"active\"] for s in servers])",
        "output": "request 0 -> s1 [3, 0, 0]\nrequest 1 -> s2 [3, 1, 0]\nrequest 2 -> s3 [3, 1, 1]\nrequest 3 -> s2 [3, 2, 1]\nrequest 4 -> s3 [3, 2, 2]\nrequest 5 -> s2 [3, 3, 2]",
        "codeNotes": [
          {
            "line": 2,
            "note": "The fewest active connections; first one on a tie."
          },
          {
            "line": 10,
            "note": "s1 took a long job, so new requests avoid it until it frees up."
          }
        ],
        "tryIt": "Make all jobs equal length. How does least connections compare with round-robin then?",
        "check": {
          "question": "When does least connections beat round-robin?",
          "options": [
            "When all requests are identical",
            "When request durations vary a lot",
            "When there is one server"
          ],
          "answer": 1,
          "why": "It adapts to servers that are busy with long requests."
        }
      },
      {
        "title": "Hashing for stickiness",
        "say": [
          "Some workloads want the same client or key to reach the same server: a server with a warm cache for that user, or a WebSocket session.",
          "Sticky routing is also common for WebSocket and streaming connections, which stay open to one server for a long time.",
          "Hashing the client id (or IP) to a server gives stickiness. Consistent hashing (Day 4) keeps most clients on the same server when servers are added or removed.",
          "Stickiness helps caches and sessions, but can create uneven load if a few clients are very busy.",
          "Cookies can also provide stickiness at layer 7: the balancer sets a cookie naming the server.",
          "Prefer stateless servers where possible, so any server can handle any request and stickiness is only an optimisation.",
          "The example shows that hashing sends each user to the same server every time."
        ],
        "example": "Always going to the same barber, who remembers how you like your hair cut; convenient, but if everyone chooses the same barber, their queue gets long.",
        "code": "import hashlib\n\nservers = [\"s1\", \"s2\", \"s3\"]\n\ndef sticky_server(user_id):\n    h = int(hashlib.md5(user_id.encode()).hexdigest(), 16)\n    return servers[h % len(servers)]\n\nfor user in [\"asha\", \"bala\", \"asha\", \"chitra\", \"asha\", \"bala\"]:\n    print(user, \"->\", sticky_server(user))",
        "output": "asha -> s1\nbala -> s1\nasha -> s1\nchitra -> s2\nasha -> s1\nbala -> s1",
        "codeNotes": [
          {
            "line": 7,
            "note": "The same user always hashes to the same server."
          }
        ],
        "tryIt": "Remove s3 from the list. Which users change server? How would consistent hashing help?",
        "check": {
          "question": "Why prefer stateless servers even when using sticky routing?",
          "options": [
            "Stateless servers are faster",
            "Any server can then take over a user if their server fails",
            "Stickiness requires it"
          ],
          "answer": 1,
          "why": "With no essential state on one server, stickiness becomes a harmless optimisation."
        }
      },
      {
        "title": "Health checks and removing servers",
        "say": [
          "A balancer must only send traffic to healthy servers. Active health checks call an endpoint such as /health every few seconds.",
          "Passive health checks watch real traffic: a server returning many errors or timeouts is taken out temporarily.",
          "Passive checks react to real user failures, while active checks can find a problem before users hit it; most balancers use both.",
          "Use thresholds to avoid flapping: remove after, say, 3 failed checks in a row, and add back after 2 successful ones.",
          "Flapping servers are worse than slow ones, because every change reshuffles connections and caches.",
          "During deployments, drain a server first: stop sending new requests, let current ones finish, then restart it.",
          "Service discovery (tomorrow) keeps the balancer's server list up to date automatically.",
          "The example applies thresholds to a series of health-check results."
        ],
        "example": "A team captain who benches a player after three mistakes in a row, and brings them back after they do well in two practice drills.",
        "code": "def update(state, ok, fail_limit=3, pass_limit=2):\n    if ok:\n        state[\"fails\"], state[\"passes\"] = 0, state[\"passes\"] + 1\n        if not state[\"in_pool\"] and state[\"passes\"] >= pass_limit:\n            state[\"in_pool\"] = True\n    else:\n        state[\"passes\"], state[\"fails\"] = 0, state[\"fails\"] + 1\n        if state[\"in_pool\"] and state[\"fails\"] >= fail_limit:\n            state[\"in_pool\"] = False\n    return state[\"in_pool\"]\n\nserver = {\"in_pool\": True, \"fails\": 0, \"passes\": 0}\nchecks = [True, False, False, True, False, False, False, True, True]\nprint([update(server, ok) for ok in checks])",
        "output": "[True, True, True, True, True, True, False, False, True]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Remove only after several failures in a row."
          },
          {
            "line": 4,
            "note": "Add back only after several successes in a row."
          }
        ],
        "tryIt": "Change fail_limit to 1. How often does the server flap in and out now?",
        "check": {
          "question": "Why use thresholds such as \"3 failures in a row\" for health checks?",
          "options": [
            "To save bandwidth",
            "To avoid flapping from single, brief errors",
            "Health checks are unreliable"
          ],
          "answer": 1,
          "why": "Thresholds keep one blip from repeatedly removing and re-adding a server."
        }
      },
      {
        "title": "Choosing an algorithm",
        "say": [
          "Similar, short requests on similar servers: round-robin is simple and effective.",
          "Different server sizes: weighted round-robin.",
          "Measure after choosing: compare load across servers on a dashboard, and switch algorithms if one server is consistently busier.",
          "Varying request durations: least connections or least response time.",
          "Caches or sessions tied to users: consistent hashing, with a fallback when a server is down.",
          "Power of two choices is a popular modern trick: pick two servers at random and send to the less loaded one. It gets close to least connections with very little information.",
          "It works because it avoids the worst choices: the chance that both random picks are busy servers is small.",
          "The example compares plain random choice with power of two choices."
        ],
        "example": "Choosing a checkout by looking at just two queues and picking the shorter: much better than choosing at random, and quicker than inspecting every queue.",
        "code": "import random\n\nrng = random.Random(4)\ndef simulate(two_choices, servers=10, jobs=1000):\n    load = [0] * servers\n    for _ in range(jobs):\n        a = rng.randrange(servers)\n        if two_choices:\n            b = rng.randrange(servers)\n            a = a if load[a] <= load[b] else b\n        load[a] += 1\n    return max(load) - min(load)\n\nprint(\"random choice, spread between busiest and idlest:\", simulate(False))\nprint(\"power of two choices, spread:\", simulate(True))",
        "output": "random choice, spread between busiest and idlest: 31\npower of two choices, spread: 3",
        "codeNotes": [
          {
            "line": 10,
            "note": "Look at two random servers and use the less loaded one."
          }
        ],
        "tryIt": "Increase jobs to 10,000. How do the two spreads compare now?",
        "check": {
          "question": "Which algorithm fits servers with different capacities best?",
          "options": [
            "Plain round-robin",
            "Weighted round-robin",
            "Random choice"
          ],
          "answer": 1,
          "why": "Weights send traffic in proportion to each server's capacity."
        }
      }
    ],
    "summary": [
      "Load balancers spread requests, add capacity and survive server failures.",
      "Smooth weighted round-robin interleaves heavy servers through the cycle.",
      "Least connections adapts to varying request durations.",
      "Hashing gives stickiness for caches and sessions; prefer stateless servers.",
      "Health checks with thresholds remove unhealthy servers without flapping."
    ],
    "projectStep": {
      "title": "Load balancing",
      "steps": [
        "Add SmoothWeightedBalancer and least_connections to dist_toolkit.py.",
        "Compare round-robin and least connections on a mix of short and long jobs.",
        "Bonus: implement power of two choices and measure the load spread."
      ]
    }
  },
  {
    "day": 24,
    "title": "Service Discovery & Heartbeat Health Checking (Consul / Zookeeper)",
    "goal": "You can explain service discovery, run a registry with leases, heartbeats and health filtering, build instance URLs, and compare client-side and server-side discovery.",
    "minutes": 30,
    "recap": "Load balancers need an up-to-date list of servers. In cloud systems, servers come and go constantly. Service discovery keeps that list current automatically.",
    "parts": [
      {
        "title": "Why discovery?",
        "say": [
          "In the cloud, instances start and stop all the time: autoscaling adds them at peak hours, deployments replace them, and failures remove them. Their IP addresses change.",
          "In a large system, hundreds of instances may change every day without anyone touching a configuration file.",
          "Hard-coding addresses in configuration files breaks as soon as anything changes.",
          "Teams then discover the problem during an outage, when a replaced server's old address still sits in a file somewhere.",
          "Service discovery keeps a live registry: each instance registers itself with its address, and clients look up healthy instances by service name.",
          "Tools include Consul, ZooKeeper, etcd, Eureka, and the built-in DNS and endpoints of Kubernetes.",
          "Discovery is one of the fallacies from Day 1 turned into a system: \"topology does not change\" is false, so we track it.",
          "The example contrasts a hard-coded list with a registry lookup."
        ],
        "example": "A hospital's on-call board listing which doctor is available right now, instead of a printed list from last month.",
        "code": "hard_coded = [\"10.0.0.5:8080\", \"10.0.0.6:8080\"]\nregistry = {\"orders\": [\"10.0.1.21:8080\", \"10.0.1.22:8080\", \"10.0.1.30:8080\"]}\nprint(\"config file says:\", hard_coded, \"(two of these were replaced last night)\")\nprint(\"registry says:\", registry[\"orders\"])",
        "output": "config file says: ['10.0.0.5:8080', '10.0.0.6:8080'] (two of these were replaced last night)\nregistry says: ['10.0.1.21:8080', '10.0.1.22:8080', '10.0.1.30:8080']",
        "codeNotes": [
          {
            "line": 2,
            "note": "The registry reflects what is actually running now."
          }
        ],
        "tryIt": "What happens to callers using the hard-coded list after an autoscaling event?",
        "check": {
          "question": "Why is hard-coding service addresses a problem in the cloud?",
          "options": [
            "Addresses are too long",
            "Instances and their addresses change often",
            "Config files are slow"
          ],
          "answer": 1,
          "why": "Autoscaling, deploys and failures constantly change which instances exist."
        }
      },
      {
        "title": "Registration with leases",
        "say": [
          "When an instance starts, it registers: service name, instance id, URL, and a lease time-to-live.",
          "The instance must send heartbeats to renew its lease. If it crashes, the heartbeats stop, the lease expires, and the registry forgets it.",
          "Instances should also deregister cleanly when they shut down on purpose, so traffic stops immediately instead of after the lease expires.",
          "This is the same lease idea as distributed locks (Day 6): a crashed holder cannot keep a claim forever.",
          "Practice 1: ServiceRegistry.register stores the instance with a lease ending at now + ttl_ms; heartbeat renews it (or returns False for an unknown instance); healthy returns unexpired instances in registration order and forgets expired ones.",
          "A dict per service, keyed by instance id, keeps registration order because Python dicts preserve insertion order.",
          "The example registers two instances and lets one expire."
        ],
        "example": "A hotel guest register where each guest must renew their stay at the desk every day; guests who do not renew are assumed to have left and their rooms are freed.",
        "code": "class ServiceRegistry:\n    def __init__(self):\n        self.services = {}\n\n    def register(self, name, instance_id, url, now, ttl_ms=5000):\n        self.services.setdefault(name, {})[instance_id] = {\"url\": url, \"ttl\": ttl_ms, \"expires\": now + ttl_ms}\n\n    def heartbeat(self, name, instance_id, now):\n        inst = self.services.get(name, {}).get(instance_id)\n        if inst is None:\n            return False\n        inst[\"expires\"] = now + inst[\"ttl\"]\n        return True\n\n    def healthy(self, name, now):\n        instances = self.services.get(name, {})\n        for iid in [i for i, inst in instances.items() if inst[\"expires\"] <= now]:\n            del instances[iid]\n        return [{\"id\": i, \"url\": inst[\"url\"]} for i, inst in instances.items()]\n\nreg = ServiceRegistry()\nreg.register(\"orders\", \"o-1\", \"http://10.0.1.21:8080\", now=0)\nreg.register(\"orders\", \"o-2\", \"http://10.0.1.22:8080\", now=0)\nprint(reg.heartbeat(\"orders\", \"o-1\", now=4000), reg.heartbeat(\"orders\", \"o-9\", now=4000))\nprint(reg.healthy(\"orders\", now=6000))",
        "output": "True False\n[{'id': 'o-1', 'url': 'http://10.0.1.21:8080'}]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Store the instance with its lease end time."
          },
          {
            "line": 12,
            "note": "A heartbeat renews the lease."
          },
          {
            "line": 17,
            "note": "Forget instances whose lease has run out."
          }
        ],
        "tryIt": "Send a heartbeat for o-2 at t=4500 and check healthy at t=6000 again.",
        "check": {
          "question": "What happens to an instance that stops sending heartbeats?",
          "options": [
            "It stays registered forever",
            "Its lease expires and the registry forgets it",
            "It is restarted"
          ],
          "answer": 1,
          "why": "Without renewals, the lease runs out and the instance is dropped."
        }
      },
      {
        "title": "Building instance URLs",
        "say": [
          "Practice 2: instance_url(ip, port) returns \"http://IP:PORT\". Small helpers like this keep URL formatting consistent everywhere.",
          "Registries often store the address and port separately, plus metadata such as version, region and zone.",
          "Metadata also allows gradual rollouts: send 5% of traffic to instances tagged with the new version, watch errors, then increase.",
          "Clients use metadata to prefer instances in their own zone (lower latency, lower cost), or to route canary traffic to a new version.",
          "Use HTTPS between services in production, often with mutual TLS so both sides prove who they are (\"the network is secure\" is a fallacy too).",
          "Validate what you register: a typo in a port can send traffic nowhere.",
          "The example builds URLs and prefers same-zone instances."
        ],
        "example": "An address book that stores each contact's city as well as their number, so you call the nearest branch first.",
        "code": "def instance_url(ip, port):\n    return f\"http://{ip}:{port}\"\n\ninstances = [\n    {\"ip\": \"10.0.1.21\", \"port\": 8080, \"zone\": \"ap-south-1a\"},\n    {\"ip\": \"10.0.2.14\", \"port\": 8080, \"zone\": \"ap-south-1b\"},\n    {\"ip\": \"10.0.1.30\", \"port\": 8081, \"zone\": \"ap-south-1a\"},\n]\nmy_zone = \"ap-south-1a\"\npreferred = [i for i in instances if i[\"zone\"] == my_zone] or instances\nprint([instance_url(i[\"ip\"], i[\"port\"]) for i in preferred])",
        "output": "['http://10.0.1.21:8080', 'http://10.0.1.30:8081']",
        "codeNotes": [
          {
            "line": 2,
            "note": "One consistent URL format."
          },
          {
            "line": 10,
            "note": "Same-zone instances first, all instances as a fallback."
          }
        ],
        "tryIt": "Change my_zone to \"ap-south-1c\". Which instances are used?",
        "check": {
          "question": "Why might a client prefer instances in its own zone?",
          "options": [
            "They are always newer",
            "Lower latency and lower data-transfer cost",
            "Other zones are unsafe"
          ],
          "answer": 1,
          "why": "Staying within a zone is faster and often cheaper."
        }
      },
      {
        "title": "Client-side and server-side discovery",
        "say": [
          "Client-side discovery: the caller asks the registry for healthy instances and picks one itself, using a load-balancing algorithm from Day 23.",
          "Server-side discovery: the caller sends requests to a load balancer or proxy, which consults the registry and forwards the request.",
          "The balancer itself is found through a stable DNS name, so it is the only address clients ever need to know.",
          "Client-side saves a network hop and gives clients control, but every client needs discovery logic (usually a library).",
          "The registry client usually caches the instance list and refreshes it in the background, so a registry outage does not stop calls immediately.",
          "Server-side keeps clients simple; Kubernetes Services and cloud load balancers work this way.",
          "Service meshes (Istio, Linkerd) put a proxy next to every service, combining the benefits: simple clients, smart routing.",
          "The example shows both flows."
        ],
        "example": "Looking up a plumber's number yourself and calling them directly, versus calling a helpline that connects you to an available plumber.",
        "code": "registry = {\"orders\": [\"http://10.0.1.21:8080\", \"http://10.0.1.22:8080\"]}\ncounter = {\"n\": 0}\n\ndef client_side_call(service):\n    instances = registry[service]\n    url = instances[counter[\"n\"] % len(instances)]\n    counter[\"n\"] += 1\n    return f\"client -> {url}\"\n\ndef server_side_call(service):\n    return f\"client -> lb.{service}.internal -> (balancer picks from registry)\"\n\nprint(client_side_call(\"orders\"), \"|\", client_side_call(\"orders\"))\nprint(server_side_call(\"orders\"))",
        "output": "client -> http://10.0.1.21:8080 | client -> http://10.0.1.22:8080\nclient -> lb.orders.internal -> (balancer picks from registry)",
        "codeNotes": [
          {
            "line": 5,
            "note": "The client reads the registry and balances itself."
          },
          {
            "line": 11,
            "note": "The client only knows one stable name."
          }
        ],
        "tryIt": "Which approach would you choose for a mobile app talking to your backend? Why?",
        "check": {
          "question": "What is an advantage of server-side discovery?",
          "options": [
            "It saves a network hop",
            "Clients stay simple; the balancer handles lookup and choice",
            "It needs no registry"
          ],
          "answer": 1,
          "why": "Clients call one stable address; the infrastructure does the rest."
        }
      },
      {
        "title": "DNS-based discovery and caching",
        "say": [
          "DNS is the oldest discovery system: a name resolves to one or more IP addresses. Kubernetes gives every service a DNS name.",
          "DNS answers are cached with a TTL. Long TTLs mean clients keep calling removed instances; short TTLs mean more DNS lookups.",
          "Kubernetes keeps DNS TTLs short for services, and many clients use connection pools that also need refreshing when instances change.",
          "Some clients cache DNS results forever by default, which surprises teams after a failover. Check your language's settings.",
          "SRV records add ports and weights, but many clients ignore them.",
          "For fast-changing services, prefer registries with push updates or a service mesh.",
          "The example shows a cached lookup going stale after an instance is replaced."
        ],
        "example": "A phone contact saved months ago: fine until the person changes their number; then your calls go nowhere until you refresh it.",
        "code": "dns = {\"orders.internal\": [\"10.0.1.21\"]}\ncache = {}\n\ndef resolve(name, now, ttl=30):\n    hit = cache.get(name)\n    if hit and hit[1] > now:\n        return hit[0]\n    cache[name] = (dns[name], now + ttl)\n    return dns[name]\n\nprint(resolve(\"orders.internal\", now=0))\ndns[\"orders.internal\"] = [\"10.0.1.99\"]\nprint(resolve(\"orders.internal\", now=10), \"(stale, cached)\")\nprint(resolve(\"orders.internal\", now=40), \"(refreshed)\")",
        "output": "['10.0.1.21']\n['10.0.1.21'] (stale, cached)\n['10.0.1.99'] (refreshed)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Serve from cache until the TTL runs out."
          },
          {
            "line": 12,
            "note": "The instance was replaced, but the cache still has the old address."
          }
        ],
        "tryIt": "Set the TTL to 5. When does the client see the new address?",
        "check": {
          "question": "What is the risk of a long DNS TTL for service discovery?",
          "options": [
            "Too many lookups",
            "Clients keep calling instances that no longer exist",
            "DNS stops working"
          ],
          "answer": 1,
          "why": "Cached answers outlive the instances they point to."
        }
      },
      {
        "title": "Health beyond heartbeats",
        "say": [
          "A heartbeat proves the process is running, not that it works. A server can be alive but unable to reach its database.",
          "A process stuck in an endless loop can still answer a simple heartbeat, which is why readiness checks exercise real functionality.",
          "Distinguish liveness (is the process running?) from readiness (can it serve traffic now?). Kubernetes uses both.",
          "If liveness fails, the platform restarts the process; if readiness fails, it simply stops sending traffic until the check passes again.",
          "Readiness checks should verify key dependencies lightly, without heavy work on every check.",
          "A check that runs a heavy database query every few seconds on every instance can itself overload the database.",
          "Do not make readiness depend on every downstream service, or one failure takes the whole fleet out of rotation at once.",
          "Tomorrow you will build the edge layer that clients call first: API gateways and backends-for-frontends.",
          "The example reports liveness and readiness separately."
        ],
        "example": "A shop that is open (the lights are on) but cannot take card payments because the machine is down: open, but not fully ready.",
        "code": "def liveness():\n    return True\n\ndef readiness(db_ok, cache_ok):\n    if not db_ok:\n        return False, \"database unreachable\"\n    return True, \"ok\" if cache_ok else \"ok (cache degraded)\"\n\nfor db_ok, cache_ok in [(True, True), (True, False), (False, True)]:\n    ready, reason = readiness(db_ok, cache_ok)\n    print(f\"live={liveness()} ready={ready} ({reason})\")",
        "output": "live=True ready=True (ok)\nlive=True ready=True (ok (cache degraded))\nlive=True ready=False (database unreachable)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Without the database the service cannot serve, so it is not ready."
          },
          {
            "line": 7,
            "note": "A degraded cache is survivable: still ready."
          }
        ],
        "tryIt": "Should readiness fail if a recommendations service is down? Argue both ways.",
        "check": {
          "question": "What is the difference between liveness and readiness?",
          "options": [
            "There is none",
            "Liveness: the process runs; readiness: it can serve traffic now",
            "Readiness is checked only once"
          ],
          "answer": 1,
          "why": "A running process may still be unable to serve requests."
        }
      }
    ],
    "summary": [
      "Service discovery tracks which instances exist as they come and go.",
      "Instances register with leases and renew them with heartbeats.",
      "Registries return healthy instances; clients may prefer their own zone.",
      "Client-side discovery picks instances itself; server-side uses a balancer.",
      "Watch DNS caching, and separate liveness from readiness."
    ],
    "projectStep": {
      "title": "Service discovery",
      "steps": [
        "Add ServiceRegistry and instance_url to dist_toolkit.py.",
        "Register 3 instances, heartbeat 2, and show the third expiring.",
        "Bonus: add zone metadata and prefer same-zone instances."
      ]
    }
  },
  {
    "day": 25,
    "title": "API Gateways & Backend-For-Frontend (BFF) Pattern",
    "goal": "You can explain API gateways and the backend-for-frontend pattern, aggregate several services into one response with graceful partial failures, call services in parallel, and return correct CORS headers.",
    "minutes": 30,
    "recap": "Milestone 3 built a gateway that protects backends. Today you look at the edge from the client's side: giving each kind of client exactly the data it needs in one call.",
    "parts": [
      {
        "title": "The chatty client problem",
        "say": [
          "A mobile profile screen may need the user, their recent orders and their review count, each from a different service.",
          "If the app calls each service directly, it makes several round trips over a slow mobile network, and must know every service's address and format.",
          "It also exposes internal services to the internet, increasing the attack surface and making every internal change a breaking change for apps.",
          "Each round trip on mobile can cost 100 to 300 ms, so three sequential calls feel slow.",
          "The backend-for-frontend (BFF) pattern adds a small server-side layer per client type (mobile, web, partner API) that gathers data and returns exactly what that client needs.",
          "The BFF talks to services inside the datacentre, where calls are fast, and sends one compact reply over the slow network.",
          "The example compares the total wait for direct calls versus one BFF call."
        ],
        "example": "Ordering a thali instead of asking three different kitchen counters for rice, dal and sabzi separately: one trip, one plate, everything you need.",
        "code": "mobile_round_trip_ms = 250\ninternal_call_ms = 15\nservices = [\"users\", \"orders\", \"reviews\"]\ndirect = len(services) * mobile_round_trip_ms\nbff = mobile_round_trip_ms + len(services) * internal_call_ms\nprint(f\"app calls each service: {direct} ms\")\nprint(f\"app calls one BFF: {bff} ms\")",
        "output": "app calls each service: 750 ms\napp calls one BFF: 295 ms",
        "codeNotes": [
          {
            "line": 5,
            "note": "One slow trip, then fast calls inside the datacentre."
          }
        ],
        "tryIt": "If the BFF calls the three services in parallel, what is its total time?",
        "check": {
          "question": "What problem does a backend-for-frontend solve?",
          "options": [
            "Slow databases",
            "Clients making many slow round trips and knowing every service",
            "Too many servers"
          ],
          "answer": 1,
          "why": "The BFF gathers data server-side and returns it in one tailored response."
        }
      },
      {
        "title": "Aggregating a profile",
        "say": [
          "Practice 1: aggregate_profile(user_id, get_user, get_orders, get_reviews) calls the three services and returns the user id, name, the first 3 orders, the order count, the review count and partial False.",
          "Reviews are optional. If get_reviews raises, still answer, with reviews_count None and partial True. Users and orders are essential, so their errors propagate.",
          "Deciding which parts are essential and which are optional is a product decision; write it down.",
          "A good rule: if the screen makes no sense without it, it is essential; if the screen still helps the user without it, it is optional.",
          "The partial flag lets the client show a small note (\"reviews unavailable\") instead of hiding the problem or failing the whole screen.",
          "The services are passed in as functions, so tests can use fakes, including ones that fail.",
          "The example builds the profile twice: once healthy, once with reviews down."
        ],
        "example": "A newspaper that still goes to print when the crossword setter is ill, with a note that the crossword returns tomorrow, but would not print without the front page.",
        "code": "def aggregate_profile(user_id, get_user, get_orders, get_reviews):\n    user = get_user(user_id)\n    orders = get_orders(user_id)\n    try:\n        reviews_count, partial = len(get_reviews(user_id)), False\n    except Exception:\n        reviews_count, partial = None, True\n    return {\"user_id\": user_id, \"name\": user[\"name\"], \"recent_orders\": orders[:3],\n            \"orders_count\": len(orders), \"reviews_count\": reviews_count, \"partial\": partial}\n\nget_user = lambda uid: {\"name\": \"Asha\"}\nget_orders = lambda uid: [\"o1\", \"o2\", \"o3\", \"o4\"]\ndef reviews_down(uid):\n    raise TimeoutError(\"reviews timed out\")\n\nprint(aggregate_profile(\"u1\", get_user, get_orders, lambda uid: [\"r1\", \"r2\"]))\nprint(aggregate_profile(\"u1\", get_user, get_orders, reviews_down))",
        "output": "{'user_id': 'u1', 'name': 'Asha', 'recent_orders': ['o1', 'o2', 'o3'], 'orders_count': 4, 'reviews_count': 2, 'partial': False}\n{'user_id': 'u1', 'name': 'Asha', 'recent_orders': ['o1', 'o2', 'o3'], 'orders_count': 4, 'reviews_count': None, 'partial': True}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Essential data: errors here propagate."
          },
          {
            "line": 7,
            "note": "Optional data: degrade and flag the response as partial."
          },
          {
            "line": 8,
            "note": "Only what the screen needs: the first 3 orders."
          }
        ],
        "tryIt": "Make get_orders raise. Should the BFF still answer? What does the code do?",
        "check": {
          "question": "Why return partial: True instead of failing when reviews are down?",
          "options": [
            "To hide the error",
            "The screen can still show the essential data with a small note",
            "Reviews are never important"
          ],
          "answer": 1,
          "why": "Graceful degradation keeps the main experience working."
        }
      },
      {
        "title": "Calling services in parallel",
        "say": [
          "Calling services one after another adds their latencies. If they are independent, call them in parallel so the total is roughly the slowest one.",
          "In Python, concurrent.futures.ThreadPoolExecutor runs blocking calls in parallel threads; asyncio does the same for async code.",
          "Always set a timeout for each call, so one slow service cannot hold the whole response. Optional parts can be dropped when they time out.",
          "Choose the timeout from the screen's latency budget: if the whole page must load in 300 ms, no single call can be allowed 2 seconds.",
          "Parallel calls multiply load on backends when traffic spikes, so combine them with the rate limits and breakers from earlier lessons.",
          "Our simulation uses fixed latencies to compare sequential and parallel totals without real waiting.",
          "The rule of thumb: sequential total = sum; parallel total = max."
        ],
        "example": "Three friends each queueing at a different counter at the same time, instead of one person visiting all three counters in turn.",
        "code": "latency_ms = {\"users\": 40, \"orders\": 120, \"reviews\": 90}\nprint(\"sequential:\", sum(latency_ms.values()), \"ms\")\nprint(\"parallel:\", max(latency_ms.values()), \"ms\")\ntimeout_ms = 100\nwithin = [s for s, ms in latency_ms.items() if ms <= timeout_ms]\nlate = [s for s, ms in latency_ms.items() if ms > timeout_ms]\nprint(\"with a 100 ms timeout: answered\", within, \"timed out\", late)",
        "output": "sequential: 250 ms\nparallel: 120 ms\nwith a 100 ms timeout: answered ['users', 'reviews'] timed out ['orders']",
        "codeNotes": [
          {
            "line": 3,
            "note": "Parallel calls take as long as the slowest one."
          },
          {
            "line": 6,
            "note": "Slow optional parts can be dropped at the timeout."
          }
        ],
        "tryIt": "Orders is essential. What should the BFF do if orders takes 120 ms with a 100 ms timeout?",
        "check": {
          "question": "What is the total time of three independent calls taking 40, 120 and 90 ms in parallel?",
          "options": [
            "250 ms",
            "120 ms",
            "40 ms"
          ],
          "answer": 1,
          "why": "Parallel calls finish when the slowest one does."
        }
      },
      {
        "title": "CORS headers for browsers",
        "say": [
          "Browsers block a web page from calling an API on a different origin (scheme, domain and port) unless the API allows it. This protection is the same-origin policy.",
          "Cross-Origin Resource Sharing (CORS) headers tell the browser which other origins may call the API and with which methods.",
          "Practice 2: cors_headers(origin, methods) returns Access-Control-Allow-Origin set to the origin and Access-Control-Allow-Methods as the methods joined by commas.",
          "Only echo origins from an allow-list. Blindly allowing any origin, especially with credentials, lets malicious sites call your API as your users.",
          "Browsers send a preflight OPTIONS request for many cross-origin calls; the gateway or BFF must answer it with these headers.",
          "CORS only affects browsers; server-to-server calls ignore it, so it is not a replacement for authentication.",
          "The example allows only the company's own web app."
        ],
        "example": "A building that lets in delivery staff only from a list of approved companies, and only to the loading bay, not every floor.",
        "code": "ALLOWED_ORIGINS = {\"https://app.pinit.example\", \"https://admin.pinit.example\"}\n\ndef cors_headers(origin, methods=(\"GET\", \"POST\", \"PUT\", \"DELETE\")):\n    return {\"Access-Control-Allow-Origin\": origin, \"Access-Control-Allow-Methods\": \",\".join(methods)}\n\ndef respond_to(origin):\n    if origin not in ALLOWED_ORIGINS:\n        return {}\n    return cors_headers(origin, (\"GET\", \"POST\"))\n\nprint(respond_to(\"https://app.pinit.example\"))\nprint(respond_to(\"https://evil.example\"))",
        "output": "{'Access-Control-Allow-Origin': 'https://app.pinit.example', 'Access-Control-Allow-Methods': 'GET,POST'}\n{}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Echo the allowed origin and list the methods."
          },
          {
            "line": 7,
            "note": "Unknown origins get no CORS headers, so the browser blocks them."
          }
        ],
        "tryIt": "Add a Access-Control-Max-Age header so browsers cache the preflight for 10 minutes.",
        "check": {
          "question": "Why only echo origins from an allow-list?",
          "options": [
            "Browsers require short lists",
            "Allowing any origin lets malicious sites call your API as your users",
            "To save bandwidth"
          ],
          "answer": 1,
          "why": "CORS is a security control; opening it widely defeats its purpose."
        }
      },
      {
        "title": "One BFF per client type",
        "say": [
          "Different clients need different shapes of data: the mobile app wants small payloads, the web dashboard wants more detail, partners want a stable public API.",
          "A BFF per client type lets each evolve independently, owned by the team that builds that client.",
          "Keep BFFs thin: aggregation, shaping and client-specific rules only. Business logic belongs in the core services, or it gets duplicated across BFFs.",
          "Small, thin BFFs are also quick to change, which is the whole point: the mobile team can adjust its API in the same release as the app.",
          "GraphQL is an alternative: one flexible endpoint where each client asks for exactly the fields it wants. It solves similar problems in a different way.",
          "The gateway (security, limits) and the BFFs (shaping) often work together: gateway first, then the BFF for that client.",
          "The example shapes the same data for mobile and web."
        ],
        "example": "The same kitchen serving a quick tiffin box for office workers and a full sit-down meal for diners: same food, different packaging.",
        "code": "profile = {\"name\": \"Asha\", \"orders\": [\"o1\", \"o2\", \"o3\", \"o4\", \"o5\"], \"addresses\": [\"home\", \"office\"], \"reviews\": 12, \"loyalty_points\": 340}\n\ndef mobile_bff(p):\n    return {\"name\": p[\"name\"], \"recent_orders\": p[\"orders\"][:2], \"points\": p[\"loyalty_points\"]}\n\ndef web_bff(p):\n    return {**p, \"orders_count\": len(p[\"orders\"])}\n\nprint(\"mobile:\", mobile_bff(profile))\nprint(\"web:\", web_bff(profile))",
        "output": "mobile: {'name': 'Asha', 'recent_orders': ['o1', 'o2'], 'points': 340}\nweb: {'name': 'Asha', 'orders': ['o1', 'o2', 'o3', 'o4', 'o5'], 'addresses': ['home', 'office'], 'reviews': 12, 'loyalty_points': 340, 'orders_count': 5}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Small payload for slow mobile networks."
          },
          {
            "line": 7,
            "note": "More detail for the web dashboard."
          }
        ],
        "tryIt": "Write a partner_bff that hides loyalty points and addresses.",
        "check": {
          "question": "What should NOT go into a BFF?",
          "options": [
            "Response shaping for its client",
            "Core business rules shared by all clients",
            "Aggregation of several services"
          ],
          "answer": 1,
          "why": "Business logic in BFFs gets duplicated and drifts apart."
        }
      },
      {
        "title": "Operating the edge",
        "say": [
          "Every request passes through the gateway and a BFF, so they must be fast, horizontally scaled and well monitored.",
          "Cache aggregated responses briefly when possible; profile screens are often requested many times in a row.",
          "Be careful to key such caches by user and permissions, so one user's aggregated profile is never served to another.",
          "Propagate request ids and trace headers to every service the BFF calls, so one user action can be followed end to end (tomorrow's topic).",
          "Version APIs carefully: mobile apps stay installed for months, so old versions must keep working.",
          "Measure partial responses: a rising rate of partial: True means an optional service is struggling.",
          "The example counts partial responses in a sample of BFF logs."
        ],
        "example": "The front counter of a busy bank branch: it must be quick and never closed, and the manager watches how often customers are told \"that service is unavailable today\".",
        "code": "responses = [{\"partial\": False}] * 90 + [{\"partial\": True}] * 10\npartial_rate = sum(r[\"partial\"] for r in responses) / len(responses)\nprint(f\"partial responses: {partial_rate:.0%}\")\nprint(\"investigate reviews service\" if partial_rate > 0.05 else \"normal\")",
        "output": "partial responses: 10%\ninvestigate reviews service",
        "codeNotes": [
          {
            "line": 2,
            "note": "The share of responses that were degraded."
          }
        ],
        "tryIt": "Set the alert threshold to 20%. Would this sample trigger it?",
        "check": {
          "question": "Why must old API versions keep working for mobile apps?",
          "options": [
            "Old code is faster",
            "Users keep old app versions installed for a long time",
            "App stores require it"
          ],
          "answer": 1,
          "why": "You cannot force every user to update, so the edge must support older clients."
        }
      }
    ],
    "summary": [
      "BFFs gather data server-side so clients make one call instead of many.",
      "Aggregate essential data strictly; degrade optional data and flag partial responses.",
      "Call independent services in parallel with timeouts: total = the slowest.",
      "Return CORS headers only for allow-listed origins.",
      "Keep BFFs thin, one per client type; propagate request ids and version carefully."
    ],
    "projectStep": {
      "title": "BFF",
      "steps": [
        "Add aggregate_profile and cors_headers to dist_toolkit.py.",
        "Aggregate a profile with reviews failing and show the partial flag.",
        "Bonus: write mobile and web shapes of the same profile data."
      ]
    }
  }
];
