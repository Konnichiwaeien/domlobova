"use client";

import { motion } from "framer-motion";

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

  // Дублируем массив в 4 раза, чтобы анимация сдвига на 50% работала абсолютно бесшовно
  const loopPhotos = [...displayPhotos, ...displayPhotos, ...displayPhotos, ...displayPhotos];

  return (
    <section className="relative z-40 bg-brand-cream py-14 md:py-20 overflow-hidden pointer-events-none">
      <div className="w-full flex">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 pointer-events-auto w-max px-3"
        >
          {loopPhotos.map((src, i) => (
            <div
              key={i}
              className="relative h-[250px] w-[350px] shrink-0 overflow-hidden rounded-[2rem] shadow-xl shadow-brand-brown/5 border border-brand-brown/5 group cursor-pointer"
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover  transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { PhotoMarquee };
