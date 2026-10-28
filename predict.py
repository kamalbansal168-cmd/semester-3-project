"""
=============================================================================
  LearnPath AI - Live Model Inference & Student Mastery Predictor
=============================================================================
Uses the trained Knowledge Tracing model (results/trained_dkt_model.pkl)
to predict student performance in real-time and provide adaptive recommendations.

Usage:
  py -3.13 predict.py
  py -3.13 predict.py --topic "Binary Search" --difficulty "Hard" --prior_acc 0.75 --streak 2
=============================================================================
"""

import os
import sys
import io
import math
import argparse
# pyrefly: ignore[missing-import]
import joblib
# pyrefly: ignore[missing-import]
import numpy as np

# Windows UTF-8 console fix
if sys.stdout and hasattr(sys.stdout, "buffer"):
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    except Exception:
        pass

MODEL_PATH = "./results/trained_dkt_model.pkl"

TOPICS_LIST = [
    "Array Basics",
    "Two Pointer Technique",
    "Sliding Window",
    "Prefix Sum & Cumulative",
    "Binary Search",
    "Sorting Algorithms",
    "Strings & Char Arrays",
    "2D Arrays & Matrices",
    "Recursion & Backtracking",
    "Stack & Queue Fundamentals"
]


def load_model():
    if not os.path.exists(MODEL_PATH):
        print(f"[ERROR] Trained model file not found at: {MODEL_PATH}")
        print("Please run 'py -3.13 train_kaggle_benchmark.py' first.")
        sys.exit(1)
    return joblib.load(MODEL_PATH)


def predict(topic, difficulty, prior_acc, global_acc, streak, response_time_sec=25.0, hints=0):
    payload = load_model()
    model = payload["model"]
    topics = payload["topics"]
    
    # Map topic
    topic_clean = topic.strip().lower()
    matched_idx = 0
    matched_topic_name = topics[0]
    for idx, t in enumerate(topics):
        if topic_clean in t.lower():
            matched_idx = idx
            matched_topic_name = t
            break
            
    # Map difficulty
    diff_lower = difficulty.strip().lower()
    if "hard" in diff_lower:
        diff_score = 0.75
    elif "easy" in diff_lower:
        diff_score = 0.25
    else:
        diff_score = 0.50
        
    num_topics = len(topics)
    skill_vec = [0.0] * num_topics
    skill_vec[matched_idx] = 1.0
    
    rt_norm = math.log1p(response_time_sec) / 4.0
    streak_norm = np.clip(streak / 5.0, -1.0, 1.0)
    
    feature_vector = np.array([skill_vec + [
        0.5, # prior_attempts_norm
        float(prior_acc),
        float(global_acc),
        float(streak_norm),
        float(diff_score),
        float(rt_norm),
        min(hints / 3.0, 1.0)
    ]])
    
    prob = float(model.predict_proba(feature_vector)[0][1])
    
    # Pedagogical Recommendation
    if prob >= 0.75:
        recommendation = "High Mastery (Proceed to Challenge / Harder Concept)"
        action = "PROMOTE_LEVEL"
        color_tag = "[OPTIMAL]"
    elif prob >= 0.50:
        recommendation = "Developing Competency (Continue Practice at Current Level)"
        action = "MAINTAIN_PRACTICE"
        color_tag = "[STABLE]"
    else:
        recommendation = "Struggling State Detected -> Trigger Recovery Gate Modal"
        action = "TRIGGER_RECOVERY_GATE"
        color_tag = "[INTERVENTION]"

    return {
        "topic": matched_topic_name,
        "difficulty": difficulty.capitalize(),
        "success_probability": round(prob * 100, 2),
        "recommendation": recommendation,
        "action": action,
        "color_tag": color_tag,
        "model_used": payload["model_name"]
    }


def main():
    parser = argparse.ArgumentParser(description="LearnPath AI - Live Student Mastery Prediction")
    parser.add_argument("--topic", type=str, default=None, help="Target CS topic")
    parser.add_argument("--difficulty", type=str, default="Medium", help="Question difficulty: Easy, Medium, Hard")
    parser.add_argument("--prior_acc", type=float, default=0.70, help="Prior accuracy on this skill (0.0 to 1.0)")
    parser.add_argument("--global_acc", type=float, default=0.72, help="Global cumulative accuracy (0.0 to 1.0)")
    parser.add_argument("--streak", type=int, default=1, help="Current streak (positive for correct, negative for errors)")
    parser.add_argument("--time_sec", type=float, default=24.0, help="Estimated response time in seconds")
    parser.add_argument("--hints", type=int, default=0, help="Hints requested (0 to 3)")
    
    args = parser.parse_args()
    
    print("\n" + "=" * 65)
    print("  LEARNPATH AI: LIVE KNOWLEDGE TRACING INFERENCE ENGINE")
    print("=" * 65)
    
    if args.topic is None:
        print("[MODE] Interactive Demo Mode (Press Enter for Defaults):\n")
        print("Available Topics:")
        for i, t in enumerate(TOPICS_LIST, 1):
            print(f"  {i}. {t}")
        print()
        
        t_input = input("Enter Topic Name or Number [Default: Binary Search]: ").strip()
        if t_input.isdigit() and 1 <= int(t_input) <= len(TOPICS_LIST):
            topic = TOPICS_LIST[int(t_input) - 1]
        elif t_input:
            topic = t_input
        else:
            topic = "Binary Search"
            
        diff = input("Enter Difficulty (Easy / Medium / Hard) [Default: Medium]: ").strip() or "Medium"
        acc_str = input("Student Historical Accuracy on Skill (0.0 - 1.0) [Default: 0.70]: ").strip() or "0.70"
        streak_str = input("Current Correct Streak [Default: 2]: ").strip() or "2"
        
        args.topic = topic
        args.difficulty = diff
        args.prior_acc = float(acc_str)
        args.streak = int(streak_str)
        
    res = predict(
        topic=args.topic,
        difficulty=args.difficulty,
        prior_acc=args.prior_acc,
        global_acc=args.global_acc,
        streak=args.streak,
        response_time_sec=args.time_sec,
        hints=args.hints
    )
    
    print("\n" + "-" * 65)
    print(f"  Topic Tested         : {res['topic']}")
    print(f"  Target Difficulty    : {res['difficulty']}")
    print(f"  Student Prior Acc    : {args.prior_acc * 100:.1f}%")
    print(f"  Current Streak       : {args.streak}")
    print("-" * 65)
    print(f"  Model Architecture   : {res['model_used']}")
    print(f"  Predicted P(Success) : {res['success_probability']}%")
    print(f"  Pedagogical Status   : {res['color_tag']} {res['action']}")
    print(f"  Adaptive Action      : {res['recommendation']}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    main()
