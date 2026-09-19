/* ============================================================
   LEARNPATH AI — In-Browser PDF / Masterclass Study Notes Reader
   Full In-Depth Concept Guide with Sub-Types, Dry Run Tables,
   Memory Diagrams, and Annotated Java Implementations
   ============================================================ */

import { TOPIC_NOTES_DB } from '../data/topicNotes.js';

export function renderNotesView(topicId = 'basic-arrays') {
  const notes = TOPIC_NOTES_DB[topicId] || TOPIC_NOTES_DB['basic-arrays'];

  return `
    <div class="notes-view-wrapper">
      <!-- Notes Reader Top Toolbar -->
      <div class="notes-top-toolbar">
        <div class="notes-breadcrumbs">
          <a data-route="topics" class="notes-back-link">← Topics Guide</a>
          <span>/</span>
          <span style="color: var(--text-main); font-weight: 800;">${escapeHtml(notes.title)}</span>
        </div>

        <div class="notes-toolbar-actions">
          <button class="btn btn-secondary btn-sm" id="btn-print-pdf" title="Print or save as offline PDF document">
            🖨️ Print / Save as PDF
          </button>
          <button class="btn btn-primary btn-sm" data-route="practice" data-topic="${notes.id}">
            Practice This Topic →
          </button>
        </div>
      </div>

      <!-- Paper-Like PDF Document Body -->
      <div class="notes-paper-card" id="printable-notes-card">
        <!-- Document Header -->
        <div class="notes-document-header">
          <div class="notes-header-meta">
            <span class="notes-eyebrow-tag">📖 Masterclass Study Notes • ${escapeHtml(notes.category)}</span>
            <span class="notes-read-time">⏱ ${escapeHtml(notes.readTime)}</span>
          </div>
          <h1 class="notes-doc-title">${escapeHtml(notes.title)}</h1>
          <p class="notes-doc-subtitle">${escapeHtml(notes.subtitle)}</p>
          <div class="notes-author-badge">
            <span>✍️ Prepared by: <strong>${escapeHtml(notes.author)}</strong></span>
          </div>
        </div>

        <!-- 1. Conceptual Overview & Architecture -->
        <div class="notes-section">
          <h2 class="notes-section-title">1. Conceptual Overview</h2>
          <p class="notes-paragraph">${escapeHtml(notes.overview)}</p>
          
          ${notes.memoryModel ? `
            <div class="notes-memory-model-box">
              <div class="notes-memory-title">
                <span>🧠</span> ${escapeHtml(notes.memoryModel.title)}
              </div>
              <pre class="notes-ascii-diagram"><code>${escapeHtml(notes.memoryModel.diagram)}</code></pre>
              <p class="notes-memory-explanation">${escapeHtml(notes.memoryModel.explanation)}</p>
            </div>
          ` : ''}
        </div>

        <!-- 2. Deep-Dive Sub-Types & Algorithmic Patterns -->
        ${notes.subtypes && notes.subtypes.length > 0 ? `
          <div class="notes-section">
            <h2 class="notes-section-title">2. In-Depth Sub-Types & Problem Patterns</h2>
            <p class="notes-paragraph">Each problem in this topic falls into one of the following primary sub-types. Master these patterns to resolve any problem variant with confidence:</p>
            
            <div class="notes-subtypes-container">
              ${notes.subtypes.map((st, idx) => `
                <div class="notes-subtype-card">
                  <div class="notes-subtype-header">
                    <span class="notes-subtype-badge">${idx + 1}</span>
                    <h3 class="notes-subtype-name">${escapeHtml(st.typeName)}</h3>
                  </div>

                  <div class="notes-subtype-recognition">
                    <strong>🎯 Pattern Recognition Trigger:</strong>
                    <span>${escapeHtml(st.recognition)}</span>
                  </div>

                  <div class="notes-subtype-mechanism">
                    <strong>⚙️ Mechanism & Core Logic:</strong>
                    <p>${escapeHtml(st.mechanism)}</p>
                  </div>

                  ${st.asciiVisual ? `
                    <div class="notes-visual-box">
                      <div class="notes-box-label">📊 Visual State & Pointer Trace:</div>
                      <pre class="notes-ascii-diagram mini"><code>${escapeHtml(st.asciiVisual)}</code></pre>
                    </div>
                  ` : ''}

                  <div class="notes-subtype-code">
                    <div class="notes-box-label">💻 Annotated Java Reference Implementation:</div>
                    <pre class="notes-code-block"><code>${escapeHtml(st.javaCode)}</code></pre>
                  </div>

                  ${st.dryRunTrace ? `
                    <div class="notes-trace-box">
                      <div class="notes-box-label">🔬 Step-by-Step Dry Run Execution Table:</div>
                      <div class="notes-trace-input"><strong>Input Scenario:</strong> <code>${escapeHtml(st.dryRunTrace.input)}</code></div>
                      <div class="notes-trace-table-wrapper">
                        <table class="notes-trace-table">
                          <thead>
                            <tr>
                              ${st.dryRunTrace.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
                            </tr>
                          </thead>
                          <tbody>
                            ${st.dryRunTrace.rows.map(row => `
                              <tr>
                                ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>
                      <div class="notes-trace-result"><strong>✓ Result:</strong> ${escapeHtml(st.dryRunTrace.result)}</div>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. Pattern Recognition Cheat Sheet -->
        ${notes.patternRecognition && notes.patternRecognition.length > 0 ? `
          <div class="notes-section">
            <h2 class="notes-section-title">3. Pattern Recognition Decision Tree</h2>
            <p class="notes-paragraph">How to identify which approach to apply in an interview or exam under 10 seconds:</p>
            <div class="notes-decision-table-wrapper">
              <table class="notes-complexity-table">
                <thead>
                  <tr>
                    <th>If You See This Clue in the Problem</th>
                    <th>Optimal Algorithm / Data Structure to Apply</th>
                  </tr>
                </thead>
                <tbody>
                  ${notes.patternRecognition.map(pr => `
                    <tr>
                      <td><span style="font-weight: 700; color: #1E293B;">🔍 ${escapeHtml(pr.trigger)}</span></td>
                      <td><span class="badge badge-strong" style="font-size: 0.88rem;">⚡ ${escapeHtml(pr.bestApproach)}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- 4. Common Traps & Edge Case Checklist -->
        <div class="notes-section">
          <h2 class="notes-section-title">4. Common Pitfalls & Edge Cases Checklist</h2>
          <div class="notes-pitfall-box">
            <div class="notes-pitfall-title">
              <span>⚠️</span> Frequent Mistakes & Gotchas to Prevent Bugs:
            </div>
            <ul class="notes-pitfall-list">
              ${notes.pitfalls.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- 5. Complexity Reference Sheet -->
        <div class="notes-section">
          <h2 class="notes-section-title">5. Complexity Matrix</h2>
          <table class="notes-complexity-table">
            <thead>
              <tr>
                <th>Operation / Algorithm Sub-Type</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
              </tr>
            </thead>
            <tbody>
              ${notes.complexity.map(c => `
                <tr>
                  <td><strong>${escapeHtml(c.operation)}</strong></td>
                  <td><span class="badge badge-strong">${escapeHtml(c.time)}</span></td>
                  <td><span class="badge badge-good">${escapeHtml(c.space)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Document Footer & Action -->
        <div class="notes-footer-actions">
          <button class="btn btn-secondary" data-route="topics">
            ← Explore Other Topics
          </button>
          <button class="btn btn-primary btn-lg" data-route="practice" data-topic="${notes.id}">
            Start Practicing ${escapeHtml(notes.title)} →
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
