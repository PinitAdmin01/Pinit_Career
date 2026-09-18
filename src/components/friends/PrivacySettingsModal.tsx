'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/lib/store/useAppStore';

interface BlockedUser {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  blockedAt: string;
}

interface PrivacySettings {
  whoCanSendRequests: string;
  profileVisibility: string;
  showOnlineBeacon: boolean;
  showInSuggestions: boolean;
}

interface PrivacySettingsModalProps {
  onClose: () => void;
  onBlockListChange?: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  onClose,
  onBlockListChange
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'blocked'>('privacy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    whoCanSendRequests: 'everyone',
    profileVisibility: 'public',
    showOnlineBeacon: true,
    showInSuggestions: true
  });
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/friends/privacy');
      const data = await res.json();
      if (data.ok) {
        if (data.settings) setSettings(data.settings);
        if (data.blockedUsers) setBlockedUsers(data.blockedUsers);
      }
    } catch (err) {
      console.error('Failed to load privacy settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/friends/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Privacy Settings Updated', 'Your campus networking preferences are active.');
        onClose();
      } else {
        toast.error('Update Failed', data.error || 'Could not save settings.');
      }
    } catch (err) {
      toast.error('Network Error', 'Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (studentId: string, studentName: string) => {
    try {
      const res = await fetch('/api/friends/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock', studentId, studentName })
      });
      const data = await res.json();
      if (data.ok) {
        toast.info('Student Unblocked', `${studentName} has been unblocked.`);
        setBlockedUsers(prev => prev.filter(b => b.studentId !== studentId));
        onBlockListChange?.();
      }
    } catch (err) {
      toast.error('Error', 'Failed to unblock student');
    }
  };

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🛡️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, color: '#ffffff' }}>Safety & Privacy Center</h3>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Control who can discover and reach you</span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          padding: '12px 24px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: 16
        }}>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              background: 'none',
              border: 'none',
              paddingBottom: 10,
              fontSize: 13,
              fontWeight: 700,
              color: activeTab === 'privacy' ? '#c084fc' : '#94a3b8',
              borderBottom: activeTab === 'privacy' ? '2px solid #a855f7' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            ⚙️ Networking Privacy
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            style={{
              background: 'none',
              border: 'none',
              paddingBottom: 10,
              fontSize: 13,
              fontWeight: 700,
              color: activeTab === 'blocked' ? '#f87171' : '#94a3b8',
              borderBottom: activeTab === 'blocked' ? '2px solid #ef4444' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🚫 Blocked Accounts
            {blockedUsers.length > 0 && (
              <span style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: 10.5
              }}>
                {blockedUsers.length}
              </span>
            )}
          </button>
        </div>

        <div className="modal-body" style={{ gap: 16 }}>
          {activeTab === 'privacy' ? (
            <>
              {/* Setting 1: Who can send requests */}
              <div className="modal-form-group">
                <label className="modal-form-label">Who can send you friend requests</label>
                <select
                  className="modal-select-input"
                  value={settings.whoCanSendRequests}
                  onChange={(e) => setSettings({ ...settings, whoCanSendRequests: e.target.value })}
                >
                  <option value="everyone">Everyone on PinIT Campus</option>
                  <option value="campus_only">Students from my College Only</option>
                  <option value="nobody">Nobody (Private Incognito)</option>
                </select>
              </div>

              {/* Setting 2: Profile Visibility */}
              <div className="modal-form-group">
                <label className="modal-form-label">Profile & Portfolio Visibility</label>
                <select
                  className="modal-select-input"
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                >
                  <option value="public">Public (All verified students & recruiters)</option>
                  <option value="friends_only">Friends Only (Only accepted connections)</option>
                  <option value="private">Hidden (Only me)</option>
                </select>
              </div>

              {/* Setting 3: Online Beacon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>Show Active Status Beacon</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Display green indicator when you are online on campus</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showOnlineBeacon}
                  onChange={(e) => setSettings({ ...settings, showOnlineBeacon: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>

              {/* Setting 4: Discover Feed */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(30, 41, 59, 0.4)',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>Suggest Me to Other Students</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Appear in "Suggested for you" algorithms based on common skills</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showInSuggestions}
                  onChange={(e) => setSettings({ ...settings, showInSuggestions: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#818cf8', cursor: 'pointer' }}
                />
              </div>
            </>
          ) : (
            <div>
              {blockedUsers.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 12
                }}>
                  <span style={{ fontSize: 32, opacity: 0.6 }}>🛡️</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginTop: 10 }}>No Blocked Students</div>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
                    Students you block cannot send you messages, invitations, or see your activity.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {blockedUsers.map((b) => (
                    <div
                      key={b.studentId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 10
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {b.studentAvatar && (
                          <img src={b.studentAvatar} alt={b.studentName} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{b.studentName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>Blocked on {new Date(b.blockedAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <button
                        className="friends-btn friends-btn-secondary"
                        style={{ fontSize: 11.5, padding: '5px 12px' }}
                        onClick={() => handleUnblock(b.studentId, b.studentName)}
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="friends-btn friends-btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          {activeTab === 'privacy' && (
            <button
              type="button"
              className="friends-btn friends-btn-primary"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};