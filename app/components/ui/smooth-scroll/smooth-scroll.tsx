"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch/coarse-pointer devices where Lenis adds overhead
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(mq.matches);
  }, []);

  if (isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export { SmoothScroll };
