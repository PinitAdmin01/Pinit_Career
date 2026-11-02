'use client';

import React, { Suspense } from 'react';
import SpacedReviewQueue from '@/components/learning/SpacedReviewQueue';
import { useLearningData } from './hooks/useLearningData';
import { LearningFilters } from './components/LearningFilters';
import { EnrolledCoursesPanel } from './components/EnrolledCoursesPanel';
import { LearningPathView } from './components/LearningPathView';
import { CourseGrid } from './components/CourseGrid';

export default function LearningPage({ initialTab, embedded = false }: { initialTab?: 'mistakes' | 'roadmap' | 'twin' | 'gaps' | 'memory'; embedded?: boolean } = {}) {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t2)', fontSize: 14.5 }}>Loading Learning Hub...</div>}>
      <LearningPageInner initialTab={initialTab} embedded={embedded} />
    </Suspense>
  );
}

function LearningPageInner({ initialTab, embedded = false }: { initialTab?: 'mistakes' | 'roadmap' | 'twin' | 'gaps' | 'memory'; embedded?: boolean }) {
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
    // Enhanced intelligence exports
    targetRole,
    humanizedMistakes,
    resolveDrill,
    dynamicRoadmap,
    twinSimulation,
    dailyQuestPace,
    setDailyQuestPace,
    interviewScoreTarget,
    setInterviewScoreTarget,
    gapsResolvedCount,
    setGapsResolvedCount,
    categorizedGaps
  } = useLearningData(initialTab);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      <LearningFilters
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        canAccessFaculty={canAccessFaculty}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        embedded={embedded}
      />

      {activeRole === 'faculty' && canAccessFaculty ? (
        <EnrolledCoursesPanel
          activeRole="faculty"
          mistakes={mistakes}
          clearMistake={clearMistake}
          studentsList={studentsList}
          prescribeQuest={prescribeQuest}
          missingSkills={missingSkills}
          humanizedMistakes={humanizedMistakes}
          resolveDrill={resolveDrill}
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
              missingSkills={missingSkills}
              humanizedMistakes={humanizedMistakes}
              resolveDrill={resolveDrill}
            />
          )}

          {activeTab === 'roadmap' && (
            <LearningPathView
              activeTab="roadmap"
              roadmapSteps={roadmapSteps}
              dynamicRoadmap={dynamicRoadmap}
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
              twinSimulation={twinSimulation}
              selectedTwinPath={selectedTwinPath}
              setSelectedTwinPath={setSelectedTwinPath}
              dailyQuestPace={dailyQuestPace}
              setDailyQuestPace={setDailyQuestPace}
              interviewScoreTarget={interviewScoreTarget}
              setInterviewScoreTarget={setInterviewScoreTarget}
              gapsResolvedCount={gapsResolvedCount}
              setGapsResolvedCount={setGapsResolvedCount}
              targetRole={targetRole}
            />
          )}

          {activeTab === 'twin' && (
            <div>
              <LearningPathView
                activeTab="twin"
                roadmapSteps={roadmapSteps}
                dynamicRoadmap={dynamicRoadmap}
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
                twinSimulation={twinSimulation}
                selectedTwinPath={selectedTwinPath}
                setSelectedTwinPath={setSelectedTwinPath}
                dailyQuestPace={dailyQuestPace}
                setDailyQuestPace={setDailyQuestPace}
                interviewScoreTarget={interviewScoreTarget}
                setInterviewScoreTarget={setInterviewScoreTarget}
                gapsResolvedCount={gapsResolvedCount}
                setGapsResolvedCount={setGapsResolvedCount}
                targetRole={targetRole}
              />
              {onboardingComplete && (
                <CourseGrid
                  activeTab="twin"
                  missingSkills={missingSkills}
                  baseMissingSkills={baseMissingSkills}
                  categorizedGaps={categorizedGaps}
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
              categorizedGaps={categorizedGaps}
              quests={quests}
              cOS={cOS}
            />
          )}

          {activeTab === 'memory' && (
            <div style={{ maxWidth: 880, margin: '0 auto' }}>
              <SpacedReviewQueue />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
