"use client";

import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "@/app/components/buttons/Buttons";
import {
  ArrowLeft,
  ChefHat,
  Ellipsis,
  EllipsisVertical,
  LinkIcon,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { FavouriteButton } from "./FavouriteButton";
import { DeleteButton } from "./DeleteButton";
import { RecipeType } from "@/types/recipe";
import { useEffect, useRef, useState } from "react";

interface ButtonBarProps {
  slug: string;
  isFavorite: boolean;
  recipeType: RecipeType;
  deleteAction: any; //TODO : properly type
  sourceUrl?: string | null;
}

interface MoreOptionPopupProps {
  slug: string;
  isFavorite: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAction: any; //TODO : properly type
  sourceUrl?: string | null;
}
export function ButtonBar({
  slug,
  isFavorite,
  recipeType,
  deleteAction,
  sourceUrl,
}: ButtonBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <>
      {/* Mobile bar  */}
      <div className="mt-6 flex md:hidden justify-between items-center">
        <Link
          href="/all"
          className="w-max flex items-center gap-3 text-lg font-semibold text-slate-900 cursor-pointer hover:brightness-90 active:brightness-75"
        >
          <SecondaryButton size="custom" width="w-10" height="h-10">
            <ArrowLeft size={20} />
            <span className="hidden sm:block">Back</span>
          </SecondaryButton>
        </Link>

        {/* <div className="flex gap-2 items-center"> */}
        {recipeType !== "EXTERNAL_LINK" && (
          <Link href={`/cook/${slug}`}>
            <PrimaryButton>
              <ChefHat size={20} className="-rotate-12 shrink-0" />
              <span className="text-nowrap">Start Cooking</span>
            </PrimaryButton>
          </Link>
        )}

        <div className="relative" ref={menuRef}>
          <SecondaryButton
            onClick={() => setOpen((v) => !v)}
            aria-label="More options"
            size="custom"
            width="w-10"
            height="h-10"
          >
            <EllipsisVertical size={20} />
          </SecondaryButton>
          {open && (
            <MoreOptionsPopup
              slug={slug}
              isFavorite={isFavorite}
              setOpen={setOpen}
              deleteAction={deleteAction}
              sourceUrl={sourceUrl || null}
            />
          )}
        </div>
        {/* </div> */}
      </div>

      {/* Deskop bar */}
      <div className="mt-6 hidden md:flex justify-between items-center">
        <Link
          href="/all"
          className="w-max flex items-center gap-3 text-lg font-semibold text-slate-900 cursor-pointer hover:brightness-90 active:brightness-75"
        >
          <TertiaryButton>
            <ArrowLeft size={20} />
            <span className="hidden sm:block">Back</span>
          </TertiaryButton>
        </Link>

        <div className="hidden md:flex gap-8">
          <FavouriteButton slug={slug} initialIsFavourite={isFavorite} />
          <Link href={`/edit/${slug}`}>
            <TertiaryButton>
              <Pencil size={20} />
              <span className="hidden lg:block">Edit</span>
            </TertiaryButton>
          </Link>
          <DeleteButton slug={slug} action={deleteAction} />
          {sourceUrl && (
            <Link href={sourceUrl} target="_blank" aria-label="View original">
              <TertiaryButton>
                <LinkIcon size={20} />
                <span className="hidden lg:block">Original</span>
              </TertiaryButton>
            </Link>
          )}
        </div>
        {recipeType !== "EXTERNAL_LINK" && (
          <Link href={`/cook/${slug}`}>
            <PrimaryButton>
              <ChefHat size={20} className="-rotate-12 shrink-0" />
              <span className="text-nowrap">Start Cooking</span>
            </PrimaryButton>
          </Link>
        )}
      </div>
    </>
  );
}

function MoreOptionsPopup({
  slug,
  isFavorite,
  setOpen,
  deleteAction,
  sourceUrl,
}: MoreOptionPopupProps) {
  return (
    <div className="absolute right-0 top-full mt-2 z-50 min-w-45 rounded-2xl bg-white shadow-xl border border-slate-100 p-4 flex flex-col items-start gap-4">
      <FavouriteButton slug={slug} initialIsFavourite={isFavorite} />
      
      <Link href={`/edit/${slug}`} onClick={() => setOpen(false)}>
        <TertiaryButton>
          <Pencil size={20} />
          <span>Edit</span>
        </TertiaryButton>
      </Link>
      
      <DeleteButton slug={slug} action={deleteAction} />
      
      {sourceUrl && (
        <Link href={sourceUrl} target="_blank" onClick={() => setOpen(false)}>
          <TertiaryButton>
            <LinkIcon size={20} />
            <span>Source</span>
          </TertiaryButton>
        </Link>
      )}
    </div>
  );
}
