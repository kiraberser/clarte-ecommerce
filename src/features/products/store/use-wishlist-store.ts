import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  setIds: (ids: number[]) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      setIds: (ids) => set({ ids }),
      add: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
        })),
      remove: (id) =>
        set((state) => ({ ids: state.ids.filter((i) => i !== id) })),
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) });
        } else {
          set({ ids: [...ids, id] });
        }
      },
      isWishlisted: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "ocaso-wishlist" },
  ),
);
