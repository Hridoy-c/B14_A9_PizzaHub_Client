"use client";

import Marquee from "react-fast-marquee";

const testimonials = [
  {
    quote:
      "Every slice from PizzaHub tastes like a little celebration. The crust is crisp, the cheese is rich, and it arrives hot every single time.",
    author: "A Satisfied Customer",
  },
  {
    quote:
      "PizzaHub completely changed how I see pizza night. The dough, the sauce, the balance. Everything feels intentional, and it's not just dinner, it's something I look forward to.",
    author: "A Regular Customer",
  },
  {
    quote:
      "I never knew delivery pizza could be this good. The fresh toppings and the perfect bake make it my go-to for every occasion.",
    author: "A Loyal Patron",
  },
  {
    quote:
      "The wood-fired flavor and the generous toppings elevate my weekends. I can't imagine ordering from anywhere else anymore.",
    author: "A Happy Foodie",
  },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="size-4 fill-[#B9733A]"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#F5EDE3] py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto mb-10 flex max-w-7xl flex-col gap-4 px-4 md:mb-14 md:flex-row md:items-end md:justify-between md:px-8">
        <h2 className="font-display max-w-md text-[clamp(1.75rem,1.4rem+2vw,2.75rem)] leading-[1.05] tracking-tight text-[#3B2417]">
          Loved by every pizza moment
        </h2>
        <p className="max-w-xs text-[0.9375rem] text-[#7A6455]">
          Real experiences from people who made PizzaHub part of their weekly
          ritual.
        </p>
      </div>

      {/* Marquee */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Marquee speed={40} pauseOnHover gradient={false}>
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="mr-5 flex min-h-[260px] w-[300px] flex-col justify-between rounded-3xl border border-[#EADBC8] bg-white/60 p-6 md:w-[380px]"
            >
              <div className="space-y-5">
                <Stars />
                <blockquote className="text-[0.9375rem] leading-relaxed text-[#2A1A10]">
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="font-sans text-[0.75rem] text-[#B9733A]">
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </div>
    </section>
  );
}