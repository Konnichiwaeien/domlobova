"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface StoriesProps {
  stories?: any[];
}

const Stories = ({ stories: customStories }: StoriesProps) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const defaultStyling = [
    { color: "bg-brand-yellow/30" },
    { color: "bg-brand-orange-light/30" },
    { color: "bg-brand-blue-light/30" },
  ];

  const getAgeString = (age?: number) => {
    if (!age) return "";
    let n = Math.abs(age) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) return `${age} лет`;
    if (n1 > 1 && n1 < 5) return `${age} года`;
    if (n1 === 1) return `${age} год`;
    return `${age} лет`;
  };

  const stories = useMemo(() => {
    if (customStories && customStories.length > 0) {
      return customStories.map((story, idx) => ({
        name: story.name || "",
        age: getAgeString(story.age),
        quote: (story.quote || "").replace(/^«|»$/g, "").trim(),
        story: story.description || "",
        img: Array.isArray(story.image)
          ? story.image[0]?.url
          : story.image?.url || `/images/${(idx % 3) + 1}.webp`,
        color: defaultStyling[idx % defaultStyling.length].color,
      }));
    }
    return [
      {
        name: "Мария Ивановна",
        age: "78 лет",
        quote:
          "Я думала, что осталась совсем одна. Но здесь мне вернули не только здоровье, но и семью.",
        story:
          "Мария Ивановна потеряла близких и оказалась без поддержки. Отделение милосердия стало для неё вторым домом — здесь она получила полноценный уход, регулярное питание и, главное, людей, которым не всё равно.",
        img: "/images/1.webp",
        color: "bg-brand-yellow/30",
      },
      {
        name: "Алексей Сергеевич",
        age: "45 лет",
        quote:
          "Новая инвалидная коляска подарила мне возможность снова выходить на улицу и видеть небо.",
        story:
          "После тяжёлой травмы Алексей оказался прикован к дому. Благодаря средствам фонда удалось приобрести специализированную коляску и организовать курс реабилитации. Сейчас он снова ведёт активную жизнь.",
        img: "/images/2.webp",
        color: "bg-brand-orange-light/30",
      },
      {
        name: "Елена",
        age: "62 года",
        quote:
          "Спасибо сиделкам фонда. Без их круглосуточной поддержки мы бы не справились с болезнью мужа.",
        story:
          "Муж Елены тяжело заболел, и семья не могла обеспечить круглосуточный уход самостоятельно. Фонд выделил профессиональную сиделку и оплатил необходимые медикаменты. Это позволило Елене сохранить силы и быть рядом.",
        img: "/images/3.webp",
        color: "bg-brand-blue-light/30",
      },
    ];
  }, [customStories]);

  return (
    <section
      id="stories"
      className="relative bg-white py-16 md:py-24 lg:py-28 overflow-hidden content-auto"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown uppercase">
            Истории{" "}
            <br />
            <span className="text-brand-orange italic">подопечных</span>
          </h2>
          <div className="hidden md:flex gap-2">
            <button
              aria-label="Предыдущая история"
              className="stories-prev w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 disabled:cursor-not-allowed"
              disabled={isBeginning}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              aria-label="Следующая история"
              className="stories-next w-12 h-12 rounded-full border border-brand-brown/10 flex items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 disabled:cursor-not-allowed"
              disabled={isEnd}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".stories-prev",
            nextEl: ".stories-next",
          }}
          spaceBetween={24}
          slidesPerView={1.05}
          breakpoints={{
            640: { slidesPerView: 1.3 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2.2 },
            1280: { slidesPerView: 2.5 },
          }}
          grabCursor={true}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onBeforeInit={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          className="w-full [&>.swiper-wrapper]:items-stretch"
        >
          {stories.map((story, idx) => (
            <SwiperSlide key={idx} className="h-auto! flex">
              <div className="flex flex-col w-full h-full overflow-hidden rounded-2xl md:rounded-[3rem] bg-white border border-brand-brown/10">
                {/* Image */}
                <div className="relative h-64 md:h-80 w-full shrink-0">
                  <Image
                    src={story.img}
                    alt={story.name}
                    fill
                    sizes="(max-width: 768px) 95vw, (max-width: 1024px) 55vw, 40vw"
                    quality={85}
                    loading="lazy"
                    className="object-cover"
                  />
                </div>

                {/* Text content */}
                <div className="flex flex-col flex-1 p-5 md:p-6 lg:p-8">
                  <div
                    className={`mb-2 md:mb-3 self-start rounded-full ${story.color} px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-bold uppercase tracking-widest text-brand-brown shadow-sm`}
                  >
                    {story.age}
                  </div>

                  <h3 className="mb-2 md:mb-3 font-heading text-xl md:text-2xl lg:text-3xl font-bold text-brand-brown">
                    {story.name}
                  </h3>

                  <p className="text-sm md:text-base font-medium leading-relaxed text-brand-brown-light italic mb-3 md:mb-4">
                    «{story.quote}»
                  </p>

                  {/* Separator */}
                  <div className="flex items-center gap-3 mb-3 opacity-60">
                    <div className="w-8 md:w-12 h-[2px] bg-brand-orange/40 rounded-full" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40" />
                    <div className="w-8 md:w-12 h-[2px] bg-brand-orange/40 rounded-full" />
                  </div>

                  <div className="relative flex-1 min-h-0 overflow-hidden">
                    <div data-lenis-prevent="true" className="h-40 md:h-48 overflow-y-auto pr-2 custom-scrollbar">
                      <p className="text-sm md:text-base leading-relaxed text-brand-brown-light/70 pb-4">
                        {story.story}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-2 h-8 bg-linear-to-t from-white to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export { Stories };
