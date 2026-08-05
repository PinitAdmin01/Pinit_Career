'use client';
// src/app/notifications/page.tsx
// Campus Communication Hub containing announcement boards, notifications feed, simulated email readboxes, simulated phone SMS messages, and push notification triggers.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { useNotifications, useMarkRead } from '@/lib/api/hooks';

type CommTab = 'announcements' | 'notifications' | 'emails' | 'sms' | 'tester';

interface Notif {
  id: string;
  title: string;
  message: string;
  type: string;
  source: string;
  is_read: boolean;
  created_at: string;
  action_url: string | null;
}

const TYPE_META: Record<string, { icon: string; color: string; bg: string }> = {
  success: { icon: '✓', color: '#10b981', bg: '#eff6ff' },
  warning: { icon: '⚠', color: '#f59e0b', bg: '#fef3c7' },
  danger: { icon: '✗', color: '#ef4444', bg: '#fee2e2' },
  info: { icon: '◎', color: '#3b82f6', bg: '#dbeafe' },
};

export default function CampusCommunicationHub() {
  const [activeTab, setActiveTab] = useState<CommTab>('announcements');
  const { data: notifData, isLoading: loadingNotifs } = useNotifications();
  const markReadMutation = useMarkRead();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [smsList, setSmsList] = useState<any[]>([]);

  // Selected email for reader drawer
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Push notification simulator state
  const [pushTitle, setPushTitle] = useState('New Job Referral Match');
  const [pushMsg, setPushMsg] = useState('Rahul Varma has approved your referral request for NVIDIA.');
  const [activePush, setActivePush] = useState<any>(null);

  useEffect(() => {
    fetchCommData();
  }, []);

  const fetchCommData = async () => {
    try {
      const data = await api.get<any>('/api/communication/all');
      setAnnouncements(data.announcements || []);
      setEmails(data.emails || []);
      setSmsList(data.sms || []);
      if (data.emails && data.emails.length > 0) {
        setSelectedEmail(data.emails[0]);
      }
    } catch {}
  };

  const triggerTestPush = (e: React.FormEvent) => {
    e.preventDefault();
    const newPush = {
      title: pushTitle,
      message: pushMsg,
      timestamp: new Date().toLocaleTimeString()
    };
    setActivePush(newPush);
    setTimeout(() => {
      setActivePush(null);
    }, 4500);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-read', {});
      alert('All notifications marked as read ✓');
      // Refresh hooks logic
      window.location.reload();
    } catch {}
  };

  const systemNotifs: Notif[] = Array.isArray(notifData) ? notifData : (notifData as any)?.notifications || [];
  const unreadCount = systemNotifs.filter(n => !n.is_read).length;

  const cssStyle = `
    .comm-wrapper {
      max-width: 1040px;
      margin: 0 auto;
    }
    .page-title {
      font-family: var(--font-display), sans-serif;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.6px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tab-bar {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #cbd5e1;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 700;
      color: #64748b;
      border: none;
      background: none;
      cursor: pointer;
      border-bottom: 3.5px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tab-btn.active {
      color: #0f172a;
      border-bottom-color: #0f172a;
    }
    .badge-count {
      background: #ef4444;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 1.5px 5px;
      border-radius: 10px;
    }
    .card-box {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.05);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
    }
    .announcement-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
      background: #ffffff;
      margin-bottom: 14px;
      transition: all 0.2s ease;
    }
    .announcement-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
    }
    .email-inbox-grid {
      display: grid;
      grid-template-columns: 1.2fr 1.8fr;
      gap: 20px;
      min-height: 400px;
    }
    .email-item {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .email-item:hover {
      background: #f8fafc;
    }
    .email-item.selected {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
    }
    .phone-screen {
      width: 320px;
      height: 560px;
      border: 12px solid #1e293b;
      border-radius: 36px;
      background: #0f172a;
      margin: 0 auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .phone-header {
      height: 24px;
      background: #1e293b;
      color: #94a3b8;
      font-size: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
    }
    .phone-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f1f5f9;
    }
    .sms-bubble {
      background: #ffffff;
      color: #0f172a;
      border-radius: 14px;
      padding: 10px 14px;
      font-size: 12px;
      max-width: 85%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      align-self: flex-start;
      border-bottom-left-radius: 2px;
    }
    .sms-time {
      font-size: 9px;
      color: #94a3b8;
      margin-top: 4px;
      text-align: right;
    }
    .sms-sender {
      font-weight: 700;
      font-size: 10px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .push-banner-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 340px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px;
      color: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: push-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes push-slide-in {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '30px 20px', fontFamily: 'var(--font-body), sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: cssStyle }} />

      {/* Push Notification Overlay Simulator */}
      {activePush && (
        <div className="push-banner-overlay">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#3b82f6', letterSpacing: 0.4 }}>📲 Push Notification Alert</span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{activePush.timestamp}</span>
          </div>
          <strong style={{ display: 'block', fontSize: 13 }}>{activePush.title}</strong>
          <p style={{ fontSize: 12, color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: 1.4 }}>{activePush.message}</p>
        </div>
      )}

      <div className="comm-wrapper">
        <h1 className="page-title">📢 Campus Communication Hub</h1>

        {/* Tab Selection */}
        <div className="tab-bar">
          {[
            { id: 'announcements', label: 'Announcement Board' },
            { id: 'notifications', label: 'System Alerts', count: unreadCount },
            { id: 'emails', label: 'Email Box' },
            { id: 'sms', label: 'SMS Feed' },
            { id: 'tester', label: 'Push Notifications' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CommTab)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="badge-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* TAB: ANNOUNCEMENT BOARD */}
        {activeTab === 'announcements' && (
          <div className="card-box">
            <h3 className="card-title">📣 Campus Announcement Bulletins</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {announcements.map(a => (
                <div key={a.id} className="announcement-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                      background: a.category === 'Academics' ? '#eff6ff' : '#f1f5f9',
                      color: a.category === 'Academics' ? '#2563eb' : '#475569'
                    }}>{a.category}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>📅 Date: {a.date}</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: 15, fontWeight: 800 }}>{a.title}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SYSTEM ALERTS */}
        {activeTab === 'notifications' && (
          <div className="card-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 className="card-title" style={{ margin: 0 }}>🔔 Individual System Alerts</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="btn-ghost btn-sm">
                  ✓ Mark All Read
                </button>
              )}
            </div>

            {loadingNotifs ? (
              <div>Loading alert log...</div>
            ) : systemNotifs.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
                All caught up! No notifications yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {systemNotifs.map(n => {
                  const meta = TYPE_META[n.type] || TYPE_META.info;
                  return (
                    <div
                      key={n.id}
                      style={{
                        padding: 14, borderRadius: 12, border: '1px solid #e2e8f0',
                        background: n.is_read ? '#f8fafc' : '#ffffff',
                        display: 'flex', gap: 14, alignItems: 'flex-start',
                        opacity: n.is_read ? 0.75 : 1
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: meta.bg, color: meta.color, fontSize: 14, fontWeight: 900
                      }}>
                        {meta.icon}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: 13.5 }}>{n.title}</strong>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.source}</span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: '#475569' }}>{n.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: EMAIL BOX */}
        {activeTab === 'emails' && (
          <div className="card-box email-inbox-grid">
            {/* Left lists */}
            <div style={{ borderRight: '1px solid #e2e8f0', overflowY: 'auto', maxHeight: 420 }}>
              {emails.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>No emails.</div>
              ) : (
                emails.map(e => (
                  <div
                    key={e.id}
                    className={`email-item ${selectedEmail?.id === e.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEmail(e)}
                  >
                    <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>{e.sender}</div>
                    <strong style={{ display: 'block', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.subject}</strong>
                    <span style={{ fontSize: 9.5, color: '#94a3b8' }}>{e.date}</span>
                  </div>
                ))
              )}
            </div>

            {/* Right Reader */}
            <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column' }}>
              {selectedEmail ? (
                <div>
                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 14 }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 800 }}>{selectedEmail.subject}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                      <span>From: <strong>{selectedEmail.sender}</strong></span>
                      <span>{selectedEmail.date}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {selectedEmail.body}
                  </p>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13 }}>
                  Select an email to read its contents.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SMS FEED */}
        {activeTab === 'sms' && (
          <div className="card-box">
            <h3 className="card-title" style={{ textAlign: 'center', marginBottom: 18 }}>📱 Mock mobile Phone SMS Screen</h3>
            <div className="phone-screen">
              <div className="phone-header">
                <span>CAMPUS-OS NETWORK</span>
                <span>10:42 AM</span>
              </div>
              <div className="phone-body">
                {smsList.map(s => (
                  <div key={s.id} className="sms-bubble">
                    <div className="sms-sender">{s.sender}</div>
                    <div>{s.text}</div>
                    <div className="sms-time">{s.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PUSH NOTIFICATIONS TESTER */}
        {activeTab === 'tester' && (
          <div className="card-box" style={{ maxWidth: 540, margin: '0 auto' }}>
            <h3 className="card-title">📲 Push Notification Simulator Sandbox</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>
              Configure a mock alert context and trigger a real-time toaster overlay to preview client-side push notification prompts.
            </p>

            <form onSubmit={triggerTestPush} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Alert Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={pushTitle}
                  onChange={e => setPushTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Alert Message Context *</label>
                <textarea
                  required
                  className="form-input"
                  style={{ minHeight: 80, resize: 'vertical' }}
                  value={pushMsg}
                  onChange={e => setPushMsg(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 6, background: '#2563eb' }}>
                ⚡ Trigger Live Push Alert Overlay
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
