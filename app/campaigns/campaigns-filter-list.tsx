"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Sparkles, 
  Heart, 
  ArrowUpRight, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  Filter,
  Clock,
  History,
  Hourglass,
  TrendingUp,
  Percent,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow
} from "lucide-react";
import Confetti from "react-confetti";
import { useLenis } from "lenis/react";
import { Breadcrumbs } from "../components/ui/breadcrumbs";

interface CampaignImage {
  id?: number;
  url: string;
  mime?: string;
}

interface Campaign {
  id: number;
  documentId?: string;
  slug?: string;
  name?: string;
  descr?: string;
  goal?: number;
  current?: number;
  active?: boolean;
  primary?: boolean;
  closed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image?: CampaignImage;
}

interface CampaignsFilterListProps {
  initialCampaigns: Campaign[];
  activeFilter: string;
  activeSort: string;
  searchQuery: string;
}

const FILTER_TABS = [
  { id: "all", label: "Все сборы" },
  { id: "active", label: "Активные" },
  { id: "primary", label: "Основные" },
  { id: "closed", label: "Завершенные" }
] as const;

const SORT_OPTIONS = [
  { id: "newest", label: "По дате: сначала новые", icon: Clock },
  { id: "oldest", label: "По дате: сначала старые", icon: History },
  { id: "urgency", label: "Близкие к завершению", icon: Hourglass },
  { id: "progress_desc", label: "По прогрессу: сначала высокий", icon: TrendingUp },
  { id: "progress_asc", label: "По прогрессу: сначала низкий", icon: Percent },
  { id: "goal_desc", label: "По сумме: сначала крупные", icon: ArrowUpWideNarrow },
  { id: "goal_asc", label: "По сумме: сначала небольшие", icon: ArrowDownWideNarrow }
] as const;

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (apiUrl) {
    try {
      const host = new URL(apiUrl).origin;
      return `${host}${url}`;
    } catch (e) {
      return apiUrl.replace(/\/api$/, '') + url;
    }
  }
  return `http://localhost:1443${url}`;
}

// Staggered card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring" as const, 
      stiffness: 90, 
      damping: 14
    }
  }
};

interface CampaignCardProps {
  campaign: Campaign;
  isPrimary: boolean;
}

