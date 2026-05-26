"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, SlidersHorizontal, Filter, Info, Clock, History, Hourglass, TrendingUp, Percent, ArrowUpWideNarrow, ArrowDownWideNarrow } from "lucide-react";

import { Breadcrumbs } from "../../components/ui/breadcrumbs";
import { CampaignCard } from "./campaign-card";
import { FilterDropdown } from "./filter-dropdown";
import { FilterDrawer } from "./filter-drawer";
import { Campaign } from "../utils/filter-sort";

interface CampaignsFilterListProps {
  initialCampaigns: Campaign[];
  activeFilter: string;
  activeSort: string;
  searchQuery: string;
}

export const FILTER_TABS = [
  { id: "all", label: "Все сборы" },
  { id: "active", label: "Активные" },
  { id: "primary", label: "Основные" },
  { id: "closed", label: "Завершенные" },
] as const;

export const SORT_OPTIONS = [
  { id: "newest", label: "По дате: сначала новые", icon: Clock },
  { id: "oldest", label: "По дате: сначала старые", icon: History },
  { id: "urgency", label: "Близкие к завершению", icon: Hourglass },
  { id: "progress_desc", label: "По прогрессу: сначала высокий", icon: TrendingUp },
  { id: "progress_asc", label: "По прогрессу: сначала низкий", icon: Percent },
  { id: "goal_desc", label: "По сумме: сначала крупные", icon: ArrowUpWideNarrow },
  { id: "goal_asc", label: "По сумме: сначала небольшие", icon: ArrowDownWideNarrow },
] as const;

export function CampaignsFilterList({
  initialCampaigns,
  activeFilter,
  activeSort,
  searchQuery,
}: CampaignsFilterListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inputs and responsive controls states
  const [searchVal, setSearchVal] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Synchronize local search value with URL query parameters
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // Debounced search query parameter synchronization
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

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
      {/* Dynamic Unified Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Сборы" }]} />

      {/* Page Title & Context Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-heading text-4xl md:text-6xl font-black text-brand-brown uppercase tracking-tighter leading-[0.95]">
          ВСЕ НАШИ <span className="text-brand-orange italic">СБОРЫ</span>
        </h1>
        <p className="mt-4 text-brand-brown-light text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Каждый ваш вклад помогает Дому милосердия кузнеца Лобова обеспечивать профессиональный
          круглосуточный уход за неизлечимо больными людям.
        </p>
      </div>

      {/* Mobile-First Controls Drawer Button */}
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
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="p-3.5 bg-brand-orange hover:bg-[#cc492a] text-white rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-brand-orange/10 transition-all duration-300 active:scale-95"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
        </button>
      </div>

      {/* Desktop Inline Controls Panel */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4 bg-white/70 backdrop-blur-md rounded-[2rem] border border-brand-brown/5 p-6 shadow-[0_20px_50px_rgba(74,63,53,0.04)] mb-10 relative z-40">
        {/* Desktop Search Input */}
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
              type="button"
              onClick={() => setSearchVal("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-brand-brown/40 hover:text-brand-brown hover:bg-brand-cream transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Custom Select Dropdowns */}
        <div className="flex items-center gap-4">
          <FilterDropdown
            label="Раздел"
            value={activeFilter}
            options={FILTER_TABS}
            icon={Filter}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            onChange={handleFilterChange}
            widthClass="w-72"
          />

          <FilterDropdown
            label="Сортировка"
            value={activeSort}
            options={SORT_OPTIONS}
            icon={SlidersHorizontal}
            isOpen={isSortOpen}
            setIsOpen={setIsSortOpen}
            onChange={handleSortChange}
            widthClass="w-96"
          />
        </div>
      </div>

      {/* Mobile Control Sheet Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activeSort={activeSort}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
        filterTabs={FILTER_TABS}
        sortOptions={SORT_OPTIONS}
      />

      {/* Grid of Bento and Standard Cards */}
      <AnimatePresence mode="popLayout">
        {displayedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {displayedCampaigns.map((campaign) => {
              const isPrimaryCard = !!campaign.primary;
              return (
                <CampaignCard key={campaign.id} campaign={campaign} isPrimary={isPrimaryCard} />
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
              К сожалению, по вашему запросу не нашлось подходящих сборов. Попробуйте изменить
              параметры фильтрации или поиска.
            </p>
            <button
              type="button"
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
            type="button"
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
