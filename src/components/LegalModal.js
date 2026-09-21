export class LegalModal {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.tab = 'privacy';
    this.render();
  }

  open(tab = 'privacy') {
    this.tab = tab;
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

    let titleText = 'Privacy Policy';
    if (this.tab === 'terms') titleText = 'Terms of Service';
    if (this.tab === 'copyright') titleText = 'Copyright';

    this.container.innerHTML = `
      <div class="modal-overlay" id="legal-modal-overlay">
        <div class="modal-card" style="max-width: 540px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">${titleText}</h3>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-subtle);">6.0</span>
            </div>
            <button class="modal-close-btn" id="legal-close-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="auth-tabs" style="margin-bottom: 8px;">
              <button type="button" class="auth-tab ${this.tab === 'privacy' ? 'active' : ''}" id="legal-tab-privacy">
                Privacy Policy
              </button>
              <button type="button" class="auth-tab ${this.tab === 'terms' ? 'active' : ''}" id="legal-tab-terms">
                Terms of Service
              </button>
              <button type="button" class="auth-tab ${this.tab === 'copyright' ? 'active' : ''}" id="legal-tab-copyright">
                Copyright
              </button>
            </div>

            ${this.tab === 'privacy' ? `
              <div class="legal-section">
                <h4 class="legal-title">1. Information We Collect</h4>
                <p class="legal-text">void collects account registration details including username, email address, and optional display name through PlayFab authentication. We do not sell or monetize personal data.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">2. Message & Data Storage</h4>
                <p class="legal-text">All communications are transmitted via encrypted HTTPS REST requests (TLS 1.2/1.3) through PlayFab CloudScript. No client-side tokens or credentials for third-party storage are exposed on the user's browser.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">3. Zero Socket Logging</h4>
                <p class="legal-text">void does not maintain persistent WebSockets or tracking cookies. Inactive sessions automatically suspend polling to minimize network footprint.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">4. Network Policy Compliance</h4>
                <p class="legal-text">This application is not designed, configured, or intended to bypass, circumvent, or evade any network blocks, organizational restrictions, or firewalls. All communications adhere to standard HTTPS web protocols.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">5. Data Retention</h4>
                <p class="legal-text">Local preferences and sandboxed configurations remain on device until cleared. Users can request account removal through PlayFab management.</p>
              </div>
            ` : this.tab === 'terms' ? `
              <div class="legal-section">
                <h4 class="legal-title">1. Acceptance of Terms</h4>
                <p class="legal-text">By using void, you agree to comply with applicable network regulations, acceptable use guidelines, and these Terms of Service.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">2. Prohibited Conduct</h4>
                <p class="legal-text">Users may not engage in harassment, unauthorized automated scraping, rate-limit flooding, transmitting malicious payloads, or impersonating other users.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">3. No Circumvention</h4>
                <p class="legal-text">This application is not made or intended to bypass any network blocks, firewalls, content filters, or administrative restrictions. Users are responsible for complying with their local network and institution policies.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">4. Service Availability</h4>
                <p class="legal-text">void is provided as-is without warranties. Network administrators retain authority over local area network access and firewall rules.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">5. Termination</h4>
                <p class="legal-text">Accounts violating these policies may be restricted or suspended by the administrator.</p>
              </div>
            ` : `
              <div class="legal-section">
                <h4 class="legal-title">1. Authorship & Development</h4>
                <p class="legal-text">void was made by akidindev.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">2. Copyright Notice</h4>
                <p class="legal-text">Copyright &copy; 2026 akidindev. All rights reserved.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">3. Intellectual Property Rights</h4>
                <p class="legal-text">All platform code, architecture, design systems, assets, and documentation are the property of akidindev.</p>
              </div>
              <div class="legal-section">
                <h4 class="legal-title">4. License & Usage</h4>
                <p class="legal-text">Unauthorized reproduction, distribution, reverse engineering, or modification of the software without permission from akidindev is prohibited.</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const overlay = this.container.querySelector('#legal-modal-overlay');
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    const closeBtn = this.container.querySelector('#legal-close-btn');
    closeBtn?.addEventListener('click', () => this.close());

    const privTab = this.container.querySelector('#legal-tab-privacy');
    privTab?.addEventListener('click', () => {
      this.tab = 'privacy';
      this.render();
    });

    const termsTab = this.container.querySelector('#legal-tab-terms');
    termsTab?.addEventListener('click', () => {
      this.tab = 'terms';
      this.render();
    });

    const copyrightTab = this.container.querySelector('#legal-tab-copyright');
    copyrightTab?.addEventListener('click', () => {
      this.tab = 'copyright';
      this.render();
    });
  }
}
