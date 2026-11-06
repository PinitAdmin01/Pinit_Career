"""
Comprehensive script to clean all unwanted emojis from the student portal,
and fix dark mode / light mode contrast issues in Friends and Group Discussion components.
"""
import os
import re

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

# 1. Group Discussion Page
replace_in_file('src/app/group-discussion/page.tsx', [
    ('🗣️ Group Discussion Practice', 'Group Discussion Practice'),
    ('🌗 Theme', 'Theme'),
    ("technical: '💻 Technical'", "technical: 'Technical'"),
    ("sales: '📈 Sales'", "sales: 'Sales'"),
    ("business: '💼 Business'", "business: 'Business'"),
    ("domain === 'technical' && '💻 Focus on technology", "domain === 'technical' && 'Focus on technology"),
    ("domain === 'sales' && '📈 Focus on marketing", "domain === 'sales' && 'Focus on marketing"),
    ("domain === 'business' && '💼 Focus on unit economics", "domain === 'business' && 'Focus on unit economics"),
    ("difficulty === 'easy' && '🟢 Supportive", "difficulty === 'easy' && 'Supportive"),
    ("difficulty === 'medium' && '🟡 Balanced", "difficulty === 'medium' && 'Balanced"),
    ("difficulty === 'hard' && '🔴 Tougher", "difficulty === 'hard' && 'Tougher"),
    ("⏱️ {mins} Mins", "{mins} Mins"),
    ("sessionDurationMinutes === 5 && '⚡ Express", "sessionDurationMinutes === 5 && 'Express"),
    ("sessionDurationMinutes === 10 && '⚖️ Standard", "sessionDurationMinutes === 10 && 'Standard"),
    ("sessionDurationMinutes === 15 && '🏛️ Deep dive", "sessionDurationMinutes === 15 && 'Deep dive"),
    ("<span style={{ fontSize: 35 }}>📜</span>", "<div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontSize: 13, fontWeight: 900 }}>GD</div>"),
    ("🔍 Review Recap", "Review Recap"),
    ("🎙️ Voice Demo", "Voice Demo"),
    ("<span style={{ fontSize: 22 }}>{a.emoji}</span>", "<div style={{ width: 30, height: 30, borderRadius: '50%', background: a.color || 'var(--teal)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>{a.name.slice(0, 2).toUpperCase()}</div>")
])

# 2. GD Modals
replace_in_file('src/app/group-discussion/components/GdAvatarGuideModal.tsx', [
    ('🎙️ Play Neural Voice Sample', 'Play Neural Voice Sample'),
])

replace_in_file('src/app/group-discussion/components/GdHistoryModal.tsx', [
    ('📜 Boardroom Discussion History & Analytics', 'Boardroom Discussion History & Analytics'),
    ('<option value="technical">💻 Technical</option>', '<option value="technical">Technical</option>'),
    ('<option value="sales">📈 Sales</option>', '<option value="sales">Sales</option>'),
    ('<option value="business">💼 Business</option>', '<option value="business">Business</option>'),
    ('📜 Session Transcript', 'Session Transcript'),
])

replace_in_file('src/app/group-discussion/components/GdTranscriptDrawer.tsx', [
    ('<span>⏱️</span>', ''),
    ('🎙️ USER TURN:', 'USER TURN:'),
    ('⚡ Avatars thinking...', 'Avatars thinking...'),
    ('<span>💡 OPTIONAL DISCUSSION PROMPT</span>', '<span>OPTIONAL DISCUSSION PROMPT</span>'),
    ("{micActive ? '🎙️' : '🎤'}", "{micActive ? 'Active' : 'Mute'}"),
    ('💡 Need an idea?', 'Need an idea?'),
])

