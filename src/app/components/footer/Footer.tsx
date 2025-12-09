import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/30 bg-white/10 py-8 text-white backdrop-blur" >
      <div className="mx-auto w-[min(1150px,95%)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="cibo libro"
            width={140}
            height={32}
            className="h-8 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
          />
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link className="hover:underline" href="/support">Support</Link>
          <Link className="hover:underline" href="/terms">Terms of Use</Link>
          <Link className="hover:underline" href="/privacy">Privacy Policy</Link>
          <Link className="hover:underline" href="/contact">Contact</Link>
        </nav>
        <div className="text-xs/6 opacity-90">© {new Date().getFullYear()} cibo libro. All rights reserved.</div>
      </div>
    </footer >
  )
}