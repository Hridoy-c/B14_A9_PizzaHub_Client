import React from "react";
import PizzaCard from "@/components/root/home/PizzaCard";
import { getPizzas } from "@/lib/api/new-pizza";
import { PIZZA_CATEGORIES } from "@/lib/types/menu-item";

export const metadata = {
  title: "Menu | PizzaHub",
  description:
    "The full PizzaHub menu — classic and gourmet pizzas, vegetarian favourites, meat lovers, sides, drinks and desserts, baked to order.",
};

// Uncached data (`cache: "no-store"` in getPizzas) already renders at request
// time under Cache Components, so no route segment config is needed here.
const MenuPage = async () => {
  const allPizzas = await getPizzas();

  // Shape the real data for PizzaCard, grouped by category slug.
  const sections = PIZZA_CATEGORIES.map((category) => ({
    ...category,
    items: allPizzas
      .filter((pizza) => pizza.category === category.value)
      .map((pizza) => ({
        id: String(pizza._id),
        name: pizza.name,
        price: pizza.price,
        image: pizza.image ?? pizza.images?.[0] ?? "",
        description: pizza.description,
      })),
  })).filter((section) => section.items.length > 0);

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
          Stone-baked pizzas, sides, drinks and desserts. Pick a favourite below
          or jump straight to a section.
        </p>
      </header>

      {sections.length === 0 ? (
        <p className="mt-12 rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center text-[0.9375rem] text-[#7A6455]">
          The menu is empty right now. Please check back soon.
        </p>
      ) : (
        <>
          {/* Section pills */}
          <nav aria-label="Menu sections" className="mt-8 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.value}
                href={`#${section.value}`}
                className="rounded-full bg-[#F5EDE3] px-4 py-2 font-sans text-[0.75rem] uppercase tracking-wide text-[#6B4332] transition-colors hover:bg-[#EADBC8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
              >
                {section.label}
              </a>
            ))}
          </nav>

          {/* Sections */}
          <div className="mt-12 flex flex-col gap-14 md:gap-16">
            {sections.map((section, sectionIndex) => (
              <section
                key={section.value}
                id={section.value}
                aria-labelledby={`menu-${section.value}`}
                className="scroll-mt-24"
              >
                <div className="flex items-end justify-between gap-4 border-b border-[#EADBC8] pb-3">
                  <h2
                    id={`menu-${section.value}`}
                    className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] uppercase leading-none tracking-tight text-[#3B2417]"
                  >
                    {section.label}
                  </h2>
                  <span className="font-sans text-[0.75rem] uppercase tracking-wide text-[#B9733A]">
                    {section.items.length}{" "}
                    {section.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((pizza, index) => (
                    <PizzaCard
                      key={pizza.id}
                      pizza={pizza}
                      priority={sectionIndex === 0 && index < 3}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuPage;
