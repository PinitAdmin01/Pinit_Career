import subprocess
import sys

snippets = [
    # Snippet 1: AABB Bounding Box Calculator
    {
        'name': 'Day 42 Snippet 1 - AABB Calculator',
        'code': """interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface AABB {
  min: Point3D;
  max: Point3D;
  surfaceArea: number;
  center: Point3D;
}

class AABBBoundingBoxCalculator {
  static computeFromPoints(points: Point3D[]): AABB {
    const min: Point3D = { x: Infinity, y: Infinity, z: Infinity };
    const max: Point3D = { x: -Infinity, y: -Infinity, z: -Infinity };

    for (const p of points) {
      min.x = Math.min(min.x, p.x);
      min.y = Math.min(min.y, p.y);
      min.z = Math.min(min.z, p.z);
      max.x = Math.max(max.x, p.x);
      max.y = Math.max(max.y, p.y);
      max.z = Math.max(max.z, p.z);
    }

    const dx = max.x - min.x;
    const dy = max.y - min.y;
    const dz = max.z - min.z;
    const surfaceArea = parseFloat((2.0 * (dx * dy + dy * dz + dz * dx)).toFixed(3));
    const center: Point3D = {
      x: parseFloat(((min.x + max.x) * 0.5).toFixed(3)),
      y: parseFloat(((min.y + max.y) * 0.5).toFixed(3)),
      z: parseFloat(((min.z + max.z) * 0.5).toFixed(3))
    };

    return { min, max, surfaceArea, center };
  }
}

const triangleVertices: Point3D[] = [
  { x: -1.5, y: 0.0, z: 2.0 },
  { x: 3.0, y: 4.5, z: -1.0 },
  { x: 0.5, y: -2.0, z: 0.5 }
];

const box = AABBBoundingBoxCalculator.computeFromPoints(triangleVertices);
console.log(`[AABB] Min Bounds: (${box.min.x}, ${box.min.y}, ${box.min.z})`);
console.log(`[AABB] Max Bounds: (${box.max.x}, ${box.max.y}, ${box.max.z})`);
console.log(`[AABB] Surface Area: ${box.surfaceArea} m^2`);
console.log(`[AABB] Centroid: (${box.center.x}, ${box.center.y}, ${box.center.z})`);
""",
        'expected': """[AABB] Min Bounds: (-1.5, -2, -1)
[AABB] Max Bounds: (3, 4.5, 2)
[AABB] Surface Area: 124.5 m^2
[AABB] Centroid: (0.75, 1.25, 0.5)"""
    },
    # Snippet 2: Binned Surface Area Heuristic (SAH) Splitter
    {
        'name': 'Day 42 Snippet 2 - Binned SAH Splitter',
        'code': """interface PrimitiveCentroid {
  id: number;
  pos: number; // coordinate along split axis
}

class BinnedSAHSplitter {
  static evaluateSplits(primitives: PrimitiveCentroid[], binCount: number, minBound: number, maxBound: number): {
    bestSplitBin: number;
    bestCost: number;
  } {
    const binSize = (maxBound - minBound) / binCount;
    const binCounts = new Array(binCount).fill(0);

    for (const p of primitives) {
      const b = Math.min(binCount - 1, Math.max(0, Math.floor((p.pos - minBound) / binSize)));
      binCounts[b]++;
    }

    let bestCost = Infinity;
    let bestSplitBin = -1;
    const costTraversal = 1.0;
    const costIntersect = 1.5;

    // Evaluate each split plane between bin i and bin i+1
    for (let split = 1; split < binCount; split++) {
      let countLeft = 0;
      let countRight = 0;
      for (let i = 0; i < split; i++) countLeft += binCounts[i];
      for (let i = split; i < binCount; i++) countRight += binCounts[i];

      // Normalized surface area approximation based on fraction of split axis
      const saLeft = split / binCount;
      const saRight = (binCount - split) / binCount;
      const cost = costTraversal + (saLeft * countLeft + saRight * countRight) * costIntersect;

      if (cost < bestCost) {
        bestCost = parseFloat(cost.toFixed(2));
        bestSplitBin = split;
      }
    }

    return { bestSplitBin, bestCost };
  }
}

const prims: PrimitiveCentroid[] = [
  { id: 0, pos: 1.2 }, { id: 1, pos: 1.8 }, { id: 2, pos: 2.1 },
  { id: 3, pos: 5.4 }, { id: 4, pos: 6.2 }, { id: 5, pos: 7.8 }
];

const split = BinnedSAHSplitter.evaluateSplits(prims, 8, 0.0, 8.0);
console.log(`[Binned SAH] Evaluated Primitives: ${prims.length} across 8 Bins`);
console.log(`[Binned SAH] Optimal Split Plane Bin: ${split.bestSplitBin}`);
console.log(`[Binned SAH] Minimum SAH Partition Cost: ${split.bestCost}`);
""",
        'expected': """[Binned SAH] Evaluated Primitives: 6 across 8 Bins
[Binned SAH] Optimal Split Plane Bin: 3
[Binned SAH] Minimum SAH Partition Cost: 5.5"""
    },
    # Snippet 3: 30-Bit Morton Code Generator
    {
        'name': 'Day 42 Snippet 3 - Morton Code Generator',
        'code': """class MortonCodeGenerator {
  // Expands a 10-bit integer into 30 bits by inserting 2 zeros after each bit
  private static expandBits(v: number): number {
    v = (v * 0x00010001) & 0xFF0000FF;
    v = (v * 0x00000101) & 0x0F00F00F;
    v = (v * 0x00000011) & 0xC30C30C3;
    v = (v * 0x00000005) & 0x49249249;
    return v >>> 0;
  }

  static encodePoint(normalizedX: number, normalizedY: number, normalizedZ: number): number {
    // Clamp to [0, 1] and quantize to 10-bit integer [0, 1023]
    const qx = Math.min(1023, Math.max(0, Math.floor(normalizedX * 1023.0)));
    const qy = Math.min(1023, Math.max(0, Math.floor(normalizedY * 1023.0)));
    const qz = Math.min(1023, Math.max(0, Math.floor(normalizedZ * 1023.0)));

    const xx = this.expandBits(qx);
    const yy = this.expandBits(qy);
    const zz = this.expandBits(qz);

    return ((xx << 2) | (yy << 1) | zz) >>> 0;
  }
}

const m1 = MortonCodeGenerator.encodePoint(0.0, 0.0, 0.0);
const m2 = MortonCodeGenerator.encodePoint(1.0, 1.0, 1.0);
const m3 = MortonCodeGenerator.encodePoint(0.5, 0.5, 0.5);

console.log(`[Morton Code] Min Corner (0,0,0) Hash: 0x${m1.toString(16).padStart(8, '0').toUpperCase()}`);
console.log(`[Morton Code] Max Corner (1,1,1) Hash: 0x${m2.toString(16).padStart(8, '0').toUpperCase()}`);
console.log(`[Morton Code] Centroid (0.5,0.5,0.5) Hash: 0x${m3.toString(16).padStart(8, '0').toUpperCase()}`);
""",
        'expected': """[Morton Code] Min Corner (0,0,0) Hash: 0x00000000
[Morton Code] Max Corner (1,1,1) Hash: 0x3FFFFFFF
[Morton Code] Centroid (0.5,0.5,0.5) Hash: 0x07FFFFFF"""
    },
    # Snippet 4: Flat 32-Byte BVH Node Compactor
    {
        'name': 'Day 42 Snippet 4 - Flat BVH Compactor',
        'code': """interface FlatBVHNode {
  // 32-byte layout: 2 x vec4<f32>
  // node[0] = { minX, minY, minZ, rightChildOrFirstPrim }
  // node[1] = { maxX, maxY, maxZ, primCount (0 for internal) }
  data0: [number, number, number, number];
  data1: [number, number, number, number];
  isLeaf: boolean;
}

class FlatBVHCompactor {
  static createInternalNode(min: [number, number, number], max: [number, number, number], rightChildIndex: number): FlatBVHNode {
    return {
      data0: [min[0], min[1], min[2], rightChildIndex],
      data1: [max[0], max[1], max[2], 0], // primCount = 0 signifies internal branch node
      isLeaf: false
    };
  }

  static createLeafNode(min: [number, number, number], max: [number, number, number], firstPrimIndex: number, primCount: number): FlatBVHNode {
    return {
      data0: [min[0], min[1], min[2], firstPrimIndex],
      data1: [max[0], max[1], max[2], primCount], // primCount > 0 signifies leaf node
      isLeaf: true
    };
  }
}

const internalNode = FlatBVHCompactor.createInternalNode([-10, -5, -2], [10, 5, 2], 4);
const leafNode = FlatBVHCompactor.createLeafNode([1.2, 0.5, -1.0], [3.4, 2.1, 0.5], 128, 3);

console.log(`[Flat BVH] Internal Node Size: 32 bytes (Child Index: ${internalNode.data0[3]}, PrimCount: ${internalNode.data1[3]})`);
console.log(`[Flat BVH] Leaf Node Size: 32 bytes (First Prim: ${leafNode.data0[3]}, PrimCount: ${leafNode.data1[3]})`);
console.log(`[Flat BVH] Internal Node IsLeaf: ${internalNode.isLeaf}, Leaf Node IsLeaf: ${leafNode.isLeaf}`);
""",
        'expected': """[Flat BVH] Internal Node Size: 32 bytes (Child Index: 4, PrimCount: 0)
[Flat BVH] Leaf Node Size: 32 bytes (First Prim: 128, PrimCount: 3)
[Flat BVH] Internal Node IsLeaf: false, Leaf Node IsLeaf: true"""
    },
    # Snippet 5: BVH Tree Performance & Memory Auditor
    {
        'name': 'Day 42 Snippet 5 - BVH Traversal Auditor',
        'code': """interface BVHMetrics {
  totalTriangles: number;
  nodeCount: number;
  maxTreeDepth: number;
  bytesPerNode: number;
}

class BVHTraversalAuditor {
  static audit(metrics: BVHMetrics): {
    vramKilobytes: number;
    depthCompliant: boolean;
    memoryCompliant: boolean;
    avgPrimsPerLeaf: number;
  } {
    const totalBytes = metrics.nodeCount * metrics.bytesPerNode;
    const vramKilobytes = parseFloat((totalBytes / 1024).toFixed(1));
    const depthCompliant = metrics.maxTreeDepth <= 32; // Fits within 32-entry traversal stack
    const memoryCompliant = vramKilobytes <= 2048; // Compacted under 2MB for 100k triangles
    const leafCount = Math.floor((metrics.nodeCount + 1) / 2);
    const avgPrimsPerLeaf = parseFloat((metrics.totalTriangles / leafCount).toFixed(2));

    return { vramKilobytes, depthCompliant, memoryCompliant, avgPrimsPerLeaf };
  }
}

const metrics: BVHMetrics = {
  totalTriangles: 65536,
  nodeCount: 131071, // Perfect binary tree: 2N - 1 nodes
  maxTreeDepth: 18,
  bytesPerNode: 32
};

const audit = BVHTraversalAuditor.audit(metrics);
console.log(`[BVH Audit] Total Nodes Allocated: ${metrics.nodeCount.toLocaleString("en-US")}`);
console.log(`[BVH Audit] Total BVH Memory Footprint: ${audit.vramKilobytes} KB`);
console.log(`[BVH Audit] Max Tree Depth (<= 32 Stack Limit): ${metrics.maxTreeDepth} (Compliant: ${audit.depthCompliant})`);
console.log(`[BVH Audit] Average Primitives per Leaf: ${audit.avgPrimsPerLeaf}`);
""",
        'expected': """[BVH Audit] Total Nodes Allocated: 131,071
[BVH Audit] Total BVH Memory Footprint: 4096 KB
[BVH Audit] Max Tree Depth (<= 32 Stack Limit): 18 (Compliant: true)
[BVH Audit] Average Primitives per Leaf: 1"""
    }
]

def main():
    failed = 0
    for s in snippets:
        with open('scripts/temp_snippet.ts', 'w', encoding='utf-8') as f:
            f.write(s['code'])
        try:
            res = subprocess.run(['npx', 'tsx', 'scripts/temp_snippet.ts'], capture_output=True, text=True, check=True, shell=True)
            stdout = res.stdout.strip().replace('\r\n', '\n')
            expected = s['expected'].strip().replace('\r\n', '\n')
            if stdout == expected:
                print(f"PASS: {s['name']}")
            else:
                print(f"FAIL: {s['name']}")
                print("--- EXPECTED ---")
                print(expected)
                print("--- ACTUAL ---")
                print(stdout)
                failed += 1
        except Exception as e:
            print(f"ERROR: {s['name']}: {e}")
            failed += 1

    if failed == 0:
        print("ALL 5 SNIPPETS PASS!")
        sys.exit(0)
    else:
        print(f"{failed} SNIPPETS FAILED!")
        sys.exit(1)

if __name__ == '__main__':
    main()
