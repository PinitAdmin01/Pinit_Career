/**
 * PinIT Identity Gateway Client SDK (v1 API)
 * Central authentication gateway SDK for PinIT ecosystem.
 * Communicates with /api/v1/auth/* endpoints.
 */

export enum AuthenticationMethod {
  QR_SCAN = 'QR_SCAN',
  DEVICE_BIOMETRIC = 'DEVICE_BIOMETRIC',
  FACE_AUTH = 'FACE_AUTH',
  RECOVERY = 'RECOVERY'
}

export type ChallengeStatus = 'PENDING' | 'SCANNING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CONSUMED';

export interface VaultChallenge {
  challengeId: string;
  app: string;
  purpose: string;
  identityVersion: number;
  nonce: string;
  exp: number;
  v: number;
  sig: string;
  expiresIn: number;
}

export interface TrustedDevice {
  id: string;
  name: string;
  trustLevel: 'VERIFIED' | 'TRUSTED' | 'RESTRICTED' | 'BLOCKED';
  lastUsedAt: string;
  location: string;
  browser: string;
  fingerprintHash: string;
}

export interface AuditRecord {
  id: string;
  userId: string;
  timestamp: string;
  deviceName: string;
  location: string;
  app: string;
  method: AuthenticationMethod;
  result: 'SUCCESS' | 'FAILED' | 'REJECTED';
  ip: string;
  fingerprintHash: string;
}

/**
 * Computes client risk detection fingerprint hash based on Browser, Screen, Timezone, Language, Platform
 */
export function getRiskDetectionFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr_node_environment';
  
  const nav = window.navigator;
  const screen = window.screen;
  
  const raw = [
    nav.userAgent || '',
    nav.language || '',
    screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.platform || '',
    nav.hardwareConcurrency || 0
  ].join('||');

  // Simple, fast client-side DJB2 hash representation for risk recognition
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
  }
  return 'fp_' + Math.abs(hash).toString(36);
}

/**
 * Detects human-readable device name from User-Agent
 */
export function getDeviceName(): string {
  if (typeof window === 'undefined') return 'Server Node';
  const ua = window.navigator.userAgent;
  let os = 'Unknown OS';
  if (ua.includes('Win')) os = 'Windows PC';
  else if (ua.includes('Mac')) os = 'MacBook / macOS';
  else if (ua.includes('Android')) os = 'Android Device';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS Device';
  else if (ua.includes('Linux')) os = 'Linux PC';

  let browser = 'Browser';
  if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';

  return `${os} (${browser})`;
}

export const identityGateway = {
  /**
   * Request a new signed QR login challenge from Gateway
   */
  async generateLoginChallenge(app = 'careers', purpose = 'login'): Promise<VaultChallenge> {
    const res = await fetch('/api/v1/auth/vault-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app, purpose, identityVersion: 1 })
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to generate authentication challenge');
    }

    return res.json();
  },

  /**
   * Subscribe to status-only SSE stream for challenge state transitions
   */
  subscribeStatusStream(challengeId: string, onStatus: (status: ChallengeStatus) => void): () => void {
    let intervalId: any = null;
    let isActive = true;

    // Simulate Server-Sent Events (SSE) via 1-second status query
    const checkStatus = async () => {
      if (!isActive) return;
      try {
        const res = await fetch(`/api/v1/auth/vault-stream?challengeId=${encodeURIComponent(challengeId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status) {
            onStatus(data.status as ChallengeStatus);
          }
        }
      } catch (err) {
        console.warn('[IdentityGateway] Stream query warning:', err);
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 1200);

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
    };
  },

  /**
   * Exchange an APPROVED challenge for JWT session tokens and User Profile
   */
  async exchangeSession(challengeId: string, method: AuthenticationMethod = AuthenticationMethod.QR_SCAN): Promise<{
    user: any;
    token: string;
    isFirstLogin: boolean;
    trustedDevice: TrustedDevice;
  }> {
    const fingerprintHash = getRiskDetectionFingerprint();
    const deviceName = getDeviceName();

    const res = await fetch('/api/v1/auth/exchange-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challengeId,
        fingerprintHash,
        deviceName,
        method,
        app: 'careers'
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to exchange authentication session');
    }

    return res.json();
  },

  /**
   * Approve a challenge (Simulates Vault Mobile Application scanning & approving)
   */
  async approveChallengeFromVault(challengeId: string, userPayload?: any): Promise<boolean> {
    const res = await fetch('/api/v1/auth/vault-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, userPayload })
    });
    return res.ok;
  },

  /**
   * Revoke all active sessions & trusted devices across account
   */
  async logoutAllDevices(userId: string): Promise<boolean> {
    const res = await fetch('/api/v1/auth/logout-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.ok;
  },

  /**
   * Fetch trusted devices list for account
   */
  async listDevices(userId: string): Promise<TrustedDevice[]> {
    const res = await fetch(`/api/v1/auth/devices?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.devices || [];
  }
};
