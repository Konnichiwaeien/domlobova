"use client";

import React from "react";

export const ShdkTerminal = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='60px'
      height='45px'
      viewBox='0 0 110 36'
      style={{ verticalAlign: 'middle', marginLeft: '3px', ...props.style }}
      {...props}
    >
      <defs>
        <style>{`
          @keyframes blinkCursor {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .terminal-cursor {
            animation: blinkCursor 1s step-end infinite;
          }
        `}</style>
      </defs>

      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        rx='4'
        fill='#0f1f0f'
        stroke='currentColor'
        strokeWidth='1.5'
      />

      <text
        x='10'
        y='55%'
        dominantBaseline='middle'
        fontFamily="'Lucida Console', Monaco, monospace"
        fontSize='18'
        fontWeight='bold'
        fill='currentColor'
      >
        <tspan opacity='0.7'>&gt; </tspan>shdk
        <tspan className='terminal-cursor'>_</tspan>
      </text>
    </svg>
  );
};
