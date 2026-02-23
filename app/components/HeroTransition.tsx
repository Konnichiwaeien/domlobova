"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, animate, useInView } from "framer-motion";

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        delay: 0.8,
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

export const HeroTransition = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scale the mask from invisible (0vh) to massive (400vh) covering the screen
  const maskSize = useTransform(scrollYProgress, [0, 0.15, 0.8], [0, 25, 400]);

  // Hero background and text fade out slightly as the mask grows
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
        {/* Layer 1: Background Hero Video */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0 origin-center"
        >
          <video
            src="/1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-black/40 via-transparent to-black/60">
            <div className="max-w-5xl w-full flex flex-col items-center justify-center h-full pt-20">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="font-serif text-center text-[15vw] sm:text-[12vw] lg:text-[10vw] xl:text-[128px] 2xl:text-[150px] font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl"
              >
                ДОМ, ГДЕ ЖИВЕТ <br />
                <span className="text-brand-orange italic font-light">
                  НАДЕЖДА
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-12 md:mt-16 grid grid-cols-3 gap-2 md:gap-6 w-full max-w-4xl drop-shadow-lg"
              >
                {/* Stat 1 */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-brand-orange flex items-center justify-center text-white mb-3 md:mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-brand-orange transition-all duration-500 shadow-xl">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  </div>
                  <span className="font-serif lining-nums text-3xl sm:text-4xl lg:text-6xl font-black text-white drop-shadow-lg">
                    <AnimatedCounter value={25} suffix="+" />
                  </span>
                  <span className="text-[9px] sm:text-xs lg:text-base uppercase tracking-widest font-semibold text-white/90 drop-shadow-md mt-1 md:mt-2 text-center leading-tight">
                    Подопечных
                  </span>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-brand-orange flex items-center justify-center text-white mb-3 md:mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-brand-orange transition-all duration-500 shadow-xl">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <span className="font-serif lining-nums text-3xl sm:text-4xl lg:text-6xl font-black text-white drop-shadow-lg flex items-center">
                    <AnimatedCounter value={24} suffix="/7" />
                  </span>
                  <span className="text-[9px] sm:text-xs lg:text-base uppercase tracking-widest font-semibold text-white/90 drop-shadow-md mt-1 md:mt-2 text-center leading-tight">
                    Уход
                  </span>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-brand-orange flex items-center justify-center text-white mb-3 md:mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-brand-orange transition-all duration-500 shadow-xl">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                  </div>
                  <span className="font-serif lining-nums text-3xl sm:text-4xl lg:text-6xl font-black text-white drop-shadow-lg">
                    <AnimatedCounter value={20} suffix="+" />
                  </span>
                  <span className="text-[9px] sm:text-xs lg:text-base uppercase tracking-widest font-semibold text-white/90 drop-shadow-md mt-1 md:mt-2 text-center leading-tight">
                    Волонтеров
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Layer 2: Next Block Masked - The "House Mask" Effect */}
        <motion.div
          className="absolute inset-0 z-10 bg-brand-cream flex flex-col items-center justify-center"
          style={{
            // A precise SVG encoding for a house icon (filled black) acting as the mask
            WebkitMaskImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iYmxhY2siIGQ9Ik0xMiAzTDIgMTJoM3Y5aDE0di05aDNMMTIgM3oiLz48L3N2Zz4=')`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: useTransform(maskSize, (s) => `${s}vh`),

            maskImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iYmxhY2siIGQ9Ik0xMiAzTDIgMTJoM3Y5aDE0di05aDNMMTIgM3oiLz48L3N2Zz4=')`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: useTransform(maskSize, (s) => `${s}vh`),
          }}
        >
          {/* Content revealed INSIDE the house */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center px-6 max-w-4xl pt-10 flex flex-col items-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8 flex justify-center"
            >
                        <video
            src="/12.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-32 lg:h-100 w-auto object-contain"
          />

            </motion.div>

            <div className="overflow-hidden mb-6">
              <motion.h2 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="font-serif text-5xl md:text-7xl font-black text-brand-brown tracking-tighter"
              >
                ДОБРО ПОЖАЛОВАТЬ
              </motion.h2>
            </div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
              className="w-24 h-1 bg-brand-orange rounded-full mb-8 transform origin-center"
            />

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-2xl font-medium text-brand-brown-light leading-relaxed max-w-3xl"
            >
              Дом милосердия Кузнеца Лобова — место, где никто не остается один
              на один с бедой. Здесь живет надежда и настоящая любовь к каждому
              человеку.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
