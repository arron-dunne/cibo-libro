import React from "react";

type ButtonType = "button" | "submit";
type Size = "md" | "lg";

export function PrimaryButton({
  children,
  type="button",
  width="w-max",
  size="md",
  disabled=false
}: {
  children: React.ReactNode;
  type?: ButtonType;
  width?: string;
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
      sizeStyle = "px-3 py-2 text-md";
      break;
  }

  const disabledStyle = disabled ? "cursor-wait brightness-90": "cursor-pointer hover:brightness-90 active:brightness-75"

  return (
    <button
      className={`${width} h-max ${sizeStyle} ${disabledStyle} flex no-wrap justify-center items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold`}
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
  onClick,
}: {
  children: React.ReactNode;
  type?: ButtonType;
  width?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`${width} h-max flex no-wrap justify-center items-center gap-2 border border-orange-500 bg-orange-50/70 rounded-full px-3 py-2 text-orange-500 font-bold cursor-pointer hover:bg-orange-100 hover:border-orange-600 hover:text-orange-600`}
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
}: {
  children: React.ReactNode;
  type?: ButtonType;
}) {
  return (
    <button
      className="flex no-wrap justify-center items-center gap-2 text-orange-600 font-bold underline cursor-pointer hover:text-orange-700"
      type={type}
    >
      {children}
    </button>
  );
}
