import { NextRequest, NextResponse } from 'next/server';

// Global atomic round-robin counters for multi-key pool load balancing
let keyIndexA = 0;
let keyIndexB = 0;

const MENTOR_PERSONAS: Record<string, { name: string; prompt: string }> = {
  kashyap: {
    name: 'Mr. Kashyap',
    prompt: 'You are Mr. Kashyap, an aggressive Systems Architect. You demand deep technical detail, challenge assumptions, and focus on JVM models, lock contention, and operational bottlenecks.'
  },
  divya: {
    name: 'Ms. Divya',
    prompt: 'You are Ms. Divya, a proactive UI/UX Lead. You focus on user accessibility (WCAG), responsive frontend state management, design tokens, and user experience metrics.'
  },
  priya: {
    name: 'Ms. Priya',
    prompt: 'You are Ms. Priya, a reactive Agile Product Owner. You balance engineering proposals against sprint deadlines, delivery bounds, and product scope creep.'
  },
  maya: {
    name: 'Ms. Maya',
    prompt: 'You are Ms. Maya, a silent Cloud Security Architect. You offer sharp, brief warnings about AWS cloud budgets, security group isolation, VPC setup, and network ingress scaling.'
  },
  anish: {
    name: 'Mr. Anish',
    prompt: 'You are Mr. Anish, a proactive Career Mentor. You encourage structured milestones, team alignment, and clear execution roadmaps.'
  },
  karthic: {
    name: 'Mr. Karthic',
    prompt: 'You are Mr. Karthic, a proactive Backend Developer Lead. You suggest database indexing, clean REST APIs, SOLID design principles, and comprehensive unit tests.'
  },
  vikram: {
    name: 'Mr. Vikram',
    prompt: 'You are Mr. Vikram, an aggressive Engineering Director. You focus on return on investment (ROI), team bandwidth, scalability, and technical debt.'
  },
  shalini: {
    name: 'Ms. Shalini',
    prompt: 'You are Ms. Shalini, a reactive Talent Acquisition Lead. You focus on team chemistry, soft skills, communication clarity, and candidate behavior.'
  },
  aditya: {
    name: 'Mr. Aditya',
    prompt: 'You are Mr. Aditya, a proactive Systems Design Specialist. You push high-level scaling ideas: distributed cache sharding, CAP theorem trade-offs, and consensus protocols.'
  },
  neha: {
    name: 'Ms. Neha',
    prompt: 'You are Ms. Neha, an aggressive QA & Performance Engineer. You drill load testing, edge-case validations, chaos engineering, and CI/CD compiler gate checks.'
  },
  rajesh: {
    name: 'Mr. Rajesh',
    prompt: 'You are Mr. Rajesh, a reactive Senior Developer. You worry about library dependencies, refactoring overheads, legacy code constraints, and backward compatibility.'
  },
  abhijit: {
    name: 'Mr. Abhijit',
    prompt: 'You are Mr. Abhijit, a silent Product Executive. You care about conversion metrics, customer acquisition costs, runway, and budget constraints.'
  },
  sneha: {
    name: 'Ms. Sneha',
    prompt: 'You are Ms. Sneha, a proactive Senior Front-End Developer. You push clean React hooks, state management (Zustand), and visual consistency.'
  },
  rohan: {
    name: 'Mr. Rohan',
    prompt: 'You are Mr. Rohan, an aggressive Technical Lead. You strictly enforce design patterns (SOLID), clean code refactoring, and code smell elimination.'
  },
  aisha: {
    name: 'Ms. Aisha',
    prompt: 'You are Ms. Aisha, a structured & methodical Teacher. You focus on step-by-step logical frameworks and disciplined problem-solving.'
  }
};

