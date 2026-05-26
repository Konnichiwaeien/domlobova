"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ArrowUpRight, Sparkles } from "lucide-react";
import Confetti from "react-confetti";
import { Campaign } from "../utils/filter-sort";

interface CampaignCardProps {
  campaign: Campaign;
  isPrimary: boolean;
}

function resolveImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      const host = new URL(apiUrl).origin;
      return `${host}${url}`;
    } catch (e) {
      return apiUrl.replace(/\/api$/, "") + url;
    }
  }
  return `http://localhost:1443${url}`;
}

export const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
    },
  },
};

export function CampaignCard({ campaign, isPrimary }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 450 });

  useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });
    }
  }, [isHovered]);

  const goal = campaign.goal || 0;
  const current = campaign.current || 0;
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : current > 0 ? 100 : 0;
  const isCompleted = !!campaign.closed;
  const isPrimaryCard = !!campaign.primary;
  const imageUrl = campaign.image?.url ? resolveImageUrl(campaign.image.url) : null;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={cardVariants}
      className={`relative flex flex-col w-full h-full bg-white hover:bg-brand-cream/15 rounded-[2rem] md:rounded-[2.5rem] border border-brand-brown/5 hover:border-brand-orange/30 overflow-hidden group transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(74,63,53,0.06)] ${
        isPrimary ? "md:col-span-2 lg:col-span-2 md:flex-row" : ""
      } ${
        isCompleted
          ? "border-green-500/10 hover:border-green-500/35 bg-[#FAFDF9]/70 hover:bg-[#FAFDF9]"
          : ""
      }`}
    >
      {/* Celebratory dynamic Confetti shower bounded inside completed cards */}
      {isCompleted && isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 rounded-[2rem] md:rounded-[2.5rem]">
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={true}
            numberOfPieces={35}
            gravity={0.12}
            colors={["#EB6C39", "#F48C5F", "#ECA42A", "#81B29A", "#CFE3FA", "#4CAF50"]}
          />
        </div>
      )}

      {/* Card Image Banner */}
      <Link
        href={`/campaigns/${campaign.slug || campaign.documentId || campaign.id}`}
        className={`relative shrink-0 overflow-hidden bg-brand-cream/40 block rounded-[2rem] md:rounded-[2.5rem] ${
          isPrimary
            ? "h-80 w-full md:w-1/2 md:h-auto md:min-h-[380px]"
            : "h-64 md:h-80 lg:h-64 w-full"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={campaign.name || "Сбор"}
            fill
            priority={true}
            sizes={
              isPrimary
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-103 rounded-[2rem] md:rounded-[2.5rem] ${
              isCompleted ? "saturate-0 opacity-80" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-brand-orange/5 flex items-center justify-center rounded-[2rem] md:rounded-[2.5rem]">
            <Heart className="w-16 h-16 text-brand-orange/20" strokeWidth={1.5} />
          </div>
        )}

        {/* Badges Coordinates */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 select-none">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#52B788] text-white border border-[#52B788]/20 shadow-sm">
              Сбор завершен <span className="text-sm">🎉</span>
            </span>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-orange text-white border border-brand-orange/20 animate-pulse-slow shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" /> Активный
              </span>
              {isPrimaryCard && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-yellow text-[#5A3B00] border border-brand-yellow/30 shadow-sm">
                  Основной
                </span>
              )}
            </>
          )}
        </div>

        {!isCompleted && goal > 0 && (
          <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange border border-white shadow-md select-none">
            Осталось {Math.max(goal - current, 0).toLocaleString("ru-RU")} ₽
          </div>
        )}
      </Link>

      {/* Card Content Details */}
      <div
        className={`p-6 md:p-8 lg:p-10 flex flex-col justify-between flex-1 ${
          isPrimary ? "md:w-1/2" : "w-full"
        }`}
      >
        {/* Header info & title */}
        <div className="space-y-3">
          {isPrimaryCard && !isCompleted && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full w-fit">
              Рекомендуемый проект
            </span>
          )}

          <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-black text-brand-brown group-hover:text-brand-orange transition-colors duration-300 line-clamp-2 leading-tight">
            <Link
              href={`/campaigns/${campaign.slug || campaign.documentId || campaign.id}`}
              className="hover:text-brand-orange transition-colors"
            >
              {campaign.name}
            </Link>
          </h3>

          <p className="text-brand-brown-light text-sm md:text-base font-medium leading-relaxed line-clamp-3 mb-4">
            {campaign.descr}
          </p>
        </div>

        {/* Progress details & CTAs */}
        <div className="mt-6 md:mt-8 space-y-5">
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm md:text-base font-black uppercase tracking-widest">
              <span className={isCompleted ? "text-green-600" : "text-brand-orange"}>
                {current.toLocaleString("ru-RU")} ₽
              </span>
              <span className="text-brand-brown/40">
                {goal > 0 ? `из ${goal.toLocaleString("ru-RU")} ₽` : "цель не задана"}
              </span>
            </div>
            <div className="h-4.5 w-full bg-brand-cream rounded-full overflow-hidden shadow-inner relative select-none">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  isCompleted
                    ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.35)]"
                    : "bg-brand-orange shadow-[0_0_12px_rgba(235,108,57,0.35)]"
                }`}
                style={{ width: `${percent}%` }}
              >
                {!isCompleted && percent > 0 && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent progress-shimmer" />
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-brand-cream/50 flex gap-3 select-none">
            {isCompleted ? (
              <Link
                href={`/campaigns/${campaign.slug || campaign.documentId || campaign.id}`}
                className="w-full py-4 rounded-xl border border-brand-brown/10 hover:border-brand-orange bg-brand-cream hover:bg-brand-orange hover:text-white text-brand-brown transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer group/btn"
              >
                <span>Подробнее о сборе</span>
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href={`/campaigns/${campaign.slug || campaign.documentId || campaign.id}`}
                  className="flex-1 py-3.5 rounded-xl border border-brand-brown/10 hover:border-brand-orange bg-brand-cream hover:bg-brand-orange hover:text-white text-brand-brown transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                >
                  <span>Подробнее</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>

                <button
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("open-donation-modal", {
                        detail: {
                          campaignId: campaign.documentId || String(campaign.id),
                          campaignTitle: campaign.name,
                        },
                      })
                    );
                  }}
                  className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer bg-brand-orange text-white hover:bg-[#cc492a] hover:scale-[1.02] hover:shadow-md active:scale-100 focus:outline-none shadow-brand-orange/15 group/btn shadow-xs"
                >
                  Помочь
                  <Heart className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover/btn:scale-110" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
