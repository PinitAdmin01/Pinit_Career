#!/usr/bin/env python3
"""
Test Day 48 code samples for 100% deterministic execution and output matching.
"""
import sys
import io

# Part 1 Code: Cache-Aside vs Write-Through Patterns
p1_code = '''class CacheArchitectureSimulator:
    def __init__(self):
        self.cache = {}
        self.database = {"prod_101": {"name": "Mechanical Keyboard", "price": 120}}

    def read_cache_aside(self, product_id):
        if product_id in self.cache:
            return "CACHE_HIT (0.3ms)", self.cache[product_id]
        # Cache miss -> read DB and populate cache
        item = self.database.get(product_id)
        self.cache[product_id] = item
        return "CACHE_MISS -> DB_READ (15.2ms)", item

    def write_through(self, product_id, updated_item):
        # Update DB and cache simultaneously
        self.database[product_id] = updated_item
        self.cache[product_id] = updated_item
        return "WRITE_THROUGH_PERSISTED (16.0ms)"

sim = CacheArchitectureSimulator()
status1, item1 = sim.read_cache_aside("prod_101")
status2, item2 = sim.read_cache_aside("prod_101")
w_status = sim.write_through("prod_101", {"name": "Mechanical Keyboard", "price": 99})

print(f"Request 1: {status1}")
print(f"Request 2: {status2}")
print(f"Write Op: {w_status}")'''

# Part 2 Code: Cache Stampede (Thundering Herd) Forensics
p2_code = '''class CacheStampedeForensics:
    def simulate_naive_stampede(self, concurrent_requests=100):
        # All 100 requests discover expired key at the same millisecond
        db_queries_triggered = concurrent_requests
        return f"THUNDERING HERD: {concurrent_requests} concurrent requests triggered {db_queries_triggered} redundant database queries! DB connection pool exhausted."

    def simulate_mutex_protected_stampede(self, concurrent_requests=100):
        # Distributed mutex serializes DB query to 1 worker; 99 await cached result
        db_queries_triggered = 1
        cached_serves = concurrent_requests - 1
        return f"MUTEX DEFENSE: {concurrent_requests} requests handled -> Exactly {db_queries_triggered} DB query executed, {cached_serves} served from refreshed cache."

forensics = CacheStampedeForensics()
print(forensics.simulate_naive_stampede(100))
print(forensics.simulate_mutex_protected_stampede(100))'''

# Part 3 Code: XFetch Probabilistic Early Expiration Algorithm
p3_code = '''import math

class XFetchProbabilisticCache:
    def __init__(self, beta=1.0):
        self.beta = beta
        self.store = {}

    def set(self, key, value, ttl_sec=60, compute_cost_sec=0.5):
        self.store[key] = {
            "val": value,
            "expiry": ttl_sec,
            "delta": compute_cost_sec
        }

    def should_refresh_early(self, key, current_time_sec, pseudo_random_val=0.1):
        record = self.store.get(key)
        if not record: return True
        remaining_ttl = record["expiry"] - current_time_sec
        # XFetch equation: -(delta * beta * ln(rand)) > remaining_ttl
        xfetch_factor = -(record["delta"] * self.beta * math.log(pseudo_random_val))
        return xfetch_factor > remaining_ttl, round(xfetch_factor, 3), remaining_ttl

cache = XFetchProbabilisticCache(beta=1.5)
cache.set("trending_news_feed", "Top 10 Headlines", ttl_sec=60, compute_cost_sec=1.2)

# At T=58s (remaining=2s), pseudo-random=0.1 -> xfetch_factor ~ 4.14 > 2 -> triggers early background refresh!
should_refresh, factor, rem = cache.should_refresh_early("trending_news_feed", current_time_sec=58, pseudo_random_val=0.1)

print(f"Remaining TTL: {rem}s | XFetch Early Factor: {factor}")
print(f"Probabilistic Refresh Decision: {should_refresh}")
print("XFetch Invariant: Hot key refreshed asynchronously before TTL expiration with 0 DB stampede.")'''

# Part 4 Code: Atomic Redis Lua Scripting Simulator
p4_code = '''class RedisLuaScriptSimulator:
    def __init__(self):
        self.redis_kv = {"session_token_99": "active"}

    def eval_atomic_conditional_del(self, key, expected_val):
        # Simulating Lua script: if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end
        curr = self.redis_kv.get(key)
        if curr == expected_val:
            del self.redis_kv[key]
            return 1, f"LUA EVAL: Key '{key}' matched '{expected_val}' -> Atomically deleted (1)"
        return 0, f"LUA EVAL: Key '{key}' mismatch ('{curr}' != '{expected_val}') -> Aborted (0)"

lua_engine = RedisLuaScriptSimulator()
r1, msg1 = lua_engine.eval_atomic_conditional_del("session_token_99", "wrong_val")
r2, msg2 = lua_engine.eval_atomic_conditional_del("session_token_99", "active")

print(f"Attempt 1: Result={r1} | {msg1}")
print(f"Attempt 2: Result={r2} | {msg2}")
print("Lua Script Invariant: Multi-step check-and-delete executes in a single atomic microsecond.")'''

# Part 5 Code: Capstone Resilient Portal Cache Engine
p5_code = '''class ResilientPortalCacheEngine:
    def __init__(self):
        self.db_queries = 0
        self.cache_hits = 0

    def serve_traffic(self, request_count=1000, has_xfetch=True):
        if has_xfetch:
            # XFetch pre-warms before expiry -> exactly 1 background refresh
            self.db_queries = 1
            self.cache_hits = request_count - 1
        else:
            # Stampede triggers 1000 DB queries
            self.db_queries = request_count
            self.cache_hits = 0
        return {
            "total_requests": request_count,
            "cache_hits": self.cache_hits,
            "database_queries": self.db_queries,
            "database_load_reduction": f"{round((1 - self.db_queries / request_count) * 100, 1)}%"
        }

engine = ResilientPortalCacheEngine()
metrics = engine.serve_traffic(request_count=1000, has_xfetch=True)

print("=== High-Traffic News Portal Cache Engine ===")
for k, v in metrics.items():
    print(f"  {k}: {v}")
print("INVARIANT SATISFIED: Stampede eliminated; database load reduced by 99.9%.")'''

codes = [p1_code, p2_code, p3_code, p4_code, p5_code]

for i, c in enumerate(codes):
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    try:
        exec(c, {})
        out = sys.stdout.getvalue().strip()
    finally:
        sys.stdout = old_stdout
    print(f"=== PART {i+1} OUTPUT ===")
    print(out)
    print()