function getActiveKeyForRole(roleType: string): string | null {
  const keysA = (process.env.GROQ_API_KEYS_A || process.env.GROQ_API_KEY_A || process.env.GROQ_API_KEY || '')
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 5 && !k.includes('placeholder'));

  const keysB = (process.env.GROQ_API_KEYS_B || process.env.GROQ_API_KEY_B || process.env.GROQ_API_KEY || '')
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 5 && !k.includes('placeholder'));

  if (roleType === 'avatar_a') {
    if (keysA.length === 0) return null;
    const selectedKey = keysA[keyIndexA % keysA.length];
    keyIndexA = (keyIndexA + 1) % 1000000;
    return selectedKey;
  } else {
    const targetPool = keysB.length > 0 ? keysB : keysA;
    if (targetPool.length === 0) return null;
    const selectedKey = targetPool[keyIndexB % targetPool.length];
    keyIndexB = (keyIndexB + 1) % 1000000;
    return selectedKey;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId,
      activeMentors,
      history,
      domain = 'technical',
      roleType = 'avatar_a',
      nextSpeakerName = 'the panel',
      candidateSilenced = false
    } = body;

    if (!activeMentors || activeMentors.length === 0) {
      return NextResponse.json({ reply: null, error: 'No active mentors specified' }, { status: 400 });
    }

    const mentorId = activeMentors[0];
    const mentorInfo = MENTOR_PERSONAS[mentorId] || {
      name: 'Boardroom Panelist',
      prompt: 'You are an experienced boardroom panelist.'
    };

    const lastMsg = history && history.length > 0 ? history[history.length - 1] : null;
    const speakerName = lastMsg ? (lastMsg.role === 'user' ? 'Candidate' : lastMsg.sender || 'the speaker') : 'Candidate';
    const topicTitle = roomId || 'this decision';

    // SPECIAL CANDIDATE CALL-OUT MODE (IF CANDIDATE DID NOT SPEAK)
    if (candidateSilenced) {
      const calloutText = `[${mentorInfo.name}]: Candidate, we are waiting for your pitch on ${topicTitle}. Please share your thoughts!`;
      return NextResponse.json({
        reply: calloutText,
        mentorId,
        mentorName: mentorInfo.name,
        roleType,
        providerUsed: 'CANDIDATE_CALLOUT'
      });
    }

    const activeGroqKey = getActiveKeyForRole(roleType);
    let replyText = '';
    let providerUsed = 'LOCAL_FALLBACK';

    if (activeGroqKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const promptText = roleType === 'avatar_a'
          ? `You are ${mentorInfo.name}. ${mentorInfo.prompt}. Acknowledge Candidate's point on "${topicTitle}", state your decision, and ask ${nextSpeakerName} for their take. STRICTLY under 14 words.`
          : `You are ${mentorInfo.name}. ${mentorInfo.prompt}. React to ${speakerName}'s stance with 1 real-world example, and ask Candidate how they handle it. STRICTLY under 14 words.`;

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeGroqKey}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: promptText },
              { role: 'user', content: `Topic: ${topicTitle}. Speaker: "${lastMsg?.content || 'I suggest clean architecture'}"` }
            ],
            max_tokens: 35,
            temperature: 0.6
          })
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const llmContent = data?.choices?.[0]?.message?.content?.trim();
          if (llmContent) {
            replyText = `[${mentorInfo.name}]: ${llmContent}`;
            providerUsed = `GROQ_KEY_${roleType.toUpperCase()}`;
          }
        }
      } catch {}
    }

    if (!replyText) {
      if (roleType === 'avatar_a') {
        const responsesA: Record<string, string[]> = {
          kashyap: [
            `[${mentorInfo.name}]: Fair point, Candidate. But locks will slow down memory under load. ${nextSpeakerName}, your view?`,
            `[${mentorInfo.name}]: I get Candidate's logic. Still, thread bottlenecks drop speed. ${nextSpeakerName}, what's your take?`
          ],
          divya: [
            `[${mentorInfo.name}]: Makes sense, Candidate. But we must keep screens fast first. ${nextSpeakerName}, do you agree?`,
            `[${mentorInfo.name}]: Good proposal by Candidate. Let's keep design tokens consistent. ${nextSpeakerName}, your view?`
          ],
          priya: [
            `[${mentorInfo.name}]: Good idea, Candidate. But we must ship this in a two-week sprint. ${nextSpeakerName}, your take?`,
            `[${mentorInfo.name}]: Candidate's point is solid. Let's keep scope tight to avoid delays. ${nextSpeakerName}, thoughts?`
          ],
          maya: [
            `[${mentorInfo.name}]: Good point, Candidate. But we must lock down cloud network access first. ${nextSpeakerName}, risks?`,
            `[${mentorInfo.name}]: Security comes first. We cannot leak user data across regions. ${nextSpeakerName}, your take?`
          ],
          anish: [
            `[${mentorInfo.name}]: Clear thinking by Candidate. Let's back this with team milestones. ${nextSpeakerName}, your thoughts?`,
            `[${mentorInfo.name}]: Great direction, Candidate. I align our sprint goals around this. ${nextSpeakerName}, support it?`
          ],
          karthic: [
            `[${mentorInfo.name}]: Solid backend pitch, Candidate. But database indexes come first. ${nextSpeakerName}, do you agree?`,
            `[${mentorInfo.name}]: Good approach, Candidate. I decide to break this into clean services. ${nextSpeakerName}, schema view?`
          ],
          vikram: [
            `[${mentorInfo.name}]: Pitch sounds okay, Candidate. But is ROI worth the engineering work? ${nextSpeakerName}, bandwidth?`,
            `[${mentorInfo.name}]: Candidate makes sense, but building this takes too much maintenance. ${nextSpeakerName}, cost view?`
          ],
          aditya: [
            `[${mentorInfo.name}]: Great vision, Candidate. To scale, we add Redis cache sharding now. ${nextSpeakerName}, consensus view?`,
            `[${mentorInfo.name}]: Good scaling goal, Candidate. Database replication prevents data loss. ${nextSpeakerName}, do you agree?`
          ],
          neha: [
            `[${mentorInfo.name}]: Clear idea, Candidate. But we need automated load tests first. ${nextSpeakerName}, what do you think?`,
            `[${mentorInfo.name}]: I hear Candidate. My stance is running failure testing early. ${nextSpeakerName}, your recovery plan?`
          ]
        };

        const options = responsesA[mentorId] || [
          `[${mentorInfo.name}]: Fair point, Candidate. Let's put clean safety checks in place. ${nextSpeakerName}, thoughts?`,
          `[${mentorInfo.name}]: I understand Candidate's logic. Let's proceed carefully on trade-offs. ${nextSpeakerName}, your evaluation?`
        ];

        replyText = options[Math.floor(Math.random() * options.length)];

      } else {
        const responsesB: Record<string, string[]> = {
          kashyap: [
            `[${mentorInfo.name}]: Without database indexes, traffic spikes crash the app instantly. Candidate, how will you fix this?`,
            `[${mentorInfo.name}]: Synchronized locks freeze server threads, causing four-second delays. Candidate, what is your concurrency fix?`
          ],
          divya: [
            `[${mentorInfo.name}]: Heavy page re-renders make mobile screens laggy and slow. Candidate, how will layout stay smooth?`,
            `[${mentorInfo.name}]: Instant UI rendering works, but weak connections leave blank screens. Candidate, how do you handle offline users?`
          ],
          priya: [
            `[${mentorInfo.name}]: Building custom infra delays our MVP shipping by two weeks. Candidate, how will you stay on schedule?`,
            `[${mentorInfo.name}]: Past scope creep pushed our deadline back twice already. Candidate, how do you keep ${topicTitle} on budget?`
          ],
          maya: [
            `[${mentorInfo.name}]: Open security settings expose customer data and trigger compliance fines. Candidate, how will you lock this down?`,
            `[${mentorInfo.name}]: Cloud replication without proper network setup spikes monthly costs heavily. Candidate, what is your cost fix?`
          ],
          anish: [
            `[${mentorInfo.name}]: Giving team members clear task ownership keeps development moving fast. Candidate, how will you lead execution?`,
            `[${mentorInfo.name}]: Assigning dedicated owners for schemas and UI components speeds shipping. Candidate, what are your next steps?`
          ],
          karthic: [
            `[${mentorInfo.name}]: Message queues stop server timeouts when traffic suddenly surges. Candidate, how will you handle heavy traffic?`,
            `[${mentorInfo.name}]: Clean REST contracts let us update databases without breaking clients. Candidate, how will you structure contracts?`
          ],
          vikram: [
            `[${mentorInfo.name}]: Rewriting working code wastes hundreds of hours of team time. Candidate, justify why we shouldn't simplify?`,
            `[${mentorInfo.name}]: Picking unproven tools triples onboarding time for new hires. Candidate, how do you protect against tech debt?`
          ],
          aditya: [
            `[${mentorInfo.name}]: Network drops between servers cause duplicate database entries. Candidate, how will your system handle server disconnects?`,
            `[${mentorInfo.name}]: Fast caches prevent database lag, but expired cache keys crash servers. Candidate, what is your cache eviction plan?`
          ],
          neha: [
            `[${mentorInfo.name}]: Database lag over half a second triggers customer error popups. Candidate, what circuit breaker will you add?`,
            `[${mentorInfo.name}]: Without automated build checks, broken code slips into production easily. Candidate, how will you automate build testing?`
          ]
        };

        const options = responsesB[mentorId] || [
          `[${mentorInfo.name}]: This works normally, but high traffic overloads system memory. Candidate, how will you handle edge cases?`,
          `[${mentorInfo.name}]: Unexpected errors in core services freeze downstream features. Candidate, what is your resolution to system risk?`
        ];

        replyText = options[Math.floor(Math.random() * options.length)];
      }
    }

    return NextResponse.json({
      reply: replyText,
      mentorId,
      mentorName: mentorInfo.name,
      roleType,
      providerUsed
    });

  } catch (err: any) {
    console.error('[API GD Bot Reply Error]:', err);
    return NextResponse.json({ error: 'Failed to generate boardroom reply', details: err.message }, { status: 500 });
  }
}
