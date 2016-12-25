const fs = require('fs');
const instructions = fs.readFileSync('./day-23/input').toString('utf-8').split(/[\r\n]+/);

function compile(instructions, initialRegisters) {
  const registers = Object.assign({ a: 0, b: 0, c: 0, d: 0 }, initialRegisters);
  const program = instructions.map(i => i.split(' '));

  function getValue(v) {
    const vint = parseInt(v);
    return isNaN(vint) ? registers[v] : vint;
  }

  function toggleInstructionAt(index) {
    const instruction = program[index];
    if (instruction) {
      const [cmd, v1, v2] = instruction;
      if (instruction.length === 2) {
        if (cmd === 'inc') {
          program[index] = ['dec', v1];
        } else {
          program[index] = ['inc', v1];
        }
      } else {
        if (cmd === 'jnz') {
          program[index] = ['cpy', v1, v2];
        } else {
          program[index] = ['jnz', v1, v2];
        }
      }
    }
  }

  const optimizations = [
    {
      isPossible: (i) => {
        const commands = program.filter((p, k) => k >= i && k < i + 6);
        const optimizedFor = JSON.stringify([
          ['cpy', 'b', 'c'],
          ['inc', 'a'],
          ['dec', 'c'],
          ['jnz', 'c', '-2'],
          ['dec', 'd'],
          ['jnz', 'd', '-5']
        ]);
        return JSON.stringify(commands) === optimizedFor;
      },
      run: (i) => {
        let a = getValue('a') + getValue('b') * getValue('d');
        registers['a'] = a;
        registers['c'] = 0;
        registers['d'] = 0;
        return 6;
      }
    },
    {
      isPossible: (i) => {
        const commands = program.filter((p, k) => k >= i && k < i + 3);
        const optimizedFor = JSON.stringify([
          ['inc', 'a'],
          ['dec', 'd'],
          ['jnz', 'd', '-2']
        ]);
        return JSON.stringify(commands) === optimizedFor;
      },
      run: (i) => {
        let a = getValue('a') + getValue('d');
        registers['a'] = a;
        registers['d'] = 0;
        return 3;
      }
    }
  ];

  function getOptimization(i) {
    let foundOptimization = null;
    optimizations.some(o => {
      if (o.isPossible(i)) {
        foundOptimization = o;
        return true;
      }
    });
    return foundOptimization;
  }

  return {
    run: function run() {
      let i = 0;
      do {
        const optimization = getOptimization(i);
        if (optimization) {
          i += optimization.run(registers);
          continue;
        }

        const [cmd, v1, v2] = program[i];

        switch (cmd) {
          case 'cpy':
            if (v2 in registers) {
              registers[v2] = getValue(v1);
            }
            break;
          case 'inc':
            if (v1 in registers) {
              registers[v1]++;
            }
            break;
          case 'dec':
            if (v1 in registers) {
              registers[v1]--;
            }
            break;
          case 'tgl':
            const instructionIndex = i + getValue(v1);
            toggleInstructionAt(instructionIndex);
            break;
          case 'jnz':
            if (getValue(v1) !== 0) {
              i += getValue(v2);
              continue;
            }
            break;
        }
        i++;
      } while (i < program.length);
    },
    readRegister: function readRegister(name) {
      return registers[name];
    },
    printRegisters: function printRegisters() {
      console.log(registers);
    }
  }
}

const cpu1 = compile(instructions, { a: 7 }); // eggs
cpu1.run();

console.log('[?] What value should be sent to the safe?');
console.log(cpu1.readRegister('a'));

const cpu2 = compile(instructions, { a: 12 });
cpu2.run();

console.log('[?] What value should actually be sent to the safe?');
console.log(cpu2.readRegister('a'));