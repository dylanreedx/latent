export function convertToJSON(questionsArray: string[]): object {
  // Join the array elements into a single string
  let questionsString = questionsArray.join("");

  // Find the indices of the first opening and the corresponding closing bracket
  let firstOpeningBracketIndex = questionsString.indexOf("[");
  let firstClosingBracketIndex = questionsString.lastIndexOf("]");

  // Extract the JSON substring from the first opening bracket to the corresponding closing one
  let jsonSubstring = questionsString.substring(
    firstOpeningBracketIndex,
    firstClosingBracketIndex + 1,
  );

  // Try to parse the JSON substring. If it fails, return an error.
  try {
    let formattedQuestions = JSON.parse(jsonSubstring);
    return { questions: formattedQuestions };
  } catch (error) {
    console.error("Error parsing questions JSON:", error);
    return { error: "Failed to parse questions into JSON." };
  }
}
