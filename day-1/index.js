const fs = require('fs');
//                   West     North   East    South
const Directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const input = fs.readFileSync('./day-1/input').toString('utf-8');
const instructions = input.split(', ');

function toAbsoluteSum(a = 0, b) {
  return Math.abs(a) + Math.abs(b);
}

const visitedCoordinates = {};
let firstDoubleVisitedCoordinate = null;
const finalCoordinates = instructions
  .reduce(function toFinalCoordinateReducer({ currentPosition, directionIndex }, instruction) {

    function checkForAlreadyVisitedCoordinate(startPosition, endPosition) {
      const minX = Math.min(startPosition[0], endPosition[0]);
      const maxX = Math.max(startPosition[0], endPosition[0]);
      const minY = Math.min(startPosition[1], endPosition[1]);
      const maxY = Math.max(startPosition[1], endPosition[1]);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          if (x === startPosition[0] && y === startPosition[1]) continue;
          const coordinateString = `${x},${y}`;
          if (coordinateString in visitedCoordinates) {
            firstDoubleVisitedCoordinate = [x, y];
            return;
          }
          visitedCoordinates[coordinateString] = true;
        }
      }
    }

    directionIndex = (directionIndex + (instruction[0] === 'R' ? 1 : -1) + Directions.length) % Directions.length;
    const steps = parseInt(instruction.substring(1), 10);
    const newPosition = [
      currentPosition[0] + Directions[directionIndex][0] * steps,
      currentPosition[1] + Directions[directionIndex][1] * steps
    ];

    if (firstDoubleVisitedCoordinate === null) {
      checkForAlreadyVisitedCoordinate(currentPosition, newPosition);
    }

    return { currentPosition: newPosition, directionIndex };
  }, {
    currentPosition: [0, 0],
    directionIndex: 1 // North
  });

const easterBunnyHQDistance = finalCoordinates.currentPosition.reduce(toAbsoluteSum);
console.log('[?] How many blocks away is Easter Bunny HQ?');
console.log(`It is ${easterBunnyHQDistance} blocks away from start.`);

const distance = firstDoubleVisitedCoordinate.reduce(toAbsoluteSum);
console.log('[?] How many blocks away is block that we are visiting for the second time?');
console.log(`It is ${distance} blocks away from start.`)
