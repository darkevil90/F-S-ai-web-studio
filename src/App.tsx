import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { Monitor, Cpu, Server, ChevronRight } from 'lucide-react';
import { NeuralCore } from './components/NeuralCore';

export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    if ((window as any).lenisInstance) {
      (window as any).lenisInstance.scrollTo(element, { 
        duration: 1.5, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

/** --- UTILITY COMPONENTS --- */

const FSLogo = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className={className}>
    <defs>
      <linearGradient id="fs-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#80BFFF" />
        <stop offset="50%" stopColor="#007BFF" />
        <stop offset="100%" stopColor="#003D80" />
      </linearGradient>
      <linearGradient id="fs-text" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#80BFFF" />
      </linearGradient>
      <filter id="glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="glow-light" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Hexagon core frame representing engineering / web architecture */}
    <path d="M 200 50 L 312.5 115 L 312.5 245 L 200 310 L 87.5 245 L 87.5 115 Z" fill="none" stroke="#007BFF" strokeWidth="3" opacity="0.4" filter="url(#glow-light)" />

    {/* Micro Particles within the core */}
    <g fill="#007BFF" filter="url(#glow-light)">
      <circle cx="160" cy="110" r="1.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="240" cy="90" r="2"><animate attributeName="opacity" values="0.1;0.6;0.1" dur="4s" repeatCount="indefinite" /><animate attributeName="cy" values="90;85;90" dur="5s" repeatCount="indefinite" /></circle>
      <circle cx="280" cy="140" r="1"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" /></circle>
      <circle cx="120" cy="200" r="1.5"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite" /></circle>
      <circle cx="250" cy="220" r="2.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" /><animate attributeName="cy" values="220;210;220" dur="6s" repeatCount="indefinite" /></circle>
      <circle cx="180" cy="260" r="1.5"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" /></circle>
      <circle cx="230" cy="270" r="1"><animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="140" cy="150" r="2"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="5s" repeatCount="indefinite" /><animate attributeName="cy" values="150;140;150" dur="7s" repeatCount="indefinite" /></circle>
      <circle cx="290" cy="200" r="1.5"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="4.5s" repeatCount="indefinite" /></circle>
      <circle cx="105" cy="150" r="1.5"><animate attributeName="opacity" values="0.1;0.8;0.1" dur="2.8s" repeatCount="indefinite" /></circle>
      <circle cx="160" cy="210" r="2"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.2s" repeatCount="indefinite" /><animate attributeName="cy" values="210;205;210" dur="4s" repeatCount="indefinite" /></circle>
      <circle cx="270" cy="170" r="1.5"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.3s" repeatCount="indefinite" /></circle>
      <circle cx="210" cy="110" r="1"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="4.2s" repeatCount="indefinite" /></circle>
    </g>

    {/* Inner shadow/glass geometry */}
    <polygon points="120,180 150,110 250,110 210,180" fill="url(#fs-glow)" opacity="0.2" filter="url(#glow-heavy)"/>
    <polygon points="190,250 150,180 250,180 280,250" fill="url(#fs-glow)" opacity="0.2" filter="url(#glow-heavy)"/>

    {/* Connective architecture lines */}
    <line x1="50" y1="180" x2="350" y2="180" stroke="#007BFF" strokeWidth="1" strokeDasharray="3 6" opacity="0.5" />
    <line x1="200" y1="20" x2="200" y2="340" stroke="#007BFF" strokeWidth="1" strokeDasharray="3 6" opacity="0.5" />

    {/* Typography - Precision crafted lettering */}
    <g textAnchor="middle" filter="url(#glow-light)">
      <text x="135" y="215" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="105" fill="#FFFFFF" letterSpacing="-2">F</text>
      
      <text x="200" y="205" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="300" fontSize="50" fill="#007BFF" opacity="0.9">&amp;</text>
      
      <text x="265" y="215" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="105" fill="url(#fs-text)" letterSpacing="-2">S</text>
    </g>
    
    {/* Studio sub-text */}
    <text x="205" y="375" fontFamily="monospace" fontWeight="bold" fontSize="24" fill="#888888" letterSpacing="12" textAnchor="middle">STUDIO</text>
    
    {/* Highlight Nodes */}
    <circle cx="200" cy="50" r="5" fill="#007BFF" filter="url(#glow-light)" />
    <circle cx="200" cy="310" r="5" fill="#007BFF" filter="url(#glow-light)" />
    <circle cx="87.5" cy="180" r="5" fill="#007BFF" filter="url(#glow-light)" />
    <circle cx="312.5" cy="180" r="5" fill="#007BFF" filter="url(#glow-light)" />
  </svg>
);

const StaggeredText = ({ text, className, as: Component = "h1" }: { text: string; className?: string, as?: any }) => {
  const words = text.split(" ");
  return (
    <Component className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-2 sm:mr-4 mb-1 sm:mb-2 md:mb-4">
          <motion.span
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
};

const MagneticButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Use Framer Motion values instead of React State to avoid re-renders on every mouse move
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: smoothX, y: smoothY }}
      onClick={onClick}
      className="cursor-pointer inline-block"
    >
      {children}
    </motion.div>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group ${className}`}
    >
      {children}
    </motion.div>
  );
};


/** --- SECTIONS --- */

// 1. Блок: Hero (Точка входа)
const HeroSection = () => {
  const scrollToContacts = () => {
    scrollToElement('contacts');
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent z-10 px-4 md:px-8">
      <div className="relative w-full max-w-7xl flex flex-col justify-center h-full pt-24 md:pt-32">
        <div className="max-w-5xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black font-heading tracking-tighter uppercase leading-[0.85] mb-6 md:mb-10 break-words flex flex-wrap">
            <span className="inline-block overflow-visible relative mr-2 sm:mr-4 mb-1 sm:mb-2 md:mb-4">
              <motion.span
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
                className="inline-block text-white relative z-10"
              >
                Пространство
              </motion.span>
            </span>
            <span className="inline-block overflow-visible relative mr-2 sm:mr-4 mb-1 sm:mb-2 md:mb-4">
              <motion.span
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="inline-block relative"
              >
                {/* Glow layer for soft pulsing */}
                <motion.span
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#007BFF] blur-xl z-0"
                  aria-hidden="true"
                >
                  будущего
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#007BFF]"
                >
                  будущего
                </motion.span>
              </motion.span>
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[#888888] font-inter text-base sm:text-lg md:text-2xl lg:text-3xl max-w-3xl leading-snug lg:leading-tight mb-12 border-l-[3px] border-[#007BFF] pl-5 md:pl-8"
          >
            Дизайн-инженерия нового поколения: где каждый пиксель обоснован алгоритмом, а каждый алгоритм — искусством.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <MagneticButton onClick={scrollToContacts}>
              <motion.div 
                animate={{ 
                  boxShadow: ["0px 0px 0px 0px rgba(0,123,255,0)", "0px 0px 30px 5px rgba(0,123,255,0.4)", "0px 0px 0px 0px rgba(0,123,255,0)"],
                  borderColor: ["rgba(0,123,255,0.2)", "rgba(0,123,255,0.8)", "rgba(0,123,255,0.2)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="group relative inline-flex items-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-black/40 backdrop-blur-md border border-[#007BFF]/50 rounded-full overflow-hidden transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#007BFF]/10 to-[#00FFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="font-heading text-sm sm:text-base md:text-lg font-medium tracking-[0.15em] uppercase text-white/90 relative z-10 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all">
                  Обсудить проект
                </span>
                <ChevronRight className="w-5 h-5 text-[#007BFF] group-hover:text-[#00FFFF] group-hover:translate-x-1 transition-all z-10 relative" />
              </motion.div>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 2. Блок: About (О студии) - Scroll Reveal Concept
const ScrollWord: React.FC<{ word: string, progress: any, start: number, end: number }> = ({ word, progress, start, end }) => {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const filter = useTransform(progress, [start, end], ["blur(12px)", "blur(0px)"]);
  
  const highlightWords = ["F&S", "Studio", "экосистемы,", "иммерсивные", "архитектуры.", "цифровые", "инженерный"];
  const color = highlightWords.includes(word) ? "#007BFF" : "#FFFFFF";

  return (
    <motion.span style={{ opacity, filter, color }} className="inline-block hover:text-[#00FFFF] hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all duration-300">
      {word}&nbsp;
    </motion.span>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });

  // Вариант 1 (Техно-эстетика):
  const text = "F&S Studio — инженерный подход к эстетике. Мы разрабатываем цифровые экосистемы, которые захватывают внимание с первых секунд. Наша специализация — иммерсивные интерфейсы, генеративный дизайн и сложные веб архитектуры.";
  
  const words = text.split(" ");

  return (
    <section id="about" ref={ref} className="relative min-h-[150vh] bg-[#050505] z-20 py-20 md:py-32 px-4 md:px-8 flex items-start justify-center" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,123,255,0.04)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="sticky top-1/4 max-w-6xl mx-auto flex flex-col gap-10 w-full mt-[10vh]">
        <div className="flex items-center gap-4 text-[#007BFF] font-mono text-xs sm:text-sm uppercase tracking-[0.2em] opacity-80">
          <span className="w-8 sm:w-16 h-[1px] bg-[#007BFF]"></span>
          [ О студии ]
        </div>
        
        <div className="flex flex-wrap text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-inter font-light leading-[1.2] tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            return (
              <ScrollWord 
                key={i} 
                word={word} 
                progress={scrollYProgress} 
                start={start} 
                end={end} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 3. Блок: Manifesto (Манифест) - Neural Timeline Concept

const ManifestoCard: React.FC<{ item: any; isEven: boolean }> = ({ item, isEven }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Dynamic animation values tracking scroll position
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.1, 1, 1, 0.1]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.95, 1.02, 1.02, 0.95]);
  const glow = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  
  // Transform glow numeric value into CSS strings
  const bgGlow = useTransform(glow, v => `rgba(0, 123, 255, ${v * 0.1})`);
  const borderColor = useTransform(glow, v => `rgba(0, 123, 255, ${v * 0.4 + 0.05})`);
  const nodeColor = useTransform(glow, v => v > 0.8 ? '#00FFFF' : '#050505');

  return (
    <div ref={cardRef} className={`w-full flex flex-col md:flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} relative items-start md:items-center py-6 md:py-10`}>
      {/* Node Point Overlaying the Line */}
      <motion.div 
        style={{ scale: useTransform(glow, [0, 1], [1, 1.8]), backgroundColor: nodeColor }}
        className="hidden md:block absolute left-1/2 w-3 h-3 border border-[#007BFF] rounded-full drop-shadow-[0_0_15px_#007BFF] -translate-x-1/2 z-20 transition-colors duration-300"
      />
      
      {/* Mobile Node Point */}
      <motion.div 
        style={{ scale: useTransform(glow, [0, 1], [1, 1.5]), backgroundColor: nodeColor }}
        className="md:hidden absolute left-[20px] w-2 h-2 border border-[#007BFF] rounded-full drop-shadow-[0_0_10px_#007BFF] -translate-x-1/2 z-20 mt-[44px] transition-colors duration-300"
      />

      {/* Content */}
      <div className={`w-full pl-12 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-20 text-left md:text-right' : 'md:pl-20 text-left'}`}>
        <motion.div
           style={{ opacity, scale, borderColor }}
           className="bg-[#050505]/50 backdrop-blur-xl border transition-colors duration-300 rounded-[2rem] p-8 md:p-12 relative group overflow-hidden"
        >
           <motion.div style={{ opacity: glow }} className="absolute inset-0 bg-gradient-to-b from-[#007BFF]/10 to-transparent pointer-events-none blur-3xl" />
           <motion.div style={{ backgroundColor: bgGlow }} className="absolute inset-0 pointer-events-none transition-colors" />

           <div className={`font-mono text-[#007BFF]/80 text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 md:mb-6 ${isEven ? 'md:justify-end' : 'md:justify-start'} flex items-center gap-3 relative z-10`}>
              <span className="w-8 h-[1px] bg-[#007BFF]/50"></span>
              {item.id}
           </div>

           <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-3 sm:mb-5 leading-tight transition-all relative z-10 group-hover:text-[#00FFFF] group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
             {item.title}
           </h3>
           <p className="text-[#888888] font-inter font-light text-sm sm:text-base md:text-lg leading-relaxed relative z-10 group-hover:text-[#cccccc] transition-colors">
             {item.desc}
           </p>
        </motion.div>
      </div>
    </div>
  );
};

const ManifestoSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const manifestoItems = [
    {
      id: "01",
      title: "Логика как искусство",
      desc: "Код — это наш холст. Мы верим, что красивый интерфейс рождается из безупречной математики и стройной архитектуры.",
    },
    {
      id: "02",
      title: "Оптимизация абсолюта",
      desc: "Никаких лагов. Только 60FPS. Перформанс — это уважение к пользователю.",
    },
    {
      id: "03",
      title: "Функция формирует форму",
      desc: "Анимация ради анимации мертва. Мы используем motion для направления фокуса и создания когнитивной связи.",
    },
    {
      id: "04",
      title: "Интеллект × Разум",
      desc: "Мы объединяем генеративные алгоритмы и человеческую эмпатию, создавая абстракции, которые чувствуют.",
    }
  ];

  return (
    <section id="manifesto" ref={ref} className="relative py-24 md:py-48 bg-[#050505] z-20 px-4 md:px-8 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
       <div className="max-w-6xl mx-auto relative cursor-default">
          <div className="text-center mb-20 md:mb-32 flex flex-col items-center">
             <h2 className="text-4xl sm:text-5xl md:text-[5rem] lg:text-[7rem] font-heading font-black text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(0,123,255,0.2)] leading-none">
               Манифест
             </h2>
          </div>

          {/* Central Neural Line Background */}
          <div className="absolute left-[20px] md:left-1/2 top-48 bottom-0 w-[1px] md:w-[2px] bg-white/[0.03] md:-translate-x-1/2" />
          {/* Active Neural Line */}
          <motion.div style={{ height: lineHeight }} className="absolute left-[20px] md:left-1/2 top-48 w-[1px] md:w-[2px] bg-gradient-to-b from-[#00FFFF] to-[#007BFF] md:-translate-x-1/2 shadow-[0_0_20px_#007BFF] origin-top z-10 [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]" />

          <div className="flex flex-col gap-0 md:gap-12 relative z-20">
            {manifestoItems.map((item, i) => (
              <ManifestoCard key={item.id} item={item} isEven={i % 2 === 0} />
            ))}
          </div>
       </div>
    </section>
  );
};


