"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, animate, useInView } from "framer-motion";
import { Heart, BookHeart } from "lucide-react";
import { useLenis } from "lenis/react";

interface HeroTransitionProps {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  welcomeTitle?: string;
  welcomeDescription?: string;
}

export const HeroTransition = ({ titleTop, titleBottom, heroDescription, welcomeTitle, welcomeDescription }: HeroTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const handleScrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -50 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scale the mask from invisible (0vh) to massive (400vh) covering the screen
  const maskSize = useTransform(scrollYProgress, [0, 0.15, 0.8], [0, 25, 400]);

  // Hero background and text fade out slightly as the mask grows
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);

  // Dynamically toggle pointer events so Layer 2 invisible elements don't block Layer 1 at the top of the scroll
  const layer1PointerEvents = useTransform(scrollYProgress, (v) => (v < 0.3 ? "auto" : "none"));
  const layer2PointerEvents = useTransform(scrollYProgress, (v) => (v > 0.3 ? "auto" : "none"));

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
        {/* Layer 1: Background Hero Video */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0 origin-center"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/posters/hero-poster.jpg"
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/videos/hero-1.webm" type="video/webm" />
            <source src="/videos/hero-1.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none">
            <motion.div 
              style={{ pointerEvents: layer1PointerEvents }}
              className="max-w-5xl w-full flex flex-col items-center justify-center h-full pt-20"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="font-heading text-center flex flex-col items-center justify-center text-white drop-shadow-2xl mb-6 relative z-20 max-w-full"
              >
                <span className="text-[13vw] sm:text-[11vw] lg:text-[9vw] xl:text-[100px] 2xl:text-[160px] font-black leading-none uppercase tracking-normal whitespace-nowrap">
                  {titleTop}
                </span>
                <span className="text-[#FF5C1C] italic font-bold text-[15.5vw] sm:text-[13vw] lg:text-[11vw] xl:text-[115px] 2xl:text-[140px] leading-none -mt-3 sm:-mt-4 lg:-mt-5 tracking-tight whitespace-nowrap">
                 {titleBottom}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-white/95 text-lg md:text-xl lg:text-2xl max-w-2xl font-normal mb-10 leading-relaxed drop-shadow-lg text-center"
              >
                {heroDescription}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <button 
                  onClick={() => handleScrollTo('#donate')}
                  className="group relative flex items-center justify-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FF5C1C]/40 shadow-[0_0_20px_rgba(227,94,36,0.4)] bg-[#FF5C1C]"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Помочь фонду</span>
                </button>
                <button 
                  onClick={() => handleScrollTo('#about')}
                  className="group flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-lg cursor-pointer border border-white/40 text-white hover:bg-white/10 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 backdrop-blur-sm transition-all"
                >
                  <BookHeart className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                  <span>Узнать больше</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Layer 2: Next Block Masked - The "House Mask" Effect */}
        <motion.div
          className="absolute inset-0 z-10 bg-brand-cream flex flex-col items-center justify-center pointer-events-none"
          style={{
            // A precise SVG encoding for a house icon (filled black) acting as the mask
            WebkitMaskImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCc+PHBhdGggZmlsbD0nYmxhY2snIGQ9J00xMiAzIEwyIDEyIEg1IFYyMSBIMTkgVjEyIEgyMiBMMTYgNi42IFYzIEgxMyBWMy45IEwxMiAzIFonLz48L3N2Zz4=')`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: useTransform(maskSize, (s) => `${s}vh`),

            maskImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCc+PHBhdGggZmlsbD0nYmxhY2snIGQ9J00xMiAzIEwyIDEyIEg1IFYyMSBIMTkgVjEyIEgyMiBMMTYgNi42IFYzIEgxMyBWMy45IEwxMiAzIFonLz48L3N2Zz4=')`,
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
            style={{ pointerEvents: layer2PointerEvents }}
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
            preload="none"
            className="h-32 lg:h-100 w-auto object-contain"
          />

            </motion.div>

            <div className="overflow-hidden mb-6">
              <motion.h2 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="font-heading text-5xl md:text-7xl font-black text-brand-brown tracking-tighter"
              >
                {welcomeTitle}
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
              {welcomeDescription}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
