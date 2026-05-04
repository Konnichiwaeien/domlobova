"use client";

import { memo } from "react";
import Image from "next/image";

const MarqueeStyles = memo(() => (
  <style>{`
    @keyframes marquee-half {
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(-50%, 0, 0); }
    }
  `}</style>
));
MarqueeStyles.displayName = "MarqueeStyles";

interface PhotoMarqueeProps {
  photos?: string[];
}

const PhotoMarquee = ({ photos }: PhotoMarqueeProps) => {
  const defaultPhotos = [
    "/images/1.webp",
    "/images/2.webp",
    "/images/3.webp",
    "/images/4.webp",
    "/images/5.webp"
  ];

  const displayPhotos = photos?.length ? photos : defaultPhotos;

  // Дублируем массив в 2 раза (достаточно для бесшовного loop с -50%)
  const loopPhotos = [...displayPhotos, ...displayPhotos];

  return (
    <section className="relative z-30 bg-brand-cream py-2 md:py-16 overflow-hidden pointer-events-none">
      <MarqueeStyles />
      <div className="w-full flex">
        {/* Pure CSS animation — runs on compositor thread, zero main-thread cost */}
        <div
          style={{ animation: "marquee-half 45s linear infinite" }}
          className="flex gap-4 md:gap-6 pointer-events-auto w-max px-3 will-change-transform transform-gpu"
        >
          {loopPhotos.map((src, i) => (
            <div
              key={i}
              className="relative h-[320px] w-[440px] md:h-[280px] md:w-[400px] shrink-0 overflow-hidden rounded-2xl md:rounded-[2rem] shadow-xl shadow-brand-brown/5 border border-brand-brown/5 group cursor-pointer transform-gpu"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 768px) 440px, 400px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 transform-gpu"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PhotoMarquee };
