/**
 * Confetti Celebration Utility
 * Luxurious confetti animations for achievement moments
 */

import confetti from 'canvas-confetti';

const COLORS = {
  primary: ['#667eea', '#764ba2'],
  accent: ['#f093fb', '#f5576c'],
  success: ['#10b981', '#34d399'],
  celebration: ['#fbbf24', '#f59e0b']
};

export const celebrationConfetti = {
  /**
   * Victory Blast - For major wins (defeating nemesis, leveling up)
   */
  victory: () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: [...COLORS.primary, ...COLORS.accent]
      } as any);
      confetti({
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: [...COLORS.primary, ...COLORS.accent]
      } as any);
    }, 250);
  },

  /**
   * Achievement Pop - For milestones (streak, XP threshold)
   */
  achievement: () => {
    confetti({
      particleCount: 100,
      spread: 70,
      startVelocity: 45,
      colors: [...COLORS.success, ...COLORS.celebration],
      origin: { y: 0.6 },
      gravity: 0.8,
      zIndex: 9999
    } as any);
  },

  /**
   * Streak Fire - For maintaining streaks
   */
  streak: () => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff6b6b', '#ffa500', '#ffd700'],
      zIndex: 9999
    } as any);
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff6b6b', '#ffa500', '#ffd700'],
      zIndex: 9999
    } as any);
  },

  /**
   * Premium Upgrade - For subscribing/upgrading
   */
  premium: () => {
    const end = Date.now() + 2000;
    const colors = ['#ffd700', '#ffed4e', '#fff8dc'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 9999
      } as any);
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 9999
      } as any);

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  },

  /**
   * Quick Burst - For small wins (completing task, answering correctly)
   */
  quickBurst: () => {
    confetti({
      particleCount: 30,
      spread: 40,
      startVelocity: 25,
      colors: COLORS.primary,
      origin: { y: 0.7 },
      zIndex: 9999
    } as any);
  },

  /**
   * Emoji Rain - For sharing/social actions
   */
  share: () => {
    const scalar = 2;
    // shapeFromText might not be in the types definition
    const shape = (confetti as any).shapeFromText ? (confetti as any).shapeFromText({ text: '🎯', scalar }) : undefined;

    if (shape) {
        confetti({
        shapes: [shape],
        particleCount: 20,
        spread: 100,
        startVelocity: 30,
        scalar,
        zIndex: 9999
        } as any);
    }
  },

  /**
   * School Pride - Confetti with colors
   */
  customColors: (colors: string[]) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      zIndex: 9999
    } as any);
  }
};

/**
 * Trigger confetti based on event type
 */
export function triggerConfetti(event: 'victory' | 'achievement' | 'streak' | 'premium' | 'quick' | 'share') {
  switch (event) {
    case 'victory':
      celebrationConfetti.victory();
      break;
    case 'achievement':
      celebrationConfetti.achievement();
      break;
    case 'streak':
      celebrationConfetti.streak();
      break;
    case 'premium':
      celebrationConfetti.premium();
      break;
    case 'quick':
      celebrationConfetti.quickBurst();
      break;
    case 'share':
      celebrationConfetti.share();
      break;
  }
}
