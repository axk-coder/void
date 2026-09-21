import './styles/main.css';
import { appState } from './services/state.js';
import { playFabService } from './services/playfab.js';
import { soundSynth } from './services/soundEffects.js';
import { AuthModal } from './components/AuthModal.js';
import { SettingsModal, CLOAKS } from './components/SettingsModal.js';
import { LegalModal } from './components/LegalModal.js';
import { CreditsModal } from './components/CreditsModal.js';
import { GamePlayer } from './components/GamePlayer.js';

const games = [
  { id: '2048', title: '2048', category: 'puzzle', url: './games/2048/index.html' },
  { id: 'snake', title: 'Snake', category: 'arcade', url: './games/snake/index.html' },
  { id: 'tetris', title: 'Tetris', category: 'puzzle', url: './games/tetris/index.html' },
  { id: 'flappy', title: 'Flappy Bird', category: 'arcade', url: './games/flappy/index.html' },
  { id: 'pong', title: 'Pong', category: 'multiplayer', url: './games/pong/index.html' },
  { id: 'breakout', title: 'Breakout', category: 'arcade', url: './games/breakout/index.html' },
  { id: 'space-invaders', title: 'Space Invaders', category: 'action', url: './games/space-invaders/index.html' },
  { id: 'minesweeper', title: 'Minesweeper', category: 'puzzle', url: './games/minesweeper/index.html' },
  { id: 'asteroids', title: 'Asteroids', category: 'action', url: './games/asteroids/index.html' },
  { id: 'tictactoe', title: 'Tic Tac Toe', category: 'multiplayer', url: './games/tictactoe/index.html' }
];

const CATEGORIES = [
  { id: 'all', name: 'All Games' },
  { id: 'action', name: 'Action' },
  { id: 'arcade', name: 'Arcade' },
  { id: 'puzzle', name: 'Puzzle' },
  { id: 'multiplayer', name: 'Multiplayer' },
  { id: 'favorites', name: 'Favorites' }
];

class VoidApp {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.authModal = null;
    this.settingsModal = null;
    this.legalModal = null;
    this.creditsModal = null;
    this.gamePlayer = null;

