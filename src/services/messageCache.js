class MessageCache {
  constructor() {
    this.memoryCache = new Map();
    this.maxCachedPerStream = 100;
  }

  getCachedMessages(streamKey) {
    if (!streamKey || streamKey === "none") return [];
    if (this.memoryCache.has(streamKey)) {
      return this.memoryCache.get(streamKey);
    }
    try {
      const raw = localStorage.getItem(`pulse_cache_${streamKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.memoryCache.set(streamKey, parsed);
          return parsed;
        }
      }
    } catch {}
    return [];
  }

  setCachedMessages(streamKey, messages) {
    if (!streamKey || streamKey === "none" || !Array.isArray(messages)) return;
    const trimmed = messages.slice(-this.maxCachedPerStream);
    this.memoryCache.set(streamKey, trimmed);
    try {
      localStorage.setItem(`pulse_cache_${streamKey}`, JSON.stringify(trimmed));
    } catch {}
  }

  clear() {
    this.memoryCache.clear();
  }
}

export const messageCache = new MessageCache();
