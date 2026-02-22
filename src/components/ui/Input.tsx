"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "var(--input-label)" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 rounded-[8px] border-[1.5px] px-4 text-base transition-colors",
              "bg-[var(--input-bg)] text-[var(--input-text)]",
              "border-[var(--input-border)] placeholder:text-[var(--input-placeholder)]",
              "focus:border-[var(--input-focus-border)] focus:outline-none focus:shadow-[0_0_0_3px_var(--input-focus-shadow)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_var(--input-error-shadow)]",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
        {hint && !error && (
          <p className="text-xs" style={{ color: "var(--txt-m)" }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
