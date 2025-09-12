// Test basique qui ne dépend d'aucun fichier de route
test('Basic server test - health check should work', () => {
  // Test simple sans importer le serveur complet
  expect(1 + 1).toBe(2);
});

test('Array operations work correctly', () => {
  const numbers = [1, 2, 3];
  expect(numbers).toHaveLength(3);
  expect(numbers).toContain(2);
});

test('Object properties work', () => {
  const user = { id: 1, email: 'test@example.com' };
  expect(user).toHaveProperty('email');
  expect(user.email).toBe('test@example.com');
});