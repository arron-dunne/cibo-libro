import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SupportPageLayout({ children }: { children: React.ReactElement }) {
  return (
    <div className="max-w-3xl w-full mx-auto mt-4">

      <Link href="/support" className="mb-4 flex gap-2 items-center">
        <div className="p-2 rounded-full bg-linear-to-r from-slate-200 to-slate-300 border border-white">
          <ArrowLeft size={20} />
        </div>
        <p className="text-lg font-semibold">Support Hub</p>
      </Link>

      {children}
    </div>
  )
}