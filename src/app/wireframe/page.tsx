// src/app/wireframes/page.tsx
import React from "react";

/**
 * Low-fi, labeled wireframes
 * - Left: Mobile (phone frame)
 * - Right: Desktop (browser frame)
 * - All in one server component file
 * - Tailwind required
 */

export default function WireframesPage() {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Box className="h-6 w-32" label="Wireframes" />
            <div className="flex gap-2">
              <Box className="h-6 w-24" label="Index" />
              <Box className="h-6 w-24" label="Notes" />
              <Box className="h-6 w-24" label="Export" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Intro />

        {/* 1. Library (Home) */}
        <Section title="1) Recipe Library (Home)" note="Find quickly: search, filter by tags, favorites.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <TopBar>
                <Box className="h-4 w-16" label="Logo" />
                <Box className="h-4 w-24" label="Search" />
                <Box className="h-4 w-16" label="+ Add" />
              </TopBar>
              <Pad>
                <InputStub label="Search input" />
                <PillRow pills={["All", "Dinner", "Vegan", "Quick"]} />
                <GridCards rows={3} />
                <EmptyState />
              </Pad>
              <FAB label="+ Add Recipe" />
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Logo" />
                <Box className="h-5 w-72" label="Search" />
                <div className="flex gap-2">
                  <Box className="h-5 w-20" label="Filter" />
                  <Box className="h-5 w-20" label="Sort" />
                  <Box className="h-5 w-24" label="+ Add" />
                </div>
              </Toolbar>
              <Pad wide>
                <PillRow pills={["All", "Dinner", "Vegan", "Quick", "Favorites"]} />
                <GridCards rows={2} desktop />
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 2. Recipe Detail */}
        <Section
          title="2) Recipe Detail"
          note="Hero, quick stats, tags, ingredients (single column), steps timeline, notes, serve with."
        >
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <TopBar>
                <Box className="h-4 w-12" label="Back" />
                <Box className="h-4 w-36" label="Title" />
                <Box className="h-4 w-12" label="Save" />
              </TopBar>
              <Hero label="Hero image" />
              <Pad>
                <Title line1="Spaghetti Carbonara" line2="Subtitle / Source" />
                <PillRow pills={["🇮🇹 Italian", "🍝 Pasta", "⚡ Quick"]} />
                <Para lines={2} label="Short description" />
                <StatsRow items={["Prep 15m", "Cook 20m", "Total 35m", "Serves 4"]} />
                <Card title="Ingredients">
                  <List count={6} label="Ingredient" />
                </Card>
                <Card title="Steps (timeline)">
                  <Timeline count={5} />
                </Card>
                <Card title="Notes">
                  <Para lines={3} label="User notes" />
                </Card>
                <Card title="Serve with">
                  <LinkList items={["Garlic Bread", "Green Salad", "Crisp White Wine"]} />
                </Card>
                <Buttons labels={["Start Cooking", "Share", "Edit"]} />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Logo" />
                <div className="flex gap-2">
                  <Box className="h-5 w-24" label="Back" />
                  <Box className="h-5 w-48" label="Breadcrumbs" />
                </div>
                <div className="flex gap-2">
                  <Box className="h-5 w-20" label="Share" />
                  <Box className="h-5 w-20" label="Save" />
                  <Box className="h-5 w-20" label="Edit" />
                </div>
              </Toolbar>
              <Pad wide>
                <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                  <Hero className="h-56" label="Hero image" />
                  <div className="space-y-4">
                    <Title line1="Spaghetti Carbonara" line2="Subtitle / Source" />
                    <PillRow pills={["Italian", "Pasta", "Quick"]} />
                    <StatsRow items={["Prep 15m", "Cook 20m", "Total 35m", "Serves 4"]} />
                    <Buttons labels={["Start Cooking", "Share", "Save", "Edit"]} inline />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-4">
                    <Card title="Ingredients">
                      <List count={10} label="Ingredient" />
                    </Card>
                    <Card title="Notes">
                      <Para lines={5} label="User notes" />
                    </Card>
                    <Card title="Serve with">
                      <LinkList items={["Garlic Bread", "Green Salad", "Crisp White Wine"]} />
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <Card title="Steps (timeline)">
                      <Timeline count={7} />
                    </Card>
                  </div>
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 3. Cook Mode */}
        <Section title="3) Cook Mode" note="Full-screen, one step per view, large type, next/back, optional timer.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <TopBar>
                <Box className="h-4 w-12" label="Exit" />
                <Box className="h-4 w-24" label="Step 1/5" />
                <Box className="h-4 w-12" label="Options" />
              </TopBar>
              <Pad>
                <BigLine label="Current step text" />
                <Para lines={2} label="Additional instructions" />
                <div className="flex items-center justify-between">
                  <Button label="← Back" w="w-28" />
                  <Button label="Start 10:00" w="w-32" />
                  <Button label="Next →" w="w-28" />
                </div>
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Cook Mode" />
                <Box className="h-5 w-40" label="Step 1 of 5" />
                <Box className="h-5 w-24" label="Exit" />
              </Toolbar>
              <Pad wide>
                <div className="mx-auto max-w-3xl space-y-6">
                  <BigLine label="Current step text (large)" h="h-12" />
                  <Para lines={2} label="Supporting copy" />
                  <div className="flex items-center justify-center gap-3">
                    <Button label="← Back" w="w-32" />
                    <Button label="Start 10:00" w="w-40" />
                    <Button label="Next →" w="w-32" />
                  </div>
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 4. Add Recipe (Wizard – first step shown) */}
        <Section
          title="4) Add Recipe (Wizard)"
          note="Guided steps: Title → Ingredients → Steps → Tags & Image → Review & Save."
        >
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <StepHeader step={1} label="Title & Description" />
              <Pad>
                <Field label="Title" />
                <InputStub label="Title input" />
                <Field label="Description" />
                <Textarea lines={3} label="Description input" />
                <NavRow back="Back" next="Next →" />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Add Recipe" />
                <Box className="h-5 w-48" label="Step 1: Title & Description" />
                <Box className="h-5 w-24" label="Cancel" />
              </Toolbar>
              <Pad wide>
                <div className="mx-auto max-w-3xl space-y-4">
                  <Field label="Title" />
                  <InputStub label="Title input" />
                  <Field label="Description" />
                  <Textarea lines={4} label="Description input" />
                  <NavRow back="Back" next="Next →" />
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 5. Import via URL */}
        <Section title="5) Import via URL" note="Paste link → try to import → success or fallback to link card and edit.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <TopBar>
                <Box className="h-4 w-16" label="Back" />
                <Box className="h-4 w-28" label="Import" />
                <Box className="h-4 w-12" label="Help" />
              </TopBar>
              <Pad>
                <Field label="Paste recipe link" />
                <InputStub label="URL input" />
                <div className="mt-2 flex gap-2">
                  <Button label="Import" w="w-28" />
                  <Button label="Save as Link Only" w="w-40" />
                </div>
                <Divider />
                <Info text="If import fails, we’ll save a link card. You can add details later." />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Import" />
                <Box className="h-5 w-80" label="Paste URL → Import" />
                <Box className="h-5 w-24" label="Help" />
              </Toolbar>
              <Pad wide>
                <div className="mx-auto max-w-3xl space-y-4">
                  <Field label="Paste recipe link" />
                  <InputStub label="URL input" />
                  <div className="flex gap-2">
                    <Button label="Import" w="w-32" />
                    <Button label="Save as Link Only" w="w-48" />
                  </div>
                  <Divider />
                  <Info text="Fallback: store external link as a card; user can edit later." />
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 6. Public Recipe (Read-only) */}
        <Section title="6) Public Recipe (Read-only)" note="Clean detail page; no edit; shareable link.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <Hero label="Hero image" />
              <Pad>
                <Title line1="Spaghetti Carbonara" line2="Public view" />
                <StatsRow items={["Total 35m", "Serves 4"]} />
                <Card title="Ingredients">
                  <List count={5} label="Ingredient" />
                </Card>
                <Card title="Steps">
                  <List count={5} label="Step" numbered />
                </Card>
                <Buttons labels={["Open in App", "Share"]} />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Logo" />
                <Box className="h-5 w-40" label="Public Recipe" />
                <Box className="h-5 w-20" label="Share" />
              </Toolbar>
              <Pad wide>
                <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                  <Hero className="h-56" label="Hero image" />
                  <div className="space-y-4">
                    <Title line1="Spaghetti Carbonara" line2="Public view" />
                    <StatsRow items={["Total 35m", "Serves 4"]} />
                    <Buttons labels={["Open in App", "Share"]} inline />
                  </div>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <Card title="Ingredients">
                    <List count={10} label="Ingredient" />
                  </Card>
                  <Card title="Steps">
                    <List count={8} label="Step" numbered />
                  </Card>
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 7. Profile & Settings */}
        <Section title="7) Profile & Settings" note="Name, avatar, public toggle, export data.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <Pad>
                <Avatar />
                <Field label="Name" />
                <InputStub label="Name input" />
                <Field label="Public recipes" />
                <Toggle on />
                <Divider />
                <Button label="Export My Data" w="w-40" />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Toolbar>
                <Box className="h-5 w-28" label="Profile" />
                <Box className="h-5 w-56" label="Account Settings" />
                <Box className="h-5 w-20" label="Save" />
              </Toolbar>
              <Pad wide>
                <div className="mx-auto max-w-3xl space-y-4">
                  <div className="flex items-center gap-4">
                    <Box className="h-16 w-16 rounded-full" label="Avatar" />
                    <Box className="h-5 w-40" label="Username" />
                  </div>
                  <Field label="Name" />
                  <InputStub label="Name input" />
                  <Field label="Public recipes" />
                  <Toggle on />
                  <Divider />
                  <Button label="Export My Data" w="w-48" />
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 8. Auth */}
        <Section title="8) Auth" note="Login / Signup with forgot password.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <Pad>
                <Title line1="Log In" line2="Authentication" />
                <Field label="Email" />
                <InputStub label="Email input" />
                <Field label="Password" />
                <InputStub label="Password input" />
                <Box className="h-4 w-28" label="Forgot password?" />
                <Button label="Log In" w="w-28" />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Pad wide>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 rounded-lg border border-neutral-200 p-4">
                    <Title line1="Log In" line2="Authentication" />
                    <Field label="Email" />
                    <InputStub label="Email input" />
                    <Field label="Password" />
                    <InputStub label="Password input" />
                    <Box className="h-4 w-32" label="Forgot password?" />
                    <Button label="Log In" w="w-32" />
                  </div>
                  <div className="space-y-4 rounded-lg border border-neutral-200 p-4">
                    <Title line1="Sign Up" line2="Create account" />
                    <Field label="Email" />
                    <InputStub label="Email input" />
                    <Field label="Password" />
                    <InputStub label="Password input" />
                    <Button label="Create Account" w="w-40" />
                  </div>
                </div>
              </Pad>
            </Browser>
          </TwoUp>
        </Section>

        {/* 9. Footer / Trust */}
        <Section title="9) Footer / Trust" note="Always reachable: About, Support, Contact, Privacy, Terms.">
          <TwoUp>
            {/* Mobile */}
            <Phone>
              <Pad>
                <FooterStub />
              </Pad>
            </Phone>

            {/* Desktop */}
            <Browser>
              <Pad wide>
                <FooterStub desktop />
              </Pad>
            </Browser>
          </TwoUp>
        </Section>
      </main>
    </div>
  );
}

