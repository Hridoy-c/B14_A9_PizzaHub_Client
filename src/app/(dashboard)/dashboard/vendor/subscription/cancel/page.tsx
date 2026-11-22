import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export const instant = false;

const CheckoutCancelPage = () => (
  <section className="mx-auto flex w-full max-w-xl flex-col gap-6 py-6 sm:py-12">
    <article className="flex flex-col items-center gap-6 rounded-2xl border border-[#EADBC8] bg-[#FBF6EF] p-6 text-center sm:p-10">
      <span className="flex size-16 items-center justify-center rounded-full bg-[#FBE9E4] text-[#A33A1F]">
        <XCircle className="size-8" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight tracking-tight text-[#3B2417]">
          Payment cancelled
        </h1>
        <p className="mx-auto max-w-[44ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          You were not charged and your plan has not changed. You can upgrade
          whenever you are ready.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] font-medium text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to subscription
        </Link>
        <Link
          href="/dashboard/vendor"
          className="inline-flex items-center justify-center rounded-full border border-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] font-medium text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3]"
        >
          Go to dashboard
        </Link>
      </div>
    </article>
  </section>
);

export default CheckoutCancelPage;