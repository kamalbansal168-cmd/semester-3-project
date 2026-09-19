/* ============================================================
   LEARNPATH AI — 12 Expanded Topics & Initial Baseline Data
   ============================================================ */

export const INITIAL_SUBJECTS = [
  { id: 'java', name: 'Java', icon: '☕', description: 'Core object-oriented & data structures', active: true },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Scripting, algorithmic problems & syntax', active: false },
  { id: 'dsa', name: 'DSA', icon: '⚡', description: 'Data structures & algorithmic techniques', active: false },
  { id: 'dbms', name: 'DBMS', icon: '🗄️', description: 'Relational databases & SQL queries', active: false },
  { id: 'webdev', name: 'Web Dev', icon: '🌐', description: 'Frontend & backend web technologies', active: false }
];

export const INITIAL_TOPICS = [
  {
    id: 'basic-arrays',
    subjectId: 'java',
    name: 'Array Basics',
    description: 'Declaration, memory allocation, indexing & linear scanning',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 15,
    solvedCount: 0
  },
  {
    id: 'searching',
    subjectId: 'java',
    name: 'Searching Algorithms',
    description: 'Linear search, Binary search & boundary condition checks',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 14,
    solvedCount: 0
  },
  {
    id: 'sorting',
    subjectId: 'java',
    name: 'Sorting Algorithms',
    description: 'Bubble, Selection, Insertion, Merge sort & stability',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 12,
    solvedCount: 0
  },
  {
    id: 'strings',
    subjectId: 'java',
    name: 'Strings & Char Arrays',
    description: 'Character arrays, immutability & string manipulation',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 16,
    solvedCount: 0
  },
  {
    id: '2d-arrays',
    subjectId: 'java',
    name: '2D Arrays & Matrices',
    description: 'Matrix traversal, row/column operations & nested loops',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 14,
    solvedCount: 0
  },
  {
    id: 'two-pointer',
    subjectId: 'java',
    name: 'Two Pointer Technique',
    description: 'Converging & sliding pointers for linear time optimizations',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 16,
    solvedCount: 0
  },
  {
    id: 'sliding-window',
    subjectId: 'java',
    name: 'Sliding Window',
    description: 'Fixed & dynamic size windows for optimal subarray evaluation',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 12,
    solvedCount: 0
  },
  {
    id: 'prefix-sum',
    subjectId: 'java',
    name: 'Prefix Sum & Cumulative',
    description: 'O(1) range sum queries, difference arrays & prefix frequency',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'recursion',
    subjectId: 'java',
    name: 'Recursion & Backtracking',
    description: 'Base cases, call stack unwinding & array subproblems',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'monotonic-stack',
    subjectId: 'java',
    name: 'Monotonic Stacks & Queues',
    description: 'Next greater element, sliding window maximum & array spans',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'linked-list',
    subjectId: 'java',
    name: 'Linked List Fundamentals',
    description: 'Nodes, pointers, reversal & fast-slow pointer detection',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 12,
    solvedCount: 0
  },
  {
    id: 'bit-manipulation',
    subjectId: 'java',
    name: 'Bit Manipulation & Hashing',
    description: 'XOR tricks, frequency mapping & single number patterns',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  }
];

export const FRESH_STUDENT_STATE = {
  user: {
    id: 'user_' + Date.now(),
    name: 'Student',
    email: 'student@example.com',
    avatar: 'S',
    level: 'Beginner',
    streakDays: 0,
    createdAt: new Date().toISOString().split('T')[0]
  },
  metrics: {
    overallMastery: 0,
    lastWeekMastery: 0,
    improvementGain: 0,
    questionsSolved: 0,
    conceptsMastered: 0,
    learningStreak: 0,
    avgSolvingTimeSeconds: 0
  },
  topics: JSON.parse(JSON.stringify(INITIAL_TOPICS)),
  focusAreas: [],
  conceptInsight: null,
  recoveryPath: null,
  solvedQuestions: [],
  weeklyActivity: [
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 0 },
    { day: 'Sun', count: 0, today: true }
  ],
  recentAttempts: [],
  accuracyTrends: [
    { week: 'Week 1', accuracy: 0 }
  ],
  resolvedConcepts: [],
  mistakesReviewList: []
};
