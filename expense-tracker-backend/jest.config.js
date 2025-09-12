module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/*.test.js', // Seulement les tests dans le dossier tests
    '!**/tests/integration/**', // Exclure les tests d'intégration
    '!**/tests/unit/**' // Exclure les tests unitaires complexes
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/' // Ignorer tout dans src pour éviter les imports de routes
  ],
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  
  // Désactiver la couverture de code pour l'instant
  collectCoverage: false,
  
  // Transformer seulement les fichiers de test
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/src/' // Ne pas transformer les fichiers src
  ]
};