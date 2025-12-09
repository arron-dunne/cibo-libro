import { Bug, Lightbulb, LucideIcon, LucideProps, MessageCircle } from "lucide-react"
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="max-w-lg mx-auto">
      <p className="mt-4 mb-4 text-center text-lg font-semibold">How can we help you?</p>
      <div className="flex gap-8 justify-center">
        <FormButton name="Feedback"/>
        <FormButton name="Issues"/>
        <FormButton name="General"/>
      </div>
    </div>
  )
}

function FormButton({name}: {name: string}) {
  
  let href : string | undefined;
  let Icon : React.ComponentType<LucideProps>; 

  switch (name) {
    case "Feedback":
      href = "/feedback";
      Icon = Lightbulb;
      break;
    case "Issues":
      href = "/issues"
      Icon = Bug;
      break;
    case "General":
    default:
      href = "/contact"
      Icon = MessageCircle;
  }

  return (
    <Link 
      className="w-32 h-32 rounded-2xl shadow flex flex-col items-center justify-center gap-4 bg-linear-to-br from-orange-100 to-rose-200 border border-white/80 text-orange-500 font-bold"
      href={href}
    >
      <Icon size={32}/>
      {name}
    </Link>
  )
}