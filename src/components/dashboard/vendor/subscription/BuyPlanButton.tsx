"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const BuyPlanButton = ({ price }: { price: number }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setError(null);

    // TODO: implement the purchase here.
    // Use setLoading(true / false) around your request and
    // setError("message") to show a problem under the button.
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        size="lg"
        onClick={handleBuy}
        disabled={loading}
        className="w-full"
      >
        <Lock className="size-4" aria-hidden="true" />
        {loading ? "Redirecting..." : `Buy now · ${money(price)}`}
      </Button>

      {error ? (
        <p role="alert" className="text-[0.8125rem] text-[#A33A1F]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default BuyPlanButton;