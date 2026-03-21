function PrimaryButton() {
  return (
    <div className="px-5 py-3 rounded-full bg-linear-to-r from-orange-500 to-rose-500 border border-white/70 font-bold text-white">
      Primary Button
    </div>
  );
}

function SecondaryButton() {
  return (
    <div className="px-5 py-3 rounded-full bg-white border border-orange-300 font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">
      Secondary Button
    </div>
  );
}

function TertiaryButton() {
  return (
    <div className="px-5 py-3 rounded-full font-bold text-orange-500 hover:text-rose-500">
      Tertiary Button
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="w-full h-full flex justify-center items-center gap-30">
      <div className="flex flex-col gap-4">
        <PrimaryButton />
        <SecondaryButton />
        <TertiaryButton />
      </div>

      <div className="w-100 h-120 rounded-3xl bg-rose-50">
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
          <PrimaryButton />
          <SecondaryButton />
          <TertiaryButton />
        </div>
      </div>
    </div>
  );
}
