// API base URL — points at the Express backend (npm run dev:backend / npm run dev)
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const watchlistApi = {
  // GET /api/users/:userId/watchlist — full asset objects for everything the user has favorited
  getWatchlist: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/watchlist`);
    return handleResponse(response);
  },

  // POST /api/users/:userId/watchlist/:assetId
  addToWatchlist: async (userId: string, assetId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/watchlist/${assetId}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  // DELETE /api/users/:userId/watchlist/:assetId
  removeFromWatchlist: async (userId: string, assetId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/watchlist/${assetId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
