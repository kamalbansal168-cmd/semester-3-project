/* ============================================================
   LEARNPATH AI — Profile & Settings View (Fresh Model)
   ============================================================ */

export function renderProfileView(state) {
  const user = state.user;
  const metrics = state.metrics;

  return `
    <div class="profile-view">
      <!-- Profile Hero Card -->
      <div class="profile-hero-card">
        <div class="profile-avatar-big">${user.avatar || 'S'}</div>
        <div class="profile-info">
          <h1 class="profile-name">${user.name}</h1>
          <div class="profile-email">${user.email}</div>
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <span class="badge badge-good">${user.level}</span>
            <span class="badge badge-strong">Java Arrays Track</span>
          </div>
        </div>
      </div>

      <!-- Live Stats Grid -->
      <div class="snapshot-grid">
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper mastery">🎯</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Overall Mastery</span>
            <span class="snapshot-value">${metrics.overallMastery}%</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper questions">⚡</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Questions Solved</span>
            <span class="snapshot-value">${metrics.questionsSolved}</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper concepts">💡</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Concepts Mastered</span>
            <span class="snapshot-value">${metrics.conceptsMastered}</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper streak">🔥</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Streak Days</span>
            <span class="snapshot-value">${user.streakDays}</span>
          </div>
        </div>
      </div>

      <!-- Account Settings & Reset Progress -->
      <div class="persona-switch-card">
        <h3 class="card-title">Account & Learning Progress Settings</h3>
        <p class="card-subtitle">
          Manage your student profile and progress state. You can reset your progress back to 0 at any time.
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-top: 10px;">
          <div>
            <div style="font-weight: 800; color: var(--text-main); font-size: 0.98rem;">
              Reset Learning Progress
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
              Clears all question attempts, mastery scores, and green ticks back to a clean 0% baseline.
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-reset-fresh-progress" style="color: var(--danger); border-color: var(--danger-border); font-weight: 700;">
            🗑️ Reset All Progress to 0%
          </button>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
          <button class="btn btn-primary" data-route="dashboard">
            Back to Dashboard →
          </button>
        </div>
      </div>
    </div>
  `;
}
