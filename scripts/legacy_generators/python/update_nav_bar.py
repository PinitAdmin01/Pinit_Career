import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

p = Path("src/app/quests/lesson/components/LessonNavigationBar.tsx")
content = p.read_text(encoding="utf-8").replace('\r\n', '\n')

old_flags = """  const isLearningSlide = currentSlide > 0 && currentSlide <= slidesLength;
  const isTestModeBypass = typeof window !== 'undefined' && window.location.search.includes('testMode=true');
  const isConfirmed = isLearningSlide ? Boolean(understandingConfirmed[currentSlide - 1]) : true;
  const isLocked = isLearningSlide && !isConfirmed && !isTestModeBypass;
  const confirmedCount = Object.values(understandingConfirmed || {}).filter(Boolean).length;"""

new_flags = """  const isLearningSlide = currentSlide > 0 && currentSlide <= slidesLength;
  const isPuzzleSlide = currentSlide === slidesLength + 1;
  const isBattleSlide = currentSlide === slidesLength + 2;
  const isTestModeBypass = typeof window !== 'undefined' && window.location.search.includes('testMode=true');
  const isConfirmed = isLearningSlide ? Boolean(understandingConfirmed[currentSlide - 1]) : true;
  const isLocked = isLearningSlide && !isConfirmed && !isTestModeBypass;
  const confirmedCount = Object.values(understandingConfirmed || {}).filter(Boolean).length;"""

if old_flags in content:
    content = content.replace(old_flags, new_flags)
    print("Updated flags in LessonNavigationBar.tsx")
else:
    print("old_flags not found!")

old_btn_label = """            <span className="lesson-nav-label-desktop">
              {isLocked ? 'Answer Check 🔒' : 'Next Slide ▶'}
            </span>
            <span className="lesson-nav-label-mobile">
              {isLocked ? 'Locked 🔒' : 'Next ▶'}
            </span>"""

new_btn_label = """            <span className="lesson-nav-label-desktop">
              {isLocked
                ? 'Answer Check 🔒'
                : isPuzzleSlide
                ? '🧩 Puzzle Event'
                : isBattleSlide
                ? '⚔️ 60s Battle'
                : currentSlide === slidesLength
                ? 'Proceed to Puzzle 🧩'
                : 'Next Slide ▶'}
            </span>
            <span className="lesson-nav-label-mobile">
              {isLocked
                ? 'Locked 🔒'
                : isPuzzleSlide
                ? '🧩 Puzzle'
                : isBattleSlide
                ? '⚔️ Battle'
                : 'Next ▶'}
            </span>"""

if old_btn_label in content:
    content = content.replace(old_btn_label, new_btn_label)
    print("Updated button labels in LessonNavigationBar.tsx")
else:
    print("old_btn_label not found!")

old_pill = """            ✓ {Math.min(confirmedCount, slidesLength)}/{slidesLength} Checks"""
new_pill = """            {isPuzzleSlide
              ? '🧩 Synthesis Puzzle'
              : isBattleSlide
              ? '⚡ 60s MCQ Battle'
              : `✓ ${Math.min(confirmedCount, slidesLength)}/${slidesLength} Concepts Confirmed`}"""

if old_pill in content:
    content = content.replace(old_pill, new_pill)
    print("Updated pill in LessonNavigationBar.tsx")
else:
    print("old_pill not found!")

p.write_text(content, encoding="utf-8")
print("Saved LessonNavigationBar.tsx")
