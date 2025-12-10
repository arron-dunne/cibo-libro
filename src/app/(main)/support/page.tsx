import { Bug, ChevronRight, Copyright, FileText, Lightbulb, Lock, LucideIcon, LucideProps, MessageCircle } from "lucide-react"
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <p className="mt-6 mb-6 text-center text-4xl text-white font-extrabold tracking-tighter">
        Get in touch
      </p>
      <div className="flex gap-16 justify-center">
        <PrimaryLink name="Feedback"/>
        <PrimaryLink name="Issues"/>
        <PrimaryLink name="General"/>
      </div>

      <p className="mt-14 mb-6 text-center text-4xl text-white font-extrabold tracking-tighter">
        More Information
      </p>
      <div className="max-w-md mx-auto flex flex-col gap-4 items-center">
        <SecondaryLink name="Terms of Service"/>
        <SecondaryLink name="Privacy Policy"/>
        <SecondaryLink name="Copyright Protection"/>
      </div>
    </div>
  )
}

function PrimaryLink({name}: {name: string}) {
  
  let href : string | undefined;
  let Icon : React.ComponentType<LucideProps>; 

  switch (name) {
    case "Feedback":
      href = "/support/feedback";
      Icon = Lightbulb;
      break;
    case "Issues":
      href = "/support/issues"
      Icon = Bug;
      break;
    case "General":
    default:
      href = "/support/contact"
      Icon = MessageCircle;
  }

  return (
    <Link 
      className="w-full aspect-square rounded-2xl shadow-lg 
        flex flex-col items-center justify-center gap-4
      bg-white/70 backdrop-blur-sm border border-white/80 
      text-orange-600 font-bold
        transition hover:scale-110 active:scale-105"
      href={href}
    >
      <Icon className="w-1/3 h-1/3"/>
      <p className="text-xl">{name}</p>
    </Link>
  )
}

function SecondaryLink({name}: {name: string}) {
  
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
        <Icon />
        {name}
      </div>
      <ChevronRight />
    </Link>
  )
}