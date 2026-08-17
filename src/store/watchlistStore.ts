import { create } from 'zustand';
import { watchlistApi } from '@/services/api/watchlistApi';

// Matches the mock demo user seeded in src/server/routes/auth.js
const DEMO_USER_ID = 'user1';

interface WatchlistStore {
  favoritedIds: Set<string>;
  loading: boolean;
  loaded: boolean;
  fetchWatchlist: () => Promise<void>;
  toggleFavorite: (assetId: string) => Promise<void>;
  isFavorited: (assetId: string) => boolean;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  favoritedIds: new Set(),
  loading: false,
  loaded: false,

  fetchWatchlist: async () => {
    set({ loading: true });
    try {
      const assets = await watchlistApi.getWatchlist(DEMO_USER_ID);
      const ids = new Set<string>((assets || []).map((a: { id: string }) => a.id));
      set({ favoritedIds: ids, loading: false, loaded: true });
    } catch (err) {
      console.error('Failed to load watchlist:', err);
      set({ loading: false, loaded: true });
    }
  },

  toggleFavorite: async (assetId: string) => {
    const { favoritedIds } = get();
    const alreadyFavorited = favoritedIds.has(assetId);

    // Optimistic update
    const next = new Set(favoritedIds);
    if (alreadyFavorited) {
      next.delete(assetId);
    } else {
      next.add(assetId);
    }
    set({ favoritedIds: next });

    try {
      if (alreadyFavorited) {
        await watchlistApi.removeFromWatchlist(DEMO_USER_ID, assetId);
      } else {
        await watchlistApi.addToWatchlist(DEMO_USER_ID, assetId);
      }
    } catch (err) {
      console.error('Failed to update watchlist:', err);
      // Roll back on failure
      set({ favoritedIds });
    }
  },

  isFavorited: (assetId: string) => get().favoritedIds.has(assetId),
}));
