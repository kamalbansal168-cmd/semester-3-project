/* ============================================================
   LEARNPATH AI — 12 Topics & PDF Notes Hub View
   ============================================================ */

import { INITIAL_SUBJECTS } from '../data/initialData.js';

export function renderTopicSelectionView(state, activeSubject = 'java') {
  return `
    <div class="topics-view">
      <div class="topics-header">
        <div>
          <h1>Explore Concepts & Study Notes</h1>
          <p>Read in-depth PDF study notes, understand core principles, and practice coding challenges.</p>
        </div>

        <div class="subject-tabs">
          ${INITIAL_SUBJECTS.map(subj => `
            <button class="subject-tab ${subj.id === activeSubject ? 'active' : ''}" data-subject="${subj.id}" style="cursor: pointer;">
              ${subj.icon} ${subj.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 12 Topic Cards Grid -->
      <div class="topics-grid">
        ${state.topics.map(topic => `
          <div class="topic-card">
            <div class="topic-card-top">
              <div>
                <h3 class="topic-title">${topic.name}</h3>
                <p class="topic-desc">${topic.description}</p>
              </div>
              <span class="badge ${getStatusBadgeClass(topic.status)}">${topic.status}</span>
            </div>

            <div class="topic-progress-section">
              <div class="topic-progress-meta">
                <span>Mastery</span>
                <span>${topic.mastery}%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill ${getMasteryClass(topic.mastery)}" style="width: ${topic.mastery}%;"></div>
              </div>
            </div>

            <div class="topic-card-footer" style="display: flex; gap: 8px; justify-content: space-between; align-items: center;">
              <button class="btn btn-secondary btn-sm btn-open-topic-notes" data-route="notes" data-topic="${topic.id}" title="Read study notes & PDF guide">
                📖 Notes (PDF)
              </button>

              <button class="btn btn-primary btn-sm btn-start-topic-practice" data-route="practice" data-topic="${topic.id}">
                Practice →
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getMasteryClass(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'improving';
  return 'needs-practice';
}

function getStatusBadgeClass(status) {
  if (status === 'Strong') return 'badge-strong';
  if (status === 'Good') return 'badge-good';
  if (status === 'Improving') return 'badge-improving';
  return 'badge-needs-practice';
}
