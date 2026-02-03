/**
 * Binary Search Tree - Algorithm Implementation
 */
export class BinarySearchTree {
  constructor() {
    this.root = null;
    this.states = [];
  }

  reset() {
    this.root = null;
    this.states = [];
  }

  createNode(value) {
    return { value, left: null, right: null, x: 0, y: 0 };
  }

  // Clone tree for state capture
  cloneTree(node) {
    if (!node) return null;
    return {
      value: node.value,
      left: this.cloneTree(node.left),
      right: this.cloneTree(node.right),
      x: node.x,
      y: node.y
    };
  }

  // Calculate node positions for visualization
  calculatePositions(node, x, y, spread) {
    if (!node) return;
    node.x = x;
    node.y = y;
    this.calculatePositions(node.left, x - spread, y + 60, spread * 0.6);
    this.calculatePositions(node.right, x + spread, y + 60, spread * 0.6);
  }

  // Insert with animation states
  insert(value) {
    this.states = [];
    
    if (!this.root) {
      this.root = this.createNode(value);
      this.calculatePositions(this.root, 300, 40, 120);
      this.states.push({
        tree: this.cloneTree(this.root),
        highlight: [value],
        description: `Inserted ${value} as root`
      });
      return;
    }

    this.states.push({
      tree: this.cloneTree(this.root),
      highlight: [],
      description: `Inserting ${value}`
    });

    this.insertRecursive(this.root, value);
    this.calculatePositions(this.root, 300, 40, 120);
    
    this.states.push({
      tree: this.cloneTree(this.root),
      highlight: [value],
      description: `Inserted ${value}`
    });
  }

  insertRecursive(node, value) {
    this.states.push({
      tree: this.cloneTree(this.root),
      current: node.value,
      highlight: [],
      description: `Comparing ${value} with ${node.value}`
    });

    if (value < node.value) {
      if (!node.left) {
        node.left = this.createNode(value);
      } else {
        this.insertRecursive(node.left, value);
      }
    } else {
      if (!node.right) {
        node.right = this.createNode(value);
      } else {
        this.insertRecursive(node.right, value);
      }
    }
  }

  // Search with animation
  search(value) {
    this.states = [];
    this.states.push({
      tree: this.cloneTree(this.root),
      description: `Searching for ${value}`
    });
    
    const found = this.searchRecursive(this.root, value);
    
    this.states.push({
      tree: this.cloneTree(this.root),
      highlight: found ? [value] : [],
      description: found ? `Found ${value}!` : `${value} not found`
    });
    
    return found;
  }

  searchRecursive(node, value) {
    if (!node) return false;

    this.states.push({
      tree: this.cloneTree(this.root),
      current: node.value,
      description: `Checking node ${node.value}`
    });

    if (value === node.value) return true;
    if (value < node.value) return this.searchRecursive(node.left, value);
    return this.searchRecursive(node.right, value);
  }

  // Build tree from array
  buildFromArray(arr) {
    this.reset();
    arr.forEach(val => {
      const newNode = this.createNode(val);
      if (!this.root) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode);
      }
    });
    this.calculatePositions(this.root, 300, 40, 120);
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (!node.left) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (!node.right) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }

  // Traversals
  inorder() {
    this.states = [];
    const result = [];
    this.inorderRecursive(this.root, result);
    return result;
  }

  inorderRecursive(node, result) {
    if (!node) return;
    this.inorderRecursive(node.left, result);
    result.push(node.value);
    this.states.push({
      tree: this.cloneTree(this.root),
      current: node.value,
      visited: [...result],
      description: `Visiting ${node.value}`
    });
    this.inorderRecursive(node.right, result);
  }

  // Get all nodes as array
  getNodes() {
    const nodes = [];
    this.collectNodes(this.root, nodes);
    return nodes;
  }

  collectNodes(node, arr) {
    if (!node) return;
    arr.push(node);
    this.collectNodes(node.left, arr);
    this.collectNodes(node.right, arr);
  }

  // Generate random tree
  generateRandom(count = 7) {
    this.reset();
    const values = new Set();
    while (values.size < count) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    this.buildFromArray([...values]);
    return [...values];
  }
}

export default BinarySearchTree;
