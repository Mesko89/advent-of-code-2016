const fs = require('fs');
const input = fs.readFileSync('./day-22/input').toString('utf-8').split(/[\r\n]+/);
const { toMap } = require('../utils/array');
const { Grid, AStarFinder } = require('pathfinding');
const NEARLY_FULL_EPS = 0.95;

function toNodes(input) {
  const nodes = input
    .map(line => {
      const matches = line.match(/.*x(\d+).*y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/);
      if (!matches) return;
      let [_, x, y, size, used, avail] = matches;
      x = parseInt(x);
      y = parseInt(y);
      return { x, y, key: `${x},${y}`, used: parseInt(used, 10), avail: parseInt(avail, 10) };
    })
    .filter(v => !!v);
  return nodes;
}

function toWalkableGrid(nodes) {
  const width = nodes.reduce((highestX, n) => n.x > highestX ? n.x : highestX, 0) + 1;
  const height = nodes.reduce((highestY, n) => n.y > highestY ? n.y : highestY, 0) + 1;
  const grid = new Grid(width, height);
  let emptyNode = null;
  nodes.forEach(n => {
    const percentageFull = n.used / (n.used + n.avail);
    if (percentageFull >= NEARLY_FULL_EPS) {
      grid.setWalkableAt(n.x, n.y, false);
    } else if (percentageFull === 0) {
      emptyNode = n;
    }
  });
  return { grid, emptyNode, goalPosition: { x: width - 1, y: 0} };
}

function findPairs(nodes) {
  const pairs = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].used !== 0 && nodes[i].used < nodes[j].avail) {
        pairs.push([nodes[i], nodes[j]]);
      } else if (nodes[j].used !== 0 && nodes[j].used < nodes[i].avail) {
        pairs.push([nodes[j], nodes[i]]);
      }
    }
  }
  return pairs;
}

const nodes = toNodes(input);
const pairs = findPairs(nodes);

console.log('[?] How many viable pairs of nodes are there?');
console.log(pairs.length);

function printGrid(nodes) {
  let lineOutput = '';
  nodes.forEach((node) => {
    if (node.y == 0) {
      console.log(lineOutput);
      lineOutput = '';
    }
    const percentage = node.used / (node.used + node.avail);
    lineOutput += percentage === 0 
      ? '_'
      : percentage > NEARLY_FULL_EPS
        ? '#'
        : '.';
  })
  console.log(lineOutput);
}

const { grid, emptyNode, goalPosition } = toWalkableGrid(nodes);
const aStarFinder = new AStarFinder();
const path = aStarFinder.findPath(emptyNode.x, emptyNode.y, goalPosition.x, goalPosition.y, grid);
console.log('[?] What is the fewest number of steps required to move your goal data to node-x0-y0?');
console.log(path.length - 1 + 5 * (grid.width - 2));