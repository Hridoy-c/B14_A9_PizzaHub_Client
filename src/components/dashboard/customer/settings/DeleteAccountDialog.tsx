"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const CONFIRM_WORD = "DELETE";

const DeleteAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    setConfirmText("");
    setPassword("");
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (confirmText !== CONFIRM_WORD) return;

    setLoading(true);
    setError(null);
    const { error: deleteError } = await authClient.deleteUser(
      password ? { password } : {},
    );
    setLoading(false);

    if (deleteError) {
      setError(deleteError.message ?? "Could not delete your account.");
      return;
    }

    // Session is gone, so leave the dashboard.
    window.location.href = "/";
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onOpenChange(true)}
      >
        Delete account
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-[#EADBC8] bg-[#FBF6EF] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#3B2417]">
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-[#7A6455]">
              This permanently removes your account and personal data. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[0.75rem] text-[#7A6455]">
                Required if you sign in with email and password.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delete-confirm">
                Type {CONFIRM_WORD} to confirm
              </Label>
              <Input
                id="delete-confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>

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
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={loading || confirmText !== CONFIRM_WORD}
              >
                {loading ? "Deleting..." : "Delete account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteAccountDialog;