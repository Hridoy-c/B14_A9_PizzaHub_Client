import React, { Suspense, cache } from "react";
import PizzaCard from "@/components/root/home/PizzaCard";
import MenuSearchBar from "@/components/root/menu/MenuSearchBar";
import MenuFilters from "@/components/root/menu/MenuFilters";
import { getPizzas } from "@/lib/api/menu-item";
import { PIZZA_CATEGORIES } from "@/lib/types";

export const metadata = {
  title: "Menu | PizzaHub",
  description:
    "The full PizzaHub menu — classic and gourmet pizzas, vegetarian favourites, meat lovers, sides, drinks and desserts, baked to order.",
};

// PageProps
type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    sort?: string;
  }>;
};
const loadAllPizzas = cache(() => getPizzas());

const toolbarClass =
  "mt-8 flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4 sm:p-5";

const ToolbarSkeleton = () => (
  <div aria-busy="true" className={toolbarClass}>
    <div className="h-[3.25rem] animate-pulse rounded-full bg-[#EADBC8]" />
    <div className="flex flex-wrap gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-9 w-24 animate-pulse rounded-full bg-[#EADBC8] sm:w-28"
        />
      ))}
    </div>
  </div>
);

const MenuSkeleton = () => (
  <ul aria-busy="true" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <li key={i} className="animate-pulse rounded-3xl bg-[#F8EDDC] p-4">
        <div className="aspect-[4/3] w-full rounded-2xl bg-[#EADBC8]" />
        <div className="mt-4 h-4 w-2/3 rounded-full bg-[#EADBC8]" />
        <div className="mt-3 h-3 w-full rounded-full bg-[#EADBC8]" />
        <div className="mt-2 h-3 w-4/5 rounded-full bg-[#EADBC8]" />
      </li>
    ))}
  </ul>
);

const MenuToolbar = async () => {
  const pizzas = await loadAllPizzas();

  const locations = Array.from(
    new Set(
      pizzas
        .map((pizza) => pizza.location?.trim())
        .filter((location): location is string => Boolean(location)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className={toolbarClass}>
      <MenuSearchBar />
      <MenuFilters locations={locations} />
    </div>
  );
};

const MenuSections = async ({ searchParams }: PageProps) => {

  const { q, category, location, sort } = await searchParams;

  const allPizzas = await getPizzas({
    q: q?.trim(),
    category,
    location,
    sort,
  });

  const hasFilters = Boolean(q?.trim() || category || location);

  const sections = PIZZA_CATEGORIES.map((item) => ({
    ...item,
    items: allPizzas
      .filter((pizza) => pizza.category === item.value)
      .map((pizza) => ({
        id: String(pizza._id),
        name: pizza.name,
        price: pizza.price,
        image: pizza.image ?? pizza.images?.[0] ?? "",
        description: pizza.description,
      })),
  })).filter((section) => section.items.length > 0);

  if (sections.length === 0) {
    return (
      <p className="mt-12 rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center text-[0.9375rem] text-[#7A6455]">
        {hasFilters
          ? "No pizzas match your search. Try clearing a filter."
          : "The menu is empty right now. Please check back soon."}
      </p>
    );
  }

  return (
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
              className="min-w-0 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] uppercase leading-none tracking-tight text-[#3B2417]"
            >
              {section.label}
            </h2>
            <span className="shrink-0 font-sans text-[0.75rem] uppercase tracking-wide text-[#B9733A]">
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
  );
};

const MenuPage = ({ searchParams }: PageProps) => {
  return (
    <div className="mx-auto w-[90vw] max-w-[1200px] py-12 md:py-16">
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
          Stone-baked pizzas, sides, drinks and desserts. Search, filter by
          category or location, and pick a favourite.
        </p>
      </header>

      <Suspense fallback={<ToolbarSkeleton />}>
        <MenuToolbar />
      </Suspense>

      <Suspense fallback={<MenuSkeleton />}>
        <MenuSections searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default MenuPage;