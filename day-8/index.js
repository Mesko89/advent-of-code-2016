const fs = require('fs');
const { sum, max } = require('../utils/array');
const inputs = fs.readFileSync('./day-8/input').toString('utf-8').split(/[\r\n]+/);

function toInstruction(input) {
  const [command, ...other] = input.split(' ');
  if (command === 'rect') {
    const [width, height] = other[0].split('x');
    return { command, width, height };
  }
  const [what,,,times] = other;
  const [,whichOne] = other[1].split('=');
  return { command, what, whichOne, times: parseInt(times, 10) };
}

function getField(width, height) {
  const field = [];
  for (let i = 0; i < height; i++) {
    field[i] = [];
    for (let j = 0; j < width; j++) {
      field[i].push('.');
    }
  }
  return field;
}

function drawRect(width, height, field) {
  for (let i = 0; i < height; i++)
    for (let j = 0; j < width; j++)
      field[i][j] = '#';
}

function rotate(array, times) {
  for (let i = 0; i < times; i++) {
    const elm = array.pop();
    array.unshift(elm);
  }
  return array;
}

function rotateColumn(index, times, field) {
  
  function getColumn() {
    const column = [];
    for (let i = 0; i < field.length; i++)
      column.push(field[i][index]);
    return column;
  }

  function setColumn(newColumn) {
    for (let i = 0; i < field.length; i++)
      field[i][index] = newColumn[i]; 
  }
  
  setColumn(rotate(getColumn(), times));
}

function rotateRow(index, times, field) {
  
  function getRow() {
    const row = [];
    for (let i = 0; i < field[index].length; i++)
      row.push(field[index][i]); 
    return row;
  }

  function setRow(newRow) {
    for (let i = 0; i < field[index].length; i++)
      field[index][i] = newRow[i];
  }

  setRow(rotate(getRow(), times));
}

function runCommand(command, field) {
  if (command.command === 'rect') {
    drawRect(command.width, command.height, field);
  } else if (command.what === 'column') {
    rotateColumn(command.whichOne, command.times, field);
  } else {
    rotateRow(command.whichOne, command.times, field);
  }
}

const field = getField(50, 6);
inputs
  .map(toInstruction)
  .forEach(c => runCommand(c, field));

const litPixels = field.reduce((c, row) => {
  return c + row.reduce((c, pixel) => c + (pixel === '#' ? 1 : 0), 0);
}, 0)
console.log('[?] How many pixels should be lit?');
console.log(litPixels);

console.log('[?]  What code is the screen trying to display?');
console.log(field.map(a => a.join('')).join('\r\n'));