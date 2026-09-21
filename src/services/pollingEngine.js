import { playFabService } from './playfab.js';
import { appState } from './state.js';
import { soundSynth } from './soundEffects.js';

class PollingEngine {
  constructor() {
    this.intervalMs = 450;
    this.idleIntervalMs = 15000;
    this.timer = null;
    this.metaTimer = null;
    this.isRunning = false;
    this.lastInteraction = Date.now();
    this.isIdle = false;
    this.isTabHidden = false;
    this.consecutiveErrors = 0;
    this.lastSeenMessageCount = {};

    this.setupListeners();
  }

  setupListeners() {
    appState.subscribe((state, key) => {
      if (key === 'navigation' || key === 'channel') {
        if (this.isRunning && !this.isTabHidden) {
          this.pollNow();
        }
      }
    });

    document.addEventListener("visibilitychange", () => {
      this.isTabHidden = document.visibilityState === "hidden";
      if (this.isTabHidden) {
        appState.setNetworkStatus({ status: "paused" });
        this.clearTimer();
      } else {
        appState.setNetworkStatus({ status: "live" });
        this.pollNow();
        this.scheduleNext();
      }
    });

    const resetIdle = () => {
      this.lastInteraction = Date.now();
      if (this.isIdle) {
        this.isIdle = false;
        appState.setNetworkStatus({ isIdle: false });
        if (!this.isTabHidden && this.isRunning) {
          this.pollNow();
        }
      }
    };

    window.addEventListener("mousemove", resetIdle, { passive: true });
    window.addEventListener("keydown", resetIdle, { passive: true });
    window.addEventListener("touchstart", resetIdle, { passive: true });
    window.addEventListener("scroll", resetIdle, { passive: true });

    setInterval(() => {
      const elapsed = Date.now() - this.lastInteraction;
      if (elapsed > 90000 && !this.isIdle) {
        this.isIdle = true;
        appState.setNetworkStatus({ isIdle: true, status: "paused" });
      }
    }, 15000);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.pollNow();
    this.scheduleNext();
    this.startMetaPolling();
  }

  stop() {
    this.isRunning = false;
    this.clearTimer();
    if (this.metaTimer) {
      clearInterval(this.metaTimer);
      this.metaTimer = null;
    }
    appState.setNetworkStatus({ status: "paused" });
  }

  startMetaPolling() {
    if (this.metaTimer) clearInterval(this.metaTimer);
    this.pollMeta();
    this.metaTimer = setInterval(() => {
      if (this.isRunning && !this.isTabHidden) {
        this.pollMeta();
      }
    }, 12000);
  }

  async pollMeta() {
    if (!playFabService.isAuthenticated()) return;
    try {
      const [dms, friends, servers] = await Promise.all([
        playFabService.getUserDMs(),
        playFabService.getFriendsList(),
        playFabService.getUserServers()
      ]);
      if (Array.isArray(dms)) appState.setDMs(dms);
      if (Array.isArray(friends)) appState.setFriends(friends);
      if (Array.isArray(servers)) appState.setServers(servers);
    } catch {}
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  scheduleNext(delayOverride = null) {
    this.clearTimer();
    if (!this.isRunning || this.isTabHidden) return;

    let delay = delayOverride || (this.isIdle ? this.idleIntervalMs : this.intervalMs);

    if (this.consecutiveErrors > 0) {
      delay = Math.min(20000, delay * 1.5);
    }

    this.timer = setTimeout(() => {
      this.pollCycle();
    }, delay);
  }

  async pollNow() {
    this.clearTimer();
    await this.pollCycle();
    this.scheduleNext();
  }

  async pollCycle() {
    if (!playFabService.isAuthenticated()) {
      return;
    }

    const streamKey = appState.getStreamKey();
    const targetParam = appState.getTargetParam();
    const startTime = performance.now();
    appState.setNetworkStatus({ status: "syncing" });

    try {
      const result = await playFabService.getMessages(targetParam);
      const latency = Math.round(performance.now() - startTime);

      if (result && result.success && Array.isArray(result.messages)) {
        this.consecutiveErrors = 0;
        const currentMsgs = appState.getState().messages[streamKey] || [];

        const prevCount = this.lastSeenMessageCount[streamKey] || currentMsgs.length;
        if (result.messages.length > prevCount) {
          const latest = result.messages[result.messages.length - 1];
          const currentUserId = playFabService.getCurrentUser()?.playFabId;
          if (latest && latest.senderId !== currentUserId) {
            soundSynth.playReceived();
            appState.incrementUnread();
          }
        }
        this.lastSeenMessageCount[streamKey] = result.messages.length;

        appState.setMessages(streamKey, result.messages);

        appState.setNetworkStatus({
          status: this.isIdle ? "paused" : "live",
          latencyMs: latency,
          lastPoll: new Date(),
          error: null
        });
      } else {
        appState.setNetworkStatus({
          status: "live",
          latencyMs: latency,
          lastPoll: new Date()
        });
      }
    } catch (err) {
      this.consecutiveErrors++;
      const latency = Math.round(performance.now() - startTime);

      appState.setNetworkStatus({
        status: "error",
        latencyMs: latency,
        lastPoll: new Date(),
        error: err.message
      });
    }
  }
}

export const pollingEngine = new PollingEngine();
