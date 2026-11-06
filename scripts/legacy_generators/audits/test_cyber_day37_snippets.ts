// scripts/test_cyber_day37_snippets.ts
import crypto from 'node:crypto';

// Snippet 1
interface JwsHeader {
  alg: string;
  typ: string;
  kid?: string;
}

interface JwsPayload {
  sub: string;
  iss: string;
  exp: number;
  aud?: string;
  [key: string]: any;
}

class JwsParser {
  static base64UrlEncode(str: string): string {
    return Buffer.from(str, 'utf8').toString('base64url');
  }

  static base64UrlDecode(str: string): string {
    return Buffer.from(str, 'base64url').toString('utf8');
  }

  static parse(token: string): { header: JwsHeader; payload: JwsPayload; signature: string } {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWS format: expected 3 parts');
    const header = JSON.parse(this.base64UrlDecode(parts[0])) as JwsHeader;
    const payload = JSON.parse(this.base64UrlDecode(parts[1])) as JwsPayload;
    return { header, payload, signature: parts[2] };
  }
}

const mockHeader: JwsHeader = { alg: 'RS256', typ: 'JWT', kid: 'rsa-key-2026' };
const mockPayload: JwsPayload = { sub: 'usr-901', iss: 'https://auth.enterprise.domain', exp: 1770000000 };
const encodedH = JwsParser.base64UrlEncode(JSON.stringify(mockHeader));
const encodedP = JwsParser.base64UrlEncode(JSON.stringify(mockPayload));
const mockToken = `${encodedH}.${encodedP}.mockSignatureValue`;

const parsed = JwsParser.parse(mockToken);
console.log('Snippet 1 Parsed Sub:', parsed.payload.sub === 'usr-901');

// Snippet 2: Asymmetric Sign & Verify
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

class JwsSigner {
  static createSignature(headerB64: string, payloadB64: string, privKey: string): string {
    const data = `${headerB64}.${payloadB64}`;
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privKey).toString('base64url');
  }

  static verifySignature(headerB64: string, payloadB64: string, signatureB64: string, pubKey: string): boolean {
    const data = `${headerB64}.${payloadB64}`;
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(pubKey, Buffer.from(signatureB64, 'base64url'));
  }
}

const sig = JwsSigner.createSignature(encodedH, encodedP, privateKey);
const isValidSig = JwsSigner.verifySignature(encodedH, encodedP, sig, publicKey);
console.log('Snippet 2 Signature Valid:', isValidSig);

// Snippet 3: Alg Confusion Guard
class JwtAlgorithmGuard {
  private allowedAlgorithms = new Set(['RS256', 'ES256']);

  validateHeader(header: { alg: string }): { safe: boolean; reason?: string } {
    if (!header.alg || header.alg.toLowerCase() === 'none') {
      return { safe: false, reason: 'Algorithm none is strictly forbidden' };
    }
    if (!this.allowedAlgorithms.has(header.alg)) {
      return { safe: false, reason: `Algorithm ${header.alg} is not in strict whitelist` };
    }
    return { safe: true };
  }
}

const algGuard = new JwtAlgorithmGuard();
const noneCheck = algGuard.validateHeader({ alg: 'none' });
const rsCheck = algGuard.validateHeader({ alg: 'RS256' });
console.log('Snippet 3 Alg None Blocked:', !noneCheck.safe);
console.log('Snippet 3 RS256 Allowed:', rsCheck.safe);

// Snippet 4: Claims validation with clock skew
interface ClaimsPolicy {
  expectedIssuer: string;
  expectedAudience: string;
  clockSkewSeconds: number;
}

class JwtClaimsValidator {
  static validate(
    payload: { iss?: string; aud?: string; exp?: number; nbf?: number },
    policy: ClaimsPolicy,
    nowSeconds: number
  ): { valid: boolean; error?: string } {
    if (payload.iss !== policy.expectedIssuer) {
      return { valid: false, error: 'Issuer mismatch' };
    }
    if (payload.aud !== policy.expectedAudience) {
      return { valid: false, error: 'Audience mismatch' };
    }
    if (payload.exp !== undefined && nowSeconds >= payload.exp + policy.clockSkewSeconds) {
      return { valid: false, error: 'Token has expired' };
    }
    if (payload.nbf !== undefined && nowSeconds < payload.nbf - policy.clockSkewSeconds) {
      return { valid: false, error: 'Token not yet valid' };
    }
    return { valid: true };
  }
}

const policy: ClaimsPolicy = {
  expectedIssuer: 'https://auth.enterprise.domain',
  expectedAudience: 'https://api.enterprise.domain',
  clockSkewSeconds: 30
};

const validClaims = JwtClaimsValidator.validate(
  {
    iss: 'https://auth.enterprise.domain',
    aud: 'https://api.enterprise.domain',
    exp: 1000,
    nbf: 500
  },
  policy,
  1020 // within 30s skew of 1000 exp
);
console.log('Snippet 4 Claims Valid Under Skew:', validClaims.valid);

// Snippet 5: Production JWT Auditor
class ProductionJwtAuditor {
  auditToken(
    token: string,
    pubKey: string,
    pol: ClaimsPolicy,
    nowSec: number
  ): { success: boolean; sub?: string; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { success: false, error: 'Invalid token structure' };

      const guard = new JwtAlgorithmGuard();
      const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
      const headerCheck = guard.validateHeader(header);
      if (!headerCheck.safe) return { success: false, error: headerCheck.reason };

      const sigValid = JwsSigner.verifySignature(parts[0], parts[1], parts[2], pubKey);
      if (!sigValid) return { success: false, error: 'Invalid cryptographic signature' };

      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      const claimsCheck = JwtClaimsValidator.validate(payload, pol, nowSec);
      if (!claimsCheck.valid) return { success: false, error: claimsCheck.error };

      return { success: true, sub: payload.sub };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

const fullToken = `${encodedH}.${encodedP}.${sig}`;
const auditor = new ProductionJwtAuditor();
const auditRes = auditor.auditToken(
  fullToken,
  publicKey,
  {
    expectedIssuer: 'https://auth.enterprise.domain',
    expectedAudience: '', // empty to check mismatch or matching
    clockSkewSeconds: 30
  },
  1760000000
);
console.log('Snippet 5 Production Auditor Executed');
