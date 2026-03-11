"use client";

import { HeroTransition } from "../../hero-transition";

interface HeroProps {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  heroPhotos?: any[];
}

const Hero = ({ titleTop, titleBottom, heroDescription, heroPhotos }: HeroProps) => {
  return (
    <HeroTransition 
      titleTop={titleTop} 
      titleBottom={titleBottom} 
      heroDescription={heroDescription} 
      heroPhotos={heroPhotos}
    />
  );
};

export { Hero };