// 4. Блок: Технологии (Tech Stack)
const TechStackSection = () => {
  const [selectedTech, setSelectedTech] = useState<number | null>(null);

  // Профессиональный подход к модальным окнам: блокировка основного скролла
  useEffect(() => {
    if (selectedTech !== null) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Дополнительно защиты от bounce scroll на iOS
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [selectedTech]);

  const cards = [
    { 
      category: "Frontend // WebGL", 
      icon: <Monitor className="w-8 h-8 md:w-10 md:h-10 text-[#007BFF]" />,
      items: ["Three.js", "GSAP", "React", "Framer Motion", "Lenis", "Next.js"],
      details: "Мы не верстаем сайты. Мы программируем клиентские архитектуры. Использование аппаратного ускорения, кастомных шейдеров (GLSL) и микроинтеракций позволяет нам выжимать стабильные 60 FPS на любых устройствах."
    },
    { 
      category: "AI & Generative", 
      icon: <Cpu className="w-8 h-8 md:w-10 md:h-10 text-[#007BFF]" />,
      items: ["Google AI Studio", "Antigravity", "Python", "Neural Models"],
      details: "Генеративный дизайн и интеллект. Мы интегрируем AI напрямую в бизнес-логику и визуальный пайплайн, создавая адаптивные интерфейсы, которые подстраиваются под пользователя в реальном времени."
    },
    { 
      category: "Backend & Ops", 
      icon: <Server className="w-8 h-8 md:w-10 md:h-10 text-[#007BFF]" />,
      items: ["Node.js", "Firebase", "PostgreSQL", "Docker", "Vercel"],
      details: "Безупречная серверная инфраструктура. Бессерверные архитектуры, реалтайм базы данных и мгновенный деплой. Мы строим backend, который выдержит любой скейлинг."
    }
  ];

  return (
    <section id="tech" className="relative py-24 md:py-40 bg-transparent overflow-hidden flex items-center min-h-screen z-10">
      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full max-w-7xl">
        <div className="flex flex-col gap-10 md:gap-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[7rem] uppercase text-white font-black leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(0,123,255,0.15)]"
            >
              Стек
            </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
            {cards.map((card, idx) => (
              <div key={idx} onClick={() => setSelectedTech(idx)} className="cursor-pointer group h-full">
                <TiltCard className="h-full">
                  <div className="flex flex-col p-8 md:p-12 h-full min-h-[400px] md:min-h-[500px] rounded-[2rem] bg-white/[0.015] border border-white/5 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] hover:border-[#007BFF]/40 transition-all duration-500 relative overflow-hidden group-hover:bg-[#007BFF]/[0.02]">
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#007BFF]/0 via-transparent to-[#007BFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="p-4 bg-black/40 border border-[#007BFF]/20 rounded-2xl group-hover:bg-[#007BFF]/20 group-hover:border-[#007BFF]/50 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(0,123,255,0.3)]">
                        {card.icon}
                      </div>
                      <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#444] group-hover:text-[#007BFF] transition-colors">0{idx + 1}</span>
                    </div>

                    <h4 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white uppercase tracking-tighter font-bold relative z-10 mb-6 leading-none">
                      {card.category}
                    </h4>
                    
                    <div className="flex flex-col gap-4 relative z-10 flex-grow">
                      {card.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-1 h-1 bg-[#007BFF] rounded-full opacity-30 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#007BFF] transition-all" />
                          <span className="font-inter font-light text-base md:text-lg text-[#777] group-hover:text-white transition-colors duration-300">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                      <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#666] group-hover:text-[#00FFFF] transition-colors">Подробности</span>
                      <ChevronRight className="w-5 h-5 text-[#444] group-hover:text-[#00FFFF] group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini-panel / Modal for tech details */}
      <AnimatePresence>
        {selectedTech !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[#050505]/95 backdrop-blur-xl"
            style={{ perspective: 1200 }}
            onClick={() => setSelectedTech(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0A0A0A] border border-[#007BFF]/20 p-8 md:p-16 rounded-[2.5rem] w-full max-w-4xl relative max-h-[85vh] overflow-y-auto shadow-[0_0_80px_rgba(0,123,255,0.1)] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#007BFF] to-transparent opacity-50" />
              
              <div className="flex-1 mt-2 md:mt-0 relative z-10">
                <div className="font-mono text-[#007BFF] text-sm tracking-[0.2em] mb-6 uppercase">
                  Unit 0{selectedTech + 1}
                </div>
                <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl uppercase font-black text-white mb-8 tracking-tighter leading-none">
                  {cards[selectedTech].category}
                </h3>
                <div className="flex flex-wrap gap-3 md:gap-4 mb-12">
                  {cards[selectedTech].items.map((item, i) => (
                    <span key={i} className="px-5 py-2.5 border border-[#007BFF]/30 text-white bg-[#007BFF]/10 rounded-full font-mono text-sm md:text-base tracking-wide">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="font-inter font-light text-xl md:text-2xl text-[#aaa] leading-relaxed max-w-3xl">
                  {cards[selectedTech].details}
                </p>
              </div>

              {/* Close Button */}
              <div className="w-full flex justify-center mt-12 pt-8 border-t border-white/5 relative z-10">
                <motion.button 
                  onClick={() => setSelectedTech(null)}
                  className="group flex flex-col items-center justify-center cursor-pointer"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="relative w-12 h-12 flex items-center justify-center bg-transparent transition-all">
                    <span className="absolute w-6 h-[2px] bg-white/50 group-hover:bg-[#007BFF] transform rotate-45 transition-colors duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_15px_rgba(0,123,255,0.6)]"></span>
                    <span className="absolute w-6 h-[2px] bg-white/50 group-hover:bg-[#007BFF] transform -rotate-45 transition-colors duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_15px_rgba(0,123,255,0.6)]"></span>
                  </div>
                </motion.button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ProjectCard = ({ proj, index, progress }: { proj: any, index: number, progress: any }) => {
  const center = index / 3;
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use mapping functions to avoid Web Animations API WAAPI out-of-bounds offset errors
  const scale = useTransform(progress, (v: number) => {
    const min = center - 0.35;
    const max = center + 0.35;
    if (v <= min || v >= max) return 0.75;
    if (v < center) return 0.75 + ((v - min) / (center - min)) * 0.25;
    return 1 - ((v - center) / (max - center)) * 0.25;
  });

  const scrollRotateY = useTransform(progress, (v: number) => {
    const min = center - 0.35;
    const max = center + 0.35;
    if (v <= min) return 25;
    if (v >= max) return -25;
    if (v < center) return 25 - ((v - min) / (center - min)) * 25;
    return -((v - center) / (max - center)) * 25;
  });

  const opacity = useTransform(progress, (v: number) => {
    const min = center - 0.35;
    const max = center + 0.35;
    if (v <= min || v >= max) return 0.1;
    if (v < center) return 0.1 + ((v - min) / (center - min)) * 0.9;
    return 1 - ((v - center) / (max - center)) * 0.9;
  });

  // Mouse Interaction Values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Spotlight transform
  const spotlightTop = useTransform(smoothMouseY, [0, 1], ["0%", "100%"]);
  const spotlightLeft = useTransform(smoothMouseX, [0, 1], ["0%", "100%"]);

  // Tilt transform (subtle)
  const tiltX = useTransform(smoothMouseY, [0, 1], [8, -8]);
  const tiltY = useTransform(smoothMouseX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div className="w-screen h-[100dvh] flex items-center justify-center p-4 md:p-6 shrink-0 relative" style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          const url = proj.link || `https://${proj.domain}`;
          window.open(url, "_blank");
        }}
        style={{ 
          scale, 
          rotateY: scrollRotateY, 
          opacity, 
          transformStyle: "preserve-3d" 
        }}
        className={`relative w-full max-w-6xl h-[70vh] md:h-[65vh] rounded-[2.5rem] border border-white/10 flex flex-col justify-between overflow-hidden group cursor-none ${proj.bgClass}`}
      >
        {/* Interaction layer: Spotlight */}
        <motion.div 
          className="absolute w-[800px] h-[800px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
          style={{
            top: spotlightTop,
            left: spotlightLeft,
            x: "-50%",
            y: "-50%",
            background: `radial-gradient(circle, ${proj.accentColor.replace('0.2', '0.4').replace('0.1', '0.2')} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        {/* Global Accent Glow */}
        <div 
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none group-hover:opacity-40 transition-opacity duration-1000" 
          style={{ background: `radial-gradient(circle at 100% 0%, ${proj.accentColor} 0%, transparent 50%)` }}
        />
        
        {proj.isFuture && <div className="absolute inset-0 bg-[#007BFF]/10 blur-3xl opacity-50 pointer-events-none group-hover:opacity-70 transition-opacity" />}

        {/* Inner Content Wrapper for Tilt */}
        <motion.div 
          style={{ 
            rotateX: tiltX, 
            rotateY: tiltY,
            transformStyle: "preserve-3d",
            height: "100%",
            width: "100%"
          }}
          className="relative flex flex-col justify-between z-30"
        >
          <div className="p-8 md:p-16 flex justify-between items-start">
            <div style={{ transform: "translateZ(100px)" }}>
              <h3 className="font-heading text-3xl md:text-5xl lg:text-7xl uppercase font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] leading-tight">
                {proj.title}
              </h3>
              <p className="mt-4 font-mono text-[#888] text-xs md:text-lg lg:text-2xl uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors duration-500">
                {proj.description}
              </p>
            </div>
          </div>
          
          <div className="p-8 md:p-16 flex items-end justify-between">
            <div style={{ transform: "translateZ(80px)" }} className="flex flex-col gap-2">
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#444] group-hover:text-[#888] transition-colors">Experience / 0{index + 1}</span>
              {proj.isFuture ? (
                <a href={proj.link} target="_blank" rel="noreferrer" className="flex items-center gap-4 group/btn">
                  <span className="font-mono text-[#007BFF] text-xl md:text-2xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-blue-300">
                    Начать проект
                  </span>
                  <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-[#007BFF] flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-500">
                    <ChevronRight className="w-5 h-5 md:w-10 md:h-10 text-white" />
                  </div>
                </a>
              ) : (
                <a href={`https://${proj.domain}`} target="_blank" rel="noreferrer" className="font-mono text-white/50 hover:text-white transition-all text-xl md:text-2xl lg:text-5xl group-hover:tracking-wider transition-all duration-700">
                  {proj.domain}
                </a>
              )}
            </div>

            {/* Custom Interactive Cursor inside card (only on hover) */}
            <motion.div
              style={{
                top: spotlightTop,
                left: spotlightLeft,
                x: "-50%",
                y: "-50%",
              }}
              className="absolute w-16 h-16 rounded-full border border-[#007BFF]/30 backdrop-blur-md pointer-events-none z-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 transform-gpu"
            >
              <div className="w-1.5 h-1.5 bg-[#007BFF] rounded-full shadow-[0_0_15px_#007BFF]" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// 5. Блок: Projects (Кейсы)
const ProjectsSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-300vw"]);

  const projects = [
    {
      title: "Personal Brand",
      domain: "farrukh-adizov-porfolio.vercel.app",
      description: "Креативный хаос и эстетика",
      bgClass: "bg-[#050505] bg-[size:30px_30px]",
      accentColor: "rgba(147, 51, 234, 0.25)", // Purple
      isFuture: false
    },
    {
      title: "Web Studio",
      domain: "adizovstudio.ru",
      description: "Чистый корпоративный AI-стиль",
      bgClass: "bg-[#050505]",
      accentColor: "rgba(0, 123, 255, 0.25)", // Blue
      isFuture: false
    },
    {
      title: "Tech Store",
      domain: "istore34.ru",
      description: "Премиальный ритейл",
      bgClass: "bg-[#050505]",
      accentColor: "rgba(255, 255, 255, 0.15)", // White/Grey
      isFuture: false
    },
    {
      title: "Ваш проект",
      domain: "Инициализировать соединение",
      description: "Станьте частью будущего",
      bgClass: "bg-[#050505]",
      accentColor: "rgba(0, 255, 255, 0.25)", // Cyan
      isFuture: true,
      link: "https://t.me/Darkstoic"
    }
  ];

  return (
    <section id="projects" ref={targetRef} className="relative h-[400vh] bg-transparent z-10">
      {/* Sticky container matching screen height */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden w-full">
        
        {/* Floating title above the timeline */}
        <div className="absolute top-12 md:top-20 left-6 md:left-12 z-50 pointer-events-none flex items-center gap-4">
          <span className="w-12 h-[2px] bg-[#007BFF]"></span>
          <h2 className="font-heading text-base md:text-xl text-white uppercase font-bold tracking-[0.2em] opacity-80">Избранные проекты</h2>
        </div>

        <motion.div style={{ x }} className="flex w-[400vw] h-full items-center">
          {projects.map((proj, i) => (
            <React.Fragment key={i}>
              <ProjectCard proj={proj} index={i} progress={scrollYProgress} />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// 6. Блок: Contacts (Архитекторы системы)
const ContactsSection = () => {
  const contacts = [
    {
      name: "Фаррух Адизов",
      role: "Lead UI // AI Creator",
      tg: "@Darkstoic",
      tgLink: "https://t.me/Darkstoic",
      phone: "+79998987849",
      email: "adizov.farrux@gmail.com"
    },
    {
      name: "Сергей Олейников",
      role: "Business Lead // Integrator",
      tg: "@sergei_oleinikov",
      tgLink: "https://t.me/sergei_oleinikov",
      phone: "+79020930167",
      email: "sergey0leynikov@yandex.ru"
    }
  ];

  return (
    <section id="contacts" className="py-24 md:py-40 bg-transparent min-h-screen flex items-center relative z-10 w-full overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 w-full max-w-7xl relative z-20">
        <div className="mb-16 md:mb-24">
          <div className="font-mono text-[#007BFF] text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 opacity-80">[ Architecture Core ]</div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-[5rem] lg:text-[7rem] font-black uppercase text-white tracking-tighter leading-none">
            Архитекторы
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {contacts.map((c, i) => (
            <div 
              key={i}
              className="flex flex-col relative group"
            >
              <div className="absolute -left-4 md:-left-8 top-0 w-1 h-0 bg-[#007BFF] group-hover:h-full transition-all duration-500 ease-out" />
              
              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 group-hover:text-[#00FFFF] transition-colors duration-300 transform-gpu">{c.name}</h3>
              <p className="font-mono text-[#007BFF] uppercase tracking-[0.1em] text-sm md:text-base mb-12">{c.role}</p>

              <div className="space-y-6 md:space-y-8 font-mono text-base md:text-xl font-light">
                <MagneticButton>
                  <a href={c.tgLink} target="_blank" rel="noreferrer" className="flex items-center gap-6 text-[#ccc] hover:text-white transition-colors group/link w-fit">
                    <span className="text-[#555] uppercase tracking-[0.2em] text-sm w-16">TG</span> 
                    <span className="group-hover/link:translate-x-2 transition-transform duration-300">{c.tg}</span>
                  </a>
                </MagneticButton>
                <div className="w-full max-w-md h-px bg-white/5" />
                
                <MagneticButton>
                  <a href={`tel:${c.phone}`} className="flex items-center gap-6 text-[#ccc] hover:text-white transition-colors group/link w-fit">
                    <span className="text-[#555] uppercase tracking-[0.2em] text-sm w-16">TEL</span> 
                    <span className="group-hover/link:translate-x-2 transition-transform duration-300">{c.phone}</span>
                  </a>
                </MagneticButton>
                <div className="w-full max-w-md h-px bg-white/5" />

                <MagneticButton>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-6 text-[#ccc] hover:text-white transition-colors group/link w-fit">
                    <span className="text-[#555] uppercase tracking-[0.2em] text-sm w-16">MAIL</span> 
                    <span className="group-hover/link:translate-x-2 transition-transform duration-300 break-all">{c.email}</span>
                  </a>
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MobileVerticalPulseMenu = ({ menuItems, activeSection, handleScrollTo }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // pulseValue: 100 means closed, 0 means open
  const pulseValue = useSpring(100, { stiffness: 400, damping: 30 });

  useEffect(() => {
    pulseValue.set(isOpen ? 0 : 100);
  }, [isOpen, pulseValue]);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDrag = (e: any, info: any) => {
    const base = isOpen ? 0 : 100;
    let newX = base + (info.offset.x / 1.5);
    pulseValue.set(Math.max(0, Math.min(100, newX)));
  };

  const onDragEnd = (e: any, info: any) => {
    setIsDragging(false);
    if (!isOpen && (info.offset.x < -30 || info.velocity.x < -100)) {
      setIsOpen(true);
    } else if (isOpen && (info.offset.x > 30 || info.velocity.x > 100)) {
      setIsOpen(false);
    } else {
      pulseValue.set(isOpen ? 0 : 100);
    }
  };

  const pathData = useTransform(pulseValue, cx => `M 100,0 Q ${cx},50 100,100`);
  
  const bgOpacity = useTransform(pulseValue, cx => (100 - cx) / 100 * 0.8);
  const itemsOpacity = useTransform(pulseValue, cx => 1 - cx / 100);

  return (
    <>
      <motion.div 
        className="md:hidden fixed inset-0 z-[10900] bg-[#050505] pointer-events-none"
        style={{ opacity: bgOpacity, pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={() => setIsOpen(false)}
      />

      <motion.div 
        className={`md:hidden fixed right-0 top-0 bottom-0 z-[11000] touch-none ${isOpen ? 'w-full' : 'w-12'}`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        style={{ touchAction: 'pan-y' }}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          else setIsOpen(false);
        }}
      >
        <div className="absolute right-0 top-0 w-32 h-full pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              d={pathData} 
              fill="none" 
              stroke="#00FFFF" 
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.6))' }}
              animate={{ 
                opacity: [0.4, 0.9, 0.4],
                strokeWidth: [2, 4, 2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Tension Chevron < */}
        <AnimatePresence>
          {!isOpen && !isDragging && (
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                x: [0, -4, 0]
              }}
              exit={{ opacity: 0, x: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[#00FFFF] text-sm font-bold pointer-events-none drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]"
            >
              &lt;
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute right-0 top-0 bottom-0 w-48 flex flex-col justify-center h-[60vh] md:h-[70vh] my-auto pointer-events-none">
          {menuItems.map((item: any, idx: number) => {
            const isActive = activeSection === item.id;
            const itemX = useTransform(pulseValue, cx => cx * 1.5); 

            return (
              <motion.button
                key={item.id}
                onClick={(e) => { 
                  e.stopPropagation();
                  handleScrollTo(item.id); 
                  setIsOpen(false); 
                }}
                className="pointer-events-auto flex-1 flex flex-col items-end justify-center pr-10 outline-none"
                style={{ x: itemX, opacity: itemsOpacity }}
              >
                <div className="flex flex-col items-end group">
                  <span className={`font-mono text-sm uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-[#888]'}`}>
                    {item.shortName}
                  </span>
                  <span className={`font-mono text-[10px] mt-1 ${isActive ? 'text-[#00FFFF]' : 'text-[#444]'}`}>
                    0{idx + 1}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  const menuItems = [
    { name: "01 // Главная", shortName: "Главная", id: "hero" },
    { name: "02 // О студии", shortName: "Студия", id: "about" },
    { name: "03 // Манифест", shortName: "Манифест", id: "manifesto" },
    { name: "04 // Технологии", shortName: "Технологии", id: "tech" },
    { name: "05 // Кейсы", shortName: "Кейсы", id: "projects" },
    { name: "06 // Инженеры", shortName: "Контакты", id: "contacts" }
  ];

  const [isScrollingTo, setIsScrollingTo] = useState(false);

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    setIsScrollingTo(true);
    document.body.style.overflow = '';
    scrollToElement(id);
    setTimeout(() => setIsScrollingTo(false), 1500);
  };

  // Force scroll to top on refresh and disable auto-restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    (window as any).lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).lenisInstance = null;
    };
  }, []);

  // Track active section via IntersectionObserver with a center screen scan-line
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if ((window as any).isScrollingToFlag) return; // Prevent updates during programmatic scroll
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0, rootMargin: "-40% 0px -40% 0px" } 
    );

    const observeIds = ["hero", ...menuItems.map(m => m.id)];
    observeIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Sync state flag to a global variable so the effect callback can read it
  useEffect(() => {
    (window as any).isScrollingToFlag = isScrollingTo;
  }, [isScrollingTo]);

  return (
    // Solved X-axis scroll jumps without breaking top/sticky logic
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#007BFF] selection:text-white scroll-smooth w-full relative overflow-clip">
      
      {/* Mobile Top Gradient (Vignette) for Logo readability */}
      <div 
        className="md:hidden fixed top-0 left-0 w-full h-40 z-[10900] pointer-events-none bg-gradient-to-b from-[#050505]/90 via-[#050505]/50 to-transparent"
        style={{ 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' 
        }}
      />

      {/* Main Logo */}
      <div className="fixed top-4 md:top-6 left-4 md:left-6 z-[11500] cursor-pointer group" onClick={() => handleScrollTo('hero')}>
        <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <FSLogo className="w-full h-full drop-shadow-[0_0_15px_rgba(26,123,255,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all duration-500" />
        </div>
      </div>

      {/* Global Vertical Timeline Navigation (Desktop Only) */}
      <nav className="hidden md:flex fixed right-0 top-0 bottom-0 z-[11000] w-20 hover:w-64 flex-col justify-center items-end py-20 group transition-all duration-500 pointer-events-none">
        
        {/* Neon Line */}
        <div className="absolute right-3 md:right-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:via-[#007BFF]/30 transition-colors duration-500">
          <motion.div 
            className="absolute top-0 w-full h-[30vh] bg-gradient-to-b from-transparent via-[#00FFFF] to-transparent opacity-50"
            animate={{ y: ["-100vh", "100vh"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative w-full flex flex-col justify-between h-[40vh] md:h-[60vh] items-end pointer-events-auto">
          {menuItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="relative group/item flex items-center h-12 w-full cursor-pointer pr-10 md:pr-20 outline-none justify-end"
              >
                {/* Labels (visible on hover for desktop, hidden on mobile) */}
                <div className="hidden md:flex flex-1 justify-end overflow-hidden">
                  <span className={`font-mono text-sm uppercase tracking-[0.2em] whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-x-4 md:group-hover:translate-x-0 ${isActive ? 'text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-[#888] md:group-hover/item:text-white'}`}>
                    {item.shortName}
                  </span>
                </div>

                {/* Number (hidden on mobile, visible on desktop) */}
                <div className="hidden md:flex absolute right-14 items-center pr-2 font-mono text-[10px] pointer-events-none">
                  <span className={`transition-colors duration-300 ${isActive ? 'text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-[#555] md:group-hover:text-[#aaa]'}`}>
                    0{idx + 1}
                  </span>
                </div>

                {/* Node */}
                <div className="absolute right-3 md:right-10 w-[1px] flex justify-center items-center pointer-events-none">
                  {isActive ? (
                    <div className="relative w-1.5 md:w-2 h-1.5 md:h-2 bg-[#00FFFF] rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)] md:group-hover/item:scale-125 transition-transform duration-300">
                      <motion.div 
                        layoutId="activeVertGlow"
                        className="absolute -inset-1.5 md:-inset-2 rounded-full border border-[#00FFFF] opacity-50 shadow-[0_0_15px_rgba(0,255,255,0.6)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    </div>
                  ) : (
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#555] md:group-hover/item:bg-[#007BFF] transition-all duration-300 shadow-[0_0_5px_rgba(0,123,255,0.2)] md:group-hover/item:scale-150 transform" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Vertical Pulse Navigation */}
      <MobileVerticalPulseMenu menuItems={menuItems} activeSection={activeSection} handleScrollTo={handleScrollTo} />

      {/* Global Background (NeuralCore + Vignette) - Shown on layers 1, 4, 5, 6 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralCore />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_80%)]" />
      </div>

      <HeroSection />
      
      {/* Global pseudo-Z-axis depth modifier for entry */}
      <motion.div
        initial={{ scale: 0.95, filter: "blur(20px)" }}
        whileInView={{ scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <AboutSection />
      </motion.div>
      
      <ManifestoSection />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <TechStackSection />
      </motion.div>

      <ProjectsSection />
      <ContactsSection />
    </div>
  );
}

