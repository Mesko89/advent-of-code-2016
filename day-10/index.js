const fs = require('fs');
const { sum, max } = require('../utils/array');
const instructions = fs.readFileSync('./day-10/input').toString('utf-8').split(/[\r\n]+/);

const VALUE_SET_REGEX = /value (\d+) goes to bot (\d+)/;
const BOT_GIVES_REGEX = /bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)/;

const bots = {};
const outputs = {};

function getFactory() {
  const bots = {};
  const outputs = {};
  const valueSets = [];
  let onBotWorkingDispatch = () => {};
  
  function getBot(number) {
    if (number in bots) return bots[number];
    return bots[number] = {
      number,
      values: [],
      lowToType: null,
      lowIndex: null,
      highType: null,
      highIndex: null,
      isWaitingForWork: function () {
        return this.values.length === 2;
      },
      canDoWork: function () { 
        return this.values.length === 2 && 
          (
            (this.lowToType === 'bot' && getBot(this.lowIndex).values.length < 2) ||
            this.lowToType === 'output'
          ) && (
            (this.highToType === 'bot' && getBot(this.highIndex).values.length < 2) ||
            this.highToType === 'output'
          )
      },
      doWork: function () {
        onBotWorkingDispatch(this);
        const [value1, value2] = this.values;
        const lowValue = Math.min(value1, value2);
        const highValue = Math.max(value1, value2);
        
        if (this.lowToType === 'bot') {
          const lowBot = getBot(this.lowIndex);
          lowBot.values.push(lowValue);
          if (lowBot.canDoWork())
            lowBot.doWork();
        } else {
          setOutput(this.lowIndex, lowValue);
        }
        
        if (this.highToType === 'bot') {
          const highBot = getBot(this.highIndex);
          highBot.values.push(highValue);
          if (highBot.canDoWork())
            highBot.doWork();
        } else {
          setOutput(this.highIndex, highValue);
        }
        
        this.values = [];
      }
    };
  }

  function setOutput(number, value) {
    outputs[number] = value;
  }

  function run() {
    let clonedSetters = [...valueSets];
    let botsWaitingForWork = [];
    do {
      botsWaitingForWork.forEach(function (botNumber) {
        const bot = getBot(botNumber);
        if (bot.canDoWork()) {
          bot.doWork();
        }
      })
      clonedSetters = clonedSetters.filter((vs) => {
        const bot = getBot(vs.toBot);
        if (bot.values.length !== 2) {
          bot.values.push(vs.value);
          if (bot.canDoWork()) 
            bot.doWork();
          return false;
        }
        return true;
      });
      botsWaitingForWork = Object.keys(bots).filter((botNumber) => {
        const bot = getBot(botNumber);
        if (!bot.canDoWork() && bot.isWaitingForWork()) {
          return true;
        }
      });
    } while (clonedSetters.length || botsWaitingForWork.length);
  }

  function onBotWorking(f) {
    onBotWorkingDispatch = f;
  }

  return {
    bots,
    outputs,
    valueSets,
    getBot,
    run,
    onBotWorking
  }
}

function parseInstructions(instructions) {
  return instructions.reduce((factory, instruction) => {
    const valueSetMatches = instruction.match(VALUE_SET_REGEX);
    if (valueSetMatches !== null) {
      factory.valueSets.push({ 
        value: parseInt(valueSetMatches[1], 10),
        toBot: parseInt(valueSetMatches[2], 10)
      });
      return factory;
    }
    const [,bot, lowToType, lowIndex, highToType, highIndex] = instruction.match(BOT_GIVES_REGEX);
    const robot = factory.getBot(bot);
    Object.assign(robot, {
      lowToType, lowIndex: parseInt(lowIndex, 10),
      highToType, highIndex: parseInt(highIndex, 10)
    });
    return factory;
  }, getFactory())
}

const robotFactory = parseInstructions(instructions);
const searchingValues = [17, 61];
let foundBotNumber = null;
robotFactory.onBotWorking((bot) => {
  if (bot.values.every((v) => { return searchingValues.indexOf(v) !== -1; })) {
    foundBotNumber = bot.number;
  }
});

robotFactory.run();

console.log('[?] What is the number of the bot that is responsible for comparing value-61 microchips with value-17 microchips?');
console.log(foundBotNumber);

console.log('[?] What do you get if you multiply together the values of one chip in each of outputs 0, 1, and 2?');
console.log(robotFactory.outputs[0] * robotFactory.outputs[1] * robotFactory.outputs[2]);