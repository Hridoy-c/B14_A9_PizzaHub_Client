import React from "react";

type Feature = {
  label: string;
  /** Colours + tilt for the floating pill. */
  pillClass: string;
  /** Desktop position inside the card (mobile falls back to a wrapped row). */
  positionClass: string;
};

const features: Feature[] = [
  {
    label: "Fresh Pizza",
    pillClass: "bg-[#F2C14E] text-[#7A2E12] -rotate-[8deg]",
    positionClass: "md:left-[47%] md:top-[4%]",
  },
  {
    label: "Easy Ordering",
    pillClass: "bg-[#5B7F3A] text-[#F5EDE3] -rotate-[8deg]",
    positionClass: "md:left-[8%] md:top-[45%]",
  },
  {
    label: "Trusted Restaurants",
    pillClass: "bg-[#F2813B] text-[#F5EDE3] -rotate-[7deg]",
    positionClass: "md:right-[7%] md:top-[43%]",
  },
  {
    label: "Fast Delivery",
    pillClass: "bg-[#F8EDDC] text-[#7A2E12] rotate-[7deg]",
    positionClass: "md:left-[45%] md:top-[69%]",
  },
];

const WhyChooseSection = () => {
  return (
    <section
      aria-labelledby="why-heading"
      className="mx-auto w-[90vw] max-w-[1200px] py-12 md:py-16"
    >
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#7A2E12] px-5 py-14 text-center sm:px-10 md:min-h-[680px] md:py-16">
        <h2
          id="why-heading"
          className="mx-auto max-w-[17ch] font-display text-[clamp(2.25rem,1.2rem+4.6vw,4.5rem)] uppercase leading-[0.92] tracking-tight text-[#F5EDE3] md:max-w-[20ch]"
        >
          Stir up your pizza night and{" "}
          <span className="my-2 inline-block -rotate-[3deg] rounded-[0.14em] bg-[#F2813B] px-[0.22em] pb-[0.04em] text-[#7A2E12] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] md:my-3">
            Order Up
          </span>{" "}
          from trusted kitchens, baked fresh and delivered fast
        </h2>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5 md:mt-0 md:block">
          {features.map((item) => (
            <li
              key={item.label}
              className={`rounded-full px-4 py-2 font-sans text-[0.75rem] uppercase tracking-wide shadow-md md:absolute ${item.pillClass} ${item.positionClass}`}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-[40ch] font-body text-[0.9375rem] leading-relaxed text-[#F5EDE3]/85 md:absolute md:inset-x-0 md:bottom-14 md:mt-0">
          Hand-stretched pizzas from restaurants we trust, ordered in a few taps
          and at your door while they are still hot.
        </p>
      </div>
    </section>
  );
};

export default WhyChooseSection;