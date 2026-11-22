import { BadgeCheck, Check, Crown } from "lucide-react";
import { requireUser } from "@/lib/cors/Session";
import { getPlanStatus } from "@/lib/actions/payment";
import BuyPlanButton from "@/components/dashboard/vendor/subscription/BuyPlanButton";
import CancelSubscriptionButton from "@/components/dashboard/vendor/subscription/CancelSubscriptionButton";

export const instant = false;

const PREMIUM_PRICE = 49;

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge on your dishes",
  "Featured placement on the homepage",
  "Everything in Free",
];

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Features = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-3">
    {items.map((feature) => (
      <li key={feature} className="flex items-start gap-2.5 text-[0.875rem] text-[#3B2417]">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EAF3EC] text-[#2F6B3F]">
          <Check className="size-3.5" aria-hidden="true" />
        </span>
        {feature}
      </li>
    ))}
  </ul>
);

const CurrentPill = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[0.75rem] font-medium text-[#2F6B3F] ring-1 ring-inset ring-[#2F6B3F]/25">
    <BadgeCheck className="size-3.5" aria-hidden="true" />
    Current plan
  </span>
);

const VendorSubscriptionPage = async () => {
  const user = await requireUser();
  const { premium, expiresAt, error } = await getPlanStatus(user.id);

  return (
    <section className="flex min-w-0 flex-col gap-8">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          Subscription
        </h1>
        <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Start free, then upgrade to Premium when you need more than 3 items.
        </p>
      </header>

      <div className="grid items-stretch gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-6 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">Free</h2>
            {!premium && !error ? <CurrentPill /> : null}
          </div>
          <p className="font-display text-[2.5rem] leading-none tracking-tight text-[#3B2417]">
            $0
          </p>
          <div className="border-t border-[#EADBC8] pt-5">
            <Features items={FREE_FEATURES} />
          </div>
        </article>

        <article
          className={`flex flex-col gap-6 rounded-2xl border p-6 ${
            premium ? "border-[#2F6B3F]/40 bg-[#FBF6EF]" : "border-[#E0A93B] bg-[#FBF1DC]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-1.5 font-sans text-[0.9375rem] font-semibold text-[#3B2417]">
              <Crown className="size-4 text-[#B9733A]" aria-hidden="true" />
              Premium
            </h2>
            {premium ? <CurrentPill /> : null}
          </div>
          <p className="flex items-end gap-2">
            <span className="font-display text-[2.5rem] leading-none tracking-tight text-[#3B2417]">
              {money(PREMIUM_PRICE)}
            </span>
            <span className="pb-1 text-[0.8125rem] text-[#7A6455]">per year</span>
          </p>
          <div className="border-t border-[#EADBC8] pt-5">
            <Features items={PREMIUM_FEATURES} />
          </div>

          <div className="mt-auto flex flex-col gap-3">
            {premium ? (
              <>
                {expiresAt ? (
                  <p className="text-[0.8125rem] text-[#7A6455]">
                    Active until{" "}
                    <span className="font-medium text-[#3B2417]">
                      {dateFormat.format(new Date(expiresAt))}
                    </span>
                  </p>
                ) : null}
                <CancelSubscriptionButton />
              </>
            ) : error ? (
              <p role="alert" className="text-[0.8125rem] text-[#A33A1F]">
                Could not check your plan status. Refresh the page before
                upgrading so you are not charged twice.
              </p>
            ) : (
              <BuyPlanButton price={PREMIUM_PRICE} />
            )}
          </div>
        </article>
      </div>

      <p className="text-[0.75rem] text-[#7A6455]">
        Premium is activated only after Stripe confirms your payment. You will
        be taken to a secure checkout page.
      </p>
    </section>
  );
};

export default VendorSubscriptionPage;