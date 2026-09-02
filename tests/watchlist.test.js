const request = require('supertest');
const app = require('../src/server/server');

describe('Watchlist API Endpoints', () => {
  const userId = 'user1';

  // Test GET /api/users/:userId/watchlist
  describe('GET /api/users/:userId/watchlist', () => {
    it('should return an empty array for a user with no favorites', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/watchlist`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/nonexistent/watchlist')
        .expect(404);
    });

    it('should return full asset objects for favorited assets', async () => {
      await request(app)
        .post(`/api/users/${userId}/watchlist/1`)
        .expect(201);

      const res = await request(app)
        .get(`/api/users/${userId}/watchlist`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('id', '1');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('price');
    });
  });

  // Test POST /api/users/:userId/watchlist/:assetId
  describe('POST /api/users/:userId/watchlist/:assetId', () => {
    it('should add an asset to the watchlist', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/watchlist/2`)
        .expect(201);

      expect(res.body).toHaveProperty('id', '2');
    });

    it('should persist the addition across requests', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}/watchlist`)
        .expect(200);

      expect(res.body.some(asset => asset.id === '2')).toBe(true);
    });

    it('should return 200 (idempotent) when favoriting an already-favorited asset', async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/watchlist/2`)
        .expect(200);

      expect(res.body).toHaveProperty('id', '2');
    });

    it('should return 404 for non-existent asset', async () => {
      await request(app)
        .post(`/api/users/${userId}/watchlist/nonexistent`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .post('/api/users/nonexistent/watchlist/1')
        .expect(404);
    });
  });

  // Test DELETE /api/users/:userId/watchlist/:assetId
  describe('DELETE /api/users/:userId/watchlist/:assetId', () => {
    it('should remove an asset from the watchlist', async () => {
      await request(app)
        .post(`/api/users/${userId}/watchlist/3`)
        .expect(201);

      await request(app)
        .delete(`/api/users/${userId}/watchlist/3`)
        .expect(200);

      const res = await request(app)
        .get(`/api/users/${userId}/watchlist`)
        .expect(200);

      expect(res.body.some(asset => asset.id === '3')).toBe(false);
    });

    it('should return 200 (idempotent) when removing an asset that is not favorited', async () => {
      await request(app)
        .delete(`/api/users/${userId}/watchlist/3`)
        .expect(200);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/api/users/nonexistent/watchlist/1')
        .expect(404);
    });
  });
});
