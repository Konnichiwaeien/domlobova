'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
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
    amount: 100,
    amountLabel: '100 ₽',
    name: 'Внимание',
    colorClass: 'text-brand-orange bg-brand-orange-light/20',
    iconClass: 'text-brand-orange',
    icon: <Heart size={24} />,
  },
  {
    amount: 300,
    amountLabel: '300 ₽',
    name: 'Поддержка',
    colorClass: 'text-[#E07A5F] bg-[#E07A5F]/10',
    iconClass: 'text-[#E07A5F]',
    icon: <HandHeart size={24} />,
  },
  {
    amount: 500,
    amountLabel: '500 ₽',
    name: 'Забота',
    colorClass: 'text-brand-yellow bg-brand-yellow/20',
    iconClass: 'text-brand-yellow',
    icon: <Sun size={24} />,
  },
  {
    amount: 1000,
    amountLabel: '1 000 ₽',
    name: 'Опора',
    colorClass: 'text-brand-brown bg-brand-brown/10',
    iconClass: 'text-brand-brown',
    icon: <ShieldCheck size={24} />,
  },
];

const getImpactDetails = (amount: number) => {
  if (amount >= 1000)
    return {
      title: 'Существенная поддержка',
      text: 'Благодаря вам мы сможем частично покрыть несколько дней работы сиделки или закупить дорогие медикаменты. Это та профессиональная забота, в которой наши подопечные нуждаются ежедневно.',
      icon: <Users className="text-brand-yellow" size={28} strokeWidth={1.5} />,
      style: 'bg-brand-cream border-brand-brown/10 text-brand-brown',
    };

  if (amount >= 500)
    return {
      title: 'Жизненно важная помощь',
      text: 'Ваше пожертвование может оплатить стоимость специализированного питания на несколько дней для одного тяжелобольного человека. Это энергия и силы, которые продлевают жизнь.',
      icon: <Sun className="text-[#81B29A]" size={28} strokeWidth={1.5} />,
      style: 'bg-[#FDFBF7] border-brand-brown/10 text-brand-brown',
    };

  if (amount >= 300)
    return {
      title: 'Важный шаг навстречу',
      text: 'Эти средства пойдут на регулярные закупки средств личной гигиены или расходных материалов. Именно из этих "мелочей" складывается домашний комфорт и достоинство в стенах хосписа.',
      icon: <HandHeart className="text-[#E07A5F]" size={28} strokeWidth={1.5} />,
      style: 'bg-[#FDFBF7] border-brand-brown/10 text-brand-brown',
    };

  return {
    title: 'Каждый рубль имеет значение',
    text: 'Даже небольшая сумма превращается в реальную помощь: теплый плед, кружку горячего чая и искреннее внимание, которого так не хватает людям, оказавшимся в беде.',
    icon: <Heart className="text-brand-orange" size={28} strokeWidth={1.5} />,
    style: 'bg-brand-cream border-brand-brown/10 text-brand-brown',
  };
};

export const FormDonation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    // Для демо-целей показываем сообщение об успешной оплате через 2 секунды.
    setTimeout(() => {
      setStatus('success');
      setIsLoading(false);
    }, 2000);
  };

  const inputClassName = (hasError: boolean) =>
    cn(
      'w-full rounded-[2rem] border-2 py-5 pl-12 pr-6 text-xl font-bold outline-none transition-all duration-300 ease-in-out',
      hasError
        ? 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500'
        : 'border-transparent bg-brand-cream text-brand-brown placeholder:text-brand-brown-light/60 hover:border-brand-orange/30 focus:bg-white focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/10 disabled:opacity-60 disabled:cursor-not-allowed'
    );

  if (status === 'success') {
    return (
      <div className="relative rounded-[3rem] bg-white p-8 md:p-16 shadow-2xl shadow-brand-orange/10 border border-brand-brown/10 text-center">
        <div className="mb-8 flex h-32 w-32 items-center mx-auto justify-center rounded-full bg-brand-orange text-white animate-bounce">
          <Heart className="h-16 w-16" strokeWidth={1.5} fill="currentColor" />
        </div>
        <h3 className="font-serif text-4xl md:text-5xl font-bold text-brand-brown mb-4">
          Спасибо!
        </h3>
        <p className="mt-6 text-xl font-medium text-brand-brown-light">
          Вы сделали этот мир чуточку светлее.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-10 rounded-full bg-brand-cream px-10 py-5 text-sm font-bold uppercase tracking-widest text-brand-orange hover:bg-brand-yellow/30 transition-colors cursor-pointer"
        >
          Вернуться
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-brand-brown/10 mx-auto w-full relative z-20">
      <h3 className="text-3xl md:text-5xl font-serif font-black text-brand-brown mb-4 text-center leading-tight">
        Выберите сумму пожертвования
      </h3>

      <p className="text-lg md:text-xl text-brand-brown-light mb-10 max-w-lg mx-auto font-medium text-center">
        Каждое пожертвование помогает нам обеспечивать достойный уход и заботу для подопечных Дома Лобова.
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
                  'relative flex items-center sm:flex-col sm:justify-center rounded-[2rem] border-2 outline-none transition-all duration-300 ease-in-out cursor-pointer p-6 gap-4',
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
                  <div className="font-serif font-black text-2xl md:text-3xl text-brand-brown mb-2">
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
                      {errors.name && (
                      <p className="text-red-500 text-sm font-bold ml-2">
                          {errors.name.message}
                      </p>
                      )}

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
                      {errors.email && (
                      <p className="text-red-500 text-sm font-bold ml-2">
                          {errors.email.message}
                      </p>
                      )}
                      
                      {/* Phone */}
                      <div className="relative group">
                      <Phone
                          size={22}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-brown-light transition-colors duration-300 group-focus-within:text-brand-orange"
                      />
                      <input
                          {...register('phone')}
                          disabled={isAnonymous}
                          placeholder="Телефон (по желанию)"
                          className={inputClassName(false)}
                      />
                      </div>

                      {/* Анонимность вниз под поля */}
                      <div
                          className="flex items-center gap-3 cursor-pointer group select-none ml-2 pt-2"
                          onClick={toggleAnonymous}
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
                    'rounded-[2rem] p-8 md:p-10 border flex flex-col gap-6 items-center text-center relative overflow-hidden transition-all duration-300 h-full justify-center',
                    impact.style
                    )}
                >
                    <div className="shrink-0 bg-white p-4 rounded-full shadow-md border border-brand-brown/5">
                    {impact.icon}
                    </div>

                    <div className="relative z-10 w-full">
                    <h4 className="font-serif font-black text-xl md:text-2xl mb-4 text-brand-brown">
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


        {/* Кнопка и Согласие */}
        <div className="flex justify-center flex-col items-center gap-6 mt-12">
          
          <button
            type="submit"
            disabled={isLoading || ((!isAnonymous) && !!errors.name)}
            className="w-full max-w-xl rounded-[2.5rem] bg-brand-brown py-6 md:py-8 text-center text-xl md:text-2xl font-black uppercase tracking-widest text-white transition-all hover:bg-brand-orange disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-xl shadow-brand-brown/20"
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

          <p className="text-center text-sm font-medium text-brand-brown-light max-w-md leading-relaxed">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <a
              href="#"
              className="text-brand-orange underline hover:text-brand-brown transition-colors"
            >
              офертой
            </a>{' '}
            и{' '}
            <a
              href="#"
              className="text-brand-orange underline hover:text-brand-brown transition-colors"
            >
              политикой конфиденциальности
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
