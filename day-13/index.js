const { distinct } = require('../utils/array');

function cellType(x, y, input) {
  const value = x * x + 3 * x + 2 * x * y + y + y * y + input;
  const binary = value.toString(2);
  return binary.split('').filter(b => b === '1').length % 2 === 0
    ? '.'
    : '#';
}

function generateField(width, height, input) {
  const field = [];
  for (var h = 0; h < height; h++) {
    field.push([]);
    for (var w = 0; w < width; w++) {
      field[h].push(cellType(w, h, input));
    }
  }
  return field;
}

function printField(field, visited = {}) {
  for (var y = 0; y < field.length; y++) {
    let line = '';
    for (var x = 0; x < field[y].length; x++) {
      line += visited[`${x},${y}`] ? 'O' : field[y][x]
    }
    console.log(line);
  }
}

function getPossibleMoves(field, position, visited) {
  return possibilities = [
    [position[0], position[1] + 1],
    [position[0], position[1] - 1],
    [position[0] + 1, position[1]],
    [position[0] - 1, position[1]]
  ].filter(pos => 
    field[pos[1]] && 
    field[pos[1]][pos[0]] && 
    field[pos[1]][pos[0]] !== '#' && 
    !visited[pos.join(',')]
  );
}

function findPath(field, position, goal, visited = {}) {
  const key = position.join(',');
  if (key === goal.join(',')) {
    return visited;
  }
  visited[key] = position;
  const possibilities = getPossibleMoves(field, position, visited);
  if (possibilities.length === 0) {
    return null;
  }
  const results = possibilities.map(p => findPath(field, p, goal, Object.assign({}, visited)));
  let minSolution = null;
  results.forEach(r => {
    if (r) {
      if (minSolution === null || Object.keys(r).length < Object.keys(minSolution).length) {
        minSolution = r;
      }
    }
  })
  return minSolution;
}

function findGoals(field, position, maxSteps, visited = {}) {
  const key = position.join(',');
  const goals = [position];
  visited[key] = position;
  if (Object.keys(visited).length > maxSteps) {
    return goals;
  }
  const possibilities = getPossibleMoves(field, position, visited);
  return possibilities
    .map(p => findGoals(field, p, maxSteps, Object.assign({}, visited)))
    .reduce((results, goals) => results.concat(goals), goals);
}

const field = generateField(50, 50, 1358);
console.log('[?] What is the fewest number of steps required for you to reach 31,39?');
console.log(Object.keys(findPath(field, [1, 1], [31, 39])).length);

console.log('[?] How many locations can you reach in at most 50 steps?');
const locations = distinct(findGoals(field, [1, 1], 50).map(p => p.join(',')));
console.log(locations.length);
