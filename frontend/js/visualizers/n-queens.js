/**
 * N-Queens - Visualizer
 */
import { NQueens } from '../algorithms/nQueens.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'N-Queens Problem',
  description: 'Place N queens on an N×N chessboard so that no two queens threaten each other.',
  overview: `
    <h3>What is N-Queens?</h3>
    <p>The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard such that no two queens threaten each other.</p>
    <p>A queen can attack any piece in the same row, column, or diagonal. The challenge is to find positions where all N queens are safe from each other.</p>
    <ul>
      <li>For N=4, there are 2 distinct solutions</li>
      <li>For N=8 (standard chess board), there are 92 solutions</li>
      <li>For N=12, there are 14,200 solutions</li>
    </ul>
    <div class="complexity-grid" style="margin-top: 24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(N!)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(N)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>Backtracking Algorithm</h3>
    <p>The algorithm uses backtracking to systematically try all possibilities:</p>
    <ol style="padding-left: 24px; margin-bottom: 16px;">
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">Start with the first row</li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">Try placing a queen in each column</li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">Check if the position is safe (no conflicts)</li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">If safe, move to the next row</li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">If no safe position exists, backtrack to the previous row</li>
    </ol>
    <p>The <strong style="color: var(--color-primary-light);">red highlights</strong> show conflicts, while <strong style="color: var(--color-success);">green</strong> indicates safe positions.</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>Constraint Satisfaction:</strong> Foundation for solving sudoku, scheduling, and resource allocation</li>
      <li><strong>Parallel Processing:</strong> Testing and designing parallel computing systems</li>
      <li><strong>VLSI Design:</strong> Placing components to minimize interference</li>
      <li><strong>Game Development:</strong> AI for chess and strategy games</li>
    </ul>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">solveNQueens</span>(row):
    <span class="keyword">if</span> row >= N:
        <span class="keyword">return</span> <span class="keyword">true</span>  <span class="comment">// Found solution</span>
    
    <span class="keyword">for</span> col <span class="keyword">in</span> <span class="number">0</span> to N-<span class="number">1</span>:
        <span class="keyword">if</span> <span class="function">isSafe</span>(row, col):
            board[row][col] = <span class="number">1</span>
            
            <span class="keyword">if</span> <span class="function">solveNQueens</span>(row + <span class="number">1</span>):
                <span class="keyword">return</span> <span class="keyword">true</span>
            
            board[row][col] = <span class="number">0</span>  <span class="comment">// Backtrack</span>
    
    <span class="keyword">return</span> <span class="keyword">false</span>
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  lightSquare: '#3d4a5f',
  darkSquare: '#2d3a4f',
  queen: '#f59e0b',
  conflict: '#ef4444',
  safe: '#10b981',
  checking: '#3b82f6',
  highlight: 'rgba(59, 130, 246, 0.3)'
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
          <button class="playback-btn" id="btn-reset" title="Reset">
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
        <h4 class="control-section-title">Board Size</h4>
        <div class="input-group">
          <label class="input-label" for="board-size">Queens (4-10)</label>
          <input type="number" class="input-field" id="board-size" min="4" max="10" value="6">
        </div>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-solve" style="width:100%">Solve N-Queens</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-solve').addEventListener('click', solve);
  
  document.getElementById('speed-slider').addEventListener('input', e => {
    animator.setSpeed(parseFloat(e.target.value));
    document.getElementById('speed-label').textContent = e.target.value + 'x';
  });
  
  document.getElementById('board-size').addEventListener('change', e => {
    algorithm.setSize(parseInt(e.target.value));
    reset();
  });
  
  document.getElementById('progress-bar').addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    const step = Math.floor((e.clientX - rect.left) / rect.width * (states.length - 1));
    animator.goToStep(step);
  });
}

function setupAlgorithm() {
  algorithm = new NQueens(6);
  animator = new AnimationController();
  animator.stepDuration = 300;
  
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
  
  reset();
}

function solve() {
  states = algorithm.generateStates(true);
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  algorithm.reset();
  states = [{
    board: Array(algorithm.n).fill().map(() => Array(algorithm.n).fill(0)),
    queens: [],
    description: 'Click "Solve" to start',
    solutionsFound: 0
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function togglePlay() {
  if (states.length <= 1) solve();
  animator.toggle();
}

function updatePlayButton(isPlaying) {
  document.querySelector('.icon-play').classList.toggle('hidden', isPlaying);
  document.querySelector('.icon-pause').classList.toggle('hidden', !isPlaying);
  document.getElementById('btn-play').classList.toggle('active', isPlaying);
}

function updateStats() {
  document.getElementById('stat-moves').textContent = currentState?.solutionsFound || 0;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  
  // Update stat label
  const movesEl = document.querySelector('.vis-stat:first-child span:first-child');
  if (movesEl) movesEl.textContent = 'Solutions:';
}

function draw() {
  if (!ctx || !currentState) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  const n = algorithm.n;
  
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);
  
  // Calculate board dimensions
  const padding = 40;
  const boardSize = Math.min(width - padding * 2, height - padding * 2 - 40);
  const cellSize = boardSize / n;
  const offsetX = (width - boardSize) / 2;
  const offsetY = (height - boardSize) / 2 + 20;
  
  // Draw board
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const x = offsetX + col * cellSize;
      const y = offsetY + row * cellSize;
      const isLight = (row + col) % 2 === 0;
      
      // Base color
      ctx.fillStyle = isLight ? colors.lightSquare : colors.darkSquare;
      ctx.fillRect(x, y, cellSize, cellSize);
      
      // Checking highlight
      if (currentState.checking && currentState.checking.row === row && currentState.checking.col === col) {
        ctx.fillStyle = currentState.safe ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      
      // Conflict highlight
      if (currentState.conflicts?.some(c => c.row === row && c.col === col)) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      
      // Solution highlight
      if (currentState.isSolution) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
  
  // Draw queens
  currentState.queens?.forEach(q => {
    const x = offsetX + q.col * cellSize + cellSize / 2;
    const y = offsetY + q.row * cellSize + cellSize / 2;
    
    // Queen glow
    const isConflict = currentState.conflicts?.some(c => c.row === q.row && c.col === q.col);
    ctx.shadowColor = isConflict ? colors.conflict : colors.queen;
    ctx.shadowBlur = 15;
    
    // Draw queen
    ctx.fillStyle = isConflict ? colors.conflict : colors.queen;
    ctx.font = `${cellSize * 0.6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♛', x, y);
    ctx.shadowBlur = 0;
  });
  
  // Draw checking position
  if (currentState.checking) {
    const x = offsetX + currentState.checking.col * cellSize + cellSize / 2;
    const y = offsetY + currentState.checking.row * cellSize + cellSize / 2;
    ctx.strokeStyle = currentState.safe ? colors.safe : colors.conflict;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, cellSize * 0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(currentState.description || '', width / 2, 25);
}

export default { init };
