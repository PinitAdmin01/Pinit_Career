import { generateValidatedTask, type GeneratedTask } from './generateTask';
import type { CompanyProfile } from './companyProfile';
import type { InternshipTaskLanguage } from './types';

export const TIER1_WEB_TICKET_KINDS = [
  'component',
  'component_bug_fix',
  'form_validation',
  'refactor',
  'small_feature',
] as const;

export type Tier1WebTicketKind = (typeof TIER1_WEB_TICKET_KINDS)[number];

export const TIER1_WEB_MONTH1_SKILLS = [
  'React Components',
  'JSX and Element Rendering',
  'Props and Typing',
  'State Management (useState)',
  'Event Handling and Form Inputs',
  'Conditional Rendering and Lists',
  'Component Lifecycle and Effects (useEffect)',
] as const;

export const TIER1_MONTH1_PYTHON_SKILLS = [
  'Python Functions',
  'String Manipulation',
  'Lists and Indexing',
  'Dictionaries and Lookups',
  'Loops and Iteration',
  'Error Handling and Exceptions',
  'Object-Oriented Classes',
] as const;

export const TIER1_TICKET_KINDS = [
  'bug_fix',
  'new_function',
  'data_cleaning',
  'refactor',
  'small_feature',
] as const;

export interface GeneratedTicketResult {
  seq: number;
  kind: string;
  task: GeneratedTask;
  model: string;
}

export type GenerateTier1TasksResult =
  | {
      ok: true;
      tickets: GeneratedTicketResult[];
    }
  | {
      ok: false;
      failedAtSeq: number;
      reasons: string[];
    };

export interface GenerateTier1TasksOptions {
  companyProfile: CompanyProfile;
  seed: string;
  track?: 'python_ai' | 'web_fullstack' | string;
  language?: InternshipTaskLanguage;
  model?: string;
}

/**
 * Curated 5-Milestone NexaCommerce Manifest for Tier 1 (14-Day Simulation).
 * Frozen code contracts and deterministic test suites (V1-V7 compliant).
 */
