import { getAllTransactionsForAdmin } from "@/lib/api/transactions";
import TransactionStats from "@/components/dashboard/admin/transactions/TransactionStats";
import TransactionsTable from "@/components/dashboard/admin/transactions/TransactionsTable";

export const instant = false;

const AdminTransactionsPage = async () => {
  const transactions = await getAllTransactionsForAdmin();

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          Transactions
        </h1>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Every subscription payment processed through PizzaHub.
        </p>
      </header>

      <TransactionStats transactions={transactions} />
      <TransactionsTable transactions={transactions} />
    </section>
  );
};

export default AdminTransactionsPage;