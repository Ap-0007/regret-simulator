import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted",
        "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        error ? "border-red-500" : "border-border",
        className
      )}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
