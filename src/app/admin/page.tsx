'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import dynamic from 'next/dynamic';

import { RoleGate } from '@/components/auth/RoleGate';

import AdminDashboardShell from '@/components/admin/AdminDashboardShell';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import FraudInspector from '@/components/admin/FraudInspector';
import AuditLogView from '@/components/admin/AuditLogView';
import { AdmissionsTab, FinanceTab, LibraryTab, HostelTab, TransportTab } from '@/components/admin/tabs/OperationsTabs';
import { GrievancesTab, EventsTab, ResearchTab, AIAdvisorTab } from '@/components/admin/tabs/ManagementTabs';

const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });

type AdminTab = 'dashboard' | 'users' | 'fraud' | 'stats' | 'audit' | 'broadcast' | 'management' | 'admissions' | 'finance' | 'exams' | 'library' | 'hostel' | 'transport' | 'documents' | 'hr' | 'procurement' | 'assets' | 'grievances' | 'events' | 'research' | 'alumni' | 'maintenance' | 'services' | 'advisor';

function AdminLoading() {
  return (
    <div style={{ padding: 40, color: 'var(--t3, var(--t2))', textAlign: 'center', fontFamily: 'system-ui' }}>
      Loading Admin Console & Permissions...
    </div>
  );
}

function AdminPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get('tab') as AdminTab) || 'dashboard';

  const [activeTab, setActiveTab] = useState<AdminTab>(tabParam);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  if (authLoading) {
    return <AdminLoading />;
  }

  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return (
      <div style={{ padding: 40, color: 'var(--coral)', textAlign: 'center', fontWeight: 600 }}>
        Access Denied: Admin or SuperAdmin access required.
      </div>
    );
  }

  return (
    <div className="portal-page">
      <AdminDashboardShell />

      {/* Dynamic Tab Renderer */}
      <div style={{ padding: '0 32px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 'admissions' && <AdmissionsTab />}
        {activeTab === 'finance' && <FinanceTab />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'hostel' && <HostelTab />}
        {activeTab === 'transport' && <TransportTab />}
        {['hr', 'procurement', 'assets', 'alumni'].includes(activeTab) && (
          <div style={{ background: 'var(--bg2, #fff)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 9999, background: 'rgba(234, 179, 8, 0.15)', color: '#b45309', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              Module Staged for ERP v3
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800 }}>Module Offline Pending Real Tables &amp; Banking Rails</h3>
            <p style={{ margin: '0 auto', color: 'var(--t3, #64748b)', fontSize: 13, maxWidth: 540, lineHeight: 1.5 }}>
              This module has been hidden from campus operations. Simulated payroll execution, unlinked purchase orders, unverified maintenance resets, and mock donations are deactivated until certified production schemas and payment gateways are connected.
            </p>
          </div>
        )}
        {activeTab === 'grievances' && <GrievancesTab />}
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'research' && <ResearchTab />}
        {activeTab === 'advisor' && <AIAdvisorTab />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RoleGate allow={['admin', 'superadmin']} label="Admin access required">
      <Suspense fallback={<AdminLoading />}>
        <AdminPageContent />
      </Suspense>
    </RoleGate>
  );
}
