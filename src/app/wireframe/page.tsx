// src/app/wireframes/page.tsx
import React from "react";

/**
 * Low-fi wireframes in one scrollable page.
 * - Mobile-first blocks with simple greys, dashed borders, and placeholder text.
 * - Each section includes a caption and an optional “notes” row for intent.
 * - Desktop widens content; mobile keeps narrow readable column.
 *
 * Tailwind required.
 */

export default function WireframesPage() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      {/* Page header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 rounded-sm bg-neutral-200" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-sm bg-neutral-200" />
              <div className="h-6 w-16 rounded-sm bg-neutral-200" />
              <div className="h-6 w-16 rounded-sm bg-neutral-200" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Intro />

        {/* 1. Library (Home) */}
        <Section title="1) Recipe Library (Home)" note="Core: find quickly. Search, tags, recent, favorites.">
          <PhoneFrame>
            <Bar>
              <Block w="w-6" />
              <Block w="w-24" />
              <Block w="w-8" />
            </Bar>

            <Pad>
              <InputStub label="Search…" />
              <PillRow pills={["All", "Dinner", "Vegan", "Quick"]} />

              <GridCards rows={3} />
            </Pad>

            <FAB label="+ Add" />
          </PhoneFrame>
        </Section>

        {/* 2. Recipe Detail */}
        <Section
          title="2) Recipe Detail"
          note="Hero image, quick stats, tags, ingredients (single column), steps timeline, notes, serve with."
        >
          <PhoneFrame>
            <Bar>
              <Block w="w-6" />
              <Block w="w-28" />
              <Block w="w-6" />
            </Bar>

            <HeroImage />

            <Pad>
              <TitleStub text="Spaghetti Carbonara" />
              <PillRow pills={["🇮🇹 Italian", "🍝 Pasta", "⚡ Quick"]} />
              <ParaStub lines={2} />

              <StatsRow items={["Prep 15m", "Cook 20m", "Total 35m", "Serves 4"]} />

              <Card title="Ingredients">
                <ListStub count={6} />
              </Card>

              <Card title="Steps (timeline)">
                <TimelineStub count={5} />
              </Card>

              <Card title="Notes">
                <ParaStub lines={3} />
              </Card>

              <Card title="Serve with">
                <LinkListStub items={["Garlic Bread", "Green Salad", "Crisp White Wine"]} />
              </Card>

              <ButtonRow buttons={["Start Cooking", "Share", "Edit"]} />
            </Pad>
          </PhoneFrame>
        </Section>

        {/* 3. Cook Mode */}
        <Section
          title="3) Cook Mode"
          note="Full-screen, one step per view, large type, swipe/next, optional timer if needed."
        >
          <PhoneFrame>
            <Bar>
              <Block w="w-10" />
              <Block w="w-24" />
              <Block w="w-10" />
            </Bar>

            <div className="space-y-4 p-4">
              <Subtle text="Step 1 of 5" />
              <BigLine />
              <ParaStub lines={2} />
              <div className="flex items-center justify-between">
                <ButtonStub w="w-24" label="← Back" />
                <ButtonStub w="w-28" label="Start 10:00" />
                <ButtonStub w="w-24" label="Next →" />
              </div>
            </div>
          </PhoneFrame>
        </Section>

        {/* 4. Add Recipe (Wizard) */}
        <Section
          title="4) Add Recipe (Wizard)"
          note="Gentle steps: Title → Ingredients → Steps → Tags & Image → Review & Save."
        >
          <PhoneFrame>
            <StepHeader step={1} label="Title & Description" />
            <Pad>
              <LabelStub text="Title" />
              <InputStub />

              <LabelStub text="Description" />
              <TextareaStub lines={3} />

              <NextBack />
            </Pad>
          </PhoneFrame>

          <Spacer />

          <PhoneFrame>
            <StepHeader step={2} label="Ingredients" />
            <Pad>
              <RepeaterStub itemLabel="Ingredient" rows={5} />
              <AddRow label="+ Add Ingredient" />
              <NextBack />
            </Pad>
          </PhoneFrame>

          <Spacer />

          <PhoneFrame>
            <StepHeader step={3} label="Steps" />
            <Pad>
              <RepeaterStub itemLabel="Step" rows={5} numbered />
              <AddRow label="+ Add Step" />
              <NextBack />
            </Pad>
          </PhoneFrame>

          <Spacer />

          <PhoneFrame>
            <StepHeader step={4} label="Tags & Image" />
            <Pad>
              <PillRow pills={["Dinner", "Quick", "Pasta"]} editable />
              <div className="mt-4 h-28 w-full rounded-md border border-dashed border-neutral-300 bg-neutral-100" />
              <NextBack primary="Save Recipe" />
            </Pad>
          </PhoneFrame>
        </Section>

        {/* 5. Import via URL */}
        <Section
          title="5) Import via URL"
          note="Paste a link → try to import → success OR fallback to link card with edit option."
        >
          <PhoneFrame>
            <Bar>
              <Block w="w-6" />
              <Block w="w-28" />
              <Block w="w-6" />
            </Bar>

            <Pad>
              <LabelStub text="Paste recipe link" />
              <InputStub placeholder="https://example.com/recipe" />
              <div className="mt-3 flex gap-2">
                <ButtonStub w="w-28" label="Import" />
                <ButtonStub w="w-40" label="Save as Link Only" />
              </div>

              <Divider />

              <Subtle text="If import fails:" />
              <InfoStub text="We’ll save a link card. You can add details later." />
            </Pad>
          </PhoneFrame>
        </Section>

        {/* 6. Public Recipe (Read-only) */}
        <Section
          title="6) Public Recipe (Read-only)"
          note="Clean detail page. No edit, minimal chrome, shareable link."
        >
          <PhoneFrame>
            <HeroImage />
            <Pad>
              <TitleStub text="Spaghetti Carbonara" />
              <ParaStub lines={2} />
              <StatsRow items={["Total 35m", "Serves 4"]} />
              <Card title="Ingredients">
                <ListStub count={4} />
              </Card>
              <Card title="Steps">
                <ListStub count={5} numbered />
              </Card>
              <ButtonRow buttons={["Open in App", "Share"]} />
            </Pad>
          </PhoneFrame>
        </Section>

        {/* 7. Profile & Settings */}
        <Section
          title="7) Profile & Settings"
          note="Basics only: name, avatar, data export, public recipe toggles."
        >
          <PhoneFrame>
            <Pad>
              <AvatarStub />
              <LabelStub text="Name" />
              <InputStub />
              <LabelStub text="Public recipes" />
              <ToggleStub />
              <Divider />
              <ButtonStub w="w-44" label="Export My Data" />
            </Pad>
          </PhoneFrame>
        </Section>

        {/* 8. Auth */}
        <Section title="8) Auth" note="Simple login/signup flow with forgot password.">
          <div className="grid gap-6 md:grid-cols-2">
            <PhoneFrame>
              <Pad>
                <TitleStub text="Log In" />
                <LabelStub text="Email" />
                <InputStub />
                <LabelStub text="Password" />
                <InputStub />
                <div className="mt-2 h-4 w-24 rounded-sm bg-neutral-200" />
                <div className="mt-4">
                  <ButtonStub w="w-24" label="Log In" />
                </div>
              </Pad>
            </PhoneFrame>

            <PhoneFrame>
              <Pad>
                <TitleStub text="Sign Up" />
                <LabelStub text="Email" />
                <InputStub />
                <LabelStub text="Password" />
                <InputStub />
                <div className="mt-4">
                  <ButtonStub w="w-28" label="Create Account" />
                </div>
              </Pad>
            </PhoneFrame>
          </div>
        </Section>

        {/* 9. Trust & Legal */}
        <Section title="9) Trust & Legal" note="Always accessible in the footer.">
          <DesktopFooter />
        </Section>
      </main>
    </div>
  );
}

