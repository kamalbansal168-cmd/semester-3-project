/* ============================================================
   LEARNPATH AI — Feedback System Engine
   Manages: submit, store in localStorage, read for admin
   ============================================================ */

const FEEDBACK_KEY = 'learnpath_feedback_v1';

export const FeedbackEngine = {
  /**
   * Get all submitted feedback (sorted newest first)
   */
  getAll() {
    try {
      const raw = localStorage.getItem(FEEDBACK_KEY);
      if (!raw) {
        // Seed default feedbacks for realistic demo presentation
        const seeds = [
          {
            id: 'fb_seed_01',
            name: 'Priya Sharma',
            email: 'priya.sharma@learnpath.edu',
            rating: 5,
            category: 'AI Suggestions',
            message: 'The TransDKT recovery path accurately diagnosed where I was getting index errors in binary search. Super helpful recommendations!',
            timestamp: Date.now() - 3600000 * 2,
            dateStr: 'Today, 2 hrs ago'
          },
          {
            id: 'fb_seed_02',
            name: 'Rohit Verma',
            email: 'rohit.v@learnpath.edu',
            rating: 4,
            category: 'Code Execution',
            message: 'Monaco IDE and instant code execution in the browser is buttery smooth! Would love to see additional test case visualizers.',
            timestamp: Date.now() - 3600000 * 6,
            dateStr: 'Today, 6 hrs ago'
          },
          {
            id: 'fb_seed_03',
            name: 'Ananya Patel',
            email: 'ananya.p@learnpath.edu',
            rating: 5,
            category: 'Learning Content',
            message: 'Multiplayer 1v1 Battle Arena and recovery gate concept insights helped me clear all my recursion doubts before college lab test.',
            timestamp: Date.now() - 86400000,
            dateStr: 'Yesterday'
          }
        ];
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(seeds));
        return seeds;
      }
      const list = JSON.parse(raw);
      return list.sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  },

  /**
   * Submit new feedback entry
   */
  submit({ name, email, rating, category, message }) {
    const list = this.getAll();
    const entry = {
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: name || 'Anonymous',
      email: email || '',
      rating: parseInt(rating) || 5,
      category: category || 'General',
      message: (message || '').trim(),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };
    // Newest first in storage
    list.unshift(entry);
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Feedback storage failed:', e);
    }
    return entry;
  },

  /**
   * Delete a feedback entry by id (admin only)
   */
  delete(id) {
    const list = this.getAll().filter(f => f.id !== id);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  },

  /**
   * Get aggregate stats
   */
  getStats() {
    const list = this.getAll();
    if (!list.length) return { total: 0, avgRating: 0, byCategory: {} };
    const total = list.length;
    const avgRating = (list.reduce((s, f) => s + f.rating, 0) / total).toFixed(1);
    const byCategory = {};
    list.forEach(f => {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    });
    return { total, avgRating, byCategory };
  },

  /**
   * Render star string e.g. "⭐⭐⭐⭐☆" for rating 4
   */
  starsHtml(rating) {
    const r = Math.max(1, Math.min(5, parseInt(rating) || 5));
    return '⭐'.repeat(r) + '☆'.repeat(5 - r);
  }
};
