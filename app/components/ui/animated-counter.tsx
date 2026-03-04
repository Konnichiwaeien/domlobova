"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate, motion } from "framer-motion";

interface AnimatedCounterProps {
  /** Target number to count up to */
  target: number;
  /** Number of decimal places (e.g. 1 for "1.5") */
  decimals?: number;
  /** Text to show after the number (e.g. "+", " млн ₽") */
  suffix?: string;
  /** Text to show before the number */
  prefix?: string;
  /** Duration of animation in seconds */
  duration?: number;
  /** Locale for number formatting */
  locale?: string;
  /** Additional className for the number span */
  className?: string;
}

const AnimatedCounter = ({
  target,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 2,
  locale = "ru-RU",
  className,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);

  const rounded = useTransform(motionValue, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals).replace(".", ",");
    }
    return Math.round(latest).toLocaleString(locale);
  });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, target, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
    }
  }, [isInView, motionValue, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix && (
        <span>{suffix}</span>
      )}
    </span>
  );
};

export { AnimatedCounter };
