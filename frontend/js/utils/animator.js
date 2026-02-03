/**
 * DSA Algorithm Visualizer - Animator Module
 * High-performance animation engine using requestAnimationFrame
 */

/**
 * Animation Controller Class
 * Manages animation state, timing, and frame updates
 */
export class AnimationController {
  constructor() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.totalSteps = 0;
    this.speed = 1; // 1x speed
    this.steps = [];
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    this.stepDuration = 500; // Base duration in ms
    this.onStepChange = null;
    this.onComplete = null;
    this.onStateChange = null;
  }

  /**
   * Set the animation steps
   * @param {Array} steps - Array of step objects with state data
   */
  setSteps(steps) {
    this.steps = steps;
    this.totalSteps = steps.length;
    this.currentStep = 0;
    this.notifyStateChange();
  }

  /**
   * Get current step data
   * @returns {Object} Current step state
   */
  getCurrentState() {
    return this.steps[this.currentStep] || null;
  }

  /**
   * Set animation speed multiplier
   * @param {number} speed - Speed multiplier (0.5 to 4)
   */
  setSpeed(speed) {
    this.speed = Math.max(0.25, Math.min(4, speed));
    this.notifyStateChange();
  }

  /**
   * Get effective step duration based on speed
   * @returns {number} Duration in milliseconds
   */
  getEffectiveDuration() {
    return this.stepDuration / this.speed;
  }

  /**
   * Start or resume animation
   */
  play() {
    if (this.currentStep >= this.totalSteps - 1) {
      this.reset();
    }
    
    this.isPlaying = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.animate();
    this.notifyStateChange();
  }

  /**
   * Pause animation
   */
  pause() {
    this.isPlaying = false;
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.notifyStateChange();
  }

  /**
   * Toggle play/pause
   */
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Stop animation and reset to beginning
   */
  stop() {
    this.pause();
    this.currentStep = 0;
    this.notifyStepChange();
    this.notifyStateChange();
  }

  /**
   * Reset animation to beginning
   */
  reset() {
    this.currentStep = 0;
    this.notifyStepChange();
    this.notifyStateChange();
  }

  /**
   * Go to specific step
   * @param {number} step - Step index
   */
  goToStep(step) {
    this.currentStep = Math.max(0, Math.min(step, this.totalSteps - 1));
    this.notifyStepChange();
    this.notifyStateChange();
  }

  /**
   * Move to next step
   */
  stepForward() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.notifyStepChange();
      this.notifyStateChange();
    }
  }

  /**
   * Move to previous step
   */
  stepBackward() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.notifyStepChange();
      this.notifyStateChange();
    }
  }

  /**
   * Main animation loop using requestAnimationFrame
   */
  animate() {
    if (!this.isPlaying) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    if (deltaTime >= this.getEffectiveDuration()) {
      this.lastFrameTime = currentTime;
      
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep++;
        this.notifyStepChange();
      } else {
        this.pause();
        if (this.onComplete) {
          this.onComplete();
        }
        return;
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Notify step change callback
   */
  notifyStepChange() {
    if (this.onStepChange) {
      this.onStepChange(this.getCurrentState(), this.currentStep, this.totalSteps);
    }
  }

  /**
   * Notify state change callback
   */
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        currentStep: this.currentStep,
        totalSteps: this.totalSteps,
        speed: this.speed,
        progress: this.totalSteps > 0 ? (this.currentStep / (this.totalSteps - 1)) * 100 : 0
      });
    }
  }

  /**
   * Clean up animation resources
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.steps = [];
    this.onStepChange = null;
    this.onComplete = null;
    this.onStateChange = null;
  }
}

/**
 * Tween Class for smooth value interpolation
 */
