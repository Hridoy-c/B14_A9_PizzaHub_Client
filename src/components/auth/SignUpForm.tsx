"use client";

import React, { useState } from "react";
import { Camera, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordRequirements from "./PasswordRequirements";
import SocialAuthButtons from "./SocialAuthButtons";
import {
  iconClass,
  iconInputClass,
  labelClass,
  submitClass,
} from "./field-styles";

const roles = [
  { value: "customer", label: "Customer", hint: "I order pizza" },
  { value: "vendor", label: "Vendor", hint: "I sell pizza" },
  { value: "admin", label: "Admin", hint: "I run the site" },
] as const;

type Role = (typeof roles)[number]["value"];

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [imageName, setImageName] = useState("");
  const [role, setRole] = useState<Role>("customer");

  return (
    <div className="flex flex-col gap-2.5">
      <form
        className="flex flex-col gap-2.5"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>I am a</span>

          <div
            role="radiogroup"
            aria-label="Account role"
            className="grid grid-cols-3 gap-2"
          >
            {roles.map((item) => {
              const selected = role === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setRole(item.value)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] ${
                    selected
                      ? "border-[#3B2417] bg-[#3B2417] shadow-[0_10px_24px_-12px_rgba(59,36,23,0.75)]"
                      : "border-[#EADBC8] bg-white hover:border-[#B9733A]/60 hover:bg-[#F5EDE3]"
                  }`}
                >
                  <span
                    className={`text-[0.8125rem] font-semibold ${
                      selected ? "text-[#F5EDE3]" : "text-[#3B2417]"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-[0.6875rem] leading-tight ${
                      selected ? "text-[#F5EDE3]/70" : "text-[#7A6455]"
                    }`}
                  >
                    {item.hint}
                  </span>
                </button>
              );
            })}
          </div>

          <input type="hidden" name="role" value={role} />
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-name" className={labelClass}>
              Full name
            </Label>
            <div className="relative">
              <User className={`${iconClass} left-3`} aria-hidden="true" />
              <Input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Rahim Uddin"
                className={iconInputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-email" className={labelClass}>
              Email
            </Label>
            <div className="relative">
              <Mail className={`${iconClass} left-3`} aria-hidden="true" />
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={iconInputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password" className={labelClass}>
            Password
          </Label>
          <div className="relative">
            <Lock className={`${iconClass} left-3`} aria-hidden="true" />
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
          <PasswordRequirements value={password} compact />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-image" className={labelClass}>
            Profile image
          </Label>
          <label
            htmlFor="signup-image"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-[#EADBC8] bg-white px-2.5 py-1.5 transition-colors hover:border-[#B9733A]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F5EDE3] text-[#B9733A]">
              <Camera className="size-4" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[0.8125rem] font-medium text-[#3B2417]">
                {imageName || "Upload a profile image"}
              </span>
              <span className="text-[0.6875rem] text-[#A08C7B]">
                PNG or JPG, up to 2MB
              </span>
            </span>
            <input
              id="signup-image"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) =>
                setImageName(event.target.files?.[0]?.name ?? "")
              }
            />
          </label>
        </div>

        <button type="submit" className={submitClass}>
          Create account
        </button>
      </form>

      <SocialAuthButtons />
    </div>
  );
};

export default SignUpForm;
