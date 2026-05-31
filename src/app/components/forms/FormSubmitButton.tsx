// "use client";

// import { LoaderCircle } from "lucide-react";
// import { useFormStatus } from "react-dom";

// export function FormPrimarySubmitButton({
//   children,
//   pendingLabel,
//   isPending: isPendingProp,
//   disabled,
// }: {
//   children: React.ReactNode;
//   pendingLabel: string;
//   isPending?: boolean;
//   disabled?: boolean;
// }) {
//   const { pending: formPending } = useFormStatus();
//   const isPending = isPendingProp ?? formPending;

//   return (
//     <div className="sticky bottom-4 z-10 flex justify-center">
//       <div className="rounded-full w-full max-w-sm bg-white/60 backdrop-blur border border-white/70 shadow-lg px-4 py-3">
//         <button
//           type="submit"
//           disabled={isPending || disabled}
//           className="w-full h-14 rounded-full flex justify-center items-center gap-4
//           bg-linear-to-br from-green-500 to-lime-400 border border-green-500 shadow-lg
//           text-xl font-bold text-green-950 cursor-pointer
//           hover:brightness-90 active:brightness-75 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isPending ? (
//             <>
//               {pendingLabel}
//               <LoaderCircle className="animate-spin" size={22} />
//             </>
//           ) : (
//             children
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
