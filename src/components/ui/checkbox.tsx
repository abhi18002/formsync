"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
};

export function Checkbox({
  checked = false,
  onCheckedChange,
  id,
  disabled,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "h-5 w-5 shrink-0 rounded border border-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
        checked ? "bg-sky-600 text-white" : "bg-white text-transparent",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <Check className="h-4 w-4" />
    </button>
  );
}
