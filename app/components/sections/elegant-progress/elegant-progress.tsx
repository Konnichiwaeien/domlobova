"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, HeartHandshake, Target, Users, TrendingUp, Sparkles } from "lucide-react";
import { MagneticButton } from "../../ui/magnetic-button";
import { AnimatedCounter } from "../../ui/animated-counter";
import { renderHighlightedTitle } from "../../../utils/text-parser";

interface ElegantProgressProps {
  title?: string;
  descr?: string;
  partners?: { // Assuming 'partners' is the prop name passed from page.tsx containing campaigns
    id: number;
    name?: string;
    descr?: string;
    current?: number;
    goal?: number;
    active?: boolean;
    primary?: boolean;
  }[];
}

const stats = [
  {
    icon: Target,
    value: 12,
    decimals: 0,
    suffix: "",
    label: "Активных сборов",
  },
  {
    icon: Users,
    value: 2500,
    decimals: 0,
    suffix: "+",
    label: "Неравнодушных людей",
  },
  {
    icon: TrendingUp,
    value: 1.5,
    decimals: 1,
    suffix: " млн ₽",
    label: "Собрано средств",
  },
];

const ElegantProgress = ({ title, descr, partners }: ElegantProgressProps) => {
  // Find primary active campaign
  const primaryCampaign = partners?.find((c) => c.active && c.primary) || null;

  const goal = primaryCampaign?.goal || 0;
  const current = primaryCampaign?.current || 0;
  
  // Prevent division by zero or NaN for progress percent
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : (current > 0 ? 100 : 0);
  
  const progressRef = useRef(null);
  const isProgressInView = useInView(progressRef, { once: true, margin: "-80px" });

  const recentDonations = [
    { name: "Анна С.", amount: 5000, time: "10 мин назад", icon: "☀️" },
    { name: "Михаил В.", amount: 1000, time: "25 мин назад", icon: "✨" },
    { name: "ООО «Ромашка»", amount: 50000, time: "1 час назад", icon: "🏢" },
    { name: "Елена", amount: 500, time: "2 часа назад", icon: "🤍" },
    { name: "Аноним", amount: 3000, time: "3 часа назад", icon: "🕊️" },
    { name: "Алексей И.", amount: 2000, time: "4 часа назад", icon: "🌟" },
    { name: "Мария", amount: 1500, time: "5 часов назад", icon: "🌷" },
    { name: "Семья Петровых", amount: 10000, time: "7 часов назад", icon: "🤝" },
    { name: "Доброжелатель", amount: 800, time: "8 часов назад", icon: "💡" },
    { name: "Дарья", amount: 1200, time: "10 часов назад", icon: "🌱" },
  ];

  return (
    <section id="campaigns" className="relative z-30 bg-white pt-14 md:pt-20 pb-6 md:pb-12">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        
        {/* Section Heading */}
        <div className="mb-14 md:mb-20 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 xl:gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="font-heading text-5xl md:text-7xl font-black text-brand-brown tracking-tighter leading-[0.9] uppercase">
              {renderHighlightedTitle(title || "ПОДАРИТЬ *НАДЕЖДУ*")}
            </h2>
            <p className="mt-6 text-xl text-brand-brown-light font-medium leading-relaxed">
              {descr || "Каждый ваш перевод — это кирпичик в строительстве большого и теплого дома."}
            </p>
          </div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-brand-brown rounded-2xl xl:rounded-3xl p-5 sm:p-6 w-full xl:w-auto shrink-0 shadow-2xl shadow-brand-brown/15"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-orange/15 blur-[30px] md:blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-yellow/10 blur-[30px] md:blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-stretch gap-0">
              {stats.map((stat, idx) => (
                <div key={stat.label} className="flex flex-col sm:flex-row items-stretch">
                  {idx > 0 && (
                    <>
                      <div className="hidden sm:block w-px self-stretch bg-white/10 mx-5 lg:mx-6" />
                      <div className="block sm:hidden h-px w-full bg-white/10 my-3" />
                    </>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 * idx, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center sm:items-start sm:flex-col gap-3 sm:gap-0 min-w-0 sm:min-w-[110px] lg:min-w-[120px]"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/[0.07] border border-white/8 flex items-center justify-center shrink-0 sm:mb-3">
                      <stat.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-brand-orange" strokeWidth={1.8} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <AnimatedCounter
                        target={stat.value}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                        duration={2}
                        className="font-heading tabular-nums lining-nums text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none"
                      />
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-white/40 mt-1 sm:mt-2 leading-tight">
                        {stat.label}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div> */}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Progress Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 overflow-hidden rounded-[3rem] bg-brand-cream text-brand-brown p-8 md:p-14 relative flex flex-col justify-between group shadow-2xl shadow-brand-brown/10 border border-brand-brown/5 will-change-transform will-change-opacity"
          >
            {/* Subtle bg decoration */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-orange/20 blur-xl md:blur-[120px] rounded-full group-hover:bg-brand-orange/30 transition-all duration-1000 pointer-events-none will-change-[filter]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-yellow/10 blur-xl md:blur-[100px] rounded-full group-hover:bg-brand-yellow/20 transition-all duration-1000 pointer-events-none will-change-[filter]" />
            
            <div ref={progressRef} className="relative z-10 flex flex-col h-full justify-between">
              <div>
                {/* Expressive Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-3 mb-8"
                >
                  <div className="flex items-center gap-2.5 bg-brand-orange/10 backdrop-blur-md border border-brand-orange/20 rounded-full px-5 py-2.5 shadow-sm shadow-brand-orange/5 w-fit">
                    <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange">
                      Активный сбор
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-wide text-brand-brown">
                    {primaryCampaign?.name || "Спецпитание для подопечных"}
                  </h3>
                </motion.div>
                
                {/* Animated Amount */}
                <div className="flex flex-col mb-8 md:mb-12 relative z-10">
                  <div className="whitespace-nowrap leading-none">
                    <AnimatedCounter
                      target={current}
                      decimals={0}
                      duration={2.5}
                      className="font-heading lining-nums tabular-nums text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black text-brand-brown tracking-tighter drop-shadow-sm align-baseline"
                    />
                    <span className="font-heading text-[7vw] sm:text-5xl md:text-6xl lg:text-7xl font-medium text-brand-orange opacity-90 drop-shadow-sm ml-2 md:ml-3 align-baseline">
                      ₽
                    </span>
                  </div>
                  <span className="mt-4 text-xl md:text-2xl font-medium text-brand-brown-light">
                    {goal > 0 ? (
                      <>
                        из цели{" "}
                        <AnimatedCounter
                          target={goal}
                          decimals={0}
                          duration={2.2}
                          className="font-medium"
                        />
                        {" "}₽
                      </>
                    ) : (
                      "без фиксированной цели"
                    )}
                  </span>
                </div>
              </div>

              <div>
                {/* Thick Progress Bar */}
                <div className="relative h-12 md:h-16 w-full overflow-hidden rounded-full bg-white border border-brand-brown/5 p-2 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isProgressInView ? { width: `${percent}%` } : { width: 0 }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className="relative h-full rounded-full bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow flex items-center justify-end px-4 overflow-hidden shadow-lg shadow-brand-orange/20"
                  >
                    {/* Shimmer sweep — CSS keyframes for reliability */}
                    <div
                      className="progress-shimmer absolute inset-y-0 w-full blur-[2px] pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 15%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.05) 85%, transparent 100%)",
                      }}
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isProgressInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: 2.2 }}
                      className="text-white font-black text-sm md:text-base drop-shadow-md z-10 relative"
                    >
                      {Math.round(percent)}%
                    </motion.span>
                  </motion.div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
                  <div className="text-brand-brown/80 text-sm font-bold uppercase tracking-widest leading-relaxed">
                    <HeartHandshake className="inline-block w-4 h-4 mb-1 mr-2 text-brand-orange" />
                    {primaryCampaign?.descr || "Собранная сумма позволит нам непрерывно оказывать помощь."}
                  </div>
                  <MagneticButton
                    onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full sm:w-auto bg-brand-orange hover:bg-white hover:text-brand-orange text-white transition-colors duration-500 rounded-full px-10 py-5 mx-auto md:mx-0 text-sm md:text-base font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 group shrink-0"
                  >
                    Сделать перевод <Heart className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Donations Block */}
          <div className="lg:col-span-4 relative min-h-[450px] lg:min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="absolute inset-0 rounded-[3rem] bg-white border border-brand-brown/5 shadow-[0_20px_60px_rgba(74,63,53,0.05)] p-8 md:p-10 flex flex-col overflow-hidden will-change-transform will-change-opacity"
            >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-cream relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <HeartHandshake className="text-brand-orange w-8 h-8" strokeWidth={1.5} />
                <h3 className="font-heading text-3xl font-black text-brand-brown">Нас поддержали</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden relative z-10 -mx-2 px-2">
              <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-white to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none z-10" />
              
              <div className="h-full overflow-y-auto space-y-4 pr-3 scrollbar-thin scrollbar-thumb-brand-cream scrollbar-track-transparent">
                  {recentDonations.map((donation, idx) => (
                    <div 
                      key={idx}
                      className="group flex flex-col gap-2 p-4 rounded-2xl hover:bg-brand-cream/80 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-cream flex items-center justify-center text-xl shadow-sm border border-brand-brown/5 group-hover:-rotate-6 transition-transform">
                            {donation.icon}
                          </div>
                          <div>
                            <div className="font-bold text-brand-brown text-base">{donation.name}</div>
                            <div className="text-[10px] text-brand-brown-light font-bold uppercase tracking-widest mt-0.5">{donation.time}</div>
                          </div>
                        </div>
                        <div className="font-heading lining-nums font-black text-xl text-brand-orange tracking-tight">
                          +{donation.amount.toLocaleString("ru-RU")}
                        </div>
                      </div>
                    </div>
                  ))}
                {/* Spacer for bottom blur */}
                <div className="h-12 w-full" />
              </div>
            </div>
            
            <button className="hidden mt-4 w-full py-4 rounded-xl text-brand-brown-light font-bold uppercase tracking-widest text-xs hover:text-brand-orange hover:bg-brand-orange/5 transition-colors duration-300 border border-brand-cream group relative z-10">
              Смотреть все <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
            </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export { ElegantProgress };
