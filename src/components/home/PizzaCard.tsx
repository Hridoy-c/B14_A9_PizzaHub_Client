import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { ExplorePizza } from "@/components/home/Explore-data";

type PizzaCardProps = {
  pizza: ExplorePizza;
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
  return (
    <li
      className={`group relative flex flex-col rounded-3xl bg-[#F8EDDC] p-4 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(59,36,23,0.5)] ${className}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EADBC8]">
        <Image
          src={pizza.image}
          alt={pizza.name}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-[#F5EDE3]/95 px-2.5 py-1 font-display text-[0.8125rem] leading-none text-[#7A2E12] shadow-sm">
          {pizza.rating.toFixed(1)}
          <Star className="size-3.5 fill-[#F2813B] text-[#F2813B]" aria-hidden="true" />
        </span>
      </div>

      <h3 className="mt-4 font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
        {pizza.name}
      </h3>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-[1.25rem] text-[#7A2E12]">
          ${pizza.price.toFixed(2)}
        </span>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1 font-sans text-[0.75rem] uppercase tracking-wide text-[#F2813B] transition-colors hover:text-[#7A2E12]"
        >
          Order this pizza
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
};

export default PizzaCard;
