"use client";

import { useState } from "react";
import {
  MapPin,
  Copy,
  Check,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react";
import { ShdkTerminal } from "../../icons/shdk-terminal";

const Footer = () => {
  const requisites = [
    { label: "ОГРН", val: "1187627032548" },
    { label: "ИНН/КПП", val: "7609038927 / 760901001" },
    { label: "БИК", val: "044525225" },
    { label: "Расчетный счет", val: "40703810738000012829" },
    { label: "Корр. счет", val: "30101810400000000225" },
    { label: "Банк", val: "ПАО «Сбербанк России»" },
  ];

  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  return (
    <>
    <footer
      id="contacts"
      className="relative bg-brand-cream pt-16 md:pt-24 pb-6 md:pb-10 overflow-hidden text-brand-brown rounded-t-[3rem] md:rounded-t-[6rem]"
    >


      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20 mb-12 md:mb-16">
          
          {/* Left Column: Contacts */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <div className="mb-6 inline-flex rounded-full bg-brand-orange px-6 py-2 shadow-sm">
                 <span className="text-sm font-bold uppercase tracking-widest text-white">Приходите в гости</span>
              </div>
              <h2 className="font-heading text-5xl font-black md:text-7xl mb-8 leading-[0.9] tracking-tighter text-brand-brown">
                КОНТАКТЫ
              </h2>
              <div className="space-y-6 text-xl md:text-2xl font-medium text-brand-brown/80">
                <p className="max-w-md leading-relaxed">
                  Хоспис доступен для посещений каждый день, круглосуточно
                </p>
                <div className="flex items-start gap-4 text-brand-orange font-bold">
                  <MapPin className="w-6 h-6 mt-1 shrink-0" />
                  <p className="text-lg md:text-xl">
                    152128, Ярославская обл., Ростовский МО., рп. Поречье-Рыбное, ул. Кирова 53В
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="group">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-3 block opacity-80">Консультации по услугам</span>
                <a href="tel:89201229737" className="text-3xl md:text-4xl font-black tracking-tight text-brand-brown hover:text-brand-orange transition-colors">
                  8 (920) 122-97-37
                </a>
                <p className="text-sm font-bold text-brand-brown/40 mt-1 uppercase tracking-widest">с 8:00 до 17:00</p>
              </div>

              <div className="group">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-3 block opacity-80">Отделение милосердия</span>
                <a href="tel:84853620120" className="text-3xl md:text-4xl font-black tracking-tight text-brand-brown hover:text-brand-orange transition-colors">
                  8 (48536) 2-01-20
                </a>
                <p className="text-sm font-bold text-brand-brown/40 mt-1 uppercase tracking-widest">с 9:00 до 21:00</p>
              </div>

              <div className="group">
                <span className="text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-3 block opacity-80">Электронная почта</span>
                <a href="mailto:mail@domlobova.ru" className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-brand-brown hover:text-brand-orange transition-colors underline decoration-brand-orange/30 underline-offset-8">
                  mail@domlobova.ru <ArrowDownRight className="w-6 h-6 rotate-[-45deg]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Requisites Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[3rem] md:rounded-[4rem] bg-white text-brand-brown p-8 md:p-14 shadow-2xl overflow-hidden group">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-brand-cream/80 text-brand-orange flex items-center justify-center shadow-inner border border-brand-brown/5">
                     <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">Карточка организации</h3>
                     <p className="text-sm font-bold text-brand-brown/40 uppercase tracking-widest">Реквизиты и данные</p>
                   </div>
                </div>

                <div className="mb-10 p-6 rounded-3xl bg-brand-cream/30 border border-brand-brown/5 shadow-sm">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/30 mb-2 block">Полное наименование</span>
                  <p className="text-base md:text-lg font-bold leading-tight uppercase">
                    АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  {requisites.map((item, idx) => (
                    <div key={idx} className="group/item border-b border-brand-brown/10 pb-4 flex flex-col justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-1">{item.label}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base font-black tracking-tight">{item.val}</span>
                        <button 
                          onClick={() => copyToClipboard(item.val, item.label)}
                          className={`p-2 w-8 h-8 rounded-lg cursor-pointer transition-all duration-300 ${copiedLabel === item.label ? 'bg-green-600 text-white opacity-100' : 'hover:bg-brand-brown hover:text-white opacity-0 group-hover/item:opacity-100'}`}
                        >
                          {copiedLabel === item.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2 group/item border-b border-brand-brown/10 pb-4 flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-1">Фактический и юр. адрес</span>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-black leading-snug uppercase">
                          152128, Ярославская область, Ростовский МО, рп Поречье-Рыбное, ул. Кирова, д. 53В
                        </span>
                        <button 
                          onClick={() => copyToClipboard('152128, Ярославская область, Ростовский МО, рп Поречье-Рыбное, ул. Кирова, д. 53В', 'Адрес')}
                          className={`p-2 w-8 h-8 rounded-lg cursor-pointer shrink-0 mt-0.5 transition-all duration-300 ${copiedLabel === 'Адрес' ? 'bg-green-600 text-white opacity-100' : 'hover:bg-brand-brown hover:text-white opacity-0 group-hover/item:opacity-100'}`}
                        >
                          {copiedLabel === 'Адрес' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row gap-8 md:items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40">Директор</span>
                      <span className="text-xl font-black italic">Васиков Алексей Александрович</span>
                   </div>
                   <div className="flex gap-4">
                      {[
                        {
                          label: "VK",
                          link: "https://vk.com/domlobova",
                          icon: (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.596-.19 1.362 1.26 2.174 1.817.614.42 1.08.328 1.08.328l2.17-.03s1.134-.07.596-.964c-.044-.073-.312-.66-1.609-1.862-1.357-1.258-1.174-1.054.46-3.23.994-1.326 1.392-2.135 1.268-2.481-.118-.33-.848-.243-.848-.243l-2.44.015s-.18-.025-.315.056c-.131.079-.216.264-.216.264s-.387 1.031-.903 1.907c-1.088 1.848-1.524 1.945-1.702 1.83-.414-.267-.31-1.075-.31-1.649 0-1.793.272-2.54-.53-2.733-.266-.064-.462-.106-1.143-.113-.873-.009-1.612.003-2.03.208-.278.136-.493.44-.362.457.161.022.527.099.72.363.25.342.24 1.11.24 1.11s.144 2.11-.335 2.372c-.328.18-.778-.187-1.744-1.865-.494-.859-.868-1.81-.868-1.81s-.072-.176-.2-.271c-.155-.115-.373-.151-.373-.151l-2.32.015s-.348.01-.476.161c-.114.134-.009.412-.009.412s1.82 4.258 3.882 6.403c1.889 1.966 4.034 1.836 4.034 1.836h.972z" />
                            </svg>
                          ),
                        },
                        {
                          label: "Telegram",
                          link: "https://t.me/dom_lobova",
                          icon: (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                          ),
                        },
                        {
                          label: "Основной сайт",
                          link: "https://domlobova.ru/",
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M2 12h20" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          ),
                        },
                      ].map((social, sIdx) => (
                        <a 
                          key={sIdx}
                          href={social.link}
                          target='_blank'
                          title={social.label}
                          className="w-12 h-12 rounded-xl border-2 border-brand-brown/10 text-brand-brown/80 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange hover:text-white transition-all duration-300"
                        >
                          {social.icon}
                        </a>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-brand-brown/10 pt-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-brand-brown/40">
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left mb-6 md:mb-0">
             <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
               <p>© {new Date().getFullYear()} АБСМНО Дом Милосердия Кузнеца Лобова.</p>
               <p>Все права защищены.</p>
             </div>
             <a
               href="https://domlobova.ru/files/294356_policy.pdf?1562502741"
               target="_blank"
               className="hover:text-brand-orange transition-colors"
             >
               Политика конфиденциальности
             </a>
          </div>

          <a
            href='https://www.shdk.tech/ru'
            className='flex items-center justify-center whitespace-nowrap gap-2 text-sm text-[#1a7a0a] transition-all duration-500 ease-in-out hover:text-[#39ff14] focus:text-[#39ff14] outline-none'
            target='_blank'
          >
            <span>Разработано с❤️и☕</span>
            <ShdkTerminal />
          </a>
        </div>
      </div>
    </footer>

    {/* Copy toast notification */}
    {copiedLabel && (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.3s_ease-out] pointer-events-none">
        <div className="flex items-center gap-2 bg-brand-brown text-white px-6 py-3 rounded-full shadow-2xl border border-white/10">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-bold">{copiedLabel} скопировано</span>
        </div>
      </div>
    )}
    </>
  );
};

export { Footer };
