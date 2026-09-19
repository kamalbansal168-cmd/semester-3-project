/* ============================================================
   LEARNPATH AI — Progress & Analytics View
   ============================================================ */

export function renderProgressView(state) {
  const metrics = state.metrics;
  const topics = state.topics;

  return `
    <div class="progress-view">
      <!-- Progress Header -->
      <div class="progress-header">
        <div>
          <h1>Your Learning Progress & Analytics</h1>
          <p>Detailed performance trajectory, accuracy trends, and verified concept recoveries.</p>
        </div>
        <button class="btn btn-primary" data-route="practice">
          Continue Practice →
        </button>
      </div>

      <!-- 4 High-Level Metric Cards -->
      <div class="progress-metrics-row">
        <div class="progress-metric-card">
          <span class="metric-card-label">Overall Concept Mastery</span>
          <span class="metric-card-val">${metrics.overallMastery}%</span>
          <span class="metric-card-sub" style="color: var(--success);">▲ +${metrics.improvementGain}% this week</span>
        </div>
        <div class="progress-metric-card">
          <span class="metric-card-label">Avg Solving Time</span>
          <span class="metric-card-val">${Math.floor(metrics.avgSolvingTimeSeconds / 60)}m ${metrics.avgSolvingTimeSeconds % 60}s</span>
          <span class="metric-card-sub">Optimal for Array questions</span>
        </div>
        <div class="progress-metric-card">
          <span class="metric-card-label">Concepts Mastered</span>
          <span class="metric-card-val">${metrics.conceptsMastered}</span>
          <span class="metric-card-sub">Mastery &ge; 75%</span>
        </div>
        <div class="progress-metric-card">
          <span class="metric-card-label">Recovery Gain</span>
          <span class="metric-card-val" style="color: var(--success);">+35%</span>
          <span class="metric-card-sub">Two Pointer (32% ➔ 67%)</span>
        </div>
      </div>

      <!-- Charts & Visual Breakdown Grid -->
      <div class="charts-grid">
        <!-- 3-Week Accuracy Trend Bar Chart -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">Accuracy Trend</h3>
            <span class="badge badge-strong">+17% Over 3 Weeks</span>
          </div>
          
          <div class="chart-plain-explanation">
            <span>💡</span>
            <span><strong>Plain Language Insight:</strong> Your overall solving accuracy improved from 54% in Week 1 to 71% this week as index boundary errors decreased.</span>
          </div>

          <div class="trend-visual-box">
            ${state.accuracyTrends.map(t => {
              const height = Math.min(100, Math.max(20, t.accuracy));
              return `
                <div class="trend-week-col">
                  <div class="trend-bar-track">
                    <div class="trend-bar-fill" style="height: ${height}%;">
                      <span class="trend-bar-val">${t.accuracy}%</span>
                    </div>
                  </div>
                  <span class="trend-week-label">${t.week}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Topic Mastery Distribution -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">Concept Mastery Breakdown</h3>
            <span class="badge badge-neutral">Java Arrays</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${topics.map(t => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 3px;">
                  <span>${t.name}</span>
                  <span>${t.mastery}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill ${getMasteryClass(t.mastery)}" style="width: ${t.mastery}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Resolved Concepts vs Persistent Focus Areas Grid -->
      <div class="concepts-resolution-grid">
        <!-- Resolved Concepts -->
        <div class="resolution-card resolved">
          <div class="card-header">
            <h3 class="card-title" style="color: var(--success-text);">✓ Resolved Concepts</h3>
            <span class="badge badge-strong">${state.resolvedConcepts.length} Concepts</span>
          </div>
          <p class="card-subtitle">Concept gaps successfully closed through personalized recovery paths:</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${state.resolvedConcepts.map(rc => `
              <div class="res-item-row">
                <div>
                  <div style="color: var(--text-main); font-weight: 700;">${rc.name}</div>
                  <div style="font-size: 0.76rem; color: var(--text-light);">Resolved: ${rc.resolvedDate}</div>
                </div>
                <div class="badge badge-strong">
                  ${rc.previousMastery}% ➔ ${rc.currentMastery}%
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Persistent Focus Areas -->
        <div class="resolution-card in-progress">
          <div class="card-header">
            <h3 class="card-title" style="color: var(--warning-text);">⚠️ Current Focus Areas</h3>
            <span class="badge badge-improving">${state.focusAreas.length} Areas</span>
          </div>
          <p class="card-subtitle">Topics prioritized by the adaptive engine for your next sessions:</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${state.focusAreas.map(fa => `
              <div class="res-item-row">
                <div>
                  <div style="color: var(--text-main); font-weight: 700;">${fa.topicName}</div>
                  <div style="font-size: 0.76rem; color: var(--text-muted);">${fa.reason}</div>
                </div>
                <button class="btn btn-outline-primary btn-sm btn-practice-focus" data-topic="${fa.topicId}">
                  Practice
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMasteryClass(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'improving';
  return 'needs-practice';
}
