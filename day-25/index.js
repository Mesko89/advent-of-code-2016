const fs = require('fs');
const instructions = fs.readFileSync('./day-25/input').toString('utf-8').split(/[\r\n]+/);
const compile = require('../assembunny/compiler');

function findSmallestA() {
  let a = 0;
  const threshold = 20;
  do {
    let signal = '';
    const app = compile(instructions, { a });
    app.run((s) => {
      if (s !== 0 && s !== 1) return true; // stop program
      signal += s;
      if (signal.length > threshold) return true;
      if (signal.length > 1) {
        return signal[signal.length - 1] === signal[signal.length - 2];
      }
    });
    if (signal.length > threshold) return a;
    a++;
  } while(true);
}

console.log(
  '[?] What is the lowest positive integer that can be used to initialize register a and cause ' + 
  'the code to output a clock signal of 0, 1, 0, 1... repeating forever?'
);
console.log(findSmallestA());