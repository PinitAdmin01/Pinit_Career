'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { LanguageCode, LanguageLevel, LanguageLesson, StudentLanguageProgress, SUPPORTED_LANGUAGES } from '@/lib/language/languageTypes';
import { loadLanguageProgress, saveLanguageProgress } from '@/lib/language/languageService';
import { awardLessonXp } from '@/lib/language/languageXpEngine';
import { calculatePracticeStyle } from '@/lib/language/archetypeFuser';
import { getCurriculumByLanguageAndLevel } from '@/lib/language/curriculum';
import { MultiLanguageSelector } from './MultiLanguageSelector';
import { PlacementAssessmentModal } from './PlacementAssessmentModal';
import { LevelRoadmapView } from './LevelRoadmapView';
import { VocabularyLessonView } from './VocabularyLessonView';
import { GrammarLessonView } from './GrammarLessonView';
import { ListeningLessonView } from './ListeningLessonView';
import { SpeakingLessonView } from './SpeakingLessonView';
import { JapaneseScriptLessonView } from './JapaneseScriptLessonView';

interface EnglishDashboardProps {
  onBackToQuests: () => void;
}

export const EnglishDashboard: React.FC<EnglishDashboardProps> = ({ onBackToQuests }) => {
  const { user } = useAuth();
  const { addXp } = useCareerOS();
  const userId = user?.id || 'guest';

  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [allProgress, setAllProgress] = useState<Record<LanguageCode, StudentLanguageProgress>>({
    en: { studentId: userId, languageCode: 'en', currentLevel: 'PRE_A1', highestUnlockedLevel: 'PRE_A1', completedLessonIds: [], totalXpEarned: 0, lastStudiedAt: '' },
    fr: { studentId: userId, languageCode: 'fr', currentLevel: 'PRE_A1', highestUnlockedLevel: 'PRE_A1', completedLessonIds: [], totalXpEarned: 0, lastStudiedAt: '' },
    es: { studentId: userId, languageCode: 'es', currentLevel: 'PRE_A1', highestUnlockedLevel: 'PRE_A1', completedLessonIds: [], totalXpEarned: 0, lastStudiedAt: '' },
    de: { studentId: userId, languageCode: 'de', currentLevel: 'PRE_A1', highestUnlockedLevel: 'PRE_A1', completedLessonIds: [], totalXpEarned: 0, lastStudiedAt: '' },
    ja: { studentId: userId, languageCode: 'ja', currentLevel: 'PRE_A1', highestUnlockedLevel: 'PRE_A1', completedLessonIds: [], totalXpEarned: 0, lastStudiedAt: '' }
  });

  const [activeLesson, setActiveLesson] = useState<LanguageLesson | null>(null);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [viewLevel, setViewLevel] = useState<LanguageLevel>('PRE_A1');

  useEffect(() => {
    // Load progress for all 5 languages
    const codes: LanguageCode[] = ['en', 'fr', 'es', 'de', 'ja'];
    Promise.all(codes.map(c => loadLanguageProgress(userId, c))).then(results => {
      const map = { ...allProgress };
      results.forEach((p, idx) => {
        map[codes[idx]] = p;
      });
      setAllProgress(map);
      setViewLevel(map[activeLanguage]?.currentLevel || 'PRE_A1');
    });
  }, [userId, activeLanguage]);

  const currentProg = allProgress[activeLanguage];
  const langMeta = SUPPORTED_LANGUAGES[activeLanguage];

  const practiceStyle = calculatePracticeStyle({
    patternHunter: 40,
    explorer: 20,
    socialIQ: 30,
    stabilizer: 10
  });

  const handleSelectLanguage = (code: LanguageCode) => {
    setActiveLanguage(code);
    const targetProg = allProgress[code];
    if (targetProg) {
      setViewLevel(targetProg.currentLevel);
    }
  };

  const handleLessonComplete = async (scorePct: number) => {
    if (!activeLesson || !currentProg) return;

    const res = awardLessonXp(
      activeLesson.id,
      activeLesson.moduleType,
      currentProg.completedLessonIds,
      (amt: number) => addXp(amt, 'language'),
      activeLanguage
    );

    const updatedCompleted = currentProg.completedLessonIds.includes(activeLesson.id)
      ? currentProg.completedLessonIds
      : [...currentProg.completedLessonIds, activeLesson.id];

    const updatedProg: StudentLanguageProgress = {
      ...currentProg,
      completedLessonIds: updatedCompleted,
      totalXpEarned: currentProg.totalXpEarned + res.amount,
      lastStudiedAt: new Date().toISOString()
    };

    setAllProgress(prev => ({ ...prev, [activeLanguage]: updatedProg }));
    await saveLanguageProgress(updatedProg);
    setActiveLesson(null);
  };

  const currentLevelData = getCurriculumByLanguageAndLevel(activeLanguage, viewLevel);

  return (
    <div style={{ padding: '16px 20px', maxWidth: 1100, margin: '0 auto', color: 'var(--t1)' }}>
      
      {/* Top Header & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <button
            onClick={onBackToQuests}
            style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontSize: 13, marginBottom: 4 }}
          >
            ← Back to Quests Hub
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, fontFamily: 'var(--font-display)' }}>
            🌍 Multi-Language Learning Platform
          </h1>
        </div>

        <button
          onClick={() => setShowPlacementModal(true)}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            color: '#fff',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)'
          }}
        >
          🎯 Take {langMeta.name} Placement Quiz
        </button>
      </div>

      {/* 5-Language Switcher */}
      <MultiLanguageSelector
        activeLanguage={activeLanguage}
        allProgress={allProgress}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Active Lesson Modal Routing */}
      {activeLesson && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }}>
            {activeLesson.moduleType === 'Vocabulary' && (
              <VocabularyLessonView lesson={activeLesson} onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />
            )}
            {activeLesson.moduleType === 'Grammar' && (
              <GrammarLessonView lesson={activeLesson} onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />
            )}
            {activeLesson.moduleType === 'Listening' && (
              <ListeningLessonView lesson={activeLesson} onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />
            )}
            {activeLesson.moduleType === 'Speaking' && (
              <SpeakingLessonView lesson={activeLesson} onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />
            )}
            {activeLesson.moduleType === 'KanaScript' && (
              <JapaneseScriptLessonView lesson={activeLesson} onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />
            )}
          </div>
        </div>
      )}

      {/* Placement Assessment Modal */}
      {showPlacementModal && (
        <PlacementAssessmentModal
          languageCode={activeLanguage}
          onClose={() => setShowPlacementModal(false)}
          onAssessmentComplete={(res) => {
            setShowPlacementModal(false);
            if (currentProg) {
              const updated = { ...currentProg, currentLevel: res.recommendedStartLevel, highestUnlockedLevel: res.recommendedStartLevel };
              setAllProgress(prev => ({ ...prev, [activeLanguage]: updated }));
              saveLanguageProgress(updated);
              setViewLevel(res.recommendedStartLevel);
            }
          }}
        />
      )}

      {/* Roadmap View */}
      <LevelRoadmapView
        languageCode={activeLanguage}
        activeLevel={viewLevel}
        unlockedLevel={currentProg?.highestUnlockedLevel || 'PRE_A1'}
        completedLessonIds={currentProg?.completedLessonIds || []}
        practiceHintPrefix={practiceStyle.customHintPrefix}
        onSelectLevel={(lvl) => setViewLevel(lvl)}
        onStartLesson={(lesson) => setActiveLesson(lesson)}
        onStartMission={() => alert(`Starting ${langMeta.name} Final Mission!`)}
      />
    </div>
  );
};
