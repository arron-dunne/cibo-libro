export default function Toggle({
  isOn,
  toggle,
}: {
  isOn: boolean;
  toggle: () => void;
}) {
  return (
    <div
      className="h-8 w-14 p-1 rounded-full border border-neutral-400 shadow-inner flex items-center"
      onClick={toggle}
    >
      <div className={`${isOn ? "w-full" : "w-0"} transition-all`} />
      <div className={`h-6 w-6 z-1 shrink-0 rounded-full border ${isOn ? "border-orange-500 bg-orange-400" : "border-neutral-500 bg-neutral-300"} transition-colors`} />
    </div>
  );
}
