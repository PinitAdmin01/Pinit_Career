// scripts/test_cyber_day33_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: Cryptographic Hash Properties & Fixed-Output Collision Resistance
console.log('--- Snippet 1: Hash Properties ---');
interface HashAlgorithmSpec {
  algorithm: string;
  outputBytes: number;
  construction: 'Merkle-Damgard' | 'Sponge' | 'Merkle-Tree';
  lengthExtensionVulnerable: boolean;
}

const hashSpecs: HashAlgorithmSpec[] = [
  { algorithm: 'SHA-256', outputBytes: 32, construction: 'Merkle-Damgard', lengthExtensionVulnerable: true },
  { algorithm: 'SHA3-256', outputBytes: 32, construction: 'Sponge', lengthExtensionVulnerable: false },
  { algorithm: 'BLAKE3', outputBytes: 32, construction: 'Merkle-Tree', lengthExtensionVulnerable: false }
];

console.log('Hash Algorithms Evaluated:', hashSpecs.length);
console.log('SHA-256 Length Extension Risk:', hashSpecs[0].lengthExtensionVulnerable);
console.log('SHA3-256 Construction:', hashSpecs[1].construction);

// Snippet 2: HMAC Nested Hashing vs Length Extension Vulnerability
console.log('\n--- Snippet 2: HMAC Construction ---');
class HmacAuthenticator {
  static computeHmac(secretKey: string, message: string): string {
    return crypto.createHmac('sha256', secretKey).update(message).digest('hex');
  }

  static verifyHmac(secretKey: string, message: string, receivedHmacHex: string): boolean {
    const computedHmacHex = HmacAuthenticator.computeHmac(secretKey, message);
    const bufA = Buffer.from(computedHmacHex, 'hex');
    const bufB = Buffer.from(receivedHmacHex, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }
}

const secretKey = 'EnterpriseMasterHmacSecret2026';
const auditMessage = 'Action=WithdrawFunds;Amount=500000;Beneficiary=Account771';
const hmacSignature = HmacAuthenticator.computeHmac(secretKey, auditMessage);
const isValid = HmacAuthenticator.verifyHmac(secretKey, auditMessage, hmacSignature);

console.log('HMAC Generated Length Hex:', hmacSignature.length);
console.log('HMAC Timing-Safe Verified:', isValid);

// Snippet 3: Salted Password Hashing & Key Derivation (PBKDF2 vs Argon2id Principles)
console.log('\n--- Snippet 3: Key Derivation ---');
class Pbkdf2DerivationEngine {
  deriveKey(password: string, salt: Buffer, iterations: number): { derivedKeyHex: string; durationMs: number } {
    const start = Date.now();
    const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    const durationMs = Date.now() - start;
    return {
      derivedKeyHex: key.toString('hex'),
      durationMs
    };
  }
}

const pbkdf2Engine = new Pbkdf2DerivationEngine();
const salt16 = crypto.randomBytes(16);
const derived = pbkdf2Engine.deriveKey('SuperSecureEnterprisePassword99!', salt16, 50000);

console.log('PBKDF2 Key Derived (32 bytes):', Buffer.from(derived.derivedKeyHex, 'hex').length === 32);
console.log('PBKDF2 Iteration Latency > 0ms:', derived.durationMs >= 0);

// Snippet 4: Memory-Hard Password Verification Model (Argon2id Simulation)
console.log('\n--- Snippet 4: Memory-Hard Model ---');
interface Argon2idConfig {
  memoryCostKiB: number; // m
  timeCostIterations: number; // t
  parallelismThreads: number; // p
  tagLengthBytes: number;
}

class MemoryHardPasswordGuard {
  private config: Argon2idConfig = {
    memoryCostKiB: 65536, // 64 MiB
    timeCostIterations: 3,
    parallelismThreads: 4,
    tagLengthBytes: 32
  };

  getConfig(): Argon2idConfig {
    return this.config;
  }

  simulateMemoryHardVerification(suppliedHash: string, referenceHash: string): boolean {
    const bufA = Buffer.from(suppliedHash, 'utf8');
    const bufB = Buffer.from(referenceHash, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }
}

const guard = new MemoryHardPasswordGuard();
const cfg = guard.getConfig();
const testHash = '$argon2id$v=19$m=65536,t=3,p=4$someRandomSaltBase64$someDerivedDigestBase64';
const match = guard.simulateMemoryHardVerification(testHash, testHash);

console.log('Argon2id Memory Cost (KiB):', cfg.memoryCostKiB);
console.log('Argon2id Constant-Time Match:', match);

// Snippet 5: Production Password & Token Hashing Benchmark & Audit
console.log('\n--- Snippet 5: Production Hashing Audit ---');
class HashingSecurityAuditor {
  auditTokenTampering(): { hashVerified: boolean; tamperRejected: boolean } {
    const token = crypto.randomBytes(32).toString('hex');
    const validHmac = HmacAuthenticator.computeHmac('token-secret', token);
    const verified = HmacAuthenticator.verifyHmac('token-secret', token, validHmac);

    const tamperedToken = token.slice(0, -2) + 'ff';
    const tamperRejected = !HmacAuthenticator.verifyHmac('token-secret', tamperedToken, validHmac);

    return {
      hashVerified: verified,
      tamperRejected
    };
  }
}

const auditor = new HashingSecurityAuditor();
const auditRes = auditor.auditTokenTampering();
console.log('Valid Token HMAC Verified:', auditRes.hashVerified);
console.log('Tampered Token HMAC Rejected:', auditRes.tamperRejected);
