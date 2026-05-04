"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { useLenis } from "lenis/react";
import Image from "next/image";

// Morph keyframes — static CSS, rendered once via memo
const MorphStyles = memo(() => (
  <style>{`
    @keyframes morph1 {
      0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
      100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    }
    @keyframes morph2 {
      0%   { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
      50%  { border-radius: 70% 30% 40% 60% / 30% 70% 30% 70%; }
      100% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
    }
    @keyframes morph3 {
      0%   { border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%; }
      50%  { border-radius: 30% 70% 70% 30% / 40% 60% 40% 60%; }
      100% { border-radius: 70% 30% 30% 70% / 60% 40% 60% 40%; }
    }
    @keyframes morph4 {
      0%   { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
      50%  { border-radius: 60% 40% 50% 50% / 50% 50% 50% 60%; }
      100% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
    }
    @keyframes morph5 {
      0%   { border-radius: 50% 50% 40% 60% / 60% 40% 70% 30%; }
      50%  { border-radius: 40% 60% 50% 50% / 40% 60% 40% 60%; }
      100% { border-radius: 50% 50% 40% 60% / 60% 40% 70% 30%; }
    }
    .blob-1 { animation: morph1 12s ease-in-out infinite; }
    .blob-2 { animation: morph2 15s ease-in-out infinite reverse; }
    .blob-3 { animation: morph3 10s ease-in-out infinite; }
    .blob-4 { animation: morph2 14s ease-in-out infinite; }
    .blob-5 { animation: morph4 11s ease-in-out infinite alternate; }
    .blob-6 { animation: morph5 13s ease-in-out infinite alternate-reverse; }
  `}</style>
));
MorphStyles.displayName = "MorphStyles";

interface HeroTransitionProps {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  heroPhotos?: { url: string }[];
}

const DEFAULT_IMAGES = [
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg",
  "/images/11.jpg",
  "/images/12.jpg",
  "/images/13.jpg",
];

