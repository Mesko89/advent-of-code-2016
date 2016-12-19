const elvesTotal = 3001330;
const { range } = require('../utils/array');

let elves = range(1, elvesTotal + 1);
while (elves.length > 1) {
  const removeFirst = elves.length % 2 === 1;
  elves = elves.filter((_, i) => i % 2 === 0);
  if (removeFirst)
    elves.shift();
}

console.log('[?] Which Elf gets all the presents?');
console.log(elves[0]);

function optimized(elvesTotal) {
  let prevPowerOfThree = Math.pow(3, 0)
  let powerOfThree = Math.pow(3, 1)
  let i = 2;
  while (powerOfThree < elvesTotal) {
    prevPowerOfThree = powerOfThree;
    powerOfThree = Math.pow(3, i++);
  }
  if ((powerOfThree - prevPowerOfThree) / 2 > elvesTotal - prevPowerOfThree) {
    return elvesTotal - prevPowerOfThree;
  } else {
    return (prevPowerOfThree - (powerOfThree - elvesTotal)) * 2 + prevPowerOfThree;
  }
}

console.log('[?] Which Elf gets all the presents with second method?');
console.log(optimized(elvesTotal))