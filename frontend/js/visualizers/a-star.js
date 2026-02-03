/**
 * A* Pathfinding - Visualizer
 */
import { AStar } from '../algorithms/aStar.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'A* Pathfinding',
  description: 'An intelligent pathfinding algorithm that uses heuristics to find optimal paths faster.',
  overview: `
    <h3>What is A* Pathfinding?</h3>
    <p>A* (pronounced "A-star") is a graph traversal and pathfinding algorithm that is widely used due to its completeness, optimality, and optimal efficiency.</p>
    <p>It combines the benefits of Dijkstra's algorithm (guaranteed shortest path) with a heuristic that guides it toward the goal.</p>
    <ul>
      <li><strong>f(n) = g(n) + h(n)</strong></li>
      <li>g(n): Cost from start to current node</li>
      <li>h(n): Estimated cost to goal (heuristic)</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(E)</div>
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
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Add start node to open set</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Pick node with lowest f-score from open set</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">If it's the goal, reconstruct path</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Otherwise, evaluate all neighbors</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Add/update neighbors in open set</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Move current node to closed set, repeat</li>
    </ol>
    <p style="margin-top:16px;"><strong style="color:#3b82f6">Blue</strong> = open set, <strong style="color:#8b5cf6">Purple</strong> = closed set, <strong style="color:#10b981">Green</strong> = path</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>Video Games:</strong> NPC and character movement</li>
      <li><strong>Robotics:</strong> Robot navigation and path planning</li>
      <li><strong>Maps:</strong> Route finding in GPS systems</li>
      <li><strong>Puzzle Solving:</strong> 15-puzzle, Rubik's cube solvers</li>
    </ul>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">aStar</span>(start, goal):
    openSet = {start}
    cameFrom = {}
    gScore[start] = <span class="number">0</span>
    fScore[start] = <span class="function">heuristic</span>(start, goal)
    
    <span class="keyword">while</span> openSet not empty:
        current = node with min fScore
        
        <span class="keyword">if</span> current == goal:
            <span class="keyword">return</span> <span class="function">reconstructPath</span>(cameFrom)
        
        openSet.remove(current)
        <span class="keyword">for</span> each neighbor of current:
            tentative_g = gScore[current] + <span class="number">1</span>
            <span class="keyword">if</span> tentative_g < gScore[neighbor]:
                cameFrom[neighbor] = current
                gScore[neighbor] = tentative_g
                fScore[neighbor] = g + <span class="function">h</span>(neighbor)
                openSet.add(neighbor)
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;
let isDrawing = false, drawMode = 'wall';

const colors = {
  bg: '#0f172a',
  grid: '#1e293b',
  wall: '#475569',
  start: '#10b981',
  end: '#ef4444',
  open: '#3b82f6',
  closed: '#8b5cf6',
  path: '#10b981',
  current: '#f59e0b'
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
  
  // Mouse events for drawing walls
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);
}

function handleMouseDown(e) {
  isDrawing = true;
  toggleCell(e);
}

function handleMouseMove(e) {
  if (isDrawing) toggleCell(e);
}

function toggleCell(e) {
  if (!algorithm) return;
  
  const rect = canvas.getBoundingClientRect();
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  const cellW = (width - 40) / algorithm.cols;
  const cellH = (height - 80) / algorithm.rows;
  
  const col = Math.floor((e.clientX - rect.left - 20) / cellW);
  const row = Math.floor((e.clientY - rect.top - 50) / cellH);
  
  if (row >= 0 && row < algorithm.rows && col >= 0 && col < algorithm.cols) {
    algorithm.toggleWall(row, col);
    draw();
  }
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
        <h4 class="control-section-title">Instructions</h4>
        <p style="font-size:12px;color:var(--color-text-secondary);line-height:1.6;">
          Click and drag on the grid to draw/erase walls. Then click "Find Path" to watch A* find the optimal route.
        </p>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-find" style="width:100%;margin-bottom:8px;">Find Path</button>
        <button class="btn btn-secondary" id="btn-maze" style="width:100%;margin-bottom:8px;">Generate Maze</button>
        <button class="btn btn-secondary" id="btn-clear" style="width:100%;">Clear Grid</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-find').addEventListener('click', findPath);
  document.getElementById('btn-maze').addEventListener('click', generateMaze);
  document.getElementById('btn-clear').addEventListener('click', clearGrid);
  
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
  algorithm = new AStar(15, 30);
  animator = new AnimationController();
  animator.stepDuration = 50;
  
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
  
  algorithm.reset();
  reset();
}

function findPath() {
  algorithm.findPath();
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  states = [{
    openSet: [],
    closedSet: new Set(),
    current: null,
    path: [],
    description: 'Draw walls, then click "Find Path"'
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function generateMaze() {
  algorithm.generateMaze();
  reset();
}

function clearGrid() {
  algorithm.reset();
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
  const pathLen = currentState?.path?.length || 0;
  document.getElementById('stat-moves').textContent = pathLen > 0 ? pathLen : '-';
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Path Length:';
}

function draw() {
  if (!ctx) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  const padding = 20;
  const topPadding = 50;
  const cellW = (width - padding * 2) / algorithm.cols;
  const cellH = (height - topPadding - padding) / algorithm.rows;
  
  const key = (r, c) => `${r},${c}`;
  
  // Create sets for quick lookup
  const openKeys = new Set((currentState?.openSet || []).map(n => key(n.row, n.col)));
  const closedKeys = currentState?.closedSet || new Set();
  const pathKeys = new Set((currentState?.path || []).map(n => key(n.row, n.col)));
  
  // Draw cells
  for (let r = 0; r < algorithm.rows; r++) {
    for (let c = 0; c < algorithm.cols; c++) {
      const x = padding + c * cellW;
      const y = topPadding + r * cellH;
      const k = key(r, c);
      
      // Determine color
      let color = colors.grid;
      
      if (algorithm.grid[r][c] === 1) {
        color = colors.wall;
      } else if (pathKeys.has(k)) {
        color = colors.path;
      } else if (currentState?.current?.row === r && currentState?.current?.col === c) {
        color = colors.current;
      } else if (closedKeys.has(k)) {
        color = colors.closed;
      } else if (openKeys.has(k)) {
        color = colors.open;
      }
      
      if (algorithm.isStart(r, c)) color = colors.start;
      if (algorithm.isEnd(r, c)) color = colors.end;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, cellW - 2, cellH - 2, 3);
      ctx.fill();
      
      // Glow for path/current
      if (pathKeys.has(k) || (currentState?.current?.row === r && currentState?.current?.col === c)) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
  
  // Legend
  ctx.font = '11px Inter';
  const legendItems = [
    { color: colors.start, label: 'Start' },
    { color: colors.end, label: 'End' },
    { color: colors.open, label: 'Open' },
    { color: colors.closed, label: 'Closed' },
    { color: colors.path, label: 'Path' }
  ];
  
  let legendX = padding;
  legendItems.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, 15, 12, 12);
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, legendX + 16, 24);
    legendX += ctx.measureText(item.label).width + 30;
  });
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px Inter';
  ctx.textAlign = 'right';
  ctx.fillText(currentState?.description || '', width - padding, 24);
}

export default { init };
