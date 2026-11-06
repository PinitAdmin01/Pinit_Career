// src/lib/certificates/certificateGenerator.ts
/**
 * Certificate Generator & NFT Proof Verification for PinIT Career OS Internships.
 *
 * Implements honest credentialing, cryptographically verifiable single-use supervisor tokens,
 * and ERC-721/1155 compatible NFT certificate metadata with SHA-256 deliverable proofs.
 */

import crypto from 'node:crypto';
import {
  newInternshipCertificateId,
  getInternshipHonestyLabel,
  INTERNSHIP_CERTIFICATE_PREFIX,
  INTERNSHIP_CERTIFICATE_KIND,
  type InternshipHonestyMetadata,
} from './internshipCertificate';
import {
  generateSupervisorToken,
  hashToken,
  isTokenExpired,
  SUPERVISOR_TOKEN_EXPIRY_HOURS,
} from '@/lib/internships/supervisorEval';

export {
  newInternshipCertificateId,
  getInternshipHonestyLabel,
  INTERNSHIP_CERTIFICATE_PREFIX,
  INTERNSHIP_CERTIFICATE_KIND,
  generateSupervisorToken,
  hashToken,
  isTokenExpired,
  SUPERVISOR_TOKEN_EXPIRY_HOURS,
  type InternshipHonestyMetadata,
};

export interface CertificateNftMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number | boolean;
  }>;
  properties: {
    issuer: string;
    recipientId: string;
    issuedAt: string;
    verificationHash: string;
    honestyClassification: 'simulated_workplace' | 'industry_verified';
  };
}

/**
 * Generates an NFT-verifiable certificate metadata object with SHA-256 fingerprint.
 */
export function generateCertificateNftMetadata(opts: {
  certificateId: string;
  studentId: string;
  studentName?: string;
  tier: string;
  companyName: string;
  issuedAt?: string;
  deliverableHash?: string;
}): CertificateNftMetadata {
  const { certificateId, studentId, studentName = 'Student', tier, companyName, issuedAt = new Date().toISOString(), deliverableHash } = opts;
  const honesty = getInternshipHonestyLabel(tier, companyName);

  const verificationPayload = `${certificateId}:${studentId}:${tier}:${companyName}:${issuedAt}:${deliverableHash || ''}`;
  const verificationHash = crypto.createHash('sha256').update(verificationPayload).digest('hex');

  return {
    id: certificateId,
    name: honesty.title,
    description: honesty.purposeWording,
    image: `https://pinit.career/api/certificates/${certificateId}/badge.svg`,
    external_url: `https://pinit.career/verify/${certificateId}`,
    attributes: [
      { trait_type: 'Internship Tier', value: honesty.tierName },
      { trait_type: 'Role Title', value: honesty.role },
      { trait_type: 'Company / Organization', value: companyName },
      { trait_type: 'Simulation Status', value: honesty.isSimulated ? 'Simulated Enterprise' : 'Industry Verified' },
      { trait_type: 'Verification Method', value: honesty.verificationMethod },
      { trait_type: 'Student Name', value: studentName },
      { trait_type: 'Issued Date', value: issuedAt.split('T')[0] },
    ],
    properties: {
      issuer: 'PinIT Career OS Sovereign Credential Authority',
      recipientId: studentId,
      issuedAt,
      verificationHash,
      honestyClassification: honesty.isSimulated ? 'simulated_workplace' : 'industry_verified',
    },
  };
}
