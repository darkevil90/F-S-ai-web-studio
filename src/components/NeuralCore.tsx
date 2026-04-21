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
    const particleCount = typeof window !== 'undefined' ? (window.innerWidth < 768 ? 60 : 120) : 100;
    const connectionRadius = 150;
    const baseColor = [0, 123, 255]; // #007BFF
    
    let mouse = { x: -1000, y: -1000, active: false };

    // Canvas sizing
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); // Reinitialize on resize to distribute particles
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseSize: number;
      size: number;
      pulsePhase: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.8; // Slow drift
        this.vy = (Math.random() - 0.5) * 0.8;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.05 + Math.random() * 0.05;
      }

      update(pointer: { x: number, y: number, active: boolean }) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // Mouse repel loosely
        if (pointer.active) {
          const dx = pointer.x - this.x;
          const dy = pointer.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            this.vx -= (dx / dist) * force * 0.05;
            this.vy -= (dy / dist) * force * 0.05;
          }
        }

        // Friction to cap speed
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Ensure minimum speed
        if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.2;
        if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.2;

        // Pulsating size
        this.pulsePhase += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulsePhase) * (this.baseSize * 0.5);
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Fast rendering via radial gradient instead of slow shadow blur
        const pulseRatio = 0.8 + Math.sin(this.pulsePhase)*0.2;
        const color = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${pulseRatio})`;
        ctx.fillStyle = color;
        ctx.fill();
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, this.size * 2.5);
        grad.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${pulseRatio * 0.4})`);
        grad.addColorStop(1, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      // Faint trail effect
      // ctx!.fillStyle = 'rgba(5, 5, 5, 0.2)';
      // ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update(mouse);
        p1.draw(ctx!);

        // Connect nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionRadius) {
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            
            // Opacity based on distance
            const opacity = 1 - (dist / connectionRadius);
            // Pulsating brightness
            const pulse = (Math.sin(p1.pulsePhase) + Math.cos(p2.pulsePhase)) * 0.25 + 0.5;
            
            ctx!.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity * pulse * 0.6})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      // Draw central pulsating core
      // (Added to give the literal "Central 3D pulsating 'Neural Core'")
      const centerX = canvas!.width / 2;
      const centerY = canvas!.height / 2;
      
      const time = Date.now() * 0.001;
      const coreRadius = 80 + Math.sin(time * 2) * 15;
      
      // Outer glow
      const grad = ctx!.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 4);
      grad.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.15)`);
      grad.addColorStop(0.5, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.05)`);
      grad.addColorStop(1, 'transparent');
      
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    
    // Track localized interactions
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
