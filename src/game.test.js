const fs = require('fs');
const path = require('path');

document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

test('renders the game canvas', () => {
  const canvas = document.getElementById('gameCanvas');
  expect(canvas).not.toBeNull();
});
