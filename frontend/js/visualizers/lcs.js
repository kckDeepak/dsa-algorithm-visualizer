/**
 * Longest Common Subsequence - Visualizer
 */
import { LCS } from '../algorithms/lcs.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'Longest Common Subsequence',
  description: 'Dynamic programming approach to find the longest subsequence common to two strings.',
  overview: `
    <h3>What is LCS?</h3>
    <p>The Longest Common Subsequence (LCS) problem finds the longest sequence that appears in both strings in the same order (but not necessarily contiguous).</p>
    <p>For example, the LCS of "ABCDGH" and "AEDFHR" is "ADH" with length 3.</p>
    <ul>
      <li>Classic dynamic programming problem</li>
      <li>Uses optimal substructure</li>
      <li>Backtracking finds the actual sequence</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(m × n)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(m × n)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>DP Recurrence</h3>
    <p>For each pair of characters at positions i, j:</p>
    <div class="code-block" style="margin:16px 0;">
<span class="keyword">if</span> str1[i] == str2[j]:
    dp[i][j] = dp[i-1][j-1] + 1
<span class="keyword">else</span>:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    </div>
    <p><strong style="color:#10b981">Green</strong> = match (diagonal), <strong style="color:#f59e0b">Yellow</strong> = current cell</p>
  `,
  applications: `
    <h3>Applications</h3>
    <ul>
      <li><strong>Diff Tools:</strong> Git diff, file comparison</li>
      <li><strong>Bioinformatics:</strong> DNA sequence alignment</li>
      <li><strong>Plagiarism Detection:</strong> Compare document similarity</li>
      <li><strong>Version Control:</strong> Merge conflict resolution</li>
    </ul>
  `,
  code: `
    <div class="code-block">
<span class="keyword">function</span> <span class="function">lcs</span>(X, Y):
    m, n = len(X), len(Y)
    dp = <span class="number">0</span>-matrix(m+<span class="number">1</span>, n+<span class="number">1</span>)
    
    <span class="keyword">for</span> i in <span class="number">1</span>..m:
        <span class="keyword">for</span> j in <span class="number">1</span>..n:
            <span class="keyword">if</span> X[i] == Y[j]:
                dp[i][j] = dp[i-<span class="number">1</span>][j-<span class="number">1</span>] + <span class="number">1</span>
            <span class="keyword">else</span>:
                dp[i][j] = max(dp[i-<span class="number">1</span>][j], dp[i][j-<span class="number">1</span>])
    
    <span class="keyword">return</span> dp[m][n]
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  bg: '#0f172a',
  cell: '#1e293b',
  cellCurrent: '#f59e0b',
  cellMatch: '#10b981',
  cellPath: '#8b5cf6',
  header: '#334155',
  text: '#e2e8f0',
  textMuted: '#64748b',
  charMatch: '#10b981',
  charNormal: '#94a3b8'
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
        <h4 class="control-section-title">Strings</h4>
        <div class="input-group">
          <label class="input-label">String 1</label>
          <input type="text" class="input-field" id="input-str1" value="AGGTAB" maxlength="10">
        </div>
        <div class="input-group">
          <label class="input-label">String 2</label>
          <input type="text" class="input-field" id="input-str2" value="GXTXAYB" maxlength="10">
        </div>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-solve" style="width:100%;">Find LCS</button>
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
  
  document.getElementById('progress-bar').addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    const step = Math.floor((e.clientX - rect.left) / rect.width * (states.length - 1));
    animator.goToStep(Math.max(0, step));
  });
}

function setupAlgorithm() {
  algorithm = new LCS();
  animator = new AnimationController();
  animator.stepDuration = 200;
  
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
  
  updateInputs();
  reset();
}

function updateInputs() {
  const str1 = document.getElementById('input-str1').value.toUpperCase();
  const str2 = document.getElementById('input-str2').value.toUpperCase();
  algorithm.setStrings(str1, str2);
}

function solve() {
  updateInputs();
  algorithm.solve();
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  updateInputs();
  const m = algorithm.str1.length;
  const n = algorithm.str2.length;
  states = [{
    dp: Array(m + 1).fill().map(() => Array(n + 1).fill(0)),
    description: 'Click "Find LCS" to start'
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
  const dp = currentState?.dp || [];
  const m = algorithm.str1.length;
  const n = algorithm.str2.length;
  const lcsLen = dp[m]?.[n] || 0;
  document.getElementById('stat-moves').textContent = lcsLen;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'LCS Length:';
}

function draw() {
  if (!ctx) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  const str1 = algorithm.str1;
  const str2 = algorithm.str2;
  const dp = currentState?.dp || [];
  const m = str1.length;
  const n = str2.length;
  
  if (m === 0 || n === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Enter two strings to compare', width / 2, height / 2);
    return;
  }
  
  // Calculate cell size
  const maxCellSize = 40;
  const cellSize = Math.min(maxCellSize, (width - 120) / (n + 2), (height - 140) / (m + 2));
  const tableWidth = (n + 2) * cellSize;
  const tableHeight = (m + 2) * cellSize;
  const offsetX = (width - tableWidth) / 2;
  const offsetY = 60;
  
  // Draw string 1 (vertical, left side)
  for (let i = 0; i < m; i++) {
    const x = offsetX;
    const y = offsetY + (i + 2) * cellSize;
    
    const isLCSChar = currentState?.lcsIndices?.indices1?.includes(i);
    ctx.fillStyle = isLCSChar ? colors.charMatch : colors.charNormal;
    ctx.font = `bold ${cellSize * 0.5}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str1[i], x + cellSize / 2, y + cellSize / 2);
  }
  
  // Draw string 2 (horizontal, top)
  for (let j = 0; j < n; j++) {
    const x = offsetX + (j + 2) * cellSize;
    const y = offsetY;
    
    const isLCSChar = currentState?.lcsIndices?.indices2?.includes(j);
    ctx.fillStyle = isLCSChar ? colors.charMatch : colors.charNormal;
    ctx.font = `bold ${cellSize * 0.5}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str2[j], x + cellSize / 2, y + cellSize / 2);
  }
  
  // Draw DP table
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      const x = offsetX + (j + 1) * cellSize;
      const y = offsetY + (i + 1) * cellSize;
      
      // Background
      let bgColor = colors.cell;
      if (i === 0 || j === 0) bgColor = colors.header;
      
      if (currentState?.i === i && currentState?.j === j) {
        bgColor = currentState.match ? colors.cellMatch : colors.cellCurrent;
      } else if (currentState?.backtracking && currentState?.i === i && currentState?.j === j) {
        bgColor = colors.cellPath;
      }
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      
      // Value
      const val = dp[i]?.[j];
      if (val !== undefined) {
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${cellSize * 0.4}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toString(), x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
  
  // Draw current LCS if backtracking
  if (currentState?.currentLCS) {
    ctx.fillStyle = colors.charMatch;
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Current LCS: "${currentState.currentLCS}"`, width / 2, height - 30);
  }
  
  // Final LCS
  if (currentState?.lcs) {
    ctx.fillStyle = colors.charMatch;
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`LCS: "${currentState.lcs}"`, width / 2, height - 30);
  }
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState?.description || '', width / 2, 30);
}

export default { init };
