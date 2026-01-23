import Image from "next/image";
import { importRecipe } from "./actions";
import { UrlInput } from "./UrlInput";
import { Download, LucideProps, MousePointerClick, UserPen, Handshake } from "lucide-react";

export default function ImportPage() {
  return (
    <div className="max-w-4xl w-full mx-auto">
      <div className="mt-8 p-6 sm:p-8 rounded-3xl border border-white/70 bg-white/95 backdrop-blur shadow-lg">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 md:mb-8">
          <div className="w-20 h-16 sm:w-20 sm:h-18 flex items-center justify-center rounded-3xl sm:rounded-3xl bg-linear-to-br from-rose-300 to-fuchsia-300 text-rose-900">
            <Download aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10"/>
          </div>
          <div className="text-center sm:text-start">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              Import a recipe
            </h1>
            <p className="mt-2 text-[15px] text-gray-700">
              Paste a link to add it to your personal cookbook
            </p>
          </div>
        </div>

        {/* Form */}
        <form action={importRecipe} className="space-y-5">
          {/* Honeypot (bot trap) */}
          <div aria-hidden="true" className="hidden">
            <label className="block">
              Leave this empty:
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {/* URL field with pill layout */}
          <UrlInput />

        </form>
      </div>

      {/* Feature cards */}
      <Image className="mt-12 w-60 mx-auto md:mx-4" src="/images/how-it-works.png" alt="How it works" width={830} height={112}/>

      <div className="mt-8 flex flex-col md:flex-row gap-8 md:gap-4">
        <InfoCard
          Icon={MousePointerClick}
          title="Import in one click"
          desc="Paste a recipe link and we’ll save the it straight to your cookbook"
          iconStyle="bg-linear-to-br from-blue-300 to-cyan-300 text-blue-900"
          />
        <InfoCard
          Icon={Handshake}
          title="We respect other sites"
          desc="If a site won’t share, we’ll save a handy link card instead so you can easily remember"
          iconStyle="bg-linear-to-br from-green-300 to-lime-300 text-green-900"
          />
        <InfoCard
          Icon={UserPen}
          title="Personalise it your way"
          desc="Add your personal tags, notes and rating to any recipe"
          iconStyle="bg-linear-to-br from-purple-300 to-fuchsia-300 text-purple-900"
        />
      </div>
    </div>
  )
}

/** Reusable little card under the field */
function InfoCard({
  Icon,
  title,
  desc,
  iconStyle
}: {
  Icon: React.ComponentType<LucideProps>;
  title: string;
  desc: string;
  iconStyle: string
}) {
  return (
    <div className="w-full max-w-lg mx-auto md:w-1/3 p-4 rounded-3xl border border-white/70 bg-white/95 shadow-lg flex gap-4">
      <div className={`w-20 h-18 md:w-12 md:h-12 shrink-0 flex justify-center items-center rounded-3xl md:rounded-2xl ${iconStyle}`}>
        <Icon className="w-8 h-8 md:w-6 md:h-6"/>
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-sm leading-6 text-gray-700">{desc}</p>
      </div>
    </div>
  );
}
