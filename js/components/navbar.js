/* ============================================================
   LEARNPATH AI – Clean SaaS Navigation Bar Component
   3-Dot Dropdown Menu (replaces congested nav links)
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
          <!-- Fix N6: data-requires-auth added to protected routes so app.js can redirect to login -->
          <ul class="landing-nav-links">
            <li><a class="landing-nav-link" data-route="landing">Home</a></li>
            <li><a class="landing-nav-link" data-route="topics" data-requires-auth="true">Topics</a></li>
            <li><a class="landing-nav-link" data-route="practice" data-requires-auth="true">Practice</a></li>
            <li><a class="landing-nav-link" data-route="playground" data-qid="tp_code_01" data-requires-auth="true">Coding IDE</a></li>
            <li><a class="landing-nav-link" data-route="battle" data-requires-auth="true">⚔️ Code Battle</a></li>
          </ul>

          <!-- Landing Nav Actions -->
          <div class="landing-nav-actions">
            <button class="btn btn-secondary btn-sm" data-route="signin" id="nav-btn-signin">
              Sign In
            </button>
            <button class="btn btn-primary btn-sm" data-route="signup" id="nav-btn-signup">
              Get Started Free 🚀
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Helper: get active label for current route
  const activeLabel = {
    dashboard: 'Dashboard',
    battle: '⚔️ Code Battle Arena',
    playground: 'Coding IDE',
    topics: 'Practice',
    practice: 'Practice',
    recovery: 'My Learning',
    explanation: 'My Learning',
    progress: 'Progress',
    mistakes: 'Review Mistakes',
    profile: 'Profile',
    notes: 'Notes',
    'vscode-studio': '🌍 VS Code Studio',
    evaluation: '🔬 Research Evaluation',
    admin: '👑 Executive Admin Portal',
  }[activeRoute] || '';

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

        <!-- Active Route Pill (shows current page name) -->
        ${activeLabel ? `<div class="nav-active-pill">${activeLabel}</div>` : ''}

        <!-- Right Side: Battle Button, Points, Streak, Profile, 3-Dot Menu & Logout -->
        <div class="nav-right">
          ${(user.role === 'admin' || user.email === 'admin@learnpath.edu') ? `
            <!-- Executive Super Admin Button (Visible ONLY to Authenticated Owner) -->
            <button class="btn btn-sm nav-admin-btn" data-route="admin" style="display:flex;align-items:center;gap:6px;font-weight:700;background:rgba(234, 179, 8, 0.15);color:#facc15;border:1px solid rgba(250, 204, 21, 0.4);border-radius:8px;padding:6px 12px;cursor:pointer;" title="Owner / Super Admin Dashboard">
              <span>👑</span>
              <span>Admin Panel</span>
            </button>
          ` : ''}

          <!-- Prominent Code Battle Arena Button -->
          <button class="btn btn-sm btn-primary nav-battle-btn" data-route="battle" style="display:flex;align-items:center;gap:6px;font-weight:700;background:linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%);border:none;box-shadow:0 2px 8px rgba(239, 68, 68, 0.35);">
            <span>⚔️</span>
            <span>Battle Arena</span>
          </button>

          <div class="points-badge" id="nav-points-badge" title="Earned XP Points (2 pts per question)">
            <span class="star-icon">⭐</span>
            <span class="points-val">${user.points || 0}</span>
            <span class="points-label">pts</span>
          </div>

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

          <!-- 3-Dot Navigation Menu -->
          <div class="nav-dots-wrapper" id="nav-dots-wrapper">
            <button class="nav-dots-btn" id="nav-dots-toggle" title="Navigation Menu" aria-label="Open navigation menu" aria-expanded="false">
              <span></span>
              <span></span>
              <span></span>
            </button>

            <!-- Dropdown Menu -->
            <div class="nav-dots-dropdown" id="nav-dots-dropdown" role="menu" aria-hidden="true">
              <div class="nav-dropdown-header">Navigation</div>
              <a class="nav-dropdown-item ${activeRoute === 'dashboard' ? 'active' : ''}" data-route="dashboard" role="menuitem">
                <span class="nav-dropdown-icon">📊</span>
                <span>Dashboard</span>
                ${activeRoute === 'dashboard' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'battle' ? 'active' : ''}" data-route="battle" role="menuitem">
                <span class="nav-dropdown-icon">⚔️</span>
                <span>Code Battle Arena</span>
                ${activeRoute === 'battle' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'playground' ? 'active' : ''}" data-route="playground" data-qid="tp_code_01" role="menuitem">
                <span class="nav-dropdown-icon">💻</span>
                <span>Coding IDE</span>
                ${activeRoute === 'playground' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'vscode-studio' ? 'active' : ''}" data-route="vscode-studio" role="menuitem">
                <span class="nav-dropdown-icon">🌍</span>
                <span>Open World (VS Code)</span>
                ${activeRoute === 'vscode-studio' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'topics' || activeRoute === 'practice' ? 'active' : ''}" data-route="topics" role="menuitem">
                <span class="nav-dropdown-icon">🎯</span>
                <span>Practice</span>
                ${activeRoute === 'topics' || activeRoute === 'practice' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'recovery' || activeRoute === 'explanation' ? 'active' : ''}" data-route="recovery" role="menuitem">
                <span class="nav-dropdown-icon">📚</span>
                <span>My Learning</span>
                ${activeRoute === 'recovery' || activeRoute === 'explanation' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'progress' ? 'active' : ''}" data-route="progress" role="menuitem">
                <span class="nav-dropdown-icon">📈</span>
                <span>Progress</span>
                ${activeRoute === 'progress' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'mistakes' ? 'active' : ''}" data-route="mistakes" role="menuitem">
                <span class="nav-dropdown-icon">🔍</span>
                <span>Review Mistakes</span>
                ${activeRoute === 'mistakes' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              <a class="nav-dropdown-item ${activeRoute === 'evaluation' ? 'active' : ''}" data-route="evaluation" role="menuitem">
                <span class="nav-dropdown-icon">🔬</span>
                <span>Research Evaluation</span>
                ${activeRoute === 'evaluation' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
              </a>
              ${(user.role === 'admin' || user.email === 'admin@learnpath.edu') ? `
                <a class="nav-dropdown-item ${activeRoute === 'admin' ? 'active' : ''}" data-route="admin" role="menuitem">
                  <span class="nav-dropdown-icon">👑</span>
                  <span>Executive Admin Portal</span>
                  ${activeRoute === 'admin' ? '<span class="nav-dropdown-active-dot"></span>' : ''}
                </a>
              ` : ''}
              <a class="nav-dropdown-item" id="nav-btn-feedback" role="menuitem" style="cursor: pointer;">
                <span class="nav-dropdown-icon">💬</span>
                <span>Give Feedback</span>
              </a>
              <div class="nav-dropdown-divider"></div>
              <button class="nav-dropdown-item nav-dropdown-logout" id="btn-logout" role="menuitem">
                <span class="nav-dropdown-icon">🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  `;
}
