import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="mb-8 md:mb-12 flex flex-wrap items-center justify-between gap-4 relative z-10 select-none">
      <div className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-brand-brown/40">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-brand-brown/20 font-medium">/</span>}
              {isLast || !item.href ? (
                <span className="text-brand-brown/70 line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md select-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-block relative z-10 cursor-pointer hover:text-brand-orange transition-colors duration-300 pb-0.5 after:absolute after:pointer-events-none after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left after:duration-300"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
