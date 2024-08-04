function countOccurrences(input, query) {
  const frequencyMap = {};

  input.forEach((word) => {
    if (frequencyMap[word]) {
      frequencyMap[word]++;
    } else {
      frequencyMap[word] = 1;
    }
  });

  const result = query.map((word) => frequencyMap[word] || 0);
  return result;
}

const input = ["xc", "dz", "bbb", "dz"];
const query = ["bbb", "ac", "dz"];

const output = countOccurrences(input, query);
console.log(output);
