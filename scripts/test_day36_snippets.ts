import vm from 'node:vm';
import { compileTs } from '../src/lib/code/ts/compileTs';

async function runTs(code: string): Promise<string> {
  const compiled = await compileTs(code);
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math, Map, Set, String, Number, Boolean, Array, Object, JSON
  };
  vm.runInNewContext(compiled.js, sandbox, { timeout: 2000 });
  return out.join('\n');
}

async function testAll() {
  const p1 = `// Firecracker Minimalist Device Model & KVM MicroVM Boot
interface DeviceModel {
  name: string;
  type: 'virtio-net' | 'virtio-block' | 'virtio-vsock' | 'serial';
  bootOverheadMs: number;
}

class FirecrackerMicroVM {
  private devices: DeviceModel[] = [];

  attachDevice(dev: DeviceModel) {
    this.devices.push(dev);
  }

  bootMicroVM(kernel: string, memoryMb: number): string {
    const totalDeviceOverhead = this.devices.reduce((acc, d) => acc + d.bootOverheadMs, 0);
    const kernelBootMs = 3.2; // Optimized minimalist Linux kernel
    const totalBootMs = kernelBootMs + totalDeviceOverhead;

    return \`FIRECRACKER_BOOT_OK: Kernel='\${kernel}' Ram=\${memoryMb}MB Devices=\${this.devices.length} TotalBootTime=\${totalBootMs.toFixed(1)}ms\`;
  }
}

const microVM = new FirecrackerMicroVM();
microVM.attachDevice({ name: 'net0', type: 'virtio-net', bootOverheadMs: 0.8 });
microVM.attachDevice({ name: 'rootfs', type: 'virtio-block', bootOverheadMs: 0.9 });
microVM.attachDevice({ name: 'vsock0', type: 'virtio-vsock', bootOverheadMs: 0.4 });

console.log(microVM.bootMicroVM('vmlinux-5.10-minimal', 512));`;

  const p2 = `// Firecracker Jailer: Sandboxing, cgroups & seccomp-bpf Validation
interface JailerConfig {
  uid: number;
  gid: number;
  chrootPath: string;
  cpuQuotaUs: number;
  blockedSyscalls: string[];
}

class FirecrackerJailer {
  private config: JailerConfig;

  constructor(cfg: JailerConfig) {
    this.config = cfg;
  }

  validateSandbox(attemptedSyscall: string): { allowed: boolean; verdict: string } {
    if (this.config.uid === 0 || this.config.gid === 0) {
      return { allowed: false, verdict: 'SECURITY_FAIL: Jailer cannot run as root (uid=0)' };
    }
    if (this.config.blockedSyscalls.includes(attemptedSyscall)) {
      return {
        allowed: false,
        verdict: \`SECCOMP_BPF_KILL: Syscall '\${attemptedSyscall}' blocked by seccomp filter\`
      };
    }
    return {
      allowed: true,
      verdict: \`SANDBOX_ENFORCED: Chroot='\${this.config.chrootPath}' CPU_Quota=\${this.config.cpuQuotaUs}us Syscall='\${attemptedSyscall}' allowed\`
    };
  }
}

const jailer = new FirecrackerJailer({
  uid: 10001,
  gid: 10001,
  chrootPath: '/srv/jailer/firecracker/vm-8812',
  cpuQuotaUs: 50000,
  blockedSyscalls: ['ptrace', 'sys_chroot', 'reboot']
});

console.log(jailer.validateSandbox('ptrace').verdict);
console.log(jailer.validateSandbox('epoll_wait').verdict);`;

  const p3 = `// AWS Lambda SnapStart: Coordinated Restore at Checkpoint (CRaC) Lifecycle
interface CRaCResource {
  name: string;
  beforeCheckpoint(): string;
  afterRestore(): string;
}

class DatabaseConnectionPool implements CRaCResource {
  name = 'RDS-Aurora-Pool';
  beforeCheckpoint(): string {
    return 'CRaC [beforeCheckpoint]: Drained active sockets and closed pool';
  }
  afterRestore(): string {
    return 'CRaC [afterRestore]: Reconnected connection pool with fresh TCP handshake';
  }
}

class SnapStartRuntimeManager {
  private resources: CRaCResource[] = [];

  register(res: CRaCResource) {
    this.resources.push(res);
  }

  takeSnapshot(): string[] {
    return this.resources.map(r => r.beforeCheckpoint());
  }

  resumeSnapshot(): string[] {
    return this.resources.map(r => r.afterRestore());
  }
}

const manager = new SnapStartRuntimeManager();
manager.register(new DatabaseConnectionPool());

const checkpointLogs = manager.takeSnapshot();
checkpointLogs.forEach(log => console.log(log));

const resumeLogs = manager.resumeSnapshot();
resumeLogs.forEach(log => console.log(log));`;

  const p4 = `// SnapStart PRNG Uniqueness & Entropy Pool Re-seeding Guard
interface VMEntropyState {
  vmInstanceId: string;
  entropySeed: string;
  isReseededAfterRestore: boolean;
}

class PRNGEntropyGuard {
  evaluatePRNGState(state: VMEntropyState): string {
    if (!state.isReseededAfterRestore) {
      return \`VULNERABILITY_ALERT: VM \${state.vmInstanceId} shares snapshot entropy seed '\${state.entropySeed}'! Cryptographic session collision risk!\`;
    }
    const freshSeed = \`\${state.entropySeed}-reseeded-rnd-\${state.vmInstanceId}\`;
    return \`PRNG_SECURE: VM \${state.vmInstanceId} re-seeded entropy successfully (\${freshSeed})\`;
  }
}

const guard = new PRNGEntropyGuard();
console.log(guard.evaluatePRNGState({
  vmInstanceId: 'vm-replica-01',
  entropySeed: 'seed-0x99A',
  isReseededAfterRestore: false
}));
console.log(guard.evaluatePRNGState({
  vmInstanceId: 'vm-replica-02',
  entropySeed: 'seed-0x99A',
  isReseededAfterRestore: true
}));`;

  const p5 = `// Masterclass Synthesis: Enterprise Firecracker SnapStart Runtime Engine
interface ExecutionInvocation {
  requestId: string;
  mode: 'cold_boot' | 'snapstart_resume';
  provisionedConcurrency: boolean;
}

class FirecrackerSnapStartRuntimeEngine {
  processInvocation(inv: ExecutionInvocation): {
    requestId: string;
    latencyMs: number;
    microVMType: string;
    entropyFresh: boolean;
    status: string;
  } {
    if (inv.mode === 'cold_boot') {
      return {
        requestId: inv.requestId,
        latencyMs: 840,
        microVMType: 'Firecracker-Standard-Cold',
        entropyFresh: true,
        status: 'COLD_START_LATENCY_EVALUATED'
      };
    } else {
      // SnapStart Resume in sub-200ms
      return {
        requestId: inv.requestId,
        latencyMs: 142,
        microVMType: 'Firecracker-SnapStart-Restored',
        entropyFresh: true,
        status: 'SNAPSTART_RESTORE_200MS_ACHIEVED'
      };
    }
  }
}

const engine = new FirecrackerSnapStartRuntimeEngine();
const cold = engine.processInvocation({
  requestId: 'req-cold-01',
  mode: 'cold_boot',
  provisionedConcurrency: false
});

const snap = engine.processInvocation({
  requestId: 'req-snap-02',
  mode: 'snapstart_resume',
  provisionedConcurrency: true
});

console.log(\`Cold Invocation: \${cold.status} (\${cold.latencyMs}ms)\`);
console.log(\`SnapStart Invocation: \${snap.status} (\${snap.latencyMs}ms) [MicroVM: \${snap.microVMType}]\`);
console.log('FIRECRACKER_SNAPSTART_RUNTIME_GRADE_A_PLUS_CERTIFIED');`;

  console.log('--- Testing Day 36 Part 1 ---');
  console.log(await runTs(p1));
  console.log('--- Testing Day 36 Part 2 ---');
  console.log(await runTs(p2));
  console.log('--- Testing Day 36 Part 3 ---');
  console.log(await runTs(p3));
  console.log('--- Testing Day 36 Part 4 ---');
  console.log(await runTs(p4));
  console.log('--- Testing Day 36 Part 5 ---');
  console.log(await runTs(p5));
}

testAll().catch(console.error);
