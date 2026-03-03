"use client";

import { FormDonation } from "../../form-donation";

const DonationBlock = () => {
  return (
    <section id="donate" className="relative py-16 md:py-20 overflow-hidden bg-[#F9F8F6]">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="text-center mb-8 md:mb-10">
          <div className="mb-4 md:mb-6 inline-flex rounded-full bg-brand-orange-light/30 px-6 py-2">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Ваш вклад
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-brand-brown tracking-tighter">
            ВРЕМЯ <span className="text-brand-orange italic">ПОМОГАТЬ</span>
          </h2>
        </div>

        <FormDonation />
      </div>
    </section>
  );
};

export { DonationBlock };
