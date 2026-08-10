/**
 * PinIT Identity Gateway Client SDK (v1 API)
 * Routes through the client API layer (firestoreRouter) via dynamic import
 * to avoid pulling the full API client into the critical path at module load.
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

async function getApi() {
  const mod = await import('@/lib/api/client');
  return mod.api;
}

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

  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
  }
  return 'fp_' + Math.abs(hash).toString(36);
}

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
  async generateLoginChallenge(app = 'careers', purpose = 'login'): Promise<VaultChallenge> {
    try {
      const api = await getApi();
      return await api.post<VaultChallenge>('/api/v1/auth/vault-challenge', {
        app,
        purpose,
        identityVersion: 1,
      });
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to generate authentication challenge');
    }
  },

  subscribeStatusStream(challengeId: string, onStatus: (status: ChallengeStatus) => void): () => void {
    let intervalId: any = null;
    let isActive = true;

    const checkStatus = async () => {
      if (!isActive) return;
      try {
        const api = await getApi();
        const data = await api.get<{ status?: ChallengeStatus }>(
          `/api/v1/auth/vault-stream?challengeId=${encodeURIComponent(challengeId)}`
        );
        if (data.status) onStatus(data.status as ChallengeStatus);
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

  async exchangeSession(challengeId: string, method: AuthenticationMethod = AuthenticationMethod.QR_SCAN): Promise<{
    user: any;
    token: string;
    isFirstLogin: boolean;
    trustedDevice: TrustedDevice;
  }> {
    const api = await getApi();
    return api.post('/api/v1/auth/exchange-session', {
      challengeId,
      fingerprintHash: getRiskDetectionFingerprint(),
      deviceName: getDeviceName(),
      method,
      app: 'careers',
    });
  },

  async approveChallengeFromVault(challengeId: string, userPayload?: any): Promise<boolean> {
    try {
      const api = await getApi();
      let sig = '';
      if (typeof window !== 'undefined') {
        try {
          const challenges = JSON.parse(localStorage.getItem('pinit_auth_challenges_db') || '{}');
          sig = challenges?.[challengeId]?.sig || '';
        } catch { /* ignore */ }
      }
      const res = await api.post<{ success?: boolean }>('/api/v1/auth/vault-approve', {
        challengeId,
        sig,
        userPayload,
      });
      return res?.success !== false;
    } catch {
      return false;
    }
  },

  async logoutAllDevices(userId: string): Promise<boolean> {
    try {
      const api = await getApi();
      await api.post('/api/v1/auth/logout-all', { userId });
      return true;
    } catch {
      return false;
    }
  },

  async listDevices(userId: string): Promise<TrustedDevice[]> {
    try {
      const api = await getApi();
      const data = await api.get<{ devices?: TrustedDevice[] }>(
        `/api/v1/auth/devices?userId=${encodeURIComponent(userId)}`
      );
      return data.devices || [];
    } catch {
      return [];
    }
  }
};
