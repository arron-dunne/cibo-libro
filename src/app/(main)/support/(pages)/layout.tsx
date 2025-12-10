import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SupportPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl w-full mx-auto mt-4">

      <Link href="/support" className="w-max mb-4 flex gap-2 items-center px-4 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blue">
        <ArrowLeft size={20} />
        <p className="text-lg font-semibold">Support Hub</p>
      </Link>

      {children}
    </div>
  )
}