interface HighlightToggleProps {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export function HighlightToggle({ enabled, onToggle, className = "" }: HighlightToggleProps) {
  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      <span className="text-sm text-zinc-400">Highlight</span>
      <button
        onClick={onToggle}
        className={`relative w-8 h-5 rounded-full transition-colors ${enabled ? "bg-orange-400" : "bg-zinc-200"}`}
      >
        <span className={`absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-3.5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
