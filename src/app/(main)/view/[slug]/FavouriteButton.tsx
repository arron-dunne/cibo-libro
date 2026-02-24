"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavourite } from "./actions";

export function FavouriteButton({
  slug,
  initialIsFavourite,
}: {
  slug: string;
  initialIsFavourite: boolean;
}) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    setIsFavourite((prev) => !prev);
    setPending(true);
    try {
      const result = await toggleFavourite(slug);
      setIsFavourite(result.isFavourite);
    } catch {
      setIsFavourite((prev) => !prev); // revert on error
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      className={`px-3 h-11 flex gap-2 items-center rounded-full border cursor-pointer hover:brightness-90 active:brightness-75 disabled:opacity-50 ${
        isFavourite
          ? "bg-linear-to-br from-rose-100 to-rose-200 text-rose-600 border-rose-300"
          : "bg-linear-to-br from-slate-100 to-slate-200 text-slate-800 border-slate-300"
      }`}
    >
      <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
      <span className="hidden lg:block">Favourite</span>
    </button>
  );
}
