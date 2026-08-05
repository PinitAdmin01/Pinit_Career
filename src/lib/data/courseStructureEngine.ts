export interface QuestSpec {
  id: string;
  title: string;
  desc: string;
  type: 'coding' | 'lecture' | 'interactive';
  category: 'learning' | 'exam' | 'assignment';
  requiresAvatar: boolean;
  syllabus: string[];
  realWorldExample: string;
  analogy: string;
  xp: number;
  pins: number;
  dayNumber: number;
  questNumberInDay: number;
}

export interface DomainTopicSpec {
  day: number;
  title: string;
  concepts: string[];
  realWorldUseCase: string;
  analogy: string;
}

export function generateStandard30DayCourseQuests(
  courseSlug: string,
  courseTitle: string,
  domainTopics: DomainTopicSpec[]
): QuestSpec[] {
  const quests: QuestSpec[] = [];

  for (let day = 1; day <= 30; day++) {
    const topic = domainTopics.find(t => t.day === day) || {
      day,
      title: `${courseTitle} Day ${day} Foundations`,
      concepts: [`Core Mechanics of Day ${day}`, `Best Practices & Memory Architecture`, `Production System Integration`],
      realWorldUseCase: `Stripe / Uber production workflows handling peak user traffic.`,
      analogy: `Think of this like an organized system operating at scale.`
    };

    if (day <= 2) {
      // Days 1-2: 3 Teaching Quests per day (6 total)
      for (let q = 1; q <= 3; q++) {
        const qId = `${courseSlug}-day${day}-q${q}`;
        const subConcept = topic.concepts[q - 1] || `Concept ${q} in ${topic.title}`;
        quests.push({
          id: qId,
          title: `Day ${day} (${q}/3): ${subConcept}`,
          desc: `In-depth ultra-beginner guide to ${subConcept}. Includes real-world production analysis and intuitive metaphors.`,
          type: 'lecture',
          category: 'learning',
          requiresAvatar: true,
          syllabus: [subConcept, `Memory & Execution Boundaries`, `Real-World Application`],
          realWorldExample: topic.realWorldUseCase,
          analogy: topic.analogy,
          xp: 100,
          pins: 10,
          dayNumber: day,
          questNumberInDay: q
        });
      }
    } else {
      // Days 3-30: 5 Quests per day (3 Teaching + 1 Assignment + 1 Exam = 140 total)
      // Quest 1: Teaching Quest 1
      quests.push({
        id: `${courseSlug}-day${day}-q1`,
        title: `Day ${day} (1/5): ${topic.concepts[0] || 'Core Mechanics'}`,
        desc: `Deep-dive lecture on ${topic.concepts[0] || 'core concepts'} for ${topic.title}.`,
        type: 'lecture',
        category: 'learning',
        requiresAvatar: true,
        syllabus: [topic.concepts[0] || 'Core Concept', `Data Flow`, `Best Practices`],
        realWorldExample: topic.realWorldUseCase,
        analogy: topic.analogy,
        xp: 100,
        pins: 10,
        dayNumber: day,
        questNumberInDay: 1
      });

      // Quest 2: Teaching Quest 2
      quests.push({
        id: `${courseSlug}-day${day}-q2`,
        title: `Day ${day} (2/5): ${topic.concepts[1] || 'Architecture & Patterns'}`,
        desc: `Dissecting design patterns and performance considerations for ${topic.title}.`,
        type: 'lecture',
        category: 'learning',
        requiresAvatar: true,
        syllabus: [topic.concepts[1] || 'Design Pattern', `Optimization`, `Edge Cases`],
        realWorldExample: topic.realWorldUseCase,
        analogy: topic.analogy,
        xp: 100,
        pins: 10,
        dayNumber: day,
        questNumberInDay: 2
      });

      // Quest 3: Teaching Quest 3
      quests.push({
        id: `${courseSlug}-day${day}-q3`,
        title: `Day ${day} (3/5): ${topic.concepts[2] || 'Production Engineering'}`,
        desc: `How top enterprise teams implement ${topic.title} at scale.`,
        type: 'lecture',
        category: 'learning',
        requiresAvatar: true,
        syllabus: [topic.concepts[2] || 'Production Setup', `Monitoring`, `Security`],
        realWorldExample: topic.realWorldUseCase,
        analogy: topic.analogy,
        xp: 100,
        pins: 10,
        dayNumber: day,
        questNumberInDay: 3
      });

      // Quest 4: Practical Assignment Quest
      quests.push({
        id: `${courseSlug}-day${day}-q4`,
        title: `Day ${day} (4/5): Practical Lab — ${topic.title}`,
        desc: `Hands-on coding assignment applying ${topic.concepts[0] || 'today concepts'}.`,
        type: 'coding',
        category: 'assignment',
        requiresAvatar: false,
        syllabus: [`Practical Implementation`, `Unit Testing`, `Debugging`],
        realWorldExample: topic.realWorldUseCase,
        analogy: topic.analogy,
        xp: 150,
        pins: 15,
        dayNumber: day,
        questNumberInDay: 4
      });

      // Quest 5: Exam Quest
      quests.push({
        id: `${courseSlug}-day${day}-q5`,
        title: `Day ${day} (5/5): Mastery Exam — ${topic.title}`,
        desc: `Comprehensive knowledge evaluation on all Day ${day} syllabus modules.`,
        type: 'interactive',
        category: 'exam',
        requiresAvatar: true,
        syllabus: [`Syllabus Evaluation`, `Conceptual MCQ`, `Final Assessment`],
        realWorldExample: topic.realWorldUseCase,
        analogy: topic.analogy,
        xp: 200,
        pins: 20,
        dayNumber: day,
        questNumberInDay: 5
      });
    }
  }

  return quests;
}
