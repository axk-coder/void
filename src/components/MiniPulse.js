import { appState } from '../services/state.js';
import { playFabService } from '../services/playfab.js';
import { pollingEngine } from '../services/pollingEngine.js';
import { soundSynth } from '../services/soundEffects.js';

export class MiniPulse {
  constructor(container, options = {}) {
    this.container = container;
    this.onOpenAuth = options.onOpenAuth || (() => {});
    this.userCache = new Map();
    this.partnerProfiles = new Map();
    this.serverDetails = new Map();
    this.isRailOpen = true;
    this.isSubpanelOpen = true;
    this.isChatOpen = true;
    this.isMembersOpen = false;
    this.isScrolledToBottom = true;
    this.isSubmitting = false;
    this.cloudSyncTimeout = null;

    this.render();
    this.bindEvents();
    this.setupDraggable();
    this.setupResizable();
    this.syncFromCloud();
    this.subscribeState();
  }

  render() {
    this.container.innerHTML = `
      <div class="mini-pulse-panel" id="mini-pulse-panel" style="display: none;">
        <div class="mini-pulse-header" id="mini-pulse-header">
          <div class="mini-pulse-header-left">
            <button type="button" class="mp-icon-btn active-toggle" id="mp-toggle-rail-btn" title="Toggle Server Rail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button type="button" class="mp-icon-btn active-toggle" id="mp-toggle-subpanel-btn" title="Toggle Channels/DMs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </button>
            <button type="button" class="mp-icon-btn active-toggle" id="mp-toggle-chat-btn" title="Toggle Chat Feed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button type="button" class="mp-icon-btn" id="mp-toggle-members-btn" title="Toggle People">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </button>
            <div class="mini-pulse-title-wrap">
              <span class="mini-pulse-title" id="mp-header-title">Pulse Global</span>
              <span class="mini-pulse-net-dot dot-live" id="mp-net-dot" title="Network Live"></span>
            </div>
          </div>

          <div class="mini-pulse-header-actions">
            <button type="button" class="mp-icon-btn" id="mp-dock-btn" title="Dock to Side">
              <svg id="mp-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
            <button type="button" class="mp-icon-btn" id="mp-close-btn" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="mini-pulse-shell">
          <aside class="mp-rail" id="mp-rail">
            <button type="button" class="mp-rail-btn active" id="mp-rail-global-btn" title="Global Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </button>

            <button type="button" class="mp-rail-btn" id="mp-rail-dm-btn" title="Direct Messages">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            <div class="mp-rail-divider"></div>

            <div class="mp-rail-servers" id="mp-rail-servers"></div>
          </aside>

          <aside class="mp-subpanel" id="mp-subpanel">
            <div class="mp-subpanel-header" id="mp-subpanel-header">
              <span class="mp-subpanel-title" id="mp-subpanel-title">Channels</span>
            </div>
            <div class="mp-subpanel-content" id="mp-subpanel-content"></div>
          </aside>

          <main class="mp-chat-column" id="mp-chat-column">
            <div class="mp-auth-required" id="mp-auth-gate" style="display: none;">
              <div class="mp-auth-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span class="mp-auth-title">Sign in to join chat</span>
                <button type="button" class="mp-btn-primary" id="mp-gate-login-btn">Sign In</button>
              </div>
            </div>

            <div class="mp-messages-feed" id="mp-messages-feed">
              <div class="mp-feed-empty" id="mp-feed-empty">
                <span>No messages yet. Send a message to start conversation.</span>
              </div>
            </div>

            <div class="mp-input-area" id="mp-input-area">
              <div class="mp-reply-bar" id="mp-reply-bar" style="display: none;">
                <span class="mp-reply-text" id="mp-reply-text">Replying to message...</span>
                <button type="button" class="mp-reply-cancel" id="mp-reply-cancel" title="Cancel Reply">&times;</button>
              </div>

              <div class="mp-upload-progress" id="mp-upload-progress" style="display: none; padding: 4px 8px; font-size: 11px; color: var(--text-secondary); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: 4px; align-items: center; gap: 6px;">
                <svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
                <span id="mp-upload-status">Uploading file...</span>
              </div>

              <div class="mp-composer-box">
                <input type="file" id="mp-file-input" style="display: none;" multiple />
                <button type="button" class="mp-attach-btn" id="mp-attach-btn" title="Upload File (Max 10MB)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </button>
                <textarea id="mp-composer-input" class="mp-input-field" placeholder="Send a message..." rows="1" maxlength="2000"></textarea>
                <button type="button" class="mp-send-btn" id="mp-send-btn" title="Send (Enter)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </main>

          <aside class="mp-members-panel collapsed" id="mp-members-panel">
            <div class="mp-members-header">
              <span class="mp-members-title">People</span>
              <button type="button" class="mp-icon-btn mp-members-close-btn" id="mp-members-close-btn" title="Close People">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="mp-members-content" id="mp-members-content">
              <div class="mp-members-loading">Loading people...</div>
            </div>
          </aside>
        </div>

        <div class="mp-resize-handle" id="mp-resize-handle" title="Drag to Resize">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10">
            <line x1="19" y1="13" x2="13" y2="19"></line>
            <line x1="19" y1="7" x2="7" y2="19"></line>
          </svg>
        </div>
      </div>
    `;
  }

  saveLayoutSettings() {
    const panel = document.getElementById('mini-pulse-panel');
    const layout = {
      isRailOpen: this.isRailOpen,
      isSubpanelOpen: this.isSubpanelOpen,
      isChatOpen: this.isChatOpen,
      isMembersOpen: this.isMembersOpen,
      width: panel ? panel.style.width : null,
      height: panel ? panel.style.height : null,
      docked: appState.getState().miniPulseDocked
    };
    try {
      localStorage.setItem('pulse_ui_layout', JSON.stringify(layout));
    } catch {}

    if (this.cloudSyncTimeout) clearTimeout(this.cloudSyncTimeout);
    this.cloudSyncTimeout = setTimeout(async () => {
      if (playFabService.isAuthenticated()) {
        try {
          await playFabService.savePulseSettings({ layout });
        } catch {}
      }
    }, 600);
  }

