const fs = require('fs');
const firstRow = fs.readFileSync('./day-18/input').toString('utf-8');
const TRAP = '^';
const SAFE = '.';

function countSafeTiles(firstRow, roomLength) {
  function generateTile(x, upperRow) {
    const isTrapIf = [
      () => upperRow[x - 1] === TRAP && upperRow[x] === TRAP && upperRow[x + 1] !== TRAP,
      () => upperRow[x - 1] !== TRAP && upperRow[x] === TRAP && upperRow[x + 1] === TRAP,
      () => upperRow[x - 1] === TRAP && upperRow[x] !== TRAP && upperRow[x + 1] !== TRAP,
      () => upperRow[x - 1] !== TRAP && upperRow[x] !== TRAP && upperRow[x + 1] === TRAP,
    ];
    return isTrapIf.some(isIt => isIt()) ? TRAP : SAFE;
  }

  let safeTiles = firstRow.split('').reduce((total, tile) => total + (tile === SAFE ? 1 : 0), 0);
  let previousRow = firstRow;
  for (var i = 1; i < roomLength; i++) {
    let newRow = '';
    for (x = 0; x < firstRow.length; x++) {
      const newTile = generateTile(x, previousRow)
      newRow += newTile;
      if (newTile === SAFE) {
        safeTiles++;
      }
    }
    previousRow = newRow;
  }
  return safeTiles;
}

console.log('[?] How many safe tiles are there?');
console.log(countSafeTiles(firstRow, 40))

console.log('[?] How many safe tiles are there in total of 400000 rows?');
console.log(countSafeTiles(firstRow, 400000))