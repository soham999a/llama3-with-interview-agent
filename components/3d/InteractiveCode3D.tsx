"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function InteractiveCode3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60, 
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
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a point light that follows the mouse
    const pointLight = new THREE.PointLight(0xcac5fe, 2, 6);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);
    
    // Create a group for all objects
    const codeGroup = new THREE.Group();
    scene.add(codeGroup);
    
    // Create code elements
    const createCodeElement = () => {
      const group = new THREE.Group();
      
      // Materials
      const bracketMaterial = new THREE.MeshStandardMaterial({
        color: 0xcac5fe,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xcac5fe,
        emissiveIntensity: 0.2
      });
      
      const codeMaterial = new THREE.MeshStandardMaterial({
        color: 0x6870a6,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x6870a6,
        emissiveIntensity: 0.1
      });
      
      // Create brackets
      const leftBracket = new THREE.Group();
      
      const leftVertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 0.1),
        bracketMaterial
      );
      leftVertical.position.set(-0.3, 0, 0);
      leftBracket.add(leftVertical);
      
      const leftTop = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.1),
        bracketMaterial
      );
      leftTop.position.set(-0.15, 0.45, 0);
      leftBracket.add(leftTop);
      
      const leftBottom = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.1),
        bracketMaterial
      );
      leftBottom.position.set(-0.15, -0.45, 0);
      leftBracket.add(leftBottom);
      
      // Right bracket
      const rightBracket = new THREE.Group();
      
      const rightVertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1, 0.1),
        bracketMaterial
      );
      rightVertical.position.set(0.3, 0, 0);
      rightBracket.add(rightVertical);
      
      const rightTop = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.1),
        bracketMaterial
      );
      rightTop.position.set(0.15, 0.45, 0);
      rightBracket.add(rightTop);
      
      const rightBottom = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.1),
        bracketMaterial
      );
      rightBottom.position.set(0.15, -0.45, 0);
      rightBracket.add(rightBottom);
      
      // Code lines
      const codeLines = new THREE.Group();
      
      const positions = [0.25, 0.1, -0.05, -0.2, -0.35];
      const widths = [0.4, 0.3, 0.5, 0.35, 0.25];
      
      positions.forEach((y, i) => {
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(widths[i], 0.05, 0.05),
          codeMaterial
        );
        line.position.set(0, y, 0);
        codeLines.add(line);
      });
      
      group.add(leftBracket);
      group.add(rightBracket);
      group.add(codeLines);
      
      return group;
    };
    
    // Create multiple code elements
    const codeElements = [];
    const numElements = 5;
    
    for (let i = 0; i < numElements; i++) {
      const element = createCodeElement();
      
      // Position in a circular pattern
      const angle = (i / numElements) * Math.PI * 2;
      const radius = 2;
      
      element.position.x = Math.cos(angle) * radius;
      element.position.y = Math.sin(angle) * radius;
      element.position.z = Math.random() * 0.5;
      
      // Random rotation
      element.rotation.x = Math.random() * 0.3;
      element.rotation.y = Math.random() * 0.3;
      
      // Store original position and rotation for animation
      (element as any).originalPosition = {
        x: element.position.x,
        y: element.position.y,
        z: element.position.z
      };
      
      (element as any).originalRotation = {
        x: element.rotation.x,
        y: element.rotation.y,
        z: element.rotation.z
      };
      
      // Random animation speed
      (element as any).speed = 0.0005 + Math.random() * 0.001;
      
      codeElements.push(element);
      codeGroup.add(element);
    }
    
    // Mouse interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let intersectedObject: THREE.Object3D | null = null;
    
    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update point light position
      pointLight.position.set(mouse.x * 3, mouse.y * 3, 3);
    };
    
    containerRef.current.addEventListener('mousemove', onMouseMove);
    
    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate the entire code group slowly
      codeGroup.rotation.y += 0.002;
      
      // Animate each code element
      codeElements.forEach((element) => {
        const time = Date.now() * (element as any).speed;
        
        // Oscillate position
        element.position.x = (element as any).originalPosition.x + Math.sin(time) * 0.1;
        element.position.y = (element as any).originalPosition.y + Math.cos(time) * 0.1;
        
        // Oscillate rotation
        element.rotation.x = (element as any).originalRotation.x + Math.sin(time * 0.7) * 0.05;
        element.rotation.y = (element as any).originalRotation.y + Math.cos(time * 0.5) * 0.05;
      });
      
      // Check for intersections
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(codeGroup.children, true);
      
      if (intersects.length > 0) {
        // Find the parent code element
        let parent = intersects[0].object;
        while (parent.parent !== codeGroup && parent.parent !== null) {
          parent = parent.parent;
        }
        
        if (intersectedObject !== parent) {
          // Reset previous intersected object
          if (intersectedObject) {
            intersectedObject.scale.set(1, 1, 1);
          }
          
          // Set new intersected object
          intersectedObject = parent;
          intersectedObject.scale.set(1.1, 1.1, 1.1);
        }
      } else if (intersectedObject) {
        // Reset when not intersecting anything
        intersectedObject.scale.set(1, 1, 1);
        intersectedObject = null;
      }
      
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
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-full" />;
}
