"use client";

import React, { useState } from "react";
import PizzaCard from "@/components/home/PizzaCard";
import {
  exploreCategories,
  explorePizzas,
  type ExploreCategory,
} from "@/components/home/Explore-data";

const MAX_VISIBLE_ITEMS = 6;

const ExploreSection = () => {
  const [active, setActive] = useState<ExploreCategory>(exploreCategories[0]);

  const items = explorePizzas
    .filter((pizza) => pizza.category === active)
    .slice(0, MAX_VISIBLE_ITEMS);

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

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Pizza categories"
          className="mt-8 flex flex-wrap gap-2 md:mt-10"
        >
          {exploreCategories.map((category) => {
            const selected = category === active;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(category)}
                className={`rounded-full px-4 py-2 font-sans text-[0.75rem] uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 ${
                  selected
                    ? "bg-[#6B4332] text-[#F5EDE3]"
                    : "bg-[#F5EDE3] text-[#6B4332] hover:bg-[#EADBC8]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((pizza, index) => (
            <PizzaCard key={pizza.id} pizza={pizza} priority={index < 3} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ExploreSection;
