"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelSubscription } from "@/lib/actions/payment";

const CancelSubscriptionButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () =>
    startTransition(async () => {
      const result = await cancelSubscription();

      if (!result.ok) {
        toast.error("Could not cancel", { description: result.message });
        return;
      }

      toast.success("Subscription cancelled", {
        description: "You are back on the Free plan.",
      });
      setOpen(false);
      router.refresh();
    });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            className="h-10 rounded-full border-[#E3A59F] bg-transparent px-5 text-[#B42318] hover:bg-red-50 hover:text-[#B42318]"
          />
        }
      >
        Cancel subscription
      </AlertDialogTrigger>

      <AlertDialogContent className="border-0 bg-[#FBF6EF] font-sans text-[#3B2417]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
            Cancel Premium?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[0.8125rem] text-[#7A6455]">
            You will lose unlimited items, the Premium badge and featured
            placement. Items you already have stay on your menu.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="border-[#EADBC8] bg-[#F5EDE3]">
          <AlertDialogCancel
            disabled={isPending}
            className="h-10 rounded-full border-[#EADBC8] bg-transparent px-5 text-[#3B2417]"
          >
            Keep Premium
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="h-10 gap-2 rounded-full bg-[#B42318] px-5 text-white hover:bg-[#8F1B12]"
          >
            {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isPending ? "Cancelling…" : "Yes, cancel"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelSubscriptionButton;