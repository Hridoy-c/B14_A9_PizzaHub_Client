import { requireUser } from "@/lib/cors/Session";
import { getMenuCount } from "@/lib/api/menu-item";
import { getPlanStatus } from "@/lib/actions/payment";
import { FREE_PLAN_LIMIT } from "@/lib/plan";
import AddItemForm from "@/components/dashboard/vendor/AddItemForm";

export const instant = false;

const NewMenuItemPage = async () => {
  const user = await requireUser();

  const { count: activeCount } = await getMenuCount({
    vendorId: user.id,
    status: ["pending", "approved"],
  });

  const { premium: isPremium } = await getPlanStatus(user.id);

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          Add menu item
        </h1>
        <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          New items are reviewed by an admin before they go live.
        </p>
      </header>

      <AddItemForm
        activeCount={activeCount}
        isPremium={isPremium}
        limit={FREE_PLAN_LIMIT}
      />
    </section>
  );
};

export default NewMenuItemPage;