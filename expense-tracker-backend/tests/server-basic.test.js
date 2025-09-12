// Test minimaliste qui crée une instance Express basique
const express = require('express');

test('Express can be imported and instantiated', () => {
  const app = express();
  expect(app).toBeDefined();
  expect(typeof app.use).toBe('function');
  expect(typeof app.get).toBe('function');
});

test('Basic middleware setup works', () => {
  const app = express();
  
  // Test que les méthodes middleware existent
  expect(typeof app.use).toBe('function');
  expect(typeof app.get).toBe('function');
  expect(typeof app.post).toBe('function');
});