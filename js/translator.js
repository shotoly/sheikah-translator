/**
 * TRANSLATOR MODULE
 * Handles real-time text normalization and DOM rendering of Sheikah runes.
 */

import { SHEIKAH_DICT, getSheikahGlyph } from './sheikah-data.js';

export class SheikahTranslator {
  constructor(options = {}) {
    this.options = {
      glyphSize: options.glyphSize || 52,
      glyphGap: options.glyphGap || 8,
      wordGap: options.wordGap || 24,
      lineGap: options.lineGap || 16,
      color: options.color || '#00f0ff',
      spaceMode: options.spaceMode || 'glyph', // 'glyph' or 'blank'
      showHints: options.showHints || false,
      glowEffect: options.glowEffect !== false,
      ...options
    };
  }

  /**
   * Updates translator configuration.
   * @param {object} newOptions 
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Normalizes input text: decomposes accents, handles casing.
   * @param {string} text 
   * @returns {string}
   */
  normalizeText(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .toLowerCase();
  }

  /**
   * Parses text into lines, words, and characters.
   * Preserves linebreaks and word structures for clean wrapping.
   * @param {string} rawText 
   * @returns {Array<Array<object>>} Array of lines, each line containing words or tokens
   */
  parseText(rawText) {
    if (!rawText) return [];
    
    const lines = rawText.split('\n');
    return lines.map((line) => {
      // Split line into words while keeping track of spaces
      const words = [];
      let currentWord = [];

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === ' ') {
          if (currentWord.length > 0) {
            words.push({ type: 'word', chars: currentWord });
            currentWord = [];
          }
          words.push({ type: 'space', char: ' ' });
        } else {
          currentWord.push(char);
        }
      }
      if (currentWord.length > 0) {
        words.push({ type: 'word', chars: currentWord });
      }
      return words;
    });
  }

  /**
   * Generates inline SVG HTML string for a specific character.
   * @param {string} char 
   * @returns {string} SVG markup
   */
  renderGlyphSvg(char) {
    const glyph = getSheikahGlyph(char);
    const size = this.options.glyphSize;
    const color = this.options.color;

    if (!glyph) {
      // Fallback for unknown characters (e.g. punctuation not in set)
      return `
        <svg class="sheikah-glyph sheikah-glyph-unknown" 
             viewBox="0 0 100 100" 
             width="${size}" 
             height="${size}"
             style="--glyph-color: ${color}">
          <rect x="15" y="15" width="70" height="70" rx="8" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="6,4" opacity="0.6"/>
          <text x="50" y="62" font-family="'Courier New', monospace" font-size="34" font-weight="bold" fill="${color}" text-anchor="middle" opacity="0.85">${char}</text>
        </svg>
      `;
    }

    const pathsHtml = glyph.paths
      .map(p => `<path d="${p.d}" fill="${color}" />`)
      .join('');

    return `
      <svg class="sheikah-glyph" 
           viewBox="${glyph.viewBox}" 
           width="${size}" 
           height="${size}"
           data-char="${char.toLowerCase()}"
           style="--glyph-color: ${color}">
        ${pathsHtml}
      </svg>
    `;
  }

  /**
   * Renders the complete translation into a target DOM container.
   * @param {string} text 
   * @param {HTMLElement} container 
   */
  renderToDom(text, container) {
    if (!container) return;

    if (!text || text.trim() === '') {
      container.innerHTML = `
        <div class="sheikah-empty-state">
          <div class="sheikah-eye-icon pulse-animation">
            <svg viewBox="0 0 100 100" width="64" height="64">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="3" opacity="0.4"/>
              <ellipse cx="50" cy="50" rx="30" ry="18" fill="none" stroke="currentColor" stroke-width="4"/>
              <circle cx="50" cy="50" r="8" fill="currentColor"/>
              <path d="M50 15 L50 28 M50 72 L50 85 M15 50 L28 50 M72 50 L85 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              <path d="M50 50 L50 92" stroke="currentColor" stroke-width="3" stroke-dasharray="3,3"/>
              <circle cx="50" cy="94" r="3" fill="currentColor"/>
            </svg>
          </div>
          <p class="sheikah-prompt-text">ENTREZ DU TEXTE POUR TRADUIRE EN ÉCRITURE SHEIKAH</p>
          <span class="sheikah-sub-prompt">MODULE DE DÉCODAGE ACTIF // EN ATTENTE DE SIGNAL</span>
        </div>
      `;
      return;
    }

    const parsedLines = this.parseText(text);
    const { glyphSize, glyphGap, wordGap, lineGap, spaceMode, showHints, color, glowEffect } = this.options;

    const linesWrapper = document.createElement('div');
    linesWrapper.className = `sheikah-lines-container ${glowEffect ? 'has-glow' : ''}`;
    linesWrapper.style.setProperty('--sheikah-color', color);
    linesWrapper.style.gap = `${lineGap}px`;

    parsedLines.forEach((lineTokens, lineIndex) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'sheikah-line';
      lineEl.style.gap = `${glyphGap}px`;

      lineTokens.forEach(token => {
        if (token.type === 'space') {
          if (spaceMode === 'glyph') {
            const spaceGlyph = document.createElement('div');
            spaceGlyph.className = 'sheikah-char-wrapper space-glyph';
            spaceGlyph.innerHTML = this.renderGlyphSvg(' ');
            if (showHints) {
              const hint = document.createElement('span');
              hint.className = 'glyph-hint space-hint';
              hint.textContent = '␣';
              spaceGlyph.appendChild(hint);
            }
            lineEl.appendChild(spaceGlyph);
          } else {
            const spaceGap = document.createElement('div');
            spaceGap.className = 'sheikah-space-gap';
            spaceGap.style.width = `${wordGap}px`;
            spaceGap.style.height = `${glyphSize}px`;
            lineEl.appendChild(spaceGap);
          }
        } else if (token.type === 'word') {
          const wordEl = document.createElement('div');
          wordEl.className = 'sheikah-word';
          wordEl.style.gap = `${glyphGap}px`;

          token.chars.forEach(char => {
            const charWrapper = document.createElement('div');
            charWrapper.className = 'sheikah-char-wrapper';
            charWrapper.title = `Caractère: "${char}"`;
            charWrapper.innerHTML = this.renderGlyphSvg(char);

            if (showHints) {
              const hint = document.createElement('span');
              hint.className = 'glyph-hint';
              hint.textContent = char.toUpperCase();
              charWrapper.appendChild(hint);
            }

            wordEl.appendChild(charWrapper);
          });

          lineEl.appendChild(wordEl);
        }
      });

      linesWrapper.appendChild(lineEl);
    });

    container.innerHTML = '';
    container.appendChild(linesWrapper);
  }
}
