import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  ChefHat,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Star,
  Store,
} from "lucide-react";

import MenuGallery from "@/components/root/menu/MenuGallery";
import PizzaCard from "@/components/root/home/PizzaCard";
import { explorePizzas } from "@/components/root/home/Explore-data";
import { getPizzas, getPizzasById } from "@/lib/api/new-pizza";
import { categoryLabel, toCardPizza } from "@/lib/utils/menu";
import type { CardPizza } from "@/lib/types/menu-item";

type PageProps = {
  params: Promise<{ id: string }>;
};

type PizzaDetail = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating?: number;
  location?: string;
  vendorName?: string;
  vendorEmail?: string;
};

const fallbackDetail = (id: string): PizzaDetail | null => {
  const item = explorePizzas.find((pizza) => pizza.id === id);
  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    images: item.image ? [item.image] : [],
    rating: item.rating,
  };
};

/** One list request per render, shared by the detail and related lookups. */
const loadAllPizzas = cache(getPizzas);

/**
 * Memoised per request so `generateMetadata` and the page share one lookup.
 * Database items win; the static home cards act as a graceful fallback.
 */
const loadPizza = cache(async (id: string): Promise<PizzaDetail | null> => {
  // The by-id endpoint is tried first, then the list is searched (some
  // deployments only expose the collection route).
  const item =
    (await getPizzasById(id)) ??
    (await loadAllPizzas()).find((pizza) => String(pizza._id) === id) ??
    null;

  if (!item) return fallbackDetail(id);

  const images = [item.image, ...(item.images ?? [])].filter(
    (src): src is string => Boolean(src),
  );

  return {
    id: String(item._id),
    name: item.name,
    description: item.description,
    price: item.price,
    category: categoryLabel(item.category),
    images: Array.from(new Set(images)),
    location: item.location,
    vendorName: item.vendorName,
    vendorEmail: item.vendorEmail,
  };
});

const loadRelated = async (pizza: PizzaDetail): Promise<CardPizza[]> => {
  const items = await loadAllPizzas();

  const sameCategory = items
    .filter(
      (item) =>
        String(item._id) !== pizza.id &&
        categoryLabel(item.category) === pizza.category,
    )
    .slice(0, 3)
    .map(toCardPizza);

  if (sameCategory.length > 0) return sameCategory;

  return explorePizzas
    .filter((item) => item.id !== pizza.id && item.category === pizza.category)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      rating: item.rating,
    }));
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const pizza = await loadPizza(id);

  if (!pizza) return { title: "Pizza not found | PizzaHub" };

  const description = pizza.description.replace(/\s+/g, " ").slice(0, 155);

  return {
    title: `${pizza.name} | PizzaHub`,
    description,
    openGraph: {
      title: pizza.name,
      description,
      images: pizza.images.length > 0 ? [pizza.images[0]] : undefined,
    },
  };
};

const MenuDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const pizza = await loadPizza(id);

  if (!pizza) notFound();

  const related = await loadRelated(pizza);
  const hasVendorEmail = Boolean(pizza.vendorEmail);
  const orderHref = hasVendorEmail
    ? `mailto:${pizza.vendorEmail}?subject=${encodeURIComponent(
        `Order: ${pizza.name}`,
      )}`
    : "/menu";

  const features = [
    {
      icon: ChefHat,
      title: "Stone-baked crust",
      copy: "Hand-stretched dough, fired at 400°C until the edges blister.",
    },
    {
      icon: Clock,
      title: "Ready in 20–25 min",
      copy: "Made to order the moment it hits the kitchen, never reheated.",
    },
    {
      icon: Bike,
      title: "Hot local delivery",
      copy: "Packed in an insulated box and tracked on its way to your door.",
    },
  ];

  return (
    <div className="mx-auto w-[90vw] max-w-[1200px] py-10 md:py-14">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.75rem] uppercase tracking-[0.14em] text-[#7A6455]">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-[#B9733A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <Link
              href="/menu"
              className="transition-colors hover:text-[#B9733A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              Menu
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <span aria-current="page" className="text-[#B9733A]">
              {pizza.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-8">
        <MenuGallery images={pizza.images} name={pizza.name} />

        <article
          aria-labelledby="pizza-title"
          className="flex flex-col rounded-[2rem] border border-[#EADBC8] bg-[#FBF6EF] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F5EDE3] px-3 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
              {pizza.category}
            </span>
            {typeof pizza.rating === "number" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2813B]/12 px-3 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
                {pizza.rating.toFixed(1)}
                <Star
                  className="size-3.5 fill-[#F2813B] text-[#F2813B]"
                  aria-hidden="true"
                />
                rating
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EDE3] px-3 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#7A6455]">
              <ChefHat className="size-3.5 text-[#B9733A]" aria-hidden="true" />
              Baked to order
            </span>
          </div>

          <h1
            id="pizza-title"
            className="mt-5 font-display text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] uppercase leading-[0.95] tracking-tight text-[#7A2E12]"
          >
            {pizza.name}
          </h1>

          <p className="mt-4 font-body text-[0.9375rem] leading-relaxed text-[#7A6455]">
            {pizza.description}
          </p>

          <div className="mt-6 flex items-end justify-between gap-4 border-y border-[#EADBC8] py-5">
            <div>
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#7A6455]">
                Price
              </p>
              <p className="mt-1 font-display text-[2.5rem] leading-none tracking-tight text-[#7A2E12]">
                ${pizza.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#7A6455]">
                Ready in
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-display text-[1.125rem] tracking-tight text-[#3B2417]">
                <Clock className="size-4 text-[#B9733A]" aria-hidden="true" />
                20–25 min
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl bg-[#F5EDE3] p-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FBF6EF] text-[#B9733A]">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                  Location
                </dt>
                <dd className="mt-0.5 font-sans text-[0.875rem] text-[#3B2417]">
                  {pizza.location || "PizzaHub kitchen"}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#F5EDE3] p-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FBF6EF] text-[#B9733A]">
                <Store className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                  Made by
                </dt>
                <dd className="mt-0.5 truncate font-sans text-[0.875rem] text-[#3B2417]">
                  {pizza.vendorName || "PizzaHub kitchen"}
                </dd>
              </div>
            </div>
          </dl>

          {hasVendorEmail && (
            <a
              href={`mailto:${pizza.vendorEmail}`}
              className="mt-3 inline-flex w-fit max-w-full items-center gap-2 truncate font-sans text-[0.8125rem] text-[#B9733A] transition-colors hover:text-[#7A2E12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{pizza.vendorEmail}</span>
            </a>
          )}

          <div className="mt-auto pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              {hasVendorEmail ? (
                <a
                  href={orderHref}
                  className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-3.5 font-sans text-[0.9375rem] text-[#F5EDE3] shadow-[0_16px_32px_-18px_rgba(59,36,23,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]"
                >
                  Order now
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href="/menu"
                  className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-3.5 font-sans text-[0.9375rem] text-[#F5EDE3] shadow-[0_16px_32px_-18px_rgba(59,36,23,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]"
                >
                  Browse the menu
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}

              {hasVendorEmail && (
                <Link
                  href="/menu"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#3B2417]/25 px-6 py-3.5 font-sans text-[0.9375rem] text-[#3B2417] transition-colors hover:bg-[#3B2417]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  All pizzas
                </Link>
              )}
            </div>

            <p className="mt-3 text-center font-body text-[0.75rem] leading-relaxed text-[#7A6455] sm:text-left">
              Free delivery on orders over $25. Baked fresh when you order.
            </p>
          </div>
        </article>
      </div>

      {/* Highlights */}
      <section
        aria-label="What to expect"
        className="mt-6 grid gap-3 sm:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-4"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F5EDE3] text-[#B9733A]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-sans text-[0.8125rem] text-[#3B2417]">
                {title}
              </p>
              <p className="mt-1 font-body text-[0.75rem] leading-relaxed text-[#7A6455]">
                {copy}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#EADBC8] pb-3">
            <h2
              id="related-heading"
              className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] uppercase leading-none tracking-tight text-[#3B2417]"
            >
              More {pizza.category.toLowerCase()}
            </h2>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1 font-sans text-[0.75rem] uppercase tracking-wide text-[#B9733A] transition-colors hover:text-[#7A2E12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              See full menu
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <PizzaCard key={item.id} pizza={item} priority={index === 0} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default MenuDetailsPage;
