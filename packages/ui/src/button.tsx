"use client";

import { ReactNode, FC } from "react";

interface ButtonProps {
  variant: "primary" | "send";
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm";
  children: ReactNode | string;
  disabled?: boolean;
}

const buttonVariants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  send: "bg-purple-500 hover:bg-purple-600 text-white",
};

const buttonSizes = {
  lg: "px-6 py-3 text-lg",
  sm: "px-3 py-1 text-sm",
};

export const Button: FC<ButtonProps> = ({
  size,
  variant,
  className = "",
  onClick,
  children,
  disabled = false,
})=> {
  return (
    <button
      type="button"
      aria-label={typeof children === "string" ? children : "button"}
      className={`${buttonVariants[variant]} ${buttonSizes[size]} rounded-lg transition 
      ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
