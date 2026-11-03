"""
Generate High-Resolution Complete Operational Pipeline Diagram for LearnPath AI
Output: results/fig3_operational_pipeline.png (300 DPI, Publication Grade)
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

RESULTS_DIR = "./results"
os.makedirs(RESULTS_DIR, exist_ok=True)

DPI = 300
FONT_FAMILY = "sans-serif"

def draw_complete_pipeline():
    fig, ax = plt.subplots(figsize=(16, 13), dpi=DPI)
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 13)
    ax.axis("off")
    fig.patch.set_facecolor("#FFFFFF")

    # =========================================================================
    # MAIN HEADER
    # =========================================================================
    ax.text(8.0, 12.55, "Figure 3: Complete End-to-End Operational Pipeline of LearnPath AI", 
            ha="center", va="center", fontsize=16, fontweight="bold", color="#0F172A", fontfamily=FONT_FAMILY)
    ax.text(8.0, 12.18, "Continuous Closed-Loop Workflow: Telemetry Capture -> Feature Projection -> TransDKT+ Inference -> Diagnostic Remediation Gate",
            ha="center", va="center", fontsize=10.5, color="#475569", fontfamily=FONT_FAMILY)

    # Helper styling functions
    def make_container(x, y, w, h, title, subtitle="", edge="#94A3B8", bg="#F8FAFC", title_col="#0F172A"):
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1,rounding_size=0.18",
                                     linewidth=1.6, edgecolor=edge, facecolor=bg)
        ax.add_patch(box)
        ax.text(x + 0.35, y + h - 0.35, title, fontsize=10.5, fontweight="bold", color=title_col, fontfamily=FONT_FAMILY)
        if subtitle:
            ax.text(x + 0.35, y + h - 0.65, subtitle, fontsize=8, color="#64748B", fontfamily=FONT_FAMILY)
        return box

    def make_card(x, y, w, h, title, desc, tag="", border="#3B82F6", fill="#FFFFFF", title_col="#1E3A8A"):
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.06,rounding_size=0.12",
                                     linewidth=1.3, edgecolor=border, facecolor=fill)
        ax.add_patch(box)
        if tag:
            tbox = patches.FancyBboxPatch((x + w - 1.4, y + h - 0.28), 1.3, 0.22, boxstyle="round,pad=0.03,rounding_size=0.05",
                                          linewidth=0.8, edgecolor=border, facecolor="#DBEAFE")
            ax.add_patch(tbox)
            ax.text(x + w - 0.75, y + h - 0.17, tag, ha="center", va="center", fontsize=6.2, fontweight="bold", color="#1D4ED8")
        ax.text(x + w/2, y + h - 0.45, title, ha="center", va="center", fontsize=9.2, fontweight="bold", color=title_col)
        ax.text(x + w/2, y + (h - 0.45)/2, desc, ha="center", va="center", fontsize=7.4, color="#475569", multialignment="center")
        return box

    # =========================================================================
    # LAYER 1: CLIENT PRESENTATION & ASSESSMENT EXECUTION (TOP)
    # =========================================================================
    make_container(0.6, 9.6, 14.8, 2.3, 
                   "PHASE 1: CLIENT PRESENTATION & ASSESSMENT EXECUTION (IN-BROWSER)", 
                   "Learner interacts with concept questions, submits code, and receives immediate sandboxed feedback",
                   edge="#3B82F6", bg="#F8FAFC", title_col="#1E3A8A")

    make_card(1.0, 9.8, 4.2, 1.4, "Diagnostic Formative MCQs", 
              "• Rapid invariant validation (Easy/Med/Hard)\n• Measures baseline conceptual grasp\n• Immediate Socratic rationale display", 
              tag="MCQ MODULE", border="#3B82F6", fill="#EFF6FF", title_col="#1E3A8A")

    make_card(5.9, 9.8, 4.2, 1.4, "Sandboxed Client Code IDE", 
              "• In-browser lightweight editor (Vanilla JS)\n• AST method-body extraction & sanitization\n• Zero-dependency client runtime", 
              tag="SANDBOX IDE", border="#3B82F6", fill="#EFF6FF", title_col="#1E3A8A")

    make_card(10.8, 9.8, 4.2, 1.4, "Real-Time Test Evaluator", 
              "• Visible examples + hidden edge cases\n• Execution watchdog (traps infinite loops)\n• Wall-clock timer & memory guard (<1ms)", 
              tag="TEST HARNESS", border="#3B82F6", fill="#EFF6FF", title_col="#1E3A8A")

    # Flow Arrow L1 -> L2
    ax.annotate("", xy=(8.0, 9.0), xytext=(8.0, 9.6),
                arrowprops=dict(arrowstyle="-|>", lw=2.2, color="#0284C7", mutation_scale=18))
    ax.text(8.2, 9.3, "Continuous Telemetry Stream: [ y_t, Δt_resp (ms), hints (h_t), streak (σ_t), code AST ]",
            fontsize=8.5, fontweight="bold", color="#0369A1", va="center")

    # =========================================================================
    # LAYER 2: TELEMETRY INGESTION & COGNITIVE FEATURE PROJECTION
    # =========================================================================
    make_container(0.6, 6.9, 14.8, 1.9, 
                   "PHASE 2: TELEMETRY INGESTION & COGNITIVE FEATURE EXTRACTION PIPELINE", 
                   "Transforms raw browser events into normalized, model-ready sequence feature vectors (Kaggle EDM Standard)",
                   edge="#0284C7", bg="#F0F9FF", title_col="#0369A1")

    make_card(1.0, 7.1, 4.2, 1.15, "Behavioral Logger", 
              "• performance.now() latency (Δt)\n• Hint usage counter (h_t)\n• Win/Loss streak polarity (σ_t)", 
              tag="TELEMETRY", border="#0EA5E9", fill="#FFFFFF", title_col="#0369A1")

    make_card(5.9, 7.1, 4.2, 1.15, "Dynamic Psychometrics", 
              "• Item Difficulty β_j in [0.25, 0.75]\n• P(G) = 0.25 - 0.18*β_j (Dynamic Guess)\n• P(S) = 0.05 + 0.12*β_j (Dynamic Slip)", 
              tag="IRT LINK", border="#0EA5E9", fill="#FFFFFF", title_col="#0369A1")

    make_card(10.8, 7.1, 4.2, 1.15, "Vector Projection Pipeline", 
              "x_t = [ θ_i, β_j, y_t-1, Δt_resp, h_t, σ_t, E_t ]^T\nAssembles 7-dimensional cognitive vector\nFeeds directly into predictive sequence model", 
              tag="FEATURE VECTOR", border="#0EA5E9", fill="#FFFFFF", title_col="#0369A1")

    # Flow Arrow L2 -> L3
    ax.annotate("", xy=(8.0, 6.3), xytext=(8.0, 6.9),
                arrowprops=dict(arrowstyle="-|>", lw=2.2, color="#0284C7", mutation_scale=18))
    ax.text(8.2, 6.6, "Inference Payload: Standardized Cognitive Vector x_t & Runtime Test Assertions",
            fontsize=8.5, fontweight="bold", color="#0369A1", va="center")

    # =========================================================================
    # LAYER 3: COGNITIVE ANALYTICS & KNOWLEDGE TRACING ENGINE (AI CORE)
    # =========================================================================
    make_container(0.6, 4.2, 14.8, 1.9, 
                   "PHASE 3: COGNITIVE ANALYTICS & KNOWLEDGE TRACING ENGINE (AI CORE)", 
                   "Dual-tiered inference: Psychometric mastery accumulation + TransDKT+ sequence prediction + Misconception diagnostics",
                   edge="#7C3AED", bg="#FAF5FF", title_col="#5B21B6")

    make_card(1.0, 4.4, 4.2, 1.15, "Box 3A: TransDKT+ Core", 
              "• Gradient-Boosted Sequence Ensemble\n• Evaluates cognitive interaction features\n• Benchmark AUC: 0.8539 | Acc: 79.22%", 
              tag="ML INFERENCE", border="#8B5CF6", fill="#FFFFFF", title_col="#5B21B6")

    make_card(5.9, 4.4, 4.2, 1.15, "Box 3B: BKT/IRT Calibrator", 
              "• Latent topic mastery θ_k in [0, 100]\n• Asymmetric step deltas (+8 to +16 / -3 to -6)\n• +5 Recovery bonus for low baseline (<40%)", 
              tag="PSYCHOMETRICS", border="#8B5CF6", fill="#FFFFFF", title_col="#5B21B6")

    make_card(10.8, 4.4, 4.2, 1.15, "Box 3C: Misconception Engine", 
              "• 6 Error Classes (INDEX, BOUNDARY, etc.)\n• Scans stack traces & AST violations\n• Systemic flag if >= 2 consecutive errors", 
              tag="DIAGNOSTICS", border="#8B5CF6", fill="#FFFFFF", title_col="#5B21B6")

    # Flow Arrow L3 -> L4
    ax.annotate("", xy=(8.0, 3.6), xytext=(8.0, 4.2),
                arrowprops=dict(arrowstyle="-|>", lw=2.2, color="#0284C7", mutation_scale=18))
    ax.text(8.2, 3.9, "State Evaluation: [ Latent Mastery θ_k, Consecutive Misconception Flag ]",
            fontsize=8.5, fontweight="bold", color="#0369A1", va="center")

    # =========================================================================
    # LAYER 4 & 5: PEDAGOGICAL POLICY & CLOSED-LOOP RECOVERY GATE
    # =========================================================================
    make_container(0.6, 0.4, 14.8, 3.0, 
                   "PHASE 4 & 5: PEDAGOGICAL POLICY & CLOSED-LOOP RECOVERY GATE REGULATION", 
                   "Enforces strict mastery gating: locks forward navigation upon deficit and unlocks only upon verified remediation",
                   edge="#DC2626", bg="#FFF5F5", title_col="#991B1B")

    # Decision Gateway Diamond
    d_x, d_y = 3.6, 1.8
    diamond = patches.Polygon([[d_x, d_y + 0.65], [d_x + 1.6, d_y], [d_x, d_y - 0.65], [d_x - 1.6, d_y]],
                              closed=True, edgecolor="#F59E0B", facecolor="#FEF3C7", lw=1.6)
    ax.add_patch(diamond)
    ax.text(d_x, d_y + 0.12, "Deficit Check:", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#92400E")
    ax.text(d_x, d_y - 0.18, "θ_k < 50% OR\n2+ Clustered Errors?", ha="center", va="center", fontsize=7.2, color="#B45309")

    # Arrow Down from L3 into Diamond
    ax.annotate("", xy=(d_x, d_y + 0.65), xytext=(d_x, 3.6),
                arrowprops=dict(arrowstyle="-|>", lw=1.8, color="#64748B"))

    # Branch NO (Left): Normal Progression
    ax.annotate("", xy=(1.0, d_y), xytext=(d_x - 1.6, d_y),
                arrowprops=dict(arrowstyle="-|>", lw=1.8, color="#10B981", mutation_scale=14))
    ax.text(1.9, d_y + 0.18, "NO (Normal)", ha="center", va="bottom", fontsize=8, fontweight="bold", color="#047857")

    prog_card = patches.FancyBboxPatch((0.9, 0.65), 1.9, 2.3, boxstyle="round,pad=0.06,rounding_size=0.1",
                                       linewidth=1.3, edgecolor="#10B981", facecolor="#ECFDF5")
    ax.add_patch(prog_card)
    ax.text(1.85, 2.65, "LINEAR TRAVERSAL", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#065F46")
    ax.text(1.85, 1.95, "• If θ_k >= 75%:\n  Mark Mastered\n  Unlock Next Concept\n\n• If 50% <= θ_k < 75%:\n  Adaptive Practice\n  Bridge Skill Delta", 
            ha="center", va="center", fontsize=7.3, color="#047857")
    ax.text(1.85, 0.95, "12-Topic Dependency Graph\n(Arrays -> TwoPointer -> ...)", ha="center", va="center", fontsize=6.5, color="#065F46", fontweight="bold")

    # Branch YES (Right): TRIGGER RECOVERY GATE (Progression Locked)
    ax.annotate("", xy=(5.8, d_y), xytext=(d_x + 1.6, d_y),
                arrowprops=dict(arrowstyle="-|>", lw=2.0, color="#DC2626", mutation_scale=16))
    ax.text(4.8, d_y + 0.18, "YES (Trigger Gate)", ha="center", va="bottom", fontsize=8, fontweight="bold", color="#DC2626")

    # Recovery Gate 3-Stage Container
    gate_card = patches.FancyBboxPatch((5.8, 0.65), 9.2, 2.3, boxstyle="round,pad=0.08,rounding_size=0.12",
                                       linewidth=1.6, edgecolor="#EF4444", facecolor="#FFFFFF")
    ax.add_patch(gate_card)
    ax.text(10.4, 2.7, "PROGRESSION LOCKED: THREE-STAGE REMEDIATION CYCLE", 
            ha="center", va="center", fontsize=9.2, fontweight="bold", color="#991B1B")

    # Sub-stages 1, 2, 3
    make_card(6.1, 0.85, 2.7, 1.55, "Stage 1: Micro-Notes", 
              "• Socratic conceptual theory\n• Focuses precisely on error tag\n• Clarifies invariants (guards/pointers)\n• Learner must confirm review", 
              tag="THEORY REVIEW", border="#DC2626", fill="#FEF2F2", title_col="#991B1B")

    ax.annotate("", xy=(9.2, 1.62), xytext=(8.8, 1.62), arrowprops=dict(arrowstyle="-|>", lw=1.6, color="#DC2626"))

    make_card(9.3, 0.85, 2.7, 1.55, "Stage 2: 5 Formative MCQs", 
              "• Diagnostic concept test\n• Target underlying boundary invariant\n• Requirement: >= 4/5 (80%)\n• Fail -> Resets back to Stage 1", 
              tag="EVALUATION", border="#DC2626", fill="#FEF2F2", title_col="#991B1B")

    ax.annotate("", xy=(12.4, 1.62), xytext=(12.0, 1.62), arrowprops=dict(arrowstyle="-|>", lw=1.6, color="#DC2626"))

    make_card(12.5, 0.85, 2.2, 1.55, "Stage 3: 2 Code Tasks", 
              "• Hands-on sandbox tasks\n• Requires 100% test pass\n• Zero compiler / edge bugs\n• Verifies active synthesis", 
              tag="SYNTHESIS", border="#DC2626", fill="#FEF2F2", title_col="#991B1B")

    # Feedback loop: Gate Resolved -> Unlock Next Topic
    ax.annotate("", xy=(2.8, 0.9), xytext=(5.8, 0.9),
                arrowprops=dict(arrowstyle="-|>", lw=1.8, color="#10B981", connectionstyle="arc3,rad=-0.12", mutation_scale=14))
    ax.text(4.3, 0.52, "Gate Resolved (RGSR: 68.4% | +24.9% Mastery Gain) -> Unlocks Dependent DSA Topic", 
            ha="center", va="center", fontsize=7.5, fontweight="bold", color="#047857")

    plt.tight_layout()
    out_path = os.path.join(RESULTS_DIR, "fig3_operational_pipeline.png")
    plt.savefig(out_path, dpi=DPI, bbox_inches="tight")
    plt.close()
    print(f"Generated: {out_path}")

if __name__ == "__main__":
    draw_complete_pipeline()

