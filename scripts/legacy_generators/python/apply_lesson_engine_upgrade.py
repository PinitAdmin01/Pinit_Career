import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

# 1. Update LessonContentRenderer.tsx
p_renderer = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx")
content = p_renderer.read_text(encoding="utf-8").replace('\r\n', '\n')

# Add imports
import_anchor = "import { LessonQuizBlock, getExplanationText } from './LessonQuizBlock';"
new_imports = """import { LessonQuizBlock, getExplanationText } from './LessonQuizBlock';
import { LessonPuzzleStage } from '@/components/quests/puzzle/LessonPuzzleStage';
import { RapidFireBattleStage } from '@/components/quests/battle/RapidFireBattleStage';
import { generateLessonPuzzle, generateRapidFireBattle } from '@/lib/puzzles/lessonPuzzleEngine';
import { parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLesson } from '@/lib/data/longLessons';"""

if import_anchor in content:
    content = content.replace(import_anchor, new_imports)
    print("Added imports to LessonContentRenderer.tsx")
else:
    print("Import anchor not found!")

# Add memoized puzzleSpec and battleSpec inside LessonContentRenderer component
state_anchor = "  const [scrollProgress, setScrollProgress] = useState(0);"
memo_specs = """  const [scrollProgress, setScrollProgress] = useState(0);

  // Parse quest identity for 2.5D puzzle & rapid-fire battle synthesis
  const parsedQuest = useMemo(() => parseQuestId(questId || ''), [questId]);
  const longLesson = useMemo(() => {
    return parsedQuest ? getLongLesson(parsedQuest.prefix, parsedQuest.dayNum) : null;
  }, [parsedQuest]);

  const puzzleSpec = useMemo(() => {
    const prefix = parsedQuest?.prefix || '';
    const dayNum = parsedQuest?.dayNum || 1;
    return generateLessonPuzzle(questId, prefix, dayNum, longLesson || questData);
  }, [questId, parsedQuest, longLesson, questData]);

  const battleSpec = useMemo(() => {
    const prefix = parsedQuest?.prefix || '';
    const dayNum = parsedQuest?.dayNum || 1;
    return generateRapidFireBattle(questId, prefix, dayNum, longLesson || questData);
  }, [questId, parsedQuest, longLesson, questData]);"""

if state_anchor in content:
    content = content.replace(state_anchor, memo_specs)
    print("Added puzzleSpec and battleSpec to LessonContentRenderer.tsx")
else:
    print("State anchor not found!")

# Update slide rendering tail (Puzzle + Battle stages)
tail_anchor = """            {isLastSlide && (
              <LessonQuizBlock"""

new_tail = """            {/* 🧩 1. The 2.5D Tactile Puzzle Stage (Slide N + 1) */}
            {!slidesLoading && currentSlide === slides.length + 1 && (
              <LessonPuzzleStage
                puzzle={puzzleSpec}
                teacherAccent={safeTeacher.accent || 'var(--accent)'}
                onPuzzleSolved={() => {
                  handleNextSlide();
                }}
                playChime={playChime}
                launchConfetti={launchConfetti}
              />
            )}

            {/* ⚔️ 2. The 60-Second Rapid-Fire MCQ Battle (Slide N + 2) */}
            {!slidesLoading && currentSlide === slides.length + 2 && (
              <RapidFireBattleStage
                battle={battleSpec}
                teacherAccent={safeTeacher.accent || 'var(--accent)'}
                onBattleCleared={(score) => {
                  setExamPassed(true);
                  playChime();
                  launchConfetti();
                }}
                playChime={playChime}
                launchConfetti={launchConfetti}
              />
            )}

            {isLastSlide && quizQuestions && (
              <LessonQuizBlock"""

if tail_anchor in content:
    content = content.replace(tail_anchor, new_tail)
    print("Added Puzzle and Battle stages to LessonContentRenderer.tsx")
else:
    print("Tail anchor not found!")

p_renderer.write_text(content, encoding="utf-8")
print("Updated LessonContentRenderer.tsx")

# 2. Update page.tsx totalSlides & isLastSlide
p_page = Path("src/app/quests/lesson/page.tsx")
page_content = p_page.read_text(encoding="utf-8").replace('\r\n', '\n')

old_slides_calc = """  const syllabus: string[] = Array.isArray(questData?.syllabus) ? questData.syllabus : [];
  const totalSlides = (state.slides.length || syllabus.length) + 2;
  const isLastSlide = state.currentSlide === (state.slides.length || syllabus.length) + 1;"""

new_slides_calc = """  const syllabus: string[] = Array.isArray(questData?.syllabus) ? questData.syllabus : [];
  const slidesLength = state.slides.length || syllabus.length;
  // Slide 0: Intro | Slides 1..N: Concepts | Slide N+1: 2.5D Puzzle | Slide N+2: 60s Battle
  const totalSlides = slidesLength + 2;
  const isLastSlide = state.currentSlide >= slidesLength + 2;"""

if old_slides_calc in page_content:
    page_content = page_content.replace(old_slides_calc, new_slides_calc)
    print("Updated page.tsx slide calculations")
else:
    print("page.tsx slide calculations not found!")

p_page.write_text(page_content, encoding="utf-8")
print("Updated page.tsx")
