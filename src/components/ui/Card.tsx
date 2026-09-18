import { cn } from "@/lib/format";
import type { HTMLAttributes, ReactNode } from "react";

type Variant = "default" | "quiet" | "panel" | "priority";

const variants: Record<Variant, string> = {
  default: "card-surface",
  quiet: "card-surface-quiet",
  panel: "card-surface-panel",
  priority: "card-surface-priority",
};

export function Card({
  variant = "default",
  interactive = false,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(variants[variant], interactive && "card-interactive", className)}
      {...props}
    >
      {children}
    </div>
  );
}
