"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MenuItemStatus } from "@/lib/types";
import { setMenuItemStatus } from "@/lib/actions/pizza";

const MenuStatusActions = ({
  id,
  status,
}: {
  id: string;
  status: MenuItemStatus;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<"approved" | "rejected" | null>(null);

  const update = (next: "approved" | "rejected") =>
    startTransition(async () => {
      setTarget(next);
      const result = await setMenuItemStatus(id, next);

      if (!result.ok) {
        toast.error(result.message ?? "Could not update status");
        return;
      }

      toast.success(`Item ${next}`);
      // Re-render the list so the badge and filter counts stay in sync.
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-2 font-sans text-[0.875rem]">
      {status !== "approved" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => update("approved")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3B2417] px-4 py-2 text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && target === "approved" && (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          )}
          Approve
        </button>
      )}

      {status !== "rejected" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => update("rejected")}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#B23B2E] px-4 py-2 text-[#B23B2E] transition-colors hover:bg-[#B23B2E] hover:text-[#F5EDE3] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && target === "rejected" && (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          )}
          Reject
        </button>
      )}

      <span aria-live="polite" className="sr-only">
        {isPending ? "Updating item status" : ""}
      </span>
    </div>
  );
};

export default MenuStatusActions;