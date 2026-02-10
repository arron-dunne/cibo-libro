/** Sort options */
export const SORT_OPTIONS = [
  { key: "az" as const, label: "Title A-Z" },
  { key: "za" as const, label: "Title Z-A" },
  { key: "created" as const, label: "Recently Added" },
  { key: "updated" as const, label: "Recently Updated" },
  { key: "time" as const, label: "Cooking Time" },
];
export type SortOptionKey = (typeof SORT_OPTIONS)[number]["key"];
