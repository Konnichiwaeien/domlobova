"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormDonation } from "../../form-donation";
import { useLenis } from "lenis/react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const lenis = useLenis();

  // Always-current refs — never added to effect deps
  const lenisRef = useRef(lenis);
  const onCloseRef = useRef(onClose);
  useEffect(() => { lenisRef.current = lenis; });
  useEffect(() => { onCloseRef.current = onClose; });

  // Keyboard — depends only on isOpen
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Scroll lock — depends ONLY on isOpen
  // Must stop Lenis because it registers its wheel listener before the modal
  // and processes events in capture-phase order (first-registered = first-run)
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
  }, [isOpen]); // ← only isOpen, lenis accessed via ref — no spurious cleanups

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10"
          data-lenis-prevent={true}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[1300px] flex justify-center"
          >
            <FormDonation className="max-h-[90vh] md:max-h-[85vh]" onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
