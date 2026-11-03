/* ============================================================
   LEARNPATH AI — CodeChef-Style Competitive Contests Engine
   Manages: Contest Scheduling, Registrations, Live Timers,
            Submissions, Scoring, and Real-Time Leaderboards
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';

const STORAGE_KEY_CONTESTS = 'learnpath_contests_v1';
const STORAGE_KEY_CONTEST_SUBMISSIONS = 'learnpath_contest_submissions_v1';

export class ContestEngine {
  /**
   * Initializes default contests if not already stored in localStorage
   */
  static init() {
    const existing = localStorage.getItem(STORAGE_KEY_CONTESTS);
    if (!existing) {
      const now = Date.now();
      
      // Default Seed Contests
      const seedContests = [
        {
          id: 'contest_starters_42',
          title: 'LearnPath Starters 42 (Div 2 & 3)',
          tagline: 'Weekly algorithmic challenge on Array Invariants, Two-Pointer & Kadane’s Algorithm',
          // Started 25 mins ago, ends in 65 mins (90 min duration) -> LIVE NOW
          startTime: new Date(now - 25 * 60 * 1000).toISOString(),
          endTime: new Date(now + 65 * 60 * 1000).toISOString(),
          durationMinutes: 90,
          author: 'Admin (Prasanjit Dhar)',
          difficulty: 'All Levels',
          badge: '🔥 LIVE NOW',
          problems: [
            { id: 'tp_code_01', code: 'P1', points: 100, title: 'Reverse Array In-Place', difficulty: 'Easy' },
            { id: 'tp_code_02', code: 'P2', points: 150, title: 'Move Zeroes to End', difficulty: 'Easy' },
            { id: 'lc_two_sum', code: 'P3', points: 250, title: 'Two Sum II - Sorted Array', difficulty: 'Medium' },
            { id: 'lc_max_sub', code: 'P4', points: 350, title: 'Maximum Subarray (Kadane)', difficulty: 'Medium' }
          ],
          registeredUsers: [
            { email: 'priya.sharma@learnpath.edu', name: 'Priya Sharma', registeredAt: new Date(now - 2 * 3600 * 1000).toISOString() },
            { email: 'rohit.v@learnpath.edu', name: 'Rohit Verma', registeredAt: new Date(now - 4 * 3600 * 1000).toISOString() },
            { email: 'ananya.p@learnpath.edu', name: 'Ananya Patel', registeredAt: new Date(now - 5 * 3600 * 1000).toISOString() },
            { email: 'kavya.iyer@learnpath.edu', name: 'Kavya Iyer', registeredAt: new Date(now - 6 * 3600 * 1000).toISOString() },
            { email: 'aman.tripathi@learnpath.edu', name: 'Aman Tripathi', registeredAt: new Date(now - 1 * 3600 * 1000).toISOString() },
            { email: 'aryan.soni@learnpath.edu', name: 'Aryan Soni', registeredAt: new Date(now - 30 * 60 * 1000).toISOString() }
          ],
          simulatedLeaderboard: [
            {
              rank: 1,
              name: 'Ananya Patel',
              email: 'ananya.p@learnpath.edu',
              avatar: 'AP',
              rating: '⭐⭐⭐⭐ (Candidate Master)',
              score: 850,
              penalty: 48,
              problemResults: {
                P1: { status: 'AC', time: 8, attempts: 1 },
                P2: { status: 'AC', time: 14, attempts: 1 },
                P3: { status: 'AC', time: 21, attempts: 1 },
                P4: { status: 'AC', time: 35, attempts: 2 }
              }
            },
            {
              rank: 2,
              name: 'Aman Tripathi',
              email: 'aman.tripathi@learnpath.edu',
              avatar: 'AT',
              rating: '⭐⭐⭐ (Specialist)',
              score: 500,
              penalty: 42,
              problemResults: {
                P1: { status: 'AC', time: 5, attempts: 1 },
                P2: { status: 'AC', time: 12, attempts: 1 },
                P3: { status: 'AC', time: 25, attempts: 1 },
                P4: { status: 'WA', attempts: 2 }
              }
            },
            {
              rank: 3,
              name: 'Priya Sharma',
              email: 'priya.sharma@learnpath.edu',
              avatar: 'PS',
              rating: '⭐⭐⭐ (Specialist)',
              score: 500,
              penalty: 49,
              problemResults: {
                P1: { status: 'AC', time: 7, attempts: 1 },
                P2: { status: 'AC', time: 18, attempts: 2 },
                P3: { status: 'AC', time: 24, attempts: 1 },
                P4: { status: 'WA', attempts: 1 }
              }
            },
            {
              rank: 4,
              name: 'Rohit Verma',
              email: 'rohit.v@learnpath.edu',
              avatar: 'RV',
              rating: '⭐⭐ (Pupil)',
              score: 250,
              penalty: 26,
              problemResults: {
                P1: { status: 'AC', time: 10, attempts: 1 },
                P2: { status: 'AC', time: 16, attempts: 1 },
                P3: { status: 'WA', attempts: 3 },
                P4: { status: 'UNSOLVED' }
              }
            },
            {
              rank: 5,
              name: 'Kavya Iyer',
              email: 'kavya.iyer@learnpath.edu',
              avatar: 'KI',
              rating: '⭐⭐ (Pupil)',
              score: 100,
              penalty: 9,
              problemResults: {
                P1: { status: 'AC', time: 9, attempts: 1 },
                P2: { status: 'WA', attempts: 2 },
                P3: { status: 'UNSOLVED' },
                P4: { status: 'UNSOLVED' }
              }
            }
          ]
        },
        {
          id: 'contest_sprint_05',
          title: 'DSA Sprint Cup #5: Binary Search & Matrices',
          tagline: 'High-speed algorithmic sprint covering Monotonic Search and 2D Array Transformations',
          // Starts in 2 days -> UPCOMING
          startTime: new Date(now + 2 * 24 * 3600 * 1000).toISOString(),
          endTime: new Date(now + (2 * 24 * 3600 + 7200) * 1000).toISOString(),
          durationMinutes: 120,
          author: 'Admin (Prasanjit Dhar)',
          difficulty: 'Medium - Hard',
          badge: '📅 UPCOMING',
          problems: [
            { id: 'lc_bin_search', code: 'P1', points: 100, title: 'Binary Search Algorithm', difficulty: 'Easy' },
            { id: 'tp_code_01', code: 'P2', points: 200, title: 'Reverse Array In-Place', difficulty: 'Easy' },
            { id: 'lc_two_sum', code: 'P3', points: 300, title: 'Two Sum II - Sorted Array', difficulty: 'Medium' }
          ],
          registeredUsers: [
            { email: 'ananya.p@learnpath.edu', name: 'Ananya Patel', registeredAt: new Date(now - 12 * 3600 * 1000).toISOString() },
            { email: 'priya.sharma@learnpath.edu', name: 'Priya Sharma', registeredAt: new Date(now - 10 * 3600 * 1000).toISOString() }
          ],
          simulatedLeaderboard: []
        },
        {
          id: 'contest_grand_prix_01',
          title: 'LearnPath Bi-Weekly Grand Prix #1',
          tagline: 'Foundational algorithmic championship for Data Structures & Problem Solving',
          // Ended 3 days ago -> FINISHED
          startTime: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
          endTime: new Date(now - (3 * 24 * 3600 - 5400) * 1000).toISOString(),
          durationMinutes: 90,
          author: 'Admin (Prasanjit Dhar)',
          difficulty: 'Intermediate',
          badge: '🏁 ENDED',
          problems: [
            { id: 'tp_code_01', code: 'P1', points: 100, title: 'Reverse Array In-Place', difficulty: 'Easy' },
            { id: 'tp_code_02', code: 'P2', points: 200, title: 'Move Zeroes to End', difficulty: 'Easy' },
            { id: 'lc_max_sub', code: 'P3', points: 400, title: 'Maximum Subarray (Kadane)', difficulty: 'Medium' }
          ],
          registeredUsers: [
            { email: 'ananya.p@learnpath.edu', name: 'Ananya Patel', registeredAt: '2026-10-25' },
            { email: 'priya.sharma@learnpath.edu', name: 'Priya Sharma', registeredAt: '2026-10-25' },
            { email: 'rohit.v@learnpath.edu', name: 'Rohit Verma', registeredAt: '2026-10-25' }
          ],
          simulatedLeaderboard: [
            {
              rank: 1,
              name: 'Ananya Patel',
              email: 'ananya.p@learnpath.edu',
              avatar: 'AP',
              rating: '⭐⭐⭐⭐ (Candidate Master)',
              score: 700,
              penalty: 34,
              problemResults: {
                P1: { status: 'AC', time: 6, attempts: 1 },
                P2: { status: 'AC', time: 12, attempts: 1 },
                P3: { status: 'AC', time: 16, attempts: 1 }
              }
            },
            {
              rank: 2,
              name: 'Priya Sharma',
              email: 'priya.sharma@learnpath.edu',
              avatar: 'PS',
              rating: '⭐⭐⭐ (Specialist)',
              score: 700,
              penalty: 45,
              problemResults: {
                P1: { status: 'AC', time: 9, attempts: 1 },
                P2: { status: 'AC', time: 14, attempts: 1 },
                P3: { status: 'AC', time: 22, attempts: 2 }
              }
            },
            {
              rank: 3,
              name: 'Rohit Verma',
              email: 'rohit.v@learnpath.edu',
              avatar: 'RV',
              rating: '⭐⭐ (Pupil)',
              score: 300,
              penalty: 25,
              problemResults: {
                P1: { status: 'AC', time: 11, attempts: 1 },
                P2: { status: 'AC', time: 14, attempts: 1 },
                P3: { status: 'WA', attempts: 2 }
              }
            }
          ]
        }
      ];

      localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(seedContests));
    }
  }

  /**
   * Returns all contests sorted by status: LIVE -> UPCOMING -> ENDED
   */
  static getAllContests() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_CONTESTS) || '[]');
      // Dynamically re-evaluate status based on current wall-clock time
      return data.map(c => {
        const status = this.getContestStatus(c);
        return {
          ...c,
          status,
          badge: status === 'LIVE' ? '🔥 LIVE NOW' : (status === 'UPCOMING' ? '📅 UPCOMING' : '🏁 ENDED')
        };
      });
    } catch (e) {
      return [];
    }
  }

  /**
   * Retrieves single contest by ID
   */
  static getContestById(id) {
    const all = this.getAllContests();
    return all.find(c => c.id === id) || null;
  }

  /**
   * Determines if contest is LIVE, UPCOMING, or ENDED based on current time
   */
  static getContestStatus(contest) {
    const now = Date.now();
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();

    if (now < start) return 'UPCOMING';
    if (now >= start && now <= end) return 'LIVE';
    return 'ENDED';
  }

  /**
   * Checks if user is registered for a contest
   */
  static isUserRegistered(contestId, userEmail) {
    const contest = this.getContestById(contestId);
    if (!contest || !userEmail) return false;
    return contest.registeredUsers.some(u => u.email.toLowerCase() === userEmail.toLowerCase());
  }

  /**
   * Registers a student for a contest
   */
  static registerUser(contestId, user) {
    this.init();
    const contests = this.getAllContests();
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return { success: false, message: 'Contest not found' };

    const email = user.email || `${user.name.toLowerCase().replace(/\s+/g, '')}@learnpath.edu`;
    const alreadyRegistered = contest.registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (alreadyRegistered) {
      return { success: true, message: 'Already registered for this contest!' };
    }

    contest.registeredUsers.push({
      email,
      name: user.name || 'Student Participant',
      registeredAt: new Date().toISOString()
    });

    localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(contests));
    return { success: true, message: `Successfully registered for ${contest.title}! 🚀` };
  }

  /**
   * Unregisters a user
   */
  static unregisterUser(contestId, userEmail) {
    this.init();
    const contests = this.getAllContests();
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return false;

    contest.registeredUsers = contest.registeredUsers.filter(u => u.email.toLowerCase() !== userEmail.toLowerCase());
    localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(contests));
    return true;
  }

  /**
   * Creates a new contest (Admin functionality)
   */
  static createContest(contestData) {
    this.init();
    const contests = this.getAllContests();
    const newId = `contest_${Date.now()}`;

    const startTime = new Date(contestData.startTime).toISOString();
    const durationMinutes = parseInt(contestData.durationMinutes) || 90;
    const endTime = new Date(new Date(startTime).getTime() + durationMinutes * 60 * 1000).toISOString();

    // Map selected problem IDs to full problem metadata
    const selectedProblems = (contestData.problemIds || []).map((qId, idx) => {
      const q = QUESTIONS_DB.find(item => item.id === qId);
      return {
        id: qId,
        code: `P${idx + 1}`,
        points: (idx + 1) * 100,
        title: q ? (q.title || q.subtopic || qId) : qId,
        difficulty: q ? q.difficulty : 'Medium'
      };
    });

    const newContest = {
      id: newId,
      title: contestData.title || 'LearnPath Coding Contest',
      tagline: contestData.tagline || 'Competitive programming challenge organized by Admin',
      startTime,
      endTime,
      durationMinutes,
      author: contestData.author || 'Admin (LearnPath AI)',
      difficulty: contestData.difficulty || 'All Levels',
      badge: '📅 UPCOMING',
      problems: selectedProblems.length > 0 ? selectedProblems : [
        { id: 'tp_code_01', code: 'P1', points: 100, title: 'Reverse Array In-Place', difficulty: 'Easy' },
        { id: 'lc_two_sum', code: 'P2', points: 200, title: 'Two Sum II - Sorted Array', difficulty: 'Medium' }
      ],
      registeredUsers: [],
      simulatedLeaderboard: []
    };

    contests.unshift(newContest);
    localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(contests));
    return newContest;
  }

  /**
   * Deletes a contest (Admin functionality)
   */
  static deleteContest(contestId) {
    this.init();
    let contests = this.getAllContests();
    contests = contests.filter(c => c.id !== contestId);
    localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(contests));
    return true;
  }

  /**
   * Records a user submission in the contest arena and updates real-time leaderboard
   */
  static recordSubmission(contestId, user, problemCode, codeSubmitted, testResults) {
    this.init();
    const contests = this.getAllContests();
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return null;

    const email = user.email || 'guest@learnpath.edu';
    const userName = user.name || 'Participant';
    const isPassed = testResults.allPassed === true;

    // Get all user submissions stored in localStorage
    let allSubmissions = [];
    try {
      allSubmissions = JSON.parse(localStorage.getItem(STORAGE_KEY_CONTEST_SUBMISSIONS) || '[]');
    } catch(e) { allSubmissions = []; }

    const newSub = {
      id: `sub_${Date.now()}`,
      contestId,
      userEmail: email,
      userName,
      problemCode,
      isPassed,
      passedCount: testResults.passedCount,
      totalCount: testResults.totalCount,
      executionTimeMs: testResults.executionTimeMs,
      timestamp: new Date().toISOString()
    };

    allSubmissions.push(newSub);
    localStorage.setItem(STORAGE_KEY_CONTEST_SUBMISSIONS, JSON.stringify(allSubmissions));

    return newSub;
  }

  /**
   * Dynamically constructs the real-time leaderboard combining simulated bots + real user
   */
  static getLeaderboard(contestId, currentUser) {
    const contest = this.getContestById(contestId);
    if (!contest) return [];

    let leaderboard = [...(contest.simulatedLeaderboard || [])];

    // If current user is logged in and has submissions, merge their real score
    if (currentUser && currentUser.email) {
      let allSubmissions = [];
      try {
        allSubmissions = JSON.parse(localStorage.getItem(STORAGE_KEY_CONTEST_SUBMISSIONS) || '[]');
      } catch(e) { allSubmissions = []; }

      const userSubs = allSubmissions.filter(s => s.contestId === contestId && s.userEmail.toLowerCase() === currentUser.email.toLowerCase());
      
      let userScore = 0;
      let userPenalty = 0;
      const userProblems = {};

      contest.problems.forEach(p => {
        const pSubs = userSubs.filter(s => s.problemCode === p.code);
        if (pSubs.length === 0) {
          userProblems[p.code] = { status: 'UNSOLVED' };
        } else {
          const passedSub = pSubs.find(s => s.isPassed);
          if (passedSub) {
            userScore += p.points;
            const elapsedMins = Math.max(1, Math.floor((new Date(passedSub.timestamp).getTime() - new Date(contest.startTime).getTime()) / 60000));
            userPenalty += elapsedMins + (pSubs.length - 1) * 10; // 10 min penalty per wrong attempt
            userProblems[p.code] = { status: 'AC', time: elapsedMins, attempts: pSubs.length };
          } else {
            userProblems[p.code] = { status: 'WA', attempts: pSubs.length };
          }
        }
      });

      // Remove existing dummy user if any, and insert real user
      leaderboard = leaderboard.filter(item => item.email.toLowerCase() !== currentUser.email.toLowerCase());
      
      leaderboard.push({
        name: `${currentUser.name} (You)`,
        email: currentUser.email,
        avatar: currentUser.avatar || currentUser.name.charAt(0).toUpperCase(),
        rating: '⭐ Pupil (Active Contestant)',
        score: userScore,
        penalty: userPenalty,
        problemResults: userProblems,
        isCurrentUser: true
      });
    }

    // Sort leaderboard by Total Score (Descending), then Penalty Time (Ascending)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.penalty - b.penalty;
    });

    // Re-assign 1-based ranks
    leaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return leaderboard;
  }
}
