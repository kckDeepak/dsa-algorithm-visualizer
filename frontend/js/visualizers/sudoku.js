/**
 * Sudoku Solver - Visualizer
 */
import { SudokuSolver } from '../algorithms/sudoku.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'Sudoku Solver',
  description: 'Watch backtracking solve a Sudoku puzzle step by step.',
  overview: `
    <h3>What is Sudoku?</h3>
    <p>Sudoku is a logic-based number placement puzzle. The goal is to fill a 9×9 grid with digits so that each column, row, and 3×3 box contains all digits from 1 to 9.</p>
    <p>The backtracking algorithm tries numbers and undoes (backtracks) when a conflict is found.</p>
    <ul>
      <li>Each row must contain 1-9</li>
      <li>Each column must contain 1-9</li>
      <li>Each 3×3 box must contain 1-9</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(9^m)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(m)</div>
      </div>
    </div>
    <p style="font-size:12px;color:var(--color-text-muted);margin-top:8px;">m = number of empty cells</p>
  `,
  steps: `
    <h3>Backtracking Algorithm</h3>
    <ol style="padding-left:24px;">
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Find an empty cell</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Try numbers 1-9</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Check if valid (row, column, box)</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">If valid, place and recurse</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">If stuck, backtrack and try next</li>
    </ol>
  `,
  applications: `
    <h3>Applications</h3>
    <ul>
      <li><strong>Constraint Satisfaction:</strong> CSP problem solving</li>
      <li><strong>AI & Logic:</strong> Pattern for search algorithms</li>
      <li><strong>Cryptography:</strong> Latin square applications</li>
      <li><strong>Education:</strong> Teaching recursive thinking</li>
    </ul>
  `,
  code: `
    <div class="code-block">
<span class="keyword">function</span> <span class="function">solve</span>(grid):
    cell = <span class="function">findEmpty</span>(grid)
    <span class="keyword">if</span> cell == null:
        <span class="keyword">return</span> <span class="keyword">true</span>  <span class="comment">// Solved!</span>
    
    <span class="keyword">for</span> num in <span class="number">1</span>..<span class="number">9</span>:
        <span class="keyword">if</span> <span class="function">isValid</span>(grid, cell, num):
            grid[cell] = num
            
            <span class="keyword">if</span> <span class="function">solve</span>(grid):
                <span class="keyword">return</span> <span class="keyword">true</span>
            
            grid[cell] = <span class="number">0</span>  <span class="comment">// Backtrack</span>
    
    <span class="keyword">return</span> <span class="keyword">false</span>
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  bg: '#0f172a',
  grid: '#1e293b',
  cell: '#334155',
  cellOriginal: '#475569',
  border: '#64748b',
  boxBorder: '#94a3b8',
  text: '#f1f5f9',
  textOriginal: '#e2e8f0',
  textNew: '#60a5fa',
  current: '#3b82f6',
  trying: '#f59e0b',
  valid: '#10b981',
  backtrack: '#ef4444'
};

export function init() {
  setupDOM();
  setupControls(); // Controls must come before algorithm for difficulty select
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
        <h4 class="control-section-title">Difficulty</h4>
        <select class="input-field" id="difficulty-select">
          <option value="easy">Easy (30 empty)</option>
          <option value="medium" selected>Medium (40 empty)</option>
          <option value="hard">Hard (50 empty)</option>
        </select>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-solve" style="width:100%;margin-bottom:8px;">Solve Puzzle</button>
        <button class="btn btn-secondary" id="btn-new" style="width:100%;">New Puzzle</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-solve').addEventListener('click', solve);
  document.getElementById('btn-new').addEventListener('click', newPuzzle);
  
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
  algorithm = new SudokuSolver();
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
  
  newPuzzle();
}

function solve() {
  algorithm.solve();
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  algorithm.grid = algorithm.original.map(row => [...row]);
  states = [{
    grid: algorithm.grid.map(row => [...row]),
    description: 'Click "Solve" to start'
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function newPuzzle() {
  const difficulty = document.getElementById('difficulty-select').value;
  algorithm.generatePuzzle(difficulty);
  reset();
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
  // Count filled cells
  const grid = currentState?.grid || algorithm.grid;
  const filled = grid.flat().filter(v => v !== 0).length;
  document.getElementById('stat-moves').textContent = filled;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Filled:';
}

function draw() {
  if (!ctx) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  const grid = currentState?.grid || algorithm.grid;
  
  // Calculate grid dimensions
  const size = Math.min(width - 60, height - 80);
  const cellSize = size / 9;
  const offsetX = (width - size) / 2;
  const offsetY = (height - size) / 2 + 15;
  
  // Draw cells
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const x = offsetX + col * cellSize;
      const y = offsetY + row * cellSize;
      const val = grid[row][col];
      const isOriginal = algorithm.isOriginal(row, col);
      const isCurrent = currentState?.current?.row === row && currentState?.current?.col === col;
      
      // Cell background
      let cellBg = colors.cell;
      if (isCurrent) {
        if (currentState.backtrack) cellBg = colors.backtrack;
        else if (currentState.valid) cellBg = colors.valid;
        else cellBg = colors.trying;
      } else if (isOriginal) {
        cellBg = colors.cellOriginal;
      }
      
      ctx.fillStyle = cellBg;
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      
      // Value
      if (val !== 0) {
        ctx.fillStyle = isOriginal ? colors.textOriginal : colors.textNew;
        ctx.font = `bold ${cellSize * 0.5}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toString(), x + cellSize / 2, y + cellSize / 2);
      }
      
      // Trying value indicator
      if (isCurrent && currentState.trying && val === 0) {
        ctx.fillStyle = colors.trying;
        ctx.font = `${cellSize * 0.4}px Inter`;
        ctx.fillText(currentState.trying.toString(), x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
  
  // Draw grid lines
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 9; i++) {
    ctx.beginPath();
    ctx.moveTo(offsetX + i * cellSize, offsetY);
    ctx.lineTo(offsetX + i * cellSize, offsetY + size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + i * cellSize);
    ctx.lineTo(offsetX + size, offsetY + i * cellSize);
    ctx.stroke();
  }
  
  // Draw 3x3 box borders
  ctx.strokeStyle = colors.boxBorder;
  ctx.lineWidth = 3;
  for (let i = 0; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(offsetX + i * cellSize * 3, offsetY);
    ctx.lineTo(offsetX + i * cellSize * 3, offsetY + size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + i * cellSize * 3);
    ctx.lineTo(offsetX + size, offsetY + i * cellSize * 3);
    ctx.stroke();
  }
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState?.description || '', width / 2, 22);
}

export default { init };
