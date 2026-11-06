# scripts/fix_day45_part5_code.py
import sys
sys.path.insert(0, 'scripts')
from design_day45_data import DAY_45
import json

part1_defs = """interface OrderTicket {
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  orderType: 'MARKET' | 'LIMIT' | 'STOP_LIMIT';
  limitPrice?: number;
  settlementDate: string;
  directives: string[];
  status: 'PENDING' | 'VALIDATING' | 'REJECTED' | 'EXECUTED';
}

class InstitutionalOrderBlueprint {
  private order: OrderTicket;
  constructor(orderId: string) {
    this.order = {
      orderId,
      symbol: '',
      side: 'BUY',
      quantity: 0,
      orderType: 'LIMIT',
      settlementDate: '',
      directives: [],
      status: 'PENDING'
    };
  }
  updateField<K extends keyof OrderTicket>(key: K, value: OrderTicket[K]): void {
    this.order[key] = value;
  }
  getOrder(): OrderTicket {
    return { ...this.order };
  }
}

interface AccountPortfolio {
  settledCashCents: number;
  marginMultiplier: number;
  maxOrderNotionalCents: number;
  currentMarketPriceCents: number;
}

interface CircuitBreakerResult {
  allowed: boolean;
  violations: string[];
  notionalCents: number;
}

class MarginCircuitBreaker {
  private portfolio: AccountPortfolio;
  constructor(portfolio: AccountPortfolio) {
    this.portfolio = portfolio;
  }
  evaluateOrder(shares: number, limitPriceCents: number): CircuitBreakerResult {
    const violations: string[] = [];
    const notionalCents = shares * limitPriceCents;
    if (notionalCents > this.portfolio.maxOrderNotionalCents) {
      violations.push('Order notional exceeds delegated risk limit of $' + (this.portfolio.maxOrderNotionalCents / 100).toLocaleString());
    }
    const totalBuyingPowerCents = this.portfolio.settledCashCents * this.portfolio.marginMultiplier;
    if (notionalCents > totalBuyingPowerCents) {
      violations.push('Insufficient buying power.');
    }
    return { allowed: violations.length === 0, violations, notionalCents };
  }
}

class IntegratedOrderEnsemble {
  private selectedSymbol: string = '';
  private activeDirectives: Set<string> = new Set();
  selectSymbol(s: string): void { this.selectedSymbol = s.toUpperCase(); }
  addDirective(d: string): { success: boolean; conflict?: string } {
    this.activeDirectives.add(d);
    return { success: true };
  }
}

interface MarketHoliday {
  dateIso: string;
  name: string;
}

class SettlementCalendarCoordinator {
  private holidays: Map<string, string> = new Map();
  private minSettlementDate: string;
  constructor(minDate: string, list: MarketHoliday[]) {
    this.minSettlementDate = minDate;
    for (const h of list) this.holidays.set(h.dateIso, h.name);
  }
  isSettlementValid(dateIso: string): { isValid: boolean; reason?: string } {
    if (dateIso < this.minSettlementDate) {
      return { isValid: false, reason: 'Settlement cannot precede T+1 date of ' + this.minSettlementDate };
    }
    const parts = dateIso.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { isValid: false, reason: 'Market closed on weekends' };
    }
    if (this.holidays.has(dateIso)) {
      return { isValid: false, reason: 'Market closed for holiday: ' + this.holidays.get(dateIso) };
    }
    return { isValid: true };
  }
}
"""

existing_part5 = DAY_45['parts'][4]['code']
DAY_45['parts'][4]['code'] = part1_defs + '\n' + existing_part5

with open('scripts/design_day45_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day45_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_45 = ' + json.dumps(DAY_45, indent=2) + '\n')

print('Prepend helper classes to Part 5 code successfully.')
