"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

import {
  Heart,
  Menu,
  X,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Copy,
  HeartHandshake,
  ShieldCheck,
  ArrowDownRight,
  Users,
  Star,
} from "lucide-react";

import { HeroTransition } from "./components/HeroTransition";
import { FormDonation } from "./components/form-donation";
import { OtherDonations } from "./components/OtherDonations";
// --- ГЛОБАЛЬНЫЕ ЭФФЕКТЫ ---

// 1. Пленочный шум

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.05] mix-blend-multiply">
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>

      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

// 2. Магнитная кнопка

const MagneticButton = ({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);

  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });

  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;

    const { height, width, left, top } = ref.current.getBoundingClientRect();

    const middleX = clientX - (left + width / 2);

    const middleY = clientY - (top + height / 2);

    x.set(middleX * 0.3);

    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// 3. Плавающие пятна

const LiquidBlob = ({
  color,
  size,
  top,
  left,
  right,
  delay = 0,
}: {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  delay?: number;
}) => (
  <motion.div
    className="absolute rounded-full opacity-60 mix-blend-multiply blur-[80px] pointer-events-none z-0"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top,
      left,
      right,
    }}
    animate={{
      x: [0, 50, -20, 0],
      y: [0, -40, 30, 0],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// --- НАВИГАЦИЯ ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 pt-6 px-6 md:px-12`}
      >
        <div className={`flex w-full items-center justify-between`}>
          <div
            onClick={() => scrollTo("hero")}
            className="group flex cursor-pointer items-center gap-3 relative h-16 sm:h-20 lg:h-24 w-auto"
          >
            <img
              src="/logo-dark.svg"
              alt="Дом Лобова"
              className={`h-16 sm:h-20 lg:h-24 w-auto object-contain transition-opacity duration-700 ${isScrolled ? "opacity-100" : "opacity-0"}`}
            />
            <img
              src="/logo-light.svg"
              alt="Дом Лобова"
              className={`absolute left-0 top-0 h-16 sm:h-20 lg:h-24 w-auto object-contain transition-opacity duration-700 ${isScrolled ? "opacity-0" : "opacity-100"}`}
            />
          </div>

          <div className="flex items-center gap-4">
            <MagneticButton
              onClick={() => scrollTo("donate")}
              className={`group hidden md:flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-700 ${isScrolled ? "bg-brand-orange text-white shadow-xl hover:shadow-brand-orange/40" : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white"}`}
            >
              <Heart className={`w-5 h-5 transition-colors duration-500 ${isScrolled ? "text-white" : "text-brand-orange group-hover:text-white"}`} />
              Поддержать
            </MagneticButton>

            <MagneticButton
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all duration-700 ${isScrolled ? "bg-brand-orange text-white shadow-xl hover:shadow-brand-orange/40" : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white"}`}
            >
              {isOpen ? <X /> : <Menu />}
            </MagneticButton>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-brand-orange px-6 text-brand-cream"
          >
            <div className="flex flex-col items-center gap-8 text-5xl sm:text-7xl font-serif font-medium">
              {["О нас", "Истории", "Нужды", "Контакты"].map((item, i) => (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  key={item}
                  onClick={() =>
                    scrollTo(["about", "stories", "funds", "contacts"][i])
                  }
                  className="hover:italic transition-all hover:scale-105"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- СЕКЦИИ ---

// 1. ГЕРОЙ (Mask Scroll Reveal)
const Hero = () => {
  return <HeroTransition />;
};

// 2. ИЗЯЩНЫЙ ПРОГРЕСС-БАР (Элегантная интеграция)

const ElegantProgress = () => {
  const goal = 3000000;
  const current = 1850000;
  const percent = (current / goal) * 100;

  const recentDonations = [
    { name: "Анна С.", amount: 5000, time: "10 мин назад", icon: "☀️" },
    { name: "Михаил В.", amount: 1000, time: "25 мин назад", icon: "✨" },
    { name: "ООО «Ромашка»", amount: 50000, time: "1 час назад", icon: "🏢" },
    { name: "Елена", amount: 500, time: "2 часа назад", icon: "🤍" },
    { name: "Аноним", amount: 3000, time: "3 часа назад", icon: "🕊️" },
    { name: "Алексей И.", amount: 2000, time: "4 часа назад", icon: "🌟" },
    { name: "Мария", amount: 1500, time: "5 часов назад", icon: "🌷" },
    { name: "Семья Петровых", amount: 10000, time: "7 часов назад", icon: "🤝" },
    { name: "Доброжелатель", amount: 800, time: "8 часов назад", icon: "💡" },
    { name: "Дарья", amount: 1200, time: "10 часов назад", icon: "🌱" },
  ];

  return (
    <section className="relative z-30 bg-brand-cream pb-32 pt-20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-5xl md:text-7xl font-black text-brand-brown tracking-tighter">
              ПОДАРИТЬ <span className="text-brand-orange italic">НАДЕЖДУ</span>
            </h2>
            <p className="mt-6 text-xl text-brand-brown-light font-medium leading-relaxed">
              Каждый ваш перевод — это кирпичик в строительстве большого и теплого дома.
              Мы собираем средства на работу сиделок, медикаменты и специализированное питание на ближайшие полгода.
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Progress Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 overflow-hidden rounded-[3rem] bg-brand-brown text-brand-cream p-8 md:p-14 relative flex flex-col justify-between group shadow-2xl shadow-brand-brown/10"
          >
            {/* Subtle bg decoration */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-orange/20 blur-[120px] rounded-full group-hover:bg-brand-orange/30 transition-all duration-1000 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-yellow/10 blur-[100px] rounded-full group-hover:bg-brand-yellow/20 transition-all duration-1000 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-md">
                    <Heart className="w-5 h-5 text-brand-orange" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/50">
                    Текущий сбор на спецпитание
                  </span>
                </div>
                
                <div className="flex flex-col mb-8 md:mb-12 relative z-10">
                  <div className="whitespace-nowrap leading-none">
                    <span className="font-serif lining-nums text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter drop-shadow-md align-baseline">
                      {current.toLocaleString("ru-RU")}
                    </span>
                    <span className="font-serif text-[7vw] sm:text-5xl md:text-6xl lg:text-7xl font-medium text-brand-orange opacity-90 drop-shadow-md ml-2 md:ml-3 align-baseline">
                      ₽
                    </span>
                  </div>
                  <span className="mt-4 text-xl md:text-2xl font-medium text-white/40">
                    из цели {goal.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>

              <div>
                {/* Thick Progress Bar */}
                <div className="relative h-12 md:h-16 w-full overflow-hidden rounded-full bg-brand-cream/10 border border-white/10 p-2 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="relative h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow flex items-center justify-end px-4 overflow-hidden shadow-lg shadow-brand-orange/20"
                  >
                    {/* Animated shine effect */}
                    <motion.div 
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                      className="absolute top-0 bottom-0 w-32 bg-white/30 skew-x-12 blur-sm"
                    />
                    <span className="text-white font-black text-sm md:text-base drop-shadow-md z-10">{Math.round(percent)}%</span>
                  </motion.div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="text-white/60 text-sm font-bold uppercase tracking-widest leading-relaxed">
                    <HeartHandshake className="inline-block w-4 h-4 mb-1 mr-2 text-brand-orange/70" />
                    Собранная сумма позволит нам <br className="hidden sm:block"/>
                    непрерывно оказывать помощь 6 месяцев.
                  </div>
                  <MagneticButton
                    onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full sm:w-auto bg-brand-orange hover:bg-white hover:text-brand-orange text-white transition-colors duration-500 rounded-full px-10 py-5 mx-auto md:mx-0 text-sm md:text-base font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 group shrink-0"
                  >
                    Сделать перевод <Heart className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Donations Block */}
          <div className="lg:col-span-4 relative min-h-[450px] lg:min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 rounded-[3rem] bg-white border border-brand-brown/5 shadow-[0_20px_60px_rgba(74,63,53,0.05)] p-8 md:p-10 flex flex-col overflow-hidden"
            >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-cream relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <HeartHandshake className="text-brand-orange w-8 h-8" strokeWidth={1.5} />
                <h3 className="font-serif text-3xl font-black text-brand-brown">Герои</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative z-10 -mx-2 px-2">
              <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-white to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none z-10" />
              
              <div className="h-full overflow-y-auto space-y-4 pr-3 scrollbar-thin scrollbar-thumb-brand-cream scrollbar-track-transparent">
                <AnimatePresence>
                  {recentDonations.map((donation, idx) => (
                    <div 
                      key={idx}
                      className="group flex flex-col gap-2 p-4 rounded-2xl hover:bg-brand-cream/80 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-xl shadow-sm border border-brand-brown/5 group-hover:-rotate-6 transition-transform">
                            {donation.icon}
                          </div>
                          <div>
                            <div className="font-bold text-brand-brown text-base">{donation.name}</div>
                            <div className="text-[10px] text-brand-brown-light font-bold uppercase tracking-widest mt-0.5">{donation.time}</div>
                          </div>
                        </div>
                        <div className="font-serif lining-nums font-black text-xl text-brand-orange tracking-tight">
                          +{donation.amount.toLocaleString("ru-RU")}
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
                {/* Spacer for bottom blur */}
                <div className="h-12 w-full" />
              </div>
            </div>
            
            <button className="hidden mt-4 w-full py-4 rounded-xl text-brand-brown-light font-bold uppercase tracking-widest text-xs hover:text-brand-orange hover:bg-brand-orange/5 transition-colors duration-300 border border-brand-cream group relative z-10">
              Смотреть все <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

// 3. ДРУГИЕ СБОРЫ (Swiper Carousel)

// БЕСКОНЕЧНАЯ ФОТО-ЛЕНТА (Visual Storytelling)

const PhotoMarquee = () => {
  const photos = [
    "/images/1.webp",
    "/images/2.webp",
    "/images/3.webp",
    "/images/4.webp",
    "/images/5.webp"
  ];

  // Дублируем массив в 4 раза, чтобы анимация сдвига на 50% работала абсолютно бесшовно
  const loopPhotos = [...photos, ...photos, ...photos, ...photos];

  return (
    <section className="relative z-40 bg-brand-cream py-6 md:py-8 overflow-hidden pointer-events-none">
      <div className="w-full flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 pointer-events-auto w-max px-3"
        >
          {loopPhotos.map((src, i) => (
            <div
              key={i}
              className="relative h-[250px] w-[350px] shrink-0 overflow-hidden rounded-[2rem] shadow-xl shadow-brand-brown/5 border border-brand-brown/5 group cursor-pointer"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover  transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// 4. О ПРОГРАММЕ (Awwwards Style V6)

const typingTextData = [
  "Мы", " ", "верим,", " ", "что", " ",
  { type: "img", src: "/images/1.webp", wClass: "w-[100px] md:w-[200px]", maxW: "250px", alt: "Забота" },
  " ", "каждый", " ", "человек", " ", "заслуживает", " ", "заботы,", " ", "тепла", " ", "и", " ", "искреннего", " ", "внимания,", " ",
  { type: "img", src: "/images/2.webp", wClass: "w-[80px] md:w-[160px]", maxW: "200px", alt: "Уважение" },
  " ", "независимо", " ", "от", " ", "того,", " ", "с", " ", "какими", " ", "испытаниями", " ", "он", " ", "столкнулся", " ", "на", " ", "своем", " ", "пути.", " ", "Вместе", " ", "мы", " ", "дарим", " ", "прежнюю", " ", "радость", " ", "жизни."
];

// Helper to calculate total count of items (chars + images) for mapping progress
const getTotalElementsProps = () => {
  let count = 0;
  typingTextData.forEach(item => {
    if (typeof item === 'string') {
      count += item.length;
    } else {
      count++;
    }
  });
  return { total: count };
};

const ScrollRevealChar = ({ children, progress, index, total }: any) => {
  // Map this character's specific progress window for a typing effect
  // We want characters to appear fully black suddenly, but we can do a very fast fade/blur
  const charProgressLength = 0.05; // 5% width to reveal (faster, tighter)
  const start = (index / total) * (1 - charProgressLength);
  const end = start + charProgressLength;
  
  // For typing effect: no Y movement, fast opacity and color change
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  // Use a subtle color shift from very light brown/transparent to solid brand-brown
  const color = useTransform(progress, [start, end], ["#c4b5a2", "#4A3F35"]);
  // Optional very slight blur for smoothness instead of movement
  const filter = useTransform(progress, [start, end], ["blur(2px)", "blur(0px)"]);

  return (
    <motion.span style={{ opacity, color, filter }} className="inline-block relative z-10 transition-colors">
      {children}
    </motion.span>
  );
};

const ScrollRevealImage = ({ item, progress, index, total }: any) => {
  const charProgressLength = 0.2;
  const start = (index / total) * (1 - charProgressLength);
  const end = Math.min(start + charProgressLength * 1.5, 1); // images take a bit longer
  
  // We remove maxWidth animation to prevent layout shifts.
  // The layout will reserve the space immediately.
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span 
      style={{ opacity, width: item.maxW }} // Fix width from the start
      className="inline-block h-[40px] md:h-[70px] rounded-[3rem] overflow-hidden align-middle shadow-md shadow-brand-brown/10 border-[3px] border-white mx-1 my-1"
    >
      <img src={item.src} className={`${item.wClass} h-full w-full object-cover`} alt={item.alt}/>
    </motion.span>
  );
};

const About = () => {
  const containerRef = useRef(null);
  
  // Parallax Collage Hooks
  const collageRef = useRef(null);
  const { scrollYProgress: collageProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(collageProgress, [0, 1], [300, -300]);
  const y2 = useTransform(collageProgress, [0, 1], [500, -500]);
  const y3 = useTransform(collageProgress, [0, 1], [200, -300]);
  const y4 = useTransform(collageProgress, [0, 1], [400, -600]);
  const collageScale = useTransform(collageProgress, [0.2, 0.8], [0.85, 1.1]);
  const collageOpacity = useTransform(collageProgress, [0.2, 0.5, 0.8], [0.5, 1, 0.8]);

  // Text Reveal Scroll (Typing effect mapped to scroll)
  const textRef = useRef(null);
  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    // Start revealing when the top of the text block is 80% down the screen
    // Finish revealing when the bottom of the text block is 40% down the screen
    offset: ["start 80%", "end 60%"],
  });

  const smoothProgress = useSpring(textProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { total: totalTextElements } = getTotalElementsProps();
  let elementCounter = 0;

  return (
    <section id="about" className="relative bg-brand-cream pt-0 pb-0 overflow-hidden z-10 text-brand-brown">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 relative z-20">
        <div className="flex flex-col gap-10 md:gap-16">
          
          {/* Header row (Стиль как у других секций - по центру) */}
          <div className="text-center">
            <div className="mb-6 inline-flex rounded-full bg-brand-orange-light/30 px-6 py-2 shadow-sm border border-brand-orange/10">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">
                АБСМНО "Дом Лобова"
              </span>
            </div>

            <h2 className="font-serif text-6xl font-black text-brand-brown md:text-8xl tracking-tighter mx-auto max-w-4xl">
              КТО <span className="text-brand-orange italic">МЫ</span> ТАКИЕ
            </h2>

            <p className="mt-8 text-lg md:text-xl font-medium text-brand-brown-light max-w-2xl mx-auto">
              Официальная благотворительная организация.
              100% прозрачность отчетов и абсолютное доверие.
            </p>
          </div>

          {/* Text inline image reveal */}
          <div ref={textRef} className="max-w-[1200px] mx-auto py-10 flex flex-col justify-center min-h-[50vh]">
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-[1.4] lg:leading-[1.4] font-medium text-brand-brown text-center md:text-left">
              {typingTextData.map((item, idx) => {
                if (typeof item === "string") {
                  return (
                    <span key={idx} className="inline-block whitespace-pre">
                      {item.split("").map((char, cIdx) => {
                        const currentIndex = elementCounter++;
                        // For pure spaces, we can just render them directly without animation
                        // this strongly prevents layout shifts.
                        if (char === " ") {
                           return <span key={cIdx}> </span>;
                        }
                        
                        return (
                          <ScrollRevealChar 
                            key={cIdx} 
                            progress={smoothProgress} 
                            index={currentIndex} 
                            total={totalTextElements}
                          >
                            {char}
                          </ScrollRevealChar>
                        );
                      })}
                    </span>
                  );
                } else {
                  const currentIndex = elementCounter++;
                  return (
                    <ScrollRevealImage 
                      key={idx} 
                      item={item} 
                      progress={smoothProgress} 
                      index={currentIndex} 
                      total={totalTextElements} 
                    />
                  );
                }
              })}
            </div>
          </div>

          {/* Morphing Parallax Collage: "Вместе мы сильнее" */}
          <div ref={collageRef} className="relative w-full h-[120vh] md:h-[100vh] mt-[-5vh]">
            <div className="sticky top-[10vh] md:top-[12vh] h-[70vh] md:h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-[3rem] bg-brand-orange text-brand-cream border border-brand-brown/10 shadow-2xl">
              
              <motion.div style={{ scale: collageScale, opacity: collageOpacity }} className="relative z-20 text-center px-4 w-full flex flex-col items-center">
                <h3 className="font-serif text-[15vw] sm:text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] drop-shadow-xl text-white mb-10">
                  ВМЕСТЕ<br/>
                  <span className="italic font-light text-brand-yellow">МЫ</span> СИЛЬНЕЕ
                </h3>
                
                <MagneticButton
                  onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-brand-cream text-brand-brown hover:bg-white transition-all duration-300 rounded-full px-10 py-5 text-sm md:text-base font-bold uppercase tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-3 overflow-hidden group"
                >
                  <span className="relative z-10">Помочь сейчас</span>
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 relative z-10">
                    <Heart className="w-4 h-4" />
                  </div>
                </MagneticButton>
              </motion.div>

              {/* Parallax Floating Images */}
              <motion.div style={{ y: y1 }} className="absolute z-10 w-[40vw] max-w-[300px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-6deg] left-[-5%] md:left-[5%] top-[5%] border-4 border-white/20">
                <img src="/images/3.webp" className="w-full h-full object-cover grayscale-[30%]" alt="Вместе"/>
              </motion.div>

              <motion.div style={{ y: y2 }} className="absolute z-30 w-[35vw] max-w-[250px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-[4deg] right-[-5%] md:right-[15%] bottom-[10%] border-4 border-white/20">
                <img src="/images/4.webp" className="w-full h-full object-cover grayscale-[30%]" alt="Мы"/>
              </motion.div>

              <motion.div style={{ y: y3 }} className="absolute z-10 w-[45vw] max-w-[350px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl rotate-[8deg] right-[-10%] md:right-[5%] top-[15%] border-4 border-white/20">
                <img src="/images/5.webp" className="w-full h-full object-cover grayscale-[30%]" alt="Сильнее"/>
              </motion.div>

              <motion.div style={{ y: y4 }} className="absolute z-30 w-[30vw] max-w-[200px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-12deg] left-[10%] md:left-[20%] bottom-[5%] border-4 border-white/20">
                <img src="/images/6.webp" className="w-full h-full object-cover grayscale-[30%]" alt="Помощь"/>
              </motion.div>

            </div>
          </div>

          {/* Refined Interactive Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-24 -mt-[25vh] md:-mt-[15vh] relative z-30 px-2 md:px-0">
            {[
              { 
                icon: HeartHandshake, 
                title: "Забота", 
                desc: "Мы окружаем теплом и чутким вниманием каждого подопечного, создавая домашнюю атмосферу.",
                color: "text-brand-orange",
                bgColor: "bg-[#FDFBF7]",
                img: "/images/1.webp",
              },
              { 
                icon: ShieldCheck, 
                title: "Доверие", 
                desc: "100% честная отчетность. Мы строим наши отношения на абсолютном доверии и открытости пожертвований.",
                color: "text-brand-yellow",
                bgColor: "bg-[#FDFBF7]",
                img: "/images/2.webp",
              },
              { 
                icon: Users, 
                title: "Семья", 
                desc: "Никто не должен оставаться один. Мы становимся настоящей семьей для тех, кто в ней нуждается.",
                color: "text-[#E07A5F]",
                bgColor: "bg-[#FDFBF7]",
                img: "/images/3.webp",
              },
              { 
                icon: Star, 
                title: "Поддержка", 
                desc: "Медицинская, психологическая и социальная помощь на каждом этапе жизни наших подопечных.",
                color: "text-[#81B29A]",
                bgColor: "bg-[#FDFBF7]",
                img: "/images/4.webp",
              }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                className={`group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] ${card.bgColor} border border-brand-brown/5 shadow-lg hover:shadow-xl transition-all duration-700 h-[320px] md:h-[380px] cursor-pointer transform-gpu will-change-transform`}
              >
                {/* Background Image Reveal on Hover */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] pointer-events-none transform-gpu">
                  <img src={card.img} className="w-full h-full object-cover scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] select-none will-change-transform backface-invisible" alt={card.title}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                
                {/* Card Content */}
                <div className="relative z-10 w-full h-full p-6 md:p-10 flex flex-col justify-between">
                  {/* Top: Icons */}
                  <div className="flex justify-between items-start">
                    <div className={`inline-flex rounded-full p-4 bg-white shadow-sm border border-brand-brown/5 ${card.color} group-hover:bg-white/20 group-hover:border-white/10 group-hover:text-white transition-all duration-700 group-hover:backdrop-blur-md`}>
                      <card.icon className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown/30 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white group-hover:-rotate-45 group-hover:backdrop-blur-md transition-all duration-500 delay-100">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>

                  {/* Bottom: Text */}
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <h4 className="font-serif text-2xl md:text-4xl font-black mb-2 md:mb-4 text-brand-brown group-hover:text-white transition-colors duration-500">
                      {card.title}
                    </h4>
                    <p className="text-base md:text-lg text-brand-brown-light leading-relaxed font-medium group-hover:text-white/90 transition-colors duration-500 md:line-clamp-none line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

// 5. ИСТОРИИ (Горизонтальный скролл)

const Stories = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: targetRef });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  const stories = [
    {
      name: "Мария Ивановна",
      age: "78 лет",
      quote:
        "Я думала, что осталась совсем одна. Но здесь мне вернули не только здоровье, но и семью.",
      img: "/images/1.webp",
      color: "bg-brand-yellow/30",
    },

    {
      name: "Алексей Сергеевич",
      age: "45 лет",
      quote:
        "Новая инвалидная коляска подарила мне возможность снова выходить на улицу и видеть небо.",
      img: "/images/2.webp",
      color: "bg-brand-orange-light/30",
    },

    {
      name: "Елена",
      age: "62 года",
      quote:
        "Спасибо сиделкам фонда. Без их круглосуточной поддержки мы бы не справились с болезнью мужа.",
      img: "/images/3.webp",
      color: "bg-brand-blue-light/30",
    },
  ];

  return (
    <section
      ref={targetRef}
      id="stories"
      className="relative h-[300vh] bg-brand-cream"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute left-6 top-24 z-10 md:left-12 md:top-32 mix-blend-darken">
          <h2 className="font-serif text-5xl font-black text-brand-brown md:text-7xl">
            РАДИ <span className="text-brand-orange italic">КОГО</span> <br />
            МЫ РАБОТАЕМ
          </h2>
        </div>

        <motion.div
          style={{ x }}
          className="flex w-[300vw] gap-8 px-6 pt-48 md:px-12 md:pt-32"
        >
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="relative flex h-[60vh] w-[85vw] shrink-0 flex-col overflow-hidden rounded-[3rem] bg-white border border-brand-brown/10 shadow-xl shadow-brand-orange/5 md:h-[65vh] md:w-[60vw] md:flex-row"
            >
              <div className="relative h-1/2 w-full md:h-full md:w-1/2 p-4 md:p-6">
                <div className="h-full w-full overflow-hidden rounded-[2rem]">
                  <img
                    src={story.img}
                    alt={``}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex h-1/2 w-full flex-col justify-center p-8 md:h-full md:w-1/2 md:p-12">
                <div
                  className={`mb-4 self-start rounded-full ${story.color} px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-brown`}
                >
                  {story.age}
                </div>

                <h3 className="mb-6 font-serif text-3xl font-bold text-brand-brown md:text-5xl">
                  {story.name}
                </h3>

                <p className="text-lg font-medium leading-relaxed text-brand-brown-light md:text-2xl">
                  «{story.quote}»
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// 6. НУЖДЫ (Залипающие карточки с БОЛЬШИМИ ИЛЛЮСТРАЦИЯМИ)

const FundsUsage = () => {
  const items = [
    {
      title: "Медикаменты и питание",
      num: "01",
      desc: "Специализированное питание, пеленки, противопролежневые средства и жизненно важные препараты.",
      color: "bg-[#F5EFE6]",
      img: "/images/4.webp",
      top: "top-24",
    },
    {
      title: "Оборудование",
      num: "02",
      desc: "Инвалидные коляски, многофункциональные кровати, кислородные концентраторы для облегчения жизни.",
      color: "bg-[#FFEAA7]",
      img: "/images/5.webp",
      top: "top-32",
    },
    {
      title: "Работа специалистов",
      num: "03",
      desc: "Оплата сложного труда профессиональных сиделок, врачей паллиативной помощи и психологов.",
      color: "bg-[#FFD1C1]",
      img: "/images/6.webp",
      top: "top-40",
    },
    {
      title: "Бытовые нужды",
      num: "04",
      desc: "Закупка чистящих средств, предметов гигиены, а также частичная оплата коммунальных услуг.",
      color: "bg-[#E2F0CB]",
      img: "/images/1.webp",
      top: "top-48",
    },
    {
      title: "Реабилитация и досуг",
      num: "05",
      desc: "Арт-терапия, восстановительные массажи, организация праздников и концертов.",
      color: "bg-[#C7CEEA]",
      img: "/images/2.webp",
      top: "top-56",
    },
    {
      title: "Развитие и комфорт",
      num: "06",
      desc: "Постоянное улучшение условий проживания: ремонт палат, обновление мебели и создание безопасной среды.",
      color: "bg-[#FDE1CD]",
      img: "/images/3.webp",
      top: "top-64",
    },
  ];

  return (
    <section
      id="funds"
      className="bg-[#F5F5F5] py-20 md:py-24 rounded-[3rem] md:rounded-[5rem] mx-2 md:mx-6 my-20 border border-brand-brown/5 shadow-sm"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="font-serif text-5xl font-black text-brand-brown md:text-7xl">
            НА ЧТО <span className="text-brand-orange italic">НУЖНЫ</span> СРЕДСТВА
          </h2>
        </div>

        <div className="relative pb-0">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`sticky ${item.top} mb-12 overflow-hidden rounded-[3rem] ${item.color} shadow-[0_-10px_30px_rgba(0,0,0,0.15)] h-auto md:h-[450px] transition-transform duration-500`}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Текстовая часть */}

                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                  <div className="font-serif text-6xl md:text-7xl font-black text-[#4A3F35]/15 mb-4 md:mb-6">
                    {item.num}
                  </div>

                  <h3 className="mb-3 md:mb-4 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#4A3F35]">
                    {item.title}
                  </h3>

                  <p className="text-lg md:text-xl font-medium text-[#4A3F35]/80">
                    {item.desc}
                  </p>
                </div>

                {/* Иллюстрация (Занимает ровно половину карточки) */}

                <div className="w-full md:w-1/2 h-[250px] md:h-full p-3 md:py-4 md:pr-4">
                  <div className="w-full h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                    <img
                      src={item.img}
                      alt={``}
                      className="w-full h-full object-cover transition-all duration-700 hover:grayscale-0 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7. ФОРМА ПОЖЕРТВОВАНИЯ

const DonationBlock = () => {
  return (
    <section id="donate" className="relative py-16 md:py-24 mb-10 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="mb-4 md:mb-6 inline-flex rounded-full bg-brand-orange-light/30 px-6 py-2">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Ваш вклад
            </span>
          </div>

          <h2 className="font-serif text-5xl font-black text-brand-brown md:text-8xl tracking-tighter">
            ВРЕМЯ <span className="text-brand-orange italic">ПОМОГАТЬ</span>
          </h2>
        </div>

        <FormDonation />
      </div>
    </section>
  );
};

// 8. КОНТАКТЫ И ФУТЕР

const Footer = () => {
  const requisites = [
    { label: "ОГРН", val: "1187627032548" },
    { label: "ИНН/КПП", val: "7609038927 / 760901001" },
    { label: "БИК", val: "044525225" },
    { label: "Расчетный счет", val: "40703810738000012829" },
    { label: "Корр. счет", val: "30101810400000000225" },
    { label: "Банк", val: "ПАО «Сбербанк России»" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: add a toast or indicator here
  };

  return (
    <footer
      id="contacts"
      className="relative bg-brand-brown pt-24 md:pt-40 pb-10 overflow-hidden text-brand-cream rounded-t-[3rem] md:rounded-t-[6rem]"
    >
      {/* Background oversized text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none opacity-[0.03] pointer-events-none select-none">
        <span className="font-serif text-[40vw] font-black whitespace-nowrap lg:ml-[-10%]">
          CONTACTS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20 mb-24 md:mb-32">
          
          {/* Left Column: Contacts */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-brand-orange px-6 py-2">
                 <span className="text-sm font-bold uppercase tracking-widest text-white">Приходите в гости</span>
              </div>
              <h2 className="font-serif text-5xl font-black md:text-7xl mb-8 leading-[0.9] tracking-tighter text-white">
                КОНТАКТЫ
              </h2>
              <div className="space-y-6 text-xl md:text-2xl font-medium text-white/80">
                <p className="max-w-md leading-relaxed">
                  Хоспис доступен для посещений каждый день, круглосуточно
                </p>
                <div className="flex items-start gap-4 text-brand-orange font-bold">
                  <MapPin className="w-6 h-6 mt-1 shrink-0" />
                  <p className="text-lg md:text-xl">
                    152128, Ярославская обл., Ростовский МО., рп. Поречье-Рыбное, ул. Кирова 53В
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="group">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-brand-orange-light mb-3 block opacity-70">Консультации по услугам</span>
                <a href="tel:89201229737" className="text-3xl md:text-4xl font-black tracking-tight hover:text-brand-orange transition-colors">
                  8 (920) 122-97-37
                </a>
                <p className="text-sm font-bold text-white/40 mt-1 uppercase tracking-widest">с 8:00 до 17:00</p>
              </div>

              <div className="group">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-brand-orange-light mb-3 block opacity-70">Отделение милосердия</span>
                <a href="tel:84853620120" className="text-3xl md:text-4xl font-black tracking-tight hover:text-brand-orange transition-colors">
                  8 (48536) 2-01-20
                </a>
                <p className="text-sm font-bold text-white/40 mt-1 uppercase tracking-widest">с 9:00 до 21:00</p>
              </div>

              <div className="group">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-brand-orange-light mb-3 block opacity-70">Электронная почта</span>
                <a href="mailto:mail@domlobova.ru" className="text-2xl md:text-3xl font-bold flex items-center gap-3 hover:text-brand-orange transition-colors underline decoration-brand-orange/30 underline-offset-8">
                  mail@domlobova.ru <ArrowDownRight className="w-6 h-6 rotate-[-45deg]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Requisites Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[3rem] md:rounded-[4rem] bg-white text-brand-brown p-8 md:p-14 shadow-2xl overflow-hidden group">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-brand-brown text-white flex items-center justify-center shadow-lg">
                     <ShieldCheck className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">Карточка организации</h3>
                     <p className="text-sm font-bold text-brand-brown/40 uppercase tracking-widest">Реквизиты и данные</p>
                   </div>
                </div>

                <div className="mb-10 p-6 rounded-3xl bg-brand-cream/50 border border-brand-brown/5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/30 mb-2 block">Полное наименование</span>
                  <p className="text-base md:text-lg font-bold leading-tight uppercase">
                    АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {requisites.map((item, idx) => (
                    <div key={idx} className="group/item border-b border-brand-brown/10 pb-4 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-1">{item.label}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base font-black tracking-tight">{item.val}</span>
                        <button 
                          onClick={() => copyToClipboard(item.val)}
                          className="p-2 h8 w-8 rounded-lg hover:bg-brand-brown hover:text-white transition-colors opacity-0 group-hover/item:opacity-100"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2 group/item border-b border-brand-brown/10 pb-4 flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-1">Фактический и юр. адрес</span>
                      <span className="text-sm font-black leading-snug uppercase">
                        152128, Ярославская область, Ростовский МО, рп Поречье-Рыбное, ул. Кирова, д. 53В
                      </span>
                  </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row gap-8 md:items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40">Директор</span>
                      <span className="text-xl font-black italic">Васиков Алексей Александрович</span>
                   </div>
                   <div className="flex gap-4">
                      {/* Placeholder for social icons */}
                      {[
                        { icon: "VK", link: "#" },
                        { icon: "TG", link: "#" },
                        { icon: "WA", link: "#" }
                      ].map((social, sIdx) => (
                        <a 
                          key={sIdx}
                          href={social.link} 
                          className="w-12 h-12 rounded-xl border-2 border-brand-brown/10 flex items-center justify-center font-black hover:bg-brand-orange hover:border-brand-orange hover:text-white transition-all duration-300"
                        >
                          {social.icon}
                        </a>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-10 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/30">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 text-center md:text-left mb-6 md:mb-0">
             <p>© {new Date().getFullYear()} АБСМНО Дом Милосердия Кузнеца Лобова.</p>
             <p>Все права защищены</p>
          </div>

          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="group-hover:text-brand-orange transition-colors">Разработано с душой</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- СБОРКА ---

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-yellow selection:text-brand-brown">
      <NoiseOverlay />

      <Header />

      <main>
        <Hero />

        <PhotoMarquee />

        <ElegantProgress />

        <OtherDonations />

        <About />

        <Stories />

        <FundsUsage />

        <DonationBlock />
      </main>

      <Footer />
    </div>
  );
}
