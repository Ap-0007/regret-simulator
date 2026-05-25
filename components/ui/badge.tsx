import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        low: "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50",
        medium: "bg-amber-900/60 text-amber-300 border border-amber-700/50",
        high: "bg-red-900/60 text-red-300 border border-red-700/50",
        default: "bg-surface-3 text-text-secondary border border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
