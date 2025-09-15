export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10"
      />
      { children }
    </>
  )
}
