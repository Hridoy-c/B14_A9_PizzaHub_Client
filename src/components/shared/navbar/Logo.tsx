import Link from "next/link";

type Tone = "dark" | "light";

const MARK_COLORS: Record<Tone, { body: string; dots: string; crust: string }> = {
  dark: { body: "#3B2417", dots: "#F5EDE3", crust: "#B9733A" },
  light: { body: "#F5EDE3", dots: "#3B2417", crust: "#B9733A" },
};

export const PizzaMark = ({
  tone = "dark",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) => {
  const c = MARK_COLORS[tone];

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
    >
      <path d="M16 3.5 27.8 26.6Q16 30.6 4.2 26.6Z" fill={c.body} />
      <path
        d="M4.2 26.6Q16 30.6 27.8 26.6L26.78 24.6Q16 25.4 5.22 24.6Z"
        fill={c.crust}
      />
      <circle cx="16" cy="11.4" r="1.7" fill={c.dots} />
      <circle cx="12" cy="18.6" r="1.45" fill={c.dots} />
      <circle cx="20" cy="18.2" r="1.45" fill={c.dots} />
    </svg>
  );
};

type LogoProps = {
  href?: string;
  tone?: Tone;
  onClick?: () => void;
  className?: string;
};

const Logo = ({ href = "/", tone = "dark", onClick, className = "" }: LogoProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="PizzaHub home"
      className={`flex items-center gap-2 ${className}`}
    >
      <PizzaMark
        tone={tone}
        className="size-6 shrink-0 md:size-7"
      />
      <span
        className={`font-display text-[clamp(1.4rem,1.15rem+1.1vw,1.75rem)] leading-none tracking-tight ${
          tone === "light" ? "text-[#F5EDE3]" : "text-[#3B2417]"
        }`}
      >
        Pizza<span className="text-[#B9733A]">Hub</span>
      </span>
    </Link>
  );
};

export default Logo;
