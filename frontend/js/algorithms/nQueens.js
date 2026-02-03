/**
 * N-Queens Problem - Algorithm Implementation
 */
export class NQueens {
  constructor(n = 8) {
    this.n = n;
    this.reset();
  }

  reset() {
    this.board = Array(this.n).fill().map(() => Array(this.n).fill(0));
    this.solutions = [];
    this.steps = [];
  }

  setSize(n) {
    this.n = Math.max(4, Math.min(12, n));
    this.reset();
  }

  // Check if position is safe
  isSafe(board, row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }

    // Check upper-left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }

    // Check upper-right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < this.n; i--, j++) {
      if (board[i][j] === 1) return false;
    }

    return true;
  }

  // Find conflicts for visualization
  findConflicts(board, row, col) {
    const conflicts = [];
    
    // Check column
    for (let i = 0; i < this.n; i++) {
      if (i !== row && board[i][col] === 1) {
        conflicts.push({ row: i, col: col, type: 'column' });
      }
    }

    // Check diagonals
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (board[i][j] === 1 && i !== row && j !== col) {
          if (Math.abs(i - row) === Math.abs(j - col)) {
            conflicts.push({ row: i, col: j, type: 'diagonal' });
          }
        }
      }
    }

    return conflicts;
  }

  // Solve and generate steps for visualization
  solve() {
    this.reset();
    this.solveRecursive(0);
    return this.solutions;
  }

  solveRecursive(row) {
    if (row >= this.n) {
      // Found a solution
      this.solutions.push(this.board.map(r => [...r]));
      return true;
    }

    for (let col = 0; col < this.n; col++) {
      // Try placing queen
      this.steps.push({
        type: 'try',
        row: row,
        col: col,
        board: this.board.map(r => [...r]),
        safe: this.isSafe(this.board, row, col),
        description: `Trying queen at row ${row + 1}, column ${col + 1}`
      });

      if (this.isSafe(this.board, row, col)) {
        this.board[row][col] = 1;

        this.steps.push({
          type: 'place',
          row: row,
          col: col,
          board: this.board.map(r => [...r]),
          description: `Placed queen at row ${row + 1}, column ${col + 1}`
        });

        if (this.solveRecursive(row + 1)) {
          // If only finding first solution, return here
          // return true;
        }

        // Backtrack
        this.board[row][col] = 0;
        this.steps.push({
          type: 'remove',
          row: row,
          col: col,
          board: this.board.map(r => [...r]),
          description: `Backtracking: removed queen from row ${row + 1}, column ${col + 1}`
        });
      }
    }

    return false;
  }

  // Generate states for animation (simplified for performance)
  generateStates(findFirst = true) {
    this.reset();
    const states = [];
    const board = Array(this.n).fill(-1); // board[row] = column of queen

    states.push({
      board: Array(this.n).fill().map(() => Array(this.n).fill(0)),
      queens: [],
      currentRow: 0,
      currentCol: -1,
      checking: null,
      conflicts: [],
      description: 'Starting N-Queens solver',
      solutionsFound: 0
    });

    let solutionsFound = 0;

    const solve = (row) => {
      if (row >= this.n) {
        solutionsFound++;
        const boardGrid = Array(this.n).fill().map(() => Array(this.n).fill(0));
        const queens = [];
        for (let r = 0; r < this.n; r++) {
          if (board[r] >= 0) {
            boardGrid[r][board[r]] = 1;
            queens.push({ row: r, col: board[r] });
          }
        }
        states.push({
          board: boardGrid,
          queens: queens,
          currentRow: -1,
          currentCol: -1,
          checking: null,
          conflicts: [],
          description: `Solution ${solutionsFound} found!`,
          solutionsFound: solutionsFound,
          isSolution: true
        });
        return findFirst;
      }

      for (let col = 0; col < this.n; col++) {
        // Check position
        const boardGrid = Array(this.n).fill().map(() => Array(this.n).fill(0));
        const queens = [];
        for (let r = 0; r < row; r++) {
          if (board[r] >= 0) {
            boardGrid[r][board[r]] = 1;
            queens.push({ row: r, col: board[r] });
          }
        }

        // Find conflicts
        let safe = true;
        const conflicts = [];
        for (let r = 0; r < row; r++) {
          const c = board[r];
          if (c === col || Math.abs(r - row) === Math.abs(c - col)) {
            safe = false;
            conflicts.push({ row: r, col: c });
          }
        }

        states.push({
          board: boardGrid,
          queens: queens,
          currentRow: row,
          currentCol: col,
          checking: { row, col },
          conflicts: conflicts,
          safe: safe,
          description: safe 
            ? `Row ${row + 1}, Col ${col + 1}: Safe position`
            : `Row ${row + 1}, Col ${col + 1}: Conflicts detected`,
          solutionsFound: solutionsFound
        });

        if (safe) {
          board[row] = col;
          boardGrid[row][col] = 1;
          queens.push({ row, col });

          states.push({
            board: boardGrid.map(r => [...r]),
            queens: [...queens],
            currentRow: row,
            currentCol: col,
            checking: null,
            conflicts: [],
            description: `Placed queen at row ${row + 1}, column ${col + 1}`,
            solutionsFound: solutionsFound
          });

          if (solve(row + 1)) return true;

          // Backtrack
          board[row] = -1;
          queens.pop();

          const backtrackGrid = Array(this.n).fill().map(() => Array(this.n).fill(0));
          for (let r = 0; r < row; r++) {
            if (board[r] >= 0) backtrackGrid[r][board[r]] = 1;
          }

          states.push({
            board: backtrackGrid,
            queens: queens.filter(q => q.row < row),
            currentRow: row,
            currentCol: col,
            checking: null,
            conflicts: [],
            isBacktrack: true,
            description: `Backtracking from row ${row + 1}`,
            solutionsFound: solutionsFound
          });
        }
      }

      return false;
    };

    solve(0);

    return states;
  }
}

export default NQueens;
