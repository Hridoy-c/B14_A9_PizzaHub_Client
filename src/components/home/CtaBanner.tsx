import Image from "next/image";
import Link from "next/link";
import sliceLeft from "../../assets/images/pizza-slice-left.png";
import sliceRight from "../../assets/images/pizza-slice-right.png";


const sideSliceClass =
  "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none drop-shadow-[0_26px_30px_rgba(42,26,16,0.28)] lg:block";

export default function CtaBanner() {
  return (
    <section className="overflow-hidden bg-[#F5EDE3] py-16 md:py-24">
      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        {/* Left image */}
       <Image
            src={sliceLeft}
            alt=""
            aria-hidden="true"
            width={440}
            height={457}
            sizes="190px"
            className={`${sideSliceClass} right-full mr-4 w-[150px] -rotate-[6deg] xl:mr-10 xl:w-[190px]`}
          />
          <Image
            src={sliceRight}
            alt=""
            aria-hidden="true"
            width={403}
            height={595}
            sizes="170px"
            className={`${sideSliceClass} left-full ml-4 w-[140px] rotate-[5deg] scale-x-[-1] xl:ml-10 xl:w-[175px]`}
          />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Tilted banners */}
          <div className="flex flex-col items-center pt-10 md:pt-6">
            <h2 className="font-display -rotate-2 rounded-lg bg-[#3B2417] px-6 py-3 text-[clamp(1.75rem,1.4rem+2vw,2.75rem)] uppercase leading-none tracking-tight text-[#F5EDE3] md:px-10 md:py-4">
              Make your pizza
            </h2>
            <h2 className="font-display -mt-1 rotate-1 rounded-xl bg-[#B9733A] px-6 py-3 text-[clamp(1.75rem,1.4rem+2vw,2.75rem)] uppercase leading-none tracking-tight text-[#F5EDE3] md:px-10 md:py-4">
              night special
            </h2>
          </div>

          {/* Text */}
          <p className="mt-10 max-w-sm text-[0.9375rem] leading-relaxed text-[#7A6455] md:mt-14">
            Every night deserves a better pizza, one that feels fresh,
            indulgent, and made with intention.
          </p>

          {/* Button */}
          <Link
            href="/menu"
            className="font-sans mt-8 inline-flex items-center rounded-full bg-[#B9733A] px-8 py-3 text-[0.875rem] uppercase tracking-wide text-[#F5EDE3] transition-colors duration-300 hover:bg-[#2A1A10] md:text-[1rem]"
          >
            Order now
          </Link>
        </div>
      </div>
    </section>
  );
}