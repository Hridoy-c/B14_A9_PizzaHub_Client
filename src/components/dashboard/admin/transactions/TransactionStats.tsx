import { CalendarClock, CheckCircle2, Receipt, Wallet } from "lucide-react";
import { formatMoney } from "@/lib/utils/money";
import type { Transaction } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const TransactionStats = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const paid = transactions.filter((t) => t.payment_status === "paid");
  const currency = transactions.find((t) => t.currency)?.currency;
  const revenue = paid.reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const latest = transactions[0]?.payment_date;

  const stats = [
    { label: "Transactions", value: String(transactions.length), icon: Receipt },
    { label: "Paid", value: String(paid.length), icon: CheckCircle2 },
    { label: "Revenue", value: formatMoney(revenue, currency), icon: Wallet },
    {
      label: "Last payment",
      value: latest ? dateFormat.format(new Date(latest)) : "—",
      icon: CalendarClock,
    },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
              {label}
            </dt>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F5EDE3] text-[#B9733A]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          <dd className="mt-3 break-words font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-none tracking-tight text-[#3B2417]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default TransactionStats;