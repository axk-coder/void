import { appState } from './state.js';

export const PLAYFAB_TITLE_ID = "133616";
const PLAYFAB_API_BASE = `https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client`;

function setAuthCookie(name, value, days = 365) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}

function getAuthCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch {
    return null;
  }
}

function deleteAuthCookie(name) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  } catch {}
}

class PlayFabService {
  constructor() {
    this.sessionTicket = localStorage.getItem("pulse_session_ticket") || getAuthCookie("pulse_session_ticket") || null;
    this.playFabId = localStorage.getItem("pulse_playfab_id") || getAuthCookie("pulse_playfab_id") || null;
    this.currentUser = null;

    const storedUser = localStorage.getItem("pulse_user") || getAuthCookie("pulse_user");
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
      statusMessage: String(userProfile.statusMessage || "").slice(0, 128)
    };

    localStorage.setItem("pulse_session_ticket", this.sessionTicket);
    localStorage.setItem("pulse_playfab_id", this.playFabId);
    localStorage.setItem("pulse_user", JSON.stringify(this.currentUser));

    setAuthCookie("pulse_session_ticket", this.sessionTicket);
    setAuthCookie("pulse_playfab_id", this.playFabId);
    setAuthCookie("pulse_user", JSON.stringify(this.currentUser));
    setAuthCookie("axk_auth_ticket", this.sessionTicket);

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

    deleteAuthCookie("pulse_session_ticket");
    deleteAuthCookie("pulse_playfab_id");
    deleteAuthCookie("pulse_user");
    deleteAuthCookie("axk_auth_ticket");

    appState.setUser(null);
  }

  saveCredentials(identifier, password) {
    try {
      const payload = JSON.stringify({
        identifier: String(identifier || "").trim(),
        password: String(password || "")
      });
      localStorage.setItem("pulse_auth_store", payload);
      setAuthCookie("pulse_auth_store", payload);
    } catch {}
  }

  getSavedCredentials() {
    try {
      const raw = localStorage.getItem("pulse_auth_store") || getAuthCookie("pulse_auth_store");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  async tryAutoLogin() {
    if (this.sessionTicket && this.currentUser) {
      try {
        await this.post("GetAccountInfo", {}, true);
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

  async login(identifier, password) {
    const isEmail = identifier.includes("@");
    const endpoint = isEmail ? "LoginWithEmailAddress" : "LoginWithPlayFab";
    const payload = {
      TitleId: PLAYFAB_TITLE_ID,
      Password: password,
      InfoRequestParameters: {
        GetUserAccountInfo: true,
        GetUserData: true,
        GetUserReadOnlyData: true
      }
    };

    if (isEmail) {
      payload.Email = identifier;
    } else {
      payload.Username = identifier;
    }

    const res = await this.post(endpoint, payload);
    const ticket = res.SessionTicket;
    const pId = res.PlayFabId;
    const accountInfo = res.InfoResultPayload?.AccountInfo || {};
    const titleData = accountInfo.TitleInfo || {};

    let userProfile = {
      username: accountInfo.Username || identifier,
      displayName: titleData.DisplayName || accountInfo.Username || identifier,
      email: accountInfo.PrivateInfo?.Email || (isEmail ? identifier : ""),
      avatarUrl: "",
      presence: "online",
      statusMessage: ""
    };

    const userData = res.InfoResultPayload?.UserData || {};
    if (userData.profile && userData.profile.Value) {
      try {
        const parsed = JSON.parse(userData.profile.Value);
        userProfile.avatarUrl = parsed.avatarUrl || userProfile.avatarUrl;
        userProfile.statusMessage = parsed.statusMessage || userProfile.statusMessage;
        userProfile.presence = parsed.presence || userProfile.presence;
      } catch {}
    }

    this.saveCredentials(identifier, password);
    this.saveSession(ticket, pId, userProfile);
    return userProfile;
  }

  async register(username, email, password, displayName) {
    const payload = {
      TitleId: PLAYFAB_TITLE_ID,
      Username: username,
      Email: email,
      Password: password,
      DisplayName: displayName || username,
      RequireBothUsernameAndEmail: true
    };

    const res = await this.post("RegisterPlayFabUser", payload);
    const ticket = res.SessionTicket;
    const pId = res.PlayFabId;

    const userProfile = {
      username: username,
      displayName: displayName || username,
      email: email,
      avatarUrl: "",
      presence: "online",
      statusMessage: ""
    };

    this.saveCredentials(username, password);
    this.saveSession(ticket, pId, userProfile);
    return userProfile;
  }

  async sendPasswordReset(email) {
    const payload = {
      TitleId: PLAYFAB_TITLE_ID,
      Email: email
    };
    return await this.post("SendAccountRecoveryEmail", payload);
  }

  async updateUserData(updateObj) {
    if (!this.sessionTicket) return;
    const payload = {
      Data: {
        profile: JSON.stringify(updateObj)
      },
      Permission: "Public"
    };
    return await this.post("UpdateUserData", payload, true);
  }

  async updateUserDisplayName(newDisplayName) {
    if (!this.sessionTicket) return;
    return await this.post("UpdateUserTitleDisplayName", {
      DisplayName: String(newDisplayName || "").trim().slice(0, 32)
    }, true);
  }
}

export const playFabService = new PlayFabService();
