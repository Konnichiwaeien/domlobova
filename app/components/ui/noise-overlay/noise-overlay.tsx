"use client";

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.05] mix-blend-multiply">
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>

      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

export { NoiseOverlay };
