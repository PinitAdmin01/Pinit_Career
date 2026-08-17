'use client';

import React from 'react';
import { LanguageCode, LanguageLevel, LanguageLesson, SUPPORTED_LANGUAGES } from '@/lib/language/languageTypes';
import { getCurriculumByLanguageAndLevel, ALL_LEVELS } from '@/lib/language/curriculum';

interface LevelRoadmapViewProps {
  languageCode: LanguageCode;
  activeLevel: LanguageLevel;
  unlockedLevel: LanguageLevel;
  completedLessonIds: string[];
  practiceHintPrefix: string;
  onSelectLevel: (lvl: LanguageLevel) => void;
  onStartLesson: (lesson: LanguageLesson) => void;
  onStartMission: () => void;
}

export const LevelRoadmapView: React.FC<LevelRoadmapViewProps> = ({
  languageCode,
  activeLevel,
  unlockedLevel,
  completedLessonIds,
  practiceHintPrefix,
  onSelectLevel,
  onStartLesson,
  onStartMission
}) => {
  const langMeta = SUPPORTED_LANGUAGES[languageCode] || SUPPORTED_LANGUAGES['en'];
  const levelData = getCurriculumByLanguageAndLevel(languageCode, activeLevel);
  const lessons = levelData.lessons || [];
  const mission = levelData.mission;

  const unlockedIndex = ALL_LEVELS.indexOf(unlockedLevel);

  return (
    <div>
      {/* Level Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {ALL_LEVELS.map((lvl, idx) => {
          const isUnlocked = idx <= unlockedIndex;
          const isActive = activeLevel === lvl;

          return (
            <button
              key={lvl}
              onClick={() => isUnlocked && onSelectLevel(lvl)}
              disabled={!isUnlocked}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: isActive ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                background: isActive ? 'rgba(99,102,241,0.2)' : isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                color: isUnlocked ? 'var(--t1)' : 'var(--t3)',
                fontWeight: 800,
                fontSize: 12,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.4
              }}
            >
              {isUnlocked ? '🔓' : '🔒'} {lvl} Level
            </button>
          );
        })}
      </div>

      {/* Practice Hint Banner */}
      <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', padding: '10px 14px', borderRadius: 10, fontSize: 12, marginBottom: 20 }}>
        <strong>{practiceHintPrefix}:</strong> Career DNA personalized practice enabled for {langMeta.name}.
      </div>

      {/* Lessons Node Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {lessons.map((lesson, i) => {
          const isDone = completedLessonIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className="glass-card"
              style={{
                padding: 16,
                borderRadius: 14,
                border: isDone ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                background: isDone ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)' }}>
                  {lesson.moduleType}
                </span>
                {isDone && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>✓ Done (+{lesson.xpReward} XP)</span>}
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 6px 0' }}>{lesson.title}</h4>
              <p style={{ fontSize: 11.5, color: 'var(--t2)', margin: '0 0 14px 0', minHeight: 34 }}>{lesson.description}</p>

              <button
                onClick={() => onStartLesson(lesson)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: 8,
                  background: isDone ? 'rgba(255,255,255,0.06)' : 'var(--accent)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 11,
                  cursor: 'pointer'
                }}
              >
                {isDone ? 'Review Module' : `Start ${lesson.moduleType} (${lesson.estimatedMinutes}m) →`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Final Mission Challenge Card */}
      {mission && (
        <div className="glass-card" style={{ padding: 20, borderRadius: 16, border: '1px solid rgba(245,158,11,0.3)', background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.03))' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>
            🏆 CEFR Level Final Mission
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: '0 0 6px 0' }}>{mission.title}</h3>
          <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 14px 0' }}>{mission.scenarioDescription}</p>

          <button
            onClick={onStartMission}
            style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
          >
            Launch Final Mission Assessment 🚀
          </button>
        </div>
      )}
    </div>
  );
};
