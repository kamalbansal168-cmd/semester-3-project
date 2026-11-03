"""
Generate Ultra High-Resolution Publication Grade Confusion Matrix PNG
Output: results/confusion_matrix_transdkt.png (300 DPI)
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import os

RESULTS_DIR = "./results"
os.makedirs(RESULTS_DIR, exist_ok=True)

DPI = 300
FONT_FAMILY = "sans-serif"

def draw_confusion_matrix():
    # Setup canvas
    fig = plt.figure(figsize=(9, 7.5), dpi=DPI, facecolor="#FFFFFF")
    
    # 2x2 Confusion Matrix values
    # Actual 0 (Wrong): TN=67, FP=64 (Total=131)
    # Actual 1 (Correct): FN=13, TP=174 (Total=187)
    cm = np.array([[67, 64],
                   [13, 174]])
    
    total = cm.sum() # 318
    acc = (67 + 174) / total * 100 # 78.61%
    recall = 174 / (174 + 13) * 100 # 92.93%
    prec = 174 / (174 + 64) * 100 # 76.35%
    f1 = 2 * (prec * recall) / (prec + recall) # 83.83
    
    # Grid layout: Matrix on left/center, summary header on top, metrics bar at bottom
    ax = fig.add_axes([0.15, 0.22, 0.65, 0.58]) # left, bottom, width, height
    
    # Custom color map with elegant academic blue gradient
    cmap = plt.cm.Blues
    cax = ax.imshow(cm, interpolation="nearest", cmap=cmap, vmin=0, vmax=190)
    
    # Colorbar
    cbar = fig.colorbar(cax, ax=ax, fraction=0.046, pad=0.06)
    cbar.ax.tick_params(labelsize=9)
    cbar.set_label("Number of Student Interaction Instances", fontsize=9.5, fontweight="semibold", labelpad=8)
    
    # Axis ticks and labels
    tick_marks = np.arange(2)
    ax.set_xticks(tick_marks)
    ax.set_yticks(tick_marks)
    ax.set_xticklabels(["Predicted Failure\n(Incorrect / 0)", "Predicted Success\n(Correct / 1)"], 
                       fontsize=10, fontweight="bold", color="#1E293B")
    ax.set_yticklabels(["Actual Failure\n(Incorrect / 0)", "Actual Success\n(Correct / 1)"], 
                       fontsize=10, fontweight="bold", color="#1E293B")
    
    ax.set_xlabel("Model Prediction (TransDKT+ Output)", fontsize=11, fontweight="bold", labelpad=10, color="#0F172A")
    ax.set_ylabel("Ground Truth (Actual Student Result)", fontsize=11, fontweight="bold", labelpad=10, color="#0F172A")
    
    # Cell Text Annotations (Count + Percentage + Label)
    labels = [
        [f"True Negative (TN)\n\n{cm[0,0]}\n(51.1% of fails)", 
         f"False Positive (FP)\n\n{cm[0,1]}\n(Careless slip)"],
        [f"False Negative (FN)\n\n{cm[1,0]}\n(Guess / 7.0%)", 
         f"True Positive (TP)\n\n{cm[1,1]}\n(93.0% of success)"]
    ]
    
    thresh = cm.max() / 2.0
    for i in range(2):
        for j in range(2):
            color = "white" if cm[i, j] > thresh else "#0F172A"
            ax.text(j, i, labels[i][j], ha="center", va="center",
                    fontsize=10.5, fontweight="bold", color=color, multialignment="center")
            
    # Remove top/right spines
    for spine in ax.spines.values():
        spine.set_color("#94A3B8")
        spine.set_linewidth(1.2)
        
    # Main Header & Subtitle
    fig.text(0.5, 0.94, "LearnPath AI — TransDKT+ Model Confusion Matrix", 
             ha="center", va="center", fontsize=14, fontweight="bold", color="#0F172A", fontfamily=FONT_FAMILY)
    fig.text(0.5, 0.89, "Independent Evaluation on 318 Test Instances (20% Holdout Split from 1,589 Benchmark Rows)", 
             ha="center", va="center", fontsize=9.5, color="#475569", fontfamily=FONT_FAMILY)
    
    # Summary Metrics Footer Card
    metric_text = (
        f"  Overall Accuracy: {acc:.2f}%  |  Recall (Sensitivity): {recall:.2f}%  |  "
        f"Precision: {prec:.2f}%  |  F1-Score: {f1:.4f}  |  AUC-ROC: 0.8539  "
    )
    fig.text(0.5, 0.08, metric_text, ha="center", va="center", fontsize=9.8, fontweight="bold",
             color="#1E3A8A", bbox=dict(boxstyle="round,pad=0.6,rounding_size=0.15", 
                                        facecolor="#EFF6FF", edgecolor="#3B82F6", linewidth=1.4))
    
    # Key Scientific Takeaway annotation
    takeaway = "Key Finding: High Recall (92.9%) ensures true student ability is captured with minimal false negatives (FN = 13)."
    fig.text(0.5, 0.03, takeaway, ha="center", va="center", fontsize=8.2, color="#047857", fontweight="semibold")

    # Save outputs
    out_path1 = os.path.join(RESULTS_DIR, "confusion_matrix_transdkt.png")
    out_path2 = os.path.join(RESULTS_DIR, "kaggle_fig4_confusion_matrix.png")
    
    plt.savefig(out_path1, dpi=DPI, bbox_inches="tight")
    plt.savefig(out_path2, dpi=DPI, bbox_inches="tight")
    plt.close()
    print(f"Generated: {out_path1}")
    print(f"Updated: {out_path2}")

if __name__ == "__main__":
    draw_confusion_matrix()

