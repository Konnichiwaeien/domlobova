"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useLenis } from "lenis/react";
import { DonationModal } from "../ui/donation-modal";

const DEFAULT_HERO_PHOTOS = [
  "/images/1.webp",
  "/images/2.webp",
  "/images/3.webp",
  "/images/4.webp",
  "/images/5.webp",
  "/images/6.webp",
];

const SLIDE_INTERVAL = 6000;

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

  const photosToUse =
    heroPhotos && heroPhotos.length > 0
      ? heroPhotos.map((p) => p.url)
      : DEFAULT_HERO_PHOTOS;

  const handleScrollTo = (id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -50 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (photosToUse.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photosToUse.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [photosToUse.length]);

  useEffect(() => {
    const handleOpenDonation = () => setIsDonationOpen(true);
    window.addEventListener("open-donation-modal", handleOpenDonation);
    return () => window.removeEventListener("open-donation-modal", handleOpenDonation);
  }, []);

  /* ── Shared content (text + buttons) ── */
  const Content = ({ mobile }: { mobile: boolean }) => (
    <div
      className={`flex flex-col items-center text-center ${
        mobile ? "px-6 pt-28 pb-10 w-full" : "px-12 lg:px-16 xl:px-20 pt-24 pb-10 w-full"
      }`}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mb-5 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
      >
        <span className="text-sm font-medium text-white/85 tracking-wide">
          Бесплатная паллиативная помощь
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="font-heading leading-none mb-6 drop-shadow-2xl"
      >
        {titleTop && (
          <span
            className={`block font-black uppercase text-white tracking-normal ${
              mobile ? "text-[14vw]" : "text-[6vw]"
            }`}
          >
            {titleTop}
          </span>
        )}
        {titleBottom && (
          <span
            className={`block font-black italic text-[#FF5C1C] -mt-2 tracking-tight ${
              mobile ? "text-[15vw]" : "text-[6.5vw]"
            }`}
          >
            {titleBottom}
          </span>
        )}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className={`text-white/90 leading-relaxed mb-10 drop-shadow-lg ${
          mobile ? "text-base max-w-sm" : "text-xl lg:text-2xl"
        }`}
      >
        {heroDescription}
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65 }}
        className={`flex items-center justify-center flex-wrap ${mobile ? "gap-5" : "gap-8"}`}
      >
        <button
          onClick={() => {
            document.documentElement.classList.add("scroll-locked");
            setIsDonationOpen(true);
          }}
          className={`flex items-center gap-2.5 rounded-full bg-white font-bold text-[#E35E24] shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            mobile ? "px-8 py-3.5 text-base" : "px-10 py-4 text-lg"
          }`}
        >
          <Heart className="w-5 h-5 fill-[#E35E24]" />
          <span>Поддержать дом</span>
        </button>

        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo("#about");
          }}
          className="group flex flex-col items-center cursor-pointer"
        >
          <span className="text-white/80 font-semibold text-base group-hover:text-white transition-colors duration-300">
            Узнать больше
          </span>
          <svg
            viewBox="0 0 120 8"
            preserveAspectRatio="none"
            className="w-full h-1.5 mt-1 text-white/40 group-hover:text-white/75 transition-colors duration-300"
            aria-hidden="true"
          >
            <path
              d="M2,5 C14,2 28,7 42,4.5 C56,2 70,7 84,4.5 C98,2 110,6.5 118,4.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </a>
      </motion.div>
    </div>
  );

  return (
    <>
      <div id="hero" className="h-screen">

        {/* ══════════════════════════════════════
            MOBILE: top = slider, bottom = brand panel
            ══════════════════════════════════════ */}
        <div className="lg:hidden flex flex-col w-full h-full">
          {/* Top: brand colored text panel */}
          <div className="flex flex-col items-center justify-center flex-1 bg-[#E35E24] px-6 py-8 pt-24 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading leading-none mb-4 drop-shadow-lg"
            >
              {titleTop && (
                <span className="block text-[11vw] font-black uppercase text-white tracking-normal">
                  {titleTop}
                </span>
              )}
              {titleBottom && (
                <span className="block text-[12vw] font-black italic text-white/90 -mt-1 tracking-tight">
                  {titleBottom}
                </span>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-white/90 text-sm leading-relaxed mb-6 max-w-xs"
            >
              {heroDescription}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={() => {
                document.documentElement.classList.add("scroll-locked");
                setIsDonationOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-[#E35E24] text-base shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <Heart className="w-5 h-5 fill-[#E35E24]" />
              <span>Поддержать дом</span>
            </motion.button>
          </div>

          {/* Bottom: photo slider */}
          <div className="relative w-full flex-[0_0_45%] overflow-hidden bg-black">
            <AnimatePresence mode="sync">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.06 }}
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
            {photosToUse.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {photosToUse.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                      i === currentSlide ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Слайд ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            DESKTOP: split left / right
            ══════════════════════════════════════ */}
        <div className="hidden lg:flex w-full h-full">
          {/* Left panel */}
          <div className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/images/house.jpg"
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/55" />
            </div>
            <div className="relative z-10 w-full">
              <Content mobile={false} />
            </div>
          </div>

          {/* Right panel: slider */}
          <div className="relative w-1/2 overflow-hidden bg-black">
            <AnimatePresence mode="sync">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.06 }}
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

            {photosToUse.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {photosToUse.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                      i === currentSlide ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Слайд ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
};
