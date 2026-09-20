/* ============================================================
   LEARNPATH AI — 12 Topics & PDF Notes Hub View
   ============================================================ */

import { INITIAL_SUBJECTS } from '../data/initialData.js';

export function renderTopicSelectionView(state, activeSubject = 'java') {
  // Fix #7: Filter topics by active subject; show "Coming Soon" for non-Java
  const filteredTopics = state.topics.filter(t => (t.subjectId || 'java') === activeSubject);
  const isJava = activeSubject === 'java';

  return `
    <div class="topics-view">
      <div class="topics-header">
        <div>
          <h1>Explore Concepts &amp; Study Notes</h1>
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

      ${!isJava ? `
        <!-- Fix #7: Coming Soon message for non-Java subjects -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🚧</div>
          <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
            ${INITIAL_SUBJECTS.find(s => s.id === activeSubject)?.name || activeSubject} Track — Coming Soon!
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 420px;">
            We are actively building content for this subject. For now, please continue with the <strong>Java &amp; Arrays</strong> track which has full question sets, notes, and recovery paths.
          </p>
          <button class="btn btn-primary" data-subject="java" style="margin-top: 24px;">
            ← Switch to Java Track
          </button>
        </div>
      ` : `
        <!-- 12 Topic Cards Grid -->
        <div class="topics-grid">
          ${filteredTopics.map(topic => `
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
                <button class="btn btn-secondary btn-sm btn-open-topic-notes" data-route="notes" data-topic="${topic.id}" title="Read study notes &amp; PDF guide">
                  📖 Notes (PDF)
                </button>

                <button class="btn btn-primary btn-sm btn-start-topic-practice" data-route="practice" data-topic="${topic.id}">
                  Practice →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
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
