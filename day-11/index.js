const fs = require('fs');
const { sum, max } = require('../utils/array');
/*

The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.

 */
const floors = fs.readFileSync('./day-11/input').toString('utf-8')
  .split(/[\r\n]+/)
  .map((line) => {
    const microchipsMatches = line.match(/(\w+)\-compatible microchip/g);
    const microchips = microchipsMatches 
      ? microchipsMatches.map(m => m.match(/(\w+)\-compatible microchip/)[1])
      : [];
    const generatorsMatches = line.match(/(\w+) generator/g);
    const generators = generatorsMatches 
      ? generatorsMatches.map(m => m.match(/(\w+) generator/)[1])
      : [];
    console.log(microchips, generators)
  })
  ;