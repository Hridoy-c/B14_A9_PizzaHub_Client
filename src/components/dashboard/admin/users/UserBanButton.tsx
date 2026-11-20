"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setUserBlocked } from "@/lib/actions/Users";

const UserBanButton = ({
  userId,
  name,
  banned,
  className = "",
}: {
  userId: string;
  name: string;
  banned: boolean;
  className?: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const result = await setUserBlocked(userId, !banned);

      if (!result.ok) {
        toast.error(result.message ?? "Could not update the user");
        return;
      }

      toast.success(banned ? `${name} unblocked` : `${name} blocked`);
      router.refresh();
    });

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-busy={isPending}
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-4 py-2 font-sans text-[0.875rem] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className} ${
        banned
          ? "bg-[#3B2417] text-[#F5EDE3] hover:bg-[#2A1A10]"
          : "border border-[#B23B2E] text-[#B23B2E] hover:bg-[#B23B2E] hover:text-[#F5EDE3]"
      }`}
    >
      {isPending && (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      )}
      {banned ? "Unblock" : "Block"}
    </button>
  );
};

export default UserBanButton;