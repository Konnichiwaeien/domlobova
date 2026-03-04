"use client";

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
  <div
    className="absolute rounded-full opacity-60 mix-blend-multiply blur-[80px] pointer-events-none z-0 transform-gpu"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top,
      left,
      right,
      animation: `blob-float ${10 + delay}s ease-in-out infinite`,
    }}
  />
);

export { LiquidBlob };
