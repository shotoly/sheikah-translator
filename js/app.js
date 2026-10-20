/**
 * APP CONTROLLER
 * Main entrypoint coordinating UI, Translator, Exporter, and Audio.
 */

import { SHEIKAH_DICT, getSupportedChars } from './sheikah-data.js';
import { SheikahTranslator } from './translator.js';
import { SheikahExporter } from './exporter.js';
import { SheikahAudio } from './audio.js';

class SheikahApp {
  constructor() {
    this.audio = new SheikahAudio();
    this.translator = new SheikahTranslator();
    this.exporter = new SheikahExporter();

    this.state = {
      text: 'ZELDA',
      glyphSize: 52,
      glyphGap: 8,
      wordGap: 24,
      lineGap: 16,
      color: '#00f0ff',
      backgroundColor: '#091118',
      spaceMode: 'glyph', // 'glyph' or 'blank'
      showHints: false,
      includeFrame: false,
      glowEffect: true,
      soundEnabled: true
    };

    this.dom = {};
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.buildCodex();
    this.syncStateToUi();
    this.updateTranslation();
  }

  cacheDom() {
    this.dom = {
      textInput: document.getElementById('text-input'),
      charCount: document.getElementById('char-count'),
      wordCount: document.getElementById('word-count'),
      clearBtn: document.getElementById('clear-btn'),
      sampleButtons: document.querySelectorAll('.sample-btn'),
      
      outputContainer: document.getElementById('sheikah-output'),
      outputViewport: document.getElementById('output-viewport'),
      
      // Controls
      glyphSizeSlider: document.getElementById('glyph-size-slider'),
      glyphSizeVal: document.getElementById('glyph-size-val'),
      glyphGapSlider: document.getElementById('glyph-gap-slider'),
      glyphGapVal: document.getElementById('glyph-gap-val'),
      lineGapSlider: document.getElementById('line-gap-slider'),
      lineGapVal: document.getElementById('line-gap-val'),
      
      // Color Presets
      colorPresets: document.querySelectorAll('.color-preset-btn'),
      customColorPicker: document.getElementById('custom-color-picker'),
      
      // Background Presets
      bgPresets: document.querySelectorAll('.bg-preset-btn'),
      customBgPicker: document.getElementById('custom-bg-picker'),
      
      // Toggles
      spaceModeToggle: document.getElementById('space-mode-toggle'),
      hintsToggle: document.getElementById('hints-toggle'),
      glowToggle: document.getElementById('glow-toggle'),
      frameToggle: document.getElementById('frame-toggle'),
      soundToggle: document.getElementById('sound-toggle'),
      
      // Action Buttons
      exportSvgBtn: document.getElementById('export-svg-btn'),
      copySvgBtn: document.getElementById('copy-svg-btn'),
      exportPngBtn: document.getElementById('export-png-btn'),
      
      // Codex
      codexGrid: document.getElementById('codex-grid'),
      
      // Toast notification
      toast: document.getElementById('sheikah-toast')
    };
  }

