const games = [];

const cloakProfiles = {
  none: {
    title: 'void',
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%2318181b'/></svg>"
  },
  google: {
    title: 'Google',
    icon: 'https://www.google.com/favicon.ico'
  },
  docs: {
    title: 'Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  drive: {
    title: 'Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  classroom: {
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  canvas: {
    title: 'Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  }
};

const defaultSettings = {
  cloak: 'none',
  panicKey: '`',
  panicUrl: 'https://google.com'
};

function getStoredSettings() {
  try {
    const raw = localStorage.getItem('void_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cloak: typeof parsed.cloak === 'string' && cloakProfiles[parsed.cloak] ? parsed.cloak : defaultSettings.cloak,
        panicKey: typeof parsed.panicKey === 'string' && parsed.panicKey.length === 1 ? parsed.panicKey : defaultSettings.panicKey,
        panicUrl: isValidUrl(parsed.panicUrl) ? parsed.panicUrl : defaultSettings.panicUrl
      };
    }
  } catch (e) {
    return defaultSettings;
  }
  return defaultSettings;
}

function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function saveStoredSettings(settings) {
  try {
    localStorage.setItem('void_settings', JSON.stringify(settings));
  } catch (e) {}
}

function applyCloak(profileKey) {
  const profile = cloakProfiles[profileKey] || cloakProfiles.none;
  document.title = profile.title;
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'shortcut icon';
    document.head.appendChild(link);
  }
  link.href = profile.icon;
}

function setupPanicKey() {
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }
    const settings = getStoredSettings();
    if (e.key === settings.panicKey) {
      e.preventDefault();
      const target = isValidUrl(settings.panicUrl) ? settings.panicUrl : 'https://google.com';
      window.location.replace(target);
    }
  });
}

