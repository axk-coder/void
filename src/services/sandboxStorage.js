export class SandboxStorageService {
  constructor() {
    this.storagePrefix = 'void_cookie_sandbox_';
    this.storageFallback = new Map();
    this.initPostMessageBridge();
  }

  sanitizeGameId(gameId) {
    return String(gameId || 'default')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 64);
  }

  getStoreKey(gameId) {
    return `${this.storagePrefix}${this.sanitizeGameId(gameId)}`;
  }

  getCookiesMap(gameId) {
    const key = this.getStoreKey(gameId);
    let raw = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      raw = this.storageFallback.get(key);
    }

    if (!raw) return new Map();

    try {
      const parsed = JSON.parse(raw);
      const now = Date.now();
      const map = new Map();

      if (parsed && typeof parsed === 'object') {
        for (const [cKey, cVal] of Object.entries(parsed)) {
          if (cVal && typeof cVal === 'object') {
            if (cVal.expires && Number(cVal.expires) < now) {
              continue;
            }
            map.set(String(cKey), String(cVal.value || ''));
          } else if (typeof cVal === 'string') {
            map.set(String(cKey), cVal);
          }
        }
      }
      return map;
    } catch {
      return new Map();
    }
  }

  saveCookiesMap(gameId, map) {
    const key = this.getStoreKey(gameId);
    const obj = {};
    for (const [k, v] of map.entries()) {
      if (k && typeof k === 'string' && k.length <= 256) {
        obj[k] = {
          value: String(v).slice(0, 4096),
          updatedAt: Date.now()
        };
      }
    }

    const payload = JSON.stringify(obj);
    try {
      localStorage.setItem(key, payload);
    } catch {
      this.storageFallback.set(key, payload);
    }
  }

  getCookieString(gameId) {
    const map = this.getCookiesMap(gameId);
    const pairs = [];
    for (const [k, v] of map.entries()) {
      pairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
    return pairs.join('; ');
  }

  setCookieString(gameId, rawCookie) {
    if (!rawCookie || typeof rawCookie !== 'string') return;
    const parts = rawCookie.split(';');
    const firstPart = parts[0] ? parts[0].trim() : '';
    if (!firstPart) return;

    const eqIdx = firstPart.indexOf('=');
    if (eqIdx === -1) return;

    let key = decodeURIComponent(firstPart.slice(0, eqIdx).trim());
    let value = decodeURIComponent(firstPart.slice(eqIdx + 1).trim());

    if (!key || key.startsWith('__proto__') || key === 'constructor' || key === 'prototype') {
      return;
    }

    let isExpired = false;
    for (let i = 1; i < parts.length; i++) {
      const directive = parts[i].trim().toLowerCase();
      if (directive.startsWith('max-age=')) {
        const maxAge = parseInt(directive.slice(8), 10);
        if (!isNaN(maxAge) && maxAge <= 0) {
          isExpired = true;
        }
      } else if (directive.startsWith('expires=')) {
        const expDate = new Date(parts[i].trim().slice(8));
        if (!isNaN(expDate.getTime()) && expDate.getTime() <= Date.now()) {
          isExpired = true;
        }
      }
    }

    const map = this.getCookiesMap(gameId);
    if (isExpired) {
      map.delete(key);
    } else {
      map.set(key, value);
    }
    this.saveCookiesMap(gameId, map);
  }

  clearGameCookies(gameId) {
    const key = this.getStoreKey(gameId);
    try {
      localStorage.removeItem(key);
    } catch {
      this.storageFallback.delete(key);
    }
  }

  injectIframeBridge(iframe, gameId) {
    if (!iframe) return;

    const attach = () => {
      try {
        const win = iframe.contentWindow;
        if (!win) return;
        const doc = win.document;
        if (!doc) return;

        const safeGameId = this.sanitizeGameId(gameId);

        let initialCookie = this.getCookieString(safeGameId);

        try {
          Object.defineProperty(doc, 'cookie', {
            configurable: true,
            enumerable: true,
            get: () => {
              return this.getCookieString(safeGameId);
            },
            set: (val) => {
              this.setCookieString(safeGameId, val);
              return true;
            }
          });
        } catch {}

        try {
          win._voidSandboxCookieBridge = {
            gameId: safeGameId,
            getCookie: () => this.getCookieString(safeGameId),
            setCookie: (c) => this.setCookieString(safeGameId, c),
            clearCookies: () => this.clearGameCookies(safeGameId)
          };
        } catch {}

        try {
          const testKey = `__void_test_${safeGameId}`;
          win.localStorage.setItem(testKey, '1');
          win.localStorage.removeItem(testKey);
        } catch {
          const memStorage = new Map();
          const storageProxy = {
            getItem: (k) => memStorage.get(String(k)) || null,
            setItem: (k, v) => memStorage.set(String(k), String(v)),
            removeItem: (k) => memStorage.delete(String(k)),
            clear: () => memStorage.clear(),
            get length() { return memStorage.size; },
            key: (i) => Array.from(memStorage.keys())[i] || null
          };

          try {
            Object.defineProperty(win, 'localStorage', {
              value: storageProxy,
              configurable: true,
              writable: true
            });
          } catch {}
        }
      } catch {}
    };

    iframe.addEventListener('load', attach);
    attach();
  }

  initPostMessageBridge() {
    window.addEventListener('message', (e) => {
      const data = e.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'VOID_SANDBOX_COOKIE_GET' && data.gameId) {
        const cookieStr = this.getCookieString(data.gameId);
        try {
          if (e.source && typeof e.source.postMessage === 'function') {
            e.source.postMessage({
              type: 'VOID_SANDBOX_COOKIE_RESPONSE',
              requestId: data.requestId,
              cookie: cookieStr
            }, '*');
          }
        } catch {}
      } else if (data.type === 'VOID_SANDBOX_COOKIE_SET' && data.gameId && data.cookie) {
        this.setCookieString(data.gameId, data.cookie);
        try {
          if (e.source && typeof e.source.postMessage === 'function') {
            e.source.postMessage({
              type: 'VOID_SANDBOX_COOKIE_SAVED',
              requestId: data.requestId,
              success: true
            }, '*');
          }
        } catch {}
      }
    });
  }
}

export const sandboxStorageService = new SandboxStorageService();
