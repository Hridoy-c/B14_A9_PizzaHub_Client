"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MenuItemStatus } from "@/lib/types";
import {
  adminSetMenuStatusAction,
  deleteMenuItemAction,
} from "@/lib/actions/menus";
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

type Target = "approved" | "rejected" | "inactive" | "delete";

const solid =
  "inline-flex items-center gap-1.5 rounded-full bg-[#3B2417] px-4 py-2 text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] disabled:cursor-not-allowed disabled:opacity-60";
const outlineBrown =
  "inline-flex items-center gap-1.5 rounded-full border border-[#3B2417] px-4 py-2 text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3] disabled:cursor-not-allowed disabled:opacity-60";
const outlineRed =
  "inline-flex items-center gap-1.5 rounded-full border border-[#B23B2E] px-4 py-2 text-[#B23B2E] transition-colors hover:bg-[#B23B2E] hover:text-[#F5EDE3] disabled:cursor-not-allowed disabled:opacity-60";

const MenuStatusActions = ({
  id,
  name,
  status,
}: {
  id: string;
  name: string;
  status: MenuItemStatus;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<Target | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const run = (next: Target) =>
    startTransition(async () => {
      setTarget(next);

      const result =
        next === "delete"
          ? await deleteMenuItemAction(id)
          : await adminSetMenuStatusAction(id, next);

      if (!result.ok) {
        toast.error(result.message ?? "Could not update the item");
        return;
      }

      toast.success(next === "delete" ? `${name} deleted` : `Item ${next}`);
      setDeleteOpen(false);
      router.refresh();
    });

  const spin = (key: Target) =>
    isPending && target === key ? (
      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
    ) : null;

  return (
    <div className="flex flex-wrap items-center gap-2 font-sans text-[0.875rem]">
      {(status === "pending" || status === "rejected") && (
        <button type="button" disabled={isPending} onClick={() => run("approved")} className={solid}>
          {spin("approved")}
          Approve
        </button>
      )}

      {status === "inactive" && (
        <button type="button" disabled={isPending} onClick={() => run("approved")} className={solid}>
          {spin("approved")}
          Reactivate
        </button>
      )}

      {status === "approved" && (
        <button type="button" disabled={isPending} onClick={() => run("inactive")} className={outlineBrown}>
          {spin("inactive")}
          Deactivate
        </button>
      )}

      {status !== "rejected" && (
        <button type="button" disabled={isPending} onClick={() => run("rejected")} className={outlineRed}>
          {spin("rejected")}
          Reject
        </button>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={
            <button
              type="button"
              disabled={isPending}
              className="inline-flex items-center rounded-full px-3 py-2 text-[#B42318] transition-colors hover:bg-red-50 disabled:opacity-60"
            />
          }
        >
          Delete
        </AlertDialogTrigger>

        <AlertDialogContent className="border-0 bg-[#FBF6EF] font-sans text-[#3B2417]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
              Delete this item?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[0.8125rem] text-[#7A6455]">
              “{name}” will be removed for good. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-[#EADBC8] bg-[#F5EDE3]">
            <AlertDialogCancel
              disabled={isPending}
              className="h-10 rounded-full border-[#EADBC8] bg-transparent px-5 text-[#3B2417]"
            >
              Keep item
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={() => run("delete")}
              disabled={isPending}
              className="h-10 gap-2 rounded-full bg-[#B42318] px-5 text-white hover:bg-[#8F1B12]"
            >
              {spin("delete")}
              {isPending && target === "delete" ? "Deleting…" : "Yes, delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <span aria-live="polite" className="sr-only">
        {isPending ? "Updating item" : ""}
      </span>
    </div>
  );
};

export default MenuStatusActions;