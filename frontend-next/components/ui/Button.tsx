import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "clay";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-clinical text-paper hover:bg-clinical-dark disabled:bg-neutral-light disabled:text-neutral",
  secondary:
    "bg-transparent text-ink border border-ink/15 hover:border-ink/40",
  ghost: "bg-transparent text-clinical hover:bg-clinical/8",
  clay: "bg-clay text-paper hover:bg-clay-light",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-150 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
