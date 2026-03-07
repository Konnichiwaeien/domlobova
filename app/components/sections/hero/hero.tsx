"use client";

import { HeroTransition } from "../../hero-transition";

interface HeroProps {
  titleTop?: string;
  titleBottom?: string;
  heroDescription?: string;
  videoUrl?: string;
  welcomeTitle?: string;
  welcomeDescription?: string;
}

const Hero = ({ titleTop, titleBottom, heroDescription, videoUrl, welcomeTitle, welcomeDescription }: HeroProps) => {
  return (
    <HeroTransition 
      titleTop={titleTop} 
      titleBottom={titleBottom} 
      heroDescription={heroDescription} 
      videoUrl={videoUrl}
      welcomeTitle={welcomeTitle}
      welcomeDescription={welcomeDescription}
    />
  );
};

export { Hero };
