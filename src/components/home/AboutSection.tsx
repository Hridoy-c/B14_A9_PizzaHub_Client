import React from "react";
import GridRule from "./GridRule";

/* ---------- Inline illustrations (swap for real photos any time) ---------- */

const PizzaSliceArt = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="none"
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    <g transform="rotate(-10 40 40)">
      {/* cheese */}
      <path
        d="M40 5 73 65Q40 76 7 65Z"
        fill="#F2C14E"
        stroke="#3B2417"
        strokeWidth="2.5"
      />
      {/* crust */}
      <path
        d="M7 65Q40 76 73 65L70 58Q40 67 10 58Z"
        fill="#B9733A"
        stroke="#3B2417"
        strokeWidth="2.5"
      />
      {/* pepperoni */}
      <circle cx="40" cy="22" r="5.5" fill="#B23B2E" stroke="#3B2417" strokeWidth="2" />
      <circle cx="30" cy="42" r="6" fill="#B23B2E" stroke="#3B2417" strokeWidth="2" />
      <circle cx="49" cy="44" r="5.5" fill="#B23B2E" stroke="#3B2417" strokeWidth="2" />
      {/* basil */}
      <path
        d="M38 52c4-6 10-6 13-3-2 6-9 8-13 3Z"
        fill="#5B7F3A"
        stroke="#3B2417"
        strokeWidth="1.8"
      />
    </g>
  </svg>
);

const TomatoArt = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill="none"
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    <circle cx="24" cy="27" r="17" fill="#D64532" stroke="#3B2417" strokeWidth="2.5" />
    <path d="M15 22c1.5-3.5 4.5-5.5 8-5.8" stroke="#F5EDE3" strokeWidth="2.5" opacity=".7" />
    <path
      d="M24 11 28 6l-1 8 7-2-5 6-5-2-5 2-5-6 7 2-1-8Z"
      fill="#5B7F3A"
      stroke="#3B2417"
      strokeWidth="2"
    />
  </svg>
);

/* ---------- Inline media helpers (sized in em so they scale with the text) ---------- */

const PillMedia = ({ children }: { children: React.ReactNode }) => (
  <span
    aria-hidden="true"
    className="relative mx-[0.1em] inline-block h-[0.8em] w-[1.7em] rounded-full bg-white align-[-0.06em]"
  >
    <span className="pointer-events-none absolute bottom-[0.02em] left-1/2 block h-[1.5em] w-[1.5em] -translate-x-1/2">
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
            <PizzaSliceArt className="size-full drop-shadow-[0_6px_6px_rgba(42,26,16,0.25)]" />
          </PillMedia>{" "}
          is more than a meal — it’s an experience. Sourcing{" "}
          <TomatoArt className="mx-[0.05em] inline-block h-[0.9em] w-[0.9em] align-[-0.1em]" />{" "}
          fresh ingredients to perfecting every slice
        </h2>
      </div>
    </section>
  );
};

export default AboutSection;