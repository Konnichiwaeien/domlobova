"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Copy, Heart, Users, Bed, Home, Package, Activity } from "lucide-react";
import { motion } from "framer-motion";

const otherDonationsData = [
  {
    title: "Теплая одежда на зиму",
    description: "Сбор на теплые куртки, шапки и перчатки для наших подопечных в преддверии морозов.",
    goal: 500000,
    current: 340000,
    icon: Package,
    color: "text-brand-orange bg-brand-orange/10"
  },
  {
    title: "Закупка инвалидных кресел",
    description: "Необходимо обновить парк колясок для комфортного передвижения дедушек и бабушек.",
    goal: 1200000,
    current: 450000,
    icon: Activity,
    color: "text-brand-yellow bg-brand-yellow/10"
  },
  {
    title: "Ремонт столовой",
    description: "Косметический ремонт и закупка нового оборудования для кухни и зоны приема пищи.",
    goal: 3000000,
    current: 2800000,
    icon: Home,
    color: "text-[#81B29A] bg-[#81B29A]/10"
  },
  {
    title: "Лекарства на месяц",
    description: "Ежемесячный сбор на обезболивающие и жизненно важные препараты первой необходимости.",
    goal: 800000,
    current: 120000,
    icon: Bed,
    color: "text-[#E07A5F] bg-[#E07A5F]/10"
  },
  {
    title: "Организация праздника",
    description: "Сбор на подарки, аниматоров и праздничный стол ко Дню пожилого человека.",
    goal: 150000,
    current: 150000,
    icon: Users,
    color: "text-brand-brown bg-brand-brown/10"
  }
];

interface OtherDonationsProps {
  campaigns?: {
    id: number;
    name?: string;
    descr?: string;
    image?: any;
    current?: number;
    goal?: number;
    active?: boolean;
    primary?: boolean;
    closed?: boolean;
  }[];
}

export const OtherDonations = ({ campaigns }: OtherDonationsProps) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const activeSecondaryCampaigns = campaigns?.filter((c) => c.active && !c.primary) || [];
  
  // Use our real campaigns if available, otherwise fallback to the dummy data
  const mappedCampaigns = useMemo(() => {
    return activeSecondaryCampaigns.length > 0 
      ? activeSecondaryCampaigns.map((c, idx) => {
          // Find a cool color and icon based on index to keep the visual variety
          const colorIdx = idx % otherDonationsData.length;
          const color = otherDonationsData[colorIdx].color;
          const icon = otherDonationsData[colorIdx].icon;
          
          let imageUrl = null;
          if (c.image?.url) {
             imageUrl = c.image.url.startsWith('http') ? c.image.url : `${process.env.NEXT_PUBLIC_API_URL || "http://10.17.75.147:1337"}${c.image.url}`;
          }

          return {
            title: c.name || "Сбор",
            description: c.descr || "",
            goal: c.goal || 0,
            current: c.current || 0,
            closed: !!c.closed,
            imageUrl,
            color,
            icon
          };
        })
      : otherDonationsData.map(d => ({ ...d, closed: false, imageUrl: null }));
  }, [activeSecondaryCampaigns]);
  return (
    <section className="relative z-30 bg-white pt-10 md:pt-16 pb-16 md:pb-20 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-brand-brown tracking-tighter">
            ДРУГИЕ <span className="text-brand-orange italic">СБОРЫ</span>
          </h2>
          <div className="hidden md:flex gap-2">
            <button 
               className={`swiper-prev w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 disabled:cursor-not-allowed`}
               disabled={isBeginning}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
               className={`swiper-next w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 disabled:cursor-not-allowed`}
               disabled={isEnd}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-[3rem]">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.swiper-prev',
              nextEl: '.swiper-next',
            }}
            spaceBetween={24}
            slidesPerView={1.1}
            breakpoints={{
              768: { slidesPerView: 2.2 },
              1280: { slidesPerView: 3 },
            }}
            grabCursor={true}
            onBeforeInit={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            className="w-full pb-10 px-2 [&>.swiper-wrapper]:items-stretch"
          >
            {mappedCampaigns.map((donation, idx) => {
              const goal = donation.goal || 0;
              const current = donation.current || 0;
              const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : (current > 0 ? 100 : 0);
              const isCompleted = donation.closed || false;

              return (
                <SwiperSlide key={idx} className="h-auto! flex">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col w-full h-full bg-white rounded-2xl md:rounded-[2.5rem] border border-brand-brown/5 overflow-hidden group hover:shadow-[0_20px_50px_rgba(74,63,53,0.06)] transition-shadow duration-500 cursor-grab active:cursor-grabbing will-change-transform will-change-opacity"
                  >
                    {/* Header Icon Placeholder */}
                    <div className={`relative h-36 md:h-48 w-full flex items-center justify-center shrink-0 transition-colors duration-700 overflow-hidden ${donation.color}`}>
                      {donation.imageUrl ? (
                        <Image 
                          src={donation.imageUrl} 
                          alt={donation.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isCompleted ? 'saturate-0 opacity-80' : ''}`}
                        />
                      ) : (
                        <donation.icon className={`w-20 h-20 relative z-10 transition-transform duration-700 ease-out group-hover:scale-110 ${isCompleted ? 'opacity-20' : 'opacity-80'}`} strokeWidth={1.5} />
                      )}
                      
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] z-10 bg-brand-brown/10">
                          <span className="text-white font-bold uppercase tracking-widest text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                            Сбор закрыт
                          </span>
                        </div>
                      )}
                      {!isCompleted && goal > 0 && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-orange border border-white overflow-hidden shadow-sm">
                          Осталось {Math.max(goal - current, 0).toLocaleString("ru-RU")} ₽
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 lg:p-8 flex flex-col flex-1">
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-black text-brand-brown mb-2 md:mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                        {donation.title}
                      </h3>
                      <p className="text-brand-brown-light text-sm md:text-base font-medium leading-relaxed line-clamp-3 mb-5 md:mb-6 flex-1">
                        {donation.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                          <span className={`${isCompleted ? 'text-green-500' : 'text-brand-orange'}`}>
                            {current.toLocaleString("ru-RU")} ₽
                          </span>
                          <span className="text-brand-brown/40">
                            {goal > 0 ? `из ${goal.toLocaleString("ru-RU")} ₽` : "цель не задана"}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-brand-cream rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-400' : 'bg-brand-orange'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        disabled={isCompleted}
                        onClick={() => !isCompleted && document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                        className={`mt-6 w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isCompleted ? 'bg-brand-cream/50 text-brand-brown/40 cursor-not-allowed border border-brand-brown/5' : 'bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white border border-brand-brown/10 hover:border-brand-orange'}`}
                      >
                        {isCompleted ? 'Завершено' : 'Поддержать сбор'}
                        {!isCompleted && <Heart className="w-4 h-4" strokeWidth={2.5} />}
                      </button>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
