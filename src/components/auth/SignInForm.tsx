"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialAuthButtons from "./SocialAuthButtons";
import {
  iconClass,
  iconInputClass,
  labelClass,
  submitClass,
} from "./field-styles";
import { authClient } from "@/lib/auth-client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignInForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email) {
      toast.error("Email is required", {
        description: "Enter the email you signed up with.",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      toast.error("That email does not look right", {
        description: "Use a valid address like you@example.com.",
      });
      return;
    }

    if (!password) {
      toast.error("Password is required", {
        description: "Enter the password for your account.",
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Signing you in…");

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      toast.dismiss(loadingToast);

      if (signInError) {
        toast.error("Could not sign you in", {
          description: signInError.message ?? "Invalid email or password.",
        });
        return;
      }

      const firstName = data?.user?.name?.split(" ")[0];
      const name = firstName || data?.user?.name;

      toast.success(name ? `Welcome back, ${name}!` : "Welcome back!", {
        description: "You are signed in. Taking you to the menu…",
        duration: 4000,
      });

      router.push("/");
      router.refresh();
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong", {
        description: "We could not reach the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signin-email" className={labelClass}>
            Email
          </Label>
          <div className="relative">
            <Mail className={`${iconClass} left-3`} aria-hidden="true" />
            <Input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              className={iconInputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password" className={labelClass}>
              Password
            </Label>
            <button
              type="button"
              className="text-[0.75rem] font-medium text-[#B9733A] underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className={`${iconClass} left-3`} aria-hidden="true" />
            <Input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`${iconInputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A08C7B] transition-colors hover:text-[#3B2417]"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`${submitClass} mt-1 gap-2 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <SocialAuthButtons />
    </div>
  );
};

export default SignInForm;
