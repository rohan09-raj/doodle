export const getUnknownWord = (word) => {
  let size = word.length;
  let unknown = "";
  for (let i = 0; i < size; i++) {
    if (word[i] === "-" || word[i] === " ") unknown += word[i];
    else unknown += "_";
  }
  if (unknown === "_" || unknown === "") {
    return "_";
  }
  return unknown;
};
