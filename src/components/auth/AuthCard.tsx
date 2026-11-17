import React from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => {
  return (
    <div className="w-full max-w-[460px]">
      <div className="rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-6 shadow-[0_24px_60px_-32px_rgba(59,36,23,0.35)] md:p-8">
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-none tracking-tight text-[#3B2417]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 font-sans text-[0.875rem] leading-relaxed text-[#7A6455]">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-6 font-sans">{children}</div>
      </div>

      {footer ? (
        <div className="mt-4 text-center font-sans text-[0.875rem] text-[#7A6455]">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export default AuthCard;
