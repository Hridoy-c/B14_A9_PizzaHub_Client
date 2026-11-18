import { redirect } from "next/navigation";
import { requireUser } from "@/lib/cors/Session";
import { dashboardHome } from "@/lib/roles";

// Reads the session, so it blocks rather than prerendering.
export const instant = false;

const DashboardIndexPage = async () => {
  const user = await requireUser();
  redirect(dashboardHome(user.role));
};

export default DashboardIndexPage;
