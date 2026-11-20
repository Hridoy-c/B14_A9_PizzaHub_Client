"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

const SignOutOthersDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    setError(null);
    setDone(false);
  };

  const onConfirm = async () => {
    setLoading(true);
    setError(null);
    const { error: revokeError } = await authClient.revokeOtherSessions();
    setLoading(false);

    if (revokeError) {
      setError(revokeError.message ?? "Could not end the other sessions.");
      return;
    }
    setDone(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(true)}
      >
        Sign out others
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-[#EADBC8] bg-[#FBF6EF] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#3B2417]">
              Sign out of other devices?
            </DialogTitle>
            <DialogDescription className="text-[#7A6455]">
              Every other browser and device signed in to your account will be
              signed out. You will stay signed in here.
            </DialogDescription>
          </DialogHeader>

          {done ? (
            <p role="status" className="text-[0.9375rem] text-[#2F6B3F]">
              Signed out of all other devices.
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="text-[0.8125rem] text-[#A33A1F]">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {done ? "Close" : "Cancel"}
            </Button>
            {done ? null : (
              <Button type="button" onClick={onConfirm} disabled={loading}>
                {loading ? "Signing out..." : "Sign out others"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignOutOthersDialog;