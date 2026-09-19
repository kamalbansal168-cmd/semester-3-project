/* ============================================================
   LEARNPATH AI — Modern SaaS Landing Page Component
   ============================================================ */

export function renderLandingView() {
  return `
    <div class="landing-view">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-pill">
          <span>✨</span>
          <span>AI-Powered Knowledge Recovery</span>
        </div>

        <h1 class="hero-title">
          Understand Your Mistakes.<br />
          <span class="gradient-text">Improve Your Concepts.</span>
        </h1>

        <p class="hero-subtitle">
          The intelligent platform that doesn't just give you more questions — it pinpoints exactly why you struggle and builds a personalized 5-step recovery path to mastery.
        </p>

        <div class="hero-cta-group">
          <button class="btn btn-primary btn-lg" data-route="signup" id="hero-btn-start">
            Get Started Free →
          </button>
          <button class="btn btn-secondary btn-lg" data-route="practice" style="border: 1.5px solid var(--primary-border); color: var(--primary);">
            Explore Question Bank
          </button>
        </div>

        <!-- Interactive Hero Recovery Cycle Preview Card -->
        <div class="hero-preview-container">
          <div class="hero-preview-header">
            <div>
              <div style="font-size: 0.82rem; font-weight: 800; color: var(--primary); text-transform: uppercase;">
                The Complete Learning & Recovery Cycle
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-top: 2px;">
                How LearnPath AI Closes Your Concept Gaps
              </h3>
            </div>
            <span class="badge badge-strong">Continuous Adaptive Loop</span>
          </div>

          <div class="hero-cycle-grid">
            <div class="hero-cycle-card">
              <div class="cycle-step-icon">1</div>
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main);">Solve Problem</div>
              <p style="font-size: 0.78rem; color: var(--text-muted);">MCQ or LeetCode IDE playground challenge.</p>
            </div>

            <div class="hero-cycle-card">
              <div class="cycle-step-icon">2</div>
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main);">AI Diagnoses Gap</div>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Detects index off-by-one errors & boundary bugs.</p>
            </div>

            <div class="hero-cycle-card highlight">
              <div class="cycle-step-icon">💡</div>
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary);">Concept Insight</div>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Targeted micro-learning & memory visuals.</p>
            </div>

            <div class="hero-cycle-card">
              <div class="cycle-step-icon">4</div>
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main);">5-Step Recovery</div>
              <p style="font-size: 0.78rem; color: var(--text-muted);">Progressive targeted questions & coding task.</p>
            </div>

            <div class="hero-cycle-card highlight" style="border-color: var(--success); background: #F0FDF4;">
              <div class="cycle-step-icon" style="background: var(--success); color: white; border-color: var(--success);">✓</div>
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--success-text);">Re-Test & Gain</div>
              <p style="font-size: 0.78rem; color: #065F46;">Verified mastery jump and green tick updates.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section" id="landing-features">
        <div>
          <span class="section-tag">Core Capabilities</span>
          <h2 class="section-title">Built Different From Normal Question Banks</h2>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">🧠</div>
            <h3 class="feature-card-title">Misconception Detection</h3>
            <p class="feature-card-desc">
              Identifies error patterns like index out of bounds, lookahead boundary misses, and loop limits instead of just marking right/wrong.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">🎯</div>
            <h3 class="feature-card-title">5-Step Recovery Paths</h3>
            <p class="feature-card-desc">
              Guided path from Concept Refresh $\rightarrow$ Easy Practice $\rightarrow$ Medium Challenge $\rightarrow$ In-Place Coding $\rightarrow$ Validation Re-Test.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">💻</div>
            <h3 class="feature-card-title">LeetCode Style Playground</h3>
            <p class="feature-card-desc">
              Dark IDE editor with live line numbers, multi-tab test case runner, real code execution, and permanent Green Tick (✓ Solved) tracking.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon-wrapper">📈</div>
            <h3 class="feature-card-title">Student Knowledge Model</h3>
            <p class="feature-card-desc">
              Dynamic topic-wise mastery scoring based on difficulty weighting, solving time, and retention — with zero fake stats.
            </p>
          </div>
        </div>
      </section>

      <!-- Live CTA Banner -->
      <section class="demo-cta-banner">
        <div class="demo-cta-content">
          <span class="badge badge-strong" style="width: fit-content;">Get Started</span>
          <h2 class="demo-cta-title">Start Closing Your Programming Concept Gaps Today</h2>
          <p class="demo-cta-desc">
            Explore Java Arrays, Two Pointer algorithms, Searching, Sorting, and 2D Matrices with intelligent diagnostic feedback.
          </p>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-lg" data-route="signup" style="background: white; color: var(--primary); box-shadow: var(--shadow-md);">
            Create Free Account →
          </button>
          <button class="btn btn-secondary btn-lg" data-route="signin" style="background: rgba(255,255,255,0.15); color: white; border-color: rgba(255,255,255,0.3);">
            Sign In
          </button>
        </div>
      </section>

      <!-- Clean Footer -->
      <footer style="border-top: 1px solid var(--border-color); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; color: var(--text-muted); font-size: 0.88rem;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="brand-logo-icon" style="width: 28px; height: 28px; font-size: 0.9rem;">L</div>
          <strong>LearnPath AI</strong> — "Understand your mistakes. Improve your concepts."
        </div>
        <div>
          © 2026 LearnPath AI. Built for Computer Science & Programming Mastery.
        </div>
      </footer>
    </div>
  `;
}
