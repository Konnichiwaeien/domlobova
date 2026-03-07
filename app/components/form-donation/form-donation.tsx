'use client';

import { useState } from 'react';
import { LegalModal } from '../ui/legal-modal/legal-modal';
import { useForm, useController } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useEffect } from 'react';
import {
  Heart,
  AtSign,
  Check,
  Coins,
  Crown,
  HandHeart,
  Sun,
  User,
  Phone,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Zod Schema ---
const donationSchema = z
  .object({
    amount: z
      .number({ message: 'Введите число' })
      .min(10, 'Минимум 10 ₽')
      .max(500000, 'Максимум 500 000 ₽'),
    isRecurring: z.boolean(),
    isAnonymous: z.boolean(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isAnonymous) {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Нужен корректный email',
          path: ['email'],
        });
      }
      if (!data.name || data.name.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Пожалуйста, представьтесь',
          path: ['name'],
        });
      }
    }
  });

type DonationFormValues = z.infer<typeof donationSchema>;

// --- Data ---
const TIERS = [
  {
    amount: 200,
    amountLabel: '200 ₽',
    name: 'Внимание',
    colorClass: 'text-brand-orange bg-brand-orange-light/20',
    iconClass: 'text-brand-orange',
    icon: <Heart size={24} />,
  },
  {
    amount: 500,
    amountLabel: '500 ₽',
    name: 'Забота',
    colorClass: 'text-[#E07A5F] bg-[#E07A5F]/10',
    iconClass: 'text-[#E07A5F]',
    icon: <HandHeart size={24} />,
  },
  {
    amount: 1000,
    amountLabel: '1 000 ₽',
    name: 'Поддержка',
    colorClass: 'text-brand-yellow bg-brand-yellow/20',
    iconClass: 'text-brand-yellow',
    icon: <Sun size={24} />,
  },
  {
    amount: 2000,
    amountLabel: '2 000 ₽',
    name: 'Опора',
    colorClass: 'text-brand-brown bg-brand-brown/10',
    iconClass: 'text-brand-brown',
    icon: <ShieldCheck size={24} />,
  },
];

const getImpactDetails = (amount: number) => {
  if (amount >= 2000)
    return {
      title: 'Опора',
      text: 'Пожертвования направляются на обеспечение профессионального ухода, который осуществляет многопрофильная команда специалистов: врач, медицинские сестры и помощники по уходу. Собранные средства позволяют поддерживать ежедневную работу персонала, гарантируя подопечным качественное медицинское и социальное сопровождение.',
      icon: <Users className="text-brand-yellow" size={28} strokeWidth={1.5} />,
      style: 'bg-brand-cream border-brand-brown/10 text-brand-brown',
    };

  if (amount >= 1000)
    return {
      title: 'Поддержка',
      text: 'Пожертвования позволяют обеспечивать подопечным жизнь без боли, помогая им сохранять максимально возможную самостоятельность и достойное качество жизни. Это те ресурсы, которые дают человеку силы на ежедневную рутину и помогают сохранять достоинство.',
      icon: <Sun className="text-[#81B29A]" size={28} strokeWidth={1.5} />,
      style: 'bg-[#FDFBF7] border-brand-brown/10 text-brand-brown',
    };

  if (amount >= 500)
    return {
      title: 'Забота',
      text: 'Пожертвования позволяют поддерживать атмосферу тепла, бытового комфорта и безопасности. Из этих составляющих рождается чувство дома и сохраняется человеческое достоинство, которое так важно для каждого подопечного Дома милосердия.',
      icon: <HandHeart className="text-[#E07A5F]" size={28} strokeWidth={1.5} />,
      style: 'bg-[#FDFBF7] border-brand-brown/10 text-brand-brown',
    };

  return {
    title: 'Внимание',
    text: 'Даже небольшая сумма превращается в реальную помощь: теплый плед, чашка горячего чая и искреннее внимание, которого так часто не хватает людям с тяжелым диагнозом.',
    icon: <Heart className="text-brand-orange" size={28} strokeWidth={1.5} />,
    style: 'bg-brand-cream border-brand-brown/10 text-brand-brown',
  };
};

