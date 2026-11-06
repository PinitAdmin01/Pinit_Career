"""
Clean decorative emojis from Quests and Internship subcomponents.
"""
import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    for old, new in replacements:
        content = content.replace(old, new)

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed in {filepath}")

# VerticalCheckpointStepper
replace_in_file('src/app/quests/components/VerticalCheckpointStepper.tsx', [
    ("phases.graduation === 'completed' ? '👁️ View Certificates' : '👁️ Preview Certificates'", "phases.graduation === 'completed' ? 'View Certificates' : 'Preview Certificates'"),
    ("phases.graduation === 'completed' ? '👁️ View Certificates' : '👁️ Preview Sample Credentials'", "phases.graduation === 'completed' ? 'View Certificates' : 'Preview Sample Credentials'"),
    ("active: '🎓 Issuing certificate'", "active: 'Issuing certificate'"),
    ("active: '🏢 Fellowship in progress'", "active: 'Fellowship in progress'"),
    ("locked: '🔒 Locked'", "locked: 'Locked'"),
    ("locked: '🏢 Locked'", "locked: 'Locked'"),
    ("locked: '🎓 Locked'", "locked: 'Locked'"),
])

# PracticeTestQuizRunner & ReportModal
replace_in_file('src/app/quests/components/PracticeTestQuizRunner.tsx', [
    ('📊 Test Complete — Results', 'Test Complete — Results'),
    ('>🔍 Diagnostic Weaknesses', '>Diagnostic Weaknesses'),
])

replace_in_file('src/app/quests/components/PracticeTestReportModal.tsx', [
    ("<span style={{ fontSize: 22 }}>📊</span>", ""),
])

# TrackSelectorDrawer
replace_in_file('src/app/quests/components/TrackSelectorDrawer.tsx', [
    ("<span style={{ fontSize: 18 }}>🎯</span>", ""),
    ("🎯", ""),
])

# useQuestProgression.ts toasts
replace_in_file('src/app/quests/components/useQuestProgression.ts', [
    ("toast.success('Roadmap complete 🎓'", "toast.success('Roadmap complete'"),
    ("toast.warning('Class Already Completed 🔒'", "toast.warning('Class Already Completed'"),
    ("toast.warning('Prerequisite Locked 🔒'", "toast.warning('Prerequisite Locked'"),
])

# Internship components
replace_in_file('src/app/quests/components/internship/BacklogCard.tsx', [
    ("<span style={{ fontSize: 22 }}>📋</span>", ""),
    ("🗄️ {table.table}", "{table.table}"),
])

replace_in_file('src/app/quests/components/internship/CodeReviewCard.tsx', [
    ("<span style={{ fontSize: 22 }}>🤖</span>", ""),
    ("💡 Areas to Refine", "Areas to Refine"),
])

replace_in_file('src/app/quests/components/internship/CompanyProfileCard.tsx', [
    ("<span style={{ fontSize: 20 }}>🏢</span>", ""),
    ("<span>⚠️</span>", ""),
])

replace_in_file('src/app/quests/components/internship/FinalReportModal.tsx', [
    ("<span style={{ fontSize: 24 }}>📝</span>", ""),
])

replace_in_file('src/app/quests/components/internship/InternshipCertificateCard.tsx', [
    ("<span style={{ fontSize: 26 }}>📜</span>", ""),
    ("<span>⚠️</span>", ""),
    ("🔗 Copy Shareable Link", "Copy Shareable Link"),
])

replace_in_file('src/app/quests/components/internship/InternshipCompletedBanner.tsx', [
    ("🔄 Restart Simulation", "Restart Simulation"),
    ("<span style={{ fontSize: 26 }}>🎓</span>", ""),
    ("📜 View Verifiable Certificate", "View Verifiable Certificate"),
    ("🎓 Claim Verifiable Certificate", "Claim Verifiable Certificate"),
    ("📋 Review Stand-Up Report", "Review Stand-Up Report"),
])

replace_in_file('src/app/quests/components/internship/InternshipDeadlineBanner.tsx', [
    ("<span style={{ fontSize: 18 }}>{isPast ? '⏰' : isUrgent ? '⏳' : '📅'}</span>", ""),
])

replace_in_file('src/app/quests/components/internship/InternshipPanel.tsx', [
    ("<span style={{ fontSize: 24 }}>🏢</span>", ""),
])

replace_in_file('src/app/quests/components/internship/InternshipReadyBanner.tsx', [
    ("<span style={{ fontSize: 32 }}>⚙️</span>", ""),
    ("<span>🔄</span>", ""),
    ("<span style={{ fontSize: 22 }}>⚠️</span>", ""),
    ("🔄 Retry Generation", "Retry Generation"),
    ("<span style={{ fontSize: 24 }}>🚀</span>", ""),
    ("⚡ Start Fellowship", "Start Fellowship"),
    ("⚡ Start Simulation", "Start Simulation"),
])

replace_in_file('src/app/quests/components/internship/InternshipStatusBanner.tsx', [
    ("<span style={{ fontSize: 20 }}>🔄</span>", ""),
    ("<span style={{ fontSize: 22 }}>🔒</span>", ""),
])

replace_in_file('src/app/quests/components/internship/SprintBoardCard.tsx', [
    ("⚠️ Changes Needed", "Changes Needed"),
    ("📅 4-Week Sprint Schedule", "4-Week Sprint Schedule"),
    ("📝 Write Week", "Write Week"),
    ("🚀 Submit Sprint for Review", "Submit Sprint for Review"),
])

replace_in_file('src/app/quests/components/internship/StandupModal.tsx', [
    ("📝 Week {week} Asynchronous Stand-Up", "Week {week} Asynchronous Stand-Up"),
])

replace_in_file('src/app/quests/components/internship/TeamCard.tsx', [
    ("<span style={{ fontSize: 24 }}>{isSolo ? '👤' : '👥'}</span>", ""),
    ("<span style={{ fontSize: 16 }}>🐙</span>", ""),
    ("⚠️ No GitHub repo registered yet", "No GitHub repo registered yet"),
])

print("Completed cleaning Quests & Internship subcomponents!")
