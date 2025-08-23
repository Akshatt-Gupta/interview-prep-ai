const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions)=>`
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If the answer needs a code example, add a small code block inside.
- Keep formatting very clean.
- Return a pure JSON array like:

[
  {
    "question": "Question here?",
    "answer": "Answer here."
  },
  ...
]

Important: Do NOT add any extra text. Only return valid JSON.
`;

const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:
- Explain the following interview question and its concept in depth as if you're teaching a beginner.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- Only include a code example if the question is for a developer, software engineer, SDE, or programming-related role. Do NOT include code for non-technical roles like bank manager, analyst, HR, etc.
- Keep the formatting very clean and clear.
- Return the result as a valid JSON object in the following format:

{
  "title": "Short title here",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

module.exports={
    questionAnswerPrompt,
    conceptExplainPrompt
};
