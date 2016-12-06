const fs = require('fs');
const { sum, max } = require('../utils/array');
const lines = fs.readFileSync('./day-3/input').toString('utf-8').split(/[\r\n]+/);
let triangles = lines.map(l => l.trim().split(/\s+/).map(v => parseInt(v, 10)));

function isPossibleTriangle(lengths) {
  return sum(lengths) - 2 * max(lengths) > 0;
}

const possibleTriangles = triangles.filter(isPossibleTriangle);

console.log('[?] How many of the listed triangles are possible?');
console.log(`Possible triangles: ${possibleTriangles.length}`);

const verticalTriangles = [];
let triangle = [];
for (var i = 0; i < triangles[0].length; i++) {
  for (var j = 0; j < triangles.length; j++) {
    triangle.push(triangles[j][i]);
    if (triangle.length === 3) {
      verticalTriangles.push(triangle);
      triangle = [];
    }
  }
}

const possibleVerticalTriangles = verticalTriangles.filter(isPossibleTriangle);

console.log('[?] How many of the listed triangles are possible if you read values vertically?');
console.log(`Possible triangles: ${possibleVerticalTriangles.length}`);