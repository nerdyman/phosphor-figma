import { atom, selector } from "recoil";
import Fuse from "fuse.js";

import { IconEntry, IconStyle } from "../lib";
import { icons } from "../lib/icons";

const fuse = new Fuse(icons, {
  keys: [{ name: "name", weight: 4 }, "tags", "categories"],
  threshold: 0.2, // Tweak this to what feels like the right number of results
  // shouldSort: false,
  useExtendedSearch: true,
});

export const iconWeightAtom = atom<IconStyle>({
  key: "iconWeightAtom",
  default: IconStyle.REGULAR,
});

export const searchQueryAtom = atom({
  key: "searchQueryAtom",
  default: "",
});

export const filteredQueryResultsSelector = selector<ReadonlyArray<IconEntry>>({
  key: "filteredQueryResultsSelector",
  get: ({ get }) => {
    const query = get(searchQueryAtom).trim().toLowerCase();
    if (!query) return icons;

    return new Promise((resolve) =>
      resolve(fuse.search(query).map((value) => value.item))
    );
  },
});
