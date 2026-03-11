"use client";

import React from "react";
import { renderHighlightedTitle } from "../../../utils/text-parser";
import { motion } from "framer-motion";
import { Pill, Activity, Users, Home, Music, Sparkles } from "lucide-react";

interface FundsUsageProps {
  data?: any;
}

const FundsUsage = ({ data }: FundsUsageProps) => {
  const rawItems = [
    {
      title: "Медикаменты и питание",
      num: "01",
      desc: "Специализированное питание, пеленки, противопролежневые средства и жизненно важные препараты.",
    },
    {
      title: "Оборудование",
      num: "02",
      desc: "Инвалидные коляски, многофункциональные кровати, кислородные концентраторы для облегчения жизни.",
    },
    {
      title: "Работа специалистов",
      num: "03",
      desc: "Оплата труда профессиональных сиделок, врачей паллиативной помощи и психологов.",
    },
    {
      title: "Бытовые нужды",
      num: "04",
      desc: "Закупка чистящих средств, предметов гигиены, оплата коммунальных услуг.",
    },
    {
      title: "Реабилитация и досуг",
      num: "05",
      desc: "Арт-терапия, восстановительные массажи, организация праздников и концертов.",
    },
    {
      title: "Развитие и комфорт",
      num: "06",
      desc: "Улучшение условий: ремонт палат, обновление мебели и создание безопасной среды.",
    },
  ];

  const blockData = Array.isArray(data) ? data[0] : (data || {});
  
  const titleString = blockData?.title || "НА ЧТО *НУЖНЫ* СРЕДСТВА";
  const innerNeeds = blockData?.needs || [];

  const mappedItems = innerNeeds && innerNeeds.length > 0
    ? innerNeeds.map((need: any, idx: number) => ({
        title: need.title || "",
        num: String(idx + 1).padStart(2, '0'),
        desc: need.descr || "",
      }))
    : rawItems;

  const icons = [Pill, Activity, Users, Home, Music, Sparkles];

  return (
    <section
      id="funds"
      className="bg-white py-16 md:py-24 lg:py-28 relative z-30 transition-colors duration-500"
    >
      <div className="mx-auto max-w-[1300px] px-5 md:px-8">
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown uppercase mb-4 leading-tight">
              {renderHighlightedTitle(titleString, "text-brand-orange italic")}
            </h2>
            <p className="text-brand-brown-light font-medium text-lg leading-relaxed max-w-xl">
              Ваши пожертвования помогают Дому милосердия бесперебойно работать и оказывать качественную помощь подопечным.
            </p>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {mappedItems.map((item: any, idx: number) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                className="group relative bg-white rounded-4xl p-8 md:p-10 flex flex-col justify-between border border-brand-brown/5 shadow-sm hover:shadow-[0_20px_40px_rgba(235,108,57,0.08)] transition-all duration-500 overflow-hidden will-change-transform"
              >
                {/* Soft background glow on hover */}
                <div className="absolute -inset-20 bg-linear-to-br from-brand-orange/0 via-brand-orange/0 to-brand-orange/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:-rotate-6 transition-all duration-500 shadow-sm border border-brand-brown/5">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div className="font-heading text-3xl font-black text-brand-brown/10 group-hover:text-brand-orange/20 transition-colors duration-500">
                      {item.num}
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl font-black text-brand-brown mb-4 group-hover:text-brand-orange transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-brand-brown-light leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
                
                {/* Decorative bottom line */}
                <div className="absolute bottom-0 left-8 right-8 h-[3px] bg-brand-brown/5 rounded-t-lg overflow-hidden">
                   <div className="w-0 h-full bg-brand-orange group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export { FundsUsage };
