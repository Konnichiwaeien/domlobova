"use client";

import { motion } from "framer-motion";

const LiquidBlob = ({
  color,
  size,
  top,
  left,
  right,
  delay = 0,
}: {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  delay?: number;
}) => (
  <motion.div
    className="absolute rounded-full opacity-60 mix-blend-multiply blur-[80px] pointer-events-none z-0"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top,
      left,
      right,
    }}
    animate={{
      x: [0, 50, -20, 0],
      y: [0, -40, 30, 0],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

export { LiquidBlob };