export const TIER1_PYTHON_MILESTONES: readonly GeneratedTask[] = [
  // Milestone 1 (Days 1-3): Checkout Defect Investigation & Decimal Refactor
  {
    title: 'Milestone 1 (Days 1-3): Checkout Defect Investigation & Decimal Refactor',
    brief:
      'Customer support ticket NC-101 at NexaCommerce: Orders with mixed-case promo codes fail and floating-point math causes penny rounding errors. Recommended 3-Day Roadmap: Day 1: Explore NexaCommerce code and inspect customer logs. Day 2: Inspect the provided failing reproduction test, understand the float rounding discrepancy on $19.99 * 3, and plan the decimal refactoring. Day 3: Refactor calculate_subtotal() and apply_basic_discount() using Python Decimal with ROUND_HALF_UP.',
    starter_code: `def calculate_subtotal(items):
    # BUG: Uses raw floats and crashes on empty items list
    return sum(item['price'] * item['qty'] for item in items)

def apply_basic_discount(subtotal, promo_code=None):
    # BUG: Fails on lowercase 'save10' or whitespace
    if promo_code == "SAVE10":
        return subtotal * 0.10
    return 0.0
`,
    visible_tests: `from decimal import Decimal
items = [{"price": 100.0, "qty": 2}, {"price": 50.0, "qty": 1}]
sub = calculate_subtotal(items)
assert sub == Decimal("250.00")
assert apply_basic_discount(sub, "SAVE10") == Decimal("25.00")
`,
    hidden_tests: `from decimal import Decimal
assert calculate_subtotal([]) == Decimal("0.00")
items_float = [{"price": 19.99, "qty": 3}]
assert calculate_subtotal(items_float) == Decimal("59.97")
sub = calculate_subtotal(items_float)
assert apply_basic_discount(sub, "  save10  ") == Decimal("6.00")
assert apply_basic_discount(sub, None) == Decimal("0.00")
`,
    reference_solution: `from decimal import Decimal, ROUND_HALF_UP

def calculate_subtotal(items):
    total = Decimal("0.00")
    if not items:
        return total
    for item in items:
        price = Decimal(str(item["price"]))
        qty = Decimal(str(item.get("qty", 1)))
        total += price * qty
    return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def apply_basic_discount(subtotal, promo_code=None):
    if not promo_code or not isinstance(promo_code, str):
        return Decimal("0.00")
    code = promo_code.strip().upper()
    if code == "SAVE10":
        return (subtotal * Decimal("0.10")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return Decimal("0.00")
`,
    skills: ['Python Functions', 'Error Handling and Exceptions'],
    sql_setup: null,
  },

  // Milestone 2 (Days 4-6): Tiered Promotional Logic Engine
  {
    title: 'Milestone 2 (Days 4-6): Tiered Promotional Logic Engine',
    brief:
      'Product ticket NC-202 at NexaCommerce: Implement apply_tiered_promotion(subtotal, is_vip, promo_code). Recommended 3-Day Roadmap: Day 4: Review Product requirements for volume discounts. Day 5: Implement logic with boundary checks (subtotal >= $500: 10% non-VIP, 15% VIP; < $500: 5% VIP, 0% non-VIP) and $100 cap. Day 6: Test edge cases (null codes, exact $500.00 boundaries).',
    starter_code: `from decimal import Decimal

MAX_DISCOUNT_CAP = Decimal("100.00")

def apply_tiered_promotion(subtotal, is_vip=False, promo_code=None):
    # TODO: Implement tiered promotional logic with cap enforcement
    pass
`,
    visible_tests: `from decimal import Decimal
assert apply_tiered_promotion(Decimal("600.00"), is_vip=False, promo_code="TIERED") == Decimal("60.00")
assert apply_tiered_promotion(Decimal("1000.00"), is_vip=True, promo_code="TIERED") == Decimal("100.00")
`,
    hidden_tests: `from decimal import Decimal
assert apply_tiered_promotion(Decimal("200.00"), is_vip=True, promo_code="TIERED") == Decimal("10.00")
assert apply_tiered_promotion(Decimal("499.99"), is_vip=False, promo_code="TIERED") == Decimal("0.00")
assert apply_tiered_promotion(Decimal("500.00"), is_vip=False, promo_code=None) == Decimal("0.00")
assert apply_tiered_promotion(Decimal("500.00"), is_vip=False, promo_code="tiered") == Decimal("50.00")
`,
    reference_solution: `from decimal import Decimal, ROUND_HALF_UP

MAX_DISCOUNT_CAP = Decimal("100.00")

def apply_tiered_promotion(subtotal, is_vip=False, promo_code=None):
    if not promo_code or not isinstance(promo_code, str):
        return Decimal("0.00")
    code = promo_code.strip().upper()
    if code != "TIERED":
        return Decimal("0.00")
    threshold = Decimal("500.00")
    if is_vip:
        rate = Decimal("0.15") if subtotal >= threshold else Decimal("0.05")
    else:
        rate = Decimal("0.10") if subtotal >= threshold else Decimal("0.00")
    discount = (subtotal * rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return min(discount, MAX_DISCOUNT_CAP)
`,
    skills: ['Python Functions', 'Error Handling and Exceptions'],
    sql_setup: null,
  },

  // Milestone 3 (Days 7-9): Legacy Data Sanitization & Fast Catalog Lookup
  {
    title: 'Milestone 3 (Days 7-9): Legacy Data Sanitization & Fast Catalog Lookup',
    brief:
      'DB Migration ticket NC-303 at NexaCommerce: Customer records contain corrupted phone numbers, whitespace emails, and negative loyalty points. Catalog lookups use slow linear scans. Recommended 3-Day Roadmap: Day 7: Inspect dirty exports. Day 8: Implement sanitize_customer_record(). Day 9: Implement build_catalog_index() pre-indexing catalog from O(M*N) to O(N+M).',
    starter_code: `def sanitize_customer_record(record):
    # TODO: Clean email, phone digits, and clamp loyalty >= 0
    pass

def build_catalog_index(catalog_list):
    # TODO: Build item_id -> item dict index
    pass
`,
    visible_tests: `raw = {"email": " User@Domain.COM ", "phone": "(123) 456-7890", "loyalty": -25}
res = sanitize_customer_record(raw)
assert res["email"] == "user@domain.com"
assert res["phone"] == "1234567890"
assert res["loyalty"] == 0
`,
    hidden_tests: `assert sanitize_customer_record({"email": None, "phone": None, "loyalty": None})["loyalty"] == 0
assert sanitize_customer_record(None)["email"] == ""
catalog = [{"item_id": "SKU-1", "price": 10}, {"item_id": "SKU-2", "price": 20}]
idx = build_catalog_index(catalog)
assert idx["SKU-1"]["price"] == 10
assert "SKU-2" in idx
`,
    reference_solution: `def sanitize_customer_record(record):
    if not isinstance(record, dict):
        return {"email": "", "phone": "", "loyalty": 0}
    raw_email = record.get("email")
    email = raw_email.strip().lower() if isinstance(raw_email, str) else ""
    raw_phone = record.get("phone")
    phone = "".join(ch for ch in str(raw_phone) if ch.isdigit()) if raw_phone else ""
    raw_loyalty = record.get("loyalty")
    try:
        loyalty = max(0, int(raw_loyalty)) if raw_loyalty is not None else 0
    except (ValueError, TypeError):
        loyalty = 0
    return {"email": email, "phone": phone, "loyalty": loyalty}

def build_catalog_index(catalog_list):
    index = {}
    if not catalog_list or not isinstance(catalog_list, list):
        return index
    for item in catalog_list:
        if isinstance(item, dict) and "item_id" in item:
            index[item["item_id"]] = item
    return index
`,
    skills: ['Dictionaries and Lookups', 'String Manipulation'],
    sql_setup: null,
  },

  // Milestone 4 (Days 10-12): Untrusted Promo Code Sanitization & Resilient Fallback
  {
    title: 'Milestone 4 (Days 10-12): Untrusted Promo Code Sanitization & Resilient Fallback',
    brief:
      'Security & Reliability ticket NC-404 at NexaCommerce: Promo codes must accept only ASCII alphanumeric characters (3-20 chars). Currency conversion must validate fallback_rate and gracefully handle ConnectionError or TimeoutError. Recommended 3-Day Roadmap: Day 10: Whitelist promo codes. Day 11: Validate fallback configuration and trap timeouts. Day 12: Verify test assertions.',
    starter_code: `from decimal import Decimal

def sanitize_promo_code(code_input):
    # TODO: Return stripped uppercase ASCII alphanumeric code (3-20 chars) or None
    pass

def convert_currency_with_fallback(amount, currency, rate_fetcher, fallback_rate=Decimal("1.00")):
    # TODO: Validate fallback_rate; call rate_fetcher; trap ConnectionError, TimeoutError gracefully
    pass
`,
    visible_tests: `from decimal import Decimal
assert sanitize_promo_code("summer2026") == "SUMMER2026"
assert sanitize_promo_code("SAVE-20") is None
def live_rate(c): return Decimal("1.25")
assert convert_currency_with_fallback(Decimal("100.00"), "EUR", live_rate) == Decimal("125.00")
`,
    hidden_tests: `from decimal import Decimal
assert sanitize_promo_code("SAVE'; DROP TABLE--") is None
assert sanitize_promo_code("SAVE²") is None
assert sanitize_promo_code("AB") is None
assert sanitize_promo_code(None) is None

# Valid fallback on network timeout
def flaky_rate(c): raise TimeoutError("Service timeout")
assert convert_currency_with_fallback(Decimal("100.00"), "EUR", flaky_rate, fallback_rate=Decimal("1.10")) == Decimal("110.00")

# Invalid fallback rates must raise ValueError
try:
    convert_currency_with_fallback(Decimal("100.00"), "EUR", flaky_rate, fallback_rate=0)
    assert False, "Must raise ValueError for 0 fallback"
except ValueError:
    pass
`,
    reference_solution: `from decimal import Decimal, ROUND_HALF_UP, InvalidOperation

def sanitize_promo_code(code_input):
    if not code_input or not isinstance(code_input, str):
        return None
    code = code_input.strip()
    if 3 <= len(code) <= 20 and code.isascii() and code.isalnum():
        return code.upper()
    return None

def convert_currency_with_fallback(amount, currency, rate_fetcher, fallback_rate=Decimal("1.00")):
    try:
        fb_dec = Decimal(str(fallback_rate))
        if fb_dec.is_nan() or fb_dec.is_infinite() or fb_dec <= Decimal("0.00"):
            raise ValueError(f"Invalid fallback_rate: {fallback_rate}. Must be a finite positive number.")
    except (InvalidOperation, TypeError):
        raise ValueError(f"Invalid fallback_rate: {fallback_rate}. Must be a finite positive number.")

    amount_dec = Decimal(str(amount))
    try:
        if callable(rate_fetcher):
            raw_rate = Decimal(str(rate_fetcher(currency)))
            if raw_rate.is_nan() or raw_rate.is_infinite() or raw_rate <= Decimal("0.00"):
                rate_dec = fb_dec
            else:
                rate_dec = raw_rate
        else:
            rate_dec = fb_dec
    except (ConnectionError, TimeoutError, InvalidOperation):
        rate_dec = fb_dec
    return (amount_dec * rate_dec).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
`,
    skills: ['String Manipulation', 'Error Handling and Exceptions'],
    sql_setup: null,
  },

  // Milestone 5 (Days 13-14): End-to-End Core Integration & Final Stand-Up
  {
    title: 'Milestone 5 (Days 13-14): End-to-End Core Integration & Final Stand-Up',
    brief:
      'Release ticket NC-505 at NexaCommerce: Integrate NexaCommerceCore order checkout service using pre-loaded helper functions from Milestones 1-4. Recommended 2-Day Roadmap: Day 13: Wire promo sanitization, subtotal, tiered promotion, and currency fallback into process_checkout(). Day 14: Pass regression tests and submit 100-300 word Final Stand-Up Report.',
    starter_code: `from decimal import Decimal, ROUND_HALF_UP, InvalidOperation

# --- PRE-LOADED CANONICAL HELPERS (MILESTONES 1-4) ---
def calculate_subtotal(items):
    total = Decimal("0.00")
    if not items: return total
    for item in items:
        total += Decimal(str(item["price"])) * Decimal(str(item.get("qty", 1)))
    return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def apply_tiered_promotion(subtotal, is_vip=False, promo_code=None):
    if not promo_code or not isinstance(promo_code, str): return Decimal("0.00")
    code = promo_code.strip().upper()
    if code != "TIERED": return Decimal("0.00")
    threshold = Decimal("500.00")
    rate = Decimal("0.15") if (is_vip and subtotal >= threshold) else \\
           Decimal("0.10") if subtotal >= threshold else \\
           Decimal("0.05") if is_vip else Decimal("0.00")
    return min((subtotal * rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), Decimal("100.00"))

def sanitize_promo_code(code_input):
    if not code_input or not isinstance(code_input, str): return None
    c = code_input.strip()
    return c.upper() if (3 <= len(c) <= 20 and c.isascii() and c.isalnum()) else None

def convert_currency_with_fallback(amount, currency, rate_fetcher, fallback_rate=Decimal("1.00")):
    try:
        fb_dec = Decimal(str(fallback_rate))
        if fb_dec.is_nan() or fb_dec.is_infinite() or fb_dec <= Decimal("0.00"):
            raise ValueError(f"Invalid fallback_rate: {fallback_rate}. Must be a finite positive number.")
    except (InvalidOperation, TypeError):
        raise ValueError(f"Invalid fallback_rate: {fallback_rate}. Must be a finite positive number.")

    amount_dec = Decimal(str(amount))
    try:
        if callable(rate_fetcher):
            raw_rate = Decimal(str(rate_fetcher(currency)))
            if raw_rate.is_nan() or raw_rate.is_infinite() or raw_rate <= Decimal("0.00"):
                rate_dec = fb_dec
            else:
                rate_dec = raw_rate
        else:
            rate_dec = fb_dec
    except (ConnectionError, TimeoutError, InvalidOperation):
        rate_dec = fb_dec
    return (amount_dec * rate_dec).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

# --- STUDENT TASK: WIRE NexaCommerceCore ---
class NexaCommerceCore:
    def __init__(self, fallback_rate=Decimal("1.00")):
        self.fallback_rate = fallback_rate

    def process_checkout(self, items, is_vip=False, raw_promo=None, currency="USD", rate_fetcher=None):
        pass
`,
    visible_tests: `from decimal import Decimal
core = NexaCommerceCore()
items = [{"price": "300.00", "qty": 2}]
res = core.process_checkout(items, is_vip=False, raw_promo="tiered")
assert res["subtotal"] == Decimal("600.00")
assert res["discount"] == Decimal("60.00")
assert res["final_total"] == Decimal("540.00")
`,
    hidden_tests: `from decimal import Decimal
core = NexaCommerceCore()
res_bad = core.process_checkout([{"price": "100.00", "qty": 1}], is_vip=False, raw_promo="BAD'; DROP--")
assert res_bad["discount"] == Decimal("0.00")
assert res_bad["final_total"] == Decimal("100.00")
res_empty = core.process_checkout([], is_vip=True, raw_promo="tiered")
assert res_empty["subtotal"] == Decimal("0.00")
assert res_empty["final_total"] == Decimal("0.00")
def flaky_rate(c): raise TimeoutError("Rates service down")
res_curr = core.process_checkout([{"price": "100.00", "qty": 1}], is_vip=False, currency="EUR", rate_fetcher=flaky_rate)
assert res_curr["final_total"] == Decimal("100.00")
`,
    reference_solution: `from decimal import Decimal, ROUND_HALF_UP, InvalidOperation

def calculate_subtotal(items):
    total = Decimal("0.00")
    if not items: return total
    for item in items:
        total += Decimal(str(item["price"])) * Decimal(str(item.get("qty", 1)))
    return total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def apply_tiered_promotion(subtotal, is_vip=False, promo_code=None):
    if not promo_code or not isinstance(promo_code, str): return Decimal("0.00")
    code = promo_code.strip().upper()
    if code != "TIERED": return Decimal("0.00")
    threshold = Decimal("500.00")
    rate = Decimal("0.15") if (is_vip and subtotal >= threshold) else \\
           Decimal("0.10") if subtotal >= threshold else \\
           Decimal("0.05") if is_vip else Decimal("0.00")
    return min((subtotal * rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), Decimal("100.00"))

def sanitize_promo_code(code_input):
    if not code_input or not isinstance(code_input, str): return None
    c = code_input.strip()
    return c.upper() if (3 <= len(c) <= 20 and c.isascii() and c.isalnum()) else None

def convert_currency_with_fallback(amount, currency, rate_fetcher, fallback_rate=Decimal("1.00")):
    try:
        fb_dec = Decimal(str(fallback_rate))
        if fb_dec.is_nan() or fb_dec.is_infinite() or fb_dec <= Decimal("0.00"):
            raise ValueError(f"Invalid fallback_rate: {fallback_rate}. Must be a finite positive number.")
    except (InvalidOperation, TypeError):
        raise ValueError(f"Invalid fallback_rate: {fallback_rate}. Must be a finite positive number.")

    amount_dec = Decimal(str(amount))
    try:
        if callable(rate_fetcher):
            raw_rate = Decimal(str(rate_fetcher(currency)))
            if raw_rate.is_nan() or raw_rate.is_infinite() or raw_rate <= Decimal("0.00"):
                rate_dec = fb_dec
            else:
                rate_dec = raw_rate
        else:
            rate_dec = fb_dec
    except (ConnectionError, TimeoutError, InvalidOperation):
        rate_dec = fb_dec
    return (amount_dec * rate_dec).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

class NexaCommerceCore:
    def __init__(self, fallback_rate=Decimal("1.00")):
        self.fallback_rate = fallback_rate

    def process_checkout(self, items, is_vip=False, raw_promo=None, currency="USD", rate_fetcher=None):
        clean_promo = sanitize_promo_code(raw_promo)
        subtotal = calculate_subtotal(items)
        discount = apply_tiered_promotion(subtotal, is_vip=is_vip, promo_code=clean_promo)
        discounted = max(Decimal("0.00"), subtotal - discount)
        final_total = convert_currency_with_fallback(
            discounted, currency, rate_fetcher, fallback_rate=self.fallback_rate
        )
        return {
            "subtotal": subtotal,
            "discount": discount,
            "final_total": final_total
        }
`,
    skills: ['Object-Oriented Classes', 'Python Functions', 'Error Handling and Exceptions'],
    sql_setup: null,
  },
];

