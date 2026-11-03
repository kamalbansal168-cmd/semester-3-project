/* ============================================================
   LEARNPATH AI — Clean Sign In & Sign Up Component
   ============================================================ */

export function renderAuthView(isSignUp = false) {
  return `
    <div class="auth-page-container">
      <div class="auth-card">
        <!-- Brand Header -->
        <div class="auth-header-center">
          <div class="brand-logo-icon" style="width: 48px; height: 48px; font-size: 1.4rem;">L</div>
          <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-main);">
            ${isSignUp ? 'Create Your Account' : 'Sign In to LearnPath'}
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-muted);">
            "Understand your mistakes. Improve your concepts."
          </p>
        </div>

        <!-- Sign In / Sign Up Tabs -->
        <div class="auth-tabs-bar">
          <button type="button" class="auth-tab-btn ${!isSignUp ? 'active' : ''}" id="tab-auth-signin" data-route="signin">
            Sign In
          </button>
          <button type="button" class="auth-tab-btn ${isSignUp ? 'active' : ''}" id="tab-auth-signup" data-route="signup">
            Create Account
          </button>
        </div>

        ${!isSignUp ? `
          <!-- Quick Demo Credentials Helper Box -->
          <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 12px 14px; font-size: 0.82rem;">
            <div style="font-weight: 700; color: #334155; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span>⚡</span> Quick Demo Credentials:
              </span>
              <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Click to Auto-Fill</span>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-sm" id="btn-quick-fill-student" style="padding: 5px 10px; font-size: 0.78rem; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; border-radius: 6px; font-weight: 700; cursor: pointer;">
                🎓 Demo Student (student@example.com)
              </button>
              <button type="button" class="btn btn-sm" id="btn-quick-fill-admin" style="padding: 5px 10px; font-size: 0.78rem; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; border-radius: 6px; font-weight: 700; cursor: pointer;">
                👑 Super Admin (admin@learnpath.edu)
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Auth Form -->
        <form id="main-auth-form" style="display: flex; flex-direction: column; gap: 14px;">
          ${isSignUp ? `
            <div class="form-group">
              <label class="form-label" for="auth-fullname">Full Name</label>
              <input type="text" id="auth-fullname" class="form-input" placeholder="e.g. Aryan Sharma" required autocomplete="name" />
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label" for="auth-email">Email Address</label>
            <input type="email" id="auth-email" class="form-input" placeholder="student@example.com" required autocomplete="email" />
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label" for="auth-password">Password</label>
              ${!isSignUp ? `
                <button type="button" id="btn-forgot-password" style="background: none; border: none; padding: 0; font-size: 0.78rem; color: var(--primary); cursor: pointer; text-decoration: underline; font-family: inherit;">
                  Forgot Password?
                </button>
              ` : ''}
            </div>
            <div style="position: relative; display: flex; align-items: center;">
              <input type="password" id="auth-password" class="form-input" placeholder="Min. 6 characters" required autocomplete="current-password" style="padding-right: 42px;" />
              <button type="button" id="btn-toggle-auth-password" style="position: absolute; right: 12px; background: none; border: none; cursor: pointer; font-size: 1rem; color: #64748b; padding: 0; display: flex; align-items: center;" title="Show or hide password">
                👁️
              </button>
            </div>
          </div>

          ${isSignUp ? `
            <div class="form-group">
              <label class="form-label" for="auth-track">Primary Subject Track</label>
              <select id="auth-track" class="form-input">
                <option value="java">☕ Java & Arrays Data Structures</option>
                <option value="python">🐍 Python Algorithms</option>
                <option value="dsa">⚡ Core DSA</option>
              </select>
            </div>
          ` : ''}

          <button type="submit" class="btn btn-primary btn-lg" id="btn-submit-auth-action" style="width: 100%; margin-top: 6px;">
            ${isSignUp ? 'Create Account & Start Learning →' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <div style="text-align: center; margin-top: 6px;">
          <a data-route="landing" style="font-size: 0.88rem; color: var(--text-muted); font-weight: 600; cursor: pointer;">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  `;
}
