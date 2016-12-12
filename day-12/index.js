const fs = require('fs');
const instructions = fs.readFileSync('./day-12/input').toString('utf-8').split(/[\r\n]+/);

function compile(instructions, initialRegisters) {
  const registers = Object.assign({ a: 0, b: 0, c: 0, d: 0}, initialRegisters);
  const program = instructions.map(i => i.split(' '));

  function getValue(v) {
    const vint = parseInt(v);
    return isNaN(vint) ? registers[v] : vint;
  }

  return {
    run: function run() {
      let i = 0;
      do {
        const [cmd, v1, v2] = program[i];
        switch(cmd) {
        case 'cpy':
          registers[v2] = getValue(v1);
          break;
        case 'inc':
          registers[v1]++;
          break;
        case 'dec':
          registers[v1]--;
          break;
        case 'jnz':
          if (getValue(v1) !== 0) {
            i += parseInt(v2);
            continue;
          }
          break;
        }
        i++;
        if (i > 100) break;
      } while(i < program.length);
    },
    readRegister: function readRegister(name) {
      return registers[name];
    }
  }
}

const cpu1 = compile(instructions);
cpu1.run();

console.log('[?] What value is left in register a?');
console.log(cpu1.readRegister('a'));

const cpu2 = compile(instructions, { c: 1 });
cpu2.run();

console.log('[?] If you instead initialize register c to be 1, what value is now left in register a?');
console.log(cpu2.readRegister('a'));