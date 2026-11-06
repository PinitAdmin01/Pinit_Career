# scripts/test_day58_snippets.py
import subprocess

s1 = """interface TextOperation {
  type: "insert";
  char: string;
  pos: number;
}

class SimpleOTEngine {
  static transform(opA: TextOperation, opB: TextOperation): TextOperation {
    if (opB.pos <= opA.pos) {
      return { ...opA, pos: opA.pos + 1 };
    }
    return opA;
  }
}

const userAOp: TextOperation = { type: "insert", char: "X", pos: 3 };
const userBOp: TextOperation = { type: "insert", char: "Y", pos: 1 };

const transformedA = SimpleOTEngine.transform(userAOp, userBOp);
console.log(`[OT Engine] User A Original Op Pos: ${userAOp.pos}`);
console.log(`[OT Engine] User A Transformed Op Pos: ${transformedA.pos}`);"""
exp1 = """[OT Engine] User A Original Op Pos: 3
[OT Engine] User A Transformed Op Pos: 4"""

s2 = """interface CursorPresence {
  userId: string;
  cursorX: number;
  cursorY: number;
  lastUpdated: number;
}

class EphemeralPresenceChannel {
  private presences = new Map<string, CursorPresence>();

  updateCursor(userId: string, x: number, y: number): void {
    this.presences.set(userId, { userId, cursorX: x, cursorY: y, lastUpdated: 1000000 });
  }

  getActiveCursors(): CursorPresence[] {
    return Array.from(this.presences.values());
  }
}

const presence = new EphemeralPresenceChannel();
presence.updateCursor("user_alice", 140, 280);
presence.updateCursor("user_bob", 420, 890);

const cursors = presence.getActiveCursors();
console.log(`[Presence Channel] Active Peer Cursors: ${cursors.length}`);
console.log(`[Presence Channel] Peer Alice Position: (${cursors[0].cursorX}, ${cursors[0].cursorY})`);"""
exp2 = """[Presence Channel] Active Peer Cursors: 2
[Presence Channel] Peer Alice Position: (140, 280)"""

s3 = """class CollaborativeSocketSession {
  private isConnected = false;
  private pendingQueue: string[] = [];

  connect(): void {
    this.isConnected = true;
  }

  disconnect(): void {
    this.isConnected = false;
  }

  sendUpdate(update: string): string {
    if (!this.isConnected) {
      this.pendingQueue.push(update);
      return `[Socket Session] Offline: Queued update (Pending: ${this.pendingQueue.length})`;
    }
    return `[Socket Session] Online: Transmitted update -> ${update}`;
  }

  reconnect(): string[] {
    this.connect();
    const flushed = this.pendingQueue.map(u => `[Socket Session] Flushed: ${u}`);
    this.pendingQueue = [];
    return flushed;
  }
}

const session = new CollaborativeSocketSession();
session.connect();
console.log(session.sendUpdate("INSERT 'H' at 0"));
session.disconnect();
console.log(session.sendUpdate("INSERT 'i' at 1"));
const flushedLogs = session.reconnect();
for (const log of flushedLogs) console.log(log);"""
exp3 = """[Socket Session] Online: Transmitted update -> INSERT 'H' at 0
[Socket Session] Offline: Queued update (Pending: 1)
[Socket Session] Flushed: INSERT 'i' at 1"""

s4 = """interface CRDTItem {
  id: string;
  char: string;
  deleted: boolean;
}

class CompactableCRDTDoc {
  private items: CRDTItem[] = [];

  insert(id: string, char: string) {
    this.items.push({ id, char, deleted: false });
  }

  delete(id: string) {
    const item = this.items.find(i => i.id === id);
    if (item) item.deleted = true;
  }

  compactSnapshot(): string {
    const originalCount = this.items.length;
    this.items = this.items.filter(i => !i.deleted);
    return `[Compactor] Purged ${originalCount - this.items.length} tombstones, Active: ${this.items.length}`;
  }

  getText(): string {
    return this.items.filter(i => !i.deleted).map(i => i.char).join("");
  }
}

const doc = new CompactableCRDTDoc();
doc.insert("1", "A");
doc.insert("2", "B");
doc.insert("3", "C");
doc.delete("2");

console.log(`[CRDT Doc] Visible Text: ${doc.getText()}`);
console.log(doc.compactSnapshot());
console.log(`[CRDT Doc] Post-Compaction Text: ${doc.getText()}`);"""
exp4 = """[CRDT Doc] Visible Text: AC
[Compactor] Purged 1 tombstones, Active: 2
[CRDT Doc] Post-Compaction Text: AC"""

s5 = """import * as crypto from "node:crypto";

class ConvergenceSentinel {
  static computeStateDigest(docText: string): string {
    return crypto.createHash("sha256").update(docText).digest("hex").slice(0, 12);
  }

  static verifyConvergence(nodeADoc: string, nodeBDoc: string): boolean {
    const hashA = ConvergenceSentinel.computeStateDigest(nodeADoc);
    const hashB = ConvergenceSentinel.computeStateDigest(nodeBDoc);
    return hashA === hashB;
  }
}

const nodeAText = "Enterprise Document State v4.2";
const nodeBText = "Enterprise Document State v4.2";

const hashA = ConvergenceSentinel.computeStateDigest(nodeAText);
const hashB = ConvergenceSentinel.computeStateDigest(nodeBText);
const matches = ConvergenceSentinel.verifyConvergence(nodeAText, nodeBText);

console.log(`[Sentinel] Node A Digest: ${hashA}`);
console.log(`[Sentinel] Node B Digest: ${hashB}`);
console.log(`[Sentinel] Cluster Converged: ${matches}`);"""
exp5 = """[Sentinel] Node A Digest: db617a079295
[Sentinel] Node B Digest: db617a079295
[Sentinel] Cluster Converged: true"""

for idx, (code, exp) in enumerate([(s1, exp1), (s2, exp2), (s3, exp3), (s4, exp4), (s5, exp5)]):
    with open('tmp_test.ts', 'w', encoding='utf-8') as f:
        f.write(code.strip())
    res = subprocess.run(['npx', 'tsx', 'tmp_test.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = 'PASS' if act == exp.strip() else f'FAIL\nExp:\n{exp}\nAct:\n{act}'
    print(f'Snippet {idx+1}: {status}')
