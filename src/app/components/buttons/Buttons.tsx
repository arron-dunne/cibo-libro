import { LucideIcon, LucideProps } from "lucide-react";
import React from "react";

type ButtonType = "button" | "submit";
type Size = "md" | "lg";

export function PrimaryButton({
  className,
  children,
  type="button",
  width="w-max",
  height="h-max",
  size="md",
  disabled=false,
}: {
  className?: string;
  children: React.ReactNode;
  type?: ButtonType;
  width?: string;
  height?: string;
  size?: Size;
  disabled?: Boolean;
}) {
  let sizeStyle: string;
  switch (size) {
    case "lg":
      sizeStyle = "px-4 py-3 text-xl";
      break;

    case "md":
    default:
      sizeStyle = "px-4 py-2 text-md";
      break;
  }

  const disabledStyle = disabled
    ? "cursor-wait brightness-90"
    : "cursor-pointer hover:brightness-90 active:brightness-75";

  return (
    <button
      className={`${className} ${width} ${height} ${sizeStyle} ${disabledStyle} flex no-wrap justify-center items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold`}
      type={type}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  type = "button",
  width = "w-max",
  size = "md",
  onClick,
}: {
  children: React.ReactNode;
  type?: ButtonType;
  width?: string;
  size?: Size;
  onClick?: () => void;
}) {
  let sizeStyle: string;
  switch (size) {
    case "lg":
      sizeStyle = "px-4 py-3 text-xl";
      break;

    case "md":
    default:
      sizeStyle = "px-3 py-2 text-md";
      break;
  }

  return (
    <button
      className={`${width} ${sizeStyle} h-max flex gap-2 items-center rounded-full bg-white/50 backdrop-blur-lg border border-rose-500 text-rose-500 font-bold cursor-pointer hover:brightness-95`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TeriaryButton({
  children,
  type = "button",
  textSize="text-md",
}: {
  children: React.ReactNode;
  type?: ButtonType;
  textSize?: string;
}) {

  return (
    <button
      className={`${textSize} flex no-wrap justify-center items-center gap-2 text-orange-600 font-bold underline cursor-pointer hover:text-orange-700`}
      type={type}
    >
      {children}
    </button>
  );
}
