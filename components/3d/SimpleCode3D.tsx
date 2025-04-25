"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function SimpleCode3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50, 
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create code bracket group
    const codeGroup = new THREE.Group();
    
    // Left bracket
    const leftBracketMaterial = new THREE.MeshStandardMaterial({
      color: 0xcac5fe,
      metalness: 0.8,
      roughness: 0.2,
    });
    
    const leftVertical = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.8, 0.2),
      leftBracketMaterial
    );
    leftVertical.position.set(-0.6, 0, 0);
    codeGroup.add(leftVertical);
    
    const leftTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 0.2),
      leftBracketMaterial
    );
    leftTop.position.set(-0.3, 0.8, 0);
    codeGroup.add(leftTop);
    
    const leftBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 0.2),
      leftBracketMaterial
    );
    leftBottom.position.set(-0.3, -0.8, 0);
    codeGroup.add(leftBottom);
    
    // Right bracket
    const rightVertical = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.8, 0.2),
      leftBracketMaterial
    );
    rightVertical.position.set(0.6, 0, 0);
    codeGroup.add(rightVertical);
    
    const rightTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 0.2),
      leftBracketMaterial
    );
    rightTop.position.set(0.3, 0.8, 0);
    codeGroup.add(rightTop);
    
    const rightBottom = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 0.2),
      leftBracketMaterial
    );
    rightBottom.position.set(0.3, -0.8, 0);
    codeGroup.add(rightBottom);
    
    // Code lines
    const codeMaterial = new THREE.MeshStandardMaterial({
      color: 0x6870a6,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x6870a6,
      emissiveIntensity: 0.2,
    });
    
    const positions = [0.4, 0.1, -0.2, -0.5];
    const widths = [0.8, 0.6, 0.7, 0.5];
    
    positions.forEach((y, i) => {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(widths[i], 0.1, 0.1),
        codeMaterial
      );
      line.position.set(0, y, 0);
      codeGroup.add(line);
    });
    
    // Add code group to scene
    scene.add(codeGroup);
    
    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate the code group
      codeGroup.rotation.y += 0.01;
      codeGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      codeGroup.position.y = Math.sin(Date.now() * 0.002) * 0.1;
      
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
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-full" />;
}
