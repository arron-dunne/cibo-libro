import React from "react";
import { sansita } from "@/app/fonts";

export function Header({
  className,
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
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode
}) {
  return (
    <h6 className={`${className} text-lg text-slate-600 font-semibold`}>
      {children}
    </h6>
  )
}
