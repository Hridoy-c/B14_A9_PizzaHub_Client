import { BadgeCheck, Check, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/cors/Session";
import { getPlanStatus } from "@/lib/actions/payment";
import BuyPlanButton from "@/components/dashboard/vendor/subscription/BuyPlanButton";

export const instant = false;

const PLAN = {
  name: "Vendor Plan",
  price: 49,
  tagline: "One payment. No renewals, no monthly fees.",
  features: [
    "Unlimited menu items on the PizzaHub marketplace",
    "Receive and manage customer orders",
    "Vendor dashboard with order and revenue summary",
    "Email support",
  ],
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const VendorSubscriptionPage = async () => {
  const user = await requireUser();

  const { premium: hasPurchased } = await getPlanStatus(user.id);

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
            Subscription
          </h1>
          <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
            Unlock unlimited menu items with a single payment.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8125rem] font-medium ring-1 ring-inset ${
            hasPurchased
              ? "bg-[#EAF3EC] text-[#2F6B3F] ring-[#2F6B3F]/25"
              : "bg-[#FBF1DC] text-[#8A5A00] ring-[#E0A93B]/40"
          }`}
        >
          {hasPurchased ? (
            <BadgeCheck className="size-4" aria-hidden="true" />
          ) : null}
          {hasPurchased ? "Plan active" : "Free plan"}
        </span>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="flex flex-col gap-6 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">
                {PLAN.name}
              </h2>
              <span className="rounded-full bg-[#EADBC8] px-2.5 py-0.5 text-[0.75rem] font-medium text-[#7A2E12]">
                One-time payment
              </span>
            </div>
            <p className="text-[0.8125rem] text-[#7A6455]">{PLAN.tagline}</p>
          </div>

          <p className="flex items-end gap-2">
            <span className="font-display text-[2.75rem] leading-none tracking-tight text-[#3B2417]">
              {money(PLAN.price)}
            </span>
            <span className="pb-1 text-[0.8125rem] text-[#7A6455]">
              paid once
            </span>
          </p>

          <div className="border-t border-[#EADBC8] pt-5">
            <p className="mb-3 text-[0.8125rem] font-medium text-[#3B2417]">
              What is included
            </p>
            <ul className="flex flex-col gap-3">
              {PLAN.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-[0.875rem] text-[#3B2417]"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EAF3EC] text-[#2F6B3F]">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <aside className="flex flex-col gap-5 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-6 lg:sticky lg:top-6">
          <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">
            Order summary
          </h2>

          <dl className="flex flex-col gap-3 text-[0.875rem]">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[#7A6455]">{PLAN.name}</dt>
              <dd className="tabular-nums text-[#3B2417]">
                {money(PLAN.price)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[#7A6455]">Account</dt>
              <dd className="min-w-0 truncate text-right text-[#3B2417]">
                {user.email}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-[#EADBC8] pt-3">
              <dt className="font-semibold text-[#3B2417]">Total</dt>
              <dd className="font-display text-[1.5rem] tabular-nums text-[#7A2E12]">
                {money(PLAN.price)}
              </dd>
            </div>
          </dl>

          {hasPurchased ? (
            <p className="rounded-xl bg-[#EAF3EC] px-4 py-3 text-[0.875rem] text-[#2F6B3F]">
              You already own the {PLAN.name}. There is nothing more to pay.
            </p>
          ) : (
            <BuyPlanButton price={PLAN.price} />
          )}

          <p className="flex items-start gap-2 text-[0.75rem] leading-relaxed text-[#7A6455]">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-[#2F6B3F]"
              aria-hidden="true"
            />
            You will be taken to a secure checkout page to complete your
            payment.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default VendorSubscriptionPage;