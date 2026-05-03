import React, { useEffect, useRef } from 'react';

export const NeuralCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Core parameters
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const particleCount = isMobile ? 80 : 160;
    const connectionRadius = 400; // 3D distance
    const baseColor = [0, 123, 255]; // #007BFF
    const fov = 800; // Field of view depth
    
    let mouse = { x: 0, y: 0, active: false };
    let lastScrollY = window.scrollY;

    // Canvas sizing
    const resize = () => {
      const oldWidth = canvas.width;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (particles.length === 0 || Math.abs(oldWidth - window.innerWidth) > 50) {
        init(); 
      }
    };

    class Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      baseSize: number;
      pulsePhase: number;
      pulseSpeed: number;

      constructor(initZ?: number) {
        this.x = (Math.random() - 0.5) * 3000;
        this.y = (Math.random() - 0.5) * 3000;
        this.z = initZ !== undefined ? initZ : Math.random() * 2000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 2 + 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update(pointer: { x: number, y: number, active: boolean }, zSpeed: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.z -= zSpeed;

        // Reset if it passes behind the camera
        if (this.z < -fov + 10) {
           this.z += 2000;
           this.x = (Math.random() - 0.5) * 3000;
           this.y = (Math.random() - 0.5) * 3000;
        }
        // If scrolling heavily backwards, recycle forwards
        if (this.z > 2000) {
           this.z -= 2000;
        }

        // Mouse repel in 2D projection space? (Skip for true 3D to save perf, or do a simple fake)

        this.pulsePhase += this.pulseSpeed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.z < -fov) return; // Behind camera

        const scale = fov / (fov + this.z);
        const sx = canvas!.width / 2 + this.x * scale;
        const sy = canvas!.height / 2 + this.y * scale;
        const size = this.baseSize * scale;

        // Don't draw if heavily off-screen
        if (sx < -100 || sx > canvas!.width + 100 || sy < -100 || sy > canvas!.height + 100) return;

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        
        const pulseRatio = 0.8 + Math.sin(this.pulsePhase) * 0.2;
        // Fade out in distance, and fade out very close to camera
        let zFade = 1;
        if (this.z > 1500) zFade = 1 - (this.z - 1500) / 500;
        else if (this.z < -fov + 200) zFade = (this.z - (-fov)) / 200;
        
        zFade = Math.max(0, Math.min(1, zFade));

        const color = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${pulseRatio * zFade})`;
        ctx.fillStyle = color;
        ctx.fill();
        
        if (size > 0.5 && zFade > 0.1) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 2.5, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(sx, sy, size, sx, sy, size * 2.5);
          grad.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${pulseRatio * 0.4 * zFade})`);
          grad.addColorStop(1, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0)`);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        // Distribute Z evenly at start
        particles.push(new Particle(Math.random() * 2000));
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const currentScrollY = window.scrollY;
      // Filter extreme scroll deltas to prevent glitching on hard jumps
      let scrollDelta = currentScrollY - lastScrollY;
      if (Math.abs(scrollDelta) > 500) scrollDelta = Math.sign(scrollDelta) * 50; 
      lastScrollY = currentScrollY;

      // Base idle speed + scroll velocity
      const zSpeed = 0.5 + (scrollDelta * 1.5);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update(mouse, zSpeed);
        p1.draw(ctx!);

        // Connect nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const distSq = dx*dx + dy*dy + dz*dz;

          if (distSq < connectionRadius * connectionRadius) {
            // Draw 3D projected line
            if (p1.z < -fov || p2.z < -fov) continue;
            
            const scale1 = fov / (fov + p1.z);
            const sx1 = canvas!.width / 2 + p1.x * scale1;
            const sy1 = canvas!.height / 2 + p1.y * scale1;
            
            const scale2 = fov / (fov + p2.z);
            const sx2 = canvas!.width / 2 + p2.x * scale2;
            const sy2 = canvas!.height / 2 + p2.y * scale2;

            const dist = Math.sqrt(distSq);
            let opacity = 1 - (dist / connectionRadius);

            // Fade out in distance or close up
            let zFade = 1;
            const avgZ = (p1.z + p2.z) / 2;
            if (avgZ > 1500) zFade = 1 - (avgZ - 1500) / 500;
            else if (avgZ < -fov + 200) zFade = (avgZ - (-fov)) / 200;
            zFade = Math.max(0, Math.min(1, zFade));

            const pulse = (Math.sin(p1.pulsePhase) + Math.cos(p2.pulsePhase)) * 0.25 + 0.5;
            
            ctx!.beginPath();
            ctx!.moveTo(sx1, sy1);
            ctx!.lineTo(sx2, sy2);
            ctx!.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity * pulse * zFade * 0.5})`;
            ctx!.lineWidth = Math.max(0.1, (scale1 + scale2) / 2);
            ctx!.stroke();
          }
        }
      }

      // Draw central pulsating core
      const centerX = canvas!.width / 2;
      const centerY = canvas!.height / 2;
      const time = Date.now() * 0.001;
      const coreRadius = 80 + Math.sin(time * 2) * 15;
      
      const grad = ctx!.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 4);
      grad.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.1)`);
      grad.addColorStop(0.5, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.03)`);
      grad.addColorStop(1, 'transparent');
      
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      mouse.active = true;
      if (e instanceof MouseEvent) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      } else if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    
    const handleLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseout', handleLeave);
    window.addEventListener('touchend', handleLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseout', handleLeave);
      window.removeEventListener('touchend', handleLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
