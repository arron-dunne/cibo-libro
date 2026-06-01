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
import { DropdownFavouriteButton, FavouriteButton } from "./FavouriteButton";
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
          <SecondaryButton
            type="button"
            size="custom"
            width="w-10"
            height="h-10"
          >
            <ArrowLeft size={20} />
          </SecondaryButton>
        </Link>

        {recipeType === "EXTERNAL_LINK" ? (
          <Link href={sourceUrl || ""} target="_blank">
            <PrimaryButton type="button">
              <LinkIcon size={20} />
              View Original
            </PrimaryButton>
          </Link>
        ) : (
          <Link href={`/cook/${slug}`}>
            <PrimaryButton type="button">
              <ChefHat size={20} className="-rotate-12 shrink-0" />
              <span className="text-nowrap">Start Cooking</span>
            </PrimaryButton>
          </Link>
        )}

        <div className="relative" ref={menuRef}>
          <SecondaryButton
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="More options"
            size="custom"
            width="w-10"
            height="h-10"
          >
            <EllipsisVertical size={20} />
          </SecondaryButton>
          {open && (
            <MobileDropdown
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
          <SecondaryButton type="button">
            <ArrowLeft size={20} />
            <span className="hidden sm:block">Back</span>
          </SecondaryButton>
        </Link>

        <div className="flex gap-2">
          <FavouriteButton slug={slug} initialIsFavourite={isFavorite} />
          <Link href={`/edit/${slug}`}>
            <SecondaryButton type="button">
              <Pencil size={20} />
              <span>Edit</span>
            </SecondaryButton>
          </Link>
          <DeleteButton slug={slug} action={deleteAction} />
          {sourceUrl && recipeType !== "EXTERNAL_LINK" && (
            <Link href={sourceUrl} target="_blank" aria-label="View original">
              <SecondaryButton type="button">
                <LinkIcon size={20} />
                <span>Original</span>
              </SecondaryButton>
            </Link>
          )}
        </div>

        {/* Primary action button */}
        {recipeType === "EXTERNAL_LINK" ? (
          // View Original
          <Link href={sourceUrl || ""} target="_blank" rel="noreferrer">
            <PrimaryButton type="button">
              <LinkIcon size={20} className="shrink-0" />
              <span className="text-nowrap">View Original</span>
            </PrimaryButton>
          </Link>
        ) : (
          // Cook mode
          <Link href={`/cook/${slug}`}>
            <PrimaryButton type="button">
              <ChefHat size={20} className="-rotate-12 shrink-0" />
              <span className="text-nowrap">Start Cooking</span>
            </PrimaryButton>
          </Link>
        )}
      </div>
    </>
  );
}

function MobileDropdown({
  slug,
  isFavorite,
  setOpen,
  deleteAction,
  sourceUrl,
}: MoreOptionPopupProps) {
  return (
    <div
      className="absolute right-0 top-full mt-2 z-50 min-w-45 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 flex flex-col items-start"
      role="menu"
    >
      <DropdownFavouriteButton slug={slug} initialIsFavourite={isFavorite} />

      <Link
        href={`/edit/${slug}`}
        onClick={() => setOpen(false)}
        className="w-full h-10 p-2 bg-white rounded-xl text-orange-600 cursor-pointer font-semibold flex items-center gap-2 hover:brightness-95"
      >
        <Pencil size={20} />
        <span>Edit</span>
      </Link>

      <DeleteButton slug={slug} action={deleteAction} variant="dropdown" />

      {sourceUrl && (
        <Link
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
          className="w-full h-10 p-2 bg-white rounded-xl text-orange-600 cursor-pointer font-semibold flex items-center gap-2 hover:brightness-95"
        >
          <LinkIcon size={20} />
          <span>Original</span>
        </Link>
      )}
    </div>
  );
}
