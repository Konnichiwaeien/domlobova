"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";

interface DropdownOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: readonly DropdownOption[] | DropdownOption[];
  icon: LucideIcon;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChange: (id: string) => void;
  widthClass?: string;
}

export function FilterDropdown({
  label,
  value,
  options,
  icon: Icon,
  isOpen,
  setIsOpen,
  onChange,
  widthClass = "w-72",
}: FilterDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const selectedLabel = options.find((opt) => opt.id === value)?.label || "";

  return (
    <div className="relative select-none" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 bg-brand-cream/50 hover:bg-brand-cream border border-brand-brown/10 rounded-xl flex items-center justify-between gap-3 text-sm font-bold uppercase tracking-wider text-brand-brown cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
      >
        <Icon className="w-4 h-4 text-brand-orange" />
        <span>
          {label}: {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-brand-brown/40 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-3 bg-white rounded-2xl border border-brand-brown/10 shadow-[0_20px_50px_rgba(74,63,53,0.15)] p-3 z-[99] overflow-hidden ${widthClass}`}
          >
            {options.map((opt) => {
              const isSelected = value === opt.id;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-4 whitespace-nowrap ${
                    isSelected
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "text-brand-brown/80 hover:bg-brand-cream"
                  }`}
                >
                  {OptIcon && <OptIcon className="w-4.5 h-4.5 shrink-0 text-brand-orange" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
