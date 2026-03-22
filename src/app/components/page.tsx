export function PrimaryButton({ text }: { text: string }) {
  return (
    <div className="px-5 py-3 rounded-full bg-linear-to-r from-orange-500 to-rose-500 border border-white/70 font-bold text-white">
      { text }
    </div>
  );
}

export function SecondaryButton({ text }: { text: string }) {
  return (
    <div className="px-5 py-3 rounded-full bg-white/50 border border-orange-300 font-bold text-orange-500">
      { text }
    </div>
  );
}

export function TertiaryButton({ text }: { text: string }) {
  return (
    <div className="px-5 py-3 rounded-full font-bold text-orange-500 underline">
      { text }
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="w-full h-full flex justify-center items-center gap-30">
      <div className="flex flex-col gap-4">
        <PrimaryButton text="Primary Button" />
        <SecondaryButton text="Secondary Button" />
        <TertiaryButton text="Tertiary Button" />
      </div>

      <div className="w-100 h-120 rounded-3xl bg-rose-50">
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
          <PrimaryButton text="Primary Button" />
          <SecondaryButton text="Secondary Button" />
          <TertiaryButton text="Tertiary Button" />
        </div>
      </div>
    </div>
  );
}
