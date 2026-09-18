/**
 * Crash Course Enrollment & Persistence Service
 * Supports Supabase with fallback to local JSON database and client localStorage cache.
 */

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

export const crashCourseEnrollmentService = {
  /**
   * Fetch active enrollment for the student (via API or localStorage fallback)
   */
  async getActiveEnrollment(userId?: string): Promise<CrashCourseEnrollment | null> {
    try {
      if (typeof window !== 'undefined') {
        const localCached = localStorage.getItem(STORAGE_KEY);
        if (localCached) {
          try {
            const parsed = JSON.parse(localCached);
            if (parsed && parsed.status === 'active') {
              return parsed as CrashCourseEnrollment;
            }
          } catch {
            // ignore invalid cache
          }
        }
      }

      const res = await fetch('/api/quests/enrollment', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.enrollment) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.enrollment));
          }
          return data.enrollment as CrashCourseEnrollment;
        }
      }
    } catch (err) {
      console.warn('[crashCourseEnrollmentService] Error fetching enrollment:', err);
    }
    return null;
  },

  /**
   * Persist a new verified enrollment
   */
  async saveEnrollment(enrollment: CrashCourseEnrollment): Promise<boolean> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollment));
      }

      const res = await fetch('/api/quests/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment),
      });

      return res.ok;
    } catch (err) {
      console.warn('[crashCourseEnrollmentService] Error saving enrollment:', err);
      return false;
    }
  },

  /**
   * Update sprint or milestone progress
   */
  async updateSprintMilestone(
    enrollmentId: string,
    updates: Partial<CrashCourseEnrollment['milestoneProgress']>
  ): Promise<boolean> {
    try {
      if (typeof window !== 'undefined') {
        const localCached = localStorage.getItem(STORAGE_KEY);
        if (localCached) {
          const parsed = JSON.parse(localCached) as CrashCourseEnrollment;
          parsed.milestoneProgress = { ...parsed.milestoneProgress, ...updates };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      }

      const res = await fetch('/api/quests/enrollment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, milestoneProgress: updates }),
      });

      return res.ok;
    } catch (err) {
      console.warn('[crashCourseEnrollmentService] Error updating milestone:', err);
      return false;
    }
  }
};
