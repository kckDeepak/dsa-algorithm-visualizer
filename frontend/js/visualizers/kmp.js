/**
 * KMP String Matching - Visualizer
 */
import { KMPMatcher } from '../algorithms/kmp.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'KMP String Matching',
  description: 'An efficient pattern matching algorithm using a preprocessed failure function.',
  overview: `
    <h3>What is KMP?</h3>
    <p>The Knuth-Morris-Pratt algorithm is an efficient string matching algorithm that avoids redundant comparisons by using information from previous matches.</p>
    <p>The key innovation is the LPS (Longest Proper Prefix which is also Suffix) array that tells us how much to "shift" the pattern when a mismatch occurs.</p>
    <ul>
      <li>Preprocesses pattern in O(m) time</li>
      <li>Searches in O(n) time</li>
      <li>Never backtracks in the text</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(n + m)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(m)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>How It Works</h3>
    <ol style="padding-left:24px;">
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Build LPS array from pattern</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Compare text[i] with pattern[j]</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">On match: advance both pointers</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">On mismatch: use LPS to skip comparisons</li>
    </ol>
    <p style="margin-top:16px;"><strong>LPS Array:</strong> For each position, stores the length of the longest proper prefix that is also a suffix.</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>Text Editors:</strong> Find and Replace functionality</li>
      <li><strong>DNA Sequencing:</strong> Matching genetic patterns</li>
      <li><strong>Plagiarism Detection:</strong> Finding copied content</li>
      <li><strong>Search Engines:</strong> Keyword matching</li>
    </ul>
  `,
  code: `
    <div class="code-block">
<span class="keyword">function</span> <span class="function">KMP</span>(text, pattern):
    lps = <span class="function">buildLPS</span>(pattern)
    i = j = <span class="number">0</span>
    
    <span class="keyword">while</span> i < len(text):
        <span class="keyword">if</span> text[i] == pattern[j]:
            i++; j++
            <span class="keyword">if</span> j == len(pattern):
                <span class="function">foundMatch</span>(i - j)
                j = lps[j - <span class="number">1</span>]
        <span class="keyword">else</span>:
            <span class="keyword">if</span> j != <span class="number">0</span>:
                j = lps[j - <span class="number">1</span>]
            <span class="keyword">else</span>:
                i++
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  bg: '#0f172a',
  text: '#94a3b8',
  char: '#3b82f6',
  charMatch: '#10b981',
  charMismatch: '#ef4444',
  charFound: '#f59e0b',
  pattern: '#8b5cf6',
  lps: '#64748b'
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
        <h4 class="control-section-title">Input</h4>
        <div class="input-group">
          <label class="input-label">Text</label>
          <input type="text" class="input-field" id="input-text" value="ABABDABACDABABCABAB" maxlength="40">
        </div>
        <div class="input-group">
          <label class="input-label">Pattern</label>
          <input type="text" class="input-field" id="input-pattern" value="ABABCABAB" maxlength="15">
        </div>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-search" style="width:100%;">Search Pattern</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-search').addEventListener('click', search);
  
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
  algorithm = new KMPMatcher();
  animator = new AnimationController();
  animator.stepDuration = 400;
  
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
  algorithm.setText(document.getElementById('input-text').value);
  algorithm.setPattern(document.getElementById('input-pattern').value);
}

function search() {
  updateInputs();
  algorithm.search();
  states = algorithm.states;
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  updateInputs();
  states = [{
    text: algorithm.text,
    pattern: algorithm.pattern,
    textIndex: 0,
    patternIndex: 0,
    matches: [],
    description: 'Click "Search Pattern" to begin'
  }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function togglePlay() {
  if (states.length <= 1) search();
  animator.toggle();
}

function updatePlayButton(isPlaying) {
  document.querySelector('.icon-play').classList.toggle('hidden', isPlaying);
  document.querySelector('.icon-pause').classList.toggle('hidden', !isPlaying);
  document.getElementById('btn-play').classList.toggle('active', isPlaying);
}

function updateStats() {
  const matches = currentState?.matches?.length || 0;
  document.getElementById('stat-moves').textContent = matches;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Matches:';
}

function draw() {
  if (!ctx) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  const text = currentState?.text || algorithm.text;
  const pattern = currentState?.pattern || algorithm.pattern;
  const textIndex = currentState?.textIndex || 0;
  const patternIndex = currentState?.patternIndex || 0;
  const matches = currentState?.matches || [];
  const lps = currentState?.lps || [];
  const comparing = currentState?.comparing || [];
  
  if (!text || !pattern) return;
  
  const charWidth = Math.min(30, (width - 80) / Math.max(text.length, pattern.length + 5));
  const charHeight = 40;
  const padding = 40;
  
  // Draw text label
  ctx.fillStyle = colors.text;
  ctx.font = '12px Inter';
  ctx.textAlign = 'right';
  ctx.fillText('Text:', padding - 10, 100);
  
  // Draw text characters
  for (let i = 0; i < text.length; i++) {
    const x = padding + i * charWidth;
    const y = 80;
    
    // Check if this is a match position
    const isMatch = matches.some(m => i >= m && i < m + pattern.length);
    
    // Background
    let bgColor = '#1e293b';
    if (comparing.length === 2 && comparing[0] === i) {
      bgColor = currentState.mismatch ? colors.charMismatch : colors.charMatch;
    } else if (isMatch) {
      bgColor = '#065f46'; // Dark green for found matches
    }
    
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x + 1, y, charWidth - 2, charHeight, 4);
    ctx.fill();
    
    // Character
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text[i], x + charWidth / 2, y + charHeight / 2);
    
    // Index
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(i.toString(), x + charWidth / 2, y + charHeight + 14);
  }
  
  // Draw pattern (aligned with text position)
  const patternOffset = textIndex - patternIndex;
  ctx.fillStyle = colors.text;
  ctx.font = '12px Inter';
  ctx.textAlign = 'right';
  ctx.fillText('Pattern:', padding - 10, 180);
  
  for (let j = 0; j < pattern.length; j++) {
    const x = padding + (patternOffset + j) * charWidth;
    const y = 160;
    
    if (x < padding - charWidth || x > width - padding) continue;
    
    // Background
    let bgColor = '#3d1c54'; // Purple-ish
    if (comparing.length === 2 && comparing[1] === j) {
      bgColor = currentState.mismatch ? colors.charMismatch : colors.charMatch;
    }
    
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x + 1, y, charWidth - 2, charHeight, 4);
    ctx.fill();
    
    // Character
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pattern[j], x + charWidth / 2, y + charHeight / 2);
  }
  
  // Draw LPS array
  if (lps.length > 0) {
    ctx.fillStyle = colors.text;
    ctx.font = '12px Inter';
    ctx.textAlign = 'right';
    ctx.fillText('LPS:', padding - 10, 280);
    
    for (let j = 0; j < lps.length; j++) {
      const x = padding + j * charWidth;
      const y = 260;
      
      ctx.fillStyle = '#1e3a5f';
      ctx.beginPath();
      ctx.roundRect(x + 1, y, charWidth - 2, charHeight, 4);
      ctx.fill();
      
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lps[j].toString(), x + charWidth / 2, y + charHeight / 2);
    }
  }
  
  // Draw match highlights
  if (currentState?.matchFound !== undefined) {
    const x = padding + currentState.matchFound * charWidth;
    ctx.strokeStyle = colors.charFound;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, 76, pattern.length * charWidth, charHeight + 8, 6);
    ctx.stroke();
  }
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState?.description || '', width / 2, 30);
  
  // Match count
  if (matches.length > 0) {
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Matches found at positions: [${matches.join(', ')}]`, width / 2, height - 30);
  }
}

export default { init };
