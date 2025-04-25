"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 1000, color = "#cac5fe" }) {
  const points = useRef<THREE.Points>(null);

  // Generate random positions for particles
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    return positions;
  }, [count]);

  // Animate particles
  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime() * 0.1;
    points.current.rotation.x = Math.sin(t / 4);
    points.current.rotation.y = Math.sin(t / 2);
  });

  return (
    <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default function Background3D() {
  try {
    return (
      <div className="fixed inset-0 -z-10 opacity-40">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleField />
        </Canvas>
      </div>
    );
  } catch (error) {
    console.error("Error rendering 3D background:", error);
    return null; // Return null if there's an error
  }
}
