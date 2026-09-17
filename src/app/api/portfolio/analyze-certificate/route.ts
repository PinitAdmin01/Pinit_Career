import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { signExamSessionToken } from '@/lib/portfolio/examToken';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`analyze_cert_${ip}`, { limit: 20, windowMs: 3_600_000 });
    if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { title, issuer } = await req.json();
    if (!title || !issuer) {
      return NextResponse.json({ error: 'Title and Issuer are required.' }, { status: 400 });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }

    const systemPrompt = `You are a technical proctor verifying course certificates.
Create exactly 3 technical multiple choice questions (MCQs) to test a student's actual knowledge of the subject matter covered by this certificate: "${title}" issued by "${issuer}".
The questions should be challenging and highly relevant.
Return ONLY a valid JSON object matching this structure (do not wrap in markdown, backticks, or write explanations):
{
  "subject": "Core Subject Name (e.g. React.js)",
  "questions": [
    {
      "id": "q1",
      "question": "The question text",
      "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
      "correctIdx": 0
    },
    {
      "id": "q2",
      "question": "The question text",
      "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
      "correctIdx": 1
    },
    {
      "id": "q3",
      "question": "The question text",
      "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
      "correctIdx": 2
    }
  ]
}`;

    const executeGroq = async (): Promise<string> => {
      if (groqKeys.length === 0) throw new Error('No Groq keys');
      for (const key of groqKeys) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Generate exam' }],
              max_tokens: 600,
              temperature: 0.2
            })
          });
          if (!res.ok) throw new Error(`Groq returned ${res.status}`);
          const data = await res.json();
          return (data.choices?.[0]?.message?.content || '').trim();
        } catch (err) {
          console.warn('Groq single key failed:', err);
        }
      }
      throw new Error('All Groq keys failed');
    };

    const executeOpenRouter = async (): Promise<string> => {
      if (!openRouterKey) throw new Error('No OpenRouter key');
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://pinit-careers.web.app',
          'X-Title': 'Pi Career OS'
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-coder-32b-instruct',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Generate exam' }],
          max_tokens: 600,
          temperature: 0.2
        })
      });
      if (!res.ok) throw new Error(`OpenRouter returned ${res.status}`);
      const data = await res.json();
      return (data.choices?.[0]?.message?.content || '').trim();
    };

    let reply = '';
    let success = false;

    // Try API providers
    if (openRouterKey) {
      try {
        reply = await executeOpenRouter();
        success = true;
      } catch (e) {
        console.warn('OpenRouter failed, trying Groq...', e);
      }
    }
    if (!success && groqKeys.length > 0) {
      try {
        reply = await executeGroq();
        success = true;
      } catch (e) {
        console.warn('Groq failed...', e);
      }
    }

    if (success) {
      try {
        // Strip markdown backticks if any
        const cleaned = reply.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.questions && parsed.questions.length === 3) {
          const answersMap: Record<string, number> = {};
          const sanitizedQuestions = parsed.questions.map((q: any) => {
            answersMap[q.id] = Number(q.correctIdx ?? 0);
            const { correctIdx, ...rest } = q;
            return rest;
          });
          const examSessionToken = signExamSessionToken(answersMap, 30, gated.user!.id, title);
          return NextResponse.json({
            subject: parsed.subject || 'Technical Specialization',
            questions: sanitizedQuestions,
            examSessionToken,
          });
        }
      } catch (parseErr) {
        console.warn('Failed to parse AI output, using fallback:', reply);
      }
    }

    // Dynamic Randomized Fallback Engine with option shuffling to prevent answer memorization
    function shuffleAndBuild(
      id: string,
      question: string,
      correctOption: string,
      distractors: string[]
    ): { id: string; question: string; options: string[]; correctIdx: number } {
      const options = [correctOption, ...distractors];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = options[i];
        options[i] = options[j];
        options[j] = temp;
      }
      const correctIdx = options.indexOf(correctOption);
      return { id, question, options, correctIdx };
    }

    const titleLower = title.toLowerCase();
    let subject = 'General Computer Science';
    let questionPool: Array<{ q: string; correct: string; distractors: string[] }> = [
      {
        q: 'Which of the following describes a key element of secure, scalable software design?',
        correct: 'Applying cryptographic hashing on sensitive fields and caching frequent queries',
        distractors: [
          'Minimizing validation checks to increase response times',
          'Storing state in global variables to allow rapid component updates',
          'Disabling CORS rules to simplify cross-origin developer staging integrations'
        ]
      },
      {
        q: 'What is a primary advantage of utilizing standard APIs over duplicate custom connections?',
        correct: 'They reduce operational friction and sync data automatically across platform portals',
        distractors: [
          'They allow faster local debugging by bypassing credential tokens',
          'They increase database size by duplicating log tables',
          'They require manual proctor validation for every user click'
        ]
      },
      {
        q: 'Why are proctored exams and trust telemetry metrics used inside modern learning portfolios?',
        correct: 'To audit authentic skill attainment and verify credentials with evidence logs',
        distractors: [
          'To slow down student progression timelines',
          'To generate random negative penalties on low-latency interfaces',
          'To automatically approve applications without teacher review'
        ]
      },
      {
        q: 'In distributed computing, what does the CAP theorem state regarding consistency, availability, and partition tolerance?',
        correct: 'A distributed data store can simultaneously provide at most two out of the three guarantees',
        distractors: [
          'All three guarantees can be achieved if SSDs are used',
          'Availability and Consistency are mutually exclusive in single-node systems',
          'Partition tolerance can be eliminated by using fiber-optic cables'
        ]
      }
    ];

    if (titleLower.includes('react') || titleLower.includes('frontend') || titleLower.includes('web')) {
      subject = 'React.js & Frontend Architecture';
      questionPool = [
        {
          q: 'What does the React hook useMemo do?',
          correct: 'It memoizes a computed value to prevent redundant recalculations on every render',
          distractors: [
            'It triggers a component re-render when a reference changes',
            'It automatically subscribes a component to global context values',
            'It performs DOM mutations synchronously after layout paint'
          ]
        },
        {
          q: 'Which of the following is true about React state updates in modern React?',
          correct: 'They are batched and processed asynchronously for performance optimization',
          distractors: [
            'They directly mutate the component state variable synchronously',
            'They bypass the virtual DOM comparison checking loop',
            'They can only be triggered inside lifecycle hooks'
          ]
        },
        {
          q: 'What is a key difference between useEffect and useLayoutEffect?',
          correct: 'useEffect is executed after paint, whereas useLayoutEffect runs before browser paint',
          distractors: [
            'useEffect fires synchronously, while useLayoutEffect is asynchronous',
            'useEffect can trigger state updates but useLayoutEffect cannot',
            'useEffect does not support cleaning up effect subscriptions'
          ]
        },
        {
          q: 'Why should keys in React lists be stable and unique identifiers instead of array indices?',
          correct: 'Array indices can cause state bugs and incorrect component re-renders when list items are reordered',
          distractors: [
            'React throws a compilation error if an index is used',
            'Using indices disables all CSS animations in the DOM',
            'Indices increase memory overhead by 400%'
          ]
        }
      ];
    } else if (titleLower.includes('python') || titleLower.includes('django') || titleLower.includes('ai') || titleLower.includes('ml')) {
      subject = 'Python Programming & Applied Computing';
      questionPool = [
        {
          q: 'Which of the following is true about lists and tuples in Python?',
          correct: 'Lists are mutable, while tuples are immutable',
          distractors: [
            'Lists are immutable, while tuples can be modified at runtime',
            'Both support append() and extend() operations',
            'Tuples execute slower than lists during item lookup'
          ]
        },
        {
          q: 'What does a Python generator function do?',
          correct: 'It returns an iterator that yields values one-at-a-time using the yield keyword',
          distractors: [
            'It compiles Python code into native low-latency bytecode',
            'It automatically profiles memory heap allocation parameters',
            'It generates proctoring questions for exam cells'
          ]
        },
        {
          q: 'How does Python handle primary memory management?',
          correct: 'It uses reference counting and an automatic garbage collector to reclaim heap memory',
          distractors: [
            'It requires manual malloc and free calls in the code',
            'It runs on a virtual sandbox with fixed allocations that cannot exceed 2GB',
            'It relies entirely on operating system paging caches'
          ]
        },
        {
          q: 'Which built-in Python data structure offers O(1) average time complexity for key lookups?',
          correct: 'dict (dictionary / hash table)',
          distractors: [
            'list (dynamic array)',
            'tuple (immutable sequence)',
            'linked list'
          ]
        }
      ];
    } else if (titleLower.includes('aws') || titleLower.includes('cloud') || titleLower.includes('docker') || titleLower.includes('devops')) {
      subject = 'Cloud & DevOps Architecture';
      questionPool = [
        {
          q: 'What is the primary benefit of multi-stage Docker builds?',
          correct: 'They minimize final image size by discarding build-time dependencies',
          distractors: [
            'They compile code concurrently across multiple hosts',
            'They automatically proctor container runtime ports',
            'They bypass container isolation rules for debug logins'
          ]
        },
        {
          q: 'What does AWS Auto Scaling do?',
          correct: 'It dynamically scales server instances up or down based on traffic load metrics',
          distractors: [
            'It increases database volume sizes when log directories fill up',
            'It automatically updates API tokens and certificates',
            'It schedules database backups during off-peak hours'
          ]
        },
        {
          q: 'What is the primary function of a reverse proxy or Load Balancer in system architecture?',
          correct: 'It distributes client requests evenly across target healthy backend servers',
          distractors: [
            'It encrypts incoming traffic with zero-knowledge protocols',
            'It decreases page load latency by caching database queries locally',
            'It limits CPU clock logs to prevent hardware overheat'
          ]
        },
        {
          q: 'In Kubernetes, what is the role of an Ingress Controller?',
          correct: 'It manages external HTTP/HTTPS access and routing to services within the cluster',
          distractors: [
            'It compiles container binaries inside Pod worker nodes',
            'It replaces the kube-scheduler by selecting hardware nodes',
            'It decrypts local hard drives on physical servers'
          ]
        }
      ];
    } else if (titleLower.includes('java') || titleLower.includes('spring')) {
      subject = 'Java & Enterprise Systems';
      questionPool = [
        {
          q: 'What is the purpose of the Garbage Collector in Java?',
          correct: 'To automatically reclaim memory occupied by objects that are no longer referenced',
          distractors: [
            'To format code and remove unused imports dynamically',
            'To check for security vulnerability tags in dependencies',
            'To synchronize thread execution context across cores'
          ]
        },
        {
          q: 'What is the primary architectural feature of Spring Boot?',
          correct: 'It provides starter templates and auto-configuration to bootstrap web services rapidly',
          distractors: [
            'It compiles Java source files directly into machine instructions',
            'It proctors Socratic exams via websocket telemetry channels',
            'It implements zero-knowledge billing ledgers out-of-the-box'
          ]
        },
        {
          q: 'What does the volatile keyword do in Java?',
          correct: 'It forces threads to read and write the variable directly from main memory rather than thread cache',
          distractors: [
            'It indicates that a variable is stored on the GPU cache',
            'It marks a method to be executed asynchronously on background pools',
            'It throws a compile-time exception if a reference is null'
          ]
        }
      ];
    }

    // Pick 3 questions and randomize their option order
    const selectedDefs = questionPool.slice(0, 3);
    const randomizedQuestions = selectedDefs.map((def, idx) =>
      shuffleAndBuild(`q${idx + 1}`, def.q, def.correct, def.distractors)
    );

    const answersMap: Record<string, number> = {};
    const sanitizedQuestions = randomizedQuestions.map(q => {
      answersMap[q.id] = q.correctIdx;
      const { correctIdx, ...rest } = q;
      return rest;
    });

    const examSessionToken = signExamSessionToken(answersMap, 30, gated.user!.id, title);

    return NextResponse.json({
      subject,
      questions: sanitizedQuestions,
      examSessionToken,
    });
  } catch (err: any) {
    console.error('Certificate verification API failed:', err);
    return NextResponse.json({ error: err.message || 'Verification failed.' }, { status: 500 });
  }
}
