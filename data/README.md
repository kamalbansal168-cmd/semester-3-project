# LearnPath AI Research Dataset Directory

Place student interaction JSON files exported from the web app in this directory.

### How to Collect Data:
1. Open the LearnPath AI web app (`index.html` or `npm run dev`)
2. Have students solve questions (MCQ + DSA coding tasks)
3. Navigate to **Profile & Settings** -> click **"Export Research JSON"**
4. Save the downloaded `.json` file into this `data/` folder (e.g. `student_1.json`, `student_2.json`, ...)

### Benchmarking & Statistical Evaluation:
Run the evaluation suite:
```powershell
py evaluate.py
```
This automatically computes:
- AUC-ROC, F1-Score, Accuracy (ACC), Mean Squared Error (MSE)
- Recovery Gate Success Rate (RGSR)
- Misconception Detection Accuracy
- Wilcoxon Signed-Rank Test (Statistical Significance against base DKT)
- 4 publication-ready figures (saved as PNG in results/)
