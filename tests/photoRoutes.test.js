const request = require('supertest');
const Album = require('../src/models/Album');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const path = require('path');

let token;
let albumId;
let app;
let agent;


beforeAll(async () => {
  app = require('../index');

  await User.deleteMany({});
  await Album.deleteMany({});

  const user = new User({ name: 'Test User', email: 'photouser@example.com', password: 'password123' });
  await user.save();

  agent = request.agent(app);


  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const album = new Album({ title: 'Test Album', description: 'Test Description', user: user._id });
  await album.save();
  albumId = album._id;
});

describe('Photo Routes Test', () => {
  it('POST /photos - add photo to album', async () => {
    await agent
            .post('/login')
            .send({ email: 'photouser@example.com', password: 'password123' });

    const response = await agent
        .post(`/albums/${albumId}/photos`)
        .attach('photo', path.resolve(__dirname, './images/test_image.png'));

    expect(response.status).toBe(302);
  });

  it('GET /photos - get all photos', async () => {
    const response = await agent
        .get(`/albums/${albumId}/photos`)

    expect(response.status).toBe(200);
  });

  it('DELETE /photos/:albumId/:photoId - delete photo from album', async () => {
    const album = await Album.findById(albumId);
    const photoId = album.images[0]._id;

    const response = await agent
      .delete(`/albums/${albumId}/${photoId}`)

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Photo deleted successfully');
  });
});
