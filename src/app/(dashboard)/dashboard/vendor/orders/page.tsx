import { requireUser } from "@/lib/cors/Session";
import { getOrdersByVendor } from "@/lib/api/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import OrderStatusTabs from "@/components/dashboard/customer/orders/OrderStatusTabs";
import VendorOrderCard from "@/components/dashboard/vendor/orders/VendorOrderCard";

// Reads the session, so it cannot be prerendered.
export const instant = false;

const VendorOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  const user = await requireUser();
  const { status } = await searchParams;
  const active: OrderStatus | "all" =
    ORDER_STATUSES.find((s) => s === status) ?? "all";

  const orders = await getOrdersByVendor(user.id);

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
          Orders
        </h1>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Accept or reject incoming customer orders for your menu items.
        </p>
      </header>

      {orders.length > 0 ? (
        <OrderStatusTabs
          active={active}
          total={orders.length}
          counts={counts}
          basePath="/dashboard/vendor/orders"
        />
      ) : null}

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center text-[0.9375rem] text-[#7A6455]">
          {orders.length === 0
            ? "No orders yet. They will show up here once customers order your items."
            : `No ${active} orders right now.`}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((order) => (
            <VendorOrderCard key={order._id} order={order} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default VendorOrdersPage;