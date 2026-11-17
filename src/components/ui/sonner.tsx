"use client";

import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Branded shadcn/sonner toaster.
 *
 * Palette: card cream surface (`#FBF6EF`), warm border (`#EADBC8`), cocoa ink
 * (`#3B2417`). Success uses the crust orange (`#B9733A`) — the same accent as
 * the password checkmarks — and errors use the muted brick (`#B23B2E`).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      className="toaster group font-sans"
      icons={{
        success: <CircleCheck className="size-4 text-[#B9733A]" />,
        error: <CircleAlert className="size-4 text-[#B23B2E]" />,
        info: <Info className="size-4 text-[#7A6455]" />,
        warning: <TriangleAlert className="size-4 text-[#B9733A]" />,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#FBF6EF",
          border: "1px solid #EADBC8",
          color: "#3B2417",
          borderRadius: "18px",
          padding: "12px 14px",
          boxShadow: "0 20px 44px -24px rgba(59,36,23,0.45)",
        },
        classNames: {
          toast: "items-start! gap-2.5!",
          title: "text-[0.875rem]! font-medium!",
          description: "text-[0.8125rem]! leading-snug! text-[#7A6455]!",
          actionButton: "rounded-full! bg-[#3B2417]! text-[#F5EDE3]!",
          cancelButton: "rounded-full! text-[#7A6455]!",
          success: "border-l-4! border-l-[#B9733A]!",
          error: "border-l-4! border-l-[#B23B2E]!",
          info: "border-l-4! border-l-[#7A6455]!",
          warning: "border-l-4! border-l-[#B9733A]!",
        },
      }}
      {...props}
    />
  );
};

export default Toaster;
