import { appState } from '../services/state.js';
import { playFabService } from '../services/playfab.js';
import { soundSynth } from '../services/soundEffects.js';

export const THEMES = [
  { key: 'onyx', name: 'Onyx', color: '#0a0a0a' },
  { key: 'amoled', name: 'AMOLED', color: '#000000' },
  { key: 'blurple', name: 'Blurple', color: '#5865f2' },
  { key: 'cyberpunk', name: 'Cyberpunk', color: '#00f0ff' },
  { key: 'emerald', name: 'Emerald', color: '#10b981' },
  { key: 'crimson', name: 'Crimson', color: '#f43f5e' },
  { key: 'sapphire', name: 'Sapphire', color: '#38bdf8' },
  { key: 'amethyst', name: 'Amethyst', color: '#a855f7' },
  { key: 'amber', name: 'Amber', color: '#f59e0b' },
  { key: 'slate', name: 'Slate', color: '#56616a' }
];

export const CLOAKS = {
  none: {
    title: 'void',
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%2318181b'/></svg>"
  },
  google: {
    title: 'Google',
    icon: 'https://www.google.com/favicon.ico'
  },
  docs: {
    title: 'Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  drive: {
    title: 'Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  classroom: {
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  canvas: {
    title: 'Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  }
};

export class SettingsModal {
  constructor(container, { onOpenLegal, onOpenCredits, onLogout }) {
    this.container = container;
    this.callbacks = { onOpenLegal, onOpenCredits, onLogout };
    this.isOpen = false;
    this.tab = 'appearance';
    this.render();
  }

  open(tab = 'appearance') {
    this.tab = tab;
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    this.container.innerHTML = '';
  }

  render() {
    if (!this.isOpen) {
      this.container.innerHTML = '';
      return;
    }

    const state = appState.getState();
    const user = playFabService.getCurrentUser();

    this.container.innerHTML = `
      <div class="modal-overlay" id="settings-modal-overlay">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">Settings</h3>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-subtle);">6.0</span>
            </div>
            <button class="modal-close-btn" id="settings-close-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="auth-tabs" style="margin-bottom: 16px;">
              <button type="button" class="auth-tab ${this.tab === 'appearance' ? 'active' : ''}" id="set-tab-appearance">
                Appearance
              </button>
              <button type="button" class="auth-tab ${this.tab === 'security' ? 'active' : ''}" id="set-tab-security">
                Cloak & Panic
              </button>
              <button type="button" class="auth-tab ${this.tab === 'account' ? 'active' : ''}" id="set-tab-account">
                Account
              </button>
            </div>

            ${this.tab === 'appearance' ? `
              <div class="settings-section">
                <div class="nav-section-title" style="padding-left: 0; margin-bottom: 10px;">Select Theme</div>
                <div class="theme-grid">
                  ${THEMES.map(t => `
                    <button type="button" class="theme-select-btn ${state.theme === t.key ? 'active' : ''}" data-theme-key="${t.key}">
                      <div class="theme-color-indicator" style="background: ${t.color};"></div>
                      <span>${t.name}</span>
                    </button>
                  `).join('')}
                </div>

                <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                  <div>
                    <div style="font-weight: 600; font-size: 13px;">Sound Effects</div>
                    <div style="font-size: 11px; color: var(--text-muted);">Audio feedback for button triggers</div>
                  </div>
                  <button type="button" class="btn-action" id="settings-sound-toggle">
                    ${soundSynth.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ` : this.tab === 'security' ? `
              <div class="settings-section" style="display: flex; flex-direction: column; gap: 14px;">
                <div class="form-group">
                  <label class="form-label" for="cloak-select-input">Tab Cloaking</label>
                  <select id="cloak-select-input" class="form-input">
                    <option value="none" ${state.cloak === 'none' ? 'selected' : ''}>Default (void)</option>
                    <option value="google" ${state.cloak === 'google' ? 'selected' : ''}>Google</option>
                    <option value="docs" ${state.cloak === 'docs' ? 'selected' : ''}>Google Docs</option>
                    <option value="drive" ${state.cloak === 'drive' ? 'selected' : ''}>Google Drive</option>
                    <option value="classroom" ${state.cloak === 'classroom' ? 'selected' : ''}>Google Classroom</option>
                    <option value="canvas" ${state.cloak === 'canvas' ? 'selected' : ''}>Canvas</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="panic-key-setting">Panic Key Trigger</label>
                  <input type="text" id="panic-key-setting" class="form-input" maxlength="1" value="${this.escapeHtml(state.panicKey || '`')}" placeholder="\`">
                </div>

                <div class="form-group">
                  <label class="form-label" for="panic-url-setting">Panic Redirect Destination</label>
                  <input type="url" id="panic-url-setting" class="form-input" value="${this.escapeHtml(state.panicUrl || 'https://google.com')}" placeholder="https://google.com">
                </div>

                <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 8px;">
                  <button type="button" class="form-btn-submit" id="save-panic-config-btn">Save Panic Settings</button>
                  <button type="button" class="btn-action" id="open-about-blank-launcher" style="padding: 10px; width: 100%; text-align: center;">Open in about:blank Frame</button>
                </div>
              </div>
            ` : `
              <div class="settings-section" style="display: flex; flex-direction: column; gap: 14px;">
                ${user ? `
                  <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                    <div class="avatar" style="width: 44px; height: 44px; font-size: 18px;">
                      ${user.avatarUrl ? `<img src="${this.escapeHtml(user.avatarUrl)}" class="avatar-img" alt="" />` : user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-weight: 700; font-size: 15px;">${this.escapeHtml(user.displayName)}</span>
                      <span style="font-size: 12px; color: var(--text-muted);">@${this.escapeHtml(user.username || user.displayName)}</span>
                      <span style="font-size: 11px; color: var(--text-secondary);">${this.escapeHtml(user.email || 'No email')}</span>
                    </div>
                  </div>

                  <button type="button" class="form-btn-submit" id="settings-logout-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-secondary);">
                    Sign Out
                  </button>
                ` : `
                  <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                    Not signed in
                  </div>
                `}
              </div>
            `}
          </div>

          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 8px;">
              <button type="button" class="footer-link-btn" id="set-open-priv">Privacy</button>
              <button type="button" class="footer-link-btn" id="set-open-terms">Terms</button>
              <button type="button" class="footer-link-btn" id="set-open-cred">Credits</button>
            </div>
            <button type="button" class="btn-action" id="settings-done-btn">Done</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = this.container.querySelector('#settings-modal-overlay');
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    const closeBtn = this.container.querySelector('#settings-close-btn');
    closeBtn?.addEventListener('click', () => this.close());

    const doneBtn = this.container.querySelector('#settings-done-btn');
    doneBtn?.addEventListener('click', () => this.close());

    const tabApp = this.container.querySelector('#set-tab-appearance');
    tabApp?.addEventListener('click', () => {
      this.tab = 'appearance';
      this.render();
    });

    const tabSec = this.container.querySelector('#set-tab-security');
    tabSec?.addEventListener('click', () => {
      this.tab = 'security';
      this.render();
    });

    const tabAcc = this.container.querySelector('#set-tab-account');
    tabAcc?.addEventListener('click', () => {
      this.tab = 'account';
      this.render();
    });

    const soundToggle = this.container.querySelector('#settings-sound-toggle');
    soundToggle?.addEventListener('click', () => {
      const enabled = soundSynth.toggleSound();
      if (soundToggle) soundToggle.textContent = enabled ? 'Enabled' : 'Disabled';
    });

    const themeBtns = this.container.querySelectorAll('.theme-select-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const themeKey = btn.getAttribute('data-theme-key');
        if (themeKey) {
          appState.setTheme(themeKey);
          this.render();
        }
      });
    });

    const cloakSelect = this.container.querySelector('#cloak-select-input');
    cloakSelect?.addEventListener('change', (e) => {
      const selected = e.target.value;
      appState.setCloak(selected);
      const profile = CLOAKS[selected] || CLOAKS.none;
      document.title = profile.title;
      let link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = profile.icon;
      }
    });

    const savePanicBtn = this.container.querySelector('#save-panic-config-btn');
    savePanicBtn?.addEventListener('click', () => {
      const keyInput = this.container.querySelector('#panic-key-setting');
      const urlInput = this.container.querySelector('#panic-url-setting');
      const k = keyInput && keyInput.value ? keyInput.value.trim().charAt(0) : '`';
      let u = urlInput && urlInput.value ? urlInput.value.trim() : 'https://google.com';
      if (!u.startsWith('http://') && !u.startsWith('https://')) {
        u = 'https://' + u;
      }
      appState.setPanicSettings(k, u);
      localStorage.setItem('void_panic_key', k);
      localStorage.setItem('void_panic_url', u);
      this.close();
    });

    const blankLauncher = this.container.querySelector('#open-about-blank-launcher');
    blankLauncher?.addEventListener('click', () => {
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
        frame.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
        frame.allow = 'fullscreen; autoplay; gamepad';
        frame.src = window.location.href;
        doc.body.style.margin = '0';
        doc.body.style.height = '100vh';
        doc.body.style.overflow = 'hidden';
        doc.body.appendChild(frame);
      }
    });

    const privBtn = this.container.querySelector('#set-open-priv');
    privBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenLegal) this.callbacks.onOpenLegal('privacy');
    });

    const termsBtn = this.container.querySelector('#set-open-terms');
    termsBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenLegal) this.callbacks.onOpenLegal('terms');
    });

    const credBtn = this.container.querySelector('#set-open-cred');
    credBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenCredits) this.callbacks.onOpenCredits();
    });

    const logoutBtn = this.container.querySelector('#settings-logout-btn');
    logoutBtn?.addEventListener('click', () => {
      playFabService.clearSession();
      this.close();
      if (this.callbacks.onLogout) this.callbacks.onLogout();
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
