const md5 = require('md5-hex');
const DOOR_ID = 'cxdnnyjw';

let password = '';
let i = 0;
const validHashes = [];
while(password.length < 8) {
  const hex = md5(`${DOOR_ID}${i}`);
  if (hex.indexOf('00000') === 0) {
    validHashes.push(hex);
    password += hex[5];
  }
  i++;
}

console.log('[?] What is the password?');
console.log(`Password is: ${password}`);

password = ['_','_','_','_','_','_','_','_'];
while(password.indexOf('_') !== -1) {
  const useCachedHash = validHashes.length > 0; 
  const hex = useCachedHash 
    ? validHashes.shift()
    : md5(`${DOOR_ID}${i}`);
  if (hex.indexOf('00000') === 0) {
    const charPosition = parseInt(hex[5], 10);
    console.log(hex, charPosition, isNaN(charPosition), password[charPosition])
    if (!isNaN(charPosition) && charPosition < password.length && password[charPosition] === '_') {
      password[charPosition] = hex[6];
    }
  }
  if (!useCachedHash)
    i++;
}

console.log('[?] What is second password?');
console.log(`Password is: ${password.join('')}`);