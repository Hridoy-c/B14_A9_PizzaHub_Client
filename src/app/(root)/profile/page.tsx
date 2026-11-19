import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/cors/Session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileDialog from "@/components/auth/profile/EditProfileDialog";

// The page renders the signed-in user, so it blocks on the session read.
export const instant = false;

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

const ProfilePage = async () => {
  const user = await requireUser();
  const joined = user.createdAt
    ? dateFormat.format(new Date(user.createdAt))
    : "—";
  const role = String(user.role ?? "customer");
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="mx-auto flex w-[90vw] max-w-[900px] flex-col gap-7 py-10 md:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] uppercase leading-none tracking-tight text-[#3B2417]">
            Profile settings
          </h1>
          <p className="mt-2 font-sans text-[0.9375rem] text-[#7A6455]">
            The details tied to your PizzaHub account.
          </p>
        </div>

        <EditProfileDialog user={user} />
      </header>

      <section className="flex flex-col gap-5 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-6 sm:flex-row sm:items-center">
        <Avatar className="size-20 ring-2 ring-[#EADBC8]">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-[#3B2417] font-display text-[1.5rem] text-[#F5EDE3]">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-display text-[1.5rem] uppercase leading-none text-[#3B2417]">
            {user.name}
          </p>
          <p className="mt-1.5 truncate font-sans text-[0.875rem] text-[#7A6455]">
            {user.email}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EADBC8] bg-white px-3 py-1.5 font-sans text-[0.75rem] text-[#3B2417] sm:ml-auto">
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${user.emailVerified ? "bg-[#3F7A2C]" : "bg-[#B9733A]"}`}
          />
          {user.emailVerified ? "Email verified" : "Email not verified"}
        </span>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Name", value: user.name },
          { label: "Email", value: user.email },
          { label: "Role", value: roleLabel },
          { label: "Member since", value: joined },
          { label: "Account ID", value: user.id },
          {
            label: "Email status",
            value: user.emailVerified ? "Verified" : "Not verified",
          },
        ].map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-[#EADBC8] bg-white/70 p-4"
          >
            <dt className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]">
              {row.label}
            </dt>
            <dd className="mt-1.5 truncate text-[0.9375rem] text-[#3B2417]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <Link
        href="/dashboard"
        className="inline-flex w-fit min-h-[44px] items-center justify-center rounded-full bg-[#3B2417] px-7 py-3 font-sans text-[0.875rem] text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
      >
        Back to dashboard
      </Link>
    </div>
  );
};

export default ProfilePage;
