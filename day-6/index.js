const fs = require('fs');
const { shortest, longest } = require('../utils/array');
const rows = fs.readFileSync('./day-6/input').toString('utf-8').split(/[\r\n]+/);

const messageLength = rows[0].length;
const frequencies = [];
for (let i = 0; i < messageLength; i++) frequencies.push({});

rows.forEach((row) => {
  row.split('').forEach((c, i) => {
    if (c in frequencies[i]) {
      frequencies[i][c] += c;
    } else {
      frequencies[i][c] = c;
    }
  })
});

const correctedMessage = frequencies.map(f => longest(Object.values(f))[0]).join('');

console.log('[?] What is the error-corrected version of the message being sent?');
console.log(`Error corrected message: ${correctedMessage}`);

const originalMessage = frequencies.map(f => shortest(Object.values(f))[0]).join('');

console.log('[?] What is the original message that Santa is trying to send?');
console.log(`Error corrected message: ${originalMessage}`);