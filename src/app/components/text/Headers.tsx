import React from "react";
import { sansita } from "@/app/fonts";

export function Header1({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={`${className} ${sansita.className} text-5xl text-rose-600 font-bold`}
    >
      {children}
    </h1>
  );
}
