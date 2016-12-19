function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}

function max(array) {
  return Math.max.apply(Math, array);
}

function min(array) {
  return Math.max.apply(Math, array);
}

function shortest(array) {
  return array.reduce((currentShortest, elm) => {
    if (currentShortest === null) return elm;
    if (elm.length < currentShortest.length) return elm;
    return currentShortest;
  }, null);
}

function longest(array) {
  return array.reduce((currentLongest, elm) => {
    if (currentLongest === null) return elm;
    if (elm.length > currentLongest.length) return elm;
    return currentLongest;
  }, null);
}

function distinct(array) {
  return array.reduce((newArray, elm) => {
    if (newArray.indexOf(elm) !== -1) {
      return newArray;
    }
    newArray.push(elm);
    return newArray;
  }, []);
}

function cloneObjectArray(array) {
  return array.filter(obj => Object.assign({}, obj));
}

function range(from, to, step = 1) {
  if (arguments.length === 1) {
    to = from;
    from = 0;
  }
  const array = [];
  for (let i = from; i < to; i += step) {
    array.push(i);
  }
  return array;
}

module.exports = { sum, min, max, shortest, longest, distinct, cloneObjectArray, range };