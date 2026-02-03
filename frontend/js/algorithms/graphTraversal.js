/**
 * Graph Traversal (BFS/DFS) - Algorithm Implementation
 */
export class GraphTraversal {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.adjacencyList = new Map();
    this.states = [];
  }

  reset() {
    this.states = [];
  }

  createSampleGraph() {
    this.nodes = [
      { id: 0, x: 300, y: 50, label: 'A' },
      { id: 1, x: 150, y: 150, label: 'B' },
      { id: 2, x: 450, y: 150, label: 'C' },
      { id: 3, x: 80, y: 270, label: 'D' },
      { id: 4, x: 220, y: 270, label: 'E' },
      { id: 5, x: 380, y: 270, label: 'F' },
      { id: 6, x: 520, y: 270, label: 'G' }
    ];

    this.edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 4, to: 5 }
    ];

    this.buildAdjacencyList();
  }

  buildAdjacencyList() {
    this.adjacencyList.clear();
    this.nodes.forEach(node => this.adjacencyList.set(node.id, []));
    
    this.edges.forEach(edge => {
      this.adjacencyList.get(edge.from).push(edge.to);
      this.adjacencyList.get(edge.to).push(edge.from);
    });
  }

  generateRandomGraph(nodeCount = 7) {
    this.nodes = [];
    this.edges = [];
    
    const width = 600, height = 350;
    const padding = 60;
    
    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      const radius = Math.min(width, height) / 2 - padding;
      this.nodes.push({
        id: i,
        x: width / 2 + radius * Math.cos(angle) * 0.8,
        y: height / 2 + radius * Math.sin(angle) * 0.8,
        label: String.fromCharCode(65 + i)
      });
    }

    // Generate tree-like edges to ensure connectivity
    for (let i = 1; i < nodeCount; i++) {
      const parent = Math.floor(Math.random() * i);
      this.edges.push({ from: parent, to: i });
    }

    // Add some extra edges
    for (let i = 0; i < nodeCount / 2; i++) {
      const from = Math.floor(Math.random() * nodeCount);
      const to = Math.floor(Math.random() * nodeCount);
      if (from !== to && !this.edges.some(e => 
        (e.from === from && e.to === to) || (e.from === to && e.to === from)
      )) {
        this.edges.push({ from, to });
      }
    }

    this.buildAdjacencyList();
  }

  // BFS traversal
  bfs(startId = 0) {
    this.reset();
    const visited = new Set();
    const queue = [startId];
    const order = [];

    this.states.push({
      visited: new Set(),
      queue: [...queue],
      current: null,
      order: [],
      description: `Starting BFS from node ${this.nodes[startId].label}`
    });

    while (queue.length > 0) {
      const current = queue.shift();

      if (visited.has(current)) continue;

      visited.add(current);
      order.push(current);

      this.states.push({
        visited: new Set(visited),
        queue: [...queue],
        current: current,
        order: [...order],
        description: `Visiting node ${this.nodes[current].label}`
      });

      const neighbors = this.adjacencyList.get(current) || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          
          this.states.push({
            visited: new Set(visited),
            queue: [...queue],
            current: current,
            exploring: neighbor,
            order: [...order],
            description: `Adding ${this.nodes[neighbor].label} to queue`
          });
        }
      }
    }

    this.states.push({
      visited: new Set(visited),
      queue: [],
      current: null,
      order: [...order],
      complete: true,
      description: `BFS complete! Order: ${order.map(id => this.nodes[id].label).join(' → ')}`
    });

    return order;
  }

  // DFS traversal
  dfs(startId = 0) {
    this.reset();
    const visited = new Set();
    const stack = [startId];
    const order = [];

    this.states.push({
      visited: new Set(),
      stack: [...stack],
      current: null,
      order: [],
      description: `Starting DFS from node ${this.nodes[startId].label}`
    });

    while (stack.length > 0) {
      const current = stack.pop();

      if (visited.has(current)) continue;

      visited.add(current);
      order.push(current);

      this.states.push({
        visited: new Set(visited),
        stack: [...stack],
        current: current,
        order: [...order],
        description: `Visiting node ${this.nodes[current].label}`
      });

      const neighbors = this.adjacencyList.get(current) || [];
      
      // Add neighbors in reverse order for correct DFS order
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          
          this.states.push({
            visited: new Set(visited),
            stack: [...stack],
            current: current,
            exploring: neighbor,
            order: [...order],
            description: `Adding ${this.nodes[neighbor].label} to stack`
          });
        }
      }
    }

    this.states.push({
      visited: new Set(visited),
      stack: [],
      current: null,
      order: [...order],
      complete: true,
      description: `DFS complete! Order: ${order.map(id => this.nodes[id].label).join(' → ')}`
    });

    return order;
  }
}

export default GraphTraversal;
