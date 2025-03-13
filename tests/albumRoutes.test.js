const request = require('supertest');
const mongoose = require('mongoose');
const Album = require('../src/models/Album');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let token;
let app;
let userId;
let agent;

beforeAll(async () => {
    app = require('../index');
    
    await User.deleteMany({});

    await Album.deleteMany({});

    const user = new User({ name: 'Test User', email: 'albumuser@example.com', password: 'password123' });

    await user.save();

    userId = user._id;

    agent = request.agent(app);

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe('Album Routes Test', () => {
    it('POST /albums - create album', async () => {

        await agent
            .post('/login')
            .send({ email: 'albumuser@example.com', password: 'password123' });

        const response = await agent
          .post('/albums')
          .send({ title: 'Test Album 1', description: 'Album Description' });
    
        expect(response.status).toBe(200); // Rendering status
        const album = await Album.findOne({ title: 'Test Album 1' });
        expect(album).not.toBeNull();
        expect(album.description).toBe('Album Description');
        expect(album.user.toString()).toBe(userId.toString());
      });
    
      it('GET /albums - get user albums', async () => {
        const response = await agent
          .get('/albums')
    
        expect(response.status).toBe(200); // Rendering status
        expect(response.text).toContain('Test Album');
      });
    
      it('PUT /albums/:id - update album', async () => {
        const album = new Album({ title: 'Old Title', description: 'Old Description', user: new mongoose.Types.ObjectId() });
        await album.save();
    
        const response = await agent
          .put(`/albums/${album._id}`)
          .send({ title: 'Updated Album', description: 'Updated Description' });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Album updated successfully');
        expect(response.body.album.title).toBe('Updated Album');
        expect(response.body.album.description).toBe('Updated Description');
      });
    
      it('DELETE /albums/:id - delete album', async () => {

        const album = new Album({ title: 'To Delete', description: 'To Delete', user: new mongoose.Types.ObjectId() });
        await album.save();
    
        const response = await agent
          .delete(`/albums/${album._id}`);
    
        expect(response.status).toBe(200);
        const deletedAlbum = await Album.findById(album._id);
        expect(deletedAlbum).toBeNull();
      });
});
