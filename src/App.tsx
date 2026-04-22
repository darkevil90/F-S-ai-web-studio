import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
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

const StaggeredText = ({ text, className, as: Component = "h1" }: { text: string; className?: string, as?: any }) => {
  const words = text.split(" ");
  return (
    <Component className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-3 mb-2">
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent z-10">
      <div className="relative w-full max-w-6xl px-6 flex flex-col justify-center h-full pt-24 md:pt-32">
        <div className="max-w-4xl">
          <StaggeredText 
            as="h1"
            text="Пространство будущего"
            className="text-4xl md:text-6xl lg:text-8xl font-bold font-heading text-white tracking-tight uppercase leading-[0.9] mb-8 break-words"
          />
          
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[#666666] font-inter text-lg md:text-2xl lg:text-3xl max-w-2xl leading-relaxed mb-12 border-l-2 border-[#007BFF] pl-4 md:pl-6"
          >
            Дизайн-инженерия нового поколения: где каждый пиксель обоснован алгоритмом.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <MagneticButton onClick={scrollToContacts}>
              <motion.div 
                animate={{ 
                  boxShadow: ["0px 0px 0px 0px rgba(0,123,255,0)", "0px 0px 20px 4px rgba(0,123,255,0.6)", "0px 0px 0px 0px rgba(0,123,255,0)"],
                  borderColor: ["rgba(0,123,255,0.3)", "rgba(0,123,255,1)", "rgba(0,123,255,0.3)"]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="group relative inline-flex items-center gap-4 px-6 md:px-8 py-3 md:py-4 bg-[#007BFF]/5 border border-[#007BFF]/50 rounded-full overflow-hidden transition-all"
              >
                <div className="absolute inset-0 bg-[#007BFF] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="font-heading text-base md:text-lg tracking-wide uppercase text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)] transition-all">
                  Обсудить проект →
                </span>
              </motion.div>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 2. Блок: About (О студии)
const AboutSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section id="about" ref={ref} className="relative min-h-screen py-20 md:py-32 flex items-center bg-[#050505] overflow-hidden perspective-1000 z-20">
      {/* Background lens grid */}
      <motion.div 
        style={{ y: yBg, rotateX: "10deg", scale: 1.1 }} 
        className="absolute inset-0 bg-grid-pattern opacity-30 transform-gpu origin-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      
      <motion.div 
        style={{ y: yText }} 
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-2xl md:text-4xl lg:text-5xl font-inter leading-[1.4] text-white font-light"
          >
            <span className="font-heading font-semibold text-[#007BFF]">F & S</span> — это симбиоз визуального искусства и нейронных вычислений. Мы проектируем цифровые миры, которые не просто выглядят красиво, а <span className="text-[#666666] italic">взаимодействуют на уровне инстинктов</span>.<br/><br/>
            Наша специализация — иммерсивные интерфейсы и генеративный дизайн.
          </motion.h2>
        </div>
      </motion.div>
    </section>
  );
};

// 3. Блок: Manifesto (Манифест)
const ManifestoSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const clipPathObject = useTransform(scrollYProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  return (
    <section id="manifesto" ref={ref} className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-[#050505] z-20">
      {/* Huge F & S background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-5 pointer-events-none select-none">
        <span className="font-heading text-[40vw] font-black leading-none text-white blur-[2px]">F&S</span>
      </div>

      <div className="relative z-10 max-w-7xl px-6 text-center">
        <h2 className="text-4xl md:text-7xl lg:text-[7rem] font-heading font-black uppercase mb-12 tracking-tight flex flex-wrap justify-center items-center gap-2 md:gap-4">
          <span>Интеллект</span> <span className="text-[#007BFF] mix-blend-screen">×</span> <span>Чистый разум</span>
        </h2>
        
        <div className="relative mx-auto text-xl md:text-4xl lg:text-6xl font-inter leading-[1.3] font-semibold">
          {/* Base muted text */}
          <p className="text-[#666666]">
            Мы не рисуем сайты, мы строим когнитивные мосты. Дизайн будущего — это не оболочка, это живая структура, управляемая логикой и эстетикой.
          </p>
          
          {/* Highlighted text mapped to scroll via clip-path */}
          <motion.p 
            style={{ clipPath: clipPathObject }}
            className="absolute top-0 left-0 w-full text-[#007BFF] drop-shadow-[0_0_30px_rgba(0,123,255,0.4)]"
          >
            Мы не рисуем сайты, мы строим когнитивные мосты. Дизайн будущего — это не оболочка, это живая структура, управляемая логикой и эстетикой.
          </motion.p>
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
      category: "Frontend", 
      items: ["Next.js", "Three.js", "GSAP", "React", "Framer Motion"],
      details: "Формируем визуальную часть с использованием передовых frontend-фреймворков и библиотек для 3D графики и плавной анимации. Каждый элемент оптимизирован для достижения 60 FPS на всех устройствах."
    },
    { 
      category: "AI & Design", 
      items: ["Google AI Studio", "Stitch", "Antigravity", "Figma", "Midjourney"],
      details: "Интегрируем генеративный ИИ в пайплайн проектирования. Автоматизируем рутину, генерируем визуальные концепты и программируем когнитивные узлы для интеллектуальных интерфейсов."
    },
    { 
      category: "Backend & Ops", 
      items: ["Node.js", "Vercel", "Firebase"],
      details: "Строим надежные серверные решения и масштабируемые бессерверные архитектуры. Обеспечиваем высокую производительность, безопасность и безупречный деплой для каждого продукта."
    }
  ];

  return (
    <section id="tech" className="relative py-20 md:py-32 bg-transparent overflow-hidden flex items-center min-h-screen z-10">
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center gap-16">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl lg:text-7xl uppercase text-white font-bold text-center"
          >
            [ Технологии ]
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {cards.map((card, idx) => (
              <div key={idx} onClick={() => setSelectedTech(idx)} className="cursor-pointer">
                <TiltCard className="h-full">
                  <div className="flex flex-col justify-between p-6 md:p-10 h-full min-h-[250px] md:min-h-[350px] rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] group-hover:border-[#007BFF]/50 transition-all duration-300">
                    
                    <div className="absolute inset-0 bg-[#007BFF]/0 group-hover:bg-[#007BFF]/10 blur-xl transition-all duration-500 rounded-3xl pointer-events-none" />

                    <h4 className="font-heading text-xl md:text-2xl text-[#666666] group-hover:text-white transition-colors duration-300 uppercase tracking-widest relative z-10">
                      {card.category}
                    </h4>
                    
                    <div className="flex flex-col gap-3 mt-8 relative z-10">
                      {card.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="font-mono text-lg md:text-xl lg:text-3xl text-white font-medium group-hover:text-[#007BFF] transition-colors duration-300">
                          {item}
                        </span>
                      ))}
                      {card.items.length > 3 && (
                        <span className="font-mono text-sm text-[#666666] mt-2 group-hover:text-white transition-colors">+ Подробнее</span>
                      )}
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
            style={{ perspective: 1200 }}
            onClick={() => setSelectedTech(null)}
          >
            <motion.div 
              initial={{ scale: 0.4, opacity: 0, z: -400, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, z: 0, rotateX: 0 }}
              exit={{ scale: 0.4, opacity: 0, z: -400, rotateX: -15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="bg-black/90 border border-white/10 p-8 md:p-12 rounded-3xl w-full max-w-3xl relative max-h-[75vh] md:max-h-[85vh] overflow-y-auto overscroll-contain shadow-[0_0_50px_rgba(0,123,255,0.05)] ring-1 ring-white/5 flex flex-col"
            >
              
              <div className="flex-1 mt-2 md:mt-0">
                <h3 className="font-heading text-3xl md:text-5xl uppercase text-white mb-6 pr-12 md:pr-0">
                  {cards[selectedTech].category}
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
                  {cards[selectedTech].items.map((item, i) => (
                    <span key={i} className="px-4 py-2 border border-[#007BFF]/30 text-[#007BFF] bg-[#007BFF]/5 rounded-full font-mono text-sm md:text-base">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="font-inter text-lg text-[#aaa] leading-relaxed mb-16">
                  {cards[selectedTech].details}
                </p>
              </div>

              {/* Pushed to bottom of the content flow */}
              <div className="w-full flex justify-center mt-auto pt-6 border-t border-white/5">
                <motion.button 
                  onClick={() => setSelectedTech(null)}
                  className="relative w-12 h-12 flex items-center justify-center group z-50 cursor-pointer"
                  aria-label="Закрыть"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <span className="absolute w-full h-[2px] bg-[#007BFF] drop-shadow-[0_0_12px_rgba(0,123,255,0.9)] transform rotate-45 group-hover:bg-white group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-300"></span>
                    <span className="absolute w-full h-[2px] bg-[#007BFF] drop-shadow-[0_0_12px_rgba(0,123,255,0.9)] transform -rotate-45 group-hover:bg-white group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-300"></span>
                    {/* Energy core light on hover */}
                    <span className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_15px_white] scale-0 group-hover:scale-100"></span>
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
  
  // Use mapping functions to avoid Web Animations API WAAPI out-of-bounds offset errors
  const scale = useTransform(progress, (v: number) => {
    const min = center - 0.35;
    const max = center + 0.35;
    if (v <= min || v >= max) return 0.75;
    if (v < center) return 0.75 + ((v - min) / (center - min)) * 0.25;
    return 1 - ((v - center) / (max - center)) * 0.25;
  });

  const rotateY = useTransform(progress, (v: number) => {
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

  return (
    <div className="w-screen h-[100dvh] flex items-center justify-center p-4 md:p-6 shrink-0 relative" style={{ perspective: 1200 }}>
      <motion.div
        style={{ scale, rotateY, opacity, transformStyle: "preserve-3d" }}
        className={`relative w-full max-w-6xl h-[70vh] md:h-[65vh] rounded-3xl border ${proj.isFuture ? 'border-[#007BFF]/50' : 'border-white/10'} flex flex-col justify-between overflow-hidden group ${proj.bgClass}`}
      >
        {/* Optional overlay for the future block */}
        {proj.isFuture && <div className="absolute inset-0 bg-[#007BFF]/10 blur-3xl opacity-50 pointer-events-none" />}

        <div className="relative z-10 p-6 md:p-12 flex justify-between items-start">
          <div>
            <h3 className="font-heading text-3xl md:text-5xl lg:text-7xl uppercase font-black text-white drop-shadow-2xl z-10 relative break-words">
              {proj.title}
            </h3>
            <p className="mt-4 font-mono text-[#666666] text-sm md:text-base lg:text-2xl uppercase tracking-widest">{proj.description}</p>
          </div>
        </div>
        
        <div className="relative z-10 p-6 md:p-12 border-t border-white/10 bg-black/50 backdrop-blur-md">
          {proj.isFuture ? (
            <a href={proj.link} target="_blank" rel="noreferrer" className="font-mono text-[#007BFF] text-lg md:text-xl lg:text-4xl hover:underline break-all">
              Написать в Telegram → @Darkstoic
            </a>
          ) : (
            <a href={`https://${proj.domain}`} target="_blank" rel="noreferrer" className="font-mono text-white hover:text-[#007BFF] transition-colors text-lg md:text-xl lg:text-3xl underline underline-offset-4 break-all">
              {proj.domain}
            </a>
          )}
        </div>
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
      bgClass: "bg-gradient-to-br from-purple-900/40 to-[#050505]",
      isFuture: false
    },
    {
      title: "Web Studio",
      domain: "adizovstudio.ru",
      description: "Чистый корпоративный AI-стиль",
      bgClass: "bg-grid-pattern",
      isFuture: false
    },
    {
      title: "Tech Store",
      domain: "istore34.ru",
      description: "Премиальный ритейл",
      bgClass: "bg-[radial-gradient(circle_at_top_right,_#222_0%,_#050505_100%)]",
      isFuture: false
    },
    {
      title: "Место для вашего проекта",
      domain: "Инициализировать соединение",
      description: "Станьте частью будущего",
      bgClass: "bg-[#007BFF]/5",
      isFuture: true,
      link: "https://t.me/Darkstoic"
    }
  ];

  return (
    <section id="projects" ref={targetRef} className="relative h-[400vh] bg-transparent z-10">
      {/* Sticky container matching screen height */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden w-full">
        
        {/* Floating title above the timeline */}
        <div className="absolute top-8 md:top-20 left-4 md:left-6 z-50 pointer-events-none">
          <h2 className="font-heading text-3xl md:text-5xl text-white uppercase font-bold tracking-tight opacity-50">Избранные кейсы</h2>
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
      role: "Lead Web-Designer / AI Engineer",
      tg: "@Darkstoic",
      tgLink: "https://t.me/Darkstoic",
      phone: "+79998987849",
      email: "adizov.farrux@gmail.com"
    },
    {
      name: "Сергей Олейников",
      role: "AI Architect / Developer",
      tg: "@sergei_oleinikov",
      tgLink: "https://t.me/sergei_oleinikov",
      phone: "+79020930167",
      email: "sergey0leynikov@yandex.ru"
    }
  ];

  return (
    <section id="contacts" className="py-20 md:py-32 bg-transparent min-h-screen flex items-center border-t border-[#111] z-10 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:mb-24">
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase text-white tracking-widest break-words">
            Архитекторы системы
          </h2>
          <div className="w-full h-px bg-white/10 mt-6 md:mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {contacts.map((c, i) => (
            <div 
              key={i}
              className="flex flex-col relative z-20"
            >
              <h3 className="font-heading text-2xl md:text-4xl font-semibold text-white mb-2">{c.name}</h3>
              <p className="font-inter text-[#666666] text-lg md:text-xl mb-8 md:mb-12">{c.role}</p>

              <div className="space-y-4 md:space-y-6 font-mono text-base md:text-lg">
                <MagneticButton>
                  <a href={c.tgLink} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white hover:text-[#007BFF] transition-colors">
                    <span className="text-[#666666]">TG:</span> {c.tg}
                  </a>
                </MagneticButton>
                <div className="w-full h-px bg-white/5" />
                
                <MagneticButton>
                  <a href={`tel:${c.phone}`} className="flex items-center gap-4 text-white hover:text-[#007BFF] transition-colors">
                    <span className="text-[#666666]">Тел:</span> {c.phone}
                  </a>
                </MagneticButton>
                <div className="w-full h-px bg-white/5" />

                <MagneticButton>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-4 text-white hover:text-[#007BFF] transition-colors">
                    <span className="text-[#666666]">Email:</span> {c.email}
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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const menuItems = [
    { name: "01 // Главная", shortName: "Главная", id: "hero" },
    { name: "02 // О студии", shortName: "Студия", id: "about" },
    { name: "03 // Манифест", shortName: "Манифест", id: "manifesto" },
    { name: "04 // Технологии", shortName: "Технологии", id: "tech" },
    { name: "05 // Кейсы", shortName: "Кейсы", id: "projects" },
    { name: "06 // Инженеры", shortName: "Контакты", id: "contacts" }
  ];

  const handleScrollTo = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      scrollToElement(id);
    }, 600); // Increased timeout to wait for the extremely smooth exit animation
  };

  const handleDesktopScrollTo = (id: string) => {
    scrollToElement(id);
  };

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // makes the scroll feel heavier and more premium
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // trigger exactly when an element crosses the middle 20% vertical space of the screen
      { threshold: 0, rootMargin: "-40% 0px -40% 0px" } 
    );

    menuItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  return (
    // Solved X-axis scroll jumps without breaking top/sticky logic
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#007BFF] selection:text-white scroll-smooth w-full relative overflow-clip">
      
      {/* Desktop Global Navigation (Floating Pill) */}
      <div className="hidden md:block fixed top-8 left-1/2 -translate-x-1/2 z-[11000]">
        <div className="bg-[#111]/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleDesktopScrollTo(item.id)}
              className={`relative px-5 py-2.5 rounded-full font-mono text-xs xl:text-sm uppercase tracking-widest transition-colors ${
                activeSection === item.id ? 'text-white' : 'text-[#666] hover:text-[#aaa]'
              }`}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-[#007BFF]/10 border border-[#007BFF]/50 rounded-full shadow-[0_0_15px_rgba(0,123,255,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavGlow"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#007BFF] drop-shadow-[0_0_8px_rgba(0,123,255,1)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.shortName}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Global Navigation (Burger Button completely borderless) */}
      <div className="fixed top-6 right-6 md:hidden z-[11000]">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-12 h-12 flex flex-col items-center justify-center gap-2 group outline-none"
        >          
          <motion.div 
            animate={isMenuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
            className={`w-8 h-[2px] ${isMenuOpen ? 'bg-white' : 'bg-[#007BFF]'} origin-center transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]`} 
          />
          <motion.div 
            animate={isMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            className={`w-8 h-[2px] ${isMenuOpen ? 'bg-white' : 'bg-[#007BFF]'} transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]`} 
          />
          <motion.div 
            animate={isMenuOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
            className={`w-8 h-[2px] ${isMenuOpen ? 'bg-white' : 'bg-[#007BFF]'} origin-center transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]`} 
          />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[10500] bg-[#050505]/95 flex flex-col items-center justify-center p-6"
          >
            {/* Background decorative typography */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 0.05, filter: "blur(0px)" }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
            >
              <span className="font-heading text-[30vw] font-black leading-none text-white whitespace-nowrap">F & S</span>
            </motion.div>

            <nav className="relative z-10 w-full max-w-2xl flex flex-col justify-center items-center gap-6 md:gap-8">
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  initial={{ opacity: 0, y: 30, filter: "blur(15px)", scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    filter: "blur(10px)", 
                    transition: { duration: 0.4, delay: i * 0.03, ease: "easeOut" } 
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.1 + i * 0.06, 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={`font-mono text-2xl md:text-4xl uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                    activeSection === item.id 
                      ? "text-white" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <span className={activeSection === item.id ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" : ""}>
                    {item.name}
                  </span>
                  {/* Neon underline effect on hover AND active list item */}
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-[#007BFF] transition-all duration-500 drop-shadow-[0_0_10px_rgba(0,123,255,1)] ${
                    activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </motion.button>
              ))}
            </nav>
            
            {/* Contact links at menu bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(10px)", transition: { duration: 0.4, delay: 0 } }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-12 flex gap-8 font-mono text-sm md:text-base uppercase tracking-widest text-[#666]"
            >
              <a href="https://t.me/Darkstoic" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Telegram //</a>
              <a href="mailto:adizov.farrux@gmail.com" className="hover:text-white transition-colors">Email //</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

