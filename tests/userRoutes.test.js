const request = require('supertest');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let token;
let app;
let agent;

beforeAll(async () => {
    app = require('../index');

    await User.deleteMany({});
    const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    await user.save();

    agent = request.agent(app);

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});


describe('User Routes Test', () => {
  it('POST /register - create user', async () => {
    const response = await agent
      .post('/register')
      .send({ name: 'New User', email: 'newuser@example.com', password: 'password123' });

    expect(response.status).toBe(302); // Redirection status
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    expect(user.name).toBe('Test User');
  });

  it('POST /login - authenticate user', async () => {

    const response = await agent
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(302); // Redirection status
    expect(response.header['set-cookie']).toBeDefined();
  });

  it('GET /me - get user profile', async () => {

    await agent
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const response = await agent
      .get('/me');

    expect(response.status).toBe(200);
  });

  it('PUT /me - update user profile', async () => {
    const agent = request.agent(app);

    await agent
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });


    const response = await agent
      .put('/me')
      .send({ name: 'Updated User', email: 'updated@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe('Updated User');
    expect(response.body.user.email).toBe('updated@example.com');
  });

  it('POST /logout - logout user', async () => {

    await agent
      .post('/login')
      .send({ email: 'updated@example.com', password: 'password123' });

    const response = await request(app)
      .post('/logout');

    expect(response.status).toBe(302); // Redirection status
  });
});