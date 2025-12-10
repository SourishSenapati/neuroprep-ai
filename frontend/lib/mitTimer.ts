'use client';

// MIT High-Pressure Timer with Pyodide code validation

export class MITTimer {
  private startTime: number = 0;
  private duration: number = 0; // seconds
  private onTick?: (remaining: number) => void;
  private onComplete?: () => void;
  private interval?: NodeJS.Timeout;

  start(durationSeconds: number, onTick?: (remaining: number) => void, onComplete?: () => void) {
    this.startTime = Date.now();
    this.duration = durationSeconds;
    this.onTick = onTick;
    this.onComplete = onComplete;

    this.interval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      const remaining = Math.max(0, this.duration - elapsed);

      if (this.onTick) {
        this.onTick(remaining);
      }

      if (remaining <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 100);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getElapsed(): number {
    return (Date.now() - this.startTime) / 1000;
  }
}

export async function validatePythonCode(code: string, pyodide: any): Promise<{
  valid: boolean;
  output: string;
  error?: string;
  executionTime: number;
}> {
  const startTime = performance.now();

  try {
    // Sandbox: Redirect stdout
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
    `);

    // Execute code with timeout simulation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000);
    });

    const execPromise = Promise.resolve(pyodide.runPython(code));

    await Promise.race([execPromise, timeoutPromise]);

    const output = pyodide.runPython('sys.stdout.getvalue()');
    const executionTime = performance.now() - startTime;

    return {
      valid: true,
      output: output || '(No output)',
      executionTime
    };
  } catch (error: any) {
    const executionTime = performance.now() - startTime;
    return {
      valid: false,
      output: '',
      error: error.message,
      executionTime
    };
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
