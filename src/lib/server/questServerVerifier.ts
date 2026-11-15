import { runJsInSandbox } from './jsSandbox';
import { runPythonInPyodideFallback, runPythonInSandbox } from './pythonSandbox';

export interface VerifiableQuest {
  id: string;
  title?: string;
  language?: string;
  starterCode?: string;
  testSuite?: string;
}

export interface ServerVerificationOutcome {
  ok: boolean;
  status: number;
  error?: string;
  message: string;
  verificationMode: string;
  stdout?: string;
  stderr?: string;
}

function normalizeCodeForCompare(src: string): string {
  return src.replace(/\s+/g, ' ').trim();
}

function hasJsTestMarkers(testSuite: string): boolean {
  return /\bthrow\s+new\s+Error\b|\btypeof\s+[a-zA-Z_$]/.test(testSuite) || testSuite.includes('===');
}

function resolveAuthoritativeLanguage(quest: VerifiableQuest): string {
  const raw = (quest.language || '').trim().toLowerCase();
  if (raw === 'js') return 'javascript';
  if (raw === 'ts') return 'typescript';
  if (raw === 'py') return 'python';
  if (raw === 'sh' || raw === 'shell') return 'bash';
  if (raw) return raw;

  const starter = quest.starterCode || '';
  const tests = quest.testSuite || '';
  if (/\bpublic\s+class\s+\w+/.test(starter) || /\bpublic\s+class\s+Test\b/.test(tests)) return 'java';
  if (/(^|\n)\s*def\s+[a-zA-Z_]\w*\s*\(/.test(starter) || (!hasJsTestMarkers(tests) && /(^|\n)\s*assert\s+/.test(tests))) {
    return 'python';
  }
  if (/:\s*(string|number|boolean|Record<|Array<)/.test(starter) || /\binterface\s+\w+/.test(starter)) {
    return 'typescript';
  }
  if (/^\s*<[a-zA-Z!]/.test(starter)) return 'html';
  if (hasJsTestMarkers(tests)) return 'javascript';
  return 'unknown';
}

/**
 * [FIX-STAGE: wave1c-quests-verify-hardening]
 * Server-authoritative verifier for POST /api/quests/verify.
 * Rejects empty/unmodified starter code and runs real sandbox verification for JS/TS/TSX/Python quests.
 */
export async function verifyQuestSubmissionServerSide(
  quest: VerifiableQuest,
  code: string
): Promise<ServerVerificationOutcome> {
  const trimmed = typeof code === 'string' ? code.trim() : '';
  if (!trimmed) {
    console.warn(`[PinIT][Fix:QuestsVerify] Empty code submission rejected for quest=${quest.id}`);
    return {
      ok: false,
      status: 400,
      error: 'EMPTY_CODE',
      message: 'Code submission cannot be empty.',
      verificationMode: 'rejected-empty',
    };
  }

  if (trimmed.length > 65536) {
    console.warn(`[PinIT][Fix:QuestsVerify] Oversized submission (${trimmed.length} chars) rejected for quest=${quest.id}`);
    return {
      ok: false,
      status: 413,
      error: 'PAYLOAD_TOO_LARGE',
      message: 'Code submission exceeds the 64KB maximum limit.',
      verificationMode: 'rejected-size',
    };
  }

  // Prevent unedited starter code from earning XP/Pins when quest defines a verification suite
  if (quest.testSuite?.trim() && quest.starterCode?.trim()) {
    if (normalizeCodeForCompare(trimmed) === normalizeCodeForCompare(quest.starterCode)) {
      console.warn(`[PinIT][Fix:QuestsVerify] Unmodified starter code rejected for quest=${quest.id}`);
      return {
        ok: false,
        status: 400,
        error: 'STARTER_CODE_UNCHANGED',
        message: 'Starter code is unchanged. Implement your solution before verifying.',
        verificationMode: 'rejected-starter',
      };
    }
  }

  const tests = (quest.testSuite || '').trim();
  const lang = resolveAuthoritativeLanguage(quest);

  if (!tests) {
    console.log(`[PinIT][Fix:QuestsVerify] No coding testSuite for quest=${quest.id} (lang=${lang}); verified non-empty submission`);
    return {
      ok: true,
      status: 200,
      message: 'Verification Passed! Non-empty submission accepted.',
      verificationMode: 'non-coding-or-open-quest',
    };
  }

  // Execute JavaScript / TypeScript / TSX submissions in isolated worker sandbox
  if (lang === 'javascript' || lang === 'typescript' || lang === 'tsx') {
    const res = await runJsInSandbox({
      code,
      tests,
      language: lang,
      timeoutMs: 3500,
    });

    if (!res.passed) {
      console.warn(
        `[PinIT][Fix:QuestsVerify] JS/TS judge FAILED quest=${quest.id} lang=${lang} status=${res.status}: ${res.error || res.stderr}`
      );
      return {
        ok: false,
        status: 422,
        error: res.status || 'VERIFICATION_FAILED',
        message: res.error || res.stderr || 'Submission failed test assertions.',
        verificationMode: `server-${lang}-sandbox`,
        stdout: res.stdout,
        stderr: res.stderr,
      };
    }

    console.log(`[PinIT][Fix:QuestsVerify] JS/TS judge PASSED quest=${quest.id} lang=${lang}`);
    return {
      ok: true,
      status: 200,
      message: 'Verification Passed! Validated by authoritative server sandbox.',
      verificationMode: `server-${lang}-sandbox`,
      stdout: res.stdout,
    };
  }

  // Execute Python submissions in isolated Python process sandbox, falling back to server Pyodide WASM if native Python is absent.
  // Never auto-pass when tests contain JS markers or when runtimes are unavailable (fail-closed).
  if (lang === 'python') {
    if (hasJsTestMarkers(tests)) {
      console.error(
        `[PinIT][Fix:QuestsVerify] Invalid JS test markers in Python quest=${quest.id}; failing closed`
      );
      return {
        ok: false,
        status: 500,
        error: 'INVALID_PYTHON_TEST_SUITE',
        message: 'Verification harness contains non-Python syntax and cannot validate this submission.',
        verificationMode: 'rejected-invalid-python-suite',
      };
    }

    let pyRes = await runPythonInSandbox({
      code,
      tests,
      timeoutMs: 4500,
    });
    let mode = 'server-python-sandbox';

    if (pyRes.status === 'ENVIRONMENT_ERROR') {
      console.warn(
        `[PinIT][Fix:QuestsVerify] Native Python binary unavailable for quest=${quest.id}; running server Pyodide fallback`
      );
      pyRes = await runPythonInPyodideFallback({
        code,
        tests,
        timeoutMs: 4500,
      });
      mode = 'server-pyodide-sandbox';

      if (pyRes.status === 'ENVIRONMENT_ERROR') {
        console.error(
          `[PinIT][Fix:QuestsVerify] Both native Python and Pyodide unavailable for quest=${quest.id}: ${pyRes.stderr}`
        );
        return {
          ok: false,
          status: 503,
          error: 'PYTHON_SANDBOX_UNAVAILABLE',
          message: 'Server Python runtime is temporarily unavailable. Please retry in a moment.',
          verificationMode: 'server-python-unavailable',
          stderr: pyRes.stderr,
        };
      }
    }

    if (!pyRes.passed) {
      console.warn(
        `[PinIT][Fix:QuestsVerify] Python judge FAILED quest=${quest.id} mode=${mode} status=${pyRes.status}: ${pyRes.stderr}`
      );
      return {
        ok: false,
        status: 422,
        error: pyRes.status || 'VERIFICATION_FAILED',
        message: pyRes.stderr || 'Python submission failed assertion checks.',
        verificationMode: mode,
        stdout: pyRes.stdout,
        stderr: pyRes.stderr,
      };
    }

    console.log(`[PinIT][Fix:QuestsVerify] Python judge PASSED quest=${quest.id} mode=${mode}`);
    return {
      ok: true,
      status: 200,
      message: 'Verification Passed! Validated by authoritative Python sandbox.',
      verificationMode: mode,
      stdout: pyRes.stdout,
    };
  }

  console.log(`[PinIT][Fix:QuestsVerify] Accepted non-JS/Python quest=${quest.id} lang=${lang} after non-starter validation`);
  return {
    ok: true,
    status: 200,
    message: `Verification Passed! Non-empty ${lang} solution validated.`,
    verificationMode: `verified-${lang}-non-starter`,
  };
}
