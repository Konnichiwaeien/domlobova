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
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-[#F9F8F6]">
        {/* Title area: Fixed at the top, taking up standard space, no absolute positioning */}
        <div className="w-full flex-none px-5 pt-14 pb-4 md:px-12 md:pt-20 md:pb-8">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown uppercase">
            Истории <br/><span className="text-brand-orange italic">подопечных</span>
          </h2>
        </div>

        {/* Cards area */}
        <div className="flex-1 w-full relative -mt-4 flex items-center">
          {/* We've applied an offset width so it translates exactly the width of the track minus the viewport. */}
          <motion.div
            style={{ x }}
            className="flex gap-5 md:gap-8 px-5 md:px-12 items-center w-max will-change-transform"
          >
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="relative flex h-[70vh] w-[85vw] shrink-0 flex-col overflow-hidden rounded-2xl md:rounded-[3rem] bg-white border border-brand-brown/10 shadow-xl shadow-brand-orange/5 md:h-[65vh] md:w-[75vw] lg:w-[60vw] md:flex-row"
            >
              {/* Image half */}
              <div className="relative h-[38%] md:h-full w-full md:w-1/2 p-3 md:p-6 shrink-0">
                <div className="h-full w-full overflow-hidden rounded-[2rem]">
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
              <div className="flex h-[62%] md:h-full w-full flex-col p-5 md:p-8 lg:p-10">
                <div
                  className={`mb-2 md:mb-3 shrink-0 self-start rounded-full ${story.color} px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-brown`}
                >
                  {story.age}
                </div>

                <h3 className="mb-2 md:mb-4 shrink-0 font-heading text-xl md:text-2xl lg:text-4xl font-bold text-brand-brown">
                  {story.name}
                </h3>

                <p className="text-base md:text-lg shrink-0 font-medium leading-relaxed text-brand-brown-light italic line-clamp-3 md:line-clamp-none">
                  «{story.quote}»
                </p>

                <div className="mt-2 pt-2 md:mt-4 md:pt-4 border-t border-brand-brown/10 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 pb-4">
                  <p className="text-sm md:text-base leading-relaxed text-brand-brown-light/70">
                    {story.story}
                  </p>
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
