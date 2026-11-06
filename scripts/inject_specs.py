import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

p = Path("src/app/quests/lesson/components/LessonContentRenderer.tsx")
content = p.read_text(encoding="utf-8").replace('\r\n', '\n')

anchor = "  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);"

insertion = """  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);

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

if anchor in content:
    content = content.replace(anchor, insertion)
    p.write_text(content, encoding="utf-8")
    print("Successfully injected puzzleSpec and battleSpec!")
else:
    print("Anchor not found!")
