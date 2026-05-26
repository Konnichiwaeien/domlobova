import { Metadata } from "next";
import { getAllCampaigns } from "../services/landing.service";
import { Header } from "../components/sections/header";
import { Footer } from "../components/sections/footer";
import { ScrollToTop } from "../components/ui/scroll-to-top";
import { SmoothScroll } from "../components/ui/smooth-scroll";
import { CampaignsFilterList } from "./campaigns-filter-list";

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

  // 1. SSR Text Search logic
  let filtered = [...rawCampaigns];
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (c) => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.descr && c.descr.toLowerCase().includes(q))
    );
  }

  // 2. SSR Filter tab logic
  if (filter === "active") {
    filtered = filtered.filter((c) => !c.closed);
  } else if (filter === "primary") {
    filtered = filtered.filter((c) => c.primary);
  } else if (filter === "closed") {
    filtered = filtered.filter((c) => c.closed);
  }

  // 3. SSR Sort logic (V3 Bidirectional)
  filtered.sort((a, b) => {
    const aGoal = a.goal || 0;
    const aCurrent = a.current || 0;
    const aPercent = aGoal > 0 ? (aCurrent / aGoal) * 100 : 0;
    
    const bGoal = b.goal || 0;
    const bCurrent = b.current || 0;
    const bPercent = bGoal > 0 ? (bCurrent / bGoal) * 100 : 0;

    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (sort === "newest") {
      return bDate - aDate;
    }
    if (sort === "oldest") {
      return aDate - bDate;
    }
    
    if (sort === "progress_desc") {
      return bPercent - aPercent;
    }
    if (sort === "progress_asc") {
      return aPercent - bPercent;
    }

    if (sort === "urgency") {
      // Active first, then closed
      if (!!a.closed !== !!b.closed) {
        return a.closed ? 1 : -1;
      }
      // Active closest to completion first (highest percentage)
      return bPercent - aPercent;
    }

    if (sort === "goal_desc") {
      return bGoal - aGoal;
    }
    if (sort === "goal_asc") {
      return aGoal - bGoal;
    }

    return 0;
  });

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-yellow selection:text-brand-brown">
        <Header />
        
        {/* Unified internal page vertical padding system */}
        <main className="pt-28 md:pt-36 lg:pt-40 pb-20 md:pb-28 lg:pb-32">
          <CampaignsFilterList 
            initialCampaigns={filtered} 
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
