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
    this.isSubpanelOpen = true;
    this.isScrolledToBottom = true;
    this.isSubmitting = false;

    this.render();
    this.bindEvents();
    this.setupDraggable();
    this.subscribeState();
  }

  render() {
    this.container.innerHTML = `
      <div class="mini-pulse-panel" id="mini-pulse-panel" style="display: none;">
        <div class="mini-pulse-header" id="mini-pulse-header">
          <div class="mini-pulse-header-left">
            <button type="button" class="mp-icon-btn" id="mp-toggle-subpanel-btn" title="Toggle Sidebar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
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

          <main class="mp-chat-column">
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

              <div class="mp-composer-box">
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
        </div>
      </div>
    `;
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
      if (e.target.closest('button') || e.target.closest('input')) {
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
    });

    const toggleSubpanelBtn = document.getElementById('mp-toggle-subpanel-btn');
    toggleSubpanelBtn?.addEventListener('click', () => {
      soundSynth.playClick();
      this.isSubpanelOpen = !this.isSubpanelOpen;
      const sub = document.getElementById('mp-subpanel');
      if (sub) {
        sub.classList.toggle('collapsed', !this.isSubpanelOpen);
      }
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
      }
      if (key === 'messages') {
        this.renderMessages();
      }
      if (key === 'navigation' || key === 'channel' || key === 'servers' || key === 'dms') {
        this.updateRail();
        this.updateSubpanel();
        this.updateHeaderTitle();
        this.renderMessages();
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

    if (this.isScrolledToBottom) {
      this.scrollToBottom();
    }
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
    let escaped = this.escapeHtml(rawText);

    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
      if (url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i)) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="mp-link">${url}</a><div class="mp-media-embed"><img src="${url}" class="mp-embed-img" loading="lazy" alt="" onerror="this.parentElement.style.display='none'" /></div>`;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="mp-link">${url}</a>`;
    });

    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="mp-inline-code">$1</code>');

    return escaped;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
