export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 rounded-3xl bg-white/50" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-48 rounded-3xl bg-white/50" />
        <div className="h-48 rounded-3xl bg-white/50" />
      </div>
    </div>
  );
}
