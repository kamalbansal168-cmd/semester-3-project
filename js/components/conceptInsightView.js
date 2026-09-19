/* ============================================================
   LEARNPATH AI — Concept Insight & Explanation Views
   ============================================================ */

import { CONCEPT_EXPLANATIONS } from '../data/explanations.js';

export function renderConceptInsightView(state) {
  const insight = state.conceptInsight || {
    title: 'Concept Insight',
    conceptGap: 'Array Index Handling during Traversal',
    explanation: 'You are making repeated mistakes when changing array indexes during traversal.',
    subExplanation: 'We noticed a pattern: off-by-one pointer increments and boundary misses occur frequently during converging pointer loops.',
    evidence: [
      'Similar mistake occurred in 3 recent Two Pointer questions',
      'Solving time was 40% higher on pointer boundary edge cases',
      'Errors occurred specifically during arr[left++] and arr[right--] operations'
    ],
    recommendedAction: 'Practice index handling foundation before moving to complex problems.'
  };

  return `
    <div class="insight-full-view">
      <div class="insight-header-card">
        <div class="insight-eyebrow">
          <span>💡</span> <span>Concept Insight</span>
        </div>
        <h1 class="insight-headline">${insight.title}: ${insight.conceptGap}</h1>
        <p style="font-size: 1.05rem; color: #78350F; line-height: 1.6;">
          ${insight.explanation}
        </p>
      </div>

      <div class="card" style="padding: 28px; display: flex; flex-direction: column; gap: 20px;">
        <h3 style="font-size: 1.15rem; color: var(--text-main);">Why we detected this:</h3>
        
        <div class="insight-evidence-card">
          <div class="evidence-title">Observed Performance Patterns:</div>
          <ul class="evidence-list">
            ${insight.evidence.map(ev => `
              <li class="evidence-item">
                <span class="evidence-dot"></span>
                <span>${ev}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 18px; font-size: 0.95rem; color: var(--text-main);">
          <strong>Recommended Learning Action:</strong> ${insight.recommendedAction}
        </div>

        <div style="display: flex; gap: 14px; justify-content: flex-end; margin-top: 10px;">
          <button class="btn btn-secondary" data-route="dashboard">
            Back to Dashboard
          </button>
          <button class="btn btn-primary btn-lg" id="btn-start-recovery-from-insight" data-route="recovery">
            Fix This Concept (Start 5-Step Path) →
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderConceptExplanationView(topicId = 'two-pointer') {
  const explanation = CONCEPT_EXPLANATIONS[topicId] || CONCEPT_EXPLANATIONS['two-pointer'];

  return `
    <div class="explanation-view">
      <div class="explanation-card">
        <div class="explanation-header">
          <div class="explanation-eyebrow">Micro-Learning Concept Refresh</div>
          <h1 class="explanation-title">${explanation.title}</h1>
          <p style="font-size: 1rem; color: var(--text-muted); margin-top: 6px;">${explanation.subtitle}</p>
        </div>

        <!-- Key Concepts -->
        <div class="explanation-section">
          ${explanation.keyPoints.map(kp => `
            <div style="margin-bottom: 12px;">
              <h3 style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 4px;">• ${kp.heading}</h3>
              <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">${kp.content}</p>
            </div>
          `).join('')}
        </div>

        <!-- Visual Memory Diagram -->
        <div class="array-visual-diagram">
          <div class="diagram-caption">${explanation.visualDiagram.description}</div>
          <div class="array-cells-row">
            ${explanation.visualDiagram.arrayValues.map((val, idx) => {
              const isLeft = idx === explanation.visualDiagram.leftPointerIndex;
              const isRight = idx === explanation.visualDiagram.rightPointerIndex;
              let highlightClass = '';
              if (isLeft) highlightClass = 'highlight-left';
              if (isRight) highlightClass = 'highlight-right';

              return `
                <div class="array-cell-block">
                  <span class="cell-index">Index [${idx}]</span>
                  <div class="cell-box ${highlightClass}">
                    ${val}
                  </div>
                  ${isLeft ? '<span class="cell-pointer left-ptr">left</span>' : ''}
                  ${isRight ? '<span class="cell-pointer right-ptr">right</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Code Callouts: Bad vs Good -->
        <div class="code-callout-grid">
          <div class="code-callout-card bad">
            <div class="callout-title">⚠️ ${explanation.codeComparison.bad.title}</div>
            <pre><code>${explanation.codeComparison.bad.code}</code></pre>
          </div>
          <div class="code-callout-card good">
            <div class="callout-title">✓ ${explanation.codeComparison.good.title}</div>
            <pre><code>${explanation.codeComparison.good.code}</code></pre>
          </div>
        </div>

        <!-- Footer Call to Action -->
        <div class="explanation-footer">
          <div style="font-weight: 700; color: var(--text-main); font-size: 1rem;">
            Ready to test your refreshed concept?
          </div>
          <button class="btn btn-primary btn-lg" id="btn-explanation-ready" data-qid="${explanation.nextQuestionId || 'tp_01'}">
            ${explanation.readyActionText || 'Try an Easy Question →'}
          </button>
        </div>
      </div>
    </div>
  `;
}