# 3. Friends Chat View - Light Mode Contrast & Emojis
replace_in_file('src/components/friends/FriendChatView.tsx', [
    ("background: 'rgba(10, 15, 30, 0.6)'", "background: 'var(--bg2)'"),
    ("color: '#ffffff'", "color: 'var(--t1)'"),
    ("color: '#94a3b8'", "color: 'var(--t3)'"),
    ("<span style={{ fontSize: 44 }}>💬</span>", "<div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: 14 }}>MSG</div>"),
    ("background: 'rgba(30, 41, 59, 0.75)'", "background: 'var(--bg3)'"),
    ("background: 'rgba(30, 41, 59, 0.6)'", "background: 'var(--bg2)'"),
    ("border: '1px solid rgba(255, 255, 255, 0.1)'", "border: '1px solid var(--border)'"),
    ("border: '1px solid rgba(255, 255, 255, 0.08)'", "border: '1px solid var(--border)'"),
    ("borderBottom: '1px solid rgba(255, 255, 255, 0.08)'", "borderBottom: '1px solid var(--border)'"),
    ("borderTop: '1px solid rgba(255, 255, 255, 0.08)'", "borderTop: '1px solid var(--border)'"),
    ("background: 'rgba(255, 255, 255, 0.05)'", "background: 'var(--bg3)'"),
    ("⚔️ Duel", "Duel"),
    ("👥 Project", "Project"),
    ("<div style={{ fontSize: 35, marginBottom: 8 }}>👋</div>", ""),
    ("⚔️ &quot;Up for an Arena duel?&quot;", "&quot;Up for an Arena duel?&quot;"),
    ("👥 &quot;Want to join our project squad?&quot;", "&quot;Want to join our project squad?&quot;"),
    ("Send ➤", "Send"),
    ("color: isMe ? 'rgba(255, 255, 255, 0.7)' : '#94a3b8'", "color: isMe ? 'rgba(255, 255, 255, 0.85)' : 'var(--t3)'")
])

# 4. Privacy Settings Modal
replace_in_file('src/components/friends/PrivacySettingsModal.tsx', [
    ("<span style={{ fontSize: 22 }}>🛡️</span>", ""),
    ("⚙️ Networking Privacy", "Networking Privacy"),
    ("🚫 Blocked Accounts", "Blocked Accounts"),
    ("background: 'rgba(30, 41, 59, 0.4)'", "background: 'var(--bg2)'"),
    ("background: 'rgba(15, 23, 42, 0.4)'", "background: 'var(--bg2)'"),
    ("border: '1px solid rgba(255, 255, 255, 0.06)'", "border: '1px solid var(--border)'"),
    ("border: '1px dashed rgba(255, 255, 255, 0.1)'", "border: '1px dashed var(--border)'"),
    ("color: '#f8fafc'", "color: 'var(--t1)'"),
    ("color: '#ffffff'", "color: 'var(--t1)'"),
    ("color: '#94a3b8'", "color: 'var(--t3)'"),
    ("<span style={{ fontSize: 35, opacity: 0.6 }}>🛡️</span>", "<div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontWeight: 800 }}>0</div>")
])

# 5. FriendProfileDrawer
replace_in_file('src/components/friends/FriendProfileDrawer.tsx', [
    ("<span>🏫 {student.college", "<span>{student.college"),
    ("<span>📚 {student.course}</span>", "<span>{student.course}</span>"),
    ("💬 Message", "Message"),
    ("⚔️ Arena Battle", "Arena Battle"),
    ("📁 Invite to Squad", "Invite to Squad"),
    ("🔗 Full Profile", "Full Profile"),
    ("🎯 Career Target & Trajectory", "Career Target & Trajectory"),
    ("⚡ Verified Skill Badges", "Verified Skill Badges"),
    ("📊 Skill Mastery Ledger", "Skill Mastery Ledger"),
    ("📁 Squad Projects & Proofs-of-Work", "Squad Projects & Proofs-of-Work"),
    ("<div style={{ fontSize: 26, marginBottom: 8 }}>📁</div>", ""),
    ("⚔️ Challenging Arena Record", "Challenging Arena Record"),
    ("⚔️ Challenge {(student.name", "Challenge {(student.name"),
])

# 6. ProjectInviteModal & SmartMatchModal & SquadProjectsView & StudentCard
replace_in_file('src/components/friends/ProjectInviteModal.tsx', [
    ("<h3>👥 Invite ", "<h3>Invite "),
    ("🚀 Dispatch Squad Invitation", "Dispatch Squad Invitation"),
])

