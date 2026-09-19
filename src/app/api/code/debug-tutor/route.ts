import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { TEACHERS, Teacher } from '@/components/quests/workspace/useWorkspaceState';

interface DebugTutorRequest {
  code?: string;
  language?: string;
  output?: { success?: boolean; message?: string } | null;
  terminalLogs?: string[];
  questTitle?: string;
  teacherId?: string;
}

function generateLocalSocraticHint(
  code: string,
  language: string,
  errorMsg: string,
  teacherName: string,
  teacherEmoji: string,
  questTitle: string
): string {
  const err = (errorMsg || '').toLowerCase();
  const c = code || '';
  let hint = '';

  if (language === 'python' || language === 'py') {
    if (err.includes('indentationerror')) {
      hint = "Notice Python's indentation rules: ensure consistent 4-space indentation inside your function blocks and control structures.";
    } else if (err.includes('nameerror')) {
      const match = errorMsg.match(/name '(\w+)' is not defined/i);
      hint = match
        ? `Variable '${match[1]}' is being referenced before assignment. Check spelling or ensure it is initialized before use.`
        : "You are referencing a variable or function that hasn't been defined in scope yet.";
    } else if (err.includes('indexerror') || err.includes('out of range')) {
      hint = "An index is exceeding the bounds of your list. Remember Python lists are 0-indexed; check if your range reaches `len(arr)` instead of `len(arr) - 1`.";
    } else if (err.includes('typeerror')) {
      hint = "There is an operation between incompatible types (e.g. adding a string to an int, or calling a non-callable). Check argument types.";
    } else if (err.includes('timeout') || err.includes('execution timed out')) {
      hint = "Your code exceeded the execution time limit. Check your loop termination conditions — ensure loop variables are being updated on every iteration.";
    } else if (!c.includes('return')) {
      hint = "Your function doesn't appear to have a `return` statement. Make sure your function returns the computed result rather than just printing it.";
    } else {
      hint = `Consider your algorithmic edge cases for "${questTitle}". Trace your function with the simplest possible input (e.g. empty list or 0) on paper.`;
    }
  } else if (language === 'sql') {
    if (!c.toUpperCase().includes('SELECT')) {
      hint = "Every query in this quest requires a valid `SELECT` statement. Verify your query starts with the projection columns.";
    } else if (err.includes('no such table') || err.includes('table not found')) {
      hint = "A table referenced in your `FROM` or `JOIN` clause does not exist in the schema. Check table spelling in the quest description.";
    } else if (err.includes('no such column') || err.includes('column not found')) {
      hint = "One of your projected columns does not exist in the referenced table. Verify column names in the schema definitions.";
    } else if (err.includes('syntax error')) {
      hint = "SQL syntax error detected: check for missing commas between SELECT columns or mismatched parentheses in subqueries.";
    } else {
      hint = "Verify your `JOIN` and `WHERE` conditions. Ensure joining keys match between both relational tables.";
    }
  } else if (language === 'javascript' || language === 'js') {
    if (err.includes('cannot read propert') || err.includes('null') || err.includes('undefined')) {
      hint = "You are attempting to access a property on an `undefined` or `null` reference. Add optional chaining (`?.`) or a guard check.";
    } else if (err.includes('is not a function')) {
      hint = "A variable is being invoked as a function, but contains a different type. Verify what value is stored in that variable.";
    } else if (err.includes('referenceerror')) {
      hint = "ReferenceError: Check variable declaration keywords (`const`, `let`) and confirm variables are declared before reference.";
    } else if (!c.includes('return')) {
      hint = "The function did not return a value. Ensure you explicitly `return` the answer.";
    } else {
      hint = `Check logic branch conditions. Trace with test cases to confirm each condition handles boundaries properly.`;
    }
  } else {
    // Java or generic
    if (err.includes('cannot find symbol')) {
      hint = "The compiler cannot find a symbol (variable or method). Check spelling, case sensitivity, or method argument signatures.";
    } else if (err.includes('incompatible types')) {
      hint = "Type mismatch: verify that the returned value matches the method signature's return type.";
    } else if (err.includes('arrayindexoutofboundsexception')) {
      hint = "Array index is out of bounds. Verify that `i < array.length` rather than `i <= array.length`.";
    } else {
      hint = `Review the problem invariants for "${questTitle}". Check input constraints and expected return formats.`;
    }
  }

  return `🤖 ${teacherName} (${teacherEmoji}) Socratic Debug Hint:\n\n"I analyzed your code execution logic for ${questTitle}.\n\nCompiler / Test Diagnostic: '${errorMsg || 'Test assertion mismatch'}'.\n\n💡 Guidance: ${hint}"`;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`debug_tutor_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many tutor requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const authCheck = await requireUserFromRequest(req);
    if (authCheck.error) return authCheck.error;

    const body: DebugTutorRequest = await req.json().catch(() => ({}));
    const {
      code = '',
      language = 'python',
      output = null,
      terminalLogs = [],
      questTitle = 'Coding Challenge',
      teacherId = 'kashyap',
    } = body;

    const teacher = TEACHERS.find((t: Teacher) => t.id === teacherId) || TEACHERS[0];
    const errorMsg = output?.message || (terminalLogs.length > 0 ? terminalLogs[terminalLogs.length - 1] : '');

    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    if (process.env.GROQ_API_KEY && !groqKeys.includes(process.env.GROQ_API_KEY)) {
      groqKeys.push(process.env.GROQ_API_KEY);
    }

    if (groqKeys.length > 0 && code.trim()) {
      for (const key of groqKeys) {
        try {
          const prompt = `You are ${teacher.name} (${(teacher.nature || 'Lead Instructor')}), an expert computer science teacher at PinIT Career OS.
The student is solving the coding quest: "${questTitle}" in ${language}.
STUDENT'S SUBMITTED CODE:
\`\`\`${language}
${code.slice(0, 2000)}
\`\`\`

EXECUTION / COMPILER OUTPUT:
${errorMsg || 'Tests failed or assertions did not match expected output.'}

RECENT TERMINAL LOGS:
${terminalLogs.slice(-5).join('\n')}

INSTRUCTIONS:
1. Provide a Socratic, targeted debug hint in 2-3 sentences.
2. DO NOT write the complete solution code.
3. Identify the conceptual, syntax, or boundary flaw (e.g. off-by-one, type coercion, missing return, mutable default) and guide the student to solve it themselves.
4. Maintain ${teacher.name}'s warm, encouraging tone.`;

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: `You are ${teacher.name}, a master CS tutor. Give concise Socratic hints.` },
                { role: 'user', content: prompt }
              ],
              temperature: 0.5,
              max_tokens: 250,
            }),
            signal: AbortSignal.timeout(4000),
          });

          if (res.ok) {
            const data = await res.json();
            const reply = (data.choices?.[0]?.message?.content || '').trim();
            if (reply) {
              return NextResponse.json({
                success: true,
                source: 'llm',
                hint: `🤖 ${teacher.name} (${teacher.emoji}) Socratic Debug Hint:\n\n${reply}`,
              });
            }
          }
        } catch {
          // Fall through to intelligent local analyzer
        }
      }
    }

    // Intelligent local fallback analyzer
    const localHint = generateLocalSocraticHint(
      code,
      language,
      errorMsg,
      teacher.name,
      teacher.emoji,
      questTitle
    );

    return NextResponse.json({
      success: true,
      source: 'heuristic_analyzer',
      hint: localHint,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'DEBUG_TUTOR_ERROR', message: err?.message || 'Failed to generate tutor hint' },
      { status: 500 }
    );
  }
}
