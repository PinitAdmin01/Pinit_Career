/**
 * Day 37 - Part 3: String Periodicity, Repetitions & Compression via Border Arrays
 */

interface PeriodicityResult {
  period: number;
  isFullyPeriodic: boolean;
  repeatCount: number;
  compressedUnit: string;
}

class StringPeriodicityAnalyzer {
  static analyze(s: string): PeriodicityResult {
    const n = s.length;
    if (n === 0) {
      return { period: 0, isFullyPeriodic: false, repeatCount: 0, compressedUnit: "" };
    }

    const pi = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && s[i] !== s[j]) {
        j = pi[j - 1];
      }
      if (s[i] === s[j]) j++;
      pi[i] = j;
    }

    const longestBorder = pi[n - 1];
    const candidatePeriod = n - longestBorder;
    const isFullyPeriodic = longestBorder > 0 && n % candidatePeriod === 0;

    return {
      period: candidatePeriod,
      isFullyPeriodic,
      repeatCount: isFullyPeriodic ? n / candidatePeriod : 1,
      compressedUnit: isFullyPeriodic ? s.substring(0, candidatePeriod) : s
    };
  }
}

function main(): void {
  const strings = [
    "abcabcabcabc",       // 4x "abc"
    "aabaabaabaab",       // 4x "aab"
    "enterprise_infra",   // non-periodic
    "xyzxyz"              // 2x "xyz"
  ];

  console.log("=== String Periodicity & Run-Length Compression Analysis ===");
  for (const s of strings) {
    const res = StringPeriodicityAnalyzer.analyze(s);
    console.log(`[Periodicity] String: "${s}" (Length: ${s.length})`);
    console.log(`  -> Smallest Period k: ${res.period}`);
    console.log(`  -> Fully Periodic: ${res.isFullyPeriodic}`);
    console.log(`  -> Compression: "${res.compressedUnit}" repeated ${res.repeatCount} times`);
  }
}

main();
