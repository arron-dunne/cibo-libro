"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Save, Loader2 } from "lucide-react"

export function SaveButton() {

  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`my-3 rounded-full flex gap-2 justify-center items-center w-full py-2 
        bg-linear-to-br from-orange-500 to-rose-500 text-white font-bold text-lg
        ${pending ? "brightness-75 cursor-wait" : "hover:brightness-90 active:brightness-75 cursor-pointer"}`}
    >
      {pending ?
        <>
          Saving
          <Loader2 size={20} className="animate-spin" />
        </> :
        <>
          Save
          <ArrowRight size={20} />
        </>
      }
    </button>
  )
}

// export function QuickSaveButton() {

//   const { pending } = useFormStatus();

//   return (
//     <button
//       type="submit"
//       disabled={pending}
//       className={`mt-2 sm:mt-0 w-34 self-end inline-flex gap-2 items-center justify-center
//         rounded-full py-2 px-4 shadow border border-white/70 
//         text-sm font-semibold bg-linear-to-br from bg-slate-200 to-slate-300 
//         ${pending ? "brightness-90 cursor-wait" : "hover:brightness-90 active:brightness-75 cursor-pointer"}`}>
//       {pending ?
//         <>
//           Saving
//           <Loader2 size={18} className="animate-spin" />
//         </> : <>
//           Quick Save
//           <Save size={18} />
//         </>
//       }
//     </button>
//   )
// }