export const FormDonation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [consent, setConsent] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaignTitle, setCampaignTitle] = useState<string | null>(null);
  const { width, height } = useWindowSize();

  // Listen for global donation event to pre-select campaign
  useEffect(() => {
    const handleOpenDonation = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.campaignId) {
        setCampaignId(detail.campaignId);
        setCampaignTitle(detail.campaignTitle || 'Выбранный сбор');
      }
    };
    window.addEventListener('open-donation', handleOpenDonation);
    return () => window.removeEventListener('open-donation', handleOpenDonation);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 500,
      isRecurring: false,
      isAnonymous: false,
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onChange',
  });

  const { field: phoneField } = useController({ name: 'phone', control });

  const currentAmount = watch('amount');
  const isRecurring = watch('isRecurring');
  const isAnonymous = watch('isAnonymous');

  const safeAmount = Number(currentAmount) || 0;
  const impact = getImpactDetails(safeAmount);

  const activeTier = [...TIERS]
    .reverse()
    .find((tier) => safeAmount >= tier.amount);

  const handleTierSelect = (amount: number) => {
    setValue('amount', amount, { shouldValidate: true, shouldDirty: true });
  };

  const toggleAnonymous = () => {
    const newValue = !isAnonymous;
    setValue('isAnonymous', newValue);
    if (newValue === true) {
      setValue('name', 'Анонимстый Благотворитель');
      setValue('email', 'anonymous@domlobova.ru');
      setValue('phone', '');
      clearErrors(['name', 'email', 'phone']);
    } else {
      if (watch('name') === 'Анонимный Благотворитель') setValue('name', '');
      if (watch('email') === 'anonymous@domlobova.ru') setValue('email', '');
    }
  };

  const onSubmit = async (data: DonationFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Ensure CloudPayments script is loaded
      if (typeof window === 'undefined' || !window.cp) {
        throw new Error('CloudPayments widget не загружен. Обновите страницу.');
      }

      const widget = new window.cp.CloudPayments();

      const intentParams: CloudPaymentsIntentParams = {
        publicTerminalId: process.env.NEXT_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID || 'test_api_00000000000000000000002',
        description: 'Пожертвование в Дом милосердия кузнеца Лобова',
        amount: data.amount,
        currency: 'RUB',
        paymentSchema: 'Single',
        skin: 'modern',
        autoClose: 3,
        email: data.isAnonymous ? undefined : data.email,
        emailBehavior: data.isAnonymous ? 'Hidden' : 'Optional',
        userInfo: {
          firstName: data.isAnonymous ? 'Анонимный' : (data.name || ''),
          phone: data.isAnonymous ? '' : (data.phone || ''),
          email: data.isAnonymous ? '' : (data.email || ''),
        },
        metadata: {
          donorName: data.isAnonymous ? 'Анонимный благотворитель' : data.name,
          donorEmail: data.isAnonymous ? '' : data.email,
          donorPhone: data.isAnonymous ? '' : data.phone,
          isAnonymous: data.isAnonymous,
          isRecurring: data.isRecurring,
          ...(campaignId ? { campaignId } : {}),
        },
      };

      // Add recurrent params if monthly donation selected
      if (data.isRecurring) {
        intentParams.recurrent = {
          interval: 'Month',
          period: 1,
        };
      }

      const result = await widget.start(intentParams);

      if (result?.success) {
        setStatus('success');
      } else {
        // Widget was closed without payment
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Произошла ошибка при оплате';
      setErrorMessage(message);
      setIsLoading(false);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const inputClassName = (hasError: boolean) =>
    cn(
      'w-full rounded-xl md:rounded-2xl border-2 py-5 pl-12 pr-6 text-xl font-bold outline-none transition-all duration-300 ease-in-out',
      hasError
        ? 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500'
        : 'border-transparent bg-brand-cream text-brand-brown placeholder:text-brand-brown-light/60 hover:border-brand-orange/30 focus:outline-none focus:bg-white focus:border-brand-yellow focus-visible:ring-4 focus-visible:ring-brand-orange/50 disabled:opacity-60 disabled:cursor-not-allowed'
    );



  return (
    <div className="bg-white rounded-2xl md:rounded-[3rem] p-5 md:p-8 lg:p-14 shadow-2xl border border-brand-brown/10 mx-auto w-full relative z-20 overflow-hidden">
      
      {/* Thank You Modal Overlay */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
          >
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={400}
              gravity={0.15}
              colors={['#FF7A00', '#E07A5F', '#F4A261', '#E9C46A']}
              className="!fixed !z-[60]"
            />
            
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.1, duration: 0.8, bounce: 0.4 }}
              className="relative rounded-[3rem] bg-white p-8 md:p-12 shadow-2xl shadow-brand-orange/10 border border-brand-orange/20 text-center max-w-lg w-[calc(100%-2rem)] mx-auto z-50 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: 'spring', delay: 0.3, bounce: 0.6 }}
                className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-[#E07A5F] text-white shadow-lg shadow-brand-orange/30 relative"
              >
                <motion.div
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Heart className="h-14 w-14" strokeWidth={2} fill="currentColor" />
                </motion.div>
                
                {/* Floating mini hearts */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -50 - (i * 20), x: (i % 2 === 0 ? 20 : -20) * (i + 1), scale: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4, ease: "easeOut" }}
                    className="absolute text-brand-orange"
                  >
                    <Heart className="h-6 w-6" fill="currentColor" />
                  </motion.div>
                ))}
              </motion.div>
              
              <h3 className="font-heading text-4xl md:text-5xl font-black text-brand-brown mb-4">
                Спасибо!
              </h3>
              
              <p className="mt-4 text-lg font-medium text-brand-brown-light leading-relaxed">
                Ваше пожертвование успешно отправлено. <br className="hidden sm:block" />Вы сделали этот мир чуточку светлее!
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatus('idle')}
                className="mt-10 rounded-full bg-brand-cream px-10 py-5 w-full text-base font-bold uppercase tracking-widest text-brand-orange hover:bg-brand-yellow/30 hover:text-brand-brown transition-colors cursor-pointer border border-brand-orange/10"
              >
                Вернуться
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 z-50 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-700 flex-1">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {campaignId && campaignTitle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange-light/20 border border-brand-orange/30">
            <Heart className="w-4 h-4 text-brand-orange" fill="currentColor" />
            <span className="text-sm font-bold text-brand-brown">
              Помощь сбору: <span className="text-brand-orange">{campaignTitle}</span>
            </span>
            <button
              onClick={() => { setCampaignId(null); setCampaignTitle(null); }}
              className="ml-2 w-5 h-5 rounded-full hover:bg-white text-brand-brown/50 hover:text-red-500 flex items-center justify-center transition-colors"
              title="Отменить выбор сбора"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      <h3 className="text-xl md:text-3xl lg:text-5xl font-heading font-black text-brand-brown mb-4 text-center leading-tight">
        Выберите сумму пожертвования
      </h3>

      <p className="text-base md:text-lg lg:text-xl text-brand-brown-light mb-8 md:mb-10 max-w-lg mx-auto font-medium text-center">
        Каждое пожертвование помогает обеспечивать подопечных Дома Лобова достойным уходом и заботой
      </p>

      {/* Переключатель */}
      <div className="flex justify-center mb-10">
        <div className="bg-brand-cream p-1.5 rounded-full flex relative w-max">
          <motion.div
            className="absolute top-1.5 bottom-1.5 left-1.5 bg-white rounded-full shadow-md"
            style={{ width: 'calc(50% - 6px)' }}
            animate={{ x: isRecurring ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setValue('isRecurring', false)}
            className={cn(
              'relative z-10 w-32 md:w-40 py-3 text-sm md:text-base font-bold rounded-full transition-colors duration-300 cursor-pointer',
              !isRecurring
                ? 'text-brand-orange'
                : 'text-brand-brown-light hover:text-brand-brown'
            )}
          >
            Разово
          </button>
          <button
            type="button"
            onClick={() => setValue('isRecurring', true)}
            className={cn(
              'relative z-10 w-32 md:w-40 py-3 text-sm md:text-base font-bold rounded-full transition-colors duration-300 cursor-pointer',
              isRecurring
                ? 'text-brand-orange'
                : 'text-brand-brown-light hover:text-brand-brown'
            )}
          >
            Ежемесячно
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Сетка тиров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TIERS.map((tier) => {
            const isSelected = activeTier?.amount === tier.amount;

            return (
              <motion.button
                key={tier.amount}
                type="button"
                onClick={() => handleTierSelect(tier.amount)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex items-center sm:flex-col sm:justify-center rounded-xl md:rounded-2xl border-2 outline-none transition-all duration-300 ease-in-out cursor-pointer p-5 md:p-6 gap-4',
                  isSelected
                    ? 'border-brand-orange bg-brand-orange-light/10 ring-4 ring-brand-orange/10 shadow-sm'
                    : 'border-brand-brown/5 bg-brand-cream hover:border-brand-orange/30 hover:bg-white'
                )}
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center transition-colors bg-white shadow-sm shrink-0 border border-brand-brown/5',
                    tier.iconClass
                  )}
                >
                  <div className="transform origin-center">{tier.icon}</div>
                </div>

                <div className="text-left sm:text-center mt-2">
                  <div className="font-heading font-black text-2xl md:text-3xl text-brand-brown mb-2">
                    {tier.amountLabel}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-bold px-3 py-1 rounded-full inline-block',
                      tier.colorClass
                    )}
                  >
                    {tier.name}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="check-indicator"
                    className="absolute top-4 right-4 text-brand-orange"
                  >
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="col-span-1">
                {/* Поле своей суммы */}
                <div className="mb-8">
                <label className="block text-xs font-bold text-brand-brown-light mb-3 ml-2 uppercase tracking-wider">
                    Другая сумма
                </label>
                <div className="relative group">
                    <Coins
                    size={24}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                    />
                    <input
                    type="number"
                    placeholder="0"
                    {...register('amount', { valueAsNumber: true })}
                    className={clsx(inputClassName(!!errors.amount), 'pr-12')}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-brand-brown-light text-xl pointer-events-none transition-colors duration-300 group-focus-within:text-brand-orange">
                    ₽
                    </span>
                </div>
                <AnimatePresence>
                    {errors.amount && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm font-bold flex items-center gap-2 mt-2 ml-2"
                    >
                        <AlertCircle size={16} /> {errors.amount.message}
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>

                {/* Контакты */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                     <label className="text-xs font-bold text-brand-brown-light ml-2 uppercase tracking-wider">
                        Ваши данные
                     </label>
                  </div>
                 
                
                  <div className="space-y-4">
                      {/* Имя */}
                      <div className="relative group">
                      <User
                          size={22}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                      />
                      <input
                          {...register('name')}
                          disabled={isAnonymous}
                          placeholder="Ваше Имя"
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

                      {/* Email */}
                      <div className="relative group">
                      <AtSign
                          size={22}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                      />
                      <input
                          {...register('email')}
                          disabled={isAnonymous}
                          placeholder="Email (для чека)"
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
                      
                      {/* Phone */}
                      <div className="relative group">
                      <Phone
                          size={22}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                      />
                      <IMaskInput
                          mask="+{7} (000) 000-00-00"
                          unmask={false}
                          value={phoneField.value ?? ''}
                          onAccept={(value) => phoneField.onChange(value)}
                          onBlur={phoneField.onBlur}
                          inputRef={phoneField.ref}
                          disabled={isAnonymous}
                          placeholder="+7 (___) ___-__-__"
                          className={inputClassName(false)}
                      />
                      </div>

                      {/* Анонимность вниз под поля */}
                      <div
                          className="flex items-center gap-3 cursor-pointer group select-none ml-2 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 rounded-lg"
                          onClick={toggleAnonymous}
                          role="checkbox"
                          tabIndex={0}
                          aria-checked={isAnonymous}
                          onKeyDown={(e) => { 
                            if (e.key === 'Enter' || e.key === ' ') { 
                              e.preventDefault(); 
                              toggleAnonymous(); 
                            } 
                          }}
                      >
                          <div
                          className={cn(
                              'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0',
                              isAnonymous
                              ? 'bg-brand-orange border-brand-orange'
                              : 'bg-white border-brand-brown/30 group-hover:border-brand-orange'
                          )}
                          >
                          <div
                              className={cn(
                              'transition-opacity duration-200 flex items-center justify-center',
                              isAnonymous ? 'opacity-100' : 'opacity-0'
                              )}
                          >
                              <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                          </div>
                          <span className="text-sm font-bold text-brand-brown transition-colors duration-300 group-hover:text-brand-orange">
                          Сделать платеж анонимным
                          </span>
                      </div>
                  </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col justify-start">
               {/* Impact Details */}
                <label className="block text-xs font-bold text-brand-brown-light mb-3 ml-2 uppercase tracking-wider">
                    Как поможет ваш вклад:
                </label>
                <AnimatePresence mode="wait">
                <motion.div
                    key={impact.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                    'rounded-2xl md:rounded-[2rem] p-5 md:p-8 border flex flex-col gap-6 items-center text-center relative overflow-hidden transition-all duration-300 h-full justify-center',
                    impact.style
                    )}
                >
                    <div className="shrink-0 bg-white p-4 rounded-full shadow-md border border-brand-brown/5">
                    {impact.icon}
                    </div>

                    <div className="relative z-10 w-full">
                    <h4 className="font-heading font-black text-xl md:text-2xl mb-4 text-brand-brown">
                        {impact.title}
                    </h4>
                    <p className="text-base md:text-lg font-medium leading-relaxed opacity-90 text-brand-brown">
                        {impact.text}
                    </p>
                    </div>
                </motion.div>
                </AnimatePresence>
            </div>
        </div>


        {/* Согласие и кнопка */}
        <div className="flex justify-center flex-col items-center gap-6 mt-12">
          
          {/* Чекбокс согласия */}
          <div
            className="flex items-start gap-3 cursor-pointer group select-none max-w-xl w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 rounded-lg p-1"
            onClick={() => setConsent(!consent)}
            role="checkbox"
            tabIndex={0}
            aria-checked={consent}
            onKeyDown={(e) => { 
              if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                setConsent(!consent); 
              } 
            }}
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
              Нажимая кнопку «Пожертвовать», я выражаю своё безоговорочное согласие (акцепт) с условиями{' '}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowOffer(true); }}
                className="text-brand-orange underline hover:text-brand-brown transition-colors cursor-pointer"
              >
                Публичной оферты
              </button>{' '}
              и даю согласие на{' '}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowPersonalData(true); }}
                className="text-brand-orange underline hover:text-brand-brown transition-colors cursor-pointer"
              >
                обработку персональных данных
              </button>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !consent || ((!isAnonymous) && !!errors.name)}
            className="w-full max-w-xl rounded-xl md:rounded-2xl bg-brand-brown py-4 md:py-6 text-center text-xl md:text-2xl font-black uppercase tracking-widest text-white transition-all hover:bg-brand-orange disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-xl shadow-brand-brown/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-8 w-8" />
            ) : (
              <>
                {isRecurring ? 'Подписаться на' : 'Помочь на'}{' '}
                {currentAmount > 0 ? `${currentAmount} ₽` : ''}
                <ChevronRight size={28} className="ml-2 opacity-80" />
              </>
            )}
          </button>
        </div>

        {/* Модалка оферты */}
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
            <p>1.7. Принимая настоящую Оферту, Благотворитель гарантирует и заверяет АВТОНОМНАЯ БЛАГОТВОРИТЕЛЬНАЯ СОЦИАЛЬНО-МЕДИЦИНСКАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ДОМ МИЛОСЕРДИЯ КУЗНЕЦА ЛОБОВА» в том, что:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>он является гражданином РФ/российской организацией (лицом, зарегистрированным на территории РФ);</li>
              <li>он совершает пожертвование от собственного имени и не действует в интересах третьих лиц;</li>
              <li>средства, перечисляемые в качестве пожертвования, не являются полученными из иностранного источника;</li>
              <li>он не состоит в реестре иностранных агентов, и на дату совершения акцепта Оферты им не получено уведомление о включении в реестр иностранных агентов;</li>
              <li>на дату совершения акцепта Оферты отсутствует финансирование со стороны организаций, включенных в Перечень иностранных и международных неправительственных организаций, деятельность которых признана нежелательной на территории Российской Федерации;</li>
              <li>он обладает всеми полномочиями для акцепта Оферты, все необходимые корпоративные одобрения получены, основания для признания недействительности акцепта Оферты, в том числе по причине ограничения полномочий, отсутствуют;</li>
              <li>сделанные выше заверения достоверны.</li>
            </ul>

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

        {/* Модалка обработки персональных данных */}
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
      </form>
    </div>
  );
};
