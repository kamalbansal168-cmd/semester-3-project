/* ============================================================
   LEARNPATH AI — Recovery Path View (5 Steps)
   ============================================================ */

export function renderRecoveryPathView(state) {
  const path = state.recoveryPath || {
    topicName: 'Two Pointer',
    conceptName: 'Array Index Handling',
    currentStepIndex: 0,
    totalSteps: 5,
    steps: [
      { id: 'step_refresh', title: 'Concept Refresh', description: 'Visual refresher on pointer boundaries & indices', status: 'CURRENT', questionId: null },
      { id: 'step_easy', title: 'Easy Practice', description: 'Warm-up on 2-pointer boundary bounds and basic checks', status: 'LOCKED', questionId: 'tp_01' },
      { id: 'step_med', title: 'Medium Practice', description: 'Targeted practice on avoiding off-by-one pointer shifts', status: 'LOCKED', questionId: 'tp_02' },
      { id: 'step_code', title: 'Coding Challenge', description: 'Implement Reverse Array in-place using two converging pointers', status: 'LOCKED', questionId: 'tp_code_01' },
      { id: 'step_retest', title: 'Re-Test', description: '5-question validation to verify concept recovery & update mastery', status: 'LOCKED', questionId: null }
    ]
  };

  const currentStep = path.steps[path.currentStepIndex] || path.steps[path.steps.length - 1];
  const completedCount = path.steps.filter(s => s.status === 'COMPLETED').length;

  return `
    <div class="recovery-path-view">
      <!-- Recovery Header Card -->
      <div class="recovery-header-card">
        <div class="recovery-title-group">
          <div class="recovery-badge">🎯 Personalized Recovery Path</div>
          <h1 class="recovery-main-title">Fixing: ${path.conceptName} (${path.topicName})</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Step-by-step guided recovery designed to close your detected concept gap.
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">
            ${completedCount} / ${path.totalSteps}
          </div>
          <span style="font-size: 0.8rem; color: var(--text-light); font-weight: 700; text-transform: uppercase;">
            Steps Completed
          </span>
        </div>
      </div>

      <!-- Steps Timeline -->
      <div class="recovery-steps-timeline">
        ${path.steps.map((step, idx) => {
          const isCompleted = step.status === 'COMPLETED';
          const isCurrent = step.status === 'CURRENT';
          const isLocked = step.status === 'LOCKED';

          return `
            <div class="recovery-step-card ${step.status.toLowerCase()}">
              <div class="step-card-left">
                <div class="step-number-pill">
                  ${isCompleted ? '✓' : idx + 1}
                </div>
                <div class="step-details">
                  <div class="step-name-row">
                    <span class="step-name">${step.title}</span>
                    <span class="badge ${isCompleted ? 'badge-strong' : (isCurrent ? 'badge-good' : 'badge-neutral')}">
                      ${isCompleted ? 'Completed' : (isCurrent ? 'Current Step' : 'Locked')}
                    </span>
                  </div>
                  <span class="step-desc">${step.description}</span>
                </div>
              </div>

              <div>
                ${isCurrent ? `
                  <button class="btn btn-primary btn-launch-step" data-step-index="${idx}" data-topic="${path.topicId || 'two-pointer'}" data-step-type="${step.type || (idx === 0 ? 'CONCEPT_REFRESH' : (idx === 4 ? 'RE_TEST' : (idx === 3 ? 'CODING_CHALLENGE' : 'PRACTICE')))}" data-qid="${step.questionId || ''}">
                    Start Step ${idx + 1} →
                  </button>
                ` : (isCompleted ? `
                  <button class="btn btn-secondary btn-sm btn-launch-step" data-step-index="${idx}" data-topic="${path.topicId || 'two-pointer'}" data-step-type="${step.type || (idx === 0 ? 'CONCEPT_REFRESH' : (idx === 4 ? 'RE_TEST' : (idx === 3 ? 'CODING_CHALLENGE' : 'PRACTICE')))}" data-qid="${step.questionId || ''}">
                    Review
                  </button>
                ` : `
                  <span style="font-size: 0.85rem; color: var(--text-light); font-weight: 600;">🔒 Locked</span>
                `)}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Action Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <button class="btn btn-secondary" data-route="dashboard">
          ← Back to Dashboard
        </button>
        ${currentStep && currentStep.status === 'CURRENT' ? `
          <button class="btn btn-primary btn-lg btn-launch-step" data-step-index="${path.currentStepIndex}" data-topic="${path.topicId || 'two-pointer'}" data-step-type="${currentStep.type || (path.currentStepIndex === 0 ? 'CONCEPT_REFRESH' : (path.currentStepIndex === 4 ? 'RE_TEST' : (path.currentStepIndex === 3 ? 'CODING_CHALLENGE' : 'PRACTICE')))}" data-qid="${currentStep.questionId || ''}">
            Continue: ${currentStep.title} →
          </button>
        ` : ''}
      </div>
    </div>
  `;
}