  applyLayoutSettings(layout) {
    if (!layout || typeof layout !== 'object') return;
    if (typeof layout.isRailOpen === 'boolean') {
      this.isRailOpen = layout.isRailOpen;
      const rail = document.getElementById('mp-rail');
      const toggle = document.getElementById('mp-toggle-rail-btn');
      rail?.classList.toggle('collapsed', !this.isRailOpen);
      toggle?.classList.toggle('active-toggle', this.isRailOpen);
    }
    if (typeof layout.isSubpanelOpen === 'boolean') {
      this.isSubpanelOpen = layout.isSubpanelOpen;
      const sub = document.getElementById('mp-subpanel');
      const toggle = document.getElementById('mp-toggle-subpanel-btn');
      sub?.classList.toggle('collapsed', !this.isSubpanelOpen);
      toggle?.classList.toggle('active-toggle', this.isSubpanelOpen);
    }
    if (typeof layout.isChatOpen === 'boolean') {
      this.isChatOpen = layout.isChatOpen;
      const chat = document.getElementById('mp-chat-column');
      const toggle = document.getElementById('mp-toggle-chat-btn');
      chat?.classList.toggle('collapsed', !this.isChatOpen);
      toggle?.classList.toggle('active-toggle', this.isChatOpen);
    }
    if (typeof layout.isMembersOpen === 'boolean') {
      this.isMembersOpen = layout.isMembersOpen;
      const members = document.getElementById('mp-members-panel');
      const toggle = document.getElementById('mp-toggle-members-btn');
      members?.classList.toggle('collapsed', !this.isMembersOpen);
      toggle?.classList.toggle('active-toggle', this.isMembersOpen);
      if (this.isMembersOpen) this.renderMembers();
    }
    const panel = document.getElementById('mini-pulse-panel');
    if (panel) {
      if (layout.width) panel.style.width = layout.width;
      if (layout.height) panel.style.height = layout.height;
    }
    if (typeof layout.docked === 'boolean' && layout.docked !== appState.getState().miniPulseDocked) {
      appState.setMiniPulseDocked(layout.docked);
    }
  }

  async syncFromCloud() {
    try {
      const local = localStorage.getItem('pulse_ui_layout');
      if (local) {
        this.applyLayoutSettings(JSON.parse(local));
      }
    } catch {}

    if (!playFabService.isAuthenticated()) return;
    try {
      const cloud = await playFabService.loadPulseSettings();
      if (cloud) {
        if (cloud.layout) {
          this.applyLayoutSettings(cloud.layout);
          localStorage.setItem('pulse_ui_layout', JSON.stringify(cloud.layout));
        }
      }
    } catch {}
  }

  setupDraggable() {
    const header = document.getElementById('mini-pulse-header');
    const panel = document.getElementById('mini-pulse-panel');
    if (!header || !panel) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const onPointerDown = (e) => {
      const state = appState.getState();
      if (state.miniPulseDocked) return;
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
        return;
      }

      isDragging = true;
      const rect = panel.getBoundingClientRect();
      startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      startY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      initialX = rect.left;
      initialY = rect.top;

      panel.style.transition = 'none';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
      panel.style.left = `${initialX}px`;
      panel.style.top = `${initialY}px`;
      header.style.cursor = 'grabbing';

      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();

      const curX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const curY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      const deltaX = curX - startX;
      const deltaY = curY - startY;

      let newLeft = initialX + deltaX;
      let newTop = initialY + deltaY;

      const maxLeft = Math.max(8, window.innerWidth - panel.offsetWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - panel.offsetHeight - 8);

      newLeft = Math.max(8, Math.min(newLeft, maxLeft));
      newTop = Math.max(8, Math.min(newTop, maxTop));

      panel.style.left = `${newLeft}px`;
      panel.style.top = `${newTop}px`;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      header.style.cursor = 'grab';
      panel.style.transition = '';
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };

