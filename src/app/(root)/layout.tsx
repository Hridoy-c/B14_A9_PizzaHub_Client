
import React from "react";

import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import GridRule from "@/components/root/home/GridRule";

import { getCurrentUser } from "@/lib/cors/Session";

// This layout reads session data before rendering the navbar.
// It is allowed to block during navigation.
export const instant = false;

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
