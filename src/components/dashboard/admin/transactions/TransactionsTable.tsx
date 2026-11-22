import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { formatMoney } from "@/lib/utils/money";
import type { Transaction } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const headClass =
  "h-11 px-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#7A6455]";

const cellClass = "px-4 py-3";

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";

const getPlan = (tx: Transaction) => tx.plan?.replace(/-/g, " ") ?? "premium";

const details = (tx: Transaction) => ({
  name: tx.user?.name ?? tx.userName ?? "Unknown user",
  email: tx.user?.email ?? tx.customer_email ?? "—",
  paymentId: tx.payment_intent ?? tx.sessionId,
});

const Customer = ({ tx }: { tx: Transaction }) => {
  const { name, email } = details(tx);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 shrink-0 ring-2 ring-[#EADBC8]">
        <AvatarImage src={tx.user?.image ?? undefined} alt={name} />
        <AvatarFallback className="bg-[#3B2417] font-display text-[0.9375rem] text-[#F5EDE3]">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate font-sans text-[0.9375rem] text-[#3B2417] md:max-w-[18ch]">
          {name}
        </p>
        <p className="truncate font-sans text-[0.75rem] text-[#7A6455] md:max-w-[24ch]">
          {email}
        </p>
      </div>
    </div>
  );
};

const TransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  if (transactions.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center font-sans text-[0.9375rem] text-[#7A6455]">
        No transactions yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#EADBC8] bg-[#FBF6EF]">
      <ul className="divide-y divide-[#EADBC8] lg:hidden">
        {transactions.map((tx) => {
          const { paymentId } = details(tx);

          return (
            <li key={String(tx._id)} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <Customer tx={tx} />
                <PaymentStatusBadge status={tx.payment_status} />
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-sans text-[0.8125rem]">
                <div>
                  <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                    Plan
                  </dt>
                  <dd className="mt-0.5 capitalize text-[#3B2417]">
                    {getPlan(tx)}
                  </dd>
                </div>

                <div>
                  <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                    Amount
                  </dt>
                  <dd className="mt-0.5 text-[#3B2417]">
                    {formatMoney(tx.amount, tx.currency)}
                  </dd>
                </div>

                <div>
                  <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                    Date
                  </dt>
                  <dd className="mt-0.5 text-[#3B2417]">
                    {dateFormat.format(new Date(tx.payment_date))}
                  </dd>
                </div>

                <div className="col-span-2">
                  <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                    Payment ID
                  </dt>
                  <dd className="mt-0.5 break-all text-[#7A6455]">
                    …{paymentId.slice(-12)}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto lg:block">
        <Table className="min-w-[680px]">
          <TableHeader className="bg-[#F5EDE3]">
            <TableRow className="border-[#EADBC8] hover:bg-transparent">
              <TableHead className={headClass}>Customer</TableHead>
              <TableHead className={headClass}>Plan</TableHead>
              <TableHead className={`${headClass} hidden lg:table-cell`}>
                Payment ID
              </TableHead>
              <TableHead className={headClass}>Amount</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={headClass}>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((tx) => {
              const { paymentId } = details(tx);

              return (
                <TableRow
                  key={String(tx._id)}
                  className="border-[#EADBC8] hover:bg-[#F5EDE3]/60"
                >
                  <TableCell className={cellClass}>
                    <Customer tx={tx} />
                  </TableCell>

                  <TableCell
                    className={`${cellClass} font-sans text-[0.875rem] capitalize text-[#3B2417]`}
                  >
                    {getPlan(tx)}
                  </TableCell>

                  <TableCell
                    className={`${cellClass} hidden font-sans text-[0.8125rem] tracking-wide text-[#7A6455] lg:table-cell`}
                    title={paymentId}
                  >
                    …{paymentId.slice(-12)}
                  </TableCell>

                  <TableCell
                    className={`${cellClass} font-sans text-[0.9375rem] text-[#3B2417]`}
                  >
                    {formatMoney(tx.amount, tx.currency)}
                  </TableCell>

                  <TableCell className={cellClass}>
                    <PaymentStatusBadge status={tx.payment_status} />
                  </TableCell>

                  <TableCell
                    className={`${cellClass} font-sans text-[0.875rem] text-[#7A6455]`}
                  >
                    {dateFormat.format(new Date(tx.payment_date))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTable;