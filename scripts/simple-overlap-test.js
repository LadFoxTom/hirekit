// Simple test for overlap prevention
console.log('Testing overlap prevention...');

// Simple overlap detection function
const hasOverlap = (pos1, size1, pos2, size2) => {
  return !(
    pos1.x + size1.width < pos2.x ||
    pos1.x > pos2.x + size2.width ||
    pos1.y + size1.height < pos2.y ||
    pos1.y > pos2.y + size2.height
  );
};

// Test cases
const testCases = [
  {
    name: 'No overlap',
    pos1: { x: 0, y: 0 },
    size1: { width: 100, height: 100 },
    pos2: { x: 200, y: 200 },
    size2: { width: 100, height: 100 },
    expected: false
  },
  {
    name: 'Overlap',
    pos1: { x: 0, y: 0 },
    size1: { width: 100, height: 100 },
    pos2: { x: 50, y: 50 },
    size2: { width: 100, height: 100 },
    expected: true
  }
];

testCases.forEach(test => {
  const result = hasOverlap(test.pos1, test.size1, test.pos2, test.size2);
  console.log(`${test.name}: ${result === test.expected ? 'PASS' : 'FAIL'} (got ${result}, expected ${test.expected})`);
});

console.log('Test completed!');
