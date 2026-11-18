"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import {
  exploreCategories,
  explorePizzas,
  type ExploreCategory,
} from "@/components/home/Explore-data";


const ExploreSection = () => {
  const [active, setActive] = useState<ExploreCategory>(exploreCategories[0]);

  const items = explorePizzas.filter((pizza) => pizza.category === active);

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
            Explore our signature pizzas
          </h2>
          <p className="max-w-[34ch] font-sans text-[0.8125rem] uppercase leading-snug tracking-wide text-[#B9733A]">
            A selection of favorites crafted to delight every pizza lover.
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
          {items.map((pizza) => (
            <li
              key={pizza.id}
              className="group relative flex flex-col rounded-3xl bg-[#F8EDDC] p-5 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(59,36,23,0.5)]"
            >
              <span className="flex items-center justify-end gap-1 font-display text-[0.9375rem] text-[#7A2E12]">
                {pizza.rating.toFixed(1)}
                <Star
                  className="size-4 fill-[#F2813B] text-[#F2813B]"
                  aria-hidden="true"
                />
              </span>

              <div className="relative mx-auto mt-2 aspect-square w-full max-w-[260px]">
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 80vw"
                  className="object-contain drop-shadow-[0_16px_14px_rgba(42,26,16,0.25)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-center font-display text-[1.5rem] uppercase leading-none text-[#7A2E12]">
                {pizza.name}
              </h3>

              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-[1.375rem] text-[#7A2E12]">
                  ${pizza.price.toFixed(2)}
                </span>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1 font-display text-[0.9375rem] uppercase text-[#F2813B] transition-colors hover:text-[#7A2E12]"
                >
                  Order this pizza
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ExploreSection;