"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react"

export function SaveButton() {

  const { pending } = useFormStatus();

  return (
    <button 
      disabled={pending}
      className={`my-3 rounded-full flex gap-2 justify-center items-center w-full py-2 
        bg-linear-to-br from-orange-500 to-rose-500 text-white font-bold text-lg
        ${pending ? "brightness-75 cursor-wait" : "hover:brightness-90 active:brightness-75 cursor-pointer"}`}
      >
      { pending ? 
        <>
          Saving
          <Loader2 size={20} className="animate-spin"/>
        </> : 
        <>
          Save
          <ArrowRight size={20} />
        </>
      }
    </button>
  )
}
