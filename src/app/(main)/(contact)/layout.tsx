import Link from "next/link";

export default function ContactLayout({ children }: { children: React.ReactElement }) {
  return (
    <div className="flex gap-4 justify-center mt-6">
      {/* Side panel */}
      <div className="h-max p-2 bg-white/90 rounded-3xl">
        <LinkButton label="Feedback" href="/feedback"/>
        <LinkButton label="Issues" href="/issues"/>
        <LinkButton label="Copyright" href="/copywright"/>
        <LinkButton label="General" href="/general"/>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

function LinkButton({label, href}: {label: string, href: string}) {
  return (
    <Link className="px-4 py-2 rounded-full bg-white" href={href}>{label}</Link>
  )
}