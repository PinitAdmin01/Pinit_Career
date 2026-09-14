'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import GearAudioHub from '@/components/nav/GearAudioHub';
import { useOnboardingWizard } from './hooks/useOnboardingWizard';
import OnboardingIntro from './components/OnboardingIntro';
import CognitiveSliders from './components/CognitiveSliders';
import VoiceDiagnostic from './components/VoiceDiagnostic';
import DocumentUploader from './components/DocumentUploader';
import RoadmapPreview from './components/RoadmapPreview';
import { calculateQT2MindsetBreakdown } from './types';
import { setAvatarVoiceVolume } from '@/lib/tts';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';
import { sanitizeHtml } from '@/lib/sanitize';

// Dynamic import for WebGL/ThreeJS avatar to avoid SSR issues
const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

export default function OnboardingPage() {
  const wizard = useOnboardingWizard();

  const {
    user,
    router,
    cOS,
    activeScreen,
    setActiveScreen,
    stageLabel,
    selectedMentor,
    setSelectedMentor,
    animState,
    setAnimState,
    zoom,
    setZoom,
    isMuted,
    setIsMuted,
    isBgmMuted,
    setIsBgmMuted,
    useNeural,
    setUseNeural,
    speakReply,
    stopAvatarSpeaking,
    intentGreeting,
    showVaultModal,
    setShowVaultModal,
    vaultUploading,
    activeVaultTab,
    setActiveVaultTab,
    vaultSlots,
    isDraggingOverDropzone,
    setIsDraggingOverDropzone,
    isDraggingOverResume,
    setIsDraggingOverResume,
    isVerifyingAll,
    customAnchorName,
    setCustomAnchorName,
    primaryCandidateName,
    identityAuditReport,
    liveQTMetrics,
    formatVaultDate,
    handleUploadToSlot,
    handleBatchAutoSortUpload,
    handleDeleteSlot,
    handleVerifySingleDocument,
    handleVerifyAllDocuments,
    currentAbility,
    setCurrentAbility,
    targetAmbition,
    setTargetAmbition,
    getSliderDialogue,
    clearSpeechTimers,
    scheduleSpeech,
    currentIdentityQ,
    setCurrentIdentityQ,
    identityScores,
    setIdentityScores,
    currentScenario,
    setCurrentScenario,
    simulationScores,
    setSimulationScores,
    voiceConfidence,
    voiceArticulation,
    voiceArchetype,
    setSpeechTranscript,
    setComputedArchetype,
    college,
    setCollege,
    degree,
    setDegree,
    trajectory,
    setTrajectory,
    uploadedFile,
    dragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleExpressSubmit,
    messages,
    setMessages,
    messagesEndRef,
    studentType,
    targetGoal,
    accessReason,
    getOptionsForStep,
    handleUserAnswer,
    recognizing,
    startVoiceListening,
    stopVoiceListening,
    isSubmittingStep,
    startDeepDiagnostics,
    syncing,
    syncProgress,
    syncStatus,
    parserLogs,
    handleFastComplete,
    handleOnboardingComplete,
  } = wizard;

  return (
    <div
      className="onboarding-shell"
      data-theme="dark"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030508',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
        ['--t1' as any]: 'var(--text)',
        ['--t2' as any]: '#e2e8f0',
        ['--t3' as any]: 'var(--text-muted)',
        ['--t4' as any]: 'var(--text-dim)',
        ['--card' as any]: 'var(--text)',
        ['--bg3' as any]: '#f1f5f9',
        ['--border2' as any]: '#cbd5e1',
      }}
    >
      {/* Mentor Selection Screen */}
      {activeScreen === 'CHOOSE_GUIDE' && (
        <OnboardingIntro
          mode="CHOOSE_GUIDE"
          selectedMentor={selectedMentor}
          setSelectedMentor={(m) => setSelectedMentor(m as 'priya' | 'anish')}
          onStartDeepDiagnostics={startDeepDiagnostics}
          onOpenVault={() => setShowVaultModal(true)}
          onOpenExpress={() => setActiveScreen('EXPRESS_FORM')}
          onFastComplete={handleFastComplete}
          isAdmin={user?.role === 'admin' || user?.role === 'superadmin'}
          syncing={syncing}
        />
      )}

      {/* Candidate Secure Vault 2.0 Modal Overlay */}
      <DocumentUploader
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        vaultSlots={vaultSlots}
        vaultUploading={vaultUploading}
        activeVaultTab={activeVaultTab}
        setActiveVaultTab={setActiveVaultTab}
        isDraggingOverDropzone={isDraggingOverDropzone}
        setIsDraggingOverDropzone={setIsDraggingOverDropzone}
        isDraggingOverResume={isDraggingOverResume}
        setIsDraggingOverResume={setIsDraggingOverResume}
        isVerifyingAll={isVerifyingAll}
        customAnchorName={customAnchorName}
        setCustomAnchorName={setCustomAnchorName}
        primaryCandidateName={primaryCandidateName}
        identityAuditReport={identityAuditReport}
        liveQTMetrics={liveQTMetrics}
        handleUploadToSlot={handleUploadToSlot}
        handleBatchAutoSortUpload={handleBatchAutoSortUpload}
        handleVerifySingleDocument={handleVerifySingleDocument}
        handleVerifyAllDocuments={handleVerifyAllDocuments}
        handleDeleteSlot={handleDeleteSlot}
        formatVaultDate={formatVaultDate}
      />

      {/* Dynamic Background Mesh Orbits */}
      <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--brand-rgb),0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb),0.08) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,15,26,0.3)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="lp-brand-lockup" style={{ height: 40, padding: '2px 6px' }}>
            <Image
              src="/brand/pinit-career-logo.png"
              alt="PINIT CAREER"
              width={148}
              height={34}
              className="lp-brand-logo"
              style={{ height: 34, maxWidth: 148, width: 'auto', objectFit: 'contain' }}
              priority
            />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <button
              type="button"
              onClick={handleFastComplete}
              disabled={syncing}
              style={{
                background: 'linear-gradient(135deg, var(--green) 0%, var(--green) 100%)',
                border: 'none',
                borderRadius: 100,
                color: 'var(--card)',
                fontSize: 11,
                fontWeight: 800,
                padding: '6px 14px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(var(--success-rgb), 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              ⚡ Fast Finish (Admin Dev)
            </button>
          )}
          {(user?.roadmapGenerated || (user as any)?.onboardingCompleted || (cOS as any)?.onboardingAnswers?.hasCompleted) && (
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100,
                color: 'var(--foreground)',
                fontSize: 11,
                fontWeight: 700,
                padding: '6px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              ← Return to Dashboard
            </button>
          )}
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '4px 12px' }}>
            {stageLabel[activeScreen] || 'ONBOARDING'}
          </div>
          <GearAudioHub theme={cOS.theme} size="sm" />
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '43fr 57fr', maxWidth: '98%', width: '98%', margin: '0 auto', padding: '12px 24px 24px 24px', gap: 24, zIndex: 5, overflow: 'hidden' }}>
        {/* Left Column: VRoid Mentor Viewport */}
        <section style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(10, 15, 26, 0.15), rgba(10, 15, 26, 0.65)), url('/brand/avatar-room-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 24, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden', 
          position: 'relative', 
          minHeight: 0 
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            {selectedMentor === 'anish' ? (
              <VRoidInterviewAvatar teacherId="anish" animState={animState} zoom={zoom} />
            ) : (
              <VRoidInterviewAvatar teacherId="priya" animState={animState} zoom={zoom} />
            )}
            
            {/* Audio Wave Listening Overlay */}
            {animState === 'listening' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(var(--brand-rgb),0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="mic-wave-bar" style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, animation: `pulse-height 1s ease-in-out infinite alternate ${i * 0.15}s` }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--brand-bright)', textTransform: 'uppercase', letterSpacing: '1px' }}>Listening... Speak now</div>
              </div>
            )}
          </div>

          {/* Floating Controls Overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(10,15,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '6px 12px', backdropFilter: 'blur(10px)', zIndex: 12 }}>
            <button onClick={() => setZoom(z => Math.min(2.2, z + 0.1))} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom In">🔍+</button>
            <button onClick={() => setZoom(z => Math.max(1.1, z - 0.1))} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom Out">🔍-</button>
            <button
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                setAvatarVoiceVolume(next ? 0 : 0.85);
              }}
              style={{ background: 'none', border: 'none', color: isMuted ? 'var(--danger-bright)' : 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }}
              title={isMuted ? "Unmute Mentor Voice" : "Mute Mentor Voice"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={() => {
                const next = !isBgmMuted;
                setIsBgmMuted(next);
                ambientAudio.setMuted(next);
              }}
              style={{ background: 'none', border: 'none', color: isBgmMuted ? 'var(--danger-bright)' : 'var(--accent)', fontSize: 12, fontWeight: 800, cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 3 }}
              title={isBgmMuted ? "Unmute Background Music" : "Mute Background Music"}
            >
              {isBgmMuted ? '🔇' : '🎵'} <span>BGM</span>
            </button>
            <button 
              onClick={() => {
                if (!useNeural && !window.confirm("High-definition neural mentor audio requires an active internet connection. Enable neural voice?")) {
                  return;
                }
                setUseNeural(!useNeural);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: useNeural ? 'var(--green)' : 'var(--t3)',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title={useNeural ? "Mute Neural Voice" : "Enable Neural Voice"}
            >
              {useNeural ? '🎙️ Neural' : '🔇 Silent'}
            </button>
          </div>
        </section>

        {/* Right Column: Screen panels */}
        <section style={{ display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 26, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden', minHeight: 0 }}>
          {/* SCREEN 01: INTENT SELECTION */}
          {activeScreen === 'INTENT_SELECTION' && (
            <OnboardingIntro
              mode="INTENT_SELECTION"
              selectedMentor={selectedMentor}
              setSelectedMentor={(m) => setSelectedMentor(m as 'priya' | 'anish')}
              onStartDeepDiagnostics={startDeepDiagnostics}
              onOpenVault={() => setShowVaultModal(true)}
              onOpenExpress={() => setActiveScreen('EXPRESS_FORM')}
              voiceConfidence={voiceConfidence}
              voiceArticulation={voiceArticulation}
              voiceArchetype={voiceArchetype}
              onChangeGuide={() => {
                stopAvatarSpeaking();
                setActiveScreen('CHOOSE_GUIDE');
              }}
              onRepeatVoice={() => speakReply(intentGreeting)}
            />
          )}

          {/* SCREEN 03: EXPRESS ROUTE RESUME & DEMOGRAPHICS FORM */}
          {activeScreen === 'EXPRESS_FORM' && (
            <DocumentUploader
              isOpen={true}
              isExpress={true}
              onClose={() => setActiveScreen('INTENT_SELECTION')}
              onGoBackFromExpress={() => setActiveScreen('INTENT_SELECTION')}
              vaultSlots={vaultSlots}
              vaultUploading={vaultUploading}
              activeVaultTab={activeVaultTab}
              setActiveVaultTab={setActiveVaultTab}
              isDraggingOverDropzone={isDraggingOverDropzone}
              setIsDraggingOverDropzone={setIsDraggingOverDropzone}
              isDraggingOverResume={isDraggingOverResume}
              setIsDraggingOverResume={setIsDraggingOverResume}
              isVerifyingAll={isVerifyingAll}
              customAnchorName={customAnchorName}
              setCustomAnchorName={setCustomAnchorName}
              primaryCandidateName={primaryCandidateName}
              identityAuditReport={identityAuditReport}
              liveQTMetrics={liveQTMetrics}
              handleUploadToSlot={handleUploadToSlot}
              handleBatchAutoSortUpload={handleBatchAutoSortUpload}
              handleVerifySingleDocument={handleVerifySingleDocument}
              handleVerifyAllDocuments={handleVerifyAllDocuments}
              handleDeleteSlot={handleDeleteSlot}
              formatVaultDate={formatVaultDate}
              trajectory={trajectory}
              setTrajectory={setTrajectory}
              college={college}
              setCollege={setCollege}
              degree={degree}
              setDegree={setDegree}
              uploadedFile={uploadedFile}
              dragOver={dragOver}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelect}
              handleExpressSubmit={handleExpressSubmit}
            />
          )}

          {/* SCREEN 04: SOCRATIC CHAT CONVERSATION */}
          {activeScreen === 'DEEP_CHAT' && (
            <>
              {/* Chat Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: animState === 'talking' ? 'var(--green)' : 'var(--brand)', animation: animState === 'talking' ? 'ping 1.5s infinite' : 'none' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedMentor === 'priya' ? 'Ms. Priya' : 'Mr. Anish'}</div>
                  <div style={{ fontSize: 10, color: 'var(--t2)' }}>{animState === 'talking' ? 'Speaking...' : animState === 'listening' ? 'Listening...' : animState === 'thinking' ? 'Analyzing...' : 'Online'}</div>
                </div>
              </div>

              {/* Chat Timeline */}
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div key={m.id} style={{ display: 'flex', justifyContent: isAi ? 'flex-start' : 'flex-end', animation: 'fadeInUp 0.3s ease forwards' }}>
                      <div style={{
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        background: isAi ? '#1e293b' : 'linear-gradient(135deg, var(--brand) 0%, var(--reward) 100%)',
                        border: isAi ? '1px solid rgba(148,163,184,0.35)' : 'none',
                        color: 'var(--text)',
                        fontSize: 13.5,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        boxShadow: isAi ? 'none' : '0 4px 12px rgba(var(--brand-rgb), 0.25)'
                      }}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Console (Voice-to-Option Selections) */}
              <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                    {getOptionsForStep().map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={syncing || isSubmittingStep}
                        onClick={() => handleUserAnswer(opt)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: 100,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'var(--t1)',
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: (syncing || isSubmittingStep) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                        onMouseEnter={(e) => {
                          if (!syncing && !isSubmittingStep) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'var(--card)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!syncing && !isSubmittingStep) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'var(--t1)';
                          }
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={recognizing ? stopVoiceListening : startVoiceListening}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 100,
                        background: recognizing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${recognizing ? '#ef4444' : 'rgba(255, 255, 255, 0.08)'}`,
                        color: recognizing ? '#fca5a5' : 'var(--t3)',
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {recognizing ? '🔴 Stop Voice Input' : '🎙️ Speak Answer'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SCREEN 05: IDENTITY QUESTIONS */}
          {activeScreen === 'IDENTITY_QUESTIONS' && (
            <CognitiveSliders
              mode="IDENTITY_QUESTIONS"
              studentType={studentType}
              currentIdentityQ={currentIdentityQ}
              setCurrentIdentityQ={setCurrentIdentityQ}
              identityScores={identityScores}
              setIdentityScores={setIdentityScores}
              onCompleteIdentity={() => setActiveScreen('WORKPLACE_SIMULATION')}
            />
          )}

          {/* SCREEN 06: WORKPLACE SIMULATION */}
          {activeScreen === 'WORKPLACE_SIMULATION' && (
            <CognitiveSliders
              mode="WORKPLACE_SIMULATION"
              studentType={studentType}
              currentScenario={currentScenario}
              setCurrentScenario={setCurrentScenario}
              setSimulationScores={setSimulationScores}
              onCompleteSimulation={() => setActiveScreen('SPEECH_ASSESSMENT')}
            />
          )}

          {/* SCREEN 07: SPEECH & COMMUNICATION LAB */}
          {activeScreen === 'SPEECH_ASSESSMENT' && (
            <VoiceDiagnostic
              studentType={studentType}
              setAnimState={setAnimState}
              onCompleteAndGrade={(transcript) => {
                setSpeechTranscript(transcript);
                const breakdown = calculateQT2MindsetBreakdown(identityScores, simulationScores, voiceArchetype);
                const selectedArch = breakdown.dominantTraits?.[0] || 'Pattern Hunter';
                setComputedArchetype(selectedArch);
                setActiveScreen('BLUEPRINT_REVEAL');
                setAnimState('nod');
                speakReply("Congratulations! I have mapped your traits. Let's reveal your potential mapping and diagnostic blueprint.");
              }}
            />
          )}

          {/* SCREEN 08: 30-DAY RADAR & QUEST BLUEPRINT REVEAL */}
          {activeScreen === 'BLUEPRINT_REVEAL' && (() => {
            const qt2Breakdown = calculateQT2MindsetBreakdown(identityScores, simulationScores, voiceArchetype);
            return (
              <RoadmapPreview
                studentType={studentType}
                targetGoal={targetGoal}
                accessReason={accessReason}
                qt2Breakdown={qt2Breakdown}
                selectedMentor={selectedMentor}
                setSelectedMentor={(m) => setSelectedMentor(m as 'priya' | 'anish')}
                onActivateCommandCenter={(st, tg, ar, bt) => handleOnboardingComplete(st, tg, ar, bt)}
                syncing={syncing}
                syncProgress={syncProgress}
                syncStatus={syncStatus}
                parserLogs={parserLogs}
                isUploadedFile={!!uploadedFile}
              />
            );
          })()}
        </section>
      </main>

      {/* Syncing / Parsing Terminal Progress Overlay */}
      {syncing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,5,8,0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          {/* Glowing Spinner Ring */}
          <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 24 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(var(--brand-rgb),0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--accent)', animation: 'spin 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
              {syncProgress}%
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 4, letterSpacing: '-0.5px' }}>
            {uploadedFile ? 'Analyzing Resume & Credentials' : 'Orchestrating Trajectory OS'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 24 }}>
            {syncStatus}
          </p>

          {/* Terminal Console Logs */}
          {parserLogs.length > 0 && (
            <div style={{
              width: '100%',
              maxWidth: 500,
              background: '#070913',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--success-bright)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              marginBottom: 24,
              minHeight: 120,
              justifyContent: 'flex-start'
            }}>
              <div style={{ color: 'var(--t2)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>PARSER PROCESS TERMINAL</span>
                <span>ONLINE</span>
              </div>
              {parserLogs.map((log, index) => (
                <div key={index} style={{ lineBreak: 'anywhere' }}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Main Progress Bar */}
          <div style={{ width: 300, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${syncProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', borderRadius: 2, transition: 'width 0.2s ease' }} />
          </div>
        </div>
      )}

      {/* Embedded Animations */}
      <style dangerouslySetInnerHTML={{ __html: sanitizeHtml(`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-height {
          from { height: 6px; }
          to { height: 28px; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .mic-wave-bar { transition: height 0.1s ease; }
      `)}} />
    </div>
  );
}
