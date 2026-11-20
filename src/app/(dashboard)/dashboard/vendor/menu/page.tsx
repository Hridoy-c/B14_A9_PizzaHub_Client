import Image from "next/image";
import Link from "next/link";
import { ImageOff, PlusCircle } from "lucide-react";
import { requireUser } from "@/lib/cors/Session";
import { categoryLabel } from "@/lib/utils/menu";
import type { MenuItemStatus } from "@/lib/types";
import { getMyMenu } from "@/lib/api/menu-item";

// Reads the session, so it blocks instead of prerendering.
export const instant = false;

const statusStyles: Record<MenuItemStatus, string> = {
  pending: "bg-[#F2C14E]/25 text-[#7A5A00]",
  approved: "bg-[#5B7F3A]/15 text-[#3F7A2C]",
  rejected: "bg-[#B23B2E]/10 text-[#B23B2E]",
  inactive: "bg-[#EADBC8] text-[#7A6455]",
};

const VendorMenuPage = async () => {
  const user = await requireUser();
  // The vendor's own items in every state: pending, approved and rejected.
  const items = await getMyMenu(user.id);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
            My Menu
          </h1>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
            Everything you sell, with prices and availability you control.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/menu/new"
          className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
        >
          <PlusCircle className="size-4" aria-hidden="true" />
          Add item
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center text-[0.9375rem] text-[#7A6455]">
          You have not added any items yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const status: MenuItemStatus = item.status ?? "pending";
            const cover = item.image ?? item.images?.[0];

            return (
              <li
                key={String(item._id)}
                className="flex flex-col rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EADBC8]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[#B9733A]">
                      <ImageOff className="size-8" aria-hidden="true" />
                    </div>
                  )}

                  <span
                    className={`absolute left-2 top-2 rounded-full px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-wide ${statusStyles[status]}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
                  {categoryLabel(item.category)}
                </p>
                <h2 className="mt-1 font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
                  {item.name}
                </h2>
                <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-[#7A6455]">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-display text-[1.25rem] leading-none tracking-tight text-[#7A2E12]">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  {status === "approved" ? (
                    <Link
                      href={`/menu/${item._id}`}
                      className="rounded-full border border-[#3B2417] px-4 py-2 font-sans text-[0.875rem] text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
                    >
                      View Details
                    </Link>
                  ) : (
                    <span className="font-sans text-[0.75rem] text-[#7A6455]">
                      {status === "pending" ? "Awaiting review" : "Not public yet"}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default VendorMenuPage;
