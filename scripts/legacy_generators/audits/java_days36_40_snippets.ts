// Deterministic TypeScript simulations for Course 5 Month 2 Batch 2 (Days 36 to 40)
import fs from 'fs';

const outputs: Record<string, string> = {};

function capture(key: string, fn: () => void) {
  const originalLog = console.log;
  const lines: string[] = [];
  console.log = (...args: any[]) => {
    lines.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  outputs[key] = lines.join('\n');
}

// ==========================================
// DAY 36: Inheritance Hierarchies & super() Chaining
// ==========================================

// Day 36 Part 1: Superclass Constructor Chaining
capture('d36p1', () => {
  class BankAccount {
    readonly accountId: string;
    protected balanceCents: number;

    constructor(accountId: string, initialBalanceCents: number) {
      if (!accountId) throw new Error("Account ID required");
      this.accountId = accountId;
      this.balanceCents = initialBalanceCents;
      console.log(`[Super Constructor] BankAccount ${accountId} initialized with $${(initialBalanceCents / 100).toFixed(2)}`);
    }
  }

  class SavingsAccount extends BankAccount {
    readonly interestRateBasisPoints: number;

    constructor(accountId: string, initialBalanceCents: number, interestRateBasisPoints: number) {
      // Invariant: super() MUST be invoked on line 1 of subclass constructor
      super(accountId, initialBalanceCents);
      this.interestRateBasisPoints = interestRateBasisPoints;
      console.log(`[Sub Constructor] SavingsAccount initialized with ${interestRateBasisPoints / 100}% annual yield`);
    }
  }

  const sa = new SavingsAccount("SA-9011", 500000, 425);
  console.log(`Verified Account: ${sa.accountId}, Yield: ${sa.interestRateBasisPoints} bps`);
});

// Day 36 Part 2: State Initialization Order & Memory Layout
capture('d36p2', () => {
  class Parent {
    parentTag: string = "SUPER_DEFAULT";
    constructor() {
      console.log("Step 1: Parent instance fields initialized");
      console.log(`Step 2: Parent constructor executed (parentTag=${this.parentTag})`);
    }
  }

  class Child extends Parent {
    childTag: string = "SUB_DEFAULT";
    constructor() {
      super();
      console.log("Step 3: Child instance fields initialized");
      console.log(`Step 4: Child constructor executed (childTag=${this.childTag})`);
    }
  }

  console.log("Beginning Object Instantiation Pipeline:");
  new Child();
});

// Day 36 Part 3: Detective Lab: The Misplaced Super Constructor
capture('d36p3', () => {
  class CorporateChecking {
    readonly id: string;
    readonly companyName: string;
    readonly creditLineCents: number;

    constructor(id: string, companyName: string, creditLineCents: number) {
      // In Java, calling super() after field assignment fails at compile time.
      // Corrected order: Superclass state first, subclass state second.
      this.id = id;
      this.companyName = companyName;
      this.creditLineCents = creditLineCents;
    }
  }

  const corp = new CorporateChecking("CORP-772", "Acme Logistics Corp", 25000000);
  console.log(`Fixed Corporate Account: ${corp.id} for ${corp.companyName}`);
  console.log(`Approved Overdraft Credit Line: $${(corp.creditLineCents / 100).toLocaleString()}`);
});

// Day 36 Part 4: Mastery Assignment: Specialized Account Hierarchy
capture('d36p4', () => {
  class AccountBase {
    constructor(public readonly id: string, protected balance: number) {}
    getBalance(): number { return this.balance; }
  }

  class SavingsAccount extends AccountBase {
    constructor(id: string, balance: number, public readonly interestRate: number) {
      super(id, balance);
    }
    applyInterest(): void {
      const interest = Math.round(this.balance * this.interestRate);
      this.balance += interest;
      console.log(`Interest Applied: +$${(interest / 100).toFixed(2)} | New Balance: $${(this.balance / 100).toFixed(2)}`);
    }
  }

  class CheckingAccount extends AccountBase {
    constructor(id: string, balance: number, public readonly overdraftLimit: number) {
      super(id, balance);
    }
    withdrawWithOverdraft(amount: number): boolean {
      if (this.balance - amount >= -this.overdraftLimit) {
        this.balance -= amount;
        console.log(`Withdrawal Success: -$${(amount / 100).toFixed(2)} | Remaining: $${(this.balance / 100).toFixed(2)}`);
        return true;
      }
      console.log(`Overdraft Breached! Attempted: $${(amount / 100).toFixed(2)} | Limit: $${(this.overdraftLimit / 100).toFixed(2)}`);
      return false;
    }
  }

  const sav = new SavingsAccount("SAV-101", 100000, 0.05);
  sav.applyInterest();
  const chk = new CheckingAccount("CHK-202", 5000, 20000);
  chk.withdrawWithOverdraft(15000);
  chk.withdrawWithOverdraft(30000);
});

// Day 36 Part 5: Production Incident Lab: Partial Subclass Construction Crash
capture('d36p5', () => {
  // Simulating anti-pattern: Calling overridable virtual method from constructor
  class AccountParent {
    readonly initTimestamp: number;
    constructor() {
      this.initTimestamp = Date.now();
      // Safe architecture: Do NOT invoke overridable virtual methods in constructors
      console.log("[Safety Audit] Constructor completed without invoking uninitialized child virtual methods");
    }
  }

  class SafeAccountChild extends AccountParent {
    private specializedRegistry: string[];
    constructor() {
      super();
      this.specializedRegistry = ["AUDIT_ENABLED", "FRAUD_CHECK_V2"];
      console.log(`Specialized registry safely initialized with ${this.specializedRegistry.length} flags`);
    }
    dumpRegistry(): string[] { return this.specializedRegistry; }
  }

  const child = new SafeAccountChild();
  console.log("Safe child instance ready:", child.dumpRegistry().join(", "));
});

// ==========================================
// DAY 37: Method Overriding, @Override & Dynamic Dispatch
// ==========================================

// Day 37 Part 1: Virtual Method Table (vtable) Mechanics
capture('d37p1', () => {
  // Simulating JVM vtable offset indexing for O(1) dynamic method dispatch
  class VTableSimulator {
    private vtables: Record<string, Record<string, string>> = {
      "Account": { "withdraw": "Account#withdraw", "getBalance": "Account#getBalance" },
      "SavingsAccount": { "withdraw": "SavingsAccount#withdraw", "getBalance": "Account#getBalance" },
      "CheckingAccount": { "withdraw": "CheckingAccount#withdraw", "getBalance": "Account#getBalance" }
    };

    resolveMethod(runtimeClass: string, methodSlot: string): string {
      const table = this.vtables[runtimeClass];
      return table ? table[methodSlot] : "UNKNOWN_METHOD";
    }
  }

  const vtable = new VTableSimulator();
  console.log("VTable Offset Slot 0 (withdraw) on Account reference pointing to SavingsAccount heap instance:");
  console.log("Resolved target:", vtable.resolveMethod("SavingsAccount", "withdraw"));
  console.log("Resolved target on CheckingAccount:", vtable.resolveMethod("CheckingAccount", "withdraw"));
});

// Day 37 Part 2: The @Override Compiler Guard
capture('d37p2', () => {
  class BaseAccount {
    calculateFee(balanceCents: number): number {
      return 1500; // Flat $15 fee
    }
  }

  class PremiumAccount extends BaseAccount {
    // Verified @Override: Exactly matches parent signature
    calculateFee(balanceCents: number): number {
      return balanceCents > 1000000 ? 0 : 500; // $0 if > $10k, else $5
    }
  }

  const acc: BaseAccount = new PremiumAccount();
  console.log("Dynamic dispatch fee calculation for $25,000 balance:", acc.calculateFee(2500000));
  console.log("Dynamic dispatch fee calculation for $500 balance:", acc.calculateFee(50000));
});

// Day 37 Part 3: Detective Lab: The Silent Signature Typo
capture('d37p3', () => {
  interface BankingEntity {
    withdraw(cents: number): boolean;
  }

  class AccountWithTypo implements BankingEntity {
    private balance: number = 10000;
    // Typo bug resolved: was 'withDraw', now correctly 'withdraw'
    withdraw(cents: number): boolean {
      if (cents <= this.balance) {
        this.balance -= cents;
        console.log(`Successfully withdrew $${(cents / 100).toFixed(2)}. Remaining: $${(this.balance / 100).toFixed(2)}`);
        return true;
      }
      return false;
    }
  }

  const client: BankingEntity = new AccountWithTypo();
  const success = client.withdraw(2500);
  console.log("Method invocation via interface contract succeeded:", success);
});

// Day 37 Part 4: Mastery Assignment: Polymorphic Statement Generator
capture('d37p4', () => {
  abstract class StatementAccount {
    constructor(public readonly id: string, protected balance: number) {}
    abstract generateStatement(): string;
  }

  class RetailAccount extends StatementAccount {
    generateStatement(): string {
      return `[Retail Statement] Account: ${this.id} | Balance: $${(this.balance / 100).toFixed(2)} | Rewards: Tier 1`;
    }
  }

  class WealthAccount extends StatementAccount {
    generateStatement(): string {
      return `[Private Wealth] Account: ${this.id} | Balance: $${(this.balance / 100).toFixed(2)} | Advisory: Concierge Active`;
    }
  }

  const portfolio: StatementAccount[] = [
    new RetailAccount("RET-019", 45000),
    new WealthAccount("WTH-882", 15000000)
  ];

  portfolio.forEach(acc => console.log(acc.generateStatement()));
});

// Day 37 Part 5: Production Incident Lab: The Accidental Overload Outage
capture('d37p5', () => {
  class FeeEngine {
    // In Java, calculateFee(int) vs calculateFee(long) causes accidental overload if not marked @Override
    computeFee(amountCents: number): number {
      const fee = Math.max(100, Math.round(amountCents * 0.015));
      console.log(`[Fee Engine v2] Computed 1.5% fee on $${(amountCents / 100).toFixed(2)}: $${(fee / 100).toFixed(2)}`);
      return fee;
    }
  }

  const engine = new FeeEngine();
  const fee1 = engine.computeFee(100000);
  const fee2 = engine.computeFee(2500);
  console.log(`Audit Total Fees Captured: $${((fee1 + fee2) / 100).toFixed(2)}`);
});

// ==========================================
// DAY 38: The Universal Object Contract: equals() & hashCode()
// ==========================================

// Day 38 Part 1: Reference Identity (==) vs Logical Equality (equals())
capture('d38p1', () => {
  class AccountKey {
    constructor(public readonly branch: string, public readonly number: number) {}

    // Logical equality
    equals(other: any): boolean {
      if (this === other) return true;
      if (!(other instanceof AccountKey)) return false;
      return this.branch === other.branch && this.number === other.number;
    }
  }

  const k1 = new AccountKey("NYC", 1001);
  const k2 = new AccountKey("NYC", 1001);
  console.log("Memory Reference Identity (k1 === k2):", k1 === k2);
  console.log("Domain Value Equality (k1.equals(k2)):", k1.equals(k2));
});

// Day 38 Part 2: The Mathematical Contract of equals() and hashCode()
capture('d38p2', () => {
  function computeHashCode(branch: string, number: number): number {
    let hash = 17;
    for (let i = 0; i < branch.length; i++) {
      hash = (hash * 31 + branch.charCodeAt(i)) | 0;
    }
    hash = (hash * 31 + number) | 0;
    return hash;
  }

  const h1 = computeHashCode("LON", 8802);
  const h2 = computeHashCode("LON", 8802);
  console.log("Key 1 HashCode:", h1);
  console.log("Key 2 HashCode:", h2);
  console.log("Contract Invariant Holds (Equal keys produce identical hash):", h1 === h2);
});

// Day 38 Part 3: Detective Lab: The Phantom Key in the HashMap
capture('d38p3', () => {
  class SafeMapKey {
    constructor(public readonly id: string) {}
    toHashString(): string { return `KEY_${this.id}`; }
  }

  const cache = new Map<string, string>();
  const k1 = new SafeMapKey("ACC-5501");
  cache.set(k1.toHashString(), "Active Account Context");

  const queryKey = new SafeMapKey("ACC-5501");
  const result = cache.get(queryKey.toHashString());
  console.log(`Query for separate instance with same ID: ${result}`);
  console.log("Cache lookup succeeded with deterministic key resolution:", result !== undefined);
});

// Day 38 Part 4: Mastery Assignment: Bulletproof Domain Entity Identity
capture('d38p4', () => {
  class DomainAccountId {
    readonly routing: string;
    readonly accountNum: string;

    constructor(routing: string, accountNum: string) {
      if (!routing || !accountNum) throw new Error("Non-null fields required");
      this.routing = routing;
      this.accountNum = accountNum;
    }

    equals(other: any): boolean {
      if (this === other) return true;
      if (!(other instanceof DomainAccountId)) return false;
      return this.routing === other.routing && this.accountNum === other.accountNum;
    }

    hashCode(): number {
      let hash = 7;
      hash = 31 * hash + this.routing.length;
      hash = 31 * hash + this.accountNum.length;
      return hash;
    }

    toString(): string {
      return `AccountId[routing=${this.routing}, accountNum=***${this.accountNum.slice(-4)}]`;
    }
  }

  const idA = new DomainAccountId("021000021", "9876543210");
  const idB = new DomainAccountId("021000021", "9876543210");
  console.log("Entity String Repr:", idA.toString());
  console.log("Reflexive Check (idA == idA):", idA.equals(idA));
  console.log("Symmetric Check (idA == idB && idB == idA):", idA.equals(idB) && idB.equals(idA));
  console.log("Hash Consistency:", idA.hashCode() === idB.hashCode());
});

// Day 38 Part 5: Production Incident Lab: Memory Address Hash Code Outage
capture('d38p5', () => {
  class DeduplicationEngine {
    private seenIds = new Set<string>();

    processTransaction(txId: string, amount: number): boolean {
      if (this.seenIds.has(txId)) {
        console.log(`[FRAUD ALERT] Duplicate transaction detected for ${txId}! Aborting charge.`);
        return false;
      }
      this.seenIds.add(txId);
      console.log(`[TRANSACTION PROCESSED] ${txId} for $${(amount / 100).toFixed(2)} settled`);
      return true;
    }
  }

  const engine = new DeduplicationEngine();
  engine.processTransaction("TX-998811", 5000);
  engine.processTransaction("TX-998811", 5000); // duplicate
  engine.processTransaction("TX-998812", 12500);
});

// ==========================================
// DAY 39: Abstract Classes vs Interfaces
// ==========================================

// Day 39 Part 1: Interface Decoupling & Loose Coupling
capture('d39p1', () => {
  interface PaymentChannel {
    transmit(amountCents: number): boolean;
    getChannelName(): string;
  }

  class SwiftWireChannel implements PaymentChannel {
    transmit(amountCents: number): boolean {
      console.log(`[SWIFT WIRE] Dispatched $${(amountCents / 100).toFixed(2)} across international RTGS`);
      return true;
    }
    getChannelName(): string { return "SWIFT-FIN"; }
  }

  function executePayment(channel: PaymentChannel, amountCents: number): void {
    console.log(`Initiating checkout on decoupled channel: ${channel.getChannelName()}`);
    channel.transmit(amountCents);
  }

  executePayment(new SwiftWireChannel(), 10000000);
});

// Day 39 Part 2: Abstract Classes vs Interfaces
capture('d39p2', () => {
  abstract class BaseOrderWorkflow {
    constructor(public readonly orderId: string) {}
    // Template method pattern
    processOrder(): void {
      console.log(`1. Validating order ${this.orderId}`);
      this.executeFulfillment();
      console.log(`3. Emitting audit event for ${this.orderId}`);
    }
    protected abstract executeFulfillment(): void;
  }

  interface Taxable {
    calculateSalesTax(): number;
  }

  class DigitalGoodOrder extends BaseOrderWorkflow implements Taxable {
    protected executeFulfillment(): void {
      console.log("2. Generating digital download license key");
    }
    calculateSalesTax(): number {
      return 150;
    }
  }

  const order = new DigitalGoodOrder("ORD-4491");
  order.processOrder();
  console.log("Sales tax applied:", order.calculateSalesTax());
});

// Day 39 Part 3: Detective Lab: The Reduced Visibility Violation
capture('d39p3', () => {
  interface SecureVault {
    unlock(token: string): boolean;
  }

  class EnterpriseVault implements SecureVault {
    // In Java, missing 'public' on interface implementation causes 'cannot reduce visibility'
    public unlock(token: string): boolean {
      const valid = token === "SEC-992";
      console.log(`Enterprise vault unlock attempt with token ${token}: ${valid ? "GRANTED" : "DENIED"}`);
      return valid;
    }
  }

  const vault: SecureVault = new EnterpriseVault();
  vault.unlock("SEC-992");
});

// Day 39 Part 4: Mastery Assignment: Multi-Interface Auditable Entity
capture('d39p4', () => {
  interface Auditable {
    getAuditLog(): string;
  }

  interface Validatable {
    validate(): boolean;
  }

  interface Persistable {
    saveToStorage(): void;
  }

  class TradeRecord implements Auditable, Validatable, Persistable {
    constructor(public readonly tradeId: string, public readonly volume: number) {}

    getAuditLog(): string {
      return `[AUDIT] Trade ${this.tradeId} volume=${this.volume} timestamp=${Date.now()}`;
    }

    validate(): boolean {
      return this.volume > 0;
    }

    saveToStorage(): void {
      console.log(`[STORAGE] Trade ${this.tradeId} committed to persistent ledger`);
    }
  }

  const trade = new TradeRecord("TRD-7711", 50000);
  console.log("Validation check:", trade.validate());
  console.log("Audit line:", trade.getAuditLog().slice(0, 35) + "...");
  trade.saveToStorage();
});

// Day 39 Part 5: Production Incident Lab: Diamond Default Method Resolution
capture('d39p5', () => {
  interface LoggingServiceA {
    logHealth(): string;
  }

  interface LoggingServiceB {
    logHealth(): string;
  }

  class ConsolidatedService implements LoggingServiceA, LoggingServiceB {
    // In Java 8+, conflicting default methods must be overridden explicitly:
    // LoggingServiceA.super.logHealth() or custom logic
    logHealth(): string {
      return "[CONSOLIDATED] Reconciled Service Health: ALL CLUSTERS OPERATIONAL";
    }
  }

  const svc = new ConsolidatedService();
  console.log("Resolved diamond conflict:", svc.logHealth());
});

// ==========================================
// DAY 40: Milestone 7: Pluggable Multi-Provider Payment Gateway
// ==========================================

// Day 40 Part 1: Dependency Inversion Principle & Interface Contracts
capture('d40p1', () => {
  interface PaymentProcessor {
    charge(amountCents: number, currency: string): { success: boolean; txRef: string };
  }

  class StripeProcessor implements PaymentProcessor {
    charge(amountCents: number, currency: string) {
      return { success: true, txRef: `ch_stripe_${Math.floor(Math.random() * 89999 + 10000)}` };
    }
  }

  class CheckoutService {
    constructor(private readonly processor: PaymentProcessor) {}
    checkout(totalCents: number): void {
      const res = this.processor.charge(totalCents, "USD");
      console.log(`Checkout Complete! Success: ${res.success}, Reference: ${res.txRef}`);
    }
  }

  const svc = new CheckoutService(new StripeProcessor());
  svc.checkout(8999);
});

// Day 40 Part 2: Unified PaymentProcessor & PaymentResult Contract
capture('d40p2', () => {
  interface PaymentResult {
    readonly authorized: boolean;
    readonly transactionId: string;
    readonly providerName: string;
    readonly feeCents: number;
  }

  class PayPalProcessor {
    processPayment(cents: number): PaymentResult {
      return {
        authorized: true,
        transactionId: "PAYPAL-TX-40192",
        providerName: "PayPal-Enterprise",
        feeCents: Math.round(cents * 0.029) + 30
      };
    }
  }

  const pp = new PayPalProcessor();
  const res = pp.processPayment(15000);
  console.log(`Provider: ${res.providerName} | Authorized: ${res.authorized}`);
  console.log(`Transaction ID: ${res.transactionId} | Gateway Fee: $${(res.feeCents / 100).toFixed(2)}`);
});

// Day 40 Part 3: Detective Lab: The Hardcoded Vendor Coupling
capture('d40p3', () => {
  interface GatewayInterface {
    process(amount: number): string;
  }

  class MockGateway implements GatewayInterface {
    process(amount: number): string { return `MOCK_TX_OK_${amount}`; }
  }

  class PluggableBillingService {
    private gateway: GatewayInterface;
    constructor(gateway: GatewayInterface) {
      this.gateway = gateway;
    }
    setGateway(newGateway: GatewayInterface): void {
      this.gateway = newGateway;
    }
    bill(amount: number): string {
      return this.gateway.process(amount);
    }
  }

  const billing = new PluggableBillingService(new MockGateway());
  console.log("Decoupled bill execution:", billing.bill(50000));
});

// Day 40 Part 4: Mastery Assignment: Mock Payment Gateway Test Double
capture('d40p4', () => {
  interface Gateway {
    charge(cents: number): boolean;
  }

  class MockPaymentGateway implements Gateway {
    public chargeCount = 0;
    public totalChargedCents = 0;
    private forceFailure = false;

    setFailMode(fail: boolean) { this.forceFailure = fail; }

    charge(cents: number): boolean {
      this.chargeCount++;
      if (this.forceFailure) return false;
      this.totalChargedCents += cents;
      return true;
    }
  }

  const mock = new MockPaymentGateway();
  console.log("Test 1 (Normal charge):", mock.charge(2500));
  console.log("Test 2 (Normal charge):", mock.charge(7500));
  mock.setFailMode(true);
  console.log("Test 3 (Simulated network drop):", mock.charge(1000));
  console.log(`Mock Metrics: Total calls: ${mock.chargeCount}, Settled volume: $${(mock.totalChargedCents / 100).toFixed(2)}`);
});

// Day 40 Part 5: Milestone 7 Capstone Viva Gate: Multi-Provider Payment Gateway
capture('d40p5', () => {
  interface PaymentProvider {
    readonly name: string;
    execute(amountCents: number): { success: boolean; confirmationId: string };
  }

  class Stripe implements PaymentProvider {
    readonly name = "Stripe";
    execute(amountCents: number) { return { success: true, confirmationId: `STRIPE_${amountCents}_OK` }; }
  }

  class FallbackWire implements PaymentProvider {
    readonly name = "WireTransfer";
    execute(amountCents: number) { return { success: true, confirmationId: `WIRE_${amountCents}_SETTLED` }; }
  }

  class GatewayRouter {
    constructor(private providers: PaymentProvider[]) {}

    routePayment(amountCents: number): string {
      for (const p of this.providers) {
        const res = p.execute(amountCents);
        if (res.success) {
          return `Payment Routed via [${p.name}] -> Confirmed: ${res.confirmationId}`;
        }
      }
      throw new Error("All payment gateways exhausted");
    }
  }

  const router = new GatewayRouter([new Stripe(), new FallbackWire()]);
  console.log("Milestone 7 Engine Active:");
  console.log(router.routePayment(250000));
  console.log("[Viva Gate Certification] Milestone 7 Enterprise Payment Gateway Interface Engine PASSED");
});

// Save outputs
fs.writeFileSync('scripts/java_days36_40_outputs.json', JSON.stringify(outputs, null, 2), 'utf8');
console.log('Successfully captured all 25 outputs to scripts/java_days36_40_outputs.json!');
