// Test des modèles sans dépendre des routes
const mongoose = require('mongoose');

test('Mongoose can connect to test database', async () => {
  // Test de connexion MongoDB
  const MockMongoose = require('mock-mongoose').MockMongoose;
  const mockMongoose = new MockMongoose(mongoose);
  
  await mockMongoose.prepareStorage();
  await mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  expect(mongoose.connection.readyState).toBe(1); // connected
  await mongoose.disconnect();
});

test('User model schema can be defined', () => {
  // Test de création de schema sans sauvegarde réelle
  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });
  
  expect(userSchema).toBeDefined();
  expect(userSchema.paths).toHaveProperty('email');
});