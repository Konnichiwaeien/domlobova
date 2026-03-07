import { Metadata } from "next";
import { SmoothScroll } from "./components/ui/smooth-scroll";
import { ScrollToTop } from "./components/ui/scroll-to-top";
import { Header } from "./components/sections/header";
import { Hero } from "./components/sections/hero";
import { PhotoMarquee } from "./components/sections/photo-marquee";
import { ElegantProgress } from "./components/sections/elegant-progress";
import dynamic from "next/dynamic";

const OtherDonations = dynamic(() => import("./components/other-donations").then(mod => mod.OtherDonations));
const About = dynamic(() => import("./components/sections/about").then(mod => mod.About));
const Stories = dynamic(() => import("./components/sections/stories").then(mod => mod.Stories));
const FundsUsage = dynamic(() => import("./components/sections/funds-usage").then(mod => mod.FundsUsage));
const DonationBlock = dynamic(() => import("./components/sections/donation-block").then(mod => mod.DonationBlock));
const VolunteerSection = dynamic(() => import("./components/sections/volunteer").then(mod => mod.VolunteerSection));
const Footer = dynamic(() => import("./components/sections/footer").then(mod => mod.Footer));
const Preloader = dynamic(() => import("./components/ui/preloader/preloader").then(mod => mod.Preloader));

import { getLandingData } from "./services/landing.service";

export async function generateMetadata(): Promise<Metadata> {
  const landingSlug = process.env.NEXT_PUBLIC_SITE_SLUG || "domlobova";
  const landing = await getLandingData(landingSlug);

  return {
    title: landing?.seoTitle || "Благотворительный фонд Дом Лобова",
    description: landing?.seoDescription || "Сайт благотворительного фонда Дом Лобова.",
    keywords: landing?.seoKeywords || "благотворительность, фонд Дом Лобова, помощь",
  };
}

export default async function Home() {
  const landingSlug = process.env.NEXT_PUBLIC_SITE_SLUG || "domlobova";
  const landing = await getLandingData(landingSlug);

  return (
    <SmoothScroll>
      <Preloader />
      <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-yellow selection:text-brand-brown">
        <Header />

        <main>
          <Hero 
            titleTop={landing?.hero?.titleTop} 
            titleBottom={landing?.hero?.titleBottom} 
            heroDescription={landing?.hero?.descr} 
            videoUrl={landing?.hero?.video?.url}
            welcomeTitle={landing?.welcome?.title}
            welcomeDescription={landing?.welcome?.descr}
          />

          <PhotoMarquee photos={landing?.welcome?.photos?.map((p: any) => p.url)} />

          <ElegantProgress 
            title={landing?.campaigns?.title} 
            descr={landing?.campaigns?.descr}
            partners={landing?.campaigns?.campaigns}
          />

          <OtherDonations campaigns={landing?.campaigns?.campaigns} />

          <About 
            title={landing?.about?.title}
            descr={landing?.about?.descr}
            photos={landing?.about?.photos}
            stats={landing?.about?.stats}
            features={landing?.about?.features}
            promo={landing?.about?.promo}
          />

          <Stories stories={landing?.stories} />

          <FundsUsage data={landing?.needs} />

          <DonationBlock />

          <VolunteerSection data={landing?.volunteers_needs} />
        </main>

        <Footer />

        <ScrollToTop />
      </div>
    </SmoothScroll>
  );
}
