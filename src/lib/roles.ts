/**
 * Dashboard roles come from Better Auth's `user.role` field, which is a plain
 * string (customer / vendor / admin, defaulting to customer).
 */
export type DashboardRole = "customer" | "vendor" | "admin";

export const isDashboardRole = (value: unknown): value is DashboardRole =>
  value === "customer" || value === "vendor" || value === "admin";

/** Unknown or missing roles fall back to the default customer dashboard. */
export const dashboardRole = (role: string | null | undefined): DashboardRole =>
  isDashboardRole(role) ? role : "customer";

/** Home route for a role, e.g. "/dashboard/vendor". */
export const dashboardHome = (role: string | null | undefined): string =>
  `/dashboard/${dashboardRole(role)}`;
