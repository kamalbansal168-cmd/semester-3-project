/* ============================================================
   LEARNPATH AI — Interactive Question Solving Component (MCQ & Code)
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';
import { AIService } from '../engine/aiService.js';

export function renderQuestionView(questionId, userSelection = null, feedbackState = null, testCaseResults = null) {
  const question = QUESTIONS_DB.find(q => q.id === questionId) || QUESTIONS_DB[0];
  const isCoding = question.type === 'CODING';

  return `
    <div class="question-container" data-qid="${question.id}">
      <!-- Question Nav Header -->
      <div class="question-nav-header">
        <div class="question-breadcrumbs">
          <span>Java Arrays</span>
          <span>/</span>
          <span class="topic-tag">${question.topic.toUpperCase().replace('-', ' ')}</span>
          <span>/</span>
          <span>${question.subtopic || 'Concept Check'}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="badge ${getDifficultyBadgeClass(question.difficulty)}">${question.difficulty}</span>
          <div class="question-timer-pill" id="question-timer">
            <span>⏱</span> <span id="timer-display">00:45</span>
          </div>
        </div>
      </div>

      <!-- Main Question Card -->
      <div class="question-card">
        <div class="question-prompt-header">
          <h2 class="question-text">${question.question}</h2>
          ${question.snippet ? `
            <pre class="question-code-snippet"><code>${escapeHtml(question.snippet)}</code></pre>
          ` : ''}
        </div>

        ${question.exampleInput ? `
          <div class="question-examples-box">
            <div class="example-item"><strong>Example Input:</strong> <code>${question.exampleInput}</code></div>
            <div class="example-item"><strong>Example Output:</strong> <code>${question.exampleOutput}</code></div>
          </div>
        ` : ''}

        <!-- MCQ Options or Code Editor -->
        ${!isCoding ? `
          <div class="mcq-options-list" id="mcq-options-group">
            ${question.options.map((opt, idx) => `
              <div class="mcq-option-card ${userSelection === idx ? 'selected' : ''}" data-opt-idx="${idx}">
                <div class="mcq-radio-circle"></div>
                <div class="mcq-option-text">${escapeHtml(opt)}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="code-editor-wrapper">
            <div class="code-editor-header">
              <span>Java (OpenJDK 17)</span>
              <span>Solution.java</span>
            </div>
            <textarea class="code-textarea" id="code-input" spellcheck="false">${question.starterCode || ''}</textarea>
          </div>

          ${testCaseResults ? `
            <div class="code-output-panel">
              <div class="code-output-header">Test Case Results:</div>
              <div class="test-cases-list">
                ${testCaseResults.map((tc, idx) => `
                  <div class="test-case-row">
                    <span>Test Case ${idx + 1}: ${tc.input}</span>
                    <span class="${tc.passed ? 'test-case-pass' : 'test-case-fail'}">
                      ${tc.passed ? '✓ PASSED' : '✕ FAILED'}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        `}

        <!-- Bottom Action Bar (Before Submission) -->
        ${!feedbackState ? `
          <div class="question-actions-bar">
            <button class="btn btn-secondary btn-sm" id="btn-get-ai-hint" data-qid="${question.id}">
              💡 Need a Hint?
            </button>
            <div style="display: flex; gap: 12px;">
              ${isCoding ? `
                <button class="btn btn-secondary" id="btn-run-code" data-qid="${question.id}">
                  ▶ Run Code
                </button>
              ` : ''}
              <button class="btn btn-primary" id="btn-submit-answer" data-qid="${question.id}" ${(!isCoding && userSelection === null) ? 'disabled' : ''}>
                Submit Answer →
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Hint Callout Container -->
        <div id="ai-hint-box" style="display: none; background: #EEF2FF; border: 1px solid var(--primary-border); border-radius: var(--radius-md); padding: 14px 18px; margin-top: 10px;">
          <div style="font-weight: 700; color: var(--primary); font-size: 0.88rem; margin-bottom: 4px;">💡 AI Concept Guide</div>
          <div id="ai-hint-text" style="font-size: 0.9rem; color: var(--text-main);"></div>
        </div>
      </div>

      <!-- Feedback / Diagnosis Card (After Submission) -->
      ${feedbackState ? renderFeedbackCard(question, feedbackState) : ''}
    </div>
  `;
}

function renderFeedbackCard(question, feedback) {
  const isCorrect = feedback.isCorrect;

  return `
    <div class="feedback-card ${isCorrect ? 'correct' : 'incorrect'}">
      <div class="feedback-title-row">
        <span class="feedback-icon">${isCorrect ? '🎉' : '💡'}</span>
        <div>
          <h3 class="feedback-title">${isCorrect ? 'Correct! Concept Understood' : 'Needs Practice on this Concept'}</h3>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            ${isCorrect ? 'You accurately applied the boundary and index logic.' : 'Let us analyze what went wrong and strengthen this concept.'}
          </div>
        </div>
      </div>

      <div class="feedback-explanation">
        <strong>Concept Explanation:</strong> ${question.explanation}
      </div>

      ${!isCorrect ? `
        <div class="concept-detected-box">
          <div class="concept-detected-title">
            <span>⚠️</span> Possible Concept Gap: ${question.concept || 'Array Index Handling'}
          </div>
          <div class="concept-detected-msg">
            Error Pattern: <strong>${question.misconception_tag || 'INDEX_ERROR'}</strong> — ${question.common_errors || 'Off-by-one or lookahead boundary miss.'}
          </div>
        </div>
      ` : ''}

      <div class="feedback-actions">
        ${!isCorrect ? `
          <button class="btn btn-primary" id="btn-feedback-recovery" data-route="recovery">
            Open Recovery Path →
          </button>
          <button class="btn btn-secondary" id="btn-feedback-retry" data-qid="${question.id}">
            Try Again
          </button>
        ` : `
          <button class="btn btn-primary" id="btn-feedback-next" data-route="practice">
            Next Practice Question →
          </button>
          <button class="btn btn-secondary" data-route="dashboard">
            Back to Dashboard
          </button>
        `}
      </div>
    </div>
  `;
}

function getDifficultyBadgeClass(diff) {
  if (diff === 'Easy') return 'badge-strong';
  if (diff === 'Medium') return 'badge-improving';
  return 'badge-needs-practice';
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
