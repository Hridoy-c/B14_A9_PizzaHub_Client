"use client";

import { ArrowUpDown, ChevronDown, MapPin, X } from "lucide-react";
import { PIZZA_CATEGORIES } from "@/lib/types";
import { useMenuParams } from "@/hooks/useMenuParams";

type MenuFiltersProps = {
  locations: string[];
  resultCount?: number;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

type ActiveChip = {
  key: string;
  label: string;
  clear: Record<string, string | null>;
};

const chipBase =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-2 font-sans text-[0.8125rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50";

const MenuFilters = ({ locations, resultCount }: MenuFiltersProps) => {
  const { searchParams, update, clearAll, isPending } = useMenuParams();

  const query = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";
    const sort =
    SORT_OPTIONS.find((item) => item.value === searchParams.get("sort"))
      ?.value ?? "newest";
  const activeCategory = PIZZA_CATEGORIES.find(
    (item) => item.value === searchParams.get("category"),
  );
  const category = activeCategory?.value ?? "";


  const hasFilters = Boolean(
    query || category || location || (sort && sort !== "newest"),
  );

  const locationOptions =
    location && !locations.includes(location)
      ? [location, ...locations]
      : locations;

  const chipCandidates: (ActiveChip | null)[] = [
    query
      ? { key: "q", label: `Search: “${query}”`, clear: { q: null } }
      : null,
    activeCategory
      ? {
          key: "category",
          label: activeCategory.label,
          clear: { category: null },
        }
      : null,
    location
      ? { key: "location", label: location, clear: { location: null } }
      : null,
  ];

  const activeChips = chipCandidates.filter(
    (chip): chip is ActiveChip => chip !== null,
  );

  return (
    <div
      aria-busy={isPending}
      className={`flex flex-col gap-4 transition-opacity ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            aria-pressed={!category}
            onClick={() => update({ category: null })}
            className={`${chipBase} ${
              !category
                ? "border-[#3B2417] bg-[#3B2417] text-[#F5EDE3]"
                : "border-[#EADBC8] bg-white text-[#3B2417] hover:border-[#3B2417]"
            }`}
          >
            All
          </button>

          {PIZZA_CATEGORIES.map((item) => {
            const selected = item.value === category;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={selected}
                onClick={() => update({ category: item.value })}
                className={`${chipBase} ${
                  selected
                    ? "border-[#3B2417] bg-[#3B2417] text-[#F5EDE3]"
                    : "border-[#EADBC8] bg-white text-[#3B2417] hover:border-[#3B2417]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

               <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="relative w-full shrink-0 lg:w-56">
            <label htmlFor="menu-location" className="sr-only">
              Filter by location
            </label>
            <MapPin
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#B9733A]"
              aria-hidden="true"
            />
            <select
              id="menu-location"
              value={location}
              onChange={(event) =>
                update({ location: event.target.value || null })
              }
              className="h-11 w-full appearance-none rounded-full border border-[#EADBC8] bg-white pl-10 pr-10 font-sans text-[0.875rem] text-[#3B2417] outline-none transition-all hover:border-[#3B2417] focus:border-[#B9733A] focus:ring-4 focus:ring-[#B9733A]/15"
            >
              <option value="">All locations</option>
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#7A6455]"
              aria-hidden="true"
            />
          </div>

          <div className="relative w-full shrink-0 lg:w-52">
            <label htmlFor="menu-sort" className="sr-only">
              Sort by price
            </label>
            <ArrowUpDown
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#B9733A]"
              aria-hidden="true"
            />
            <select
              id="menu-sort"
              value={sort}
              onChange={(event) =>
                update({
                  sort: event.target.value === "newest" ? null : event.target.value,
                })
              }
              className="h-11 w-full appearance-none rounded-full border border-[#EADBC8] bg-white pl-10 pr-10 font-sans text-[0.875rem] text-[#3B2417] outline-none transition-all hover:border-[#3B2417] focus:border-[#B9733A] focus:ring-4 focus:ring-[#B9733A]/15"
            >
              {SORT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#7A6455]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {hasFilters || resultCount !== undefined ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[#EADBC8] pt-4">
          {resultCount !== undefined ? (
            <p
              aria-live="polite"
              className="mr-1 font-sans text-[0.8125rem] text-[#7A6455]"
            >
              <span className="text-[#3B2417]">{resultCount}</span>{" "}
              {resultCount === 1 ? "item" : "items"}
            </p>
          ) : null}

          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update(chip.clear )}
              aria-label={`Remove filter: ${chip.label}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F5EDE3] py-1.5 pl-3 pr-2 font-sans text-[0.75rem] text-[#6B4332] transition-colors hover:bg-[#EADBC8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              <span className="truncate">{chip.label}</span>
              <X className="size-3.5 shrink-0" aria-hidden="true" />
            </button>
          ))}

          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto font-sans text-[0.8125rem] text-[#B9733A] underline-offset-4 transition-colors hover:text-[#7A2E12] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default MenuFilters;