/* ---------- Helpers & Stubs (labeled) ---------- */

function Intro() {
  return (
    <section className="mb-8 rounded-xl border border-neutral-200 bg-white p-5">
      <h1 className="text-xl font-semibold">Wireframes: Cookbook Hub (Lo-Fi)</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Mobile (left) and Desktop (right) shown side-by-side. All grey boxes include labels so you can
        identify purpose at a glance.
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
      {children}
    </section>
  );
}

function TwoUp({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-2">
      {children}
    </div>
  );
}

/* Frames */

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-neutral-300 bg-neutral-100 p-3 shadow-sm">
      <Box className="mx-auto h-6 w-28 rounded-full" label="Camera / Notch" />
      <div className="mt-3 overflow-hidden rounded-2xl bg-white">{children}</div>
    </div>
  );
}

function Browser({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full rounded-2xl border border-neutral-300 bg-neutral-100 p-3 shadow-sm">
      <div className="flex items-center gap-1 rounded-t-xl bg-neutral-200 px-3 py-2">
        <Box className="h-3 w-3 rounded-full" label="●" />
        <Box className="h-3 w-3 rounded-full" label="●" />
        <Box className="h-3 w-3 rounded-full" label="●" />
        <Box className="ml-3 h-4 w-48" label="URL Bar" />
      </div>
      <div className="overflow-hidden rounded-b-xl bg-white">{children}</div>
    </div>
  );
}

