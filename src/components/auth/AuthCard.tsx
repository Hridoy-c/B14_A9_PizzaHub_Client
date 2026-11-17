import React from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Width of the card, e.g. `max-w-[560px]`. */
  maxWidthClass?: string;
};

const AuthCard = ({
  title,
  subtitle,
  children,
  footer,
  maxWidthClass = "max-w-[460px]",
}: AuthCardProps) => {
  return (
    <div className={`w-full ${maxWidthClass}`}>
      <div className="rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-5 shadow-[0_24px_60px_-32px_rgba(59,36,23,0.35)] md:p-6">
        <h1 className="font-display text-[clamp(1.5rem,1.25rem+0.9vw,1.75rem)] leading-none tracking-tight text-[#3B2417]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 font-sans text-[0.8125rem] leading-snug text-[#7A6455]">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-4 font-sans">{children}</div>
      </div>

      {footer ? (
        <div className="mt-3 text-center font-sans text-[0.8125rem] text-[#7A6455]">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export default AuthCard;
