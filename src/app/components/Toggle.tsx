export default function Toggle({
  isOn,
  toggle,
  disabled = false,
}: {
  isOn: boolean;
  toggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      className="h-8 w-14 p-1 rounded-full border border-neutral-400 shadow-inner flex items-center disabled:cursor-not-allowed disabled:opacity-50"
      onClick={toggle}
    >
      <div className={`${isOn ? "w-full" : "w-0"} transition-all`} />
      <div className={`h-6 w-6 z-1 shrink-0 rounded-full border ${isOn ? "border-green-600 bg-green-500" : "border-neutral-400 bg-neutral-300"} transition-colors`} />
    </button>
  );
}
