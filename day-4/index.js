const fs = require('fs');
const { sum, max } = require('../utils/array');
const rooms = fs.readFileSync('./day-4/input').toString('utf-8').split(/[\r\n]+/);

function decodeRoom(room) {

  const [,encryptedName, sectorId, checksum] = room.match(/(.*)-(\d+)\[(.*)]/);

  function toChecksum(name) {
    function sortFunction(a, b) {
      if (a.length > b.length) {
        return -1;
      } else if (a.length < b.length) {
        return 1;
      } else {
        return a[0] < b[0] ? -1 : 1; 
      }
    }

    function toFrequencies(name) {
      return Object.values(name.split('').reduce((map, char) => {
        if (char in map) {
          map[char] += char;
        } else {
          map[char] = char
        }
        return map;
      }, {}));
    }

    return toFrequencies(name).sort(sortFunction).map(v => v[0]).join('');
  }

  function isNameValid(name, checksum) {
    return toChecksum(name).indexOf(checksum) === 0;
  }

  const isValid = isNameValid(encryptedName.replace(/-/g, ''), checksum);
  return { encryptedName, sectorId: parseInt(sectorId, 10), checksum, isValid };
}

function decryptRoom({ isValid, encryptedName, checksum, sectorId }) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  function shift(char, times) {
    const charIndex = alphabet.indexOf(char);
    return alphabet[(charIndex + times) % alphabet.length];
  }
  const decryptedName = encryptedName.split('').map(v => {
    return v === '-'
      ? ' '
      : shift(v, sectorId);
  }).join('');
  return { decryptedName, encryptedName, checksum, sectorId, isValid };
}

const validRooms = rooms.map(decodeRoom).filter(r => r.isValid);

console.log('[?] What is the sum of the sector IDs of the real rooms?');
console.log(`Sum of sector ids: ${sum(validRooms.map(r => r.sectorId))}`);

const decryptedRooms = validRooms.map(decryptRoom);
const northPoleSectorId = decryptedRooms
  .filter(r => r.decryptedName.indexOf('north') !== -1)[0]
  .sectorId;

console.log('[?] What is the sector ID of the room where North Pole objects are stored?');
console.log(`Sector ID of the room: ${northPoleSectorId}`);