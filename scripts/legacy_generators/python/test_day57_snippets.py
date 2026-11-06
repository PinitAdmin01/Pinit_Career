# scripts/test_day57_snippets.py
import subprocess

s1 = """class InventoryStore {
  private stock = 5;

  vulnerablePurchase(qty: number): boolean {
    if (this.stock >= qty) {
      this.stock -= qty;
      return true;
    }
    return false;
  }

  atomicPurchase(qty: number): boolean {
    if (this.stock < qty) return false;
    this.stock -= qty;
    return true;
  }

  getStock(): number {
    return this.stock;
  }
}

const store = new InventoryStore();
console.log(`[Inventory] Initial Stock: ${store.getStock()}`);
const order1 = store.atomicPurchase(3);
const order2 = store.atomicPurchase(3);
console.log(`[Inventory] Order 1 (3 items): ${order1 ? "SUCCESS" : "REJECTED"}`);
console.log(`[Inventory] Order 2 (3 items): ${order2 ? "SUCCESS" : "REJECTED"}`);
console.log(`[Inventory] Remaining Stock: ${store.getStock()}`);"""
exp1 = """[Inventory] Initial Stock: 5
[Inventory] Order 1 (3 items): SUCCESS
[Inventory] Order 2 (3 items): REJECTED
[Inventory] Remaining Stock: 2"""

s2 = """interface ReservationLock {
  orderId: string;
  itemId: string;
  expiresAt: number;
}

class DistributedInventoryLock {
  private locks = new Map<string, ReservationLock>();

  acquireReservation(itemId: string, orderId: string, ttlMs: number): boolean {
    const existing = this.locks.get(itemId);
    const now = 1000000;
    if (existing && existing.expiresAt > now) {
      return false;
    }
    this.locks.set(itemId, { orderId, itemId, expiresAt: now + ttlMs });
    return true;
  }

  releaseReservation(itemId: string, orderId: string): boolean {
    const existing = this.locks.get(itemId);
    if (existing && existing.orderId === orderId) {
      this.locks.delete(itemId);
      return true;
    }
    return false;
  }
}

const lockManager = new DistributedInventoryLock();
const acquired = lockManager.acquireReservation("item_sneaker_99", "order_abc_1", 300000);
const secondAttempt = lockManager.acquireReservation("item_sneaker_99", "order_xyz_2", 300000);
console.log(`[Lock Engine] Initial Reservation Lock: ${acquired ? "ACQUIRED" : "FAILED"}`);
console.log(`[Lock Engine] Concurrent Reservation Lock: ${secondAttempt ? "ACQUIRED" : "FAILED"}`);"""
exp2 = """[Lock Engine] Initial Reservation Lock: ACQUIRED
[Lock Engine] Concurrent Reservation Lock: FAILED"""

s3 = """import * as crypto from "node:crypto";

class IdempotentWebhookEngine {
  private processedIds = new Set<string>();

  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return expected === signature;
  }

  processWebhook(eventId: string, payload: string, signature: string, secret: string): string {
    if (!this.verifySignature(payload, signature, secret)) {
      return "[Webhook] REJECTED: Invalid HMAC Signature";
    }
    if (this.processedIds.has(eventId)) {
      return `[Webhook] IDEMPOTENT: Event ${eventId} already processed (ACK)`;
    }
    this.processedIds.add(eventId);
    return `[Webhook] PROCESSED: Event ${eventId} order marked PAID`;
  }
}

const secret = "whsec_test_secret_key_12345";
const payload = JSON.stringify({ orderId: "ord_789", amount: 15000 });
const validSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

const engine = new IdempotentWebhookEngine();
console.log(engine.processWebhook("evt_101", payload, validSignature, secret));
console.log(engine.processWebhook("evt_101", payload, validSignature, secret));"""
exp3 = """[Webhook] PROCESSED: Event evt_101 order marked PAID
[Webhook] IDEMPOTENT: Event evt_101 already processed (ACK)"""

s4 = """interface OutboxMessage {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: string;
  status: "PENDING" | "PUBLISHED";
}

class TransactionalOutboxOrderService {
  private orders = new Map<string, { status: string; total: number }>();
  private outbox: OutboxMessage[] = [];

  createOrderTransaction(orderId: string, total: number): void {
    this.orders.set(orderId, { status: "CREATED", total });
    this.outbox.push({
      id: `outbox_${orderId}`,
      aggregateId: orderId,
      eventType: "ORDER_CREATED",
      payload: JSON.stringify({ orderId, total }),
      status: "PENDING",
    });
  }

  flushOutbox(): string[] {
    const published: string[] = [];
    for (const msg of this.outbox) {
      if (msg.status === "PENDING") {
        msg.status = "PUBLISHED";
        published.push(`[Outbox Relay] Published ${msg.eventType} for ${msg.aggregateId}`);
      }
    }
    return published;
  }
}

const orderService = new TransactionalOutboxOrderService();
orderService.createOrderTransaction("order_retail_44", 250);
console.log(`[Order Service] Order Created atomically with Outbox entry`);
const events = orderService.flushOutbox();
for (const e of events) console.log(e);"""
exp4 = """[Order Service] Order Created atomically with Outbox entry
[Outbox Relay] Published ORDER_CREATED for order_retail_44"""

s5 = """class CheckoutLoadShedder {
  private activeCheckoutRequests = 0;
  private readonly maxCapacity = 5;

  processCheckout(orderId: string): string {
    if (this.activeCheckoutRequests >= this.maxCapacity) {
      return `[Load Shedder] 503 Service Unavailable: Queue Full, Shedding ${orderId}`;
    }
    this.activeCheckoutRequests++;
    this.activeCheckoutRequests--;
    return `[Load Shedder] 200 OK: Processed ${orderId}`;
  }
}

const shedder = new CheckoutLoadShedder();
console.log(shedder.processCheckout("ord_1"));
console.log(shedder.processCheckout("ord_2"));
for (let i = 0; i < 5; i++) (shedder as any).activeCheckoutRequests++;
console.log(shedder.processCheckout("ord_overflow"));"""
exp5 = """[Load Shedder] 200 OK: Processed ord_1
[Load Shedder] 200 OK: Processed ord_2
[Load Shedder] 503 Service Unavailable: Queue Full, Shedding ord_overflow"""

for idx, (code, exp) in enumerate([(s1, exp1), (s2, exp2), (s3, exp3), (s4, exp4), (s5, exp5)]):
    with open('tmp_test.ts', 'w', encoding='utf-8') as f:
        f.write(code.strip())
    res = subprocess.run(['npx', 'tsx', 'tmp_test.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = 'PASS' if act == exp.strip() else f'FAIL\nExp:\n{exp}\nAct:\n{act}'
    print(f'Snippet {idx+1}: {status}')
