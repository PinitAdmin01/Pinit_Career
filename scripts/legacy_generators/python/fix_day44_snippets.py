# scripts/fix_day44_snippets.py
import sys
sys.path.insert(0, 'scripts')
from design_day44_data import DAY_44
import json

part1_code = """interface CalendarCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isoString: string;
}

class CalendarMatrixEngine {
  static generateMonthGrid(
    year: number,
    monthIndex: number,
    firstDayMonday: boolean = true,
    minDate?: Date,
    maxDate?: Date
  ): CalendarCell[] {
    const cells: CalendarCell[] = [];
    const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
    const firstDayRaw = new Date(year, monthIndex, 1).getDay();
    const leadingOffset = firstDayMonday ? (firstDayRaw + 6) % 7 : firstDayRaw;

    for (let i = leadingOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateObj = new Date(year, monthIndex - 1, d);
      cells.push(CalendarMatrixEngine.createCell(dateObj, year, monthIndex - 1, d, false, minDate, maxDate));
    }

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(year, monthIndex, d);
      cells.push(CalendarMatrixEngine.createCell(dateObj, year, monthIndex, d, true, minDate, maxDate));
    }

    let trailingDay = 1;
    while (cells.length < 42) {
      const dateObj = new Date(year, monthIndex + 1, trailingDay);
      cells.push(CalendarMatrixEngine.createCell(dateObj, year, monthIndex + 1, trailingDay, false, minDate, maxDate));
      trailingDay++;
    }

    return cells;
  }

  private static createCell(date: Date, y: number, m: number, d: number, isCurrent: boolean, min?: Date, max?: Date): CalendarCell {
    const time = date.getTime();
    const isDisabled = Boolean(
      (min && time < min.getTime()) || 
      (max && time > max.getTime())
    );
    const target = new Date(y, m, d);
    const actualYear = target.getFullYear();
    const actualMonth = (target.getMonth() + 1).toString().padStart(2, '0');
    const actualDay = target.getDate().toString().padStart(2, '0');
    const isoString = actualYear + '-' + actualMonth + '-' + actualDay;
    return { date, dayNumber: d, isCurrentMonth: isCurrent, isDisabled, isoString };
  }
}

const leapFeb = CalendarMatrixEngine.generateMonthGrid(2024, 1, true);
console.log('Total Matrix Cells: ' + leapFeb.length);
const currentMonthCells = leapFeb.filter(c => c.isCurrentMonth);
console.log('Leap February Days Count: ' + currentMonthCells.length + ' (Last Day: ' + currentMonthCells[currentMonthCells.length - 1].dayNumber + ')');
console.log('First Cell in Grid: ' + leapFeb[0].isoString + ' (Current Month: ' + leapFeb[0].isCurrentMonth + ')');
console.log('Cell 42 in Grid: ' + leapFeb[41].isoString + ' (Current Month: ' + leapFeb[41].isCurrentMonth + ')');
"""

part1_output = """Total Matrix Cells: 42
Leap February Days Count: 29 (Last Day: 29)
First Cell in Grid: 2024-01-29 (Current Month: false)
Cell 42 in Grid: 2024-03-10 (Current Month: false)"""

