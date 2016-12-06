function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}

function max(array) {
  return Math.max.apply(Math, array);
}

module.exports = { sum, max };