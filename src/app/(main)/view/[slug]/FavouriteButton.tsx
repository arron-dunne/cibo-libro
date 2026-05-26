"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { setRecipeFavourite } from "./actions";
import { TertiaryButton } from "@/app/components/buttons/Buttons";

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
    <TertiaryButton onClick={handleClick}>
      <Heart
        size={20}
        className={isFavourite ? "text-rose-500" : ""}
        fill={isFavourite ? "currentColor" : "none"}
      />
      Favourite
    </TertiaryButton>
  );
}
