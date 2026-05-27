"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import throttle from "lodash.throttle";

const SHOW_THRESHOLD = 400;
const HIDE_THRESHOLD = 300;
const THROTTLE_MS = 150;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const y = window.scrollY;
        if (y > SHOW_THRESHOLD) {
          setIsVisible(true);
        } else if (y < HIDE_THRESHOLD) {
          setIsVisible(false);
        }
      }, THROTTLE_MS),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 flex h-12 w-12 md:h-14 md:w-14 cursor-pointer items-center justify-center rounded-full bg-brand-brown text-white shadow-xl shadow-brand-brown/20 hover:bg-brand-orange hover:shadow-brand-orange/30 transition-[background-color,box-shadow] duration-300 border border-white/10"
          aria-label="Наверх"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export { ScrollToTop };
