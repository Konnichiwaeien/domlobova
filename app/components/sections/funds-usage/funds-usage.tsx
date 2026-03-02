"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { renderHighlightedTitle } from "../../../utils/text-parser";

interface FundsUsageProps {
  data?: any;
}

const FundsUsage = ({ data }: FundsUsageProps) => {
  const items = [
    {
      title: "Медикаменты и питание",
      num: "01",
      desc: "Специализированное питание, пеленки, противопролежневые средства и жизненно важные препараты.",
      color: "bg-[#F5EFE6]",
      img: "/images/4.webp",
      top: "top-24",
    },
    {
      title: "Оборудование",
      num: "02",
      desc: "Инвалидные коляски, многофункциональные кровати, кислородные концентраторы для облегчения жизни.",
      color: "bg-[#FFEAA7]",
      img: "/images/5.webp",
      top: "top-32",
    },
    {
      title: "Работа специалистов",
      num: "03",
      desc: "Оплата сложного труда профессиональных сиделок, врачей паллиативной помощи и психологов.",
      color: "bg-[#FFD1C1]",
      img: "/images/6.webp",
      top: "top-40",
    },
    {
      title: "Бытовые нужды",
      num: "04",
      desc: "Закупка чистящих средств, предметов гигиены, а также частичная оплата коммунальных услуг.",
      color: "bg-[#E2F0CB]",
      img: "/images/1.webp",
      top: "top-48",
    },
    {
      title: "Реабилитация и досуг",
      num: "05",
      desc: "Арт-терапия, восстановительные массажи, организация праздников и концертов.",
      color: "bg-[#C7CEEA]",
      img: "/images/2.webp",
      top: "top-56",
    },
    {
      title: "Развитие и комфорт",
      num: "06",
      desc: "Постоянное улучшение условий проживания: ремонт палат, обновление мебели и создание безопасной среды.",
      color: "bg-[#FDE1CD]",
      img: "/images/3.webp",
      top: "top-64",
    },
  ];

  const colors = [
    "bg-[#FFCC80]", // Bright warm orange
    "bg-[#FFB74D]", // Slightly deeper orange
    "bg-[#FFD1C1]", // Soft peach orange
    "bg-[#FFD54F]", // Yellowish orange
    "bg-[#FDE1CD]", // Pale peach orange 
    "bg-[#FFA726]"  // Bold vivid orange
  ];
  const tops = ["top-24", "top-32", "top-40", "top-48", "top-56", "top-64"];

  // Extract wrapper from array if it comes as an array of 1 item
  const blockData = Array.isArray(data) ? data[0] : (data || {});
  
  const titleString = blockData?.title || "НА ЧТО *НУЖНЫ* СРЕДСТВА";
  const innerNeeds = blockData?.needs || [];

  const mappedItems = innerNeeds && innerNeeds.length > 0
    ? innerNeeds.map((need: any, idx: number) => ({
        title: need.title || "",
        num: String(idx + 1).padStart(2, '0'),
        desc: need.descr || "",
        color: colors[idx % colors.length],
        img: Array.isArray(need.image) ? need.image[0]?.url : (need.image?.url || `/images/${(idx % 6) + 1}.webp`),
        top: tops[idx % tops.length],
      }))
    : items;

  return (
    <section
      id="funds"
      className="bg-white py-14 md:py-20 rounded-[3rem] md:rounded-[5rem] mx-2 md:mx-6 my-14 md:my-20 border border-brand-brown/5 shadow-sm relative z-30"
    >
      <div className="mx-auto max-w-[1300px] px-4 md:px-8">
        <div className="mb-10 md:mb-16 text-center">
          <div className="mb-6 inline-flex rounded-full bg-white px-6 py-2 shadow-sm border border-brand-brown/5">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Важная поддержка
            </span>
          </div>
          <h2 className="font-heading text-5xl font-black text-brand-brown md:text-7xl uppercase">
            {renderHighlightedTitle(titleString, "text-brand-orange italic")}
          </h2>
        </div>

        <div className="relative pb-0">
          {mappedItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`group sticky ${item.top} mb-12 overflow-hidden rounded-[3rem] ${item.color} shadow-[0_15px_40px_rgba(0,0,0,0.06)] h-auto md:h-[480px] transition-transform duration-500 border border-white/40`}
            >
              <div className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} h-full`}>
                {/* Текстовая часть */}

                <div className="relative w-full md:w-1/2 p-10 md:p-14 lg:p-16 flex flex-col justify-center overflow-visible">
                  {/* Huge Watermark Number */}
                  <div className="absolute -top-8 -left-4 md:-top-12 md:-left-8 font-heading text-[180px] md:text-[240px] lg:text-[280px] font-black text-[#4A3F35]/5 select-none pointer-events-none leading-none tracking-tighter mix-blend-multiply">
                    {item.num}
                  </div>

                  <div className="relative z-10 mb-6 inline-flex self-start rounded-full bg-white/50 backdrop-blur-sm px-6 py-2 shadow-sm border border-white/50">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#4A3F35]/80">
                      Направление {item.num}
                    </span>
                  </div>

                  <h3 className="relative z-10 mb-4 md:mb-6 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#4A3F35] leading-tight">
                    {item.title}
                  </h3>

                  <p className="relative z-10 text-lg md:text-xl font-medium text-[#4A3F35]/80 leading-relaxed max-w-[90%] mb-10">
                    {item.desc}
                  </p>

                  <a href="#" className="relative z-10 mt-auto flex w-fit items-center gap-4 text-[#4A3F35] font-bold uppercase tracking-widest text-xs md:text-sm group-hover:gap-6 transition-all duration-500 cursor-pointer opacity-80 group-hover:opacity-100">
                    <span>Подробнее</span>
                    <div className="w-10 h-10 rounded-full border border-[#4A3F35]/20 flex items-center justify-center group-hover:bg-[#4A3F35] group-hover:text-white transition-colors duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </a>
                </div>

                {/* Иллюстрация */}

                <div className="relative w-full md:w-1/2 h-[300px] md:h-full p-4 md:p-6 lg:p-8">
                  <div className="w-full h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 border-[6px] border-white/20 rounded-[2rem] md:rounded-[2.5rem] pointer-events-none mix-blend-overlay z-10"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FundsUsage };
