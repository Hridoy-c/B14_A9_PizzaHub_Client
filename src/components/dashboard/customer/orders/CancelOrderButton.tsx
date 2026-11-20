"use client";

import { useRef, useState, useTransition } from "react";
import { cancelOrder } from "@/lib/actions/orders"; // আপনার actions ফাইলের পাথ দিন

const CancelOrderButton = ({ orderId }: { orderId: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setError(null);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    if (isPending) return; // cancel চলার সময় বন্ধ করা যাবে না
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    setError(null);
    startTransition(async () => {
      const result = await cancelOrder(orderId);

      if (!result.ok) {
        setError(result.message ?? "Could not cancel the order");
        return; // ব্যর্থ হলে dialog খোলা থাকবে
      }
      dialogRef.current?.close();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="rounded-full border border-[#B3402A] px-5 py-2 text-[0.875rem] text-[#B3402A] transition-colors hover:bg-[#B3402A] hover:text-white"
      >
        Cancel order
      </button>

      <dialog
        ref={dialogRef}
        // Esc চাপলে pending অবস্থায় বন্ধ হবে না
        onCancel={(e) => {
          if (isPending) e.preventDefault();
        }}
        // dialog-এর বাইরে (backdrop) ক্লিক করলে বন্ধ হবে
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-[#EADBC8] bg-[#FBF6EF] p-0 text-[#3B2417] backdrop:bg-black/40"
      >
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="font-display text-[1.375rem] uppercase leading-none tracking-tight text-[#7A2E12]">
              Cancel this order?
            </h2>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-[#7A6455]">
              This will cancel your order and let the vendor know. This
              can&apos;t be undone.
            </p>
          </div>

          {error ? (
            <p role="alert" className="text-[0.8125rem] text-[#B3402A]">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDialog}
              disabled={isPending}
              className="rounded-full border border-[#3B2417] px-5 py-2 text-[0.875rem] text-[#3B2417] transition-colors hover:bg-[#3B2417] hover:text-[#F5EDE3] disabled:opacity-50"
            >
              Keep order
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="rounded-full bg-[#B3402A] px-5 py-2 text-[0.875rem] text-white transition-colors hover:bg-[#932F1D] disabled:opacity-50"
            >
              {isPending ? "Cancelling..." : "Yes, cancel order"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CancelOrderButton;