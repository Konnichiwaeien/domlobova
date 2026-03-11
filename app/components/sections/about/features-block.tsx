"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, Users, Star, ArrowRight } from "lucide-react";

interface FeaturesBlockProps {
  features?: any[];
}

const FeaturesBlock = ({ features }: FeaturesBlockProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pb-6 md:pb-10 relative z-30 px-0 md:px-0">
      {features && features.length > 0 ? (
        features.map((feature, idx) => {
          // Determine icon and colors based on index to maintain the existing design feel
          const defaultStyling = [
            { icon: HeartHandshake, color: "text-brand-orange", bgColor: "bg-[#FDFBF7]" },
            { icon: ShieldCheck, color: "text-brand-yellow", bgColor: "bg-[#FDFBF7]" },
            { icon: Users, color: "text-[#E07A5F]", bgColor: "bg-[#FDFBF7]" },
            { icon: Star, color: "text-[#81B29A]", bgColor: "bg-[#FDFBF7]" },
          ];
          const style = defaultStyling[idx % defaultStyling.length];
          const Icon = style.icon;
          const imgSrc = feature.image?.url || `/images/${(idx % 4) + 1}.webp`;
          const isLastAndOdd = features.length % 2 !== 0 && idx === features.length - 1;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl md:rounded-[2.5rem] ${style.bgColor} border border-brand-brown/5 h-[420px] md:h-[400px] cursor-pointer transform-gpu ${
                isLastAndOdd ? "md:col-span-2" : ""
              }`}
            >
              {/* Hover shadow layer */}
              <div className="absolute inset-0 rounded-2xl md:rounded-[2.5rem] shadow-lg group-hover:shadow-xl transition-shadow duration-700 pointer-events-none z-20" />

              {/* Background Image Always Visible */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl md:rounded-[2.5rem] pointer-events-none transform-gpu">
                <img
                  src={imgSrc}
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none"
                  alt={feature.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="relative z-10 w-full h-full p-5 md:p-8 flex flex-col justify-between">
                {/* Top: Icons */}
                <div className="flex justify-between items-start">
                  <div
                    className={`inline-flex rounded-full p-4 bg-black/20 shadow-sm border border-white/10 text-white group-hover:bg-black/30 transition-colors duration-700`}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-white/20 group-hover:text-white group-hover:-rotate-45 transition-[background,color,transform] duration-500 delay-100">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </div>

                {/* Bottom: Text */}
                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <h4 className="font-heading text-[1.7rem] md:text-2xl lg:text-3xl font-black mb-2 md:mb-3 text-white">
                    {feature.title}
                  </h4>
                  <p className="text-base md:text-base lg:text-lg text-white/90 leading-relaxed md:leading-relaxed font-medium transition-colors duration-500 line-clamp-4 md:line-clamp-none">
                    {feature.descr}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })
      ) : null}
    </div>
  );
};

export { FeaturesBlock };
