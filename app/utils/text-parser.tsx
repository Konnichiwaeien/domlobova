import React from "react";

/**
 * Parses text wrapped in asterisks (e.g. "КТО *МЫ* ТАКИЕ") and highlights them.
 * This is a shared utility function that can be used across multiple components.
 * 
 * @param text The string to parse.
 * @param fallback The default string if text is undefined.
 * @param highlightColorClass Tailwind text color class (default: "text-brand-orange").
 * @returns React nodes with styled highlights.
 */
export const renderHighlightedTitle = (
  text?: string, 
  fallback: string = "КТО МЫ ТАКИЕ",
  highlightColorClass: string = "text-brand-orange"
) => {
  const content = (text || fallback).replace(/&nbsp;/g, '\u00A0');
  const parts = content.split(/(\*[^*]+\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span 
          key={index} 
          className={`${highlightColorClass} italic`}
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};
