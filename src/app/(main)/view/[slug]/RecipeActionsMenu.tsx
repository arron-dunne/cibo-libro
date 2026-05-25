"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Link as LinkIcon, MoreHorizontal, Pencil } from "lucide-react";
import { TeriaryButton } from "@/app/components/buttons/Buttons";
import { DeleteButton } from "./DeleteButton";
import { FavouriteButton } from "./FavouriteButton";

interface RecipeActionsMenuProps {
  slug: string;
  isFavourite: boolean;
  sourceUrl: string | null;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function RecipeActionsMenu({
  slug,
  isFavourite,
  sourceUrl,
  deleteAction,
}: RecipeActionsMenuProps) {
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
      {/* Desktop: inline button bar */}
      <div className="hidden md:flex gap-8">
        <FavouriteButton slug={slug} initialIsFavourite={isFavourite} />
        <Link href={`/edit/${slug}`}>
          <TeriaryButton>
            <Pencil size={20} />
            <span className="hidden lg:block">Edit</span>
          </TeriaryButton>
        </Link>
        <DeleteButton slug={slug} action={deleteAction} />
        {sourceUrl && (
          <Link href={sourceUrl} target="_blank" aria-label="View original">
            <TeriaryButton>
              <LinkIcon size={20} />
              <span className="hidden lg:block">Source</span>
            </TeriaryButton>
          </Link>
        )}
      </div>

      {/* Mobile: three-dot dropdown */}
      <div className="relative md:hidden" ref={menuRef}>
        <TeriaryButton onClick={() => setOpen((v) => !v)} aria-label="More options">
          <MoreHorizontal size={24} />
        </TeriaryButton>

        {open && (
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-2xl bg-white shadow-xl border border-slate-100 p-3 flex flex-col gap-3">
            <FavouriteButton slug={slug} initialIsFavourite={isFavourite} />
            <Link href={`/edit/${slug}`} onClick={() => setOpen(false)}>
              <TeriaryButton>
                <Pencil size={20} />
                <span>Edit</span>
              </TeriaryButton>
            </Link>
            <DeleteButton slug={slug} action={deleteAction} />
            {sourceUrl && (
              <Link href={sourceUrl} target="_blank" onClick={() => setOpen(false)}>
                <TeriaryButton>
                  <LinkIcon size={20} />
                  <span>Source</span>
                </TeriaryButton>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
