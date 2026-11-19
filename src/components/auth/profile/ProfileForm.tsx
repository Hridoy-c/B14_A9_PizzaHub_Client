"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2, Mail, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { iconClass, iconInputClass, labelClass } from "@/components/auth/field-styles";
import { authClient } from "@/lib/auth-client";
import { uploadToImgbb } from "./upload-to-imgbb";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
};

type ProfileFormProps = {
  user: ProfileUser;
  /** Called after a successful save (used to close the dialog). */
  onSaved?: () => void;
  /** Called when the user cancels. */
  onCancel?: () => void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";

const cancelClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#3B2417]/20 px-5 py-2.5 font-sans text-[0.875rem] text-[#3B2417] transition-colors hover:bg-[#3B2417]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]";

const saveClass =
  "inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] text-[#F5EDE3] shadow-[0_10px_24px_-8px_rgba(59,36,23,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#3B2417]";

const ProfileForm = ({ user, onSaved, onCancel }: ProfileFormProps) => {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Revoke the last object URL when the preview changes or unmounts.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shownImage = preview ?? imageUrl;
  const initials = getInitials(name);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const emailChanged = trimmedEmail !== user.email.toLowerCase();
  const dirty =
    trimmedName !== user.name ||
    emailChanged ||
    imageUrl !== (user.image ?? "");

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadToImgbb(file);
      setImageUrl(url);
      toast.success("Photo uploaded", {
        description: "Save your changes to apply it.",
      });
    } catch (uploadError) {
      setPreview(null);
      setImageUrl(user.image ?? "");
      input.value = "";
      toast.error("Image upload failed", {
        description:
          uploadError instanceof Error
            ? uploadError.message
            : "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedName) {
      toast.error("Full name is required", {
        description: "Tell us what to call you.",
      });
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      toast.error("That email does not look right", {
        description: "Use a valid address like you@example.com.",
      });
      return;
    }

    if (uploading) {
      toast.info("Photo is still uploading", {
        description: "Give it a second, then save.",
      });
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: trimmedName,
        image: imageUrl || null,
      });

      if (updateError) {
        toast.error("Could not update your profile", {
          description: updateError.message ?? "Please try again.",
        });
        return;
      }

      if (emailChanged) {
        const { error: emailError } = await authClient.changeEmail({
          newEmail: trimmedEmail,
          callbackURL: "/profile",
        });

        if (emailError) {
          toast.error("Could not update your email", {
            description: emailError.message ?? "Please try again.",
          });
          return;
        }

        // The server updates silently when the address is free, so confirm
        // against the refreshed session before claiming success.
        const { data: session } = await authClient.getSession();
        const sessionEmail = session?.user?.email?.toLowerCase();

        if (sessionEmail === trimmedEmail) {
          toast.success("Email updated", {
            description: `You now sign in with ${trimmedEmail}.`,
          });
        } else {
          toast.info("Email change requested", {
            description:
              "That address may already be in use or needs verification. Your previous email is still active.",
          });
        }
      } else {
        toast.success("Profile updated", {
          description: "Your changes have been saved.",
        });
      }

      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      router.refresh();
      onSaved?.();
    } catch {
      toast.error("Something went wrong", {
        description: "We could not reach the server. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 font-sans">
      {/* Avatar + upload */}
      <div className="flex items-center gap-4">
        <Avatar className="size-20 ring-2 ring-[#EADBC8]">
          <AvatarImage src={shownImage || undefined} alt={trimmedName || "Profile"} />
          <AvatarFallback className="bg-[#3B2417] font-display text-[1.5rem] text-[#F5EDE3]">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="profile-image"
              className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-[#EADBC8] bg-white px-3.5 py-1.5 text-[0.8125rem] text-[#3B2417] transition-colors hover:border-[#B9733A] focus-within:ring-2 focus-within:ring-[#B9733A]/50"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin text-[#B9733A]" aria-hidden="true" />
              ) : (
                <Camera className="size-4 text-[#B9733A]" aria-hidden="true" />
              )}
              {uploading ? "Uploading…" : "Change photo"}
            </label>

            {shownImage ? (
              <button
                type="button"
                onClick={removePhoto}
                disabled={uploading || saving}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.8125rem] text-[#7A6455] transition-colors hover:text-[#B42318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 disabled:opacity-60"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Remove
              </button>
            ) : null}
          </div>

          <p className="text-[0.6875rem] text-[#A08C7B]" aria-live="polite">
            {uploading
              ? "Uploading to imgbb…"
              : "PNG or JPG, up to 2MB"}
          </p>

          <input
            ref={fileRef}
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={saving}
            className="sr-only"
          />
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profile-name" className={labelClass}>
          Full name
        </Label>
        <div className="relative">
          <User className={`${iconClass} left-3`} aria-hidden="true" />
          <Input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
            className={iconInputClass}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="profile-email" className={labelClass}>
            Email
          </Label>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EADBC8] bg-white px-2.5 py-1 text-[0.6875rem] text-[#3B2417]">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${user.emailVerified ? "bg-[#3F7A2C]" : "bg-[#B9733A]"}`}
            />
            {user.emailVerified ? "Verified" : "Not verified"}
          </span>
        </div>
        <div className="relative">
          <Mail className={`${iconClass} left-3`} aria-hidden="true" />
          <Input
            id="profile-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={saving}
            aria-describedby="profile-email-hint"
            className={iconInputClass}
          />
        </div>
        <p id="profile-email-hint" className="text-[0.6875rem] text-[#A08C7B]">
          Changing this updates the address you sign in with.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-1 flex items-center gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className={`${cancelClass} disabled:opacity-60`}
          >
            Cancel
          </button>
        ) : null}

        <button
          type="submit"
          disabled={saving || uploading || !dirty}
          aria-busy={saving}
          className={saveClass}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : uploading ? (
            "Uploading photo…"
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
