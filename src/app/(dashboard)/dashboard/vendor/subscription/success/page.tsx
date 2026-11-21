import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { requireUser } from "@/lib/cors/Session";
import { checkoutVerify } from "@/lib/actions/payment";

export const instant = false;

const PLAN_NAME = "Vendor Plan";

const NEXT_STEPS = [
  {
    title: "Add your first menu item",
    description: "Upload a photo, set a price and describe your dish.",
  },
  {
    title: "Wait for approval",
    description: "Our team reviews each new item before it goes live.",
  },
  {
    title: "Start receiving orders",
    description: "Accept or reject orders from your vendor dashboard.",
  },
];

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

const CheckOutSuccessPage = async ({ searchParams }: Props) => {
  await connection();

  const user = await requireUser();
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) redirect("/dashboard/vendor/subscription");

  const result = await checkoutVerify(sessionId);

  if (!result?.success || result.userId !== user.id) {
    redirect("/dashboard/vendor/subscription");
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 py-6 sm:py-12">
      <article className="flex flex-col items-center gap-6 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-6 text-center sm:p-10">
        <span className="flex size-16 items-center justify-center rounded-full bg-[#EAF3EC] text-[#2F6B3F]">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight tracking-tight text-[#3B2417]">
            Payment successful
          </h1>
          <p className="mx-auto max-w-[44ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
            Thank you for your purchase. Your {PLAN_NAME} is now active and your
            vendor account is ready to use.
          </p>
        </div>

        <dl className="w-full divide-y divide-[#EADBC8] rounded-xl border border-[#EADBC8] bg-white/60 text-left text-[0.875rem]">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-[#7A6455]">Plan</dt>
            <dd className="font-medium text-[#3B2417]">{PLAN_NAME}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-[#7A6455]">Account</dt>
            <dd className="min-w-0 truncate font-medium text-[#3B2417]">
              {user.email}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-[#7A6455]">Payment type</dt>
            <dd className="font-medium text-[#3B2417]">One-time</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-[#7A6455]">Status</dt>
            <dd>
              <span className="inline-flex rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[0.75rem] font-medium text-[#2F6B3F] ring-1 ring-inset ring-[#2F6B3F]/25">
                Paid
              </span>
            </dd>
          </div>
        </dl>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/vendor"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] font-medium text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
          >
            Go to dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/dashboard/vendor/menu/new"
            className="inline-flex items-center justify-center rounded-full border border-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] font-medium text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
          >
            Add a menu item
          </Link>
        </div>
      </article>

      <article className="flex flex-col gap-4 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-6">
        <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">
          What happens next
        </h2>
        <ol className="flex flex-col gap-4">
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EADBC8] font-display text-[0.875rem] text-[#7A2E12]">
                {i + 1}
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-[#3B2417]">
                  {step.title}
                </p>
                <p className="text-[0.8125rem] text-[#7A6455]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
};

export default CheckOutSuccessPage;