const fs = require('fs');
const input = fs.readFileSync('./day-2/input').toString('utf-8').split(/[\r\n]+/);
const simpleKeyboard = [[1,4,7], [2,5,8], [3,6,9]];
const uberKeyboard = [
  [void 0, void 0, 5, void 0, void 0],
  [void 0, 2, 6, 'A', void 0],
  [1, 3, 7, 'B', 'D'],
  [void 0, 4, 8, 'C', void 0],
  [void 0, void 0, 9, void 0, void 0]
]
const Directions = { 'U': [0, -1], 'L': [-1, 0], 'D': [0, 1], 'R': [1, 0] };

function decodeCode(instructions, startPosition, keyboard) {
  const finalPosition = instructions.reduce((currentPosition, instruction) => {
    const direction = Directions[instruction];
    const newPosition = [ currentPosition[0] + direction[0], currentPosition[1] + direction[1] ];
    return keyboard[newPosition[0]] && keyboard[newPosition[0]][newPosition[1]]
      ? newPosition
      : currentPosition;
  }, startPosition);
  return {
    position: finalPosition,
    code: keyboard[finalPosition[0]][finalPosition[1]]
  };
}

function decode(instructions, keyboard) {
  let currentPosition = [1, 1];
  return instructions.reduce((bathroomCode, instructionForCode) => {
    const { code, position } = decodeCode(instructionForCode.split(''), currentPosition, keyboard);
    currentPosition = position;
    return bathroomCode + code;
  }, '')
}

const bathroomCode = decode(input, simpleKeyboard);
console.log('[?] What is the bathroom code?');
console.log(`Bathroom code is: ${bathroomCode}`);

const uberBathroomCode = decode(input, uberKeyboard);
console.log('[?] What is the bathroom code from UBER keyboard?');
console.log(`Bathroom code is: ${uberBathroomCode}`);