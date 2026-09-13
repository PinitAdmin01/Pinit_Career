'use client';

import React from 'react';

interface VisaTrackerViewProps {
  allStudents: any[];
  selectedVisaStudent: string;
  setSelectedVisaStudent: (s: string) => void;
  studentForm: {
    displayName: string;
    email: string;
    phone: string;
    targetCountry: string;
    targetUniversities: string;
    programType: string;
    budget: string;
    intakeYear: string;
    notes: string;
  };
  setStudentForm: React.Dispatch<
    React.SetStateAction<{
      displayName: string;
      email: string;
      phone: string;
      targetCountry: string;
      targetUniversities: string;
      programType: string;
      budget: string;
      intakeYear: string;
      notes: string;
    }>
  >;
  addStudent: (e: React.FormEvent) => Promise<void>;
  studyAbroadSubTab: string;
  setStudyAbroadSubTab: (tab: string) => void;
  countryCompA: string;
  setCountryCompA: (c: string) => void;
  countryCompB: string;
  setCountryCompB: (c: string) => void;
}

const COUNTRY_DATA: Record<
  string,
  { prEase: string; postStudyWork: string; visaRate: string; avgTuition: string; livingCost: string }
> = {
  Canada: {
    prEase: 'High (Express Entry & PNP)',
    postStudyWork: 'Up to 3 Years (PGWP)',
    visaRate: '76%',
    avgTuition: 'CAD $22,000 / yr',
    livingCost: 'CAD $15,000 / yr',
  },
  Germany: {
    prEase: 'Very High (Blue Card fast-track)',
    postStudyWork: '18 Months',
    visaRate: '88%',
    avgTuition: 'Free / €350 semester fee',
    livingCost: '€11,208 / yr blocked acct',
  },
  USA: {
    prEase: 'Competitive (H-1B lottery to EB-2)',
    postStudyWork: '12 mos + 24 mos STEM OPT',
    visaRate: '72%',
    avgTuition: 'USD $32,000 / yr',
    livingCost: 'USD $18,000 / yr',
  },
  Singapore: {
    prEase: 'Moderate (EP to PR track)',
    postStudyWork: '1 Year (LTVP)',
    visaRate: '85%',
    avgTuition: 'SGD $28,000 / yr',
    livingCost: 'SGD $16,000 / yr',
  },
};

