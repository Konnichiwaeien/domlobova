"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Copy, Heart, Users, Bed, Home, Package, Activity, ArrowUpRight } from "lucide-react";
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
    documentId?: string;
    slug?: string;
  }[];
  transparent?: boolean;
  className?: string;
}

export const OtherDonations = ({ campaigns, transparent = false, className = "" }: OtherDonationsProps) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Show all non-primary campaigns, sorted: active first, closed last
  const secondaryCampaigns = useMemo(() => {
    return (campaigns?.filter((c) => !c.primary) || [])
      .sort((a, b) => {
        if (a.closed === b.closed) return 0;
        return a.closed ? 1 : -1;
      });
  }, [campaigns]);
  
  // Use our real campaigns if available, otherwise fallback to the dummy data
  const mappedCampaigns = useMemo(() => {
    return secondaryCampaigns.length > 0 
      ? secondaryCampaigns.map((c, idx) => {
          // Find a cool color and icon based on index to keep the visual variety
          const colorIdx = idx % otherDonationsData.length;
          const color = otherDonationsData[colorIdx].color;
          const icon = otherDonationsData[colorIdx].icon;
          
          let imageUrl = null;
          if (c.image?.url) {
             imageUrl = c.image.url.startsWith('http') ? c.image.url : `${process.env.NEXT_PUBLIC_API_URL || "http://10.17.75.147:1337"}${c.image.url}`;
          }

          return {
            id: c.documentId || String(c.id),
            slug: c.slug,
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
      : otherDonationsData.map((d, i) => ({ ...d, id: `fallback-${i}`, slug: `fallback-${i}`, closed: false, imageUrl: null }));
  }, [secondaryCampaigns]);
  return (
    <section className={`relative z-30 pt-6 md:pt-8 pb-16 md:pb-24 lg:pb-28 overflow-hidden content-auto ${transparent ? 'bg-transparent' : 'bg-white'} ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-brand-brown tracking-tighter">
            ДРУГИЕ <span className="text-brand-orange italic">СБОРЫ</span>
          </h2>
          <div className="hidden md:flex gap-2">
            <button 
               aria-label="Предыдущие сборы"
               className={`swiper-prev w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 disabled:cursor-not-allowed`}
               disabled={isBeginning}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
               aria-label="Следующие сборы"
               className={`swiper-next w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 disabled:cursor-not-allowed`}
               disabled={isEnd}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden rounded-2xl md:rounded-[3rem]"
        >
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
                <SwiperSlide key={idx} className="h-auto! flex select-none outline-none">
                  <div 
                    className="flex flex-col w-full h-full bg-white hover:bg-brand-cream/15 rounded-2xl md:rounded-[2.5rem] border border-brand-brown/5 hover:border-brand-orange/30 overflow-hidden group transition-all duration-300 cursor-grab active:cursor-grabbing select-none outline-none focus:outline-none focus-visible:outline-none"
                    style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', WebkitUserSelect: 'none', userSelect: 'none' }}
                  >
                    {/* Header Icon Placeholder wrapped in Link */}
                    <Link href={`/campaigns/${donation.slug || donation.id}`} draggable="false" className={`relative h-48 md:h-64 w-full flex items-center justify-center shrink-0 transition-colors duration-700 overflow-hidden rounded-b-4xl md:rounded-b-[2.5rem] block select-none outline-none ${donation.color}`} style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', WebkitUserDrag: 'none' } as any}>
                      {donation.imageUrl ? (
                        <Image 
                          src={donation.imageUrl} 
                          alt={donation.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw"
                          draggable="false"
                          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none ${isCompleted ? 'saturate-0 opacity-80' : ''}`}
                          style={{ WebkitUserDrag: 'none' } as any}
                        />
                      ) : (
                        <donation.icon className={`w-20 h-20 relative z-10 transition-transform duration-700 ease-out group-hover:scale-110 ${isCompleted ? 'opacity-20' : 'opacity-80'}`} strokeWidth={1.5} />
                      )}
                      
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-brand-brown/20">
                          <span className="text-white font-bold uppercase tracking-widest text-sm bg-black/30 px-4 py-2 rounded-full border border-white/20">
                            Сбор закрыт
                          </span>
                        </div>
                      )}
                      {!isCompleted && goal > 0 && (
                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-orange border border-white overflow-hidden shadow-sm">
                          Осталось {Math.max(goal - current, 0).toLocaleString("ru-RU")} ₽
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-5 md:p-6 lg:p-8 flex flex-col flex-1">
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-black text-brand-brown mb-2 md:mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                        <Link href={`/campaigns/${donation.slug || donation.id}`} draggable="false" className="hover:text-brand-orange transition-colors block select-none outline-none" style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', WebkitUserDrag: 'none' } as any}>
                          {donation.title}
                        </Link>
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

                      {/* Action Buttons split */}
                      <div className="mt-6 flex gap-3 shrink-0">
                        <Link 
                          href={`/campaigns/${donation.slug || donation.id}`}
                          draggable="false"
                          className="flex-1 py-4 rounded-xl border border-brand-brown/10 hover:border-brand-orange bg-brand-cream hover:bg-brand-orange hover:text-white text-brand-brown transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 select-none cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/20 group/btn"
                          style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', WebkitUserDrag: 'none' } as any}
                        >
                          <span>Подробнее</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                        <button 
                          disabled={isCompleted}
                          onClick={() => {
                            if (!isCompleted) {
                              window.dispatchEvent(
                                new CustomEvent('open-donation-modal', {
                                  detail: {
                                    campaignId: donation.id,
                                    campaignTitle: donation.title
                                  }
                                })
                              );
                            }
                          }}
                          className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 group/btn ${isCompleted ? 'bg-brand-cream/50 text-brand-brown/40 cursor-not-allowed border border-brand-brown/5' : 'cursor-pointer bg-brand-orange text-white hover:bg-[#cc492a] hover:scale-[1.02] hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/30 shadow-md shadow-brand-orange/15'}`}
                        >
                          {isCompleted ? 'Завершен' : 'Помочь'}
                          {!isCompleted && <Heart className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover/btn:scale-110 transform-gpu" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>

        {/* Bottom Call to Action: Все сборы */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#E65C3D] hover:bg-[#cc492a] text-white rounded-full text-sm font-semibold uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/30 transition-all duration-300 group"
          >
            <span>Все сборы</span>
            <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
