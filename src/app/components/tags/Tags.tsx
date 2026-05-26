export function Tag({
  children,
  interactive=false,
}: {
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <div className={`inline-flex items-center rounded-full bg-white text-rose-500 border border-rose-300 px-4 py-2 font-semibold text-nowrap shadow-sm shadow-rose-100 ${interactive ? "bg-linear-to-br from-white to-white hover:from-orange-50 hover:to-rose-100 hover:shadow-md active:from-orange-100 active:to-rose-300 cursor-pointer" : ""}`}>
      {children}
    </div>
  );
}
