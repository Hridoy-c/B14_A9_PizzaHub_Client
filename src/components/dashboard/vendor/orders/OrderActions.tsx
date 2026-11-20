"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setOrderStatus } from "@/lib/actions/orders";

const OrderActions = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<"accepted" | "rejected" | null>(null);

  const update = (next: "accepted" | "rejected") =>
    startTransition(async () => {
      setTarget(next);
      const result = await setOrderStatus(orderId, next);

      if (!result.ok) {
        toast.error(result.message ?? "Could not update the order");
        return;
      }

      toast.success(next === "accepted" ? "Order accepted" : "Order rejected");
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center gap-2 font-sans text-[0.875rem]">
      <button
        type="button"
        disabled={isPending}
        onClick={() => update("accepted")}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#3B2417] px-4 py-2 text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && target === "accepted" && (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        )}
        Accept
      </button>

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
    </div>
  );
};

export default OrderActions;