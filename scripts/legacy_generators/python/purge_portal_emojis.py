import re

def purge_unwanted_emojis(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for pattern, repl in replacements:
        modified = re.sub(pattern, repl, modified)
    
    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Updated {filepath}")
    else:
        print(f"No changes in {filepath}")

# 1. QuestPathView.tsx
purge_unwanted_emojis('src/app/quests/components/QuestPathView.tsx', [
    (r'⚡\s*Synchronize Roadmap', 'Synchronize Roadmap'),
    (r'🔒\s*Career Gate Checkpoint \(Click to Audit\):', 'Career Gate Checkpoint (Click to Audit):'),
    (r'⚡\s*\+\{totalXp\}\s*XP Accumulated', '+{totalXp} XP Accumulated'),
    (r"label:\s*`🌐\s*All Activity", "label: `All Activity"),
    (r"🌱\s*Level 0: Zero Basics", "Level 0: Zero Basics"),
    (r"🌱\s*Level 1: Foundations", "Level 1: Foundations"),
    (r"⚡\s*Level 2: Core Engineering", "Level 2: Core Engineering")
])

# 2. QuestDetailModal.tsx
purge_unwanted_emojis('src/app/quests/components/QuestDetailModal.tsx', [
    (r"🔒\s*Career Gate Audit Checkpoint", "Career Gate Audit Checkpoint"),
    (r"🗺️\s*Master Syllabus & Full Journey Breakdown", "Master Syllabus & Full Journey Breakdown"),
    (r"<span>🛡️</span>\s*Cryptographic Proof", "Cryptographic Proof"),
    (r"<span>🌐</span>\s*Open Public Skill Passport", "Open Public Skill Passport"),
    (r"⚡\s*QT1 Knowledge:", "QT1 Knowledge:")
])

# 3. EnhancedCrashCoursePlanCard.tsx
purge_unwanted_emojis('src/app/quests/components/EnhancedCrashCoursePlanCard.tsx', [
    (r"⏱️\s*\{plan\?\.totalProgramDuration", "{plan?.totalProgramDuration")
])

# 4. CrashCourseCheckoutModal.tsx
purge_unwanted_emojis('src/app/quests/components/CrashCourseCheckoutModal.tsx', [
    (r"⏱️\s*\{plan\.totalProgramDuration\}", "{plan.totalProgramDuration}"),
    (r"🛡️\s*Select Payment Method", "Select Payment Method"),
    (r"Reward Pins Credited!\s*⚡", "Reward Pins Credited!")
])

# 5. InternshipTimelineTracker.tsx
purge_unwanted_emojis('src/app/quests/components/InternshipTimelineTracker.tsx', [
    (r"🔒\s*Unlocks Month", "Unlocks Month"),
    (r"🏆\s*Project Certificate Included", "Project Certificate Included")
])

# 6. PracticeTestQuizRunner.tsx & PracticeTestReportModal.tsx
purge_unwanted_emojis('src/app/quests/components/PracticeTestQuizRunner.tsx', [
    (r"🌐\s*Web Fullstack", "Web Fullstack"),
    (r"🐍\s*Python & AI", "Python & AI")
])

purge_unwanted_emojis('src/app/quests/components/PracticeTestReportModal.tsx', [
    (r"⚡\s*Detected Skill Gap", "Detected Skill Gap")
])

# 7. DashboardHeaderHUD.tsx & DashboardMissionsPanel.tsx
purge_unwanted_emojis('src/components/student/dashboard/DashboardMissionsPanel.tsx', [
    (r"⚡\s*Today&apos;s Workload Missions", "Today&apos;s Workload Missions"),
    (r"⏱️\s*\{m\.estDurationMinutes\}m", "{m.estDurationMinutes}m")
])

purge_unwanted_emojis('src/components/student/dashboard/DashboardStatsRow.tsx', [
    (r"🛡️\s*Verified Records:", "Verified Records:")
])
