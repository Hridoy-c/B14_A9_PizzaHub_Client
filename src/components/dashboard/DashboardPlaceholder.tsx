import React from "react";

type DashboardPlaceholderProps = {
  title: string;
  description: string;
};

/**
 * Shared shell for dashboard pages that are not built yet. Keeps every sidebar
 * link resolvable while the real views are being written.
 */
const DashboardPlaceholder = ({ title, description }: DashboardPlaceholderProps) => {
  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          {title}
        </h1>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          {description}
        </p>
      </header>

      <div className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-8 text-[0.9375rem] leading-relaxed text-[#7A6455]">
        This page is a placeholder. The real{" "}
        <span className="text-[#3B2417]">{title.toLowerCase()}</span> view will
        live here.
      </div>
    </section>
  );
};

export default DashboardPlaceholder;
