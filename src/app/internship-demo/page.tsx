'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tier1Desk } from '@/app/quests/components/internship/Tier1Desk';
import { TicketWorkspace } from '@/app/quests/components/internship/TicketWorkspace';
import { FinalReportModal } from '@/app/quests/components/internship/FinalReportModal';
import { InternshipCertificateCard } from '@/app/quests/components/internship/InternshipCertificateCard';
import type { ClientInternshipEnrollment, ClientInternshipTask } from '@/lib/internships/types';
import { toast } from '@/lib/store/useAppStore';

type DemoTaskWithSolution = ClientInternshipTask & {
  referenceSolution?: string;
};

export default function InternshipDemoPage() {
  const [selectedTrack, setSelectedTrack] = useState<'python_ai' | 'web_fullstack'>('python_ai');
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<ClientInternshipEnrollment | null>(null);
  const [tasks, setTasks] = useState<DemoTaskWithSolution[]>([]);
  const [activeTicket, setActiveTicket] = useState<DemoTaskWithSolution | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  // Load demo tasks from API
  const loadDemoData = async (track: 'python_ai' | 'web_fullstack') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/internship/demo-data?track=${track}`);
      const data = await res.json();
      if (data.ok) {
        setEnrollment(data.enrollment);
        setTasks(data.tasks);
      } else {
        toast.error('Failed to load demo data', data.message);
      }
    } catch (err) {
      toast.error('Error', 'Could not load demo internship manifests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemoData(selectedTrack);
  }, [selectedTrack]);

  // Handle extension request
  const handleExtendDeadline = async () => {
    if (!enrollment) return;
    setIsExtending(true);
    await new Promise((r) => setTimeout(r, 600));
    const newDueDate = new Date(Date.now() + 16 * 86400000).toISOString();
    setEnrollment({
      ...enrollment,
      dueAt: newDueDate,
      extended: true,
    });
    setIsExtending(false);
    toast.success('Extension Granted (+48h)', '48 hours added to demo deadline countdown.');
  };

  // Handle ticket passing
  const handleTaskPassed = (taskId: string) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === taskId);
      if (idx === -1) return prev;
      const nextTasks = [...prev];
      nextTasks[idx] = {
        ...nextTasks[idx],
        status: 'passed',
        passedAt: new Date().toISOString(),
      };
      // Unlock next sequential ticket
      if (idx + 1 < nextTasks.length && nextTasks[idx + 1].status === 'locked') {
        nextTasks[idx + 1] = {
          ...nextTasks[idx + 1],
          status: 'open',
        };
      }
      return nextTasks;
    });

    toast.success('Ticket Verified & Passed! 🎉', 'Code passed all visible and hidden assertions.');
  };

  // QA Helper: Pass current open ticket
  const handlePassCurrentTicket = () => {
    const openTask = tasks.find((t) => t.status === 'open');
    if (!openTask) {
      toast.info('No Open Tickets', 'All tickets are already passed or locked.');
      return;
    }
    handleTaskPassed(openTask.id);
  };

  // QA Helper: Pass all 5 tickets
  const handlePassAllTickets = () => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'passed',
        passedAt: new Date().toISOString(),
      }))
    );
    toast.success('All 5 Milestones Passed! 🚀', 'Stand-up report is now unlocked.');
  };

  // QA Helper: Reset demo
  const handleResetDemo = () => {
    loadDemoData(selectedTrack);
    setCertificateId(null);
    setActiveTicket(null);
    setShowReportModal(false);
    toast.info('Demo Reset', 'Restored initial milestone states.');
  };

  const allTicketsPassed = tasks.length === 5 && tasks.every((t) => t.status === 'passed');
  const needsFinalReport = allTicketsPassed && !certificateId;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--t1)', paddingBottom: 60 }}>
      {/* Top Banner Navigation */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--card)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: 13,
                color: 'var(--t2)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ← Back to App
            </Link>
            <span style={{ color: 'var(--t3)' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
              🧪 Internship Simulation Demo Desk
            </span>
          </div>
          <h1 style={{ margin: '4px 0 0 0', fontSize: 20, fontWeight: 900, color: 'var(--t1)' }}>
            Tier 1 Job Simulation — QA & Evaluation Sandbox
          </h1>
        </div>

        {/* Toolbar & Track Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Track Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg3)',
              borderRadius: 8,
              padding: 3,
              border: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedTrack('python_ai')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: selectedTrack === 'python_ai' ? 'var(--card)' : 'transparent',
                color: selectedTrack === 'python_ai' ? 'var(--t1)' : 'var(--t2)',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: selectedTrack === 'python_ai' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              🐍 Python AI (NexaCommerce)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTrack('web_fullstack')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: selectedTrack === 'web_fullstack' ? 'var(--card)' : 'transparent',
                color: selectedTrack === 'web_fullstack' ? 'var(--t1)' : 'var(--t2)',
                fontWeight: 700,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: selectedTrack === 'web_fullstack' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              ⚛️ Web Full-Stack (PulseSync)
            </button>
          </div>

          {/* QA Actions */}
          <button
            type="button"
            onClick={handlePassCurrentTicket}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--t1)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Pass the currently open ticket immediately"
          >
            ⚡ Pass Current
          </button>
          <button
            type="button"
            onClick={handlePassAllTickets}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid #10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Fast-forward all 5 tickets to test Stand-Up report"
          >
            🚀 Pass All 5 Tickets
          </button>
          <button
            type="button"
            onClick={handleResetDemo}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              color: 'var(--t2)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Reset tickets to initial state"
          >
            🔄 Reset Demo
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      <div
        style={{
          maxWidth: 1100,
          margin: '20px auto 0 auto',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 13,
            color: 'var(--t2)',
          }}
        >
          <span>
            💡 <strong>Testing Mode:</strong> This console uses the authentic 14-day 5-milestone manifests, Python/TSX sandbox runner, and stand-up report verification without touching production student records. When you are done testing, this demo can be cleanly removed.
          </span>
          <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent)', fontWeight: 800, fontSize: 11 }}>
            ISOLATED SANDBOX
          </span>
        </div>
      </div>

      {/* Main Internship Desk View */}
      <main style={{ maxWidth: 1100, margin: '20px auto', padding: '0 20px' }}>
        {loading || !enrollment ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t2)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
            <div>Loading canonical simulation manifests...</div>
          </div>
        ) : (
          <Tier1Desk
            enrollment={enrollment}
            tasks={tasks}
            needsFinalReport={needsFinalReport}
            onExtendDeadline={handleExtendDeadline}
            isExtending={isExtending}
            onOpenReport={() => setShowReportModal(true)}
            onSelectTicket={(task) => {
              const matched = tasks.find((t) => t.id === task.id) || (task as DemoTaskWithSolution);
              setActiveTicket(matched);
            }}
          />
        )}
      </main>

      {/* Ticket Workspace Drawer / Modal */}
      {activeTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(5, 7, 15, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 1040,
              maxHeight: '92vh',
              background: 'var(--card)',
              borderRadius: 14,
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* QA Toolbar above Ticket Workspace */}
            <div
              style={{
                padding: '10px 18px',
                background: 'var(--bg3)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--t2)' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent)' }}>🧪 Demo Helper:</span>
                <span>Test manual code changes, click &quot;Run Visible Tests&quot;, or auto-inject the verified reference solution:</span>
              </div>
              {activeTicket.referenceSolution && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTicket.referenceSolution) {
                      setActiveTicket({
                        ...activeTicket,
                        starterCode: activeTicket.referenceSolution,
                      });
                      toast.success('Reference Solution Injected! 💡', 'Code updated. Click "Run Tests" or "Submit Ticket" to verify.');
                    }
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: '1px solid #10b981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  💡 Inject Reference Solution
                </button>
              )}
            </div>

            {/* Embedded Production Ticket Workspace */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <TicketWorkspace
                task={activeTicket}
                onBack={() => setActiveTicket(null)}
                onTaskPassed={(taskId) => {
                  handleTaskPassed(taskId);
                  setTimeout(() => setActiveTicket(null), 1200);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stand-Up Report Modal */}
      {showReportModal && enrollment && (
        <FinalReportModal
          enrollmentId={enrollment.id}
          existingReport={
            'In this 14-day engineering simulation for NexaCommerce, I investigated and resolved core checkout defects, implemented high-precision decimal calculations with ROUND_HALF_UP, built an O(N) catalog indexing engine with null guards, sanitized ASCII promotion codes, and unified the entire flow under NexaCommerceCore.process_checkout(). All visible and hidden tests passed with zero regressions.'
          }
          onClose={() => setShowReportModal(false)}
          onReportAccepted={() => {
            setShowReportModal(false);
            setCertificateId('PINIT-DEMO-CERT-' + Date.now().toString(36).toUpperCase());
            toast.success('Simulation Complete! 🎓', 'Tamper-proof credential generated.');
          }}
        />
      )}

      {/* Verified Certificate Card Modal */}
      {certificateId && (
        <InternshipCertificateCard
          certificateId={certificateId}
          studentName="Engineer (Demo Student)"
          planTitle={
            selectedTrack === 'python_ai'
              ? 'Python & AI Engineering Job Simulation (1 Month)'
              : 'Full-Stack Web Development Job Simulation (1 Month)'
          }
          companyName={
            selectedTrack === 'python_ai'
              ? 'NexaCommerce Core Systems (Simulated Employer)'
              : 'PulseSync Systems (Simulated Employer)'
          }
          completedAt={new Date().toISOString()}
          onClose={() => setCertificateId(null)}
        />
      )}
    </div>
  );
}
