/*
  Shared input check for the calculators.
  Input values arrive as strings, so this catches empty, non-numeric,
  zero and negative values in one place.
  Returns an error message to show beside the field, or "" when the value is fine.
*/
export function getPositiveNumberError(value) {
  const text = String(value).trim();

  if (text === "") {
    return "Please enter a number.";
  }

  const number = Number(text);

  if (!Number.isFinite(number)) {
    return "Please enter a valid number.";
  }

  if (number <= 0) {
    return "Please enter a number greater than 0.";
  }

  return "";
}
