import { CheckCircle, CircleX } from "lucide-react";

export function SuccessBanner({ text }: { text: string }) {
  return (
    <div className="mb-8 flex gap-4 items-center rounded-2xl bg-green-100/70 border border-green-600/70 p-6 text-green-800">
      <CheckCircle size={28} className="hidden sm:block shrink-0" />
      <p className="font-semibold">{text}</p>
    </div>
  );
}

export function ErrorBanner({ text }: { text: string }) {
  return (
    <div className="mb-8 rounded-3xl bg-red-200/90 border border-red-500/50 p-6 text-red-800 shadow">
      <h2 className="text-xl sm:text-2xl font-semibold mb-1 flex items-center gap-4">
        <CircleX size={28} className="hidden sm:block shrink-0" />
        Something went wrong
      </h2>
      <p className="sm:ml-11 text-sm sm:text-base">{text}</p>
    </div>
  );
}
