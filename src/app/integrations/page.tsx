'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';

interface IntegrationSetting {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Error' | 'Disconnected';
  lastSynced: string;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive';
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
}

export default function IntegrationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [activeTab, setActiveTab] = useState<string>('University ERP');

  // Integrations state datasets
  const [erpConnectors, setErpConnectors] = useState<IntegrationSetting[]>([
    { id: 'erp1', name: 'SAP Student Lifecycle Management', type: 'ERP Connector', status: 'Connected', lastSynced: '4 minutes ago' },
    { id: 'erp2', name: 'Banner Student ERP API', type: 'ERP Connector', status: 'Disconnected', lastSynced: 'Never' }
  ]);

  const [lmsConnectors] = useState([
    { name: 'Canvas LMS Integration', status: 'Connected', version: 'v2.4 (LTI 1.3)', lastSynced: '12 minutes ago' },
    { name: 'Moodle Portal Gateway', status: 'Connected', version: 'v3.9 (REST)', lastSynced: '1 hour ago' }
  ]);

  const [biometrics] = useState([
    { name: 'Main Campus RFID Card Readers', status: 'Active', rate: '240 logs/min', deviceCount: 42 },
    { name: 'Block-A Biometric Fingerprint Syncer', status: 'Active', rate: '18 logs/min', deviceCount: 8 }
  ]);

  const [gateways] = useState([
    { name: 'Stripe Corporate Billing', mode: 'Preview', webhookStatus: 'Catalog only' },
    { name: 'Razorpay Campus Collect', mode: 'Preview', webhookStatus: 'Catalog only' }
  ]);

  const [recruiterPlatforms] = useState([
    { name: 'LinkedIn Talent Solutions Connect', status: 'Connected', syncInterval: 'Daily' },
    { name: 'Handshake Recruiter Matcher', status: 'Connected', syncInterval: 'Realtime' }
  ]);

  const [emailSms] = useState([
    { name: 'SendGrid Email SMTP Relay', status: 'Connected', quota: '98,000 / 100,000' },
    { name: 'Twilio Campus SMS Gateway', status: 'Connected', quota: 'Unlimited (Enterprise)' }
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: 'wh1', url: 'https://api.stripe.com/v1/webhooks/pinit', events: ['student.graduated', 'achievement.verified'], status: 'Active' },
    { id: 'wh2', url: 'https://university-erp.edu/hooks', events: ['attendance.updated'], status: 'Active' }
  ]);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'key1', name: 'LMS Sync Daemon Key', prefix: 'pk_preview_51P...', created: 'Jul 12, 2026' },
    { id: 'key2', name: 'Biometric Gate Gateway Token', prefix: 'pk_preview_90A...', created: 'Jun 18, 2026' }
  ]);

  const [syncLogs, setSyncLogs] = useState([
    { id: 'log1', timestamp: '17:50:02', source: 'Biometric Gateway', event: 'Synced 1,240 clock attendance rows.', status: 'Success' },
    { id: 'log2', timestamp: '17:45:12', source: 'Canvas LMS', event: 'Imported 12 student course grades.', status: 'Success' },
    { id: 'log3', timestamp: '17:30:00', source: 'SAP SLM ERP', event: 'Failed handshakes: Connection timed out.', status: 'Warning' }
  ]);

  const runSync = (connectorId: string) => {
    setErpConnectors(erpConnectors.map(c => c.id === connectorId ? { ...c, lastSynced: 'Just now' } : c));
    setSyncLogs([
      { id: `log_${Date.now()}`, timestamp: 'Just now', source: 'Manual Trigger', event: 'Initiated SAP SLM sync pipeline successfully.', status: 'Success' },
      ...syncLogs
    ]);
    toast.success('Sync Triggered', 'Manual sync sequence initiated. Synchronization logs updated.');
  };

  const createApiKey = () => {
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: 'Dynamic Ad-hoc Token',
      prefix: `pk_preview_${Math.random().toString(36).substring(2, 8).toUpperCase()}...`,
      created: 'Today'
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('API Key Generated', 'Store this credential securely. It will not be shown again.');
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* 🧑‍🎓 PORTAL: ACCESS DENIED SHIELD */}
      {/* ──────────────────────────────────────────────────────── */}
      {!isAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
          <span style={{ fontSize: 64 }}>🔒</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--coral)', margin: 0 }}>
            Enterprise Security: Administrator Shield Active
          </h2>
          <p style={{ color: 'var(--t3)', fontSize: 13, maxWidth: 450, lineHeight: 1.5, margin: 0 }}>
            Institutional ERP system connections, biometric endpoints, and SMTP server structures are restricted from student access. Contact campus IT.
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* ⚙ PORTAL: ADMIN WORKSPACE */}
      {/* ──────────────────────────────────────────────────────── */}
      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ gridColumn: '1 / -1', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(245, 158, 11, 0.08)', color: 'var(--amber)', fontSize: 12, fontWeight: 700 }}>
            Preview connectors — these ERP, LMS, and payment rows are a local catalog, not live campus links.
          </div>
          
          {/* Vertical Navigation Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg2)', padding: 8, borderRadius: 14, border: '1px solid var(--border)' }}>
            {[
              'University ERP', 'LMS', 'Biometric Devices', 'Payment Gateways', 
              'Recruiter Platforms', 'Email & SMS', 'Webhooks', 'API Keys', 'Synchronization Logs'
            ].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 8,
                  background: activeTab === t ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === t ? 'var(--accent)' : 'var(--t2)',
                  fontSize: 12.5,
                  fontWeight: activeTab === t ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Active Tab Screen */}
          <div style={card}>
            
            {/* UNIVERSITY ERP TAB */}
            {activeTab === 'University ERP' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>University ERP Connectors</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Integrate student profiles, admission records, and fee payment indexes.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {erpConnectors.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{c.name}</h4>
                        <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>Last Sync: {c.lastSynced}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: c.status === 'Connected' ? 'var(--green)' : 'var(--coral)' }}>{c.status}</span>
                        {c.status === 'Connected' && (
                          <button onClick={() => runSync(c.id)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                            Sync Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LMS TAB */}
            {activeTab === 'LMS' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>Learning Management Systems</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Canvas, Moodle, and Blackboard connections populate student GPA and course completion logs.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {lmsConnectors.map(l => (
                    <div key={l.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{l.name}</span>
                        <span style={{ fontSize: 11, background: 'var(--green-light)', color: 'var(--green)', padding: '2px 6px', borderRadius: 4 }}>{l.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--t3)' }}>
                        <span>LTI Version: {l.version}</span>
                        <span>Synced {l.lastSynced}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BIOMETRIC DEVICES TAB */}
            {activeTab === 'Biometric Devices' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>Campus Attendance hardware</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Biometric card-readers feed daily classroom attendance metrics.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {biometrics.map(b => (
                    <div key={b.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>{b.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--t3)' }}>
                        <span>Rate: {b.rate}</span>
                        <span>Device Count: {b.deviceCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENT GATEWAYS TAB */}
            {activeTab === 'Payment Gateways' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>Student Fee Pay Gateways</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Automate academic invoices and receipt clearing.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {gateways.map(g => (
                    <div key={g.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{g.name}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--green)', fontWeight: 800 }}>{g.webhookStatus}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>Gateway Mode: {g.mode}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECRUITER PLATFORMS TAB */}
            {activeTab === 'Recruiter Platforms' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>SDE Recruiters Integration</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Forward student portfolio packages directly to target employers.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recruiterPlatforms.map(r => (
                    <div key={r.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>Connected</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>Sync Interval: {r.syncInterval}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMAIL & SMS TAB */}
            {activeTab === 'Email & SMS' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>Broadcast notification Gateways</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>SendGrid SMTP and Twilio SMS configuration endpoints.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {emailSms.map(e => (
                    <div key={e.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{e.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>Connected</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>API Quota: {e.quota}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WEBHOOKS TAB */}
            {activeTab === 'Webhooks' && (
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 800 }}>Enterprise Outgoing Webhooks</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 14 }}>Subscribe endpoints to live student activity events.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {webhooks.map(wh => (
                    <div key={wh.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 800 }}>{wh.url}</span>
                        <span style={{ fontSize: 11, background: 'var(--green-light)', color: 'var(--green)', padding: '2px 6px', borderRadius: 4 }}>{wh.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                        {wh.events.map(ev => (
                          <span key={ev} style={{ fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: 'var(--bg2)', color: 'var(--t3)' }}>{ev}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API KEYS TAB */}
            {activeTab === 'API Keys' && (
              <div>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Gateway Keys</h3>
                    <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: 0 }}>API tokens for institutional sync daemons.</p>
                  </div>
                  <button onClick={createApiKey} style={{ padding: '8px 16px', fontSize: 11.5, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                    Generate Key
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {apiKeys.map(k => (
                    <div key={k.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{k.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{k.prefix}</div>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>Created: {k.created}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SYNCHRONIZATION LOGS TAB */}
            {activeTab === 'Synchronization Logs' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>API Sync Audit Trail</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg3)' }}>
                      {['Time', 'Connector Module', 'Sync Event Description', 'Sync Outcome'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {syncLogs.map((log, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>{log.timestamp}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{log.source}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--t2)' }}>{log.event}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 700,
                            background: log.status === 'Success' ? 'var(--green-light)' : 'var(--amber-light)',
                            color: log.status === 'Success' ? 'var(--green)' : 'var(--amber)'
                          }}>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

const card: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-sm)'
};
const cardLabel: React.CSSProperties = {
  fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase',
  color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600,
  marginBottom: 14, display: 'block'
};
