import { playFabService } from '../services/playfab.js';

export class AuthModal {
  constructor(container, { onAuthSuccess, onOpenLegal, onOpenCredits }) {
    this.container = container;
    this.callbacks = { onAuthSuccess, onOpenLegal, onOpenCredits };
    this.mode = 'login';
    this.isOpen = false;
    this.isLoading = false;
    this.error = null;
    this.successMessage = null;
    this.formData = {
      identifier: '',
      displayName: '',
      email: '',
      password: '',
      forgotEmail: ''
    };
    this.render();
  }

  open(mode = 'login') {
    this.mode = mode;
    this.isOpen = true;
    this.error = null;
    this.successMessage = null;
    this.render();
  }

  close() {
    this.isOpen = false;
    this.container.innerHTML = '';
  }

  setErrorMessage(msg) {
    this.error = msg;
    const banner = this.container.querySelector('#auth-error-banner');
    if (banner) {
      banner.style.display = msg ? 'block' : 'none';
      const textSpan = banner.querySelector('span');
      if (textSpan) textSpan.textContent = msg || '';
    }
  }

  setSuccessMessage(msg) {
    this.successMessage = msg;
    const box = this.container.querySelector('#auth-success-banner');
    if (box) {
      box.style.display = msg ? 'block' : 'none';
      box.textContent = msg || '';
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    const submitBtn = this.container.querySelector('#auth-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading 
        ? 'Connecting...' 
        : (this.mode === 'login' ? 'Login' : 'Register');
    }
    const forgotBtn = this.container.querySelector('#forgot-submit-btn');
    if (forgotBtn) {
      forgotBtn.disabled = loading;
      forgotBtn.textContent = loading ? 'Sending...' : 'Send Recovery Email';
    }
  }

  render() {
    if (!this.isOpen) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = `
      <div class="auth-overlay-backdrop">
        <div class="auth-modal-wrapper">
          <div class="auth-brand-header">
            <div class="auth-pulse-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="22" height="22">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h1 class="auth-brand-name">PULSE</h1>
          </div>

          <div class="auth-card">
            <div class="auth-card-header">
              <h3 class="auth-title">axk-auth</h3>
              <span class="auth-subtitle">${this.mode === 'login' ? 'login' : (this.mode === 'register' ? 'register' : 'reset password')}</span>
            </div>

            <div class="auth-card-body">
              <div class="auth-tabs">
                <button type="button" class="auth-tab ${this.mode === 'login' ? 'active' : ''}" id="tab-login-btn">
                  Login
                </button>
                <button type="button" class="auth-tab ${this.mode === 'register' ? 'active' : ''}" id="tab-register-btn">
                  Register
                </button>
              </div>

              <div class="form-error-banner" id="auth-error-banner" style="${this.error ? 'display: block;' : 'display: none;'}">
                <span>${this.escapeHtml(this.error || '')}</span>
              </div>

              <div id="auth-success-banner" class="form-success-banner" style="${this.successMessage ? 'display: block;' : 'display: none;'}">
                ${this.escapeHtml(this.successMessage || '')}
              </div>

              ${this.mode === 'forgot' ? `
                <form id="forgot-form" onsubmit="return false;" class="auth-form-body">
                  <div class="form-group">
                    <label class="form-label" for="forgot-email">Account Email</label>
                    <input
                      type="email"
                      id="forgot-email"
                      class="form-input"
                      placeholder="name@example.com"
                      value="${this.escapeHtml(this.formData.forgotEmail)}"
                      required
                      autocomplete="email"
                    />
                  </div>

                  <button type="submit" class="form-btn-submit" id="forgot-submit-btn">
                    Send Recovery Email
                  </button>

                  <div class="auth-switch-link-box">
                    <button type="button" class="footer-link-btn" id="back-to-login-btn">Back to Sign In</button>
                  </div>
                </form>
              ` : `
                <form id="auth-form" onsubmit="return false;" class="auth-form-body">
                  <div class="form-group">
                    <label class="form-label" for="auth-identifier">
                      ${this.mode === 'login' ? 'Email or Username' : 'Username'}
                    </label>
                    <input
                      type="text"
                      id="auth-identifier"
                      class="form-input"
                      placeholder="${this.mode === 'login' ? 'Email or username' : 'Username'}"
                      value="${this.escapeHtml(this.formData.identifier)}"
                      required
                      autocomplete="username"
                      maxlength="100"
                    />
                  </div>

                  ${this.mode === 'register' ? `
                    <div class="form-group">
                      <label class="form-label" for="auth-display-name">Display Name</label>
                      <input
                        type="text"
                        id="auth-display-name"
                        class="form-input"
                        placeholder="Public Display Name"
                        value="${this.escapeHtml(this.formData.displayName)}"
                        autocomplete="nickname"
                        maxlength="32"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="auth-email">Email Address</label>
                      <input
                        type="email"
                        id="auth-email"
                        class="form-input"
                        placeholder="name@example.com"
                        value="${this.escapeHtml(this.formData.email)}"
                        required
                        autocomplete="email"
                      />
                    </div>
                  ` : ''}

                  <div class="form-group">
                    <div class="form-label-row">
                      <label class="form-label" for="auth-password">Password</label>
                      ${this.mode === 'login' ? `
                        <button type="button" class="footer-link-btn" id="link-forgot-btn" style="font-size: 11px;">Forgot?</button>
                      ` : ''}
                    </div>
                    <input
                      type="password"
                      id="auth-password"
                      class="form-input"
                      placeholder="Password"
                      value="${this.escapeHtml(this.formData.password)}"
                      required
                      autocomplete="${this.mode === 'register' ? 'new-password' : 'current-password'}"
                      maxlength="64"
                    />
                  </div>

                  <button type="submit" class="form-btn-submit" id="auth-submit-btn">
                    ${this.mode === 'login' ? 'Sign In' : 'Register Account'}
                  </button>
                </form>
              `}
            </div>
          </div>

          <div class="auth-legal-footer">
            <button type="button" class="footer-link-btn" id="auth-privacy-btn">Privacy</button>
            <span class="footer-dot">•</span>
            <button type="button" class="footer-link-btn" id="auth-terms-btn">Terms</button>
            <span class="footer-dot">•</span>
            <button type="button" class="footer-link-btn" id="auth-copyright-btn">Copyright</button>
            <span class="footer-dot">•</span>
            <button type="button" class="footer-link-btn" id="auth-credits-btn">Credits</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const identInput = this.container.querySelector('#auth-identifier');
    identInput?.addEventListener('input', (e) => {
      this.formData.identifier = e.target.value;
    });

    const dispInput = this.container.querySelector('#auth-display-name');
    dispInput?.addEventListener('input', (e) => {
      this.formData.displayName = e.target.value;
    });

    const mailInput = this.container.querySelector('#auth-email');
    mailInput?.addEventListener('input', (e) => {
      this.formData.email = e.target.value;
    });

    const passInput = this.container.querySelector('#auth-password');
    passInput?.addEventListener('input', (e) => {
      this.formData.password = e.target.value;
    });

    const fmailInput = this.container.querySelector('#forgot-email');
    fmailInput?.addEventListener('input', (e) => {
      this.formData.forgotEmail = e.target.value;
    });

    const loginTab = this.container.querySelector('#tab-login-btn');
    loginTab?.addEventListener('click', () => {
      this.mode = 'login';
      this.error = null;
      this.successMessage = null;
      this.render();
    });

    const registerTab = this.container.querySelector('#tab-register-btn');
    registerTab?.addEventListener('click', () => {
      this.mode = 'register';
      this.error = null;
      this.successMessage = null;
      this.render();
    });

    const forgotLink = this.container.querySelector('#link-forgot-btn');
    forgotLink?.addEventListener('click', () => {
      this.mode = 'forgot';
      this.error = null;
      this.successMessage = null;
      this.render();
    });

    const backBtn = this.container.querySelector('#back-to-login-btn');
    backBtn?.addEventListener('click', () => {
      this.mode = 'login';
      this.error = null;
      this.successMessage = null;
      this.render();
    });

    const authForm = this.container.querySelector('#auth-form');
    authForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    const forgotForm = this.container.querySelector('#forgot-form');
    forgotForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleForgotSubmit();
    });

    const privBtn = this.container.querySelector('#auth-privacy-btn');
    privBtn?.addEventListener('click', () => {
      if (this.callbacks.onOpenLegal) this.callbacks.onOpenLegal('privacy');
    });

    const termsBtn = this.container.querySelector('#auth-terms-btn');
    termsBtn?.addEventListener('click', () => {
      if (this.callbacks.onOpenLegal) this.callbacks.onOpenLegal('terms');
    });

    const copyrightBtn = this.container.querySelector('#auth-copyright-btn');
    copyrightBtn?.addEventListener('click', () => {
      if (this.callbacks.onOpenLegal) this.callbacks.onOpenLegal('copyright');
    });

    const credBtn = this.container.querySelector('#auth-credits-btn');
    credBtn?.addEventListener('click', () => {
      if (this.callbacks.onOpenCredits) this.callbacks.onOpenCredits();
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  async handleSubmit() {
    const identifier = (this.formData.identifier || '').trim();
    const password = this.formData.password || '';
    const email = (this.formData.email || '').trim();
    const displayName = (this.formData.displayName || '').trim().slice(0, 32);

    this.setErrorMessage(null);
    this.setSuccessMessage(null);

    if (!identifier || !password) {
      this.setErrorMessage('Please fill in all required fields');
      return;
    }

    if (this.mode === 'register') {
      if (identifier.length < 3) {
        this.setErrorMessage('Username must be at least 3 characters');
        return;
      }
      if (!email || !email.includes('@')) {
        this.setErrorMessage('Valid email address is required');
        return;
      }
    }

    if (password.length < 6) {
      this.setErrorMessage('Password must be at least 6 characters');
      return;
    }

    this.setLoading(true);

    try {
      if (this.mode === 'register') {
        await playFabService.register(identifier, email, password, displayName || identifier);
      } else {
        await playFabService.login(identifier, password);
      }

      this.close();
      if (this.callbacks.onAuthSuccess) {
        this.callbacks.onAuthSuccess();
      }
    } catch (err) {
      this.setErrorMessage(err.message || 'Authentication failed');
    } finally {
      this.setLoading(false);
    }
  }

  async handleForgotSubmit() {
    const email = (this.formData.forgotEmail || '').trim();

    this.setErrorMessage(null);
    this.setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      this.setErrorMessage('Please enter a valid email address');
      return;
    }

    this.setLoading(true);

    try {
      await playFabService.sendPasswordReset(email);
      this.setSuccessMessage('Password recovery email sent. Please check your inbox.');
    } catch (err) {
      this.setErrorMessage(err.message || 'Failed to send recovery email');
    } finally {
      this.setLoading(false);
    }
  }
}
