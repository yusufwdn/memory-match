"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

/**
 * A reusable button component shared across the app.
 *
 * Using a single Button component means all buttons look consistent
 * and style changes only need to happen in one place.
 *
 * The 'variant' prop controls the colour scheme:
 *   - primary:   blue  (main actions like "New Game")
 *   - secondary: gray  (secondary actions like "Restart")
 *   - danger:    red   (destructive actions if needed)
 */
export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary:   "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger:    "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
