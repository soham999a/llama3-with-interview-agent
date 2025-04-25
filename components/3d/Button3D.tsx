"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Button3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button3D({ 
  children, 
  onClick, 
  className = "", 
  disabled = false 
}: Button3DProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <motion.button
      className={`relative ${className}`}
      onClick={onClick}
      disabled={disabled}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Button shadow (3D effect) */}
      <motion.div
        className="absolute inset-0 bg-black/20 rounded-full"
        initial={{ y: 4, x: 0, z: -1 }}
        animate={{ y: isPressed ? 2 : 4, x: isPressed ? 0 : 0 }}
        style={{ transformStyle: "preserve-3d", zIndex: -1 }}
      />
      
      {/* Button content */}
      <motion.div
        className="relative z-10"
        animate={{ y: isPressed ? 2 : 0 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
}
