// scripts/test_cyber_day43_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: CSRF Origin Analyzer
interface RequestContext {
  method: string;
  origin?: string;
  referer?: string;
  secFetchSite?: 'same-origin' | 'same-site' | 'cross-site' | 'none';
}

class CsrfOriginAnalyzer {
  static isCrossSiteRequest(req: RequestContext, expectedOrigin: string): boolean {
    if (req.secFetchSite) {
      return req.secFetchSite === 'cross-site';
    }
    if (req.origin) {
      return req.origin !== expectedOrigin;
    }
    if (req.referer) {
      try {
        const refOrigin = new URL(req.referer).origin;
        return refOrigin !== expectedOrigin;
      } catch {
        return true;
      }
    }
    return req.method !== 'GET' && req.method !== 'HEAD';
  }
}

const reqSame: RequestContext = { method: 'POST', origin: 'https://bank.enterprise.domain', secFetchSite: 'same-origin' };
const reqCross: RequestContext = { method: 'POST', origin: 'https://evil-attacker.domain', secFetchSite: 'cross-site' };
console.log('Snippet 1 Same Origin Request Allowed:', !CsrfOriginAnalyzer.isCrossSiteRequest(reqSame, 'https://bank.enterprise.domain'));
console.log('Snippet 1 Cross Site Request Blocked:', CsrfOriginAnalyzer.isCrossSiteRequest(reqCross, 'https://bank.enterprise.domain'));

// Snippet 2: Cookie Header Builder
interface CookieOptions {
  name: string;
  value: string;
  sameSite: 'Strict' | 'Lax' | 'None';
  secure: boolean;
  httpOnly: boolean;
  path: string;
}

class CookieHeaderBuilder {
  static buildSetCookie(opts: CookieOptions): string {
    const parts = [
      `${opts.name}=${opts.value}`,
      `Path=${opts.path}`,
      `SameSite=${opts.sameSite}`
    ];
    if (opts.httpOnly) parts.push('HttpOnly');
    if (opts.secure) parts.push('Secure');
    return parts.join('; ');
  }
}

const cookieHeader = CookieHeaderBuilder.buildSetCookie({
  name: 'session_token',
  value: 'xyz-secret-token-998',
  sameSite: 'Lax',
  secure: true,
  httpOnly: true,
  path: '/'
});
console.log('Snippet 2 SameSite Lax Emitted:', cookieHeader.includes('SameSite=Lax'));
console.log('Snippet 2 HttpOnly & Secure Bound:', cookieHeader.includes('HttpOnly; Secure'));

// Snippet 3: Synchronizer Token Pattern (STP)
class CsrfTokenManager {
  static generateToken(sessionSecret: string): string {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha256', sessionSecret).update(randomBytes).digest('hex');
    return `${randomBytes}.${hmac}`;
  }

  static verifyToken(token: string, sessionSecret: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const computed = crypto.createHmac('sha256', sessionSecret).update(parts[0]).digest('hex');
    const bufA = Buffer.from(parts[1], 'utf8');
    const bufB = Buffer.from(computed, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }
}

const secretKey = 'session-hmac-master-key-2026';
const token = CsrfTokenManager.generateToken(secretKey);
const isValidToken = CsrfTokenManager.verifyToken(token, secretKey);
const isForgedToken = CsrfTokenManager.verifyToken(token, 'wrong-secret-key');
console.log('Snippet 3 CSRF Token Validated:', isValidToken);
console.log('Snippet 3 Forged Token Intercepted:', !isForgedToken);

// Snippet 4: CORS Preflight Evaluator
interface CorsPolicyConfig {
  allowedOrigins: Set<string>;
  allowCredentials: boolean;
  allowedMethods: string[];
  allowedHeaders: string[];
}

class CorsEvaluator {
  static evaluatePreflight(origin: string, policy: CorsPolicyConfig): { allow: boolean; headers: Record<string, string> } {
    if (origin === 'null' || !policy.allowedOrigins.has(origin)) {
      return { allow: false, headers: {} };
    }
    const headers: Record<string, string> = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': policy.allowedMethods.join(', '),
      'Access-Control-Allow-Headers': policy.allowedHeaders.join(', ')
    };
    if (policy.allowCredentials) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return { allow: true, headers };
  }
}

const corsPolicy: CorsPolicyConfig = {
  allowedOrigins: new Set(['https://partner.enterprise.domain']),
  allowCredentials: true,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};

const preflightValid = CorsEvaluator.evaluatePreflight('https://partner.enterprise.domain', corsPolicy);
const preflightNull = CorsEvaluator.evaluatePreflight('null', corsPolicy);
console.log('Snippet 4 Trusted Origin Allowed:', preflightValid.allow);
console.log('Snippet 4 Null Origin Blocked:', !preflightNull.allow);
console.log('Snippet 4 Credentials Header Set:', preflightValid.headers['Access-Control-Allow-Credentials'] === 'true');

// Snippet 5: Production CSRF & CORS Gateway Filter
class ProductionCsrfCorsGateway {
  validateTransaction(
    method: string,
    origin: string,
    csrfHeaderToken: string,
    sessionSecret: string,
    allowedOrigins: Set<string>
  ): { authorized: boolean; reason?: string } {
    if (method !== 'GET' && method !== 'HEAD') {
      if (!allowedOrigins.has(origin)) {
        return { authorized: false, reason: 'Untrusted origin' };
      }
      if (!CsrfTokenManager.verifyToken(csrfHeaderToken, sessionSecret)) {
        return { authorized: false, reason: 'Invalid CSRF token' };
      }
    }
    return { authorized: true };
  }
}

const gateway = new ProductionCsrfCorsGateway();
const postAuth = gateway.validateTransaction(
  'POST',
  'https://partner.enterprise.domain',
  token,
  secretKey,
  new Set(['https://partner.enterprise.domain'])
);
console.log('Snippet 5 Production Transaction Authorized:', postAuth.authorized);
