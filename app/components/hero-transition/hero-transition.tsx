"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, BookHeart } from "lucide-react";
import { useLenis } from "lenis/react";
import { DonationModal } from "../ui/donation-modal";

/* ──────────────────────────────────────────────
   Hardcoded hero photos – replace with CMS data later
   ────────────────────────────────────────────── */
const DEFAULT_HERO_PHOTOS = [
  "/images/1.webp",
  "/images/2.webp",
  "/images/3.webp",
  "/images/4.webp",
  "/images/5.webp",
  "/images/6.webp",
];

const SLIDE_INTERVAL = 6000; // ms between slides

interface HeroTransitionProps {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  heroPhotos?: any[];
}

export const HeroTransition = ({
  titleTop,
  titleBottom,
  heroDescription,
  heroPhotos,
}: HeroTransitionProps) => {
  const lenis = useLenis();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const photosToUse = heroPhotos && heroPhotos.length > 0 
    ? heroPhotos.map(p => p.url) 
    : DEFAULT_HERO_PHOTOS;

  const handleScrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -50 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto-advance slides
  useEffect(() => {
    if (photosToUse.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photosToUse.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [photosToUse.length]);

  // Listen for global donation event (from campaign cards)
  useEffect(() => {
    const handleOpenDonation = () => setIsDonationOpen(true);
    window.addEventListener("open-donation-modal", handleOpenDonation);
    return () => window.removeEventListener("open-donation-modal", handleOpenDonation);
  }, []);

  return (
    <>
      <div id="hero" className="relative h-screen bg-black">
        <div className="relative w-full h-full overflow-hidden bg-black">
          {/* Photo Slider Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="sync">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={photosToUse[currentSlide]}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />
          </div>

          {/* Slide indicators */}
          {photosToUse.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {photosToUse.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                    i === currentSlide
                      ? "w-8 bg-white"
                      : "w-3 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Слайд ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Hero Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="max-w-5xl w-full flex flex-col items-center justify-center h-full pt-20 pointer-events-auto">
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
                  onClick={() => {
                    document.documentElement.classList.add("scroll-locked");
                    setIsDonationOpen(true);
                  }}
                  className="group relative flex items-center justify-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5C1C]/40 shadow-[0_0_20px_rgba(227,94,36,0.4)] bg-[#FF5C1C]"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Помочь нам</span>
                </button>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo("#about");
                  }}
                  className="group flex items-center justify-center gap-2 px-10 py-4 rounded-full font-semibold text-lg cursor-pointer border border-white/40 text-white hover:bg-white/10 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 transition-[background,transform] duration-300"
                >
                  <BookHeart className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                  <span>Узнать больше</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />

      {/* ──────────────────────────────────────────────
          COMMENTED OUT: House Mask Effect (Layer 2)
          Preserved for future reuse. Uncomment and restore
          h-[300vh] + sticky positioning to re-enable.
          ──────────────────────────────────────────────
      <motion.div
        className="absolute inset-0 z-10 bg-brand-cream flex flex-col items-center justify-center pointer-events-none transform-gpu"
        style={{
          WebkitMaskImage: `url('data:image/svg+xml;base64,...')`,
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: useTransform(maskSize, (s) => \`\${s}vh\`),
          maskImage: `url('data:image/svg+xml;base64,...')`,
          maskPosition: "center",
          maskRepeat: "no-repeat",
          maskSize: useTransform(maskSize, (s) => \`\${s}vh\`),
        }}
      >
        <motion.div className="text-center px-5 md:px-8 max-w-4xl pt-10 flex flex-col items-center">
          <motion.h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown tracking-tighter">
            {welcomeTitle}
          </motion.h2>
          <motion.p className="text-base md:text-xl lg:text-2xl font-medium text-brand-brown-light leading-relaxed max-w-3xl">
            {welcomeDescription}
          </motion.p>
        </motion.div>
      </motion.div>
      ────────────────────────────────────────────── */}
    </>
  );
};
