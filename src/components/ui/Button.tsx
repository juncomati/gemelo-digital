import { cn } from "@/lib/format";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-petrol-700 text-white shadow-sm hover:bg-navy-800 hover:shadow-md active:translate-y-px",
  secondary:
    "bg-surface-0/90 text-text-900 border border-border-200 hover:border-border-300 hover:bg-surface-0 active:translate-y-px",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-600/90 active:translate-y-px",
  ghost: "bg-transparent text-text-600 hover:bg-surface-100 hover:text-text-900",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }
>(function Button({ variant = "primary", className, children, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-[background-color,box-shadow,transform,border-color,color] duration-150 ease-[var(--ease-out-soft)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