// Individual blob — memoized to prevent re-renders when siblings change
const Blob = memo(({ blob, mouseX, mouseY }: {
  blob: typeof DESKTOP_BLOBS[number];
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) => {
  const x = useTransform(mouseX, (v) => v * blob.mx);
  const y = useTransform(mouseY, (v) => v * blob.my);

  return (
    <div
      style={{
        position: "absolute",
        left: blob.cx,
        top: blob.cy,
        width: blob.w,
        height: blob.h,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: blob.delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ x, y, width: "100%", height: "100%", willChange: "border-radius, transform" }}
        className={`relative shadow-2xl overflow-hidden transform-gpu ${blob.blobClass}`}
      >
        <Image src={blob.img} alt="" aria-hidden="true" fill sizes="33vw" priority={blob.id <= 3} className="object-cover scale-110" />
      </motion.div>
    </div>
  );
});
Blob.displayName = "Blob";

// Static blob config — defined outside component to avoid recreation
const DESKTOP_BLOBS_CONFIG = [
  { id: 1, blobClass: "blob-1", imgIdx: 0, cx: "12vw", cy: "22vh", w: "27vw", h: "27vw", mx: -0.7, my: -0.5, delay: 0 },
  { id: 2, blobClass: "blob-4", imgIdx: 1, cx: "8vw", cy: "68vh", w: "25vw", h: "25vw", mx: -0.5, my: 0.6, delay: 0.2 },
  { id: 3, blobClass: "blob-2", imgIdx: 2, cx: "86vw", cy: "18vh", w: "24vw", h: "24vw", mx: 0.8, my: -0.6, delay: 0.1 },
  { id: 4, blobClass: "blob-3", imgIdx: 3, cx: "90vw", cy: "55vh", w: "18vw", h: "18vw", mx: 0.9, my: 0.3, delay: 0.25 },
  { id: 5, blobClass: "blob-6", imgIdx: 4, cx: "80vw", cy: "78vh", w: "26vw", h: "26vw", mx: 0.6, my: 0.7, delay: 0.15 },
  { id: 6, blobClass: "blob-5", imgIdx: 5, cx: "35vw", cy: "85vh", w: "20vw", h: "20vw", mx: -0.3, my: 0.8, delay: 0.35 },
  { id: 7, blobClass: "blob-3", imgIdx: 6, cx: "58vw", cy: "90vh", w: "14vw", h: "14vw", mx: 0.2, my: 0.9, delay: 0.4 },
] as const;

// Placeholder type for blob with resolved image
type BlobData = Omit<typeof DESKTOP_BLOBS_CONFIG[number], 'imgIdx'> & { img: string };
const DESKTOP_BLOBS: BlobData[] = []; // populated at runtime

export const HeroTransition = ({
  titleTop,
  titleBottom,
  heroDescription,
  heroPhotos,
}: HeroTransitionProps) => {
  const lenis = useLenis();
  const [mobileSlide, setMobileSlide] = useState(0);

  // Motion values for mouse — update WITHOUT triggering React re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const images = useMemo(() => {
    if (!heroPhotos || heroPhotos.length === 0) return DEFAULT_IMAGES;
    // Use Strapi photos where available, fall back to local defaults for gaps
    return DEFAULT_IMAGES.map((def, i) => heroPhotos[i]?.url ?? def);
  }, [heroPhotos]);

  // Resolve blob configs with actual image URLs
  const desktopBlobs = useMemo<BlobData[]>(
    () => DESKTOP_BLOBS_CONFIG.map(({ imgIdx, ...rest }) => ({ ...rest, img: images[imgIdx] })),
    [images]
  );

  const handleScrollTo = useCallback((id: string) => {
    if (lenis) {
      lenis.scrollTo(id, { offset: -50 });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lenis]);

  const openDonation = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-donation-modal'));
  }, []);

  // Mobile slider — only runs on mobile via matchMedia
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    const timer = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  // Mouse handler — RAF-throttled, writes to MotionValues, zero re-renders
  const rafId = useRef<number>(0);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      mouseX.set((x / window.innerWidth - 0.5) * 24);
      mouseY.set((y / window.innerHeight - 0.5) * 24);
    });
  }, [mouseX, mouseY]);

  return (
    <>
      <MorphStyles />

      <div
        id="hero"
        className="relative min-h-screen bg-[#FDFCF8] overflow-hidden"
        onMouseMove={handleMouseMove}
      >

        {/* ════════════════════════════════════════
            DESKTOP LAYOUT
            ════════════════════════════════════════ */}
        <div className="hidden md:flex h-screen items-center justify-center">

          {/* Desktop blobs */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {desktopBlobs.map((blob) => (
              <Blob key={blob.id} blob={blob} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </div>

          {/* Desktop text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 text-center max-w-xl px-4 pointer-events-none"
          >
            <h1 className="font-heading text-center flex flex-col items-center mb-6">
              {titleTop && (
                <span className="text-[9vw] xl:text-[100px] 2xl:text-[130px] font-black leading-none uppercase tracking-normal whitespace-nowrap text-[#1A1A1A]">
                  {titleTop}
                </span>
              )}
              {titleBottom && (
                <span className="text-[#E65C3D] italic font-bold text-[11vw] xl:text-[115px] 2xl:text-[140px] leading-none -mt-3 lg:-mt-5 tracking-tight whitespace-nowrap">
                  {titleBottom}
                </span>
              )}
            </h1>

            {heroDescription && (
              <p className="text-lg text-slate-800 font-medium max-w-lg mx-auto mb-10 pointer-events-auto leading-relaxed">
                {heroDescription}
              </p>
            )}

            <div className="pointer-events-auto flex justify-center">
              <button
                onClick={openDonation}
                className="px-10 py-5 bg-[#E65C3D] text-white rounded-full font-semibold hover:bg-[#1A1A1A] transition-all duration-500 flex items-center gap-3 group shadow-xl cursor-pointer"
              >
                <Heart size={18} className="fill-white group-hover:scale-110 transition-transform duration-300" />
                ПОМОЧЬ
              </button>
            </div>
          </motion.div>
        </div>


        {/* ════════════════════════════════════════
            MOBILE LAYOUT
            Photo blob on top, text below — clean vertical stack
            ════════════════════════════════════════ */}
        <div className="md:hidden flex flex-col items-center justify-start h-full px-6 gap-5 pt-28">

          {/* Featured photo blob — auto-sliding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="blob-1 overflow-hidden shadow-2xl shrink-0 relative transform-gpu"
            style={{ width: "74vw", height: "74vw", willChange: "border-radius, transform" }}
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={mobileSlide}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={images[mobileSlide]}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority={mobileSlide === 0}
                  sizes="80vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1 className="font-heading text-center flex flex-col items-center mb-4">
              {titleTop && (
                <span className="text-[12vw] font-black leading-none uppercase text-[#1A1A1A]">
                  {titleTop}
                </span>
              )}
              {titleBottom && (
                <span className="text-[#E65C3D] italic font-bold text-[13.5vw] leading-none -mt-1 tracking-tight">
                  {titleBottom}
                </span>
              )}
            </h1>

            {heroDescription && (
              <p className="text-sm text-slate-800 font-medium max-w-xs mx-auto mb-6 leading-relaxed">
                {heroDescription}
              </p>
            )}

            <div className="flex flex-col items-center justify-center gap-3 pb-8">
              <button
                onClick={openDonation}
                className="w-full sm:w-auto px-8 py-4 bg-[#E65C3D] text-white rounded-full font-semibold hover:bg-[#1A1A1A] transition-all duration-500 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
              >
                <Heart size={16} className="fill-white" />
                ПОМОЧЬ
              </button>
            </div>
          </motion.div>
        </div>

      </div>

    </>
  );
};
