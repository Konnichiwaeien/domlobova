"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Heart, Menu, X, ArrowRight } from "lucide-react";
import { MagneticButton } from "../../ui/magnetic-button";
import { DonationModal } from "../../ui/donation-modal";
import { useLenis } from "lenis/react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState<{ id: string; title: string } | null>(null);

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
    const heroEnd = heroHeight || window.innerHeight;
    const threshold = heroEnd * 0.1;
    if (latest > threshold) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  });

  /* ── SCROLL-HIDE BEHAVIOR (commented out, preserved for future use) ──────
  const [hidden, setHidden] = useState(false);
  // In useMotionValueEvent:
  //   if (latest > threshold) {
  //     if (latest > previous) { if (!hidden) setHidden(true); }
  //     else { if (hidden) setHidden(false); }
  //   } else { if (hidden) setHidden(false); }
  //
  // In motion.header:
  //   variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
  //   animate={hidden && !isOpen ? "hidden" : "visible"}
  //   transition={{ duration: 0.35, ease: "easeInOut" }}
  ── END SCROLL-HIDE BEHAVIOR ──────────────────────────────────────────── */

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => { lenisRef.current = lenis; });

  // Lock body scroll AND stop Lenis when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = '';
      lenisRef.current?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenisRef.current?.start();
    };
  }, [isOpen]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Listen for global donation modal event (single source of truth)
  useEffect(() => {
    const handleOpenDonation = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.campaignId) {
        setModalCampaign({ id: detail.campaignId, title: detail.campaignTitle || 'Выбранный сбор' });
      } else {
        setModalCampaign(null);
      }
      setIsDonationOpen(true);
    };
    window.addEventListener("open-donation-modal", handleOpenDonation);
    return () => window.removeEventListener("open-donation-modal", handleOpenDonation);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,padding,box-shadow] duration-500 px-4 md:px-12 ${
          isScrolled && !isOpen ? "bg-[#F9F8F6] shadow-md py-3 md:py-4" : "bg-transparent py-4 md:py-8"
        }`}
      >
        <div className="flex w-full items-center">
          {/* Left: Menu button */}
          <div className="flex-none sm:flex-1 flex items-center justify-start">
            <MagneticButton
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isOpen}
              className={`flex cursor-pointer items-center justify-center rounded-full transition-[background,color,box-shadow] duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 ${
                isScrolled && !isOpen
                  ? "bg-brand-orange text-white shadow-md hover:shadow-brand-orange/40 h-10 w-10 sm:h-12 sm:w-12"
                  : "bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white h-10 w-10 sm:h-12 sm:w-12"
              }`}
            >
              {isOpen ? <X className={isScrolled ? "w-5 h-5" : "w-5 h-5"} /> : <Menu className={isScrolled ? "w-5 h-5" : "w-5 h-5"} />}
            </MagneticButton>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 sm:flex-none flex sm:block items-center ml-3 sm:ml-0">
            <a
              href="https://domlobova.ru/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="На главную"
              className="group flex cursor-pointer items-center gap-3 relative w-auto focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 rounded-lg"
            >
              <div className={`relative transition-[height] duration-500 ${
                isScrolled && !isOpen ? "h-8 sm:h-12 lg:h-14" : "h-10 sm:h-16 lg:h-20"
              }`}>
                <img
                  src="/logo-dark.svg"
                  alt="Дом Лобова"
                  className={`h-full w-auto object-contain transition-opacity duration-500 ${isOpen ? "opacity-0" : "opacity-100"}`}
                />
                <img
                  src="/logo-light.svg"
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            </a>
          </div>

          {/* Right: Помочь button */}
          <div className="flex-1 flex items-center justify-end">
            <MagneticButton
              onClick={() => setIsDonationOpen(true)}
              className={`group flex cursor-pointer items-center gap-2 rounded-full font-bold uppercase tracking-widest transition-[background,color,box-shadow,padding] duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 ${
                isScrolled && !isOpen
                  ? "bg-brand-orange text-white shadow-md hover:shadow-brand-orange/40 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm"
                  : "bg-brand-orange text-white lg:bg-brand-cream lg:text-brand-brown hover:bg-brand-orange hover:text-white px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm"
              }`}
            >
              <Heart
                className={`transition-[color,width,height] duration-500 ${
                  isScrolled && !isOpen
                    ? "text-white w-4 h-4"
                    : "text-white lg:text-brand-orange group-hover:text-white w-4 h-4"
                }`}
              />
              Помочь
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
        onClose={() => { setIsDonationOpen(false); setModalCampaign(null); }}
        campaignId={modalCampaign?.id}
        campaignTitle={modalCampaign?.title}
      />
    </>
  );
};

export { Header };
