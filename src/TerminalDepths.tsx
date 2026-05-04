import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Monitor, Cpu, Server, ChevronRight } from 'lucide-react';
import { HoloCard } from './components/HoloCard';
import { NeuralText } from './components/NeuralText';

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

const AboutDeepLayer = ({ progress }: { progress: any }) => {
    const scale = useTransform(progress, (v: number) => {
        if (v < 0.05) return 0.5 + (0.5 * (v / 0.05));
        if (v <= 0.15) return 1;
        if (v <= 0.25) return 1 + (3 * ((v - 0.15) / 0.10));
        return 4;
    });

    const opacity = useTransform(progress, (v: number) => {
        if (v < 0.05) return Math.min(1, v / 0.05);
        if (v <= 0.15) return 1;
        if (v <= 0.22) return Math.max(0, 1 - ((v - 0.15) / 0.07));
        return 0;
    });

    const blur = useTransform(progress, (v: number) => {
        if (v < 0.05) return `blur(${Math.max(0, 20 - (20 * (v / 0.05)))}px)`;
        if (v <= 0.15) return 'blur(0px)';
        if (v <= 0.25) return `blur(${Math.min(40, 40 * ((v - 0.15) / 0.10))}px)`;
        return 'blur(40px)';
    });

    return (
        <motion.div style={{ scale, opacity, filter: blur }} className="absolute z-10 w-full max-w-5xl px-4 text-center pointer-events-none flex flex-col items-center justify-center">
            <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl font-light text-white leading-[1.2] tracking-tight text-center drop-shadow-[0_0_30px_rgba(0,123,255,0.3)]">
                <NeuralText>F&S Studio</NeuralText> — <span className="font-bold text-[#007BFF]">инженерный</span> подход к эстетике.
            </h2>
            <p className="mt-8 text-xl sm:text-2xl md:text-3xl text-white/50 font-inter font-light max-w-4xl mx-auto leading-relaxed">
               Мы разрабатываем <NeuralText className="text-cyan-400">цифровые экосистемы</NeuralText>, которые захватывают внимание с первых секунд. Наша специализация — иммерсивные интерфейсы, генеративный дизайн и сложные веб архитектуры.
            </p>
        </motion.div>
    );
};

const ManifestoDeepCard: React.FC<{ item: any, progress: any, index: number }> = ({ item, progress, index }) => {
    // Adjusted spacing for better mobile experience and visibility
    const start = 0.18 + (index * 0.14);
    const peak = start + 0.06;
    const stay = peak + 0.04;
    const fade = stay + 0.06;
    const end = fade + 0.04;

    const scale = useTransform(progress, (v: number) => {
        if (v < start) return 0.5;
        if (v < peak) return 0.5 + (0.5 * ((v - start)/(peak - start)));
        if (v < stay) return 1;
        if (v < fade) return 1;
        if (v < end) return 1 + (1.5 * ((v - fade)/(end - fade)));
        return 2.5;
    });

    const opacity = useTransform(progress, (v: number) => {
        if (v < start) return 0;
        if (v < peak) return (v - start)/(peak - start);
        if (v < stay) return 1;
        if (v < fade) return 1;
        if (v < end) return Math.max(0, 1 - ((v - fade)/(end - fade)));
        return 0;
    });

    const blur = useTransform(progress, (v: number) => {
        if (v < start) return 'blur(15px)';
        if (v < start + 0.01) return 'none'; // Avoid tiny blurs
        if (v < peak) return `blur(${Math.max(0, 15 - 15 * ((v - start)/(peak - start)))}px)`;
        if (v < fade) return 'none';
        if (v < end) return `blur(${Math.min(20, 20 * ((v - fade)/(end - fade)))}px)`;
        return 'blur(20px)';
    });

    return (
        <motion.div 
            style={{ scale, opacity, filter: blur }} 
            className="absolute z-20 w-full max-w-5xl px-4 pointer-events-none will-change-[transform,opacity] transform-gpu"
        >
            <HoloCard className="pointer-events-auto shadow-2xl">
              <div className="p-6 md:p-16 w-full relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-16 items-center h-full">
                  <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#007BFF]/5 blur-[60px] md:blur-[100px] pointer-events-none" />
                  
                  <div className="font-heading text-5xl md:text-[8rem] font-black text-transparent opacity-30 md:opacity-40 leading-none shrink-0" style={{ WebkitTextStroke: '1px #007BFF' }}>
                      {item.id}
                  </div>
                  
                  <div className="flex flex-col gap-4">
                      <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase text-white tracking-tighter">
                        <NeuralText>{item.title}</NeuralText>
                      </h3>
                      <p className="font-inter font-light text-xl md:text-2xl text-white/50 leading-relaxed">
                        {item.desc}
                      </p>
                  </div>
              </div>
            </HoloCard>
        </motion.div>
    );
};