/* Layout primitives */

function TopBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
      {children}
    </div>
  );
}

function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3">
      {children}
    </div>
  );
}

function Pad({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={wide ? "space-y-4 p-6" : "space-y-4 p-4"}>{children}</div>;
}

/* Labeled building blocks */

function Box({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`grid place-items-center rounded-sm bg-neutral-200 text-[10px] text-neutral-600 ${className}`}
    >
      <span className="px-1">{label}</span>
    </div>
  );
}

function InputStub({ label }: { label: string }) {
  return (
    <div className="space-y-1">
      <Box className="h-3 w-24" label="Label" />
      <Box
        className="h-10 w-full rounded-md border border-dashed border-neutral-300 bg-neutral-100"
        label={label}
      />
    </div>
  );
}

function Textarea({ lines = 3, label = "Textarea" }: { lines?: number; label?: string }) {
  return (
    <Box
      className={`w-full rounded-md border border-dashed border-neutral-300 bg-neutral-100 ${heightByLines(
        lines
      )}`}
      label={label}
    />
  );
}

function Field({ label }: { label: string }) {
  return <Box className="h-4 w-40" label={label} />;
}

function PillRow({ pills }: { pills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((p) => (
        <Box
          key={p}
          className="rounded-full border border-dashed border-neutral-300 bg-neutral-100 px-3 py-1"
          label={p}
        />
      ))}
    </div>
  );
}

