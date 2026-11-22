"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F5EDE3] px-6 py-16 text-center">
      <h1 className="font-display text-[clamp(1.75rem,1.4rem+2vw,2.75rem)] uppercase leading-none tracking-tight text-[#3B2417]">
        Something went wrong
      </h1>
      <p className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
        We could not load this page. Please try again, or head back home.
      </p>
      <div className="flex flex-col gap-3 font-sans text-[0.875rem] sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#3B2417] px-8 py-3 text-[#F5EDE3] transition-colors hover:bg-[#2A1A10]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#3B2417]/25 px-8 py-3 text-[#3B2417] transition-colors hover:bg-[#3B2417]/5"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}