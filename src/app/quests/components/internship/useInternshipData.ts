'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';
import type {
  ClientInternshipEnrollment,
  ClientInternshipTask,
  ClientInternshipTeam,
  ClientInternshipTeamMember,
  ClientInternshipSprint,
} from '@/lib/internships/types';

export function useInternshipData(crashEnrollment: CrashCourseEnrollment | null) {
  const [loading, setLoading] = useState(true);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<ClientInternshipEnrollment | null>(null);
  const [tasks, setTasks] = useState<ClientInternshipTask[]>([]);
  const [team, setTeam] = useState<ClientInternshipTeam | null>(null);
  const [members, setMembers] = useState<ClientInternshipTeamMember[]>([]);
  const [sprints, setSprints] = useState<ClientInternshipSprint[]>([]);
  const [isSolo, setIsSolo] = useState(false);
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
      setTeam(data.team || null);
      setMembers(data.members || []);
      setSprints(data.sprints || []);
      setIsSolo(Boolean(data.isSolo));
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

  const updateRepo = async (repoUrl: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/internship/team/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await fetchInternship();
        return true;
      }
      alert(data.message || 'Could not verify repository.');
      return false;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error updating repo.');
      return false;
    }
  };

  const submitPrLink = async (sprintId: string, prUrl: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/internship/sprint/${sprintId}/pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await fetchInternship();
        return true;
      }
      alert(data.message || 'Could not verify PR link.');
      return false;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error submitting PR.');
      return false;
    }
  };

  const submitSprint = async (sprintId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/internship/sprint/${sprintId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        await fetchInternship();
        return true;
      }
      alert(data.message || 'Sprint submission failed.');
      return false;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error submitting sprint.');
      return false;
    }
  };

  const submitStandup = async (data: { week: number; done: string; next: string; blockers: string }): Promise<boolean> => {
    if (!enrollment?.id) return false;
    try {
      const res = await fetch('/api/internship/standup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, internshipEnrollmentId: enrollment.id }),
      });
      const resData = await res.json();
      if (res.ok && resData.ok) {
        await fetchInternship();
        return true;
      }
      alert(resData.message || 'Stand-up submission failed.');
      return false;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error submitting stand-up.');
      return false;
    }
  };

  const submitDemoUrl = async (demoUrl: string): Promise<boolean> => {
    if (!enrollment?.id) return false;
    try {
      const res = await fetch('/api/internship/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipEnrollmentId: enrollment.id, demoUrl }),
      });
      const resData = await res.json();
      if (res.ok && resData.ok) {
        await fetchInternship();
        return true;
      }
      alert(resData.message || 'Could not verify demo URL.');
      return false;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error submitting demo.');
      return false;
    }
  };

  return {
    loading,
    panelError,
    enrollment,
    tasks,
    team,
    members,
    sprints,
    isSolo,
    isStarting,
    startError,
    isExtending,
    isRestarting,
    isClaimingCert,
    fetchInternship,
    startSimulation,
    extendDeadline,
    restartSimulation,
    claimCertificate,
    updateRepo,
    submitPrLink,
    submitSprint,
    submitStandup,
    submitDemoUrl,
  };
}
