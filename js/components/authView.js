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
          <button class="auth-tab-btn ${!isSignUp ? 'active' : ''}" id="tab-auth-signin" data-route="signin">
            Sign In
          </button>
          <button class="auth-tab-btn ${isSignUp ? 'active' : ''}" id="tab-auth-signup" data-route="signup">
            Create Account
          </button>
        </div>

        <!-- Auth Form -->
        <form id="main-auth-form" style="display: flex; flex-direction: column; gap: 14px;" onsubmit="event.preventDefault();">
          ${isSignUp ? `
            <div class="form-group">
              <label class="form-label" for="auth-fullname">Full Name</label>
              <input type="text" id="auth-fullname" class="form-input" placeholder="e.g. Aryan Sharma" value="Aryan" required />
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label" for="auth-email">Email Address</label>
            <input type="email" id="auth-email" class="form-input" placeholder="student@example.com" value="student@example.com" required />
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label" for="auth-password">Password</label>
              ${!isSignUp ? `<a href="#" style="font-size: 0.78rem; color: var(--primary);">Forgot Password?</a>` : ''}
            </div>
            <input type="password" id="auth-password" class="form-input" placeholder="••••••••" value="password123" required />
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

          <button type="button" class="btn btn-primary btn-lg" id="btn-submit-auth-action" style="width: 100%; margin-top: 6px;">
            ${isSignUp ? 'Create Account & Start Learning →' : 'Sign In to Dashboard →'}
          </button>
        </form>

        <div style="text-align: center; margin-top: 6px;">
          <a data-route="landing" style="font-size: 0.88rem; color: var(--text-muted); font-weight: 600;">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  `;
}
