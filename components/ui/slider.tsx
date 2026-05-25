"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  error?: string;
}

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, error, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-3">
      <SliderPrimitive.Range className="absolute h-full bg-amber-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full border-2 border-amber-500 bg-background shadow",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        error && "border-red-500"
      )}
      aria-label="Risk tolerance"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
