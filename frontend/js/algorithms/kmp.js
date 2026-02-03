/**
 * KMP String Matching - Algorithm Implementation
 */
export class KMPMatcher {
  constructor() {
    this.text = '';
    this.pattern = '';
    this.states = [];
  }

  reset() {
    this.states = [];
  }

  setText(text) {
    this.text = text;
    this.reset();
  }

  setPattern(pattern) {
    this.pattern = pattern;
    this.reset();
  }

  // Build failure function (LPS array)
  buildLPS(pattern) {
    const lps = [0];
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }

  // KMP search with state generation
  search() {
    this.reset();
    const text = this.text;
    const pattern = this.pattern;
    const n = text.length;
    const m = pattern.length;
    const matches = [];

    if (m === 0 || n === 0) return matches;

    // Build LPS array
    const lps = this.buildLPS(pattern);

    this.states.push({
      text: text,
      pattern: pattern,
      textIndex: 0,
      patternIndex: 0,
      lps: [...lps],
      matches: [],
      comparing: [],
      description: `Built LPS array: [${lps.join(', ')}]`
    });

    let i = 0; // text index
    let j = 0; // pattern index

    while (i < n) {
      // Comparing state
      this.states.push({
        text: text,
        pattern: pattern,
        textIndex: i,
        patternIndex: j,
        lps: [...lps],
        matches: [...matches],
        comparing: [i, j],
        description: `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`
      });

      if (text[i] === pattern[j]) {
        i++;
        j++;

        if (j === m) {
          // Match found
          matches.push(i - j);
          
          this.states.push({
            text: text,
            pattern: pattern,
            textIndex: i,
            patternIndex: j,
            lps: [...lps],
            matches: [...matches],
            matchFound: i - j,
            comparing: [],
            description: `Found match at index ${i - j}!`
          });

          j = lps[j - 1];
        }
      } else {
        // Mismatch
        if (j !== 0) {
          this.states.push({
            text: text,
            pattern: pattern,
            textIndex: i,
            patternIndex: j,
            lps: [...lps],
            matches: [...matches],
            mismatch: true,
            jump: lps[j - 1],
            description: `Mismatch! Using LPS to jump pattern index from ${j} to ${lps[j - 1]}`
          });
          j = lps[j - 1];
        } else {
          this.states.push({
            text: text,
            pattern: pattern,
            textIndex: i,
            patternIndex: j,
            lps: [...lps],
            matches: [...matches],
            mismatch: true,
            description: `Mismatch! Moving text index forward`
          });
          i++;
        }
      }
    }

    this.states.push({
      text: text,
      pattern: pattern,
      textIndex: n,
      patternIndex: 0,
      lps: [...lps],
      matches: [...matches],
      complete: true,
      description: `Search complete. Found ${matches.length} match(es)`
    });

    return matches;
  }

  // Complete LPS generation with steps
  generateLPSStates() {
    const pattern = this.pattern;
    const m = pattern.length;
    const lps = [0];
    let len = 0;
    let i = 1;

    const states = [{
      pattern: pattern,
      lps: [0],
      i: 1,
      len: 0,
      description: 'Building LPS (Longest Proper Prefix which is also Suffix)'
    }];

    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;

        states.push({
          pattern: pattern,
          lps: [...lps],
          i: i,
          len: len,
          comparing: [i, len - 1],
          match: true,
          description: `Match! pattern[${i}]='${pattern[i]}' == pattern[${len-1}]='${pattern[len-1]}', lps[${i}]=${len}`
        });

        i++;
      } else {
        if (len !== 0) {
          states.push({
            pattern: pattern,
            lps: [...lps],
            i: i,
            len: len,
            comparing: [i, len],
            mismatch: true,
            description: `Mismatch! Falling back len from ${len} to ${lps[len - 1]}`
          });
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          states.push({
            pattern: pattern,
            lps: [...lps],
            i: i,
            len: 0,
            description: `No prefix found, lps[${i}]=0`
          });
          i++;
        }
      }
    }

    states.push({
      pattern: pattern,
      lps: [...lps],
      complete: true,
      description: `LPS array complete: [${lps.join(', ')}]`
    });

    return states;
  }
}

export default KMPMatcher;
