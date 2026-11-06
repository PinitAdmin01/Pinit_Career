# 1. CredentialPreviewModal.tsx
with open('src/app/quests/components/CredentialPreviewModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("background:'rgba(15,23,42,0.95)'", "background:'var(--card)'")
c = c.replace("border:'1px solid rgba(255,255,255,0.1)'", "border:'1px solid var(--border)'")
c = c.replace("background:'rgba(15,23,42,0.8)'", "background:'var(--bg2)'")
c = c.replace("borderBottom:'1px solid rgba(255,255,255,0.06)'", "borderBottom:'1px solid var(--border)'")
c = c.replace("borderTop:'1px solid rgba(255,255,255,0.06)'", "borderTop:'1px solid var(--border)'")
with open('src/app/quests/components/CredentialPreviewModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 2. InternshipTimelineTracker.tsx
with open('src/app/quests/components/InternshipTimelineTracker.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 22, 0.95) 100%)'", "background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)'")
c = c.replace("border: '1.5px solid rgba(99, 102, 241, 0.25)'", "border: '1.5px solid var(--border)'")
c = c.replace("color: '#ffffff'", "color: 'var(--t1)'")
c = c.replace("color: '#94a3b8'", "color: 'var(--t2)'")
c = c.replace("color: '#cbd5e1'", "color: 'var(--t1)'")
c = c.replace("background: 'rgba(15, 23, 42, 0.6)'", "background: 'var(--bg2)'")
c = c.replace("border: '1px solid rgba(255, 255, 255, 0.08)'", "border: '1px solid var(--border)'")
with open('src/app/quests/components/InternshipTimelineTracker.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 3. PracticeTestReportModal.tsx
with open('src/app/quests/components/PracticeTestReportModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)'", "background: 'linear-gradient(180deg, var(--card) 0%, var(--bg2) 100%)'")
c = c.replace("border: '1.5px solid rgba(99, 102, 241, 0.4)'", "border: '1.5px solid var(--border)'")
with open('src/app/quests/components/PracticeTestReportModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 4. QuestDetailModal.tsx
with open('src/app/quests/components/QuestDetailModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)'", "background: 'var(--card)', border: '1px solid var(--border)'")
c = c.replace("color: '#f8fafc'", "color: 'var(--t1)'")
with open('src/app/quests/components/QuestDetailModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 5. VerticalCheckpointStepper.tsx
with open('src/app/quests/components/VerticalCheckpointStepper.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("#0f172a 100%)", "var(--card) 100%)")
c = c.replace(": '#1e293b'", ": 'var(--bg3)'")
c = c.replace(": 'rgba(255, 255, 255, 0.15)'", ": 'var(--border)'")
with open('src/app/quests/components/VerticalCheckpointStepper.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('SUCCESSFULLY APPLIED THEME TOKENS TO ALL 5 REMAINING FILES')
