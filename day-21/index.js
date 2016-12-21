const fs = require('fs');
const sourceCode = fs.readFileSync('./day-21/input').toString('utf-8').split(/[\r\n]+/);
const { permutation } = require('js-combinatorics');

function compile(sourceCode) {
  const Direction = { Left: 'left', Right: 'right' };

  function swapPositions(posA, posB) {
    posA = parseInt(posA, 10);
    posB = parseInt(posB, 10);
    const letterA = this[posA];
    const letterB = this[posB];
    return this.split('').map((c, i) => {
      return i === posA 
        ? letterB
        : i === posB
          ? letterA
          : c;
    }).join('');
  }

  function swapLetters(letterA, letterB) {
    return this.replace(letterA, '|').replace(letterB, letterA).replace('|', letterB);
  }

  function rotate(direction, times) {
    let i = parseInt(times, 10);
    const charArr = this.split('');
    while (i--) {
      if (direction === Direction.Right) {
        charArr.unshift(charArr.pop())
      } else {
        charArr.push(charArr.shift());
      }
    }
    return charArr.join('');
  }

  function rotateForIndexOfLetter(letter) {
    const index = this.indexOf(letter);
    const times = 1 + index + (index >= 4 ? 1 : 0);
    return rotate.call(this, Direction.Right, times);
  }
  
  function reverse(from, to) {
    from = parseInt(from, 10);
    to = parseInt(to, 10);
    const left = this.substring(0, from);
    const right = this.substring(to + 1);
    const middle = this.substring(from, to + 1).split('').reverse().join('');
    return left + middle + right;
  }

  function move(from, to) {
    from = parseInt(from, 10);
    to = parseInt(to, 10);
    const charArr = this.split('');
    const removed = charArr.splice(from, 1);
    charArr.splice(to, 0, removed);
    return charArr.join('');
  }

  const commandParsers = [
    {
      matches: (string) => string.match(/swap position (\d+) with position (\d+)/),
      action: swapPositions
    },
    {
      matches: (string) => string.match(/swap letter (\w) with letter (\w)/),
      action: swapLetters
    },
    {
      matches: (string) => string.match(/rotate (left|right) (\d+) steps?/),
      action: rotate
    },
    {
      matches: (string) => string.match(/rotate based on position of letter (\w)/),
      action: rotateForIndexOfLetter
    },
    {
      matches: (string) => string.match(/reverse positions (\d+) through (\d+)/),
      action: reverse
    },
    {
      matches: (string) => string.match(/move position (\d+) to position (\d+)/),
      action: move
    },
  ];

  return function run(input) {
    return sourceCode.reduce((output, line) => {
      commandParsers.some(p => {
        const matches = p.matches(line);
        if (matches !== null) {
          output = p.action.apply(output, matches.slice(1));
          return true;
        }
      })
      return output;
    }, input);
  };
}

const program = compile(sourceCode);
console.log('[?] What is the result of scrambling abcdefgh?');
console.log(program('abcdefgh'))

// Its fast enough ... :)
const permutations = permutation('abcdefgh'.split('')).toArray().map(v => v.join(''));
let unscrambled = null;
permutations.some(p => {
  const result = program(p);
  if (result === 'fbgdceah') {
    unscrambled = p;
    return true;
  }
});

console.log('[?] What is the un-scrambled version of the scrambled password fbgdceah?');
console.log(unscrambled)