export default function VisaTrackerView({
  allStudents,
  selectedVisaStudent,
  setSelectedVisaStudent,
  studentForm,
  setStudentForm,
  addStudent,
  studyAbroadSubTab,
  setStudyAbroadSubTab,
  countryCompA,
  setCountryCompA,
  countryCompB,
  setCountryCompB,
}: VisaTrackerViewProps) {
  const dataA = COUNTRY_DATA[countryCompA] || COUNTRY_DATA['Germany'];
  const dataB = COUNTRY_DATA[countryCompB] || COUNTRY_DATA['Canada'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20 }} className="fade-in">
      {/* Left Column: Countries list & Target states */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>
            Global Admissions Pipelines
          </h3>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--t3)' }}>
            Select a candidate to view their active visa advisor status.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allStudents.length === 0 ? (
            <div
              style={{
                padding: 20,
                textAlign: 'center',
                color: 'var(--t3)',
                fontSize: 12.5,
                border: '1px solid var(--border)',
                borderRadius: 12,
              }}
            >
              No pipeline data
            </div>
          ) : (
            allStudents.map((raw: any, idx: number) => {
              const c = {
                name: raw.displayName || raw.name || 'Candidate',
                country: raw.targetCountry || '—',
                program: raw.programType || '—',
                visa: raw.visa_status || 'not_started',
              };
              const isSelected = selectedVisaStudent === c.name;
              return (
                <div
                  key={raw.id || idx}
                  onClick={() => setSelectedVisaStudent(c.name)}
                  style={{
                    background: isSelected ? 'var(--bg3)' : 'var(--card)',
                    border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 13, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>
                      {c.name}
                    </strong>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                      {c.program} · Target: {c.country}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      background:
                        c.visa === 'approved' || c.visa === 'Approved'
                          ? 'rgba(var(--success-rgb), 0.08)'
                          : 'rgba(var(--warning-rgb), 0.08)',
                      color: c.visa === 'approved' || c.visa === 'Approved' ? 'var(--success)' : 'var(--amber)',
                      padding: '3px 8px',
                      borderRadius: 20,
                      fontWeight: 800,
                    }}
                  >
                    {c.visa}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Onboard new candidate */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
            Onboard New Candidate
          </h4>
          <form onSubmit={addStudent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              value={studentForm.displayName}
              onChange={(e) => setStudentForm((x) => ({ ...x, displayName: e.target.value }))}
              className="form-input"
              style={{ fontSize: 12, padding: '6px 10px' }}
              placeholder="Full name *"
              required
            />
            <input
              value={studentForm.email}
              onChange={(e) => setStudentForm((x) => ({ ...x, email: e.target.value }))}
              className="form-input"
              style={{ fontSize: 12, padding: '6px 10px' }}
              placeholder="Email address"
            />
            <input
              value={studentForm.phone}
              onChange={(e) => setStudentForm((x) => ({ ...x, phone: e.target.value }))}
              className="form-input"
              style={{ fontSize: 12, padding: '6px 10px' }}
              placeholder="Phone number"
            />
            <input
              value={studentForm.targetCountry}
              onChange={(e) => setStudentForm((x) => ({ ...x, targetCountry: e.target.value }))}
              className="form-input"
              style={{ fontSize: 12, padding: '6px 10px' }}
              placeholder="Target Country (USA, Germany...)"
            />
            <input
              value={studentForm.programType}
              onChange={(e) => setStudentForm((x) => ({ ...x, programType: e.target.value }))}
              className="form-input"
              style={{ fontSize: 12, padding: '6px 10px' }}
              placeholder="Program Type (MS, MBA...)"
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '8px 0', fontSize: 12 }}
            >
              + Add Candidate Profile
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: AI Visa Advisor & Country Intelligence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
          {[
            { id: 'visa', label: '🌍 AI Visa Advisor' },
            { id: 'country', label: '🗺️ Country Intelligence' },
          ].map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => setStudyAbroadSubTab(subTab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11.5,
                fontWeight: studyAbroadSubTab === subTab.id ? 800 : 600,
                background: studyAbroadSubTab === subTab.id ? 'rgba(var(--brand-rgb), 0.08)' : 'transparent',
                color: studyAbroadSubTab === subTab.id ? 'var(--accent)' : 'var(--t3)',
                transition: 'all 0.15s',
              }}
            >
              {subTab.label}
            </button>
          ))}
        </div>

        {studyAbroadSubTab === 'visa' && (
          <div
            style={{
              padding: 28,
              textAlign: 'center',
              color: 'var(--t3)',
              fontSize: 13,
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
            className="fade-in"
          >
            {allStudents.length === 0
              ? 'No pipeline-linked data'
              : selectedVisaStudent
              ? `Displaying Visa Dossier details for ${selectedVisaStudent}`
              : 'Select a candidate to view visa dossier status.'}
          </div>
        )}

        {studyAbroadSubTab === 'country' && (
          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
            className="fade-in"
          >
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>
                🗺️ Country Intelligence Comparer
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--t3)' }}>
                Compare study abroad destinations across PR ease, visa difficulty, and costs.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="form-label" style={{ fontSize: 10.5 }}>
                  Country A
                </label>
                <select
                  value={countryCompA}
                  onChange={(e) => setCountryCompA(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: 12, padding: '6px 10px' }}
                >
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="USA">USA</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: 10.5 }}>
                  Country B
                </label>
                <select
                  value={countryCompB}
                  onChange={(e) => setCountryCompB(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: 12, padding: '6px 10px' }}
                >
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="USA">USA</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
            </div>

            {/* Side-by-side comparison table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                background: 'var(--card)',
                padding: 14,
                borderRadius: 12,
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
                  {countryCompA}
                </h5>
                <div style={{ fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>PR Pathway: </span>
                    <strong>{dataA.prEase}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Post-Study Work: </span>
                    <strong>{dataA.postStudyWork}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Visa Approval: </span>
                    <strong style={{ color: 'var(--success)' }}>{dataA.visaRate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Tuition: </span>
                    <strong>{dataA.avgTuition}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Living: </span>
                    <strong>{dataA.livingCost}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 800, color: 'var(--teal)' }}>
                  {countryCompB}
                </h5>
                <div style={{ fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>PR Pathway: </span>
                    <strong>{dataB.prEase}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Post-Study Work: </span>
                    <strong>{dataB.postStudyWork}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Visa Approval: </span>
                    <strong style={{ color: 'var(--success)' }}>{dataB.visaRate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Tuition: </span>
                    <strong>{dataB.avgTuition}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--t3)' }}>Living: </span>
                    <strong>{dataB.livingCost}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
