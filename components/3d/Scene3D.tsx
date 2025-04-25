"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

// Advanced Code model - representing programming/coding with more detail
function Code(props: any) {
  const group = useRef<THREE.Group>(null);
  const innerGroup = useRef<THREE.Group>(null);
  const particlesGroup = useRef<THREE.Group>(null);

  // Animation
  useFrame((state) => {
    if (!group.current || !innerGroup.current || !particlesGroup.current) return;
    const t = state.clock.getElapsedTime();

    // Main group rotation
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 3) * 0.2, 0.1);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(t) * 0.05, 0.1);

    // Inner group rotation - creates a more dynamic effect
    innerGroup.current.rotation.z = Math.sin(t / 2) * 0.05;
    innerGroup.current.rotation.x = Math.sin(t / 4) * 0.05;

    // Particles rotation
    particlesGroup.current.rotation.y += 0.003;
    particlesGroup.current.rotation.z = Math.sin(t / 5) * 0.1;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={innerGroup}>
        {/* Left Bracket */}
        <mesh castShadow receiveShadow position={[-0.6, 0, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.2, 1.8, 0.2]} />
          <meshStandardMaterial color="#cac5fe" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.3, 0.8, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.2]} />
          <meshStandardMaterial color="#cac5fe" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.3, -0.8, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.2]} />
          <meshStandardMaterial color="#cac5fe" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Right Bracket */}
        <mesh castShadow receiveShadow position={[0.6, 0, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.2, 1.8, 0.2]} />
          <meshStandardMaterial color="#cac5fe" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.3, 0.8, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.2]} />
          <meshStandardMaterial color="#cac5fe" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.3, -0.8, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.2]} />
          <meshStandardMaterial color="#cac5fe" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Code Lines (representing code inside brackets) */}
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.7} emissive="#6870a6" emissiveIntensity={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.08]} />
          <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.7} emissive="#6870a6" emissiveIntensity={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.08]} />
          <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.7} emissive="#6870a6" emissiveIntensity={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.7} emissive="#6870a6" emissiveIntensity={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
          <boxGeometry args={[0.65, 0.08, 0.08]} />
          <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.7} emissive="#6870a6" emissiveIntensity={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[0.55, 0.08, 0.08]} />
          <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.7} emissive="#6870a6" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Glowing particles around the code */}
      <group ref={particlesGroup}>
        {/* Create multiple particles in a circular pattern */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 1.2;
          const x = Math.cos(angle) * radius * (0.8 + Math.random() * 0.4);
          const y = Math.sin(angle) * radius * (0.8 + Math.random() * 0.4);
          const z = (Math.random() - 0.5) * 0.5;
          const size = 0.03 + Math.random() * 0.04;

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial
                color="#cac5fe"
                emissive="#cac5fe"
                emissiveIntensity={2 + Math.random() * 2}
              />
            </mesh>
          );
        })}
      </group>

      {/* Central glow */}
      <mesh position={[0, 0, 0]} scale={1.1}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#cac5fe"
          emissive="#cac5fe"
          emissiveIntensity={0.4}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

function Brain(props: any) {
  const group = useRef<THREE.Group>(null);

  // Animation
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 3) * 0.15, 0.1);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(t / 4) * 0.05, 0.1);
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#6870a6" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0]} scale={1.2}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#6870a6" wireframe opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

// Fallback component if 3D models aren't available
function FallbackModel({ color = "#cac5fe" }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.sin(t / 1.5) / 10;
    mesh.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  );
}

export default function Scene3D({ modelType = "code" }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);

  // Handle model loading errors
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!modelLoaded) {
        console.warn("3D model loading timeout - using fallback");
        setFallbackActive(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [modelLoaded]);

  return (
    <div className="w-full h-[300px]">
      <ErrorBoundary fallback={<div className="w-full h-full flex items-center justify-center bg-dark-200 rounded-lg"><p className="text-primary-200">3D Visualization</p></div>}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Float rotationIntensity={0.4}>
              {fallbackActive ? (
                <FallbackModel color="#cac5fe" />
              ) : modelType === "code" ? (
                <Suspense fallback={<FallbackModel color="#cac5fe" />}>
                  <Code position={[0, -0.5, 0]} scale={1.2} onLoad={() => setModelLoaded(true)} />
                </Suspense>
              ) : modelType === "brain" ? (
                <Suspense fallback={<FallbackModel color="#6870a6" />}>
                  <Brain position={[0, -1, 0]} scale={1.5} onLoad={() => setModelLoaded(true)} />
                </Suspense>
              ) : (
                <Suspense fallback={<FallbackModel color="#cac5fe" />}>
                  <Code position={[0, -0.5, 0]} scale={1.2} onLoad={() => setModelLoaded(true)} />
                </Suspense>
              )}
            </Float>
          </PresentationControls>
          <Environment preset="city" />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// Add Suspense import
import { Suspense } from "react";
