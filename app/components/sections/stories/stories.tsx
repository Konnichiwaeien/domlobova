"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface StoriesProps {
  stories?: any[];
}

const Stories = ({ stories: customStories }: StoriesProps) => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: targetRef });

  // Map scroll progress to a numeric value 0-100 to avoid string interpolation errors in Framer Motion
  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  // Manually construct the calc string on each frame so Framer Motion doesn't choke on calc()
  const x = useTransform(progress, (p) => `calc(-${p}% + ${p}vw)`);

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

  const stories = customStories && customStories.length > 0
    ? customStories.map((story, idx) => ({
        name: story.name || "",
        age: getAgeString(story.age),
        quote: (story.quote || "").replace(/^«|»$/g, '').trim(),
        story: story.description || "",
        img: Array.isArray(story.image) ? story.image[0]?.url : (story.image?.url || `/images/${(idx % 3) + 1}.webp`),
        color: defaultStyling[idx % defaultStyling.length].color,
      }))
    : [
        {
          name: "Мария Ивановна",
          age: "78 лет",
          quote: "Я думала, что осталась совсем одна. Но здесь мне вернули не только здоровье, но и семью.",
          story: "Мария Ивановна потеряла близких и оказалась без поддержки. Отделение милосердия стало для неё вторым домом — здесь она получила полноценный уход, регулярное питание и, главное, людей, которым не всё равно.",
          img: "/images/1.webp",
          color: "bg-brand-yellow/30",
        },
        {
          name: "Алексей Сергеевич",
          age: "45 лет",
          quote: "Новая инвалидная коляска подарила мне возможность снова выходить на улицу и видеть небо.",
          story: "После тяжёлой травмы Алексей оказался прикован к дому. Благодаря средствам фонда удалось приобрести специализированную коляску и организовать курс реабилитации. Сейчас он снова ведёт активную жизнь.",
          img: "/images/2.webp",
          color: "bg-brand-orange-light/30",
        },
        {
          name: "Елена",
          age: "62 года",
          quote: "Спасибо сиделкам фонда. Без их круглосуточной поддержки мы бы не справились с болезнью мужа.",
          story: "Муж Елены тяжело заболел, и семья не могла обеспечить круглосуточный уход самостоятельно. Фонд выделил профессиональную сиделку и оплатил необходимые медикаменты. Это позволило Елене сохранить силы и быть рядом.",
          img: "/images/3.webp",
          color: "bg-brand-blue-light/30",
        },
      ];

  return (
    <section
      ref={targetRef}
      id="stories"
      className="relative h-[250vh] bg-[#F9F8F6]"
    >
      <div className="sticky top-0 flex min-h-[850px] lg:min-h-[900px] h-screen flex-col overflow-hidden bg-[#F9F8F6] py-16 md:py-24 lg:py-28">
        {/* Title area: Fixed at the top, taking up standard space, no absolute positioning */}
        <div className="w-full flex-none px-5 md:px-12 mb-8 md:mb-10">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown uppercase">
            Истории <br/><span className="text-brand-orange italic">подопечных</span>
          </h2>
        </div>

        {/* Cards area */}
        <div className="flex-1 w-full relative flex items-stretch min-h-0 min-w-0">
          {/* We've applied an offset width so it translates exactly the width of the track minus the viewport. */}
          <motion.div
            style={{ x }}
            className="flex gap-5 md:gap-8 px-5 md:px-12 items-stretch h-full w-max will-change-transform"
          >
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="relative flex h-full w-[85vw] shrink-0 flex-col overflow-hidden rounded-2xl md:rounded-[3rem] bg-white border border-brand-brown/10 shadow-xl shadow-brand-orange/5 md:w-[75vw] lg:w-[60vw] md:flex-row"
            >
              {/* Image half */}
              <div className="relative h-[40%] md:h-auto w-full md:w-[40%] p-3 md:p-5 shrink-0">
                <div className="h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
                  <Image
                    src={story.img}
                    alt={``}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 75vw, 60vw"
                    quality={85}
                    loading="lazy"
                    className="object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
                  />
                </div>
              </div>

              {/* Text half */}
              <div className="flex flex-1 w-full md:w-[60%] flex-col p-5 md:p-6 lg:p-8 min-h-0 min-w-0 overflow-hidden">
                <div
                  className={`mb-2 md:mb-3 shrink-0 self-start rounded-full ${story.color} px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-bold uppercase tracking-widest text-brand-brown shadow-sm`}
                >
                  {story.age}
                </div>

                <h3 className="mb-2 md:mb-3 shrink-0 font-heading text-xl md:text-2xl lg:text-3xl font-bold text-brand-brown">
                  {story.name}
                </h3>

                <p className="text-sm md:text-base shrink-0 font-medium leading-relaxed text-brand-brown-light italic line-clamp-3 md:line-clamp-none">
                  «{story.quote}»
                </p>

                <div className="flex-1 mt-3 md:mt-4 relative overflow-hidden flex flex-col min-h-0 min-w-0 pb-2 md:pb-3">
                  {/* Elegant separator */}
                  <div className="flex items-center gap-3 mb-3 shrink-0 opacity-60">
                    <div className="w-8 md:w-12 h-[2px] bg-brand-orange/40 rounded-full" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40" />
                    <div className="w-8 md:w-12 h-[2px] bg-brand-orange/40 rounded-full" />
                  </div>
                  
                  <div className="flex-1 relative min-h-0 min-w-0">
                    <div className="absolute inset-0 overflow-y-auto pr-2 custom-scrollbar z-10">
                      <p className="text-sm md:text-base leading-relaxed text-brand-brown-light/70 wrap-break-word whitespace-pre-wrap">
                        {story.story}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bottom fade out to indicate scrolling */}
                  <div className="absolute bottom-0 left-0 right-2 h-8 md:h-12 bg-linear-to-t from-white to-transparent pointer-events-none z-20" />
                </div>
              </div>
            </div>
          ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Stories };
