"""
PinIT Career OS — Python Course Puzzle Data
Days 31–45: Advanced Backend Engineering
(Pydantic V2, FastAPI Deep-Dive, SQLAlchemy 2.0, Celery & Task Queues)

All puzzles use ONLY the stdlib — patterns are simulated with dicts, lists,
functions, and classes so every puzzle produces deterministic stdout.
"""

PUZZLES = [
    # ── Day 31: Pydantic V2 Architecture & pydantic-core (Rust FFI) ──────
    {
        "day": 31,
        "title": "Pydantic V2 Model Validation Engine",
        "mission": "Build a simulated Pydantic-style BaseModel that validates field types at construction time. Create a User model with 'name' (str) and 'age' (int) fields, then show how invalid data triggers a validation error.",
        "labels": [
            "Define the Field descriptor class",
            "Define the ValidatedModel base class with __init_subclass__",
            "Implement __init__ that validates types",
            "Define the User model with typed fields",
            "Create a valid user and print it",
            "Try creating an invalid user and catch the error",
        ],
        "blocks": [
            "class Field:\n    def __init__(self, field_type):\n        self.field_type = field_type",
            "class ValidatedModel:\n    __fields__ = {}\n    def __init_subclass__(cls, **kw):\n        super().__init_subclass__(**kw)\n        cls.__fields__ = {k: v for k, v in cls.__dict__.items() if isinstance(v, Field)}",
            "    def __init__(self, **data):\n        errors = []\n        for name, field in self.__fields__.items():\n            val = data.get(name)\n            if not isinstance(val, field.field_type):\n                errors.append(f'{name}: expected {field.field_type.__name__}, got {type(val).__name__}')\n            else:\n                setattr(self, name, val)\n        if errors:\n            raise ValueError('; '.join(errors))",
            "class User(ValidatedModel):\n    name = Field(str)\n    age = Field(int)",
            "u = User(name='Alice', age=30)\nprint(f'Valid: {u.name}, {u.age}')",
            "try:\n    User(name='Bob', age='not_a_number')\nexcept ValueError as e:\n    print(f'Error: {e}')",
        ],
        "decoys": [
            (
                "    def __init__(self, **data):\n        for name, field in self.__fields__.items():\n            setattr(self, name, data.get(name))",
                "Skipping type validation defeats the purpose of Pydantic — data must be checked against declared field types before assignment.",
            ),
            (
                "class User(ValidatedModel):\n    name = str\n    age = int",
                "Bare type annotations aren't Field descriptors — __init_subclass__ won't detect them, so no validation metadata is registered.",
            ),
        ],
        "output": "Valid: Alice, 30\nError: age: expected int, got str",
        "hint": "Pydantic V2 uses Rust-backed pydantic-core for speed, but the pattern is the same: declare fields with types, then validate every value at construction time.",
        "success": "You've built a mini validation engine — the core idea behind Pydantic's BaseModel!",
    },
    # ── Day 32: FastAPI Request Lifecycle & Dependency Injection Graph ────
    {
        "day": 32,
        "title": "Dependency Injection Graph Resolver",
        "mission": "Simulate FastAPI's dependency injection system. Build a resolver that topologically executes dependencies so each endpoint receives fully-resolved values from its dependency chain.",
        "labels": [
            "Define the dependency registry and depends helper",
            "Register a config dependency",
            "Register a db_session dependency that depends on config",
            "Register an endpoint that depends on db_session",
            "Build the resolver that walks the graph",
            "Resolve and run the endpoint",
        ],
        "blocks": [
            "registry = {}\ndef depends(name, deps=None, fn=None):\n    registry[name] = {'deps': deps or [], 'fn': fn}",
            "depends('config', fn=lambda: {'host': 'localhost', 'port': 5432})",
            "depends('db_session', deps=['config'],\n    fn=lambda config: f\"Session(host={config['host']})\")",
            "depends('get_users', deps=['db_session'],\n    fn=lambda db: f'Users from {db}')",
            "def resolve(name, cache=None):\n    if cache is None:\n        cache = {}\n    if name in cache:\n        return cache[name]\n    entry = registry[name]\n    args = [resolve(d, cache) for d in entry['deps']]\n    result = entry['fn'](*args)\n    cache[name] = result\n    return result",
            "result = resolve('get_users')\nprint(f'Resolved: {result}')",
        ],
        "decoys": [
            (
                "def resolve(name):\n    entry = registry[name]\n    args = [resolve(d) for d in entry['deps']]\n    return entry['fn'](*args)",
                "Without a cache, shared dependencies are re-executed on every access — FastAPI caches dependency results per-request to avoid redundant work.",
            ),
            (
                "depends('db_session', deps=['config'],\n    fn=lambda: f'Session(no config)')",
                "Ignoring the config argument means the db_session dependency doesn't actually use its parent — breaking the injection chain.",
            ),
        ],
        "output": "Resolved: Users from Session(host=localhost)",
        "hint": "FastAPI's Depends() builds a DAG of callables. Each dependency is resolved once per request and cached, then injected as arguments to its dependents.",
        "success": "You've simulated FastAPI's dependency injection resolver with topological caching!",
    },
    # ── Day 33: High-Performance Streaming & WebSockets in FastAPI ───────
    {
        "day": 33,
        "title": "Async WebSocket Message Broker",
        "mission": "Simulate a WebSocket message broker that routes messages between clients using an async-style event loop with a message queue. Demonstrate pub/sub fan-out to multiple subscribers.",
        "labels": [
            "Define the MessageBroker class with channels",
            "Implement subscribe and publish methods",
            "Implement the process method that delivers messages",
            "Set up a broker with two subscribers",
            "Publish messages and process the queue",
            "Print delivery confirmations",
        ],
        "blocks": [
            "class MessageBroker:\n    def __init__(self):\n        self.channels = {}\n        self.queue = []\n        self.delivered = []",
            "    def subscribe(self, channel, client):\n        self.channels.setdefault(channel, []).append(client)\n    def publish(self, channel, msg):\n        self.queue.append((channel, msg))",
            "    def process(self):\n        while self.queue:\n            ch, msg = self.queue.pop(0)\n            for client in self.channels.get(ch, []):\n                self.delivered.append(f'{client} <- {msg}')",
            "broker = MessageBroker()\nbroker.subscribe('chat', 'alice')\nbroker.subscribe('chat', 'bob')",
            "broker.publish('chat', 'hello')\nbroker.publish('chat', 'world')\nbroker.process()",
            "for d in broker.delivered:\n    print(d)",
        ],
        "decoys": [
            (
                "    def process(self):\n        ch, msg = self.queue.pop(0)\n        for client in self.channels.get(ch, []):\n            self.delivered.append(f'{client} <- {msg}')",
                "Processing only one message instead of draining the queue means later messages are silently dropped — a real broker must flush all pending messages.",
            ),
            (
                "    def publish(self, channel, msg):\n        for client in self.channels.get(channel, []):\n            self.delivered.append(f'{client} <- {msg}')",
                "Delivering immediately in publish() bypasses the queue entirely — breaking the async model where messages are buffered then processed in order.",
            ),
        ],
        "output": "alice <- hello\nbob <- hello\nalice <- world\nbob <- world",
        "hint": "WebSocket servers buffer incoming messages in a queue and fan them out to all subscribers on that channel when the event loop processes them.",
        "success": "You've built an async-style pub/sub message broker — the heart of real-time WebSocket systems!",
    },
    # ── Day 34: Authentication, Security & OAuth2 with JWT ───────────────
    {
        "day": 34,
        "title": "Stateless JWT Token Engine",
        "mission": "Simulate JWT (JSON Web Token) creation and verification using base64 encoding. Build a token with a header, payload, and signature, then verify it — showing how stateless authentication works.",
        "labels": [
            "Import base64 and json modules",
            "Define encode and decode helpers",
            "Build the create_token function with header.payload.signature",
            "Build the verify_token function",
            "Create a token for a user and print its parts",
            "Verify the token and print the decoded payload",
        ],
        "blocks": [
            "import base64\nimport json",
            "def b64_encode(data):\n    return base64.urlsafe_b64encode(json.dumps(data).encode()).decode()\ndef b64_decode(s):\n    return json.loads(base64.urlsafe_b64decode(s.encode()).decode())",
            "def create_token(payload, secret):\n    header = {'alg': 'HS256', 'typ': 'JWT'}\n    h = b64_encode(header)\n    p = b64_encode(payload)\n    sig = b64_encode({'signed': f'{h}.{p}.{secret}'})\n    return f'{h}.{p}.{sig}'",
            "def verify_token(token, secret):\n    h, p, sig = token.split('.')\n    expected = b64_encode({'signed': f'{h}.{p}.{secret}'})\n    if sig != expected:\n        raise ValueError('Invalid signature')\n    return b64_decode(p)",
            "token = create_token({'sub': 'alice', 'role': 'admin'}, 'secret_key')\nparts = token.split('.')\nprint(f'Parts: {len(parts)}')\nprint(f'Type: JWT')",
            "payload = verify_token(token, 'secret_key')\nprint(f\"User: {payload['sub']}, Role: {payload['role']}\")",
        ],
        "decoys": [
            (
                "def verify_token(token, secret):\n    h, p, sig = token.split('.')\n    return b64_decode(p)",
                "Skipping signature verification means any tampered token is accepted — the whole point of JWT is that the server checks the signature against its secret.",
            ),
            (
                "def create_token(payload, secret):\n    return b64_encode(payload)",
                "A single base64 string with no header or signature isn't a JWT — it's just encoded data anyone can read and forge.",
            ),
        ],
        "output": "Parts: 3\nType: JWT\nUser: alice, Role: admin",
        "hint": "A JWT has three base64-encoded parts separated by dots: header, payload, and signature. The server verifies the signature using a secret key to ensure the token hasn't been tampered with.",
        "success": "You've built a stateless JWT engine — the foundation of modern API authentication!",
    },
    # ── Day 35: Milestone Project 6 ──────────────────────────────────────
    {
        "day": 35,
        "title": "Milestone 6: Secure FastAPI Microservice Simulator",
        "mission": "Combine Pydantic validation, dependency injection, and JWT auth into a simulated FastAPI microservice. A request arrives, gets authenticated, its body is validated, and the endpoint returns a response through the full pipeline.",
        "labels": [
            "Define a Pydantic-style validator function",
            "Define the JWT verify function",
            "Define the dependency injection container",
            "Define the endpoint handler using the DI container",
            "Run a valid authenticated request through the pipeline",
            "Run an unauthenticated request and catch the error",
        ],
        "blocks": [
            "def validate(schema, data):\n    errors = [k for k, t in schema.items() if not isinstance(data.get(k), t)]\n    if errors:\n        raise ValueError(f'Validation failed: {errors}')\n    return data",
            "import base64, json\ndef make_token(user, secret):\n    p = base64.b64encode(json.dumps(user).encode()).decode()\n    return f'header.{p}.{secret}'\ndef check_token(token, secret):\n    parts = token.split('.')\n    if parts[2] != secret:\n        raise PermissionError('Invalid token')\n    return json.loads(base64.b64decode(parts[1]).encode())",
            "class Container:\n    def __init__(self, secret):\n        self.secret = secret\n    def auth(self, token):\n        return check_token(token, self.secret)\n    def validate(self, schema, data):\n        return validate(schema, data)",
            "def create_order(container, token, body):\n    user = container.auth(token)\n    data = container.validate({'item': str, 'qty': int}, body)\n    return f\"Order({data['item']}x{data['qty']}) by {user['sub']}\"",
            "c = Container('my_secret')\ntok = make_token({'sub': 'alice'}, 'my_secret')\nresult = create_order(c, tok, {'item': 'Widget', 'qty': 5})\nprint(result)",
            "try:\n    create_order(c, 'bad.token.wrong', {'item': 'X', 'qty': 1})\nexcept PermissionError as e:\n    print(f'Blocked: {e}')",
        ],
        "decoys": [
            (
                "def create_order(container, token, body):\n    data = container.validate({'item': str, 'qty': int}, body)\n    return f\"Order({data['item']}x{data['qty']})\"",
                "Skipping authentication means anyone can create orders — auth must run before business logic in a secure microservice pipeline.",
            ),
            (
                "def check_token(token, secret):\n    parts = token.split('.')\n    return json.loads(base64.b64decode(parts[1]).encode())",
                "Decoding without verifying the signature section means forged tokens are accepted — defeating the purpose of JWT security.",
            ),
        ],
        "output": "Order(Widgetx5) by alice\nBlocked: Invalid token",
        "hint": "A secure microservice pipeline flows: authenticate → validate input → execute business logic. Dependency injection wires these steps together cleanly.",
        "success": "Milestone 6 complete! You've orchestrated auth, validation, and DI into a full request pipeline!",
    },
    # ── Day 36: SQLAlchemy 2.0 Async Engine & Connection Pooling ─────────
    {
        "day": 36,
        "title": "Connection Pool Simulator",
        "mission": "Simulate SQLAlchemy 2.0's connection pool. Build a pool with a maximum size, track checkout/checkin of connections, and show what happens when the pool is exhausted.",
        "labels": [
            "Define the Connection class",
            "Define the ConnectionPool with a max size",
            "Implement checkout and checkin methods",
            "Create a pool with max_size=2",
            "Check out connections and show pool status",
            "Return a connection and reuse it",
        ],
        "blocks": [
            "class Connection:\n    _counter = 0\n    def __init__(self):\n        Connection._counter += 1\n        self.id = Connection._counter\n        self.in_use = False\n    def __repr__(self):\n        return f'Conn-{self.id}'",
            "class ConnectionPool:\n    def __init__(self, max_size):\n        self.max_size = max_size\n        self.pool = []\n        self.active = []",
            "    def checkout(self):\n        for c in self.pool:\n            if not c.in_use:\n                c.in_use = True\n                self.active.append(c)\n                return c\n        if len(self.pool) < self.max_size:\n            c = Connection()\n            c.in_use = True\n            self.pool.append(c)\n            self.active.append(c)\n            return c\n        raise RuntimeError('Pool exhausted')\n    def checkin(self, conn):\n        conn.in_use = False\n        self.active.remove(conn)",
            "Connection._counter = 0\npool = ConnectionPool(max_size=2)",
            "c1 = pool.checkout()\nc2 = pool.checkout()\nprint(f'Active: {pool.active}')\ntry:\n    pool.checkout()\nexcept RuntimeError as e:\n    print(f'Error: {e}')",
            "pool.checkin(c1)\nc3 = pool.checkout()\nprint(f'Reused: {c3}')\nprint(f'Pool size: {len(pool.pool)}')",
        ],
        "decoys": [
            (
                "    def checkout(self):\n        c = Connection()\n        c.in_use = True\n        self.pool.append(c)\n        return c",
                "Creating a new connection on every checkout ignores the max_size limit — a real pool reuses idle connections and blocks when full.",
            ),
            (
                "    def checkin(self, conn):\n        self.pool.remove(conn)\n        self.active.remove(conn)",
                "Removing the connection from the pool on checkin destroys it — checkin should mark it idle for reuse, not delete it.",
            ),
        ],
        "output": "Active: [Conn-1, Conn-2]\nError: Pool exhausted\nReused: Conn-1\nPool size: 2",
        "hint": "Connection pools maintain a fixed set of database connections. When all are in use, new requests must wait. Returned connections go back to the idle pool for reuse.",
        "success": "You've simulated SQLAlchemy's connection pooling — a critical performance pattern for database-heavy apps!",
    },
    # ── Day 37: Unit of Work Pattern & Identity Map Physics ──────────────
    {
        "day": 37,
        "title": "Unit of Work & Identity Map",
        "mission": "Simulate SQLAlchemy's Unit of Work pattern with an Identity Map. The identity map ensures each database row is represented by exactly one Python object in a session, and the Unit of Work tracks all changes for a single commit.",
        "labels": [
            "Define the Entity base class",
            "Define the Session with an identity map",
            "Implement add, get, and commit methods",
            "Create a session and add entities",
            "Verify identity map returns same object",
            "Commit and show tracked changes",
        ],
        "blocks": [
            "class Entity:\n    def __init__(self, id, name):\n        self.id = id\n        self.name = name\n        self.dirty = False\n    def __repr__(self):\n        return f'{self.name}(id={self.id})'",
            "class Session:\n    def __init__(self):\n        self.identity_map = {}\n        self.new = []\n        self.modified = []",
            "    def add(self, entity):\n        key = (type(entity).__name__, entity.id)\n        if key not in self.identity_map:\n            self.identity_map[key] = entity\n            self.new.append(entity)\n        return self.identity_map[key]\n    def get(self, cls, id):\n        return self.identity_map.get((cls.__name__, id))\n    def commit(self):\n        ops = [f'INSERT {e}' for e in self.new]\n        ops += [f'UPDATE {e}' for e in self.modified]\n        self.new.clear()\n        self.modified.clear()\n        return ops",
            "session = Session()\nsession.add(Entity(1, 'Alice'))\nsession.add(Entity(2, 'Bob'))",
            "e1 = session.get(Entity, 1)\ne1_again = session.get(Entity, 1)\nprint(f'Same object: {e1 is e1_again}')\nprint(f'Identity map size: {len(session.identity_map)}')",
            "e1.name = 'Alice_Updated'\ne1.dirty = True\nsession.modified.append(e1)\nfor op in session.commit():\n    print(op)",
        ],
        "decoys": [
            (
                "    def add(self, entity):\n        key = (type(entity).__name__, entity.id)\n        self.identity_map[key] = entity\n        self.new.append(entity)",
                "Always overwriting the identity map entry means you lose the guarantee that the same row returns the same object — the identity map must return the existing instance.",
            ),
            (
                "    def commit(self):\n        for e in self.new:\n            print(f'INSERT {e}')",
                "Printing inside commit couples I/O to the unit of work — commit should return operations so the caller controls output and error handling.",
            ),
        ],
        "output": "Same object: True\nIdentity map size: 2\nINSERT Alice(id=1)\nINSERT Bob(id=2)\nUPDATE Alice_Updated(id=1)",
        "hint": "The Identity Map ensures that loading the same row twice returns the same Python object. The Unit of Work batches all INSERTs and UPDATEs into a single commit.",
        "success": "You've mastered the Identity Map and Unit of Work — the twin engines inside SQLAlchemy's Session!",
    },
    # ── Day 38: High-Scale Query Optimization & The N+1 Problem ──────────
    {
        "day": 38,
        "title": "N+1 Query Problem & Eager Loading",
        "mission": "Demonstrate the N+1 query problem and fix it with eager loading. Simulate lazy loading (one query per child) versus eager loading (one joined query) and compare the query counts.",
        "labels": [
            "Define the simulated database",
            "Implement lazy_load that triggers N+1 queries",
            "Implement eager_load with a single joined query",
            "Run lazy loading and count queries",
            "Run eager loading and count queries",
            "Print the comparison",
        ],
        "blocks": [
            "DB = {\n    'authors': {1: 'Alice', 2: 'Bob'},\n    'books': [\n        {'id': 1, 'author_id': 1, 'title': 'Book_A'},\n        {'id': 2, 'author_id': 1, 'title': 'Book_B'},\n        {'id': 3, 'author_id': 2, 'title': 'Book_C'},\n    ]\n}",
            "def lazy_load():\n    queries = ['SELECT * FROM authors']\n    results = []\n    for aid, name in DB['authors'].items():\n        queries.append(f'SELECT * FROM books WHERE author_id={aid}')\n        books = [b['title'] for b in DB['books'] if b['author_id'] == aid]\n        results.append(f'{name}: {books}')\n    return queries, results",
            "def eager_load():\n    queries = ['SELECT * FROM authors JOIN books ON authors.id = books.author_id']\n    grouped = {}\n    for b in DB['books']:\n        name = DB['authors'][b['author_id']]\n        grouped.setdefault(name, []).append(b['title'])\n    results = [f'{n}: {bks}' for n, bks in grouped.items()]\n    return queries, results",
            "lazy_q, lazy_r = lazy_load()\nprint(f'Lazy queries: {len(lazy_q)}')\nfor r in lazy_r:\n    print(f'  {r}')",
            "eager_q, eager_r = eager_load()\nprint(f'Eager queries: {len(eager_q)}')\nfor r in eager_r:\n    print(f'  {r}')",
            "print(f'N+1 overhead: {len(lazy_q) - len(eager_q)} extra queries')",
        ],
        "decoys": [
            (
                "def eager_load():\n    queries = []\n    results = []\n    for aid, name in DB['authors'].items():\n        queries.append(f'SELECT * FROM books WHERE author_id={aid}')\n        books = [b['title'] for b in DB['books'] if b['author_id'] == aid]\n        results.append(f'{name}: {books}')\n    return queries, results",
                "This is still lazy loading with one query per author — eager loading must use a single JOIN query to fetch all data at once.",
            ),
        ],
        "output": "Lazy queries: 3\n  Alice: ['Book_A', 'Book_B']\n  Bob: ['Book_C']\nEager queries: 1\n  Alice: ['Book_A', 'Book_B']\n  Bob: ['Book_C']\nN+1 overhead: 2 extra queries",
        "hint": "The N+1 problem: 1 query for parents + N queries for children. Eager loading uses a JOIN to fetch everything in 1 query — same results, far fewer round trips.",
        "success": "You've conquered the N+1 problem — one of the most common performance pitfalls in ORM-backed applications!",
    },
    # ── Day 39: Database Migrations with Alembic ─────────────────────────
    {
        "day": 39,
        "title": "Schema Migration Version Chain",
        "mission": "Simulate Alembic's migration system. Build a version chain where each migration has an upgrade and downgrade function, then walk the chain forward and backward to evolve a schema.",
        "labels": [
            "Define the Migration class",
            "Define the MigrationRunner with version tracking",
            "Implement upgrade and downgrade methods",
            "Create a chain of migrations",
            "Run all upgrades to reach the latest version",
            "Downgrade one step and show the schema state",
        ],
        "blocks": [
            "class Migration:\n    def __init__(self, rev, description, up_sql, down_sql):\n        self.rev = rev\n        self.description = description\n        self.up_sql = up_sql\n        self.down_sql = down_sql",
            "class MigrationRunner:\n    def __init__(self):\n        self.current_rev = None\n        self.history = []\n        self.migrations = []\n        self.schema = []",
            "    def add(self, migration):\n        self.migrations.append(migration)\n    def upgrade(self):\n        for m in self.migrations:\n            if m.rev not in self.history:\n                self.schema.append(m.up_sql)\n                self.history.append(m.rev)\n                self.current_rev = m.rev\n    def downgrade(self):\n        if self.history:\n            rev = self.history.pop()\n            m = next(x for x in self.migrations if x.rev == rev)\n            self.schema.append(m.down_sql)\n            self.current_rev = self.history[-1] if self.history else None",
            "runner = MigrationRunner()\nrunner.add(Migration('001', 'create users', 'CREATE TABLE users', 'DROP TABLE users'))\nrunner.add(Migration('002', 'add email col', 'ALTER TABLE users ADD email', 'ALTER TABLE users DROP email'))\nrunner.add(Migration('003', 'add index', 'CREATE INDEX idx_email', 'DROP INDEX idx_email'))",
            "runner.upgrade()\nprint(f'Head: {runner.current_rev}')\nprint(f'Schema ops: {len(runner.schema)}')\nfor s in runner.schema:\n    print(f'  >> {s}')",
            "runner.downgrade()\nprint(f'After downgrade: {runner.current_rev}')\nprint(f'  >> {runner.schema[-1]}')",
        ],
        "decoys": [
            (
                "    def downgrade(self):\n        self.schema = []\n        self.history = []\n        self.current_rev = None",
                "Wiping everything on downgrade isn't a rollback — Alembic steps back one revision at a time, applying only the reverse of the last migration.",
            ),
            (
                "    def upgrade(self):\n        for m in self.migrations:\n            self.schema.append(m.up_sql)\n            self.history.append(m.rev)\n            self.current_rev = m.rev",
                "Re-applying all migrations every time — including already-applied ones — would corrupt the schema. Upgrade must skip revisions already in history.",
            ),
        ],
        "output": "Head: 003\nSchema ops: 3\n  >> CREATE TABLE users\n  >> ALTER TABLE users ADD email\n  >> CREATE INDEX idx_email\nAfter downgrade: 002\n  >> DROP INDEX idx_email",
        "hint": "Alembic migrations form a linked chain of revisions. Upgrade walks forward applying new changes; downgrade walks backward, applying the reverse SQL for each step.",
        "success": "You've simulated Alembic's migration runner — version-controlled schema evolution for zero-downtime deploys!",
    },
    # ── Day 40: Milestone Project 7 ──────────────────────────────────────
    {
        "day": 40,
        "title": "Milestone 7: Async ORM & Migration Engine",
        "mission": "Combine the Identity Map session, connection pool, and migration runner into a unified data layer engine. Create the schema via migration, connect via pool, then use the session's identity map to track entities.",
        "labels": [
            "Define the mini connection pool",
            "Define the session with identity map",
            "Define the migration runner",
            "Run migrations to create the schema",
            "Use the pool and session to manage entities",
            "Commit and display all operations",
        ],
        "blocks": [
            "class Pool:\n    def __init__(self):\n        self.conns = 0\n    def connect(self):\n        self.conns += 1\n        return f'conn-{self.conns}'\n    def release(self):\n        self.conns -= 1",
            "class Session:\n    def __init__(self, conn):\n        self.conn = conn\n        self.identity_map = {}\n        self.ops = []\n    def add(self, id, name):\n        if id not in self.identity_map:\n            self.identity_map[id] = name\n            self.ops.append(f'INSERT {name}')\n    def get(self, id):\n        return self.identity_map.get(id)\n    def commit(self):\n        return self.ops[:]",
            "class Migrator:\n    def __init__(self):\n        self.applied = []\n    def run(self, version, sql):\n        self.applied.append(sql)\n        return sql",
            "mg = Migrator()\nprint(mg.run('v1', 'CREATE TABLE users(id, name)'))\nprint(mg.run('v2', 'ALTER TABLE users ADD email'))",
            "pool = Pool()\nconn = pool.connect()\nprint(f'Connection: {conn}')\nsession = Session(conn)\nsession.add(1, 'Alice')\nsession.add(2, 'Bob')\nprint(f'Same identity: {session.get(1) is session.get(1)}')",
            "for op in session.commit():\n    print(op)\npool.release()\nprint(f'Active connections: {pool.conns}')",
        ],
        "decoys": [
            (
                "class Session:\n    def __init__(self, conn):\n        self.conn = conn\n        self.ops = []\n    def add(self, id, name):\n        self.ops.append(f'INSERT {name}')\n    def commit(self):\n        return self.ops[:]",
                "Without an identity map, adding the same entity twice would produce duplicate INSERTs — the identity map prevents this by tracking seen IDs.",
            ),
        ],
        "output": "CREATE TABLE users(id, name)\nALTER TABLE users ADD email\nConnection: conn-1\nSame identity: True\nINSERT Alice\nINSERT Bob\nActive connections: 0",
        "hint": "A complete data layer combines connection pooling for resource management, an identity map session for object tracking, and a migration runner for schema evolution.",
        "success": "Milestone 7 complete! You've unified pooling, ORM sessions, and migrations into a production data engine!",
    },
    # ── Day 41: Distributed Task Queue Architecture: Celery & Broker ─────
    {
        "day": 41,
        "title": "Task Queue & Broker Simulator",
        "mission": "Simulate Celery's distributed task queue architecture. Build a broker that accepts tasks, a worker that pulls and executes them, and a result backend that stores outcomes.",
        "labels": [
            "Define the Broker with a task queue",
            "Define the Worker that consumes from the broker",
            "Define the ResultBackend to store outcomes",
            "Register tasks and enqueue work",
            "Run the worker to process all tasks",
            "Print results from the backend",
        ],
        "blocks": [
            "class Broker:\n    def __init__(self):\n        self.queue = []\n    def enqueue(self, task_name, args):\n        task_id = f'task-{len(self.queue)+1}'\n        self.queue.append({'id': task_id, 'name': task_name, 'args': args})\n        return task_id\n    def dequeue(self):\n        return self.queue.pop(0) if self.queue else None",
            "class Worker:\n    def __init__(self, broker, backend, registry):\n        self.broker = broker\n        self.backend = backend\n        self.registry = registry\n    def run(self):\n        while True:\n            task = self.broker.dequeue()\n            if not task:\n                break\n            fn = self.registry[task['name']]\n            result = fn(*task['args'])\n            self.backend.store(task['id'], result)",
            "class ResultBackend:\n    def __init__(self):\n        self.results = {}\n    def store(self, task_id, result):\n        self.results[task_id] = result\n    def get(self, task_id):\n        return self.results.get(task_id)",
            "registry = {\n    'add': lambda a, b: a + b,\n    'multiply': lambda a, b: a * b,\n}\nbroker = Broker()\nbackend = ResultBackend()",
            "id1 = broker.enqueue('add', (3, 4))\nid2 = broker.enqueue('multiply', (5, 6))\nworker = Worker(broker, backend, registry)\nworker.run()",
            "print(f'{id1}: {backend.get(id1)}')\nprint(f'{id2}: {backend.get(id2)}')\nprint(f'Queue empty: {broker.dequeue() is None}')",
        ],
        "decoys": [
            (
                "class Worker:\n    def __init__(self, broker, backend, registry):\n        self.broker = broker\n        self.backend = backend\n        self.registry = registry\n    def run(self):\n        task = self.broker.dequeue()\n        fn = self.registry[task['name']]\n        result = fn(*task['args'])\n        self.backend.store(task['id'], result)",
                "Processing only one task per run() call leaves remaining tasks stuck in the queue — a real Celery worker continuously drains the broker.",
            ),
            (
                "    def enqueue(self, task_name, args):\n        self.queue.append({'name': task_name, 'args': args})\n        return 'task'",
                "Without unique task IDs, there's no way to look up results later — Celery assigns a UUID to every task for traceability.",
            ),
        ],
        "output": "task-1: 7\ntask-2: 30\nQueue empty: True",
        "hint": "Celery's architecture has three parts: a broker (message queue), workers (consumers), and a result backend. Tasks flow from broker → worker → backend.",
        "success": "You've built the Celery trinity — broker, worker, and result backend working in concert!",
    },
    # ── Day 42: Celery Canvas: Chains, Groups, Chords ────────────────────
    {
        "day": 42,
        "title": "Task Canvas: Chains, Groups & Chords",
        "mission": "Simulate Celery Canvas primitives. Build chain (sequential), group (parallel), and chord (group + callback) to compose complex task workflows.",
        "labels": [
            "Define the task registry with sample functions",
            "Implement chain — sequential pipeline",
            "Implement group — parallel fan-out",
            "Implement chord — group then callback",
            "Execute a chain and a group",
            "Execute a chord and print all results",
        ],
        "blocks": [
            "tasks = {\n    'double': lambda x: x * 2,\n    'add10': lambda x: x + 10,\n    'square': lambda x: x ** 2,\n    'sum_all': lambda *args: sum(args),\n}",
            "def chain(input_val, *task_names):\n    result = input_val\n    for name in task_names:\n        result = tasks[name](result)\n    return result",
            "def group(task_name, inputs):\n    return [tasks[task_name](x) for x in inputs]",
            "def chord(task_name, inputs, callback_name):\n    results = group(task_name, inputs)\n    return tasks[callback_name](*results)",
            "chain_result = chain(3, 'double', 'add10', 'square')\nprint(f'Chain(3 -> double -> add10 -> square): {chain_result}')\ngroup_result = group('double', [1, 2, 3])\nprint(f'Group(double [1,2,3]): {group_result}')",
            "chord_result = chord('square', [2, 3, 4], 'sum_all')\nprint(f'Chord(square [2,3,4] -> sum_all): {chord_result}')",
        ],
        "decoys": [
            (
                "def chain(input_val, *task_names):\n    results = []\n    for name in task_names:\n        results.append(tasks[name](input_val))\n    return results[-1]",
                "Running each task on the original input rather than piping the previous result breaks the chain — each step must feed into the next.",
            ),
            (
                "def chord(task_name, inputs, callback_name):\n    for x in inputs:\n        tasks[task_name](x)\n    return tasks[callback_name](0)",
                "Discarding group results and passing 0 to the callback defeats the chord pattern — the callback must receive all group results as arguments.",
            ),
        ],
        "output": "Chain(3 -> double -> add10 -> square): 256\nGroup(double [1,2,3]): [2, 4, 6]\nChord(square [2,3,4] -> sum_all): 29",
        "hint": "Chain pipes output → input sequentially. Group fans out the same task to many inputs in parallel. Chord runs a group, then feeds all results into a callback.",
        "success": "You've mastered Celery's Canvas primitives — the building blocks for complex distributed workflows!",
    },
    # ── Day 43: Reliability, Idempotency & Visibility Timeouts ───────────
    {
        "day": 43,
        "title": "Idempotent Task Processor",
        "mission": "Build an idempotent task processor using idempotency keys. Ensure that retrying the same task (same key) returns the cached result instead of re-executing — preventing duplicate side effects.",
        "labels": [
            "Define the IdempotentProcessor with a result cache",
            "Implement the process method with idempotency check",
            "Implement visibility timeout simulation",
            "Register a task that tracks execution count",
            "Process the same task three times with the same key",
            "Process with a new key and show execution counts",
        ],
        "blocks": [
            "class IdempotentProcessor:\n    def __init__(self):\n        self.cache = {}\n        self.in_flight = {}\n        self.exec_count = 0",
            "    def process(self, key, fn, *args):\n        if key in self.cache:\n            return ('cached', self.cache[key])\n        if key in self.in_flight:\n            return ('in_flight', None)\n        self.in_flight[key] = True\n        self.exec_count += 1\n        result = fn(*args)\n        self.cache[key] = result\n        del self.in_flight[key]\n        return ('executed', result)",
            "    def timeout_requeue(self, key):\n        if key in self.in_flight:\n            del self.in_flight[key]\n            return f'Key {key} re-queued after timeout'\n        return f'Key {key} not in flight'",
            "proc = IdempotentProcessor()\ndef charge_payment(amount):\n    return f'Charged ${amount}'",
            "r1 = proc.process('pay-001', charge_payment, 50)\nprint(f'First:  {r1}')\nr2 = proc.process('pay-001', charge_payment, 50)\nprint(f'Retry:  {r2}')\nr3 = proc.process('pay-001', charge_payment, 50)\nprint(f'Again:  {r3}')",
            "r4 = proc.process('pay-002', charge_payment, 75)\nprint(f'New:    {r4}')\nprint(f'Total executions: {proc.exec_count}')",
        ],
        "decoys": [
            (
                "    def process(self, key, fn, *args):\n        self.exec_count += 1\n        result = fn(*args)\n        self.cache[key] = result\n        return ('executed', result)",
                "Executing every time regardless of the cache means retries trigger duplicate charges — the idempotency check must happen BEFORE execution.",
            ),
            (
                "    def process(self, key, fn, *args):\n        if key in self.cache:\n            del self.cache[key]\n        result = fn(*args)\n        self.exec_count += 1\n        self.cache[key] = result\n        return ('executed', result)",
                "Deleting the cache entry before re-executing defeats idempotency — the cached result must be returned without re-running the function.",
            ),
        ],
        "output": "First:  ('executed', 'Charged $50')\nRetry:  ('cached', 'Charged $50')\nAgain:  ('cached', 'Charged $50')\nNew:    ('executed', 'Charged $75')\nTotal executions: 2",
        "hint": "Idempotency keys ensure that retrying a task with the same key returns the previous result without re-executing. This prevents double charges, duplicate emails, etc.",
        "success": "You've built an idempotent processor — the key to reliable distributed systems that handle retries safely!",
    },
    # ── Day 44: Dead-Letter Queues, Monitoring & Flower Observability ────
    {
        "day": 44,
        "title": "Dead-Letter Queue & Retry Monitor",
        "mission": "Build a task processor with retry limits and a dead-letter queue (DLQ). Failed tasks get retried up to a max count, then moved to the DLQ for manual inspection. Track metrics for observability.",
        "labels": [
            "Define the TaskProcessor with main and dead-letter queues",
            "Implement enqueue and the process loop with retries",
            "Implement the metrics dashboard",
            "Set up tasks — some will fail",
            "Process all tasks through the retry engine",
            "Display the monitoring dashboard",
        ],
        "blocks": [
            "class TaskProcessor:\n    def __init__(self, max_retries=2):\n        self.queue = []\n        self.dlq = []\n        self.completed = []\n        self.max_retries = max_retries\n        self.metrics = {'processed': 0, 'retried': 0, 'dead': 0}",
            "    def enqueue(self, name, fn):\n        self.queue.append({'name': name, 'fn': fn, 'retries': 0})\n    def process(self):\n        while self.queue:\n            task = self.queue.pop(0)\n            self.metrics['processed'] += 1\n            try:\n                result = task['fn']()\n                self.completed.append((task['name'], result))\n            except Exception:\n                task['retries'] += 1\n                if task['retries'] <= self.max_retries:\n                    self.metrics['retried'] += 1\n                    self.queue.append(task)\n                else:\n                    self.metrics['dead'] += 1\n                    self.dlq.append(task['name'])",
            "    def dashboard(self):\n        print(f\"Processed: {self.metrics['processed']}\")\n        print(f\"Retried: {self.metrics['retried']}\")\n        print(f\"Dead-lettered: {self.metrics['dead']}\")\n        print(f'Completed: {[c[0] for c in self.completed]}')\n        print(f'DLQ: {self.dlq}')",
            "tp = TaskProcessor(max_retries=2)\ntp.enqueue('send_email', lambda: 'sent')\ntp.enqueue('charge_card', lambda: (_ for _ in ()).throw(RuntimeError('declined')))\ntp.enqueue('gen_report', lambda: 'done')",
            "tp.process()",
            "tp.dashboard()",
        ],
        "decoys": [
            (
                "    def process(self):\n        while self.queue:\n            task = self.queue.pop(0)\n            self.metrics['processed'] += 1\n            try:\n                result = task['fn']()\n                self.completed.append((task['name'], result))\n            except Exception:\n                self.dlq.append(task['name'])",
                "Sending failed tasks straight to the DLQ without retrying wastes recovery opportunities — tasks should be retried up to max_retries before dead-lettering.",
            ),
            (
                "    def process(self):\n        while self.queue:\n            task = self.queue.pop(0)\n            try:\n                result = task['fn']()\n                self.completed.append((task['name'], result))\n            except Exception:\n                task['retries'] += 1\n                self.queue.append(task)",
                "Retrying forever without a max limit means a permanently failing task creates an infinite loop — the DLQ is the safety valve.",
            ),
        ],
        "output": "Processed: 6\nRetried: 2\nDead-lettered: 1\nCompleted: ['send_email', 'gen_report']\nDLQ: ['charge_card']",
        "hint": "A dead-letter queue catches tasks that fail beyond the retry limit. Monitoring metrics (processed, retried, dead-lettered) give you observability into queue health — just like Flower does for Celery.",
        "success": "You've built a retry engine with DLQ and metrics — the observability trifecta for production task queues!",
    },
    # ── Day 45: Milestone Project 8 ──────────────────────────────────────
    {
        "day": 45,
        "title": "Milestone 8: Resilient Task Queue & Workflow Engine",
        "mission": "Combine the task broker, canvas primitives (chain/group), idempotency protection, and dead-letter queue into a full resilient workflow engine. Demonstrate a workflow that processes payments reliably.",
        "labels": [
            "Define the workflow engine with idempotency and DLQ",
            "Implement chain and group execution with retry logic",
            "Implement the run_workflow orchestrator",
            "Define the payment processing workflow",
            "Execute the workflow and show results",
            "Display engine stats and DLQ",
        ],
        "blocks": [
            "class WorkflowEngine:\n    def __init__(self, max_retries=1):\n        self.cache = {}\n        self.dlq = []\n        self.log = []\n        self.max_retries = max_retries",
            "    def run_task(self, key, fn, *args):\n        if key in self.cache:\n            self.log.append(f'CACHED {key}')\n            return self.cache[key]\n        for attempt in range(self.max_retries + 1):\n            try:\n                result = fn(*args)\n                self.cache[key] = result\n                self.log.append(f'OK {key}')\n                return result\n            except Exception:\n                pass\n        self.dlq.append(key)\n        self.log.append(f'DLQ {key}')\n        return None\n    def chain(self, tasks):\n        val = None\n        for key, fn in tasks:\n            val = self.run_task(key, fn, val) if val else self.run_task(key, fn)\n            if val is None:\n                return None\n        return val\n    def group(self, tasks):\n        return [self.run_task(k, fn) for k, fn in tasks]",
            "    def run_workflow(self, name, steps):\n        results = []\n        for step_type, step_data in steps:\n            if step_type == 'chain':\n                results.append(self.chain(step_data))\n            elif step_type == 'group':\n                results.append(self.group(step_data))\n        return results",
            "engine = WorkflowEngine(max_retries=1)\nworkflow = [\n    ('chain', [\n        ('validate', lambda: 'order-100'),\n        ('charge', lambda oid: f'charged-{oid}'),\n    ]),\n    ('group', [\n        ('email', lambda: 'email-sent'),\n        ('sms', lambda: 'sms-sent'),\n    ]),\n]",
            "results = engine.run_workflow('payment', workflow)\nprint(f'Chain result: {results[0]}')\nprint(f'Group result: {results[1]}')\nretry = engine.run_task('validate', lambda: 'order-100')\nprint(f'Idempotent retry: {retry}')",
            "print(f'Log: {engine.log}')\nprint(f'DLQ: {engine.dlq}')\nprint(f'Cached keys: {sorted(engine.cache.keys())}')",
        ],
        "decoys": [
            (
                "    def run_task(self, key, fn, *args):\n        result = fn(*args)\n        self.log.append(f'OK {key}')\n        return result",
                "No idempotency cache and no retry/DLQ logic means tasks re-execute on every call and failures crash the entire workflow — both protections are essential.",
            ),
            (
                "    def chain(self, tasks):\n        results = []\n        for key, fn in tasks:\n            results.append(self.run_task(key, fn))\n        return results[-1]",
                "Not piping the previous result into the next task breaks the chain pattern — each step must receive the output of its predecessor.",
            ),
        ],
        "output": "Chain result: charged-order-100\nGroup result: ['email-sent', 'sms-sent']\nIdempotent retry: order-100\nLog: ['OK validate', 'OK charge', 'OK email', 'OK sms', 'CACHED validate']\nDLQ: []\nCached keys: ['charge', 'email', 'sms', 'validate']",
        "hint": "A resilient workflow engine combines: chains for sequential pipelines, groups for parallel fan-out, idempotency keys for safe retries, and a DLQ for tasks that exhaust retries.",
        "success": "Milestone 8 complete! You've built a production-grade workflow engine with idempotency, retries, and dead-letter handling!",
    },
]
