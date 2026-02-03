/**
 * Dijkstra's Shortest Path - Algorithm Implementation
 */
export class Dijkstra {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.adjacencyList = new Map();
    this.states = [];
  }

  reset() {
    this.states = [];
  }

  // Create a sample graph
  createSampleGraph() {
    this.nodes = [
      { id: 0, x: 100, y: 200, label: 'A' },
      { id: 1, x: 250, y: 100, label: 'B' },
      { id: 2, x: 250, y: 300, label: 'C' },
      { id: 3, x: 400, y: 100, label: 'D' },
      { id: 4, x: 400, y: 300, label: 'E' },
      { id: 5, x: 550, y: 200, label: 'F' }
    ];

    this.edges = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 2, weight: 1 },
      { from: 1, to: 3, weight: 5 },
      { from: 2, to: 3, weight: 8 },
      { from: 2, to: 4, weight: 10 },
      { from: 3, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 6 },
      { from: 4, to: 5, weight: 3 }
    ];

    this.buildAdjacencyList();
  }

  buildAdjacencyList() {
    this.adjacencyList.clear();
    this.nodes.forEach(node => this.adjacencyList.set(node.id, []));
    
    this.edges.forEach(edge => {
      this.adjacencyList.get(edge.from).push({ node: edge.to, weight: edge.weight });
      this.adjacencyList.get(edge.to).push({ node: edge.from, weight: edge.weight });
    });
  }

  // Generate random graph
  generateGraph(nodeCount = 6) {
    this.nodes = [];
    this.edges = [];
    
    // Generate nodes in a layout
    const width = 500, height = 350;
    const padding = 80;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      const radius = Math.min(width, height) / 2 - padding;
      this.nodes.push({
        id: i,
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
        label: String.fromCharCode(65 + i)
      });
    }

    // Generate edges
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < 0.5) {
          this.edges.push({
            from: i,
            to: j,
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
    }

    // Ensure connectivity
    for (let i = 1; i < nodeCount; i++) {
      const hasEdge = this.edges.some(e => 
        (e.from === i || e.to === i) && (e.from < i || e.to < i)
      );
      if (!hasEdge) {
        this.edges.push({
          from: i - 1,
          to: i,
          weight: Math.floor(Math.random() * 9) + 1
        });
      }
    }

    this.buildAdjacencyList();
  }

  // Run Dijkstra's algorithm and record states
  findShortestPath(startId, endId) {
    this.reset();
    const n = this.nodes.length;
    const distances = new Array(n).fill(Infinity);
    const previous = new Array(n).fill(null);
    const visited = new Set();
    const pq = [{ node: startId, dist: 0 }];
    distances[startId] = 0;

    this.states.push({
      distances: [...distances],
      visited: new Set(visited),
      current: null,
      exploring: null,
      path: [],
      pq: [...pq],
      description: `Starting from node ${this.nodes[startId].label}`,
      phase: 'init'
    });

    while (pq.length > 0) {
      // Get min distance node
      pq.sort((a, b) => a.dist - b.dist);
      const { node: current, dist } = pq.shift();

      if (visited.has(current)) continue;

      this.states.push({
        distances: [...distances],
        visited: new Set(visited),
        current: current,
        exploring: null,
        path: [],
        pq: [...pq],
        description: `Visiting node ${this.nodes[current].label} (distance: ${dist})`,
        phase: 'visit'
      });

      visited.add(current);

      if (current === endId) {
        // Reconstruct path
        const path = [];
        let node = endId;
        while (node !== null) {
          path.unshift(node);
          node = previous[node];
        }

        this.states.push({
          distances: [...distances],
          visited: new Set(visited),
          current: null,
          exploring: null,
          path: path,
          description: `Found shortest path! Distance: ${distances[endId]}`,
          phase: 'done'
        });

        return { distance: distances[endId], path };
      }

      // Explore neighbors
      const neighbors = this.adjacencyList.get(current) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (visited.has(neighbor)) continue;

        const newDist = distances[current] + weight;

        this.states.push({
          distances: [...distances],
          visited: new Set(visited),
          current: current,
          exploring: { from: current, to: neighbor, weight },
          path: [],
          description: `Checking edge to ${this.nodes[neighbor].label} (${distances[current]} + ${weight} = ${newDist})`,
          phase: 'explore'
        });

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = current;
          pq.push({ node: neighbor, dist: newDist });

          this.states.push({
            distances: [...distances],
            visited: new Set(visited),
            current: current,
            exploring: { from: current, to: neighbor },
            updated: neighbor,
            path: [],
            description: `Updated distance to ${this.nodes[neighbor].label}: ${newDist}`,
            phase: 'update'
          });
        }
      }
    }

    this.states.push({
      distances: [...distances],
      visited: new Set(visited),
      current: null,
      path: [],
      description: `No path found to ${this.nodes[endId].label}`,
      phase: 'done'
    });

    return { distance: Infinity, path: [] };
  }
}

export default Dijkstra;
