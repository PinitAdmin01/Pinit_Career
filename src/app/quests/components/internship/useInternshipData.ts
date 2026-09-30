'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import type {
  ClientInternshipEnrollment,
  ClientInternshipTask,
} from '@/lib/internships/types';

export function useInternshipData(crashEnrollment: CrashCourseEnrollment | null) {
  const [loading, setLoading] = useState(true);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<ClientInternshipEnrollment | null>(null);
  const [tasks, setTasks] = useState<ClientInternshipTask[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [isExtending, setIsExtending] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isClaimingCert, setIsClaimingCert] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInternship = useCallback(async () => {
    if (!crashEnrollment?.enrollmentId) {
      setLoading(false);
      return;
    }
    try {
      setPanelError(null);
      const res = await fetch(
        `/api/internship?crashEnrollmentId=${encodeURIComponent(crashEnrollment.enrollmentId)}`
      );
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPanelError(data.message || 'Could not load your internship program.');
        return;
      }
      setEnrollment(data.enrollment || null);
      setTasks(data.tasks || []);
    } catch (err) {
      setPanelError(err instanceof Error ? err.message : 'Network error loading internship.');
    } finally {
      setLoading(false);
    }
  }, [crashEnrollment?.enrollmentId]);

  useEffect(() => {
    fetchInternship();
  }, [fetchInternship]);

  useEffect(() => {
    if (enrollment?.status === 'generating') {
      pollTimerRef.current = setInterval(() => {
        fetchInternship();
      }, 4000);
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [enrollment?.status, fetchInternship]);

  const startSimulation = async () => {
    if (!crashEnrollment?.enrollmentId) return;
    setIsStarting(true);
    setStartError(null);
    try {
      const res = await fetch('/api/internship/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: crashEnrollment.enrollmentId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStartError(data.message || 'Failed to start internship simulation.');
        return;
      }
      setEnrollment(data.enrollment);
      setTasks(data.tasks || []);
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'Network error starting simulation.');
    } finally {
      setIsStarting(false);
    }
  };

  const extendDeadline = async () => {
    if (!enrollment?.id) return;
    setIsExtending(true);
    try {
      const res = await fetch('/api/internship/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipEnrollmentId: enrollment.id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await fetchInternship();
      } else {
        alert(data.message || 'Could not extend deadline.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error extending deadline.');
    } finally {
      setIsExtending(false);
    }
  };

  const restartSimulation = async () => {
    if (!enrollment?.id) return;
    setIsRestarting(true);
    try {
      const res = await fetch('/api/internship/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipEnrollmentId: enrollment.id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setEnrollment(data.enrollment);
        setTasks(data.tasks || []);
      } else {
        alert(data.message || 'Could not restart simulation.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error restarting simulation.');
    } finally {
      setIsRestarting(false);
    }
  };

  const claimCertificate = async (onSuccess?: (certId: string) => void) => {
    if (!enrollment?.id) return;
    setIsClaimingCert(true);
    try {
      const res = await fetch('/api/internship/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipEnrollmentId: enrollment.id }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await fetchInternship();
        if (onSuccess && data.certificate?.id) {
          onSuccess(data.certificate.id);
        }
      } else {
        alert(data.message || 'Could not issue certificate.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error issuing certificate.');
    } finally {
      setIsClaimingCert(false);
    }
  };

  return {
    loading,
    panelError,
    enrollment,
    tasks,
    isStarting,
    startError,
    isExtending,
    isRestarting,
    isClaimingCert,
    startSimulation,
    extendDeadline,
    restartSimulation,
    claimCertificate,
  };
}
