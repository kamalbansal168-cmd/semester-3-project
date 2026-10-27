/* ============================================================
   LEARNPATH AI — 12 Expanded Topics & Initial Baseline Data
   ============================================================ */

export const INITIAL_SUBJECTS = [
  { id: 'java', name: 'Java', icon: '☕', description: 'Core object-oriented & data structures', active: true },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Scripting, algorithms, OOP & syntax mastery', active: false },
  { id: 'dsa', name: 'DSA', icon: '⚡', description: 'Data structures & algorithmic techniques', active: false },
  { id: 'dbms', name: 'DBMS', icon: '🗄️', description: 'Relational databases & SQL queries', active: false },
  { id: 'webdev', name: 'Web Dev', icon: '🌐', description: 'Frontend & backend web technologies', active: false }
];

export const PYTHON_TOPICS = [
  {
    id: 'py-basics',
    subjectId: 'python',
    name: 'Python Basics',
    description: 'Variables, data types, operators, input/output & type casting',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 12,
    solvedCount: 0
  },
  {
    id: 'py-lists-tuples',
    subjectId: 'python',
    name: 'Lists & Tuples',
    description: 'Sequences, slicing, list methods, mutability & tuple packing',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 12,
    solvedCount: 0
  },
  {
    id: 'py-strings',
    subjectId: 'python',
    name: 'Strings in Python',
    description: 'String methods, f-strings, slicing, immutability & formatting',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'py-dict-sets',
    subjectId: 'python',
    name: 'Dictionaries & Sets',
    description: 'Hash maps, key-value pairs, set operations & comprehensions',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'py-functions',
    subjectId: 'python',
    name: 'Functions & Scope',
    description: 'def, args/kwargs, lambda, closures, LEGB scope rules',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'py-oop',
    subjectId: 'python',
    name: 'OOP in Python',
    description: 'Classes, __init__, inheritance, polymorphism & dunder methods',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  },
  {
    id: 'py-exceptions',
    subjectId: 'python',
    name: 'Exceptions & File I/O',
    description: 'try/except/finally, custom exceptions, file read/write',
    mastery: 0,
    status: 'Needs Practice',
    totalQuestions: 10,
    solvedCount: 0
  }
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

import { generateSeedActivity, calculateStreakStats } from '../engine/streakEngine.js';

export const ALL_TOPICS = [...INITIAL_TOPICS, ...PYTHON_TOPICS];

const defaultSeedCalendar = generateSeedActivity();
const defaultStats = calculateStreakStats(defaultSeedCalendar);

export const FRESH_STUDENT_STATE = {
  user: {
    id: 'user_' + Math.random().toString(36).substr(2, 9), // Stable random ID
    name: 'Student',
    email: 'student@example.com',
    avatar: 'S',
    level: 'Beginner',
    rank: 'Novice Developer',
    points: 0,
    streakDays: defaultStats.currentStreak,
    createdAt: new Date().toISOString().split('T')[0]
  },
  metrics: {
    overallMastery: 0,
    lastWeekMastery: 0,
    improvementGain: 0,
    questionsSolved: 0,
    points: 0,
    conceptsMastered: 0,
    learningStreak: defaultStats.currentStreak,
    maxStreak: defaultStats.maxStreak,
    totalActiveDays: defaultStats.totalActiveDays,
    totalSubmissions: defaultStats.totalSubmissions,
    avgSolvingTimeSeconds: 0
  },
  submissionCalendar: defaultSeedCalendar,
  topics: JSON.parse(JSON.stringify([...INITIAL_TOPICS, ...PYTHON_TOPICS])),
  focusAreas: [],
  conceptInsight: null,
  recoveryPath: null,
  solvedQuestions: [],
  // Fix #6: Dynamically set today's day instead of hardcoding Sunday
  weeklyActivity: (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIdx = new Date().getDay(); // 0=Sun, 1=Mon, ... 6=Sat
    return days.map((day, idx) => ({
      day,
      count: 0,
      today: idx === todayIdx
    }));
  })(),
  recentAttempts: [],
  accuracyTrends: [
    { week: 'Week 1', accuracy: 0 }
  ],
  resolvedConcepts: [],
  mistakesReviewList: []
};
