declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    spread?: number;stringorigin?: { x: number; y: number };
    colors?: string[];
    disableForReducedMotion?: boolean;
  }
  
  function confetti(options?: Options): Promise<null>;
  
  export = confetti;
}
