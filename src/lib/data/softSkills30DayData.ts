import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const SOFT_SKILLS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Professional Written Communication & Tone",
    desc: "Structure clear, concise business emails, avoid passive-aggressive phrasing, and set executive context.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Professional Written Communication & Tone.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Professional Written Communication & Tone Mastery",
    eDesc: "Implement a JavaScript validation function for Professional Written Communication & Tone.",
    eStarter: "function commTaskDay1(input) {\n    // Return true if input is valid for Professional Written Communication & Tone\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay1 !== 'function') throw new Error('Function commTaskDay1 not found');\nif (commTaskDay1('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Professional Written Communication & Tone Workshop",
    aDesc: "Write an auxiliary function to support Professional Written Communication & Tone.",
    aStarter: "function commTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Technical Documentation & README Writing",
    desc: "Write clear system setup guides, architecture overviews, and developer onboarding documentation.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Technical Documentation & README Writing.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Technical Documentation & README Writing Mastery",
    eDesc: "Implement a JavaScript validation function for Technical Documentation & README Writing.",
    eStarter: "function commTaskDay2(input) {\n    // Return true if input is valid for Technical Documentation & README Writing\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay2 !== 'function') throw new Error('Function commTaskDay2 not found');\nif (commTaskDay2('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Technical Documentation & README Writing Workshop",
    aDesc: "Write an auxiliary function to support Technical Documentation & README Writing.",
    aStarter: "function commTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Active Listening & Paraphrasing Skills",
    desc: "Demonstrate empathetic listening, validate speaker intent, and reflect understanding in meetings.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Active Listening & Paraphrasing Skills.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Active Listening & Paraphrasing Skills Mastery",
    eDesc: "Implement a JavaScript validation function for Active Listening & Paraphrasing Skills.",
    eStarter: "function commTaskDay3(input) {\n    // Return true if input is valid for Active Listening & Paraphrasing Skills\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay3 !== 'function') throw new Error('Function commTaskDay3 not found');\nif (commTaskDay3('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Active Listening & Paraphrasing Skills Workshop",
    aDesc: "Write an auxiliary function to support Active Listening & Paraphrasing Skills.",
    aStarter: "function commTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "The 2-Minute Elevator Pitch",
    desc: "Craft and deliver a high-impact 2-minute summary of your technical projects and value proposition.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of The 2-Minute Elevator Pitch.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: The 2-Minute Elevator Pitch Mastery",
    eDesc: "Implement a JavaScript validation function for The 2-Minute Elevator Pitch.",
    eStarter: "function commTaskDay4(input) {\n    // Return true if input is valid for The 2-Minute Elevator Pitch\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay4 !== 'function') throw new Error('Function commTaskDay4 not found');\nif (commTaskDay4('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: The 2-Minute Elevator Pitch Workshop",
    aDesc: "Write an auxiliary function to support The 2-Minute Elevator Pitch.",
    aStarter: "function commTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Cross-Functional Collaboration with Non-Tech Teams",
    desc: "Translate complex technical concepts into business outcomes for sales, marketing, and executives.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Cross-Functional Collaboration with Non-Tech Teams.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Cross-Functional Collaboration with Non-Tech Teams Mastery",
    eDesc: "Implement a JavaScript validation function for Cross-Functional Collaboration with Non-Tech Teams.",
    eStarter: "function commTaskDay5(input) {\n    // Return true if input is valid for Cross-Functional Collaboration with Non-Tech Teams\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay5 !== 'function') throw new Error('Function commTaskDay5 not found');\nif (commTaskDay5('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cross-Functional Collaboration with Non-Tech Teams Workshop",
    aDesc: "Write an auxiliary function to support Cross-Functional Collaboration with Non-Tech Teams.",
    aStarter: "function commTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Giving & Receiving Constructive Code Feedback",
    desc: "Deliver actionable, respectful PR reviews and handle critical feedback professionally without defensiveness.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Giving & Receiving Constructive Code Feedback.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Giving & Receiving Constructive Code Feedback Mastery",
    eDesc: "Implement a JavaScript validation function for Giving & Receiving Constructive Code Feedback.",
    eStarter: "function commTaskDay6(input) {\n    // Return true if input is valid for Giving & Receiving Constructive Code Feedback\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay6 !== 'function') throw new Error('Function commTaskDay6 not found');\nif (commTaskDay6('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Giving & Receiving Constructive Code Feedback Workshop",
    aDesc: "Write an auxiliary function to support Giving & Receiving Constructive Code Feedback.",
    aStarter: "function commTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Agile Standups & Sprint Communication",
    desc: "Deliver crisp 60-second standup updates covering completed work, next priorities, and blockers.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Agile Standups & Sprint Communication.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Agile Standups & Sprint Communication Mastery",
    eDesc: "Implement a JavaScript validation function for Agile Standups & Sprint Communication.",
    eStarter: "function commTaskDay7(input) {\n    // Return true if input is valid for Agile Standups & Sprint Communication\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay7 !== 'function') throw new Error('Function commTaskDay7 not found');\nif (commTaskDay7('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Agile Standups & Sprint Communication Workshop",
    aDesc: "Write an auxiliary function to support Agile Standups & Sprint Communication.",
    aStarter: "function commTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Effective Meeting Facilitation & Agendas",
    desc: "Set clear meeting objectives, keep discussions on time, and document decisions and next action items.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Effective Meeting Facilitation & Agendas.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Effective Meeting Facilitation & Agendas Mastery",
    eDesc: "Implement a JavaScript validation function for Effective Meeting Facilitation & Agendas.",
    eStarter: "function commTaskDay8(input) {\n    // Return true if input is valid for Effective Meeting Facilitation & Agendas\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay8 !== 'function') throw new Error('Function commTaskDay8 not found');\nif (commTaskDay8('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Effective Meeting Facilitation & Agendas Workshop",
    aDesc: "Write an auxiliary function to support Effective Meeting Facilitation & Agendas.",
    aStarter: "function commTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Conflict Resolution & De-Escalation",
    desc: "Navigate technical disagreements objectively using data, prototypes, and team consensus.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Conflict Resolution & De-Escalation.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Conflict Resolution & De-Escalation Mastery",
    eDesc: "Implement a JavaScript validation function for Conflict Resolution & De-Escalation.",
    eStarter: "function commTaskDay9(input) {\n    // Return true if input is valid for Conflict Resolution & De-Escalation\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay9 !== 'function') throw new Error('Function commTaskDay9 not found');\nif (commTaskDay9('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Conflict Resolution & De-Escalation Workshop",
    aDesc: "Write an auxiliary function to support Conflict Resolution & De-Escalation.",
    aStarter: "function commTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Behavioral Interview Mastery (The STAR Method)",
    desc: "Structure compelling Situation-Task-Action-Result responses for behavioral competency interviews.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Behavioral Interview Mastery (The STAR Method).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Behavioral Interview Mastery (The STAR Method) Mastery",
    eDesc: "Implement a JavaScript validation function for Behavioral Interview Mastery (The STAR Method).",
    eStarter: "function commTaskDay10(input) {\n    // Return true if input is valid for Behavioral Interview Mastery (The STAR Method)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay10 !== 'function') throw new Error('Function commTaskDay10 not found');\nif (commTaskDay10('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Behavioral Interview Mastery (The STAR Method) Workshop",
    aDesc: "Write an auxiliary function to support Behavioral Interview Mastery (The STAR Method).",
    aStarter: "function commTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Handling Failure & Mistakes Professionally",
    desc: "Conduct blame-free post-mortems, take ownership of production bugs, and document preventive safeguards.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Handling Failure & Mistakes Professionally.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Handling Failure & Mistakes Professionally Mastery",
    eDesc: "Implement a JavaScript validation function for Handling Failure & Mistakes Professionally.",
    eStarter: "function commTaskDay11(input) {\n    // Return true if input is valid for Handling Failure & Mistakes Professionally\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay11 !== 'function') throw new Error('Function commTaskDay11 not found');\nif (commTaskDay11('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Handling Failure & Mistakes Professionally Workshop",
    aDesc: "Write an auxiliary function to support Handling Failure & Mistakes Professionally.",
    aStarter: "function commTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Negotiation & Influencing Without Authority",
    desc: "Build alignment across stakeholders, align incentives, and present win-win technical trade-offs.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Negotiation & Influencing Without Authority.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Negotiation & Influencing Without Authority Mastery",
    eDesc: "Implement a JavaScript validation function for Negotiation & Influencing Without Authority.",
    eStarter: "function commTaskDay12(input) {\n    // Return true if input is valid for Negotiation & Influencing Without Authority\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay12 !== 'function') throw new Error('Function commTaskDay12 not found');\nif (commTaskDay12('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Negotiation & Influencing Without Authority Workshop",
    aDesc: "Write an auxiliary function to support Negotiation & Influencing Without Authority.",
    aStarter: "function commTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Time Management & Deep Work Prioritization",
    desc: "Apply the Eisenhower Matrix and time-blocking to protect focus time from meeting overload.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Time Management & Deep Work Prioritization.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Time Management & Deep Work Prioritization Mastery",
    eDesc: "Implement a JavaScript validation function for Time Management & Deep Work Prioritization.",
    eStarter: "function commTaskDay13(input) {\n    // Return true if input is valid for Time Management & Deep Work Prioritization\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay13 !== 'function') throw new Error('Function commTaskDay13 not found');\nif (commTaskDay13('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Time Management & Deep Work Prioritization Workshop",
    aDesc: "Write an auxiliary function to support Time Management & Deep Work Prioritization.",
    aStarter: "function commTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Presentation Skills & Slide Deck Structure",
    desc: "Design high-signal slide decks that highlight problem statements, data metrics, and technical roadmaps.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Presentation Skills & Slide Deck Structure.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Presentation Skills & Slide Deck Structure Mastery",
    eDesc: "Implement a JavaScript validation function for Presentation Skills & Slide Deck Structure.",
    eStarter: "function commTaskDay14(input) {\n    // Return true if input is valid for Presentation Skills & Slide Deck Structure\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay14 !== 'function') throw new Error('Function commTaskDay14 not found');\nif (commTaskDay14('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Presentation Skills & Slide Deck Structure Workshop",
    aDesc: "Write an auxiliary function to support Presentation Skills & Slide Deck Structure.",
    aStarter: "function commTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Asking Effective Technical Questions",
    desc: "Provide minimal reproducible examples, share error logs, and demonstrate prior debugging steps.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Asking Effective Technical Questions.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Asking Effective Technical Questions Mastery",
    eDesc: "Implement a JavaScript validation function for Asking Effective Technical Questions.",
    eStarter: "function commTaskDay15(input) {\n    // Return true if input is valid for Asking Effective Technical Questions\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay15 !== 'function') throw new Error('Function commTaskDay15 not found');\nif (commTaskDay15('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Asking Effective Technical Questions Workshop",
    aDesc: "Write an auxiliary function to support Asking Effective Technical Questions.",
    aStarter: "function commTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Imposter Syndrome & Confidence Building",
    desc: "Overcome self-doubt through continuous skill evidence, mentorship feedback, and growth mindset.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Imposter Syndrome & Confidence Building.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Imposter Syndrome & Confidence Building Mastery",
    eDesc: "Implement a JavaScript validation function for Imposter Syndrome & Confidence Building.",
    eStarter: "function commTaskDay16(input) {\n    // Return true if input is valid for Imposter Syndrome & Confidence Building\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay16 !== 'function') throw new Error('Function commTaskDay16 not found');\nif (commTaskDay16('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Imposter Syndrome & Confidence Building Workshop",
    aDesc: "Write an auxiliary function to support Imposter Syndrome & Confidence Building.",
    aStarter: "function commTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Networking & Professional Relationship Building",
    desc: "Build genuine professional connections on LinkedIn, tech meetups, and open-source communities.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Networking & Professional Relationship Building.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Networking & Professional Relationship Building Mastery",
    eDesc: "Implement a JavaScript validation function for Networking & Professional Relationship Building.",
    eStarter: "function commTaskDay17(input) {\n    // Return true if input is valid for Networking & Professional Relationship Building\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay17 !== 'function') throw new Error('Function commTaskDay17 not found');\nif (commTaskDay17('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Networking & Professional Relationship Building Workshop",
    aDesc: "Write an auxiliary function to support Networking & Professional Relationship Building.",
    aStarter: "function commTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Salary Negotiation & Offer Evaluation",
    desc: "Evaluate total compensation packages (base, bonus, equity) and negotiate offers professionally.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Salary Negotiation & Offer Evaluation.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Salary Negotiation & Offer Evaluation Mastery",
    eDesc: "Implement a JavaScript validation function for Salary Negotiation & Offer Evaluation.",
    eStarter: "function commTaskDay18(input) {\n    // Return true if input is valid for Salary Negotiation & Offer Evaluation\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay18 !== 'function') throw new Error('Function commTaskDay18 not found');\nif (commTaskDay18('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Salary Negotiation & Offer Evaluation Workshop",
    aDesc: "Write an auxiliary function to support Salary Negotiation & Offer Evaluation.",
    aStarter: "function commTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Executive Presence & Body Language",
    desc: "Project confidence in virtual and in-person interviews through posture, eye contact, and vocal clarity.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Executive Presence & Body Language.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Executive Presence & Body Language Mastery",
    eDesc: "Implement a JavaScript validation function for Executive Presence & Body Language.",
    eStarter: "function commTaskDay19(input) {\n    // Return true if input is valid for Executive Presence & Body Language\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay19 !== 'function') throw new Error('Function commTaskDay19 not found');\nif (commTaskDay19('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Executive Presence & Body Language Workshop",
    aDesc: "Write an auxiliary function to support Executive Presence & Body Language.",
    aStarter: "function commTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Empathy & User-Centric Engineering",
    desc: "Advocate for user accessibility, usability, and customer pain points during engineering planning.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Empathy & User-Centric Engineering.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Empathy & User-Centric Engineering Mastery",
    eDesc: "Implement a JavaScript validation function for Empathy & User-Centric Engineering.",
    eStarter: "function commTaskDay20(input) {\n    // Return true if input is valid for Empathy & User-Centric Engineering\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay20 !== 'function') throw new Error('Function commTaskDay20 not found');\nif (commTaskDay20('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Empathy & User-Centric Engineering Workshop",
    aDesc: "Write an auxiliary function to support Empathy & User-Centric Engineering.",
    aStarter: "function commTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Managing Up & Proactive Status Reporting",
    desc: "Keep managers informed with weekly summary updates, risk flags, and proposed solutions.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Managing Up & Proactive Status Reporting.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Managing Up & Proactive Status Reporting Mastery",
    eDesc: "Implement a JavaScript validation function for Managing Up & Proactive Status Reporting.",
    eStarter: "function commTaskDay21(input) {\n    // Return true if input is valid for Managing Up & Proactive Status Reporting\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay21 !== 'function') throw new Error('Function commTaskDay21 not found');\nif (commTaskDay21('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Managing Up & Proactive Status Reporting Workshop",
    aDesc: "Write an auxiliary function to support Managing Up & Proactive Status Reporting.",
    aStarter: "function commTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Handling Work Stress & Preventing Burnout",
    desc: "Set healthy boundaries, maintain sustainable velocity, and practice stress mitigation habits.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Handling Work Stress & Preventing Burnout.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Handling Work Stress & Preventing Burnout Mastery",
    eDesc: "Implement a JavaScript validation function for Handling Work Stress & Preventing Burnout.",
    eStarter: "function commTaskDay22(input) {\n    // Return true if input is valid for Handling Work Stress & Preventing Burnout\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay22 !== 'function') throw new Error('Function commTaskDay22 not found');\nif (commTaskDay22('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Handling Work Stress & Preventing Burnout Workshop",
    aDesc: "Write an auxiliary function to support Handling Work Stress & Preventing Burnout.",
    aStarter: "function commTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Mentoring & Knowledge Sharing",
    desc: "Accelerate junior team member onboarding through pair programming and lunch-and-learn presentations.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Mentoring & Knowledge Sharing.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Mentoring & Knowledge Sharing Mastery",
    eDesc: "Implement a JavaScript validation function for Mentoring & Knowledge Sharing.",
    eStarter: "function commTaskDay23(input) {\n    // Return true if input is valid for Mentoring & Knowledge Sharing\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay23 !== 'function') throw new Error('Function commTaskDay23 not found');\nif (commTaskDay23('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Mentoring & Knowledge Sharing Workshop",
    aDesc: "Write an auxiliary function to support Mentoring & Knowledge Sharing.",
    aStarter: "function commTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Cultural Sensitivity & Global Team Collaboration",
    desc: "Communicate effectively across time zones, cultural nuances, and asynchronous remote teams.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Cultural Sensitivity & Global Team Collaboration.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Cultural Sensitivity & Global Team Collaboration Mastery",
    eDesc: "Implement a JavaScript validation function for Cultural Sensitivity & Global Team Collaboration.",
    eStarter: "function commTaskDay24(input) {\n    // Return true if input is valid for Cultural Sensitivity & Global Team Collaboration\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay24 !== 'function') throw new Error('Function commTaskDay24 not found');\nif (commTaskDay24('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Cultural Sensitivity & Global Team Collaboration Workshop",
    aDesc: "Write an auxiliary function to support Cultural Sensitivity & Global Team Collaboration.",
    aStarter: "function commTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Public Speaking & Tech Talks",
    desc: "Prepare and rehearse 15-minute technical lighting talks with engaging storytelling hooks.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Public Speaking & Tech Talks.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Public Speaking & Tech Talks Mastery",
    eDesc: "Implement a JavaScript validation function for Public Speaking & Tech Talks.",
    eStarter: "function commTaskDay25(input) {\n    // Return true if input is valid for Public Speaking & Tech Talks\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay25 !== 'function') throw new Error('Function commTaskDay25 not found');\nif (commTaskDay25('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Public Speaking & Tech Talks Workshop",
    aDesc: "Write an auxiliary function to support Public Speaking & Tech Talks.",
    aStarter: "function commTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Continuous Learning & Career Roadmap Planning",
    desc: "Set quarterly OKRs for personal skill acquisition and maintain an updated portfolio.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Continuous Learning & Career Roadmap Planning.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Continuous Learning & Career Roadmap Planning Mastery",
    eDesc: "Implement a JavaScript validation function for Continuous Learning & Career Roadmap Planning.",
    eStarter: "function commTaskDay26(input) {\n    // Return true if input is valid for Continuous Learning & Career Roadmap Planning\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay26 !== 'function') throw new Error('Function commTaskDay26 not found');\nif (commTaskDay26('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Continuous Learning & Career Roadmap Planning Workshop",
    aDesc: "Write an auxiliary function to support Continuous Learning & Career Roadmap Planning.",
    aStarter: "function commTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Diplomatic Say-No & Scope Management",
    desc: "Say no constructively by presenting data-driven capacity limits and trade-off alternatives.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Diplomatic Say-No & Scope Management.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Diplomatic Say-No & Scope Management Mastery",
    eDesc: "Implement a JavaScript validation function for Diplomatic Say-No & Scope Management.",
    eStarter: "function commTaskDay27(input) {\n    // Return true if input is valid for Diplomatic Say-No & Scope Management\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay27 !== 'function') throw new Error('Function commTaskDay27 not found');\nif (commTaskDay27('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Diplomatic Say-No & Scope Management Workshop",
    aDesc: "Write an auxiliary function to support Diplomatic Say-No & Scope Management.",
    aStarter: "function commTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Storytelling with Data & Analytics",
    desc: "Present statistical data and business metrics within a compelling narrative arc.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Storytelling with Data & Analytics.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Storytelling with Data & Analytics Mastery",
    eDesc: "Implement a JavaScript validation function for Storytelling with Data & Analytics.",
    eStarter: "function commTaskDay28(input) {\n    // Return true if input is valid for Storytelling with Data & Analytics\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay28 !== 'function') throw new Error('Function commTaskDay28 not found');\nif (commTaskDay28('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Storytelling with Data & Analytics Workshop",
    aDesc: "Write an auxiliary function to support Storytelling with Data & Analytics.",
    aStarter: "function commTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Professional Etiquette & Workplace Ethics",
    desc: "Maintain high ethical standards, intellectual property respect, and inclusive workplace conduct.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Professional Etiquette & Workplace Ethics.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Professional Etiquette & Workplace Ethics Mastery",
    eDesc: "Implement a JavaScript validation function for Professional Etiquette & Workplace Ethics.",
    eStarter: "function commTaskDay29(input) {\n    // Return true if input is valid for Professional Etiquette & Workplace Ethics\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay29 !== 'function') throw new Error('Function commTaskDay29 not found');\nif (commTaskDay29('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Professional Etiquette & Workplace Ethics Workshop",
    aDesc: "Write an auxiliary function to support Professional Etiquette & Workplace Ethics.",
    aStarter: "function commTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Simulated Executive Leadership Presentation",
    desc: "Deliver an end-to-end technical proposal presentation to simulated executive stakeholders.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Capstone: Simulated Executive Leadership Presentation.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Capstone: Simulated Executive Leadership Presentation Mastery",
    eDesc: "Implement a JavaScript validation function for Capstone: Simulated Executive Leadership Presentation.",
    eStarter: "function commTaskDay30(input) {\n    // Return true if input is valid for Capstone: Simulated Executive Leadership Presentation\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof commTaskDay30 !== 'function') throw new Error('Function commTaskDay30 not found');\nif (commTaskDay30('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Simulated Executive Leadership Presentation Workshop",
    aDesc: "Write an auxiliary function to support Capstone: Simulated Executive Leadership Presentation.",
    aStarter: "function commTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof commTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const SOFT_SKILLS_30_DAYS_QUESTS = SOFT_SKILLS_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('comm', i + 1, cfg)
);
