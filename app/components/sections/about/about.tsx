"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  animate,
  useInView,
} from "framer-motion";
import {
  Heart,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  Star,
} from "lucide-react";
import { MagneticButton } from "../../ui/magnetic-button";
import { renderHighlightedTitle } from "../../../utils/text-parser";

// --- Typing Text Parser ---

type TypingImage = { type: "img"; src: string; alt?: string };
type TypingElement = string | TypingImage;

export const parseTypingText = (text?: string, photos?: { url: string }[]): TypingElement[] => {
  if (!text) return [];
  
  const result: TypingElement[] = [];
  // Split by [IMAGE] placeholder
  const parts = text.split("[IMAGE]");
  let photoIndex = 0;

  parts.forEach((part, index) => {
    // 1. Process the text part: split into individual words/spaces for framer-motion typing effect
    if (part) {
      // Split by spaces but KEEP the spaces as separate items
      const wordsAndSpaces = part.match(/([^ \r\n]+|[ \r\n]+)/g);
      
      if (wordsAndSpaces) {
        wordsAndSpaces.forEach(item => {
           result.push(item);
        });
      }
    }

    // 2. Insert the image if this isn't the final part
    if (index < parts.length - 1 && photos && photos[photoIndex]) {
      result.push({
        type: "img",
        src: photos[photoIndex].url,
        alt: `Фото из текста ${photoIndex + 1}`
      });
      photoIndex++;
    }
  });

  return result;
};

