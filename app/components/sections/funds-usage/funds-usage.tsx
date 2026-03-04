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
      color: "bg-[#EB6C39]",
      img: "/images/4.webp",
      top: "top-24",
    },
    {
      title: "Оборудование",
      num: "02",
      desc: "Инвалидные коляски, многофункциональные кровати, кислородные концентраторы для облегчения жизни.",
      color: "bg-[#E5793F]",
      img: "/images/5.webp",
      top: "top-32",
    },
    {
      title: "Работа специалистов",
      num: "03",
      desc: "Оплата сложного труда профессиональных сиделок, врачей паллиативной помощи и психологов.",
      color: "bg-[#D96332]",
      img: "/images/6.webp",
      top: "top-40",
    },
    {
      title: "Бытовые нужды",
      num: "04",
      desc: "Закупка чистящих средств, предметов гигиены, а также частичная оплата коммунальных услуг.",
      color: "bg-[#EB6C39]",
      img: "/images/1.webp",
      top: "top-48",
    },
    {
      title: "Реабилитация и досуг",
      num: "05",
      desc: "Арт-терапия, восстановительные массажи, организация праздников и концертов.",
      color: "bg-[#E5793F]",
      img: "/images/2.webp",
      top: "top-56",
    },
    {
      title: "Развитие и комфорт",
      num: "06",
      desc: "Постоянное улучшение условий проживания: ремонт палат, обновление мебели и создание безопасной среды.",
      color: "bg-[#D96332]",
      img: "/images/3.webp",
      top: "top-64",
    },
  ];

  const colors = [
    "bg-[#EB6C39]", // Brand orange
    "bg-[#E5793F]", // Slightly warmer
    "bg-[#D96332]", // Slightly deeper
  ];
  const topsMobile = ["top-[64px]", "top-[72px]", "top-[80px]", "top-[88px]", "top-[96px]", "top-[104px]"];
  const topsDesktop = ["md:top-24", "md:top-32", "md:top-40", "md:top-48", "md:top-56", "md:top-64"];

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
        top: topsMobile[idx % topsMobile.length] + " " + topsDesktop[idx % topsDesktop.length],
      }))
    : items;

  return (
    <section
      id="funds"
      className="bg-white py-16 md:py-20 rounded-2xl md:rounded-[3rem] lg:rounded-[5rem] mx-3 md:mx-6 my-14 md:my-20 border border-brand-brown/5 shadow-sm relative z-30"
    >
      <div className="mx-auto max-w-[1300px] px-5 md:px-8">
        <div className="mb-8 md:mb-12 lg:mb-16 text-center">
          <div className="mb-6 inline-flex rounded-full bg-white px-6 py-2 shadow-sm border border-brand-brown/5">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Важная поддержка
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown uppercase">
            {renderHighlightedTitle(titleString, "text-brand-orange italic")}
          </h2>
        </div>

        <div className="relative pb-0">
          {mappedItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`group sticky ${item.top} mb-6 md:mb-10 overflow-hidden rounded-2xl md:rounded-[3rem] ${item.color} shadow-[0_15px_40px_rgba(0,0,0,0.06)] h-auto md:h-[480px] transition-transform duration-500 transform-gpu`}
            >
              <div className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} h-full`}>
                {/* Текстовая часть */}

                <div className="relative w-full md:w-1/2 p-5 md:p-8 lg:p-14 flex flex-col justify-center overflow-visible">
                  {/* Huge Watermark Number */}
                  <div className="absolute right-2 top-2 md:right-auto md:left-0 md:top-0 font-heading text-[80px] md:text-[160px] lg:text-[220px] font-black text-white/10 select-none pointer-events-none leading-none tracking-tighter">
                    {item.num}
                  </div>

                  <div className="relative z-10 mb-4 md:mb-6 inline-flex self-start rounded-full bg-white/50 px-4 py-1.5 md:px-6 md:py-2 shadow-sm border border-white/50">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/80">
                      Направление {item.num}
                    </span>
                  </div>

                  <h3 className="relative z-10 mb-3 md:mb-6 font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {item.title}
                  </h3>

                  <p className="relative z-10 text-base md:text-lg font-medium text-white/85 leading-relaxed max-w-[90%] mb-6 md:mb-10">
                    {item.desc}
                  </p>

                  <a href="#" className="relative z-10 mt-auto flex w-fit items-center gap-4 text-white font-bold uppercase tracking-widest text-xs md:text-sm group-hover:gap-6 transition-[gap,opacity] duration-500 cursor-pointer opacity-80 group-hover:opacity-100">
                    <span>Подробнее</span>
                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-brand-orange transition-colors duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </a>
                </div>

                {/* Иллюстрация */}

                <div className="relative w-full md:w-1/2 h-[200px] md:h-full p-3 md:p-5 lg:p-8">
                  <div className="w-full h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] scale-105 group-hover:scale-110"
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
