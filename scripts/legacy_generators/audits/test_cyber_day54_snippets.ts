// scripts/test_cyber_day54_snippets.ts
import assert from 'node:assert';

// Snippet 1: Order of Volatility Acquisition Scheduler
interface VolatileSource {
  name: string;
  category: 'REGISTERS' | 'RAM' | 'NETWORK_STATE' | 'DISK' | 'ARCHIVE';
  lifespanSeconds: number;
}

class OrderOfVolatilityScheduler {
  static prioritizeAcquisition(sources: VolatileSource[]): VolatileSource[] {
    const volatilityRanks: Record<string, number> = {
      REGISTERS: 1,
      RAM: 2,
      NETWORK_STATE: 3,
      DISK: 4,
      ARCHIVE: 5
    };
    return [...sources].sort((a, b) => volatilityRanks[a.category] - volatilityRanks[b.category]);
  }
}

const sources: VolatileSource[] = [
  { name: 'Hard Drive Image', category: 'DISK', lifespanSeconds: 86400 },
  { name: 'Physical RAM Dump', category: 'RAM', lifespanSeconds: 10 },
  { name: 'CPU Registers', category: 'REGISTERS', lifespanSeconds: 0.001 },
  { name: 'Active Network Sockets', category: 'NETWORK_STATE', lifespanSeconds: 60 }
];
const prioritized = OrderOfVolatilityScheduler.prioritizeAcquisition(sources);
assert.strictEqual(prioritized[0].category, 'REGISTERS');
assert.strictEqual(prioritized[1].category, 'RAM');
assert.strictEqual(prioritized[2].category, 'NETWORK_STATE');
assert.strictEqual(prioritized[3].category, 'DISK');

// Snippet 2: Volatility 3 Memory Injection Detector
interface ProcessMemoryRegion {
  pid: number;
  processName: string;
  startAddressHex: string;
  protection: 'PAGE_READONLY' | 'PAGE_READWRITE' | 'PAGE_EXECUTE_READWRITE';
  containsInjectedVAD: boolean;
}

class VolatilityMalfindAnalyzer {
  static detectInjectedCode(regions: ProcessMemoryRegion[]): { suspiciousPids: number[]; findings: string[] } {
    const suspicious: number[] = [];
    const findings: string[] = [];

    for (const r of regions) {
      // PAGE_EXECUTE_READWRITE with injected VAD indicates shellcode / reflective DLL
      if (r.protection === 'PAGE_EXECUTE_READWRITE' && r.containsInjectedVAD) {
        suspicious.push(r.pid);
        findings.push(`Process ${r.processName} (PID ${r.pid}) contains RWX memory with injected VAD at ${r.startAddressHex}`);
      }
    }

    return {
      suspiciousPids: suspicious,
      findings
    };
  }
}

const testRegions: ProcessMemoryRegion[] = [
  { pid: 1024, processName: 'svchost.exe', startAddressHex: '0x7ff0000', protection: 'PAGE_READONLY', containsInjectedVAD: false },
  { pid: 4892, processName: 'explorer.exe', startAddressHex: '0x2a10000', protection: 'PAGE_EXECUTE_READWRITE', containsInjectedVAD: true }
];
const malfindRes = VolatilityMalfindAnalyzer.detectInjectedCode(testRegions);
assert.strictEqual(malfindRes.suspiciousPids.length, 1);
assert.strictEqual(malfindRes.suspiciousPids[0], 4892);

// Snippet 3: Cryptographic Disk Image Verification & Write-Blocker
interface DiskImageMetadata {
  imagePath: string;
  sourceDevice: string;
  preAcquisitionSha256: string;
  postAcquisitionSha256: string;
  hardwareWriteBlockerActive: boolean;
}

class DiskImageIntegrityAuditor {
  static verifyEvidence(img: DiskImageMetadata): { isAdmissible: boolean; reason: string } {
    if (!img.hardwareWriteBlockerActive) {
      return { isAdmissible: false, reason: 'Acquisition must utilize hardware write-blocker to prevent evidence alteration' };
    }
    if (img.preAcquisitionSha256 !== img.postAcquisitionSha256) {
      return { isAdmissible: false, reason: 'Cryptographic hash mismatch! Evidence integrity violated' };
    }
    return { isAdmissible: true, reason: 'Evidence cryptographically verified and legally admissible' };
  }
}

const diskMeta: DiskImageMetadata = {
  imagePath: '/evidence/forensics_case_88/disk_primary.E01',
  sourceDevice: '/dev/nvme0n1',
  preAcquisitionSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  postAcquisitionSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  hardwareWriteBlockerActive: true
};
const diskAudit = DiskImageIntegrityAuditor.verifyEvidence(diskMeta);
assert.strictEqual(diskAudit.isAdmissible, true);

// Snippet 4: Super-Timeline MACB Anti-Forensic Timestomping Detector
interface FileMftTimestamps {
  fileName: string;
  stdInfoCreated: string; // $STANDARD_INFORMATION
  stdInfoModified: string;
  fileNameCreated: string; // $FILE_NAME
  fileNameModified: string;
}

class TimestompDetector {
  static evaluateTimestamps(mft: FileMftTimestamps): { timestomped: boolean; discrepancyMs: number } {
    const stdCreated = new Date(mft.stdInfoCreated).getTime();
    const fnCreated = new Date(mft.fileNameCreated).getTime();

    // Adversaries can modify $STANDARD_INFORMATION, but $FILE_NAME is updated only by kernel
    const delta = Math.abs(fnCreated - stdCreated);
    const timestomped = delta > 60000; // More than 1 minute divergence

    return {
      timestomped,
      discrepancyMs: delta
    };
  }
}

const suspiciousFile: FileMftTimestamps = {
  fileName: 'malicious_dropper.exe',
  stdInfoCreated: '2020-01-01T00:00:00Z', // Falsified historical date
  stdInfoModified: '2020-01-01T00:00:00Z',
  fileNameCreated: '2026-10-26T03:45:00Z', // Real creation timestamp
  fileNameModified: '2026-10-26T03:45:00Z'
};
const stompRes = TimestompDetector.evaluateTimestamps(suspiciousFile);
assert.strictEqual(stompRes.timestomped, true);
assert.ok(stompRes.discrepancyMs > 100000000);

// Snippet 5: Production Enterprise DFIR Platform Benchmark
interface DfirInvestigationMetrics {
  orderOfVolatilityCompliant: boolean;
  memoryInjectionAnalyzed: boolean;
  diskImageHashVerified: boolean;
  timelineReconstructionComplete: boolean;
  chainOfCustodyPreserved: boolean;
}

class ProductionDfirPlatform {
  static certifyInvestigation(metrics: DfirInvestigationMetrics): { certified: boolean; score: number } {
    const checks = [
      metrics.orderOfVolatilityCompliant,
      metrics.memoryInjectionAnalyzed,
      metrics.diskImageHashVerified,
      metrics.timelineReconstructionComplete,
      metrics.chainOfCustodyPreserved
    ];
    const score = (checks.filter(Boolean).length / 5) * 100;
    return {
      certified: score === 100,
      score
    };
  }
}

const dfirMetrics: DfirInvestigationMetrics = {
  orderOfVolatilityCompliant: true,
  memoryInjectionAnalyzed: true,
  diskImageHashVerified: true,
  timelineReconstructionComplete: true,
  chainOfCustodyPreserved: true
};
const certDfir = ProductionDfirPlatform.certifyInvestigation(dfirMetrics);
assert.strictEqual(certDfir.certified, true);
assert.strictEqual(certDfir.score, 100);

console.log('All 5 Cyber Day 54 snippets passed unit tests!');
