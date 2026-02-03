/**
 * Binary Search Tree - Visualizer
 */
import { BinarySearchTree } from '../algorithms/bst.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'Binary Search Tree',
  description: 'Visualize insert, search, and traversal operations on a BST.',
  overview: `
    <h3>What is a Binary Search Tree?</h3>
    <p>A Binary Search Tree (BST) is a binary tree data structure where each node has at most two children, and for each node:</p>
    <ul>
      <li>All values in the left subtree are smaller</li>
      <li>All values in the right subtree are larger</li>
    </ul>
    <p>This property enables efficient searching, insertion, and deletion operations.</p>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time (Average)</div>
        <div class="complexity-value">O(log n)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space</div>
        <div class="complexity-value">O(n)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>BST Operations</h3>
    <p><strong>Insert:</strong></p>
    <ol style="padding-left:24px;margin-bottom:16px;">
      <li style="list-style:decimal;color:var(--color-text-secondary);">Start at root</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">If value < current, go left</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">If value > current, go right</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">Insert at empty position</li>
    </ol>
    <p><strong>Search:</strong> Same traversal, return when found</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>Databases:</strong> Indexing for fast lookups</li>
      <li><strong>File Systems:</strong> Directory structure organization</li>
      <li><strong>Compilers:</strong> Symbol table management</li>
      <li><strong>Priority Queues:</strong> Efficient min/max operations</li>
    </ul>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">insert</span>(node, value):
    <span class="keyword">if</span> node == null:
        <span class="keyword">return</span> new Node(value)
    
    <span class="keyword">if</span> value < node.value:
        node.left = <span class="function">insert</span>(node.left, value)
    <span class="keyword">else</span>:
        node.right = <span class="function">insert</span>(node.right, value)
    
    <span class="keyword">return</span> node
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  bg: '#0f172a',
  node: '#3b82f6',
  nodeCurrent: '#f59e0b',
  nodeHighlight: '#10b981',
  nodeVisited: '#8b5cf6',
  edge: '#475569',
  text: '#f1f5f9'
};

export function init() {
  setupDOM();
  setupControls();
  setupAlgorithm();
  setupCanvas();
}

function setupDOM() {
  document.getElementById('algo-title').textContent = info.title;
  document.getElementById('algo-description').textContent = info.description;
  document.getElementById('tab-overview').innerHTML = info.overview;
  document.getElementById('tab-steps').innerHTML = info.steps;
  document.getElementById('tab-applications').innerHTML = info.applications;
  document.getElementById('tab-code').innerHTML = info.code;
}

function setupCanvas() {
  canvas = document.getElementById('visualization-canvas');
  ctx = canvas.getContext('2d');
  
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    draw();
  };
  resize();
  window.addEventListener('resize', resize);
}

function setupControls() {
  const panel = document.getElementById('control-panel');
  panel.innerHTML = `
    <div class="control-panel">
      <div class="control-section">
        <h4 class="control-section-title">Playback</h4>
        <div class="playback-controls">
          <button class="playback-btn" id="btn-reset">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
          <button class="playback-btn" id="btn-step-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="19 20 9 12 19 4"/><line x1="5" y1="4" x2="5" y2="20"/>
            </svg>
          </button>
          <button class="playback-btn playback-btn-play" id="btn-play">
            <svg class="icon-play" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21"/>
            </svg>
            <svg class="icon-pause hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>
          <button class="playback-btn" id="btn-step-forward">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 4 15 12 5 20"/><line x1="19" y1="4" x2="19" y2="20"/>
            </svg>
          </button>
        </div>
        <div class="progress-container">
          <div class="progress-bar" id="progress-bar" style="cursor:pointer">
            <div class="progress-bar-fill" id="progress-fill"></div>
          </div>
          <div class="progress-info" id="progress-info">0/0</div>
        </div>
      </div>
      
      <div class="control-section">
        <h4 class="control-section-title">Speed</h4>
        <div class="speed-control">
          <span class="speed-label" id="speed-label">1.0x</span>
          <input type="range" class="range-slider" id="speed-slider" min="0.25" max="4" step="0.25" value="1">
        </div>
      </div>
      
      <div class="control-section">
        <h4 class="control-section-title">Operations</h4>
        <div class="input-group">
          <label class="input-label">Value</label>
          <input type="number" class="input-field" id="input-value" min="1" max="99" value="50">
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn btn-primary" id="btn-insert" style="flex:1;">Insert</button>
          <button class="btn btn-secondary" id="btn-search" style="flex:1;">Search</button>
        </div>
      </div>
      
      <div class="control-section">
        <button class="btn btn-secondary" id="btn-traverse" style="width:100%;margin-bottom:8px;">Inorder Traversal</button>
        <button class="btn btn-secondary" id="btn-random" style="width:100%;">Random Tree</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-insert').addEventListener('click', insertValue);
  document.getElementById('btn-search').addEventListener('click', searchValue);
  document.getElementById('btn-traverse').addEventListener('click', traverse);
  document.getElementById('btn-random').addEventListener('click', randomTree);
  
  document.getElementById('speed-slider').addEventListener('input', e => {
    animator.setSpeed(parseFloat(e.target.value));
    document.getElementById('speed-label').textContent = e.target.value + 'x';
  });
  
  document.getElementById('progress-bar').addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    const step = Math.floor((e.clientX - rect.left) / rect.width * (states.length - 1));
    animator.goToStep(Math.max(0, step));
  });
}

