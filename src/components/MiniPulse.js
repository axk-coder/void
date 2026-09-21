import { appState } from '../services/state.js';
import { playFabService } from '../services/playfab.js';
import { pollingEngine } from '../services/pollingEngine.js';
import { soundSynth } from '../services/soundEffects.js';

export class MiniPulse {
  constructor(container, options = {}) {
    this.container = container;
    this.onOpenAuth = options.onOpenAuth || (() => {});
    this.activeTab = 'chat';
    this.userCache = new Map();
    this.isScrolledToBottom = true;
    this.isSubmitting = false;

    this.render();
    this.bindEvents();
    this.subscribeState();
  }

  render() {
    this.container.innerHTML = `
      <div class="mini-pulse-pill" id="mini-pulse-pill" title="Toggle Pulse Chat">
        <div class="mini-pulse-pill-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="mini-pulse-badge" id="mini-pulse-badge" style="display: none;">0</span>
        </div>
        <span class="mini-pulse-pill-text">Pulse</span>
      </div>

      <div class="mini-pulse-panel" id="mini-pulse-panel" style="display: none;">
        <div class="mini-pulse-header">
          <div class="mini-pulse-header-left">
            <div class="mini-pulse-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="mini-pulse-title-wrap">
              <span class="mini-pulse-title" id="mp-header-title">Pulse Global</span>
              <span class="mini-pulse-net-dot dot-live" id="mp-net-dot" title="Network Live"></span>
            </div>
          </div>

          <div class="mini-pulse-nav-tabs">
            <button type="button" class="mp-tab-btn active" data-tab="chat" title="Chat Stream">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button type="button" class="mp-tab-btn" data-tab="channels" title="Channels & DMs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
            <button type="button" class="mp-tab-btn" data-tab="friends" title="Friends & Users">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </button>
          </div>

          <div class="mini-pulse-header-actions">
            <button type="button" class="mp-icon-btn" id="mp-dock-btn" title="Dock to Side">
              <svg id="mp-dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
            <button type="button" class="mp-icon-btn" id="mp-close-btn" title="Minimize">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="mini-pulse-body">
          <div class="mp-tab-view" id="mp-view-chat">
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
          </div>

          <div class="mp-tab-view" id="mp-view-channels" style="display: none;">
            <div class="mp-channels-container">
              <div class="mp-channel-section">
                <div class="mp-section-title">Streams</div>
                <div class="mp-channel-item active" data-context="global">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                  <span>Global Stream</span>
                </div>
              </div>

              <div class="mp-channel-section">
                <div class="mp-section-title">Direct Messages</div>
                <div class="mp-dm-list" id="mp-dm-list">
                  <div class="mp-empty-note">No recent direct messages.</div>
                </div>
              </div>

              <div class="mp-channel-section">
                <div class="mp-section-title">Servers</div>
                <div class="mp-server-list" id="mp-server-list">
                  <div class="mp-empty-note">No servers joined.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mp-tab-view" id="mp-view-friends" style="display: none;">
            <div class="mp-friends-container">
              <div class="mp-add-friend-box">
                <input type="text" id="mp-friend-input" class="mp-search-input" placeholder="Add friend by username..." />
                <button type="button" class="mp-btn-action" id="mp-add-friend-btn">Add</button>
              </div>
              <div class="mp-section-title">Friends List</div>
              <div class="mp-friends-list" id="mp-friends-list">
                <div class="mp-empty-note">No friends added yet.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const pill = document.getElementById('mini-pulse-pill');
    pill?.addEventListener('click', () => {
      soundSynth.playClick();
      appState.toggleMiniPulse();
    });

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

    const tabBtns = this.container.querySelectorAll('.mp-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        soundSynth.playClick();
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
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

    const globalItem = this.container.querySelector('[data-context="global"]');
    globalItem?.addEventListener('click', () => {
      soundSynth.playClick();
      appState.setGlobalChat();
      this.switchTab('chat');
    });

    const addFriendBtn = document.getElementById('mp-add-friend-btn');
    const friendInput = document.getElementById('mp-friend-input');
    addFriendBtn?.addEventListener('click', async () => {
      const username = (friendInput?.value || '').trim();
      if (!username) return;
      try {
        await playFabService.addFriend(username);
        if (friendInput) friendInput.value = '';
        pollingEngine.pollMeta();
      } catch (err) {
        alert(err.message || 'Failed to send request');
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
      if (key === 'unreadCount') {
        this.updateBadge();
      }
      if (key === 'user') {
        this.updateAuthGate();
        if (state.user) {
          pollingEngine.start();
        }
      }
      if (key === 'messages' || key === 'navigation' || key === 'channel') {
        this.renderMessages();
        this.updateHeaderTitle();
      }
      if (key === 'reply') {
        this.updateReplyBar();
      }
      if (key === 'dms' || key === 'servers') {
        this.renderChannels();
      }
      if (key === 'friends') {
        this.renderFriends();
      }
      if (key === 'network') {
        this.updateNetworkDot();
      }
    });

    this.updateVisibility();
    this.updateBadge();
    this.updateAuthGate();
    this.renderMessages();
    this.renderChannels();
    this.renderFriends();
    this.updateHeaderTitle();
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    const tabBtns = this.container.querySelectorAll('.mp-tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    const views = {
      chat: document.getElementById('mp-view-chat'),
      channels: document.getElementById('mp-view-channels'),
      friends: document.getElementById('mp-view-friends')
    };

    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].style.display = (k === tabName) ? 'flex' : 'none';
      }
    });

    if (tabName === 'chat') {
      this.scrollToBottom();
    }
  }

  updateVisibility() {
    const state = appState.getState();
    const panel = document.getElementById('mini-pulse-panel');
    const pill = document.getElementById('mini-pulse-pill');
    const voidLayout = document.querySelector('.void-layout');

    if (!panel || !pill) return;

    if (state.miniPulseOpen) {
      panel.style.display = 'flex';
      pill.classList.add('active');
      if (state.miniPulseDocked) {
        panel.classList.add('docked');
        if (voidLayout) voidLayout.classList.add('with-docked-pulse');
      } else {
        panel.classList.remove('docked');
        if (voidLayout) voidLayout.classList.remove('with-docked-pulse');
      }
      this.scrollToBottom();
    } else {
      panel.style.display = 'none';
      panel.classList.remove('docked');
      pill.classList.remove('active');
      if (voidLayout) voidLayout.classList.remove('with-docked-pulse');
    }
  }

  updateBadge() {
    const state = appState.getState();
    const badge = document.getElementById('mini-pulse-badge');
    if (!badge) return;

    if (state.unreadCount > 0 && !state.miniPulseOpen) {
      badge.textContent = state.unreadCount > 99 ? '99+' : state.unreadCount;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
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

  updateHeaderTitle() {
    const state = appState.getState();
    const titleEl = document.getElementById('mp-header-title');
    if (!titleEl) return;

    if (state.activeContext === 'global') {
      titleEl.textContent = 'Pulse Global';
    } else if (state.activeContext === 'dm' && state.activeDM) {
      titleEl.textContent = `DM: ${state.activeDM.partnerName || state.activeDM.partnerUsername || 'Direct Message'}`;
    } else if (state.activeContext === 'server' && state.activeServer) {
      titleEl.textContent = `${state.activeServer.name || 'Server'} #${state.activeChannelId || 'chat'}`;
    } else {
      titleEl.textContent = 'Pulse Chat';
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

  async renderMessages() {
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

    for (const msg of messages) {
      const row = document.createElement('div');
      row.className = 'mp-message-row';
      if (msg.senderId === currentUserId) {
        row.classList.add('mp-msg-mine');
      }

      const sender = await this.resolveSender(msg.senderId);

      const avatar = document.createElement('div');
      avatar.className = 'mp-msg-avatar';
      if (sender.avatarUrl && (sender.avatarUrl.startsWith('http://') || sender.avatarUrl.startsWith('https://') || sender.avatarUrl.startsWith('data:image/'))) {
        avatar.innerHTML = `<img src="${this.escapeHtml(sender.avatarUrl)}" class="mp-avatar-img" alt="" onerror="this.style.display='none'" />`;
      } else {
        avatar.textContent = (sender.displayName || 'U').charAt(0).toUpperCase();
      }

      const content = document.createElement('div');
      content.className = 'mp-msg-content';

      const meta = document.createElement('div');
      meta.className = 'mp-msg-meta';

      const name = document.createElement('span');
      name.className = 'mp-msg-name';
      name.textContent = sender.displayName || 'Member';

      if (sender.appRank && !sender.appRank.hidden) {
        const badge = document.createElement('span');
        badge.className = 'mp-rank-badge';
        badge.textContent = sender.appRank.name;
        if (sender.appRank.color) {
          badge.style.borderColor = sender.appRank.color;
          badge.style.color = sender.appRank.color;
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
    }

    if (this.isScrolledToBottom) {
      this.scrollToBottom();
    }
  }

  async resolveSender(senderId) {
    if (!senderId) return { displayName: 'Member', avatarUrl: '', appRank: null };
    if (this.userCache.has(senderId)) {
      return this.userCache.get(senderId);
    }
    const current = playFabService.getCurrentUser();
    if (current && current.playFabId === senderId) {
      this.userCache.set(senderId, current);
      return current;
    }
    try {
      const resolved = await playFabService.resolveUser(senderId);
      this.userCache.set(senderId, resolved);
      return resolved;
    } catch {
      return { displayName: 'Member', avatarUrl: '', appRank: null };
    }
  }

  renderChannels() {
    const dmList = document.getElementById('mp-dm-list');
    const srvList = document.getElementById('mp-server-list');
    const dms = appState.getState().dms || [];
    const servers = appState.getState().servers || [];

    if (dmList) {
      dmList.innerHTML = '';
      if (dms.length === 0) {
        dmList.innerHTML = '<div class="mp-empty-note">No recent direct messages.</div>';
      } else {
        dms.forEach(dm => {
          const item = document.createElement('div');
          item.className = 'mp-channel-item';
          item.innerHTML = `
            <div class="mp-channel-avatar">${(dm.partnerName || 'U').charAt(0).toUpperCase()}</div>
            <span>${this.escapeHtml(dm.partnerName || dm.partnerUsername || 'Direct Message')}</span>
          `;
          item.addEventListener('click', () => {
            soundSynth.playClick();
            appState.setActiveDM(dm);
            this.switchTab('chat');
          });
          dmList.appendChild(item);
        });
      }
    }

    if (srvList) {
      srvList.innerHTML = '';
      if (servers.length === 0) {
        srvList.innerHTML = '<div class="mp-empty-note">No servers joined.</div>';
      } else {
        servers.forEach(srv => {
          const item = document.createElement('div');
          item.className = 'mp-channel-item';
          item.innerHTML = `
            <div class="mp-channel-avatar">${(srv.name || 'S').charAt(0).toUpperCase()}</div>
            <span>${this.escapeHtml(srv.name || 'Server')}</span>
          `;
          item.addEventListener('click', () => {
            soundSynth.playClick();
            appState.setActiveServer(srv);
            this.switchTab('chat');
          });
          srvList.appendChild(item);
        });
      }
    }
  }

  renderFriends() {
    const list = document.getElementById('mp-friends-list');
    if (!list) return;
    const friends = appState.getState().friends || [];

    list.innerHTML = '';
    if (friends.length === 0) {
      list.innerHTML = '<div class="mp-empty-note">No friends added yet.</div>';
      return;
    }

    friends.forEach(f => {
      const item = document.createElement('div');
      item.className = 'mp-friend-item';
      item.innerHTML = `
        <div class="mp-friend-left">
          <div class="mp-friend-avatar">${(f.displayName || 'F').charAt(0).toUpperCase()}</div>
          <div class="mp-friend-info">
            <span class="mp-friend-name">${this.escapeHtml(f.displayName || 'Friend')}</span>
            <span class="mp-friend-user">@${this.escapeHtml(f.username || 'user')}</span>
          </div>
        </div>
        <div class="mp-friend-actions">
          <button type="button" class="mp-action-btn mp-btn-dm" title="Message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      `;

      const dmBtn = item.querySelector('.mp-btn-dm');
      dmBtn?.addEventListener('click', async () => {
        soundSynth.playClick();
        try {
          const res = await playFabService.createOrGetDM(f.playFabId);
          if (res && res.success && res.dm) {
            appState.setActiveDM(res.dm);
            this.switchTab('chat');
          }
        } catch (err) {
          alert(err.message || 'Could not open DM');
        }
      });

      list.appendChild(item);
    });
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
