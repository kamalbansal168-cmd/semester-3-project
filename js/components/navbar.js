/* ============================================================
   LEARNPATH AI — Clean SaaS Navigation Bar Component
   ============================================================ */

export function renderNavbar(state, activeRoute, isLoggedIn = false) {
  const user = state.user;

  // If on landing or auth pages, render Landing Top Nav with Sign In / Sign Up buttons
  if (activeRoute === 'landing' || activeRoute === 'signin' || activeRoute === 'signup' || !isLoggedIn) {
    return `
      <header class="landing-header">
        <div class="landing-nav-container">
          <!-- Brand -->
          <a class="brand-wrapper" data-route="landing">
            <div class="brand-logo-icon">L</div>
            <div class="brand-text">
              <div class="brand-name">
                LearnPath <span class="ai-tag">AI</span>
              </div>
              <div class="brand-tagline-mini">Understand your mistakes. Improve your concepts.</div>
            </div>
          </a>

          <!-- Landing Nav Links -->
          <ul class="landing-nav-links">
            <li><a class="landing-nav-link" data-route="landing">Home</a></li>
            <li><a class="landing-nav-link" data-route="topics">Topics</a></li>
            <li><a class="landing-nav-link" data-route="practice">Practice</a></li>
            <li><a class="landing-nav-link" data-route="playground" data-qid="tp_code_01">Coding IDE</a></li>
          </ul>

          <!-- Landing Nav Actions -->
          <div class="landing-nav-actions">
            <button class="btn btn-secondary btn-sm" data-route="signin" id="nav-btn-signin">
              Sign In
            </button>
            <button class="btn btn-primary btn-sm" data-route="signup" id="nav-btn-signup">
              Get Started Free →
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Logged In Student Application Navigation
  return `
    <header class="main-header">
      <div class="nav-container">
        <!-- Brand -->
        <a class="brand-wrapper" data-route="dashboard">
          <div class="brand-logo-icon">L</div>
          <div class="brand-text">
            <div class="brand-name">
              LearnPath <span class="ai-tag">AI</span>
            </div>
            <div class="brand-tagline-mini">Understand your mistakes. Improve your concepts.</div>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links" id="desktop-nav-links">
          <li>
            <a class="nav-item ${activeRoute === 'dashboard' ? 'active' : ''}" data-route="dashboard">
              <span class="nav-icon">📊</span> Dashboard
            </a>
          </li>
          <li>
            <a class="nav-item ${activeRoute === 'topics' || activeRoute === 'practice' ? 'active' : ''}" data-route="topics">
              <span class="nav-icon">🎯</span> Practice
            </a>
          </li>
          <li>
            <a class="nav-item ${activeRoute === 'recovery' || activeRoute === 'explanation' ? 'active' : ''}" data-route="recovery">
              <span class="nav-icon">🚀</span> My Learning
            </a>
          </li>
          <li>
            <a class="nav-item ${activeRoute === 'progress' ? 'active' : ''}" data-route="progress">
              <span class="nav-icon">📈</span> Progress
            </a>
          </li>
          <li>
            <a class="nav-item ${activeRoute === 'mistakes' ? 'active' : ''}" data-route="mistakes">
              <span class="nav-icon">📝</span> Review Mistakes
            </a>
          </li>
        </ul>

        <!-- Right Side: Streak, Profile & Logout -->
        <div class="nav-right">
          ${user.streakDays > 0 ? `
            <div class="streak-badge" title="${user.streakDays} Day Learning Streak">
              <span class="flame">🔥</span>
              <span>${user.streakDays}d Streak</span>
            </div>
          ` : ''}

          <div class="user-profile-menu" data-route="profile" title="View Profile">
            <div class="user-avatar">${user.avatar || 'S'}</div>
            <div class="user-info">
              <span class="user-name">${user.name}</span>
              <span class="user-role">${user.level}</span>
            </div>
          </div>

          <button class="btn btn-secondary btn-sm" id="btn-logout" title="Log Out" style="font-size: 0.8rem; padding: 4px 10px;">
            Log Out
          </button>

          <button class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  `;
}
