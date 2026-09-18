'use client';

import React from 'react';
import Image from 'next/image';
import { CompanyProfile } from '../hooks/useRecruiterData';

interface CompanyProfilePanelProps {
  companyProfile: CompanyProfile;
  setCompanyProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  companyLoading: boolean;
  companySaving: boolean;
  companyEditing: boolean;
  setCompanyEditing: (editing: boolean) => void;
  saveCompany: (e: React.FormEvent) => Promise<void>;
}

export default function CompanyProfilePanel({
  companyProfile,
  setCompanyProfile,
  companyLoading,
  companySaving,
  companyEditing,
  setCompanyEditing,
  saveCompany,
}: CompanyProfilePanelProps) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, margin: 0 }}>Company Profile</h3>
        {!companyEditing && (
          <button onClick={() => setCompanyEditing(true)} className="btn-ghost btn-sm" style={{ border: '1px solid var(--border)' }}>
            ✏ Edit Profile
          </button>
        )}
      </div>

      {companyLoading ? (
        <div>Loading profile details...</div>
      ) : !companyEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              {companyProfile.logo_url ? (
                <Image
                  src={companyProfile.logo_url}
                  alt=""
                  width={64}
                  height={64}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                  unoptimized
                />
              ) : (
                '🏢'
              )}
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{companyProfile.company_name}</h4>
              <p style={{ color: 'var(--t3)', fontSize: 12, margin: '2px 0 0' }}>
                {companyProfile.tagline || 'No tagline added'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
            <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
              <span style={{ color: 'var(--t3)' }}>Industry: </span>
              <strong>{companyProfile.industry}</strong>
            </div>
            <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
              <span style={{ color: 'var(--t3)' }}>Staff Size: </span>
              <strong>{companyProfile.company_size}</strong>
            </div>
            <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
              <span style={{ color: 'var(--t3)' }}>Founded: </span>
              <strong>{companyProfile.founded_year || '—'}</strong>
            </div>
            <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
              <span style={{ color: 'var(--t3)' }}>HQ: </span>
              <strong>
                {[companyProfile.headquarters, companyProfile.city, companyProfile.state, companyProfile.country]
                  .filter(Boolean)
                  .join(', ') || '—'}
              </strong>
            </div>
            {companyProfile.contact_email && (
              <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                <span style={{ color: 'var(--t3)' }}>Contact Email: </span>
                <strong>{companyProfile.contact_email}</strong>
              </div>
            )}
            {companyProfile.contact_phone && (
              <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                <span style={{ color: 'var(--t3)' }}>Contact Phone: </span>
                <strong>{companyProfile.contact_phone}</strong>
              </div>
            )}
          </div>

          {companyProfile.website && (
            <div style={{ fontSize: 12 }}>
              Website:{' '}
              <a
                href={companyProfile.website}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline' }}
              >
                {companyProfile.website}
              </a>
            </div>
          )}

          {companyProfile.about && (
            <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>About us</div>
              {companyProfile.about}
            </div>
          )}

          {companyProfile.benefits && (
            <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>Benefits & Perks</div>
              {companyProfile.benefits}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={saveCompany} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Company Name *</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.company_name}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, company_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Tagline</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.tagline}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="We deliver excellence"
              />
            </div>
            <div>
              <label className="form-label">Logo URL</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.logo_url}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, logo_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.website}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="form-label">Contact Email</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                type="email"
                value={companyProfile.contact_email}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, contact_email: e.target.value }))}
                placeholder="recruiter@company.com"
              />
            </div>
            <div>
              <label className="form-label">Contact Phone</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.contact_phone}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, contact_phone: e.target.value }))}
                placeholder="e.g. +91 999999999"
              />
            </div>
            <div>
              <label className="form-label">Industry</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.industry}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, industry: e.target.value }))}
              >
                {[
                  'Technology',
                  'Finance & Banking',
                  'Healthcare',
                  'Education',
                  'E-Commerce',
                  'Consulting',
                  'Other',
                ].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Company Size</label>
              <select
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.company_size}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, company_size: e.target.value }))}
              >
                {['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees'].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="form-label">Founded Year</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.founded_year}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, founded_year: e.target.value }))}
                placeholder="e.g. 2018"
              />
            </div>
            <div>
              <label className="form-label">Headquarters / City</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.headquarters}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, headquarters: e.target.value }))}
                placeholder="e.g. Bangalore"
              />
            </div>
            <div>
              <label className="form-label">State</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.state}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, state: e.target.value }))}
                placeholder="e.g. Karnataka"
              />
            </div>
            <div>
              <label className="form-label">Country</label>
              <input
                className="form-input"
                style={{ width: '100%' }}
                value={companyProfile.country}
                onChange={(e) => setCompanyProfile((p) => ({ ...p, country: e.target.value }))}
                placeholder="e.g. India"
              />
            </div>
          </div>
          <div>
            <label className="form-label">About Description</label>
            <textarea
              className="form-input"
              style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
              value={companyProfile.about}
              onChange={(e) => setCompanyProfile((p) => ({ ...p, about: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Perks & Benefits Offered</label>
            <textarea
              className="form-input"
              style={{ width: '100%', minHeight: 60, resize: 'vertical' }}
              value={companyProfile.benefits}
              onChange={(e) => setCompanyProfile((p) => ({ ...p, benefits: e.target.value }))}
              placeholder="e.g. Health insurance, flexible hours, work from home allowances"
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" onClick={() => setCompanyEditing(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={companySaving} className="btn-primary">
              {companySaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
