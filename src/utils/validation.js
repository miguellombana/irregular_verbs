export function validateAnswer(input, correctForms) {
  // input ahora es un array de tres palabras
  if (!Array.isArray(input) || input.length !== 3) return false;
  return input.every((val, idx) =>
    val.trim().toLowerCase() === correctForms[idx].toLowerCase()
  );
}
