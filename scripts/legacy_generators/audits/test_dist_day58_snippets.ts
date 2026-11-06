// scripts/test_dist_day58_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: KademliaXorDistance
class KademliaXorDistance {
  static distance(idA: number, idB: number): number {
    return idA ^ idB;
  }

  static sortClosest(targetId: number, nodeIds: number[]): number[] {
    return [...nodeIds].sort((a, b) => {
      const distA = KademliaXorDistance.distance(a, targetId);
      const distB = KademliaXorDistance.distance(b, targetId);
      return distA - distB;
    });
  }
}

// Snippet 2: KBucketTable
interface KNode {
  id: number;
  lastSeen: number;
}

class KBucketTable {
  private buckets = new Map<number, KNode[]>();
  readonly k: number;

  constructor(k = 4) {
    this.k = k;
  }

  private getBucketIndex(localId: number, nodeId: number): number {
    const dist = localId ^ nodeId;
    return dist === 0 ? 0 : Math.floor(Math.log2(dist));
  }

  insert(localId: number, node: KNode): { inserted: boolean; evicted?: KNode } {
    const idx = this.getBucketIndex(localId, node.id);
    let bucket = this.buckets.get(idx);
    if (!bucket) {
      bucket = [];
      this.buckets.set(idx, bucket);
    }

    const existingIdx = bucket.findIndex(n => n.id === node.id);
    if (existingIdx !== -1) {
      bucket.splice(existingIdx, 1);
      bucket.push(node);
      return { inserted: true };
    }

    if (bucket.length < this.k) {
      bucket.push(node);
      return { inserted: true };
    }

    // Bucket full: in true Kademlia, ping oldest. If alive, reject newcomer.
    return { inserted: false, evicted: bucket[0] };
  }

  getBucket(idx: number): KNode[] {
    return this.buckets.get(idx) || [];
  }
}

// Snippet 3: BitTorrentChoker
interface PeerStats {
  peerId: string;
  uploadRateBps: number;
}

class BitTorrentChoker {
  private readonly maxUnchoked: number;

  constructor(maxUnchoked = 4) {
    this.maxUnchoked = maxUnchoked;
  }

  selectUnchokedPeers(peers: PeerStats[], optimisticPeerId: string): string[] {
    const sorted = [...peers].sort((a, b) => b.uploadRateBps - a.uploadRateBps);
    const topPeers = sorted.slice(0, this.maxUnchoked - 1).map(p => p.peerId);

    if (!topPeers.includes(optimisticPeerId)) {
      topPeers.push(optimisticPeerId);
    } else if (sorted.length >= this.maxUnchoked) {
      topPeers.push(sorted[this.maxUnchoked - 1].peerId);
    }

    return topPeers;
  }
}

// Snippet 4: MerkleDagNode
class MerkleDagNode {
  readonly data: string;
  readonly children: MerkleDagNode[];
  readonly cid: string;

  constructor(data: string, children: MerkleDagNode[] = []) {
    this.data = data;
    this.children = children;
    const hasher = crypto.createHash('sha256');
    hasher.update(data);
    for (const child of children) {
      hasher.update(child.cid);
    }
    this.cid = hasher.digest('hex');
  }

  verifyIntegrity(): boolean {
    const hasher = crypto.createHash('sha256');
    hasher.update(this.data);
    for (const child of this.children) {
      if (!child.verifyIntegrity()) return false;
      hasher.update(child.cid);
    }
    return this.cid === hasher.digest('hex');
  }
}

// Snippet 5: P2PSwarmAuditor
interface P2PSwarmAuditReport {
  activePeers: number;
  datasetSizeBytes: number;
  kademliaLookupHopsP99: number;
  contentIntegrityVerified: boolean;
  isEnterpriseReady: boolean;
}

class P2PSwarmAuditor {
  static auditSwarm(
    peers: number,
    datasetBytes: number,
    hopsP99: number,
    integrityVerified: boolean
  ): P2PSwarmAuditReport {
    const isEnterpriseReady =
      peers >= 500 &&
      datasetBytes >= 50 * 1024 * 1024 * 1024 &&
      hopsP99 <= 6 &&
      integrityVerified;

    return {
      activePeers: peers,
      datasetSizeBytes: datasetBytes,
      kademliaLookupHopsP99: hopsP99,
      contentIntegrityVerified: integrityVerified,
      isEnterpriseReady
    };
  }
}

async function runTests() {
  // Test 1: KademliaXorDistance
  const d1 = KademliaXorDistance.distance(0b1010, 0b1100); // 0b0110 = 6
  if (d1 !== 6) throw new Error('Distance calculation failed');
  const sorted = KademliaXorDistance.sortClosest(0b1000, [0b1111, 0b1001, 0b0000]);
  // 1000 ^ 1001 = 0001 (1) -> closest
  // 1000 ^ 1111 = 0111 (7)
  // 1000 ^ 0000 = 1000 (8)
  if (sorted[0] !== 0b1001 || sorted[1] !== 0b1111 || sorted[2] !== 0b0000) {
    throw new Error('Closest sort failed');
  }
  console.log('Snippet 1 PASS');

  // Test 2: KBucketTable
  const table = new KBucketTable(2);
  const localId = 0;
  table.insert(localId, { id: 4, lastSeen: 100 });
  table.insert(localId, { id: 5, lastSeen: 101 });
  const insRes = table.insert(localId, { id: 6, lastSeen: 102 });
  if (insRes.inserted) throw new Error('Should not insert into full bucket without eviction');
  console.log('Snippet 2 PASS');

  // Test 3: BitTorrentChoker
  const choker = new BitTorrentChoker(4);
  const peers: PeerStats[] = [
    { peerId: 'p1', uploadRateBps: 1000 },
    { peerId: 'p2', uploadRateBps: 800 },
    { peerId: 'p3', uploadRateBps: 600 },
    { peerId: 'p4', uploadRateBps: 400 },
    { peerId: 'p5', uploadRateBps: 200 }
  ];
  const unchoked = choker.selectUnchokedPeers(peers, 'p5');
  if (!unchoked.includes('p1') || !unchoked.includes('p2') || !unchoked.includes('p3') || !unchoked.includes('p5')) {
    throw new Error('Choking selection failed');
  }
  console.log('Snippet 3 PASS');

  // Test 4: MerkleDagNode
  const leaf1 = new MerkleDagNode('chunk-1');
  const leaf2 = new MerkleDagNode('chunk-2');
  const root = new MerkleDagNode('root-directory', [leaf1, leaf2]);
  if (!root.verifyIntegrity()) throw new Error('Merkle DAG verification failed');
  console.log('Snippet 4 PASS');

  // Test 5: P2PSwarmAuditor
  const audit = P2PSwarmAuditor.auditSwarm(500, 50 * 1024 * 1024 * 1024, 4, true);
  if (!audit.isEnterpriseReady || !audit.contentIntegrityVerified) throw new Error('Audit failed');
  console.log('Snippet 5 PASS');
  console.log('ALL DAY 58 SNIPPETS PASS 5/5!');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
