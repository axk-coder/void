import { messageCache } from './messageCache.js';

class AppState {
  constructor() {
    this.listeners = new Set();
    this.state = {
      theme: localStorage.getItem('pulse_theme') || 'onyx',
      user: null,
      cloak: 'none',
      panicKey: '`',
      panicUrl: 'https://google.com',
      soundEnabled: localStorage.getItem('pulse_sound_enabled') !== 'false',
      searchQuery: '',
      activeCategory: 'all',
      activeSort: 'name-asc',
      activeGame: null,
      
      activeContext: 'global',
      activeServerId: null,
      activeServer: null,
      activeChannelId: 'chat',
      activeDM: null,
      replyingTo: null,
      messages: {},
      servers: [],
      dms: [],
      friends: [],
      userProfiles: {},
      network: {
        status: 'live',
        latencyMs: 0,
        lastPoll: null,
        error: null,
        isIdle: false
      },
      cloudScriptPending: false,
      miniPulseOpen: false,
      miniPulseDocked: false,
      unreadCount: 0
    };

    this.restoreLastContext();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(key) {
    this.listeners.forEach(fn => fn(this.state, key));
  }

  setTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem('pulse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify('theme');
  }

  setUser(user) {
    this.state.user = user;
    this.notify('user');
  }

  setCloak(cloak) {
    this.state.cloak = cloak;
    this.notify('cloak');
  }

  setPanicSettings(panicKey, panicUrl) {
    this.state.panicKey = panicKey;
    this.state.panicUrl = panicUrl;
    this.notify('panic');
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify('search');
  }

  setActiveCategory(category) {
    this.state.activeCategory = category;
    this.notify('category');
  }

  setActiveSort(sort) {
    this.state.activeSort = sort;
    this.notify('sort');
  }

  setActiveGame(game) {
    this.state.activeGame = game;
    this.notify('game');
  }

  setMiniPulseOpen(open) {
    this.state.miniPulseOpen = Boolean(open);
    if (this.state.miniPulseOpen) {
      this.state.unreadCount = 0;
    }
    this.notify('miniPulseOpen');
  }

  toggleMiniPulse() {
    this.setMiniPulseOpen(!this.state.miniPulseOpen);
  }

  setMiniPulseDocked(docked) {
    this.state.miniPulseDocked = Boolean(docked);
    this.notify('miniPulseDocked');
  }

  incrementUnread() {
    if (!this.state.miniPulseOpen) {
      this.state.unreadCount++;
      this.notify('unreadCount');
    }
  }

  getCurrentUserId() {
    try {
      return localStorage.getItem('pulse_playfab_id') || (this.state.user && this.state.user.playFabId) || '';
    } catch {
      return '';
    }
  }

  getStreamKey() {
    if (this.state.activeContext === 'global') {
      return 'global_chat';
    }
    if (this.state.activeContext === 'dm' && this.state.activeDM) {
      if (this.state.activeDM.dmId) {
        return this.state.activeDM.dmId;
      }
      const myId = this.getCurrentUserId();
      if (myId && this.state.activeDM.partnerId) {
        const p = this.state.activeDM.partnerId;
        return (myId < p) ? `dm_${myId}_${p}` : `dm_${p}_${myId}`;
      }
      return 'dm_default';
    }
    if (this.state.activeContext === 'server' && this.state.activeServerId) {
      const ch = this.state.activeChannelId || 'chat';
      return `srv_${this.state.activeServerId}_${ch}`;
    }
    return 'none';
  }

  getTargetParam() {
    if (this.state.activeContext === 'global') {
      return { isGlobal: true };
    }
    if (this.state.activeContext === 'dm' && this.state.activeDM) {
      const myId = this.getCurrentUserId();
      let dId = this.state.activeDM.dmId;
      if (!dId && myId && this.state.activeDM.partnerId) {
        const p = this.state.activeDM.partnerId;
        dId = (myId < p) ? `dm_${myId}_${p}` : `dm_${p}_${myId}`;
      }
      return {
        dmId: dId,
        partnerId: this.state.activeDM.partnerId,
        isGroup: !!this.state.activeDM.isGroup
      };
    }
    if (this.state.activeContext === 'server' && this.state.activeServerId) {
      return {
        serverId: this.state.activeServerId,
        channelId: this.state.activeChannelId || 'chat'
      };
    }
    return { isGlobal: true };
  }

  hydrateStreamMessages(streamKey) {
    if (!streamKey || streamKey === 'none') return;
    if (!this.state.messages[streamKey] || this.state.messages[streamKey].length === 0) {
      const cached = messageCache.getCachedMessages(streamKey);
      if (cached && cached.length > 0) {
        this.state.messages[streamKey] = cached;
        this.notify('messages');
      }
    }
  }

  persistActiveContext() {
    try {
      const payload = {
        activeContext: this.state.activeContext,
        activeServerId: this.state.activeServerId,
        activeChannelId: this.state.activeChannelId,
        activeDM: this.state.activeDM
      };
      localStorage.setItem('pulse_last_context', JSON.stringify(payload));
    } catch {}
  }

  restoreLastContext() {
    try {
      const raw = localStorage.getItem('pulse_last_context');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.activeContext) return false;

      if (data.activeContext === 'global') {
        this.setGlobalChat();
        return true;
      } else if (data.activeContext === 'dm' && data.activeDM) {
        this.setActiveDM(data.activeDM);
        return true;
      } else if (data.activeContext === 'server' && data.activeServerId) {
        this.state.activeContext = 'server';
        this.state.activeServerId = data.activeServerId;
        this.state.activeChannelId = data.activeChannelId || 'chat';
        this.state.activeDM = null;
        this.hydrateStreamMessages(this.getStreamKey());
        this.notify('navigation');
        return true;
      }
    } catch {}
    return false;
  }

