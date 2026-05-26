"use client";

import React from "react";
import { renderHighlightedTitle } from "../../../utils/text-parser";
import { motion, useInView } from "framer-motion";
import { Pill, Activity, Users, Home, Music, Sparkles, Heart } from "lucide-react";

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
      className="bg-[#F9F8F6] py-16 md:py-24 lg:py-28 relative z-30 transition-colors duration-500 content-auto"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedItems.map((item: any, idx: number) => {
            const Icon = icons[idx % icons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ boxShadow: "0px 20px 40px rgba(235,108,57,0.08)" }}
                className="group relative bg-white rounded-4xl p-8 md:p-10 flex flex-col justify-between border border-brand-brown/5 shadow-sm overflow-hidden"
              >
                {/* Soft background glow on hover — optimized: using radial-gradient instead of expensive blur filter */}
                <div 
                  className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
                  style={{ background: 'radial-gradient(circle at center, rgba(235, 108, 57, 0.08) 0%, transparent 70%)' }}
                />

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
        </div>

        {/* Кнопка помочь */}
        <div className="flex justify-center mt-10 md:mt-14">
          <button
            onClick={() => {
              window.dispatchEvent(new Event('open-donation-modal'));
            }}
            className="bg-[#E65C3D] hover:bg-[#cc492a] text-white hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-orange/20 active:scale-[0.98] transition-all duration-300 rounded-full px-10 py-5 text-sm md:text-base font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/30"
          >
            Помочь <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </section>
  );
};

export { FundsUsage };
