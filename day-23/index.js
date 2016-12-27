const fs = require('fs');
const instructions = fs.readFileSync('./day-23/input').toString('utf-8').split(/[\r\n]+/);
const compile = require('../assembunny/compiler');

const cpu1 = compile(instructions, { a: 7 }); // eggs
cpu1.run();

console.log('[?] What value should be sent to the safe?');
console.log(cpu1.readRegister('a'));

const cpu2 = compile(instructions, { a: 12 });
cpu2.run();

console.log('[?] What value should actually be sent to the safe?');
console.log(cpu2.readRegister('a'));