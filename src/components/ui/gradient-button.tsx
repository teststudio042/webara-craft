import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent";
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden",
          "transition-all duration-300 hover:scale-105 hover:shadow-2xl",
          "before:absolute before:inset-0 before:transition-opacity before:duration-300",
          variant === "primary" && [
            "bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(230,85%,65%)]",
            "hover:shadow-[0_0_40px_hsl(262,90%,70%,0.4)]"
          ],
          variant === "accent" && [
            "bg-gradient-to-r from-[hsl(191,92%,58%)] to-[hsl(220,85%,65%)]",
            "hover:shadow-[0_0_40px_hsl(191,92%,58%,0.4)]"
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";
