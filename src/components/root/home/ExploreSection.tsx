import React, { Suspense } from "react";
import PizzaCard from "@/components/root/home/PizzaCard";
import { getPizzas } from "@/lib/api/new-pizza";
import { toCardPizza } from "@/lib/utils/menu";

const MAX_VISIBLE_ITEMS = 6;

const CardsSkeleton = () => (
  <ul
    aria-hidden="true"
    className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: MAX_VISIBLE_ITEMS }).map((_, index) => (
      <li key={index} className="animate-pulse rounded-3xl bg-[#F8EDDC] p-4">
        <div className="aspect-[4/3] w-full rounded-2xl bg-[#EADBC8]" />
        <div className="mt-4 h-4 w-2/3 rounded-full bg-[#EADBC8]" />
        <div className="mt-3 h-3 w-full rounded-full bg-[#EADBC8]" />
        <div className="mt-2 h-3 w-4/5 rounded-full bg-[#EADBC8]" />
      </li>
    ))}
  </ul>
);

/** Fetches the real menu from the API and shows the first 6 items. */
const ExploreList = async () => {
  const pizzas = await getPizzas();
  const items = pizzas.slice(0, MAX_VISIBLE_ITEMS).map(toCardPizza);

  if (items.length === 0) {
    return (
      <p className="mt-6 rounded-3xl border border-dashed border-[#EADBC8] bg-[#F5EDE3] p-10 text-center font-body text-[0.9375rem] text-[#7A6455]">
        No dishes are on the menu right now. Please check back soon.
      </p>
    );
  }

  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((pizza, index) => (
        <PizzaCard key={pizza.id} pizza={pizza} priority={index < 3} />
      ))}
    </ul>
  );
};

const ExploreSection = () => {
  return (
    <section
      aria-labelledby="explore-heading"
      className="mx-auto w-[90vw] max-w-[1200px] py-12 md:py-16"
    >
      <div className="rounded-[2rem] bg-[#FBF6EF] p-5 sm:p-8 md:p-11">
        {/* Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2
            id="explore-heading"
            className="max-w-[12ch] font-display text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] uppercase leading-[0.95] tracking-tight text-[#7A2E12]"
          >
            Explore our menu
          </h2>
          <p className="max-w-[34ch] font-sans text-[0.8125rem] uppercase leading-snug tracking-wide text-[#B9733A]">
            Pizzas, sides, drinks and desserts — crafted to delight every pizza
            lover.
          </p>
        </div>

        {/* Cards — real data, newest six items */}
        <Suspense fallback={<CardsSkeleton />}>
          <ExploreList />
        </Suspense>
      </div>
    </section>
  );
};

export default ExploreSection;
