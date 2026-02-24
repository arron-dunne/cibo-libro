"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { setRecipeFavourite } from "./actions";

export function FavouriteButton({
  slug,
  initialIsFavourite,
}: {
  slug: string;
  initialIsFavourite: boolean;
}) {
  const [isFavourite, setFavourite] = useState(initialIsFavourite);

  const handleClick = () => {
    const newValue = !isFavourite;
    setFavourite(newValue);
    setRecipeFavourite(slug, newValue).catch(() => setFavourite(!newValue));
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      className="px-3 h-11 flex gap-2 items-center rounded-full border cursor-pointer hover:brightness-90 active:brightness-75 bg-linear-to-br from-slate-100 to-slate-200 text-slate-800 border-slate-300"
    >
      <Heart
        size={20}
        className={isFavourite ? "text-rose-500" : ""}
        fill={isFavourite ? "currentColor" : "none"}
      />
      <span className="hidden lg:block">Favourite</span>
    </button>
  );
}
