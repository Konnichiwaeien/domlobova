"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
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

export const OtherDonations = () => {
  return (
    <section className="relative z-30 bg-brand-cream pb-32 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-5xl md:text-6xl font-black text-brand-brown tracking-tighter">
            ДРУГИЕ <span className="text-brand-orange italic">СБОРЫ</span>
          </h2>
          <div className="hidden md:flex gap-2">
            <button className="swiper-prev w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-next w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[3rem]">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.swiper-prev',
              nextEl: '.swiper-next',
            }}
            spaceBetween={24}
            slidesPerView={1.2}
            breakpoints={{
              768: { slidesPerView: 2.2 },
              1280: { slidesPerView: 3 },
            }}
            grabCursor={true}
            className="w-full pb-10 px-2 [&>.swiper-wrapper]:items-stretch"
          >
            {otherDonationsData.map((donation, idx) => {
              const percent = Math.min((donation.current / donation.goal) * 100, 100);
              const isCompleted = percent >= 100;

              return (
                <SwiperSlide key={idx} className="h-auto! flex">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col w-full h-full bg-white rounded-[2.5rem] border border-brand-brown/5 overflow-hidden group hover:shadow-[0_20px_50px_rgba(74,63,53,0.06)] transition-shadow duration-500 cursor-grab active:cursor-grabbing"
                  >
                    {/* Header Icon Placeholder */}
                    <div className={`relative h-48 w-full flex items-center justify-center shrink-0 transition-colors duration-700 ${donation.color}`}>
                      <donation.icon className={`w-20 h-20 transition-transform duration-700 ease-out group-hover:scale-110 ${isCompleted ? 'opacity-20' : 'opacity-80'}`} strokeWidth={1.5} />
                      
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] z-10">
                          <span className="text-white font-bold uppercase tracking-widest text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                            Сбор закрыт
                          </span>
                        </div>
                      )}
                      {!isCompleted && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-orange border border-white overflow-hidden shadow-sm">
                          Осталось {(donation.goal - donation.current).toLocaleString("ru-RU")} ₽
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <h3 className="font-serif text-2xl font-black text-brand-brown mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                        {donation.title}
                      </h3>
                      <p className="text-brand-brown-light text-sm font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
                        {donation.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                          <span className={`${isCompleted ? 'text-green-500' : 'text-brand-orange'}`}>
                            {donation.current.toLocaleString("ru-RU")} ₽
                          </span>
                          <span className="text-brand-brown/40">
                            из {donation.goal.toLocaleString("ru-RU")} ₽
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
