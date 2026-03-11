"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  animate,
  useInView,
  type MotionValue,
} from "framer-motion";
import {
  Heart,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  Star,
  Clock,
  Home,
} from "lucide-react";
import { MagneticButton } from "../../ui/magnetic-button";
import { renderHighlightedTitle } from "../../../utils/text-parser";
// import { FeaturesBlock } from "./features-block";

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

// --- Optimized Scroll Reveal via CSS Gradient ---
// Uses a single useTransform + CSS background-clip:text instead of per-character hooks

const ScrollRevealText = ({ text, progress, imageElements }: { text: string; progress: any; imageElements: Map<number, TypingImage> }) => {
  // Single useTransform for the entire text block — replaces ~400 individual hooks
  const gradientPos = useTransform(progress, [0, 1], [0, 110]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // PERF: Update CSS custom property directly — zero React re-renders during scroll
  useMotionValueEvent(gradientPos, "change", (v) => {
    containerRef.current?.style.setProperty("--reveal-pos", String(v));
  });

  // Split text into words, track positions for images
  const parts = useMemo(() => {
    const result: { type: "word" | "image"; content: string; imageData?: TypingImage; charOffset: number }[] = [];
    const segments = text.split("[IMAGE]");
    let imgIdx = 0;
    let charCount = 0;
    
    segments.forEach((seg, i) => {
      if (seg) {
        const words = seg.match(/\S+|\s+/g);
        if (words) {
          words.forEach(w => {
            result.push({ type: "word", content: w, charOffset: charCount });
            charCount += w.length;
          });
        }
      }
      if (i < segments.length - 1) {
        const imgData = imageElements.get(imgIdx);
        if (imgData) {
          result.push({ type: "image", content: "", imageData: imgData, charOffset: charCount });
        }
        charCount++;
        imgIdx++;
      }
    });
    return { items: result, totalChars: charCount };
  }, [text, imageElements]);

  return (
    <div ref={containerRef} style={{ ["--reveal-pos" as string]: "0" }}>
      {parts.items.map((part, idx) => {
        const progressPct = (part.charOffset / parts.totalChars) * 100;
        
        if (part.type === "image" && part.imageData) {
          return (
            <span 
              key={`img-${idx}`}
              className="inline-block w-[120px] sm:w-[160px] md:w-[200px] lg:w-[240px] h-[48px] sm:h-[64px] md:h-[80px] lg:h-[88px] rounded-full overflow-hidden align-middle shadow-md shadow-brand-brown/10 border-[3px] border-white mx-1 my-0.5 shrink-0"
              style={{
                opacity: `clamp(0, (var(--reveal-pos) - ${progressPct}) * 0.05, 1)`,
              } as React.CSSProperties}
            >
              <img src={part.imageData.src} className="h-full w-full object-cover" alt={part.imageData.alt} loading="lazy" />
            </span>
          );
        }

        const isSpace = part.content.trim() === "";
        if (isSpace) {
          return <span key={idx}>{part.content}</span>;
        }

        // PERF: Use CSS calc() with --reveal-pos custom property
        // This avoids any React re-render — styles update purely via CSS
        return (
          <span 
            key={idx} 
            className="inline-block whitespace-pre scroll-reveal-word"
            style={{
              ["--word-offset" as string]: String(progressPct),
            }}
          >
            {part.content}
          </span>
        );
      })}
    </div>
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
  
  // Detect mobile for lighter parallax
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Parallax Collage Hooks — reduced ranges on mobile
  // Currently disabled along with the Promo Block to prevent 'Target ref is defined but not hydrated' error
  /*
  const collageRef = useRef(null);
  const { scrollYProgress: collageProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(collageProgress, [0, 1], isMobile ? [40, -40] : [300, -300]);
  const y2 = useTransform(collageProgress, [0, 1], isMobile ? [60, -60] : [500, -500]);
  const y3 = useTransform(collageProgress, [0, 1], isMobile ? [30, -30] : [200, -300]);
  const y4 = useTransform(collageProgress, [0, 1], isMobile ? [50, -50] : [400, -600]);
  const collageScale = useTransform(collageProgress, [0.2, 0.8], isMobile ? [0.95, 1.05] : [0.85, 1.1]);
  const collageOpacity = useTransform(collageProgress, [0.2, 0.5, 0.8], [0.5, 1, 0.8]);
  */

  // Text Reveal Scroll — optimized: single progress value for CSS gradient
  const textRef = useRef(null);
  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 80%", "end 60%"],
  });

  const smoothProgress = useSpring(textProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Build image elements map for ScrollRevealText
  const imageElements = useMemo(() => {
    const map = new Map<number, TypingImage>();
    if (photos) {
      photos.forEach((photo, idx) => {
        map.set(idx, { type: "img", src: photo.url, alt: `Фото ${idx + 1}` });
      });
    }
    return map;
  }, [photos]);

  return (
    <section id="about" className="relative bg-white pt-16 md:pt-24 lg:pt-28 pb-16 md:pb-24 lg:pb-28 overflow-hidden z-10 text-brand-brown">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 relative z-20">
        <div className="flex flex-col">
          <div className="text-center mb-8 md:mb-10">

            <h3 className="font-heading text-5xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-brand-brown tracking-tighter mx-auto max-w-4xl uppercase">
              {renderHighlightedTitle(title)}
            </h3>
          </div>

          {/* Stats Section Redesigned */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 w-full max-w-5xl mx-auto gap-4 md:gap-8 lg:gap-12 mb-5 md:mb-8 lg:mb-12"
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="w-full flex flex-col items-center justify-center group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-500">
                    {(() => {
                      const icons = [HeartHandshake, Users, Clock, Home];
                      const Icon = icons[idx % icons.length];
                      return <Icon className="w-7 h-7 md:w-8 md:h-8" />;
                    })()}
                  </div>
                  <span className="font-heading lining-nums text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-brand-brown group-hover:text-brand-orange transition-colors duration-500 mb-2 flex items-center justify-center text-center">
                    <AnimatedCounter value={stat.value || 0} suffix={stat.suffix || ""} />
                  </span>
                  <span className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-brand-brown/60 text-center max-w-[150px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Text inline image reveal — optimized: single useTransform + CSS color-mix */}
          <div ref={textRef} className="max-w-[1200px] mx-auto pb-4 md:pb-6 pt-4 md:pt-8 flex flex-col justify-center min-h-[40vh] transform-gpu">
            <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-[40px] leading-[1.4] lg:leading-[1.35] font-medium text-brand-brown text-center md:text-left">
              <ScrollRevealText
                text={descr || ""}
                progress={smoothProgress}
                imageElements={imageElements}
              />
            </div>
          </div>

          {/* Refined Interactive Bento Cards - Currently disabled, preserved in FeaturesBlock */}
          {/* <FeaturesBlock features={features} /> */}

          {/* Morphing Parallax Collage: Dynamic Promo Block - Currently disabled */}
          {/* 
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

              <motion.div style={{ y: y1, willChange: "transform" }} className="absolute z-10 w-[40vw] max-w-[280px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-4deg] left-[2%] md:left-[8%] top-[8%] border-[6px] border-white/30 transform-gpu">
                <img src={promo?.images?.[0]?.url || "/images/3.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-[filter] duration-500" alt="Жизнь" loading="lazy"/>
              </motion.div>

              <motion.div style={{ y: y2, willChange: "transform" }} className="absolute z-10 w-[35vw] max-w-[240px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-[5deg] right-[2%] md:right-[15%] bottom-[12%] border-[6px] border-white/30 transform-gpu">
                <img src={promo?.images?.[1]?.url || "/images/4.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-[filter] duration-500" alt="Без боли" loading="lazy"/>
              </motion.div>

              <motion.div style={{ y: y3, willChange: "transform" }} className="absolute z-10 w-[45vw] max-w-[320px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl rotate-[6deg] right-[5%] md:right-[8%] top-[18%] border-[6px] border-white/30 transform-gpu">
                <img src={promo?.images?.[2]?.url || "/images/5.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-[filter] duration-500" alt="Страха и одиночества" loading="lazy"/>
              </motion.div>

              <motion.div style={{ y: y4, willChange: "transform" }} className="absolute z-10 w-[30vw] max-w-[190px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-8deg] left-[10%] md:left-[22%] bottom-[8%] border-[6px] border-white/30 transform-gpu">
                <img src={promo?.images?.[3]?.url || "/images/6.webp"} className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-[filter] duration-500" alt="Помощь" loading="lazy"/>
              </motion.div>

            </div>
          </div>
          */}

        </div>
      </div>
    </section>
  );
};

export { About };