  setGlobalChat() {
    this.state.activeContext = 'global';
    this.state.activeServerId = null;
    this.state.activeServer = null;
    this.state.activeChannelId = null;
    this.state.activeDM = null;
    this.hydrateStreamMessages(this.getStreamKey());
    this.persistActiveContext();
    this.notify('navigation');
  }

  setActiveServer(server) {
    this.state.activeContext = 'server';
    this.state.activeServer = server;
    this.state.activeServerId = server ? (server.id || server.serverId) : null;
    this.state.activeDM = null;

    if (server && Array.isArray(server.channels) && server.channels.length > 0) {
      const exists = server.channels.some(c => c.id === this.state.activeChannelId);
      if (!exists) {
        this.state.activeChannelId = server.channels[0].id;
      }
    } else if (!this.state.activeChannelId) {
      this.state.activeChannelId = 'chat';
    }

    this.hydrateStreamMessages(this.getStreamKey());
    this.persistActiveContext();
    this.notify('navigation');
  }

  setActiveChannel(channelId) {
    this.state.activeChannelId = channelId;
    this.hydrateStreamMessages(this.getStreamKey());
    this.persistActiveContext();
    this.notify('channel');
  }

  setActiveDM(dm) {
    this.state.activeContext = 'dm';
    this.state.activeDM = dm;
    this.state.activeServerId = null;
    this.state.activeServer = null;
    this.state.activeChannelId = null;
    this.hydrateStreamMessages(this.getStreamKey());
    this.persistActiveContext();
    this.notify('navigation');
  }

  setReplyingTo(reply) {
    this.state.replyingTo = reply;
    this.notify('reply');
  }

  clearReplyingTo() {
    this.state.replyingTo = null;
    this.notify('reply');
  }

  setFriends(friends) {
    this.state.friends = Array.isArray(friends) ? friends : [];
    this.notify('friends');
  }

  setDMs(dms) {
    this.state.dms = Array.isArray(dms) ? dms : [];
    this.notify('dms');
  }

  setServers(servers) {
    this.state.servers = Array.isArray(servers) ? servers : [];
    this.notify('servers');
  }

  setMessages(streamKey, messages) {
    if (!Array.isArray(messages)) return;
    const sanitized = messages
      .filter(m => m && typeof m === 'object' && typeof m.text === 'string')
      .map(m => ({
        id: String(m.id || Date.now() + Math.random()),
        senderId: String(m.senderId || ''),
        text: String(m.text || '').slice(0, 2000),
        timestamp: m.timestamp || new Date().toISOString(),
        isEdited: !!m.isEdited,
        replyTo: (m.replyTo && typeof m.replyTo === 'object') ? {
          id: String(m.replyTo.id || ''),
          senderId: String(m.replyTo.senderId || ''),
          text: String(m.replyTo.text || '').slice(0, 200)
        } : null
      }));

    this.state.messages[streamKey] = sanitized;
    messageCache.setCachedMessages(streamKey, sanitized);
    this.notify('messages');
  }

  addMessage(streamKey, message) {
    if (!this.state.messages[streamKey]) {
      this.state.messages[streamKey] = [];
    }
    const cleanMsg = {
      id: String(message.id || Date.now() + Math.random()),
      senderId: String(message.senderId || ''),
      text: String(message.text || '').slice(0, 2000),
      timestamp: message.timestamp || new Date().toISOString(),
      isEdited: !!message.isEdited,
      replyTo: (message.replyTo && typeof message.replyTo === 'object') ? {
        id: String(message.replyTo.id || ''),
        senderId: String(message.replyTo.senderId || ''),
        text: String(message.replyTo.text || '').slice(0, 200)
      } : null
    };

    const exists = this.state.messages[streamKey].some((m) => m.id === cleanMsg.id);
    if (!exists) {
      this.state.messages[streamKey].push(cleanMsg);
      messageCache.setCachedMessages(streamKey, this.state.messages[streamKey]);
      this.notify('messages');
    }
  }

  setNetworkStatus(updates) {
    Object.assign(this.state.network, updates);
    this.notify('network');
  }

  setCloudScriptPending(pending) {
    const isPending = Boolean(pending);
    if (this.state.cloudScriptPending !== isPending) {
      this.state.cloudScriptPending = isPending;
      this.notify('cloudScriptPending');
    }
  }
}

export const appState = new AppState();
