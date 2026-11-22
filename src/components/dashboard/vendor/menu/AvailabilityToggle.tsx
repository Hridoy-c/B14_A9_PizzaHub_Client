"use client";

import { useTransition } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setMenuAvailabilityAction } from "@/lib/actions/menus";

type Props = { id: string; name: string; status: "approved" | "inactive" };

const AvailabilityToggle = ({ id, name, status }: Props) => {
  const [isPending, startTransition] = useTransition();
  const next = status === "approved" ? "inactive" : "approved";

  const toggle = () =>
    startTransition(async () => {
      const result = await setMenuAvailabilityAction(id, next);

      if (!result.ok) {
        toast.error("Could not update availability", {
          description: result.message,
        });
        return;
      }

      toast.success(next === "inactive" ? `${name} paused` : `${name} is live again`);
    });

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggle}
      disabled={isPending}
      className="h-9 flex-1 gap-1.5 rounded-full border-[#EADBC8] bg-transparent text-[0.875rem] text-[#3B2417] hover:bg-[#F5EDE3]"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : status === "approved" ? (
        <Pause className="size-3.5" aria-hidden="true" />
      ) : (
        <Play className="size-3.5" aria-hidden="true" />
      )}
      {status === "approved" ? "Pause" : "Publish"}
    </Button>
  );
};

export default AvailabilityToggle;