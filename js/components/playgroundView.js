/* ============================================================
   LEARNPATH AI — LeetCode / HackerRank Style Coding Arena
   Direct Question View with Sample Test Cases, Starter Code,
   Interactive Test Runner, Real-time Feedback & Acceptance Modal
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';
import { store } from '../state.js';

export function renderPlaygroundView(questionId, activeTab = 'description', activeCaseIdx = 0, currentCode = null, runResults = null, submissionResult = null, mode = 'problem') {
  const codingQuestions = QUESTIONS_DB.filter(q => q.type === 'CODING');
  const question = QUESTIONS_DB.find(q => q.id === questionId) || codingQuestions[0] || QUESTIONS_DB[0];
  const isSolved = store.isQuestionSolved(question.id);
  const codeToDisplay = currentCode !== null ? currentCode : (question.starterCode || '');
  const linesCount = (codeToDisplay.split('\n').length) || 1;
  const lineNumbers = Array.from({ length: Math.max(16, linesCount) }, (_, i) => i + 1).join('\n');
  const testCases = question.testCases || [
    { input: 'nums = [1, 2, 3]', expected: '[3, 2, 1]' },
    { input: 'nums = [10]', expected: '[10]' }
  ];
  const safeCaseIdx = Math.max(0, Math.min(activeCaseIdx, testCases.length - 1));
  const currentCase = testCases[safeCaseIdx] || testCases[0];

  return `
    <div class="playground-wrapper" data-qid="${question.id}">
      
      <!-- 1. Top Bar: Navigation, Breadcrumbs, Problem Selector, Status -->
      <div class="playground-top-bar">
        <div class="playground-breadcrumbs">
          <a data-route="practice" style="cursor: pointer; color: var(--primary); text-decoration: none; font-weight: 700; display: flex; align-items: center; gap: 4px;">
            ← Problem List
          </a>
          <span>/</span>
          
          <!-- Problem Switcher Dropdown -->
          <select id="playground-problem-selector" class="editor-lang-select" style="max-width: 260px; font-weight: 700; font-family: var(--font-family); color: var(--text-main); background: var(--bg-subtle); border-color: var(--border-color);">
            ${codingQuestions.map(q => `
              <option value="${q.id}" ${q.id === question.id ? 'selected' : ''}>
                ${store.isQuestionSolved(q.id) ? '✓ ' : ''}${q.title || q.subtopic || q.id} (${q.difficulty})
              </option>
            `).join('')}
          </select>

          <span class="badge ${getDifficultyBadgeClass(question.difficulty)}">${question.difficulty}</span>
          ${isSolved ? `<span class="solved-status-badge">✓ Solved</span>` : ''}
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="question-timer-pill" id="question-timer" title="Time elapsed on this problem">
            <span>⏱</span> <span id="timer-display">00:00</span>
          </div>

          <button class="btn btn-secondary btn-sm" id="btn-open-hint-tab" title="Get AI-powered hints without revealing full answer">
            💡 AI Concept Hint
          </button>
        </div>
      </div>

      <!-- 2. Split Screen: Problem Description (Left) & Editor + Testcases (Right) -->
      <div class="playground-split-grid">
        
        <!-- LEFT PANE: Problem Description, Constraints, AI Hints & Submissions -->
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

        <!-- RIGHT PANE: Code Editor & Test Case Runner Console -->
        <div class="editor-pane">
          <!-- Editor Toolbar -->
          <div class="editor-toolbar">
            <div style="display: flex; align-items: center; gap: 10px;">
              <select class="editor-lang-select" id="editor-lang-selector">
                <option value="java">Java (OpenJDK 17)</option>
              </select>
              <span style="font-size: 0.75rem; color: #64748B;">Auto-Save Enabled</span>
            </div>

            <div class="editor-tool-actions">
              <button class="btn-editor-tool" id="btn-format-code" title="Auto-format and indent code">
                🧹 Format
              </button>
              <button class="btn-editor-tool" id="btn-reset-code" title="Reset code to default template">
                ↺ Reset
              </button>
            </div>
          </div>

          <!-- Code Editor Area -->
          <div class="code-editor-area">
            <pre class="line-numbers-gutter" id="line-numbers-gutter">${lineNumbers}</pre>
            <textarea class="code-textarea-main" id="playground-code-input" spellcheck="false" placeholder="// Write your solution here...">${escapeHtml(codeToDisplay)}</textarea>
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
                    <button class="testcase-tab ${safeCaseIdx === idx ? 'active' : ''} ${passClass}" data-case-idx="${idx}">
                      ${passIcon}Case ${idx + 1}
                    </button>
                  `;
                }).join('')}
              </div>

              ${runResults ? `
                <span style="font-size: 0.8rem; font-family: var(--font-mono); color: ${runResults.success ? '#10B981' : '#EF4444'}; font-weight: 700;">
                  ${runResults.success ? `✓ ${runResults.passedCount}/${runResults.totalCount} Passed (${runResults.executionTimeMs}ms)` : `✕ ${runResults.passedCount}/${runResults.totalCount} Passed`}
                </span>
              ` : `
                <span style="font-size: 0.78rem; color: #94A3B8; font-family: var(--font-mono);">
                  Sample Testcases
                </span>
              `}
            </div>

            <!-- Active Test Case Input & Output Box -->
            <div class="testcase-body" id="testcase-display-body">
              <div>
                <div class="testcase-field-label">Sample Input</div>
                <div class="testcase-box">${escapeHtml(currentCase.input)}</div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <div class="testcase-field-label">Expected Output</div>
                  <div class="testcase-box">${escapeHtml(currentCase.expected)}</div>
                </div>
                <div>
                  <div class="testcase-field-label">Your Output</div>
                  <div class="testcase-box ${runResults && runResults.results && runResults.results[safeCaseIdx] ? (runResults.results[safeCaseIdx].passed ? 'match' : 'mismatch') : ''}">
                    ${runResults && runResults.results && runResults.results[safeCaseIdx] ? escapeHtml(runResults.results[safeCaseIdx].actual) : '<span style="color: #64748B;">Click Run Code to evaluate</span>'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar (Run & Submit) -->
          <div class="playground-bottom-bar">
            <div style="font-size: 0.78rem; color: #64748B; font-family: var(--font-mono);">
              Shortcuts: <kbd style="background: #334155; padding: 2px 6px; border-radius: 3px; color: #CBD5E1;">Ctrl + Enter</kbd> to Run
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn-run-code-dark" id="btn-playground-run" title="Run code against sample test cases">
                ▶ Run Code
              </button>
              <button class="btn-submit-code-dark" id="btn-playground-submit" title="Submit code for full acceptance">
                🚀 Submit
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Submission / Done Acceptance Overlay Modal -->
      ${submissionResult ? renderAcceptanceModal(question, submissionResult) : ''}
    </div>
  `;
}

function renderDescriptionTab(question, isSolved) {
  return `
    <div class="problem-header-row">
      <div>
        <h2 class="problem-heading">${escapeHtml(question.title || question.question)}</h2>
        <div style="display: flex; gap: 8px; margin-top: 6px; align-items: center;">
          <span class="badge ${getDifficultyBadgeClass(question.difficulty)}">${question.difficulty}</span>
          <span class="badge badge-neutral">${question.topic.toUpperCase().replace('-', ' ')}</span>
          ${isSolved ? `<span class="solved-status-badge">✓ Solved</span>` : ''}
        </div>
      </div>
    </div>

    <div class="problem-description-text">
      ${escapeHtml(question.question)}
    </div>

    <!-- Example 1 -->
    ${question.exampleInput ? `
      <div class="example-section-box">
        <span class="example-title">Example 1:</span>
        <div class="example-io-line"><strong>Input:</strong> <code>${escapeHtml(question.exampleInput)}</code></div>
        <div class="example-io-line"><strong>Output:</strong> <code>${escapeHtml(question.exampleOutput)}</code></div>
        ${question.explanation ? `
          <div class="example-io-line"><strong>Explanation:</strong> ${escapeHtml(question.explanation)}</div>
        ` : ''}
      </div>
    ` : ''}

    <!-- Example 2 (from test case if available) -->
    ${question.testCases && question.testCases.length > 1 ? `
      <div class="example-section-box">
        <span class="example-title">Example 2:</span>
        <div class="example-io-line"><strong>Input:</strong> <code>${escapeHtml(question.testCases[1].input)}</code></div>
        <div class="example-io-line"><strong>Output:</strong> <code>${escapeHtml(question.testCases[1].expected)}</code></div>
      </div>
    ` : ''}

    <!-- Constraints -->
    <div class="constraints-box">
      <div class="constraints-title">Constraints:</div>
      <ul class="constraints-list">
        ${(question.constraints || [
          '1 <= nums.length <= 10^5',
          '-10^9 <= nums[i] <= 10^9',
          'Expected Time Complexity: O(log N) or O(N)',
          'Expected Auxiliary Space: O(1)'
        ]).map(c => `<li><code>${escapeHtml(c)}</code></li>`).join('')}
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
          <strong style="color: var(--text-main);">Hint 1 (Core Concept):</strong>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
            ${escapeHtml(question.concept || 'Analyze array bounds, loop invariants, and pointer traversal.')}
          </p>
        </div>
        <div style="border-top: 1px solid var(--border-color); padding-top: 10px;">
          <strong style="color: var(--text-main);">Hint 2 (Implementation Strategy):</strong>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 2px;">
            ${escapeHtml(question.explanation || 'Think about base cases, loop termination conditions (e.g. left <= right), and avoid off-by-one errors.')}
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
            <div style="font-weight: 800; color: #065F46; font-size: 1rem;">✓ Done (Accepted)</div>
            <div style="font-size: 0.8rem; color: #047857;">All sample test cases verified • Optimal memory usage</div>
          </div>
          <span style="font-size: 0.78rem; color: #065F46; font-weight: 600;">Status: Completed ✓</span>
        </div>
      ` : `
        <div style="text-align: center; padding: 32px; color: var(--text-muted);">
          No successful submissions yet. Write your code and click Run Code or Submit!
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
        <h2 class="accepted-title">Done! Solved Successfully</h2>
        <p style="font-size: 0.95rem; color: var(--text-muted);">
          All <strong>${result.totalCount}/${result.totalCount}</strong> test cases passed with expected outputs!
        </p>

        <div class="accepted-metrics-row">
          <div class="accepted-metric-box">
            <span class="accepted-metric-label">Runtime</span>
            <span class="accepted-metric-val" style="color: var(--success);">${result.executionTimeMs || 2} ms</span>
            <span style="font-size: 0.72rem; color: var(--text-light);">Fast Execution</span>
          </div>
          <div class="accepted-metric-box">
            <span class="accepted-metric-label">Memory</span>
            <span class="accepted-metric-val">${result.memoryMb || '38.4'} MB</span>
            <span style="font-size: 0.72rem; color: var(--text-light);">Optimal Space</span>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; background: #ECFDF5; padding: 10px 16px; border-radius: var(--radius-md); width: 100%; justify-content: center;">
          <span style="color: var(--success); font-weight: 800;">✓ Green Tick Applied:</span>
          <span style="font-size: 0.85rem; color: #065F46; font-weight: 600;">Marked as Solved in Practice Bank (+2 XP)</span>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 8px; width: 100%;">
          <button class="btn btn-secondary" id="btn-close-acceptance" style="flex: 1;">
            Back to Editor
          </button>
          <button class="btn btn-primary" data-route="practice" style="flex: 1;">
            Practice More Problems →
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
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