replace_in_file('src/components/friends/SmartMatchModal.tsx', [
    ("<span style={{ fontSize: 22 }}>🤖</span>", ""),
    ("⚡ {s}", "{s}"),
    ('💬 "{starter}"', '"{starter}"'),
    ("🏆 Duel", "Duel"),
    ("👥 Project", "Project"),
])

replace_in_file('src/components/friends/SquadProjectsView.tsx', [
    ("<span style={{ fontSize: 26.5 }}>👥</span>", ""),
    ("<span style={{ fontSize: 17.5 }}>📩</span>", ""),
    ("<span style={{ fontSize: 17.5 }}>🚀</span>", ""),
    ("✓ Accept & Join Squad", "Accept & Join Squad"),
])

replace_in_file('src/components/friends/StudentCard.tsx', [
    ("<span>⚡</span> {student.matchReason}", "<span>{student.matchReason}</span>"),
    ("<span>🎯</span>", ""),
    ("💬 Message", "Message"),
    ("⚔️", "Duel"),
    ("📁", "Squad"),
])

# 7. Friends Page
replace_in_file('src/app/friends/page.tsx', [
    ("<span>👥</span> My Friends", "My Friends"),
    ("<span>💬</span> Messages", "Messages"),
    ("<div style={{ fontSize: 31, marginBottom: 10 }}>⚡</div>", ""),
    ("<span>{peer.matchDetails || '⚡ High skill synergy'}</span>", "<span>{peer.matchDetails || 'High skill synergy'}</span>"),
    ('<span className="empty-state-icon">👥</span>', ''),
    ("💬 Chat", "Chat"),
    ("⚔️ Duel", "Duel"),
    ("👥 Project", "Project"),
    ('<span className="network-stat-icon" style={{ color: \'#818cf8\' }}>👥</span>', ''),
    ('<span className="network-stat-icon" style={{ color: \'#f87171\' }}>🚀</span>', ''),
])

# 8. Quests: TodayCourseCard & Stepper
replace_in_file('src/app/quests/components/TodayCourseCard.tsx', [
    ("const KIND_ICON: Record<string, string> = { Lesson: '🎓', Practice: '💻', Test: '📝' };", "const KIND_ICON: Record<string, string> = { Lesson: '', Practice: '', Test: '' };"),
    ("🎉 All lessons, practice and tests are done", "All lessons, practice and tests are done"),
    ("📝 Next test", "Next test"),
    ("🚀 Final project", "Final project"),
])

replace_in_file('src/app/quests/components/VerticalCheckpointStepper.tsx', [
    ('progress.next ? "⚡ Continue Today\'s Quest"', 'progress.next ? "Continue Today\'s Quest"'),
    ("label: '📝 Take Dynamic Diagnostic Test'", "label: 'Take Dynamic Diagnostic Test'"),
    ("label: '🚀 Open Capstone Desk'", "label: 'Open Capstone Desk'"),
    ("? '🎓 View Internship Outcome'", "? 'View Internship Outcome'"),
    ("? '🏢 Open Internship Desk'", "? 'Open Internship Desk'"),
    (": '🏢 View Internship Desk'", ": 'View Internship Desk'"),
    ("completed: '🎓 Certificate issued'", "completed: 'Certificate issued'"),
    ("{ label: '📲 Share & Verify (QR)',", "{ label: 'Share & Verify (QR)',"),
    ("{ label: '🎓 Get my certificate',", "{ label: 'Get my certificate',"),
    ("phases.graduation === 'completed' ? '👁️ View Certificates' : '👁️ Preview Certificates'", "phases.graduation === 'completed' ? 'View Certificates' : 'Preview Certificates'"),
    ("<span style={{ fontSize: 26.5 }}>📍</span>", ""),
    ("activeTrack === 'web_fullstack' ? '🌐 Full-Stack Web' : '🤖 Python & AI'", "activeTrack === 'web_fullstack' ? 'Full-Stack Web' : 'Python & AI'"),
])

