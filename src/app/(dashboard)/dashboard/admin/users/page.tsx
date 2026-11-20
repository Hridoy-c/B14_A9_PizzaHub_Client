import { Suspense } from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/cors/Session";
import { dashboardRole, type DashboardRole } from "@/lib/roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserSearchBar from "@/components/dashboard/admin/users/UserSearchBar";
import UserFilters from "@/components/dashboard/admin/users/UserFilters";
import UserDetailsDialog, {
  type UserDetails,
} from "@/components/dashboard/admin/users/UserDetailsDialog";
import UserBanButton from "@/components/dashboard/admin/users/UserBanButton";

type PageProps = {
  searchParams: Promise<{ q?: string; role?: string }>;
};

type UserRow = Awaited<ReturnType<typeof auth.api.listUsers>>["users"][number];

const roleValues = ["customer", "vendor", "admin"] as const;

const roleStyles: Record<DashboardRole, string> = {
  customer: "bg-[#EADBC8] text-[#7A6455]",
  vendor: "bg-[#F2813B]/15 text-[#B9733A]",
  admin: "bg-[#3B2417] text-[#F5EDE3]",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const toolbarClass =
  "flex flex-col gap-4 rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4 sm:p-5";

const headClass =
  "h-11 px-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[#7A6455]";

const cellClass = "px-4 py-3";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";

const newestFirst = (a: UserRow, b: UserRow) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const fetchUsers = async (q: string, role: string): Promise<UserRow[]> => {
  const requestHeaders = await headers();

  const base = {
    limit: 100,
    ...(role
      ? {
          filterField: "role",
          filterValue: role,
          filterOperator: "eq" as const,
        }
      : {}),
  };

  if (!q) {
    const result = await auth.api.listUsers({
      headers: requestHeaders,
      query: base,
    });

    return [...result.users].sort(newestFirst);
  }

  const [byName, byEmail] = await Promise.all(
    (["name", "email"] as const).map((field) =>
      auth.api.listUsers({
        headers: requestHeaders,
        query: {
          ...base,
          searchValue: q,
          searchField: field,
          searchOperator: "contains" as const,
        },
      }),
    ),
  );

  const merged = new Map<string, UserRow>();

  for (const user of [...byName.users, ...byEmail.users]) {
    merged.set(user.id, user);
  }

  return [...merged.values()].sort(newestFirst);
};

const toUserDetails = (user: UserRow, role: DashboardRole): UserDetails => ({
  id: user.id,
  name: user.name,
  email: user.email,
  image: user.image ?? null,
  role,
  emailVerified: user.emailVerified,
  banned: Boolean(user.banned),
  banReason: user.banReason ?? null,
  banExpires: user.banExpires ? new Date(user.banExpires).toISOString() : null,
  createdAt: new Date(user.createdAt).toISOString(),
});

const RoleBadge = ({ role }: { role: DashboardRole }) => (
  <span
    className={`rounded-full px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-wide ${roleStyles[role]}`}
  >
    {role}
  </span>
);

const StatusBadge = ({ banned }: { banned: boolean }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-wide ${
      banned
        ? "bg-[#B23B2E]/10 text-[#B23B2E]"
        : "bg-[#5B7F3A]/15 text-[#3F7A2C]"
    }`}
  >
    <span
      aria-hidden="true"
      className={`size-1.5 rounded-full ${
        banned ? "bg-[#B23B2E]" : "bg-[#3F7A2C]"
      }`}
    />
    {banned ? "Blocked" : "Active"}
  </span>
);

const UserCard = ({
  user,
  userRole,
  isSelf,
  canBlock,
}: {
  user: UserRow;
  userRole: DashboardRole;
  isSelf: boolean;
  canBlock: boolean;
}) => (
  <li className="rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4">
    <div className="flex items-start gap-3">
      <Avatar className="size-11 shrink-0 ring-2 ring-[#EADBC8]">
        <AvatarImage src={user.image ?? undefined} alt={user.name} />
        <AvatarFallback className="bg-[#3B2417] font-display text-[0.9375rem] text-[#F5EDE3]">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="truncate font-sans text-[0.9375rem] text-[#3B2417]">
            {user.name}
          </p>
          {isSelf ? (
            <span className="rounded-full bg-[#EADBC8] px-2 py-0.5 font-sans text-[0.6875rem] uppercase tracking-wide text-[#7A6455]">
              You
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate font-sans text-[0.8125rem] text-[#7A6455]">
          {user.email}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <RoleBadge role={userRole} />
          <StatusBadge banned={Boolean(user.banned)} />
          <span className="font-sans text-[0.75rem] text-[#7A6455]">
            Joined {dateFormat.format(new Date(user.createdAt))}
          </span>
        </div>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#EADBC8] pt-3">
      <UserDetailsDialog
        user={toUserDetails(user, userRole)}
        className="flex-1 sm:flex-none"
      />
      {canBlock ? (
        <UserBanButton
          userId={user.id}
          name={user.name}
          banned={Boolean(user.banned)}
          className="flex-1 sm:flex-none"
        />
      ) : null}
    </div>
  </li>
);

const UsersSkeleton = () => (
  <div aria-busy="true" className="flex flex-col gap-6">
    <div className={toolbarClass}>
      <div className="h-[3.25rem] animate-pulse rounded-full bg-[#EADBC8]" />
      <div className="h-10 w-full animate-pulse rounded-full bg-[#EADBC8] sm:w-72" />
    </div>

    {/* Mobile / tablet cards */}
    <div className="flex flex-col gap-3 xl:hidden">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-11 shrink-0 animate-pulse rounded-full bg-[#EADBC8]" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/2 animate-pulse rounded-full bg-[#EADBC8]" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#EADBC8]" />
            </div>
          </div>
          <div className="mt-3 h-10 animate-pulse rounded-full bg-[#EADBC8]" />
        </div>
      ))}
    </div>

    {/* Desktop table */}
    <div className="hidden overflow-hidden rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] xl:block">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse border-b border-[#EADBC8] bg-[#FBF6EF] last:border-b-0"
        />
      ))}
    </div>
  </div>
);

const UsersContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const q = (params.q ?? "").trim();
  const role = roleValues.find((item) => item === params.role) ?? "";

  const [currentUser, users] = await Promise.all([
    getCurrentUser(),
    fetchUsers(q, role),
  ]);

  return (
    <>
      <div className={toolbarClass}>
        <UserSearchBar />
        <UserFilters resultCount={users.length} />
      </div>

      {users.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-[#EADBC8] bg-[#FBF6EF] p-10 text-center font-sans text-[0.9375rem] text-[#7A6455]">
          No users match your search.
        </p>
      ) : (
        <>
          {/* Mobile / tablet: cards */}
          <ul aria-label="Users" className="flex flex-col gap-3 xl:hidden">
            {users.map((user) => {
              const userRole = dashboardRole(user.role);
              const isSelf = user.id === currentUser?.id;
              const canBlock = !isSelf && userRole !== "admin";

              return (
                <UserCard
                  key={user.id}
                  user={user}
                  userRole={userRole}
                  isSelf={isSelf}
                  canBlock={canBlock}
                />
              );
            })}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] xl:block">
            <Table className="min-w-[860px]">
              <TableHeader className="bg-[#F5EDE3]">
                <TableRow className="border-[#EADBC8] hover:bg-transparent">
                  <TableHead className={headClass}>User</TableHead>
                  <TableHead className={headClass}>Email</TableHead>
                  <TableHead className={headClass}>Role</TableHead>
                  <TableHead className={headClass}>Status</TableHead>
                  <TableHead className={headClass}>Joined</TableHead>
                  <TableHead className={`${headClass} text-right`}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => {
                  const userRole = dashboardRole(user.role);
                  const isSelf = user.id === currentUser?.id;
                  const canBlock = !isSelf && userRole !== "admin";

                  return (
                    <TableRow
                      key={user.id}
                      className="border-[#EADBC8] hover:bg-[#F5EDE3]/60"
                    >
                      <TableCell className={cellClass}>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 ring-2 ring-[#EADBC8]">
                            <AvatarImage
                              src={user.image ?? undefined}
                              alt={user.name}
                            />
                            <AvatarFallback className="bg-[#3B2417] font-display text-[0.9375rem] text-[#F5EDE3]">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <p className="max-w-[16ch] truncate font-sans text-[0.9375rem] text-[#3B2417]">
                              {user.name}
                            </p>
                            {isSelf ? (
                              <p className="font-sans text-[0.75rem] text-[#7A6455]">
                                You
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell
                        className={`${cellClass} font-sans text-[0.875rem] text-[#7A6455]`}
                      >
                        {user.email}
                      </TableCell>

                      <TableCell className={cellClass}>
                        <RoleBadge role={userRole} />
                      </TableCell>

                      <TableCell className={cellClass}>
                        <StatusBadge banned={Boolean(user.banned)} />
                      </TableCell>

                      <TableCell
                        className={`${cellClass} font-sans text-[0.875rem] text-[#7A6455]`}
                      >
                        {dateFormat.format(new Date(user.createdAt))}
                      </TableCell>

                      <TableCell className={cellClass}>
                        <div className="flex items-center justify-end gap-2">
                          <UserDetailsDialog
                            user={toUserDetails(user, userRole)}
                          />
                          {canBlock ? (
                            <UserBanButton
                              userId={user.id}
                              name={user.name}
                              banned={Boolean(user.banned)}
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
};

const AdminUsersPage = ({ searchParams }: PageProps) => {
  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1vw,2.5rem)] leading-none tracking-tight text-[#3B2417]">
          Manage Users
        </h1>

        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[#7A6455]">
          Every customer, vendor and admin account on PizzaHub. Search by name
          or email, filter by role, and block anyone who breaks the rules.
        </p>
      </header>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default AdminUsersPage;
