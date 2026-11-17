"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { passwordRules } from "./password-rules";

type PasswordRequirementsProps = {
  value: string;
  /** Single-line chips instead of the stacked list. */
  compact?: boolean;
};

const PasswordRequirements = ({
  value,
  compact = false,
}: PasswordRequirementsProps) => {
  const rules = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(value),
  }));

  if (compact) {
    return (
      <ul
        className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1"
        aria-live="polite"
      >
        {rules.map((rule) => (
          <li
            key={rule.short}
            className={`flex items-center gap-1 text-[0.6875rem] transition-colors ${
              rule.passed ? "text-[#3B2417]" : "text-[#A08C7B]"
            }`}
          >
            <span
              className={`grid size-3.5 shrink-0 place-items-center rounded-full border ${
                rule.passed
                  ? "border-[#B9733A] bg-[#B9733A] text-[#F5EDE3]"
                  : "border-[#EADBC8] bg-white text-[#A08C7B]"
              }`}
            >
              {rule.passed ? (
                <Check className="size-2" strokeWidth={3} aria-hidden="true" />
              ) : (
                <Minus className="size-2" strokeWidth={3} aria-hidden="true" />
              )}
            </span>
            {rule.short}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-2 flex flex-col gap-1.5" aria-live="polite">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={`flex items-center gap-2 text-[0.75rem] transition-colors ${
            rule.passed ? "text-[#3B2417]" : "text-[#A08C7B]"
          }`}
        >
          <span
            className={`grid size-4 shrink-0 place-items-center rounded-full border ${
              rule.passed
                ? "border-[#B9733A] bg-[#B9733A] text-[#F5EDE3]"
                : "border-[#EADBC8] bg-white text-[#A08C7B]"
            }`}
          >
            {rule.passed ? (
              <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
            ) : (
              <Minus className="size-2.5" strokeWidth={3} aria-hidden="true" />
            )}
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  );
};

export default PasswordRequirements;
