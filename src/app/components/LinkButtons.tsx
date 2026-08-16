import React, { AnchorHTMLAttributes } from "react";

type Size = "md" | "lg" | "xl" | "custom";

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  size?: Size;
  width?: string;
  height?: string;
  invalid?: boolean;
  disabled?: boolean;
}

interface TertiaryLinkButtonProps extends LinkButtonProps {
  underline?: boolean;
}

export function PrimaryLinkButton({
  size = "md",
  width = "w-max",
  height = "h-max",
  disabled = false,
  className = "",
  children,
  ...props
}: LinkButtonProps) {
  let sizeStyle: string;
  switch (size) {
    case "xl":
      sizeStyle = "px-9 py-5 text-2xl";
      break;

    case "lg":
      sizeStyle = "px-5 py-3 text-xl";
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
    <a
      className={`${width} ${height} ${sizeStyle} ${disabledStyle} flex no-wrap justify-center items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function SecondaryLinkButton({
  size = "md",
  width = "w-max",
  height = "h-max",
  className = "",
  children,
  disabled = false,
  ...props
}: LinkButtonProps) {
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

  const disabledStyle = disabled
    ? "cursor-not-allowed brightness-90"
    : "cursor-pointer hover:bg-stone-100/70 active:bg-rose-200/80";

  return (
    <a
      className={`${width} ${height} ${sizeStyle} ${disabledStyle} flex gap-2 justify-center items-center rounded-full bg-white/50 backdrop-blur-lg border border-orange-500/70 text-orange-500 font-bold ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function TertiaryLinkButton({
  children,
  underline = true,
  className = "",
  ...props
}: TertiaryLinkButtonProps) {
  return (
    <a
      className={`${underline ? "underline" : ""} flex no-wrap justify-center items-center gap-2 text-orange-600 font-bold cursor-pointer border border-transparent hover:brightness-125 active:brightness-90 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
