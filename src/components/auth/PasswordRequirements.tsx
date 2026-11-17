"use client";

import React from "react";
import { Check, Minus } from "lucide-react";

type PasswordRequirementsProps = {
  value: string;
};

const PasswordRequirements = ({ value }: PasswordRequirementsProps) => {
  const rules = [
    { label: "Minimum 6 characters", passed: value.length >= 6 },
    { label: "At least one uppercase letter", passed: /[A-Z]/.test(value) },
    { label: "At least one lowercase letter", passed: /[a-z]/.test(value) },
  ];

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
