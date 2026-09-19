/* ============================================================
   LEARNPATH AI — Targeted Concept Re-Test Component
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';

const RETEST_QUESTION_IDS = ['retest_01', 'retest_02', 'retest_03', 'retest_04', 'retest_05'];

export function renderRetestView(currentIndex = 0, userSelections = {}, isCompleted = false) {
  const retestQuestions = RETEST_QUESTION_IDS.map(id => QUESTIONS_DB.find(q => q.id === id));
  
  if (isCompleted) {
    return renderRetestCompletionBanner(userSelections, retestQuestions);
  }

  const currentQ = retestQuestions[currentIndex] || retestQuestions[0];
  const selectedOpt = userSelections[currentQ.id];

  return `
    <div class="retest-view" data-retest-idx="${currentIndex}">
      <div class="question-nav-header">
        <div class="question-breadcrumbs">
          <span style="color: var(--primary); font-weight: 800;">Targeted Concept Re-Test</span>
          <span>/</span>
          <span>Question ${currentIndex + 1} of ${retestQuestions.length}</span>
        </div>
        <span class="badge badge-good">Validation Assessment</span>
      </div>

      <div class="question-card">
        <div class="question-prompt-header">
          <h2 class="question-text">${currentQ.question}</h2>
          ${currentQ.snippet ? `
            <pre class="question-code-snippet"><code>${escapeHtml(currentQ.snippet)}</code></pre>
          ` : ''}
        </div>

        <div class="mcq-options-list" id="retest-options-group">
          ${currentQ.options.map((opt, idx) => `
            <div class="mcq-option-card ${selectedOpt === idx ? 'selected' : ''}" data-retest-opt="${idx}">
              <div class="mcq-radio-circle"></div>
              <div class="mcq-option-text">${escapeHtml(opt)}</div>
            </div>
          `).join('')}
        </div>

        <div class="question-actions-bar">
          <button class="btn btn-secondary" data-route="recovery">
            Exit Re-Test
          </button>
          
          <button class="btn btn-primary" id="btn-retest-next" data-retest-idx="${currentIndex}" ${selectedOpt === undefined ? 'disabled' : ''}>
            ${currentIndex === retestQuestions.length - 1 ? 'Finish Re-Test & Evaluate Mastery →' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderRetestCompletionBanner(userSelections, questions) {
  let correctCount = 0;
  questions.forEach(q => {
    if (userSelections[q.id] === q.correct_answer) {
      correctCount++;
    }
  });

  // For the core demo narrative, 4 or 5 correct answers yields 32% -> 67% (+35% gain)
  const prevMastery = 32;
  const currentMastery = 67;
  const gain = currentMastery - prevMastery;

  return `
    <div class="retest-view">
      <div class="retest-score-banner improved">
        <div class="retest-confetti-icon">🎉</div>
        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-main);">
          Great improvement! Your recent practice is helping.
        </h1>
        <p style="font-size: 1rem; color: var(--text-muted); max-width: 520px;">
          You answered <strong>${correctCount} of ${questions.length}</strong> questions correctly on the Two-Pointer Index Handling validation test.
        </p>

        <div class="retest-gain-comparison">
          <div class="comparison-box">
            <span class="comparison-label">Before Recovery</span>
            <span class="comparison-score" style="color: var(--danger);">${prevMastery}%</span>
          </div>
          <div class="comparison-arrow">➔</div>
          <div class="comparison-box">
            <span class="comparison-label">Current Mastery</span>
            <span class="comparison-score" style="color: var(--success);">${currentMastery}%</span>
          </div>
        </div>

        <div class="retest-gain-pill">
          <span>▲ Learning Gain:</span>
          <span>+${gain}%</span>
        </div>

        <div style="margin-top: 14px; display: flex; gap: 14px;">
          <button class="btn btn-primary btn-lg" id="btn-retest-finish-dashboard" data-route="dashboard">
            View Updated Dashboard →
          </button>
          <button class="btn btn-secondary btn-lg" data-route="progress">
            View Progress Trends
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
