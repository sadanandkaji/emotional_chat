import { FC } from "react";

interface InputTypo {
  variant: "primary" | "message";
  size: "sm" | "lg";
  placeholder: string;
  type: "text" | "password";
  className?: string;
}

const inputTypes = {
  primary: "bg-blue-200 focus:ring focus:ring-blue-300",
  message: "bg-gray-200 focus:ring focus:ring-gray-300",
};

const inputSizes = {
  sm: "px-3 py-2 text-sm",
  lg: "px-5 py-3 text-lg",
};

const common = "rounded-lg flex items-center border border-gray-300 focus:outline-none";

export const Inputelement: FC<InputTypo> = ({ variant, size, placeholder, type, className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${inputTypes[variant]} ${inputSizes[size]} ${common} ${className}`}
    />
  );
};
