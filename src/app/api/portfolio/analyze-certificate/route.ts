import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
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
          return NextResponse.json(parsed);
        }
      } catch (parseErr) {
        console.warn('Failed to parse AI output, using fallback:', reply);
      }
    }

    // Heuristic Fallback
    const titleLower = title.toLowerCase();
    let subject = 'General Computer Science';
    let questions = [
      {
        id: 'q1',
        question: 'Which of the following describes a key element of secure, scalable software design?',
        options: [
          'Minimizing validation checks to increase response times',
          'Applying cryptographic hashing on sensitive fields and caching frequent queries',
          'Storing state in global variables to allow rapid component updates',
          'Disabling CORS rules to simplify cross-origin developer staging integrations'
        ],
        correctIdx: 1
      },
      {
        id: 'q2',
        question: 'What is a primary advantage of utilizing standard APIs over duplicate custom connections?',
        options: [
          'They allow faster local debugging by bypassing credential tokens',
          'They reduce operational friction and sync data automatically across platform portals',
          'They increase database size by duplicating log tables',
          'They require manual proctor validation for every user click'
        ],
        correctIdx: 1
      },
      {
        id: 'q3',
        question: 'Why are proctored exams and trust telemetry metrics used inside modern learning portfolios?',
        options: [
          'To slow down student progression timelines',
          'To audit authentic skill attainment and verify credentials with evidence logs',
          'To generate random negative penalties on low-latency interfaces',
          'To automatically approve applications without teacher review'
        ],
        correctIdx: 1
      }
    ];

    if (titleLower.includes('react') || titleLower.includes('frontend')) {
      subject = 'React.js & Frontend';
      questions = [
        {
          id: 'q1',
          question: 'What does the React hook useMemo do?',
          options: [
            'It triggers a component re-render when a reference changes',
            'It memoizes a computed value to prevent redundant recalculations on every render',
            'It automatically subscribes a component to global context values',
            'It performs DOM mutations synchronously after layout paint'
          ],
          correctIdx: 1
        },
        {
          id: 'q2',
          question: 'Which of the following is true about React state updates?',
          options: [
            'They directly mutate the component state variable synchronously',
            'They are batched and processed asynchronously for performance optimization',
            'They bypass the virtual DOM comparison checking loop',
            'They can only be triggered inside lifecycle hooks'
          ],
          correctIdx: 1
        },
        {
          id: 'q3',
          question: 'What is a key difference between useEffect and useLayoutEffect?',
          options: [
            'useEffect fires synchronously, while useLayoutEffect is asynchronous',
            'useEffect is executed after paint, whereas useLayoutEffect runs before browser paint',
            'useEffect can trigger state updates but useLayoutEffect cannot',
            'useEffect does not support cleaning up effect subscriptions'
          ],
          correctIdx: 1
        }
      ];
    } else if (titleLower.includes('python') || titleLower.includes('django')) {
      subject = 'Python Programming';
      questions = [
        {
          id: 'q1',
          question: 'Which of the following is true about lists and tuples in Python?',
          options: [
            'Lists are immutable, while tuples can be modified at runtime',
            'Lists are mutable, while tuples are immutable',
            'Both support append() and extend() operations',
            'Tuples execute slower than lists during item lookup'
          ],
          correctIdx: 1
        },
        {
          id: 'q2',
          question: 'What does a Python generator function do?',
          options: [
            'It compiles Python code into native low-latency bytecode',
            'It returns an iterator that yields values one-at-a-time using the yield keyword',
            'It automatically profiles memory heap allocation parameters',
            'It generates proctoring questions for exam cells'
          ],
          correctIdx: 1
        },
        {
          id: 'q3',
          question: 'How does Python handle memory management?',
          options: [
            'It requires manual malloc and free calls in the code',
            'It uses reference counting and an automatic garbage collector to reclaim heap memory',
            'It runs on a virtual sandbox with fixed allocations that cannot exceed 2GB',
            'It relies entirely on operating system paging caches'
          ],
          correctIdx: 1
        }
      ];
    } else if (titleLower.includes('aws') || titleLower.includes('cloud') || titleLower.includes('docker')) {
      subject = 'Cloud & DevOps Architecture';
      questions = [
        {
          id: 'q1',
          question: 'What is the primary benefit of multi-stage Docker builds?',
          options: [
            'They compile code concurrently across multiple hosts',
            'They minimize final image size by discarding build-time dependencies',
            'They automatically proctor container runtime ports',
            'They bypass container isolation rules for debug logins'
          ],
          correctIdx: 1
        },
        {
          id: 'q2',
          question: 'What does AWS Auto Scaling do?',
          options: [
            'It increases database volume sizes when log directories fill up',
            'It dynamically scales server instances up or down based on traffic load metrics',
            'It automatically updates API tokens and certificates',
            'It schedules database backups during off-peak hours'
          ],
          correctIdx: 1
        },
        {
          id: 'q3',
          question: 'What is the function of a Load Balancer in system design?',
          options: [
            'It encrypts incoming traffic with zero-knowledge protocols',
            'It distributes client requests evenly across target healthy servers',
            'It decreases page load latency by caching database queries locally',
            'It limits CPU clock logs to prevent hardware overheat'
          ],
          correctIdx: 1
        }
      ];
    } else if (titleLower.includes('java') || titleLower.includes('spring')) {
      subject = 'Java & Enterprise Systems';
      questions = [
        {
          id: 'q1',
          question: 'What is the purpose of the Garbage Collector in Java?',
          options: [
            'To format code and remove unused imports dynamically',
            'To automatically reclaim memory occupied by objects that are no longer referenced',
            'To check for security vulnerability tags in dependencies',
            'To synchronize thread execution context across cores'
          ],
          correctIdx: 1
        },
        {
          id: 'q2',
          question: 'What is the primary feature of Spring Boot?',
          options: [
            'It compiles Java source files directly into machine instructions',
            'It provides starter templates and auto-configuration to bootstrap web servers quickly',
            'It proctors Socratic exams via websocket telemetry channels',
            'It implements zero-knowledge billing ledgers out-of-the-box'
          ],
          correctIdx: 1
        },
        {
          id: 'q3',
          question: 'What does the volatile keyword do in Java?',
          options: [
            'It indicates that a variable is stored on the GPU cache',
            'It forces threads to read and write the variable directly from main memory rather than cache',
            'It marks a method to be executed asynchronously on background pools',
            'It throws a compile-time exception if a reference is null'
          ],
          correctIdx: 1
        }
      ];
    }

    return NextResponse.json({ subject, questions });
  } catch (err: any) {
    console.error('Certificate verification API failed:', err);
    return NextResponse.json({ error: err.message || 'Verification failed.' }, { status: 500 });
  }
}
