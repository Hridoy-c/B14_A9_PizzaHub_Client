"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/actions/orders";

type OrderFormProps = {
  itemId: string;
  itemName: string;
  price: number;
};

const labelClass =
  "font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-[#7A6455]";
const fieldClass =
  "rounded-xl border-[#EADBC8] bg-white font-sans text-[0.9375rem] text-[#3B2417] placeholder:text-[#A08C7B] focus-visible:border-[#B9733A] focus-visible:ring-[#B9733A]/20";

const OrderForm = ({ itemId, itemName, price }: OrderFormProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  const reset = () => {
    setDeliveryDate("");
    setDeliveryAddress("");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deliveryDate) {
      toast.error("Choose a delivery date");
      return;
    }
    if (deliveryAddress.trim().length < 5) {
      toast.error("Enter a full delivery address");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createOrder({
        itemId,
        deliveryDate,
        deliveryAddress,
        message,
      });

      if (!result.ok) {
        toast.error("Could not place your order", {
          description: result.message,
        });
        return;
      }

      toast.success("Order placed", {
        description: `${itemName} is waiting for the vendor to accept it.`,
      });
      setOpen(false);
      reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-6 border-t border-[#EADBC8] pt-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-3.5 font-sans text-[0.9375rem] text-[#F5EDE3] shadow-[0_16px_32px_-18px_rgba(59,36,23,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF]"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Order now
        </button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!submitting) setOpen(next);
        }}
      >
        <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto rounded-3xl border-0 bg-[#FBF6EF] p-0 text-[#3B2417] ring-[#EADBC8] sm:max-w-md">
          <DialogHeader className="px-6 pb-4 pt-6 pr-12">
            <DialogTitle className="font-display text-[1.75rem] uppercase leading-none tracking-tight text-[#7A2E12]">
              Place your order
            </DialogTitle>
            <DialogDescription className="mt-2 font-sans text-[0.8125rem] text-[#7A6455]">
              {itemName} · ${price.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 border-t border-[#EADBC8] p-6"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-date" className={labelClass}>
                Delivery date
              </Label>
              <Input
                id="order-date"
                type="date"
                min={today}
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                disabled={submitting}
                className={`h-11 ${fieldClass}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-address" className={labelClass}>
                Delivery address
              </Label>
              <Textarea
                id="order-address"
                rows={2}
                maxLength={200}
                placeholder="House, road, area, city"
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                disabled={submitting}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order-message" className={labelClass}>
                Message for the vendor (optional)
              </Label>
              <Textarea
                id="order-message"
                rows={3}
                maxLength={300}
                placeholder="Extra cheese, no onions, call on arrival…"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={submitting}
                className={fieldClass}
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="rounded-full border border-[#EADBC8] px-5 py-2.5 font-sans text-[0.875rem] text-[#3B2417] transition-colors hover:border-[#3B2417] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-2.5 font-sans text-[0.875rem] text-[#F5EDE3] transition-colors hover:bg-[#2A1A10] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Placing order…
                  </>
                ) : (
                  "Confirm order"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderForm;