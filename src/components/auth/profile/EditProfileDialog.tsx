"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileForm, { type ProfileUser } from "./ProfileForm";

const EditProfileDialog = ({ user }: { user: ProfileUser }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] text-[#F5EDE3] shadow-[0_10px_24px_-8px_rgba(59,36,23,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EDE3]"
          />
        }
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit profile
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto rounded-3xl border-0 bg-[#FBF6EF] p-0 text-[#3B2417] ring-[#EADBC8] sm:max-w-md">
        <DialogHeader className="px-5 pb-4 pt-5 pr-12">
          <DialogTitle className="font-display text-[1.5rem] uppercase leading-none tracking-tight text-[#3B2417]">
            Edit profile
          </DialogTitle>
          <DialogDescription className="font-sans text-[0.8125rem] leading-snug text-[#7A6455]">
            Update your name, email and photo. Your changes apply to the whole
            site.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t border-[#EADBC8] p-5">
          <ProfileForm
            user={user}
            onSaved={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
