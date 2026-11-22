import { requireUser } from "@/lib/cors/Session";
import { getVendorProfile } from "@/lib/api/vendor";
import EditNameDialog from "@/components/dashboard/customer/settings/EditNameDialog";
import ChangePasswordDialog from "@/components/dashboard/customer/settings/ChangePasswordDialog";
import RestaurantProfileForm from "@/components/dashboard/vendor/settings/RestaurantProfileForm";

export const instant = false;

const Group = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <article className="overflow-hidden rounded-2xl border border-[#EADBC8] bg-[#FBF6EF]">
    <div className="border-b border-[#EADBC8] px-5 py-4">
      <h2 className="font-sans text-[0.9375rem] font-semibold text-[#3B2417]">{title}</h2>
      <p className="mt-0.5 text-[0.8125rem] text-[#7A6455]">{description}</p>
    </div>
    {children}
  </article>
);

const Row = ({
  title,
  value,
  action,
}: {
  title: string;
  value: string;
  action: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-[0.8125rem] text-[#7A6455]">{title}</p>
      <p className="mt-0.5 break-words text-[0.9375rem] font-medium text-[#3B2417]">{value}</p>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);

const VendorSettingsPage = async () => {
  const user = await requireUser();
  const profile = await getVendorProfile();

  return (
    <section className="flex min-w-0 max-w-3xl flex-col gap-8">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          Profile settings
        </h1>
        <p className="mt-2 text-[0.9375rem] text-[#7A6455]">
          {user.name} · {user.email}
        </p>
      </header>

      <Group title="Account" description="Your personal sign-in details.">
        <div className="divide-y divide-[#EADBC8]">
          <Row title="Name" value={user.name || "Not set"} action={<EditNameDialog name={user.name ?? ""} />} />
          <Row title="Password" value="••••••••••" action={<ChangePasswordDialog />} />
        </div>
      </Group>

      <Group title="Restaurant" description="Shown to customers on your dishes.">
        {profile ? (
          <RestaurantProfileForm
            initial={{
              businessName: profile.businessName,
              restaurantDescription: profile.restaurantDescription,
              restaurantAddress: profile.restaurantAddress,
              restaurantPhone: profile.restaurantPhone,
            }}
          />
        ) : (
          <p className="px-5 py-6 text-[0.875rem] text-[#7A6455]">
            Could not load your restaurant profile. Please refresh.
          </p>
        )}
      </Group>
    </section>
  );
};

export default VendorSettingsPage;