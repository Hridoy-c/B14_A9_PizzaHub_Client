import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SignInForm from "@/components/auth/SignInForm";
import { linkClass } from "@/components/auth/field-styles";

export const metadata: Metadata = {
  title: "Sign in · PizzaHub",
  description: "Sign in to order your favourite pizza.",
};

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to order your favourite pizza in a few taps."
      footer={
        <>
          New to PizzaHub?{" "}
          <Link href="/sign-up" className={linkClass}>
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
