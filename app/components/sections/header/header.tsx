"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Heart, Menu, X, ArrowRight } from "lucide-react";
import { MagneticButton } from "../../ui/magnetic-button";
import { DonationModal } from "../../ui/donation-modal";
import { useLenis } from "lenis/react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const { scrollY } = useScroll();

  // Dynamically measure the hero section height
  const measureHero = useCallback(() => {
    const heroEl = document.getElementById('hero') as HTMLElement | null;
    if (heroEl) {
      setHeroHeight(heroEl.offsetTop + heroEl.offsetHeight);
    }
  }, []);

  useEffect(() => {
    measureHero();
    window.addEventListener('resize', measureHero);
    return () => window.removeEventListener('resize', measureHero);
  }, [measureHero]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const heroEnd = heroHeight || window.innerHeight;
    const threshold = heroEnd * 0.3;

    if (latest > threshold) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }

    if (latest > threshold) {
      if (latest > previous) {
        if (!hidden) setHidden(true);
      } else {
        if (hidden) setHidden(false);
      }
    } else {
      if (hidden) setHidden(false);
    }
  });

  const lenis = useLenis();

  // Lock body scroll AND stop Lenis when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [isOpen, lenis]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for global donation modal event
  useEffect(() => {
    const handleOpenDonation = () => setIsDonationOpen(true);
    window.addEventListener("open-donation-modal", handleOpenDonation);
    return () => window.removeEventListener("open-donation-modal", handleOpenDonation);
  }, []);

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden && !isOpen ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,padding,box-shadow] duration-500 px-4 md:px-12 ${
          isScrolled && !isOpen ? "bg-[#F9F8F6] shadow-md py-3 md:py-4" : "bg-transparent py-4 md:py-8"
        }`}
      >
        <div className={`flex w-full items-center justify-between`}>
          <a
            href="https://domlobova.ru/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="На главную"
            className="group flex cursor-pointer items-center gap-3 relative w-auto focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 rounded-lg"
          >
            <img
              src="/logo-dark.svg"
              alt="Дом Лобова"
              className={`w-auto object-contain transition-[opacity,height] duration-500 ${
                isScrolled && !isOpen ? "opacity-100 h-12 sm:h-14 lg:h-16" : "opacity-0 h-16 sm:h-20 lg:h-24"
              }`}
            />
            <img
              src="/logo-light.svg"
              alt="Дом Лобова"
              className={`absolute left-0 top-0 w-auto object-contain transition-[opacity,height] duration-500 ${
                isScrolled && !isOpen ? "opacity-0 h-12 sm:h-14 lg:h-16" : "opacity-100 h-16 sm:h-20 lg:h-24"
              }`}
            />
          </a>

          <div className="flex items-center gap-3 md:gap-4">
            <MagneticButton
              onClick={() => {
                document.documentElement.classList.add("scroll-locked");
                setIsDonationOpen(true);
              }}
              className={`group hidden md:flex cursor-pointer items-center gap-2 rounded-full font-bold uppercase tracking-widest transition-[background,color,box-shadow,padding] duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 ${
                isScrolled && !isOpen
                  ? "bg-brand-orange text-white shadow-md hover:shadow-brand-orange/40 px-6 md:px-7 py-3 md:py-3.5 text-xs md:text-sm"
                  : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white px-6 md:px-8 py-3 md:py-4 text-sm"
              }`}
            >
              <Heart
                className={`transition-[color,width,height] duration-500 ${
                  isScrolled && !isOpen
                    ? "text-white w-4 h-4 md:w-5 md:h-5"
                    : "text-brand-orange group-hover:text-white w-5 h-5"
                }`}
              />
              Помочь нам
            </MagneticButton>

            <MagneticButton
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isOpen}
              className={`flex cursor-pointer items-center justify-center rounded-full transition-[background,color,box-shadow] duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 ${
                isScrolled && !isOpen
                  ? "bg-brand-orange text-white shadow-md hover:shadow-brand-orange/40 h-12 w-12 sm:h-14 sm:w-14"
                  : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white h-12 w-12 sm:h-14 sm:w-14"
              }`}
            >
              {isOpen ? <X className={isScrolled ? "w-5 h-5" : "w-6 h-6"} /> : <Menu className={isScrolled ? "w-5 h-5" : "w-6 h-6"} />}
            </MagneticButton>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-brand-orange px-6 text-brand-cream"
          >
            <div className="flex flex-col items-start gap-6 sm:gap-8 text-3xl sm:text-5xl md:text-6xl font-heading font-medium w-full max-w-2xl mx-auto pl-4">
              {[
                { label: "О нас", id: "about", href: "https://domlobova.ru/" },
                { label: "Истории подопечных", id: "stories" },
                { label: "Наши потребности", id: "funds" },
                { label: "Сборы", id: "campaigns" },
                { label: "Контакты", id: "contacts" },
              ].map((item, i) => {
                const isExternal = !!item.href;
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    key={item.id}
                    href={isExternal ? item.href : `#${item.id}`}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!isExternal) {
                        e.preventDefault();
                        scrollTo(item.id);
                      }
                    }}
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
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
};

export { Header };