function renderCatalog() {
  const grid = document.getElementById('games-grid');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-input');
  const activeCategoryBtn = document.querySelector('.category-btn.active');
  const sortSelect = document.getElementById('sort-select');

  if (!grid || !emptyState) return;

  const searchTerm = (searchInput ? searchInput.value : '').trim().toLowerCase();
  const selectedCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';
  const sortMode = sortSelect ? sortSelect.value : 'name-asc';

  let filtered = games.filter(game => {
    const matchesSearch = !searchTerm || (game.title && game.title.toLowerCase().includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || (game.category && game.category.toLowerCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (sortMode === 'name-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMode === 'name-desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  const existingCards = grid.querySelectorAll('.game-card');
  existingCards.forEach(card => card.remove());

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  filtered.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.tabIndex = 0;

    const thumb = document.createElement('div');
    thumb.className = 'game-card-thumb';

    const body = document.createElement('div');
    body.className = 'game-card-body';

    const title = document.createElement('div');
    title.className = 'game-card-title';
    title.textContent = game.title || 'Untitled';

    const category = document.createElement('div');
    category.className = 'game-card-category';
    category.textContent = game.category || 'General';

    body.appendChild(title);
    body.appendChild(category);
    card.appendChild(thumb);
    card.appendChild(body);

    card.addEventListener('click', () => {
      launchGame(game);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        launchGame(game);
      }
    });

    grid.appendChild(card);
  });
}

function launchGame(game) {
  if (!game || !game.url) return;
  const catalogSection = document.getElementById('catalog-section');
  const playerSection = document.getElementById('player-section');
  const gameFrame = document.getElementById('game-frame');
  const titleEl = document.getElementById('current-game-title');

  if (catalogSection) catalogSection.classList.add('hidden');
  if (playerSection) playerSection.classList.remove('hidden');

  if (titleEl) titleEl.textContent = game.title || 'Game';
  if (gameFrame) {
    gameFrame.src = game.url;
  }
}

function closeGame() {
  const catalogSection = document.getElementById('catalog-section');
  const playerSection = document.getElementById('player-section');
  const gameFrame = document.getElementById('game-frame');

  if (gameFrame) gameFrame.src = 'about:blank';
  if (playerSection) playerSection.classList.add('hidden');
  if (catalogSection) catalogSection.classList.remove('hidden');
}

function openInAboutBlank(urlToOpen) {
  const win = window.open('about:blank', '_blank');
  if (!win || win.closed) {
    return;
  }

  const doc = win.document;
  const frame = doc.createElement('iframe');
  frame.style.width = '100vw';
  frame.style.height = '100vh';
  frame.style.border = 'none';
  frame.style.position = 'fixed';
  frame.style.top = '0';
  frame.style.left = '0';
  frame.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
  frame.allow = 'fullscreen; autoplay; gamepad';
  frame.src = urlToOpen || window.location.href;

  doc.body.style.margin = '0';
  doc.body.style.height = '100vh';
  doc.body.style.overflow = 'hidden';
  doc.body.appendChild(frame);
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', renderCatalog);
  }

  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalog();
    });
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', renderCatalog);
  }

  const closePlayerBtn = document.getElementById('close-player-btn');
  if (closePlayerBtn) {
    closePlayerBtn.addEventListener('click', closeGame);
  }

  const reloadGameBtn = document.getElementById('reload-game-btn');
  if (reloadGameBtn) {
    reloadGameBtn.addEventListener('click', () => {
      const gameFrame = document.getElementById('game-frame');
      if (gameFrame && gameFrame.src && gameFrame.src !== 'about:blank') {
        const currentSrc = gameFrame.src;
        gameFrame.src = currentSrc;
      }
    });
  }

  const fullscreenGameBtn = document.getElementById('fullscreen-game-btn');
  if (fullscreenGameBtn) {
    fullscreenGameBtn.addEventListener('click', () => {
      const container = document.getElementById('player-frame-container');
      if (!container) return;
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  const openBlankBtn = document.getElementById('open-blank-btn');
  if (openBlankBtn) {
    openBlankBtn.addEventListener('click', () => {
      const gameFrame = document.getElementById('game-frame');
      if (gameFrame && gameFrame.src && gameFrame.src !== 'about:blank') {
        openInAboutBlank(gameFrame.src);
      }
    });
  }

  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const cloakSelect = document.getElementById('cloak-select');
  const panicKeyInput = document.getElementById('panic-key-input');
  const panicUrlInput = document.getElementById('panic-url-input');
  const aboutBlankLauncherBtn = document.getElementById('about-blank-launcher-btn');

  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      const current = getStoredSettings();
      if (cloakSelect) cloakSelect.value = current.cloak;
      if (panicKeyInput) panicKeyInput.value = current.panicKey;
      if (panicUrlInput) panicUrlInput.value = current.panicUrl;
      settingsModal.classList.remove('hidden');
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }

  if (saveSettingsBtn && settingsModal) {
    saveSettingsBtn.addEventListener('click', () => {
      const selectedCloak = cloakSelect ? cloakSelect.value : 'none';
      const enteredKey = panicKeyInput && panicKeyInput.value ? panicKeyInput.value.trim().charAt(0) : '`';
      const enteredUrl = panicUrlInput && panicUrlInput.value ? panicUrlInput.value.trim() : 'https://google.com';

      const validUrl = isValidUrl(enteredUrl) ? enteredUrl : 'https://google.com';

      const updated = {
        cloak: cloakProfiles[selectedCloak] ? selectedCloak : 'none',
        panicKey: enteredKey || '`',
        panicUrl: validUrl
      };

      saveStoredSettings(updated);
      applyCloak(updated.cloak);
      settingsModal.classList.add('hidden');
    });
  }

  if (aboutBlankLauncherBtn) {
    aboutBlankLauncherBtn.addEventListener('click', () => {
      openInAboutBlank(window.location.href);
    });
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const currentSettings = getStoredSettings();
  applyCloak(currentSettings.cloak);
  setupPanicKey();
  setupEventListeners();
  renderCatalog();
});
