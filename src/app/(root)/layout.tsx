
import React from "react";
import { connection } from "next/server";

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
  // The session read (Better Auth) checks expiry with `new Date()`, so it must
  // only run at request time. Without this, prerendering throws
  // "encountered the unstable value `new Date()` while prerendering".
  await connection();

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
