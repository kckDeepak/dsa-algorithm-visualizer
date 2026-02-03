/**
 * DSA Algorithm Visualizer - Controls Module
 */

export class ControlPanel {
  constructor(containerSelector, animationController) {
    this.container = document.querySelector(containerSelector);
    this.animator = animationController;
    this.elements = {};
    this.inputConfigs = [];
    this.onInputChange = null;
    if (this.container) this.init();
  }

  init() {
    this.render();
    this.cacheElements();
    this.bindEvents();
    this.updateUI();
  }

  render() {
    this.container.innerHTML = `
      <div class="control-panel">
        <div class="control-section">
          <h4 class="control-section-title">Playback</h4>
          <div class="playback-controls">
            <button class="playback-btn" id="btn-reset" title="Reset">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
            </button>
            <button class="playback-btn" id="btn-step-back" title="Step Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="4" x2="5" y2="20"/>
              </svg>
            </button>
            <button class="playback-btn playback-btn-play" id="btn-play" title="Play/Pause">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-play">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-pause hidden">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>
            <button class="playback-btn" id="btn-step-forward" title="Step Forward">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="4" x2="19" y2="20"/>
              </svg>
            </button>
          </div>
          <div class="progress-container">
            <div class="progress-bar" id="progress-bar">
              <div class="progress-bar-fill" id="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-info">
              <span id="step-current">0</span>/<span id="step-total">0</span>
            </div>
          </div>
        </div>
        <div class="control-section">
          <h4 class="control-section-title">Speed</h4>
          <div class="speed-control">
            <span class="speed-label" id="speed-label">1.0x</span>
            <input type="range" class="range-slider" id="speed-slider" min="0.25" max="4" step="0.25" value="1">
          </div>
        </div>
        <div class="control-section" id="input-section">
          <h4 class="control-section-title">Parameters</h4>
          <div id="input-controls"></div>
        </div>
        <div class="control-section">
          <button class="btn btn-primary" id="btn-generate" style="width:100%;margin-bottom:8px;">Generate Random</button>
          <button class="btn btn-secondary" id="btn-clear" style="width:100%;">Clear</button>
        </div>
      </div>`;
  }

  cacheElements() {
    this.elements = {
      btnPlay: this.container.querySelector('#btn-play'),
      btnReset: this.container.querySelector('#btn-reset'),
      btnStepForward: this.container.querySelector('#btn-step-forward'),
      btnStepBack: this.container.querySelector('#btn-step-back'),
      btnGenerate: this.container.querySelector('#btn-generate'),
      btnClear: this.container.querySelector('#btn-clear'),
      iconPlay: this.container.querySelector('.icon-play'),
      iconPause: this.container.querySelector('.icon-pause'),
      speedSlider: this.container.querySelector('#speed-slider'),
      speedLabel: this.container.querySelector('#speed-label'),
      progressFill: this.container.querySelector('#progress-fill'),
      stepCurrent: this.container.querySelector('#step-current'),
      stepTotal: this.container.querySelector('#step-total'),
      inputSection: this.container.querySelector('#input-section'),
      inputControls: this.container.querySelector('#input-controls')
    };
  }

  bindEvents() {
    this.elements.btnPlay.addEventListener('click', () => this.animator.toggle());
    this.elements.btnReset.addEventListener('click', () => this.animator.reset());
    this.elements.btnStepForward.addEventListener('click', () => this.animator.stepForward());
    this.elements.btnStepBack.addEventListener('click', () => this.animator.stepBackward());
    this.elements.speedSlider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      this.animator.setSpeed(speed);
      this.elements.speedLabel.textContent = `${speed.toFixed(2)}x`;
    });
    this.container.querySelector('#progress-bar').addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const step = Math.floor(percent * (this.animator.totalSteps - 1));
      this.animator.goToStep(step);
    });
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    this.animator.onStateChange = (state) => this.updateFromState(state);
  }

  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.code) {
      case 'Space': e.preventDefault(); this.animator.toggle(); break;
      case 'ArrowLeft': e.preventDefault(); this.animator.stepBackward(); break;
      case 'ArrowRight': e.preventDefault(); this.animator.stepForward(); break;
      case 'KeyR': e.preventDefault(); this.animator.reset(); break;
    }
  }

  updateFromState(state) {
    if (state.isPlaying) {
      this.elements.iconPlay.classList.add('hidden');
      this.elements.iconPause.classList.remove('hidden');
      this.elements.btnPlay.classList.add('active');
    } else {
      this.elements.iconPlay.classList.remove('hidden');
      this.elements.iconPause.classList.add('hidden');
      this.elements.btnPlay.classList.remove('active');
    }
    this.elements.progressFill.style.width = `${state.progress}%`;
    this.elements.stepCurrent.textContent = state.currentStep + 1;
    this.elements.stepTotal.textContent = state.totalSteps;
  }

  updateUI() {
    this.updateFromState({ isPlaying: this.animator.isPlaying, currentStep: this.animator.currentStep, totalSteps: this.animator.totalSteps, progress: 0 });
  }

  setInputConfigs(configs) {
    this.inputConfigs = configs;
    this.renderInputs();
  }

  renderInputs() {
    if (!this.elements.inputControls) return;
    this.elements.inputControls.innerHTML = this.inputConfigs.map(c => {
      if (c.type === 'number') return `<div class="input-group"><label class="input-label" for="input-${c.id}">${c.label}</label><input type="number" class="input-field" id="input-${c.id}" min="${c.min||0}" max="${c.max||100}" value="${c.value}"></div>`;
      if (c.type === 'select') return `<div class="input-group"><label class="input-label" for="input-${c.id}">${c.label}</label><select class="input-field" id="input-${c.id}">${c.options.map(o=>`<option value="${o.value}" ${o.value===c.value?'selected':''}>${o.label}</option>`).join('')}</select></div>`;
      return '';
    }).join('');
    this.inputConfigs.forEach(c => {
      const el = this.elements.inputControls.querySelector(`#input-${c.id}`);
      if (el) el.addEventListener('change', e => { if (this.onInputChange) this.onInputChange(c.id, c.type==='number'?parseFloat(e.target.value):e.target.value); });
    });
  }

  getInputValues() {
    const v = {};
    this.inputConfigs.forEach(c => { const el = this.elements.inputControls.querySelector(`#input-${c.id}`); if (el) v[c.id] = c.type==='number'?parseFloat(el.value):el.value; });
    return v;
  }

  onGenerate(h) { this.elements.btnGenerate.addEventListener('click', h); }
  onClear(h) { this.elements.btnClear.addEventListener('click', h); }
  setInputsVisible(v) { this.elements.inputSection.style.display = v ? 'block' : 'none'; }
  destroy() { this.container.innerHTML = ''; }
}

export class StatsDisplay {
  constructor(containerSelector) { this.container = document.querySelector(containerSelector); this.stats = {}; if (this.container) this.init(); }
  init() { this.container.innerHTML = '<div class="visualization-stats" id="stats-container"></div>'; }
  setStats(configs) {
    const c = this.container.querySelector('#stats-container');
    c.innerHTML = configs.map(s => `<div class="visualization-stat"><span>${s.label}:</span><span class="visualization-stat-value" id="stat-${s.id}">${s.value}</span></div>`).join('');
    configs.forEach(s => { this.stats[s.id] = this.container.querySelector(`#stat-${s.id}`); });
  }
  updateStat(id, value) { if (this.stats[id]) this.stats[id].textContent = value; }
  updateStats(updates) { Object.entries(updates).forEach(([id, v]) => this.updateStat(id, v)); }
}

export default ControlPanel;
