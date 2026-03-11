import { Metadata } from "next";
import { SmoothScroll } from "./components/ui/smooth-scroll";
import { ScrollToTop } from "./components/ui/scroll-to-top";
import { Header } from "./components/sections/header";
import { Hero } from "./components/sections/hero";
import { FeaturesMarquee } from "./components/sections/features-marquee/features-marquee";
import { ElegantProgress } from "./components/sections/elegant-progress";
import dynamic from "next/dynamic";

const OtherDonations = dynamic(() => import("./components/other-donations").then(mod => mod.OtherDonations));
const About = dynamic(() => import("./components/sections/about").then(mod => mod.About));
const Stories = dynamic(() => import("./components/sections/stories").then(mod => mod.Stories));
const FundsUsage = dynamic(() => import("./components/sections/funds-usage").then(mod => mod.FundsUsage));
const DonationBlock = dynamic(() => import("./components/sections/donation-block").then(mod => mod.DonationBlock));
// const VolunteerSection = dynamic(() => import("./components/sections/volunteer").then(mod => mod.VolunteerSection));
const Footer = dynamic(() => import("./components/sections/footer").then(mod => mod.Footer));
// const Preloader = dynamic(() => import("./components/ui/preloader/preloader").then(mod => mod.Preloader));

import { getLandingData } from "./services/landing.service";
import { getRecentDonations } from "./services/donation.service";

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
  const [landing, recentDonations] = await Promise.all([
    getLandingData(landingSlug),
    getRecentDonations(20)
  ]);

  return (
    <SmoothScroll>
      {/* <Preloader /> */}
      <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-yellow selection:text-brand-brown">
        <Header />

        <main>
          <Hero 
            titleTop={landing?.hero?.titleTop} 
            titleBottom={landing?.hero?.titleBottom} 
            heroDescription={landing?.hero?.descr} 
            heroPhotos={landing?.hero?.photos}
          />

          <FeaturesMarquee features={landing?.about?.features} />

          <ElegantProgress 
            title={landing?.campaigns?.title} 
            descr={landing?.campaigns?.descr}
            partners={landing?.campaigns?.campaigns}
            recentDonations={recentDonations}
          />

          <OtherDonations campaigns={landing?.campaigns?.campaigns} />

          <Stories stories={landing?.stories} />

          <FundsUsage data={landing?.needs} />

          <DonationBlock />

          {/* <VolunteerSection data={landing?.volunteers_needs} /> */}

          <About 
            title={landing?.about?.title}
            descr={landing?.about?.descr}
            photos={landing?.about?.photos}
            stats={landing?.about?.stats}
            features={landing?.about?.features}
            promo={landing?.about?.promo}
          />
        </main>

        <Footer />

        <ScrollToTop />
      </div>
    </SmoothScroll>
  );
}
