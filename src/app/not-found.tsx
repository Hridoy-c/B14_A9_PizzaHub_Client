import Link from "next/link";
import Logo from "@/components/shared/navbar/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F5EDE3] px-6 py-16 text-center">
      <Logo />

      <p className="font-display text-[clamp(5rem,18vw,11rem)] leading-none tracking-tight text-[#3B2417]">
        404
      </p>

      <div className="-mt-4">
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+2vw,2.75rem)] uppercase leading-none tracking-tight text-[#3B2417]">
          This slice is missing
        </h1>
        <p className="mx-auto mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          The page you are looking for was eaten, moved, or never came out of the
          oven.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 font-sans text-[0.875rem] sm:w-auto sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#3B2417] px-8 py-3.5 text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
        >
          Back home
        </Link>
        <Link
          href="/menu"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#3B2417]/25 px-8 py-3.5 text-[#3B2417] transition-colors hover:bg-[#3B2417]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
        >
          Browse menu
        </Link>
      </div>
    </main>
  );
}