/* -----------------------------
   Components (all in this file)
------------------------------*/

function Intro() {
  return (
    <section className="mb-8 rounded-xl border border-neutral-200 bg-white p-5">
      <h1 className="text-xl font-semibold">Wireframes: Cookbook Hub (Lo-Fi)</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Mobile-first blocks with dashed borders and neutral placeholders. Each section shows layout & flow only—
        no styling decisions locked in. Scroll to review all key screens.
      </p>
    </section>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-1 text-lg font-semibold">{title}</h2>
      {note && <p className="mb-4 text-sm text-neutral-600">{note}</p>}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">{children}</div>
    </section>
  );
}

/* Frames & primitives */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-neutral-300 bg-neutral-100 p-3 shadow-sm">
      <div className="mx-auto h-6 w-24 rounded-full bg-neutral-300/70" />
      <div className="mt-3 overflow-hidden rounded-2xl bg-white">{children}</div>
    </div>
  );
}

function Bar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
      {children}
    </div>
  );
}

function Block({ w = "w-20" }: { w?: string }) {
  return <div className={`h-4 rounded-sm bg-neutral-300 ${w}`} />;
}

function Pad({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 p-4">{children}</div>;
}

function InputStub({ label, placeholder }: { label?: string; placeholder?: string }) {
  return (
    <div>
      {label && <div className="mb-1 h-4 w-24 rounded-sm bg-neutral-200" />}
      <div className="h-10 w-full rounded-md border border-dashed border-neutral-300 bg-neutral-100" />
      {placeholder && <div className="mt-1 text-xs text-neutral-400">{placeholder}</div>}
    </div>
  );
}

function TextareaStub({ lines = 3 }: { lines?: number }) {
  return (
    <div className={`h-${lines * 8} w-full rounded-md border border-dashed border-neutral-300 bg-neutral-100`} />
  );
}

function LabelStub({ text }: { text: string }) {
  return <div className="h-4 w-32 rounded-sm bg-neutral-200">{/* {text} (visual label not needed in lo-fi) */}</div>;
}

function PillRow({ pills, editable }: { pills: string[]; editable?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((p) => (
        <div
          key={p}
          className="rounded-full border border-dashed border-neutral-300 bg-neutral-100 px-3 py-1 text-xs text-neutral-500"
        >
          {p}
        </div>
      ))}
      {editable && <div className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs text-neutral-400">+ Add tag</div>}
    </div>
  );
}

function GridCards({ rows = 2 }: { rows?: number }) {
  const items = Array.from({ length: rows * 2 });
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-dashed border-neutral-300">
          <div className="h-20 bg-neutral-200" />
          <div className="space-y-2 p-2">
            <div className="h-3 w-24 rounded-sm bg-neutral-300" />
            <div className="h-2 w-20 rounded-sm bg-neutral-200" />
            <div className="h-2 w-16 rounded-sm bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FAB({ label = "+" }: { label?: string }) {
  return (
    <div className="pointer-events-none relative">
      <div className="pointer-events-auto absolute bottom-4 right-4 rounded-full border border-dashed border-neutral-400 bg-white px-4 py-2 shadow">
        <div className="h-4 w-12 rounded-sm bg-neutral-300 text-center text-xs text-neutral-500">{label}</div>
      </div>
    </div>
  );
}

function HeroImage() {
  return <div className="h-40 w-full bg-neutral-200" />;
}

function TitleStub({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      <div className="h-4 w-48 rounded-sm bg-neutral-300" />
      <div className="h-3 w-24 rounded-sm bg-neutral-200" />
    </div>
  );
}

function ParaStub({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 w-full rounded-sm bg-neutral-200" />
      ))}
    </div>
  );
}

