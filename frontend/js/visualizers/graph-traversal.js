/**
 * Graph Traversal (BFS/DFS) - Visualizer
 */
import { GraphTraversal } from '../algorithms/graphTraversal.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'Graph Traversal (BFS/DFS)',
  description: 'Explore graphs using Breadth-First Search and Depth-First Search.',
  overview: `
    <h3>Graph Traversal</h3>
    <p>Graph traversal algorithms visit all nodes in a graph systematically. The two fundamental approaches are:</p>
    <ul>
      <li><strong>BFS:</strong> Explores all neighbors at current depth before moving deeper (uses a queue)</li>
      <li><strong>DFS:</strong> Explores as far as possible along each branch before backtracking (uses a stack)</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(V + E)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(V)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>BFS vs DFS</h3>
    <p><strong>Breadth-First Search:</strong></p>
    <ol style="padding-left:24px;margin-bottom:16px;">
      <li style="list-style:decimal;color:var(--color-text-secondary);">Start at root, add to queue</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">Dequeue front node, visit it</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">Enqueue all unvisited neighbors</li>
    </ol>
    <p><strong>Depth-First Search:</strong></p>
    <ol style="padding-left:24px;">
      <li style="list-style:decimal;color:var(--color-text-secondary);">Start at root, push to stack</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">Pop top node, visit it</li>
      <li style="list-style:decimal;color:var(--color-text-secondary);">Push all unvisited neighbors</li>
    </ol>
  `,
  applications: `
    <h3>Applications</h3>
    <ul>
      <li><strong>BFS:</strong> Shortest path (unweighted), web crawlers</li>
      <li><strong>DFS:</strong> Topological sort, cycle detection, maze solving</li>
      <li><strong>Both:</strong> Connected components, reachability</li>
    </ul>
  `,
  code: `
    <div class="code-block">
<span class="comment">// BFS</span>
queue.enqueue(start)
<span class="keyword">while</span> queue not empty:
    node = queue.dequeue()
    <span class="keyword">if</span> not visited[node]:
        visit(node)
        <span class="keyword">for</span> neighbor in node.neighbors:
            queue.enqueue(neighbor)

<span class="comment">// DFS</span>
stack.push(start)
<span class="keyword">while</span> stack not empty:
    node = stack.pop()
    <span class="keyword">if</span> not visited[node]:
        visit(node)
        <span class="keyword">for</span> neighbor in node.neighbors:
            stack.push(neighbor)
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;
let currentAlgorithm = 'bfs';

const colors = {
  bg: '#0f172a',
  node: '#475569',
  nodeVisited: '#10b981',
  nodeCurrent: '#f59e0b',
  nodeExploring: '#3b82f6',
  nodeQueue: '#8b5cf6',
  edge: '#334155',
  edgeActive: '#f59e0b',
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
        <h4 class="control-section-title">Algorithm</h4>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary active" id="btn-bfs" style="flex:1;">BFS</button>
          <button class="btn btn-secondary" id="btn-dfs" style="flex:1;">DFS</button>
        </div>
      </div>
      
      <div class="control-section">
        <h4 class="control-section-title">Start Node</h4>
        <select class="input-field" id="start-select"></select>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-traverse" style="width:100%;margin-bottom:8px;">Start Traversal</button>
        <button class="btn btn-secondary" id="btn-new" style="width:100%;">New Graph</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-traverse').addEventListener('click', traverse);
  document.getElementById('btn-new').addEventListener('click', newGraph);
  
  document.getElementById('btn-bfs').addEventListener('click', () => {
    currentAlgorithm = 'bfs';
    document.getElementById('btn-bfs').className = 'btn btn-primary active';
    document.getElementById('btn-dfs').className = 'btn btn-secondary';
    reset();
  });
  
  document.getElementById('btn-dfs').addEventListener('click', () => {
    currentAlgorithm = 'dfs';
    document.getElementById('btn-dfs').className = 'btn btn-primary active';
    document.getElementById('btn-bfs').className = 'btn btn-secondary';
    reset();
  });
  
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

function updateNodeSelect() {
  const select = document.getElementById('start-select');
  select.innerHTML = algorithm.nodes.map(n => 
    `<option value="${n.id}">${n.label}</option>`
  ).join('');
}

function setupAlgorithm() {
  algorithm = new GraphTraversal();
  animator = new AnimationController();
  animator.stepDuration = 500;
  
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
  
  algorithm.createSampleGraph();
  updateNodeSelect();
  reset();
}

function traverse() {
  const startId = parseInt(document.getElementById('start-select').value);
  if (currentAlgorithm === 'bfs') {
    algorithm.bfs(startId);
  } else {
    algorithm.dfs(startId);
  }
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  states = [{
    visited: new Set(),
    queue: [],
    stack: [],
    order: [],
    description: `Click "Start Traversal" to run ${currentAlgorithm.toUpperCase()}`
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function newGraph() {
  algorithm.generateRandomGraph(7);
  updateNodeSelect();
  reset();
}

function togglePlay() {
  if (states.length <= 1) traverse();
  animator.toggle();
}

function updatePlayButton(isPlaying) {
  document.querySelector('.icon-play').classList.toggle('hidden', isPlaying);
  document.querySelector('.icon-pause').classList.toggle('hidden', !isPlaying);
  document.getElementById('btn-play').classList.toggle('active', isPlaying);
}

function updateStats() {
  const visited = currentState?.order?.length || 0;
  document.getElementById('stat-moves').textContent = visited;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Visited:';
}

function draw() {
  if (!ctx) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Scale
  const scaleX = (width - 80) / 600;
  const scaleY = (height - 120) / 350;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (width - 600 * scale) / 2;
  const offsetY = 50;
  
  const getPos = (node) => ({
    x: offsetX + node.x * scale,
    y: offsetY + node.y * scale
  });
  
  const visited = currentState?.visited || new Set();
  const queue = currentState?.queue || currentState?.stack || [];
  const current = currentState?.current;
  const exploring = currentState?.exploring;
  const order = currentState?.order || [];
  
  // Draw edges
  algorithm.edges.forEach(edge => {
    const from = getPos(algorithm.nodes[edge.from]);
    const to = getPos(algorithm.nodes[edge.to]);
    
    let color = colors.edge;
    let lineWidth = 2;
    
    // Highlight active edges
    if (current !== null && (edge.from === current || edge.to === current) && exploring !== undefined &&
        (edge.from === exploring || edge.to === exploring)) {
      color = colors.edgeActive;
      lineWidth = 3;
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });
  
  // Draw nodes
  algorithm.nodes.forEach(node => {
    const pos = getPos(node);
    const radius = 26;
    
    let color = colors.node;
    if (node.id === current) color = colors.nodeCurrent;
    else if (node.id === exploring) color = colors.nodeExploring;
    else if (queue.includes(node.id)) color = colors.nodeQueue;
    else if (visited.has(node.id)) color = colors.nodeVisited;
    
    // Glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Label
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, pos.x, pos.y);
    
    // Visit order
    const idx = order.indexOf(node.id);
    if (idx !== -1) {
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 11px Inter';
      ctx.fillText((idx + 1).toString(), pos.x + radius - 5, pos.y - radius + 5);
    }
  });
  
  // Draw data structure (queue/stack)
  const dsY = height - 50;
  const dsLabel = currentAlgorithm === 'bfs' ? 'Queue' : 'Stack';
  
  ctx.fillStyle = '#64748b';
  ctx.font = '12px Inter';
  ctx.textAlign = 'left';
  ctx.fillText(`${dsLabel}: [${queue.map(id => algorithm.nodes[id]?.label || id).join(', ')}]`, 20, dsY);
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState?.description || '', width / 2, 25);
}

export default { init };
