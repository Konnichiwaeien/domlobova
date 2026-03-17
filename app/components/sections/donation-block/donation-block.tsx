"use client";

import { FormDonation } from "../../form-donation";

const DonationBlock = () => {
  return (
    <section id="donate" className="relative py-16 md:py-24 lg:py-28 overflow-hidden bg-[#F9F8F6] content-auto">
      <div className="mx-auto max-w-[1300px] px-5 md:px-8">
        <div className="text-center mb-8 md:mb-10">
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