  bindEvents() {
    // Real-time Text Input
    this.dom.textInput.addEventListener('input', (e) => {
      this.state.text = e.target.value;
      this.audio.playTypeSound();
      this.updateTranslation();
    });

    // Clear Button
    this.dom.clearBtn.addEventListener('click', () => {
      this.dom.textInput.value = '';
      this.state.text = '';
      this.dom.textInput.focus();
      this.audio.playClickSound();
      this.updateTranslation();
    });

    // Preset Samples
    this.dom.sampleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sample = btn.getAttribute('data-sample') || btn.textContent.trim();
        this.dom.textInput.value = sample;
        this.state.text = sample;
        this.audio.playActivationSound();
        this.updateTranslation();
      });
    });

    // Sliders
    this.dom.glyphSizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.state.glyphSize = val;
      this.dom.glyphSizeVal.textContent = `${val}px`;
      this.updateTranslation();
    });

    this.dom.glyphGapSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.state.glyphGap = val;
      this.dom.glyphGapVal.textContent = `${val}px`;
      this.updateTranslation();
    });

    this.dom.lineGapSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.state.lineGap = val;
      this.dom.lineGapVal.textContent = `${val}px`;
      this.updateTranslation();
    });

    // Color Presets
    this.dom.colorPresets.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        this.dom.colorPresets.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.color = color;
        this.dom.customColorPicker.value = color;
        this.audio.playClickSound();
        this.updateTranslation();
      });
    });

    this.dom.customColorPicker.addEventListener('input', (e) => {
      this.state.color = e.target.value;
      this.dom.colorPresets.forEach(b => b.classList.remove('active'));
      this.updateTranslation();
    });

    // Background Presets
    this.dom.bgPresets.forEach(btn => {
      btn.addEventListener('click', () => {
        const bg = btn.getAttribute('data-bg');
        this.dom.bgPresets.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.backgroundColor = bg;
        if (bg !== 'transparent') {
          this.dom.customBgPicker.value = bg;
        }
        this.audio.playClickSound();
        this.updateTranslation();
      });
    });

    this.dom.customBgPicker.addEventListener('input', (e) => {
      this.state.backgroundColor = e.target.value;
      this.dom.bgPresets.forEach(b => b.classList.remove('active'));
      this.updateTranslation();
    });

    // Toggles
    this.dom.spaceModeToggle.addEventListener('change', (e) => {
      this.state.spaceMode = e.target.checked ? 'glyph' : 'blank';
      this.audio.playClickSound();
      this.updateTranslation();
    });

    this.dom.hintsToggle.addEventListener('change', (e) => {
      this.state.showHints = e.target.checked;
      this.audio.playClickSound();
      this.updateTranslation();
    });

    this.dom.glowToggle.addEventListener('change', (e) => {
      this.state.glowEffect = e.target.checked;
      this.audio.playClickSound();
      this.updateTranslation();
    });

    if (this.dom.frameToggle) {
      this.dom.frameToggle.addEventListener('change', (e) => {
        this.state.includeFrame = e.target.checked;
        this.audio.playClickSound();
      });
    }

    this.dom.soundToggle.addEventListener('click', () => {
      const isEnabled = this.audio.toggle();
      this.state.soundEnabled = isEnabled;
      this.dom.soundToggle.classList.toggle('muted', !isEnabled);
      this.dom.soundToggle.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
      this.showToast(isEnabled ? 'SONORE ACTIVÉ' : 'SONORE DÉSACTIVÉ');
    });

    // Export SVG
    this.dom.exportSvgBtn.addEventListener('click', () => {
      this.handleExportSvg();
    });

    // Copy SVG Code
    this.dom.copySvgBtn.addEventListener('click', () => {
      this.handleCopySvg();
    });

    // Export PNG
    this.dom.exportPngBtn.addEventListener('click', () => {
      this.handleExportPng();
    });
  }

  syncStateToUi() {
    this.dom.textInput.value = this.state.text;
    this.dom.glyphSizeSlider.value = this.state.glyphSize;
    this.dom.glyphSizeVal.textContent = `${this.state.glyphSize}px`;
    this.dom.glyphGapSlider.value = this.state.glyphGap;
    this.dom.glyphGapVal.textContent = `${this.state.glyphGap}px`;
    this.dom.lineGapSlider.value = this.state.lineGap;
    this.dom.lineGapVal.textContent = `${this.state.lineGap}px`;
    
    this.dom.spaceModeToggle.checked = (this.state.spaceMode === 'glyph');
    this.dom.hintsToggle.checked = this.state.showHints;
    this.dom.glowToggle.checked = this.state.glowEffect;
    if (this.dom.frameToggle) {
      this.dom.frameToggle.checked = this.state.includeFrame;
    }
  }

  updateTranslation() {
    const text = this.state.text;
    
    // Counters
    const length = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    this.dom.charCount.textContent = length;
    this.dom.wordCount.textContent = words;

    // Viewport background
    if (this.state.backgroundColor === 'transparent') {
      this.dom.outputViewport.style.background = 'repeating-conic-gradient(#0e1720 0% 25%, #081017 0% 50%) 50% / 20px 20px';
    } else {
      this.dom.outputViewport.style.background = this.state.backgroundColor;
    }

    // Update translator configuration
    this.translator.updateOptions({
      glyphSize: this.state.glyphSize,
      glyphGap: this.state.glyphGap,
      wordGap: this.state.wordGap,
      lineGap: this.state.lineGap,
      color: this.state.color,
      spaceMode: this.state.spaceMode,
      showHints: this.state.showHints,
      glowEffect: this.state.glowEffect
    });

    // Render runes to DOM
    this.translator.renderToDom(text, this.dom.outputContainer);

    // Apply CSS custom variable for theme color
    document.documentElement.style.setProperty('--sheikah-neon', this.state.color);
  }

  handleExportSvg() {
    this.audio.playActivationSound();
    const svgCode = this.exporter.generateSvg(this.state.text, {
      glyphSize: this.state.glyphSize,
      glyphGap: this.state.glyphGap,
      wordGap: this.state.wordGap,
      lineGap: this.state.lineGap,
      color: this.state.color,
      backgroundColor: this.state.backgroundColor,
      spaceMode: this.state.spaceMode,
      includeFrame: this.state.includeFrame,
      title: `Sheikah - ${this.state.text.slice(0, 20)}`
    });

    const slug = (this.state.text.trim().slice(0, 15).toLowerCase().replace(/[^a-z0-9]/g, '-') || 'traduction');
    const filename = `sheikah-${slug}.svg`;

    this.exporter.downloadSvg(svgCode, filename);
    this.showToast(`FICHIER .SVG TÉLÉCHARGÉ (${filename})`);
  }

  async handleCopySvg() {
    this.audio.playActivationSound();
    const svgCode = this.exporter.generateSvg(this.state.text, {
      glyphSize: this.state.glyphSize,
      glyphGap: this.state.glyphGap,
      wordGap: this.state.wordGap,
      lineGap: this.state.lineGap,
      color: this.state.color,
      backgroundColor: this.state.backgroundColor,
      spaceMode: this.state.spaceMode,
      includeFrame: this.state.includeFrame,
      title: `Sheikah - ${this.state.text.slice(0, 20)}`
    });

    try {
      await this.exporter.copyToClipboard(svgCode);
      this.showToast('CODE SVG COPIÉ DANS LE PRESSE-PAPIER !');
    } catch (e) {
      this.showToast('ERREUR LORS DE LA COPIE');
    }
  }

  async handleExportPng() {
    this.audio.playActivationSound();
    const svgCode = this.exporter.generateSvg(this.state.text, {
      glyphSize: this.state.glyphSize,
      glyphGap: this.state.glyphGap,
      wordGap: this.state.wordGap,
      lineGap: this.state.lineGap,
      color: this.state.color,
      backgroundColor: this.state.backgroundColor,
      spaceMode: this.state.spaceMode,
      includeFrame: this.state.includeFrame
    });

    const slug = (this.state.text.trim().slice(0, 15).toLowerCase().replace(/[^a-z0-9]/g, '-') || 'traduction');
    const filename = `sheikah-${slug}.png`;

    try {
      await this.exporter.downloadPng(svgCode, filename, 2);
      this.showToast(`IMAGE PNG TÉLÉCHARGÉE (${filename})`);
    } catch (e) {
      this.showToast('ERREUR LORS DU RENDU PNG');
    }
  }

  buildCodex() {
    if (!this.dom.codexGrid) return;
    const chars = getSupportedChars();

    // Group order: letters first (a-z), digits (0-9), punctuation (!, ?, .), space
    const letters = chars.filter(c => c >= 'a' && c <= 'z');
    const digits = chars.filter(c => c >= '0' && c <= '9');
    const specials = ['!', '?', '.', ' '];

    const sortedChars = [...letters, ...digits, ...specials];

    this.dom.codexGrid.innerHTML = '';

    sortedChars.forEach(char => {
      const glyph = SHEIKAH_DICT[char];
      if (!glyph) return;

      const item = document.createElement('button');
      item.className = 'codex-item';
      item.type = 'button';
      item.title = `Cliquer pour insérer "${char === ' ' ? 'ESPACE' : char.toUpperCase()}"`;

      const pathsXml = glyph.paths
        .map(p => `<path d="${p.d}" fill="currentColor" />`)
        .join('');

      const label = char === ' ' ? 'SPACE' : char.toUpperCase();

      item.innerHTML = `
        <svg viewBox="${glyph.viewBox}" class="codex-glyph">
          ${pathsXml}
        </svg>
        <span class="codex-label">${label}</span>
      `;

      item.addEventListener('click', () => {
        this.dom.textInput.value += char;
        this.state.text = this.dom.textInput.value;
        this.audio.playTypeSound();
        this.updateTranslation();
        this.dom.textInput.focus();
      });

      this.dom.codexGrid.appendChild(item);
    });
  }

  showToast(message) {
    if (!this.dom.toast) return;
    this.dom.toast.textContent = message;
    this.dom.toast.classList.add('visible');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('visible');
    }, 2800);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new SheikahApp();
  app.init();
  window.sheikahApp = app;
});
