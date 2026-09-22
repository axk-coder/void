import { appState } from '../services/state.js';
import { soundSynth } from '../services/soundEffects.js';
import { sandboxStorageService } from '../services/sandboxStorage.js';

export class GamePlayer {
  constructor(container, { onClose }) {
    this.container = container;
    this.callbacks = { onClose };
    this.currentGame = null;
    this.isOpen = false;
    this.aspectMode = 'fit';
    this.keyHandler = this.handleKeyDown.bind(this);
  }

  open(game) {
    this.currentGame = game;
    this.isOpen = true;
    this.render();
    window.addEventListener('keydown', this.keyHandler);
  }

  close() {
    this.isOpen = false;
    this.currentGame = null;
    this.container.innerHTML = '';
    window.removeEventListener('keydown', this.keyHandler);
    if (this.callbacks.onClose) {
      this.callbacks.onClose();
    }
  }

  handleKeyDown(e) {
    if (!this.isOpen) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    
    if (e.key === 'Escape' && !document.fullscreenElement) {
      this.close();
    } else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey) {
      this.toggleFullscreen();
    } else if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
      this.reload();
    }
  }

  setAspectMode(mode) {
    this.aspectMode = mode;
    const frameContainer = this.container.querySelector('#player-frame-container');
    const aspectBtn = this.container.querySelector('#aspect-label-text');
    if (frameContainer) {
      frameContainer.classList.remove('aspect-fit', 'aspect-16-9', 'aspect-4-3', 'aspect-fill');
      frameContainer.classList.add(`aspect-${mode}`);
    }
    if (aspectBtn) {
      aspectBtn.textContent = mode.toUpperCase();
    }
  }

  toggleAspectMode() {
    const modes = ['fit', '16-9', '4-3', 'fill'];
    const nextIdx = (modes.indexOf(this.aspectMode) + 1) % modes.length;
    this.setAspectMode(modes[nextIdx]);
  }

  reload() {
    const frame = this.container.querySelector('#game-frame');
    if (frame && this.currentGame) {
      frame.src = this.currentGame.url;
      sandboxStorageService.injectIframeBridge(frame, this.currentGame.id || this.currentGame.title);
      frame.focus();
    }
  }

  toggleFullscreen() {
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
  }

  render() {
    if (!this.isOpen || !this.currentGame) {
      this.container.innerHTML = '';
      return;
    }

    const title = this.escapeHtml(this.currentGame.title || 'Game');
    const category = this.escapeHtml((this.currentGame.category || 'Game').toUpperCase());

    this.container.innerHTML = `
      <section class="player-section" id="player-main-section">
        <header class="player-toolbar">
          <div class="player-info-group">
            <button type="button" class="btn-player-back" id="back-to-catalog-btn" title="Back to Library (Esc)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="player-title-stack">
              <div class="player-title-row">
                <span class="player-title">${title}</span>
                <span class="player-badge-pill">${category}</span>
                <span class="player-status-tag">SANDBOXED</span>
              </div>
            </div>
          </div>

          <div class="player-actions">
            <button type="button" class="btn-player-action" id="toggle-pulse-game-btn" title="Toggle Pulse Chat ([ / ])">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Chat</span>
            </button>

            <button type="button" class="btn-player-action" id="aspect-game-btn" title="Toggle Aspect Ratio">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
              <span id="aspect-label-text">${this.aspectMode.toUpperCase()}</span>
            </button>

            <button type="button" class="btn-player-action" id="reload-game-btn" title="Reload Game (R)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>Reload</span>
            </button>

            <button type="button" class="btn-player-action" id="open-blank-btn" title="Open Cloaked in About:Blank">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Popout</span>
            </button>

            <button type="button" class="btn-player-action" id="fullscreen-game-btn" title="Toggle Fullscreen (F)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
              <span>Fullscreen</span>
            </button>

            <button type="button" class="btn-player-action btn-player-close" id="close-player-btn" title="Close (Esc)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Close</span>
            </button>
          </div>
        </header>

        <div class="player-stage">
          <div class="player-frame-container aspect-${this.aspectMode}" id="player-frame-container">
            <iframe id="game-frame" class="game-frame" src="${this.escapeHtml(this.currentGame.url)}" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads" allow="fullscreen; autoplay; gamepad"></iframe>
          </div>
        </div>

        <footer class="player-footer-bar">
          <div class="player-hints">
            <span class="player-hint-key">Esc</span>
            <span class="player-hint-desc">Exit</span>
            <span class="player-hint-sep">•</span>
            <span class="player-hint-key">F</span>
            <span class="player-hint-desc">Fullscreen</span>
            <span class="player-hint-sep">•</span>
            <span class="player-hint-key">R</span>
            <span class="player-hint-desc">Reload</span>
            <span class="player-hint-sep">•</span>
            <span class="player-hint-key">]</span>
            <span class="player-hint-desc">Pulse Chat</span>
          </div>
          <div class="player-footer-sync">
            <span class="sync-dot"></span>
            <span>Isolated Sandbox Storage Synchronized</span>
          </div>
        </footer>
      </section>
    `;

    const frame = this.container.querySelector('#game-frame');
    if (frame && this.currentGame) {
      sandboxStorageService.injectIframeBridge(frame, this.currentGame.id || this.currentGame.title);
      frame.addEventListener('load', () => {
        try {
          frame.focus();
        } catch (e) {}
      });
    }

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = this.container.querySelector('#close-player-btn');
    const backBtn = this.container.querySelector('#back-to-catalog-btn');
    
    closeBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.close();
    });

    backBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.close();
    });

    const chatBtn = this.container.querySelector('#toggle-pulse-game-btn');
    chatBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      appState.toggleMiniPulse();
    });

    const aspectBtn = this.container.querySelector('#aspect-game-btn');
    aspectBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.toggleAspectMode();
    });

    const reloadBtn = this.container.querySelector('#reload-game-btn');
    reloadBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.reload();
    });

    const fullscreenBtn = this.container.querySelector('#fullscreen-game-btn');
    fullscreenBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.toggleFullscreen();
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

