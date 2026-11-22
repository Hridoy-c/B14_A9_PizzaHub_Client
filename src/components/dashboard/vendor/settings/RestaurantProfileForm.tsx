"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inputClass, labelClass } from "@/components/auth/field-styles";
import { updateVendorProfile } from "@/lib/actions/vendor";

type Props = {
  initial: {
    businessName: string;
    restaurantDescription: string;
    restaurantAddress: string;
    restaurantPhone: string;
  };
};

const RestaurantProfileForm = ({ initial }: Props) => {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof typeof initial, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    startTransition(async () => {
      const result = await updateVendorProfile(values);

      if (!result.ok) {
        toast.error("Could not save profile", { description: result.message });
        return;
      }

      toast.success("Restaurant profile saved");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-5 py-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="business-name" className={labelClass}>Restaurant name</Label>
        <Input
          id="business-name"
          value={values.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          disabled={isPending}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="restaurant-description" className={labelClass}>Description</Label>
        <Textarea
          id="restaurant-description"
          rows={3}
          value={values.restaurantDescription}
          onChange={(e) => set("restaurantDescription", e.target.value)}
          disabled={isPending}
          className={`${inputClass} h-auto py-2.5`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="restaurant-address" className={labelClass}>Address</Label>
          <Input
            id="restaurant-address"
            value={values.restaurantAddress}
            onChange={(e) => set("restaurantAddress", e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="restaurant-phone" className={labelClass}>Phone</Label>
          <Input
            id="restaurant-phone"
            type="tel"
            value={values.restaurantPhone}
            onChange={(e) => set("restaurantPhone", e.target.value)}
            disabled={isPending}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 font-sans text-[0.875rem] text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isPending ? "Saving…" : "Save restaurant profile"}
      </button>
    </form>
  );
};

export default RestaurantProfileForm;