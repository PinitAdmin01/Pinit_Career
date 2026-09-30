import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { DISTRIBUTED_30_DAYS_CONFIGS } from './distributed30DayData';

/**
 * Distributed Systems in Python (course-distributed-python), for the Python track.
 *
 * The same 30 days, topics and lessons as High-Scale Distributed System Design (course-distributed-sys), but every
 * practice task is written and checked in Python, and the lesson examples run in Python (Pyodide).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/dist_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "Exponential Backoff Retry Engine",
      "desc": "Write `execute_with_backoff(call, max_retries=3, base_delay_ms=100, sleep=None)`. Run call(); if it raises, wait and try again, up to max_retries more times. The wait before retry n (n = 1, 2, 3...) is base_delay_ms * 2**(n - 1), and you wait by calling sleep(ms) (sleep is passed in so the checks can record the waits instead of really waiting). Return the first successful result; if every try fails, raise the last error.",
      "starter": "def execute_with_backoff(call, max_retries=3, base_delay_ms=100, sleep=None):\n    # try call(); on an exception sleep(base_delay_ms * 2 ** (retry - 1)) and try again\n    pass",
      "hint": "for attempt in range(max_retries + 1): try: return call() except Exception: if attempt == max_retries: raise; sleep(base_delay_ms * 2 ** attempt)",
      "test": "calls, waits = [], []\n\n\ndef flaky():\n    calls.append(1)\n    if len(calls) < 3:\n        raise TimeoutError('NET_TIMEOUT')\n    return 'OK'\n\n\nassert execute_with_backoff(flaky, 3, 10, waits.append) == 'OK', 'The third try succeeds, so return OK'\nassert len(calls) == 3 and waits == [10, 20], f'Expected 3 tries and waits [10, 20], got {len(calls)} tries and {waits}'\n\ntries, waits = [], []\n\n\ndef always_down():\n    tries.append(1)\n    raise ConnectionError('DOWN')\n\n\ntry:\n    execute_with_backoff(always_down, 3, 10, waits.append)\n    raise AssertionError('When every try fails, raise the last error')\nexcept ConnectionError:\n    pass\nassert len(tries) == 4 and waits == [10, 20, 40], f'1 try + 3 retries with waits [10, 20, 40], got {len(tries)} tries and {waits}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Backoff Delay Calculator",
      "desc": "Write `backoff_delay(attempt, base_delay=100)` returning base_delay * 2**(attempt - 1): 100, 200, 400, ... for attempts 1, 2, 3.",
      "starter": "def backoff_delay(attempt, base_delay=100):\n    pass",
      "hint": "return base_delay * 2 ** (attempt - 1)",
      "test": "assert backoff_delay(1) == 100 and backoff_delay(3) == 400, 'Expected 100 then 400'\nassert backoff_delay(5, 50) == 800, 'Attempt 5 with base 50 is 800'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "CAP & PACELC System Classifier",
      "desc": "Write `classify_system(partition, normal)`. partition is 'AP' or 'CP' (what the system keeps during a network split); normal is 'EL' (low latency) or 'EC' (consistency) when there is no split. Return 'AP/EL (e.g. Amazon DynamoDB, Apache Cassandra)', 'CP/EC (e.g. Google Cloud Spanner, CockroachDB)', 'CP/EL (e.g. MongoDB primary-secondary)', or 'CUSTOM' for anything else.",
      "starter": "def classify_system(partition, normal):\n    pass",
      "hint": "Use a dict keyed by (partition, normal) and .get(..., 'CUSTOM').",
      "test": "assert classify_system('AP', 'EL') == 'AP/EL (e.g. Amazon DynamoDB, Apache Cassandra)', 'DynamoDB is AP/EL'\nassert classify_system('CP', 'EC') == 'CP/EC (e.g. Google Cloud Spanner, CockroachDB)', 'Spanner is CP/EC'\nassert classify_system('CP', 'EL') == 'CP/EL (e.g. MongoDB primary-secondary)', 'MongoDB is CP/EL'\nassert classify_system('AP', 'EC') == 'CUSTOM', 'Other mixes are CUSTOM'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Partition Quorum Validator",
      "desc": "Write `has_quorum(active_nodes, total_nodes)` returning True when more than half of the nodes are reachable.",
      "starter": "def has_quorum(active_nodes, total_nodes):\n    pass",
      "hint": "return active_nodes > total_nodes // 2",
      "test": "assert has_quorum(3, 5) is True and has_quorum(2, 5) is False, '3 of 5 is a majority, 2 of 5 is not'\nassert has_quorum(2, 4) is False and has_quorum(3, 4) is True, 'Half is not a majority'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Protobuf Varint Encoder",
      "desc": "Protocol Buffers store numbers as varints: 7 bits per byte, lowest bits first, and the top bit (0x80) set on every byte except the last. Write `encode_varint(value)` returning the bytes as a list of ints, e.g. 300 → [0xAC, 0x02].",
      "starter": "def encode_varint(value):\n    pass",
      "hint": "while value >= 0x80: out.append((value & 0x7F) | 0x80); value >>= 7; then append the last value.",
      "test": "assert encode_varint(1) == [1], '1 fits in one byte'\nassert encode_varint(300) == [0xAC, 0x02], f'300 is [0xAC, 0x02], got {encode_varint(300)}'\nassert encode_varint(0) == [0], '0 is one zero byte'\nassert encode_varint(16384) == [0x80, 0x80, 0x01], '16384 needs three bytes'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Protobuf Wire Type Decoder",
      "desc": "The lowest 3 bits of a Protobuf tag byte give the wire type. Write `wire_type(tag)` returning 'VARINT' (0), 'FIXED64' (1), 'LENGTH_DELIMITED' (2), 'FIXED32' (5), or 'UNKNOWN' for anything else.",
      "starter": "def wire_type(tag):\n    pass",
      "hint": "{0: 'VARINT', 1: 'FIXED64', 2: 'LENGTH_DELIMITED', 5: 'FIXED32'}.get(tag & 0x07, 'UNKNOWN')",
      "test": "assert wire_type(0x08) == 'VARINT' and wire_type(0x12) == 'LENGTH_DELIMITED', 'Field 1 varint and field 2 bytes'\nassert wire_type(0x09) == 'FIXED64' and wire_type(0x0D) == 'FIXED32', 'Fixed-width types'\nassert wire_type(0x0B) == 'UNKNOWN', 'Wire type 3 is not supported here'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Consistent Hash Ring with Virtual Nodes",
      "desc": "Complete `ConsistentHashRing`. add_node(node, vnodes=3) puts vnodes points on the ring, hashing the names f'{node}#{i}' for i = 0, 1, ...; keep self.ring sorted by hash. remove_node(node) removes all of its points. get_node(key) returns the node of the first point whose hash is >= hash_fn(key), wrapping round to the first point when there is none, or None when the ring is empty.",
      "starter": "def default_hash(text):\n    h = 0\n    for ch in text:\n        h = (h * 31 + ord(ch)) % 2 ** 32\n    return h\n\n\nclass ConsistentHashRing:\n    def __init__(self, hash_fn=default_hash):\n        self.hash_fn = hash_fn\n        self.ring = []  # sorted list of (hash, node)\n\n    def add_node(self, node, vnodes=3):\n        pass\n\n    def remove_node(self, node):\n        pass\n\n    def get_node(self, key):\n        pass",
      "hint": "Use bisect.bisect_left on the list of hashes to find the first point >= the key's hash; an index equal to len(ring) wraps to 0.",
      "test": "table = {'A#0': 10, 'B#0': 20, 'C#0': 30, 'k5': 5, 'k15': 15, 'k25': 25, 'k35': 35}\nring = ConsistentHashRing(hash_fn=table.get)\nassert ring.get_node('k15') is None, 'An empty ring has no node'\nfor n in ('A', 'B', 'C'):\n    ring.add_node(n, 1)\nassert [ring.get_node(k) for k in ('k5', 'k15', 'k25')] == ['A', 'B', 'C'], 'Each key goes to the next point clockwise'\nassert ring.get_node('k35') == 'A', 'Past the last point, wrap round to the first'\nring.remove_node('B')\nassert ring.get_node('k15') == 'C', 'Keys of a removed node move to the next node'\nassert ring.get_node('k5') == 'A', 'Other keys do not move'\nbig = ConsistentHashRing()\nfor n in ('Server-A', 'Server-B', 'Server-C'):\n    big.add_node(n, 5)\nassert len(big.ring) == 15, '3 nodes with 5 virtual nodes each is 15 points'\nassert big.ring == sorted(big.ring), 'Keep the ring sorted'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Ring Key Migration Estimator",
      "desc": "When a node joins a consistent-hash ring of N nodes, about 1 / (N + 1) of the keys move to it. Write `migration_estimate(total_keys, nodes)` returning {'fraction': that share as a percentage with 1 decimal, like '10.0%', 'keys_moved': round(total_keys / (nodes + 1))}.",
      "starter": "def migration_estimate(total_keys, nodes):\n    pass",
      "hint": "share = 1 / (nodes + 1); f'{share * 100:.1f}%'",
      "test": "assert migration_estimate(1000, 9) == {'fraction': '10.0%', 'keys_moved': 100}, 'A 10th node takes 10% of the keys'\nassert migration_estimate(900, 2) == {'fraction': '33.3%', 'keys_moved': 300}, 'A 3rd node takes a third'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "TTL Cache with Request Coalescing",
      "desc": "Complete `TtlCache`. get_or_fetch(key, fetch, now, ttl=60) returns the cached value if it has not expired (it expires ttl seconds after it was stored), otherwise calls fetch(key), stores the value with its expiry time and returns it. get_many(keys, fetch, now, ttl=60) serves a burst of requests: it returns one value per key, in order, but calls fetch at most once per distinct key (this stops a 'thundering herd' of identical database queries).",
      "starter": "class TtlCache:\n    def __init__(self):\n        self.store = {}  # key -> (value, expires_at)\n\n    def get_or_fetch(self, key, fetch, now, ttl=60):\n        pass\n\n    def get_many(self, keys, fetch, now, ttl=60):\n        pass",
      "hint": "In get_many, calling get_or_fetch for each key already works: after the first fetch the value is cached.",
      "test": "fetched = []\n\n\ndef load(key):\n    fetched.append(key)\n    return {'user': key.upper()}\n\n\ncache = TtlCache()\nassert cache.get_or_fetch('alice', load, now=0) == {'user': 'ALICE'}, 'First read fetches'\nassert cache.get_or_fetch('alice', load, now=30) == {'user': 'ALICE'} and fetched == ['alice'], 'Within the TTL, use the cache'\ncache.get_or_fetch('alice', load, now=61)\nassert fetched == ['alice', 'alice'], 'After the TTL, fetch again'\nfetched.clear()\nburst = cache.get_many(['bob', 'bob', 'carol', 'bob'], load, now=100)\nassert [v['user'] for v in burst] == ['BOB', 'BOB', 'CAROL', 'BOB'], 'One value per request, in order'\nassert fetched == ['bob', 'carol'], f'Fetch each distinct key once, got {fetched}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "TTL Jitter Calculator",
      "desc": "If many cache keys expire at the same second, the database gets hit all at once. Write `ttl_with_jitter(base, max_jitter=10, rng=random)` returning base plus a random whole number from 0 up to max_jitter - 1, using rng.randrange.",
      "starter": "import random\n\n\ndef ttl_with_jitter(base, max_jitter=10, rng=random):\n    pass",
      "hint": "return base + rng.randrange(max_jitter)",
      "test": "rng = random.Random(42)\nvalues = [ttl_with_jitter(60, 5, rng) for _ in range(200)]\nassert all(isinstance(v, int) and 60 <= v < 65 for v in values), 'TTL must be a whole number from 60 to 64'\nassert len(set(values)) == 5, 'Over 200 tries every jitter from 0 to 4 should appear'\nassert ttl_with_jitter(30, 1) == 30, 'max_jitter 1 means no jitter'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Distributed Lock with Fencing Tokens",
      "desc": "Complete `LockManager`. acquire(resource, now, ttl_ms=1000): if someone holds an unexpired lock on it return {'success': False}; otherwise add 1 to the fencing counter and return {'success': True, 'lock_id': f'lock_{counter}', 'fencing_token': counter}. A lock expires at now + ttl_ms. release(resource, lock_id) frees the lock only if lock_id matches and returns True, otherwise returns False.",
      "starter": "class LockManager:\n    def __init__(self):\n        self.locks = {}  # resource -> {'lock_id', 'expires_at'}\n        self.counter = 0\n\n    def acquire(self, resource, now, ttl_ms=1000):\n        pass\n\n    def release(self, resource, lock_id):\n        pass",
      "hint": "held = self.locks.get(resource); if held and held['expires_at'] > now: return {'success': False}",
      "test": "m = LockManager()\nl1 = m.acquire('order_9981', now=0)\nassert l1 == {'success': True, 'lock_id': 'lock_1', 'fencing_token': 1}, f'First lock: {l1}'\nassert m.acquire('order_9981', now=10) == {'success': False}, 'Only one holder at a time'\nassert m.release('order_9981', 'lock_99') is False, 'A wrong lock id cannot release'\nassert m.release('order_9981', 'lock_1') is True, 'The holder can release'\nl2 = m.acquire('order_9981', now=20)\nassert l2['success'] and l2['fencing_token'] == 2, 'The next holder gets a higher token'\nl3 = m.acquire('order_9981', now=20 + 1000)\nassert l3['success'] and l3['fencing_token'] == 3, 'An expired lock can be taken over'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Lock Validity Checker",
      "desc": "Clocks on different machines drift. Write `is_lock_valid(acquired_at, ttl_ms, now, drift_ms=50)` returning True only while now - acquired_at + drift_ms is less than ttl_ms.",
      "starter": "def is_lock_valid(acquired_at, ttl_ms, now, drift_ms=50):\n    pass",
      "hint": "return now - acquired_at + drift_ms < ttl_ms",
      "test": "assert is_lock_valid(0, 1000, 100) is True, 'A fresh lock is valid'\nassert is_lock_valid(0, 1000, 5000) is False, 'A lock taken 5 s ago with a 1 s TTL has expired'\nassert is_lock_valid(0, 1000, 960) is False, 'Within the drift margin of expiry, treat it as expired'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Bully Leader Election",
      "desc": "Write `bully_election(node_ids, failed_leader)`: the highest id among the other nodes wins. Return {'leader': id, 'message': f'COORDINATOR: Node {id}', 'status': 'ELECTED'}, or {'leader': None, 'message': '', 'status': 'NO_ACTIVE_NODES'} if no node is left.",
      "starter": "def bully_election(node_ids, failed_leader):\n    pass",
      "hint": "remaining = [n for n in node_ids if n != failed_leader]",
      "test": "assert bully_election([101, 102, 105, 108], 108) == {'leader': 105, 'message': 'COORDINATOR: Node 105', 'status': 'ELECTED'}, 'The highest remaining node wins'\nassert bully_election([3, 9, 1], 1)['leader'] == 9, 'The order of the list does not matter'\nassert bully_election([7], 7) == {'leader': None, 'message': '', 'status': 'NO_ACTIVE_NODES'}, 'Nobody left'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Election Majority Checker",
      "desc": "Write `has_majority(votes, total)` returning True when votes is at least total // 2 + 1.",
      "starter": "def has_majority(votes, total):\n    pass",
      "hint": "return votes >= total // 2 + 1",
      "test": "assert has_majority(3, 5) is True and has_majority(2, 5) is False, '3 of 5 wins, 2 of 5 does not'\nassert has_majority(4, 6) is True and has_majority(3, 6) is False, '3 of 6 is only half'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Snowflake 64-bit ID Generator",
      "desc": "Complete `next_id()` of the Twitter Snowflake generator. An id is ((ms - EPOCH) << 22) | (datacenter_id << 17) | (worker_id << 12) | sequence. The sequence counts up (0-4095) for ids made in the same millisecond and restarts at 0 in a new millisecond. If the clock goes backwards, raise ValueError('CLOCK_MOVED_BACKWARDS').",
      "starter": "class SnowflakeGenerator:\n    EPOCH = 1704067200000  # 2024-01-01 in milliseconds\n\n    def __init__(self, worker_id, datacenter_id, clock):\n        self.worker_id = worker_id\n        self.datacenter_id = datacenter_id\n        self.clock = clock  # a function returning the time in milliseconds\n        self.sequence = 0\n        self.last_ms = -1\n\n    def next_id(self):\n        pass",
      "hint": "ms = self.clock(); if ms == self.last_ms: self.sequence += 1 else: self.sequence = 0",
      "test": "times = iter([1704067200005, 1704067200005, 1704067200006, 1704067200004])\ngen = SnowflakeGenerator(worker_id=5, datacenter_id=2, clock=lambda: next(times))\na, b, c = gen.next_id(), gen.next_id(), gen.next_id()\nassert a < b < c, 'Ids must keep increasing'\nassert a >> 22 == 5 and (a >> 17) & 31 == 2 and (a >> 12) & 31 == 5, 'Time, datacenter and worker bits are in the wrong place'\nassert a & 4095 == 0 and b & 4095 == 1 and c & 4095 == 0, 'Sequence: 0, then 1 in the same ms, then 0 in a new ms'\nassert a == (5 << 22) | (2 << 17) | (5 << 12), f'Expected {(5 << 22) | (2 << 17) | (5 << 12)}, got {a}'\ntry:\n    gen.next_id()\n    raise AssertionError('A clock that goes backwards must raise ValueError')\nexcept ValueError as err:\n    assert str(err) == 'CLOCK_MOVED_BACKWARDS', 'Use the message CLOCK_MOVED_BACKWARDS'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Base-36 Time Prefix",
      "desc": "Sortable ids often start with the timestamp in a compact alphabet. Write `time_prefix(ms)` returning ms written in base 36 with digits 0-9 then A-Z (so 35 is 'Z' and 36 is '10').",
      "starter": "DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'\n\n\ndef time_prefix(ms):\n    pass",
      "hint": "Repeatedly take ms % 36 as the next digit (from the right) and ms //= 36; 0 is '0'.",
      "test": "assert time_prefix(35) == 'Z' and time_prefix(36) == '10', 'Base 36: Z then 10'\nassert time_prefix(0) == '0', 'Zero is 0'\np = time_prefix(1700000000000)\nassert int(p, 36) == 1700000000000 and p.isupper(), f'{p} does not read back as the same number'\nassert time_prefix(1700000000000) < time_prefix(1700000000001), 'Later times give later prefixes'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Raft AppendEntries Log Check",
      "desc": "A Raft follower receives AppendEntries(prev_index, prev_term, entries). Write `append_entries(log, prev_index, prev_term, entries)`: log entries are {'term', 'cmd'}. If prev_index is not -1 and the follower has no entry there, or that entry's term is not prev_term, return {'success': False, 'reason': 'LOG_MISMATCH'}. Otherwise keep log[:prev_index + 1], add the entries (dropping any conflicting tail), and return {'success': True, 'log': new_log, 'match_index': len(new_log) - 1}. Do not change the input list.",
      "starter": "def append_entries(log, prev_index, prev_term, entries):\n    pass",
      "hint": "if prev_index >= 0 and (prev_index >= len(log) or log[prev_index]['term'] != prev_term): mismatch",
      "test": "log = [{'term': 1, 'cmd': 'x=1'}]\nres = append_entries(log, 0, 1, [{'term': 2, 'cmd': 'y=2'}])\nassert res == {'success': True, 'log': [{'term': 1, 'cmd': 'x=1'}, {'term': 2, 'cmd': 'y=2'}], 'match_index': 1}, f'Append failed: {res}'\nassert len(log) == 1, 'Do not change the input log'\nassert append_entries(log, 0, 3, []) == {'success': False, 'reason': 'LOG_MISMATCH'}, 'Different term at prev_index'\nassert append_entries(log, 4, 1, []) == {'success': False, 'reason': 'LOG_MISMATCH'}, 'Missing entry at prev_index'\nstale = [{'term': 1, 'cmd': 'a'}, {'term': 1, 'cmd': 'b'}, {'term': 1, 'cmd': 'c'}]\nfixed = append_entries(stale, 0, 1, [{'term': 2, 'cmd': 'B'}])\nassert [e['cmd'] for e in fixed['log']] == ['a', 'B'], 'Replace the conflicting tail with the leader entries'\nassert append_entries([], -1, 0, [{'term': 1, 'cmd': 'first'}])['match_index'] == 0, 'prev_index -1 means start of the log'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Raft Commit Quorum",
      "desc": "An entry is committed once it is stored on a majority of the cluster. Write `is_committed(match_count, cluster_size)`.",
      "starter": "def is_committed(match_count, cluster_size):\n    pass",
      "hint": "return match_count > cluster_size // 2",
      "test": "assert is_committed(3, 5) is True and is_committed(2, 5) is False, '3 of 5 commits'\nassert is_committed(2, 3) is True and is_committed(2, 4) is False, '2 of 4 is only half'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Two-Phase Commit Coordinator",
      "desc": "Write `two_phase_commit(cohorts)`. Phase 1: call prepare() on every cohort and collect the votes ('VOTE_COMMIT' or 'VOTE_ABORT'). Phase 2: if all voted commit, call commit() on every cohort and return {'status': 'GLOBAL_COMMITTED', 'votes': votes}; otherwise call abort() on every cohort and return {'status': 'GLOBAL_ABORTED', 'votes': votes}.",
      "starter": "def two_phase_commit(cohorts):\n    pass",
      "hint": "votes = [c.prepare() for c in cohorts]; if all(v == 'VOTE_COMMIT' for v in votes): ...",
      "test": "class Cohort:\n    def __init__(self, vote):\n        self.vote, self.done = vote, None\n\n    def prepare(self):\n        return self.vote\n\n    def commit(self):\n        self.done = 'committed'\n\n    def abort(self):\n        self.done = 'aborted'\n\n\na, b = Cohort('VOTE_COMMIT'), Cohort('VOTE_ABORT')\nassert two_phase_commit([a, b]) == {'status': 'GLOBAL_ABORTED', 'votes': ['VOTE_COMMIT', 'VOTE_ABORT']}, 'One abort vote aborts everyone'\nassert a.done == 'aborted' and b.done == 'aborted', 'Call abort() on every cohort'\nc, d = Cohort('VOTE_COMMIT'), Cohort('VOTE_COMMIT')\nassert two_phase_commit([c, d])['status'] == 'GLOBAL_COMMITTED', 'All yes: commit'\nassert c.done == 'committed' and d.done == 'committed', 'Call commit() on every cohort'\nprint('All checks passed.')"
    },
    "a": {
      "title": "2PC Vote Counter",
      "desc": "Write `count_votes(votes)` returning {'commit': number of 'VOTE_COMMIT', 'abort': number of 'VOTE_ABORT'}.",
      "starter": "def count_votes(votes):\n    pass",
      "hint": "votes.count('VOTE_COMMIT')",
      "test": "assert count_votes(['VOTE_COMMIT', 'VOTE_ABORT', 'VOTE_COMMIT']) == {'commit': 2, 'abort': 1}, 'Expected 2 commit and 1 abort'\nassert count_votes([]) == {'commit': 0, 'abort': 0}, 'No votes'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Saga Orchestrator with Compensation",
      "desc": "Write `run_saga(steps)`. Each step is {'name', 'action', 'compensate'} (functions with no arguments). Run the actions in order. If one raises, run compensate() for every step that already finished, newest first, and return {'status': 'SAGA_COMPENSATED', 'failed_at': step name, 'error': str(error)}. If all succeed return {'status': 'SAGA_COMPLETED'}.",
      "starter": "def run_saga(steps):\n    pass",
      "hint": "Keep a list of finished steps; on an exception loop over reversed(finished).",
      "test": "undone = []\n\n\ndef fail():\n    raise RuntimeError('OUT_OF_STOCK')\n\n\nsteps = [\n    {'name': 'ReserveCredit', 'action': lambda: None, 'compensate': lambda: undone.append('Credit')},\n    {'name': 'ReserveSeat', 'action': lambda: None, 'compensate': lambda: undone.append('Seat')},\n    {'name': 'ReserveInventory', 'action': fail, 'compensate': lambda: undone.append('Inventory')},\n]\nassert run_saga(steps) == {'status': 'SAGA_COMPENSATED', 'failed_at': 'ReserveInventory', 'error': 'OUT_OF_STOCK'}, 'The third step fails'\nassert undone == ['Seat', 'Credit'], f'Undo finished steps newest first, got {undone}'\nassert run_saga(steps[:2]) == {'status': 'SAGA_COMPLETED'}, 'All steps succeed'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Saga Log Formatter",
      "desc": "Write `format_saga_log(step, status)` returning '[SAGA]: step -> status'.",
      "starter": "def format_saga_log(step, status):\n    pass",
      "hint": "f'[SAGA]: {step} -> {status}'",
      "test": "assert format_saga_log('Payment', 'DONE') == '[SAGA]: Payment -> DONE', 'Expected [SAGA]: Payment -> DONE'\nassert format_saga_log('Ship', 'UNDONE') == '[SAGA]: Ship -> UNDONE', 'Use the given step and status'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Kafka Partition Assignment",
      "desc": "Write `assign_partitions(num_partitions, consumers)` spreading partitions 0..num_partitions-1 over the consumers round-robin: partition p goes to consumers[p % len(consumers)]. Return a dict consumer -> list of partitions (every consumer appears, even with an empty list).",
      "starter": "def assign_partitions(num_partitions, consumers):\n    pass",
      "hint": "assignment = {c: [] for c in consumers}",
      "test": "assert assign_partitions(6, ['c1', 'c2', 'c3']) == {'c1': [0, 3], 'c2': [1, 4], 'c3': [2, 5]}, 'Round robin'\nassert assign_partitions(2, ['a', 'b', 'c']) == {'a': [0], 'b': [1], 'c': []}, 'More consumers than partitions: one gets nothing'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Partition Key Router",
      "desc": "Messages with the same key must land on the same partition. Write `route_to_partition(key, total)`: h starts at 0 and for each character becomes (h * 31 + ord(ch)) % 2**32; return h % total.",
      "starter": "def route_to_partition(key, total):\n    pass",
      "hint": "for ch in key: h = (h * 31 + ord(ch)) % 2 ** 32",
      "test": "assert route_to_partition('a', 4) == 1 and route_to_partition('ab', 4) == 1, \"'a' is 97 and 'ab' is 3105: both land on partition 1\"\nassert route_to_partition('order_101', 8) == route_to_partition('order_101', 8), 'The same key always goes to the same partition'\nassert route_to_partition('order_101', 1000) == 393, f\"Expected partition 393, got {route_to_partition('order_101', 1000)}\"\nassert len({route_to_partition(f'order_{k}', 4) for k in 'abcdefgh'}) > 1, 'Different keys spread over partitions'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Idempotent Message Handler",
      "desc": "Queues can deliver the same message twice. Write `process_once(message_id, payload_hash, store, handler)`. The first time a message id is seen, call handler(), save {'hash': payload_hash, 'result': result} in store[message_id] and return {'duplicate': False, 'result': result}. When the id was seen before: return {'duplicate': True, 'result': the saved result} if the hash matches, or {'duplicate': True, 'error': 'PAYLOAD_MISMATCH'} if a different payload reuses the id. The handler must not run again.",
      "starter": "def process_once(message_id, payload_hash, store, handler):\n    pass",
      "hint": "seen = store.get(message_id); if seen: compare seen['hash'] with payload_hash",
      "test": "store, runs = {}, []\n\n\ndef pay():\n    runs.append(1)\n    return {'payment_id': 'pay_9981'}\n\n\nassert process_once('msg_1', 'hashA', store, pay) == {'duplicate': False, 'result': {'payment_id': 'pay_9981'}}, 'First delivery runs'\nassert process_once('msg_1', 'hashA', store, pay) == {'duplicate': True, 'result': {'payment_id': 'pay_9981'}}, 'Second delivery returns the saved result'\nassert process_once('msg_1', 'hashB', store, pay) == {'duplicate': True, 'error': 'PAYLOAD_MISMATCH'}, 'Same id, different payload'\nassert len(runs) == 1, f'The handler ran {len(runs)} times instead of once'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Idempotency Key Generator",
      "desc": "Write `idempotency_key(user_id, order_id)` returning 'idemp_USER_ORDER'.",
      "starter": "def idempotency_key(user_id, order_id):\n    pass",
      "hint": "f'idemp_{user_id}_{order_id}'",
      "test": "assert idempotency_key('u1', 'o99') == 'idemp_u1_o99', 'Expected idemp_u1_o99'\nassert idempotency_key('alice', 7) == 'idemp_alice_7', 'Numbers work too'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Dead Letter Queue Router",
      "desc": "Write `handle_message(msg, handler, dlq, max_attempts=3)`. msg is a dict with 'id', 'payload' and 'retry_count'. Call handler(msg['payload']); on success return {'status': 'PROCESSED', 'result': result}. On an exception add 1 to msg['retry_count']; if it has reached max_attempts append {'message': msg, 'error': str(error)} to dlq and return {'status': 'ROUTED_TO_DLQ'}, otherwise return {'status': 'RETRY_SCHEDULED', 'attempt': msg['retry_count'] + 1}.",
      "starter": "def handle_message(msg, handler, dlq, max_attempts=3):\n    pass",
      "hint": "msg['retry_count'] += 1 inside the except block",
      "test": "def broken(payload):\n    raise ValueError('JSON_PARSE_ERROR')\n\n\ndlq = []\nmsg = {'id': 'msg_bad', 'payload': 'corrupt', 'retry_count': 0}\nassert handle_message(msg, broken, dlq) == {'status': 'RETRY_SCHEDULED', 'attempt': 2}, 'First failure: retry'\nassert handle_message(msg, broken, dlq) == {'status': 'RETRY_SCHEDULED', 'attempt': 3}, 'Second failure: retry'\nassert handle_message(msg, broken, dlq) == {'status': 'ROUTED_TO_DLQ'}, 'Third failure: dead letter queue'\nassert dlq == [{'message': msg, 'error': 'JSON_PARSE_ERROR'}] and msg['retry_count'] == 3, f'Wrong DLQ: {dlq}'\nassert handle_message({'id': 'ok', 'payload': 21, 'retry_count': 0}, lambda p: p * 2, dlq) == {'status': 'PROCESSED', 'result': 42}, 'Good messages are processed'\nprint('All checks passed.')"
    },
    "a": {
      "title": "DLQ Entry Formatter",
      "desc": "Write `dlq_entry(msg_id, error, now)` returning {'msg_id': msg_id, 'error': error, 'failed_at': now}.",
      "starter": "def dlq_entry(msg_id, error, now):\n    pass",
      "hint": "Return a dict with the three keys.",
      "test": "assert dlq_entry('m1', 'bad', 1700) == {'msg_id': 'm1', 'error': 'bad', 'failed_at': 1700}, 'Wrong entry'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Resilient Distributed Transaction",
      "desc": "Join Days 11-14 together. Write `run_transaction(event, store, steps, dlq)`. If store already has event['key'], return {'status': 'DUPLICATE_DROPPED'}. Otherwise run each step's execute(); if one raises, run compensate() on the finished steps newest first, append {'event': event, 'error': str(error)} to dlq and return {'status': 'FAILED_COMPENSATED'}. If all succeed set store[event['key']] = 'COMMITTED' and return {'status': 'COMMITTED'}. Steps are dicts with 'execute' and 'compensate' functions.",
      "starter": "def run_transaction(event, store, steps, dlq):\n    pass",
      "hint": "Check the store first; keep a list of finished steps for the rollback.",
      "test": "log, store, dlq = [], {}, []\nok_steps = [{'execute': lambda: log.append('debit'), 'compensate': lambda: log.append('refund')}]\nassert run_transaction({'key': 'tx_101'}, store, ok_steps, dlq) == {'status': 'COMMITTED'} and store == {'tx_101': 'COMMITTED'}, 'Commit and remember the key'\nassert run_transaction({'key': 'tx_101'}, store, ok_steps, dlq) == {'status': 'DUPLICATE_DROPPED'} and log == ['debit'], 'A repeated event does nothing'\n\n\ndef boom():\n    raise RuntimeError('LEDGER_DOWN')\n\n\nbad_steps = ok_steps + [{'execute': boom, 'compensate': lambda: None}]\nassert run_transaction({'key': 'tx_102'}, store, bad_steps, dlq) == {'status': 'FAILED_COMPENSATED'}, 'Failure is compensated'\nassert log == ['debit', 'debit', 'refund'] and 'tx_102' not in store, 'Undo the debit and do not mark it committed'\nassert dlq == [{'event': {'key': 'tx_102'}, 'error': 'LEDGER_DOWN'}], f'Wrong DLQ: {dlq}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Transaction Duration",
      "desc": "Write `tx_duration(start_ms, end_ms)` returning the time taken as a string like '125ms'.",
      "starter": "def tx_duration(start_ms, end_ms):\n    pass",
      "hint": "f'{end_ms - start_ms}ms'",
      "test": "assert tx_duration(1000, 1125) == '125ms', 'Expected 125ms'\nassert tx_duration(5, 5) == '0ms', 'Same time: 0ms'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Vector Clock Comparator",
      "desc": "Write `compare_vector_clocks(a, b)` for clocks like {'N1': 2, 'N2': 1} (a missing node counts as 0). Return 'A_BEFORE_B' if every entry of a is <= b and at least one is smaller, 'B_BEFORE_A' for the reverse, 'EQUAL' if they are the same, and 'CONCURRENT' if each is ahead somewhere (a real conflict).",
      "starter": "def compare_vector_clocks(a, b):\n    pass",
      "hint": "nodes = set(a) | set(b); a_ahead = any(a.get(n, 0) > b.get(n, 0) for n in nodes)",
      "test": "v1, v2, v3 = {'N1': 2, 'N2': 1}, {'N1': 2, 'N2': 2}, {'N1': 3, 'N2': 0}\nassert compare_vector_clocks(v1, v2) == 'A_BEFORE_B', 'v1 happened before v2'\nassert compare_vector_clocks(v2, v1) == 'B_BEFORE_A', 'And the other way round'\nassert compare_vector_clocks(v2, v3) == 'CONCURRENT', 'Each is ahead on one node: a conflict'\nassert compare_vector_clocks({'N1': 1}, {'N1': 1, 'N2': 0}) == 'EQUAL', 'A missing node counts as 0'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Lamport Clock on Receive",
      "desc": "When a process receives a message, its Lamport clock becomes max(local, received) + 1. Write `lamport_receive(local, received)`.",
      "starter": "def lamport_receive(local, received):\n    pass",
      "hint": "return max(local, received) + 1",
      "test": "assert lamport_receive(3, 7) == 8 and lamport_receive(9, 2) == 10, 'max + 1'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "PN-Counter CRDT",
      "desc": "Complete the `PNCounter` CRDT. increment(v=1) and decrement(v=1) add to this node's entry in p or n. value() is sum(p) - sum(n). merge(other) takes, for every node in either counter, the larger of the two entries (in both p and n), so merging twice or in any order gives the same result.",
      "starter": "class PNCounter:\n    def __init__(self, node_id):\n        self.node_id = node_id\n        self.p = {}  # node -> total added by that node\n        self.n = {}  # node -> total subtracted by that node\n\n    def increment(self, v=1):\n        pass\n\n    def decrement(self, v=1):\n        pass\n\n    def value(self):\n        pass\n\n    def merge(self, other):\n        pass",
      "hint": "for node in set(self.p) | set(other.p): self.p[node] = max(self.p.get(node, 0), other.p.get(node, 0))",
      "test": "a, b = PNCounter('A'), PNCounter('B')\na.increment(10)\nb.decrement(3)\nb.increment(2)\na.merge(b)\nassert a.value() == 9, f'10 + 2 - 3 = 9, got {a.value()}'\na.merge(b)\nassert a.value() == 9, 'Merging again changes nothing'\nb.merge(a)\nassert b.value() == 9, 'Both replicas agree after merging'\na.increment()\nassert a.value() == 10 and a.p == {'A': 11, 'B': 2}, 'Each node only adds to its own entry'\nprint('All checks passed.')"
    },
    "a": {
      "title": "LWW-Register Resolver",
      "desc": "Write `resolve_lww(a, b)` for registers {'value', 'ts', 'node'}: return the value with the higher ts. If the timestamps are equal, the higher node id wins, so every replica picks the same value.",
      "starter": "def resolve_lww(a, b):\n    pass",
      "hint": "Compare (a['ts'], a['node']) with (b['ts'], b['node']).",
      "test": "assert resolve_lww({'value': 'old', 'ts': 100, 'node': 'n1'}, {'value': 'new', 'ts': 200, 'node': 'n1'}) == 'new', 'The newer write wins'\nassert resolve_lww({'value': 'x', 'ts': 5, 'node': 'n2'}, {'value': 'y', 'ts': 5, 'node': 'n9'}) == 'y', 'Tie: the higher node id wins'\nassert resolve_lww({'value': 'x', 'ts': 5, 'node': 'n9'}, {'value': 'y', 'ts': 5, 'node': 'n2'}) == 'x', 'Same rule the other way round'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Directory-Based Shard Router",
      "desc": "Write `shard_for_customer(customer_id, directory, num_shards=4)`. Big customers are listed in directory (customer -> shard name). Everyone else is hashed: h starts at 0 and for each character becomes (h * 31 + ord(ch)) % 2**32; return f'shard_{h % num_shards}'.",
      "starter": "def shard_for_customer(customer_id, directory, num_shards=4):\n    pass",
      "hint": "if customer_id in directory: return directory[customer_id]",
      "test": "directory = {'enterprise_client_1': 'shard_dedicated_enterprise'}\nassert shard_for_customer('enterprise_client_1', directory) == 'shard_dedicated_enterprise', 'Listed customers use their shard'\nassert shard_for_customer('regular_client_2', directory) == 'shard_1', f\"Expected shard_1, got {shard_for_customer('regular_client_2', directory)}\"\nassert shard_for_customer('regular_client_2', directory, 10) == 'shard_9', 'Use num_shards'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Range Shard Evaluator",
      "desc": "Write `range_shard(user_id)`: ids 1-1000 go to 'shard_1', 1001-2000 to 'shard_2', and everything above to 'shard_3'.",
      "starter": "def range_shard(user_id):\n    pass",
      "hint": "if user_id <= 1000: return 'shard_1'",
      "test": "assert range_shard(500) == 'shard_1' and range_shard(1000) == 'shard_1', 'Up to 1000 is shard_1'\nassert range_shard(1001) == 'shard_2' and range_shard(2000) == 'shard_2', '1001-2000 is shard_2'\nassert range_shard(2001) == 'shard_3', 'Above 2000 is shard_3'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Read-Your-Writes Query Router",
      "desc": "Write `route_query(op, session, now, replicas)` (times in ms). A 'WRITE' sets session['last_write'] = now and returns 'MASTER'. A 'READ' within 5000 ms of the session's last write also returns 'MASTER' (so users see their own change). Other reads go to the replicas in turn: use session['reads'] (start at 0) as a counter and return replicas[reads % len(replicas)], then add 1.",
      "starter": "def route_query(op, session, now, replicas):\n    pass",
      "hint": "last = session.get('last_write'); if last is not None and now - last < 5000: return 'MASTER'",
      "test": "session, replicas = {}, ['rep1', 'rep2']\nassert route_query('READ', session, 0, replicas) == 'rep1', 'A fresh session reads from a replica'\nassert route_query('WRITE', session, 1000, replicas) == 'MASTER' and session['last_write'] == 1000, 'Writes go to the master'\nassert route_query('READ', session, 3000, replicas) == 'MASTER', 'Right after a write, read from the master'\nassert route_query('READ', session, 7000, replicas) == 'rep2', 'Later reads use the replicas again, in turn'\nassert route_query('READ', session, 7100, replicas) == 'rep1', 'Round robin over the replicas'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Replication Lag Alert",
      "desc": "Write `lag_exceeded(lag_seconds, max_lag=10)` returning True when the lag is above max_lag.",
      "starter": "def lag_exceeded(lag_seconds, max_lag=10):\n    pass",
      "hint": "return lag_seconds > max_lag",
      "test": "assert lag_exceeded(15) is True and lag_exceeded(5) is False, '15 s is too much, 5 s is fine'\nassert lag_exceeded(10) is False and lag_exceeded(3, 2) is True, 'Exactly the limit is fine; use the given limit'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Circuit Breaker State Machine",
      "desc": "Complete `CircuitBreaker.call(fn, now)`. When OPEN and less than reset_timeout_ms has passed since it opened, raise CircuitOpenError without calling fn; once the timeout has passed, move to 'HALF_OPEN' and let one call through. When fn raises, count a failure, re-raise the error, and move to 'OPEN' (recording opened_at = now) once failures reach threshold, or straight away if the failing call was the HALF_OPEN trial. A successful call returns fn()'s result, resets failures to 0 and sets the state to 'CLOSED'.",
      "starter": "class CircuitOpenError(Exception):\n    pass\n\n\nclass CircuitBreaker:\n    def __init__(self, threshold=3, reset_timeout_ms=500):\n        self.state = 'CLOSED'\n        self.failures = 0\n        self.threshold = threshold\n        self.reset_timeout_ms = reset_timeout_ms\n        self.opened_at = 0\n\n    def call(self, fn, now):\n        pass",
      "hint": "Handle the OPEN check first, then try: result = fn() except Exception: update state; raise",
      "test": "cb = CircuitBreaker(threshold=2, reset_timeout_ms=50)\n\n\ndef down():\n    raise ConnectionError('SERVICE_DOWN')\n\n\nfor t in (0, 1):\n    try:\n        cb.call(down, t)\n        raise AssertionError('The error from a failing service must be passed on')\n    except ConnectionError:\n        pass\nassert cb.state == 'OPEN', 'Two failures trip the breaker'\ncalled = []\ntry:\n    cb.call(lambda: called.append(1), 10)\n    raise AssertionError('An open circuit must raise CircuitOpenError')\nexcept CircuitOpenError:\n    pass\nassert called == [], 'An open circuit must not call the service'\ntry:\n    cb.call(down, 100)\nexcept ConnectionError:\n    pass\nassert cb.state == 'OPEN' and cb.opened_at == 100, 'A failed trial call opens the circuit again'\nassert cb.call(lambda: 'ok', 200) == 'ok' and cb.state == 'CLOSED' and cb.failures == 0, 'A good trial call closes the circuit'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Circuit Status Formatter",
      "desc": "Write `format_circuit_status(state)` returning '[CIRCUIT]: STATE'.",
      "starter": "def format_circuit_status(state):\n    pass",
      "hint": "f'[CIRCUIT]: {state}'",
      "test": "assert format_circuit_status('OPEN') == '[CIRCUIT]: OPEN' and format_circuit_status('HALF_OPEN') == '[CIRCUIT]: HALF_OPEN', 'Wrong format'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Resilient API Gateway",
      "desc": "Write `handle_gateway(client_id, is_allowed, breaker_call, backend)`. If is_allowed(client_id) is False return {'status': 429}. Otherwise run breaker_call(backend) (the circuit breaker calls the backend for you): return {'status': 200, 'data': result}; if it raises CircuitOpenError return {'status': 503}; any other exception returns {'status': 500, 'error': str(error)}. CircuitOpenError is defined for you.",
      "starter": "class CircuitOpenError(Exception):\n    pass\n\n\ndef handle_gateway(client_id, is_allowed, breaker_call, backend):\n    pass",
      "hint": "try: data = breaker_call(backend) except CircuitOpenError: ... except Exception as err: ...",
      "test": "allowed = lambda c: c == 'client_ok'\nthrough = lambda fn: fn()\n\n\ndef tripped(fn):\n    raise CircuitOpenError()\n\n\ndef crash():\n    raise RuntimeError('DB_TIMEOUT')\n\n\nassert handle_gateway('client_bad', allowed, through, lambda: 'x') == {'status': 429}, 'Rate-limited clients get 429'\nassert handle_gateway('client_ok', allowed, through, lambda: {'ok': True}) == {'status': 200, 'data': {'ok': True}}, 'Normal call'\nassert handle_gateway('client_ok', allowed, tripped, lambda: 'x') == {'status': 503}, 'Open circuit: 503'\nassert handle_gateway('client_ok', allowed, through, crash) == {'status': 500, 'error': 'DB_TIMEOUT'}, 'Backend error: 500'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Response Time Header",
      "desc": "Write `response_time_header(ms)` returning 'X-Response-Time: 12ms' for 12.",
      "starter": "def response_time_header(ms):\n    pass",
      "hint": "f'X-Response-Time: {ms}ms'",
      "test": "assert response_time_header(12) == 'X-Response-Time: 12ms' and response_time_header(0) == 'X-Response-Time: 0ms', 'Wrong header'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SWIM Failure Detector",
      "desc": "Write `swim_probe(target, ping, peers, k=2)`. ping(target, via=None) returns normally if the target answers and raises TimeoutError if not. First ping directly: success returns {'status': 'ALIVE', 'method': 'DIRECT'}. If that times out, ask the first k peers (not the target itself) to ping it for you with ping(target, via=peer): if any succeeds return {'status': 'ALIVE', 'method': 'INDIRECT'}, otherwise {'status': 'SUSPECT', 'method': 'INDIRECT'}.",
      "starter": "def swim_probe(target, ping, peers, k=2):\n    pass",
      "hint": "helpers = [p for p in peers if p != target][:k]",
      "test": "asked = []\n\n\ndef make_ping(direct_ok, reachable_via):\n    def ping(target, via=None):\n        asked.append(via)\n        if via is None and direct_ok:\n            return\n        if via is not None and via in reachable_via:\n            return\n        raise TimeoutError('TIMEOUT')\n    return ping\n\n\nassert swim_probe('node_9', make_ping(True, set()), ['node_1']) == {'status': 'ALIVE', 'method': 'DIRECT'}, 'Direct answer'\nasked.clear()\nassert swim_probe('node_9', make_ping(False, set()), ['node_9', 'node_1', 'node_2', 'node_3']) == {'status': 'SUSPECT', 'method': 'INDIRECT'}, 'Nobody reaches it'\nassert asked == [None, 'node_1', 'node_2'], f'Ask only the first 2 other peers, asked {asked}'\nassert swim_probe('node_9', make_ping(False, {'node_2'}), ['node_1', 'node_2']) == {'status': 'ALIVE', 'method': 'INDIRECT'}, 'A peer reaches it: only our link is broken'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Gossip Fanout Picker",
      "desc": "Write `fanout_peers(peers, k=3, me=None)` returning the first k peers, skipping me.",
      "starter": "def fanout_peers(peers, k=3, me=None):\n    pass",
      "hint": "[p for p in peers if p != me][:k]",
      "test": "assert fanout_peers(['n1', 'n2', 'n3', 'n4'], 2) == ['n1', 'n2'], 'First 2 peers'\nassert fanout_peers(['n1', 'n2', 'n3', 'n4'], me='n2') == ['n1', 'n3', 'n4'], 'Never gossip to yourself'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Smooth Weighted Round-Robin",
      "desc": "Complete the nginx-style smooth weighted round-robin balancer. Each server keeps a current weight (starting at 0). next_server(): add each server's weight to its current weight, pick the server with the highest current weight (the first one on a tie), subtract the total of all weights from the picked server, and return its id.",
      "starter": "class WeightedRoundRobin:\n    def __init__(self):\n        self.servers = []  # dicts: {'id', 'weight', 'current'}\n\n    def add_server(self, server_id, weight):\n        pass\n\n    def next_server(self):\n        pass",
      "hint": "best = max(self.servers, key=lambda s: s['current']) keeps the first on a tie.",
      "test": "lb = WeightedRoundRobin()\nlb.add_server('a', 5)\nlb.add_server('b', 1)\nlb.add_server('c', 1)\nseq = [lb.next_server() for _ in range(7)]\nassert seq == ['a', 'a', 'b', 'a', 'c', 'a', 'a'], f'Expected the smooth order a a b a c a a, got {seq}'\ntwo = WeightedRoundRobin()\ntwo.add_server('S1', 5)\ntwo.add_server('S2', 1)\nhits = [two.next_server() for _ in range(12)]\nassert hits.count('S1') == 10 and hits.count('S2') == 2, 'Traffic follows the 5:1 weights'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Least-Connections Picker",
      "desc": "Write `least_connections(servers)` returning the id of the server with the fewest 'active' connections (the first one on a tie). Do not reorder the input list.",
      "starter": "def least_connections(servers):\n    pass",
      "hint": "min(servers, key=lambda s: s['active'])['id']",
      "test": "servers = [{'id': 's1', 'active': 10}, {'id': 's2', 'active': 2}, {'id': 's3', 'active': 2}]\nassert least_connections(servers) == 's2', 'Fewest connections, first on a tie'\nassert [s['id'] for s in servers] == ['s1', 's2', 's3'], 'Do not reorder the list'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Service Registry with Health Leases",
      "desc": "Complete `ServiceRegistry` (times in ms). register(name, instance_id, url, now, ttl_ms=5000) stores the instance with a lease ending at now + ttl_ms. heartbeat(name, instance_id, now) renews the lease (now + its ttl) and returns True, or returns False for an unknown instance. healthy(name, now) returns [{'id', 'url'}] for instances whose lease ends after now, in the order they registered, and forgets the expired ones.",
      "starter": "class ServiceRegistry:\n    def __init__(self):\n        self.services = {}  # name -> {instance_id: {'url', 'ttl_ms', 'expires_at'}}\n\n    def register(self, name, instance_id, url, now, ttl_ms=5000):\n        pass\n\n    def heartbeat(self, name, instance_id, now):\n        pass\n\n    def healthy(self, name, now):\n        pass",
      "hint": "self.services.setdefault(name, {})[instance_id] = {...}",
      "test": "reg = ServiceRegistry()\nreg.register('payment', 'inst-1', 'http://10.0.0.1:8080', now=0, ttl_ms=1000)\nreg.register('payment', 'inst-2', 'http://10.0.0.2:8080', now=0, ttl_ms=500)\nassert [i['id'] for i in reg.healthy('payment', 100)] == ['inst-1', 'inst-2'], 'Both are healthy at first'\nassert reg.heartbeat('payment', 'inst-1', 900) is True, 'Renew inst-1'\nassert reg.healthy('payment', 1200) == [{'id': 'inst-1', 'url': 'http://10.0.0.1:8080'}], 'inst-2 missed its lease; inst-1 was renewed'\nassert 'inst-2' not in reg.services['payment'], 'Forget expired instances'\nassert reg.heartbeat('payment', 'inst-2', 1300) is False, 'An expired instance must register again'\nassert reg.healthy('search', 0) == [], 'Unknown service: nothing'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Instance URL Formatter",
      "desc": "Write `instance_url(ip, port)` returning 'http://IP:PORT'.",
      "starter": "def instance_url(ip, port):\n    pass",
      "hint": "f'http://{ip}:{port}'",
      "test": "assert instance_url('10.0.0.1', 8080) == 'http://10.0.0.1:8080', 'Wrong URL'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "BFF Response Aggregator",
      "desc": "A Backend-for-Frontend stitches several services into one reply. Write `aggregate_profile(user_id, get_user, get_orders, get_reviews)`: call all three with user_id and return {'user_id', 'name', 'recent_orders': the first 3 orders, 'orders_count', 'reviews_count', 'partial': False}. If get_reviews raises, still answer, with 'reviews_count': None and 'partial': True (reviews are optional; users and orders are not).",
      "starter": "def aggregate_profile(user_id, get_user, get_orders, get_reviews):\n    pass",
      "hint": "try: reviews_count = len(get_reviews(user_id)) except Exception: reviews_count, partial = None, True",
      "test": "user = lambda uid: {'id': uid, 'name': 'Alice'}\norders = lambda uid: [{'id': f'o{i}'} for i in range(5)]\nres = aggregate_profile('u_101', user, orders, lambda uid: [{'id': 'r1'}])\nassert res == {'user_id': 'u_101', 'name': 'Alice', 'recent_orders': [{'id': 'o0'}, {'id': 'o1'}, {'id': 'o2'}], 'orders_count': 5, 'reviews_count': 1, 'partial': False}, f'Wrong profile: {res}'\n\n\ndef reviews_down(uid):\n    raise TimeoutError('reviews timed out')\n\n\nres = aggregate_profile('u_101', user, orders, reviews_down)\nassert res['reviews_count'] is None and res['partial'] is True and res['name'] == 'Alice', 'Answer without reviews'\nprint('All checks passed.')"
    },
    "a": {
      "title": "CORS Header Builder",
      "desc": "Write `cors_headers(origin, methods=('GET', 'POST', 'PUT', 'DELETE'))` returning {'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': the methods joined by ','}.",
      "starter": "def cors_headers(origin, methods=('GET', 'POST', 'PUT', 'DELETE')):\n    pass",
      "hint": "','.join(methods)",
      "test": "assert cors_headers('*') == {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE'}, 'Default headers'\nassert cors_headers('https://app.pinit.io', ['GET'])['Access-Control-Allow-Methods'] == 'GET', 'Use the given methods'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "W3C Trace Context Child Span",
      "desc": "A traceparent header looks like '00-TRACEID-PARENTID-01'. Write `child_span(traceparent, name, new_span_id, new_trace_id)`. If the header has 4 parts, keep its trace id and use its span id as the parent; otherwise start a new trace with new_trace_id and parent None. Return {'name', 'trace_id', 'parent_id', 'span_id': new_span_id, 'traceparent': f'00-{trace_id}-{new_span_id}-01'} (the header to send on).",
      "starter": "def child_span(traceparent, name, new_span_id, new_trace_id):\n    pass",
      "hint": "parts = (traceparent or '').split('-')",
      "test": "incoming = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'\nspan = child_span(incoming, 'db_query', 'b7ad6b7169203331', 'ffff')\nassert span == {'name': 'db_query', 'trace_id': '4bf92f3577b34da6a3ce929d0e0e4736', 'parent_id': '00f067aa0ba902b7', 'span_id': 'b7ad6b7169203331', 'traceparent': '00-4bf92f3577b34da6a3ce929d0e0e4736-b7ad6b7169203331-01'}, f'Wrong span: {span}'\nroot = child_span(None, 'http_in', 'aaaa', '1234')\nassert root['trace_id'] == '1234' and root['parent_id'] is None, 'No header: start a new trace'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Traceparent Validator",
      "desc": "Write `is_valid_traceparent(header)` returning True only for '00-' + 32 lowercase hex digits + '-' + 16 lowercase hex digits + '-' + 2 lowercase hex digits.",
      "starter": "import re\n\n\ndef is_valid_traceparent(header):\n    pass",
      "hint": "re.fullmatch(r'00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}', header) is not None",
      "test": "assert is_valid_traceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01') is True, 'A valid header'\nassert is_valid_traceparent('00-short-01') is False, 'Too short'\nassert is_valid_traceparent('00-4BF92F3577B34DA6A3CE929D0E0E4736-00f067aa0ba902b7-01') is False, 'Upper case is not allowed'\nassert is_valid_traceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01x') is False, 'Nothing may follow'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Linearizability Auditor",
      "desc": "Write `audit_linearizability(reads, writes)`. writes are {'value', 'completed_at'}; reads are {'started_at', 'observed'}. A read is stale if some write finished at or before the read started and the read did not see the value of the latest such write. Return {'linearizable': no read is stale, 'stale_reads': the stale reads in order}.",
      "starter": "def audit_linearizability(reads, writes):\n    pass",
      "hint": "before = [w for w in writes if w['completed_at'] <= r['started_at']]; latest = max(before, key=lambda w: w['completed_at'])",
      "test": "writes = [{'value': 'v1', 'completed_at': 100}, {'value': 'v2', 'completed_at': 200}]\ngood = [{'started_at': 250, 'observed': 'v2'}, {'started_at': 150, 'observed': 'v1'}, {'started_at': 50, 'observed': None}]\nassert audit_linearizability(good, writes) == {'linearizable': True, 'stale_reads': []}, 'Every read sees the latest finished write'\nstale = {'started_at': 250, 'observed': 'v1'}\nassert audit_linearizability([stale], writes) == {'linearizable': False, 'stale_reads': [stale]}, 'Seeing v1 after v2 finished is stale'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Consistency Level Describer",
      "desc": "Write `consistency_level(mode)` returning 'Linearizable (global real-time order)' for 'STRONG', 'Causal (cause before effect)' for 'CAUSAL', and 'Eventual (replicas converge)' for 'EVENTUAL'. Anything else raises ValueError.",
      "starter": "def consistency_level(mode):\n    pass",
      "hint": "Use a dict and raise ValueError when the mode is missing.",
      "test": "assert consistency_level('STRONG') == 'Linearizable (global real-time order)', 'STRONG'\nassert consistency_level('CAUSAL') == 'Causal (cause before effect)', 'CAUSAL'\nassert consistency_level('EVENTUAL') == 'Eventual (replicas converge)', 'EVENTUAL'\ntry:\n    consistency_level('MAGIC')\n    raise AssertionError('Unknown modes must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Stale-While-Revalidate Edge Cache",
      "desc": "Write `evaluate_edge_cache(cache_control, age)`. Read max-age and stale-while-revalidate (0 when missing) from a header like 'public, max-age=60, stale-while-revalidate=30'. age <= max-age: {'status': 'FRESH', 'revalidate': False}; age <= max-age + swr: {'status': 'STALE_REVALIDATING', 'revalidate': True} (serve the old copy and refresh in the background); otherwise {'status': 'EXPIRED', 'revalidate': False}.",
      "starter": "import re\n\n\ndef evaluate_edge_cache(cache_control, age):\n    pass",
      "hint": "m = re.search(r'max-age=(\\d+)', cache_control); max_age = int(m.group(1)) if m else 0",
      "test": "h = 'public, max-age=60, stale-while-revalidate=30'\nassert evaluate_edge_cache(h, 30) == {'status': 'FRESH', 'revalidate': False}, 'Within max-age'\nassert evaluate_edge_cache(h, 75) == {'status': 'STALE_REVALIDATING', 'revalidate': True}, 'Within the stale window'\nassert evaluate_edge_cache(h, 100) == {'status': 'EXPIRED', 'revalidate': False}, 'Too old'\nassert evaluate_edge_cache('max-age=10', 11) == {'status': 'EXPIRED', 'revalidate': False}, 'No stale window when it is missing'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Surrogate-Key Header",
      "desc": "CDNs purge pages by tag. Write `surrogate_keys(keys)` returning 'Surrogate-Key: ' + the keys separated by spaces.",
      "starter": "def surrogate_keys(keys):\n    pass",
      "hint": "'Surrogate-Key: ' + ' '.join(keys)",
      "test": "assert surrogate_keys(['k1', 'k2']) == 'Surrogate-Key: k1 k2' and surrogate_keys(['product_9']) == 'Surrogate-Key: product_9', 'Wrong header'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Disaster Recovery RPO/RTO Checker",
      "desc": "Write `dr_compliance(actual_rpo, actual_rto, target_rpo, target_rto)` (minutes). RPO is how much data you can lose, RTO how long you can be down. Return {'compliant': both within target, 'rpo': 'OK' or 'BREACHED', 'rto': 'OK' or 'BREACHED', 'grade': 'TIER_1' if compliant else 'FAILED'}.",
      "starter": "def dr_compliance(actual_rpo, actual_rto, target_rpo, target_rto):\n    pass",
      "hint": "rpo_ok = actual_rpo <= target_rpo",
      "test": "assert dr_compliance(2, 5, 5, 15) == {'compliant': True, 'rpo': 'OK', 'rto': 'OK', 'grade': 'TIER_1'}, 'Within both targets'\nassert dr_compliance(10, 5, 5, 15) == {'compliant': False, 'rpo': 'BREACHED', 'rto': 'OK', 'grade': 'FAILED'}, 'Too much data lost'\nassert dr_compliance(5, 20, 5, 15)['rto'] == 'BREACHED', 'Down for too long'\nprint('All checks passed.')"
    },
    "a": {
      "title": "RTO Formatter",
      "desc": "Write `format_rto(minutes)` returning '15 min RTO' for 15.",
      "starter": "def format_rto(minutes):\n    pass",
      "hint": "f'{minutes} min RTO'",
      "test": "assert format_rto(15) == '15 min RTO' and format_rto(1) == '1 min RTO', 'Wrong format'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Capstone: Global Trade Execution",
      "desc": "Join the course together. Write `execute_trade(order, services)`; services is a dict of functions: is_allowed(account), acquire(account) returning {'success', 'lock_id', 'fencing_token'}, release(account, lock_id), replicate(record) and commit(order) returning a receipt id. In order: rate-limited → {'success': False, 'error': 'RATE_LIMITED'}; lock not acquired → {'success': False, 'error': 'ACCOUNT_LOCKED'}; then replicate {'order_id', 'amount', 'fencing_token'} and commit the order, returning {'success': True, 'receipt': receipt, 'fencing_token': token}. If replicate or commit raises, return {'success': False, 'error': str(error)}. Always release a lock you acquired, even when something fails.",
      "starter": "def execute_trade(order, services):\n    pass",
      "hint": "Put the replicate and commit calls inside try ... finally: services['release'](...)",
      "test": "log = []\n\n\ndef make_services(allowed=True, locked=False, replicate_ok=True):\n    def replicate(record):\n        log.append(('replicate', record))\n        if not replicate_ok:\n            raise RuntimeError('QUORUM_LOST')\n    return {\n        'is_allowed': lambda account: allowed,\n        'acquire': lambda account: {'success': False} if locked else {'success': True, 'lock_id': 'l1', 'fencing_token': 42},\n        'release': lambda account, lock_id: log.append(('release', lock_id)),\n        'replicate': replicate,\n        'commit': lambda order: 'rec_9981',\n    }\n\n\norder = {'account': 'acc_1', 'order_id': 'ord_1', 'amount': 500}\nassert execute_trade(order, make_services()) == {'success': True, 'receipt': 'rec_9981', 'fencing_token': 42}, 'Happy path'\nassert log == [('replicate', {'order_id': 'ord_1', 'amount': 500, 'fencing_token': 42}), ('release', 'l1')], f'Replicate with the token, then release: {log}'\nlog.clear()\nassert execute_trade(order, make_services(allowed=False)) == {'success': False, 'error': 'RATE_LIMITED'} and log == [], 'Stop before locking'\nassert execute_trade(order, make_services(locked=True)) == {'success': False, 'error': 'ACCOUNT_LOCKED'}, 'Someone else holds the lock'\nassert execute_trade(order, make_services(replicate_ok=False)) == {'success': False, 'error': 'QUORUM_LOST'}, 'Replication failed'\nassert log[-1] == ('release', 'l1'), 'Release the lock even when replication fails'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Capstone Certification Auditor",
      "desc": "Write `audit_distributed_capstone(checks)` where checks maps a check name to True (passed) or False. Return {'passed': number passed, 'failed': sorted names that failed, 'certified': True only if every check passed and there is at least one}.",
      "starter": "def audit_distributed_capstone(checks):\n    pass",
      "hint": "failed = sorted(name for name, ok in checks.items() if not ok)",
      "test": "assert audit_distributed_capstone({'raft': True, 'saga': True, 'locks': True}) == {'passed': 3, 'failed': [], 'certified': True}, 'All passed'\nassert audit_distributed_capstone({'raft': True, 'saga': False, 'cache': False}) == {'passed': 1, 'failed': ['cache', 'saga'], 'certified': False}, 'List failed checks, sorted'\nassert audit_distributed_capstone({})['certified'] is False, 'No checks, no certificate'\nprint('All checks passed.')"
    }
  }
];

export const DIST_PYTHON_30_DAYS_CONFIGS: DayConfig[] = DISTRIBUTED_30_DAYS_CONFIGS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const DIST_PYTHON_30_DAYS_QUESTS: CourseQuest[] = DIST_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('dist-py', idx + 1, cfg)
);
