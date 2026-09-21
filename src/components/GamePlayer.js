import { appState } from '../services/state.js';
import { soundSynth } from '../services/soundEffects.js';
import { sandboxStorageService } from '../services/sandboxStorage.js';

export class GamePlayer {
  constructor(container, { onClose }) {
    this.container = container;
    this.callbacks = { onClose };
    this.currentGame = null;
    this.isOpen = false;
  }

  open(game) {
    this.currentGame = game;
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    this.currentGame = null;
    this.container.innerHTML = '';
    if (this.callbacks.onClose) {
      this.callbacks.onClose();
    }
  }

  render() {
    if (!this.isOpen || !this.currentGame) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = `
      <section class="player-section">
        <div class="player-toolbar">
          <div class="player-info">
            <span class="player-title">${this.escapeHtml(this.currentGame.title || 'Game')}</span>
          </div>
          <div class="player-actions">
            <button type="button" class="btn-action" id="toggle-pulse-game-btn" title="Toggle Pulse Chat">Chat</button>
            <button type="button" class="btn-action" id="reload-game-btn">Reload</button>
            <button type="button" class="btn-action" id="fullscreen-game-btn">Fullscreen</button>
            <button type="button" class="btn-action" id="open-blank-btn">Popout</button>
            <button type="button" class="btn-action btn-close" id="close-player-btn">Close</button>
          </div>
        </div>
        <div class="player-frame-container" id="player-frame-container">
          <iframe id="game-frame" class="game-frame" src="${this.escapeHtml(this.currentGame.url)}" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads" allow="fullscreen; autoplay; gamepad"></iframe>
        </div>
      </section>
    `;

    const frame = this.container.querySelector('#game-frame');
    if (frame && this.currentGame) {
      sandboxStorageService.injectIframeBridge(frame, this.currentGame.id || this.currentGame.title);
    }

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = this.container.querySelector('#close-player-btn');
    closeBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.close();
    });

    const chatBtn = this.container.querySelector('#toggle-pulse-game-btn');
    chatBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      appState.toggleMiniPulse();
    });

    const reloadBtn = this.container.querySelector('#reload-game-btn');
    reloadBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      const frame = this.container.querySelector('#game-frame');
      if (frame && this.currentGame) {
        frame.src = this.currentGame.url;
        sandboxStorageService.injectIframeBridge(frame, this.currentGame.id || this.currentGame.title);
      }
    });

    const fullscreenBtn = this.container.querySelector('#fullscreen-game-btn');
    fullscreenBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      const container = this.container.querySelector('#player-frame-container');
      if (!container) return;
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

    const openBlankBtn = this.container.querySelector('#open-blank-btn');
    openBlankBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      if (!this.currentGame || !this.currentGame.url) return;
      const win = window.open('about:blank', '_blank');
      if (win && !win.closed) {
        const doc = win.document;
        const frame = doc.createElement('iframe');
        frame.style.width = '100vw';
        frame.style.height = '100vh';
        frame.style.border = 'none';
        frame.style.position = 'fixed';
        frame.style.top = '0';
        frame.style.left = '0';
        frame.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads';
        frame.allow = 'fullscreen; autoplay; gamepad';
        frame.src = this.currentGame.url;
        doc.body.style.margin = '0';
        doc.body.style.height = '100vh';
        doc.body.style.overflow = 'hidden';
        doc.body.appendChild(frame);
        sandboxStorageService.injectIframeBridge(frame, this.currentGame.id || this.currentGame.title);
      }
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
