import { create } from "zustand";
import type { ProductListItem } from "@/lib/api";

/** Client-side cache for the latest product (hero). Single source for cross-component access; hydrated by React Query. */
interface HeroState {
  latestProduct: ProductListItem | null;
  setLatestProduct: (product: ProductListItem | null) => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  latestProduct: null,
  setLatestProduct: (latestProduct) => set({ latestProduct }),
}));
