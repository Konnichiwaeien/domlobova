"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Heart, Trophy } from "lucide-react";
import Confetti from "react-confetti";

interface CompletedCardProps {
  campaignName?: string;
  goalAmount?: number;
  donationsCount?: number;
}

export function CompletedCard({ campaignName, goalAmount = 0, donationsCount = 0 }: CompletedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 500 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
    }
    
    // Recalculate dimensions on window resize
    const handleResize = () => {
      if (cardRef.current) {
        setDimensions({
          width: cardRef.current.offsetWidth,
          height: cardRef.current.offsetHeight
        });
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative overflow-hidden bg-white rounded-2xl md:rounded-[3rem] border border-[#52B788]/20 shadow-2xl shadow-[#52B788]/5 p-8 md:p-12 flex flex-col items-center text-center gap-6 z-20"
    >
      {/* Self-contained celebratory confetti inside the card */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 rounded-[2xl] md:rounded-[3rem]">
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={true}
            numberOfPieces={40}
            gravity={0.08}
            colors={["#52B788", "#74C69D", "#95D5B2", "#ECA42A", "#F48C5F", "#EB6C39"]}
          />
        </div>
      )}

      {/* Decorative gradient glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#52B788]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Animated Icon Badge */}
      <div className="relative z-20 w-20 h-20 rounded-full bg-[#52B788]/10 border border-[#52B788]/20 flex items-center justify-center text-[#52B788] animate-pulse-slow">
        <Trophy className="w-10 h-10 shrink-0" />
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#ECA42A] flex items-center justify-center text-white border-2 border-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
      </div>

      {/* Content Header */}
      <div className="relative z-20 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#52B788] bg-[#52B788]/10 px-4 py-1.5 rounded-full inline-block">
          Успешно завершен 🎉
        </span>
        <h3 className="font-heading text-2xl md:text-3xl font-black text-brand-brown uppercase tracking-tight leading-none pt-2">
          СПАСИБО ЗА <span className="text-[#52B788] italic">ВАШЕ ДОБРО</span>
        </h3>
      </div>

      {/* Detail Text */}
      <p className="relative z-20 text-brand-brown-light text-sm md:text-base font-medium leading-relaxed max-w-sm">
        Благодаря вашей невероятной поддержке и щедрости, необходимая сумма была собрана в полном объёме! Каждый ваш вклад — это неоценимая помощь подопечным Дома милосердия кузнеца Лобова.
      </p>

      {/* Statistics display */}
      <div className="relative z-20 w-full bg-brand-cream/40 rounded-2xl p-4 border border-brand-brown/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="text-center flex flex-col justify-center items-center pb-3 sm:pb-0 border-b sm:border-b-0 sm:border-r border-brand-brown/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-brown/40 block mb-1">Собрано средств</span>
          <span className="font-heading text-lg md:text-2xl font-black text-[#52B788] tracking-tight">
            {goalAmount.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <div className="text-center flex flex-col justify-center items-center pt-3 sm:pt-0 sm:pl-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-brown/40 block mb-1">Поддержали сбор</span>
          <span className="font-heading text-lg md:text-2xl font-black text-brand-orange tracking-tight block">
            {donationsCount}
          </span>
          <span className="text-[9px] font-black uppercase tracking-wider text-brand-orange/80 block -mt-0.5">
            {donationsCount === 1 ? "благотворитель" : donationsCount > 1 && donationsCount < 5 ? "благотворителя" : "благотворителей"}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-20 w-full pt-2">
        <Link 
          href="/campaigns" 
          className="w-full py-4 bg-[#52B788] hover:bg-[#409a71] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#52B788]/15 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none px-4 text-center"
        >
          <Heart className="w-4 h-4 fill-current shrink-0 animate-pulse" />
          <span className="text-center">Другие сборы</span>
        </Link>
      </div>
    </div>
  );
}