export async function generateTier1Tasks(
  opts: GenerateTier1TasksOptions
): Promise<GenerateTier1TasksResult> {
  const isWeb =
    opts.track === 'web_fullstack' ||
    opts.language === 'typescript' ||
    opts.language === 'tsx';

  // Web Track retains existing seed/generation flow
  if (isWeb) {
    const ticketKinds = TIER1_WEB_TICKET_KINDS;
    const skills = TIER1_WEB_MONTH1_SKILLS;
    const language = opts.language || 'tsx';
    const tickets: GeneratedTicketResult[] = [];

    for (let i = 0; i < ticketKinds.length; i++) {
      const seq = i + 1;
      const kind = ticketKinds[i];
      const ticketSeed = `${opts.seed}-ticket-${seq}-${kind}`;

      const genRes = await generateValidatedTask({
        tier: 't1_job_sim',
        kind,
        skills,
        companyProfile: {
          name: opts.companyProfile.name,
          business: opts.companyProfile.industry,
          description: opts.companyProfile.readme,
        },
        seed: ticketSeed,
        language,
        model: opts.model,
      });

      if (!genRes.ok) {
        return {
          ok: false,
          failedAtSeq: seq,
          reasons: genRes.reasons,
        };
      }

      tickets.push({
        seq,
        kind,
        task: genRes.task,
        model: genRes.model,
      });
    }

    return { ok: true, tickets };
  }

  // Python Track: 5 Curated 14-Day Engineering Milestones (Instant & Deterministic)
  // V1-V7 validation & sandbox execution are pre-verified in CI tests (tests/tier1_milestones.test.ts)
  const companyName = opts.companyProfile?.name?.trim() || 'NexaCommerce';
  const tickets: GeneratedTicketResult[] = TIER1_PYTHON_MILESTONES.map((template, idx) => ({
    seq: idx + 1,
    kind: TIER1_TICKET_KINDS[idx],
    task: {
      ...template,
      brief: template.brief.replace(/NexaCommerce/g, () => companyName),
    },
    model: 'curated-milestone-engine-v1',
  }));

  return { ok: true, tickets };
}
