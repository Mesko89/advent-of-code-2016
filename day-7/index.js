const fs = require('fs');
const ips = fs.readFileSync('./day-7/input').toString('utf-8').split(/[\r\n]+/);

function getHypernets(ip) {
  return ip.match(/\[\w+]/g).map(r => r.replace(/\[|]/g, ''));
}

function getSupernets(ip) {
  return ip.replace(/\[\w+]/g, '|').split('|');
}

function ipSupportsTLS(ip) {
  const hypernets = getHypernets(ip);
  const supernets = getSupernets(ip);

  function hasFourCharPalindrome(string) {
    let i = 0;
    let substr = string.substring(i, i+4);
    do {
      if (substr[0] === substr[3] && substr[1] === substr[2] && substr[0] !== substr[2])
        return true;
      i++;
      substr = string.substring(i, i+4);
    } while (substr.length === 4);
    return false;
  }

  return Array.from(hypernets).reduce((valid, hypernet) => {
    return valid && !hasFourCharPalindrome(hypernet);
  }, true) && supernets.reduce((valid, part) => {
    return valid || hasFourCharPalindrome(part);
  }, false);
}

function ipSupportsSSL(ip) {
  const hypernets = getHypernets(ip);
  const supernets = getSupernets(ip);

  function getThreeCharPalindromes(string) {
    const palindromes = [];
    let i = 0;
    let substr = string.substring(i, i+3);
    do {
      if (substr[0] === substr[2] && substr[0] !== substr[1])
        palindromes.push(substr);
      i++;
      substr = string.substring(i, i+3);
    } while (substr.length === 3);
    return palindromes;
  }

  const hypernetBABs = hypernets.reduce(
    (babs, hypernet) => babs.concat(getThreeCharPalindromes(hypernet)), []);
  const supernetABAs = supernets.reduce(
    (abas, supernet) => abas.concat(getThreeCharPalindromes(supernet)), []);

  return hypernetBABs.some(bab => {
    return supernetABAs.some(aba => aba[0] === bab[1] && aba[1] === bab[0]);
  });
}

const ipsSupportingTLS = ips.filter(ipSupportsTLS);

console.log('[?] How many IPs in your puzzle input support TLS?');
console.log(ipsSupportingTLS.length);

const ipsSupportingSSL = ips.filter(ipSupportsSSL);
console.log('[?] How many IPs in your puzzle input support SSL?');
console.log(ipsSupportingSSL.length);