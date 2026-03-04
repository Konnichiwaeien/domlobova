"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ArrowDownRight,
  FileText,
} from "lucide-react";
import { ShdkTerminal } from "../../icons/shdk-terminal";
import { LegalModal } from "../../ui/legal-modal/legal-modal";

const Footer = () => {
  const requisites = [
    { label: "ОГРН", val: "1187627032548" },
    { label: "ИНН/КПП", val: "7609038927 / 760901001" },
    { label: "БИК", val: "044525225" },
    { label: "Расчетный счет", val: "40703810738000012829" },
    { label: "Корр. счет", val: "30101810400000000225" },
    { label: "Банк", val: "ПАО «Сбербанк России»" },
  ];

  const socialLinks = [
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
  ];

  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [showRequisites, setShowRequisites] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const documents = [
    { label: "Устав организации", href: "/files/ustav.pdf", external: true },
    { label: "Свидетельство ОГРН", href: "/files/ogrn.pdf", external: true },
    { label: "Договор оферты", onClick: () => setShowOffer(true) },
    { label: "Политика обработки ПД", onClick: () => setShowPersonalData(true) },
  ];

  return (
    <>
    <footer
      id="contacts"
      className="relative bg-brand-cream pt-12 md:pt-16 pb-8 md:pb-10 overflow-hidden text-brand-brown rounded-t-3xl md:rounded-[3rem] lg:rounded-t-[4rem] -mt-6 md:-mt-10 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <div className="mb-4 inline-flex rounded-full bg-brand-orange px-5 py-1.5 shadow-sm">
             <span className="text-xs font-bold uppercase tracking-widest text-white">Приходите в гости</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black mb-10 lg:mb-16 leading-[0.9] tracking-tighter text-brand-brown">
            КОНТАКТЫ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12">
            
            {/* Box 1: Address */}
            <div className="space-y-3">
               <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange block opacity-90">Наш адрес</span>
               <p className="text-base md:text-lg font-bold leading-relaxed text-brand-brown">
                  152128, Ярославская обл., Ростовский МО., рп. Поречье-Рыбное, ул. Кирова 53В
               </p>
               <p className="text-xs md:text-sm font-medium text-brand-brown-light leading-relaxed pt-1">
                 Хоспис доступен для посещений каждый день, круглосуточно
               </p>
            </div>

            {/* Box 2: Phones */}
            <div className="space-y-6">
               <div>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-1.5 block opacity-90">Отделение милосердия</span>
                  <a href="tel:84853620120" className="text-lg md:text-xl font-black tracking-tight text-brand-brown hover:text-brand-orange transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md inline-block">
                    8 (48536) 2-01-20
                  </a>
                  <p className="text-[10px] md:text-xs font-bold text-brand-brown/40 mt-1 uppercase tracking-widest">с 9:00 до 21:00</p>
               </div>
               <div>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-1.5 block opacity-90">Консультации</span>
                  <a href="tel:89201229737" className="text-lg md:text-xl font-black tracking-tight text-brand-brown hover:text-brand-orange transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md inline-block">
                    8 (920) 122-97-37
                  </a>
                  <p className="text-[10px] md:text-xs font-bold text-brand-brown/40 mt-1 uppercase tracking-widest">с 8:00 до 17:00</p>
               </div>
            </div>

            {/* Box 3: Email & Director */}
            <div className="space-y-6">
               <div>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-1.5 block opacity-90">Пишите нам</span>
                  <a href="mailto:mail@domlobova.ru" className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2 text-brand-brown hover:text-brand-orange transition-colors underline decoration-brand-orange/30 hover:decoration-brand-orange underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md w-max">
                    mail@domlobova.ru <ArrowDownRight className="w-4 h-4 rotate-[-45deg]" />
                  </a>
               </div>
               <div>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-1.5 block opacity-90">Директор</span>
                  <span className="text-base md:text-lg font-black italic text-brand-brown">Васиков Алексей Александрович</span>
               </div>
            </div>

            {/* Box 4: Documents, Requisites & Socials */}
            <div className="space-y-8 flex flex-col justify-start">
               <div>
                 <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-3 block opacity-90">Документы</span>
                 <ul className="space-y-2.5">
                   {documents.map((doc, idx) => (
                     <li key={idx}>
                       {doc.external ? (
                         <a
                           href={doc.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-sm md:text-base font-bold text-brand-brown hover:text-brand-orange transition-colors cursor-pointer inline-block"
                         >
                           {doc.label}
                         </a>
                       ) : (
                         <button
                           onClick={doc.onClick}
                           className="text-sm md:text-base font-bold text-brand-brown hover:text-brand-orange transition-colors cursor-pointer text-left"
                         >
                           {doc.label}
                         </button>
                       )}
                     </li>
                   ))}
                 </ul>
                 <button 
                   onClick={() => setShowRequisites(true)}
                   className="group flex items-center gap-2 text-brand-orange hover:text-brand-brown transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50 rounded-xl mt-3 text-sm md:text-base font-bold"
                 >
                   <span>Полные реквизиты →</span>
                 </button>
               </div>
               <div>
                 <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-brand-orange mb-2.5 block opacity-90">Мы в соцсетях</span>
                 <div className="flex gap-3">
                  {socialLinks.map((social, sIdx) => (
                    <a 
                      key={sIdx}
                      href={social.link}
                      target='_blank'
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-brand-brown/10 text-brand-brown/80 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/50"
                    >
                      <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                        {social.icon}
                      </div>
                    </a>
                  ))}
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
               rel="noopener noreferrer"
               className="hover:text-brand-orange transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md"
             >
               Политика конфиденциальности
             </a>
          </div>

          <a
            href='https://www.shdk.tech/ru'
            className='flex items-center justify-center whitespace-nowrap gap-2 text-sm text-[#1a7a0a] transition-all duration-500 ease-in-out hover:text-[#39ff14] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff14] rounded-md'
            target='_blank'
            rel="noopener noreferrer"
            aria-label="Разработано SHDK"
          >
            <span>Разработано с❤️и☕</span>
            <ShdkTerminal />
          </a>
        </div>
      </div>
    </footer>

    {/* Requisites Modal */}
    <LegalModal isOpen={showRequisites} onClose={() => setShowRequisites(false)} title="Карточка организации">
      <div className="text-brand-brown space-y-8 pb-6 px-1">
        <div className="p-5 md:p-6 rounded-2xl bg-brand-cream/50 border border-brand-brown/5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-2 block">Полное наименование</span>
          <p className="text-sm md:text-base font-bold leading-tight uppercase">
            АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {requisites.map((item, idx) => (
            <div key={idx} className="group/item border-b border-brand-brown/10 pb-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-1">{item.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-black tracking-tight">{item.val}</span>
                <button 
                  onClick={() => copyToClipboard(item.val, item.label)}
                  aria-label={`Скопировать ${item.label}`}
                  className={`p-2 w-8 h-8 rounded-lg cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${copiedLabel === item.label ? 'bg-green-600 text-white opacity-100' : 'hover:bg-brand-brown hover:text-white opacity-0 group-hover/item:opacity-100'}`}
                >
                  {copiedLabel === item.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <div className="md:col-span-2 group/item border-b border-brand-brown/10 pb-4 flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-brown/40 mb-1">Фактический и юр. адрес</span>
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm md:text-base font-black leading-snug uppercase">
                  152128, Ярославская область, Ростовский МО, рп Поречье-Рыбное, ул. Кирова, д. 53В
                </span>
                <button 
                  onClick={() => copyToClipboard('152128, Ярославская область, Ростовский МО, рп Поречье-Рыбное, ул. Кирова, д. 53В', 'Адрес')}
                  aria-label="Скопировать Адрес"
                  className={`p-2 w-8 h-8 rounded-lg cursor-pointer shrink-0 mt-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${copiedLabel === 'Адрес' ? 'bg-green-600 text-white opacity-100' : 'hover:bg-brand-brown hover:text-white opacity-0 group-hover/item:opacity-100'}`}
                >
                  {copiedLabel === 'Адрес' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
          </div>
        </div>           
      </div>
    </LegalModal>

    {/* Offer Modal */}
    <LegalModal isOpen={showOffer} onClose={() => setShowOffer(false)} title="Публичная оферта о заключении договора пожертвования">
      <div className="space-y-4">
        <p className="font-bold">АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА» (Директор: Васиков Алексей Александрович),</p>
        <p>предлагает гражданам сделать пожертвование на ниже приведенных условиях:</p>

        <h4 className="font-bold text-lg mt-6">1. Общие положения</h4>
        <p>1.1. В соответствии с п. 2 ст. 437 Гражданского кодекса Российской Федерации данное предложение является публичной офертой (далее – Оферта).</p>
        <p>1.2. В настоящей Оферте употребляются термины, имеющие следующее значение:<br/>«Пожертвование» - «дарение вещи или права в общеполезных целях»;<br/>«Жертвователь» - «граждане, делающие пожертвования»;<br/>«Получатель пожертвования» - «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»».</p>
        <p>1.3. Оферта действует бессрочно с момента размещения ее на сайте Получателя пожертвования.</p>
        <p>1.4. Получатель пожертвования вправе отменить Оферту в любое время путем удаления ее со страницы своего сайта в Интернете.</p>
        <p>1.5. Недействительность одного или нескольких условий Оферты не влечет недействительность всех остальных условий Оферты.</p>
        <p>1.6. Принимая Оферту вы даете согласие на подписку на рассылку АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА».</p>

        <h4 className="font-bold text-lg mt-6">2. Существенные условия договора пожертвования</h4>
        <p>2.1. Пожертвование используется на содержание и ведение уставной деятельности Получателя пожертвования.</p>
        <p>2.2. Сумма пожертвования определяется Жертвователем.</p>
        <p>2.3. Срок использования пожертвования составляет 3 года с даты поступления.</p>

        <h4 className="font-bold text-lg mt-6">3. Порядок заключения договора пожертвования</h4>
        <p>3.1. В соответствии с п. 3 ст. 434 Гражданского кодекса Российской Федерации договор пожертвования заключается в письменной форме путем акцепта Оферты Жертвователем.</p>
        <p>3.2. Оферта может быть акцептована путем перечисления Жертвователем денежных средств в пользу Получателя пожертвования платежным поручением по реквизитам, указанным в разделе 5 Оферты, с указанием в строке «назначение платежа»: «пожертвование на содержание и ведение уставной деятельности», а также с использованием пластиковых карт, электронных платежных систем и других средств и систем, позволяющих Жертвователю перечислять Получателю пожертвования денежных средств.</p>
        <p>3.3. Совершение Жертвователем любого из действий, предусмотренных п. 3.2. Оферты, считается акцептом Оферты в соответствии с п. 3 ст. 438 Гражданского кодекса Российской Федерации.</p>
        <p>3.4. Датой акцепта Оферты – датой заключения договора пожертвования является дата поступления пожертвования в виде денежных средств от Жертвователя на расчетный счет Получателя пожертвования.</p>

        <h4 className="font-bold text-lg mt-6">4. Заключительные положения</h4>
        <p>4.1. Совершая действия, предусмотренные настоящей Офертой, Жертвователь подтверждает, что ознакомлен с условиями Оферты, целями деятельности Получателя пожертвования, осознает значение своих действий и имеет полное право на их совершение, полностью и безоговорочно принимает условия настоящей Оферты.</p>
        <p>4.2. Настоящая Оферта регулируется и толкуется в соответствии с действующим российском законодательством.</p>

        <h4 className="font-bold text-lg mt-6">5. Подпись и реквизиты Получателя пожертвования</h4>
        <p className="font-bold">АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»</p>
        <div className="bg-brand-cream/50 rounded-2xl p-4 space-y-1 text-sm">
          <p>ОГРН: 1187627032548</p>
          <p>ИНН/КПП: 7609038927/760901001</p>
          <p>Адрес: 152128, Ярославская область, Ростовский р-н, рп. Поречье-Рыбное, ул. Кирова, д. 53</p>
          <p className="mt-2 font-bold">Банковские реквизиты:</p>
          <p>Расчётный счёт: 40703810738000012829</p>
          <p>Банк: ПАО «Сбербанк России»</p>
          <p>БИК: 044525225</p>
          <p>Корр. счёт: 30101810400000000225</p>
        </div>
        <p className="mt-4"><span className="font-bold">Директор:</span> Васиков Алексей Александрович</p>
      </div>
    </LegalModal>

    {/* Personal Data Modal */}
    <LegalModal isOpen={showPersonalData} onClose={() => setShowPersonalData(false)} title="Согласие на обработку персональных данных">
      <div className="space-y-4">
        <p>Пользователь, оставляя заявку, оформляя подписку, комментарий, запрос на обратную связь, регистрируясь либо совершая иные действия, связанные с внесением своих персональных данных на интернет-сайте https://donat.domlobova.ru, принимает настоящее Согласие на обработку персональных данных (далее – Согласие).</p>
        <p>Принятием Согласия является подтверждение факта согласия Пользователя со всеми пунктами Согласия. Пользователь дает свое согласие организации «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»», которой принадлежит сайт https://donat.domlobova.ru на обработку своих персональных данных со следующими условиями:</p>
        <p>Пользователь дает согласие на обработку своих персональных данных, как без использования средств автоматизации, так и с их использованием.</p>
        <p>Согласие дается на обработку следующих персональных данных (не являющимися специальными или биометрическими):</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>фамилия, имя, отчество;</li>
          <li>адрес(а) электронной почты;</li>
          <li>телефон;</li>
          <li>иные данные, предоставляемые Пользователем.</li>
        </ul>
        <p>Персональные данные пользователя не являются общедоступными.</p>
        <h4 className="font-bold mt-4">1.</h4>
        <p>Целью обработки персональных данных является предоставление полного доступа к функционалу сайта https://donat.domlobova.ru.</p>
        <h4 className="font-bold mt-4">2.</h4>
        <p>Основанием для сбора, обработки и хранения персональных данных являются:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Ст. 23, 24 Конституции Российской Федерации;</li>
          <li>Ст. 2, 5, 6, 7, 9, 18–22 Федерального закона от 27.07.06 года №152-ФЗ «О персональных данных»;</li>
          <li>Ст. 18 Федерального закона от 13.03.06 года № 38-ФЗ «О рекламе»;</li>
          <li>Устав организации «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»»;</li>
          <li>Политика обработки персональных данных.</li>
        </ul>
        <h4 className="font-bold mt-4">3.</h4>
        <p>В ходе обработки с персональными данными будут совершены следующие действия: сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение.</p>
        <h4 className="font-bold mt-4">4.</h4>
        <p>Передача персональных данных, скрытых для общего просмотра, третьим лицам не осуществляется, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>
        <h4 className="font-bold mt-4">5.</h4>
        <p>Пользователь подтверждает, что указанные им персональные данные принадлежат лично ему.</p>
        <h4 className="font-bold mt-4">6.</h4>
        <p>Персональные данные хранятся и обрабатываются до момента ликвидации организации «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»». Хранение персональных данных осуществляется согласно Федеральному закону №125-ФЗ «Об архивном деле в Российской Федерации» и иным нормативно правовым актам в области архивного дела и архивного хранения.</p>
        <h4 className="font-bold mt-4">7.</h4>
        <p>Пользователь согласен на получение информационных сообщений с сайта https://donat.domlobova.ru. Персональные данные обрабатываются до отписки Пользователя от получения информационных сообщений.</p>
        <h4 className="font-bold mt-4">8.</h4>
        <p>Согласие может быть отозвано Пользователем либо его законным представителем, путем направления Отзыва согласия на электронную почту – alevas@inbox.ru с пометкой «Отзыв согласия на обработку персональных данных». В случае отзыва Пользователем согласия на обработку персональных данных организация вправе продолжить обработку персональных данных без согласия Пользователя при наличии оснований, указанных в пунктах 2 - 11 части 1 статьи 6, части 2 статьи 10 и части 2 статьи 11 Федерального закона №152-ФЗ «О персональных данных» от 27.07.2006 г.</p>
        <h4 className="font-bold mt-4">9.</h4>
        <p>Настоящее Согласие является бессрочным, и действует все время до момента прекращения обработки персональных данных, указанных в п.7 и п.8 данного Согласия.</p>
        <h4 className="font-bold mt-4">10.</h4>
        <p>Место нахождения организации: 152128, Ярославская область, Ростовский р-н, рп. Поречье-Рыбное, ул. Кирова, д. 53.</p>
      </div>
    </LegalModal>

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
