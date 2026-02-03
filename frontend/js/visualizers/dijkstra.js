/**
 * Dijkstra's Algorithm - Visualizer
 */
import { Dijkstra } from '../algorithms/dijkstra.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: "Dijkstra's Algorithm",
  description: 'Find the shortest path between nodes in a weighted graph.',
  overview: `
    <h3>What is Dijkstra's Algorithm?</h3>
    <p>Dijkstra's algorithm, conceived by computer scientist Edsger W. Dijkstra in 1956, finds the shortest path between nodes in a weighted graph.</p>
    <p>It works by maintaining a set of unvisited nodes and repeatedly selecting the unvisited node with the smallest known distance.</p>
    <ul>
      <li>Works with non-negative edge weights</li>
      <li>Guarantees the shortest path</li>
      <li>Uses a greedy approach</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O((V+E)logV)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(V)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>How It Works</h3>
    <ol style="padding-left:24px;">
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Set distance to start node as 0, all others as infinity</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Pick unvisited node with smallest distance</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">For each neighbor, calculate new distance through current node</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">If new distance is smaller, update it</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Mark current node as visited and repeat</li>
    </ol>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>GPS Navigation:</strong> Finding shortest routes</li>
      <li><strong>Network Routing:</strong> Internet packet routing protocols</li>
      <li><strong>Social Networks:</strong> Finding degrees of separation</li>
      <li><strong>Games:</strong> Pathfinding for AI characters</li>
    </ul>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">dijkstra</span>(graph, start):
    dist[start] = <span class="number">0</span>
    <span class="keyword">for</span> all other v: dist[v] = ∞
    
    pq = PriorityQueue(start)
    
    <span class="keyword">while</span> pq not empty:
        u = pq.extractMin()
        
        <span class="keyword">for</span> each neighbor v of u:
            newDist = dist[u] + weight(u,v)
            <span class="keyword">if</span> newDist < dist[v]:
                dist[v] = newDist
                pq.insert(v, newDist)
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;
let startNode = 0, endNode = 5;

const colors = {
  bg: '#0f172a',
  node: '#3b82f6',
  nodeVisited: '#10b981',
  nodeCurrent: '#f59e0b',
  nodePath: '#ec4899',
  edge: '#475569',
  edgeExploring: '#f59e0b',
  edgePath: '#10b981',
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
        <h4 class="control-section-title">Path</h4>
        <div class="input-group">
          <label class="input-label">Start Node</label>
          <select class="input-field" id="start-select"></select>
        </div>
        <div class="input-group">
          <label class="input-label">End Node</label>
          <select class="input-field" id="end-select"></select>
        </div>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-find" style="width:100%;margin-bottom:8px;">Find Shortest Path</button>
        <button class="btn btn-secondary" id="btn-new-graph" style="width:100%;">New Graph</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-find').addEventListener('click', findPath);
  document.getElementById('btn-new-graph').addEventListener('click', newGraph);
  
  document.getElementById('speed-slider').addEventListener('input', e => {
    animator.setSpeed(parseFloat(e.target.value));
    document.getElementById('speed-label').textContent = e.target.value + 'x';
  });
  
  document.getElementById('start-select').addEventListener('change', e => {
    startNode = parseInt(e.target.value);
  });
  
  document.getElementById('end-select').addEventListener('change', e => {
    endNode = parseInt(e.target.value);
  });
  
  document.getElementById('progress-bar').addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    const step = Math.floor((e.clientX - rect.left) / rect.width * (states.length - 1));
    animator.goToStep(step);
  });
}

function updateNodeSelects() {
  const startSel = document.getElementById('start-select');
  const endSel = document.getElementById('end-select');
  
  const options = algorithm.nodes.map(n => 
    `<option value="${n.id}">${n.label}</option>`
  ).join('');
  
  startSel.innerHTML = options;
  endSel.innerHTML = options;
  
  startSel.value = startNode;
  endSel.value = endNode;
}

function setupAlgorithm() {
  algorithm = new Dijkstra();
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
  
  algorithm.createSampleGraph();
  updateNodeSelects();
  reset();
}

function findPath() {
  algorithm.findShortestPath(startNode, endNode);
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  states = [{
    distances: algorithm.nodes.map((_, i) => i === startNode ? 0 : Infinity),
    visited: new Set(),
    current: null,
    path: [],
    description: 'Click "Find Shortest Path" to start',
    phase: 'init'
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function newGraph() {
  algorithm.generateGraph(6);
  startNode = 0;
  endNode = algorithm.nodes.length - 1;
  updateNodeSelects();
  reset();
}

function togglePlay() {
  if (states.length <= 1) findPath();
  animator.toggle();
}

function updatePlayButton(isPlaying) {
  document.querySelector('.icon-play').classList.toggle('hidden', isPlaying);
  document.querySelector('.icon-pause').classList.toggle('hidden', !isPlaying);
  document.getElementById('btn-play').classList.toggle('active', isPlaying);
}

function updateStats() {
  const dist = currentState?.distances?.[endNode];
  document.getElementById('stat-moves').textContent = dist === Infinity ? '∞' : (dist || 0);
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Distance:';
}

function draw() {
  if (!ctx || !currentState) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Scale graph to fit
  const scaleX = (width - 100) / 550;
  const scaleY = (height - 100) / 350;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = (width - 550 * scale) / 2;
  const offsetY = (height - 350 * scale) / 2 + 20;
  
  const getPos = (node) => ({
    x: offsetX + node.x * scale,
    y: offsetY + node.y * scale
  });
  
  // Draw edges
  algorithm.edges.forEach(edge => {
    const from = getPos(algorithm.nodes[edge.from]);
    const to = getPos(algorithm.nodes[edge.to]);
    
    let color = colors.edge;
    let lineWidth = 2;
    
    // Path edge
    if (currentState.path?.length > 1) {
      for (let i = 0; i < currentState.path.length - 1; i++) {
        if ((currentState.path[i] === edge.from && currentState.path[i+1] === edge.to) ||
            (currentState.path[i] === edge.to && currentState.path[i+1] === edge.from)) {
          color = colors.edgePath;
          lineWidth = 4;
        }
      }
    }
    
    // Exploring edge
    if (currentState.exploring?.from === edge.from && currentState.exploring?.to === edge.to ||
        currentState.exploring?.from === edge.to && currentState.exploring?.to === edge.from) {
      color = colors.edgeExploring;
      lineWidth = 3;
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    
    // Weight label
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(midX, midY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(edge.weight.toString(), midX, midY);
  });
  
  // Draw nodes
  algorithm.nodes.forEach((node, i) => {
    const pos = getPos(node);
    const radius = 28;
    
    let color = colors.node;
    if (currentState.path?.includes(i)) color = colors.nodePath;
    else if (currentState.current === i) color = colors.nodeCurrent;
    else if (currentState.visited?.has(i)) color = colors.nodeVisited;
    else if (i === startNode) color = '#10b981';
    else if (i === endNode) color = '#ec4899';
    
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
    
    // Distance
    const dist = currentState.distances?.[i];
    if (dist !== undefined) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter';
      ctx.fillText(dist === Infinity ? '∞' : dist.toString(), pos.x, pos.y + radius + 14);
    }
  });
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState.description || '', width / 2, 25);
}

export default { init };
