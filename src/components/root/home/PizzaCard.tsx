"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { CardPizza } from "@/lib/types/menu-item";

type PizzaCardProps = {
  pizza: CardPizza;
  /** Loads the photo eagerly (use for the first row above the fold). */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

const defaultSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 85vw";

const PizzaCard = ({
  pizza,
  priority = false,
  sizes = defaultSizes,
  className = "",
}: PizzaCardProps) => {
  const media = pizza.image ? (
    <Image
      src={pizza.image}
      alt={pizza.name}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  ) : (
    <div
      aria-hidden="true"
      className="flex size-full items-center justify-center bg-gradient-to-br from-[#F5EDE3] to-[#EADBC8]"
    >
      <span className="text-5xl leading-none">{pizza.emoji ?? "🍕"}</span>
    </div>
  );

  return (
    <li
      className={`group relative flex flex-col rounded-3xl bg-[#F8EDDC] p-4 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(59,36,23,0.5)] ${className}`}
    >
      {/* The whole card is one link; it sits above the content so any click
          opens the details page instead of a dialog. */}
      <Link
        href={`/menu/${pizza.id}`}
        aria-label={`View details for ${pizza.name}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
      />

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EADBC8]">
        {media}
        {typeof pizza.rating === "number" && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-[#F5EDE3]/95 px-2.5 py-1 font-display text-[0.8125rem] leading-none text-[#7A2E12] shadow-sm">
            {pizza.rating.toFixed(1)}
            <Star
              className="size-3.5 fill-[#F2813B] text-[#F2813B]"
              aria-hidden="true"
            />
          </span>
        )}
      </div>

      {pizza.category && (
        <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
          {pizza.category}
        </p>
      )}

      <h3 className="mt-1 font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
        {pizza.name}
      </h3>

      {pizza.description && (
        <p className="mt-2 line-clamp-2 flex-1 font-body text-[0.8125rem] leading-relaxed text-[#7A6455]">
          {pizza.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-[1.25rem] text-[#7A2E12]">
          ${pizza.price.toFixed(2)}
        </span>

        <span className="inline-flex items-center gap-1 font-sans text-[0.75rem] uppercase tracking-wide text-[#F2813B] transition-colors group-hover:text-[#7A2E12]">
          View details
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </li>
  );
};

export default PizzaCard;
