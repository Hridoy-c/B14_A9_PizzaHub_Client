import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import SignUpForm from "@/components/auth/SignUpForm";
import { linkClass } from "@/components/auth/field-styles";

export const metadata: Metadata = {
  title: "Sign up · PizzaHub",
  description: "Create your PizzaHub account.",
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join PizzaHub to order, track and enjoy fresh pizza."
      maxWidthClass="max-w-[560px]"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className={linkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
