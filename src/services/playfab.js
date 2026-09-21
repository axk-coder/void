import { appState } from './state.js';

export const PLAYFAB_TITLE_ID = "133616";
const PLAYFAB_API_BASE = `https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client`;

function setCookie(name, value, days = 365) {
  try {
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
  } catch {}
}

function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch {
    return null;
  }
}

function deleteCookie(name) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  } catch {}
}

class PlayFabService {
  constructor() {
    this.sessionTicket = localStorage.getItem("pulse_session_ticket") || getCookie("pulse_session_ticket") || getCookie("axk_auth_ticket") || null;
    this.playFabId = localStorage.getItem("pulse_playfab_id") || getCookie("pulse_playfab_id") || null;
    this.currentUser = null;
    this.userCache = new Map();
    this.serverCache = new Map();
    this.lastSendTimestamp = 0;
    this.pendingRequests = 0;
    this.onSessionExpired = null;

    const storedUser = localStorage.getItem("pulse_user") || getCookie("pulse_user") || getCookie("axk_auth_user");
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch {
        this.currentUser = null;
      }
    }

    if (!this.sessionTicket || !this.currentUser) {
      const sharedSessionRaw = getCookie("axk_auth_session") || getCookie("pulse_shared_auth");
      if (sharedSessionRaw) {
        try {
          const parsed = JSON.parse(sharedSessionRaw);
          if (parsed && parsed.sessionTicket) {
            this.sessionTicket = parsed.sessionTicket;
            this.playFabId = parsed.playFabId || this.playFabId;
            this.currentUser = parsed.user || this.currentUser;
            if (this.sessionTicket) localStorage.setItem("pulse_session_ticket", this.sessionTicket);
            if (this.playFabId) localStorage.setItem("pulse_playfab_id", this.playFabId);
            if (this.currentUser) localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));
          }
        } catch {}
      }
    }

    if (this.currentUser) {
      appState.setUser(this.currentUser);
    }
  }

  isAuthenticated() {
    return !!(this.sessionTicket && this.currentUser);
  }

  getSessionTicket() {
    return this.sessionTicket;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  saveSession(sessionTicket, playFabId, userProfile) {
    this.sessionTicket = String(sessionTicket || "").trim();
    this.playFabId = String(playFabId || "").trim();
    this.currentUser = {
      playFabId: this.playFabId,
      username: String(userProfile.username || "").trim().slice(0, 32),
      displayName: String(userProfile.displayName || userProfile.username || "User").trim().slice(0, 32),
      email: String(userProfile.email || "").trim().slice(0, 100),
      avatarUrl: String(userProfile.avatarUrl || "").trim(),
      presence: String(userProfile.presence || "online").toLowerCase(),
      statusMessage: String(userProfile.statusMessage || "").slice(0, 128),
      appRank: userProfile.appRank || null
    };

    localStorage.setItem("pulse_session_ticket", this.sessionTicket);
    localStorage.setItem("pulse_playfab_id", this.playFabId);
    localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));

    setCookie("pulse_session_ticket", this.sessionTicket);
    setCookie("pulse_playfab_id", this.playFabId);
    setCookie("pulse_user", JSON.stringify(this.currentUser));
    setCookie("axk_auth_ticket", this.sessionTicket);
    setCookie("axk_auth_session", JSON.stringify({
      sessionTicket: this.sessionTicket,
      playFabId: this.playFabId,
      user: this.currentUser
    }));

    if (this.playFabId) {
      this.userCache.set(this.playFabId, {
        displayName: this.currentUser.displayName,
        username: this.currentUser.username || "",
        avatarUrl: this.currentUser.avatarUrl,
        presence: this.currentUser.presence,
        statusMessage: this.currentUser.statusMessage,
        appRank: this.currentUser.appRank,
        isFullProfile: true
      });
    }

    appState.setUser(this.currentUser);
  }

  clearSession() {
    this.sessionTicket = null;
    this.playFabId = null;
    this.currentUser = null;

    localStorage.removeItem("pulse_session_ticket");
    localStorage.removeItem("pulse_playfab_id");
    localStorage.removeItem("pulse_user");
    localStorage.removeItem("pulse_auth_store");

    deleteCookie("pulse_session_ticket");
    deleteCookie("pulse_playfab_id");
    deleteCookie("pulse_user");
    deleteCookie("pulse_auth_store");
    deleteCookie("axk_auth_ticket");
    deleteCookie("axk_auth_session");
    deleteCookie("axk_auth_store");
    deleteCookie("axk_auth_user");
    deleteCookie("pulse_shared_auth");

    appState.setUser(null);
  }

  saveCredentials(identifier, password) {
    try {
      const payload = JSON.stringify({
        identifier: String(identifier || "").trim(),
        password: String(password || "")
      });
      localStorage.setItem("pulse_auth_store", payload);
      setCookie("pulse_auth_store", payload);
      setCookie("axk_auth_store", payload);
    } catch {}
  }

  getSavedCredentials() {
    try {
      const raw = localStorage.getItem("pulse_auth_store") || getCookie("axk_auth_store") || getCookie("pulse_auth_store");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  async validateSession() {
    if (!this.sessionTicket) return false;
    try {
      const res = await this.post("GetAccountInfo", {}, true);
      return !!(res && res.AccountInfo);
    } catch {
      return false;
    }
  }

  async tryAutoLogin() {
    if (this.sessionTicket && this.currentUser) {
      try {
        const valid = await this.validateSession();
        if (valid) {
          await this.syncCurrentUserProfile();
          return true;
        }
      } catch {}
    }
    const creds = this.getSavedCredentials();
    if (creds && creds.identifier && creds.password) {
      try {
        await this.login(creds.identifier, creds.password);
        return true;
      } catch {}
    }
    return false;
  }

  async post(endpoint, payload, useAuth = false, attempt = 0) {
    const url = `${PLAYFAB_API_BASE}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-ReportErrorAsSuccess": "true"
    };

    if (useAuth && this.sessionTicket) {
      headers["X-Authentication"] = this.sessionTicket;
    }

    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
    } catch (networkErr) {
      if (attempt < 5) {
        await new Promise(r => setTimeout(r, Math.min(250 * Math.pow(2, attempt), 2000)));
        return await this.post(endpoint, payload, useAuth, attempt + 1);
      }
      throw networkErr;
    }

    if (!res.ok) {
      if ((res.status === 429 || res.status === 503 || res.status === 504) && attempt < 5) {
        await new Promise(r => setTimeout(r, Math.min(250 * Math.pow(2, attempt), 2000)));
        return await this.post(endpoint, payload, useAuth, attempt + 1);
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.code !== 200) {
      const errMessage = String(data.errorMessage || data.status || "PlayFab API Error");
      const errLower = errMessage.toLowerCase();
      const isRateLimit = data.code === 429 || data.code === 1199 || errLower.includes("rate limit") || errLower.includes("over limit") || errLower.includes("too many requests") || errLower.includes("throttle");

      if (isRateLimit && attempt < 5) {
        await new Promise(r => setTimeout(r, Math.min(250 * Math.pow(2, attempt), 2000)));
        return await this.post(endpoint, payload, useAuth, attempt + 1);
      }

      if (useAuth && attempt === 0 && (data.code === 401 || errLower.includes("ticket") || errLower.includes("authenticated") || errLower.includes("expired") || data.errorCode === 1074)) {
        const reauthed = await this.tryAutoLogin();
        if (reauthed) {
          return await this.post(endpoint, payload, useAuth, attempt + 1);
        }
        if (typeof this.onSessionExpired === 'function') {
          this.onSessionExpired();
        }
      }

      const errorObj = new Error(errMessage);
      errorObj.playFabData = data;
      throw errorObj;
    }

    return data.data;
  }

  async executeScript(functionName, functionParameter = {}, options = {}, attempt = 0) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    const isSilent = Boolean(options && options.silent);
    if (!isSilent && attempt === 0) {
      this.pendingRequests++;
      appState.setCloudScriptPending(true);
    }
    try {
      const payload = {
        FunctionName: functionName,
        FunctionParameter: functionParameter,
        GeneratePlayStreamEvent: false
      };
      const res = await this.post("ExecuteCloudScript", payload, true);
      if (res && res.FunctionResult) {
        if (typeof res.FunctionResult === 'object' && res.FunctionResult.error) {
          const errLower = String(res.FunctionResult.error).toLowerCase();
          if ((errLower.includes("rate limit") || errLower.includes("too many requests") || errLower.includes("429")) && attempt < 5) {
            await new Promise(r => setTimeout(r, Math.min(250 * Math.pow(2, attempt), 2000)));
            return await this.executeScript(functionName, functionParameter, options, attempt + 1);
          }
        }
        return res.FunctionResult;
      }
      return { success: false };
    } catch (err) {
      const errLower = String(err.message || "").toLowerCase();
      if ((errLower.includes("rate limit") || errLower.includes("too many requests") || errLower.includes("429")) && attempt < 5) {
        await new Promise(r => setTimeout(r, Math.min(250 * Math.pow(2, attempt), 2000)));
        return await this.executeScript(functionName, functionParameter, options, attempt + 1);
      }
      throw err;
    } finally {
      if (!isSilent && attempt === 0) {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);
        if (this.pendingRequests === 0) {
          appState.setCloudScriptPending(false);
        }
      }
    }
  }

  async syncCurrentUserProfile() {
    if (!this.sessionTicket || !this.currentUser) return;
    try {
      const data = await this.post("GetPlayerProfile", {
        PlayFabId: this.playFabId,
        ProfileConstraints: { ShowDisplayName: true, ShowAvatarUrl: true, ShowUsername: true }
      }, true);
      if (data && data.PlayerProfile) {
        const p = data.PlayerProfile;
        if (p.DisplayName) this.currentUser.displayName = p.DisplayName;
        if (p.AvatarUrl) this.currentUser.avatarUrl = p.AvatarUrl;
        if (p.Username) this.currentUser.username = p.Username;
      }
    } catch {}

    try {
      const readOnlyData = await this.post("GetUserReadOnlyData", {
        PlayFabId: this.playFabId,
        Keys: ["RankName", "RankColor", "RankPerms", "Rankhidden"]
      }, true);
      if (readOnlyData && readOnlyData.Data) {
        const d = readOnlyData.Data;
        const rName = d.RankName ? d.RankName.Value : "";
        const rColor = d.RankColor ? d.RankColor.Value : "";
        const rPermsRaw = d.RankPerms ? d.RankPerms.Value : "";
        const rHidden = d.Rankhidden ? (d.Rankhidden.Value === "true" || d.Rankhidden.Value === true) : false;
        let perms = {};
        if (rPermsRaw) {
          try { perms = JSON.parse(rPermsRaw); } catch {}
        }
        if (rName) {
          this.currentUser.appRank = {
            name: rName,
            color: rColor || "#ffffff",
            perms: perms,
            hidden: rHidden
          };
        }
      }
    } catch {}

    try {
      const cloudRes = await this.executeScript("getUserProfile", { userId: this.playFabId }, { silent: true });
      if (cloudRes && cloudRes.success && cloudRes.profile) {
        if (cloudRes.profile.displayName) this.currentUser.displayName = cloudRes.profile.displayName;
        if (cloudRes.profile.avatarUrl) this.currentUser.avatarUrl = cloudRes.profile.avatarUrl;
        if (cloudRes.profile.username) this.currentUser.username = cloudRes.profile.username;
        if (cloudRes.profile.presence) this.currentUser.presence = cloudRes.profile.presence;
        if (cloudRes.profile.statusMessage !== undefined) this.currentUser.statusMessage = cloudRes.profile.statusMessage;
        if (cloudRes.profile.appRank) this.currentUser.appRank = cloudRes.profile.appRank;
      }
    } catch {}

    localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));
    setCookie("pulse_user", JSON.stringify(this.currentUser));
    if (this.playFabId) {
      this.userCache.set(this.playFabId, {
        displayName: this.currentUser.displayName,
        username: this.currentUser.username || "",
        avatarUrl: this.currentUser.avatarUrl || "",
        presence: this.currentUser.presence || "online",
        statusMessage: this.currentUser.statusMessage || "",
        appRank: this.currentUser.appRank || null,
        isFullProfile: true
      });
    }
    appState.setUser(this.currentUser);
  }

  async login(identifier, password) {
    const isEmail = identifier.includes("@");
    const endpoint = isEmail ? "LoginWithEmailAddress" : "LoginWithPlayFab";
    const payload = {
      TitleId: PLAYFAB_TITLE_ID,
      Password: password,
      InfoRequestParameters: {
        GetPlayerProfile: true,
        ProfileConstraints: {
          ShowDisplayName: true,
          ShowAvatarUrl: true
        }
      }
    };

    if (isEmail) {
      payload.Email = identifier;
    } else {
      payload.Username = identifier;
    }

    const data = await this.post(endpoint, payload, false);
    let displayName = isEmail ? identifier.split("@")[0] : identifier;
    let avatarUrl = "";

    if (data.InfoResultPayload && data.InfoResultPayload.PlayerProfile) {
      if (data.InfoResultPayload.PlayerProfile.DisplayName) {
        displayName = data.InfoResultPayload.PlayerProfile.DisplayName;
      }
      if (data.InfoResultPayload.PlayerProfile.AvatarUrl) {
        avatarUrl = data.InfoResultPayload.PlayerProfile.AvatarUrl;
      }
    }

    this.saveSession(data.SessionTicket, data.PlayFabId, {
      username: isEmail ? identifier.split("@")[0] : identifier,
      displayName: displayName,
      email: isEmail ? identifier : "",
      avatarUrl: avatarUrl,
      presence: "online",
      statusMessage: ""
    });
    this.saveCredentials(identifier, password);

    await this.syncCurrentUserProfile();
    return this.currentUser;
  }

  async register(username, email, password, displayName) {
    const cleanUsername = String(username || "").trim().slice(0, 32);
    const cleanPassword = String(password || "");
    const cleanEmail = String(email || "").trim().slice(0, 100);
    const cleanDisplayName = String(displayName || cleanUsername).trim().slice(0, 32);

    const payload = {
      TitleId: PLAYFAB_TITLE_ID,
      Username: cleanUsername,
      Email: cleanEmail,
      Password: cleanPassword,
      DisplayName: cleanDisplayName,
      RequireBothUsernameAndEmail: true
    };

    const data = await this.post("RegisterPlayFabUser", payload, false);
    this.saveSession(data.SessionTicket, data.PlayFabId, {
      username: cleanUsername,
      displayName: cleanDisplayName,
      email: cleanEmail,
      avatarUrl: "",
      presence: "online",
      statusMessage: ""
    });
    this.saveCredentials(cleanUsername, cleanPassword);

    try {
      await this.updateDisplayName(cleanDisplayName);
    } catch {}

    await this.syncCurrentUserProfile();
    return this.currentUser;
  }

  async sendPasswordReset(email) {
    const payload = {
      TitleId: PLAYFAB_TITLE_ID,
      Email: email
    };
    return await this.post("SendAccountRecoveryEmail", payload, false);
  }

  async updateDisplayName(displayName) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    const cleanName = String(displayName || "").trim().slice(0, 32);
    if (!cleanName) throw new Error("Display name cannot be empty");

    let data = { DisplayName: cleanName };
    try {
      data = await this.post("UpdateUserTitleDisplayName", { DisplayName: cleanName }, true);
    } catch {}

    if (this.currentUser) {
      this.currentUser.displayName = data.DisplayName || cleanName;
      localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));
      appState.setUser(this.currentUser);
    }

    try {
      await this.executeScript("updateUserProfile", { displayName: cleanName });
    } catch {}

    return data;
  }

  async updatePresence(presence, statusMessage = "") {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    const cleanPresence = ['online', 'idle', 'dnd', 'offline'].includes(String(presence).toLowerCase()) 
      ? String(presence).toLowerCase() 
      : 'online';
    const cleanStatusMessage = String(statusMessage || "").slice(0, 128);

    if (this.currentUser) {
      this.currentUser.presence = cleanPresence;
      this.currentUser.statusMessage = cleanStatusMessage;
      localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));
      appState.setUser(this.currentUser);
    }

    try {
      await this.executeScript("updateUserProfile", { 
        presence: cleanPresence, 
        statusMessage: cleanStatusMessage 
      });
    } catch {}

    return { presence: cleanPresence, statusMessage: cleanStatusMessage };
  }

  async updateAvatarUrl(avatarUrl) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    const cleanUrl = String(avatarUrl || "").trim().slice(0, 150000);

    if (this.currentUser) {
      this.currentUser.avatarUrl = cleanUrl;
      localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));
      appState.setUser(this.currentUser);
    }

    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      try {
        await this.post("UpdateAvatarUrl", { ImageUrl: cleanUrl.slice(0, 500) }, true);
      } catch {}
    }

    try {
      await this.executeScript("updateUserProfile", { avatarUrl: cleanUrl });
    } catch {}

    return cleanUrl;
  }

  async uploadAvatar(file) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    if (!file) throw new Error("No image file provided");
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    const rawDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const compressedDataUrl = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const targetSize = Math.min(256, size);
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, targetSize, targetSize);
        let outUrl = '';
        try {
          outUrl = canvas.toDataURL('image/webp', 0.85);
        } catch {}
        if (!outUrl || !outUrl.startsWith('data:image/webp')) {
          try {
            outUrl = canvas.toDataURL('image/jpeg', 0.85);
          } catch {
            outUrl = rawDataUrl;
          }
        }
        resolve(outUrl);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    });

    return await this.updateAvatarUrl(compressedDataUrl);
  }

  async resolveUser(playFabId, force = false) {
    if (!playFabId) return { displayName: "User", username: "", avatarUrl: "", presence: "offline", statusMessage: "", appRank: null };
    if (this.currentUser && this.currentUser.playFabId === playFabId) {
      return {
        displayName: this.currentUser.displayName,
        username: this.currentUser.username || "",
        avatarUrl: this.currentUser.avatarUrl || "",
        presence: this.currentUser.presence || "online",
        statusMessage: this.currentUser.statusMessage || "",
        appRank: this.currentUser.appRank || null,
        isFullProfile: true
      };
    }
    if (!force && this.userCache.has(playFabId)) {
      const cached = this.userCache.get(playFabId);
      if (cached && cached.isFullProfile) {
        return cached;
      }
    }

    let resolvedData = {
      playFabId: playFabId,
      displayName: "Member",
      username: "",
      avatarUrl: "",
      presence: "offline",
      statusMessage: "",
      appRank: null,
      isFullProfile: true
    };

    try {
      const cloudRes = await this.executeScript("getUserProfile", { userId: playFabId }, { silent: true });
      if (cloudRes && cloudRes.success && cloudRes.profile) {
        const p = cloudRes.profile;
        if (p.displayName) resolvedData.displayName = p.displayName;
        if (p.username) resolvedData.username = p.username;
        if (p.avatarUrl) resolvedData.avatarUrl = p.avatarUrl;
        if (p.presence) resolvedData.presence = p.presence;
        if (p.statusMessage !== undefined) resolvedData.statusMessage = p.statusMessage;
        if (p.appRank) resolvedData.appRank = p.appRank;
      }
    } catch {}

    if (!resolvedData.username || !resolvedData.appRank) {
      try {
        const res = await this.post("GetPlayerProfile", {
          PlayFabId: playFabId,
          ProfileConstraints: { ShowDisplayName: true, ShowAvatarUrl: true, ShowUsername: true }
        }, true);
        const profile = res && res.PlayerProfile ? res.PlayerProfile : {};
        if (profile.DisplayName && resolvedData.displayName === "Member") resolvedData.displayName = profile.DisplayName;
        if (profile.Username && !resolvedData.username) resolvedData.username = profile.Username;
        if (profile.AvatarUrl && !resolvedData.avatarUrl) resolvedData.avatarUrl = profile.AvatarUrl;
      } catch {}

      try {
        const readOnlyData = await this.post("GetUserReadOnlyData", {
          PlayFabId: playFabId,
          Keys: ["RankName", "RankColor", "RankPerms", "Rankhidden"]
        }, true);
        if (readOnlyData && readOnlyData.Data) {
          const d = readOnlyData.Data;
          const rName = d.RankName ? d.RankName.Value : "";
          const rColor = d.RankColor ? d.RankColor.Value : "";
          const rPermsRaw = d.RankPerms ? d.RankPerms.Value : "";
          const rHidden = d.Rankhidden ? (d.Rankhidden.Value === "true" || d.Rankhidden.Value === true) : false;
          let perms = {};
          if (rPermsRaw) {
            try { perms = JSON.parse(rPermsRaw); } catch {}
          }
          if (rName) {
            resolvedData.appRank = {
              name: rName,
              color: rColor || "#ffffff",
              perms: perms,
              hidden: rHidden
            };
          }
        }
      } catch {}
    }

    this.userCache.set(playFabId, resolvedData);
    return resolvedData;
  }

  async getFriendsList() {
    if (!this.sessionTicket) return [];
    try {
      const res = await this.post("GetFriendsList", {
        IncludeFacebookFriends: false,
        IncludeSteamFriends: false,
        ProfileConstraints: { ShowDisplayName: true, ShowAvatarUrl: true }
      }, true);

      const rawFriends = res.Friends || [];
      const confirmedFriends = [];

      for (const f of rawFriends) {
        const prof = f.Profile || {};
        const friendData = {
          playFabId: f.FriendPlayFabId,
          displayName: prof.DisplayName || f.TitleDisplayName || f.Username || "Friend",
          avatarUrl: prof.AvatarUrl || "",
          username: f.Username || "",
          tags: Array.isArray(f.Tags) ? f.Tags : []
        };
        confirmedFriends.push(friendData);
      }
      return confirmedFriends;
    } catch {
      return [];
    }
  }

  async addFriend(identifier) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    const cleanTarget = String(identifier || "").trim();
    if (!cleanTarget) throw new Error("Username or ID required");
    const res = await this.executeScript("sendFriendRequest", { target: cleanTarget });
    if (!res || !res.success) {
      throw new Error(res?.error || "Failed to send friend request");
    }
    return res;
  }

  async removeFriend(friendPlayFabId) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    try {
      await this.executeScript("removeFriend", { friendId: friendPlayFabId });
    } catch {}
    try {
      await this.post("RemoveFriend", { FriendPlayFabId: friendPlayFabId }, true);
    } catch {}
    return { success: true };
  }

  async getMessages(target, silent = true) {
    return await this.executeScript("getMessages", target, { silent });
  }

  async sendMessage(target, text, replyTo = null) {
    const now = Date.now();
    if (now - this.lastSendTimestamp < 1000) {
      throw new Error("Sending too fast. Please wait a moment.");
    }
    this.lastSendTimestamp = now;

    const payload = Object.assign({}, target, {
      text: String(text || "").trim().slice(0, 2000),
      replyTo: replyTo || undefined
    });

    return await this.executeScript("sendMessage", payload);
  }

  async editMessage(target, messageId, text) {
    const payload = Object.assign({}, target, {
      messageId: messageId,
      text: String(text || "").trim().slice(0, 2000)
    });
    return await this.executeScript("editMessage", payload);
  }

  async deleteMessage(target, messageId) {
    const payload = Object.assign({}, target, {
      messageId: messageId
    });
    return await this.executeScript("deleteMessage", payload);
  }

  async getUserServers(silent = true) {
    const res = await this.executeScript("getUserServers", {}, { silent });
    if (res && res.success && Array.isArray(res.servers)) {
      return res.servers;
    }
    return appState.getState().servers || [];
  }

  async createServer(name, iconUrl = "") {
    return await this.executeScript("createServer", { name, iconUrl });
  }

  async getServer(serverId, silent = true) {
    return await this.executeScript("getServer", { serverId }, { silent });
  }

  async joinServer(serverId) {
    return await this.executeScript("joinServer", { serverId });
  }

  async leaveServer(serverId) {
    return await this.executeScript("leaveServer", { serverId });
  }

  async getUserDMs(silent = true) {
    const res = await this.executeScript("getUserDMs", {}, { silent });
    if (res && res.success && Array.isArray(res.dms)) {
      return res.dms;
    }
    return appState.getState().dms || [];
  }

  async createOrGetDM(partnerId) {
    return await this.executeScript("createOrGetDM", { partnerId });
  }
}

export const playFabService = new PlayFabService();
