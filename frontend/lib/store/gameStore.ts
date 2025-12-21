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
  completeTask: (xp: number) => void;
  answerQuestion: (correct: boolean) => void;
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
 * Level 1: 0-100 XP
 * Level 2: 100-300 XP (+200)
 * Level 3: 300-600 XP (+300)
 * Formula: Level N requires N*100 XP from previous level
 */
function calculateLevel(xp: number): number {
  let level = 1;
  let xpRequired = 0;
  
  while (xpRequired <= xp) {
    level++;
    xpRequired += level * 100;
  }
  
  return level - 1;
}

/**
 * Calculate XP required for next level
 */
function calculateXpToNextLevel(xp: number, currentLevel: number): number {
  const nextLevelXp = Array.from({ length: currentLevel + 1 }, (_, i) => (i + 1) * 100).reduce((a, b) => a + b, 0);
  return nextLevelXp - xp;
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

      // Complete a task (interview session, question, etc.)
      completeTask: (xpReward = 10) => {
        const { xp, streak, lastActiveDate } = get();
        const today = getTodayISO();
        
        let newStreak = streak;
        
        // If not active today yet, increment streak
        if (lastActiveDate && !isToday(lastActiveDate)) {
          if (isYesterday(lastActiveDate)) {
            newStreak = streak + 1;
          } else {
            // Streak broken, start fresh
            newStreak = 1;
          }
        }
        
        const newXp = xp + xpReward;
        const newLevel = calculateLevel(newXp);
        
        set({
          xp: newXp,
          streak: newStreak,
          lastActiveDate: today,
          level: newLevel,
          sessionsCompleted: get().sessionsCompleted + 1
        });
        
        // Check for level up
        if (newLevel > get().level) {
          console.log(`Level Up! You are now level ${newLevel}`);
        }
      },

      // Answer a question
      answerQuestion: (correct: boolean) => {
        const xpReward = correct ? 5 : 2; // More XP for correct answers
        
        set({
          questionsAnswered: get().questionsAnswered + 1,
          xp: get().xp + xpReward
        });
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
