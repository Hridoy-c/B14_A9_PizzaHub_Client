"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

const EditNameDialog = ({ name }: { name: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setValue(name);
      setError(null);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();

    if (trimmed.length < 2) {
      setError("Enter your full name.");
      return;
    }

    setLoading(true);
    setError(null);
    const { error: updateError } = await authClient.updateUser({
      name: trimmed,
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message ?? "Could not update your name.");
      return;
    }

    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(true)}
      >
        Edit
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-[#EADBC8] bg-[#FBF6EF] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#3B2417]">Edit name</DialogTitle>
            <DialogDescription className="text-[#7A6455]">
              This is the name vendors see on your orders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="settings-name">Full name</Label>
              <Input
                id="settings-name"
                autoComplete="name"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
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
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditNameDialog;