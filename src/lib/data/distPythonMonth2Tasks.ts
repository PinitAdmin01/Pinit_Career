import { buildEnrichedDayQuests, type DayConfig } from './curriculumEnricher';
import type { CourseQuest } from './coursesData';
import { MONTH2_LESSON_INDEX } from './month2LessonIndex';

interface RawM2DayTask {
  day: number;
  fallbackTitle: string;
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

const RAW_M2_DAY_TASKS: RawM2DayTask[] = [
  {
    "day": 31,
    "fallbackTitle": "Lamport Logical Clocks & Total Ordering of Concurrent Events",
    "eTitle": "Lamport Scalar Clock Simulator (`send`/`recv`/`local`)",
    "eDesc": "Implement `LamportNode(node_id: str)`: `local() -> int` increments clock by 1; `send() -> tuple[int, str]` increments clock and emits `(clock, node_id)`; `recv(msg_ts: int) -> int` sets `clock = max(clock, msg_ts) + 1`. Sort event logs by `(ts, node_id)` for total order.",
    "eStarter": "class LamportNode:\n    def __init__(self, node_id: str):\n        # TODO\n        pass\n\n    def local(self) -> int:\n        # TODO\n        pass\n\n    def send(self) -> tuple[int, str]:\n        # TODO\n        pass\n\n    def recv(self, msg_ts: int) -> int:\n        # TODO\n        pass",
    "eHint": "class LamportNode:\n    def __init__(self, node_id: str):\n        self.id = node_id\n        self.clock = 0\n\n    def local(self) -> int:\n        self.clock += 1\n        return self.clock\n\n    def send(self) -> tuple[int, str]:\n        self.clock += 1\n        return (self.clock, self.id)\n\n    def recv(self, msg_ts: int) -> int:\n        self.clock = max(self.clock, msg_ts) + 1\n        return self.clock",
    "eTest": "n1, n2 = LamportNode(\"n1\"), LamportNode(\"n2\")\nassert n1.local() == 1\nts, src = n1.send()\nassert ts == 2 and src == \"n1\"\nassert n2.recv(ts) == 3\nprint('All checks passed.')",
    "aTitle": "Total-Order Broadcast Sequencer via Lamport Tie-Breaking",
    "aDesc": "Write `order_lamport_events(events: list[tuple[int, str, str]]) -> list[str]`: given `(lamport_ts, node_id, payload)` events across nodes, return `payload` strings sorted deterministically by `(lamport_ts, node_id, payload)`.",
    "aStarter": "def order_lamport_events(events: list[tuple[int, str, str]]) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def order_lamport_events(events: list[tuple[int, str, str]]) -> list[str]:\n    return [p for _, _, p in sorted(events, key=lambda e: (e[0], e[1], e[2]))]",
    "aTest": "evs = [(2, \"b\", \"opB\"), (2, \"a\", \"opA\"), (1, \"c\", \"opC\")]\nassert order_lamport_events(evs) == [\"opC\", \"opA\", \"opB\"]\nassert order_lamport_events([(5, \"n1\", \"x\")]) == [\"x\"]\nassert order_lamport_events([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 32,
    "fallbackTitle": "Vector Clocks & Causality Violation Detection Across Replicas",
    "eTitle": "Vector Clock Merge & Concurrent Conflict Detector",
    "eDesc": "Write `compare_vector_clocks(v1: dict[str, int], v2: dict[str, int]) -> str`: across union of node keys (default 0), return `\"EQUAL\"` if equal, `\"BEFORE\"` if `v1 <= v2` elementwise, `\"AFTER\"` if `v1 >= v2`, else `\"CONCURRENT\"`. Also `merge_clocks(v1, v2)` taking elementwise max.",
    "eStarter": "def compare_vector_clocks(v1: dict[str, int], v2: dict[str, int]) -> str:\n    # TODO\n    pass\n\ndef merge_clocks(v1: dict[str, int], v2: dict[str, int]) -> dict[str, int]:\n    # TODO\n    pass",
    "eHint": "def compare_vector_clocks(v1: dict[str, int], v2: dict[str, int]) -> str:\n    keys = set(v1) | set(v2)\n    le = all(v1.get(k, 0) <= v2.get(k, 0) for k in keys)\n    ge = all(v1.get(k, 0) >= v2.get(k, 0) for k in keys)\n    if le and ge:\n        return \"EQUAL\"\n    if le:\n        return \"BEFORE\"\n    if ge:\n        return \"AFTER\"\n    return \"CONCURRENT\"\n\ndef merge_clocks(v1: dict[str, int], v2: dict[str, int]) -> dict[str, int]:\n    keys = set(v1) | set(v2)\n    return {k: max(v1.get(k, 0), v2.get(k, 0)) for k in keys if max(v1.get(k, 0), v2.get(k, 0)) > 0}",
    "eTest": "assert compare_vector_clocks({\"a\": 1, \"b\": 0}, {\"a\": 1, \"b\": 2}) == \"BEFORE\"\nassert compare_vector_clocks({\"a\": 2, \"b\": 1}, {\"a\": 1, \"b\": 2}) == \"CONCURRENT\"\nassert merge_clocks({\"a\": 2, \"b\": 1}, {\"a\": 1, \"c\": 3}) == {\"a\": 2, \"b\": 1, \"c\": 3}\nprint('All checks passed.')",
    "aTitle": "Causal Delivery Hold-Back Queue Buffer",
    "aDesc": "Write `deliver_causal_messages(local_vc: dict[str, int], pending: list[tuple[str, dict[str, int], str]]) -> tuple[list[str], dict[str, int]]`: repeatedly deliver messages `(sender, msg_vc, payload)` eligible iff `msg_vc[sender] == local_vc.get(sender, 0) + 1` and for all `k != sender`, `msg_vc.get(k, 0) <= local_vc.get(k, 0)`. Update `local_vc` upon each delivery.",
    "aStarter": "def deliver_causal_messages(local_vc: dict[str, int], pending: list[tuple[str, dict[str, int], str]]) -> tuple[list[str], dict[str, int]]:\n    # TODO\n    pass",
    "aHint": "def deliver_causal_messages(local_vc: dict[str, int], pending: list[tuple[str, dict[str, int], str]]) -> tuple[list[str], dict[str, int]]:\n    vc = dict(local_vc)\n    q = list(pending)\n    out = []\n    while True:\n        progressed = False\n        for idx, (snd, mvc, pay) in enumerate(q):\n            keys = set(vc) | set(mvc)\n            ok = mvc.get(snd, 0) == vc.get(snd, 0) + 1 and all(mvc.get(k, 0) <= vc.get(k, 0) for k in keys if k != snd)\n            if ok:\n                vc[snd] = mvc[snd]\n                out.append(pay)\n                q.pop(idx)\n                progressed = True\n                break\n        if not progressed:\n            break\n    return out, vc",
    "aTest": "msgs = [(\"B\", {\"A\": 1, \"B\": 1}, \"m2\"), (\"A\", {\"A\": 1}, \"m1\")]\ndeliv, vc = deliver_causal_messages({}, msgs)\nassert deliv == [\"m1\", \"m2\"]\nassert vc == {\"A\": 1, \"B\": 1}\nassert deliver_causal_messages({}, [(\"A\", {\"A\": 2}, \"future\")])[0] == []\nprint('All checks passed.')"
  },
  {
    "day": 33,
    "fallbackTitle": "Hybrid Logical Clocks (HLC) & Bounded Physical Time Drift",
    "eTitle": "Hybrid Logical Clock (HLC) Local & Receive Transition Engine",
    "eDesc": "Implement `HybridLogicalClock()` tracking `(l: int, c: int)`: `send_or_local(pt_ms: int)` advances `old_l = l`, sets `l = max(old_l, pt_ms)`, increments `c = c + 1 if l == old_l else 0`; `recv(msg_l: int, msg_c: int, pt_ms: int)` advances monotonically over `max(old_l, msg_l, pt_ms)` handling tie cases per Kulkarni HLC.",
    "eStarter": "class HybridLogicalClock:\n    def __init__(self):\n        # TODO\n        pass\n\n    def send_or_local(self, pt_ms: int) -> tuple[int, int]:\n        # TODO\n        pass\n\n    def recv(self, msg_l: int, msg_c: int, pt_ms: int) -> tuple[int, int]:\n        # TODO\n        pass",
    "eHint": "class HybridLogicalClock:\n    def __init__(self):\n        self.l = 0\n        self.c = 0\n\n    def send_or_local(self, pt_ms: int) -> tuple[int, int]:\n        old_l = self.l\n        self.l = max(old_l, pt_ms)\n        self.c = (self.c + 1) if self.l == old_l else 0\n        return (self.l, self.c)\n\n    def recv(self, msg_l: int, msg_c: int, pt_ms: int) -> tuple[int, int]:\n        old_l = self.l\n        self.l = max(old_l, msg_l, pt_ms)\n        if self.l == old_l == msg_l:\n            self.c = max(self.c, msg_c) + 1\n        elif self.l == old_l:\n            self.c += 1\n        elif self.l == msg_l:\n            self.c = msg_c + 1\n        else:\n            self.c = 0\n        return (self.l, self.c)",
    "eTest": "h = HybridLogicalClock()\nassert h.send_or_local(100) == (100, 0)\nassert h.send_or_local(95) == (100, 1)\nassert h.recv(100, 5, 98) == (100, 6)\nassert h.recv(100, 9, 150) == (150, 0)\nprint('All checks passed.')",
    "aTitle": "Bounded Skew Uncertainty-Window Read Wait Checker",
    "aDesc": "Write `spantime_uncertainty_ready(commit_ts: int, physical_now: int, max_offset: int) -> tuple[bool, int]`: Spanner/Cockroach uncertainty window safe read requires `physical_now - max_offset >= commit_ts`. Return `(ready, remaining_wait_ms)` (`0` when ready).",
    "aStarter": "def spantime_uncertainty_ready(commit_ts: int, physical_now: int, max_offset: int) -> tuple[bool, int]:\n    # TODO\n    pass",
    "aHint": "def spantime_uncertainty_ready(commit_ts: int, physical_now: int, max_offset: int) -> tuple[bool, int]:\n    wait = max(0, commit_ts - (physical_now - max_offset))\n    return (wait == 0), wait",
    "aTest": "assert spantime_uncertainty_ready(1000, 1005, 10) == (False, 5)\nassert spantime_uncertainty_ready(1000, 1010, 10) == (True, 0)\nassert spantime_uncertainty_ready(900, 1000, 50) == (True, 0)\nprint('All checks passed.')"
  },
  {
    "day": 34,
    "fallbackTitle": "Gossip Protocols: Epidemic Dissemination & Anti-Entropy Merkle Sync",
    "eTitle": "Deterministic Epidemic Gossip Convergence Simulator",
    "eDesc": "Write `simulate_gossip_rounds(adj: dict[str, list[str]], seed: str, all_nodes: set[str]) -> int`: start `infected = {seed}`; in each round, every already-infected node pushes rumor to all neighbors in `adj[u]`. Return minimum rounds to infect all nodes (`-1` if unreachable).",
    "eStarter": "def simulate_gossip_rounds(adj: dict[str, list[str]], seed: str, all_nodes: set[str]) -> int:\n    # TODO\n    pass",
    "eHint": "def simulate_gossip_rounds(adj: dict[str, list[str]], seed: str, all_nodes: set[str]) -> int:\n    if not all_nodes or seed not in all_nodes:\n        return 0 if not all_nodes else -1\n    inf = {seed}\n    rounds = 0\n    while not all_nodes.issubset(inf):\n        nxt = set(inf)\n        for u in inf:\n            nxt.update(adj.get(u, []))\n        if len(nxt) == len(inf):\n            return -1\n        inf = nxt\n        rounds += 1\n    return rounds",
    "eTest": "g = {\"A\": [\"B\"], \"B\": [\"C\", \"D\"], \"C\": [], \"D\": []}\nassert simulate_gossip_rounds(g, \"A\", {\"A\", \"B\", \"C\", \"D\"}) == 2\nassert simulate_gossip_rounds(g, \"A\", {\"A\", \"B\", \"E\"}) == -1\nassert simulate_gossip_rounds({\"A\": []}, \"A\", {\"A\"}) == 0\nprint('All checks passed.')",
    "aTitle": "Merkle Anti-Entropy Range Digest Diff Finder",
    "aDesc": "Write `diff_merkle_buckets(local_kv: dict[int, str], remote_kv: dict[int, str], num_buckets: int = 4) -> list[int]`: hash sorted `(k, v)` pairs per `bucket = k % num_buckets` with SHA-256 and return sorted divergent keys within mismatched buckets.",
    "aStarter": "import hashlib\n\ndef diff_merkle_buckets(local_kv: dict[int, str], remote_kv: dict[int, str], num_buckets: int = 4) -> list[int]:\n    # TODO\n    pass",
    "aHint": "import hashlib\n\ndef diff_merkle_buckets(local_kv: dict[int, str], remote_kv: dict[int, str], num_buckets: int = 4) -> list[int]:\n    def bhash(kv, b):\n        items = sorted((k, v) for k, v in kv.items() if k % num_buckets == b)\n        return hashlib.sha256(repr(items).encode()).hexdigest()\n    diff_keys = []\n    for b in range(num_buckets):\n        if bhash(local_kv, b) != bhash(remote_kv, b):\n            ks = {k for k in (set(local_kv) | set(remote_kv)) if k % num_buckets == b}\n            for k in ks:\n                if local_kv.get(k) != remote_kv.get(k):\n                    diff_keys.append(k)\n    return sorted(diff_keys)",
    "aTest": "assert diff_merkle_buckets({1: \"a\", 2: \"b\"}, {1: \"a\", 2: \"c\", 5: \"x\"}, 4) == [2, 5]\nassert diff_merkle_buckets({1: \"a\"}, {1: \"a\"}, 4) == []\nassert diff_merkle_buckets({}, {3: \"z\"}, 2) == [3]\nprint('All checks passed.')"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7: Causal Ordering & Epidemic Cluster Membership Engine",
    "eTitle": "Milestone 7A: LWW-Element-Set CRDT with HLC Conflict Winner",
    "eDesc": "Write `merge_hlc_lww(rep_a: dict[str, tuple[str, int, int]], rep_b: dict[str, tuple[str, int, int]]) -> dict[str, tuple[str, int, int]]`: for each key keep `(value, hlc_l, hlc_c)` having highest `(hlc_l, hlc_c, value)`.",
    "eStarter": "def merge_hlc_lww(rep_a: dict[str, tuple[str, int, int]], rep_b: dict[str, tuple[str, int, int]]) -> dict[str, tuple[str, int, int]]:\n    # TODO\n    pass",
    "eHint": "def merge_hlc_lww(rep_a: dict[str, tuple[str, int, int]], rep_b: dict[str, tuple[str, int, int]]) -> dict[str, tuple[str, int, int]]:\n    out = dict(rep_a)\n    for k, tup in rep_b.items():\n        if k not in out or (tup[1], tup[2], tup[0]) > (out[k][1], out[k][2], out[k][0]):\n            out[k] = tup\n    return out",
    "eTest": "a = {\"k1\": (\"v1\", 10, 0), \"k2\": (\"v2\", 12, 1)}\nb = {\"k1\": (\"v1b\", 10, 1), \"k3\": (\"v3\", 5, 0)}\nassert merge_hlc_lww(a, b) == {\"k1\": (\"v1b\", 10, 1), \"k2\": (\"v2\", 12, 1), \"k3\": (\"v3\", 5, 0)}\nassert merge_hlc_lww({\"x\": (\"a\", 1, 0)}, {\"x\": (\"b\", 1, 0)}) == {\"x\": (\"b\", 1, 0)}\nassert merge_hlc_lww({}, {}) == {}\nprint('All checks passed.')",
    "aTitle": "Milestone 7B: Membership Epoch + Digest Anti-Entropy Delta Sync",
    "aDesc": "Write `compute_gossip_deltas(local_versions: dict[str, int], peer_versions: dict[str, int]) -> dict`: partition sorted keys into `\"push\"` (local strictly newer than peer), `\"pull\"` (peer strictly newer than local), and `\"in_sync\"` (equal versions).",
    "aStarter": "def compute_gossip_deltas(local_versions: dict[str, int], peer_versions: dict[str, int]) -> dict:\n    # TODO\n    pass",
    "aHint": "def compute_gossip_deltas(local_versions: dict[str, int], peer_versions: dict[str, int]) -> dict:\n    push, pull, sync = [], [], []\n    for k in sorted(set(local_versions) | set(peer_versions)):\n        lv, pv = local_versions.get(k, -1), peer_versions.get(k, -1)\n        if lv > pv:\n            push.append(k)\n        elif pv > lv:\n            pull.append(k)\n        else:\n            sync.append(k)\n    return {\"push\": push, \"pull\": pull, \"in_sync\": sync}",
    "aTest": "assert compute_gossip_deltas({\"n1\": 3, \"n2\": 1}, {\"n1\": 2, \"n2\": 1, \"n3\": 5}) == {\"push\": [\"n1\"], \"pull\": [\"n3\"], \"in_sync\": [\"n2\"]}\nassert compute_gossip_deltas({\"a\": 1}, {\"a\": 1}) == {\"push\": [], \"pull\": [], \"in_sync\": [\"a\"]}\nassert compute_gossip_deltas({}, {}) == {\"push\": [], \"pull\": [], \"in_sync\": []}\nprint('All checks passed.')"
  },
  {
    "day": 36,
    "fallbackTitle": "SWIM Failure Detector: Ping, Ping-Req & Suspicion Lifecycles",
    "eTitle": "SWIM Membership Suspicion Timeout State Machine",
    "eDesc": "Implement `SWIMMembership(suspect_ttl: int)`: track `{node: (state, incarnation, since_ts)}` (`ALIVE`, `SUSPECT`, `DEAD`); `apply(event_type, node, inc, ts)` handles `SUSPECT`/`ALIVE`/`DEAD` updates (refuting stale suspicion when `ALIVE` arrives with higher incarnation, ignoring stale incarnations); `sweep_dead(now_ts)` transitions expired suspects (`now_ts - since_ts >= suspect_ttl`) to `DEAD`.",
    "eStarter": "class SWIMMembership:\n    def __init__(self, suspect_ttl: int):\n        # TODO\n        pass\n\n    def apply(self, state: str, node: str, inc: int, ts: int):\n        # TODO\n        pass\n\n    def sweep_dead(self, now_ts: int) -> dict[str, str]:\n        # TODO\n        pass",
    "eHint": "class SWIMMembership:\n    def __init__(self, suspect_ttl: int):\n        self.ttl = suspect_ttl\n        self.members = {}\n\n    def apply(self, state: str, node: str, inc: int, ts: int):\n        cur = self.members.get(node)\n        if cur is None:\n            self.members[node] = (state, inc, ts)\n            return\n        c_st, c_inc, _ = cur\n        if c_st == \"DEAD\":\n            return\n        if inc > c_inc or (inc == c_inc and state in (\"SUSPECT\", \"DEAD\") and c_st == \"ALIVE\"):\n            self.members[node] = (state, inc, ts)\n\n    def sweep_dead(self, now_ts: int) -> dict[str, str]:\n        for n, (st, inc, ts) in list(self.members.items()):\n            if st == \"SUSPECT\" and now_ts - ts >= self.ttl:\n                self.members[n] = (\"DEAD\", inc, ts)\n        return {n: v[0] for n, v in self.members.items()}",
    "eTest": "sw = SWIMMembership(50)\nsw.apply(\"ALIVE\", \"n1\", 1, 0); sw.apply(\"SUSPECT\", \"n1\", 1, 10)\nassert sw.sweep_dead(30) == {\"n1\": \"SUSPECT\"}\nsw.apply(\"ALIVE\", \"n1\", 2, 35)\nassert sw.sweep_dead(100) == {\"n1\": \"ALIVE\"}\nsw.apply(\"SUSPECT\", \"n1\", 2, 110)\nassert sw.sweep_dead(160) == {\"n1\": \"DEAD\"}\nprint('All checks passed.')",
    "aTitle": "SWIM Ping + Indirect Ping-Req Decision Evaluator",
    "aDesc": "Write `evaluate_swim_probe(direct_ack: bool, indirect_acks: list[bool]) -> str`: return `\"ALIVE\"` if `direct_ack or any(indirect_acks)`, else `\"SUSPECT\"`.",
    "aStarter": "def evaluate_swim_probe(direct_ack: bool, indirect_acks: list[bool]) -> str:\n    # TODO\n    pass",
    "aHint": "def evaluate_swim_probe(direct_ack: bool, indirect_acks: list[bool]) -> str:\n    return \"ALIVE\" if (direct_ack or any(indirect_acks)) else \"SUSPECT\"",
    "aTest": "assert evaluate_swim_probe(True, []) == \"ALIVE\"\nassert evaluate_swim_probe(False, [False, True, False]) == \"ALIVE\"\nassert evaluate_swim_probe(False, [False, False]) == \"SUSPECT\"\nprint('All checks passed.')"
  },
  {
    "day": 37,
    "fallbackTitle": "Phi Accrual Failure Detection: Adaptive Heartbeat Inter-Arrival Modeling",
    "eTitle": "Gaussian Phi Accrual Heartbeat Suspect Detector (`phi(t)`)",
    "eDesc": "Write `compute_phi(intervals_ms: list[float], elapsed_since_last_ms: float) -> float`: compute sample mean and population std (floored at `1.0`) of `intervals_ms`; compute tail probability `p = 0.5 * (1 - math.erf((elapsed - mean) / (std * sqrt(2))))` clamped >= `1e-12`, returning `round(-math.log10(p), 4)` (`0.0` if history empty).",
    "eStarter": "import math\n\ndef compute_phi(intervals_ms: list[float], elapsed_since_last_ms: float) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef compute_phi(intervals_ms: list[float], elapsed_since_last_ms: float) -> float:\n    if not intervals_ms:\n        return 0.0\n    mu = sum(intervals_ms) / len(intervals_ms)\n    sd = max(1.0, math.sqrt(sum((x - mu) ** 2 for x in intervals_ms) / len(intervals_ms)))\n    p = max(1e-12, 0.5 * math.erfc((elapsed_since_last_ms - mu) / (sd * math.sqrt(2.0))))\n    return round(-math.log10(p), 4)",
    "eTest": "hist = [100.0, 102.0, 98.0, 100.0]\nassert abs(compute_phi(hist, 100.0) - 0.301) < 1e-3\nassert compute_phi(hist, 120.0) > 8.0\nassert compute_phi([], 500.0) == 0.0\nprint('All checks passed.')",
    "aTitle": "Sliding Window Adaptive Phi Threshold Controller",
    "aDesc": "Implement `PhiDetector(window_size: int, phi_threshold: float)`: `heartbeat(ts_ms: int)` appends delta `ts_ms - last_ts` into bounded history; `is_available(now_ts: int) -> bool` returns `True` if fewer than 2 beats or `phi < phi_threshold` (std floored at `10.0`).",
    "aStarter": "import math\nfrom collections import deque\n\nclass PhiDetector:\n    def __init__(self, window_size: int, phi_threshold: float):\n        # TODO\n        pass\n\n    def heartbeat(self, ts_ms: int):\n        # TODO\n        pass\n\n    def is_available(self, now_ts: int) -> bool:\n        # TODO\n        pass",
    "aHint": "import math\nfrom collections import deque\n\nclass PhiDetector:\n    def __init__(self, window_size: int, phi_threshold: float):\n        self.thresh = phi_threshold\n        self.win = deque(maxlen=window_size)\n        self.last = None\n\n    def heartbeat(self, ts_ms: int):\n        if self.last is not None:\n            self.win.append(float(ts_ms - self.last))\n        self.last = ts_ms\n\n    def is_available(self, now_ts: int) -> bool:\n        if self.last is None or not self.win:\n            return True\n        mu = sum(self.win) / len(self.win)\n        sd = max(10.0, math.sqrt(sum((x - mu) ** 2 for x in self.win) / len(self.win)))\n        p = max(1e-12, 0.5 * math.erfc(((now_ts - self.last) - mu) / (sd * math.sqrt(2.0))))\n        return (-math.log10(p)) < self.thresh",
    "aTest": "pd = PhiDetector(5, 8.0)\nfor t in [0, 100, 200, 300]: pd.heartbeat(t)\nassert pd.is_available(350) is True\nassert pd.is_available(500) is False\nassert PhiDetector(5, 8.0).is_available(1000) is True\nprint('All checks passed.')"
  },
  {
    "day": 38,
    "fallbackTitle": "Split-Brain Prevention: Quorum Leases, Fencing Tokens & Epoch Numbers",
    "eTitle": "Monotonic Fencing-Token Storage Gatekeeper",
    "eDesc": "Implement `FencedStorage()`: `write(key: str, val: str, token: int) -> bool` rejects any request whose `token < max_seen_token` (preventing zombie leader stale writes across partitions!), updating `max_seen_token` and storing `val` otherwise.",
    "eStarter": "class FencedStorage:\n    def __init__(self):\n        # TODO\n        pass\n\n    def write(self, key: str, val: str, token: int) -> bool:\n        # TODO\n        pass",
    "eHint": "class FencedStorage:\n    def __init__(self):\n        self.max_token = 0\n        self.data = {}\n\n    def write(self, key: str, val: str, token: int) -> bool:\n        if token < self.max_token:\n            return False\n        self.max_token = token\n        self.data[key] = val\n        return True",
    "eTest": "st = FencedStorage()\nassert st.write(\"k\", \"v1\", 5) is True\nassert st.write(\"k\", \"v_zombie\", 3) is False\nassert st.data[\"k\"] == \"v1\"\nassert st.write(\"k\", \"v2\", 5) is True\nprint('All checks passed.')",
    "aTitle": "Bounded-Skew Quorum Lease Acquisition & Renewal Gate",
    "aDesc": "Write `quorum_lease_holder(votes: list[tuple[str, int, int]], cluster_size: int, now_ts: int) -> str | None`: each node grants `(holder, lease_expiry_ts, epoch)` for highest epoch; a leader holds a valid lease iff `>= (cluster_size // 2 + 1)` nodes still have `lease_expiry_ts > now_ts` for the SAME `(holder, max_epoch)`.",
    "aStarter": "def quorum_lease_holder(votes: list[tuple[str, int, int]], cluster_size: int, now_ts: int):\n    # TODO\n    pass",
    "aHint": "from collections import Counter\n\ndef quorum_lease_holder(votes: list[tuple[str, int, int]], cluster_size: int, now_ts: int):\n    valid = [(h, exp, ep) for h, exp, ep in votes if exp > now_ts]\n    if not valid:\n        return None\n    top_ep = max(ep for _, _, ep in valid)\n    cnt = Counter(h for h, _, ep in valid if ep == top_ep)\n    q = cluster_size // 2 + 1\n    for h, c in cnt.items():\n        if c >= q:\n            return h\n    return None",
    "aTest": "vs = [(\"n1\", 200, 4), (\"n1\", 200, 4), (\"n2\", 250, 3)]\nassert quorum_lease_holder(vs, 3, 150) == \"n1\"\nassert quorum_lease_holder(vs, 3, 210) is None\nassert quorum_lease_holder([(\"n1\", 200, 4)], 3, 100) is None\nprint('All checks passed.')"
  },
  {
    "day": 39,
    "fallbackTitle": "Raft Log Replication: AppendEntries Consistency Check & Commit Index Advancement",
    "eTitle": "Raft Follower `AppendEntries` Prefix Match & Conflict Truncation",
    "eDesc": "Write `raft_append_entries(log: list[dict], prev_idx: int, prev_term: int, entries: list[dict]) -> tuple[bool, list[dict]]`: log uses 0-based indexing (`prev_idx = -1` skips prefix check). Reject `(False, log)` if `prev_idx >= len(log)` or (`prev_idx >= 0` and `log[prev_idx][\"term\"] != prev_term`). Otherwise slice conflicting suffix from `prev_idx + 1` onward when terms diverge and append new entries.",
    "eStarter": "def raft_append_entries(log: list[dict], prev_idx: int, prev_term: int, entries: list[dict]) -> tuple[bool, list[dict]]:\n    # TODO\n    pass",
    "eHint": "def raft_append_entries(log: list[dict], prev_idx: int, prev_term: int, entries: list[dict]) -> tuple[bool, list[dict]]:\n    if prev_idx >= len(log) or (prev_idx >= 0 and log[prev_idx][\"term\"] != prev_term):\n        return False, list(log)\n    out = list(log)\n    idx = prev_idx + 1\n    for j, ent in enumerate(entries):\n        pos = idx + j\n        if pos < len(out):\n            if out[pos][\"term\"] != ent[\"term\"]:\n                out = out[:pos] + entries[j:]\n                break\n        else:\n            out.extend(entries[j:])\n            break\n    return True, out",
    "eTest": "lg = [{\"term\": 1, \"cmd\": \"a\"}, {\"term\": 1, \"cmd\": \"b\"}]\nok, lg2 = raft_append_entries(lg, 0, 1, [{\"term\": 2, \"cmd\": \"c\"}])\nassert ok is True and lg2 == [{\"term\": 1, \"cmd\": \"a\"}, {\"term\": 2, \"cmd\": \"c\"}]\nassert raft_append_entries(lg, 1, 2, [])[0] is False\nassert raft_append_entries([], -1, 0, [{\"term\": 1, \"cmd\": \"x\"}]) == (True, [{\"term\": 1, \"cmd\": \"x\"}])\nprint('All checks passed.')",
    "aTitle": "Raft Leader Quorum `commitIndex` Advancement Safety Rule",
    "aDesc": "Write `advance_commit_index(match_indices: list[int], log_terms: list[int], current_term: int, commit_idx: int) -> int`: per Raft §5.4.2, advance `commit_idx` to highest `N > commit_idx` replicated on a majority (including leader -> sort all `match_indices`, pick median) SUCH THAT `log_terms[N] == current_term`!",
    "aStarter": "def advance_commit_index(match_indices: list[int], log_terms: list[int], current_term: int, commit_idx: int) -> int:\n    # TODO\n    pass",
    "aHint": "def advance_commit_index(match_indices: list[int], log_terms: list[int], current_term: int, commit_idx: int) -> int:\n    maj = sorted(match_indices)[(len(match_indices) - 1) // 2]\n    best = commit_idx\n    for n in range(commit_idx + 1, min(maj + 1, len(log_terms))):\n        if log_terms[n] == current_term:\n            best = n\n    return best",
    "aTest": "assert advance_commit_index([3, 3, 1], [1, 1, 2, 2], 2, 0) == 3\nassert advance_commit_index([3, 2, 0], [1, 1, 1, 2], 2, 0) == 0\nassert advance_commit_index([2, 2, 2], [1, 2, 2], 2, 1) == 2\nprint('All checks passed.')"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8: Consensus Replication & Fencing Token Safety Kernel",
    "eTitle": "Milestone 8A: Raft Candidate RequestVote Log Freshness Gate",
    "eDesc": "Write `grant_raft_vote(voter_term: int, voted_for: str | None, cand_id: str, cand_term: int, cand_last_term: int, cand_last_idx: int, local_last_term: int, local_last_idx: int) -> bool`: grant vote iff `cand_term >= voter_term`, `(voted_for is None or voted_for == cand_id)` (reset if `cand_term > voter_term`), and `(cand_last_term, cand_last_idx) >= (local_last_term, local_last_idx)`.",
    "eStarter": "def grant_raft_vote(voter_term: int, voted_for, cand_id: str, cand_term: int, cand_last_term: int, cand_last_idx: int, local_last_term: int, local_last_idx: int) -> bool:\n    # TODO\n    pass",
    "eHint": "def grant_raft_vote(voter_term: int, voted_for, cand_id: str, cand_term: int, cand_last_term: int, cand_last_idx: int, local_last_term: int, local_last_idx: int) -> bool:\n    if cand_term < voter_term:\n        return False\n    vf = None if cand_term > voter_term else voted_for\n    if vf is not None and vf != cand_id:\n        return False\n    return (cand_last_term, cand_last_idx) >= (local_last_term, local_last_idx)",
    "eTest": "assert grant_raft_vote(2, \"other\", \"c1\", 3, 2, 5, 2, 4) is True\nassert grant_raft_vote(3, \"other\", \"c1\", 3, 3, 5, 2, 4) is False\nassert grant_raft_vote(2, None, \"c1\", 2, 1, 9, 2, 1) is False\nprint('All checks passed.')",
    "aTitle": "Milestone 8B: Fenced Consensus Replicated State Machine Coordinator",
    "aDesc": "Write `apply_fenced_raft_batch(log: list[tuple[int, str, str]], commit_idx: int, min_term: int) -> dict`: apply entries `(term, key, val)` with `0 <= idx <= commit_idx` iff `term >= min_term`, advancing `min_term` greedily and rejecting stale-term entries into `\"rejected_indices\"`.",
    "aStarter": "def apply_fenced_raft_batch(log: list[tuple[int, str, str]], commit_idx: int, min_term: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def apply_fenced_raft_batch(log: list[tuple[int, str, str]], commit_idx: int, min_term: int) -> dict:\n    kv = {}\n    rej = []\n    cur_t = min_term\n    for i in range(min(commit_idx + 1, len(log))):\n        t, k, v = log[i]\n        if t < cur_t:\n            rej.append(i)\n        else:\n            cur_t = t\n            kv[k] = v\n    return {\"state\": kv, \"rejected_indices\": rej, \"term\": cur_t}",
    "aTest": "lg = [(3, \"a\", \"1\"), (2, \"a\", \"stale\"), (4, \"b\", \"2\"), (4, \"c\", \"3\")]\nassert apply_fenced_raft_batch(lg, 2, 1) == {\"state\": {\"a\": \"1\", \"b\": \"2\"}, \"rejected_indices\": [1], \"term\": 4}\nassert apply_fenced_raft_batch(lg, -1, 1) == {\"state\": {}, \"rejected_indices\": [], \"term\": 1}\nassert apply_fenced_raft_batch([], 5, 1) == {\"state\": {}, \"rejected_indices\": [], \"term\": 1}\nprint('All checks passed.')"
  },
  {
    "day": 41,
    "fallbackTitle": "Raft Log Compaction, Snapshotting & InstallSnapshot Chunk Streaming",
    "eTitle": "Snapshot Prefix Compactor & Virtual Log Index Translator",
    "eDesc": "Implement `CompactedLog(entries: list[str], snapshot_idx: int, snapshot_term: int)`: `truncate_up_to(idx: int, term: int)` drops prefix through logical `idx` cleanly (`entries` sliced from `(idx - snapshot_idx)`), and `get(logical_idx: int)` returns `\"SNAPSHOT\"` if `logical_idx <= snapshot_idx`, entry if in tail, else `None`.",
    "eStarter": "class CompactedLog:\n    def __init__(self, entries: list[str], snapshot_idx: int = -1, snapshot_term: int = 0):\n        # TODO\n        pass\n\n    def truncate_up_to(self, idx: int, term: int):\n        # TODO\n        pass\n\n    def get(self, logical_idx: int):\n        # TODO\n        pass",
    "eHint": "class CompactedLog:\n    def __init__(self, entries: list[str], snapshot_idx: int = -1, snapshot_term: int = 0):\n        self.tail = list(entries)\n        self.snap_idx = snapshot_idx\n        self.snap_term = snapshot_term\n\n    def truncate_up_to(self, idx: int, term: int):\n        drop = idx - self.snap_idx\n        if drop > 0:\n            self.tail = self.tail[drop:]\n            self.snap_idx = idx\n            self.snap_term = term\n\n    def get(self, logical_idx: int):\n        if logical_idx <= self.snap_idx:\n            return \"SNAPSHOT\"\n        off = logical_idx - self.snap_idx - 1\n        return self.tail[off] if 0 <= off < len(self.tail) else None",
    "eTest": "cl = CompactedLog([\"c0\", \"c1\", \"c2\", \"c3\"])\ncl.truncate_up_to(1, 2)\nassert cl.get(1) == \"SNAPSHOT\"\nassert cl.get(2) == \"c2\" and cl.get(5) is None\ncl.truncate_up_to(2, 3)\nassert cl.get(2) == \"SNAPSHOT\" and cl.get(3) == \"c3\"\nprint('All checks passed.')",
    "aTitle": "Out-of-Order `InstallSnapshot` Chunk Reassembler & Done Marker",
    "aDesc": "Implement `SnapshotAssembler(expected_idx: int)`: `push_chunk(offset: int, data: bytes, done: bool) -> bytes | None` accepts snapshot chunks at byte offsets, tracking highest `done` boundary `total_len` and returning full contiguous bytes once `[0..total_len)` is completely filled (`None` while incomplete).",
    "aStarter": "class SnapshotAssembler:\n    def __init__(self, expected_idx: int):\n        # TODO\n        pass\n\n    def push_chunk(self, offset: int, data: bytes, done: bool):\n        # TODO\n        pass",
    "aHint": "class SnapshotAssembler:\n    def __init__(self, expected_idx: int):\n        self.idx = expected_idx\n        self.buf = {}\n        self.total = None\n\n    def push_chunk(self, offset: int, data: bytes, done: bool):\n        for i, b in enumerate(data):\n            self.buf[offset + i] = b\n        if done:\n            self.total = offset + len(data)\n        if self.total is not None and len(self.buf) >= self.total and all(i in self.buf for i in range(self.total)):\n            return bytes(self.buf[i] for i in range(self.total))\n        return None",
    "aTest": "sa = SnapshotAssembler(50)\nassert sa.push_chunk(3, b\"lo!\", True) is None\nassert sa.push_chunk(0, b\"hel\", False) == b\"hello!\"\nassert SnapshotAssembler(1).push_chunk(0, b\"\", True) == b\"\"\nprint('All checks passed.')"
  },
  {
    "day": 42,
    "fallbackTitle": "Two-Phase Commit (2PC) Coordinator Recovery & Blocking Hazard Analysis",
    "eTitle": "WAL-Backed 2PC Prepare/Commit Coordinator Decision Solver",
    "eDesc": "Write `decide_2pc(votes: dict[str, bool], total_parts: int, timed_out: bool) -> str`: commit (`\"GLOBAL_COMMIT\"`) iff `not timed_out` and `len(votes) == total_parts` and `all(votes.values())`, else `\"GLOBAL_ABORT\"`.",
    "eStarter": "def decide_2pc(votes: dict[str, bool], total_parts: int, timed_out: bool) -> str:\n    # TODO\n    pass",
    "eHint": "def decide_2pc(votes: dict[str, bool], total_parts: int, timed_out: bool) -> str:\n    if not timed_out and len(votes) == total_parts and all(votes.values()):\n        return \"GLOBAL_COMMIT\"\n    return \"GLOBAL_ABORT\"",
    "eTest": "assert decide_2pc({\"p1\": True, \"p2\": True}, 2, False) == \"GLOBAL_COMMIT\"\nassert decide_2pc({\"p1\": True, \"p2\": False}, 2, False) == \"GLOBAL_ABORT\"\nassert decide_2pc({\"p1\": True}, 2, True) == \"GLOBAL_ABORT\"\nprint('All checks passed.')",
    "aTitle": "2PC Participant Crash-Recovery Presumed-Abort Action Solver",
    "aDesc": "Write `recover_2pc_participant(wal_records: list[str]) -> str`: examine ordered WAL entries (`\"PREPARE\"`, `\"COMMIT\"`, `\"ABORT\"`). Return `\"COMMIT\"` if `\"COMMIT\"` in log, `\"ABORT\"` if `\"ABORT\"` or `\"PREPARE\"` absent (presumed abort!), and `\"BLOCKED_UNCERTAIN\"` if `\"PREPARE\"` is logged with neither `\"COMMIT\"` nor `\"ABORT\"`.",
    "aStarter": "def recover_2pc_participant(wal_records: list[str]) -> str:\n    # TODO\n    pass",
    "aHint": "def recover_2pc_participant(wal_records: list[str]) -> str:\n    s = set(wal_records)\n    if \"COMMIT\" in s:\n        return \"COMMIT\"\n    if \"ABORT\" in s or \"PREPARE\" not in s:\n        return \"ABORT\"\n    return \"BLOCKED_UNCERTAIN\"",
    "aTest": "assert recover_2pc_participant([\"PREPARE\", \"COMMIT\"]) == \"COMMIT\"\nassert recover_2pc_participant([\"PREPARE\"]) == \"BLOCKED_UNCERTAIN\"\nassert recover_2pc_participant([]) == \"ABORT\"\nprint('All checks passed.')"
  },
  {
    "day": 43,
    "fallbackTitle": "Transactional Outbox Pattern & Change Data Capture (CDC) Log Tailing",
    "eTitle": "Idempotent Outbox Relay Publisher with Watermark Offset",
    "eDesc": "Write `relay_outbox_events(rows: list[tuple[int, str, bool]], sent_ids: set[int]) -> tuple[list[tuple[int, str]], int]`: given `(id, payload, published)` rows ordered arbitrarily, relay sorted unpublished unseen `(id, payload)` adding IDs to `sent_ids`, returning `(dispatched, max_processed_id)` (`0` if none).",
    "eStarter": "def relay_outbox_events(rows: list[tuple[int, str, bool]], sent_ids: set[int]) -> tuple[list[tuple[int, str]], int]:\n    # TODO\n    pass",
    "eHint": "def relay_outbox_events(rows: list[tuple[int, str, bool]], sent_ids: set[int]) -> tuple[list[tuple[int, str]], int]:\n    out = []\n    mx = 0\n    for oid, pay, pub in sorted(rows, key=lambda r: r[0]):\n        if not pub and oid not in sent_ids:\n            sent_ids.add(oid)\n            out.append((oid, pay))\n            mx = max(mx, oid)\n    return out, mx",
    "eTest": "seen = {1}\nassert relay_outbox_events([(3, \"e3\", False), (1, \"e1\", False), (2, \"e2\", True)], seen) == ([(3, \"e3\")], 3)\nassert relay_outbox_events([(3, \"e3\", False)], seen) == ([], 0)\nassert relay_outbox_events([], set()) == ([], 0)\nprint('All checks passed.')",
    "aTitle": "CDC LSN-Ordered Upsert/Delete State Rebuilder",
    "aDesc": "Write `apply_cdc_stream(wal_lsn_events: list[tuple[int, str, str, str | None]], last_lsn: int) -> tuple[dict[str, str], int]`: apply `(lsn, op \"UPSERT\"|\"DELETE\", key, val)` with `lsn > last_lsn` in LSN order, returning `(materialized_kv, new_last_lsn)`.",
    "aStarter": "def apply_cdc_stream(wal_lsn_events: list[tuple[int, str, str, str | None]], last_lsn: int) -> tuple[dict[str, str], int]:\n    # TODO\n    pass",
    "aHint": "def apply_cdc_stream(wal_lsn_events: list[tuple[int, str, str, str | None]], last_lsn: int) -> tuple[dict[str, str], int]:\n    kv = {}\n    cur = last_lsn\n    for lsn, op, k, v in sorted(wal_lsn_events, key=lambda x: x[0]):\n        if lsn <= cur:\n            continue\n        cur = lsn\n        if op == \"UPSERT\":\n            kv[k] = v\n        elif op == \"DELETE\":\n            kv.pop(k, None)\n    return kv, cur",
    "aTest": "evs = [(12, \"DELETE\", \"a\", None), (10, \"UPSERT\", \"a\", \"1\"), (11, \"UPSERT\", \"b\", \"2\"), (5, \"UPSERT\", \"z\", \"9\")]\nassert apply_cdc_stream(evs, 9) == ({\"b\": \"2\"}, 12)\nassert apply_cdc_stream(evs, 20) == ({}, 20)\nassert apply_cdc_stream([], 0) == ({}, 0)\nprint('All checks passed.')"
  },
  {
    "day": 44,
    "fallbackTitle": "Saga Orchestrator State Machines & Idempotent Compensating Transactions",
    "eTitle": "Backward-Compensating Orchestration Saga Engine",
    "eDesc": "Write `run_saga_steps(steps: list[tuple[str, bool, str]]) -> dict`: step `(action_name, succeeds, comp_name)` executes forward while `succeeds` is True; on first False, abort and emit `compensated` in exact reverse order of already-committed actions. Return `{\"status\": \"COMMITTED\"|\"ROLLED_BACK\", \"executed\": [...], \"compensated\": [...]}`.",
    "eStarter": "def run_saga_steps(steps: list[tuple[str, bool, str]]) -> dict:\n    # TODO\n    pass",
    "eHint": "def run_saga_steps(steps: list[tuple[str, bool, str]]) -> dict:\n    exe = []\n    comps = []\n    for act, ok, cmp_name in steps:\n        if not ok:\n            return {\"status\": \"ROLLED_BACK\", \"executed\": exe, \"compensated\": list(reversed(comps))}\n        exe.append(act)\n        comps.append(cmp_name)\n    return {\"status\": \"COMMITTED\", \"executed\": exe, \"compensated\": []}",
    "eTest": "s = [(\"reserve_inv\", True, \"release_inv\"), (\"charge_card\", True, \"refund_card\"), (\"ship_pkg\", False, \"cancel_ship\")]\nassert run_saga_steps(s) == {\"status\": \"ROLLED_BACK\", \"executed\": [\"reserve_inv\", \"charge_card\"], \"compensated\": [\"refund_card\", \"release_inv\"]}\nassert run_saga_steps([(\"a\", True, \"ca\")]) == {\"status\": \"COMMITTED\", \"executed\": [\"a\"], \"compensated\": []}\nassert run_saga_steps([]) == {\"status\": \"COMMITTED\", \"executed\": [], \"compensated\": []}\nprint('All checks passed.')",
    "aTitle": "Idempotent Compensation Log Replay Deduplicator",
    "aDesc": "Write `execute_idempotent_compensations(saga_id: str, comp_ops: list[str], executed_keys: set[str]) -> list[str]`: generate key `f\"{saga_id}:{op}\"` for each op in order; run only keys absent from `executed_keys`, recording them and returning list of newly run `op` names.",
    "aStarter": "def execute_idempotent_compensations(saga_id: str, comp_ops: list[str], executed_keys: set[str]) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def execute_idempotent_compensations(saga_id: str, comp_ops: list[str], executed_keys: set[str]) -> list[str]:\n    ran = []\n    for op in comp_ops:\n        k = f\"{saga_id}:{op}\"\n        if k not in executed_keys:\n            executed_keys.add(k)\n            ran.append(op)\n    return ran",
    "aTest": "done = {\"s1:refund\"}\nassert execute_idempotent_compensations(\"s1\", [\"refund\", \"release\"], done) == [\"release\"]\nassert execute_idempotent_compensations(\"s1\", [\"refund\", \"release\"], done) == []\nassert execute_idempotent_compensations(\"s2\", [\"refund\"], done) == [\"refund\"]\nprint('All checks passed.')"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9: Distributed Transaction & Outbox Saga Coordinator",
    "eTitle": "Milestone 9A: Partition-Safe 2PC vs Saga Escalation Router",
    "eDesc": "Write `route_tx_coordinator(cross_dc_hops: int, locks_allowed: bool, votes_yes: int, total_parts: int) -> dict`: select `\"SAGA\"` if `cross_dc_hops > 1 or not locks_allowed` else `\"2PC\"`, and mark `\"committed\": (mode == \"SAGA\" or votes_yes == total_parts)` when `total_parts > 0`.",
    "eStarter": "def route_tx_coordinator(cross_dc_hops: int, locks_allowed: bool, votes_yes: int, total_parts: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def route_tx_coordinator(cross_dc_hops: int, locks_allowed: bool, votes_yes: int, total_parts: int) -> dict:\n    mode = \"SAGA\" if (cross_dc_hops > 1 or not locks_allowed) else \"2PC\"\n    comm = (votes_yes == total_parts) if mode == \"2PC\" else (votes_yes > 0)\n    return {\"mode\": mode, \"committed\": total_parts > 0 and comm}",
    "eTest": "assert route_tx_coordinator(1, True, 3, 3) == {\"mode\": \"2PC\", \"committed\": True}\nassert route_tx_coordinator(1, True, 2, 3) == {\"mode\": \"2PC\", \"committed\": False}\nassert route_tx_coordinator(3, False, 1, 2) == {\"mode\": \"SAGA\", \"committed\": True}\nprint('All checks passed.')",
    "aTitle": "Milestone 9B: Outbox-Backed Exactly-Once Saga State Transition Engine",
    "aDesc": "Write `process_outbox_saga(steps: list[dict], outbox: set[str]) -> list[str]`: iterate steps `{id, cmd, ok}`; if `ok`, record `cmd` into `outbox` and append `\"EMIT:\" + cmd`; on first failure, emit `\"COMP:\" + cmd` for each previously committed step in reverse skipping any already in `outbox` as `\"COMP:\" + id`.",
    "aStarter": "def process_outbox_saga(steps: list[dict], outbox: set[str]) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def process_outbox_saga(steps: list[dict], outbox: set[str]) -> list[str]:\n    committed, emitted = [], []\n    for st in steps:\n        if not st[\"ok\"]:\n            for sid, scmd in reversed(committed):\n                ck = f\"COMP:{sid}\"\n                if ck not in outbox:\n                    outbox.add(ck)\n                    emitted.append(f\"COMP:{scmd}\")\n            return emitted\n        ek = f\"EMIT:{st['id']}\"\n        if ek not in outbox:\n            outbox.add(ek)\n            emitted.append(f\"EMIT:{st['cmd']}\")\n        committed.append((st[\"id\"], st[\"cmd\"]))\n    return emitted",
    "aTest": "ob = set()\nres = process_outbox_saga([{\"id\": \"1\", \"cmd\": \"pay\", \"ok\": True}, {\"id\": \"2\", \"cmd\": \"ship\", \"ok\": False}], ob)\nassert res == [\"EMIT:pay\", \"COMP:pay\"]\nassert process_outbox_saga([{\"id\": \"1\", \"cmd\": \"pay\", \"ok\": False}], ob) == []\nassert process_outbox_saga([], ob) == []\nprint('All checks passed.')"
  },
  {
    "day": 46,
    "fallbackTitle": "Read-Write Quorums (R + W > N), Sloppy Quorums & Hinted Handoff",
    "eTitle": "Dynamo Quorum Strict-Consistency & Latency Analyzer",
    "eDesc": "Write `check_quorum_config(n: int, r: int, w: int) -> dict`: return `{\"strong_consistency\": r + w > n and w > 0 and r > 0, \"max_node_failures\": min(n - r, n - w), \"overlap\": max(0, r + w - n)}`.",
    "eStarter": "def check_quorum_config(n: int, r: int, w: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def check_quorum_config(n: int, r: int, w: int) -> dict:\n    sc = (r + w > n) and r > 0 and w > 0\n    return {\"strong_consistency\": sc, \"max_node_failures\": min(n - r, n - w), \"overlap\": max(0, r + w - n)}",
    "eTest": "assert check_quorum_config(5, 3, 3) == {\"strong_consistency\": True, \"max_node_failures\": 2, \"overlap\": 1}\nassert check_quorum_config(3, 1, 2)[\"strong_consistency\"] is False\nassert check_quorum_config(3, 2, 2) == {\"strong_consistency\": True, \"max_node_failures\": 1, \"overlap\": 1}\nprint('All checks passed.')",
    "aTitle": "Sloppy Quorum Preference-List Router & Hinted Handoff Drain",
    "aDesc": "Write `sloppy_quorum_write(ring: list[str], pref_start: int, down: set[str], w: int) -> dict`: walk clockwise from `pref_start` around `ring`: assign up to `w` live nodes; any write landing beyond the primary `w` preference positions records `{\"node\": hint_node, \"for\": missed_primary}` in `\"hints\"`. Fail (`accepted: False`) if `< w` live nodes exist.",
    "aStarter": "def sloppy_quorum_write(ring: list[str], pref_start: int, down: set[str], w: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def sloppy_quorum_write(ring: list[str], pref_start: int, down: set[str], w: int) -> dict:\n    n = len(ring)\n    primaries = [ring[(pref_start + i) % n] for i in range(w)]\n    missed = [p for p in primaries if p in down]\n    targets = [p for p in primaries if p not in down]\n    hints = []\n    for off in range(w, n):\n        if len(targets) >= w or not missed:\n            break\n        cand = ring[(pref_start + off) % n]\n        if cand not in down:\n            targets.append(cand)\n            hints.append({\"node\": cand, \"for\": missed.pop(0)})\n    return {\"accepted\": len(targets) == w, \"targets\": targets, \"hints\": hints}",
    "aTest": "r = [\"n0\", \"n1\", \"n2\", \"n3\"]\nassert sloppy_quorum_write(r, 0, {\"n1\"}, 2) == {\"accepted\": True, \"targets\": [\"n0\", \"n2\"], \"hints\": [{\"node\": \"n2\", \"for\": \"n1\"}]}\nassert sloppy_quorum_write(r, 0, set(), 2) == {\"accepted\": True, \"targets\": [\"n0\", \"n1\"], \"hints\": []}\nassert sloppy_quorum_write(r, 0, {\"n1\", \"n2\", \"n3\"}, 2)[\"accepted\"] is False\nprint('All checks passed.')"
  },
  {
    "day": 47,
    "fallbackTitle": "Read Repair & Version Vector Conflict Resolution (Siblings)",
    "eTitle": "Dominated-Sibling Pruner & Read-Repair Generator",
    "eDesc": "Write `resolve_siblings(replicas: list[tuple[str, str, dict[str, int]]]) -> dict`: given `(replica_id, value, vector_clock)`, discard any entry whose vector clock is strictly `<` another replica clock (`BEFORE`), keep concurrent non-dominated siblings sorted by value, and list `repair_replicas` missing a maximal clock.",
    "eStarter": "def resolve_siblings(replicas: list[tuple[str, str, dict[str, int]]]) -> dict:\n    # TODO\n    pass",
    "eHint": "def _dom(a, b):\n    ks = set(a) | set(b)\n    return all(a.get(k, 0) <= b.get(k, 0) for k in ks) and any(a.get(k, 0) < b.get(k, 0) for k in ks)\n\ndef resolve_siblings(replicas: list[tuple[str, str, dict[str, int]]]) -> dict:\n    sibs, stale = [], []\n    for i, (rid, val, vc) in enumerate(replicas):\n        if any(_dom(vc, r2[2]) for j, r2 in enumerate(replicas) if i != j):\n            stale.append(rid)\n        else:\n            sibs.append(val)\n    return {\"siblings\": sorted(set(sibs)), \"repair_replicas\": sorted(stale)}",
    "eTest": "reps = [(\"r1\", \"v1\", {\"a\": 1}), (\"r2\", \"v2\", {\"a\": 2}), (\"r3\", \"v3\", {\"b\": 1})]\nassert resolve_siblings(reps) == {\"siblings\": [\"v2\", \"v3\"], \"repair_replicas\": [\"r1\"]}\nassert resolve_siblings([(\"r1\", \"x\", {\"a\": 2}), (\"r2\", \"x\", {\"a\": 1})]) == {\"siblings\": [\"x\"], \"repair_replicas\": [\"r2\"]}\nassert resolve_siblings([]) == {\"siblings\": [], \"repair_replicas\": []}\nprint('All checks passed.')",
    "aTitle": "Bounded Dotted Version Vector (DVV) Pruner",
    "aDesc": "Write `prune_old_clock_entries(vc_entries: list[tuple[str, int, int]], max_entries: int) -> list[tuple[str, int, int]]`: given `(node_id, counter, last_seen_ts)` entries, retain at most `max_entries` sorted by newest `(last_seen_ts, node_id)`.",
    "aStarter": "def prune_old_clock_entries(vc_entries: list[tuple[str, int, int]], max_entries: int) -> list[tuple[str, int, int]]:\n    # TODO\n    pass",
    "aHint": "def prune_old_clock_entries(vc_entries: list[tuple[str, int, int]], max_entries: int) -> list[tuple[str, int, int]]:\n    if max_entries <= 0:\n        return []\n    return sorted(vc_entries, key=lambda x: (-x[2], x[0]))[:max_entries]",
    "aTest": "ents = [(\"n1\", 4, 10), (\"n2\", 1, 50), (\"n3\", 9, 30)]\nassert prune_old_clock_entries(ents, 2) == [(\"n2\", 1, 50), (\"n3\", 9, 30)]\nassert prune_old_clock_entries(ents, 0) == []\nassert prune_old_clock_entries([], 3) == []\nprint('All checks passed.')"
  },
  {
    "day": 48,
    "fallbackTitle": "LSM-Tree Storage Internals: MemTable, WAL & Size-Tiered SSTable Compaction",
    "eTitle": "LSM MemTable Flush + Multi-SSTable Tombstone Compactor",
    "eDesc": "Write `compact_sstables(sstables: list[dict[str, tuple[int, str | None]]]) -> dict[str, str]`: given SSTables mapping `key -> (seq, value_or_None_tombstone)`, merge picking highest `seq` per key across all SSTables, dropping tombstones (`None`) completely.",
    "eStarter": "def compact_sstables(sstables: list[dict[str, tuple[int, str | None]]]) -> dict[str, str]:\n    # TODO\n    pass",
    "eHint": "def compact_sstables(sstables: list[dict[str, tuple[int, str | None]]]) -> dict[str, str]:\n    latest = {}\n    for sst in sstables:\n        for k, (seq, val) in sst.items():\n            if k not in latest or seq > latest[k][0]:\n                latest[k] = (seq, val)\n    return {k: v for k, (_, v) in latest.items() if v is not None}",
    "eTest": "t0 = {\"a\": (1, \"v1\"), \"b\": (2, \"old\")}\nt1 = {\"a\": (5, None), \"b\": (4, \"new\"), \"c\": (6, \"x\")}\nassert compact_sstables([t0, t1]) == {\"b\": \"new\", \"c\": \"x\"}\nassert compact_sstables([{\"k\": (1, \"v\")}]) == {\"k\": \"v\"}\nassert compact_sstables([]) == {}\nprint('All checks passed.')",
    "aTitle": "Size-Tiered Compaction Trigger & Write-Amplification Estimator",
    "aDesc": "Write `plan_stcs_compaction(sstable_sizes_mb: list[tuple[str, float]], min_bucket: int = 4, ratio: float = 0.5) -> list[str]`: bucket SSTables whose size is within `[0.5 * avg, 1.5 * avg]` sequentially (`ratio=0.5`); return sorted IDs of first eligible bucket reaching `>= min_bucket` SSTables (`[]` if none).",
    "aStarter": "def plan_stcs_compaction(sstable_sizes_mb: list[tuple[str, float]], min_bucket: int = 4, ratio: float = 0.5) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def plan_stcs_compaction(sstable_sizes_mb: list[tuple[str, float]], min_bucket: int = 4, ratio: float = 0.5) -> list[str]:\n    buckets = []\n    for tid, sz in sorted(sstable_sizes_mb, key=lambda x: x[1]):\n        placed = False\n        for b in buckets:\n            avg = sum(s for _, s in b) / len(b)\n            if avg * (1.0 - ratio) <= sz <= avg * (1.0 + ratio):\n                b.append((tid, sz))\n                placed = True\n                break\n        if not placed:\n            buckets.append([(tid, sz)])\n    for b in buckets:\n        if len(b) >= min_bucket:\n            return sorted(tid for tid, _ in b)\n    return []",
    "aTest": "ssts = [(\"s1\", 10), (\"s2\", 11), (\"s3\", 12), (\"s4\", 10), (\"big\", 200)]\nassert plan_stcs_compaction(ssts, 4) == [\"s1\", \"s2\", \"s3\", \"s4\"]\nassert plan_stcs_compaction([(\"s1\", 10), (\"s2\", 500)], 4) == []\nassert plan_stcs_compaction([], 4) == []\nprint('All checks passed.')"
  },
  {
    "day": 49,
    "fallbackTitle": "Bloom Filters & Sparse Indexes for Zero-Disk-Seek Key Lookups",
    "eTitle": "Deterministic Double-Hashed Bloom Filter (`add`/`might_contain`)",
    "eDesc": "Implement `BloomFilter(m_bits: int, k_hashes: int)`: compute two independent 64-bit SHA-256 digests (`h1`, `h2`) for `key`, setting/checking `k_hashes` bit indices `(h1 + i * h2) % m_bits` for `i in range(k_hashes)`.",
    "eStarter": "import hashlib\n\nclass BloomFilter:\n    def __init__(self, m_bits: int, k_hashes: int):\n        # TODO\n        pass\n\n    def add(self, key: str):\n        # TODO\n        pass\n\n    def might_contain(self, key: str) -> bool:\n        # TODO\n        pass",
    "eHint": "import hashlib\n\nclass BloomFilter:\n    def __init__(self, m_bits: int, k_hashes: int):\n        self.m = m_bits\n        self.k = k_hashes\n        self.bits = [0] * m_bits\n\n    def _idxs(self, key: str):\n        dig = hashlib.sha256(key.encode()).digest()\n        h1 = int.from_bytes(dig[:8], \"big\")\n        h2 = int.from_bytes(dig[8:16], \"big\") | 1\n        return [(h1 + i * h2) % self.m for i in range(self.k)]\n\n    def add(self, key: str):\n        for idx in self._idxs(key):\n            self.bits[idx] = 1\n\n    def might_contain(self, key: str) -> bool:\n        return all(self.bits[idx] == 1 for idx in self._idxs(key))",
    "eTest": "bf = BloomFilter(256, 4)\nbf.add(\"user:42\"); bf.add(\"user:99\")\nassert bf.might_contain(\"user:42\") is True and bf.might_contain(\"user:99\") is True\nassert bf.might_contain(\"never_inserted_xyz_123456\") is False\nassert sum(bf.bits) > 0\nprint('All checks passed.')",
    "aTitle": "Sparse SSTable Fence-Pointer Range Index Lookup",
    "aDesc": "Write `sparse_index_block(fence_keys: list[tuple[str, int]], target: str) -> int | None`: given sorted `(first_key_in_block, offset)` fence entries, binary-search (`bisect`) the rightmost entry with `first_key <= target` and return its block byte `offset` (`None` if `target` precedes all entries).",
    "aStarter": "import bisect\n\ndef sparse_index_block(fence_keys: list[tuple[str, int]], target: str):\n    # TODO\n    pass",
    "aHint": "import bisect\n\ndef sparse_index_block(fence_keys: list[tuple[str, int]], target: str):\n    keys = [k for k, _ in fence_keys]\n    pos = bisect.bisect_right(keys, target) - 1\n    return fence_keys[pos][1] if pos >= 0 else None",
    "aTest": "idx = [(\"aa\", 0), (\"mm\", 4096), (\"zz\", 8192)]\nassert sparse_index_block(idx, \"np\") == 4096\nassert sparse_index_block(idx, \"zz\") == 8192\nassert sparse_index_block(idx, \"00\") is None\nprint('All checks passed.')"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10: Quorum KV Storage Engine with LSM Compaction",
    "eTitle": "Milestone 10A: Bloom-Guarded LSM MemTable + SSTable Point Reader",
    "eDesc": "Write `lsm_read_key(memtable: dict[str, str | None], sstables_newest_first: list[dict], key: str) -> str | None`: check `memtable` first (returning `None` immediately on tombstone `None`!); else scan SSTables newest-first checking `\"bloom\"` membership before looking up `data[key]`, updating `\"bloom_skips\"` count? Wait: return exact `(value_or_None, sstables_probed)`.",
    "eStarter": "def lsm_read_key(memtable: dict, sstables_newest_first: list[dict], key: str) -> tuple:\n    # TODO\n    pass",
    "eHint": "def lsm_read_key(memtable: dict, sstables_newest_first: list[dict], key: str) -> tuple:\n    if key in memtable:\n        return memtable[key], 0\n    probed = 0\n    for sst in sstables_newest_first:\n        if key not in sst[\"bloom\"]:\n            continue\n        probed += 1\n        if key in sst[\"data\"]:\n            return sst[\"data\"][key], probed\n    return None, probed",
    "eTest": "s1 = {\"bloom\": {\"k1\", \"k2\"}, \"data\": {\"k1\": None}}\ns2 = {\"bloom\": {\"k1\"}, \"data\": {\"k1\": \"old\"}}\nassert lsm_read_key({\"k1\": \"mem\"}, [s1, s2], \"k1\") == (\"mem\", 0)\nassert lsm_read_key({}, [s1, s2], \"k1\") == (None, 1)\nassert lsm_read_key({}, [s1, s2], \"k99\") == (None, 0)\nprint('All checks passed.')",
    "aTitle": "Milestone 10B: Quorum Read-Repair Merger Over Versioned Replicas",
    "aDesc": "Write `quorum_read_repair(responses: list[tuple[str, int, str]], r_quorum: int) -> dict`: if `len(responses) < r_quorum`, return `{\"ok\": False, \"value\": None, \"repair\": []}`; otherwise choose `(version, val)` with max `(version, val)` and return `repair` listing sorted replica IDs behind winning version.",
    "aStarter": "def quorum_read_repair(responses: list[tuple[str, int, str]], r_quorum: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def quorum_read_repair(responses: list[tuple[str, int, str]], r_quorum: int) -> dict:\n    if len(responses) < r_quorum or not responses:\n        return {\"ok\": False, \"value\": None, \"repair\": []}\n    best_v, best_val = max((ver, val) for _, ver, val in responses)\n    rep = sorted(rid for rid, ver, val in responses if (ver, val) < (best_v, best_val))\n    return {\"ok\": True, \"value\": best_val, \"repair\": rep}",
    "aTest": "res = quorum_read_repair([(\"n1\", 3, \"v3\"), (\"n2\", 2, \"v2\"), (\"n3\", 3, \"v3\")], 2)\nassert res == {\"ok\": True, \"value\": \"v3\", \"repair\": [\"n2\"]}\nassert quorum_read_repair([(\"n1\", 1, \"x\")], 2)[\"ok\"] is False\nassert quorum_read_repair([(\"n1\", 5, \"a\")], 1) == {\"ok\": True, \"value\": \"a\", \"repair\": []}\nprint('All checks passed.')"
  },
  {
    "day": 51,
    "fallbackTitle": "Distributed Rate Limiting: Sliding Window Logs & Token Bucket Redis Scripts",
    "eTitle": "Deterministic Token Bucket Limiter (`refill` + `consume`)",
    "eDesc": "Implement `TokenBucket(capacity: float, refill_per_sec: float)`: start full (`tokens = capacity`, `last_ts = 0.0`). `allow(now_sec: float, cost: float = 1.0) -> bool` refills `min(capacity, tokens + (now_sec - last_ts) * refill_per_sec)` (`last_ts = now_sec`), deducting `cost` if sufficient and returning `True`, else `False`.",
    "eStarter": "class TokenBucket:\n    def __init__(self, capacity: float, refill_per_sec: float):\n        # TODO\n        pass\n\n    def allow(self, now_sec: float, cost: float = 1.0) -> bool:\n        # TODO\n        pass",
    "eHint": "class TokenBucket:\n    def __init__(self, capacity: float, refill_per_sec: float):\n        self.cap = capacity\n        self.rate = refill_per_sec\n        self.tokens = float(capacity)\n        self.last = 0.0\n\n    def allow(self, now_sec: float, cost: float = 1.0) -> bool:\n        dt = max(0.0, now_sec - self.last)\n        self.tokens = min(self.cap, self.tokens + dt * self.rate)\n        self.last = now_sec\n        if self.tokens >= cost:\n            self.tokens -= cost\n            return True\n        return False",
    "eTest": "tb = TokenBucket(3.0, 1.0)\nassert tb.allow(0.0, 2.0) is True and tb.allow(0.0, 2.0) is False\nassert tb.allow(1.0, 2.0) is True\nassert tb.allow(10.0, 3.0) is True and tb.allow(10.0, 1.0) is False\nprint('All checks passed.')",
    "aTitle": "Sliding Window Counter Approx-Log Limiter",
    "aDesc": "Write `sliding_window_counter_allow(prev_count: int, cur_count: int, elapsed_in_cur: float, win_len: float, limit: int) -> bool`: compute weighted estimate `prev_count * ((win_len - elapsed_in_cur) / win_len) + cur_count`; admit new request (`< limit`).",
    "aStarter": "def sliding_window_counter_allow(prev_count: int, cur_count: int, elapsed_in_cur: float, win_len: float, limit: int) -> bool:\n    # TODO\n    pass",
    "aHint": "def sliding_window_counter_allow(prev_count: int, cur_count: int, elapsed_in_cur: float, win_len: float, limit: int) -> bool:\n    w = max(0.0, (win_len - elapsed_in_cur) / win_len)\n    return (prev_count * w + cur_count) < limit",
    "aTest": "assert sliding_window_counter_allow(8, 3, 30.0, 60.0, 8) is True\nassert sliding_window_counter_allow(8, 5, 30.0, 60.0, 8) is False\nassert sliding_window_counter_allow(10, 0, 60.0, 60.0, 1) is True\nprint('All checks passed.')"
  },
  {
    "day": 52,
    "fallbackTitle": "Load Shedding, Adaptive Concurrency Limits (Little's Law) & Priority Queues",
    "eTitle": "Priority-Cohort Load Shedder (`CRITICAL`/`NORMAL`/`BULK`)",
    "eDesc": "Write `shed_load(requests: list[tuple[str, int]], queue_depth: int, soft_cap: int, hard_cap: int) -> dict`: priorities are `0=CRITICAL, 1=NORMAL, 2=BULK`. Below `soft_cap`, accept all; `[soft_cap, hard_cap)`, drop `BULK`; `>= hard_cap`, accept only `CRITICAL`. Return sorted `accepted` and `dropped` IDs.",
    "eStarter": "def shed_load(requests: list[tuple[str, int]], queue_depth: int, soft_cap: int, hard_cap: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def shed_load(requests: list[tuple[str, int]], queue_depth: int, soft_cap: int, hard_cap: int) -> dict:\n    acc, drp = [], []\n    max_p = 0 if queue_depth >= hard_cap else (1 if queue_depth >= soft_cap else 2)\n    for rid, p in requests:\n        (acc if p <= max_p else drp).append(rid)\n    return {\"accepted\": sorted(acc), \"dropped\": sorted(drp)}",
    "eTest": "reqs = [(\"r0\", 0), (\"r1\", 1), (\"r2\", 2)]\nassert shed_load(reqs, 50, 40, 80) == {\"accepted\": [\"r0\", \"r1\"], \"dropped\": [\"r2\"]}\nassert shed_load(reqs, 80, 40, 80) == {\"accepted\": [\"r0\"], \"dropped\": [\"r1\", \"r2\"]}\nassert shed_load(reqs, 10, 40, 80) == {\"accepted\": [\"r0\", \"r1\", \"r2\"], \"dropped\": []}\nprint('All checks passed.')",
    "aTitle": "AIMD Gradient / Little's Law Concurrency Limit Adjuster",
    "aDesc": "Write `aimd_limit_step(limit: int, min_limit: int, max_limit: int, rtt_ms: float, min_rtt_ms: float, had_timeout: bool) -> int`: halve `limit // 2` on `had_timeout` or `rtt_ms > 2 * min_rtt_ms`; else `limit + 1`; clamp to `[min_limit, max_limit]`.",
    "aStarter": "def aimd_limit_step(limit: int, min_limit: int, max_limit: int, rtt_ms: float, min_rtt_ms: float, had_timeout: bool) -> int:\n    # TODO\n    pass",
    "aHint": "def aimd_limit_step(limit: int, min_limit: int, max_limit: int, rtt_ms: float, min_rtt_ms: float, had_timeout: bool) -> int:\n    nxt = (limit // 2) if (had_timeout or rtt_ms > 2.0 * min_rtt_ms) else (limit + 1)\n    return max(min_limit, min(max_limit, nxt))",
    "aTest": "assert aimd_limit_step(20, 4, 100, 12.0, 10.0, False) == 21\nassert aimd_limit_step(20, 4, 100, 25.0, 10.0, False) == 10\nassert aimd_limit_step(4, 4, 100, 10.0, 10.0, True) == 4\nprint('All checks passed.')"
  },
  {
    "day": 53,
    "fallbackTitle": "Tail Latency Amplification: Hedged Requests & Tied Cross-Server Cancellation",
    "eTitle": "Fan-Out Tail Latency Amplification Probabilities (`1 - (1 - p)^N`)",
    "eDesc": "Write `tail_amplification_prob(single_slow_p: float, fanout: int) -> float` computing exact probability `1 - (1 - single_slow_p) ** fanout` that at least 1 leaf call out of `fanout` exceeds SLA, rounded to 6 decimals.",
    "eStarter": "def tail_amplification_prob(single_slow_p: float, fanout: int) -> float:\n    # TODO\n    pass",
    "eHint": "def tail_amplification_prob(single_slow_p: float, fanout: int) -> float:\n    return round(1.0 - (1.0 - single_slow_p) ** max(0, fanout), 6)",
    "eTest": "assert tail_amplification_prob(0.01, 100) == 0.633968\nassert tail_amplification_prob(0.1, 1) == 0.1\nassert tail_amplification_prob(0.0, 50) == 0.0\nprint('All checks passed.')",
    "aTitle": "Hedged Request Delay Simulator & Cost-Savings Calculator",
    "aDesc": "Write `simulate_hedged_call(primary_ms: int, hedge_delay_ms: int, backup_ms: int) -> dict`: if `primary_ms <= hedge_delay_ms`, backup never fires (`latency=primary_ms, hedged=False`); otherwise backup runs from `hedge_delay_ms`, completing at `min(primary_ms, hedge_delay_ms + backup_ms)` (`hedged=True`).",
    "aStarter": "def simulate_hedged_call(primary_ms: int, hedge_delay_ms: int, backup_ms: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def simulate_hedged_call(primary_ms: int, hedge_delay_ms: int, backup_ms: int) -> dict:\n    if primary_ms <= hedge_delay_ms:\n        return {\"latency\": primary_ms, \"hedged\": False}\n    return {\"latency\": min(primary_ms, hedge_delay_ms + backup_ms), \"hedged\": True}",
    "aTest": "assert simulate_hedged_call(500, 50, 20) == {\"latency\": 70, \"hedged\": True}\nassert simulate_hedged_call(30, 50, 20) == {\"latency\": 30, \"hedged\": False}\nassert simulate_hedged_call(60, 50, 40) == {\"latency\": 60, \"hedged\": True}\nprint('All checks passed.')"
  },
  {
    "day": 54,
    "fallbackTitle": "Consistent Hashing with Bounded Load & Zone-Aware Replica Placement",
    "eTitle": "Google Bounded-Load Consistent Hash Router",
    "eDesc": "Write `bounded_load_route(ring: list[tuple[int, str]], loads: dict[str, int], max_load: int, key_hash: int) -> str | None`: sort ring clockwise from `key_hash`; probe distinct nodes in clockwise order skipping any with `loads[node] >= max_load`, picking first under-capacity node and incrementing `loads[node]` (`None` if all saturated).",
    "eStarter": "def bounded_load_route(ring: list[tuple[int, str]], loads: dict[str, int], max_load: int, key_hash: int):\n    # TODO\n    pass",
    "eHint": "def bounded_load_route(ring: list[tuple[int, str]], loads: dict[str, int], max_load: int, key_hash: int):\n    if not ring:\n        return None\n    sr = sorted(ring)\n    start = next((i for i, (h, _) in enumerate(sr) if h >= key_hash), 0)\n    seen = set()\n    for off in range(len(sr)):\n        _h, node = sr[(start + off) % len(sr)]\n        if node in seen:\n            continue\n        seen.add(node)\n        if loads.get(node, 0) < max_load:\n            loads[node] = loads.get(node, 0) + 1\n            return node\n    return None",
    "eTest": "ring = [(10, \"A\"), (50, \"B\"), (90, \"C\")]\nloads = {\"A\": 2, \"B\": 1, \"C\": 0}\nassert bounded_load_route(ring, loads, 2, 5) == \"B\"\nassert bounded_load_route(ring, {\"A\": 2, \"B\": 2, \"C\": 2}, 2, 5) is None\nassert bounded_load_route([], {}, 2, 5) is None\nprint('All checks passed.')",
    "aTitle": "Failure-Domain / Availability-Zone Diverse Replica Selector",
    "aDesc": "Write `place_zone_diverse_replicas(ring_nodes: list[tuple[str, str]], rf: int) -> list[str]`: walk ordered `(node, zone)` candidates selecting up to `rf` replicas across DISTINCT `zone`s first; if fewer than `rf` distinct zones exist, backfill remaining slots sequentially from remaining nodes.",
    "aStarter": "def place_zone_diverse_replicas(ring_nodes: list[tuple[str, str]], rf: int) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def place_zone_diverse_replicas(ring_nodes: list[tuple[str, str]], rf: int) -> list[str]:\n    chosen, zones = [], set()\n    for n, z in ring_nodes:\n        if len(chosen) < rf and n not in chosen and z not in zones:\n            chosen.append(n)\n            zones.add(z)\n    for n, _z in ring_nodes:\n        if len(chosen) < rf and n not in chosen:\n            chosen.append(n)\n    return chosen",
    "aTest": "cands = [(\"n1\", \"az1\"), (\"n2\", \"az1\"), (\"n3\", \"az2\"), (\"n4\", \"az3\")]\nassert place_zone_diverse_replicas(cands, 3) == [\"n1\", \"n3\", \"n4\"]\nassert place_zone_diverse_replicas([(\"n1\", \"az1\"), (\"n2\", \"az1\")], 2) == [\"n1\", \"n2\"]\nassert place_zone_diverse_replicas([], 3) == []\nprint('All checks passed.')"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11: Adaptive Load Shedder & Zone-Aware Sharding Router",
    "eTitle": "Milestone 11A: Combined AIMD + Priority Shedding Gateway",
    "eDesc": "Write `gateway_admit(inflight: int, aimd_limit: int, priority: int) -> str`: allow `\"ADMIT\"` if `inflight < aimd_limit` or (`priority == 0` and `inflight < int(aimd_limit * 1.2)`), else `\"SHED_503\"`.",
    "eStarter": "def gateway_admit(inflight: int, aimd_limit: int, priority: int) -> str:\n    # TODO\n    pass",
    "eHint": "def gateway_admit(inflight: int, aimd_limit: int, priority: int) -> str:\n    if inflight < aimd_limit or (priority == 0 and inflight < int(aimd_limit * 1.2)):\n        return \"ADMIT\"\n    return \"SHED_503\"",
    "eTest": "assert gateway_admit(9, 10, 2) == \"ADMIT\"\nassert gateway_admit(10, 10, 1) == \"SHED_503\"\nassert gateway_admit(11, 10, 0) == \"ADMIT\"\nassert gateway_admit(12, 10, 0) == \"SHED_503\"\nprint('All checks passed.')",
    "aTitle": "Milestone 11B: Zone-Diverse Sharded Hedged Read Router",
    "aDesc": "Write `route_zone_read(replicas: list[tuple[str, str, int]], preferred_az: str) -> dict`: given live `(node_id, az, est_rtt_ms)` replicas, pick fastest primary (break ties preferring `az == preferred_az` then `node_id`) and a backup in a DIFFERENT zone with lowest RTT if available (`None` if single-AZ).",
    "aStarter": "def route_zone_read(replicas: list[tuple[str, str, int]], preferred_az: str) -> dict:\n    # TODO\n    pass",
    "aHint": "def route_zone_read(replicas: list[tuple[str, str, int]], preferred_az: str) -> dict:\n    if not replicas:\n        return {\"primary\": None, \"backup\": None}\n    sr = sorted(replicas, key=lambda r: (r[2], 0 if r[1] == preferred_az else 1, r[0]))\n    pri = sr[0]\n    baks = [r for r in sr[1:] if r[1] != pri[1]]\n    return {\"primary\": pri[0], \"backup\": baks[0][0] if baks else None}",
    "aTest": "reps = [(\"n1\", \"az1\", 10), (\"n2\", \"az2\", 10), (\"n3\", \"az3\", 20)]\nassert route_zone_read(reps, \"az2\") == {\"primary\": \"n2\", \"backup\": \"n1\"}\nassert route_zone_read([(\"n1\", \"az1\", 5), (\"n2\", \"az1\", 9)], \"az1\") == {\"primary\": \"n1\", \"backup\": None}\nassert route_zone_read([], \"az1\") == {\"primary\": None, \"backup\": None}\nprint('All checks passed.')"
  },
  {
    "day": 56,
    "fallbackTitle": "Exactly-Once Stream Processing: Idempotent Producers & Transactional Checkpoints",
    "eTitle": "Kafka-Style Producer `(producer_id, epoch, seq)` Deduplicator",
    "eDesc": "Implement `IdempotentBroker()`: maintain `expected[(pid, epoch)] = 0`; `append(pid: str, epoch: int, seq: int, payload: str) -> str` rejects stale epochs with `\"FENCED\"`, returns `\"DUPLICATE\"` if `seq < expected`, `\"OUT_OF_ORDER\"` if `seq > expected`, and stores payload + returns `\"COMMITTED\"` if `seq == expected`.",
    "eStarter": "class IdempotentBroker:\n    def __init__(self):\n        # TODO\n        pass\n\n    def append(self, pid: str, epoch: int, seq: int, payload: str) -> str:\n        # TODO\n        pass",
    "eHint": "class IdempotentBroker:\n    def __init__(self):\n        self.max_ep = {}\n        self.exp_seq = {}\n        self.log = []\n\n    def append(self, pid: str, epoch: int, seq: int, payload: str) -> str:\n        if epoch < self.max_ep.get(pid, -1):\n            return \"FENCED\"\n        if epoch > self.max_ep.get(pid, -1):\n            self.max_ep[pid] = epoch\n            self.exp_seq[(pid, epoch)] = 0\n        exp = self.exp_seq[(pid, epoch)]\n        if seq < exp:\n            return \"DUPLICATE\"\n        if seq > exp:\n            return \"OUT_OF_ORDER\"\n        self.exp_seq[(pid, epoch)] = exp + 1\n        self.log.append(payload)\n        return \"COMMITTED\"",
    "eTest": "bk = IdempotentBroker()\nassert bk.append(\"p1\", 1, 0, \"a\") == \"COMMITTED\"\nassert bk.append(\"p1\", 1, 0, \"a\") == \"DUPLICATE\"\nassert bk.append(\"p1\", 1, 2, \"c\") == \"OUT_OF_ORDER\"\nassert bk.append(\"p1\", 2, 0, \"d\") == \"COMMITTED\" and bk.append(\"p1\", 1, 1, \"old\") == \"FENCED\"\nprint('All checks passed.')",
    "aTitle": "Chandy-Lamport Stream Barrier Checkpoint Alignment Coordinator",
    "aDesc": "Write `align_checkpoint_barrier(channels: list[str], events: list[tuple[str, str, int]]) -> dict`: events are `(ch, \"BARRIER\"|\"DATA\", val)`. Buffer data arriving BEFORE all channels deliver `BARRIER(val)`? Specifically: once a channel receives `\"BARRIER\"`, record subsequent `\"DATA\"` on THAT channel into `\"buffered\"` until ALL channels have emitted `\"BARRIER\"`; count `\"snapshot_data\"` from pre-barrier items on each channel.",
    "aStarter": "def align_checkpoint_barrier(channels: list[str], events: list[tuple[str, str, int]]) -> dict:\n    # TODO\n    pass",
    "aHint": "def align_checkpoint_barrier(channels: list[str], events: list[tuple[str, str, int]]) -> dict:\n    blocked = set()\n    pre, buf = [], []\n    all_chs = set(channels)\n    for ch, kind, val in events:\n        if kind == \"BARRIER\":\n            blocked.add(ch)\n            if blocked == all_chs:\n                break\n        elif ch in blocked:\n            buf.append(val)\n        else:\n            pre.append(val)\n    return {\"aligned\": blocked == all_chs and bool(all_chs), \"pre_barrier\": pre, \"buffered\": buf}",
    "aTest": "evs = [(\"c1\", \"DATA\", 1), (\"c1\", \"BARRIER\", 99), (\"c1\", \"DATA\", 2), (\"c2\", \"DATA\", 3), (\"c2\", \"BARRIER\", 99)]\nassert align_checkpoint_barrier([\"c1\", \"c2\"], evs) == {\"aligned\": True, \"pre_barrier\": [1, 3], \"buffered\": [2]}\nassert align_checkpoint_barrier([\"c1\", \"c2\"], [(\"c1\", \"BARRIER\", 1)])[\"aligned\"] is False\nassert align_checkpoint_barrier([], []) == {\"aligned\": False, \"pre_barrier\": [], \"buffered\": []}\nprint('All checks passed.')"
  },
  {
    "day": 57,
    "fallbackTitle": "Watermark Propagation, Late-Data Side Outputs & Event-Time Windowing",
    "eTitle": "Tumbling Event-Time Window & Watermark Late-Drop Engine",
    "eDesc": "Write `process_event_windows(items: list[tuple[str, int, float]], win_size: int, max_lateness: int) -> dict`: given `(\"EVENT\", ev_ts, val)` and `(\"WM\", wm_ts, 0.0)`, fire closed tumbling windows `[w_start, w_start + win_size)` when `wm_ts >= w_start + win_size`, and divert late events with `ev_ts < max_wm - max_lateness` to `\"late_count\"`.",
    "eStarter": "def process_event_windows(items: list[tuple[str, int, float]], win_size: int, max_lateness: int) -> dict:\n    # TODO\n    pass",
    "eHint": "from collections import defaultdict\n\ndef process_event_windows(items: list[tuple[str, int, float]], win_size: int, max_lateness: int) -> dict:\n    wm = -10**9\n    open_w = defaultdict(float)\n    emitted = {}\n    late = 0\n    for kind, ts, val in items:\n        if kind == \"WM\":\n            wm = max(wm, ts)\n            for ws in sorted(list(open_w.keys())):\n                if wm >= ws + win_size:\n                    emitted[ws] = round(open_w.pop(ws), 4)\n        else:\n            if ts < wm - max_lateness:\n                late += 1\n            else:\n                ws = (ts // win_size) * win_size\n                open_w[ws] += val\n    return {\"emitted\": emitted, \"late_count\": late}",
    "eTest": "its = [(\"EVENT\", 12, 5.0), (\"EVENT\", 18, 3.0), (\"WM\", 20, 0.0), (\"EVENT\", 5, 1.0)]\nassert process_event_windows(its, 10, 5) == {\"emitted\": {10: 8.0}, \"late_count\": 1}\nassert process_event_windows([(\"EVENT\", 2, 1.0)], 10, 0) == {\"emitted\": {}, \"late_count\": 0}\nassert process_event_windows([], 10, 0) == {\"emitted\": {}, \"late_count\": 0}\nprint('All checks passed.')",
    "aTitle": "Multi-Partition Minimum-Watermark Synchronizer",
    "aDesc": "Write `global_watermark(partition_wms: dict[int, int], idle_partitions: set[int]) -> int | None`: per Flink/Beam watermark algebra, advance global output watermark to `min(wm for p, wm in partition_wms.items() if p not in idle_partitions)` (`None` if all active partitions missing).",
    "aStarter": "def global_watermark(partition_wms: dict[int, int], idle_partitions: set[int]):\n    # TODO\n    pass",
    "aHint": "def global_watermark(partition_wms: dict[int, int], idle_partitions: set[int]):\n    act = [wm for p, wm in partition_wms.items() if p not in idle_partitions]\n    return min(act) if act else None",
    "aTest": "assert global_watermark({0: 500, 1: 100, 2: 400}, {1}) == 400\nassert global_watermark({0: 500, 1: 100}, set()) == 100\nassert global_watermark({0: 10}, {0}) is None\nprint('All checks passed.')"
  },
  {
    "day": 58,
    "fallbackTitle": "Distributed Tracing Context Propagation (W3C Traceparent & Critical Path)",
    "eTitle": "W3C Traceparent Header Parser & Child-Span Propagator",
    "eDesc": "Write `parse_and_fork_traceparent(header: str, new_span_id: str) -> dict | None`: validate W3C format `<ver:2hex>-<trace_id:32hex>-<parent_id:16hex>-<flags:2hex>` rejecting all-zero `trace_id` or `parent_id`, returning `{\"trace_id\", \"parent_id\", \"sampled\": bool, \"child_header\": ...}` (`None` if invalid).",
    "eStarter": "import re\n\ndef parse_and_fork_traceparent(header: str, new_span_id: str):\n    # TODO\n    pass",
    "eHint": "import re\n\ndef parse_and_fork_traceparent(header: str, new_span_id: str):\n    m = re.match(r\"^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$\", header)\n    if not m or set(m.group(2)) == {\"0\"} or set(m.group(3)) == {\"0\"}:\n        return None\n    ver, tid, pid, flg = m.groups()\n    return {\"trace_id\": tid, \"parent_id\": pid, \"sampled\": (int(flg, 16) & 1) == 1, \"child_header\": f\"{ver}-{tid}-{new_span_id}-{flg}\"}",
    "eTest": "hdr = \"00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\"\nres = parse_and_fork_traceparent(hdr, \"1111222233334444\")\nassert res[\"sampled\"] is True and res[\"child_header\"] == \"00-4bf92f3577b34da6a3ce929d0e0e4736-1111222233334444-01\"\nassert parse_and_fork_traceparent(\"00-\" + \"0\"*32 + \"-1111222233334444-01\", \"2222222222222222\") is None\nassert parse_and_fork_traceparent(\"bad\", \"1111\") is None\nprint('All checks passed.')",
    "aTitle": "DAG Span Critical-Path End-to-End Bottleneck Finder",
    "aDesc": "Write `find_trace_critical_path(spans: list[dict]) -> list[str]`: each span `{id, parent_id, start, end}` builds a tree; trace root-to-leaf selecting at each node the child subtree with maximum latest completion time (`end`), returning span IDs from root (`parent_id=None`) along the critical path.",
    "aStarter": "def find_trace_critical_path(spans: list[dict]) -> list[str]:\n    # TODO\n    pass",
    "aHint": "from collections import defaultdict\n\ndef find_trace_critical_path(spans: list[dict]) -> list[str]:\n    if not spans:\n        return []\n    by_id = {s[\"id\"]: s for s in spans}\n    kids = defaultdict(list)\n    roots = []\n    for s in spans:\n        if s[\"parent_id\"] is None:\n            roots.append(s[\"id\"])\n        else:\n            kids[s[\"parent_id\"]].append(s[\"id\"])\n    def best(sid):\n        if not kids[sid]:\n            return (by_id[sid][\"end\"], [sid])\n        end_t, sub = max((best(c) for c in kids[sid]), key=lambda x: x[0])\n        return (max(by_id[sid][\"end\"], end_t), [sid] + sub)\n    return max((best(r) for r in roots), key=lambda x: x[0])[1]",
    "aTest": "sps = [{\"id\": \"root\", \"parent_id\": None, \"start\": 0, \"end\": 100}, {\"id\": \"fast\", \"parent_id\": \"root\", \"start\": 10, \"end\": 30}, {\"id\": \"slow\", \"parent_id\": \"root\", \"start\": 10, \"end\": 95}, {\"id\": \"db\", \"parent_id\": \"slow\", \"start\": 20, \"end\": 90}]\nassert find_trace_critical_path(sps) == [\"root\", \"slow\", \"db\"]\nassert find_trace_critical_path([sps[0]]) == [\"root\"]\nassert find_trace_critical_path([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 59,
    "fallbackTitle": "Chaos Engineering: Deterministic Fault Injection & Jepsen Linearizability Checks",
    "eTitle": "Stale-Read & Lost-Write Linearizability History Verifier",
    "eDesc": "Write `check_register_linearizable(history: list[tuple[str, int, int, int]]) -> bool`: single atomic integer register initialized to `0`, invoked `(op \"WRITE\"|\"READ\", val, call_t, ret_t)`. Test simple non-concurrent sequential execution OR check monotonicity of non-overlapping calls: return `False` if any `READ(v)` observes a value written ONLY strictly after `READ` returned, or reads stale value strictly after a newer `WRITE` completed with no intervening write of `v`.",
    "eStarter": "def check_register_linearizable(history: list[tuple[str, int, int, int]]) -> bool:\n    # TODO\n    pass",
    "eHint": "def check_register_linearizable(history: list[tuple[str, int, int, int]]) -> bool:\n    ops = sorted(enumerate(history), key=lambda x: (x[1][2], x[1][3]))\n    from itertools import permutations\n    def ok_perm(p):\n        for i in range(len(p)):\n            for j in range(i + 1, len(p)):\n                if p[i][1][3] < p[j][1][2]:\n                    continue\n        cur = 0\n        for _idx, (kind, val, _cs, _ce) in p:\n            if kind == \"WRITE\":\n                cur = val\n            elif cur != val:\n                return False\n        return True\n    def valid_order(p):\n        for i in range(len(p)):\n            for j in range(i + 1, len(p)):\n                if p[j][1][3] < p[i][1][2]:\n                    return False\n        cur = 0\n        for _idx, (kind, val, _cs, _ce) in p:\n            if kind == \"WRITE\":\n                cur = val\n            elif cur != val:\n                return False\n        return True\n    return any(valid_order(p) for p in permutations(ops))",
    "eTest": "assert check_register_linearizable([(\"WRITE\", 1, 0, 5), (\"READ\", 1, 6, 8)]) is True\nassert check_register_linearizable([(\"WRITE\", 1, 0, 5), (\"WRITE\", 2, 6, 10), (\"READ\", 1, 11, 12)]) is False\nassert check_register_linearizable([(\"WRITE\", 5, 0, 10), (\"READ\", 5, 2, 8)]) is True\nprint('All checks passed.')",
    "aTitle": "Network Partition Matrix Split & Majority Quorum Reachability Auditor",
    "aDesc": "Write `partition_quorum_check(nodes: list[str], blocked_links: set[tuple[str, str]]) -> dict`: build undirected connectivity components across `nodes` ignoring edges in `blocked_links` (symmetric); identify `\"quorum_nodes\"` (sorted nodes in the strict-majority component `size > len(nodes) // 2`) and `\"has_quorum\": bool`.",
    "aStarter": "def partition_quorum_check(nodes: list[str], blocked_links: set[tuple[str, str]]) -> dict:\n    # TODO\n    pass",
    "aHint": "from collections import deque\n\ndef partition_quorum_check(nodes: list[str], blocked_links: set[tuple[str, str]]) -> dict:\n    if not nodes:\n        return {\"has_quorum\": False, \"quorum_nodes\": []}\n    blk = set(blocked_links) | {(b, a) for a, b in blocked_links}\n    vis = set()\n    need = len(nodes) // 2 + 1\n    for start in nodes:\n        if start in vis:\n            continue\n        comp = []\n        q = deque([start])\n        vis.add(start)\n        while q:\n            u = q.popleft()\n            comp.append(u)\n            for v in nodes:\n                if v not in vis and (u, v) not in blk:\n                    vis.add(v)\n                    q.append(v)\n        if len(comp) >= need:\n            return {\"has_quorum\": True, \"quorum_nodes\": sorted(comp)}\n    return {\"has_quorum\": False, \"quorum_nodes\": []}",
    "aTest": "blk = {(\"n1\", \"n2\"), (\"n1\", \"n3\")}\nassert partition_quorum_check([\"n1\", \"n2\", \"n3\"], blk) == {\"has_quorum\": True, \"quorum_nodes\": [\"n2\", \"n3\"]}\nassert partition_quorum_check([\"n1\", \"n2\", \"n3\"], {(\"n1\", \"n2\"), (\"n2\", \"n3\"), (\"n1\", \"n3\")}) == {\"has_quorum\": False, \"quorum_nodes\": []}\nassert partition_quorum_check([], set()) == {\"has_quorum\": False, \"quorum_nodes\": []}\nprint('All checks passed.')"
  },
  {
    "day": 60,
    "fallbackTitle": "Milestone 12 Capstone: Geo-Distributed Fault-Tolerant Storage & Stream Platform",
    "eTitle": "Milestone 12A: Multi-Region Quorum Commit + Fencing + Vector Clock Storage Gateway",
    "eDesc": "Write `geo_kv_put(replicas: dict[str, int], up_nodes: set[str], token: int, max_token: int, n_total: int) -> tuple[bool, int]`: enforce `token >= max_token`, require majority live writes `len(up_nodes) >= n_total // 2 + 1`, update `replicas[n]` for `n in up_nodes` to `token`, and return `(accepted, new_max_token)`.",
    "eStarter": "def geo_kv_put(replicas: dict[str, int], up_nodes: set[str], token: int, max_token: int, n_total: int) -> tuple[bool, int]:\n    # TODO\n    pass",
    "eHint": "def geo_kv_put(replicas: dict[str, int], up_nodes: set[str], token: int, max_token: int, n_total: int) -> tuple[bool, int]:\n    if token < max_token or len(up_nodes) < (n_total // 2 + 1):\n        return False, max_token\n    for n in up_nodes:\n        replicas[n] = token\n    return True, token",
    "eTest": "reps = {\"us\": 0, \"eu\": 0, \"ap\": 0}\nassert geo_kv_put(reps, {\"us\", \"eu\"}, 5, 3, 3) == (True, 5) and reps == {\"us\": 5, \"eu\": 5, \"ap\": 0}\nassert geo_kv_put(reps, {\"us\", \"eu\"}, 2, 5, 3) == (False, 5)\nassert geo_kv_put(reps, {\"ap\"}, 6, 5, 3) == (False, 5)\nprint('All checks passed.')",
    "aTitle": "Milestone 12B: Geo-Streaming Watermark + Idempotent Sink Checkpoint Gate",
    "aDesc": "Write `commit_stream_checkpoint(part_wms: dict[str, int], msg_ids: list[str], seen_ids: set[str], target_wm: int) -> dict`: deduplicate `msg_ids` against `seen_ids` keeping new IDs in order, compute global `min_wm = min(part_wms.values())`, and mark `\"checkpoint_ready\": bool(part_wms) and min_wm >= target_wm`.",
    "aStarter": "def commit_stream_checkpoint(part_wms: dict[str, int], msg_ids: list[str], seen_ids: set[str], target_wm: int) -> dict:\n    # TODO\n    pass",
    "aHint": "def commit_stream_checkpoint(part_wms: dict[str, int], msg_ids: list[str], seen_ids: set[str], target_wm: int) -> dict:\n    fresh = []\n    for mid in msg_ids:\n        if mid not in seen_ids:\n            seen_ids.add(mid)\n            fresh.append(mid)\n    mwm = min(part_wms.values()) if part_wms else 0\n    return {\"new_msgs\": fresh, \"min_wm\": mwm, \"checkpoint_ready\": bool(part_wms) and mwm >= target_wm}",
    "aTest": "seen = {\"m0\"}\nassert commit_stream_checkpoint({\"p0\": 100, \"p1\": 120}, [\"m0\", \"m1\", \"m1\"], seen, 100) == {\"new_msgs\": [\"m1\"], \"min_wm\": 100, \"checkpoint_ready\": True}\nassert commit_stream_checkpoint({\"p0\": 80, \"p1\": 120}, [\"m2\"], seen, 100)[\"checkpoint_ready\"] is False\nassert commit_stream_checkpoint({}, [], seen, 100) == {\"new_msgs\": [], \"min_wm\": 0, \"checkpoint_ready\": False}\nprint('All checks passed.')"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['dist-py'] || []).map((entry) => [entry.day, entry]));

export const DIST_PYTHON_MONTH2_CONFIGS: DayConfig[] = RAW_M2_DAY_TASKS.map((t) => {
  const indexed = indexByDay.get(t.day);
  return {
    day: t.day,
    title: indexed?.title || t.fallbackTitle,
    desc: indexed?.goal || `${t.fallbackTitle} — hands-on coding labs.`,
    syllabus: indexed?.summary?.length ? indexed.summary : [t.eTitle, t.aTitle],
    eLanguage: 'python',
    aLanguage: 'python',
    eTitle: t.eTitle,
    eDesc: t.eDesc,
    eStarter: t.eStarter,
    eHint: t.eHint,
    eTest: t.eTest,
    aTitle: t.aTitle,
    aDesc: t.aDesc,
    aStarter: t.aStarter,
    aHint: t.aHint,
    aTest: t.aTest,
  };
});

export const DIST_PYTHON_MONTH2_QUESTS: CourseQuest[] = DIST_PYTHON_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('dist-py', cfg.day!, cfg)
);
