import Link from "next/link";
import { requireUser } from "@/lib/cors/Session";
import { getOrdersByCustomer } from "@/lib/api/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import OrderCard from "@/components/dashboard/customer/orders/OrderCard";
import OrderStatusTabs from "@/components/dashboard/customer/orders/OrderStatusTabs";

// Reads the session, so it cannot be prerendered.
export const instant = false;

const CustomerOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  const user = await requireUser();
  const { status } = await searchParams;
  const active: OrderStatus | "all" =
    ORDER_STATUSES.find((s) => s === status) ?? "all";

  const orders = await getOrdersByCustomer(user.id);

  const counts: Record<OrderStatus, number> = {
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  };
  for (const order of orders) {
    if (order.status in counts) counts[order.status] += 1;
  }

  const visible =
    active === "all" ? orders : orders.filter((o) => o.status === active);

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          My Orders
        </h1>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Track every PizzaHub order from the oven to your door.
        </p>
      </header>

      {orders.length > 0 ? (
        <OrderStatusTabs active={active} total={orders.length} counts={counts} />
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center">
          <p className="text-[0.9375rem] text-[#7A6455]">
            {orders.length === 0
              ? "You have not placed any orders yet."
              : `No ${active} orders right now.`}
          </p>
          {orders.length === 0 ? (
            <Link
              href="/menu"
              className="mt-4 inline-flex rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
            >
              Browse the menu
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CustomerOrdersPage;