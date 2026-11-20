import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ImageOff, MapPin, MessageSquare } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { categoryLabel } from "@/lib/utils/menu";
import type { Order } from "@/lib/types";

// Delivery dates are saved as midnight UTC, so format them in UTC too.
const deliveryFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const placedFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const OrderCard = ({ order }: { order: Order }) => {
  const item = order.item;
  const cover = item?.image ?? item?.images?.[0];
  const shortId = order._id.slice(-6).toUpperCase();

  return (
    <li className="flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4 sm:flex-row">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-[#EADBC8] sm:aspect-square sm:w-36">
        {cover ? (
          <Image
            src={cover}
            alt={item?.name ?? "Ordered item"}
            fill
            sizes="(min-width: 640px) 144px, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#B9733A]">
            <ImageOff className="size-7" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
              Order #{shortId} · {placedFormat.format(new Date(order.createdAt))}
            </p>
            <h2 className="mt-1 font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
              {item?.name ?? "Item no longer available"}
            </h2>
            {item ? (
              <p className="mt-1 text-[0.75rem] text-[#7A6455]">
                {categoryLabel(item.category)}
                {item.vendorName ? ` · by ${item.vendorName}` : ""}
              </p>
            ) : null}
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <ul className="mt-3 flex flex-col gap-1.5 text-[0.8125rem] text-[#7A6455]">
          <li className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-[#B9733A]" aria-hidden="true" />
            Deliver on {deliveryFormat.format(new Date(order.deliveryDate))}
          </li>
          <li className="inline-flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#B9733A]" aria-hidden="true" />
            <span className="break-words">{order.deliveryAddress}</span>
          </li>
          {order.message ? (
            <li className="inline-flex items-start gap-2">
              <MessageSquare className="mt-0.5 size-4 shrink-0 text-[#B9733A]" aria-hidden="true" />
              <span className="break-words">{order.message}</span>
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="font-display text-[1.25rem] leading-none tracking-tight text-[#7A2E12]">
            {typeof item?.price === "number" ? `$${item.price.toFixed(2)}` : "—"}
          </p>

          {item ? (
            <Link
              href={`/menu/${order.itemId}`}
              className="rounded-full border border-[#3B2417] px-4 py-2 font-sans text-[0.875rem] text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
            >
              View item
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
};

export default OrderCard;