export class Tween {
  /**
   * Linear interpolation
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} t - Progress (0 to 1)
   * @returns {number} Interpolated value
   */
  static linear(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Ease in quad
   */
  static easeInQuad(start, end, t) {
    return start + (end - start) * t * t;
  }

  /**
   * Ease out quad
   */
  static easeOutQuad(start, end, t) {
    return start + (end - start) * (1 - (1 - t) * (1 - t));
  }

  /**
   * Ease in out quad
   */
  static easeInOutQuad(start, end, t) {
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return start + (end - start) * ease;
  }

  /**
   * Ease out bounce
   */
  static easeOutBounce(start, end, t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    let ease;

    if (t < 1 / d1) {
      ease = n1 * t * t;
    } else if (t < 2 / d1) {
      ease = n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      ease = n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      ease = n1 * (t -= 2.625 / d1) * t + 0.984375;
    }

    return start + (end - start) * ease;
  }

  /**
   * Elastic ease out
   */
  static easeOutElastic(start, end, t) {
    const c4 = (2 * Math.PI) / 3;
    const ease = t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    return start + (end - start) * ease;
  }

  /**
   * Spring animation
   */
  static spring(start, end, t, stiffness = 100, damping = 10) {
    const x = 1 - Math.exp(-t * damping) * Math.cos(t * Math.sqrt(stiffness));
    return start + (end - start) * x;
  }
}

/**
 * Canvas Animator for high-performance canvas rendering
 */
export class CanvasAnimator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animations = new Map();
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    
    this.setupCanvas();
  }

  /**
   * Setup canvas for high DPI displays
   */
  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  /**
   * Add an animation to the render queue
   * @param {string} id - Unique animation ID
   * @param {Object} animation - Animation config
   */
  addAnimation(id, animation) {
    this.animations.set(id, {
      ...animation,
      startTime: performance.now(),
      progress: 0
    });
    
    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * Remove an animation
   * @param {string} id - Animation ID
   */
  removeAnimation(id) {
    this.animations.delete(id);
    
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  /**
   * Clear all animations
   */
  clearAnimations() {
    this.animations.clear();
    this.stop();
  }

  /**
   * Start the animation loop
   */
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.render();
  }

  /**
   * Stop the animation loop
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main render loop
   */
  render() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and render all animations
    const completedAnimations = [];

    this.animations.forEach((anim, id) => {
      const elapsed = currentTime - anim.startTime;
      anim.progress = Math.min(elapsed / anim.duration, 1);

      // Call render function
      if (anim.render) {
        anim.render(this.ctx, anim.progress, elapsed);
      }

      // Check if complete
      if (anim.progress >= 1) {
        if (anim.onComplete) {
          anim.onComplete();
        }
        if (!anim.loop) {
          completedAnimations.push(id);
        } else {
          anim.startTime = currentTime;
          anim.progress = 0;
        }
      }
    });

    // Remove completed animations
    completedAnimations.forEach(id => this.removeAnimation(id));

    // Continue loop
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  /**
   * Get canvas context
   * @returns {CanvasRenderingContext2D}
   */
  getContext() {
    return this.ctx;
  }

  /**
   * Resize canvas
   */
  resize() {
    this.setupCanvas();
  }

  /**
   * Clean up
   */
  destroy() {
    this.stop();
    this.animations.clear();
  }
}

/**
 * Create smooth transition between two states
 * @param {Object} from - Starting state
 * @param {Object} to - Ending state
 * @param {number} duration - Duration in ms
 * @param {Function} onUpdate - Update callback
 * @param {Function} easing - Easing function
 * @returns {Promise} Resolves when animation completes
 */
export function animateTransition(from, to, duration, onUpdate, easing = Tween.easeInOutQuad) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Interpolate between states
      const current = {};
      for (const key in from) {
        if (typeof from[key] === 'number' && typeof to[key] === 'number') {
          current[key] = easing(from[key], to[key], progress);
        } else {
          current[key] = progress < 1 ? from[key] : to[key];
        }
      }
      
      onUpdate(current, progress);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    }
    
    requestAnimationFrame(update);
  });
}

/**
 * Delay execution using requestAnimationFrame
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sequential animation helper
 * @param {Array} animations - Array of animation functions
 * @returns {Promise}
 */
export async function sequence(animations) {
  for (const anim of animations) {
    await anim();
  }
}

/**
 * Parallel animation helper
 * @param {Array} animations - Array of animation functions
 * @returns {Promise}
 */
export function parallel(animations) {
  return Promise.all(animations.map(anim => anim()));
}

export default AnimationController;
