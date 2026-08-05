'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import dynamic from 'next/dynamic';

import AdminDashboardShell from '@/components/admin/AdminDashboardShell';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import FraudInspector from '@/components/admin/FraudInspector';
import AuditLogView from '@/components/admin/AuditLogView';
import { AdmissionsTab, FinanceTab, LibraryTab, HostelTab, TransportTab } from '@/components/admin/tabs/OperationsTabs';
import { HRTab, GrievancesTab, EventsTab, ResearchTab, AIAdvisorTab } from '@/components/admin/tabs/ManagementTabs';

const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });

type AdminTab = 'dashboard' | 'users' | 'fraud' | 'stats' | 'audit' | 'broadcast' | 'management' | 'admissions' | 'finance' | 'exams' | 'library' | 'hostel' | 'transport' | 'documents' | 'hr' | 'procurement' | 'assets' | 'grievances' | 'events' | 'research' | 'alumni' | 'maintenance' | 'services' | 'advisor';

function AdminLoading() {
  return (
    <div style={{ padding: 40, color: 'var(--t3, #64748b)', textAlign: 'center', fontFamily: 'system-ui' }}>
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
      <div style={{ padding: 40, color: '#dc2626', textAlign: 'center', fontWeight: 600 }}>
        Access Denied: Admin or SuperAdmin access required.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <AdminDashboardShell />

      {/* Dynamic Tab Renderer */}
      <div style={{ padding: '0 32px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 'admissions' && <AdmissionsTab />}
        {activeTab === 'finance' && <FinanceTab />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'hostel' && <HostelTab />}
        {activeTab === 'transport' && <TransportTab />}
        {activeTab === 'hr' && <HRTab />}
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
    <Suspense fallback={<AdminLoading />}>
      <AdminPageContent />
    </Suspense>
  );
}
