/**
 * Longest Common Subsequence - Algorithm Implementation
 */
export class LCS {
  constructor() {
    this.str1 = '';
    this.str2 = '';
    this.states = [];
    this.dp = [];
  }

  reset() {
    this.states = [];
    this.dp = [];
  }

  setStrings(str1, str2) {
    this.str1 = str1;
    this.str2 = str2;
    this.reset();
  }

  solve() {
    this.reset();
    const m = this.str1.length;
    const n = this.str2.length;
    
    // Initialize DP table
    this.dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    this.states.push({
      dp: this.dp.map(row => [...row]),
      i: 0,
      j: 0,
      phase: 'init',
      description: 'Initializing DP table with zeros'
    });

    // Fill DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        this.states.push({
          dp: this.dp.map(row => [...row]),
          i: i,
          j: j,
          comparing: true,
          char1: this.str1[i - 1],
          char2: this.str2[j - 1],
          description: `Comparing '${this.str1[i - 1]}' with '${this.str2[j - 1]}'`
        });

        if (this.str1[i - 1] === this.str2[j - 1]) {
          this.dp[i][j] = this.dp[i - 1][j - 1] + 1;
          
          this.states.push({
            dp: this.dp.map(row => [...row]),
            i: i,
            j: j,
            match: true,
            diagonal: true,
            description: `Match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${this.dp[i][j]}`
          });
        } else {
          this.dp[i][j] = Math.max(this.dp[i - 1][j], this.dp[i][j - 1]);
          
          this.states.push({
            dp: this.dp.map(row => [...row]),
            i: i,
            j: j,
            match: false,
            fromAbove: this.dp[i - 1][j] >= this.dp[i][j - 1],
            description: `No match. dp[${i}][${j}] = max(${this.dp[i-1][j]}, ${this.dp[i][j-1]}) = ${this.dp[i][j]}`
          });
        }
      }
    }

    // Backtrack to find LCS
    const lcs = this.backtrack();

    this.states.push({
      dp: this.dp.map(row => [...row]),
      lcs: lcs,
      lcsIndices: this.getLCSIndices(),
      complete: true,
      description: `LCS length: ${this.dp[m][n]}, LCS: "${lcs}"`
    });

    return { length: this.dp[m][n], lcs };
  }

  backtrack() {
    let i = this.str1.length;
    let j = this.str2.length;
    let lcs = '';
    const path = [];

    while (i > 0 && j > 0) {
      path.push({ i, j });
      
      if (this.str1[i - 1] === this.str2[j - 1]) {
        lcs = this.str1[i - 1] + lcs;
        
        this.states.push({
          dp: this.dp.map(row => [...row]),
          i: i,
          j: j,
          backtracking: true,
          match: true,
          currentLCS: lcs,
          description: `Backtrack: '${this.str1[i - 1]}' is in LCS`
        });
        
        i--;
        j--;
      } else if (this.dp[i - 1][j] > this.dp[i][j - 1]) {
        this.states.push({
          dp: this.dp.map(row => [...row]),
          i: i,
          j: j,
          backtracking: true,
          direction: 'up',
          currentLCS: lcs,
          description: 'Backtrack: Moving up'
        });
        i--;
      } else {
        this.states.push({
          dp: this.dp.map(row => [...row]),
          i: i,
          j: j,
          backtracking: true,
          direction: 'left',
          currentLCS: lcs,
          description: 'Backtrack: Moving left'
        });
        j--;
      }
    }

    return lcs;
  }

  getLCSIndices() {
    const indices1 = [];
    const indices2 = [];
    let i = this.str1.length;
    let j = this.str2.length;

    while (i > 0 && j > 0) {
      if (this.str1[i - 1] === this.str2[j - 1]) {
        indices1.unshift(i - 1);
        indices2.unshift(j - 1);
        i--;
        j--;
      } else if (this.dp[i - 1][j] > this.dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return { indices1, indices2 };
  }
}

export default LCS;
