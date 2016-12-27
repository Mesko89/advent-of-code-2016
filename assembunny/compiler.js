module.exports = function compile(instructions, initialRegisters) {
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
        const optimizedForCommands = ['cpy', 'inc', 'dec', 'jnz', 'dec', 'jnz'];
        const validCommands = commands.every((c, i) => c[0] === optimizedForCommands[i]);
        if (!validCommands) return false;
        if (commands[5][2] !== '-5') return false;
        const tempRegister = commands[0][2];
        if (commands[2][1] !== tempRegister || commands[3][1] !== tempRegister) return false;
        if (commands[3][2] !== '-2') return false;
        const multiplier2 = commands[4][1];
        if (commands[5][1] !== multiplier2) return false;
        return true;
        // const optimizedFor = JSON.stringify([
        //   ['cpy', 'b', 'c'],
        //   ['inc', 'a'],
        //   ['dec', 'c'],
        //   ['jnz', 'c', '-2'],
        //   ['dec', 'd'],
        //   ['jnz', 'd', '-5']
        // ]);
      },
      run: (i) => {
        const commands = program.filter((p, k) => k >= i && k < i + 6);
        let a = getValue(commands[1][1]) + getValue(commands[0][1]) * getValue(commands[4][1]);
        registers[commands[1][1]] = a;
        registers[commands[0][2]] = 0;
        registers[commands[4][1]] = 0;
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
    run: function run(outputSignal = () => {}) {
      let i = 0;
      let forceStop = false;
      do {
        const optimization = getOptimization(i);
        if (optimization) {
          i += optimization.run(i);
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
              i += getValue(v2) || 1;
              continue;
            }
            break;
          case 'out':
            const signal = getValue(v1);
            forceStop = outputSignal(signal);
            break;
        }
        i++;
      } while (i < program.length && forceStop !== true);
    },
    readRegister: function readRegister(name) {
      return registers[name];
    },
    printRegisters: function printRegisters() {
      console.log(registers);
    }
  }
};