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
    setLoading(true);

    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
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