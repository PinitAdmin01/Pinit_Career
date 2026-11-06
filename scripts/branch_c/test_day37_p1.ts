/**
 * Day 37 - Part 1: Prefix Function (Pi Array) & Border Array Computation
 */

class PrefixFunctionOracle {
  static computePi(s: string): number[] {
    const n = s.length;
    const pi = new Array(n).fill(0);

    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && s[i] !== s[j]) {
        j = pi[j - 1]; // Fallback to previous longest border
      }
      if (s[i] === s[j]) {
        j++;
      }
      pi[i] = j;
    }

    return pi;
  }
}

function main(): void {
  const s1 = "aabaaab";
  const pi1 = PrefixFunctionOracle.computePi(s1);
  console.log(`[PrefixFunction] String: "${s1}"`);
  console.log(`[PrefixFunction] Pi Array: [${pi1.join(", ")}]`);

  const s2 = "abcabcdabc";
  const pi2 = PrefixFunctionOracle.computePi(s2);
  console.log(`[PrefixFunction] String: "${s2}"`);
  console.log(`[PrefixFunction] Pi Array: [${pi2.join(", ")}]`);

  // Verification of longest border for s1: pi[6] = 2 ("ab")
  console.log(`[PrefixFunction] Final Border Length of "${s1}": ${pi1[pi1.length - 1]} ("${s1.substring(0, pi1[pi1.length - 1])}")`);
}

main();
