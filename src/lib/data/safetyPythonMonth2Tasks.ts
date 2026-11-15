import { buildEnrichedDayQuests, type DayConfig } from './curriculumEnricher';
import type { CourseQuest } from './coursesData';
import { MONTH2_LESSON_INDEX } from './month2LessonIndex';

interface RawM2DayTask {
  day: number;
  fallbackTitle: string;
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

const RAW_M2_DAY_TASKS: RawM2DayTask[] = [
  {
    "day": 31,
    "fallbackTitle": "OWASP LLM Top 10 Threat Matrix & Quantitative AI Risk Register Scoring",
    "eTitle": "OWASP LLM Threat Risk-Register Severity & Priority Scorer",
    "eDesc": "Write `score_ai_risk_register(threats: list[dict], block_thresh: int = 12) -> list[dict]`: each item has `id`, `likelihood` (1..5), `impact` (1..5), `control_factor` (0.0..1.0 mitigation). Compute `residual = round(likelihood * impact * (1.0 - control_factor), 2)`, label `\"blocker\"` if `residual >= block_thresh` else `\"monitor\"`, sorted by `(-residual, id)`.",
    "eStarter": "def score_ai_risk_register(threats: list[dict], block_thresh: int = 12) -> list[dict]:\n    # TODO\n    pass",
    "eHint": "def score_ai_risk_register(threats: list[dict], block_thresh: int = 12) -> list[dict]:\n    out = []\n    for t in threats:\n        res = round(t[\"likelihood\"] * t[\"impact\"] * (1.0 - t[\"control_factor\"]), 2)\n        out.append({\"id\": t[\"id\"], \"residual\": res, \"status\": \"blocker\" if res >= block_thresh else \"monitor\"})\n    return sorted(out, key=lambda x: (-x[\"residual\"], x[\"id\"]))",
    "eTest": "ts = [{\"id\": \"LLM01\", \"likelihood\": 5, \"impact\": 5, \"control_factor\": 0.2}, {\"id\": \"LLM06\", \"likelihood\": 4, \"impact\": 3, \"control_factor\": 0.5}]\nr = score_ai_risk_register(ts, 12)\nassert r == [{\"id\": \"LLM01\", \"residual\": 20.0, \"status\": \"blocker\"}, {\"id\": \"LLM06\", \"residual\": 6.0, \"status\": \"monitor\"}]\nassert score_ai_risk_register([], 12) == []\nassert score_ai_risk_register([{\"id\": \"X\", \"likelihood\": 3, \"impact\": 4, \"control_factor\": 0.0}], 12)[0][\"status\"] == \"blocker\"\nprint('All checks passed.')",
    "aTitle": "Supply-Chain Trustworthiness Verifier for External Plugins & Model Checkpoints",
    "aDesc": "Write `verify_model_artifact(manifest: dict, actual_sha256: str, trusted_orgs: set[str], allowed_formats: set[str]) -> tuple[bool, str]`: reject unknown signer (`\"untrusted_org\"`), unsafe format such as legacy binary (`\"unsafe_format\"`), or hash mismatch (`\"hash_mismatch\"`), else `(True, \"verified\")`.",
    "aStarter": "def verify_model_artifact(manifest: dict, actual_sha256: str, trusted_orgs: set[str], allowed_formats: set[str]) -> tuple[bool, str]:\n    # TODO\n    pass",
    "aHint": "def verify_model_artifact(manifest: dict, actual_sha256: str, trusted_orgs: set[str], allowed_formats: set[str]) -> tuple[bool, str]:\n    if manifest.get(\"org\") not in trusted_orgs:\n        return False, \"untrusted_org\"\n    if manifest.get(\"format\") not in allowed_formats:\n        return False, \"unsafe_format\"\n    if manifest.get(\"sha256\") != actual_sha256:\n        return False, \"hash_mismatch\"\n    return True, \"verified\"",
    "aTest": "m = {\"org\": \"google\", \"format\": \"safetensors\", \"sha256\": \"abc\"}\nassert verify_model_artifact(m, \"abc\", {\"google\"}, {\"safetensors\"}) == (True, \"verified\")\nassert verify_model_artifact({**m, \"format\": \"pkl\"}, \"abc\", {\"google\"}, {\"safetensors\"}) == (False, \"unsafe_format\")\nassert verify_model_artifact(m, \"xyz\", {\"google\"}, {\"safetensors\"}) == (False, \"hash_mismatch\")\nprint('All checks passed.')"
  },
  {
    "day": 32,
    "fallbackTitle": "Input Guardrails: Token Length Bounds, Unicode Homoglyph Normalization & Control-Char Stripping",
    "eTitle": "NFKC Unicode Confusable Normalizer & Zero-Width Smuggling Stripper",
    "eDesc": "Write `sanitize_user_prompt(text: str, max_chars: int = 2000) -> dict`: apply `unicodedata.normalize(\"NFKC\", text)`, strip zero-width / C0 format controls (`unicodedata.category(c) in {\"Cf\", \"Cc\"}` except `\\n` and `\\t`), and report `{\"clean_text\": s[:max_chars], \"stripped_chars\": int, \"truncated\": bool}`.",
    "eStarter": "import unicodedata\n\ndef sanitize_user_prompt(text: str, max_chars: int = 2000) -> dict:\n    # TODO\n    pass",
    "eHint": "import unicodedata\n\ndef sanitize_user_prompt(text: str, max_chars: int = 2000) -> dict:\n    norm = unicodedata.normalize(\"NFKC\", text)\n    kept = [c for c in norm if not (unicodedata.category(c) in {\"Cf\", \"Cc\"} and c not in (\"\\n\", \"\\t\"))]\n    stripped = len(norm) - len(kept)\n    joined = \"\".join(kept)\n    return {\"clean_text\": joined[:max_chars], \"stripped_chars\": stripped, \"truncated\": len(joined) > max_chars}",
    "eTest": "r = sanitize_user_prompt(\"ig\\u200bnore\\x00 rules\", 100)\nassert r == {\"clean_text\": \"ignore rules\", \"stripped_chars\": 2, \"truncated\": False}\nassert sanitize_user_prompt(\"abcdef\", 3)[\"truncated\"] is True\nassert sanitize_user_prompt(\"hello\\nworld\", 50)[\"clean_text\"] == \"hello\\nworld\"\nprint('All checks passed.')",
    "aTitle": "Confusable Homoglyph Canonicalizer for Safety Keyword Scanning",
    "aDesc": "Write `canonicalize_homoglyphs(text: str, mapping: dict[str, str]) -> str`: replace every mapped Cyrillic/Greek lookalike codepoint with its ASCII equivalent, NFKC-normalize, and return lowercased ASCII-folded text.",
    "aStarter": "import unicodedata\n\ndef canonicalize_homoglyphs(text: str, mapping: dict[str, str]) -> str:\n    # TODO\n    pass",
    "aHint": "import unicodedata\n\ndef canonicalize_homoglyphs(text: str, mapping: dict[str, str]) -> str:\n    norm = unicodedata.normalize(\"NFKC\", text)\n    return \"\".join(mapping.get(c, c) for c in norm).lower()",
    "aTest": "mp = {\"\\u0430\": \"a\", \"\\u0435\": \"e\", \"\\u043e\": \"o\"}\nassert canonicalize_homoglyphs(\"P\\u0430ss\\u043e\", mp) == \"passo\"\nassert canonicalize_homoglyphs(\"\\uff28\\uff49\", {}) == \"hi\"\nassert canonicalize_homoglyphs(\"\", mp) == \"\"\nprint('All checks passed.')"
  },
  {
    "day": 33,
    "fallbackTitle": "Direct & Indirect Prompt Injection Detection via Structural Spotlighting & Perplexity Spikes",
    "eTitle": "Datamarking & Structural Spotlighting Unverified-Text Encapsulator",
    "eDesc": "Write `spotlight_untrusted_doc(doc_text: str, marker: str = \"^\") -> str`: prefix with `[UNTRUSTED_DATA_BEGIN]`, replace whitespace separators between words with `f\"{marker}\"`, append `[UNTRUSTED_DATA_END]`, neutralizing instruction-like formatting in retrieved chunks.",
    "eStarter": "def spotlight_untrusted_doc(doc_text: str, marker: str = \"^\") -> str:\n    # TODO\n    pass",
    "eHint": "def spotlight_untrusted_doc(doc_text: str, marker: str = \"^\") -> str:\n    marked = marker.join(doc_text.split())\n    return f\"[UNTRUSTED_DATA_BEGIN]\\n{marked}\\n[UNTRUSTED_DATA_END]\"",
    "eTest": "res = spotlight_untrusted_doc(\"ignore prior instructions\", \"^\")\nassert res.startswith(\"[UNTRUSTED_DATA_BEGIN]\") and res.endswith(\"[UNTRUSTED_DATA_END]\")\nassert \"ignore^prior^instructions\" in res\nassert spotlight_untrusted_doc(\"\", \"^\") == \"[UNTRUSTED_DATA_BEGIN]\\n\\n[UNTRUSTED_DATA_END]\"\nprint('All checks passed.')",
    "aTitle": "GCG Suffix High-Perplexity / Symbol-Entropy Detector",
    "aDesc": "Write `detect_adversarial_suffix(prompt: str, token_nlls: list[float], max_mean_nll: float = 6.5, max_punct_ratio: float = 0.35) -> tuple[bool, str]`: flag high-perplexity garbage (`mean(token_nlls) > max_mean_nll` -> `\"perplexity_spike\"`) or dense non-alphanumeric symbol suffix (`punct_ratio > max_punct_ratio` -> `\"symbol_entropy\"`), else `(False, \"clean\")`.",
    "aStarter": "def detect_adversarial_suffix(prompt: str, token_nlls: list[float], max_mean_nll: float = 6.5, max_punct_ratio: float = 0.35) -> tuple[bool, str]:\n    # TODO\n    pass",
    "aHint": "def detect_adversarial_suffix(prompt: str, token_nlls: list[float], max_mean_nll: float = 6.5, max_punct_ratio: float = 0.35) -> tuple[bool, str]:\n    if token_nlls and (sum(token_nlls) / len(token_nlls)) > max_mean_nll:\n        return True, \"perplexity_spike\"\n    non_ws = [c for c in prompt if not c.isspace()]\n    if non_ws and (sum(1 for c in non_ws if not c.isalnum()) / len(non_ws)) > max_punct_ratio:\n        return True, \"symbol_entropy\"\n    return False, \"clean\"",
    "aTest": "assert detect_adversarial_suffix(\"hello world\", [1.2, 2.0, 1.5]) == (False, \"clean\")\nassert detect_adversarial_suffix(\"describing.--!!??##$$\", [2.0]) == (True, \"symbol_entropy\")\nassert detect_adversarial_suffix(\"normal words\", [8.0, 9.0]) == (True, \"perplexity_spike\")\nprint('All checks passed.')"
  },
  {
    "day": 34,
    "fallbackTitle": "Instruction Hierarchy Enforcement: System vs Developer vs User vs Untrusted Data Privilege",
    "eTitle": "Wallace Instruction-Hierarchy Precedence Resolver",
    "eDesc": "Write `resolve_policy_conflict(directives: list[dict]) -> dict[str, dict]`: process `{key, value, role}` where precedence is `system(4) > developer(3) > user(2) > tool_data(1)`. Higher role strictly wins; equal roles follow latest occurrence. Return `{key: winning_directive}`.",
    "eStarter": "def resolve_policy_conflict(directives: list[dict]) -> dict[str, dict]:\n    # TODO\n    pass",
    "eHint": "def resolve_policy_conflict(directives: list[dict]) -> dict[str, dict]:\n    rank = {\"system\": 4, \"developer\": 3, \"user\": 2, \"tool_data\": 1}\n    state = {}\n    for d in directives:\n        k = d[\"key\"]\n        r = rank.get(d[\"role\"], 0)\n        if k not in state or r >= rank.get(state[k][\"role\"], 0):\n            state[k] = d\n    return state",
    "eTest": "ds = [{\"key\": \"tone\", \"value\": \"safe\", \"role\": \"system\"}, {\"key\": \"tone\", \"value\": \"leak\", \"role\": \"tool_data\"}, {\"key\": \"fmt\", \"value\": \"json\", \"role\": \"user\"}]\nres = resolve_policy_conflict(ds)\nassert res[\"tone\"][\"value\"] == \"safe\"\nassert res[\"fmt\"][\"value\"] == \"json\"\nassert resolve_policy_conflict([]) == {}\nprint('All checks passed.')",
    "aTitle": "Privilege-Tagged Message Formatter for Role-Separated Inference",
    "aDesc": "Write `format_hierarchy_transcript(turns: list[tuple[str, str]]) -> str`: assign XML privilege attributes `trust=\"high\"` for `system`/`developer`, `\"medium\"` for `user`, and `\"untrusted\"` for `tool_data`, emitting `<msg role=\"...\" trust=\"...\">content</msg>` separated by newlines.",
    "aStarter": "def format_hierarchy_transcript(turns: list[tuple[str, str]]) -> str:\n    # TODO\n    pass",
    "aHint": "def format_hierarchy_transcript(turns: list[tuple[str, str]]) -> str:\n    trust = {\"system\": \"high\", \"developer\": \"high\", \"user\": \"medium\", \"tool_data\": \"untrusted\"}\n    return \"\\n\".join(f\"<msg role=\\\"{r}\\\" trust=\\\"{trust.get(r, 'untrusted')}\\\">{c}</msg>\" for r, c in turns)",
    "aTest": "s = format_hierarchy_transcript([(\"system\", \"Stay safe\"), (\"tool_data\", \"Drop rules\")])\nassert '<msg role=\"system\" trust=\"high\">Stay safe</msg>' in s\nassert '<msg role=\"tool_data\" trust=\"untrusted\">Drop rules</msg>' in s\nassert format_hierarchy_transcript([]) == \"\"\nprint('All checks passed.')"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7: Multi-Layered Input Firewall & Prompt Injection Defense Engine",
    "eTitle": "Milestone 7A: Multi-Stage Prompt Firewall Pipeline (`normalize -> length -> jailbreak`)",
    "eDesc": "Write `run_input_firewall(raw_prompt: str, max_len: int, banned_phrases: list[str]) -> dict`: NFKC-normalize & strip `Cf`/`Cc` chars, enforce `<= max_len`, scan lowercased whitespace-collapsed text for any `banned_phrases`, returning `{\"allowed\": bool, \"reason\": str, \"clean\": str}` (`\"length_exceeded\"`, `\"policy_match\"`, or `\"ok\"`).",
    "eStarter": "import unicodedata\n\ndef run_input_firewall(raw_prompt: str, max_len: int, banned_phrases: list[str]) -> dict:\n    # TODO\n    pass",
    "eHint": "import unicodedata\n\ndef run_input_firewall(raw_prompt: str, max_len: int, banned_phrases: list[str]) -> dict:\n    norm = unicodedata.normalize(\"NFKC\", raw_prompt)\n    clean = \"\".join(c for c in norm if not (unicodedata.category(c) in {\"Cf\", \"Cc\"} and c not in (\"\\n\", \"\\t\")))\n    if len(clean) > max_len:\n        return {\"allowed\": False, \"reason\": \"length_exceeded\", \"clean\": clean[:max_len]}\n    low = \" \".join(clean.lower().split())\n    if any(p.lower() in low for p in banned_phrases):\n        return {\"allowed\": False, \"reason\": \"policy_match\", \"clean\": clean}\n    return {\"allowed\": True, \"reason\": \"ok\", \"clean\": clean}",
    "eTest": "assert run_input_firewall(\"ig\\u200bnore  all\", 100, [\"ignore all\"])[\"reason\"] == \"policy_match\"\nassert run_input_firewall(\"hi there\", 100, [\"ignore all\"]) == {\"allowed\": True, \"reason\": \"ok\", \"clean\": \"hi there\"}\nassert run_input_firewall(\"a\" * 20, 5, [])[\"reason\"] == \"length_exceeded\"\nprint('All checks passed.')",
    "aTitle": "Milestone 7B: Dual-LLM Quarantine Summarizer Privilege Isolation Guard",
    "aDesc": "Write `quarantine_tool_gate(planner_requested_tool: str, planner_args: dict, taint_source: str, mutating_tools: set[str]) -> tuple[bool, str]`: enforce CaMeL/Dual-LLM invariant — if `taint_source == \"untrusted_rag\"` and `planner_requested_tool in mutating_tools`, block (`\"tainted_mutation_blocked\"`), else allow `(True, \"approved\")`.",
    "aStarter": "def quarantine_tool_gate(planner_requested_tool: str, planner_args: dict, taint_source: str, mutating_tools: set[str]) -> tuple[bool, str]:\n    # TODO\n    pass",
    "aHint": "def quarantine_tool_gate(planner_requested_tool: str, planner_args: dict, taint_source: str, mutating_tools: set[str]) -> tuple[bool, str]:\n    if taint_source == \"untrusted_rag\" and planner_requested_tool in mutating_tools:\n        return False, \"tainted_mutation_blocked\"\n    return True, \"approved\"",
    "aTest": "assert quarantine_tool_gate(\"send_email\", {\"to\": \"evil\"}, \"untrusted_rag\", {\"send_email\"}) == (False, \"tainted_mutation_blocked\")\nassert quarantine_tool_gate(\"read_doc\", {\"id\": \"1\"}, \"untrusted_rag\", {\"send_email\"}) == (True, \"approved\")\nassert quarantine_tool_gate(\"send_email\", {\"to\": \"me\"}, \"user_verified\", {\"send_email\"}) == (True, \"approved\")\nprint('All checks passed.')"
  },
  {
    "day": 36,
    "fallbackTitle": "Deterministic PII Detection, Format-Preserving Pseudonymization & Vault Detokenization",
    "eTitle": "Reversible PII Pseudonymization & Vault Detokenizer (`[EMAIL_1]`, `[PHONE_1]`)",
    "eDesc": "Implement `PIIVault`: `redact(text: str) -> str` replaces emails (`[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+`) and 10-digit phones (`\\b\\d{3}-\\d{3}-\\d{4}\\b`) deterministically with `[PII_EMAIL_1]`, `[PII_PHONE_1]` tokens stored in vault, and `restore(masked: str) -> str` reverses exact placeholders.",
    "eStarter": "import re\n\nclass PIIVault:\n    def __init__(self):\n        # TODO\n        pass\n\n    def redact(self, text: str) -> str:\n        # TODO\n        pass\n\n    def restore(self, masked: str) -> str:\n        # TODO\n        pass",
    "eHint": "import re\n\nclass PIIVault:\n    def __init__(self):\n        self.v2t = {}\n        self.t2v = {}\n        self.counts = {\"EMAIL\": 0, \"PHONE\": 0}\n\n    def _tok(self, kind, val):\n        if val not in self.v2t:\n            self.counts[kind] += 1\n            tok = f\"[PII_{kind}_{self.counts[kind]}]\"\n            self.v2t[val] = tok\n            self.t2v[tok] = val\n        return self.v2t[val]\n\n    def redact(self, text: str) -> str:\n        t = re.sub(r\"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+\", lambda m: self._tok(\"EMAIL\", m.group(0)), text)\n        return re.sub(r\"\\b\\d{3}-\\d{3}-\\d{4}\\b\", lambda m: self._tok(\"PHONE\", m.group(0)), t)\n\n    def restore(self, masked: str) -> str:\n        out = masked\n        for tok, val in self.t2v.items():\n            out = out.replace(tok, val)\n        return out",
    "eTest": "v = PIIVault()\nm = v.redact(\"Mail alice@corp.io or call 415-555-0100\")\nassert m == \"Mail [PII_EMAIL_1] or call [PII_PHONE_1]\"\nassert v.restore(m) == \"Mail alice@corp.io or call 415-555-0100\"\nassert v.redact(\"no pii\") == \"no pii\"\nprint('All checks passed.')",
    "aTitle": "Luhn Credit-Card False-Positive Filter for Financial PII Scanners",
    "aDesc": "Write `extract_luhn_cards(text: str) -> list[str]`: match 13–19 digit sequences (stripping `-`/` ` inside candidate sequences `\\b(?:\\d[ -]?){12,18}\\d\\b`), keep strictly those passing Mod-10 Luhn checksum, returning normalized digit strings.",
    "aStarter": "import re\n\ndef extract_luhn_cards(text: str) -> list[str]:\n    # TODO\n    pass",
    "aHint": "import re\n\ndef extract_luhn_cards(text: str) -> list[str]:\n    def luhn(s):\n        ds = [int(c) for c in s]\n        tot = 0\n        for i, d in enumerate(reversed(ds)):\n            if i % 2 == 1:\n                d = d * 2 - 9 if d * 2 > 9 else d * 2\n            tot += d\n        return tot % 10 == 0\n    out = []\n    for m in re.findall(r\"(?:\\d[ -]?){12,18}\\d\", text):\n        digits = re.sub(r\"\\D\", \"\", m)\n        if 13 <= len(digits) <= 19 and luhn(digits):\n            out.append(digits)\n    return out",
    "aTest": "assert extract_luhn_cards(\"Card 4532 0151 1283 0366 and fake 4532015112830367\") == [\"4532015112830366\"]\nassert extract_luhn_cards(\"Order 123456\") == []\nassert extract_luhn_cards(\"\") == []\nprint('All checks passed.')"
  },
  {
    "day": 37,
    "fallbackTitle": "Output Schema Validation, Repair Loops & Hallucinated URL/Citation Stripping",
    "eTitle": "Verified Citation & Allowed-Domain URL Grounding Filter",
    "eDesc": "Write `strip_hallucinated_citations(output: str, valid_doc_ids: set[str], allowed_domains: set[str]) -> dict`: extract all `[doc:ID]` tags and `https?://domain/...` URLs; remove/redact invalid `[doc:...]` tags into `[INVALID_REF]` and untrusted domains into `[UNVERIFIED_URL]`, reporting counts of removed refs & URLs.",
    "eStarter": "import re\n\ndef strip_hallucinated_citations(output: str, valid_doc_ids: set[str], allowed_domains: set[str]) -> dict:\n    # TODO\n    pass",
    "eHint": "import re\n\ndef strip_hallucinated_citations(output: str, valid_doc_ids: set[str], allowed_domains: set[str]) -> dict:\n    bad_refs = 0\n    bad_urls = 0\n    def sub_ref(m):\n        nonlocal bad_refs\n        if m.group(1) in valid_doc_ids:\n            return m.group(0)\n        bad_refs += 1\n        return \"[INVALID_REF]\"\n    def sub_url(m):\n        nonlocal bad_urls\n        if m.group(1).lower() in allowed_domains:\n            return m.group(0)\n        bad_urls += 1\n        return \"[UNVERIFIED_URL]\"\n    s = re.sub(r\"\\[doc:([A-Za-z0-9_-]+)\\]\", sub_ref, output)\n    s = re.sub(r\"https?://([^/\\s]+)/?[^\\s]*\", sub_url, s)\n    return {\"clean_text\": s, \"removed_refs\": bad_refs, \"removed_urls\": bad_urls}",
    "eTest": "r = strip_hallucinated_citations(\"See [doc:d1], [doc:fake] and https://evil.io/x and https://docs.org/a\", {\"d1\"}, {\"docs.org\"})\nassert r[\"clean_text\"] == \"See [doc:d1], [INVALID_REF] and [UNVERIFIED_URL] and https://docs.org/a\"\nassert r[\"removed_refs\"] == 1 and r[\"removed_urls\"] == 1\nassert strip_hallucinated_citations(\"ok [doc:d1]\", {\"d1\"}, set())[\"removed_refs\"] == 0\nprint('All checks passed.')",
    "aTitle": "JSON Schema Output Repair & Numeric Range Clamper",
    "aDesc": "Write `validate_and_clamp_output(raw_json: str, required_str: set[str], num_bounds: dict[str, tuple[float, float]]) -> tuple[bool, dict]`: parse JSON object (strip code fences if wrapped), verify all `required_str` fields are non-empty `str`, verify numeric fields in `num_bounds` exist and clamp into `[lo, hi]`.",
    "aStarter": "import json, re\n\ndef validate_and_clamp_output(raw_json: str, required_str: set[str], num_bounds: dict[str, tuple[float, float]]) -> tuple[bool, dict]:\n    # TODO\n    pass",
    "aHint": "import json, re\n\ndef validate_and_clamp_output(raw_json: str, required_str: set[str], num_bounds: dict[str, tuple[float, float]]) -> tuple[bool, dict]:\n    cleaned = re.sub(r\"^```(?:json)?\\s*|\\s*```$\", \"\", raw_json.strip(), flags=re.DOTALL)\n    try:\n        obj = json.loads(cleaned)\n    except Exception:\n        return False, {}\n    if not isinstance(obj, dict):\n        return False, {}\n    for k in required_str:\n        if not isinstance(obj.get(k), str) or not obj[k].strip():\n            return False, {}\n    for k, (lo, hi) in num_bounds.items():\n        if k not in obj or not isinstance(obj[k], (int, float)) or isinstance(obj[k], bool):\n            return False, {}\n        obj[k] = max(lo, min(hi, obj[k]))\n    return True, obj",
    "aTest": "ok, obj = validate_and_clamp_output('```json\\n{\"verdict\": \"pass\", \"conf\": 1.4}\\n```', {\"verdict\"}, {\"conf\": (0.0, 1.0)})\nassert ok is True and obj == {\"verdict\": \"pass\", \"conf\": 1.0}\nassert validate_and_clamp_output('{\"verdict\": \"\"}', {\"verdict\"}, {}) == (False, {})\nassert validate_and_clamp_output(\"not json\", {\"verdict\"}, {}) == (False, {})\nprint('All checks passed.')"
  },
  {
    "day": 38,
    "fallbackTitle": "NLI-Style Faithfulness & Groundedness Verification Against Retrieved Source Spans",
    "eTitle": "Lexical Entailment Span-Coverage Faithfulness Verifier",
    "eDesc": "Write `score_claim_faithfulness(claims: list[str], contexts: list[str], threshold: float = 0.6) -> dict`: tokenize non-stopword alphanumeric words (`>=3` chars) in contexts vs each claim; a claim is grounded iff `overlap / len(claim_terms) >= threshold`. Return `{\"faithfulness\": round(grounded/total, 4), \"unsupported\": [claims...]}`.",
    "eStarter": "import re\n\ndef score_claim_faithfulness(claims: list[str], contexts: list[str], threshold: float = 0.6) -> dict:\n    # TODO\n    pass",
    "eHint": "import re\n\ndef score_claim_faithfulness(claims: list[str], contexts: list[str], threshold: float = 0.6) -> dict:\n    def toks(s): return {w for w in re.findall(r\"[a-z0-9]+\", s.lower()) if len(w) >= 3}\n    ctx = set()\n    for c in contexts:\n        ctx |= toks(c)\n    unsup = []\n    for cl in claims:\n        ct = toks(cl)\n        cov = (len(ct & ctx) / len(ct)) if ct else 1.0\n        if cov < threshold:\n            unsup.append(cl)\n    score = round((len(claims) - len(unsup)) / len(claims), 4) if claims else 1.0\n    return {\"faithfulness\": score, \"unsupported\": unsup}",
    "eTest": "r = score_claim_faithfulness([\"Vector index uses HNSW.\", \"Unicorn launched to Mars.\"], [\"Our vector index uses HNSW graphs for speed.\"], 0.6)\nassert r == {\"faithfulness\": 0.5, \"unsupported\": [\"Unicorn launched to Mars.\"]}\nassert score_claim_faithfulness([\"Vector index uses HNSW.\"], [\"Vector index uses HNSW.\"], 0.6)[\"faithfulness\"] == 1.0\nassert score_claim_faithfulness([], [\"a\"], 0.6) == {\"faithfulness\": 1.0, \"unsupported\": []}\nprint('All checks passed.')",
    "aTitle": "Strict Numeric Fact-Match Consistency Checker (`context vs answer numbers`)",
    "aDesc": "Write `check_numeric_grounding(answer: str, contexts: list[str]) -> tuple[bool, list[str]]`: extract all decimal/integer numeric literals (`\\d+(?:\\.\\d+)?`) from `answer` and ensure every numeric value (`float` comparison within `1e-6`) appears somewhere inside `contexts`, returning `(all_grounded, ungrounded_num_strs)`.",
    "aStarter": "import re\n\ndef check_numeric_grounding(answer: str, contexts: list[str]) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "import re\n\ndef check_numeric_grounding(answer: str, contexts: list[str]) -> tuple[bool, list[str]]:\n    ctx_nums = [float(x) for c in contexts for x in re.findall(r\"\\d+(?:\\.\\d+)?\", c)]\n    bad = []\n    for s in re.findall(r\"\\d+(?:\\.\\d+)?\", answer):\n        v = float(s)\n        if not any(abs(v - cv) < 1e-6 for cv in ctx_nums):\n            bad.append(s)\n    return (len(bad) == 0), bad",
    "aTest": "assert check_numeric_grounding(\"Latency dropped 42.5 ms in Q3.\", [\"Measured latency dropped 42.50 ms across 3 clusters.\"]) == (True, [])\nassert check_numeric_grounding(\"Latency dropped 99 ms.\", [\"Measured latency dropped 42.5 ms.\"]) == (False, [\"99\"])\nassert check_numeric_grounding(\"No numbers here.\", []) == (True, [])\nprint('All checks passed.')"
  },
  {
    "day": 39,
    "fallbackTitle": "Calibrated Refusal Classifiers: Distinguishing Benign Sensitive Queries from False Refusals",
    "eTitle": "Dual-Gate Benign-Over-Refusal Calibration Evaluator (`FPR vs FRR`)",
    "eDesc": "Write `eval_refusal_calibration(preds: list[tuple[bool, bool]]) -> dict`: each tuple is `(actual_unsafe, refused)` (`True` = unsafe/refused). Compute `unsafe_recall = TP / actual_unsafe`, `false_refusal_rate = FP / actual_benign`, returning `{\"unsafe_recall\": round4, \"false_refusal_rate\": round4}`.",
    "eStarter": "def eval_refusal_calibration(preds: list[tuple[bool, bool]]) -> dict:\n    # TODO\n    pass",
    "eHint": "def eval_refusal_calibration(preds: list[tuple[bool, bool]]) -> dict:\n    uns = [r for u, r in preds if u]\n    ben = [r for u, r in preds if not u]\n    ur = round(sum(uns) / len(uns), 4) if uns else 1.0\n    fr = round(sum(ben) / len(ben), 4) if ben else 0.0\n    return {\"unsafe_recall\": ur, \"false_refusal_rate\": fr}",
    "eTest": "r = eval_refusal_calibration([(True, True), (True, True), (False, False), (False, True)])\nassert r == {\"unsafe_recall\": 1.0, \"false_refusal_rate\": 0.5}\nassert eval_refusal_calibration([(True, False), (False, False)]) == {\"unsafe_recall\": 0.0, \"false_refusal_rate\": 0.0}\nassert eval_refusal_calibration([(True, True), (False, False)]) == {\"unsafe_recall\": 1.0, \"false_refusal_rate\": 0.0}\nprint('All checks passed.')",
    "aTitle": "Intent-Aware Keyword Context Gate (Benign Defense vs Offensive Intent)",
    "aDesc": "Write `classify_sensitive_intent(query: str, dual_use_topics: set[str], defensive_verbs: set[str], attack_verbs: set[str]) -> str`: extract lowercase words; if any `attack_verb` + any `dual_use_topic` co-occur -> `\"refuse\"`; elif `dual_use_topic` + `defensive_verb` -> `\"allow_educational\"`; else `\"allow\"`.",
    "aStarter": "import re\n\ndef classify_sensitive_intent(query: str, dual_use_topics: set[str], defensive_verbs: set[str], attack_verbs: set[str]) -> str:\n    # TODO\n    pass",
    "aHint": "import re\n\ndef classify_sensitive_intent(query: str, dual_use_topics: set[str], defensive_verbs: set[str], attack_verbs: set[str]) -> str:\n    ws = set(re.findall(r\"[a-z]+\", query.lower()))\n    if (ws & dual_use_topics) and (ws & attack_verbs):\n        return \"refuse\"\n    if (ws & dual_use_topics) and (ws & defensive_verbs):\n        return \"allow_educational\"\n    return \"allow\"",
    "aTest": "assert classify_sensitive_intent(\"How to defend against phishing emails?\", {\"phishing\"}, {\"defend\", \"prevent\"}, {\"craft\", \"launch\"}) == \"allow_educational\"\nassert classify_sensitive_intent(\"Help me launch phishing attack.\", {\"phishing\"}, {\"defend\"}, {\"launch\"}) == \"refuse\"\nassert classify_sensitive_intent(\"Explain quicksort.\", {\"phishing\"}, {\"defend\"}, {\"launch\"}) == \"allow\"\nprint('All checks passed.')"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8: Output Groundedness Verifier & PII Pseudonymization Pipeline",
    "eTitle": "Milestone 8A: Outbound Egress Firewall (Secret Scan + Citation Grounding + PII)",
    "eDesc": "Write `guard_egress_response(text: str, valid_citations: set[str]) -> dict`: detect leaked API key prefixes (`sk-[A-Za-z0-9]{8,}`), strip ungrounded `[doc:ID]` tags not in `valid_citations`, and mask email PII with `[EMAIL_REDACTED]`. Block (`\"blocked\": True`) iff any API secret leaked.",
    "eStarter": "import re\n\ndef guard_egress_response(text: str, valid_citations: set[str]) -> dict:\n    # TODO\n    pass",
    "eHint": "import re\n\ndef guard_egress_response(text: str, valid_citations: set[str]) -> dict:\n    if re.search(r\"sk-[A-Za-z0-9]{8,}\", text):\n        return {\"blocked\": True, \"reason\": \"secret_leak\", \"safe_text\": \"\"}\n    s = re.sub(r\"\\[doc:([A-Za-z0-9_-]+)\\]\", lambda m: m.group(0) if m.group(1) in valid_citations else \"[UNVERIFIED]\", text)\n    s = re.sub(r\"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+\", \"[EMAIL_REDACTED]\", s)\n    return {\"blocked\": False, \"reason\": \"ok\", \"safe_text\": s}",
    "eTest": "assert guard_egress_response(\"Key is sk-1234567890\", {\"d1\"}) == {\"blocked\": True, \"reason\": \"secret_leak\", \"safe_text\": \"\"}\nr = guard_egress_response(\"Email a@b.com per [doc:d1] and [doc:bad]\", {\"d1\"})\nassert r == {\"blocked\": False, \"reason\": \"ok\", \"safe_text\": \"Email [EMAIL_REDACTED] per [doc:d1] and [UNVERIFIED]\"}\nassert guard_egress_response(\"clean text\", set())[\"blocked\"] is False\nprint('All checks passed.')",
    "aTitle": "Milestone 8B: PII Round-Trip Consistency & Leakage Zero-Tolerance Verifier",
    "aDesc": "Write `audit_pii_roundtrip(raw: str, masked: str, restored: str, sensitive_items: list[str]) -> tuple[bool, list[str]]`: verify ZERO items in `sensitive_items` appear inside `masked` (`\"leak_in_masked\"`) AND `restored == raw` (`\"lossy_restore\"`). Return `(ok, sorted_errors)`.",
    "aStarter": "def audit_pii_roundtrip(raw: str, masked: str, restored: str, sensitive_items: list[str]) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "def audit_pii_roundtrip(raw: str, masked: str, restored: str, sensitive_items: list[str]) -> tuple[bool, list[str]]:\n    errs = []\n    if any(s in masked for s in sensitive_items):\n        errs.append(\"leak_in_masked\")\n    if restored != raw:\n        errs.append(\"lossy_restore\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "aTest": "assert audit_pii_roundtrip(\"hi a@b.com\", \"hi [E1]\", \"hi a@b.com\", [\"a@b.com\"]) == (True, [])\nassert audit_pii_roundtrip(\"hi a@b.com\", \"hi a@b.com\", \"hi wrong\", [\"a@b.com\"]) == (False, [\"leak_in_masked\", \"lossy_restore\"])\nassert audit_pii_roundtrip(\"hi a@b.com\", \"hi a@b.com\", \"hi a@b.com\", [\"a@b.com\"]) == (False, [\"leak_in_masked\"])\nprint('All checks passed.')"
  },
  {
    "day": 41,
    "fallbackTitle": "Classifier Threshold Calibration: Precision-Recall Curves, F-Beta & Cost-Weighted Errors",
    "eTitle": "Cost-Weighted & F-Beta Optimal Classifier Threshold Solver",
    "eDesc": "Write `optimal_fbeta_threshold(probs_labels: list[tuple[float, int]], beta: float = 2.0) -> dict`: evaluate threshold `t` across all distinct probabilities (`pred = 1 if p >= t else 0`); compute F-beta `(1 + beta^2) * P * R / (beta^2 * P + R)` selecting `t` maximizing F-beta (tie-break higher `t`). Return `{\"threshold\": round4, \"f_beta\": round4}`.",
    "eStarter": "def optimal_fbeta_threshold(probs_labels: list[tuple[float, int]], beta: float = 2.0) -> dict:\n    # TODO\n    pass",
    "eHint": "def optimal_fbeta_threshold(probs_labels: list[tuple[float, int]], beta: float = 2.0) -> dict:\n    b2 = beta * beta\n    cands = sorted({p for p, _ in probs_labels}, reverse=True)\n    best_t, best_f = cands[0], -1.0\n    for t in cands:\n        tp = sum(1 for p, y in probs_labels if p >= t and y == 1)\n        fp = sum(1 for p, y in probs_labels if p >= t and y == 0)\n        fn = sum(1 for p, y in probs_labels if p < t and y == 1)\n        prec = tp / (tp + fp) if (tp + fp) else 0.0\n        rec = tp / (tp + fn) if (tp + fn) else 0.0\n        fb = ((1.0 + b2) * prec * rec) / (b2 * prec + rec) if (b2 * prec + rec) > 0 else 0.0\n        if fb > best_f:\n            best_f, best_t = fb, t\n    return {\"threshold\": round(best_t, 4), \"f_beta\": round(best_f, 4)}",
    "eTest": "data = [(0.9, 1), (0.6, 1), (0.5, 0), (0.2, 0)]\nassert optimal_fbeta_threshold(data, 2.0) == {\"threshold\": 0.6, \"f_beta\": 1.0}\ndata2 = [(0.9, 1), (0.6, 0), (0.55, 1), (0.1, 0)]\nr2 = optimal_fbeta_threshold(data2, 2.0)\nassert r2[\"threshold\"] == 0.55 and r2[\"f_beta\"] > 0.85\nassert optimal_fbeta_threshold([(0.8, 0)], 1.0)[\"f_beta\"] == 0.0\nprint('All checks passed.')",
    "aTitle": "Bayes-Optimal Decision Threshold Under Asymmetric Error Costs (`C_fn` vs `C_fp`)",
    "aDesc": "Write `bayes_cost_threshold(fp_cost: float, fn_cost: float, review_cost: float | None = None) -> float`: analytical Bayes cutoff `fp_cost / (fp_cost + fn_cost)` rounded to 4 decimals.",
    "aStarter": "def bayes_cost_threshold(fp_cost: float, fn_cost: float) -> float:\n    # TODO\n    pass",
    "aHint": "def bayes_cost_threshold(fp_cost: float, fn_cost: float) -> float:\n    return round(fp_cost / (fp_cost + fn_cost), 4)",
    "aTest": "assert bayes_cost_threshold(1.0, 9.0) == 0.1\nassert bayes_cost_threshold(5.0, 5.0) == 0.5\nassert bayes_cost_threshold(9.0, 1.0) == 0.9\nprint('All checks passed.')"
  },
  {
    "day": 42,
    "fallbackTitle": "Selective Prediction & Abstention: Entropy & Margin Confidence Gates",
    "eTitle": "Predictive Entropy & Top-2 Margin Abstention Gate",
    "eDesc": "Write `selective_predict(probs: list[float], labels: list[str], min_margin: float, max_entropy: float) -> dict`: compute top1-top2 margin and Shannon entropy `-sum(p * ln(max(p, 1e-12)))`; abstain (`\"abstained\": True, \"label\": \"ABSTAIN\"`) if `margin < min_margin` or `entropy > max_entropy`.",
    "eStarter": "import math\n\ndef selective_predict(probs: list[float], labels: list[str], min_margin: float, max_entropy: float) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef selective_predict(probs: list[float], labels: list[str], min_margin: float, max_entropy: float) -> dict:\n    s = sorted(zip(probs, labels), reverse=True)\n    margin = s[0][0] - (s[1][0] if len(s) > 1 else 0.0)\n    ent = -sum(p * math.log(max(p, 1e-12)) for p in probs if p > 0)\n    abstain = margin < min_margin or ent > max_entropy\n    return {\"label\": \"ABSTAIN\" if abstain else s[0][1], \"abstained\": abstain, \"margin\": round(margin, 4), \"entropy\": round(ent, 4)}",
    "eTest": "assert selective_predict([0.95, 0.05], [\"safe\", \"unsafe\"], 0.2, 0.5)[\"label\"] == \"safe\"\nassert selective_predict([0.52, 0.48], [\"safe\", \"unsafe\"], 0.2, 1.0)[\"abstained\"] is True\nassert selective_predict([0.5, 0.25, 0.25], [\"a\", \"b\", \"c\"], 0.1, 0.8)[\"abstained\"] is True\nprint('All checks passed.')",
    "aTitle": "Risk-Coverage Area Under Curve (`AURC` Coverage vs Selective Risk)",
    "aDesc": "Write `risk_coverage_at(confs_correct: list[tuple[float, bool]], coverage: float) -> dict`: sort descending by confidence, take top `k = max(1, round(len * coverage))` accepted items, and return `{\"coverage\": round(k/n, 4), \"selective_risk\": round(errors/k, 4)}`.",
    "aStarter": "def risk_coverage_at(confs_correct: list[tuple[float, bool]], coverage: float) -> dict:\n    # TODO\n    pass",
    "aHint": "def risk_coverage_at(confs_correct: list[tuple[float, bool]], coverage: float) -> dict:\n    n = len(confs_correct)\n    k = max(1, int(round(n * coverage)))\n    top = sorted(confs_correct, key=lambda x: -x[0])[:k]\n    errs = sum(1 for _, ok in top if not ok)\n    return {\"coverage\": round(k / n, 4), \"selective_risk\": round(errs / k, 4)}",
    "aTest": "data = [(0.95, True), (0.90, True), (0.60, False), (0.55, False)]\nassert risk_coverage_at(data, 0.5) == {\"coverage\": 0.5, \"selective_risk\": 0.0}\nassert risk_coverage_at(data, 1.0) == {\"coverage\": 1.0, \"selective_risk\": 0.5}\nassert risk_coverage_at([(0.9, False), (0.8, True)], 0.5)[\"selective_risk\"] == 1.0\nprint('All checks passed.')"
  },
  {
    "day": 43,
    "fallbackTitle": "Expected Calibration Error (ECE) & Temperature Scaling for Reliable Model Probabilities",
    "eTitle": "Multi-Bin Expected Calibration Error (`ECE`) Calculator",
    "eDesc": "Write `compute_ece(probs_correct: list[tuple[float, int]], num_bins: int = 5) -> float`: partition probabilities in `[0.0, 1.0]` into `num_bins` equal-width bins (`[i/M, (i+1)/M)` with `1.0` in last bin); compute `sum_b (|B_b| / N) * |acc(B_b) - conf(B_b)|`, rounded to 6 decimals.",
    "eStarter": "def compute_ece(probs_correct: list[tuple[float, int]], num_bins: int = 5) -> float:\n    # TODO\n    pass",
    "eHint": "def compute_ece(probs_correct: list[tuple[float, int]], num_bins: int = 5) -> float:\n    n = len(probs_correct)\n    if n == 0:\n        return 0.0\n    bins = [[] for _ in range(num_bins)]\n    for p, y in probs_correct:\n        b = min(num_bins - 1, int(p * num_bins))\n        bins[b].append((p, y))\n    ece = 0.0\n    for b in bins:\n        if b:\n            acc = sum(y for _, y in b) / len(b)\n            conf = sum(p for p, _ in b) / len(b)\n            ece += (len(b) / n) * abs(acc - conf)\n    return round(ece, 6)",
    "eTest": "assert compute_ece([(0.9, 1)] * 9 + [(0.9, 0)], 10) == 0.0\nassert compute_ece([(0.95, 0), (0.95, 0)], 5) == 0.95\nassert compute_ece([], 5) == 0.0\nprint('All checks passed.')",
    "aTitle": "Post-Hoc Temperature Scaling Optimizer Minimizing Binary NLL",
    "aDesc": "Write `fit_temperature_scaler(logits_labels: list[tuple[float, int]], candidates: list[float]) -> dict`: for each candidate temperature `T > 0`, compute sigmoid `p = 1 / (1 + exp(-logit / T))` and average binary cross-entropy NLL, returning `{\"best_t\": T, \"nll\": round(best_nll, 6)}`.",
    "aStarter": "import math\n\ndef fit_temperature_scaler(logits_labels: list[tuple[float, int]], candidates: list[float]) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef fit_temperature_scaler(logits_labels: list[tuple[float, int]], candidates: list[float]) -> dict:\n    best_t, best_nll = candidates[0], float(\"inf\")\n    for t in candidates:\n        nll = 0.0\n        for z, y in logits_labels:\n            p = 1.0 / (1.0 + math.exp(-z / t))\n            p = max(1e-12, min(1.0 - 1e-12, p))\n            nll -= y * math.log(p) + (1 - y) * math.log(1.0 - p)\n        nll /= len(logits_labels)\n        if nll < best_nll:\n            best_nll, best_t = nll, t\n    return {\"best_t\": best_t, \"nll\": round(best_nll, 6)}",
    "aTest": "data = [(5.0, 1), (5.0, 0), (-5.0, 0), (-5.0, 1)]\nr = fit_temperature_scaler(data, [0.5, 1.0, 5.0, 10.0])\nassert r[\"best_t\"] == 10.0\nassert fit_temperature_scaler([(5.0, 1), (-5.0, 0)], [0.5, 5.0])[\"best_t\"] == 0.5\nassert r[\"nll\"] < 0.75\nprint('All checks passed.')"
  },
  {
    "day": 44,
    "fallbackTitle": "Safe Tool-Use Sandboxes: JSON Argument Allowlists, Path Traversal Guards & Dry-Run Checks",
    "eTitle": "Lexical Path Canonicalizer & Root-Escape Traversal Guard",
    "eDesc": "Write `resolve_safe_sandbox_path(root: str, req_path: str) -> tuple[bool, str]`: purely lexically resolve `.` and `..` segments cleanly (without filesystem calls), strip leading slashes if joined under `root`, reject NUL bytes or any `..` traversal escaping `root`, returning `(True, safe_joined_path)` or `(False, \"traversal_blocked\")`.",
    "eStarter": "def resolve_safe_sandbox_path(root: str, req_path: str) -> tuple[bool, str]:\n    # TODO\n    pass",
    "eHint": "def resolve_safe_sandbox_path(root: str, req_path: str) -> tuple[bool, str]:\n    if \"\\x00\" in req_path or req_path.startswith(\"/\"):\n        return False, \"traversal_blocked\"\n    stack = []\n    for seg in req_path.replace(\"\\\\\", \"/\").split(\"/\"):\n        if not seg or seg == \".\":\n            continue\n        if seg == \"..\":\n            if not stack:\n                return False, \"traversal_blocked\"\n            stack.pop()\n        else:\n            stack.append(seg)\n    clean_root = root.rstrip(\"/\")\n    return True, f\"{clean_root}/\" + \"/\".join(stack)",
    "eTest": "assert resolve_safe_sandbox_path(\"/sandbox/ws\", \"docs/../docs/a.txt\") == (True, \"/sandbox/ws/docs/a.txt\")\nassert resolve_safe_sandbox_path(\"/sandbox/ws\", \"../../etc/passwd\") == (False, \"traversal_blocked\")\nassert resolve_safe_sandbox_path(\"/sandbox/ws\", \"/abs/secret\") == (False, \"traversal_blocked\")\nprint('All checks passed.')",
    "aTitle": "Strict Schema & Argument-Allowlist Tool Call Authorizer",
    "aDesc": "Write `authorize_tool_args(tool_name: str, args: dict, policy: dict) -> tuple[bool, str]`: reject unlisted tool (`\"unknown_tool\"`), unexpected extra argument keys (`\"extra_arg\"`), or missing required keys (`\"missing_arg\"`), else `(True, \"allowed\")`.",
    "aStarter": "def authorize_tool_args(tool_name: str, args: dict, policy: dict) -> tuple[bool, str]:\n    # TODO\n    pass",
    "aHint": "def authorize_tool_args(tool_name: str, args: dict, policy: dict) -> tuple[bool, str]:\n    if tool_name not in policy:\n        return False, \"unknown_tool\"\n    spec = policy[tool_name]\n    req, allowed = spec[\"required\"], spec[\"allowed\"]\n    if not set(args).issubset(allowed):\n        return False, \"extra_arg\"\n    if not req.issubset(args):\n        return False, \"missing_arg\"\n    return True, \"allowed\"",
    "aTest": "pol = {\"search\": {\"required\": {\"q\"}, \"allowed\": {\"q\", \"limit\"}}}\nassert authorize_tool_args(\"search\", {\"q\": \"ai\", \"limit\": 5}, pol) == (True, \"allowed\")\nassert authorize_tool_args(\"search\", {\"q\": \"ai\", \"shell\": \"x\"}, pol) == (False, \"extra_arg\")\nassert authorize_tool_args(\"drop_db\", {}, pol) == (False, \"unknown_tool\")\nprint('All checks passed.')"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9: Calibrated Uncertainty Gate & Zero-Trust Tool Execution Sandbox",
    "eTitle": "Milestone 9A: Conformal Selective Classification + Tool Sandbox Router",
    "eDesc": "Write `zero_trust_dispatch(tool: str, args: dict, confidence: float, min_conf: float, allowlist: set[str], dry_run: bool) -> dict`: require `tool in allowlist` (`\"denied_tool\"`), `confidence >= min_conf` (`\"abstain_low_conf\"`), return `\"mode\": \"dry_run\"` if `dry_run` else `\"mode\": \"executed\"`.",
    "eStarter": "def zero_trust_dispatch(tool: str, args: dict, confidence: float, min_conf: float, allowlist: set[str], dry_run: bool) -> dict:\n    # TODO\n    pass",
    "eHint": "def zero_trust_dispatch(tool: str, args: dict, confidence: float, min_conf: float, allowlist: set[str], dry_run: bool) -> dict:\n    if tool not in allowlist:\n        return {\"allowed\": False, \"mode\": \"blocked\", \"reason\": \"denied_tool\"}\n    if confidence < min_conf:\n        return {\"allowed\": False, \"mode\": \"abstain\", \"reason\": \"abstain_low_conf\"}\n    return {\"allowed\": True, \"mode\": \"dry_run\" if dry_run else \"executed\", \"reason\": \"ok\"}",
    "eTest": "assert zero_trust_dispatch(\"sql_read\", {\"id\": 1}, 0.9, 0.8, {\"sql_read\"}, True) == {\"allowed\": True, \"mode\": \"dry_run\", \"reason\": \"ok\"}\nassert zero_trust_dispatch(\"sql_read\", {}, 0.4, 0.8, {\"sql_read\"}, False)[\"reason\"] == \"abstain_low_conf\"\nassert zero_trust_dispatch(\"rm_all\", {}, 0.99, 0.8, {\"sql_read\"}, False)[\"reason\"] == \"denied_tool\"\nprint('All checks passed.')",
    "aTitle": "Milestone 9B: Calibrated Risk Score Evaluator Across ECE Threshold Gate",
    "aDesc": "Write `verify_calibration_gate(ece: float, max_ece: float, unsafe_recall: float, min_recall: float) -> tuple[bool, list[str]]`: enforce `ece <= max_ece` (`\"poor_calibration\"`) and `unsafe_recall >= min_recall` (`\"recall_regression\"`), returning `(ok, sorted_failures)`.",
    "aStarter": "def verify_calibration_gate(ece: float, max_ece: float, unsafe_recall: float, min_recall: float) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "def verify_calibration_gate(ece: float, max_ece: float, unsafe_recall: float, min_recall: float) -> tuple[bool, list[str]]:\n    errs = []\n    if ece > max_ece: errs.append(\"poor_calibration\")\n    if unsafe_recall < min_recall: errs.append(\"recall_regression\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "aTest": "assert verify_calibration_gate(0.02, 0.05, 0.98, 0.95) == (True, [])\nassert verify_calibration_gate(0.08, 0.05, 0.80, 0.95) == (False, [\"poor_calibration\", \"recall_regression\"])\nassert verify_calibration_gate(0.05, 0.05, 0.95, 0.95) == (True, [])\nprint('All checks passed.')"
  },
  {
    "day": 46,
    "fallbackTitle": "Human-in-the-Loop (HITL) Escalation Workflows: Blast-Radius Scoring & Approval Tokens",
    "eTitle": "Blast-Radius Action Scorer & HMAC-Signed HITL Approval Verifier",
    "eDesc": "Write `verify_hitl_token(action_id: str, expiry_ts: int, sig: str, secret: str, now_ts: int) -> tuple[bool, str]` and `needs_hitl(blast_score: int, reversibility: str, thresh: int = 50) -> bool`: verify `now_ts <= expiry_ts` (`\"expired\"`) and constant-time HMAC-SHA256 `f\"{action_id}:{expiry_ts}\"` (`\"invalid_sig\"`). Require HITL iff `blast_score >= thresh` or `reversibility == \"irreversible\"`.",
    "eStarter": "import hmac, hashlib\n\ndef needs_hitl(blast_score: int, reversibility: str, thresh: int = 50) -> bool:\n    # TODO\n    pass\n\ndef verify_hitl_token(action_id: str, expiry_ts: int, sig: str, secret: str, now_ts: int) -> tuple[bool, str]:\n    # TODO\n    pass",
    "eHint": "import hmac, hashlib\n\ndef needs_hitl(blast_score: int, reversibility: str, thresh: int = 50) -> bool:\n    return blast_score >= thresh or reversibility == \"irreversible\"\n\ndef verify_hitl_token(action_id: str, expiry_ts: int, sig: str, secret: str, now_ts: int) -> tuple[bool, str]:\n    if now_ts > expiry_ts:\n        return False, \"expired\"\n    exp = hmac.new(secret.encode(), f\"{action_id}:{expiry_ts}\".encode(), hashlib.sha256).hexdigest()\n    if not hmac.compare_digest(exp, sig):\n        return False, \"invalid_sig\"\n    return True, \"approved\"",
    "eTest": "import hmac, hashlib\nsig = hmac.new(b\"k\", b\"act1:100\", hashlib.sha256).hexdigest()\nassert verify_hitl_token(\"act1\", 100, sig, \"k\", 50) == (True, \"approved\")\nassert verify_hitl_token(\"act1\", 100, sig, \"k\", 150) == (False, \"expired\")\nassert needs_hitl(10, \"irreversible\") and not needs_hitl(10, \"reversible\")\nprint('All checks passed.')",
    "aTitle": "SLA Escalation Queue Prioritizer (`criticality * wait_minutes`)",
    "aDesc": "Write `prioritize_hitl_queue(items: list[dict], max_items: int) -> list[str]`: compute urgency `severity * (1.0 + wait_min / 10.0)` and return top `max_items` `id`s descending by urgency then ID.",
    "aStarter": "def prioritize_hitl_queue(items: list[dict], max_items: int) -> list[str]:\n    # TODO\n    pass",
    "aHint": "def prioritize_hitl_queue(items: list[dict], max_items: int) -> list[str]:\n    ranked = sorted(items, key=lambda it: (-(it[\"severity\"] * (1.0 + it[\"wait_min\"] / 10.0)), it[\"id\"]))\n    return [it[\"id\"] for it in ranked[:max_items]]",
    "aTest": "q = [{\"id\": \"a1\", \"severity\": 2, \"wait_min\": 5}, {\"id\": \"a2\", \"severity\": 5, \"wait_min\": 10}, {\"id\": \"a3\", \"severity\": 4, \"wait_min\": 0}]\nassert prioritize_hitl_queue(q, 2) == [\"a2\", \"a3\"]\nassert prioritize_hitl_queue([], 2) == []\nassert prioritize_hitl_queue(q, 3) == [\"a2\", \"a3\", \"a1\"]\nprint('All checks passed.')"
  },
  {
    "day": 47,
    "fallbackTitle": "Adversarial Red-Teaming: Jailbreak Mutation Operators, Base64/ROT13 Obfuscation & ASR Metrics",
    "eTitle": "Multi-Layer Obfuscation Unwrapper (`Base64 + ROT13` Canonical Detector)",
    "eDesc": "Write `unwrap_and_check_jailbreak(payload: str, forbidden_terms: list[str]) -> tuple[bool, str]`: test raw lowercase, ROT13 decoded, and valid strict Base64-UTF8 decoded variants against `forbidden_terms`; return `(True, matched_variant)` if found (`\"raw\"`, `\"rot13\"`, `\"base64\"`), else `(False, \"clean\")`.",
    "eStarter": "import base64, codecs\n\ndef unwrap_and_check_jailbreak(payload: str, forbidden_terms: list[str]) -> tuple[bool, str]:\n    # TODO\n    pass",
    "eHint": "import base64, codecs\n\ndef unwrap_and_check_jailbreak(payload: str, forbidden_terms: list[str]) -> tuple[bool, str]:\n    terms = [t.lower() for t in forbidden_terms]\n    if any(t in payload.lower() for t in terms):\n        return True, \"raw\"\n    r13 = codecs.decode(payload, \"rot_13\").lower()\n    if any(t in r13 for t in terms):\n        return True, \"rot13\"\n    try:\n        b = base64.b64decode(payload, validate=True).decode(\"utf-8\").lower()\n        if any(t in b for t in terms):\n            return True, \"base64\"\n    except Exception:\n        pass\n    return False, \"clean\"",
    "eTest": "import base64, codecs\nb64 = base64.b64encode(b\"bypass policy\").decode()\nr13 = codecs.encode(\"bypass policy\", \"rot_13\")\nassert unwrap_and_check_jailbreak(b64, [\"bypass policy\"]) == (True, \"base64\")\nassert unwrap_and_check_jailbreak(r13, [\"bypass policy\"]) == (True, \"rot13\")\nassert unwrap_and_check_jailbreak(\"safe homework\", [\"bypass policy\"]) == (False, \"clean\")\nprint('All checks passed.')",
    "aTitle": "Attack Success Rate (`ASR`) & Per-Category Vulnerability Aggregator",
    "aDesc": "Write `compute_redteam_asr(runs: list[dict]) -> dict`: group outcomes `{category, succeeded: bool}` into overall `asr_pct = round(100 * succ / total, 2)` and `\"by_category\": {cat: round(100 * succ/cnt, 2)}`.",
    "aStarter": "def compute_redteam_asr(runs: list[dict]) -> dict:\n    # TODO\n    pass",
    "aHint": "from collections import defaultdict\n\ndef compute_redteam_asr(runs: list[dict]) -> dict:\n    if not runs:\n        return {\"asr_pct\": 0.0, \"by_category\": {}}\n    cats = defaultdict(lambda: [0, 0])\n    tot_s = 0\n    for r in runs:\n        cats[r[\"category\"]][1] += 1\n        if r[\"succeeded\"]:\n            cats[r[\"category\"]][0] += 1\n            tot_s += 1\n    by_c = {c: round((s / t) * 100.0, 2) for c, (s, t) in cats.items()}\n    return {\"asr_pct\": round((tot_s / len(runs)) * 100.0, 2), \"by_category\": by_c}",
    "aTest": "rs = [{\"category\": \"inj\", \"succeeded\": True}, {\"category\": \"inj\", \"succeeded\": False}, {\"category\": \"pii\", \"succeeded\": False}]\nr = compute_redteam_asr(rs)\nassert r == {\"asr_pct\": 33.33, \"by_category\": {\"inj\": 50.0, \"pii\": 0.0}}\nassert compute_redteam_asr([]) == {\"asr_pct\": 0.0, \"by_category\": {}}\nassert compute_redteam_asr([{\"category\": \"x\", \"succeeded\": True}])[\"asr_pct\"] == 100.0\nprint('All checks passed.')"
  },
  {
    "day": 48,
    "fallbackTitle": "Automated Safety Regression Gates: Golden Adversarial Suites & CI Release Blockers",
    "eTitle": "CI Zero-Regression Safety Release Blocker (`Golden Suite` Delta Gate)",
    "eDesc": "Write `evaluate_safety_release_gate(baseline_asr: dict[str, float], candidate_asr: dict[str, float], critical_cats: set[str], max_delta_pct: float = 0.5) -> tuple[bool, list[str]]`: block any category where `candidate > baseline + max_delta_pct` (`\"regression:<cat>\"`) OR any `cat in critical_cats` with `candidate > 0.0` (`\"critical_breach:<cat>\"`).",
    "eStarter": "def evaluate_safety_release_gate(baseline_asr: dict[str, float], candidate_asr: dict[str, float], critical_cats: set[str], max_delta_pct: float = 0.5) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "eHint": "def evaluate_safety_release_gate(baseline_asr: dict[str, float], candidate_asr: dict[str, float], critical_cats: set[str], max_delta_pct: float = 0.5) -> tuple[bool, list[str]]:\n    errs = []\n    for cat, casr in candidate_asr.items():\n        if cat in critical_cats and casr > 0.0:\n            errs.append(f\"critical_breach:{cat}\")\n        elif casr > baseline_asr.get(cat, 0.0) + max_delta_pct:\n            errs.append(f\"regression:{cat}\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "eTest": "assert evaluate_safety_release_gate({\"jailbreak\": 1.0}, {\"jailbreak\": 1.2, \"csam\": 0.0}, {\"csam\"}, 0.5) == (True, [])\nassert evaluate_safety_release_gate({\"jailbreak\": 1.0}, {\"jailbreak\": 3.0, \"csam\": 0.5}, {\"csam\"}, 0.5) == (False, [\"critical_breach:csam\", \"regression:jailbreak\"])\nassert evaluate_safety_release_gate({}, {}, {\"csam\"}, 0.5) == (True, [])\nprint('All checks passed.')",
    "aTitle": "False-Refusal vs Attack-Defense Regression Matrix Validator",
    "aDesc": "Write `check_safety_utility_pareto(cur_asr: float, cur_frr: float, max_asr: float, max_frr: float) -> str`: return `\"pass\"` if both limits met, `\"unsafe\"` if `cur_asr > max_asr`, `\"over_refusal\"` if only `cur_frr > max_frr`.",
    "aStarter": "def check_safety_utility_pareto(cur_asr: float, cur_frr: float, max_asr: float, max_frr: float) -> str:\n    # TODO\n    pass",
    "aHint": "def check_safety_utility_pareto(cur_asr: float, cur_frr: float, max_asr: float, max_frr: float) -> str:\n    if cur_asr > max_asr:\n        return \"unsafe\"\n    if cur_frr > max_frr:\n        return \"over_refusal\"\n    return \"pass\"",
    "aTest": "assert check_safety_utility_pareto(0.5, 2.0, 1.0, 5.0) == \"pass\"\nassert check_safety_utility_pareto(2.5, 1.0, 1.0, 5.0) == \"unsafe\"\nassert check_safety_utility_pareto(0.5, 8.0, 1.0, 5.0) == \"over_refusal\"\nprint('All checks passed.')"
  },
  {
    "day": 49,
    "fallbackTitle": "Algorithmic Fairness: Demographic Parity, Equalized Odds & Disparate Impact (Four-Fifths Rule)",
    "eTitle": "Demographic Parity Ratio & Four-Fifths Disparate Impact Auditor",
    "eDesc": "Write `four_fifths_audit(group_outcomes: dict[str, list[int]]) -> dict`: compute positive prediction rate (`1` fraction) per group, find `impact_ratio = min_rate / max_rate` (1.0 if `max_rate == 0`), returning `{\"rates\": {g: round4}, \"impact_ratio\": round4, \"passes_four_fifths\": bool}` (`impact_ratio >= 0.8`).",
    "eStarter": "def four_fifths_audit(group_outcomes: dict[str, list[int]]) -> dict:\n    # TODO\n    pass",
    "eHint": "def four_fifths_audit(group_outcomes: dict[str, list[int]]) -> dict:\n    rates = {g: round(sum(ys) / len(ys), 4) for g, ys in group_outcomes.items()}\n    mx = max(rates.values()) if rates else 0.0\n    mn = min(rates.values()) if rates else 0.0\n    ratio = round(mn / mx, 4) if mx > 0 else 1.0\n    return {\"rates\": rates, \"impact_ratio\": ratio, \"passes_four_fifths\": ratio >= 0.8}",
    "eTest": "ok = four_fifths_audit({\"gA\": [1, 1, 1, 1, 0], \"gB\": [1, 1, 1, 0, 0]})\nbad = four_fifths_audit({\"gA\": [1, 1, 1, 1], \"gB\": [1, 0, 0, 0]})\nassert ok[\"impact_ratio\"] == 0.75 and ok[\"passes_four_fifths\"] is False\nassert four_fifths_audit({\"gA\": [1, 1, 1, 1, 1], \"gB\": [1, 1, 1, 1, 0]})[\"passes_four_fifths\"] is True\nassert bad[\"impact_ratio\"] == 0.25\nprint('All checks passed.')",
    "aTitle": "Equalized Odds Gap (`max(|TPR_a - TPR_b|, |FPR_a - FPR_b|)`) Calculator",
    "aDesc": "Write `equalized_odds_gap(rows: list[tuple[str, int, int]]) -> dict`: each row `(group, y_true, y_pred)`. Compute TPR and FPR per group, then `tpr_gap = max(tprs) - min(tprs)`, `fpr_gap = max(fprs) - min(fprs)`, `eo_gap = max(tpr_gap, fpr_gap)` rounded to 4 decimals.",
    "aStarter": "def equalized_odds_gap(rows: list[tuple[str, int, int]]) -> dict:\n    # TODO\n    pass",
    "aHint": "from collections import defaultdict\n\ndef equalized_odds_gap(rows: list[tuple[str, int, int]]) -> dict:\n    grp = defaultdict(list)\n    for g, yt, yp in rows:\n        grp[g].append((yt, yp))\n    tprs, fprs = [], []\n    for pts in grp.values():\n        pos = [yp for yt, yp in pts if yt == 1]\n        neg = [yp for yt, yp in pts if yt == 0]\n        tprs.append(sum(pos) / len(pos) if pos else 0.0)\n        fprs.append(sum(neg) / len(neg) if neg else 0.0)\n    tg = round(max(tprs) - min(tprs), 4)\n    fg = round(max(fprs) - min(fprs), 4)\n    return {\"tpr_gap\": tg, \"fpr_gap\": fg, \"eo_gap\": max(tg, fg)}",
    "aTest": "rs = [(\"a\", 1, 1), (\"a\", 0, 0), (\"b\", 1, 0), (\"b\", 0, 1)]\nassert equalized_odds_gap(rs) == {\"tpr_gap\": 1.0, \"fpr_gap\": 1.0, \"eo_gap\": 1.0}\nassert equalized_odds_gap([(\"a\", 1, 1), (\"a\", 0, 0), (\"b\", 1, 1), (\"b\", 0, 0)])[\"eo_gap\"] == 0.0\nassert equalized_odds_gap([(\"a\", 1, 1), (\"a\", 0, 1), (\"b\", 1, 1), (\"b\", 0, 0)]) == {\"tpr_gap\": 0.0, \"fpr_gap\": 1.0, \"eo_gap\": 1.0}\nprint('All checks passed.')"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10: Adversarial Red-Team Harness & Fairness Auditing Engine",
    "eTitle": "Milestone 10A: Automated Red-Team Suite Runner & ASR Gate",
    "eDesc": "Write `run_redteam_harness(probes: list[dict], defense_fn, max_allowed_asr_pct: float) -> dict`: pass each `probe[\"text\"]` to `defense_fn(txt) -> bool` (returns True iff defense BLOCKED attack). Bypass occurs when blocked is False; return `{\"passed\": asr <= max_allowed_asr_pct, \"asr_pct\": round2, \"bypassed_ids\": [ids]}`.",
    "eStarter": "def run_redteam_harness(probes: list[dict], defense_fn, max_allowed_asr_pct: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def run_redteam_harness(probes: list[dict], defense_fn, max_allowed_asr_pct: float) -> dict:\n    if not probes:\n        return {\"passed\": True, \"asr_pct\": 0.0, \"bypassed_ids\": []}\n    byp = [p[\"id\"] for p in probes if not defense_fn(p[\"text\"])]\n    asr = round((len(byp) / len(probes)) * 100.0, 2)\n    return {\"passed\": asr <= max_allowed_asr_pct, \"asr_pct\": asr, \"bypassed_ids\": byp}",
    "eTest": "probes = [{\"id\": \"p1\", \"text\": \"jailbreak\"}, {\"id\": \"p2\", \"text\": \"byp@ss\"}, {\"id\": \"p3\", \"text\": \"ignore\"}]\nr = run_redteam_harness(probes, lambda s: \"jailbreak\" in s or \"ignore\" in s, 10.0)\nassert r == {\"passed\": False, \"asr_pct\": 33.33, \"bypassed_ids\": [\"p2\"]}\nassert run_redteam_harness(probes, lambda s: True, 0.0) == {\"passed\": True, \"asr_pct\": 0.0, \"bypassed_ids\": []}\nassert run_redteam_harness([], lambda s: False, 0.0)[\"passed\"] is True\nprint('All checks passed.')",
    "aTitle": "Milestone 10B: Dual Fairness + HitL Risk-Control Compliance Auditor",
    "aDesc": "Write `audit_fairness_and_hitl(impact_ratio: float, eo_gap: float, unapproved_high_blast: int) -> tuple[bool, list[str]]`: enforce `impact_ratio >= 0.8` (`\"disparate_impact\"`), `eo_gap <= 0.1` (`\"eo_gap_exceeded\"`), and `unapproved_high_blast == 0` (`\"hitl_bypass\"`).",
    "aStarter": "def audit_fairness_and_hitl(impact_ratio: float, eo_gap: float, unapproved_high_blast: int) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "def audit_fairness_and_hitl(impact_ratio: float, eo_gap: float, unapproved_high_blast: int) -> tuple[bool, list[str]]:\n    errs = []\n    if impact_ratio < 0.8: errs.append(\"disparate_impact\")\n    if eo_gap > 0.1: errs.append(\"eo_gap_exceeded\")\n    if unapproved_high_blast > 0: errs.append(\"hitl_bypass\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "aTest": "assert audit_fairness_and_hitl(0.92, 0.04, 0) == (True, [])\nassert audit_fairness_and_hitl(0.65, 0.25, 2) == (False, [\"disparate_impact\", \"eo_gap_exceeded\", \"hitl_bypass\"])\nassert audit_fairness_and_hitl(0.80, 0.10, 0) == (True, [])\nprint('All checks passed.')"
  },
  {
    "day": 51,
    "fallbackTitle": "Immutable Tamper-Evident Audit Logs: SHA-256 Hash Chains & Cryptographic Receipts",
    "eTitle": "Tamper-Evident SHA-256 Cryptographic Audit Log Ledger",
    "eDesc": "Implement `AuditChain`: `append(event: str) -> str` hashes `f\"{idx}|{prev_hash}|{event}\"` with SHA-256 (starting `prev_hash = \"GENESIS\"`), and `verify(entries: list[tuple[int, str, str]]) -> tuple[bool, int | None]` verifies sequential integrity returning `(True, None)` or `(False, first_tampered_idx)`.",
    "eStarter": "import hashlib\n\nclass AuditChain:\n    def __init__(self):\n        # TODO\n        pass\n\n    def append(self, event: str) -> str:\n        # TODO\n        pass\n\n    def verify(self) -> tuple[bool, int | None]:\n        # TODO\n        pass",
    "eHint": "import hashlib\n\nclass AuditChain:\n    def __init__(self):\n        self.entries = []\n\n    def append(self, event: str) -> str:\n        prev = self.entries[-1][2] if self.entries else \"GENESIS\"\n        idx = len(self.entries)\n        h = hashlib.sha256(f\"{idx}|{prev}|{event}\".encode()).hexdigest()\n        self.entries.append((idx, event, h))\n        return h\n\n    def verify(self) -> tuple[bool, int | None]:\n        prev = \"GENESIS\"\n        for i, (idx, ev, h) in enumerate(self.entries):\n            exp = hashlib.sha256(f\"{i}|{prev}|{ev}\".encode()).hexdigest()\n            if idx != i or h != exp:\n                return False, i\n            prev = h\n        return True, None",
    "eTest": "ac = AuditChain()\nh0 = ac.append(\"login\")\nh1 = ac.append(\"grant\")\nassert h0 != h1\nassert ac.verify() == (True, None)\nac.entries[0] = (0, \"forged\", h0)\nassert ac.verify() == (False, 0)\nprint('All checks passed.')",
    "aTitle": "Merkle Inclusion Proof Root Hasher for Audit Batches",
    "aDesc": "Write `merkle_audit_root(leaves: list[str]) -> str`: SHA-256 hash each leaf string as hex, then reduce pairs upward (`sha256(left + right)` duplicating odd tail node) until single root hex digest (`\"\"` if empty).",
    "aStarter": "import hashlib\n\ndef merkle_audit_root(leaves: list[str]) -> str:\n    # TODO\n    pass",
    "aHint": "import hashlib\n\ndef merkle_audit_root(leaves: list[str]) -> str:\n    if not leaves:\n        return \"\"\n    cur = [hashlib.sha256(x.encode()).hexdigest() for x in leaves]\n    while len(cur) > 1:\n        if len(cur) % 2 == 1:\n            cur.append(cur[-1])\n        cur = [hashlib.sha256((cur[i] + cur[i + 1]).encode()).hexdigest() for i in range(0, len(cur), 2)]\n    return cur[0]",
    "aTest": "r1 = merkle_audit_root([\"e1\", \"e2\", \"e3\"])\nr2 = merkle_audit_root([\"e1\", \"e2\", \"e4\"])\nassert len(r1) == 64 and r1 != r2\nassert merkle_audit_root([\"solo\"]) == merkle_audit_root([\"solo\"])\nassert merkle_audit_root([]) == \"\"\nprint('All checks passed.')"
  },
  {
    "day": 52,
    "fallbackTitle": "AI Incident Response Playbooks: Kill-Switch Circuit Breakers, Canary Rollback & Root-Cause Triage",
    "eTitle": "Safety Error-Budget Circuit Breaker (`OPEN -> HALF_OPEN -> CLOSED`)",
    "eDesc": "Implement `SafetyBreaker(max_violations: int, half_open_successes: int)`: start `\"CLOSED\"`; `record(unsafe: bool) -> str` transitions `\"CLOSED -> OPEN\"` when consecutive unsafe hits `max_violations`; `probe_half_open()` sets `\"HALF_OPEN\"`; in `\"HALF_OPEN\"`, `half_open_successes` safe checks close circuit while any unsafe re-opens.",
    "eStarter": "class SafetyBreaker:\n    def __init__(self, max_violations: int, half_open_successes: int):\n        # TODO\n        pass\n\n    def record(self, unsafe: bool) -> str:\n        # TODO\n        pass\n\n    def probe_half_open(self):\n        # TODO\n        pass",
    "eHint": "class SafetyBreaker:\n    def __init__(self, max_violations: int, half_open_successes: int):\n        self.max_v = max_violations\n        self.need_ok = half_open_successes\n        self.state = \"CLOSED\"\n        self.v_cnt = 0\n        self.ok_cnt = 0\n\n    def record(self, unsafe: bool) -> str:\n        if self.state == \"CLOSED\":\n            self.v_cnt = (self.v_cnt + 1) if unsafe else 0\n            if self.v_cnt >= self.max_v:\n                self.state = \"OPEN\"\n        elif self.state == \"HALF_OPEN\":\n            if unsafe:\n                self.state = \"OPEN\"\n                self.ok_cnt = 0\n            else:\n                self.ok_cnt += 1\n                if self.ok_cnt >= self.need_ok:\n                    self.state = \"CLOSED\"\n                    self.v_cnt = self.ok_cnt = 0\n        return self.state\n\n    def probe_half_open(self):\n        if self.state == \"OPEN\":\n            self.state = \"HALF_OPEN\"\n            self.ok_cnt = 0",
    "eTest": "sb = SafetyBreaker(2, 2)\nassert sb.record(True) == \"CLOSED\"\nassert sb.record(True) == \"OPEN\"\nsb.probe_half_open()\nassert sb.record(False) == \"HALF_OPEN\" and sb.record(False) == \"CLOSED\"\nprint('All checks passed.')",
    "aTitle": "Canary Rollout Safety Auto-Rollback Controller",
    "aDesc": "Write `canary_rollout_decision(canary_pct: int, tox_rate: float, base_tox_rate: float, max_multiplier: float = 1.5) -> dict`: if `tox_rate > max(0.005, base_tox_rate * max_multiplier)`, rollback to `0%` (`\"action\": \"rollback\"`); else advance step `min(100, canary_pct * 2 or 5)` (`\"action\": \"promote\"`).",
    "aStarter": "def canary_rollout_decision(canary_pct: int, tox_rate: float, base_tox_rate: float, max_multiplier: float = 1.5) -> dict:\n    # TODO\n    pass",
    "aHint": "def canary_rollout_decision(canary_pct: int, tox_rate: float, base_tox_rate: float, max_multiplier: float = 1.5) -> dict:\n    if tox_rate > max(0.005, base_tox_rate * max_multiplier):\n        return {\"action\": \"rollback\", \"next_pct\": 0}\n    nxt = min(100, canary_pct * 2 if canary_pct > 0 else 5)\n    return {\"action\": \"promote\", \"next_pct\": nxt}",
    "aTest": "assert canary_rollout_decision(10, 0.03, 0.01, 1.5) == {\"action\": \"rollback\", \"next_pct\": 0}\nassert canary_rollout_decision(10, 0.012, 0.01, 1.5) == {\"action\": \"promote\", \"next_pct\": 20}\nassert canary_rollout_decision(60, 0.001, 0.001, 1.5) == {\"action\": \"promote\", \"next_pct\": 100}\nprint('All checks passed.')"
  },
  {
    "day": 53,
    "fallbackTitle": "EU AI Act Risk Tier Classification & NIST AI RMF (Govern, Map, Measure, Manage) Compliance",
    "eTitle": "EU AI Act Regulatory Risk Tier Classifier & Obligatory Annex Checklist",
    "eDesc": "Write `classify_eu_ai_tier(domain: str, uses_subliminal_or_scoring: bool, interacts_with_humans: bool) -> dict`: classify `\"prohibited\"` if `uses_subliminal_or_scoring`, `\"high_risk\"` if domain in `{\"biometrics\", \"hiring\", \"credit\", \"medical\", \"critical_infra\"}`, `\"limited_transparency\"` if `interacts_with_humans`, else `\"minimal_risk\"`, attaching required controls.",
    "eStarter": "def classify_eu_ai_tier(domain: str, uses_subliminal_or_scoring: bool, interacts_with_humans: bool) -> dict:\n    # TODO\n    pass",
    "eHint": "def classify_eu_ai_tier(domain: str, uses_subliminal_or_scoring: bool, interacts_with_humans: bool) -> dict:\n    if uses_subliminal_or_scoring:\n        return {\"tier\": \"prohibited\", \"controls\": [\"deployment_banned\"]}\n    if domain in {\"biometrics\", \"hiring\", \"credit\", \"medical\", \"critical_infra\"}:\n        return {\"tier\": \"high_risk\", \"controls\": [\"conformity_assessment\", \"logging\", \"human_oversight\"]}\n    if interacts_with_humans:\n        return {\"tier\": \"limited_transparency\", \"controls\": [\"ai_disclosure\"]}\n    return {\"tier\": \"minimal_risk\", \"controls\": []}",
    "eTest": "assert classify_eu_ai_tier(\"retail\", True, True)[\"tier\"] == \"prohibited\"\nassert classify_eu_ai_tier(\"hiring\", False, False)[\"tier\"] == \"high_risk\"\nassert classify_eu_ai_tier(\"support\", False, True)[\"tier\"] == \"limited_transparency\"\nassert classify_eu_ai_tier(\"spam_filter\", False, False)[\"tier\"] == \"minimal_risk\"\nprint('All checks passed.')",
    "aTitle": "NIST AI RMF Four-Function Maturity Scorer (`Govern, Map, Measure, Manage`)",
    "aDesc": "Write `nist_rmf_audit(evidence: dict[str, list[bool]]) -> dict`: compute completion ratio across keys `(\"govern\", \"map\", \"measure\", \"manage\")` (0.0 if missing), flag weakest function, and pass `\"audit_ready\": all >= 0.8`.",
    "aStarter": "def nist_rmf_audit(evidence: dict[str, list[bool]]) -> dict:\n    # TODO\n    pass",
    "aHint": "def nist_rmf_audit(evidence: dict[str, list[bool]]) -> dict:\n    funcs = (\"govern\", \"map\", \"measure\", \"manage\")\n    scores = {f: round(sum(evidence.get(f, [])) / len(evidence[f]), 2) if evidence.get(f) else 0.0 for f in funcs}\n    weakest = min(funcs, key=lambda f: (scores[f], f))\n    return {\"scores\": scores, \"weakest\": weakest, \"audit_ready\": all(v >= 0.8 for v in scores.values())}",
    "aTest": "r1 = nist_rmf_audit({\"govern\": [True], \"map\": [True, True], \"measure\": [True, False], \"manage\": [True]})\nassert r1[\"weakest\"] == \"measure\" and r1[\"audit_ready\"] is False\nr2 = nist_rmf_audit({f: [True, True] for f in (\"govern\", \"map\", \"measure\", \"manage\")})\nassert r2[\"audit_ready\"] is True\nassert nist_rmf_audit({})[\"scores\"][\"govern\"] == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 54,
    "fallbackTitle": "Training Data Hygiene: License Filtering, CSAM/Toxicity Scrubbing & Canary Extraction Tests",
    "eTitle": "Pre-Training Dataset Hygiene & License Compliance Pipeline",
    "eDesc": "Write `filter_training_corpus(docs: list[dict], allowed_licenses: set[str], blocked_hashes: set[str], max_tox: float = 0.7) -> tuple[list[str], dict[str, int]]`: reject docs failing hash blocklist (`\"blocked_hash\"`), disallowed SPDX license (`\"disallowed_license\"`), or `tox_score > max_tox` (`\"toxicity\"`), returning `(kept_ids, drop_counts)`.",
    "eStarter": "def filter_training_corpus(docs: list[dict], allowed_licenses: set[str], blocked_hashes: set[str], max_tox: float = 0.7) -> tuple[list[str], dict[str, int]]:\n    # TODO\n    pass",
    "eHint": "def filter_training_corpus(docs: list[dict], allowed_licenses: set[str], blocked_hashes: set[str], max_tox: float = 0.7) -> tuple[list[str], dict[str, int]]:\n    kept = []\n    drops = {\"blocked_hash\": 0, \"disallowed_license\": 0, \"toxicity\": 0}\n    for d in docs:\n        if d[\"sha256\"] in blocked_hashes:\n            drops[\"blocked_hash\"] += 1\n        elif d[\"license\"] not in allowed_licenses:\n            drops[\"disallowed_license\"] += 1\n        elif d[\"tox_score\"] > max_tox:\n            drops[\"toxicity\"] += 1\n        else:\n            kept.append(d[\"id\"])\n    return kept, drops",
    "eTest": "ds = [{\"id\": \"d1\", \"sha256\": \"bad\", \"license\": \"MIT\", \"tox_score\": 0.1}, {\"id\": \"d2\", \"sha256\": \"ok\", \"license\": \"CC-BY\", \"tox_score\": 0.2}, {\"id\": \"d3\", \"sha256\": \"ok2\", \"license\": \"MIT\", \"tox_score\": 0.9}]\nkept, drops = filter_training_corpus(ds, {\"MIT\", \"Apache-2.0\"}, {\"bad\"}, 0.7)\nassert kept == []\nassert drops == {\"blocked_hash\": 1, \"disallowed_license\": 1, \"toxicity\": 1}\nk2, _ = filter_training_corpus([{\"id\": \"d4\", \"sha256\": \"ok\", \"license\": \"MIT\", \"tox_score\": 0.1}], {\"MIT\"}, set(), 0.7)\nassert k2 == [\"d4\"]\nprint('All checks passed.')",
    "aTitle": "Carlini Canary Memorization Exposure Score Calculator (`log2(|R|) - log2(rank)`)",
    "aDesc": "Write `canary_exposure_score(candidate_ranks: list[int], total_space_size: int) -> float`: given exact rank (1-based) of inserted secret canary among `total_space_size` decoys across candidates, compute Carlini exposure `log2(total_space_size) - log2(median_rank)` rounded to 4 decimals (flagging high memorization when exposure approaches `log2(space)`).",
    "aStarter": "import math, statistics\n\ndef canary_exposure_score(candidate_ranks: list[int], total_space_size: int) -> float:\n    # TODO\n    pass",
    "aHint": "import math, statistics\n\ndef canary_exposure_score(candidate_ranks: list[int], total_space_size: int) -> float:\n    med = statistics.median(candidate_ranks)\n    return round(math.log2(total_space_size) - math.log2(max(1.0, med)), 4)",
    "aTest": "assert canary_exposure_score([1, 1, 1], 1024) == 10.0\nassert canary_exposure_score([512], 1024) == 1.0\nassert canary_exposure_score([2, 2], 1024) == 9.0\nprint('All checks passed.')"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11: Cryptographic Governance Ledger & Regulatory Compliance Auditor",
    "eTitle": "Milestone 11A: Chained Incident Receipt Logger & Tamper Detector",
    "eDesc": "Write `seal_governance_events(events: list[dict], secret: str) -> list[dict]`: compute sequential SHA-256 chain hash `h_i = sha256(f\"{prev}|{json.dumps(ev, sort_keys=True)}\")` starting `prev = \"0\" * 64` and attach HMAC-SHA256 `receipt = hmac(secret, h_i)`, returning list of sealed envelopes `{\"seq\": i, \"hash\": h_i, \"receipt\": sig, \"event\": ev}`.",
    "eStarter": "import hashlib, hmac, json\n\ndef seal_governance_events(events: list[dict], secret: str) -> list[dict]:\n    # TODO\n    pass",
    "eHint": "import hashlib, hmac, json\n\ndef seal_governance_events(events: list[dict], secret: str) -> list[dict]:\n    prev = \"0\" * 64\n    out = []\n    for i, ev in enumerate(events):\n        payload = json.dumps(ev, sort_keys=True)\n        h = hashlib.sha256(f\"{prev}|{payload}\".encode()).hexdigest()\n        sig = hmac.new(secret.encode(), h.encode(), hashlib.sha256).hexdigest()\n        out.append({\"seq\": i, \"hash\": h, \"receipt\": sig, \"event\": ev})\n        prev = h\n    return out",
    "eTest": "sealed = seal_governance_events([{\"act\": \"deploy\"}, {\"act\": \"rollback\"}], \"key\")\nassert len(sealed) == 2 and sealed[0][\"seq\"] == 0 and sealed[1][\"seq\"] == 1\nassert sealed[0][\"hash\"] != sealed[1][\"hash\"] and len(sealed[0][\"receipt\"]) == 64\nassert seal_governance_events([], \"key\") == []\nprint('All checks passed.')",
    "aTitle": "Milestone 11B: Model Release Governance Approval Policy Gate",
    "aDesc": "Write `approve_model_release(tier: str, nist_scores: dict[str, float], audit_chain_valid: bool, canary_tox_ok: bool) -> tuple[bool, list[str]]`: block `\"prohibited\"` tier (`\"prohibited_tier\"`), broken audit chain (`\"broken_ledger\"`), canary toxicity (`\"canary_failed\"`), or any NIST function `< 0.8` when `tier == \"high_risk\"` (`\"nist_incomplete\"`).",
    "aStarter": "def approve_model_release(tier: str, nist_scores: dict[str, float], audit_chain_valid: bool, canary_tox_ok: bool) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "def approve_model_release(tier: str, nist_scores: dict[str, float], audit_chain_valid: bool, canary_tox_ok: bool) -> tuple[bool, list[str]]:\n    errs = []\n    if tier == \"prohibited\": errs.append(\"prohibited_tier\")\n    if not audit_chain_valid: errs.append(\"broken_ledger\")\n    if not canary_tox_ok: errs.append(\"canary_failed\")\n    if tier == \"high_risk\" and any(nist_scores.get(k, 0.0) < 0.8 for k in (\"govern\", \"map\", \"measure\", \"manage\")):\n        errs.append(\"nist_incomplete\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "aTest": "good_n = {\"govern\": 0.9, \"map\": 0.9, \"measure\": 0.9, \"manage\": 0.9}\nassert approve_model_release(\"high_risk\", good_n, True, True) == (True, [])\nassert approve_model_release(\"prohibited\", good_n, False, False) == (False, [\"broken_ledger\", \"canary_failed\", \"prohibited_tier\"])\nassert approve_model_release(\"high_risk\", {**good_n, \"measure\": 0.5}, True, True) == (False, [\"nist_incomplete\"])\nprint('All checks passed.')"
  },
  {
    "day": 56,
    "fallbackTitle": "Statistical LLM Watermarking: Green-List Token Logit Bias & Z-Score Detection",
    "eTitle": "Kirchenbauer Green-List Red/Green Token Bias & One-Proportion Z-Test Detector",
    "eDesc": "Write `detect_greenlist_watermark(token_ids: list[int], secret_salt: str, gamma: float = 0.5, z_thresh: float = 2.0) -> dict`: for each `t >= 1`, determine green-list membership of `token_ids[t]` using deterministic `sha256(f\"{secret_salt}:{token_ids[t-1]}:{token_ids[t]}\")` last hex char `< int(gamma * 16)` (or float mod `< gamma`); compute Z-score `(green_count - gamma * T) / sqrt(T * gamma * (1 - gamma))` over `T = len(token_ids) - 1` (`rounded 4`).",
    "eStarter": "import hashlib, math\n\ndef detect_greenlist_watermark(token_ids: list[int], secret_salt: str, gamma: float = 0.5, z_thresh: float = 2.0) -> dict:\n    # TODO\n    pass",
    "eHint": "import hashlib, math\n\ndef detect_greenlist_watermark(token_ids: list[int], secret_salt: str, gamma: float = 0.5, z_thresh: float = 2.0) -> dict:\n    t_cnt = max(0, len(token_ids) - 1)\n    if t_cnt == 0:\n        return {\"z_score\": 0.0, \"watermarked\": False, \"green_count\": 0}\n    greens = 0\n    for i in range(1, len(token_ids)):\n        u = (int(hashlib.sha256(f\"{secret_salt}:{token_ids[i-1]}:{token_ids[i]}\".encode()).hexdigest()[:8], 16) % 10000) / 10000.0\n        if u < gamma:\n            greens += 1\n    z = (greens - gamma * t_cnt) / math.sqrt(t_cnt * gamma * (1.0 - gamma))\n    return {\"z_score\": round(z, 4), \"watermarked\": z >= z_thresh, \"green_count\": greens}",
    "eTest": "import hashlib\ntoks = [1]\nfor _ in range(30):\n    prev = toks[-1]\n    nxt = next(c for c in range(100) if (int(hashlib.sha256(f\"sec:{prev}:{c}\".encode()).hexdigest()[:8], 16) % 10000) / 10000.0 < 0.25)\n    toks.append(nxt)\nwm = detect_greenlist_watermark(toks, \"sec\", gamma=0.25, z_thresh=2.0)\nassert wm[\"watermarked\"] is True and wm[\"green_count\"] == 30\nassert detect_greenlist_watermark([1], \"sec\")[\"watermarked\"] is False\nassert detect_greenlist_watermark([1, 2, 3, 4], \"other\", 0.5, 10.0)[\"watermarked\"] is False\nprint('All checks passed.')",
    "aTitle": "Green-List Logit Bias Injector Kernel (`logits[green] += delta`)",
    "aDesc": "Write `apply_watermark_bias(logits: list[float], green_ids: set[int], delta: float) -> list[float]`: add `delta` strictly to logits whose vocab index is in `green_ids`, leaving others untouched.",
    "aStarter": "def apply_watermark_bias(logits: list[float], green_ids: set[int], delta: float) -> list[float]:\n    # TODO\n    pass",
    "aHint": "def apply_watermark_bias(logits: list[float], green_ids: set[int], delta: float) -> list[float]:\n    return [round(v + (delta if i in green_ids else 0.0), 6) for i, v in enumerate(logits)]",
    "aTest": "assert apply_watermark_bias([1.0, 2.0, 3.0], {0, 2}, 2.5) == [3.5, 2.0, 5.5]\nassert apply_watermark_bias([1.0, 2.0], set(), 5.0) == [1.0, 2.0]\nassert apply_watermark_bias([], {0}, 2.0) == []\nprint('All checks passed.')"
  },
  {
    "day": 57,
    "fallbackTitle": "Reward Hacking & Goodhart's Law: KL-Divergence Penalty & Reward Model Ensembles",
    "eTitle": "KL-Penalized RLHF Objective & Ensemble Disagreement Uncertainty Bonus/Penalty",
    "eDesc": "Write `conservative_kl_reward(rm_scores: list[float], kl_div: float, beta: float = 0.05, lam_var: float = 1.0) -> dict`: compute ensemble mean `mu`, population std `sd`, conservative lower-confidence reward `mu - lam_var * sd - beta * kl_div` rounded to 6 decimals.",
    "eStarter": "import math\n\ndef conservative_kl_reward(rm_scores: list[float], kl_div: float, beta: float = 0.05, lam_var: float = 1.0) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef conservative_kl_reward(rm_scores: list[float], kl_div: float, beta: float = 0.05, lam_var: float = 1.0) -> dict:\n    mu = sum(rm_scores) / len(rm_scores)\n    sd = math.sqrt(sum((x - mu) ** 2 for x in rm_scores) / len(rm_scores))\n    eff = mu - lam_var * sd - beta * kl_div\n    return {\"mean\": round(mu, 6), \"std\": round(sd, 6), \"effective_reward\": round(eff, 6)}",
    "eTest": "r_agree = conservative_kl_reward([4.0, 4.0], 2.0, 0.1, 1.0)\nr_hack = conservative_kl_reward([6.0, 2.0], 2.0, 0.1, 1.0)\nassert r_agree[\"effective_reward\"] == 3.8\nassert r_hack[\"std\"] == 2.0 and r_hack[\"effective_reward\"] == 1.8\nassert r_agree[\"effective_reward\"] > r_hack[\"effective_reward\"]\nprint('All checks passed.')",
    "aTitle": "Length-Bias & Sycophancy Goodhart Drift Monitor (`corr(len, reward)`)",
    "aDesc": "Write `detect_length_reward_hacking(lengths: list[float], rewards: list[float], corr_thresh: float = 0.7) -> dict`: compute Pearson correlation `r` between response length and RM score (0.0 if zero variance), flagging `\"length_gaming\": r >= corr_thresh` (rounded 4).",
    "aStarter": "import math\n\ndef detect_length_reward_hacking(lengths: list[float], rewards: list[float], corr_thresh: float = 0.7) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef detect_length_reward_hacking(lengths: list[float], rewards: list[float], corr_thresh: float = 0.7) -> dict:\n    n = len(lengths)\n    ml, mr = sum(lengths) / n, sum(rewards) / n\n    dl = [x - ml for x in lengths]\n    dr = [y - mr for y in rewards]\n    den = math.sqrt(sum(a * a for a in dl) * sum(b * b for b in dr))\n    r = round(sum(a * b for a, b in zip(dl, dr)) / den, 4) if den > 1e-12 else 0.0\n    return {\"pearson_r\": r, \"length_gaming\": r >= corr_thresh}",
    "aTest": "assert detect_length_reward_hacking([10, 50, 100], [1.0, 3.0, 5.0], 0.7)[\"length_gaming\"] is True\nassert detect_length_reward_hacking([10, 50, 100], [3.0, 3.0, 3.0], 0.7) == {\"pearson_r\": 0.0, \"length_gaming\": False}\nassert detect_length_reward_hacking([10, 50, 100], [5.0, 3.0, 1.0], 0.7)[\"length_gaming\"] is False\nprint('All checks passed.')"
  },
  {
    "day": 58,
    "fallbackTitle": "Constitutional AI (CAI): Critique-and-Revision Self-Alignment Loops",
    "eTitle": "Iterative Constitutional Critique-and-Revision Harness",
    "eDesc": "Write `constitutional_revise(initial: str, rules: list[str], critique_fn, revise_fn, max_rounds: int) -> dict`: loop up to `max_rounds`; collect all violated rule names via `critique_fn(text, rules) -> list[str]`. Stop early when violations empty (`\"aligned\": True`), else revise `text = revise_fn(text, violations)`.",
    "eStarter": "def constitutional_revise(initial: str, rules: list[str], critique_fn, revise_fn, max_rounds: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def constitutional_revise(initial: str, rules: list[str], critique_fn, revise_fn, max_rounds: int) -> dict:\n    cur = initial\n    rounds = 0\n    for _ in range(max_rounds):\n        viols = critique_fn(cur, rules)\n        if not viols:\n            return {\"aligned\": True, \"rounds\": rounds, \"final_text\": cur}\n        cur = revise_fn(cur, viols)\n        rounds += 1\n    rem = critique_fn(cur, rules)\n    return {\"aligned\": len(rem) == 0, \"rounds\": rounds, \"final_text\": cur}",
    "eTest": "crit = lambda txt, rs: [r for r in rs if r in txt]\nrev = lambda txt, vs: txt.replace(vs[0], \"safe\")\nr = constitutional_revise(\"bad1 bad2\", [\"bad1\", \"bad2\"], crit, rev, 3)\nassert r == {\"aligned\": True, \"rounds\": 2, \"final_text\": \"safe safe\"}\nassert constitutional_revise(\"bad1\", [\"bad1\"], crit, lambda t, v: t, 2)[\"aligned\"] is False\nassert constitutional_revise(\"clean\", [\"bad1\"], crit, rev, 2) == {\"aligned\": True, \"rounds\": 0, \"final_text\": \"clean\"}\nprint('All checks passed.')",
    "aTitle": "RLAIF Constitutional Pairwise Preference Dataset Formatter",
    "aDesc": "Write `build_rlaif_pairs(prompts_triples: list[tuple[str, str, str, int]]) -> list[dict]`: each tuple `(prompt, resp_a, resp_b, winner_idx)` where `winner_idx` in `{0, 1}` emits DPO training sample `{\"prompt\": p, \"chosen\": ..., \"rejected\": ...}` (skip ties where `winner_idx == -1`).",
    "aStarter": "def build_rlaif_pairs(prompts_triples: list[tuple[str, str, str, int]]) -> list[dict]:\n    # TODO\n    pass",
    "aHint": "def build_rlaif_pairs(prompts_triples: list[tuple[str, str, str, int]]) -> list[dict]:\n    out = []\n    for p, a, b, w in prompts_triples:\n        if w == 0:\n            out.append({\"prompt\": p, \"chosen\": a, \"rejected\": b})\n        elif w == 1:\n            out.append({\"prompt\": p, \"chosen\": b, \"rejected\": a})\n    return out",
    "aTest": "r = build_rlaif_pairs([(\"q1\", \"good\", \"bad\", 0), (\"q2\", \"bad\", \"good\", 1), (\"q3\", \"x\", \"y\", -1)])\nassert len(r) == 2\nassert r[0][\"chosen\"] == \"good\" and r[1][\"chosen\"] == \"good\"\nassert build_rlaif_pairs([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 59,
    "fallbackTitle": "Production Safety Drift Monitoring: Refusal Rate Spikes, Toxicity PSI & Alert Escalation",
    "eTitle": "Production Safety Telemetry Anomaly & Refusal-Spike Alert Engine",
    "eDesc": "Write `evaluate_safety_drift(baseline: dict, live: dict) -> dict`: check absolute refusal rate spike `(live[\"refusal\"] - baseline[\"refusal\"]) >= 0.05` (`\"refusal_spike\"`), `live[\"toxicity\"] > max(0.01, baseline[\"toxicity\"] * 2.0)` (`\"toxicity_surge\"`), and `live[\"tox_psi\"] > 0.25` (`\"distribution_shift\"`). Return `{\"severity\": \"page\"|\"warn\"|\"ok\", \"alerts\": sorted_list}` (`\"page\"` if `\"toxicity_surge\"`, `\"warn\"` if non-empty, else `\"ok\"`).",
    "eStarter": "def evaluate_safety_drift(baseline: dict, live: dict) -> dict:\n    # TODO\n    pass",
    "eHint": "def evaluate_safety_drift(baseline: dict, live: dict) -> dict:\n    alerts = []\n    if (live[\"refusal\"] - baseline[\"refusal\"]) >= 0.05:\n        alerts.append(\"refusal_spike\")\n    if live[\"toxicity\"] > max(0.01, baseline[\"toxicity\"] * 2.0):\n        alerts.append(\"toxicity_surge\")\n    if live[\"tox_psi\"] > 0.25:\n        alerts.append(\"distribution_shift\")\n    alerts.sort()\n    sev = \"page\" if \"toxicity_surge\" in alerts else (\"warn\" if alerts else \"ok\")\n    return {\"severity\": sev, \"alerts\": alerts}",
    "eTest": "b = {\"refusal\": 0.04, \"toxicity\": 0.005}\nassert evaluate_safety_drift(b, {\"refusal\": 0.05, \"toxicity\": 0.006, \"tox_psi\": 0.08}) == {\"severity\": \"ok\", \"alerts\": []}\nassert evaluate_safety_drift(b, {\"refusal\": 0.12, \"toxicity\": 0.02, \"tox_psi\": 0.3}) == {\"severity\": \"page\", \"alerts\": [\"distribution_shift\", \"refusal_spike\", \"toxicity_surge\"]}\nassert evaluate_safety_drift(b, {\"refusal\": 0.11, \"toxicity\": 0.005, \"tox_psi\": 0.1})[\"severity\"] == \"warn\"\nprint('All checks passed.')",
    "aTitle": "Rolling Window Page-Hinkley Refusal Rate Change-Point Detector",
    "aDesc": "Write `detect_refusal_changepoint(series: list[float], delta: float = 0.01, lam: float = 0.1) -> int | None`: run standard Page-Hinkley upward shift detector initializing running mean `m_t`, cumulative `U_t += x_t - m_t - delta`, `min_U = min(min_U, U_t)`; return first 0-based index `t` where `(U_t - min_U) > lam` (else `None`).",
    "aStarter": "def detect_refusal_changepoint(series: list[float], delta: float = 0.01, lam: float = 0.1):\n    # TODO\n    pass",
    "aHint": "def detect_refusal_changepoint(series: list[float], delta: float = 0.01, lam: float = 0.1):\n    total = 0.0\n    u = 0.0\n    min_u = 0.0\n    for i, x in enumerate(series):\n        total += x\n        mean = total / (i + 1)\n        u = u + (x - mean - delta)\n        min_u = min(min_u, u)\n        if (u - min_u) > lam:\n            return i\n    return None",
    "aTest": "assert detect_refusal_changepoint([0.05, 0.05, 0.05, 0.25, 0.25, 0.25], 0.01, 0.1) is not None\nassert detect_refusal_changepoint([0.05, 0.05, 0.05, 0.05], 0.01, 0.1) is None\nassert detect_refusal_changepoint([0.0, 0.5], 0.01, 0.1) == 1\nprint('All checks passed.')"
  },
  {
    "day": 60,
    "fallbackTitle": "Milestone 12 Capstone: Enterprise Sovereign AI Safety & Alignment Control Plane",
    "eTitle": "Milestone 12A: End-to-End Sovereign Defense-in-Depth Turn Coordinator",
    "eDesc": "Write `process_governed_turn(user_text: str, model_fn, banned_input: list[str], valid_docs: set[str]) -> dict`: (1) NFKC-normalize and reject banned phrases (`\"status\": \"blocked_input\"`); (2) generate reply via `model_fn(clean)`; (3) strip unverified `[doc:...]` refs not in `valid_docs` and mask emails (`[EMAIL_REDACTED]`); (4) return `{\"status\": \"ok\", \"reply\": final_reply, \"audit_hash\": sha256(final_reply)}`.",
    "eStarter": "import hashlib, re, unicodedata\n\ndef process_governed_turn(user_text: str, model_fn, banned_input: list[str], valid_docs: set[str]) -> dict:\n    # TODO\n    pass",
    "eHint": "import hashlib, re, unicodedata\n\ndef process_governed_turn(user_text: str, model_fn, banned_input: list[str], valid_docs: set[str]) -> dict:\n    clean = unicodedata.normalize(\"NFKC\", user_text)\n    low = clean.lower()\n    if any(b.lower() in low for b in banned_input):\n        return {\"status\": \"blocked_input\", \"reply\": \"\", \"audit_hash\": hashlib.sha256(b\"blocked\").hexdigest()}\n    raw = model_fn(clean)\n    s = re.sub(r\"\\[doc:([A-Za-z0-9_-]+)\\]\", lambda m: m.group(0) if m.group(1) in valid_docs else \"[UNVERIFIED]\", raw)\n    s = re.sub(r\"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+\", \"[EMAIL_REDACTED]\", s)\n    return {\"status\": \"ok\", \"reply\": s, \"audit_hash\": hashlib.sha256(s.encode()).hexdigest()}",
    "eTest": "r1 = process_governed_turn(\"bypass policy now\", lambda x: \"ok\", [\"bypass policy\"], {\"d1\"})\nassert r1[\"status\"] == \"blocked_input\" and len(r1[\"audit_hash\"]) == 64\nr2 = process_governed_turn(\"hello\", lambda x: \"Mail me@x.io [doc:d1] [doc:nope]\", [\"bypass\"], {\"d1\"})\nassert r2[\"status\"] == \"ok\" and r2[\"reply\"] == \"Mail [EMAIL_REDACTED] [doc:d1] [UNVERIFIED]\"\nassert len(r2[\"audit_hash\"]) == 64\nprint('All checks passed.')",
    "aTitle": "Milestone 12B: Full Enterprise Production Safety Readiness Sign-Off Gate",
    "aDesc": "Write `sovereign_signoff(asr_pct: float, ece: float, impact_ratio: float, audit_valid: bool) -> tuple[bool, list[str]]`: require `asr_pct <= 1.0` (`\"asr\"`), `ece <= 0.05` (`\"ece\"`), `impact_ratio >= 0.8` (`\"fairness\"`), and `audit_valid` (`\"ledger\"`), returning `(passed, sorted_failures)`.",
    "aStarter": "def sovereign_signoff(asr_pct: float, ece: float, impact_ratio: float, audit_valid: bool) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "aHint": "def sovereign_signoff(asr_pct: float, ece: float, impact_ratio: float, audit_valid: bool) -> tuple[bool, list[str]]:\n    errs = []\n    if asr_pct > 1.0: errs.append(\"asr\")\n    if ece > 0.05: errs.append(\"ece\")\n    if impact_ratio < 0.8: errs.append(\"fairness\")\n    if not audit_valid: errs.append(\"ledger\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "aTest": "assert sovereign_signoff(0.4, 0.02, 0.9, True) == (True, [])\nassert sovereign_signoff(2.0, 0.08, 0.7, False) == (False, [\"asr\", \"ece\", \"fairness\", \"ledger\"])\nassert sovereign_signoff(1.0, 0.05, 0.8, True) == (True, [])\nprint('All checks passed.')"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['safe-py'] || []).map((entry) => [entry.day, entry]));

export const SAFETY_PYTHON_MONTH2_CONFIGS: DayConfig[] = RAW_M2_DAY_TASKS.map((t) => {
  const indexed = indexByDay.get(t.day);
  return {
    day: t.day,
    title: indexed?.title || t.fallbackTitle,
    desc: indexed?.goal || `${t.fallbackTitle} — hands-on coding labs.`,
    syllabus: indexed?.summary?.length ? indexed.summary : [t.eTitle, t.aTitle],
    eLanguage: 'python',
    aLanguage: 'python',
    eTitle: t.eTitle,
    eDesc: t.eDesc,
    eStarter: t.eStarter,
    eHint: t.eHint,
    eTest: t.eTest,
    aTitle: t.aTitle,
    aDesc: t.aDesc,
    aStarter: t.aStarter,
    aHint: t.aHint,
    aTest: t.aTest,
  };
});

export const SAFETY_PYTHON_MONTH2_QUESTS: CourseQuest[] = SAFETY_PYTHON_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('safe-py', cfg.day!, cfg)
);
