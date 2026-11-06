import sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

p = Path("src/lib/puzzles/lessonPuzzleEngine.ts")
content = p.read_text(encoding="utf-8").replace('\r\n', '\n')

# 1. Update domain detection
old_domain = """  // Detect domain
  const rawText = `${title} ${concepts.join(' ')} ${codeSnippets.join(' ')}`.toLowerCase();
  let domain = 'general';
  if (rawText.includes('python') || rawText.includes('def ') || rawText.includes('print(')) domain = 'python';
  else if (rawText.includes('react') || rawText.includes('jsx') || rawText.includes('usestate') || rawText.includes('useeffect')) domain = 'react';
  else if (rawText.includes('java') || rawText.includes('public class') || rawText.includes('system.out')) domain = 'java';
  else if (rawText.includes('sql') || rawText.includes('select ') || rawText.includes('where ') || rawText.includes('table')) domain = 'sql';
  else if (rawText.includes('accounting') || rawText.includes('debit') || rawText.includes('credit') || rawText.includes('ledger')) domain = 'accounting';
  else if (rawText.includes('finance') || rawText.includes('dcf') || rawText.includes('npv') || rawText.includes('capital')) domain = 'finance';
  else if (rawText.includes('docker') || rawText.includes('k8s') || rawText.includes('ci/cd') || rawText.includes('pipeline')) domain = 'devops';"""

new_domain = """  // Detect domain (Domain specifics checked prior to general code tokens)
  const rawText = `${title} ${concepts.join(' ')} ${codeSnippets.join(' ')}`.toLowerCase();
  let domain = 'general';
  if (rawText.includes('accounting') || rawText.includes('debit') || rawText.includes('credit') || rawText.includes('ledger') || rawText.includes('tally')) domain = 'accounting';
  else if (rawText.includes('finance') || rawText.includes('dcf') || rawText.includes('npv') || rawText.includes('capital market') || rawText.includes('portfolio')) domain = 'finance';
  else if (rawText.includes('react') || rawText.includes('jsx') || rawText.includes('usestate') || rawText.includes('useeffect')) domain = 'react';
  else if (rawText.includes('java') || rawText.includes('public class') || rawText.includes('system.out')) domain = 'java';
  else if (rawText.includes('sql') || rawText.includes('select ') || rawText.includes('where ') || rawText.includes('table')) domain = 'sql';
  else if (rawText.includes('python') || rawText.includes('def ') || rawText.includes('print(')) domain = 'python';
  else if (rawText.includes('docker') || rawText.includes('k8s') || rawText.includes('ci/cd') || rawText.includes('pipeline')) domain = 'devops';"""

if old_domain in content:
    content = content.replace(old_domain, new_domain)
    print("Updated domain detection order.")
else:
    print("old_domain not found!")

# 2. Add accounting puzzle handler before fallback
insert_anchor = "  if (summary.domain === 'sql' || prefix.includes('sql')) {"
accounting_handler = """  if (summary.domain === 'accounting' || prefix.includes('accounting') || prefix.includes('bcom')) {
    return {
      id: `puzzle-${prefix}-${dayNum}`,
      title: `Day ${dayNum} Double-Entry Ledger Puzzle: Accrual Accounting Flow`,
      missionPrompt: "Arrange the double-entry accounting transactions in the exact order required by GAAP to balance the fundamental accounting equation!",
      type: 'code-reorder',
      blocks: [
        { id: 'acc1', label: '1. Invoice Generation', subtext: 'Debit: Accounts Receivable $120,000', color: 'emerald', category: 'init' },
        { id: 'acc2', label: '2. Liability Booking', subtext: 'Credit: Deferred Revenue $120,000', color: 'cyan', category: 'init' },
        { id: 'acc3', label: '3. Performance Delivery', subtext: 'Debit: Deferred Revenue $10,000', color: 'amber', category: 'transform' },
        { id: 'acc4', label: '4. Revenue Realization', subtext: 'Credit: Subscription Revenue $10,000', color: 'purple', category: 'output' },
        { id: 'decoy1', label: 'GAAP Violation (Cash Basis)', subtext: 'Credit: Immediate Revenue $120,000', color: 'rose', category: 'decoy' },
      ],
      correctOrder: ['acc1', 'acc2', 'acc3', 'acc4'],
      decoyBlockIds: ['decoy1'],
      hint: "Under GAAP accrual rules, unearned upfront payments must sit in Deferred Revenue as a liability until service is delivered month-by-month.",
      successExplanation: "Accrual accounting verified: Matching Principle satisfied and Assets equal Liabilities plus Equity."
    };
  }

  if (summary.domain === 'sql' || prefix.includes('sql')) {"""

if insert_anchor in content:
    content = content.replace(insert_anchor, accounting_handler)
    print("Added accounting handler.")
else:
    print("insert_anchor not found!")

p.write_text(content, encoding="utf-8")
print("Saved lessonPuzzleEngine.ts")
