"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FormDonation } from "../../form-donation";
import { useLenis } from "lenis/react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Hard-lock scroll by adding a CSS class with !important rules.
 * Also physically stops Lenis's RAF loop so it can't process wheel events.
 */
const lockScroll = () => {
  document.documentElement.classList.add("scroll-locked");
};

const unlockScroll = () => {
  document.documentElement.classList.remove("scroll-locked");
};

export const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      lenis?.stop();
      lockScroll();

      // Block wheel events from reaching Lenis at the window level
      const blockWheel = (e: WheelEvent) => {
        // Allow wheel events ONLY inside elements with data-lenis-prevent
        const target = e.target as HTMLElement;
        if (target.closest("[data-lenis-prevent]")) {
          // Let the modal's internal scroll handle it
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      };

      window.addEventListener("wheel", blockWheel, { passive: false, capture: true });

      return () => {
        window.removeEventListener("wheel", blockWheel, true);
        document.removeEventListener("keydown", handleEscape);
        unlockScroll();
        lenis?.start();
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape, lenis]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10"
          data-lenis-prevent={true}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[1300px] flex justify-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-1 md:-top-4 md:-right-4 z-50 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-white text-brand-brown hover:bg-brand-orange hover:text-white transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] cursor-pointer backdrop-blur-sm border border-brand-brown/5"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </button>

            <FormDonation className="max-h-[90vh] md:max-h-[85vh]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
