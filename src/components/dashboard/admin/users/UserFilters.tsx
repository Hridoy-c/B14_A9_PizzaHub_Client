"use client";

import { useMenuParams } from "@/hooks/useMenuParams";
import { X } from "lucide-react";

const roles = [
  { value: "", label: "All" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
] as const;

type ActiveChip = {
  key: string;
  label: string;
  clear: Record<string, string | null>;
};

const UserFilters = ({ resultCount }: { resultCount: number }) => {
  const { searchParams, update, clearAll, isPending } = useMenuParams();

  const query = searchParams.get("q") ?? "";
  const activeRole = roles.find(
    (item) => item.value && item.value === searchParams.get("role"),
  );
  const role = activeRole?.value ?? "";

  const hasFilters = Boolean(query || role);

  const chipCandidates: (ActiveChip | null)[] = [
    query
      ? { key: "q", label: `Search: “${query}”`, clear: { q: null } }
      : null,
    activeRole
      ? { key: "role", label: activeRole.label, clear: { role: null } }
      : null,
  ];

  const activeChips = chipCandidates.filter(
    (chip): chip is ActiveChip => chip !== null,
  );

  return (
    <div
      aria-busy={isPending}
      className={`flex flex-col gap-4 transition-opacity ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by role"
          className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="inline-flex rounded-full border border-[#EADBC8] bg-white p-1">
            {roles.map((item) => {
              const selected = item.value === role;

              return (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ role: item.value || null })}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 font-sans text-[0.8125rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50 ${
                    selected
                      ? "bg-[#3B2417] text-[#F5EDE3]"
                      : "text-[#3B2417] hover:bg-[#F5EDE3]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <p
          aria-live="polite"
          className="font-sans text-[0.8125rem] text-[#7A6455]"
        >
          <span className="text-[#3B2417]">{resultCount}</span>{" "}
          {resultCount === 1 ? "user" : "users"}
        </p>
      </div>

      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[#EADBC8] pt-4">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update(chip.clear)}
              aria-label={`Remove filter: ${chip.label}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F5EDE3] py-1.5 pl-3 pr-2 font-sans text-[0.75rem] text-[#6B4332] transition-colors hover:bg-[#EADBC8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
            >
              <span className="truncate">{chip.label}</span>
              <X className="size-3.5 shrink-0" aria-hidden="true" />
            </button>
          ))}

          <button
            type="button"
            onClick={clearAll}
            className="ml-auto font-sans text-[0.8125rem] text-[#B9733A] underline-offset-4 transition-colors hover:text-[#7A2E12] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9733A]/50"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default UserFilters;