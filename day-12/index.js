const fs = require('fs');
const instructions = fs.readFileSync('./day-12/input').toString('utf-8').split(/[\r\n]+/);
const compile = require('../assembunny/compiler');

const cpu1 = compile(instructions);
cpu1.run();

console.log('[?] What value is left in register a?');
console.log(cpu1.readRegister('a'));

const cpu2 = compile(instructions, { c: 1 });
cpu2.run();

console.log('[?] If you instead initialize register c to be 1, what value is now left in register a?');
console.log(cpu2.readRegister('a'));