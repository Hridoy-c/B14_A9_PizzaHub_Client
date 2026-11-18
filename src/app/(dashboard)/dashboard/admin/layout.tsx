import React from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/cors/Session";
import { dashboardRole, dashboardHome } from "@/lib/roles";

// Reads the session, so it blocks rather than prerendering.
export const instant = false;

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requireUser();

  if (dashboardRole(user.role) !== "admin") {
    redirect(dashboardHome(user.role));
  }

  return <>{children}</>;
};

export default AdminLayout;
