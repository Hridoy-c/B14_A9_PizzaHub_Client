import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { requireUser } from "@/lib/cors/Session";
import { getAllOrdersForAdmin } from "@/lib/api/orders";
import { getAllMenuForAdmin } from "@/lib/api/menu-item";
import { getAllUsersForAdmin } from "@/lib/api/Users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const instant = false;

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

const dayLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  timeZone: "UTC",
});

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (d: Date) =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

const priceOf = (o: { item?: { price?: number } | null }) =>
  typeof o.item?.price === "number" ? o.item.price : 0;

const within = (iso: string | Date, from: number, to: number) => {
  const t = new Date(iso).getTime();
  return t >= from && t < to;
};

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? null : Infinity;
  return ((current - previous) / previous) * 100;
};

const STATUSES = [
  {
    key: "pending",
    label: "Pending",
    color: "#E0A93B",
    badge: "bg-[#FBF1DC] text-[#8A5A00] ring-[#E0A93B]/40",
  },
  {
    key: "accepted",
    label: "Accepted",
    color: "#7A2E12",
    badge: "bg-[#EAF3EC] text-[#2F6B3F] ring-[#2F6B3F]/25",
  },
  {
    key: "rejected",
    label: "Rejected",
    color: "#B9733A",
    badge: "bg-[#FBE9E4] text-[#A33A1F] ring-[#A33A1F]/25",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    color: "#D9B88F",
    badge: "bg-[#F1ECE4] text-[#7A6455] ring-[#7A6455]/25",
  },
] as const;

const statusMeta = (status: string) =>
  STATUSES.find((s) => s.key === status) ?? STATUSES[3];

const Trend = ({ change }: { change: number | null }) => {
  if (change === null) {
    return (
      <span className="text-[0.75rem] text-[#7A6455]">
        No activity in either period
      </span>
    );
  }

  if (change === Infinity) {
    return (
      <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-[#2F6B3F]">
        <TrendingUp className="size-3.5" aria-hidden="true" />
        New this week
      </span>
    );
  }

  const up = change >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex flex-wrap items-center gap-x-1 text-[0.75rem] font-medium ${
        up ? "text-[#2F6B3F]" : "text-[#A33A1F]"
      }`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {up ? "+" : ""}
      {change.toFixed(1)}%
      <span className="font-normal text-[#7A6455]">vs. prior 7 days</span>
    </span>
  );
};

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
    className={`flex min-w-0 flex-col gap-4 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-4 sm:gap-5 sm:p-5 ${className}`}
  >
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex shrink-0 items-center gap-1 font-sans text-[0.8125rem] font-medium text-[#B9733A] underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
    {children}
  </article>
);

const EmptyNote = ({ children }: { children: React.ReactNode }) => (
  <p className="py-6 text-center text-[0.875rem] text-[#7A6455]">{children}</p>
);

const StatusBadge = ({ status }: { status: string }) => {
  const meta = statusMeta(status);
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ring-1 ring-inset ${meta.badge}`}
    >
      {meta.label}
    </span>
  );
};

