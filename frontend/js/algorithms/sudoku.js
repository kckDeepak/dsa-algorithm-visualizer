/**
 * Sudoku Solver - Algorithm Implementation
 */
export class SudokuSolver {
  constructor() {
    this.grid = this.getEmptyGrid();
    this.states = [];
    this.original = [];
  }

  getEmptyGrid() {
    return Array(9).fill().map(() => Array(9).fill(0));
  }

  reset() {
    this.states = [];
  }

  setGrid(grid) {
    this.grid = grid.map(row => [...row]);
    this.original = grid.map(row => [...row]);
    this.reset();
  }

  isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  findEmpty(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) return { row, col };
      }
    }
    return null;
  }

  solve() {
    this.reset();
    const grid = this.grid.map(row => [...row]);
    
    this.states.push({
      grid: grid.map(row => [...row]),
      current: null,
      trying: null,
      description: 'Starting Sudoku solver'
    });

    const solved = this.solveRecursive(grid);

    if (solved) {
      this.states.push({
        grid: grid.map(row => [...row]),
        solved: true,
        description: 'Puzzle solved!'
      });
      this.grid = grid;
    } else {
      this.states.push({
        grid: grid.map(row => [...row]),
        description: 'No solution exists'
      });
    }

    return solved;
  }

  solveRecursive(grid) {
    const empty = this.findEmpty(grid);
    if (!empty) return true;

    const { row, col } = empty;

    for (let num = 1; num <= 9; num++) {
      this.states.push({
        grid: grid.map(r => [...r]),
        current: { row, col },
        trying: num,
        description: `Trying ${num} at (${row + 1}, ${col + 1})`
      });

      if (this.isValid(grid, row, col, num)) {
        grid[row][col] = num;

        this.states.push({
          grid: grid.map(r => [...r]),
          current: { row, col },
          placed: num,
          valid: true,
          description: `Placed ${num} at (${row + 1}, ${col + 1})`
        });

        if (this.solveRecursive(grid)) return true;

        // Backtrack
        grid[row][col] = 0;
        this.states.push({
          grid: grid.map(r => [...r]),
          current: { row, col },
          backtrack: true,
          description: `Backtracking from (${row + 1}, ${col + 1})`
        });
      }
    }

    return false;
  }

  // Generate a valid puzzle
  generatePuzzle(difficulty = 'medium') {
    const emptyCells = { easy: 30, medium: 40, hard: 50 }[difficulty] || 40;
    
    // Start with empty grid
    this.grid = this.getEmptyGrid();
    
    // Fill diagonal boxes first (they don't affect each other)
    for (let box = 0; box < 9; box += 3) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.shuffle(nums);
      let idx = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          this.grid[box + i][box + j] = nums[idx++];
        }
      }
    }

    // Solve the rest
    this.solveInPlace(this.grid);
    
    // Remove cells
    const positions = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push({ row: i, col: j });
      }
    }
    this.shuffle(positions);

    for (let i = 0; i < emptyCells && i < positions.length; i++) {
      this.grid[positions[i].row][positions[i].col] = 0;
    }

    this.original = this.grid.map(row => [...row]);
    this.reset();
  }

  solveInPlace(grid) {
    const empty = this.findEmpty(grid);
    if (!empty) return true;

    const { row, col } = empty;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffle(nums);

    for (const num of nums) {
      if (this.isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.solveInPlace(grid)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  isOriginal(row, col) {
    return this.original[row][col] !== 0;
  }
}

export default SudokuSolver;
