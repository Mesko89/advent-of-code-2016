const fs = require('fs');
const { range } = require('../utils/array');
const prohibitedRanges = fs.readFileSync('./day-20/input').toString('utf-8').split(/[\r\n]+/)
  .map((line) => {
    const [from, to] = line.split('-');
    return { from: parseInt(from, 10), to: parseInt(to, 10) };
  })
  .sort((a, b) => a.from - b.from);

function findAllAllowedIPs(prohibitedRanges) {
  let allowedIPs = [];
  let interval = { from: 0, to: 0 };
  prohibitedRanges.forEach((ipRange, i) => {
    if (i === 0 && ipRange.from > 0) {
      allowedIPs.push(0);
    } else if (ipRange.from > interval.to + 1) {
      allowedIPs = allowedIPs.concat(range(interval.to + 1, ipRange.from));
      interval.to = ipRange.to;
    } else if (interval.to < ipRange.to) {
      interval.to = ipRange.to;
    }
  })
  return allowedIPs;
}

const allowedIPs = findAllAllowedIPs(prohibitedRanges);

console.log('[?] What is the lowest-valued IP that is not blocked?');
console.log(allowedIPs[0]);

console.log('[?] How many IPs are allowed by the blacklist?');
console.log(allowedIPs.length);