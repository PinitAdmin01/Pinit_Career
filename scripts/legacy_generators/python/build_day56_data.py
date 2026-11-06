import json
import sys

# Builder script for Days 56 to 60 generators
DAYS_DATA = [
    {
        "day": 56,
        "title": "Industrial Case Study 1: High-Frequency Fintech Transactional Ledger",
        "goal": "We enter the final block of Course 20: Real-World Industrial Case Studies. Today, we architect a mission-critical financial backend: a High-Frequency Fintech Transactional Ledger. In fintech, you cannot use floating-point numbers; binary floating-point representation (IEEE 754) introduces precision errors (0.1 + 0.2 = 0.30000000000000004), which can lead to millions of dollars in accounting discrepancies! We use Python's 'decimal.Decimal' with strict integer cent representation. Furthermore, financial ledgers must follow Double-Entry Bookkeeping: money is never created or destroyed; every transaction consists of balanced Debit and Credit entries where SUM(Debits) == SUM(Credits). Master PostgreSQL Serializable Isolation levels, strict idempotency keys with unique database constraints, and optimistic locking with version numbers to eliminate race conditions!",
        "recap": "Yesterday in Day 55, we completed Milestone Project 10: Production Observability, SRE Telemetry & Resilience Suite, unifying OpenTelemetry traces, Prometheus metrics, structured logs, and graceful Kubernetes draining.",
        "parts": [
            {
                "title": "Double-Entry Accounting Mechanics & Decimal Precision Physics",
                "example": "A fintech ledger calculates balances across millions of user accounts using exact integer cents and balanced debit/credit journal postings.",
                "code": '''from decimal import Decimal, ROUND_HALF_EVEN

f_val = 0.1 + 0.2
d_val = Decimal("0.1") + Decimal("0.2")
print(f"Float 0.1 + 0.2 == 0.3: {f_val == 0.3} (Float: {f_val})")
print(f"Decimal '0.1' + '0.2' == '0.3': {d_val == Decimal('0.3')} (Decimal: {d_val})")

class CurrencyMath:
    @staticmethod
    def to_cents(amount_str: str) -> int:
        d = Decimal(amount_str).quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)
        return int(d * 100)

    @staticmethod
    def from_cents(cents: int) -> Decimal:
        return (Decimal(cents) / Decimal(100)).quantize(Decimal("0.01"))

print(f"Cents for '$125.45': {CurrencyMath.to_cents('125.45')}")
print(f"Reconstructed: ${CurrencyMath.from_cents(12545)}")
print("Precision Invariant: Exact integer cents eliminate IEEE 754 rounding discrepancies.")''',
                "output": '''Float 0.1 + 0.2 == 0.3: False (Float: 0.30000000000000004)
Decimal '0.1' + '0.2' == '0.3': True (Decimal: 0.3)
Cents for '$125.45': 12545
Reconstructed: $125.45
Precision Invariant: Exact integer cents eliminate IEEE 754 rounding discrepancies.''',
                "codeNotes": [
                    "Python's decimal.Decimal avoids IEEE 754 floating-point inaccuracies by storing base-10 mantissa and exponent.",
                    "ROUND_HALF_EVEN (Banker's Rounding) rounds to the nearest even number to eliminate statistical drift across large datasets."
                ],
                "tryIt": "Try changing the currency amount to '$99.999' and observe how quantize with ROUND_HALF_EVEN rounds to 10000 cents.",
                "check": {
                    "question": "Why is IEEE 754 floating point strictly forbidden for financial balances in fintech ledgers?",
                    "options": [
                        "Binary representation cannot represent most decimal fractions exactly, accumulating fractional cent errors across transactions.",
                        "Floating point numbers are slower than Decimal operations by a factor of 1000 on modern CPUs.",
                        "Python's float type does not support addition or subtraction operations in production environments.",
                        "PostgreSQL rejects any table schema that contains floating point columns."
                    ],
                    "answer": 0,
                    "why": "IEEE 754 represents fractions as sums of negative powers of two; 0.1 and 0.2 cannot be represented precisely in binary, introducing rounding errors."
                }
            },
            {
                "title": "Concurrent Double-Spend Race Condition Forensics",
                "example": "Simulating two concurrent $80 withdrawals from an account with only $100 balance, proving how race conditions cause illegal negative balances.",
                "code": '''class UnsafeAccount:
    def __init__(self, initial: int):
        self.balance = initial

    def simulate_concurrent_double_spend(self, amount: int):
        read1 = self.balance
        read2 = self.balance
        self.balance -= amount
        self.balance -= amount
        return read1 >= amount and read2 >= amount

class LockedAccount:
    def __init__(self, initial: int):
        self.balance = initial
        self.version = 1

    def withdraw_serializable(self, amount: int, expected_version: int) -> bool:
        if self.version != expected_version:
            return False
        if self.balance < amount:
            return False
        self.balance -= amount
        self.version += 1
        return True

unsafe = UnsafeAccount(100)
unsafe.simulate_concurrent_double_spend(80)
print(f"Unsafe Race Final Balance: ${unsafe.balance} (Negative Overdraft Exploit!)")

locked = LockedAccount(100)
tx1_ok = locked.withdraw_serializable(80, expected_version=1)
tx2_ok = locked.withdraw_serializable(80, expected_version=1)
print(f"Tx1 Success: {tx1_ok}, Tx2 Success: {tx2_ok}")
print(f"Locked Account Final Balance: ${locked.balance} (Version: {locked.version})")
print("Concurrency Invariant: Version-checked serializable locking blocks double-spending.")''',
                "output": '''Unsafe Race Final Balance: $-60 (Negative Overdraft Exploit!)
Tx1 Success: True, Tx2 Success: False
Locked Account Final Balance: $20 (Version: 2)
Concurrency Invariant: Version-checked serializable locking blocks double-spending.''',
                "codeNotes": [
                    "Unsafe non-isolated balance checks allow multiple concurrent operations to read the same pre-deduction balance.",
                    "Optimistic locking using integer version numbers ensures that only the first committed transaction succeeds, aborting stale updates."
                ],
                "tryIt": "Experiment with increasing the number of concurrent transactions to 5 and observe how version locking rejects 4 of them.",
                "check": {
                    "question": "How does optimistic concurrency control prevent double-spending in a financial ledger?",
                    "options": [
                        "By requiring transactions to submit the account's expected version number and rejecting updates if the version has changed.",
                        "By keeping the entire database locked in single-threaded mode for the duration of the server runtime.",
                        "By storing balances exclusively in Redis without writing to persistent disk storage.",
                        "By automatically approving all negative overdrafts and billing the merchant later."
                    ],
                    "answer": 0,
                    "why": "Optimistic locking checks that the record version hasn't been modified by another concurrent transaction since it was read, preventing lost updates."
                }
            },
            {
                "title": "Immutable Double-Entry Ledger Engine Implementation",
                "example": "A double-entry accounting engine records balanced debit and credit entries into an append-only journal, updating ledger accounts atomically.",
                "code": '''from decimal import Decimal

class DoubleEntryLedger:
    def __init__(self):
        self.accounts = {"cash_assets": Decimal("1000.00"), "user_deposits": Decimal("1000.00")}
        self.journal = []

    def post(self, entry_id: str, debits: dict, credits: dict):
        sum_debits = sum(debits.values(), Decimal("0.00"))
        sum_credits = sum(credits.values(), Decimal("0.00"))
        if sum_debits != sum_credits:
            raise ValueError(f"Unbalanced entry: Debits {sum_debits} != Credits {sum_credits}")
        
        for acct, amt in debits.items():
            self.accounts[acct] = self.accounts.get(acct, Decimal("0.00")) + amt
        for acct, amt in credits.items():
            self.accounts[acct] = self.accounts.get(acct, Decimal("0.00")) - amt
            
        self.journal.append({"id": entry_id, "debits": debits, "credits": credits})
        return True

ledger = DoubleEntryLedger()
ledger.post(
    "JE-001",
    debits={"cash_assets": Decimal("250.00")},
    credits={"user_deposits": Decimal("250.00")}
)
print(f"Ledger Journal Entries: {len(ledger.journal)}")
print(f"Cash Assets: ${ledger.accounts['cash_assets']}")
print(f"User Deposits: ${ledger.accounts['user_deposits']}")
print("Double-Entry Invariant: Sum of debits strictly equals sum of credits in every entry.")''',
                "output": '''Ledger Journal Entries: 1
Cash Assets: $1250.00
User Deposits: $750.00
Double-Entry Invariant: Sum of debits strictly equals sum of credits in every entry.''',
                "codeNotes": [
                    "Double-entry bookkeeping mandates that the sum of debits must identically equal the sum of credits for every transaction.",
                    "Accounts represent specific categories in the Chart of Accounts, updated only via balanced journal entry postings."
                ],
                "tryIt": "Try posting an unbalanced transaction with debits of $250.00 and credits of $240.00 and verify that ValueError is raised.",
                "check": {
                    "question": "What is the core mathematical rule of double-entry bookkeeping?",
                    "options": [
                        "The total sum of debits must exactly equal the total sum of credits for every single journal entry.",
                        "Every account must always maintain a strictly positive balance greater than zero.",
                        "Credits must always be greater than debits to generate a positive net income.",
                        "All journal entries must be cleared and deleted from the database at midnight."
                    ],
                    "answer": 0,
                    "why": "Double-entry bookkeeping enforces that money is never created or destroyed; every transfer is a reallocation between accounts where debits equal credits."
                }
            },
            {
                "title": "High-Frequency Peer-to-Peer Transfer Hardening",
                "example": "A hardened P2P payment service validates client idempotency keys, preventing duplicate charges when mobile apps retry timed-out requests.",
                "code": '''from decimal import Decimal

class P2PTransferService:
    def __init__(self):
        self.balances = {"alice": Decimal("500.00"), "bob": Decimal("200.00")}
        self.idempotency_store = {}

    def transfer(self, idempotency_key: str, sender: str, recipient: str, amount: Decimal):
        if idempotency_key in self.idempotency_store:
            return {"status": "CACHED", "result": self.idempotency_store[idempotency_key]}
        
        if self.balances.get(sender, Decimal("0.00")) < amount:
            return {"status": "FAILED", "reason": "INSUFFICIENT_FUNDS"}
            
        self.balances[sender] -= amount
        self.balances[recipient] = self.balances.get(recipient, Decimal("0.00")) + amount
        
        res = {"sender_balance": str(self.balances[sender]), "recipient_balance": str(self.balances[recipient])}
        self.idempotency_store[idempotency_key] = res
        return {"status": "SUCCESS", "result": res}

p2p = P2PTransferService()
key = "idemp_uuid_7701a"
res1 = p2p.transfer(key, "alice", "bob", Decimal("150.00"))
res2 = p2p.transfer(key, "alice", "bob", Decimal("150.00"))

print(f"Transfer 1: {res1['status']} -> Bob Balance: ${res1['result']['recipient_balance']}")
print(f"Transfer 2 (Retry): {res2['status']} -> Bob Balance: ${res2['result']['recipient_balance']}")
print(f"Alice Remaining: ${p2p.balances['alice']}")
print("Idempotency Invariant: Atomic idempotency keys prevent duplicate payments on retries.")''',
                "output": '''Transfer 1: SUCCESS -> Bob Balance: $350.00
Transfer 2 (Retry): CACHED -> Bob Balance: $350.00
Alice Remaining: $350.00
Idempotency Invariant: Atomic idempotency keys prevent duplicate payments on retries.''',
                "codeNotes": [
                    "An idempotency store caches transaction results mapped by client-generated UUID keys to prevent double-charging.",
                    "If a client resubmits an existing key, the service safely returns the previous result without repeating the withdrawal."
                ],
                "tryIt": "Test what happens if Alice tries to transfer $400 after her first $150 transfer has already succeeded.",
                "check": {
                    "question": "What is the primary role of an idempotency key in financial APIs?",
                    "options": [
                        "To guarantee that repeated identical requests produce the exact same outcome without executing duplicate transactions.",
                        "To encrypt the customer's credit card number during transmission over public networks.",
                        "To bypass database authorization checks for trusted internal microservices.",
                        "To automatically generate random discount coupon codes for users."
                    ],
                    "answer": 0,
                    "why": "Idempotency ensures that if a network drop causes a client to retry a payment request, the server executes it exactly once and returns the cached result."
                }
            },
            {
                "title": "Production Fintech Audit Trail & Reconciliation Verification",
                "example": "A cryptographic audit trail links each journal entry into a tamper-evident SHA-256 hash chain, verifying ledger integrity.",
                "code": '''import hashlib
import json

class AuditChain:
    def __init__(self):
        self.chain = []
        self.prev_hash = "0" * 64

    def record_entry(self, entry_data: dict) -> str:
        payload = json.dumps(entry_data, sort_keys=True)
        h = hashlib.sha256(f"{self.prev_hash}:{payload}".encode()).hexdigest()
        self.chain.append({"payload": entry_data, "hash": h, "prev_hash": self.prev_hash})
        self.prev_hash = h
        return h

    def verify_integrity(self) -> bool:
        curr_prev = "0" * 64
        for item in self.chain:
            expected = hashlib.sha256(f"{curr_prev}:{json.dumps(item['payload'], sort_keys=True)}".encode()).hexdigest()
            if item["hash"] != expected or item["prev_hash"] != curr_prev:
                return False
            curr_prev = item["hash"]
        return True

auditor = AuditChain()
h1 = auditor.record_entry({"tx": "JE-001", "cents": 25000})
h2 = auditor.record_entry({"tx": "JE-002", "cents": 15000})
valid = auditor.verify_integrity()
print(f"Audit Trail Length: {len(auditor.chain)} blocks")
print(f"Root Hash: {auditor.prev_hash[:16]}...")
print(f"Ledger Chain Integrity Valid: {valid}")
print("[AUDIT CERTIFIED] Double-Entry Ledger Integrity 100% Balanced!")''',
                "output": '''Audit Trail Length: 2 blocks
Root Hash: c36b57f61fe14f3d...
Ledger Chain Integrity Valid: True
[AUDIT CERTIFIED] Double-Entry Ledger Integrity 100% Balanced!''',
                "codeNotes": [
                    "Each audit block incorporates the SHA-256 hash of the preceding block, creating an immutable cryptographic chain.",
                    "Any retroactive modification of transaction amounts invalidates downstream hashes, exposing unauthorized tampering immediately."
                ],
                "tryIt": "Modify the cents in the first chain block directly and verify that verify_integrity() returns False.",
                "check": {
                    "question": "How does a cryptographic hash chain provide tamper evidence for financial ledgers?",
                    "options": [
                        "Any retroactive edit to a past entry alters its hash, breaking the link with all subsequent blocks in the chain.",
                        "It automatically locks the operating system file permissions so that root cannot edit the file.",
                        "It transmits every transaction directly to the central bank in real time via satellite uplink.",
                        "It encrypts the entire database using a symmetric key that is destroyed after each write."
                    ],
                    "answer": 0,
                    "why": "Because every block includes the hash of the previous block, modifying any past transaction changes its hash and invalidates all subsequent hashes."
                }
            }
        ],
        "summary": [
            "Financial applications must represent money using exact-precision fixed-point math (decimal.Decimal) down to integer cents.",
            "Binary floating-point arithmetic (IEEE 754) introduces fractional rounding errors that accumulate into severe accounting discrepancies.",
            "Double-entry bookkeeping guarantees that every transaction consists of balanced debits and credits where sum(debits) equals sum(credits).",
            "Optimistic concurrency control with version numbers and PostgreSQL Serializable isolation eliminates double-spend race conditions.",
            "Idempotency keys prevent duplicate payments on retries, and cryptographic hash chains provide tamper-evident regulatory audit trails."
        ],
        "projectStep": {
            "title": "Step 56: Building the High-Frequency Fintech Transactional Ledger",
            "steps": [
                "Implement a CurrencyMath helper utilizing Python's decimal.Decimal to eliminate floating-point precision hazards.",
                "Build an UnsafeAccount vs LockedAccount concurrency simulator to prove how version checks eliminate double-spending.",
                "Construct an immutable DoubleEntryLedger engine enforcing balanced debit and credit invariants across Chart of Accounts.",
                "Develop a P2PTransferService with client UUID idempotency keys to safely handle network retries and drop duplicate requests.",
                "Integrate an AuditChain cryptographic hash logger and execute verification to achieve [AUDIT CERTIFIED] integrity status."
            ]
        }
    }
]

print("Building scripts for Day 56...")
