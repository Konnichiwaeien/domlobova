'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLenis } from 'lenis/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LegalModal = ({ isOpen, onClose, title, children }: LegalModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { lenisRef.current = lenis; });
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard — Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Scroll lock — same mechanism as DonationModal to avoid conflicts
  useEffect(() => {
    if (!isOpen) return;

    lenisRef.current?.stop();
    document.documentElement.classList.add("scroll-locked");

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-99999 flex items-center justify-center p-4 md:p-8"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 shrink-0">
              <h3 className="font-heading text-xl md:text-2xl font-black text-brand-brown pr-8 leading-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div
              ref={contentRef}
              data-lenis-prevent
              className="overflow-y-auto px-8 pb-8 text-sm md:text-base text-brand-brown leading-relaxed legal-content overscroll-contain"
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
