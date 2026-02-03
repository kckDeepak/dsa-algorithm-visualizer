/**
 * DSA Algorithm Visualizer - Helper Utilities
 */

// Generate random integer between min and max (inclusive)
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random array of integers
export function randomArray(length, min = 1, max = 100) {
  return Array.from({ length }, () => randomInt(min, max));
}

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Deep clone an object
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Clamp value between min and max
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Map value from one range to another
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Linear interpolation
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Distance between two points
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Angle between two points
export function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

// Convert degrees to radians
export function degToRad(deg) {
  return deg * (Math.PI / 180);
}

// Convert radians to degrees
export function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

// Generate unique ID
export function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format number with commas
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format time in ms to human readable
export function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

// HSL to RGB color conversion
export function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// Generate color gradient
export function generateGradientColors(count, startHue = 200, endHue = 280) {
  return Array.from({ length: count }, (_, i) => {
    const hue = lerp(startHue, endHue, i / (count - 1 || 1));
    return `hsl(${hue}, 70%, 60%)`;
  });
}

// Priority Queue implementation
export class PriorityQueue {
  constructor(comparator = (a, b) => a.priority - b.priority) {
    this.heap = [];
    this.comparator = comparator;
  }

  get size() { return this.heap.length; }
  get isEmpty() { return this.size === 0; }

  peek() { return this.heap[0]; }

  push(value) {
    this.heap.push(value);
    this.bubbleUp(this.size - 1);
  }

  pop() {
    if (this.isEmpty) return undefined;
    const result = this.heap[0];
    const last = this.heap.pop();
    if (this.size > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return result;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      if (left < this.size && this.comparator(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < this.size && this.comparator(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

// Stack implementation
export class Stack {
  constructor() { this.items = []; }
  get size() { return this.items.length; }
  get isEmpty() { return this.size === 0; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  clear() { this.items = []; }
  toArray() { return [...this.items]; }
}

// Event Emitter
export class EventEmitter {
  constructor() { this.events = {}; }
  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
}

// Wait for specified milliseconds
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create 2D array
export function create2DArray(rows, cols, defaultValue = 0) {
  return Array.from({ length: rows }, () => Array(cols).fill(defaultValue));
}

// Get element position relative to viewport
export function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}

// Check if point is inside rectangle
export function pointInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

export default { randomInt, randomArray, shuffleArray, deepClone, debounce, throttle, clamp, mapRange, lerp, distance, generateId, wait, PriorityQueue, Stack, EventEmitter };
