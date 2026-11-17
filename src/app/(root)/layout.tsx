import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import GridRule from "@/components/home/GridRule";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <GridRule />
      <main className="flex-1">{children}</main>
      <GridRule />
      <Footer />
    </div>
  );
};

export default RootLayout;
