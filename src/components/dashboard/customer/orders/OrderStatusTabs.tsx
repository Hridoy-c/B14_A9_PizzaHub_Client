import Link from "next/link";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

type Props = {
  active: OrderStatus | "all";
  total: number;
  counts: Record<OrderStatus, number>;
  basePath?: string;
};

const OrderStatusTabs = ({ active, total, counts, basePath = "/dashboard/customer/orders", }: Props) => {
  const tabs = ["all", ...ORDER_STATUSES] as const;

  return (
    <nav
      aria-label="Filter orders by status"
      className="flex flex-wrap gap-2 font-sans text-[0.875rem]"
    >
      {tabs.map((tab) => {
        const selected = tab === active;
        const count = tab === "all" ? total : counts[tab];

        return (
          <Link
            key={tab}
                       href={tab === "all" ? basePath : `${basePath}?status=${tab}`}
            aria-current={selected ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 capitalize transition-colors ${
              selected
                ? "border-[#3B2417] bg-[#3B2417] text-[#F5EDE3]"
                : "border-[#EADBC8] text-[#3B2417] hover:border-[#3B2417]"
            }`}
          >
            {tab}
            <span
              className={`rounded-full px-1.5 text-[0.75rem] ${
                selected ? "bg-[#F5EDE3]/20" : "text-[#7A6455]"
              }`}
            >
              {count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default OrderStatusTabs;