part2_code = """class CalendarKeyboardNavigator {
  private currentDate: Date;

  constructor(initialDate: Date = new Date(2026, 10, 28)) {
    this.currentDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate());
  }

  getCurrentDate(): Date {
    return new Date(this.currentDate.getTime());
  }

  getIsoString(): string {
    const y = this.currentDate.getFullYear();
    const m = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
    const d = this.currentDate.getDate().toString().padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  handleKey(key: string, shiftKey: boolean = false): { action: string; iso: string } {
    const d = new Date(this.currentDate.getTime());

    if (key === 'ArrowRight') {
      d.setDate(d.getDate() + 1);
      this.currentDate = d;
      return { action: 'NEXT_DAY', iso: this.getIsoString() };
    }
    if (key === 'ArrowLeft') {
      d.setDate(d.getDate() - 1);
      this.currentDate = d;
      return { action: 'PREV_DAY', iso: this.getIsoString() };
    }
    if (key === 'ArrowDown') {
      d.setDate(d.getDate() + 7);
      this.currentDate = d;
      return { action: 'NEXT_WEEK', iso: this.getIsoString() };
    }
    if (key === 'ArrowUp') {
      d.setDate(d.getDate() - 7);
      this.currentDate = d;
      return { action: 'PREV_WEEK', iso: this.getIsoString() };
    }
    if (key === 'PageDown' && !shiftKey) {
      d.setMonth(d.getMonth() + 1);
      this.currentDate = d;
      return { action: 'NEXT_MONTH', iso: this.getIsoString() };
    }
    if (key === 'PageUp' && !shiftKey) {
      d.setMonth(d.getMonth() - 1);
      this.currentDate = d;
      return { action: 'PREV_MONTH', iso: this.getIsoString() };
    }
    if (key === 'PageDown' && shiftKey) {
      d.setFullYear(d.getFullYear() + 1);
      this.currentDate = d;
      return { action: 'NEXT_YEAR', iso: this.getIsoString() };
    }
    if (key === 'Home') {
      d.setDate(1);
      this.currentDate = d;
      return { action: 'START_OF_MONTH', iso: this.getIsoString() };
    }
    return { action: 'IGNORED', iso: this.getIsoString() };
  }
}

const nav = new CalendarKeyboardNavigator(new Date(2026, 10, 28));
console.log('Starting Date: ' + nav.getIsoString());

nav.handleKey('ArrowRight');
nav.handleKey('ArrowRight');
const dec1 = nav.handleKey('ArrowRight');
console.log('After 3 Right Arrows: ' + dec1.iso + ' (' + dec1.action + ')');

const dec8 = nav.handleKey('ArrowDown');
console.log('After Down Arrow (+7 days): ' + dec8.iso);

const nextYear = nav.handleKey('PageDown', true);
console.log('After Shift+PageDown (+1 year): ' + nextYear.iso);
"""

part2_output = """Starting Date: 2026-11-28
After 3 Right Arrows: 2026-12-01 (NEXT_DAY)
After Down Arrow (+7 days): 2026-12-08
After Shift+PageDown (+1 year): 2027-12-08"""

part4_code = """interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
}

class TimezoneNormalizationEngine {
  static serializeToUtcIso(dateIso: string, time: TimeComponents, utcOffsetHours: number): string {
    const parts = dateIso.split('-').map(Number);
    const utcTimestamp = Date.UTC(parts[0], parts[1] - 1, parts[2], time.hours - utcOffsetHours, time.minutes, time.seconds);
    return new Date(utcTimestamp).toISOString();
  }

  static convert12To24(hour12: number, minutes: number, period: 'AM' | 'PM'): TimeComponents {
    let hours = hour12 % 12;
    if (period === 'PM') {
      hours += 12;
    }
    return { hours, minutes, seconds: 0 };
  }
}

const military = TimezoneNormalizationEngine.convert12To24(2, 30, 'PM');
console.log('2:30 PM Military Hours: ' + military.hours + ':' + military.minutes);

const midnightQuarter = TimezoneNormalizationEngine.convert12To24(12, 15, 'AM');
console.log('12:15 AM Military Hours: ' + midnightQuarter.hours + ':' + midnightQuarter.minutes);

const sampleDate = '2026-11-15';
const isoOutput = TimezoneNormalizationEngine.serializeToUtcIso(sampleDate, military, -5);
console.log('Serialized UTC Instant: ' + isoOutput);
"""

part4_output = """2:30 PM Military Hours: 14:30
12:15 AM Military Hours: 0:15
Serialized UTC Instant: 2026-11-15T19:30:00.000Z"""

DAY_44['parts'][0]['code'] = part1_code.strip()
DAY_44['parts'][0]['output'] = part1_output.strip()
DAY_44['parts'][1]['code'] = part2_code.strip()
DAY_44['parts'][1]['output'] = part2_output.strip()
DAY_44['parts'][3]['code'] = part4_code.strip()
DAY_44['parts'][3]['output'] = part4_output.strip()

with open('scripts/design_day44_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day44_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_44 = ' + json.dumps(DAY_44, indent=2) + '\n')

print('Cleanly replaced snippets in design_day44_data.py!')
