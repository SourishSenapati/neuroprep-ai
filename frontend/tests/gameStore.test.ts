import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../lib/store/gameStore';

describe('GameStore', () => {
  beforeEach(() => {
    // Reset store before each test - using setState to ensure clean state
    const store = useGameStore.getState();
    useGameStore.setState({
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      sessionsCompleted: 0,
      questionsAnswered: 0,
      codeExecutions: 0,
      achievements: [],
      isPremium: false,
      nemesisModeUses: 0,
      resumeRoastUses: 0,
      focusSessionsToday: 0,
    });
  });

  it('should initialize with default values', () => {
    const store = useGameStore.getState();
    expect(store.xp).toBe(0);
    expect(store.level).toBe(1);
  });

  it('should complete task and add XP', () => {
    useGameStore.getState().completeTask(100);
    const store = useGameStore.getState();
    // With multipliers, expect >= 100
    expect(store.xp).toBeGreaterThanOrEqual(100);
  });

  it('should calculate level from XP correctly', () => {
    useGameStore.getState().completeTask(1000);
    const store = useGameStore.getState();
    expect(store.level).toBeGreaterThanOrEqual(4);
  });

  it('should handle streak initialization', () => {
    useGameStore.getState().initializeStreak();
    const store = useGameStore.getState();
    expect(store.lastActiveDate).not.toBeNull();
  });

  it('should grade answers and add XP with accuracy', () => {
    // 100% accuracy = 75 bonus + 10 base = 85 * 1.1 (lvl 1) = ~94 XP
    useGameStore.getState().gradeAnswer(100);
    const store = useGameStore.getState();
    expect(store.xp).toBeGreaterThan(80); 
    expect(store.questionsAnswered).toBe(1);
  });

  it('should track code executions', () => {
    useGameStore.getState().executeCode();
    const store = useGameStore.getState();
    expect(store.codeExecutions).toBe(1);
    expect(store.xp).toBe(3); // Code execution gives 3 XP
  });

  it('should reset streak', () => {
    useGameStore.getState().completeTask(50);
    useGameStore.getState().resetStreak();
    const store = useGameStore.getState();
    expect(store.streak).toBe(0);
  });

  it('should calculate XP to next level', () => {
    const xpToNext = useGameStore.getState().getXpToNextLevel();
    expect(xpToNext).toBeGreaterThan(0);
  });

  it('should get current level', () => {
    const level = useGameStore.getState().getCurrentLevel();
    expect(level).toBeGreaterThanOrEqual(1);
  });

  it('should track sessions completed', () => {
    useGameStore.getState().completeTask(10);
    const store = useGameStore.getState();
    expect(store.sessionsCompleted).toBe(1);
  });
});
