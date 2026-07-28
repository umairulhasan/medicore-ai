import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-wider text-neutral-dark">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`rounded-xl border border-ink/15 bg-white/70 px-4 py-2.5 text-sm outline-none transition-colors focus:border-clinical ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
