'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Heart } from 'lucide-react';
import { useLenis } from 'lenis/react';

export const SuccessModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { width, height } = useWindowSize();

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => { lenisRef.current = lenis; });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-success-modal', handleOpen);
    return () => window.removeEventListener('open-success-modal', handleOpen);
  }, []);

  // Keyboard — depends only on isOpen
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Scroll lock — depends ONLY on isOpen
  useEffect(() => {
    if (!isOpen) return;

    // Stop Lenis so it doesn't accumulate targetScroll while modal is open
    lenisRef.current?.stop();
    document.documentElement.classList.add("scroll-locked");

    // Extra safety: block wheel at capture level for non-Lenis scroll paths
    const blockWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-lenis-prevent]")) return;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("wheel", blockWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", blockWheel, true);
      document.documentElement.classList.remove("scroll-locked");
      lenisRef.current?.start();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          data-lenis-prevent={true}
        >
          {/* Backdrop overlay for closing */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={['#FF7A00', '#E07A5F', '#F4A261', '#E9C46A']}
            className="!fixed !z-[110] pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl shadow-brand-orange/10 border border-brand-orange/20 text-center max-w-lg w-full mx-auto z-[120] flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ 
                scale: { type: 'spring', delay: 0.3, bounce: 0.6 },
                rotate: { type: 'tween', delay: 0.5, duration: 0.5 }
              }}
              className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-[#E07A5F] text-white shadow-lg shadow-brand-orange/30 relative"
            >
              <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Heart className="h-14 w-14" strokeWidth={2} fill="currentColor" />
              </motion.div>

              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -50 - (i * 20), x: (i % 2 === 0 ? 20 : -20) * (i + 1), scale: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4, ease: "easeOut" }}
                  className="absolute text-brand-orange"
                >
                  <Heart className="h-6 w-6" fill="currentColor" />
                </motion.div>
              ))}
            </motion.div>

            <h3 className="font-heading text-4xl md:text-5xl font-black text-brand-brown mb-4">
              Спасибо!
            </h3>

            <p className="mt-4 text-lg font-medium text-brand-brown-light leading-relaxed">
              Ваше пожертвование успешно отправлено. <br className="hidden sm:block" />Вы сделали этот мир чуточку светлее!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
              className="mt-10 rounded-full bg-brand-cream px-10 py-5 w-full text-base font-bold uppercase tracking-widest text-brand-orange hover:bg-brand-yellow/30 hover:text-brand-brown transition-colors cursor-pointer border border-brand-orange/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50"
            >
              Закрыть
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