function GridCards({ rows = 2, desktop = false }: { rows?: number; desktop?: boolean }) {
  const cols = desktop ? 3 : 2;
  const items = Array.from({ length: rows * cols });
  return (
    <div className={`grid gap-3 ${desktop ? "grid-cols-3" : "grid-cols-2"}`}>
      {items.map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-dashed border-neutral-300">
          <Box className="h-20 w-full" label="Recipe image" />
          <div className="space-y-2 p-2">
            <Box className="h-3 w-28" label="Recipe title" />
            <Box className="h-2 w-20" label="Tags" />
            <Box className="h-2 w-16" label="Meta" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-4 rounded-md border border-dashed border-neutral-300 bg-neutral-100 p-3 text-center text-xs text-neutral-500">
      Empty state: “Your cookbook is hungry! Add your first recipe 🍴.”
    </div>
  );
}

function FAB({ label = "+" }: { label?: string }) {
  return (
    <div className="pointer-events-none relative">
      <div className="pointer-events-auto absolute bottom-4 right-4 rounded-full border border-dashed border-neutral-400 bg-white px-4 py-2 shadow">
        <div className="text-center text-xs text-neutral-600">{label}</div>
      </div>
    </div>
  );
}

function Hero({ className = "h-40", label = "Hero image" }: { className?: string; label?: string }) {
  return <Box className={`${className} w-full`} label={label} />;
}

function Title({ line1, line2 }: { line1: string; line2?: string }) {
  return (
    <div className="space-y-2">
      <Box className="h-4 w-48" label={line1} />
      {line2 && <Box className="h-3 w-32" label={line2} />}
    </div>
  );
}

function Para({ lines = 2, label = "Paragraph" }: { lines?: number; label?: string }) {
  return (
    <div className="space-y-2">
      <Box className="h-3 w-40" label={label} />
      {Array.from({ length: lines }).map((_, i) => (
        <Box key={i} className="h-2 w-full" label={`…`} />
      ))}
    </div>
  );
}

function StatsRow({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => (
        <Box
          key={it}
          className="rounded-md border border-dashed border-neutral-300 bg-neutral-100 px-3 py-2 text-xs"
          label={it}
        />
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 p-3">
      <Box className="h-4 w-28" label={title} />
      {children}
    </div>
  );
}

function List({ count = 5, label = "Item", numbered = false }: { count?: number; label?: string; numbered?: boolean }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-start gap-2">
          {numbered ? (
            <Box className="h-4 w-5" label={`${i + 1}`} />
          ) : (
            <Box className="mt-0.5 h-2 w-2 rounded-full" label="•" />
          )}
          <Box className="h-3 w-full" label={`${label} ${i + 1}`} />
        </li>
      ))}
    </ul>
  );
}

