import os, re

files_to_check = [
    'src/app/quests/page.tsx',
    'src/app/quests/components/TrackSelectorDrawer.tsx',
    'src/app/quests/components/CrashCoursePlanCards.tsx',
    'src/app/quests/components/EnhancedCrashCoursePlanCard.tsx',
    'src/app/quests/components/CrashCourseCheckoutModal.tsx',
    'src/app/quests/components/CredentialPreviewModal.tsx',
    'src/app/quests/components/QuestPathView.tsx',
    'src/app/quests/components/QuestDetailModal.tsx',
    'src/app/quests/components/CareerGrowthGraph.tsx',
    'src/app/quests/components/ActiveEnrollmentBanner.tsx',
    'src/app/quests/components/VerticalCheckpointStepper.tsx',
    'src/app/quests/components/TodayCourseCard.tsx',
    'src/app/arena/page.tsx',
    'src/app/friends/page.tsx',
    'src/app/friends/[id]/page.tsx',
    'src/components/friends/StudentCard.tsx',
    'src/components/friends/ArenaChallengesView.tsx',
    'src/components/friends/SquadProjectsView.tsx',
    'src/components/friends/FriendChatView.tsx',
    'src/components/friends/FriendProfileDrawer.tsx',
    'src/components/friends/ArenaChallengeModal.tsx',
    'src/components/friends/ProjectInviteModal.tsx',
    'src/components/friends/SmartMatchModal.tsx',
    'src/components/friends/PrivacySettingsModal.tsx',
    'src/components/friends/ReportStudentModal.tsx',
    'src/app/dashboard/page.tsx',
    'src/components/student/dashboard/DashboardHeaderHUD.tsx',
    'src/components/student/dashboard/CareerCourseProgressBar.tsx',
    'src/components/student/dashboard/DashboardAttendanceMarker.tsx',
    'src/components/student/dashboard/DashboardBentoGrid.tsx',
    'src/components/student/dashboard/LearningHeatmapCard.tsx',
    'src/components/ui/WhatToDoToday.tsx',
    'src/app/group-discussion/page.tsx',
    'src/app/group-discussion/components/GdAudioVisualizer.tsx',
    'src/app/group-discussion/components/GdMeetGrid.tsx',
    'src/app/interview/page.tsx',
]

print(f'Checking {len(files_to_check)} key files...')

emoji_pattern = re.compile(r'[\U0001F300-\U0001FAFF\u2600-\u26FF\u2700-\u27BF]')
hardcoded_dark_bg = re.compile(r'background(?:Color)?:\s*[\'\"](?:rgba\(\s*15,\s*23,\s*42|rgba\(\s*10,\s*15,\s*30|rgba\(\s*11,\s*15,\s*25|#0f172a|#0b0f19|#090d16)[\w\.,\s\(\)]*[\'\"]')

issues = []
allowed_symbols = {'✓', '✗', '•', '➔', '→', '←', '●', '★', '☆', '▲', '▼', '►', '◄', '✕'}

for fpath in files_to_check:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Emoji check
    found_emojis = emoji_pattern.findall(content)
    unwanted = [e for e in set(found_emojis) if e not in allowed_symbols]
    if unwanted:
        issues.append(f'EMOJI in {fpath}: {[ascii(e) for e in unwanted]}')
        
    # 2. Hardcoded dark background check
    dark_bgs = hardcoded_dark_bg.findall(content)
    if dark_bgs:
        issues.append(f'HARDCODED DARK BG in {fpath} ({len(dark_bgs)} occurrences): {dark_bgs[:2]}')

print(f'Total potential issues flagged: {len(issues)}')
for iss in issues:
    print(iss)
