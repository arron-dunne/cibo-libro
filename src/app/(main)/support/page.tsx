import { TertiaryButton } from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";
import {
  Bug,
  ChevronRight,
  Copyright,
  FileText,
  Lightbulb,
  Lock,
  LucideProps,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Header className="mt-12">Get in touch</Header>
      <div className="mt-4 text-lg">
        <p>
          We love to hear from you! If you have feedback, issues or general
          enquiries you'd like to send us, get in touch using the links below.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 ">
        <Link href="/support/feedback">
          <div className="w-max px-6 py-3 flex gap-2 items-center rounded-full text-white text-xl font-bold bg-linear-to-br from-amber-400 to-orange-600 border border-white/60 cursor-pointer hover:brightness-95 active:brightness-75">
            <Lightbulb />
            Feedback
          </div>
        </Link>
        <Link href="/support/issue">
          <div className="w-max px-6 py-3 flex gap-2 items-center rounded-full text-white text-xl font-bold bg-linear-to-br from-red-400 to-red-600 border border-white/60 cursor-pointer hover:brightness-95 active:brightness-75">
            <Bug />
            Issue / Bug
          </div>
        </Link>
        <Link href="/support/">
          <div className="w-max px-6 py-3 flex gap-2 items-center rounded-full text-white text-xl font-bold bg-linear-to-br from-blue-400 to-blue-600 border border-white/60 cursor-pointer hover:brightness-95 active:brightness-75">
            <MessageCircle />
            General Enquiry
          </div>
        </Link>
      </div>
    </div>
  );
}
