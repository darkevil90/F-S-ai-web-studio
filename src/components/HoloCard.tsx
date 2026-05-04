import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({ children, className = '', onClick }) => {
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring configurations for smooth tilt
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  
  // Mouse position relative to card center [-1, 1]
  const xRel = useSpring(0, springConfig);
  const yRel = useSpring(0, springConfig);
  
  // Absolute mouse position for the border glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Tilt transformation
  const tX = useTransform(yRel, [-1, 1], [10, -10]);
  const tY = useTransform(xRel, [-1, 1], [-10, 10]);
  const rotateX = isMobile ? 0 : tX;
  const rotateY = isMobile ? 0 : tY;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Absolute position for glow gradient (in pixels from top-left)
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    
    // Relative position for 3D tilt (-1 to 1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    xRel.set((e.clientX - rect.left - centerX) / centerX);
    yRel.set((e.clientY - rect.top - centerY) / centerY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    xRel.set(0);
    yRel.set(0);
  };

  // Border glow effect using a radial gradient tracked to mouse position
  const borderBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 255, 255, 0.4), transparent 40%)`
  );

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer group w-full h-full perspective-[1000px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d"
      }}
    >
      <motion.div
        className="w-full h-full relative rounded-[2rem] overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Glow border layer */}
        <motion.div 
           className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[2rem]"
           style={{ background: borderBackground }}
        />

        {/* Inner Card Background (slightly overlap glow to hide sharp edges) */}
        <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl md:backdrop-blur-3xl rounded-[2rem] z-[1]" />
        
        {/* Glow highlight inside the card on hover (disabled on mobile for performance) */}
        {!isMobile && (
          <motion.div 
             className="absolute inset-0 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem] mix-blend-screen"
             style={{ background: useTransform([mouseX, mouseY], ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 123, 255, 0.08), transparent 60%)`) }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 w-full h-full" style={{ transform: "translateZ(50px)" }}>
           {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
