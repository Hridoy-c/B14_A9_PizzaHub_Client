import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { ImageOff, MapPin } from "lucide-react";

import { getAllMenuForAdmin } from "@/lib/api/menu-item";
import { categoryLabel } from "@/lib/utils/menu";
import type { MenuItemStatus } from "@/lib/types";

import MenuStatusActions from "@/components/dashboard/admin/menu/MenuStatusActions";

// Status styles
const statusStyles: Record<MenuItemStatus, string> = {
  pending: "bg-[#F2C14E]/25 text-[#7A5A00]",
  approved: "bg-[#5B7F3A]/15 text-[#3F7A2C]",
  rejected: "bg-[#B23B2E]/10 text-[#B23B2E]",
  inactive: "bg-[#EADBC8] text-[#7A6455]",
};

// Available filters
const filters = ["all", "pending", "approved", "rejected"] as const;

type Filter = (typeof filters)[number];

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

// Format price
const priceLabel = (price: number | string) => {
  const value = typeof price === "number" ? price : Number(price);

  return Number.isFinite(value) ? `$${value.toFixed(2)}` : "—";
};

// Validate menu item status
const getValidStatus = (status?: string): MenuItemStatus => {
  if (
    status === "pending" ||
    status === "approved" ||
    status === "rejected" ||
    status === "inactive"
  ) {
    return status;
  }

  return "pending";
};

// Loading placeholder shown while the menu items stream in
const MenuItemsSkeleton = () => (
  <div className="flex flex-col gap-6" aria-busy="true">
    <div className="flex flex-wrap gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-9 w-24 animate-pulse rounded-full bg-[#EADBC8]"
        />
      ))}
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-80 animate-pulse rounded-3xl border border-[#EADBC8] bg-[#FBF6EF]"
        />
      ))}
    </div>
  </div>
);

// Dynamic part: reads searchParams + cookies and fetches data.
// This must live inside <Suspense> so the page shell can be prerendered.
const MenuItemsContent = async ({ searchParams }: PageProps) => {
  // Get selected filter from URL
  const { status } = await searchParams;

  const active: Filter = filters.find((f) => f === status) ?? "all";

  // Fetch all menu items
  const items = await getAllMenuForAdmin();

  // Initialize status counts
  const counts: Record<MenuItemStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    inactive: 0,
  };

  // Calculate status counts
  for (const item of items) {
    const itemStatus = getValidStatus(item.status);

    counts[itemStatus] += 1;
  }

  // Filter menu items
  const visible =
    active === "all"
      ? items
      : items.filter((item) => getValidStatus(item.status) === active);

  return (
    <>
      {/* Status Filters */}
      <nav
        aria-label="Filter by status"
        className="flex flex-wrap gap-2 font-sans text-[0.875rem]"
      >
        {filters.map((f) => {
          const count = f === "all" ? items.length : counts[f];

          return (
            <Link
              key={f}
              href={
                f === "all"
                  ? "/dashboard/admin/menu-items"
                  : `/dashboard/admin/menu-items?status=${f}`
              }
              aria-current={f === active ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 capitalize transition-colors ${
                f === active
                  ? "border-[#3B2417] bg-[#3B2417] text-[#F5EDE3]"
                  : "border-[#EADBC8] text-[#3B2417] hover:border-[#3B2417]"
              }`}
            >
              {f}

              <span
                className={`rounded-full px-1.5 text-[0.75rem] ${
                  f === active
                    ? "bg-[#F5EDE3]/20"
                    : "bg-[#3B2417]/8 text-[#7A6455]"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Empty State or Menu Items */}
      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center text-[0.9375rem] text-[#7A6455]">
          {active === "all"
            ? "No menu items yet. Vendors can submit dishes from their dashboard."
            : `No ${active} items right now.`}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => {
            const itemStatus = getValidStatus(item.status);

            const cover = item.image || item.images?.[0];

            return (
              <li
                key={String(item._id)}
                className="flex flex-col rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EADBC8]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={item.name || "Menu item"}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[#B9733A]">
                      <ImageOff className="size-8" aria-hidden="true" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-wide ${statusStyles[itemStatus]}`}
                  >
                    {itemStatus}
                  </span>
                </div>

                {/* Category */}
                <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
                  {categoryLabel(item.category)}
                </p>

                {/* Item Name */}
                <h2 className="mt-1 font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
                  {item.name}
                </h2>

                {/* Vendor Information */}
                <p className="mt-2 text-[0.75rem] text-[#7A6455]">
                  by {item.vendorName || "Unknown Vendor"}
                  {item.vendorEmail ? ` · ${item.vendorEmail}` : ""}
                </p>

                {/* Location */}
                {item.location ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-[0.75rem] text-[#7A6455]">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {item.location}
                  </p>
                ) : null}

                {/* Description */}
                <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-[#7A6455]">
                  {item.description || "No description available."}
                </p>

                {/* Price and Details */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-[1.25rem] leading-none tracking-tight text-[#7A2E12]">
                    {priceLabel(item.price)}
                  </p>

                  {itemStatus === "approved" ? (
                    <Link
                      href={`/menu/${item._id}`}
                      className="rounded-full border border-[#3B2417] px-4 py-2 font-sans text-[0.875rem] text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
                    >
                      View Details
                    </Link>
                  ) : (
                    <span className="font-sans text-[0.75rem] text-[#7A6455]">
                      Not public yet
                    </span>
                  )}
                </div>

                {/* Admin Actions */}
                <div className="mt-4 border-t border-[#EADBC8] pt-3">
                  <MenuStatusActions
                    id={String(item._id)}
                    status={itemStatus}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

// Page: no awaiting here, so the header renders instantly
const AdminMenuItemsPage = ({ searchParams }: PageProps) => {
  return (
    <section className="flex flex-col gap-6">
      {/* Page Header */}
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          Menu Items
        </h1>

        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Every dish across every vendor. Approve new submissions to publish
          them on the public menu, or reject anything that breaks the rules.
        </p>
      </header>

      {/* Dynamic content streams in here */}
      <Suspense fallback={<MenuItemsSkeleton />}>
        <MenuItemsContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default AdminMenuItemsPage;