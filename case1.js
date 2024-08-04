function reverseAlphabetWithNumber(input) {
  const number = input.replace(/\D/g, ""); // Ambil angka
  const string = input.replace(/\d/g, ""); // Ambil huruf

  const reversedStringPart = string.split("").reverse().join("");

  return reversedStringPart + number;
}

const input = "NEGIE1";
const result = reverseAlphabetWithNumber(input);
console.log(result);
