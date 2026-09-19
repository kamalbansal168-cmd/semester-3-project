/* ============================================================
   LEARNPATH AI — Review Your Mistakes Component
   ============================================================ */

export function renderMistakesView(state) {
  const mistakes = state.mistakesReviewList || [];

  return `
    <div class="mistakes-view">
      <!-- Mistakes Header Box -->
      <div class="mistakes-header-box">
        <div>
          <h1>Review Your Mistakes</h1>
          <p>Understand the exact concept gaps behind past errors and re-practice until mastered.</p>
        </div>
        <span class="badge badge-needs-practice">${mistakes.length} Saved Mistakes</span>
      </div>

      <!-- Mistakes Cards List -->
      <div class="mistakes-list">
        ${mistakes.length === 0 ? `
          <div class="empty-state-card" style="padding: 48px;">
            <div class="empty-state-icon">🎉</div>
            <div class="empty-state-title">No mistakes recorded!</div>
            <div class="empty-state-desc">You have answered all attempted questions accurately. Keep up the high performance!</div>
          </div>
        ` : mistakes.map(m => `
          <div class="mistake-card" data-qid="${m.questionId}">
            <div class="mistake-top-row">
              <div>
                <span class="badge badge-neutral" style="margin-bottom: 6px;">${m.topic}</span>
                <h3 class="mistake-question-title">${m.title}</h3>
              </div>
              <span class="badge badge-needs-practice">${m.errorPattern || 'INDEX_ERROR'}</span>
            </div>

            <!-- Analysis Grid: What went wrong vs Correct approach -->
            <div class="mistake-analysis-grid">
              <div class="analysis-box wrong">
                <span class="analysis-box-label">⚠️ What Went Wrong</span>
                <div class="analysis-box-text">${m.whatWentWrong}</div>
              </div>
              <div class="analysis-box correct">
                <span class="analysis-box-label">✓ Correct Conceptual Approach</span>
                <div class="analysis-box-text">${m.correctApproach}</div>
              </div>
            </div>

            <div class="mistake-footer">
              <span style="font-size: 0.8rem; color: var(--text-light); font-weight: 600;">
                Difficulty: ${m.difficulty}
              </span>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline-primary btn-sm btn-practice-mistake-again" data-qid="${m.questionId}">
                  🔄 Practice Again
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
