const fs = require('fs');
const lines = fs.readFileSync('./day-24/input').toString('utf-8').split(/[\r\n]+/);
const { Grid, AStarFinder } = require('pathfinding');
const { permutation, combination } = require('js-combinatorics');

function toGridInfo(lines) {
  const width = lines[0].length;
  const height = lines.length;
  const grid = new Grid(width, height);
  const poi = {};
  lines.forEach((l, y) => {
    l.split('').forEach((c, x) => {
      if (c === '#') {
        grid.setWalkableAt(x, y, false);
      } else if (c !== '.') {
        const number = parseInt(c);
        poi[number] = { x, y };
      }
    });
  });
  return { grid, poi };
}

const gridInfo = toGridInfo(lines);
const allNumbers = Object.keys(gridInfo.poi);
const distancesBetweenPois = combination(allNumbers, 2).toArray()
  .map((fromTo) => {
    const grid = gridInfo.grid.clone();
    const pathFinder = new AStarFinder();
    const from = gridInfo.poi[fromTo[0]];
    const to = gridInfo.poi[fromTo[1]];
    const length = pathFinder.findPath(from.x, from.y, to.x, to.y, grid).length - 1;
    return { from: fromTo[0], to: fromTo[1], length };
  });

const possiblePathFromZero = permutation(allNumbers.filter((_, i) => i > 0)).toArray()
  .map((path) => {
    let length = 0;
    path.unshift('0'); // We start from 0 :)
    for (let i = 1; i < path.length; i++) {
      let from = Math.min(path[i - 1], path[i]);
      let to = Math.max(path[i - 1], path[i]);
      length += distancesBetweenPois.filter(d => d.from == from && d.to == to)[0].length;
    }
    return { path, length };
  });

console.log(
  '[?] What is the fewest number of steps required to visit every non-0 number marked ' +
  'on the map at least once?'
);
console.log(possiblePathFromZero.sort((a, b) => a.length - b.length)[0].length);

const possiblePathFromZeroWithReturnToZero = permutation(allNumbers.filter((_, i) => i > 0))
  .toArray()
  .map((path) => {
    let length = 0;
    path.unshift('0'); // We start from 0 :)
    path.push('0') // We also return to 0 :)
    for (let i = 1; i < path.length; i++) {
      let from = Math.min(path[i - 1], path[i]);
      let to = Math.max(path[i - 1], path[i]);
      length += distancesBetweenPois.filter(d => d.from == from && d.to == to)[0].length;
    }
    return { path, length };
  });

console.log(
  '[?] What is the fewest number of steps required to start at 0, visit every non-0 number ' + 
  'marked on the map at least once, and then return to 0?'
);
console.log(possiblePathFromZeroWithReturnToZero.sort((a, b) => a.length - b.length)[0].length);
