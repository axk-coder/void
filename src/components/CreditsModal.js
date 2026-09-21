export class CreditsModal {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.render();
  }

  open() {
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    this.render();
  }

  render() {
    if (!this.isOpen) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = `
      <div class="modal-overlay" id="credits-modal-overlay">
        <div class="modal-card" style="max-width: 460px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">Credits & Acknowledgements</h3>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-subtle);">1</span>
            </div>
            <button class="modal-close-btn" id="credits-close-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="credits-list">
              <div class="credits-item">
                <div class="credits-item-name">Axk</div>
                <div class="credits-item-desc">Creator and lead developer.</div>
              </div>
              <div class="credits-item">
                <div class="credits-item-name">PlayFab Client REST API</div>
                <div class="credits-item-desc">Authentication and player profile management.</div>
              </div>
              <div class="credits-item">
                <div class="credits-item-name">Vite</div>
                <div class="credits-item-desc">Frontend tooling and production bundler.</div>
              </div>
              <div class="credits-item">
                <div class="credits-item-name">Google Fonts</div>
                <div class="credits-item-desc">Outfit and JetBrains Mono typefaces.</div>
              </div>
              <div class="credits-item">
                <div class="credits-item-name">Web Audio API</div>
                <div class="credits-item-desc">Native browser audio synthesis for transmission feedback.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = this.container.querySelector('#credits-modal-overlay');
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    const closeBtn = this.container.querySelector('#credits-close-btn');
    closeBtn?.addEventListener('click', () => this.close());
  }
}
