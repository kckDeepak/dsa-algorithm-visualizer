/**
 * Tower of Hanoi - Algorithm Implementation
 */
export class TowerOfHanoi {
  constructor(numDisks = 3) {
    this.numDisks = numDisks;
    this.reset();
  }

  reset() {
    // Initialize pegs: peg 0 has all disks, pegs 1 and 2 are empty
    this.pegs = [
      Array.from({ length: this.numDisks }, (_, i) => this.numDisks - i),
      [],
      []
    ];
    this.moves = [];
    this.currentStep = 0;
  }

  setNumDisks(n) {
    this.numDisks = Math.max(1, Math.min(8, n));
    this.reset();
  }

  // Solve recursively and record all moves
  solve() {
    this.reset();
    this.moves = [];
    this.hanoi(this.numDisks, 0, 2, 1);
    return this.moves;
  }

  // Recursive Hanoi algorithm
  hanoi(n, source, target, auxiliary) {
    if (n === 0) return;
    
    this.hanoi(n - 1, source, auxiliary, target);
    
    // Record the move
    this.moves.push({
      disk: n,
      from: source,
      to: target,
      pegsState: this.simulateMove(source, target)
    });
    
    this.hanoi(n - 1, auxiliary, target, source);
  }

  // Simulate move and return new peg state
  simulateMove(from, to) {
    // Find current state by applying all moves up to this point
    const pegs = [
      Array.from({ length: this.numDisks }, (_, i) => this.numDisks - i),
      [],
      []
    ];
    
    // Apply all previous moves
    for (let i = 0; i < this.moves.length; i++) {
      const move = this.moves[i];
      if (move.pegsState) continue; // Skip if already has state
      const disk = pegs[move.from].pop();
      pegs[move.to].push(disk);
    }
    
    // Apply current move
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    
    return pegs.map(p => [...p]);
  }

  // Get minimum moves formula
  getMinMoves() {
    return Math.pow(2, this.numDisks) - 1;
  }

  // Generate all states for animation
  generateStates() {
    const states = [];
    const pegs = [
      Array.from({ length: this.numDisks }, (_, i) => this.numDisks - i),
      [],
      []
    ];
    
    // Initial state
    states.push({
      pegs: pegs.map(p => [...p]),
      move: null,
      moveNumber: 0,
      description: 'Initial state: All disks on the first peg'
    });
    
    // Solve and record states
    const moves = [];
    const recordMoves = (n, source, target, auxiliary) => {
      if (n === 0) return;
      recordMoves(n - 1, source, auxiliary, target);
      moves.push({ disk: n, from: source, to: target });
      recordMoves(n - 1, auxiliary, target, source);
    };
    
    recordMoves(this.numDisks, 0, 2, 1);
    
    // Generate state for each move
    moves.forEach((move, index) => {
      const disk = pegs[move.from].pop();
      pegs[move.to].push(disk);
      
      states.push({
        pegs: pegs.map(p => [...p]),
        move: move,
        moveNumber: index + 1,
        movingDisk: move.disk,
        fromPeg: move.from,
        toPeg: move.to,
        description: `Move disk ${move.disk} from Peg ${move.from + 1} to Peg ${move.to + 1}`
      });
    });
    
    return states;
  }
}

export default TowerOfHanoi;
