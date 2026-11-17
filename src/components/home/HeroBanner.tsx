import Image from "next/image";
import Link from "next/link";
import mainPizza from "../../assets/images/pizza-hero.png";

const badgeClass =
  "absolute z-30 hidden rounded-xl border border-[#EADBC8] bg-white px-3 py-2 font-sans text-[0.75rem] text-[#3B2417] shadow-md md:block";

export default function HeroBanner() {
  return (
    <section className="relative isolate w-full overflow-hidden">
      <div className="mx-auto flex w-[90vw] max-w-[1200px] flex-col items-center gap-8 pt-10 pb-14 md:gap-10 md:pt-14 md:pb-20 lg:min-h-[calc(100svh-4.25rem)] lg:justify-center lg:gap-5 lg:pt-4 lg:pb-6">
        <span className="rounded-full bg-[#3B2417] px-4 py-1.5 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-[#F5EDE3]">
          Special
        </span>

        <h1 className="bg-gradient-to-b from-[#3B2417] from-30% to-[#B9733A]/35 bg-clip-text text-center font-display text-[clamp(4.5rem,20vw,15rem)] leading-[0.85] tracking-tight text-transparent lg:text-[clamp(7rem,10vw,12rem)]">
          PIZZA
        </h1>

        <div className="relative -mt-6 w-[82%] max-w-[420px] md:-mt-16 md:w-[54%] md:max-w-[480px] lg:-mt-10 lg:w-[46%] lg:max-w-[min(540px,44vh)]">
          <div
            aria-hidden="true"
            className="absolute inset-8 -z-10 rounded-full bg-[#B9733A]/25 blur-3xl"
          />
          <Image
            src={mainPizza}
            alt="Flying pizza slices"
            width={575}
            height={691}
            priority
            sizes="(min-width: 1024px) 540px, (min-width: 768px) 480px, 82vw"
            className="h-auto w-full drop-shadow-[0_30px_25px_rgba(42,26,16,0.35)]"
          />
          <span className={`${badgeClass} -left-4 top-6`}>
            🔥 Fresh from the oven
          </span>
          <span className={`${badgeClass} -right-4 top-1/3`}>
            🧀 Extra cheese
          </span>
        </div>

        <p className="max-w-[46ch] text-center text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Hand-stretched dough, rich tomato sauce and melted mozzarella,
          delivered hot.
        </p>

        <div className="flex w-full flex-col gap-3 font-sans text-[0.875rem] sm:w-auto sm:flex-row">
          <Link
            href="/menu"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#3B2417] px-8 py-3.5 text-[#F5EDE3] shadow-[0_10px_24px_-8px_rgba(59,36,23,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] hover:shadow-[0_16px_32px_-10px_rgba(59,36,23,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
          >
            Order now
          </Link>
          <Link
            href="/menu"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#3B2417]/25 bg-transparent px-8 py-3.5 text-[#3B2417] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3B2417]/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
          >
            View menu
          </Link>
        </div>
      </div>
    </section>
  );
}
