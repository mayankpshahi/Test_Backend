const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Get the user's watchlist as full asset objects
router.get('/:userId/watchlist', (req, res) => {
  try {
    const { userId } = req.params;
    const user = db.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(db.getWatchlist(userId));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add an asset to the user's watchlist.
router.post('/:userId/watchlist/:assetId', (req, res) => {
  try {
    const { userId, assetId } = req.params;

    const user = db.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const asset = db.getAssetById(assetId);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const { alreadyExists } = db.addToWatchlist(userId, assetId);
    res.status(alreadyExists ? 200 : 201).json(asset);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// Remove an asset from the user's watchlist.
router.delete('/:userId/watchlist/:assetId', (req, res) => {
  try {
    const { userId, assetId } = req.params;

    const user = db.users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.removeFromWatchlist(userId, assetId);
    res.status(200).json({ userId, assetId });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;
