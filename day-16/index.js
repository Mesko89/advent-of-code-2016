function reverse(input) {
  const replaceWith = {'1': '0', '0': '1'};
  return input.replace(/\w/g, m => replaceWith[m]).split('').reverse().join('');
}

function createRandomLookingData(data, length) {
  while(data.length < length) {
    const a = data;
    const b = reverse(a);
    data = `${a}0${b}`;
  }
  return data.substring(0, length);
}

function calculateChecksum(data) {
  do {
    data = data
      .split('')
      .map(d => parseInt(d, 10))
      .reduce((checksum, bit, i, bits) => {
        if (i % 2 === 0) return checksum;
        return checksum + ((bit + bits[i - 1] + 1) % 2);
      }, '');
  } while (data.length % 2 === 0);
  return data;
}

console.log('[?] What is the correct checksum for disk of size 272?');
console.log(calculateChecksum(createRandomLookingData('10111011111001111', 272)));

console.log('[?] What is the correct checksum for disk of size 35651584?');
console.log(calculateChecksum(createRandomLookingData('10111011111001111', 35651584)));