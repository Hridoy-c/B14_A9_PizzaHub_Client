import React from "react";
import Image from "next/image";
import GridRule from "./GridRule";

/* ---------- Inline media helpers (sized in em so they scale with the text) ---------- */

const PillMedia = ({ children }: { children: React.ReactNode }) => (
  <span
    aria-hidden="true"
    className="relative mx-[0.12em] inline-block h-[1em] w-[1.9em] rounded-full bg-white align-[-0.16em]"
  >
    <span className="pointer-events-none absolute left-1/2 top-1/2 block h-[0.82em] w-[0.82em] -translate-x-1/2 -translate-y-1/2">
      {children}
    </span>
  </span>
);

const AboutSection = () => {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative isolate w-full overflow-hidden"
    >
      {/* Brand grid rules behind the content */}
      <GridRule className="absolute inset-0 -z-10 h-full md:h-full" />

      <div className="mx-auto flex w-[90vw] max-w-[1100px] flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-24 lg:py-28">
        <p className="font-display text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] uppercase leading-none tracking-wide text-[#B9733A]">
          About PizzaHub
        </p>

        <h2
          id="about-heading"
          className="font-display text-balance text-[clamp(2.25rem,1.1rem+5.2vw,5.25rem)] uppercase leading-[0.98] tracking-tight text-[#3B2417]"
        >
          At PizzaHub, we believe pizza{" "}
          <PillMedia>
            <Image
              src="/images/about/slice.webp"
              alt=""
              width={256}
              height={256}
              sizes="160px"
              className="size-full rounded-full object-cover drop-shadow-[0_6px_6px_rgba(42,26,16,0.28)]"
            />
          </PillMedia>{" "}
          is more than a meal — it’s an experience. Sourcing{" "}
          <Image
            src="/images/about/fresh-tomato.webp"
            alt=""
            width={256}
            height={256}
            sizes="96px"
            className="mx-[0.05em] inline-block h-[0.9em] w-[0.9em] rounded-full object-cover align-[-0.1em]"
          />{" "}
          fresh ingredients to perfecting every slice
        </h2>
      </div>
    </section>
  );
};

export default AboutSection;
