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
      activeGame: null
    };
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
}

export const appState = new AppState();
