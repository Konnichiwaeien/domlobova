"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN_DISPLAY_MS = 2400; // Minimum time for brand impression

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const startTime = useRef(Date.now());

  // Use refs to avoid stale closure issues in callbacks
  const videoReady = useRef(false);
  const pageReady = useRef(false);
  const minTimeReached = useRef(false);
  const hasStartedExit = useRef(false);

  useEffect(() => {
    // Central check: all 3 conditions must be met
    const tryFinish = () => {
      if (
        videoReady.current &&
        pageReady.current &&
        minTimeReached.current &&
        !hasStartedExit.current
      ) {
        hasStartedExit.current = true;
        setProgress(100);
        setTimeout(() => setIsExiting(true), 350);
      }
    };

    // ── 1. Minimum display timer ──────────────────────────
    const minTimer = setTimeout(() => {
      minTimeReached.current = true;
      tryFinish();
    }, MIN_DISPLAY_MS);

    // ── 2. Page readiness (document.readyState) ───────────
    const checkPage = () => {
      if (document.readyState === "complete") {
        pageReady.current = true;
        tryFinish();
      }
    };

    if (document.readyState === "complete") {
      pageReady.current = true;
    } else {
      window.addEventListener("load", checkPage);
    }

    // ── 3. Hero video readiness ───────────────────────────
    let videoCleanup: (() => void) | undefined;

    const pollVideo = () => {
      const video = document.querySelector<HTMLVideoElement>(
        'video[poster="/posters/hero-poster.jpg"]'
      );

      if (!video) {
        // Video not in DOM yet, retry
        setTimeout(pollVideo, 200);
        return;
      }

      const onVideoReady = () => {
        videoReady.current = true;
        tryFinish();
      };

      // Already loaded enough to play?
      if (video.readyState >= 3) {
        onVideoReady();
        return;
      }

      // Track buffering progress for the progress bar
      const onBufferProgress = () => {
        if (video.buffered.length > 0) {
          const buffered = video.buffered.end(0);
          const duration = video.duration || 10;
          const pct = Math.min((buffered / duration) * 100, 92);
          setProgress((prev) => Math.max(prev, pct));
        }
      };

      video.addEventListener("canplaythrough", onVideoReady, { once: true });
      video.addEventListener("loadeddata", onVideoReady, { once: true });
      video.addEventListener("progress", onBufferProgress);

      videoCleanup = () => {
        video.removeEventListener("canplaythrough", onVideoReady);
        video.removeEventListener("loadeddata", onVideoReady);
        video.removeEventListener("progress", onBufferProgress);
      };
    };

    const pollTimer = setTimeout(pollVideo, 80);

    // ── 4. Failsafe: force dismiss after 8s ──────────────
    const failsafe = setTimeout(() => {
      if (!hasStartedExit.current) {
        hasStartedExit.current = true;
        setProgress(100);
        setTimeout(() => setIsExiting(true), 300);
      }
    }, 8000);

    // ── 5. Simulated progress (smooth, caps at 88%) ──────
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const elapsed = Date.now() - startTime.current;
        const speed = Math.min(elapsed / 1000, 3) * 2.5;
        return Math.min(prev + speed + Math.random() * 3, 88);
      });
    }, 160);

    // ── Cleanup ──────────────────────────────────────────
    return () => {
      clearTimeout(minTimer);
      clearTimeout(failsafe);
      clearTimeout(pollTimer);
      clearInterval(interval);
      window.removeEventListener("load", checkPage);
      videoCleanup?.();
    };
  }, []); // Empty deps — runs once, all state tracked via refs

  // Lock scroll while preloader is visible
  useEffect(() => {
    if (!isDone) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDone]);

  // After exit animation finishes
  const handleExitComplete = () => {
    setIsDone(true);
    document.body.style.overflow = "";
  };

  if (isDone) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center"
          style={{ background: "#FDF9F1" }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #2A2520 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Animated house icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-10"
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-lg"
            >
              <motion.path
                d="M12 3 L2 12 H5 V21 H19 V12 H22 L16 6.6 V3 H13 V3.9 L12 3 Z"
                stroke="#EB6C39"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#EB6C39"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.12 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
              <motion.rect
                x="9" y="13" width="6" height="8"
                rx="0.5"
                stroke="#EB6C39"
                strokeWidth="0.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              <motion.rect
                x="10" y="8" width="4" height="3"
                rx="0.5"
                stroke="#EB6C39"
                strokeWidth="0.5"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </svg>

            {/* Pulsing warm glow */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(235,108,57,0.12) 0%, transparent 70%)",
                transform: "scale(3)",
              }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2
              className="font-heading text-2xl md:text-3xl font-black tracking-tighter uppercase"
              style={{ color: "#2A2520" }}
            >
              ДОМ МИЛОСЕРДИЯ
            </h2>
            <p
              className="text-sm md:text-base font-medium tracking-[0.3em] uppercase mt-1.5"
              style={{ color: "#EB6C39" }}
            >
              кузнеца Лобова
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="w-[min(220px,55vw)]"
            style={{ transformOrigin: "center" }}
          >
            <div
              className="h-[2px] rounded-full overflow-hidden"
              style={{ background: "rgba(42,37,32,0.06)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #EB6C39, #ECA42A)",
                  transition: "width 0.35s ease-out",
                }}
              />
            </div>
            <p
              className="text-center mt-4 text-[10px] font-bold tracking-[0.25em] uppercase tabular-nums"
              style={{ color: "rgba(42,37,32,0.3)" }}
            >
              {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Preloader };
