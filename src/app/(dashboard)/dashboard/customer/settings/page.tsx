import { requireUser } from "@/lib/cors/Session";
import EditNameDialog from "@/components/dashboard/customer/settings/EditNameDialog";
import ChangePasswordDialog from "@/components/dashboard/customer/settings/ChangePasswordDialog";
import SignOutOthersDialog from "@/components/dashboard/customer/settings/SignOutOthersDialog";
import DeleteAccountDialog from "@/components/dashboard/customer/settings/DeleteAccountDialog";

// Reads the session, so it cannot be prerendered.
export const instant = false;

const Group = ({
  title,
  description,
  danger = false,
  children,
}: {
  title: string;
  description: string;
  danger?: boolean;
  children: React.ReactNode;
}) => (
  <article
    className={`overflow-hidden rounded-2xl border ${
      danger
        ? "border-[#E8C4BA] bg-[#FDF6F3]"
        : "border-[#EADBC8] bg-[#FBF6EF]"
    }`}
  >
    <div
      className={`border-b px-5 py-4 ${
        danger ? "border-[#E8C4BA]" : "border-[#EADBC8]"
      }`}
    >
      <h2
        className={`font-sans text-[0.9375rem] font-semibold ${
          danger ? "text-[#A33A1F]" : "text-[#3B2417]"
        }`}
      >
        {title}
      </h2>
      <p className="mt-0.5 text-[0.8125rem] text-[#7A6455]">{description}</p>
    </div>
    <div
      className={`flex flex-col divide-y px-5 ${
        danger ? "divide-[#E8C4BA]" : "divide-[#EADBC8]"
      }`}
    >
      {children}
    </div>
  </article>
);

const Row = ({
  title,
  value,
  action,
}: {
  title: string;
  value: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-[0.8125rem] text-[#7A6455]">{title}</p>
      <p className="mt-0.5 break-words text-[0.9375rem] font-medium text-[#3B2417]">
        {value}
      </p>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

const initialsOf = (name?: string | null, email?: string | null) => {
  const source = (name?.trim() || email || "?").split(/\s+/);
  return source
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const CustomerSettingsPage = async () => {
  const user = await requireUser();

  return (
    <section className="flex min-w-0 max-w-3xl flex-col gap-8">
      <header className="flex items-center gap-4">
        <span
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#7A2E12] font-display text-[1.25rem] text-[#FBF6EF]"
          aria-hidden="true"
        >
          {initialsOf(user.name, user.email)}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
            Settings
          </h1>
          <p className="mt-2 truncate text-[0.9375rem] text-[#7A6455]">
            {user.name || "Your account"} · {user.email}
          </p>
        </div>
      </header>

      <Group
        title="Account"
        description="The details attached to your orders and receipts."
      >
        <Row
          title="Name"
          value={user.name || "Not set"}
          action={<EditNameDialog name={user.name ?? ""} />}
        />
        <Row title="Email" value={user.email} />
      </Group>

      <Group
        title="Security"
        description="Keep your account protected and control where you are signed in."
      >
        <Row
          title="Password"
          value="••••••••••"
          action={<ChangePasswordDialog />}
        />
        <Row
          title="Other devices"
          value="Sign out everywhere except this device"
          action={<SignOutOthersDialog />}
        />
      </Group>

      <Group
        danger
        title="Danger zone"
        description="Actions here cannot be undone."
      >
        <Row
          title="Delete account"
          value="Permanently remove your account and personal data"
          action={<DeleteAccountDialog />}
        />
      </Group>
    </section>
  );
};

export default CustomerSettingsPage;