const fs = require('fs');
const { sum, max } = require('../utils/array');
const input = fs.readFileSync('./day-9/input').toString('utf-8');

function decompressedLength(input, version = '1') {
  let i = 0;
  let c = 0;
  while (i < input.length) {
    if (input[i] !== '(') {
      c++;
      i++;
      continue;
    } 

    const command = input.substring(i + 1, input.indexOf(')', i));
    const [ length, times ] = command.split('x').map(v => parseInt(v, 10));
    i = input.indexOf(')', i) + length;
    const furtherDecompressLength = version === '2'
      ? decompressedLength(input.substring(i - length + 1, i + 1), version)
      : length;
    c += furtherDecompressLength * times;
    i++;
  }
  return c;
}

console.log('[?] What is the decompressed length of the file (your puzzle input)?');
console.log(decompressedLength(input));

console.log('[?] What is the decompressed length of the file using this improved format?');
console.log(decompressedLength(input, '2'));