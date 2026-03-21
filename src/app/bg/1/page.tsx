
export default async function Page() {

  return (
    <>
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10"
      />
    </>
  )
}
