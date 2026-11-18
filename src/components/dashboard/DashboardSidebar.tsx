"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  PlusCircle,
  Settings,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

import Logo, { PizzaMark } from "@/components/shared/navbar/Logo";
import { authClient } from "@/lib/auth-client";
import { dashboardRole, type DashboardRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type DashboardSidebarUser = {
  name: string;
  email: string;
  role?: string | null;
};

const menuItemsByRole: Record<DashboardRole, MenuItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
    { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { label: "Settings", href: "/dashboard/customer/settings", icon: Settings },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard, exact: true },
    { label: "My Menu", href: "/dashboard/vendor/menu", icon: UtensilsCrossed },
    { label: "Add Item", href: "/dashboard/vendor/menu/new", icon: PlusCircle },
    { label: "Orders", href: "/dashboard/vendor/orders", icon: ClipboardList },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Menu Items", href: "/dashboard/admin/menu-items", icon: ListOrdered },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Wallet },
  ],
};

const itemClass =
  "relative h-10 rounded-lg pl-3 pr-2 text-[#D4C2BB] hover:bg-[#4A322A]/70 hover:text-[#F5EDE3]";

const activeItemClass =
  "bg-[#4A322A] text-[#F5EDE3] before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-[#A1887A] group-data-[collapsible=icon]:before:hidden";

type Props = {
  user: DashboardSidebarUser;
};

const DashboardSidebar = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [loggingOut, setLoggingOut] = useState(false);

  const initial = user.name?.trim().charAt(0).toUpperCase() || "?";
  const role = dashboardRole(user.role);
  const items = menuItemsByRole[role];

  // Only the most specific match wins, so /vendor/menu/new lights up
  // "Add Item" rather than both "My Menu" and "Add Item".
  const activeHref = items
    .filter((item) =>
      item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const isActive = (item: MenuItem) => item.href === activeHref;

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await authClient.signOut();
    setLoggingOut(false);

    if (error) {
      toast.error(error.message ?? "Logout failed. Please try again.");
      return;
    }

    toast.success("Signed out", {
      description: "You can sign back in whenever you like.",
    });
    router.push("/");
    router.refresh();
  };

  return (
    <Sidebar collapsible="icon" className="border-[#7A5647]/40">
      {/* Dark warm panel: cream text on espresso, per the brand palette */}
      <div className="flex h-full min-h-0 w-full flex-col bg-[#2E1B16]">
        <SidebarHeader className="shrink-0 gap-0 px-2 py-3">
          <div className="px-1 group-data-[collapsible=icon]:hidden">
            <Logo tone="light" className="text-[#F5EDE3]" />
          </div>
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            className="mx-auto hidden size-8 items-center justify-center rounded-lg bg-[#4A322A] group-data-[collapsible=icon]:flex"
          >
            <PizzaMark tone="light" className="size-5" />
          </Link>
          <div
            className="mt-3 h-px bg-[#7A5647]/40 group-data-[collapsible=icon]:hidden"
            aria-hidden="true"
          />
        </SidebarHeader>

        <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {items.map((item) => {
                  const active = isActive(item);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.href}
                            onClick={() => setOpenMobile(false)}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                        tooltip={item.label}
                        className={cn(itemClass, active && activeItemClass)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="shrink-0 gap-2 border-t border-[#7A5647]/40 p-2 group-data-[collapsible=icon]:p-1">
          <div className="flex items-center gap-2.5 overflow-hidden rounded-xl border border-[#7A5647]/40 bg-[#4A322A]/50 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#A1887A] font-sans text-[0.875rem] text-[#2E1B16] group-data-[collapsible=icon]:size-8">
              {initial}
            </span>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate font-sans text-[0.875rem] text-[#F5EDE3]">
                {user.name}
              </p>
              <p className="truncate text-[0.75rem] capitalize text-[#A1887A]">
                {role}
              </p>
            </div>
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                disabled={loggingOut}
                tooltip="Logout"
                className="h-10 rounded-xl text-[#D4C2BB] hover:bg-[#7A5647]/40 hover:text-[#F5EDE3]"
              >
                <LogOut />
                <span>{loggingOut ? "Signing out..." : "Logout"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
