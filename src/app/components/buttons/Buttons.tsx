import React, { ButtonHTMLAttributes } from "react";

type Size = "md" | "lg" | "xl" | "custom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  width?: string;
  height?: string;
  invalid?: boolean;
}

export function PrimaryButton({
  size = "md",
  width = "w-max",
  height = "h-max",
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  let sizeStyle: string;
  switch (size) {
    case "xl":
      sizeStyle = "px-9 py-5 text-2xl";
      break;

    case "lg":
      sizeStyle = "px-4 py-3 text-xl";
      break;

    case "md":
      sizeStyle = "px-4 py-2 text-md";
      break;

    case "custom":
    default:
      sizeStyle = "";
      break;
  }

  const disabledStyle = disabled
    ? "cursor-wait brightness-90"
    : "cursor-pointer hover:brightness-90 active:brightness-75";

  return (
    <button
      className={`${className} ${width} ${height} ${sizeStyle} ${disabledStyle} flex no-wrap justify-center items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  size = "md",
  width = "w-max",
  height = "h-max",
  children,
  disabled,
  ...props
}: ButtonProps) {
  let sizeStyle: string;
  switch (size) {
    case "lg":
      sizeStyle = "px-4 py-3 text-xl";
      break;

    case "md":
      sizeStyle = "px-3 py-2 text-md";
      break;

    case "custom":
    default:
      sizeStyle = "";
      break;
  }

  return (
    <button
      className={`${width} ${height} ${sizeStyle} flex gap-2 justify-center items-center rounded-full bg-white/70 backdrop-blur-lg border border-rose-500 text-rose-500 font-bold cursor-pointer hover:brightness-95`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TertiaryButton({ children, className="", ...props }: ButtonProps) {
  return (
    <button
      className={`${className} flex no-wrap justify-center items-center gap-2 text-orange-600 font-bold underline cursor-pointer border border-transparent active:border-orange-500`}
      {...props}
    >
      {children}
    </button>
  );
}
