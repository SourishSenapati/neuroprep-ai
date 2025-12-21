import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Gamification Store using Zustand
 * Isolated state management for XP, streaks, and achievements
 * Persists to localStorage for cross-session tracking
 */

export interface GameState {
  // Core stats
  xp: number;
  streak: number;
  lastActiveDate: string | null; // ISO date string (YYYY-MM-DD)
  level: number;
  
  // Session tracking
  sessionsCompleted: number;
  questionsAnswered: number;
  codeExecutions: number;
  
  // Premium & Usage Tracking
  isPremium: boolean;
  nemesisModeUses: number;
  resumeRoastUses: number;
  focusSessionsToday: number;
  
  // Achievements (optional - for future expansion)
  achievements: string[];
  
  // Actions
  completeTask: (baseXp?: number) => void;
  gradeAnswer: (accuracy: number) => { xpGained: number; newLevel: number };
  executeCode: () => void;
  resetStreak: () => void;
  initializeStreak: () => void;
  
  // Premium actions
  useNemesisMode: () => boolean; // Returns true if allowed
  useResumeRoast: () => boolean;
  useFocusSession: () => boolean;
  upgradeToPremium: () => void;
  
  // Computed getters
  getXpToNextLevel: () => number;
  getCurrentLevel: () => number;
}

/**
 * Calculate level from total XP
 * Formula: XP = 100 * (Level-1)^1.5
 * Inverse: Level = (XP/100)^(1/1.5) + 1
 */
function calculateLevel(xp: number): number {
  let level = 1;
  while (xp >= 100 * Math.pow(level, 1.5)) {
    level++;
  }
  return level;
}

/**
 * Calculate XP required for next level
 */
function calculateXpToNextLevel(xp: number, currentLevel: number): number {
  const nextLevelThreshold = Math.ceil(100 * Math.pow(currentLevel, 1.5));
  return Math.max(0, nextLevelThreshold - xp);
}

/**
 * Check if date is yesterday
 */
function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(dateString);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate.getTime() === yesterday.getTime();
}

/**
 * Check if date is today
 */