function setupAlgorithm() {
  algorithm = new BinarySearchTree();
  animator = new AnimationController();
  animator.stepDuration = 600;
  
  animator.onStepChange = (state) => {
    currentState = state;
    updateStats();
    draw();
  };
  
  animator.onStateChange = (state) => {
    updatePlayButton(state.isPlaying);
    document.getElementById('progress-fill').style.width = state.progress + '%';
    document.getElementById('progress-info').textContent = `${state.currentStep + 1}/${state.totalSteps}`;
  };
  
  randomTree();
}

function insertValue() {
  const value = parseInt(document.getElementById('input-value').value);
  if (isNaN(value) || value < 1 || value > 99) return;
  
  algorithm.insert(value);
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function searchValue() {
  const value = parseInt(document.getElementById('input-value').value);
  if (isNaN(value)) return;
  
  algorithm.search(value);
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function traverse() {
  algorithm.inorder();
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function randomTree() {
  algorithm.generateRandom(7);
  reset();
}

function reset() {
  algorithm.calculatePositions(algorithm.root, 300, 40, 120);
  states = [{
    tree: algorithm.cloneTree(algorithm.root),
    description: 'Binary Search Tree ready'
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function togglePlay() {
  animator.toggle();
}

function updatePlayButton(isPlaying) {
  document.querySelector('.icon-play').classList.toggle('hidden', isPlaying);
  document.querySelector('.icon-pause').classList.toggle('hidden', !isPlaying);
  document.getElementById('btn-play').classList.toggle('active', isPlaying);
}

function updateStats() {
  const nodes = algorithm.getNodes().length;
  document.getElementById('stat-moves').textContent = nodes;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Nodes:';
}

function draw() {
  if (!ctx) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  const tree = currentState?.tree || algorithm.cloneTree(algorithm.root);
  if (!tree) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Tree is empty. Insert a value to begin.', width / 2, height / 2);
    return;
  }
  
  // Scale and center
  const scale = Math.min(width / 600, height / 350);
  const offsetX = (width - 600 * scale) / 2;
  const offsetY = 40;
  
  const getPos = (node) => ({
    x: offsetX + node.x * scale,
    y: offsetY + node.y * scale
  });
  
  // Draw edges first
  drawEdges(tree, getPos);
  
  // Draw nodes
  drawNodes(tree, getPos);
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState?.description || '', width / 2, 25);
}

function drawEdges(node, getPos) {
  if (!node) return;
  
  const pos = getPos(node);
  
  if (node.left) {
    const leftPos = getPos(node.left);
    ctx.strokeStyle = colors.edge;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y + 20);
    ctx.lineTo(leftPos.x, leftPos.y - 20);
    ctx.stroke();
    drawEdges(node.left, getPos);
  }
  
  if (node.right) {
    const rightPos = getPos(node.right);
    ctx.strokeStyle = colors.edge;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y + 20);
    ctx.lineTo(rightPos.x, rightPos.y - 20);
    ctx.stroke();
    drawEdges(node.right, getPos);
  }
}

function drawNodes(node, getPos) {
  if (!node) return;
  
  const pos = getPos(node);
  const radius = 22;
  
  // Determine color
  let color = colors.node;
  if (currentState?.highlight?.includes(node.value)) color = colors.nodeHighlight;
  else if (currentState?.current === node.value) color = colors.nodeCurrent;
  else if (currentState?.visited?.includes(node.value)) color = colors.nodeVisited;
  
  // Glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  
  // Draw node
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Value
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 14px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.value.toString(), pos.x, pos.y);
  
  // Recurse
  drawNodes(node.left, getPos);
  drawNodes(node.right, getPos);
}

export default { init };