const AdminOverviewPage = async () => {
  const user = await requireUser();

  const [orders, users, menu] = await Promise.all([
    getAllOrdersForAdmin(),
    getAllUsersForAdmin(),
    getAllMenuForAdmin(),
  ]);

  const today = startOfUtcDay(new Date());
  const tomorrow = today + DAY_MS;
  const currentFrom = today - 6 * DAY_MS;
  const previousFrom = today - 13 * DAY_MS;

  const acceptedOrders = orders.filter((o) => o.status === "accepted");
  const sumRevenue = (from: number, to: number) =>
    acceptedOrders
      .filter((o) => within(o.createdAt, from, to))
      .reduce((sum, o) => sum + priceOf(o), 0);

  const countOrders = (from: number, to: number) =>
    orders.filter((o) => within(o.createdAt, from, to)).length;
  const countUsers = (from: number, to: number) =>
    users.filter((u) => within(u.createdAt, from, to)).length;

  const revenueNow = sumRevenue(currentFrom, tomorrow);
  const revenuePrev = sumRevenue(previousFrom, currentFrom);
  const ordersNow = countOrders(currentFrom, tomorrow);
  const ordersPrev = countOrders(previousFrom, currentFrom);
  const usersNow = countUsers(currentFrom, tomorrow);
  const usersPrev = countUsers(previousFrom, currentFrom);

  const totalRevenue = acceptedOrders.reduce((sum, o) => sum + priceOf(o), 0);
  const vendorCount = users.filter((u) => u.role === "vendor").length;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingMenu = menu.filter((m) => m.status === "pending");

  const week = Array.from({ length: 7 }, (_, i) => {
    const day = today - (6 - i) * DAY_MS;
    return {
      key: day,
      label: dayLabel.format(new Date(day)),
      orders: countOrders(day, day + DAY_MS),
      signups: countUsers(day, day + DAY_MS),
      isToday: day === today,
    };
  });
  const maxCount = Math.max(...week.flatMap((d) => [d.orders, d.signups]), 1);
  const barHeight = (n: number) =>
    `${Math.max((n / maxCount) * 100, n ? 6 : 0)}%`;

  const statusMix = STATUSES.map((s) => ({
    ...s,
    count: orders.filter((o) => o.status === s.key).length,
  }));

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  const kpis: {
    label: string;
    value: string;
    icon: LucideIcon;
    change: number | null;
    note: string;
  }[] = [
    {
      label: "Revenue (last 7 days)",
      value: money(revenueNow),
      icon: Wallet,
      change: percentChange(revenueNow, revenuePrev),
      note: `${money(totalRevenue)} all time`,
    },
    {
      label: "Orders (last 7 days)",
      value: String(ordersNow),
      icon: ClipboardList,
      change: percentChange(ordersNow, ordersPrev),
      note: `${orders.length} all time`,
    },
    {
      label: "New users (last 7 days)",
      value: String(usersNow),
      icon: Users,
      change: percentChange(usersNow, usersPrev),
      note: `${users.length} total · ${vendorCount} ${vendorCount === 1 ? "vendor" : "vendors"}`,
    },
  ];

  const firstName = user.name?.split(" ")[0] ?? "there";
  const needsAttention = pendingMenu.length + pendingOrders;

  return (
    <section className="flex min-w-0 flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
            Platform overview
          </h1>
          <p className="mt-2 max-w-[60ch] text-[0.875rem] leading-relaxed text-[#7A6455] sm:text-[0.9375rem]">
            Welcome back, {firstName}.{" "}
            {needsAttention > 0
              ? `${needsAttention} ${needsAttention === 1 ? "item needs" : "items need"} your attention.`
              : "Everything is up to date."}
          </p>
        </div>
        <p className="font-sans text-[0.8125rem] text-[#7A6455]">
          {dateFormat.format(new Date())}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, change, note }) => (
          <li
            key={label}
            className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-4 sm:gap-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-sans text-[0.8125rem] text-[#7A6455]">
                {label}
              </p>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EADBC8] text-[#7A2E12]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="truncate font-display text-[1.75rem] leading-none tracking-tight text-[#3B2417] sm:text-[2rem]">
                {value}
              </p>
              <Trend change={change} />
              <p className="text-[0.75rem] text-[#7A6455]">{note}</p>
            </div>
          </li>
        ))}

        <li className="min-w-0">
          <Link
            href="/dashboard/admin/menu-items"
            className={`flex h-full flex-col gap-3 rounded-2xl border p-4 transition-colors sm:gap-4 sm:p-5 ${
              pendingMenu.length > 0
                ? "border-[#E0A93B] bg-[#FBF1DC] hover:bg-[#F8E9C8]"
                : "border-[#EADBC8] bg-[#FBF6EF] hover:bg-[#F6EEE2]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-sans text-[0.8125rem] text-[#7A6455]">
                Menu approvals
              </p>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EADBC8] text-[#7A2E12]">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-[1.75rem] leading-none tracking-tight text-[#3B2417] sm:text-[2rem]">
                {pendingMenu.length}
              </p>
              <p className="text-[0.75rem] text-[#7A6455]">
                {pendingMenu.length > 0
                  ? "Waiting for review"
                  : "No items waiting"}
              </p>
              <p className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-[#B9733A]">
                Review menu items
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </p>
            </div>
          </Link>
        </li>
      </ul>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Activity, last 7 days">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.75rem] text-[#7A6455]">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#7A2E12]" />
              Orders
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[#D9B88F]" />
              New users
            </span>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between"
              aria-hidden="true"
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-[#EADBC8]" />
              ))}
            </div>

            <ul className="relative flex h-44 items-end justify-between gap-1.5 sm:h-52 sm:gap-3">
              {week.map((d) => (
                <li
                  key={d.key}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="flex w-full flex-1 items-end justify-center gap-0.5 sm:gap-1"
                    role="img"
                    aria-label={`${d.label}: ${d.orders} orders, ${d.signups} new users`}
                  >
                    <div
                      className="w-full max-w-5 rounded-t-md bg-[#7A2E12]"
                      style={{ height: barHeight(d.orders) }}
                      title={`${d.orders} orders`}
                    />
                    <div
                      className="w-full max-w-5 rounded-t-md bg-[#D9B88F]"
                      style={{ height: barHeight(d.signups) }}
                      title={`${d.signups} new users`}
                    />
                  </div>
                  <span
                    className={`h-4 text-[0.6875rem] sm:text-[0.75rem] ${
                      d.isToday
                        ? "font-semibold text-[#3B2417]"
                        : "text-[#7A6455]"
                    }`}
                  >
                    {d.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Order status">
          {orders.length === 0 ? (
            <EmptyNote>
              The status breakdown appears once customers place orders.
            </EmptyNote>
          ) : (
            <>
              <div
                className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#EADBC8]"
                role="img"
                aria-label={statusMix
                  .map((s) => `${s.label}: ${s.count}`)
                  .join(", ")}
              >
                {statusMix.map((s) =>
                  s.count ? (
                    <div
                      key={s.key}
                      style={{
                        width: `${(s.count / orders.length) * 100}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  ) : null,
                )}
              </div>

              <ul className="flex flex-col divide-y divide-[#EADBC8]">
                {statusMix.map((s) => (
                  <li
                    key={s.key}
                    className="flex items-center justify-between gap-3 py-2.5 text-[0.875rem] first:pt-0 last:pb-0"
                  >
                    <span className="inline-flex items-center gap-2 text-[#3B2417]">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: s.color }}
                        aria-hidden="true"
                      />
                      {s.label}
                    </span>
                    <span className="shrink-0 tabular-nums text-[#7A6455]">
                      <span className="font-medium text-[#3B2417]">
                        {s.count}
                      </span>{" "}
                      ({((s.count / orders.length) * 100).toFixed(0)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card
          title="Latest orders"
          action={{
            href: "/dashboard/admin/transactions",
            label: "All transactions",
          }}
        >
          {recentOrders.length === 0 ? (
            <EmptyNote>No orders yet. New orders will be listed here.</EmptyNote>
          ) : (
            <>
              <ul className="flex flex-col divide-y divide-[#EADBC8] sm:hidden">
                {recentOrders.map((order) => (
                  <li
                    key={order._id}
                    className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 break-words text-[0.875rem] font-medium text-[#3B2417]">
                        {order.item?.name ?? "Item no longer available"}
                      </p>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[0.8125rem]">
                      <span className="text-[#7A6455]">
                        {shortDate.format(new Date(order.createdAt))}
                      </span>
                      <span className="tabular-nums font-medium text-[#3B2417]">
                        {money(priceOf(order))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#EADBC8] hover:bg-transparent">
                      <TableHead className="text-[#7A6455]">Item</TableHead>
                      <TableHead className="text-[#7A6455]">Placed</TableHead>
                      <TableHead className="text-[#7A6455]">Status</TableHead>
                      <TableHead className="text-right text-[#7A6455]">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        className="border-[#EADBC8] hover:bg-[#F6EEE2]"
                      >
                        <TableCell className="max-w-40 truncate font-medium text-[#3B2417] lg:max-w-48">
                          {order.item?.name ?? "Item no longer available"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-[#7A6455]">
                          {shortDate.format(new Date(order.createdAt))}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-[#3B2417]">
                          {money(priceOf(order))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </Card>

        <Card
          title="Needs attention"
          action={{ href: "/dashboard/admin/users", label: "Manage users" }}
        >
          <ul className="flex flex-col divide-y divide-[#EADBC8]">
            <li className="flex items-center justify-between gap-3 py-3 first:pt-0">
              <div className="min-w-0">
                <p className="text-[0.875rem] font-medium text-[#3B2417]">
                  Menu items awaiting approval
                </p>
                <p className="text-[0.75rem] text-[#7A6455]">
                  Vendors cannot list these until approved.
                </p>
              </div>
              <Link
                href="/dashboard/admin/menu-items"
                className={`shrink-0 rounded-full px-3 py-1 text-[0.8125rem] font-semibold tabular-nums ${
                  pendingMenu.length > 0
                    ? "bg-[#E0A93B] text-[#3B2417]"
                    : "bg-[#EADBC8] text-[#7A6455]"
                }`}
              >
                {pendingMenu.length}
              </Link>
            </li>
            <li className="flex items-center justify-between gap-3 py-3 last:pb-0">
              <div className="min-w-0">
                <p className="text-[0.875rem] font-medium text-[#3B2417]">
                  Orders pending vendor decision
                </p>
                <p className="text-[0.75rem] text-[#7A6455]">
                  Across all vendors.
                </p>
              </div>
              <Link
                href="/dashboard/admin/transactions"
                className={`shrink-0 rounded-full px-3 py-1 text-[0.8125rem] font-semibold tabular-nums ${
                  pendingOrders > 0
                    ? "bg-[#E0A93B] text-[#3B2417]"
                    : "bg-[#EADBC8] text-[#7A6455]"
                }`}
              >
                {pendingOrders}
              </Link>
            </li>
          </ul>

          {pendingMenu.length > 0 ? (
            <div className="flex flex-col gap-2 border-t border-[#EADBC8] pt-4">
              <p className="text-[0.75rem] font-medium text-[#7A6455]">
                Oldest in the queue
              </p>
              <ul className="flex flex-col gap-1.5">
                {pendingMenu.slice(0, 3).map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between gap-3 text-[0.875rem]"
                  >
                    <span className="min-w-0 truncate text-[#3B2417]">
                      {item.name}
                    </span>
                    {typeof item.price === "number" ? (
                      <span className="shrink-0 tabular-nums text-[#7A6455]">
                        {money(item.price)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </div>
    </section>
  );
};

export default AdminOverviewPage;