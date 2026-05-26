import { Metadata } from "next";
import { getAllCampaigns } from "../services/landing.service";
import { Header } from "../components/sections/header";
import { Footer } from "../components/sections/footer";
import { ScrollToTop } from "../components/ui/scroll-to-top";
import { SmoothScroll } from "../components/ui/smooth-scroll";
import { CampaignsFilterList } from "./components/campaigns-filter-list";
import { filterCampaigns, sortCampaigns } from "./utils/filter-sort";

export const metadata: Metadata = {
  title: "Все сборы — Благотворительный фонд Дом Лобова",
  description: "Список всех благотворительных сборов и проектов фонда Дом милосердия кузнеца Лобова. Помогите нам подарить заботу и облегчить жизнь неизлечимо больным людям.",
  openGraph: {
    title: "Все сборы — Благотворительный фонд Дом Лобова",
    description: "Помогите нам подарить заботу и облегчить жизнь неизлечимо больным людям.",
    type: "website",
  }
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    sort?: string;
  }>;
}

export default async function CampaignsListPage({ searchParams }: PageProps) {
  const { search = "", filter = "all", sort = "newest" } = await searchParams;
  const rawCampaigns = await getAllCampaigns();

  // Clean, professional, and modular server-side filtering and sorting via pure helper functions
  const filteredCampaigns = filterCampaigns(rawCampaigns, search, filter);
  const sortedCampaigns = sortCampaigns(filteredCampaigns, sort);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-yellow selection:text-brand-brown">
        <Header />
        
        {/* Unified internal page vertical padding system */}
        <main className="pt-28 md:pt-36 lg:pt-40 pb-20 md:pb-28 lg:pb-32">
          <CampaignsFilterList 
            initialCampaigns={sortedCampaigns} 
            activeFilter={filter}
            activeSort={sort}
            searchQuery={search}
          />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </SmoothScroll>
  );
}
