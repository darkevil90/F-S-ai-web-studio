import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NeuralTextProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const NeuralText: React.FC<NeuralTextProps> = ({ children, className = "", active = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<{ id: number; x1: number; y1: number; x2: number; y2: number }[]>([]);

  useEffect(() => {
    if (!isHovered || !active) {
      setLines([]);
      return;
    }

    const generateLines = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newLines = Array.from({ length: 6 }).map((_, i) => {
        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;
        
        // Lines stretch outwards
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;

        return {
          id: i,
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY
        };
      });
      setLines(newLines);
    };

    generateLines();
    const interval = setInterval(generateLines, 800);
    return () => clearInterval(interval);
  }, [isHovered, active]);

  return (
    <span 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-cyan-400">
        {children}
      </span>
      
      <AnimatePresence>
        {isHovered && active && (
          <svg className="absolute inset-[-200px] w-[calc(100%+400px)] h-[calc(100%+400px)] pointer-events-none overflow-visible z-0">
            {lines.map((line) => (
              <motion.line
                key={line.id}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                x1={line.x1 + 200}
                y1={line.y1 + 200}
                x2={line.x2 + 200}
                y2={line.y2 + 200}
                stroke="rgba(0, 255, 255, 0.6)"
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.8))' }}
              />
            ))}
            {lines.map((line) => (
              <motion.circle
                key={`p-${line.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                cx={line.x2 + 200}
                cy={line.y2 + 200}
                r="2"
                fill="cyan"
                style={{ filter: 'drop-shadow(0 0 8px cyan)' }}
              />
            ))}
          </svg>
        )}
      </AnimatePresence>
    </span>
  );
};