function Timeline({ count = 4 }: { count?: number }) {
  return (
    <div className="relative pl-4">
      <div className="absolute left-1 top-0 h-full w-px bg-neutral-300" />
      <ul className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="relative">
            <div className="absolute left-0 top-1 h-2 w-2 -translate-x-[5px] rounded-full bg-neutral-400" />
            <Box className="h-3 w-full" label={`Step ${i + 1}`} />
            <Box className="mt-1 h-3 w-4/5" label="…" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-center justify-between">
          <Box className="h-3 w-40" label={it} />
          <Box className="h-3 w-10" label="↗" />
        </li>
      ))}
    </ul>
  );
}

function Buttons({ labels, inline = false }: { labels: string[]; inline?: boolean }) {
  return (
    <div className={`flex ${inline ? "flex-wrap" : "flex-wrap"} gap-2`}>
      {labels.map((b) => (
        <Button key={b} label={b} />
      ))}
    </div>
  );
}

function Button({ label, w = "w-28" }: { label: string; w?: string }) {
  return (
    <div
      className={`rounded-md border border-dashed border-neutral-300 bg-neutral-100 px-3 py-2 text-center text-xs text-neutral-600 ${w}`}
    >
      {label}
    </div>
  );
}

function Divider() {
  return <div className="my-4 h-px w-full bg-neutral-200" />;
}

function Info({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-100 px-3 py-2 text-xs text-neutral-700">
      {text}
    </div>
  );
}

function Avatar() {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Box className="h-12 w-12 rounded-full" label="Avatar" />
      <div className="space-y-2">
        <Box className="h-3 w-24" label="Username" />
        <Box className="h-2 w-16" label="email" />
      </div>
    </div>
  );
}

function FooterStub({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Box className="h-5 w-28" label="Logo" />
        <div className="flex gap-3">
          {["About", "Support", "Contact", "Privacy", "Terms"].map((l) => (
            <Box key={l} className="h-4 w-20" label={l} />
          ))}
        </div>
        <Box className="h-4 w-56" label={desktop ? "© 2025 Cookbook Hub — All rights reserved." : "© 2025"} />
      </div>
    </div>
  );
}

function StepHeader({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
      <Box className="h-4 w-24" label={label} />
      <div className="text-xs text-neutral-500">Step {step}/4</div>
    </div>
  );
}

function NavRow({ back = "Back", next = "Next →" }: { back?: string; next?: string }) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <Button label={back} w="w-24" />
      <Button label={next} w="w-28" />
    </div>
  );
}

/* Extra stubs you asked to include */

function BigLine({ label = "Heading", w = "w-full", h = "h-8" }: { label?: string; w?: string; h?: string }) {
  return <Box className={`${h} ${w} rounded-md`} label={label} />;
}

function Toggle({ on = false }: { on?: boolean }) {
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

/* Utility */

function heightByLines(lines: number) {
  // Tailwind-safe height classes
  switch (lines) {
    case 1:
      return "h-10";
    case 2:
      return "h-16";
    case 3:
      return "h-24";
    case 4:
      return "h-28";
    case 5:
      return "h-36";
    default:
      return "h-24";
  }
}
