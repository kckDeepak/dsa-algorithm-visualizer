/**
 * A* Pathfinding - Algorithm Implementation
 */
export class AStar {
  constructor(rows = 20, cols = 35) {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.start = { row: 10, col: 5 };
    this.end = { row: 10, col: 29 };
    this.states = [];
  }

  reset() {
    this.states = [];
    this.grid = Array(this.rows).fill().map(() => 
      Array(this.cols).fill(0) // 0 = empty, 1 = wall
    );
  }

  setSize(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.reset();
    this.start = { row: Math.floor(rows/2), col: 2 };
    this.end = { row: Math.floor(rows/2), col: cols - 3 };
  }

  toggleWall(row, col) {
    if (!this.isStart(row, col) && !this.isEnd(row, col)) {
      this.grid[row][col] = this.grid[row][col] ? 0 : 1;
    }
  }

  isStart(row, col) {
    return this.start.row === row && this.start.col === col;
  }

  isEnd(row, col) {
    return this.end.row === row && this.end.col === col;
  }

  generateMaze() {
    this.reset();
    // Create random obstacles
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.isStart(r, c) && !this.isEnd(r, c) && Math.random() < 0.25) {
          this.grid[r][c] = 1;
        }
      }
    }
  }

  heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  getNeighbors(node) {
    const dirs = [[-1,0], [1,0], [0,-1], [0,1]]; // 4-directional
    const neighbors = [];
    
    for (const [dr, dc] of dirs) {
      const r = node.row + dr;
      const c = node.col + dc;
      if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.grid[r][c] !== 1) {
        neighbors.push({ row: r, col: c });
      }
    }
    return neighbors;
  }

  // Run A* and generate states
  findPath() {
    this.states = [];
    
    const openSet = [];
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    const key = (n) => `${n.row},${n.col}`;
    
    gScore.set(key(this.start), 0);
    fScore.set(key(this.start), this.heuristic(this.start, this.end));
    openSet.push({ ...this.start });

    this.states.push({
      openSet: openSet.map(n => ({...n})),
      closedSet: new Set(closedSet),
      current: null,
      path: [],
      gScores: new Map(gScore),
      fScores: new Map(fScore),
      description: 'Starting A* search'
    });

    while (openSet.length > 0) {
      // Find node with lowest fScore
      openSet.sort((a, b) => (fScore.get(key(a)) || Infinity) - (fScore.get(key(b)) || Infinity));
      const current = openSet.shift();
      const currentKey = key(current);

      this.states.push({
        openSet: openSet.map(n => ({...n})),
        closedSet: new Set(closedSet),
        current: { ...current },
        path: [],
        description: `Exploring (${current.row}, ${current.col}) - f: ${fScore.get(currentKey)?.toFixed(1)}`
      });

      // Check if reached goal
      if (current.row === this.end.row && current.col === this.end.col) {
        // Reconstruct path
        const path = [];
        let node = current;
        while (node) {
          path.unshift({ ...node });
          node = cameFrom.get(key(node));
        }

        this.states.push({
          openSet: [],
          closedSet: new Set(closedSet),
          current: null,
          path: path,
          description: `Path found! Length: ${path.length}`
        });

        return path;
      }

      closedSet.add(currentKey);

      // Explore neighbors
      for (const neighbor of this.getNeighbors(current)) {
        const neighborKey = key(neighbor);
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = (gScore.get(currentKey) || 0) + 1;
        
        if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          fScore.set(neighborKey, tentativeG + this.heuristic(neighbor, this.end));
          
          if (!openSet.some(n => key(n) === neighborKey)) {
            openSet.push({ ...neighbor });
          }
        }
      }
    }

    this.states.push({
      openSet: [],
      closedSet: new Set(closedSet),
      current: null,
      path: [],
      description: 'No path found!'
    });

    return null;
  }
}

export default AStar;