const TechDeepLayer = ({ progress, onSelect }: { progress: any, onSelect: (idx: number) => void }) => {
    const start = 0.82;
    const peak = 0.88;
    const stay = 0.94;
    const fade = 0.98;
    const end = 1.0;

    const scale = useTransform(progress, (v: number) => {
        if (v < start) return 0.5;
        if (v <= peak) return 0.5 + (0.5 * ((v - start)/(peak - start)));
        if (v <= stay) return 1;
        if (v <= fade) return 1 + (0.5 * ((v - stay)/(fade - stay)));
        return 1.5;
    });

    const opacity = useTransform(progress, (v: number) => {
        if (v < start) return 0;
        if (v <= peak) return Math.min(1, (v - start)/(peak - start));
        if (v <= stay) return 1;
        if (v <= fade) return Math.max(0, 1 - ((v - stay)/(fade - stay)));
        return 0;
    });

    const blur = useTransform(progress, (v: number) => {
        if (v < start) return 'blur(20px)';
        if (v <= peak) return `blur(${Math.max(0, 20 - 20 * ((v - start)/(peak - start)))}px)`;
        if (v <= stay) return 'none';
        if (v <= fade) return `blur(${Math.min(20, 20 * ((v - stay)/(fade - stay)))}px)`;
        return 'blur(20px)';
    });

    const pointerEvents = useTransform(progress, (v: number) => {
        return (v > peak && v < stay) ? 'auto' : 'none';
    });

    return (
        <motion.div 
            style={{ scale, opacity, filter: blur, pointerEvents }} 
            className="absolute z-30 w-full max-w-7xl px-4 flex flex-col items-center will-change-[transform,opacity] transform-gpu"
        >
            
            <h3 className="font-heading text-4xl sm:text-5xl md:text-[6rem] uppercase text-white font-black leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(0,123,255,0.15)] mb-12 text-center">
               Стек Технологий
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl px-2">
               {cards.map((card, idx) => (
                   <HoloCard key={idx} onClick={() => onSelect(idx)}>
                        <div className="flex flex-col p-6 md:p-10 lg:p-12 h-full min-h-[200px] md:min-h-[400px] hover:border-[#007BFF]/40 transition-all duration-500 overflow-hidden group-hover:bg-[#007BFF]/[0.05] rounded-[1.5rem] md:rounded-[calc(2rem-1px)]">
                             
                             <div className="flex justify-between items-start mb-4 md:mb-10 relative z-10 w-full flex-shrink-0">
                               <div className="p-3 md:p-4 bg-black/60 border border-[#007BFF]/30 rounded-xl md:rounded-2xl group-hover:bg-[#007BFF]/30 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] scale-90 md:scale-100">
                                 {card.icon}
                               </div>
                               <span className="font-mono text-[10px] md:text-sm uppercase tracking-widest text-[#555] group-hover:text-[#007BFF] transition-colors mt-2">0{idx + 1}</span>
                             </div>
                             
                             <h4 className="font-heading text-xl md:text-2xl lg:text-3xl text-white uppercase tracking-tighter font-bold relative z-10 mb-4 md:mb-6 leading-none flex-shrink-0">
                                {card.category}
                             </h4>

                             <div className="hidden md:flex flex-col gap-3 relative z-10 flex-grow">
                               {card.items.slice(0, 4).map((item, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 bg-[#007BFF] rounded-full opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#007BFF] transition-all" />
                                   <span className="font-inter font-light text-base lg:text-lg text-[#888] group-hover:text-white transition-colors duration-300">
                                     {item}
                                   </span>
                                 </div>
                               ))}
                             </div>

                             <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-white/10 flex items-center justify-between relative z-10 w-full group-hover:border-[#007BFF]/30 transition-colors flex-shrink-0">
                               <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666] group-hover:text-[#00FFFF] transition-colors">Подробности</span>
                               <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#444] group-hover:text-[#00FFFF] group-hover:translate-x-2 transition-all" />
                             </div>
                        </div>
                   </HoloCard>
               ))}
            </div>
        </motion.div>
    );
};

export const TerminalDepths = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    
    const progStr = useTransform(scrollYProgress, (v: number) => (v * 100).toFixed(1) + "%");
   
    const [selectedTech, setSelectedTech] = useState<number | null>(null);

    useEffect(() => {
        if (selectedTech !== null) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [selectedTech]);

    return (
      <section ref={containerRef} className="relative h-[900vh] bg-transparent z-20">
          
          {/* Scroll Anchors */}
          <div id="about" className="absolute top-0 w-full h-px pointer-events-none" />
          <div id="manifesto" className="absolute top-[300vh] w-full h-px pointer-events-none" />
          <div id="tech" className="absolute top-[600vh] w-full h-px pointer-events-none" />

          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1200px]">
             
             <AboutDeepLayer progress={scrollYProgress} />
             {manifestoItems.map((item, i) => (
                <ManifestoDeepCard key={item.id} item={item} progress={scrollYProgress} index={i} />
             ))}
             <TechDeepLayer progress={scrollYProgress} onSelect={setSelectedTech} />

          </div>

          <AnimatePresence>
            {selectedTech !== null && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[#000]/90 backdrop-blur-2xl"
                onClick={() => setSelectedTech(null)}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full max-w-4xl max-h-[90vh] overflow-visible relative flex flex-col" 
                  onClick={e => e.stopPropagation()}
                >
                    {/* Fixed Close Button for reliability and accessibility */}
                    <motion.button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedTech(null);
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        setSelectedTech(null);
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-8 z-[100] group p-3 cursor-pointer outline-none"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close tech modal"
                    >
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <span className="absolute w-8 h-[2px] bg-white group-hover:bg-cyan-400 transform rotate-45 transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]"></span>
                        <span className="absolute w-8 h-[2px] bg-white group-hover:bg-cyan-400 transform -rotate-45 transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]"></span>
                      </div>
                    </motion.button>

                    <HoloCard className="w-full h-full flex-grow">
                        <div className="bg-[#0A0A0A]/95 p-4 sm:p-8 md:p-16 w-full relative flex flex-col h-full backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2rem] overflow-y-auto no-scrollbar shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-50" />
                            
                            <div className="flex-1 mt-10 md:mt-0 relative z-10 w-full">
                                <div className="font-mono text-cyan-400 text-[10px] md:text-sm tracking-[0.2em] mb-4 md:mb-6 uppercase opacity-80">
                                   Unit 0{selectedTech + 1}
                                </div>
                                <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl uppercase font-black text-white mb-6 md:mb-10 tracking-tighter leading-tight md:leading-none text-balance">
                                   {cards[selectedTech].category}
                                </h3>
                                
                                <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12">
                                  {cards[selectedTech].items.map((item, i) => (
                                      <span key={i} className="px-3 md:px-5 py-1.5 md:py-2.5 border border-white/10 text-white/50 bg-white/5 rounded-full font-mono text-[10px] md:text-base tracking-wide hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all">
                                      {item}
                                      </span>
                                  ))}
                                </div>

                                <p className="font-inter font-light text-base sm:text-xl md:text-2xl text-white/60 leading-relaxed max-w-3xl pb-10 md:pb-0">
                                   {cards[selectedTech].details}
                                </p>
                            </div>
                        </div>
                    </HoloCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
      </section>
    );
};
