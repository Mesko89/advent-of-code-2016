const md5 = require('md5-hex');

function inRange(value, from, to) {
  return value >= from && value < to;
}

function getPossibleActions(width, height, position, hash) {
  const actions = [{
    path: 'U',
    canDo: () => parseInt(hash[0], 16) > 10 && inRange(position[1] - 1, 0, height),
    do: (position) => [position[0], position[1] - 1]
  },{
    path: 'D',
    canDo: () => parseInt(hash[1], 16) > 10 && inRange(position[1] + 1, 0, height),
    do: (position) => [position[0], position[1] + 1]
  },{
    path: 'L',
    canDo: () => parseInt(hash[2], 16) > 10 && inRange(position[0] - 1, 0, width),
    do: (position) => [position[0] - 1, position[1]]
  },{
    path: 'R',
    canDo: () => parseInt(hash[3], 16) > 10 && inRange(position[0] + 1, 0, width),
    do: (position) => [position[0] + 1, position[1]]
  }];
  return actions.filter(a => a.canDo());
}

function findShortestPath(width, height, position, vault, seed, path = '') {
  if (position.join(',') === vault.join(',')) return path;
  const hash = md5(seed + path);
  const possibleActions = getPossibleActions(width, height, position, hash);

  let shortest = null;
  possibleActions.forEach(a => {
    const newPosition = a.do(position);
    const result = findShortestPath(width, height, newPosition, vault, seed, path + a.path);
    if (result) {
      if (!shortest || result.length < shortest.length) {
        shortest = result;
      }
    }
  });
  return shortest;
}

function findLongestPath(width, height, position, vault, seed, path = '') {
  if (position.join(',') === vault.join(',')) return path;
  const hash = md5(seed + path);
  const possibleActions = getPossibleActions(width, height, position, hash);
  
  let longest = null;
  possibleActions.forEach(a => {
    const newPosition = a.do(position);
    const result = findLongestPath(width, height, newPosition, vault, seed, path + a.path);
    if (result) {
      if (!longest || result.length > longest.length) {
        longest = result;
      }
    }
  });
  return longest;
}

console.log('[?] What is the shortest path to reach the vault?');
console.log(findShortestPath(4, 4, [0, 0], [3, 3], 'veumntbg'));

console.log('[?] What is the length of the longest path that reaches the vault?');
console.log(findLongestPath(4, 4, [0, 0], [3, 3], 'veumntbg').length);