import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SupportPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl w-full mx-auto mt-12">
      {children}
    </div>
  );
}
