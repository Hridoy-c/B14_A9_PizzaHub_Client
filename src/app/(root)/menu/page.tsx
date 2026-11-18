import React from "react";
import PizzaCard from "@/components/home/PizzaCard";
import {
  categorySlug,
  exploreCategories,
  explorePizzas,
} from "@/components/home/Explore-data";

export const metadata = {
  title: "Menu | PizzaHub",
  description:
    "Every PizzaHub pizza — signature classics, meat lovers and veggie favourites, baked to order.",
};

const MenuPage = () => {
  return (
    <div className="mx-auto w-[90vw] max-w-[1200px] py-12 md:py-16">
      {/* Header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-sans text-[0.75rem] uppercase tracking-[0.18em] text-[#B9733A]">
            Fresh from the oven
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] uppercase leading-[0.95] tracking-tight text-[#7A2E12]">
            Our menu
          </h1>
        </div>
        <p className="max-w-[38ch] font-body text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Eighteen pizzas, hand-stretched and stone-baked. Pick a favourite below
          or jump straight to a section.
        </p>
      </header>

      {/* Section pills */}
      <nav aria-label="Menu sections" className="mt-8 flex flex-wrap gap-2">
        {exploreCategories.map((category) => (
          <a
            key={category}
            href={`#${categorySlug(category)}`}
            className="rounded-full bg-[#F5EDE3] px-4 py-2 font-sans text-[0.75rem] uppercase tracking-wide text-[#6B4332] transition-colors hover:bg-[#EADBC8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
          >
            {category}
          </a>
        ))}
      </nav>

      {/* Sections */}
      <div className="mt-12 flex flex-col gap-14 md:gap-16">
        {exploreCategories.map((category) => {
          const items = explorePizzas.filter(
            (pizza) => pizza.category === category
          );

          return (
            <section
              key={category}
              id={categorySlug(category)}
              aria-labelledby={`menu-${categorySlug(category)}`}
              className="scroll-mt-24"
            >
              <div className="flex items-end justify-between gap-4 border-b border-[#EADBC8] pb-3">
                <h2
                  id={`menu-${categorySlug(category)}`}
                  className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] uppercase leading-none tracking-tight text-[#3B2417]"
                >
                  {category}
                </h2>
                <span className="font-sans text-[0.75rem] uppercase tracking-wide text-[#B9733A]">
                  {items.length} pizzas
                </span>
              </div>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((pizza, index) => (
                  <PizzaCard
                    key={pizza.id}
                    pizza={pizza}
                    priority={category === exploreCategories[0] && index < 3}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPage;
