import React from "react";
import Link from "next/link";
import { ArrowRight, ChefHat, MousePointerClick, ShoppingBag, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Tint of the icon badge. */
  badgeClass: string;
};

const steps: Step[] = [
  {
    title: "Pick your pizza",
    description:
      "Browse the menu, filter by category and choose from trusted local kitchens.",
    icon: MousePointerClick,
    badgeClass: "bg-[#F2C14E] text-[#7A2E12]",
  },
  {
    title: "Place your order",
    description:
      "Add it to your cart, confirm your address and pay in a few taps.",
    icon: ShoppingBag,
    badgeClass: "bg-[#F2813B] text-[#F5EDE3]",
  },
  {
    title: "The kitchen bakes it",
    description:
      "The vendor accepts your order and stretches, tops and bakes it fresh.",
    icon: ChefHat,
    badgeClass: "bg-[#5B7F3A] text-[#F5EDE3]",
  },
  {
    title: "Enjoy it hot",
    description:
      "Track your order from the oven to your door and dig in while it is warm.",
    icon: Truck,
    badgeClass: "bg-[#3B2417] text-[#F5EDE3]",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      aria-labelledby="how-heading"
      className="mx-auto w-[90vw] max-w-[1200px] py-12 md:py-16"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2
          id="how-heading"
          className="max-w-[14ch] font-display text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] uppercase leading-[0.95] tracking-tight text-[#3B2417]"
        >
          How PizzaHub works
        </h2>
        <p className="max-w-[38ch] font-body text-[0.9375rem] leading-relaxed text-[#7A6455]">
          From the first craving to the last bite, four simple steps.
        </p>
      </div>

      <ol className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-10">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-6"
          >
            <div className="flex items-start justify-between">
              <span
                aria-hidden="true"
                className={`grid size-12 place-items-center rounded-2xl ${step.badgeClass}`}
              >
                <step.icon className="size-6" />
              </span>
              <span
                aria-hidden="true"
                className="font-display text-[3.25rem] leading-none text-[#EADBC8]"
              >
                {index + 1}
              </span>
            </div>

            <h3 className="mt-8 font-display text-[1.5rem] uppercase leading-none tracking-tight text-[#7A2E12]">
              {step.title}
            </h3>
            <p className="mt-3 font-body text-[0.9375rem] leading-relaxed text-[#7A6455]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex justify-center">
        <Link
          href="/menu"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#3B2417] px-8 py-3.5 font-sans text-[0.875rem] text-[#F5EDE3] shadow-[0_10px_24px_-8px_rgba(59,36,23,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
        >
          Start your order
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default HowItWorksSection;