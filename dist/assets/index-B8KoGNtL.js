(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();class I{constructor(){this.listeners=new Set,this.state={theme:localStorage.getItem("pulse_theme")||"onyx",user:null,cloak:"none",panicKey:"`",panicUrl:"https://google.com",soundEnabled:localStorage.getItem("pulse_sound_enabled")!=="false",searchQuery:"",activeCategory:"all",activeSort:"name-asc",activeGame:null}}getState(){return this.state}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(e){this.listeners.forEach(t=>t(this.state,e))}setTheme(e){this.state.theme=e,localStorage.setItem("pulse_theme",e),document.documentElement.setAttribute("data-theme",e),this.notify("theme")}setUser(e){this.state.user=e,this.notify("user")}setCloak(e){this.state.cloak=e,this.notify("cloak")}setPanicSettings(e,t){this.state.panicKey=e,this.state.panicUrl=t,this.notify("panic")}setSearchQuery(e){this.state.searchQuery=e,this.notify("search")}setActiveCategory(e){this.state.activeCategory=e,this.notify("category")}setActiveSort(e){this.state.activeSort=e,this.notify("sort")}setActiveGame(e){this.state.activeGame=e,this.notify("game")}}const g=new I,L="133616",B=`https://${L}.playfabapi.com/Client`;function x(h,e,t=365){try{const s=new Date(Date.now()+t*864e5).toUTCString();document.cookie=`${h}=${encodeURIComponent(e)}; expires=${s}; path=/; SameSite=Lax`}catch{}}function w(h){try{const e=document.cookie.match(new RegExp("(^|;\\s*)("+h+")=([^;]*)"));return e?decodeURIComponent(e[3]):null}catch{return null}}function E(h){try{document.cookie=`${h}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`}catch{}}class M{constructor(){this.sessionTicket=localStorage.getItem("pulse_session_ticket")||w("pulse_session_ticket")||null,this.playFabId=localStorage.getItem("pulse_playfab_id")||w("pulse_playfab_id")||null,this.currentUser=null;const e=localStorage.getItem("pulse_user")||w("pulse_user");if(e)try{this.currentUser=JSON.parse(e)}catch{this.currentUser=null}this.currentUser&&g.setUser(this.currentUser)}isAuthenticated(){return!!(this.sessionTicket&&this.currentUser)}getSessionTicket(){return this.sessionTicket}getCurrentUser(){return this.currentUser}saveSession(e,t,s){this.sessionTicket=String(e||"").trim(),this.playFabId=String(t||"").trim(),this.currentUser={playFabId:this.playFabId,username:String(s.username||"").trim().slice(0,32),displayName:String(s.displayName||s.username||"User").trim().slice(0,32),email:String(s.email||"").trim().slice(0,100),avatarUrl:String(s.avatarUrl||"").trim(),presence:String(s.presence||"online").toLowerCase(),statusMessage:String(s.statusMessage||"").slice(0,128)},localStorage.setItem("pulse_session_ticket",this.sessionTicket),localStorage.setItem("pulse_playfab_id",this.playFabId),localStorage.setItem("pulse_user",JSON.stringify(this.currentUser)),x("pulse_session_ticket",this.sessionTicket),x("pulse_playfab_id",this.playFabId),x("pulse_user",JSON.stringify(this.currentUser)),x("axk_auth_ticket",this.sessionTicket),g.setUser(this.currentUser)}clearSession(){this.sessionTicket=null,this.playFabId=null,this.currentUser=null,localStorage.removeItem("pulse_session_ticket"),localStorage.removeItem("pulse_playfab_id"),localStorage.removeItem("pulse_user"),localStorage.removeItem("pulse_auth_store"),E("pulse_session_ticket"),E("pulse_playfab_id"),E("pulse_user"),E("axk_auth_ticket"),g.setUser(null)}saveCredentials(e,t){try{const s=JSON.stringify({identifier:String(e||"").trim(),password:String(t||"")});localStorage.setItem("pulse_auth_store",s),x("pulse_auth_store",s)}catch{}}getSavedCredentials(){try{const e=localStorage.getItem("pulse_auth_store")||w("pulse_auth_store");if(e)return JSON.parse(e)}catch{}return null}async tryAutoLogin(){if(this.sessionTicket&&this.currentUser)try{return await this.post("GetAccountInfo",{},!0),!0}catch{}const e=this.getSavedCredentials();if(e&&e.identifier&&e.password)try{return await this.login(e.identifier,e.password),!0}catch{}return!1}async post(e,t,s=!1){const a=`${B}/${e}`,i={"Content-Type":"application/json","X-ReportErrorAsSuccess":"true"};s&&this.sessionTicket&&(i["X-Authentication"]=this.sessionTicket);const r=await(await fetch(a,{method:"POST",headers:i,body:JSON.stringify(t)})).json();if(r.code!==200||r.status&&r.status!=="OK"){const d=r.errorMessage||r.error||"Request failed",l=new Error(d);throw l.playFabData=r,l}return r.data}async login(e,t){const s=e.includes("@"),a=s?"LoginWithEmailAddress":"LoginWithPlayFab",i={TitleId:L,Password:t,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserData:!0,GetUserReadOnlyData:!0}};s?i.Email=e:i.Username=e;const n=await this.post(a,i),r=n.SessionTicket,d=n.PlayFabId,l=n.InfoResultPayload?.AccountInfo||{},u=l.TitleInfo||{};let c={username:l.Username||e,displayName:u.DisplayName||l.Username||e,email:l.PrivateInfo?.Email||(s?e:""),avatarUrl:"",presence:"online",statusMessage:""};const v=n.InfoResultPayload?.UserData||{};if(v.profile&&v.profile.Value)try{const f=JSON.parse(v.profile.Value);c.avatarUrl=f.avatarUrl||c.avatarUrl,c.statusMessage=f.statusMessage||c.statusMessage,c.presence=f.presence||c.presence}catch{}return this.saveCredentials(e,t),this.saveSession(r,d,c),c}async register(e,t,s,a){const i={TitleId:L,Username:e,Email:t,Password:s,DisplayName:a||e,RequireBothUsernameAndEmail:!0},n=await this.post("RegisterPlayFabUser",i),r=n.SessionTicket,d=n.PlayFabId,l={username:e,displayName:a||e,email:t,avatarUrl:"",presence:"online",statusMessage:""};return this.saveCredentials(e,s),this.saveSession(r,d,l),l}async sendPasswordReset(e){const t={TitleId:L,Email:e};return await this.post("SendAccountRecoveryEmail",t)}async updateUserData(e){if(!this.sessionTicket)return;const t={Data:{profile:JSON.stringify(e)},Permission:"Public"};return await this.post("UpdateUserData",t,!0)}async updateUserDisplayName(e){if(this.sessionTicket)return await this.post("UpdateUserTitleDisplayName",{DisplayName:String(e||"").trim().slice(0,32)},!0)}}const y=new M;class A{constructor(){this.enabled=localStorage.getItem("pulse_sound_enabled")!=="false",this.ctx=null}init(){if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}}toggleSound(){return this.enabled=!this.enabled,localStorage.setItem("pulse_sound_enabled",this.enabled?"true":"false"),this.enabled&&this.playClick(),this.enabled}playClick(){if(this.enabled)try{if(this.init(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(800,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(400,this.ctx.currentTime+.05),t.gain.setValueAtTime(.05,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.05),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.05)}catch{}}}const b=new A;class P{constructor(e,{onAuthSuccess:t,onOpenLegal:s,onOpenCredits:a}){this.container=e,this.callbacks={onAuthSuccess:t,onOpenLegal:s,onOpenCredits:a},this.mode="login",this.isOpen=!1,this.isLoading=!1,this.error=null,this.successMessage=null,this.formData={identifier:"",displayName:"",email:"",password:"",forgotEmail:""},this.render()}open(e="login"){this.mode=e,this.isOpen=!0,this.error=null,this.successMessage=null,this.render()}close(){this.isOpen=!1,this.container.innerHTML=""}setErrorMessage(e){this.error=e;const t=this.container.querySelector("#auth-error-banner");if(t){t.style.display=e?"block":"none";const s=t.querySelector("span");s&&(s.textContent=e||"")}}setSuccessMessage(e){this.successMessage=e;const t=this.container.querySelector("#auth-success-banner");t&&(t.style.display=e?"block":"none",t.textContent=e||"")}setLoading(e){this.isLoading=e;const t=this.container.querySelector("#auth-submit-btn");t&&(t.disabled=e,t.textContent=e?"Connecting...":this.mode==="login"?"Login":"Register");const s=this.container.querySelector("#forgot-submit-btn");s&&(s.disabled=e,s.textContent=e?"Sending...":"Send Recovery Email")}render(){if(!this.isOpen){this.container.innerHTML="";return}this.container.innerHTML=`
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
              <span class="auth-subtitle">${this.mode==="login"?"login":this.mode==="register"?"register":"reset password"}</span>
            </div>

            <div class="auth-card-body">
              <div class="auth-tabs">
                <button type="button" class="auth-tab ${this.mode==="login"?"active":""}" id="tab-login-btn">
                  Login
                </button>
                <button type="button" class="auth-tab ${this.mode==="register"?"active":""}" id="tab-register-btn">
                  Register
                </button>
              </div>

              <div class="form-error-banner" id="auth-error-banner" style="${this.error?"display: block;":"display: none;"}">
                <span>${this.escapeHtml(this.error||"")}</span>
              </div>

              <div id="auth-success-banner" class="form-success-banner" style="${this.successMessage?"display: block;":"display: none;"}">
                ${this.escapeHtml(this.successMessage||"")}
              </div>

              ${this.mode==="forgot"?`
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
              `:`
                <form id="auth-form" onsubmit="return false;" class="auth-form-body">
                  <div class="form-group">
                    <label class="form-label" for="auth-identifier">
                      ${this.mode==="login"?"Email or Username":"Username"}
                    </label>
                    <input
                      type="text"
                      id="auth-identifier"
                      class="form-input"
                      placeholder="${this.mode==="login"?"Email or username":"Username"}"
                      value="${this.escapeHtml(this.formData.identifier)}"
                      required
                      autocomplete="username"
                      maxlength="100"
                    />
                  </div>

                  ${this.mode==="register"?`
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
                  `:""}

                  <div class="form-group">
                    <div class="form-label-row">
                      <label class="form-label" for="auth-password">Password</label>
                      ${this.mode==="login"?`
                        <button type="button" class="footer-link-btn" id="link-forgot-btn" style="font-size: 11px;">Forgot?</button>
                      `:""}
                    </div>
                    <input
                      type="password"
                      id="auth-password"
                      class="form-input"
                      placeholder="Password"
                      value="${this.escapeHtml(this.formData.password)}"
                      required
                      autocomplete="${this.mode==="register"?"new-password":"current-password"}"
                      maxlength="64"
                    />
                  </div>

                  <button type="submit" class="form-btn-submit" id="auth-submit-btn">
                    ${this.mode==="login"?"Sign In":"Register Account"}
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
    `,this.attachEvents()}attachEvents(){this.container.querySelector("#auth-identifier")?.addEventListener("input",o=>{this.formData.identifier=o.target.value}),this.container.querySelector("#auth-display-name")?.addEventListener("input",o=>{this.formData.displayName=o.target.value}),this.container.querySelector("#auth-email")?.addEventListener("input",o=>{this.formData.email=o.target.value}),this.container.querySelector("#auth-password")?.addEventListener("input",o=>{this.formData.password=o.target.value}),this.container.querySelector("#forgot-email")?.addEventListener("input",o=>{this.formData.forgotEmail=o.target.value}),this.container.querySelector("#tab-login-btn")?.addEventListener("click",()=>{this.mode="login",this.error=null,this.successMessage=null,this.render()}),this.container.querySelector("#tab-register-btn")?.addEventListener("click",()=>{this.mode="register",this.error=null,this.successMessage=null,this.render()}),this.container.querySelector("#link-forgot-btn")?.addEventListener("click",()=>{this.mode="forgot",this.error=null,this.successMessage=null,this.render()}),this.container.querySelector("#back-to-login-btn")?.addEventListener("click",()=>{this.mode="login",this.error=null,this.successMessage=null,this.render()}),this.container.querySelector("#auth-form")?.addEventListener("submit",o=>{o.preventDefault(),this.handleSubmit()}),this.container.querySelector("#forgot-form")?.addEventListener("submit",o=>{o.preventDefault(),this.handleForgotSubmit()}),this.container.querySelector("#auth-privacy-btn")?.addEventListener("click",()=>{this.callbacks.onOpenLegal&&this.callbacks.onOpenLegal("privacy")}),this.container.querySelector("#auth-terms-btn")?.addEventListener("click",()=>{this.callbacks.onOpenLegal&&this.callbacks.onOpenLegal("terms")}),this.container.querySelector("#auth-copyright-btn")?.addEventListener("click",()=>{this.callbacks.onOpenLegal&&this.callbacks.onOpenLegal("copyright")}),this.container.querySelector("#auth-credits-btn")?.addEventListener("click",()=>{this.callbacks.onOpenCredits&&this.callbacks.onOpenCredits()})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e||"",t.innerHTML}async handleSubmit(){const e=(this.formData.identifier||"").trim(),t=this.formData.password||"",s=(this.formData.email||"").trim(),a=(this.formData.displayName||"").trim().slice(0,32);if(this.setErrorMessage(null),this.setSuccessMessage(null),!e||!t){this.setErrorMessage("Please fill in all required fields");return}if(this.mode==="register"){if(e.length<3){this.setErrorMessage("Username must be at least 3 characters");return}if(!s||!s.includes("@")){this.setErrorMessage("Valid email address is required");return}}if(t.length<6){this.setErrorMessage("Password must be at least 6 characters");return}this.setLoading(!0);try{this.mode==="register"?await y.register(e,s,t,a||e):await y.login(e,t),this.close(),this.callbacks.onAuthSuccess&&this.callbacks.onAuthSuccess()}catch(i){this.setErrorMessage(i.message||"Authentication failed")}finally{this.setLoading(!1)}}async handleForgotSubmit(){const e=(this.formData.forgotEmail||"").trim();if(this.setErrorMessage(null),this.setSuccessMessage(null),!e||!e.includes("@")){this.setErrorMessage("Please enter a valid email address");return}this.setLoading(!0);try{await y.sendPasswordReset(e),this.setSuccessMessage("Password recovery email sent. Please check your inbox.")}catch(t){this.setErrorMessage(t.message||"Failed to send recovery email")}finally{this.setLoading(!1)}}}const U=[{key:"onyx",name:"Onyx",color:"#0a0a0a"},{key:"amoled",name:"AMOLED",color:"#000000"},{key:"blurple",name:"Blurple",color:"#5865f2"},{key:"cyberpunk",name:"Cyberpunk",color:"#00f0ff"},{key:"emerald",name:"Emerald",color:"#10b981"},{key:"crimson",name:"Crimson",color:"#f43f5e"},{key:"sapphire",name:"Sapphire",color:"#38bdf8"},{key:"amethyst",name:"Amethyst",color:"#a855f7"},{key:"amber",name:"Amber",color:"#f59e0b"},{key:"slate",name:"Slate",color:"#56616a"}],C={none:{title:"void",icon:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%2318181b'/></svg>"},google:{title:"Google",icon:"https://www.google.com/favicon.ico"},docs:{title:"Google Docs",icon:"https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"},drive:{title:"Google Drive",icon:"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"},classroom:{title:"Classes",icon:"https://ssl.gstatic.com/classroom/favicon.png"},canvas:{title:"Canvas",icon:"https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico"}};class q{constructor(e,{onOpenLegal:t,onOpenCredits:s,onLogout:a}){this.container=e,this.callbacks={onOpenLegal:t,onOpenCredits:s,onLogout:a},this.isOpen=!1,this.tab="appearance",this.render()}open(e="appearance"){this.tab=e,this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.container.innerHTML=""}render(){if(!this.isOpen){this.container.innerHTML="";return}const e=g.getState(),t=y.getCurrentUser();this.container.innerHTML=`
      <div class="modal-overlay" id="settings-modal-overlay">
        <div class="modal-card" style="max-width: 520px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">Settings</h3>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-subtle);">6.0</span>
            </div>
            <button class="modal-close-btn" id="settings-close-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="auth-tabs" style="margin-bottom: 16px;">
              <button type="button" class="auth-tab ${this.tab==="appearance"?"active":""}" id="set-tab-appearance">
                Appearance
              </button>
              <button type="button" class="auth-tab ${this.tab==="security"?"active":""}" id="set-tab-security">
                Cloak & Panic
              </button>
              <button type="button" class="auth-tab ${this.tab==="account"?"active":""}" id="set-tab-account">
                Account
              </button>
            </div>

            ${this.tab==="appearance"?`
              <div class="settings-section">
                <div class="nav-section-title" style="padding-left: 0; margin-bottom: 10px;">Select Theme</div>
                <div class="theme-grid">
                  ${U.map(s=>`
                    <button type="button" class="theme-select-btn ${e.theme===s.key?"active":""}" data-theme-key="${s.key}">
                      <div class="theme-color-indicator" style="background: ${s.color};"></div>
                      <span>${s.name}</span>
                    </button>
                  `).join("")}
                </div>

                <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                  <div>
                    <div style="font-weight: 600; font-size: 13px;">Sound Effects</div>
                    <div style="font-size: 11px; color: var(--text-muted);">Audio feedback for button triggers</div>
                  </div>
                  <button type="button" class="btn-action" id="settings-sound-toggle">
                    ${b.enabled?"Enabled":"Disabled"}
                  </button>
                </div>
              </div>
            `:this.tab==="security"?`
              <div class="settings-section" style="display: flex; flex-direction: column; gap: 14px;">
                <div class="form-group">
                  <label class="form-label" for="cloak-select-input">Tab Cloaking</label>
                  <select id="cloak-select-input" class="form-input">
                    <option value="none" ${e.cloak==="none"?"selected":""}>Default (void)</option>
                    <option value="google" ${e.cloak==="google"?"selected":""}>Google</option>
                    <option value="docs" ${e.cloak==="docs"?"selected":""}>Google Docs</option>
                    <option value="drive" ${e.cloak==="drive"?"selected":""}>Google Drive</option>
                    <option value="classroom" ${e.cloak==="classroom"?"selected":""}>Google Classroom</option>
                    <option value="canvas" ${e.cloak==="canvas"?"selected":""}>Canvas</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="panic-key-setting">Panic Key Trigger</label>
                  <input type="text" id="panic-key-setting" class="form-input" maxlength="1" value="${this.escapeHtml(e.panicKey||"`")}" placeholder="\`">
                </div>

                <div class="form-group">
                  <label class="form-label" for="panic-url-setting">Panic Redirect Destination</label>
                  <input type="url" id="panic-url-setting" class="form-input" value="${this.escapeHtml(e.panicUrl||"https://google.com")}" placeholder="https://google.com">
                </div>

                <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 8px;">
                  <button type="button" class="form-btn-submit" id="save-panic-config-btn">Save Panic Settings</button>
                  <button type="button" class="btn-action" id="open-about-blank-launcher" style="padding: 10px; width: 100%; text-align: center;">Open in about:blank Frame</button>
                </div>
              </div>
            `:`
              <div class="settings-section" style="display: flex; flex-direction: column; gap: 14px;">
                ${t?`
                  <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                    <div class="avatar" style="width: 44px; height: 44px; font-size: 18px;">
                      ${t.avatarUrl?`<img src="${this.escapeHtml(t.avatarUrl)}" class="avatar-img" alt="" />`:t.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-weight: 700; font-size: 15px;">${this.escapeHtml(t.displayName)}</span>
                      <span style="font-size: 12px; color: var(--text-muted);">@${this.escapeHtml(t.username||t.displayName)}</span>
                      <span style="font-size: 11px; color: var(--text-secondary);">${this.escapeHtml(t.email||"No email")}</span>
                    </div>
                  </div>

                  <button type="button" class="form-btn-submit" id="settings-logout-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-secondary);">
                    Sign Out
                  </button>
                `:`
                  <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                    Not signed in
                  </div>
                `}
              </div>
            `}
          </div>

          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 8px;">
              <button type="button" class="footer-link-btn" id="set-open-priv">Privacy</button>
              <button type="button" class="footer-link-btn" id="set-open-terms">Terms</button>
              <button type="button" class="footer-link-btn" id="set-open-cred">Credits</button>
            </div>
            <button type="button" class="btn-action" id="settings-done-btn">Done</button>
          </div>
        </div>
      </div>
    `,this.attachEvents()}attachEvents(){const e=this.container.querySelector("#settings-modal-overlay");e?.addEventListener("click",o=>{o.target===e&&this.close()}),this.container.querySelector("#settings-close-btn")?.addEventListener("click",()=>this.close()),this.container.querySelector("#settings-done-btn")?.addEventListener("click",()=>this.close()),this.container.querySelector("#set-tab-appearance")?.addEventListener("click",()=>{this.tab="appearance",this.render()}),this.container.querySelector("#set-tab-security")?.addEventListener("click",()=>{this.tab="security",this.render()}),this.container.querySelector("#set-tab-account")?.addEventListener("click",()=>{this.tab="account",this.render()});const r=this.container.querySelector("#settings-sound-toggle");r?.addEventListener("click",()=>{const o=b.toggleSound();r&&(r.textContent=o?"Enabled":"Disabled")}),this.container.querySelectorAll(".theme-select-btn").forEach(o=>{o.addEventListener("click",()=>{const m=o.getAttribute("data-theme-key");m&&(g.setTheme(m),this.render())})}),this.container.querySelector("#cloak-select-input")?.addEventListener("change",o=>{const m=o.target.value;g.setCloak(m);const p=C[m]||C.none;document.title=p.title;let k=document.querySelector("link[rel*='icon']");k&&(k.href=p.icon)}),this.container.querySelector("#save-panic-config-btn")?.addEventListener("click",()=>{const o=this.container.querySelector("#panic-key-setting"),m=this.container.querySelector("#panic-url-setting"),p=o&&o.value?o.value.trim().charAt(0):"`";let k=m&&m.value?m.value.trim():"https://google.com";!k.startsWith("http://")&&!k.startsWith("https://")&&(k="https://"+k),g.setPanicSettings(p,k),localStorage.setItem("void_panic_key",p),localStorage.setItem("void_panic_url",k),this.close()}),this.container.querySelector("#open-about-blank-launcher")?.addEventListener("click",()=>{const o=window.open("about:blank","_blank");if(o&&!o.closed){const m=o.document,p=m.createElement("iframe");p.style.width="100vw",p.style.height="100vh",p.style.border="none",p.style.position="fixed",p.style.top="0",p.style.left="0",p.sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock",p.allow="fullscreen; autoplay; gamepad",p.src=window.location.href,m.body.style.margin="0",m.body.style.height="100vh",m.body.style.overflow="hidden",m.body.appendChild(p)}}),this.container.querySelector("#set-open-priv")?.addEventListener("click",()=>{this.close(),this.callbacks.onOpenLegal&&this.callbacks.onOpenLegal("privacy")}),this.container.querySelector("#set-open-terms")?.addEventListener("click",()=>{this.close(),this.callbacks.onOpenLegal&&this.callbacks.onOpenLegal("terms")}),this.container.querySelector("#set-open-cred")?.addEventListener("click",()=>{this.close(),this.callbacks.onOpenCredits&&this.callbacks.onOpenCredits()}),this.container.querySelector("#settings-logout-btn")?.addEventListener("click",()=>{y.clearSession(),this.close(),this.callbacks.onLogout&&this.callbacks.onLogout()})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e||"",t.innerHTML}}class _{constructor(e){this.container=e,this.isOpen=!1,this.tab="privacy",this.render()}open(e="privacy"){this.tab=e,this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.render()}render(){if(!this.isOpen){this.container.innerHTML="";return}let e="Privacy Policy";this.tab==="terms"&&(e="Terms of Service"),this.tab==="copyright"&&(e="Copyright"),this.container.innerHTML=`
      <div class="modal-overlay" id="legal-modal-overlay">
        <div class="modal-card" style="max-width: 540px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">${e}</h3>
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
              <button type="button" class="auth-tab ${this.tab==="privacy"?"active":""}" id="legal-tab-privacy">
                Privacy Policy
              </button>
              <button type="button" class="auth-tab ${this.tab==="terms"?"active":""}" id="legal-tab-terms">
                Terms of Service
              </button>
              <button type="button" class="auth-tab ${this.tab==="copyright"?"active":""}" id="legal-tab-copyright">
                Copyright
              </button>
            </div>

            ${this.tab==="privacy"?`
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
            `:this.tab==="terms"?`
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
            `:`
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
    `,this.attachEvents()}attachEvents(){const e=this.container.querySelector("#legal-modal-overlay");e?.addEventListener("click",n=>{n.target===e&&this.close()}),this.container.querySelector("#legal-close-btn")?.addEventListener("click",()=>this.close()),this.container.querySelector("#legal-tab-privacy")?.addEventListener("click",()=>{this.tab="privacy",this.render()}),this.container.querySelector("#legal-tab-terms")?.addEventListener("click",()=>{this.tab="terms",this.render()}),this.container.querySelector("#legal-tab-copyright")?.addEventListener("click",()=>{this.tab="copyright",this.render()})}}class O{constructor(e){this.container=e,this.isOpen=!1,this.render()}open(){this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.render()}render(){if(!this.isOpen){this.container.innerHTML="";return}this.container.innerHTML=`
      <div class="modal-overlay" id="credits-modal-overlay">
        <div class="modal-card" style="max-width: 460px;">
          <div class="modal-header">
            <div class="modal-title-box" style="display: flex; align-items: center; gap: 8px;">
              <h3 class="modal-title">Credits & Acknowledgements</h3>
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-subtle);">6.0</span>
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
    `,this.attachEvents()}attachEvents(){const e=this.container.querySelector("#credits-modal-overlay");e?.addEventListener("click",s=>{s.target===e&&this.close()}),this.container.querySelector("#credits-close-btn")?.addEventListener("click",()=>this.close())}}class ${constructor(e,{onClose:t}){this.container=e,this.callbacks={onClose:t},this.currentGame=null,this.isOpen=!1}open(e){this.currentGame=e,this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.currentGame=null,this.container.innerHTML="",this.callbacks.onClose&&this.callbacks.onClose()}render(){if(!this.isOpen||!this.currentGame){this.container.innerHTML="";return}this.container.innerHTML=`
      <section class="player-section">
        <div class="player-toolbar">
          <div class="player-info">
            <span class="player-title">${this.escapeHtml(this.currentGame.title||"Game")}</span>
          </div>
          <div class="player-actions">
            <button type="button" class="btn-action" id="reload-game-btn">Reload</button>
            <button type="button" class="btn-action" id="fullscreen-game-btn">Fullscreen</button>
            <button type="button" class="btn-action" id="open-blank-btn">Popout</button>
            <button type="button" class="btn-action btn-close" id="close-player-btn">Close</button>
          </div>
        </div>
        <div class="player-frame-container" id="player-frame-container">
          <iframe id="game-frame" class="game-frame" src="${this.escapeHtml(this.currentGame.url)}" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock" allow="fullscreen; autoplay; gamepad"></iframe>
        </div>
      </section>
    `,this.attachEvents()}attachEvents(){this.container.querySelector("#close-player-btn")?.addEventListener("click",()=>this.close()),this.container.querySelector("#reload-game-btn")?.addEventListener("click",()=>{const i=this.container.querySelector("#game-frame");i&&this.currentGame&&(i.src=this.currentGame.url)}),this.container.querySelector("#fullscreen-game-btn")?.addEventListener("click",()=>{const i=this.container.querySelector("#player-frame-container");i&&(document.fullscreenElement?document.exitFullscreen&&document.exitFullscreen():i.requestFullscreen&&i.requestFullscreen())}),this.container.querySelector("#open-blank-btn")?.addEventListener("click",()=>{if(!this.currentGame||!this.currentGame.url)return;const i=window.open("about:blank","_blank");if(i&&!i.closed){const n=i.document,r=n.createElement("iframe");r.style.width="100vw",r.style.height="100vh",r.style.border="none",r.style.position="fixed",r.style.top="0",r.style.left="0",r.sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock",r.allow="fullscreen; autoplay; gamepad",r.src=this.currentGame.url,n.body.style.margin="0",n.body.style.height="100vh",n.body.style.overflow="hidden",n.body.appendChild(r)}})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e||"",t.innerHTML}}const H=[],N=[{id:"all",name:"All Games"},{id:"action",name:"Action"},{id:"arcade",name:"Arcade"},{id:"puzzle",name:"Puzzle"},{id:"multiplayer",name:"Multiplayer"},{id:"favorites",name:"Favorites"}];class D{constructor(){this.appRoot=document.getElementById("app"),this.authModal=null,this.settingsModal=null,this.legalModal=null,this.creditsModal=null,this.gamePlayer=null,this.init()}async init(){const e=localStorage.getItem("pulse_theme")||"onyx";g.setTheme(e);const t=localStorage.getItem("void_panic_key")||"`",s=localStorage.getItem("void_panic_url")||"https://google.com";g.setPanicSettings(t,s),this.setupPanicListener(),this.setupSharedCookieBridge(),this.renderShell(),this.initModals(),!await y.tryAutoLogin()&&!y.isAuthenticated()?this.authModal.open("login"):this.updateUserProfilePanel(),this.renderCatalog(),this.attachGlobalEvents(),g.subscribe((i,n)=>{n==="user"&&this.updateUserProfilePanel(),(n==="category"||n==="search"||n==="sort")&&this.renderCatalog()})}setupSharedCookieBridge(){window.addEventListener("message",e=>{if(!(!e.data||typeof e.data!="object")&&e.data.type==="PULSE_AUTH_SYNC"){const{sessionTicket:t,playFabId:s,userProfile:a}=e.data;t&&a&&(y.saveSession(t,s,a),this.authModal&&this.authModal.isOpen&&this.authModal.close(),this.updateUserProfilePanel())}})}setupPanicListener(){window.addEventListener("keydown",e=>{const t=document.activeElement;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"))return;const s=g.getState();e.key===s.panicKey&&(e.preventDefault(),window.location.replace(s.panicUrl||"https://google.com"))})}renderShell(){this.appRoot.innerHTML=`
      <div class="void-layout">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="brand-wrapper">
              <div class="brand-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
                  <circle cx="12" cy="12" r="9"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h1 class="brand-title">void</h1>
            </div>
            <button type="button" class="icon-btn" id="sidebar-settings-btn" title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          <div class="sidebar-content">
            <div class="nav-section-title">Library</div>
            <ul class="category-list" id="category-nav-list">
              ${N.map(e=>`
                <li class="category-nav-item ${e.id==="all"?"active":""}" data-cat-id="${e.id}">
                  <span>${e.name}</span>
                </li>
              `).join("")}
            </ul>
          </div>

          <div class="sidebar-footer">
            <div class="sidebar-footer-user">
              <button type="button" class="user-profile-btn" id="sidebar-user-panel-btn">
                <div class="avatar-wrapper">
                  <div class="avatar" id="footer-user-avatar">?</div>
                  <div class="presence-badge-dot dot-online" id="footer-presence-dot"></div>
                </div>
                <div class="user-info-text">
                  <span class="user-display-name" id="footer-user-name">Guest</span>
                  <span class="user-status-text" id="footer-user-status">PULSE ON TOP!</span>
                </div>
              </button>

              <button type="button" class="icon-btn" id="sidebar-sound-btn" title="Toggle Sound">
                <svg id="sound-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  ${b.enabled?'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>':'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>'}
                </svg>
              </button>
            </div>

            <div class="sidebar-footer-links">
              <button type="button" class="footer-link-btn" id="footer-keys-btn">Keys</button>
              <span class="footer-dot">•</span>
              <button type="button" class="footer-link-btn" id="footer-privacy-btn">Privacy</button>
              <span class="footer-dot">•</span>
              <button type="button" class="footer-link-btn" id="footer-terms-btn">Terms</button>
              <span class="footer-dot">•</span>
              <button type="button" class="footer-link-btn" id="footer-credits-btn">Credits</button>
              <span class="footer-version-tag">6.0</span>
            </div>
          </div>
        </aside>

        <main class="main-viewport">
          <header class="top-navbar">
            <div class="search-input-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="top-search-input" class="search-field" placeholder="Search catalog..." autocomplete="off" spellcheck="false">
            </div>

            <div class="top-navbar-actions">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </header>

          <div class="content-scrollable" id="main-content-scrollable">
            <div id="game-player-host"></div>
            <section class="catalog-section" id="catalog-host">
              <div class="games-grid" id="games-grid">
                <div class="empty-state" id="empty-state">
                  <div class="empty-box">
                    <div class="empty-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <h2 class="empty-title">No Games Installed</h2>
                    <p class="empty-description">The unblocked platform shell is loaded. When games are added, they will appear here ready to launch.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <div id="modal-container-auth"></div>
      <div id="modal-container-settings"></div>
      <div id="modal-container-legal"></div>
      <div id="modal-container-credits"></div>
    `}initModals(){const e=document.getElementById("modal-container-auth"),t=document.getElementById("modal-container-settings"),s=document.getElementById("modal-container-legal"),a=document.getElementById("modal-container-credits"),i=document.getElementById("game-player-host");this.legalModal=new _(s),this.creditsModal=new O(a),this.settingsModal=new q(t,{onOpenLegal:n=>this.legalModal.open(n),onOpenCredits:()=>this.creditsModal.open(),onLogout:()=>{this.updateUserProfilePanel(),this.authModal.open("login")}}),this.authModal=new P(e,{onAuthSuccess:()=>{this.updateUserProfilePanel()},onOpenLegal:n=>this.legalModal.open(n),onOpenCredits:()=>this.creditsModal.open()}),this.gamePlayer=new $(i,{onClose:()=>{const n=document.getElementById("catalog-host");n&&(n.style.display="block")}})}updateUserProfilePanel(){const e=y.getCurrentUser(),t=document.getElementById("footer-user-name"),s=document.getElementById("footer-user-status"),a=document.getElementById("footer-user-avatar"),i=document.getElementById("footer-presence-dot");if(!e){t&&(t.textContent="Guest"),s&&(s.textContent="Click to Sign In"),a&&(a.textContent="?"),i&&(i.className="presence-badge-dot dot-offline");return}t&&(t.textContent=e.displayName||e.username||"User"),s&&(s.textContent=e.statusMessage||"PULSE ON TOP!"),i&&(i.className=`presence-badge-dot dot-${e.presence||"online"}`),a&&(e.avatarUrl?a.innerHTML=`<img src="${this.escapeHtml(e.avatarUrl)}" class="avatar-img" alt="" />`:a.textContent=(e.displayName||e.username||"U").charAt(0).toUpperCase())}renderCatalog(){const e=document.getElementById("games-grid"),t=document.getElementById("empty-state");if(!e||!t)return;const s=g.getState(),a=(s.searchQuery||"").trim().toLowerCase(),i=s.activeCategory||"all";let n=H.filter(d=>{const l=!a||d.title&&d.title.toLowerCase().includes(a),u=i==="all"||d.category&&d.category.toLowerCase()===i;return l&&u});if(e.querySelectorAll(".game-card").forEach(d=>d.remove()),n.length===0){t.style.display="flex";return}t.style.display="none",n.forEach(d=>{const l=document.createElement("div");l.className="game-card",l.tabIndex=0;const u=document.createElement("div");u.className="game-card-thumb";const c=document.createElement("div");c.className="game-card-body";const v=document.createElement("div");v.className="game-card-title",v.textContent=d.title||"Untitled";const f=document.createElement("div");f.className="game-card-category",f.textContent=d.category||"General",c.appendChild(v),c.appendChild(f),l.appendChild(u),l.appendChild(c),l.addEventListener("click",()=>{const S=document.getElementById("catalog-host");S&&(S.style.display="none"),this.gamePlayer.open(d)}),e.appendChild(l)})}attachGlobalEvents(){document.getElementById("top-search-input")?.addEventListener("input",u=>{g.setSearchQuery(u.target.value)});const t=document.querySelectorAll(".category-nav-item");t.forEach(u=>{u.addEventListener("click",()=>{t.forEach(v=>v.classList.remove("active")),u.classList.add("active");const c=u.getAttribute("data-cat-id")||"all";g.setActiveCategory(c)})}),document.getElementById("sidebar-settings-btn")?.addEventListener("click",()=>{b.playClick(),this.settingsModal.open("appearance")}),document.getElementById("sidebar-user-panel-btn")?.addEventListener("click",()=>{b.playClick(),y.isAuthenticated()?this.settingsModal.open("account"):this.authModal.open("login")}),document.getElementById("sidebar-sound-btn")?.addEventListener("click",()=>{const u=b.toggleSound(),c=document.getElementById("sound-icon-svg");c&&(c.innerHTML=u?'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>':'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>')}),document.getElementById("footer-keys-btn")?.addEventListener("click",()=>{b.playClick(),this.settingsModal.open("security")}),document.getElementById("footer-privacy-btn")?.addEventListener("click",()=>{b.playClick(),this.legalModal.open("privacy")}),document.getElementById("footer-terms-btn")?.addEventListener("click",()=>{b.playClick(),this.legalModal.open("terms")}),document.getElementById("footer-credits-btn")?.addEventListener("click",()=>{b.playClick(),this.creditsModal.open()})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e||"",t.innerHTML}}document.addEventListener("DOMContentLoaded",()=>{new D});
