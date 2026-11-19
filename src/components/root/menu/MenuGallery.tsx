"use client";

import { useState } from "react";
import Image from "next/image";
import { ChefHat } from "lucide-react";

type MenuGalleryProps = {
  images: string[];
  name: string;
};

const MenuGallery = ({ images, name }: MenuGalleryProps) => {
  const photos = images.filter((src): src is string => Boolean(src));
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[#EADBC8] bg-[#EADBC8]">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F5EDE3] to-[#EADBC8] text-[#B9733A]">
            <ChefHat className="size-12" aria-hidden="true" />
            <p className="font-sans text-[0.75rem] uppercase tracking-[0.16em] text-[#7A6455]">
              Photo coming soon
            </p>
          </div>
        )}

        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#F5EDE3]/95 px-3 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A2E12] shadow-sm backdrop-blur">
          <ChefHat className="size-3.5 text-[#B9733A]" aria-hidden="true" />
          Freshly baked
        </span>

        {photos.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-[#3B2417]/85 px-3 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#F5EDE3] shadow-sm backdrop-blur">
            {active + 1} / {photos.length} photos
          </span>
        )}
      </div>

      {photos.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {photos.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${photos.length}`}
                aria-pressed={index === active}
                className={`relative size-20 overflow-hidden rounded-2xl border-2 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3] sm:size-24 ${
                  index === active
                    ? "border-[#B9733A]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuGallery;