    header.addEventListener('mousedown', onPointerDown);
    header.addEventListener('touchstart', onPointerDown, { passive: true });
  }

  setupResizable() {
    const handle = document.getElementById('mp-resize-handle');
    const panel = document.getElementById('mini-pulse-panel');
    if (!handle || !panel) return;

    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;

    const onResizeDown = (e) => {
      const state = appState.getState();
      if (state.miniPulseDocked) return;
      e.stopPropagation();
      e.preventDefault();

      isResizing = true;
      startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      startY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      startW = panel.offsetWidth;
      startH = panel.offsetHeight;

      panel.style.transition = 'none';

      window.addEventListener('mousemove', onResizeMove, { passive: false });
      window.addEventListener('mouseup', onResizeUp);
      window.addEventListener('touchmove', onResizeMove, { passive: false });
      window.addEventListener('touchend', onResizeUp);
    };

    const onResizeMove = (e) => {
      if (!isResizing) return;
      if (e.cancelable) e.preventDefault();

      const curX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const curY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      const deltaX = curX - startX;
      const deltaY = curY - startY;

      const rect = panel.getBoundingClientRect();
      const maxW = Math.max(260, window.innerWidth - rect.left - 8);
      const maxH = Math.max(260, window.innerHeight - rect.top - 8);

      const targetW = Math.max(260, Math.min(startW + deltaX, maxW));
      const targetH = Math.max(260, Math.min(startH + deltaY, maxH));

      panel.style.width = `${targetW}px`;
      panel.style.height = `${targetH}px`;
    };

    const onResizeUp = () => {
      if (!isResizing) return;
      isResizing = false;
      panel.style.transition = '';
      this.saveLayoutSettings();
      window.removeEventListener('mousemove', onResizeMove);
      window.removeEventListener('mouseup', onResizeUp);
      window.removeEventListener('touchmove', onResizeMove);
      window.removeEventListener('touchend', onResizeUp);
    };

    handle.addEventListener('mousedown', onResizeDown);
    handle.addEventListener('touchstart', onResizeDown, { passive: false });
  }

  bindEvents() {
    const closeBtn = document.getElementById('mp-close-btn');
    closeBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      appState.setMiniPulseOpen(false);
    });

    const dockBtn = document.getElementById('mp-dock-btn');
    dockBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      const state = appState.getState();
      appState.setMiniPulseDocked(!state.miniPulseDocked);
      this.saveLayoutSettings();
    });

    const toggleRailBtn = document.getElementById('mp-toggle-rail-btn');
    toggleRailBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.isRailOpen = !this.isRailOpen;
      const rail = document.getElementById('mp-rail');
      if (rail) {
        rail.classList.toggle('collapsed', !this.isRailOpen);
      }
      toggleRailBtn.classList.toggle('active-toggle', this.isRailOpen);
      this.saveLayoutSettings();
    });

    const toggleSubpanelBtn = document.getElementById('mp-toggle-subpanel-btn');
    toggleSubpanelBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.isSubpanelOpen = !this.isSubpanelOpen;
      const sub = document.getElementById('mp-subpanel');
      if (sub) {
        sub.classList.toggle('collapsed', !this.isSubpanelOpen);
      }
      toggleSubpanelBtn.classList.toggle('active-toggle', this.isSubpanelOpen);
      this.saveLayoutSettings();
    });

    const toggleChatBtn = document.getElementById('mp-toggle-chat-btn');
    toggleChatBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.isChatOpen = !this.isChatOpen;
      const chat = document.getElementById('mp-chat-column');
      if (chat) {
        chat.classList.toggle('collapsed', !this.isChatOpen);
      }
      toggleChatBtn.classList.toggle('active-toggle', this.isChatOpen);
      this.saveLayoutSettings();
    });

    const toggleMembersBtn = document.getElementById('mp-toggle-members-btn');
    toggleMembersBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.isMembersOpen = !this.isMembersOpen;
      const members = document.getElementById('mp-members-panel');
      if (members) {
        members.classList.toggle('collapsed', !this.isMembersOpen);
      }
      toggleMembersBtn.classList.toggle('active-toggle', this.isMembersOpen);
      if (this.isMembersOpen) {
        this.renderMembers();
      }
      this.saveLayoutSettings();
    });

    const membersCloseBtn = document.getElementById('mp-members-close-btn');
    membersCloseBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.isMembersOpen = false;
      const members = document.getElementById('mp-members-panel');
      if (members) {
        members.classList.add('collapsed');
      }
      toggleMembersBtn?.classList.remove('active-toggle');
      this.saveLayoutSettings();
    });

    const railGlobal = document.getElementById('mp-rail-global-btn');
    railGlobal?.addEventListener('click', () => {
      soundSynth.playClick();
      appState.setGlobalChat();
    });

    const railDm = document.getElementById('mp-rail-dm-btn');
    railDm?.addEventListener('click', () => {
      soundSynth.playClick();
      const dms = appState.getState().dms || [];
      if (dms.length > 0) {
        const first = dms[0];
        const pId = first.partnerId || (first.userId !== appState.getCurrentUserId() ? first.userId : null);
        const pProf = pId ? this.partnerProfiles.get(pId) : null;
        appState.setActiveDM(Object.assign({}, first, {
          partnerId: pId,
          partnerName: pProf?.displayName || first.partnerName || 'User'
        }));
      } else {
        appState.setActiveDM({ dmId: 'dm_default', partnerId: null, partnerName: 'Friends' });
      }
    });

    const gateLoginBtn = document.getElementById('mp-gate-login-btn');
    gateLoginBtn?.addEventListener('click', () => {
      this.onOpenAuth();
    });

    const input = document.getElementById('mp-composer-input');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    const sendBtn = document.getElementById('mp-send-btn');
    sendBtn?.addEventListener('click', () => {
      this.handleSend();
    });

    const replyCancel = document.getElementById('mp-reply-cancel');
    replyCancel?.addEventListener('click', () => {
      appState.clearReplyingTo();
    });

    const fileInput = document.getElementById('mp-file-input');
    const attachBtn = document.getElementById('mp-attach-btn');
    attachBtn?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        this.handleFileUpload(files);
      }
    });

    const feed = document.getElementById('mp-messages-feed');
    feed?.addEventListener('scroll', () => {
      const threshold = 40;
      this.isScrolledToBottom = (feed.scrollHeight - feed.scrollTop - feed.clientHeight) <= threshold;
    });
  }

  subscribeState() {
    appState.subscribe((state, key) => {
      if (key === 'miniPulseOpen' || key === 'miniPulseDocked') {
        this.updateVisibility();
      }
      if (key === 'user') {
        this.updateAuthGate();
        if (state.user) {
          pollingEngine.start();
        }
        if (this.isMembersOpen) {
          this.renderMembers();
        }
      }
      if (key === 'messages') {
        this.renderMessages();
        if (this.isMembersOpen) {
          this.renderMembers();
        }
      }
      if (key === 'navigation' || key === 'channel' || key === 'servers' || key === 'dms') {
        this.updateRail();
        this.updateSubpanel();
        this.updateHeaderTitle();
        this.renderMessages();
        if (this.isMembersOpen) {
          this.renderMembers();
        }
      }
      if (key === 'reply') {
        this.updateReplyBar();
      }
      if (key === 'network') {
        this.updateNetworkDot();
      }
    });

    this.updateVisibility();
    this.updateAuthGate();
    this.updateRail();
    this.updateSubpanel();
    this.updateHeaderTitle();
    this.renderMessages();
  }

  updateVisibility() {
    const state = appState.getState();
    const panel = document.getElementById('mini-pulse-panel');
    const voidLayout = document.querySelector('.void-layout');

    if (!panel) return;

    if (state.miniPulseOpen) {
      panel.style.display = 'flex';
      if (state.miniPulseDocked) {
        panel.classList.add('docked');
        panel.style.left = '';
        panel.style.top = '';
        panel.style.right = '';
        panel.style.bottom = '';
        if (voidLayout) voidLayout.classList.add('with-docked-pulse');
      } else {
        panel.classList.remove('docked');
        if (voidLayout) voidLayout.classList.remove('with-docked-pulse');
      }
      this.scrollToBottom();
      if (this.isMembersOpen) {
        this.renderMembers();
      }
    } else {
      panel.style.display = 'none';
      panel.classList.remove('docked');
      if (voidLayout) voidLayout.classList.remove('with-docked-pulse');
    }
  }

  updateAuthGate() {
    const isAuth = playFabService.isAuthenticated();
    const gate = document.getElementById('mp-auth-gate');
    const inputArea = document.getElementById('mp-input-area');
    if (gate) {
      gate.style.display = isAuth ? 'none' : 'flex';
    }
    if (inputArea) {
      inputArea.style.opacity = isAuth ? '1' : '0.4';
      inputArea.style.pointerEvents = isAuth ? 'auto' : 'none';
    }
  }

  updateNetworkDot() {
    const net = appState.getState().network;
    const dot = document.getElementById('mp-net-dot');
    if (!dot) return;
    dot.className = `mini-pulse-net-dot dot-${net.status || 'live'}`;
    dot.title = `Status: ${net.status || 'live'} (${net.latencyMs || 0}ms)`;
  }

  updateRail() {
    const state = appState.getState();
    const railGlobal = document.getElementById('mp-rail-global-btn');
    const railDm = document.getElementById('mp-rail-dm-btn');
    const serverContainer = document.getElementById('mp-rail-servers');

    if (railGlobal) {
      railGlobal.classList.toggle('active', state.activeContext === 'global');
    }
    if (railDm) {
      railDm.classList.toggle('active', state.activeContext === 'dm');
    }

    if (!serverContainer) return;
    serverContainer.innerHTML = '';
    const servers = state.servers || [];

    servers.forEach(srv => {
      const sId = srv.id || srv.serverId;
      const isActive = state.activeContext === 'server' && state.activeServerId === sId;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mp-rail-btn ${isActive ? 'active' : ''}`;
      btn.title = srv.name || 'Server';

      if (srv.iconUrl && (srv.iconUrl.startsWith('http://') || srv.iconUrl.startsWith('https://') || srv.iconUrl.startsWith('data:image/'))) {
        btn.innerHTML = `<img src="${this.escapeHtml(srv.iconUrl)}" class="mp-rail-img" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="mp-rail-fallback" style="display: none;">${(srv.name || 'S').charAt(0).toUpperCase()}</span>`;
      } else {
        btn.innerHTML = `<span class="mp-rail-fallback">${(srv.name || 'S').charAt(0).toUpperCase()}</span>`;
      }

      btn.addEventListener('click', () => {
        soundSynth.playClick();
        if (srv.channels && Array.isArray(srv.channels) && srv.channels.length > 0) {
          appState.setActiveServer(srv);
        } else {
          appState.setActiveServer(Object.assign({}, srv, { channels: [{ id: 'chat', name: 'chat' }] }));
          playFabService.getServer(sId).then(res => {
            if (res && res.server) {
              this.serverDetails.set(sId, res.server);
              const current = appState.getState().activeServer;
              if (current && (current.id || current.serverId) === sId) {
                appState.setActiveServer(Object.assign({}, current, res.server));
              }
            }
          });
        }
      });

      serverContainer.appendChild(btn);
    });
  }

  updateSubpanel() {
    const state = appState.getState();
    const titleEl = document.getElementById('mp-subpanel-title');
    const contentEl = document.getElementById('mp-subpanel-content');
    if (!titleEl || !contentEl) return;

    contentEl.innerHTML = '';

    if (state.activeContext === 'global') {
      titleEl.textContent = 'Global';
      contentEl.innerHTML = `
        <div class="mp-subpanel-section-title">Streams</div>
        <div class="mp-channel-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          <span>Global Stream</span>
        </div>
      `;
    } else if (state.activeContext === 'dm') {
      titleEl.textContent = 'Direct Messages';
      const dms = state.dms || [];

      const secTitle = document.createElement('div');
      secTitle.className = 'mp-subpanel-section-title';
      secTitle.textContent = 'Conversations';
      contentEl.appendChild(secTitle);

      if (dms.length === 0) {
        contentEl.innerHTML += '<div class="mp-empty-note">No recent direct messages.</div>';
      } else {
        dms.forEach(dm => {
          const item = document.createElement('div');
          item.className = 'mp-channel-item';
          const isActive = state.activeDM && state.activeDM.dmId === dm.dmId;
          if (isActive) item.classList.add('active');

          const partnerId = dm.partnerId || (dm.userId !== appState.getCurrentUserId() ? dm.userId : null);
          let initialName = dm.name || dm.partnerName || 'User';
          let initialUser = dm.partnerUsername ? `@${dm.partnerUsername}` : '';
          let initialChar = initialName.charAt(0).toUpperCase();

          const cached = partnerId ? this.partnerProfiles.get(partnerId) : null;
          if (cached) {
            initialName = cached.displayName || initialName;
            initialUser = cached.username ? `@${cached.username}` : '';
            initialChar = initialName.charAt(0).toUpperCase();
          }

          item.innerHTML = `
            <div class="mp-channel-avatar" id="dm-sub-av-${this.escapeHtml(dm.dmId)}">${initialChar}</div>
            <div class="mp-dm-info">
              <span class="mp-dm-title" id="dm-sub-name-${this.escapeHtml(dm.dmId)}">${this.escapeHtml(initialName)}</span>
              <span class="mp-dm-user" id="dm-sub-user-${this.escapeHtml(dm.dmId)}">${this.escapeHtml(initialUser)}</span>
            </div>
          `;

          if (partnerId && !cached) {
            playFabService.resolveUser(partnerId).then(profile => {
              if (profile) {
                this.partnerProfiles.set(partnerId, profile);
                const nameEl = item.querySelector(`#dm-sub-name-${dm.dmId}`);
                const userEl = item.querySelector(`#dm-sub-user-${dm.dmId}`);
                const avEl = item.querySelector(`#dm-sub-av-${dm.dmId}`);
                if (nameEl) nameEl.textContent = profile.displayName || 'User';
                if (userEl) userEl.textContent = profile.username ? `@${profile.username}` : '';
                if (avEl) {
                  if (profile.avatarUrl && (profile.avatarUrl.startsWith('http://') || profile.avatarUrl.startsWith('https://') || profile.avatarUrl.startsWith('data:image/'))) {
                    avEl.innerHTML = `<img src="${this.escapeHtml(profile.avatarUrl)}" class="mp-avatar-img" alt="" onerror="this.style.display='none'" />`;
                  } else {
                    avEl.textContent = (profile.displayName || 'U').charAt(0).toUpperCase();
                  }
                }
              }
            });
          }

          item.addEventListener('click', () => {
            soundSynth.playClick();
            const pProf = partnerId ? this.partnerProfiles.get(partnerId) : null;
            appState.setActiveDM(Object.assign({}, dm, {
              partnerId: partnerId,
              partnerName: pProf?.displayName || dm.partnerName || 'User',
              partnerUsername: pProf?.username || dm.partnerUsername || ''
            }));
          });

          contentEl.appendChild(item);
        });
      }
    } else if (state.activeContext === 'server' && state.activeServer) {
      const srv = state.activeServer;
      titleEl.textContent = srv.name || 'Server';

      const secTitle = document.createElement('div');
      secTitle.className = 'mp-subpanel-section-title';
      secTitle.textContent = 'Text Channels';
      contentEl.appendChild(secTitle);

      const sId = srv.id || srv.serverId;
      let channels = srv.channels;
      if (!Array.isArray(channels) || channels.length === 0) {
        if (this.serverDetails.has(sId)) {
          channels = this.serverDetails.get(sId).channels;
        } else {
          channels = [{ id: 'chat', name: 'chat' }];
          playFabService.getServer(sId).then(res => {
            if (res && res.server) {
              this.serverDetails.set(sId, res.server);
              const cur = appState.getState().activeServer;
              if (cur && (cur.id || cur.serverId) === sId) {
                appState.setActiveServer(Object.assign({}, cur, res.server));
              }
            }
          });
        }
      }

      channels.forEach(ch => {
        const chId = typeof ch === 'object' ? ch.id : ch;
        const chName = typeof ch === 'object' ? (ch.name || ch.id) : ch;
        const isChActive = state.activeChannelId === chId || (!state.activeChannelId && chId === 'chat');

        const chBtn = document.createElement('div');
        chBtn.className = `mp-channel-item ${isChActive ? 'active' : ''}`;
        chBtn.innerHTML = `
          <span class="mp-channel-hash">#</span>
          <span class="mp-channel-name">${this.escapeHtml(chName)}</span>
        `;

        chBtn.addEventListener('click', () => {
          soundSynth.playClick();
          appState.setActiveChannel(chId);
        });

        contentEl.appendChild(chBtn);
      });
    }
  }

  updateHeaderTitle() {
    const state = appState.getState();
    const titleEl = document.getElementById('mp-header-title');
    const inputField = document.getElementById('mp-composer-input');
    if (!titleEl) return;

    if (state.activeContext === 'global') {
      titleEl.textContent = 'Pulse Global';
      if (inputField) inputField.placeholder = 'Message #global...';
    } else if (state.activeContext === 'dm' && state.activeDM) {
      const pProfile = state.activeDM.partnerId ? this.partnerProfiles.get(state.activeDM.partnerId) : null;
      const dName = pProfile?.displayName || state.activeDM.name || state.activeDM.partnerName || 'Direct Message';
      titleEl.textContent = `DM: ${dName}`;
      if (inputField) inputField.placeholder = `Message @${pProfile?.username || dName}...`;
    } else if (state.activeContext === 'server' && state.activeServer) {
      const srvName = state.activeServer.name || 'Server';
      const chName = state.activeChannelId || 'chat';
      titleEl.textContent = `${srvName} #${chName}`;
      if (inputField) inputField.placeholder = `Message #${chName}...`;
    } else {
      titleEl.textContent = 'Pulse Chat';
      if (inputField) inputField.placeholder = 'Send a message...';
    }
  }

  updateReplyBar() {
    const state = appState.getState();
    const bar = document.getElementById('mp-reply-bar');
    const textEl = document.getElementById('mp-reply-text');
    if (!bar || !textEl) return;

    if (state.replyingTo) {
      bar.style.display = 'flex';
      textEl.textContent = `Replying to: ${this.escapeHtml(state.replyingTo.text || '').slice(0, 45)}...`;
    } else {
      bar.style.display = 'none';
    }
  }

  renderMessages() {
    const feed = document.getElementById('mp-messages-feed');
    const emptyState = document.getElementById('mp-feed-empty');
    if (!feed || !emptyState) return;

    const streamKey = appState.getStreamKey();
    const messages = appState.getState().messages[streamKey] || [];
    const currentUserId = playFabService.getCurrentUser()?.playFabId;

    const oldNodes = feed.querySelectorAll('.mp-message-row');
    oldNodes.forEach(n => n.remove());

    if (messages.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';

    messages.forEach(msg => {
      const row = document.createElement('div');
      row.className = 'mp-message-row';
      row.setAttribute('data-sender-id', msg.senderId);
      if (msg.senderId === currentUserId) {
        row.classList.add('mp-msg-mine');
      }

      const cachedSender = this.userCache.get(msg.senderId);
      const isCurrent = currentUserId && msg.senderId === currentUserId;
      const curUser = playFabService.getCurrentUser();
      const displayName = cachedSender?.displayName || (isCurrent ? curUser?.displayName : null) || 'Member';
      const avatarUrl = cachedSender?.avatarUrl || (isCurrent ? curUser?.avatarUrl : '') || '';
      const appRank = cachedSender?.appRank || (isCurrent ? curUser?.appRank : null) || null;

      const avatar = document.createElement('div');
      avatar.className = 'mp-msg-avatar';
      if (avatarUrl && (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://') || avatarUrl.startsWith('data:image/'))) {
        avatar.innerHTML = `<img src="${this.escapeHtml(avatarUrl)}" class="mp-avatar-img" alt="" onerror="this.style.display='none'" />`;
      } else {
        avatar.textContent = (displayName || 'U').charAt(0).toUpperCase();
      }

      const content = document.createElement('div');
      content.className = 'mp-msg-content';

      const meta = document.createElement('div');
      meta.className = 'mp-msg-meta';

      const name = document.createElement('span');
      name.className = 'mp-msg-name';
      name.textContent = displayName;

      if (appRank && !appRank.hidden) {
        const badge = document.createElement('span');
        badge.className = 'mp-rank-badge';
        badge.textContent = appRank.name;
        if (appRank.color) {
          badge.style.borderColor = appRank.color;
          badge.style.color = appRank.color;
        }
        meta.appendChild(badge);
      }

      const time = document.createElement('span');
      time.className = 'mp-msg-time';
      time.textContent = this.formatTime(msg.timestamp);

      meta.prepend(name);
      meta.appendChild(time);

      if (msg.replyTo) {
        const replyBox = document.createElement('div');
        replyBox.className = 'mp-msg-reply-box';
        replyBox.textContent = msg.replyTo.text || 'Original message';
        content.appendChild(replyBox);
      }

      const body = document.createElement('div');
      body.className = 'mp-msg-body';
      body.innerHTML = this.formatMessageText(msg.text);

      const actions = document.createElement('div');
      actions.className = 'mp-msg-actions';

      const replyBtn = document.createElement('button');
      replyBtn.type = 'button';
      replyBtn.className = 'mp-action-btn';
      replyBtn.title = 'Reply';
      replyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <polyline points="9 17 4 12 9 7"></polyline>
          <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
        </svg>
      `;
      replyBtn.addEventListener('click', () => {
        appState.setReplyingTo({
          id: msg.id,
          senderId: msg.senderId,
          text: msg.text
        });
        const inp = document.getElementById('mp-composer-input');
        inp?.focus();
      });

      actions.appendChild(replyBtn);

      if (msg.senderId === currentUserId) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'mp-action-btn';
        delBtn.title = 'Delete';
        delBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
        delBtn.addEventListener('click', async () => {
          if (confirm('Delete this message?')) {
            try {
              const target = appState.getTargetParam();
              await playFabService.deleteMessage(target, msg.id);
              pollingEngine.pollNow();
            } catch (err) {
              alert(err.message || 'Failed to delete');
            }
          }
        });
        actions.appendChild(delBtn);
      }

      content.appendChild(meta);
      content.appendChild(body);
      row.appendChild(avatar);
      row.appendChild(content);
      row.appendChild(actions);

      feed.appendChild(row);

      if (!cachedSender && msg.senderId) {
        playFabService.resolveUser(msg.senderId).then(profile => {
          if (profile) {
            this.userCache.set(msg.senderId, profile);
            const cards = feed.querySelectorAll(`[data-sender-id="${msg.senderId}"]`);
            cards.forEach(card => {
              const nSpan = card.querySelector('.mp-msg-name');
              const avBox = card.querySelector('.mp-msg-avatar');
              const mDiv = card.querySelector('.mp-msg-meta');
              if (nSpan) nSpan.textContent = profile.displayName || 'Member';
              if (avBox) {
                if (profile.avatarUrl && (profile.avatarUrl.startsWith('http://') || profile.avatarUrl.startsWith('https://') || profile.avatarUrl.startsWith('data:image/'))) {
                  avBox.innerHTML = `<img src="${this.escapeHtml(profile.avatarUrl)}" class="mp-avatar-img" alt="" onerror="this.style.display='none'" />`;
                } else {
                  avBox.textContent = (profile.displayName || 'U').charAt(0).toUpperCase();
                }
              }
              if (mDiv && profile.appRank && !profile.appRank.hidden && !mDiv.querySelector('.mp-rank-badge')) {
                const badgeEl = document.createElement('span');
                badgeEl.className = 'mp-rank-badge';
                badgeEl.textContent = profile.appRank.name;
                if (profile.appRank.color) {
                  badgeEl.style.borderColor = profile.appRank.color;
                  badgeEl.style.color = profile.appRank.color;
                }
                mDiv.appendChild(badgeEl);
              }
            });
          }
        });
      }
    });

    feed.querySelectorAll('.btn-download-file').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-file-id');
        const fileName = btn.getAttribute('data-file-name') || 'download';
        if (!fileId) return;

        const origHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span>Downloading...</span>`;

        try {
          const fileObj = await playFabService.downloadFile(fileId);
          if (fileObj && fileObj.data) {
            const link = document.createElement('a');
            link.href = fileObj.data;
            link.download = fileObj.fileName || fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          alert(err.message || 'Failed to download file');
        } finally {
          btn.disabled = false;
          btn.innerHTML = origHtml;
        }
      });
    });

    feed.querySelectorAll('.btn-play-media').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-file-id');
        const card = btn.closest('.discord-file-embed');
        if (!fileId || !card) return;

        const origHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span>Loading...</span>`;

        try {
          const fileObj = await playFabService.downloadFile(fileId);
          if (fileObj && fileObj.data) {
            btn.style.display = 'none';
            const audioBox = card.querySelector('.file-audio-preview');
            if (audioBox) {
              audioBox.style.display = 'block';
              const audio = audioBox.querySelector('audio');
              if (audio) {
                audio.src = fileObj.data;
                audio.play().catch(() => {});
              }
            }
          }
        } catch {
          btn.disabled = false;
          btn.innerHTML = origHtml;
        }
      });
    });

    feed.querySelectorAll('.file-image-preview').forEach(previewEl => {
      const fileId = previewEl.getAttribute('data-file-id');
      const img = previewEl.querySelector('img');
      if (fileId && (!img || !img.getAttribute('src'))) {
        playFabService.downloadFile(fileId).then(fileObj => {
          if (fileObj && fileObj.data && img) {
            img.src = fileObj.data;
            previewEl.style.display = 'block';
          }
        }).catch(() => {});
      }
    });

    feed.querySelectorAll('.file-video-preview').forEach(previewEl => {
      const fileId = previewEl.getAttribute('data-file-id');
      const video = previewEl.querySelector('video');
      if (fileId && (!video || !video.getAttribute('src'))) {
        const cached = playFabService.getCachedFile(fileId);
        if (cached && cached.data && video) {
          video.src = cached.data;
          previewEl.style.display = 'block';
        } else {
          playFabService.downloadFile(fileId).then(fileObj => {
            if (fileObj && fileObj.data && video) {
              video.src = fileObj.data;
              previewEl.style.display = 'block';
            }
          }).catch(() => {});
        }
      }
    });

    if (this.isScrolledToBottom) {
      this.scrollToBottom();
    }
  }

  async renderMembers() {
    const contentEl = document.getElementById('mp-members-content');
    if (!contentEl) return;

    const state = appState.getState();
    const currentUserId = playFabService.getCurrentUser()?.playFabId;
    const memberMap = new Map();

    const curUser = playFabService.getCurrentUser();
    if (curUser) {
      memberMap.set(curUser.playFabId, {
        playFabId: curUser.playFabId,
        displayName: curUser.displayName || 'You',
        username: curUser.username || '',
        avatarUrl: curUser.avatarUrl || '',
        appRank: curUser.appRank || null,
        presence: curUser.presence || 'online'
      });
    }

    const streamKey = appState.getStreamKey();
    const messages = state.messages[streamKey] || [];
    messages.forEach(m => {
      if (m.senderId && !memberMap.has(m.senderId)) {
        const cached = this.userCache.get(m.senderId);
        memberMap.set(m.senderId, {
          playFabId: m.senderId,
          displayName: cached?.displayName || 'Member',
          username: cached?.username || '',
          avatarUrl: cached?.avatarUrl || '',
          appRank: cached?.appRank || null,
          presence: cached?.presence || 'online'
        });
      }
    });

    if (state.activeContext === 'dm' && state.activeDM) {
      const pId = state.activeDM.partnerId;
      if (pId && !memberMap.has(pId)) {
        const cached = this.partnerProfiles.get(pId) || this.userCache.get(pId);
        memberMap.set(pId, {
          playFabId: pId,
          displayName: cached?.displayName || state.activeDM.name || 'User',
          username: cached?.username || state.activeDM.partnerUsername || '',
          avatarUrl: cached?.avatarUrl || '',
          appRank: cached?.appRank || null,
          presence: cached?.presence || 'online'
        });
      }
    }

    if (state.activeContext === 'server' && state.activeServer) {
      const srv = state.activeServer;
      const sId = srv.id || srv.serverId;
      const details = this.serverDetails.get(sId);
      const serverMembers = details?.members || srv.members;
      if (Array.isArray(serverMembers)) {
        serverMembers.forEach(mem => {
          const mId = typeof mem === 'object' ? (mem.playFabId || mem.userId) : mem;
          if (mId && !memberMap.has(mId)) {
            const cached = this.userCache.get(mId);
            memberMap.set(mId, {
              playFabId: mId,
              displayName: cached?.displayName || (typeof mem === 'object' ? mem.displayName : null) || 'Member',
              username: cached?.username || (typeof mem === 'object' ? mem.username : null) || '',
              avatarUrl: cached?.avatarUrl || (typeof mem === 'object' ? mem.avatarUrl : null) || '',
              appRank: cached?.appRank || (typeof mem === 'object' ? mem.appRank : null) || null,
              presence: cached?.presence || (typeof mem === 'object' ? mem.presence : 'online') || 'online'
            });
          }
        });
      }
    }

    try {
      const friends = await playFabService.getFriendsList();
      friends.forEach(f => {
        if (!memberMap.has(f.playFabId)) {
          memberMap.set(f.playFabId, {
            playFabId: f.playFabId,
            displayName: f.displayName || 'Friend',
            username: f.username || '',
            avatarUrl: f.avatarUrl || '',
            appRank: null,
            presence: 'online'
          });
        }
      });
    } catch {}

    const members = Array.from(memberMap.values());
    if (members.length === 0) {
      contentEl.innerHTML = '<div class="mp-empty-note">No active members found.</div>';
      return;
    }

    contentEl.innerHTML = '';
    const group = document.createElement('div');
    group.className = 'mp-members-group';

    const groupTitle = document.createElement('div');
    groupTitle.className = 'mp-subpanel-section-title';
    groupTitle.textContent = `Online - ${members.length}`;
    group.appendChild(groupTitle);

    members.forEach(mem => {
      const row = document.createElement('div');
      row.className = 'mp-member-item';
      row.setAttribute('data-member-id', mem.playFabId);

      const avatar = document.createElement('div');
      avatar.className = 'mp-member-avatar';
      if (mem.avatarUrl && (mem.avatarUrl.startsWith('http://') || mem.avatarUrl.startsWith('https://') || mem.avatarUrl.startsWith('data:image/'))) {
        avatar.innerHTML = `<img src="${this.escapeHtml(mem.avatarUrl)}" class="mp-avatar-img" alt="" onerror="this.style.display='none'" /><span class="mp-status-indicator status-${mem.presence || 'online'}"></span>`;
      } else {
        avatar.innerHTML = `<span>${(mem.displayName || 'U').charAt(0).toUpperCase()}</span><span class="mp-status-indicator status-${mem.presence || 'online'}"></span>`;
      }

      const info = document.createElement('div');
      info.className = 'mp-member-info';

      const topRow = document.createElement('div');
      topRow.className = 'mp-member-top';

      const name = document.createElement('span');
      name.className = 'mp-member-name';
      name.textContent = mem.displayName || 'User';
      topRow.appendChild(name);

      if (mem.appRank && !mem.appRank.hidden) {
        const badge = document.createElement('span');
        badge.className = 'mp-rank-badge';
        badge.textContent = mem.appRank.name;
        if (mem.appRank.color) {
          badge.style.borderColor = mem.appRank.color;
          badge.style.color = mem.appRank.color;
        }
        topRow.appendChild(badge);
      }

      const user = document.createElement('span');
      user.className = 'mp-member-username';
      user.textContent = mem.username ? `@${mem.username}` : (mem.playFabId === currentUserId ? 'You' : '');

      info.appendChild(topRow);
      if (user.textContent) info.appendChild(user);

      row.appendChild(avatar);
      row.appendChild(info);

      if (mem.playFabId !== currentUserId) {
        row.style.cursor = 'pointer';
        row.title = `Message ${mem.displayName}`;
        row.addEventListener('click', () => {
          soundSynth.playClick();
          appState.setActiveDM({
            dmId: `dm_${mem.playFabId}`,
            partnerId: mem.playFabId,
            partnerName: mem.displayName,
            partnerUsername: mem.username
          });
        });
      }

      group.appendChild(row);

      if (!this.userCache.has(mem.playFabId) && mem.playFabId) {
        playFabService.resolveUser(mem.playFabId).then(resolved => {
          if (resolved) {
            this.userCache.set(mem.playFabId, resolved);
            const rowEl = contentEl.querySelector(`[data-member-id="${mem.playFabId}"]`);
            if (rowEl) {
              const nEl = rowEl.querySelector('.mp-member-name');
              const uEl = rowEl.querySelector('.mp-member-username');
              const aEl = rowEl.querySelector('.mp-member-avatar');
              if (nEl) nEl.textContent = resolved.displayName || 'User';
              if (uEl && resolved.username) uEl.textContent = `@${resolved.username}`;
              if (aEl) {
                if (resolved.avatarUrl && (resolved.avatarUrl.startsWith('http://') || resolved.avatarUrl.startsWith('https://') || resolved.avatarUrl.startsWith('data:image/'))) {
                  aEl.innerHTML = `<img src="${this.escapeHtml(resolved.avatarUrl)}" class="mp-avatar-img" alt="" onerror="this.style.display='none'" /><span class="mp-status-indicator status-${resolved.presence || 'online'}"></span>`;
                }
              }
            }
          }
        });
      }
    });

    contentEl.appendChild(group);
  }

  async handleSend() {
    if (this.isSubmitting) return;
    if (!playFabService.isAuthenticated()) {
      this.onOpenAuth();
      return;
    }

    const input = document.getElementById('mp-composer-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    this.isSubmitting = true;
    const target = appState.getTargetParam();
    const reply = appState.getState().replyingTo;

    try {
      soundSynth.playSent();
      input.value = '';
      appState.clearReplyingTo();

      await playFabService.sendMessage(target, text, reply);
      pollingEngine.pollNow();
    } catch (err) {
      alert(err.message || 'Failed to send message');
      input.value = text;
    } finally {
      this.isSubmitting = false;
      input.focus();
    }
  }

  async handleFileUpload(files) {
    if (!files || files.length === 0) return;
    if (!playFabService.isAuthenticated()) {
      this.onOpenAuth();
      return;
    }

    const validFiles = [];
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) {
        alert(`"${f.name}" exceeds the 10MB limit and was skipped.`);
      } else {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) return;

    const progressBox = document.getElementById('mp-upload-progress');
    const statusText = document.getElementById('mp-upload-status');
    const fileInput = document.getElementById('mp-file-input');
    const sendBtn = document.getElementById('mp-send-btn');

    if (progressBox) progressBox.style.display = 'flex';
    if (sendBtn) sendBtn.disabled = true;

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const prefix = validFiles.length > 1 ? `(${i + 1}/${validFiles.length}) ` : '';
        if (statusText) {
          statusText.textContent = `Uploading ${prefix}${file.name || 'file'}...`;
        }

        const uploadRes = await playFabService.uploadFile(file, (currentChunk, totalChunks) => {
          if (statusText) {
            statusText.textContent = `Uploading ${prefix}${file.name || 'file'}... (${currentChunk}/${totalChunks})`;
          }
        });

        if (uploadRes && uploadRes.success && uploadRes.fileId) {
          const fileMsg = `pulse://file/${uploadRes.fileId}?name=${encodeURIComponent(uploadRes.fileName || file.name || 'file')}&size=${uploadRes.fileSize || file.size}&type=${encodeURIComponent(uploadRes.fileType || file.type || 'application/octet-stream')}`;
          const target = appState.getTargetParam();
          const reply = appState.getState().replyingTo;
          soundSynth.playSent();
          appState.clearReplyingTo();
          await playFabService.sendMessage(target, fileMsg, reply);
          pollingEngine.pollNow();
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to upload file');
    } finally {
      if (progressBox) progressBox.style.display = 'none';
      if (sendBtn) sendBtn.disabled = false;
      if (fileInput) fileInput.value = '';
    }
  }

  scrollToBottom() {
    const feed = document.getElementById('mp-messages-feed');
    if (feed) {
      feed.scrollTop = feed.scrollHeight;
    }
  }

  formatTime(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  formatMessageText(rawText) {
    if (!rawText) return '';
    const trimmed = rawText.trim();
    const isOnlyMediaUrl = /^(https?:\/\/[^\s<]+)$/i.test(trimmed) && 
      (/\.(jpeg|jpg|gif|png|webp|avif)($|\?)/i.test(trimmed) || /klipy\.com|giphy\.com|tenor\.com/i.test(trimmed));

    if (isOnlyMediaUrl) {
      const url = this.escapeHtml(trimmed);
      return `<div class="mp-media-embed"><img src="${url}" class="mp-embed-img" loading="lazy" alt="" onerror="this.parentElement.style.display='none'" /></div>`;
    }

    let escaped = this.escapeHtml(rawText);

    const fileRegex = /pulse:\/\/file\/(file_[0-9]+_[0-9]+)(?:\?([^\s<>"'`]+))?/gi;
    let fileMatch;
    const handledFiles = new Set();
    const fileEmbeds = [];

    while ((fileMatch = fileRegex.exec(rawText)) !== null) {
      const fullMatch = fileMatch[0];
      const fId = fileMatch[1];
      const queryStr = fileMatch[2] || '';

      escaped = escaped.replace(this.escapeHtml(fullMatch), '').trim();

      if (!handledFiles.has(fId)) {
        handledFiles.add(fId);
        let fName = 'File Attachment';
        let fSize = 0;
        let fType = 'application/octet-stream';

        if (queryStr) {
          try {
            const params = new URLSearchParams(queryStr);
            if (params.get('name')) fName = decodeURIComponent(params.get('name'));
            if (params.get('size')) fSize = parseInt(params.get('size'), 10) || 0;
            if (params.get('type')) fType = decodeURIComponent(params.get('type'));
          } catch {}
        }

        let sizeFormatted = '';
        if (fSize > 0) {
          if (fSize >= 1024 * 1024) sizeFormatted = (fSize / (1024 * 1024)).toFixed(1) + ' MB';
          else sizeFormatted = Math.max(1, Math.round(fSize / 1024)) + ' KB';
        }

        const isVideo = fType.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(fName);
        const isAudio = !isVideo && (fType.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i.test(fName));
        const isImage = !isVideo && !isAudio && (fType.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fName));
        const cachedFile = playFabService.getCachedFile(fId);

        let iconSvg = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        `;
        if (isVideo) {
          iconSvg = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          `;
        } else if (isAudio) {
          iconSvg = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          `;
        } else if (isImage) {
          iconSvg = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          `;
        }

        fileEmbeds.push(`
          <div class="discord-file-embed" data-file-id="${this.escapeHtml(fId)}" data-file-type="${isVideo ? 'video' : (isAudio ? 'audio' : (isImage ? 'image' : 'file'))}">
            <div class="discord-file-content">
              <div class="discord-file-icon">
                ${iconSvg}
              </div>
              <div class="discord-file-info">
                <span class="discord-file-name" title="${this.escapeHtml(fName)}">${this.escapeHtml(fName)}</span>
                ${sizeFormatted ? `<span class="discord-file-size">${sizeFormatted}</span>` : ''}
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                ${isAudio ? `
                  <button type="button" class="btn-play-media" data-file-id="${this.escapeHtml(fId)}" data-file-type="audio">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <span>Play</span>
                  </button>
                ` : ''}
                <button type="button" class="btn-download-file" data-file-id="${this.escapeHtml(fId)}" data-file-name="${this.escapeHtml(fName)}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
            ${isImage ? `
              <div class="file-image-preview" data-file-id="${this.escapeHtml(fId)}" style="${cachedFile && cachedFile.data ? 'display: block;' : 'display: none;'}">
                <img src="${cachedFile && cachedFile.data ? this.escapeHtml(cachedFile.data) : ''}" alt="${this.escapeHtml(fName)}" />
              </div>
            ` : ''}
            ${isVideo ? `
              <div class="file-video-preview" data-file-id="${this.escapeHtml(fId)}" style="display: block;">
                <video controls preload="metadata" src="${cachedFile && cachedFile.data ? this.escapeHtml(cachedFile.data) : ''}"></video>
              </div>
            ` : ''}
            ${isAudio ? `
              <div class="file-audio-preview" data-file-id="${this.escapeHtml(fId)}" style="${cachedFile && cachedFile.data ? 'display: block;' : 'display: none;'}">
                <audio controls preload="none" src="${cachedFile && cachedFile.data ? this.escapeHtml(cachedFile.data) : ''}"></audio>
              </div>
            ` : ''}
          </div>
        `);
      }
    }

    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
      if (url.match(/\.(jpeg|jpg|gif|png|webp|avif)($|\?)/i) || url.match(/klipy\.com|giphy\.com|tenor\.com/i)) {
        return `<div class="mp-media-embed"><img src="${url}" class="mp-embed-img" loading="lazy" alt="" onerror="this.parentElement.style.display='none'" /></div>`;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="mp-link">${url}</a>`;
    });

    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="mp-inline-code">$1</code>');

    if (fileEmbeds.length > 0) {
      escaped = (escaped ? `${escaped}<br/>` : '') + fileEmbeds.join('');
    }

    return escaped;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
