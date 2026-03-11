"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, Users, Star, ArrowRight } from "lucide-react";

interface FeaturesMarqueeProps {
  features?: any[];
}

const FeaturesMarquee = ({ features }: FeaturesMarqueeProps) => {
  // If no features provided from CMS, use fallback data to ensure marquee works
  const fallbackFeatures = [
    {
      title: "Комплексный уход",
      descr: "Мы обеспечиваем профессиональный медицинский уход, психологическую поддержку и помощь в решении бытовых вопросов.",
      image: { url: "/images/1.webp" }
    },
    {
      title: "Домашняя атмосфера",
      descr: "В Доме милосердия создана уютная обстановка, где каждый подопечный чувствует себя как дома, окруженный заботой.",
      image: { url: "/images/2.webp" }
    },
    {
      title: "Команда специалистов",
      descr: "С подопечными работают опытные врачи, медсестры, психологи и социальные работники, преданные своему делу.",
      image: { url: "/images/3.webp" }
    },
    {
      title: "Духовная поддержка",
      descr: "Мы с уважением относимся к духовным потребностям каждого человека, предоставляя возможность бесед со священнослужителями.",
      image: { url: "/images/4.webp" }
    }
  ];

  const displayFeatures = features?.length ? features : fallbackFeatures;

  // Duplicate for seamless infinite scrolling
  const loopFeatures = [...displayFeatures, ...displayFeatures, ...displayFeatures];

  return (
    <section className="relative z-30 bg-brand-cream py-12 md:py-16 lg:py-20 overflow-hidden pointer-events-none">
      <div className="w-full flex">
        {/* We animate x from 0 to -33.33% because we duplicated the array 3 times */}
        <motion.div
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 md:gap-6 pointer-events-auto w-max px-3 will-change-transform"
        >
          {loopFeatures.map((feature, idx) => {
            const defaultStyling = [
              { icon: HeartHandshake, color: "text-brand-orange", bgColor: "bg-[#FDFBF7]" },
              { icon: ShieldCheck, color: "text-brand-yellow", bgColor: "bg-[#FDFBF7]" },
              { icon: Users, color: "text-[#E07A5F]", bgColor: "bg-[#FDFBF7]" },
              { icon: Star, color: "text-[#81B29A]", bgColor: "bg-[#FDFBF7]" },
            ];
            const style = defaultStyling[idx % defaultStyling.length];
            const Icon = style.icon;
            const imgSrc = feature.image?.url || `/images/${(idx % 4) + 1}.webp`;

            return (
              <div
                key={idx}
                className={`relative h-[280px] w-[400px] md:h-[300px] md:w-[460px] shrink-0 overflow-hidden rounded-2xl md:rounded-[2rem] shadow-xl shadow-brand-brown/5 border border-brand-brown/5 group cursor-pointer ${style.bgColor} transform-gpu`}
              >
                {/* Background Image Always Visible */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
                  <img
                    src={imgSrc}
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none opacity-90"
                    alt={feature.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 pointer-events-none" />
                </div>

                <div className="relative z-10 w-full h-full p-5 md:p-6 flex flex-col justify-between">
                  {/* Top: Icons */}
                  <div className="flex justify-between items-start">
                    <div className="inline-flex rounded-full p-3 md:p-4 bg-black/20 shadow-sm border border-white/10 text-white group-hover:bg-black/30 transition-colors duration-700">
                      <Icon className="h-5 w-5 md:h-7 md:w-7" strokeWidth={1.5} />
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white/20 group-hover:text-white group-hover:-rotate-45 transition-[background,color,transform] duration-500 delay-100">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>

                  {/* Bottom: Text */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <h4 className="font-heading text-xl md:text-2xl font-black mb-2 text-white leading-tight">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-white/90 leading-snug font-medium transition-colors duration-500 line-clamp-3">
                      {feature.descr}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export { FeaturesMarquee };
