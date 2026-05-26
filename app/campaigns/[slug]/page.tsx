import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Calendar, HeartHandshake, ShieldCheck } from "lucide-react";

import { SmoothScroll } from "../../components/ui/smooth-scroll";
import { ScrollToTop } from "../../components/ui/scroll-to-top";
import { Header } from "../../components/sections/header";
import { Footer } from "../../components/sections/footer";
import { FormDonation } from "../../components/form-donation";
import { OtherDonations } from "../../components/other-donations";
import { ProgressTabs } from "./progress-tabs";
import { CompletedCard } from "./completed-card";
import { Breadcrumbs } from "../../components/ui/breadcrumbs";
import { getCampaignData, getLandingData } from "../../services/landing.service";
import { getRecentDonationsForCampaign } from "../../services/donation.service";

interface CampaignPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamically resolve image URLs from relative paths
function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (apiUrl) {
    try {
      const host = new URL(apiUrl).origin;
      return `${host}${url}`;
    } catch (e) {
      return apiUrl.replace(/\/api$/, '') + url;
    }
  }
  return `http://localhost:1443${url}`;
}

// Dynamically split title to make the second half colored in orange and italicized
function formatCampaignTitle(title?: string) {
  if (!title) return "";
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return title;
  
  const mid = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, mid).join(" ");
  const secondHalf = words.slice(mid).join(" ");
  
  return (
    <>
      {firstHalf}{" "}
      <span className="text-brand-orange italic">{secondHalf}</span>
    </>
  );
}

