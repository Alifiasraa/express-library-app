function diagonalDifference(arr) {
  let a = 0;
  let b = 0;

  for (let i = 0; i < arr.length; i++) {
    a += arr[i][i];
    b += arr[i][arr[i].length - 1 - i];
  }

  return Math.abs(a - b);
}

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];
const result = diagonalDifference(matrix);
console.log(result);
