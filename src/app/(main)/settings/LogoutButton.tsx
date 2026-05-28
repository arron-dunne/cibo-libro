"use client";

import { SecondaryButton } from "@/app/components/buttons/Buttons";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";


export default function LogoutButton() {

    const {pending} = useFormStatus()

    return (
        <SecondaryButton width="w-full" type="submit" disabled={pending}>
            { pending ? <Loader2 size={24} className="animate-spin"/> : "Logout" }
        </SecondaryButton>
    )
}