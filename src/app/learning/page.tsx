'use client';

import React, { Suspense } from 'react';
import SpacedReviewQueue from '@/components/learning/SpacedReviewQueue';
import { useLearningData } from './hooks/useLearningData';
import { LearningFilters } from './components/LearningFilters';
import { EnrolledCoursesPanel } from './components/EnrolledCoursesPanel';
import { LearningPathView } from './components/LearningPathView';
import { CourseGrid } from './components/CourseGrid';

export default function LearningPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t2)', fontSize: 13 }}>Loading Learning Hub...</div>}>
      <LearningPageInner />
    </Suspense>
  );
}

function LearningPageInner() {
  const {
    cOS,
    activeTab,
    handleTabChange,
    activeRole,
    setActiveRole,
    canAccessFaculty,
    activeStep,
    setActiveStep,
    mistakes,
    clearMistake,
    missingSkills,
    baseMissingSkills,
    twinData,
    studentsList,
    prescribeQuest,
    onboardingComplete,
    setOnboardingComplete,
    step,
    inputVal,
    setInputVal,
    teacher,
    ONBOARDING_QUESTIONS,
    chatHistory,
    simulating,
    chatBottomRef,
    selectedTwinPath,
    setSelectedTwinPath,
    handleSendAnswer,
    roadmapSteps,
    quests,
    onboardingAnswers,
  } = useLearningData();

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      <LearningFilters
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        canAccessFaculty={canAccessFaculty}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      {activeRole === 'faculty' && canAccessFaculty ? (
        <EnrolledCoursesPanel
          activeRole="faculty"
          mistakes={mistakes}
          clearMistake={clearMistake}
          studentsList={studentsList}
          prescribeQuest={prescribeQuest}
        />
      ) : (
        <div>
          {activeTab === 'mistakes' && (
            <EnrolledCoursesPanel
              activeRole="student"
              mistakes={mistakes}
              clearMistake={clearMistake}
              studentsList={studentsList}
              prescribeQuest={prescribeQuest}
            />
          )}

          {activeTab === 'roadmap' && (
            <LearningPathView
              activeTab="roadmap"
              roadmapSteps={roadmapSteps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              onboardingComplete={onboardingComplete}
              setOnboardingComplete={setOnboardingComplete}
              teacher={teacher}
              chatHistory={chatHistory}
              simulating={simulating}
              chatBottomRef={chatBottomRef}
              inputVal={inputVal}
              setInputVal={setInputVal}
              handleSendAnswer={handleSendAnswer}
              ONBOARDING_QUESTIONS={ONBOARDING_QUESTIONS}
              step={step}
              onboardingAnswers={onboardingAnswers}
              twinData={twinData}
              selectedTwinPath={selectedTwinPath}
              setSelectedTwinPath={setSelectedTwinPath}
            />
          )}

          {activeTab === 'twin' && (
            <div>
              <LearningPathView
                activeTab="twin"
                roadmapSteps={roadmapSteps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                onboardingComplete={onboardingComplete}
                setOnboardingComplete={setOnboardingComplete}
                teacher={teacher}
                chatHistory={chatHistory}
                simulating={simulating}
                chatBottomRef={chatBottomRef}
                inputVal={inputVal}
                setInputVal={setInputVal}
                handleSendAnswer={handleSendAnswer}
                ONBOARDING_QUESTIONS={ONBOARDING_QUESTIONS}
                step={step}
                onboardingAnswers={onboardingAnswers}
                twinData={twinData}
                selectedTwinPath={selectedTwinPath}
                setSelectedTwinPath={setSelectedTwinPath}
              />
              {onboardingComplete && (
                <CourseGrid
                  activeTab="twin"
                  missingSkills={missingSkills}
                  baseMissingSkills={baseMissingSkills}
                  quests={quests}
                  cOS={cOS}
                />
              )}
            </div>
          )}

          {activeTab === 'gaps' && (
            <CourseGrid
              activeTab="gaps"
              missingSkills={missingSkills}
              baseMissingSkills={baseMissingSkills}
              quests={quests}
              cOS={cOS}
            />
          )}

          {activeTab === 'memory' && (
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
              <SpacedReviewQueue />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
