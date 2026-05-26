"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter } from "lucide-react";

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface SortOption {
  readonly id: string;
  readonly label: string;
  readonly icon: any;
}

interface FilterDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchVal: string;
  setSearchVal: (val: string) => void;
  activeFilter: string;
  onFilterChange: (id: string) => void;
  activeSort: string;
  onSortChange: (id: string) => void;
  onReset: () => void;
  filterTabs: readonly FilterOption[];
  sortOptions: readonly SortOption[];
}

export function FilterDrawer({
  isOpen,
  setIsOpen,
  searchVal,
  setSearchVal,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  onReset,
  filterTabs,
  sortOptions,
}: FilterDrawerProps) {
  // Lock document body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("scroll-locked");
    } else {
      document.documentElement.classList.remove("scroll-locked");
    }
    return () => {
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#2A2520]/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide up Drawer Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-full max-h-[85vh] bg-white rounded-t-[2rem] border-t border-brand-brown/5 shadow-2xl p-6 flex flex-col gap-5 z-10 overflow-hidden"
          >
            {/* Header section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand-orange" />
                <h3 className="font-heading text-lg font-black text-brand-brown uppercase tracking-tight">
                  Фильтры и поиск
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-brand-cream hover:bg-brand-cream/80 text-brand-brown flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Закрыть фильтры"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable inputs container */}
            <div
              data-lenis-prevent={true}
              className="overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6 flex-1 scrollbar-thin"
            >
              {/* Search input */}
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

              {/* Filter tabs options */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-brown/40">
                  Раздел
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {filterTabs.map((tab) => {
                    const isSelected = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => onFilterChange(tab.id)}
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

              {/* Sorting options */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-brown/40">
                  Сортировка
                </h4>
                <div className="flex flex-col gap-2">
                  {sortOptions.map((opt) => {
                    const isSelected = activeSort === opt.id;
                    const OptIcon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onSortChange(opt.id)}
                        className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20"
                            : "bg-brand-cream/60 hover:bg-brand-cream text-brand-brown/80 border border-brand-brown/5"
                        }`}
                      >
                        <OptIcon className="w-4 h-4 shrink-0 text-brand-orange" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex gap-3 pt-4 border-t border-brand-cream/50 mt-2 pb-4">
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 py-4 bg-brand-cream hover:bg-brand-cream/80 text-brand-brown text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
  );
}
