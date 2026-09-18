import { cn } from "@/lib/format";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "high" | "medium" | "low" | "danger" | "info";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-50 text-text-600 border-border-200",
    high: "bg-teal-500/10 text-green-600 border-teal-500/30",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    low: "bg-red-600/10 text-red-600 border-red-600/30",
    danger: "bg-red-600/10 text-red-600 border-red-600/30",
    info: "bg-cyan-500/10 text-petrol-700 border-cyan-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
