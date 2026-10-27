import { renderStreakHeatmapCard } from '../engine/streakEngine.js';

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
          <div style="display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap;">
            <span class="badge badge-good">⭐ ${user.points || 0} XP Points</span>
            <span class="badge badge-strong">${user.rank || 'Novice Developer'}</span>
            <span class="badge badge-neutral">Level: ${user.level || 'Beginner'}</span>
            <span class="badge badge-good" style="background: rgba(56, 189, 248, 0.15); color: #0284c7; border: 1px solid rgba(56, 189, 248, 0.3);">🔥 ${user.streakDays || 0} Day Streak</span>
          </div>
        </div>
      </div>

      <!-- LeetCode Style Submission Heatmap & Streak System -->
      ${renderStreakHeatmapCard(state)}

      <!-- Live Stats Grid -->
      <div class="snapshot-grid">
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper questions">⭐</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Total Points (XP)</span>
            <span class="snapshot-value">${user.points || 0} pts</span>
          </div>
        </div>
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
      </div>

      <!-- Research & Empirical Study (EHKT Paper Data Exporter) -->
      <div class="persona-switch-card" style="margin-top: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <h3 class="card-title" style="margin: 0; display: flex; align-items: center; gap: 8px;">
            <span>🔬</span> EHKT Research Study Data Exporter
          </h3>
          <span class="badge badge-strong" style="font-size: 0.72rem;">IEEE / Springer Evaluation</span>
        </div>
        <p class="card-subtitle" style="margin-top: 6px;">
          Export your interaction log (questions, accuracy, response time, misconception tags, and recovery trajectories) as a standardized JSON dataset for <code>evaluate.py</code> model benchmarking.
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-top: 12px; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-weight: 800; color: var(--text-main); font-size: 0.95rem;">
              Download Interaction Dataset (JSON)
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
              Directly loads into <code>python evaluate.py</code> to calculate AUC, F1-Score, Recovery Rate, and Wilcoxon significance.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-export-research-data" style="font-weight: 700; display: flex; align-items: center; gap: 6px;">
            📥 Export Dataset (.json)
          </button>
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
