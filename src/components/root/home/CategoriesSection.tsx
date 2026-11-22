import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PIZZA_CATEGORIES } from "@/lib/types";

const EMOJI: Record<string, string> = {
  classic: "🍕",
  vegetarian: "🥬",
  "meat-lovers": "🍖",
  specialty: "✨",
  sides: "🍟",
  "beverages-desserts": "🥤",
};

const CategoriesSection = () => (
  <section
    aria-labelledby="categories-heading"
    className="mx-auto w-[90vw] max-w-[1200px] py-12 md:py-16"
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <h2
        id="categories-heading"
        className="max-w-[14ch] font-display text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] uppercase leading-[0.95] tracking-tight text-[#3B2417]"
      >
        Explore by category
      </h2>
      <p className="max-w-[38ch] font-body text-[0.9375rem] leading-relaxed text-[#7A6455]">
        Pick what you are craving and jump straight to the dishes that match.
      </p>
    </div>

    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PIZZA_CATEGORIES.map((item) => (
        <li key={item.value}>
          <Link
            href={`/menu?category=${item.value}`}
            className="group flex h-full min-h-28 items-center justify-between gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(59,36,23,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
          >
            <span className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#F5EDE3] text-3xl"
              >
                {EMOJI[item.value] ?? "🍕"}
              </span>
              <span className="font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
                {item.label}
              </span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 text-[#B9733A] transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default CategoriesSection;