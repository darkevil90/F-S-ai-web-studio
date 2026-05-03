import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Monitor, Cpu, Server, ChevronRight } from 'lucide-react';

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
                F&S Studio — <span className="font-bold text-[#007BFF]">инженерный</span> подход к эстетике.
            </h2>
            <p className="mt-8 text-xl sm:text-2xl md:text-3xl text-white/50 font-inter font-light max-w-4xl mx-auto leading-relaxed">
               Мы разрабатываем цифровые экосистемы, которые захватывают внимание с первых секунд. Наша специализация — иммерсивные интерфейсы, генеративный дизайн и сложные веб архитектуры.
            </p>
        </motion.div>
    );
};

const ManifestoDeepCard: React.FC<{ item: any, progress: any, index: number }> = ({ item, progress, index }) => {
    const start = 0.20 + (index * 0.08);
    const peak = start + 0.06;
    const fade = peak + 0.06;
    const end = fade + 0.04;

    const scale = useTransform(progress, (v: number) => {
        if (v < start) return 0.2;
        if (v < peak) return 0.2 + (0.8 * ((v - start)/(peak - start)));
        if (v < end) return 1 + (2 * ((v - peak)/(end - peak)));
        return 3;
    });

    const opacity = useTransform(progress, (v: number) => {
        if (v < start) return 0;
        if (v < peak) return (v - start)/(peak - start);
        if (v < fade) return 1;
        if (v < end) return Math.max(0, 1 - ((v - fade)/(end - fade)));
        return 0;
    });

    const blur = useTransform(progress, (v: number) => {
        if (v < start) return 'blur(30px)';
        if (v < peak) return `blur(${Math.max(0, 30 - 30 * ((v - start)/(peak - start)))}px)`;
        if (v < fade) return 'blur(0px)';
        if (v < end) return `blur(${Math.min(40, 40 * ((v - fade)/(end - fade)))}px)`;
        return 'blur(40px)';
    });

    return (
        <motion.div style={{ scale, opacity, filter: blur }} className="absolute z-20 w-full max-w-5xl px-4 pointer-events-none">
            <div className="bg-[#0A0A0A]/80 border border-[#007BFF]/20 p-8 md:p-16 rounded-[2rem] w-full relative shadow-[0_0_50px_rgba(0,123,255,0.1)] backdrop-blur-3xl overflow-hidden flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#007BFF]/10 blur-[100px] pointer-events-none" />
                 
                 <div className="font-heading text-6xl md:text-[8rem] font-black text-transparent opacity-40 leading-none shrink-0" style={{ WebkitTextStroke: '2px #007BFF' }}>
                    {item.id}
                 </div>
                 
                 <div className="flex flex-col gap-4">
                    <h3 className="font-heading text-3xl md:text-5xl font-bold uppercase text-white tracking-tighter">
                      {item.title}
                    </h3>
                    <p className="font-inter font-light text-xl md:text-2xl text-white/50 leading-relaxed">
                      {item.desc}
                    </p>
                 </div>
            </div>
        </motion.div>
    );
};

import { HoloCard } from './components/HoloCard';

const TechDeepLayer = ({ progress, onSelect }: { progress: any, onSelect: (idx: number) => void }) => {
    const start = 0.55;
    const peak = 0.70;
    const fade = 0.85;
    const end = 0.95;

    const scale = useTransform(progress, (v: number) => {
        if (v < start) return 0.2;
        if (v <= peak) return 0.2 + (0.8 * ((v - start)/(peak - start)));
        if (v <= fade) return 1;
        if (v <= end) return 1 + (1.5 * ((v - fade)/(end - fade)));
        return 2.5;
    });

    const opacity = useTransform(progress, (v: number) => {
        if (v < start) return 0;
        if (v <= peak) return Math.min(1, (v - start)/(peak - start));
        if (v <= fade) return 1;
        if (v <= end) return Math.max(0, 1 - ((v - fade)/(end - fade)));
        return 0;
    });

    const blur = useTransform(progress, (v: number) => {
        if (v < start) return 'blur(40px)';
        if (v <= peak) return `blur(${Math.max(0, 40 - 40 * ((v - start)/(peak - start)))}px)`;
        if (v <= fade) return 'blur(0px)';
        if (v <= end) return `blur(${Math.min(30, 30 * ((v - fade)/(end - fade)))}px)`;
        return 'blur(30px)';
    });

    const pointerEvents = useTransform(progress, (v: number) => {
        return (v > peak && v < fade) ? 'auto' : 'none';
    });

    return (
        <motion.div style={{ scale, opacity, filter: blur, pointerEvents }} className="absolute z-30 w-full max-w-7xl px-4 flex flex-col items-center">
            
            <h3 className="font-heading text-4xl sm:text-5xl md:text-[6rem] uppercase text-white font-black leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(0,123,255,0.15)] mb-12 text-center">
               Стек Технологий
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
               {cards.map((card, idx) => (
                   <HoloCard key={idx} onClick={() => onSelect(idx)}>
                        <div className="flex flex-col p-8 lg:p-12 h-full min-h-[400px] hover:border-[#007BFF]/40 transition-all duration-500 overflow-hidden group-hover:bg-[#007BFF]/[0.05] rounded-[calc(2rem-1px)]">
                             
                             <div className="flex justify-between items-start mb-10 relative z-10 w-full flex-shrink-0">
                               <div className="p-4 bg-black/60 border border-[#007BFF]/30 rounded-2xl group-hover:bg-[#007BFF]/30 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                 {card.icon}
                               </div>
                               <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#555] group-hover:text-[#007BFF] transition-colors mt-2">0{idx + 1}</span>
                             </div>
                             
                             <h4 className="font-heading text-2xl lg:text-3xl text-white uppercase tracking-tighter font-bold relative z-10 mb-6 leading-none flex-shrink-0">
                                {card.category}
                             </h4>

                             <div className="flex flex-col gap-3 relative z-10 flex-grow">
                               {card.items.slice(0, 4).map((item, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 bg-[#007BFF] rounded-full opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#007BFF] transition-all" />
                                   <span className="font-inter font-light text-base lg:text-lg text-[#888] group-hover:text-white transition-colors duration-300">
                                     {item}
                                   </span>
                                 </div>
                               ))}
                             </div>

                             <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative z-10 w-full group-hover:border-[#007BFF]/30 transition-colors flex-shrink-0">
                               <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#666] group-hover:text-[#00FFFF] transition-colors">Подробности</span>
                               <ChevronRight className="w-5 h-5 text-[#444] group-hover:text-[#00FFFF] group-hover:translate-x-2 transition-all" />
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

          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-[1200px]" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
             
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_90%)] pointer-events-none" />

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
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[#050505]/95 backdrop-blur-xl"
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
