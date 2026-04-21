import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { NeuralCore } from './components/NeuralCore';

/** --- UTILITY COMPONENTS --- */

const StaggeredText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={className}>
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
    </div>
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
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0">
        <NeuralCore />
      </div>
      
      {/* Heavy vignette mapping to space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050505_80%)] pointer-events-none z-[1]" />
      
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col justify-center h-full pt-20">
        <div className="max-w-4xl">
          <StaggeredText 
            text="Пространство будущего"
            className="text-5xl md:text-7xl lg:text-9xl font-bold font-heading text-white tracking-tight uppercase leading-[0.9] mb-8"
          />
          
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[#666666] font-inter text-xl md:text-2xl lg:text-3xl max-w-2xl leading-relaxed mb-12 border-l-2 border-[#007BFF] pl-6"
          >
            Дизайн-инженерия нового поколения: где каждый пиксель обоснован алгоритмом.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <MagneticButton onClick={scrollToContacts}>
              <div className="group relative inline-flex items-center gap-4 px-8 py-4 bg-transparent border border-[#007BFF]/50 rounded-full overflow-hidden hover:border-[#007BFF] transition-colors">
                <div className="absolute inset-0 bg-[#007BFF] opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="font-heading text-lg tracking-wide uppercase text-white">Обсудить проект →</span>
              </div>
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
    <section ref={ref} className="relative min-h-screen py-32 flex items-center bg-[#050505] overflow-hidden perspective-1000">
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
            className="text-3xl md:text-5xl lg:text-6xl font-inter leading-[1.4] text-white font-light"
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
    <section ref={ref} className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Huge F & S background letter */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-5 pointer-events-none select-none">
        <span className="font-heading text-[40vw] font-black leading-none text-white blur-[2px]">F&S</span>
      </div>

      <div className="relative z-10 max-w-7xl px-6 text-center">
        <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-heading font-black uppercase mb-12 tracking-tight">
          Интеллект <span className="text-[#007BFF] mix-blend-screen">×</span> Чистый разум
        </h2>
        
        <div className="relative mx-auto text-2xl md:text-5xl lg:text-6xl font-inter leading-[1.3] font-semibold">
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

// 4. Блок: Tech Stack (Двигатель)
const TechStackSection = () => {
  const cards = [
    { category: "Frontend", items: ["Next.js", "Three.js", "GSAP"] },
    { category: "AI & Design", items: ["Google AI Studio", "Stitch", "Antigravity"] }
  ];

  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden flex items-center min-h-screen">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center gap-16">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl lg:text-7xl uppercase text-white font-bold"
          >
            [ Двигатель ]
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            {cards.map((card, idx) => (
              <div key={idx}>
                <TiltCard className="h-full">
                  <div className="flex flex-col justify-between p-12 h-full min-h-[350px] rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] group-hover:border-[#007BFF]/50 transition-all duration-300">
                    
                    {/* Neon Glow beneath the content */}
                    <div className="absolute inset-0 bg-[#007BFF]/0 group-hover:bg-[#007BFF]/10 blur-xl transition-all duration-500 rounded-3xl pointer-events-none" />

                    <h4 className="font-heading text-xl md:text-3xl text-[#666666] group-hover:text-white transition-colors duration-300 uppercase tracking-widest relative z-10">
                      {card.category}
                    </h4>
                    
                    <div className="flex flex-col gap-4 mt-8 relative z-10">
                      {card.items.map((item, i) => (
                        <span key={i} className="font-mono text-2xl md:text-4xl lg:text-5xl text-white font-medium group-hover:text-[#007BFF] transition-colors duration-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ proj }: { proj: any }) => {
  return (
    <div className="w-screen h-full flex items-center justify-center p-6 shrink-0 relative">
      <div
        className={`relative w-full max-w-6xl h-[65vh] rounded-3xl border ${proj.isFuture ? 'border-[#007BFF]/50' : 'border-white/10'} flex flex-col justify-between overflow-hidden group glitch-hover ${proj.bgClass}`}
      >
        {/* Optional overlay for the future block */}
        {proj.isFuture && <div className="absolute inset-0 bg-[#007BFF]/10 blur-3xl opacity-50" />}

        <div className="relative z-10 p-8 md:p-16 flex justify-between items-start">
          <div>
            <h3 className="font-heading text-4xl md:text-7xl uppercase font-black text-white drop-shadow-2xl z-10 relative">
              {proj.title}
            </h3>
            <p className="mt-6 font-mono text-[#666666] text-lg lg:text-2xl uppercase tracking-widest">{proj.description}</p>
          </div>
        </div>
        
        <div className="relative z-10 p-8 md:p-16 border-t border-white/10 bg-black/50 backdrop-blur-md">
          {proj.isFuture ? (
            <a href={proj.link} target="_blank" rel="noreferrer" className="font-mono text-[#007BFF] text-2xl md:text-4xl hover:underline">
              Написать в Telegram → @Darkstoic
            </a>
          ) : (
            <span className="font-mono text-white/50 text-2xl md:text-3xl">{proj.domain}</span>
          )}
        </div>
      </div>
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
    <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
      {/* Sticky container matching screen height */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden w-full">
        
        {/* Floating title above the timeline */}
        <div className="absolute top-12 md:top-20 left-6 z-50 pointer-events-none">
          <h2 className="font-heading text-4xl md:text-6xl text-white uppercase font-bold tracking-tight opacity-50">Избранные кейсы</h2>
        </div>

        <motion.div style={{ x }} className="flex w-[400vw] h-full items-center">
          {projects.map((proj, i) => (
            <React.Fragment key={i}>
              <ProjectCard proj={proj} />
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
    <section id="contacts" className="py-32 bg-[#050505] min-h-screen flex items-center border-t border-[#111]">
      <div className="container mx-auto px-6">
        <div className="mb-24">
          <h2 className="font-heading text-5xl md:text-7xl font-bold uppercase text-white tracking-widest">
            Архитекторы системы
          </h2>
          <div className="w-full h-px bg-white/10 mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {contacts.map((c, i) => (
            <div 
              key={i}
              className="flex flex-col relative z-20"
            >
              <h3 className="font-heading text-3xl md:text-5xl font-semibold text-white mb-2">{c.name}</h3>
              <p className="font-inter text-[#666666] text-xl mb-12">{c.role}</p>

              <div className="space-y-6 font-mono text-lg md:text-xl">
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
  return (
    // Removed overflow-hidden or overflow-x-clip so Framer Motion useScroll respects window scroll
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#007BFF] selection:text-white scroll-smooth w-full">
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

