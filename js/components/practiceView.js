/* ============================================================
   LEARNPATH AI — Practice Hub & Question Filter View
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';
import { RecommendationEngine } from '../engine/recommendationEngine.js';
import { store } from '../state.js';

export function renderPracticeView(state, selectedTopicId = 'all', selectedDifficulty = 'all') {
  const rec = RecommendationEngine.getPrimaryRecommendation(state);

  // Filter questions (exclude targeted retest items from general practice list)
  const regularQuestions = QUESTIONS_DB.filter(q => !q.id.startsWith('retest_'));
  
  const filteredQuestions = regularQuestions.filter(q => {
    if (selectedTopicId !== 'all' && q.topic !== selectedTopicId) return false;
    if (selectedDifficulty !== 'all' && q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    return true;
  });

  return `
    <div class="practice-hub">
      ${state.activeRecoveryGate && state.activeRecoveryGate.status === 'ACTIVE' ? `
        <div class="recovery-active-alert-banner">
          <div class="recovery-alert-left">
            <span class="gate-alert-pill">🚨 Concept Recovery Active</span>
            <span class="recovery-alert-text">
              You are currently repairing <strong>${state.activeRecoveryGate.subtopicName}</strong>. Master this topic first to unlock your next learning milestone!
            </span>
          </div>
          <button class="btn btn-primary btn-sm" data-route="recovery">
            Resume 3-Step Remediation →
          </button>
        </div>
      ` : ''}

      <!-- "Recommended for You" Hero Launcher -->
      <div class="recommendation-hero-card">
        <div class="rec-hero-content">
          <div class="rec-badge-pill">✨ Personalized Recommendation</div>
          <h2 class="rec-hero-title">${rec.actionTitle}</h2>
          <p class="rec-hero-desc">${rec.reason}</p>
          <button class="btn btn-primary btn-lg" id="btn-launch-rec-action" data-topic="${rec.topicId}" data-route="${rec.route}">
            ${rec.buttonText || 'Start Recommended Practice →'}
          </button>
        </div>
        <div style="font-size: 4rem; display: flex; align-items: center; justify-content: center;">
          🎯
        </div>
      </div>

      <!-- Filters & Question Bank -->
      <div class="card" style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
        <div class="card-header" style="margin-bottom: 0;">
          <div>
            <h3 class="card-title">Practice Question Bank</h3>
            <p class="card-subtitle">Choose a problem to code in the LeetCode-style playground or test conceptual clarity.</p>
          </div>

          <!-- Practice Filters -->
          <div class="filter-group">
            <label class="filter-label" for="topic-filter">Topic:</label>
            <select class="filter-select" id="topic-filter">
              <option value="all" ${selectedTopicId === 'all' ? 'selected' : ''}>All Topics</option>
              ${state.topics.map(t => `
                <option value="${t.id}" ${selectedTopicId === t.id ? 'selected' : ''}>${t.name} (${t.mastery}%)</option>
              `).join('')}
            </select>

            <label class="filter-label" for="difficulty-filter" style="margin-left: 8px;">Difficulty:</label>
            <select class="filter-select" id="difficulty-filter">
              <option value="all" ${selectedDifficulty === 'all' ? 'selected' : ''}>All</option>
              <option value="Easy" ${selectedDifficulty === 'Easy' ? 'selected' : ''}>Easy</option>
              <option value="Medium" ${selectedDifficulty === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="Hard" ${selectedDifficulty === 'Hard' ? 'selected' : ''}>Hard</option>
            </select>
          </div>
        </div>

        <!-- Questions List Grid with Green Ticks -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${filteredQuestions.length === 0 ? `
            <div class="empty-state-card">
              <span class="empty-state-icon">🔍</span>
              <div class="empty-state-title">No questions match your filter</div>
              <div class="empty-state-desc">Try resetting your topic or difficulty selection.</div>
            </div>
          ` : filteredQuestions.map((q, idx) => {
            const isSolved = store.isQuestionSolved(q.id);
            const isCoding = q.type === 'CODING';

            return `
              <div class="attempt-row" style="padding: 16px 20px; border-left: ${isSolved ? '4px solid var(--success)' : '1px solid var(--border-color)'};">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isSolved ? '#ECFDF5' : 'var(--bg-subtle)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; color: ${isSolved ? 'var(--success)' : 'var(--text-muted)'};">
                    ${isSolved ? '✓' : (idx + 1)}
                  </div>
                  <div>
                    <div style="font-weight: 700; color: var(--text-main); font-size: 0.98rem; margin-bottom: 2px; display: flex; align-items: center; gap: 8px;">
                      <span>${q.title || q.question.slice(0, 75)}</span>
                      ${isSolved ? `<span class="solved-status-badge">✓ Solved</span>` : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-light); display: flex; align-items: center; gap: 8px;">
                      <span>${q.subtopic || q.topic}</span>
                      <span>•</span>
                      <span class="badge ${getDifficultyBadgeClass(q.difficulty)}">${q.difficulty}</span>
                      <span>•</span>
                      <span class="badge ${isCoding ? 'badge-good' : 'badge-neutral'}">
                        ${isCoding ? '💻 Code Playground' : 'MCQ'}
                      </span>
                    </div>
                  </div>
                </div>

                <button class="btn ${isSolved ? 'btn-secondary' : 'btn-primary'} btn-sm btn-solve-question" data-qid="${q.id}" data-type="${q.type}">
                  ${isCoding ? (isSolved ? 'Open Code ✓' : 'Code Now 💻') : (isSolved ? 'Review ✓' : 'Solve →')}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function getDifficultyBadgeClass(diff) {
  if (diff === 'Easy') return 'badge-strong';
  if (diff === 'Medium') return 'badge-improving';
  return 'badge-needs-practice';
}
