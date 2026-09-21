import { appState } from '../services/state.js';
import { playFabService } from '../services/playfab.js';
import { soundSynth } from '../services/soundEffects.js';

export const THEMES = [
  { key: 'onyx', name: 'Dark', preview: '#121212', accent: '#f5f5f5', border: '#262626' },
  { key: 'amoled', name: 'Black', preview: '#000000', accent: '#ffffff', border: '#282828' },
  { key: 'blurple', name: 'Blurple', preview: '#1e2030', accent: '#5865f2', border: '#444a6e' },
  { key: 'cyberpunk', name: 'Cyan', preview: '#131024', accent: '#00f0ff', border: '#4a3c8a' },
  { key: 'emerald', name: 'Green', preview: '#0d1c16', accent: '#10b981', border: '#2a5544' },
  { key: 'crimson', name: 'Red', preview: '#1a0d12', accent: '#f43f5e', border: '#522939' },
  { key: 'sapphire', name: 'Blue', preview: '#0e192c', accent: '#38bdf8', border: '#2a4c7e' },
  { key: 'amethyst', name: 'Purple', preview: '#171026', accent: '#a855f7', border: '#473377' },
  { key: 'amber', name: 'Amber', preview: '#1c150c', accent: '#f59e0b', border: '#574226' },
  { key: 'slate', name: 'Slate', preview: '#15181a', accent: '#f8f9fa', border: '#3c444b' }
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
  constructor(container, { onOpenLegal, onOpenCredits, onLogout, onProfileUpdated }) {
    this.container = container;
    this.callbacks = { onOpenLegal, onOpenCredits, onLogout, onProfileUpdated };
    this.isOpen = false;
    this.tab = 'preferences';
    this.isLoading = false;
    this.error = null;
    this.message = null;
    this.currentTheme = localStorage.getItem('pulse_theme') || 'onyx';
    this.panicKey = localStorage.getItem('void_panic_key') || '`';
    this.panicUrl = localStorage.getItem('void_panic_url') || 'https://www.google.com';
    this.render();
  }

  open(tab = 'preferences') {
    this.tab = tab;
    this.isOpen = true;
    this.error = null;
    this.message = null;
    this.currentTheme = localStorage.getItem('pulse_theme') || 'onyx';
    this.panicKey = localStorage.getItem('void_panic_key') || '`';
    this.panicUrl = localStorage.getItem('void_panic_url') || 'https://www.google.com';
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
    const user = playFabService.getCurrentUser() || { displayName: "User", username: "user", email: "", presence: "online", statusMessage: "", avatarUrl: "" };
    const activeThemeObj = THEMES.find(t => t.key === this.currentTheme) || THEMES[0];

    this.container.innerHTML = `
      <div class="modal-overlay" id="settings-modal-overlay">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">Settings</h3>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-subtle);">1</span>
            </div>
            <button class="modal-close-btn" id="settings-close-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="auth-tabs" style="margin-bottom: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;">
              <button type="button" class="auth-tab ${this.tab === 'profile' ? 'active' : ''}" id="tab-set-profile" style="padding: 8px 4px; font-size: 12px; justify-content: center;">Profile</button>
              <button type="button" class="auth-tab ${this.tab === 'account' ? 'active' : ''}" id="tab-set-account" style="padding: 8px 4px; font-size: 12px; justify-content: center;">Account</button>
              <button type="button" class="auth-tab ${this.tab === 'preferences' ? 'active' : ''}" id="tab-set-pref" style="padding: 8px 4px; font-size: 12px; justify-content: center;">Preferences</button>
              <button type="button" class="auth-tab ${this.tab === 'legal' ? 'active' : ''}" id="tab-set-legal" style="padding: 8px 4px; font-size: 12px; justify-content: center;">Policies</button>
            </div>

            ${this.message ? `
              <div style="padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; background: #181818; border: 1px solid var(--border-medium); color: #ffffff; margin-bottom: 14px;">
                ${this.escapeHtml(this.message)}
              </div>
            ` : ''}

            ${this.error ? `
              <div class="form-error-banner" style="margin-bottom: 14px;">
                <span>${this.escapeHtml(this.error)}</span>
              </div>
            ` : ''}

            ${this.tab === 'profile' ? `
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 18px; padding: 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <div class="avatar-wrapper" id="settings-avatar-preview" style="width: 56px; height: 56px; min-width: 56px; position: relative; cursor: pointer;" title="Click to upload new avatar">
                  <div class="avatar" style="width: 100%; height: 100%;">
                    ${user.avatarUrl 
                      ? `<img src="${this.escapeHtml(user.avatarUrl)}" class="avatar-img" alt="" />`
                      : `<span style="font-size: 22px; font-weight: 700; color: #ffffff;">${(user.displayName || 'U').charAt(0).toUpperCase()}</span>`
                    }
                  </div>
                  <div class="presence-badge-dot dot-${user.presence || 'online'}" style="width: 12px; height: 12px; bottom: 0; right: 0;"></div>
                </div>
                <div style="display: flex; flex-direction: column; overflow: hidden; flex: 1;">
                  <span id="settings-name-preview" style="font-size: 16px; font-weight: 700; color: #ffffff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${this.escapeHtml(user.displayName)}</span>
                  <span style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">@${this.escapeHtml(user.username || user.displayName.toLowerCase().replace(/\\s+/g, ''))}</span>
                  <div style="display: flex; gap: 6px; margin-top: 8px;">
                    <button type="button" class="form-btn-submit" id="btn-upload-pfp" style="padding: 4px 10px; font-size: 11px; width: auto;">Upload PFP</button>
                    ${user.avatarUrl ? '<button type="button" id="btn-remove-pfp" style="padding: 4px 8px; font-size: 11px; background: transparent; border: 1px solid var(--border-medium); color: var(--text-muted); border-radius: var(--radius-sm); cursor: pointer;">Remove</button>' : ''}
                  </div>
                </div>
              </div>
              <input type="file" id="settings-pfp-input" accept="image/*" style="display: none;" />

              <form id="settings-profile-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 14px;">
                <div class="form-group">
                  <label class="form-label" for="set-presence">Presence Status</label>
                  <select id="set-presence" class="form-input" style="background: var(--bg-card); color: #fff; border: 1px solid var(--border-medium); cursor: pointer;" ${this.isLoading ? 'disabled' : ''}>
                    <option value="online" ${(user.presence === 'online' || !user.presence) ? 'selected' : ''}>Online (Active)</option>
                    <option value="idle" ${user.presence === 'idle' ? 'selected' : ''}>Idle (Away)</option>
                    <option value="dnd" ${user.presence === 'dnd' ? 'selected' : ''}>Do Not Disturb</option>
                    <option value="offline" ${user.presence === 'offline' ? 'selected' : ''}>Invisible / Offline</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="set-status-msg">Status Message</label>
                  <input
                    type="text"
                    id="set-status-msg"
                    class="form-input"
                    placeholder="What's on your mind?"
                    value="${this.escapeHtml(user.statusMessage || '')}"
                    maxlength="128"
                    ${this.isLoading ? 'disabled' : ''}
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="set-avatar-url">Profile Picture URL</label>
                  <input
                    type="url"
                    id="set-avatar-url"
                    class="form-input"
                    placeholder="https://example.com/avatar.png"
                    value="${this.escapeHtml(user.avatarUrl || '')}"
                    maxlength="150000"
                    ${this.isLoading ? 'disabled' : ''}
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="set-display-name">Display Name</label>
                  <input
                    type="text"
                    id="set-display-name"
                    class="form-input"
                    value="${this.escapeHtml(user.displayName)}"
                    maxlength="32"
                    required
                    ${this.isLoading ? 'disabled' : ''}
                  />
                </div>

                <button type="submit" class="form-btn-submit" id="settings-save-profile-btn" ${this.isLoading ? 'disabled' : ''}>
                  ${this.isLoading ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>
            ` : ''}

            ${this.tab === 'account' ? `
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Username</span>
                    <span style="font-size: 13px; font-weight: 600; color: #ffffff;">@${this.escapeHtml(user.username || user.displayName.toLowerCase().replace(/\\s+/g, ''))}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Account Status</span>
                    <span style="font-size: 12px; font-weight: 700; color: #23a55a; background: rgba(35, 165, 90, 0.12); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(35, 165, 90, 0.3);">Active</span>
                  </div>
                </div>

                <form id="settings-account-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 14px;">
                  <div class="form-group">
                    <label class="form-label" for="set-account-email">Account Email</label>
                    <input
                      type="email"
                      id="set-account-email"
                      class="form-input"
                      value="${this.escapeHtml(user.email || '')}"
                      placeholder="name@example.com"
                      maxlength="100"
                      required
                      ${this.isLoading ? 'disabled' : ''}
                    />
                  </div>

                  <button type="submit" class="form-btn-submit" id="settings-save-account-btn" ${this.isLoading ? 'disabled' : ''}>
                    ${this.isLoading ? 'Updating Email...' : 'Update Account Email'}
                  </button>
                </form>

                <div style="margin-top: 10px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
                  <span style="font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">Session</span>
                  <button type="button" class="form-btn-submit" id="set-logout-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-secondary);">
                    Sign Out
                  </button>
                </div>
              </div>
            ` : ''}

            ${this.tab === 'preferences' ? `
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                  <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 14px; font-weight: 600; color: #ffffff;">Audio Effects</span>
                    <span style="font-size: 11px; color: var(--text-muted);">Sound synth notifications on messages & alerts</span>
                  </div>
                  <button type="button" class="form-btn-submit" id="set-audio-toggle" style="width: auto; padding: 6px 14px; margin: 0; font-size: 12px;">
                    ${soundSynth.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; font-weight: 600; color: #ffffff;">Theme Palette</span>
                    <span style="font-size: 10px; color: ${activeThemeObj.accent || 'var(--text-muted)'}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">${activeThemeObj.name.toUpperCase()}</span>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; max-height: 260px; overflow-y: auto; padding-right: 2px;">
                    ${THEMES.map(t => `
                      <button type="button" class="theme-select-btn ${this.currentTheme === t.key ? 'active' : ''}" data-theme-key="${t.key}" style="display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: var(--radius-sm); border: 1px solid ${this.currentTheme === t.key ? (t.accent || '#ffffff') : 'var(--border-medium)'}; background: ${t.preview}; cursor: pointer; text-align: left; transition: all 0.15s ease;">
                        <div style="width: 18px; height: 18px; border-radius: 50%; background: ${t.preview}; border: 2px solid ${t.accent || t.border}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                          ${this.currentTheme === t.key ? `<div style="width: 6px; height: 6px; border-radius: 50%; background: ${t.accent || '#ffffff'};"></div>` : ''}
                        </div>
                        <span style="font-size: 13px; font-weight: 600; color: #ffffff;">${t.name}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>

                <div style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; font-weight: 600; color: #ffffff;">Quick Redirect Keybind</span>
                    <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Navigation</span>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
                    <div class="form-group" style="margin: 0;">
                      <label class="form-label" for="set-panic-key" style="font-size: 11px;">Trigger Key</label>
                      <input
                        type="text"
                        id="set-panic-key"
                        class="form-input"
                        placeholder="e.g. \`"
                        value="${this.escapeHtml(this.panicKey || '')}"
                        maxlength="15"
                        style="font-size: 12px; font-family: var(--font-mono);"
                      />
                    </div>
                    <div class="form-group" style="margin: 0;">
                      <label class="form-label" for="set-panic-url" style="font-size: 11px;">Target URL</label>
                      <input
                        type="text"
                        id="set-panic-url"
                        class="form-input"
                        placeholder="https://www.google.com"
                        value="${this.escapeHtml(this.panicUrl || 'https://www.google.com')}"
                        maxlength="300"
                        style="font-size: 12px; font-family: var(--font-mono);"
                      />
                    </div>
                  </div>
                  <button type="button" class="form-btn-submit" id="set-save-panic-btn" style="margin: 0; padding: 8px; font-size: 12px;">
                    Save Keybind Settings
                  </button>
                </div>

                <div style="padding: 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; font-weight: 600; color: #ffffff;">Tab Cloaking</span>
                    <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Stealth</span>
                  </div>
                  <div class="form-group" style="margin: 0;">
                    <select id="cloak-select-input" class="form-input" style="background: var(--bg-card); color: #fff; border: 1px solid var(--border-medium); cursor: pointer;">
                      <option value="none" ${state.cloak === 'none' ? 'selected' : ''}>Default (void)</option>
                      <option value="google" ${state.cloak === 'google' ? 'selected' : ''}>Google</option>
                      <option value="docs" ${state.cloak === 'docs' ? 'selected' : ''}>Google Docs</option>
                      <option value="drive" ${state.cloak === 'drive' ? 'selected' : ''}>Google Drive</option>
                      <option value="classroom" ${state.cloak === 'classroom' ? 'selected' : ''}>Google Classroom</option>
                      <option value="canvas" ${state.cloak === 'canvas' ? 'selected' : ''}>Canvas</option>
                    </select>
                  </div>
                  <button type="button" class="btn-action" id="open-about-blank-launcher" style="padding: 8px; width: 100%; text-align: center;">Open in about:blank Frame</button>
                </div>
              </div>
            ` : ''}

            ${this.tab === 'legal' ? `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 12px 14px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                  <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Network & Security Compliance</h4>
                  <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin: 0;">This application is not designed, built, or intended to bypass any network blocks, organizational restrictions, or firewalls. Standard encrypted HTTPS protocols are utilized for all client data requests.</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                  <button type="button" class="form-btn-submit" id="set-open-privacy-btn" style="background: var(--bg-card); border: 1px solid var(--border-medium); color: #ffffff; text-align: left; justify-content: flex-start; padding: 10px 14px; font-size: 13px;">
                    View Privacy Policy
                  </button>
                  <button type="button" class="form-btn-submit" id="set-open-terms-btn" style="background: var(--bg-card); border: 1px solid var(--border-medium); color: #ffffff; text-align: left; justify-content: flex-start; padding: 10px 14px; font-size: 13px;">
                    View Terms of Service
                  </button>
                  <button type="button" class="form-btn-submit" id="set-open-copyright-btn" style="background: var(--bg-card); border: 1px solid var(--border-medium); color: #ffffff; text-align: left; justify-content: flex-start; padding: 10px 14px; font-size: 13px;">
                    View Copyright
                  </button>
                  <button type="button" class="form-btn-submit" id="set-open-credits-btn" style="background: var(--bg-card); border: 1px solid var(--border-medium); color: #ffffff; text-align: left; justify-content: flex-start; padding: 10px 14px; font-size: 13px;">
                    View Credits
                  </button>
                </div>
              </div>
            ` : ''}
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

    const tabProfile = this.container.querySelector('#tab-set-profile');
    tabProfile?.addEventListener('click', () => {
      this.tab = 'profile';
      this.error = null;
      this.message = null;
      this.render();
    });

    const tabAccount = this.container.querySelector('#tab-set-account');
    tabAccount?.addEventListener('click', () => {
      this.tab = 'account';
      this.error = null;
      this.message = null;
      this.render();
    });

    const tabPref = this.container.querySelector('#tab-set-pref');
    tabPref?.addEventListener('click', () => {
      this.tab = 'preferences';
      this.error = null;
      this.message = null;
      this.render();
    });

    const tabLegal = this.container.querySelector('#tab-set-legal');
    tabLegal?.addEventListener('click', () => {
      this.tab = 'legal';
      this.error = null;
      this.message = null;
      this.render();
    });

    const avatarUrlInput = this.container.querySelector('#set-avatar-url');
    const avatarPreview = this.container.querySelector('#settings-avatar-preview .avatar');
    const nameInput = this.container.querySelector('#set-display-name');
    const namePreview = this.container.querySelector('#settings-name-preview');
    const presenceSelect = this.container.querySelector('#set-presence');
    const statusMsgInput = this.container.querySelector('#set-status-msg');
    const pfpInput = this.container.querySelector('#settings-pfp-input');
    const uploadPfpBtn = this.container.querySelector('#btn-upload-pfp');
    const removePfpBtn = this.container.querySelector('#btn-remove-pfp');
    const avatarPreviewWrapper = this.container.querySelector('#settings-avatar-preview');

    uploadPfpBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      pfpInput?.click();
    });

    avatarPreviewWrapper?.addEventListener('click', () => {
      pfpInput?.click();
    });

    removePfpBtn?.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (avatarUrlInput) avatarUrlInput.value = '';
      if (avatarPreview) {
        const u = playFabService.getCurrentUser() || { displayName: "User" };
        avatarPreview.innerHTML = `<span style="font-size: 22px; font-weight: 700; color: #ffffff;">${u.displayName.charAt(0).toUpperCase()}</span>`;
      }
      try {
        await playFabService.updateUserData({ avatarUrl: '' });
        const cur = playFabService.getCurrentUser();
        if (cur) cur.avatarUrl = '';
        this.message = 'Avatar removed';
        if (this.callbacks.onProfileUpdated) this.callbacks.onProfileUpdated();
        this.render();
      } catch (err) {
        this.error = err.message || 'Failed to remove avatar';
        this.render();
      }
    });

    pfpInput?.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.isLoading = true;
      this.error = null;
      this.message = null;
      this.render();
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise((res, rej) => {
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        if (avatarUrlInput) avatarUrlInput.value = dataUrl;
        await playFabService.updateUserData({ avatarUrl: dataUrl });
        const cur = playFabService.getCurrentUser();
        if (cur) cur.avatarUrl = dataUrl;
        this.message = 'Avatar updated successfully!';
        if (this.callbacks.onProfileUpdated) this.callbacks.onProfileUpdated();
      } catch (err) {
        this.error = err.message || 'Failed to upload avatar';
      } finally {
        this.isLoading = false;
        this.render();
      }
    });

    avatarUrlInput?.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      const user = playFabService.getCurrentUser() || { displayName: "User" };
      if (avatarPreview) {
        if (url) {
          avatarPreview.innerHTML = `<img src="${this.escapeHtml(url)}" class="avatar-img" onerror="this.style.display='none'" alt="" />`;
        } else {
          avatarPreview.innerHTML = `<span style="font-size: 22px; font-weight: 700; color: #ffffff;">${user.displayName.charAt(0).toUpperCase()}</span>`;
        }
      }
    });

    nameInput?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (namePreview) {
        namePreview.textContent = val || "User";
      }
    });

    const profileForm = this.container.querySelector('#settings-profile-form');
    profileForm?.addEventListener('submit', async () => {
      const user = playFabService.getCurrentUser() || {};
      const newAvatarUrl = avatarUrlInput ? avatarUrlInput.value.trim() : '';
      const newName = nameInput ? nameInput.value.trim().slice(0, 32) : '';
      const newPresence = presenceSelect ? presenceSelect.value : 'online';
      const newStatusMsg = statusMsgInput ? statusMsgInput.value.trim().slice(0, 128) : '';

      if (!newName) {
        this.error = 'Display name cannot be empty';
        this.render();
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.message = null;
      this.render();

      try {
        await playFabService.updateUserData({
          avatarUrl: newAvatarUrl,
          presence: newPresence,
          statusMessage: newStatusMsg
        });
        if (newName !== (user.displayName || '')) {
          await playFabService.updateUserDisplayName(newName);
        }

        user.avatarUrl = newAvatarUrl;
        user.displayName = newName;
        user.presence = newPresence;
        user.statusMessage = newStatusMsg;
        appState.setUser(user);

        this.message = 'Profile changes saved successfully';
        if (this.callbacks.onProfileUpdated) {
          this.callbacks.onProfileUpdated();
        }
      } catch (e) {
        this.error = e.message || 'Failed to save changes';
      } finally {
        this.isLoading = false;
        this.render();
      }
    });

    const accountForm = this.container.querySelector('#settings-account-form');
    accountForm?.addEventListener('submit', async () => {
      this.message = 'Account settings saved';
      this.render();
    });

    const audioToggle = this.container.querySelector('#set-audio-toggle');
    audioToggle?.addEventListener('click', () => {
      const isEnabled = soundSynth.toggleSound();
      audioToggle.textContent = isEnabled ? 'Enabled' : 'Disabled';
    });

    const themeBtns = this.container.querySelectorAll('.theme-select-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const themeKey = btn.getAttribute('data-theme-key');
        if (themeKey) {
          this.currentTheme = themeKey;
          appState.setTheme(themeKey);
          this.render();
        }
      });
    });

    const savePanicBtn = this.container.querySelector('#set-save-panic-btn');
    savePanicBtn?.addEventListener('click', () => {
      const keyInput = this.container.querySelector('#set-panic-key');
      const urlInput = this.container.querySelector('#set-panic-url');
      const keyVal = keyInput ? keyInput.value.trim() : '';
      let urlVal = urlInput ? urlInput.value.trim() : 'https://www.google.com';
      if (urlVal && !urlVal.startsWith('http://') && !urlVal.startsWith('https://')) {
        urlVal = 'https://' + urlVal;
      }
      this.panicKey = keyVal;
      this.panicUrl = urlVal;
      localStorage.setItem('void_panic_key', keyVal);
      localStorage.setItem('void_panic_url', urlVal);
      appState.setPanicSettings(keyVal, urlVal);
      this.message = keyVal ? `Redirect keybind set to "${keyVal}"` : 'Redirect keybind disabled';
      this.render();
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

    const openPrivacyBtn = this.container.querySelector('#set-open-privacy-btn');
    openPrivacyBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenLegal) {
        this.callbacks.onOpenLegal('privacy');
      }
    });

    const openTermsBtn = this.container.querySelector('#set-open-terms-btn');
    openTermsBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenLegal) {
        this.callbacks.onOpenLegal('terms');
      }
    });

    const openCopyrightBtn = this.container.querySelector('#set-open-copyright-btn');
    openCopyrightBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenLegal) {
        this.callbacks.onOpenLegal('copyright');
      }
    });

    const openCreditsBtn = this.container.querySelector('#set-open-credits-btn');
    openCreditsBtn?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onOpenCredits) {
        this.callbacks.onOpenCredits();
      }
    });

    const logoutBtn = this.container.querySelector('#set-logout-btn');
    logoutBtn?.addEventListener('click', () => {
      playFabService.clearSession();
      this.close();
      if (this.callbacks.onLogout) {
        this.callbacks.onLogout();
      }
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
