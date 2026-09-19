/* ============================================================
   LEARNPATH AI — LeetCode / HackerRank Style Coding Playground Component
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';
import { store } from '../state.js';

export function renderPlaygroundView(questionId, activeTab = 'description', activeCaseIdx = 0, currentCode = null, runResults = null, submissionResult = null) {
  const question = QUESTIONS_DB.find(q => q.id === questionId) || QUESTIONS_DB[0];
  const isSolved = store.isQuestionSolved(question.id);
  const codeToDisplay = currentCode !== null ? currentCode : (question.starterCode || '');
  const linesCount = (codeToDisplay.split('\n').length) || 1;
  const lineNumbers = Array.from({ length: Math.max(16, linesCount) }, (_, i) => i + 1).join('\n');
  const testCases = question.testCases || [
    { input: 'arr = [1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]' },
    { input: 'arr = [10, 20]', expected: '[20, 10]' }
  ];
  const currentCase = testCases[activeCaseIdx] || testCases[0];

  return `
    <div class="playground-wrapper" data-qid="${question.id}">
      <!-- Playground Top Bar -->
      <div class="playground-top-bar">
        <div class="playground-breadcrumbs">
          <a data-route="practice" style="cursor: pointer; color: var(--text-muted);">← Problem List</a>
          <span>/</span>
          <span class="prob-title">${question.title || question.subtopic || 'Problem'}</span>
          <span class="badge ${getDifficultyBadgeClass(question.difficulty)}">${question.difficulty}</span>
          ${isSolved ? `<span class="solved-status-badge">✓ Solved</span>` : ''}
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="question-timer-pill" id="question-timer">
            <span>⏱</span> <span id="timer-display">01:15</span>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-open-hint-tab">
            💡 AI Concept Hint
          </button>
        </div>
      </div>

      <!-- Split Screen Layout -->
      <div class="playground-split-grid">
        
        <!-- LEFT PANE (Problem Description & Tabs) -->
        <div class="problem-pane">
          <div class="pane-tabs-header">
            <button class="pane-tab-btn ${activeTab === 'description' ? 'active' : ''}" id="tab-btn-desc">
              📄 Description
            </button>
            <button class="pane-tab-btn ${activeTab === 'hints' ? 'active' : ''}" id="tab-btn-hints">
              💡 AI Hints
            </button>
            <button class="pane-tab-btn ${activeTab === 'submissions' ? 'active' : ''}" id="tab-btn-subs">
              📜 Submissions ${isSolved ? '(1)' : '(0)'}
            </button>
          </div>

          <div class="problem-content-scroll" id="pane-tab-content">
            ${activeTab === 'description' ? renderDescriptionTab(question, isSolved) : ''}
            ${activeTab === 'hints' ? renderHintsTab(question) : ''}
            ${activeTab === 'submissions' ? renderSubmissionsTab(question, isSolved) : ''}
          </div>
        </div>

        <!-- RIGHT PANE (IDE & Test Case Runner) -->
        <div class="editor-pane">
          <!-- Editor Toolbar -->
          <div class="editor-toolbar">
            <div style="display: flex; align-items: center; gap: 10px;">
              <select class="editor-lang-select" id="editor-lang-selector">
                <option value="java">Java (OpenJDK 17)</option>
                <option value="python">Python 3.10</option>
                <option value="js">JavaScript (Node.js)</option>
              </select>
              <span style="font-size: 0.75rem; color: #64748B;">Auto-Save Enabled</span>
            </div>

            <div class="editor-tool-actions">
              <button class="btn-editor-tool" id="btn-reset-code" title="Reset code to default template">
                ↺ Reset
              </button>
            </div>
          </div>

          <!-- Code Editor Area -->
          <div class="code-editor-area">
            <pre class="line-numbers-gutter" id="line-numbers-gutter">${lineNumbers}</pre>
            <textarea class="code-textarea-main" id="playground-code-input" spellcheck="false">${escapeHtml(codeToDisplay)}</textarea>
          </div>

          <!-- Testcases Console Bottom Panel -->
          <div class="testcase-panel">
            <div class="testcase-tab-bar">
              <div class="testcase-tabs-list">
                ${testCases.map((tc, idx) => {
                  let passClass = '';
                  let passIcon = '';
                  if (runResults && runResults.results && runResults.results[idx]) {
                    const r = runResults.results[idx];
                    passClass = r.passed ? 'passed' : 'failed';
                    passIcon = r.passed ? '✓ ' : '✕ ';
                  }
                  return `
                    <button class="testcase-tab ${activeCaseIdx === idx ? 'active' : ''} ${passClass}" data-case-idx="${idx}">
                      ${passIcon}Case ${idx + 1}
                    </button>
                  `;
                }).join('')}
              </div>

              ${runResults ? `
                <span style="font-size: 0.78rem; font-family: var(--font-mono); color: ${runResults.success ? '#10B981' : '#EF4444'}; font-weight: 700;">
                  ${runResults.success ? `✓ ${runResults.passedCount}/${runResults.totalCount} Passed (${runResults.executionTimeMs}ms)` : `✕ ${runResults.passedCount}/${runResults.totalCount} Passed`}
                </span>
              ` : `
                <span style="font-size: 0.78rem; color: #94A3B8; font-family: var(--font-mono);">
                  Testcase Inputs
                </span>
              `}
            </div>

            <!-- Active Test Case Body -->
            <div class="testcase-body" id="testcase-display-body">
              <div>
                <div class="testcase-field-label">Input</div>
                <div class="testcase-box">${currentCase.input}</div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <div class="testcase-field-label">Expected Output</div>
                  <div class="testcase-box">${currentCase.expected}</div>
                </div>
                <div>
                  <div class="testcase-field-label">Your Output</div>
                  <div class="testcase-box ${runResults && runResults.results[activeCaseIdx] ? (runResults.results[activeCaseIdx].passed ? 'match' : 'mismatch') : ''}">
                    ${runResults && runResults.results[activeCaseIdx] ? runResults.results[activeCaseIdx].actual : 'Click Run Code to evaluate'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="playground-bottom-bar">
            <button class="btn btn-secondary btn-sm" id="btn-toggle-console" style="color: #94A3B8; border-color: #334155; background: #0F172A;">
              Console ⏶
            </button>

            <div style="display: flex; gap: 10px;">
              <button class="btn-run-code-dark" id="btn-playground-run">
                ▶ Run Code
              </button>
              <button class="btn-submit-code-dark" id="btn-playground-submit">
                🚀 Submit
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Submission Acceptance Overlay Modal -->
      ${submissionResult ? renderAcceptanceModal(question, submissionResult) : ''}
    </div>
  `;
}

function renderDescriptionTab(question, isSolved) {
  return `
    <div class="problem-header-row">
      <div>
        <h2 class="problem-heading">${question.title || question.question}</h2>
        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <span class="badge ${getDifficultyBadgeClass(question.difficulty)}">${question.difficulty}</span>
          <span class="badge badge-neutral">${question.topic.toUpperCase().replace('-', ' ')}</span>
          ${isSolved ? `<span class="solved-status-badge">✓ Solved</span>` : ''}
        </div>
      </div>
    </div>

    <div class="problem-description-text">
      ${question.question}
    </div>

    <!-- Example 1 -->
    ${question.exampleInput ? `
      <div class="example-section-box">
        <span class="example-title">Example 1:</span>
        <div class="example-io-line"><strong>Input:</strong> <code>${question.exampleInput}</code></div>
        <div class="example-io-line"><strong>Output:</strong> <code>${question.exampleOutput}</code></div>
        ${question.explanation ? `
          <div class="example-io-line"><strong>Explanation:</strong> ${question.explanation}</div>
        ` : ''}
      </div>
    ` : ''}

    <!-- Constraints -->
    <div class="constraints-box">
      <div class="constraints-title">Constraints:</div>
      <ul class="constraints-list">
        ${(question.constraints || [
          '1 <= arr.length <= 10^5',
          '-10^9 <= arr[i] <= 10^9',
          'Expected Time Complexity: O(N)',
          'Expected Auxiliary Space: O(1)'
        ]).map(c => `<li><code>${c}</code></li>`).join('')}
      </ul>
    </div>
  `;
}

function renderHintsTab(question) {
  return `
    <div>
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;">
        💡 AI Concept Guidance
      </h3>
      <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 16px;">
        Personalized algorithmic hints tailored to help you solve this without giving away the full code.
      </p>

      <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; display: flex; flex-direction: column; gap: 12px;">
        <div>
          <strong style="color: var(--text-main);">Hint 1 (Pointer Strategy):</strong>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
            Consider using two converging pointers starting at index <code>0</code> and index <code>arr.length - 1</code>.
          </p>
        </div>
        <div style="border-top: 1px solid var(--border-color); padding-top: 10px;">
          <strong style="color: var(--text-main);">Hint 2 (Boundary Caution):</strong>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
            Avoid incrementing pointers before reading or swapping array values to prevent off-by-one errors.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderSubmissionsTab(question, isSolved) {
  return `
    <div>
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px;">
        Submission History
      </h3>
      ${isSolved ? `
        <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: var(--radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 800; color: #065F46; font-size: 1rem;">✓ Accepted</div>
            <div style="font-size: 0.8rem; color: #047857;">Runtime: 2 ms (Beats 94.2%) • Memory: 38.6 MB</div>
          </div>
          <span style="font-size: 0.78rem; color: #065F46; font-weight: 600;">Today</span>
        </div>
      ` : `
        <div style="text-align: center; padding: 32px; color: var(--text-muted);">
          No submissions yet for this problem. Write your code and click Submit!
        </div>
      `}
    </div>
  `;
}

function renderAcceptanceModal(question, result) {
  return `
    <div class="acceptance-overlay" id="acceptance-modal-overlay">
      <div class="acceptance-card">
        <div class="accepted-check-icon">✓</div>
        <h2 class="accepted-title">Accepted! Solved Successfully</h2>
        <p style="font-size: 0.95rem; color: var(--text-muted);">
          All <strong>${result.totalCount}/${result.totalCount}</strong> test cases passed with optimal time and space complexity.
        </p>

        <div class="accepted-metrics-row">
          <div class="accepted-metric-box">
            <span class="accepted-metric-label">Runtime</span>
            <span class="accepted-metric-val" style="color: var(--success);">${result.executionTimeMs} ms</span>
            <span style="font-size: 0.72rem; color: var(--text-light);">Beats 92.4%</span>
          </div>
          <div class="accepted-metric-box">
            <span class="accepted-metric-label">Memory</span>
            <span class="accepted-metric-val">${result.memoryMb} MB</span>
            <span style="font-size: 0.72rem; color: var(--text-light);">Beats 89.1%</span>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; background: #ECFDF5; padding: 8px 14px; border-radius: var(--radius-md); width: 100%; justify-content: center;">
          <span style="color: var(--success); font-weight: 800;">✓ Green Tick Applied:</span>
          <span style="font-size: 0.85rem; color: #065F46;">Marked as Solved across Platform</span>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 8px; width: 100%;">
          <button class="btn btn-secondary" id="btn-close-acceptance" style="flex: 1;">
            Back to Editor
          </button>
          <button class="btn btn-primary" data-route="practice" style="flex: 1;">
            Next Problem →
          </button>
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
