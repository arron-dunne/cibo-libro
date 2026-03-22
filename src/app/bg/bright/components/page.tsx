import { PrimaryButton, SecondaryButton, TertiaryButton } from "@/app/components/page";

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
