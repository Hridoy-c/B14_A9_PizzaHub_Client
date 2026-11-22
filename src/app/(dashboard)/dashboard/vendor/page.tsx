import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Hourglass,
  MapPin,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { requireUser } from "@/lib/cors/Session";
import { getOrdersByVendor } from "@/lib/api/orders";
import { getMyMenu } from "@/lib/api/menu-item";
import OrderActions from "@/components/dashboard/vendor/orders/OrderActions";

// Reads the session, so it cannot be prerendered.
export const instant = false;

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dayLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  timeZone: "UTC",
});

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (d: Date) =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

const priceOf = (o: { item?: { price?: number } | null }) =>
  typeof o.item?.price === "number" ? o.item.price : 0;

const VendorOverviewPage = async () => {
  const user = await requireUser();

  const [orders, menu] = await Promise.all([
    getOrdersByVendor(user.id),
    getMyMenu(user.id),
  ]);

  const today = startOfUtcDay(new Date());

  // ---- core numbers ----
  const pending = orders
    .filter((o) => o.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const accepted = orders.filter((o) => o.status === "accepted");
  const revenue = accepted.reduce((sum, o) => sum + priceOf(o), 0);

  const todaysOrders = orders.filter(
    (o) => startOfUtcDay(new Date(o.createdAt)) === today,
  );

  const liveMenuCount = menu.filter((m) => m.status === "approved").length;

  // ---- last 7 days chart ----
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = today - (6 - i) * DAY_MS;
    return {
      key: day,
      label: dayLabel.format(new Date(day)),
      count: orders.filter((o) => startOfUtcDay(new Date(o.createdAt)) === day)
        .length,
      isToday: day === today,
    };
  });
  const maxCount = Math.max(...week.map((d) => d.count), 1);

  // ---- top items (rejected and cancelled orders are not counted) ----
  const byItem = new Map<
    string,
    { name: string; orders: number; revenue: number }
  >();

  for (const o of orders) {
    if (o.status === "rejected" || o.status === "cancelled") continue;

    const entry = byItem.get(o.itemId) ?? {
      name: o.item?.name ?? "Item no longer available",
      orders: 0,
      revenue: 0,
    };
    entry.orders += 1;
    entry.revenue += priceOf(o);
    byItem.set(o.itemId, entry);
  }

  const topItems = [...byItem.values()]
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 3);

  // ---- upcoming deliveries (accepted, today or later) ----
  const upcoming = accepted
    .filter((o) => new Date(o.deliveryDate).getTime() >= today)
    .sort(
      (a, b) =>
        new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime(),
    )
    .slice(0, 4);

  const stats = [
    {
      label: "Needs action",
      value: String(pending.length),
      hint: pending.length ? "Pending orders" : "All clear",
      icon: Hourglass,
      accent: pending.length > 0,
    },
    {
      label: "Today's orders",
      value: String(todaysOrders.length),
      hint: "Placed today",
      icon: ClipboardList,
      accent: false,
    },
    {
      label: "Revenue",
      value: `$${revenue.toFixed(2)}`,
      hint: `From ${accepted.length} accepted ${accepted.length === 1 ? "order" : "orders"}`,
      icon: Wallet,
      accent: false,
    },
    {
      label: "Menu items",
      value: String(menu.length),
      hint: `${liveMenuCount} live`,
      icon: UtensilsCrossed,
      accent: false,
    },
  ];

  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <section className="flex min-w-0 flex-col gap-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
            Overview
          </h1>
          <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
            Good to see you, {firstName}.{" "}
            {pending.length > 0
              ? `${pending.length} ${pending.length === 1 ? "order is" : "orders are"} waiting for your decision.`
              : "No orders are waiting for you right now."}
          </p>
        </div>
        <p className="font-sans text-[0.75rem] uppercase tracking-[0.16em] text-[#B9733A]">
          {dateFormat.format(new Date())}
        </p>
      </header>

      {/* Stat cards */}
      <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon, accent }) => (
          <li
            key={label}
            className={`flex flex-col gap-4 rounded-3xl border p-4 ${
              accent
                ? "border-[#E0A93B] bg-[#FBF1DC]"
                : "border-[#EADBC8] bg-[#FBF6EF]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-sans text-[0.75rem] uppercase tracking-[0.12em] text-[#7A6455]">
                {label}
              </p>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#EADBC8] text-[#7A2E12]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div>
              <p className="font-display text-[1.75rem] leading-none tracking-tight text-[#7A2E12]">
                {value}
              </p>
              <p className="mt-1.5 text-[0.75rem] text-[#7A6455]">{hint}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Orders needing action */}
        <article className="flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
              Orders needing action
            </h2>
            <Link
              href="/dashboard/vendor/orders"
              className="font-sans text-[0.8125rem] text-[#B9733A] underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {pending.length === 0 ? (
            <p className="py-6 text-center text-[0.9375rem] text-[#7A6455]">
              Nothing to review. New orders will appear here.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-[#EADBC8]">
              {pending.slice(0, 5).map((order) => (
                <li
                  key={order._id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[0.9375rem] font-medium text-[#3B2417]">
                      {order.item?.name ?? "Item no longer available"}
                      {priceOf(order) ? (
                        <span className="ml-2 font-display text-[0.9375rem] text-[#7A2E12]">
                          ${priceOf(order).toFixed(2)}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-[0.75rem] text-[#7A6455]">
                      <CalendarDays
                        className="size-3.5 text-[#B9733A]"
                        aria-hidden="true"
                      />
                      {dateFormat.format(new Date(order.deliveryDate))}
                    </p>
                  </div>

                  <OrderActions orderId={order._id} />
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Last 7 days */}
        <article className="flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5">
          <h2 className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
            Orders, last 7 days
          </h2>

          <ul className="flex h-40 items-end justify-between gap-2">
            {week.map((d) => (
              <li
                key={d.key}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="text-[0.75rem] text-[#7A6455]">{d.count}</span>
                <div
                  className={`w-full rounded-t-lg ${
                    d.isToday ? "bg-[#7A2E12]" : "bg-[#D9B88F]"
                  }`}
                  style={{
                    height: `${Math.max((d.count / maxCount) * 100, d.count ? 8 : 3)}%`,
                  }}
                />
                <span
                  className={`text-[0.6875rem] ${
                    d.isToday
                      ? "font-medium text-[#3B2417]"
                      : "text-[#7A6455]"
                  }`}
                >
                  {d.label}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top items */}
        <article className="flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
              Top items
            </h2>
            <Link
              href="/dashboard/vendor/menu"
              className="font-sans text-[0.8125rem] text-[#B9733A] underline-offset-4 hover:underline"
            >
              Manage menu
            </Link>
          </div>

          {topItems.length === 0 ? (
            <p className="py-4 text-center text-[0.9375rem] text-[#7A6455]">
              Your best sellers will show up here.
            </p>
          ) : (
            <ol className="flex flex-col gap-3">
              {topItems.map((item, i) => (
                <li key={item.name} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EADBC8] font-display text-[0.9375rem] text-[#7A2E12]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-[0.9375rem] text-[#3B2417]">
                      {item.name}
                    </p>
                    <p className="text-[0.75rem] text-[#7A6455]">
                      {item.orders} {item.orders === 1 ? "order" : "orders"}
                    </p>
                  </div>
                  <p className="font-display text-[1.0625rem] text-[#7A2E12]">
                    ${item.revenue.toFixed(2)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </article>

        {/* Upcoming deliveries */}
        <article className="flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5">
          <h2 className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#B9733A]">
            Upcoming deliveries
          </h2>

          {upcoming.length === 0 ? (
            <p className="py-4 text-center text-[0.9375rem] text-[#7A6455]">
              No accepted orders scheduled yet.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-[#EADBC8]">
              {upcoming.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-sans text-[0.9375rem] text-[#3B2417]">
                      {order.item?.name ?? "Item no longer available"}
                    </p>
                    <p className="shrink-0 font-sans text-[0.8125rem] font-medium text-[#7A2E12]">
                      {dateFormat.format(new Date(order.deliveryDate))}
                    </p>
                  </div>
                  <p className="inline-flex items-start gap-1.5 text-[0.75rem] text-[#7A6455]">
                    <MapPin
                      className="mt-0.5 size-3.5 shrink-0 text-[#B9733A]"
                      aria-hidden="true"
                    />
                    <span className="break-words">{order.deliveryAddress}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
};

export default VendorOverviewPage;