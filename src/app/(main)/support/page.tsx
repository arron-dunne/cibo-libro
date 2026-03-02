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
      <h2
        className="mt-6 mb-6 text-center text-4xl text-white font-extrabold"
        style={{ WebkitTextStroke: "4px black", paintOrder: "stroke fill" }}
      >
        Get in touch
      </h2>
      <div className="flex flex-col mx-auto max-w-md md:max-w-none md:flex-row gap-4 md:gap-12 items-center justify-center">
        <PrimaryLink name="Feedback" />
        <PrimaryLink name="Issues" />
        <PrimaryLink name="General" />
      </div>

      <h3
        className="mt-14 mb-6 text-center text-4xl text-white font-extrabold"
        style={{ WebkitTextStroke: "4px black", paintOrder: "stroke fill" }}
      >
        More Information
      </h3>
      <div className="max-w-md mx-auto flex flex-col gap-4 items-center">
        <SecondaryLink name="Terms of Service" />
        <SecondaryLink name="Privacy Policy" />
        <SecondaryLink name="Copyright Protection" />
      </div>
    </div>
  );
}

function PrimaryLink({ name }: { name: string }) {
  let href: string | undefined;
  let Icon: React.ComponentType<LucideProps>;

  switch (name) {
    case "Feedback":
      href = "/support/feedback";
      Icon = Lightbulb;
      break;
    case "Issues":
      href = "/support/issues";
      Icon = Bug;
      break;
    case "General":
    default:
      href = "/support/contact";
      Icon = MessageCircle;
  }

  return (
    <Link
      className="w-full md:aspect-square px-6 py-4 rounded-3xl shadow-lg 
        flex md:flex-col items-center justify-start md:justify-center gap-4
      bg-white/70 backdrop-blur-sm border border-white/80 
      text-orange-600 font-bold
        hover:brightness-110 active:brightness-125 md:hover:brightness-100 md:active:brightness-100 
        transition-transform md:hover:scale-110 md:active:scale-105"
      href={href}
    >
      <Icon className="w-6 md:w-20 md:h-20" />
      <div className="w-full flex items-center gap-2 justify-between md:justify-center">
        <p className="text-xl">{name}</p>
        <ChevronRight />
      </div>
    </Link>
  );
}

function SecondaryLink({ name }: { name: string }) {
  let href: string;
  let Icon: React.ComponentType<LucideProps>;

  switch (name) {
    case "Terms of Service":
      href = "/support/terms";
      Icon = FileText;
      break;
    case "Privacy Policy":
      href = "/support/privacy";
      Icon = Lock;
      break;
    case "Copyright Protection":
    default:
      href = "/support/copyright";
      Icon = Copyright;
  }

  return (
    <Link
      href={href}
      className="w-full flex justify-between px-6 py-4 rounded-3xl
      bg-linear-to-r from-slate-200 to-slate-300 border border-white/90
      hover:brightness-90 active:brightness-75"
    >
      <div className="flex gap-4">
        <Icon size={24} />
        {name}
      </div>
      <ChevronRight />
    </Link>
  );
}
