"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What makes PizzaHub different?",
    answer:
      "We focus on quality in every step, from hand-stretching fresh dough daily to using premium cheese and locally sourced toppings, baked hot and delivered fast.",
  },
  {
    question: "Do you offer takeaway and delivery?",
    answer:
      "Yes. You can order for pickup at the counter or get it delivered to your door. Delivery times and fees depend on your area and are shown at checkout.",
  },
  {
    question: "Are your ingredients ethically sourced?",
    answer:
      "We work with trusted local farms and suppliers for our vegetables, dairy and meats, and we choose ingredients that are fresh, seasonal and responsibly produced.",
  },
  {
    question: "Do you have vegetarian or vegan options?",
    answer:
      "Absolutely. We have several vegetarian pizzas, and vegan cheese is available on request for most of our menu.",
  },
  {
    question: "Can I customize my pizza?",
    answer:
      "Yes. Pick your size and crust, then add or remove toppings to build the pizza you like. Extra toppings are priced individually.",
  },
];

function ArrowIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`size-6 shrink-0 text-[#B9733A] transition-transform duration-500 ease-in-out ${
        open ? "-rotate-180" : "rotate-0"
      }`}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-[#F5EDE3] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display max-w-md text-[clamp(1.75rem,1.4rem+2vw,2.75rem)] leading-[1.05] tracking-tight text-[#3B2417]">
            Frequently asked questions
          </h2>
          <p className="max-w-xs text-[0.9375rem] text-[#7A6455]">
            Everything you need to know before your next PizzaHub order.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.question}
                className={`rounded-3xl border border-[#EADBC8] transition-colors duration-500 ${
                  open ? "bg-white/70" : "bg-white/50 hover:bg-white/70"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="font-sans flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[1rem] text-[#3B2417] md:px-8"
                  >
                    {item.question}
                    <ArrowIcon open={open} />
                  </button>
                </h3>

                {/* Smooth height animation */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl px-6 pb-6 text-[0.9375rem] leading-relaxed text-[#7A6455] md:px-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}