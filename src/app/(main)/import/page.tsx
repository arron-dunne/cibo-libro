import Image from "next/image";
import { importRecipe } from "./actions";
import { UrlInput } from "./UrlInput";
import {
  Download,
  LucideProps,
  MousePointerClick,
  UserPen,
  Handshake,
} from "lucide-react";
import { Header, SubHeader } from "@/app/components/text/Headers";

export default function ImportPage() {
  return (
    <div className="mt-12 max-w-3xl w-full mx-auto">
      {/* Header */}
      <Header>Import a recipe</Header>
      <SubHeader className="mt-2">
        Paste a link below and add it to your personal cookbook.
      </SubHeader>

      {/* Form */}
      <form action={importRecipe} className="mt-6">
        {/* Honeypot (bot trap) */}
        <div aria-hidden="true" className="hidden">
          <label className="block">
            Leave this empty:
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {/* URL field with pill layout */}
        <UrlInput />
      </form>

      {/* Feature cards */}
      <Header className="mt-12" textSize="text-4xl">How it works</Header>

      <div className="mt-8 px-2 space-y-8">
        <InfoCard
          Icon={MousePointerClick}
          title="Import in one click"
          desc="Paste a recipe link and we’ll save the it straight to your cookbook."
          iconStyle="bg-linear-to-br from-blue-300 to-cyan-300 text-blue-900"
        />
        <InfoCard
          Icon={Handshake}
          title="We respect other sites"
          desc="If a site won’t share, we’ll save a handy link card instead."
          iconStyle="bg-linear-to-br from-green-300 to-lime-300 text-green-900"
        />
        <InfoCard
          Icon={UserPen}
          title="Personalise it your way"
          desc="Add your personal tags any recipe"
          iconStyle="bg-linear-to-br from-purple-300 to-fuchsia-300 text-purple-900."
        />
      </div>
    </div>
  );
}

/** Reusable little card under the field */
function InfoCard({
  Icon,
  title,
  desc,
  iconStyle,
}: {
  Icon: React.ComponentType<LucideProps>;
  title: string;
  desc: string;
  iconStyle: string;
}) {
  return (
    <div className="w-full p-4 rounded-3xl bg-white flex gap-4">
      <div
        className={`w-16 md:w-20 h-14 md:h-18 shrink-0 flex justify-center items-center rounded-2xl md:rounded-2xl ${iconStyle}`}
      >
        <Icon className="w-8 h-8 md:w-10 md:h-10" />
      </div>
      <div>
        <h4 className="text-xl font-bold text-slate-800">{title}</h4>
        <p className="mt-1 text-slate-800">{desc}</p>
      </div>
    </div>
  );
}
