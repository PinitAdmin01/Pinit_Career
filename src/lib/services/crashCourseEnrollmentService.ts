/**
 * Crash Course Enrollment client service.
 *
 * Enrollments are created only by the server, at the moment payment is confirmed
 * (POST /api/quests/enrollment for Pins, /api/payment/verify for cards). This client
 * reads them and keeps an offline cache; it never creates or pays for one itself.
 */
import { api } from '@/lib/api/client';

export interface CrashCourseEnrollment {
  enrollmentId: string;
  userId: string;
  planId: string;
  track: 'web_fullstack' | 'python_ai';
  amountPaid: number;
  paymentId: string;
  orderId?: string;
  paymentMethod: 'razorpay' | 'pins' | 'sandbox';
  status: 'active' | 'completed' | 'paused';
  enrolledAt: string;
  currentSprint: number; // 1, 2, 3, or 4
  dailyLearningHoursTarget: number; // default 1
  rewardPinsCredited?: number;
  pinsDeducted?: number;
  milestoneProgress: {
    sprint1Approved: boolean;
    sprint2Approved: boolean;
    sprint3RepoUrl?: string;
    sprint3LiveUrl?: string;
    sprint4DefenseScore?: number;
  };
  certificatesIssued: {
    projectCertHash?: string;
    internshipCertHash?: string;
    issuedAt?: string;
  };
}

const STORAGE_KEY = 'pinit_active_crash_enrollment';

function readCache(): CrashCourseEnrollment | null {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return parsed && parsed.status === 'active' ? (parsed as CrashCourseEnrollment) : null;
  } catch {
    return null;
  }
}

export const crashCourseEnrollmentService = {
  /**
   * Active enrollment for the signed-in student. The server is authoritative; the
   * local cache is used only when the server can't be reached (offline).
   */
  async getActiveEnrollment(): Promise<CrashCourseEnrollment | null> {
    try {
      const data = await api.get<{ ok: boolean; enrollment: CrashCourseEnrollment | null }>('/api/quests/enrollment');
      const enrollment = data?.enrollment ?? null;
      if (enrollment) {
        crashCourseEnrollmentService.cacheEnrollment(enrollment);
      } else {
        crashCourseEnrollmentService.clearEnrollment();
      }
      return enrollment;
    } catch (err) {
      console.warn('[crashCourseEnrollmentService] Error fetching enrollment, using offline cache:', err);
      return readCache();
    }
  },

  /** Cache an enrollment the server already created (no network call, no charge). */
  cacheEnrollment(enrollment: CrashCourseEnrollment): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollment));
      }
    } catch {}
  },

  /**
   * Update sprint or milestone progress
   */
  async updateSprintMilestone(
    enrollmentId: string,
    updates: Partial<CrashCourseEnrollment['milestoneProgress']>
  ): Promise<boolean> {
    try {
      const cached = readCache();
      if (cached) {
        cached.milestoneProgress = { ...cached.milestoneProgress, ...updates };
        crashCourseEnrollmentService.cacheEnrollment(cached);
      }
      await api.patch('/api/quests/enrollment', { enrollmentId, milestoneProgress: updates });
      return true;
    } catch (err) {
      console.warn('[crashCourseEnrollmentService] Error updating milestone:', err);
      return false;
    }
  },

  /**
   * Clear active enrollment from client cache
   */
  clearEnrollment(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }
};
