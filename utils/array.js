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

module.exports = { sum, min, max, shortest, longest };