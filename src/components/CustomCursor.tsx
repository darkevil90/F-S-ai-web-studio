import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth springs for the cursor trail/ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  // Spotlight springs (slower, more fluid)
  const spotlightConfig = { damping: 40, stiffness: 150, mass: 1 };
  const spotlightX = useSpring(0, spotlightConfig);
  const spotlightY = useSpring(0, spotlightConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      spotlightX.set(e.clientX);
      spotlightY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Define what elements trigger the hover state
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-interactive="true"]') ||
        target.classList.contains('cursor-pointer') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeve = () => {
       setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseleave', handleMouseLeve);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseleave', handleMouseLeve);
    };
  }, [cursorX, cursorY, spotlightX, spotlightY, isVisible]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null; // Disable on mobile
  }

  return (
    <>
      <style>{`
        body {
          cursor: none;
        }
        a, button, [data-interactive="true"] {
          cursor: none !important;
        }
      `}</style>

      {/* Massive ambient spotlight */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, rgba(0, 123, 255, 0.02) 40%, transparent 70%)',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Trailing Ring / Glow */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] border border-[#00FFFF]/50 shadow-[0_0_15px_rgba(0,255,255,0.4)] flex items-center justify-center mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
          backgroundColor: isHovering ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Core Dot (Instant tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#00FFFF] rounded-full pointer-events-none z-[10001] shadow-[0_0_10px_#00FFFF]"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? (isHovering ? 0 : 1) : 0, // Hide core dot when hovering to focus on ring
        }}
      />
    </>
  );
};
