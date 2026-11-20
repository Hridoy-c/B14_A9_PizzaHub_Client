import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-[#F2C14E]/25 text-[#7A5A00]",
  accepted: "bg-[#5B7F3A]/15 text-[#3F7A2C]",
  rejected: "bg-[#B23B2E]/10 text-[#B23B2E]",
  cancelled: "bg-[#EADBC8] text-[#7A6455]",
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`rounded-full px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-wide ${styles[status]}`}
  >
    {status}
  </span>
);

export default OrderStatusBadge;