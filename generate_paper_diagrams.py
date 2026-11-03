"""
Generate High-Resolution Publication Diagrams for LearnPath AI
- Figure 1: End-to-End System Architecture
- Figure 2: Traditional Open-Loop vs Closed-Loop Recovery Gate
- Figure 4: Decision Gateway and Protocol Flow
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

RESULTS_DIR = "./results"
os.makedirs(RESULTS_DIR, exist_ok=True)

# Common styling constants
FONT_FAMILY = "sans-serif"
DPI = 300

def draw_fig1_architecture():
    fig, ax = plt.subplots(figsize=(14, 11), dpi=DPI)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 11)
    ax.axis("off")
    fig.patch.set_facecolor("#FFFFFF")

    # Title
    ax.text(7, 10.6, "Figure 1: End-to-End System Architecture of LearnPath AI", 
            ha="center", va="center", fontsize=15, fontweight="bold", color="#0F172A", fontfamily=FONT_FAMILY)
    ax.text(7, 10.25, "Layered Integration of Client-Side Execution, Cognitive Sequence Tracing, and Gated Remediation",
            ha="center", va="center", fontsize=10.5, color="#475569", fontfamily=FONT_FAMILY)

    # Layer 1: Learner Interface
    l1_bg = patches.FancyBboxPatch((0.8, 7.8), 12.4, 2.1, boxstyle="round,pad=0.1,rounding_size=0.15",
                                   linewidth=1.5, edgecolor="#94A3B8", facecolor="#F8FAFC")
    ax.add_patch(l1_bg)
    ax.text(1.2, 9.6, "LAYER 1: LEARNER PRESENTATION & INTERACTION LAYER (CLIENT-SIDE)", 
            fontsize=10, fontweight="bold", color="#1E293B", fontfamily=FONT_FAMILY)

    box_style_blue = dict(boxstyle="round,pad=0.1,rounding_size=0.1", linewidth=1.2, edgecolor="#3B82F6", facecolor="#EFF6FF")
    
    b1_1 = patches.FancyBboxPatch((1.2, 8.05), 3.6, 1.3, **box_style_blue)
    ax.add_patch(b1_1)
    ax.text(3.0, 8.85, "Diagnostic Formative MCQs", ha="center", va="center", fontsize=9.5, fontweight="bold", color="#1E3A8A")
    ax.text(3.0, 8.4, "Rapid-fire conceptual validation\nAdaptive difficulty weighting (β_j)", ha="center", va="center", fontsize=7.5, color="#475569")

    b1_2 = patches.FancyBboxPatch((5.2, 8.05), 3.6, 1.3, **box_style_blue)
    ax.add_patch(b1_2)
    ax.text(7.0, 8.85, "In-Browser Sandboxed IDE", ha="center", va="center", fontsize=9.5, fontweight="bold", color="#1E3A8A")
    ax.text(7.0, 8.4, "Real-time algorithmic syntax\nLocal AST method-body extraction", ha="center", va="center", fontsize=7.5, color="#475569")

    b1_3 = patches.FancyBboxPatch((9.2, 8.05), 3.6, 1.3, **box_style_blue)
    ax.add_patch(b1_3)
    ax.text(11.0, 8.85, "Client-Side Test Runner", ha="center", va="center", fontsize=9.5, fontweight="bold", color="#1E3A8A")
    ax.text(11.0, 8.4, "Zero-latency test case execution\nExecution watchdog & memory guards", ha="center", va="center", fontsize=7.5, color="#475569")

    # Arrow L1 -> L2
    ax.annotate("", xy=(7.0, 7.35), xytext=(7.0, 7.8),
                arrowprops=dict(arrowstyle="-|>", lw=2, color="#0284C7", mutation_scale=15))
    ax.text(7.15, 7.55, "Interaction Stream: y_t, Latency (Δt), Hints (h_t), Streaks (σ_t), Code Submissions",
            fontsize=8.5, fontweight="semibold", color="#0284C7")

    # Layer 2: Telemetry Ingestion
    l2_bg = patches.FancyBboxPatch((0.8, 5.6), 12.4, 1.7, boxstyle="round,pad=0.1,rounding_size=0.15",
                                   linewidth=1.5, edgecolor="#94A3B8", facecolor="#F8FAFC")
    ax.add_patch(l2_bg)
    ax.text(1.2, 7.05, "LAYER 2: TELEMETRY INGESTION & COGNITIVE FEATURE EXTRACTION", 
            fontsize=10, fontweight="bold", color="#1E293B", fontfamily=FONT_FAMILY)

    box_style_slate = dict(boxstyle="round,pad=0.1,rounding_size=0.1", linewidth=1.2, edgecolor="#64748B", facecolor="#F1F5F9")
    
    b2_1 = patches.FancyBboxPatch((1.2, 5.8), 5.7, 1.05, **box_style_slate)
    ax.add_patch(b2_1)
    ax.text(4.05, 6.45, "Temporal & Behavioral Ingestion Logger", ha="center", va="center", fontsize=9, fontweight="bold", color="#0F172A")
    ax.text(4.05, 6.05, "High-resolution wall-clock timer (Δt_resp) | Hint count tracking | Win/Loss streak polarity", ha="center", va="center", fontsize=7, color="#475569")

    b2_2 = patches.FancyBboxPatch((7.1, 5.8), 5.7, 1.05, **box_style_slate)
    ax.add_patch(b2_2)
    ax.text(9.95, 6.45, "Feature Projection Pipeline (Kaggle EDM Standard)", ha="center", va="center", fontsize=9, fontweight="bold", color="#0F172A")
    ax.text(9.95, 6.05, "Standardizes feature vector: x_t = [θ_i, β_j, y_t-1, Δt_resp, h_t, σ_t, E_t]^T", ha="center", va="center", fontsize=7.5, color="#0369A1", fontweight="semibold")

    # Arrow L2 -> L3
    ax.annotate("", xy=(7.0, 5.15), xytext=(7.0, 5.6),
                arrowprops=dict(arrowstyle="-|>", lw=2, color="#0284C7", mutation_scale=15))
    ax.text(7.15, 5.35, "Standardized Cognitive Feature Vector x_t",
            fontsize=8.5, fontweight="semibold", color="#0284C7")

    # Layer 3: Cognitive Tracing & AI Core
    l3_bg = patches.FancyBboxPatch((0.8, 3.1), 12.4, 2.0, boxstyle="round,pad=0.1,rounding_size=0.15",
                                   linewidth=1.5, edgecolor="#94A3B8", facecolor="#F8FAFC")
    ax.add_patch(l3_bg)
    ax.text(1.2, 4.85, "LAYER 3: COGNITIVE ANALYTICS & KNOWLEDGE TRACING ENGINE (AI CORE)", 
            fontsize=10, fontweight="bold", color="#1E293B", fontfamily=FONT_FAMILY)

    box_style_purple = dict(boxstyle="round,pad=0.1,rounding_size=0.1", linewidth=1.2, edgecolor="#8B5CF6", facecolor="#F5F3FF")
    
    b3_1 = patches.FancyBboxPatch((1.2, 3.3), 3.6, 1.3, **box_style_purple)
    ax.add_patch(b3_1)
    ax.text(3.0, 4.1, "Psychometric Calibrator", ha="center", va="center", fontsize=9.5, fontweight="bold", color="#5B21B6")
    ax.text(3.0, 3.65, "BKT Prior & Transition Matrix\nDynamic IRT Slip P(S) & Guess P(G)", ha="center", va="center", fontsize=7.5, color="#475569")

    b3_2 = patches.FancyBboxPatch((5.2, 3.3), 3.6, 1.3, **box_style_purple)
    ax.add_patch(b3_2)
    ax.text(7.0, 4.1, "TransDKT+ Sequence Core", ha="center", va="center", fontsize=9.5, fontweight="bold", color="#5B21B6")
    ax.text(7.0, 3.65, "Gradient-Boosted Sequence Ensemble\nAUC: 0.8539 | Accuracy: 79.22%", ha="center", va="center", fontsize=7.5, color="#166534", fontweight="semibold")

    b3_3 = patches.FancyBboxPatch((9.2, 3.3), 3.6, 1.3, **box_style_purple)
    ax.add_patch(b3_3)
    ax.text(11.0, 4.1, "Misconception Classifier", ha="center", va="center", fontsize=9.5, fontweight="bold", color="#5B21B6")
    ax.text(11.0, 3.65, "6 Algorithmic Error Categories\nSystemic Clustered Deficit Flagging", ha="center", va="center", fontsize=7.5, color="#475569")

    # Arrow L3 -> L4
    ax.annotate("", xy=(7.0, 2.65), xytext=(7.0, 3.1),
                arrowprops=dict(arrowstyle="-|>", lw=2, color="#0284C7", mutation_scale=15))
    ax.text(7.15, 2.85, "State Evaluation: Latent Mastery θ_k & Misconception Flag",
            fontsize=8.5, fontweight="semibold", color="#0284C7")

    # Layer 4: Pedagogical Policy & Recovery Gate
    l4_bg = patches.FancyBboxPatch((0.8, 0.4), 12.4, 2.2, boxstyle="round,pad=0.1,rounding_size=0.15",
                                   linewidth=1.5, edgecolor="#94A3B8", facecolor="#F8FAFC")
    ax.add_patch(l4_bg)
    ax.text(1.2, 2.35, "LAYER 4: PEDAGOGICAL POLICY & CLOSED-LOOP RECOVERY GATE", 
            fontsize=10, fontweight="bold", color="#1E293B", fontfamily=FONT_FAMILY)

    # Diamond / Decision
    d_patch = patches.Polygon([[2.8, 1.45], [4.1, 1.85], [5.4, 1.45], [4.1, 1.05]], 
                              closed=True, edgecolor="#F59E0B", facecolor="#FEF3C7", lw=1.5)
    ax.add_patch(d_patch)
    ax.text(4.1, 1.45, "Mastery >= 75%?", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#92400E")

    # Branch True: Progression
    ax.annotate("", xy=(1.2, 1.45), xytext=(2.8, 1.45),
                arrowprops=dict(arrowstyle="-|>", lw=1.8, color="#10B981", mutation_scale=12))
    ax.text(2.0, 1.6, "YES (Pass)", ha="center", va="bottom", fontsize=8, fontweight="bold", color="#047857")

    b_prog = patches.FancyBboxPatch((0.95, 0.65), 1.6, 1.4, boxstyle="round,pad=0.08,rounding_size=0.1",
                                    linewidth=1.2, edgecolor="#10B981", facecolor="#ECFDF5")
    ax.add_patch(b_prog)
    ax.text(1.75, 1.45, "Curricular\nAdvancement", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#065F46")
    ax.text(1.75, 0.95, "Unlock Next\nPrerequisite\nDSA Node", ha="center", va="center", fontsize=7, color="#047857")

    # Branch False: Gate
    ax.annotate("", xy=(6.2, 1.45), xytext=(5.4, 1.45),
                arrowprops=dict(arrowstyle="-|>", lw=1.8, color="#EF4444", mutation_scale=12))
    ax.text(5.8, 1.6, "NO (<50% / Deficit)", ha="center", va="bottom", fontsize=8, fontweight="bold", color="#B91C1C")

    # Recovery Gate 3 Stages
    b_gate = patches.FancyBboxPatch((6.2, 0.6), 6.8, 1.5, boxstyle="round,pad=0.08,rounding_size=0.1",
                                    linewidth=1.5, edgecolor="#EF4444", facecolor="#FEF2F2")
    ax.add_patch(b_gate)
    ax.text(6.4, 1.85, "STRICT THREE-STAGE RECOVERY GATE (PROGRESSION LOCKED)", fontsize=8, fontweight="bold", color="#991B1B")

    s1 = patches.FancyBboxPatch((6.4, 0.75), 1.9, 0.95, boxstyle="round,pad=0.05,rounding_size=0.08",
                                edgecolor="#DC2626", facecolor="#FFFFFF", lw=1)
    ax.add_patch(s1)
    ax.text(7.35, 1.35, "Stage 1: Micro-Notes", ha="center", va="center", fontsize=7.5, fontweight="bold", color="#991B1B")
    ax.text(7.35, 1.0, "Socratic conceptual\nscaffolding on error", ha="center", va="center", fontsize=6.5, color="#4B5563")

    s2 = patches.FancyBboxPatch((8.5, 0.75), 1.9, 0.95, boxstyle="round,pad=0.05,rounding_size=0.08",
                                edgecolor="#DC2626", facecolor="#FFFFFF", lw=1)
    ax.add_patch(s2)
    ax.text(9.45, 1.35, "Stage 2: 5 MCQs", ha="center", va="center", fontsize=7.5, fontweight="bold", color="#991B1B")
    ax.text(9.45, 1.0, "Formative diagnostics\nReq. 80% passing", ha="center", va="center", fontsize=6.5, color="#4B5563")

    s3 = patches.FancyBboxPatch((10.6, 0.75), 2.2, 0.95, boxstyle="round,pad=0.05,rounding_size=0.08",
                                edgecolor="#DC2626", facecolor="#FFFFFF", lw=1)
    ax.add_patch(s3)
    ax.text(11.7, 1.35, "Stage 3: 2 Code Tasks", ha="center", va="center", fontsize=7.5, fontweight="bold", color="#991B1B")
    ax.text(11.7, 1.0, "Sandboxed execution\n100% test assertions", ha="center", va="center", fontsize=6.5, color="#4B5563")

    plt.tight_layout()
    out_path = os.path.join(RESULTS_DIR, "fig1_system_architecture.png")
    plt.savefig(out_path, dpi=DPI, bbox_inches="tight")
    plt.close()
    print(f"Generated: {out_path}")


def draw_fig2_open_vs_closed():
    fig, ax = plt.subplots(figsize=(13, 8), dpi=DPI)
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 8)
    ax.axis("off")
    fig.patch.set_facecolor("#FFFFFF")

    # Title
    ax.text(6.5, 7.6, "Figure 2: Architectural Comparison: Traditional Open-Loop KT vs. LearnPath AI", 
            ha="center", va="center", fontsize=14, fontweight="bold", color="#0F172A", fontfamily=FONT_FAMILY)

    # Column Left: Traditional
    c_left = patches.FancyBboxPatch((0.5, 0.5), 5.7, 6.7, boxstyle="round,pad=0.1,rounding_size=0.15",
                                   linewidth=1.5, edgecolor="#CBD5E1", facecolor="#F8FAFC")
    ax.add_patch(c_left)
    ax.text(3.35, 6.9, "TRADITIONAL OPEN-LOOP PARADIGM\n(Conventional Intelligent Tutoring Systems)", 
            ha="center", va="center", fontsize=10.5, fontweight="bold", color="#475569", multialignment="center")

    steps_left = [
        ("1. Student Submits Attempt", "Solves MCQ or code problem; records binary outcome y_t in {0,1}"),
        ("2. Offline KT Sequence Model", "Standard DKT / SAKT estimates probability P(y_t+1 = 1)"),
        ("3. Passive Metric Logging", "Mastery % displayed on instructor dashboard or student profile"),
        ("4. Unconditional Advancement", "Student continues to next complex topic regardless of failure")
    ]
    y_pos = 5.8
    for title, desc in steps_left:
        b = patches.FancyBboxPatch((1.0, y_pos - 0.7), 4.7, 0.9, boxstyle="round,pad=0.08,rounding_size=0.1",
                                   linewidth=1.2, edgecolor="#94A3B8", facecolor="#FFFFFF")
        ax.add_patch(b)
        ax.text(3.35, y_pos - 0.15, title, ha="center", va="center", fontsize=9, fontweight="bold", color="#1E293B")
        ax.text(3.35, y_pos - 0.45, desc, ha="center", va="center", fontsize=7.5, color="#64748B")
        if y_pos > 3.0:
            ax.annotate("", xy=(3.35, y_pos - 0.95), xytext=(3.35, y_pos - 0.7),
                        arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#94A3B8"))
        y_pos -= 1.25

    # Flaw container
    f_box = patches.FancyBboxPatch((1.0, 0.8), 4.7, 1.0, boxstyle="round,pad=0.08,rounding_size=0.1",
                                   linewidth=1.5, edgecolor="#EF4444", facecolor="#FEF2F2", linestyle="--")
    ax.add_patch(f_box)
    ax.text(3.35, 1.5, "CRITICAL PEDAGOGICAL FLAW:", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#991B1B")
    ax.text(3.35, 1.1, "Unresolved concept gaps compound downstream into\ncascading failure loops, cognitive fatigue & student dropout.", 
            ha="center", va="center", fontsize=7.5, color="#B91C1C", multialignment="center")

    # Column Right: LearnPath AI
    c_right = patches.FancyBboxPatch((6.8, 0.5), 5.7, 6.7, boxstyle="round,pad=0.1,rounding_size=0.15",
                                    linewidth=1.5, edgecolor="#3B82F6", facecolor="#EFF6FF")
    ax.add_patch(c_right)
    ax.text(9.65, 6.9, "LEARNPATH AI CLOSED-LOOP FRAMEWORK\n(Feature-Augmented Tracing + Recovery Gate)", 
            ha="center", va="center", fontsize=10.5, fontweight="bold", color="#1E40AF", multialignment="center")

    steps_right = [
        ("1. Granular Telemetry & Assessment", "Records latency (Δt), hint counts (h_t), streaks, and code AST"),
        ("2. TransDKT+ & Misconception Diagnostics", "Calculates mastery θ and categorizes 6 procedural error types"),
        ("3. Automated Progression Lock", "If mastery < 50% or systemic error: halts linear traversal immediately"),
        ("4. 3-Stage Closed-Loop Remediation", "Mandatory path: Micro-Notes -> 5 Diagnostic MCQs -> 2 Sandbox Code")
    ]
    y_pos = 5.8
    for title, desc in steps_right:
        b = patches.FancyBboxPatch((7.3, y_pos - 0.7), 4.7, 0.9, boxstyle="round,pad=0.08,rounding_size=0.1",
                                   linewidth=1.2, edgecolor="#3B82F6", facecolor="#FFFFFF")
        ax.add_patch(b)
        ax.text(9.65, y_pos - 0.15, title, ha="center", va="center", fontsize=9, fontweight="bold", color="#1E3A8A")
        ax.text(9.65, y_pos - 0.45, desc, ha="center", va="center", fontsize=7.5, color="#475569")
        if y_pos > 3.0:
            ax.annotate("", xy=(9.65, y_pos - 0.95), xytext=(9.65, y_pos - 0.7),
                        arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#2563EB"))
        y_pos -= 1.25

    # Benefit container
    b_box = patches.FancyBboxPatch((7.3, 0.8), 4.7, 1.0, boxstyle="round,pad=0.08,rounding_size=0.1",
                                   linewidth=1.5, edgecolor="#10B981", facecolor="#ECFDF5")
    ax.add_patch(b_box)
    ax.text(9.65, 1.5, "PROVEN RESEARCH BENEFIT (EMPIRICAL):", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#065F46")
    ax.text(9.65, 1.1, "68.4% Recovery Success (RGSR) | +24.9% Mastery Gain\nDownstream concept churn eliminated; time-to-mastery = 5.54 Qs.", 
            ha="center", va="center", fontsize=7.5, color="#047857", multialignment="center")

    plt.tight_layout()
    out_path = os.path.join(RESULTS_DIR, "fig2_open_vs_closed_loop.png")
    plt.savefig(out_path, dpi=DPI, bbox_inches="tight")
    plt.close()
    print(f"Generated: {out_path}")


def draw_fig4_decision_gateway():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=DPI)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis("off")
    fig.patch.set_facecolor("#FFFFFF")

    # Title
    ax.text(5.5, 8.1, "Figure 4: Decision Gateway & Remediation Protocol Flow", 
            ha="center", va="center", fontsize=13.5, fontweight="bold", color="#0F172A", fontfamily=FONT_FAMILY)

    # Node 1: Start
    n1 = patches.FancyBboxPatch((3.5, 7.1), 4.0, 0.65, boxstyle="round,pad=0.06,rounding_size=0.1",
                                edgecolor="#64748B", facecolor="#F1F5F9", lw=1.2)
    ax.add_patch(n1)
    ax.text(5.5, 7.42, "Student Submits MCQ or Code Solution", ha="center", va="center", fontsize=9, fontweight="bold", color="#1E293B")

    ax.annotate("", xy=(5.5, 6.7), xytext=(5.5, 7.1), arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#64748B"))

    # Node 2: Update & Diagnostic
    n2 = patches.FancyBboxPatch((2.2, 5.9), 6.6, 0.8, boxstyle="round,pad=0.06,rounding_size=0.1",
                                edgecolor="#3B82F6", facecolor="#EFF6FF", lw=1.2)
    ax.add_patch(n2)
    ax.text(5.5, 6.45, "Dynamic Cognitive Update & Error Categorization", ha="center", va="center", fontsize=9, fontweight="bold", color="#1E3A8A")
    ax.text(5.5, 6.12, "Update Latent θ_k via Difficulty-Scaled Delta | Misconception Tagging (INDEX, BOUNDARY, LOGIC, etc.)", ha="center", va="center", fontsize=7.2, color="#475569")

    ax.annotate("", xy=(5.5, 5.4), xytext=(5.5, 5.9), arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#64748B"))

    # Diamond 1: Deficit Check
    d1 = patches.Polygon([[5.5, 5.4], [7.3, 4.85], [5.5, 4.3], [3.7, 4.85]], 
                         closed=True, edgecolor="#F59E0B", facecolor="#FEF3C7", lw=1.4)
    ax.add_patch(d1)
    ax.text(5.5, 4.95, "Systemic Deficit?", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#92400E")
    ax.text(5.5, 4.65, "θ_k < 50% OR Clustered Errors", ha="center", va="center", fontsize=7, color="#B45309")

    # Branch No: Check Mastery >= 75%
    ax.annotate("", xy=(2.0, 4.85), xytext=(3.7, 4.85), arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#10B981"))
    ax.text(2.85, 5.0, "NO (Normal)", ha="center", va="bottom", fontsize=7.5, fontweight="bold", color="#047857")

    d2 = patches.Polygon([[2.0, 4.85], [1.1, 4.35], [2.0, 3.85], [2.9, 4.35]], 
                         closed=True, edgecolor="#10B981", facecolor="#ECFDF5", lw=1.2)
    ax.add_patch(d2)
    ax.text(2.0, 4.35, "θ_k >= 75%?", ha="center", va="center", fontsize=7.5, fontweight="bold", color="#065F46")

    # d2 branches
    # Yes -> Unlock
    ax.annotate("", xy=(2.0, 3.0), xytext=(2.0, 3.85), arrowprops=dict(arrowstyle="-|>", lw=1.4, color="#10B981"))
    ax.text(2.1, 3.5, "YES", fontsize=7, fontweight="bold", color="#047857")
    b_unlock = patches.FancyBboxPatch((0.8, 2.3), 2.4, 0.7, boxstyle="round,pad=0.05,rounding_size=0.08",
                                     edgecolor="#10B981", facecolor="#D1FAE5", lw=1.2)
    ax.add_patch(b_unlock)
    ax.text(2.0, 2.65, "Concept Mastered\nUnlock Next Syllabus Topic", ha="center", va="center", fontsize=7.5, fontweight="bold", color="#065F46")

    # No -> Practice
    ax.annotate("", xy=(2.0, 1.4), xytext=(2.0, 2.3), arrowprops=dict(arrowstyle="-|>", lw=1.4, color="#64748B"))
    b_prac = patches.FancyBboxPatch((0.8, 0.7), 2.4, 0.7, boxstyle="round,pad=0.05,rounding_size=0.08",
                                    edgecolor="#94A3B8", facecolor="#F8FAFC", lw=1.2)
    ax.add_patch(b_prac)
    ax.text(2.0, 1.05, "Intermediate Practice\nServe Adaptive Questions", ha="center", va="center", fontsize=7.5, color="#334155")

    # Branch Yes from d1: RECOVERY GATE
    ax.annotate("", xy=(8.5, 4.85), xytext=(7.3, 4.85), arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#EF4444"))
    ax.text(7.9, 5.0, "YES (Trigger Gate)", ha="center", va="bottom", fontsize=7.5, fontweight="bold", color="#DC2626")

    gate_container = patches.FancyBboxPatch((4.8, 0.7), 5.7, 3.9, boxstyle="round,pad=0.08,rounding_size=0.12",
                                           edgecolor="#EF4444", facecolor="#FEF2F2", lw=1.5)
    ax.add_patch(gate_container)
    ax.text(7.65, 4.3, "THREE-STAGE RECOVERY GATE (LOCKED)", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#991B1B")

    # Stage 1
    s1 = patches.FancyBboxPatch((5.2, 3.2), 4.9, 0.75, boxstyle="round,pad=0.05,rounding_size=0.08",
                                edgecolor="#DC2626", facecolor="#FFFFFF", lw=1)
    ax.add_patch(s1)
    ax.text(7.65, 3.65, "Stage 1: Focused Socratic Micro-Notes", ha="center", va="center", fontsize=8, fontweight="bold", color="#991B1B")
    ax.text(7.65, 3.35, "Explains underlying algorithmic invariant (e.g. pointer boundary logic)", ha="center", va="center", fontsize=6.8, color="#4B5563")

    ax.annotate("", xy=(7.65, 2.75), xytext=(7.65, 3.2), arrowprops=dict(arrowstyle="-|>", lw=1.3, color="#DC2626"))

    # Stage 2
    s2 = patches.FancyBboxPatch((5.2, 2.0), 4.9, 0.75, boxstyle="round,pad=0.05,rounding_size=0.08",
                                edgecolor="#DC2626", facecolor="#FFFFFF", lw=1)
    ax.add_patch(s2)
    ax.text(7.65, 2.45, "Stage 2: 5 Targeted Formative Diagnostic MCQs", ha="center", va="center", fontsize=8, fontweight="bold", color="#991B1B")
    ax.text(7.65, 2.15, "Requirement: >= 4/5 (80%) correct. If failed, reset to Stage 1.", ha="center", va="center", fontsize=6.8, color="#4B5563")

    ax.annotate("", xy=(7.65, 1.55), xytext=(7.65, 2.0), arrowprops=dict(arrowstyle="-|>", lw=1.3, color="#DC2626"))

    # Stage 3
    s3 = patches.FancyBboxPatch((5.2, 0.8), 4.9, 0.75, boxstyle="round,pad=0.05,rounding_size=0.08",
                                edgecolor="#DC2626", facecolor="#FFFFFF", lw=1)
    ax.add_patch(s3)
    ax.text(7.65, 1.25, "Stage 3: 2 Hands-on Sandboxed Coding Tasks", ha="center", va="center", fontsize=8, fontweight="bold", color="#991B1B")
    ax.text(7.65, 0.95, "Full unit-test passage required. Unlocks gate upon resolution.", ha="center", va="center", fontsize=6.8, color="#4B5563")

    # Gate resolved -> Unlock
    ax.annotate("", xy=(3.2, 2.65), xytext=(4.8, 1.15), 
                arrowprops=dict(arrowstyle="-|>", lw=1.5, color="#10B981", connectionstyle="arc3,rad=-0.25"))
    ax.text(4.0, 1.7, "Gate Resolved (RGSR)", ha="center", va="center", fontsize=7.2, fontweight="bold", color="#047857", rotation=25)

    plt.tight_layout()
    out_path = os.path.join(RESULTS_DIR, "fig4_decision_gateway.png")
    plt.savefig(out_path, dpi=DPI, bbox_inches="tight")
    plt.close()
    print(f"Generated: {out_path}")


if __name__ == "__main__":
    draw_fig1_architecture()
    draw_fig2_open_vs_closed()
    draw_fig4_decision_gateway()
    print("[SUCCESS] All architectural figures generated in results/ directory!")

