"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useInView } from "framer-motion";
import { Heart, Users, CalendarHeart, PhoneCall } from "lucide-react";
import Image from "next/image";
import { DonationModal } from "../../ui/donation-modal";

interface HeroV2Props {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  heroPhotos?: { url: string; alternativeText?: string | null }[];
}

const DEFAULT_IMAGES = [
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.jpg",
];

const STATS = [
  { num: "500+", label: "подопечных", Icon: Users },
  { num: "12", label: "лет помощи", Icon: CalendarHeart },
  { num: "24/7", label: "на связи", Icon: PhoneCall },
] as const;

export const HeroV2 = ({
  titleTop,
  titleBottom,
  heroDescription,
  heroPhotos,
}: HeroV2Props) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [modalCampaign, setModalCampaign] = useState<{ id: string; title: string } | null>(null);

  const openDonation = useCallback(() => {
    setModalCampaign(null);
    setIsDonationOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.campaignId) {
        setModalCampaign({ id: detail.campaignId, title: detail.campaignTitle || 'Выбранный сбор' });
      } else {
        setModalCampaign(null);
      }
      setIsDonationOpen(true);
    };
    window.addEventListener("open-donation-modal", handler);
    return () => window.removeEventListener("open-donation-modal", handler);
  }, []);

  const photos = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    src: heroPhotos?.[i]?.url ?? DEFAULT_IMAGES[i],
    alt: heroPhotos?.[i]?.alternativeText ?? "",
  })), [heroPhotos]);

  const animClass = inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  const titleBlock = (
    <>
      {titleTop && (
        <span className="block text-[14vw] md:text-[clamp(60px,7.5vw,110px)] text-brand-brown">
          {titleTop}
        </span>
      )}
      {titleBottom && (
        <span className="block text-[9vw] md:text-[clamp(44px,5vw,72px)] text-brand-orange italic">
          {titleBottom}
        </span>
      )}
      {!titleTop && !titleBottom && (
        <>
          <span className="block text-[14vw] md:text-[clamp(60px,7.5vw,110px)] text-brand-brown">
            Спасибо,
          </span>
          <span className="block text-[9vw] md:text-[clamp(44px,5vw,72px)] text-brand-orange italic">
            мне&nbsp;не&nbsp;больно
          </span>
        </>
      )}
    </>
  );

  return (
    <>
      <section ref={ref} id="hero" className="relative w-full min-h-screen bg-[#FDFCF8] overflow-hidden">
        {/* ════ DESKTOP ════ */}
        <div className="hidden md:grid grid-cols-[1fr_1.4fr] min-h-screen">
          {/* Текст */}
          <div className="flex flex-col justify-center pl-[clamp(2rem,5vw,4.5rem)] pr-8 py-16">
            <h1
              className={`font-heading leading-[0.88] font-black tracking-[-0.03em] mb-6 uppercase transition-all duration-700 delay-200 will-change-[transform,opacity] ${animClass}`}
            >
              {titleBlock}
            </h1>

            <p
              className={`text-lg lg:text-xl leading-relaxed text-brand-brown-light max-w-md mb-9 font-medium transition-all duration-700 delay-300 will-change-[transform,opacity] ${animClass}`}
            >
              {heroDescription ||
                "Бесплатная паллиативная помощь в\u00A0Ярославской области. Мы\u00A0помогаем людям и\u00A0их\u00A0семьям получить качественную медицинскую помощь и\u00A0поддержку."}
            </p>

            <div
              className={`flex items-center gap-6 flex-wrap transition-all duration-600 delay-[400ms] will-change-[transform,opacity] ${animClass}`}
            >
              <button
                onClick={openDonation}
                className="px-10 py-5 bg-brand-orange text-white rounded-full font-semibold text-base flex items-center gap-2.5 shadow-xl hover:bg-[#1A1A1A] transition-all duration-500 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50"
              >
                <Heart size={18} className="fill-white" />
                Помочь
              </button>
              <a
                href="#about"
                className="group relative font-semibold text-base text-brand-brown transition-colors duration-300 hover:text-brand-orange py-1"
              >
                Узнать больше
                <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-brand-orange/30 rounded-full" />
                <span className="absolute left-0 -bottom-0.5 h-[2px] bg-brand-orange rounded-full transition-all duration-500 w-0 group-hover:w-full" />
              </a>
            </div>

            <div
              className={`flex gap-10 mt-12 transition-all duration-600 delay-500 will-change-[transform,opacity] ${animClass}`}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <stat.Icon size={20} className="text-brand-orange/50 mb-2.5" strokeWidth={1.6} />
                  <span className="block font-heading text-4xl font-black text-brand-orange leading-none">
                    {stat.num}
                  </span>
                  <span className="block text-sm text-brand-brown-light/70 uppercase tracking-wide mt-1.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Masonry-галерея */}
          <div className="flex gap-1.5 p-1.5 pl-0">
            <div className="flex-1 flex flex-col gap-1.5 pt-[8vh]">
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-3xl flex-[1.2] transition-all duration-900 delay-150 will-change-[transform,opacity] ${animClass}`}
              >
                <Image src={photos[0].src} alt={photos[0].alt} fill sizes="35vw" className="object-cover object-[center_30%]" priority />
              </div>
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-3xl flex-[0.8] transition-all duration-900 delay-300 will-change-[transform,opacity] ${animClass}`}
              >
                <Image src={photos[1].src} alt={photos[1].alt} fill sizes="35vw" className="object-cover object-[center_30%]" priority />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 pb-[8vh]">
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-3xl flex-[0.8] transition-all duration-900 delay-200 will-change-[transform,opacity] ${inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
              >
                <Image src={photos[2].src} alt={photos[2].alt} fill sizes="35vw" className="object-cover object-[center_30%]" />
              </div>
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-3xl flex-[1.2] transition-all duration-900 delay-[350ms] will-change-[transform,opacity] ${inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
              >
                <Image src={photos[3].src} alt={photos[3].alt} fill sizes="35vw" className="object-cover object-[center_30%]" />
              </div>
            </div>
          </div>
        </div>

        {/* ════ MOBILE ════ */}
        <div className="md:hidden flex flex-col min-h-screen">
          <div className="flex flex-col items-center text-center px-6 pt-28 pb-8">
            <h1
              className={`font-heading leading-[0.88] font-black tracking-[-0.03em] mb-4 uppercase transition-all duration-700 delay-200 will-change-[transform,opacity] ${animClass}`}
            >
              {titleBlock}
            </h1>

            <p
              className={`text-sm leading-relaxed text-brand-brown-light max-w-xs mb-6 font-medium transition-all duration-700 delay-300 will-change-[transform,opacity] ${animClass}`}
            >
              {heroDescription ||
                "Бесплатная паллиативная помощь в\u00A0Ярославской области."}
            </p>

            <div
              className={`flex flex-col items-center gap-3 w-full transition-all duration-600 delay-[400ms] will-change-[transform,opacity] ${animClass}`}
            >
              <button
                onClick={openDonation}
                className="w-full max-w-xs px-8 py-4 bg-brand-orange text-white rounded-full font-semibold flex items-center justify-center gap-2.5 shadow-xl hover:bg-[#1A1A1A] transition-all duration-500 cursor-pointer"
              >
                <Heart size={16} className="fill-white" />
                Помочь
              </button>
            </div>

            <div
              className={`flex gap-6 mt-8 transition-all duration-600 delay-500 will-change-[transform,opacity] ${animClass}`}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <stat.Icon size={16} className="text-brand-orange/60 mb-1.5" strokeWidth={1.8} />
                  <span className="block font-heading text-2xl font-black text-brand-orange leading-none">
                    {stat.num}
                  </span>
                  <span className="block text-[10px] text-brand-brown-light/70 uppercase tracking-wide mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Masonry мобилка */}
          <div className="flex gap-1 px-1 pb-1 flex-1 min-h-[45vh]">
            <div className="flex-1 flex flex-col gap-1 pt-6">
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-2xl flex-[1.2] transition-all duration-800 delay-150 will-change-[transform,opacity] ${animClass}`}
              >
                <Image src={photos[0].src} alt={photos[0].alt} fill sizes="50vw" className="object-cover object-[center_30%]" priority />
              </div>
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-2xl flex-[0.8] transition-all duration-800 delay-250 will-change-[transform,opacity] ${animClass}`}
              >
                <Image src={photos[1].src} alt={photos[1].alt} fill sizes="50vw" className="object-cover object-[center_30%]" priority />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1 pb-6">
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-2xl flex-[0.8] transition-all duration-800 delay-200 will-change-[transform,opacity] ${inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                <Image src={photos[2].src} alt={photos[2].alt} fill sizes="50vw" className="object-cover object-[center_30%]" />
              </div>
              <div
                className={`relative overflow-hidden bg-brand-cream rounded-2xl flex-[1.2] transition-all duration-800 delay-300 will-change-[transform,opacity] ${inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                <Image src={photos[3].src} alt={photos[3].alt} fill sizes="50vw" className="object-cover object-[center_30%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} campaignId={modalCampaign?.id} campaignTitle={modalCampaign?.title} />
    </>
  );
};