function isToday(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(dateString);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate.getTime() === today.getTime();
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
function getTodayISO(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Zustand store with localStorage persistence
 */
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      level: 1,
      sessionsCompleted: 0,
      questionsAnswered: 0,
      codeExecutions: 0,
      achievements: [],
      isPremium: false,
      nemesisModeUses: 0,
      resumeRoastUses: 0,
      focusSessionsToday: 0,

      // Premium actions
      useNemesisMode: () => {
        const { isPremium, nemesisModeUses } = get();
        if (isPremium) {
          set({ nemesisModeUses: nemesisModeUses + 1 });
          return true;
        }
        if (nemesisModeUses < 3) {
          set({ nemesisModeUses: nemesisModeUses + 1 });
          return true;
        }
        return false;
      },

      useResumeRoast: () => {
        const { isPremium, resumeRoastUses } = get();
        if (isPremium) {
          set({ resumeRoastUses: resumeRoastUses + 1 });
          return true;
        }
        if (resumeRoastUses < 2) {
          set({ resumeRoastUses: resumeRoastUses + 1 });
          return true;
        }
        return false;
      },

      useFocusSession: () => {
        const { isPremium, focusSessionsToday } = get();
        if (isPremium) {
          set({ focusSessionsToday: focusSessionsToday + 1 });
          return true;
        }
        if (focusSessionsToday < 5) {
          set({ focusSessionsToday: focusSessionsToday + 1 });
          return true;
        }
        return false;
      },

      upgradeToPremium: () => {
        set({ isPremium: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('isPremium', 'true');
        }
      },

      // Initialize streak on app load
      initializeStreak: () => {
        const { lastActiveDate, streak } = get();
        
        // If no last active date, it's first time user
        if (!lastActiveDate) {
          set({ 
            lastActiveDate: getTodayISO(),
            streak: 0
          });
          return;
        }
        
        // If last active was yesterday, keep streak
        if (isYesterday(lastActiveDate)) {
          // Streak is already set, just update date
          set({ lastActiveDate: getTodayISO() });
          return;
        }
        
        // If last active was today, do nothing
        if (isToday(lastActiveDate)) {
          return;
        }
        
        // If last active was older than yesterday, reset streak
        set({ 
          streak: 0,
          lastActiveDate: getTodayISO()
        });
      },

      // Complete a task with exponential level scaling
      completeTask: (baseXp = 50) => {
        const { xp, streak, lastActiveDate, level } = get();
        const today = getTodayISO();
        
        // Streak Logic
        let newStreak = streak;
        if (lastActiveDate && !isToday(lastActiveDate)) {
          if (isYesterday(lastActiveDate)) {
            newStreak = streak + 1;
          } else {
            newStreak = 1; // Reset if broken
          }
        } else if (!lastActiveDate) {
           newStreak = 1;
        }

        // Exponential XP Scaling: Higher level = More XP per task
        // Multiplier: 1.0 + (Level * 0.15) -> Level 10 gets 2.5x XP
        const levelMultiplier = 1 + (level * 0.15);
        const streakBonus = Math.min(newStreak * 0.05, 0.5); // Up to 50% bonus for streaks
        
        const finalXpReward = Math.round(baseXp * (levelMultiplier + streakBonus));
        const newXp = xp + finalXpReward;
        
        // Recalculate Level: EXPONENTIAL CURVE
        // Level N requires ~ 100 * N^1.5 XP
        let newLevel = 1;
        while (newXp >= 100 * Math.pow(newLevel, 1.5)) {
            newLevel++;
        }
        
        set({
          xp: newXp,
          streak: newStreak,
          lastActiveDate: today,
          level: newLevel,
          sessionsCompleted: get().sessionsCompleted + 1
        });
        
        console.log(`🏅 XP Gained: ${finalXpReward} (Base: ${baseXp} x Lvl: ${levelMultiplier.toFixed(2)} x Strk: ${streakBonus.toFixed(2)})`);
      },

      // Grade an answer with precision accuracy (0-100)
      gradeAnswer: (accuracy: number) => {
        const { level, xp } = get();
        
        // 1. Level Scaling (10% bonus per level)
        const levelMultiplier = 1 + (level * 0.1);
        
        // 2. Accuracy Bonus (Non-linear reward for high accuracy)
        // 100% -> 1.0
        // 80% -> 0.8
        // But we want to reward 90+ significantly more
        let accuracyBonus = accuracy * 0.5; // Base: 0-50 XP
        if (accuracy > 90) accuracyBonus += 25; // Perfect score bonus
        else if (accuracy > 75) accuracyBonus += 10; // Good score bonus
        
        // 3. Base Participation XP
        const participationBase = 10;
        
        // Final Formula
        const rawXp = (participationBase + accuracyBonus) * levelMultiplier;
        const xpReward = Math.round(rawXp);
        
        const newXp = xp + xpReward;
        
        // Recalculate Level
        let newLevel = 1;
        while (newXp >= 100 * Math.pow(newLevel, 1.5)) {
            newLevel++;
        }
        
        set({
          questionsAnswered: get().questionsAnswered + 1,
          xp: newXp,
          level: newLevel
        });
        
        return { xpGained: xpReward, newLevel };
      },

      // Execute code
      executeCode: () => {
        set({
          codeExecutions: get().codeExecutions + 1,
          xp: get().xp + 3 // Small XP for code execution
        });
      },

      // Reset streak (for testing or user request)
      resetStreak: () => {
        set({ 
          streak: 0,
          lastActiveDate: getTodayISO()
        });
      },

      // Computed getters
      getXpToNextLevel: () => {
        const { xp, level } = get();
        return calculateXpToNextLevel(xp, level);
      },

      getCurrentLevel: () => {
        const { xp } = get();
        return calculateLevel(xp);
      }
    }),
    {
      name: 'neuroprep-game-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist specific fields
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        level: state.level,
        sessionsCompleted: state.sessionsCompleted,
        questionsAnswered: state.questionsAnswered,
        codeExecutions: state.codeExecutions,
        achievements: state.achievements
      })
    }
  )
);

/**
 * Initialize streak on app mount
 * Call this in your root layout or app component
 */
export function initializeGameStore() {
  if (typeof window !== 'undefined') {
    useGameStore.getState().initializeStreak();
  }
}

export default useGameStore;