function StatsRow({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => (
        <div key={it} className="rounded-md border border-dashed border-neutral-300 bg-neutral-100 px-3 py-2 text-xs text-neutral-500">
          {it}
        </div>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 p-3">
      <div className="h-4 w-28 rounded-sm bg-neutral-300">{/* {title} */}</div>
      {children}
    </div>
  );
}

function ListStub({ count = 5, numbered = false }: { count?: number; numbered?: boolean }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-start gap-2">
          {numbered ? (
            <div className="h-4 w-5 rounded-sm bg-neutral-200 text-center text-[10px] text-neutral-500">{i + 1}</div>
          ) : (
            <div className="mt-0.5 h-2 w-2 rounded-full bg-neutral-300" />
          )}
          <div className="h-3 w-full rounded-sm bg-neutral-200" />
        </li>
      ))}
    </ul>
  );
}

function TimelineStub({ count = 4 }: { count?: number }) {
  return (
    <div className="relative pl-4">
      <div className="absolute left-1 top-0 h-full w-px bg-neutral-300" />
      <ul className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="relative">
            <div className="absolute left-0 top-1 h-2 w-2 -translate-x-[5px] rounded-full bg-neutral-400" />
            <div className="h-3 w-full rounded-sm bg-neutral-200" />
            <div className="mt-1 h-3 w-4/5 rounded-sm bg-neutral-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkListStub({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-center justify-between">
          <div className="h-3 w-40 rounded-sm bg-neutral-200" />
          <div className="h-3 w-10 rounded-sm bg-neutral-100" />
        </li>
      ))}
    </ul>
  );
}

