"use client";

import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type UserDetails = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";

const UserDetailsDialog = ({
  user,
  className = "",
}: {
  user: UserDetails;
  className?: string;
}) => {
  const rows = [
    { label: "User ID", value: user.id },
    { label: "Email", value: user.email },
    {
      label: "Role",
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    },
    { label: "Member since", value: dateFormat.format(new Date(user.createdAt)) },
    {
      label: "Email status",
      value: user.emailVerified ? "Verified" : "Not verified",
    },
    { label: "Account status", value: user.banned ? "Blocked" : "Active" },
    ...(user.banned && user.banReason
      ? [{ label: "Block reason", value: user.banReason }]
      : []),
    ...(user.banned && user.banExpires
      ? [
          {
            label: "Block ends",
            value: dateFormat.format(new Date(user.banExpires)),
          },
        ]
      : []),
  ];

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`View details for ${user.name}`}
            className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#EADBC8] bg-white px-3.5 py-2 font-sans text-[0.8125rem] text-[#3B2417] transition-colors hover:border-[#3B2417] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 ${className}`}
          />
        }
      >
        <Eye className="size-4 text-[#B9733A]" aria-hidden="true" />
        Details
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto rounded-3xl border-0 bg-[#FBF6EF] p-0 text-[#3B2417] ring-[#EADBC8] sm:max-w-md">
        <DialogHeader className="flex-row items-center gap-3 px-5 pb-4 pt-5 pr-12">
          <Avatar className="size-14 ring-2 ring-[#EADBC8]">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-[#3B2417] font-display text-[1.25rem] text-[#F5EDE3]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <DialogTitle className="truncate font-display text-[1.5rem] uppercase leading-none tracking-tight text-[#3B2417]">
              {user.name}
            </DialogTitle>
            <DialogDescription className="mt-1 truncate font-sans text-[0.8125rem] text-[#7A6455]">
              {user.email}
            </DialogDescription>
          </div>
        </DialogHeader>

        <dl className="grid gap-3 border-t border-[#EADBC8] p-5 sm:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-[#EADBC8] bg-white/70 p-3"
            >
              <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
                {row.label}
              </dt>
              <dd className="mt-1 break-all text-[0.875rem] text-[#3B2417]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;