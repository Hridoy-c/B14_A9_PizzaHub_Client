import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/shared/navbar/Navbar";

const domaine = localFont({
  src: "./fonts/domaine-display-condensed-medium.ttf",
  variable: "--font-domaine",
  weight: "500",
  display: "swap",
});

const generalSans = localFont({
  src: "./fonts/general-sans-medium.otf",
  variable: "--font-general-sans",
  weight: "500",
  display: "swap",
});

const robotoFlex = localFont({
  src: "./fonts/roboto-flex-regular.ttf",
  variable: "--font-roboto-flex",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PizzaHub",
  description: "Order your favourite pizza online",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${domaine.variable} ${generalSans.variable} ${robotoFlex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F5EDE3] font-body text-[#2A1A10]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