// Helper to calculate total count of items (chars + images) for mapping progress
const getTotalElementsProps = (data: TypingElement[]) => {
  let count = 0;
  data.forEach(item => {
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

  return (
    <motion.span style={{ opacity, color }} className="inline-block relative z-10 transition-colors">
      {children}
    </motion.span>
  );
};

const ScrollRevealImage = ({ item, progress, index, total }: any) => {
  const charProgressLength = 0.2;
  const start = (index / total) * (1 - charProgressLength);
  const end = Math.min(start + charProgressLength * 1.5, 1);
  
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span 
      style={{ opacity }}
      className="inline-block w-[80px] sm:w-[120px] md:w-[180px] lg:w-[220px] h-[36px] sm:h-[48px] md:h-[64px] lg:h-[72px] rounded-full overflow-hidden align-middle shadow-md shadow-brand-brown/10 border-[3px] border-white mx-1 my-0.5 shrink-0"
    >
      <img src={item.src} className="h-full w-full object-cover" alt={item.alt}/>
    </motion.span>
  );
};

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        delay: 0.2, // Faster start since it's scrolled into view
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = prefix + Math.floor(v).toString() + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [value, inView, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// --- About Section ---

interface AboutProps {
  title?: string;
  descr?: string;
  photos?: { url: string }[];
  stats?: { value?: number; suffix?: string; label?: string }[];
  features?: any[];
  promo?: { title?: string; images?: { url: string }[] };
}

const About = ({ title, descr, photos, stats, features, promo }: AboutProps) => {
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

  const parsedTypingData = parseTypingText(descr, photos);
  const { total: totalTextElements } = getTotalElementsProps(parsedTypingData);
  let elementCounter = 0;

  return (
    <section id="about" className="relative bg-white pt-14 md:pt-20 pb-0 overflow-hidden z-10 text-brand-brown">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 relative z-20">
        <div className="flex flex-col gap-10 md:gap-14">
          <div className="text-center">
            <h2 className="mb-6 inline-flex rounded-full bg-brand-orange-light/30 px-6 py-2 shadow-sm border border-brand-orange/10"><span className="text-sm font-bold uppercase tracking-widest text-brand-orange">Дом милосердия кузнеца Лобова</span></h2>
            <h3 className="font-heading text-6xl font-black text-brand-brown md:text-8xl tracking-tighter mx-auto max-w-4xl uppercase">
              {renderHighlightedTitle(title)}
            </h3>
          </div>

          {/* Stats Section Redesigned */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 w-full max-w-5xl mx-auto gap-6 sm:gap-8 lg:gap-12 mb-2 mt-2 md:mt-4"
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="w-full flex flex-col items-center justify-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-500">
                    <HeartHandshake className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <span className="font-heading lining-nums text-4xl lg:text-5xl xl:text-6xl font-black text-brand-brown group-hover:text-brand-orange transition-colors duration-500 mb-2 flex items-center justify-center text-center">
                    <AnimatedCounter value={stat.value || 0} suffix={stat.suffix || ""} />
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-brand-brown/60 text-center max-w-[150px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Text inline image reveal */}
          <div ref={textRef} className="max-w-[1200px] mx-auto pb-4 md:pb-6 pt-0 flex flex-col justify-center min-h-[40vh]">
            <div className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-[1.4] lg:leading-[1.4] font-medium text-brand-brown text-center md:text-left">
              {parsedTypingData.map((item, idx) => {
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

          {/* Refined Interactive Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6 md:pb-10 relative z-30 px-2 md:px-0">
            {features && features.length > 0 ? (
              features.map((feature, idx) => {
                // Determine icon and colors based on index to maintain the existing design feel
                const defaultStyling = [
                  { icon: HeartHandshake, color: "text-brand-orange", bgColor: "bg-[#FDFBF7]" },
                  { icon: ShieldCheck,    color: "text-brand-yellow", bgColor: "bg-[#FDFBF7]" },
                  { icon: Users,          color: "text-[#E07A5F]",    bgColor: "bg-[#FDFBF7]" },
                  { icon: Star,           color: "text-[#81B29A]",    bgColor: "bg-[#FDFBF7]" }
                ];
                const style = defaultStyling[idx % defaultStyling.length];
                const Icon = style.icon;
                const imgSrc = feature.image?.url || `/images/${(idx % 4) + 1}.webp`;
                const isLastAndOdd = features.length % 2 !== 0 && idx === features.length - 1;

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                    className={`group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] ${style.bgColor} border border-brand-brown/5 h-[280px] md:h-[330px] cursor-pointer transform-gpu ${isLastAndOdd ? 'md:col-span-2' : ''}`}
                  >
                {/* Hover shadow layer — separated from Framer Motion to avoid flicker */}
                <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] shadow-lg group-hover:shadow-xl transition-shadow duration-700 pointer-events-none z-20" />

                {/* Background Image Always Visible */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] pointer-events-none transform-gpu">
                  <img src={imgSrc} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none" alt={feature.title}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 pointer-events-none" />
                </div>
                
                {/* Card Content */}
                <div className="relative z-10 w-full h-full p-6 md:p-8 flex flex-col justify-between">
                  {/* Top: Icons */}
                  <div className="flex justify-between items-start">
                    <div className={`inline-flex rounded-full p-4 bg-white/10 backdrop-blur-md shadow-sm border border-white/10 text-white group-hover:bg-white/20 transition-colors duration-700`}>
                      <Icon className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white/20 group-hover:text-white group-hover:-rotate-45 group-hover:backdrop-blur-md transition-all duration-500 delay-100">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>

                  {/* Bottom: Text */}
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <h4 className="font-heading text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-3 text-white">
                      {feature.title}
                    </h4>
                    <p className="text-sm md:text-base lg:text-lg text-white/90 leading-tight md:leading-relaxed font-medium transition-colors duration-500 line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                      {feature.descr}
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            })
          ) : null}
          </div>

          {/* Morphing Parallax Collage: Dynamic Promo Block */}
          <div ref={collageRef} className="relative w-full h-[85vh] md:h-[85vh] -mb-[5vh]">
            <div className="sticky top-[10vh] md:top-[12vh] h-[70vh] md:h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-[3rem] bg-brand-orange text-brand-cream border border-brand-brown/10 shadow-2xl">
              
              <motion.div style={{ scale: collageScale, opacity: collageOpacity }} className="relative z-40 text-center px-4 w-full flex flex-col items-center">
                <h3 className="font-heading text-[10vw] sm:text-[8vw] md:text-[5vw] font-black tracking-tighter leading-[0.85] drop-shadow-2xl text-white mb-10 max-w-[8em] mx-auto">
                  {promo?.title ? (
                    promo.title.split(/(\*[^*]+\*)/g).map((part, i) => {
                      if (part.startsWith("*") && part.endsWith("*")) {
                        return <span key={i} className="italic font-bold text-brand-yellow">{part.slice(1, -1)}</span>;
                      }
                      return <React.Fragment key={i}>{
                        part.split('\n').map((line, j, arr) => (
                          <React.Fragment key={`${i}-${j}`}>
                            {line}
                            {j < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))
                      }</React.Fragment>;
                    })
                  ) : (
                    <>
                      ЖИЗНЬ БЕЗ БОЛИ,<br/>
                      СТРАХА И <span className="italic font-bold text-brand-yellow">ОДИНОЧЕСТВА</span>
                    </>
                  )}
                </h3>
                
                <MagneticButton
                  onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-brand-cream text-brand-brown hover:bg-white cursor-pointer transition-all duration-300 rounded-full px-10 py-5 text-sm md:text-base font-bold uppercase tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-3 overflow-hidden group"
                >
                  <span className="relative z-10">Помочь сейчас</span>
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 relative z-10">
                    <Heart className="w-4 h-4" />
                  </div>
                </MagneticButton>
              </motion.div>

              {/* Parallax Floating Images */}
              <motion.div style={{ y: y1 }} className="absolute z-10 w-[40vw] max-w-[280px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-4deg] left-[2%] md:left-[8%] top-[8%] border-[6px] border-white/30">
                <img src={promo?.images?.[0]?.url || "/images/3.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500" alt="Жизнь"/>
              </motion.div>

              <motion.div style={{ y: y2 }} className="absolute z-10 w-[35vw] max-w-[240px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-[5deg] right-[2%] md:right-[15%] bottom-[12%] border-[6px] border-white/30">
                <img src={promo?.images?.[1]?.url || "/images/4.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500" alt="Без боли"/>
              </motion.div>

              <motion.div style={{ y: y3 }} className="absolute z-10 w-[45vw] max-w-[320px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl rotate-[6deg] right-[5%] md:right-[8%] top-[18%] border-[6px] border-white/30">
                <img src={promo?.images?.[2]?.url || "/images/5.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500" alt="Страха и одиночества"/>
              </motion.div>

              <motion.div style={{ y: y4 }} className="absolute z-10 w-[30vw] max-w-[190px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-8deg] left-[10%] md:left-[22%] bottom-[8%] border-[6px] border-white/30">
                <img src={promo?.images?.[3]?.url || "/images/6.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500" alt="Помощь"/>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export { About };
