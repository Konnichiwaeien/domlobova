"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, ArrowRight } from "lucide-react";
import { MagneticButton } from "../../ui/magnetic-button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        rafRef.current = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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
              className={`h-16 sm:h-20 lg:h-24 w-auto object-contain transition-opacity duration-700 ${isScrolled && !isOpen ? "opacity-100" : "opacity-0"}`}
            />
            <img
              src="/logo-light.svg"
              alt="Дом Лобова"
              className={`absolute left-0 top-0 h-16 sm:h-20 lg:h-24 w-auto object-contain transition-opacity duration-700 ${isScrolled && !isOpen ? "opacity-0" : "opacity-100"}`}
            />
          </div>

          <div className="flex items-center gap-4">
            <MagneticButton
              onClick={() => scrollTo("donate")}
              className={`group hidden md:flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-700 ${isScrolled && !isOpen ? "bg-brand-orange text-white shadow-xl hover:shadow-brand-orange/40" : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white"}`}
            >
              <Heart className={`w-5 h-5 transition-colors duration-500 ${isScrolled && !isOpen ? "text-white" : "text-brand-orange group-hover:text-white"}`} />
              Поддержать
            </MagneticButton>

            <MagneticButton
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all duration-700 ${isScrolled && !isOpen ? "bg-brand-orange text-white shadow-xl hover:shadow-brand-orange/40" : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white"}`}
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
            <div className="flex flex-col items-start gap-6 sm:gap-8 text-4xl sm:text-6xl md:text-7xl font-heading font-medium w-full max-w-2xl mx-auto pl-4">
              {[
                { label: "О нас", id: "about" },
                { label: "Истории", id: "stories" },
                { label: "На что нужны средства", id: "funds" },
                { label: "Сборы", id: "campaigns" },
                { label: "Волонтерство", id: "volunteer" },
                { label: "Контакты", id: "contacts" },
              ].map((item, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="group flex items-center justify-between w-full text-left transition-all duration-300 hover:text-[#FFEAB0]"
                >
                  <span className="relative inline-block overflow-hidden pb-2">
                    <span className="relative z-10 transition-transform duration-500 ease-out inline-block group-hover:-translate-y-full">
                      {item.label}
                    </span>
                    <span className="absolute left-0 top-full z-10 text-[#FFEAB0] transition-transform duration-500 ease-out inline-block group-hover:-translate-y-full">
                      {item.label}
                    </span>
                  </span>
                  <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 opacity-0 -translate-x-8 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { Header };
