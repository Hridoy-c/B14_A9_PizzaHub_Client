"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CardPizza } from "@/lib/types/menu-item";

type PizzaCardProps = {
  pizza: CardPizza;
  /** Loads the photo eagerly (use for the first row above the fold). */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

const defaultSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 85vw";
const dialogSizes = "(min-width: 640px) 32rem, 90vw";

const ViewDetailsButton = () => (
  <>
    View Details
    <ArrowRight className="size-3.5" aria-hidden="true" />
  </>
);

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

        <Dialog>
          <DialogTrigger
            render={
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full font-sans text-[0.75rem] uppercase tracking-wide text-[#F2813B] transition-colors hover:text-[#7A2E12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8EDDC]"
              />
            }
          >
            <ViewDetailsButton />
          </DialogTrigger>

          <DialogContent
            showCloseButton={false}
            className="max-h-[90svh] gap-0 overflow-y-auto rounded-3xl border-0 bg-[#FBF6EF] p-0 text-[#3B2417] ring-[#EADBC8] sm:max-w-lg"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EADBC8]">
              {pizza.image ? (
                <Image
                  src={pizza.image}
                  alt={pizza.name}
                  fill
                  sizes={dialogSizes}
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex size-full items-center justify-center bg-gradient-to-br from-[#F5EDE3] to-[#EADBC8]"
                >
                  <span className="text-7xl leading-none">
                    {pizza.emoji ?? "🍕"}
                  </span>
                </div>
              )}

              <DialogClose
                render={
                  <button
                    type="button"
                    className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-[#F5EDE3]/95 text-[#3B2417] shadow-sm transition-colors hover:bg-[#F5EDE3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
                  />
                }
              >
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            <div className="flex flex-col gap-3 p-5 sm:p-6">
              {pizza.category && (
                <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
                  {pizza.category}
                </p>
              )}

              <DialogTitle className="font-display text-[1.75rem] uppercase leading-none tracking-tight text-[#7A2E12]">
                {pizza.name}
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[0.75rem] uppercase tracking-wide text-[#B9733A]">
                {typeof pizza.rating === "number" && (
                  <>
                    <span className="inline-flex items-center gap-1">
                      {pizza.rating.toFixed(1)}
                      <Star
                        className="size-3.5 fill-[#F2813B] text-[#F2813B]"
                        aria-hidden="true"
                      />
                      rating
                    </span>
                    <span aria-hidden="true">•</span>
                  </>
                )}
                <span className="font-display text-[1.125rem] normal-case text-[#7A2E12]">
                  ${pizza.price.toFixed(2)}
                </span>
              </div>

              {pizza.description && (
                <DialogDescription className="font-body text-[0.9375rem] leading-relaxed text-[#7A6455]">
                  {pizza.description}
                </DialogDescription>
              )}

              <Link
                href="/menu"
                className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#3B2417] px-6 py-3 font-sans text-[0.875rem] text-[#F5EDE3] shadow-[0_10px_24px_-8px_rgba(59,36,23,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]"
              >
                Browse full menu
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
};

export default PizzaCard;
