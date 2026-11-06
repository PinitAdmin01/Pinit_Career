import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

p = Path("src/app/quests/lesson/hooks/useLessonEngine.ts")
text = p.read_text(encoding="utf-8")

# Replacement 1: Speaker text for Puzzle and Battle
old_speaker = """    if (currentSlide === slidesLength + 1) {
      if (examPassed) {
        return `Outstanding achievement, ${studentName}! You passed the syllabus evaluation exam with flying colors! Your conceptual grounding is verified. Click Finish Quest below to return to your roadmap and collect your rewards!`;
      }
      const qText = (quizQuestions ? quizQuestions[examQuestionIndex]?.question : slides[examQuestionIndex]?.mcq?.question) || "Ready for your evaluation question?";
      return `Welcome to the Syllabus Evaluation Exam! Let us assess your understanding. ${qText}`;
    }"""

new_speaker = """    if (currentSlide === slidesLength + 1) {
      if (examPassed) {
        return `Outstanding achievement, ${studentName}! You passed the evaluation with flying colors! Your conceptual grounding is verified. Click Finish Quest below to return to your roadmap and collect your rewards!`;
      }
      return `Welcome to today's synthesis puzzle! Arrange the tactile component blocks in the correct operational sequence to clear the challenge and enter the 60-second Rapid-Fire Battle!`;
    }
    if (currentSlide === slidesLength + 2) {
      return `Welcome to the 60-Second Rapid-Fire Battle Arena! You have 60 seconds to answer all 5 questions. Fast reflexes and accuracy count. Good luck!`;
    }"""

# Normalize \r\n to \n for replacement
norm_text = text.replace('\r\n', '\n')
if old_speaker in norm_text:
    norm_text = norm_text.replace(old_speaker, new_speaker)
    print("Replaced speaker text successfully.")
else:
    print("Speaker text not matched!")

# Replacement 2: handleNextSlide boundary
old_next = """    const slidesLength = slides.length || syllabus.length;
    if (currentSlide < slidesLength + 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      setMaxUnlockedSlide(prev => Math.max(prev, nextSlide));
    }"""

new_next = """    const slidesLength = slides.length || syllabus.length;
    if (currentSlide < slidesLength + 2) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      setMaxUnlockedSlide(prev => Math.max(prev, nextSlide));
    }"""

if old_next in norm_text:
    norm_text = norm_text.replace(old_next, new_next)
    print("Replaced handleNextSlide successfully.")
else:
    print("handleNextSlide not matched!")

# Replacement 3: Autoplay boundary
old_autoplay = """    const slidesLength = slidesLengthRef.current;
    if (currentSlide === 0 || currentSlide > slidesLength + 1) {"""

new_autoplay = """    const slidesLength = slidesLengthRef.current;
    if (currentSlide === 0 || currentSlide > slidesLength + 2) {"""

if old_autoplay in norm_text:
    norm_text = norm_text.replace(old_autoplay, new_autoplay)
    print("Replaced autoplay boundary successfully.")
else:
    print("autoplay boundary not matched!")

p.write_text(norm_text, encoding="utf-8")
print("Updated useLessonEngine.ts")