function ButtonRow({ buttons }: { buttons: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((b) => (
        <ButtonStub key={b} label={b} />
      ))}
    </div>
  );
}

function ButtonStub({ label, w = "w-28" }: { label: string; w?: string }) {
  return (
    <div className={`rounded-md border border-dashed border-neutral-300 bg-neutral-100 px-3 py-2 text-center text-xs text-neutral-500 ${w}`}>
      {label}
    </div>
  );
}

function Subtle({ text }: { text: string }) {
  return <div className="text-xs text-neutral-500">{text}</div>;
}

function StepHeader({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
      <div className="h-4 w-20 rounded-sm bg-neutral-300" />
      <div className="text-xs text-neutral-500">Step {step}/4</div>
    </div>
  );
}

function RepeaterStub({ itemLabel, rows = 4, numbered = false }: { itemLabel: string; rows?: number; numbered?: boolean }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          {numbered && <div className="h-6 w-6 rounded-sm bg-neutral-200 text-center text-[10px] leading-6 text-neutral-500">{i + 1}</div>}
          <div className="h-10 w-full rounded-md border border-dashed border-neutral-300 bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

function AddRow({ label = "+ Add" }: { label?: string }) {
  return (
    <div className="mt-2 h-8 w-40 rounded-md border border-dashed border-neutral-300 bg-neutral-100 text-center text-xs leading-8 text-neutral-500">
      {label}
    </div>
  );
}

function NextBack({ primary = "Next →" }: { primary?: string }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <ButtonStub w="w-24" label="← Back" />
      <ButtonStub w="w-28" label={primary} />
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px w-full bg-neutral-200" />;
}

function InfoStub({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-100 px-3 py-2 text-xs text-neutral-600">
      {text}
    </div>
  );
}

function AvatarStub() {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-neutral-200" />
      <div className="space-y-2">
        <div className="h-3 w-24 rounded-sm bg-neutral-300" />
        <div className="h-2 w-16 rounded-sm bg-neutral-200" />
      </div>
    </div>
  );
}

function DesktopFooter() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-5 w-28 rounded-sm bg-neutral-200" />
        <div className="flex gap-3">
          {["About", "Support", "Contact", "Privacy", "Terms"].map((l) => (
            <div key={l} className="h-4 w-16 rounded-sm bg-neutral-200" />
          ))}
        </div>
        <div className="h-4 w-40 rounded-sm bg-neutral-100" />
      </div>
    </div>
  );
}

function Spacer() {
  return <div className="my-6 h-0" />;
}

function BigLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-8 ${w} rounded-md bg-neutral-200`} />;
}

function ToggleStub({ on = false }: { on?: boolean }) {
  return (
    <div className="relative h-7 w-12 rounded-full border border-dashed border-neutral-300 bg-neutral-100">
      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-neutral-300 transition-all ${
          on ? "right-1" : "left-1"
        }`}
      />
    </div>
  );
}

