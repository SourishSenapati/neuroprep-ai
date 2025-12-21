'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Reactive 3D Background
 * Morphing mesh that responds to user's emotional state
 * Uses Three.js with react-three-fiber
 * 
 * Emotion Mapping:
 * - Neutral/Default: Soft blue, slow movement
 * - Fear/Stress: Deep red, spiky geometry, fast rotation
 * - Happy/Success: Gold, expanded, particle emission
 */

interface ReactiveBackgroundProps {
  emotion?: string;
  intensity?: number; // 0-1
  className?: string;
}

interface MorphingSphereProps {
  emotion: string;
  intensity: number;
}

function MorphingSphere({ emotion, intensity }: MorphingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null);

  // Emotion-based configuration
  const config = useMemo(() => {
    const configs: Record<string, { color: string; speed: number; spikiness: number; scale: number }> = {
      neutral: { color: '#4a90e2', speed: 0.3, spikiness: 0, scale: 1 },
      happy: { color: '#ffd700', speed: 0.5, spikiness: 0.2, scale: 1.3 },
      sad: { color: '#4444ff', speed: 0.2, spikiness: -0.1, scale: 0.9 },
      angry: { color: '#ff4444', speed: 1.0, spikiness: 0.5, scale: 1.1 },
      fearful: { color: '#ff0000', speed: 1.5, spikiness: 0.8, scale: 1.2 },
      surprised: { color: '#ffff00', speed: 0.8, spikiness: 0.3, scale: 1.15 },
      disgusted: { color: '#ff8800', speed: 0.4, spikiness: 0.1, scale: 0.95 }
    };

    return configs[emotion.toLowerCase()] || configs.neutral;
  }, [emotion]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current) return;

    const time = state.clock.getElapsedTime();

    // Rotate mesh
    meshRef.current.rotation.x = time * config.speed * 0.2;
    meshRef.current.rotation.y = time * config.speed * 0.3;

    // Morph geometry (Perlin-like noise)
    const positions = geometryRef.current.attributes.position;
    const count = positions.count;

    for (let i = 0; i < count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Create wave effect
      const wave = Math.sin(x * 2 + time * config.speed) * 
                   Math.cos(y * 2 + time * config.speed * 0.5) * 
                   Math.sin(z * 2 + time * config.speed * 0.3);

      // Apply spikiness based on emotion
      const spikeFactor = 1 + wave * config.spikiness * intensity;

      // Normalize and apply
      const length = Math.sqrt(x * x + y * y + z * z);
      positions.setXYZ(
        i,
        (x / length) * spikeFactor,
        (y / length) * spikeFactor,
        (z / length) * spikeFactor
      );
    }

    positions.needsUpdate = true;
    geometryRef.current.computeVertexNormals();

    // Scale based on emotion
    const targetScale = config.scale * (1 + intensity * 0.2);
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry ref={geometryRef} args={[1, 64, 64]} />
      <meshStandardMaterial
        color={config.color}
        wireframe={false}
        metalness={0.5}
        roughness={0.3}
        emissive={config.color}
        emissiveIntensity={intensity * 0.3}
      />
    </mesh>
  );
}

function ParticleField({ emotion, intensity }: { emotion: string; intensity: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = emotion === 'happy' ? 1000 : 300;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    return positions;
  }, [emotion]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    particlesRef.current.rotation.y = time * 0.1;

    // Pulse particles on happy emotion
    if (emotion === 'happy') {
      const scale = 1 + Math.sin(time * 2) * 0.1 * intensity;
      particlesRef.current.scale.set(scale, scale, scale);
    }
  });

  if (emotion !== 'happy' && emotion !== 'surprised') {
    return null; // Only show particles for positive emotions
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={emotion === 'happy' ? '#ffd700' : '#ffff00'}
        transparent
        opacity={intensity * 0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function ReactiveBackground({ 
  emotion = 'neutral', 
  intensity = 0.5,
  className = '' 
}: ReactiveBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4a90e2" />

        {/* Main morphing sphere */}
        <MorphingSphere emotion={emotion} intensity={intensity} />

        {/* Particle field for positive emotions */}
        <ParticleField emotion={emotion} intensity={intensity} />

        {/* Optional orbit controls for testing */}
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>

      {/* Overlay gradient to blend with page */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.7) 70%, rgba(10, 10, 10, 0.95) 100%)`
        }}
      />
    </div>
  );
}

/**
 * Lightweight version without Three.js (CSS fallback)
 * Use this if Three.js causes performance issues
 */
export function ReactiveBackgroundSimple({ emotion = 'neutral', intensity = 0.5 }: ReactiveBackgroundProps) {
  const colors: Record<string, string> = {
    neutral: 'from-blue-900/20 to-blue-950/40',
    happy: 'from-yellow-600/30 to-amber-900/50',
    sad: 'from-blue-800/20 to-indigo-950/40',
    angry: 'from-red-800/30 to-red-950/50',
    fearful: 'from-red-900/40 to-black',
    surprised: 'from-yellow-700/25 to-orange-900/45',
    disgusted: 'from-orange-800/25 to-brown-950/45'
  };

  const gradient = colors[emotion.toLowerCase()] || colors.neutral;

  return (
    <div 
      className={`fixed inset-0 -z-10 bg-gradient-to-br ${gradient} transition-all duration-1000`}
      style={{
        opacity: 0.3 + intensity * 0.4
      }}
    />
  );
}
