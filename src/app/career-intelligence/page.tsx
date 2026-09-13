'use client';

import React, { Suspense } from 'react';
import { useCareerIntelligenceData } from './hooks/useCareerIntelligenceData';
import { CareerIntelligenceHeader } from './components/CareerIntelligenceHeader';
import { InternshipTrackerTab } from './components/InternshipTrackerTab';
import { OpportunitiesTab } from './components/OpportunitiesTab';
import { ApplicationsTab } from './components/ApplicationsTab';
import { IndustryProjectsTab } from './components/IndustryProjectsTab';

export default function CareerIntelligencePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <CareerIntelligencePageInner />
    </Suspense>
  );
}

function CareerIntelligencePageInner() {
  const {
    activeTab,
    activeRole,
    setActiveRole,
    handleTabChange,
    trackerSubTab,
    setTrackerSubTab,
    internships,
    mentees,
    approveWeekLog,
    probabilities,
    topCandidates,
    riskStudents,
    opps,
    oppsLoading,
    oppsFilter,
    setOppsFilter,
    jd,
    setJD,
    matching,
    matchResult,
    matchJD,
    apps,
    appsLoading,
    visibleApps,
    activeAppsCount,
    appsFunnel,
    projectsTab,
    setProjectsTab,
    projects,
    newTitle,
    setNewTitle,
    newTech,
    setNewTech,
    gradingProjId,
    setGradingProjId,
    selectedCredits,
    setSelectedCredits,
    selectedGrade,
    setSelectedGrade,
    applyToProject,
    createProject,
    approveProject,
    submitGrade,
  } = useCareerIntelligenceData();

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      <CareerIntelligenceHeader
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      {activeTab === 'tracker' && (
        <InternshipTrackerTab
          activeRole={activeRole}
          trackerSubTab={trackerSubTab}
          setTrackerSubTab={setTrackerSubTab}
          internships={internships}
          probabilities={probabilities}
          mentees={mentees}
          approveWeekLog={approveWeekLog}
          topCandidates={topCandidates}
          riskStudents={riskStudents}
        />
      )}

      {activeTab === 'opportunities' && (
        <OpportunitiesTab
          opps={opps}
          oppsLoading={oppsLoading}
          oppsFilter={oppsFilter}
          setOppsFilter={setOppsFilter}
          jd={jd}
          setJD={setJD}
          matching={matching}
          matchResult={matchResult}
          matchJD={matchJD}
        />
      )}

      {activeTab === 'applications' && (
        <ApplicationsTab
          apps={apps}
          appsLoading={appsLoading}
          visibleApps={visibleApps}
          activeAppsCount={activeAppsCount}
          appsFunnel={appsFunnel}
        />
      )}

      {activeTab === 'projects' && (
        <IndustryProjectsTab
          activeRole={activeRole}
          projectsTab={projectsTab}
          setProjectsTab={setProjectsTab}
          projects={projects}
          applyToProject={applyToProject}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newTech={newTech}
          setNewTech={setNewTech}
          createProject={createProject}
          approveProject={approveProject}
          gradingProjId={gradingProjId}
          setGradingProjId={setGradingProjId}
          selectedCredits={selectedCredits}
          setSelectedCredits={setSelectedCredits}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          submitGrade={submitGrade}
        />
      )}
    </div>
  );
}