// Modularized Card Component to manage individual hover states and dynamic Confetti sizing
function CampaignCard({ campaign, isPrimary }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 450 });

  useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
    }
  }, [isHovered]);

  const goal = campaign.goal || 0;
  const current = campaign.current || 0;
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : (current > 0 ? 100 : 0);
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

      {/* Card Image Banner - Fully rounded (all 4 corners) with NO borders or paddings. Heights are 40% taller on mobile/tablet */}
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
            priority={true} // V4 preloaded priority pre-rendering entirely bypasses scroll flashing!
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

        {/* V6 Badges Coordinates Restored - aligned to original top-4 left-4 coordinates */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 select-none">
          {isCompleted ? (
            /* Vibrant emerald-mint green completed badge V6 */
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#52B788] text-white border border-[#52B788]/20 shadow-sm">
              Сбор завершен <span className="text-sm">🎉</span>
            </span>
          ) : (
            <>
              {/* Slow pulsing Active badge */}
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
          /* V6 Badge coordinates restored to top-4 right-4 */
          <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange border border-white shadow-md select-none">
            Осталось {Math.max(goal - current, 0).toLocaleString("ru-RU")} ₽
          </div>
        )}
      </Link>

      {/* Card Content Details */}
      <div className={`p-6 md:p-8 lg:p-10 flex flex-col justify-between flex-1 ${
        isPrimary ? "md:w-1/2" : "w-full"
      }`}>
        
        {/* Header info & title */}
        <div className="space-y-3">
          {isPrimaryCard && !isCompleted && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full w-fit">
              Рекомендуемый проект
            </span>
          )}
          
          <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-black text-brand-brown group-hover:text-brand-orange transition-colors duration-300 line-clamp-2 leading-tight">
            <Link href={`/campaigns/${campaign.slug || campaign.documentId || campaign.id}`} className="hover:text-brand-orange transition-colors">
              {campaign.name}
            </Link>
          </h3>
          
          <p className="text-brand-brown-light text-sm md:text-base font-medium leading-relaxed line-clamp-3 mb-4">
            {campaign.descr}
          </p>
        </div>

        {/* Progress details & CTAs */}
        <div className="mt-6 md:mt-8 space-y-5">
          {/* Calculated tracking and h-4.5 glowing progress bar V6 */}
          <div className="space-y-3">
            {/* V6 Mobile progress and sum scales increased: text-sm font-black on mobile */}
            <div className="flex justify-between text-sm md:text-base font-black uppercase tracking-widest">
              <span className={isCompleted ? "text-green-600" : "text-brand-orange"}>
                {current.toLocaleString("ru-RU")} ₽
              </span>
              <span className="text-brand-brown/40">
                {goal > 0 ? `из ${goal.toLocaleString("ru-RU")} ₽` : "цель не задана"}
              </span>
            </div>
            {/* Taller h-4.5 bar with neon shadow glows (V6 scaled) */}
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

          {/* V3 Card Action CTAs */}
          <div className="pt-4 border-t border-brand-cream/50 flex gap-3 select-none">
            {isCompleted ? (
              /* Completed campaigns: Single full-width detailed CTA button V3 */
              <Link
                href={`/campaigns/${campaign.slug || campaign.documentId || campaign.id}`}
                className="w-full py-4 rounded-xl border border-brand-brown/10 hover:border-brand-orange bg-brand-cream hover:bg-brand-orange hover:text-white text-brand-brown transition-all duration-300 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer group/btn"
              >
                <span>Подробнее о сборе</span>
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            ) : (
              /* Active campaigns: Symmetric side-by-side action buttons */
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
                          campaignTitle: campaign.name
                        }
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

export function CampaignsFilterList({ 
  initialCampaigns, 
  activeFilter, 
  activeSort, 
  searchQuery 
}: CampaignsFilterListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search input and responsive drawer states
  const [searchVal, setSearchVal] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Synchronize local search value with URL query parameters
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // V6 scroll-locked class toggle (eliminates Lenis touch disables, locks background completely)
  useEffect(() => {
    if (isDrawerOpen) {
      document.documentElement.classList.add("scroll-locked");
    } else {
      document.documentElement.classList.remove("scroll-locked");
    }
    return () => {
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [isDrawerOpen]);

  // V4 Flicker-free Debounce search parameter handler
  useEffect(() => {
    const currentSearchInUrl = searchParams.get("search") || "";
    if (searchVal.trim() === currentSearchInUrl.trim()) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchVal.trim()) {
        params.set("search", searchVal.trim());
      } else {
        params.delete("search");
      }
      params.delete("page_limit"); 
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setVisibleCount(9);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchVal, pathname, router, searchParams]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (filterId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filterId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
    setVisibleCount(9);
  };

  const handleSortChange = (sortId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsSortOpen(false);
    setVisibleCount(9);
  };

  const handleResetFilters = () => {
    setSearchVal("");
    const params = new URLSearchParams();
    params.set("filter", "all");
    params.set("sort", "newest");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsDrawerOpen(false);
    setVisibleCount(9);
  };

  const displayedCampaigns = useMemo(() => {
    return initialCampaigns.slice(0, visibleCount);
  }, [initialCampaigns, visibleCount]);

  const hasMore = initialCampaigns.length > visibleCount;

  const currentFilterLabel = FILTER_TABS.find((tab) => tab.id === activeFilter)?.label || "Все сборы";
  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.id === activeSort)?.label || "По дате: сначала новые";

  // Dynamic container transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
      {/* Dynamic Unified Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Главная", href: "/" },
          { label: "Сборы" }
        ]} 
      />

      {/* Page Title & Context Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-heading text-4xl md:text-6xl font-black text-brand-brown uppercase tracking-tighter leading-[0.95]">
          ВСЕ НАШИ <span className="text-brand-orange italic">СБОРЫ</span>
        </h1>
        <p className="mt-4 text-brand-brown-light text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Каждый ваш вклад помогает Дому милосердия кузнеца Лобова обеспечивать профессиональный круглосуточный уход за неизлечимо больными людям.
        </p>
      </div>

      {/* Mobile-First Controls Drawer Button (Visible by default, hidden lg:hidden for min-width: 1024px) */}
      <div className="lg:hidden flex items-center justify-between gap-4 mb-10 select-none">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30" />
          <input
            type="text"
            placeholder="Поиск сбора..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-brand-brown/10 rounded-xl focus:ring-4 focus:ring-brand-orange/10 text-brand-brown font-medium text-sm outline-none"
          />
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-3.5 bg-brand-orange hover:bg-[#cc492a] text-white rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-brand-orange/10 transition-all duration-300 active:scale-95"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
        </button>
      </div>

      {/* V4 Symmetrical Mobile-First Inline Controls Panel (hidden by default, displayed lg:flex on min-width: 1024px) */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4 bg-white/70 backdrop-blur-md rounded-[2rem] border border-brand-brown/5 p-6 shadow-[0_20px_50px_rgba(74,63,53,0.04)] mb-10 relative z-40">
        
        {/* Symmetrical Desktop Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30" />
          <input
            type="text"
            placeholder="Поиск сбора..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-brand-cream/40 focus:bg-white border border-brand-brown/10 focus:border-brand-orange/40 rounded-xl focus:ring-4 focus:ring-brand-orange/10 text-brand-brown placeholder-brand-brown/40 font-medium text-base outline-none transition-all duration-300 shadow-inner"
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-brand-brown/40 hover:text-brand-brown hover:bg-brand-cream transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Dropdowns */}
        <div className="flex items-center gap-4">
          
          {/* V5 Custom Select dropdown for Filters - padding & mt expanded */}
          <div className="relative select-none" ref={filterRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSortOpen(false);
                setIsFilterOpen(!isFilterOpen);
              }}
              className="px-5 py-3.5 bg-brand-cream/50 hover:bg-brand-cream border border-brand-brown/10 rounded-xl flex items-center justify-between gap-3 text-sm font-bold uppercase tracking-wider text-brand-brown cursor-pointer transition-all duration-300 focus:outline-none"
            >
              <Filter className="w-4 h-4 text-brand-orange" />
              <span>Раздел: {currentFilterLabel}</span>
              <ChevronDown className={`w-4 h-4 text-brand-brown/40 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 w-72 mt-3 bg-white rounded-2xl border border-brand-brown/10 shadow-[0_20px_50px_rgba(74,63,53,0.15)] p-3 z-[99] overflow-hidden"
                >
                  {FILTER_TABS.map((tab) => {
                    const isSelected = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleFilterChange(tab.id)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer block ${
                          isSelected 
                            ? "bg-brand-orange/10 text-brand-orange" 
                            : "text-brand-brown/80 hover:bg-brand-cream"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* V5 Custom Select dropdown for Sorting - wider w-96, offset mt-3, paddings p-3/px-5 py-3.5, rounded-2xl/rounded-xl */}
          <div className="relative select-none" ref={sortRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterOpen(false);
                setIsSortOpen(!isSortOpen);
              }}
              className="px-5 py-3.5 bg-brand-cream/50 hover:bg-brand-cream border border-brand-brown/10 rounded-xl flex items-center justify-between gap-3 text-sm font-bold uppercase tracking-wider text-brand-brown cursor-pointer transition-all duration-300 focus:outline-none"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
              <span>Сортировка: {currentSortLabel}</span>
              <ChevronDown className={`w-4 h-4 text-brand-brown/40 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 w-96 mt-3 bg-white rounded-2xl border border-brand-brown/10 shadow-[0_20px_50px_rgba(74,63,53,0.15)] p-3 z-[99] overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = activeSort === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSortChange(opt.id)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-4 whitespace-nowrap ${
                          isSelected 
                            ? "bg-brand-orange/10 text-brand-orange" 
                            : "text-brand-brown/80 hover:bg-brand-cream"
                        }`}
                      >
                        <opt.icon className="w-4.5 h-4.5 shrink-0 text-brand-orange" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Mobile Control Sheet Drawer (Bottom Sheet, Mobile-First slide up) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex items-end justify-center">
            {/* Backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-[#2A2520]/60 backdrop-blur-xs cursor-pointer"
            />
            
            {/* V6 Slide up Drawer Sheet - overflow-hidden keeps content and scrollbar contained inside */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-h-[85vh] bg-white rounded-t-[2rem] border-t border-brand-brown/5 shadow-2xl p-6 flex flex-col gap-5 z-10 overflow-hidden"
            >
              {/* Header section - static layout */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-heading text-lg font-black text-brand-brown uppercase tracking-tight">
                    Фильтры и поиск
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-full bg-brand-cream hover:bg-brand-cream/80 text-brand-brown flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* V6 Nested Scrollable container - data-lenis-prevent enables native drawer touch scroll, pr-2 places scrollbar inside */}
              <div 
                data-lenis-prevent={true}
                className="overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6 flex-1 scrollbar-thin"
              >
                {/* Search input in drawer */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/30" />
                  <input
                    type="text"
                    placeholder="Поиск сбора..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-brand-cream/40 focus:bg-white border border-brand-brown/10 rounded-xl text-brand-brown font-medium outline-none"
                  />
                </div>

                {/* pre-expanded Filter options */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-brown/40">Раздел</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {FILTER_TABS.map((tab) => {
                      const isSelected = activeFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleFilterChange(tab.id)}
                          className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-brand-orange text-white shadow-md shadow-brand-orange/15"
                              : "bg-brand-cream/60 hover:bg-brand-cream text-brand-brown/85 border border-brand-brown/5"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* pre-expanded Sorters with Lucide icons */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-brown/40">Сортировка</h4>
                  <div className="flex flex-col gap-2">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = activeSort === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSortChange(opt.id)}
                          className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20"
                              : "bg-brand-cream/60 hover:bg-brand-cream text-brand-brown/80 border border-brand-brown/5"
                          }`}
                        >
                          <opt.icon className="w-4 h-4 shrink-0 text-brand-orange" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Apply and Clear action items */}
                <div className="flex gap-3 pt-4 border-t border-brand-cream/50 mt-2 pb-4">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 py-4 bg-brand-cream hover:bg-brand-cream/80 text-brand-brown text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Сбросить
                  </button>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 py-4 bg-brand-orange hover:bg-[#cc492a] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-brand-orange/10"
                  >
                    Применить
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stable Grid of Bento and Standard Cards (No dynamic container key prevents unmounting scroll flickers!) */}
      <AnimatePresence mode="popLayout">
        {displayedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {displayedCampaigns.map((campaign) => {
              const isPrimaryCard = !!campaign.primary;
              return (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  isPrimary={isPrimaryCard} 
                />
              );
            })}
          </div>
        ) : (
          /* Empty Search results Fallback view */
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-3xl border border-brand-brown/5 shadow-xs"
          >
            <div className="w-16 h-16 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl flex items-center justify-center mb-6">
              <Info className="w-8 h-8 text-brand-orange" />
            </div>
            <h3 className="font-heading text-2xl font-black text-brand-brown uppercase tracking-tight mb-2">
              Сборов не найдено
            </h3>
            <p className="text-brand-brown-light font-medium text-sm md:text-base max-w-md leading-relaxed mb-6">
              К сожалению, по вашему запросу не нашлось подходящих сборов. Попробуйте изменить параметры фильтрации или поиска.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-8 py-3.5 bg-brand-orange hover:bg-[#cc492a] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-brand-orange/10"
            >
              Сбросить все фильтры
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show More Pagination Controls */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-10 py-4.5 bg-white hover:bg-brand-cream hover:text-brand-orange border border-brand-brown/10 hover:border-brand-orange text-brand-brown rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md hover:shadow-lg focus:outline-none"
          >
            Показать еще сборы
          </button>
        </div>
      )}
    </div>
  );
}
