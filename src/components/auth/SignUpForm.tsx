"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordRequirements from "./PasswordRequirements";
import SocialAuthButtons from "./SocialAuthButtons";
import { isPasswordValid } from "./password-rules";
import {
  iconClass,
  iconInputClass,
  labelClass,
  submitClass,
} from "./field-styles";
import { authClient } from "@/lib/auth-client";

const roles = [
  { value: "customer", label: "Customer", hint: "I order pizza" },
  { value: "vendor", label: "Vendor", hint: "I sell pizza" },
] as const;

type Role = (typeof roles)[number]["value"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const SignUpForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile image: local preview, file name, and the hosted URL from imgbb.
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const resetImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageName("");
    setImageUrl("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!name) {
      toast.error("Full name is required", {
        description: "Tell us what to call you.",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      toast.error("That email does not look right", {
        description: "Use a valid address like you@example.com.",
      });
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error("Password is too weak", {
        description:
          "Use 6+ characters with at least one uppercase and one lowercase letter.",
      });
      return;
    }

    if (isUploading) {
      toast.info("Image is still uploading", {
        description: "Give it a second, then create your account.",
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating your account…");

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      toast.dismiss(loadingToast);

      if (signUpError) {
        toast.error("Could not create your account", {
          description: signUpError.message ?? "Please try again.",
        });
        return;
      }

      const firstName = name.split(" ")[0];
      const roleLabel =
        roles.find((item) => item.value === role)?.label ?? "Customer";

      toast.success(`Welcome to PizzaHub, ${firstName}!`, {
        description: `Your ${roleLabel} account is ready. Let’s find you a pizza.`,
        duration: 6000,
        action: {
          label: "Dashboard",
          onClick: () => router.push("/dashboard"),
        },
      });

      router.push("/");

      form.reset();
      setPassword("");
      resetImage();
      setRole("customer");
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong", {
        description: "We could not reach the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target;
    const file = input.files?.[0];

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    if (!file) {
      setImagePreview(null);
      setImageName("");
      setImageUrl("");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image is too large", {
        description: "Pick a PNG or JPG that is 2MB or smaller.",
      });
      input.value = "";
      setImagePreview(null);
      setImageName("");
      setImageUrl("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setImageName(file.name);
    setImageUrl("");
    setIsUploading(true);

    try {
      if (!IMGBB_KEY) {
        throw new Error("Image upload is not configured.");
      }

      const body = new FormData();
      body.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body },
      );

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.data?.url) {
        throw new Error(result?.error?.message ?? "Upload failed");
      }

      setImageUrl(result.data.url);
    } catch (uploadError) {
      toast.error("Image upload failed", {
        description:
          uploadError instanceof Error
            ? uploadError.message
            : "Please try again.",
      });
      input.value = "";
      setImagePreview(null);
      setImageName("");
      setImageUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>I am a</span>

          <div
            role="radiogroup"
            aria-label="Account role"
            className="grid grid-cols-2 gap-2"
          >
            {roles.map((item) => {
              const selected = role === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={isSubmitting}
                  onClick={() => setRole(item.value)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] disabled:cursor-not-allowed disabled:opacity-70 ${
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[#F5EDE3] text-[#B9733A]">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <Camera className="size-4" aria-hidden="true" />
              )}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[0.8125rem] font-medium text-[#3B2417]">
                {imageName || "Upload a profile image"}
              </span>
              <span className="text-[0.6875rem] text-[#A08C7B]">
                {isUploading
                  ? "Uploading…"
                  : imageUrl
                    ? "Uploaded ✓"
                    : "PNG or JPG, up to 2MB"}
              </span>
            </span>
            <input
              onChange={handleImageChange}
              id="signup-image"
              name="image"
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              className="sr-only"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          aria-busy={isSubmitting}
          className={`${submitClass} gap-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#3B2417]`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Uploading image…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <SocialAuthButtons />
    </div>
  );
};

export default SignUpForm;
