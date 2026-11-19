"use client";

import { useState } from "react";
import { Loader2, Minus, Plus, ShoppingBag } from "lucide-react";

type OrderFormProps = {
  itemId: string;
  itemName: string;
  price: number;
};

const OrderForm = ({ itemId, itemName, price }: OrderFormProps) => {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const total = price * quantity;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (quantity < 1) return;

    setSubmitting(true);

    try {
      // TODO: implement the order request here, for example:
      // await createOrder({ itemId, itemName, quantity, total });
      //
      // Remember to check the signed-in user's role on the server too —
      // this UI only shows for customers.
      console.log("Order submit", { itemId, itemName, quantity, total });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border-t border-[#EADBC8] pt-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#7A6455]">
            Quantity
          </p>

          <div className="mt-2 inline-flex items-center rounded-full border border-[#EADBC8] bg-white">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1 || submitting}
              aria-label="Decrease quantity"
              className="flex size-10 items-center justify-center rounded-full text-[#3B2417] transition-colors hover:bg-[#F5EDE3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              className="w-10 text-center font-display text-[1.125rem] leading-none text-[#3B2417]"
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(99, current + 1))}
              disabled={submitting}
              aria-label="Increase quantity"
              className="flex size-10 items-center justify-center rounded-full text-[#3B2417] transition-colors hover:bg-[#F5EDE3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-[#7A6455]">
            Total
          </p>
          <p className="mt-1 font-display text-[1.75rem] leading-none tracking-tight text-[#7A2E12]">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#3B2417] px-6 py-3.5 font-sans text-[0.9375rem] text-[#F5EDE3] shadow-[0_16px_32px_-18px_rgba(59,36,23,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#2A1A10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EF] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Placing order…
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" aria-hidden="true" />
            Order now
          </>
        )}
      </button>
    </form>
  );
};

export default OrderForm;
