// Test script for overlap prevention logic
const findNonOverlappingPosition = (
  desiredPosition,
  existingNodes,
  nodeSize = { width: 200, height: 100 },
  gridSize = 20
) => {
  // Snap to grid
  const snappedX = Math.round(desiredPosition.x / gridSize) * gridSize;
  const snappedY = Math.round(desiredPosition.y / gridSize) * gridSize;
  
  let position = { x: snappedX, y: snappedY };
  let attempts = 0;
  const maxAttempts = 50; // Prevent infinite loops
  
  // Check if position overlaps with existing nodes
  const hasOverlap = (pos) => {
    return existingNodes.some(node => {
      const nodeWidth = node.width || nodeSize.width;
      const nodeHeight = node.height || nodeSize.height;
      
      // Check if rectangles overlap
      return !(
        pos.x + nodeSize.width < node.position.x ||
        pos.x > node.position.x + nodeWidth ||
        pos.y + nodeSize.height < node.position.y ||
        pos.y > node.position.y + nodeHeight
      );
    });
  };
  
  // If no overlap, return the snapped position
  if (!hasOverlap(position)) {
    return position;
  }
  
  // Try to find a non-overlapping position by spiraling outward
  const directions = [
    { x: 1, y: 0 },   // right
    { x: 0, y: 1 },   // down
    { x: -1, y: 0 },  // left
    { x: 0, y: -1 }   // up
  ];
  
  let directionIndex = 0;
  let stepSize = 1;
  let stepsInCurrentDirection = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Move in current direction
    position.x += directions[directionIndex].x * gridSize;
    position.y += directions[directionIndex].y * gridSize;
    
    stepsInCurrentDirection++;
    
    // Change direction when we've taken enough steps in current direction
    if (stepsInCurrentDirection >= stepSize) {
      directionIndex = (directionIndex + 1) % 4;
      stepsInCurrentDirection = 0;
      
      // Increase step size every 2 direction changes (creates a spiral)
      if (directionIndex % 2 === 0) {
        stepSize++;
      }
    }
    
    // Check if this position is free
    if (!hasOverlap(position)) {
      return position;
    }
  }
  
  // If we can't find a position after max attempts, return the original position
  console.warn('Could not find non-overlapping position after', maxAttempts, 'attempts');
  return { x: snappedX, y: snappedY };
};

// Test cases
console.log('Testing overlap prevention logic...\n');

// Test 1: No existing nodes
console.log('Test 1: No existing nodes');
const test1 = findNonOverlappingPosition(
  { x: 100, y: 100 },
  [],
  { width: 200, height: 100 },
  20
);
console.log('Desired: { x: 100, y: 100 }');
console.log('Result:', test1);
console.log('Expected: { x: 100, y: 100 } (snapped to grid)');
console.log('');

// Test 2: One existing node, no overlap
console.log('Test 2: One existing node, no overlap');
const test2 = findNonOverlappingPosition(
  { x: 100, y: 100 },
  [{ position: { x: 400, y: 400 }, width: 200, height: 100 }],
  { width: 200, height: 100 },
  20
);
console.log('Desired: { x: 100, y: 100 }');
console.log('Result:', test2);
console.log('Expected: { x: 100, y: 100 } (no overlap)');
console.log('');

// Test 3: One existing node, with overlap
console.log('Test 3: One existing node, with overlap');
const test3 = findNonOverlappingPosition(
  { x: 100, y: 100 },
  [{ position: { x: 50, y: 50 }, width: 200, height: 100 }],
  { width: 200, height: 100 },
  20
);
console.log('Desired: { x: 100, y: 100 }');
console.log('Result:', test3);
console.log('Expected: Different position to avoid overlap');
console.log('');

// Test 4: Multiple existing nodes, complex scenario
console.log('Test 4: Multiple existing nodes, complex scenario');
const test4 = findNonOverlappingPosition(
  { x: 100, y: 100 },
  [
    { position: { x: 50, y: 50 }, width: 200, height: 100 },
    { position: { x: 300, y: 50 }, width: 200, height: 100 },
    { position: { x: 50, y: 200 }, width: 200, height: 100 },
    { position: { x: 300, y: 200 }, width: 200, height: 100 }
  ],
  { width: 200, height: 100 },
  20
);
console.log('Desired: { x: 100, y: 100 }');
console.log('Result:', test4);
console.log('Expected: Position that avoids all existing nodes');
console.log('');

console.log('Overlap prevention tests completed!');
