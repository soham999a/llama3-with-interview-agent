"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function FloatingParticles3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create particles
    const particlesCount = 100;
    const particles = new THREE.Group();
    
    // Create different particle materials
    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0xcac5fe,
        emissive: 0xcac5fe,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x6870a6,
        emissive: 0x6870a6,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x8a94ff,
        emissive: 0x8a94ff,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      })
    ];
    
    // Create different geometries
    const geometries = [
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.BoxGeometry(0.08, 0.08, 0.08),
      new THREE.TetrahedronGeometry(0.08),
      new THREE.OctahedronGeometry(0.08)
    ];
    
    // Create particles with random positions, sizes, and rotations
    for (let i = 0; i < particlesCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      
      const particle = new THREE.Mesh(geometry, material);
      
      // Random position within a sphere
      const radius = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);
      
      // Random rotation
      particle.rotation.x = Math.random() * Math.PI;
      particle.rotation.y = Math.random() * Math.PI;
      particle.rotation.z = Math.random() * Math.PI;
      
      // Store original position for animation
      (particle as any).originalPosition = {
        x: particle.position.x,
        y: particle.position.y,
        z: particle.position.z
      };
      
      // Random speed for animation
      (particle as any).speed = 0.001 + Math.random() * 0.003;
      (particle as any).rotationSpeed = 0.01 + Math.random() * 0.02;
      
      particles.add(particle);
    }
    
    scene.add(particles);
    
    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate camera slowly around the scene
      camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
      camera.position.z = Math.cos(Date.now() * 0.0001) * 5;
      camera.lookAt(0, 0, 0);
      
      // Animate each particle
      particles.children.forEach((particle) => {
        // Oscillate particles around their original positions
        const time = Date.now() * (particle as any).speed;
        
        particle.position.x = (particle as any).originalPosition.x + Math.sin(time) * 0.2;
        particle.position.y = (particle as any).originalPosition.y + Math.cos(time * 0.7) * 0.2;
        particle.position.z = (particle as any).originalPosition.z + Math.sin(time * 0.5) * 0.2;
        
        // Rotate particles
        particle.rotation.x += (particle as any).rotationSpeed * 0.1;
        particle.rotation.y += (particle as any).rotationSpeed * 0.15;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-full" />;
}
