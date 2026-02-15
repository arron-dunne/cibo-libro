import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-8 p-6 sm:p-8 mx-auto max-w-md rounded-3xl border border-white/70 bg-white/95 backdrop-blur shadow-lg text-center">
      <h1 className="text-2xl font-bold">Recipe not found</h1>
      <p className="mt-2 text-gray-600">
        This recipe doesn't seem to exist in your cookbook.
      </p>
      <div className="mt-6">
        <Link
          href="/all"
          className="mx-auto rounded-full w-max items-center bg-orange-600 flex gap-2 px-4 py-2 font-semibold text-white hover:bg-orange-700"
        >
          <ArrowLeft size={20} />
          <span>Back to your Cookbook</span>
        </Link>
      </div>
    </div>
  );
}
