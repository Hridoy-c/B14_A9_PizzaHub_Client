import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Hourglass,
  ImageOff,
  MapPin,
  Package,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { requireUser } from "@/lib/cors/Session";
import { getOrdersByCustomer } from "@/lib/api/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import OrderStatusBadge from "@/components/dashboard/customer/orders/OrderStatusBadge";

// Reads the session, so it cannot be prerendered.
export const instant = false;

// Delivery dates are saved as midnight UTC, so format them in UTC too.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const STATUS_BAR: Record<OrderStatus, string> = {
  pending: "bg-[#E0A93B]",
  accepted: "bg-[#5B8A4A]",
  rejected: "bg-[#B3402A]",
  cancelled: "bg-[#A89484]",
};

const imageOf = (item?: { image?: string; images?: string[] } | null) =>
  item?.image ?? item?.images?.[0] ?? null;

const priceOf = (o: { item?: { price?: number } | null }) =>
  typeof o.item?.price === "number" ? o.item.price : 0;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

const Card = ({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
}) => (
  <article
    className={`flex flex-col gap-5 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-5 ${className}`}
  >
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 font-sans text-[0.8125rem] font-medium text-[#B9733A] underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
    {children}
  </article>
);

const Thumb = ({
  src,
  alt,
  className,
  sizes,
}: {
  src: string | null;
  alt: string;
  className: string;
  sizes: string;
}) => (
  <div
    className={`relative shrink-0 overflow-hidden bg-[#EADBC8] ${className}`}
  >
    {src ? (
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    ) : (
      <div className="flex size-full items-center justify-center text-[#B9733A]">
        <ImageOff className="size-5" aria-hidden="true" />
      </div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const CustomerOverviewPage = async () => {
  const user = await requireUser();
  const orders = await getOrdersByCustomer(user.id);

  // ---- counts ----
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  };
  for (const order of orders) {
    if (order.status in counts) counts[order.status] += 1;
  }

  // ---- total spent (accepted orders only) ----
  const accepted = orders.filter((o) => o.status === "accepted");
  const totalSpent = accepted.reduce((sum, o) => sum + priceOf(o), 0);

  // ---- next delivery (nearest upcoming accepted order) ----
  const now = new Date();
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const nextDelivery =
    accepted
      .filter((o) => new Date(o.deliveryDate).getTime() >= todayUtc)
      .sort(
        (a, b) =>
          new Date(a.deliveryDate).getTime() -
          new Date(b.deliveryDate).getTime(),
      )[0] ?? null;

  const recent = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const firstName = user.name?.split(" ")[0] ?? "there";

  const summary =
    counts.pending > 0
      ? `${counts.pending} ${counts.pending === 1 ? "order is" : "orders are"} waiting for the vendor to respond.`
      : orders.length === 0
        ? "You have not placed any orders yet."
        : "You're all caught up. No orders are waiting right now.";

  const stats: {
    label: string;
    value: string;
    note: string;
    icon: LucideIcon;
    accent?: boolean;
  }[] = [
    {
      label: "Total orders",
      value: String(orders.length),
      note: `${counts.accepted} accepted`,
      icon: Package,
    },
    {
      label: "Awaiting vendor",
      value: String(counts.pending),
      note: counts.pending ? "Pending response" : "Nothing pending",
      icon: Hourglass,
      accent: counts.pending > 0,
    },
    {
      label: "Total spent",
      value: money(totalSpent),
      note: `Across ${accepted.length} accepted ${accepted.length === 1 ? "order" : "orders"}`,
      icon: Wallet,
    },
    {
      label: "Next delivery",
      value: nextDelivery
        ? dateFormat.format(new Date(nextDelivery.deliveryDate))
        : "None scheduled",
      note: nextDelivery
        ? (nextDelivery.item?.name ?? "Item no longer available")
        : "Accepted orders appear here",
      icon: Truck,
    },
  ];

  return (
    <section className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
            {summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/customer/orders"
            className="rounded-full border border-[#3B2417] px-5 py-2 font-sans text-[0.875rem] font-medium text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
          >
            Track orders
          </Link>
          <Link
            href="/menu"
            className="rounded-full bg-[#3B2417] px-5 py-2 font-sans text-[0.875rem] font-medium text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
          >
            Browse the menu
          </Link>
        </div>
      </header>

      {/* Stat cards */}
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, accent }) => (
          <li
            key={label}
            className={`flex flex-col gap-4 rounded-2xl border p-5 ${
              accent
                ? "border-[#E0A93B] bg-[#FBF1DC]"
                : "border-[#EADBC8] bg-[#FBF6EF]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-sans text-[0.8125rem] text-[#7A6455]">
                {label}
              </p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#EADBC8] text-[#7A2E12]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <p
                className={`font-display leading-none tracking-tight text-[#3B2417] ${
                  value.length > 10 ? "text-[1.375rem]" : "text-[2rem]"
                }`}
              >
                {value}
              </p>
              <p className="truncate text-[0.75rem] text-[#7A6455]">{note}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Next delivery */}
        <Card
          title="Next delivery"
          action={
            nextDelivery
              ? { href: "/dashboard/customer/orders", label: "All orders" }
              : undefined
          }
        >
          {nextDelivery ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <Thumb
                src={imageOf(nextDelivery.item)}
                alt={nextDelivery.item?.name ?? "Ordered item"}
                sizes="(min-width: 640px) 144px, 90vw"
                className="aspect-[4/3] w-full rounded-xl sm:aspect-square sm:w-36"
              />

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-[1.375rem] leading-tight tracking-tight text-[#3B2417]">
                    {nextDelivery.item?.name ?? "Item no longer available"}
                  </h3>
                  {priceOf(nextDelivery) ? (
                    <p className="text-[0.9375rem] tabular-nums text-[#7A2E12]">
                      {money(priceOf(nextDelivery))}
                    </p>
                  ) : null}
                </div>

                <dl className="flex flex-col gap-2 text-[0.8125rem]">
                  <div className="flex items-start gap-2">
                    <CalendarDays
                      className="mt-0.5 size-4 shrink-0 text-[#B9733A]"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="sr-only">Delivery date</dt>
                      <dd className="text-[#3B2417]">
                        {dateFormat.format(new Date(nextDelivery.deliveryDate))}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-[#B9733A]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="sr-only">Delivery address</dt>
                      <dd className="break-words text-[#7A6455]">
                        {nextDelivery.deliveryAddress}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <p className="py-6 text-center text-[0.875rem] text-[#7A6455]">
              No upcoming deliveries. Once a vendor accepts an order, it will
              show up here.
            </p>
          )}
        </Card>

        {/* Status breakdown */}
        <Card title="Order status">
          {orders.length === 0 ? (
            <p className="py-6 text-center text-[0.875rem] text-[#7A6455]">
              Your order breakdown appears after your first order.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {ORDER_STATUSES.map((status) => {
                const count = counts[status];
                const percent = Math.round((count / orders.length) * 100);

                return (
                  <li key={status} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[0.875rem]">
                      <span className="capitalize text-[#3B2417]">
                        {status}
                      </span>
                      <span className="tabular-nums text-[#7A6455]">
                        <span className="font-medium text-[#3B2417]">
                          {count}
                        </span>{" "}
                        ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#EADBC8]">
                      <div
                        className={`h-full rounded-full ${STATUS_BAR[status]}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent orders */}
      <Card
        title="Recent orders"
        action={
          orders.length > 0
            ? { href: "/dashboard/customer/orders", label: "View all" }
            : undefined
        }
      >
        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-[0.875rem] text-[#7A6455]">
              Your orders will be listed here once you place one.
            </p>
            <Link
              href="/menu"
              className="rounded-full bg-[#3B2417] px-5 py-2 font-sans text-[0.875rem] font-medium text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-[#EADBC8]">
            {recent.map((order) => (
              <li
                key={order._id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Thumb
                  src={imageOf(order.item)}
                  alt={order.item?.name ?? "Ordered item"}
                  sizes="48px"
                  className="size-12 rounded-lg"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-[0.9375rem] font-medium text-[#3B2417]">
                    {order.item?.name ?? "Item no longer available"}
                  </p>
                  <p className="text-[0.75rem] text-[#7A6455]">
                    Placed {shortDate.format(new Date(order.createdAt))} ·
                    Delivery {dateFormat.format(new Date(order.deliveryDate))}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span className="hidden text-[0.9375rem] tabular-nums text-[#3B2417] sm:inline">
                    {typeof order.item?.price === "number"
                      ? money(order.item.price)
                      : "—"}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
};

export default CustomerOverviewPage;