# 9. Quests: Capstone & Credential Preview & Timeline
replace_in_file('src/app/quests/components/CapstoneInternshipPortal.tsx', [
    ("🎙️ {last ? 'Retake' : 'Start'} capstone defense →", "{last ? 'Retake' : 'Start'} capstone defense →"),
    ("🔒 The capstone opens", "The capstone opens"),
])

replace_in_file('src/app/quests/components/CredentialPreviewModal.tsx', [
    ("<span style={s.sealIcon('#f59e0b')}>🏅</span>", ""),
    ("<span style={s.sealIcon('#10b981')}>🛡️</span>", ""),
    ("<span style={s.hudIcon}>🔎</span>", ""),
])

replace_in_file('src/app/quests/components/InternshipTimelineTracker.tsx', [
    ("<span style={{ fontSize: 22 }}>📍</span>", ""),
    ("📝 Take Weekly Practice Test", "Take Weekly Practice Test"),
    ("🏢 Industry Experience", "Industry Experience"),
    ("📜 Real-Time Internship Certificate", "Real-Time Internship Certificate"),
    ("🎓 Graduation", "Graduation"),
    ("🚀 Full Portfolio Live on Web", "Full Portfolio Live on Web"),
])

replace_in_file('src/app/quests/components/EnhancedCrashCoursePlanCard.tsx', [
    ("icon: '⚛️'", "icon: ''"),
    ("icon: '🟢'", "icon: ''"),
    ("icon: '🐍'", "icon: ''"),
    ("icon: '🧠'", "icon: ''"),
])

replace_in_file('src/app/quests/components/RoadmapCompleteBanner.tsx', [
    ("🎓 Roadmap complete:", "Roadmap complete:"),
])

# 10. Arena
replace_in_file('src/app/arena/page.tsx', [
    ("activeRoom.hostReady ? '✔ READY' : '⏳ NOT READY'", "activeRoom.hostReady ? 'READY' : 'WAITING'"),
    ("activeRoom.guestReady ? '✔ READY' : '⏳ NOT READY'", "activeRoom.guestReady ? 'READY' : 'WAITING'"),
    ('<div style={{ fontSize: 35, marginBottom: 8 }} className="animate-pulse">📡</div>', '<div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", margin: "0 auto 10px" }} className="animate-pulse" />'),
])

# 11. Interview
replace_in_file('src/app/interview/page.tsx', [
    ("<span>🎙️</span>", ""),
    ("<span>💬</span>", ""),
    ("toast.error('Insufficient Pins 🔒'", "toast.error('Insufficient Pins'"),
    ("toast.success('Capstone complete 🎓'", "toast.success('Capstone complete'"),
])

replace_in_file('src/app/interview/components/Round2Coding.tsx', [
    ("domainStream === 'non_tech' ? '📊 Run Calculation", "domainStream === 'non_tech' ? 'Run Calculation"),
    ("🗑️ Clear", "Clear"),
    ("🗑️ Terminal console", "Terminal console"),
])

replace_in_file('src/app/interview/components/Round3SystemDesign.tsx', [
    ("📋 Copy", "Copy"),
    ("✨ Crafting defense script...", "Crafting defense script..."),
    ("✨ Generate Script", "Generate Script"),
    ("<span style={{ fontSize: 20 }}>🏛️</span>", ""),
    ("🌟 Architectural Strengths:", "Architectural Strengths:"),
    ("⚠️ Bottlenecks identified:", "Bottlenecks identified:"),
    ("💡 Recommendations:", "Recommendations:"),
])

replace_in_file('src/app/interview/components/Round4StarDrill.tsx', [
    ("📷 {eyeContactScore", "{eyeContactScore"),
    ("⚡ {wpmScore", "{wpmScore"),
    ("📋 Copy", "Copy"),
    ("✨ Crafting spoken STAR", "Crafting spoken STAR"),
    ("✨ Generate STAR Script", "Generate STAR Script"),
    ("? '💡 Focus:", "? 'Focus:"),
    ("🎉 All 4 STAR quadrants completed!", "All 4 STAR quadrants completed!"),
])

print("Completed cleaning portal emojis and contrast tokens!")