    this.init();
  }

  async init() {
    const savedTheme = localStorage.getItem('pulse_theme') || 'onyx';
    appState.setTheme(savedTheme);

    const savedPanicKey = localStorage.getItem('void_panic_key') || '`';
    const savedPanicUrl = localStorage.getItem('void_panic_url') || 'https://google.com';
    appState.setPanicSettings(savedPanicKey, savedPanicUrl);

    this.setupPanicListener();
    this.setupSharedCookieBridge();

    this.renderShell();
    this.initModals();

    const loggedIn = await playFabService.tryAutoLogin();
    if (!loggedIn && !playFabService.isAuthenticated()) {
      this.authModal.open('login');
    } else {
      this.updateUserProfilePanel();
    }

    this.renderCatalog();
    this.attachGlobalEvents();

    appState.subscribe((state, key) => {
      if (key === 'user') {
        this.updateUserProfilePanel();
      }
      if (key === 'category' || key === 'search' || key === 'sort') {
        this.renderCatalog();
      }
    });
  }

  setupSharedCookieBridge() {
    window.addEventListener('message', (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'PULSE_AUTH_SYNC') {
        const { sessionTicket, playFabId, userProfile } = e.data;
        if (sessionTicket && userProfile) {
          playFabService.saveSession(sessionTicket, playFabId, userProfile);
          if (this.authModal && this.authModal.isOpen) {
            this.authModal.close();
          }
          this.updateUserProfilePanel();
        }
      }
    });
  }

  setupPanicListener() {
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      const state = appState.getState();
      if (e.key === state.panicKey) {
        e.preventDefault();
        window.location.replace(state.panicUrl || 'https://google.com');
      }
    });
  }

  renderShell() {
    this.appRoot.innerHTML = `
      <div class="void-layout">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="brand-wrapper">
              <div class="brand-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
                  <circle cx="12" cy="12" r="9"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h1 class="brand-title">void</h1>
            </div>
            <button type="button" class="icon-btn" id="sidebar-settings-btn" title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          <div class="sidebar-content">
            <div class="nav-section-title">Library</div>
            <ul class="category-list" id="category-nav-list">
              ${CATEGORIES.map(cat => `
                <li class="category-nav-item ${cat.id === 'all' ? 'active' : ''}" data-cat-id="${cat.id}">
                  <span>${cat.name}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="sidebar-footer">
            <div class="sidebar-footer-user">
              <button type="button" class="user-profile-btn" id="sidebar-user-panel-btn">
                <div class="avatar-wrapper">
                  <div class="avatar" id="footer-user-avatar">?</div>
                  <div class="presence-badge-dot dot-online" id="footer-presence-dot"></div>
                </div>
                <div class="user-info-text">
                  <span class="user-display-name" id="footer-user-name">Guest</span>
                  <span class="user-status-text" id="footer-user-status">VOID</span>
                </div>
              </button>

              <button type="button" class="icon-btn" id="sidebar-sound-btn" title="Toggle Sound">
                <svg id="sound-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  ${soundSynth.enabled
                    ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>'
                    : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>'
                  }
                </svg>
              </button>
            </div>

            <div class="sidebar-footer-links">
              <button type="button" class="footer-link-btn" id="footer-keys-btn">Keys</button>
              <span class="footer-dot">•</span>
              <button type="button" class="footer-link-btn" id="footer-privacy-btn">Privacy</button>
              <span class="footer-dot">•</span>
              <button type="button" class="footer-link-btn" id="footer-terms-btn">Terms</button>
              <span class="footer-dot">•</span>
              <button type="button" class="footer-link-btn" id="footer-credits-btn">Credits</button>
              <span class="footer-version-tag">1</span>
            </div>
          </div>
        </aside>

        <main class="main-viewport">
          <header class="top-navbar">
            <div class="search-input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="top-search-input" class="search-field" placeholder="Search catalog..." autocomplete="off" spellcheck="false">
            </div>

            <div class="top-navbar-actions">
              <a href="https://github.com/axk-coder/void" target="_blank" rel="noopener noreferrer" class="btn-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </header>

          <div class="content-scrollable" id="main-content-scrollable">
            <div id="game-player-host"></div>
            <section class="catalog-section" id="catalog-host">
              <div class="games-grid" id="games-grid">
                <div class="empty-state" id="empty-state">
                  <div class="empty-box">
                    <div class="empty-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <h2 class="empty-title">No Games Installed</h2>
                    <p class="empty-description">The unblocked platform shell is loaded. When games are added, they will appear here ready to launch.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <div id="modal-container-auth"></div>
      <div id="modal-container-settings"></div>
      <div id="modal-container-legal"></div>
      <div id="modal-container-credits"></div>
    `;
  }

  initModals() {
    const authHost = document.getElementById('modal-container-auth');
    const settingsHost = document.getElementById('modal-container-settings');
    const legalHost = document.getElementById('modal-container-legal');
    const creditsHost = document.getElementById('modal-container-credits');
    const playerHost = document.getElementById('game-player-host');

    this.legalModal = new LegalModal(legalHost);
    this.creditsModal = new CreditsModal(creditsHost);

    this.settingsModal = new SettingsModal(settingsHost, {
      onOpenLegal: (tab) => this.legalModal.open(tab),
      onOpenCredits: () => this.creditsModal.open(),
      onLogout: () => {
        this.updateUserProfilePanel();
        this.authModal.open('login');
      }
    });

    this.authModal = new AuthModal(authHost, {
      onAuthSuccess: () => {
        this.updateUserProfilePanel();
      },
      onOpenLegal: (tab) => this.legalModal.open(tab),
      onOpenCredits: () => this.creditsModal.open()
    });

    this.gamePlayer = new GamePlayer(playerHost, {
      onClose: () => {
        const catalog = document.getElementById('catalog-host');
        if (catalog) catalog.style.display = 'block';
      }
    });
  }

  updateUserProfilePanel() {
    const user = playFabService.getCurrentUser();
    const nameEl = document.getElementById('footer-user-name');
    const statusEl = document.getElementById('footer-user-status');
    const avatarEl = document.getElementById('footer-user-avatar');
    const dotEl = document.getElementById('footer-presence-dot');

    if (!user) {
      if (nameEl) nameEl.textContent = 'Guest';
      if (statusEl) statusEl.textContent = 'Click to Sign In';
      if (avatarEl) avatarEl.textContent = '?';
      if (dotEl) dotEl.className = 'presence-badge-dot dot-offline';
      return;
    }

    if (nameEl) nameEl.textContent = user.displayName || user.username || 'User';
    if (statusEl) statusEl.textContent = user.statusMessage || 'VOID';
    if (dotEl) {
      dotEl.className = `presence-badge-dot dot-${user.presence || 'online'}`;
    }
    if (avatarEl) {
      if (user.avatarUrl) {
        avatarEl.innerHTML = `<img src="${this.escapeHtml(user.avatarUrl)}" class="avatar-img" alt="" />`;
      } else {
        avatarEl.textContent = (user.displayName || user.username || 'U').charAt(0).toUpperCase();
      }
    }
  }

  renderCatalog() {
    const grid = document.getElementById('games-grid');
    const emptyState = document.getElementById('empty-state');
    if (!grid || !emptyState) return;

    const state = appState.getState();
    const query = (state.searchQuery || '').trim().toLowerCase();
    const category = state.activeCategory || 'all';

    let filtered = games.filter(g => {
      const matchesSearch = !query || (g.title && g.title.toLowerCase().includes(query));
      const matchesCategory = category === 'all' || (g.category && g.category.toLowerCase() === category);
      return matchesSearch && matchesCategory;
    });

    const cards = grid.querySelectorAll('.game-card');
    cards.forEach(c => c.remove());

    if (filtered.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.tabIndex = 0;

      const thumb = document.createElement('div');
      thumb.className = 'game-card-thumb';
      thumb.innerHTML = `<span style="font-size: 13px; font-weight: 800; letter-spacing: 1px; color: var(--text-muted); text-transform: uppercase; font-family: var(--font-mono);">${this.escapeHtml(game.title)}</span>`;

      const body = document.createElement('div');
      body.className = 'game-card-body';

      const title = document.createElement('div');
      title.className = 'game-card-title';
      title.textContent = game.title || 'Untitled';

      const cat = document.createElement('div');
      cat.className = 'game-card-category';
      cat.textContent = game.category || 'General';

      body.appendChild(title);
      body.appendChild(cat);
      card.appendChild(thumb);
      card.appendChild(body);

      card.addEventListener('click', () => {
        const catalog = document.getElementById('catalog-host');
        if (catalog) catalog.style.display = 'none';
        this.gamePlayer.open(game);
      });

      grid.appendChild(card);
    });
  }

  attachGlobalEvents() {
    const searchInput = document.getElementById('top-search-input');
    searchInput?.addEventListener('input', (e) => {
      appState.setSearchQuery(e.target.value);
    });

    const categoryItems = document.querySelectorAll('.category-nav-item');
    categoryItems.forEach(item => {
      item.addEventListener('click', () => {
        categoryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const catId = item.getAttribute('data-cat-id') || 'all';
        appState.setActiveCategory(catId);
      });
    });

    const settingsBtn = document.getElementById('sidebar-settings-btn');
    settingsBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.settingsModal.open('appearance');
    });

    const userPanelBtn = document.getElementById('sidebar-user-panel-btn');
    userPanelBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      if (!playFabService.isAuthenticated()) {
        this.authModal.open('login');
      } else {
        this.settingsModal.open('account');
      }
    });

    const soundBtn = document.getElementById('sidebar-sound-btn');
    soundBtn?.addEventListener('click', () => {
      const isEnabled = soundSynth.toggleSound();
      const soundSvg = document.getElementById('sound-icon-svg');
      if (soundSvg) {
        soundSvg.innerHTML = isEnabled
          ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>'
          : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      }
    });

    const keysBtn = document.getElementById('footer-keys-btn');
    keysBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.settingsModal.open('security');
    });

    const privBtn = document.getElementById('footer-privacy-btn');
    privBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.legalModal.open('privacy');
    });

    const termsBtn = document.getElementById('footer-terms-btn');
    termsBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.legalModal.open('terms');
    });

    const creditsBtn = document.getElementById('footer-credits-btn');
    creditsBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.creditsModal.open();
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VoidApp();
});
