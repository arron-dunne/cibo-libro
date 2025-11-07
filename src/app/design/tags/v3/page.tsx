export default async function Page() {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl -z-10"
      />

      <div className="flex justify-center mt-4">
        <div className="bg-white p-8">

          <Tag name="Dinner" />
        </div>
      </div>
    </>
  )
}

function Tag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700">
      {name}
    </span>

  )
}