import React from "react";
import { sansita } from "@/app/fonts";

export function Header({
  className = "",
  textSize="text-5xl",
  children,
}: {
  className?: string;
  textSize?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={`${className} ${sansita.className} ${textSize} text-rose-600 font-bold`}
    >
      {children}
    </h1>
  );
}

export function SubHeader({
  className = "",
  textSize="text-lg",
  children,
}: {
  className?: string;
  textSize?: string;
  children: React.ReactNode
}) {
  return (
    <h6 className={`${className} ${textSize} text-black font-medium flex gap-2 items-center`}>
      {children}
    </h6>
  )
}
