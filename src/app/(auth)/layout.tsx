import Link from "next/link";
import Logo from "@/components/shared/navbar/Logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col bg-[#F5EDE3]">
      <header className="mx-auto flex w-[90vw] max-w-[1200px] items-center justify-between py-5">
        <Logo />
        <Link
          href="/"
          className="font-sans text-[0.8125rem] text-[#7A6455] transition-colors hover:text-[#B9733A]"
        >
          Back to home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12 pt-2">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
