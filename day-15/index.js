const fs = require('fs');
const input = fs.readFileSync('./day-15/input').toString('utf-8').split(/[\r\n]+/);

function parseDisks(diskInput) {
  let [_, diskId, positions, currentPosition] = 
    diskInput.match(/#(\d+) has (\d+).*.*position (\d+)/).map(m => parseInt(m, 10));
  return { diskId, positions, currentPosition };
}

function canDropAtTime(time, disks) {
  return disks.every((d, i) => {
    const capsuleAtDiskTime = time + i + 1;
    const diskPosition = (d.currentPosition + capsuleAtDiskTime) % d.positions;
    return diskPosition === 0;
  });
}

function findCorrectTimeForDrop(disks) {
  let time = 0;
  while (!canDropAtTime(time, disks)) {
    time++;
  }
  return time;
}

const disks = input.map(parseDisks);

console.log('[?] What is the first time you can press the button to get a capsule?')
console.log(findCorrectTimeForDrop(disks));

const disks2 = disks.concat([{ diskId: disks.length, positions: 11, currentPosition: 0 }]);

console.log('[?] What is the first time you can press the button to get another capsule?')
console.log(findCorrectTimeForDrop(disks2));