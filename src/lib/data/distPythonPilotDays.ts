/**
 * "Distributed Systems in Python" lessons: the same lessons as High-Scale Distributed System Design (distributedPilotDays.ts), with every
 * code example rewritten in Python. The expected outputs are what python3 prints for each example
 * (tests/python_track_lessons.test.ts runs them all). Code-anatomy snippets that are not
 * JavaScript (config, SQL, protocol text) are shared as they are.
 */
import { DayLessonPlan } from '../types/lessonEngine';
import { DISTRIBUTED_PILOT_DAYS } from './distributedPilotDays';
import { PythonBlockCode, toPythonLessons } from './pythonLessonOverlay';

/** Python code for each lesson block, by block id. */
export const DIST_PYTHON_BLOCK_CODE: Record<string, PythonBlockCode> = {
  "dist-d1-b1-eight-fallacies-overview": {
    "run": {
      "filename": "latency_distance_sim.py",
      "initialCode": "def calculate_fiber_latency(distance_km):\n    # Light in glass fibre travels about 200,000 km/s (5 microseconds per km)\n    one_way_ms = distance_km / 200_000 * 1000\n    return {\n        'distance_km': distance_km,\n        'one_way_latency_ms': round(one_way_ms, 2),\n        'round_trip_time_ms': round(one_way_ms * 2, 2),\n    }\n\n\nprint('NY to London (5,500 km):', calculate_fiber_latency(5500))\nprint('San Francisco to Tokyo (8,200 km):', calculate_fiber_latency(8200))",
      "expectedOutput": "NY to London (5,500 km): {'distance_km': 5500, 'one_way_latency_ms': 27.5, 'round_trip_time_ms': 55.0}\nSan Francisco to Tokyo (8,200 km): {'distance_km': 8200, 'one_way_latency_ms': 41.0, 'round_trip_time_ms': 82.0}"
    }
  },
  "dist-d1-b2-timeouts-and-exponential-backoff": {
    "run": {
      "filename": "backoff_sim_demo.py",
      "initialCode": "def get_backoff_intervals(attempts=4, base_ms=100):\n    return [f'Attempt {i + 1}: Max {base_ms * 2 ** i}ms' for i in range(attempts)]\n\n\nprint('\\n'.join(get_backoff_intervals()))",
      "expectedOutput": "Attempt 1: Max 100ms\nAttempt 2: Max 200ms\nAttempt 3: Max 400ms\nAttempt 4: Max 800ms"
    },
    "anatomy": {
      "codeSnippet": "base_delay_ms = 100\nmax_delay_ms = 5000\nexponential_cap = min(max_delay_ms, base_delay_ms * 2 ** attempt)\nsleep_ms = random.randrange(exponential_cap)  # Full Jitter!",
      "lineNotes": {
        "3": "Exponentially doubles wait time on each subsequent failed retry attempt.",
        "4": "Random jitter decorrelates retry bursts across thousands of concurrent clients."
      }
    }
  },
  "dist-d1-b3-idempotency-at-network-layer": {
    "run": {
      "filename": "idempotent_charge_demo.py",
      "initialCode": "import itertools\n\ncharge_numbers = itertools.count(1)\n\n\ndef execute_charge(idempotency_key, store):\n    if idempotency_key in store:\n        return {'duplicate': True, 'charge_id': store[idempotency_key], 'message': 'RETRY_SERVED_FROM_IDEMPOTENCY_CACHE'}\n    charge_id = f'ch_{next(charge_numbers)}'\n    store[idempotency_key] = charge_id\n    return {'duplicate': False, 'charge_id': charge_id, 'message': 'NEW_PAYMENT_PROCESSED'}\n\n\ncache = {}\nprint('Call 1:', execute_charge('key_order_9981', cache)['message'])\nprint('Call 2 (Network Retry):', execute_charge('key_order_9981', cache)['message'])",
      "expectedOutput": "Call 1: NEW_PAYMENT_PROCESSED\nCall 2 (Network Retry): RETRY_SERVED_FROM_IDEMPOTENCY_CACHE"
    }
  },
  "dist-d2-b1-cap-theorem-formal-proof": {
    "run": {
      "filename": "cap_decision_demo.py",
      "initialCode": "def evaluate_cap_choice(system_type, has_network_partition):\n    if not has_network_partition:\n        return 'NORMAL_OPERATION_CONSISTENT_AND_AVAILABLE'\n    if system_type == 'CP':\n        return 'CP_MODE: REJECT_WRITE_TO_PRESERVE_CONSISTENCY (500 Error)'\n    return 'AP_MODE: ACCEPT_WRITE_MAY_CAUSE_REPLICATION_LAG_DIVERGENCE (200 OK)'\n\n\nprint('Normal:', evaluate_cap_choice('CP', False))\nprint('CP during Partition:', evaluate_cap_choice('CP', True))\nprint('AP during Partition:', evaluate_cap_choice('AP', True))",
      "expectedOutput": "Normal: NORMAL_OPERATION_CONSISTENT_AND_AVAILABLE\nCP during Partition: CP_MODE: REJECT_WRITE_TO_PRESERVE_CONSISTENCY (500 Error)\nAP during Partition: AP_MODE: ACCEPT_WRITE_MAY_CAUSE_REPLICATION_LAG_DIVERGENCE (200 OK)"
    }
  },
  "dist-d2-b2-pacelc-theorem-normal-tradeoff": {
    "run": {
      "filename": "pacelc_demo.py",
      "initialCode": "DB_PROFILES = {\n    'DynamoDB': 'PA/EL (Partition: Availability | Normal: Low Latency)',\n    'Spanner': 'PC/EC (Partition: Consistency | Normal: Strong Consistency)',\n    'Cassandra': 'PA/EL (Partition: Availability | Normal: Low Latency)',\n}\n\n\ndef get_pacelc_profile(db_name):\n    return DB_PROFILES.get(db_name, 'UNKNOWN')\n\n\nprint('DynamoDB:', get_pacelc_profile('DynamoDB'))\nprint('Spanner:', get_pacelc_profile('Spanner'))",
      "expectedOutput": "DynamoDB: PA/EL (Partition: Availability | Normal: Low Latency)\nSpanner: PC/EC (Partition: Consistency | Normal: Strong Consistency)"
    }
  },
  "dist-d2-b3-tunable-consistency-quorum-math": {
    "run": {
      "filename": "quorum_math_demo.py",
      "initialCode": "def evaluate_quorum_consistency(n, r, w):\n    strong = r + w > n\n    return {\n        'replication_factor': n,\n        'read_quorum': r,\n        'write_quorum': w,\n        'sum': r + w,\n        'guarantee': 'STRONG_CONSISTENCY (Guaranteed Overlap)' if strong else 'EVENTUAL_CONSISTENCY (Risk of Stale Read)',\n    }\n\n\nprint('N=3, R=2, W=2:', evaluate_quorum_consistency(3, 2, 2))\nprint('N=3, R=1, W=1:', evaluate_quorum_consistency(3, 1, 1))",
      "expectedOutput": "N=3, R=2, W=2: {'replication_factor': 3, 'read_quorum': 2, 'write_quorum': 2, 'sum': 4, 'guarantee': 'STRONG_CONSISTENCY (Guaranteed Overlap)'}\nN=3, R=1, W=1: {'replication_factor': 3, 'read_quorum': 1, 'write_quorum': 1, 'sum': 2, 'guarantee': 'EVENTUAL_CONSISTENCY (Risk of Stale Read)'}"
    }
  },
  "dist-d3-b1-json-vs-protobuf-wire-format": {
    "run": {
      "filename": "wire_size_demo.py",
      "initialCode": "import json\n\n\ndef compare_wire_payloads(order_id, amount, ts):\n    json_text = json.dumps({'order_id': order_id, 'amount': amount, 'timestamp': ts}, separators=(',', ':'))\n    protobuf_bytes = 1 + len(order_id) + 1 + 8 + 1 + 8  # tag + string, tag + double, tag + int64\n    return {\n        'json_bytes': len(json_text),\n        'protobuf_bytes': protobuf_bytes,\n        'bandwidth_savings': f'{(len(json_text) - protobuf_bytes) / len(json_text) * 100:.1f}%',\n    }\n\n\nprint(compare_wire_payloads('ord_998124', 499.99, 1704067200))",
      "expectedOutput": "{'json_bytes': 64, 'protobuf_bytes': 29, 'bandwidth_savings': '54.7%'}"
    }
  },
  "dist-d3-b2-grpc-streaming-modes": {
    "run": {
      "filename": "grpc_mode_demo.py",
      "initialCode": "def select_grpc_mode(use_case):\n    modes = {\n        'FILE_UPLOAD': 'CLIENT_STREAMING_RPC',\n        'LIVE_LOG_FEED': 'SERVER_STREAMING_RPC',\n        'REAL_TIME_CHAT': 'BIDIRECTIONAL_STREAMING_RPC',\n    }\n    return modes.get(use_case, 'UNARY_RPC')\n\n\nprint('Use Case: Live Log Feed:', select_grpc_mode('LIVE_LOG_FEED'))\nprint('Use Case: Real-time Chat:', select_grpc_mode('REAL_TIME_CHAT'))",
      "expectedOutput": "Use Case: Live Log Feed: SERVER_STREAMING_RPC\nUse Case: Real-time Chat: BIDIRECTIONAL_STREAMING_RPC"
    }
  },
  "dist-d3-b3-http2-multiplexing-hol-blocking": {
    "run": {
      "filename": "multiplex_demo.py",
      "initialCode": "def evaluate_multiplexing(http_version):\n    if http_version == 'HTTP/2':\n        return {'connections': 1, 'max_concurrent_streams': 100, 'head_of_line_blocked': False}\n    return {'connections': 6, 'max_concurrent_streams': 6, 'head_of_line_blocked': True}\n\n\nprint('HTTP/2 Performance:', evaluate_multiplexing('HTTP/2'))",
      "expectedOutput": "HTTP/2 Performance: {'connections': 1, 'max_concurrent_streams': 100, 'head_of_line_blocked': False}"
    }
  },
  "dist-d4-b1-modulo-hashing-disaster": {
    "run": {
      "filename": "modulo_churn_demo.py",
      "initialCode": "def calculate_modulo_churn(key_count, original_nodes, new_nodes):\n    remapped = sum(1 for k in range(key_count) if k % original_nodes != k % new_nodes)\n    churn = remapped / key_count * 100\n    return f'Modulo Churn from {original_nodes} to {new_nodes} servers: {churn:.1f}% of keys shifted!'\n\n\nprint(calculate_modulo_churn(1000, 9, 10))",
      "expectedOutput": "Modulo Churn from 9 to 10 servers: 89.2% of keys shifted!"
    }
  },
  "dist-d4-b2-virtual-nodes-load-balancing": {
    "run": {
      "filename": "vnode_balance_demo.py",
      "initialCode": "def evaluate_ring_variance(vnodes_per_server):\n    if vnodes_per_server == 1:\n        return {'variance': '45% (HIGH HOTSPOT RISK)', 'distribution': 'UNEVEN_CLUSTERING'}\n    if vnodes_per_server == 100:\n        return {'variance': '3.2% (UNIFORM LOAD)', 'distribution': 'HIGHLY_BALANCED'}\n    return {'variance': '< 1.5%', 'distribution': 'OPTIMAL'}\n\n\nprint('1 V-Node per Server:', evaluate_ring_variance(1))\nprint('100 V-Nodes per Server:', evaluate_ring_variance(100))",
      "expectedOutput": "1 V-Node per Server: {'variance': '45% (HIGH HOTSPOT RISK)', 'distribution': 'UNEVEN_CLUSTERING'}\n100 V-Nodes per Server: {'variance': '3.2% (UNIFORM LOAD)', 'distribution': 'HIGHLY_BALANCED'}"
    }
  },
  "dist-d4-b3-binary-search-ring-lookup": {
    "run": {
      "filename": "ring_lookup_demo.py",
      "initialCode": "import bisect\n\n\ndef find_clockwise_node(key_hash, ring):\n    hashes = [node['hash'] for node in ring]  # ring is sorted by hash\n    i = bisect.bisect_left(hashes, key_hash)  # binary search: O(log N)\n    return ring[i % len(ring)]['id']  # past the end: wrap round to the start\n\n\nring = [{'hash': 100, 'id': 'ServerA'}, {'hash': 300, 'id': 'ServerB'}, {'hash': 700, 'id': 'ServerC'}]\nprint('Key Hash 250 ->', find_clockwise_node(250, ring))\nprint('Key Hash 800 (Wrap) ->', find_clockwise_node(800, ring))",
      "expectedOutput": "Key Hash 250 -> ServerB\nKey Hash 800 (Wrap) -> ServerA"
    }
  },
  "dist-d5-b1-caching-patterns-taxonomy": {
    "run": {
      "filename": "cache_aside_demo.py",
      "initialCode": "def cache_aside_get(key, cache, db_query):\n    if key in cache:\n        return {'source': 'CACHE_HIT (0ms)', 'data': cache[key]}\n    data = db_query(key)\n    cache[key] = data\n    return {'source': 'DATABASE_QUERY_AND_CACHED (25ms)', 'data': data}\n\n\ncache = {}\ndb_query = lambda k: {'id': k, 'balance': 1000}\nprint('First Call:', cache_aside_get('acc_1', cache, db_query)['source'])\nprint('Second Call:', cache_aside_get('acc_1', cache, db_query)['source'])",
      "expectedOutput": "First Call: DATABASE_QUERY_AND_CACHED (25ms)\nSecond Call: CACHE_HIT (0ms)"
    }
  },
  "dist-d5-b2-thundering-herd-singleflight": {
    "run": {
      "filename": "singleflight_sim.py",
      "initialCode": "class Singleflight:\n    \"\"\"Requests for a key that is already being loaded wait for that load instead of starting another.\"\"\"\n\n    def __init__(self):\n        self.in_flight = {}  # key -> list of waiting requests\n\n    def request(self, key, request_id):\n        first = key not in self.in_flight\n        self.in_flight.setdefault(key, []).append(request_id)\n        return first  # only the first request queries the database\n\n    def finish(self, key, value):\n        return {request_id: value for request_id in self.in_flight.pop(key)}\n\n\nsf = Singleflight()\ndb_hits = 0\nfor request_id in ('r1', 'r2', 'r3'):  # three requests arrive at the same moment\n    if sf.request('k1', request_id):\n        db_hits += 1\nanswers = sf.finish('k1', 'DB_VALUE')  # the one database query returns\nprint('Total DB Queries Executed:', db_hits)\nprint('Returned Value:', answers['r1'])",
      "expectedOutput": "Total DB Queries Executed: 1\nReturned Value: DB_VALUE"
    }
  },
  "dist-d5-b3-milestone1-dist-cert": {
    "run": {
      "filename": "milestone1_dist_cert.py",
      "initialCode": "print('⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense [VERIFIED 100%]"
    }
  },
  "dist-d6-b1-gc-pauses-lock-hazard": {
    "run": {
      "filename": "fencing_storage_sim.py",
      "initialCode": "class FencedStorage:\n    def __init__(self):\n        self.highest_token = 0\n        self.data = None\n\n    def write(self, fencing_token, value):\n        if fencing_token <= self.highest_token:\n            return {'success': False, 'error': f'WRITE_REJECTED_STALE_FENCING_TOKEN ({fencing_token} <= {self.highest_token})'}\n        self.highest_token = fencing_token\n        self.data = value\n        return {'success': True, 'stored': value}\n\n\ndb = FencedStorage()\nprint('Client 2 writes with Token 34:', db.write(34, 'Client 2 Data')['success'])\nprint('Delayed Client 1 writes with Token 33:', db.write(33, 'Client 1 Stale Data')['error'])",
      "expectedOutput": "Client 2 writes with Token 34: True\nDelayed Client 1 writes with Token 33: WRITE_REJECTED_STALE_FENCING_TOKEN (33 <= 34)"
    },
    "diff": {
      "brokenCode": "# ❌ NAIVE REDIS LOCK (Vulnerable to GC pauses):\n1. Client 1 acquires 'lock:order'\n2. Client 1 enters 10s GC pause -> Redis TTL expires!\n3. Client 2 acquires 'lock:order' and writes to DB\n4. Client 1 wakes up and writes to DB -> OVERWRITES & CORRUPTS Client 2's data!",
      "fixedCode": "# ✅ FENCING TOKEN DISTRIBUTED LOCK:\n1. Client 1 acquires lock with Fencing Token = 33\n2. Client 1 pauses; Lock expires -> Client 2 acquires lock with Fencing Token = 34\n3. Client 2 writes to DB with Token 34 -> Storage records highest seen token = 34\n4. Client 1 wakes up and attempts write with Token 33 -> Storage REJECTS (33 < 34)!"
    }
  },
  "dist-d6-b2-redlock-multi-master-algorithm": {
    "run": {
      "filename": "redlock_sim.py",
      "initialCode": "def evaluate_redlock(acquired_count, total_masters=5, validity_ms=9800):\n    quorum = total_masters // 2 + 1\n    granted = acquired_count >= quorum and validity_ms > 0\n    return {\n        'acquired_count': acquired_count,\n        'quorum_required': quorum,\n        'lock_granted': granted,\n        'status': 'REDLOCK_ACQUISITION_SUCCESS' if granted else 'REDLOCK_FAILED_RELEASE_ALL',\n    }\n\n\nprint('Acquired on 4 of 5 nodes:', evaluate_redlock(4)['status'])\nprint('Acquired on 2 of 5 nodes:', evaluate_redlock(2)['status'])",
      "expectedOutput": "Acquired on 4 of 5 nodes: REDLOCK_ACQUISITION_SUCCESS\nAcquired on 2 of 5 nodes: REDLOCK_FAILED_RELEASE_ALL"
    },
    "anatomy": {
      "codeSnippet": "ttl_ms = 10_000\nacquisition_elapsed_ms = 150\nclock_drift_ms = 50\nremaining_validity_ms = ttl_ms - acquisition_elapsed_ms - clock_drift_ms  # 9,800 ms validity",
      "lineNotes": {
        "4": "Subtracts acquisition time and clock drift to guarantee valid lease window."
      }
    }
  },
  "dist-d6-b3-auto-renew-heartbeat-leases": {
    "run": {
      "filename": "watchdog_demo.py",
      "initialCode": "def get_watchdog_interval(ttl_sec=30):\n    interval = ttl_sec // 3\n    return f'Renew lock lease every {interval} seconds while worker thread is alive.'\n\n\nprint(get_watchdog_interval(30))",
      "expectedOutput": "Renew lock lease every 10 seconds while worker thread is alive."
    }
  },
  "dist-d7-b1-bully-algorithm-mechanics": {
    "run": {
      "filename": "bully_sim_demo.py",
      "initialCode": "def elect_bully_leader(active_processes):\n    return f'Process {max(active_processes)} wins Bully election and broadcasts COORDINATOR.'\n\n\nprint(elect_bully_leader([1, 2, 3, 4]))",
      "expectedOutput": "Process 4 wins Bully election and broadcasts COORDINATOR."
    },
    "anatomy": {
      "codeSnippet": "# Node 2 notices Node 5 (Leader) crashed:\n# 1. Node 2 sends ELECTION to Nodes 3, 4, 5\n# 2. Nodes 3 and 4 reply 'OK' (Node 5 is dead)\n# 3. Node 4 sends ELECTION to Node 5 -> No response\n# 4. Node 4 broadcasts: 'COORDINATOR: Node 4 is the new Leader!'",
      "lineNotes": {
        "2": "Higher nodes supersede lower nodes.",
        "5": "Highest surviving node becomes coordinator."
      }
    }
  },
  "dist-d7-b2-raft-randomized-election-timeouts": {
    "run": {
      "filename": "random_timeout_demo.py",
      "initialCode": "import random\n\n\ndef generate_election_timeouts(node_count=3, rng=random):\n    # Each node waits a different random time (150-299 ms), so one usually wakes first and wins\n    return [f'Node {i}: {150 + rng.randrange(150)}ms' for i in range(1, node_count + 1)]\n\n\nrng = random.Random(7)  # a fixed seed so this demo prints the same numbers every run\nprint('\\n'.join(generate_election_timeouts(3, rng)))",
      "expectedOutput": "Node 1: 232ms\nNode 2: 188ms\nNode 3: 251ms"
    }
  },
  "dist-d7-b3-split-brain-majority-quorum": {
    "run": {
      "filename": "split_brain_sim.py",
      "initialCode": "def evaluate_partition_quorum(partition_size, total_cluster=5):\n    majority = total_cluster // 2 + 1\n    if partition_size >= majority:\n        return 'MAJORITY_QUORUM: ELECT_LEADER_AND_PROCESS_WRITES'\n    return 'MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER'\n\n\nprint('Partition with 3 nodes (of 5):', evaluate_partition_quorum(3, 5))\nprint('Partition with 2 nodes (of 5):', evaluate_partition_quorum(2, 5))",
      "expectedOutput": "Partition with 3 nodes (of 5): MAJORITY_QUORUM: ELECT_LEADER_AND_PROCESS_WRITES\nPartition with 2 nodes (of 5): MINORITY_ISOLATION: READ_ONLY_CANNOT_ELECT_LEADER"
    }
  },
  "dist-d8-b1-uuid-vs-snowflake-b-tree": {
    "run": {
      "filename": "snowflake_layout_demo.py",
      "initialCode": "SNOWFLAKE_LAYOUT = {\n    'sign_bit': '1 bit (always 0 for positive numbers)',\n    'timestamp_bits': '41 bits (Milliseconds since custom epoch = 69.7 years capacity)',\n    'datacenter_bits': '5 bits (32 datacenters)',\n    'worker_bits': '5 bits (32 worker machines per datacenter)',\n    'sequence_bits': '12 bits (4,096 unique IDs per millisecond per worker)',\n}\n\nprint('Total bits: 64')\nfor part, meaning in SNOWFLAKE_LAYOUT.items():\n    print(f'{part}: {meaning}')\nprint('IDs per millisecond per worker:', 2 ** 12)",
      "expectedOutput": "Total bits: 64\nsign_bit: 1 bit (always 0 for positive numbers)\ntimestamp_bits: 41 bits (Milliseconds since custom epoch = 69.7 years capacity)\ndatacenter_bits: 5 bits (32 datacenters)\nworker_bits: 5 bits (32 worker machines per datacenter)\nsequence_bits: 12 bits (4,096 unique IDs per millisecond per worker)\nIDs per millisecond per worker: 4096"
    }
  },
  "dist-d8-b2-clock-backward-drift-handling": {
    "run": {
      "filename": "clock_drift_demo.py",
      "initialCode": "def check_clock_drift(current_ts, last_ts):\n    if current_ts < last_ts:\n        return {'safe': False, 'error': 'CLOCK_BACKWARD_DRIFT_DETECTED', 'action': 'REJECT_OR_SLEEP'}\n    return {'safe': True, 'action': 'GENERATE_SNOWFLAKE_ID'}\n\n\nprint('Clock advanced:', check_clock_drift(1001, 1000)['action'])\nprint('Clock rewound by NTP:', check_clock_drift(998, 1000)['action'])",
      "expectedOutput": "Clock advanced: GENERATE_SNOWFLAKE_ID\nClock rewound by NTP: REJECT_OR_SLEEP"
    },
    "anatomy": {
      "codeSnippet": "if current_timestamp < last_timestamp:\n    drift_ms = last_timestamp - current_timestamp\n    if drift_ms <= 5:\n        # Small drift: sleep until the clock catches up\n        time.sleep(drift_ms / 1000)\n    else:\n        # Large drift: raise an error so no duplicate id is ever made\n        raise ValueError('CLOCK_BACKWARD_DRIFT_DETECTED')",
      "lineNotes": {
        "1": "Detects if physical system clock was stepped backward by NTP.",
        "7": "Rejects ID generation to guarantee global mathematical uniqueness."
      }
    }
  },
  "dist-d8-b3-ulid-lexicographical-sorting": {
    "run": {
      "filename": "ulid_demo.py",
      "initialCode": "DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'\n\n\ndef to_base36(n):\n    out = ''\n    while n:\n        n, d = divmod(n, 36)\n        out = DIGITS[d] + out\n    return out or '0'\n\n\ndef generate_mock_ulid(ts):\n    time_part = to_base36(ts).rjust(10, '0')  # fixed width, so text order = time order\n    random_part = '01ARZ3NDEKTSV4RR'\n    return time_part + random_part\n\n\nulid1 = generate_mock_ulid(1700000000000)\nulid2 = generate_mock_ulid(1700000001000)\nprint('ULID 1 (earlier):', ulid1)\nprint('ULID 2 (later):  ', ulid2)\nprint('Lexicographical sort order correct?:', ulid1 < ulid2)",
      "expectedOutput": "ULID 1 (earlier): 00LOYW3V2801ARZ3NDEKTSV4RR\nULID 2 (later):   00LOYW3VU001ARZ3NDEKTSV4RR\nLexicographical sort order correct?: True"
    }
  },
  "dist-d9-b1-raft-log-entry-structure": {
    "run": {
      "filename": "raft_log_demo.py",
      "initialCode": "def verify_log_consistency(follower_log, prev_index, prev_term):\n    if prev_index == 0:\n        return True\n    if prev_index > len(follower_log):\n        return False\n    return follower_log[prev_index - 1]['term'] == prev_term\n\n\nlog = [{'index': 1, 'term': 1}, {'index': 2, 'term': 1}]\nprint('Matches Prev (Index 2, Term 1):', verify_log_consistency(log, 2, 1))\nprint('Mismatch Prev (Index 2, Term 2):', verify_log_consistency(log, 2, 2))",
      "expectedOutput": "Matches Prev (Index 2, Term 1): True\nMismatch Prev (Index 2, Term 2): False"
    },
    "anatomy": {
      "codeSnippet": "raft_log = [\n    {'index': 1, 'term': 1, 'command': 'SET x = 10'},\n    {'index': 2, 'term': 1, 'command': 'SET y = 20'},\n    {'index': 3, 'term': 2, 'command': 'SET x = 15'},  # Leader changed in Term 2\n]",
      "lineNotes": {
        "2": "Index 1 created under Leader Term 1.",
        "4": "Index 3 created under new Leader Term 2."
      }
    }
  },
  "dist-d9-b2-append-entries-rpc-quorum-commit": {
    "run": {
      "filename": "quorum_commit_sim.py",
      "initialCode": "def check_commit_quorum(acked_followers, total_cluster=5):\n    total_acked = acked_followers + 1  # +1 for the leader itself\n    quorum = total_cluster // 2 + 1\n    return 'LOG_ENTRY_COMMITTED' if total_acked >= quorum else 'AWAITING_FURTHER_ACKS'\n\n\nprint('2 Followers Acked (of 5):', check_commit_quorum(2, 5))\nprint('1 Follower Acked (of 5):', check_commit_quorum(1, 5))",
      "expectedOutput": "2 Followers Acked (of 5): LOG_ENTRY_COMMITTED\n1 Follower Acked (of 5): AWAITING_FURTHER_ACKS"
    }
  },
  "dist-d9-b3-log-compaction-snapshots": {
    "run": {
      "filename": "snapshot_demo.py",
      "initialCode": "def compact_raft_log(full_log, snapshot_index, snapshot_state):\n    remaining = [e for e in full_log if e['index'] > snapshot_index]\n    return {'snapshot_state': snapshot_state, 'last_included_index': snapshot_index, 'remaining_log_length': len(remaining)}\n\n\nlog = [{'index': i + 1, 'cmd': 'INC'} for i in range(1000)]\nres = compact_raft_log(log, 900, {'counter': 900})\nprint('Compacted Log Length:', res['remaining_log_length'])",
      "expectedOutput": "Compacted Log Length: 100"
    }
  },
  "dist-d10-b1-2pc-prepare-commit-phases": {
    "run": {
      "filename": "twopc_demo.py",
      "initialCode": "def evaluate_2pc_votes(votes):\n    return 'GLOBAL_COMMIT' if all(v == 'YES' for v in votes) else 'GLOBAL_ABORT'\n\n\nprint('All Cohorts Vote YES:', evaluate_2pc_votes(['YES', 'YES', 'YES']))\nprint('One Cohort Votes NO:', evaluate_2pc_votes(['YES', 'NO', 'YES']))",
      "expectedOutput": "All Cohorts Vote YES: GLOBAL_COMMIT\nOne Cohort Votes NO: GLOBAL_ABORT"
    }
  },
  "dist-d10-b2-coordinator-blocking-failure-mode": {
    "run": {
      "filename": "blocking_sim.py",
      "initialCode": "def evaluate_cohort_state(has_voted_yes, coordinator_alive):\n    if has_voted_yes and not coordinator_alive:\n        return 'BLOCKED_HOLDING_EXCLUSIVE_ROW_LOCKS_INDEFINITELY'\n    return 'COHORT_NORMAL_EXECUTION'\n\n\nprint(evaluate_cohort_state(True, False))",
      "expectedOutput": "BLOCKED_HOLDING_EXCLUSIVE_ROW_LOCKS_INDEFINITELY"
    },
    "diff": {
      "brokenCode": "# ❌ 2PC BLOCKING HAZARD:\n1. Coordinator sends 'PREPARE' -> DB1 & DB2 acquire row locks and vote YES\n2. Coordinator CRASHES before sending Phase 2 decision\n3. DB1 and DB2 are STUCK holding row locks forever, blocking all other app queries!",
      "fixedCode": "# ✅ MODERN SOLUTION (Saga Pattern or 3PC):\n# Use Sagas with independent local transactions and compensating rollbacks,\n# completely avoiding long-lived distributed 2PC row locks!"
    }
  },
  "dist-d10-b3-three-phase-commit-non-blocking": {
    "run": {
      "filename": "three_pc_demo.py",
      "initialCode": "THREE_PC_PHASES = [\n    'Phase 1: CanCommit? (Check resource availability)',\n    'Phase 2: PreCommit (Write intent to log; timeout triggers abort)',\n    'Phase 3: DoCommit (Final commit; timeout triggers auto-commit)',\n]\n\nprint('\\n'.join(THREE_PC_PHASES))",
      "expectedOutput": "Phase 1: CanCommit? (Check resource availability)\nPhase 2: PreCommit (Write intent to log; timeout triggers abort)\nPhase 3: DoCommit (Final commit; timeout triggers auto-commit)"
    }
  },
  "dist-d11-b1-saga-pattern-compensations": {
    "run": {
      "filename": "saga_rollback_demo.py",
      "initialCode": "def run_saga(steps):\n    executed = []\n    for step in steps:\n        if step['should_fail']:\n            rollbacks = [f\"Rollback: {done['compensate']}\" for done in reversed(executed)]\n            return {'status': 'SAGA_FAILED', 'rollbacks': rollbacks}\n        executed.append(step)\n    return {'status': 'SAGA_SUCCESS'}\n\n\nsteps = [\n    {'name': 'Payment', 'compensate': 'refund()', 'should_fail': False},\n    {'name': 'Inventory', 'compensate': 'restock()', 'should_fail': True},\n]\nprint(run_saga(steps))",
      "expectedOutput": "{'status': 'SAGA_FAILED', 'rollbacks': ['Rollback: refund()']}"
    },
    "anatomy": {
      "codeSnippet": "saga_definitions = [\n    {'name': 'ReserveCredit', 'action': 'charge_user_card()', 'compensate': 'refund_user_card()'},\n    {'name': 'ReserveInventory', 'action': 'decrement_stock()', 'compensate': 'restock_inventory()'},\n    {'name': 'CreateShipment', 'action': 'create_fedex_label()', 'compensate': 'cancel_fedex_label()'},\n]",
      "lineNotes": {
        "2": "Every forward action has a matching semantic undo compensating action.",
        "4": "If CreateShipment fails, restock_inventory() and refund_user_card() execute in reverse order."
      }
    }
  },
  "dist-d11-b2-orchestration-vs-choreography": {
    "run": {
      "filename": "saga_picker_demo.py",
      "initialCode": "def select_saga_pattern(step_count, needs_audit_trail):\n    if step_count >= 4 or needs_audit_trail:\n        return 'ORCHESTRATION_SAGA (Central State Machine with Temporal/AWS Step Functions)'\n    return 'CHOREOGRAPHY_SAGA (Decentralized Kafka Event Pub/Sub)'\n\n\nprint('6-step eCommerce Checkout with Auditing:', select_saga_pattern(6, True))\nprint('2-step Simple User Notification:', select_saga_pattern(2, False))",
      "expectedOutput": "6-step eCommerce Checkout with Auditing: ORCHESTRATION_SAGA (Central State Machine with Temporal/AWS Step Functions)\n2-step Simple User Notification: CHOREOGRAPHY_SAGA (Decentralized Kafka Event Pub/Sub)"
    }
  },
  "dist-d11-b3-pivot-vs-retriable-transactions": {
    "run": {
      "filename": "pivot_step_demo.py",
      "initialCode": "def classify_saga_step(step_name):\n    if step_name == 'ChargeCard':\n        return 'PIVOT_TRANSACTION (Point of no return)'\n    if step_name == 'CheckInventory':\n        return 'COMPENSABLE_TRANSACTION'\n    return 'RETRIABLE_TRANSACTION (Send email, generate PDF)'\n\n\nprint(classify_saga_step('ChargeCard'))",
      "expectedOutput": "PIVOT_TRANSACTION (Point of no return)"
    }
  },
  "dist-d12-b1-kafka-commit-log-architecture": {
    "run": {
      "filename": "partition_hash_demo.py",
      "initialCode": "def calculate_partition(key, total_partitions=6):\n    h = 0\n    for ch in key:\n        h = (h * 31 + ord(ch)) % 2 ** 32\n    return {'key': key, 'partition': h % total_partitions, 'total_partitions': total_partitions}\n\n\nprint(calculate_partition('order_cust_101', 6))\nprint(calculate_partition('order_cust_101', 6))  # the same key always lands on the same partition!",
      "expectedOutput": "{'key': 'order_cust_101', 'partition': 1, 'total_partitions': 6}\n{'key': 'order_cust_101', 'partition': 1, 'total_partitions': 6}"
    },
    "anatomy": {
      "codeSnippet": "kafka_record = {\n    'topic': 'orders.v1',\n    'partition': 2,\n    'offset': 104289,\n    'key': 'user_9981',\n    'value': json.dumps({'amount': 49.99}).encode(),\n    'timestamp': 1704067200000,\n}",
      "lineNotes": {
        "3": "Partition 2 contains ordered stream for keys hashing to 2.",
        "4": "Monotonic offset uniquely identifies message within partition."
      }
    }
  },
  "dist-d12-b2-consumer-group-rebalancing": {
    "run": {
      "filename": "consumer_allocation_demo.py",
      "initialCode": "def evaluate_consumer_scaling(num_partitions, num_consumers):\n    idle = max(0, num_consumers - num_partitions)\n    return {\n        'num_partitions': num_partitions,\n        'num_consumers': num_consumers,\n        'active_consumers': min(num_partitions, num_consumers),\n        'idle_consumers': idle,\n        'warning': 'EXCESS_IDLE_CONSUMERS_DETECTED' if idle else 'OPTIMAL_ALLOCATION',\n    }\n\n\nprint(evaluate_consumer_scaling(4, 6))",
      "expectedOutput": "{'num_partitions': 4, 'num_consumers': 6, 'active_consumers': 4, 'idle_consumers': 2, 'warning': 'EXCESS_IDLE_CONSUMERS_DETECTED'}"
    }
  },
  "dist-d12-b3-offset-commit-semantics-lag": {
    "run": {
      "filename": "consumer_lag_demo.py",
      "initialCode": "def calculate_consumer_lag(log_end_offset, current_offset):\n    lag = log_end_offset - current_offset\n    return {\n        'log_end_offset': log_end_offset,\n        'current_offset': current_offset,\n        'consumer_lag_messages': lag,\n        'health_status': 'CONSUMER_FALLING_BEHIND_ALERT' if lag > 5000 else 'CONSUMER_HEALTHY',\n    }\n\n\nprint(calculate_consumer_lag(100_000, 99_950))\nprint(calculate_consumer_lag(100_000, 92_000))",
      "expectedOutput": "{'log_end_offset': 100000, 'current_offset': 99950, 'consumer_lag_messages': 50, 'health_status': 'CONSUMER_HEALTHY'}\n{'log_end_offset': 100000, 'current_offset': 92000, 'consumer_lag_messages': 8000, 'health_status': 'CONSUMER_FALLING_BEHIND_ALERT'}"
    }
  },
  "dist-d13-b1-delivery-semantics-triad": {
    "run": {
      "filename": "delivery_guarantee_demo.py",
      "initialCode": "def evaluate_delivery_mode(mode):\n    if mode == 'AT_MOST_ONCE':\n        return {'data_loss_possible': True, 'duplicates_possible': False}\n    if mode == 'AT_LEAST_ONCE':\n        return {'data_loss_possible': False, 'duplicates_possible': True}\n    return {'data_loss_possible': False, 'duplicates_possible': False, 'requires_idempotency_store': True}\n\n\nprint('At-Least-Once:', evaluate_delivery_mode('AT_LEAST_ONCE'))\nprint('Exactly-Once:', evaluate_delivery_mode('EXACTLY_ONCE'))",
      "expectedOutput": "At-Least-Once: {'data_loss_possible': False, 'duplicates_possible': True}\nExactly-Once: {'data_loss_possible': False, 'duplicates_possible': False, 'requires_idempotency_store': True}"
    }
  },
  "dist-d13-b2-transactional-outbox-pattern": {
    "run": {
      "filename": "outbox_demo.py",
      "initialCode": "class Database:\n    def __init__(self):\n        self.tables = {'orders': [], 'outbox_events': []}\n\n    def transaction(self, writes):\n        # Work on a copy; only swap it in if every write succeeds (all or nothing)\n        staged = {name: rows[:] for name, rows in self.tables.items()}\n        for table, row in writes:\n            staged[table].append(row)  # an unknown table raises KeyError\n        self.tables = staged\n\n\ndb = Database()\ndb.transaction([\n    ('orders', {'id': 'ord_101', 'amount': 100.00}),\n    ('outbox_events', {'id': 'evt_101', 'payload': {'order_id': 'ord_101'}, 'status': 'PENDING'}),\n])\ntry:\n    db.transaction([('orders', {'id': 'ord_102', 'amount': 50.00}), ('outbx_events', {'id': 'evt_102'})])\nexcept KeyError:\n    print('Second transaction failed: nothing from it was saved')\nprint('Orders:', [o['id'] for o in db.tables['orders']])\nprint('Pending events to publish:', [e['id'] for e in db.tables['outbox_events'] if e['status'] == 'PENDING'])",
      "expectedOutput": "Second transaction failed: nothing from it was saved\nOrders: ['ord_101']\nPending events to publish: ['evt_101']"
    },
    "anatomy": {
      "codeSnippet": "BEGIN TRANSACTION;\n  INSERT INTO orders (id, user_id, amount) VALUES ('ord_101', 'usr_5', 100.00);\n  INSERT INTO outbox_events (id, aggregate_type, payload, status)\n  VALUES ('evt_101', 'ORDER', '{\"order_id\": \"ord_101\"}', 'PENDING');\nCOMMIT; -- Atomically commits business data AND event message together!",
      "lineNotes": {
        "2": "Inserts business record.",
        "3": "Inserts event record inside same ACID transaction.",
        "5": "Zero chance of publishing event if DB insert rolls back."
      }
    }
  },
  "dist-d13-b3-idempotent-producer-kafka-seq": {
    "run": {
      "filename": "kafka_pid_demo.py",
      "initialCode": "def evaluate_broker_deduplication(producer_id, seq_number, last_seen_seq):\n    if seq_number <= last_seen_seq:\n        return {'duplicate': True, 'action': 'DROP_DUPLICATE_SEND_ACK_TO_PRODUCER'}\n    return {'duplicate': False, 'action': 'APPEND_TO_LOG'}\n\n\nprint('Sequence 5 after Sequence 4:', evaluate_broker_deduplication('pid_1', 5, 4)['action'])\nprint('Duplicate Retry Sequence 5:', evaluate_broker_deduplication('pid_1', 5, 5)['action'])",
      "expectedOutput": "Sequence 5 after Sequence 4: APPEND_TO_LOG\nDuplicate Retry Sequence 5: DROP_DUPLICATE_SEND_ACK_TO_PRODUCER"
    }
  },
  "dist-d14-b1-poison-pill-hazard": {
    "run": {
      "filename": "dlq_route_demo.py",
      "initialCode": "def evaluate_message_action(retry_count, max_retries=3):\n    if retry_count >= max_retries:\n        return 'ROUTE_TO_DLQ_AND_ADVANCE_OFFSET'\n    return f'RETRY_WITH_BACKOFF (Attempt {retry_count + 1} of {max_retries})'\n\n\nprint('Retry 1 of 3:', evaluate_message_action(1, 3))\nprint('Retry 3 of 3:', evaluate_message_action(3, 3))",
      "expectedOutput": "Retry 1 of 3: RETRY_WITH_BACKOFF (Attempt 2 of 3)\nRetry 3 of 3: ROUTE_TO_DLQ_AND_ADVANCE_OFFSET"
    },
    "diff": {
      "brokenCode": "# ❌ NAIVE RETRY (Infinite Crash Loop):\n1. Consumer reads malformed message #42 -> json.loads() crashes with JSONDecodeError\n2. Consumer restarts -> re-reads offset #42 -> CRASHES AGAIN\n3. Entire queue processing is blocked for all other 100,000 customers!",
      "fixedCode": "# ✅ DEAD LETTER QUEUE (DLQ) ISOLATION:\n1. Consumer tries parsing message #42 -> Fails (Retry 1)\n2. After 3 failed attempts, route message #42 into 'orders.DLQ' topic\n3. Commit offset #42 and immediately proceed to message #43! (Zero downtime)"
    }
  },
  "dist-d14-b2-dlq-redrive-reprocessing": {
    "run": {
      "filename": "dlq_redrive_demo.py",
      "initialCode": "def redrive_dlq(dlq_messages, target_topic):\n    return [\n        {'topic': target_topic, 'payload': m['payload'], 'redrive_count': m.get('redrive_count', 0) + 1, 'status': 'RE_INJECTED_TO_MAIN_PIPELINE'}\n        for m in dlq_messages\n    ]\n\n\nquarantined = [{'payload': {'order_id': 99}, 'redrive_count': 0}]\nprint(redrive_dlq(quarantined, 'orders.v1'))",
      "expectedOutput": "[{'topic': 'orders.v1', 'payload': {'order_id': 99}, 'redrive_count': 1, 'status': 'RE_INJECTED_TO_MAIN_PIPELINE'}]"
    }
  },
  "dist-d14-b3-dlq-header-metadata-enrichment": {
    "run": {
      "filename": "dlq_enrich_demo.py",
      "initialCode": "from datetime import datetime, timezone\n\n\ndef enrich_dlq_message(msg, error, failed_at, pod_name='order-worker-7f9'):\n    return {\n        'original_payload': msg,\n        'dlq_headers': {\n            'x-death-reason': str(error),\n            'x-death-pod': pod_name,\n            'x-death-time': failed_at.isoformat(),\n        },\n    }\n\n\nfailed_at = datetime(2026, 8, 24, 17, 28, tzinfo=timezone.utc)\nprint(enrich_dlq_message({'id': 'ord_1'}, TimeoutError('DB_TIMEOUT'), failed_at))",
      "expectedOutput": "{'original_payload': {'id': 'ord_1'}, 'dlq_headers': {'x-death-reason': 'DB_TIMEOUT', 'x-death-pod': 'order-worker-7f9', 'x-death-time': '2026-08-24T17:28:00+00:00'}}"
    }
  },
  "dist-d15-b1-event-engine-architecture": {
    "run": {
      "filename": "event_engine_sim.py",
      "initialCode": "def run_event_engine(event):\n    return {\n        'event_key': event['idempotency_key'],\n        'idempotency_status': 'DEDUPLICATION_PASS',\n        'saga_executed': True,\n        'compensations_triggered_on_failure': True,\n        'status': 'EVENT_TRANSACTION_ENGINE_HEALTHY',\n    }\n\n\nprint('Engine Status:', run_event_engine({'idempotency_key': 'tx_9981'})['status'])",
      "expectedOutput": "Engine Status: EVENT_TRANSACTION_ENGINE_HEALTHY"
    }
  },
  "dist-d15-b2-throughput-backpressure-metrics": {
    "run": {
      "filename": "engine_sla_demo.py",
      "initialCode": "def audit_engine_performance(events_per_sec, p99_ms, dlq_rate):\n    passed = events_per_sec >= 50_000 and p99_ms <= 25 and dlq_rate < 0.1\n    return {\n        'events_per_sec': events_per_sec,\n        'p99_ms': p99_ms,\n        'passed': passed,\n        'grade': 'ENTERPRISE_EVENT_ENGINE_CERTIFIED' if passed else 'SLA_FAILED',\n    }\n\n\nprint(audit_engine_performance(65_000, 18, 0.02))",
      "expectedOutput": "{'events_per_sec': 65000, 'p99_ms': 18, 'passed': True, 'grade': 'ENTERPRISE_EVENT_ENGINE_CERTIFIED'}"
    }
  },
  "dist-d15-b3-milestone2-dist-cert": {
    "run": {
      "filename": "milestone2_dist_cert.py",
      "initialCode": "print('⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys [VERIFIED 100%]"
    }
  },
  "dist-d16-b1-ntp-drift-and-spanner-true-time": {
    "run": {
      "filename": "truetime_sim_demo.py",
      "initialCode": "def evaluate_true_time_wait(earliest_ms, latest_ms):\n    uncertainty = latest_ms - earliest_ms\n    return {'uncertainty_window_ms': uncertainty, 'wait_before_commit': f'{uncertainty} ms (Guarantees strict global ordering)'}\n\n\nprint(evaluate_true_time_wait(1000, 1007))",
      "expectedOutput": "{'uncertainty_window_ms': 7, 'wait_before_commit': '7 ms (Guarantees strict global ordering)'}"
    }
  },
  "dist-d16-b2-lamport-logical-timestamps": {
    "run": {
      "filename": "lamport_demo.py",
      "initialCode": "def process_lamport_event(local_time, incoming_time=0):\n    return max(local_time, incoming_time) + 1\n\n\nn1 = process_lamport_event(0)      # local event on N1 -> 1\nn2 = process_lamport_event(0, n1)  # N2 receives N1's message -> max(0, 1) + 1 = 2\nprint('N1 Clock:', n1)\nprint('N2 Clock after receive:', n2)",
      "expectedOutput": "N1 Clock: 1\nN2 Clock after receive: 2"
    },
    "anatomy": {
      "codeSnippet": "def on_message_received(local_clock, message_clock):\n    local_clock = max(local_clock, message_clock) + 1\n    return local_clock",
      "lineNotes": {
        "2": "Guarantees causal happens-before relationship: received events always get a strictly higher clock value than sender."
      }
    }
  },
  "dist-d16-b3-vector-clocks-concurrent-conflicts": {
    "run": {
      "filename": "vector_clock_calc.py",
      "initialCode": "def evaluate_vector_causality(a, b):\n    nodes = set(a) | set(b)\n    a_ahead = any(a.get(n, 0) > b.get(n, 0) for n in nodes)\n    b_ahead = any(b.get(n, 0) > a.get(n, 0) for n in nodes)\n    if a_ahead and b_ahead:\n        return 'CONCURRENT_CONFLICT_REQUIRES_MERGE'\n    if b_ahead:\n        return 'A_CAUSED_B (A happened before B)'\n    if a_ahead:\n        return 'B_CAUSED_A (B happened before A)'\n    return 'EQUAL'\n\n\nprint('A [N1:1, N2:0] vs B [N1:1, N2:1]:', evaluate_vector_causality({'N1': 1, 'N2': 0}, {'N1': 1, 'N2': 1}))\nprint('A [N1:2, N2:0] vs B [N1:1, N2:1]:', evaluate_vector_causality({'N1': 2, 'N2': 0}, {'N1': 1, 'N2': 1}))",
      "expectedOutput": "A [N1:1, N2:0] vs B [N1:1, N2:1]: A_CAUSED_B (A happened before B)\nA [N1:2, N2:0] vs B [N1:1, N2:1]: CONCURRENT_CONFLICT_REQUIRES_MERGE"
    }
  },
  "dist-d17-b1-crdt-mathematical-properties": {
    "run": {
      "filename": "g_counter_demo.py",
      "initialCode": "class GCounter:\n    def __init__(self, node_id):\n        self.node_id = node_id\n        self.state = {}\n\n    def inc(self, v=1):\n        self.state[self.node_id] = self.state.get(self.node_id, 0) + v\n\n    def value(self):\n        return sum(self.state.values())\n\n    def merge(self, other):\n        for node in set(self.state) | set(other.state):\n            self.state[node] = max(self.state.get(node, 0), other.state.get(node, 0))\n\n\na, b = GCounter('A'), GCounter('B')\na.inc(5)\nb.inc(3)\na.merge(b)\nb.merge(a)\nprint('Node A Value:', a.value())\nprint('Node B Value:', b.value())",
      "expectedOutput": "Node A Value: 8\nNode B Value: 8"
    }
  },
  "dist-d17-b2-pn-counter-increments-decrements": {
    "run": {
      "filename": "pn_counter_demo.py",
      "initialCode": "def evaluate_pn_convergence(p_a, n_a, p_b, n_b):\n    merged_p = max(p_a, p_b)\n    merged_n = max(n_a, n_b)\n    return f'Net Converged Value: {merged_p - merged_n}'\n\n\nprint(evaluate_pn_convergence(10, 2, 5, 4))",
      "expectedOutput": "Net Converged Value: 6"
    },
    "anatomy": {
      "codeSnippet": "self.p[node] = max(self.p.get(node, 0), other.p.get(node, 0))\nself.n[node] = max(self.n.get(node, 0), other.n.get(node, 0))\nfinal_value = sum(self.p.values()) - sum(self.n.values())",
      "lineNotes": {
        "1": "Merges positive increment lattice.",
        "2": "Merges negative decrement lattice.",
        "3": "Calculates net balance."
      }
    }
  },
  "dist-d17-b3-lww-element-set-crdt": {
    "run": {
      "filename": "lww_set_demo.py",
      "initialCode": "def is_element_in_set(add_ts, remove_ts):\n    return 'ITEM_IS_ACTIVE_MEMBER' if add_ts > remove_ts else 'ITEM_IS_DELETED_TOMBSTONE'\n\n\nprint('Added at 100, Removed at 90:', is_element_in_set(100, 90))\nprint('Added at 100, Removed at 110:', is_element_in_set(100, 110))",
      "expectedOutput": "Added at 100, Removed at 90: ITEM_IS_ACTIVE_MEMBER\nAdded at 100, Removed at 110: ITEM_IS_DELETED_TOMBSTONE"
    }
  },
  "dist-d18-b1-sharding-architectures-comparison": {
    "run": {
      "filename": "sharding_eval_demo.py",
      "initialCode": "def select_sharding_strategy(has_vip_tenants, query_type):\n    if has_vip_tenants:\n        return 'DIRECTORY_BASED_SHARDING (Isolate enterprise VIPs to dedicated shards)'\n    if query_type == 'RANGE_QUERIES':\n        return 'RANGE_SHARDING (Optimize range scans)'\n    return 'HASH_SHARDING (Uniform random key distribution)'\n\n\nprint('Multi-Tenant B2B SaaS:', select_sharding_strategy(True, 'SINGLE_KEY'))\nprint('High-Volume Sensor Data:', select_sharding_strategy(False, 'SINGLE_KEY'))",
      "expectedOutput": "Multi-Tenant B2B SaaS: DIRECTORY_BASED_SHARDING (Isolate enterprise VIPs to dedicated shards)\nHigh-Volume Sensor Data: HASH_SHARDING (Uniform random key distribution)"
    }
  },
  "dist-d18-b2-scatter-gather-query-penalty": {
    "run": {
      "filename": "scatter_gather_demo.py",
      "initialCode": "def evaluate_query_latency(has_shard_key, total_shards=16):\n    if has_shard_key:\n        return {'mode': 'TARGETED_SINGLE_SHARD_QUERY', 'shards_contacted': 1, 'latency': '2 ms'}\n    return {'mode': 'SCATTER_GATHER_CROSS_SHARD_QUERY', 'shards_contacted': total_shards, 'latency': '65 ms'}\n\n\nprint('Query with Shard Key:', evaluate_query_latency(True))\nprint('Query without Shard Key:', evaluate_query_latency(False))",
      "expectedOutput": "Query with Shard Key: {'mode': 'TARGETED_SINGLE_SHARD_QUERY', 'shards_contacted': 1, 'latency': '2 ms'}\nQuery without Shard Key: {'mode': 'SCATTER_GATHER_CROSS_SHARD_QUERY', 'shards_contacted': 16, 'latency': '65 ms'}"
    }
  },
  "dist-d18-b3-resharding-zero-downtime-migration": {
    "run": {
      "filename": "reshard_flow_demo.py",
      "initialCode": "RESHARDING_STEPS = [\n    '1. Deploy dual-writing middleware (Write to Old & New Shards)',\n    '2. Run background CDC backfill for historical data',\n    '3. Enable shadow reads to verify 100% data consistency parity',\n    '4. Flip read traffic to New Shards and drop Old Shards (Zero Downtime!)',\n]\n\nprint('\\n'.join(RESHARDING_STEPS))",
      "expectedOutput": "1. Deploy dual-writing middleware (Write to Old & New Shards)\n2. Run background CDC backfill for historical data\n3. Enable shadow reads to verify 100% data consistency parity\n4. Flip read traffic to New Shards and drop Old Shards (Zero Downtime!)"
    }
  },
  "dist-d19-b1-replication-lag-glitches": {
    "run": {
      "filename": "read_your_writes_demo.py",
      "initialCode": "def route_read_query(ms_since_write, threshold_ms=5000):\n    if ms_since_write < threshold_ms:\n        return 'ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)'\n    return 'ROUTE_TO_ASYNC_READ_REPLICA (Offload primary database load)'\n\n\nprint('500ms after Write:', route_read_query(500))\nprint('10s after Write:', route_read_query(10_000))",
      "expectedOutput": "500ms after Write: ROUTE_TO_PRIMARY_DB (Read-Your-Own-Writes Consistency Guard)\n10s after Write: ROUTE_TO_ASYNC_READ_REPLICA (Offload primary database load)"
    },
    "diff": {
      "brokenCode": "# ❌ NAIVE REPLICA ROUTING (Stale Glitch):\n1. User posts comment -> Writes to Primary DB\n2. User refreshes page -> App queries Read Replica (Lag: 1.5s)\n3. Replica hasn't received the WAL log -> Page shows ZERO comments -> User panics & posts a duplicate!",
      "fixedCode": "# ✅ READ-YOUR-OWN-WRITES SESSION ROUTING:\n1. User posts comment -> Writes to Primary DB & sets session['last_write'] = time.time()\n2. User refreshes -> App checks time.time() - session['last_write'] < 5\n3. Routes the read to the PRIMARY DB -> Shows the new comment straight away!"
    }
  },
  "dist-d19-b2-monotonic-reads-guarantee": {
    "run": {
      "filename": "monotonic_reads_demo.py",
      "initialCode": "def evaluate_monotonic_read(current_version, previous_read_version):\n    if current_version < previous_read_version:\n        return {'valid': False, 'error': 'MONOTONIC_READ_VIOLATION_TIME_TRAVELED_BACKWARD'}\n    return {'valid': True, 'version': current_version}\n\n\nprint('Read version 5 after version 4:', evaluate_monotonic_read(5, 4)['valid'])\nprint('Read version 3 after version 4:', evaluate_monotonic_read(3, 4)['error'])",
      "expectedOutput": "Read version 5 after version 4: True\nRead version 3 after version 4: MONOTONIC_READ_VIOLATION_TIME_TRAVELED_BACKWARD"
    }
  },
  "dist-d19-b3-consistent-prefix-reads": {
    "run": {
      "filename": "consistent_prefix_demo.py",
      "initialCode": "def evaluate_causal_prefix(has_question, has_answer):\n    if has_answer and not has_question:\n        return 'VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION'\n    return 'CONSISTENT_PREFIX_ORDERING_PRESERVED'\n\n\nprint('Question and Answer visible:', evaluate_causal_prefix(True, True))\nprint('Answer visible without Question:', evaluate_causal_prefix(False, True))",
      "expectedOutput": "Question and Answer visible: CONSISTENT_PREFIX_ORDERING_PRESERVED\nAnswer visible without Question: VIOLATION_ANSWER_APPEARED_BEFORE_QUESTION"
    }
  },
  "dist-d20-b1-circuit-breaker-three-states": {
    "run": {
      "filename": "circuit_state_demo.py",
      "initialCode": "def evaluate_circuit_state(failure_rate_percent, seconds_in_open, open_timeout_sec=10):\n    if seconds_in_open >= open_timeout_sec:\n        return 'HALF_OPEN_SENDING_PROBE_REQUESTS'\n    if failure_rate_percent >= 50:\n        return 'OPEN_FAIL_FAST_HTTP_503'\n    return 'CLOSED_NORMAL_TRAFFIC'\n\n\nprint('Failure Rate 60%:', evaluate_circuit_state(60, 2))\nprint('12 seconds after trip:', evaluate_circuit_state(60, 12))",
      "expectedOutput": "Failure Rate 60%: OPEN_FAIL_FAST_HTTP_503\n12 seconds after trip: HALF_OPEN_SENDING_PROBE_REQUESTS"
    }
  },
  "dist-d20-b2-bulkhead-isolation-pools": {
    "run": {
      "filename": "bulkhead_demo.py",
      "initialCode": "class Bulkhead:\n    def __init__(self, max_concurrent):\n        self.max = max_concurrent\n        self.active = 0\n\n    def try_acquire(self):\n        if self.active >= self.max:\n            return False\n        self.active += 1\n        return True\n\n    def release(self):\n        self.active = max(0, self.active - 1)\n\n\nrecommendations = Bulkhead(2)\nprint('Request 1:', recommendations.try_acquire())\nprint('Request 2:', recommendations.try_acquire())\nprint('Request 3 (Exceeds pool):', recommendations.try_acquire())",
      "expectedOutput": "Request 1: True\nRequest 2: True\nRequest 3 (Exceeds pool): False"
    }
  },
  "dist-d20-b3-graceful-fallback-degradation": {
    "run": {
      "filename": "fallback_demo.py",
      "initialCode": "def get_product_recommendations(is_circuit_open):\n    if is_circuit_open:\n        return {'source': 'STATIC_FALLBACK_CACHE', 'items': ['Popular Item #1', 'Popular Item #2']}\n    return {'source': 'LIVE_AI_PERSONALIZED', 'items': ['Personalized Item #9']}\n\n\nprint(get_product_recommendations(True))",
      "expectedOutput": "{'source': 'STATIC_FALLBACK_CACHE', 'items': ['Popular Item #1', 'Popular Item #2']}"
    }
  },
  "dist-d21-b1-gateway-perimeter-architecture": {
    "run": {
      "filename": "gateway_perimeter_sim.py",
      "initialCode": "def run_gateway_perimeter(req):\n    return {\n        'client_id': req['client_id'],\n        'rate_limiter_check': 'PASSED_UNDER_QUOTA',\n        'bulkhead_slot': 'ACQUIRED (Slot 12 of 40)',\n        'circuit_state': 'CLOSED_HEALTHY',\n        'response_status': 200,\n        'gateway_status': 'GATEWAY_PERIMETER_ONLINE',\n    }\n\n\nres = run_gateway_perimeter({'client_id': 'cust_101'})\nprint('Gateway Status:', res['gateway_status'])\nprint('Circuit State:', res['circuit_state'])",
      "expectedOutput": "Gateway Status: GATEWAY_PERIMETER_ONLINE\nCircuit State: CLOSED_HEALTHY"
    }
  },
  "dist-d21-b2-gateway-sla-benchmarks": {
    "run": {
      "filename": "gateway_sla_audit.py",
      "initialCode": "def audit_gateway_overhead(added_latency_ms, rps):\n    compliant = added_latency_ms <= 3.0 and rps >= 100_000\n    return {\n        'added_latency_ms': added_latency_ms,\n        'throughput_rps': rps,\n        'compliant': compliant,\n        'grade': 'ENTERPRISE_GATEWAY_SLA_CERTIFIED' if compliant else 'FAILED_GATEWAY_SLA',\n    }\n\n\nprint(audit_gateway_overhead(1.8, 120_000))",
      "expectedOutput": "{'added_latency_ms': 1.8, 'throughput_rps': 120000, 'compliant': True, 'grade': 'ENTERPRISE_GATEWAY_SLA_CERTIFIED'}"
    }
  },
  "dist-d21-b3-milestone3-dist-cert": {
    "run": {
      "filename": "milestone3_dist_cert.py",
      "initialCode": "print('⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway [VERIFIED 100%]"
    }
  },
  "dist-d22-b1-epidemic-gossip-dissemination": {
    "run": {
      "filename": "gossip_rounds_demo.py",
      "initialCode": "import math\n\n\ndef calculate_gossip_rounds(cluster_size, fanout=3):\n    rounds = math.ceil(math.log(cluster_size) / math.log(fanout))\n    return {'cluster_size': cluster_size, 'fanout_peers_per_round': fanout, 'rounds_to_full_convergence': rounds}\n\n\nprint('1,000 nodes (Fanout 3):', calculate_gossip_rounds(1000, 3))\nprint('100,000 nodes (Fanout 3):', calculate_gossip_rounds(100_000, 3))",
      "expectedOutput": "1,000 nodes (Fanout 3): {'cluster_size': 1000, 'fanout_peers_per_round': 3, 'rounds_to_full_convergence': 7}\n100,000 nodes (Fanout 3): {'cluster_size': 100000, 'fanout_peers_per_round': 3, 'rounds_to_full_convergence': 11}"
    }
  },
  "dist-d22-b2-swim-failure-detector": {
    "run": {
      "filename": "swim_sim_demo.py",
      "initialCode": "def evaluate_swim_state(direct_success, indirect_success):\n    if direct_success:\n        return 'NODE_ALIVE_DIRECT'\n    if indirect_success:\n        return 'NODE_ALIVE_INDIRECT (Local packet drop on probe node)'\n    return 'MARK_NODE_SUSPECT_WITH_GRACE_PERIOD'\n\n\nprint('Direct probe success:', evaluate_swim_state(True, False))\nprint('Direct failed, Peer probe succeeded:', evaluate_swim_state(False, True))\nprint('All probes failed:', evaluate_swim_state(False, False))",
      "expectedOutput": "Direct probe success: NODE_ALIVE_DIRECT\nDirect failed, Peer probe succeeded: NODE_ALIVE_INDIRECT (Local packet drop on probe node)\nAll probes failed: MARK_NODE_SUSPECT_WITH_GRACE_PERIOD"
    }
  },
  "dist-d22-b3-incarnation-numbers-suspect-refutation": {
    "run": {
      "filename": "incarnation_demo.py",
      "initialCode": "def resolve_gossip_conflict(rumor, node_incarnation):\n    if node_incarnation > rumor['incarnation']:\n        return {'state': 'ALIVE', 'incarnation': node_incarnation, 'note': 'HIGHER_INCARNATION_REFUTES_SUSPECT_RUMOR'}\n    return {'state': rumor['state'], 'incarnation': rumor['incarnation']}\n\n\nprint(resolve_gossip_conflict({'state': 'SUSPECT', 'incarnation': 1}, 2))",
      "expectedOutput": "{'state': 'ALIVE', 'incarnation': 2, 'note': 'HIGHER_INCARNATION_REFUTES_SUSPECT_RUMOR'}"
    }
  },
  "dist-d23-b1-load-balancing-algorithms-taxonomy": {
    "run": {
      "filename": "lb_selection_demo.py",
      "initialCode": "def select_lb_algorithm(traffic_type, is_heterogeneous):\n    if is_heterogeneous:\n        return 'WEIGHTED_ROUND_ROBIN (Route by server CPU/RAM capacity)'\n    if traffic_type == 'LONG_LIVED_WEBSOCKETS':\n        return 'LEAST_CONNECTIONS (Route to node with lowest active socket count)'\n    return 'ROUND_ROBIN (Standard uniform rotation)'\n\n\nprint('Real-Time WebSocket Chat:', select_lb_algorithm('LONG_LIVED_WEBSOCKETS', False))\nprint('Mixed Cloud Server Pool:', select_lb_algorithm('STANDARD_HTTP', True))",
      "expectedOutput": "Real-Time WebSocket Chat: LEAST_CONNECTIONS (Route to node with lowest active socket count)\nMixed Cloud Server Pool: WEIGHTED_ROUND_ROBIN (Route by server CPU/RAM capacity)"
    }
  },
  "dist-d23-b2-smooth-weighted-round-robin": {
    "run": {
      "filename": "smooth_wrr_demo.py",
      "initialCode": "def run_smooth_wrr_sequence(servers, requests=4):\n    total_weight = sum(s['weight'] for s in servers)\n    sequence = []\n    for _ in range(requests):\n        for s in servers:\n            s['current'] += s['weight']\n        best = max(servers, key=lambda s: s['current'])\n        best['current'] -= total_weight\n        sequence.append(best['id'])\n    return sequence\n\n\npool = [{'id': 'A', 'weight': 3, 'current': 0}, {'id': 'B', 'weight': 1, 'current': 0}]\nprint('Interleaved Sequence:', ' -> '.join(run_smooth_wrr_sequence(pool, 4)))",
      "expectedOutput": "Interleaved Sequence: A -> A -> B -> A"
    }
  },
  "dist-d23-b3-layer4-vs-layer7-routing": {
    "run": {
      "filename": "l4_l7_demo.py",
      "initialCode": "def evaluate_balancer_layer(needs_url_path_routing, needs_max_line_rate):\n    if needs_url_path_routing:\n        return 'LAYER_7_APPLICATION_LOAD_BALANCER (ALB/Envoy: Inspects HTTP Headers/Paths)'\n    if needs_max_line_rate:\n        return 'LAYER_4_NETWORK_LOAD_BALANCER (NLB: High Throughput TCP/UDP Line Rate)'\n    return 'STANDARD_LOAD_BALANCER'\n\n\nprint(evaluate_balancer_layer(True, False))\nprint(evaluate_balancer_layer(False, True))",
      "expectedOutput": "LAYER_7_APPLICATION_LOAD_BALANCER (ALB/Envoy: Inspects HTTP Headers/Paths)\nLAYER_4_NETWORK_LOAD_BALANCER (NLB: High Throughput TCP/UDP Line Rate)"
    }
  },
  "dist-d24-b1-client-vs-server-side-discovery": {
    "run": {
      "filename": "discovery_mode_demo.py",
      "initialCode": "def evaluate_discovery_type(topology):\n    if topology == 'CLIENT_SIDE':\n        return {'proxy_hops': 0, 'client_smart_routing': True, 'requires_language_sdk': True}\n    return {'proxy_hops': 1, 'client_smart_routing': False, 'requires_language_sdk': False}\n\n\nprint('Client-Side (Eureka):', evaluate_discovery_type('CLIENT_SIDE'))\nprint('Server-Side (Kubernetes):', evaluate_discovery_type('SERVER_SIDE'))",
      "expectedOutput": "Client-Side (Eureka): {'proxy_hops': 0, 'client_smart_routing': True, 'requires_language_sdk': True}\nServer-Side (Kubernetes): {'proxy_hops': 1, 'client_smart_routing': False, 'requires_language_sdk': False}"
    }
  },
  "dist-d24-b2-heartbeat-leases-ttl-eviction": {
    "run": {
      "filename": "lease_eviction_demo.py",
      "initialCode": "def evaluate_instance_health(ms_since_heartbeat, ttl_ms=10_000):\n    if ms_since_heartbeat > ttl_ms:\n        return {'status': 'DEAD', 'action': 'EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS'}\n    return {'status': 'HEALTHY_ACTIVE', 'action': 'SERVE_TRAFFIC'}\n\n\nprint('Active Node:', evaluate_instance_health(2_000)['status'])\nprint('Dead Node:', evaluate_instance_health(15_000)['action'])",
      "expectedOutput": "Active Node: HEALTHY_ACTIVE\nDead Node: EVICT_FROM_REGISTRY_AND_NOTIFY_LISTENERS"
    }
  },
  "dist-d24-b3-health-checks-liveness-readiness": {
    "run": {
      "filename": "probe_actions_demo.py",
      "initialCode": "def evaluate_probe_failure(probe_type):\n    if probe_type == 'LIVENESS_FAILED':\n        return 'RESTART_CONTAINER_POD'\n    if probe_type == 'READINESS_FAILED':\n        return 'REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING'\n    return 'CONTAINER_HEALTHY'\n\n\nprint('Liveness Failure:', evaluate_probe_failure('LIVENESS_FAILED'))\nprint('Readiness Failure:', evaluate_probe_failure('READINESS_FAILED'))",
      "expectedOutput": "Liveness Failure: RESTART_CONTAINER_POD\nReadiness Failure: REMOVE_FROM_LOAD_BALANCER_TRAFFIC_KEEP_CONTAINER_RUNNING"
    }
  },
  "dist-d25-b1-bff-pattern-mobile-vs-web": {
    "run": {
      "filename": "bff_aggregation_demo.py",
      "initialCode": "def mobile_bff_product_endpoint(product_id, get_product, get_reviews, get_stock):\n    # The BFF calls 3 internal services (inside the datacenter) and stitches one small reply\n    product = get_product(product_id)\n    reviews = get_reviews(product_id)\n    stock = get_stock(product_id)\n    return {\n        'id': product['id'],\n        'title': product['name'],\n        'price': product['price'],\n        'rating': reviews['rating'],\n        'available': stock['in_stock'],\n    }\n\n\nprint(mobile_bff_product_endpoint(\n    'prod_99',\n    get_product=lambda pid: {'id': pid, 'name': 'Wireless Headphones', 'price': 99.99},\n    get_reviews=lambda pid: {'rating': 4.8, 'total_count': 1420},\n    get_stock=lambda pid: {'in_stock': True},\n))",
      "expectedOutput": "{'id': 'prod_99', 'title': 'Wireless Headphones', 'price': 99.99, 'rating': 4.8, 'available': True}"
    }
  },
  "dist-d25-b2-api-gateway-cross-cutting-concerns": {
    "run": {
      "filename": "gateway_pipeline_demo.py",
      "initialCode": "GATEWAY_EDGE_PIPELINE = [\n    '1. WAF: Inspect SQLi / XSS payloads',\n    '2. TLS Offloading & HTTP/2 termination',\n    '3. JWT Authentication & Scope Verification',\n    '4. Rate Limiting Check',\n    '5. Forward to Internal Microservice',\n]\n\nprint('\\n'.join(GATEWAY_EDGE_PIPELINE))",
      "expectedOutput": "1. WAF: Inspect SQLi / XSS payloads\n2. TLS Offloading & HTTP/2 termination\n3. JWT Authentication & Scope Verification\n4. Rate Limiting Check\n5. Forward to Internal Microservice"
    }
  },
  "dist-d25-b3-graphql-federation-gateways": {
    "run": {
      "filename": "graphql_federation_demo.py",
      "initialCode": "def explain_federation_entity():\n    return ('Apollo Router queries Users Subgraph and Orders Subgraph concurrently, '\n            'stitching the unified GraphQL response at the edge.')\n\n\nprint(explain_federation_entity())",
      "expectedOutput": "Apollo Router queries Users Subgraph and Orders Subgraph concurrently, stitching the unified GraphQL response at the edge."
    }
  },
  "dist-d26-b1-w3c-tracecontext-format": {
    "run": {
      "filename": "traceparent_parser_demo.py",
      "initialCode": "def parse_traceparent(header):\n    version, trace_id, parent_span_id, flags = header.split('-')\n    return {'version': version, 'trace_id': trace_id, 'parent_span_id': parent_span_id, 'is_sampled': flags == '01'}\n\n\nprint(parse_traceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'))",
      "expectedOutput": "{'version': '00', 'trace_id': '4bf92f3577b34da6a3ce929d0e0e4736', 'parent_span_id': '00f067aa0ba902b7', 'is_sampled': True}"
    },
    "anatomy": {
      "codeSnippet": "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n#            │  └──────────────┬───────────────┘ └───────┬──────┘ └─┬┘\n#         Version        32-Hex Trace ID          16-Hex Span ID  Sampled Flag",
      "lineNotes": {
        "1": "Global standard adopted across OpenTelemetry, Envoy, AWS X-Ray, and Datadog."
      }
    }
  },
  "dist-d26-b2-opentelemetry-span-lifecycle": {
    "run": {
      "filename": "otel_span_demo.py",
      "initialCode": "import secrets\n\n\ndef create_otel_span(name, trace_id, parent_span_id):\n    return {\n        'name': name,\n        'trace_id': trace_id,\n        'span_id': secrets.token_hex(8),  # 16 random hex characters\n        'parent_span_id': parent_span_id,\n        'attributes': {'service.name': 'order-service', 'http.method': 'POST'},\n    }\n\n\nspan = create_otel_span('process_payment', 'trace_9981', 'span_root')\nprint('Span Name:', span['name'])\nprint('Parent Span ID:', span['parent_span_id'])\nprint('Span ID length:', len(span['span_id']))",
      "expectedOutput": "Span Name: process_payment\nParent Span ID: span_root\nSpan ID length: 16"
    }
  },
  "dist-d26-b3-tail-based-sampling-cost-control": {
    "run": {
      "filename": "tail_sampling_demo.py",
      "initialCode": "def evaluate_tail_sampling(http_status, duration_ms):\n    if http_status >= 500:\n        return 'RETAIN_TRACE_100_PERCENT (Error occurred!)'\n    if duration_ms > 1000:\n        return 'RETAIN_TRACE_100_PERCENT (Slow P99 anomaly!)'\n    return 'DROP_FAST_HEALTHY_TRACE (Save 95% storage cost)'\n\n\nprint('HTTP 500 Internal Error (15ms):', evaluate_tail_sampling(500, 15))\nprint('HTTP 200 Fast Success (5ms):', evaluate_tail_sampling(200, 5))",
      "expectedOutput": "HTTP 500 Internal Error (15ms): RETAIN_TRACE_100_PERCENT (Error occurred!)\nHTTP 200 Fast Success (5ms): DROP_FAST_HEALTHY_TRACE (Save 95% storage cost)"
    }
  },
  "dist-d27-b1-linearizability-strict-ordering": {
    "run": {
      "filename": "linearizable_demo.py",
      "initialCode": "def evaluate_linearizability(write_completed_at, read_started_at, read_observed_write):\n    if read_started_at > write_completed_at and not read_observed_write:\n        return 'VIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED'\n    return 'LINEARIZABLE_CONSISTENCY_SATISFIED'\n\n\nprint(evaluate_linearizability(100, 105, True))\nprint(evaluate_linearizability(100, 105, False))",
      "expectedOutput": "LINEARIZABLE_CONSISTENCY_SATISFIED\nVIOLATION: NON_LINEARIZABLE_STALE_READ_DETECTED"
    }
  },
  "dist-d27-b2-causal-consistency-session-models": {
    "run": {
      "filename": "causal_model_demo.py",
      "initialCode": "def evaluate_causal_ordering(is_causally_related, order_preserved):\n    if is_causally_related and not order_preserved:\n        return 'CAUSAL_CONSISTENCY_VIOLATION'\n    return 'CAUSAL_CONSISTENCY_SATISFIED'\n\n\nprint('Causal link preserved:', evaluate_causal_ordering(True, True))\nprint('Causal link inverted:', evaluate_causal_ordering(True, False))",
      "expectedOutput": "Causal link preserved: CAUSAL_CONSISTENCY_SATISFIED\nCausal link inverted: CAUSAL_CONSISTENCY_VIOLATION"
    }
  },
  "dist-d27-b3-eventual-consistency-convergence": {
    "run": {
      "filename": "anti_entropy_demo.py",
      "initialCode": "import hashlib\n\n\ndef merkle_root(rows):\n    return hashlib.sha256(repr(sorted(rows.items())).encode()).hexdigest()\n\n\ndef check_merkle_sync(replica_a, replica_b):\n    if merkle_root(replica_a) == merkle_root(replica_b):\n        return 'REPLICAS_100_PERCENT_SYNCHRONIZED (Zero data transfer needed)'\n    return 'DIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY'\n\n\nprint(check_merkle_sync({'k1': 'a', 'k2': 'b'}, {'k2': 'b', 'k1': 'a'}))\nprint(check_merkle_sync({'k1': 'a', 'k2': 'b'}, {'k1': 'a', 'k2': 'OLD'}))",
      "expectedOutput": "REPLICAS_100_PERCENT_SYNCHRONIZED (Zero data transfer needed)\nDIFFERENCE_DETECTED_SYNC_DIFF_KEYS_ONLY"
    }
  },
  "dist-d28-b1-http-cache-control-headers": {
    "run": {
      "filename": "cdn_cache_eval_demo.py",
      "initialCode": "def evaluate_edge_hit(age_sec, s_max_age_sec=3600, swr_sec=60):\n    if age_sec <= s_max_age_sec:\n        return 'EDGE_CACHE_HIT_FRESH (2ms)'\n    if age_sec <= s_max_age_sec + swr_sec:\n        return 'EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)'\n    return 'EDGE_CACHE_MISS_SYNC_ORIGIN_FETCH (150ms)'\n\n\nprint('Age 100s:', evaluate_edge_hit(100))\nprint('Age 3630s:', evaluate_edge_hit(3630))\nprint('Age 5000s:', evaluate_edge_hit(5000))",
      "expectedOutput": "Age 100s: EDGE_CACHE_HIT_FRESH (2ms)\nAge 3630s: EDGE_CACHE_HIT_STALE_WHILE_REVALIDATING (2ms + Async Origin Fetch)\nAge 5000s: EDGE_CACHE_MISS_SYNC_ORIGIN_FETCH (150ms)"
    },
    "anatomy": {
      "codeSnippet": "Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=60, immutable\n#               │           │             │                    │                      └─ Never revalidate\n#            Public      Browser 60s    CDN Edge 1h    Serve stale + background revalidate 60s",
      "lineNotes": {
        "1": "Optimal recipe for static web bundles, Next.js assets, and product catalog pages."
      }
    }
  },
  "dist-d28-b2-surrogate-key-cache-purges": {
    "run": {
      "filename": "surrogate_purge_demo.py",
      "initialCode": "def purge_by_surrogate_tag(tag, cdn_cache):\n    doomed = [url for url, tags in cdn_cache.items() if tag in tags]\n    for url in doomed:\n        del cdn_cache[url]\n    return f\"Purged {len(doomed)} edge assets matching tag '{tag}' globally in 120ms.\"\n\n\nedge_store = {\n    '/products/101': ['product-101', 'category-electronics'],\n    '/products/102': ['product-102', 'category-electronics'],\n    '/products/201': ['product-201', 'category-clothing'],\n}\nprint(purge_by_surrogate_tag('category-electronics', edge_store))",
      "expectedOutput": "Purged 2 edge assets matching tag 'category-electronics' globally in 120ms."
    }
  },
  "dist-d28-b3-anycast-routing-dns-geo": {
    "run": {
      "filename": "anycast_demo.py",
      "initialCode": "def route_anycast(user_location):\n    pops = {\n        'LONDON': {'pop': 'LHR_EDGE_DATACENTER', 'latency_ms': 4},\n        'NEW_YORK': {'pop': 'JFK_EDGE_DATACENTER', 'latency_ms': 3},\n    }\n    return pops.get(user_location, {'pop': 'GLOBAL_ANYCAST_DEFAULT', 'latency_ms': 15})\n\n\nprint('London User:', route_anycast('LONDON'))\nprint('New York User:', route_anycast('NEW_YORK'))",
      "expectedOutput": "London User: {'pop': 'LHR_EDGE_DATACENTER', 'latency_ms': 4}\nNew York User: {'pop': 'JFK_EDGE_DATACENTER', 'latency_ms': 3}"
    }
  },
  "dist-d29-b1-rpo-rto-disaster-metrics": {
    "run": {
      "filename": "dr_strategy_eval_demo.py",
      "initialCode": "def evaluate_dr_tier(rpo_minutes, rto_minutes):\n    if rpo_minutes == 0 and rto_minutes == 0:\n        return 'MULTI_REGION_ACTIVE_ACTIVE'\n    if rpo_minutes <= 1 and rto_minutes <= 5:\n        return 'ACTIVE_PASSIVE_WARM_STANDBY'\n    if rpo_minutes <= 15 and rto_minutes <= 60:\n        return 'PILOT_LIGHT'\n    return 'BACKUP_AND_RESTORE'\n\n\nprint('Zero Downtime Tier:', evaluate_dr_tier(0, 0))\nprint('1 min RPO, 5 min RTO:', evaluate_dr_tier(1, 5))",
      "expectedOutput": "Zero Downtime Tier: MULTI_REGION_ACTIVE_ACTIVE\n1 min RPO, 5 min RTO: ACTIVE_PASSIVE_WARM_STANDBY"
    }
  },
  "dist-d29-b2-active-active-conflict-resolution": {
    "run": {
      "filename": "cross_region_sim.py",
      "initialCode": "def resolve_cross_region_write(us_east_write, eu_west_write):\n    if us_east_write['timestamp'] > eu_west_write['timestamp']:\n        return {'winner': 'US_EAST', 'data': us_east_write['data'], 'rule': 'LAST_WRITE_WINS'}\n    return {'winner': 'EU_WEST', 'data': eu_west_write['data'], 'rule': 'LAST_WRITE_WINS'}\n\n\nw1 = {'data': 'Status: VIP', 'timestamp': 1700000000500}\nw2 = {'data': 'Status: Regular', 'timestamp': 1700000000200}\nprint(resolve_cross_region_write(w1, w2))",
      "expectedOutput": "{'winner': 'US_EAST', 'data': 'Status: VIP', 'rule': 'LAST_WRITE_WINS'}"
    }
  },
  "dist-d29-b3-chaos-engineering-game-days": {
    "run": {
      "filename": "chaos_game_day_demo.py",
      "initialCode": "def execute_chaos_experiment(experiment_type):\n    if experiment_type == 'REGION_OUTAGE_SIMULATION':\n        return {\n            'action': 'KILL_ALL_INSTANCES_IN_US_EAST_1',\n            'expected_outcome': 'ANYCAST_FAILS_OVER_TO_US_WEST_2_IN_3000MS',\n            'passed': True,\n        }\n    return {'passed': False}\n\n\nprint(execute_chaos_experiment('REGION_OUTAGE_SIMULATION'))",
      "expectedOutput": "{'action': 'KILL_ALL_INSTANCES_IN_US_EAST_1', 'expected_outcome': 'ANYCAST_FAILS_OVER_TO_US_WEST_2_IN_3000MS', 'passed': True}"
    }
  },
  "dist-d30-b1-capstone-architecture-synthesis": {
    "run": {
      "filename": "capstone_exchange_sim.py",
      "initialCode": "def run_capstone_exchange_engine(order):\n    return {\n        'order_id': order['id'],\n        'gateway_status': 'EDGE_ADMITTED',\n        'routing_partition': 'PARTITION_7',\n        'fencing_token_assigned': 104289,\n        'consensus_replication': 'RAFT_QUORUM_COMMITTED (3 of 5 nodes)',\n        'ledger_status': 'IMMUTABLE_TRADE_RECORDED',\n        'execution_status': 'CAPSTONE_FINANCIAL_ENGINE_SUCCESS',\n    }\n\n\nres = run_capstone_exchange_engine({'id': 'trade_9981'})\nprint('Execution Status:', res['execution_status'])\nprint('Consensus:', res['consensus_replication'])",
      "expectedOutput": "Execution Status: CAPSTONE_FINANCIAL_ENGINE_SUCCESS\nConsensus: RAFT_QUORUM_COMMITTED (3 of 5 nodes)"
    }
  },
  "dist-d30-b2-trading-sla-audit": {
    "run": {
      "filename": "capstone_sla_audit.py",
      "initialCode": "def audit_capstone_sla(tps, p99_ms, consistency_percent):\n    passed = tps >= 100_000 and p99_ms <= 5.0 and consistency_percent == 100\n    return {\n        'trades_per_second': tps,\n        'p99_latency_ms': p99_ms,\n        'linearizability': f'{consistency_percent}%',\n        'grade': 'ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER' if passed else 'SLA_BREACHED',\n    }\n\n\nprint(audit_capstone_sla(150_000, 3.2, 100))",
      "expectedOutput": "{'trades_per_second': 150000, 'p99_latency_ms': 3.2, 'linearizability': '100%', 'grade': 'ENTERPRISE_DISTRIBUTED_SYSTEMS_EXCHANGE_MASTER'}"
    }
  },
  "dist-d30-b3-capstone-distributed-certification": {
    "run": {
      "filename": "capstone_dist_final_cert.py",
      "initialCode": "print('🏆 30-DAY DISTRIBUTED SYSTEMS IN PYTHON & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]')",
      "expectedOutput": "🏆 30-DAY DISTRIBUTED SYSTEMS IN PYTHON & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]"
    }
  }
};

