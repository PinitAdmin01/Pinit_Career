/**
 * Day 37 - Part 4: Deterministic Finite Automaton (DFA) Prefix Automaton
 */

class PrefixDFAAutomaton {
  private pattern: string;
  private m: number;
  private alphabetSize: number;
  public dfa: number[][];

  constructor(pattern: string, alphabetSize: number = 26) {
    this.pattern = pattern;
    this.m = pattern.length;
    this.alphabetSize = alphabetSize;
    this.dfa = this.buildDFA();
  }

  private buildDFA(): number[][] {
    const dfa: number[][] = Array.from({ length: this.m + 1 }, () => new Array(this.alphabetSize).fill(0));

    // Compute prefix function pi for fallback transitions
    const pi = new Array(this.m).fill(0);
    for (let i = 1; i < this.m; i++) {
      let j = pi[i - 1];
      while (j > 0 && this.pattern[i] !== this.pattern[j]) {
        j = pi[j - 1];
      }
      if (this.pattern[i] === this.pattern[j]) j++;
      pi[i] = j;
    }

    // Build transition table delta(state, char)
    for (let state = 0; state <= this.m; state++) {
      for (let c = 0; c < this.alphabetSize; c++) {
        if (state < this.m && c === this.pattern.charCodeAt(state) - 97) {
          dfa[state][c] = state + 1; // Direct advance
        } else if (state > 0) {
          const fallbackState = state === this.m ? pi[this.m - 1] : pi[state - 1];
          dfa[state][c] = dfa[fallbackState][c]; // Constant-time precomputed transition
        } else {
          dfa[state][c] = 0;
        }
      }
    }

    return dfa;
  }

  // Processes incoming character stream in strictly O(1) time per character
  simulateStream(text: string): { matchOffsets: number[]; finalState: number } {
    let state = 0;
    const matchOffsets: number[] = [];

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) - 97;
      if (charCode >= 0 && charCode < this.alphabetSize) {
        state = this.dfa[state][charCode];
      } else {
        state = 0;
      }

      if (state === this.m) {
        matchOffsets.push(i - this.m + 1);
      }
    }

    return { matchOffsets, finalState: state };
  }
}

function main(): void {
  const pattern = "aba";
  const automaton = new PrefixDFAAutomaton(pattern, 26);
  const text = "abababababa";

  const { matchOffsets, finalState } = automaton.simulateStream(text);
  console.log(`[PrefixDFA] Compiled Pattern: "${pattern}" (Target State: ${pattern.length})`);
  console.log(`[PrefixDFA] Streaming Text: "${text}" (Length: ${text.length})`);
  console.log(`[PrefixDFA] Match Offsets in O(1) Per Byte: [${matchOffsets.join(", ")}]`);
  console.log(`[PrefixDFA] Total Matches Detected: ${matchOffsets.length}, Final State: ${finalState}`);
}

main();