export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignData(slug);

  if (!campaign) {
    return {
      title: "Сбор не найден — Благотворительный фонд Дом Лобова",
    };
  }

  const title = `${campaign.name} — Благотворительный фонд Дом Лобова`;
  const description = campaign.descr ? campaign.descr.substring(0, 160) + "..." : "Страница сбора средств благотворительного фонда.";
  const imageUrl = campaign.image?.url ? resolveImageUrl(campaign.image.url) : "https://domlobova.ru/logo-dark.svg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: campaign.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params;
  
  // Fetch details of the current campaign first using the slug to resolve its database document ID
  const campaign = await getCampaignData(slug);

  if (!campaign) {
    notFound();
  }

  // Fetch landing details and campaign-specific donations in parallel using the resolved documentId
  const [landing, donations] = await Promise.all([
    getLandingData(process.env.NEXT_PUBLIC_SITE_SLUG || "domlobova"),
    getRecentDonationsForCampaign(campaign.documentId || String(campaign.id), 30)
  ]);

  const isCompleted = !!campaign.closed;

  // Format dates beautifully
  const createdDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const closedDate = isCompleted && campaign.updatedAt
    ? new Date(campaign.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  // Resolve the image URL
  const imageUrl = campaign.image?.url ? resolveImageUrl(campaign.image.url) : null;

  // Split description paragraphs to show the first paragraph as the intro, and remaining paragraphs in the details section
  const paragraphs = campaign.descr ? campaign.descr.split("\n").map((p: string) => p.trim()).filter(Boolean) : [];
  const introParagraph = paragraphs[0] || '';
  const detailParagraphs = paragraphs.slice(1);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-yellow selection:text-brand-brown">
        <Header />

        <main className="pt-28 md:pt-36 lg:pt-40 pb-0">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
            
            {/* Breadcrumbs */}
            <div className="mb-8 md:mb-12 flex flex-wrap items-center justify-between gap-4 relative z-[60]">
              <div className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-brand-brown/40">
                <Link href="/" className="inline-block relative z-10 cursor-pointer hover:text-brand-orange transition-colors duration-300 pb-0.5 after:absolute after:pointer-events-none after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left after:duration-300">
                  Главная
                </Link>
                <span>/</span>
                <Link href="/campaigns" className="inline-block relative z-10 cursor-pointer hover:text-brand-orange transition-colors duration-300 pb-0.5 after:absolute after:pointer-events-none after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left after:duration-300">
                  Сборы
                </Link>
                <span>/</span>
                <span className="text-brand-brown/70 line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md select-none">
                  {campaign.name}
                </span>
              </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Campaign Details (7/12 cols) */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-8 md:space-y-10">
                
                {/* Header Information */}
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex flex-wrap gap-3">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20 animate-pulse-slow">
                        Сбор успешно завершен 🎉
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-brand-orange/10 text-brand-orange border border-brand-orange/20 animate-pulse-slow">
                        <Sparkles className="w-3.5 h-3.5 fill-current" /> Активный сбор
                      </span>
                    )}
                    {campaign.primary && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-brand-yellow/20 text-[#5A3B00] border border-[#5A3B00]/10">
                        Важный сбор
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-brand-brown tracking-tighter leading-[0.95] uppercase">
                    {formatCampaignTitle(campaign.name)}
                  </h1>

                  {/* Polished date badges with custom styled icons */}
                  {createdDate && (
                    <div className="flex flex-wrap gap-3 md:gap-4 items-center text-xs md:text-sm font-black uppercase tracking-wider text-brand-brown/60 pt-1">
                      <div className="flex items-center gap-2 bg-white/50 border border-brand-brown/5 rounded-full px-4 py-2 shadow-xs">
                        <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>Начало: {createdDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/50 border border-brand-brown/5 rounded-full px-4 py-2 shadow-xs">
                        {isCompleted && closedDate ? (
                          <>
                            <Calendar className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Окончание: {closedDate}</span>
                          </>
                        ) : (
                          <>
                            <HeartHandshake className="w-4 h-4 text-brand-orange shrink-0 animate-pulse" />
                            <span>Окончание: До достижения цели</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Intro short description */}
                  {introParagraph && (
                    <p className="pt-4 text-lg md:text-xl xl:text-2xl text-brand-brown/85 font-medium leading-relaxed max-w-4xl italic">
                      {introParagraph}
                    </p>
                  )}
                </div>

                {/* Campaign Image */}
                {imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-brand-brown/5 shadow-2xl shadow-brand-brown/5 group">
                    <Image 
                      src={imageUrl} 
                      alt={campaign.name || "Изображение сбора"} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 800px"
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                  </div>
                )}

                {/* Mobile/Tablet Widget: Form or Celebratory Card rendered immediately after image */}
                <div className="lg:hidden">
                  {isCompleted ? (
                    <CompletedCard 
                      campaignName={campaign.name} 
                      goalAmount={campaign.goal || campaign.current || 0} 
                      donationsCount={donations.length} 
                    />
                  ) : (
                    <FormDonation 
                      initialCampaignId={campaign.documentId || String(campaign.id)} 
                      initialCampaignTitle={campaign.name}
                      isSidebar={true}
                      title="Поддержать сбор"
                      className="shadow-2xl shadow-brand-brown/10"
                    />
                  )}
                </div>

                {/* Progress Card Section - Integrates the Two-Tab Interactive Component */}
                <ProgressTabs campaign={campaign} donations={donations} />

                {/* Polished Card-Styled Description details */}
                <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-brand-brown/5 p-6 md:p-10 shadow-[0_20px_50px_rgba(74,63,53,0.04)] space-y-8 relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange-light/20 border border-brand-orange/30 flex items-center justify-center shrink-0 shadow-xs">
                      <HeartHandshake className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-black text-brand-brown tracking-tight uppercase">
                      О проекте
                    </h3>
                  </div>

                  <div className="relative pl-6 border-l-3 border-brand-orange/40 text-base md:text-lg text-brand-brown-light font-medium leading-relaxed space-y-4">
                        <p className="last:mb-0">
                          Дом милосердия кузнеца Лобова с 2018 года оказывает профессиональную медико-социальную помощь людям с неизлечимыми заболеваниями и их семьям. В отделении милосердия снимают боль, создают комфортные условия жизни, приближенные к домашним, организуют круглосуточный уход. Здесь одновременно может проживать 20 человек. Также работает выездная служба «Забота на дому», которая оказывает помощь жителям Ростовского, Борисоглебского, Гаврилов -Ямского и Переславского районов. Ежемесячно выездная бригада обслуживает 60 человек. Все услуги благотворительной организации абсолютно бесплатны, это стало возможным благодаря поддержке партнеров, спонсоров и сотен людей. Обратиться за помощью можно по телефону горячей линии +7 (920) 122-97-37, будни с 8:00 до 17:00
                        </p>
                  </div>

                  {/* Trust footer section */}
                  <div className="mt-8 pt-6 border-t border-brand-cream flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs md:text-sm font-black uppercase tracking-widest text-brand-brown/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
                      <span>Официальный сбор фонда</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Donation Widget or Completed Celebration Card (5/12 cols, sticky on large viewports, hidden on mobile/tablet) */}
              <div className="hidden lg:block lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28">
                {isCompleted ? (
                  <CompletedCard 
                    campaignName={campaign.name} 
                    goalAmount={campaign.goal || campaign.current || 0} 
                    donationsCount={donations.length} 
                  />
                ) : (
                  <FormDonation 
                    initialCampaignId={campaign.documentId || String(campaign.id)} 
                    initialCampaignTitle={campaign.name}
                    isSidebar={true}
                    title="Поддержать сбор"
                    className="shadow-2xl shadow-brand-brown/10"
                  />
                )}
              </div>

            </div>

            {/* Bottom Section: Recommend Other Campaigns with Transparent Background */}
            {landing?.campaigns?.campaigns && (
              <div className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-brand-brown/10">
                <OtherDonations campaigns={landing.campaigns.campaigns} transparent className="!pb-20 md:!pb-28 lg:!pb-32" />
              </div>
            )}

          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </SmoothScroll>
  );
}
