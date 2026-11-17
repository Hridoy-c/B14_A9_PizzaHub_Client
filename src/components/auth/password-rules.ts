export type PasswordRule = {
  label: string;
  /** Shorter wording for the compact single-line checklist. */
  short: string;
  test: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  {
    label: "Minimum 6 characters",
    short: "6+ characters",
    test: (value) => value.length >= 6,
  },
  {
    label: "At least one uppercase letter",
    short: "1 uppercase",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: "At least one lowercase letter",
    short: "1 lowercase",
    test: (value) => /[a-z]/.test(value),
  },
];

/** True when every password rule passes. */
export const isPasswordValid = (value: string) =>
  passwordRules.every((rule) => rule.test(value));
