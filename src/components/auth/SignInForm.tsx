"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialAuthButtons from "./SocialAuthButtons";
import {
  iconClass,
  iconInputClass,
  labelClass,
  submitClass,
} from "./field-styles";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    console.log("submit values:", { name, email });
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

        <button type="submit" className={`${submitClass} mt-1`}>
          Sign in
        </button>
      </form>

      <SocialAuthButtons />
    </div>
  );
};

export default SignInForm;
