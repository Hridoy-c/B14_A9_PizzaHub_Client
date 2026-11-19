import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import GridRule from "@/components/root/home/GridRule";
import React from "react";
import { getCurrentUser } from "@/lib/cors/Session";

// The navbar needs the session on first paint, so this segment reads request data
// at the top level instead of streaming it behind a <Suspense> boundary.
export const instant = false;

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar user={user} />
      <GridRule />
      <main className="flex-1">{children}</main>
      <GridRule />
      <Footer />
    </div>
  );
};

export default RootLayout;
