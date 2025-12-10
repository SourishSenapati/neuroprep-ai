'use client';

import { useEffect, useRef } from 'react';
import { useAura } from '../lib/auraNexus';

export default function AuraOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aura = useAura(canvasRef);

  useEffect(() => {
    // Fallback animation loop for visual effect if WebGPU is just initializing or not supported
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If WebGPU is supported, let AuraNexus handle it.
    if (typeof navigator !== 'undefined' && (navigator as any).gpu) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // WebGPU might have taken context, which is fine

    let animationFrame: number;
    let t = 0;

    const render = () => {
      t += 0.01;
      // Clear with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw "Gaussian Splats" (Mocked with 2D gradients for fallback)
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(t) * 100, 
        canvas.height / 2 + Math.cos(t * 1.5) * 100, 
        0,
        canvas.width / 2 + Math.sin(t) * 100, 
        canvas.height / 2 + Math.cos(t * 1.5) * 100, 
        300
      );
      
      // Purple/Pink Neural Gradient
      gradient.addColorStop(0, 'rgba(236, 72, 153, 0.2)'); // Pink-500
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.1)'); // Purple-500
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationFrame = requestAnimationFrame(render);
    };

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{ filter: 'blur(40px)' }} // CSS Gaussian Blur Shader equivalent
    />
  );
}
