"use client";

import { HeroTransition } from "../../hero-transition";

interface HeroProps {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  welcomeTitle?: string;
  welcomeDescription?: string;
}

const Hero = ({ titleTop, titleBottom, heroDescription, welcomeTitle, welcomeDescription }: HeroProps) => {
  return (
    <HeroTransition 
      titleTop={titleTop} 
      titleBottom={titleBottom} 
      heroDescription={heroDescription} 
      welcomeTitle={welcomeTitle}
      welcomeDescription={welcomeDescription}
    />
  );
};

export { Hero };
