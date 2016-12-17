const md5 = require('md5-hex');

function getOneTimePadKeys(input, hashFn = md5) {
  const tripletsRegex = /(\w)\1{2}/;
  const keys = [];
  const hashMap = {};

  function getHash(index) {
    if (!(index in hashMap)) hashMap[index] = hashFn(input + index);
    return hashMap[index];
  }

  function isOneTimePadKey(character, i) {
    const quintruplet = character.repeat(5);
    for (let j = i + 1; j < i + 1001; j++) {
      const hash = getHash(j);
      if (hash.indexOf(quintruplet) !== -1) return true;
    }
    return false;
  }

  let i = 0;
  while(keys.length !== 64) {
    const hash = getHash(i);
    const matches = hash.match(tripletsRegex);
    if (matches) {
      if (isOneTimePadKey(matches[1], i)) {
        keys.push({ index: i, hash });
      }
    }
    delete hashMap[i]; // save some memory would you?
    i++;
  }
  return keys;
}

console.log('[?] What index produces your 64th one-time pad key?');
console.log(getOneTimePadKeys('cuanljph')[63].index);

const advancedHash = (input) => {
  let hash = md5(input);
  for (let i = 0; i < 2016; i++) 
    hash = md5(hash);
  return hash;
}
console.log('[?] What index now produces your 64th one-time pad key?');
console.log(getOneTimePadKeys('cuanljph', advancedHash)[63].index);