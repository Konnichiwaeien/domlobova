"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

const MagneticButton = ({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);

  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });

  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;

    const { height, width, left, top } = ref.current.getBoundingClientRect();

    const middleX = clientX - (left + width / 2);

    const middleY = clientY - (top + height / 2);

    x.set(middleX * 0.3);

    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export { MagneticButton };
