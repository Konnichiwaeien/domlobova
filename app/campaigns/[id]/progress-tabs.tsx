"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, ShieldCheck, TrendingUp, RefreshCw, Hand, Heart } from "lucide-react";
import { AnimatedCounter } from "../../components/ui/animated-counter";
import { DonationRecord } from "../../services/donation.service";

interface ProgressTabsProps {
  campaign: {
    id: number;
    documentId?: string;
    name?: string;
    descr?: string;
    current?: number;
    goal?: number;
    closed?: boolean;
    primary?: boolean;
  };
  donations: DonationRecord[];
}

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} сек назад`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч назад`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} дн назад`;
  
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const getDonorIcon = (idx: number) => {
  const icons = ["☀️", "✨", "🤍", "🕊️", "🌟", "🌷", "🤝", "💡", "🌱"];
  return icons[idx % icons.length];
};

export function ProgressTabs({ campaign, donations }: ProgressTabsProps) {
  const [activeTab, setActiveTab] = useState<"progress" | "donations">("progress");
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const goal = Number(campaign.goal) || 0;
  const current = Number(campaign.current) || 0;
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : (current > 0 ? 100 : 0);
  const displayPercent = Math.round(percent);
  // Ensure a visual fill of at least 6% if there is any progress, so the capsule is always rounded and visual slice looks beautiful
  const fillPercent = current > 0 ? Math.max(percent, 6) : 0;

  return (
    <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-brand-brown/5 shadow-[0_20px_50px_rgba(74,63,53,0.04)] overflow-hidden flex flex-col">
      
      {/* Dynamic Tab Switchers (Capsule Style matching the Form) */}
      <div className="flex justify-center bg-brand-cream/10 py-3 px-4 shrink-0 relative z-10">
        <div className="bg-brand-cream p-1 rounded-full flex relative w-full max-w-sm border border-brand-brown/5 shadow-inner">
          <motion.div
            className="absolute top-1 bottom-1 left-1 bg-white rounded-full shadow-sm"
            style={{ width: 'calc(50% - 4px)' }}
            animate={{ x: activeTab === "donations" ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setActiveTab("progress")}
            className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider rounded-full transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
              activeTab === "progress" ? "text-brand-orange" : "text-brand-brown/50 hover:text-brand-brown"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>О сборе</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("donations")}
            className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider rounded-full transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none ${
              activeTab === "donations" ? "text-brand-orange" : "text-brand-brown/50 hover:text-brand-brown"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Поддержали ({donations.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Contents with a stable absolute fixed height to completely prevent container jump */}
      <div className="p-5 md:p-6 h-[360px] sm:h-[270px] flex flex-col justify-start overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "progress" ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-5 h-full w-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange block mb-1">
                      Собрано средств
                    </span>
                    <div className="flex items-baseline leading-none">
                      <AnimatedCounter
                        target={current}
                        decimals={0}
                        duration={2}
                        className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-brand-brown tracking-tight"
                      />
                      <span className="font-heading text-xl md:text-3xl lg:text-4xl font-medium text-brand-orange ml-1">
                        ₽
                      </span>
                    </div>
                  </div>

                  <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-brand-cream flex justify-between md:block">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-brown/40 block mb-1">
                      Целевая сумма
                    </span>
                    <span className="text-base md:text-xl font-bold text-brand-brown/70 whitespace-nowrap">
                      {goal > 0 ? (
                        <>
                          <AnimatedCounter
                            target={goal}
                            decimals={0}
                            duration={1.8}
                            className="font-bold text-brand-brown/70"
                          />{" "}
                          ₽
                        </>
                      ) : (
                        "Цель не ограничена"
                      )}
                    </span>
                  </div>
                </div>

                {/* Elegant thick progress bar (thickened to h-16 as requested) */}
                <div className="relative h-16 w-full overflow-hidden rounded-full bg-brand-cream border border-brand-brown/5 p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPercent}%` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow flex items-center justify-end px-4 shadow-md overflow-hidden relative"
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 15%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.05) 85%, transparent 100%)",
                      }}
                    />
                    {displayPercent >= 8 && (
                      <span className="text-white font-black text-sm md:text-base drop-shadow-md z-10 select-none">
                        {displayPercent}%
                      </span>
                    )}
                  </motion.div>
                  {displayPercent < 8 && (
                    <span className={`absolute top-1/2 -translate-y-1/2 text-brand-brown font-black text-sm md:text-base z-10 select-none transition-all duration-300 ${
                      current > 0 ? "left-[calc(6%+16px)]" : "left-5"
                    }`}>
                      {displayPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Trust Info badges, flows naturally immediately under progress bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-1 border-t border-brand-cream/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-black text-brand-brown uppercase tracking-wider">Безопасный взнос</h4>
                    <p className="text-[10px] md:text-xs text-brand-brown-light font-medium mt-0.5">Все транзакции шифруются и защищены CloudPayments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-black text-brand-brown uppercase tracking-wider">Адресная помощь</h4>
                    <p className="text-[10px] md:text-xs text-brand-brown-light font-medium mt-0.5">Средства поступают непосредственно на данный сбор.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="donations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col overflow-hidden"
            >
              <div data-lenis-prevent="true" className="overflow-y-auto flex-grow h-full pr-2 scrollbar-thin scrollbar-thumb-brand-cream scrollbar-track-transparent space-y-4">
                {donations.length > 0 ? (
                  donations.map((donation, idx) => (
                    <div 
                      key={donation.id}
                      className="group flex flex-col gap-2 p-3 rounded-2xl hover:bg-brand-cream/50 transition-colors duration-300 border border-transparent hover:border-brand-brown/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center text-lg shadow-sm border border-brand-brown/5 group-hover:-rotate-6 transition-transform">
                            {getDonorIcon(idx)}
                          </div>
                          <div>
                            <div className="flex flex-col items-start gap-0.5">
                              {donation.isRecurring ? (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-brand-orange bg-brand-orange/10 px-1 py-0.5 rounded-sm w-fit">
                                  <RefreshCw className="w-2 h-2 animate-spin-slow" /> Ежемесячно
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-brand-brown/40 bg-brand-brown/5 px-1 py-0.5 rounded-sm w-fit">
                                  <Hand className="w-2 h-2" /> Разово
                                </span>
                              )}
                              <div className="font-bold text-brand-brown text-sm leading-tight">
                                {donation.isAnonymous ? "Анонимный благотворитель" : (donation.donorName || "Анонимный благотворитель")}
                              </div>
                            </div>
                            <div className="text-[9px] text-brand-brown-light font-bold uppercase tracking-wider mt-0.5">
                              {mounted ? getTimeAgo(donation.createdAt) : "Недавно"}
                            </div>
                          </div>
                        </div>
                        <div className="font-heading lining-nums font-black text-lg text-brand-orange tracking-tight flex items-baseline gap-0.5 shrink-0">
                          +{Number(donation.amount).toLocaleString("ru-RU")}
                          <span className="text-[0.75em]">₽</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-brand-brown/40">
                    <Heart className="w-10 h-10 text-brand-brown/10 mb-3 stroke-1" />
                    <span className="text-sm font-bold">Пока нет пожертвований</span>
                    <span className="text-xs font-medium text-brand-brown-light/60 mt-1 max-w-[200px]">Вы можете стать первым и поддержать этот сбор!</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