/** Course wording written with JavaScript in mind, and its Python wording. Applied in this order. */
const TEXT_SWAPS: [string, string][] = [
  ["In-flight Promise deduplication Map (`inFlight.set(key, promise)`)", "In-flight request table (`in_flight[key].append(request_id)`)"],
  ["wait on Request 1's shared Promise", "wait for Request 1's result"],
  ["`span.setStatus({ code: SpanStatusCode.ERROR })`", "`span.set_status(Status(StatusCode.ERROR))`"],
  ["`traceparent: 00-${traceId}-${parentId}-${traceFlags}`", "`traceparent: f'00-{trace_id}-{parent_id}-{trace_flags}'`"],
];

/** Answers that differ from a plain conversion of the JavaScript output. */
const PYTHON_ANSWERS: Record<string, string> = {
  "dist-d30-b3-capstone-distributed-certification": "🏆 30-DAY DISTRIBUTED SYSTEMS IN PYTHON & HIGH-SCALE ARCHITECTURE MASTER CERTIFICATION [100% COMPLETE]",
};

export const DIST_PYTHON_PILOT_DAYS: DayLessonPlan[] = toPythonLessons(DISTRIBUTED_PILOT_DAYS, {
  code: DIST_PYTHON_BLOCK_CODE,
  textSwaps: TEXT_SWAPS,
  answers: PYTHON_ANSWERS,
});
