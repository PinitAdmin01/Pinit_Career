// scripts/test_cyber_day38_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: OIDC ID Token Validator
interface IdTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce?: string;
  at_hash?: string;
}

class OidcIdTokenValidator {
  static computeAtHash(accessToken: string): string {
    const hash = crypto.createHash('sha256').update(accessToken).digest();
    const leftHalf = hash.subarray(0, 16);
    return leftHalf.toString('base64url');
  }

  static validateNonceAndAtHash(
    idToken: IdTokenPayload,
    expectedNonce: string,
    accessToken?: string
  ): { valid: boolean; error?: string } {
    if (idToken.nonce !== expectedNonce) {
      return { valid: false, error: 'Nonce mismatch' };
    }
    if (accessToken && idToken.at_hash) {
      const computed = this.computeAtHash(accessToken);
      if (computed !== idToken.at_hash) {
        return { valid: false, error: 'at_hash mismatch' };
      }
    }
    return { valid: true };
  }
}

const accessTokenSample = 'sec-tok-alpha-7721-access';
const atHash = OidcIdTokenValidator.computeAtHash(accessTokenSample);
const mockIdToken: IdTokenPayload = {
  iss: 'https://idp.enterprise.domain',
  sub: 'emp-1049',
  aud: 'client-app-portal',
  exp: Date.now() + 300000,
  iat: Date.now(),
  nonce: 'nonce-crypto-random-882',
  at_hash: atHash
};

const v1 = OidcIdTokenValidator.validateNonceAndAtHash(mockIdToken, 'nonce-crypto-random-882', accessTokenSample);
console.log('Snippet 1 Nonce & at_hash Valid:', v1.valid);

// Snippet 2: OIDC Discovery Document
interface OidcDiscoveryDoc {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  userinfo_endpoint: string;
  response_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
}

class OidcDiscoveryManager {
  static validateDiscovery(doc: OidcDiscoveryDoc, expectedIssuer: string): boolean {
    if (doc.issuer !== expectedIssuer) return false;
    if (!doc.authorization_endpoint.startsWith('https://')) return false;
    if (!doc.token_endpoint.startsWith('https://')) return false;
    if (!doc.jwks_uri.startsWith('https://')) return false;
    if (!doc.userinfo_endpoint.startsWith('https://')) return false;
    return true;
  }
}

const mockDiscovery: OidcDiscoveryDoc = {
  issuer: 'https://idp.enterprise.domain',
  authorization_endpoint: 'https://idp.enterprise.domain/oauth2/v1/authorize',
  token_endpoint: 'https://idp.enterprise.domain/oauth2/v1/token',
  jwks_uri: 'https://idp.enterprise.domain/oauth2/v1/keys',
  userinfo_endpoint: 'https://idp.enterprise.domain/oauth2/v1/userinfo',
  response_types_supported: ['code'],
  id_token_signing_alg_values_supported: ['RS256', 'ES256']
};

const discoveryValid = OidcDiscoveryManager.validateDiscovery(mockDiscovery, 'https://idp.enterprise.domain');
console.log('Snippet 2 Discovery Validated:', discoveryValid);

// Snippet 3: JWKS Key Set Manager
interface JwkKey {
  kty: string;
  kid: string;
  use: string;
  alg: string;
  n: string;
  e: string;
}

interface JwksDocument {
  keys: JwkKey[];
}

class JwksCache {
  private cache = new Map<string, JwkKey>();

  loadKeys(doc: JwksDocument): void {
    this.cache.clear();
    for (const k of doc.keys) {
      this.cache.set(k.kid, k);
    }
  }

  resolveKey(kid: string): JwkKey | undefined {
    return this.cache.get(kid);
  }

  get keyCount(): number {
    return this.cache.size;
  }
}

const jwksDoc: JwksDocument = {
  keys: [
    {
      kty: 'RSA',
      kid: 'rsa-key-active-2026',
      use: 'sig',
      alg: 'RS256',
      n: 'mockModulusValueString',
      e: 'AQAB'
    },
    {
      kty: 'RSA',
      kid: 'rsa-key-rotated-2025',
      use: 'sig',
      alg: 'RS256',
      n: 'mockModulusValueOld',
      e: 'AQAB'
    }
  ]
};

const jwksCache = new JwksCache();
jwksCache.loadKeys(jwksDoc);
console.log('Snippet 3 JWKS Loaded Keys:', jwksCache.keyCount);
console.log('Snippet 3 Key Resolved:', jwksCache.resolveKey('rsa-key-active-2026') !== undefined);

// Snippet 4: UserInfo Client
interface UserInfoClaims {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
}

class OidcUserInfoClient {
  static mockFetchUserInfo(
    accessToken: string,
    mockDb: Map<string, UserInfoClaims>
  ): { status: number; claims?: UserInfoClaims } {
    if (!accessToken.startsWith('bearer-valid-')) {
      return { status: 401 };
    }
    const claims = mockDb.get(accessToken);
    if (!claims) return { status: 404 };
    return { status: 200, claims };
  }
}

const mockUserStore = new Map<string, UserInfoClaims>();
mockUserStore.set('bearer-valid-tok-1', {
  sub: 'emp-1049',
  name: 'Security Engineer',
  email: 'engineer@enterprise.domain',
  email_verified: true
});

const userInfoRes = OidcUserInfoClient.mockFetchUserInfo('bearer-valid-tok-1', mockUserStore);
console.log('Snippet 4 UserInfo Fetched:', userInfoRes.status === 200);
console.log('Snippet 4 User Email:', userInfoRes.claims?.email);

// Snippet 5: Production OIDC Engine
class ProductionOidcEngine {
  processAuthenticationFlow(
    idToken: IdTokenPayload,
    accessToken: string,
    expectedNonce: string,
    expectedIssuer: string
  ): { authenticated: boolean; sub?: string; error?: string } {
    if (idToken.iss !== expectedIssuer) {
      return { authenticated: false, error: 'Issuer mismatch' };
    }
    const check = OidcIdTokenValidator.validateNonceAndAtHash(idToken, expectedNonce, accessToken);
    if (!check.valid) {
      return { authenticated: false, error: check.error };
    }
    return { authenticated: true, sub: idToken.sub };
  }
}

const engine = new ProductionOidcEngine();
const authResult = engine.processAuthenticationFlow(
  mockIdToken,
  accessTokenSample,
  'nonce-crypto-random-882',
  'https://idp.enterprise.domain'
);
console.log('Snippet 5 Production OIDC Authenticated:', authResult.authenticated);
console.log('Snippet 5 Subject:', authResult.sub);
