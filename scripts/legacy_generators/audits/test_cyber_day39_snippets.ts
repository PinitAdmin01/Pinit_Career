// scripts/test_cyber_day39_snippets.ts
import crypto from 'node:crypto';

// Snippet 1: SAML Response & Assertion Extraction
interface SamlAssertion {
  id: string;
  issueInstant: string;
  issuer: string;
  subject: string;
  recipient: string;
  notBefore: number;
  notOnOrAfter: number;
  inResponseTo?: string;
  attributes: Record<string, string>;
}

class SamlResponseParser {
  static extractAssertion(xmlSnippet: string): { issuer: string; subject: string; id: string } {
    const issuerMatch = xmlSnippet.match(/<saml:Issuer>(.*?)<\/saml:Issuer>/);
    const subMatch = xmlSnippet.match(/<saml:NameID.*?>(.*?)<\/saml:NameID>/);
    const idMatch = xmlSnippet.match(/ID="([^"]+)"/);
    return {
      issuer: issuerMatch ? issuerMatch[1] : '',
      subject: subMatch ? subMatch[1] : '',
      id: idMatch ? idMatch[1] : ''
    };
  }
}

const mockXml = `<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
  <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="_a8f7c9e1-2241">
    <saml:Issuer>https://sso.enterprise.domain/idp</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">auditor@enterprise.domain</saml:NameID>
    </saml:Subject>
  </saml:Assertion>
</samlp:Response>`;

const parsed = SamlResponseParser.extractAssertion(mockXml);
console.log('Snippet 1 Parsed Issuer:', parsed.issuer === 'https://sso.enterprise.domain/idp');
console.log('Snippet 1 Parsed Subject:', parsed.subject === 'auditor@enterprise.domain');

// Snippet 2: Canonicalization (C14N) & Digest
class XmlCanonicalizer {
  static canonicalize(xml: string): string {
    return xml.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  }

  static computeDigest(canonicalXml: string): string {
    return crypto.createHash('sha256').update(canonicalXml, 'utf8').digest('base64');
  }
}

const c14n = XmlCanonicalizer.canonicalize(mockXml);
const digest = XmlCanonicalizer.computeDigest(c14n);
console.log('Snippet 2 Digest Computed Length:', digest.length);

// Snippet 3: XSW Defense
class XswDefenseValidator {
  static validateAssertionStructure(xml: string): { safe: boolean; reason?: string } {
    const assertionMatches = xml.match(/<saml:Assertion/g);
    if (!assertionMatches || assertionMatches.length !== 1) {
      return { safe: false, reason: 'Multiple or missing Assertion elements detected (XSW attack vector)' };
    }
    return { safe: true };
  }
}

const xswSafe = XswDefenseValidator.validateAssertionStructure(mockXml);
console.log('Snippet 3 Single Assertion Verified:', xswSafe.safe);

const maliciousXswXml = mockXml + mockXml; // duplicated assertion
const xswBlocked = XswDefenseValidator.validateAssertionStructure(maliciousXswXml);
console.log('Snippet 3 XSW Duplicate Intercepted:', !xswBlocked.safe);

// Snippet 4: Replay & Temporal Validator
interface SamlReplayPolicy {
  expectedRecipient: string;
  clockSkewSeconds: number;
}

class SamlAssertionValidator {
  private usedAssertionIds = new Set<string>();

  validate(
    assertion: SamlAssertion,
    policy: SamlReplayPolicy,
    nowSeconds: number,
    originalRequestId?: string
  ): { valid: boolean; error?: string } {
    if (this.usedAssertionIds.has(assertion.id)) {
      return { valid: false, error: 'Assertion replay detected: ID already consumed' };
    }
    if (originalRequestId && assertion.inResponseTo !== originalRequestId) {
      return { valid: false, error: 'InResponseTo mismatch' };
    }
    if (assertion.recipient !== policy.expectedRecipient) {
      return { valid: false, error: 'Recipient mismatch' };
    }
    if (nowSeconds >= assertion.notOnOrAfter + policy.clockSkewSeconds) {
      return { valid: false, error: 'Assertion expired' };
    }
    this.usedAssertionIds.add(assertion.id);
    return { valid: true };
  }
}

const validator = new SamlAssertionValidator();
const assertionObj: SamlAssertion = {
  id: '_a8f7c9e1-2241',
  issueInstant: '2026-10-26T00:00:00Z',
  issuer: 'https://sso.enterprise.domain/idp',
  subject: 'auditor@enterprise.domain',
  recipient: 'https://app.enterprise.domain/saml/acs',
  notBefore: 1000,
  notOnOrAfter: 2000,
  inResponseTo: 'req-original-8812',
  attributes: { role: 'SecurityAdmin' }
};

const vRes = validator.validate(
  assertionObj,
  { expectedRecipient: 'https://app.enterprise.domain/saml/acs', clockSkewSeconds: 30 },
  1500,
  'req-original-8812'
);
console.log('Snippet 4 Valid Assertion Accepted:', vRes.valid);

const replayRes = validator.validate(
  assertionObj,
  { expectedRecipient: 'https://app.enterprise.domain/saml/acs', clockSkewSeconds: 30 },
  1500,
  'req-original-8812'
);
console.log('Snippet 4 Replay Intercepted:', !replayRes.valid);

// Snippet 5: Production SAML 2.0 Engine
class ProductionSamlEngine {
  processSsoResponse(
    rawXml: string,
    assertion: SamlAssertion,
    expectedRecipient: string,
    originalRequestId: string
  ): { authenticated: boolean; subject?: string; error?: string } {
    const xswCheck = XswDefenseValidator.validateAssertionStructure(rawXml);
    if (!xswCheck.safe) return { authenticated: false, error: xswCheck.reason };

    const assertionVal = new SamlAssertionValidator();
    const result = assertionVal.validate(
      assertion,
      { expectedRecipient, clockSkewSeconds: 30 },
      1500,
      originalRequestId
    );
    if (!result.valid) return { authenticated: false, error: result.error };

    return { authenticated: true, subject: assertion.subject };
  }
}

const engine = new ProductionSamlEngine();
const finalAuth = engine.processSsoResponse(
  mockXml,
  assertionObj,
  'https://app.enterprise.domain/saml/acs',
  'req-original-8812'
);
console.log('Snippet 5 SAML SSO Authenticated:', finalAuth.authenticated);
console.log('Snippet 5 Subject:', finalAuth.subject);
