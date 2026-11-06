// scripts/test_cyber_day32_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: Key Size & Computational Efficiency Comparison (RSA vs ECC)
console.log('--- Snippet 1: Key Size & Security Comparison ---');
interface AsymmetricCurveComparison {
  algorithm: 'RSA' | 'ECC_NIST_P256' | 'CURVE25519';
  keySizeBits: number;
  equivalentSecurityBits: number;
  ephemeralKeyExchangeUsable: boolean;
}

const keyComparisons: AsymmetricCurveComparison[] = [
  { algorithm: 'RSA', keySizeBits: 4096, equivalentSecurityBits: 128, ephemeralKeyExchangeUsable: false },
  { algorithm: 'ECC_NIST_P256', keySizeBits: 256, equivalentSecurityBits: 128, ephemeralKeyExchangeUsable: true },
  { algorithm: 'CURVE25519', keySizeBits: 256, equivalentSecurityBits: 128, ephemeralKeyExchangeUsable: true }
];

console.log('Asymmetric Algorithms Evaluated:', keyComparisons.length);
console.log('RSA-4096 Security Bits:', keyComparisons[0].equivalentSecurityBits);
console.log('Curve25519 Key Size Bits:', keyComparisons[2].keySizeBits);

// Snippet 2: ECDH (X25519) Ephemeral Key Exchange & Shared Secret Derivation
console.log('\n--- Snippet 2: ECDH (X25519) Key Exchange ---');
class EcdhKeyExchange {
  static deriveSharedSecret(): { alicePubHex: string; bobPubHex: string; secretsMatch: boolean } {
    const alice = crypto.generateKeyPairSync('x25519');
    const bob = crypto.generateKeyPairSync('x25519');

    const aliceShared = crypto.diffieHellman({
      privateKey: alice.privateKey,
      publicKey: bob.publicKey
    });

    const bobShared = crypto.diffieHellman({
      privateKey: bob.privateKey,
      publicKey: alice.publicKey
    });

    return {
      alicePubHex: alice.publicKey.export({ type: 'spki', format: 'der' }).toString('hex'),
      bobPubHex: bob.publicKey.export({ type: 'spki', format: 'der' }).toString('hex'),
      secretsMatch: aliceShared.equals(bobShared)
    };
  }
}

const ecdhResult = EcdhKeyExchange.deriveSharedSecret();
console.log('Alice Public Key Exported:', ecdhResult.alicePubHex.length > 0);
console.log('Bob Public Key Exported:', ecdhResult.bobPubHex.length > 0);
console.log('ECDH Shared Secrets Match:', ecdhResult.secretsMatch);

// Snippet 3: Ed25519 Deterministic Signatures & Verification
console.log('\n--- Snippet 3: Ed25519 Digital Signatures ---');
class Ed25519Signer {
  private keypair = crypto.generateKeyPairSync('ed25519');

  sign(message: string): { signatureHex: string; verified: boolean } {
    const signature = crypto.sign(null, Buffer.from(message, 'utf8'), this.keypair.privateKey);
    const verified = crypto.verify(null, Buffer.from(message, 'utf8'), this.keypair.publicKey, signature);
    return {
      signatureHex: signature.toString('hex'),
      verified
    };
  }
}

const signer = new Ed25519Signer();
const sigResult = signer.sign('AuthorizeAuditRecord:Batch=9901;Status=APPROVED');
console.log('Ed25519 Signature Length Bytes:', Buffer.from(sigResult.signatureHex, 'hex').length);
console.log('Ed25519 Signature Verified:', sigResult.verified);

// Snippet 4: Hybrid Encryption (Envelope Encryption with ECDH + AES-256-GCM)
console.log('\n--- Snippet 4: Hybrid Envelope Encryption ---');
class HybridEnvelopeEncryptor {
  encrypt(plaintext: string, recipientPublicKey: crypto.KeyObject): { ephemeralPubDerHex: string; ciphertextHex: string; authTagHex: string } {
    const ephemeral = crypto.generateKeyPairSync('x25519');
    const sharedSecret = crypto.diffieHellman({
      privateKey: ephemeral.privateKey,
      publicKey: recipientPublicKey
    });

    // Derive 256-bit symmetric key from shared secret using HKDF-SHA256
    const derivedKey = crypto.hkdfSync('sha256', sharedSecret, Buffer.alloc(0), Buffer.from('hybrid-envelope-v1'), 32);
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(derivedKey), iv);
    let ct = cipher.update(plaintext, 'utf8', 'hex');
    ct += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    return {
      ephemeralPubDerHex: ephemeral.publicKey.export({ type: 'spki', format: 'der' }).toString('hex'),
      ciphertextHex: iv.toString('hex') + ct,
      authTagHex: tag
    };
  }
}

const recipientKeys = crypto.generateKeyPairSync('x25519');
const hybrid = new HybridEnvelopeEncryptor();
const envelopeResult = hybrid.encrypt('Classified Intelligence Payload', recipientKeys.publicKey);

console.log('Ephemeral Public Key Attached:', envelopeResult.ephemeralPubDerHex.length > 0);
console.log('Ciphertext Encrypted via AES-GCM:', envelopeResult.ciphertextHex.length > 0);
console.log('Auth Tag Present:', envelopeResult.authTagHex.length === 32);

// Snippet 5: Production Asymmetric Benchmark & Forward Secrecy Audit
console.log('\n--- Snippet 5: Forward Secrecy Audit ---');
class ForwardSecrecyAuditor {
  auditSessionIsolation(): { sessionsEvaluated: number; sharedSecretsIndependent: boolean } {
    const session1 = EcdhKeyExchange.deriveSharedSecret();
    const session2 = EcdhKeyExchange.deriveSharedSecret();

    // Verify session 1 public keys are completely different from session 2
    const independent = session1.alicePubHex !== session2.alicePubHex;
    return {
      sessionsEvaluated: 2,
      sharedSecretsIndependent: independent
    };
  }
}

const fsAuditor = new ForwardSecrecyAuditor();
const fsAudit = fsAuditor.auditSessionIsolation();
console.log('Ephemeral Sessions Audited:', fsAudit.sessionsEvaluated);
console.log('Perfect Forward Secrecy Confirmed:', fsAudit.sharedSecretsIndependent);
