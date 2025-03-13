const mongoose = require('mongoose');
const app = require('./index'); // Assurez-vous d'importer l'application

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  server = app.listen(3000, () => console.log('Test server running on port 3000'));
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
