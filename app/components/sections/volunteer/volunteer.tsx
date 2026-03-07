'use client';

import { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  Phone,
  AtSign,
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  Heart,
  X,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LegalModal } from '../../ui/legal-modal/legal-modal';
import { useLenis } from 'lenis/react';
import { renderHighlightedTitle } from '../../../utils/text-parser';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Slides Data ---
const slides = [
  {
    title: 'Социальный работник',
    description:
      'Вы можете поддержать нас и помочь в кормлении, прогулке или в организации досуга для жителей.',
    image: '/images/volunteers/social-worker.png',
  },
  {
    title: 'Уют в доме',
    description:
      'Помогите сотрудникам хосписа в уходе за цветами и огородом, а также с уборкой в Доме милосердия.',
    image: '/images/volunteers/garden.png',
  },
  {
    title: 'Автоволонтер',
    description:
      'Помогают в перевозке различного медицинского оборудования, расходных материалов, печатной продукции в Поречье.',
    image: '/images/volunteers/driver.png',
  },
  {
    title: '«Мужская» помощь',
    description:
      'Жители очень любят гулять: многие передвигаются на креслах, нужна помощь с выносом на улицу.',
    image: '/images/volunteers/strength.png',
  },
];

// --- Zod Schema ---
const volunteerSchema = z.object({
  name: z.string().min(2, 'Пожалуйста, представьтесь'),
  phone: z
    .string()
    .min(6, 'Введите номер телефона')
    .regex(/^[+\d\s\-()]+$/, 'Некорректный номер'),
  email: z
    .string()
    .min(1, 'Введите email')
    .email('Некорректный email'),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

interface VolunteerSectionProps {
  data?: any;
}

export const VolunteerSection = ({ data }: VolunteerSectionProps) => {
  const [consent, setConsent] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const lenis = useLenis();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { name: '', phone: '', email: '' },
    mode: 'onBlur',
  });

  const { field: phoneField } = useController({ name: 'phone', control });

  // Lock scroll when form modal is open
  useEffect(() => {
    if (showFormModal) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [showFormModal, lenis]);

  const onSubmit = async (values: VolunteerFormValues) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
      const res = await fetch(`${apiUrl}/volunteer-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: values }),
      });
      if (!res.ok) throw new Error(`Сервер вернул ошибку: ${res.status}`);
      setStatus('success');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Не удалось отправить заявку. Попробуйте ещё раз.'
      );
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const openFormModal = () => {
    setStatus('idle');
    setErrorMessage('');
    setConsent(false);
    reset();
    setShowFormModal(true);
  };

  const inputClassName = (hasError: boolean) =>
    cn(
      'w-full rounded-2xl border-2 py-4 md:py-5 pl-12 pr-6 text-base md:text-lg font-bold outline-none transition-all duration-300 ease-in-out',
      hasError
        ? 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500'
        : 'border-transparent bg-brand-cream text-brand-brown placeholder:text-brand-brown-light/60 hover:border-brand-orange/30 focus:bg-white focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/10'
    );

  const isSubmitDisabled = isLoading || !consent;
  
  // Dynamic Data Parsing
  const blockData = Array.isArray(data) ? data[0] : (data || {});
  const sectionTitle = blockData?.title || "ДОБРОВОЛЬЦЫ *МИЛОСЕРДИЯ*";
  const sectionDescr = blockData?.descr || "Каждый волонтёр живёт своей жизнью: у него есть семья, работа, увлечения и свободное время. И это время волонтёр посвящает помощи тем, кому это необходимо. Дому милосердия очень нужны волонтёры.";
  const innerSlides = blockData?.volunteers_needs || [];
  
  const mappedSlides = innerSlides.length > 0
    ? innerSlides.map((slide: any) => ({
        title: slide.title || "",
        description: slide.descr || "",
        image: Array.isArray(slide.image) ? slide.image[0]?.url : (slide.image?.url || ""),
      }))
    : slides;

  return (
    <section id="volunteer" className="relative pt-16 md:pt-20 lg:pt-24 pb-24 md:pb-32 w-full overflow-hidden bg-[#F9F8F6]">
      <div className="mx-auto w-full max-w-[1300px] px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="mb-4 md:mb-6 inline-flex rounded-full bg-brand-orange-light/30 px-6 py-2">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Стать волонтёром
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown tracking-tighter mb-6">
            {renderHighlightedTitle(sectionTitle, "text-brand-orange italic")}
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-brand-brown-light font-medium max-w-2xl mx-auto leading-relaxed">
            {sectionDescr}
          </p>
        </div>

        {/* Swiper Slider with arrows outside */}
        <div className="relative">
          {/* Navigation Arrows — outside slider edges */}
          <button className="volunteer-prev hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-brand-brown/10 items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="volunteer-next hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-brand-brown/10 items-center justify-center text-brand-brown hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Rounded slider container — clips ALL content including slides */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: '.volunteer-prev',
              nextEl: '.volunteer-next',
            }}
            pagination={{
              clickable: true,
              el: '.volunteer-pagination',
              bulletClass: 'volunteer-bullet',
              bulletActiveClass: 'volunteer-bullet-active',
            }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            grabCursor={true}
            className="w-full rounded-3xl md:rounded-[3rem] overflow-hidden"
          >
            {mappedSlides.map((slide: any, idx: number) => (
              <SwiperSlide key={idx}>
                <div className="relative h-[400px] md:h-[520px] w-full">
                  {/* Background Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <h3 className="font-heading text-2xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
                      {slide.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-lg font-medium max-w-xl leading-relaxed drop-shadow-md mb-6">
                      {slide.description}
                    </p>
                    <button
                      onClick={openFormModal}
                      className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      Заполнить заявку
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination — OUTSIDE the rounded container */}
          <div className="volunteer-pagination flex justify-center gap-2 mt-6" />
        </div>
      </div>

      {/* ===== FORM MODAL (same pattern as LegalModal) ===== */}
      <AnimatePresence>
        {showFormModal && (
          <div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-8"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowFormModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 shrink-0">
                <h3 className="font-heading text-xl md:text-2xl font-black text-brand-brown pr-8 leading-tight">
                  Заявка волонтёра
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div
                className="overflow-y-auto px-8 pb-8 overscroll-contain"
                data-lenis-prevent
              >
                {status === 'success' ? (
                  <div className="text-center py-6">
                    <div className="mb-6 flex h-24 w-24 items-center mx-auto justify-center rounded-full bg-brand-orange text-white animate-bounce">
                      <Heart className="h-12 w-12" strokeWidth={1.5} fill="currentColor" />
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-brand-brown mb-3">
                      Спасибо!
                    </h3>
                    <p className="text-base md:text-lg font-medium text-brand-brown-light max-w-sm mx-auto">
                      Мы свяжемся с вами в ближайшее время, чтобы обсудить детали участия.
                    </p>
                  </div>
                ) : status === 'error' ? (
                  <div className="text-center py-6">
                    <div className="mb-6 flex h-24 w-24 items-center mx-auto justify-center rounded-full bg-red-100 text-red-500">
                      <AlertCircle className="h-12 w-12" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-brand-brown mb-3">
                      Что-то пошло не так
                    </h3>
                    <p className="text-base font-medium text-brand-brown-light max-w-sm mx-auto mb-8">
                      {errorMessage || 'Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.'}
                    </p>
                    <button
                      onClick={() => { setStatus('idle'); setErrorMessage(''); }}
                      className="inline-flex items-center gap-2 bg-brand-brown hover:bg-brand-orange text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
                    >
                      Попробовать снова
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-base text-brand-brown-light mb-8 font-medium text-center">
                      Оставьте свои контакты, и мы расскажем, как именно вы можете помочь.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-4 mb-6">
                        {/* Имя */}
                        <div>
                          <div className="relative group">
                            <User
                              size={22}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                            />
                            <input
                              {...register('name')}
                              placeholder="Ваше имя"
                              className={inputClassName(!!errors.name)}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-500 text-sm font-bold flex items-center gap-2 mt-2 ml-2"
                              >
                                <AlertCircle size={16} /> {errors.name.message}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Телефон */}
                        <div>
                          <div className="relative group">
                            <Phone
                              size={22}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                            />
                            <IMaskInput
                              mask="+{7} (000) 000-00-00"
                              unmask={false}
                              value={phoneField.value}
                              onAccept={(value) => phoneField.onChange(value)}
                              onBlur={phoneField.onBlur}
                              inputRef={phoneField.ref}
                              placeholder="+7 (___) ___-__-__"
                              className={inputClassName(!!errors.phone)}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.phone && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-500 text-sm font-bold flex items-center gap-2 mt-2 ml-2"
                              >
                                <AlertCircle size={16} /> {errors.phone.message}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Email */}
                        <div>
                          <div className="relative group">
                            <AtSign
                              size={22}
                              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                            />
                            <input
                              {...register('email')}
                              placeholder="Email"
                              className={inputClassName(!!errors.email)}
                            />
                          </div>
                          <AnimatePresence>
                            {errors.email && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-500 text-sm font-bold flex items-center gap-2 mt-2 ml-2"
                              >
                                <AlertCircle size={16} /> {errors.email.message}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Consent Checkbox */}
                      <div
                        className="flex items-start gap-3 cursor-pointer group select-none mb-6"
                        onClick={() => setConsent(!consent)}
                      >
                        <div
                          className={cn(
                            'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5',
                            consent
                              ? 'bg-brand-orange border-brand-orange'
                              : 'bg-white border-brand-brown/30 group-hover:border-brand-orange'
                          )}
                        >
                          <div
                            className={cn(
                              'transition-opacity duration-200 flex items-center justify-center',
                              consent ? 'opacity-100' : 'opacity-0'
                            )}
                          >
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-brand-brown-light leading-relaxed">
                          Я даю согласие на{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPersonalData(true);
                            }}
                            className="text-brand-orange underline hover:text-brand-brown transition-colors cursor-pointer"
                          >
                            обработку персональных данных
                          </button>
                        </span>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={cn(
                          'w-full rounded-2xl py-5 text-center text-base md:text-lg font-black uppercase tracking-widest text-white flex items-center justify-center transition-all duration-300',
                          isSubmitDisabled
                            ? 'bg-brand-brown/40 cursor-not-allowed'
                            : 'bg-brand-brown hover:bg-brand-orange cursor-pointer shadow-xl shadow-brand-brown/20'
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin mr-2 h-6 w-6" />
                        ) : (
                          <>
                            Стать волонтёром
                            <ChevronRight size={22} className="ml-2 opacity-80" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>


            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Personal Data Modal */}
      <LegalModal
        isOpen={showPersonalData}
        onClose={() => setShowPersonalData(false)}
        title="Согласие на обработку персональных данных"
      >
        <div className="space-y-4">
          <p>
            Пользователь, оставляя заявку, оформляя подписку, комментарий, запрос
            на обратную связь, регистрируясь либо совершая иные действия, связанные
            с внесением своих персональных данных на интернет-сайте
            https://donat.domlobova.ru, принимает настоящее Согласие на обработку
            персональных данных (далее – Согласие).
          </p>

          <p>
            Принятием Согласия является подтверждение факта согласия Пользователя
            со всеми пунктами Согласия. Пользователь дает свое согласие организации
            «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ
            ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»», которой принадлежит сайт
            https://donat.domlobova.ru на обработку своих персональных данных со
            следующими условиями:
          </p>

          <p>
            Пользователь дает согласие на обработку своих персональных данных, как
            без использования средств автоматизации, так и с их использованием.
          </p>

          <p>
            Согласие дается на обработку следующих персональных данных (не
            являющихся специальными или биометрическими):
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>фамилия, имя, отчество;</li>
            <li>адрес(а) электронной почты;</li>
            <li>телефон;</li>
            <li>иные данные, предоставляемые Пользователем.</li>
          </ul>
          <p>Персональные данные пользователя не являются общедоступными.</p>

          <h4 className="font-bold mt-4">1.</h4>
          <p>
            Целью обработки персональных данных является предоставление полного
            доступа к функционалу сайта https://donat.domlobova.ru.
          </p>

          <h4 className="font-bold mt-4">2.</h4>
          <p>
            Основанием для сбора, обработки и хранения персональных данных
            являются:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ст. 23, 24 Конституции Российской Федерации;</li>
            <li>
              Ст. 2, 5, 6, 7, 9, 18–22 Федерального закона от 27.07.06 года
              №152-ФЗ «О персональных данных»;
            </li>
            <li>
              Ст. 18 Федерального закона от 13.03.06 года № 38-ФЗ «О рекламе»;
            </li>
            <li>
              Устав организации «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ
              СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ
              КУЗНЕЦА ЛОБОВА»»;
            </li>
            <li>Политика обработки персональных данных.</li>
          </ul>

          <h4 className="font-bold mt-4">3.</h4>
          <p>
            В ходе обработки с персональными данными будут совершены следующие
            действия: сбор, запись, систематизация, накопление, хранение, уточнение
            (обновление, изменение), извлечение, использование, передача
            (распространение, предоставление, доступ), обезличивание, блокирование,
            удаление, уничтожение.
          </p>

          <h4 className="font-bold mt-4">4.</h4>
          <p>
            Передача персональных данных, скрытых для общего просмотра, третьим
            лицам не осуществляется, за исключением случаев, предусмотренных
            законодательством Российской Федерации.
          </p>

          <h4 className="font-bold mt-4">5.</h4>
          <p>
            Пользователь подтверждает, что указанные им персональные данные
            принадлежат лично ему.
          </p>

          <h4 className="font-bold mt-4">6.</h4>
          <p>
            Персональные данные хранятся и обрабатываются до момента ликвидации
            организации «АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ
            НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА»». Хранение
            персональных данных осуществляется согласно Федеральному закону №125-ФЗ
            «Об архивном деле в Российской Федерации» и иным нормативно правовым
            актам в области архивного дела и архивного хранения.
          </p>

          <h4 className="font-bold mt-4">7.</h4>
          <p>
            Пользователь согласен на получение информационных сообщений с сайта
            https://donat.domlobova.ru. Персональные данные обрабатываются до
            отписки Пользователя от получения информационных сообщений.
          </p>

          <h4 className="font-bold mt-4">8.</h4>
          <p>
            Согласие может быть отозвано Пользователем либо его законным
            представителем, путем направления Отзыва согласия на электронную почту –
            alevas@inbox.ru с пометкой «Отзыв согласия на обработку персональных
            данных». В случае отзыва Пользователем согласия на обработку
            персональных данных организация вправе продолжить обработку персональных
            данных без согласия Пользователя при наличии оснований, указанных в
            пунктах 2 - 11 части 1 статьи 6, части 2 статьи 10 и части 2 статьи 11
            Федерального закона №152-ФЗ «О персональных данных» от 27.07.2006 г.
          </p>

          <h4 className="font-bold mt-4">9.</h4>
          <p>
            Настоящее Согласие является бессрочным, и действует все время до момента
            прекращения обработки персональных данных, указанных в п.7 и п.8 данного
            Согласия.
          </p>

          <h4 className="font-bold mt-4">10.</h4>
          <p>
            Место нахождения организации: 152128, Ярославская область, Ростовский
            р-н, рп. Поречье-Рыбное, ул. Кирова, д. 53.
          </p>
        </div>
      </LegalModal>
    </section>
  );
};
