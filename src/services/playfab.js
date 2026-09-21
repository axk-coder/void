import { appState } from './state.js';

export const PLAYFAB_TITLE_ID = "133616";
const PLAYFAB_API_BASE = `https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client`;

function setCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
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

    const storedUser = localStorage.getItem("pulse_user") || getCookie("pulse_user");
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch {
        this.currentUser = null;
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

  async tryAutoLogin() {
    if (this.sessionTicket && this.currentUser) {
      try {
        await this.syncCurrentUserProfile();
        return true;
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

  async post(endpoint, payload, useAuth = false) {
    const url = `${PLAYFAB_API_BASE}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-ReportErrorAsSuccess": "true"
    };

    if (useAuth && this.sessionTicket) {
      headers["X-Authentication"] = this.sessionTicket;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.code !== 200 || (data.status && data.status !== "OK")) {
      const msg = data.errorMessage || data.error || "Request failed";
      const err = new Error(msg);
      err.playFabData = data;
      throw err;
    }

    return data.data;
  }

  async executeScript(functionName, functionParameter = {}) {
    if (!this.sessionTicket) throw new Error("Not authenticated");
    try {
      const payload = {
        FunctionName: functionName,
        FunctionParameter: functionParameter,
        GeneratePlayStreamEvent: false
      };
      const res = await this.post("ExecuteCloudScript", payload, true);
      if (res && res.FunctionResult) {
        return res.FunctionResult;
      }
      return { success: false };
    } catch (err) {
      return { success: false };
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
      const cloudRes = await this.executeScript("getUserProfile", { userId: this.playFabId });
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
}

export const playFabService = new PlayFabService();
